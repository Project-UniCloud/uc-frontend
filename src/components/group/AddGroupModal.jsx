import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addGroup } from "@/lib/groupsApi";
import InputForm from "../utils/InputForm";
import { Button } from "../utils/Buttons";
import TeacherSearchInput from "@/components/utils/TeacherSearchInput";
import { formatDateToDDMMYYYY } from "@/lib/utils/formatDate";

export default function AddGroupModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (groupData) => addGroup(groupData),
    onSuccess: () => setIsOpen(false),
    onError: (error) =>
      setFormErrors({ error: error.message || "Błąd dodawania grupy" }),
  });

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("groupName");
    const teacher = formData.get("teacher");
    const semesterYear = formData.get("semesterYear");
    const semesterType = formData.get("semesterType");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const description = formData.get("description");

    const groupData = {
      name,
      semester: `${semesterYear}${semesterType}`,
      lecturers: [teacher],
      startDate: formatDateToDDMMYYYY(startDate),
      endDate: formatDateToDDMMYYYY(endDate),
      description: description || "",
    };

    mutation.mutate(groupData);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl shadow-xl w-full max-w-lg p-0 m-auto"
      onClose={handleClose}
    >
      <form method="dialog" className="relative p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold mb-6">Dodaj grupę</h2>
          <button
            type="button"
            className=" text-gray-500 hover:text-black cursor-pointer"
            onClick={handleClose}
          >
            <X />
          </button>
        </div>

        <div>
          <InputForm
            name="groupName"
            placeholder="Nazwa grupy"
            label="Nazwa grupy*"
            type="text"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <InputForm
              name="semesterYear"
              placeholder="Rok"
              label="Semestr*"
              type="text"
              required
            />
          </div>
          <div className="w-20">
            <label
              htmlFor="semesterType"
              className="block text-sm font-medium mb-1"
            >
              Semestr*
            </label>
            <select
              required
              name="semesterType"
              id="semesterType"
              className="w-full border-gray-400 border rounded-lg px-3 py-2"
            >
              <option value="Z">Z</option>
              <option value="L">L</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <InputForm
              name="startDate"
              placeholder="Data rozpoczęcia"
              label="Data rozpoczęcia*"
              type="date"
              required
            />
          </div>
          <div className="flex-1">
            <InputForm
              name="endDate"
              placeholder="Data zakończenia"
              label="Data zakończenia*"
              type="date"
              required
            />
          </div>
        </div>
        <TeacherSearchInput />
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Opis
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Opis"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 min-h-[80px]"
          />
        </div>

        {formErrors.error && (
          <div className="text-red-600">{formErrors.error}</div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            color="bg-white"
            textColor="text-black"
            className="border border-black"
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Wysyłanie..." : "Zatwierdź"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
