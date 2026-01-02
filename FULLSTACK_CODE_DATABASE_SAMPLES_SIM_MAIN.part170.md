---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 170
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 170 of 933)

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

---[FILE: mailgun.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/mailgun.mdx

```text
---
title: Mailgun
description: Envoyez des e-mails et gérez des listes de diffusion avec Mailgun
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailgun"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailgun](https://www.mailgun.com) est un service puissant d'envoi d'e-mails conçu pour les développeurs et les entreprises afin d'envoyer, recevoir et suivre des e-mails sans effort. Mailgun vous permet d'exploiter des API robustes pour des e-mails transactionnels et marketing fiables, une gestion flexible des listes de diffusion et un suivi avancé des événements.

Avec l'ensemble complet de fonctionnalités de Mailgun, vous pouvez automatiser les opérations clés liées aux e-mails et surveiller étroitement la délivrabilité et l'engagement des destinataires. Cela en fait une solution idéale pour l'automatisation des flux de travail où les communications, les notifications et les campagnes d'e-mails sont des éléments essentiels de vos processus.

Les fonctionnalités clés de Mailgun comprennent :

- **Envoi d'e-mails transactionnels :** Livrez des e-mails à haut volume tels que des notifications de compte, des reçus, des alertes et des réinitialisations de mot de passe.
- **Contenu d'e-mail enrichi :** Envoyez des e-mails en texte brut et en HTML, et utilisez des balises pour catégoriser et suivre vos messages.
- **Gestion des listes de diffusion :** Créez, mettez à jour et gérez des listes de diffusion et des membres pour envoyer efficacement des communications groupées.
- **Informations sur les domaines :** Récupérez des détails sur vos domaines d'envoi pour surveiller la configuration et la santé.
- **Suivi des événements :** Analysez la délivrabilité des e-mails et l'engagement avec des données détaillées sur les messages envoyés.
- **Récupération des messages :** Accédez aux messages stockés pour des besoins de conformité, d'analyse ou de dépannage.

En intégrant Mailgun à Sim, vos agents sont habilités à envoyer des e-mails par programmation, gérer des listes d'e-mails, accéder aux informations de domaine et surveiller les événements en temps réel dans le cadre de flux de travail automatisés. Cela permet un engagement intelligent et basé sur les données avec vos utilisateurs directement à partir de vos processus alimentés par l'IA.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Mailgun dans votre flux de travail. Envoyez des e-mails transactionnels, gérez des listes de diffusion et leurs membres, consultez les informations de domaine et suivez les événements liés aux e-mails. Prend en charge les e-mails texte et HTML, les balises pour le suivi et une gestion complète des listes.

## Outils

### `mailgun_send_message`

Envoyer un e-mail en utilisant l'API Mailgun

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Mailgun |
| `domain` | chaîne | Oui | Domaine Mailgun \(ex. : mg.example.com\) |
| `from` | chaîne | Oui | Adresse e-mail de l'expéditeur |
| `to` | chaîne | Oui | Adresse e-mail du destinataire \(séparées par des virgules pour plusieurs\) |
| `subject` | chaîne | Oui | Objet de l'e-mail |
| `text` | chaîne | Non | Corps de l'e-mail en texte brut |
| `html` | chaîne | Non | Corps de l'e-mail en HTML |
| `cc` | chaîne | Non | Adresse e-mail en CC \(séparées par des virgules pour plusieurs\) |
| `bcc` | chaîne | Non | Adresse e-mail en BCC \(séparées par des virgules pour plusieurs\) |
| `tags` | chaîne | Non | Tags pour l'e-mail \(séparés par des virgules\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le message a été envoyé avec succès |
| `id` | chaîne | ID du message |
| `message` | chaîne | Message de réponse de Mailgun |

### `mailgun_get_message`

Récupérer un message stocké par sa clé

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Mailgun |
| `domain` | chaîne | Oui | Domaine Mailgun |
| `messageKey` | chaîne | Oui | Clé de stockage du message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la requête a réussi |
| `recipients` | string | Destinataires du message |
| `from` | string | Email de l'expéditeur |
| `subject` | string | Objet du message |
| `bodyPlain` | string | Corps du texte brut |
| `strippedText` | string | Texte épuré |
| `strippedSignature` | string | Signature épurée |
| `bodyHtml` | string | Corps HTML |
| `strippedHtml` | string | HTML épuré |
| `attachmentCount` | number | Nombre de pièces jointes |
| `timestamp` | number | Horodatage du message |
| `messageHeaders` | json | En-têtes du message |
| `contentIdMap` | json | Carte des ID de contenu |

### `mailgun_list_messages`

Liste des événements (journaux) pour les messages envoyés via Mailgun

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Clé API Mailgun |
| `domain` | string | Oui | Domaine Mailgun |
| `event` | string | Non | Filtrer par type d'événement \(accepted, delivered, failed, opened, clicked, etc.\) |
| `limit` | number | Non | Nombre maximum d'événements à retourner \(par défaut : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la requête a réussi |
| `items` | json | Tableau d'éléments d'événements |
| `paging` | json | Informations de pagination |

### `mailgun_create_mailing_list`

Créer une nouvelle liste de diffusion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Mailgun |
| `address` | chaîne | Oui | Adresse de la liste de diffusion \(ex., liste@exemple.com\) |
| `name` | chaîne | Non | Nom de la liste de diffusion |
| `description` | chaîne | Non | Description de la liste de diffusion |
| `accessLevel` | chaîne | Non | Niveau d'accès : readonly, members, ou everyone |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la liste a été créée avec succès |
| `message` | chaîne | Message de réponse |
| `list` | json | Détails de la liste de diffusion créée |

### `mailgun_get_mailing_list`

Obtenir les détails d'une liste de diffusion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Mailgun |
| `address` | chaîne | Oui | Adresse de la liste de diffusion |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la requête a réussi |
| `list` | json | Détails de la liste de diffusion |

### `mailgun_add_list_member`

Ajouter un membre à une liste de diffusion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Clé API Mailgun |
| `listAddress` | chaîne | Oui | Adresse de la liste de diffusion |
| `address` | chaîne | Oui | Adresse e-mail du membre |
| `name` | chaîne | Non | Nom du membre |
| `vars` | chaîne | Non | Chaîne JSON des variables personnalisées |
| `subscribed` | booléen | Non | Indique si le membre est abonné |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si le membre a été ajouté avec succès |
| `message` | string | Message de réponse |
| `member` | json | Détails du membre ajouté |

### `mailgun_list_domains`

Lister tous les domaines de votre compte Mailgun

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API Mailgun |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la requête a réussi |
| `totalCount` | number | Nombre total de domaines |
| `items` | json | Tableau d'objets de domaine |

### `mailgun_get_domain`

Obtenir les détails d'un domaine spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Clé API Mailgun |
| `domain` | string | Oui | Nom de domaine |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la requête a réussi |
| `domain` | json | Détails du domaine |

## Notes

- Catégorie : `tools`
- Type : `mailgun`
```

--------------------------------------------------------------------------------

---[FILE: mcp.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/mcp.mdx

```text
---
title: Outil MCP
description: Exécuter des outils depuis les serveurs du Protocole de Contexte de
  Modèle (MCP)
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mcp"
  color="#181C1E"
/>

## Instructions d'utilisation

Intégrez MCP dans le flux de travail. Peut exécuter des outils depuis les serveurs MCP. Nécessite des serveurs MCP dans les paramètres de l'espace de travail.

## Remarques

- Catégorie : `tools`
- Type : `mcp`
```

--------------------------------------------------------------------------------

---[FILE: mem0.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/mem0.mdx

```text
---
title: Mem0
description: Gestion de la mémoire des agents
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mem0"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mem0](https://mem0.ai) est un puissant système de gestion de mémoire conçu spécifiquement pour les agents IA. Il fournit un stockage de mémoire persistant et consultable qui permet aux agents de se souvenir des interactions passées, d'apprendre de leurs expériences et de maintenir le contexte à travers les conversations et les exécutions de flux de travail.

Avec Mem0, vous pouvez :

- **Stocker les mémoires des agents** : Sauvegarder l'historique des conversations, les préférences des utilisateurs et les contextes importants
- **Récupérer les informations pertinentes** : Utiliser la recherche sémantique pour trouver les interactions passées les plus pertinentes
- **Créer des agents conscients du contexte** : Permettre à vos agents de faire référence aux conversations passées et de maintenir la continuité
- **Personnaliser les interactions** : Adapter les réponses en fonction de l'historique et des préférences de l'utilisateur
- **Implémenter une mémoire à long terme** : Créer des agents qui apprennent et s'adaptent au fil du temps
- **Mettre à l'échelle la gestion de la mémoire** : Gérer les besoins en mémoire pour plusieurs utilisateurs et des flux de travail complexes

Dans Sim, l'intégration de Mem0 permet à vos agents de maintenir une mémoire persistante à travers les exécutions de flux de travail. Cela permet des interactions plus naturelles et contextuelles où les agents peuvent se rappeler des conversations passées, mémoriser les préférences des utilisateurs et s'appuyer sur les interactions précédentes. En connectant Sim avec Mem0, vous pouvez créer des agents qui semblent plus humains dans leur capacité à se souvenir et à apprendre des expériences passées. L'intégration prend en charge l'ajout de nouvelles mémoires, la recherche sémantique dans les mémoires existantes et la récupération d'enregistrements de mémoire spécifiques. Cette capacité de gestion de la mémoire est essentielle pour construire des agents sophistiqués qui peuvent maintenir le contexte au fil du temps, personnaliser les interactions en fonction de l'historique de l'utilisateur et améliorer continuellement leurs performances grâce aux connaissances accumulées.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Mem0 dans le flux de travail. Permet d'ajouter, rechercher et récupérer des souvenirs. Nécessite une clé API.

## Outils

### `mem0_add_memories`

Ajoutez des souvenirs à Mem0 pour un stockage et une récupération persistants

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | chaîne | Oui | ID utilisateur associé au souvenir |
| `messages` | json | Oui | Tableau d'objets message avec rôle et contenu |
| `apiKey` | chaîne | Oui | Votre clé API Mem0 |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `ids` | tableau | Tableau des ID de souvenirs qui ont été créés |
| `memories` | tableau | Tableau des objets de souvenirs qui ont été créés |

### `mem0_search_memories`

Recherchez des souvenirs dans Mem0 en utilisant la recherche sémantique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | chaîne | Oui | ID utilisateur pour lequel rechercher des souvenirs |
| `query` | chaîne | Oui | Requête de recherche pour trouver des souvenirs pertinents |
| `limit` | nombre | Non | Nombre maximum de résultats à retourner |
| `apiKey` | chaîne | Oui | Votre clé API Mem0 |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `searchResults` | tableau | Tableau des résultats de recherche avec données de souvenirs, chacun contenant id, données et score |
| `ids` | tableau | Tableau des ID de souvenirs trouvés dans les résultats de recherche |

### `mem0_get_memories`

Récupérer des souvenirs de Mem0 par ID ou critères de filtrage

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `userId` | chaîne | Oui | ID utilisateur pour lequel récupérer les souvenirs |
| `memoryId` | chaîne | Non | ID spécifique du souvenir à récupérer |
| `startDate` | chaîne | Non | Date de début pour filtrer par created_at \(format : AAAA-MM-JJ\) |
| `endDate` | chaîne | Non | Date de fin pour filtrer par created_at \(format : AAAA-MM-JJ\) |
| `limit` | nombre | Non | Nombre maximum de résultats à retourner |
| `apiKey` | chaîne | Oui | Votre clé API Mem0 |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `memories` | tableau | Tableau d'objets de souvenirs récupérés |
| `ids` | tableau | Tableau des ID de souvenirs qui ont été récupérés |

## Remarques

- Catégorie : `tools`
- Type : `mem0`
```

--------------------------------------------------------------------------------

---[FILE: memory.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/memory.mdx

```text
---
title: Mémoire
description: Ajouter un stockage de mémoire
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="memory"
  color="#F64F9E"
/>

## Instructions d'utilisation

Intégrer la mémoire dans le flux de travail. Peut ajouter, obtenir une mémoire, obtenir toutes les mémoires et supprimer des mémoires.

## Outils

### `memory_add`

Ajoutez une nouvelle mémoire à la base de données ou complétez une mémoire existante avec le même ID.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `conversationId` | chaîne | Non | Identifiant de conversation (par ex., user-123, session-abc). Si une mémoire avec cet identifiant de conversation existe déjà pour ce bloc, le nouveau message y sera ajouté. |
| `id` | chaîne | Non | Paramètre hérité pour l'identifiant de conversation. Utilisez conversationId à la place. Fourni pour la rétrocompatibilité. |
| `role` | chaîne | Oui | Rôle pour la mémoire de l'agent (user, assistant, ou system) |
| `content` | chaîne | Oui | Contenu pour la mémoire de l'agent |
| `blockId` | chaîne | Non | ID de bloc optionnel. Si non fourni, utilise l'ID du bloc actuel du contexte d'exécution, ou par défaut "default". |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la mémoire a été ajoutée avec succès |
| `memories` | array | Tableau d'objets de mémoire incluant la nouvelle mémoire ou celle mise à jour |
| `error` | string | Message d'erreur si l'opération a échoué |

### `memory_get`

Récupérer la mémoire par conversationId, blockId, blockName, ou une combinaison. Renvoie toutes les mémoires correspondantes.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `conversationId` | chaîne | Non | Identifiant de conversation (par ex., user-123, session-abc). Si fourni seul, renvoie toutes les mémoires pour cette conversation à travers tous les blocs. |
| `id` | chaîne | Non | Paramètre hérité pour l'identifiant de conversation. Utilisez conversationId à la place. Fourni pour la rétrocompatibilité. |
| `blockId` | chaîne | Non | Identifiant de bloc. Si fourni seul, renvoie toutes les mémoires pour ce bloc à travers toutes les conversations. Si fourni avec conversationId, renvoie les mémoires pour cette conversation spécifique dans ce bloc. |
| `blockName` | chaîne | Non | Nom du bloc. Alternative à blockId. Si fourni seul, renvoie toutes les mémoires pour les blocs avec ce nom. Si fourni avec conversationId, renvoie les mémoires pour cette conversation dans les blocs avec ce nom. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la mémoire a été récupérée avec succès |
| `memories` | tableau | Tableau d'objets de mémoire avec les champs conversationId, blockId, blockName et data |
| `message` | chaîne | Message de succès ou d'erreur |
| `error` | chaîne | Message d'erreur si l'opération a échoué |

### `memory_get_all`

Récupérer toutes les mémoires de la base de données

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si toutes les mémoires ont été récupérées avec succès |
| `memories` | tableau | Tableau de tous les objets de mémoire avec les champs key, conversationId, blockId, blockName et data |
| `message` | chaîne | Message de succès ou d'erreur |
| `error` | chaîne | Message d'erreur si l'opération a échoué |

### `memory_delete`

Supprimer des mémoires par conversationId, blockId, blockName, ou une combinaison. Prend en charge la suppression en masse.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `conversationId` | chaîne | Non | Identifiant de conversation \(par exemple, user-123, session-abc\). Si fourni seul, supprime toutes les mémoires pour cette conversation dans tous les blocs. |
| `id` | chaîne | Non | Paramètre hérité pour l'identifiant de conversation. Utilisez conversationId à la place. Fourni pour la rétrocompatibilité. |
| `blockId` | chaîne | Non | Identifiant de bloc. Si fourni seul, supprime toutes les mémoires pour ce bloc dans toutes les conversations. Si fourni avec conversationId, supprime les mémoires pour cette conversation spécifique dans ce bloc. |
| `blockName` | chaîne | Non | Nom du bloc. Alternative à blockId. Si fourni seul, supprime toutes les mémoires pour les blocs avec ce nom. Si fourni avec conversationId, supprime les mémoires pour cette conversation dans les blocs avec ce nom. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le souvenir a été supprimé avec succès |
| `message` | chaîne | Message de succès ou d'erreur |
| `error` | chaîne | Message d'erreur si l'opération a échoué |

## Notes

- Catégorie : `blocks`
- Type : `memory`
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/fr/tools/meta.json

```json
{
  "pages": [
    "index",
    "airtable",
    "arxiv",
    "asana",
    "browser_use",
    "clay",
    "confluence",
    "discord",
    "elevenlabs",
    "exa",
    "file",
    "firecrawl",
    "github",
    "gmail",
    "google_calendar",
    "google_docs",
    "google_drive",
    "google_forms",
    "google_search",
    "google_sheets",
    "google_vault",
    "hubspot",
    "huggingface",
    "hunter",
    "image_generator",
    "jina",
    "jira",
    "knowledge",
    "linear",
    "linkup",
    "mem0",
    "memory",
    "microsoft_excel",
    "microsoft_planner",
    "microsoft_teams",
    "mistral_parse",
    "mongodb",
    "mysql",
    "notion",
    "onedrive",
    "openai",
    "outlook",
    "parallel_ai",
    "perplexity",
    "pinecone",
    "pipedrive",
    "postgresql",
    "qdrant",
    "reddit",
    "resend",
    "s3",
    "salesforce",
    "serper",
    "sharepoint",
    "slack",
    "stagehand",
    "stagehand_agent",
    "stripe",
    "supabase",
    "tavily",
    "telegram",
    "thinking",
    "translate",
    "trello",
    "twilio_sms",
    "twilio_voice",
    "typeform",
    "vision",
    "wealthbox",
    "webflow",
    "whatsapp",
    "wikipedia",
    "x",
    "youtube",
    "zep"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/microsoft_excel.mdx

```text
---
title: Microsoft Excel
description: Lire, écrire et mettre à jour des données
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_excel"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/excel) est une application de tableur puissante qui permet la gestion, l'analyse et la visualisation des données. Grâce à l'intégration de Microsoft Excel dans Sim, vous pouvez lire, écrire et manipuler programmatiquement les données de feuilles de calcul pour répondre à vos besoins d'automatisation de flux de travail.

Avec l'intégration Microsoft Excel, vous pouvez :

- **Lire les données des feuilles de calcul** : accéder aux données de plages, feuilles et cellules spécifiques
- **Écrire et mettre à jour des données** : ajouter de nouvelles données ou modifier le contenu existant des feuilles de calcul
- **Gérer des tableaux** : créer et manipuler des structures de données tabulaires
- **Gérer plusieurs feuilles** : travailler avec plusieurs feuilles de calcul dans un classeur
- **Traiter les données** : importer, exporter et transformer les données des feuilles de calcul

Dans Sim, l'intégration Microsoft Excel offre un accès transparent aux fonctionnalités des feuilles de calcul grâce à l'authentification OAuth. Vous pouvez lire des données de plages spécifiques, écrire de nouvelles informations, mettre à jour des cellules existantes et gérer divers formats de données. L'intégration prend en charge les opérations de lecture et d'écriture avec des options d'entrée et de sortie flexibles. Cela vous permet de créer des flux de travail qui peuvent gérer efficacement les données des feuilles de calcul, que vous extrayiez des informations pour analyse, mettiez à jour des enregistrements automatiquement ou mainteniez la cohérence des données dans vos applications.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Microsoft Excel dans le flux de travail. Peut lire, écrire, mettre à jour, ajouter au tableau et créer de nouvelles feuilles de calcul.

## Outils

### `microsoft_excel_read`

Lire des données d'une feuille de calcul Microsoft Excel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant de la feuille de calcul à lire |
| `range` | chaîne | Non | La plage de cellules à lire. Accepte "NomFeuille!A1:B2" pour des plages explicites ou simplement "NomFeuille" pour lire la plage utilisée de cette feuille. Si omis, lit la plage utilisée de la première feuille. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | objet | Données de plage de la feuille de calcul |

### `microsoft_excel_write`

Écrire des données dans une feuille de calcul Microsoft Excel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant de la feuille de calcul dans laquelle écrire |
| `range` | chaîne | Non | La plage de cellules dans laquelle écrire |
| `values` | tableau | Oui | Les données à écrire dans la feuille de calcul |
| `valueInputOption` | chaîne | Non | Le format des données à écrire |
| `includeValuesInResponse` | booléen | Non | Indique si les valeurs écrites doivent être incluses dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `updatedRange` | string | La plage qui a été mise à jour |
| `updatedRows` | number | Nombre de lignes qui ont été mises à jour |
| `updatedColumns` | number | Nombre de colonnes qui ont été mises à jour |
| `updatedCells` | number | Nombre de cellules qui ont été mises à jour |
| `metadata` | object | Métadonnées de la feuille de calcul |

### `microsoft_excel_table_add`

Ajouter de nouvelles lignes à un tableau Microsoft Excel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `spreadsheetId` | string | Oui | L'ID de la feuille de calcul contenant le tableau |
| `tableName` | string | Oui | Le nom du tableau auquel ajouter des lignes |
| `values` | array | Oui | Les données à ajouter au tableau \(tableau de tableaux ou tableau d'objets\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `index` | number | Index de la première ligne qui a été ajoutée |
| `values` | array | Tableau des lignes qui ont été ajoutées au tableau |
| `metadata` | object | Métadonnées de la feuille de calcul |

### `microsoft_excel_worksheet_add`

Créer une nouvelle feuille de calcul dans un classeur Microsoft Excel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant du classeur Excel dans lequel ajouter la feuille de calcul |
| `worksheetName` | chaîne | Oui | Le nom de la nouvelle feuille de calcul. Doit être unique dans le classeur et ne peut pas dépasser 31 caractères |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `worksheet` | objet | Détails de la feuille de calcul nouvellement créée |

## Remarques

- Catégorie : `tools`
- Type : `microsoft_excel`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_planner.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/microsoft_planner.mdx

```text
---
title: Microsoft Planner
description: Gérer les tâches, les plans et les compartiments dans Microsoft Planner
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_planner"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Planner](https://www.microsoft.com/en-us/microsoft-365/planner) est un outil de gestion des tâches qui aide les équipes à organiser visuellement leur travail à l'aide de tableaux, de tâches et de compartiments. Intégré à Microsoft 365, il offre un moyen simple et intuitif de gérer les projets d'équipe, d'attribuer des responsabilités et de suivre la progression.

Avec Microsoft Planner, vous pouvez :

- **Créer et gérer des tâches** : ajouter de nouvelles tâches avec des dates d'échéance, des priorités et des utilisateurs assignés
- **Organiser avec des compartiments** : regrouper les tâches par phase, statut ou catégorie pour refléter le flux de travail de votre équipe
- **Visualiser l'état du projet** : utiliser des tableaux, des graphiques et des filtres pour surveiller la charge de travail et suivre la progression
- **Rester intégré à Microsoft 365** : connecter facilement les tâches avec Teams, Outlook et d'autres outils Microsoft

Dans Sim, l'intégration de Microsoft Planner permet à vos agents de créer, lire et gérer des tâches de manière programmatique dans le cadre de leurs flux de travail. Les agents peuvent générer de nouvelles tâches basées sur les demandes entrantes, récupérer les détails des tâches pour prendre des décisions et suivre l'état d'avancement des projets — le tout sans intervention humaine. Que vous construisiez des flux de travail pour l'intégration de clients, le suivi de projets internes ou la génération de tâches de suivi, l'intégration de Microsoft Planner avec Sim offre à vos agents un moyen structuré de coordonner le travail, d'automatiser la création de tâches et de maintenir les équipes alignées.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Microsoft Planner dans le flux de travail. Gérez les tâches, les plans, les compartiments et les détails des tâches, y compris les listes de contrôle et les références.

## Outils

### `microsoft_planner_read_task`

Lire les tâches depuis Microsoft Planner - obtenir toutes les tâches de l'utilisateur ou toutes les tâches d'un plan spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | chaîne | Non | L'identifiant du plan à partir duquel obtenir les tâches \(si non fourni, récupère toutes les tâches de l'utilisateur\) |
| `taskId` | chaîne | Non | L'identifiant de la tâche à obtenir |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si les tâches ont été récupérées avec succès |
| `tasks` | tableau | Tableau d'objets de tâche avec propriétés filtrées |
| `metadata` | objet | Métadonnées incluant planId, userId et planUrl |

### `microsoft_planner_create_task`

Créer une nouvelle tâche dans Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | chaîne | Oui | L'identifiant du plan où la tâche sera créée |
| `title` | chaîne | Oui | Le titre de la tâche |
| `description` | chaîne | Non | La description de la tâche |
| `dueDateTime` | chaîne | Non | La date et l'heure d'échéance pour la tâche \(format ISO 8601\) |
| `assigneeUserId` | chaîne | Non | L'identifiant de l'utilisateur à qui attribuer la tâche |
| `bucketId` | chaîne | Non | L'identifiant du compartiment où placer la tâche |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la tâche a été créée avec succès |
| `task` | objet | L'objet de tâche créé avec toutes ses propriétés |
| `metadata` | objet | Métadonnées incluant planId, taskId et taskUrl |

### `microsoft_planner_update_task`

Mettre à jour une tâche dans Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | chaîne | Oui | L'identifiant de la tâche à mettre à jour |
| `etag` | chaîne | Oui | La valeur ETag de la tâche à mettre à jour \(en-tête If-Match\) |
| `title` | chaîne | Non | Le nouveau titre de la tâche |
| `bucketId` | chaîne | Non | L'identifiant du compartiment vers lequel déplacer la tâche |
| `dueDateTime` | chaîne | Non | La date et l'heure d'échéance pour la tâche \(format ISO 8601\) |
| `startDateTime` | chaîne | Non | La date et l'heure de début pour la tâche \(format ISO 8601\) |
| `percentComplete` | nombre | Non | Le pourcentage d'achèvement de la tâche \(0-100\) |
| `priority` | nombre | Non | La priorité de la tâche \(0-10\) |
| `assigneeUserId` | chaîne | Non | L'identifiant de l'utilisateur à qui attribuer la tâche |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la tâche a été mise à jour avec succès |
| `message` | chaîne | Message de succès lorsque la tâche est mise à jour |
| `task` | objet | L'objet de tâche mis à jour avec toutes ses propriétés |
| `taskId` | chaîne | Identifiant de la tâche mise à jour |
| `etag` | chaîne | Nouvelle valeur ETag après la mise à jour - à utiliser pour les opérations suivantes |
| `metadata` | objet | Métadonnées incluant taskId, planId et taskUrl |

### `microsoft_planner_delete_task`

Supprimer une tâche de Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | chaîne | Oui | L'identifiant de la tâche à supprimer |
| `etag` | chaîne | Oui | La valeur ETag de la tâche à supprimer \(en-tête If-Match\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la tâche a été supprimée avec succès |
| `deleted` | booléen | Confirmation de la suppression |
| `metadata` | objet | Métadonnées supplémentaires |

### `microsoft_planner_list_plans`

Liste de tous les plans partagés avec l'utilisateur actuel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si les plans ont été récupérés avec succès |
| `plans` | tableau | Tableau d'objets de plan partagés avec l'utilisateur actuel |
| `metadata` | objet | Métadonnées incluant userId et nombre |

### `microsoft_planner_read_plan`

Obtenir les détails d'un plan Microsoft Planner spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | chaîne | Oui | L'identifiant du plan à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le plan a été récupéré avec succès |
| `plan` | objet | L'objet de plan avec toutes ses propriétés |
| `metadata` | objet | Métadonnées incluant planId et planUrl |

### `microsoft_planner_list_buckets`

Lister tous les compartiments dans un plan Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | chaîne | Oui | L'identifiant du plan |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si les compartiments ont été récupérés avec succès |
| `buckets` | tableau | Tableau d'objets de compartiment |
| `metadata` | objet | Métadonnées incluant planId et nombre |

### `microsoft_planner_read_bucket`

Obtenir les détails d'un compartiment spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `bucketId` | chaîne | Oui | L'identifiant du compartiment à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le compartiment a été récupéré avec succès |
| `bucket` | objet | L'objet compartiment avec toutes ses propriétés |
| `metadata` | objet | Métadonnées incluant bucketId et planId |

### `microsoft_planner_create_bucket`

Créer un nouveau compartiment dans un plan Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | chaîne | Oui | L'identifiant du plan où le compartiment sera créé |
| `name` | chaîne | Oui | Le nom du compartiment |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le compartiment a été créé avec succès |
| `bucket` | objet | L'objet compartiment créé avec toutes ses propriétés |
| `metadata` | objet | Métadonnées incluant bucketId et planId |

### `microsoft_planner_update_bucket`

Mettre à jour un compartiment dans Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `bucketId` | chaîne | Oui | L'identifiant du compartiment à mettre à jour |
| `name` | chaîne | Non | Le nouveau nom du compartiment |
| `etag` | chaîne | Oui | La valeur ETag du compartiment à mettre à jour \(en-tête If-Match\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le compartiment a été mis à jour avec succès |
| `bucket` | objet | L'objet compartiment mis à jour avec toutes ses propriétés |
| `metadata` | objet | Métadonnées incluant bucketId et planId |

### `microsoft_planner_delete_bucket`

Supprimer un compartiment de Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `bucketId` | chaîne | Oui | L'identifiant du compartiment à supprimer |
| `etag` | chaîne | Oui | La valeur ETag du compartiment à supprimer \(en-tête If-Match\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le compartiment a été supprimé avec succès |
| `deleted` | booléen | Confirmation de la suppression |
| `metadata` | objet | Métadonnées supplémentaires |

### `microsoft_planner_get_task_details`

Obtenir des informations détaillées sur une tâche, y compris la liste de contrôle et les références

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | chaîne | Oui | L'identifiant de la tâche |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si les détails de la tâche ont été récupérés avec succès |
| `taskDetails` | objet | Les détails de la tâche incluant description, liste de contrôle et références |
| `etag` | chaîne | La valeur ETag pour ces détails de tâche - à utiliser pour les opérations de mise à jour |
| `metadata` | objet | Métadonnées incluant taskId |

### `microsoft_planner_update_task_details`

Mettre à jour les détails de la tâche, y compris la description, les éléments de la liste de contrôle et les références dans Microsoft Planner

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | chaîne | Oui | L'identifiant de la tâche |
| `etag` | chaîne | Oui | La valeur ETag des détails de la tâche à mettre à jour \(en-tête If-Match\) |
| `description` | chaîne | Non | La description de la tâche |
| `checklist` | objet | Non | Éléments de la liste de contrôle sous forme d'objet JSON |
| `references` | objet | Non | Références sous forme d'objet JSON |
| `previewType` | chaîne | Non | Type d'aperçu : automatic, noPreview, checklist, description ou reference |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si les détails de la tâche ont été mis à jour avec succès |
| `taskDetails` | objet | L'objet de détails de tâche mis à jour avec toutes ses propriétés |
| `metadata` | objet | Métadonnées incluant taskId |

## Notes

- Catégorie : `tools`
- Type : `microsoft_planner`
```

--------------------------------------------------------------------------------

````
