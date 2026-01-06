import { renderHook, waitFor, act } from "@testing-library/react";
import { useLecturerExternalSearch } from "./useLecturerExternalSearch";
import { externalSearchLecturers } from "@/lib/api/lecturersApi";

jest.mock("@/lib/api/lecturersApi", () => ({
  externalSearchLecturers: jest.fn(),
}));

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe("useLecturerExternalSearch", () => {
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
    const { result } = renderHook(() => useLecturerExternalSearch(""));
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test("nie wywoła API gdy query jest pusty", () => {
    renderHook(() => useLecturerExternalSearch(""));
    act(() => {
      jest.runAllTimers();
    });
    expect(externalSearchLecturers).not.toHaveBeenCalled();
  });

  test("wywołuje API po 300ms debounce", () => {
    externalSearchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);

    renderHook(() => useLecturerExternalSearch("Smith"));

    expect(externalSearchLecturers).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(externalSearchLecturers).toHaveBeenCalledWith("Smith");
  });

  test("ustawia wyniki z API", async () => {
    const mockResults = [
      { id: 1, name: "Dr. Smith" },
      { id: 2, name: "Dr. Jones" },
    ];
    externalSearchLecturers.mockResolvedValue(mockResults);

    const { result } = renderHook(() => useLecturerExternalSearch("Dr"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockResults);
    });
  });

  test("ustawia loading=false po pomyślnym pobraniu wyników", async () => {
    externalSearchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);

    const { result } = renderHook(() => useLecturerExternalSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("ustawia puste wyniki przy błędzie API", async () => {
    externalSearchLecturers.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLecturerExternalSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
    });
  });

  test("ustawia loading=false przy błędzie API", async () => {
    externalSearchLecturers.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLecturerExternalSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("czyści timeout gdy component unmount", () => {
    externalSearchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);

    const { unmount } = renderHook(() => useLecturerExternalSearch("Smith"));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(externalSearchLecturers).not.toHaveBeenCalled();
  });

  test("czyści timeout gdy query się zmienia", () => {
    externalSearchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);

    const { rerender } = renderHook(
      ({ query }) => useLecturerExternalSearch(query),
      { initialProps: { query: "Smith" } }
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ query: "Jones" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(externalSearchLecturers).toHaveBeenCalledTimes(1);
    expect(externalSearchLecturers).toHaveBeenCalledWith("Jones");
  });

  test("obsługuje zmianę z query na pusty string", async () => {
    externalSearchLecturers.mockResolvedValue([{ id: 1, name: "Dr. Smith" }]);

    const { result, rerender } = renderHook(
      ({ query }) => useLecturerExternalSearch(query),
      { initialProps: { query: "Smith" } }
    );

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    rerender({ query: "" });

    expect(result.current.results).toEqual([]);
  });

  test("zwraca object z results i loading properties", () => {
    const { result } = renderHook(() => useLecturerExternalSearch("test"));

    expect(result.current).toHaveProperty("results");
    expect(result.current).toHaveProperty("loading");
    expect(Array.isArray(result.current.results)).toBe(true);
    expect(typeof result.current.loading).toBe("boolean");
  });

  test("obsługuje puste wyniki z API", async () => {
    externalSearchLecturers.mockResolvedValue([]);

    const { result } = renderHook(() => useLecturerExternalSearch("NoMatch"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  test("obsługuje specjalne znaki w query", async () => {
    externalSearchLecturers.mockResolvedValue([]);

    renderHook(() => useLecturerExternalSearch("Smith & Co."));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(externalSearchLecturers).toHaveBeenCalledWith("Smith & Co.");
  });

  test("obsługuje wielkie i małe litery", async () => {
    externalSearchLecturers.mockResolvedValue([]);

    renderHook(() => useLecturerExternalSearch("DoCToR"));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(externalSearchLecturers).toHaveBeenCalledWith("DoCToR");
  });
});
