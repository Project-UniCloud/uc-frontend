"use client";
import React from "react";
import { notFound } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import Tabs from "@/components/utils/Tabs";
import DataTableView from "@/components/views/DataTableView";
import InputForm from "@/components/utils/InputForm";
import TeacherSearchInput from "@/components/utils/TeacherSearchInput";
import { useLecturerSearch } from "@/hooks/useLecturerSearch";
import { Button } from "@/components/utils/Buttons";
import { FaPlus } from "react-icons/fa";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { ImportStudentsModal } from "@/components/students/ImportStudentsModal";
import { AddResourceModal } from "@/components/resources/AddResourceModal";
import ButtonChangeStatus from "@/components/group/ButtonChangeStatus";
import Hint from "@/components/utils/Hint";
import { useGroupDetailPage } from "@/lib/views/groups/groupId/hooks";
import { TABS } from "@/lib/views/groups/groupId/tabs";
import {
  resourcesColumns,
  studentsColumns,
} from "@/lib/views/groups/groupId/columns";

export default function GroupPage({ params }) {
  const { groupId } = React.use(params);
  const { checkAccess } = usePermissions();

  if (!checkAccess(PERMISSIONS.GROUPS)) {
    notFound();
  }

  const {
    activeTab,
    groupData,
    studentsData,
    resourcesData,
    loading,
    formLoading,
    error,
    isOpenStudent,
    isOpenImport,
    isOpenResource,
    editing,
    studentPage,
    studentPageSize,
    studentTotalPages,
    resourcePage,
    resourcePageSize,
    resourceTotalPages,
    setIsOpenStudent,
    setIsOpenImport,
    setIsOpenResource,
    setStudentPage,
    setStudentPageSize,
    setResourcePage,
    setResourcePageSize,
    handleTabChange,
    handleChange,
    handleEditClick,
    handleLecturerAdd,
    handleLecturerRemove,
    fetchStudents,
    fetchResources,
  } = useGroupDetailPage(groupId);

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center">
          <Tabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="mb-4.5">
            <Hint
              hint={`Ogólne – edytuj podstawowe informacje grupy (nazwa, prowadzący, daty, status)
Studenci – zarządzaj studentami w grupie (dodawaj ręcznie lub importuj z CSV)
Usługi – przydzielaj dostępy do usług dla grupy (prowadzący i studenci otrzymają dostęp do przydzielonych usług)`}
            />
          </div>
        </div>

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
                disabled
              />
              <TeacherSearchInput
                value={groupData.lecturers}
                label="Prowadzący"
                disabled={!editing}
                disabledOnlyList={!editing}
                onSelect={handleLecturerAdd}
                onRemove={handleLecturerRemove}
                useLecturerSearch={useLecturerSearch}
                hint='Lista prowadzących przypisanych do danej grupy. Aby dodać nowego prowadzącego, musi on być najpierw dodany do listy prowadzących w zakładce "Prowadzący"'
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
                hint="Data zakończenia to graniczny termin działania grupy. Po jej przekroczeniu system automatycznie archiwizuje grupę i przypisanych użytkowników. Tę operację możesz wywołać także ręcznie, używając akcji ‘Archiwizuj grupę’ w szczegółach aktywnej grupy."
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
              {(groupData.status === "Aktywna" ||
                groupData.status === "Nieaktywna") && (
                <ButtonChangeStatus
                  hint={
                    groupData.status === "Aktywna"
                      ? "Archiwizacja grupy: po zakończeniu zajęć grupa przechodzi do archiwum, a dostęp użytkowników jest wyłączany. Operacja nie usuwa danych historycznych."
                      : "Aktywacja grupy: jeśli grupa ma przydzielone dostępy, zostanie utworzona grupa na AWS, a wskazani prowadzący zostaną przypisani. Po dodaniu studentów system zakłada dla nich konta i przypisuje do grupy z odpowiednimi uprawnieniami."
                  }
                  groupId={groupId}
                  groupStatus={groupData.status}
                />
              )}
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
      {activeTab === "Studenci" && (
        <>
          <AddStudentModal
            isOpen={isOpenStudent}
            setIsOpen={setIsOpenStudent}
            groupId={groupId}
            fetch={fetchStudents}
          />

          <ImportStudentsModal
            isOpen={isOpenImport}
            setIsOpen={setIsOpenImport}
            groupId={groupId}
            fetch={fetchStudents}
          />

          <DataTableView
            leftActions={
              <>
                <Button onClick={() => setIsOpenStudent(true)}>
                  <FaPlus /> Dodaj Studenta
                </Button>
                <Button onClick={() => setIsOpenImport(true)}>
                  <FaPlus /> Importuj
                </Button>
                <Hint hint="Dodaj studentów do grupy zajęciowej. Możesz dodać ich ręcznie lub zaimportować z pliku CSV. Otrzymają oni dostęp do nadanych zasobów" />
              </>
            }
            loading={loading}
            error={error}
            data={studentsData}
            columns={studentsColumns}
            page={studentPage}
            whereNavigate={`${groupId}/students`}
            idKey={"uuid"}
            setPage={setStudentPage}
            pageSize={studentPageSize}
            setPageSize={setStudentPageSize}
            totalPages={studentTotalPages}
            emptyMessage={"Brak studentów w tej grupie."}
          />
        </>
      )}
      {/* Usługi */}
      {activeTab === "Usługi" && (
        <>
          <AddResourceModal
            isOpen={isOpenResource}
            setIsOpen={setIsOpenResource}
            groupName={groupData.name}
            groupId={groupId}
            fetch={fetchResources}
          />
          <DataTableView
            leftActions={
              <>
                <Button onClick={() => setIsOpenResource(true)}>
                  <FaPlus /> Dodaj usługę
                </Button>
                <Hint hint="Zarządzaj usługami przypisanymi do tej grupy. Możesz dodawać nowe usługi - przydzielać do nich dostęp twojej grupie." />
              </>
            }
            loading={loading}
            error={error}
            data={resourcesData}
            columns={resourcesColumns}
            whereNavigate={`${groupId}/resources`}
            idKey={"id"}
            page={resourcePage}
            setPage={setResourcePage}
            pageSize={resourcePageSize}
            setPageSize={setResourcePageSize}
            totalPages={resourceTotalPages}
            emptyMessage={"Brak usług dla tej grupy."}
          />
        </>
      )}
    </div>
  );
}
