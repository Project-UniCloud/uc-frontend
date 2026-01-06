import { useState } from "react";
import { getCloudAccesses } from "@/lib/api/cloudApi";
import { usePagination, useAsync } from "@/lib/views/shared/hooks";

export function useDriversPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { page, setPage, pageSize, setPageSize, totalPages, setTotalPages } =
    usePagination();

  const {
    data: drivers = [],
    loading,
    error,
    run: fetchCloudAccesses,
  } = useAsync(
    () =>
      getCloudAccesses({ page, pageSize }).then((data) => {
        setTotalPages(data.page.totalPages);
        return data.content;
      }),
    [page, pageSize, setTotalPages],
    { initialData: [] }
  );

  const tableData = drivers.map((driver, idx) => ({
    ...driver,
    id: idx + 1,
  }));

  return {
    drivers,
    loading,
    error,
    isOpen,
    setIsOpen,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchCloudAccesses,
    tableData,
  };
}
