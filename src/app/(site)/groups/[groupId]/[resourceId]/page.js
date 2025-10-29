"use client";
import React, { useState, useEffect } from "react";
import Tabs from "@/components/utils/Tabs";
import InputForm from "@/components/utils/InputForm";
import { Button } from "@/components/utils/Buttons";
import {
  getResourceGeneralInfoByGroupId,
  getResourceEditInfoByGroupId,
  updateResourceEditInfoByGroupId,
  updateResourceGeneralInfoByGroupId,
} from "@/lib/resourceApi";
import {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
} from "@/lib/utils/formatDate";
import ButtonChangeResourceStatus from "@/components/resources/ButtonChangeResourceStatus";
import { showSuccessToast, showErrorToast } from "@/components/utils/Toast";

const TABS = [{ label: "Informacje" }, { label: "Edycja" }];

export default function GroupPage({ params }) {
  const { groupId, resourceId } = React.use(params);
  const [activeTab, setActiveTab] = useState("Informacje");
  const [infoData, setInfoData] = useState({
    owner: "",
    creationDate: "",
    ownerId: "",
    cloudId: "",
    description: "",
  });
  const [editData, setEditData] = useState({
    limit: "",
    clean: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (activeTab === "Informacje") {
      getResourceGeneralInfoByGroupId(groupId, resourceId)
        .then((data) => {
          setInfoData({
            owner: data.owner,
            creationDate: data.creationDate,
            ownerId: data.ownerId,
            cloudId: data.cloudId,
            description: data.description || "",
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }

    if (activeTab === "Edycja") {
      getResourceEditInfoByGroupId(groupId, resourceId)
        .then((data) => {
          setEditData({
            limit: data.name,
            clean: data.clean || "",
            endDate: formatDateToYYYYMMDD(data.endDate),
            description: data.description || "",
          });
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [activeTab, groupId, resourceId]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setEditing(false);
  };

  const handleChange =
    (fieldName, tabKey = activeTab) =>
    (event) => {
      const newValue = event.target.value;

      if (tabKey === "Informacje") {
        setInfoData((prev) => ({ ...prev, [fieldName]: newValue }));
      } else if (tabKey === "Edycja") {
        setEditData((prev) => ({ ...prev, [fieldName]: newValue }));
      }
    };

  const handleEditClick = async (tabKey = activeTab) => {
    if (editing) {
      setError(null);
      setFormLoading(true);
      try {
        if (tabKey === "Informacje") {
          const updated = await updateResourceGeneralInfoByGroupId(groupId, {
            owner: infoData.owner,
            creationDate: formatDateToDDMMYYYY(infoData.creationDate),
            ownerId: infoData.ownerId,
            cloudId: infoData.cloudId,
            description: infoData.description || "",
          });
          setInfoData((prev) => ({ ...prev, ...updated }));
          showSuccessToast("Informacje zostały zaktualizowane pomyślnie.");
          setEditing(false);
        } else if (tabKey === "Edycja") {
          const updated = await updateResourceEditInfoByGroupId(groupId, {
            name: editData.limit,
            clean: editData.clean,
            endDate: formatDateToDDMMYYYY(editData.endDate),
            description: editData.description || "",
          });
          setEditData((prev) => ({ ...prev, ...updated }));
          showSuccessToast("Dane zostały zaktualizowane pomyślnie.");
          setEditing(false);
        }
      } catch (error) {
        setError(error.message);
        showErrorToast("Błąd podczas aktualizacji danych: " + error.message);
      } finally {
        setFormLoading(false);
        setEditing(false);
      }
    } else {
      setFormLoading(false);
      setEditing(true);
    }
  };

  return (
    <div className="min-w-120">
      <div className="flex justify-between items-center">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        {(activeTab === "Informacje" || activeTab === "Edycja") && !loading && (
          <Button
            color={editing ? "bg-green-500" : "bg-purple"}
            className={formLoading && "cursor-not-allowed opacity-50"}
            disabled={formLoading}
            onClick={() => handleEditClick(activeTab)}
          >
            {editing ? "Zapisz" : "Edytuj"}
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Informacje */}
      {activeTab === "Informacje" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Właściciel"
                name="owner"
                value={infoData.owner}
                onChange={handleChange("owner", "Informacje")}
                disabled={!editing}
              />
              <InputForm
                label="Data utworzenia"
                name="creationDate"
                type="date"
                value={infoData.creationDate}
                onChange={handleChange("creationDate", "Informacje")}
                disabled={!editing}
              />
              <InputForm
                label="Indeks właściciela"
                name="ownerId"
                value={infoData.ownerId}
                onChange={handleChange("ownerId", "Informacje")}
                disabled={!editing}
              />
              <InputForm
                label="ID zasobu w chmurze"
                name="cloudId"
                value={infoData.cloudId}
                onChange={handleChange("cloudId", "Informacje")}
                disabled={!editing}
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
                defaultValue={infoData.description || ""}
                disabled={!editing}
                onChange={handleChange("description", "Informacje")}
              />
            </div>
          </>
        ))}
      {/* Edycja */}
      {activeTab === "Edycja" &&
        (loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div
              className="grid lg:max-w-3xl md:max-w-xl max-w-xs m-auto gap-x-15 gap-y-5
                          grid-cols-1 md:grid-cols-2 md:grid-rows-3"
            >
              <InputForm
                label="Limit"
                name="limit"
                value={editData.limit}
                onChange={handleChange("limit", "Edycja")}
                disabled={!editing}
              />
              <InputForm
                label="Czyszczenie"
                name="clean"
                value={editData.clean}
                onChange={handleChange("clean", "Edycja")}
                disabled={!editing}
              />
              <InputForm
                label="Data zakończenia"
                name="endDate"
                type="date"
                value={editData.endDate}
                onChange={handleChange("endDate", "Edycja")}
                disabled={!editing}
              />

              <ButtonChangeResourceStatus
                groupId={groupId}
                resourceId={resourceId}
                // resourceStatus={editData.status}
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
                defaultValue={editData.description || ""}
                disabled={!editing}
                onChange={handleChange("description", "Edycja")}
              />
            </div>
          </>
        ))}
    </div>
  );
}
