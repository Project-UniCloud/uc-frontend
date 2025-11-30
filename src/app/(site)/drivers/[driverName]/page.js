"use client";
import React, {useEffect, useState} from "react";
import Tabs from "@/components/utils/Tabs";
import Table from "@/components/table/Table";
import InputForm from "@/components/utils/InputForm";
import {getGroups} from "@/lib/groupsApi";
import {getCloudAccessesById} from "@/lib/cloudApi";
import Pagination from "@/components/pagination/Pagination";

const TABS = [
  { label: "Ustawienia" },
  { label: "Grupy zajęciowe" },
  { label: "Autoryzacja" },
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
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ustawienia") {
      getCloudAccessesById(driverName)
        .then((data) => {
          setdriverData({
            clean: data.defaultCronExpression,
            limit: data.costLimit,
            name: data.cloudConnectorName,
            status: data.isActive,
            description: data.description || "lorem ipsum dolor sit amet",
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Grupy zajęciowe") {
      getGroups({ page, pageSize, cloudClientId: driverName })
        .then((data) => {
          setGroupsData(data.content || []);
          setTotalPages(data.totalPages || 0);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
    if (activeTab === "Autoryzacja") {
      // getAuthDriver(driverId)
      //   .then((data) => setAuthData(data || []))
      //   .catch((error) => setError(error.message))
      //   .finally(() => setLoading(false));
      setLoading(false);
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
                label="Nazwa"
                name="name"
                type="name"
                value={driverData.name}
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
            <div className=" flex flex-col items-center justify-center mt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Uwagi
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Opis"
                className="w-200 m-auto border border-gray-400 rounded-lg px-3 py-2 min-h-[80px] text-gray-500 font-semibold"
                rows={5}
                defaultValue={driverData.description || ""}
                disabled
                // onChange={handleChange("description")}
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
                />{" "}
              </>
            ) : (
              <div>Brak grup dla tego sterownika.</div>
            )}
          </>
        ))}
      {/* Autoryzacja */}
      {activeTab === "Autoryzacja" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Access Token ID"
                name="accessTokenId"
                value="34fc8E22-9A3B-4F89-8C3E-1234567890AB"
                disabled
              />
              <InputForm
                label="Limit kosztów"
                name="cost"
                value="3000"
                disabled
              />
              <InputForm
                label="Access Token"
                name="accessToken"
                value="s3cr3tT0k3n_AbCdEfGhIjKlMnOpQrStUvWxYz"
                disabled
              />
            </div>
            <div className=" flex flex-col items-center justify-center mt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Uwagi
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Opis"
                className="w-200 m-auto border border-gray-400 rounded-lg px-3 py-2 min-h-[80px]"
                rows={5}
                defaultValue="lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                disabled
              />
            </div>
          </>
        ))}
    </div>
  );
}
