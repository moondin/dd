---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 172
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 172 of 933)

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

---[FILE: neo4j.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/neo4j.mdx

```text
---
title: Neo4j
description: Connexion à la base de données graphe Neo4j
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="neo4j"
  color="#FFFFFF"
/>

## Instructions d'utilisation

Intégrez la base de données graphe Neo4j dans le flux de travail. Permet d'interroger, créer, fusionner, mettre à jour et supprimer des nœuds et des relations.

## Outils

### `neo4j_query`

Exécutez des requêtes MATCH pour lire les nœuds et les relations de la base de données graphe Neo4j. Pour de meilleures performances et pour éviter les grands ensembles de résultats, incluez LIMIT dans votre requête (par exemple, 

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur Neo4j |
| `port` | number | Oui | Port du serveur Neo4j \(par défaut : 7687 pour le protocole Bolt\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur Neo4j |
| `password` | string | Oui | Mot de passe Neo4j |
| `encryption` | string | Non | Mode de chiffrement de connexion \(enabled, disabled\) |
| `cypherQuery` | string | Oui | Requête Cypher à exécuter \(généralement des instructions MATCH\) |
| `parameters` | object | Non | Paramètres pour la requête Cypher sous forme d'objet JSON. À utiliser pour toutes les valeurs dynamiques, y compris LIMIT \(par exemple, query: "MATCH \(n\) RETURN n LIMIT $limit", parameters: \{limit: 100\}\). |
| `parameters` | string | Non | Pas de description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `records` | array | Tableau des enregistrements retournés par la requête |
| `recordCount` | number | Nombre d'enregistrements retournés |
| `summary` | json | Résumé de l'exécution de la requête avec timing et compteurs |

### `neo4j_create`

Exécuter des instructions CREATE pour ajouter de nouveaux nœuds et relations à la base de données graphique Neo4j

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur Neo4j |
| `port` | nombre | Oui | Port du serveur Neo4j \(par défaut : 7687 pour le protocole Bolt\) |
| `database` | chaîne | Oui | Nom de la base de données à laquelle se connecter |
| `username` | chaîne | Oui | Nom d'utilisateur Neo4j |
| `password` | chaîne | Oui | Mot de passe Neo4j |
| `encryption` | chaîne | Non | Mode de chiffrement de connexion \(enabled, disabled\) |
| `cypherQuery` | chaîne | Oui | Instruction Cypher CREATE à exécuter |
| `parameters` | objet | Non | Paramètres pour la requête Cypher sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `summary` | json | Résumé de création avec compteurs pour les nœuds et relations créés |

### `neo4j_merge`

Exécuter des instructions MERGE pour trouver ou créer des nœuds et relations dans Neo4j (opération d'upsert)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur Neo4j |
| `port` | nombre | Oui | Port du serveur Neo4j \(par défaut : 7687 pour le protocole Bolt\) |
| `database` | chaîne | Oui | Nom de la base de données à laquelle se connecter |
| `username` | chaîne | Oui | Nom d'utilisateur Neo4j |
| `password` | chaîne | Oui | Mot de passe Neo4j |
| `encryption` | chaîne | Non | Mode de chiffrement de connexion \(enabled, disabled\) |
| `cypherQuery` | chaîne | Oui | Instruction Cypher MERGE à exécuter |
| `parameters` | objet | Non | Paramètres pour la requête Cypher sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `summary` | json | Résumé de fusion avec compteurs pour les nœuds/relations créés ou correspondants |

### `neo4j_update`

Exécuter des instructions SET pour mettre à jour les propriétés des nœuds et relations existants dans Neo4j

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur Neo4j |
| `port` | number | Oui | Port du serveur Neo4j \(par défaut : 7687 pour le protocole Bolt\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur Neo4j |
| `password` | string | Oui | Mot de passe Neo4j |
| `encryption` | string | Non | Mode de chiffrement de connexion \(enabled, disabled\) |
| `cypherQuery` | string | Oui | Requête Cypher avec instructions MATCH et SET pour mettre à jour les propriétés |
| `parameters` | object | Non | Paramètres pour la requête Cypher sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `summary` | json | Résumé de mise à jour avec compteurs pour les propriétés définies |

### `neo4j_delete`

Exécuter des instructions DELETE ou DETACH DELETE pour supprimer des nœuds et des relations de Neo4j

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur Neo4j |
| `port` | number | Oui | Port du serveur Neo4j \(par défaut : 7687 pour le protocole Bolt\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur Neo4j |
| `password` | string | Oui | Mot de passe Neo4j |
| `encryption` | string | Non | Mode de chiffrement de connexion \(enabled, disabled\) |
| `cypherQuery` | string | Oui | Requête Cypher avec instructions MATCH et DELETE/DETACH DELETE |
| `parameters` | object | Non | Paramètres pour la requête Cypher sous forme d'objet JSON |
| `detach` | boolean | Non | Indique s'il faut utiliser DETACH DELETE pour supprimer les relations avant de supprimer les nœuds |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `summary` | json | Résumé de suppression avec compteurs pour les nœuds et relations supprimés |

### `neo4j_execute`

Exécuter des requêtes Cypher arbitraires sur la base de données graphique Neo4j pour des opérations complexes

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur Neo4j |
| `port` | number | Oui | Port du serveur Neo4j \(par défaut : 7687 pour le protocole Bolt\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur Neo4j |
| `password` | string | Oui | Mot de passe Neo4j |
| `encryption` | string | Non | Mode de chiffrement de connexion \(enabled, disabled\) |
| `cypherQuery` | string | Oui | Requête Cypher à exécuter \(toute instruction Cypher valide\) |
| `parameters` | object | Non | Paramètres pour la requête Cypher sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `records` | array | Tableau des enregistrements retournés par la requête |
| `recordCount` | number | Nombre d'enregistrements retournés |
| `summary` | json | Résumé d'exécution avec chronométrage et compteurs |

## Notes

- Catégorie : `tools`
- Type : `neo4j`
```

--------------------------------------------------------------------------------

---[FILE: notion.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/notion.mdx

```text
---
title: Notion
description: Gérer les pages Notion
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="notion"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Notion](https://www.notion.so) est un espace de travail tout-en-un qui combine notes, documents, wikis et outils de gestion de projet en une seule plateforme. Il offre un environnement flexible et personnalisable où les utilisateurs peuvent créer, organiser et collaborer sur du contenu dans différents formats.

Avec Notion, vous pouvez :

- **Créer du contenu polyvalent** : élaborer des documents, wikis, bases de données, tableaux kanban, calendriers et plus encore
- **Organiser l'information** : structurer le contenu de façon hiérarchique avec des pages imbriquées et des bases de données puissantes
- **Collaborer en toute fluidité** : partager des espaces de travail et des pages avec les membres de l'équipe pour une collaboration en temps réel
- **Personnaliser votre espace de travail** : concevoir votre flux de travail idéal avec des modèles flexibles et des blocs de construction
- **Connecter les informations** : créer des liens entre les pages et les bases de données pour établir un réseau de connaissances
- **Accéder partout** : utiliser Notion sur le web, l'ordinateur et les plateformes mobiles avec synchronisation automatique

Dans Sim, l'intégration de Notion permet à vos agents d'interagir directement avec votre espace de travail Notion de manière programmatique. Cela permet des scénarios d'automatisation puissants tels que la gestion des connaissances, la création de contenu et la récupération d'informations. Vos agents peuvent :

- **Lire des pages Notion** : extraire du contenu et des métadonnées de n'importe quelle page Notion.
- **Lire des bases de données Notion** : récupérer la structure et les informations des bases de données.
- **Écrire sur des pages** : ajouter du nouveau contenu aux pages Notion existantes.
- **Créer de nouvelles pages** : générer de nouvelles pages Notion sous une page parente, avec des titres et du contenu personnalisés.
- **Interroger des bases de données** : rechercher et filtrer les entrées de base de données à l'aide de critères de filtrage et de tri avancés.
- **Rechercher dans l'espace de travail** : rechercher dans l'ensemble de votre espace de travail Notion des pages ou des bases de données correspondant à des requêtes spécifiques.
- **Créer de nouvelles bases de données** : créer programmatiquement de nouvelles bases de données avec des propriétés et une structure personnalisées.

Cette intégration comble le fossé entre vos flux de travail IA et votre base de connaissances, permettant une gestion transparente de la documentation et des informations. En connectant Sim à Notion, vous pouvez automatiser les processus de documentation, maintenir des référentiels d'informations à jour, générer des rapports et organiser intelligemment les informations, le tout grâce à vos agents intelligents.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Notion dans le flux de travail. Peut lire une page, lire une base de données, créer une page, créer une base de données, ajouter du contenu, interroger une base de données et rechercher dans l'espace de travail. Nécessite OAuth.

## Outils

### `notion_read`

Lire le contenu d'une page Notion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `pageId` | chaîne | Oui | L'ID de la page Notion à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Contenu de la page au format markdown avec en-têtes, paragraphes, listes et tâches |
| `metadata` | objet | Métadonnées de la page incluant titre, URL et horodatages |

### `notion_read_database`

Lire les informations et la structure d'une base de données Notion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `databaseId` | chaîne | Oui | L'ID de la base de données Notion à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Informations de la base de données incluant titre, schéma des propriétés et métadonnées |
| `metadata` | objet | Métadonnées de la base de données incluant titre, ID, URL, horodatages et schéma des propriétés |

### `notion_write`

Ajouter du contenu à une page Notion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `pageId` | chaîne | Oui | L'ID de la page Notion à laquelle ajouter du contenu |
| `content` | chaîne | Oui | Le contenu à ajouter à la page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès confirmant que le contenu a été ajouté à la page |

### `notion_create_page`

Créer une nouvelle page dans Notion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `parentId` | chaîne | Oui | ID de la page parente |
| `title` | chaîne | Non | Titre de la nouvelle page |
| `content` | chaîne | Non | Contenu optionnel à ajouter à la page lors de sa création |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès confirmant la création de la page |
| `metadata` | objet | Métadonnées de la page incluant le titre, l'ID de la page, l'URL et les horodatages |

### `notion_query_database`

Interroger et filtrer les entrées de base de données Notion avec filtrage avancé

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `databaseId` | chaîne | Oui | L'ID de la base de données à interroger |
| `filter` | chaîne | Non | Conditions de filtrage au format JSON \(facultatif\) |
| `sorts` | chaîne | Non | Critères de tri sous forme de tableau JSON \(facultatif\) |
| `pageSize` | nombre | Non | Nombre de résultats à retourner \(par défaut : 100, max : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Liste formatée des entrées de la base de données avec leurs propriétés |
| `metadata` | objet | Métadonnées de la requête incluant le nombre total de résultats, les informations de pagination et le tableau de résultats bruts |

### `notion_search`

Rechercher dans toutes les pages et bases de données de l'espace de travail Notion

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | chaîne | Non | Termes de recherche \(laisser vide pour obtenir toutes les pages\) |
| `filterType` | chaîne | Non | Filtrer par type d'objet : page, database, ou laisser vide pour tous |
| `pageSize` | nombre | Non | Nombre de résultats à retourner \(par défaut : 100, max : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Liste formatée des résultats de recherche incluant pages et bases de données |
| `metadata` | objet | Métadonnées de recherche incluant le nombre total de résultats, les informations de pagination et le tableau des résultats bruts |

### `notion_create_database`

Créer une nouvelle base de données dans Notion avec des propriétés personnalisées

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `parentId` | chaîne | Oui | ID de la page parente où la base de données sera créée |
| `title` | chaîne | Oui | Titre pour la nouvelle base de données |
| `properties` | chaîne | Non | Propriétés de la base de données sous forme d'objet JSON \(facultatif, créera une propriété "Name" par défaut si vide\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès avec les détails de la base de données et la liste des propriétés |
| `metadata` | objet | Métadonnées de la base de données incluant l'ID, le titre, l'URL, l'heure de création et le schéma des propriétés |

## Notes

- Catégorie : `tools`
- Type : `notion`
```

--------------------------------------------------------------------------------

---[FILE: onedrive.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/onedrive.mdx

```text
---
title: OneDrive
description: Créer, téléverser, télécharger, lister et supprimer des fichiers
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="onedrive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[OneDrive](https://onedrive.live.com) est le service de stockage cloud et de synchronisation de fichiers de Microsoft qui permet aux utilisateurs de stocker, d'accéder et de partager des fichiers en toute sécurité sur différents appareils. Profondément intégré à l'écosystème Microsoft 365, OneDrive prend en charge la collaboration transparente, le contrôle de version et l'accès en temps réel au contenu pour les équipes et les organisations.

Découvrez comment intégrer l'outil OneDrive dans Sim pour extraire, gérer et organiser automatiquement vos fichiers cloud dans vos flux de travail. Ce tutoriel vous guide à travers la connexion à OneDrive, la configuration de l'accès aux fichiers et l'utilisation du contenu stocké pour alimenter l'automatisation. Idéal pour synchroniser des documents et médias essentiels avec vos agents en temps réel.

Avec OneDrive, vous pouvez :

- **Stocker des fichiers en toute sécurité dans le cloud** : télécharger et accéder à des documents, des images et d'autres fichiers depuis n'importe quel appareil
- **Organiser votre contenu** : créer des dossiers structurés et gérer facilement les versions de fichiers
- **Collaborer en temps réel** : partager des fichiers, les modifier simultanément avec d'autres et suivre les modifications
- **Accéder depuis différents appareils** : utiliser OneDrive depuis un ordinateur, un mobile ou une plateforme web
- **S'intégrer à Microsoft 365** : travailler de manière transparente avec Word, Excel, PowerPoint et Teams
- **Contrôler les autorisations** : partager des fichiers et des dossiers avec des paramètres d'accès personnalisés et des contrôles d'expiration

Dans Sim, l'intégration OneDrive permet à vos agents d'interagir directement avec votre stockage cloud. Les agents peuvent télécharger de nouveaux fichiers dans des dossiers spécifiques, récupérer et lire des fichiers existants, et lister le contenu des dossiers pour organiser et accéder dynamiquement aux informations. Cette intégration permet à vos agents d'incorporer des opérations sur fichiers dans des flux de travail intelligents — automatisant la réception de documents, l'analyse de contenu et la gestion structurée du stockage. En connectant Sim avec OneDrive, vous donnez à vos agents la possibilité de gérer et d'utiliser des documents cloud de manière programmatique, éliminant les étapes manuelles et améliorant l'automatisation grâce à un accès sécurisé aux fichiers en temps réel.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez OneDrive dans le flux de travail. Peut créer des fichiers texte et Excel, téléverser des fichiers, télécharger des fichiers, lister des fichiers et supprimer des fichiers ou dossiers.

## Outils

### `onedrive_upload`

Télécharger un fichier vers OneDrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `fileName` | string | Oui | Le nom du fichier à télécharger |
| `file` | file | Non | Le fichier à télécharger \(binaire\) |
| `content` | string | Non | Le contenu textuel à télécharger \(si aucun fichier n'est fourni\) |
| `mimeType` | string | Non | Le type MIME du fichier à créer \(par exemple, text/plain pour .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet pour .xlsx\) |
| `folderSelector` | string | Non | Sélectionner le dossier où télécharger le fichier |
| `manualFolderId` | string | Non | ID de dossier saisi manuellement \(mode avancé\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le fichier a été téléchargé avec succès |
| `file` | objet | L'objet du fichier téléchargé avec métadonnées incluant id, nom, webViewLink, webContentLink et horodatages |

### `onedrive_create_folder`

Créer un nouveau dossier dans OneDrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `folderName` | chaîne | Oui | Nom du dossier à créer |
| `folderSelector` | chaîne | Non | Sélectionnez le dossier parent où créer le dossier |
| `manualFolderId` | chaîne | Non | ID du dossier parent saisi manuellement \(mode avancé\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le dossier a été créé avec succès |
| `file` | objet | L'objet du dossier créé avec métadonnées incluant id, nom, webViewLink et horodatages |

### `onedrive_download`

Télécharger un fichier depuis OneDrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `fileId` | string | Oui | L'ID du fichier à télécharger |
| `fileName` | string | Non | Remplacement optionnel du nom de fichier |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Fichier téléchargé stocké dans les fichiers d'exécution |

### `onedrive_list`

Lister les fichiers et dossiers dans OneDrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `folderSelector` | string | Non | Sélectionner le dossier à partir duquel lister les fichiers |
| `manualFolderId` | string | Non | L'ID de dossier saisi manuellement \(mode avancé\) |
| `query` | string | Non | Une requête pour filtrer les fichiers |
| `pageSize` | number | Non | Le nombre de fichiers à retourner |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si les fichiers ont été listés avec succès |
| `files` | array | Tableau d'objets de fichiers et dossiers avec métadonnées |
| `nextPageToken` | string | Jeton pour récupérer la page suivante de résultats \(optionnel\) |

### `onedrive_delete`

Supprimer un fichier ou un dossier de OneDrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `fileId` | string | Oui | L'ID du fichier ou dossier à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le fichier a été supprimé avec succès |
| `deleted` | booléen | Confirmation que le fichier a été supprimé |
| `fileId` | string | L'ID du fichier supprimé |

## Notes

- Catégorie : `tools`
- Type : `onedrive`
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/openai.mdx

```text
---
title: Embeddings
description: Générer des embeddings Open AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="openai"
  color="#10a37f"
/>

{/* MANUAL-CONTENT-START:intro */}
[OpenAI](https://www.openai.com) est une entreprise leader dans la recherche et le déploiement d'IA qui propose une suite de modèles et d'API d'IA puissants. OpenAI fournit des technologies de pointe, notamment des modèles de langage avancés (comme GPT-4), la génération d'images (DALL-E) et des embeddings qui permettent aux développeurs de créer des applications sophistiquées alimentées par l'IA.

Avec OpenAI, vous pouvez :

- **Générer du texte** : Créer du texte semblable à celui d'un humain pour diverses applications en utilisant les modèles GPT
- **Créer des images** : Transformer des descriptions textuelles en contenu visuel avec DALL-E
- **Produire des embeddings** : Convertir du texte en vecteurs numériques pour la recherche sémantique et l'analyse
- **Construire des assistants IA** : Développer des agents conversationnels avec des connaissances spécialisées
- **Traiter et analyser des données** : Extraire des insights et des modèles à partir de texte non structuré
- **Traduire des langues** : Convertir du contenu entre différentes langues avec une grande précision
- **Résumer du contenu** : Condenser du texte long tout en préservant les informations clés

Dans Sim, l'intégration d'OpenAI permet à vos agents d'exploiter ces puissantes capacités d'IA de manière programmatique dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation sophistiqués qui combinent la compréhension du langage naturel, la génération de contenu et l'analyse sémantique. Vos agents peuvent générer des embeddings vectoriels à partir de texte, qui sont des représentations numériques capturant le sens sémantique, permettant des systèmes avancés de recherche, de classification et de recommandation. De plus, grâce à l'intégration de DALL-E, les agents peuvent créer des images à partir de descriptions textuelles, ouvrant des possibilités pour la génération de contenu visuel. Cette intégration comble le fossé entre votre automatisation de flux de travail et les capacités d'IA de pointe, permettant à vos agents de comprendre le contexte, de générer du contenu pertinent et de prendre des décisions intelligentes basées sur la compréhension sémantique. En connectant Sim avec OpenAI, vous pouvez créer des agents qui traitent l'information de manière plus intelligente, génèrent du contenu créatif et offrent des expériences plus personnalisées aux utilisateurs.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer les embeddings dans le flux de travail. Peut générer des embeddings à partir de texte. Nécessite une clé API.

## Outils

### `openai_embeddings`

Générer des embeddings à partir de texte en utilisant OpenAI

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `input` | chaîne | Oui | Texte pour générer les embeddings |
| `model` | chaîne | Non | Modèle à utiliser pour les embeddings |
| `encodingFormat` | chaîne | Non | Format de retour des embeddings |
| `apiKey` | chaîne | Oui | Clé API OpenAI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Résultats de génération des embeddings |

## Remarques

- Catégorie : `tools`
- Type : `openai`
```

--------------------------------------------------------------------------------

---[FILE: outlook.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/outlook.mdx

```text
---
title: Outlook
description: Envoyer, lire, rédiger, transférer et déplacer des messages
  électroniques Outlook
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="outlook"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Outlook](https://outlook.office365.com) est une plateforme complète de messagerie et de calendrier qui aide les utilisateurs à gérer efficacement leurs communications, emplois du temps et tâches. En tant que partie intégrante de la suite de productivité de Microsoft, Outlook offre des outils robustes pour envoyer et organiser des e-mails, coordonner des réunions et s'intégrer parfaitement aux applications Microsoft 365 — permettant aux individus et aux équipes de rester organisés et connectés sur tous leurs appareils.

Avec Microsoft Outlook, vous pouvez :

- **Envoyer et recevoir des e-mails** : communiquer clairement et professionnellement avec des individus ou des listes de diffusion  
- **Gérer les calendriers et les événements** : planifier des réunions, définir des rappels et consulter les disponibilités  
- **Organiser votre boîte de réception** : utiliser des dossiers, des catégories et des règles pour rationaliser vos e-mails  
- **Accéder aux contacts et aux tâches** : suivre les personnes clés et les éléments d'action en un seul endroit  
- **S'intégrer à Microsoft 365** : travailler de manière transparente avec Word, Excel, Teams et d'autres applications Microsoft  
- **Accéder depuis plusieurs appareils** : utiliser Outlook sur ordinateur, web et mobile avec synchronisation en temps réel  
- **Maintenir la confidentialité et la sécurité** : exploiter le chiffrement et les contrôles de conformité de niveau entreprise

Dans Sim, l'intégration Microsoft Outlook permet à vos agents d'interagir directement avec les données d'e-mail et de calendrier de manière programmatique avec des capacités complètes de gestion des e-mails. Cela permet des scénarios d'automatisation puissants dans l'ensemble de votre flux de travail de messagerie. Vos agents peuvent :

- **Envoyer et rédiger** : Composer des e-mails professionnels avec pièces jointes et enregistrer des brouillons pour plus tard
- **Lire et transférer** : Accéder aux messages de la boîte de réception et transférer des communications importantes aux membres de l'équipe
- **Organiser efficacement** : Marquer les e-mails comme lus ou non lus, déplacer des messages entre dossiers et copier des e-mails pour référence
- **Nettoyer la boîte de réception** : Supprimer les messages indésirables et maintenir des structures de dossiers organisées
- **Déclencher des flux de travail** : Réagir aux nouveaux e-mails en temps réel, permettant une automatisation réactive basée sur les messages entrants

En connectant Sim à Microsoft Outlook, vous permettez aux agents intelligents d'automatiser les communications, de rationaliser la planification, de maintenir la visibilité sur la correspondance organisationnelle et de garder les boîtes de réception organisées — le tout au sein de votre écosystème de flux de travail. Que vous gériez les communications clients, traitiez des factures, coordonniez des mises à jour d'équipe ou automatisiez des suivis, l'intégration Outlook fournit des capacités d'automatisation d'e-mail de niveau entreprise.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Outlook dans le flux de travail. Peut lire, rédiger, envoyer, transférer et déplacer des messages électroniques. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'un nouvel e-mail est reçu.

## Outils

### `outlook_send`

Envoyer des e-mails via Outlook

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `to` | string | Oui | Adresse e-mail du destinataire |
| `subject` | string | Oui | Objet de l'e-mail |
| `body` | string | Oui | Contenu du corps de l'e-mail |
| `contentType` | string | Non | Type de contenu pour le corps de l'e-mail \(texte ou html\) |
| `replyToMessageId` | string | Non | ID du message auquel répondre \(pour le fil de discussion\) |
| `conversationId` | string | Non | ID de conversation pour le fil de discussion |
| `cc` | string | Non | Destinataires en copie \(séparés par des virgules\) |
| `bcc` | string | Non | Destinataires en copie cachée \(séparés par des virgules\) |
| `attachments` | file[] | Non | Fichiers à joindre à l'e-mail |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite d'envoi de l'e-mail |
| `status` | string | Statut de livraison de l'e-mail |
| `timestamp` | string | Horodatage de l'envoi de l'e-mail |
| `message` | string | Message de réussite ou d'erreur |

### `outlook_draft`

Créer des brouillons d'e-mails avec Outlook

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `to` | string | Oui | Adresse e-mail du destinataire |
| `subject` | string | Oui | Objet de l'e-mail |
| `body` | string | Oui | Contenu du corps de l'e-mail |
| `contentType` | string | Non | Type de contenu pour le corps de l'e-mail \(texte ou html\) |
| `cc` | string | Non | Destinataires en copie \(séparés par des virgules\) |
| `bcc` | string | Non | Destinataires en copie cachée \(séparés par des virgules\) |
| `attachments` | file[] | Non | Fichiers à joindre au brouillon d'e-mail |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de création du brouillon d'e-mail |
| `messageId` | string | Identifiant unique pour le brouillon d'e-mail |
| `status` | string | Statut du brouillon d'e-mail |
| `subject` | string | Objet du brouillon d'e-mail |
| `timestamp` | string | Horodatage de création du brouillon |
| `message` | string | Message de réussite ou d'erreur |

### `outlook_read`

Lire les e-mails depuis Outlook

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `folder` | string | Non | ID du dossier à partir duquel lire les e-mails \(par défaut : Boîte de réception\) |
| `maxResults` | number | Non | Nombre maximum d'e-mails à récupérer \(par défaut : 1, max : 10\) |
| `includeAttachments` | boolean | Non | Télécharger et inclure les pièces jointes des e-mails |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de réussite ou de statut |
| `results` | array | Tableau d'objets de messages électroniques |
| `attachments` | file[] | Toutes les pièces jointes des e-mails regroupées de tous les e-mails |

### `outlook_forward`

Transférer un message Outlook existant à des destinataires spécifiés

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | L'ID du message à transférer |
| `to` | string | Oui | Adresse(s) e-mail du destinataire, séparées par des virgules |
| `comment` | string | Non | Commentaire optionnel à inclure avec le message transféré |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de réussite ou d'erreur |
| `results` | object | Détails du résultat de livraison |

### `outlook_move`

Déplacer des e-mails entre dossiers Outlook

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à déplacer |
| `destinationId` | string | Oui | ID du dossier de destination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite du déplacement de l'e-mail |
| `message` | string | Message de réussite ou d'erreur |
| `messageId` | string | ID du message déplacé |
| `newFolderId` | string | ID du dossier de destination |

### `outlook_mark_read`

Marquer un message Outlook comme lu

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à marquer comme lu |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `message` | string | Message de succès ou d'erreur |
| `messageId` | string | ID du message |
| `isRead` | boolean | Statut de lecture du message |

### `outlook_mark_unread`

Marquer un message Outlook comme non lu

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à marquer comme non lu |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `message` | string | Message de succès ou d'erreur |
| `messageId` | string | ID du message |
| `isRead` | boolean | Statut de lecture du message |

### `outlook_delete`

Supprimer un message Outlook (déplacer vers Éléments supprimés)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `message` | string | Message de succès ou d'erreur |
| `messageId` | string | ID du message supprimé |
| `status` | string | Statut de suppression |

### `outlook_copy`

Copier un message Outlook dans un autre dossier

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Oui | ID du message à copier |
| `destinationId` | string | Oui | ID du dossier de destination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de la copie de l'e-mail |
| `message` | string | Message de réussite ou d'erreur |
| `originalMessageId` | string | ID du message original |
| `copiedMessageId` | string | ID du message copié |
| `destinationFolderId` | string | ID du dossier de destination |

## Notes

- Catégorie : `tools`
- Type : `outlook`
```

--------------------------------------------------------------------------------

````
