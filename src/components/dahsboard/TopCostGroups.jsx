import Table from "../table/Table";

export default function TopCostGroups() {
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Nazwa" },
    { key: "teacher", header: "Prowadzący" },
    {
      key: "services",
      header: "Usługi",
      render: (row) =>
        Array.isArray(row.services) ? row.services.join(" - ") : row.services,
    },
    { key: "semester", header: "Semestr" },
    { key: "cost", header: "Wygenerowany koszt", numbers: true },
    {
      key: "budgetProgress",
      header: "Wykorzystany budżet",
      render: (row) => (
        <div className="flex items-center justify-center">
          <div className="w-[180px]">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${row.budgetPercent}%`,
                  background:
                    row.budgetPercent >= 70
                      ? "#ef4444"
                      : row.budgetPercent >= 40
                      ? "#f59e0b"
                      : "#3b82f6",
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "AWS",
      teacher: "dr. Patryk Żywica",
      services: ["AWS", "Azure"],
      semester: "2025L",
      cost: 1050,
      budgetPercent: 60,
    },
    {
      id: 2,
      name: "Bazy danych",
      teacher: "dr. Anna Stachowiak",
      services: ["Azure - Databricks"],
      semester: "2025Z",
      cost: 200,
      budgetPercent: 10,
    },
    {
      id: 3,
      name: "Technologie internetowe",
      teacher: "dr. Wojciech Kowalewski",
      services: ["Azure"],
      semester: "2025L",
      cost: 400,
      budgetPercent: 35,
    },
    {
      id: 4,
      name: "Data science",
      teacher: "dr. Joanna Siwek",
      services: ["Heroku"],
      semester: "2024Z",
      cost: 900,
      budgetPercent: 50,
    },
    {
      id: 5,
      name: "Big data",
      teacher: "dr. Michał Łuczak",
      services: ["Hetzner"],
      semester: "2024L",
      cost: 150,
      budgetPercent: 8,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full mt-15 pb-15">
      <h3 className="text-lg font-semibold mb-4">
        Najbardziej kosztowne grupy zajęciowe
      </h3>
      <div className="bg-white rounded-md shadow w-11/12 p-4">
        <Table columns={columns} data={data} idKey="id" />
      </div>
    </div>
  );
}
