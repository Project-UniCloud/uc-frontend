"use client";
import MyLineChart from "@/components/dahsboard/LineChart";
import SummaryStats from "@/components/dahsboard/SummaryStats";
import PieChart from "@/components/dahsboard/PieChart";
import CostBarChart from "@/components/dahsboard/CostBarChart";
import { useDashboardPage } from "@/lib/views/dashboard/hooks";
import { usePermissions } from "@/hooks/usePermissions";

export default function DashboardPage() {

  const {
    loading,
    error,
    overallStats,
    costPerGroup,
    costPerResourceType,
    costInTime,
  } = useDashboardPage();

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full">
      <div className="grid grid-cols-2 gap-10 w-full h-full ">
        <MyLineChart data={costInTime} />
        <SummaryStats stats={overallStats} />
        <CostBarChart data={costPerGroup} />
        <PieChart data={costPerResourceType} />
      </div>
    </div>
  );
}
