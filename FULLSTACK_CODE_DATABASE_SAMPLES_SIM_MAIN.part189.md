---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 189
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 189 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: zendesk.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/zendesk.mdx

```text
---
title: Zendesk
description: Gérez les tickets d'assistance, les utilisateurs et les
  organisations dans Zendesk
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zendesk"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zendesk](https://www.zendesk.com/) est une plateforme de service client et d'assistance de premier plan qui permet aux organisations de gérer efficacement les tickets d'assistance, les utilisateurs et les organisations grâce à un ensemble robuste d'outils et d'API. L'intégration de Zendesk dans Sim permet à vos agents d'automatiser les opérations d'assistance clés et de synchroniser vos données d'assistance avec le reste de votre flux de travail.

Avec Zendesk dans Sim, vous pouvez :

- **Gérer les tickets :**
  - Récupérer des listes de tickets d'assistance avec filtrage et tri avancés.
  - Obtenir des informations détaillées sur un ticket spécifique pour le suivi et la résolution.
  - Créer de nouveaux tickets individuellement ou en masse pour enregistrer les problèmes des clients de manière programmatique.
  - Mettre à jour les tickets ou appliquer des mises à jour en masse pour rationaliser les flux de travail complexes.
  - Supprimer ou fusionner des tickets lorsque les cas sont résolus ou que des doublons apparaissent.

- **Gestion des utilisateurs :**
  - Récupérer des listes d'utilisateurs ou rechercher des utilisateurs selon des critères pour maintenir à jour vos répertoires de clients et d'agents.
  - Obtenir des informations détaillées sur des utilisateurs individuels ou sur l'utilisateur actuellement connecté.
  - Créer de nouveaux utilisateurs ou les intégrer en masse, automatisant ainsi le provisionnement des clients et des agents.
  - Mettre à jour ou effectuer des mises à jour en masse des détails des utilisateurs pour garantir l'exactitude des informations.
  - Supprimer des utilisateurs selon les besoins pour la confidentialité ou la gestion des comptes.

- **Gestion des organisations :**
  - Lister, rechercher et compléter automatiquement les organisations pour une assistance et une gestion de compte rationalisées.
  - Obtenir les détails de l'organisation et maintenir votre base de données organisée.
  - Créer, mettre à jour ou supprimer des organisations pour refléter les changements dans votre base de clients.
  - Effectuer la création d'organisations en masse pour les efforts d'intégration importants.

- **Recherche avancée et analytique :**
  - Utilisez des points de terminaison de recherche polyvalents pour localiser rapidement des tickets, des utilisateurs ou des organisations par n'importe quel champ.
  - Récupérez le nombre de résultats de recherche pour alimenter les rapports et l'analytique.

En tirant parti de l'intégration Sim de Zendesk, vos flux de travail automatisés peuvent gérer sans problème le tri des tickets d'assistance, l'intégration/désactivation des utilisateurs, la gestion des entreprises, et maintenir vos opérations d'assistance en bon fonctionnement. Que vous intégriez l'assistance avec des systèmes de produit, de CRM ou d'automatisation, les outils Zendesk dans Sim offrent un contrôle robuste et programmatique pour alimenter une assistance de premier ordre à grande échelle.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Zendesk dans le flux de travail. Peut obtenir des tickets, obtenir un ticket, créer un ticket, créer des tickets en masse, mettre à jour un ticket, mettre à jour des tickets en masse, supprimer un ticket, fusionner des tickets, obtenir des utilisateurs, obtenir un utilisateur, obtenir l'utilisateur actuel, rechercher des utilisateurs, créer un utilisateur, créer des utilisateurs en masse, mettre à jour un utilisateur, mettre à jour des utilisateurs en masse, supprimer un utilisateur, obtenir des organisations, obtenir une organisation, autocompléter des organisations, créer une organisation, créer des organisations en masse, mettre à jour une organisation, supprimer une organisation, rechercher, compter les résultats de recherche.

## Outils

### `zendesk_get_tickets`

Récupérer une liste de tickets depuis Zendesk avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | chaîne | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | chaîne | Oui | Jeton API Zendesk |
| `subdomain` | chaîne | Oui | Votre sous-domaine Zendesk \(ex. : "macompagnie" pour macompagnie.zendesk.com\) |
| `status` | chaîne | Non | Filtrer par statut \(new, open, pending, hold, solved, closed\) |
| `priority` | chaîne | Non | Filtrer par priorité \(low, normal, high, urgent\) |
| `type` | chaîne | Non | Filtrer par type \(problem, incident, question, task\) |
| `assigneeId` | chaîne | Non | Filtrer par ID d'utilisateur assigné |
| `organizationId` | chaîne | Non | Filtrer par ID d'organisation |
| `sortBy` | chaîne | Non | Champ de tri \(created_at, updated_at, priority, status\) |
| `sortOrder` | chaîne | Non | Ordre de tri \(asc ou desc\) |
| `perPage` | chaîne | Non | Résultats par page \(par défaut : 100, max : 100\) |
| `page` | chaîne | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tickets` | array | Tableau d'objets ticket |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_get_ticket`

Obtenir un ticket unique par ID depuis Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `ticketId` | string | Oui | ID du ticket à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ticket` | object | Objet ticket |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_create_ticket`

Créer un nouveau ticket dans Zendesk avec prise en charge des champs personnalisés

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `subject` | string | Non | Sujet du ticket \(facultatif - sera généré automatiquement si non fourni\) |
| `description` | string | Oui | Description du ticket \(premier commentaire\) |
| `priority` | string | Non | Priorité \(low, normal, high, urgent\) |
| `status` | string | Non | Statut \(new, open, pending, hold, solved, closed\) |
| `type` | string | Non | Type \(problem, incident, question, task\) |
| `tags` | string | Non | Tags séparés par des virgules |
| `assigneeId` | string | Non | ID de l'utilisateur assigné |
| `groupId` | string | Non | ID du groupe |
| `requesterId` | string | Non | ID de l'utilisateur demandeur |
| `customFields` | string | Non | Champs personnalisés sous forme d'objet JSON \(ex., \{"field_id": "value"\}\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ticket` | object | Objet ticket créé |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_create_tickets_bulk`

Créer plusieurs tickets dans Zendesk en une seule fois (max 100)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `tickets` | string | Oui | Tableau JSON d'objets de tickets à créer \(max 100\). Chaque ticket doit avoir les propriétés subject et comment. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Objet statut de la tâche |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_update_ticket`

Mettre à jour un ticket existant dans Zendesk avec prise en charge des champs personnalisés

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `ticketId` | string | Oui | ID du ticket à mettre à jour |
| `subject` | string | Non | Nouveau sujet du ticket |
| `comment` | string | Non | Ajouter un commentaire au ticket |
| `priority` | string | Non | Priorité \(low, normal, high, urgent\) |
| `status` | string | Non | Statut \(new, open, pending, hold, solved, closed\) |
| `type` | string | Non | Type \(problem, incident, question, task\) |
| `tags` | string | Non | Tags séparés par des virgules |
| `assigneeId` | string | Non | ID de l'utilisateur assigné |
| `groupId` | string | Non | ID du groupe |
| `customFields` | string | Non | Champs personnalisés sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ticket` | object | Objet ticket mis à jour |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_update_tickets_bulk`

Mettre à jour plusieurs tickets dans Zendesk en une seule fois (max 100)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `ticketIds` | string | Oui | IDs des tickets à mettre à jour séparés par des virgules \(max 100\) |
| `status` | string | Non | Nouveau statut pour tous les tickets |
| `priority` | string | Non | Nouvelle priorité pour tous les tickets |
| `assigneeId` | string | Non | Nouvel ID d'assignation pour tous les tickets |
| `groupId` | string | Non | Nouvel ID de groupe pour tous les tickets |
| `tags` | string | Non | Tags à ajouter à tous les tickets, séparés par des virgules |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Objet statut de la tâche |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_delete_ticket`

Supprimer un ticket de Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `ticketId` | string | Oui | ID du ticket à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Succès de la suppression |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_merge_tickets`

Fusionner plusieurs tickets dans un ticket cible

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `targetTicketId` | string | Oui | ID du ticket cible \(les tickets seront fusionnés dans celui-ci\) |
| `sourceTicketIds` | string | Oui | IDs des tickets sources à fusionner, séparés par des virgules |
| `targetComment` | string | Non | Commentaire à ajouter au ticket cible après la fusion |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Objet statut de la tâche |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_get_users`

Récupérer une liste d'utilisateurs de Zendesk avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk \(ex. : "masociete" pour masociete.zendesk.com\) |
| `role` | string | Non | Filtrer par rôle \(end-user, agent, admin\) |
| `permissionSet` | string | Non | Filtrer par ID d'ensemble d'autorisations |
| `perPage` | string | Non | Résultats par page \(par défaut : 100, max : 100\) |
| `page` | string | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Tableau d'objets utilisateur |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_get_user`

Obtenir un utilisateur unique par ID depuis Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `userId` | string | Oui | ID de l'utilisateur à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Objet utilisateur |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_get_current_user`

Obtenir l'utilisateur actuellement authentifié depuis Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Objet de l'utilisateur actuel |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_search_users`

Rechercher des utilisateurs dans Zendesk à l'aide d'une chaîne de requête

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | chaîne | Oui | Jeton API Zendesk |
| `subdomain` | chaîne | Oui | Votre sous-domaine Zendesk |
| `query` | chaîne | Non | Chaîne de requête de recherche |
| `externalId` | chaîne | Non | ID externe pour la recherche |
| `perPage` | chaîne | Non | Résultats par page \(par défaut : 100, max : 100\) |
| `page` | chaîne | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Tableau d'objets utilisateur |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_create_user`

Créer un nouvel utilisateur dans Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | chaîne | Oui | Jeton API Zendesk |
| `subdomain` | chaîne | Oui | Votre sous-domaine Zendesk |
| `name` | chaîne | Oui | Nom d'utilisateur |
| `userEmail` | chaîne | Non | E-mail de l'utilisateur |
| `role` | chaîne | Non | Rôle de l'utilisateur \(end-user, agent, admin\) |
| `phone` | chaîne | Non | Numéro de téléphone de l'utilisateur |
| `organizationId` | chaîne | Non | ID de l'organisation |
| `verified` | chaîne | Non | Définir sur "true" pour ignorer la vérification par e-mail |
| `tags` | chaîne | Non | Tags séparés par des virgules |
| `customFields` | chaîne | Non | Champs personnalisés sous forme d'objet JSON \(ex., \{"field_id": "value"\}\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Objet utilisateur créé |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_create_users_bulk`

Créer plusieurs utilisateurs dans Zendesk en utilisant l'importation en masse

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `users` | string | Oui | Tableau JSON d'objets utilisateur à créer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Objet d'état de la tâche |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_update_user`

Mettre à jour un utilisateur existant dans Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `userId` | string | Oui | ID de l'utilisateur à mettre à jour |
| `name` | string | Non | Nouveau nom d'utilisateur |
| `userEmail` | string | Non | Nouvel e-mail de l'utilisateur |
| `role` | string | Non | Rôle de l'utilisateur \(end-user, agent, admin\) |
| `phone` | string | Non | Numéro de téléphone de l'utilisateur |
| `organizationId` | string | Non | ID de l'organisation |
| `verified` | string | Non | Définir à "true" pour marquer l'utilisateur comme vérifié |
| `tags` | string | Non | Tags séparés par des virgules |
| `customFields` | string | Non | Champs personnalisés sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Objet utilisateur mis à jour |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_update_users_bulk`

Mettre à jour plusieurs utilisateurs dans Zendesk en utilisant la mise à jour en masse

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `users` | string | Oui | Tableau JSON d'objets utilisateur à mettre à jour \(doit inclure le champ id\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Objet d'état de la tâche |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_delete_user`

Supprimer un utilisateur de Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `userId` | string | Oui | ID de l'utilisateur à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Succès de la suppression |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_get_organizations`

Récupérer une liste d'organisations depuis Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | chaîne | Oui | Jeton API Zendesk |
| `subdomain` | chaîne | Oui | Votre sous-domaine Zendesk \(ex. : "mycompany" pour mycompany.zendesk.com\) |
| `perPage` | chaîne | Non | Résultats par page \(par défaut : 100, max : 100\) |
| `page` | chaîne | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `organizations` | array | Tableau d'objets d'organisation |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_get_organization`

Obtenir une organisation unique par ID depuis Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | chaîne | Oui | Jeton API Zendesk |
| `subdomain` | chaîne | Oui | Votre sous-domaine Zendesk |
| `organizationId` | chaîne | Oui | ID de l'organisation à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `organization` | object | Objet organisation |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_autocomplete_organizations`

Autocomplétion des organisations dans Zendesk par préfixe de nom (pour correspondance de nom/autocomplétion)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | chaîne | Oui | Jeton API Zendesk |
| `subdomain` | chaîne | Oui | Votre sous-domaine Zendesk |
| `name` | chaîne | Oui | Nom de l'organisation à rechercher |
| `perPage` | chaîne | Non | Résultats par page \(par défaut : 100, max : 100\) |
| `page` | chaîne | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `organizations` | array | Tableau d'objets d'organisation |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_create_organization`

Créer une nouvelle organisation dans Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `name` | string | Oui | Nom de l'organisation |
| `domainNames` | string | Non | Noms de domaines séparés par des virgules |
| `details` | string | Non | Détails de l'organisation |
| `notes` | string | Non | Notes de l'organisation |
| `tags` | string | Non | Tags séparés par des virgules |
| `customFields` | string | Non | Champs personnalisés sous forme d'objet JSON \(ex., \{"field_id": "value"\}\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `organization` | object | Objet organisation créé |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_create_organizations_bulk`

Créer plusieurs organisations dans Zendesk en utilisant l'importation en masse

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `organizations` | string | Oui | Tableau JSON d'objets d'organisation à créer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Objet statut de la tâche |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_update_organization`

Mettre à jour une organisation existante dans Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `organizationId` | string | Oui | ID de l'organisation à mettre à jour |
| `name` | string | Non | Nouveau nom de l'organisation |
| `domainNames` | string | Non | Noms de domaine séparés par des virgules |
| `details` | string | Non | Détails de l'organisation |
| `notes` | string | Non | Notes de l'organisation |
| `tags` | string | Non | Tags séparés par des virgules |
| `customFields` | string | Non | Champs personnalisés sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `organization` | object | Objet organisation mis à jour |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_delete_organization`

Supprimer une organisation de Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `organizationId` | string | Oui | ID de l'organisation à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Succès de la suppression |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_search`

Recherche unifiée à travers les tickets, utilisateurs et organisations dans Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `query` | string | Oui | Chaîne de requête de recherche |
| `sortBy` | string | Non | Champ de tri \(relevance, created_at, updated_at, priority, status, ticket_type\) |
| `sortOrder` | string | Non | Ordre de tri \(asc ou desc\) |
| `perPage` | string | Non | Résultats par page \(par défaut : 100, max : 100\) |
| `page` | string | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Tableau d'objets résultats |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |

### `zendesk_search_count`

Compter le nombre de résultats de recherche correspondant à une requête dans Zendesk

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Oui | Votre adresse e-mail Zendesk |
| `apiToken` | string | Oui | Jeton API Zendesk |
| `subdomain` | string | Oui | Votre sous-domaine Zendesk |
| `query` | string | Oui | Chaîne de requête de recherche |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `count` | number | Nombre de résultats correspondants |
| `metadata` | object | Métadonnées de l'opération |

## Notes

- Catégorie : `tools`
- Type : `zendesk`
```

--------------------------------------------------------------------------------

---[FILE: zep.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/zep.mdx

```text
---
title: Zep
description: Mémoire à long terme pour les agents IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zep"
  color="#E8E8E8"
/>

## Instructions d'utilisation

Intégrez Zep pour la gestion de la mémoire à long terme. Créez des fils de discussion, ajoutez des messages, récupérez du contexte avec des résumés générés par IA et extraction de faits.

## Outils

### `zep_create_thread`

Démarrer un nouveau fil de conversation dans Zep

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Oui | Identifiant unique pour le fil de discussion |
| `userId` | string | Oui | ID utilisateur associé au fil de discussion |
| `apiKey` | string | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `threadId` | string | L'ID du fil de discussion |
| `userId` | string | L'ID utilisateur |
| `uuid` | string | UUID interne |
| `createdAt` | string | Horodatage de création |
| `projectUuid` | string | UUID du projet |

### `zep_get_threads`

Lister tous les fils de conversation

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | Non | Nombre de fils à récupérer par page |
| `pageNumber` | number | Non | Numéro de page pour la pagination |
| `orderBy` | string | Non | Champ pour ordonner les résultats \(created_at, updated_at, user_id, thread_id\) |
| `asc` | boolean | Non | Direction de tri : true pour ascendant, false pour descendant |
| `apiKey` | string | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `threads` | array | Tableau d'objets de fil de discussion |
| `responseCount` | number | Nombre de fils de discussion dans cette réponse |
| `totalCount` | number | Nombre total de fils de discussion disponibles |

### `zep_delete_thread`

Supprimer un fil de conversation de Zep

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Oui | ID du fil de discussion à supprimer |
| `apiKey` | string | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indique si le fil de discussion a été supprimé |

### `zep_get_context`

Récupérer le contexte utilisateur d'un fil de discussion en mode résumé ou basique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Oui | ID du fil de discussion pour obtenir le contexte |
| `mode` | string | Non | Mode de contexte : "summary" \(langage naturel\) ou "basic" \(faits bruts\) |
| `minRating` | number | Non | Note minimale pour filtrer les faits pertinents |
| `apiKey` | string | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `context` | string | La chaîne de contexte \(mode résumé ou basique\) |

### `zep_get_messages`

Récupérer les messages d'un fil de discussion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `threadId` | chaîne | Oui | ID du fil de discussion pour récupérer les messages |
| `limit` | nombre | Non | Nombre maximum de messages à renvoyer |
| `cursor` | chaîne | Non | Curseur pour la pagination |
| `lastn` | nombre | Non | Nombre de messages les plus récents à renvoyer \(remplace la limite et le curseur\) |
| `apiKey` | chaîne | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `messages` | tableau | Tableau d'objets message |
| `rowCount` | nombre | Nombre de messages dans cette réponse |
| `totalCount` | nombre | Nombre total de messages dans le fil de discussion |

### `zep_add_messages`

Ajouter des messages à un fil de discussion existant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `threadId` | chaîne | Oui | ID du fil de discussion auquel ajouter des messages |
| `messages` | json | Oui | Tableau d'objets message avec rôle et contenu |
| `apiKey` | chaîne | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `threadId` | string | L'ID du fil de discussion |
| `added` | boolean | Si les messages ont été ajoutés avec succès |
| `messageIds` | array | Tableau des UUID des messages ajoutés |

### `zep_add_user`

Créer un nouvel utilisateur dans Zep

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Oui | Identifiant unique pour l'utilisateur |
| `email` | string | Non | Adresse e-mail de l'utilisateur |
| `firstName` | string | Non | Prénom de l'utilisateur |
| `lastName` | string | Non | Nom de famille de l'utilisateur |
| `metadata` | json | Non | Métadonnées supplémentaires sous forme d'objet JSON |
| `apiKey` | string | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `userId` | string | L'identifiant de l'utilisateur |
| `email` | string | E-mail de l'utilisateur |
| `firstName` | string | Prénom de l'utilisateur |
| `lastName` | string | Nom de famille de l'utilisateur |
| `uuid` | string | UUID interne |
| `createdAt` | string | Horodatage de création |
| `metadata` | object | Métadonnées de l'utilisateur |

### `zep_get_user`

Récupérer les informations d'un utilisateur depuis Zep

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Oui | ID de l'utilisateur à récupérer |
| `apiKey` | string | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `userId` | string | L'identifiant de l'utilisateur |
| `email` | string | E-mail de l'utilisateur |
| `firstName` | string | Prénom de l'utilisateur |
| `lastName` | string | Nom de famille de l'utilisateur |
| `uuid` | string | UUID interne |
| `createdAt` | string | Horodatage de création |
| `updatedAt` | string | Horodatage de dernière mise à jour |
| `metadata` | object | Métadonnées de l'utilisateur |

### `zep_get_user_threads`

Lister tous les fils de conversation pour un utilisateur spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `userId` | chaîne | Oui | ID de l'utilisateur pour lequel obtenir les fils |
| `limit` | nombre | Non | Nombre maximum de fils à retourner |
| `apiKey` | chaîne | Oui | Votre clé API Zep |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `threads` | array | Tableau d'objets de fil de discussion pour cet utilisateur |
| `totalCount` | number | Nombre total de fils de discussion retournés |

## Notes

- Catégorie : `tools`
- Type : `zep`
```

--------------------------------------------------------------------------------

````
