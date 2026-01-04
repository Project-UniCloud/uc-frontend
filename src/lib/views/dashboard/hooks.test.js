import { renderHook, act, waitFor } from "@testing-library/react";
import { useDashboardPage } from "@/lib/views/dashboard/hooks";
import * as statisticsApi from "@/lib/api/statisticsApi";

jest.mock("@/lib/api/statisticsApi");

describe("useDashboardPage", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    statisticsApi.getOverallStats.mockResolvedValueOnce({
      totalCost: 1000,
      resourceCount: 50,
    });
    statisticsApi.getCostPerGroup.mockResolvedValueOnce([
      { name: "Group 1", cost: 300 },
    ]);
    statisticsApi.getCostPerResourceType.mockResolvedValueOnce([
      { type: "Type 1", cost: 400 },
    ]);
    statisticsApi.getCostInTime.mockResolvedValueOnce([
      { month: "Jan", cost: 100 },
    ]);
  });

  test("inicjalizuje z initialData", () => {
    const { result } = renderHook(() => useDashboardPage());
    expect(result.current.overallStats).toBe(null);
    expect(result.current.costPerGroup).toEqual([]);
    expect(result.current.costPerResourceType).toEqual([]);
    expect(result.current.costInTime).toEqual([]);
  });

  test("zwraca loading i error properties", () => {
    const { result } = renderHook(() => useDashboardPage());
    expect(typeof result.current.loading).toBe("boolean");
    expect(result.current.error).toBe(null);
  });

  test("ładuje wszystkie dane przy montażu", async () => {
    const { result } = renderHook(() => useDashboardPage());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(statisticsApi.getOverallStats).toHaveBeenCalled();
    expect(statisticsApi.getCostPerGroup).toHaveBeenCalled();
    expect(statisticsApi.getCostPerResourceType).toHaveBeenCalled();
    expect(statisticsApi.getCostInTime).toHaveBeenCalled();
  });

  test("ustawia overallStats", async () => {
    const mockStats = { totalCost: 1000, resourceCount: 50 };
    statisticsApi.getOverallStats.mockResolvedValueOnce(mockStats);

    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.overallStats).toEqual(mockStats);
    });
  });

  test("ustawia costPerGroup", async () => {
    const mockData = [{ name: "Group 1", cost: 300 }];
    statisticsApi.getCostPerGroup.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.costPerGroup).toEqual(mockData);
    });
  });

  test("ustawia costPerResourceType", async () => {
    const mockData = [{ type: "Type 1", cost: 400 }];
    statisticsApi.getCostPerResourceType.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.costPerResourceType).toEqual(mockData);
    });
  });

  test("ustawia costInTime", async () => {
    const mockData = [{ month: "Jan", cost: 100 }];
    statisticsApi.getCostInTime.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.costInTime).toEqual(mockData);
    });
  });

  test("obsługuje błędy API", async () => {
    statisticsApi.getOverallStats.mockRejectedValueOnce(new Error("API Error"));
    statisticsApi.getCostPerGroup.mockResolvedValueOnce([]);
    statisticsApi.getCostPerResourceType.mockResolvedValueOnce([]);
    statisticsApi.getCostInTime.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
  });

  test("refetch ładuje dane na nowo", async () => {
    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(statisticsApi.getOverallStats).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(statisticsApi.getOverallStats).toHaveBeenCalledTimes(2);
    });
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("overallStats");
    expect(result.current).toHaveProperty("costPerGroup");
    expect(result.current).toHaveProperty("costPerResourceType");
    expect(result.current).toHaveProperty("costInTime");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("refetch");
  });
});
