import { useRouter } from "next/navigation";

export default function Table({ columns, data }) {
  const router = useRouter();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
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
            className="odd:bg-gray-50 cursor-pointer hover:bg-purple-50 transition"
            onClick={() => router.push(`/groups/${row.groupId}`)}
          >
            {columns.map((col) => (
              <td key={col.key} className="p-2 text-center align-middle">
                {col.render ? col.render(row, idx) : row[col.key] || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
