# Revue candidate : entités UI/UX d'`omicron-ui` (et `Arbre-genealogique`)

> 2026-09-29 · Analyse en lecture seule, aucun code modifié, rien installé ni exécuté · Sources : `/home/f2g/Projets/Dev/omicron-ui` (Next 16, React 19, Tailwind v4, `motion/react`), `/home/f2g/Projets/Dev/Arbre-genealogique/frontend` (Vite, Tailwind v3) · Réf. : `docs/DESIGN.md` (note « Berry × F2G »), `src/src/app/globals.css`, `src/src/components/shell/*`, `src/src/lib/cmas/severity-styles.ts`, `docs/candidates/draggable-widget-grid-review.md`
>
> L'URL publique https://omicron-ui.vercel.app/ n'a pas pu être consultée (pas d'outil web dans cette session). L'écran d'intro décrit (héro brun/cuivre, sidebar étroite, sections « 01 / 02 / 03 ») a été rapproché du code : `family-hero-banner.tsx` + `family-showcase.tsx` + `app-sidebar.tsx`.

## 1. Résumé

1. **omicron-ui est une vitrine familiale et émotionnelle** : dégradés ambre, glassmorphism, halos flous, GSAP en boucle infinie, scroll détourné, photos. Environ 70 % de ses entités graphiques sont **interdites** par DESIGN.md (§1 « Anti-patterns ») et sont donc à écarter telles quelles.
2. **Ce qui vaut la peine d'être repris relève de la structure, pas du style.** Une palette de commandes pilotée par les données, avec surlignage des correspondances et aide clavier. Des liens d'évitement (skip links). Un `loading.tsx` de route. Un bandeau hors ligne. L'index numéroté « 01/02/03 », à transposer en index d'étapes du composeur. La mise en page « visuel + liste latérale » de `/carte`. Le graphe `@xyflow` accessible au clavier de `/arbre`.
3. **À écarter** : l'intro à scroll détourné, le héro cuivre, la sidebar à dégradés par item, le globe `cobe` (mauvaise échelle pour le Cameroun, WebGL en boucle continue), Leaflet avec tuiles OSM externes, les View Transitions, les cartes 3D « tilt », le switcher de thème « cinématique », la file de mutations hors ligne et le PWA/service worker.
4. **Découverte importante côté CMAS** : `src/src/components/ui/command-palette.tsx` est **déjà une copie** de `omicron-ui/src/components/ui/command-palette.tsx`. Il viole DESIGN §4.2 (pas de cmdk, pas de piège de focus, `z-[100]` en dur, `max-w-lg`) et pointe vers `/cells` et `/settings`, deux routes qui n'existent pas encore. C'est le premier chantier.
5. **Aucune nouvelle dépendance n'est nécessaire** pour les 6 premiers candidats. `@xyflow/react` n'est justifié que si l'écran « Topologie » est validé. `cobe` et `leaflet` : non.

## 2. Inventaire des entités graphiques d'omicron-ui

Chemins relatifs à `/home/f2g/Projets/Dev/omicron-ui/`.

### 2.1 Tokens

| Entité | Source | Contenu | Observation CMAS |
|---|---|---|---|
| Palette claire | `src/app/globals.css:4-29` (`@theme`) | Slate + primaire **bleu `#2563EB`**, accent **orange `#F97316`**, destructive `#EF4444`, `--color-glow #3B82F6` | `#2563EB` = exactement notre `--st-sending` (clair) et `--sev-etws` (sombre). L'accent orange est à ΔE faible de la marque `#EC8236` et du Severe. **Rien à importer.** |
| Palette sombre | `src/app/globals.css:31-51` | Slate 900/800, primaire `#60A5FA` | Notre sombre « Night Watch » est plus abouti (contrastes vérifiés §2.6). |
| Rayons | `src/app/globals.css:24-28` | sm 6 · md 8 · lg 10 · xl 14 · 2xl 18 px | Les pages utilisent surtout `rounded-2xl` (18 px) et `rounded-full`. CMAS : 4/6/8/12/16, pas de pilule sauf les statuts. |
| Ombres | `src/components/ui/animated.tsx:181-186` (`shadowLevels`), `shadow-2xl` partout | `rgba(0,0,0,…)` noir pur | Contraire à §4.4 (ombres teintées navy). Garder `--shadow-e1..e3`. |
| Typo | `src/app/globals.css:59` (`system-ui`), `family-hero-banner.tsx:63` (`font-serif`), `login/page.tsx:73-75` (texte en dégradé) | Aucune famille déclarée | Baloo 2 / Plex Sans / Plex Mono restent la règle. |
| Utilitaires | `globals.css:67-72` (`.card-hover` translate-y, `.glass` backdrop-blur), `:75-81` (`.scrollbar-modern`), `:83-114` (fade/slide/**shimmer**), `:120-126` (marquee) | | Seul `.scrollbar-modern` (scrollbar fine) est neutre et réutilisable, avec les couleurs `--hairline-strong`. Le reste est à écarter (shimmer et glass sont interdits). |
| View Transitions | `src/app/view-transitions.css:1-30`, `src/lib/hooks/useViewTransition.ts:6-35` | Fondu + glissement de 20 px sur `root` (ancien **et** nouveau), coupé en reduced-motion | Le hook n'est **appelé nulle part** (grep). `router.push` dans `startViewTransition` n'attend pas le rendu RSC : la transition capture un état intermédiaire. |

### 2.2 Layout

| Entité | Source | Description |
|---|---|---|
| Shell | `src/components/layout/app-shell.tsx:6-21` | `flex h-screen` : sidebar + `main#main-content` scrollable + `SearchCommand` monté globalement. Exception pour `/login`. |
| Sidebar icônes « respirante » | `src/components/layout/app-sidebar.tsx:12-21` (couleurs par item), `:33-39` (largeur 64→200 au **survol**, ressort), `:57-68` (pilule dégradée + halo flou sur l'actif), `:88` (switcher de thème) | Chaque rubrique a son propre dégradé (ambre, bleu, émeraude, rose, violet…). |
| Sidenav alternative | `src/components/menus/sidenav/index.tsx:18-37`, `sidenav-footer.tsx:12-25` | Version sobre repliable par bouton (w-64 / w-16), avatar et déconnexion en pied. Proche de ce que CMAS a déjà, en moins bien (pas de tooltip, `<a>` au lieu de `Link`). |
| Héro cuivre | `src/components/ui/family-hero-banner.tsx:34-45` (photo + dégradé `amber-950/80→amber-900/60`, 2 halos `blur-[80px] animate-pulse`), `:26-31` + `:70-82` (proverbe tournant toutes les 5 s), `:85-90` (filet dégradé) | C'est l'écran « brun/cuivre » de la capture. |
| Sections numérotées 01/02/03 | `src/components/ui/family-showcase.tsx:13-17` (items), `:56-67` (numéro + titre en capitales `font-black`, décalage `translate-x-3` sur l'actif), `:26-38` (timeline **GSAP `repeat: -1`**), `:73` (halo `blur-[100px]`), `:75-93` (clipPaths SVG) | L'activation se fait **au survol seulement** (`onMouseEnter`), sans clavier ni focus. |
| Intro « scroll morph » | `src/app/intro/page.tsx:101-125` (`wheel` + `touchmove` en `preventDefault`, scroll virtuel), `:146-150` (phases par `setTimeout`), `:152-154` (dispersion `Math.random`), `:42-67` (cartes photo retournables 3D), `:201` (CTA pilule blanche) | Plein écran `bg-zinc-950`. |
| Dashboard « Foyer » | `src/app/page.tsx:61-107` | Empilement héro → showcase → spotlight → faits → 4 stats `SpotlightCard` → marquee de photos. |
| En-têtes de page | `src/app/statistiques/page.tsx:85-88`, `src/app/arbre/page.tsx:89-102`, `src/app/carte/page.tsx:79-89` | Bandeau `border-b bg-card` : pastille icône + titre + sous-ligne de comptage. |

### 2.3 Composants

| Entité | Source | Notes |
|---|---|---|
| Palette de recherche (réelle) | `src/components/search-command.tsx:33-41` (index MiniSearch flou), `:12-23` (`Highlight`), `:70-74` (flèches/Entrée), `:109-111` (aide clavier en pied), `:79` (`z-[200]`) | **Pas de cmdk** : overlay fait main, sans `role="dialog"` ni piège de focus. Le surlignage utilise `bg-yellow-200`. |
| Palette de commandes (pages) | `src/components/ui/command-palette.tsx:7-16` (liste statique), `:43-44` (glass `bg-slate-900/95 backdrop-blur-xl`), `:64-66` (kbd ⌘K / Esc) | **C'est l'ancêtre du fichier CMAS actuel.** |
| Combobox cmdk | `src/components/ui/combobox.tsx:20-53` | Seul usage réel de `cmdk` dans le projet. |
| Cloche de notifications | `src/components/notifications/notification-bell.tsx:10` (emojis), `:16-26` (lecture `localStorage`), `:34-48` (popover maison) | Badge compteur `bg-red-500`. |
| StatCard | `src/components/ui/stat-card.tsx:18-38` (compteur rAF **rejoué à chaque changement de valeur**), `:43-51` (squelette), `:73-79` (chip de tendance ±%), `:57` (backdrop-blur) | |
| TiltStatCard | `src/components/ui/tilt-stat-card.tsx:14-47` | Inclinaison 3D à la souris, dégradé slate, couleur en style inline. |
| SpotlightCard / CursorWander / Lamp / Shader / Glass hero | `spotlight-card.tsx`, `cursor-wander-card.tsx`, `lamp.tsx`, `shader-background.tsx`, `glassmorphism-trust-hero.tsx` | Effets décoratifs. |
| SectionCard | `src/components/ui/section-card.tsx:11-26` | Titre + description + slot droit. Équivalent CMAS : `dashboard-card.tsx`. |
| EmptyState | `src/components/ui/empty-state.tsx:17-31` | Centré, icône flottante en boucle infinie (`y: [0,-8,0]`), dégradé bleu→**violet**. |
| Squelette de route | `src/app/loading.tsx:1-17` | `loading.tsx` App Router : grille de 4 cartes + bloc. Couleurs `bg-zinc-100` en dur. |
| 404 | `src/app/not-found.tsx:1-16` | Centré, bouton `bg-zinc-900`. |
| Skip links | `src/components/ui/skip-links.tsx:3-22`, monté dans `src/app/layout.tsx:21` | `sr-only focus:not-sr-only`. **CMAS n'en a pas.** |
| Bandeau hors ligne | `src/components/offline/offline-banner.tsx:5-33`, `src/lib/hooks/use-offline-sync.ts` (file de mutations IndexedDB rejouée au retour réseau) | |
| Timeline horizontale | `src/app/timeline/page.tsx:118-122` (scroll-snap), `:59-75` (parallaxe JS), `:40-44` (emojis), `:81-87` (spinner centré) | |
| Timeline verticale | `src/components/ui/member-timeline.tsx:17-24` | Rail de 1 px + nœuds icônes ronds, stagger de 150 ms. CMAS a déjà `alert-timeline.tsx` et `ui/status-timeline.tsx`. |
| Globe cobe | `src/components/ui/cobe-globe.tsx:62-71` (`mapSamples: 16000`, teinte cuivre), `:72-77` (**rAF permanent**), `:28-50` (glisser), `:91` (polaroïds en CSS anchor positioning, `as any` ×4) ; `src/components/ui/globe-diaspora.tsx:16-33` (marqueurs Douala / Yaoundé / Bafoussam + arcs) | Dans `globe-diaspora`, les `arcs` sont déclarés mais **jamais passés** à `createGlobe` (`:81-90`). |
| Carte Leaflet | `src/components/carte/map-view.tsx:55-70` (ant-path + pulsation en `<style>` inline), `:73` (tuiles `tile.openstreetmap.org`), `:115-135` (curseur de décennie) ; `map-detail.tsx:22-40` (HTML de marqueur inline, icône `unpkg.com`) | |
| Page Carte | `src/app/carte/page.tsx:13-20` (table ville→coordonnées), `:91-121` (globe à gauche, **liste groupée par ville** à droite, `hidden lg:block w-72`) | Le schéma « visuel + liste latérale » est bon. |
| Arbre @xyflow | `src/app/arbre/page.tsx:17-33` (nœud personne), `:47-58` (layout dagre), `:106-116` (`fitView`, `MiniMap`, `Controls` restylés), `:120-137` (panneau de détail latéral en ressort), `:45` (`React.ComponentType<any>`) ; `src/lib/elk-layout.ts:1-31` (ELK en alternative) ; `src/components/arbre/tree-keyboard-nav.tsx:45-94` (`role="tree"`, `aria-activedescendant`, flèches / Home / Échap) | La navigation clavier est de bonne facture, et réutilisable. |
| Export PDF | `src/components/arbre/export-pdf-button.tsx` (`html-to-image` + `jspdf`, A3 paysage) | |
| Tableau infini | `src/components/ui/infinite-scroll-table.tsx:25-36` (IntersectionObserver), `:44,54` (colonne collante) ; `table-toolbar.tsx:17-39` ; `src/lib/hooks/useTableFilters.ts:10-33` (état local, pas d'URL) | |
| Badge à point | `src/components/ui/badge.tsx:26-37` | Variantes emerald / amber en palette brute. |
| Toasts maison | `src/components/ui/toast-system.tsx:16-49` (glass), `src/components/ui/toast.tsx:36-41` (toast avec action) | |
| ConfirmDialog | `src/components/ui/confirm-dialog.tsx:17-33` | Radix. `onConfirm()` puis fermeture. |
| Switcher de thème | `src/components/ui/cinematic-theme-switcher.tsx:39-60` | Neumorphisme en **styles inline**, particules. |
| Barre de complétude | `src/components/gamification/progress-bar.tsx:26` | `role="progressbar"` + aria-valuenow, correct. Badges en emoji. |

### 2.4 Motion et interaction

| Pattern | Source | Constat |
|---|---|---|
| Bibliothèque d'animations | `src/components/ui/animated.tsx` (604 lignes) : `ScrollReveal:53`, `StaggerContainer:93`, `PageTransition:156` (avec **exit**), `CountUp:229` (déclenché par `useInView once`), `MagneticHover:332`, `ParallaxLayer:383`, `PulseGlow:421`, `ShimmerText:465` | **Toutes** testent `useReducedMotion()`. C'est la bonne discipline, et AGENTS.md l'impose (ligne « All animations MUST check useReducedMotion »). |
| Panneau de réglage live | `src/components/dev/tuning-panel.tsx` (contexte `AnimConfig` persisté en `localStorage`), monté en prod dans `src/components/providers.tsx:17` | Outil de dev livré en production. |
| Élément partagé | `src/components/ui/shared-element-gallery.tsx:25,44` (`layoutId`), `:24` (glisser pour fermer) | Exige les features `layout` et `drag`. |
| Stagger d'entrée | `src/app/page.tsx:78` (délai 0,7 s + i×0,1), `carte/page.tsx:106` | Délais longs avant affichage de chiffres. |
| Boucles infinies | GSAP `family-showcase.tsx:33`, `empty-state.tsx:18`, halos `animate-pulse` `family-hero-banner.tsx:43-44`, marquee `page.tsx:91-104`, globe rAF | Mouvement permanent sans information (contraire au principe 5). |

### 2.5 Arbre-genealogique (version antérieure) : ce qui manque à omicron ou y est mieux fait

Chemins relatifs à `/home/f2g/Projets/Dev/Arbre-genealogique/frontend/src/`. L'ensemble est plus pauvre (Tailwind v3, `bg-white` / `gray-*` en dur, emojis dans `components/Sidebar.tsx:35,50`). Deux éléments sortent du lot :

- **`components/DraggableList.tsx:32-63`** : `@dnd-kit` avec `KeyboardSensor` + `sortableKeyboardCoordinates`. On obtient nativement le motif « saisir (Espace) / déplacer (flèches) / déposer / Échap » et des annonces `aria-live`. C'est exactement ce que la revue `draggable-widget-grid-review.md` §4.4 demandait à la place de `Alt+flèches`. C'est une alternative sérieuse au drag `domMax` pour la phase 2 du tableau de bord.
- **`utils/export.ts:39-80`** : export CSV / JSON côté client (Blob + lien). Le code est typé `any`, sans BOM ni échappement des guillemets, mais le principe est utile pour exporter la liste des alertes d'un incident.

Le reste (`Modal.tsx`, `Skeleton.tsx`, `Toast.tsx`, `EmptyState.tsx`) est en retrait par rapport à omicron comme à CMAS.

## 3. Mapping vers les écrans CMAS Hub

Verdicts : **ADOPTER** (reprise quasi directe), **ADAPTER** (reprise de l'idée, réécrite en tokens Berry × F2G), **ÉCARTER**.

| Écran CMAS | Entité omicron / Arbre | Verdict | Raison |
|---|---|---|---|
| **Palette de commandes** | `search-command.tsx` (Highlight, aide clavier, index de données) + `command-palette.tsx` (groupes) | **ADAPTER, priorité 1** | Le fichier CMAS actuel en est une copie non conforme. Il faut le reconstruire sur `components/ui/command.tsx` (cmdk, déjà présent) avec les 5 groupes de §4.2, et garder de l'original le surlignage et le pied « ↑↓ ↵ Esc ». Le surlignage en jaune est **interdit** (collision avec Severe) : utiliser `bg-primary-tint text-primary`. MiniSearch n'est pas utile, le score de cmdk suffit. |
| Palette | glass `bg-slate-900/95 backdrop-blur-xl` | ÉCARTER | Pas de glass (§1), pas de flou sur les overlays (§4.4). |
| **Shell (global)** | `skip-links.tsx` | **ADOPTER** | Il manque à CMAS. WCAG 2.4.1. Coût quasi nul. |
| Shell (global) | `offline-banner.tsx` (partie détection) | **ADAPTER** | Principe 6 : « le réseau est toujours visible ». Le navigateur hors ligne doit se voir **et** bloquer l'envoi. |
| Shell (global) | `use-offline-sync.ts` (file de mutations rejouée) | **ÉCARTER (sécurité)** | Rejouer un envoi d'alerte à la reconnexion = diffusion non voulue, potentiellement des heures plus tard. Aucune mutation CMAS ne doit être mise en file. |
| Shell (global) | PWA / service worker (`next.config.ts`, `layout.tsx:17`) | ÉCARTER | Un cache SW sert des données périmées : contraire à « stale data is never green ». |
| Shell / rail | `app-sidebar.tsx` (survol 64→200, dégradés par item, halo) | ÉCARTER | Couleurs décoratives dans la navigation, expansion au survol qui déplace la cible sous la souris. La rail Berry actuelle est meilleure. |
| Shell / top bar | `notification-bell.tsx` (popover « récentes ») | ADAPTER (mineur) | Aujourd'hui `ActiveAlertsBell` est un simple lien. Un popover listant les alertes `SENDING` + `FAILED` des dernières 24 h (API, pas `localStorage`), avec `SeverityBadge` sm, serait plus informatif. Emojis exclus. |
| Shell / thème | `cinematic-theme-switcher.tsx` | ÉCARTER | Styles inline, particules. Le menu radio Système / Clair / Sombre de `top-bar.tsx` convient. |
| Navigation | `view-transitions.css` + `useViewTransition.ts` | ÉCARTER | Doublon de `pageEnter`, anime la sortie (interdit §5.2), ajoute une capture d'écran avant chaque navigation (latence en incident), mal couplé au routeur RSC. À réévaluer seulement quand `<ViewTransition>` de React sera stable dans Next. |
| **États de route (toutes pages)** | `app/loading.tsx`, `app/not-found.tsx` | **ADAPTER** | CMAS n'a ni `loading.tsx`, ni `error.tsx`, ni `not-found.tsx`. Les squelettes doivent reprendre la mise en page (§6.12), en tokens. |
| **Login** | `login/page.tsx` (texte en dégradé, carte glass, halo curseur, pastilles ambre) | ÉCARTER | §7.1 : « pas de marketing, pas d'illustration, pas d'image de fond ». |
| Login | `intro/page.tsx` (scroll morph) | ÉCARTER | Scroll détourné (`preventDefault` sur `wheel`), aléatoire, photos, 3 s d'animation avant toute action. |
| **Dashboard** | `family-hero-banner.tsx` | ÉCARTER | « There is no welcome hero » (§7.2). Dégradés et halos interdits. |
| Dashboard | `family-showcase.tsx` (01/02/03) | ÉCARTER tel quel | GSAP infini, survol seul, photos. **L'idée typographique** est reprise dans le composeur (ligne suivante). |
| Dashboard | `stat-card.tsx` / `tilt-stat-card.tsx` / `SpotlightCard` | ÉCARTER | Chip de tendance interdit, compteur rejoué à chaque refetch (contraire à §5.2 « first mount only »), 3D, glass. `shared/count-up.tsx` + `kpi-flash` sont déjà conformes. |
| Dashboard | Marquee de photos, `family-fact`, `member-spotlight` | ÉCARTER | Pas de contenu décoratif sur une console. |
| **Composeur** | Numérotation « 01 / 02 / 03 » (`family-showcase.tsx:56-67`) | **ADAPTER** | §7.4 prévoit un index d'étapes collant à gauche (① Classe … ⑤ Vérification). On reprend le numéro en tête (Plex **Mono** `ink-3`, actif en `primary`) et le décalage de l'actif, sans GSAP, avec un scroll-spy au clavier. Aucune animation sur le chemin d'envoi. |
| Composeur / confirmation | `confirm-dialog.tsx` | ÉCARTER | `send-confirmation.tsx` porte les paliers §6.7. Ne pas introduire de second dialogue générique près de l'envoi. |
| **Liste des alertes** | `infinite-scroll-table.tsx` | ÉCARTER | §7.3 impose une pagination numérotée, partageable par URL. Le défilement infini casse « ligne 12 de la page 3 » en incident. |
| Liste des alertes | `useTableFilters.ts` | ÉCARTER | État local. CMAS doit synchroniser les filtres dans l'URL (§7.3). |
| Liste des alertes | `utils/export.ts` (Arbre) + `export-pdf-button.tsx` | **ADAPTER** | Export CSV des alertes filtrées (BOM UTF-8, séparateur `;` pour Excel FR, échappement). Pour le rapport d'incident : feuille `@media print` plutôt que `html-to-image` + `jspdf` (+150 ko, rendu raster non sélectionnable). |
| **Détail d'alerte** | `member-timeline.tsx`, `timeline/page.tsx` | ÉCARTER | `ui/status-timeline.tsx` et `alerts/alert-timeline.tsx` existent déjà et suivent §6.10. La timeline horizontale à parallaxe est illisible pour un journal. |
| Détail d'alerte | `shared-element-gallery.tsx` (`layoutId` liste→détail) | ÉCARTER | Exige `domMax`. Principe 5 : l'orientation est déjà donnée par `pageEnter`. |
| **Modèles** | `combobox.tsx` (cmdk) | ADOPTER le motif | Pour « Charger un modèle ▾ » dans le composeur : combobox cmdk en `Popover` base-ui (`render=`), groupé par classe. |
| Modèles | `DraggableList.tsx` (Arbre) | ÉCARTER ici | Modèles partagés, pas de champ d'ordre (même conclusion que la revue précédente). |
| **Cellules** (route à créer) | Mise en page `carte/page.tsx:91-121` (visuel + liste groupée) | **ADAPTER** | Carte **plate** des 10 régions du Cameroun en SVG statique + liste latérale groupée par région, avec les points de statut. Pas de globe. |
| Cellules | `cobe-globe.tsx` / `globe-diaspora.tsx` | **ÉCARTER** | Le Cameroun occupe environ 11° × 8° : sur un globe, 124 cellules se superposent en un seul point. WebGL avec rAF permanent sur des postes ministériels. Rotation automatique = mouvement sans information. `CellSiteResponse` n'a pas de coordonnées (`location: string \| null`). |
| Cellules | `map-view.tsx` / `map-detail.tsx` (Leaflet) | ÉCARTER | Tuiles `tile.openstreetmap.org` et icônes `unpkg.com` : requêtes vers des domaines externes, potentiellement filtrés sur les postes ministériels (même argument que pour Google Fonts dans la revue précédente). Pulsations infinies, HTML inline. |
| Cellules / topologie | `arbre/page.tsx` + `tree-keyboard-nav.tsx` + `elk-layout.ts` | **ADAPTER (phase 3, conditionnel)** | Vue « Topologie » Hub → CBC → régions → eNB, en lecture seule, chargée à la demande. Ne vaut la dépendance que si Arnaud la valide pour la formation et le diagnostic. |
| Cellules | `progress-bar.tsx` (`role="progressbar"`) | ADOPTER le balisage | À appliquer à la barre de disponibilité de `NetworkCard` (`app-rail.tsx`), qui n'a aucun rôle ARIA aujourd'hui. |
| **Paramètres** (route à créer) | `section-card.tsx` | ÉCARTER | `dashboard-card.tsx` couvre le besoin. |
| Paramètres | `tuning-panel.tsx` | ÉCARTER | Réglage live de l'animation livré en prod. Les tokens `lib/motion.ts` sont figés par DESIGN.md. |
| **ActiveAlertBanner** | aucune entité équivalente | — | omicron n'a rien de comparable. À construire d'après §6.9. Le bandeau hors ligne (candidat 3) doit s'**empiler sous** lui et ne jamais le masquer. |
| États vides | `empty-state.tsx` | ÉCARTER | `shared/states.tsx` est conforme (§6.12). L'original est centré, animé en boucle et en dégradé violet. |
| Global | `animated.tsx` : discipline `useReducedMotion` | ADOPTER la règle, pas les composants | Aucun `ScrollReveal`, `Magnetic`, `Parallax`, `PulseGlow` ni `ShimmerText`. Le `MotionConfig reducedMotion="user"` global de CMAS couvre déjà les `m.*`. Il reste à appliquer le test pour recharts et les keyframes CSS. |
| Global | `.scrollbar-modern` (`globals.css:75-81`) | ADAPTER | Scrollbar fine en `--hairline-strong` pour la liste des cellules du sélecteur et les popovers. |

## 4. Plans d'adaptation des meilleurs candidats

Règles communes :
- `motion/react` → `framer-motion` ; `motion.*` → `m.*`.
- Aucun `LazyMotion` local : celui d'`app-providers.tsx` (`domAnimation`, strict) suffit.
- `AnimatePresence` et `exit` fonctionnent avec `domAnimation`. `layout` / `layoutId` / `drag` exigent `domMax` et sont donc à éviter.
- Classes Tailwind statiques uniquement, via `cn` de `@/lib/utils` (ou du paquet `cn`, déjà utilisé par les primitives ui).
- base-ui : `render={<Link …/>}`, jamais `asChild`.
- Pas de `any`.

### 4.1 Palette de commandes cmdk (priorité 1, sans dépendance)

**Constat sur le fichier actuel `src/src/components/ui/command-palette.tsx`** :
- overlay fait main, sans `role="dialog"`, sans piège de focus ni restitution du focus ;
- `z-[100]` au lieu de `z-[var(--z-palette)]` ;
- `max-w-lg` au lieu de `max-w-[640px] top-[18vh]` ;
- `<input>` et `<button>` natifs ;
- `LazyMotion` imbriqué (l. 59) ;
- liens `/cells` et `/settings` qui mènent à des 404 ;
- pas de groupes « Alertes récentes / Cellules / Modèles ».

**Plan** :
1. Créer `src/src/components/shell/command-palette.tsx`, bâti sur `CommandDialog` / `CommandInput` / `CommandList` / `CommandGroup` / `CommandItem` / `CommandShortcut` de `components/ui/command.tsx`. Supprimer `components/ui/command-palette.tsx` et mettre à jour l'import dans `app/(dashboard)/layout.tsx`.
2. Données :
   - `useAlerts({ limit: 8 })` : alertes récentes, avec `SeverityBadge` sm, ID mono et point de statut ;
   - `useCells()` : nom, CID en mono et point de statut ;
   - un hook modèles s'il existe, sinon groupe masqué ;
   - des actions statiques : Nouvelle alerte `N`, Vérifier les cellules, Basculer le thème.
   Requêtes activées seulement quand la palette est ouverte (`enabled: open`).
3. Reprendre de `omicron/search-command.tsx:12-23` un composant `Highlight` typé, en `mark` `bg-primary-tint text-primary rounded-xs`, **jamais en jaune**. Reprendre aussi le pied d'aide `:109-111` (« ↑↓ naviguer · ↵ ouvrir · Esc fermer ») en `kbd` mono sur `bg-surface-sunken`.
4. Raccourcis : `Ctrl/⌘+K`, plus `G D/A/T/C/S` et `N`, **désactivés** si le focus est dans un champ ou si un dialogue est ouvert (§4.2). Le déclencheur `⌘K` va dans `top-bar.tsx`, en remplacement ou à côté du champ de recherche actuel.
5. **Règle de sécurité** : aucune `CommandItem` ne peut envoyer, programmer ou annuler. « Utiliser le modèle… » ouvre `/alerts/new?template=<id>` et s'arrête là. Un test vitest vérifie qu'aucun `onSelect` n'appelle de mutation.
6. Motion : l'animation du `Dialog` shadcn suffit (overlay `dur.base`, panneau `scale .98→1`, `dur.moderate`). Pas de `m.*` supplémentaire.
7. Masquer les entrées vers `/cells` et `/settings` tant que ces routes n'existent pas (ou créer d'abord des pages minimales).

### 4.2 Liens d'évitement (sans dépendance)

- Créer `src/src/components/shell/skip-links.tsx` avec 2 liens : « Aller au contenu principal » → `#main-content` et « Aller à la navigation » → `#main-nav`. Sur `/alerts/new`, ajouter « Aller au message » → `#composer-message`.
- Classes : `sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--z-palette)] focus:rounded-sm focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-ink focus:shadow-e2`. Le focus visible est celui du `:focus-visible` global.
- Modifier `app-shell.tsx` : `<main id="main-content" tabIndex={-1}>` et monter `<SkipLinks />` en premier enfant. Modifier `app-rail.tsx` : `id="main-nav"` sur le `<nav>`.

### 4.3 Bandeau de connexion (sans dépendance, sans file)

- Créer `src/src/hooks/use-online.ts` avec `useSyncExternalStore` sur les événements `online` / `offline`. Retourne `false` côté serveur, sans effet de bord.
- Créer `src/src/components/shell/connection-banner.tsx`. Il s'affiche si `!online`, **ou** si la requête `useCells` / `useStats` est en erreur réseau depuis plus de 30 s.
  - Rendu : 40 px, `bg-st-failed-tint text-st-failed-fg border-b border-st-failed/40`, icône `WifiOff`, texte « Connexion au Hub perdue · les données affichées datent de HH:mm · l'envoi est désactivé ».
  - `role="status" aria-live="assertive"` à l'apparition uniquement. Couleurs de **statut**, pas de sévérité.
- Le monter dans `app-shell.tsx`, juste sous `EnvRibbon`, `z-[var(--z-banner)]`, **sous** l'`ActiveAlertBanner` le jour où il existera.
- Dans `components/composer/send-confirmation.tsx` et le bouton « Vérifier et diffuser » : `disabled` avec motif visible si `!online`. On ne met **jamais** rien en file. Au retour, invalider `queryClient` (`invalidateQueries()`) et afficher un toast neutre sonner (sans `richColors`).
- Motion : aucune. Le bandeau apparaît instantanément, car c'est une alarme, pas une décoration.

### 4.4 États de route : `loading.tsx`, `error.tsx`, `not-found.tsx` (sans dépendance)

- `src/src/app/(dashboard)/loading.tsx` : squelette du tableau de bord (panneau KPI à la taille des chiffres, timeline en points + 2 lignes, matrice), via `components/ui/skeleton.tsx`.
- `src/src/app/(dashboard)/alerts/loading.tsx` : 8 lignes de 44 px (bloc badge 64 px, texte 60 %, pilule 56 px), comme §6.12.
- `src/src/app/(dashboard)/error.tsx` (`"use client"`) : réutilise `ErrorState` de `shared/states.tsx` avec `reset` comme `onRetry`. Il reste **dans le puits**, pour que la rail et la top bar restent utilisables.
- `src/src/app/not-found.tsx` : `EmptyState` aligné à gauche, icône `SearchX`, « Page introuvable », action `LinkButton` « Tableau de bord ». Pas de « 404 » géant.
- Corriger au passage `components/ui/skeleton.tsx` : `bg-surface-sunken dark:bg-surface-raised` au lieu de `bg-muted` (§6.12), et `motion-reduce:animate-none` (déjà couvert en CSS global, mais explicite).

### 4.5 Index d'étapes numéroté du composeur (inspiré de « 01 / 02 / 03 »)

- Créer `src/src/components/composer/step-index.tsx`, utilisé par `app/(dashboard)/alerts/new/page.tsx` dans la colonne `lg:col-span-2 sticky`.
- Chaque étape est un `Link` d'ancre (`#step-class` …) :
  - numéro `01`…`05` en `font-mono text-[12.5px] tabular-nums` ;
  - `ink-3` au repos, `text-primary` si l'étape est active ;
  - libellé en `title-3` ;
  - à droite, l'état : `CircleCheck` `text-st-sent-fg` si valide, sinon le compteur (« 42 » cellules, « 30 min »).
- L'étape active est signalée par un fond `bg-navy-tint rounded-md` et un décalage `translate-x-1` en **CSS** (`transition-transform duration-150`), pas par un `layoutId` (qui exige `domMax`).
- Scroll-spy : `IntersectionObserver` sur les sections, `aria-current="step"`. Navigable au clavier (ce que l'original ne permettait pas).
- Écarté : GSAP, clipPaths, halos, capitales `font-black`. Baloo 2 est réservé au H1.

### 4.6 Écran Cellules : carte régionale SVG + liste (sans dépendance)

**Préalable** : la route `/cells` n'existe pas, alors que la rail et la palette y pointent.

1. Créer `src/src/lib/cmas/regions.ts`. Il contient les 10 régions (Adamaoua, Centre, Est, Extrême-Nord, Littoral, Nord, Nord-Ouest, Ouest, Sud, Sud-Ouest) avec leur chef-lieu, et une fonction `regionOf(cell): RegionKey | "unknown"`. Celle-ci déduit la région de `location` (« Yaoundé · Centre ») en attendant un champ `region` ou des coordonnées côté backend. C'est l'équivalent typé de `cityCoords` d'omicron (`carte/page.tsx:13-20`).
2. Créer `src/src/components/cells/region-map.tsx`. SVG statique des contours régionaux (tracé simplifié, environ 10 `path`, embarqué, sans requête externe), où chaque région est un bouton focusable.
   - Remplissage `fill-surface-sunken`, contour `stroke-hairline-strong`.
   - Pastille de comptage `118/124` en mono. S'il y a au moins une cellule hors ligne dans la région : liseré `stroke-st-failed` + icône `SignalZero`.
   - **Aucune couleur de sévérité**, aucun dégradé choroplèthe, aucune animation.
   - Tooltip base-ui avec la liste des cellules hors ligne.
3. Créer `src/src/app/(dashboard)/cells/page.tsx`. Carte à gauche (`lg:col-span-5`), liste à droite (`lg:col-span-7`) groupée par région, avec en-têtes `overline` collants. Chaque groupe contient des `CellSiteTile` (§6.11), triés hors ligne d'abord puis par nom.
   - Cliquer une région filtre la liste (`?region=centre` dans l'URL).
   - C'est le schéma « visuel + liste latérale » de `carte/page.tsx:91-121`, en sens inverse (la liste est l'outil, la carte l'orientation).
4. Réutilisation dans le composeur : le mode `region` de `CellTargetSelector` (§6.5) peut afficher la même carte en petit pour cocher une région entière.

### 4.7 Topologie réseau @xyflow (phase 3, conditionnelle)

**Dépendance** : `@xyflow/react` (environ 55 ko gzip, plus sa CSS), **seulement** si l'écran est validé. Pas de `dagre` ni d'`elkjs` : l'arbre Hub → CBC → 10 régions → N eNB se positionne par calcul radial ou en colonnes, en 30 lignes.

- Créer `src/src/components/cells/topology-view.tsx`, chargé par `next/dynamic(() => import(...), { ssr: false })` dans un onglet « Topologie » de `/cells`. La CSS `@xyflow/react/dist/style.css` est importée dans ce seul module.
- Réglages : `nodesDraggable={false}`, `nodesConnectable={false}`, `elementsSelectable`, `fitView`, `proOptions.hideAttribution` (vérifier la licence MIT et l'usage pro), `minZoom` borné.
- Les nœuds sont des composants typés `NodeProps<Node<CellNodeData, "enb">>` (pas de `ComponentType<any>` comme `arbre/page.tsx:45`).
  - Point de statut + nom + CID en mono.
  - Liens `stroke-hairline-strong`, et `stroke-st-failed` en pointillé si la cellule est hors ligne.
  - Nœuds régionaux regroupés et repliables : on n'affiche pas 124 feuilles d'un coup.
- Accessibilité : reprendre `tree-keyboard-nav.tsx:45-94` (`role="tree"`, `aria-activedescendant`, flèches / Home / Échap), adapté à la hiérarchie Hub → région → cellule. Garder la liste de §4.6 comme alternative textuelle complète.
- Restyler `MiniMap` / `Controls` en tokens (`bg-surface border-hairline`), et non par `!important` comme `arbre/page.tsx:114-115`. Pas de panneau latéral en ressort : on réutilise `Sheet`.
- **Hors périmètre** : toute action (redémarrer un eNB, pousser une configuration) depuis la topologie. C'est une vue de diagnostic.

### 4.8 Export CSV et rapport d'incident imprimable (sans dépendance)

- Créer `src/src/lib/export/csv.ts`, typé `toCsv<T>(rows: readonly T[], columns: readonly { header: string; value: (r: T) => string }[]): string`.
  - BOM `﻿`, séparateur `;`, guillemets doublés, dates en WAT ISO.
  - C'est la version propre de `Arbre-genealogique/frontend/src/utils/export.ts:61-80`.
- Ajouter un bouton `outline sm` « Exporter (CSV) » (icône `FileDown`) dans l'en-tête de la liste des alertes. Il exporte les filtres courants de l'URL, avec le même plafond explicite que l'historique (« 2 000 alertes max »).
- Rapport d'incident : `@media print` dans `globals.css`, qui masque la rail, la top bar et les rubans, et force le fond blanc et `ink`. Les badges de sévérité restent lisibles en niveaux de gris grâce à l'icône + le libellé + l'ID mono (principe 2). Pied « F2G Laboratory | Confidential ». Pas de `jspdf` / `html-to-image`.

## 5. Risques et ordre d'implémentation

### 5.1 Risques

| Risque | Gravité | Mitigation |
|---|---|---|
| Reprendre les couleurs omicron par copier-coller (`#2563EB`, `amber-*`, `emerald-*`, `yellow-200`) | Élevée : collision avec SENDING, ETWS et Severe | Revue : aucune classe palette brute (`grep -E "(blue\|amber\|emerald\|yellow\|slate\|zinc)-[0-9]"` en CI). |
| Mettre des envois en file hors ligne (`use-offline-sync`) | **Critique** : diffusion différée non voulue | Interdiction écrite (§4.3). Le bouton d'envoi est désactivé hors ligne. Test vitest. |
| La palette de commandes devient un chemin d'envoi | **Critique** | Aucune mutation dans `onSelect` (§4.1, point 5) + test. |
| Deux sources de `cn` coexistent : le paquet `cn@0.4` (remplaçant déclaré de clsx + tailwind-merge, utilisé par les primitives `components/ui/*`) et `@/lib/utils` (shell, shared) | Faible : cohérence | Pas de bug identifié. Choisir une seule source pour le nouveau code (les plans ci-dessus utilisent `@/lib/utils`) et harmoniser plus tard. |
| `layoutId="rail-active"` dans `app-rail.tsx` sous `LazyMotion features={domAnimation} strict` | Faible : l'indicateur saute au lieu de glisser (les animations `layout` sont dans `domMax`) | Accepter le saut (conforme au mode reduced-motion) ou documenter l'écart §5.2. Ne pas charger `domMax` globalement pour ça. |
| Routes `/cells` et `/settings` absentes alors que la rail et la palette y mènent | Moyenne : 404 en démonstration | Pages minimales (EmptyState « Bientôt disponible ») avant la palette, ou masquer les entrées. |
| Carte régionale sans coordonnées backend | Moyenne | `regionOf()` tolérant, avec un groupe « Région inconnue » visible. Demander au backend un champ `region` sur `CellSiteResponse`. |
| @xyflow : poids, CSS globale, licence | Moyenne | Chargement à la demande dans un seul onglet. Décision go/no-go d'Arnaud avant d'ajouter la dépendance. |
| View Transitions ajoutées plus tard « pour le style » | Faible à moyenne | Écarté ici. `pageEnter` reste l'unique transition de page. |
| Tracé SVG du Cameroun : exactitude et licence | Faible | Source en domaine public (Natural Earth, admin-1), simplifiée et citée en en-tête. |

### 5.2 Ordre recommandé

1. **Correctifs de fond (0,5 j)** : pages minimales `/cells` et `/settings`, `role="progressbar"` sur la barre de `NetworkCard`.
2. **Palette de commandes cmdk (1 j)**, §4.1 : remplace le fichier copié d'omicron. C'est le plus fort gain de conformité.
3. **Liens d'évitement + `loading` / `error` / `not-found` (0,5 j)**, §4.2 et §4.4.
4. **Bandeau de connexion + blocage de l'envoi hors ligne (0,5 j)**, §4.3. C'est un apport de sécurité opérateur.
5. **Index d'étapes du composeur (0,5 j)**, §4.5, avec la mise en page §7.4.
6. **Écran Cellules : liste par région + carte SVG (2 j)**, §4.6.
7. **Export CSV + feuille d'impression (0,5 j)**, §4.8.
8. **Option, après validation : topologie @xyflow (2 j)**, §4.7. Pour la phase 2 du tableau de bord personnalisable, comparer `@dnd-kit` (clavier et annonces natifs, cf. `Arbre-genealogique/frontend/src/components/DraggableList.tsx`) au drag `domMax` retenu dans la revue précédente.

Total hors option : environ 5,5 jours, **sans nouvelle dépendance**.
