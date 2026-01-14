import { useState } from "react";
import { getGroups } from "@/lib/api/groupsApi";
import {
  getCloudAccessesById,
  getResourceTypesByDriverId,
} from "@/lib/api/cloudApi";
import { updateDriver } from "@/lib/api/driversApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import {
  usePagination,
  useEditableState,
  useAsync,
} from "@/lib/views/shared/hooks";

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

  const fetchData = async () => {
    if (activeTab === "Ustawienia") {
      const data = await getCloudAccessesById(driverName);
      setDriverData({
        id: data.cloudConnectorId,
        name: data.cloudConnectorName,
        clean: data.defaultCronExpression,
        limit: data.costLimit,
        status: data.isActive,
      });
    } else if (activeTab === "Grupy zajęciowe") {
      const data = await getGroups({
        page,
        pageSize,
        cloudClientId: driverName,
      });
      setGroupsData(data.content || []);
      setTotalPages(data.page.totalPages || 0);
    } else if (activeTab === "Typy zasobów") {
      const data = await getResourceTypesByDriverId({
        page,
        pageSize,
        driverName,
      });
      setDriverResourceTypesData(data.content || []);
      setTotalPages(data.page.totalPages || 0);
    }
  };

  const {
    loading,
    error,
    run: refetch,
  } = useAsync(fetchData, [
    activeTab,
    driverName,
    page,
    pageSize,
    setDriverData,
    setTotalPages,
  ]);

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
    refetch,
    cancelEdit: () => cancelEdit(),
  };
}
