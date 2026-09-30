import { BellRing, LayoutDashboard, LibraryBig, type LucideIcon, Plus, RadioTower, Settings, Terminal } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: "Operations",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/alerts", label: "Alerts", icon: BellRing },
      { href: "/alerts/new", label: "New Alert", icon: Plus, shortcut: "N" },
      { href: "/templates", label: "Templates", icon: LibraryBig },
    ],
  },
  { title: "Network", items: [
    { href: "/cells", label: "Cells", icon: RadioTower },
    { href: "/demo", label: "Demo", icon: Terminal },
  ] },
  { title: "System", items: [{ href: "/settings", label: "Settings", icon: Settings }] },
];

/** Longest matching href wins, so /alerts/new does not also light up /alerts. */
export function activeHref(pathname: string): string | undefined {
  const all = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.href));
  return all
    .filter((href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.length - a.length)[0];
}

export function pageTitle(pathname: string): string {
  if (/^\/alerts\/[^/]+$/.test(pathname) && pathname !== "/alerts/new") return "Alert Details";
  const href = activeHref(pathname);
  return NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.href === href)?.label ?? "CMAS Hub";
}
