import { useRouter } from "next/navigation";

export default function Table({ columns, data, whereNavigate, idKey }) {
  const router = useRouter();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-white">
          {columns.map((col) => (
            <th key={col.key} className="p-2 text-center align-middle">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={row.id || idx}
            className={`odd:bg-gray-100 ${
              whereNavigate ? "cursor-pointer hover:bg-gray-200 transition" : ""
            }`}
            onClick={
              whereNavigate
                ? () => router.push(`${whereNavigate}/${row[idKey]}`)
                : undefined
            }
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={`p-2 text-center align-middle ${
                  col.key === "status" &&
                  (row[col.key] == "INACTIVE"
                    ? "text-red font-semibold"
                    : "text-green font-semibold")
                }`}
              >
                {col.render
                  ? col.render(row, idx)
                  : typeof row[col.key] === "number" && col.numbers
                  ? row[col.key].toFixed(2)
                  : row[col.key] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
