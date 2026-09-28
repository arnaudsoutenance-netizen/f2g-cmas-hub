import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/domain";

interface SessionState {
  token: string | null;
  user: User | null;
  signIn: (token: string, user: User) => void;
  setUser: (user: User) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signIn: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null }),
    }),
    { name: "cmas-hub-session" },
  ),
);

/** Non-React access for the API client. */
export const getSessionToken = (): string | null => useSessionStore.getState().token;
export const clearSession = (): void => useSessionStore.getState().signOut();
