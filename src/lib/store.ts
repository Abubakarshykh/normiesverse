import { create } from 'zustand';
import { Normie, fetchNormies } from './api';

interface AppState {
  normies: Normie[];
  isLoading: boolean;
  searchQuery: string;
  selectedFaction: string | null;
  selectedRarity: string | null;
  sortBy: 'powerLevel' | 'name' | 'rarity';
  setSearchQuery: (query: string) => void;
  setSelectedFaction: (faction: string | null) => void;
  setSelectedRarity: (rarity: string | null) => void;
  setSortBy: (sort: 'powerLevel' | 'name' | 'rarity') => void;
  loadNormies: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  normies: [],
  isLoading: false,
  searchQuery: '',
  selectedFaction: null,
  selectedRarity: null,
  sortBy: 'powerLevel',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedFaction: (selectedFaction) => set({ selectedFaction }),
  setSelectedRarity: (selectedRarity) => set({ selectedRarity }),
  setSortBy: (sortBy) => set({ sortBy }),
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
