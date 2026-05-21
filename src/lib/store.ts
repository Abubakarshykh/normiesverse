import { create } from 'zustand';
import { Normie, fetchNormies } from './api';

interface AppState {
  normies: Normie[];
  isLoading: boolean;
  searchQuery: string;
  selectedFaction: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedFaction: (faction: string | null) => void;
  loadNormies: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  normies: [],
  isLoading: false,
  searchQuery: '',
  selectedFaction: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedFaction: (selectedFaction) => set({ selectedFaction }),
  loadNormies: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchNormies();
      set({ normies: data, isLoading: false });
    } catch (error) {
      console.error('Failed to load normies', error);
      set({ isLoading: false });
    }
  },
}));
