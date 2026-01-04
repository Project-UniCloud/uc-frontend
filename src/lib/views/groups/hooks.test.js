import { renderHook, act, waitFor } from "@testing-library/react";
import { useGroupsPage } from "@/lib/views/groups/hooks";
import * as groupsApi from "@/lib/api/groupsApi";

jest.mock("@/lib/api/groupsApi");

describe("useGroupsPage", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    groupsApi.getGroups.mockResolvedValue({
      content: [{ id: 1, name: "Group 1", status: "ACTIVE" }],
      page: { totalPages: 1 },
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => useGroupsPage());
    expect(result.current.activeTab).toBe("ACTIVE");
    expect(result.current.isOpen).toBe(false);
    expect(result.current.search).toBe("");
    expect(result.current.page).toBe(0);
    expect(result.current.pageSize).toBe(10);
  });

  test("ładuje grupy przy montażu", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(groupsApi.getGroups).toHaveBeenCalled();
  });

  test("ustawia grupy z API response", async () => {
    const mockGroups = [
      { id: 1, name: "Group 1", status: "ACTIVE" },
      { id: 2, name: "Group 2", status: "ACTIVE" },
    ];
    groupsApi.getGroups.mockResolvedValue({
      content: mockGroups,
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.groups).toEqual(mockGroups);
    });
  });

  test("handleTabChange zmienia activeTab", () => {
    const { result } = renderHook(() => useGroupsPage());

    act(() => {
      result.current.handleTabChange("INACTIVE");
    });

    expect(result.current.activeTab).toBe("INACTIVE");
  });

  test("handleTabChange resetuje paginację", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPage(2);
    });

    act(() => {
      result.current.handleTabChange("INACTIVE");
    });

    expect(result.current.page).toBe(0);
  });

  test("handleTabChange resetuje search", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      const mockEvent = { target: { value: "test" } };
      result.current.onSearchChange(mockEvent);
    });

    act(() => {
      result.current.handleTabChange("INACTIVE");
    });

    expect(result.current.search).toBe("");
  });

  test("onSearchChange ustawia search value", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = {
      target: { value: "Group Search" },
    };

    act(() => {
      result.current.onSearchChange(mockEvent);
    });

    expect(result.current.search).toBe("Group Search");
  });

  test("onSearchChange resetuje page na 0", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPage(2);
    });

    const mockEvent = {
      target: { value: "Search" },
    };

    act(() => {
      result.current.onSearchChange(mockEvent);
    });

    expect(result.current.page).toBe(0);
  });

  test("setIsOpen zmienia isOpen", () => {
    const { result } = renderHook(() => useGroupsPage());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
  });

  test("setPage zmienia page", () => {
    const { result } = renderHook(() => useGroupsPage());

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  test("setPageSize zmienia pageSize", () => {
    const { result } = renderHook(() => useGroupsPage());

    act(() => {
      result.current.setPageSize(25);
    });

    expect(result.current.pageSize).toBe(25);
  });

  test("fetchGroups ładuje dane na nowo", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(groupsApi.getGroups).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.fetchGroups();
    });

    await waitFor(() => {
      expect(groupsApi.getGroups).toHaveBeenCalledTimes(2);
    });
  });

  test("obsługuje error z setError", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setError("Test error");
    });

    expect(result.current.error).toBe("Test error");
  });

  test("API call zawiera activeTab parameter", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTabChange("INACTIVE");
    });

    await waitFor(() => {
      expect(groupsApi.getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ status: "INACTIVE" })
      );
    });
  });

  test("API call zawiera search parameter", async () => {
    groupsApi.getGroups.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 0 },
    });

    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = {
      target: { value: "TestGroup" },
    };

    act(() => {
      result.current.onSearchChange(mockEvent);
    });

    await waitFor(() => {
      expect(groupsApi.getGroups).toHaveBeenCalledWith(
        expect.objectContaining({ groupName: "TestGroup" })
      );
    });
  });

  test("ustawia totalPages z response", async () => {
    groupsApi.getGroups.mockResolvedValue({
      content: [],
      page: { totalPages: 10 },
    });

    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.totalPages).toBe(10);
    });
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() => useGroupsPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("activeTab");
    expect(result.current).toHaveProperty("groups");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isOpen");
    expect(result.current).toHaveProperty("page");
    expect(result.current).toHaveProperty("pageSize");
    expect(result.current).toHaveProperty("totalPages");
    expect(result.current).toHaveProperty("search");
    expect(result.current).toHaveProperty("setIsOpen");
    expect(result.current).toHaveProperty("setPage");
    expect(result.current).toHaveProperty("setPageSize");
    expect(result.current).toHaveProperty("handleTabChange");
    expect(result.current).toHaveProperty("onSearchChange");
    expect(result.current).toHaveProperty("fetchGroups");
    expect(result.current).toHaveProperty("setError");
  });
});
