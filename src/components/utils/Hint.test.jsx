import React from "react";
import { render, screen } from "@testing-library/react";
import Hint from "./Hint";

jest.mock("react-tooltip", () => ({
  Tooltip: ({ id, children }) => (
    <div data-testid="tooltip" data-tooltip-id={id}>
      {children}
    </div>
  ),
}));

jest.mock("react-icons/fa", () => ({
  FaQuestion: () => <span data-testid="question-icon">?</span>,
}));

describe("Hint", () => {
  it("renderuje ikonę gdy hint jest podany", () => {
    render(<Hint hint="This is a hint" />);
    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
  });

  it("renderuje Tooltip gdy hint jest podany", () => {
    render(<Hint hint="This is a hint" />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("nie renderuje ikony gdy hint jest pusty", () => {
    render(<Hint hint="" />);
    expect(screen.queryByTestId("question-icon")).not.toBeInTheDocument();
  });

  it("nie renderuje Tooltip gdy hint jest pusty", () => {
    render(<Hint hint="" />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("nie renderuje niczego gdy hint nie jest podany", () => {
    render(<Hint />);
    expect(screen.queryByTestId("question-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("ustawia data-tooltip-content na linku", () => {
    render(<Hint hint="Help text" />);
    const link = screen.getByTestId("question-icon").closest("a");
    expect(link).toHaveAttribute("data-tooltip-content", "Help text");
  });

  it("ustawia data-tooltip-id na linku", () => {
    render(<Hint hint="Help text" />);
    const link = screen.getByTestId("question-icon").closest("a");
    expect(link).toHaveAttribute("data-tooltip-id");
  });

  it("generuje unikalne ID dla każdej instancji", () => {
    const { rerender } = render(<Hint hint="First" />);
    const firstLink = screen.getByTestId("question-icon").closest("a");
    const firstId = firstLink.getAttribute("data-tooltip-id");

    rerender(<Hint hint="Second" />);
    const secondLink = screen.getByTestId("question-icon").closest("a");
    const secondId = secondLink.getAttribute("data-tooltip-id");

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
  });

  it("renderuje link z ikoną", () => {
    render(<Hint hint="Tooltip text" />);
    const link = screen.getByTestId("question-icon").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toContainElement(screen.getByTestId("question-icon"));
  });
});
