"use client";

import { useState } from "react";
import { getLecturerById, updateLecturer } from "@/lib/api/lecturersApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState, useAsync } from "@/lib/views/shared/hooks";
import { editLecturerSchema } from "./schemas";

export function useLecturerDetailPage(lecturerId) {
  const [validationError, setValidationError] = useState(null);
  const {
    state: lecturer,
    setState: setLecturer,
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

  const { loading, error } = useAsync(
    () =>
      getLecturerById(lecturerId).then((data) => {
        setLecturer({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      }),
    [lecturerId, setLecturer],
    { immediate: !!lecturerId }
  );

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setLecturer((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleCancelEdit = () => {
    setValidationError(null);
    cancelEdit();
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    try {
      setValidationError(null);
      const dataToValidate = {
        firstName: lecturer.firstName,
        lastName: lecturer.lastName,
        email: lecturer.email,
      };
      editLecturerSchema.parse(dataToValidate);
      await saveWith((current) =>
        updateLecturer(lecturerId, {
          firstName: current.firstName,
          lastName: current.lastName,
          email: current.email,
        })
      );
      showSuccessToast("Prowadzący został zaktualizowany pomyślnie.");
    } catch (error) {
      if (error.name === "ZodError") {
        setValidationError(error.errors[0]?.message || "Błąd walidacji");
      } else {
        showErrorToast(
          "Błąd podczas aktualizacji prowadzącego: " + error.message
        );
      }
    }
  };

  return {
    lecturer,
    loading,
    error,
    validationError,
    formLoading,
    editing,
    handleChange,
    handleEditClick,
    handleCancelEdit,
  };
}
