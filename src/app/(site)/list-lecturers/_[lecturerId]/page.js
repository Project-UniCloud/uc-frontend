"use client";
import React, { useState, useEffect } from "react";
import { getLecturerById } from "@/lib/lecturersApi";
import InputForm from "@/components/utils/InputForm";
import DeleteLecturerButton from "@/components/lecturer/DeleteLecturerButton";
import { Button } from "@/components/utils/Buttons";

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

  return (
    <div className="min-w-120">
      <div className="flex justify-end items-center">
        {!loading && (
          <Button color="bg-purple" disabled>
            Edytuj
            {/* color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={() => handleEditClick()}
            {editing ? "Zapisz" : "Edytuj"} */}
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
                disabled
                hint="Imię prowadzącego"
              />
              <InputForm
                label="Nazwisko"
                name="lastName"
                value={lecturer.lastName}
                disabled
                hint="Nazwisko prowadzącego"
              />
              <InputForm
                label="Mail"
                name="email"
                value={lecturer.email}
                disabled
                hint="Adres e-mail prowadzącego"
              />
              <InputForm
                label="Indeks"
                name="login"
                value={lecturer.login}
                disabled
                hint="Indeks prowadzącego"
              />
              <DeleteLecturerButton lecturerId={lecturerId} />
            </div>
          </>
        )
      )}
    </div>
  );
}
