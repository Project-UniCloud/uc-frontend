import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import InputForm from "../utils/InputForm";
import { Button } from "../utils/Buttons";
import { addStudentToGroup } from "@/lib/studentApi";
import React from "react";

export function AddStudentModal({ isOpen, setIsOpen, groupId }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: ({ groupId, studentData }) =>
      addStudentToGroup(groupId, studentData),
    onSuccess: () => {
      formRef.current?.reset();
      setFormErrors({});
      setIsOpen(false);
    },
    onError: (error) =>
      setFormErrors({
        error: error.message || "Błąd dodawania studenta do grupy",
      }),
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
    const login = formData.get("login");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");

    const studentData = {
      login,
      firstName,
      lastName,
      email,
    };

    mutation.mutate({
      groupId,
      studentData,
    });
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
      <form
        method="dialog"
        className="relative p-6"
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
        <h2 className="text-xl font-semibold mb-4 text-center">
          Dodaj studenta
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputForm
              name="firstName"
              placeholder="Jakub"
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
              placeholder="s123456"
              label="Indeks*"
              required
            />
          </div>
          <div>
            <InputForm
              name="email"
              placeholder="jakow@st.amu.emu.pl"
              label="Mail*"
              type="email"
              required
            />
          </div>
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
            className="border border-black"
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Wysyłanie..." : "Dodaj studenta"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
