"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/endpoints";
import { useSessionStore } from "@/lib/stores/session-store";
import { queryKeys } from "./query-keys";

export function useCurrentUser() {
  const token = useSessionStore((s) => s.token);
  const setUser = useSessionStore((s) => s.setUser);
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async ({ signal }) => {
      const user = await authApi.me(signal);
      setUser(user);
      return user;
    },
    enabled: token !== null,
    staleTime: 5 * 60_000,
  });
}

export function useSignIn() {
  const signIn = useSessionStore((s) => s.signIn);
  const signOut = useSessionStore((s) => s.signOut);
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { access_token } = await authApi.login(email, password);
      // /auth/me needs the token, so store it before fetching the profile.
      useSessionStore.setState({ token: access_token });
      try {
        const user = await authApi.me();
        signIn(access_token, user);
        return user;
      } catch (error) {
        signOut();
        throw error;
      }
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  const signOut = useSessionStore((s) => s.signOut);
  return () => {
    signOut();
    qc.clear();
  };
}
