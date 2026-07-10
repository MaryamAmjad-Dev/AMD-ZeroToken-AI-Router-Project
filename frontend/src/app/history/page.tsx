import DashboardShell from "@/components/dashboard/DashboardShell";
import HistoryView from "@/components/history/HistoryView";

export default function HistoryPage() {
  return (
    <DashboardShell theme="history">
      <HistoryView />
    </DashboardShell>
  );
}
