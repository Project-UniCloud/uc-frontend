"use client";
import { useState, useEffect } from "react";
import { getGroups } from "@/lib/groupsApi";
import Tabs from "@/components/Tabs";
import Table from "@/components/Table";
import { FaPlus } from "react-icons/fa";
import AddGroupModal from "@/components/group/AddGroupModal";

const TABS = [
  { key: "ACTIVE", label: "Aktywne" },
  { key: "ARCHIVED", label: "Zarchiwizowane" },
  { key: "INACTIVE", label: "Nieaktywne" },
];

const columns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Nazwa" },
  { key: "lecturers", header: "Prowadzący" },
  { key: "cloudAccesses", header: "Usługi" },
  { key: "semester", header: "Semestr" },
  { key: "endDate", header: "Data Zakończenia" },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getGroups(activeTab)
      .then((data) => {
        setGroups(data.content);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [activeTab]);

  const tableData = groups.map((group, idx) => ({
    ...group,
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
            Dodaj Grupę
          </button>
        )}
      </div>

      <AddGroupModal isOpen={isOpen} setIsOpen={setIsOpen} />

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {tableData.length === 0 && !loading && (
        <div className="text-gray-500">Brak grup do wyświetlenia</div>
      )}

      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        !error &&
        tableData.length > 0 && <Table columns={columns} data={tableData} />
      )}
    </div>
  );
}
