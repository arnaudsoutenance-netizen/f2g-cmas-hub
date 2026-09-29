"use client";

import { m } from "framer-motion";
import { dur, ease } from "@/lib/motion";
import { LOGIN_STATS } from "./login-stats";
import { Typewriter } from "./typewriter";

const PHRASES = [
  "reach 31.5 million subscribers in seconds.",
  "broadcast through MTN, Orange, Camtel and Nexttel.",
  "target one cell, one region or the whole country.",
  "stay compliant with 3GPP TS 23.041.",
] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: dur.slow * 1.8, ease: ease.emphasized },
});

/** Left column of the login screen: badge, title, typewriter, mobile stats. */
export function LoginHero() {
  return (
    <div className="flex flex-col justify-center gap-7">
      <m.div {...rise(0.05)}>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-orange-fg uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-brand-orange" />
          Cell Broadcast · Cameroon
        </span>
      </m.div>

      <m.h1 {...rise(0.15)} className="font-display text-[48px] leading-[0.95] font-bold tracking-tight text-ink sm:text-[60px] lg:text-[72px]">
        National emergency
        <br />
        <span className="bg-gradient-to-br from-rail-ink via-brand-orange to-orange-deep bg-clip-text text-transparent">
          alerts
        </span>
      </m.h1>

      <m.p {...rise(0.3)} className="max-w-xl text-[18px] leading-relaxed text-ink-2">
        With CMAS Hub, <Typewriter phrases={PHRASES} className="font-medium text-orange-fg" />
      </m.p>

      <m.dl {...rise(0.42)} className="flex gap-10 lg:hidden">
        {LOGIN_STATS.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="text-[10px] tracking-[0.12em] text-ink-3 uppercase">{s.label}</dt>
            <dd className="tnum font-display text-[26px] font-bold text-orange-fg">{s.value}</dd>
          </div>
        ))}
      </m.dl>
    </div>
  );
}
