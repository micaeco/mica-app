import { create } from "zustand";
import { Household } from "@core/entities/household";
import { Sensor } from "@core/entities/sensor";
import { findAllHouseholds } from "@lib/actions";

interface HouseholdState {
  selectedHouseholdId: Household["id"];
  selectedHouseholdSensorId: Sensor["id"];
  households: Array<Household>;
  isLoading: boolean;
  fetchHouseholds: () => Promise<void>;
  selectHousehold: (id: string) => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => {
  const fetchHouseholds = async () => {
    try {
      set({ isLoading: true });
      const households = await findAllHouseholds();
      set((state) => ({
        households,
        isLoading: false,
        selectedHouseholdId:
          state.selectedHouseholdId || (households.length > 0 ? households[0].id : ""),
        selectedHouseholdSensorId: state.selectedHouseholdSensorId || households[0].sensor.id,
      }));
    } catch (error) {
      console.error("Error fetching households:", error);
      set({ isLoading: false });
    }
  };

  return {
    selectedHouseholdId: "",
    selectedHouseholdSensorId: "",
    households: [],
    isLoading: true,
    fetchHouseholds,
    selectHousehold: (id: string) => set({ selectedHouseholdId: id }),
  };
});
