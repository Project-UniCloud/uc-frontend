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
    mutationFn: () => deleteResource(groupId, resourceId),
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
    mutationFn: () => activationResource(groupId, resourceId),
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
      {resourceStatus === "ACTIVE" && (
        <Button
          label="Dezaktywuj"
          color={`bg-orange ${isLoading && "opacity-50"}`}
          center
          onClick={() => deactivationMutation.mutate()}
          // onClick={() => console.log(resourceId)}
          disabled={isLoading}
        >
          <FiArchive className="text-lg" />
          {isLoading ? "Ładowanie..." : "Dezaktywuj"}
        </Button>
      )}
      {resourceStatus === "INACTIVE" && (
        <Button
          label="Aktywuj"
          color={`bg-green ${isLoading && "opacity-50"}`}
          center
          onClick={() => activationMutation.mutate()}
          disabled={isLoading}
        >
          <CiPause1 className="text-lg" />
          {isLoading ? "Ładowanie..." : "Aktywuj"}
        </Button>
      )}
      {resourceStatus === "DEACTIVATED" && (
        <Button
          label="Usuń"
          color={`bg-red ${isLoading && "opacity-50"}`}
          center
          onClick={() => deleteMutation.mutate()}
          disabled={isLoading}
        >
          <IoPlayCircleOutline className="text-lg" />
          {isLoading ? "Ładowanie..." : "Usuń"}
        </Button>
      )}
    </>
  );
}
