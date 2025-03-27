import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: true,
  openMenus: {},

  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),

  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  toggleMenu: (menuId) =>
    set((state) => ({
      openMenus: {
        ...state.openMenus,
        [menuId]: !state.openMenus[menuId],
      },
    })),
}));

export default useSidebarStore;
