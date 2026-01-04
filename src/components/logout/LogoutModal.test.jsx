import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LogoutModal } from "./LogoutModal";
import { logoutUser } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/api/authApi");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../utils/Buttons", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    type,
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

jest.mock("lucide-react", () => ({
  X: () => <span>X</span>,
}));

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("LogoutModal", () => {
  let mockPush, mockDispatch;

  beforeEach(() => {
    mockPush = jest.fn();
    mockDispatch = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    useDispatch.mockReturnValue(mockDispatch);
    logoutUser.mockResolvedValue({ success: true });

    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderuje modal i jego zawartość gdy isOpen=true", () => {
    renderWithProviders(<LogoutModal isOpen={true} setIsOpen={jest.fn()} />);

    expect(screen.getByText("Wylogowanie")).toBeInTheDocument();
    expect(screen.getByText(/czy chcesz się wylogować/i)).toBeInTheDocument();
    expect(screen.getByText("Anuluj")).toBeInTheDocument();
    expect(screen.getByText("Wyloguj")).toBeInTheDocument();
  });

  test("zarządza widocznością dialogu przez natywne API (showModal/close)", () => {
    const { rerender } = renderWithProviders(
      <LogoutModal isOpen={false} setIsOpen={jest.fn()} />
    );
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <LogoutModal isOpen={true} setIsOpen={jest.fn()} />
      </QueryClientProvider>
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("zamyka modal po kliknięciu 'Anuluj' lub ikony X", () => {
    const mockSetIsOpen = jest.fn();
    renderWithProviders(
      <LogoutModal isOpen={true} setIsOpen={mockSetIsOpen} />
    );

    fireEvent.click(screen.getByText("Anuluj"));
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);

    mockSetIsOpen.mockClear();

    const closeBtn = screen.getByText("X").closest("button");
    fireEvent.click(closeBtn);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("proces wylogowania: API -> Redux -> Redirect", async () => {
    const mockSetIsOpen = jest.fn();
    renderWithProviders(
      <LogoutModal isOpen={true} setIsOpen={mockSetIsOpen} />
    );

    fireEvent.click(screen.getByText("Wyloguj"));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("obsługuje stan ładowania podczas komunikacji z API", async () => {
    logoutUser.mockReturnValue(
      new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderWithProviders(<LogoutModal isOpen={true} setIsOpen={jest.fn()} />);

    fireEvent.click(screen.getByText("Wyloguj"));

    await waitFor(() => {
      expect(screen.getByText("Wylogowywanie...")).toBeInTheDocument();
    });

    const loadingBtn = screen.getByText("Wylogowywanie...");
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveClass("opacity-50");
  });

  test("wyświetla komunikat o błędzie, gdy API zawiedzie", async () => {
    logoutUser.mockRejectedValue(new Error("Serwer nie odpowiada"));

    renderWithProviders(<LogoutModal isOpen={true} setIsOpen={jest.fn()} />);

    fireEvent.click(screen.getByText("Wyloguj"));

    await waitFor(() => {
      expect(screen.getByText("Serwer nie odpowiada")).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("przyciski mają poprawne typy HTML", () => {
    renderWithProviders(<LogoutModal isOpen={true} setIsOpen={jest.fn()} />);

    expect(screen.getByText("Anuluj")).toHaveAttribute("type", "button");
    expect(screen.getByText("Wyloguj")).toHaveAttribute("type", "submit");
  });
});
