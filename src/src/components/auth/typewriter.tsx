"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { cn } from "@/lib/utils";

type State = { index: number; length: number; deleting: boolean };

function next(state: State, phrases: readonly string[]): State {
  const phrase = phrases[state.index];
  if (!state.deleting) {
    return state.length < phrase.length ? { ...state, length: state.length + 1 } : { ...state, deleting: true };
  }
  return state.length > 0
    ? { ...state, length: state.length - 1 }
    : { index: (state.index + 1) % phrases.length, length: 0, deleting: false };
}

/**
 * Types, holds, deletes and cycles through phrases. Screen readers get the
 * full list once; the animated text is aria-hidden. Under reduced motion the
 * first phrase is shown whole and nothing moves.
 */
export function Typewriter({
  phrases,
  className,
  typeMs = 55,
  deleteMs = 28,
  holdMs = 2200,
}: {
  phrases: readonly string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}) {
  const reduce = useReducedMotion();
  const [state, tick] = useReducer((s: State) => next(s, phrases), { index: 0, length: 0, deleting: false });

  const phrase = phrases[state.index];
  const complete = !state.deleting && state.length === phrase.length;

  useEffect(() => {
    if (reduce) return;
    const delay = complete ? holdMs : state.deleting ? deleteMs : typeMs;
    const id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [reduce, state, complete, holdMs, deleteMs, typeMs]);

  const shown = reduce ? phrases[0] : phrase.slice(0, state.length);

  return (
    <span className={cn("inline", className)}>
      <span className="sr-only">{phrases.join(" ")}</span>
      <span aria-hidden>
        {shown}
        {!reduce && <span className="ml-0.5 animate-caret text-brand-orange">_</span>}
      </span>
    </span>
  );
}
