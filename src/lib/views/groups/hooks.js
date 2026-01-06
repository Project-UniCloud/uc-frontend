"use client";

import { useState } from "react";
import { getGroups } from "@/lib/api/groupsApi";
import { usePagination, useAsync } from "@/lib/views/shared/hooks";
import { groupSearchSchema } from "./schemas";

export function useGroupsPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    resetPagination,
  } = usePagination();

  const {
    data: groups = [],
    loading,
    error,
    setError,
    run: fetchGroups,
  } = useAsync(
    () =>
      getGroups({ status: activeTab, page, pageSize, groupName: search }).then(
        (data) => {
          setTotalPages(data.page.totalPages);
          return data.content;
        }
      ),
    [activeTab, page, pageSize, search, setTotalPages],
    { initialData: [] }
  );

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetPagination();
    setSearch("");
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    const result = groupSearchSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError("");
    setSearch(value);
    setPage(0);
  };

  return {
    activeTab,
    groups,
    loading,
    error,
    isOpen,
    page,
    pageSize,
    totalPages,
    search,
    setPage,
    setPageSize,
    setIsOpen,
    handleTabChange,
    onSearchChange,
    fetchGroups,
    setError,
  };
}
