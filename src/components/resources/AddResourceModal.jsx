import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../utils/Buttons";
import { giveCloudResourceAccess } from "@/lib/resourceApi";
import { getCloudAccesses, getCloudResourcesTypes } from "@/lib/cloudApi";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

export function AddResourceModal({ isOpen, setIsOpen, groupId }) {
  const dialogRef = useRef(null);
  const [error, setError] = useState({});
  const [resourcesData, setResourcesData] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(true);

  const mutation = useMutation({
    mutationFn: ({ groupId, data }) => giveCloudResourceAccess(groupId, data),
    onSuccess: () => {
      setIsOpen(false);
      setSelectedDriver("");
      setSelectedResource("");
      setResourcesData([]);
      setDriversData([]);
      setLimit("");
      showSuccessToast("Dostęp do usługi został dodany!");
    },
    onError: (error) => {
      setError({
        error: error.message || "Błąd dodawania usługi",
      })
        showErrorToast("Błąd dodawania usługi: " + error?.message);
    },
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
        setDriversData(data.content);
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
            required
            value={selectedDriver}
            className="rounded-md border text-sm w-40 border-gray-300 px-1 py-2 shadow-sm focus:border-black focus:outline-none"
            onChange={handleDriverChange}
            disabled={loading || !driversData.length}
          >
            <option value="">Wybierz sterownik</option>
            {driversData.map((driver) => {
              return (
                <option
                  key={driver.cloudConnectorId}
                  value={driver.cloudConnectorId}
                >
                  {driver.cloudConnectorId}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Usługa</label>
          <select
            required
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
            required
            className="rounded-md border text-sm  border-gray-300 px-4 py-2 shadow-sm focus:border-black focus:outline-none"
            placeholder="Wprowadź limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
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
          disabled={mutation.isPending}
          className={`border border-black ${
            mutation.isPending && "opacity-50"
          }`}
        >
          Anuluj
        </Button>
        <Button
          className={`${
            (mutation.isPending || !selectedDriver || !selectedResource) &&
            "opacity-50 hover:cursor-not-allowed"
          }
          } `}
          type="submit"
          disabled={mutation.isPending || !selectedDriver || !selectedResource}
          onClick={() => {
            mutation.mutate({
              groupId,
              data: {
                cloudConnectorId: selectedDriver,
                cloudResourceType: selectedResource,
                costLimit: limit,
              },
            });
          }}
        >
          {mutation.isPending ? "Wysyłanie..." : "Dodaj"}
        </Button>
      </div>
    </dialog>
  );
}
