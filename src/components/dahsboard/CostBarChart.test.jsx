import { render, screen } from "@testing-library/react";
import CostBarChart from "./CostBarChart";

const mockData = [
  { name: "AWS", cost: 500 },
  { name: "Bazy Danych", cost: 250 },
  { name: "Big Data", cost: 1000 },
];

jest.mock("recharts", () => {
  const ResponsiveContainer = ({ width, height, children }) => (
    <div
      data-testid="responsive-container"
      data-width={width}
      data-height={height}
    >
      {typeof children === "function"
        ? children({ width: 800, height: 600 })
        : children}
    </div>
  );

  const BarChart = ({ data, margin, children }) => (
    <div
      data-testid="bar-chart"
      data-length={Array.isArray(data) ? data.length : 0}
      data-margin={JSON.stringify(margin)}
    >
      {children}
    </div>
  );

  const Bar = ({ dataKey, fill, children }) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill}>
      {children}
    </div>
  );

  const Cell = ({ fill }) => <div data-testid="cell" data-fill={fill}></div>;

  const XAxis = ({ dataKey }) => (
    <div data-testid="x-axis" data-key={dataKey}></div>
  );

  const YAxis = () => <div data-testid="y-axis"></div>;

  const CartesianGrid = ({ strokeDasharray }) => (
    <div data-testid="cartesian-grid" data-dasharray={strokeDasharray}></div>
  );

  const Tooltip = () => <div data-testid="tooltip"></div>;
  const Legend = () => <div data-testid="legend"></div>;

  return {
    __esModule: true,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  };
});

describe("CostBarChart", () => {
  test("renderuje nagłówek sekcji", () => {
    render(<CostBarChart data={mockData} />);

    expect(screen.getByText("Porównanie grup zajęciowych")).toBeInTheDocument();
  });

  test("przekazuje dane do BarChart", () => {
    render(<CostBarChart data={mockData} />);

    expect(screen.getByTestId("bar-chart")).toHaveAttribute(
      "data-length",
      mockData.length.toString()
    );
  });

  test("konfiguruje słupki z poprawnym kluczem i kolorem", () => {
    render(<CostBarChart data={mockData} />);

    const bar = screen.getByTestId("bar");
    expect(bar).toHaveAttribute("data-key", "cost");
    expect(bar).toHaveAttribute("data-fill", "#8884d8");
  });

  test("obsługuje brak danych bez rzucania błędu", () => {
    render(<CostBarChart data={[]} />);

    expect(screen.getByTestId("bar-chart")).toHaveAttribute("data-length", "0");
  });

  test("obsługuje data=null", () => {
    render(<CostBarChart data={null} />);

    expect(screen.getByTestId("bar-chart")).toHaveAttribute("data-length", "0");
  });

  test("ResponsiveContainer ma width=100% i height=320", () => {
    render(<CostBarChart data={mockData} />);

    const responsiveContainer = screen.getByTestId("responsive-container");
    expect(responsiveContainer).toHaveAttribute("data-width", "100%");
    expect(responsiveContainer).toHaveAttribute("data-height", "320");
  });

  test("BarChart ma poprawny margin", () => {
    render(<CostBarChart data={mockData} />);

    const barChart = screen.getByTestId("bar-chart");
    const margin = JSON.parse(barChart.getAttribute("data-margin"));
    expect(margin).toEqual({ top: 10, right: 20, left: 0, bottom: 5 });
  });

  test("CartesianGrid ma strokeDasharray='3 3'", () => {
    render(<CostBarChart data={mockData} />);

    const grid = screen.getByTestId("cartesian-grid");
    expect(grid).toHaveAttribute("data-dasharray", "3 3");
  });

  test("ma poprawne klasy CSS", () => {
    render(<CostBarChart data={mockData} />);

    const container = screen
      .getByText("Porównanie grup zajęciowych")
      .closest("div");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-col");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("items-center");
  });

  test("nagłówek ma poprawne klasy", () => {
    render(<CostBarChart data={mockData} />);

    const header = screen.getByText("Porównanie grup zajęciowych");
    expect(header).toHaveClass("text-lg");
    expect(header).toHaveClass("font-semibold");
    expect(header).toHaveClass("mb-4");
  });

  test("renderuje XAxis z dataKey='name'", () => {
    render(<CostBarChart data={mockData} />);

    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-key", "name");
  });

  test("renderuje wszystkie komponenty recharts", () => {
    render(<CostBarChart data={mockData} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });
});
