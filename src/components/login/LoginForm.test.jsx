import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { useLoginForm } from "@/lib/views/auth/hooks";

// Mockowanie hooka
jest.mock("@/lib/views/auth/hooks");

// Mockowanie InputForm - uproszczone, ale funkcjonalne dla dostępności (a11y)
jest.mock("./InputForm", () => ({
  __esModule: true,
  default: ({ name, placeholder, label, type, error, required }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

describe("LoginForm", () => {
  let mockHandleSubmit;
  let defaultMutation;

  beforeEach(() => {
    mockHandleSubmit = jest.fn((e) => e.preventDefault());
    defaultMutation = { isPending: false };

    useLoginForm.mockReturnValue({
      mutation: defaultMutation,
      formErrors: {},
      handleSubmit: mockHandleSubmit,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderuje wszystkie kluczowe elementy formularza", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /zaloguj/i })
    ).toBeInTheDocument();
  });

  test("pola formularza mają poprawne atrybuty techniczne", () => {
    render(<LoginForm />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/hasło/i);

    expect(loginInput).toHaveAttribute("type", "text");
    expect(loginInput).toBeRequired();
    expect(loginInput).toHaveAttribute("placeholder", "Wprowadź login");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();
  });

  test("wyświetla błędy walidacji dla konkretnych pól", () => {
    useLoginForm.mockReturnValue({
      mutation: defaultMutation,
      formErrors: {
        login: ["Login jest wymagany"],
        password: ["Hasło jest za krótkie"],
      },
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginForm />);

    expect(screen.getByText("Login jest wymagany")).toBeInTheDocument();
    expect(screen.getByText("Hasło jest za krótkie")).toBeInTheDocument();
  });

  test("wyświetla ogólny błąd logowania (api error)", () => {
    useLoginForm.mockReturnValue({
      mutation: defaultMutation,
      formErrors: { error: "Nieprawidłowe dane logowania" },
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginForm />);

    expect(
      screen.getByText("Nieprawidłowe dane logowania")
    ).toBeInTheDocument();
  });

  test("obsługuje stan ładowania (loading state)", () => {
    useLoginForm.mockReturnValue({
      mutation: { isPending: true },
      formErrors: {},
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /logowanie.../i });

    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-not-allowed");
    // Sprawdzamy czy nie ma tekstu "Zaloguj"
    expect(screen.queryByText("Zaloguj")).not.toBeInTheDocument();
  });

  test("wywołuje handleSubmit po wysłaniu formularza", () => {
    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /zaloguj/i })
      .closest("form");
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test("przycisk ma odpowiednie klasy wizualne w zależności od stanu", () => {
    const { rerender } = render(<LoginForm />);

    // Stan normalny
    let button = screen.getByRole("button", { name: /zaloguj/i });
    expect(button).toHaveClass("bg-[#614DE2]", "cursor-pointer");

    // Zmiana na stan ładowania
    useLoginForm.mockReturnValue({
      mutation: { isPending: true },
      formErrors: {},
      handleSubmit: mockHandleSubmit,
    });

    rerender(<LoginForm />);
    button = screen.getByRole("button", { name: /logowanie.../i });
    expect(button).toHaveClass("bg-[#b6acf9]", "cursor-not-allowed");
  });
});
