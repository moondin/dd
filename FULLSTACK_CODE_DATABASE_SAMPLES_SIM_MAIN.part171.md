---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 171
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 171 of 933)

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

---[FILE: microsoft_teams.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/microsoft_teams.mdx

```text
---
title: Microsoft Teams
description: Gérer les messages, les réactions et les membres dans Teams
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_teams"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://teams.microsoft.com) est une plateforme robuste de communication et de collaboration qui permet aux utilisateurs d'échanger des messages en temps réel, d'organiser des réunions et de partager du contenu au sein d'équipes et d'organisations. En tant que partie intégrante de l'écosystème de productivité de Microsoft, Microsoft Teams offre des fonctionnalités de chat fluides intégrées à Office 365, permettant aux utilisateurs d'envoyer des messages, de coordonner leur travail et de rester connectés sur différents appareils et flux de travail.

Avec Microsoft Teams, vous pouvez :

- **Envoyer et recevoir des messages** : communiquer instantanément avec des individus ou des groupes dans des fils de discussion  
- **Collaborer en temps réel** : partager des mises à jour et des informations entre équipes dans des canaux et des discussions  
- **Organiser les conversations** : maintenir le contexte avec des discussions structurées et un historique de chat persistant  
- **Partager des fichiers et du contenu** : joindre et consulter des documents, des images et des liens directement dans le chat  
- **S'intégrer avec Microsoft 365** : se connecter de manière transparente avec Outlook, SharePoint, OneDrive et plus encore  
- **Accéder depuis différents appareils** : utiliser Teams sur ordinateur, web et mobile avec des conversations synchronisées dans le cloud  
- **Sécuriser la communication** : exploiter des fonctionnalités de sécurité et de conformité de niveau entreprise

Dans Sim, l'intégration de Microsoft Teams permet à vos agents d'interagir directement avec les messages de chat de manière programmatique. Cela permet des scénarios d'automatisation puissants tels que l'envoi de mises à jour, la publication d'alertes, la coordination des tâches et la réponse aux conversations en temps réel. Vos agents peuvent rédiger de nouveaux messages dans les chats ou les canaux, mettre à jour le contenu en fonction des données de flux de travail et interagir avec les utilisateurs là où la collaboration se produit. En intégrant Sim à Microsoft Teams, vous comblerez le fossé entre les flux de travail intelligents et la communication d'équipe — permettant à vos agents de rationaliser la collaboration, d'automatiser les tâches de communication et de maintenir vos équipes alignées.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Microsoft Teams dans le flux de travail. Lisez, écrivez, mettez à jour et supprimez des messages de conversation et de canal. Répondez aux messages, ajoutez des réactions et listez les membres d'équipe/canal. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'un message est envoyé à une conversation ou un canal. Pour mentionner des utilisateurs dans les messages, encadrez leur nom avec les balises `<at>` : `<at>userName</at>`

## Outils

### `microsoft_teams_read_chat`

Lire le contenu d'un chat Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | chaîne | Oui | L'ID de la conversation à partir de laquelle lire |
| `includeAttachments` | booléen | Non | Télécharger et inclure les pièces jointes des messages \(contenus hébergés\) dans le stockage |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération de lecture de la conversation Teams |
| `messageCount` | nombre | Nombre de messages récupérés de la conversation |
| `chatId` | chaîne | ID de la conversation qui a été lue |
| `messages` | tableau | Tableau d'objets de messages de conversation |
| `attachmentCount` | nombre | Nombre total de pièces jointes trouvées |
| `attachmentTypes` | tableau | Types de pièces jointes trouvées |
| `content` | chaîne | Contenu formaté des messages de conversation |
| `attachments` | fichier[] | Pièces jointes téléchargées pour plus de commodité \(aplaties\) |

### `microsoft_teams_write_chat`

Écrire ou mettre à jour du contenu dans une conversation Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | chaîne | Oui | L'ID de la conversation dans laquelle écrire |
| `content` | chaîne | Oui | Le contenu à écrire dans le message |
| `files` | fichier[] | Non | Fichiers à joindre au message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'envoi du message dans la conversation Teams |
| `messageId` | chaîne | Identifiant unique pour le message envoyé |
| `chatId` | chaîne | ID de la conversation où le message a été envoyé |
| `createdTime` | chaîne | Horodatage de création du message |
| `url` | chaîne | URL web vers le message |
| `updatedContent` | booléen | Indique si le contenu a été mis à jour avec succès |

### `microsoft_teams_read_channel`

Lire le contenu d'un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe à partir de laquelle lire |
| `channelId` | chaîne | Oui | L'ID du canal à partir duquel lire |
| `includeAttachments` | booléen | Non | Télécharger et inclure les pièces jointes des messages \(contenus hébergés\) dans le stockage |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération de lecture du canal Teams |
| `messageCount` | nombre | Nombre de messages récupérés du canal |
| `teamId` | chaîne | ID de l'équipe qui a été lue |
| `channelId` | chaîne | ID du canal qui a été lu |
| `messages` | tableau | Tableau d'objets de messages du canal |
| `attachmentCount` | nombre | Nombre total de pièces jointes trouvées |
| `attachmentTypes` | tableau | Types de pièces jointes trouvées |
| `content` | chaîne | Contenu formaté des messages du canal |
| `attachments` | fichier[] | Pièces jointes téléchargées pour plus de commodité \(aplaties\) |

### `microsoft_teams_write_channel`

Écrire ou envoyer un message à un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe dans laquelle écrire |
| `channelId` | chaîne | Oui | L'ID du canal dans lequel écrire |
| `content` | chaîne | Oui | Le contenu à écrire dans le canal |
| `files` | fichier[] | Non | Fichiers à joindre au message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'envoi du message au canal Teams |
| `messageId` | chaîne | Identifiant unique pour le message envoyé |
| `teamId` | chaîne | ID de l'équipe où le message a été envoyé |
| `channelId` | chaîne | ID du canal où le message a été envoyé |
| `createdTime` | chaîne | Horodatage de création du message |
| `url` | chaîne | URL web vers le message |
| `updatedContent` | booléen | Indique si le contenu a été mis à jour avec succès |

### `microsoft_teams_update_chat_message`

Mettre à jour un message existant dans une conversation Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | chaîne | Oui | L'ID de la conversation contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à mettre à jour |
| `content` | chaîne | Oui | Le nouveau contenu pour le message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la mise à jour a réussi |
| `messageId` | chaîne | ID du message mis à jour |
| `updatedContent` | booléen | Indique si le contenu a été mis à jour avec succès |

### `microsoft_teams_update_channel_message`

Mettre à jour un message existant dans un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe |
| `channelId` | chaîne | Oui | L'ID du canal contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à mettre à jour |
| `content` | chaîne | Oui | Le nouveau contenu pour le message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la mise à jour a réussi |
| `messageId` | chaîne | ID du message mis à jour |
| `updatedContent` | booléen | Indique si le contenu a été mis à jour avec succès |

### `microsoft_teams_delete_chat_message`

Supprimer en douceur un message dans une conversation Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | chaîne | Oui | L'ID de la conversation contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la suppression a réussi |
| `deleted` | booléen | Confirmation de la suppression |
| `messageId` | chaîne | ID du message supprimé |

### `microsoft_teams_delete_channel_message`

Supprimer en douceur un message dans un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe |
| `channelId` | chaîne | Oui | L'ID du canal contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la suppression a réussi |
| `deleted` | booléen | Confirmation de la suppression |
| `messageId` | chaîne | ID du message supprimé |

### `microsoft_teams_reply_to_message`

Répondre à un message existant dans un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe |
| `channelId` | chaîne | Oui | L'ID du canal |
| `messageId` | chaîne | Oui | L'ID du message auquel répondre |
| `content` | chaîne | Oui | Le contenu de la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la réponse a réussi |
| `messageId` | chaîne | ID du message de réponse |
| `updatedContent` | booléen | Indique si le contenu a été envoyé avec succès |

### `microsoft_teams_get_message`

Obtenir un message spécifique d'une conversation ou d'un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Non | L'ID de l'équipe \(pour les messages de canal\) |
| `channelId` | chaîne | Non | L'ID du canal \(pour les messages de canal\) |
| `chatId` | chaîne | Non | L'ID de la conversation \(pour les messages de conversation\) |
| `messageId` | chaîne | Oui | L'ID du message à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la récupération a réussi |
| `content` | chaîne | Le contenu du message |
| `metadata` | objet | Métadonnées du message incluant l'expéditeur, l'horodatage, etc. |

### `microsoft_teams_set_reaction`

Ajouter une réaction emoji à un message dans Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Non | L'ID de l'équipe \(pour les messages de canal\) |
| `channelId` | chaîne | Non | L'ID du canal \(pour les messages de canal\) |
| `chatId` | chaîne | Non | L'ID de la conversation \(pour les messages de conversation\) |
| `messageId` | chaîne | Oui | L'ID du message auquel réagir |
| `reactionType` | chaîne | Oui | La réaction emoji \(par ex., ❤️, 👍, 😊\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la réaction a été ajoutée avec succès |
| `reactionType` | chaîne | L'emoji qui a été ajouté |
| `messageId` | chaîne | ID du message |

### `microsoft_teams_unset_reaction`

Supprimer une réaction emoji d'un message dans Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Non | L'ID de l'équipe \(pour les messages de canal\) |
| `channelId` | chaîne | Non | L'ID du canal \(pour les messages de canal\) |
| `chatId` | chaîne | Non | L'ID de la conversation \(pour les messages de conversation\) |
| `messageId` | chaîne | Oui | L'ID du message |
| `reactionType` | chaîne | Oui | La réaction emoji à supprimer \(par ex., ❤️, 👍, 😊\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la réaction a été supprimée avec succès |
| `reactionType` | chaîne | L'emoji qui a été supprimé |
| `messageId` | chaîne | ID du message |

### `microsoft_teams_list_team_members`

Lister tous les membres d'une équipe Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la liste a été générée avec succès |
| `members` | tableau | Tableau des membres de l'équipe |
| `memberCount` | nombre | Nombre total de membres |

### `microsoft_teams_list_channel_members`

Lister tous les membres d'un canal Microsoft Teams

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | chaîne | Oui | L'ID de l'équipe |
| `channelId` | chaîne | Oui | L'ID du canal |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la liste a été générée avec succès |
| `members` | tableau | Tableau des membres du canal |
| `memberCount` | nombre | Nombre total de membres |

## Remarques

- Catégorie : `tools`
- Type : `microsoft_teams`
```

--------------------------------------------------------------------------------

---[FILE: mistral_parse.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/mistral_parse.mdx

```text
---
title: Mistral Parser
description: Extraire du texte à partir de documents PDF
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mistral_parse"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
L'outil Mistral Parse offre un moyen puissant d'extraire et de traiter le contenu des documents PDF en utilisant [l'API OCR de Mistral](https://mistral.ai/). Cet outil exploite la reconnaissance optique de caractères avancée pour extraire avec précision le texte et la structure des fichiers PDF, facilitant ainsi l'intégration des données documentaires dans vos flux de travail d'agents.

Avec l'outil Mistral Parse, vous pouvez :

- **Extraire du texte des PDF** : convertir avec précision le contenu PDF en formats texte, markdown ou JSON
- **Traiter les PDF à partir d'URL** : extraire directement le contenu des PDF hébergés en ligne en fournissant leurs URL
- **Conserver la structure du document** : préserver la mise en forme, les tableaux et la disposition des PDF originaux
- **Extraire des images** : inclure optionnellement les images intégrées dans les PDF
- **Sélectionner des pages spécifiques** : traiter uniquement les pages dont vous avez besoin dans les documents multi-pages

L'outil Mistral Parse est particulièrement utile dans les scénarios où vos agents doivent travailler avec du contenu PDF, comme l'analyse de rapports, l'extraction de données de formulaires ou le traitement de texte à partir de documents numérisés. Il simplifie le processus de mise à disposition du contenu PDF pour vos agents, leur permettant de travailler avec les informations stockées dans les PDF aussi facilement qu'avec une saisie de texte directe.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Mistral Parse dans le flux de travail. Peut extraire du texte à partir de documents PDF téléchargés ou d'une URL. Nécessite une clé API.

## Outils

### `mistral_parser`

Analyser des documents PDF avec l'API OCR de Mistral

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `filePath` | chaîne | Oui | URL vers un document PDF à traiter |
| `fileUpload` | objet | Non | Données de téléchargement de fichier provenant du composant de téléchargement de fichier |
| `resultType` | chaîne | Non | Type de résultat analysé \(markdown, texte ou json\). Par défaut : markdown. |
| `includeImageBase64` | booléen | Non | Inclure les images encodées en base64 dans la réponse |
| `pages` | tableau | Non | Pages spécifiques à traiter \(tableau de numéros de page, commençant par 0\) |
| `imageLimit` | nombre | Non | Nombre maximum d'images à extraire du PDF |
| `imageMinSize` | nombre | Non | Hauteur et largeur minimales des images à extraire du PDF |
| `apiKey` | chaîne | Oui | Clé API Mistral \(MISTRAL_API_KEY\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si le PDF a été analysé avec succès |
| `content` | string | Contenu extrait dans le format demandé (markdown, texte ou JSON) |
| `metadata` | object | Métadonnées de traitement incluant jobId, fileType, pageCount et informations d'utilisation |

## Remarques

- Catégorie : `tools`
- Type : `mistral_parse`
```

--------------------------------------------------------------------------------

---[FILE: mongodb.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/mongodb.mdx

```text
---
title: MongoDB
description: Connexion à la base de données MongoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mongodb"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
L'outil [MongoDB](https://www.mongodb.com/) vous permet de vous connecter à une base de données MongoDB et d'effectuer une large gamme d'opérations orientées document directement dans vos flux de travail d'agents. Avec une configuration flexible et une gestion sécurisée des connexions, vous pouvez facilement interagir avec vos données et les manipuler.

Avec l'outil MongoDB, vous pouvez :

- **Trouver des documents** : interroger des collections et récupérer des documents avec l'opération `mongodb_query` en utilisant des filtres de requête riches.
- **Insérer des documents** : ajouter un ou plusieurs documents à une collection en utilisant l'opération `mongodb_insert`.
- **Mettre à jour des documents** : modifier des documents existants avec l'opération `mongodb_update` en spécifiant des critères de filtre et les actions de mise à jour.
- **Supprimer des documents** : retirer des documents d'une collection en utilisant l'opération `mongodb_delete`, en spécifiant des filtres et des options de suppression.
- **Agréger des données** : exécuter des pipelines d'agrégation complexes avec l'opération `mongodb_execute` pour transformer et analyser vos données.

L'outil MongoDB est idéal pour les flux de travail où vos agents doivent gérer ou analyser des données structurées basées sur des documents. Qu'il s'agisse de traiter du contenu généré par les utilisateurs, de gérer des données d'application ou d'alimenter des analyses, l'outil MongoDB simplifie l'accès et la manipulation de vos données de manière sécurisée et programmatique.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez MongoDB dans le flux de travail. Permet de trouver, insérer, mettre à jour, supprimer et agréger des données.

## Outils

### `mongodb_query`

Exécuter une opération de recherche sur une collection MongoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur MongoDB |
| `port` | number | Oui | Port du serveur MongoDB \(par défaut : 27017\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Non | Nom d'utilisateur MongoDB |
| `password` | string | Non | Mot de passe MongoDB |
| `authSource` | string | Non | Base de données d'authentification |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `collection` | string | Oui | Nom de la collection à interroger |
| `query` | string | Non | Filtre de requête MongoDB au format JSON |
| `limit` | number | Non | Nombre maximum de documents à retourner |
| `sort` | string | Non | Critères de tri au format JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `documents` | tableau | Tableau des documents retournés par la requête |
| `documentCount` | nombre | Nombre de documents retournés |

### `mongodb_insert`

Insérer des documents dans une collection MongoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur MongoDB |
| `port` | nombre | Oui | Port du serveur MongoDB \(par défaut : 27017\) |
| `database` | chaîne | Oui | Nom de la base de données à laquelle se connecter |
| `username` | chaîne | Non | Nom d'utilisateur MongoDB |
| `password` | chaîne | Non | Mot de passe MongoDB |
| `authSource` | chaîne | Non | Base de données d'authentification |
| `ssl` | chaîne | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `collection` | chaîne | Oui | Nom de la collection dans laquelle insérer |
| `documents` | tableau | Oui | Tableau des documents à insérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `documentCount` | nombre | Nombre de documents insérés |
| `insertedId` | chaîne | ID du document inséré \(insertion unique\) |
| `insertedIds` | tableau | Tableau des ID des documents insérés \(insertion multiple\) |

### `mongodb_update`

Mettre à jour des documents dans une collection MongoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur MongoDB |
| `port` | nombre | Oui | Port du serveur MongoDB \(par défaut : 27017\) |
| `database` | chaîne | Oui | Nom de la base de données à laquelle se connecter |
| `username` | chaîne | Non | Nom d'utilisateur MongoDB |
| `password` | chaîne | Non | Mot de passe MongoDB |
| `authSource` | chaîne | Non | Base de données d'authentification |
| `ssl` | chaîne | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `collection` | chaîne | Oui | Nom de la collection à mettre à jour |
| `filter` | chaîne | Oui | Critères de filtrage au format JSON |
| `update` | chaîne | Oui | Opérations de mise à jour au format JSON |
| `upsert` | booléen | Non | Créer le document s'il n'existe pas |
| `multi` | booléen | Non | Mettre à jour plusieurs documents |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `matchedCount` | nombre | Nombre de documents correspondant au filtre |
| `modifiedCount` | nombre | Nombre de documents modifiés |
| `documentCount` | nombre | Nombre total de documents affectés |
| `insertedId` | chaîne | ID du document inséré \(si upsert\) |

### `mongodb_delete`

Supprimer des documents d'une collection MongoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur MongoDB |
| `port` | nombre | Oui | Port du serveur MongoDB \(par défaut : 27017\) |
| `database` | chaîne | Oui | Nom de la base de données à laquelle se connecter |
| `username` | chaîne | Non | Nom d'utilisateur MongoDB |
| `password` | chaîne | Non | Mot de passe MongoDB |
| `authSource` | chaîne | Non | Base de données d'authentification |
| `ssl` | chaîne | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `collection` | chaîne | Oui | Nom de la collection de laquelle supprimer |
| `filter` | chaîne | Oui | Critères de filtrage au format JSON |
| `multi` | booléen | Non | Supprimer plusieurs documents |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `deletedCount` | nombre | Nombre de documents supprimés |
| `documentCount` | nombre | Nombre total de documents affectés |

### `mongodb_execute`

Exécuter un pipeline d'agrégation MongoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur MongoDB |
| `port` | nombre | Oui | Port du serveur MongoDB \(par défaut : 27017\) |
| `database` | chaîne | Oui | Nom de la base de données à laquelle se connecter |
| `username` | chaîne | Non | Nom d'utilisateur MongoDB |
| `password` | chaîne | Non | Mot de passe MongoDB |
| `authSource` | chaîne | Non | Base de données d'authentification |
| `ssl` | chaîne | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `collection` | chaîne | Oui | Nom de la collection sur laquelle exécuter le pipeline |
| `pipeline` | chaîne | Oui | Pipeline d'agrégation au format JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `documents` | tableau | Tableau de documents retournés par l'agrégation |
| `documentCount` | nombre | Nombre de documents retournés |

## Notes

- Catégorie : `tools`
- Type : `mongodb`
```

--------------------------------------------------------------------------------

---[FILE: mysql.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/mysql.mdx

```text
---
title: MySQL
description: Se connecter à une base de données MySQL
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mysql"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
L'outil [MySQL](https://www.mysql.com/) vous permet de vous connecter à n'importe quelle base de données MySQL et d'effectuer un large éventail d'opérations directement dans vos workflows d'agents. Avec une gestion sécurisée des connexions et une configuration flexible, vous pouvez facilement gérer et interagir avec vos données.

Avec l'outil MySQL, vous pouvez :

- **Interroger des données** : exécuter des requêtes SELECT pour récupérer des données de vos tables MySQL en utilisant l'opération `mysql_query`.
- **Insérer des enregistrements** : ajouter de nouvelles lignes à vos tables avec l'opération `mysql_insert` en spécifiant la table et les données à insérer.
- **Mettre à jour des enregistrements** : modifier des données existantes dans vos tables en utilisant l'opération `mysql_update`, en fournissant la table, les nouvelles données et les conditions WHERE.
- **Supprimer des enregistrements** : retirer des lignes de vos tables avec l'opération `mysql_delete`, en spécifiant la table et les conditions WHERE.
- **Exécuter du SQL brut** : lancer n'importe quelle commande SQL personnalisée en utilisant l'opération `mysql_execute` pour des cas d'utilisation avancés.

L'outil MySQL est idéal pour les scénarios où vos agents doivent interagir avec des données structurées—comme l'automatisation des rapports, la synchronisation des données entre systèmes ou l'alimentation de flux de travail basés sur les données. Il simplifie l'accès aux bases de données, facilitant la lecture, l'écriture et la gestion de vos données MySQL par programmation.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez MySQL dans le flux de travail. Peut interroger, insérer, mettre à jour, supprimer et exécuter du SQL brut.

## Outils

### `mysql_query`

Exécuter une requête SELECT sur une base de données MySQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur MySQL |
| `port` | number | Oui | Port du serveur MySQL \(par défaut : 3306\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `query` | string | Oui | Requête SQL SELECT à exécuter |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes retournées par la requête |
| `rowCount` | number | Nombre de lignes retournées |

### `mysql_insert`

Insérer un nouvel enregistrement dans une base de données MySQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur MySQL |
| `port` | number | Oui | Port du serveur MySQL \(par défaut : 3306\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `table` | string | Oui | Nom de la table dans laquelle insérer |
| `data` | object | Oui | Données à insérer sous forme de paires clé-valeur |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes insérées |
| `rowCount` | number | Nombre de lignes insérées |

### `mysql_update`

Mettre à jour des enregistrements existants dans une base de données MySQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur MySQL |
| `port` | number | Oui | Port du serveur MySQL \(par défaut : 3306\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `table` | string | Oui | Nom de la table à mettre à jour |
| `data` | object | Oui | Données à mettre à jour sous forme de paires clé-valeur |
| `where` | string | Oui | Condition de la clause WHERE \(sans le mot-clé WHERE\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes mises à jour |
| `rowCount` | number | Nombre de lignes mises à jour |

### `mysql_delete`

Supprimer des enregistrements d'une base de données MySQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur MySQL |
| `port` | number | Oui | Port du serveur MySQL \(par défaut : 3306\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `table` | string | Oui | Nom de la table de laquelle supprimer |
| `where` | string | Oui | Condition de la clause WHERE \(sans le mot-clé WHERE\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes supprimées |
| `rowCount` | number | Nombre de lignes supprimées |

### `mysql_execute`

Exécuter une requête SQL brute sur une base de données MySQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur MySQL |
| `port` | number | Oui | Port du serveur MySQL \(par défaut : 3306\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `query` | string | Oui | Requête SQL brute à exécuter |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes retournées par la requête |
| `rowCount` | number | Nombre de lignes affectées |

## Notes

- Catégorie : `tools`
- Type : `mysql`
```

--------------------------------------------------------------------------------

````
