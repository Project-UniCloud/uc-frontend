import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddResourceTypeModal from "./AddResourceTypeModal";
import { addResourceType } from "@/lib/api/resourceApi";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

jest.mock("../utils/InputForm", () => ({
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
      />
    </div>
  ),
}));

jest.mock("../utils/Buttons", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    className,
    color,
    textColor,
  }) => (
    <button
      data-testid={children === "Anuluj" ? "cancel-button" : "submit-button"}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/lib/api/resourceApi", () => ({
  addResourceType: jest.fn(),
}));

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("AddResourceTypeModal", () => {
  let queryClient;
  const mockSetIsOpen = jest.fn();

  const defaultProps = {
    isOpen: true,
    setIsOpen: mockSetIsOpen,
    cloudConnectorId: "connector-123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    HTMLDialogElement.prototype.showModal = jest.fn(function () {
      this.setAttribute("open", "");
      this.style.display = "block";
    });
    HTMLDialogElement.prototype.close = jest.fn(function () {
      this.removeAttribute("open");
      this.style.display = "none";
    });
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddResourceTypeModal {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  test("renderuje nagłówek modalu", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: "Dodaj typ zasobu" })
    ).toBeInTheDocument();
  });

  test("renderuje pole input z labelą", () => {
    renderComponent();

    expect(screen.getByLabelText(/nazwa typu zasobu/i)).toBeInTheDocument();
  });

  test("wywołuje showModal gdy isOpen=true", () => {
    renderComponent();

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = renderComponent();

    rerender(
      <QueryClientProvider client={queryClient}>
        <AddResourceTypeModal {...defaultProps} isOpen={false} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test("zamyka modal po kliknięciu ikony X", async () => {
    const user = userEvent.setup();
    renderComponent();

    const closeButton = screen.getByTestId("x-icon").closest("button");
    await user.click(closeButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("zamyka modal po kliknięciu przycisku Anuluj", async () => {
    const user = userEvent.setup();
    renderComponent();

    const cancelButton = screen.getByTestId("cancel-button");
    await user.click(cancelButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("wywołuje mutację z poprawnymi danymi po submicie", async () => {
    const user = userEvent.setup();
    addResourceType.mockResolvedValue({});

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "New Resource Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(addResourceType).toHaveBeenCalledWith({
        cloudConnectorId: "connector-123",
        resourceType: "New Resource Type",
      });
    });
  });

  test("zamyka modal po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addResourceType.mockResolvedValue({});

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("wyświetla toast sukcesu po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addResourceType.mockResolvedValue({});

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith(
        "Typ zasobu dodany! Odśwież stronę, aby zobaczyć zmiany."
      );
    });
  });

  test("wyświetla toast błędu gdy mutacja się nie powiedzie", async () => {
    const user = userEvent.setup();
    addResourceType.mockRejectedValue(new Error("API Error"));

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        "Błąd dodawania typu zasobu: API Error"
      );
    });
  });

  test("wyświetla komunikat błędu w UI gdy mutacja się nie powiedzie", async () => {
    const user = userEvent.setup();
    addResourceType.mockRejectedValue(new Error("API Error"));

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });

  test("wyświetla tekst ładowania gdy isPending=true", async () => {
    const user = userEvent.setup();
    addResourceType.mockReturnValue(new Promise(() => {}));

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Dodawanie...")).toBeInTheDocument();
    });
  });

  test("wyłącza wszystkie przyciski gdy isPending=true", async () => {
    const user = userEvent.setup();
    addResourceType.mockReturnValue(new Promise(() => {}));

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      const buttons = screen.getAllByRole("button", { hidden: true });
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  test("nie zamyka modalu po kliknięciu X gdy isPending=true", async () => {
    const user = userEvent.setup();
    addResourceType.mockReturnValue(new Promise(() => {}));

    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    await user.type(nameInput, "Test Type");

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Dodawanie...")).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId("x-icon").closest("button");
    expect(closeButton).toBeDisabled();
  });

  test("renderuje ikonę X", () => {
    renderComponent();

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  test("renderuje dwa przyciski", () => {
    renderComponent();

    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  test("przycisk submit ma typ submit", () => {
    renderComponent();

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("przycisk Anuluj ma typ button", () => {
    renderComponent();

    const cancelButton = screen.getByTestId("cancel-button");
    expect(cancelButton).toHaveAttribute("type", "button");
  });

  test("pole input jest wymagane", () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/nazwa typu zasobu/i);
    expect(nameInput).toBeRequired();
  });
});
