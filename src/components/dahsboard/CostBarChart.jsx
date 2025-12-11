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
          <XAxis dataKey="groupUniqueName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cost" fill="#8884d8"></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
