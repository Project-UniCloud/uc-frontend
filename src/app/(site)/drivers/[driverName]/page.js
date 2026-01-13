"use client";
import React from "react";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import Tabs from "@/components/utils/Tabs";
import InputForm from "@/components/utils/InputForm";
import DataTableView from "@/components/views/DataTableView";
import AddResourceTypeModal from "@/components/resources/AddResourceTypeModal";
import Hint from "@/components/utils/Hint";
import { Button } from "@/components/utils/Buttons";
import { useDriverDetailPage } from "@/lib/views/drivers/driverName/hooks";
import { TABS } from "@/lib/views/drivers/driverName/tabs";
import {
  groupsColumns,
  resourceTypesColumns,
} from "@/lib/views/drivers/driverName/columns";

export default function GroupPage({ params }) {
  const { driverName } = React.use(params);
  const { checkAccess } = usePermissions();

  if (!checkAccess(PERMISSIONS.DRIVERS)) {
    notFound();
  }

  const {
    activeTab,
    driverData,
    driverResourceTypesData,
    loading,
    formLoading,
    error,
    editing,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    isOpenAddModal,
    setIsOpenAddModal,
    handleTabChange,
    tableData,
    handleChange,
    handleEditClick,
    cancelEdit,
  } = useDriverDetailPage(driverName);

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center">
          <Tabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="mb-4.5">
            <Hint
              hint={`Ustawienia – ogólne ustawienia i informacje o sterowniku
Grupy zajęciowe – lista grup wykorzystujących dany sterownik
Typy zasobów – dostępne typy zasobów dla danego sterownika`}
            />
          </div>
        </div>
        <AddResourceTypeModal
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          cloudConnectorId={driverName}
        />
        {activeTab === "Ustawienia" && !loading && (
          <div className="flex gap-2">
            {editing && (
              <Button
                color="bg-red-500"
                className={formLoading && "cursor-not-allowed opacity-50"}
                disabled={formLoading}
                onClick={cancelEdit}
              >
                Anuluj
              </Button>
            )}
            <Button
              color={editing ? "bg-green-500" : "bg-purple"}
              className={formLoading && "cursor-not-allowed opacity-50"}
              disabled={formLoading}
              onClick={handleEditClick}
            >
              {editing ? "Zapisz" : "Edytuj"}
            </Button>
          </div>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Ustawienia */}
      {activeTab === "Ustawienia" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3 "
            >
              <InputForm
                label="ID Sterownika"
                name="id"
                type="text"
                value={driverData.id}
                hint="ID sterownika chmurowego."
                disabled
              />
              <InputForm
                label="Nazwa"
                name="name"
                type="name"
                value={driverData.name}
                onChange={handleChange("name")}
                hint="Nazwa sterownika chmurowego."
                disabled={!editing}
              />
              <InputForm
                label="Wyczyść"
                name="clean"
                value={driverData.clean}
                onChange={handleChange("clean")}
                disabled={!editing}
                hint="Harmonogram cyklicznego zadania czyszczenia. 
          Określa, jak często system automatycznie czyści zasoby (np. codziennie o północy) zgodnie z ustawieniami (cron)."
              />
              <InputForm
                label="Limit kosztów"
                name="cost"
                value={driverData.limit}
                onChange={handleChange("limit")}
                hint="Kwota limitu kosztów.
            W szczegółach sterownika można ustawić progi powiadomień mailowych, które poinformują o przekroczeniu kosztów.
            Po przekroczeniu limitu kosztów system automatycznie wyłączy zasoby powiązane z danym sterownikiem."
                disabled={!editing}
              />
              <InputForm
                label="Status"
                name="status"
                hint="Aktualny status sterownika chmurowego.
                Aktywny - sterownik jest włączony i działa poprawnie.
                Nieaktywny - sterownik jest wyłączony lub wystąpiły problemy z jego działaniem."
                colors={driverData.status ? "text-green" : "text-red"}
                center
                value={driverData.status ? "Aktywny" : "Nieaktywny"}
                disabled
              />
            </div>
          </>
        ))}
      {/* Grupy zajęciowe */}
      {activeTab === "Grupy zajęciowe" && (
        <DataTableView
          loading={loading}
          error={error}
          data={tableData}
          columns={groupsColumns}
          whereNavigate="../groups"
          idKey="groupId"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      )}

      {/* Typy zasobów */}
      {activeTab === "Typy zasobów" && (
        <DataTableView
          loading={loading}
          error={error}
          data={driverResourceTypesData}
          columns={resourceTypesColumns}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
