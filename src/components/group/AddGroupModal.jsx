import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addGroup } from "@/lib/groupsApi";
import InputForm from "../InputForm";
import { Button } from "../Buttons";
import { useLecturerSearch } from "@/hooks/useLecturerSearch";

export default function AddGroupModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [teacherQuery, setTeacherQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { results: lecturerOptions, loading: isSearching } =
    useLecturerSearch(teacherQuery);

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
    console.log(selectedTeacher);
    if (!selectedTeacher?.userId) {
      setFormErrors({ error: "Wybierz prowadzącego z listy." });
      return;
    }

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

  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
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
        <div className="relative">
          <label htmlFor="teacher" className="block text-sm font-medium mb-1">
            Prowadzący*
          </label>
          <input
            type="text"
            id="teacher"
            name="teacherDisplay"
            autoComplete="off"
            placeholder="Wpisz nazwisko prowadzącego"
            value={selectedTeacher?.label || teacherQuery}
            onChange={(e) => {
              setTeacherQuery(e.target.value);
              setSelectedTeacher(null);
            }}
            className="w-full border border-gray-400 rounded-lg px-3 py-2"
          />
          {teacherQuery && lecturerOptions.length > 0 && !selectedTeacher && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-auto shadow-lg">
              {lecturerOptions.map((lecturer) => (
                <li
                  key={lecturer.userId}
                  onClick={() => {
                    const selected = {
                      userId: lecturer.userId,
                      label: `${lecturer.firstName} ${lecturer.lastName}`,
                    };
                    setSelectedTeacher(selected);
                    setTeacherQuery("");
                    setFormErrors({});
                    console.log(selectedTeacher);
                    console.log(lecturer);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {lecturer.firstName} {lecturer.lastName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="hidden"
          name="teacher"
          value={selectedTeacher?.userId || ""}
        />
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
