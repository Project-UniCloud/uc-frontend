import { useState, useEffect } from "react";
import { externalSearchLecturers } from "@/lib/api/lecturersApi";

export function useLecturerExternalSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);

      externalSearchLecturers(query)
        .then(setResults)
        .catch(() => {
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
}
