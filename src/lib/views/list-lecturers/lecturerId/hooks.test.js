import { renderHook, act, waitFor } from "@testing-library/react";
import { useLecturerDetailPage } from "@/lib/views/list-lecturers/lecturerId/hooks";
import * as lecturersApi from "@/lib/api/lecturersApi";
import * as Toast from "@/components/utils/Toast";

jest.mock("@/lib/api/lecturersApi");
jest.mock("@/components/utils/Toast");

describe("useLecturerDetailPage", () => {
  const mockLecturerId = "lecturer-uuid-123";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    lecturersApi.getLecturerById.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      login: "johndoe",
    });
  });

  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));
    expect(result.current.loading).toBe(true);
    expect(result.current.editing).toBe(false);
  });

  test("ładuje dane prowadzącego", async () => {
    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(lecturersApi.getLecturerById).toHaveBeenCalledWith(mockLecturerId);
    expect(result.current.lecturer.firstName).toBe("John");
    expect(result.current.lecturer.lastName).toBe("Doe");
    expect(result.current.lecturer.email).toBe("john.doe@example.com");
  });

  test("obsługuje błąd ładowania", async () => {
    lecturersApi.getLecturerById.mockRejectedValue(new Error("Load failed"));

    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Load failed");
  });

  test("handleEditClick rozpoczyna edycję", async () => {
    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.editing).toBe(true);
  });

  test("handleChange aktualizuje pole", async () => {
    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = { target: { value: "Jane" } };

    act(() => {
      result.current.handleEditClick();
      result.current.handleChange("firstName")(mockEvent);
    });

    expect(result.current.lecturer.firstName).toBe("Jane");
  });

  test("handleEditClick zapisuje zmiany", async () => {
    lecturersApi.updateLecturer.mockResolvedValue({});

    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

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
      expect(lecturersApi.updateLecturer).toHaveBeenCalledWith(
        mockLecturerId,
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          login: "johndoe",
        })
      );
      expect(Toast.showSuccessToast).toHaveBeenCalled();
    });
  });

  test("obsługuje błąd przy zapisie", async () => {
    lecturersApi.updateLecturer.mockRejectedValue(new Error("Update failed"));

    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

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

  test("nie ładuje danych gdy brak lecturerId", () => {
    const { result } = renderHook(() => useLecturerDetailPage(null));
    expect(lecturersApi.getLecturerById).not.toHaveBeenCalled();
  });

  test("zwraca wszystkie wymagane properties", async () => {
    const { result } = renderHook(() => useLecturerDetailPage(mockLecturerId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toHaveProperty("lecturer");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("formLoading");
    expect(result.current).toHaveProperty("editing");
    expect(result.current).toHaveProperty("handleChange");
    expect(result.current).toHaveProperty("handleEditClick");
  });
});
