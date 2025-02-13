import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Household } from "@/core/entities/household.entity";

interface HouseholdState {
  selectedHouseholdId: string;
  households: Household[];
  updateName: (householdId: string, name: string) => void;
  updateSelectedHousehold: (householdId: string) => void;
  addHousehold: (household: Household) => void;
}

export const useHouseholdStore = create<HouseholdState>()(
  persist(
    (set) => ({
      selectedHouseholdId: "1",
      households: [
        { id: "1", name: "Familia Costa", sensorId: "1" },
        { id: "2", name: "Casa avis", sensorId: "2" },
        { id: "3", name: "Xalet airbnb", sensorId: "3" },
      ],
      updateName: (householdId, name) => {
        set((state) => ({
          households: state.households.map((household) =>
            household.id === householdId ? { ...household, name } : household
          ),
        }));
      },
      updateSelectedHousehold: (householdId) => {
        set({ selectedHouseholdId: householdId });
      },
      addHousehold: (household: Household) => {
        set((state) => ({ households: [...state.households, household] }));
      },
    }),
    {
      name: "household-store",
    }
  )
);
