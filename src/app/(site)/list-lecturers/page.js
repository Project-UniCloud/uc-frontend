"use client";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import DataTableView from "@/components/views/DataTableView";
import AddLecturerModal from "@/components/lecturer/AddLecturerModal";
import { Button } from "@/components/utils/Buttons";
import { FaPlus } from "react-icons/fa";
import Hint from "@/components/utils/Hint";
import { useListLecturersPage } from "@/lib/views/list-lecturers/hook";
import { columns } from "@/lib/views/list-lecturers/columns";

export default function ListLecturersPage() {
  const { checkAccess } = usePermissions();

  if (!checkAccess(PERMISSIONS.LECTURERS)) {
    notFound();
  }
  const {
    lecturers,
    loading,
    error,
    isOpen,
    searchQuery,
    page,
    pageSize,
    totalPages,
    setIsOpen,
    setSearchQuery,
    setPage,
    setPageSize,
    fetchLecturers,
  } = useListLecturersPage();

  return (
    <div className="min-w-120">
      <AddLecturerModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLecturerAdded={fetchLecturers}
        fetch={fetchLecturers}
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
        whereNavigate="list-lecturers"
        idKey={"uuid"}
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
