import React from "react";

export default function Pagination({
  page,
  setPage,
  totalPages,
  pageSize,
  setPageSize,
  pageSizeOptions = [10, 20, 50],
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-x-2">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className={`px-2 py-1 rounded-lg disabled:opacity-50 ${
            page > 0 ? "hover:bg-gray-200 cursor-pointer" : ""
          }`}
        >
          Poprzednia
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded-lg ${
              page === i
                ? "bg-purple text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black cursor-pointer"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
          className={`px-2 py-1 rounded-lg disabled:opacity-50 ${
            page < totalPages - 1 ? "hover:bg-gray-200 cursor-pointer" : ""
          }`}
        >
          Następna
        </button>
      </div>
      <div>
        Wyświetl:&nbsp;
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="rounded-lg px-2 py-1 bg-gray-200 cursor-pointer"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
