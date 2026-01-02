---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 168
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 168 of 933)

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

---[FILE: linkedin.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/linkedin.mdx

```text
---
title: LinkedIn
description: Partagez des publications et gérez votre présence LinkedIn
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkedin"
  color="#0072B1"
/>

{/* MANUAL-CONTENT-START:intro */}
[LinkedIn](https://www.linkedin.com) est la plus grande plateforme de réseautage professionnel au monde, permettant aux utilisateurs de développer leur carrière, de se connecter avec leur réseau et de partager du contenu professionnel. LinkedIn est largement utilisé par des professionnels de tous secteurs pour le développement de leur marque personnelle, le recrutement, la recherche d'emploi et le développement commercial.

Avec LinkedIn, vous pouvez facilement partager des publications sur votre fil personnel pour interagir avec votre réseau et accéder aux informations de votre profil pour mettre en valeur vos réalisations professionnelles. L'intégration automatisée avec Sim vous permet d'exploiter les fonctionnalités de LinkedIn de manière programmatique, permettant aux agents et aux flux de travail de publier des mises à jour, de générer des rapports sur votre présence professionnelle et de maintenir votre fil d'actualité actif sans effort manuel.

Les principales fonctionnalités de LinkedIn disponibles via cette intégration comprennent :

- **Partage de publications :** Publiez automatiquement des mises à jour professionnelles, des articles ou des annonces sur votre fil personnel LinkedIn.
- **Informations de profil :** Récupérez des informations détaillées sur votre profil LinkedIn pour les surveiller ou les utiliser dans des tâches en aval au sein de vos flux de travail.

Ces capacités facilitent l'engagement de votre réseau LinkedIn et l'extension efficace de votre portée professionnelle dans le cadre de votre stratégie d'automatisation IA ou de flux de travail.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez LinkedIn dans vos flux de travail. Partagez des publications sur votre fil personnel et accédez aux informations de votre profil LinkedIn.

## Outils

### `linkedin_share_post`

Partager une publication sur votre fil personnel LinkedIn

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `text` | string | Oui | Le contenu textuel de votre publication LinkedIn |
| `visibility` | string | Non | Qui peut voir cette publication : "PUBLIC" ou "CONNECTIONS" \(par défaut : "PUBLIC"\) |
| `request` | string | Non | Pas de description |
| `output` | string | Non | Pas de description |
| `output` | string | Non | Pas de description |
| `specificContent` | string | Non | Pas de description |
| `shareCommentary` | string | Non | Pas de description |
| `visibility` | string | Non | Pas de description |
| `headers` | string | Non | Pas de description |
| `output` | string | Non | Pas de description |
| `output` | string | Non | Pas de description |
| `output` | string | Non | Pas de description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `postId` | string | ID du post créé |
| `profile` | json | Informations du profil LinkedIn |
| `error` | string | Message d'erreur si l'opération a échoué |

### `linkedin_get_profile`

Récupérer les informations de votre profil LinkedIn

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `postId` | string | ID du post créé |
| `profile` | json | Informations du profil LinkedIn |
| `error` | string | Message d'erreur si l'opération a échoué |

## Notes

- Catégorie : `tools`
- Type : `linkedin`
```

--------------------------------------------------------------------------------

---[FILE: linkup.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/linkup.mdx

```text
---
title: Linkup
description: Recherchez sur le web avec Linkup
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkup"
  color="#D6D3C7"
/>

{/* MANUAL-CONTENT-START:intro */}
[Linkup](https://linkup.so) est un puissant outil de recherche web qui s'intègre parfaitement à Sim, permettant à vos agents IA d'accéder à des informations actualisées du web avec une attribution appropriée des sources.

Linkup améliore vos agents IA en leur donnant la capacité de rechercher sur le web des informations actuelles. Lorsqu'il est intégré dans la boîte à outils de votre agent :

- **Accès aux informations en temps réel** : les agents peuvent récupérer les dernières informations du web, gardant les réponses actuelles et pertinentes.
- **Attribution des sources** : toutes les informations sont accompagnées de citations appropriées, assurant transparence et crédibilité.
- **Implémentation simple** : ajoutez Linkup à l'ensemble d'outils de vos agents avec une configuration minimale.
- **Conscience contextuelle** : les agents peuvent utiliser les informations du web tout en conservant leur personnalité et leur style conversationnel.

Pour implémenter Linkup dans votre agent, ajoutez simplement l'outil à la configuration de votre agent. Votre agent pourra alors effectuer des recherches sur le web chaque fois qu'il aura besoin de répondre à des questions nécessitant des informations actuelles.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Linkup dans le flux de travail. Peut effectuer des recherches sur le web. Nécessite une clé API.

## Outils

### `linkup_search`

Recherchez des informations sur le web en utilisant Linkup

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `q` | string | Oui | La requête de recherche |
| `depth` | string | Oui | Profondeur de recherche \(doit être soit "standard" soit "deep"\) |
| `outputType` | string | Oui | Type de sortie à retourner \(doit être "sourcedAnswer" ou "searchResults"\) |
| `apiKey` | string | Oui | Entrez votre clé API Linkup |
| `includeImages` | boolean | Non | Indique s'il faut inclure des images dans les résultats de recherche |
| `fromDate` | string | Non | Date de début pour filtrer les résultats \(format AAAA-MM-JJ\) |
| `toDate` | string | Non | Date de fin pour filtrer les résultats \(format AAAA-MM-JJ\) |
| `excludeDomains` | string | Non | Liste de noms de domaine séparés par des virgules à exclure des résultats de recherche |
| `includeDomains` | string | Non | Liste de noms de domaine séparés par des virgules pour restreindre les résultats de recherche |
| `includeInlineCitations` | boolean | Non | Ajouter des citations en ligne aux réponses \(s'applique uniquement lorsque outputType est "sourcedAnswer"\) |
| `includeSources` | boolean | Non | Inclure les sources dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `answer` | chaîne | La réponse sourcée à la requête de recherche |
| `sources` | tableau | Tableau des sources utilisées pour compiler la réponse, chacune contenant nom, url et extrait |

## Notes

- Catégorie : `tools`
- Type : `linkup`
```

--------------------------------------------------------------------------------

````
