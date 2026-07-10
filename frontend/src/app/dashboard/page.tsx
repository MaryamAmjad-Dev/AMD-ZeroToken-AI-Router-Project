import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardView from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <DashboardShell theme="command">
      <DashboardView />
    </DashboardShell>
  );
}
