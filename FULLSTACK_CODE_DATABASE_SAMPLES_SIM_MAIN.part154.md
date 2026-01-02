---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 154
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 154 of 933)

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

---[FILE: calendly.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/calendly.mdx

```text
---
title: Calendly
description: Gérer la planification et les événements Calendly
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="calendly"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Calendly](https://calendly.com/) est une plateforme populaire d'automatisation de planification qui vous aide à organiser des réunions, des événements et des rendez-vous facilement. Avec Calendly, les équipes et les individus peuvent simplifier la planification, réduire les échanges d'e-mails et automatiser les tâches liées aux événements.

Avec l'intégration Sim Calendly, vos agents peuvent :

- **Récupérer des informations sur votre compte et les événements programmés** : Utilisez des outils pour obtenir des informations utilisateur, des types d'événements et des événements programmés pour analyse ou automatisation.
- **Gérer les types d'événements et la planification** : Accédez et listez les types d'événements disponibles pour les utilisateurs ou les organisations, récupérez des détails sur des types d'événements spécifiques, et surveillez les réunions programmées et les données des invités.
- **Automatiser les suivis et les flux de travail** : Lorsque les utilisateurs planifient, replanifient ou annulent des réunions, les agents Sim peuvent automatiquement déclencher les flux de travail correspondants—comme l'envoi de rappels, la mise à jour des CRM ou la notification des participants.
- **S'intégrer facilement à l'aide de webhooks** : Configurez des flux de travail Sim pour répondre aux événements webhook de Calendly en temps réel, notamment lorsque les invités planifient, annulent ou interagissent avec des formulaires de routage.

Que vous souhaitiez automatiser la préparation des réunions, gérer les invitations ou exécuter des flux de travail personnalisés en réponse à l'activité de planification, les outils Calendly dans Sim vous offrent un accès flexible et sécurisé. Débloquez de nouvelles automatisations en réagissant instantanément aux changements de planification—simplifiant les opérations et les communications de votre équipe.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Calendly dans votre flux de travail. Gérez les types d'événements, les événements programmés, les invités et les webhooks. Peut également déclencher des flux de travail basés sur les événements webhook de Calendly (invité programmé, invité annulé, formulaire de routage soumis). Nécessite un jeton d'accès personnel.

## Outils

### `calendly_get_current_user`

Obtenir des informations sur l'utilisateur Calendly actuellement authentifié

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Informations sur l'utilisateur actuel |

### `calendly_list_event_types`

Récupérer une liste de tous les types d'événements pour un utilisateur ou une organisation

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |
| `user` | string | Non | Renvoie uniquement les types d'événements appartenant à cet utilisateur \(format URI\) |
| `organization` | string | Non | Renvoie uniquement les types d'événements appartenant à cette organisation \(format URI\) |
| `count` | number | Non | Nombre de résultats par page \(par défaut : 20, max : 100\) |
| `pageToken` | string | Non | Jeton de page pour la pagination |
| `sort` | string | Non | Ordre de tri pour les résultats \(par ex., "name:asc", "name:desc"\) |
| `active` | boolean | Non | Lorsque true, affiche uniquement les types d'événements actifs. Lorsque false ou non coché, affiche tous les types d'événements \(actifs et inactifs\). |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `collection` | array | Tableau d'objets de type d'événement |

### `calendly_get_event_type`

Obtenir des informations détaillées sur un type d'événement spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |
| `eventTypeUuid` | string | Oui | UUID du type d'événement \(peut être l'URI complète ou simplement l'UUID\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Détails du type d'événement |

### `calendly_list_scheduled_events`

Récupérer une liste des événements programmés pour un utilisateur ou une organisation

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |
| `user` | string | Non | Renvoyer les événements appartenant à cet utilisateur \(format URI\). Soit "user" soit "organization" doit être fourni. |
| `organization` | string | Non | Renvoyer les événements appartenant à cette organisation \(format URI\). Soit "user" soit "organization" doit être fourni. |
| `invitee_email` | string | Non | Renvoyer les événements où l'invité a cette adresse e-mail |
| `count` | number | Non | Nombre de résultats par page \(par défaut : 20, max : 100\) |
| `max_start_time` | string | Non | Renvoyer les événements avec une heure de début avant cette heure \(format ISO 8601\) |
| `min_start_time` | string | Non | Renvoyer les événements avec une heure de début après cette heure \(format ISO 8601\) |
| `pageToken` | string | Non | Jeton de page pour la pagination |
| `sort` | string | Non | Ordre de tri pour les résultats \(par ex., "start_time:asc", "start_time:desc"\) |
| `status` | string | Non | Filtrer par statut \("active" ou "canceled"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `collection` | array | Tableau d'objets d'événements programmés |

### `calendly_get_scheduled_event`

Obtenir des informations détaillées sur un événement programmé spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |
| `eventUuid` | string | Oui | UUID de l'événement programmé \(peut être l'URI complète ou simplement l'UUID\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Détails de l'événement programmé |

### `calendly_list_event_invitees`

Récupérer une liste des invités pour un événement programmé

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |
| `eventUuid` | string | Oui | UUID de l'événement programmé \(peut être l'URI complète ou simplement l'UUID\) |
| `count` | number | Non | Nombre de résultats par page \(par défaut : 20, max : 100\) |
| `email` | string | Non | Filtrer les invités par adresse email |
| `pageToken` | string | Non | Jeton de page pour la pagination |
| `sort` | string | Non | Ordre de tri pour les résultats \(par ex., "created_at:asc", "created_at:desc"\) |
| `status` | string | Non | Filtrer par statut \("active" ou "canceled"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `collection` | array | Tableau d'objets invités |

### `calendly_cancel_event`

Annuler un événement programmé

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton d'accès personnel Calendly |
| `eventUuid` | string | Oui | UUID de l'événement programmé à annuler \(peut être l'URI complète ou simplement l'UUID\) |
| `reason` | string | Non | Motif d'annulation \(sera envoyé aux invités\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Détails de l'annulation |

## Remarques

- Catégorie : `tools`
- Type : `calendly`
```

--------------------------------------------------------------------------------

---[FILE: clay.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/clay.mdx

```text
---
title: Clay
description: Remplir un classeur Clay
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="clay"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Clay](https://www.clay.com/) est une plateforme d'enrichissement de données et d'automatisation de flux de travail qui aide les équipes à rationaliser la génération de leads, la recherche et les opérations de données grâce à des intégrations puissantes et des entrées flexibles.

Découvrez comment utiliser l'outil Clay dans Sim pour insérer facilement des données dans un classeur Clay via des déclencheurs webhook. Ce tutoriel vous guide à travers la configuration d'un webhook, le mappage des données et l'automatisation des mises à jour en temps réel de vos classeurs Clay. Parfait pour rationaliser la génération de leads et l'enrichissement des données directement depuis votre flux de travail !

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cx_75X5sI_s"
  title="Intégration de Clay avec Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Avec Clay, vous pouvez :

- **Enrichir les sorties des agents** : alimenter automatiquement vos données d'agent Sim dans les tableaux Clay pour un suivi et une analyse structurés
- **Déclencher des flux de travail via webhooks** : utiliser la prise en charge des webhooks de Clay pour initier des tâches d'agent Sim depuis Clay
- **Exploiter des boucles de données** : itérer facilement sur des lignes de données enrichies avec des agents qui opèrent sur des ensembles de données dynamiques

Dans Sim, l'intégration Clay permet à vos agents de pousser des données structurées dans les tableaux Clay via des webhooks. Cela facilite la collecte, l'enrichissement et la gestion des sorties dynamiques telles que les leads, les résumés de recherche ou les éléments d'action, le tout dans une interface collaborative de type tableur. Vos agents peuvent remplir des lignes en temps réel, permettant des flux de travail asynchrones où les informations générées par l'IA sont capturées, examinées et utilisées par votre équipe. Que vous automatisiez la recherche, enrichissiez les données CRM ou suiviez les résultats opérationnels, Clay devient une couche de données vivante qui interagit intelligemment avec vos agents. En connectant Sim à Clay, vous obtenez un moyen puissant d'opérationnaliser les résultats des agents, de parcourir des ensembles de données avec précision et de maintenir un enregistrement propre et vérifiable du travail piloté par l'IA.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Clay dans le flux de travail. Peut remplir un tableau avec des données. Nécessite une clé API.

## Outils

### `clay_populate`

Remplir Clay avec des données provenant d'un fichier JSON. Permet une communication directe et des notifications avec suivi des horodatages et confirmation de canal.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `webhookURL` | string | Oui | L'URL du webhook à remplir |
| `data` | json | Oui | Les données à remplir |
| `authToken` | string | Non | Jeton d'authentification optionnel pour l'authentification du webhook Clay \(la plupart des webhooks ne nécessitent pas cela\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | json | Données de réponse du webhook Clay |
| `metadata` | object | Métadonnées de réponse du webhook |

## Notes

- Catégorie : `tools`
- Type : `clay`
```

--------------------------------------------------------------------------------

---[FILE: confluence.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/confluence.mdx

```text
---
title: Confluence
description: Interagir avec Confluence
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="confluence"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Confluence](https://www.atlassian.com/software/confluence) est la plateforme puissante de collaboration d'équipe et de gestion des connaissances d'Atlassian. Elle sert d'espace de travail centralisé où les équipes peuvent créer, organiser et partager des informations entre départements et organisations.

Avec Confluence, vous pouvez :

- **Créer une documentation structurée** : élaborer des wikis complets, des plans de projet et des bases de connaissances avec un formatage riche
- **Collaborer en temps réel** : travailler ensemble sur des documents avec vos coéquipiers, avec des commentaires, des mentions et des capacités d'édition
- **Organiser l'information de façon hiérarchique** : structurer le contenu avec des espaces, des pages et des hiérarchies imbriquées pour une navigation intuitive
- **Intégrer d'autres outils** : se connecter à Jira, Trello et d'autres produits Atlassian pour une intégration fluide des flux de travail
- **Contrôler les permissions d'accès** : gérer qui peut voir, modifier ou commenter un contenu spécifique

Dans Sim, l'intégration de Confluence permet à vos agents d'accéder et d'exploiter la base de connaissances de votre organisation. Les agents peuvent récupérer des informations à partir des pages Confluence, rechercher un contenu spécifique et même mettre à jour la documentation si nécessaire. Cela permet à vos flux de travail d'incorporer les connaissances collectives stockées dans votre instance Confluence, rendant possible la création d'agents qui peuvent référencer la documentation interne, suivre les procédures établies et maintenir à jour les ressources d'information dans le cadre de leurs opérations.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Confluence dans le flux de travail. Permet de lire, créer, mettre à jour, supprimer des pages, gérer les commentaires, les pièces jointes, les étiquettes et rechercher du contenu.

## Outils

### `confluence_retrieve`

Récupérez le contenu des pages Confluence en utilisant l'API Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence à récupérer |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la récupération |
| `pageId` | chaîne | ID de la page Confluence |
| `content` | chaîne | Contenu de la page sans balises HTML |
| `title` | chaîne | Titre de la page |

### `confluence_update`

Mettez à jour une page Confluence en utilisant l'API Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence à mettre à jour |
| `title` | chaîne | Non | Nouveau titre pour la page |
| `content` | chaîne | Non | Nouveau contenu pour la page au format de stockage Confluence |
| `version` | nombre | Non | Numéro de version de la page \(requis pour éviter les conflits\) |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Horodatage de la mise à jour |
| `pageId` | string | ID de la page Confluence |
| `title` | string | Titre de la page mise à jour |
| `success` | boolean | Statut de réussite de l'opération de mise à jour |

### `confluence_create_page`

Créer une nouvelle page dans un espace Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `spaceId` | chaîne | Oui | ID de l'espace Confluence où la page sera créée |
| `title` | chaîne | Oui | Titre de la nouvelle page |
| `content` | chaîne | Oui | Contenu de la page au format de stockage Confluence \(HTML\) |
| `parentId` | chaîne | Non | ID de la page parente si vous créez une page enfant |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la création |
| `pageId` | chaîne | ID de la page créée |
| `title` | chaîne | Titre de la page |
| `url` | chaîne | URL de la page |

### `confluence_delete_page`

Supprimer une page Confluence (la déplace dans la corbeille où elle peut être restaurée).

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence à supprimer |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la suppression |
| `pageId` | chaîne | ID de la page supprimée |
| `deleted` | booléen | Statut de la suppression |

### `confluence_search`

Rechercher du contenu dans les pages Confluence, les articles de blog et autres contenus.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `query` | chaîne | Oui | Chaîne de requête de recherche |
| `limit` | nombre | Non | Nombre maximum de résultats à renvoyer \(par défaut : 25\) |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la recherche |
| `results` | tableau | Résultats de la recherche |

### `confluence_create_comment`

Ajouter un commentaire à une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence sur laquelle commenter |
| `comment` | chaîne | Oui | Texte du commentaire au format de stockage Confluence |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de création |
| `commentId` | chaîne | ID du commentaire créé |
| `pageId` | chaîne | ID de la page |

### `confluence_list_comments`

Lister tous les commentaires d'une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence dont il faut lister les commentaires |
| `limit` | nombre | Non | Nombre maximum de commentaires à renvoyer \(par défaut : 25\) |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la récupération |
| `comments` | tableau | Liste des commentaires |

### `confluence_update_comment`

Mettre à jour un commentaire existant sur une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `commentId` | chaîne | Oui | ID du commentaire Confluence à mettre à jour |
| `comment` | chaîne | Oui | Texte du commentaire mis à jour au format de stockage Confluence |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la mise à jour |
| `commentId` | chaîne | ID du commentaire mis à jour |
| `updated` | booléen | Statut de la mise à jour |

### `confluence_delete_comment`

Supprimer un commentaire d'une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `commentId` | chaîne | Oui | ID du commentaire Confluence à supprimer |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la suppression |
| `commentId` | chaîne | ID du commentaire supprimé |
| `deleted` | booléen | Statut de la suppression |

### `confluence_upload_attachment`

Téléverser un fichier en tant que pièce jointe à une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence à laquelle joindre le fichier |
| `file` | fichier | Oui | Le fichier à téléverser en tant que pièce jointe |
| `fileName` | chaîne | Non | Nom de fichier personnalisé optionnel pour la pièce jointe |
| `comment` | chaîne | Non | Commentaire optionnel à ajouter à la pièce jointe |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage du téléversement |
| `attachmentId` | chaîne | ID de la pièce jointe téléversée |
| `title` | chaîne | Nom du fichier de la pièce jointe |
| `fileSize` | nombre | Taille du fichier en octets |
| `mediaType` | chaîne | Type MIME de la pièce jointe |
| `downloadUrl` | chaîne | URL de téléchargement de la pièce jointe |
| `pageId` | chaîne | ID de la page à laquelle la pièce jointe a été ajoutée |

### `confluence_list_attachments`

Lister toutes les pièces jointes d'une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence dont il faut lister les pièces jointes |
| `limit` | nombre | Non | Nombre maximum de pièces jointes à renvoyer \(par défaut : 25\) |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la récupération |
| `attachments` | tableau | Liste des pièces jointes |

### `confluence_delete_attachment`

Supprimer une pièce jointe d'une page Confluence (déplace vers la corbeille).

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `attachmentId` | chaîne | Oui | ID de la pièce jointe Confluence à supprimer |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la suppression |
| `attachmentId` | chaîne | ID de la pièce jointe supprimée |
| `deleted` | booléen | Statut de la suppression |

### `confluence_list_labels`

Lister tous les libellés d'une page Confluence.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `pageId` | chaîne | Oui | ID de la page Confluence dont il faut lister les libellés |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la récupération |
| `labels` | tableau | Liste des libellés |

### `confluence_get_space`

Obtenir les détails d'un espace Confluence spécifique.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `spaceId` | chaîne | Oui | ID de l'espace Confluence à récupérer |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la récupération |
| `spaceId` | chaîne | ID de l'espace |
| `name` | chaîne | Nom de l'espace |
| `key` | chaîne | Clé de l'espace |
| `type` | chaîne | Type d'espace |
| `status` | chaîne | Statut de l'espace |
| `url` | chaîne | URL de l'espace |

### `confluence_list_spaces`

Lister tous les espaces Confluence accessibles à l'utilisateur.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Votre domaine Confluence \(ex. : votreentreprise.atlassian.net\) |
| `limit` | nombre | Non | Nombre maximum d'espaces à renvoyer \(par défaut : 25\) |
| `cloudId` | chaîne | Non | ID Cloud Confluence pour l'instance. S'il n'est pas fourni, il sera récupéré à l'aide du domaine. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ts` | chaîne | Horodatage de la récupération |
| `spaces` | tableau | Liste des espaces |

## Notes

- Catégorie : `tools`
- Type : `confluence`
```

--------------------------------------------------------------------------------

---[FILE: cursor.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/cursor.mdx

```text
---
title: Cursor
description: Lancez et gérez des agents cloud Cursor pour travailler sur des dépôts GitHub
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="cursor"
  color="#1E1E1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Cursor](https://www.cursor.so/) est un IDE IA et une plateforme cloud qui vous permet de lancer et de gérer de puissants agents IA capables de travailler directement sur vos dépôts GitHub. Les agents Cursor peuvent automatiser les tâches de développement, améliorer la productivité de votre équipe et collaborer avec vous en apportant des modifications au code, en répondant aux instructions en langage naturel et en conservant l'historique des conversations sur leurs activités.

Avec Cursor, vous pouvez :

- **Lancer des agents cloud pour les bases de code** : créer instantanément de nouveaux agents IA qui travaillent sur vos dépôts dans le cloud
- **Déléguer des tâches de codage en langage naturel** : guider les agents avec des instructions écrites, des modifications et des clarifications
- **Suivre les progrès et les résultats** : récupérer l'état des agents, consulter les résultats détaillés et inspecter les tâches en cours ou terminées
- **Accéder à l'historique complet des conversations** : examiner toutes les requêtes et réponses de l'IA pour plus de transparence et de traçabilité
- **Contrôler et gérer le cycle de vie des agents** : lister les agents actifs, terminer des agents et gérer les lancements d'agents et les suivis via API

Dans Sim, l'intégration de Cursor permet à vos agents et flux de travail d'interagir par programmation avec les agents cloud de Cursor. Cela signifie que vous pouvez utiliser Sim pour :

- Lister tous les agents cloud et parcourir leur état actuel (`cursor_list_agents`)
- Récupérer l'état et les résultats à jour de n'importe quel agent (`cursor_get_agent`)
- Consulter l'historique complet des conversations pour tout agent de codage (`cursor_get_conversation`)
- Ajouter des instructions de suivi ou de nouvelles requêtes à un agent en cours d'exécution
- Gérer et terminer des agents selon les besoins

Cette intégration vous aide à combiner l'intelligence flexible des agents Sim avec les puissantes capacités d'automatisation du développement de Cursor, rendant possible l'extension du développement piloté par l'IA à travers vos projets.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Interagissez avec l'API Cursor Cloud Agents pour lancer des agents IA qui peuvent travailler sur vos dépôts GitHub. Prend en charge le lancement d'agents, l'ajout d'instructions complémentaires, la vérification du statut, la visualisation des conversations et la gestion du cycle de vie des agents.

## Outils

### `cursor_list_agents`

Liste tous les agents cloud pour l'utilisateur authentifié avec pagination optionnelle.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API Cursor |
| `limit` | number | Non | Nombre d'agents à retourner \(par défaut : 20, max : 100\) |
| `cursor` | string | Non | Curseur de pagination de la réponse précédente |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Liste lisible des agents |
| `metadata` | object | Métadonnées de la liste d'agents |

### `cursor_get_agent`

Récupère le statut actuel et les résultats d'un agent cloud.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Cursor |
| `agentId` | chaîne | Oui | Identifiant unique pour l'agent cloud \(ex. : bc_abc123\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Détails de l'agent en format lisible |
| `metadata` | object | Métadonnées de l'agent |

### `cursor_get_conversation`

Récupère l'historique de conversation d'un agent cloud, y compris toutes les instructions de l'utilisateur et les réponses de l'assistant.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API Cursor |
| `agentId` | string | Oui | Identifiant unique pour l'agent cloud \(ex. : bc_abc123\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Historique de conversation en format lisible |
| `metadata` | object | Métadonnées de la conversation |

### `cursor_launch_agent`

Démarrer un nouvel agent cloud pour travailler sur un dépôt GitHub avec les instructions données.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Cursor |
| `repository` | chaîne | Oui | URL du dépôt GitHub \(ex. : https://github.com/your-org/your-repo\) |
| `ref` | chaîne | Non | Branche, tag ou commit à partir duquel travailler \(par défaut : branche principale\) |
| `promptText` | chaîne | Oui | Le texte d'instruction pour l'agent |
| `promptImages` | chaîne | Non | Tableau JSON d'objets d'image avec données base64 et dimensions |
| `model` | chaîne | Non | Modèle à utiliser \(laisser vide pour sélection automatique\) |
| `branchName` | chaîne | Non | Nom de branche personnalisé pour l'agent |
| `autoCreatePr` | booléen | Non | Créer automatiquement une PR lorsque l'agent termine |
| `openAsCursorGithubApp` | booléen | Non | Ouvrir la PR en tant qu'application GitHub Cursor |
| `skipReviewerRequest` | booléen | Non | Ignorer la demande de relecteurs sur la PR |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès avec les détails de l'agent |
| `metadata` | objet | Métadonnées du résultat de lancement |

### `cursor_add_followup`

Ajouter une instruction complémentaire à un agent cloud existant.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Cursor |
| `agentId` | chaîne | Oui | Identifiant unique pour l'agent cloud \(ex. : bc_abc123\) |
| `followupPromptText` | chaîne | Oui | Le texte d'instruction complémentaire pour l'agent |
| `promptImages` | chaîne | Non | Tableau JSON d'objets d'image avec données base64 et dimensions \(max 5\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées du résultat |

### `cursor_stop_agent`

Arrêter un agent cloud en cours d'exécution. Cela met l'agent en pause sans le supprimer.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Cursor |
| `agentId` | chaîne | Oui | Identifiant unique pour l'agent cloud \(ex., bc_abc123\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées du résultat |

### `cursor_delete_agent`

Supprimer définitivement un agent cloud. Cette action ne peut pas être annulée.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Clé API Cursor |
| `agentId` | string | Oui | Identifiant unique pour l'agent cloud \(ex., bc_abc123\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées du résultat |

## Notes

- Catégorie : `tools`
- Type : `cursor`
```

--------------------------------------------------------------------------------

````
