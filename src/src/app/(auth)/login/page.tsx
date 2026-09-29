import type { Metadata } from "next";
import { Suspense } from "react";
import { F2GMark } from "@/components/brand/f2g-mark";
import { GlowCard } from "@/components/auth/glow-card";
import { LoginHero } from "@/components/auth/login-hero";
import { LOGIN_STATS } from "@/components/auth/login-stats";
import { LoginForm } from "@/components/auth/login-form";
import { LoginShader } from "@/components/auth/login-shader";

export const metadata: Metadata = { title: "Sign in" };

/*
 * Immersive login adapted from omicron-ui: animated shader backdrop,
 * typewriter hero and a pointer-glow card. The page is always dark
 * (`dark` scopes the dark token set to this subtree), whatever the app theme.
 */
export default function LoginPage() {
  return (
    <div lang="en" className="dark relative isolate flex min-h-dvh w-full overflow-hidden bg-rail text-ink">
      <LoginShader className="absolute inset-0 -z-10 size-full opacity-45" />
      <span aria-hidden className="absolute top-1/4 left-1/3 -z-10 size-96 rounded-full bg-brand-orange/10 blur-[120px]" />
      <span aria-hidden className="absolute right-1/4 bottom-1/4 -z-10 size-80 rounded-full bg-brand-navy/40 blur-[100px]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center gap-2.5">
          <F2GMark className="size-9 text-[14px]" />
          <span className="font-display text-[20px] leading-none font-bold text-ink">CMAS Hub</span>
          <span className="ml-2 text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">F2G Solutions</span>
        </header>

        <div className="grid flex-1 grid-cols-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <LoginHero />
          </div>

          <main className="lg:col-span-5">
            <GlowCard className="p-8 sm:p-10">
              <h2 className="font-display text-[26px] leading-tight font-semibold text-ink">Authority sign-in</h2>
              <p className="mt-1.5 text-[14px] text-ink-3">Use the credentials issued to your agency. Every alert is logged and confirmed before broadcast.</p>

              <Suspense>
                <LoginForm />
              </Suspense>

              <dl className="mt-8 hidden grid-cols-3 gap-4 border-t border-hairline pt-6 lg:grid">
                {LOGIN_STATS.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse items-center">
                    <dt className="text-[10px] tracking-[0.12em] text-ink-3 uppercase">{s.label}</dt>
                    <dd className="tnum font-display text-[22px] font-bold text-orange-fg">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-center text-[12px] text-ink-3">
                Restricted to accredited authorities. Access issue? Contact your system administrator.
              </p>
            </GlowCard>
          </main>
        </div>

        <footer className="text-center text-[12px] text-ink-3">
          Republic of Cameroon · Cell Broadcast CMAS / ETWS · F2G Laboratory | Confidential
        </footer>
      </div>
    </div>
  );
}
