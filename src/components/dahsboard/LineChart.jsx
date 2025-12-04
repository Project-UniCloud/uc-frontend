import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// const data = [
//   { date: "January", cost: 400 },
//   { date: "February", cost: 300 },
//   { date: "March", cost: 500 },
//   { date: "April", cost: 250 },
// ];

export default function MyLineChart({ data = null }) {
  return (
    <div className="flex flex-col justify-center items-center ">
      <h3 className="text-lg font-semibold mb-4">Trend kosztów</h3>
      <LineChart
        style={{ width: "100%", aspectRatio: 1.618, maxWidth: 600 }}
        responsive
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 5,
          left: 0,
        }}
      >
        <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="purple"
          strokeWidth={2}
          date="Trend Kosztów"
        />
        <XAxis
          dataKey="date"
          label={{
            position: "insideBottom",
            value: "Data",
            offset: -10,
          }}
        />
        <YAxis
          width="auto"
          label={{ value: "Koszt", position: "insideLeft", angle: -90 }}
        />
        <Tooltip />
        <Legend align="right" />
      </LineChart>
    </div>
  );
}
