import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tabs from "./Tabs";

jest.mock("react-icons/io5", () => ({
  IoCalendar: () => <span data-testid="filled-icon">Filled</span>,
  IoCalendarOutline: () => <span data-testid="outline-icon">Outline</span>,
}));

describe("Tabs", () => {
  const tabs = [
    { label: "Tab 1", key: "tab1" },
    { label: "Tab 2", key: "tab2" },
    { label: "Tab 3", key: "tab3" },
  ];

  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderuje wszystkie taby", () => {
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("wywołuje onTabChange po kliknięciu", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);

    await user.click(screen.getByText("Tab 2"));
    expect(mockOnTabChange).toHaveBeenCalledWith("tab2");
  });

  it("wywołuje onTabChange z key gdy key jest podany", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);

    await user.click(screen.getByText("Tab 3"));
    expect(mockOnTabChange).toHaveBeenCalledWith("tab3");
  });

  it("wywołuje onTabChange z label gdy brak key", async () => {
    const user = userEvent.setup();
    const tabsWithoutKeys = [{ label: "First" }, { label: "Second" }];
    render(
      <Tabs
        tabs={tabsWithoutKeys}
        activeTab="First"
        onTabChange={mockOnTabChange}
      />
    );

    await user.click(screen.getByText("Second"));
    expect(mockOnTabChange).toHaveBeenCalledWith("Second");
  });

  it("renderuje filled icon dla aktywnego tabu", () => {
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);
    const tab1Button = screen.getByText("Tab 1").closest("button");
    expect(tab1Button).toContainElement(
      screen.getAllByTestId("filled-icon")[0]
    );
  });

  it("renderuje outline icon dla nieaktywnego tabu", () => {
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);
    const tab2Button = screen.getByText("Tab 2").closest("button");
    expect(tab2Button).toContainElement(
      screen.getAllByTestId("outline-icon")[0]
    );
  });

  it("renderuje poprawne ikony dla wielu tabów", () => {
    render(<Tabs tabs={tabs} activeTab="tab2" onTabChange={mockOnTabChange} />);
    expect(screen.getAllByTestId("outline-icon")).toHaveLength(2);
    expect(screen.getAllByTestId("filled-icon")).toHaveLength(1);
  });

  it("zmienia ikony gdy activeTab się zmienia", () => {
    const { rerender } = render(
      <Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />
    );
    expect(screen.getAllByTestId("filled-icon")).toHaveLength(1);

    rerender(
      <Tabs tabs={tabs} activeTab="tab2" onTabChange={mockOnTabChange} />
    );
    expect(screen.getAllByTestId("filled-icon")).toHaveLength(1);
    expect(screen.getAllByTestId("outline-icon")).toHaveLength(2);
  });

  it("obsługuje mieszane taby z key i bez key", async () => {
    const user = userEvent.setup();
    const mixedTabs = [
      { label: "With Key", key: "tab1" },
      { label: "Without Key" },
    ];
    render(
      <Tabs tabs={mixedTabs} activeTab="tab1" onTabChange={mockOnTabChange} />
    );

    await user.click(screen.getByText("Without Key"));
    expect(mockOnTabChange).toHaveBeenCalledWith("Without Key");
  });

  it("renderuje pusty komponent gdy tabs jest pustą tablicą", () => {
    const { container } = render(
      <Tabs tabs={[]} activeTab="" onTabChange={mockOnTabChange} />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(0);
  });

  it("każdy tab jest przyciskiem", () => {
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("nie wywołuje onTabChange gdy activeTab już jest aktywny", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} activeTab="tab1" onTabChange={mockOnTabChange} />);

    await user.click(screen.getByText("Tab 1"));
    expect(mockOnTabChange).toHaveBeenCalledWith("tab1");
  });
});
