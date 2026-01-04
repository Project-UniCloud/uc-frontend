import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeacherSearchInput from "./TeacherSearchInput";

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

jest.mock("react-icons/fa", () => ({
  FaRegTrashAlt: () => <span data-testid="trash-icon">Trash</span>,
}));

jest.mock("./Hint", () => {
  return function MockHint({ hint }) {
    return hint ? <span data-testid="hint">{hint}</span> : null;
  };
});

describe("TeacherSearchInput", () => {
  const mockOnSelect = jest.fn();
  const mockOnRemove = jest.fn();
  const mockUseLecturerSearch = jest.fn();

  const defaultProps = {
    value: [],
    onSelect: mockOnSelect,
    onRemove: mockOnRemove,
    useLecturerSearch: mockUseLecturerSearch,
  };

  const teachers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      login: "jdoe",
      email: "john@example.com",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      fullName: "Jane Smith",
      login: "jsmith",
      email: "jane@example.com",
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Wilson",
      fullName: "Bob Wilson",
      login: "bwilson",
      email: "bob@example.com",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLecturerSearch.mockReturnValue({
      results: [],
      loading: false,
    });
  });

  it("renderuje label domyślny", () => {
    render(<TeacherSearchInput {...defaultProps} />);
    expect(screen.getByText("Prowadzący*")).toBeInTheDocument();
  });

  it("renderuje custom label", () => {
    render(<TeacherSearchInput {...defaultProps} label="Teachers" />);
    expect(screen.getByText("Teachers")).toBeInTheDocument();
  });

  it("renderuje hint gdy podany", () => {
    render(<TeacherSearchInput {...defaultProps} hint="Help text" />);
    expect(screen.getByTestId("hint")).toBeInTheDocument();
  });

  it("wyświetla pierwsze 2 tagi", () => {
    render(<TeacherSearchInput {...defaultProps} value={teachers} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("pokazuje przycisk +X więcej gdy jest więcej niż 2", () => {
    render(<TeacherSearchInput {...defaultProps} value={teachers} />);
    expect(screen.getByText("+1 więcej")).toBeInTheDocument();
  });

  it("nie pokazuje przycisku więcej gdy jest 2 lub mniej", () => {
    render(
      <TeacherSearchInput {...defaultProps} value={teachers.slice(0, 2)} />
    );
    expect(screen.queryByText(/więcej/)).not.toBeInTheDocument();
  });

  it("otwiera modal po kliknięciu +X więcej", async () => {
    const user = userEvent.setup();
    render(<TeacherSearchInput {...defaultProps} value={teachers} />);

    await user.click(screen.getByText("+1 więcej"));
    expect(screen.getByText("Wszyscy prowadzący")).toBeInTheDocument();
  });

  it("wyświetla wszystkich w modalu", async () => {
    const user = userEvent.setup();
    render(<TeacherSearchInput {...defaultProps} value={teachers} />);

    await user.click(screen.getByText("+1 więcej"));
    expect(screen.getByText(/John Doe \(jdoe\)/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith \(jsmith\)/)).toBeInTheDocument();
    expect(screen.getByText(/Bob Wilson \(bwilson\)/)).toBeInTheDocument();
  });

  it("zamyka modal po kliknięciu X", async () => {
    const user = userEvent.setup();
    render(<TeacherSearchInput {...defaultProps} value={teachers} />);

    await user.click(screen.getByText("+1 więcej"));
    expect(screen.getByText("Wszyscy prowadzący")).toBeInTheDocument();

    const closeButtons = screen.getAllByTestId("x-icon");
    await user.click(closeButtons[closeButtons.length - 1].closest("button"));
    expect(screen.queryByText("Wszyscy prowadzący")).not.toBeInTheDocument();
  });

  it("wywołuje onRemove z tagu", async () => {
    const user = userEvent.setup();
    render(
      <TeacherSearchInput
        {...defaultProps}
        value={teachers}
        disabledOnlyList={false}
      />
    );

    const xButtons = screen.getAllByTestId("x-icon");
    await user.click(xButtons[0].closest("button"));
    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it("nie wywołuje onRemove gdy disabledOnlyList", async () => {
    const user = userEvent.setup();
    render(
      <TeacherSearchInput
        {...defaultProps}
        value={teachers}
        disabledOnlyList={true}
      />
    );

    const xButtons = screen.getAllByTestId("x-icon");
    const button = xButtons[0].closest("button");
    expect(button).toBeDisabled();
  });

  it("nie pokazuje input gdy disabled", () => {
    render(<TeacherSearchInput {...defaultProps} disabled={true} />);
    const input = screen.queryByPlaceholderText("Wyszukaj prowadzącego");
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it("pokazuje input gdy nie disabled", () => {
    render(<TeacherSearchInput {...defaultProps} disabled={false} />);
    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    expect(input).not.toBeDisabled();
  });

  it("aktualizuje query po wpisaniu", async () => {
    const user = userEvent.setup();
    render(<TeacherSearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    await user.type(input, "John");
    expect(input).toHaveValue("John");
  });

  it("wywołuje useLecturerSearch z query", async () => {
    const user = userEvent.setup();
    render(<TeacherSearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    await user.type(input, "John");

    await waitFor(() => {
      expect(mockUseLecturerSearch).toHaveBeenCalledWith("John");
    });
  });

  it("wyświetla wyniki wyszukiwania", async () => {
    const user = userEvent.setup();
    const searchResults = [
      {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        login: "jdoe",
        email: "john@test.com",
      },
    ];
    mockUseLecturerSearch.mockReturnValue({
      results: searchResults,
      loading: false,
    });

    render(<TeacherSearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    await user.type(input, "John");
    await user.click(input);

    expect(screen.getByText(/John Doe \(jdoe\)/)).toBeInTheDocument();
  });

  it("wywołuje onSelect po kliknięciu wyniku", async () => {
    const user = userEvent.setup();
    const searchResults = [
      {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        login: "jdoe",
        email: "john@test.com",
      },
    ];
    mockUseLecturerSearch.mockReturnValue({
      results: searchResults,
      loading: false,
    });

    render(<TeacherSearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    await user.type(input, "John");
    await user.click(input);

    const result = screen.getByText(/John Doe \(jdoe\)/);
    await user.pointer({ target: result, keys: "[MouseLeft>]" });

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        login: "jdoe",
        email: "john@test.com",
      });
    });
  });

  it("czyści query po wyborze", async () => {
    const user = userEvent.setup();
    const searchResults = [
      {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        login: "jdoe",
        email: "john@test.com",
      },
    ];
    mockUseLecturerSearch.mockReturnValue({
      results: searchResults,
      loading: false,
    });

    render(<TeacherSearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    await user.type(input, "John");
    await user.click(input);

    const result = screen.getByText(/John Doe \(jdoe\)/);
    await user.pointer({ target: result, keys: "[MouseLeft>]" });

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("pokazuje loading gdy loading=true", () => {
    mockUseLecturerSearch.mockReturnValue({
      results: [],
      loading: true,
    });

    render(<TeacherSearchInput {...defaultProps} disabled={false} />);
    expect(screen.getByText("Ładowanie…")).toBeInTheDocument();
  });

  it("nie pokazuje loading gdy loading=false", () => {
    mockUseLecturerSearch.mockReturnValue({
      results: [],
      loading: false,
    });

    render(<TeacherSearchInput {...defaultProps} disabled={false} />);
    expect(screen.queryByText("Ładowanie…")).not.toBeInTheDocument();
  });

  it("wywołuje onRemove z modalu", async () => {
    const user = userEvent.setup();
    render(
      <TeacherSearchInput {...defaultProps} value={teachers} disabled={false} />
    );

    await user.click(screen.getByText("+1 więcej"));
    const trashButton = screen
      .getAllByTestId("trash-icon")[0]
      .closest("button");
    await user.click(trashButton);

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it("zamyka modal gdy usunięto ostatni ukryty element", async () => {
    const user = userEvent.setup();
    render(
      <TeacherSearchInput {...defaultProps} value={teachers} disabled={false} />
    );

    await user.click(screen.getByText("+1 więcej"));
    const trashButton = screen
      .getAllByTestId("trash-icon")[2]
      .closest("button");
    await user.click(trashButton);

    await waitFor(() => {
      expect(screen.queryByText("Wszyscy prowadzący")).not.toBeInTheDocument();
    });
  });

  it("nie pokazuje trash w modalu gdy disabled", async () => {
    const user = userEvent.setup();
    render(
      <TeacherSearchInput {...defaultProps} value={teachers} disabled={true} />
    );

    await user.click(screen.getByText("+1 więcej"));
    expect(screen.queryByTestId("trash-icon")).not.toBeInTheDocument();
  });

  it("nie pokazuje wyników gdy input nie ma focus", async () => {
    const user = userEvent.setup();
    const searchResults = [
      {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        login: "jdoe",
        email: "john@test.com",
      },
    ];
    mockUseLecturerSearch.mockReturnValue({
      results: searchResults,
      loading: false,
    });

    render(<TeacherSearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByPlaceholderText("Wyszukaj prowadzącego");
    await user.type(input, "John");
    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText(/John Doe \(jdoe\)/)).not.toBeInTheDocument();
    });
  });
});
