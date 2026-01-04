import { renderHook, act, waitFor } from "@testing-library/react";
import { useStudentDetailPage } from "@/lib/views/groups/groupId/studentId/hooks";
import * as studentApi from "@/lib/api/studentApi";
import * as groupsApi from "@/lib/api/groupsApi";
import * as Toast from "@/components/utils/Toast";

jest.mock("@/lib/api/studentApi");
jest.mock("@/lib/api/groupsApi");
jest.mock("@/components/utils/Toast");

describe("useStudentDetailPage", () => {
  const mockStudentId = "student-uuid-123";
  const mockGroupId = "group-uuid-456";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    studentApi.getStudentById.mockResolvedValue({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      login: "alicesmith",
    });
    groupsApi.getGroupById.mockResolvedValue({
      name: "Test Group",
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.editing).toBe(false);
    expect(result.current.isOpen).toBe(false);
  });

  test("ładuje dane studenta i grupy", async () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(studentApi.getStudentById).toHaveBeenCalledWith(mockStudentId);
    expect(groupsApi.getGroupById).toHaveBeenCalledWith(mockGroupId);
    expect(result.current.student.firstName).toBe("Alice");
    expect(result.current.student.lastName).toBe("Smith");
    expect(result.current.groupName).toBe("Test Group");
  });

  test("obsługuje błąd ładowania", async () => {
    studentApi.getStudentById.mockRejectedValue(new Error("Load failed"));

    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Load failed");
  });

  test("handleEditClick rozpoczyna edycję", async () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleChange aktualizuje pole studenta", async () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = { target: { value: "Bob" } };

    act(() => {
      result.current.handleEditClick();
      result.current.handleChange("firstName")(mockEvent);
    });

    expect(result.current.student.firstName).toBe("Bob");
  });

  test("setIsOpen zmienia isOpen", async () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
  });

  test("handleEditClick zapisuje zmiany", async () => {
    studentApi.updateStudent.mockResolvedValue({});

    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
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
      expect(studentApi.updateStudent).toHaveBeenCalledWith(
        mockGroupId,
        mockStudentId,
        expect.objectContaining({
          firstName: "Alice",
          lastName: "Smith",
          email: "alice.smith@example.com",
          login: "alicesmith",
        })
      );
      expect(Toast.showSuccessToast).toHaveBeenCalled();
    });
  });

  test("obsługuje błąd przy zapisie", async () => {
    studentApi.updateStudent.mockRejectedValue(new Error("Update failed"));

    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
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

  test("nie ładuje danych gdy brak studentId lub groupId", () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(null, mockGroupId)
    );
    expect(studentApi.getStudentById).not.toHaveBeenCalled();
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() =>
      useStudentDetailPage(mockStudentId, mockGroupId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("student");
    expect(result.current).toHaveProperty("groupName");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("formLoading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("editing");
    expect(result.current).toHaveProperty("isOpen");
    expect(result.current).toHaveProperty("setIsOpen");
    expect(result.current).toHaveProperty("handleChange");
    expect(result.current).toHaveProperty("handleEditClick");
  });
});
