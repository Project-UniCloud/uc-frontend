"use client";
import { useState, useEffect } from "react";
import { getLecturers } from "@/lib/lecturersApi";
import Tabs from "@/components/Tabs";
import Table from "@/components/Table";
import { FaPlus } from "react-icons/fa";
import AddLecturerModal from "@/components/lecturer/AddLecturerModal";

const TABS = [
  { key: "ACTIVE", label: "Aktywni" },
  { key: "ARCHIVED", label: "Zarchiwizowani" },
  { key: "INACTIVE", label: "Nieaktywni" },
];

const columns = [
  { key: "id", header: "ID" },
  { key: "login", header: "Login" },
  { key: "firstName", header: "Imię" },
  { key: "lastName", header: "Nazwisko" },
  { key: "email", header: "Mail" },
  { key: "status", header: "Status" },
];

export default function LecturersPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLecturers(activeTab)
      .then((data) => {
        setLecturers(data.content || []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [activeTab]);

  const tableData = lecturers.map((lecturer, idx) => ({
    ...lecturer,
    id: idx + 1,
  }));

  return (
    <div className="min-w-120">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex items-center justify-between mb-5">
        {activeTab === "ACTIVE" && (
          <button
            className="bg-purple hover:opacity-70 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <FaPlus />
            Dodaj Prowadzącego
          </button>
        )}
      </div>

      <AddLecturerModal isOpen={isOpen} setIsOpen={setIsOpen} />

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {tableData.length === 0 && !loading && (
        <div className="text-gray-500">Brak prowadzących do wyświetlenia</div>
      )}

      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        !error &&
        tableData.length > 0 && (
          <Table columns={columns} data={tableData} whereNavigate="list-lecturers" />
        )
      )}
    </div>
  );
}
