import type { Metadata } from "next";
import { Suspense } from "react";
import { F2GMark } from "@/components/brand/f2g-mark";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas md:flex-row">
      <aside className="flex h-22 shrink-0 items-center bg-rail px-6 text-rail-ink md:h-auto md:w-[44%] md:flex-col md:items-start md:justify-between md:p-12">
        <F2GMark className="size-10 text-[15px]" />
        <div className="hidden md:block">
          <h1 className="max-w-sm font-display text-[32px] leading-9 font-semibold text-rail-ink">
            Diffusion d&apos;alertes d&apos;urgence
          </h1>
          <span aria-hidden className="mt-5 block h-[3px] w-12 rounded-full bg-brand-orange" />
          <p className="mt-5 max-w-sm text-[14px] leading-[22px] text-rail-ink-2">
            République du Cameroun · Cell Broadcast CMAS / ETWS
          </p>
        </div>
        <p className="hidden text-[12px] text-rail-ink-2 md:block">F2G Laboratory | Confidential</p>
      </aside>

      <main className="flex flex-1 items-center px-6 py-12 md:px-16">
        <div className="w-full max-w-[380px]">
          <h2 className="font-display text-[24px] leading-[30px] font-semibold text-ink">Connexion</h2>
          <p className="mt-1.5 text-[14px] text-ink-2">Accès réservé aux opérateurs habilités.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-8 text-[13px] text-ink-3">Problème d&apos;accès ? Contactez l&apos;administrateur système.</p>
        </div>
      </main>
    </div>
  );
}
