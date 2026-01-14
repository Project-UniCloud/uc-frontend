"use client";

import { useState } from "react";
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
import {
  usePagination,
  useEditableState,
  useAsync,
} from "@/lib/views/shared/hooks";
import { groupSchema } from "./schema";

export function useGroupDetailPage(groupId) {
  const [activeTab, setActiveTab] = useState("Ogólne");
  const [validationError, setValidationError] = useState(null);
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
  const [isOpenStudent, setIsOpenStudent] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenResource, setIsOpenResource] = useState(false);
  const {
    page: studentPage,
    setPage: setStudentPage,
    pageSize: studentPageSize,
    setPageSize: setStudentPageSize,
    totalPages: studentTotalPages,
    setTotalPages: setStudentTotalPages,
    resetPagination: resetStudentPagination,
  } = usePagination();
  const {
    page: resourcePage,
    setPage: setResourcePage,
    pageSize: resourcePageSize,
    setPageSize: setResourcePageSize,
    totalPages: resourceTotalPages,
    setTotalPages: setResourceTotalPages,
    resetPagination: resetResourcePagination,
  } = usePagination();

  const fetchData = async () => {
    if (activeTab === "Ogólne") {
      const data = await getGroupById(groupId);
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
    } else if (activeTab === "Studenci") {
      const data = await getStudentsFromGroup({
        groupId,
        page: studentPage,
        pageSize: studentPageSize,
      });
      setStudentsData(data.content || []);
      setStudentTotalPages(data.page.totalPages || 0);
    } else if (activeTab === "Usługi") {
      const data = await getResourcesGroup(
        groupId,
        resourcePage,
        resourcePageSize
      );
      setResourcesData(data.content || []);
      setResourceTotalPages(data.page.totalPages || 0);
    }
  };

  const {
    loading,
    error,
    run: refetch,
  } = useAsync(fetchData, [
    activeTab,
    groupId,
    studentPage,
    studentPageSize,
    resourcePage,
    resourcePageSize,
    setGroupData,
    setStudentTotalPages,
    setResourceTotalPages,
  ]);

  const fetchStudents = async () => {
    const data = await getStudentsFromGroup({
      groupId,
      page: studentPage,
      pageSize: studentPageSize,
    });
    setStudentsData(data.content || []);
    setStudentTotalPages(data.page.totalPages || 0);
  };

  const fetchResources = async () => {
    const data = await getResourcesGroup(
      groupId,
      resourcePage,
      resourcePageSize
    );
    setResourcesData(data.content || []);
    setResourceTotalPages(data.page.totalPages || 0);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setValidationError(null);
    cancelEdit();
    if (tabKey === "Studenci") {
      resetStudentPagination();
    } else if (tabKey === "Usługi") {
      resetResourcePagination();
    }
  };

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setGroupData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      setValidationError(null);
      startEdit();
      return;
    }

    try {
      const validated = groupSchema.parse(groupData);
      setValidationError(null);

      await saveWith(() =>
        updateGroup(groupId, {
          name: validated.name,
          lecturers: validated.lecturers.map((t) => t.id),
          startDate: formatDateToDDMMYYYY(validated.startDate),
          endDate: formatDateToDDMMYYYY(validated.endDate),
          description: validated.description || "",
        })
      );
      showSuccessToast("Grupa została zaktualizowana pomyślnie.");
    } catch (error) {
      if (error.name === "ZodError") {
        const errorMessage = error.errors[0].message;
        setValidationError(errorMessage);
        showErrorToast(errorMessage);
      } else {
        const errorMessage = error.message;
        setValidationError(errorMessage);
        showErrorToast(errorMessage);
      }
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
    validationError,
    isOpenStudent,
    isOpenImport,
    isOpenResource,
    editing,
    studentPage,
    studentPageSize,
    studentTotalPages,
    resourcePage,
    resourcePageSize,
    resourceTotalPages,
    setIsOpenStudent,
    setIsOpenImport,
    setIsOpenResource,
    setStudentPage,
    setStudentPageSize,
    setResourcePage,
    setResourcePageSize,
    handleTabChange,
    handleChange,
    handleEditClick,
    handleLecturerAdd,
    handleLecturerRemove,
    fetchStudents,
    fetchResources,
    cancelEdit,
  };
}
