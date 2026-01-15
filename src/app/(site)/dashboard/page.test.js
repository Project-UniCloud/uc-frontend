import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/(site)/dashboard/page";
import { useDashboardPage } from "@/lib/views/dashboard/hooks";
import { usePermissions } from "@/hooks/usePermissions";

jest.mock("@/lib/views/dashboard/hooks", () => ({
  useDashboardPage: jest.fn(),
}));

jest.mock("@/hooks/usePermissions", () => ({
  usePermissions: jest.fn(),
}));

jest.mock("@/components/dahsboard/LineChart", () => () => (
  <div data-testid="line-chart" />
));
jest.mock("@/components/dahsboard/SummaryStats", () => () => (
  <div data-testid="summary-stats" />
));
jest.mock("@/components/dahsboard/PieChart", () => () => (
  <div data-testid="pie-chart" />
));
jest.mock("@/components/dahsboard/CostBarChart", () => () => (
  <div data-testid="cost-bar" />
));

describe("DashboardPage", () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({ isAdmin: true, isLecturer: false });
  });

  test("blocks access for student", () => {
    usePermissions.mockReturnValue({ isAdmin: false, isLecturer: false });

    render(<DashboardPage />);

    expect(
      screen.getByText(/Jako Student nie masz wystarczających uprawnień/i)
    ).toBeInTheDocument();
  });

  test("renders loading state", () => {
    useDashboardPage.mockReturnValue({
      loading: true,
      error: null,
      overallStats: null,
      costPerGroup: [],
      costPerResourceType: [],
      costInTime: [],
    });

    render(<DashboardPage />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
  });

  test("renders error state", () => {
    useDashboardPage.mockReturnValue({
      loading: false,
      error: "Błąd",
      overallStats: null,
      costPerGroup: [],
      costPerResourceType: [],
      costInTime: [],
    });

    render(<DashboardPage />);
    expect(screen.getByText("Błąd")).toBeInTheDocument();
  });

  test("renders charts when loaded", () => {
    useDashboardPage.mockReturnValue({
      loading: false,
      error: null,
      overallStats: {},
      costPerGroup: [],
      costPerResourceType: [],
      costInTime: [],
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("summary-stats")).toBeInTheDocument();
    expect(screen.getByTestId("cost-bar")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });
});
