import { LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { ALERT_CLASS_ICONS, SEVERITY_STYLES } from "@/lib/cmas/severity-styles";

interface SeverityBadgeProps {
  messageId: number;
  variant?: "solid" | "tint" | "outline";
  size?: "sm" | "md";
  showId?: boolean;
  className?: string;
}

/** `[icon] LABEL │ 4370` — colour plus icon, label and ID, so it survives grayscale. */
export function SeverityBadge({ messageId, variant = "tint", size = "md", showId = true, className }: SeverityBadgeProps) {
  const alertClass = classifyMessageId(messageId);

  if (!alertClass) {
    return (
      <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-[var(--radius-xs)] px-2 font-mono text-[11px] text-ink-3 ring-1 ring-inset ring-hairline-strong", className)}>
        ID {messageId}
      </span>
    );
  }

  const style = SEVERITY_STYLES[alertClass.tone];
  const Icon = ALERT_CLASS_ICONS[alertClass.key];
  // Presidential is always rendered solid, whatever the caller asks for.
  const effective = alertClass.tone === "presidential" ? "solid" : variant;

  return (
    <span
      aria-label={`Classe ${alertClass.label}, identifiant ${messageId}`}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-xs)] font-semibold uppercase tracking-[0.06em]",
        size === "md" ? "h-6 px-2 text-[11px] leading-4" : "h-5 px-1.5 text-[10px] leading-4",
        style[effective],
        className,
      )}
    >
      <Icon aria-hidden className={size === "md" ? "size-3.5" : "size-3"} />
      <span>{alertClass.label}</span>
      {alertClass.tone === "presidential" && <LockKeyhole aria-hidden className="size-3" />}
      {showId && (
        <span className="border-l border-current/25 pl-1.5 font-mono font-medium tracking-normal tabular-nums">
          {messageId}
        </span>
      )}
    </span>
  );
}
