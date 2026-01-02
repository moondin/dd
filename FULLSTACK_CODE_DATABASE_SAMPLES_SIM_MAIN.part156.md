---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 156
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 156 of 933)

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

---[FILE: dropbox.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/dropbox.mdx

```text
---
title: Dropbox
description: Téléchargez, téléchargez, partagez et gérez des fichiers dans Dropbox
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dropbox"
  color="#0061FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Dropbox](https://dropbox.com/) est une plateforme populaire de stockage cloud et de collaboration qui permet aux individus et aux équipes de stocker, d'accéder et de partager des fichiers en toute sécurité depuis n'importe où. Dropbox est conçu pour une gestion de fichiers facile, la synchronisation et une collaboration puissante, que vous travailliez seul ou en groupe.

Avec Dropbox dans Sim, vous pouvez :

- **Télécharger et télécharger des fichiers** : téléchargez facilement n'importe quel fichier vers votre Dropbox ou récupérez du contenu à la demande
- **Lister le contenu des dossiers** : parcourez les fichiers et dossiers dans n'importe quel répertoire Dropbox
- **Créer de nouveaux dossiers** : organisez vos fichiers en créant programmatiquement de nouveaux dossiers dans votre Dropbox
- **Rechercher des fichiers et dossiers** : localisez des documents, des images ou d'autres éléments par nom ou contenu
- **Générer des liens partagés** : créez rapidement des liens publics ou privés partageables pour des fichiers et dossiers
- **Gérer des fichiers** : déplacez, supprimez ou renommez des fichiers et dossiers dans le cadre de flux de travail automatisés

Ces capacités permettent à vos agents Sim d'automatiser les opérations Dropbox directement dans vos flux de travail — de la sauvegarde de fichiers importants à la distribution de contenu et à la maintenance de dossiers organisés. Utilisez Dropbox comme source et destination pour les fichiers, permettant une gestion transparente du stockage cloud dans le cadre de vos processus d'entreprise.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Dropbox dans votre flux de travail pour la gestion de fichiers, le partage et la collaboration. Téléchargez des fichiers, téléchargez du contenu, créez des dossiers, gérez des liens partagés, et plus encore.

## Outils

### `dropbox_upload`

Télécharger un fichier vers Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Oui | Le chemin dans Dropbox où le fichier doit être enregistré \(ex. : /dossier/document.pdf\) |
| `fileContent` | string | Oui | Le contenu encodé en base64 du fichier à télécharger |
| `fileName` | string | Non | Nom de fichier optionnel \(utilisé si le chemin est un dossier\) |
| `mode` | string | Non | Mode d'écriture : add \(par défaut\) ou overwrite |
| `autorename` | boolean | Non | Si vrai, renomme le fichier en cas de conflit |
| `mute` | boolean | Non | Si vrai, ne notifie pas l'utilisateur de ce téléchargement |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | objet | Les métadonnées du fichier téléversé |

### `dropbox_download`

Télécharger un fichier depuis Dropbox et obtenir un lien temporaire

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `path` | chaîne | Oui | Le chemin du fichier à télécharger \(ex. : /dossier/document.pdf\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | objet | Les métadonnées du fichier |

### `dropbox_list_folder`

Lister le contenu d'un dossier dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `path` | chaîne | Oui | Le chemin du dossier à lister \(utilisez "" pour la racine\) |
| `recursive` | booléen | Non | Si vrai, liste le contenu de façon récursive |
| `includeDeleted` | booléen | Non | Si vrai, inclut les fichiers/dossiers supprimés |
| `includeMediaInfo` | booléen | Non | Si vrai, inclut les informations média pour les photos/vidéos |
| `limit` | nombre | Non | Nombre maximum de résultats à retourner \(par défaut : 500\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `entries` | tableau | Liste des fichiers et dossiers dans le répertoire |

### `dropbox_create_folder`

Créer un nouveau dossier dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `path` | chaîne | Oui | Le chemin où le dossier doit être créé \(ex. : /nouveau-dossier\) |
| `autorename` | booléen | Non | Si vrai, renomme le dossier s'il y a un conflit |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `folder` | objet | Les métadonnées du dossier créé |

### `dropbox_delete`

Supprimer un fichier ou un dossier dans Dropbox (déplace vers la corbeille)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `path` | chaîne | Oui | Le chemin du fichier ou du dossier à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | objet | Métadonnées de l'élément supprimé |

### `dropbox_copy`

Copier un fichier ou un dossier dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `fromPath` | chaîne | Oui | Le chemin source du fichier ou du dossier à copier |
| `toPath` | chaîne | Oui | Le chemin de destination pour le fichier ou dossier copié |
| `autorename` | booléen | Non | Si vrai, renomme le fichier en cas de conflit à destination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | objet | Métadonnées de l'élément copié |

### `dropbox_move`

Déplacer ou renommer un fichier ou un dossier dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `fromPath` | chaîne | Oui | Le chemin source du fichier ou du dossier à déplacer |
| `toPath` | chaîne | Oui | Le chemin de destination pour le fichier ou dossier déplacé |
| `autorename` | booléen | Non | Si vrai, renomme le fichier en cas de conflit à destination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | objet | Métadonnées de l'élément déplacé |

### `dropbox_get_metadata`

Obtenir les métadonnées d'un fichier ou d'un dossier dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `path` | chaîne | Oui | Le chemin du fichier ou du dossier dont on souhaite obtenir les métadonnées |
| `includeMediaInfo` | booléen | Non | Si vrai, inclure les informations média pour les photos/vidéos |
| `includeDeleted` | booléen | Non | Si vrai, inclure les fichiers supprimés dans les résultats |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | objet | Métadonnées du fichier ou du dossier |

### `dropbox_create_shared_link`

Créer un lien partageable pour un fichier ou un dossier dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `path` | chaîne | Oui | Le chemin du fichier ou du dossier à partager |
| `requestedVisibility` | chaîne | Non | Visibilité : public, team_only, ou password |
| `linkPassword` | chaîne | Non | Mot de passe pour le lien partagé \(uniquement si la visibilité est password\) |
| `expires` | chaîne | Non | Date d'expiration au format ISO 8601 \(ex., 2025-12-31T23:59:59Z\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `sharedLink` | objet | Le lien partagé créé |

### `dropbox_search`

Rechercher des fichiers et dossiers dans Dropbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Oui | La requête de recherche |
| `path` | string | Non | Limiter la recherche à un chemin de dossier spécifique |
| `fileExtensions` | string | Non | Liste d'extensions de fichiers séparées par des virgules pour filtrer \(ex. pdf,xlsx\) |
| `maxResults` | number | Non | Nombre maximum de résultats à retourner \(par défaut : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `matches` | array | Résultats de recherche |

## Notes

- Catégorie : `tools`
- Type : `dropbox`
```

--------------------------------------------------------------------------------

---[FILE: duckduckgo.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/duckduckgo.mdx

```text
---
title: DuckDuckGo
description: Recherchez avec DuckDuckGo
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="duckduckgo"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DuckDuckGo](https://duckduckgo.com/) est un moteur de recherche web axé sur la confidentialité qui fournit des réponses instantanées, des résumés, des sujets connexes et plus encore — sans vous suivre ni suivre vos recherches. DuckDuckGo facilite la recherche d'informations sans profilage d'utilisateur ni publicités ciblées.

Avec DuckDuckGo dans Sim, vous pouvez :

- **Rechercher sur le web** : trouvez instantanément des réponses, des faits et des aperçus pour une requête de recherche donnée
- **Obtenir des réponses directes** : recevez des réponses spécifiques pour des calculs, des conversions ou des requêtes factuelles
- **Accéder à des résumés** : recevez de courts résumés ou descriptions pour vos sujets de recherche
- **Récupérer des sujets connexes** : découvrez des liens et références pertinents pour votre recherche
- **Filtrer les résultats** : supprimez éventuellement le HTML ou ignorez la désambiguïsation pour des résultats plus propres

Ces fonctionnalités permettent à vos agents Sim d'automatiser l'accès à des connaissances web récentes — de la présentation de faits dans un flux de travail à l'enrichissement de documents et d'analyses avec des informations à jour. Comme l'API Instant Answers de DuckDuckGo est ouverte et ne nécessite pas de clé API, elle s'intègre facilement et en toute sécurité dans vos processus d'entreprise automatisés.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Recherchez sur le web en utilisant l'API Instant Answers de DuckDuckGo. Renvoie des réponses instantanées, des résumés, des sujets connexes et plus encore. Gratuit à utiliser sans clé API.

## Outils

### `duckduckgo_search`

Recherchez sur le web en utilisant l'API Instant Answers de DuckDuckGo. Renvoie des réponses instantanées, des résumés et des sujets connexes pour votre requête. Gratuit à utiliser sans clé API.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Oui | La requête de recherche à exécuter |
| `noHtml` | boolean | Non | Supprimer le HTML du texte dans les résultats \(par défaut : true\) |
| `skipDisambig` | boolean | Non | Ignorer les résultats de désambiguïsation \(par défaut : false\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `heading` | string | Le titre/en-tête de la réponse instantanée |
| `abstract` | string | Un court résumé du sujet |
| `abstractText` | string | Version en texte brut du résumé |
| `abstractSource` | string | La source du résumé \(par exemple, Wikipédia\) |
| `abstractURL` | string | URL vers la source du résumé |
| `image` | string | URL vers une image liée au sujet |
| `answer` | string | Réponse directe si disponible \(par exemple, pour les calculs\) |
| `answerType` | string | Type de réponse \(par exemple, calc, ip, etc.\) |
| `type` | string | Type de réponse : A \(article\), D \(désambiguïsation\), C \(catégorie\), N \(nom\), E \(exclusif\) |
| `relatedTopics` | array | Tableau des sujets connexes avec URLs et descriptions |

## Notes

- Catégorie : `tools`
- Type : `duckduckgo`
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/dynamodb.mdx

```text
---
title: Amazon DynamoDB
description: Connexion à Amazon DynamoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dynamodb"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) est un service de base de données NoSQL entièrement géré proposé par AWS qui offre des performances rapides et prévisibles avec une évolutivité transparente. DynamoDB vous permet de stocker et de récupérer n'importe quelle quantité de données et gère n'importe quel niveau de trafic de requêtes, sans que vous ayez à gérer le matériel ou l'infrastructure.

Avec DynamoDB, vous pouvez :

- **Obtenir des éléments** : rechercher des éléments dans vos tables à l'aide de clés primaires
- **Mettre des éléments** : ajouter ou remplacer des éléments dans vos tables
- **Interroger des éléments** : récupérer plusieurs éléments à l'aide de requêtes sur les index
- **Scanner des tables** : lire tout ou partie des données d'une table
- **Mettre à jour des éléments** : modifier des attributs spécifiques d'éléments existants
- **Supprimer des éléments** : supprimer des enregistrements de vos tables

Dans Sim, l'intégration DynamoDB permet à vos agents d'accéder en toute sécurité aux tables DynamoDB et de les manipuler à l'aide des identifiants AWS. Les opérations prises en charge comprennent :

- **Get** : récupérer un élément par sa clé
- **Put** : insérer ou écraser des éléments
- **Query** : exécuter des requêtes à l'aide de conditions de clé et de filtres
- **Scan** : lire plusieurs éléments en scannant la table ou l'index
- **Update** : modifier des attributs spécifiques d'un ou plusieurs éléments
- **Delete** : supprimer un élément d'une table

Cette intégration permet aux agents Sim d'automatiser les tâches de gestion de données au sein de vos tables DynamoDB de manière programmatique, afin que vous puissiez créer des flux de travail qui gèrent, modifient et récupèrent des données NoSQL évolutives sans effort manuel ni gestion de serveur.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Amazon DynamoDB dans les flux de travail. Prend en charge les opérations Get, Put, Query, Scan, Update et Delete sur les tables DynamoDB.

## Outils

### `dynamodb_get`

Récupérer un élément d'une table DynamoDB par clé primaire

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `tableName` | chaîne | Oui | Nom de la table DynamoDB |
| `key` | objet | Oui | Clé primaire de l'élément à récupérer |
| `consistentRead` | booléen | Non | Utiliser une lecture fortement cohérente |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `item` | objet | Élément récupéré |

### `dynamodb_put`

Mettre un élément dans une table DynamoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `tableName` | chaîne | Oui | Nom de la table DynamoDB |
| `item` | objet | Oui | Élément à mettre dans la table |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `item` | objet | Élément créé |

### `dynamodb_query`

Interroger les éléments d'une table DynamoDB à l'aide de conditions de clé

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `tableName` | chaîne | Oui | Nom de la table DynamoDB |
| `keyConditionExpression` | chaîne | Oui | Expression de condition de clé (par ex., "pk = :pk") |
| `filterExpression` | chaîne | Non | Expression de filtre pour les résultats |
| `expressionAttributeNames` | objet | Non | Mappages de noms d'attributs pour les mots réservés |
| `expressionAttributeValues` | objet | Non | Valeurs d'attributs d'expression |
| `indexName` | chaîne | Non | Nom de l'index secondaire à interroger |
| `limit` | nombre | Non | Nombre maximum d'éléments à retourner |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `items` | tableau | Tableau des éléments retournés |
| `count` | nombre | Nombre d'éléments retournés |

### `dynamodb_scan`

Scanner tous les éléments d'une table DynamoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `tableName` | chaîne | Oui | Nom de la table DynamoDB |
| `filterExpression` | chaîne | Non | Expression de filtre pour les résultats |
| `projectionExpression` | chaîne | Non | Attributs à récupérer |
| `expressionAttributeNames` | objet | Non | Mappages de noms d'attributs pour les mots réservés |
| `expressionAttributeValues` | objet | Non | Valeurs d'attributs d'expression |
| `limit` | nombre | Non | Nombre maximum d'éléments à retourner |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `items` | array | Tableau des éléments retournés |
| `count` | number | Nombre d'éléments retournés |

### `dynamodb_update`

Mettre à jour un élément dans une table DynamoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | string | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | string | Oui | Clé d'accès secrète AWS |
| `tableName` | string | Oui | Nom de la table DynamoDB |
| `key` | object | Oui | Clé primaire de l'élément à mettre à jour |
| `updateExpression` | string | Oui | Expression de mise à jour (par ex., "SET #name = :name") |
| `expressionAttributeNames` | object | Non | Mappages de noms d'attributs pour les mots réservés |
| `expressionAttributeValues` | object | Non | Valeurs d'attributs d'expression |
| `conditionExpression` | string | Non | Condition qui doit être remplie pour que la mise à jour réussisse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `item` | object | Élément mis à jour |

### `dynamodb_delete`

Supprimer un élément d'une table DynamoDB

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | string | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | string | Oui | Clé d'accès secrète AWS |
| `tableName` | string | Oui | Nom de la table DynamoDB |
| `key` | object | Oui | Clé primaire de l'élément à supprimer |
| `conditionExpression` | string | Non | Condition qui doit être remplie pour que la suppression réussisse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |

## Notes

- Catégorie : `tools`
- Type : `dynamodb`
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/elasticsearch.mdx

```text
---
title: Elasticsearch
description: Recherchez, indexez et gérez des données dans Elasticsearch
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elasticsearch"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Elasticsearch](https://www.elastic.co/elasticsearch/) est un puissant moteur de recherche et d'analyse distribué qui vous permet d'indexer, de rechercher et d'analyser de grands volumes de données en temps réel. Il est largement utilisé pour alimenter les fonctionnalités de recherche, l'analyse des données de journaux et d'événements, l'observabilité, et plus encore.

Avec Elasticsearch dans Sim, vous bénéficiez d'un accès programmatique aux capacités essentielles d'Elasticsearch, notamment :

- **Recherche de documents** : effectuez des recherches avancées sur du texte structuré ou non structuré à l'aide du langage DSL, avec prise en charge du tri, de la pagination et de la sélection de champs.
- **Indexation de documents** : ajoutez de nouveaux documents ou mettez à jour des documents existants dans n'importe quel index Elasticsearch pour une récupération et une analyse immédiates.
- **Obtenir, mettre à jour ou supprimer des documents** : récupérez, modifiez ou supprimez des documents spécifiques par ID.
- **Opérations en masse** : exécutez plusieurs actions d'indexation ou de mise à jour en une seule requête pour un traitement de données à haut débit.
- **Gestion des index** : créez, supprimez ou obtenez des détails sur les index dans le cadre de votre automatisation de flux de travail.
- **Surveillance du cluster** : vérifiez l'état et les statistiques de votre déploiement Elasticsearch.

Les outils Elasticsearch de Sim fonctionnent aussi bien avec des environnements auto-hébergés qu'avec Elastic Cloud. Intégrez Elasticsearch dans vos flux de travail d'agents pour automatiser l'ingestion de données, effectuer des recherches dans de vastes ensembles de données, exécuter des rapports ou créer des applications personnalisées basées sur la recherche - le tout sans intervention manuelle.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Elasticsearch dans les flux de travail pour une recherche puissante, l'indexation et la gestion des données. Prend en charge les opérations CRUD de documents, les requêtes de recherche avancées, les opérations en masse, la gestion des index et la surveillance des clusters. Fonctionne avec les déploiements auto-hébergés et Elastic Cloud.

## Outils

### `elasticsearch_search`

Recherchez des documents dans Elasticsearch en utilisant Query DSL. Renvoie les documents correspondants avec scores et métadonnées.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `deploymentType` | chaîne | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | chaîne | Non | URL de l'hôte Elasticsearch (pour self-hosted) |
| `cloudId` | chaîne | Non | ID Elastic Cloud (pour les déploiements cloud) |
| `authMethod` | chaîne | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | chaîne | Non | Clé API Elasticsearch |
| `username` | chaîne | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | chaîne | Non | Mot de passe pour l'authentification basique |
| `index` | chaîne | Oui | Nom de l'index à rechercher |
| `query` | chaîne | Non | Query DSL sous forme de chaîne JSON |
| `from` | nombre | Non | Décalage initial pour la pagination (par défaut : 0) |
| `size` | nombre | Non | Nombre de résultats à renvoyer (par défaut : 10) |
| `sort` | chaîne | Non | Spécification de tri sous forme de chaîne JSON |
| `sourceIncludes` | chaîne | Non | Liste de champs séparés par des virgules à inclure dans _source |
| `sourceExcludes` | chaîne | Non | Liste de champs séparés par des virgules à exclure de _source |
| `trackTotalHits` | booléen | Non | Suivre le nombre exact de résultats (par défaut : true) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `took` | nombre | Temps en millisecondes pris par la recherche |
| `timed_out` | booléen | Si la recherche a expiré |
| `hits` | objet | Résultats de recherche avec nombre total et documents correspondants |
| `aggregations` | json | Résultats d'agrégation, le cas échéant |

### `elasticsearch_index_document`

Indexer (créer ou mettre à jour) un document dans Elasticsearch.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | chaîne | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | chaîne | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | chaîne | Non | ID Cloud Elastic \(pour les déploiements cloud\) |
| `authMethod` | chaîne | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | chaîne | Non | Clé API Elasticsearch |
| `username` | chaîne | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | chaîne | Non | Mot de passe pour l'authentification basique |
| `index` | chaîne | Oui | Nom de l'index cible |
| `documentId` | chaîne | Non | ID du document \(généré automatiquement si non fourni\) |
| `document` | chaîne | Oui | Corps du document au format JSON |
| `refresh` | chaîne | Non | Politique de rafraîchissement : true, false ou wait_for |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `_index` | chaîne | Index où le document a été stocké |
| `_id` | chaîne | ID du document |
| `_version` | nombre | Version du document |
| `result` | chaîne | Résultat de l'opération \(créé ou mis à jour\) |

### `elasticsearch_get_document`

Récupérer un document par ID depuis Elasticsearch.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | chaîne | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | chaîne | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | chaîne | Non | ID Cloud Elastic \(pour les déploiements cloud\) |
| `authMethod` | chaîne | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | chaîne | Non | Clé API Elasticsearch |
| `username` | chaîne | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | chaîne | Non | Mot de passe pour l'authentification basique |
| `index` | chaîne | Oui | Nom de l'index |
| `documentId` | chaîne | Oui | ID du document à récupérer |
| `sourceIncludes` | chaîne | Non | Liste de champs à inclure, séparés par des virgules |
| `sourceExcludes` | chaîne | Non | Liste de champs à exclure, séparés par des virgules |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Nom de l'index |
| `_id` | string | ID du document |
| `_version` | number | Version du document |
| `found` | boolean | Si le document a été trouvé |
| `_source` | json | Contenu du document |

### `elasticsearch_update_document`

Mettre à jour partiellement un document dans Elasticsearch en utilisant la fusion de documents.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Oui | Nom de l'index |
| `documentId` | string | Oui | ID du document à mettre à jour |
| `document` | string | Oui | Document partiel à fusionner sous forme de chaîne JSON |
| `retryOnConflict` | number | Non | Nombre de tentatives en cas de conflit de version |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Nom de l'index |
| `_id` | string | ID du document |
| `_version` | number | Nouvelle version du document |
| `result` | string | Résultat de l'opération \(updated ou noop\) |

### `elasticsearch_delete_document`

Supprimer un document d'Elasticsearch par ID.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Oui | Nom de l'index |
| `documentId` | string | Oui | ID du document à supprimer |
| `refresh` | string | Non | Politique de rafraîchissement : true, false, ou wait_for |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Nom de l'index |
| `_id` | string | ID du document |
| `_version` | number | Version du document |
| `result` | string | Résultat de l'opération \(deleted ou not_found\) |

### `elasticsearch_bulk`

Effectuer plusieurs opérations d'indexation, de création, de suppression ou de mise à jour en une seule requête pour une performance élevée.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Non | Index par défaut pour les opérations qui n'en spécifient pas |
| `operations` | string | Oui | Opérations en masse sous forme de chaîne NDJSON \(JSON délimité par des sauts de ligne\) |
| `refresh` | string | Non | Politique de rafraîchissement : true, false, ou wait_for |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `took` | number | Temps en millisecondes pris par l'opération en masse |
| `errors` | boolean | Indique si une opération a rencontré une erreur |
| `items` | array | Résultats pour chaque opération |

### `elasticsearch_count`

Compter les documents correspondant à une requête dans Elasticsearch.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Oui | Nom de l'index dans lequel compter les documents |
| `query` | string | Non | Requête optionnelle pour filtrer les documents \(chaîne JSON\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `count` | number | Nombre de documents correspondant à la requête |
| `_shards` | object | Statistiques des partitions |

### `elasticsearch_create_index`

Créer un nouvel index avec des paramètres et des mappages optionnels.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Oui | Nom de l'index à créer |
| `settings` | string | Non | Paramètres de l'index sous forme de chaîne JSON |
| `mappings` | string | Non | Mappages de l'index sous forme de chaîne JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Indique si la requête a été confirmée |
| `shards_acknowledged` | boolean | Indique si les shards ont été confirmés |
| `index` | string | Nom de l'index créé |

### `elasticsearch_delete_index`

Supprimer un index et tous ses documents. Cette opération est irréversible.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Oui | Nom de l'index à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Indique si la suppression a été confirmée |

### `elasticsearch_get_index`

Récupérer les informations d'un index, y compris les paramètres, les mappings et les alias.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `index` | string | Oui | Nom de l'index dont on souhaite récupérer les informations |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `index` | json | Informations d'index incluant les alias, les mappages et les paramètres |

### `elasticsearch_cluster_health`

Obtenir l'état de santé du cluster Elasticsearch.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | string | Non | URL de l'hôte Elasticsearch \(pour self-hosted\) |
| `cloudId` | string | Non | ID Elastic Cloud \(pour les déploiements cloud\) |
| `authMethod` | string | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | string | Non | Clé API Elasticsearch |
| `username` | string | Non | Nom d'utilisateur pour l'authentification basique |
| `password` | string | Non | Mot de passe pour l'authentification basique |
| `waitForStatus` | string | Non | Attendre jusqu'à ce que le cluster atteigne ce statut : green, yellow ou red |
| `timeout` | string | Non | Délai d'attente pour l'opération d'attente \(ex. 30s, 1m\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `cluster_name` | string | Nom du cluster |
| `status` | string | État de santé du cluster : green, yellow ou red |
| `number_of_nodes` | number | Nombre total de nœuds dans le cluster |
| `number_of_data_nodes` | number | Nombre de nœuds de données |
| `active_shards` | number | Nombre de shards actifs |
| `unassigned_shards` | number | Nombre de shards non assignés |

### `elasticsearch_cluster_stats`

Obtenez des statistiques complètes sur le cluster Elasticsearch.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `deploymentType` | chaîne | Oui | Type de déploiement : self_hosted ou cloud |
| `host` | chaîne | Non | URL de l'hôte Elasticsearch (pour self-hosted) |
| `cloudId` | chaîne | Non | ID Elastic Cloud (pour les déploiements cloud) |
| `authMethod` | chaîne | Oui | Méthode d'authentification : api_key ou basic_auth |
| `apiKey` | chaîne | Non | Clé API Elasticsearch |
| `username` | chaîne | Non | Nom d'utilisateur pour l'authentification de base |
| `password` | chaîne | Non | Mot de passe pour l'authentification de base |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `cluster_name` | chaîne | Nom du cluster |
| `status` | chaîne | État de santé du cluster |
| `nodes` | objet | Statistiques des nœuds incluant le nombre et les versions |
| `indices` | objet | Statistiques des index incluant le nombre de documents et la taille de stockage |

## Notes

- Catégorie : `tools`
- Type : `elasticsearch`
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/elevenlabs.mdx

```text
---
title: ElevenLabs
description: Convertir TTS avec ElevenLabs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elevenlabs"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[ElevenLabs](https://elevenlabs.io/) est une plateforme de synthèse vocale à la pointe de la technologie qui crée des voix IA incroyablement naturelles et expressives. Elle offre certaines des voix synthétiques les plus réalistes et émotionnellement nuancées disponibles aujourd'hui, ce qui la rend idéale pour créer du contenu audio réaliste.

Avec ElevenLabs, vous pouvez :

- **Générer une parole naturelle** : créer un audio presque indiscernable de la parole humaine
- **Choisir parmi diverses options de voix** : accéder à une bibliothèque de voix préconçues avec différents accents, tons et caractéristiques
- **Cloner des voix** : créer des voix personnalisées basées sur des échantillons audio (avec les autorisations appropriées)
- **Contrôler les paramètres de parole** : ajuster la stabilité, la clarté et le ton émotionnel pour affiner le résultat
- **Ajouter des émotions réalistes** : incorporer des émotions naturelles comme la joie, la tristesse ou l'excitation

Dans Sim, l'intégration d'ElevenLabs permet à vos agents de convertir du texte en parole réaliste, améliorant l'interactivité et l'engagement de vos applications. C'est particulièrement précieux pour créer des assistants vocaux, générer du contenu audio, développer des applications accessibles ou construire des interfaces conversationnelles qui semblent plus humaines. L'intégration vous permet d'incorporer facilement les capacités avancées de synthèse vocale d'ElevenLabs dans vos flux de travail d'agents, comblant ainsi le fossé entre l'IA textuelle et la communication humaine naturelle.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer ElevenLabs dans le flux de travail. Peut convertir le texte en parole. Nécessite une clé API.

## Outils

### `elevenlabs_tts`

Convertir TTS en utilisant les voix d'ElevenLabs

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Oui | Le texte à convertir en parole |
| `voiceId` | string | Oui | L'ID de la voix à utiliser |
| `modelId` | string | Non | L'ID du modèle à utiliser \(par défaut eleven_monolingual_v1\) |
| `apiKey` | string | Oui | Votre clé API ElevenLabs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | L'URL de l'audio généré |
| `audioFile` | file | Le fichier audio généré |

## Notes

- Catégorie : `tools`
- Type : `elevenlabs`
```

--------------------------------------------------------------------------------

````
