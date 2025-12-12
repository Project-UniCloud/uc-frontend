import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupPage from "./page";
import { getGroupById, updateGroup } from "@/lib/groupsApi";
import { getStudentsFromGroup } from "@/lib/studentApi";
import { getResourcesGroup } from "@/lib/resourceApi";
import React from "react";

const originalUse = React.use;
React.use = jest.fn((promise) => {
  if (promise instanceof Promise) {
    let status = "pending";
    let result;
    promise.then(
      (value) => {
        status = "fulfilled";
        result = value;
      },
      (error) => {
        status = "rejected";
        result = error;
      }
    );
    if (status === "fulfilled") return result;
    if (status === "rejected") throw result;
    throw promise;
  }
  return originalUse ? originalUse(promise) : promise;
});

jest.mock("@/lib/groupsApi");
jest.mock("@/lib/studentApi");
jest.mock("@/lib/resourceApi");

jest.mock("@/components/utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

jest.mock("@/hooks/useLecturerSearch", () => ({
  useLecturerSearch: jest.fn(() => ({
    searchTerm: "",
    setSearchTerm: jest.fn(),
    results: [],
    loading: false,
  })),
}));

jest.mock("@/components/utils/Tabs", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      {props.tabs.map((tab) => (
        <button key={tab.label} onClick={() => props.onTabChange(tab.label)}>
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@/components/utils/InputForm", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <label>{props.label}</label>
      <input
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        type={props.type || "text"}
      />
    </div>
  ),
}));

jest.mock("@/components/utils/TeacherSearchInput", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <label>{props.label}</label>
      <div data-testid="teacher-list">
        {props.value?.map((t) => (
          <div key={t.id} data-testid={`teacher-${t.id}`}>
            {t.fullName}
            <button onClick={() => props.onRemove(t.id)}>Usuń</button>
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock("@/components/views/DataTableView", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="table-view">
      {props.loading && <span>Ładowanie...</span>}
      {props.error && <span data-testid="error">{props.error}</span>}
      {!props.loading && !props.error && (
        <>
          <div data-testid="table-data">TABLE [{props.data.length} rows]</div>
          {props.data.length === 0 && props.emptyMessage && (
            <div>{props.emptyMessage}</div>
          )}
          <div data-testid="left-actions">{props.leftActions}</div>
        </>
      )}
    </div>
  ),
}));

jest.mock("@/components/utils/Buttons", () => ({
  Button: (props) => (
    <button
      data-testid={props["data-testid"] || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  ),
}));

jest.mock("@/components/students/AddStudentModal", () => ({
  AddStudentModal: (props) => (
    <div data-testid="add-student-modal">
      {props.isOpen ? "STUDENT MODAL OPEN" : "STUDENT MODAL CLOSED"}
      <span data-testid="modal-groupid">{props.groupId}</span>
    </div>
  ),
}));

jest.mock("@/components/students/ImportStudentsModal", () => ({
  ImportStudentsModal: (props) => (
    <div data-testid="import-students-modal">
      {props.isOpen ? "IMPORT MODAL OPEN" : "IMPORT MODAL CLOSED"}
      <span data-testid="modal-groupid">{props.groupId}</span>
    </div>
  ),
}));

jest.mock("@/components/resources/AddResourceModal", () => ({
  AddResourceModal: (props) => (
    <div data-testid="add-resource-modal">
      {props.isOpen ? "RESOURCE MODAL OPEN" : "RESOURCE MODAL CLOSED"}
      <span data-testid="modal-groupid">{props.groupId}</span>
    </div>
  ),
}));

jest.mock("@/components/resources/StopAllModal", () => ({
  StopAllModal: (props) => (
    <div data-testid="stop-all-modal">
      {props.isOpen ? "STOP ALL MODAL OPEN" : "STOP ALL MODAL CLOSED"}
    </div>
  ),
}));

jest.mock("@/components/group/ButtonChangeStatus", () => ({
  __esModule: true,
  default: (props) => (
    <button data-testid="change-status-btn">Zmień status</button>
  ),
}));

jest.mock("@/components/utils/Hint", () => ({
  __esModule: true,
  default: () => <span data-testid="hint">?</span>,
}));

jest.mock("react-icons/fa", () => ({
  FaPlus: () => <span>+</span>,
}));

jest.mock("react-icons/ci", () => ({
  CiPause1: () => <span>||</span>,
}));

jest.mock("@/lib/utils/formatDate", () => ({
  formatDateToYYYYMMDD: (date) => date,
  formatDateToDDMMYYYY: (date) => date,
}));

describe("GroupIdPage", () => {
  const mockParams = { groupId: "123" };

  beforeEach(() => {
    React.use.mockReturnValue({ groupId: "123" });

    getGroupById.mockResolvedValue({
      name: "Test Group",
      lecturerFullNames: [
        { userId: 1, firstName: "Jan", lastName: "Kowalski" },
      ],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "Test description",
      status: "Aktywna",
    });

    getStudentsFromGroup.mockResolvedValue({
      content: [
        {
          login: "student1",
          firstName: "Anna",
          lastName: "Nowak",
          email: "anna@test.pl",
        },
      ],
      page: { totalPages: 1 },
    });

    getResourcesGroup.mockResolvedValue([
      {
        id: 1,
        clientId: "res-1",
        name: "Resource 1",
        status: "Active",
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("ładuje dane grupy i wyświetla je w zakładce Ogólne", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalledWith("123");
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Group")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-12-31")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
  });

  test("wyświetla błąd gdy API zwraca błąd", async () => {
    getGroupById.mockRejectedValueOnce(new Error("Network error"));

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("pokazuje loading podczas ładowania danych", async () => {
    getGroupById.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                name: "Test",
                lecturerFullNames: [],
                startDate: "",
                endDate: "",
                description: "",
                status: "Aktywna",
              }),
            100
          )
        )
    );

    render(<GroupPage params={mockParams} />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Ładowanie...")).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test("zmienia zakładkę po kliknięciu", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalledWith({
        groupId: "123",
        page: 0,
        pageSize: 10,
      });
    });
  });

  test("przycisk Edytuj/Zapisz widoczny tylko w zakładce Ogólne", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = screen.getByText("Edytuj");
    expect(editBtn).toBeInTheDocument();

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(screen.queryByText("Edytuj")).not.toBeInTheDocument();
      expect(screen.queryByText("Zapisz")).not.toBeInTheDocument();
    });
  });

  test("przełącza tryb edycji po kliknięciu Edytuj", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = screen.getByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue("Test Group");
    expect(nameInput).not.toBeDisabled();
  });

  test("zapisuje zmiany po kliknięciu Zapisz", async () => {
    updateGroup.mockResolvedValue({
      name: "Updated Group",
      lecturers: [],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "Updated",
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue("Test Group");
    fireEvent.change(nameInput, { target: { value: "Updated Group" } });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateGroup).toHaveBeenCalledWith("123", {
        name: "Updated Group",
        lecturers: [1],
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        description: "Test description",
      });
    });
  });

  test("wyświetla prowadzących przypisanych do grupy", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    expect(screen.getByText("Jan Kowalski")).toBeInTheDocument();
  });

  test("wyświetla status grupy z odpowiednim kolorem", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const statusInput = screen.getByDisplayValue("Aktywna");
    expect(statusInput).toBeInTheDocument();
    expect(statusInput).toBeDisabled();
  });

  test("ładuje studentów po przejściu do zakładki Studenci", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalledWith({
        groupId: "123",
        page: 0,
        pageSize: 10,
      });
    });

    expect(screen.getByTestId("table-view")).toBeInTheDocument();
  });

  test("otwiera modal dodawania studenta", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalled();
    });

    const addStudentBtn = screen.getByText(/Dodaj Studenta/);
    fireEvent.click(addStudentBtn);

    expect(screen.getByText("STUDENT MODAL OPEN")).toBeInTheDocument();
  });

  test("otwiera modal importu studentów", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalled();
    });

    const importBtn = screen.getByText(/Importuj/);
    fireEvent.click(importBtn);

    expect(screen.getByText("IMPORT MODAL OPEN")).toBeInTheDocument();
  });

  test("ładuje usługi po przejściu do zakładki Usługi", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const uslugiBtn = screen.getByText("Usługi");
    fireEvent.click(uslugiBtn);

    await waitFor(() => {
      expect(getResourcesGroup).toHaveBeenCalledWith("123");
    });

    expect(screen.getByTestId("table-view")).toBeInTheDocument();
  });

  test("otwiera modal dodawania usługi", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const uslugiBtn = screen.getByText("Usługi");
    fireEvent.click(uslugiBtn);

    await waitFor(() => {
      expect(getResourcesGroup).toHaveBeenCalled();
    });

    const addResourceBtn = screen.getByText(/Dodaj usługę/);
    fireEvent.click(addResourceBtn);

    expect(screen.getByText("RESOURCE MODAL OPEN")).toBeInTheDocument();
  });

  test("resetuje paginację przy zmianie zakładki", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalledWith({
        groupId: "123",
        page: 0,
        pageSize: 10,
      });
    });

    const uslugiBtn = screen.getByText("Usługi");
    fireEvent.click(uslugiBtn);

    await waitFor(() => {
      expect(getResourcesGroup).toHaveBeenCalledWith("123");
    });

    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenLastCalledWith({
        groupId: "123",
        page: 0,
        pageSize: 10,
      });
    });
  });

  test("wyłącza tryb edycji przy zmianie zakładki", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = screen.getByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalled();
    });

    const ogolneBtn = screen.getByText("Ogólne");
    fireEvent.click(ogolneBtn);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    expect(screen.getByText("Edytuj")).toBeInTheDocument();
  });

  test("wyświetla komunikat o braku studentów", async () => {
    getStudentsFromGroup.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 0 },
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Brak studentów w tej grupie.")
      ).toBeInTheDocument();
    });
  });

  test("przycisk Zawieś wszystko jest disabled", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const uslugiBtn = screen.getByText("Usługi");
    fireEvent.click(uslugiBtn);

    await waitFor(() => {
      const stopAllBtn = screen.getByText("Zawieś wszystko");
      expect(stopAllBtn).toBeDisabled();
    });
  });

  test("wyświetla toast sukcesu po zapisie", async () => {
    const { showSuccessToast } = require("@/components/utils/Toast");

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith(
        "Grupa została zaktualizowana pomyślnie."
      );
    });
  });

  test("przywraca dane po nieudanym zapisie", async () => {
    updateGroup.mockRejectedValueOnce(new Error("Błąd zapisu"));

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue("Test Group");
    fireEvent.change(nameInput, { target: { value: "Zmieniona nazwa" } });

    expect(screen.getByDisplayValue("Zmieniona nazwa")).toBeInTheDocument();

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateGroup).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Group")).toBeInTheDocument();
    });
  });

  test("wyświetla toast błędu przy nieudanym zapisie", async () => {
    const { showErrorToast } = require("@/components/utils/Toast");
    updateGroup.mockRejectedValueOnce(new Error("Błąd zapisu"));

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        expect.stringContaining("Błąd podczas aktualizacji grupy")
      );
    });
  });

  test("wszystkie pola formularza są disabled gdy nie ma edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Group")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Test Group")).toBeDisabled();
    expect(screen.getByDisplayValue("2024-01-01")).toBeDisabled();
    expect(screen.getByDisplayValue("2024-12-31")).toBeDisabled();
    expect(screen.getByDisplayValue("Test description")).toBeDisabled();
    expect(screen.getByDisplayValue("Aktywna")).toBeDisabled();
  });

  test("wszystkie pola formularza są enabled podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Test Group")).not.toBeDisabled();
    expect(screen.getByDisplayValue("2024-01-01")).not.toBeDisabled();
    expect(screen.getByDisplayValue("2024-12-31")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Test description")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Aktywna")).toBeDisabled();
  });

  test("usuwa prowadzącego z listy", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Jan Kowalski")).toBeInTheDocument();
    });

    const editBtn = screen.getByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const removeBtn = screen.getByText("Usuń");
    fireEvent.click(removeBtn);

    expect(screen.queryByText("Jan Kowalski")).not.toBeInTheDocument();
  });

  test("zmienia tekst w polu uwagi podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Opis");
    fireEvent.change(textarea, { target: { value: "Nowe uwagi" } });

    expect(textarea.value).toBe("Nowe uwagi");
  });

  test("wyświetla grupę ze statusem Nieaktywna", async () => {
    getGroupById.mockResolvedValueOnce({
      name: "Test Group",
      lecturerFullNames: [],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "",
      status: "Nieaktywna",
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Nieaktywna")).toBeInTheDocument();
    });
  });

  test("wyświetla grupę ze statusem Zarchiwizowana", async () => {
    getGroupById.mockResolvedValueOnce({
      name: "Test Group",
      lecturerFullNames: [],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "",
      status: "Zarchiwizowana",
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Zarchiwizowana")).toBeInTheDocument();
    });
  });

  test("wyświetla komunikat o braku usług", async () => {
    getResourcesGroup.mockResolvedValueOnce([]);

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const uslugiBtn = screen.getByText("Usługi");
    fireEvent.click(uslugiBtn);

    await waitFor(() => {
      expect(getResourcesGroup).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Brak usług dla tej grupy.")).toBeInTheDocument();
    });
  });

  test("modal dodawania studenta otrzymuje groupId", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalled();
    });

    const modalGroupId = screen
      .getByTestId("add-student-modal")
      .querySelector('[data-testid="modal-groupid"]');
    expect(modalGroupId).toHaveTextContent("123");
  });

  test("modal importu studentów otrzymuje groupId", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const studenciBtn = screen.getByText("Studenci");
    fireEvent.click(studenciBtn);

    await waitFor(() => {
      expect(getStudentsFromGroup).toHaveBeenCalled();
    });

    const importBtn = screen.getByText(/Importuj/);
    fireEvent.click(importBtn);

    const modalGroupId = screen
      .getByTestId("import-students-modal")
      .querySelector('[data-testid="modal-groupid"]');
    expect(modalGroupId).toHaveTextContent("123");
  });

  test("modal dodawania usługi otrzymuje groupId", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getGroupById).toHaveBeenCalled();
    });

    const uslugiBtn = screen.getByText("Usługi");
    fireEvent.click(uslugiBtn);

    await waitFor(() => {
      expect(getResourcesGroup).toHaveBeenCalled();
    });

    const modalGroupId = screen
      .getByTestId("add-resource-modal")
      .querySelector('[data-testid="modal-groupid"]');
    expect(modalGroupId).toHaveTextContent("123");
  });
});
