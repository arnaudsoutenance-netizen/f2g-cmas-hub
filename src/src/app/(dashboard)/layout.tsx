import { AppShell } from "@/components/shell/app-shell";
import { SessionGate } from "@/components/shell/session-gate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate>
      <AppShell>{children}</AppShell>
    </SessionGate>
  );
}
