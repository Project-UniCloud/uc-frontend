import { useState, useEffect } from "react";
import { getGroups } from "@/lib/api/groupsApi";
import {
  getCloudAccessesById,
  getResourceTypesByDriverId,
} from "@/lib/api/cloudApi";
import { updateDriver } from "@/lib/api/driversApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { usePagination, useEditableState } from "@/lib/views/shared/hooks";

export function useDriverDetailPage(driverName) {
  const [activeTab, setActiveTab] = useState("Ustawienia");
  const {
    state: driverData,
    setState: setDriverData,
    editing,
    formLoading,
    startEdit,
    cancelEdit,
    saveWith,
  } = useEditableState({
    clean: "",
    limit: "",
    name: "",
    description: "",
    status: "",
  });
  const [driverResourceTypesData, setDriverResourceTypesData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    resetPagination,
  } = usePagination();

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ustawienia") {
      getCloudAccessesById(driverName)
        .then((data) => {
          setDriverData({
            id: data.cloudConnectorId,
            name: data.cloudConnectorName,
            clean: data.defaultCronExpression,
            limit: data.costLimit,
            status: data.isActive,
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Grupy zajęciowe") {
      getGroups({ page, pageSize, cloudClientId: driverName })
        .then((data) => {
          setGroupsData(data.content || []);
          setTotalPages(data.page.totalPages || 0);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Typy zasobów") {
      getResourceTypesByDriverId({ page, pageSize, driverName })
        .then((data) => {
          setDriverResourceTypesData(data.content || []);
          setTotalPages(data.page.totalPages || 0);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [activeTab, driverName, page, pageSize]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    cancelEdit();
    resetPagination();
  };

  const tableData = groupsData.map((group, idx) => ({
    ...group,
    id: idx + 1,
  }));

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setDriverData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    setError(null);
    try {
      await saveWith((current) =>
        updateDriver(driverName, {
          cloudConnectorName: current.name,
          costLimit: current.limit,
          defaultCronExpression: current.clean,
        })
      );
      showSuccessToast("Sterownik został zaktualizowany pomyślnie.");
    } catch (error) {
      setError(error.message);
      showErrorToast("Błąd podczas aktualizacji sterownika: " + error.message);
    }
  };

  return {
    activeTab,
    driverData,
    driverResourceTypesData,
    groupsData,
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
  };
}
