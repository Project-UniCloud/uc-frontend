import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteStudentModal from "./DeleteStudentModal";
import * as studentApi from "@/lib/api/studentApi";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

jest.mock("@/lib/api/studentApi");
jest.mock("next/navigation");
jest.mock("@tanstack/react-query");
jest.mock("../utils/Toast");
jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));
jest.mock("react-icons/fa", () => ({
  FaTrash: () => <span data-testid="trash-icon">Trash</span>,
}));

const mockPush = jest.fn();
const mockShowSuccessToast = jest.fn();
const mockShowErrorToast = jest.fn();

jest.mock("../utils/Buttons", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    color,
    textColor,
    center,
    className,
    type,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      type={type}
    >
      {children}
    </button>
  ),
}));

jest.mock("../utils/Toast", () => ({
  showSuccessToast: (...args) => mockShowSuccessToast(...args),
  showErrorToast: (...args) => mockShowErrorToast(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  useRouter.mockReturnValue({
    push: mockPush,
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

describe("DeleteStudentModal", () => {
  const defaultProps = {
    isOpen: true,
    setIsOpen: jest.fn(),
    studentId: "student-123",
    groupId: "group-456",
    studentName: "Jan Kowalski",
    groupName: "Grupa A",
  };

  it("renderuje modal gdy isOpen=true", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    const headings = screen.getAllByText(
      "Czy napewno chcesz usunąć studenta z grupy?"
    );
    expect(headings.length).toBeGreaterThan(0);
  });

  it("pokazuje dane studenta i grupy", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    expect(screen.getByText("Jan Kowalski")).toBeInTheDocument();
    expect(screen.getByText("Grupa A")).toBeInTheDocument();
  });

  it("nie renderuje dialogu gdy isOpen=false", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    const { rerender } = render(
      <DeleteStudentModal {...defaultProps} isOpen={true} />
    );

    rerender(<DeleteStudentModal {...defaultProps} isOpen={false} />);

    const heading = screen.queryByRole("heading", {
      name: "Czy napewno chcesz usunąć studenta z grupy?",
    });
    expect(heading).not.toBeInTheDocument();
  });

  it("renderuje przycisk X do zamknięcia", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("renderuje ikone kosza na przycisk usuwania", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
  });

  it("renderuje przycisk Anuluj", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    const cancelButtons = screen.getAllByText("Anuluj");
    expect(cancelButtons.length).toBeGreaterThan(0);
  });

  it("renderuje przycisk Usuń", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    expect(screen.getByText("Usuń")).toBeInTheDocument();
  });

  it("zamyka modal po klinięciu przycisku X", async () => {
    const user = userEvent.setup();
    const setIsOpen = jest.fn();
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(
      <DeleteStudentModal
        {...defaultProps}
        setIsOpen={setIsOpen}
        isOpen={true}
      />
    );

    const xButton = screen.getByTestId("x-icon").closest("button");
    await user.click(xButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("zamyka modal po klinięciu przycisku Anuluj", async () => {
    const user = userEvent.setup();
    const setIsOpen = jest.fn();
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(
      <DeleteStudentModal
        {...defaultProps}
        setIsOpen={setIsOpen}
        isOpen={true}
      />
    );

    const cancelButtons = screen.getAllByText("Anuluj");
    const cancelButton = cancelButtons.find((el) => el.tagName === "BUTTON");
    await user.click(cancelButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("nie zamyka modalu gdy trwa usuwanie", async () => {
    const user = userEvent.setup();
    const setIsOpen = jest.fn();
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(
      <DeleteStudentModal
        {...defaultProps}
        setIsOpen={setIsOpen}
        isOpen={true}
      />
    );

    const xButton = screen.getByTestId("x-icon").closest("button");
    await user.click(xButton);

    expect(setIsOpen).not.toHaveBeenCalled();
  });

  it("wywoła mutację usuwania przy klinięciu przycisku Usuń", async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    const deleteButtons = screen.getAllByText("Usuń");
    const deleteButton = deleteButtons.find(
      (el) => el.tagName === "BUTTON" && !el.textContent.includes("Usuwanie")
    );
    await user.click(deleteButton);

    expect(mockMutate).toHaveBeenCalled();
  });

  it("wywołuje deleteStudent z prawidłowymi parametrami", () => {
    useMutation.mockImplementation(({ mutationFn }) => {
      mutationFn();
      return {
        mutate: jest.fn(),
        isPending: false,
      };
    });

    studentApi.deleteStudent.mockResolvedValue({});

    render(<DeleteStudentModal {...defaultProps} />);

    expect(studentApi.deleteStudent).toHaveBeenCalledWith(
      "group-456",
      "student-123"
    );
  });

  it("pokazuje 'Usuwanie...' tekst gdy trwa mutacja", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    expect(screen.getByText("Usuwanie...")).toBeInTheDocument();
  });

  it("wyłącza wszystkie przyciski gdy trwa usuwanie", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      if (button.getAttribute("data-testid") !== "x-icon") {
        expect(button).toBeDisabled();
      }
    });
  });

  it("pokazuje success toast po usunięciu studenta", () => {
    let onSuccessCallback;

    useMutation.mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return {
        mutate: jest.fn(),
        isPending: false,
      };
    });

    render(<DeleteStudentModal {...defaultProps} />);

    onSuccessCallback();

    expect(mockShowSuccessToast).toHaveBeenCalledWith(
      "Student został usunięty!"
    );
  });

  it("redirectuje do listy studentów po usunięciu", () => {
    let onSuccessCallback;

    useMutation.mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return {
        mutate: jest.fn(),
        isPending: false,
      };
    });

    render(<DeleteStudentModal {...defaultProps} />);

    onSuccessCallback();

    expect(mockPush).toHaveBeenCalledWith("/groups/group-456/students");
  });

  it("pokazuje error toast gdy usuwanie się nie powiedzie", () => {
    let onErrorCallback;

    useMutation.mockImplementation(({ onError }) => {
      onErrorCallback = onError;
      return {
        mutate: jest.fn(),
        isPending: false,
      };
    });

    render(<DeleteStudentModal {...defaultProps} />);

    const error = new Error("Network error");
    onErrorCallback(error);

    expect(mockShowErrorToast).toHaveBeenCalledWith(
      "Błąd usuwania studenta: Network error"
    );
  });

  it("obsługuje błąd bez message", () => {
    let onErrorCallback;

    useMutation.mockImplementation(({ onError }) => {
      onErrorCallback = onError;
      return {
        mutate: jest.fn(),
        isPending: false,
      };
    });

    render(<DeleteStudentModal {...defaultProps} />);

    const error = {};
    onErrorCallback(error);

    expect(mockShowErrorToast).toHaveBeenCalledWith(
      "Błąd usuwania studenta: undefined"
    );
  });

  it("używa useRouter dla nawigacji", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<DeleteStudentModal {...defaultProps} />);

    expect(useRouter).toHaveBeenCalled();
  });
});
