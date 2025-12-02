"use client";
import { useState, useEffect } from "react";
import { getLecturers } from "@/lib/lecturersApi";
// Table import removed — use DataTableView for presentation
import DataTableView from "@/components/views/DataTableView";
import AddLecturerModal from "@/components/lecturer/AddLecturerModal";
import { Button } from "@/components/utils/Buttons";
import { FaPlus } from "react-icons/fa";

const columns = [
  { key: "login", header: "ID/Login" },
  { key: "firstName", header: "Imię" },
  { key: "lastName", header: "Nazwisko" },
  { key: "email", header: "Mail" },
];

export default function ListLecturersPage() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLecturers = () => {
    setLoading(true);
    setError(null);
    getLecturers({ searchQuery, page, pageSize })
      .then((data) => {
        // Każdemu wierszowi nadaj 'id' równe 'uuid'
        const content = (data.content || []).map((item) => ({
          ...item,
          id: item.uuid,
          groupId: item.uuid, // <-- WAŻNE
        }));
        setLecturers(content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLecturers();
    // eslint-disable-next-line
  }, [searchQuery]);

  return (
    <div className="min-w-120">
      <AddLecturerModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLecturerAdded={fetchLecturers}
      />

      <DataTableView
        leftActions={
          <>
            <Button onClick={() => setIsOpen(true)}>
              <FaPlus />
              Dodaj Prowadzącego
            </Button>
            <input
              type="text"
              placeholder="Szukaj prowadzącego"
              className={`border border-gray-300 rounded-lg px-3 py-1.5 text-md ${
                lecturers.length === 0 && searchQuery.length === 0
                  ? "opacity-50 cursor-not-allowed hidden"
                  : ""
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </>
        }
        loading={loading}
        error={error}
        data={lecturers}
        columns={columns}
        whereNavigate={"list-lecturers"}
        idKey={"id"}
        emptyMessage={"Brak prowadzących"}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
