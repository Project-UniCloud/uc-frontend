import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ButtonChangeStatus from "./ButtonChangeStatus";
import { archiveGroup, activateGroup } from "@/lib/groupsApi";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/groupsApi");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
  __esModule: true,
}));

jest.mock("../utils/Buttons", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    label,
    hint,
    color,
    center,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid={`button-${label}`}
      title={hint}
    >
      {children}
    </button>
  ),
}));

jest.mock("react-icons/ci", () => ({
  CiPause1: () => <span data-testid="pause-icon">PauseIcon</span>,
}));

jest.mock("react-icons/io5", () => ({
  IoPlayCircleOutline: () => <span data-testid="play-icon">PlayIcon</span>,
}));

jest.mock("react-icons/fi", () => ({
  FiArchive: () => <span data-testid="archive-icon">ArchiveIcon</span>,
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

describe("ButtonChangeStatus", () => {
  let mockPush;
  let mockShowSuccessToast;
  let mockShowErrorToast;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    archiveGroup.mockResolvedValue({ success: true });
    activateGroup.mockResolvedValue({ success: true });

    const Toast = require("../utils/Toast");
    mockShowSuccessToast = Toast.showSuccessToast;
    mockShowErrorToast = Toast.showErrorToast;

    mockShowSuccessToast.mockClear();
    mockShowErrorToast.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Aktywna group", () => {
    test("renderuje przycisk Archiwizuj dla grupy Aktywnej", () => {
      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("button-Archiwizuj")).toBeInTheDocument();
      expect(screen.getByText("Archiwizuj")).toBeInTheDocument();
    });

    test("renderuje ikonę archiwu dla grupy Aktywnej", () => {
      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("archive-icon")).toBeInTheDocument();
    });

    test("wywołuje archiveGroup API po kliknięciu przycisku Archiwizuj", async () => {
      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(archiveGroup).toHaveBeenCalledWith("123");
      });
    });

    test("wyświetla stan ładowania podczas archiwizacji", async () => {
      archiveGroup.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
      });
    });

    test("wyłącza przycisk podczas archiwizacji", async () => {
      archiveGroup.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(archiveButton).toBeDisabled();
      });
    });

    test("pokazuje toast sukcesu po archiwizacji", async () => {
      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(mockShowSuccessToast).toHaveBeenCalledWith(
          "Grupa została zarchiwizowana! Jest w zakładce 'Zarchiwizowane'."
        );
      });
    });

    test("redirectuje do /groups po archiwizacji", async () => {
      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/groups");
      });
    });

    test("obsługuje błąd archiwizacji", async () => {
      const errorMessage = "Błąd połączenia";
      archiveGroup.mockRejectedValueOnce(new Error(errorMessage));

      render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
        wrapper: createWrapper(),
      });

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(archiveGroup).toHaveBeenCalledWith("123");
      });
    });

    test("ma hint dla przycisku Archiwizuj", () => {
      render(
        <ButtonChangeStatus
          groupId="123"
          groupStatus="Aktywna"
          hint="Archiwizuj tę grupę"
        />,
        { wrapper: createWrapper() }
      );

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      expect(archiveButton).toHaveAttribute("title", "Archiwizuj tę grupę");
    });
  });

  describe("Nieaktywna group", () => {
    test("renderuje przycisk Aktywuj dla grupy Nieaktywnej", () => {
      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("button-Aktywuj")).toBeInTheDocument();
      expect(screen.getByText("Aktywuj")).toBeInTheDocument();
    });

    test("renderuje ikonę pauzy dla grupy Nieaktywnej", () => {
      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId("pause-icon")).toBeInTheDocument();
    });

    test("wywołuje activateGroup API po kliknięciu przycisku Aktywuj", async () => {
      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      const activateButton = screen.getByTestId("button-Aktywuj");
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(activateGroup).toHaveBeenCalledWith("456");
      });
    });

    test("wyświetla stan ładowania podczas aktywacji", async () => {
      activateGroup.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      const activateButton = screen.getByTestId("button-Aktywuj");
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
      });
    });

    test("wyłącza przycisk podczas aktywacji", async () => {
      activateGroup.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      const activateButton = screen.getByTestId("button-Aktywuj");
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(activateButton).toBeDisabled();
      });
    });

    test("pokazuje toast sukcesu po aktywacji", async () => {
      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      const activateButton = screen.getByTestId("button-Aktywuj");
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockShowSuccessToast).toHaveBeenCalledWith(
          "Grupa została aktywowana! Jest w zakładce 'Aktywne'."
        );
      });
    });

    test("redirectuje do /groups po aktywacji", async () => {
      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      const activateButton = screen.getByTestId("button-Aktywuj");
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/groups");
      });
    });

    test("obsługuje błąd aktywacji", async () => {
      const errorMessage = "Błąd serwera";
      activateGroup.mockRejectedValueOnce(new Error(errorMessage));

      render(<ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />, {
        wrapper: createWrapper(),
      });

      const activateButton = screen.getByTestId("button-Aktywuj");
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(activateGroup).toHaveBeenCalledWith("456");
      });
    });

    test("ma hint dla przycisku Aktywuj", () => {
      render(
        <ButtonChangeStatus
          groupId="456"
          groupStatus="Nieaktywna"
          hint="Aktywuj tę grupę"
        />,
        { wrapper: createWrapper() }
      );

      const activateButton = screen.getByTestId("button-Aktywuj");
      expect(activateButton).toHaveAttribute("title", "Aktywuj tę grupę");
    });
  });

  describe("Zarchiwizowana group", () => {
    test("renderuje przycisk Usuń dla grupy Zarchiwizowanej", () => {
      render(
        <ButtonChangeStatus groupId="789" groupStatus="Zarchiwizowana" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId("button-Usuń")).toBeInTheDocument();
      expect(screen.getByText("Usuń")).toBeInTheDocument();
    });

    test("renderuje ikonę play dla grupy Zarchiwizowanej", () => {
      render(
        <ButtonChangeStatus groupId="789" groupStatus="Zarchiwizowana" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId("play-icon")).toBeInTheDocument();
    });

    test("przycisk Usuń jest wyłączony dla grupy Zarchiwizowanej", () => {
      render(
        <ButtonChangeStatus groupId="789" groupStatus="Zarchiwizowana" />,
        { wrapper: createWrapper() }
      );

      const deleteButton = screen.getByTestId("button-Usuń");
      expect(deleteButton).toBeDisabled();
    });

    test("nie wywołuje API dla grupy Zarchiwizowanej", () => {
      render(
        <ButtonChangeStatus groupId="789" groupStatus="Zarchiwizowana" />,
        { wrapper: createWrapper() }
      );

      expect(archiveGroup).not.toHaveBeenCalled();
      expect(activateGroup).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    test("renderuje bez błędów bez hint prop", () => {
      expect(() => {
        render(<ButtonChangeStatus groupId="123" groupStatus="Aktywna" />, {
          wrapper: createWrapper(),
        });
      }).not.toThrow();
    });

    test("obsługuje różne groupId", async () => {
      const { rerender } = render(
        <ButtonChangeStatus groupId="id-1" groupStatus="Aktywna" />,
        { wrapper: createWrapper() }
      );

      const archiveButton = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(archiveGroup).toHaveBeenCalledWith("id-1");
      });

      archiveGroup.mockClear();

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ButtonChangeStatus groupId="id-2" groupStatus="Aktywna" />
        </QueryClientProvider>
      );

      const archiveButton2 = screen.getByTestId("button-Archiwizuj");
      fireEvent.click(archiveButton2);

      await waitFor(() => {
        expect(archiveGroup).toHaveBeenCalledWith("id-2");
      });
    });

    test("renderuje przyciski z odpowiednimi kolorami dla różnych statusów", () => {
      const { rerender, container: container1 } = render(
        <ButtonChangeStatus groupId="123" groupStatus="Aktywna" />,
        { wrapper: createWrapper() }
      );

      let button = container1.querySelector("button");
      expect(button).toBeInTheDocument();
      expect(button?.textContent).toContain("Archiwizuj");

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ButtonChangeStatus groupId="456" groupStatus="Nieaktywna" />
        </QueryClientProvider>
      );

      button = container1.querySelector("button");
      expect(button?.textContent).toContain("Aktywuj");

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ButtonChangeStatus groupId="789" groupStatus="Zarchiwizowana" />
        </QueryClientProvider>
      );

      button = container1.querySelector("button");
      expect(button?.textContent).toContain("Usuń");
    });
  });
});
