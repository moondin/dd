---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 178
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 178 of 933)

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

---[FILE: sendgrid.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/sendgrid.mdx

```text
---
title: SendGrid
description: Envoyez des emails et gérez des contacts, des listes et des modèles
  avec SendGrid
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sendgrid"
  color="#1A82E2"
/>

{/* MANUAL-CONTENT-START:intro */}
[SendGrid](https://sendgrid.com) est une plateforme d'envoi d'emails cloud de premier plan, reconnue par les développeurs et les entreprises pour l'envoi fiable d'emails transactionnels et marketing à grande échelle. Grâce à ses API robustes et ses outils puissants, SendGrid vous permet de gérer tous les aspects de votre communication par email, de l'envoi de notifications et de reçus à la gestion de campagnes marketing complexes.

SendGrid offre aux utilisateurs une suite complète d'opérations email, permettant d'automatiser les flux de travail email critiques et de gérer étroitement les listes de contacts, les modèles et l'engagement des destinataires. Son intégration transparente avec Sim permet aux agents et aux workflows de délivrer des messages ciblés, de maintenir des listes dynamiques de contacts et de destinataires, de déclencher des emails personnalisés via des modèles et de suivre les résultats en temps réel.

Les fonctionnalités clés de SendGrid comprennent :

- **Email transactionnel :** envoi automatisé d'emails transactionnels à haut volume (comme des notifications, reçus et réinitialisations de mot de passe).
- **Modèles dynamiques :** utilisation de modèles HTML riches ou textuels avec des données dynamiques pour une communication hautement personnalisée à grande échelle.
- **Gestion des contacts :** ajout et mise à jour de contacts marketing, gestion des listes de destinataires et ciblage de segments pour les campagnes.
- **Prise en charge des pièces jointes :** inclusion d'une ou plusieurs pièces jointes dans vos emails.
- **Couverture API complète :** gestion programmatique des emails, contacts, listes, modèles, groupes de suppression, et plus encore.

En connectant SendGrid avec Sim, vos agents peuvent :

- Envoyer des emails simples et avancés (avec modèles ou multi-destinataires) dans le cadre de n'importe quel workflow.
- Gérer et segmenter automatiquement les contacts et les listes.
- Exploiter des modèles pour assurer cohérence et personnalisation dynamique.
- Suivre et répondre à l'engagement des emails au sein de vos processus automatisés.

Cette intégration vous permet d'automatiser tous les flux de communication critiques, de garantir que les messages atteignent le bon public et de maintenir le contrôle sur la stratégie de messagerie de votre organisation, directement à partir des flux de travail Sim.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez SendGrid dans votre flux de travail. Envoyez des e-mails transactionnels, gérez les contacts et les listes marketing, et travaillez avec des modèles d'e-mail. Prend en charge les modèles dynamiques, les pièces jointes et la gestion complète des contacts.

## Outils

### `sendgrid_send_mail`

Envoyer un e-mail en utilisant l'API SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `from` | string | Oui | Adresse e-mail de l'expéditeur \(doit être vérifiée dans SendGrid\) |
| `fromName` | string | Non | Nom de l'expéditeur |
| `to` | string | Oui | Adresse e-mail du destinataire |
| `toName` | string | Non | Nom du destinataire |
| `subject` | string | Non | Objet de l'e-mail \(obligatoire sauf si vous utilisez un modèle avec un objet prédéfini\) |
| `content` | string | Non | Contenu du corps de l'e-mail \(obligatoire sauf si vous utilisez un modèle avec un contenu prédéfini\) |
| `contentType` | string | Non | Type de contenu \(text/plain ou text/html\) |
| `cc` | string | Non | Adresse e-mail en CC |
| `bcc` | string | Non | Adresse e-mail en BCC |
| `replyTo` | string | Non | Adresse e-mail de réponse |
| `replyToName` | string | Non | Nom de réponse |
| `attachments` | file[] | Non | Fichiers à joindre à l'e-mail |
| `templateId` | string | Non | ID du modèle SendGrid à utiliser |
| `dynamicTemplateData` | json | Non | Objet JSON de données de modèle dynamique |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'e-mail a été envoyé avec succès |
| `messageId` | string | ID du message SendGrid |
| `to` | string | Adresse e-mail du destinataire |
| `subject` | string | Objet de l'e-mail |

### `sendgrid_add_contact`

Ajouter un nouveau contact à SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `email` | string | Oui | Adresse e-mail du contact |
| `firstName` | string | Non | Prénom du contact |
| `lastName` | string | Non | Nom de famille du contact |
| `customFields` | json | Non | Objet JSON de paires clé-valeur de champs personnalisés (utilisez les ID de champ comme e1_T, e2_N, e3_D, pas les noms de champ) |
| `listIds` | string | Non | Liste d'ID séparés par des virgules pour ajouter le contact |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | ID de tâche pour suivre la création asynchrone du contact |
| `email` | string | Adresse e-mail du contact |
| `firstName` | string | Prénom du contact |
| `lastName` | string | Nom de famille du contact |
| `message` | string | Message d'état |

### `sendgrid_get_contact`

Obtenir un contact spécifique par ID depuis SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `contactId` | string | Oui | ID du contact |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | ID du contact |
| `email` | string | Adresse e-mail du contact |
| `firstName` | string | Prénom du contact |
| `lastName` | string | Nom de famille du contact |
| `createdAt` | string | Horodatage de création |
| `updatedAt` | string | Horodatage de dernière mise à jour |
| `listIds` | json | Tableau des ID de listes auxquelles le contact appartient |
| `customFields` | json | Valeurs des champs personnalisés |

### `sendgrid_search_contacts`

Rechercher des contacts dans SendGrid à l'aide d'une requête

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `query` | string | Oui | Requête de recherche (par ex., "email LIKE '%example.com%' AND CONTAINS(list_ids, 'list-id')") |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | json | Tableau des contacts correspondants |
| `contactCount` | number | Nombre total de contacts trouvés |

### `sendgrid_delete_contacts`

Supprimer un ou plusieurs contacts de SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `contactIds` | string | Oui | ID de contacts séparés par des virgules à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | ID de tâche pour la demande de suppression |

### `sendgrid_create_list`

Créer une nouvelle liste de contacts dans SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `name` | chaîne | Oui | Nom de la liste |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | chaîne | ID de la liste |
| `name` | chaîne | Nom de la liste |
| `contactCount` | nombre | Nombre de contacts dans la liste |

### `sendgrid_get_list`

Obtenir une liste spécifique par ID depuis SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `listId` | chaîne | Oui | ID de la liste |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | chaîne | ID de la liste |
| `name` | chaîne | Nom de la liste |
| `contactCount` | nombre | Nombre de contacts dans la liste |

### `sendgrid_list_all_lists`

Obtenir toutes les listes de contacts depuis SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `pageSize` | nombre | Non | Nombre de listes à renvoyer par page \(par défaut : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `lists` | json | Tableau de listes |

### `sendgrid_delete_list`

Supprimer une liste de contacts de SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `listId` | chaîne | Oui | ID de la liste à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès |

### `sendgrid_add_contacts_to_list`

Ajouter ou mettre à jour des contacts et les assigner à une liste dans SendGrid (utilise PUT /v3/marketing/contacts)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `listId` | chaîne | Oui | ID de la liste à laquelle ajouter les contacts |
| `contacts` | json | Oui | Tableau JSON d'objets contact. Chaque contact doit avoir au minimum : email \(ou phone_number_id/external_id/anonymous_id\). Exemple : \[\{"email": "user@example.com", "first_name": "John"\}\] |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | chaîne | ID de tâche pour suivre l'opération asynchrone |
| `message` | chaîne | Message de statut |

### `sendgrid_remove_contacts_from_list`

Supprimer des contacts d'une liste spécifique dans SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `listId` | chaîne | Oui | ID de la liste |
| `contactIds` | chaîne | Oui | IDs de contacts séparés par des virgules à supprimer de la liste |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | ID de tâche pour la requête |

### `sendgrid_create_template`

Créer un nouveau modèle d'e-mail dans SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `name` | string | Oui | Nom du modèle |
| `generation` | string | Non | Type de génération de modèle \(legacy ou dynamic, par défaut : dynamic\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | ID du modèle |
| `name` | string | Nom du modèle |
| `generation` | string | Génération du modèle |
| `updatedAt` | string | Horodatage de la dernière mise à jour |
| `versions` | json | Tableau des versions du modèle |

### `sendgrid_get_template`

Obtenir un modèle spécifique par ID depuis SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API SendGrid |
| `templateId` | string | Oui | ID du modèle |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | ID du modèle |
| `name` | string | Nom du modèle |
| `generation` | string | Génération du modèle |
| `updatedAt` | string | Horodatage de la dernière mise à jour |
| `versions` | json | Tableau des versions du modèle |

### `sendgrid_list_templates`

Obtenir tous les modèles d'e-mail de SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `generations` | chaîne | Non | Filtrer par génération \(legacy, dynamic, ou les deux\) |
| `pageSize` | nombre | Non | Nombre de modèles à renvoyer par page \(par défaut : 20\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `templates` | json | Tableau de modèles |

### `sendgrid_delete_template`

Supprimer un modèle d'e-mail de SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `templateId` | chaîne | Oui | ID du modèle à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `message` | string | Message d'état ou de réussite |
| `messageId` | string | ID du message e-mail \(send_mail\) |
| `to` | string | Adresse e-mail du destinataire \(send_mail\) |
| `subject` | string | Objet de l'e-mail \(send_mail, create_template_version\) |
| `id` | string | ID de la ressource |
| `jobId` | string | ID de tâche pour les opérations asynchrones |
| `email` | string | Adresse e-mail du contact |
| `firstName` | string | Prénom du contact |
| `lastName` | string | Nom de famille du contact |
| `createdAt` | string | Horodatage de création |
| `updatedAt` | string | Horodatage de dernière mise à jour |
| `listIds` | json | Tableau des ID de listes auxquelles le contact appartient |
| `customFields` | json | Valeurs des champs personnalisés |
| `contacts` | json | Tableau de contacts |
| `contactCount` | number | Nombre de contacts |
| `lists` | json | Tableau de listes |
| `name` | string | Nom de la ressource |
| `templates` | json | Tableau de modèles |
| `generation` | string | Génération du modèle |
| `versions` | json | Tableau des versions du modèle |
| `templateId` | string | ID du modèle |
| `active` | boolean | Si la version du modèle est active |
| `htmlContent` | string | Contenu HTML |
| `plainContent` | string | Contenu en texte brut |

### `sendgrid_create_template_version`

Créer une nouvelle version d'un modèle d'e-mail dans SendGrid

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API SendGrid |
| `templateId` | chaîne | Oui | ID du modèle |
| `name` | chaîne | Oui | Nom de la version |
| `subject` | chaîne | Oui | Objet de l'e-mail |
| `htmlContent` | chaîne | Non | Contenu HTML du modèle |
| `plainContent` | chaîne | Non | Contenu texte brut du modèle |
| `active` | booléen | Non | Si cette version est active \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | chaîne | ID de la version |
| `templateId` | chaîne | ID du modèle |
| `name` | chaîne | Nom de la version |
| `subject` | chaîne | Objet de l'e-mail |
| `active` | booléen | Si cette version est active |
| `htmlContent` | chaîne | Contenu HTML |
| `plainContent` | chaîne | Contenu texte brut |
| `updatedAt` | chaîne | Horodatage de la dernière mise à jour |

## Notes

- Catégorie : `tools`
- Type : `sendgrid`
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/sentry.mdx

```text
---
title: Sentry
description: Gérez les problèmes, projets, événements et versions de Sentry
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sentry"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Optimisez votre surveillance des erreurs et la fiabilité de vos applications avec [Sentry](https://sentry.io/) — la plateforme leader du secteur pour le suivi des erreurs en temps réel, la surveillance des performances et la gestion des versions. Intégrez Sentry de manière transparente dans vos flux de travail d'agents automatisés pour surveiller facilement les problèmes, suivre les événements critiques, gérer les projets et orchestrer les versions à travers toutes vos applications et services.

Avec l'outil Sentry, vous pouvez :

- **Surveiller et trier les problèmes** : récupérez des listes complètes de problèmes à l'aide de l'opération `sentry_issues_list` et obtenez des informations détaillées sur les erreurs et bugs individuels via `sentry_issues_get`. Accédez instantanément aux métadonnées, tags, traces d'appel et statistiques pour réduire le temps moyen de résolution.
- **Suivre les données d'événements** : analysez des instances d'erreurs et d'événements spécifiques avec `sentry_events_list` et `sentry_events_get`, offrant un aperçu approfondi des occurrences d'erreurs et de leur impact sur les utilisateurs.
- **Gérer les projets et les équipes** : utilisez `sentry_projects_list` et `sentry_project_get` pour énumérer et examiner tous vos projets Sentry, assurant une collaboration fluide entre les équipes et une configuration centralisée.
- **Coordonner les versions** : automatisez le suivi des versions, la santé des déploiements et la gestion des changements dans votre code avec des opérations comme `sentry_releases_list`, `sentry_release_get`, et plus encore.
- **Obtenir des insights puissants sur vos applications** : utilisez des filtres et requêtes avancés pour trouver des problèmes non résolus ou de haute priorité, agréger des statistiques d'événements au fil du temps et suivre les régressions à mesure que votre code évolue.

L'intégration de Sentry permet aux équipes d'ingénierie et de DevOps de détecter les problèmes tôt, de prioriser les bugs les plus impactants et d'améliorer continuellement la santé des applications à travers les différentes piles de développement. Orchestrez de manière programmatique l'automatisation des flux de travail pour une observabilité moderne, une réponse aux incidents et une gestion du cycle de vie des versions, réduisant ainsi les temps d'arrêt et augmentant la satisfaction des utilisateurs.

**Opérations Sentry clés disponibles** :
- `sentry_issues_list` : Liste des problèmes Sentry pour les organisations et les projets, avec des fonctionnalités puissantes de recherche et de filtrage.
- `sentry_issues_get` : Récupère des informations détaillées pour un problème Sentry spécifique.
- `sentry_events_list` : Énumère les événements pour un problème particulier pour l'analyse des causes profondes.
- `sentry_events_get` : Obtient tous les détails sur un événement individuel, y compris les traces d'appel, le contexte et les métadonnées.
- `sentry_projects_list` : Liste tous les projets Sentry au sein de votre organisation.
- `sentry_project_get` : Récupère la configuration et les détails d'un projet spécifique.
- `sentry_releases_list` : Liste les versions récentes et leur statut de déploiement.
- `sentry_release_get` : Récupère des informations détaillées sur les versions, y compris les commits et les problèmes associés.

Que vous gériez de manière proactive la santé de votre application, que vous résoudiez des erreurs en production ou que vous automatisiez les flux de travail de publication, Sentry vous équipe d'une surveillance de classe mondiale, d'alertes exploitables et d'une intégration DevOps transparente. Améliorez la qualité de votre logiciel et la visibilité dans les recherches en utilisant Sentry pour le suivi des erreurs, l'observabilité et la gestion des versions, le tout depuis vos flux de travail agentiques.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Sentry dans le flux de travail. Surveillez les problèmes, gérez les projets, suivez les événements et coordonnez les versions à travers vos applications.

## Outils

### `sentry_issues_list`

Liste les problèmes de Sentry pour une organisation spécifique et éventuellement un projet spécifique. Renvoie les détails des problèmes, y compris le statut, le nombre d'erreurs et les horodatages de dernière apparition.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `projectSlug` | chaîne | Non | Filtrer les problèmes par slug de projet spécifique (facultatif) |
| `query` | chaîne | Non | Requête de recherche pour filtrer les problèmes. Prend en charge la syntaxe de recherche Sentry (par exemple, "is:unresolved", "level:error") |
| `statsPeriod` | chaîne | Non | Période pour les statistiques (par exemple, "24h", "7d", "30d"). Par défaut à 24h si non spécifié. |
| `cursor` | chaîne | Non | Curseur de pagination pour récupérer la page suivante de résultats |
| `limit` | nombre | Non | Nombre de problèmes à renvoyer par page (par défaut : 25, max : 100) |
| `status` | chaîne | Non | Filtrer par statut du problème : unresolved, resolved, ignored ou muted |
| `sort` | chaîne | Non | Ordre de tri : date, new, freq, priority ou user (par défaut : date) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issues` | array | Liste des problèmes Sentry |

### `sentry_issues_get`

Récupère des informations détaillées sur un problème Sentry spécifique par son ID. Renvoie les détails complets du problème, y compris les métadonnées, les tags et les statistiques.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | string | Oui | Le slug de l'organisation |
| `issueId` | string | Oui | L'ID unique du problème à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | Informations détaillées sur le problème Sentry |

### `sentry_issues_update`

Met à jour un problème Sentry en modifiant son statut, son attribution, son état de signet ou d'autres propriétés. Renvoie les détails du problème mis à jour.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | string | Oui | Le slug de l'organisation |
| `issueId` | string | Oui | L'ID unique du problème à mettre à jour |
| `status` | string | Non | Nouveau statut pour le problème : resolved, unresolved, ignored, ou resolvedInNextRelease |
| `assignedTo` | string | Non | ID utilisateur ou email à qui attribuer le problème. Utilisez une chaîne vide pour retirer l'attribution. |
| `isBookmarked` | boolean | Non | Indique si le problème doit être mis en signet |
| `isSubscribed` | boolean | Non | Indique si l'on souhaite s'abonner aux mises à jour du problème |
| `isPublic` | boolean | Non | Indique si le problème doit être visible publiquement |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issue` | objet | Le problème Sentry mis à jour |

### `sentry_projects_list`

Liste tous les projets dans une organisation Sentry. Renvoie les détails du projet, y compris le nom, la plateforme, les équipes et la configuration.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `cursor` | chaîne | Non | Curseur de pagination pour récupérer la page suivante de résultats |
| `limit` | nombre | Non | Nombre de projets à renvoyer par page \(par défaut : 25, max : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `projects` | tableau | Liste des projets Sentry |

### `sentry_projects_get`

Récupère des informations détaillées sur un projet Sentry spécifique par son slug. Renvoie les détails complets du projet, y compris les équipes, les fonctionnalités et la configuration.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `projectSlug` | chaîne | Oui | L'ID ou le slug du projet à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `project` | objet | Informations détaillées sur le projet Sentry |

### `sentry_projects_create`

Créez un nouveau projet Sentry dans une organisation. Nécessite une équipe à laquelle associer le projet. Renvoie les détails du projet créé.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `name` | chaîne | Oui | Le nom du projet |
| `teamSlug` | chaîne | Oui | Le slug de l'équipe qui sera propriétaire de ce projet |
| `slug` | chaîne | Non | Identifiant de projet compatible URL \(généré automatiquement à partir du nom si non fourni\) |
| `platform` | chaîne | Non | Plateforme/langage pour le projet \(par exemple, javascript, python, node, react-native\). Si non spécifié, la valeur par défaut est "other" |
| `defaultRules` | booléen | Non | Indique s'il faut créer des règles d'alerte par défaut \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `project` | objet | Le projet Sentry nouvellement créé |

### `sentry_projects_update`

Mettez à jour un projet Sentry en modifiant son nom, son slug, sa plateforme ou d'autres paramètres. Renvoie les détails du projet mis à jour.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `projectSlug` | chaîne | Oui | Le slug du projet à mettre à jour |
| `name` | chaîne | Non | Nouveau nom pour le projet |
| `slug` | chaîne | Non | Nouvel identifiant de projet compatible URL |
| `platform` | chaîne | Non | Nouvelle plateforme/langage pour le projet \(par exemple, javascript, python, node\) |
| `isBookmarked` | booléen | Non | Indique s'il faut mettre le projet en favori |
| `digestsMinDelay` | nombre | Non | Délai minimum \(en secondes\) pour les notifications par digest |
| `digestsMaxDelay` | nombre | Non | Délai maximum \(en secondes\) pour les notifications par digest |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `project` | objet | Le projet Sentry mis à jour |

### `sentry_events_list`

Liste les événements d'un projet Sentry. Peut être filtré par ID de problème, requête ou période. Renvoie les détails de l'événement, y compris le contexte, les balises et les informations utilisateur.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `projectSlug` | chaîne | Oui | Le slug du projet dont on veut lister les événements |
| `issueId` | chaîne | Non | Filtrer les événements par un ID de problème spécifique |
| `query` | chaîne | Non | Requête de recherche pour filtrer les événements. Prend en charge la syntaxe de recherche Sentry \(ex. : "user.email:*@example.com"\) |
| `cursor` | chaîne | Non | Curseur de pagination pour récupérer la page suivante de résultats |
| `limit` | nombre | Non | Nombre d'événements à renvoyer par page \(par défaut : 50, max : 100\) |
| `statsPeriod` | chaîne | Non | Période à interroger \(ex. : "24h", "7d", "30d"\). Par défaut 90j si non spécifié. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `events` | tableau | Liste des événements Sentry |

### `sentry_events_get`

Récupère des informations détaillées sur un événement Sentry spécifique par son ID. Renvoie les détails complets de l'événement, y compris les traces de pile, les fils d'Ariane, le contexte et les informations utilisateur.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | string | Oui | Le slug de l'organisation |
| `projectSlug` | string | Oui | Le slug du projet |
| `eventId` | string | Oui | L'identifiant unique de l'événement à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `event` | object | Informations détaillées sur l'événement Sentry |

### `sentry_releases_list`

Liste les versions pour une organisation ou un projet Sentry. Renvoie les détails des versions, y compris la version, les commits, les informations de déploiement et les projets associés.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | string | Oui | Le slug de l'organisation |
| `projectSlug` | string | Non | Filtrer les versions par slug de projet spécifique \(facultatif\) |
| `query` | string | Non | Requête de recherche pour filtrer les versions \(par exemple, modèle de nom de version\) |
| `cursor` | string | Non | Curseur de pagination pour récupérer la page suivante de résultats |
| `limit` | number | Non | Nombre de versions à renvoyer par page \(par défaut : 25, max : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `releases` | array | Liste des versions Sentry |

### `sentry_releases_create`

Créez une nouvelle version dans Sentry. Une version est une version de votre code déployée dans un environnement. Peut inclure des informations de commit et des projets associés. Renvoie les détails de la version créée.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | chaîne | Oui | Le slug de l'organisation |
| `version` | chaîne | Oui | Identifiant de version pour la release (par exemple, "2.0.0", "my-app@1.0.0", ou un SHA de commit git) |
| `projects` | chaîne | Oui | Liste séparée par des virgules des slugs de projet à associer à cette version |
| `ref` | chaîne | Non | Référence Git (SHA de commit, tag ou branche) pour cette version |
| `url` | chaîne | Non | URL pointant vers la version (par exemple, page de version GitHub) |
| `dateReleased` | chaîne | Non | Horodatage ISO 8601 indiquant quand la version a été déployée (par défaut : heure actuelle) |
| `commits` | chaîne | Non | Tableau JSON d'objets de commit avec id, repository (facultatif) et message (facultatif). Exemple : `[{"id":"abc123","message":"Fix bug"}]` |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `release` | objet | La version Sentry nouvellement créée |

### `sentry_releases_deploy`

Créez un enregistrement de déploiement pour une version Sentry dans un environnement spécifique. Les déploiements suivent quand et où les versions sont déployées. Renvoie les détails du déploiement créé.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Jeton d'authentification de l'API Sentry |
| `organizationSlug` | string | Oui | Le slug de l'organisation |
| `version` | string | Oui | Identifiant de version de la release en cours de déploiement |
| `environment` | string | Oui | Nom de l'environnement où la release est déployée \(par ex., "production", "staging"\) |
| `name` | string | Non | Nom optionnel pour ce déploiement \(par ex., "Déploiement v2.0 en production"\) |
| `url` | string | Non | URL pointant vers le déploiement \(par ex., URL du pipeline CI/CD\) |
| `dateStarted` | string | Non | Horodatage ISO 8601 indiquant quand le déploiement a commencé \(par défaut : heure actuelle\) |
| `dateFinished` | string | Non | Horodatage ISO 8601 indiquant quand le déploiement s'est terminé |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deploy` | object | L'enregistrement du déploiement nouvellement créé |

## Remarques

- Catégorie : `tools`
- Type : `sentry`
```

--------------------------------------------------------------------------------

---[FILE: serper.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/serper.mdx

```text
---
title: Serper
description: Rechercher sur le web avec Serper
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="serper"
  color="#2B3543"
/>

{/* MANUAL-CONTENT-START:intro */}
[Serper](https://www.serper.com/) est une API de recherche Google qui offre aux développeurs un accès programmatique aux résultats de recherche Google. Elle propose un moyen fiable et performant d'intégrer les capacités de recherche Google dans les applications sans la complexité du web scraping ou les limitations d'autres API de recherche.

Avec Serper, vous pouvez :

- **Accéder aux résultats de recherche Google** : obtenir des données structurées des résultats de recherche Google de manière programmatique
- **Effectuer différents types de recherche** : lancer des recherches web, d'images, d'actualités et plus encore
- **Récupérer des métadonnées riches** : obtenir des titres, des extraits, des URL et d'autres informations pertinentes des résultats de recherche
- **Faire évoluer vos applications** : créer des fonctionnalités basées sur la recherche avec une API fiable et rapide
- **Éviter les limitations de taux** : obtenir un accès constant aux résultats de recherche sans vous soucier des blocages d'IP

Dans Sim, l'intégration de Serper permet à vos agents d'exploiter la puissance de la recherche web dans leurs flux de travail. Cela permet des scénarios d'automatisation sophistiqués qui nécessitent des informations à jour provenant d'internet. Vos agents peuvent formuler des requêtes de recherche, récupérer des résultats pertinents et utiliser ces informations pour prendre des décisions ou fournir des réponses. Cette intégration comble le fossé entre votre automatisation de flux de travail et les vastes connaissances disponibles sur le web, permettant à vos agents d'accéder à des informations en temps réel sans intervention manuelle. En connectant Sim avec Serper, vous pouvez créer des agents qui restent à jour avec les dernières informations, fournissent des réponses plus précises et apportent plus de valeur aux utilisateurs.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer Serper dans le flux de travail. Peut effectuer des recherches sur le web. Nécessite une clé API.

## Outils

### `serper_search`

Un puissant outil de recherche web qui donne accès aux résultats de recherche Google via l'API Serper.dev. Prend en charge différents types de recherches, notamment la recherche web classique, les actualités, les lieux et les images, chaque résultat contenant des métadonnées pertinentes comme les titres, les URL, les extraits et des informations spécifiques au type.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | chaîne | Oui | La requête de recherche |
| `num` | nombre | Non | Nombre de résultats à retourner |
| `gl` | chaîne | Non | Code pays pour les résultats de recherche |
| `hl` | chaîne | Non | Code langue pour les résultats de recherche |
| `type` | chaîne | Non | Type de recherche à effectuer |
| `apiKey` | chaîne | Oui | Clé API Serper |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `searchResults` | tableau | Résultats de recherche avec titres, liens, extraits et métadonnées spécifiques au type \(date pour les actualités, évaluation pour les lieux, imageUrl pour les images\) |

## Notes

- Catégorie : `tools`
- Type : `serper`
```

--------------------------------------------------------------------------------

````
