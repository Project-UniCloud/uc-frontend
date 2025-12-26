"use client";
import React, { useState, useEffect } from "react";
import { getStudentById } from "@/lib/studentApi";
import { getGroupById } from "@/lib/groupsApi";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import { FaTrash } from "react-icons/fa";
import DeleteStudentModal from "@/components/students/DeleteStudentModal";
import { updateStudent } from "@/lib/studentApi";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";

export default function StudentDetailsPage({ params }) {
  const { groupId, studentId } = React.use(params);

  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    login: "",
  });
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [snapshotStudent, setSnapshotStudent] = useState(null);

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
          login: studentData.login,
        });
        setGroupName(groupData.name);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId, groupId]);

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setStudent((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      setFormLoading(true);
      try {
        const updated = await updateStudent(groupId, studentId, {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          login: student.login,
        });
        setStudent((prev) => ({ ...prev, ...updated }));
        showSuccessToast("Student został zaktualizowany pomyślnie.");
        setSnapshotStudent(null);
        setEditing(false);
      } catch (error) {
        setError(error.message);
        showErrorToast("Błąd podczas aktualizacji studenta: " + error.message);
        if (snapshotStudent) {
          setStudent((prev) => ({ ...prev, ...snapshotStudent }));
          setSnapshotStudent(null);
        }
      } finally {
        setEditing(false);
        setFormLoading(false);
      }
    } else {
      setSnapshotStudent(student);
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
              <InputForm
                label="Indeks"
                name="login"
                value={student.login}
                disabled={!editing}
                onChange={handleChange("login")}
                hint="Indeks studenta"
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
