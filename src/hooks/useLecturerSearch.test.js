import { renderHook, waitFor, act } from "@testing-library/react";
import { useLecturerSearch } from "./useLecturerSearch";
import { searchLecturers } from "@/lib/api/usersApi";

jest.mock("@/lib/api/usersApi", () => ({
  searchLecturers: jest.fn(),
}));

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe("useLecturerSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test("zwraca puste wyniki i loading=false początkowo", () => {
    const { result } = renderHook(() => useLecturerSearch(""));
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test("nie wywoła API gdy query jest pusty", async () => {
    renderHook(() => useLecturerSearch(""));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(searchLecturers).not.toHaveBeenCalled();
  });

  test("wywołuje API po 300ms debounce", async () => {
    searchLecturers.mockResolvedValue([]);
    const { result } = renderHook(() => useLecturerSearch("Smith"));

    expect(searchLecturers).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(searchLecturers).toHaveBeenCalledWith("Smith");
      expect(result.current.loading).toBe(false);
    });
  });

  test("ustawia wyniki z API", async () => {
    const mockResults = [
      { id: 1, name: "Dr. Smith" },
      { id: 2, name: "Dr. Jones" },
    ];
    searchLecturers.mockResolvedValue(mockResults);

    const { result } = renderHook(() => useLecturerSearch("Dr"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockResults);
      expect(result.current.loading).toBe(false);
    });
  });

  test("ustawia loading=false po pomyślnym pobraniu wyników", async () => {
    searchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);
    const { result } = renderHook(() => useLecturerSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("ustawia puste wyniki przy błędzie API", async () => {
    searchLecturers.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useLecturerSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  test("ustawia loading=false przy błędzie API", async () => {
    searchLecturers.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useLecturerSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("czyści timeout gdy component unmount", () => {
    searchLecturers.mockResolvedValue([]);
    const { unmount } = renderHook(() => useLecturerSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(searchLecturers).not.toHaveBeenCalled();
  });

  test("czyści timeout gdy query się zmienia", async () => {
    searchLecturers.mockResolvedValue([]);
    const { rerender, result } = renderHook(
      ({ query }) => useLecturerSearch(query),
      {
        initialProps: { query: "Smith" },
      }
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ query: "Jones" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(searchLecturers).toHaveBeenCalledTimes(1);
      expect(searchLecturers).toHaveBeenCalledWith("Jones");
      expect(result.current.loading).toBe(false);
    });
  });

  test("obsługuje zmianę z query na pusty string", async () => {
    searchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);
    const { result, rerender } = renderHook(
      ({ query }) => useLecturerSearch(query),
      { initialProps: { query: "Smith" } }
    );

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    act(() => {
      rerender({ query: "" });
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test("zwraca object z results i loading properties", () => {
    const { result } = renderHook(() => useLecturerSearch("test"));
    expect(result.current).toHaveProperty("results");
    expect(result.current).toHaveProperty("loading");
    expect(Array.isArray(result.current.results)).toBe(true);
    expect(typeof result.current.loading).toBe("boolean");
  });

  test("obsługuje puste wyniki z API", async () => {
    searchLecturers.mockResolvedValue([]);
    const { result } = renderHook(() => useLecturerSearch("NoMatch"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  test("obsługuje specjalne znaki w query", async () => {
    searchLecturers.mockResolvedValue([]);
    const { result } = renderHook(() => useLecturerSearch("Smith & Co."));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(searchLecturers).toHaveBeenCalledWith("Smith & Co.");
      expect(result.current.loading).toBe(false);
    });
  });

  test("obsługuje wielkie i małe litery", async () => {
    searchLecturers.mockResolvedValue([]);
    const { result } = renderHook(() => useLecturerSearch("DoCToR"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(searchLecturers).toHaveBeenCalledWith("DoCToR");
      expect(result.current.loading).toBe(false);
    });
  });
});
