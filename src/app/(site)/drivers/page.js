"use client";
import { useEffect, useState } from "react";
import { getCloudAccesses } from "@/lib/cloudApi";
import DataTableView from "@/components/views/DataTableView";
import AddDriverModal from "@/components/drivers/AddDriverModal";
import { Button } from "@/components/utils/Buttons";
import { FaPlus } from "react-icons/fa";

const columns = [
  { key: "cloudConnectorId", header: "ID" },
  { key: "cloudConnectorName", header: "Nazwa" },
  { key: "costLimit", header: "Limit Kosztu" },
  { key: "defaultCronExpression", header: "Wyczyść" },
];

export default function GroupsPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getCloudAccesses({ page, pageSize })
      .then((data) => {
        setDrivers(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [page, pageSize]);

  const tableData = drivers.map((driver, idx) => ({
    ...driver,
    id: idx + 1,
  }));

  return (
    <div className="min-w-120">
      <AddDriverModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <DataTableView
        leftActions={
          <Button
            onClick={() => setIsOpen(true)}
            hint="Tworzy nowe polaczenie do sterownika chmurowego. Czym jest sterownik do chmury mozna przeczytac w dokumentacji."
          >
            <FaPlus /> Dodaj sterownik
          </Button>
        }
        loading={loading}
        error={error}
        data={tableData}
        columns={columns}
        whereNavigate="drivers"
        idKey={"cloudConnectorId"}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
