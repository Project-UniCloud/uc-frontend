import { render, screen, fireEvent } from "@testing-library/react";
import { AddResourceConfirmModal } from "./AddResourceConfirmModal";

jest.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

jest.mock("react-icons/fa", () => ({
  FaPlus: () => <span data-testid="plus-icon">+</span>,
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
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${color || ""} ${textColor || ""} ${className || ""}`}
    >
      {children}
    </button>
  ),
}));

describe("AddResourceConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    setIsOpen: jest.fn(),
    groupName: "Grupa A",
    onConfirm: jest.fn(),
    selectedDriver: "Azure Driver",
    selectedResource: "Virtual Machine",
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  test("renderuje nagłówek i opis modalu", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    expect(screen.getByText("Potwierdź dodanie dostępu")).toBeInTheDocument();
    expect(
      screen.getByText(/Wiąże się to z przyznaniem dostępu/i)
    ).toBeInTheDocument();
  });

  test("wyświetla dane sterownika, usługi i grupy", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    expect(screen.getByText("Sterownik:")).toBeInTheDocument();
    expect(screen.getByText("Azure Driver")).toBeInTheDocument();

    expect(screen.getByText("Usługa:")).toBeInTheDocument();
    expect(screen.getByText("Virtual Machine")).toBeInTheDocument();

    expect(screen.getByText("Grupa:")).toBeInTheDocument();
    expect(screen.getByText("Grupa A")).toBeInTheDocument();
  });

  test("wywołuje showModal gdy isOpen=true", () => {
    render(<AddResourceConfirmModal {...defaultProps} isOpen={true} />);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = render(
      <AddResourceConfirmModal {...defaultProps} isOpen={true} />
    );

    rerender(<AddResourceConfirmModal {...defaultProps} isOpen={false} />);

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test("zamyka modal po kliknięciu ikony X", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
  });

  test("zamyka modal po kliknięciu przycisku Anuluj", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByText("Anuluj");
    fireEvent.click(cancelButton);

    expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
  });

  test("wywołuje onConfirm po kliknięciu przycisku Dodaj", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByText("Dodaj");
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  test("wyświetla stan ładowania gdy isPending=true", () => {
    render(<AddResourceConfirmModal {...defaultProps} isPending={true} />);

    expect(screen.getByText("Dodawanie...")).toBeInTheDocument();
    expect(screen.queryByText("Dodaj")).not.toBeInTheDocument();
  });

  test("wyświetla ikonę plus gdy nie isPending", () => {
    render(<AddResourceConfirmModal {...defaultProps} isPending={false} />);

    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  test("nie wyświetla ikony plus gdy isPending", () => {
    render(<AddResourceConfirmModal {...defaultProps} isPending={true} />);

    expect(screen.queryByTestId("plus-icon")).not.toBeInTheDocument();
  });

  test("wyłącza wszystkie przyciski gdy isPending=true", () => {
    render(<AddResourceConfirmModal {...defaultProps} isPending={true} />);

    const buttons = screen.getAllByRole("button", { hidden: true });
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test("nie zamyka modalu po kliknięciu X gdy isPending=true", () => {
    const setIsOpen = jest.fn();
    render(
      <AddResourceConfirmModal
        {...defaultProps}
        isPending={true}
        setIsOpen={setIsOpen}
      />
    );

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(setIsOpen).not.toHaveBeenCalled();
  });

  test("nie zamyka modalu po kliknięciu Anuluj gdy isPending=true", () => {
    const setIsOpen = jest.fn();
    render(
      <AddResourceConfirmModal
        {...defaultProps}
        isPending={true}
        setIsOpen={setIsOpen}
      />
    );

    const cancelButton = screen.getByText("Anuluj");
    fireEvent.click(cancelButton);

    expect(setIsOpen).not.toHaveBeenCalled();
  });

  test("renderuje ikonę X", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  test("przycisk Dodaj ma typ submit", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByText("Dodaj");
    expect(confirmButton).toHaveAttribute("type", "submit");
  });

  test("przycisk Anuluj ma typ button", () => {
    render(<AddResourceConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByText("Anuluj");
    expect(cancelButton).toHaveAttribute("type", "button");
  });

  test("renderuje poprawnie z różnymi nazwami", () => {
    render(
      <AddResourceConfirmModal
        {...defaultProps}
        groupName="Testowa Grupa"
        selectedDriver="AWS Driver"
        selectedResource="S3 Bucket"
      />
    );

    expect(screen.getByText("Testowa Grupa")).toBeInTheDocument();
    expect(screen.getByText("AWS Driver")).toBeInTheDocument();
    expect(screen.getByText("S3 Bucket")).toBeInTheDocument();
  });
});
