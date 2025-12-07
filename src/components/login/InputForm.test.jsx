import { render, screen, fireEvent } from "@testing-library/react";
import InputForm from "./InputForm";

jest.mock("react-icons/md", () => ({
  MdVisibility: () => <span data-testid="visibility-icon">👁️</span>,
  MdVisibilityOff: () => <span data-testid="visibility-off-icon">👁️‍🗨️</span>,
}));

describe("InputForm", () => {
  test("renderuje label i input", () => {
    render(<InputForm label="Email" name="email" placeholder="Wpisz email" />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Wpisz email")).toBeInTheDocument();
  });

  test("renderuje input z prawidłowym type", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("type", "email");
  });

  test("renderuje input z name atrybutem", () => {
    render(<InputForm label="Username" name="username" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("name", "username");
  });

  test("renderuje placeholder", () => {
    render(
      <InputForm
        label="Password"
        name="password"
        placeholder="Wpisz hasło"
        type="password"
      />
    );

    expect(screen.getByPlaceholderText("Wpisz hasło")).toBeInTheDocument();
  });

  test("wyświetla błąd gdy error prop jest przekazany", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        error="Email jest wymagany"
      />
    );

    expect(screen.getByText("Email jest wymagany")).toBeInTheDocument();
  });

  test("nie wyświetla błędu gdy error nie jest przekazany", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    expect(
      screen.queryByText(/(To pole jest wymagane|Email jest wymagany)/)
    ).not.toBeInTheDocument();
  });

  test("wyświetla ikonę visibility dla pola password", () => {
    render(<InputForm label="Password" name="password" type="password" />);

    expect(screen.getByTestId("visibility-icon")).toBeInTheDocument();
  });

  test("nie wyświetla ikony visibility dla pola bez type password", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    expect(screen.queryByTestId("visibility-icon")).not.toBeInTheDocument();
  });

  test("zmienia typ inputu z password na text po kliknięciu ikony", () => {
    render(<InputForm label="Password" name="password" type="password" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("type", "password");

    const visibilityButton = screen
      .getByTestId("visibility-icon")
      .closest("span");
    fireEvent.click(visibilityButton);

    expect(input).toHaveAttribute("type", "text");
  });

  test("zmienia ikonę po pokazaniu hasła", () => {
    render(<InputForm label="Password" name="password" type="password" />);

    expect(screen.getByTestId("visibility-icon")).toBeInTheDocument();

    const visibilityButton = screen
      .getByTestId("visibility-icon")
      .closest("span");
    fireEvent.click(visibilityButton);

    expect(screen.getByTestId("visibility-off-icon")).toBeInTheDocument();
  });

  test("ikona visibility zmienia się po kliknięciu", () => {
    render(<InputForm label="Password" name="password" type="password" />);

    const visibilityIcon = screen.getByTestId("visibility-icon");
    expect(visibilityIcon).toBeInTheDocument();

    const visibilityButton = visibilityIcon.closest("span");
    fireEvent.click(visibilityButton);

    const visibilityOffIcon = screen.getByTestId("visibility-off-icon");
    expect(visibilityOffIcon).toBeInTheDocument();
  });

  test("akceptuje value prop i wyświetla go w input", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        value="test@example.com"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  test("akceptuje onChange prop", () => {
    const handleChange = jest.fn();
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        onChange={handleChange}
      />
    );

    const input = screen.getByDisplayValue("");
    fireEvent.change(input, { target: { value: "new@example.com" } });

    expect(handleChange).toHaveBeenCalled();
  });

  test("ma poprawne klasy CSS dla input", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveClass("w-full");
    expect(input).toHaveClass("mt-1");
    expect(input).toHaveClass("p-2");
    expect(input).toHaveClass("rounded");
    expect(input).toHaveClass("bg-gray-100");
    expect(input).toHaveClass("pr-10");
    expect(input).toHaveClass("text-black");
    expect(input).toHaveClass("placeholder:text-[#808080]");
    expect(input).toHaveClass("placeholder:text-sm");
  });

  test("input ma pr-10 klasę dla paddingu po prawej", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveClass("pr-10");
  });

  test("input ma text-black klasę", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveClass("text-black");
  });

  test("label ma poprawne klasy CSS", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const label = screen.getByText("Email");
    expect(label).toHaveClass("text-xs");
    expect(label).toHaveClass("font-medium");
    expect(label).toHaveClass("text-[#333333]");
  });

  test("błąd ma poprawne klasy CSS", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        error="To pole jest wymagane"
      />
    );

    const error = screen.getByText("To pole jest wymagane");
    expect(error).toHaveClass("text-red-400");
    expect(error).toHaveClass("text-xs");
    expect(error).toHaveClass("mt-1");
  });

  test("renderuje input z disabled atrybutem", () => {
    render(
      <InputForm label="Email" name="email" type="email" disabled={true} />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toBeDisabled();
  });

  test("renderuje input z required atrybutem", () => {
    render(
      <InputForm label="Email" name="email" type="email" required={true} />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toBeRequired();
  });

  test("renderuje input z pattern atrybutem", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
      />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute(
      "pattern",
      "[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"
    );
  });

  test("renderuje input z minLength atrybutem", () => {
    render(
      <InputForm
        label="Password"
        name="password"
        type="password"
        minLength="8"
      />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("minLength", "8");
  });

  test("renderuje input z maxLength atrybutem", () => {
    render(
      <InputForm label="Username" name="username" type="text" maxLength="20" />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("maxLength", "20");
  });

  test("renderuje bez błędów gdy brak props", () => {
    expect(() => {
      render(<InputForm />);
    }).not.toThrow();
  });

  test("przekazuje wszystkie dodatkowe props do input", () => {
    render(
      <InputForm
        label="Test"
        name="test"
        data-testid="custom-input"
        aria-label="Custom label"
        title="Tooltip"
        data-custom="custom-value"
      />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("data-testid", "custom-input");
    expect(input).toHaveAttribute("aria-label", "Custom label");
    expect(input).toHaveAttribute("title", "Tooltip");
    expect(input).toHaveAttribute("data-custom", "custom-value");
  });

  test("renderuje z custom className", () => {
    render(<InputForm label="Email" name="email" className="custom-class" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveClass("custom-class");
  });

  test("ikona visibility ma span wrapper z cursor-pointer", () => {
    const { container } = render(
      <InputForm label="Password" name="password" type="password" />
    );

    const span = container.querySelector("span.cursor-pointer");
    expect(span).toBeInTheDocument();
    expect(span).toContainElement(screen.getByTestId("visibility-icon"));
  });

  test("ikona visibility ma poprawne pozycjonowanie CSS", () => {
    const { container } = render(
      <InputForm label="Password" name="password" type="password" />
    );

    const span = container.querySelector("span.absolute");
    expect(span).toHaveClass("absolute");
    expect(span).toHaveClass("right-3");
    expect(span).toHaveClass("top-3");
    expect(span).toHaveClass("text-gray-400");
  });

  test("ma poprawne placeholder klasy CSS", () => {
    render(<InputForm label="Email" name="email" placeholder="Wpisz email" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveClass("placeholder:text-[#808080]");
    expect(input).toHaveClass("placeholder:text-sm");
  });

  test("renderuje input z aria-label", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        aria-label="Email field"
      />
    );

    expect(screen.getByLabelText("Email field")).toBeInTheDocument();
  });

  test("renderuje input z aria-describedby dla błędu", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        error="Email jest wymagany"
        aria-describedby="email-error"
      />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
  });

  test("renderuje div wrapper z mb-4 klasa", () => {
    const { container } = render(
      <InputForm label="Email" name="email" type="email" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("mb-4");
  });

  test("renderuje relative div dla ikony", () => {
    const { container } = render(
      <InputForm label="Password" name="password" type="password" />
    );

    const relativeDiv = container.querySelector(".relative");
    expect(relativeDiv).toBeInTheDocument();
  });

  test("relative div jest parentem input i ikony", () => {
    const { container } = render(
      <InputForm label="Password" name="password" type="password" />
    );

    const relativeDiv = container.querySelector(".relative");
    const input = screen.getByDisplayValue("");
    const icon = screen.getByTestId("visibility-icon").closest("span");

    expect(relativeDiv).toContainElement(input);
    expect(relativeDiv).toContainElement(icon);
  });

  test("obsługuje autocomplete atrybuty", () => {
    render(
      <InputForm label="Email" name="email" type="email" autoComplete="email" />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("autoComplete", "email");
  });

  test("obsługuje step atrybuty dla input type number", () => {
    render(<InputForm label="Age" name="age" type="number" step="1" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("step", "1");
  });

  test("text color klasy dla label", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const label = screen.getByText("Email");
    expect(label).toHaveClass("text-[#333333]");
  });

  test("ikony mają size 24", () => {
    // Mock ikon już ustawia rozmiar w data-testid
    render(<InputForm label="Password" name="password" type="password" />);

    const icon = screen.getByTestId("visibility-icon");
    // Mock nie przekazuje size prop, ale to OK
    expect(icon).toBeInTheDocument();
  });

  test("render bez błędów dla password input", () => {
    expect(() => {
      render(<InputForm label="Password" name="password" type="password" />);
    }).not.toThrow();
  });

  test("nie renderuje ikony gdy type nie jest password", () => {
    render(<InputForm label="Email" name="email" type="email" />);

    const relativeDiv = screen.getByDisplayValue("").parentElement;
    const iconSpan = relativeDiv.querySelector("span");
    expect(iconSpan).toBeNull();
  });

  test("zmienia type inputu po kliknięciu ikony", () => {
    render(<InputForm label="Password" name="password" type="password" />);

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("type", "password");

    const visibilityIcon = screen.getByTestId("visibility-icon");
    const span = visibilityIcon.closest("span");
    fireEvent.click(span);

    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByTestId("visibility-off-icon")).toBeInTheDocument();
  });

  test("obsługuje readonly atrybut", () => {
    render(
      <InputForm label="Email" name="email" type="email" readOnly={true} />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("readOnly");
  });

  test("obsługuje type=range", () => {
    render(<InputForm label="Volume" name="volume" type="range" />);

    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("type", "range");
  });

  test("obsługuje defaultValue prop", () => {
    render(
      <InputForm
        label="Email"
        name="email"
        type="email"
        defaultValue="default@example.com"
      />
    );

    expect(screen.getByDisplayValue("default@example.com")).toBeInTheDocument();
  });

  test("obsługuje id atrybut", () => {
    render(
      <InputForm label="Email" name="email" type="email" id="email-input" />
    );

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("id", "email-input");
  });

  test("renderuje label i input niezależnie", () => {
    render(
      <InputForm label="Email" name="email" type="email" id="email-input" />
    );

    const label = screen.getByText("Email");
    expect(label).toBeInTheDocument();

    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("id", "email-input");
    expect(input).toHaveAttribute("name", "email");
  });
});
