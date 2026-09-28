"use client";

import { CircleX, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/client";

/** Only allow same-origin relative paths as a post-login destination. */
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 400) return "Email ou mot de passe incorrect.";
    if (error.status === 0) return error.message;
    if (error.status === 429) return "Trop de tentatives. Réessayez dans quelques minutes.";
  }
  return "Connexion impossible. Réessayez.";
}

const inputClass =
  "h-12 w-full rounded-[8px] border border-control-border bg-shell px-3.5 text-[15px] text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[invalid=true]:border-danger";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const ids = { email: useId(), password: useId(), error: useId() };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn.mutate(
      { email: email.trim(), password },
      { onSuccess: () => router.replace(safeNext(searchParams.get("next"))) },
    );
  };

  const failed = signIn.isError;

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      <div className="space-y-1.5">
        <label htmlFor={ids.email} className="text-[12px] font-medium text-ink-2">
          Email
        </label>
        <input
          id={ids.email}
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={failed}
          aria-describedby={failed ? ids.error : undefined}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={ids.password} className="text-[12px] font-medium text-ink-2">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id={ids.password}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={failed}
            aria-describedby={failed ? ids.error : undefined}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-3 hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {failed && (
        <p id={ids.error} role="alert" className="flex items-start gap-2 text-[13px] text-danger">
          <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
          {errorMessage(signIn.error)}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={signIn.isPending || !email || !password}>
        {signIn.isPending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
        {signIn.isPending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
