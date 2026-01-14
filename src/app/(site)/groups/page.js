"use client";
import Tabs from "@/components/utils/Tabs";
import { FaPlus } from "react-icons/fa";
import AddGroupModal from "@/components/group/AddGroupModal";
import DataTableView from "@/components/views/DataTableView";
import { Button } from "@/components/utils/Buttons";
import Hint from "@/components/utils/Hint";
import { useGroupsPage } from "@/lib/views/groups/hooks";
import { TABS } from "@/lib/views/groups/tabs";
import { columns } from "@/lib/views/groups/columns";

export default function GroupsPage() {
  const {
    activeTab,
    groups,
    loading,
    error,
    isOpen,
    page,
    pageSize,
    totalPages,
    search,
    setPage,
    setPageSize,
    setIsOpen,
    handleTabChange,
    onSearchChange,
    fetchGroups,
  } = useGroupsPage();

  const tableData = groups.map((group, idx) => ({
    ...group,
    id: idx + 1,
  }));

  return (
    <div className="min-w-120">
      <div className="flex flex-row items-center">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mb-4.5">
          <Hint
            hint={`Aktywne – grupy w trakcie zajęć
Zarchiwizowane – grupy po zakończeniu zajęć
Nieaktywne – nowo utworzone grupy przed startem zajęć.`}
          />
        </div>
      </div>

      <AddGroupModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fetch={fetchGroups}
      />

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
