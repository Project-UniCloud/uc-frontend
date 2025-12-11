"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { name: "S3", value: 50 },
//   { name: "RDS", value: 20 },
//   { name: "EC2", value: 20 },
//   { name: "AWS LAMBDA", value: 10 },
// ];

const COLORS = ["#8b5cf6", "#6b2135", "#4f46e5", "#93c5fd"];

export default function ResourcePieChart({ data = null }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-lg font-semibold mb-4">Udział typów zasobów</h3>
        <div className="text-gray-500">Brak danych do wyświetlenia</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center ">
      <h3 className="text-lg font-semibold mb-4">Udział typów zasobów</h3>
      <ResponsiveContainer
        width="100%"
        height="100%"
        style={{ aspectRatio: 1.618, maxWidth: 600 }}
      >
        <PieChart width="100%" height="100%">
          <Pie data={data} dataKey="cost" nameKey="resourceType" label>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
