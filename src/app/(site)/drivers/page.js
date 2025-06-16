"use client";
import { useState, useEffect } from "react";
import { getDrivers } from "@/lib/driversApi";
import Table from "@/components/table/Table";
import Pagination from "@/components/pagination/Pagination";
import { useRef } from "react";

const columns = [
  { key: "name", header: "Nazwa" },
  { key: "costLimit", header: "Limit Kosztu" },
  { key: "clean", header: "Wyczyść" },
];

export default function GroupsPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDrivers({ page, pageSize, driverName: search })
      .then((data) => {
        setDrivers(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [page, pageSize, search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [search]);

  const tableData = drivers.map((driver, idx) => ({
    ...driver,
    id: idx + 1,
  }));

  const onSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  return (
    <div className="min-w-120">
      <div className="flex items-center gap-5 mb-5">
        <input
          type="text"
          ref={inputRef}
          placeholder="Szukaj sterownika"
          value={search}
          onChange={onSearchChange}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-md"
        />
      </div>

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
            <Table columns={columns} data={tableData} />

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
