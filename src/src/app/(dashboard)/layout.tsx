import { AppShell } from "@/components/shell/app-shell";
import { SessionGate } from "@/components/shell/session-gate";
import { CommandPalette } from "@/components/ui/command-palette";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate>
      <AppShell>{children}</AppShell>
      <CommandPalette />
    </SessionGate>
  );
}
