"use client";
import { useState, useEffect } from "react";
import { getLecturers } from "@/lib/lecturersApi";
import DataTableView from "@/components/views/DataTableView";
import AddLecturerModal from "@/components/lecturer/AddLecturerModal";
import { Button } from "@/components/utils/Buttons";
import { FaPlus } from "react-icons/fa";
import Hint from "@/components/utils/Hint";

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
        setTotalPages(data.page.totalPages);
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
  }, [searchQuery, page, pageSize]);

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
              className={`border border-gray-300 rounded-lg px-3 py-1.5 mt-1 text-md ${
                lecturers.length === 0 && searchQuery.length === 0
                  ? "opacity-50 cursor-not-allowed hidden"
                  : ""
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Hint hint="Dodaj prowadzących do systemu. Będziesz mógł ich później przydzielić do grup zajęciowych." />
          </>
        }
        loading={loading}
        error={error}
        data={lecturers}
        columns={columns}
        whereNavigate={""}
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
