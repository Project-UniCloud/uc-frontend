"use client";

import InputForm from "./InputForm";
import { useState } from "react";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { loginUser } from "@/lib/authApi";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginSuccess } from "@/store/authSlice";

const loginSchema = z.object({
  login: z.string().min(5, { message: "Niepoprawny indeks!" }),
  password: z.string().min(1, { message: "Hasło jest wymagane!" }),
});

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (credentials) => loginUser(credentials),
    onSuccess: (userData) => {
      dispatch(loginSuccess(userData.role));
      router.push("/dashboard");
    },
    onError: (error) => {
      setFormErrors({ error: error.message || "Błąd logowania" });
    },
  });

  async function handleSubmit(event) {
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="w-full">
        <InputForm
          name="login"
          placeholder="Wprowadź login"
          label="Login"
          type="text"
          error={formErrors.login?.[0]}
          required
        />
        <InputForm
          name="password"
          placeholder="Wprowadź hasło"
          label="Hasło"
          type="password"
          error={formErrors.password?.[0]}
          required
        />
      </div>

      <div className="flex items-center space-x-2" data-cy="remebeer-me-checkbox">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          className="cursor-pointer"
        />
        <label htmlFor="remember" className="text-sm text-black" data-cy="remebeer-me-text">
          Pamiętaj mnie
        </label>
      </div>

      {formErrors.error && (
        <p className="text-red-400 text-xs">{formErrors.error}</p>
      )}

      <button
        type="submit"
        className={`w-full bg-[#614DE2] text-white p-2 rounded ${
          mutation.isPending
            ? "bg-[#b6acf9] cursor-not-allowed"
            : "hover:bg-indigo-700 cursor-pointer"
        }`}
        disabled={mutation.isPending}
        data-cy="login-submit-button"
      >
        {mutation.isPending ? "Logowanie..." : "Zaloguj"}
      </button>
    </form>
  );
}
