import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../utils/Buttons";
import { CiPause1 } from "react-icons/ci";

export function StopAllModal({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  //   const mutation = useMutation({
  //     mutationFn: ({ groupId }) => stopResourcesGroup(groupId),
  //     onSuccess: () => setIsOpen(false),
  //     onError: (error) =>
  //       setErrors({
  //         error: error.message || "Błąd wstrzymywania usług grupy",
  //       }),
  //   });

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
      <h2 className="text-xl font-semibold mb-10 text-center">
        Wstrzymanie wszystkich usług
      </h2>
      <p className="text-gray-600 mb-6 text-center text-xl ">
        Czy jesteś pewny, że chcesz wstrzymać wszystkie usługi?
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
          color="bg-[#CD6200]"
          type="submit"
          // disabled={mutation.isLoading}
          //   onClick={() => {
          //     mutation.mutate({groupId});
          //   }}
        >
          {/* {mutation.isLoading ? "Wstrzymywanie..." : "Wstrzymaj"} */}
          <CiPause1 />
          Wstrzymaj
        </Button>
      </div>
    </dialog>
  );
}
