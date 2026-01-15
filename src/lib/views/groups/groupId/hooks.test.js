import { renderHook, act, waitFor } from "@testing-library/react";
import { useGroupDetailPage } from "@/lib/views/groups/groupId/hooks";
import * as groupsApi from "@/lib/api/groupsApi";
import * as studentApi from "@/lib/api/studentApi";
import * as Toast from "@/components/utils/Toast";

jest.mock("@/lib/api/groupsApi");
jest.mock("@/lib/api/studentApi");
jest.mock("@/components/utils/Toast");

describe("useGroupDetailPage", () => {
  const mockGroupId = "group-uuid-123";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    groupsApi.getGroupById.mockResolvedValue({
      name: "Group 1",
      lecturerFullNames: [
        {
          userId: 1,
          firstName: "John",
          lastName: "Doe",
          login: "jdoe",
          email: "jdoe@example.com",
        },
      ],
      // API returns DD-MM-YYYY, hook converts to YYYY-MM-DD
      startDate: "01-01-2024",
      endDate: "31-12-2024",
      description: "Test group",
      status: "ACTIVE",
    });
    groupsApi.getResourcesGroup.mockResolvedValue({
      content: [],
      page: { totalPages: 0 },
    });
    studentApi.getStudentsFromGroup.mockResolvedValue({
      content: [],
      page: { totalPages: 0 },
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));
    expect(result.current.activeTab).toBe("Ogólne");
    expect(result.current.editing).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  test("ładuje dane grupy przy montażu", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupData.name).toBe("Group 1");
  });

  test("mapuje nauczycieli z API response", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupData.lecturers).toEqual([
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
      },
    ]);
  });

  test("handleTabChange zmienia activeTab", () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    act(() => {
      result.current.handleTabChange("Studenci");
    });

    expect(result.current.activeTab).toBe("Studenci");
  });

  test("handleTabChange resetuje paginację", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setStudentPage(2);
    });

    act(() => {
      result.current.handleTabChange("Studenci");
    });

    expect(result.current.studentPage).toBe(0);
  });

  test("handleTabChange anuluje edycję", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    act(() => {
      result.current.handleTabChange("Studenci");
    });

    expect(result.current.editing).toBe(false);
  });

  test("handleChange aktualizuje pole grupy", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = {
      target: { value: "Updated Name" },
    };

    act(() => {
      result.current.handleChange("name")(mockEvent);
    });

    expect(result.current.groupData.name).toBe("Updated Name");
  });

  test("handleEditClick umożliwia edycję", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleEditClick rozpoczyna edycję", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleEditClick zapisuje zmiany", async () => {
    groupsApi.updateGroup.mockResolvedValueOnce({});

    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

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
      expect(groupsApi.updateGroup).toHaveBeenCalled();
      expect(Toast.showSuccessToast).toHaveBeenCalled();
    });
  });

  test("obsługuje błąd przy zapisie", async () => {
    groupsApi.updateGroup.mockRejectedValueOnce(new Error("Update failed"));

    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

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
      expect(result.current.error).toBe(null);
      expect(result.current.validationError).toBe("Update failed");
      expect(Toast.showErrorToast).toHaveBeenCalledWith("Update failed");
    });
  });

  test("handleLecturerAdd dodaje nauczyciela", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleLecturerAdd({ id: 2, fullName: "Jane Smith" });
    });

    expect(result.current.groupData.lecturers).toHaveLength(2);
    expect(result.current.groupData.lecturers[1]).toEqual({
      id: 2,
      fullName: "Jane Smith",
    });
  });

  test("handleLecturerAdd nie duplikuje nauczyciela", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const lecturer = result.current.groupData.lecturers[0];

    act(() => {
      result.current.handleLecturerAdd(lecturer);
    });

    expect(result.current.groupData.lecturers).toHaveLength(1);
  });

  test("handleLecturerRemove usuwa nauczyciela", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const lecturerId = result.current.groupData.lecturers[0].id;

    act(() => {
      result.current.handleLecturerRemove(lecturerId);
    });

    expect(result.current.groupData.lecturers).toHaveLength(0);
  });

  test("setIsOpenStudent zmienia isOpenStudent", () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    expect(result.current.isOpenStudent).toBe(false);

    act(() => {
      result.current.setIsOpenStudent(true);
    });

    expect(result.current.isOpenStudent).toBe(true);
  });

  test("setIsOpenImport zmienia isOpenImport", () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    expect(result.current.isOpenImport).toBe(false);

    act(() => {
      result.current.setIsOpenImport(true);
    });

    expect(result.current.isOpenImport).toBe(true);
  });

  test("setIsOpenResource zmienia isOpenResource", () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    expect(result.current.isOpenResource).toBe(false);

    act(() => {
      result.current.setIsOpenResource(true);
    });

    expect(result.current.isOpenResource).toBe(true);
  });

  test("fetchStudents ładuje studentów", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.fetchStudents();
    });

    await waitFor(() => {
      expect(studentApi.getStudentsFromGroup).toHaveBeenCalled();
    });
  });

  test("fetchResources ładuje zasoby", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.fetchResources();
    });

    await waitFor(() => {
      expect(groupsApi.getResourcesGroup).toHaveBeenCalled();
    });
  });

  test("ładuje studentów dla tab Studenci", async () => {
    studentApi.getStudentsFromGroup.mockResolvedValue({
      content: [{ id: 1, firstName: "Student", lastName: "One" }],
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTabChange("Studenci");
    });

    await waitFor(() => {
      expect(result.current.studentsData).toHaveLength(1);
    });
  });

  test("ładuje usługi dla tab Usługi", async () => {
    const mockResources = [{ id: 1, name: "Resource 1" }];
    groupsApi.getResourcesGroup.mockResolvedValue({
      content: mockResources,
      page: { totalPages: 1 },
    });

    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTabChange("Usługi");
    });

    await waitFor(() => {
      expect(result.current.resourcesData).toEqual(mockResources);
    });
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() => useGroupDetailPage(mockGroupId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("activeTab");
    expect(result.current).toHaveProperty("groupData");
    expect(result.current).toHaveProperty("studentsData");
    expect(result.current).toHaveProperty("resourcesData");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("editing");
    expect(result.current).toHaveProperty("handleTabChange");
    expect(result.current).toHaveProperty("handleChange");
    expect(result.current).toHaveProperty("handleEditClick");
    expect(result.current).toHaveProperty("handleLecturerAdd");
    expect(result.current).toHaveProperty("handleLecturerRemove");
    expect(result.current).toHaveProperty("fetchStudents");
    expect(result.current).toHaveProperty("fetchResources");
  });
});
