import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../utils/Buttons";
import { addStudentsToGroup } from "@/lib/studentApi";
import DragDrop from "../utils/DragDrop";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

export function ImportStudentsModal({ isOpen, setIsOpen, groupId }) {
  const dialogRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const mutation = useMutation({
    mutationFn: ({ groupId, file }) => addStudentsToGroup(groupId, file),
    onSuccess: () => {
      setFile(null);
      setIsOpen(false);
      setErrors({});
      showSuccessToast("Studenci zostali dodani do grupy!");
    },
    onError: (error) => {
      setErrors({
        error: error.message || "Błąd dodawania studenta do grupy",
      }),
        showErrorToast("Błąd dodawania studentów do grupy: " + error?.message);
    },
  });

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

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
      <DragDrop onDropFile={(file) => setFile(file)} />

      {errors.error && <div className="text-red-600">{errors.error}</div>}

      <div className="flex justify-end items-center gap-4 pt-10">
        <Button
          type="button"
          onClick={handleClose}
          color="bg-white"
          textColor="text-black"
          className={`border border-black ${
            mutation.isPending && "opacity-50"
          }`}
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          disabled={!file || mutation.isPending}
          onClick={() => {
            mutation.mutate({ groupId, file });
          }}
          className={`${mutation.isPending && "opacity-50"}`}
        >
          {mutation.isPending ? "Wysyłanie..." : "Dodaj studentów"}
        </Button>
      </div>
    </dialog>
  );
}
