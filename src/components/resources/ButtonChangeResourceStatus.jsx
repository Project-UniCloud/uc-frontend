import { CiPause1 } from "react-icons/ci";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiArchive } from "react-icons/fi";
import {
  deleteResource,
  deactivationResource,
  activationResource,
} from "@/lib/resourceApi";
import { Button } from "@/components/utils/Buttons";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

export default function ButtonChangeResourceStatus({
  groupId,
<<<<<<< HEAD
  resourceStatus,
  resourceId,
}) {
  console.log(resourceId);
  const router = useRouter();
  const deactivationMutation = useMutation({
    mutationFn: () => {
      console.log("Mutating deactivation for:", groupId, resourceId);
      deactivationResource(groupId, resourceId);
    },
=======
  resourceStatus = "Aktywna",
  resourceId,
}) {
  const router = useRouter();
  const deactivationMutation = useMutation({
    mutationFn: (groupId, resourceId) =>
      deactivationResource(groupId, resourceId),
>>>>>>> a8ccee8 (Add details to group's resource page)
    onSuccess: () => {
      router.push(`/groups/${groupId}`);
      showSuccessToast("Usługa została zdezaktywowana!");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd dezaktywowania usługi" });
      showErrorToast("Błąd dezaktywowania usługi:" + error?.message);
    },
  });

  const deleteMutation = useMutation({
<<<<<<< HEAD
    mutationFn: () => deleteResource(groupId, resourceId),
=======
    mutationFn: (groupId, resourceId) => deleteResource(groupId, resourceId),
>>>>>>> a8ccee8 (Add details to group's resource page)
    onSuccess: () => {
      router.push(`/groups/${groupId}`);
      showSuccessToast("Usługa została usunięta!");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd usuwania usługi" });
      showErrorToast("Błąd usuwania usługi:" + error?.message);
    },
  });

  const activationMutation = useMutation({
<<<<<<< HEAD
    mutationFn: () => activationResource(groupId, resourceId),
=======
    mutationFn: (groupId, resourceId) =>
      activationResource(groupId, resourceId),
>>>>>>> a8ccee8 (Add details to group's resource page)
    onSuccess: () => {
      router.push(`/groups/${groupId}`);
      showSuccessToast("Usługa została aktywowana!");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd aktywacji usługi" });
      showErrorToast("Błąd aktywacji usługi:" + error?.message);
    },
  });

  let isLoading =
    deactivationMutation.isPending ||
    deleteMutation.isPending ||
    activationMutation.isPending;
  return (
    <>
<<<<<<< HEAD
      {resourceStatus === "ACTIVE" && (
=======
      {resourceStatus === "Aktywna" && (
>>>>>>> a8ccee8 (Add details to group's resource page)
        <Button
          label="Dezaktywuj"
          color={`bg-orange ${isLoading && "opacity-50"}`}
          center
<<<<<<< HEAD
          onClick={() => deactivationMutation.mutate()}
          // onClick={() => console.log(resourceId)}
=======
          onClick={() => deactivationMutation.mutate(groupId, resourceId)}
>>>>>>> a8ccee8 (Add details to group's resource page)
          disabled={isLoading}
        >
          <FiArchive className="text-lg" />
          {isLoading ? "Ładowanie..." : "Dezaktywuj"}
        </Button>
      )}
<<<<<<< HEAD
      {resourceStatus === "INACTIVE" && (
=======
      {resourceStatus === "Nieaktywna" && (
>>>>>>> a8ccee8 (Add details to group's resource page)
        <Button
          label="Aktywuj"
          color={`bg-green ${isLoading && "opacity-50"}`}
          center
<<<<<<< HEAD
          onClick={() => activationMutation.mutate()}
=======
          onClick={() => activateMutation.mutate(groupId, resourceId)}
>>>>>>> a8ccee8 (Add details to group's resource page)
          disabled={isLoading}
        >
          <CiPause1 className="text-lg" />
          {isLoading ? "Ładowanie..." : "Aktywuj"}
        </Button>
      )}
<<<<<<< HEAD
      {resourceStatus === "DEACTIVATED" && (
=======
      {resourceStatus === "Zdezaktywowana" && (
>>>>>>> a8ccee8 (Add details to group's resource page)
        <Button
          label="Usuń"
          color={`bg-red ${isLoading && "opacity-50"}`}
          center
<<<<<<< HEAD
          onClick={() => deleteMutation.mutate()}
=======
          onClick={() => deleteMutation.mutate(groupId, resourceId)}
>>>>>>> a8ccee8 (Add details to group's resource page)
          disabled={isLoading}
        >
          <IoPlayCircleOutline className="text-lg" />
          {isLoading ? "Ładowanie..." : "Usuń"}
        </Button>
      )}
    </>
  );
}
