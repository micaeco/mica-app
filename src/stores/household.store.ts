import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Household } from "@core/entities/household";

interface HouseholdState {
  selectedHouseholdId: string;
  households: Household[];
  updateName: (householdId: string, name: string) => void;
  updateSelectedHousehold: (householdId: string) => void;
  addHousehold: (household: Household) => void;
  deleteHousehold: (householdId: string) => void;
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
      addHousehold: (household: Household) => {
        set((state) => ({ households: [...state.households, household] }));
      },
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
      deleteHousehold: (householdId) => {
        set((state) => {
          if (state.households.length > 1) {
            const updatedHouseholds = state.households.filter(
              (household) => household.id !== householdId
            );
            return {
              households: updatedHouseholds,
              selectedHouseholdId: updatedHouseholds[0].id,
            };
          }
          return state;
        });
      },
    }),
    {
      name: "household-store",
    }
  )
);
