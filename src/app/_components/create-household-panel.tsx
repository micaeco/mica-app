import { FormEvent, useState } from "react";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
} from "./ui/panel";
import { Plus } from "lucide-react";

export function CreateHouseholdPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [newHouseholdName, setNewHouseholdName] = useState("");

  const handleAddHousehold = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newHouseholdName.trim()) {
      // Create a household object with the necessary properties.
      addHousehold({ id: Date.now().toString(), name: newHouseholdName.trim(), sensorId: "" });
      setNewHouseholdName("");
    }
  };

  return (
    <Panel>
      <PanelTrigger className={className}>{children}</PanelTrigger>
      <PanelContent>
        <form onSubmit={handleAddHousehold}>
          <PanelHeader>
            <PanelTitle>Afegeix una nova vivenda</PanelTitle>
            <PanelDescription>
              Emplena els següents camps i clica en guardar per crear una nova vivenda.
            </PanelDescription>
          </PanelHeader>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Nom de la vivenda"
              value={newHouseholdName}
              onChange={(e) => setNewHouseholdName(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-secondary rounded px-4 py-2 text-white transition-colors"
            >
              Desa
            </button>
          </div>
        </form>
      </PanelContent>
    </Panel>
  );
}
function addHousehold(arg0: { id: string; name: string; sensorId: string }) {
  throw new Error("Function not implemented.");
}
