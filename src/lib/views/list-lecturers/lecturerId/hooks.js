"use client";

import { useState } from "react";
import { getLecturerById, updateLecturer } from "@/lib/api/lecturersApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState, useAsync } from "@/lib/views/shared/hooks";

export function useLecturerDetailPage(lecturerId) {
  const {
    state: lecturer,
    setState: setLecturer,
    editing,
    formLoading,
    startEdit,
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

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    try {
      await saveWith((current) =>
        updateLecturer(lecturerId, {
          firstName: current.firstName,
          lastName: current.lastName,
          email: current.email,
        })
      );
      showSuccessToast("Prowadzący został zaktualizowany pomyślnie.");
    } catch (error) {
      showErrorToast(
        "Błąd podczas aktualizacji prowadzącego: " + error.message
      );
    }
  };

  return {
    lecturer,
    loading,
    error,
    formLoading,
    editing,
    handleChange,
    handleEditClick,
  };
}
