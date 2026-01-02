---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 173
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 173 of 933)

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

---[FILE: parallel_ai.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/parallel_ai.mdx

```text
---
title: Parallel AI
description: Recherche web avec Parallel AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="parallel_ai"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Parallel AI](https://parallel.ai/) est une plateforme avancée de recherche web et d'extraction de contenu conçue pour fournir des résultats complets et de haute qualité pour n'importe quelle requête. En exploitant un traitement intelligent et une extraction de données à grande échelle, Parallel AI permet aux utilisateurs et aux agents d'accéder, d'analyser et de synthétiser des informations provenant du web avec rapidité et précision.

Avec Parallel AI, vous pouvez :

- **Rechercher intelligemment sur le web** : récupérer des informations pertinentes et à jour à partir d'un large éventail de sources  
- **Extraire et résumer du contenu** : obtenir des extraits concis et significatifs de pages web et de documents  
- **Personnaliser les objectifs de recherche** : adapter les requêtes à des besoins ou questions spécifiques pour des résultats ciblés  
- **Traiter les résultats à grande échelle** : gérer de grands volumes de résultats de recherche avec des options de traitement avancées  
- **Intégrer dans les flux de travail** : utiliser Parallel AI au sein de Sim pour automatiser la recherche, la collecte de contenu et l'extraction de connaissances  
- **Contrôler la granularité des résultats** : spécifier le nombre de résultats et la quantité de contenu par résultat  
- **Sécuriser l'accès API** : protéger vos recherches et données avec l'authentification par clé API

Dans Sim, l'intégration de Parallel AI permet à vos agents d'effectuer des recherches web et d'extraire du contenu de manière programmatique. Cela permet des scénarios d'automatisation puissants tels que la recherche en temps réel, l'analyse concurrentielle, la surveillance de contenu et la création de bases de connaissances. En connectant Sim avec Parallel AI, vous donnez à vos agents la capacité de collecter, traiter et utiliser des données web dans le cadre de vos flux de travail automatisés.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Parallel AI dans le flux de travail. Peut rechercher sur le web, extraire des informations d'URLs et mener des recherches approfondies.

## Outils

### `parallel_search`

Recherchez sur le web avec Parallel AI. Fournit des résultats de recherche complets avec un traitement intelligent et une extraction de contenu.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `objective` | chaîne | Oui | L'objectif de recherche ou la question à répondre |
| `search_queries` | chaîne | Non | Liste optionnelle de requêtes de recherche à exécuter, séparées par des virgules |
| `processor` | chaîne | Non | Méthode de traitement : base ou pro \(par défaut : base\) |
| `max_results` | nombre | Non | Nombre maximum de résultats à retourner \(par défaut : 5\) |
| `max_chars_per_result` | nombre | Non | Nombre maximum de caractères par résultat \(par défaut : 1500\) |
| `apiKey` | chaîne | Oui | Clé API Parallel AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | tableau | Résultats de recherche avec extraits des pages pertinentes |

### `parallel_extract`

Extrayez des informations ciblées à partir d'URLs spécifiques en utilisant Parallel AI. Traite les URLs fournies pour extraire du contenu pertinent selon votre objectif.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `urls` | chaîne | Oui | Liste d'URLs séparées par des virgules pour extraire des informations |
| `objective` | chaîne | Oui | Quelles informations extraire des URLs fournies |
| `excerpts` | booléen | Oui | Inclure des extraits pertinents du contenu |
| `full_content` | booléen | Oui | Inclure le contenu complet de la page |
| `apiKey` | chaîne | Oui | Clé API Parallel AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | tableau | Informations extraites des URLs fournies |

### `parallel_deep_research`

Menez des recherches approfondies complètes sur le web en utilisant Parallel AI. Synthétise les informations de multiples sources avec citations. Peut prendre jusqu'à 15 minutes pour être complété.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `input` | chaîne | Oui | Requête de recherche ou question \(jusqu'à 15 000 caractères\) |
| `processor` | chaîne | Non | Niveau de calcul : base, lite, pro, ultra, ultra2x, ultra4x, ultra8x \(par défaut : base\) |
| `include_domains` | chaîne | Non | Liste de domaines séparés par des virgules pour restreindre la recherche \(politique de source\) |
| `exclude_domains` | chaîne | Non | Liste de domaines séparés par des virgules à exclure de la recherche \(politique de source\) |
| `apiKey` | chaîne | Oui | Clé API Parallel AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `status` | string | Statut de la tâche (terminée, échouée) |
| `run_id` | string | ID unique pour cette tâche de recherche |
| `message` | string | Message de statut |
| `content` | object | Résultats de recherche (structurés selon output_schema) |
| `basis` | array | Citations et sources avec raisonnement et niveaux de confiance |

## Notes

- Catégorie : `tools`
- Type : `parallel_ai`
```

--------------------------------------------------------------------------------

---[FILE: perplexity.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/perplexity.mdx

```text
---
title: Perplexity
description: Utilisez Perplexity AI pour le chat et la recherche
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="perplexity"
  color="#20808D"
/>

{/* MANUAL-CONTENT-START:intro */}
[Perplexity AI](https://www.perplexity.ai) est un moteur de recherche et de réponse alimenté par l'IA qui combine les capacités des grands modèles de langage avec la recherche web en temps réel pour fournir des informations précises et à jour ainsi que des réponses complètes à des questions complexes.

Avec Perplexity AI, vous pouvez :

- **Obtenir des réponses précises** : recevoir des réponses complètes à vos questions avec des citations de sources fiables
- **Accéder à des informations en temps réel** : obtenir des informations à jour grâce aux capacités de recherche web de Perplexity
- **Explorer des sujets en profondeur** : approfondir des sujets avec des questions complémentaires et des informations connexes
- **Vérifier les informations** : contrôler la crédibilité des réponses grâce aux sources et références fournies
- **Générer du contenu** : créer des résumés, des analyses et du contenu créatif basés sur des informations actuelles
- **Rechercher efficacement** : simplifier les processus de recherche avec des réponses complètes à des requêtes complexes
- **Interagir de manière conversationnelle** : engager un dialogue naturel pour affiner les questions et explorer des sujets

Dans Sim, l'intégration de Perplexity permet à vos agents d'exploiter ces puissantes capacités d'IA de manière programmatique dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation sophistiqués qui combinent la compréhension du langage naturel, la récupération d'informations en temps réel et la génération de contenu. Vos agents peuvent formuler des requêtes, recevoir des réponses complètes avec citations, et intégrer ces informations dans leurs processus de décision ou leurs résultats. Cette intégration comble le fossé entre l'automatisation de votre flux de travail et l'accès à des informations actuelles et fiables, permettant à vos agents de prendre des décisions plus éclairées et de fournir des réponses plus précises. En connectant Sim avec Perplexity, vous pouvez créer des agents qui restent à jour avec les dernières informations, fournissent des réponses bien documentées et délivrent des insights plus précieux aux utilisateurs - le tout sans nécessiter de recherche manuelle ou de collecte d'informations.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Perplexity dans votre flux de travail. Peut générer des compléments en utilisant les modèles de chat Perplexity AI ou effectuer des recherches web avec filtrage avancé.

## Outils

### `perplexity_chat`

Générez des compléments à l'aide des modèles de chat Perplexity AI

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `systemPrompt` | string | Non | Instruction système pour guider le comportement du modèle |
| `content` | string | Oui | Le contenu du message utilisateur à envoyer au modèle |
| `model` | string | Oui | Modèle à utiliser pour les compléments de chat (ex. : sonar, mistral) |
| `max_tokens` | number | Non | Nombre maximum de tokens à générer |
| `temperature` | number | Non | Température d'échantillonnage entre 0 et 1 |
| `apiKey` | string | Oui | Clé API Perplexity |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Contenu de texte généré |
| `model` | string | Modèle utilisé pour la génération |
| `usage` | object | Informations sur l'utilisation des tokens |

### `perplexity_search`

Obtenez des résultats de recherche classés depuis Perplexity

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Oui | Une requête de recherche ou un tableau de requêtes \(maximum 5 pour une recherche multi-requêtes\) |
| `max_results` | number | Non | Nombre maximum de résultats de recherche à retourner \(1-20, par défaut : 10\) |
| `search_domain_filter` | array | Non | Liste des domaines/URLs pour limiter les résultats de recherche \(max 20\) |
| `max_tokens_per_page` | number | Non | Nombre maximum de tokens récupérés de chaque page web \(par défaut : 1024\) |
| `country` | string | Non | Code pays pour filtrer les résultats de recherche \(ex. : US, GB, DE\) |
| `search_recency_filter` | string | Non | Filtrer les résultats par récence : heure, jour, semaine, mois ou année |
| `search_after_date` | string | Non | Inclure uniquement le contenu publié après cette date \(format : MM/JJ/AAAA\) |
| `search_before_date` | string | Non | Inclure uniquement le contenu publié avant cette date \(format : MM/JJ/AAAA\) |
| `apiKey` | string | Oui | Clé API Perplexity |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Tableau des résultats de recherche |

## Notes

- Catégorie : `tools`
- Type : `perplexity`
```

--------------------------------------------------------------------------------

---[FILE: pinecone.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/pinecone.mdx

```text
---
title: Pinecone
description: Utilisez la base de données vectorielle Pinecone
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pinecone"
  color="#0D1117"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pinecone](https://www.pinecone.io) est une base de données vectorielle conçue pour créer des applications de recherche vectorielle haute performance. Elle permet le stockage, la gestion et la recherche par similarité de vecteurs d'embeddings de haute dimension, ce qui la rend idéale pour les applications d'IA nécessitant des capacités de recherche sémantique.

Avec Pinecone, vous pouvez :

- **Stocker des embeddings vectoriels** : Gérer efficacement des vecteurs de haute dimension à grande échelle
- **Effectuer des recherches par similarité** : Trouver les vecteurs les plus similaires à un vecteur de requête en quelques millisecondes
- **Construire une recherche sémantique** : Créer des expériences de recherche basées sur le sens plutôt que sur les mots-clés
- **Implémenter des systèmes de recommandation** : Générer des recommandations personnalisées basées sur la similarité du contenu
- **Déployer des modèles d'apprentissage automatique** : Opérationnaliser des modèles de ML qui s'appuient sur la similarité vectorielle
- **Évoluer en toute transparence** : Gérer des milliards de vecteurs avec des performances constantes
- **Maintenir des index en temps réel** : Mettre à jour votre base de données vectorielle en temps réel à mesure que de nouvelles données arrivent

Dans Sim, l'intégration de Pinecone permet à vos agents d'exploiter les capacités de recherche vectorielle de manière programmatique dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation sophistiqués qui combinent le traitement du langage naturel avec la recherche et la récupération sémantiques. Vos agents peuvent générer des embeddings à partir de texte, stocker ces vecteurs dans des index Pinecone et effectuer des recherches de similarité pour trouver les informations les plus pertinentes. Cette intégration comble le fossé entre vos flux de travail d'IA et l'infrastructure de recherche vectorielle, permettant une récupération d'informations plus intelligente basée sur le sens sémantique plutôt que sur la correspondance exacte de mots-clés. En connectant Sim avec Pinecone, vous pouvez créer des agents qui comprennent le contexte, récupèrent des informations pertinentes à partir de grands ensembles de données et fournissent des réponses plus précises et personnalisées aux utilisateurs - le tout sans nécessiter une gestion d'infrastructure complexe ou une connaissance spécialisée des bases de données vectorielles.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Pinecone dans le flux de travail. Peut générer des embeddings, insérer du texte, rechercher avec du texte, récupérer des vecteurs et rechercher avec des vecteurs. Nécessite une clé API.

## Outils

### `pinecone_generate_embeddings`

Générer des embeddings à partir de texte en utilisant Pinecone

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `model` | string | Oui | Modèle à utiliser pour générer les embeddings |
| `inputs` | array | Oui | Tableau d'entrées textuelles pour lesquelles générer des embeddings |
| `apiKey` | string | Oui | Clé API Pinecone |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | array | Données d'embeddings générées avec valeurs et type de vecteur |
| `model` | string | Modèle utilisé pour générer les embeddings |
| `vector_type` | string | Type de vecteur généré \(dense/sparse\) |
| `usage` | object | Statistiques d'utilisation pour la génération d'embeddings |

### `pinecone_upsert_text`

Insérer ou mettre à jour des enregistrements textuels dans un index Pinecone

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `indexHost` | chaîne | Oui | URL complète de l'hôte de l'index Pinecone |
| `namespace` | chaîne | Oui | Espace de noms dans lequel insérer les enregistrements |
| `records` | tableau | Oui | Enregistrement ou tableau d'enregistrements à insérer, chacun contenant _id, texte et métadonnées optionnelles |
| `apiKey` | chaîne | Oui | Clé API Pinecone |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `statusText` | chaîne | Statut de l'opération d'insertion |
| `upsertedCount` | nombre | Nombre d'enregistrements insérés avec succès |

### `pinecone_search_text`

Rechercher du texte similaire dans un index Pinecone

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `indexHost` | chaîne | Oui | URL complète de l'hôte de l'index Pinecone |
| `namespace` | chaîne | Non | Espace de noms dans lequel effectuer la recherche |
| `searchQuery` | chaîne | Oui | Texte à rechercher |
| `topK` | chaîne | Non | Nombre de résultats à retourner |
| `fields` | tableau | Non | Champs à retourner dans les résultats |
| `filter` | objet | Non | Filtre à appliquer à la recherche |
| `rerank` | objet | Non | Paramètres de reclassement |
| `apiKey` | chaîne | Oui | Clé API Pinecone |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `matches` | tableau | Résultats de recherche avec ID, score et métadonnées |

### `pinecone_search_vector`

Rechercher des vecteurs similaires dans un index Pinecone

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `indexHost` | chaîne | Oui | URL complète de l'hôte de l'index Pinecone |
| `namespace` | chaîne | Non | Espace de noms dans lequel effectuer la recherche |
| `vector` | tableau | Oui | Vecteur à rechercher |
| `topK` | nombre | Non | Nombre de résultats à retourner |
| `filter` | objet | Non | Filtre à appliquer à la recherche |
| `includeValues` | booléen | Non | Inclure les valeurs des vecteurs dans la réponse |
| `includeMetadata` | booléen | Non | Inclure les métadonnées dans la réponse |
| `apiKey` | chaîne | Oui | Clé API Pinecone |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `matches` | tableau | Résultats de recherche de vecteurs avec ID, score, valeurs et métadonnées |
| `namespace` | chaîne | Espace de noms où la recherche a été effectuée |

### `pinecone_fetch`

Récupérer des vecteurs par ID depuis un index Pinecone

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `indexHost` | chaîne | Oui | URL complète de l'hôte de l'index Pinecone |
| `ids` | tableau | Oui | Tableau d'ID de vecteurs à récupérer |
| `namespace` | chaîne | Non | Espace de noms à partir duquel récupérer les vecteurs |
| `apiKey` | chaîne | Oui | Clé API Pinecone |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `matches` | array | Vecteurs récupérés avec ID, valeurs, métadonnées et score |

## Notes

- Catégorie : `tools`
- Type : `pinecone`
```

--------------------------------------------------------------------------------

---[FILE: pipedrive.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/pipedrive.mdx

```text
---
title: Pipedrive
description: Interagissez avec le CRM Pipedrive
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pipedrive"
  color="#2E6936"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pipedrive](https://www.pipedrive.com) est une plateforme CRM puissante axée sur les ventes, conçue pour aider les équipes commerciales à gérer les prospects, suivre les affaires et optimiser leur pipeline de vente. Créé avec simplicité et efficacité à l'esprit, Pipedrive est devenu un favori parmi les professionnels de la vente et les entreprises en croissance dans le monde entier grâce à sa gestion intuitive du pipeline visuel et ses insights commerciaux exploitables.

Pipedrive fournit une suite complète d'outils pour gérer l'ensemble du processus de vente, de la capture de leads à la conclusion des affaires. Avec son API robuste et ses capacités d'intégration étendues, Pipedrive permet aux équipes commerciales d'automatiser les tâches répétitives, de maintenir la cohérence des données et de se concentrer sur ce qui compte le plus : conclure des affaires.

Les fonctionnalités clés de Pipedrive comprennent :

- Pipeline de vente visuel : interface intuitive de glisser-déposer pour gérer les affaires à travers des étapes de vente personnalisables
- Gestion des leads : boîte de réception complète pour capturer, qualifier et convertir les opportunités potentielles
- Suivi d'activité : système sophistiqué pour planifier et suivre les appels, réunions, emails et tâches
- Gestion de projet : capacités intégrées de suivi de projet pour le succès client et la livraison après-vente
- Intégration email : intégration native de boîte mail pour un suivi transparent des communications au sein du CRM

Dans Sim, l'intégration Pipedrive permet à vos agents IA d'interagir de manière transparente avec votre flux de travail commercial. Cela crée des opportunités pour la qualification automatisée des prospects, la création et la mise à jour des affaires, la planification des activités et la gestion du pipeline dans le cadre de vos processus de vente assistés par IA. L'intégration permet aux agents de créer, récupérer, mettre à jour et gérer des affaires, des prospects, des activités et des projets de manière programmatique, facilitant l'automatisation intelligente des ventes et garantissant que les informations critiques des clients sont correctement suivies et traitées. En connectant Sim à Pipedrive, vous pouvez créer des agents IA qui maintiennent la visibilité du pipeline de vente, automatisent les tâches CRM routinières, qualifient intelligemment les prospects et s'assurent qu'aucune opportunité ne passe entre les mailles du filet—améliorant ainsi la productivité de l'équipe de vente et favorisant une croissance constante des revenus.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Pipedrive dans votre flux de travail. Gérez les affaires, les contacts, le pipeline de vente, les projets, les activités, les fichiers et les communications avec de puissantes fonctionnalités CRM.

## Outils

### `pipedrive_get_all_deals`

Récupérer toutes les affaires de Pipedrive avec des filtres optionnels

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `status` | string | Non | Récupère uniquement les affaires avec un statut spécifique. Valeurs : open, won, lost. Si omis, toutes les affaires non supprimées sont retournées |
| `person_id` | string | Non | Si fourni, seules les affaires liées à la personne spécifiée sont retournées |
| `org_id` | string | Non | Si fourni, seules les affaires liées à l'organisation spécifiée sont retournées |
| `pipeline_id` | string | Non | Si fourni, seules les affaires dans le pipeline spécifié sont retournées |
| `updated_since` | string | Non | Si défini, seules les affaires mises à jour après cette date sont retournées. Format : 2025-01-01T10:20:00Z |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deals` | array | Tableau d'objets d'affaires de Pipedrive |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_deal`

Récupérer des informations détaillées sur une affaire spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `deal_id` | string | Oui | L'ID de l'affaire à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deal` | object | Objet d'affaire avec tous les détails |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_create_deal`

Créer une nouvelle affaire dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `title` | string | Oui | Le titre de l'affaire |
| `value` | string | Non | La valeur monétaire de l'affaire |
| `currency` | string | Non | Code de devise (ex., USD, EUR) |
| `person_id` | string | Non | ID de la personne associée à cette affaire |
| `org_id` | string | Non | ID de l'organisation associée à cette affaire |
| `pipeline_id` | string | Non | ID du pipeline dans lequel cette affaire doit être placée |
| `stage_id` | string | Non | ID de l'étape dans laquelle cette affaire doit être placée |
| `status` | string | Non | Statut de l'affaire : open, won, lost |
| `expected_close_date` | string | Non | Date de clôture prévue au format AAAA-MM-JJ |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deal` | object | L'objet d'affaire créé |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_update_deal`

Mettre à jour une affaire existante dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Oui | L'ID de l'affaire à mettre à jour |
| `title` | string | Non | Nouveau titre pour l'affaire |
| `value` | string | Non | Nouvelle valeur monétaire pour l'affaire |
| `status` | string | Non | Nouveau statut : open, won, lost |
| `stage_id` | string | Non | Nouvel ID d'étape pour l'affaire |
| `expected_close_date` | string | Non | Nouvelle date de clôture prévue au format AAAA-MM-JJ |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deal` | object | L'objet d'affaire mis à jour |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_files`

Récupérer des fichiers depuis Pipedrive avec des filtres optionnels

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Non | Filtrer les fichiers par ID d'affaire |
| `person_id` | string | Non | Filtrer les fichiers par ID de personne |
| `org_id` | string | Non | Filtrer les fichiers par ID d'organisation |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `files` | array | Tableau d'objets fichiers de Pipedrive |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_mail_messages`

Récupérer les fils de discussion de la boîte mail Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `folder` | string | Non | Filtrer par dossier : inbox, drafts, sent, archive \(par défaut : inbox\) |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 50\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `messages` | array | Tableau d'objets de fils de discussion de la boîte mail Pipedrive |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_mail_thread`

Récupérer tous les messages d'un fil de discussion spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `thread_id` | string | Oui | L'ID du fil de discussion |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `messages` | array | Tableau d'objets de messages électroniques du fil de discussion |
| `metadata` | object | Métadonnées de l'opération incluant l'ID du fil de discussion |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_pipelines`

Récupérer tous les pipelines de Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `sort_by` | string | Non | Champ de tri : id, update_time, add_time \(par défaut : id\) |
| `sort_direction` | string | Non | Direction du tri : asc, desc \(par défaut : asc\) |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500\) |
| `cursor` | string | Non | Pour la pagination, le marqueur représentant le premier élément de la page suivante |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pipelines` | array | Tableau d'objets de pipeline de Pipedrive |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_pipeline_deals`

Récupérer toutes les affaires dans un pipeline spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `pipeline_id` | string | Oui | L'ID du pipeline |
| `stage_id` | string | Non | Filtrer par étape spécifique dans le pipeline |
| `status` | string | Non | Filtrer par statut d'affaire : open, won, lost |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deals` | array | Tableau d'objets d'affaires du pipeline |
| `metadata` | object | Métadonnées de l'opération incluant l'ID du pipeline |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_projects`

Récupérer tous les projets ou un projet spécifique de Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | Non | Optionnel : ID d'un projet spécifique à récupérer |
| `status` | string | Non | Filtrer par statut de projet : open, completed, deleted \(uniquement pour lister tous\) |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500, uniquement pour lister tous\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `projects` | array | Tableau d'objets de projet (lors du listage de tous) |
| `project` | object | Objet de projet unique (lorsque project_id est fourni) |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_create_project`

Créer un nouveau projet dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Oui | Le titre du projet |
| `description` | string | Non | Description du projet |
| `start_date` | string | Non | Date de début du projet au format AAAA-MM-JJ |
| `end_date` | string | Non | Date de fin du projet au format AAAA-MM-JJ |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | L'objet du projet créé |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_activities`

Récupérer les activités (tâches) de Pipedrive avec filtres optionnels

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Non | Filtrer les activités par ID d'affaire |
| `person_id` | string | Non | Filtrer les activités par ID de personne |
| `org_id` | string | Non | Filtrer les activités par ID d'organisation |
| `type` | string | Non | Filtrer par type d'activité \(appel, réunion, tâche, échéance, email, déjeuner\) |
| `done` | string | Non | Filtrer par statut d'achèvement : 0 pour non terminé, 1 pour terminé |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `activities` | array | Tableau d'objets d'activité de Pipedrive |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_create_activity`

Créer une nouvelle activité (tâche) dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `subject` | chaîne | Oui | Le sujet/titre de l'activité |
| `type` | chaîne | Oui | Type d'activité : appel, réunion, tâche, échéance, e-mail, déjeuner |
| `due_date` | chaîne | Oui | Date d'échéance au format AAAA-MM-JJ |
| `due_time` | chaîne | Non | Heure d'échéance au format HH:MM |
| `duration` | chaîne | Non | Durée au format HH:MM |
| `deal_id` | chaîne | Non | ID de l'affaire à associer |
| `person_id` | chaîne | Non | ID de la personne à associer |
| `org_id` | chaîne | Non | ID de l'organisation à associer |
| `note` | chaîne | Non | Notes pour l'activité |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `activity` | object | L'objet activité créé |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_update_activity`

Mettre à jour une activité existante (tâche) dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `activity_id` | chaîne | Oui | L'ID de l'activité à mettre à jour |
| `subject` | chaîne | Non | Nouveau sujet/titre pour l'activité |
| `due_date` | chaîne | Non | Nouvelle date d'échéance au format AAAA-MM-JJ |
| `due_time` | chaîne | Non | Nouvelle heure d'échéance au format HH:MM |
| `duration` | chaîne | Non | Nouvelle durée au format HH:MM |
| `done` | chaîne | Non | Marquer comme terminé : 0 pour non terminé, 1 pour terminé |
| `note` | chaîne | Non | Nouvelles notes pour l'activité |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `activity` | object | L'objet activité mis à jour |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_get_leads`

Récupérer tous les prospects ou un prospect spécifique depuis Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `lead_id` | string | Non | Optionnel : ID d'un prospect spécifique à récupérer |
| `archived` | string | Non | Obtenir les prospects archivés au lieu des actifs |
| `owner_id` | string | Non | Filtrer par ID d'utilisateur propriétaire |
| `person_id` | string | Non | Filtrer par ID de personne |
| `organization_id` | string | Non | Filtrer par ID d'organisation |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100, max : 500\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `leads` | array | Tableau d'objets prospect \(lors de la liste complète\) |
| `lead` | object | Objet prospect unique \(lorsque lead_id est fourni\) |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_create_lead`

Créer un nouveau prospect dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `title` | string | Oui | Le nom du prospect |
| `person_id` | string | Non | ID de la personne \(OBLIGATOIRE sauf si organization_id est fourni\) |
| `organization_id` | string | Non | ID de l'organisation \(OBLIGATOIRE sauf si person_id est fourni\) |
| `owner_id` | string | Non | ID de l'utilisateur qui sera propriétaire du prospect |
| `value_amount` | string | Non | Montant de la valeur potentielle |
| `value_currency` | string | Non | Code de devise \(ex. USD, EUR\) |
| `expected_close_date` | string | Non | Date de clôture prévue au format AAAA-MM-JJ |
| `visible_to` | string | Non | Visibilité : 1 \(Propriétaire et abonnés\), 3 \(Entreprise entière\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `lead` | object | L'objet prospect créé |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_update_lead`

Mettre à jour un lead existant dans Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Oui | L'ID du lead à mettre à jour |
| `title` | string | Non | Nouveau nom pour le lead |
| `person_id` | string | Non | Nouvel ID de personne |
| `organization_id` | string | Non | Nouvel ID d'organisation |
| `owner_id` | string | Non | Nouvel ID d'utilisateur propriétaire |
| `value_amount` | string | Non | Nouvelle valeur du montant |
| `value_currency` | string | Non | Nouveau code de devise (ex. USD, EUR) |
| `expected_close_date` | string | Non | Nouvelle date de clôture prévue au format AAAA-MM-JJ |
| `is_archived` | string | Non | Archiver le lead : true ou false |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `lead` | object | L'objet prospect mis à jour |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `pipedrive_delete_lead`

Supprimer un lead spécifique de Pipedrive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Oui | L'ID du lead à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | object | Données de confirmation de suppression |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

## Notes

- Catégorie : `tools`
- Type : `pipedrive`
```

--------------------------------------------------------------------------------

````
