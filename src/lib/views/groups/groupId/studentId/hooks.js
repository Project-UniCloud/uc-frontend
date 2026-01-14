"use client";

import { useState } from "react";
import { getStudentById, updateStudent } from "@/lib/api/studentApi";
import { getGroupById } from "@/lib/api/groupsApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState, useAsync } from "@/lib/views/shared/hooks";
import { editStudentSchema } from "./schemas";

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
  const [validationError, setValidationError] = useState(null);

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

  const handleCancelEdit = () => {
    setValidationError(null);
    cancelEdit();
  };

  const handleEditClick = async () => {
    if (!editing) {
      setValidationError(null);
      startEdit();
      return;
    }

    try {
      const validated = editStudentSchema.parse(student);
      setValidationError(null);
      await saveWith(() =>
        updateStudent(groupId, studentId, {
          firstName: validated.firstName,
          lastName: validated.lastName,
          email: validated.email,
        })
      );
      showSuccessToast("Student został zaktualizowany pomyślnie.");
    } catch (error) {
      if (error.name === "ZodError") {
        const errorMessage = error.errors[0].message;
        setValidationError(errorMessage);
        showErrorToast("Błąd walidacji: " + errorMessage);
      } else {
        const errorMessage =
          "Błąd podczas aktualizacji studenta: " + error.message;
        setValidationError(errorMessage);
        showErrorToast(errorMessage);
      }
    }
  };

  return {
    student,
    groupName,
    loading,
    formLoading,
    error,
    validationError,
    editing,
    isOpen,
    setIsOpen,
    handleChange,
    handleEditClick,
    handleCancelEdit,
  };
}
