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
import { editDriverSchema } from "./schemas";

export function useDriverDetailPage(driverName) {
  const [activeTab, setActiveTab] = useState("Ustawienia");
  const [validationError, setValidationError] = useState(null);
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
    setError,
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
    setValidationError(null);
    setError(null);
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

    setValidationError(null);
    setError(null);

    try {
      const dataToValidate = {
        name: driverData.name,
        limit: driverData.limit,
        clean: driverData.clean,
      };
      editDriverSchema.parse(dataToValidate);
    } catch (error) {
      if (error.name === "ZodError") {
        setValidationError(error.errors[0]?.message || "Błąd walidacji");
        return;
      }
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
      const errorMessage = error.message || "Nieznany błąd";
      setError("Błąd podczas aktualizacji sterownika: " + errorMessage);
      showErrorToast("Błąd podczas aktualizacji sterownika: " + errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setValidationError(null);
    setError(null);
    cancelEdit();
  };

  return {
    activeTab,
    driverData,
    driverResourceTypesData,
    groupsData,
    loading,
    formLoading,
    error,
    validationError,
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
    handleCancelEdit,
  };
}
