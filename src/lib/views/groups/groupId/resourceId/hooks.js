"use client";

import { useState } from "react";
import {
  getResourceEditInfoByGroupId,
  updateResourceEditInfoByGroupId,
  getResourcesGroupCloudAccess,
} from "@/lib/api/resourceApi";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import {
  useEditableState,
  usePagination,
  useAsync,
} from "@/lib/views/shared/hooks";

export function useResourceDetailPage(groupId, resourceId) {
  const [activeTab, setActiveTab] = useState("Info");
  const {
    state: infoData,
    setState: setInfoData,
    editing,
    formLoading,
    startEdit,
    saveWith,
    cancelEdit,
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
  const [resourcesData, setResourcesData] = useState([]);
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    resetPagination,
  } = usePagination();

  const fetchData = async () => {
    if (activeTab === "Info") {
      const data = await getResourceEditInfoByGroupId(groupId, resourceId);
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
    } else if (activeTab === "Resources") {
      const data = await getResourcesGroupCloudAccess({
        groupId,
        resourceId,
        page,
        pageSize,
      });
      setResourcesData(data.content || []);
      setTotalPages(data.page?.totalPages || 0);
    }
  };

  const {
    loading,
    error,
    run: refetch,
  } = useAsync(fetchData, [
    activeTab,
    page,
    pageSize,
    groupId,
    resourceId,
    setInfoData,
    setTotalPages,
  ]);

  const fetchResources = () => refetch();

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    cancelEdit();
    resetPagination();
  };

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setInfoData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

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
      showErrorToast("Błąd podczas aktualizacji danych: " + error.message);
    }
  };

  return {
    activeTab,
    infoData,
    resourcesData,
    loading,
    formLoading,
    error,
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
    cancelEdit,
  };
}
