import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addLecturer } from "@/lib/lecturersApi";
import InputForm from "../InputForm";
import { Button } from "../Buttons";
import { FaCheck } from "react-icons/fa";

export default function AddLecturerModal({ isOpen, setIsOpen, onLecturerAdded }) {
  // JEŚLI MODAL NIE POWINIEN BYĆ WIDOCZNY, NIE RENDERUJEMY NIC
  if (!isOpen) return null;

  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    userIndexNumber: "",
  });

  // Autogenerowany mail na podstawie indexu
  const generatedEmail = formValues.userIndexNumber
    ? `${formValues.userIndexNumber}@st.amu.edu.pl`
    : "";

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

  // Wyślij tylko wymagane dane
  function handleSubmit(e) {
    e.preventDefault();
    const { firstName, lastName, userIndexNumber } = formValues;
    mutation.mutate({ firstName, lastName, userIndexNumber });
  }

  // NIE używamy <dialog>, tylko klasyczny div-modal (jest czytelniej i bez bugów)
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
            <InputForm
              label="Imię"
              name="firstName"
              type="text"
              required
              value={formValues.firstName}
              onChange={handleInputChange}
              error={formErrors.firstName}
            />
            <InputForm
              label="Nazwisko"
              name="lastName"
              type="text"
              required
              value={formValues.lastName}
              onChange={handleInputChange}
              error={formErrors.lastName}
            />
            <InputForm
              label="ID"
              name="userIndexNumber"
              type="text"
              required
              value={formValues.userIndexNumber}
              onChange={handleInputChange}
              error={formErrors.userIndexNumber}
            />
            <InputForm
              label="Mail"
              name="email"
              type="email"
              disabled
              value={generatedEmail}
            />
          </div>

          {formErrors.error && (
            <div className="text-red-500 text-sm text-center">{formErrors.error}</div>
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
