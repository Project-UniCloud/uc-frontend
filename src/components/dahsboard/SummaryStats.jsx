"use client";

import React from "react";

export default function SummaryStats({ stats = null }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-lg font-semibold mb-4">Kluczowe statyski</h3>
        <div className="text-gray-500">Brak danych do wyświetlenia</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <h3 className="text-lg font-semibold mb-4">Kluczowe statyski</h3>
      <div className="p-4 rounded-md bg-white shadow-sm w-1/2">
        <div className="text-sm text-gray-500">Całkowity koszt bieżący</div>
        <div className="mt-2 p-2 border rounded">
          {stats.overallCostFromActiveGroups}
        </div>
      </div>
      <div className="p-4  rounded-md bg-white shadow-sm w-1/2">
        <div className="text-sm text-gray-500">Liczba aktywnych zasobów</div>
        <div className="mt-2 p-2 border rounded">
          {stats.allActiveResourcesCount}
        </div>
      </div>
      <div className="p-4  rounded-md bg-white shadow-sm w-1/2">
        <div className="text-sm text-gray-500">Średni koszt na grupę</div>
        <div className="mt-2 p-2 border rounded">
          {stats.averageActiveGroupCost}
        </div>
      </div>
    </div>
  );
}
