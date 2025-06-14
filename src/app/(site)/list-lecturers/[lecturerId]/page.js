"use client";
import { useEffect, useState } from "react";
import { getLecturerById, updateLecturer, archiveLecturer, activateLecturer, deleteLecturer } from "@/lib/lecturersApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Buttons";
import { FiArrowLeft } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { FiArchive } from "react-icons/fi";
import { CiPause1 } from "react-icons/ci";
import { IoPlayCircleOutline } from "react-icons/io5";
import InputForm from "@/components/InputForm";

export default function LecturerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lecturerId = params?.lecturerId;

  const [lecturer, setLecturer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    login: "",
    status: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!lecturerId) return;
    getLecturerById(lecturerId)
      .then((data) => setLecturer(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lecturerId]);

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setLecturer((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      try {
        const updated = await updateLecturer(lecturerId, {
          firstName: lecturer.firstName,
          lastName: lecturer.lastName,
          email: lecturer.email,
          login: lecturer.login,
        });
        setLecturer((prev) => ({ ...prev, ...updated }));
      } catch (error) {
        setError(error.message);
      } finally {
        setEditing(false);
      }
    } else {
      setEditing(true);
    }
  };

  const handleStatusChange = async () => {
    setError(null);
    try {
      if (lecturer.status === "ACTIVE") {
        await archiveLecturer(lecturerId);
        setLecturer((prev) => ({ ...prev, status: "ARCHIVED" }));
      } else if (lecturer.status === "INACTIVE") {
        await activateLecturer(lecturerId);
        setLecturer((prev) => ({ ...prev, status: "ACTIVE" }));
      } else if (lecturer.status === "ARCHIVED") {
        await deleteLecturer(lecturerId);
        router.push("/list-lecturers");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <div className="text-red-600">{error}</div>;
  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="min-w-120 px-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-purple font-medium flex items-center gap-1"
        >
          <FiArrowLeft /> Informacje prowadzącego
        </button>
        <Button
          color={editing ? "bg-green-500" : "bg-purple"}
          onClick={handleEditClick}
        >
          {editing ? "Zapisz" : "Edytuj"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InputForm
          label="Imię"
          name="firstName"
          value={lecturer.firstName}
          onChange={handleChange("firstName")}
          disabled={!editing}
        />
        <InputForm
          label="Nazwisko"
          name="lastName"
          value={lecturer.lastName}
          onChange={handleChange("lastName")}
          disabled={!editing}
        />
        <InputForm
          label="Mail"
          name="email"
          type="email"
          value={lecturer.email}
          onChange={handleChange("email")}
          disabled={!editing}
        />
        <InputForm
          label="Login"
          name="login"
          value={lecturer.login}
          onChange={handleChange("login")}
          disabled={!editing}
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Status</label>
          <div
            className={`text-lg font-medium ${
              lecturer.status === "ACTIVE"
                ? "text-green-400"
                : lecturer.status === "INACTIVE"
                ? "text-gray-400"
                : "text-orange-400"
            }`}
          >
            {lecturer.status === "ACTIVE"
              ? "Aktywny"
              : lecturer.status === "INACTIVE"
              ? "Nieaktywny"
              : "Zarchiwizowany"}
          </div>
        </div>

        <Button
          color={
            lecturer.status === "ACTIVE"
              ? "bg-orange-400"
              : lecturer.status === "INACTIVE"
              ? "bg-green-400"
              : "bg-red-400"
          }
          onClick={handleStatusChange}
          className="text-white flex items-center gap-2"
        >
          {lecturer.status === "ACTIVE" && <FiArchive className="text-lg" />}
          {lecturer.status === "ARCHIVED" && <CiPause1 className="text-lg" />}
          {lecturer.status === "INACTIVE" && (
            <IoPlayCircleOutline className="text-lg" />
          )}
          {lecturer.status === "ACTIVE"
            ? "Archiwizuj"
            : lecturer.status === "INACTIVE"
            ? "Aktywuj"
            : "Usuń"}
        </Button>
      </div>
    </div>
  );
}
