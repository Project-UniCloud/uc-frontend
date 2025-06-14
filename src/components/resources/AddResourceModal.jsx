import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../utils/Buttons";
import { giveCloudResourceAccess } from "@/lib/resource";
import { getCloudAccesses, getCloudResourcesTypes } from "@/lib/cloudApi";

export function AddResourceModal({ isOpen, setIsOpen, groupId }) {
  const dialogRef = useRef(null);
  const [error, setError] = useState({});
  const [resourcesData, setResourcesData] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [loading, setLoading] = useState(true);

  const mutation = useMutation({
    mutationFn: ({ groupId, data }) => giveCloudResourceAccess(groupId, data),
    onSuccess: () => setIsOpen(false),
    onError: (error) =>
      setError({
        error: error.message || "Błąd dodawania usługi",
      }),
  });

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    getCloudAccesses(groupId)
      .then((data) => {
        setDriversData(data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [isOpen, groupId]);

  const handleDriverChange = (event) => {
    const selectedDriver = event.target.value;
    setSelectedDriver(selectedDriver);
    setSelectedResource("");
    setResourcesData([]);

    if (!selectedDriver) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getCloudResourcesTypes(selectedDriver)
      .then((data) => {
        setResourcesData(data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl shadow-xl w-full max-w-xl p-6 m-auto"
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
      <h2 className="text-xl font-semibold mb-10 text-center">Dodaj dostęp</h2>

      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Sterownik</label>
          <select
            value={selectedDriver}
            className="rounded-md border text-sm w-40 border-gray-300 px-1 py-2 shadow-sm focus:border-black focus:outline-none"
            onChange={handleDriverChange}
            disabled={loading || !driversData.length}
          >
            <option value="">Wybierz sterownik</option>
            {driversData.map((driver) => {
              return (
                <option key={driver.value} value={driver.value}>
                  {driver.value}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Usługa</label>
          <select
            value={selectedResource}
            onChange={(event) => {
              setSelectedResource(event.target.value);
            }}
            className={`rounded-md border ${
              !resourcesData.length && "text-gray-300"
            }  border-gray-300 px-1 text-sm py-2 shadow-sm w-40 focus:border-black focus:outline-none`}
            disabled={!resourcesData.length || loading}
          >
            <option value="">Wybierz usługę</option>
            {driversData &&
              !loading &&
              selectedDriver &&
              resourcesData.map((resource) => {
                return (
                  <option key={resource.name} value={resource.name}>
                    {resource.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="flex flex-col w-40">
          <label className="mb-1 text-sm font-medium ">Limit</label>
          <input
            type="number"
            className="rounded-md border text-sm  border-gray-300 px-4 py-2 shadow-sm focus:border-black focus:outline-none"
            placeholder="Wprowadź limit"
          />
        </div>
      </div>
      {error.error && <div className="text-red-600">{error.error}</div>}
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
          disabled={mutation.isLoading || !selectedDriver || !selectedResource}
          onClick={() => {
            mutation.mutate({
              groupId,
              data: {
                cloudAccessClientId: selectedDriver,
                cloudResourceType: selectedResource,
              },
            });
          }}
        >
          Dodaj
        </Button>
      </div>
    </dialog>
  );
}
