import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addResourceType } from "@/lib/resourceApi";
import InputForm from "../utils/InputForm";
import { Button } from "../utils/Buttons";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

export default function AddResourceTypeModal({
  isOpen,
  setIsOpen,
  cloudConnectorId,
}) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (resourceTypeData) => addResourceType(resourceTypeData),
    onSuccess: () => {
      setIsOpen(false), setFormErrors({}), formRef.current?.reset();
      showSuccessToast(
        "Typ zasobu dodany! Odśwież stronę, aby zobaczyć zmiany."
      );
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd dodawania typu zasobu" }),
        showErrorToast("Błąd dodawania typu zasobu: " + error?.message);
    },
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
    const name = formData.get("name");

    const resourceTypeData = {
      cloudConnectorId,
      resourceType: name,
    };

    mutation.mutate(resourceTypeData);
  }
  function handleClose() {
    setIsOpen(false);
    setFormErrors({}), formRef.current?.reset();
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
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold mb-6">Dodaj typ zasobu</h2>
          <button
            type="button"
            className={` text-gray-500 hover:text-black cursor-pointer ${
              mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            <X />
          </button>
        </div>
        {/* <div className="grid grid-cols-1 gap-4"> */}
        <InputForm
          name="name"
          placeholder="Nazwa typu zasobu"
          label="Nazwa typu zasobu*"
          type="text"
          required
        />
        {/* </div> */}

        {formErrors.error && (
          <div className="text-red-600">{formErrors.error}</div>
        )}

        <div className="flex justify-end gap-4 pt-4">
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
            type="submit"
            disabled={mutation.isPending}
            className={`${
              mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {mutation.isPending ? "Dodawanie..." : "Dodaj typ zasobu"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
