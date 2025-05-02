import { create } from "zustand";
import { Household } from "@domain/entities/household";
import { findAllHouseholds } from "@presentation/lib/actions";

interface HouseholdState {
  selectedHouseholdId: Household["id"];
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
      }));
    } catch (error) {
      console.error("Error fetching households:", error);
      set({ isLoading: false });
    }
  };

  return {
    selectedHouseholdId: "",
    households: [],
    isLoading: true,
    fetchHouseholds,
    selectHousehold: (id: string) => set({ selectedHouseholdId: id }),
  };
});
