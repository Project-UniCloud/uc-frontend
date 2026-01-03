"use client";

import { useState, useEffect } from "react";
import { getLecturerById, updateLecturer } from "@/lib/api/lecturersApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState } from "@/lib/views/shared/hooks";

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
    login: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lecturerId) return;
    setLoading(true);
    setError(null);
    getLecturerById(lecturerId)
      .then((data) => {
        setLecturer({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          login: data.login,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lecturerId]);

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setLecturer((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    setError(null);
    try {
      await saveWith((current) =>
        updateLecturer(lecturerId, {
          firstName: current.firstName,
          lastName: current.lastName,
          email: current.email,
          login: current.login,
        })
      );
      showSuccessToast("Prowadzący został zaktualizowany pomyślnie.");
    } catch (error) {
      setError(error.message);
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
