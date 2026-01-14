import Hint from "@/components/utils/Hint";

export const columns = [
  { key: "name", header: "Nazwa" },
  { key: "lecturers", header: "Prowadzący" },
  { key: "cloudResourceAccesses", header: "Usługi" },
  { key: "semester", header: "Semestr" },
  {
    key: "endDate",
    header: (
      <div className="flex items-center justify-center gap-2">
        <span>Data Zakończenia</span>
        <span className="font-normal">
          <Hint hint="Data zakończenia to graniczny termin działania grupy. Po jej przekroczeniu system automatycznie archiwizuje grupę i przypisanych użytkowników. Tę operację możesz wywołać także ręcznie, używając akcji 'Archiwizuj grupę' w szczegółach danej grupy." />
        </span>
      </div>
    ),
  },
];
