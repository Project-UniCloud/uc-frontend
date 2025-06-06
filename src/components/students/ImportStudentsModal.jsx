import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../Buttons";
import { addStudentsToGroup } from "@/lib/studentApi";
import Basic from "../DragDrop";

export function ImportStudentsModal({ isOpen, setIsOpen, groupId }) {
  const dialogRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const mutation = useMutation({
    mutationFn: ({ groupId, file }) => addStudentsToGroup(groupId, file),
    onSuccess: () => {
      setFile(null);
      setIsOpen(false);
    },
    onError: (error) =>
      setErrors({
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

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const login = formData.get("login");
  //   const firstName = formData.get("firstName");
  //   const lastName = formData.get("lastName");
  //   const email = formData.get("email");

  //   const studentData = {
  //     login,
  //     firstName,
  //     lastName,
  //     email,
  //   };
  //   console.log("Dodawanie studenta:", groupId, studentData);

  //   mutation.mutate({
  //     groupId,
  //     studentData,
  //   });
  // }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl shadow-xl w-full max-w-lg p-6 m-auto"
      onClose={handleClose}
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
      <h2 className="text-xl font-semibold mb-4 text-center">Dodaj plik CSV</h2>
      <Basic onDropFile={(file) => setFile(file)} />

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
        <Button
          type="submit"
          disabled={!file || mutation.isLoading}
          onClick={() => {
            console.log("Wysyłanie pliku:", file);
            mutation.mutate({ groupId, file });
          }}
        >
          {mutation.isLoading ? "Wysyłanie..." : "Dodaj studentów"}
        </Button>
      </div>
    </dialog>
  );
}
