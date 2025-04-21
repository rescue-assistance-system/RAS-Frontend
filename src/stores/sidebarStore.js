import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: true,
  openMenus: {},

  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),

  isLoggedIn: !!localStorage.getItem('token'),

  login: (token) => {
    localStorage.setItem('token', token);
    set({ isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false });
  },

  toggleMenu: (menuId) =>
    set((state) => ({
      openMenus: {
        ...state.openMenus,
        [menuId]: !state.openMenus[menuId],
      },
    })),
}));

export default useSidebarStore;
