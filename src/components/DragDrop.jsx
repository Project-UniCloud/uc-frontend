import React from "react";
import { useDropzone } from "react-dropzone";

const ERROR_TRANSLATIONS = {
  "file-invalid-type": "Nieobsługiwany typ pliku",
  "file-too-large": "Plik jest za duży",
  "file-too-small": "Plik jest zbyt mały",
  "too-many-files": "Za dużo plików",
};

export default function Basic({ onDropFile }) {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: { "text/csv": [".csv"] },
      maxSize: 100 * 1024 * 1024,
      maxFiles: 1,
      onDrop: (files) => {
        console.log("Plik został dodany:", files[0]);
        onDropFile(files[0]);
      },
    });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} – {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path} className="text-red-600">
      <strong>{file.path}:</strong>
      <ul className="ml-4 list-disc">
        {errors.map((e) => (
          <li key={e.code}>{ERROR_TRANSLATIONS[e.code] || e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <section className="container">
      <div
        {...getRootProps({
          className:
            "dropzone p-6 border-2 border-dashed border-gray-300 rounded text-center",
        })}
      >
        <input {...getInputProps()} />
        <p>Przeciągnij plik tutaj lub kliknij, by wybrać</p>
        <em>(Tylko pliki .csv)</em>
      </div>

      <aside className="mt-4">
        {acceptedFiles.length > 0 && (
          <>
            <h4>Twój plik:</h4>
            <ul>{acceptedFileItems}</ul>
          </>
        )}

        {fileRejections.length > 0 && (
          <>
            <ul>{fileRejectionItems}</ul>
          </>
        )}
      </aside>
    </section>
  );
}
