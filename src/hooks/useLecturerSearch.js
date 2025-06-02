// src/hooks/useLecturerSearch.js
import { useState, useEffect } from "react";
import { searchLecturers } from "@/lib/usersApi";

export function useLecturerSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const config = useConfig();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);

      searchLecturers(query, config.NEXT_PUBLIC_API_BASE_URL)
        .then(setResults)
        .catch((err) => {
          console.error(err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
}
