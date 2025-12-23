import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Household } from "@domain/entities/household";

interface HouseholdState {
  households: Household[];
  selectedHouseholdId: Household["id"];
  selectHousehold: (id: string) => void;
  setHouseholds: (households: Household[]) => void;
  deleteHousehold: (householdId: string) => void;
  updateHousehold: (household: Household) => void;
  addHousehold: (household: Household) => void;
}

export const useHouseholdStore = create<HouseholdState>()(
  persist(
    (set) => ({
      households: [],
      selectedHouseholdId: "",
      selectHousehold: (id: string) => set({ selectedHouseholdId: id }),
      setHouseholds: (households: Household[]) => set({ households }),
      deleteHousehold: (householdId: string) =>
        set((state) => {
          const newHouseholds = state.households.filter((h) => h.id !== householdId);
          return {
            households: newHouseholds,
            selectedHouseholdId:
              state.selectedHouseholdId === householdId
                ? newHouseholds[0]?.id || ""
                : state.selectedHouseholdId,
          };
        }),
      updateHousehold: (household: Household) =>
        set((state) => ({
          households: state.households.map((h) => (h.id === household.id ? household : h)),
        })),
      addHousehold: (household: Household) =>
        set((state) => ({
          households: [...state.households, household],
        })),
    }),
    {
      name: "household-storage",
    }
  )
);
