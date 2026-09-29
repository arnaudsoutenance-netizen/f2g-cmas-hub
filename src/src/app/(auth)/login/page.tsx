"use client";

import { useRef, useState } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { ArrowRight, Mail, Lock, Radio, Bell, Shield, Zap } from "lucide-react";
import { F2GMark } from "@/components/brand/f2g-mark";
import { useSignIn } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/client";
import { useRouter, useSearchParams } from "next/navigation";

const STATS = [
  { value: "4", label: "Cells" },
  { value: "7", label: "Alerts" },
  { value: "100%", label: "Uptime" },
];

const FEATURES = [
  { icon: Radio, label: "Cell Broadcast" },
  { icon: Bell, label: "CMAS / ETWS" },
  { icon: Shield, label: "Secure" },
  { icon: Zap, label: "Real-time" },
];

function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 400) return "Incorrect email or password.";
    if (error.status === 0) return error.message;
    if (error.status === 429) return "Too many attempts. Please try again later.";
  }
  return "Connection failed. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate(
      { email: email.trim(), password },
      { onSuccess: () => router.replace(safeNext(searchParams.get("next"))) }
    );
  };

  const failed = signIn.isError;

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative flex min-h-dvh w-full overflow-hidden bg-[#0A1120] text-white">
        {/* Animated speed lines background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-[#EC8236]/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#B85418]/8 blur-[100px]" />
          
          {/* Speed lines */}
          <div className="speed-lines">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="speed-line"
                style={{
                  top: `${15 + i * 10}%`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0.3 + (i % 3) * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* LEFT — Branding */}
            <div className="flex flex-col justify-center space-y-8 lg:col-span-7">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#EC8236]/20 bg-[#EC8236]/5 px-3 py-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#EC8236]">
                    Cell Broadcast Alert System
                    <Radio className="h-3.5 w-3.5" />
                  </span>
                </div>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-display text-5xl font-medium tracking-tight leading-[0.95] sm:text-6xl lg:text-7xl"
              >
                F2G<br />
                <span className="bg-gradient-to-br from-[#EC8236] via-[#F5A623] to-[#B85418] bg-clip-text text-transparent">
                  CMAS Hub
                </span>
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-xl text-lg leading-relaxed text-slate-400"
              >
                National emergency alert broadcast platform.{" "}
                <span className="text-[#EC8236] font-medium">
                  CMAS Presidential, Extreme, Severe, AMBER and ETWS.
                </span>
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                {FEATURES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#EC8236]/20 bg-[#EC8236]/5 px-3 py-1.5 text-xs font-medium text-[#EC8236]/80"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                ))}
              </m.div>

              {/* Stats mobile */}
              <div className="flex gap-8 lg:hidden">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-[#EC8236]">{s.value}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Login Card */}
            <div className="flex items-center lg:col-span-5">
              <m.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative w-full overflow-hidden rounded-2xl border border-[#EC8236]/20 bg-[#111A2C]/80 p-8 backdrop-blur-xl shadow-2xl"
              >
                {/* Cursor glow effect */}
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(236,130,54,0.08) 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Logo + Header */}
                  <div className="flex items-center gap-3">
                    <F2GMark className="size-12 text-[14px]" />
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Sign In</h2>
                      <p className="text-xs text-slate-400">Access the dashboard</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        placeholder="admin@f2g.cm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                        aria-invalid={failed}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-[#EC8236]/50 focus:ring-2 focus:ring-[#EC8236]/20"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        aria-invalid={failed}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-[#EC8236]/50 focus:ring-2 focus:ring-[#EC8236]/20"
                      />
                    </div>

                    {failed && (
                      <p className="text-xs text-red-400">{errorMessage(signIn.error)}</p>
                    )}

                    <button
                      type="submit"
                      disabled={signIn.isPending || !email || !password}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC8236] to-[#B85418] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#EC8236]/20 transition-all hover:scale-[1.02] hover:shadow-[#EC8236]/30 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {signIn.isPending ? "Signing in..." : "Sign In"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>

                  {/* Stats desktop */}
                  <div className="hidden grid-cols-3 gap-4 border-t border-[#EC8236]/10 pt-4 lg:grid">
                    {STATS.map((s) => (
                      <div key={s.label} className="group flex cursor-default flex-col items-center">
                        <span className="text-xl font-bold text-[#EC8236] transition-colors group-hover:text-[#F5A623]">
                          {s.value}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="pt-2 text-center text-[10px] text-slate-600">
                    Republic of Cameroon · F2G Laboratory
                  </p>
                </div>
              </m.div>
            </div>
          </div>
        </div>

        {/* CSS for speed lines */}
        <style jsx>{`
          .speed-lines {
            position: absolute;
            inset: 0;
            overflow: hidden;
          }
          .speed-line {
            position: absolute;
            left: 30%;
            right: 0;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(236, 130, 54, 0.6) 20%,
              rgba(236, 130, 54, 0.8) 50%,
              rgba(245, 166, 35, 0.4) 80%,
              transparent 100%
            );
            animation: speed-line 3s ease-in-out infinite;
            filter: blur(0.5px);
          }
          .speed-line::after {
            content: '';
            position: absolute;
            inset: -4px 0;
            background: inherit;
            filter: blur(8px);
            opacity: 0.5;
          }
          @keyframes speed-line {
            0% {
              transform: translateX(-100%) scaleX(0.3);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translateX(20%) scaleX(1);
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateX(100%) scaleX(0.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
