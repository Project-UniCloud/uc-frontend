"use client";

import { useState, useEffect } from "react";
import {
  getGroupById,
  updateGroup,
  getResourcesGroup,
} from "@/lib/api/groupsApi";
import { getStudentsFromGroup } from "@/lib/api/studentApi";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { usePagination, useEditableState } from "@/lib/views/shared/hooks";

export function useGroupDetailPage(groupId) {
  const [activeTab, setActiveTab] = useState("Ogólne");
  const {
    state: groupData,
    setState: setGroupData,
    editing,
    formLoading,
    startEdit,
    cancelEdit,
    saveWith,
  } = useEditableState({
    name: "",
    lecturers: [],
    startDate: "",
    endDate: "",
    description: "",
    status: "",
  });
  const [studentsData, setStudentsData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenStudent, setIsOpenStudent] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenResource, setIsOpenResource] = useState(false);
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    resetPagination,
  } = usePagination();

  const fetchResources = () => {
    getResourcesGroup(groupId)
      .then((data) => setResourcesData(data || []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  const fetchStudents = () => {
    getStudentsFromGroup({ groupId, page, pageSize })
      .then((data) => {
        setStudentsData(data.content || []);
        setTotalPages(data.page.totalPages || 0);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ogólne") {
      getGroupById(groupId)
        .then((data) => {
          const teachers = data.lecturerFullNames.map((l) => ({
            id: l.userId,
            fullName: `${l.firstName} ${l.lastName}`,
          }));

          setGroupData({
            name: data.name,
            lecturers: teachers,
            startDate: formatDateToYYYYMMDD(data.startDate),
            endDate: formatDateToYYYYMMDD(data.endDate),
            description: data.description || "",
            status: data.status,
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Studenci") {
      fetchStudents();
    }
    if (activeTab === "Usługi") {
      fetchResources();
    }
  }, [activeTab, groupId, page, pageSize]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    cancelEdit();
    resetPagination();
  };

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setGroupData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    setError(null);
    try {
      await saveWith((current) =>
        updateGroup(groupId, {
          name: current.name,
          lecturers: current.lecturers.map((t) => t.id),
          startDate: formatDateToDDMMYYYY(current.startDate),
          endDate: formatDateToDDMMYYYY(current.endDate),
          description: current.description || "",
        })
      );
      showSuccessToast("Grupa została zaktualizowana pomyślnie.");
    } catch (error) {
      setError(error.message);
      showErrorToast("Błąd podczas aktualizacji grupy: " + error.message);
    }
  };

  const handleLecturerAdd = (t) => {
    setGroupData((prev) => ({
      ...prev,
      lecturers: prev.lecturers.some((x) => x.id === t.id)
        ? prev.lecturers
        : [...prev.lecturers, t],
    }));
  };

  const handleLecturerRemove = (id) => {
    setGroupData((prev) => ({
      ...prev,
      lecturers: prev.lecturers.filter((t) => t.id !== id),
    }));
  };

  return {
    activeTab,
    groupData,
    studentsData,
    resourcesData,
    loading,
    formLoading,
    error,
    isOpenStudent,
    isOpenImport,
    isOpenResource,
    editing,
    page,
    pageSize,
    totalPages,
    setIsOpenStudent,
    setIsOpenImport,
    setIsOpenResource,
    setPage,
    setPageSize,
    handleTabChange,
    handleChange,
    handleEditClick,
    handleLecturerAdd,
    handleLecturerRemove,
    fetchStudents,
    fetchResources,
  };
}
