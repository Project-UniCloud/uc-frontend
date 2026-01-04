import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from "./formatDate";

describe("formatDate", () => {
  test("formatDateToDDMMYYYY konwertuje YYYY-MM-DD na DD-MM-YYYY", () => {
    expect(formatDateToDDMMYYYY("2024-12-31")).toBe("31-12-2024");
  });

  test("formatDateToDDMMYYYY konwertuje 2023-01-15 na 15-01-2023", () => {
    expect(formatDateToDDMMYYYY("2023-01-15")).toBe("15-01-2023");
  });

  test("formatDateToDDMMYYYY zwraca pusty string dla pustego inputu", () => {
    expect(formatDateToDDMMYYYY("")).toBe("");
  });

  test("formatDateToDDMMYYYY zwraca pusty string dla null", () => {
    expect(formatDateToDDMMYYYY(null)).toBe("");
  });

  test("formatDateToDDMMYYYY zwraca pusty string dla undefined", () => {
    expect(formatDateToDDMMYYYY(undefined)).toBe("");
  });

  test("formatDateToYYYYMMDD konwertuje DD-MM-YYYY na YYYY-MM-DD", () => {
    expect(formatDateToYYYYMMDD("31-12-2024")).toBe("2024-12-31");
  });

  test("formatDateToYYYYMMDD konwertuje 15-01-2023 na 2023-01-15", () => {
    expect(formatDateToYYYYMMDD("15-01-2023")).toBe("2023-01-15");
  });

  test("formatDateToYYYYMMDD zwraca pusty string dla pustego inputu", () => {
    expect(formatDateToYYYYMMDD("")).toBe("");
  });

  test("formatDateToYYYYMMDD zwraca pusty string dla null", () => {
    expect(formatDateToYYYYMMDD(null)).toBe("");
  });

  test("formatDateToYYYYMMDD zwraca pusty string dla undefined", () => {
    expect(formatDateToYYYYMMDD(undefined)).toBe("");
  });

  test("formatDateToDDMMYYYY obsługuje daty z zerami", () => {
    expect(formatDateToDDMMYYYY("2020-01-01")).toBe("01-01-2020");
  });

  test("formatDateToYYYYMMDD obsługuje daty z zerami", () => {
    expect(formatDateToYYYYMMDD("01-01-2020")).toBe("2020-01-01");
  });

  test("formatDateToDDMMYYYY to formatDateToYYYYMMDD to formatDateToDDMMYYYY zwraca oryginalną datę", () => {
    const original = "25-06-2024";
    const converted = formatDateToYYYYMMDD(original);
    const back = formatDateToDDMMYYYY(converted);
    expect(back).toBe(original);
  });
});
