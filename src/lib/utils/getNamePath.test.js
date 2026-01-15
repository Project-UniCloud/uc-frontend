import { useNamePath } from "./getNamePath";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("getNamePath", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("zwraca Przegląd dla /dashboard", () => {
    usePathname.mockReturnValue("/dashboard");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Przegląd");
  });

  test("zwraca Grupy dla /groups", () => {
    usePathname.mockReturnValue("/groups");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Grupy");
  });

  test("zwraca Finanse dla /finances", () => {
    usePathname.mockReturnValue("/finances");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Finanse");
  });

  test("zwraca Powiadomienia dla /notifications", () => {
    usePathname.mockReturnValue("/notifications");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Powiadomienia");
  });

  test("zwraca Prowadzący dla /list-lecturers", () => {
    usePathname.mockReturnValue("/list-lecturers");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Prowadzący");
  });

  test("zwraca Sterowniki dla /drivers", () => {
    usePathname.mockReturnValue("/drivers");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Sterowniki");
  });

  test("zwraca Ustawienia dla /settings", () => {
    usePathname.mockReturnValue("/settings");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Ustawienia");
  });

  test("zwraca Profil dla /profile", () => {
    usePathname.mockReturnValue("/profile");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Profil");
  });

  test("zwraca Logi dla /logs", () => {
    usePathname.mockReturnValue("/logs");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Logi");
  });

  test("zwraca Informacje o grupie dla /groups/[uuid]", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    usePathname.mockReturnValue(`/groups/${uuid}`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Informacje o grupie");
  });

  test("zwraca Informacje o zasobie dla /groups/[uuid]/resources/[uuid]", () => {
    const groupId = "123e4567-e89b-12d3-a456-426614174000";
    const resourceId = "223e4567-e89b-12d3-a456-426614174000";
    usePathname.mockReturnValue(`/groups/${groupId}/resources/${resourceId}`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Informacje o zasobie");
  });

  test("zwraca Informacje o studencie dla /groups/[uuid]/students/[uuid]", () => {
    const groupId = "123e4567-e89b-12d3-a456-426614174000";
    const studentId = "223e4567-e89b-12d3-a456-426614174000";
    usePathname.mockReturnValue(`/groups/${groupId}/students/${studentId}`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Informacje o studencie");
  });

  test("zwraca Informacje o prowadzącym dla /list-lecturers/[uuid]", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    usePathname.mockReturnValue(`/list-lecturers/${uuid}`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Informacje o prowadzącym");
  });

  test("zwraca Informacje o sterowniku dla /drivers/[uuid]", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    usePathname.mockReturnValue(`/drivers/${uuid}`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Informacje o sterowniku");
  });

  test("obsługuje ścieżki z leading i trailing slashami", () => {
    usePathname.mockReturnValue("/dashboard/");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Przegląd");
  });

  test("zwraca pusty string dla nieznanej ścieżki", () => {
    usePathname.mockReturnValue("/unknown-page");
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("");
  });

  test("obsługuje deep nested paths dla groups/resources", () => {
    const groupId = "a23e4567-e89b-12d3-a456-426614174000";
    const resourceId = "b23e4567-e89b-12d3-a456-426614174000";
    usePathname.mockReturnValue(`/groups/${groupId}/resources/${resourceId}`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("Informacje o zasobie");
  });

  test("waliduje UUID format dla group details", () => {
    usePathname.mockReturnValue(`/groups/not-a-uuid`);
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("");
  });

  test("waliduje UUID format dla resource details", () => {
    const invalidId = "invalid-id";
    usePathname.mockReturnValue(
      `/groups/123e4567-e89b-12d3-a456-426614174000/resources/${invalidId}`
    );
    const { useNamePath: hook } = require("./getNamePath");
    const result = hook();
    expect(result).toBe("");
  });
});
