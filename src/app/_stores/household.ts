import { create } from "zustand";

import { Household } from "@domain/entities/household";

interface HouseholdState {
  households: Household[];
  selectedHouseholdId: Household["id"];
  selectHousehold: (id: string) => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
  households: [],
  selectedHouseholdId: "",
  selectHousehold: (id: string) => set({ selectedHouseholdId: id }),
}));
