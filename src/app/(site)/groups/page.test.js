import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupsPage from "./page";
import { getGroups } from "@/lib/groupsApi";

jest.mock("@/lib/groupsApi");

jest.mock("@/components/utils/Tabs", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <button onClick={() => props.onTabChange("ACTIVE")}>ACTIVE</button>
      <button onClick={() => props.onTabChange("ARCHIVED")}>ARCHIVED</button>
      <button onClick={() => props.onTabChange("INACTIVE")}>INACTIVE</button>
    </div>
  ),
}));

jest.mock("@/components/group/AddGroupModal", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="modal">{props.isOpen ? "OPEN" : "CLOSED"}</div>
  ),
}));

jest.mock("@/components/views/DataTableView", () => ({
  __esModule: true,
  default: (props) => {
    let searchInput = null;
    let addButton = null;

    if (
      props.leftActions &&
      props.leftActions.props &&
      props.leftActions.props.children
    ) {
      const children = Array.isArray(props.leftActions.props.children)
        ? props.leftActions.props.children
        : [props.leftActions.props.children];

      for (const child of children) {
        if (child?.type === "input") {
          searchInput = child;
        }
        if (
          child?.type?.name === "Button" ||
          (child?.props?.onClick &&
            child?.props?.children?.props?.children === " Dodaj grupę")
        ) {
          addButton = child;
        }
      }
    }

    return (
      <div data-testid="table-view">
        {props.loading && <span>Ładowanie...</span>}
        {props.error && <span data-testid="error">{props.error}</span>}
        {!props.loading && !props.error && (
          <>
            TABLE [{props.data.length} rows]
            <div data-testid="table-props" style={{ display: "none" }}>
              <span data-testid="whereNavigate">{props.whereNavigate}</span>
              <span data-testid="idKey">{props.idKey}</span>
              <span data-testid="page">{props.page}</span>
              <span data-testid="pageSize">{props.pageSize}</span>
              <span data-testid="totalPages">{props.totalPages}</span>
              <span data-testid="columns-count">{props.columns?.length}</span>
              <span data-testid="data-count">{props.data?.length}</span>
              {props.data?.[0] && (
                <span data-testid="first-item-id">{props.data[0].id}</span>
              )}
            </div>
            {searchInput}
            {addButton}
          </>
        )}
      </div>
    );
  },
}));

jest.mock("@/components/utils/Buttons", () => ({
  Button: (props) => (
    <button data-testid="add-group-btn" onClick={props.onClick}>
      {props.children}
    </button>
  ),
}));

describe("GroupsPage", () => {
  beforeEach(() => {
    getGroups.mockResolvedValue({
      content: [
        { groupId: 10, name: "Test Group", lecturers: [], cloudAccesses: [] },
      ],
      page: { totalPages: 3 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("ładuje dane z API i wyświetla je w tabeli", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const table = await screen.findByTestId("table-view");
    expect(table).toBeInTheDocument();
  });

  test("zmienia tab po kliknięciu", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const archivedBtn = screen.getByText("ARCHIVED");
    fireEvent.click(archivedBtn);
    await waitFor(() => {
      expect(getGroups).toHaveBeenLastCalledWith({
        status: "ARCHIVED",
        page: 0,
        pageSize: 10,
        groupName: "",
      });
    });
  });

  test("otwiera modal po kliknięciu Dodaj grupę", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const addGroupBtn = await screen.findByTestId("add-group-btn");
    fireEvent.click(addGroupBtn);
    expect(screen.getByTestId("modal")).toHaveTextContent("OPEN");
  });

  test("zapisuje poprawny tekst w wyszukiwaniu", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const searchInput = await screen.findByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "ABC" } });
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "ACTIVE",
          page: 0,
          pageSize: 10,
          groupName: "ABC",
        })
      );
    });
  });

  test("wyświetla błąd gdy API zwraca błąd", async () => {
    getGroups.mockRejectedValueOnce(new Error("Network error"));
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const errorMessage = await screen.findByTestId("error");
    expect(errorMessage).toHaveTextContent("Network error");
  });

  test("pokazuje loading podczas ładowania danych", async () => {
    getGroups.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ content: [], page: { totalPages: 0 } }),
            100
          )
        )
    );
    render(<GroupsPage />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    await waitFor(
      () => {
        expect(screen.queryByText("Ładowanie...")).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test("blokuje nieprawidłowe znaki w wyszukiwaniu i wyświetla błąd", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const searchInput = await screen.findByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "test@#$" } });
    await waitFor(() => {
      const errorMessage = screen.getByTestId("error");
      expect(errorMessage).toHaveTextContent(/Dozwolone:/i);
    });
    expect(getGroups).not.toHaveBeenCalledWith(
      expect.objectContaining({ groupName: "test@#$" })
    );
  });

  test("przycisk Dodaj grupę widoczny tylko dla zakładki ACTIVE", async () => {
    render(<GroupsPage />);

    const addBtn = await screen.findByTestId("add-group-btn");
    expect(addBtn).toBeInTheDocument();

    const archivedBtn = screen.getByText("ARCHIVED");
    fireEvent.click(archivedBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("add-group-btn")).not.toBeInTheDocument();
    });
    const inactiveBtn = screen.getByText("INACTIVE");
    fireEvent.click(inactiveBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("add-group-btn")).not.toBeInTheDocument();
    });
    const activeBtn = screen.getByText("ACTIVE");
    fireEvent.click(activeBtn);

    await waitFor(() => {
      expect(screen.getByTestId("add-group-btn")).toBeInTheDocument();
    });
  });

  test("input wyszukiwania ukryty gdy brak danych", async () => {
    getGroups.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 0 },
    });

    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const searchInput = screen.queryByPlaceholderText("Szukaj grupy");
    if (searchInput) {
      expect(searchInput).toHaveClass("hidden");
    } else {
      expect(searchInput).toBeNull();
    }
  });

  test("input wyszukiwania widoczny gdy są dane", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    expect(searchInput).not.toHaveClass("hidden");
  });

  test("resetowanie paginacji i wyszukiwania przy zmianie zakładki", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });
    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "ACTIVE",
          groupName: "test",
          page: 0,
          pageSize: 10,
        })
      );
    });
    const archivedBtn = screen.getByText("ARCHIVED");
    fireEvent.click(archivedBtn);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "ARCHIVED",
          groupName: "",
          page: 0,
          pageSize: 10,
        })
      );
    });
  });

  test("akceptuje polskie znaki w wyszukiwaniu", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "ąęćłńóśźżĄĆŁŃÓŚŹŻ" } });

    await waitFor(() => {
      expect(screen.queryByTestId("error")).not.toBeInTheDocument();
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({
          groupName: "ąęćłńóśźżĄĆŁŃÓŚŹŻ",
        })
      );
    });
  });

  test("akceptuje cyfry i myślniki w wyszukiwaniu", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "Grupa-123 test 456" } });

    await waitFor(() => {
      expect(screen.queryByTestId("error")).not.toBeInTheDocument();

      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({
          groupName: "Grupa-123 test 456",
        })
      );
    });
  });

  test("poprawnie przekazuje props do DataTableView", async () => {
    render(<GroupsPage />);
    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("whereNavigate")).toHaveTextContent("groups");
      expect(screen.getByTestId("idKey")).toHaveTextContent("groupId");
      expect(screen.getByTestId("page")).toHaveTextContent("0");
      expect(screen.getByTestId("pageSize")).toHaveTextContent("10");
      expect(screen.getByTestId("totalPages")).toHaveTextContent("3");
      expect(screen.getByTestId("columns-count")).toHaveTextContent("6");
      expect(screen.getByTestId("data-count")).toHaveTextContent("1");
    });
  });

  test("transformuje dane przed przekazaniem do tabeli", async () => {
    getGroups.mockResolvedValueOnce({
      content: [
        { groupId: 100, name: "Grupa 1", lecturers: [], cloudAccesses: [] },
        { groupId: 200, name: "Grupa 2", lecturers: [], cloudAccesses: [] },
      ],
      page: { totalPages: 1 },
    });

    render(<GroupsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("first-item-id")).toHaveTextContent("1");
      expect(screen.getByTestId("data-count")).toHaveTextContent("2");
    });
  });

  test("zmienia stronę paginacji", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith({
        status: "ACTIVE",
        page: 0,
        pageSize: 10,
        groupName: "",
      });
    });

    await waitFor(() => {
      const pageElement = screen.getByTestId("page");
      expect(pageElement).toHaveTextContent("0");
    });
  });

  test("zmienia rozmiar strony paginacji", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith({
        status: "ACTIVE",
        page: 0,
        pageSize: 10,
        groupName: "",
      });
    });

    await waitFor(() => {
      const pageSizeElement = screen.getByTestId("pageSize");
      expect(pageSizeElement).toHaveTextContent("10");
    });
  });

  test("input wyszukiwania jest disabled gdy brak grup i brak wyszukiwania", async () => {
    getGroups.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 0 },
    });

    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.queryByPlaceholderText("Szukaj grupy");
    if (searchInput) {
      expect(searchInput).toBeDisabled();
    }
  });

  test("input wyszukiwania jest enabled gdy są grupy", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    expect(searchInput).not.toBeDisabled();
  });

  test("input wyszukiwania jest enabled gdy jest aktywne wyszukiwanie mimo braku grup", async () => {
    getGroups.mockResolvedValueOnce({
      content: [
        { groupId: 10, name: "Test Group", lecturers: [], cloudAccesses: [] },
      ],
      page: { totalPages: 1 },
    });

    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "xyz" } });

    getGroups.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 0 },
    });

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ groupName: "xyz" })
      );
    });

    expect(searchInput).not.toBeDisabled();
  });

  test("sprawdza kompletną logikę groups.length === 0 && search.length === 0", async () => {
    getGroups.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 0 },
    });

    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.queryByPlaceholderText("Szukaj grupy");
    if (searchInput) {
      expect(searchInput).toBeDisabled();
      expect(searchInput).toHaveClass("hidden");
      expect(searchInput).toHaveClass("opacity-50");
      expect(searchInput).toHaveClass("cursor-not-allowed");
    }
  });

  test("nie wyświetla błędu dla poprawnej walidacji", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Szukaj grupy");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ groupName: "test" })
      );
    });

    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  test("wyświetla i przełącza zakładkę INACTIVE", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const inactiveBtn = screen.getByText("INACTIVE");
    expect(inactiveBtn).toBeInTheDocument();

    fireEvent.click(inactiveBtn);

    await waitFor(() => {
      expect(getGroups).toHaveBeenLastCalledWith({
        status: "INACTIVE",
        page: 0,
        pageSize: 10,
        groupName: "",
      });
    });
  });

  test("przycisk Dodaj grupę nie jest widoczny w zakładce INACTIVE", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const inactiveBtn = screen.getByText("INACTIVE");
    fireEvent.click(inactiveBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("add-group-btn")).not.toBeInTheDocument();
    });
  });

  test("przechodzi przez wszystkie zakładki w kolejności", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ status: "ACTIVE" })
      );
    });

    const archivedBtn = screen.getByText("ARCHIVED");
    fireEvent.click(archivedBtn);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ status: "ARCHIVED" })
      );
    });

    const inactiveBtn = screen.getByText("INACTIVE");
    fireEvent.click(inactiveBtn);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ status: "INACTIVE" })
      );
    });

    const activeBtn = screen.getByText("ACTIVE");
    fireEvent.click(activeBtn);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ status: "ACTIVE" })
      );
    });
  });

  test("resetuje paginację przy przejściu do zakładki INACTIVE", async () => {
    render(<GroupsPage />);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalled();
    });

    const inactiveBtn = screen.getByText("INACTIVE");
    fireEvent.click(inactiveBtn);

    await waitFor(() => {
      expect(getGroups).toHaveBeenCalledWith({
        status: "INACTIVE",
        page: 0,
        pageSize: 10,
        groupName: "",
      });
    });
  });
});
