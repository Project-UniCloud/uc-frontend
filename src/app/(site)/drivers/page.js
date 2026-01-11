"use client";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import DataTableView from "@/components/views/DataTableView";
import AddDriverModal from "@/components/drivers/AddDriverModal";
import { Button } from "@/components/utils/Buttons";
import { FaPlus } from "react-icons/fa";
import Hint from "@/components/utils/Hint";
import { useDriversPage } from "@/lib/views/drivers/hooks";
import { columns } from "@/lib/views/drivers/columns";

export default function GroupsPage() {
  const { checkAccess } = usePermissions();

  if (!checkAccess(PERMISSIONS.DRIVERS)) {
    notFound();
  }
  const {
    loading,
    error,
    isOpen,
    setIsOpen,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchCloudAccesses,
    tableData,
  } = useDriversPage();

  return (
    <div className="min-w-120">
      <AddDriverModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fetch={fetchCloudAccesses}
      />
      <DataTableView
        leftActions={
          <>
            <Button
              onClick={() => setIsOpen(true)}
              hint="Tworzy nowe polaczenie do sterownika chmurowego. Czym jest sterownik do chmury mozna przeczytac w dokumentacji."
            >
              <FaPlus /> Dodaj sterownik
            </Button>
            <Hint
              hint="Dodanie sterownika chmurowego do systemu umożliwia zarządzanie zasobami chmurowymi poprzez ten sterownik.
          Można skonfigurować limity kosztów, harmonogramy czyszczenia zasobów oraz przydzielić dostęp do jego zasobów danej grupie zajęciowej oraz znajdującym się w niej studentom oraz prowadzącym."
            />
          </>
        }
        loading={loading}
        error={error}
        data={tableData}
        columns={columns}
        whereNavigate="drivers"
        idKey={"cloudConnectorId"}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
