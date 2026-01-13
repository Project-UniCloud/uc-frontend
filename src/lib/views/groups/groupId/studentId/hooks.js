"use client";

import { useState } from "react";
import { getStudentById, updateStudent } from "@/lib/api/studentApi";
import { getGroupById } from "@/lib/api/groupsApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState, useAsync } from "@/lib/views/shared/hooks";

export function useStudentDetailPage(studentId, groupId) {
  const {
    state: student,
    setState: setStudent,
    editing,
    formLoading,
    startEdit,
    cancelEdit,
    saveWith,
  } = useEditableState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [groupName, setGroupName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { loading, error } = useAsync(
    () =>
      Promise.all([getStudentById(studentId), getGroupById(groupId)]).then(
        ([studentData, groupData]) => {
          setStudent({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
          });
          setGroupName(groupData.name);
        }
      ),
    [studentId, groupId, setStudent],
    { immediate: !!studentId && !!groupId }
  );

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setStudent((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    try {
      await saveWith((current) =>
        updateStudent(groupId, studentId, {
          firstName: current.firstName,
          lastName: current.lastName,
          email: current.email,
        })
      );
      showSuccessToast("Student został zaktualizowany pomyślnie.");
    } catch (error) {
      showErrorToast("Błąd podczas aktualizacji studenta: " + error.message);
    }
  };

  return {
    student,
    groupName,
    loading,
    formLoading,
    error,
    editing,
    isOpen,
    setIsOpen,
    handleChange,
    handleEditClick,
    cancelEdit,
  };
}
