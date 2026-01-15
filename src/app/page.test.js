import HomePage from "@/app/page";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("HomePage", () => {
  test("redirects to /dashboard when jwt cookie exists", async () => {
    cookies.mockResolvedValue({
      get: () => ({ value: "token" }),
    });

    await HomePage();

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  test("redirects to /login when jwt cookie is missing", async () => {
    cookies.mockResolvedValue({
      get: () => undefined,
    });

    await HomePage();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
