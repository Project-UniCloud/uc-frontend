"use client";
import React from "react";
import DataTableView from "@/components/views/DataTableView";
import Hint from "@/components/utils/Hint";
import { useLogsPage } from "@/lib/views/logs/hooks";
import { columns } from "@/lib/views/logs/columns";

export default function LogsPage() {
  const {
    logs,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
  } = useLogsPage();

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
        data={logs}
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
