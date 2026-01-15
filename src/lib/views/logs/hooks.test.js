import { renderHook, waitFor } from "@testing-library/react";
import { useLogsPage } from "@/lib/views/logs/hooks";
import { getLogs } from "@/lib/api/logsApi";

jest.mock("@/lib/api/logsApi", () => ({
  getLogs: jest.fn(),
}));

describe("useLogsPage", () => {
  test("fetches logs and maps response", async () => {
    getLogs.mockResolvedValueOnce({
      page: { totalPages: 2 },
      content: [
        {
          id: "log-1",
          occurredAt: null,
          action: "CREATE",
          actor: "admin",
          details: { groupId: "g-1", resourceId: "r-1" },
        },
      ],
    });

    const { result } = renderHook(() => useLogsPage());

    await waitFor(() => {
      expect(getLogs).toHaveBeenCalled();
    });

    expect(getLogs).toHaveBeenCalledWith({ page: 0, pageSize: 10 });

    await waitFor(() => {
      expect(result.current.totalPages).toBe(2);
      expect(result.current.logs).toHaveLength(1);
    });

    expect(result.current.logs[0]).toEqual(
      expect.objectContaining({
        id: "log-1",
        date: "-",
        action: "CREATE",
        actor: "admin",
        groupId: "g-1",
        details: expect.stringContaining("groupId: g-1"),
      })
    );
  });
});
