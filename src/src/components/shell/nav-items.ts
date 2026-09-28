import { BellRing, LayoutDashboard, LibraryBig, type LucideIcon, Plus, RadioTower, Settings } from "lucide-react";

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
    title: "Opérations",
    items: [
      { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/alerts", label: "Alertes", icon: BellRing },
      { href: "/alerts/new", label: "Nouvelle alerte", icon: Plus, shortcut: "N" },
      { href: "/templates", label: "Modèles", icon: LibraryBig },
    ],
  },
  { title: "Réseau", items: [{ href: "/cells", label: "Cellules", icon: RadioTower }] },
  { title: "Système", items: [{ href: "/settings", label: "Paramètres", icon: Settings }] },
];

/** Longest matching href wins, so /alerts/new does not also light up /alerts. */
export function activeHref(pathname: string): string | undefined {
  const all = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.href));
  return all
    .filter((href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.length - a.length)[0];
}

export function pageTitle(pathname: string): string {
  if (/^\/alerts\/[^/]+$/.test(pathname) && pathname !== "/alerts/new") return "Détail de l'alerte";
  const href = activeHref(pathname);
  return NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.href === href)?.label ?? "CMAS Hub";
}
