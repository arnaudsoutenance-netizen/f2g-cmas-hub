"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/hooks/use-session";
import { useSessionStore } from "@/lib/stores/session-store";

function subscribeHydration(onChange: () => void) {
  return useSessionStore.persist.onFinishHydration(onChange);
}

/** True once the persisted session has been read from localStorage. */
function useSessionHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useSessionStore.persist.hasHydrated(),
    () => false,
  );
}

/** Client-side guard: the API is the real authority, this only routes the operator. */
export function SessionGate({ children }: { children: React.ReactNode }) {
  const hydrated = useSessionHydrated();
  const token = useSessionStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();
  useCurrentUser(); // refreshes the profile; a 401 clears the token

  useEffect(() => {
    if (hydrated && !token) {
      const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [hydrated, token, pathname, router]);

  if (!hydrated || !token) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas" aria-busy="true">
        <span className="text-[13px] text-ink-3">Vérification de la session…</span>
      </div>
    );
  }
  return children;
}
