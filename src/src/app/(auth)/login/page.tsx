import type { Metadata } from "next";
import { Suspense } from "react";
import { F2GMark } from "@/components/brand/f2g-mark";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

/** Berry-style centred card on the grey well. */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-well px-4 py-10">
      <span aria-hidden className="absolute -top-40 -right-40 size-[28rem] rounded-full bg-navy-tint" />
      <span aria-hidden className="absolute -bottom-48 -left-32 size-[26rem] rounded-full bg-orange-tint" />

      <main className="relative w-full max-w-[475px] rounded-[12px] border border-hairline bg-shell p-8 shadow-e2 sm:p-10">
        <div className="flex items-center justify-center gap-2.5">
          <F2GMark className="size-10 text-[15px]" />
          <span className="font-display text-[24px] leading-none font-bold text-ink">CMAS Hub</span>
        </div>

        <div className="mt-8 text-center">
          <h1 className="font-display text-[24px] leading-[30px] font-semibold text-primary">Bonjour, bon retour</h1>
          <p className="mt-2 text-[14px] text-ink-3">Saisissez vos identifiants d&apos;opérateur pour continuer.</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-8 border-t border-hairline pt-5 text-center text-[13px] text-ink-3">
          Problème d&apos;accès ? Contactez l&apos;administrateur système.
        </p>
      </main>

      <p className="relative mt-6 text-center text-[12px] text-ink-3">
        République du Cameroun · Cell Broadcast CMAS / ETWS · F2G Laboratory | Confidential
      </p>
    </div>
  );
}
