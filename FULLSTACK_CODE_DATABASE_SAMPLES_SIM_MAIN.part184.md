---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 184
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 184 of 933)

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

---[FILE: stt.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/stt.mdx

```text
---
title: Reconnaissance vocale
description: Convertir la parole en texte à l'aide de l'IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stt"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Transcrivez la parole en texte en utilisant les derniers modèles d'IA des fournisseurs de classe mondiale. Les outils de reconnaissance vocale (STT) de Sim vous permettent de transformer l'audio et la vidéo en transcriptions précises, horodatées et optionnellement traduites, prenant en charge une diversité de langues et enrichies de fonctionnalités avancées telles que la diarisation et l'identification des locuteurs.

**Fournisseurs et modèles pris en charge :**

- **[OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text/overview)** (OpenAI) :  
  Whisper d'OpenAI est un modèle d'apprentissage profond open-source reconnu pour sa robustesse à travers les langues et les conditions audio. Il prend en charge des modèles avancés tels que `whisper-1`, excellant dans la transcription, la traduction et les tâches exigeant une généralisation élevée du modèle. Soutenu par OpenAI—l'entreprise connue pour ChatGPT et la recherche de pointe en IA—Whisper est largement utilisé dans la recherche et comme référence pour l'évaluation comparative.

- **[Deepgram](https://deepgram.com/)** (Deepgram Inc.) :  
  Basée à San Francisco, Deepgram propose des API de reconnaissance vocale évolutives et de qualité production pour les développeurs et les entreprises. Les modèles de Deepgram incluent `nova-3`, `nova-2`, et `whisper-large`, offrant une transcription en temps réel et par lots avec une précision de premier plan, un support multilingue, une ponctuation automatique, une diarisation intelligente, des analyses d'appels et des fonctionnalités pour des cas d'utilisation allant de la téléphonie à la production médiatique.

- **[ElevenLabs](https://elevenlabs.io/)** (ElevenLabs) :  
  Leader dans l'IA vocale, ElevenLabs est particulièrement connu pour la synthèse et la reconnaissance vocale de qualité supérieure. Son produit STT offre une compréhension naturelle et de haute précision de nombreuses langues, dialectes et accents. Les modèles STT récents d'ElevenLabs sont optimisés pour la clarté, la distinction des locuteurs, et conviennent aussi bien aux scénarios créatifs qu'à l'accessibilité. ElevenLabs est reconnu pour ses avancées de pointe dans les technologies vocales alimentées par l'IA.

- **[AssemblyAI](https://www.assemblyai.com/)** (AssemblyAI Inc.) :  
  AssemblyAI fournit une reconnaissance vocale pilotée par API, hautement précise, avec des fonctionnalités telles que le chapitrage automatique, la détection de sujets, la synthèse, l'analyse de sentiment et la modération de contenu en plus de la transcription. Son modèle propriétaire, incluant le célèbre `Conformer-2`, alimente certaines des plus grandes applications de médias, de centres d'appels et de conformité dans l'industrie. AssemblyAI est utilisé par des entreprises du Fortune 500 et des startups d'IA de premier plan dans le monde entier.

- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** (Google Cloud) :  
  L'API Speech-to-Text de niveau entreprise de Google prend en charge plus de 125 langues et variantes, offrant une haute précision et des fonctionnalités telles que la diffusion en temps réel, la confiance au niveau des mots, la diarisation des locuteurs, la ponctuation automatique, le vocabulaire personnalisé et l'optimisation pour des domaines spécifiques. Des modèles tels que `latest_long`, `video`, et des modèles optimisés par domaine sont disponibles, alimentés par des années de recherche de Google et déployés pour une évolutivité mondiale.

- **[AWS Transcribe](https://aws.amazon.com/transcribe/)** (Amazon Web Services) :  
  AWS Transcribe s'appuie sur l'infrastructure cloud d'Amazon pour fournir une reconnaissance vocale robuste sous forme d'API. Il prend en charge plusieurs langues et des fonctionnalités telles que l'identification des locuteurs, le vocabulaire personnalisé, l'identification des canaux (pour l'audio des centres d'appels) et la transcription spécifique au domaine médical. Les modèles populaires incluent `standard` et des variations spécifiques à certains domaines. AWS Transcribe est idéal pour les organisations utilisant déjà le cloud d'Amazon.

**Comment choisir :**  
Sélectionnez le fournisseur et le modèle qui correspondent à votre application — que vous ayez besoin d'une transcription rapide et prête pour l'entreprise avec des analyses supplémentaires (Deepgram, AssemblyAI, Google, AWS), d'une grande polyvalence et d'un accès open-source (OpenAI Whisper), ou d'une compréhension avancée des locuteurs et du contexte (ElevenLabs). Tenez compte des tarifs, de la couverture linguistique, de la précision et de toutes les fonctionnalités spéciales (comme la synthèse, le chapitrage ou l'analyse des sentiments) dont vous pourriez avoir besoin.

Pour plus de détails sur les capacités, les tarifs, les principales fonctionnalités et les options de réglage fin, consultez la documentation officielle de chaque fournisseur via les liens ci-dessus.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Transcrivez des fichiers audio et vidéo en texte à l'aide des principaux fournisseurs d'IA. Prend en charge plusieurs langues, horodatages et diarisation des locuteurs.

## Outils

### `stt_whisper`

Transcrire l'audio en texte avec OpenAI Whisper

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `provider` | chaîne | Oui | Fournisseur STT \(whisper\) |
| `apiKey` | chaîne | Oui | Clé API OpenAI |
| `model` | chaîne | Non | Modèle Whisper à utiliser \(par défaut : whisper-1\) |
| `audioFile` | fichier | Non | Fichier audio ou vidéo à transcrire |
| `audioFileReference` | fichier | Non | Référence au fichier audio/vidéo des blocs précédents |
| `audioUrl` | chaîne | Non | URL vers un fichier audio ou vidéo |
| `language` | chaîne | Non | Code de langue \(ex. "en", "es", "fr"\) ou "auto" pour la détection automatique |
| `timestamps` | chaîne | Non | Granularité des horodatages : none, sentence, ou word |
| `translateToEnglish` | booléen | Non | Traduire l'audio en anglais |
| `prompt` | chaîne | Non | Texte facultatif pour guider le style du modèle ou continuer un segment audio précédent. Aide avec les noms propres et le contexte. |
| `temperature` | nombre | Non | Température d'échantillonnage entre 0 et 1. Des valeurs plus élevées rendent la sortie plus aléatoire, des valeurs plus basses la rendent plus ciblée et déterministe. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Texte transcrit complet |
| `segments` | array | Segments horodatés |
| `language` | string | Langue détectée ou spécifiée |
| `duration` | number | Durée audio en secondes |

### `stt_deepgram`

Transcrire l'audio en texte avec Deepgram

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Oui | Fournisseur STT \(deepgram\) |
| `apiKey` | string | Oui | Clé API Deepgram |
| `model` | string | Non | Modèle Deepgram à utiliser \(nova-3, nova-2, whisper-large, etc.\) |
| `audioFile` | file | Non | Fichier audio ou vidéo à transcrire |
| `audioFileReference` | file | Non | Référence au fichier audio/vidéo des blocs précédents |
| `audioUrl` | string | Non | URL vers un fichier audio ou vidéo |
| `language` | string | Non | Code de langue \(ex. "en", "es", "fr"\) ou "auto" pour la détection automatique |
| `timestamps` | string | Non | Granularité des horodatages : none, sentence, ou word |
| `diarization` | boolean | Non | Activer la diarisation des locuteurs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Texte transcrit complet |
| `segments` | array | Segments horodatés avec identification des locuteurs |
| `language` | string | Langue détectée ou spécifiée |
| `duration` | number | Durée audio en secondes |
| `confidence` | number | Score de confiance global |

### `stt_elevenlabs`

Transcrire l'audio en texte en utilisant ElevenLabs

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `provider` | chaîne | Oui | Fournisseur STT \(elevenlabs\) |
| `apiKey` | chaîne | Oui | Clé API ElevenLabs |
| `model` | chaîne | Non | Modèle ElevenLabs à utiliser \(scribe_v1, scribe_v1_experimental\) |
| `audioFile` | fichier | Non | Fichier audio ou vidéo à transcrire |
| `audioFileReference` | fichier | Non | Référence au fichier audio/vidéo des blocs précédents |
| `audioUrl` | chaîne | Non | URL vers un fichier audio ou vidéo |
| `language` | chaîne | Non | Code de langue \(ex. "en", "es", "fr"\) ou "auto" pour la détection automatique |
| `timestamps` | chaîne | Non | Granularité des horodatages : none, sentence, ou word |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | chaîne | Texte transcrit complet |
| `segments` | tableau | Segments horodatés |
| `language` | chaîne | Langue détectée ou spécifiée |
| `duration` | nombre | Durée audio en secondes |
| `confidence` | nombre | Score de confiance global |

### `stt_assemblyai`

Transcrire l'audio en texte en utilisant AssemblyAI avec des fonctionnalités avancées de NLP

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `provider` | chaîne | Oui | Fournisseur STT \(assemblyai\) |
| `apiKey` | chaîne | Oui | Clé API AssemblyAI |
| `model` | chaîne | Non | Modèle AssemblyAI à utiliser \(par défaut : best\) |
| `audioFile` | fichier | Non | Fichier audio ou vidéo à transcrire |
| `audioFileReference` | fichier | Non | Référence au fichier audio/vidéo des blocs précédents |
| `audioUrl` | chaîne | Non | URL vers un fichier audio ou vidéo |
| `language` | chaîne | Non | Code de langue \(ex. "en", "es", "fr"\) ou "auto" pour la détection automatique |
| `timestamps` | chaîne | Non | Granularité des horodatages : none, sentence, ou word |
| `diarization` | booléen | Non | Activer la diarisation des locuteurs |
| `sentiment` | booléen | Non | Activer l'analyse des sentiments |
| `entityDetection` | booléen | Non | Activer la détection d'entités |
| `piiRedaction` | booléen | Non | Activer la rédaction des PII |
| `summarization` | booléen | Non | Activer la génération automatique de résumés |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | chaîne | Texte transcrit complet |
| `segments` | tableau | Segments horodatés avec étiquettes de locuteurs |
| `language` | chaîne | Langue détectée ou spécifiée |
| `duration` | nombre | Durée audio en secondes |
| `confidence` | nombre | Score de confiance global |
| `sentiment` | tableau | Résultats d'analyse de sentiment |
| `entities` | tableau | Entités détectées |
| `summary` | chaîne | Résumé généré automatiquement |

### `stt_gemini`

Transcrire l'audio en texte en utilisant Google Gemini avec des capacités multimodales

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `provider` | chaîne | Oui | Fournisseur STT \(gemini\) |
| `apiKey` | chaîne | Oui | Clé API Google |
| `model` | chaîne | Non | Modèle Gemini à utiliser \(par défaut : gemini-2.5-flash\) |
| `audioFile` | fichier | Non | Fichier audio ou vidéo à transcrire |
| `audioFileReference` | fichier | Non | Référence au fichier audio/vidéo des blocs précédents |
| `audioUrl` | chaîne | Non | URL vers un fichier audio ou vidéo |
| `language` | chaîne | Non | Code de langue \(ex. "en", "es", "fr"\) ou "auto" pour la détection automatique |
| `timestamps` | chaîne | Non | Granularité des horodatages : none, sentence, ou word |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | chaîne | Texte transcrit complet |
| `segments` | tableau | Segments horodatés |
| `language` | chaîne | Langue détectée ou spécifiée |
| `duration` | nombre | Durée audio en secondes |
| `confidence` | nombre | Score de confiance global |

## Remarques

- Catégorie : `tools`
- Type : `stt`
```

--------------------------------------------------------------------------------

---[FILE: supabase.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/supabase.mdx

```text
---
title: Supabase
description: Utiliser la base de données Supabase
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="supabase"
  color="#1C1C1C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Supabase](https://www.supabase.com/) est une plateforme backend-as-a-service open-source puissante qui fournit aux développeurs une suite d'outils pour construire, mettre à l'échelle et gérer des applications modernes. Supabase offre une base de données [PostgreSQL](https://www.postgresql.org/) entièrement gérée, une authentification robuste, des API RESTful et GraphQL instantanées, des abonnements en temps réel, un stockage de fichiers et des fonctions edge — le tout accessible via une interface unifiée et conviviale pour les développeurs. Sa nature open-source et sa compatibilité avec les frameworks populaires en font une alternative convaincante à Firebase, avec l'avantage supplémentaire de la flexibilité SQL et de la transparence.

**Pourquoi Supabase ?**
- **API instantanées :** Chaque table et vue dans votre base de données est instantanément disponible via des points d'accès REST et GraphQL, facilitant la création d'applications basées sur les données sans écrire de code backend personnalisé.
- **Données en temps réel :** Supabase permet des abonnements en temps réel, permettant à vos applications de réagir instantanément aux changements dans votre base de données.
- **Authentification et autorisation :** Gestion des utilisateurs intégrée avec prise en charge de l'email, OAuth, SSO et plus encore, plus une sécurité au niveau des lignes pour un contrôle d'accès granulaire.
- **Stockage :** Téléchargez, servez et gérez des fichiers en toute sécurité avec un stockage intégré qui s'intègre parfaitement à votre base de données.
- **Fonctions Edge :** Déployez des fonctions serverless à proximité de vos utilisateurs pour une logique personnalisée à faible latence.

**Utilisation de Supabase dans Sim**

L'intégration de Supabase dans Sim permet de connecter sans effort vos flux de travail automatisés à vos projets Supabase. Avec seulement quelques champs de configuration — votre ID de projet, le nom de la table et la clé secrète du rôle de service — vous pouvez interagir en toute sécurité avec votre base de données directement depuis vos blocs Sim. L'intégration simplifie la complexité des appels API, vous permettant de vous concentrer sur la création de logique et d'automatisations.

**Principaux avantages de l'utilisation de Supabase dans Sim :**
- **Opérations de base de données sans code/low-code :** interrogez, insérez, mettez à jour et supprimez des lignes dans vos tables Supabase sans écrire de SQL ou de code backend.
- **Requêtes flexibles :** utilisez la [syntaxe de filtre PostgREST](https://postgrest.org/en/stable/api.html#operators) pour effectuer des requêtes avancées, y compris le filtrage, le tri et la limitation des résultats.
- **Intégration transparente :** connectez facilement Supabase à d'autres outils et services dans votre flux de travail, permettant des automatisations puissantes comme la synchronisation de données, le déclenchement de notifications ou l'enrichissement d'enregistrements.
- **Sécurisé et évolutif :** toutes les opérations utilisent votre clé secrète de rôle de service Supabase, assurant un accès sécurisé à vos données avec l'évolutivité d'une plateforme cloud gérée.

Que vous construisiez des outils internes, automatisiez des processus métier ou alimentiez des applications de production, Supabase dans Sim offre un moyen rapide, fiable et convivial pour gérer vos données et votre logique backend — sans gestion d'infrastructure requise. Configurez simplement votre bloc, sélectionnez l'opération dont vous avez besoin, et laissez Sim s'occuper du reste.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Supabase dans le flux de travail. Prend en charge les opérations de base de données (requête, insertion, mise à jour, suppression, upsert), la recherche en texte intégral, les fonctions RPC, le comptage de lignes, la recherche vectorielle et la gestion complète du stockage (téléchargement, téléversement, listage, déplacement, copie, suppression de fichiers et de buckets).

## Outils

### `supabase_query`

Interroger des données d'une table Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | Votre ID de projet Supabase \(ex. : jdrkgepadsdopsntdlom\) |
| `table` | chaîne | Oui | Le nom de la table Supabase à interroger |
| `filter` | chaîne | Non | Filtre PostgREST \(ex. : "id=eq.123"\) |
| `orderBy` | chaîne | Non | Colonne pour le tri \(ajoutez DESC pour décroissant\) |
| `limit` | nombre | Non | Nombre maximum de lignes à retourner |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau des enregistrements retournés par la requête |

### `supabase_insert`

Insérer des données dans une table Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | chaîne | Oui | Le nom de la table Supabase dans laquelle insérer des données |
| `data` | tableau | Oui | Les données à insérer (tableau d'objets ou un seul objet) |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau des enregistrements insérés |

### `supabase_get_row`

Obtenir une seule ligne d'une table Supabase selon des critères de filtrage

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | string | Oui | Le nom de la table Supabase à interroger |
| `filter` | string | Oui | Filtre PostgREST pour trouver la ligne spécifique (ex. : "id=eq.123") |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau contenant les données des lignes si trouvées, tableau vide si non trouvées |

### `supabase_update`

Mettre à jour des lignes dans une table Supabase selon des critères de filtrage

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | string | Oui | Le nom de la table Supabase à mettre à jour |
| `filter` | string | Oui | Filtre PostgREST pour identifier les lignes à mettre à jour (ex. : "id=eq.123") |
| `data` | object | Oui | Données à mettre à jour dans les lignes correspondantes |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau des enregistrements mis à jour |

### `supabase_delete`

Supprimer des lignes d'une table Supabase selon des critères de filtrage

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | string | Oui | Le nom de la table Supabase d'où supprimer des lignes |
| `filter` | string | Oui | Filtre PostgREST pour identifier les lignes à supprimer (ex. : "id=eq.123") |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau des enregistrements supprimés |

### `supabase_upsert`

Insérer ou mettre à jour des données dans une table Supabase (opération upsert)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | chaîne | Oui | Le nom de la table Supabase dans laquelle upserter des données |
| `data` | tableau | Oui | Les données à upserter (insérer ou mettre à jour) - tableau d'objets ou un seul objet |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau des enregistrements insérés ou mis à jour |

### `supabase_count`

Compter les lignes dans une table Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | chaîne | Oui | Le nom de la table Supabase dont compter les lignes |
| `filter` | chaîne | Non | Filtre PostgREST (ex. : "status=eq.active") |
| `countType` | chaîne | Non | Type de comptage : exact, planned ou estimated (par défaut : exact) |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `count` | nombre | Nombre de lignes correspondant au filtre |

### `supabase_text_search`

Effectuer une recherche en texte intégral sur une table Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `table` | chaîne | Oui | Le nom de la table Supabase à rechercher |
| `column` | chaîne | Oui | La colonne dans laquelle rechercher |
| `query` | chaîne | Oui | La requête de recherche |
| `searchType` | chaîne | Non | Type de recherche : plain, phrase ou websearch (par défaut : websearch) |
| `language` | chaîne | Non | Langue pour la configuration de recherche textuelle (par défaut : english) |
| `limit` | nombre | Non | Nombre maximum de lignes à retourner |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau des enregistrements correspondant à la requête de recherche |

### `supabase_vector_search`

Effectuer une recherche de similarité en utilisant pgvector dans une table Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `functionName` | chaîne | Oui | Le nom de la fonction PostgreSQL qui effectue la recherche vectorielle (ex. : match_documents) |
| `queryEmbedding` | tableau | Oui | Le vecteur/embedding de requête pour rechercher des éléments similaires |
| `matchThreshold` | nombre | Non | Seuil minimum de similarité (0-1), généralement 0,7-0,9 |
| `matchCount` | nombre | Non | Nombre maximum de résultats à retourner (par défaut : 10) |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau d'enregistrements avec scores de similarité issus de la recherche vectorielle. Chaque enregistrement inclut un champ de similarité (0-1) indiquant son degré de similarité avec le vecteur de requête. |

### `supabase_rpc`

Appeler une fonction PostgreSQL dans Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `functionName` | chaîne | Oui | Le nom de la fonction PostgreSQL à appeler |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | json | Résultat retourné par la fonction |

### `supabase_storage_upload`

Téléverser un fichier vers un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase \(ex. : jdrkgepadsdopsntdlom\) |
| `bucket` | string | Oui | Le nom du bucket de stockage |
| `path` | string | Oui | Le chemin où le fichier sera stocké \(ex. : "dossier/fichier.jpg"\) |
| `fileContent` | string | Oui | Le contenu du fichier \(encodé en base64 pour les fichiers binaires, ou texte brut\) |
| `contentType` | string | Non | Type MIME du fichier \(ex. : "image/jpeg", "text/plain"\) |
| `upsert` | boolean | Non | Si vrai, écrase le fichier existant \(par défaut : false\) |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | object | Résultat du téléversement incluant le chemin du fichier et les métadonnées |

### `supabase_storage_download`

Télécharger un fichier depuis un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `bucket` | chaîne | Oui | Le nom du bucket de stockage |
| `path` | chaîne | Oui | Le chemin vers le fichier à télécharger (ex. : "dossier/fichier.jpg") |
| `fileName` | chaîne | Non | Remplacement optionnel du nom de fichier |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | fichier | Fichier téléchargé stocké dans les fichiers d'exécution |

### `supabase_storage_list`

Lister les fichiers dans un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase \(ex. : jdrkgepadsdopsntdlom\) |
| `bucket` | string | Oui | Le nom du bucket de stockage |
| `path` | string | Non | Le chemin du dossier à partir duquel lister les fichiers \(par défaut : racine\) |
| `limit` | number | Non | Nombre maximum de fichiers à retourner \(par défaut : 100\) |
| `offset` | number | Non | Nombre de fichiers à ignorer \(pour la pagination\) |
| `sortBy` | string | Non | Colonne pour le tri : name, created_at, updated_at \(par défaut : name\) |
| `sortOrder` | string | Non | Ordre de tri : asc ou desc \(par défaut : asc\) |
| `search` | string | Non | Terme de recherche pour filtrer les fichiers par nom |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau d'objets de fichiers avec métadonnées |

### `supabase_storage_delete`

Supprimer des fichiers d'un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `bucket` | chaîne | Oui | Le nom du bucket de stockage |
| `paths` | tableau | Oui | Tableau des chemins de fichiers à supprimer (ex. : ["dossier/fichier1.jpg", "dossier/fichier2.jpg"]) |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `results` | tableau | Tableau des objets fichiers supprimés |

### `supabase_storage_move`

Déplacer un fichier dans un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `bucket` | chaîne | Oui | Le nom du bucket de stockage |
| `fromPath` | chaîne | Oui | Le chemin actuel du fichier (ex. : "dossier/ancien.jpg") |
| `toPath` | chaîne | Oui | Le nouveau chemin pour le fichier (ex. : "nouveaudossier/nouveau.jpg") |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `results` | objet | Résultat de l'opération de déplacement |

### `supabase_storage_copy`

Copier un fichier dans un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `bucket` | chaîne | Oui | Le nom du bucket de stockage |
| `fromPath` | chaîne | Oui | Le chemin du fichier source (ex. : "dossier/source.jpg") |
| `toPath` | chaîne | Oui | Le chemin pour le fichier copié (ex. : "dossier/copie.jpg") |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message d'état de l'opération |
| `results` | objet | Résultat de l'opération de copie |

### `supabase_storage_create_bucket`

Créer un nouveau bucket de stockage dans Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | chaîne | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `bucket` | chaîne | Oui | Le nom du bucket à créer |
| `isPublic` | booléen | Non | Si le bucket doit être accessible publiquement (par défaut : false) |
| `fileSizeLimit` | nombre | Non | Taille maximale de fichier en octets (facultatif) |
| `allowedMimeTypes` | tableau | Non | Tableau des types MIME autorisés (ex. : ["image/png", "image/jpeg"]) |
| `apiKey` | chaîne | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | object | Informations sur le bucket créé |

### `supabase_storage_list_buckets`

Lister tous les buckets de stockage dans Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase \(ex. : jdrkgepadsdopsntdlom\) |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | array | Tableau d'objets bucket |

### `supabase_storage_delete_bucket`

Supprimer un bucket de stockage dans Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase \(ex. : jdrkgepadsdopsntdlom\) |
| `bucket` | string | Oui | Le nom du bucket à supprimer |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `results` | object | Résultat de l'opération de suppression |

### `supabase_storage_get_public_url`

Obtenir l'URL publique d'un fichier dans un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase \(ex. : jdrkgepadsdopsntdlom\) |
| `bucket` | string | Oui | Le nom du bucket de stockage |
| `path` | string | Oui | Le chemin vers le fichier \(ex. : "dossier/fichier.jpg"\) |
| `download` | boolean | Non | Si vrai, force le téléchargement au lieu de l'affichage en ligne \(par défaut : false\) |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `publicUrl` | string | L'URL publique pour accéder au fichier |

### `supabase_storage_create_signed_url`

Créer une URL signée temporaire pour un fichier dans un bucket de stockage Supabase

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Oui | L'ID de votre projet Supabase (ex. : jdrkgepadsdopsntdlom) |
| `bucket` | string | Oui | Le nom du bucket de stockage |
| `path` | string | Oui | Le chemin vers le fichier (ex. : "dossier/fichier.jpg") |
| `expiresIn` | number | Oui | Nombre de secondes avant l'expiration de l'URL (ex. : 3600 pour 1 heure) |
| `download` | boolean | Non | Si vrai, force le téléchargement au lieu de l'affichage en ligne (par défaut : false) |
| `apiKey` | string | Oui | Votre clé secrète de rôle de service Supabase |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `signedUrl` | string | L'URL signée temporaire pour accéder au fichier |

## Notes

- Catégorie : `tools`
- Type : `supabase`
```

--------------------------------------------------------------------------------

````
