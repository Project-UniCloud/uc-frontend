import Link from "next/link";
import { CiFaceFrown } from "react-icons/ci";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <CiFaceFrown className="text-9xl " />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Nie znaleziono takiej strony:(</p>
      <Link href="/dashboard">
        <button className="hover:opacity-70 cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center bg-purple text-white">
          Powrót do strony głównej
        </button>
      </Link>
    </div>
  );
}
