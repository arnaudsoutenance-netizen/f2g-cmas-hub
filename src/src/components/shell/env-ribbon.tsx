/** Training builds must never be mistaken for the live national system. */
export function EnvRibbon() {
  if (process.env.NEXT_PUBLIC_ENV === "production") return null;
  return (
    <div
      role="note"
      className="sev-hatch border-b border-dashed border-sev-test-edge bg-sev-test-tint px-4 py-1.5 text-center text-[11px] font-semibold tracking-[0.08em] text-sev-test-fg uppercase lg:px-8"
    >
      Training environment · alerts are not broadcast to the public
    </div>
  );
}
