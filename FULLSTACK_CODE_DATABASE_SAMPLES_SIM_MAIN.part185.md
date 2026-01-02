---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 185
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 185 of 933)

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

---[FILE: tavily.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/tavily.mdx

```text
---
title: Tavily
description: Rechercher et extraire des informations
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tavily"
  color="#0066FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Tavily](https://www.tavily.com/) est une API de recherche alimentée par l'IA, conçue spécifiquement pour les applications LLM. Elle fournit des capacités de récupération d'informations fiables et en temps réel avec des fonctionnalités optimisées pour les cas d'utilisation de l'IA, notamment la recherche sémantique, l'extraction de contenu et la récupération de données structurées.

Avec Tavily, vous pouvez :

- **Effectuer des recherches contextuelles** : Obtenir des résultats pertinents basés sur la compréhension sémantique plutôt que sur la simple correspondance de mots-clés
- **Extraire du contenu structuré** : Récupérer des informations spécifiques à partir de pages web dans un format propre et utilisable
- **Accéder à des informations en temps réel** : Récupérer des données à jour provenant du web
- **Traiter plusieurs URL simultanément** : Extraire du contenu de plusieurs pages web en une seule requête
- **Recevoir des résultats optimisés pour l'IA** : Obtenir des résultats de recherche spécifiquement formatés pour être consommés par des systèmes d'IA

Dans Sim, l'intégration de Tavily permet à vos agents de rechercher sur le web et d'extraire des informations dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation sophistiqués qui nécessitent des informations à jour provenant d'internet. Vos agents peuvent formuler des requêtes de recherche, récupérer des résultats pertinents et extraire du contenu de pages web spécifiques pour éclairer leurs processus de prise de décision. Cette intégration comble le fossé entre votre automatisation de flux de travail et les vastes connaissances disponibles sur le web, permettant à vos agents d'accéder à des informations en temps réel sans intervention manuelle. En connectant Sim avec Tavily, vous pouvez créer des agents qui restent à jour avec les dernières informations, fournissent des réponses plus précises et apportent plus de valeur aux utilisateurs.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Tavily dans le flux de travail. Peut rechercher sur le web et extraire du contenu à partir d'URLs spécifiques. Nécessite une clé API.

## Outils

### `tavily_search`

Effectuer des recherches web alimentées par l'IA en utilisant Tavily

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | chaîne | Oui | La requête de recherche à exécuter |
| `max_results` | nombre | Non | Nombre maximum de résultats \(1-20\) |
| `topic` | chaîne | Non | Type de catégorie : general, news, ou finance \(par défaut : general\) |
| `search_depth` | chaîne | Non | Portée de recherche : basic \(1 crédit\) ou advanced \(2 crédits\) \(par défaut : basic\) |
| `include_answer` | chaîne | Non | Réponse générée par LLM : true/basic pour une réponse rapide ou advanced pour détaillée |
| `include_raw_content` | chaîne | Non | Contenu HTML analysé : true/markdown ou format texte |
| `include_images` | booléen | Non | Inclure les résultats de recherche d'images |
| `include_image_descriptions` | booléen | Non | Ajouter du texte descriptif pour les images |
| `include_favicon` | booléen | Non | Inclure les URLs des favicons |
| `chunks_per_source` | nombre | Non | Nombre maximum de fragments pertinents par source \(1-3, par défaut : 3\) |
| `time_range` | chaîne | Non | Filtrer par récence : day/d, week/w, month/m, year/y |
| `start_date` | chaîne | Non | Date de publication la plus ancienne \(format AAAA-MM-JJ\) |
| `end_date` | chaîne | Non | Date de publication la plus récente \(format AAAA-MM-JJ\) |
| `include_domains` | chaîne | Non | Liste de domaines autorisés séparés par des virgules \(max 300\) |
| `exclude_domains` | chaîne | Non | Liste de domaines exclus séparés par des virgules \(max 150\) |
| `country` | chaîne | Non | Favoriser les résultats d'un pays spécifié \(sujet général uniquement\) |
| `auto_parameters` | booléen | Non | Configuration automatique des paramètres basée sur l'intention de la requête |
| `apiKey` | chaîne | Oui | Clé API Tavily |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `query` | chaîne | La requête de recherche qui a été exécutée |
| `results` | tableau | Résultats produits par l'outil |

### `tavily_extract`

Extraire le contenu brut de plusieurs pages web simultanément en utilisant Tavily

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `urls` | chaîne | Oui | URL ou tableau d'URLs pour extraire le contenu |
| `extract_depth` | chaîne | Non | La profondeur d'extraction \(basic=1 crédit/5 URLs, advanced=2 crédits/5 URLs\) |
| `format` | chaîne | Non | Format de sortie : markdown ou text \(par défaut : markdown\) |
| `include_images` | booléen | Non | Incorporer des images dans le résultat d'extraction |
| `include_favicon` | booléen | Non | Ajouter l'URL du favicon pour chaque résultat |
| `apiKey` | chaîne | Oui | Clé API Tavily |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | tableau | L'URL qui a été extraite |

### `tavily_crawl`

Explorer et extraire systématiquement le contenu des sites web en utilisant Tavily

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `url` | chaîne | Oui | L'URL racine pour commencer l'exploration |
| `instructions` | chaîne | Non | Instructions en langage naturel pour le crawler \(coûte 2 crédits par 10 pages\) |
| `max_depth` | nombre | Non | Distance d'exploration depuis l'URL de base \(1-5, par défaut : 1\) |
| `max_breadth` | nombre | Non | Liens suivis par niveau de page \(≥1, par défaut : 20\) |
| `limit` | nombre | Non | Total des liens traités avant l'arrêt \(≥1, par défaut : 50\) |
| `select_paths` | chaîne | Non | Modèles regex séparés par des virgules pour inclure des chemins d'URL spécifiques \(ex. : /docs/.*\) |
| `select_domains` | chaîne | Non | Modèles regex séparés par des virgules pour restreindre l'exploration à certains domaines |
| `exclude_paths` | chaîne | Non | Modèles regex séparés par des virgules pour ignorer des chemins d'URL spécifiques |
| `exclude_domains` | chaîne | Non | Modèles regex séparés par des virgules pour bloquer certains domaines |
| `allow_external` | booléen | Non | Inclure les liens de domaines externes dans les résultats \(par défaut : true\) |
| `include_images` | booléen | Non | Incorporer des images dans le résultat d'exploration |
| `extract_depth` | chaîne | Non | Profondeur d'extraction : basic \(1 crédit/5 pages\) ou advanced \(2 crédits/5 pages\) |
| `format` | chaîne | Non | Format de sortie : markdown ou text \(par défaut : markdown\) |
| `include_favicon` | booléen | Non | Ajouter l'URL du favicon pour chaque résultat |
| `apiKey` | chaîne | Oui | Clé API Tavily |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `base_url` | chaîne | L'URL de base qui a été explorée |
| `results` | tableau | L'URL de la page explorée |

### `tavily_map`

Découvrir et visualiser la structure d'un site web avec Tavily

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `url` | chaîne | Oui | L'URL racine pour commencer la cartographie |
| `instructions` | chaîne | Non | Instructions en langage naturel pour le comportement de cartographie \(coûte 2 crédits par 10 pages\) |
| `max_depth` | nombre | Non | Distance d'exploration depuis l'URL de base \(1-5, par défaut : 1\) |
| `max_breadth` | nombre | Non | Liens à suivre par niveau \(par défaut : 20\) |
| `limit` | nombre | Non | Nombre total de liens à traiter \(par défaut : 50\) |
| `select_paths` | chaîne | Non | Motifs regex séparés par des virgules pour le filtrage des chemins d'URL \(ex. : /docs/.*\) |
| `select_domains` | chaîne | Non | Motifs regex séparés par des virgules pour restreindre la cartographie à des domaines spécifiques |
| `exclude_paths` | chaîne | Non | Motifs regex séparés par des virgules pour exclure des chemins d'URL spécifiques |
| `exclude_domains` | chaîne | Non | Motifs regex séparés par des virgules pour exclure des domaines |
| `allow_external` | booléen | Non | Inclure les liens de domaines externes dans les résultats \(par défaut : true\) |
| `apiKey` | chaîne | Oui | Clé API Tavily |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `base_url` | chaîne | L'URL de base qui a été cartographiée |
| `results` | tableau | URL découverte |

## Notes

- Catégorie : `tools`
- Type : `tavily`
```

--------------------------------------------------------------------------------

---[FILE: telegram.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/telegram.mdx

```text
---
title: Telegram
description: Envoyez des messages via Telegram ou déclenchez des workflows à
  partir d'événements Telegram
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="telegram"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Telegram](https://telegram.org) est une plateforme de messagerie sécurisée basée sur le cloud qui permet une communication rapide et fiable sur tous les appareils et plateformes. Avec plus de 700 millions d'utilisateurs actifs mensuels, Telegram s'est imposé comme l'un des services de messagerie leaders mondiaux, reconnu pour sa sécurité, sa rapidité et ses puissantes capacités d'API.

L'API Bot de Telegram fournit un cadre robuste pour créer des solutions de messagerie automatisées et intégrer des fonctionnalités de communication dans les applications. Avec la prise en charge des médias enrichis, des claviers intégrés et des commandes personnalisées, les bots Telegram peuvent faciliter des modèles d'interaction sophistiqués et des workflows automatisés.

Découvrez comment créer un déclencheur webhook dans Sim qui lance harmonieusement des workflows à partir de messages Telegram. Ce tutoriel vous guide à travers la configuration d'un webhook, sa configuration avec l'API bot de Telegram, et le déclenchement d'actions automatisées en temps réel. Parfait pour rationaliser les tâches directement depuis votre chat !

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/9oKcJtQ0_IM"
  title="Utiliser Telegram avec Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Apprenez à utiliser l'outil Telegram dans Sim pour automatiser en toute simplicité la livraison de messages à n'importe quel groupe Telegram. Ce tutoriel vous guide à travers l'intégration de l'outil dans votre workflow, la configuration de la messagerie de groupe et le déclenchement de mises à jour automatisées en temps réel. Parfait pour améliorer la communication directement depuis votre espace de travail !

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/AG55LpUreGI"
  title="Utiliser Telegram avec Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Les fonctionnalités clés de Telegram comprennent :

- Communication sécurisée : Chiffrement de bout en bout et stockage sécurisé dans le cloud pour les messages et les médias
- Plateforme de bots : API de bot puissante pour créer des solutions de messagerie automatisées et des expériences interactives
- Support multimédia riche : Envoi et réception de messages avec mise en forme du texte, images, fichiers et éléments interactifs
- Portée mondiale : Connexion avec des utilisateurs du monde entier avec prise en charge de plusieurs langues et plateformes

Dans Sim, l'intégration de Telegram permet à vos agents d'exploiter ces puissantes fonctionnalités de messagerie dans le cadre de leurs flux de travail. Cela crée des opportunités pour les notifications automatisées, les alertes et les conversations interactives via la plateforme de messagerie sécurisée de Telegram. L'intégration permet aux agents d'envoyer des messages de manière programmatique à des individus ou à des canaux, permettant une communication et des mises à jour opportunes. En connectant Sim à Telegram, vous pouvez créer des agents intelligents qui interagissent avec les utilisateurs via une plateforme de messagerie sécurisée et largement adoptée, parfaite pour délivrer des notifications, des mises à jour et des communications interactives.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer Telegram dans le flux de travail. Peut envoyer des messages. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'un message est envoyé à une conversation.

## Outils

### `telegram_message`

Envoyez des messages aux canaux ou utilisateurs Telegram via l'API Bot Telegram. Permet une communication directe et des notifications avec suivi des messages et confirmation de chat.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `text` | chaîne | Oui | Texte du message à envoyer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du message Telegram |

## Notes

- Catégorie : `tools`
- Type : `telegram`

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `messageId` | chaîne | Oui | ID du message à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Résultat de l'opération de suppression |

### `telegram_send_photo`

Envoyez des photos aux canaux ou utilisateurs Telegram via l'API Bot Telegram.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `photo` | chaîne | Oui | Photo à envoyer. Passez un file_id ou une URL HTTP |
| `caption` | chaîne | Non | Légende de la photo \(facultatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du message Telegram incluant la/les photo(s) facultative(s) |

### `telegram_send_video`

Envoyez des vidéos aux canaux ou utilisateurs Telegram via l'API Bot Telegram.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `video` | chaîne | Oui | Vidéo à envoyer. Passez un file_id ou une URL HTTP |
| `caption` | chaîne | Non | Légende de la vidéo \(facultatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de succès ou d'erreur |
| `data` | object | Données du message Telegram incluant les médias optionnels |

### `telegram_send_audio`

Envoyez des fichiers audio aux canaux ou utilisateurs Telegram via l'API Bot Telegram.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `audio` | chaîne | Oui | Fichier audio à envoyer. Passez un file_id ou une URL HTTP |
| `caption` | chaîne | Non | Légende audio \(facultatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de succès ou d'erreur |
| `data` | object | Données du message Telegram incluant les informations vocales/audio |

### `telegram_send_animation`

Envoyez des animations (GIF) aux canaux ou utilisateurs Telegram via l'API Bot Telegram.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `animation` | chaîne | Oui | Animation à envoyer. Passez un file_id ou une URL HTTP |
| `caption` | chaîne | Non | Légende de l'animation \(facultatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du message Telegram incluant les médias optionnels |

### `telegram_send_document`

Envoyez des documents (PDF, ZIP, DOC, etc.) aux canaux ou utilisateurs Telegram via l'API Bot Telegram.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `botToken` | chaîne | Oui | Votre jeton d'API Bot Telegram |
| `chatId` | chaîne | Oui | ID du chat Telegram cible |
| `files` | fichier[] | Non | Fichier document à envoyer \(PDF, ZIP, DOC, etc.\). Taille max : 50 Mo |
| `caption` | chaîne | Non | Légende du document \(facultatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du message Telegram incluant le document |

## Notes

- Catégorie : `tools`
- Type : `telegram`
```

--------------------------------------------------------------------------------

---[FILE: thinking.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/thinking.mdx

```text
---
title: Réflexion
description: Force le modèle à exposer son processus de réflexion.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="thinking"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
L'outil Réflexion encourage les modèles d'IA à s'engager dans un raisonnement explicite avant de répondre à des questions complexes. En offrant un espace dédié à l'analyse étape par étape, cet outil aide les modèles à décomposer les problèmes, à considérer plusieurs perspectives et à parvenir à des conclusions plus réfléchies.

Des recherches ont démontré que le fait d'inciter les modèles de langage à « réfléchir étape par étape » peut améliorer considérablement leurs capacités de raisonnement. Selon [les recherches d'Anthropic sur l'outil Think de Claude](https://www.anthropic.com/engineering/claude-think-tool), lorsque les modèles disposent d'un espace pour développer explicitement leur raisonnement, ils démontrent :

- **Résolution de problèmes améliorée** : décomposition de problèmes complexes en étapes gérables
- **Précision accrue** : réduction des erreurs en travaillant soigneusement sur chaque composante d'un problème
- **Plus grande transparence** : rendre visible et vérifiable le processus de raisonnement du modèle
- **Réponses plus nuancées** : considération de multiples angles avant d'arriver à des conclusions

Dans Sim, l'outil de Réflexion crée une opportunité structurée pour que vos agents s'engagent dans ce type de raisonnement délibéré. En incorporant des étapes de réflexion dans vos flux de travail, vous pouvez aider vos agents à aborder des tâches complexes plus efficacement, éviter les pièges de raisonnement courants et produire des résultats de meilleure qualité. Cela est particulièrement précieux pour les tâches impliquant un raisonnement en plusieurs étapes, une prise de décision complexe ou des situations où la précision est essentielle.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Ajoute une étape où le modèle expose explicitement son processus de réflexion avant de continuer. Cela peut améliorer la qualité du raisonnement en encourageant une analyse étape par étape.

## Outils

### `thinking_tool`

Traite une réflexion/instruction fournie, la rendant disponible pour les étapes suivantes.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `thought` | chaîne | Oui | Votre raisonnement interne, analyse ou processus de réflexion. Utilisez ceci pour réfléchir au problème étape par étape avant de répondre. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `acknowledgedThought` | chaîne | La réflexion qui a été traitée et reconnue |

## Remarques

- Catégorie : `tools`
- Type : `thinking`
```

--------------------------------------------------------------------------------

---[FILE: translate.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/translate.mdx

```text
---
title: Traduire
description: Traduire du texte dans n'importe quelle langue
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="translate"
  color="#FF4B4B"
/>

{/* MANUAL-CONTENT-START:intro */}
Traduire est un outil qui vous permet de traduire du texte entre différentes langues.

Avec Traduire, vous pouvez :

- **Traduire du texte** : traduire du texte entre différentes langues
- **Traduire des documents** : traduire des documents entre différentes langues
- **Traduire des sites web** : traduire des sites web entre différentes langues
- **Traduire des images** : traduire des images entre différentes langues
- **Traduire de l'audio** : traduire de l'audio entre différentes langues
- **Traduire des vidéos** : traduire des vidéos entre différentes langues
- **Traduire de la parole** : traduire de la parole entre différentes langues
- **Traduire du texte** : traduire du texte entre différentes langues
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Translate dans le flux de travail. Peut traduire du texte dans n'importe quelle langue.

## Outils

### `llm_chat`

Envoyez une requête de complétion de chat à n'importe quel fournisseur de LLM pris en charge

#### Entrée

| Paramètre | Type | Requis | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Oui | Le modèle à utiliser \(par exemple, gpt-4o, claude-sonnet-4-5, gemini-2.0-flash\) |
| `systemPrompt` | string | Non | Prompt système pour définir le comportement de l'assistant |
| `context` | string | Oui | Le message utilisateur ou le contexte à envoyer au modèle |
| `apiKey` | string | Non | Clé API pour le fournisseur \(utilise la clé de la plateforme si non fournie pour les modèles hébergés\) |
| `temperature` | number | Non | Température pour la génération de réponse \(0-2\) |
| `maxTokens` | number | Non | Nombre maximum de tokens dans la réponse |
| `azureEndpoint` | string | Non | URL du point de terminaison Azure OpenAI |
| `azureApiVersion` | string | Non | Version de l'API Azure OpenAI |
| `vertexProject` | string | Non | ID du projet Google Cloud pour Vertex AI |
| `vertexLocation` | string | Non | Emplacement Google Cloud pour Vertex AI \(par défaut us-central1\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Le contenu de la réponse générée |
| `model` | chaîne | Le modèle utilisé pour la génération |
| `tokens` | objet | Informations sur l'utilisation des tokens |

## Notes

- Catégorie : `tools`
- Type : `translate`
```

--------------------------------------------------------------------------------

---[FILE: trello.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/trello.mdx

```text
---
title: Trello
description: Gérer les tableaux et cartes Trello
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="trello"
  color="#0052CC"
/>

{/* MANUAL-CONTENT-START:intro */}
[Trello](https://trello.com) est un outil de collaboration visuel qui vous aide à organiser des projets, des tâches et des flux de travail à l'aide de tableaux, de listes et de cartes.

Avec Trello dans Sim, vous pouvez :

- **Lister les tableaux et les listes** : Visualiser les tableaux auxquels vous avez accès et leurs listes associées.
- **Lister et rechercher des cartes** : Récupérer toutes les cartes d'un tableau ou filtrer par liste pour voir leur contenu et leur statut.
- **Créer des cartes** : Ajouter de nouvelles cartes à une liste Trello, y compris des descriptions, des étiquettes et des dates d'échéance.
- **Mettre à jour et déplacer des cartes** : Modifier les propriétés des cartes, déplacer des cartes entre les listes, et définir des dates d'échéance ou des étiquettes.
- **Obtenir l'activité récente** : Récupérer les actions et l'historique d'activité pour les tableaux et les cartes.
- **Commenter les cartes** : Ajouter des commentaires aux cartes pour la collaboration et le suivi.

L'intégration de Trello avec Sim permet à vos agents de gérer les tâches, les tableaux et les projets de votre équipe de manière programmatique. Automatisez les flux de travail de gestion de projet, maintenez les listes de tâches à jour, synchronisez avec d'autres outils, ou déclenchez des flux de travail intelligents en réponse aux événements Trello — le tout grâce à vos agents IA.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez avec Trello pour gérer les tableaux et les cartes. Listez les tableaux, listez les cartes, créez des cartes, mettez à jour des cartes, obtenez des actions et ajoutez des commentaires.

## Outils

### `trello_list_lists`

Lister toutes les listes d'un tableau Trello

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `boardId` | chaîne | Oui | ID du tableau dont on veut lister les listes |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `lists` | array | Tableau d'objets liste avec id, name, closed, pos et idBoard |
| `count` | number | Nombre de listes retournées |

### `trello_list_cards`

Lister toutes les cartes d'un tableau Trello

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Oui | ID du tableau dont on veut lister les cartes |
| `listId` | string | Non | Optionnel : Filtrer les cartes par ID de liste |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `cards` | array | Tableau d'objets carte avec id, name, desc, url, IDs de tableau/liste, étiquettes et date d'échéance |
| `count` | number | Nombre de cartes retournées |

### `trello_create_card`

Créer une nouvelle carte sur un tableau Trello

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Oui | ID du tableau sur lequel créer la carte |
| `listId` | string | Oui | ID de la liste dans laquelle créer la carte |
| `name` | string | Oui | Nom/titre de la carte |
| `desc` | string | Non | Description de la carte |
| `pos` | string | Non | Position de la carte \(top, bottom, ou nombre flottant positif\) |
| `due` | string | Non | Date d'échéance \(format ISO 8601\) |
| `labels` | string | Non | Liste d'IDs d'étiquettes séparés par des virgules |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `card` | object | L'objet carte créé avec id, name, desc, url et autres propriétés |

### `trello_update_card`

Mettre à jour une carte existante sur Trello

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `cardId` | chaîne | Oui | ID de la carte à mettre à jour |
| `name` | chaîne | Non | Nouveau nom/titre de la carte |
| `desc` | chaîne | Non | Nouvelle description de la carte |
| `closed` | booléen | Non | Archiver/fermer la carte \(true\) ou la rouvrir \(false\) |
| `idList` | chaîne | Non | Déplacer la carte vers une liste différente |
| `due` | chaîne | Non | Date d'échéance \(format ISO 8601\) |
| `dueComplete` | booléen | Non | Marquer la date d'échéance comme terminée |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `card` | object | L'objet carte mis à jour avec id, name, desc, url et autres propriétés |

### `trello_get_actions`

Obtenir l'activité/les actions d'un tableau ou d'une carte

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `boardId` | chaîne | Non | ID du tableau dont on veut obtenir les actions \(soit boardId soit cardId requis\) |
| `cardId` | chaîne | Non | ID de la carte dont on veut obtenir les actions \(soit boardId soit cardId requis\) |
| `filter` | chaîne | Non | Filtrer les actions par type \(ex. : "commentCard,updateCard,createCard" ou "all"\) |
| `limit` | nombre | Non | Nombre maximum d'actions à retourner \(par défaut : 50, max : 1000\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `actions` | array | Tableau d'objets action avec type, date, member et data |
| `count` | number | Nombre d'actions retournées |

### `trello_add_comment`

Ajouter un commentaire à une carte Trello

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `cardId` | string | Oui | ID de la carte à commenter |
| `text` | string | Oui | Texte du commentaire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `comment` | object | L'objet commentaire créé avec id, text, date et member creator |

## Notes

- Catégorie : `tools`
- Type : `trello`
```

--------------------------------------------------------------------------------

````
