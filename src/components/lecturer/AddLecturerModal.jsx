import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addLecturer } from "@/lib/lecturersApi";
import InputForm from "../utils/InputForm";
import { Button } from "../utils/Buttons";
import { FaCheck } from "react-icons/fa";
import TeacherSearchInput from "@/components/utils/TeacherSearchInput";
import { useLecturerExternalSearch } from "@/hooks/useLecturerExternalSearch";
import { showErrorToast, showSuccessToast } from "../utils/Toast";

export default function AddLecturerModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [lecturers, setLecturers] = useState([]);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    login: "",
    email: "",
  });

  // const lecturerSchema = z.object({
  //   firstName: z.string().nonempty("Imię jest wymagane"),
  //   lastName: z.string().nonempty("Nazwisko jest wymagane"),
  //   login: z
  //     .string()
  //     .regex(/^s\d{6}$/, 'Indeks musi zaczynać się od "s" i mieć 6 cyfr'),
  //   email: z.string().email("Nieprawidłowy format e-maila"),
  // });

  const mutation = useMutation({
    mutationFn: (lecturerData) => addLecturer(lecturerData),
    onSuccess: () => {
      formRef.current?.reset();
      setLecturers([]);
      setFormValues({
        firstName: "",
        lastName: "",
        login: "",
        email: "",
      });
      setFormErrors({});
      setIsOpen(false);
      showSuccessToast("Prowadzący został dodany!");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd dodawania prowadzącego" });
      showErrorToast("Błąd dodawania prowadzącego: " + error?.message);
    },
  });

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else dialogRef.current?.close();
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const login = formValues.login || formData.get("login");
    const firstName = formValues.firstName || formData.get("firstName");
    const lastName = formValues.lastName || formData.get("lastName");
    const email = formValues.email || formData.get("email");

    const lecturerData = {
      userIndexNumber: login,
      firstName,
      lastName,
      email,
    };

    mutation.mutate(lecturerData);
  }

  function handleClose() {
    setLecturers([]);
    setFormValues({
      firstName: "",
      lastName: "",
      login: "",
      email: "",
    });

    setIsOpen(false);
  }

  const handleLecturerAdd = (t) => {
    setLecturers((prev) =>
      prev.some((x) => x.id === t.id) ? prev : [...prev, t]
    );
    if (t) {
      setFormValues((prev) => ({
        ...prev,
        firstName: t.firstName || prev.firstName,
        lastName: t.lastName || prev.lastName,
        login: t.login || prev.login,
        email: t.email || prev.email,
      }));
    }
  };
  const handleLecturerRemove = (id) => {
    setLecturers((prev) => prev.filter((t) => t.id !== id));
    setFormValues({
      firstName: "",
      lastName: "",
      login: "",
      email: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl shadow-xl w-full max-w-xl p-0 m-auto overflow-visible"
      onClose={handleClose}
    >
      <form
        method="dialog"
        className="relative p-8 overflow-visible"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="flex flex-col items-end">
          <button
            type="button"
            className=" text-gray-500 hover:text-black cursor-pointer"
            onClick={handleClose}
          >
            <X />
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-6 text-center">
          Dodaj prowadzącego
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <TeacherSearchInput
            value={lecturers}
            disabled={lecturers.length >= 1}
            disabledOnlyList={false}
            onSelect={handleLecturerAdd}
            onRemove={handleLecturerRemove}
            useLecturerSearch={useLecturerExternalSearch}
          />
          <InputForm
            label="Email*"
            name="email"
            type="email"
            required
            value={formValues.email}
            onChange={handleInputChange}
          />
        </div>

        {formErrors.error && (
          <div className="text-red-600">{formErrors.error}</div>
        )}

        <div className="flex justify-end items-center gap-4 pt-10">
          <Button
            type="button"
            onClick={handleClose}
            color="bg-white"
            textColor="text-black"
            className={`border border-black ${
              mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className={`${
              mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaCheck className="mr-2" />{" "}
            {mutation.isPending ? "Dodawanie..." : "Dodaj prowadzącego"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
