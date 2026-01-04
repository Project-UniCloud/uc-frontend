import { showSuccessToast, showErrorToast } from "./Toast";
import { toast, Bounce } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Bounce: "Bounce",
}));

describe("Toast", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("showSuccessToast wywołuje toast.success", () => {
    showSuccessToast("Success!");
    expect(toast.success).toHaveBeenCalled();
  });

  it("showSuccessToast wyświetla domyślny tekst", () => {
    showSuccessToast();
    expect(toast.success).toHaveBeenCalledWith(
      "Operacja zakończona sukcesem!",
      expect.any(Object)
    );
  });

  it("showSuccessToast wyświetla custom tekst", () => {
    showSuccessToast("Zapisano!");
    expect(toast.success).toHaveBeenCalledWith("Zapisano!", expect.any(Object));
  });

  it("showSuccessToast ustawia position top-right", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ position: "top-right" })
    );
  });

  it("showSuccessToast ustawia autoClose 5000", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ autoClose: 5000 })
    );
  });

  it("showSuccessToast ustawia hideProgressBar false", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ hideProgressBar: false })
    );
  });

  it("showSuccessToast ustawia closeOnClick false", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ closeOnClick: false })
    );
  });

  it("showSuccessToast ustawia pauseOnHover true", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ pauseOnHover: true })
    );
  });

  it("showSuccessToast ustawia draggable true", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ draggable: true })
    );
  });

  it("showSuccessToast ustawia theme light", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ theme: "light" })
    );
  });

  it("showSuccessToast ustawia transition Bounce", () => {
    showSuccessToast("Test");
    expect(toast.success).toHaveBeenCalledWith(
      "Test",
      expect.objectContaining({ transition: Bounce })
    );
  });

  it("showErrorToast wywołuje toast.error", () => {
    showErrorToast("Error!");
    expect(toast.error).toHaveBeenCalled();
  });

  it("showErrorToast wyświetla domyślny tekst", () => {
    showErrorToast();
    expect(toast.error).toHaveBeenCalledWith(
      "Coś poszło nie tak:(",
      expect.any(Object)
    );
  });

  it("showErrorToast wyświetla custom tekst", () => {
    showErrorToast("Błąd połączenia!");
    expect(toast.error).toHaveBeenCalledWith(
      "Błąd połączenia!",
      expect.any(Object)
    );
  });

  it("showErrorToast ustawia position top-right", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ position: "top-right" })
    );
  });

  it("showErrorToast ustawia autoClose 5000", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ autoClose: 5000 })
    );
  });

  it("showErrorToast ustawia hideProgressBar false", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ hideProgressBar: false })
    );
  });

  it("showErrorToast ustawia closeOnClick false", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ closeOnClick: false })
    );
  });

  it("showErrorToast ustawia pauseOnHover true", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ pauseOnHover: true })
    );
  });

  it("showErrorToast ustawia draggable true", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ draggable: true })
    );
  });

  it("showErrorToast ustawia theme light", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ theme: "light" })
    );
  });

  it("showErrorToast ustawia transition Bounce", () => {
    showErrorToast("Error");
    expect(toast.error).toHaveBeenCalledWith(
      "Error",
      expect.objectContaining({ transition: Bounce })
    );
  });
});
