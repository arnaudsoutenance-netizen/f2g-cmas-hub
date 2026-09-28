"use client";

import { m } from "framer-motion";
import { CircleCheck, LockKeyhole } from "lucide-react";
import { ALERT_CLASSES, type AlertClass, classifyMessageId, MESSAGE_ID_SUBLABELS } from "@/lib/cmas/alert-classes";
import { ALERT_CLASS_ICONS, SEVERITY_STYLES } from "@/lib/cmas/severity-styles";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AlertClassPickerProps {
  value: number | null;
  onChange: (messageId: number) => void;
  /** Message IDs this operator may send (role-based). All when undefined. */
  allowed?: readonly number[];
}

const CMAS = ALERT_CLASSES.filter((c) => c.alertType === "CMAS");
const ETWS = ALERT_CLASSES.filter((c) => c.alertType === "ETWS");

function Tile({ cls, selected, disabled, onSelect, presidential = false }: {
  cls: AlertClass;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  presidential?: boolean;
}) {
  const style = SEVERITY_STYLES[cls.tone];
  const Icon = ALERT_CLASS_ICONS[cls.key];
  const range =
    cls.messageIds.length > 1 ? `${cls.messageIds[0]}–${cls.messageIds.at(-1)}` : String(cls.messageIds[0]);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      title={disabled ? "Réservé aux administrateurs" : undefined}
      className={cn(
        "relative flex h-full w-full flex-col items-start gap-1 rounded-[12px] border bg-shell p-4 pl-5 text-left transition-colors duration-150",
        "before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r",
        style.edgeBefore,
        selected ? style.selected : "border-hairline hover:bg-surface-hover",
        disabled && "cursor-not-allowed opacity-50",
        presidential && "min-h-[128px]",
      )}
    >
      {selected && (
        <m.span layoutId="class-selection" transition={spring.layout} className="pointer-events-none absolute -inset-px rounded-[12px] ring-2 ring-focus/30" />
      )}
      <span className="flex w-full items-center gap-2">
        <Icon aria-hidden className={cn("size-[18px] shrink-0", style.fg)} />
        <span className="font-display text-[16px] leading-5 font-semibold text-ink">{cls.label}</span>
        {!cls.optOut && <LockKeyhole aria-label="Sans désactivation possible" className="size-3.5 text-ink-3" />}
        <span className="ml-auto font-mono text-[12px] text-ink-3 tabular-nums">{range}</span>
      </span>
      <span className="text-[13px] leading-5 text-ink-3">{cls.description}</span>
      {selected && <CircleCheck aria-hidden className={cn("absolute top-3 right-3 size-4", style.fg)} />}
    </button>
  );
}

/** Two families, CMAS and ETWS. Presidential stands apart so it is never picked by proximity. */
export function AlertClassPicker({ value, onChange, allowed }: AlertClassPickerProps) {
  const selectedClass = value === null ? undefined : classifyMessageId(value);
  const isAllowed = (cls: AlertClass) => !allowed || cls.messageIds.some((id) => allowed.includes(id));
  const [presidential, ...otherCmas] = CMAS;

  return (
    <div className="space-y-5">
      <div role="radiogroup" aria-label="Classe d'alerte CMAS" className="space-y-3">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">CMAS · alertes publiques</p>
        {presidential && (
          <Tile
            cls={presidential}
            presidential
            selected={selectedClass?.key === presidential.key}
            disabled={!isAllowed(presidential)}
            onSelect={() => onChange(presidential.defaultMessageId)}
          />
        )}
        <div className="grid gap-2 pt-1 sm:grid-cols-2 xl:grid-cols-3">
          {otherCmas.map((cls) => (
            <Tile
              key={cls.key}
              cls={cls}
              selected={selectedClass?.key === cls.key}
              disabled={!isAllowed(cls)}
              onSelect={() => onChange(cls.defaultMessageId)}
            />
          ))}
        </div>
      </div>

      <div role="radiogroup" aria-label="Classe d'alerte ETWS" className="space-y-3">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">ETWS · séisme et tsunami</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ETWS.map((cls) => (
            <Tile
              key={cls.key}
              cls={cls}
              selected={selectedClass?.key === cls.key}
              disabled={!isAllowed(cls)}
              onSelect={() => onChange(cls.defaultMessageId)}
            />
          ))}
        </div>
      </div>

      {selectedClass && selectedClass.messageIds.length > 1 && value !== null && (
        <label className="flex flex-wrap items-center gap-3 rounded-[12px] bg-surface-sunken px-4 py-3 text-[13px] text-ink-2">
          Identifiant précis ({selectedClass.label})
          <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-9 rounded-[8px] border border-control-border bg-shell px-2.5 font-mono text-[13px] text-ink"
          >
            {selectedClass.messageIds.map((id) => (
              <option key={id} value={id}>
                {id} · {MESSAGE_ID_SUBLABELS[id] ?? ""}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
