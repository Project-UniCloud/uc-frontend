"use client";
import React, { useState, useEffect } from "react";
import Tabs from "@/components/utils/Tabs";
import DataTableView from "@/components/views/DataTableView";
import InputForm from "@/components/utils/InputForm";
import TeacherSearchInput from "@/components/utils/TeacherSearchInput";
import { useLecturerSearch } from "@/hooks/useLecturerSearch";
import { Button } from "@/components/utils/Buttons";
import { getGroupById, updateGroup } from "@/lib/groupsApi";
import { getStudentsFromGroup } from "@/lib/studentApi";
import { FaPlus } from "react-icons/fa";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { ImportStudentsModal } from "@/components/students/ImportStudentsModal";
import { CiPause1 } from "react-icons/ci";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import { getResourcesGroup } from "@/lib/resourceApi";
import { StopAllModal } from "@/components/resources/StopAllModal";
import { AddResourceModal } from "@/components/resources/AddResourceModal";
import ButtonChangeStatus from "@/components/group/ButtonChangeStatus";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";
import Hint from "@/components/utils/Hint";

const TABS = [{ label: "Ogólne" }, { label: "Studenci" }, { label: "Usługi" }];

export default function GroupPage({ params }) {
  const { groupId } = React.use(params);
  const [activeTab, setActiveTab] = useState("Ogólne");
  const [groupData, setGroupData] = useState({
    name: "",
    lecturers: [],
    startDate: "",
    endDate: "",
    description: "",
    status: "",
  });
  const [studentsData, setStudentsData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenStudent, setIsOpenStudent] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenResource, setIsOpenResource] = useState(false);
  const [isOpenStopAll, setIsOpenStopAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snapshotGroupData, setSnapshotGroupData] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ogólne") {
      getGroupById(groupId)
        .then((data) => {
          const teachers = data.lecturerFullNames.map((l) => ({
            id: l.userId,
            fullName: `${l.firstName} ${l.lastName}`,
          }));

          setGroupData({
            name: data.name,
            lecturers: teachers,
            startDate: formatDateToYYYYMMDD(data.startDate),
            endDate: formatDateToYYYYMMDD(data.endDate),
            description: data.description || "",
            status: data.status,
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Studenci") {
      getStudentsFromGroup({ groupId, page, pageSize })
        .then((data) => {
          setStudentsData(data.content || []);
          setTotalPages(data.page.totalPages || 0);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
    if (activeTab === "Usługi") {
      getResourcesGroup(groupId)
        .then((data) => setResourcesData(data || []))
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [activeTab, groupId, page, pageSize]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setEditing(false);
    setPage(0);
    setPageSize(10);
  };

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setGroupData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      setFormLoading(true);
      try {
        const updated = await updateGroup(groupId, {
          name: groupData.name,
          lecturers: groupData.lecturers.map((t) => t.id),
          startDate: formatDateToDDMMYYYY(groupData.startDate),
          endDate: formatDateToDDMMYYYY(groupData.endDate),
          description: groupData.description || "",
        });
        setGroupData((prev) => ({ ...prev, ...updated }));
        showSuccessToast("Grupa została zaktualizowana pomyślnie.");
        setSnapshotGroupData(null);
        setEditing(false);
      } catch (error) {
        setError(error.message);
        showErrorToast("Błąd podczas aktualizacji grupy: " + error.message);
        if (snapshotGroupData) {
          setGroupData((prev) => ({ ...prev, ...snapshotGroupData }));
          setSnapshotGroupData(null);
        }
      } finally {
        setEditing(false);
        setFormLoading(false);
      }
    } else {
      setSnapshotGroupData(groupData);
      setFormLoading(false);
      setEditing(true);
    }
  };

  const handleLecturerAdd = (t) => {
    setGroupData((prev) => ({
      ...prev,
      lecturers: prev.lecturers.some((x) => x.id === t.id)
        ? prev.lecturers
        : [...prev.lecturers, t],
    }));
  };
  const handleLecturerRemove = (id) => {
    setGroupData((prev) => ({
      ...prev,
      lecturers: prev.lecturers.filter((t) => t.id !== id),
    }));
  };

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === "Ogólne" && !loading && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={handleEditClick}
          >
            {editing ? "Zapisz" : "Edytuj"}
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Ogólne */}
      {activeTab === "Ogólne" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Nazwa"
                name="name"
                hint="Nazwa reprezentująca daną grupę"
                value={groupData.name}
                onChange={handleChange("name")}
                disabled={!editing}
              />
              <TeacherSearchInput
                value={groupData.lecturers}
                label="Prowadzący"
                disabled={!editing}
                onSelect={handleLecturerAdd}
                onRemove={handleLecturerRemove}
                useLecturerSearch={useLecturerSearch}
                hint="Lista prowadzących przypisanych do danej grupy"
              />
              <InputForm
                label="Data rozpoczęcia"
                name="startDate"
                type="date"
                hint="Data rozpoczęcia działania danej grupy"
                value={groupData.startDate}
                onChange={handleChange("startDate")}
                disabled={!editing}
              />
              <InputForm
                label="Data zakończenia"
                name="endDate"
                type="date"
                hint="Data zakończenia działania danej grupy"
                value={groupData.endDate}
                onChange={handleChange("endDate")}
                disabled={!editing}
              />
              <InputForm
                label="Status"
                name="status"
                hint="Status danej grupy. Możliwe wartości: Aktywna, Nieaktywna, Zarchiwizowana"
                colors={
                  groupData.status === "Aktywna"
                    ? "text-green-400"
                    : groupData.status === "Nieaktywna"
                    ? "text-gray-400"
                    : "text-orange-400"
                }
                center
                value={groupData.status}
                disabled
              />
              <ButtonChangeStatus
                hint={
                  groupData.status === "Aktywna"
                    ? "Zarchiwizuj daną grupę"
                    : groupData.status === "Nieaktywna"
                    ? "Aktywuj daną grupę"
                    : "Usuń daną grupę"
                }
                groupId={groupId}
                groupStatus={groupData.status}
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
                className="w-200 m-auto border border-gray-400 rounded-lg px-3 py-2 min-h-[80px]  text-gray-500 font-semibold"
                rows={5}
                defaultValue={groupData.description || ""}
                disabled={!editing}
                onChange={handleChange("description")}
              />
            </div>
          </>
        ))}
      {/* Studenci */}
      {activeTab === "Studenci" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <AddStudentModal
              isOpen={isOpenStudent}
              setIsOpen={setIsOpenStudent}
              groupId={groupId}
            />
            {isOpenImport && (
              <ImportStudentsModal
                isOpen={isOpenImport}
                setIsOpen={setIsOpenImport}
                groupId={groupId}
              />
            )}
            <DataTableView
              leftActions={
                <>
                  <Button onClick={() => setIsOpenStudent(true)}>
                    <FaPlus /> Dodaj Studenta
                  </Button>
                  <Button onClick={() => setIsOpenImport(true)}>
                    <FaPlus /> Importuj
                  </Button>
                  <Hint hint="Dodaj studentów do grupy zajęciowej. Możesz dodać ich ręcznie lub zaimportować z pliku CSV." />
                </>
              }
              loading={loading}
              error={error}
              data={studentsData}
              columns={[
                { key: "login", header: "ID" },
                { key: "firstName", header: "Imię" },
                { key: "lastName", header: "Nazwisko" },
                { key: "email", header: "Mail" },
              ]}
              whereNavigate={"students"}
              idKey={"login"}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              emptyMessage={"Brak studentów w tej grupie."}
            />
          </>
        ))}

      {/* Usługi */}
      {activeTab === "Usługi" && (
        <>
          <StopAllModal isOpen={isOpenStopAll} setIsOpen={setIsOpenStopAll} />
          <AddResourceModal
            isOpen={isOpenResource}
            setIsOpen={setIsOpenResource}
            groupId={groupId}
          />
          <DataTableView
            leftActions={
              <>
                <Button
                  onClick={() => setIsOpenStopAll(true)}
                  color="bg-orange-200 cursor-not-allowed hover:not-allowed"
                  disabled
                >
                  <CiPause1 /> Zawieś wszystko
                </Button>
                <Button onClick={() => setIsOpenResource(true)}>
                  <FaPlus /> Dodaj usługę
                </Button>
                <Hint hint="Zarządzaj usługami przypisanymi do tej grupy. Możesz dodawać nowe usługi - przydzielać do nich dostęp twojej grupie lub wstrzymywać działające." />
              </>
            }
            loading={loading}
            error={error}
            data={resourcesData}
            columns={[
              { key: "clientId", header: "ID" },
              { key: "name", header: "Nazwa" },
              { key: "costLimit", header: "Limit Kosztu" },
              { key: "limitUsed", header: "Koszt" },
              { key: "expiresAt", header: "Wygasa" },
              { key: "cronCleanupSchedule", header: "Wyczyść" },
              { key: "status", header: "Status" },
            ]}
            whereNavigate={`${groupId}`}
            idKey={"id"}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            emptyMessage={"Brak usług dla tej grupy."}
          />
        </>
      )}
    </div>
  );
}
