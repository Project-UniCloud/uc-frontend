import { renderHook, act, waitFor } from "@testing-library/react";
import { useDriverDetailPage } from "@/lib/views/drivers/driverName/hooks";
import * as cloudApi from "@/lib/api/cloudApi";
import * as driversApi from "@/lib/api/driversApi";
import * as groupsApi from "@/lib/api/groupsApi";
import * as Toast from "@/components/utils/Toast";

jest.mock("@/lib/api/cloudApi");
jest.mock("@/lib/api/driversApi");
jest.mock("@/lib/api/groupsApi");
jest.mock("@/components/utils/Toast");

describe("useDriverDetailPage", () => {
  const mockDriverName = "Driver1";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    cloudApi.getCloudAccessesById.mockResolvedValue({
      cloudConnectorId: 1,
      cloudConnectorName: "Driver1",
      defaultCronExpression: "0 0 * * *",
      costLimit: 1000,
      isActive: true,
    });
    cloudApi.getResourceTypesByDriverId.mockResolvedValue({
      content: [{ id: 1, name: "Type1" }],
      page: { totalPages: 1 },
    });
    groupsApi.getGroups.mockResolvedValue({
      content: [{ id: 1, name: "Group1" }],
      page: { totalPages: 1 },
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));
    expect(result.current.activeTab).toBe("Ustawienia");
    expect(result.current.editing).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  test("ładuje dane dla tab Ustawienia", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.driverData.id).toBe(1);
    expect(result.current.driverData.name).toBe("Driver1");
  });

  test("handleTabChange zmienia activeTab", () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    act(() => {
      result.current.handleTabChange("Grupy zajęciowe");
    });

    expect(result.current.activeTab).toBe("Grupy zajęciowe");
  });

  test("handleTabChange resetuje paginację", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setPage(2);
    });

    act(() => {
      result.current.handleTabChange("Grupy zajęciowe");
    });

    expect(result.current.page).toBe(0);
  });

  test("handleTabChange anuluje edycję", () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);

    act(() => {
      result.current.handleTabChange("Grupy zajęciowe");
    });

    expect(result.current.editing).toBe(false);
  });

  test("handleEditClick umożliwia edycję", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleChange aktualizuje pole drivera", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = {
      target: { value: "Updated Name" },
    };

    act(() => {
      result.current.handleEditClick();
      result.current.handleChange("name")(mockEvent);
    });

    expect(result.current.driverData.name).toBe("Updated Name");
  });

  test("handleEditClick rozpoczyna edycję", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleEditClick zapisuje zmiany", async () => {
    driversApi.updateDriver.mockResolvedValueOnce({
      id: 1,
      name: "Updated",
    });

    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

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
      expect(driversApi.updateDriver).toHaveBeenCalled();
      expect(Toast.showSuccessToast).toHaveBeenCalled();
    });
  });

  test("obsługuje błąd przy zapisie", async () => {
    driversApi.updateDriver.mockRejectedValueOnce(new Error("Update failed"));

    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

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
      expect(result.current.error).toBeDefined();
      expect(Toast.showErrorToast).toHaveBeenCalled();
    });
  });

  test("setIsOpenAddModal zmienia isOpenAddModal", () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    expect(result.current.isOpenAddModal).toBe(false);

    act(() => {
      result.current.setIsOpenAddModal(true);
    });

    expect(result.current.isOpenAddModal).toBe(true);
  });

  test("tableData mapuje groupsData z id", async () => {
    groupsApi.getGroups.mockResolvedValue({
      content: [
        { id: 1, name: "Group1" },
        { id: 2, name: "Group2" },
      ],
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTabChange("Grupy zajęciowe");
    });

    await waitFor(() => {
      expect(result.current.tableData).toHaveLength(2);
      expect(result.current.tableData[0].id).toBe(1);
    });
  });

  test("ładuje resource types dla tab Typy zasobów", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTabChange("Typy zasobów");
    });

    await waitFor(() => {
      expect(cloudApi.getResourceTypesByDriverId).toHaveBeenCalled();
    });
  });

  test("ładuje grupy dla tab Grupy zajęciowe", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTabChange("Grupy zajęciowe");
    });

    await waitFor(() => {
      expect(groupsApi.getGroups).toHaveBeenCalled();
    });
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() => useDriverDetailPage(mockDriverName));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("activeTab");
    expect(result.current).toHaveProperty("driverData");
    expect(result.current).toHaveProperty("driverResourceTypesData");
    expect(result.current).toHaveProperty("groupsData");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("editing");
    expect(result.current).toHaveProperty("handleTabChange");
    expect(result.current).toHaveProperty("handleChange");
    expect(result.current).toHaveProperty("handleEditClick");
    expect(result.current).toHaveProperty("isOpenAddModal");
  });
});
