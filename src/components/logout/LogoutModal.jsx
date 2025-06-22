import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../utils/Buttons";
import { logoutUser } from "@/lib/authApi";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/authSlice";

export function LogoutModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      dispatch(logoutAction());
      setIsOpen(false);
      router.push("/login");
    },
    onError: (error) =>
      setErrors({
        error: error.message || "Błąd podczas wylogowania",
      }),
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
      <h2 className="text-xl font-semibold mb-10 text-center">Wylogowanie</h2>
      <p className="text-gray-600 mb-6 text-center text-xl ">
        Czy chcesz się wylogować?
      </p>
      {errors.error && <div className="text-red-600">{errors.error}</div>}
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
          color={`bg-red ${
            mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate();
          }}
        >
          {mutation.isPending ? "Wylogowywanie..." : "Wyloguj"}
        </Button>
      </div>
    </dialog>
  );
}
