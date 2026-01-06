import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Buttons";

jest.mock("./Hint", () => {
  return function MockHint({ hint }) {
    return hint ? <span data-testid="hint">{hint}</span> : null;
  };
});

describe("Button", () => {
  it("renderuje children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("wywołuje onClick po kliknięciu", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("nie wywołuje onClick gdy disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("wyświetla label gdy podany", () => {
    render(<Button label="Username">Submit</Button>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("nie wyświetla label gdy nie podany", () => {
    const { container } = render(<Button>Submit</Button>);
    const labelSpan = container.querySelector(".text-sm.font-medium");
    expect(labelSpan).not.toBeInTheDocument();
  });

  it("renderuje komponent Hint z hint prop", () => {
    render(
      <Button label="Field" hint="This is a hint">
        Submit
      </Button>
    );
    expect(screen.getByTestId("hint")).toHaveTextContent("This is a hint");
  });

  it("nie renderuje Hint gdy brak hint prop", () => {
    render(<Button>Submit</Button>);
    expect(screen.queryByTestId("hint")).not.toBeInTheDocument();
  });

  it("ma type=button domyślnie", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("akceptuje custom type", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("jest wyłączony gdy disabled=true", () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("jest aktywny gdy disabled=false", () => {
    render(<Button disabled={false}>Click</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("stosuje domyślne kolory", () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-purple");
    expect(button).toHaveClass("text-white");
  });

  it("akceptuje custom color", () => {
    render(<Button color="bg-red">Click</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red");
  });

  it("akceptuje custom textColor", () => {
    render(<Button textColor="text-black">Click</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-black");
  });

  it("stosuje opacity-50 i cursor-not-allowed gdy disabled", () => {
    render(<Button disabled>Click</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("opacity-50");
    expect(button).toHaveClass("cursor-not-allowed");
  });

  it("stosuje hover:opacity-70 i cursor-pointer gdy aktywny", () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:opacity-70");
    expect(button).toHaveClass("cursor-pointer");
  });

  it("przekazuje dodatkowe props do button", () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom">
        Click
      </Button>
    );
    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom");
  });

  it("renderuje label i hint razem gdy oba podane", () => {
    render(
      <Button label="Field" hint="Help text">
        Submit
      </Button>
    );
    expect(screen.getByText("Field")).toBeInTheDocument();
    expect(screen.getByTestId("hint")).toBeInTheDocument();
  });

  it("stosuje wszystkie podstawowe klasy", () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-sm");
    expect(button).toHaveClass("font-semibold");
    expect(button).toHaveClass("px-4");
    expect(button).toHaveClass("py-2");
    expect(button).toHaveClass("rounded-lg");
  });

  it("nie ma label span gdy label nie podany", () => {
    const { container } = render(<Button>Submit</Button>);
    expect(
      container.querySelector(".flex.items-center.gap-2.mb-1")
    ).toBeInTheDocument();
  });
});
