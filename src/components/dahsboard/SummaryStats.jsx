"use client";

import React from "react";

export default function SummaryStats({ stats = null }) {
  const s = stats || {
    overallCostFromActiveGroups: 2560,
    allActiveResourcesCount: 10,
    averageActiveGroupCost: 250.24,
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <h3 className="text-lg font-semibold mb-4">Kluczowe statyski</h3>
      <div className="p-4 rounded-md bg-white shadow-sm w-1/2">
        <div className="text-sm text-gray-500">Całkowity koszt bieżący</div>
        <div className="mt-2 p-2 border rounded">
          {s.overallCostFromActiveGroups}
        </div>
      </div>
      <div className="p-4  rounded-md bg-white shadow-sm w-1/2">
        <div className="text-sm text-gray-500">Liczba aktywnych zasobów</div>
        <div className="mt-2 p-2 border rounded">
          {s.allActiveResourcesCount}
        </div>
      </div>
      <div className="p-4  rounded-md bg-white shadow-sm w-1/2">
        <div className="text-sm text-gray-500">Średni koszt na grupę</div>
        <div className="mt-2 p-2 border rounded">
          {s.averageActiveGroupCost}
        </div>
      </div>
    </div>
  );
}
