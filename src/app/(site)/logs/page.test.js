import { render, screen } from "@testing-library/react";
import LogsPage from "@/app/(site)/logs/page";
import { useLogsPage } from "@/lib/views/logs/hooks";

jest.mock("@/lib/views/logs/hooks", () => ({
  useLogsPage: jest.fn(),
}));

jest.mock("@/components/views/DataTableView", () => (props) => (
  <div data-testid="datatable">{(props.data || []).length}</div>
));

jest.mock("@/components/utils/Hint", () => ({ children }) => (
  <div data-testid="hint">{children}</div>
));

describe("LogsPage", () => {
  test("renders DataTableView with logs", () => {
    useLogsPage.mockReturnValue({
      logs: [{ id: "1" }],
      loading: false,
      error: null,
      page: 0,
      setPage: jest.fn(),
      pageSize: 10,
      setPageSize: jest.fn(),
      totalPages: 1,
    });

    render(<LogsPage />);

    expect(screen.getByTestId("datatable")).toHaveTextContent("1");
    expect(screen.getByTestId("hint")).toBeInTheDocument();
  });

  test("renders error message", () => {
    useLogsPage.mockReturnValue({
      logs: [],
      loading: false,
      error: "Błąd",
      page: 0,
      setPage: jest.fn(),
      pageSize: 10,
      setPageSize: jest.fn(),
      totalPages: 0,
    });

    render(<LogsPage />);

    expect(screen.getByText("Błąd")).toBeInTheDocument();
  });
});
