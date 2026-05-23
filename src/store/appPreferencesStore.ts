import { create } from 'zustand';

interface AppPreferencesState {
  isEcoMode: boolean;
  toggleEcoMode: () => void;
}

export const useAppPreferencesStore = create<AppPreferencesState>((set) => ({
  isEcoMode: false,
  toggleEcoMode: () => set((state) => ({ isEcoMode: !state.isEcoMode })),
}));
