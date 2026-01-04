import React from "react";
import { render, screen } from "@testing-library/react";
import DataTableView from "./DataTableView";

jest.mock("@/components/table/Table", () => {
  return function MockTable({ columns, data, whereNavigate, idKey }) {
    return (
      <div data-testid="table-component">
        <div data-testid="table-columns">{columns?.length || 0}</div>
        <div data-testid="table-data">{data?.length || 0}</div>
        <div data-testid="table-where-navigate">{whereNavigate}</div>
        <div data-testid="table-id-key">{idKey}</div>
      </div>
    );
  };
});

jest.mock("@/components/pagination/Pagination", () => {
  return function MockPagination({
    page,
    setPage,
    totalPages,
    pageSize,
    setPageSize,
  }) {
    return (
      <div data-testid="pagination-component">
        <div data-testid="pagination-page">{page}</div>
        <div data-testid="pagination-total-pages">{totalPages}</div>
        <div data-testid="pagination-page-size">{pageSize}</div>
      </div>
    );
  };
});

describe("DataTableView", () => {
  const mockSetPage = jest.fn();
  const mockSetPageSize = jest.fn();

  const defaultProps = {
    leftActions: <div data-testid="left-actions">Left</div>,
    rightActions: <div data-testid="right-actions">Right</div>,
    loading: false,
    error: null,
    data: [{ id: 1, name: "Test" }],
    columns: [{ key: "name", label: "Name" }],
    whereNavigate: "/test",
    idKey: "id",
    page: 1,
    setPage: mockSetPage,
    pageSize: 10,
    setPageSize: mockSetPageSize,
    totalPages: 5,
    emptyMessage: "Brak danych",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderuje lewe akcje", () => {
    render(<DataTableView {...defaultProps} />);
    expect(screen.getByTestId("left-actions")).toBeInTheDocument();
  });

  test("renderuje prawe akcje", () => {
    render(<DataTableView {...defaultProps} />);
    expect(screen.getByTestId("right-actions")).toBeInTheDocument();
  });

  test("renderuje tabelę z danymi", () => {
    render(<DataTableView {...defaultProps} />);
    expect(screen.getByTestId("table-component")).toBeInTheDocument();
  });

  test("renderuje paginację gdy są dane", () => {
    render(<DataTableView {...defaultProps} />);
    expect(screen.getByTestId("pagination-component")).toBeInTheDocument();
  });

  test("przekazuje kolumny do tabeli", () => {
    const columns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
    ];
    render(<DataTableView {...defaultProps} columns={columns} />);
    expect(screen.getByTestId("table-columns")).toHaveTextContent("2");
  });

  test("przekazuje dane do tabeli", () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    render(<DataTableView {...defaultProps} data={data} />);
    expect(screen.getByTestId("table-data")).toHaveTextContent("3");
  });

  test("przekazuje whereNavigate do tabeli", () => {
    render(<DataTableView {...defaultProps} whereNavigate="/dashboard" />);
    expect(screen.getByTestId("table-where-navigate")).toHaveTextContent(
      "/dashboard"
    );
  });

  test("przekazuje idKey do tabeli", () => {
    render(<DataTableView {...defaultProps} idKey="customId" />);
    expect(screen.getByTestId("table-id-key")).toHaveTextContent("customId");
  });

  test("przekazuje stronę do paginacji", () => {
    render(<DataTableView {...defaultProps} page={3} />);
    expect(screen.getByTestId("pagination-page")).toHaveTextContent("3");
  });

  test("przekazuje pageSize do paginacji", () => {
    render(<DataTableView {...defaultProps} pageSize={25} />);
    expect(screen.getByTestId("pagination-page-size")).toHaveTextContent("25");
  });

  test("przekazuje totalPages do paginacji", () => {
    render(<DataTableView {...defaultProps} totalPages={10} />);
    expect(screen.getByTestId("pagination-total-pages")).toHaveTextContent(
      "10"
    );
  });

  test("wyświetla wiadomość o błędzie gdy error jest ustawiony", () => {
    render(<DataTableView {...defaultProps} error="Błąd wczytywania" />);
    expect(screen.getByText("Błąd wczytywania")).toBeInTheDocument();
  });

  test("wyświetla komunikat ładowania gdy loading=true", () => {
    render(<DataTableView {...defaultProps} loading={true} />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
  });

  test("nie renderuje tabeli gdy loading=true", () => {
    render(<DataTableView {...defaultProps} loading={true} />);
    expect(screen.queryByTestId("table-component")).not.toBeInTheDocument();
  });

  test("nie renderuje paginacji gdy loading=true", () => {
    render(<DataTableView {...defaultProps} loading={true} />);
    expect(
      screen.queryByTestId("pagination-component")
    ).not.toBeInTheDocument();
  });

  test("wyświetla domyślną wiadomość gdy brak danych", () => {
    render(<DataTableView {...defaultProps} data={[]} />);
    expect(screen.getByText("Brak danych")).toBeInTheDocument();
  });

  test("wyświetla niestandardową wiadomość gdy brak danych", () => {
    render(
      <DataTableView
        {...defaultProps}
        data={[]}
        emptyMessage="Brak wyników wyszukiwania"
      />
    );
    expect(screen.getByText("Brak wyników wyszukiwania")).toBeInTheDocument();
  });

  test("nie renderuje tabeli gdy data jest pusta", () => {
    render(<DataTableView {...defaultProps} data={[]} />);
    expect(screen.queryByTestId("table-component")).not.toBeInTheDocument();
  });

  test("nie renderuje paginacji gdy data jest pusta", () => {
    render(<DataTableView {...defaultProps} data={[]} />);
    expect(
      screen.queryByTestId("pagination-component")
    ).not.toBeInTheDocument();
  });

  test("wyświetla wiadomość gdy data jest null", () => {
    render(<DataTableView {...defaultProps} data={null} />);
    expect(screen.getByText("Brak danych")).toBeInTheDocument();
  });

  test("używa domyślnego whereNavigate jako pusty string", () => {
    const { whereNavigate, ...propsWithoutWhereNavigate } = defaultProps;
    render(<DataTableView {...propsWithoutWhereNavigate} />);
    expect(screen.getByTestId("table-where-navigate")).toHaveTextContent("");
  });

  test("używa domyślnego idKey jako pusty string", () => {
    const { idKey, ...propsWithoutIdKey } = defaultProps;
    render(<DataTableView {...propsWithoutIdKey} />);
    expect(screen.getByTestId("table-id-key")).toHaveTextContent("");
  });

  test("używa domyślnego emptyMessage", () => {
    const { emptyMessage, ...propsWithoutEmptyMessage } = defaultProps;
    render(<DataTableView {...propsWithoutEmptyMessage} data={[]} />);
    expect(screen.getByText("Brak danych do wyświetlenia")).toBeInTheDocument();
  });

  test("renderuje zarówno lewe i prawe akcje razem", () => {
    render(<DataTableView {...defaultProps} />);
    expect(screen.getByTestId("left-actions")).toBeInTheDocument();
    expect(screen.getByTestId("right-actions")).toBeInTheDocument();
  });

  test("wyświetla zarówno tabelę i paginację gdy jest data", () => {
    render(<DataTableView {...defaultProps} />);
    expect(screen.getByTestId("table-component")).toBeInTheDocument();
    expect(screen.getByTestId("pagination-component")).toBeInTheDocument();
  });
});
