---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 174
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 174 of 933)

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

---[FILE: polymarket.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/polymarket.mdx

```text
---
title: Polymarket
description: Accédez aux données des marchés prédictifs de Polymarket
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="polymarket"
  color="#4C82FB"
/>

{/* MANUAL-CONTENT-START:intro */}
[Polymarket](https://polymarket.com) est une plateforme décentralisée de marchés prédictifs où les utilisateurs peuvent négocier sur l'issue d'événements futurs en utilisant la technologie blockchain. Polymarket fournit une API complète, permettant aux développeurs et aux agents d'accéder aux données de marché en direct, aux listes d'événements, aux informations de prix et aux statistiques du carnet d'ordres pour alimenter des flux de travail basés sur les données et des automatisations d'IA.

Avec l'API de Polymarket et l'intégration Sim, vous pouvez permettre aux agents de récupérer programmatiquement des informations sur les marchés prédictifs, d'explorer les marchés ouverts et les événements associés, d'analyser les données historiques de prix, et d'accéder aux carnets d'ordres et aux points médians du marché. Cela crée de nouvelles possibilités pour la recherche, l'analyse automatisée et le développement d'agents intelligents qui réagissent aux probabilités d'événements en temps réel dérivées des prix du marché.

Les fonctionnalités clés de l'intégration Polymarket comprennent :

- **Liste et filtrage des marchés :** listez tous les marchés prédictifs actuels ou historiques, filtrez par tag, triez et naviguez à travers les résultats.
- **Détail du marché :** récupérez les détails d'un marché spécifique par ID ou slug, y compris ses résultats et son statut.
- **Listes d'événements :** accédez aux listes d'événements Polymarket et aux informations détaillées sur les événements.
- **Carnet d'ordres et données de prix :** analysez le carnet d'ordres, obtenez les derniers prix du marché, consultez le point médian ou obtenez des informations historiques sur les prix pour n'importe quel marché.
- **Prêt pour l'automatisation :** créez des agents ou des outils qui réagissent de manière programmatique aux développements du marché, aux changements de cotes ou aux résultats d'événements spécifiques.

En utilisant ces points de terminaison API documentés, vous pouvez intégrer de manière transparente les riches données des marchés prédictifs on-chain de Polymarket dans vos propres flux de travail d'IA, tableaux de bord, outils de recherche et automatisations de trading.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez les marchés prédictifs de Polymarket dans le flux de travail. Peut obtenir les marchés, le marché, les événements, l'événement, les tags, les séries, le carnet d'ordres, le prix, le point médian, l'historique des prix, le dernier prix de transaction, l'écart, la taille du tick, les positions, les transactions et effectuer des recherches.

## Outils

### `polymarket_get_markets`

Récupérer une liste des marchés prédictifs de Polymarket avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `closed` | string | Non | Filtrer par statut fermé \(true/false\). Utiliser false pour les marchés actifs uniquement. |
| `order` | string | Non | Champ de tri \(ex. volumeNum, liquidityNum, startDate, endDate, createdAt\) |
| `ascending` | string | Non | Direction de tri \(true pour ascendant, false pour descendant\) |
| `tagId` | string | Non | Filtrer par ID de tag |
| `limit` | string | Non | Nombre de résultats par page \(max 50\) |
| `offset` | string | Non | Décalage de pagination \(ignorer ce nombre de résultats\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `markets` | array | Tableau d'objets de marché |

### `polymarket_get_market`

Récupérer les détails d'un marché prédictif spécifique par ID ou slug

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `marketId` | chaîne | Non | L'ID du marché. Obligatoire si le slug n'est pas fourni. |
| `slug` | chaîne | Non | Le slug du marché \(ex. "will-trump-win"\). Obligatoire si marketId n'est pas fourni. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `market` | object | Objet de marché avec détails |

### `polymarket_get_events`

Récupérer une liste d'événements de Polymarket avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `closed` | string | Non | Filtrer par statut fermé \(true/false\). Utiliser false pour les événements actifs uniquement. |
| `order` | string | Non | Champ de tri \(ex. volume, liquidity, startDate, endDate, createdAt\) |
| `ascending` | string | Non | Direction de tri \(true pour ascendant, false pour descendant\) |
| `tagId` | string | Non | Filtrer par ID de tag |
| `limit` | string | Non | Nombre de résultats par page \(max 50\) |
| `offset` | string | Non | Décalage de pagination \(ignorer ce nombre de résultats\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `events` | array | Tableau d'objets d'événements |

### `polymarket_get_event`

Récupérer les détails d'un événement spécifique par ID ou slug

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `eventId` | string | Non | L'ID de l'événement. Obligatoire si le slug n'est pas fourni. |
| `slug` | string | Non | Le slug de l'événement \(ex. : "2024-presidential-election"\). Obligatoire si eventId n'est pas fourni. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `event` | object | Objet d'événement avec détails |

### `polymarket_get_tags`

Récupérer les tags disponibles pour filtrer les marchés sur Polymarket

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `limit` | string | Non | Nombre de résultats par page \(max 50\) |
| `offset` | string | Non | Décalage de pagination \(ignorer ce nombre de résultats\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tags` | array | Tableau d'objets de tags avec id, label et slug |

### `polymarket_search`

Rechercher des marchés, des événements et des profils sur Polymarket

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | string | Oui | Terme de recherche |
| `limit` | string | Non | Nombre de résultats par page \(max 50\) |
| `offset` | string | Non | Décalage de pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | object | Résultats de recherche contenant des tableaux de marchés, d'événements et de profils |

### `polymarket_get_series`

Récupérer des séries (groupes de marchés liés) depuis Polymarket

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `limit` | string | Non | Nombre de résultats par page \(max 50\) |
| `offset` | string | Non | Décalage de pagination \(ignorer ce nombre de résultats\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données des séries et métadonnées |

### `polymarket_get_series_by_id`

Récupérer une série spécifique (groupe de marché associé) par ID depuis Polymarket

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `seriesId` | string | Oui | L'ID de la série |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données de série et métadonnées |

### `polymarket_get_orderbook`

Récupérer le résumé du carnet d'ordres pour un jeton spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (provenant des clobTokenIds du marché) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du carnet d'ordres et métadonnées |

### `polymarket_get_price`

Récupérer le prix du marché pour un jeton et un côté spécifiques

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (provenant des clobTokenIds du marché) |
| `side` | string | Oui | Côté de l'ordre : achat ou vente |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données de prix du marché et métadonnées |

### `polymarket_get_midpoint`

Récupérer le prix médian pour un jeton spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (depuis market clobTokenIds) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données de prix médian et métadonnées |

### `polymarket_get_price_history`

Récupérer les données historiques de prix pour un jeton de marché spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (depuis market clobTokenIds) |
| `interval` | string | Non | Durée se terminant au moment actuel (1m, 1h, 6h, 1d, 1w, max). Mutuellement exclusif avec startTs/endTs. |
| `fidelity` | number | Non | Résolution des données en minutes (par ex., 60 pour horaire) |
| `startTs` | number | Non | Horodatage de début (secondes Unix UTC) |
| `endTs` | number | Non | Horodatage de fin (secondes Unix UTC) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données d'historique des prix et métadonnées |

### `polymarket_get_last_trade_price`

Récupérer le dernier prix de transaction pour un jeton spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (depuis market clobTokenIds) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du dernier prix d'échange et métadonnées |

### `polymarket_get_spread`

Récupérer l'écart entre l'offre et la demande pour un jeton spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (depuis market clobTokenIds) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données d'écart achat-vente et métadonnées |

### `polymarket_get_tick_size`

Récupérer la taille minimale du tick pour un jeton spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Oui | L'ID du jeton CLOB (depuis market clobTokenIds) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données de taille minimale de tick et métadonnées |

### `polymarket_get_positions`

Récupérer les positions de l'utilisateur depuis Polymarket

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `user` | string | Oui | Adresse du portefeuille de l'utilisateur |
| `market` | string | Non | ID de marché optionnel pour filtrer les positions |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données des positions et métadonnées |

### `polymarket_get_trades`

Récupérer l'historique des transactions depuis Polymarket

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `user` | string | Non | Adresse du portefeuille de l'utilisateur pour filtrer les transactions |
| `market` | string | Non | ID de marché pour filtrer les transactions |
| `limit` | string | Non | Nombre de résultats par page \(max 50\) |
| `offset` | string | Non | Décalage de pagination \(ignorer ce nombre de résultats\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `trades` | array | Tableau d'objets de transactions |

## Notes

- Catégorie : `tools`
- Type : `polymarket`
```

--------------------------------------------------------------------------------

---[FILE: postgresql.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/postgresql.mdx

```text
---
title: PostgreSQL
description: Connexion à la base de données PostgreSQL
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="postgresql"
  color="#336791"
/>

{/* MANUAL-CONTENT-START:intro */}
L'outil [PostgreSQL](https://www.postgresql.org/) vous permet de vous connecter à n'importe quelle base de données PostgreSQL et d'effectuer un large éventail d'opérations directement au sein de vos workflows d'agents. Avec une gestion sécurisée des connexions et une configuration flexible, vous pouvez facilement gérer et interagir avec vos données.

Avec l'outil PostgreSQL, vous pouvez :

- **Interroger des données** : exécuter des requêtes SELECT pour récupérer des données de vos tables PostgreSQL en utilisant l'opération `postgresql_query`.
- **Insérer des enregistrements** : ajouter de nouvelles lignes à vos tables avec l'opération `postgresql_insert` en spécifiant la table et les données à insérer.
- **Mettre à jour des enregistrements** : modifier des données existantes dans vos tables en utilisant l'opération `postgresql_update`, en fournissant la table, les nouvelles données et les conditions WHERE.
- **Supprimer des enregistrements** : retirer des lignes de vos tables avec l'opération `postgresql_delete`, en spécifiant la table et les conditions WHERE.
- **Exécuter du SQL brut** : lancer n'importe quelle commande SQL personnalisée en utilisant l'opération `postgresql_execute` pour des cas d'utilisation avancés.

L'outil PostgreSQL est idéal pour les scénarios où vos agents doivent interagir avec des données structurées — comme l'automatisation de rapports, la synchronisation de données entre systèmes ou l'alimentation de workflows basés sur les données. Il simplifie l'accès aux bases de données, facilitant la lecture, l'écriture et la gestion de vos données PostgreSQL de manière programmatique.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer PostgreSQL dans le flux de travail. Peut interroger, insérer, mettre à jour, supprimer et exécuter du SQL brut.

## Outils

### `postgresql_query`

Exécuter une requête SELECT sur une base de données PostgreSQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur PostgreSQL |
| `port` | number | Oui | Port du serveur PostgreSQL \(par défaut : 5432\) |
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

### `postgresql_insert`

Insérer des données dans une base de données PostgreSQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur PostgreSQL |
| `port` | number | Oui | Port du serveur PostgreSQL \(par défaut : 5432\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `table` | string | Oui | Nom de la table dans laquelle insérer les données |
| `data` | object | Oui | Objet de données à insérer \(paires clé-valeur\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Données insérées \(si la clause RETURNING est utilisée\) |
| `rowCount` | number | Nombre de lignes insérées |

### `postgresql_update`

Mettre à jour des données dans une base de données PostgreSQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur PostgreSQL |
| `port` | number | Oui | Port du serveur PostgreSQL \(par défaut : 5432\) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL \(disabled, required, preferred\) |
| `table` | string | Oui | Nom de la table dans laquelle mettre à jour les données |
| `data` | object | Oui | Objet de données avec les champs à mettre à jour \(paires clé-valeur\) |
| `where` | string | Oui | Condition de la clause WHERE \(sans le mot-clé WHERE\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Données mises à jour (si la clause RETURNING est utilisée) |
| `rowCount` | number | Nombre de lignes mises à jour |

### `postgresql_delete`

Supprimer des données de la base de données PostgreSQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur PostgreSQL |
| `port` | number | Oui | Port du serveur PostgreSQL (par défaut : 5432) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL (disabled, required, preferred) |
| `table` | string | Oui | Nom de la table d'où supprimer les données |
| `where` | string | Oui | Condition de la clause WHERE (sans le mot-clé WHERE) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Données supprimées (si la clause RETURNING est utilisée) |
| `rowCount` | number | Nombre de lignes supprimées |

### `postgresql_execute`

Exécuter une requête SQL brute sur une base de données PostgreSQL

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur PostgreSQL |
| `port` | number | Oui | Port du serveur PostgreSQL (par défaut : 5432) |
| `database` | string | Oui | Nom de la base de données à laquelle se connecter |
| `username` | string | Oui | Nom d'utilisateur de la base de données |
| `password` | string | Oui | Mot de passe de la base de données |
| `ssl` | string | Non | Mode de connexion SSL (disabled, required, preferred) |
| `query` | string | Oui | Requête SQL brute à exécuter |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `rows` | array | Tableau des lignes retournées par la requête |
| `rowCount` | number | Nombre de lignes affectées |

## Notes

- Catégorie : `tools`
- Type : `postgresql`
```

--------------------------------------------------------------------------------

````
