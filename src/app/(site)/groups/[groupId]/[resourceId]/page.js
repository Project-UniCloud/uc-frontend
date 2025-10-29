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
  const [editData, setEditData] = useState({
    id: "",
    limit: "",
    cron: "",
    expiresAt: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getResourceEditInfoByGroupId(groupId, resourceId)
      .then((data) => {
        setEditData({
          id: data.id,
          limit: data.limit,
          cron: data.cron || "",
          expiresAt: formatDateToYYYYMMDD(data.expiresAt),
          status: data.status || "",
        });
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [groupId, resourceId]);

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;

    setEditData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      setFormLoading(true);
      try {
        const updated = await updateResourceEditInfoByGroupId(groupId, {
          id: editData.id,
          limit: editData.limit,
          cron: editData.cron,
          expiresAt: formatDateToDDMMYYYY(editData.expiresAt),
          status: editData.status,
        });
        setEditData((prev) => ({ ...prev, ...updated }));
        showSuccessToast("Dane zostały zaktualizowane pomyślnie.");
        setEditing(false);
      } catch (error) {
        setError(error.message);
        showErrorToast("Błąd podczas aktualizacji danych: " + error.message);
      } finally {
        setFormLoading(false);
        setEditing(false);
      }
    } else {
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
              value={editData.limit}
              onChange={handleChange("limit", "Edycja")}
              disabled={!editing}
            />
            <InputForm
              label="Czyszczenie"
              name="cron"
              value={editData.cron}
              onChange={handleChange("cron", "Edycja")}
              disabled={!editing}
            />
            <InputForm
              label="Data zakończenia"
              name="expiresAt"
              type="date"
              value={editData.expiresAt}
              onChange={handleChange("expiresAt", "Edycja")}
              disabled={!editing}
            />

            <ButtonChangeResourceStatus
              groupId={groupId}
              resourceId={resourceId}
              resourceStatus={editData.status}
            />
          </div>
        </>
      )}
    </div>
  );
}
