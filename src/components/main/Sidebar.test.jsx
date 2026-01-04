import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock("react-icons/fi", () => ({
  FiGrid: () => "GridIcon",
  FiUsers: () => "UsersIcon",
  FiBell: () => "BellIcon",
  FiLogOut: () => "LogoutIcon",
}));

jest.mock("react-icons/pi", () => ({
  PiChalkboardTeacherLight: () => "TeacherIcon",
  PiSlidersHorizontalLight: () => "SlidersIcon",
}));

jest.mock("react-icons/md", () => ({ MdOutlineBugReport: () => "BugIcon" }));

jest.mock("./SidebarItem", () => ({
  __esModule: true,
  default: ({ label, itemPath, onClick }) => (
    <div data-testid={`item-${label}`} onClick={onClick} data-path={itemPath}>
      {label}
    </div>
  ),
}));

jest.mock("@/components/logout/LogoutModal", () => ({
  LogoutModal: ({ isOpen, setIsOpen }) => (
    <div data-testid="logout-modal">
      {isOpen ? (
        <button onClick={() => setIsOpen(false)}>Zamknij</button>
      ) : (
        "Modal Zamknięty"
      )}
    </div>
  ),
}));

describe("Sidebar", () => {
  test("renderuje logo z poprawnym linkiem", () => {
    render(<Sidebar />);

    const logoLink = screen.getByRole("link", { name: /unicloud logo/i });
    expect(logoLink).toHaveAttribute("href", "/dashboard");

    const img = screen.getByAltText(/unicloud logo/i);
    expect(img).toHaveAttribute("src", "/logo_nobg.png");
  });

  test("renderuje wszystkie elementy nawigacji z poprawnymi ścieżkami", () => {
    render(<Sidebar />);

    const menuItems = [
      { label: "Przegląd", path: "/dashboard" },
      { label: "Grupy", path: "/groups" },
      { label: "Powiadomienia", path: "/logs" },
      { label: "Prowadzący", path: "/list-lecturers" },
      { label: "Sterowniki", path: "/drivers" },
      {
        label: "Zgłoś błąd",
        path: "https://michalluczak.atlassian.net/servicedesk/customer/portals",
      },
    ];

    menuItems.forEach(({ label, path }) => {
      const item = screen.getByTestId(`item-${label}`);
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-path", path);
    });
  });

  test("zarządza stanem LogoutModal", () => {
    render(<Sidebar />);

    expect(screen.getByText("Modal Zamknięty")).toBeInTheDocument();

    const logoutBtn = screen.getByTestId("item-Wyloguj");
    fireEvent.click(logoutBtn);

    const closeBtn = screen.getByRole("button", { name: /zamknij/i });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(screen.getByText("Modal Zamknięty")).toBeInTheDocument();
  });

  test("wyświetla nagłówek sekcji menu", () => {
    render(<Sidebar />);
    expect(screen.getByText(/menu główne/i)).toBeInTheDocument();
  });
});
