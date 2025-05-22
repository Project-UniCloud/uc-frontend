import Image from "next/image";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden md:flex w-1/2 relative m-2">
        <Image
          src="/wmi.png"
          alt="Building"
          fill
          objectFit="cover"
          className="rounded-xl"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-around items-center p-8">
        <div className="relative w-full h-1/5 mb-8 min-h-1/5">
          <Image
            src="/logo.png"
            alt="Unicloud Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-6 text-black">
            Miło Cię znowu widzieć!
          </h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs mt-8 text-gray-400">
          © Unicloud 2025
        </p>
      </div>
    </div>
  );
}
