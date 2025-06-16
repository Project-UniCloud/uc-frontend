"use client";
import React, { useState, useEffect } from "react";
import { getLecturerById } from "@/lib/lecturersApi";
import InputForm from "@/components/InputForm";
import { Button } from "@/components/Buttons";
import { FaTrash } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function LecturerDetailsPage({ params }) {
  const router = useRouter();
  const { lecturerId } = React.use(params);

  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lecturerId) return;
    setLoading(true);
    setError(null);
    getLecturerById(lecturerId)
      .then(setLecturer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lecturerId]);

  return (
    <div className="min-w-120">
      {/* Nagłówek */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="mr-2 text-2xl text-black hover:text-purple focus:outline-none"
          aria-label="Wróć"
        >
          <IoArrowBack />
        </button>
        <h1 className="text-2xl font-bold">Informacje prowadzącego</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        lecturer && (
          <div
            className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-10
                        grid-cols-1 md:grid-cols-2 md:grid-rows-3 mb-10"
          >
            <InputForm
              label="Imię"
              name="firstName"
              value={lecturer.firstName}
              disabled
            />
            <InputForm
              label="Nazwisko"
              name="lastName"
              value={lecturer.lastName}
              disabled
            />
            <InputForm
              label="Mail"
              name="email"
              value={lecturer.email}
              disabled
            />
            <InputForm
              label="Indeks"
              name="login"
              value={lecturer.login}
              disabled
            />
            {/* pusta komórka dla symetrii */}
            <div></div>
            {/* Przycisk Usuń */}
            <div className="flex items-center">
              <Button
                color="bg-red-500"
                className="w-full py-3 text-lg font-semibold flex items-center justify-center"
                type="button"
                disabled
              >
                <FaTrash className="mr-2" />
                USUŃ
              </Button>
            </div>
            {/* Uwagi na całą szerokość */}
            <div className="col-span-2">
              <InputForm
                label="Uwagi"
                name="uwagi"
                colors="border-gray-400 text-gray-500"
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                disabled
                as="textarea"
                rows={4}
                center
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
