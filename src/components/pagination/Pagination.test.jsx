import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
  const defaultProps = {
    page: 0,
    setPage: jest.fn(),
    totalPages: 5,
    pageSize: 10,
    setPageSize: jest.fn(),
    pageSizeOptions: [10, 20, 50],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderuje wszystkie numery stron", () => {
    render(<Pagination {...defaultProps} totalPages={3} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("przycisk Poprzednia jest disabled na pierwszej stronie", () => {
    render(<Pagination {...defaultProps} page={0} />);

    const prevButton = screen.getByText("Poprzednia");
    expect(prevButton).toBeDisabled();
  });

  test("przycisk Poprzednia nie jest disabled gdy nie pierwsza strona", () => {
    render(<Pagination {...defaultProps} page={2} />);

    const prevButton = screen.getByText("Poprzednia");
    expect(prevButton).not.toBeDisabled();
  });

  test("przycisk Następna jest disabled na ostatniej stronie", () => {
    render(<Pagination {...defaultProps} page={4} totalPages={5} />);

    const nextButton = screen.getByText("Następna");
    expect(nextButton).toBeDisabled();
  });

  test("przycisk Następna nie jest disabled gdy nie ostatnia strona", () => {
    render(<Pagination {...defaultProps} page={2} totalPages={5} />);

    const nextButton = screen.getByText("Następna");
    expect(nextButton).not.toBeDisabled();
  });

  test("kliknięcie Poprzednia wywołuje setPage z page-1", () => {
    const setPage = jest.fn();
    render(<Pagination {...defaultProps} page={2} setPage={setPage} />);

    fireEvent.click(screen.getByText("Poprzednia"));

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenCalledWith(expect.any(Function));

    const updateFunction = setPage.mock.calls[0][0];
    expect(updateFunction(2)).toBe(1);
  });

  test("kliknięcie Następna wywołuje setPage z page+1", () => {
    const setPage = jest.fn();
    render(<Pagination {...defaultProps} page={2} setPage={setPage} />);

    fireEvent.click(screen.getByText("Następna"));

    expect(setPage).toHaveBeenCalledTimes(1);
    expect(setPage).toHaveBeenCalledWith(expect.any(Function));

    const updateFunction = setPage.mock.calls[0][0];
    expect(updateFunction(2)).toBe(3);
  });

  test("kliknięcie numeru strony wywołuje setPage z tym numerem", () => {
    const setPage = jest.fn();
    render(<Pagination {...defaultProps} page={0} setPage={setPage} />);

    fireEvent.click(screen.getByText("3"));

    expect(setPage).toHaveBeenCalledWith(2);
  });

  test("renderuje select z opcjami pageSize", () => {
    render(<Pagination {...defaultProps} pageSizeOptions={[5, 10, 25]} />);

    const select = screen.getByRole("combobox");
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(screen.getByRole("option", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument();
  });

  test("select ma poprawną wartość pageSize", () => {
    render(<Pagination {...defaultProps} pageSize={20} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("20");
  });

  test("zmiana pageSize wywołuje setPageSize i resetuje page na 0", () => {
    const setPageSize = jest.fn();
    const setPage = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        page={3}
        pageSize={10}
        setPageSize={setPageSize}
        setPage={setPage}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "50" } });

    expect(setPageSize).toHaveBeenCalledWith(50);
    expect(setPage).toHaveBeenCalledWith(0);
  });

  test("renderuje tekst Wyświetl", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText(/Wyświetl:/)).toBeInTheDocument();
  });

  test("działa poprawnie z totalPages=1", () => {
    render(<Pagination {...defaultProps} page={0} totalPages={1} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Poprzednia")).toBeDisabled();
    expect(screen.getByText("Następna")).toBeDisabled();
  });

  test("renderuje wszystkie przyciski dla dużej liczby stron", () => {
    render(<Pagination {...defaultProps} totalPages={10} />);

    const pageButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) =>
          !btn.textContent.includes("Poprzednia") &&
          !btn.textContent.includes("Następna")
      );

    expect(pageButtons).toHaveLength(10);

    for (let i = 1; i <= 10; i++) {
      const button = pageButtons.find(
        (btn) => btn.textContent === i.toString()
      );
      expect(button).toBeInTheDocument();
    }
  });

  test("używa domyślnych pageSizeOptions gdy nie przekazano", () => {
    const { pageSizeOptions, ...propsWithoutOptions } = defaultProps;
    render(<Pagination {...propsWithoutOptions} />);

    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();
  });
});
