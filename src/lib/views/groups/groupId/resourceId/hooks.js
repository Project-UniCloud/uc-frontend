"use client";

import { useState, useEffect } from "react";
import {
  getResourceEditInfoByGroupId,
  updateResourceEditInfoByGroupId,
} from "@/lib/api/resourceApi";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState } from "@/lib/views/shared/hooks";

export function useResourceDetailPage(groupId, resourceId) {
  const {
    state: infoData,
    setState: setInfoData,
    editing,
    formLoading,
    startEdit,
    saveWith,
  } = useEditableState({
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
  const [error, setError] = useState(null);

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

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setInfoData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    setError(null);
    try {
      await saveWith((current) =>
        updateResourceEditInfoByGroupId(groupId, {
          id: current.id,
          limit: current.limit,
          cron: current.cron,
          expiresAt: formatDateToDDMMYYYY(current.expiresAt),
          status: current.status,
          notificationLevel1: current.notificationLevel1,
          notificationLevel2: current.notificationLevel2,
          notificationLevel3: current.notificationLevel3,
        })
      );
      showSuccessToast("Dane zostały zaktualizowane pomyślnie.");
    } catch (error) {
      setError(error.message);
      showErrorToast("Błąd podczas aktualizacji danych: " + error.message);
    }
  };

  return {
    infoData,
    loading,
    formLoading,
    error,
    editing,
    handleChange,
    handleEditClick,
  };
}
