import { CiPause1 } from "react-icons/ci";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiArchive } from "react-icons/fi";
import { archiveGroup, activateGroup } from "@/lib/groupsApi";
import { Button } from "@/components/utils/Buttons";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

export default function ButtonChangeStatus({
  groupId,
  groupStatus,
  hint = "",
}) {
  const router = useRouter();
  const archiveMutation = useMutation({
    mutationFn: (groupId) => archiveGroup(groupId),
    onSuccess: () => {
      router.push("/groups");
      showSuccessToast(
        "Grupa została zarchiwizowana! Jest w zakładce 'Zarchiwizowane'."
      );
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd archiwizacji grupy" });
      showErrorToast("Błąd archiwizacji grupy:" + error?.message);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (groupId) => activateGroup(groupId),
    onSuccess: () => {
      router.push("/groups");
      showSuccessToast("Grupa została aktywowana! Jest w zakładce 'Aktywne'.");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd aktywacji grupy" });
      showErrorToast("Błąd aktywacji grupy:" + error?.message);
    },
  });

  let isLoading = archiveMutation.isPending || activateMutation.isPending;
  return (
    <>
      {groupStatus === "Aktywna" && (
        <Button
          hint={hint}
          label="Archiwizuj"
          color={`bg-orange ${isLoading && "opacity-50"}`}
          center
          onClick={() => archiveMutation.mutate(groupId)}
          disabled={isLoading}
        >
          <FiArchive className="text-lg" />
          {isLoading ? "Ładowanie..." : "Archiwizuj"}
        </Button>
      )}
      {groupStatus === "Nieaktywna" && (
        <Button
          hint={hint}
          label="Aktywuj"
          color={`bg-green ${isLoading && "opacity-50"}`}
          center
          onClick={() => activateMutation.mutate(groupId)}
          disabled={isLoading}
        >
          <CiPause1 className="text-lg" />
          {isLoading ? "Ładowanie..." : "Aktywuj"}
        </Button>
      )}
      {groupStatus === "Zarchiwizowana" && (
        <Button
          hint={hint}
          label="Usuń"
          color={`bg-red ${isLoading && "opacity-50"}`}
          center
          disabled
        >
          <IoPlayCircleOutline className="text-lg" />
          Usuń
        </Button>
      )}
    </>
  );
}
