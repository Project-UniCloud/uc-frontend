import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ImportStudentsModal } from "./ImportStudentsModal";
import { addStudentsToGroup } from "@/lib/api/studentApi";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

jest.mock("../utils/Buttons", () => ({
  Button: ({ children, onClick, disabled, type, className }) => (
    <button
      data-testid={
        children === "Anuluj"
          ? "cancel-button"
          : children === "Wysyłanie..."
          ? "sending-button"
          : "submit-button"
      }
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock("../utils/DragDrop", () => {
  return function MockDragDrop({ onDropFile }) {
    return (
      <div data-testid="drag-drop-component">
        <input
          data-testid="file-input"
          type="file"
          onChange={(e) => onDropFile(e.target.files[0])}
          accept=".csv"
        />
      </div>
    );
  };
});

jest.mock("@/lib/api/studentApi", () => ({
  addStudentsToGroup: jest.fn(),
}));

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("ImportStudentsModal", () => {
  let queryClient;
  const mockFetch = jest.fn();
  const mockSetIsOpen = jest.fn();

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
        <ImportStudentsModal {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  test("renderuje nagłówek Dodaj plik CSV", () => {
    renderComponent();
    expect(screen.getByText("Dodaj plik CSV")).toBeInTheDocument();
  });

  test("renderuje komponent DragDrop", () => {
    renderComponent();
    expect(screen.getByTestId("drag-drop-component")).toBeInTheDocument();
  });

  test("wyświetla przycisk X", () => {
    renderComponent();
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
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

  test("przycisk dodaj studentów jest wyłączony gdy nie wybrano pliku", () => {
    renderComponent();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  test("przycisk dodaj studentów jest aktywny gdy wybrano plik", async () => {
    const user = userEvent.setup();
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });

    await user.upload(fileInput, file);

    expect(screen.getByTestId("submit-button")).not.toBeDisabled();
  });

  test("wyłącza przycisk Anuluj podczas wysyłania", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockImplementation(() => new Promise(() => {}));

    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("cancel-button")).toBeDisabled();
    });
  });

  test("wyświetla tekst Wysyłanie... podczas wysyłania", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockImplementation(() => new Promise(() => {}));

    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("sending-button")).toBeInTheDocument();
    });
  });

  test("wyłącza przycisk submit podczas wysyłania", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockImplementation(() => new Promise(() => {}));

    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  test("wysyła plik z prawidłowymi parametrami", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockResolvedValue({});
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(addStudentsToGroup).toHaveBeenCalledWith("group-123", file);
    });
  });

  test("wyświetla toast sukcesu po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockResolvedValue({});
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith(
        "Studenci zostali dodani do grupy!"
      );
    });
  });

  test("zamyka modal po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockResolvedValue({});
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("odświeża dane po pomyślnym dodaniu", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockResolvedValue({});
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  test("wyświetla toast błędu gdy mutacja zawiedzie", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockRejectedValue(new Error("Network error"));
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        expect.stringContaining("Network error")
      );
    });
  });

  test("wyświetla wiadomość błędu w UI", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockRejectedValue(new Error("Validation failed"));
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Validation failed")).toBeInTheDocument();
    });
  });

  test("wyświetla domyślną wiadomość błędu gdy error nie ma message", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockRejectedValue(new Error());
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        "Błąd dodawania studentów do grupy: "
      );
    });
  });

  test("nie zamyka modalu gdy mutacja zawiedzie", async () => {
    const user = userEvent.setup();
    addStudentsToGroup.mockRejectedValue(new Error("Error"));
    renderComponent();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["content"], "students.csv", { type: "text/csv" });
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });
  });

  test("nie pokazuje modalu gdy isOpen=false", () => {
    const { container } = renderComponent({ isOpen: false });
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toHaveAttribute("open");
  });

  test("pokazuje modal gdy isOpen=true", async () => {
    const { container } = renderComponent({ isOpen: true });
    const dialog = container.querySelector("dialog");

    await waitFor(() => {
      expect(dialog).toHaveAttribute("open");
    });
  });
});
