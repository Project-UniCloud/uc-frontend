"use client";
import MyLineChart from "@/components/dahsboard/LineChart";
import SummaryStats from "@/components/dahsboard/SummaryStats";
import PieChart from "@/components/dahsboard/PieChart";
import CostBarChart from "@/components/dahsboard/CostBarChart";
import TopCostGroups from "@/components/dahsboard/TopCostGroups";
import {
  getOverallStats,
  getCostInTime,
  getCostPerResourceType,
  getCostPerGroup,
} from "@/lib/statisticsApi";
import { useEffect, useState } from "react";
import objectToArray from "@/lib/utils/statsToArray";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [costPerGroup, setCostPerGroup] = useState([]);
  const [costPerResourceType, setCostPerResourceType] = useState([]);
  const [costInTime, setCostInTime] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOverallStats()
      .then((data) => {
        setOverallStats(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });

    getCostPerGroup()
      .then((data) => {
        setCostPerGroup(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });

    getCostPerResourceType()
      .then((data) => {
        setCostPerResourceType(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
    getCostInTime()
      .then((data) => {
        setCostInTime(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full">
      <div className="grid grid-cols-2 gap-10 w-full h-full ">
        <MyLineChart data={costInTime} />
        <SummaryStats stats={overallStats} />
        <CostBarChart data={costPerGroup} />
        <PieChart data={costPerResourceType} />
      </div>

      {/* <TopCostGroups /> */}
    </div>
  );
}
