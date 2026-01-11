"use client";
import React from "react";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import { useResourceDetailPage } from "@/lib/views/groups/groupId/resourceId/hooks";

export default function GroupPage({ params }) {
  const { groupId, resourceId } = React.use(params);
  const { checkAccess } = usePermissions();

  if (!checkAccess(PERMISSIONS.GROUPS)) {
    notFound();
  }

  const {
    infoData,
    loading,
    formLoading,
    error,
    editing,
    handleChange,
    handleEditClick,
  } = useResourceDetailPage(groupId, resourceId);

  return (
    <div className="min-w-120">
      <div className="flex justify-end items-center">
        {!loading && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={() => handleEditClick()}
          >
            {editing ? "Zapisz" : "Edytuj"}
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Informacje */}

      {loading ? (
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
              disabled={true}
            />
            <InputForm
              label="Czyszczenie"
              name="cron"
              value={infoData.cron}
              onChange={handleChange("cron", "Edycja")}
              disabled={true}
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
      )}
    </div>
  );
}
