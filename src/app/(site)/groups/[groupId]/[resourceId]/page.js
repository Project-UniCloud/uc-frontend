"use client";
import React, { useState, useEffect } from "react";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import {
  getResourceEditInfoByGroupId,
  updateResourceEditInfoByGroupId,
} from "@/lib/resourceApi";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import ButtonChangeResourceStatus from "@/components/resources/ButtonChangeResourceStatus";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";

const TABS = [{ label: "Informacje" }, { label: "Edycja" }];

export default function GroupPage({ params }) {
  const { groupId, resourceId } = React.use(params);
  const [infoData, setInfoData] = useState({
    id: "",
    limit: "",
    cron: "",
    expiresAt: "",
    status: "",
    notificationLevel1: "",
    notificationLevel2: "",
    notificationLevel3: "",
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [snapshotInfoData, setSnapshotInfoData] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getResourceEditInfoByGroupId(groupId, resourceId)
      .then((data) => {
        setInfoData({
          id: data.id,
          limit: data.limit,
          cron: data.cron || "",
          expiresAt: formatDateToYYYYMMDD(data.expiresAt),
          status: data.status || "",
          notificationLevel1: data.notificationLevel1 || "",
          notificationLevel2: data.notificationLevel2 || "",
          notificationLevel3: data.notificationLevel3 || "",
        });
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [groupId, resourceId]);

  const handleChange =
    (fieldName = activeTab) =>
    (event) => {
      const newValue = event.target.value;

      setInfoData((prev) => ({ ...prev, [fieldName]: newValue }));
    };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      setFormLoading(true);
      try {
        const updated = await updateResourceEditInfoByGroupId(groupId, {
          id: infoData.id,
          limit: infoData.limit,
          cron: infoData.cron,
          expiresAt: formatDateToDDMMYYYY(infoData.expiresAt),
          status: infoData.status,
          notificationLevel1: infoData.notificationLevel1,
          notificationLevel2: infoData.notificationLevel2,
          notificationLevel3: infoData.notificationLevel3,
        });
        setInfoData((prev) => ({ ...prev, ...updated }));
        showSuccessToast("Dane zostały zaktualizowane pomyślnie.");
        setSnapshotInfoData(null);
        setEditing(false);
      } catch (error) {
        setError(error.message);
        showErrorToast("Błąd podczas aktualizacji danych: " + error.message);
        if (snapshotInfoData) {
          setInfoData((prev) => ({ ...prev, ...snapshotInfoData }));
          setSnapshotInfoData(null);
        }
      } finally {
        setSnapshotInfoData(null);
        setFormLoading(false);
        setEditing(false);
      }
    } else {
      setSnapshotInfoData(infoData);
      setFormLoading(false);
      setEditing(true);
    }
  };

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
            />
            <InputForm
              label="Data zakończenia"
              name="expiresAt"
              type="date"
              value={infoData.expiresAt}
              onChange={handleChange("expiresAt", "Edycja")}
              disabled={!editing}
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
            />

            <ButtonChangeResourceStatus
              groupId={groupId}
              resourceId={resourceId}
              resourceStatus={infoData.status}
            />
          </div>
        </>
      )}
    </div>
  );
}
