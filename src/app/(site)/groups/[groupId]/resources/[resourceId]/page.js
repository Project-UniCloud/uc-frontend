"use client";
import React, { useState } from "react";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import { useResourceDetailPage } from "@/lib/views/groups/groupId/resourceId/hooks";
import DataTableView from "@/components/views/DataTableView";
import { getColumns } from "@/lib/views/groups/groupId/resourceId/columns";
import Tabs from "@/components/utils/Tabs";
import { TABS } from "@/lib/views/groups/groupId/resourceId/tabs";
import DeleteResourceTypeModal from "@/components/resources/DeleteResourceTypeModal";

export default function GroupPage({ params }) {
  const { groupId, resourceId } = React.use(params);
  const { checkAccess } = usePermissions();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  if (!checkAccess(PERMISSIONS.GROUPS)) {
    notFound();
  }

  const {
    activeTab,
    infoData,
    resourcesData,
    loading,
    formLoading,
    error,
    validationError,
    editing,
    page,
    pageSize,
    totalPages,
    handleChange,
    handleEditClick,
    setPage,
    setPageSize,
    handleTabChange,
    fetchResources,
    handleCancelEdit,
  } = useResourceDetailPage(groupId, resourceId);

  const handleDeleteClick = ({ groupId, resourceId, resourceGlobalId }) => {
    setSelectedResource({ groupId, resourceId, resourceGlobalId });
    setIsDeleteModalOpen(true);
  };

  const columns = getColumns({
    groupId,
    resourceId,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <div className="flex justify-end items-center">
          <Tabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {activeTab === "Info" && !loading && (
          <div className="flex gap-2">
            {editing && (
              <Button
                color="bg-red-500"
                className={formLoading && "cursor-not-allowed opacity-50"}
                disabled={formLoading}
                onClick={handleCancelEdit}
              >
                Anuluj
              </Button>
            )}
            <Button
              color={editing ? "bg-green-500" : "bg-purple"}
              className={formLoading && "cursor-not-allowed opacity-50"}
              disabled={formLoading}
              onClick={() => handleEditClick()}
            >
              {editing ? "Zapisz" : "Edytuj"}
            </Button>
          </div>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {validationError && (
        <div className="text-red-600 mb-4">{validationError}</div>
      )}
      {/* Informacje */}
      {activeTab === "Info" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Limit"
                name="limit"
                hint="Kwota limitu kosztów dla używanego sterownika. Można ją zmienić w szczegółach sterownika.
                          Po przekroczeniu limitu kosztów system automatycznie wyłączy zasoby powiązane z danym sterownikiem."
                value={infoData.limit}
                onChange={handleChange("limit", "Edycja")}
                disabled={!editing}
              />
              <InputForm
                label="Czyszczenie"
                name="cron"
                value={infoData.cron}
                onChange={handleChange("cron", "Edycja")}
                disabled={!editing}
                hint="Harmonogram cyklicznego zadania czyszczenia. 
          Określa, jak często system automatycznie czyści zasoby (np. codziennie o północy) zgodnie z ustawieniami (cron)."
              />
              <InputForm
                label="Data zakończenia"
                name="expiresAt"
                type="date"
                value={infoData.expiresAt}
                onChange={handleChange("expiresAt", "Edycja")}
                disabled={!editing}
                hint="Data, po której dostęp do zasobu zostanie automatycznie wyłączony dla tej grupy"
              />

              <InputForm
                label="Próg powiadomień 1 (%)"
                name="notificationLevel1"
                type="number"
                min={0}
                max={100}
                step={1}
                value={infoData.notificationLevel1}
                onChange={handleChange("notificationLevel1", "Edycja")}
                disabled={!editing}
                hint="Po przekroczeniu tego progu kosztów, użytkownicy z tej grupy otrzymają powiadomienie e-mailowe."
              />

              <InputForm
                label="Próg powiadomień 2 (%)"
                name="notificationLevel2"
                type="number"
                min={0}
                max={100}
                step={1}
                value={infoData.notificationLevel2}
                onChange={handleChange("notificationLevel2", "Edycja")}
                disabled={!editing}
                hint="Po przekroczeniu tego progu kosztów, użytkownicy z tej grupy otrzymają powiadomienie e-mailowe."
              />

              <InputForm
                label="Próg powiadomień 3 (%)"
                name="notificationLevel3"
                type="number"
                min={0}
                max={100}
                step={1}
                value={infoData.notificationLevel3}
                onChange={handleChange("notificationLevel3", "Edycja")}
                disabled={!editing}
                hint="Po przekroczeniu tego progu kosztów, użytkownicy z tej grupy otrzymają powiadomienie e-mailowe."
              />
            </div>
          </>
        ))}
      {/* Zasoby */}
      {activeTab === "Resources" && (
        <>
          <DeleteResourceTypeModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            groupId={selectedResource?.groupId}
            resourceId={selectedResource?.resourceId}
            resourceGlobalId={selectedResource?.resourceGlobalId}
            onDeleted={fetchResources}
          />
          <DataTableView
            loading={loading}
            error={error}
            data={resourcesData}
            columns={columns}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            emptyMessage={"Brak zasobów dla tej usługi."}
          />
        </>
      )}
    </div>
  );
}
