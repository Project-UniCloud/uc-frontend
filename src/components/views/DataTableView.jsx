import React from "react";
import Table from "@/components/table/Table";
import Pagination from "@/components/pagination/Pagination";
import { useEffect } from "react";

export default function DataTableView({
  leftActions,
  rightActions,
  loading,
  error,
  data,
  columns,
  whereNavigate,
  idKey,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  emptyMessage = "Brak danych do wyświetlenia",
}) {
  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        {leftActions}
        <div className="ml-auto">{rightActions}</div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        <>
          {!data || data.length === 0 ? (
            <div className="text-gray-500">{emptyMessage}</div>
          ) : (
            <>
              <Table
                columns={columns}
                data={data}
                whereNavigate={whereNavigate}
                idKey={idKey}
              />
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
