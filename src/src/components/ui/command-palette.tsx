"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Bell,
  Plus,
  Radio,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { cn } from "cn";

const COMMANDS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Pages" },
  { label: "Alerts", href: "/alerts", icon: Bell, group: "Pages" },
  { label: "New Alert", href: "/alerts/new", icon: Plus, group: "Actions" },
  { label: "Templates", href: "/templates", icon: FileText, group: "Pages" },
  { label: "Cells", href: "/cells", icon: Radio, group: "Pages" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Pages" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggle]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );
  const groups = [...new Set(filtered.map((c) => c.group))];

  const select = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
            onClick={() => setOpen(false)}
          >
            {/* Overlay */}
            <div className="fixed inset-0 bg-ink/60" />

            {/* Dialog */}
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-xl border border-hairline bg-shell shadow-e3 overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline">
                <Search className="size-5 text-ink-3" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a page or action..."
                  className="flex-1 bg-transparent text-ink placeholder:text-ink-3 outline-none text-[14px]"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md hover:bg-surface-hover"
                >
                  <X className="size-4 text-ink-3" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto p-2">
                {groups.map((group) => (
                  <div key={group}>
                    <p className="px-3 py-1.5 text-[11px] font-medium text-ink-3 uppercase tracking-wide">
                      {group}
                    </p>
                    {filtered
                      .filter((c) => c.group === group)
                      .map((cmd) => (
                        <button
                          key={cmd.href}
                          onClick={() => select(cmd.href)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                            "text-[13px] text-ink-2 hover:bg-primary-tint hover:text-primary",
                            "transition-colors"
                          )}
                        >
                          <cmd.icon className="size-4" />
                          {cmd.label}
                        </button>
                      ))}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-[13px] text-ink-3 py-6">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-hairline flex items-center gap-3 text-[11px] text-ink-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken font-mono">
                    ⌘K
                  </kbd>
                  to open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken font-mono">
                    Esc
                  </kbd>
                  to close
                </span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default CommandPalette;
