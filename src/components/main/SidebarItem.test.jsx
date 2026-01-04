import { render, screen } from "@testing-library/react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("SidebarItem", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/dashboard");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderuje ikonę i label", () => {
    render(
      <SidebarItem
        icon={<span>🏠</span>}
        label="Dashboard"
        itemPath="/dashboard"
      />
    );

    expect(screen.getByText("🏠")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renderuje button bez linka gdy brak itemPath", () => {
    render(<SidebarItem icon={<span>📄</span>} label="Action" />);

    const button = screen.getByRole("button", { name: /action/i });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  test("renderuje link wewnętrzny dla ścieżki nie zaczynającej się od http", () => {
    render(
      <SidebarItem icon={<span>👥</span>} label="Users" itemPath="/users" />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/users");
  });

  test("renderuje link zewnętrzny z target blank dla URL zaczynającego się od http", () => {
    render(
      <SidebarItem
        icon={<span>🐛</span>}
        label="Report Bug"
        itemPath="https://example.com/bug"
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/bug");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("button jest disabled gdy prop disabled=true", () => {
    render(
      <SidebarItem icon={<span>⚙️</span>} label="Settings" disabled={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("button nie jest disabled domyślnie", () => {
    render(
      <SidebarItem icon={<span>📊</span>} label="Stats" itemPath="/stats" />
    );

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  test("przekazuje dodatkowe propsy do buttona", () => {
    const handleClick = jest.fn();

    render(
      <SidebarItem
        icon={<span>🚪</span>}
        label="Logout"
        onClick={handleClick}
        data-testid="logout-item"
      />
    );

    const button = screen.getByTestId("logout-item");
    expect(button).toBeInTheDocument();

    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("element jest aktywny gdy pathname pasuje do itemPath", () => {
    usePathname.mockReturnValue("/groups");

    const { container } = render(
      <SidebarItem icon={<span>👥</span>} label="Groups" itemPath="/groups" />
    );

    const button = container.querySelector("button");
    expect(button.className).toContain("bg-white");
    expect(button.className).toContain("text-black");
  });

  test("element nie jest aktywny gdy pathname nie pasuje", () => {
    usePathname.mockReturnValue("/dashboard");

    const { container } = render(
      <SidebarItem icon={<span>👥</span>} label="Groups" itemPath="/groups" />
    );

    const button = container.querySelector("button");
    expect(button.className).not.toContain("shadow-md");
  });

  test("renderuje różne ikony dla różnych elementów", () => {
    const { rerender } = render(
      <SidebarItem icon={<span data-testid="icon-1">A</span>} label="Item 1" />
    );

    expect(screen.getByTestId("icon-1")).toBeInTheDocument();

    rerender(
      <SidebarItem icon={<span data-testid="icon-2">B</span>} label="Item 2" />
    );

    expect(screen.getByTestId("icon-2")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-1")).not.toBeInTheDocument();
  });
});
