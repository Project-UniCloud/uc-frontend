import { renderHook, act, waitFor } from "@testing-library/react";
import { useListLecturersPage } from "@/lib/views/list-lecturers/hook";
import { getLecturers } from "@/lib/api/lecturersApi";

jest.mock("@/lib/api/lecturersApi", () => ({
  getLecturers: jest.fn(),
}));

describe("useListLecturersPage", () => {
  test("fetches lecturers and maps uuid to id/groupId", async () => {
    getLecturers.mockResolvedValueOnce({
      page: { totalPages: 3 },
      content: [
        {
          uuid: "lec-1",
          firstName: "Jan",
          lastName: "Kowalski",
        },
      ],
    });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      expect(getLecturers).toHaveBeenCalledWith({
        searchQuery: "",
        page: 0,
        pageSize: 10,
      });
    });

    await waitFor(() => {
      expect(result.current.totalPages).toBe(3);
      expect(result.current.lecturers).toHaveLength(1);
    });

    expect(result.current.lecturers[0]).toEqual(
      expect.objectContaining({
        uuid: "lec-1",
        id: "lec-1",
        groupId: "lec-1",
        firstName: "Jan",
      })
    );
  });

  test("changing searchQuery triggers re-fetch", async () => {
    getLecturers
      .mockResolvedValueOnce({ page: { totalPages: 0 }, content: [] })
      .mockResolvedValueOnce({ page: { totalPages: 0 }, content: [] });

    const { result } = renderHook(() => useListLecturersPage());

    await waitFor(() => {
      // React 18 StrictMode / RTL can run effects more than once in tests.
      expect(getLecturers).toHaveBeenCalled();
    });

    act(() => {
      result.current.setSearchQuery("abc");
    });

    await waitFor(() => {
      expect(getLecturers).toHaveBeenCalledWith({
        searchQuery: "abc",
        page: 0,
        pageSize: 10,
      });
    });
  });
});
