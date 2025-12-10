import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import AddGroupModal from "./AddGroupModal";
import { addGroup } from "@/lib/groupsApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/groupsApi");

jest.mock("@/lib/utils/formatDate", () => ({
  formatDateToDDMMYYYY: jest.fn((date) => {
    if (!date) return date;
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }),
}));

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
      "aria-label": ariaLabel,
    }) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          required={required}
          data-testid={`input-${name}`}
          aria-label={ariaLabel || label}
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
  }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid={`button-${
        children?.toString().replace(/\s+/g, "-") || "default"
      }`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
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
    }) => (
      <div data-testid="teacher-search-input" aria-label={ariaLabel}>
        <button
          type="button"
          onClick={() =>
            onSelect({
              id: "lecturer-1",
              name: "John Doe",
            })
          }
          data-testid="add-lecturer-btn"
          disabled={disabled}
          aria-label="Dodaj prowadzącego"
        >
          Add Lecturer
        </button>
        <button
          type="button"
          onClick={() =>
            onSelect({
              id: "lecturer-2",
              name: "Jane Smith",
            })
          }
          data-testid="add-lecturer-2-btn"
          aria-label="Dodaj drugiego prowadzącego"
        >
          Add Lecturer 2
        </button>
        {value.map((lecturer) => (
          <div key={lecturer.id} data-testid={`lecturer-${lecturer.id}`}>
            {lecturer.name}
            <button
              type="button"
              onClick={() => onRemove(lecturer.id)}
              data-testid={`remove-lecturer-${lecturer.id}`}
              aria-label={`Usuń prowadzącego ${lecturer.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    ),
  };
});

jest.mock("@/hooks/useLecturerSearch", () => ({
  useLecturerSearch: jest.fn(() => ({
    lecturers: [],
    isLoading: false,
    searchLecturers: jest.fn(),
    clearSearch: jest.fn(),
  })),
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

describe("AddGroupModal", () => {
  let setIsOpen;
  let formResetMock;
  let mockShowSuccessToast;
  let mockShowErrorToast;
  let mockFormatDateToDDMMYYYY;

  beforeEach(() => {
    setIsOpen = jest.fn();
    addGroup.mockResolvedValue({ success: true });

    const Toast = require("../utils/Toast");
    mockShowSuccessToast = Toast.showSuccessToast;
    mockShowErrorToast = Toast.showErrorToast;

    const FormatDate = require("@/lib/utils/formatDate");
    mockFormatDateToDDMMYYYY = FormatDate.formatDateToDDMMYYYY;

    mockShowSuccessToast.mockClear();
    mockShowErrorToast.mockClear();
    mockFormatDateToDDMMYYYY.mockClear();

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
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      {
        wrapper: createWrapper(),
      }
    );

    const heading = container.querySelector("h2");
    expect(heading).toHaveTextContent("Dodaj grupę");
  });

  test("wywołuje showModal gdy isOpen zmienia się na true", () => {
    const { rerender } = render(
      <AddGroupModal isOpen={false} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("wywołuje close gdy isOpen zmienia się na false", () => {
    const { rerender } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddGroupModal isOpen={false} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test("renderuje wszystkie wymagane pola formularza", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-groupName")).toBeInTheDocument();
    expect(screen.getByTestId("input-semesterYear")).toBeInTheDocument();
    expect(screen.getByTestId("input-startDate")).toBeInTheDocument();
    expect(screen.getByTestId("input-endDate")).toBeInTheDocument();
  });

  test("renderuje select dla typu semestru", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const semesterTypeSelect = screen.getByDisplayValue("Z");
    expect(semesterTypeSelect).toBeInTheDocument();
  });

  test("renderuje textarea dla opisu", () => {
    const { container } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const textarea = container.querySelector("textarea[name='description']");
    expect(textarea).toBeInTheDocument();
  });

  test("renderuje TeacherSearchInput", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("teacher-search-input")).toBeInTheDocument();
  });

  test("renderuje przyciski Anuluj i Zatwierdź", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("button-Anuluj")).toBeInTheDocument();
    expect(screen.getByTestId("button-Zatwierdź")).toBeInTheDocument();
  });

  test("renderuje ikonę X do zamykania", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  test("zamyka modal po kliknięciu przycisku Anuluj", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByTestId("button-Anuluj");
    fireEvent.click(cancelButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(formResetMock).toHaveBeenCalled();
  });

  test("zamyka modal po kliknięciu ikony X", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(formResetMock).toHaveBeenCalled();
  });

  test("wywołuje addGroup API z poprawnymi danymi po submit", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFormatDateToDDMMYYYY).toHaveBeenCalledWith("2024-01-01");
      expect(mockFormatDateToDDMMYYYY).toHaveBeenCalledWith("2024-06-30");
      expect(addGroup).toHaveBeenCalledWith({
        name: "Test Group",
        semester: "2024Z",
        lecturers: [],
        startDate: "01.01.2024",
        endDate: "30.06.2024",
        description: "",
      });
    });
  });

  test("dodaje prowadzących do danych grupy", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addGroup).toHaveBeenCalledWith({
        name: "Test Group",
        semester: "2024Z",
        lecturers: ["lecturer-1"],
        startDate: "01.01.2024",
        endDate: "30.06.2024",
        description: "",
      });
    });
  });

  test("dodaje opis do danych grupy gdy jest podany", async () => {
    const { container } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const textarea = container.querySelector("textarea[name='description']");
    fireEvent.change(textarea, {
      target: { value: "Test description" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addGroup).toHaveBeenCalledWith({
        name: "Test Group",
        semester: "2024Z",
        lecturers: [],
        startDate: "01.01.2024",
        endDate: "30.06.2024",
        description: "Test description",
      });
    });
  });

  test("łączy semesterYear i semesterType w semester", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2023" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "L" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          semester: "2023L",
        })
      );
    });
  });

  test("wywołuje showSuccessToast po udanym dodaniu", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        "Grupa dodana! Znajduje się w zakładce 'Nieaktywne"
      );
    });
  });

  test("zamyka modal po udanym dodaniu grupy", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  test("ustawia formErrors i wywołuje showErrorToast przy błędzie", async () => {
    const errorMessage = "Błąd połączenia z API";
    addGroup.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockShowErrorToast).toHaveBeenCalledWith("Błąd dodawania grupy");
    });
  });

  test("wyświetla domyślny komunikat błędu gdy brak message", async () => {
    addGroup.mockRejectedValueOnce(new Error());

    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Błąd dodawania grupy")).toBeInTheDocument();
    });
  });

  test("pokazuje stan ładowania podczas wysyłania", async () => {
    addGroup.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("button-Wysyłanie...")).toBeInTheDocument();
    });
  });

  test("przyciski są wyłączone podczas ładowania", async () => {
    addGroup.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const loadingButton = screen.getByTestId("button-Wysyłanie...");
      const cancelButton = screen.getByTestId("button-Anuluj");
      const closeButton = screen.getByTestId("x-icon").closest("button");

      expect(loadingButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(closeButton).toBeDisabled();
    });
  });

  test("wszystkie pola są wymagane", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-groupName")).toBeRequired();
    expect(screen.getByTestId("input-semesterYear")).toBeRequired();
    expect(screen.getByTestId("input-startDate")).toBeRequired();
    expect(screen.getByTestId("input-endDate")).toBeRequired();
  });

  test("pola mają poprawne typy", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("input-groupName")).toHaveAttribute(
      "type",
      "text"
    );
    expect(screen.getByTestId("input-semesterYear")).toHaveAttribute(
      "type",
      "text"
    );
    expect(screen.getByTestId("input-startDate")).toHaveAttribute(
      "type",
      "date"
    );
    expect(screen.getByTestId("input-endDate")).toHaveAttribute("type", "date");
  });

  test("resetuje formularz po zamknięciu", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByTestId("input-groupName");
    fireEvent.change(input, { target: { value: "Test Group" } });

    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(formResetMock).toHaveBeenCalled();
  });

  test("czyści błędy i prowadzących po zamknięciu", () => {
    const { rerender } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    // Dodaj prowadzącego
    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    expect(screen.getByTestId("lecturer-lecturer-1")).toBeInTheDocument();

    // Zamknij
    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    // Otwórz ponownie
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    // Sprawdź czy prowadzący i błędy są wyczyszczone
    expect(screen.queryByTestId("lecturer-lecturer-1")).not.toBeInTheDocument();
  });

  test("nie wywołuje API gdy pola są puste (walidacja HTML blokuje submit)", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addGroup).not.toHaveBeenCalled();
    });
  });

  test("ma poprawne klasy CSS dla dialog", () => {
    const { container } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toHaveClass("rounded-2xl");
    expect(dialog).toHaveClass("shadow-xl");
    expect(dialog).toHaveClass("w-full");
    expect(dialog).toHaveClass("max-w-lg");
    expect(dialog).toHaveClass("p-0");
    expect(dialog).toHaveClass("m-auto");
  });

  test("formularz ma method='dialog'", () => {
    const { container } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("method", "dialog");
  });

  test("ma odpowiednie aria atrybuty dla wszystkich pól", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText("Nazwa grupy*")).toBeInTheDocument();
    expect(screen.getByTestId("input-semesterYear")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Z")).toBeInTheDocument();
    expect(screen.getByLabelText("Data rozpoczęcia*")).toBeInTheDocument();
    expect(screen.getByLabelText("Data zakończenia*")).toBeInTheDocument();
  });

  test("dodaje i usuwa prowadzących z listy", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByTestId("add-lecturer-btn"));
    expect(screen.getByTestId("lecturer-lecturer-1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("remove-lecturer-lecturer-1"));
    expect(screen.queryByTestId("lecturer-lecturer-1")).not.toBeInTheDocument();
  });

  test("nie dodaje duplikatów prowadzących", () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
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
      render(<AddGroupModal isOpen={true} />, { wrapper: createWrapper() });
    }).not.toThrow();
  });

  test("czyści błędy formularza po zamknięciu", () => {
    addGroup.mockRejectedValueOnce(new Error("Test error"));

    const { rerender } = render(
      <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />,
      { wrapper: createWrapper() }
    );

    // Wywołaj błąd
    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    fireEvent.click(screen.getByTestId("button-Zatwierdź"));

    // Zamknij
    const closeButton = screen.getByTestId("x-icon").closest("button");
    fireEvent.click(closeButton);

    // Otwórz ponownie
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <AddGroupModal isOpen={true} setIsOpen={setIsOpen} />
      </QueryClientProvider>
    );

    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });

  test("formatuje daty przed wysłaniem", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "2024-01-15" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-12-31" },
    });

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFormatDateToDDMMYYYY).toHaveBeenCalledWith("2024-01-15");
      expect(mockFormatDateToDDMMYYYY).toHaveBeenCalledWith("2024-12-31");
      expect(addGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: "15.01.2024",
          endDate: "31.12.2024",
        })
      );
    });
  });

  test("wymagane są wszystkie pola daty", async () => {
    render(<AddGroupModal isOpen={true} setIsOpen={setIsOpen} />, {
      wrapper: createWrapper(),
    });

    fireEvent.change(screen.getByTestId("input-groupName"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByTestId("input-semesterYear"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByDisplayValue("Z"), {
      target: { value: "Z" },
    });
    fireEvent.change(screen.getByTestId("input-startDate"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("input-endDate"), {
      target: { value: "2024-06-30" },
    });

    expect(screen.getByTestId("input-startDate")).toHaveAttribute("required");
    expect(screen.getByTestId("input-endDate")).toHaveAttribute("required");

    const submitButton = screen.getByTestId("button-Zatwierdź");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addGroup).not.toHaveBeenCalled();
    });
  });
});
