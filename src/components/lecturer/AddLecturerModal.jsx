import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addLecturer } from "@/lib/lecturersApi";
import InputForm from "../utils/InputForm";
import { Button } from "../utils/Buttons";
import { FaCheck } from "react-icons/fa";
import TeacherSearchInput from "@/components/utils/TeacherSearchInput";
import { useLecturerExternalSearch } from "@/hooks/useLecturerExternalSearch";

export default function AddLecturerModal({
  isOpen,
  setIsOpen,
  onLecturerAdded,
}) {
  if (!isOpen) return null;

  const formRef = useRef(null);
  const [lecturers, setLecturers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    userIndexNumber: "",
    email: "",
  });

  const handleLecturerAdd = (t) => {
    setLecturers((prev) =>
      prev.some((x) => x.id === t.id) ? prev : [...prev, t]
    );
    setFormValues({
      firstName: t.firstName || "",
      lastName: t.lastName || "",
      userIndexNumber: t.login || "",
      email: t.email || "",
    });
  };
  const handleLecturerRemove = (id) => {
    setLecturers((prev) => prev.filter((x) => x.id !== id));
    setFormValues({
      firstName: "",
      lastName: "",
      userIndexNumber: "",
      email: "",
    });
  };

  // Obsługa inputów
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: (lecturerData) => addLecturer(lecturerData),
    onSuccess: () => {
      formRef.current?.reset();
      setFormErrors({});
      setFormValues({
        firstName: "",
        lastName: "",
        userIndexNumber: "",
        email: "",
      });
      setIsOpen(false);
      if (onLecturerAdded) onLecturerAdded();
    },
    onError: (error) =>
      setFormErrors({ error: error.message || "Błąd dodawania prowadzącego" }),
  });

  // Zamykanie modala na X
  function handleClose() {
    setIsOpen(false);
  }

  // Wyślij dane wymagane przez nowe API
  function handleSubmit(e) {
    e.preventDefault();
    const { firstName, lastName, userIndexNumber, email } = formValues;
    mutation.mutate({ firstName, lastName, userIndexNumber, email });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl shadow-2xl p-10 w-[500px] max-w-[95vw] mx-auto flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
          tabIndex={0}
        >
          <X size={26} />
        </button>
        <h2 className="text-2xl font-extrabold mb-8 w-full text-center">
          Wprowadź dane prowadzącego
        </h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <TeacherSearchInput
              value={lecturers}
              disabled={lecturers.length >= 1}
              onSelect={handleLecturerAdd}
              onRemove={handleLecturerRemove}
              useLecturerSearch={useLecturerExternalSearch}
            />
            <InputForm
              label="Mail*"
              name="email"
              type="email"
              required
              value={formValues.email}
              onChange={handleInputChange}
              error={formErrors.email}
            />
          </div>

          {formErrors.error && (
            <div className="text-red-500 text-sm text-center">
              {formErrors.error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isPending}
            className="mt-6 w-full py-3 text-lg font-semibold flex items-center justify-center"
          >
            <FaCheck className="mr-2" />
            {mutation.isPending ? "Dodawanie..." : "DODAJ"}
          </Button>
        </form>
      </div>
    </div>
  );
}
