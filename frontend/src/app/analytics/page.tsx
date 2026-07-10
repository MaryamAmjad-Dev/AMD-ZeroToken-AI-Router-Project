import DashboardShell from "@/components/dashboard/DashboardShell";
import AnalyticsView from "@/components/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <DashboardShell theme="analytics">
      <AnalyticsView />
    </DashboardShell>
  );
}
