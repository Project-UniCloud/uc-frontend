"use client";
import React, { useState, useEffect, act } from "react";
import Tabs from "@/components/utils/Tabs";
import Table from "@/components/table/Table";
import InputForm from "@/components/utils/InputForm";
import TeacherSearchInput from "@/components/utils/TeacherSearchInput";
import { Button } from "@/components/utils/Buttons";
import { FiArchive } from "react-icons/fi";
import { getGroupById, updateGroup } from "@/lib/groupsApi";
import { getStudentsFromGroup } from "@/lib/studentApi";
import { FaPlus } from "react-icons/fa";
import { CiPause1 } from "react-icons/ci";
import { IoPlayCircleOutline } from "react-icons/io5";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { ImportStudentsModal } from "@/components/students/ImportStudentsModal";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import { getResourcesGroup } from "@/lib/resource";
import { StopAllModal } from "@/components/resources/StopAllModal";
import { AddResourceModal } from "@/components/resources/AddResourceModal";
import Pagination from "@/components/pagination/Pagination";

const TABS = [{ label: "Ogólne" }, { label: "Studenci" }, { label: "Usługi" }];

export default function GroupPage({ params }) {
  const { groupId } = React.use(params);
  const [activeTab, setActiveTab] = useState("Ogólne");
  const [groupData, setGroupData] = useState({
    name: "",
    lecturers: [],
    lecturerFullNames: [],
    startDate: "",
    endDate: "",
    status: "",
  });
  const [studentsData, setStudentsData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenStudent, setIsOpenStudent] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenResource, setIsOpenResource] = useState(false);
  const [isOpenStopAll, setIsOpenStopAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ogólne") {
      getGroupById(groupId)
        .then((data) => {
          const ids = data.lecturerFullNames.map((l) => l.userId);
          const names = data.lecturerFullNames.map(
            (l) => `${l.firstName} ${l.lastName}`
          );

          setGroupData({
            name: data.name,
            lecturers: ids || [],
            lecturerFullNames: names || "",
            startDate: formatDateToYYYYMMDD(data.startDate),
            endDate: formatDateToYYYYMMDD(data.endDate),
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
          setTotalPages(data.totalPages || 0);
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
    setPage(0);
    setPageSize(10);
  };

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setGroupData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleLecturerChange = (teacher) => {
    setGroupData((prev) => ({
      ...prev,
      lecturers: [teacher.userId],
      lecturerFullNames: teacher.label,
    }));
  };

  const handleEditClick = async () => {
    if (editing) {
      setError(null);
      try {
        const updated = await updateGroup(groupId, {
          name: groupData.name,
          lecturers: groupData.lecturers,
          startDate: formatDateToDDMMYYYY(groupData.startDate),
          endDate: formatDateToDDMMYYYY(groupData.endDate),
        });
        setGroupData((prev) => ({ ...prev, ...updated }));
      } catch (error) {
        setError(error.message);
      } finally {
        setEditing(false);
      }
    } else {
      setEditing(true);
    }
  };

  const handleLecturerAdd = (teacher) => {
    setGroupData((g) => {
      if (g.lecturers.includes(teacher.id)) return g;
      return {
        ...g,
        lecturers: [...g.lecturers, teacher.id],
        lecturerFullNames: [...g.lecturerFullNames, teacher.fullName],
      };
    });
  };
  const handleLecturerRemove = (idToRemove) => {
    setGroupData((g) => ({
      ...g,
      lecturers: g.lecturers.filter((id) => id !== idToRemove),
      lecturerFullNames: g.lecturerFullNames.filter(
        (_, i) => g.lecturers[i] !== idToRemove
      ),
    }));
  };

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === "Ogólne" && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
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
          <div
            className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-10
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
          >
            <InputForm
              label="Nazwa"
              name="name"
              value={groupData.name}
              onChange={handleChange("name")}
              disabled={!editing}
            />
            <TeacherSearchInput
              value={groupData.lecturerFullNames}
              label="Prowadzący"
              disabled={!editing}
              onSelect={handleLecturerAdd}
              onRemove={handleLecturerRemove}
            />
            <InputForm
              label="Data rozpoczęcia"
              name="startDate"
              type="date"
              value={groupData.startDate}
              onChange={handleChange("startDate")}
              disabled={!editing}
            />
            <InputForm
              label="Data zakończenia"
              name="endDate"
              type="date"
              value={groupData.endDate}
              onChange={handleChange("endDate")}
              disabled={!editing}
            />
            <InputForm
              label="Status"
              name="status"
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
            <Button
              label={
                groupData.status === "Aktywna"
                  ? "Archiwizuj"
                  : groupData.status === "Nieaktywna"
                  ? "Aktywuj"
                  : "Usuń"
              }
              color={
                groupData.status === "Aktywna"
                  ? "bg-orange-400"
                  : groupData.status === "Nieaktywna"
                  ? "bg-green-400"
                  : "bg-red-400"
              }
              center
            >
              {groupData.status === "Aktywna" && (
                <FiArchive className="text-lg" />
              )}
              {groupData.status === "Zarchiwizowana" && (
                <CiPause1 className="text-lg" />
              )}
              {groupData.status === "Nieaktywna" && (
                <IoPlayCircleOutline className="text-lg" />
              )}
              {groupData.status === "Aktywna"
                ? "Archiwizuj"
                : groupData.status === "Nieaktywna"
                ? "Aktywuj"
                : "Usuń"}
            </Button>
          </div>
        ))}
      {/* Studenci */}
      {activeTab === "Studenci" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div className="flex items-center gap-5 mb-5">
              <Button onClick={() => setIsOpenStudent(true)}>
                <FaPlus /> Dodaj Studenta
              </Button>
              <Button onClick={() => setIsOpenImport(true)}>
                <FaPlus /> Importuj
              </Button>
            </div>
            <AddStudentModal
              isOpen={isOpenStudent}
              setIsOpen={setIsOpenStudent}
              groupId={groupId}
            />
            <ImportStudentsModal
              isOpen={isOpenImport}
              setIsOpen={setIsOpenImport}
              groupId={groupId}
            />
            {studentsData.length > 0 ? (
              <>
                <Table
                  columns={[
                    { key: "login", header: "ID" },
                    { key: "firstName", header: "Imię" },
                    { key: "lastName", header: "Nazwisko" },
                    { key: "email", header: "Mail" },
                  ]}
                  data={studentsData}
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
              <div>Brak studentów w tej grupie.</div>
            )}
          </>
        ))}
      {/* Usługi */}
      {activeTab === "Usługi" && (
        <>
          <div className="flex items-center gap-5 mb-5">
            <Button onClick={() => setIsOpenStopAll(true)}>
              <FaPlus /> Zawieś wszystko
            </Button>
            <Button onClick={() => setIsOpenResource(true)}>
              <FaPlus /> Dodaj usługę
            </Button>
          </div>
          <StopAllModal isOpen={isOpenStopAll} setIsOpen={setIsOpenStopAll} />
          <AddResourceModal
            isOpen={isOpenResource}
            setIsOpen={setIsOpenResource}
            groupId={groupId}
          />
          {resourcesData.length > 0 ? (
            <Table
              columns={[
                { key: "clientId", header: "ID" },
                { key: "name", header: "Nazwa" },
                { key: "costLimit", header: "Limit Kosztu" },
                { key: "expiresAt", header: "Wygasa" },
                { key: "lastUsedAt", header: "Ostatnio Użyty" },
                { key: "cronCleanupSchedule", header: "Wyczyść" },
                { key: "status", header: "Status" },
              ]}
              data={resourcesData}
            />
          ) : (
            <div>Brak studentów w tej grupie.</div>
          )}
        </>
      )}
    </div>
  );
}
