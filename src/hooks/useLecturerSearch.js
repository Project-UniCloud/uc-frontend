import { useState, useEffect } from "react";
import { searchLecturers } from "@/lib/api/usersApi";

export function useLecturerSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!active) return;
      setLoading(true);

      searchLecturers(query)
        .then((data) => {
          if (active) setResults(data);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
}
