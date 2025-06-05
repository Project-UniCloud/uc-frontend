"use client";
import React, { useState, useEffect } from "react";
import Tabs from "@/components/Tabs";
import Table from "@/components/Table";
import InputForm from "@/components/InputForm";
import TeacherSearchInput from "@/components/TeacherSearchInput";
import { Button } from "@/components/Buttons";
import { FiArchive } from "react-icons/fi";
import { getGroupById } from "@/lib/groupsApi";
import { getStudentsFromGroup } from "@/lib/studentApi";
import { FaPlus } from "react-icons/fa";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { ImportStudentsModal } from "@/components/students/ImportStudentsModal";
import { formatDateToYYYYMMDD } from "@/lib/utils/formatDate";
import { StopAllModal } from "@/components/resources/StopAllModal";

const TABS = [{ label: "Ogólne" }, { label: "Studenci" }, { label: "Usługi" }];

export default function GroupPage({ params }) {
  const { groupId } = React.use(params);

  const [activeTab, setActiveTab] = useState("Ogólne");
  const [groupData, setGroupData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenStudent, setIsOpenStudent] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "Ogólne") {
      getGroupById(groupId)
        .then((data) => {
          setGroupData(data);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Studenci") {
      getStudentsFromGroup(groupId)
        .then((data) => setStudentsData(data.content || []))
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [activeTab, groupId]);

  const handleChange = (fieldName) => (event) => {
    const newValue = event.target.value;
    setGroupData((previousData) => ({
      ...previousData,
      [fieldName]: newValue,
    }));
  };

  const handleAutoSave = () => {
    console.log("Zapisuję grupę:", {
      name: groupData.name,
      lecturerFullNames: groupData.lecturer,
      startDate: groupData.startDate,
      endDate: groupData.endDate,
      status: groupData.status,
    });
  }; //TODO put request

  return (
    <div className="min-w-120">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

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
              placeholder="Nazwa"
              value={groupData.name || ""}
              onChange={handleChange("name")}
              onBlur={handleAutoSave}
            />
            <TeacherSearchInput
              value={groupData.lecturerFullNames || ""}
              label="Prowadzący"
              onChange={handleChange("lecturerFullNames")}
              onBlur={handleAutoSave}
            />
            <InputForm
              label="Data rozpoczęcia"
              name="startDate"
              placeholder="dd-mm-yyyy"
              type="date"
              value={formatDateToYYYYMMDD(groupData.startDate) || ""}
              onChange={handleChange("startDate")}
              onBlur={handleAutoSave}
            />
            <InputForm
              label="Data zakończenia"
              name="endDate"
              placeholder="dd-mm-yyyy"
              type="date"
              value={formatDateToYYYYMMDD(groupData.endDate) || ""}
              onChange={handleChange("endDate")}
              onBlur={handleAutoSave}
            />
            <InputForm
              label="Status"
              name="status"
              placeholder="Status"
              colors="border-green-400 text-green-500"
              center
              value={groupData.status || ""}
              disabled
            />
            <Button
              label={groupData.status === "Aktywna" ? "Archiwizuj" : "Usuń"}
              color="bg-orange-400"
              center
            >
              <FiArchive className="text-lg" />
              Archiwizuj
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
              <button
                className="bg-purple hover:opacity-70 text-white text-sm font-semibold px-4 py-2
                             rounded-lg flex items-center gap-1 cursor-pointer"
                onClick={() => setIsOpenStudent(true)}
              >
                <FaPlus /> Dodaj Studenta
              </button>
              <button
                className="bg-purple hover:opacity-70 text-white text-sm font-semibold px-4 py-2
                             rounded-lg flex items-center gap-1 cursor-pointer"
                onClick={() => setIsOpenImport(true)}
              >
                <FaPlus /> Importuj
              </button>
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
              <Table
                columns={[
                  { key: "login", header: "ID" },
                  { key: "firstName", header: "Imię" },
                  { key: "lastName", header: "Nazwisko" },
                  { key: "email", header: "Mail" },
                ]}
                data={studentsData}
              />
            ) : (
              <div>Brak studentów w tej grupie.</div>
            )}
          </>
        ))}

      {activeTab === "Usługi" && (
        <>
          <div className="flex items-center gap-5 mb-5">
            <button
              className="bg-purple hover:opacity-70 text-white text-sm font-semibold px-4 py-2
                             rounded-lg flex items-center gap-1 cursor-pointer"
              onClick={() => setIsOpenStudent(true)}
            >
              <FaPlus /> Zawieś wszystko
            </button>
            <button
              className="bg-purple hover:opacity-70 text-white text-sm font-semibold px-4 py-2
                             rounded-lg flex items-center gap-1 cursor-pointer"
              onClick={() => setIsOpenImport(true)}
            >
              <FaPlus /> Dodaj usługę
            </button>
          </div>
          <StopAllModal isOpen={isOpenStudent} setIsOpen={setIsOpenStudent} />{" "}
        </>
      )}
    </div>
  );
}
