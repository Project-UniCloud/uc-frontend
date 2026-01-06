import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Table from "./Table";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Table", () => {
  const columns = [
    { key: "name", header: "Name" },
    { key: "age", header: "Age", numbers: true },
    { key: "status", header: "Status" },
  ];

  const data = [
    { id: 1, name: "John", age: 25, status: "ACTIVE" },
    { id: 2, name: "Jane", age: 30, status: "INACTIVE" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      columns,
      data,
      ...props,
    };
    return render(<Table {...defaultProps} />);
  };

  it("renderuje nagłówki kolumn", () => {
    renderComponent();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renderuje dane w wierszach", () => {
    renderComponent();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("formatuje liczby z toFixed(2) gdy numbers=true", () => {
    renderComponent();
    expect(screen.getByText("25.00")).toBeInTheDocument();
    expect(screen.getByText("30.00")).toBeInTheDocument();
  });

  it("wyświetla - dla wartości null", () => {
    const dataWithNull = [{ id: 1, name: null, age: 25, status: "ACTIVE" }];
    renderComponent({ data: dataWithNull });
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("wyświetla - dla wartości undefined", () => {
    const dataWithUndefined = [{ id: 1, name: "John", status: "ACTIVE" }];
    renderComponent({ data: dataWithUndefined });
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("wywołuje custom render funkcję", () => {
    const columnsWithRender = [
      {
        key: "name",
        header: "Name",
        render: (row) => <span>Custom: {row.name}</span>,
      },
    ];
    renderComponent({ columns: columnsWithRender });
    expect(screen.getByText("Custom: John")).toBeInTheDocument();
    expect(screen.getByText("Custom: Jane")).toBeInTheDocument();
  });

  it("nawiguje po kliknięciu wiersza gdy whereNavigate jest podane", async () => {
    const user = userEvent.setup();
    renderComponent({ whereNavigate: "/groups", idKey: "id" });

    const firstRow = screen.getByText("John").closest("tr");
    await user.click(firstRow);

    expect(mockPush).toHaveBeenCalledWith("/groups/1");
  });

  it("nie nawiguje gdy whereNavigate nie jest podane", async () => {
    const user = userEvent.setup();
    renderComponent();

    const firstRow = screen.getByText("John").closest("tr");
    await user.click(firstRow);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("używa poprawnego idKey do nawigacji", async () => {
    const user = userEvent.setup();
    const customData = [{ customId: "abc123", name: "John", age: 25 }];
    renderComponent({
      data: customData,
      whereNavigate: "/items",
      idKey: "customId",
    });

    const row = screen.getByText("John").closest("tr");
    await user.click(row);

    expect(mockPush).toHaveBeenCalledWith("/items/abc123");
  });

  it("stosuje czerwony kolor dla statusu INACTIVE", () => {
    renderComponent();
    const inactiveCell = screen.getByText("INACTIVE");
    expect(inactiveCell).toHaveClass("text-red");
    expect(inactiveCell).toHaveClass("font-semibold");
  });

  it("stosuje czerwony kolor dla statusu FAILED", () => {
    const dataWithFailed = [{ id: 1, name: "Test", status: "FAILED" }];
    renderComponent({ data: dataWithFailed });
    const failedCell = screen.getByText("FAILED");
    expect(failedCell).toHaveClass("text-red");
    expect(failedCell).toHaveClass("font-semibold");
  });

  it("stosuje zielony kolor dla statusu ACTIVE", () => {
    renderComponent();
    const activeCell = screen.getByText("ACTIVE");
    expect(activeCell).toHaveClass("text-green");
    expect(activeCell).toHaveClass("font-semibold");
  });

  it("renderuje pustą tabelę gdy brak danych", () => {
    renderComponent({ data: [] });
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
  });

  it("używa row.id jako key dla wiersza", () => {
    const { container } = renderComponent();
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(2);
  });

  it("używa idx jako key gdy brak row.id", () => {
    const dataWithoutId = [
      { name: "John", age: 25, status: "ACTIVE" },
      { name: "Jane", age: 30, status: "INACTIVE" },
    ];
    const { container } = renderComponent({ data: dataWithoutId });
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(2);
  });

  it("renderuje wiele wierszy poprawnie", () => {
    const manyData = [
      { id: 1, name: "Person1", age: 20, status: "ACTIVE" },
      { id: 2, name: "Person2", age: 25, status: "INACTIVE" },
      { id: 3, name: "Person3", age: 30, status: "FAILED" },
    ];
    renderComponent({ data: manyData });
    expect(screen.getByText("Person1")).toBeInTheDocument();
    expect(screen.getByText("Person2")).toBeInTheDocument();
    expect(screen.getByText("Person3")).toBeInTheDocument();
  });

  it("formatuje tylko liczby z numbers=true", () => {
    const columnsWithoutNumbers = [
      { key: "name", header: "Name" },
      { key: "age", header: "Age" },
    ];
    renderComponent({ columns: columnsWithoutNumbers });
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.queryByText("25.00")).not.toBeInTheDocument();
  });

  it("nie formatuje stringów nawet gdy numbers=true", () => {
    const dataWithString = [
      { id: 1, name: "John", age: "twenty", status: "ACTIVE" },
    ];
    renderComponent({ data: dataWithString });
    expect(screen.getByText("twenty")).toBeInTheDocument();
  });

  it("przekazuje row i idx do custom render", () => {
    const renderSpy = jest.fn((row, idx) => `${row.name}-${idx}`);
    const columnsWithSpy = [{ key: "name", header: "Name", render: renderSpy }];
    renderComponent({ columns: columnsWithSpy });

    expect(renderSpy).toHaveBeenCalledWith(data[0], 0);
    expect(renderSpy).toHaveBeenCalledWith(data[1], 1);
  });

  it("renderuje poprawnie liczby zero", () => {
    const dataWithZero = [{ id: 1, name: "Test", age: 0, status: "ACTIVE" }];
    const columnsWithNumbers = [{ key: "age", header: "Age", numbers: true }];
    renderComponent({ data: dataWithZero, columns: columnsWithNumbers });
    expect(screen.getByText("0.00")).toBeInTheDocument();
  });
});
