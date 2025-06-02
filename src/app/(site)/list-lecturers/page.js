"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/usersApi";

export default function ListLecturerPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const config = useConfig();

  useEffect(() => {
    // Podstaw dowolne userId do testu
    getUser(
      "dd978dc3-661d-4a72-a210-51bfcecb33e3",
      config.NEXT_PUBLIC_API_BASE_URL
    )
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>List of Lecturers</h1>
      <p>Welcome to the list of lecturers</p>
      {error && <div className="text-red-600">Błąd: {error}</div>}
      {user ? (
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        !error && <div>Ładowanie danych użytkownika...</div>
      )}
    </div>
  );
}
