import { renderHook, act, waitFor } from "@testing-library/react";
import { useResourceDetailPage } from "@/lib/views/groups/groupId/resourceId/hooks";
import * as resourceApi from "@/lib/api/resourceApi";
import * as Toast from "@/components/utils/Toast";

jest.mock("@/lib/api/resourceApi");
jest.mock("@/components/utils/Toast");

describe("useResourceDetailPage", () => {
  const mockGroupId = "group-uuid-123";
  const mockResourceId = "resource-uuid-456";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resourceApi.getResourceEditInfoByGroupId.mockResolvedValue({
      id: "res-1",
      limit: 1000,
      cron: "0 0 * * *",
      expiresAt: "31-12-2024",
      status: "ACTIVE",
      notificationLevel1: "80",
      notificationLevel2: "90",
      notificationLevel3: "95",
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.editing).toBe(false);
  });

  test("ładuje dane zasobu", async () => {
    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(resourceApi.getResourceEditInfoByGroupId).toHaveBeenCalledWith(
      mockGroupId,
      mockResourceId
    );
    expect(result.current.infoData.id).toBe("res-1");
    expect(result.current.infoData.limit).toBe(1000);
    expect(result.current.infoData.expiresAt).toBe("2024-12-31");
  });

  test("formatuje datę z DD-MM-YYYY na YYYY-MM-DD", async () => {
    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.infoData.expiresAt).toBe("2024-12-31");
  });

  test("obsługuje błąd ładowania", async () => {
    resourceApi.getResourceEditInfoByGroupId.mockRejectedValue(
      new Error("Load failed")
    );

    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Load failed");
  });

  test("handleEditClick rozpoczyna edycję", async () => {
    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleChange aktualizuje pole", async () => {
    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = { target: { value: "2000" } };

    act(() => {
      result.current.handleEditClick();
      result.current.handleChange("limit")(mockEvent);
    });

    expect(result.current.infoData.limit).toBe("2000");
  });

  test("handleEditClick zapisuje zmiany i formatuje datę z powrotem", async () => {
    resourceApi.updateResourceEditInfoByGroupId.mockResolvedValue({});

    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    act(() => {
      result.current.handleEditClick();
    });

    await waitFor(() => {
      expect(resourceApi.updateResourceEditInfoByGroupId).toHaveBeenCalledWith(
        mockGroupId,
        expect.objectContaining({
          id: "res-1",
          limit: 1000,
          expiresAt: "31-12-2024",
        })
      );
      expect(Toast.showSuccessToast).toHaveBeenCalled();
    });
  });

  test("obsługuje błąd przy zapisie", async () => {
    resourceApi.updateResourceEditInfoByGroupId.mockRejectedValue(
      new Error("Update failed")
    );

    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    act(() => {
      result.current.handleEditClick();
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Update failed");
      expect(Toast.showErrorToast).toHaveBeenCalled();
    });
  });

  test("obsługuje puste wartości opcjonalne", async () => {
    resourceApi.getResourceEditInfoByGroupId.mockResolvedValue({
      id: "res-1",
      limit: 1000,
      cron: null,
      expiresAt: "31-12-2024",
      status: null,
      notificationLevel1: null,
      notificationLevel2: null,
      notificationLevel3: null,
    });

    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.infoData.cron).toBe("");
    expect(result.current.infoData.status).toBe("");
    expect(result.current.infoData.notificationLevel1).toBe("");
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() =>
      useResourceDetailPage(mockGroupId, mockResourceId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("infoData");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("formLoading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("editing");
    expect(result.current).toHaveProperty("handleChange");
    expect(result.current).toHaveProperty("handleEditClick");
  });
});
