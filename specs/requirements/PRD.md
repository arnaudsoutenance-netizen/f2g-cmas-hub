# F2G CMAS HUB — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2026-09-28  
**Auteur:** Arnaud DJOUM — F2G Solutions  
**Statut:** Draft

---

## 1. Executive Summary

### 1.1 Vision
F2G CMAS Hub est une plateforme web centralisée permettant de gérer, programmer et déclencher des alertes Cell Broadcast (CMAS/ETWS) sur un réseau mobile privé ou opérateur, sans nécessiter de redémarrage des équipements radio.

### 1.2 Problem Statement
Actuellement, l'envoi d'alertes Cell Broadcast sur srsRAN/Open5GS nécessite :
- L'arrêt de l'eNodeB
- La modification manuelle des fichiers de configuration SIB
- Le redémarrage de l'eNodeB

Cette approche est **inacceptable en production** car elle interrompt le service pour tous les utilisateurs.

### 1.3 Solution
Une interface web moderne permettant de :
1. Créer et stocker des alertes pré-configurées
2. Programmer l'envoi à une date/heure spécifique
3. Déclencher instantanément une alerte d'urgence
4. Recharger dynamiquement la configuration de l'eNB sans interruption de service

---

## 2. Objectives & Key Results (OKRs)

### Objective 1: Simplifier la gestion des alertes
- **KR1:** Temps de création d'une alerte < 30 secondes
- **KR2:** 100% des types d'alertes 3GPP supportés (CMAS + ETWS)
- **KR3:** Interface utilisable sans formation technique

### Objective 2: Permettre l'envoi sans interruption
- **KR1:** Envoi d'alerte sans redémarrage eNB
- **KR2:** Latence < 5 secondes entre déclenchement et broadcast
- **KR3:** Support multi-cellules simultané

### Objective 3: Assurer la traçabilité
- **KR1:** Log complet de toutes les alertes envoyées
- **KR2:** Historique consultable avec filtres
- **KR3:** Export des données en CSV/JSON

---

## 3. User Personas

### Persona 1: Opérateur d'Urgence (Primary)
- **Nom:** Jean, 35 ans
- **Rôle:** Agent Protection Civile
- **Besoin:** Envoyer une alerte rapidement en cas de catastrophe
- **Frustration:** Les systèmes actuels sont trop complexes
- **Goal:** 1-click pour alerter la population

### Persona 2: Administrateur Réseau (Secondary)
- **Nom:** Marie, 40 ans
- **Rôle:** Ingénieur télécom chez un opérateur
- **Besoin:** Configurer et tester le système régulièrement
- **Frustration:** Pas de visibilité sur l'état du système
- **Goal:** Dashboard avec statut temps réel

### Persona 3: Décideur Gouvernemental (Tertiary)
- **Nom:** Paul, 55 ans
- **Rôle:** Directeur MINPOSTEL
- **Besoin:** Valider les alertes présidentielles
- **Frustration:** Processus de validation trop lent
- **Goal:** Workflow d'approbation clair

---

## 4. Functional Requirements

### 4.1 Alert Management (MUST HAVE)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Créer une nouvelle alerte avec formulaire | P0 | TODO |
| FR-002 | Sélectionner le type d'alerte (CMAS/ETWS) | P0 | TODO |
| FR-003 | Sélectionner le Message ID (4370-4392) | P0 | TODO |
| FR-004 | Rédiger le contenu de l'alerte (max 1395 chars) | P0 | TODO |
| FR-005 | Sélectionner les cellules cibles | P0 | TODO |
| FR-006 | Définir la durée de validité | P0 | TODO |
| FR-007 | Sauvegarder en brouillon | P1 | TODO |
| FR-008 | Modifier une alerte existante | P1 | TODO |
| FR-009 | Supprimer une alerte | P1 | TODO |
| FR-010 | Dupliquer une alerte | P2 | TODO |

### 4.2 Alert Scheduling (MUST HAVE)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-011 | Programmer envoi à date/heure future | P0 | TODO |
| FR-012 | Envoi immédiat (1-click) | P0 | TODO |
| FR-013 | Annuler une alerte programmée | P0 | TODO |
| FR-014 | Répétition périodique (tests mensuels) | P2 | TODO |
| FR-015 | File d'attente visible | P1 | TODO |

### 4.3 Alert Dispatch (MUST HAVE)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-016 | Générer config SIB12 automatiquement | P0 | TODO |
| FR-017 | Envoyer config à l'eNB sans restart | P0 | TODO |
| FR-018 | Confirmer réception par l'eNB | P1 | TODO |
| FR-019 | Timeout et retry en cas d'échec | P1 | TODO |
| FR-020 | Support multi-eNB simultané | P2 | TODO |

### 4.4 Templates (SHOULD HAVE)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-021 | Bibliothèque de templates pré-définis | P1 | TODO |
| FR-022 | Templates par catégorie (Séisme, Inondation, AMBER...) | P1 | TODO |
| FR-023 | Créer template personnalisé | P2 | TODO |
| FR-024 | Importer/Exporter templates | P3 | TODO |

### 4.5 Monitoring & Logs (SHOULD HAVE)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-025 | Dashboard statut temps réel | P1 | TODO |
| FR-026 | Historique des alertes envoyées | P1 | TODO |
| FR-027 | Filtrer par date, type, statut | P1 | TODO |
| FR-028 | Export CSV/JSON | P2 | TODO |
| FR-029 | Statistiques (nombre, succès, échecs) | P2 | TODO |

### 4.6 User Management (COULD HAVE)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-030 | Authentification utilisateur | P2 | TODO |
| FR-031 | Rôles (Admin, Operator, Viewer) | P2 | TODO |
| FR-032 | Workflow d'approbation | P3 | TODO |
| FR-033 | Audit trail des actions | P2 | TODO |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Temps de chargement page | < 2 secondes |
| NFR-002 | Latence envoi alerte | < 5 secondes |
| NFR-003 | Concurrent users | 10+ |
| NFR-004 | Uptime | 99.9% |

### 5.2 Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-005 | HTTPS obligatoire | Oui |
| NFR-006 | Authentification | JWT/Session |
| NFR-007 | Rate limiting API | 100 req/min |
| NFR-008 | Input validation | OWASP compliant |

### 5.3 Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-009 | Navigateurs | Chrome, Firefox, Edge |
| NFR-010 | Mobile responsive | Oui |
| NFR-011 | eNB compatibles | srsRAN 23.x+ |
| NFR-012 | Core Network | Open5GS 2.6+ |

---

## 6. Technical Constraints

### 6.1 Stack imposé
- **Frontend:** Next.js 14+, TypeScript, shadcn/ui, 21st.dev components
- **Backend:** FastAPI (Python) ou Next.js API Routes
- **Database:** PostgreSQL (Neon) ou SQLite (dev)
- **Queue:** Redis ou in-memory pour MVP
- **eNB Control:** SSH + SIGHUP ou ZMQ

### 6.2 Intégration existante
- Compatible avec Open5GS déjà déployé
- Compatible avec srsRAN déjà configuré
- Utilise les configs existantes comme base

---

## 7. User Stories

### Epic 1: Alert Creation

```
US-001: En tant qu'opérateur d'urgence,
je veux créer une alerte en remplissant un formulaire simple,
afin de préparer une alerte rapidement.

Critères d'acceptation:
- [ ] Formulaire avec champs : type, message ID, contenu, cellules, durée
- [ ] Validation en temps réel des champs
- [ ] Aperçu de l'alerte avant sauvegarde
- [ ] Confirmation de sauvegarde
```

```
US-002: En tant qu'opérateur d'urgence,
je veux utiliser un template pré-défini,
afin de gagner du temps en situation de crise.

Critères d'acceptation:
- [ ] Liste de templates par catégorie
- [ ] 1-click pour charger un template
- [ ] Possibilité de modifier avant envoi
```

### Epic 2: Alert Dispatch

```
US-003: En tant qu'opérateur d'urgence,
je veux envoyer une alerte immédiatement,
afin d'alerter la population en cas d'urgence.

Critères d'acceptation:
- [ ] Bouton "Envoyer maintenant" visible
- [ ] Confirmation avant envoi
- [ ] Feedback visuel pendant l'envoi
- [ ] Notification de succès/échec
```

```
US-004: En tant qu'administrateur,
je veux programmer une alerte test mensuelle,
afin de vérifier le bon fonctionnement du système.

Critères d'acceptation:
- [ ] Sélecteur date/heure
- [ ] Option récurrence
- [ ] Visualisation dans calendrier/liste
```

### Epic 3: Monitoring

```
US-005: En tant qu'administrateur,
je veux voir le statut de toutes les alertes,
afin de m'assurer que le système fonctionne.

Critères d'acceptation:
- [ ] Dashboard avec compteurs (envoyées, en attente, échecs)
- [ ] Liste des alertes récentes
- [ ] Indicateur statut eNB
```

---

## 8. Wireframes

### 8.1 Dashboard Principal
```
┌─────────────────────────────────────────────────────────────────┐
│  F2G CMAS HUB                           [User] [Settings] [?]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │   12    │ │    3    │ │    1    │ │  ✓ OK   │              │
│  │ Envoyées│ │En attente│ │ Échecs  │ │ eNB x3  │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  [+ Nouvelle Alerte]  [📋 Templates]  [📊 Historique]         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Alertes récentes                                        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 🔴 PRESIDENTIAL | Test national | 28/09 14:00 | ✓ Sent │   │
│  │ 🟡 AMBER        | Enfant disparu | 27/09 09:30 | ✓ Sent │   │
│  │ 🟢 TEST         | Test mensuel   | 01/10 10:00 | ⏳ Scheduled│
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Création d'Alerte
```
┌─────────────────────────────────────────────────────────────────┐
│  Nouvelle Alerte                                    [X] Fermer  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Type d'alerte                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ CMAS (Commercial Mobile Alert)                        │   │
│  │ ○ ETWS (Earthquake & Tsunami Warning)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Catégorie                                                      │
│  [▼ Presidential (4370) - No opt-out                      ]    │
│                                                                 │
│  Message                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ALERTE NATIONALE                                        │   │
│  │ Restez chez vous. Informations à suivre.               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│  145/1395 caractères                                            │
│                                                                 │
│  Cellules cibles                                                │
│  [☑] Cell 001 - Yaoundé Centre                                 │
│  [☑] Cell 002 - Yaoundé Nord                                   │
│  [☐] Cell 003 - Douala                                         │
│                                                                 │
│  Programmation                                                  │
│  ○ Envoyer maintenant                                          │
│  ● Programmer : [28/09/2026] [15:00]                           │
│                                                                 │
│  Durée de validité : [1 heure ▼]                               │
│                                                                 │
│        [Annuler]  [Sauvegarder brouillon]  [🚀 Programmer]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Success Metrics

| Metric | Baseline | Target | Method |
|--------|----------|--------|--------|
| Temps création alerte | N/A | < 30s | Mesure UX |
| Temps envoi alerte | 5-10 min (restart) | < 5s | Logs système |
| Erreurs d'envoi | N/A | < 1% | Monitoring |
| Satisfaction utilisateur | N/A | > 4/5 | Survey |

---

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| srsRAN ne supporte pas hot-reload | High | Medium | Fallback graceful restart |
| Latence réseau SSH | Medium | Low | Connexion persistante |
| Erreur config SIB invalide | High | Medium | Validation stricte avant envoi |
| Perte de connexion eNB | High | Low | Retry automatique + alerting |

---

## 11. Timeline

| Phase | Durée | Livrables |
|-------|-------|-----------|
| **Phase 1: Specs** | 1 jour | PRD, Design Doc, API Spec |
| **Phase 2: UI** | 3 jours | Interface Next.js + shadcn |
| **Phase 3: Backend** | 2 jours | API + Database |
| **Phase 4: Dispatcher** | 2 jours | eNB Control + Hot-reload |
| **Phase 5: Tests** | 1 jour | E2E tests + Documentation |

**Total estimé:** 9 jours

---

## 12. Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | Arnaud DJOUM | | |
| Tech Lead | Arnaud DJOUM | | |
| Stakeholder | Luis (PKF) | | |

---

*Document créé le 2026-09-28*  
*F2G Solutions — KFOKAM48 Telco Academy*
