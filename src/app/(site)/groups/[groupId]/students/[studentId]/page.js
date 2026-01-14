"use client";
import React from "react";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import { FaTrash } from "react-icons/fa";
import DeleteStudentModal from "@/components/students/DeleteStudentModal";
import { useStudentDetailPage } from "@/lib/views/groups/groupId/studentId/hooks";

export default function StudentDetailsPage({ params }) {
  const { groupId, studentId } = React.use(params);

  const {
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
  } = useStudentDetailPage(studentId, groupId);

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
            onClick={handleEditClick}
          >
            {editing ? "Zapisz" : "Edytuj"}
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {validationError && (
        <div className="text-red-600 mb-4">{validationError}</div>
      )}
      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        student && (
          <>
            <DeleteStudentModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              studentId={studentId}
              groupId={groupId}
              studentName={`${student.firstName} ${student.lastName}`}
              groupName={groupName}
            />
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Imię"
                name="firstName"
                value={student.firstName}
                disabled={!editing}
                onChange={handleChange("firstName")}
                hint="Imię studenta"
              />
              <InputForm
                label="Nazwisko"
                name="lastName"
                value={student.lastName}
                disabled={!editing}
                onChange={handleChange("lastName")}
                hint="Nazwisko studenta"
              />
              <InputForm
                label="Mail"
                name="email"
                value={student.email}
                disabled={!editing}
                onChange={handleChange("email")}
                hint="Adres e-mail studenta"
              />
              <Button
                hint="Usuń Studenta z danej grupy zajęciowej."
                label="Usuń"
                color={`bg-red ${loading && "opacity-50"}`}
                center
                onClick={() => setIsOpen(true)}
                disabled={loading || formLoading || editing}
              >
                <FaTrash className="text-lg" />
                {loading ? "Ładowanie..." : "Usuń studenta"}
              </Button>
            </div>
          </>
        )
      )}
    </div>
  );
}
