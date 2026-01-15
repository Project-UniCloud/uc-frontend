"use client";

import { useAsync, usePagination } from "@/lib/views/shared/hooks";
import { getLogs } from "@/lib/api/logsApi";

function safeDetailsString(details) {
  if (!details || typeof details !== "object") return "-";

  const entries = Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}: ${String(value)}`);

  return entries.length ? entries.join(", ") : "-";
}

export function useLogsPage() {
  const { page, setPage, pageSize, setPageSize, totalPages, setTotalPages } =
    usePagination();

  const {
    data: logs = [],
    loading,
    error,
    run: fetchLogs,
  } = useAsync(
    () =>
      getLogs({ page, pageSize }).then((data) => {
        setTotalPages(data?.page?.totalPages ?? 0);
        return (data?.content ?? []).map((log) => ({
          id: log?.id,
          date: log?.occurredAt
            ? new Date(log.occurredAt).toLocaleString()
            : "-",
          action: log?.action ?? "-",
          actor: log?.actor ?? "-",
          groupId: log?.details?.groupId ?? "-",
          details: safeDetailsString(log?.details),
        }));
      }),
    [page, pageSize, setTotalPages],
    { initialData: [] }
  );

  return {
    logs,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchLogs,
  };
}
