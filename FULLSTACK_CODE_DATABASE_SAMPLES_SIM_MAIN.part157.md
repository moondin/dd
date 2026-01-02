---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 157
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 157 of 933)

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

---[FILE: exa.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/exa.mdx

```text
---
title: Exa
description: Recherchez avec Exa AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="exa"
  color="#1F40ED"
/>

{/* MANUAL-CONTENT-START:intro */}
[Exa](https://exa.ai/) est un moteur de recherche alimenté par l'IA conçu spécifiquement pour les développeurs et les chercheurs, fournissant des informations hautement pertinentes et à jour provenant du web. Il combine des capacités de recherche sémantique avancées avec une compréhension par IA pour offrir des résultats plus précis et contextuellement pertinents que les moteurs de recherche traditionnels.

Avec Exa, vous pouvez :

- **Rechercher en langage naturel** : trouver des informations en utilisant des requêtes conversationnelles et des questions
- **Obtenir des résultats précis** : recevoir des résultats de recherche hautement pertinents avec compréhension sémantique
- **Accéder à des informations à jour** : récupérer des informations actuelles provenant du web
- **Trouver du contenu similaire** : découvrir des ressources connexes basées sur la similarité du contenu
- **Extraire le contenu des pages web** : récupérer et traiter le texte intégral des pages web
- **Répondre aux questions avec citations** : poser des questions et recevoir des réponses directes avec sources à l'appui
- **Effectuer des tâches de recherche** : automatiser des flux de travail de recherche en plusieurs étapes pour collecter, synthétiser et résumer l'information

Dans Sim, l'intégration d'Exa permet à vos agents de rechercher des informations sur le web, de récupérer du contenu à partir d'URLs spécifiques, de trouver des ressources similaires, de répondre à des questions avec citations et de mener des tâches de recherche — le tout par programmation via des appels API. Cela permet à vos agents d'accéder à des informations en temps réel sur internet, améliorant leur capacité à fournir des réponses précises, actuelles et pertinentes. L'intégration est particulièrement précieuse pour les tâches de recherche, la collecte d'informations, la découverte de contenu et la réponse aux questions nécessitant des informations à jour provenant du web.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Exa dans le flux de travail. Peut effectuer des recherches, obtenir du contenu, trouver des liens similaires, répondre à une question et mener des recherches. Nécessite une clé API.

## Outils

### `exa_search`

Recherchez sur le web en utilisant Exa AI. Renvoie des résultats de recherche pertinents avec titres, URLs et extraits de texte.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | chaîne | Oui | La requête de recherche à exécuter |
| `numResults` | nombre | Non | Nombre de résultats à retourner \(par défaut : 10, max : 25\) |
| `useAutoprompt` | booléen | Non | Utiliser ou non l'autoprompt pour améliorer la requête \(par défaut : false\) |
| `type` | chaîne | Non | Type de recherche : neural, keyword, auto ou fast \(par défaut : auto\) |
| `includeDomains` | chaîne | Non | Liste de domaines à inclure dans les résultats, séparés par des virgules |
| `excludeDomains` | chaîne | Non | Liste de domaines à exclure des résultats, séparés par des virgules |
| `category` | chaîne | Non | Filtrer par catégorie : company, research paper, news, pdf, github, tweet, personal site, linkedin profile, financial report |
| `text` | booléen | Non | Inclure le contenu textuel complet dans les résultats \(par défaut : false\) |
| `highlights` | booléen | Non | Inclure des extraits surlignés dans les résultats \(par défaut : false\) |
| `summary` | booléen | Non | Inclure des résumés générés par IA dans les résultats \(par défaut : false\) |
| `livecrawl` | chaîne | Non | Mode d'exploration en direct : never \(par défaut\), fallback, always, ou preferred \(toujours essayer l'exploration en direct, revenir au cache en cas d'échec\) |
| `apiKey` | chaîne | Oui | Clé API Exa AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | tableau | Résultats de recherche avec titres, URLs et extraits de texte |

### `exa_get_contents`

Récupérer le contenu des pages web en utilisant Exa AI. Renvoie le titre, le contenu textuel et des résumés optionnels pour chaque URL.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `urls` | chaîne | Oui | Liste d'URLs séparées par des virgules pour récupérer le contenu |
| `text` | booléen | Non | Si true, renvoie le texte complet de la page avec les paramètres par défaut. Si false, désactive le retour du texte. |
| `summaryQuery` | chaîne | Non | Requête pour guider la génération du résumé |
| `subpages` | nombre | Non | Nombre de sous-pages à explorer à partir des URLs fournies |
| `subpageTarget` | chaîne | Non | Mots-clés séparés par des virgules pour cibler des sous-pages spécifiques \(par exemple, "docs,tutorial,about"\) |
| `highlights` | booléen | Non | Inclure des extraits surlignés dans les résultats \(par défaut : false\) |
| `livecrawl` | chaîne | Non | Mode d'exploration en direct : never \(par défaut\), fallback, always, ou preferred \(toujours essayer l'exploration en direct, revenir au cache en cas d'échec\) |
| `apiKey` | chaîne | Oui | Clé API Exa AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | tableau | Contenu récupéré des URLs avec titre, texte et résumés |

### `exa_find_similar_links`

Trouvez des pages web similaires à une URL donnée en utilisant Exa AI. Renvoie une liste de liens similaires avec titres et extraits de texte.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `url` | chaîne | Oui | L'URL pour laquelle trouver des liens similaires |
| `numResults` | nombre | Non | Nombre de liens similaires à retourner \(par défaut : 10, max : 25\) |
| `text` | booléen | Non | Inclure ou non le texte complet des pages similaires |
| `includeDomains` | chaîne | Non | Liste de domaines à inclure dans les résultats, séparés par des virgules |
| `excludeDomains` | chaîne | Non | Liste de domaines à exclure des résultats, séparés par des virgules |
| `excludeSourceDomain` | booléen | Non | Exclure le domaine source des résultats \(par défaut : false\) |
| `highlights` | booléen | Non | Inclure des extraits surlignés dans les résultats \(par défaut : false\) |
| `summary` | booléen | Non | Inclure des résumés générés par IA dans les résultats \(par défaut : false\) |
| `livecrawl` | chaîne | Non | Mode d'exploration en direct : never \(par défaut\), fallback, always, ou preferred \(toujours essayer l'exploration en direct, revenir au cache en cas d'échec\) |
| `apiKey` | chaîne | Oui | Clé API Exa AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `similarLinks` | tableau | Liens similaires trouvés avec titres, URLs et extraits de texte |

### `exa_answer`

Obtenez une réponse générée par IA à une question avec des citations du web en utilisant Exa AI.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | chaîne | Oui | La question à répondre |
| `text` | booléen | Non | Indique s'il faut inclure le texte complet de la réponse |
| `apiKey` | chaîne | Oui | Clé API Exa AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `answer` | chaîne | Réponse générée par IA à la question |
| `citations` | tableau | Sources et citations pour la réponse |

### `exa_research`

Effectuer des recherches complètes à l'aide de l'IA pour générer des rapports détaillés avec citations

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | chaîne | Oui | Requête ou sujet de recherche |
| `model` | chaîne | Non | Modèle de recherche : exa-research-fast, exa-research \(par défaut\), ou exa-research-pro |
| `apiKey` | chaîne | Oui | Clé API Exa AI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `research` | tableau | Résultats de recherche complets avec citations et résumés |

## Remarques

- Catégorie : `tools`
- Type : `exa`
```

--------------------------------------------------------------------------------

---[FILE: file.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/file.mdx

```text
---
title: Fichier
description: Lire et analyser plusieurs fichiers
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="file"
  color="#40916C"
/>

{/* MANUAL-CONTENT-START:intro */}
L'outil d'analyse de fichiers offre un moyen puissant d'extraire et de traiter le contenu de différents formats de fichiers, facilitant l'intégration des données documentaires dans vos flux de travail d'agent. Cet outil prend en charge plusieurs formats de fichiers et peut gérer des fichiers jusqu'à 200 Mo.

Avec l'analyseur de fichiers, vous pouvez :

- **Traiter plusieurs formats de fichiers** : extraire du texte à partir de PDF, CSV, documents Word (DOCX), fichiers texte, et plus encore
- **Gérer des fichiers volumineux** : traiter des documents jusqu'à 200 Mo
- **Analyser des fichiers à partir d'URL** : extraire directement le contenu de fichiers hébergés en ligne en fournissant leurs URL
- **Traiter plusieurs fichiers à la fois** : télécharger et analyser plusieurs fichiers en une seule opération
- **Extraire des données structurées** : conserver la mise en forme et la structure des documents originaux lorsque c'est possible

L'outil d'analyse de fichiers est particulièrement utile dans les scénarios où vos agents doivent travailler avec du contenu documentaire, comme l'analyse de rapports, l'extraction de données à partir de feuilles de calcul ou le traitement de texte provenant de diverses sources documentaires. Il simplifie le processus de mise à disposition du contenu documentaire pour vos agents, leur permettant de travailler avec des informations stockées dans des fichiers aussi facilement qu'avec une saisie de texte directe.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer un fichier dans le flux de travail. Possibilité de télécharger un fichier manuellement ou d'insérer une URL de fichier.

## Outils

### `file_parser`

Analysez un ou plusieurs fichiers téléchargés ou des fichiers à partir d'URL (texte, PDF, CSV, images, etc.)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `filePath` | chaîne | Oui | Chemin vers le(s) fichier(s). Peut être un chemin unique, une URL ou un tableau de chemins. |
| `fileType` | chaîne | Non | Type de fichier à analyser (détecté automatiquement si non spécifié) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `files` | tableau | Tableau des fichiers analysés |
| `combinedContent` | chaîne | Contenu combiné de tous les fichiers analysés |

## Remarques

- Catégorie : `tools`
- Type : `file`
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/firecrawl.mdx

```text
---
title: Firecrawl
description: Extraire, rechercher, explorer, cartographier et extraire des données web
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="firecrawl"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Firecrawl](https://firecrawl.dev/) est une API puissante de web scraping et d'extraction de contenu qui s'intègre parfaitement à Sim, permettant aux développeurs d'extraire du contenu structuré et épuré de n'importe quel site web. Cette intégration offre un moyen simple de transformer des pages web en formats de données utilisables comme Markdown et HTML tout en préservant le contenu essentiel.

Avec Firecrawl dans Sim, vous pouvez :

- **Extraire du contenu épuré** : supprimer les publicités, les éléments de navigation et autres distractions pour obtenir uniquement le contenu principal
- **Convertir en formats structurés** : transformer des pages web en Markdown, HTML ou JSON
- **Capturer les métadonnées** : extraire les métadonnées SEO, les balises Open Graph et autres informations de page
- **Gérer les sites riches en JavaScript** : traiter le contenu des applications web modernes qui reposent sur JavaScript
- **Filtrer le contenu** : se concentrer sur des parties spécifiques d'une page en utilisant des sélecteurs CSS
- **Traiter à grande échelle** : gérer des besoins de scraping à haut volume avec une API fiable
- **Rechercher sur le web** : effectuer des recherches web intelligentes et récupérer des résultats structurés
- **Explorer des sites entiers** : parcourir plusieurs pages d'un site web et agréger leur contenu

Dans Sim, l'intégration de Firecrawl permet à vos agents d'accéder et de traiter le contenu web de manière programmatique dans le cadre de leurs flux de travail. Les opérations prises en charge comprennent :

- **Scrape** : extraire du contenu structuré (Markdown, HTML, métadonnées) d'une seule page web.
- **Search** : rechercher des informations sur le web en utilisant les capacités de recherche intelligente de Firecrawl.
- **Crawl** : explorer plusieurs pages d'un site web, en retournant du contenu structuré et des métadonnées pour chaque page.

Cela permet à vos agents de recueillir des informations à partir de sites web, d'extraire des données structurées et d'utiliser ces informations pour prendre des décisions ou générer des insights — le tout sans avoir à naviguer dans les complexités de l'analyse HTML brute ou de l'automatisation du navigateur. Configurez simplement le bloc Firecrawl avec votre clé API, sélectionnez l'opération (Scrape, Search ou Crawl) et fournissez les paramètres pertinents. Vos agents peuvent immédiatement commencer à travailler avec du contenu web dans un format propre et structuré.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Firecrawl dans votre flux de travail. Extrayez des pages, recherchez sur le web, explorez des sites entiers, cartographiez les structures d'URL et extrayez des données structurées avec l'IA.

## Outils

### `firecrawl_scrape`

Extrayez du contenu structuré à partir de pages web avec une prise en charge complète des métadonnées. Convertit le contenu en markdown ou HTML tout en capturant les métadonnées SEO, les balises Open Graph et les informations de la page.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Oui | L'URL à partir de laquelle extraire le contenu |
| `scrapeOptions` | json | Non | Options pour l'extraction de contenu |
| `apiKey` | string | Oui | Clé API Firecrawl |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `markdown` | string | Contenu de la page au format markdown |
| `html` | string | Contenu HTML brut de la page |
| `metadata` | object | Métadonnées de la page incluant les informations SEO et Open Graph |

### `firecrawl_search`

Recherchez des informations sur le web en utilisant Firecrawl

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Oui | La requête de recherche à utiliser |
| `apiKey` | string | Oui | Clé API Firecrawl |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | array | Données des résultats de recherche |

### `firecrawl_crawl`

Explorez des sites web entiers et extrayez du contenu structuré de toutes les pages accessibles

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Oui | L'URL du site web à explorer |
| `limit` | number | Non | Nombre maximum de pages à explorer (par défaut : 100) |
| `onlyMainContent` | boolean | Non | Extraire uniquement le contenu principal des pages |
| `apiKey` | string | Oui | Clé API Firecrawl |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pages` | tableau | Tableau des pages explorées avec leur contenu et métadonnées |

### `firecrawl_map`

Obtenez une liste complète d'URLs de n'importe quel site web rapidement et de manière fiable. Utile pour découvrir toutes les pages d'un site sans avoir à les explorer.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Oui | L'URL de base à cartographier et à partir de laquelle découvrir des liens |
| `search` | string | Non | Filtrer les résultats par pertinence selon un terme de recherche (ex. : "blog") |
| `sitemap` | string | Non | Contrôle l'utilisation du sitemap : "skip", "include" (par défaut), ou "only" |
| `includeSubdomains` | boolean | Non | Inclure ou non les URLs des sous-domaines (par défaut : true) |
| `ignoreQueryParameters` | boolean | Non | Exclure les URLs contenant des chaînes de requête (par défaut : true) |
| `limit` | number | Non | Nombre maximum de liens à retourner (max : 100 000, par défaut : 5 000) |
| `timeout` | number | Non | Délai d'attente de la requête en millisecondes |
| `location` | json | Non | Contexte géographique pour le proxy (pays, langues) |
| `apiKey` | string | Oui | Clé API Firecrawl |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'opération de cartographie a réussi |
| `links` | array | Tableau des URLs découvertes sur le site web |

### `firecrawl_extract`

Extrayez des données structurées de pages web entières à l'aide d'instructions en langage naturel et de schémas JSON. Fonctionnalité agentique puissante pour l'extraction intelligente de données.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `urls` | json | Oui | Tableau d'URLs à partir desquelles extraire des données (supporte le format glob) |
| `prompt` | string | Non | Instructions en langage naturel pour le processus d'extraction |
| `schema` | json | Non | Schéma JSON définissant la structure des données à extraire |
| `enableWebSearch` | boolean | Non | Activer la recherche web pour trouver des informations complémentaires (par défaut : false) |
| `ignoreSitemap` | boolean | Non | Ignorer les fichiers sitemap.xml pendant l'analyse (par défaut : false) |
| `includeSubdomains` | boolean | Non | Étendre l'analyse aux sous-domaines (par défaut : true) |
| `showSources` | boolean | Non | Renvoyer les sources de données dans la réponse (par défaut : false) |
| `ignoreInvalidURLs` | boolean | Non | Ignorer les URLs invalides dans le tableau (par défaut : true) |
| `scrapeOptions` | json | Non | Options de configuration avancées pour l'extraction |
| `apiKey` | string | Oui | Clé API Firecrawl |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'opération d'extraction a réussi |
| `data` | object | Données structurées extraites selon le schéma ou l'invite |

## Remarques

- Catégorie : `tools`
- Type : `firecrawl`
```

--------------------------------------------------------------------------------

---[FILE: generic_webhook.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/generic_webhook.mdx

```text
---
title: Webhook
description: Recevez des webhooks de n'importe quel service en configurant un
  webhook personnalisé.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"
import { Image } from '@/components/ui/image'

<BlockInfoCard 
  type="generic_webhook"
  color="#10B981"
/>

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Configuration du bloc Webhook"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Aperçu

Le bloc Webhook générique vous permet de recevoir des webhooks depuis n'importe quel service externe. C'est un déclencheur flexible qui peut traiter n'importe quelle charge utile JSON, ce qui le rend idéal pour l'intégration avec des services qui n'ont pas de bloc Sim dédié.

## Utilisation de base

### Mode de transmission simple

Sans définir un format d'entrée, le webhook transmet l'intégralité du corps de la requête tel quel :

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Test webhook trigger",
    "data": {
      "key": "value"
    }
  }'
```

Accédez aux données dans les blocs en aval en utilisant :
- `<webhook1.message>` → "Test webhook trigger"
- `<webhook1.data.key>` → "value"

### Format d'entrée structuré (optionnel)

Définissez un schéma d'entrée pour obtenir des champs typés et activer des fonctionnalités avancées comme les téléchargements de fichiers :

**Configuration du format d'entrée :**

```json
[
  { "name": "message", "type": "string" },
  { "name": "priority", "type": "number" },
  { "name": "documents", "type": "files" }
]
```

**Requête Webhook :**

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Invoice submission",
    "priority": 1,
    "documents": [
      {
        "type": "file",
        "data": "data:application/pdf;base64,JVBERi0xLjQK...",
        "name": "invoice.pdf",
        "mime": "application/pdf"
      }
    ]
  }'
```

## Téléchargements de fichiers

### Formats de fichiers pris en charge

Le webhook prend en charge deux formats d'entrée de fichiers :

#### 1. Fichiers encodés en Base64
Pour télécharger directement le contenu du fichier :

```json
{
  "documents": [
    {
      "type": "file",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "name": "screenshot.png",
      "mime": "image/png"
    }
  ]
}
```

- **Taille maximale** : 20 Mo par fichier
- **Format** : URL de données standard avec encodage base64
- **Stockage** : Les fichiers sont téléchargés dans un stockage d'exécution sécurisé

#### 2. Références URL
Pour transmettre des URL de fichiers existants :

```json
{
  "documents": [
    {
      "type": "url",
      "data": "https://example.com/files/document.pdf",
      "name": "document.pdf",
      "mime": "application/pdf"
    }
  ]
}
```

### Accès aux fichiers dans les blocs en aval

Les fichiers sont traités en objets `UserFile` avec les propriétés suivantes :

```typescript
{
  id: string,          // Unique file identifier
  name: string,        // Original filename
  url: string,         // Presigned URL (valid for 5 minutes)
  size: number,        // File size in bytes
  type: string,        // MIME type
  key: string,         // Storage key
  uploadedAt: string,  // ISO timestamp
  expiresAt: string    // ISO timestamp (5 minutes)
}
```

**Accès dans les blocs :**
- `<webhook1.documents[0].url>` → URL de téléchargement
- `<webhook1.documents[0].name>` → "invoice.pdf"
- `<webhook1.documents[0].size>` → 524288
- `<webhook1.documents[0].type>` → "application/pdf"

### Exemple complet de téléchargement de fichier

```bash
# Create a base64-encoded file
echo "Hello World" | base64
# SGVsbG8gV29ybGQK

# Send webhook with file
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "subject": "Document for review",
    "attachments": [
      {
        "type": "file",
        "data": "data:text/plain;base64,SGVsbG8gV29ybGQK",
        "name": "sample.txt",
        "mime": "text/plain"
      }
    ]
  }'
```

## Authentification

### Configurer l'authentification (optionnel)

Dans la configuration du webhook :
1. Activez "Exiger l'authentification"
2. Définissez un jeton secret
3. Choisissez le type d'en-tête :
   - **En-tête personnalisé** : `X-Sim-Secret: your-token`
   - **Autorisation Bearer** : `Authorization: Bearer your-token`

### Utilisation de l'authentification

```bash
# With custom header
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret-token" \
  -d '{"message": "Authenticated request"}'

# With bearer token
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{"message": "Authenticated request"}'
```

## Bonnes pratiques

1. **Utiliser le format d'entrée pour la structure** : définissez un format d'entrée lorsque vous connaissez le schéma attendu. Cela fournit :
   - Validation de type
   - Meilleure autocomplétion dans l'éditeur
   - Capacités de téléchargement de fichiers

2. **Authentification** : activez toujours l'authentification pour les webhooks en production afin d'empêcher les accès non autorisés.

3. **Limites de taille de fichier** : gardez les fichiers en dessous de 20 Mo. Pour les fichiers plus volumineux, utilisez plutôt des références URL.

4. **Expiration des fichiers** : les fichiers téléchargés ont des URL d'expiration de 5 minutes. Traitez-les rapidement ou stockez-les ailleurs si vous en avez besoin plus longtemps.

5. **Gestion des erreurs** : le traitement des webhooks est asynchrone. Vérifiez les journaux d'exécution pour les erreurs.

6. **Tests** : utilisez le bouton "Tester le webhook" dans l'éditeur pour valider votre configuration avant le déploiement.

## Cas d'utilisation

- **Soumissions de formulaires** : recevez des données de formulaires personnalisés avec téléchargement de fichiers
- **Intégrations tierces** : connectez-vous avec des services qui envoient des webhooks (Stripe, GitHub, etc.)
- **Traitement de documents** : acceptez des documents de systèmes externes pour traitement
- **Notifications d'événements** : recevez des données d'événements de diverses sources
- **API personnalisées** : créez des points de terminaison API personnalisés pour vos applications

## Remarques

- Catégorie : `triggers`
- Type : `generic_webhook`
- **Support de fichiers** : disponible via la configuration du format d'entrée
- **Taille maximale de fichier** : 20 Mo par fichier
```

--------------------------------------------------------------------------------

````
