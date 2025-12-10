import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddDriverModal from "./AddDriverModal";
import { addDriver } from "@/lib/driversApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/driversApi");

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
  __esModule: true,
}));

jest.mock("../utils/InputForm", () => {
  return {
    __esModule: true,
    default: ({ name, placeholder, label, type, required }) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          required={required}
          data-testid={`input-${name}`}
          aria-label={label}
        />
      </div>
    ),
  };
});

jest.mock("../utils/Buttons", () => ({
  Button: ({ children, onClick, type, disabled, className }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid={`button-${children}`}
    >
      {children}
    </button>
  ),
}));

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("AddDriverModal", () => {
  let setIsOpen;
  let formResetMock;
  let mockShowSuccessToast;
  let mockShowErrorToast;

  beforeEach(() => {
    setIsOpen = jest.fn();
    addDriver.mockResolvedValue({ success: true });

    const Toast = require("../utils/Toast");
    mockShowSuccessToast = Toast.showSuccessToast;
    mockShowErrorToast = Toast.showErrorToast;

    mockShowSuccessToast.mockClear();
    mockShowErrorToast.mockClear();

    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();

    formResetMock = jest.fn();
    HTMLFormElement.prototype.reset = formResetMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete HTMLFormElement.prototype.reset;
  });

  test("renderuje modal gdy isOpen=true", () => {
    const { container } = render(
      <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />,
      {
        wrapper: createWrapper(),
      }
    );

    const heading = container.querySelector("h2");
    expect(heading).toHaveTextContent("Dodaj sterownik");
  });

  test("wywołuje showModal gdy isOpen zmienia się na true", () => {
    const { rerender } = render(
      <AddDriverModal isOpen={false} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = render(
      <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddDriverModal isOpen={false} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test("renderuje wszystkie wymagane pola formularza", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-cloudConnectorId")).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-host")).toBeInTheDocument();
    expect(screen.getByTestId("input-port")).toBeInTheDocument();
    expect(screen.getByTestId("input-defaultCostLimit")).toBeInTheDocument();
    expect(screen.getByTestId("input-cronExpression")).toBeInTheDocument();
  });

  test("renderuje przyciski Anuluj i Dodaj sterownik", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("button-Anuluj")).toBeInTheDocument();
    expect(screen.getByTestId("button-Dodaj sterownik")).toBeInTheDocument();
  });

  test("renderuje ikonę X do zamykania", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  test("zamyka modal po kliknięciu przycisku Anuluj", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByTestId("button-Anuluj");
    fireEvent.click(cancelButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(formResetMock).toHaveBeenCalled();
  });

  test("zamyka modal po kliknięciu ikony X", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(formResetMock).toHaveBeenCalled();
  });

  test("wywołuje addDriver API z poprawnymi danymi po submit", async () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test Driver" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addDriver).toHaveBeenCalledWith({
        cloudConnectorId: "connector-123",
        name: "Test Driver",
        host: "localhost",
        port: "8080",
        defaultCostLimit: "1000",
        cronExpression: "0 0 * * *",
      });
    });
  });

  test("wywołuje showSuccessToast po udanym dodaniu", async () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test Driver" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        "Sterownik dodany! Odśwież stronę, aby zobaczyć zmiany."
      );
    });
  });

  test("zamyka modal po udanym dodaniu sterownika", async () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test Driver" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("wyświetla komunikat błędu przy nieudanym dodaniu", async () => {
    const errorMessage = "Błąd połączenia z API";
    addDriver.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test Driver" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("wywołuje showErrorToast przy błędzie", async () => {
    const errorMessage = "API Error";
    addDriver.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test Driver" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledWith(
        "Błąd dodawania sterownika: " + errorMessage
      );
    });
  });

  test("wyświetla domyślny komunikat błędu gdy brak message", async () => {
    addDriver.mockRejectedValueOnce(new Error());

    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Błąd dodawania sterownika")).toBeInTheDocument();
    });
  });

  test("wywołuje showErrorToast z domyślną wiadomością gdy brak error.message", async () => {
    addDriver.mockRejectedValueOnce(new Error());

    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledWith(
        "Błąd dodawania sterownika: "
      );
    });
  });

  test("pokazuje stan ładowania podczas wysyłania", async () => {
    addDriver.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("button-Dodawanie...")).toBeInTheDocument();
    });
  });

  test("przyciski są wyłączone podczas ładowania", async () => {
    addDriver.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-cloudConnectorId"), {
      target: { value: "connector-123" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByTestId("input-port"), {
      target: { value: "8080" },
    });
    fireEvent.change(screen.getByTestId("input-defaultCostLimit"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByTestId("input-cronExpression"), {
      target: { value: "0 0 * * *" },
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const loadingButton = screen.getByTestId("button-Dodawanie...");
      const cancelButton = screen.getByTestId("button-Anuluj");
      const closeButton = screen.getByTestId("x-icon").closest("button");

      expect(loadingButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(closeButton).toBeDisabled();
    });
  });

  test("wszystkie pola są wymagane", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-cloudConnectorId")).toBeRequired();
    expect(screen.getByTestId("input-name")).toBeRequired();
    expect(screen.getByTestId("input-host")).toBeRequired();
    expect(screen.getByTestId("input-port")).toBeRequired();
    expect(screen.getByTestId("input-defaultCostLimit")).toBeRequired();
    expect(screen.getByTestId("input-cronExpression")).toBeRequired();
  });

  test("pola mają poprawne typy", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-cloudConnectorId")).toHaveAttribute(
      "type",
      "text"
    );
    expect(screen.getByTestId("input-name")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("input-host")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("input-port")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("input-defaultCostLimit")).toHaveAttribute(
      "type",
      "text"
    );
    expect(screen.getByTestId("input-cronExpression")).toHaveAttribute(
      "type",
      "text"
    );
  });

  test("resetuje formularz po zamknięciu", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByTestId("input-cloudConnectorId");
    fireEvent.change(input, { target: { value: "connector-123" } });

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(formResetMock).toHaveBeenCalled();
  });

  test("nie wywołuje API gdy pola są puste (ale walidacja HTML blokuje submit)", async () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByTestId("button-Dodaj sterownik");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addDriver).not.toHaveBeenCalled();
    });
  });

  test("ma poprawne klasy CSS dla dialog", () => {
    const { container } = render(
      <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toHaveClass("rounded-2xl");
    expect(dialog).toHaveClass("shadow-xl");
    expect(dialog).toHaveClass("w-full");
    expect(dialog).toHaveClass("max-w-lg");
    expect(dialog).toHaveClass("p-0");
    expect(dialog).toHaveClass("m-auto");
  });

  test("formularz ma method='dialog'", () => {
    const { container } = render(
      <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("method", "dialog");
  });

  test("grid ma 2 kolumny", () => {
    const { container } = render(
      <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const grid = container.querySelector(".grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  test("ma odpowiednie aria atrybuty", () => {
    render(<AddDriverModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByLabelText("ID sterownika w chmurze*")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa*")).toBeInTheDocument();
    expect(screen.getByLabelText("Host sterownika*")).toBeInTheDocument();
    expect(screen.getByLabelText("Port sterownika*")).toBeInTheDocument();
    expect(screen.getByLabelText("Limit kosztów*")).toBeInTheDocument();
    expect(screen.getByLabelText("Czyszczenie CRON*")).toBeInTheDocument();
  });

  test("renderuje bez błędów gdy setIsOpen nie jest przekazany", () => {
    expect(() => {
      render(<AddDriverModal isOpen={true} />, { wrapper: createWrapper() });
    }).not.toThrow();
  });

  test("czyści błędy formularza po zamknięciu", () => {
    addDriver.mockRejectedValueOnce(new Error("Test error"));

    const { rerender } = render(
      <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByTestId("button-Dodaj sterownik"));

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddDriverModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });
});
