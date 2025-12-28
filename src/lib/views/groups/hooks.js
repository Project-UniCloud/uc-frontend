"use client";

import { useState, useEffect } from "react";
import { getGroups } from "@/lib/groupsApi";
import { groupSearchSchema } from "./schemas";

export function useGroupsPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchGroups = () => {
    setLoading(true);
    setError(null);
    getGroups({ status: activeTab, page, pageSize, groupName: search })
      .then((data) => {
        setGroups(data.content);
        setTotalPages(data.page.totalPages);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroups();
  }, [activeTab, page, pageSize, search]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(0);
    setPageSize(10);
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
