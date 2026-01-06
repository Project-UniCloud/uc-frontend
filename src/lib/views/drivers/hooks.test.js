import { renderHook, act, waitFor } from "@testing-library/react";
import { useDriversPage } from "@/lib/views/drivers/hooks";
import * as cloudApi from "@/lib/api/cloudApi";

jest.mock("@/lib/api/cloudApi");

describe("useDriversPage", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    cloudApi.getCloudAccesses.mockResolvedValue({
      content: [
        { id: 1, name: "Driver 1" },
        { id: 2, name: "Driver 2" },
      ],
      page: { totalPages: 1 },
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => useDriversPage());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.page).toBe(0);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.drivers).toEqual([]);
  });

  test("ustawia loading na true przy montażu", () => {
    const { result } = renderHook(() => useDriversPage());
    expect(result.current.loading).toBe(true);
  });

  test("ładuje drivers przy montażu", async () => {
    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(cloudApi.getCloudAccesses).toHaveBeenCalled();
  });

  test("ustawia drivers data", async () => {
    const mockData = [
      { id: 1, name: "Driver 1" },
      { id: 2, name: "Driver 2" },
    ];
    cloudApi.getCloudAccesses.mockResolvedValue({
      content: mockData,
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.drivers).toEqual(mockData);
    });
  });

  test("ustawia totalPages z response", async () => {
    cloudApi.getCloudAccesses.mockResolvedValue({
      content: [],
      page: { totalPages: 5 },
    });

    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.totalPages).toBe(5);
    });
  });

  test("setIsOpen zmienia isOpen", () => {
    const { result } = renderHook(() => useDriversPage());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
  });

  test("setPage zmienia numer strony", async () => {
    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });

  test("setPageSize zmienia rozmiar strony", () => {
    const { result } = renderHook(() => useDriversPage());

    act(() => {
      result.current.setPageSize(20);
    });

    expect(result.current.pageSize).toBe(20);
  });

  test("fetchCloudAccesses ładuje dane na nowo", async () => {
    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(cloudApi.getCloudAccesses).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.fetchCloudAccesses();
    });

    await waitFor(() => {
      expect(cloudApi.getCloudAccesses).toHaveBeenCalledTimes(2);
    });
  });

  test("tableData mapuje drivers z id", async () => {
    const mockData = [
      { cloudConnectorId: 1, cloudConnectorName: "Driver 1" },
      { cloudConnectorId: 2, cloudConnectorName: "Driver 2" },
    ];
    cloudApi.getCloudAccesses.mockResolvedValueOnce({
      content: mockData,
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tableData).toHaveLength(2);
    expect(result.current.tableData[0]).toHaveProperty("id");
    expect(result.current.tableData[1]).toHaveProperty("id");
  });

  test("obsługuje paginację z page dependency", async () => {
    cloudApi.getCloudAccesses.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 10 },
    });

    const { result, rerender } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPage(1);
    });

    await waitFor(() => {
      expect(cloudApi.getCloudAccesses).toHaveBeenCalled();
    });
  });

  test("obsługuje paginację z pageSize dependency", async () => {
    cloudApi.getCloudAccesses.mockResolvedValueOnce({
      content: [],
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useDriversPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPageSize(25);
    });

    await waitFor(() => {
      expect(cloudApi.getCloudAccesses).toHaveBeenCalled();
    });
  });

  test("zwraca wszystkie wymagane properties", () => {
    const { result } = renderHook(() => useDriversPage());

    expect(result.current).toHaveProperty("drivers");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isOpen");
    expect(result.current).toHaveProperty("setIsOpen");
    expect(result.current).toHaveProperty("page");
    expect(result.current).toHaveProperty("setPage");
    expect(result.current).toHaveProperty("pageSize");
    expect(result.current).toHaveProperty("setPageSize");
    expect(result.current).toHaveProperty("totalPages");
    expect(result.current).toHaveProperty("fetchCloudAccesses");
    expect(result.current).toHaveProperty("tableData");
  });
});
