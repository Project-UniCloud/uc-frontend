"use client";
export default function LecturerDetailsPage({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Szczegóły prowadzącego</h1>
      <p className="text-gray-500">ID prowadzącego: {params.lecturerId}</p>
      {/* Szczegóły prowadzącego */}
    </div>
  );
}
