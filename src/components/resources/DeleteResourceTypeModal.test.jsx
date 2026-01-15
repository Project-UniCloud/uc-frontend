import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteResourceTypeModal from "./DeleteResourceTypeModal";
import { deleteResourcesGroupCloudAccess } from "@/lib/api/resourceApi";

import { showErrorToast, showSuccessToast } from "@/components/utils/Toast";

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
  deleteResourcesGroupCloudAccess: jest.fn(),
}));

jest.mock("@/components/utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("DeleteResourceTypeModal", () => {
  let queryClient;
  const mockSetIsOpen = jest.fn();
  const mockOnDeleted = jest.fn();

  const defaultProps = {
    isOpen: true,
    setIsOpen: mockSetIsOpen,
    groupId: "group-123",
    resourceId: "res-456",
    resourceGlobalId: "res-global-789",
    onDeleted: mockOnDeleted,
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
      screen.getByRole("heading", { name: "Usuń zasób", hidden: true })
    ).toBeInTheDocument();
  });

  test("renderuje pytanie potwierdzające", () => {
    renderComponent();

    expect(
      screen.getByText(/czy jesteś pewny, że chcesz usunąć ten zasób/i)
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

  test("czyści błąd po zamknięciu modalu", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockRejectedValueOnce(
      new Error("Delete failed")
    );

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Delete failed/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId("cancel-button");
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/Delete failed/i)).not.toBeInTheDocument();
    });
  });

  test("wywołuje mutację z poprawnymi danymi po kliknięciu Usuń", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(deleteResourcesGroupCloudAccess).toHaveBeenCalledWith(
        "group-123",
        "res-456",
        "res-global-789"
      );
    });
  });

  test("zamyka modal po pomyślnym usunięciu", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("wywołuje onDeleted po pomyślnym usunięciu", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDeleted).toHaveBeenCalled();
    });
  });

  test("wyświetla komunikat błędu w UI gdy mutacja się nie powiedzie", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockRejectedValue(
      new Error("Delete failed")
    );

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Delete failed/i)).toBeInTheDocument();
    });
  });

  test("wywołuje showErrorToast po błędzie", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockRejectedValue(
      new Error("Delete failed")
    );

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalled();
    });
  });

  test("wyłącza przycisk Anuluj gdy isPending=true", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockReturnValue(new Promise(() => {}));

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      const cancelButton = screen.getByTestId("cancel-button");
      expect(cancelButton).toBeDisabled();
    });
  });

  test("wywołuje showSuccessToast po pomyślnym usunięciu", async () => {
    const user = userEvent.setup();
    deleteResourcesGroupCloudAccess.mockResolvedValue({});

    renderComponent();

    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith("Zasób został usunięty.");
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
