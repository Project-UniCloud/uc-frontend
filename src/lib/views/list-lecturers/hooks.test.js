import { renderHook, act, waitFor } from "@testing-library/react";
import { useListLecturersPage } from "@/lib/views/list-lecturers/hook";
import * as lecturersApi from "@/lib/api/lecturersApi";

jest.mock("@/lib/api/lecturersApi");

describe("useListLecturersPage", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    lecturersApi.getLecturers.mockResolvedValue({
      content: [{ uuid: "uuid-1", firstName: "John", lastName: "Doe" }],
      page: { totalPages: 1 },
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => useListLecturersPage());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.page).toBe(0);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.lecturers).toEqual([]);
  });

  test("ładuje nauczycieli przy montażu", async () => {
    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(lecturersApi.getLecturers).toHaveBeenCalled();
  });

  test("mapuje uuid na id w lecturers", async () => {
    lecturersApi.getLecturers.mockResolvedValue({
      content: [
        { uuid: "uuid-1", firstName: "John", lastName: "Doe" },
        { uuid: "uuid-2", firstName: "Jane", lastName: "Smith" },
      ],
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lecturers).toHaveLength(2);
    expect(result.current.lecturers[0].id).toBe("uuid-1");
    expect(result.current.lecturers[0].groupId).toBe("uuid-1");
  });

  test("setIsOpen zmienia isOpen", () => {
    const { result } = renderHook(() => useListLecturersPage());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
  });

  test("setSearchQuery zmienia searchQuery", () => {
    const { result } = renderHook(() => useListLecturersPage());

    act(() => {
      result.current.setSearchQuery("John");
    });

    expect(result.current.searchQuery).toBe("John");
  });

  test("setPage zmienia page", () => {
    const { result } = renderHook(() => useListLecturersPage());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });

  test("setPageSize zmienia pageSize", () => {
    const { result } = renderHook(() => useListLecturersPage());

    act(() => {
      result.current.setPageSize(25);
    });

    expect(result.current.pageSize).toBe(25);
  });

  test("fetchLecturers ładuje dane na nowo", async () => {
    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(lecturersApi.getLecturers).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.fetchLecturers();
    });

    await waitFor(() => {
      expect(lecturersApi.getLecturers).toHaveBeenCalledTimes(2);
    });
  });

  test("API call zawiera searchQuery parameter", async () => {
    lecturersApi.getLecturers.mockResolvedValue({
      content: [],
      page: { totalPages: 0 },
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearchQuery("Test");
    });

    await waitFor(() => {
      expect(lecturersApi.getLecturers).toHaveBeenCalledWith(
        expect.objectContaining({ searchQuery: "Test" })
      );
    });
  });

  test("API call zawiera page parameter", async () => {
    lecturersApi.getLecturers.mockResolvedValue({
      content: [],
      page: { totalPages: 0 },
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPage(3);
    });

    await waitFor(() => {
      expect(lecturersApi.getLecturers).toHaveBeenCalledWith(
        expect.objectContaining({ page: 3 })
      );
    });
  });

  test("API call zawiera pageSize parameter", async () => {
    lecturersApi.getLecturers.mockResolvedValue({
      content: [],
      page: { totalPages: 0 },
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPageSize(20);
    });

    await waitFor(() => {
      expect(lecturersApi.getLecturers).toHaveBeenCalledWith(
        expect.objectContaining({ pageSize: 20 })
      );
    });
  });

  test("ustawia totalPages z response", async () => {
    lecturersApi.getLecturers.mockResolvedValue({
      content: [],
      page: { totalPages: 15 },
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.totalPages).toBe(15);
    });
  });

  test("obsługuje empty content array", async () => {
    lecturersApi.getLecturers.mockResolvedValueOnce({
      content: null,
      page: { totalPages: 0 },
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lecturers).toEqual([]);
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("lecturers");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isOpen");
    expect(result.current).toHaveProperty("searchQuery");
    expect(result.current).toHaveProperty("page");
    expect(result.current).toHaveProperty("pageSize");
    expect(result.current).toHaveProperty("totalPages");
    expect(result.current).toHaveProperty("setIsOpen");
    expect(result.current).toHaveProperty("setSearchQuery");
    expect(result.current).toHaveProperty("setPage");
    expect(result.current).toHaveProperty("setPageSize");
    expect(result.current).toHaveProperty("fetchLecturers");
  });
});
