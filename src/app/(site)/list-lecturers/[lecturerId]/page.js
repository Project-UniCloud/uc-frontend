"use client";
import React from "react";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import { useLecturerDetailPage } from "@/lib/views/list-lecturers/lecturerId/hooks";

export default function LecturerDetailsPage({ params }) {
  const { lecturerId } = React.use(params);
  const { checkAccess } = usePermissions();

  if (!checkAccess(PERMISSIONS.LECTURERS)) {
    notFound();
  }

  const {
    lecturer,
    loading,
    error,
    formLoading,
    editing,
    handleChange,
    handleEditClick,
    handleCancelEdit,
  } = useLecturerDetailPage(lecturerId);

  return (
    <div className="min-w-120">
      <div className="flex justify-end items-center gap-2">
        {!loading && editing && (
          <Button
            color="bg-red-500"
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={handleCancelEdit}
          >
            Anuluj
          </Button>
        )}
        {!loading && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={() => handleEditClick()}
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
            </div>
          </>
        )
      )}
    </div>
  );
}
