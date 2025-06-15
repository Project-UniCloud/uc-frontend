"use client";
import { useState, useEffect } from "react";
import { getLecturers } from "@/lib/lecturersApi";
import Table from "@/components/Table";
import AddLecturerModal from "@/components/lecturer/AddLecturerModal";
import { Button } from "@/components/Buttons";
import { FaPlus } from "react-icons/fa";

const columns = [
  { key: "userIndexNumber", header: "ID" },
  { key: "firstName", header: "Imię" },
  { key: "lastName", header: "Nazwisko" },
  { key: "email", header: "Mail" },
];

export default function ListLecturersPage() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // <- DOMYŚLNIE FALSE
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLecturers = () => {
    setLoading(true);
    setError(null);
    getLecturers(searchQuery)
      .then((data) => {
        setLecturers(data.content || []);
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
    <div className="p-8 min-w-120">
      <h1 className="text-2xl font-bold mb-6">Lista prowadzących</h1>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          <FaPlus className="mr-2" />
          Dodaj
        </Button>
        <input
          type="text"
          placeholder="Szukaj"
          className="w-72 px-4 py-2 border border-gray-300 rounded-lg"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <AddLecturerModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLecturerAdded={fetchLecturers}
      />
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        <Table columns={columns} data={lecturers} />
      )}
    </div>
  );
}
