import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { useNamePath } from "@/lib/utils/getNamePath";

jest.mock("@/lib/utils/getNamePath");

jest.mock("react-icons/fi", () => ({
  FiArrowLeft: () => <span aria-label="back-arrow">←</span>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNamePath.mockReturnValue("Dashboard");
  });

  test("renderuje nazwę strony pobraną z hooka", () => {
    useNamePath.mockReturnValue("Moje Grupy");
    render(<Navbar />);

    expect(screen.getByText("Moje Grupy")).toBeInTheDocument();
  });

  test("zarządza wyświetlaniem strzałki powrotu w zależności od propsa back", () => {
    const { rerender } = render(<Navbar back={true} />);
    expect(screen.getByLabelText("back-arrow")).toBeInTheDocument();

    rerender(<Navbar back={false} />);
    expect(screen.queryByLabelText("back-arrow")).not.toBeInTheDocument();
  });

  test("renderuje bez błędu gdy hook zwraca null", () => {
    useNamePath.mockReturnValue(null);

    expect(() => render(<Navbar />)).not.toThrow();
  });

  test("renderuje bez błędu gdy hook zwraca pustą wartość", () => {
    useNamePath.mockReturnValue("");

    expect(() => render(<Navbar />)).not.toThrow();
  });
});
