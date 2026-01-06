import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../utils/Buttons";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "../utils/Toast";
import { deleteStudent } from "@/lib/api/studentApi";

export default function DeleteStudentModal({
  isOpen,
  setIsOpen,
  studentId,
  groupId,
  studentName,
  groupName,
}) {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => deleteStudent(groupId, studentId),
    onSuccess: () => {
      router.replace(`/groups/${groupId}`);
      showSuccessToast("Student został usunięty!");
    },
    onError: (error) => {
      showErrorToast("Błąd usuwania studenta: " + error?.message);
    },
  });
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  function handleClose() {
    if (!deleteMutation.isPending) {
      dialogRef.current?.close();
      setIsOpen(false);
    }
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
          className="text-gray-500 hover:text-black cursor-pointer"
          onClick={handleClose}
          disabled={deleteMutation.isPending}
        >
          <X />
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-3 text-center">
        Czy napewno chcesz usunąć studenta z grupy?
      </h2>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="font-medium">Student:</span>
            <span className="text-gray-700">{studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Grupa:</span>
            <span className="text-gray-700">{groupName}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 pt-4">
        <Button
          type="button"
          onClick={handleClose}
          color="bg-white"
          textColor="text-black"
          disabled={deleteMutation.isPending}
          className={`border border-black ${
            deleteMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Anuluj
        </Button>
        <Button
          color={`bg-red ${deleteMutation.isPending && "opacity-50"}`}
          center
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          <FaTrash className="text-lg" />
          {deleteMutation.isPending ? "Usuwanie..." : "Usuń"}
        </Button>
      </div>
    </dialog>
  );
}
