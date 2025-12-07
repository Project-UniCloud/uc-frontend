import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../utils/Buttons";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteResourceType } from "@/lib/resourceApi";

export default function DeleteResourceModal({
  isOpen,
  setIsOpen,
  resourceId,
  groupId,
}) {
  const dialogRef = useRef(null);
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: ({ groupId, resourceId }) => {
      const data = {
        groupId,
        resourceId,
      };
      return deleteResourceType(data);
    },
    onSuccess: () => {
      setIsOpen(false), setErrors({}), formRef.current?.reset();
      setSelectedResourceTypeId(null);
      showSuccessToast(
        "Typ zasobu usunięty! Odśwież stronę, aby zobaczyć zmiany."
      );
    },
    onError: (error) => {
      setErrors({ error: error.message || "Błąd usuwania typu zasobu" }),
        showErrorToast("Błąd usuwania typu zasobu: " + error?.message);
      setSelectedResourceTypeId(null);
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
    setErrors({});
    setSelectedResourceTypeId(null);
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
      <h2 className="text-xl font-semibold mb-10 text-center">
        Usuń typ zasobu
      </h2>
      <p className="text-gray-600 mb-6 text-center text-xl ">
        Czy jesteś pewny, że chcesz usunąć ten typ zasobu?
      </p>
      {errors.error && <div className="text-red-600">{errors.error}</div>}
      <div className="flex justify-end items-center gap-4 pt-10">
        <Button
          type="button"
          onClick={handleClose}
          color="bg-white"
          textColor="text-black"
          disabled={mutation.isPending}
          className={`border border-black ${
            mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Anuluj
        </Button>
        <Button
          color="bg-red-600"
          type="submit"
          className={`${
            mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => mutation.mutate({ resourceTypeId, cloudConnectorId })}
        >
          {mutation.isLoading ? "Usuwanie..." : "Usuń"}
          <FaRegTrashAlt />
        </Button>
      </div>
    </dialog>
  );
}
