import { renderHook } from "@testing-library/react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles } from "@/contexts/RolesContext";

jest.mock("@/contexts/RolesContext", () => ({
  useRoles: jest.fn(),
}));

describe("usePermissions", () => {
  test("parses roles from context (dash-separated)", () => {
    useRoles.mockReturnValue("ADMIN-LECTURER");

    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRoles).toEqual(["ADMIN", "LECTURER"]);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isLecturer).toBe(true);
    expect(result.current.isStudent).toBe(false);
  });

  test("rolesFromProp overrides context", () => {
    useRoles.mockReturnValue("ADMIN");

    const { result } = renderHook(() => usePermissions("STUDENT"));

    expect(result.current.userRoles).toEqual(["STUDENT"]);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isStudent).toBe(true);
  });

  test("checkAccess returns false when no roles", () => {
    useRoles.mockReturnValue(null);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.checkAccess(["ADMIN"])).toBe(false);
  });

  test("checkAccess returns true for allowed role", () => {
    useRoles.mockReturnValue("LECTURER");

    const { result } = renderHook(() => usePermissions());

    expect(result.current.checkAccess(["ADMIN", "LECTURER"])).toBe(true);
    expect(result.current.checkAccess(["ADMIN"])).toBe(false);
  });
});
