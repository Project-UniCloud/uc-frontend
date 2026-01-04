import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentDetailsPage from "./page";

// 1. Mockowanie Hooka
const mockUseStudentDetailPage = jest.fn();

jest.mock("@/lib/views/groups/groupId/studentId/hooks", () => ({
  useStudentDetailPage: (...args) => mockUseStudentDetailPage(...args),
}));

// 2. Mockowanie komponentów UI (z zachowaniem funkcjonalności dostępności)
jest.mock("@/components/utils/InputForm", () => ({
  __esModule: true,
  default: ({ label, name, value, disabled, onChange }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  ),
}));

jest.mock("@/components/utils/Buttons", () => ({
  Button: ({ children, onClick, disabled, label }) => (
    <button onClick={onClick} disabled={disabled} aria-label={label}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/students/DeleteStudentModal", () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="delete-modal" />),
  };
});

// 3. Obsługa React.use dla Next.js params
const originalUse = React.use;
beforeAll(() => {
  React.use = jest.fn((value) => value);
});
afterAll(() => {
  React.use = originalUse;
});

// 4. Dane testowe
const baseParams = { groupId: "g-1", studentId: "s-1" };

const defaultHookResult = () => ({
  student: {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan@example.com",
    login: "12345",
  },
  groupName: "Grupa A",
  loading: false,
  formLoading: false,
  error: null,
  editing: false,
  isOpen: false,
  setIsOpen: jest.fn(),
  handleChange: jest.fn(() => jest.fn()),
  handleEditClick: jest.fn(),
});

describe("StudentDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStudentDetailPage.mockReturnValue(defaultHookResult());
  });

  test("pokazuje stan ładowania i ukrywa przycisk edycji", () => {
    mockUseStudentDetailPage.mockReturnValue({
      ...defaultHookResult(),
      loading: true,
    });

    render(<StudentDetailsPage params={baseParams} />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    expect(screen.queryByText("Edytuj")).not.toBeInTheDocument();
  });

  test("wyświetla błąd, gdy wystąpi", () => {
    mockUseStudentDetailPage.mockReturnValue({
      ...defaultHookResult(),
      error: "Błąd bazy danych",
    });

    render(<StudentDetailsPage params={baseParams} />);
    expect(screen.getByText("Błąd bazy danych")).toBeInTheDocument();
  });

  test("wyświetla dane studenta w polach formularza", () => {
    render(<StudentDetailsPage params={baseParams} />);

    expect(screen.getByLabelText("Imię")).toHaveValue("Jan");
    expect(screen.getByLabelText("Nazwisko")).toHaveValue("Kowalski");
    expect(screen.getByLabelText("Mail")).toHaveValue("jan@example.com");
    expect(screen.getByLabelText("Indeks")).toHaveValue("12345");
  });

  test("wywołuje handleEditClick po kliknięciu Edytuj", () => {
    const hookResult = defaultHookResult();
    mockUseStudentDetailPage.mockReturnValue(hookResult);

    render(<StudentDetailsPage params={baseParams} />);

    fireEvent.click(screen.getByText("Edytuj"));
    expect(hookResult.handleEditClick).toHaveBeenCalledTimes(1);
  });

  test("otwiera modal usuwania po kliknięciu Usuń studenta", () => {
    const hookResult = defaultHookResult();
    mockUseStudentDetailPage.mockReturnValue(hookResult);

    render(<StudentDetailsPage params={baseParams} />);

    fireEvent.click(screen.getByText("Usuń studenta"));
    expect(hookResult.setIsOpen).toHaveBeenCalledWith(true);
  });

  test("blokuje przyciski w trybie zapisu (formLoading)", () => {
    mockUseStudentDetailPage.mockReturnValue({
      ...defaultHookResult(),
      editing: true,
      formLoading: true,
    });

    render(<StudentDetailsPage params={baseParams} />);

    // Przycisk Zapisz powinien być disabled
    expect(screen.getByText("Zapisz")).toBeDisabled();
    // Przycisk Usuń powinien być disabled
    expect(screen.getByText("Usuń studenta")).toBeDisabled();
  });

  test("blokuje przycisk usuwania w trybie edycji", () => {
    mockUseStudentDetailPage.mockReturnValue({
      ...defaultHookResult(),
      editing: true,
    });

    render(<StudentDetailsPage params={baseParams} />);

    expect(screen.getByText("Usuń studenta")).toBeDisabled();
  });

  test("wywołuje handleChange przy zmianie danych w polach", () => {
    const hookResult = defaultHookResult();
    const mockInnerHandler = jest.fn();
    hookResult.handleChange.mockReturnValue(mockInnerHandler);
    hookResult.editing = true; // odblokowujemy inputy

    mockUseStudentDetailPage.mockReturnValue(hookResult);

    render(<StudentDetailsPage params={baseParams} />);

    const input = screen.getByLabelText("Imię");
    fireEvent.change(input, { target: { value: "NoweImie" } });

    expect(hookResult.handleChange).toHaveBeenCalledWith("firstName");
    expect(mockInnerHandler).toHaveBeenCalled();
  });
});
