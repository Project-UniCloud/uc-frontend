"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/authApi";
import { loginSuccess } from "@/store/authSlice";
import { loginSchema } from "@/lib/views/auth/schemas";

export function useLoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (credentials) => loginUser(credentials),
    onSuccess: (userData) => {
      dispatch(loginSuccess(userData));
      router.push("/dashboard");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd logowania" });
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const result = loginSchema.safeParse({
      login: formData.get("login"),
      password: formData.get("password"),
    });

    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFormErrors({});
    mutation.mutate(result.data);
  };

  return {
    mutation,
    formErrors,
    setFormErrors,
    handleSubmit,
  };
}
