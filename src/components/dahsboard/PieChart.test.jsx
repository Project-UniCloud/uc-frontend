import { render, screen } from "@testing-library/react";
import PieChart from "./PieChart";

const mockData = [
  { name: "S3", value: 50 },
  { name: "RDS", value: 20 },
  { name: "EC2", value: 20 },
  { name: "AWS LAMBDA", value: 10 },
];

jest.mock("recharts", () => {
  const ResponsiveContainer = ({ width, height, style, children }) => (
    <div
      data-testid="responsive-container"
      data-width={width}
      data-height={height}
      data-style={JSON.stringify(style)}
    >
      {typeof children === "function"
        ? children({ width: 800, height: 600 })
        : children}
    </div>
  );

  const PieChart = ({ width, height, children }) => (
    <div data-testid="pie-chart" data-width={width} data-height={height}>
      {children}
    </div>
  );

  const Pie = ({ data, dataKey, nameKey, label, children }) => (
    <div
      data-testid="pie"
      data-length={Array.isArray(data) ? data.length : 0}
      data-data-key={dataKey}
      data-name-key={nameKey}
      data-has-label={!!label}
    >
      {children}
    </div>
  );

  const Cell = ({ fill }) => <div data-testid="cell" data-fill={fill}></div>;

  const Tooltip = () => <div data-testid="tooltip"></div>;
  const Legend = () => <div data-testid="legend"></div>;

  return {
    __esModule: true,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
  };
});

describe("PieChart", () => {
  test("renderuje nagłówek sekcji", () => {
    render(<PieChart data={mockData} />);

    expect(screen.getByText("Udział typów zasobów")).toBeInTheDocument();
  });

  test("ResponsiveContainer ma poprawne propsy", () => {
    render(<PieChart data={mockData} />);

    const responsiveContainer = screen.getByTestId("responsive-container");
    expect(responsiveContainer).toHaveAttribute("data-width", "100%");
    expect(responsiveContainer).toHaveAttribute("data-height", "100%");

    const style = JSON.parse(responsiveContainer.getAttribute("data-style"));
    expect(style).toEqual({
      aspectRatio: 1.618,
      maxWidth: 600,
    });
  });

  test("PieChart ma width i height na 100%", () => {
    render(<PieChart data={mockData} />);

    const pieChart = screen.getByTestId("pie-chart");
    expect(pieChart).toHaveAttribute("data-width", "100%");
    expect(pieChart).toHaveAttribute("data-height", "100%");
  });

  test("Pie otrzymuje poprawne dane i klucze", () => {
    render(<PieChart data={mockData} />);

    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-length", mockData.length.toString());
    expect(pie).toHaveAttribute("data-data-key", "value");
    expect(pie).toHaveAttribute("data-name-key", "name");
    expect(pie).toHaveAttribute("data-has-label", "true");
  });

  test("renderuje komórki z poprawnymi kolorami", () => {
    const COLORS = ["#8b5cf6", "#6b2135", "#4f46e5", "#93c5fd"];

    render(<PieChart data={mockData} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(mockData.length);

    cells.forEach((cell, index) => {
      expect(cell).toHaveAttribute("data-fill", COLORS[index % COLORS.length]);
    });
  });

  test("obsługuje data=null", () => {
    render(<PieChart data={null} />);

    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-length", "0");
  });

  test("obsługuje puste dane", () => {
    render(<PieChart data={[]} />);

    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-length", "0");
  });

  test("ma poprawne klasy CSS dla kontenera", () => {
    render(<PieChart data={mockData} />);

    const container = screen.getByText("Udział typów zasobów").closest("div");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-col");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("items-center");
  });

  test("nagłówek ma poprawne klasy", () => {
    render(<PieChart data={mockData} />);

    const header = screen.getByText("Udział typów zasobów");
    expect(header).toHaveClass("text-lg");
    expect(header).toHaveClass("font-semibold");
    expect(header).toHaveClass("mb-4");
  });

  test("renderuje wszystkie komponenty recharts", () => {
    render(<PieChart data={mockData} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie")).toBeInTheDocument();
    expect(screen.getAllByTestId("cell").length).toBe(mockData.length);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  test("wyświetla nagłówek nawet przy braku danych", () => {
    render(<PieChart data={[]} />);

    expect(screen.getByText("Udział typów zasobów")).toBeInTheDocument();
  });

  test("obsługuje dane z większą liczbą elementów niż COLORS", () => {
    const largeMockData = [
      { name: "S3", value: 30 },
      { name: "RDS", value: 20 },
      { name: "EC2", value: 15 },
      { name: "AWS LAMBDA", value: 10 },
      { name: "SQS", value: 10 },
      { name: "SNS", value: 8 },
      { name: "CloudWatch", value: 7 },
    ];

    render(<PieChart data={largeMockData} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(largeMockData.length);

    const COLORS = ["#8b5cf6", "#6b2135", "#4f46e5", "#93c5fd"];
    cells.forEach((cell, index) => {
      const expectedColor = COLORS[index % COLORS.length];
      expect(cell).toHaveAttribute("data-fill", expectedColor);
    });
  });

  test("nie rzuca błędów przy różnych typach danych", () => {
    const variedData = [
      { name: "Service A", value: 100 },
      { name: "Service B", value: 75 },
      { name: "", value: 50 },
      { name: "Service C", value: 0 },
    ];

    expect(() => {
      render(<PieChart data={variedData} />);
    }).not.toThrow();
  });
});
