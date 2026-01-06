import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputForm from "./InputForm";

jest.mock("react-tooltip", () => ({
  Tooltip: ({ id }) => <div data-testid="tooltip" data-tooltip-id={id} />,
}));

jest.mock("react-icons/fa", () => ({
  FaQuestion: () => <span data-testid="question-icon">?</span>,
}));

describe("InputForm", () => {
  it("renderuje label", () => {
    render(<InputForm label="Username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renderuje input z placeholder", () => {
    render(<InputForm label="Email" placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("ma type text domyślnie", () => {
    render(<InputForm label="Field" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("akceptuje custom type", () => {
    render(<InputForm label="Password" type="password" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("ustawia name attribute", () => {
    render(<InputForm label="Username" name="username" />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("name", "username");
  });

  it("renderuje error message", () => {
    render(<InputForm label="Email" error="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("nie renderuje error gdy brak error prop", () => {
    const { container } = render(<InputForm label="Email" />);
    const errorElement = container.querySelector(".text-red-400");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("renderuje hint icon gdy hint podany", () => {
    render(<InputForm label="Field" hint="Help text" />);
    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
  });

  it("renderuje tooltip gdy hint podany", () => {
    render(<InputForm label="Field" hint="Help text" />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("nie renderuje hint icon gdy brak hint", () => {
    render(<InputForm label="Field" />);
    expect(screen.queryByTestId("question-icon")).not.toBeInTheDocument();
  });

  it("nie renderuje tooltip gdy brak hint", () => {
    render(<InputForm label="Field" />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("ustawia step dla type number", () => {
    render(<InputForm label="Age" type="number" step="5" />);
    const input = screen.getByLabelText("Age");
    expect(input).toHaveAttribute("step", "5");
  });

  it("ustawia min dla type number", () => {
    render(<InputForm label="Age" type="number" min="0" />);
    const input = screen.getByLabelText("Age");
    expect(input).toHaveAttribute("min", "0");
  });

  it("ustawia max dla type number", () => {
    render(<InputForm label="Age" type="number" max="100" />);
    const input = screen.getByLabelText("Age");
    expect(input).toHaveAttribute("max", "100");
  });

  it("ma domyślny step=1 dla type number", () => {
    render(<InputForm label="Count" type="number" />);
    const input = screen.getByLabelText("Count");
    expect(input).toHaveAttribute("step", "1");
  });

  it("nie ustawia step/min/max dla type text", () => {
    render(<InputForm label="Name" type="text" step="5" min="0" max="100" />);
    const input = screen.getByLabelText("Name");
    expect(input).not.toHaveAttribute("step");
    expect(input).not.toHaveAttribute("min");
    expect(input).not.toHaveAttribute("max");
  });

  it("przekazuje dodatkowe props do input", () => {
    render(
      <InputForm label="Field" data-testid="custom-input" autoComplete="off" />
    );
    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("autocomplete", "off");
  });

  it("przyjmuje wartość użytkownika", async () => {
    const user = userEvent.setup();
    render(<InputForm label="Username" />);
    const input = screen.getByLabelText("Username");

    await user.type(input, "John");
    expect(input).toHaveValue("John");
  });

  it("ustawia data-tooltip-content na hint linku", () => {
    render(<InputForm label="Field" hint="Help text" />);
    const link = screen.getByTestId("question-icon").closest("a");
    expect(link).toHaveAttribute("data-tooltip-content", "Help text");
  });

  it("ustawia data-tooltip-id na hint linku", () => {
    render(<InputForm label="Field" hint="Help text" />);
    const link = screen.getByTestId("question-icon").closest("a");
    expect(link).toHaveAttribute("data-tooltip-id");
  });

  it("renderuje input z type email", () => {
    render(<InputForm label="Email" type="email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renderuje wszystkie atrybuty number razem", () => {
    render(
      <InputForm label="Price" type="number" step="0.01" min="0" max="1000" />
    );
    const input = screen.getByLabelText("Price");
    expect(input).toHaveAttribute("step", "0.01");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "1000");
  });

  it("renderuje label z hint i error razem", () => {
    render(<InputForm label="Field" hint="Help" error="Error message" />);
    expect(screen.getByText("Field")).toBeInTheDocument();
    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });
});
