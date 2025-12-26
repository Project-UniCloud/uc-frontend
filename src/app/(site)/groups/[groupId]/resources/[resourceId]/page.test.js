import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupPage from "./page";
import {
  getResourceEditInfoByGroupId,
  updateResourceEditInfoByGroupId,
} from "@/lib/resourceApi";
import React from "react";

const originalUse = React.use;
React.use = jest.fn((promise) => {
  if (promise instanceof Promise) {
    let status = "pending";
    let result;
    promise.then(
      (value) => {
        status = "fulfilled";
        result = value;
      },
      (error) => {
        status = "rejected";
        result = error;
      }
    );
    if (status === "fulfilled") return result;
    if (status === "rejected") throw result;
    throw promise;
  }
  return originalUse ? originalUse(promise) : promise;
});

jest.mock("@/lib/resourceApi");

jest.mock("@/components/utils/Toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

jest.mock("@/components/utils/InputForm", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <label htmlFor={props.name}>{props.label}</label>
      <input
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        type={props.type || "text"}
        min={props.min}
        max={props.max}
        step={props.step}
        placeholder={props.placeholder}
      />
    </div>
  ),
}));

jest.mock("@/components/utils/Buttons", () => ({
  Button: (props) => (
    <button
      data-testid={props["data-testid"] || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  ),
}));

jest.mock("@/components/resources/ButtonChangeResourceStatus", () => ({
  __esModule: true,
  default: (props) => (
    <button data-testid="change-resource-status-btn">
      Zmień status zasobu
    </button>
  ),
}));

jest.mock("@/lib/utils/formatDate", () => ({
  formatDateToYYYYMMDD: jest.fn((date) => date),
  formatDateToDDMMYYYY: jest.fn((date) => date),
}));

describe("ResourceEditPage", () => {
  const mockParams = { groupId: "123", resourceId: "456" };

  beforeEach(() => {
    React.use.mockReturnValue({ groupId: "123", resourceId: "456" });

    getResourceEditInfoByGroupId.mockResolvedValue({
      id: "456",
      limit: "100",
      cron: "0 0 * * *",
      expiresAt: "2024-12-31",
      status: "Active",
      notificationLevel1: "50",
      notificationLevel2: "75",
      notificationLevel3: "90",
    });

    updateResourceEditInfoByGroupId.mockResolvedValue({
      id: "456",
      limit: "100",
      cron: "0 0 * * *",
      expiresAt: "2024-12-31",
      status: "Active",
      notificationLevel1: "50",
      notificationLevel2: "75",
      notificationLevel3: "90",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("ładuje dane zasobu i wyświetla je", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalledWith("123", "456");
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("0 0 * * *")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-12-31")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("75")).toBeInTheDocument();
    expect(screen.getByDisplayValue("90")).toBeInTheDocument();
  });

  test("wyświetla błąd gdy API zwraca błąd", async () => {
    getResourceEditInfoByGroupId.mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("pokazuje loading podczas ładowania danych", async () => {
    getResourceEditInfoByGroupId.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: "456",
                limit: "100",
                cron: "",
                expiresAt: "2024-12-31",
                status: "Active",
                notificationLevel1: "",
                notificationLevel2: "",
                notificationLevel3: "",
              }),
            100
          )
        )
    );

    render(<GroupPage params={mockParams} />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Ładowanie...")).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test("przycisk Edytuj jest widoczny po załadowaniu danych", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Edytuj")).toBeInTheDocument();
    });
  });

  test("przełącza tryb edycji po kliknięciu Edytuj", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const limitInput = screen.getByDisplayValue("100");
    expect(limitInput).not.toBeDisabled();
  });

  test("zapisuje zmiany po kliknięciu Zapisz", async () => {
    updateResourceEditInfoByGroupId.mockResolvedValue({
      id: "456",
      limit: "200",
      cron: "0 0 * * *",
      expiresAt: "2024-12-31",
      status: "Active",
      notificationLevel1: "50",
      notificationLevel2: "75",
      notificationLevel3: "90",
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const limitInput = screen.getByDisplayValue("100");
    fireEvent.change(limitInput, { target: { value: "200" } });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateResourceEditInfoByGroupId).toHaveBeenCalledWith("123", {
        id: "456",
        limit: "200",
        cron: "0 0 * * *",
        expiresAt: "2024-12-31",
        status: "Active",
        notificationLevel1: "50",
        notificationLevel2: "75",
        notificationLevel3: "90",
      });
    });
  });

  test("wyświetla toast sukcesu po zapisie", async () => {
    const { showSuccessToast } = require("@/components/utils/Toast");

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith(
        "Dane zostały zaktualizowane pomyślnie."
      );
    });
  });

  test("przywraca dane po nieudanym zapisie", async () => {
    updateResourceEditInfoByGroupId.mockRejectedValueOnce(
      new Error("Błąd zapisu")
    );

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const limitInput = screen.getByDisplayValue("100");
    fireEvent.change(limitInput, { target: { value: "200" } });

    expect(screen.getByDisplayValue("200")).toBeInTheDocument();

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });
  });

  test("wyświetla toast błędu przy nieudanym zapisie", async () => {
    const { showErrorToast } = require("@/components/utils/Toast");
    updateResourceEditInfoByGroupId.mockRejectedValueOnce(
      new Error("Błąd zapisu")
    );

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        expect.stringContaining("Błąd podczas aktualizacji danych")
      );
    });
  });

  test("wszystkie pola formularza są disabled gdy nie ma edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("100")).toBeDisabled();
    expect(screen.getByDisplayValue("0 0 * * *")).toBeDisabled();
    expect(screen.getByDisplayValue("2024-12-31")).toBeDisabled();
    expect(screen.getByDisplayValue("50")).toBeDisabled();
    expect(screen.getByDisplayValue("75")).toBeDisabled();
    expect(screen.getByDisplayValue("90")).toBeDisabled();
  });

  test("wszystkie pola formularza są enabled podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("100")).not.toBeDisabled();
    expect(screen.getByDisplayValue("0 0 * * *")).not.toBeDisabled();
    expect(screen.getByDisplayValue("2024-12-31")).not.toBeDisabled();
    expect(screen.getByDisplayValue("50")).not.toBeDisabled();
    expect(screen.getByDisplayValue("75")).not.toBeDisabled();
    expect(screen.getByDisplayValue("90")).not.toBeDisabled();
  });

  test("zmienia wartość pola limit podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const limitInput = screen.getByDisplayValue("100");
    fireEvent.change(limitInput, { target: { value: "250" } });

    expect(limitInput.value).toBe("250");
  });

  test("zmienia wartość pola cron podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const cronInput = screen.getByDisplayValue("0 0 * * *");
    fireEvent.change(cronInput, { target: { value: "0 12 * * *" } });

    expect(cronInput.value).toBe("0 12 * * *");
  });

  test("zmienia wartość daty zakończenia podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const dateInput = screen.getByDisplayValue("2024-12-31");
    fireEvent.change(dateInput, { target: { value: "2025-12-31" } });

    expect(dateInput.value).toBe("2025-12-31");
  });

  test("zmienia wartość progu powiadomień 1 podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const notif1Input = screen.getByDisplayValue("50");
    fireEvent.change(notif1Input, { target: { value: "60" } });

    expect(notif1Input.value).toBe("60");
  });

  test("zmienia wartość progu powiadomień 2 podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const notif2Input = screen.getByDisplayValue("75");
    fireEvent.change(notif2Input, { target: { value: "80" } });

    expect(notif2Input.value).toBe("80");
  });

  test("zmienia wartość progu powiadomień 3 podczas edycji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const notif3Input = screen.getByDisplayValue("90");
    fireEvent.change(notif3Input, { target: { value: "95" } });

    expect(notif3Input.value).toBe("95");
  });

  test("wyświetla przycisk zmiany statusu zasobu", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("change-resource-status-btn")
      ).toBeInTheDocument();
    });
  });

  test("przycisk Zapisz jest disabled podczas ładowania formularza", async () => {
    updateResourceEditInfoByGroupId.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ id: "456", limit: "100" }), 100)
        )
    );

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    expect(saveBtn).toBeDisabled();
  });

  test("wyświetla dane z pustymi wartościami dla opcjonalnych pól", async () => {
    getResourceEditInfoByGroupId.mockResolvedValueOnce({
      id: "456",
      limit: "100",
      cron: "",
      expiresAt: "2024-12-31",
      status: "Active",
      notificationLevel1: "",
      notificationLevel2: "",
      notificationLevel3: "",
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Czyszczenie").value).toBe("");
    expect(screen.getByLabelText("Próg powiadomień 1 (%)").value).toBe("");
    expect(screen.getByLabelText("Próg powiadomień 2 (%)").value).toBe("");
    expect(screen.getByLabelText("Próg powiadomień 3 (%)").value).toBe("");
  });

  test("wyłącza tryb edycji po udanym zapisie", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("Edytuj")).toBeInTheDocument();
    });
  });

  test("zapisuje wszystkie zmienione wartości jednocześnie", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue("100"), {
      target: { value: "300" },
    });
    fireEvent.change(screen.getByDisplayValue("0 0 * * *"), {
      target: { value: "0 6 * * *" },
    });
    fireEvent.change(screen.getByDisplayValue("50"), {
      target: { value: "40" },
    });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateResourceEditInfoByGroupId).toHaveBeenCalledWith("123", {
        id: "456",
        limit: "300",
        cron: "0 6 * * *",
        expiresAt: "2024-12-31",
        status: "Active",
        notificationLevel1: "40",
        notificationLevel2: "75",
        notificationLevel3: "90",
      });
    });
  });

  test("nie wyświetla przycisku Edytuj podczas ładowania", async () => {
    getResourceEditInfoByGroupId.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: "456",
                limit: "100",
                cron: "",
                expiresAt: "2024-12-31",
                status: "Active",
              }),
            100
          )
        )
    );

    render(<GroupPage params={mockParams} />);

    expect(screen.queryByText("Edytuj")).not.toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText("Edytuj")).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test("formatuje datę przed wysłaniem do API", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateResourceEditInfoByGroupId).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          expiresAt: "2024-12-31",
        })
      );
    });
  });

  test("czyści snapshot po udanym zapisie", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const limitInput = screen.getByDisplayValue("100");
    fireEvent.change(limitInput, { target: { value: "200" } });

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("Edytuj")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edytuj"));

    fireEvent.change(screen.getByDisplayValue("100"), {
      target: { value: "300" },
    });

    expect(screen.getByDisplayValue("300")).toBeInTheDocument();
  });

  test("pola progów powiadomień mają poprawne atrybuty walidacji", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });

    const notif1 = screen.getByLabelText("Próg powiadomień 1 (%)");
    const notif2 = screen.getByLabelText("Próg powiadomień 2 (%)");
    const notif3 = screen.getByLabelText("Próg powiadomień 3 (%)");

    expect(notif1).toHaveAttribute("type", "number");
    expect(notif1).toHaveAttribute("min", "0");
    expect(notif1).toHaveAttribute("max", "100");
    expect(notif1).toHaveAttribute("step", "1");

    expect(notif2).toHaveAttribute("type", "number");
    expect(notif2).toHaveAttribute("min", "0");
    expect(notif2).toHaveAttribute("max", "100");
    expect(notif2).toHaveAttribute("step", "1");

    expect(notif3).toHaveAttribute("type", "number");
    expect(notif3).toHaveAttribute("min", "0");
    expect(notif3).toHaveAttribute("max", "100");
    expect(notif3).toHaveAttribute("step", "1");
  });

  test("pole daty ma poprawny typ", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText("Data zakończenia");
    expect(dateInput).toHaveAttribute("type", "date");
  });

  test("akceptuje wartości progów powiadomień w zakresie 0-100", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const notif1 = screen.getByLabelText("Próg powiadomień 1 (%)");
    fireEvent.change(notif1, { target: { value: "0" } });
    expect(notif1.value).toBe("0");

    fireEvent.change(notif1, { target: { value: "100" } });
    expect(notif1.value).toBe("100");

    fireEvent.change(notif1, { target: { value: "50" } });
    expect(notif1.value).toBe("50");
  });

  test("formatuje datę z YYYY-MM-DD na DD.MM.YYYY podczas ładowania", async () => {
    const formatDate = require("@/lib/utils/formatDate");

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(formatDate.formatDateToYYYYMMDD).toHaveBeenCalledWith(
        "2024-12-31"
      );
    });
  });

  test("formatuje datę z DD.MM.YYYY na YYYY-MM-DD podczas zapisu", async () => {
    const formatDate = require("@/lib/utils/formatDate");

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(formatDate.formatDateToDDMMYYYY).toHaveBeenCalledWith(
        "2024-12-31"
      );
    });
  });

  test("przywraca wszystkie pola do wartości początkowych po błędzie zapisu", async () => {
    updateResourceEditInfoByGroupId.mockRejectedValueOnce(
      new Error("Błąd zapisu")
    );

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue("100"), {
      target: { value: "999" },
    });
    fireEvent.change(screen.getByDisplayValue("0 0 * * *"), {
      target: { value: "0 23 * * *" },
    });
    fireEvent.change(screen.getByDisplayValue("2024-12-31"), {
      target: { value: "2025-06-30" },
    });
    fireEvent.change(screen.getByDisplayValue("50"), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByDisplayValue("75"), {
      target: { value: "60" },
    });
    fireEvent.change(screen.getByDisplayValue("90"), {
      target: { value: "85" },
    });

    expect(screen.getByDisplayValue("999")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0 23 * * *")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-06-30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("60")).toBeInTheDocument();
    expect(screen.getByDisplayValue("85")).toBeInTheDocument();

    const saveBtn = screen.getByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
      expect(screen.getByDisplayValue("0 0 * * *")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-12-31")).toBeInTheDocument();
      expect(screen.getByDisplayValue("50")).toBeInTheDocument();
      expect(screen.getByDisplayValue("75")).toBeInTheDocument();
      expect(screen.getByDisplayValue("90")).toBeInTheDocument();
    });
  });

  test("wyświetla błąd i przywraca dane gdy formatowanie daty nie powiedzie się", async () => {
    const formatDate = require("@/lib/utils/formatDate");
    formatDate.formatDateToDDMMYYYY.mockImplementationOnce(() => {
      throw new Error("Invalid date format");
    });

    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const limitInput = screen.getByDisplayValue("100");
    fireEvent.change(limitInput, { target: { value: "200" } });

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });
  });

  test("pole limitu akceptuje wartości tekstowe i numeryczne", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const limitInput = screen.getByLabelText("Limit");
    expect(limitInput).toHaveAttribute("type", "text");

    fireEvent.change(limitInput, { target: { value: "500" } });
    expect(limitInput.value).toBe("500");

    fireEvent.change(limitInput, { target: { value: "unlimited" } });
    expect(limitInput.value).toBe("unlimited");
  });

  test("pole cron akceptuje wyrażenia cron", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Zapisz")).toBeInTheDocument();
    });

    const cronInput = screen.getByLabelText("Czyszczenie");
    expect(cronInput).toHaveAttribute("type", "text");

    fireEvent.change(cronInput, { target: { value: "*/5 * * * *" } });
    expect(cronInput.value).toBe("*/5 * * * *");

    fireEvent.change(cronInput, { target: { value: "0 12 * * 1-5" } });
    expect(cronInput.value).toBe("0 12 * * 1-5");
  });

  test("nie wywołuje API update gdy brak zmian w formularzu", async () => {
    render(<GroupPage params={mockParams} />);

    await waitFor(() => {
      expect(getResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    const editBtn = await screen.findByText("Edytuj");
    fireEvent.click(editBtn);

    const saveBtn = await screen.findByText("Zapisz");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateResourceEditInfoByGroupId).toHaveBeenCalled();
    });

    expect(updateResourceEditInfoByGroupId).toHaveBeenCalledWith("123", {
      id: "456",
      limit: "100",
      cron: "0 0 * * *",
      expiresAt: "2024-12-31",
      status: "Active",
      notificationLevel1: "50",
      notificationLevel2: "75",
      notificationLevel3: "90",
    });
  });
});
