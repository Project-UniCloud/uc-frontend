import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addLecturer } from "@/lib/lecturersApi";
import InputForm from "../InputForm";
import { Button } from "../Buttons";

export default function AddLecturerModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (lecturerData) => addLecturer(lecturerData),
    onSuccess: () => {
      formRef.current?.reset();
      setFormErrors({});
      setIsOpen(false);
    },
    onError: (error) =>
      setFormErrors({ error: error.message || "Błąd dodawania prowadzącego" }),
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
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const login = formData.get("login");

    const lecturerData = {
      firstName,
      lastName,
      email,
      login,
    };

    mutation.mutate(lecturerData);
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
      <form method="dialog" className="relative p-6" onSubmit={handleSubmit} ref={formRef}>
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold mb-6">Dodaj prowadzącego</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-black cursor-pointer"
            onClick={handleClose}
          >
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputForm
              name="firstName"
              placeholder="Jan"
              label="Imię*"
              type="text"
              required
            />
          </div>
          <div>
            <InputForm
              name="lastName"
              placeholder="Kowalski"
              label="Nazwisko*"
              type="text"
              required
            />
          </div>
          <div>
            <InputForm
              name="login"
              placeholder="jkowalski"
              label="Login*"
              required
            />
          </div>
          <div>
            <InputForm
              name="email"
              placeholder="jan.kowalski@example.com"
              label="Mail*"
              type="email"
              required
            />
          </div>
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