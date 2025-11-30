"use client";
import {useEffect, useState} from "react";
import Table from "@/components/table/Table";
import Pagination from "@/components/pagination/Pagination";
import {getCloudAccesses} from "@/lib/cloudApi";

const columns = [
  { key: "cloudConnectorName", header: "Nazwa" },
  { key: "costLimit", header: "Limit Kosztu" },
  { key: "defaultCronExpression", header: "Wyczyść" },
];

export default function GroupsPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getCloudAccesses({ page, pageSize })
      .then((data) => {
        setDrivers(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [page, pageSize]);

  const tableData = drivers.map((driver, idx) => ({
    ...driver,
    id: idx + 1,
  }));

  return (
    <div className="min-w-120 mt-15">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && drivers.length === 0 && (
        <div className="text-gray-500">Brak sterowników do wyświetlenia</div>
      )}

      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        !error &&
        drivers.length > 0 && (
          <>
            <Table
              columns={columns}
              data={tableData}
              whereNavigate="drivers"
              idKey={"cloudConnectorId"}
            />

            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          </>
        )
      )}
    </div>
  );
}
