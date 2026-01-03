import { useState, useEffect, useCallback } from "react";

export function usePagination(initialPage = 0, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(0);

  const resetPagination = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    resetPagination,
  };
}

export function useAsync(asyncFn, deps = [], options = {}) {
  const { immediate = true, initialData = null, onError } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = err?.message || "Nieznany błąd";
      setError(message);
      if (onError) {
        onError(err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (!immediate) return;
    run();
  }, [run, immediate]);

  return {
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
    run,
  };
}

export function useEditableState(initialState) {
  const [state, setState] = useState(initialState);
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const startEdit = () => {
    setSnapshot(state);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (snapshot) {
      setState(snapshot);
    }
    setSnapshot(null);
    setEditing(false);
    setFormLoading(false);
  };

  const saveWith = async (saveFn) => {
    setFormLoading(true);
    try {
      const updated = await saveFn(state);
      if (updated && typeof updated === "object") {
        setState((prev) => ({ ...prev, ...updated }));
      }
      setSnapshot(null);
      setEditing(false);
      return updated;
    } catch (err) {
      if (snapshot) {
        setState(snapshot);
      }
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  return {
    state,
    setState,
    editing,
    formLoading,
    startEdit,
    cancelEdit,
    saveWith,
    setFormLoading,
  };
}
