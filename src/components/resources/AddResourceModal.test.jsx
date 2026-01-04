import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddResourceModal } from "./AddResourceModal";
import { giveCloudResourceAccess } from "@/lib/api/resourceApi";
import { getCloudAccesses, getCloudResourcesTypes } from "@/lib/api/cloudApi";
import { showSuccessToast, showErrorToast } from "../utils/Toast";

const originalLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
});

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

jest.mock("../utils/Buttons", () => ({
  Button: ({ children, onClick, disabled, type, className }) => (
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
  giveCloudResourceAccess: jest.fn(),
}));

jest.mock("@/lib/api/cloudApi", () => ({
  getCloudAccesses: jest.fn(),
  getCloudResourcesTypes: jest.fn(),
}));

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

jest.mock("./AddResourceConfirmModal", () => ({
  AddResourceConfirmModal: ({
    isOpen,
    setIsOpen,
    groupName,
    onConfirm,
    selectedDriver,
    selectedResource,
    isPending,
  }) => (
    <div data-testid="confirm-modal">
      {isOpen && (
        <div>
          <span data-testid="confirm-modal-open">Open</span>
          <span data-testid="confirm-group">{groupName}</span>
          <span data-testid="confirm-driver">{selectedDriver}</span>
          <span data-testid="confirm-resource">{selectedResource}</span>
          <span data-testid="confirm-pending">{String(isPending)}</span>
          <button onClick={onConfirm} data-testid="confirm-button">
            Confirm
          </button>
          <button onClick={() => setIsOpen(false)} data-testid="close-confirm">
            Close
          </button>
        </div>
      )}
    </div>
  ),
}));

describe("AddResourceModal", () => {
  let queryClient;
  const mockFetch = jest.fn();
  const mockSetIsOpen = jest.fn();

  const defaultProps = {
    isOpen: true,
    setIsOpen: mockSetIsOpen,
    groupName: "Test Group",
    groupId: "group-123",
    fetch: mockFetch,
  };

  const mockDriversData = {
    content: [
      { cloudConnectorId: "driver-1" },
      { cloudConnectorId: "driver-2" },
    ],
  };

  const mockResourcesData = {
    content: [{ name: "Resource A" }, { name: "Resource B" }],
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

    getCloudAccesses.mockResolvedValue(mockDriversData);
    getCloudResourcesTypes.mockResolvedValue(mockResourcesData);
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddResourceModal {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  const getDriverSelect = () => screen.getByLabelText(/sterownik/i);
  const getResourceSelect = () => screen.getByLabelText(/usługa/i);

  test("renderuje nagłówek i pobiera sterowniki", async () => {
    renderComponent();
    expect(screen.getByText("Dodaj dostęp")).toBeInTheDocument();
    await screen.findByText("driver-1");
    expect(getCloudAccesses).toHaveBeenCalledWith("group-123");
  });

  test("zamyka modal po kliknięciu ikony X", async () => {
    const user = userEvent.setup();
    renderComponent();
    await screen.findByText("driver-1");

    const closeButton = screen.getByTestId("x-icon").closest("button");
    await user.click(closeButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("zamyka modal po kliknięciu przycisku Anuluj", async () => {
    const user = userEvent.setup();
    renderComponent();
    await screen.findByText("driver-1");

    const cancelButton = screen.getByTestId("cancel-button");
    await user.click(cancelButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("select usługi jest wyłączony gdy nie wybrano sterownika", async () => {
    renderComponent();
    await screen.findByText("driver-1");

    expect(getResourceSelect()).toBeDisabled();
  });

  test("pobiera usługi po wybraniu sterownika", async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText("driver-1");
    await user.selectOptions(getDriverSelect(), "driver-1");

    await waitFor(() => {
      expect(getCloudResourcesTypes).toHaveBeenCalledWith("driver-1");
    });
  });

  test("wyświetla listę usług po wybraniu sterownika", async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText("driver-1");
    await user.selectOptions(getDriverSelect(), "driver-1");

    expect(await screen.findByText("Resource A")).toBeInTheDocument();
    expect(screen.getByText("Resource B")).toBeInTheDocument();
  });

  test("przycisk Dodaj jest aktywny gdy wybrano komplet danych", async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText("driver-1");
    await user.selectOptions(getDriverSelect(), "driver-1");

    await screen.findByText("Resource A");
    await user.selectOptions(getResourceSelect(), "Resource A");

    expect(screen.getByTestId("submit-button")).not.toBeDisabled();
  });

  test("wywołuje pełny proces sukcesu", async () => {
    const user = userEvent.setup();
    giveCloudResourceAccess.mockResolvedValue({});
    renderComponent();

    await screen.findByText("driver-1");
    await user.selectOptions(getDriverSelect(), "driver-1");

    await screen.findByText("Resource A");
    await user.selectOptions(getResourceSelect(), "Resource A");

    await user.click(screen.getByTestId("submit-button"));
    await user.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(giveCloudResourceAccess).toHaveBeenCalled();
      expect(showSuccessToast).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalled();
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("wyświetla błąd gdy mutacja zawiedzie", async () => {
    const user = userEvent.setup();
    giveCloudResourceAccess.mockRejectedValue(new Error("Network error"));
    renderComponent();

    await screen.findByText("driver-1");
    await user.selectOptions(getDriverSelect(), "driver-1");
    await screen.findByText("Resource A");
    await user.selectOptions(getResourceSelect(), "Resource A");

    await user.click(screen.getByTestId("submit-button"));
    await user.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        expect.stringContaining("Network error")
      );
    });
  });

  test("resetuje wybór usługi po zmianie sterownika", async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText("driver-1");
    await user.selectOptions(getDriverSelect(), "driver-1");
    await screen.findByText("Resource A");
    await user.selectOptions(getResourceSelect(), "Resource A");

    await user.selectOptions(getDriverSelect(), "driver-2");

    await waitFor(() => {
      expect(getResourceSelect().value).toBe("");
    });
  });

  test("select sterownika jest wyłączony gdy trwa ładowanie", async () => {
    getCloudAccesses.mockReturnValue(new Promise(() => {}));
    renderComponent();

    expect(getDriverSelect()).toBeDisabled();

    getCloudAccesses.mockResolvedValue(mockDriversData);
  });
});
