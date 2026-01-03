"use client";

import InputForm from "./InputForm";
import { useLoginForm } from "@/lib/views/auth/hooks";

export default function LoginForm() {
  const { mutation, formErrors, handleSubmit } = useLoginForm();

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
      >
        {mutation.isPending ? "Logowanie..." : "Zaloguj"}
      </button>
    </form>
  );
}
