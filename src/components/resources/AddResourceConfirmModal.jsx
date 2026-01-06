import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../utils/Buttons";
import { FaPlus } from "react-icons/fa";

export function AddResourceConfirmModal({
  isOpen,
  setIsOpen,
  groupName,
  onConfirm,
  selectedDriver,
  selectedResource,
  isPending,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  function handleClose() {
    if (!isPending) {
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
          disabled={isPending}
        >
          <X />
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-3 text-center">
        Potwierdź dodanie dostępu
      </h2>
      <p className="text-gray-600 mb-6 text-center text-lg">
        Wiąże się to z przyznaniem dostępu do wybranej usługi dla danej grupy i
        rozpoczęcie naliczania kosztów.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="font-medium">Sterownik:</span>
            <span className="text-gray-700">{selectedDriver}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Usługa:</span>
            <span className="text-gray-700">{selectedResource}</span>
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
          disabled={isPending}
          className={`border border-black ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          className={`${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Dodawanie..." : "Dodaj"}
          {!isPending && <FaPlus />}
        </Button>
      </div>
    </dialog>
  );
}
