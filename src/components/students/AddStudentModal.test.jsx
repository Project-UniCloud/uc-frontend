import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddStudentModal } from "./AddStudentModal";
import { addStudentToGroup } from "@/lib/api/studentApi";

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

jest.mock("../utils/InputForm", () => {
  return function InputForm({ name, label, type = "text", placeholder }) {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required
        />
      </div>
    );
  };
});

jest.mock("../utils/Buttons", () => ({
  Button: ({ children, onClick, disabled, type, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/lib/api/studentApi", () => ({
  addStudentToGroup: jest.fn(),
}));

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

import { showSuccessToast, showErrorToast } from "../utils/Toast";

describe("AddStudentModal", () => {
  let queryClient;
  const mockSetIsOpen = jest.fn();
  const mockFetch = jest.fn();

  const defaultProps = {
    isOpen: true,
    setIsOpen: mockSetIsOpen,
    groupId: "group-123",
    fetch: mockFetch,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddStudentModal {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  test("renderuje nagłówek modalu", () => {
    renderComponent();

    const heading = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "H2");
    expect(heading).toBeInTheDocument();
  });

  test("renderuje pola formularza", () => {
    renderComponent();

    expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nazwisko/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/indeks/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mail/i)).toBeInTheDocument();
  });

  test("wywołuje showModal gdy isOpen=true", () => {
    renderComponent();

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = renderComponent();

    rerender(
      <QueryClientProvider client={queryClient}>
        <AddStudentModal {...defaultProps} isOpen={false} />
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

    const cancelButton = screen.getByText("Anuluj");
    await user.click(cancelButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("wysyła dane studenta przy poprawnej walidacji", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockResolvedValue({});

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(addStudentToGroup).toHaveBeenCalledWith("group-123", {
        login: "s123456",
        firstName: "Jakub",
        lastName: "Kowalski",
        email: "jakub@example.com",
      });
    });
  });

  test("wywołuje fetch po pomyślnym dodaniu studenta", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockResolvedValue({});

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  test("zamyka modal po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockResolvedValue({});

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("wyświetla toast sukcesu po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockResolvedValue({});

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith(
        "Student został dodany do grupy!"
      );
    });
  });

  test("wyświetla komunikat błędu gdy mutacja się nie powiedzie", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockRejectedValue(new Error("Add failed"));

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Add failed/i)).toBeInTheDocument();
    });
  });

  test("wyświetla toast błędu gdy mutacja się nie powiedzie", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockRejectedValue(new Error("Add failed"));

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        expect.stringContaining("Add failed")
      );
    });
  });

  test("wyłącza przycisk submit gdy isPending=true", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockReturnValue(new Promise(() => {}));

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  test("zmienia tekst przycisku na Wysyłanie... gdy isPending=true", async () => {
    const user = userEvent.setup();
    addStudentToGroup.mockReturnValue(new Promise(() => {}));

    renderComponent();

    await user.type(screen.getByLabelText(/imię/i), "Jakub");
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski");
    await user.type(screen.getByLabelText(/indeks/i), "s123456");
    await user.type(screen.getByLabelText(/mail/i), "jakub@example.com");

    const submitButton = screen
      .getAllByText("Dodaj studenta")
      .find((el) => el.tagName === "BUTTON");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/wysyłanie/i)).toBeInTheDocument();
    });
  });

  test("renderuje ikonę X", () => {
    renderComponent();

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });
});
