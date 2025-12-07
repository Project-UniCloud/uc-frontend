import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    const { fill, priority, objectFit, ...restProps } = props;
    return <img {...restProps} alt={props.alt} />;
  },
}));

jest.mock("@/components/login/LoginForm", () => ({
  __esModule: true,
  default: () => <form data-testid="login-form">Mocked LoginForm</form>,
}));

describe("LoginPage", () => {
  test("renderuje stronę logowania", () => {
    render(<LoginPage />);

    expect(screen.getByText("Miło Cię znowu widzieć!")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  test("wyświetla logo", () => {
    render(<LoginPage />);

    const logo = screen.getByAltText("Unicloud Logo");
    expect(logo).toBeInTheDocument();
  });

  test("wyświetla obraz budynku na desktopie", () => {
    render(<LoginPage />);

    const buildingImage = screen.getByAltText("Building");
    expect(buildingImage).toBeInTheDocument();
  });

  test("wyświetla copyright", () => {
    render(<LoginPage />);

    expect(screen.getByText("© Unicloud 2025")).toBeInTheDocument();
  });

  test("ma odpowiednią strukturę layoutu", () => {
    render(<LoginPage />);

    const container = screen
      .getByText("Miło Cię znowu widzieć!")
      .closest("div");
    expect(container).toHaveClass("max-w-sm");
    expect(container).toHaveClass("w-full");
  });
});
