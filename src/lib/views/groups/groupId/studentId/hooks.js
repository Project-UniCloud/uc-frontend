"use client";

import { useState, useEffect } from "react";
import { getStudentById, updateStudent } from "@/lib/api/studentApi";
import { getGroupById } from "@/lib/api/groupsApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import { useEditableState } from "@/lib/views/shared/hooks";

export function useStudentDetailPage(studentId, groupId) {
  const {
    state: student,
    setState: setStudent,
    editing,
    formLoading,
    startEdit,
    saveWith,
  } = useEditableState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!studentId || !groupId) return;
    setLoading(true);
    setError(null);

    Promise.all([getStudentById(studentId), getGroupById(groupId)])
      .then(([studentData, groupData]) => {
        setStudent({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
        });
        setGroupName(groupData.name);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId, groupId, setStudent]);

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setStudent((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (!editing) {
      startEdit();
      return;
    }

    setError(null);
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
      setError(error.message);
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
  };
}
