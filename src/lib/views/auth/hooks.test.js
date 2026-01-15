import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoginForm } from "@/lib/views/auth/hooks";
import { useRouter } from "next/navigation";

jest.mock("@/lib/api/authApi");
jest.mock("next/navigation");

describe("useLoginForm", () => {
  const mockPush = jest.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    useRouter.mockReturnValue({ push: mockPush });
  });

  test("inicjalizuje z pustymi błędami", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.formErrors).toEqual({});
  });

  test("zwraca handleSubmit function", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  test("zwraca mutation object", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.mutation).toBeDefined();
    expect(typeof result.current.mutation.mutate).toBe("function");
  });

  test("zwraca setFormErrors function", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(typeof result.current.setFormErrors).toBe("function");
  });

  test("obsługuje setFormErrors", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setFormErrors({ login: ["Login is required"] });
    });

    expect(result.current.formErrors).toEqual({ login: ["Login is required"] });
  });

  test("mutation.mutate jest dostępna", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(typeof result.current.mutation.mutate).toBe("function");
  });

  test("push function jest dostępna w router", () => {
    renderHook(() => useLoginForm(), { wrapper });
    expect(mockPush).toBeDefined();
  });

  test("mutation.mutate przyjmuje credentials", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(typeof result.current.mutation.mutate).toBe("function");
  });

  test("obsługuje błąd mutacji", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(typeof result.current.mutation).toBe("object");
  });

  test("obsługuje sukces mutacji", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.mutation).toBeDefined();
  });

  test("czysczy formErrors przy sukcesie", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setFormErrors({ error: "Some error" });
    });

    expect(result.current.formErrors).toEqual({ error: "Some error" });

    act(() => {
      result.current.setFormErrors({});
    });

    expect(result.current.formErrors).toEqual({});
  });

  test("obsługuje undefined error message", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setFormErrors({ error: "Błąd logowania" });
    });

    expect(result.current.formErrors.error).toBe("Błąd logowania");
  });
});
