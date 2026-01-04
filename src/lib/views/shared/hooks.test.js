import { renderHook, act, waitFor } from "@testing-library/react";
import {
  usePagination,
  useAsync,
  useEditableState,
} from "@/lib/views/shared/hooks";

describe("usePagination", () => {
  test("inicjalizuje z domyślnymi wartościami", () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(0);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(0);
  });

  test("inicjalizuje z podanymi wartościami", () => {
    const { result } = renderHook(() => usePagination(5, 20));
    expect(result.current.page).toBe(5);
    expect(result.current.pageSize).toBe(20);
  });

  test("aktualizuje numer strony", () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);
  });

  test("aktualizuje rozmiar strony", () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPageSize(25);
    });
    expect(result.current.pageSize).toBe(25);
  });

  test("aktualizuje całkowitą liczbę stron", () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setTotalPages(50);
    });
    expect(result.current.totalPages).toBe(50);
  });

  test("resetuje paginację do wartości początkowych", () => {
    const { result } = renderHook(() => usePagination(5, 20));
    act(() => {
      result.current.setPage(10);
      result.current.setPageSize(30);
      result.current.setTotalPages(100);
    });
    act(() => {
      result.current.resetPagination();
    });
    expect(result.current.page).toBe(5);
    expect(result.current.pageSize).toBe(20);
  });
});

describe("useAsync", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test("inicjalizuje z initialData i immediate=false", () => {
    const asyncFn = jest.fn();
    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { initialData: { id: 1 }, immediate: false })
    );
    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("nie wywołuje asyncFn przy immediate=false", () => {
    const asyncFn = jest.fn();
    renderHook(() => useAsync(asyncFn, [], { immediate: false }));
    expect(asyncFn).not.toHaveBeenCalled();
  });

  test("wywoływanie run ręcznie", async () => {
    const asyncFn = jest.fn().mockResolvedValueOnce({ id: 1 });
    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { immediate: false })
    );

    expect(result.current.loading).toBe(false);

    await act(async () => {
      result.current.run();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual({ id: 1 });
  });

  test("obsługuje błędy", async () => {
    const asyncFn = jest.fn().mockRejectedValueOnce(new Error("Test error"));
    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { immediate: false })
    );

    await act(async () => {
      result.current.run();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe("Test error");
  });

  test("obsługuje błędy bez message property", async () => {
    const asyncFn = jest.fn().mockRejectedValueOnce({});
    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { immediate: false })
    );

    await act(async () => {
      result.current.run();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe("Nieznany błąd");
  });

  test("przesyła parametry do asyncFn", async () => {
    const asyncFn = jest.fn().mockResolvedValueOnce({ result: "ok" });
    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { immediate: false })
    );

    await act(async () => {
      result.current.run("param1", "param2");
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(asyncFn).toHaveBeenCalledWith("param1", "param2");
  });

  test("wywoływuje onError callback", async () => {
    const onErrorFn = jest.fn();
    const error = new Error("Test error");
    const asyncFn = jest.fn().mockRejectedValueOnce(error);
    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { onError: onErrorFn, immediate: false })
    );

    await act(async () => {
      result.current.run();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(onErrorFn).toHaveBeenCalledWith(error);
  });

  test("czysczy błąd przy ponownym uruchomieniu", async () => {
    const asyncFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error 1"))
      .mockResolvedValueOnce({ data: "success" });

    const { result } = renderHook(() =>
      useAsync(asyncFn, [], { immediate: false })
    );

    await act(async () => {
      result.current.run();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe("Error 1");

    await act(async () => {
      result.current.run();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual({ data: "success" });
  });
});

describe("useEditableState", () => {
  test("inicjalizuje z initialState", () => {
    const initialState = { name: "Test", age: 25 };
    const { result } = renderHook(() => useEditableState(initialState));

    expect(result.current.state).toEqual(initialState);
    expect(result.current.editing).toBe(false);
  });

  test("startEdit ustawia editing na true", () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.startEdit();
    });

    expect(result.current.editing).toBe(true);
  });

  test("startEdit tworzy snapshot stanu", () => {
    const initialState = { name: "Test", age: 25 };
    const { result } = renderHook(() => useEditableState(initialState));

    act(() => {
      result.current.startEdit();
      result.current.setState({ name: "Changed", age: 30 });
    });

    expect(result.current.state).toEqual({ name: "Changed", age: 30 });

    act(() => {
      result.current.cancelEdit();
    });

    expect(result.current.state).toEqual(initialState);
  });

  test("cancelEdit przywraca snapshot", () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.startEdit();
    });

    act(() => {
      result.current.setState({ name: "Changed", age: 30 });
    });

    expect(result.current.state).toEqual({ name: "Changed", age: 30 });

    act(() => {
      result.current.cancelEdit();
    });

    expect(result.current.state).toEqual({ name: "Test", age: 25 });
    expect(result.current.editing).toBe(false);
  });

  test("saveWith wykonuje funkcję i aktualizuje stan", async () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.startEdit();
      result.current.setState({ name: "Updated", age: 26 });
    });

    const saveFn = jest.fn((current) =>
      Promise.resolve({ name: current.name + "_saved" })
    );

    await act(async () => {
      await result.current.saveWith(saveFn);
    });

    expect(saveFn).toHaveBeenCalledWith({ name: "Updated", age: 26 });
    expect(result.current.state).toEqual({ name: "Updated_saved", age: 26 });
    expect(result.current.editing).toBe(false);
  });

  test("saveWith ustawia formLoading na true podczas wykonania", async () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.startEdit();
    });

    const saveFn = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Updated" }), 10)
        )
    );

    let promise;
    act(() => {
      promise = result.current.saveWith(saveFn);
    });
    expect(result.current.formLoading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.formLoading).toBe(false);
  });

  test("saveWith przywraca snapshot przy błędzie", async () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.startEdit();
      result.current.setState({ name: "Updated", age: 26 });
    });

    const saveFn = jest.fn().mockRejectedValueOnce(new Error("Save failed"));

    await act(async () => {
      try {
        await result.current.saveWith(saveFn);
      } catch (error) {
        expect(error.message).toBe("Save failed");
      }
    });

    expect(result.current.state).toEqual({ name: "Test", age: 25 });
  });

  test("saveWith czysczy snapshot przy sukcesie", async () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.startEdit();
    });

    const saveFn = jest.fn().mockResolvedValueOnce({ name: "Saved" });

    await act(async () => {
      await result.current.saveWith(saveFn);
    });

    expect(result.current.editing).toBe(false);
  });

  test("setState aktualizuje stan", () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.setState({ name: "Updated", age: 30 });
    });

    expect(result.current.state).toEqual({ name: "Updated", age: 30 });
  });

  test("setFormLoading aktualizuje formLoading", () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.setFormLoading(true);
    });

    expect(result.current.formLoading).toBe(true);
  });

  test("obsługuje setState jako callback", () => {
    const { result } = renderHook(() =>
      useEditableState({ name: "Test", age: 25 })
    );

    act(() => {
      result.current.setState((prev) => ({ ...prev, age: prev.age + 1 }));
    });

    expect(result.current.state).toEqual({ name: "Test", age: 26 });
  });
});
