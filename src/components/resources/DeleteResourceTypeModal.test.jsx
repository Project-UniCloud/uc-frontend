import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteResourceTypeModal from "./DeleteResourceTypeModal";
import { deleteResourceType } from "@/lib/api/resourceApi";

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

jest.mock("react-icons/fa", () => ({
  FaRegTrashAlt: () => <span data-testid="trash-icon">Trash</span>,
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
      data-testid={children === "Anuluj" ? "cancel-button" : "delete-button"}
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
  deleteResourceType: jest.fn(),
}));

global.showSuccessToast = jest.fn();
global.showErrorToast = jest.fn();

describe("DeleteResourceTypeModal", () => {
  let queryClient;
  const mockSetIsOpen = jest.fn();
  const mockSetSelectedResourceTypeId = jest.fn();

  const defaultProps = {
    isOpen: true,
    setIsOpen: mockSetIsOpen,
    resourceTypeId: "resource-type-123",
    setSelectedResourceTypeId: mockSetSelectedResourceTypeId,
    cloudConnectorId: "connector-456",
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
        <DeleteResourceTypeModal {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  test("renderuje nagłówek modalu", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: "Usuń typ zasobu", hidden: true })
    ).toBeInTheDocument();
  });

  test("renderuje pytanie potwierdzające", () => {
    renderComponent();

    expect(
      screen.getByText(/czy jesteś pewny, że chcesz usunąć ten typ zasobu/i)
    ).toBeInTheDocument();
  });

  test("wywołuje showModal gdy isOpen=true", () => {
    renderComponent();

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = renderComponent();

    rerender(
      <QueryClientProvider client={queryClient}>
        <DeleteResourceTypeModal {...defaultProps} isOpen={false} />
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

  test("resetuje selectedResourceTypeId po zamknięciu", async () => {
    const user = userEvent.setup();
    renderComponent();

    const cancelButton = screen.getByTestId("cancel-button");
    await user.click(cancelButton);

    expect(mockSetSelectedResourceTypeId).toHaveBeenCalledWith(null);
  });

  test("wywołuje mutację z poprawnymi danymi po kliknięciu Usuń", async () => {
    const user = userEvent.setup();
    deleteResourceType.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(deleteResourceType).toHaveBeenCalledWith({
        cloudConnectorId: "connector-456",
        resourceType: "resource-type-123",
      });
    });
  });

  test("zamyka modal po pomyślnym usunięciu", async () => {
    const user = userEvent.setup();
    deleteResourceType.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("resetuje selectedResourceTypeId po pomyślnym usunięciu", async () => {
    const user = userEvent.setup();
    deleteResourceType.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockSetSelectedResourceTypeId).toHaveBeenCalledWith(null);
    });
  });

  test("wyświetla komunikat błędu w UI gdy mutacja się nie powiedzie", async () => {
    const user = userEvent.setup();
    deleteResourceType.mockRejectedValue(new Error("Delete failed"));

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Delete failed/i)).toBeInTheDocument();
    });
  });

  test("resetuje selectedResourceTypeId po błędzie", async () => {
    const user = userEvent.setup();
    deleteResourceType.mockRejectedValue(new Error("Delete failed"));

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockSetSelectedResourceTypeId).toHaveBeenCalledWith(null);
    });
  });

  test("wyłącza przycisk Anuluj gdy isPending=true", async () => {
    const user = userEvent.setup();
    deleteResourceType.mockReturnValue(new Promise(() => {}));

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      const cancelButton = screen.getByTestId("cancel-button");
      expect(cancelButton).toBeDisabled();
    });
  });

  test("renderuje ikonę X", () => {
    renderComponent();

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  test("renderuje ikonę kosza", () => {
    renderComponent();

    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
  });

  test("renderuje dwa przyciski", () => {
    renderComponent();

    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  test("przycisk Usuń ma typ submit", () => {
    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toHaveAttribute("type", "submit");
  });

  test("przycisk Anuluj ma typ button", () => {
    renderComponent();

    const cancelButton = screen.getByTestId("cancel-button");
    expect(cancelButton).toHaveAttribute("type", "button");
  });
});
