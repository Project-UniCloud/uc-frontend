import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import AddLecturerModal from "./AddLecturerModal";
import { addLecturer } from "@/lib/lecturersApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/lecturersApi");

jest.mock("../utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
  __esModule: true,
}));

jest.mock("../utils/InputForm", () => {
  return {
    __esModule: true,
    default: ({
      name,
      placeholder,
      label,
      type,
      required,
      value,
      onChange,
      "data-testid": testId,
    }) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          required={required}
          value={value || ""}
          onChange={onChange}
          data-testid={testId || `input-${name}`}
          aria-label={label}
        />
      </div>
    ),
  };
});

jest.mock("../utils/Buttons", () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    className,
    color,
    textColor,
    "aria-label": ariaLabel,
  }) => {
    let buttonText = "default";
    if (typeof children === "string") {
      buttonText = children;
    } else if (Array.isArray(children)) {
      buttonText = children
        .filter((c) => typeof c === "string")
        .join("")
        .trim();
    }
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-testid={`button-${buttonText.replace(/\s+/g, "-")}`}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/utils/TeacherSearchInput", () => {
  return {
    __esModule: true,
    default: ({
      onSelect,
      onRemove,
      value,
      disabled,
      "aria-label": ariaLabel,
    }) => {
      const isDisabled = disabled || value.length >= 1;
      return (
        <div data-testid="teacher-search-input" aria-label={ariaLabel}>
          <button
            type="button"
            onClick={() =>
              onSelect({
                id: "lecturer-1",
                firstName: "John",
                lastName: "Doe",
                login: "s123456",
                email: "john@example.com",
              })
            }
            data-testid="add-lecturer-btn"
            disabled={isDisabled}
            aria-label="Dodaj prowadzącego z wyszukiwarki"
          >
            Add Lecturer
          </button>
          <button
            type="button"
            onClick={() =>
              onSelect({
                id: "lecturer-2",
                firstName: "Jane",
                lastName: "Smith",
                login: "s654321",
                email: "jane@example.com",
              })
            }
            data-testid="add-lecturer-2-btn"
            disabled={isDisabled}
            aria-label="Dodaj drugiego prowadzącego"
          >
            Add Lecturer 2
          </button>
          {value.map((lecturer) => (
            <div key={lecturer.id} data-testid={`lecturer-${lecturer.id}`}>
              {lecturer.firstName} {lecturer.lastName}
              <button
                type="button"
                onClick={() => onRemove(lecturer.id)}
                data-testid={`remove-lecturer-${lecturer.id}`}
                aria-label={`Usuń prowadzącego ${lecturer.firstName} ${lecturer.lastName}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    },
  };
});

jest.mock("@/hooks/useLecturerExternalSearch", () => ({
  useLecturerExternalSearch: jest.fn(() => ({
    lecturers: [],
    isLoading: false,
    searchLecturers: jest.fn(),
    clearSearch: jest.fn(),
  })),
}));

jest.mock("react-icons/fa", () => ({
  FaCheck: () => (
    <span data-testid="check-icon" aria-hidden="true">
      ✓
    </span>
  ),
}));

jest.mock("lucide-react", () => ({
  X: () => (
    <span data-testid="x-icon" aria-hidden="true">
      X
    </span>
  ),
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

describe("AddLecturerModal", () => {
  let setIsOpen;
  let formResetMock;
  let mockShowSuccessToast;
  let mockShowErrorToast;

  beforeEach(() => {
    setIsOpen = jest.fn();
    addLecturer.mockResolvedValue({ success: true });

    const Toast = require("../utils/Toast");
    mockShowSuccessToast = Toast.showSuccessToast;
    mockShowErrorToast = Toast.showErrorToast;

    mockShowSuccessToast.mockClear();
    mockShowErrorToast.mockClear();

    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();

    formResetMock = jest.fn();
    HTMLFormElement.prototype.reset = formResetMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
    delete HTMLFormElement.prototype.reset;
  });

  test("renderuje modal gdy isOpen=true", () => {
    const { container } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const heading = container.querySelector("h2");
    expect(heading).toHaveTextContent("Dodaj prowadzącego");
  });

  test("wywołuje showModal gdy isOpen zmienia się na true", () => {
    const { rerender } = render(
      <AddLecturerModal isOpen={false} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddLecturerModal isOpen={false} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test("renderuje pole email", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
  });

  test("renderuje TeacherSearchInput", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("teacher-search-input")).toBeInTheDocument();
  });

  test("renderuje przyciski Anuluj i Dodaj prowadzącego", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("button-Anuluj")).toBeInTheDocument();
    expect(screen.getByTestId("button-Dodaj-prowadzącego")).toBeInTheDocument();
  });

  test("renderuje ikony X i check", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  test("zamyka modal po kliknięciu przycisku Anuluj", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByTestId("button-Anuluj");
    fireEvent.click(cancelButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("zamyka modal po kliknięciu ikony X", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("wywołuje addLecturer API z poprawnymi danymi po submit", async () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    // Wybierz prowadzącego i uzupełnij email
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addLecturer).toHaveBeenCalledWith({
        userIndexNumber: "s123456",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
    });
  });

  test("wypełnia pole email po wyborze prowadzącego", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));

    expect(screen.getByTestId("lecturer-lecturer-1")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toHaveValue("john@example.com");
  });

  test("wyłącza TeacherSearchInput gdy wybrany jest prowadzący", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const addBtn = screen.getByTestId("add-lecturer-btn");
    expect(addBtn).not.toBeDisabled();

    fireEvent.click(addBtn);

    // Po dodaniu prowadzącego, przycisk powinien być disabled
    expect(addBtn).toBeDisabled();

    // Drugi przycisk też powinien być disabled
    const addBtn2 = screen.getByTestId("add-lecturer-2-btn");
    expect(addBtn2).toBeDisabled();
  });

  test("umożliwia ponowne dodanie po usunięciu prowadzącego", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    // Dodaj prowadzącego
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    expect(screen.getByTestId("add-lecturer-btn")).toBeDisabled();

    // Usuń prowadzącego
    fireEvent.click(screen.getByTestId("remove-lecturer-lecturer-1"));

    // Przycisk powinien być znów dostępny
    expect(screen.getByTestId("add-lecturer-btn")).not.toBeDisabled();
  });

  test("resetuje email po usunięciu prowadzącego", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    expect(screen.getByTestId("input-email")).toHaveValue("john@example.com");

    fireEvent.click(screen.getByTestId("remove-lecturer-lecturer-1"));
    expect(screen.getByTestId("input-email")).toHaveValue("");
  });

  test("wywołuje showSuccessToast po udanym dodaniu", async () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        "Prowadzący został dodany!"
      );
    });
  });

  test("zamyka modal po udanym dodaniu", async () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("resetuje formularz po udanym dodaniu", async () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(formResetMock).toHaveBeenCalled();
    });
  });

  test("wyświetla komunikat błędu przy nieudanym dodaniu", async () => {
    const errorMessage = "Błąd połączenia z API";
    addLecturer.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("wywołuje showErrorToast przy błędzie z message", async () => {
    const errorMessage = "Test error";
    addLecturer.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledWith(
        `Błąd dodawania prowadzącego: ${errorMessage}`
      );
    });
  });

  test("wywołuje showErrorToast przy błędzie bez message", async () => {
    addLecturer.mockRejectedValueOnce(new Error());

    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalled();
      const calls = mockShowErrorToast.mock.calls;
      expect(calls[0][0]).toMatch(/Błąd dodawania prowadzącego/);
    });
  });

  test("pokazuje stan ładowania podczas wysyłania", async () => {
    addLecturer.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("button-Dodawanie...")).toBeInTheDocument();
    });
  });

  test("przyciski są wyłączone podczas ładowania", async () => {
    addLecturer.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const loadingButton = screen.getByTestId("button-Dodawanie...");
      const cancelButton = screen.getByTestId("button-Anuluj");

      expect(loadingButton).toBeDisabled();
      expect(cancelButton).toHaveClass("opacity-50");
      expect(cancelButton).toHaveClass("cursor-not-allowed");
    });
  });

  test("wszystkie wymagane pola mają atrybut required", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-email")).toHaveAttribute("required");
  });

  test("pole email ma typ email", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-email")).toHaveAttribute("type", "email");
  });

  test("aktualizuje formValues przy zmianie inputu", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const emailInput = screen.getByTestId("input-email");
    fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
    expect(emailInput).toHaveValue("jane@example.com");
  });

  test("nie wywołuje API gdy wymagane pole email jest puste", async () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addLecturer).not.toHaveBeenCalled();
    });
  });

  test("ma poprawne klasy CSS dla dialog", () => {
    const { container } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toHaveClass("rounded-2xl");
    expect(dialog).toHaveClass("shadow-xl");
    expect(dialog).toHaveClass("w-full");
    expect(dialog).toHaveClass("max-w-xl");
    expect(dialog).toHaveClass("p-0");
    expect(dialog).toHaveClass("m-auto");
    expect(dialog).toHaveClass("overflow-visible");
  });

  test("ma grid layout z dwoma kolumnami", () => {
    const { container } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const gridDiv = container.querySelector(".grid.grid-cols-2.gap-4");
    expect(gridDiv).toBeInTheDocument();
  });

  test("formularz ma method='dialog'", () => {
    const { container } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("method", "dialog");
  });

  test("form ma overflow-visible", () => {
    const { container } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const form = container.querySelector("form");
    expect(form).toHaveClass("overflow-visible");
  });

  test("ma odpowiednie aria atrybuty dla wszystkich pól", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
  });

  test("dodaje i usuwa prowadzących z listy", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    expect(screen.getByTestId("lecturer-lecturer-1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("remove-lecturer-lecturer-1"));
    expect(screen.queryByTestId("lecturer-lecturer-1")).not.toBeInTheDocument();
  });

  test("nie dodaje duplikatów prowadzących", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    // Dodaj tego samego prowadzącego 2x
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));

    // Powinien być tylko jeden
    expect(screen.getAllByTestId(/^lecturer-/)).toHaveLength(1);
  });

  test("renderuje bez błędów gdy setIsOpen nie jest przekazany", () => {
    expect(() => {
      render(<AddLecturerModal isOpen={true} />, { wrapper: createWrapper() });
    }).not.toThrow();
  });

  test("czyści błędy formularza po zamknięciu", () => {
    addLecturer.mockRejectedValueOnce(new Error("Test error"));

    const { rerender } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@example.com" },
    });

    fireEvent.click(screen.getByTestId("button-Dodaj-prowadzącego"));

    // Zamknij
    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    // Otwórz ponownie
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });

  test("czyści stan prowadzących i formValues po zamknięciu", () => {
    const { rerender } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    // Dodaj prowadzącego
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    expect(screen.getByTestId("lecturer-lecturer-1")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "custom@example.com" },
    });

    // Zamknij
    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    // Otwórz ponownie
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(screen.queryByTestId("lecturer-lecturer-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toHaveValue("");
  });

  test("używa danych z formValues lub FormData (priorytet dla formValues)", async () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "formvalues@example.com" },
    });

    const submitButton = screen.getByTestId("button-Dodaj-prowadzącego");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addLecturer).toHaveBeenCalledWith({
        userIndexNumber: "s123456",
        firstName: "John",
        lastName: "Doe",
        email: "formvalues@example.com",
      });
    });
  });

  test("preferuje dane z wybranego prowadzącego nad ręcznie wprowadzone", () => {
    render(<AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "manual@example.com" },
    });

    // Potem wybierz prowadzącego
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));

    // Email z prowadzącego nadpisuje ręczny
    expect(screen.getByTestId("input-email")).toHaveValue("john@example.com");
  });

  test("matches snapshot when open", () => {
    const { container } = render(
      <AddLecturerModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );
    expect(container).toMatchSnapshot();
  });
});
