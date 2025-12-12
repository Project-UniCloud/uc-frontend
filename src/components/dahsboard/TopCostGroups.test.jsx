import { render, screen } from "@testing-library/react";
import TopCostGroups from "./TopCostGroups";

jest.mock("../table/Table", () => {
  return {
    __esModule: true,
    default: ({ columns, data, idKey }) => (
      <div data-testid="table" data-id-key={idKey}>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} data-testid={`header-${col.key}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr key={row[idKey]} data-testid={`row-${row[idKey]}`}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    data-testid={`cell-${row[idKey]}-${col.key}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  };
});

describe("TopCostGroups", () => {
  const mockData = [
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
  ];

  test("renderuje nagłówek sekcji", () => {
    render(<TopCostGroups data={mockData} />);

    expect(
      screen.getByText("Najbardziej kosztowne grupy zajęciowe")
    ).toBeInTheDocument();
  });

  test("przekazuje dane do komponentu Table", () => {
    render(<TopCostGroups data={mockData} />);

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByTestId("table")).toHaveAttribute("data-id-key", "id");
  });

  test("definiuje wszystkie wymagane kolumny", () => {
    render(<TopCostGroups data={mockData} />);

    expect(screen.getByTestId("header-id")).toHaveTextContent("ID");
    expect(screen.getByTestId("header-name")).toHaveTextContent("Nazwa");
    expect(screen.getByTestId("header-teacher")).toHaveTextContent(
      "Prowadzący"
    );
    expect(screen.getByTestId("header-services")).toHaveTextContent("Usługi");
    expect(screen.getByTestId("header-semester")).toHaveTextContent("Semestr");
    expect(screen.getByTestId("header-cost")).toHaveTextContent(
      "Wygenerowany koszt"
    );
    expect(screen.getByTestId("header-budgetProgress")).toHaveTextContent(
      "Wykorzystany budżet"
    );
  });

  test("renderuje dane w tabeli", () => {
    render(<TopCostGroups data={mockData} />);

    expect(screen.getByTestId("row-1")).toBeInTheDocument();
    expect(screen.getByTestId("row-2")).toBeInTheDocument();
    expect(screen.getByTestId("row-3")).toBeInTheDocument();
  });

  test("formatuje usługi jako tablicę do stringa z separatorem", () => {
    render(<TopCostGroups data={mockData} />);

    const servicesCell = screen.getByTestId("cell-1-services");
    expect(servicesCell).toHaveTextContent("AWS - Azure");
  });

  test("obsługuje usługi jako string", () => {
    const dataWithStringServices = [
      {
        id: 10,
        name: "Test",
        teacher: "Test Teacher",
        services: "Single Service",
        semester: "2025L",
        cost: 100,
        budgetPercent: 20,
      },
    ];

    render(<TopCostGroups data={dataWithStringServices} />);

    const servicesCell = screen.getByTestId("cell-10-services");
    expect(servicesCell).toHaveTextContent("Single Service");
  });

  test("renderuje pasek postępu budżetu z poprawnym kolorem dla niskiego wykorzystania", () => {
    const lowBudgetData = [
      {
        id: 99,
        name: "Low Budget",
        teacher: "Test",
        services: ["AWS"],
        semester: "2025L",
        cost: 100,
        budgetPercent: 30,
      },
    ];

    render(<TopCostGroups data={lowBudgetData} />);

    const progressBar = screen
      .getByTestId("cell-99-budgetProgress")
      .querySelector("div[style]");
    expect(progressBar).toHaveStyle({ width: "30%", background: "#3b82f6" });
  });

  test("renderuje pasek postępu budżetu z kolorem pomarańczowym dla średniego wykorzystania", () => {
    const mediumBudgetData = [
      {
        id: 98,
        name: "Medium Budget",
        teacher: "Test",
        services: ["AWS"],
        semester: "2025L",
        cost: 500,
        budgetPercent: 50,
      },
    ];

    render(<TopCostGroups data={mediumBudgetData} />);

    const progressBar = screen
      .getByTestId("cell-98-budgetProgress")
      .querySelector("div[style]");
    expect(progressBar).toHaveStyle({ width: "50%", background: "#f59e0b" });
  });

  test("renderuje pasek postępu budżetu z kolorem czerwonym dla wysokiego wykorzystania", () => {
    const highBudgetData = [
      {
        id: 97,
        name: "High Budget",
        teacher: "Test",
        services: ["AWS"],
        semester: "2025L",
        cost: 1000,
        budgetPercent: 80,
      },
    ];

    render(<TopCostGroups data={highBudgetData} />);

    const progressBar = screen
      .getByTestId("cell-97-budgetProgress")
      .querySelector("div[style]");
    expect(progressBar).toHaveStyle({ width: "80%", background: "#ef4444" });
  });

  test("obsługuje puste dane", () => {
    render(<TopCostGroups data={[]} />);

    expect(
      screen.getByText("Najbardziej kosztowne grupy zajęciowe")
    ).toBeInTheDocument();
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  test("używa domyślnych pustych danych gdy data nie jest przekazana", () => {
    render(<TopCostGroups />);

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(
      screen.getByText("Najbardziej kosztowne grupy zajęciowe")
    ).toBeInTheDocument();
  });

  test("ma poprawne klasy CSS dla głównego kontenera", () => {
    render(<TopCostGroups data={mockData} />);

    const container = screen
      .getByText("Najbardziej kosztowne grupy zajęciowe")
      .closest("div");

    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-col");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("w-full");
    expect(container).toHaveClass("mt-15");
    expect(container).toHaveClass("pb-15");
  });

  test("nagłówek ma poprawne klasy", () => {
    render(<TopCostGroups data={mockData} />);

    const header = screen.getByText("Najbardziej kosztowne grupy zajęciowe");
    expect(header).toHaveClass("text-lg");
    expect(header).toHaveClass("font-semibold");
    expect(header).toHaveClass("mb-4");
  });

  test("kontener tabeli ma poprawne klasy", () => {
    render(<TopCostGroups data={mockData} />);

    const tableContainer = screen.getByTestId("table").parentElement;
    expect(tableContainer).toHaveClass("bg-white");
    expect(tableContainer).toHaveClass("rounded-md");
    expect(tableContainer).toHaveClass("shadow");
    expect(tableContainer).toHaveClass("w-11/12");
    expect(tableContainer).toHaveClass("p-4");
  });

  test("renderuje wszystkie pola dla każdego wiersza danych", () => {
    render(<TopCostGroups data={mockData} />);

    mockData.forEach((item) => {
      expect(screen.getByTestId(`cell-${item.id}-id`)).toBeInTheDocument();
      expect(screen.getByTestId(`cell-${item.id}-name`)).toBeInTheDocument();
      expect(screen.getByTestId(`cell-${item.id}-teacher`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`cell-${item.id}-services`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`cell-${item.id}-semester`)
      ).toBeInTheDocument();
      expect(screen.getByTestId(`cell-${item.id}-cost`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`cell-${item.id}-budgetProgress`)
      ).toBeInTheDocument();
    });
  });

  test("pasek postępu ma poprawną strukturę HTML", () => {
    render(<TopCostGroups data={mockData} />);

    const progressCell = screen.getByTestId("cell-1-budgetProgress");

    const flexContainer = progressCell.querySelector(
      ".flex.items-center.justify-center"
    );
    expect(flexContainer).toBeInTheDocument();

    const wrapper = flexContainer.querySelector(".w-\\[180px\\]");
    expect(wrapper).toBeInTheDocument();

    const outerBar = wrapper.querySelector(
      ".h-3.bg-gray-200.rounded-full.overflow-hidden"
    );
    expect(outerBar).toBeInTheDocument();

    const innerBar = outerBar.querySelector(".h-full.rounded-full");
    expect(innerBar).toBeInTheDocument();
  });

  test("kolumna cost ma flagę numbers", () => {
    const { container } = render(<TopCostGroups data={mockData} />);

    expect(
      container.querySelector('[data-testid="table"]')
    ).toBeInTheDocument();
  });

  test("obsługuje budgetPercent równy dokładnie 40", () => {
    const exactBudgetData = [
      {
        id: 96,
        name: "Exact 40",
        teacher: "Test",
        services: ["AWS"],
        semester: "2025L",
        cost: 400,
        budgetPercent: 40,
      },
    ];

    render(<TopCostGroups data={exactBudgetData} />);

    const progressBar = screen
      .getByTestId("cell-96-budgetProgress")
      .querySelector("div[style]");
    expect(progressBar).toHaveStyle({ width: "40%", background: "#f59e0b" });
  });

  test("obsługuje budgetPercent równy dokładnie 70", () => {
    const exactBudgetData = [
      {
        id: 95,
        name: "Exact 70",
        teacher: "Test",
        services: ["AWS"],
        semester: "2025L",
        cost: 700,
        budgetPercent: 70,
      },
    ];

    render(<TopCostGroups data={exactBudgetData} />);

    const progressBar = screen
      .getByTestId("cell-95-budgetProgress")
      .querySelector("div[style]");
    expect(progressBar).toHaveStyle({ width: "70%", background: "#ef4444" });
  });

  test("obsługuje pustą tablicę usług", () => {
    const emptyServicesData = [
      {
        id: 94,
        name: "No Services",
        teacher: "Test",
        services: [],
        semester: "2025L",
        cost: 100,
        budgetPercent: 20,
      },
    ];

    render(<TopCostGroups data={emptyServicesData} />);

    const servicesCell = screen.getByTestId("cell-94-services");
    expect(servicesCell).toHaveTextContent("");
  });
});
