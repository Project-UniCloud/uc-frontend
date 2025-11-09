export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div className="flex flex-col items-center justify-center gap-10 h-2/3 max-w-3xl m-auto ">
      <h1 className="font-semibold text-purple md:text-5xl text-3xl text-center">
        Witamy w UniCloud Manager!
      </h1>
      <p className="text-gray-8-00 text-MD text-center mt-4">
        Akademickim systemie zarządzania zasobami chmurowymi WMiI UAM. Nasza
        platforma umożliwia efektywne zarządzanie zasobami chmurowymi,
        automatyzację rutynowych procesów i monitorowanie wykorzystania
        infrastruktury. Zachęcamy do korzystania z narzędzia i dzielenia się
        opinią na temat dalszego rozwoju systemu.
      </p>
    </div>
  );
}
