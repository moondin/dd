---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 176
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 176 of 933)

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

---[FILE: qdrant.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/qdrant.mdx

```text
---
title: Qdrant
description: Utilisez la base de données vectorielle Qdrant
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="qdrant"
  color="#1A223F"
/>

{/* MANUAL-CONTENT-START:intro */}
[Qdrant](https://qdrant.tech) est une base de données vectorielle open-source conçue pour le stockage, la gestion et la récupération efficaces d'embeddings vectoriels de haute dimension. Qdrant permet une recherche sémantique rapide et évolutive, ce qui en fait un choix idéal pour les applications d'IA nécessitant une recherche par similarité, des systèmes de recommandation et une récupération d'informations contextuelles.

Avec Qdrant, vous pouvez :

- **Stocker des embeddings vectoriels** : gérer et persister efficacement des vecteurs de haute dimension à grande échelle
- **Effectuer une recherche de similarité sémantique** : trouver en temps réel les vecteurs les plus similaires à un vecteur de requête
- **Filtrer et organiser les données** : utiliser un filtrage avancé pour affiner les résultats de recherche en fonction des métadonnées ou des charges utiles
- **Récupérer des points spécifiques** : extraire des vecteurs et leurs charges utiles associées par ID
- **Évoluer en toute transparence** : gérer de grandes collections et des charges de travail à haut débit

Dans Sim, l'intégration de Qdrant permet à vos agents d'interagir avec Qdrant de manière programmatique dans le cadre de leurs flux de travail. Les opérations prises en charge comprennent :

- **Upsert** : Insérer ou mettre à jour des points (vecteurs et charges utiles) dans une collection Qdrant
- **Search** : Effectuer une recherche de similarité pour trouver les vecteurs les plus similaires à un vecteur de requête donné, avec filtrage optionnel et personnalisation des résultats
- **Fetch** : Récupérer des points spécifiques d'une collection par leurs identifiants, avec options pour inclure les charges utiles et les vecteurs

Cette intégration permet à vos agents d'exploiter de puissantes capacités de recherche et de gestion vectorielles, permettant des scénarios d'automatisation avancés tels que la recherche sémantique, la recommandation et la récupération contextuelle. En connectant Sim avec Qdrant, vous pouvez créer des agents qui comprennent le contexte, récupèrent des informations pertinentes à partir de grands ensembles de données et fournissent des réponses plus intelligentes et personnalisées, le tout sans gérer une infrastructure complexe.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Qdrant dans le flux de travail. Peut insérer, rechercher et récupérer des points. Nécessite une clé API.

## Outils

### `qdrant_upsert_points`

Insérer ou mettre à jour des points dans une collection Qdrant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Oui | URL de base de Qdrant |
| `apiKey` | string | Non | Clé API Qdrant \(facultative\) |
| `collection` | string | Oui | Nom de la collection |
| `points` | array | Oui | Tableau de points à upsert |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `status` | string | Statut de l'opération d'upsert |
| `data` | object | Données de résultat de l'opération d'upsert |

### `qdrant_search_vector`

Rechercher des vecteurs similaires dans une collection Qdrant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `url` | chaîne | Oui | URL de base de Qdrant |
| `apiKey` | chaîne | Non | Clé API Qdrant \(facultative\) |
| `collection` | chaîne | Oui | Nom de la collection |
| `vector` | tableau | Oui | Vecteur à rechercher |
| `limit` | nombre | Non | Nombre de résultats à retourner |
| `filter` | objet | Non | Filtre à appliquer à la recherche |
| `search_return_data` | chaîne | Non | Données à retourner de la recherche |
| `with_payload` | booléen | Non | Inclure la charge utile dans la réponse |
| `with_vector` | booléen | Non | Inclure le vecteur dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | tableau | Résultats de recherche de vecteurs avec ID, score, charge utile et données vectorielles optionnelles |
| `status` | chaîne | Statut de l'opération de recherche |

### `qdrant_fetch_points`

Récupérer des points par ID depuis une collection Qdrant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `url` | chaîne | Oui | URL de base de Qdrant |
| `apiKey` | chaîne | Non | Clé API Qdrant \(facultative\) |
| `collection` | chaîne | Oui | Nom de la collection |
| `ids` | tableau | Oui | Tableau d'identifiants de points à récupérer |
| `fetch_return_data` | chaîne | Non | Données à retourner de la récupération |
| `with_payload` | booléen | Non | Inclure la charge utile dans la réponse |
| `with_vector` | booléen | Non | Inclure le vecteur dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | tableau | Points récupérés avec ID, charge utile et données vectorielles optionnelles |
| `status` | chaîne | Statut de l'opération de récupération |

## Notes

- Catégorie : `tools`
- Type : `qdrant`
```

--------------------------------------------------------------------------------

---[FILE: rds.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/rds.mdx

```text
---
title: Amazon RDS
description: Connexion à Amazon RDS via l'API Data
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="rds"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon RDS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) est une base de données relationnelle entièrement gérée qui démarre, s'arrête et adapte automatiquement sa capacité en fonction des besoins de votre application. Elle vous permet d'exécuter des bases de données SQL dans le cloud sans avoir à gérer des serveurs de base de données.

Avec RDS Aurora Serverless, vous pouvez :

- **Interroger des données** : exécuter des requêtes SQL flexibles sur vos tables
- **Insérer de nouveaux enregistrements** : ajouter automatiquement des données à votre base de données
- **Mettre à jour des enregistrements existants** : modifier des données dans vos tables à l'aide de filtres personnalisés
- **Supprimer des enregistrements** : éliminer les données indésirables en utilisant des critères précis
- **Exécuter du SQL brut** : lancer toute commande SQL valide prise en charge par Aurora

Dans Sim, l'intégration RDS permet à vos agents de travailler avec les bases de données Amazon Aurora Serverless de manière sécurisée et programmatique. Les opérations prises en charge comprennent :

- **Requête** : exécuter des requêtes SELECT et autres requêtes SQL pour récupérer des lignes de votre base de données
- **Insertion** : insérer de nouveaux enregistrements dans les tables avec des données structurées
- **Mise à jour** : modifier les données dans les lignes qui correspondent à vos conditions spécifiées
- **Suppression** : supprimer des enregistrements d'une table par filtres ou critères personnalisés
- **Exécution** : exécuter du SQL brut pour des scénarios avancés

Cette intégration permet à vos agents d'automatiser un large éventail d'opérations de base de données sans intervention manuelle. En connectant Sim avec Amazon RDS, vous pouvez créer des agents qui gèrent, mettent à jour et récupèrent des données relationnelles dans vos flux de travail, le tout sans avoir à gérer l'infrastructure ou les connexions de base de données.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Amazon RDS Aurora Serverless dans le flux de travail en utilisant l'API Data. Possibilité d'interroger, d'insérer, de mettre à jour, de supprimer et d'exécuter du SQL brut sans gérer les connexions à la base de données.

## Outils

### `rds_query`

Exécuter une requête SELECT sur Amazon RDS en utilisant l'API Data

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS \(ex., us-east-1\) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `resourceArn` | chaîne | Oui | ARN du cluster Aurora DB |
| `secretArn` | chaîne | Oui | ARN du secret Secrets Manager contenant les identifiants de la base de données |
| `database` | chaîne | Non | Nom de la base de données \(facultatif\) |
| `query` | chaîne | Oui | Requête SQL SELECT à exécuter |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `rows` | tableau | Tableau des lignes retournées par la requête |
| `rowCount` | nombre | Nombre de lignes retournées |

### `rds_insert`

Insérer des données dans une table Amazon RDS en utilisant l'API Data

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS \(ex., us-east-1\) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `resourceArn` | chaîne | Oui | ARN du cluster Aurora DB |
| `secretArn` | chaîne | Oui | ARN du secret Secrets Manager contenant les identifiants de la base de données |
| `database` | chaîne | Non | Nom de la base de données \(facultatif\) |
| `table` | chaîne | Oui | Nom de la table dans laquelle insérer |
| `data` | objet | Oui | Données à insérer sous forme de paires clé-valeur |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes insérées |
| `rowCount` | number | Nombre de lignes insérées |

### `rds_update`

Mettre à jour des données dans une table Amazon RDS en utilisant l'API Data

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | string | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | string | Oui | Clé d'accès secrète AWS |
| `resourceArn` | string | Oui | ARN du cluster de base de données Aurora |
| `secretArn` | string | Oui | ARN du secret Secrets Manager contenant les identifiants de la base de données |
| `database` | string | Non | Nom de la base de données (facultatif) |
| `table` | string | Oui | Nom de la table à mettre à jour |
| `data` | object | Oui | Données à mettre à jour sous forme de paires clé-valeur |
| `conditions` | object | Oui | Conditions pour la mise à jour (par ex., `{"id": 1}`) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes mises à jour |
| `rowCount` | number | Nombre de lignes mises à jour |

### `rds_delete`

Supprimer des données d'une table Amazon RDS en utilisant l'API Data

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `resourceArn` | chaîne | Oui | ARN du cluster de base de données Aurora |
| `secretArn` | chaîne | Oui | ARN du secret Secrets Manager contenant les identifiants de la base de données |
| `database` | chaîne | Non | Nom de la base de données (facultatif) |
| `table` | chaîne | Oui | Nom de la table à supprimer |
| `conditions` | objet | Oui | Conditions pour la suppression (par ex., `{"id": 1}`) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `rows` | tableau | Tableau des lignes supprimées |
| `rowCount` | nombre | Nombre de lignes supprimées |

### `rds_execute`

Exécuter du SQL brut sur Amazon RDS en utilisant l'API Data

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | chaîne | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Clé d'accès secrète AWS |
| `resourceArn` | chaîne | Oui | ARN du cluster de base de données Aurora |
| `secretArn` | chaîne | Oui | ARN du secret Secrets Manager contenant les identifiants de la base de données |
| `database` | chaîne | Non | Nom de la base de données (facultatif) |
| `query` | chaîne | Oui | Requête SQL brute à exécuter |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes retournées ou affectées |
| `rowCount` | number | Nombre de lignes affectées |

## Notes

- Catégorie : `tools`
- Type : `rds`
```

--------------------------------------------------------------------------------

---[FILE: reddit.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/reddit.mdx

```text
---
title: Reddit
description: Accéder aux données et au contenu de Reddit
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="reddit"
  color="#FF5700"
/>

{/* MANUAL-CONTENT-START:intro */}
[Reddit](https://www.reddit.com/) est une plateforme sociale où les utilisateurs partagent et discutent de contenus dans des communautés thématiques appelées subreddits.

Dans Sim, vous pouvez utiliser l'intégration Reddit pour :

- **Obtenir des publications** : récupérer des publications de n'importe quel subreddit, avec des options de tri (Hot, New, Top, Rising) et filtrer les publications Top par période (Jour, Semaine, Mois, Année, Tout temps).
- **Obtenir des commentaires** : récupérer les commentaires d'une publication spécifique, avec des options pour trier et définir le nombre de commentaires.

Ces opérations permettent à vos agents d'accéder et d'analyser le contenu Reddit dans le cadre de vos flux de travail automatisés.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Reddit dans vos flux de travail. Lisez des publications, des commentaires et recherchez du contenu. Soumettez des publications, votez, répondez, modifiez et gérez votre compte Reddit.

## Outils

### `reddit_get_posts`

Récupérer des publications d'un subreddit avec différentes options de tri

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `subreddit` | chaîne | Oui | Le nom du subreddit d'où récupérer les publications \(sans le préfixe r/\) |
| `sort` | chaîne | Non | Méthode de tri des publications : "hot", "new", "top", ou "rising" \(par défaut : "hot"\) |
| `limit` | nombre | Non | Nombre maximum de publications à retourner \(par défaut : 10, max : 100\) |
| `time` | chaîne | Non | Filtre temporel pour les publications triées par "top" : "day", "week", "month", "year", ou "all" \(par défaut : "day"\) |
| `after` | chaîne | Non | Nom complet d'un élément après lequel récupérer des éléments \(pour la pagination\) |
| `before` | chaîne | Non | Nom complet d'un élément avant lequel récupérer des éléments \(pour la pagination\) |
| `count` | nombre | Non | Nombre d'éléments déjà vus dans la liste \(utilisé pour la numérotation\) |
| `show` | chaîne | Non | Afficher les éléments qui seraient normalement filtrés \(par exemple, "all"\) |
| `sr_detail` | booléen | Non | Développer les détails du subreddit dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | chaîne | Nom du subreddit d'où les publications ont été récupérées |
| `posts` | tableau | Tableau de publications avec titre, auteur, URL, score, nombre de commentaires et métadonnées |

### `reddit_get_comments`

Récupérer les commentaires d'une publication Reddit spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `postId` | chaîne | Oui | L'ID de la publication Reddit dont récupérer les commentaires |
| `subreddit` | chaîne | Oui | Le subreddit où se trouve la publication \(sans le préfixe r/\) |
| `sort` | chaîne | Non | Méthode de tri des commentaires : "confidence", "top", "new", "controversial", "old", "random", "qa" \(par défaut : "confidence"\) |
| `limit` | nombre | Non | Nombre maximum de commentaires à retourner \(par défaut : 50, max : 100\) |
| `depth` | nombre | Non | Profondeur maximale des sous-arbres dans le fil \(contrôle les niveaux de commentaires imbriqués\) |
| `context` | nombre | Non | Nombre de commentaires parents à inclure |
| `showedits` | booléen | Non | Afficher les informations de modification pour les commentaires |
| `showmore` | booléen | Non | Inclure les éléments "charger plus de commentaires" dans la réponse |
| `showtitle` | booléen | Non | Inclure le titre de la soumission dans la réponse |
| `threaded` | booléen | Non | Retourner les commentaires au format imbriqué/hiérarchisé |
| `truncate` | nombre | Non | Entier pour tronquer la profondeur des commentaires |
| `after` | chaîne | Non | Nom complet d'un élément après lequel récupérer des éléments \(pour la pagination\) |
| `before` | chaîne | Non | Nom complet d'un élément avant lequel récupérer des éléments \(pour la pagination\) |
| `count` | nombre | Non | Nombre d'éléments déjà vus dans la liste \(utilisé pour la numérotation\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `post` | objet | Informations sur la publication incluant l'ID, le titre, l'auteur, le contenu et les métadonnées |

### `reddit_get_controversial`

Récupérer les publications controversées d'un subreddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `subreddit` | chaîne | Oui | Le nom du subreddit d'où récupérer les publications \(sans le préfixe r/\) |
| `time` | chaîne | Non | Filtre temporel pour les publications controversées : "hour", "day", "week", "month", "year", ou "all" \(par défaut : "all"\) |
| `limit` | nombre | Non | Nombre maximum de publications à retourner \(par défaut : 10, max : 100\) |
| `after` | chaîne | Non | Nom complet d'un élément pour récupérer les éléments suivants \(pour la pagination\) |
| `before` | chaîne | Non | Nom complet d'un élément pour récupérer les éléments précédents \(pour la pagination\) |
| `count` | nombre | Non | Nombre d'éléments déjà vus dans la liste \(utilisé pour la numérotation\) |
| `show` | chaîne | Non | Afficher les éléments qui seraient normalement filtrés \(par exemple, "all"\) |
| `sr_detail` | booléen | Non | Développer les détails du subreddit dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | chaîne | Nom du subreddit d'où les publications ont été récupérées |
| `posts` | tableau | Tableau de publications controversées avec titre, auteur, URL, score, nombre de commentaires et métadonnées |

### `reddit_search`

Rechercher des publications dans un subreddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `subreddit` | chaîne | Oui | Le nom du subreddit dans lequel effectuer la recherche \(sans le préfixe r/\) |
| `query` | chaîne | Oui | Texte de la requête de recherche |
| `sort` | chaîne | Non | Méthode de tri pour les résultats de recherche : "relevance", "hot", "top", "new", ou "comments" \(par défaut : "relevance"\) |
| `time` | chaîne | Non | Filtre temporel pour les résultats de recherche : "hour", "day", "week", "month", "year", ou "all" \(par défaut : "all"\) |
| `limit` | nombre | Non | Nombre maximum de publications à retourner \(par défaut : 10, max : 100\) |
| `restrict_sr` | booléen | Non | Restreindre la recherche uniquement au subreddit spécifié \(par défaut : true\) |
| `after` | chaîne | Non | Nom complet d'un élément à partir duquel récupérer les éléments suivants \(pour la pagination\) |
| `before` | chaîne | Non | Nom complet d'un élément avant lequel récupérer les éléments \(pour la pagination\) |
| `count` | nombre | Non | Nombre d'éléments déjà vus dans la liste \(utilisé pour la numérotation\) |
| `show` | chaîne | Non | Afficher les éléments qui seraient normalement filtrés \(par exemple, "all"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | chaîne | Nom du subreddit où la recherche a été effectuée |
| `posts` | tableau | Tableau des publications résultant de la recherche avec titre, auteur, URL, score, nombre de commentaires et métadonnées |

### `reddit_submit_post`

Soumettre une nouvelle publication à un subreddit (texte ou lien)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `subreddit` | chaîne | Oui | Le nom du subreddit où publier \(sans le préfixe r/\) |
| `title` | chaîne | Oui | Titre de la soumission \(max 300 caractères\) |
| `text` | chaîne | Non | Contenu textuel pour une publication personnelle \(markdown supporté\) |
| `url` | chaîne | Non | URL pour une publication de lien \(ne peut pas être utilisé avec du texte\) |
| `nsfw` | booléen | Non | Marquer la publication comme NSFW |
| `spoiler` | booléen | Non | Marquer la publication comme spoiler |
| `send_replies` | booléen | Non | Envoyer les notifications de réponse dans la boîte de réception \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la publication a été soumise avec succès |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données de la publication incluant ID, nom, URL et lien permanent |

### `reddit_vote`

Voter positivement, négativement ou annuler un vote sur une publication ou un commentaire Reddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `id` | chaîne | Oui | Nom complet de l'élément sur lequel voter \(par ex., t3_xxxxx pour une publication, t1_xxxxx pour un commentaire\) |
| `dir` | nombre | Oui | Direction du vote : 1 \(vote positif\), 0 \(annuler le vote\), ou -1 \(vote négatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le vote a réussi |
| `message` | chaîne | Message de succès ou d'erreur |

### `reddit_save`

Enregistrer une publication ou un commentaire Reddit dans vos éléments sauvegardés

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `id` | chaîne | Oui | Nom complet de l'élément à sauvegarder \(par ex., t3_xxxxx pour une publication, t1_xxxxx pour un commentaire\) |
| `category` | chaîne | Non | Catégorie sous laquelle sauvegarder \(fonctionnalité Reddit Gold\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la sauvegarde a réussi |
| `message` | chaîne | Message de succès ou d'erreur |

### `reddit_unsave`

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | chaîne | Nom du subreddit |
| `posts` | json | Données des publications |
| `post` | json | Données d'une publication unique |
| `comments` | json | Données des commentaires |

### `reddit_reply`

Ajouter une réponse en commentaire à une publication ou un commentaire Reddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `parent_id` | chaîne | Oui | Nom complet de l'élément auquel répondre \(par ex., t3_xxxxx pour une publication, t1_xxxxx pour un commentaire\) |
| `text` | chaîne | Oui | Texte du commentaire au format markdown |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la réponse a été publiée avec succès |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du commentaire incluant ID, nom, permalien et contenu |

### `reddit_edit`

Modifier le texte de votre propre publication ou commentaire Reddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `thing_id` | chaîne | Oui | Nom complet de l'élément à modifier \(ex. t3_xxxxx pour une publication, t1_xxxxx pour un commentaire\) |
| `text` | chaîne | Oui | Nouveau contenu textuel au format markdown |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la modification a réussi |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du contenu mis à jour |

### `reddit_delete`

Supprimer votre propre publication ou commentaire Reddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `id` | chaîne | Oui | Nom complet de l'élément à supprimer \(ex. t3_xxxxx pour une publication, t1_xxxxx pour un commentaire\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si la suppression a réussi |
| `message` | chaîne | Message de succès ou d'erreur |

### `reddit_subscribe`

S'abonner ou se désabonner d'un subreddit

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `subreddit` | chaîne | Oui | Le nom du subreddit \(sans le préfixe r/\) |
| `action` | chaîne | Oui | Action à effectuer : "sub" pour s'abonner ou "unsub" pour se désabonner |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si l'action d'abonnement a réussi |
| `message` | chaîne | Message de succès ou d'erreur |

## Notes

- Catégorie : `tools`
- Type : `reddit`
```

--------------------------------------------------------------------------------

---[FILE: resend.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/resend.mdx

```text
---
title: Resend
description: Envoyez des e-mails avec Resend.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="resend"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Resend](https://resend.com/) est un service d'e-mail moderne conçu pour permettre aux développeurs d'envoyer facilement des e-mails transactionnels et marketing. Il fournit une API simple et fiable ainsi qu'un tableau de bord pour gérer la livraison des e-mails, les modèles et les analyses, ce qui en fait un choix populaire pour intégrer des fonctionnalités d'e-mail dans les applications et les flux de travail.

Avec Resend, vous pouvez :

- **Envoyer des e-mails transactionnels** : livrer des réinitialisations de mot de passe, des notifications, des confirmations et plus encore avec une haute délivrabilité
- **Gérer des modèles** : créer et mettre à jour des modèles d'e-mail pour une image de marque et des messages cohérents
- **Suivre les analyses** : surveiller les taux de livraison, d'ouverture et de clic pour optimiser les performances de vos e-mails
- **Intégrer facilement** : utiliser une API simple et des SDK pour une intégration transparente avec vos applications
- **Assurer la sécurité** : bénéficier d'une authentification robuste et d'une vérification de domaine pour protéger votre réputation en matière d'e-mail

Dans Sim, l'intégration de Resend permet à vos agents d'envoyer des e-mails de manière programmatique dans le cadre de vos flux de travail automatisés. Cela permet des cas d'utilisation tels que l'envoi de notifications, d'alertes ou de messages personnalisés directement depuis vos agents alimentés par Sim. En connectant Sim à Resend, vous pouvez automatiser les tâches de communication, garantissant une livraison d'e-mails rapide et fiable sans intervention manuelle. L'intégration utilise votre clé API Resend, gardant vos identifiants sécurisés tout en permettant de puissants scénarios d'automatisation d'e-mails.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Resend dans le flux de travail. Peut envoyer des emails. Nécessite une clé API.

## Outils

### `resend_send`

Envoyer un email en utilisant votre propre clé API Resend et adresse d'expéditeur

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `fromAddress` | chaîne | Oui | Adresse email d'expédition |
| `to` | chaîne | Oui | Adresse email du destinataire |
| `subject` | chaîne | Oui | Objet de l'email |
| `body` | chaîne | Oui | Contenu du corps de l'email |
| `contentType` | chaîne | Non | Type de contenu pour le corps de l'email (texte ou html) |
| `resendApiKey` | chaîne | Oui | Clé API Resend pour l'envoi d'emails |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si l'email a été envoyé avec succès |
| `to` | chaîne | Adresse email du destinataire |
| `subject` | chaîne | Objet de l'email |
| `body` | chaîne | Contenu du corps de l'email |

## Notes

- Catégorie : `tools`
- Type : `resend`
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/s3.mdx

```text
---
title: S3
description: Téléverser, télécharger, lister et gérer les fichiers S3
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="s3"
  color="linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon S3](https://aws.amazon.com/s3/) est un service de stockage cloud hautement évolutif, sécurisé et durable fourni par Amazon Web Services. Il est conçu pour stocker et récupérer n'importe quelle quantité de données depuis n'importe où sur le web, ce qui en fait l'une des solutions de stockage cloud les plus utilisées par les entreprises de toutes tailles.

Avec Amazon S3, vous pouvez :

- **Stocker des données illimitées** : télécharger des fichiers de toute taille et de tout type avec une capacité de stockage pratiquement illimitée
- **Accéder de n'importe où** : récupérer vos fichiers depuis n'importe où dans le monde avec un accès à faible latence
- **Assurer la durabilité des données** : bénéficier d'une durabilité de 99,999999999 % (11 neuf) avec réplication automatique des données
- **Contrôler l'accès** : gérer les permissions et les contrôles d'accès avec des politiques de sécurité précises
- **Évoluer automatiquement** : gérer des charges de travail variables sans intervention manuelle ni planification de capacité
- **S'intégrer facilement** : se connecter avec d'autres services AWS et applications tierces facilement
- **Optimiser les coûts** : choisir parmi plusieurs classes de stockage pour optimiser les coûts en fonction des modèles d'accès

Dans Sim, l'intégration S3 permet à vos agents de récupérer et d'accéder aux fichiers stockés dans vos buckets Amazon S3 en utilisant des URL présignées sécurisées. Cela permet des scénarios d'automatisation puissants tels que le traitement de documents, l'analyse de données stockées, la récupération de fichiers de configuration et l'accès à du contenu multimédia dans le cadre de vos flux de travail. Vos agents peuvent récupérer des fichiers depuis S3 en toute sécurité sans exposer vos identifiants AWS, ce qui facilite l'incorporation d'actifs stockés dans le cloud dans vos processus d'automatisation. Cette intégration comble le fossé entre votre stockage cloud et vos flux de travail IA, permettant un accès transparent à vos données stockées tout en maintenant les meilleures pratiques de sécurité grâce aux mécanismes d'authentification robustes d'AWS.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez S3 dans le flux de travail. Téléversez des fichiers, téléchargez des objets, listez le contenu des buckets, supprimez des objets et copiez des objets entre buckets. Nécessite une clé d'accès AWS et une clé d'accès secrète AWS.

## Outils

### `s3_put_object`

Téléverser un fichier vers un bucket AWS S3

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Oui | Votre ID de clé d'accès AWS |
| `secretAccessKey` | string | Oui | Votre clé d'accès secrète AWS |
| `region` | string | Oui | Région AWS (ex. : us-east-1) |
| `bucketName` | string | Oui | Nom du bucket S3 |
| `objectKey` | string | Oui | Clé/chemin de l'objet dans S3 (ex. : dossier/nomfichier.ext) |
| `file` | file | Non | Fichier à téléverser |
| `content` | string | Non | Contenu textuel à téléverser (alternative au fichier) |
| `contentType` | string | Non | En-tête Content-Type (détecté automatiquement à partir du fichier si non fourni) |
| `acl` | string | Non | Liste de contrôle d'accès (ex. : private, public-read) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `url` | string | URL de l'objet S3 téléversé |
| `metadata` | object | Métadonnées de téléversement incluant ETag et emplacement |

### `s3_get_object`

Récupérer un objet depuis un bucket AWS S3

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Oui | Votre ID de clé d'accès AWS |
| `secretAccessKey` | string | Oui | Votre clé d'accès secrète AWS |
| `s3Uri` | string | Oui | URL de l'objet S3 |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `url` | chaîne | URL présignée pour télécharger l'objet S3 |
| `metadata` | objet | Métadonnées du fichier incluant le type, la taille, le nom et la date de dernière modification |

### `s3_list_objects`

Lister les objets dans un bucket AWS S3

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `accessKeyId` | chaîne | Oui | Votre ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Votre clé d'accès secrète AWS |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `bucketName` | chaîne | Oui | Nom du bucket S3 |
| `prefix` | chaîne | Non | Préfixe pour filtrer les objets (par ex., dossier/) |
| `maxKeys` | nombre | Non | Nombre maximum d'objets à retourner (par défaut : 1000) |
| `continuationToken` | chaîne | Non | Jeton pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `objects` | tableau | Liste des objets S3 |

### `s3_delete_object`

Supprimer un objet d'un bucket AWS S3

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `accessKeyId` | chaîne | Oui | Votre ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Votre clé d'accès secrète AWS |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `bucketName` | chaîne | Oui | Nom du bucket S3 |
| `objectKey` | chaîne | Oui | Clé/chemin de l'objet à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | booléen | Indique si l'objet a été supprimé avec succès |
| `metadata` | objet | Métadonnées de suppression |

### `s3_copy_object`

Copier un objet au sein d'un même bucket AWS S3 ou entre différents buckets

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `accessKeyId` | chaîne | Oui | Votre ID de clé d'accès AWS |
| `secretAccessKey` | chaîne | Oui | Votre clé d'accès secrète AWS |
| `region` | chaîne | Oui | Région AWS (par ex., us-east-1) |
| `sourceBucket` | chaîne | Oui | Nom du bucket source |
| `sourceKey` | chaîne | Oui | Clé/chemin de l'objet source |
| `destinationBucket` | chaîne | Oui | Nom du bucket de destination |
| `destinationKey` | chaîne | Oui | Clé/chemin de l'objet de destination |
| `acl` | chaîne | Non | Liste de contrôle d'accès pour l'objet copié (par ex., private, public-read) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `url` | chaîne | URL de l'objet S3 copié |
| `metadata` | objet | Métadonnées de l'opération de copie |

## Remarques

- Catégorie : `tools`
- Type : `s3`
```

--------------------------------------------------------------------------------

````
