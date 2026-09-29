"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Server,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive browser notifications for new alerts
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get email for critical system events
                </p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="admin@f2g.cm"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Admin" />
            </div>
            <Button variant="outline" size="sm">
              Change password
            </Button>
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              System
            </CardTitle>
            <CardDescription>Backend and API configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API URL</Label>
              <Input
                value={process.env.NEXT_PUBLIC_API_URL || "Not configured"}
                disabled
                className="font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>Backend:</span>
                <span className="text-st-sent-fg font-medium">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
            <CardDescription>
              Security settings and access control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Enable 2FA
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Session management</p>
                <p className="text-xs text-muted-foreground mt-1">
                  View and manage your active sessions
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  View sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
