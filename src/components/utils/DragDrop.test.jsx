import React from "react";
import { render, screen } from "@testing-library/react";
import DragDrop from "./DragDrop";

const mockGetRootProps = jest.fn((props) => props);
const mockGetInputProps = jest.fn((props) => props);

jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn((config) => {
    mockGetRootProps.mockReturnValue({
      className: config.className || "",
    });
    mockGetInputProps.mockReturnValue({});

    return {
      acceptedFiles: [],
      fileRejections: [],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    };
  }),
}));

describe("DragDrop", () => {
  const mockOnDropFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(<DragDrop onDropFile={mockOnDropFile} {...props} />);
  };

  it("renderuje tekst instrukcji", () => {
    renderComponent();
    expect(
      screen.getByText(/Przeciągnij plik tutaj lub kliknij, by wybrać/i)
    ).toBeInTheDocument();
  });

  it("renderuje informację o akceptowanych plikach", () => {
    renderComponent();
    expect(screen.getByText("(Tylko pliki .csv)")).toBeInTheDocument();
  });

  it("wyświetla zaakceptowany plik", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [{ path: "test.csv", size: 1024 }],
      fileRejections: [],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("Twój plik:")).toBeInTheDocument();
    expect(screen.getByText(/test.csv – 1024 bytes/)).toBeInTheDocument();
  });

  it("nie wyświetla sekcji pliku gdy brak zaakceptowanych plików", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.queryByText("Twój plik:")).not.toBeInTheDocument();
  });

  it("wyświetla błąd file-invalid-type", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "document.pdf" },
          errors: [{ code: "file-invalid-type", message: "Invalid type" }],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("document.pdf:")).toBeInTheDocument();
    expect(screen.getByText("Nieobsługiwany typ pliku")).toBeInTheDocument();
  });

  it("wyświetla błąd file-too-large", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "large.csv" },
          errors: [{ code: "file-too-large", message: "Too large" }],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("Plik jest za duży")).toBeInTheDocument();
  });

  it("wyświetla błąd file-too-small", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "small.csv" },
          errors: [{ code: "file-too-small", message: "Too small" }],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("Plik jest zbyt mały")).toBeInTheDocument();
  });

  it("wyświetla błąd too-many-files", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "file1.csv" },
          errors: [{ code: "too-many-files", message: "Too many" }],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("Za dużo plików")).toBeInTheDocument();
  });

  it("wyświetla oryginalny message dla nieznanych błędów", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "file.csv" },
          errors: [{ code: "unknown-error", message: "Custom error message" }],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("wyświetla wiele błędów dla jednego pliku", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "problem.csv" },
          errors: [
            { code: "file-too-large", message: "Too large" },
            { code: "file-invalid-type", message: "Invalid type" },
          ],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("Plik jest za duży")).toBeInTheDocument();
    expect(screen.getByText("Nieobsługiwany typ pliku")).toBeInTheDocument();
  });

  it("wyświetla wiele odrzuconych plików", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [],
      fileRejections: [
        {
          file: { path: "file1.pdf" },
          errors: [{ code: "file-invalid-type", message: "Invalid" }],
        },
        {
          file: { path: "file2.txt" },
          errors: [{ code: "file-invalid-type", message: "Invalid" }],
        },
      ],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText("file1.pdf:")).toBeInTheDocument();
    expect(screen.getByText("file2.txt:")).toBeInTheDocument();
  });

  it("renderuje wiele zaakceptowanych plików", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [
        { path: "file1.csv", size: 100 },
        { path: "file2.csv", size: 200 },
      ],
      fileRejections: [],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(screen.getByText(/file1.csv – 100 bytes/)).toBeInTheDocument();
    expect(screen.getByText(/file2.csv – 200 bytes/)).toBeInTheDocument();
  });

  it("nie wyświetla rejected files gdy brak błędów", () => {
    const { useDropzone } = require("react-dropzone");
    useDropzone.mockReturnValue({
      acceptedFiles: [{ path: "test.csv", size: 1024 }],
      fileRejections: [],
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    expect(
      screen.queryByText(/Nieobsługiwany typ pliku/i)
    ).not.toBeInTheDocument();
  });

  it("wywołuje onDrop callback z pierwszym plikiem", () => {
    const { useDropzone } = require("react-dropzone");
    let onDropCallback;

    useDropzone.mockImplementation((config) => {
      onDropCallback = config.onDrop;
      return {
        acceptedFiles: [],
        fileRejections: [],
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
      };
    });

    renderComponent();

    const mockFiles = [
      { path: "file1.csv", size: 100 },
      { path: "file2.csv", size: 200 },
    ];
    onDropCallback(mockFiles);

    expect(mockOnDropFile).toHaveBeenCalledWith(mockFiles[0]);
  });

  it("konfiguruje useDropzone z poprawnymi opcjami", () => {
    const { useDropzone } = require("react-dropzone");

    renderComponent();

    expect(useDropzone).toHaveBeenCalledWith(
      expect.objectContaining({
        accept: { "text/csv": [".csv"] },
        maxSize: 100 * 1024 * 1024,
        maxFiles: 1,
        onDrop: expect.any(Function),
      })
    );
  });
});
