import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  activeCategory: string;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setActiveCategory: (category: string) => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  activeCategory: 'All',
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
