"use client";
import React, { useState, useEffect } from "react";
import { getLecturerById, updateLecturer } from "@/lib/lecturersApi";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";

export default function LecturerDetailsPage({ params }) {
  const { lecturerId } = React.use(params);

  const [lecturer, setLecturer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    login: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snapshotLecturer, setSnapshotLecturer] = useState(null);

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
    setStudent((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      setFormLoading(true);
      try {
        const updated = await updateLecturer(lecturerId, {
          firstName: lecturer.firstName,
          lastName: lecturer.lastName,
          email: lecturer.email,
          login: lecturer.login,
        });
        setLecturer((prev) => ({ ...prev, ...updated }));
        showSuccessToast("Prowadzący został zaktualizowany pomyślnie.");
        setSnapshotLecturer(null);
        setEditing(false);
      } catch (error) {
        setError(error.message);
        showErrorToast(
          "Błąd podczas aktualizacji prowadzącego: " + error.message
        );
        if (snapshotLecturer) {
          setLecturer((prev) => ({ ...prev, ...snapshotLecturer }));
          setSnapshotLecturer(null);
        }
      } finally {
        setEditing(false);
        setFormLoading(false);
      }
    } else {
      setSnapshotLecturer(lecturer);
      setFormLoading(false);
      setEditing(true);
    }
  };

  return (
    <div className="min-w-120">
      <div className="flex justify-end items-center">
        {!loading && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={handleEditClick}
          >
            {editing ? "Zapisz" : "Edytuj"}
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        lecturer && (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Imię"
                name="firstName"
                value={lecturer.firstName}
                disabled={!editing}
                onChange={handleChange("firstName")}
                hint="Imię prowadzącego"
              />
              <InputForm
                label="Nazwisko"
                name="lastName"
                value={lecturer.lastName}
                disabled={!editing}
                onChange={handleChange("lastName")}
                hint="Nazwisko prowadzącego"
              />
              <InputForm
                label="Mail"
                name="email"
                value={lecturer.email}
                disabled={!editing}
                onChange={handleChange("email")}
                hint="Adres e-mail prowadzącego"
              />
              <InputForm
                label="Indeks"
                name="login"
                value={lecturer.login}
                disabled={!editing}
                onChange={handleChange("login")}
                hint="Indeks prowadzącego"
              />
            </div>
          </>
        )
      )}
    </div>
  );
}
