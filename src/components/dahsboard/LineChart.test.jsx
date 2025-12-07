import { render, screen } from "@testing-library/react";
import MyLineChart from "./LineChart";

const mockData = [
  { date: "January", cost: 400 },
  { date: "February", cost: 300 },
  { date: "March", cost: 500 },
  { date: "April", cost: 250 },
];

jest.mock("recharts", () => {
  const LineChart = ({ width, style, responsive, data, margin, children }) => (
    <div
      data-testid="line-chart"
      data-width={width}
      data-style={JSON.stringify(style)}
      data-responsive={responsive}
      data-length={Array.isArray(data) ? data.length : 0}
      data-margin={JSON.stringify(margin)}
    >
      {children}
    </div>
  );

  const Line = ({ type, dataKey, stroke, strokeWidth, date, name }) => (
    <div
      data-testid="line"
      data-type={type}
      data-key={dataKey}
      data-stroke={stroke}
      data-stroke-width={strokeWidth}
      data-date={date}
      data-name={name}
    ></div>
  );

  const CartesianGrid = ({ stroke, strokeDasharray }) => (
    <div
      data-testid="cartesian-grid"
      data-stroke={stroke}
      data-dasharray={strokeDasharray}
    ></div>
  );

  const XAxis = ({ dataKey, label }) => (
    <div
      data-testid="x-axis"
      data-key={dataKey}
      data-label={JSON.stringify(label)}
    ></div>
  );

  const YAxis = ({ width, label }) => (
    <div
      data-testid="y-axis"
      data-width={width}
      data-label={JSON.stringify(label)}
    ></div>
  );

  const Tooltip = () => <div data-testid="tooltip"></div>;
  const Legend = ({ align }) => (
    <div data-testid="legend" data-align={align}></div>
  );

  return {
    __esModule: true,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
  };
});

describe("MyLineChart", () => {
  test("renderuje nagłówek sekcji", () => {
    render(<MyLineChart data={mockData} />);

    expect(screen.getByText("Trend kosztów")).toBeInTheDocument();
  });

  test("przekazuje dane do LineChart", () => {
    render(<MyLineChart data={mockData} />);

    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toHaveAttribute(
      "data-length",
      mockData.length.toString()
    );
  });

  test("LineChart ma poprawne style", () => {
    render(<MyLineChart data={mockData} />);

    const lineChart = screen.getByTestId("line-chart");
    const style = JSON.parse(lineChart.getAttribute("data-style"));
    expect(style).toEqual({
      width: "100%",
      aspectRatio: 1.618,
      maxWidth: 600,
    });
  });

  test("LineChart ma responsive=true", () => {
    render(<MyLineChart data={mockData} />);

    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toHaveAttribute("data-responsive", "true");
  });

  test("LineChart ma poprawny margin", () => {
    render(<MyLineChart data={mockData} />);

    const lineChart = screen.getByTestId("line-chart");
    const margin = JSON.parse(lineChart.getAttribute("data-margin"));
    expect(margin).toEqual({ top: 20, right: 20, bottom: 5, left: 0 });
  });

  test("konfiguruje linię z poprawnymi parametrami", () => {
    render(<MyLineChart data={mockData} />);

    const line = screen.getByTestId("line");
    expect(line).toHaveAttribute("data-type", "monotone");
    expect(line).toHaveAttribute("data-key", "cost");
    expect(line).toHaveAttribute("data-stroke", "purple");
    expect(line).toHaveAttribute("data-stroke-width", "2");
    expect(line).toHaveAttribute("data-date", "Trend Kosztów");
  });

  test("CartesianGrid ma poprawne ustawienia", () => {
    render(<MyLineChart data={mockData} />);

    const grid = screen.getByTestId("cartesian-grid");
    expect(grid).toHaveAttribute("data-stroke", "#aaa");
    expect(grid).toHaveAttribute("data-dasharray", "5 5");
  });

  test("XAxis ma poprawną konfigurację", () => {
    render(<MyLineChart data={mockData} />);

    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-key", "date");

    const label = JSON.parse(xAxis.getAttribute("data-label"));
    expect(label).toEqual({
      position: "insideBottom",
      value: "Data",
      offset: -10,
    });
  });

  test("YAxis ma poprawną konfigurację", () => {
    render(<MyLineChart data={mockData} />);

    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toHaveAttribute("data-width", "auto");

    const label = JSON.parse(yAxis.getAttribute("data-label"));
    expect(label).toEqual({
      value: "Koszt",
      position: "insideLeft",
      angle: -90,
    });
  });

  test("Legend ma align='right'", () => {
    render(<MyLineChart data={mockData} />);

    const legend = screen.getByTestId("legend");
    expect(legend).toHaveAttribute("data-align", "right");
  });

  test("obsługuje data=null", () => {
    render(<MyLineChart data={null} />);

    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toHaveAttribute("data-length", "0");
  });

  test("obsługuje puste dane", () => {
    render(<MyLineChart data={[]} />);

    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toHaveAttribute("data-length", "0");
  });

  test("ma poprawne klasy CSS dla kontenera", () => {
    render(<MyLineChart data={mockData} />);

    const container = screen.getByText("Trend kosztów").closest("div");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-col");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("items-center");
  });

  test("nagłówek ma poprawne klasy", () => {
    render(<MyLineChart data={mockData} />);

    const header = screen.getByText("Trend kosztów");
    expect(header).toHaveClass("text-lg");
    expect(header).toHaveClass("font-semibold");
    expect(header).toHaveClass("mb-4");
  });

  test("renderuje wszystkie komponenty recharts", () => {
    render(<MyLineChart data={mockData} />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  test("wyświetla nagłówek nawet przy braku danych", () => {
    render(<MyLineChart data={[]} />);

    expect(screen.getByText("Trend kosztów")).toBeInTheDocument();
  });
});
