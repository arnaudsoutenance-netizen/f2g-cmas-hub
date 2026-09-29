# Revue candidate : `DraggableWidgetGrid` (21st.dev)

> 2026-09-29 · Analyse en lecture seule, aucun code modifié · Réf. : `docs/DESIGN.md` (note « Berry × F2G »), `src/src/app/(dashboard)/page.tsx`, `src/src/components/dashboard/*`, `src/src/components/providers/app-providers.tsx`

## 1. Verdict rapide

**Oui, mais uniquement sur le tableau de bord, en lecture seule par défaut.** Le composant apporte une bonne base technique : un tiler exact, un ordre DOM stable et une navigation clavier. En revanche, la personnalisation ne fait pas partie du cœur du métier. Un opérateur de la Protection civile ne gagne rien à déplacer une carte pendant un incident. Il y gagne un peu en temps calme, par exemple pour mettre « Programmées » en tête s'il gère surtout les tests mensuels. La grille doit donc d'abord servir de **mise en page Berry fixe**, avec `editable=false`. La personnalisation reste un bonus derrière un bouton « Personnaliser ».

## 2. Pertinence produit

**Qui réorganise ?** L'opérateur ministère ou Protection civile, sur son propre poste, hors crise. Ni l'administrateur pour les autres, ni une disposition partagée : une disposition imposée à tous ne se personnalise pas, elle se *conçoit*, et c'est le rôle de DESIGN.md.

**Pendant un incident**, la disposition doit rester strictement immobile. Plusieurs risques existent :
- **Glissement accidentel.** Un clic-glisser involontaire à la souris pendant qu'on vise « Toutes les alertes → » déplace une carte, et le repère visuel de l'opérateur disparaît au pire moment.
- **Postes partagés.** En salle de crise, plusieurs opérateurs se relaient sur un même poste. Une disposition personnelle surprend le suivant. D'où la clé par utilisateur et le bouton « Réinitialiser ».
- **Réflexes spatiaux.** Un opérateur formé sur « les échecs sont en bas à droite » doit les retrouver au même endroit. Le mode lecture est donc le défaut et la disposition par défaut est documentée dans le guide utilisateur.

**Là où la grille apporte de la valeur :** au tableau de bord, qui est un écran de synthèse sans action d'envoi, avec des cartes de tailles hétérogènes. Le tiler Berry y remplace proprement la grille `lg:grid-cols-12` écrite à la main.

**Là où elle est nuisible, et donc exclue :**
- **Composeur de nouvelle alerte** (sélecteur de classe, message, jauge GSM-7/UCS-2, cellules, durée, aperçu). L'ordre du formulaire *est* le protocole de saisie. Le déplacer casse le principe 3 (« ce que tu vois est ce que le téléphone affiche ») et la formation.
- **Dialogue de confirmation par paliers** et tout ce qui touche au chemin d'envoi (§5.3). Aucun geste de glisser, aucun appui long, aucun ressort ne doit exister à proximité d'un bouton qui diffuse.
- **`ActiveAlertBanner` et le bouton « Nouvelle alerte ».** Ils restent **hors** de la grille, fixes dans l'en-tête de page.

## 3. Placement recommandé : tableau de bord « Berry × F2G »

### 3.1 Disposition par défaut (4 colonnes, 16 cellules, sans trou)

```
┌ hero-sent (wide) ────────┐┌ hero-cells (wide) ───────┐
├ alerts-by-month (lg) ────┤├ recent (tall) ┤├ cells (tall) ┤
│                          ││               ││              │
├ success ┤├ today ─┤├ failures ┤├ scheduled ┤
```

En en-tête de page, hors grille : le titre, la date en WAT, le bouton `Personnaliser` (outline sm) et le bouton `Nouvelle alerte` (primary).

### 3.2 Liste des widgets (données API réelles uniquement)

| id | size | label | Contenu | Source |
|---|---|---|---|---|
| `hero-sent` | wide | Alertes envoyées | Carte héros **navy `#1F3864`** avec cercles décoratifs. Grand chiffre `alerts.sent`, puis une ligne secondaire : `alerts.total` au total et `today.sent` aujourd'hui. Aucun chip de tendance (DESIGN interdit les tendances inventées). | `useStats()` |
| `hero-cells` | wide | Cellules actives | Carte héros **orange profond `#B85418`**. `cells.active / cells.total`, puis « N hors ligne » avec une icône `WifiOff`, jamais un vert. Si les stats sont périmées ou en erreur, la carte bascule en neutre avec « données du HH:mm » (règle « stale data is never green »). | `useStats()` |
| `alerts-by-month` | lg | Alertes par mois | Barres empilées recharts sur les 12 derniers mois, une pile par **classe** (`classifyMessageId(message_id)` → couleurs `--sev-*-edge`, la seule place légitime de la sévérité ici). Mois = `sent_at ?? scheduled_at ?? created_at`. Légende avec icône et libellé (principe « dire deux fois »). Mention « calculé sur N alertes » sous le graphe. | Liste des alertes paginée, agrégée côté client (§5.5) |
| `recent-alerts` | tall | Alertes récentes | Les 5 dernières : `SeverityBadge` sm, message ID en mono, extrait tronqué sur 1 ligne, `AlertStatusPill`, heure relative. Lien « Toutes les alertes → ». Reprend `AlertTimeline` en version compacte. | `useAlerts({ limit: 5 })` |
| `cell-matrix` | tall | Réseau | La matrice de carrés de 8 px déjà existante (`NetworkPanel`), avec compteurs actives / hors ligne / maintenance et la liste des cellules hors ligne. | `useCells()` (15 s) |
| `success-rate` | sm | Taux de succès | `success_rate` avec la logique existante `hasDeliveries` (affiche « — » si rien n'a été envoyé) et la même tonalité (`text-danger` < 90 %, `sev-severe-fg` < 95 %). | `useStats()` |
| `today` | sm | Aujourd'hui | `today.sent` envoyées et `today.scheduled` programmées. | `useStats()` |
| `failures` | sm | Échecs | `alerts.failed` et lien vers la dernière alerte en échec (ID mono + date). Lien `/alerts?status=FAILED`. | `useStats()` + `useAlerts({ status: "FAILED", limit: 1 })` |
| `scheduled-queue` | sm | File programmée | Les 3 prochaines alertes `SCHEDULED` triées par `scheduled_at`, en heure absolue WAT (pas de compte à rebours). | `useAlerts({ status: "SCHEDULED", limit: 3 })` |

Les brouillons restent accessibles par la liste des alertes. Un widget `drafts` peut s'ajouter plus tard si les opérateurs le demandent.

### 3.3 Règles d'édition

- **Édition désactivée par défaut.** Le bouton `Personnaliser` (icône `LayoutGrid`) passe en mode édition, qui affiche une barre avec `Terminer` (primary) et `Réinitialiser` (ghost, `RotateCcw`). Le mode édition n'est jamais persisté : un rechargement de page le quitte.
- **En mode édition,** le contenu des widgets est rendu `inert` pour qu'aucun lien, tooltip ou clic sur une cellule ne soit actionnable pendant un déplacement. Une poignée `GripVertical` et un fond `bg-surface-sunken` signalent l'état.
- **Sortie automatique** du mode édition dès qu'une alerte passe en `SENDING`, c'est-à-dire dès que l'`ActiveAlertBanner` apparaît.
- **Réordonnancement seulement.** Ni masquage ni redimensionnement en v1. Les tailles sont définies dans le code, pas par l'utilisateur. Un opérateur ne peut donc pas « perdre » le widget Échecs.
- **Persistance dans localStorage par utilisateur.** Clé `cmas.dashboard.layout.v1:<user.id>`, qui ne stocke que le tableau ordonné des `id`. Au chargement, on valide contre la liste connue : les id inconnus sont supprimés, les id manquants ajoutés à la fin. Si la version change, on revient au défaut. C'est la même approche que `app-shell.tsx` pour la barre latérale repliée. Une synchronisation côté serveur (préférences utilisateur) n'est à envisager que si les opérateurs changent souvent de poste.
- **Réinitialiser** supprime la clé et rejoue la disposition du §3.1 sans confirmation. L'action est sans risque et réversible.

### 3.4 Mobile et tablette

- Si le conteneur fait moins de 2 × `cellSize` + `gap` (en pratique sous `md`), on force `editable=false` et on masque `Personnaliser`. L'appui long de 350 ms entre en conflit avec le défilement et reste un geste caché. Sur téléphone, on affiche l'ordre **par défaut**, ignorant l'ordre personnalisé, pour que l'écran reste prévisible.
- En 1 colonne, les carrés deviennent pleine largeur (environ 360 px de haut), ce qui est trop haut pour `sm`. En dessous de `md`, on sort du tiler et on rend une simple pile `space-y-4` avec des hauteurs naturelles, via le même `renderItem`.
- En tablette (2 colonnes), le tiler fonctionne bien et l'édition est autorisée à la souris ou au stylet.

## 4. Exigences d'intégration

### 4.1 Motion : réécrire vers `m.*` de `framer-motion` (choix retenu)

- **Ajouter le paquet `motion` ne corrige rien.** `<LazyMotion strict>` lève l'erreur sur *tout* `motion.div`, quel que soit le paquet d'où il vient. Il faudrait de toute façon passer à `m.div`.
- **`motion/react` et `framer-motion` sont le même moteur.** Installer les deux fait courir le risque de deux copies en bundle si les versions divergent, avec deux contextes `MotionConfig`. Dans ce cas, `reducedMotion="user"` ne s'appliquerait **plus** au composant. C'est inacceptable.
- **La réécriture est mécanique :** `motion.div` → `m.div`, imports `MotionConfig` et `useDragControls` depuis `"framer-motion"`. On supprime le `MotionConfig` interne au composant : celui de l'app suffit, et un `MotionConfig` imbriqué pourrait écraser `reducedMotion`.
- **Point bloquant à ne pas rater : les features.** `domAnimation` n'inclut **ni `drag` ni les animations `layout`**. Si le composant utilise `drag`, `dragControls` ou `layout`, il faut `domMax`. Il ne faut pas le charger globalement (+ environ 10 ko pour toute l'app). On l'enveloppe d'un `LazyMotion` local, avec chargement asynchrone `features={() => import("./motion-max").then(r => r.default)}`, **uniquement quand le mode édition est actif**. En mode lecture, aucun drag n'est nécessaire.
- **Transitions :** on remplace les ressorts du composant par les tokens `spring.layout` (reflow) et `spring.snappy` (soulèvement) de `lib/motion.ts`. Le soulèvement se limite à `scale: 1.02`, sans rotation, avec l'ombre `shadow-e2`.
- **On supprime le décalage de montage par widget.** L'entrée de page (`pageEnter`) anime déjà le conteneur. Neuf cartes qui arrivent en cascade, c'est de la décoration (principe 5), et un refetch ne doit jamais relancer d'animation.
- **Pas d'animation au redimensionnement de fenêtre.** Un changement du nombre de colonnes se fait instantanément. Les ressorts sont réservés aux déplacements initiés par l'utilisateur.

### 4.2 Tokens de thème

| Composant | Notre chaîne | Valeur clair / sombre | Commentaire |
|---|---|---|---|
| `bg-card` | `--card` → `--surface` | `#FFFFFF` / `#111A2C` | Carte blanche sur le puits gris `--well` (`#EEF2F6` / `#0A1120`), exactement le rendu Berry. |
| `text-card-foreground` | `--card-foreground` → `--ink` | `#0E1A30` / `#F3EEE6` | OK. |
| `ring-border` | `--border` → `--hairline` | `#E3DCD0` / `#1F2B44` | OK pour le contour décoratif. Utiliser `ring-1 ring-inset`. |
| `ring-ring` | `--ring` → `--focus` | `#2E62D9` / `#7FA6FF` | Anneau de focus : 2 px + 2 px de décalage (`ring-offset-well`, puisque le fond est le puits). |
| Cartes héros | `bg-navy-deep` / `bg-orange-deep` | `#1F3864` / `#B85418` | Texte `text-rail-ink` (`#F3EEE6`, identique dans les deux thèmes). **Ne pas** utiliser `text-primary-fg`, qui devient navy en sombre. Les cercles décoratifs passent en `bg-white/10`, avec `bg-brand-orange/40` autorisé *sur le navy* uniquement. |

- **`radius`** est aligné sur `--radius-lg`. On passe la valeur numérique au composant ou on le modifie pour qu'il accepte `var(--radius-lg)`.
- **`gap`** : 24 px à partir de `lg`, 16 px en dessous, conformément au rythme de DESIGN.md.

### 4.3 Nettoyage de la démo

- On supprime toute la démo « AI agent observability » : les 8 widgets simulés, les générateurs de données et les `setInterval`.
- On supprime les classes de palette brutes (`blue-*`, `emerald-*`, `amber-*`, `rose-*`), interdites par DESIGN.md. Les statuts passent en `st-*` et les classes d'alerte en `sev-*` uniquement.
- On supprime l'import Google Fonts de JetBrains Mono. La police mono de l'app (`font-mono`, déjà définie) sert aux message ID. Il ne faut aucune requête vers un domaine externe : les postes ministériels peuvent être filtrés.
- Le composant est copié dans `src/src/components/dashboard/widget-board/` comme code maison (kebab-case, TypeScript strict, sans `any`). **Vérifier la licence** de l'auteur sur 21st.dev avant de le copier et la citer en en-tête de fichier.

### 4.4 Accessibilité et mouvement réduit

**À conserver :**
- l'ordre DOM stable pendant un glisser ;
- `aria-posinset` et `aria-setsize` (dans un `role="list"`) ;
- la navigation clavier ;
- l'anneau de focus via `ring-ring`.

**À changer :**
1. **`Alt+←` / `Alt+→` correspond à « Page précédente / suivante »** dans Chrome et Firefox sous Windows et Linux. Si le `preventDefault` échoue, l'opérateur quitte la page. On remplace par le motif « saisir, déplacer, déposer » : `Espace` ou `Entrée` saisit, les flèches déplacent, `Espace` dépose, `Échap` annule. Ce mode n'est actif **qu'en édition**.
2. **Annonces vocales.** Une région `aria-live="polite"` annonce chaque action, par exemple « Échecs, déplacé en position 3 sur 9 », « Déposé », « Annulé ».
3. **Hors édition, les widgets ne sont pas focusables** (pas de `tabIndex=0` sur le conteneur). Sinon, un élément focusable contient des liens et des déclencheurs de tooltip, ce qui crée des contrôles interactifs imbriqués et double les arrêts de tabulation.
4. **En lecture, l'ordre DOM doit égaler l'ordre visuel** (WCAG 1.3.2 et 2.4.3). Il faut vérifier que passer le tableau réordonné à `items` réordonne bien le DOM. Sinon, on trie avant le rendu. `aria-posinset` seul ne suffit pas pour la tabulation.
5. **Chaque widget est une `section` avec `aria-labelledby`** pointant vers son titre visible, et son `label` est repris tel quel.

**Mouvement réduit.** `MotionConfig reducedMotion="user"` neutralise déjà les animations de transformation des `m.*`, à condition de ne pas réintroduire un `MotionConfig` interne. Avec le mouvement réduit, le reflow et le soulèvement deviennent instantanés, et seul un changement d'ombre marque l'élément saisi. Le glisser lui-même, qui suit le pointeur, reste une manipulation directe et est conservé. recharts ignore `prefers-reduced-motion` : il faut passer `isAnimationActive={!useReducedMotion()}` et, en plus, `false` après le premier rendu pour que les refetch ne rejouent pas l'animation des barres.

### 4.5 Performance (recharts dans les widgets)

- **Chaque widget est un composant `memo`.** Le `renderItem` est stable (`useCallback` sur un `switch(item.id)`), pour que le changement d'état du survol pendant un glisser ne rerende pas le graphe.
- **L'agrégation mensuelle** passe par un `useMemo` sur `data`. La requête d'historique a sa propre clé, `queryKeys.alerts.history(12m)`, avec `staleTime: 60_000` et **sans** le polling à 5 s de `useAlerts`. Sinon, une alerte `SCHEDULED` ferait retélécharger tout l'historique toutes les 5 secondes.
- **recharts `ResponsiveContainer` :** les cellules ne changent de *taille* qu'au changement du nombre de colonnes, jamais pendant un réordonnancement. Il faut animer uniquement la **position** (`x/y` en transform). Pas de `layout` avec correction d'échelle sur un widget contenant un SVG recharts, car le graphe serait déformé pendant le ressort.
- **`will-change: transform`** uniquement sur l'élément saisi, pas en permanence sur 9 couches.
- La **matrice de cellules** reste en CSS pur (des `span`), sans recharts et sans `m.*` par carré.

### 4.6 Historique côté client (pas d'endpoint de séries temporelles)

`AlertListFilters` accepte `page` et `limit`. On pagine jusqu'à couvrir 12 mois, ou on s'arrête à un plafond, par exemple 2 000 alertes. Si le plafond est atteint, le widget l'indique explicitement (« historique partiel : 2 000 alertes les plus récentes ») au lieu d'afficher un graphe faussement complet. Si l'historique devient lourd, il faudra demander au backend un `GET /stats/alerts-by-month` et supprimer la pagination côté client.

## 5. Ailleurs dans l'application

| Écran | Verdict | Raison |
|---|---|---|
| Composeur, confirmation, chemin d'envoi | **Non, jamais** | Protocole de saisie fixe, §5.3, principe 4 : la friction vient des décisions, pas des gestes. |
| Liste des alertes | Non | C'est un tableau dense de lignes de 44 px, trié par date ou filtré. Aucune notion de widget. |
| Détail d'alerte + journal par cellule | Non | Un journal se lit dans l'ordre chronologique. Le réordonner détruit l'information. |
| **Grille des cellules** | **Non** | Toutes les tuiles ont la même taille, donc le tiler n'apporte rien. L'ordre doit être *déterministe* (hors ligne en premier, puis par nom) pour qu'un opérateur trouve une panne instantanément. Avec plus de 100 tuiles rafraîchies toutes les 15 s et le flash `ring-2` de changement de statut (§5.2), un ressort de réordonnancement créerait du mouvement ambigu (« a-t-elle changé de statut ou a-t-on bougé ? »). Enfin, un ordre manuel suggère une signification géographique qu'il n'a pas. |
| Galerie de modèles | Non | L'ordre serait personnel alors que les modèles sont partagés et que l'API n'a pas de champ d'ordre. Un tri par classe ou par usage répond mieux au besoin, et des « favoris » épinglés seraient plus simples. |
| Paramètres | Non | Sections de formulaire, ordre logique. |
| Futur « mur de salle de crise » (grand écran) | Peut-être, en `editable=false` | Le tiler est utile pour composer un écran mural. La disposition serait alors conçue par F2G, pas par l'utilisateur. |

## 6. Decision

1. **Adopter le composant, uniquement sur le tableau de bord**, comme moteur de mise en page du Berry × F2G. Il remplace la grille manuelle de `page.tsx`, et DESIGN.md §7.2 est à mettre à jour en conséquence.
2. **Phase 1 : `editable=false` partout.** On livre la disposition du §3.1 avec les 9 widgets sur données réelles. Cette phase porte déjà 90 % de la valeur.
3. **Phase 2 : bouton `Personnaliser`**, desktop et tablette uniquement. Réordonnancement seul, persistance localStorage par `user.id`, `Réinitialiser`, sortie automatique sur `SENDING`, contenu `inert` pendant l'édition.
4. **Motion :** réécriture vers `m.*` de `framer-motion`, **pas** de paquet `motion`. `domMax` est chargé à la demande dans un `LazyMotion` local, seulement en édition. Pas de décalage de montage.
5. **Nettoyage obligatoire avant fusion :** palette brute, Google Fonts, données simulées, `MotionConfig` interne et clavier `Alt+flèches` (remplacé par saisir / déplacer / déposer avec annonces live).
6. **Interdit :** composeur, dialogue de confirmation, chemin d'envoi, grille des cellules, journal de diffusion.
