import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addDriver } from "@/lib/driversApi";
import InputForm from "../utils/InputForm";
import { Button } from "../utils/Buttons";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

export default function AddDriverModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (driverData) => addDriver(driverData),
    onSuccess: () => {
      setIsOpen(false), setFormErrors({}), formRef.current?.reset();
      showSuccessToast(
        "Sterownik dodany! Odśwież stronę, aby zobaczyć zmiany."
      );
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd dodawania sterownika" }),
        showErrorToast("Błąd dodawania sterownika: " + error?.message);
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
    const cloudConnectorId = formData.get("cloudConnectorId");
    const host = formData.get("host");
    const port = formData.get("port");
    const defaultCostLimit = formData.get("defaultCostLimit");
    const cronExpression = formData.get("cronExpression");
    const name = formData.get("name");

    const driverData = {
      cloudConnectorId,
      host,
      port,
      defaultCostLimit,
      cronExpression,
      name,
    };

    mutation.mutate(driverData);
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
          <h2 className="text-xl font-semibold mb-6">Dodaj sterownik</h2>
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
        <div className="grid grid-cols-2 gap-4">
          <InputForm
            name="cloudConnectorId"
            placeholder="ID sterownika w chmurze"
            label="ID sterownika w chmurze*"
            type="text"
            required
          />
          <InputForm
            name="name"
            placeholder="Nazwa"
            label="Nazwa*"
            type="text"
            required
          />

          <InputForm
            name="host"
            placeholder="Host sterownika"
            label="Host sterownika*"
            type="text"
            required
          />
          <InputForm
            name="port"
            placeholder="Port sterownika"
            label="Port sterownika*"
            type="text"
            required
          />
          <InputForm
            name="defaultCostLimit"
            placeholder="Limit kosztów"
            label="Limit kosztów*"
            type="text"
            required
          />
          <InputForm
            name="cronExpression"
            placeholder="Czyszczenie CRON"
            label="Czyszczenie CRON*"
            type="text"
            required
          />
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
            {mutation.isPending ? "Dodawanie..." : "Dodaj sterownik"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
