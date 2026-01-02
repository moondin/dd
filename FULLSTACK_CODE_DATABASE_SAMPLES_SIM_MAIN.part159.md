---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 159
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 159 of 933)

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

---[FILE: gitlab.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/gitlab.mdx

```text
---
title: GitLab
description: Interagissez avec les projets, les problèmes, les demandes de
  fusion et les pipelines GitLab
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gitlab"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitLab](https://gitlab.com/) est une plateforme DevOps complète qui permet aux équipes de gérer, collaborer et automatiser leur cycle de développement logiciel. Avec GitLab, vous pouvez facilement gérer le code source, l'intégration continue/déploiement continu (CI/CD), les révisions et la collaboration dans une seule application.

Avec GitLab dans Sim, vous pouvez :

- **Gérer des projets et des dépôts** : lister et récupérer vos projets GitLab, accéder aux détails et organiser vos dépôts
- **Travailler avec des problèmes** : lister, créer et commenter des problèmes pour suivre le travail et collaborer efficacement
- **Gérer les demandes de fusion** : examiner, créer et gérer les demandes de fusion pour les modifications de code et les révisions par les pairs
- **Automatiser les pipelines CI/CD** : déclencher, surveiller et interagir avec les pipelines GitLab dans le cadre de vos flux d'automatisation
- **Collaborer avec des commentaires** : ajouter des commentaires aux problèmes ou aux demandes de fusion pour une communication efficace au sein de votre équipe

En utilisant l'intégration GitLab de Sim, vos agents peuvent interagir par programmation avec vos projets GitLab. Automatisez la gestion de projet, le suivi des problèmes, les révisions de code et les opérations de pipeline de manière transparente dans vos flux de travail, optimisant ainsi votre processus de développement logiciel et améliorant la collaboration au sein de votre équipe.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez GitLab dans le flux de travail. Peut gérer les projets, les problèmes, les demandes de fusion, les pipelines et ajouter des commentaires. Prend en charge toutes les opérations DevOps de base de GitLab.

## Outils

### `gitlab_list_projects`

Lister les projets GitLab accessibles à l'utilisateur authentifié

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `owned` | boolean | Non | Limiter aux projets appartenant à l'utilisateur actuel |
| `membership` | boolean | Non | Limiter aux projets dont l'utilisateur actuel est membre |
| `search` | string | Non | Rechercher des projets par nom |
| `visibility` | string | Non | Filtrer par visibilité \(public, internal, private\) |
| `orderBy` | string | Non | Trier par champ \(id, name, path, created_at, updated_at, last_activity_at\) |
| `sort` | string | Non | Direction de tri \(asc, desc\) |
| `perPage` | number | Non | Nombre de résultats par page \(20 par défaut, 100 max\) |
| `page` | number | Non | Numéro de page pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `projects` | array | Liste des projets GitLab |
| `total` | number | Nombre total de projets |

### `gitlab_get_project`

Obtenir les détails d'un projet GitLab spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé en URL \(ex. : "namespace/project"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | Les détails du projet GitLab |

### `gitlab_list_issues`

Lister les problèmes dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé en URL |
| `state` | string | Non | Filtrer par état \(opened, closed, all\) |
| `labels` | string | Non | Liste de noms d'étiquettes séparés par des virgules |
| `assigneeId` | number | Non | Filtrer par ID d'utilisateur assigné |
| `milestoneTitle` | string | Non | Filtrer par titre de jalon |
| `search` | string | Non | Rechercher des problèmes par titre et description |
| `orderBy` | string | Non | Trier par champ \(created_at, updated_at\) |
| `sort` | string | Non | Direction de tri \(asc, desc\) |
| `perPage` | number | Non | Nombre de résultats par page \(20 par défaut, max 100\) |
| `page` | number | Non | Numéro de page pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issues` | array | Liste des problèmes GitLab |
| `total` | number | Nombre total de problèmes |

### `gitlab_get_issue`

Obtenir les détails d'un problème GitLab spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé URL |
| `issueIid` | number | Oui | Numéro du problème dans le projet \(le # affiché dans l'interface GitLab\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | Les détails du problème GitLab |

### `gitlab_create_issue`

Créer un nouveau problème dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé URL |
| `title` | string | Oui | Titre du problème |
| `description` | string | Non | Description du problème \(Markdown pris en charge\) |
| `labels` | string | Non | Liste d'étiquettes séparées par des virgules |
| `assigneeIds` | array | Non | Tableau d'ID utilisateurs à assigner |
| `milestoneId` | number | Non | ID du jalon à assigner |
| `dueDate` | string | Non | Date d'échéance au format AAAA-MM-JJ |
| `confidential` | boolean | Non | Si le problème est confidentiel |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issue` | objet | Le ticket GitLab créé |

### `gitlab_update_issue`

Mettre à jour un ticket existant dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé URL |
| `issueIid` | nombre | Oui | ID interne du ticket \(IID\) |
| `title` | chaîne | Non | Nouveau titre du ticket |
| `description` | chaîne | Non | Nouvelle description du ticket \(Markdown pris en charge\) |
| `stateEvent` | chaîne | Non | Événement d'état \(close ou reopen\) |
| `labels` | chaîne | Non | Liste de noms d'étiquettes séparés par des virgules |
| `assigneeIds` | tableau | Non | Tableau d'ID utilisateurs à assigner |
| `milestoneId` | nombre | Non | ID du jalon à assigner |
| `dueDate` | chaîne | Non | Date d'échéance au format AAAA-MM-JJ |
| `confidential` | booléen | Non | Indique si le ticket est confidentiel |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `issue` | objet | Le ticket GitLab mis à jour |

### `gitlab_delete_issue`

Supprimer un ticket d'un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé URL |
| `issueIid` | nombre | Oui | ID interne du ticket \(IID\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si le problème a été supprimé avec succès |

### `gitlab_create_issue_note`

Ajouter un commentaire à un problème GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé en URL |
| `issueIid` | number | Oui | ID interne du problème (IID) |
| `body` | string | Oui | Corps du commentaire (Markdown pris en charge) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `note` | object | Le commentaire créé |

### `gitlab_list_merge_requests`

Lister les demandes de fusion dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé en URL |
| `state` | string | Non | Filtrer par état (opened, closed, merged, all) |
| `labels` | string | Non | Liste de noms d'étiquettes séparés par des virgules |
| `sourceBranch` | string | Non | Filtrer par branche source |
| `targetBranch` | string | Non | Filtrer par branche cible |
| `orderBy` | string | Non | Trier par champ (created_at, updated_at) |
| `sort` | string | Non | Direction de tri (asc, desc) |
| `perPage` | number | Non | Nombre de résultats par page (20 par défaut, 100 max) |
| `page` | number | Non | Numéro de page pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequests` | array | Liste des demandes de fusion GitLab |
| `total` | number | Nombre total de demandes de fusion |

### `gitlab_get_merge_request`

Obtenir les détails d'une demande de fusion GitLab spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé en URL |
| `mergeRequestIid` | number | Oui | ID interne de la demande de fusion \(IID\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | object | Les détails de la demande de fusion GitLab |

### `gitlab_create_merge_request`

Créer une nouvelle demande de fusion dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé en URL |
| `sourceBranch` | string | Oui | Nom de la branche source |
| `targetBranch` | string | Oui | Nom de la branche cible |
| `title` | string | Oui | Titre de la demande de fusion |
| `description` | string | Non | Description de la demande de fusion \(Markdown pris en charge\) |
| `labels` | string | Non | Liste de noms d'étiquettes séparés par des virgules |
| `assigneeIds` | array | Non | Tableau d'ID utilisateurs à assigner |
| `milestoneId` | number | Non | ID du jalon à assigner |
| `removeSourceBranch` | boolean | Non | Supprimer la branche source après la fusion |
| `squash` | boolean | Non | Regrouper les commits lors de la fusion |
| `draft` | boolean | Non | Marquer comme brouillon \(travail en cours\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | objet | La demande de fusion GitLab créée |

### `gitlab_update_merge_request`

Mettre à jour une demande de fusion existante dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé URL |
| `mergeRequestIid` | nombre | Oui | ID interne de la demande de fusion \(IID\) |
| `title` | chaîne | Non | Nouveau titre de la demande de fusion |
| `description` | chaîne | Non | Nouvelle description de la demande de fusion |
| `stateEvent` | chaîne | Non | Événement d'état \(close ou reopen\) |
| `labels` | chaîne | Non | Liste de noms d'étiquettes séparés par des virgules |
| `assigneeIds` | tableau | Non | Tableau d'ID utilisateurs à assigner |
| `milestoneId` | nombre | Non | ID du jalon à assigner |
| `targetBranch` | chaîne | Non | Nouvelle branche cible |
| `removeSourceBranch` | booléen | Non | Supprimer la branche source après la fusion |
| `squash` | booléen | Non | Regrouper les commits lors de la fusion |
| `draft` | booléen | Non | Marquer comme brouillon \(travail en cours\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | objet | La demande de fusion GitLab mise à jour |

### `gitlab_merge_merge_request`

Fusionner une demande de fusion dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé URL |
| `mergeRequestIid` | nombre | Oui | ID interne de la demande de fusion \(IID\) |
| `mergeCommitMessage` | chaîne | Non | Message personnalisé du commit de fusion |
| `squashCommitMessage` | chaîne | Non | Message personnalisé du commit de regroupement |
| `squash` | booléen | Non | Regrouper les commits avant la fusion |
| `shouldRemoveSourceBranch` | booléen | Non | Supprimer la branche source après la fusion |
| `mergeWhenPipelineSucceeds` | booléen | Non | Fusionner lorsque le pipeline réussit |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | objet | La demande de fusion GitLab fusionnée |

### `gitlab_create_merge_request_note`

Ajouter un commentaire à une demande de fusion GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé en URL |
| `mergeRequestIid` | nombre | Oui | ID interne de la demande de fusion \(IID\) |
| `body` | chaîne | Oui | Corps du commentaire \(Markdown pris en charge\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `note` | objet | Le commentaire créé |

### `gitlab_list_pipelines`

Lister les pipelines dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé en URL |
| `ref` | chaîne | Non | Filtrer par ref \(branche ou tag\) |
| `status` | chaîne | Non | Filtrer par statut \(created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled\) |
| `orderBy` | chaîne | Non | Trier par champ \(id, status, ref, updated_at, user_id\) |
| `sort` | chaîne | Non | Direction de tri \(asc, desc\) |
| `perPage` | nombre | Non | Nombre de résultats par page \(20 par défaut, 100 max\) |
| `page` | nombre | Non | Numéro de page pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pipelines` | array | Liste des pipelines GitLab |
| `total` | number | Nombre total de pipelines |

### `gitlab_get_pipeline`

Obtenir les détails d'un pipeline GitLab spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé URL |
| `pipelineId` | number | Oui | ID du pipeline |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | object | Les détails du pipeline GitLab |

### `gitlab_create_pipeline`

Déclencher un nouveau pipeline dans un projet GitLab

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé URL |
| `ref` | string | Oui | Branche ou tag sur lequel exécuter le pipeline |
| `variables` | array | Non | Tableau de variables pour le pipeline \(chacune avec clé, valeur et type de variable optionnel\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | object | Le pipeline GitLab créé |

### `gitlab_retry_pipeline`

Réessayer un pipeline GitLab échoué

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Oui | ID du projet ou chemin encodé URL |
| `pipelineId` | number | Oui | ID du pipeline |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | objet | Le pipeline GitLab relancé |

### `gitlab_cancel_pipeline`

Annuler un pipeline GitLab en cours d'exécution

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | ID du projet ou chemin encodé en URL |
| `pipelineId` | nombre | Oui | ID du pipeline |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | objet | Le pipeline GitLab annulé |

## Remarques

- Catégorie : `tools`
- Type : `gitlab`
```

--------------------------------------------------------------------------------

---[FILE: gmail.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/gmail.mdx

```text
---
title: Gmail
description: Envoyer, lire, rechercher et déplacer des messages Gmail ou
  déclencher des flux de travail à partir d'événements Gmail
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gmail"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Gmail](https://gmail.com) est le service de messagerie populaire de Google qui fournit une plateforme robuste pour envoyer, recevoir et gérer les communications par e-mail. Avec plus de 1,8 milliard d'utilisateurs actifs dans le monde, Gmail offre une expérience riche en fonctionnalités avec de puissantes capacités de recherche, des outils d'organisation et des options d'intégration.

Avec Gmail, vous pouvez :

- **Envoyer et recevoir des e-mails** : communiquer avec vos contacts via une interface claire et intuitive
- **Organiser vos messages** : utiliser des libellés, des dossiers et des filtres pour garder votre boîte de réception organisée
- **Rechercher efficacement** : trouver rapidement des messages spécifiques grâce à la puissante technologie de recherche de Google
- **Automatiser les flux de travail** : créer des filtres et des règles pour traiter automatiquement les e-mails entrants
- **Accéder de n'importe où** : utiliser Gmail sur tous vos appareils avec une synchronisation du contenu et des paramètres
- **S'intégrer à d'autres services** : se connecter à Google Agenda, Drive et d'autres outils de productivité

Dans Sim, l'intégration Gmail permet à vos agents de gérer entièrement les e-mails de manière programmatique avec des capacités d'automatisation complètes. Cela permet des scénarios d'automatisation puissants tels que l'envoi de notifications, le traitement des messages entrants, l'extraction d'informations des e-mails et la gestion des flux de communication à grande échelle. Vos agents peuvent :

- **Composer et envoyer** : créer des e-mails personnalisés avec pièces jointes et les envoyer aux destinataires
- **Lire et rechercher** : trouver des messages spécifiques en utilisant la syntaxe de requête Gmail et extraire du contenu
- **Organiser intelligemment** : marquer les messages comme lus/non lus, archiver ou désarchiver des e-mails et gérer les libellés
- **Nettoyer la boîte de réception** : supprimer des messages, déplacer des e-mails entre les libellés et maintenir une boîte de réception vide
- **Déclencher des flux de travail** : écouter les nouveaux e-mails en temps réel, permettant des flux de travail réactifs qui répondent aux messages entrants

Cette intégration comble le fossé entre vos flux de travail IA et les communications par e-mail, permettant une interaction transparente avec l'une des plateformes de communication les plus utilisées au monde. Que vous automatisiez les réponses du service client, traitiez des reçus, gériez des abonnements ou coordonniez les communications d'équipe, l'intégration Gmail fournit tous les outils nécessaires pour une automatisation complète des e-mails.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Gmail dans le flux de travail. Peut envoyer, lire, rechercher et déplacer des e-mails. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'un nouvel e-mail est reçu.

## Outils

### `gmail_send`

Envoyer des e-mails avec Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `to` | chaîne | Oui | Adresse e-mail du destinataire |
| `subject` | chaîne | Non | Objet de l'e-mail |
| `body` | chaîne | Oui | Contenu du corps de l'e-mail |
| `contentType` | chaîne | Non | Type de contenu pour le corps de l'e-mail \(texte ou html\) |
| `threadId` | chaîne | Non | ID de conversation pour répondre \(pour le fil de discussion\) |
| `replyToMessageId` | chaîne | Non | ID de message Gmail pour répondre - utilisez le champ "id" des résultats de lecture Gmail \(pas le "messageId" RFC\) |
| `cc` | chaîne | Non | Destinataires en copie \(séparés par des virgules\) |
| `bcc` | chaîne | Non | Destinataires en copie cachée \(séparés par des virgules\) |
| `attachments` | file[] | Non | Fichiers à joindre à l'e-mail |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées de l'e-mail |

### `gmail_draft`

Créer des brouillons d'e-mails avec Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `to` | chaîne | Oui | Adresse e-mail du destinataire |
| `subject` | chaîne | Non | Objet de l'e-mail |
| `body` | chaîne | Oui | Contenu du corps de l'e-mail |
| `contentType` | chaîne | Non | Type de contenu pour le corps de l'e-mail \(texte ou html\) |
| `threadId` | chaîne | Non | ID de conversation pour répondre \(pour le fil de discussion\) |
| `replyToMessageId` | chaîne | Non | ID de message Gmail pour répondre - utilisez le champ "id" des résultats de lecture Gmail \(pas le "messageId" RFC\) |
| `cc` | chaîne | Non | Destinataires en copie \(séparés par des virgules\) |
| `bcc` | chaîne | Non | Destinataires en copie cachée \(séparés par des virgules\) |
| `attachments` | file[] | Non | Fichiers à joindre au brouillon d'e-mail |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées du brouillon |

### `gmail_read`

Lire des e-mails depuis Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `messageId` | chaîne | Non | ID du message à lire |
| `folder` | chaîne | Non | Dossier/libellé depuis lequel lire les e-mails |
| `unreadOnly` | booléen | Non | Récupérer uniquement les messages non lus |
| `maxResults` | nombre | Non | Nombre maximum de messages à récupérer \(par défaut : 1, max : 10\) |
| `includeAttachments` | booléen | Non | Télécharger et inclure les pièces jointes des e-mails |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Contenu textuel de l'e-mail |
| `metadata` | json | Métadonnées de l'e-mail |
| `attachments` | file[] | Pièces jointes de l'e-mail |

### `gmail_search`

Rechercher des e-mails dans Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | chaîne | Oui | Requête de recherche pour les e-mails |
| `maxResults` | nombre | Non | Nombre maximum de résultats à retourner |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Résumé des résultats de recherche |
| `metadata` | objet | Métadonnées de recherche |

### `gmail_move`

Déplacer des e-mails entre les libellés/dossiers Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | chaîne | Oui | ID du message à déplacer |
| `addLabelIds` | chaîne | Oui | IDs de libellés à ajouter, séparés par des virgules (ex. INBOX, Label_123) |
| `removeLabelIds` | chaîne | Non | IDs de libellés à supprimer, séparés par des virgules (ex. INBOX, SPAM) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées de l'e-mail |

### `gmail_mark_read`

Marquer un message Gmail comme lu

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | chaîne | Oui | ID du message à marquer comme lu |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

### `gmail_mark_unread`

Marquer un message Gmail comme non lu

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à marquer comme non lu |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

### `gmail_archive`

Archiver un message Gmail (retirer de la boîte de réception)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à archiver |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

### `gmail_unarchive`

Désarchiver un message Gmail (remettre dans la boîte de réception)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à désarchiver |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

### `gmail_delete`

Supprimer un message Gmail (déplacer vers la corbeille)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

### `gmail_add_label`

Ajouter des étiquettes à un message Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message auquel ajouter des étiquettes |
| `labelIds` | string | Oui | IDs d'étiquettes séparés par des virgules à ajouter \(ex., INBOX, Label_123\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

### `gmail_remove_label`

Supprimer des étiquettes d'un message Gmail

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message duquel supprimer des étiquettes |
| `labelIds` | string | Oui | IDs d'étiquettes séparés par des virgules à supprimer \(ex., INBOX, Label_123\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de succès |
| `metadata` | object | Métadonnées de l'e-mail |

## Notes

- Catégorie : `tools`
- Type : `gmail`
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_calendar.mdx

```text
---
title: Google Calendar
description: Gérer les événements Google Calendar
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_calendar"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Calendar](https://calendar.google.com) est le service de calendrier et de planification puissant de Google qui fournit une plateforme complète pour gérer les événements, les réunions et les rendez-vous. Avec une intégration transparente dans l'écosystème Google et une adoption généralisée, Google Calendar offre des fonctionnalités robustes pour les besoins de planification personnels et professionnels.

Avec Google Calendar, vous pouvez :

- **Créer et gérer des événements** : planifier des réunions, des rendez-vous et des rappels avec des informations détaillées
- **Envoyer des invitations** : notifier et coordonner automatiquement avec les participants via des invitations par e-mail
- **Création d'événements en langage naturel** : ajouter rapidement des événements en utilisant un langage conversationnel comme « Réunion avec Jean demain à 15h »
- **Visualiser et rechercher des événements** : trouver et accéder facilement à vos événements programmés sur plusieurs calendriers
- **Gérer plusieurs calendriers** : organiser différents types d'événements sur divers calendriers

Dans Sim, l'intégration de Google Calendar permet à vos agents de créer, lire et gérer programmatiquement des événements de calendrier. Cela permet des scénarios d'automatisation puissants tels que la planification de réunions, l'envoi d'invitations, la vérification de disponibilité et la gestion des détails d'événements. Vos agents peuvent créer des événements avec une saisie en langage naturel, envoyer automatiquement des invitations aux participants, récupérer des informations sur les événements et lister les événements à venir. Cette intégration comble le fossé entre vos flux de travail IA et la gestion de calendrier, permettant une automatisation de planification fluide et une coordination avec l'une des plateformes de calendrier les plus utilisées au monde.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Calendar dans le flux de travail. Peut créer, lire, mettre à jour et lister les événements du calendrier. Nécessite OAuth.

## Outils

### `google_calendar_create`

Créer un nouvel événement dans Google Agenda

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `calendarId` | chaîne | Non | ID du calendrier (par défaut : primaire) |
| `summary` | chaîne | Oui | Titre/résumé de l'événement |
| `description` | chaîne | Non | Description de l'événement |
| `location` | chaîne | Non | Lieu de l'événement |
| `startDateTime` | chaîne | Oui | Date et heure de début. DOIT inclure le décalage horaire (ex. : 2025-06-03T10:00:00-08:00) OU fournir le paramètre timeZone |
| `endDateTime` | chaîne | Oui | Date et heure de fin. DOIT inclure le décalage horaire (ex. : 2025-06-03T11:00:00-08:00) OU fournir le paramètre timeZone |
| `timeZone` | chaîne | Non | Fuseau horaire (ex. : America/Los_Angeles). Obligatoire si la date/heure n'inclut pas de décalage. Par défaut : America/Los_Angeles si non fourni. |
| `attendees` | tableau | Non | Tableau d'adresses e-mail des participants |
| `sendUpdates` | chaîne | Non | Comment envoyer les mises à jour aux participants : all, externalOnly, ou none |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de confirmation de création d'événement |
| `metadata` | json | Métadonnées de l'événement créé, y compris l'ID, le statut et les détails |

### `google_calendar_list`

Lister les événements de Google Agenda

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | chaîne | Non | ID du calendrier (par défaut : primaire) |
| `timeMin` | chaîne | Non | Limite inférieure pour les événements (horodatage RFC3339, ex. : 2025-06-03T00:00:00Z) |
| `timeMax` | chaîne | Non | Limite supérieure pour les événements (horodatage RFC3339, ex. : 2025-06-04T00:00:00Z) |
| `orderBy` | chaîne | Non | Ordre des événements retournés (startTime ou updated) |
| `showDeleted` | booléen | Non | Inclure les événements supprimés |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Résumé du nombre d'événements trouvés |
| `metadata` | json | Liste des événements avec jetons de pagination et détails des événements |

### `google_calendar_get`

Obtenir un événement spécifique de Google Calendar

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `calendarId` | string | Non | ID du calendrier (par défaut : primaire) |
| `eventId` | string | Oui | ID de l'événement à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de confirmation de récupération de l'événement |
| `metadata` | json | Détails de l'événement incluant ID, statut, horaires et participants |

### `google_calendar_quick_add`

Créer des événements à partir de texte en langage naturel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `calendarId` | string | Non | ID du calendrier (par défaut : primaire) |
| `text` | string | Oui | Texte en langage naturel décrivant l'événement (ex. : "Réunion avec Jean demain à 15h") |
| `attendees` | array | Non | Tableau d'adresses e-mail des participants (chaîne séparée par des virgules également acceptée) |
| `sendUpdates` | string | Non | Comment envoyer les mises à jour aux participants : all, externalOnly, ou none |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Message de confirmation de création d'événement à partir du langage naturel |
| `metadata` | json | Métadonnées de l'événement créé incluant les détails analysés |

### `google_calendar_invite`

Inviter des participants à un événement Google Calendar existant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | chaîne | Non | ID du calendrier (par défaut : primaire) |
| `eventId` | chaîne | Oui | ID de l'événement auquel inviter des participants |
| `attendees` | tableau | Oui | Tableau d'adresses e-mail des participants à inviter |
| `sendUpdates` | chaîne | Non | Comment envoyer les mises à jour aux participants : all, externalOnly, ou none |
| `replaceExisting` | booléen | Non | Remplacer les participants existants ou les ajouter (par défaut : false) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de confirmation d'invitation des participants avec statut de livraison des e-mails |
| `metadata` | json | Métadonnées de l'événement mises à jour, incluant la liste des participants et les détails |

## Notes

- Catégorie : `tools`
- Type : `google_calendar`
```

--------------------------------------------------------------------------------

````
