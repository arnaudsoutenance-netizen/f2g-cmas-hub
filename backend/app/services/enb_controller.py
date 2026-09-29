"""
F2G CMAS Hub - eNodeB Controller Service
Handles SIB12 config generation and hot-reload via SSH
"""
import asyncio
import paramiko
from typing import Optional
from datetime import datetime, timezone
import logging
import random

from app.models import Alert, CellSite, AlertCell
from app.core.config import settings

logger = logging.getLogger(__name__)


class SIB12Generator:
    """Generate SIB12 configuration for srsRAN."""
    
    # Warning type mapping
    WARNING_TYPES = {
        "ETWS": {
            4352: 0,  # Earthquake
            4353: 1,  # Tsunami
            4354: 2,  # Earthquake + Tsunami
            4355: 3,  # Test
        },
        "CMAS": 3,  # Default for CMAS
    }
    
    @staticmethod
    def generate_serial_number() -> int:
        """Generate serial number with geographic scope and message code."""
        geo_scope = 0x30  # Cell-wide
        message_code = random.randint(0, 255)
        return (geo_scope << 8) | message_code
    
    @staticmethod
    def get_warning_type(alert: Alert) -> int:
        """Get warning type based on alert type and message ID."""
        if alert.alert_type.value == "ETWS":
            return SIB12Generator.WARNING_TYPES["ETWS"].get(alert.message_id, 3)
        return SIB12Generator.WARNING_TYPES["CMAS"]
    
    @staticmethod
    def escape_string(s: str) -> str:
        """Escape special characters for config file."""
        return s.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
    
    @staticmethod
    def generate(alert: Alert) -> str:
        """Generate SIB12 configuration string."""
        serial_number = SIB12Generator.generate_serial_number()
        warning_type = SIB12Generator.get_warning_type(alert)
        num_pages = max(1, (len(alert.content) + 92) // 93)  # 93 chars per page
        
        config = f"""
sib12 =
{{
  message_identifier = {alert.message_id};
  serial_number = {serial_number};
  warning_type = {warning_type};
  data_coding_scheme = 0x01;
  warning_message = "{SIB12Generator.escape_string(alert.content)}";
  number_of_pages = {num_pages};
  cb_data = "";
}};
""".strip()
        
        return config


class ENBController:
    """Controller for eNodeB operations via SSH."""
    
    def __init__(self, cell: CellSite, ssh_key_path: Optional[str] = None):
        self.cell = cell
        self.ssh_key_path = ssh_key_path
        self.client: Optional[paramiko.SSHClient] = None
    
    async def connect(self) -> bool:
        """Establish SSH connection to eNB."""
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            # Connect with timeout
            connect_kwargs = {
                "hostname": self.cell.enb_ip,
                "port": self.cell.enb_port,
                "username": self.cell.enb_username,
                "timeout": settings.ENB_SSH_TIMEOUT,
            }
            
            if self.ssh_key_path:
                connect_kwargs["key_filename"] = self.ssh_key_path
            else:
                # Use SSH agent or default key
                connect_kwargs["allow_agent"] = True
                connect_kwargs["look_for_keys"] = True
            
            # Run in thread pool to not block async event loop
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, lambda: self.client.connect(**connect_kwargs))
            
            logger.info(f"Connected to eNB {self.cell.name} ({self.cell.enb_ip})")
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to eNB {self.cell.name}: {e}")
            return False
    
    async def disconnect(self):
        """Close SSH connection."""
        if self.client:
            self.client.close()
            self.client = None
    
    async def upload_config(self, config: str) -> bool:
        """Upload SIB12 configuration to eNB."""
        if not self.client:
            raise RuntimeError("Not connected to eNB")
        
        try:
            sftp = self.client.open_sftp()
            config_path = self.cell.enb_config_path
            
            # Backup existing config
            backup_path = f"{config_path}.backup"
            try:
                sftp.rename(config_path, backup_path)
            except IOError:
                pass  # File may not exist
            
            # Write new config
            with sftp.file(config_path, "w") as f:
                f.write(config)
            
            sftp.close()
            logger.info(f"Uploaded config to {self.cell.name}:{config_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to upload config to {self.cell.name}: {e}")
            return False
    
    async def reload_config(self) -> bool:
        """Send SIGHUP to srsENB to reload configuration."""
        if not self.client:
            raise RuntimeError("Not connected to eNB")
        
        try:
            # Find srsENB process and send SIGHUP
            cmd = """
            PID=$(pgrep -f srsenb)
            if [ -n "$PID" ]; then
                kill -SIGHUP $PID
                echo "SIGHUP sent to PID $PID"
                exit 0
            else
                echo "ERROR: srsenb not running"
                exit 1
            fi
            """
            
            loop = asyncio.get_event_loop()
            stdin, stdout, stderr = await loop.run_in_executor(
                None, lambda: self.client.exec_command(cmd)
            )
            
            exit_status = stdout.channel.recv_exit_status()
            output = stdout.read().decode().strip()
            
            if exit_status == 0:
                logger.info(f"Config reloaded on {self.cell.name}: {output}")
                return True
            else:
                logger.error(f"Failed to reload config on {self.cell.name}: {output}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to reload config on {self.cell.name}: {e}")
            return False
    
    async def get_status(self) -> dict:
        """Get eNB status information."""
        if not self.client:
            await self.connect()
        
        try:
            cmd = """
            PID=$(pgrep -f srsenb)
            if [ -n "$PID" ]; then
                echo "running"
                echo "$PID"
                ps -p $PID -o etime= 2>/dev/null | tr -d ' '
            else
                echo "stopped"
            fi
            """
            
            loop = asyncio.get_event_loop()
            stdin, stdout, stderr = await loop.run_in_executor(
                None, lambda: self.client.exec_command(cmd)
            )
            
            lines = stdout.read().decode().strip().split('\n')
            
            if lines[0] == "running":
                return {
                    "running": True,
                    "pid": lines[1] if len(lines) > 1 else None,
                    "uptime": lines[2] if len(lines) > 2 else None,
                }
            else:
                return {"running": False}
                
        except Exception as e:
            logger.error(f"Failed to get status from {self.cell.name}: {e}")
            return {"running": False, "error": str(e)}


class AlertDispatcher:
    """Service to dispatch alerts to eNodeBs."""
    
    @staticmethod
    async def dispatch_to_cell(alert: Alert, cell: CellSite, alert_cell: AlertCell) -> bool:
        """Dispatch an alert to a single cell."""
        controller = ENBController(cell)
        
        try:
            # Connect
            if not await controller.connect():
                alert_cell.status = "failed"
                alert_cell.error_message = "Failed to connect to eNB"
                return False
            
            # Generate and upload config
            config = SIB12Generator.generate(alert)
            if not await controller.upload_config(config):
                alert_cell.status = "failed"
                alert_cell.error_message = "Failed to upload config"
                return False
            
            # Reload config
            if not await controller.reload_config():
                alert_cell.status = "failed"
                alert_cell.error_message = "Failed to reload config"
                return False
            
            # Success
            alert_cell.status = "sent"
            alert_cell.sent_at = datetime.now(timezone.utc)
            logger.info(f"Alert {alert.id} dispatched to cell {cell.name}")
            return True
            
        except Exception as e:
            alert_cell.status = "failed"
            alert_cell.error_message = str(e)
            logger.error(f"Failed to dispatch alert {alert.id} to cell {cell.name}: {e}")
            return False
            
        finally:
            await controller.disconnect()
    
    @staticmethod
    async def dispatch_alert(alert: Alert, cells: list[tuple[CellSite, AlertCell]]) -> dict:
        """
        Dispatch an alert to multiple cells.
        Returns dict with success/failure counts.
        """
        results = {"success": 0, "failed": 0, "cells": []}
        
        # Dispatch to all cells concurrently
        tasks = [
            AlertDispatcher.dispatch_to_cell(alert, cell, alert_cell)
            for cell, alert_cell in cells
        ]
        
        outcomes = await asyncio.gather(*tasks, return_exceptions=True)
        
        for (cell, alert_cell), outcome in zip(cells, outcomes):
            if isinstance(outcome, Exception):
                results["failed"] += 1
                results["cells"].append({
                    "cell_id": cell.id,
                    "name": cell.name,
                    "status": "failed",
                    "error": str(outcome)
                })
            elif outcome:
                results["success"] += 1
                results["cells"].append({
                    "cell_id": cell.id,
                    "name": cell.name,
                    "status": "sent"
                })
            else:
                results["failed"] += 1
                results["cells"].append({
                    "cell_id": cell.id,
                    "name": cell.name,
                    "status": "failed",
                    "error": alert_cell.error_message
                })
        
        return results
