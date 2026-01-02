---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 162
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 162 of 933)

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

---[FILE: hubspot.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/hubspot.mdx

```text
---
title: HubSpot
description: Interagissez avec le CRM HubSpot ou déclenchez des workflows à
  partir d'événements HubSpot
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hubspot"
  color="#FF7A59"
/>

{/* MANUAL-CONTENT-START:intro */}
[HubSpot](https://www.hubspot.com) est une plateforme CRM complète qui fournit une suite complète d'outils de marketing, de vente et de service client pour aider les entreprises à mieux se développer. Grâce à ses puissantes capacités d'automatisation et à son API étendue, HubSpot est devenu l'une des principales plateformes CRM au monde, servant des entreprises de toutes tailles dans tous les secteurs.

Le CRM HubSpot offre une solution complète pour gérer les relations clients, du premier contact jusqu'au succès client à long terme. La plateforme combine la gestion des contacts, le suivi des affaires, l'automatisation du marketing et les outils de service client dans un système unifié qui aide les équipes à rester alignées et concentrées sur la réussite des clients.

Les principales fonctionnalités du CRM HubSpot comprennent :

- Gestion des contacts et des entreprises : base de données complète pour stocker et organiser les informations sur les clients et prospects
- Pipeline de vente : pipeline de vente visuel pour suivre les opportunités à travers des étapes personnalisables
- Événements marketing : suivi et gestion des campagnes et événements marketing avec attribution détaillée
- Gestion des tickets : système de tickets de support client pour suivre et résoudre les problèmes des clients
- Devis et articles : création et gestion de devis de vente avec des lignes de produits détaillées
- Gestion des utilisateurs et des équipes : organisation des équipes, attribution des responsabilités et suivi de l'activité des utilisateurs sur la plateforme

Dans Sim, l'intégration HubSpot permet à vos agents IA d'interagir de manière transparente avec vos données CRM et d'automatiser des processus commerciaux clés. Cela crée de puissantes opportunités pour la qualification intelligente des prospects, l'enrichissement automatisé des contacts, la gestion des affaires, l'automatisation du support client et la synchronisation des données à travers votre stack technologique. L'intégration permet aux agents de créer, récupérer, mettre à jour et rechercher dans tous les objets HubSpot principaux, permettant des flux de travail sophistiqués qui peuvent répondre aux événements CRM, maintenir la qualité des données et garantir que votre équipe dispose des informations client les plus à jour. En connectant Sim avec HubSpot, vous pouvez créer des agents IA qui qualifient automatiquement les prospects, acheminent les tickets de support, mettent à jour les étapes des affaires en fonction des interactions client, génèrent des devis et maintiennent vos données CRM synchronisées avec d'autres systèmes d'entreprise—augmentant ainsi la productivité de l'équipe et améliorant les expériences client.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez HubSpot dans votre flux de travail. Gérez les contacts, les entreprises, les affaires, les tickets et autres objets CRM avec de puissantes capacités d'automatisation. Peut être utilisé en mode déclencheur pour lancer des flux de travail lorsque des contacts sont créés, supprimés ou mis à jour.

## Outils

### `hubspot_get_users`

Récupérer tous les utilisateurs du compte HubSpot

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `limit` | string | Non | Nombre de résultats à retourner \(par défaut : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Tableau d'objets utilisateur HubSpot |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_list_contacts`

Récupérer tous les contacts du compte HubSpot avec prise en charge de la pagination

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `limit` | chaîne | Non | Nombre maximum de résultats par page \(max 100, par défaut 100\) |
| `after` | chaîne | Non | Curseur de pagination pour la page suivante de résultats |
| `properties` | chaîne | Non | Liste séparée par des virgules des propriétés à renvoyer \(par ex., "email,firstname,lastname"\) |
| `associations` | chaîne | Non | Liste séparée par des virgules des types d'objets pour lesquels récupérer les identifiants associés |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | array | Tableau d'objets contact HubSpot |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_get_contact`

Récupérer un seul contact par ID ou email depuis HubSpot

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `contactId` | chaîne | Oui | L'ID ou l'email du contact à récupérer |
| `idProperty` | chaîne | Non | Propriété à utiliser comme identifiant unique \(par ex., "email"\). Si non spécifié, utilise l'ID de l'enregistrement |
| `properties` | chaîne | Non | Liste séparée par des virgules des propriétés à renvoyer |
| `associations` | chaîne | Non | Liste séparée par des virgules des types d'objets pour lesquels récupérer les identifiants associés |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contact` | object | Objet contact HubSpot avec propriétés |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_create_contact`

Créer un nouveau contact dans HubSpot. Nécessite au moins l'un des éléments suivants : email, prénom ou nom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `properties` | objet | Oui | Propriétés du contact sous forme d'objet JSON. Doit inclure au moins l'un des éléments suivants : email, prénom ou nom |
| `associations` | tableau | Non | Tableau d'associations à créer avec le contact \(par exemple, entreprises, affaires\). Chaque objet doit avoir "to" \(avec "id"\) et "types" \(avec "associationCategory" et "associationTypeId"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contact` | object | Objet contact HubSpot créé |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_update_contact`

Mettre à jour un contact existant dans HubSpot par ID ou email

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `contactId` | chaîne | Oui | L'ID ou l'email du contact à mettre à jour |
| `idProperty` | chaîne | Non | Propriété à utiliser comme identifiant unique \(par exemple, "email"\). Si non spécifié, utilise l'ID de l'enregistrement |
| `properties` | objet | Oui | Propriétés du contact à mettre à jour sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contact` | object | Objet contact HubSpot mis à jour |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_search_contacts`

Rechercher des contacts dans HubSpot en utilisant des filtres, des tris et des requêtes

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `filterGroups` | array | Non | Tableau de groupes de filtres. Chaque groupe contient des filtres avec propertyName, operator et value |
| `sorts` | array | Non | Tableau d'objets de tri avec propertyName et direction ("ASCENDING" ou "DESCENDING") |
| `query` | string | Non | Chaîne de requête de recherche |
| `properties` | array | Non | Tableau des noms de propriétés à retourner |
| `limit` | number | Non | Nombre maximum de résultats à retourner (max 100) |
| `after` | string | Non | Curseur de pagination pour la page suivante |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | array | Tableau d'objets contact HubSpot correspondants |
| `total` | number | Nombre total de contacts correspondants |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_list_companies`

Récupérer toutes les entreprises du compte HubSpot avec prise en charge de la pagination

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `limit` | string | Non | Nombre maximum de résultats par page (max 100, par défaut 100) |
| `after` | string | Non | Curseur de pagination pour la page suivante de résultats |
| `properties` | string | Non | Liste séparée par des virgules des propriétés à retourner |
| `associations` | string | Non | Liste séparée par des virgules des types d'objets pour lesquels récupérer les ID associés |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `companies` | array | Tableau d'objets entreprise HubSpot |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_get_company`

Récupérer une seule entreprise par ID ou domaine depuis HubSpot

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Oui | L'ID ou le domaine de l'entreprise à récupérer |
| `idProperty` | string | Non | Propriété à utiliser comme identifiant unique \(ex. : "domain"\). Si non spécifié, utilise l'ID de l'enregistrement |
| `properties` | string | Non | Liste de propriétés à retourner, séparées par des virgules |
| `associations` | string | Non | Liste de types d'objets pour lesquels récupérer les ID associés, séparés par des virgules |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `company` | object | Objet entreprise HubSpot avec propriétés |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_create_company`

Créer une nouvelle entreprise dans HubSpot

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `properties` | object | Oui | Propriétés de l'entreprise sous forme d'objet JSON \(ex. : nom, domaine, ville, secteur d'activité\) |
| `associations` | array | Non | Tableau d'associations à créer avec l'entreprise |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `company` | object | Objet entreprise HubSpot créé |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_update_company`

Mettre à jour une entreprise existante dans HubSpot par ID ou domaine

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Oui | L'ID ou le domaine de l'entreprise à mettre à jour |
| `idProperty` | string | Non | Propriété à utiliser comme identifiant unique \(ex. : "domain"\). Si non spécifié, utilise l'ID de l'enregistrement |
| `properties` | object | Oui | Propriétés de l'entreprise à mettre à jour sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `company` | object | Objet entreprise HubSpot mis à jour |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_search_companies`

Rechercher des entreprises dans HubSpot en utilisant des filtres, des tris et des requêtes

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | Non | Tableau de groupes de filtres. Chaque groupe contient des filtres avec propertyName, operator et value |
| `sorts` | array | Non | Tableau d'objets de tri avec propertyName et direction ("ASCENDING" ou "DESCENDING") |
| `query` | string | Non | Chaîne de requête de recherche |
| `properties` | array | Non | Tableau de noms de propriétés à retourner |
| `limit` | number | Non | Nombre maximum de résultats à retourner (max 100) |
| `after` | string | Non | Curseur de pagination pour la page suivante |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `companies` | array | Tableau d'objets entreprise HubSpot correspondants |
| `total` | number | Nombre total d'entreprises correspondantes |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

### `hubspot_list_deals`

Récupérer toutes les affaires du compte HubSpot avec prise en charge de la pagination

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Non | Nombre maximum de résultats par page (max 100, par défaut 100) |
| `after` | string | Non | Curseur de pagination pour la page suivante de résultats |
| `properties` | string | Non | Liste de propriétés à retourner, séparées par des virgules |
| `associations` | string | Non | Liste de types d'objets séparés par des virgules pour lesquels récupérer les ID associés |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deals` | array | Tableau d'objets affaire HubSpot |
| `paging` | object | Informations de pagination |
| `metadata` | object | Métadonnées de l'opération |
| `success` | boolean | Statut de réussite de l'opération |

## Notes

- Catégorie : `tools`
- Type : `hubspot`
```

--------------------------------------------------------------------------------

---[FILE: huggingface.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/huggingface.mdx

```text
---
title: Hugging Face
description: Utiliser l'API d'inférence Hugging Face
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="huggingface"
  color="#0B0F19"
/>

{/* MANUAL-CONTENT-START:intro */}
[HuggingFace](https://huggingface.co/) est une plateforme d'IA de premier plan qui donne accès à des milliers de modèles d'apprentissage automatique préentraînés et à de puissantes capacités d'inférence. Avec son vaste hub de modèles et son API robuste, HuggingFace offre des outils complets pour les applications d'IA tant en recherche qu'en production.
Avec HuggingFace, vous pouvez :

Accéder à des modèles préentraînés : utiliser des modèles pour la génération de texte, la traduction, le traitement d'images, et plus encore
Générer des compléments d'IA : créer du contenu en utilisant des modèles de langage de pointe via l'API d'inférence
Traitement du langage naturel : traiter et analyser du texte avec des modèles de NLP spécialisés
Déployer à grande échelle : héberger et servir des modèles pour des applications en production
Personnaliser des modèles : affiner des modèles existants pour des cas d'utilisation spécifiques

Dans Sim, l'intégration HuggingFace permet à vos agents de générer programmatiquement des compléments en utilisant l'API d'inférence HuggingFace. Cela permet des scénarios d'automatisation puissants tels que la génération de contenu, l'analyse de texte, la complétion de code et l'écriture créative. Vos agents peuvent générer des compléments avec des invites en langage naturel, accéder à des modèles spécialisés pour différentes tâches et intégrer du contenu généré par l'IA dans les flux de travail. Cette intégration comble le fossé entre vos flux de travail d'IA et les capacités d'apprentissage automatique, permettant une automatisation transparente alimentée par l'IA avec l'une des plateformes d'apprentissage automatique les plus complètes au monde.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer Hugging Face dans le flux de travail. Peut générer des compléments en utilisant l'API Inference de Hugging Face. Nécessite une clé API.

## Outils

### `huggingface_chat`

Générer des compléments en utilisant l'API d'inférence Hugging Face

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `systemPrompt` | chaîne | Non | Invite système pour guider le comportement du modèle |
| `content` | chaîne | Oui | Le contenu du message utilisateur à envoyer au modèle |
| `provider` | chaîne | Oui | Le fournisseur à utiliser pour la requête API \(par ex., novita, cerebras, etc.\) |
| `model` | chaîne | Oui | Modèle à utiliser pour les compléments de chat \(par ex., deepseek/deepseek-v3-0324\) |
| `maxTokens` | nombre | Non | Nombre maximum de tokens à générer |
| `temperature` | nombre | Non | Température d'échantillonnage \(0-2\). Des valeurs plus élevées rendent la sortie plus aléatoire |
| `apiKey` | chaîne | Oui | Token API Hugging Face |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Résultats du complément de chat |

## Remarques

- Catégorie : `tools`
- Type : `huggingface`
```

--------------------------------------------------------------------------------

---[FILE: hunter.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/hunter.mdx

```text
---
title: Hunter io
description: Trouver et vérifier des adresses e-mail professionnelles
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hunter"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Hunter.io](https://hunter.io/) est une plateforme de premier plan pour trouver et vérifier des adresses e-mail professionnelles, découvrir des entreprises et enrichir des données de contact. Hunter.io fournit des API robustes pour la recherche de domaines, la recherche d'e-mails, la vérification et la découverte d'entreprises, ce qui en fait un outil essentiel pour les ventes, le recrutement et le développement commercial.

Avec Hunter.io, vous pouvez :

- **Trouver des adresses e-mail par domaine :** rechercher toutes les adresses e-mail publiquement disponibles associées à un domaine d'entreprise spécifique.
- **Découvrir des entreprises :** utiliser des filtres avancés et une recherche alimentée par l'IA pour trouver des entreprises correspondant à vos critères.
- **Trouver une adresse e-mail spécifique :** localiser l'adresse e-mail la plus probable pour une personne dans une entreprise en utilisant son nom et le domaine.
- **Vérifier des adresses e-mail :** contrôler la délivrabilité et la validité de n'importe quelle adresse e-mail.
- **Enrichir les données d'entreprise :** récupérer des informations détaillées sur les entreprises, y compris la taille, les technologies utilisées, et plus encore.

Dans Sim, l'intégration Hunter.io permet à vos agents de rechercher et de vérifier programmatiquement des adresses e-mail, de découvrir des entreprises et d'enrichir les données de contact en utilisant l'API de Hunter.io. Cela vous permet d'automatiser la génération de leads, l'enrichissement des contacts et la vérification des e-mails directement dans vos flux de travail. Vos agents peuvent exploiter les outils de Hunter.io pour rationaliser la prospection, maintenir votre CRM à jour et alimenter des scénarios d'automatisation intelligents pour les ventes, le recrutement, et plus encore.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Hunter dans le flux de travail. Peut rechercher des domaines, trouver des adresses e-mail, vérifier des adresses e-mail, découvrir des entreprises, trouver des entreprises et compter des adresses e-mail. Nécessite une clé API.

## Outils

### `hunter_discover`

Renvoie les entreprises correspondant à un ensemble de critères en utilisant la recherche alimentée par l'IA de Hunter.io.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | chaîne | Non | Requête de recherche en langage naturel pour les entreprises |
| `domain` | chaîne | Non | Noms de domaine d'entreprise pour filtrer |
| `headcount` | chaîne | Non | Filtre de taille d'entreprise \(ex. : "1-10", "11-50"\) |
| `company_type` | chaîne | Non | Type d'organisation |
| `technology` | chaîne | Non | Technologie utilisée par les entreprises |
| `apiKey` | chaîne | Oui | Clé API Hunter.io |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | tableau | Tableau d'entreprises correspondant aux critères de recherche, chacune contenant domaine, nom, effectif, technologies et nombre_d'emails |

### `hunter_domain_search`

Renvoie toutes les adresses e-mail trouvées à partir d'un nom de domaine donné, avec leurs sources.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `domain` | chaîne | Oui | Nom de domaine pour rechercher des adresses e-mail |
| `limit` | nombre | Non | Nombre maximum d'adresses e-mail à retourner \(par défaut : 10\) |
| `offset` | nombre | Non | Nombre d'adresses e-mail à ignorer |
| `type` | chaîne | Non | Filtre pour les e-mails personnels ou génériques |
| `seniority` | chaîne | Non | Filtre par niveau d'ancienneté : junior, senior ou exécutif |
| `department` | chaîne | Non | Filtre par départements spécifiques \(ex. : ventes, marketing\) |
| `apiKey` | chaîne | Oui | Clé API Hunter.io |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `domain` | chaîne | Le nom de domaine recherché |
| `disposable` | booléen | Si le domaine accepte les adresses e-mail jetables |
| `webmail` | booléen | Si le domaine est un fournisseur de webmail |
| `accept_all` | booléen | Si le domaine accepte toutes les adresses e-mail |
| `pattern` | chaîne | Le modèle d'e-mail utilisé par l'organisation |
| `organization` | chaîne | Le nom de l'organisation |
| `description` | chaîne | Description de l'organisation |
| `industry` | chaîne | Secteur d'activité de l'organisation |
| `twitter` | chaîne | Profil Twitter de l'organisation |
| `facebook` | chaîne | Profil Facebook de l'organisation |
| `linkedin` | chaîne | Profil LinkedIn de l'organisation |
| `instagram` | chaîne | Profil Instagram de l'organisation |
| `youtube` | chaîne | Chaîne YouTube de l'organisation |
| `technologies` | tableau | Tableau des technologies utilisées par l'organisation |
| `country` | chaîne | Pays où se trouve l'organisation |
| `state` | chaîne | État où se trouve l'organisation |
| `city` | chaîne | Ville où se trouve l'organisation |
| `postal_code` | chaîne | Code postal de l'organisation |
| `street` | chaîne | Adresse de l'organisation |
| `emails` | tableau | Tableau des adresses e-mail trouvées pour le domaine, chacune contenant valeur, type, confiance, sources et détails de la personne |

### `hunter_email_finder`

Trouve l'adresse e-mail la plus probable pour une personne en fonction de son nom et du domaine de l'entreprise.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `domain` | chaîne | Oui | Nom de domaine de l'entreprise |
| `first_name` | chaîne | Oui | Prénom de la personne |
| `last_name` | chaîne | Oui | Nom de famille de la personne |
| `company` | chaîne | Non | Nom de l'entreprise |
| `apiKey` | chaîne | Oui | Clé API Hunter.io |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `email` | chaîne | L'adresse e-mail trouvée |
| `score` | nombre | Score de confiance pour l'adresse e-mail trouvée |
| `sources` | tableau | Tableau des sources où l'e-mail a été trouvé, chacune contenant domain, uri, extracted_on, last_seen_on et still_on_page |
| `verification` | objet | Informations de vérification contenant date et statut |

### `hunter_email_verifier`

Vérifie la délivrabilité d'une adresse e-mail et fournit un statut de vérification détaillé.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | L'adresse e-mail à vérifier |
| `apiKey` | chaîne | Oui | Clé API Hunter.io |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `result` | chaîne | Résultat de délivrabilité : deliverable, undeliverable ou risky |
| `score` | nombre | Score de confiance pour le résultat de vérification |
| `email` | chaîne | L'adresse e-mail vérifiée |
| `regexp` | booléen | Si l'e-mail suit un modèle regex valide |
| `gibberish` | booléen | Si l'e-mail semble être du charabia |
| `disposable` | booléen | Si l'e-mail provient d'un fournisseur d'e-mail jetable |
| `webmail` | booléen | Si l'e-mail provient d'un fournisseur de webmail |
| `mx_records` | booléen | Si des enregistrements MX existent pour le domaine |
| `smtp_server` | booléen | Si le serveur SMTP est accessible |
| `smtp_check` | booléen | Si la vérification SMTP a réussi |
| `accept_all` | booléen | Si le domaine accepte toutes les adresses e-mail |
| `block` | booléen | Si l'e-mail est bloqué |
| `status` | chaîne | Statut de vérification : valid, invalid, accept_all, webmail, disposable ou unknown |
| `sources` | tableau | Tableau des sources où l'e-mail a été trouvé |

### `hunter_companies_find`

Enrichit les données d'entreprise en utilisant le nom de domaine.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Oui | Domaine pour lequel trouver les données d'entreprise |
| `apiKey` | chaîne | Oui | Clé API Hunter.io |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `person` | objet | Informations sur la personne \(non défini pour l'outil companies_find\) |
| `company` | objet | Informations sur l'entreprise incluant nom, domaine, secteur, taille, pays, linkedin et twitter |

### `hunter_email_count`

Renvoie le nombre total d'adresses e-mail trouvées pour un domaine ou une entreprise.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | chaîne | Non | Domaine pour lequel compter les e-mails \(requis si l'entreprise n'est pas fournie\) |
| `company` | chaîne | Non | Nom de l'entreprise pour laquelle compter les e-mails \(requis si le domaine n'est pas fourni\) |
| `type` | chaîne | Non | Filtre pour les e-mails personnels ou génériques uniquement |
| `apiKey` | chaîne | Oui | Clé API Hunter.io |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `total` | nombre | Nombre total d'adresses e-mail trouvées |
| `personal_emails` | nombre | Nombre d'adresses e-mail personnelles trouvées |
| `generic_emails` | nombre | Nombre d'adresses e-mail génériques trouvées |
| `department` | objet | Répartition des adresses e-mail par département \(direction, informatique, finance, management, ventes, juridique, support, RH, marketing, communication\) |
| `seniority` | objet | Répartition des adresses e-mail par niveau d'ancienneté \(junior, senior, direction\) |

## Notes

- Catégorie : `tools`
- Type : `hunter`
```

--------------------------------------------------------------------------------

---[FILE: image_generator.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/image_generator.mdx

```text
---
title: Générateur d'images
description: Générer des images
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="image_generator"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DALL-E](https://openai.com/dall-e-3) est le système d'IA avancé d'OpenAI conçu pour générer des images et des œuvres d'art réalistes à partir de descriptions en langage naturel. En tant que modèle de génération d'images à la pointe de la technologie, DALL-E peut créer des visuels détaillés et créatifs basés sur des instructions textuelles, permettant aux utilisateurs de transformer leurs idées en contenu visuel sans nécessiter de compétences artistiques.

Avec DALL-E, vous pouvez :

- **Générer des images réalistes** : créer des visuels photoréalistes à partir de descriptions textuelles
- **Concevoir de l'art conceptuel** : transformer des idées abstraites en représentations visuelles
- **Produire des variations** : générer plusieurs interprétations d'une même instruction
- **Contrôler le style artistique** : spécifier des styles artistiques, des médiums et des esthétiques visuelles
- **Créer des scènes détaillées** : décrire des scènes complexes avec plusieurs éléments et relations
- **Visualiser des produits** : générer des maquettes de produits et des concepts de design
- **Illustrer des idées** : transformer des concepts écrits en illustrations visuelles

Dans Sim, l'intégration de DALL-E permet à vos agents de générer des images de manière programmatique dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation puissants tels que la création de contenu, la conception visuelle et l'idéation créative. Vos agents peuvent formuler des instructions détaillées, générer les images correspondantes et incorporer ces visuels dans leurs résultats ou processus en aval. Cette intégration comble le fossé entre le traitement du langage naturel et la création de contenu visuel, permettant à vos agents de communiquer non seulement par le texte mais aussi par des images convaincantes. En connectant Sim avec DALL-E, vous pouvez créer des agents qui produisent du contenu visuel à la demande, illustrent des concepts, génèrent des ressources de design et améliorent les expériences utilisateur avec des éléments visuels riches - le tout sans nécessiter d'intervention humaine dans le processus créatif.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez le générateur d'images dans le flux de travail. Peut générer des images en utilisant DALL-E 3 ou GPT Image. Nécessite une clé API.

## Outils

### `openai_image`

Générer des images avec OpenAI

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `model` | chaîne | Oui | Le modèle à utiliser \(gpt-image-1 ou dall-e-3\) |
| `prompt` | chaîne | Oui | Une description textuelle de l'image souhaitée |
| `size` | chaîne | Oui | La taille des images générées \(1024x1024, 1024x1792 ou 1792x1024\) |
| `quality` | chaîne | Non | La qualité de l'image \(standard ou hd\) |
| `style` | chaîne | Non | Le style de l'image \(vivid ou natural\) |
| `background` | chaîne | Non | La couleur d'arrière-plan, uniquement pour gpt-image-1 |
| `n` | nombre | Non | Le nombre d'images à générer \(1-10\) |
| `apiKey` | chaîne | Oui | Votre clé API OpenAI |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données d'image générées |

## Notes

- Catégorie : `tools`
- Type : `image_generator`
```

--------------------------------------------------------------------------------

````
