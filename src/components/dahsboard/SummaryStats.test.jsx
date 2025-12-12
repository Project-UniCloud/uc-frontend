import { render, screen } from "@testing-library/react";
import SummaryStats from "./SummaryStats";

describe("SummaryStats", () => {
  const mockStats = {
    overallCostFromActiveGroups: 2560,
    allActiveResourcesCount: 10,
    averageActiveGroupCost: 250.24,
  };

  test("renderuje nagłówek sekcji", () => {
    render(<SummaryStats stats={mockStats} />);

    expect(screen.getByText("Kluczowe statyski")).toBeInTheDocument();
  });

  test("wyświetla całkowity koszt bieżący", () => {
    render(<SummaryStats stats={mockStats} />);

    expect(screen.getByText("Całkowity koszt bieżący")).toBeInTheDocument();
    expect(screen.getByText("2560")).toBeInTheDocument();
  });

  test("wyświetla liczbę aktywnych zasobów", () => {
    render(<SummaryStats stats={mockStats} />);

    expect(screen.getByText("Liczba aktywnych zasobów")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("wyświetla średni koszt na grupę", () => {
    render(<SummaryStats stats={mockStats} />);

    expect(screen.getByText("Średni koszt na grupę")).toBeInTheDocument();
    expect(screen.getByText("250.24")).toBeInTheDocument();
  });

  test("używa domyślnych wartości gdy stats=null", () => {
    render(<SummaryStats stats={null} />);

    expect(screen.getByText("2560")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("250.24")).toBeInTheDocument();
  });

  test("używa domyślnych wartości gdy stats nie jest przekazany", () => {
    render(<SummaryStats />);

    expect(screen.getByText("Kluczowe statyski")).toBeInTheDocument();
    expect(screen.getByText("2560")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("250.24")).toBeInTheDocument();
  });

  test("wyświetla wartości 0 poprawnie", () => {
    const zeroStats = {
      overallCostFromActiveGroups: 0,
      allActiveResourcesCount: 0,
      averageActiveGroupCost: 0,
    };

    render(<SummaryStats stats={zeroStats} />);

    const zeroElements = screen.getAllByText("0");
    expect(zeroElements.length).toBe(3);
  });

  test("obsługuje duże liczby", () => {
    const largeStats = {
      overallCostFromActiveGroups: 999999,
      allActiveResourcesCount: 5000,
      averageActiveGroupCost: 12345.67,
    };

    render(<SummaryStats stats={largeStats} />);

    expect(screen.getByText("999999")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("12345.67")).toBeInTheDocument();
  });

  test("ma poprawne klasy CSS dla głównego kontenera", () => {
    render(<SummaryStats stats={mockStats} />);

    const container = screen.getByText("Kluczowe statyski").closest("div");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-col");
    expect(container).toHaveClass("gap-2");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("w-full");
  });

  test("nagłówek ma poprawne klasy", () => {
    render(<SummaryStats stats={mockStats} />);

    const header = screen.getByText("Kluczowe statyski");
    expect(header).toHaveClass("text-lg");
    expect(header).toHaveClass("font-semibold");
    expect(header).toHaveClass("mb-4");
  });

  test("wszystkie karty statystyk mają poprawne klasy", () => {
    render(<SummaryStats stats={mockStats} />);

    const cards = screen
      .getAllByText(/koszt|zasobów|grupę/)
      .map((el) => el.closest(".p-4"));

    cards.forEach((card) => {
      expect(card).toHaveClass("p-4");
      expect(card).toHaveClass("rounded-md");
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("shadow-sm");
      expect(card).toHaveClass("w-1/2");
    });
  });

  test("etykiety mają poprawne klasy CSS", () => {
    render(<SummaryStats stats={mockStats} />);

    const labels = [
      "Całkowity koszt bieżący",
      "Liczba aktywnych zasobów",
      "Średni koszt na grupę",
    ];

    labels.forEach((label) => {
      const element = screen.getByText(label);
      expect(element).toHaveClass("text-sm");
      expect(element).toHaveClass("text-gray-500");
    });
  });

  test("wartości statystyk mają poprawne klasy CSS", () => {
    render(<SummaryStats stats={mockStats} />);

    const valueContainers = screen.getByText("2560").closest("div.mt-2");

    expect(valueContainers).toHaveClass("mt-2");
    expect(valueContainers).toHaveClass("p-2");
    expect(valueContainers).toHaveClass("border");
    expect(valueContainers).toHaveClass("rounded");
  });

  test("renderuje wszystkie trzy sekcje statystyk", () => {
    render(<SummaryStats stats={mockStats} />);

    const sections = screen.getAllByText(/koszt|zasobów|grupę/);
    expect(sections.length).toBe(3);
  });

  test("obsługuje wartości dziesiętne", () => {
    const decimalStats = {
      overallCostFromActiveGroups: 123.45,
      allActiveResourcesCount: 7,
      averageActiveGroupCost: 98.76,
    };

    render(<SummaryStats stats={decimalStats} />);

    expect(screen.getByText("123.45")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("98.76")).toBeInTheDocument();
  });

  test("obsługuje ujemne wartości", () => {
    const negativeStats = {
      overallCostFromActiveGroups: -100,
      allActiveResourcesCount: -5,
      averageActiveGroupCost: -25.5,
    };

    render(<SummaryStats stats={negativeStats} />);

    expect(screen.getByText("-100")).toBeInTheDocument();
    expect(screen.getByText("-5")).toBeInTheDocument();
    expect(screen.getByText("-25.5")).toBeInTheDocument();
  });

  test("komponenty renderują się w odpowiedniej kolejności", () => {
    render(<SummaryStats stats={mockStats} />);

    const labels = screen.getAllByText(/koszt|zasobów|grupę/);

    expect(labels[0]).toHaveTextContent("Całkowity koszt bieżący");
    expect(labels[1]).toHaveTextContent("Liczba aktywnych zasobów");
    expect(labels[2]).toHaveTextContent("Średni koszt na grupę");
  });

  test("nie rzuca błędów przy niekompletnych danych", () => {
    const incompleteStats = {
      overallCostFromActiveGroups: 100,
    };

    expect(() => {
      render(<SummaryStats stats={incompleteStats} />);
    }).not.toThrow();
  });

  test("wyświetla dane gdy przekazano wszystkie właściwości", () => {
    const completeStats = {
      overallCostFromActiveGroups: 5000,
      allActiveResourcesCount: 25,
      averageActiveGroupCost: 200,
      extraProperty: "ignored",
    };

    render(<SummaryStats stats={completeStats} />);

    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });
});
