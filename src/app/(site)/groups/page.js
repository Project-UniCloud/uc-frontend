"use client";
import { useState, useEffect } from "react";
import { getGroups } from "@/lib/groupsApi";
import Tabs from "@/components/utils/Tabs";
import { FaPlus } from "react-icons/fa";
import AddGroupModal from "@/components/group/AddGroupModal";
import DataTableView from "@/components/views/DataTableView";
import { z } from "zod";
import { Button } from "@/components/utils/Buttons";

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

const searchSchema = z
  .string()
  .regex(
    /^[\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ\- ]*$/,
    "Dozwolone: litery, cyfry, spacje i '-'"
  );

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    getGroups({ status: activeTab, page, pageSize, groupName: search })
      .then((data) => {
        setGroups(data.content);
        setTotalPages(data.page.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [activeTab, page, pageSize, search]);

  const tableData = groups.map((group, idx) => ({
    ...group,
    id: idx + 1,
  }));

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(0);
    setPageSize(10);
    setSearch("");
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    const result = searchSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError("");
    setSearch(value);
    setPage(0);
  };

  return (
    <div className="min-w-120">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <AddGroupModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <DataTableView
        leftActions={
          <>
            {activeTab === "ACTIVE" && (
              <Button
                onClick={() => setIsOpen(true)}
                hint="Tworzenie nowej grupy zajęciowej. Podanym prowadzącym przydzielany jest dostęp, dostaną oni maila z loginem i hasłem"
              >
                <FaPlus /> Dodaj grupę
              </Button>
            )}
            <input
              type="text"
              placeholder="Szukaj grupy"
              value={search}
              onChange={onSearchChange}
              disabled={groups.length === 0 && search.length === 0}
              className={`border border-gray-300 rounded-lg px-3 py-1.5 text-md ${
                groups.length === 0 && search.length === 0
                  ? "opacity-50 cursor-not-allowed hidden"
                  : ""
              }`}
            />
          </>
        }
        loading={loading}
        error={error}
        data={tableData}
        columns={columns}
        whereNavigate="groups"
        idKey={"groupId"}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
