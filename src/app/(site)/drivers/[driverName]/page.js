"use client";
import React, { useEffect, useState } from "react";
import Tabs from "@/components/utils/Tabs";
import Table from "@/components/table/Table";
import InputForm from "@/components/utils/InputForm";
import { getGroups } from "@/lib/groupsApi";
import { getCloudAccessesById } from "@/lib/cloudApi";
import { getResourceTypesByDriverId } from "@/lib/cloudApi";
import Pagination from "@/components/pagination/Pagination";
import DataTableView from "@/components/views/DataTableView";
import { Button } from "@/components/utils/Buttons";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import AddResourceTypeModal from "@/components/resources/AddResourceTypeModal";
import DeleteResourceTypeModal from "@/components/resources/DeleteResourceTypeModal";

const TABS = [
  { label: "Ustawienia" },
  { label: "Grupy zajęciowe" },
  { label: "Typy zasobów" },
];

export default function GroupPage({ params }) {
  const { driverName } = React.use(params);

  const [activeTab, setActiveTab] = useState("Ustawienia");
  const [driverData, setdriverData] = useState({
    clean: "",
    limit: "",
    name: "",
    description: "",
    status: "",
  });
  const [driverResourceTypesData, setDriverResourceTypesData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedResourceTypeId, setSelectedResourceTypeId] = useState(null);

  const columns = [
    { key: "name", header: "Nazwa zasobu" },
    {
      key: "actions",
      header: "Wyczyść",
      render: (row) => (
        <button
          className="text-red hover:text-red-800 text-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpenDeleteModal(true);
            setSelectedResourceTypeId(row.name);
          }}
        >
          <FaRegTrashAlt />
        </button>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ustawienia") {
      getCloudAccessesById(driverName)
        .then((data) => {
          setdriverData({
            id: data.cloudConnectorId,
            name: data.cloudConnectorName,
            clean: data.defaultCronExpression,
            limit: data.costLimit,
            status: data.isActive,
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Grupy zajęciowe") {
      getGroups({ page, pageSize, cloudClientId: driverName })
        .then((data) => {
          setGroupsData(data.content || []);
          setTotalPages(data.page.totalPages || 0);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
    if (activeTab === "Typy zasobów") {
      getResourceTypesByDriverId(driverName)
        .then((data) => {
          setDriverResourceTypesData(data || []);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [activeTab, driverName, page, pageSize]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(0);
    setPageSize(10);
  };
  const tableData = groupsData.map((group, idx) => ({
    ...group,
    id: idx + 1,
  }));

  //   const handleChange = (fieldName) => (event) => {
  //     const newValue = event.target.value;
  //     setdriverData((prev) => ({ ...prev, [fieldName]: newValue }));
  //   };

  //   const handleEditClick = async () => {
  //     if (editing) {
  //       setError(null);
  //       setFormLoading(true);
  //       try {
  //         const updated = await updateGroup(driverId, {
  //           name: driverData.name,
  //           lecturers: driverData.lecturers.map((t) => t.id),
  //           startDate: formatDateToDDMMYYYY(driverData.startDate),
  //           endDate: formatDateToDDMMYYYY(driverData.endDate),
  //           description: driverData.description || "",
  //         });
  //         setdriverData((prev) => ({ ...prev, ...updated }));
  //         showSuccessToast("Grupa została zaktualizowana pomyślnie.");
  //         setEditing(false);
  //       } catch (error) {
  //         setError(error.message);
  //         showErrorToast("Błąd podczas aktualizacji grupy: " + error.message);
  //       } finally {
  //         setFormLoading(false);
  //       }
  //     } else {
  //       setFormLoading(false);
  //       setEditing(true);
  //     }
  //   };

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        <AddResourceTypeModal
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          cloudConnectorId={driverName}
        />
        <DeleteResourceTypeModal
          isOpen={isOpenDeleteModal}
          setIsOpen={setIsOpenDeleteModal}
          resourceTypeId={selectedResourceTypeId}
          setSelectedResourceTypeId={setSelectedResourceTypeId}
          cloudConnectorId={driverName}
        />
        {/* {activeTab === "Ustawienia" && !loading && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={handleEditClick}
          >
            {editing ? "Zapisz" : "Edytuj"}
          </Button>
        )} */}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Ustawienia */}
      {activeTab === "Ustawienia" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3 "
            >
              <InputForm
                label="ID Sterownika"
                name="id"
                type="text"
                value={driverData.id}
                disabled
              />
              <InputForm
                label="Nazwa"
                name="name"
                type="name"
                value={driverData.name}
                disabled
              />
              <InputForm
                label="Wyczyść"
                name="clean"
                value={driverData.clean}
                disabled
              />
              <InputForm
                label="Wyczyść"
                name="clean"
                value={driverData.clean}
                disabled
              />
              <InputForm
                label="Limit kosztów"
                name="cost"
                value={driverData.limit}
                disabled
              />
              <InputForm
                label="Status"
                name="status"
                colors={driverData.status ? "text-green" : "text-red"}
                center
                value={driverData.status ? "Aktywny" : "Nieaktywny"}
                disabled
              />
            </div>
          </>
        ))}
      {/* Grupy zajęciowe */}
      {activeTab === "Grupy zajęciowe" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            {groupsData.length > 0 ? (
              <>
                <Table
                  columns={[
                    { key: "id", header: "ID" },
                    { key: "name", header: "Nazwa" },
                    { key: "lecturers", header: "Prowadzący" },
                    { key: "cloudAccesses", header: "Usługi" },
                    { key: "semester", header: "Semestr" },
                    { key: "endDate", header: "Data Zakończenia" },
                  ]}
                  data={tableData}
                />
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                />
              </>
            ) : (
              <div>Brak grup dla tego sterownika.</div>
            )}
          </>
        ))}

      {/* Typy zasobów */}
      {activeTab === "Typy zasobów" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <DataTableView
              leftActions={
                <Button
                  hint="Tworzy nowe polaczenie do sterownika chmurowego. Czym jest sterownik do chmury mozna przeczytac w dokumentacji."
                  onClick={() => setIsOpenAddModal(true)}
                >
                  <FaPlus /> Dodaj typ zasobu
                </Button>
              }
              loading={loading}
              error={error}
              data={driverResourceTypesData}
              columns={columns}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
            />
          </>
        ))}
    </div>
  );
}
