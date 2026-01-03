"use client";

import { useState } from "react";
import { getLecturers } from "@/lib/api/lecturersApi";
import { usePagination, useAsync } from "@/lib/views/shared/hooks";

export function useListLecturersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { page, setPage, pageSize, setPageSize, totalPages, setTotalPages } =
    usePagination();

  const {
    data: lecturers = [],
    loading,
    error,
    run: fetchLecturers,
  } = useAsync(
    () =>
      getLecturers({ searchQuery, page, pageSize }).then((data) => {
        setTotalPages(data.page.totalPages);
        return (data.content || []).map((item) => ({
          ...item,
          id: item.uuid,
          groupId: item.uuid,
        }));
      }),
    [searchQuery, page, pageSize, setTotalPages],
    { initialData: [] }
  );

  return {
    lecturers,
    loading,
    error,
    isOpen,
    searchQuery,
    page,
    pageSize,
    totalPages,
    setIsOpen,
    setSearchQuery,
    setPage,
    setPageSize,
    fetchLecturers,
  };
}
