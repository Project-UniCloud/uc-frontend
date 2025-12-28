"use client";
import React, { useEffect, useState } from "react";
// import { getLogs } from "@/lib/logsApi"; // temporarily disabled (no backend)
import DataTableView from "@/components/views/DataTableView";
import Hint from "@/components/utils/Hint";

const columns = [
  { key: "date", header: "Data" },
  { key: "operation", header: "Operacja" },
  { key: "group", header: "Grupa" },
  { key: "details", header: "Szczegóły" },
  { key: "status", header: "Status" },
];

// Static mock data used until backend logs endpoint is available
const staticLogsData = [
  {
    date: "2025-12-27 14:05",
    operation: "CreateResource",
    group: "Grupa A",
    details: "Utworzono instancję EC2 (t3.micro)",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 14:12",
    operation: "DeleteStudent",
    group: "Grupa B",
    details: "Usunięto studenta: jan.kowalski",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 15:01",
    operation: "AssignPolicy",
    group: "Grupa A",
    details: "Przypisano politykę S3 readonly",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 16:20",
    operation: "ScaleUp",
    group: "Grupa C",
    details: "Zwiększono limit kosztów do 50 PLN",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 16:45",
    operation: "CreateUser",
    group: "Grupa D",
    details: "Utworzono konto: anna.nowak",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 17:02",
    operation: "ProvisionS3",
    group: "Grupa A",
    details: "Założono bucket: grupa-a-labs",
    status: "FAILED",
  },
  {
    date: "2025-12-27 18:10",
    operation: "RotatePassword",
    group: "Grupa B",
    details: "Zmieniono hasło dla studenta: m.pawlak",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 18:30",
    operation: "TagResources",
    group: "Grupa C",
    details: "Dodano tagi: {owner=grupa-c, course=cloud}",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 19:05",
    operation: "DeleteResource",
    group: "Grupa D",
    details: "Usunięto instancję EC2 (t3.small)",
    status: "SUCCESS",
  },
  {
    date: "2025-12-27 19:20",
    operation: "SetNotificationLevel",
    group: "Grupa A",
    details: "Ustawiono poziom powiadomień: 2",
    status: "SUCCESS",
  },
];

export default function LogsPage() {
  const [logsData, setLogsData] = useState(staticLogsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   setLoading(true);
  //   setError(null);
  //   getLogs({ page, pageSize })
  //     .then((data) => {
  //       setLogsData(data.content || []);
  //       setTotalPages(data.page.totalPages || 0);
  //     })
  //     .catch((error) => setError(error.message))
  //     .finally(() => setLoading(false));
  // }, [page, pageSize]);

  const tableData = logsData.map((log, idx) => ({
    ...log,
    id: idx + 1,
  }));

  return (
    <div className="min-w-120">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <Hint className="mb-4">
        Strona z logami przedstawia historię działań w systemie, umożliwiając
        monitorowanie i analizę operacji wykonywanych przez użytkowników.
      </Hint>
      <DataTableView
        loading={loading}
        error={error}
        data={tableData}
        columns={columns}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
