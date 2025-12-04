"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

// const data = [
//   { name: "Bazy Danych", cost: 250 },
//   { name: "AWS", cost: 500 },
//   { name: "Big Data", cost: 1000 },
//   { name: "APO", cost: 100 },
// ];

// const colorMap = Object.fromEntries([
//   ["Bazy Danych", "#3b82f6"],
//   ["AWS", "#ef4444"],
//   ["Big Data", "#f59e0b"],
//   ["APO", "#10b981"],
// ]);

export default function CostBarChart({ data = null }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-lg font-semibold mb-4">
        Porównanie grup zajęciowych
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cost" fill="#8884d8">
            {/* {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorMap[entry.name] || "#9ca3af"}
              />
            ))} */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
