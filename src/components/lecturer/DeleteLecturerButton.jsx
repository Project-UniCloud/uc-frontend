import { Button } from "@/components/utils/Buttons";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "../utils/Toast";
import { FaTrash } from "react-icons/fa";
import { deleteLecturer } from "@/lib/lecturersApi";

export default function DeleteLecturerButton({ lecturerId }) {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => deleteLecturer(lecturerId),
    onSuccess: () => {
      router.push(`/lecturer/${lecturerId}`); // ZMIENIĆ NA POPRAWNE
      showSuccessToast("Prowadzący został usunięty!");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd usuwania prowadzącego" });
      showErrorToast("Błąd usuwania prowadzącego:" + error?.message);
    },
  });

  let isLoading = deleteMutation.isPending;
  return (
    <>
      <Button
        hint="Usuń prowadzącego. Ta operacja jest nieodwracalna."
        label="Usuń"
        color={`bg-red ${isLoading && "opacity-50"}`}
        center
        onClick={() => deleteMutation.mutate()}
        // disabled={isLoading}
        disabled
      >
        <FaTrash className="text-lg" />
        {isLoading ? "Ładowanie..." : "Usuń prowadzącego"}
      </Button>
    </>
  );
}
