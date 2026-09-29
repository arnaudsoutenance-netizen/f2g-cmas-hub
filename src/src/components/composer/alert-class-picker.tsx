"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { CircleCheck, LockKeyhole } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { ALERT_CLASSES, type AlertClass, classifyMessageId, MESSAGE_ID_SUBLABELS } from "@/lib/cmas/alert-classes";
import { ALERT_CLASS_ICONS, SEVERITY_STYLES } from "@/lib/cmas/severity-styles";
import { cn } from "@/lib/utils";

interface AlertClassPickerProps {
  value: number | null;
  onChange: (messageId: number) => void;
  /** Message IDs this operator may send (role-based). All when undefined. */
  allowed?: readonly number[];
}

const CMAS = ALERT_CLASSES.filter((c) => c.alertType === "CMAS");
const ETWS = ALERT_CLASSES.filter((c) => c.alertType === "ETWS");

function Tile({ cls, selected, disabled, presidential = false }: {
  cls: AlertClass;
  selected: boolean;
  disabled: boolean;
  presidential?: boolean;
}) {
  const style = SEVERITY_STYLES[cls.tone];
  const Icon = ALERT_CLASS_ICONS[cls.key];
  const range =
    cls.messageIds.length > 1 ? `${cls.messageIds[0]}–${cls.messageIds.at(-1)}` : String(cls.messageIds[0]);

  return (
    <Radio.Root
      value={cls.key}
      disabled={disabled}
      title={disabled ? "Administrators only" : undefined}
      className={cn(
        "relative flex h-full w-full cursor-pointer flex-col items-start gap-1 rounded-[12px] border bg-surface p-4 pr-9 pl-5 text-left transition-colors duration-150 motion-reduce:transition-none",
        "before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r",
        style.edgeBefore,
        selected ? style.selected : "border-hairline hover:bg-surface-hover",
        disabled && "cursor-not-allowed opacity-50",
        presidential && "min-h-[112px]",
      )}
    >
      <span className="flex w-full items-center gap-2">
        <Icon aria-hidden className={cn("size-[18px] shrink-0", style.fg)} />
        <span className="font-display text-[16px] leading-5 font-semibold text-ink">{cls.label}</span>
        {!cls.optOut && <LockKeyhole aria-label="Cannot be disabled" className="size-3.5 shrink-0 text-ink-3" />}
        <span className="ml-auto font-mono text-[12px] whitespace-nowrap text-ink-3 tabular-nums">{range}</span>
      </span>
      <span className="text-[13px] leading-5 text-ink-3">{cls.description}</span>
      {selected && (
        <span className={cn("absolute top-3.5 right-3 flex items-center", style.fg)}>
          <CircleCheck aria-hidden className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      )}
    </Radio.Root>
  );
}

/** Two families, CMAS and ETWS. Presidential stands apart so it is never picked by proximity. */
export function AlertClassPicker({ value, onChange, allowed }: AlertClassPickerProps) {
  const selectedClass = value === null ? undefined : classifyMessageId(value);
  const isAllowed = (cls: AlertClass) => !allowed || cls.messageIds.some((id) => allowed.includes(id));
  const [presidential, ...otherCmas] = CMAS;

  const select = (key: unknown) => {
    const cls = ALERT_CLASSES.find((c) => c.key === key);
    if (cls) onChange(cls.defaultMessageId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p id="class-family-cmas" className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
          CMAS · public alerts
        </p>
        <RadioGroup
          aria-labelledby="class-family-cmas"
          value={selectedClass?.alertType === "CMAS" ? selectedClass.key : null}
          onValueChange={select}
          className="space-y-2"
        >
          {presidential && (
            <Tile cls={presidential} presidential selected={selectedClass?.key === presidential.key} disabled={!isAllowed(presidential)} />
          )}
          <div className="grid gap-2 pt-1 sm:grid-cols-2 xl:grid-cols-3">
            {otherCmas.map((cls) => (
              <Tile key={cls.key} cls={cls} selected={selectedClass?.key === cls.key} disabled={!isAllowed(cls)} />
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <p id="class-family-etws" className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
          ETWS · earthquake and tsunami
        </p>
        <RadioGroup
          aria-labelledby="class-family-etws"
          value={selectedClass?.alertType === "ETWS" ? selectedClass.key : null}
          onValueChange={select}
          className="grid gap-2 sm:grid-cols-2"
        >
          {ETWS.map((cls) => (
            <Tile key={cls.key} cls={cls} selected={selectedClass?.key === cls.key} disabled={!isAllowed(cls)} />
          ))}
        </RadioGroup>
      </div>

      {selectedClass && selectedClass.messageIds.length > 1 && value !== null && (
        <div className="flex flex-wrap items-center gap-3 rounded-[12px] bg-surface-sunken px-4 py-3 text-[13px] text-ink-2">
          <label htmlFor="class-exact-id">Exact identifier ({selectedClass.label})</label>
          <NativeSelect
            id="class-exact-id"
            variant="outline"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-9 w-auto min-w-[220px] font-mono text-[13px] text-ink"
          >
            {selectedClass.messageIds.map((id) => (
              <option key={id} value={id}>
                {id} · {MESSAGE_ID_SUBLABELS[id] ?? ""}
              </option>
            ))}
          </NativeSelect>
        </div>
      )}
    </div>
  );
}
