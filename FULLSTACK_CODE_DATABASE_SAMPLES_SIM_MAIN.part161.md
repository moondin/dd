---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 161
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 161 of 933)

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

---[FILE: google_slides.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_slides.mdx

```text
---
title: Google Slides
description: Lire, écrire et créer des présentations
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_slides"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Slides](https://slides.google.com) est une application de présentation dynamique basée sur le cloud qui permet aux utilisateurs de créer, modifier, collaborer et présenter des diaporamas en temps réel. En tant que partie de la suite de productivité de Google, Google Slides offre une plateforme flexible pour concevoir des présentations attrayantes, collaborer avec d'autres et partager du contenu de manière transparente via le cloud.

Découvrez comment intégrer les outils Google Slides dans Sim pour gérer sans effort les présentations dans le cadre de vos flux de travail automatisés. Avec Sim, vous pouvez lire, écrire, créer et mettre à jour des présentations Google Slides directement via vos agents et processus automatisés, ce qui facilite la diffusion d'informations actualisées, la génération de rapports personnalisés ou la production programmatique de présentations à l'image de votre marque.

Avec Google Slides, vous pouvez :

- **Créer et modifier des présentations** : concevoir des diapositives visuellement attrayantes avec des thèmes, des mises en page et du contenu multimédia
- **Collaborer en temps réel** : travailler simultanément avec des coéquipiers, commenter, attribuer des tâches et recevoir des commentaires en direct sur les présentations
- **Présenter n'importe où** : afficher des présentations en ligne ou hors ligne, partager des liens ou publier sur le web
- **Ajouter des images et du contenu enrichi** : insérer des images, des graphiques, des diagrammes et des vidéos pour rendre vos présentations attrayantes
- **S'intégrer à d'autres services** : se connecter de manière transparente avec Google Drive, Docs, Sheets et d'autres outils tiers
- **Accéder depuis n'importe quel appareil** : utiliser Google Slides sur ordinateurs de bureau, portables, tablettes et appareils mobiles pour une flexibilité maximale

Dans Sim, l'intégration de Google Slides permet à vos agents d'interagir directement avec les fichiers de présentation de manière programmatique. Automatisez des tâches comme la lecture du contenu des diapositives, l'insertion de nouvelles diapositives ou images, le remplacement de texte dans toute une présentation, la génération de nouvelles présentations et la récupération de miniatures de diapositives. Cela vous permet de développer la création de contenu, de maintenir les présentations à jour et de les intégrer dans des flux de travail de documents automatisés. En connectant Sim avec Google Slides, vous facilitez la gestion des présentations pilotée par l'IA, ce qui permet de générer, mettre à jour ou extraire facilement des informations des présentations sans effort manuel.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Slides dans le flux de travail. Peut lire, écrire, créer des présentations, remplacer du texte, ajouter des diapositives, ajouter des images et obtenir des miniatures.

## Outils

### `google_slides_read`

Lire le contenu d'une présentation Google Slides

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Oui | L'ID de la présentation à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `slides` | json | Tableau des diapositives avec leur contenu |
| `metadata` | json | Métadonnées de la présentation incluant ID, titre et URL |

### `google_slides_write`

Écrire ou mettre à jour le contenu dans une présentation Google Slides

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Oui | L'ID de la présentation dans laquelle écrire |
| `content` | string | Oui | Le contenu à écrire dans la diapositive |
| `slideIndex` | number | Non | L'index de la diapositive dans laquelle écrire \(par défaut, première diapositive\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Indique si le contenu de la présentation a été mis à jour avec succès |
| `metadata` | json | Métadonnées de la présentation mise à jour incluant ID, titre et URL |

### `google_slides_create`

Créer une nouvelle présentation Google Slides

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Oui | Le titre de la présentation à créer |
| `content` | string | Non | Le contenu à ajouter à la première diapositive |
| `folderSelector` | string | Non | Sélectionner le dossier dans lequel créer la présentation |
| `folderId` | string | Non | L'ID du dossier dans lequel créer la présentation \(usage interne\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | json | Métadonnées de la présentation créée, y compris l'ID, le titre et l'URL |

### `google_slides_replace_all_text`

Rechercher et remplacer toutes les occurrences de texte dans une présentation Google Slides

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Oui | L'ID de la présentation |
| `findText` | string | Oui | Le texte à rechercher \(par exemple, \{\{placeholder\}\}\) |
| `replaceText` | string | Oui | Le texte de remplacement |
| `matchCase` | boolean | Non | Si la recherche doit être sensible à la casse \(par défaut : true\) |
| `pageObjectIds` | string | Non | Liste séparée par des virgules des ID d'objets de diapositive pour limiter les remplacements à des diapositives spécifiques \(laisser vide pour toutes les diapositives\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `occurrencesChanged` | number | Nombre d'occurrences de texte qui ont été remplacées |
| `metadata` | json | Métadonnées de l'opération, y compris l'ID et l'URL de la présentation |

### `google_slides_add_slide`

Ajouter une nouvelle diapositive à une présentation Google Slides avec une mise en page spécifiée

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Oui | L'ID de la présentation |
| `layout` | string | Non | La mise en page prédéfinie pour la diapositive \(BLANK, TITLE, TITLE_AND_BODY, TITLE_ONLY, SECTION_HEADER, etc.\). Par défaut : BLANK. |
| `insertionIndex` | number | Non | L'index facultatif basé sur zéro indiquant où insérer la diapositive. Si non spécifié, la diapositive est ajoutée à la fin. |
| `placeholderIdMappings` | string | Non | Tableau JSON de mappages d'espaces réservés pour attribuer des ID d'objets personnalisés aux espaces réservés. Format : \[\{"layoutPlaceholder":\{"type":"TITLE"\},"objectId":"custom_title_id"\}\] |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `slideId` | string | L'ID d'objet de la diapositive nouvellement créée |
| `metadata` | json | Métadonnées de l'opération incluant l'ID de la présentation, la mise en page et l'URL |

### `google_slides_add_image`

Insérer une image dans une diapositive spécifique d'une présentation Google Slides

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `presentationId` | string | Oui | L'ID de la présentation |
| `pageObjectId` | string | Oui | L'ID d'objet de la diapositive/page où ajouter l'image |
| `imageUrl` | string | Oui | L'URL accessible publiquement de l'image \(doit être PNG, JPEG ou GIF, max 50 Mo\) |
| `width` | number | Non | Largeur de l'image en points \(par défaut : 300\) |
| `height` | number | Non | Hauteur de l'image en points \(par défaut : 200\) |
| `positionX` | number | Non | Position X depuis le bord gauche en points \(par défaut : 100\) |
| `positionY` | number | Non | Position Y depuis le bord supérieur en points \(par défaut : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `imageId` | string | L'ID d'objet de l'image nouvellement créée |
| `metadata` | json | Métadonnées de l'opération incluant l'ID de la présentation et l'URL de l'image |

### `google_slides_get_thumbnail`

Générer une image miniature d'une diapositive spécifique dans une présentation Google Slides

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `presentationId` | chaîne | Oui | L'identifiant de la présentation |
| `pageObjectId` | chaîne | Oui | L'identifiant d'objet de la diapositive/page pour laquelle obtenir une vignette |
| `thumbnailSize` | chaîne | Non | La taille de la vignette : SMALL \(200px\), MEDIUM \(800px\), ou LARGE \(1600px\). Par défaut MEDIUM. |
| `mimeType` | chaîne | Non | Le type MIME de l'image vignette : PNG ou GIF. Par défaut PNG. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contentUrl` | chaîne | URL vers l'image vignette \(valide pendant 30 minutes\) |
| `width` | nombre | Largeur de la vignette en pixels |
| `height` | nombre | Hauteur de la vignette en pixels |
| `metadata` | json | Métadonnées de l'opération incluant l'identifiant de la présentation et l'identifiant d'objet de la page |

## Notes

- Catégorie : `tools`
- Type : `google_slides`
```

--------------------------------------------------------------------------------

---[FILE: google_vault.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_vault.mdx

```text
---
title: Google Vault
description: Rechercher, exporter et gérer les suspensions/exportations pour les
  dossiers Vault
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_vault"
  color="#E8F0FE"
/>

## Instructions d'utilisation

Connectez Google Vault pour créer des exportations, lister les exportations et gérer les suspensions au sein des dossiers.

## Outils

### `google_vault_create_matters_export`

Créer une exportation dans une affaire

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Oui | Pas de description |
| `exportName` | string | Oui | Pas de description |
| `corpus` | string | Oui | Corpus de données à exporter \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | Non | Liste d'emails d'utilisateurs séparés par des virgules pour définir la portée de l'exportation |
| `orgUnitId` | string | Non | ID de l'unité d'organisation pour définir la portée de l'exportation \(alternative aux emails\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `export` | json | Objet d'exportation créé |

### `google_vault_list_matters_export`

Lister les exportations pour une affaire

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Oui | Pas de description |
| `pageSize` | number | Non | Pas de description |
| `pageToken` | string | Non | Pas de description |
| `exportId` | string | Non | Pas de description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `exports` | json | Tableau d'objets d'exportation |
| `export` | json | Objet d'exportation unique \(lorsque exportId est fourni\) |
| `nextPageToken` | string | Jeton pour récupérer la page suivante de résultats |

### `google_vault_download_export_file`

Télécharger un fichier unique depuis une exportation Google Vault (objet GCS)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `matterId` | chaîne | Oui | Aucune description |
| `bucketName` | chaîne | Oui | Aucune description |
| `objectName` | chaîne | Oui | Aucune description |
| `fileName` | chaîne | Non | Aucune description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | fichier | Fichier d'exportation Vault téléchargé stocké dans les fichiers d'exécution |

### `google_vault_create_matters_holds`

Créer une suspension dans une affaire

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `matterId` | chaîne | Oui | Aucune description |
| `holdName` | chaîne | Oui | Aucune description |
| `corpus` | chaîne | Oui | Corpus de données à suspendre \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | chaîne | Non | Liste d'emails d'utilisateurs à suspendre, séparés par des virgules |
| `orgUnitId` | chaîne | Non | ID d'unité d'organisation à suspendre \(alternative aux comptes\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `hold` | json | Objet de suspension créé |

### `google_vault_list_matters_holds`

Lister les suspensions pour une affaire

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `matterId` | chaîne | Oui | Aucune description |
| `pageSize` | nombre | Non | Aucune description |
| `pageToken` | chaîne | Non | Aucune description |
| `holdId` | chaîne | Non | Aucune description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `holds` | json | Tableau d'objets de suspension |
| `hold` | json | Objet de suspension unique \(lorsque holdId est fourni\) |
| `nextPageToken` | string | Jeton pour récupérer la page suivante de résultats |

### `google_vault_create_matters`

Créer une nouvelle affaire dans Google Vault

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `name` | string | Oui | Aucune description |
| `description` | string | Non | Aucune description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `matter` | json | Objet d'affaire créé |

### `google_vault_list_matters`

Lister les affaires, ou obtenir une affaire spécifique si matterId est fourni

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `pageSize` | number | Non | Aucune description |
| `pageToken` | string | Non | Aucune description |
| `matterId` | string | Non | Aucune description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `matters` | json | Tableau d'objets d'affaire |
| `matter` | json | Objet d'affaire unique \(lorsque matterId est fourni\) |
| `nextPageToken` | string | Jeton pour récupérer la page suivante de résultats |

## Notes

- Catégorie : `tools`
- Type : `google_vault`
```

--------------------------------------------------------------------------------

---[FILE: grafana.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/grafana.mdx

```text
---
title: Grafana
description: Interagissez avec les tableaux de bord, les alertes et les annotations Grafana
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="grafana"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Grafana](https://grafana.com/) est une plateforme open-source de premier plan pour la surveillance, l'observabilité et la visualisation. Elle permet aux utilisateurs d'interroger, de visualiser, d'alerter et d'analyser des données provenant de diverses sources, ce qui en fait un outil essentiel pour la surveillance des infrastructures et des applications.

Avec Grafana, vous pouvez :

- **Visualiser des données** : créer et personnaliser des tableaux de bord pour afficher des métriques, des journaux et des traces en temps réel
- **Surveiller la santé et le statut** : vérifier la santé de votre instance Grafana et des sources de données connectées
- **Gérer les alertes et les annotations** : configurer des règles d'alerte, gérer les notifications et annoter les tableaux de bord avec des événements importants
- **Organiser le contenu** : organiser les tableaux de bord et les sources de données dans des dossiers pour une meilleure gestion des accès

Dans Sim, l'intégration Grafana permet à vos agents d'interagir directement avec votre instance Grafana via API, permettant des actions telles que :

- Vérifier l'état de santé du serveur Grafana, de la base de données et des sources de données
- Récupérer, lister et gérer les tableaux de bord, les règles d'alerte, les annotations, les sources de données et les dossiers
- Automatiser la surveillance de votre infrastructure en intégrant les données et les alertes Grafana dans vos automatisations de flux de travail

Ces capacités permettent aux agents Sim de surveiller les systèmes, de répondre de manière proactive aux alertes et d'aider à assurer la fiabilité et la visibilité de vos services — le tout dans le cadre de vos flux de travail automatisés.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Grafana dans les flux de travail. Gérez les tableaux de bord, les alertes, les annotations, les sources de données, les dossiers et surveillez l'état de santé.

## Outils

### `grafana_get_dashboard`

Obtenir un tableau de bord par son UID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex. : https://your-grafana.com\) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `dashboardUid` | string | Oui | L'UID du tableau de bord à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `dashboard` | json | L'objet JSON complet du tableau de bord |
| `meta` | json | Métadonnées du tableau de bord \(version, permissions, etc.\) |

### `grafana_list_dashboards`

Rechercher et lister tous les tableaux de bord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `query` | string | Non | Requête de recherche pour filtrer les tableaux de bord par titre |
| `tag` | string | Non | Filtrer par tag \(séparés par des virgules pour plusieurs tags\) |
| `folderIds` | string | Non | Filtrer par ID de dossier \(séparés par des virgules\) |
| `starred` | boolean | Non | Renvoyer uniquement les tableaux de bord favoris |
| `limit` | number | Non | Nombre maximum de tableaux de bord à renvoyer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `dashboards` | array | Liste des résultats de recherche de tableaux de bord |

### `grafana_create_dashboard`

Créer un nouveau tableau de bord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `title` | string | Oui | Le titre du nouveau tableau de bord |
| `folderUid` | string | Non | L'UID du dossier dans lequel créer le tableau de bord |
| `tags` | string | Non | Liste de tags séparés par des virgules |
| `timezone` | string | Non | Fuseau horaire du tableau de bord \(ex., browser, utc\) |
| `refresh` | string | Non | Intervalle d'actualisation automatique \(ex., 5s, 1m, 5m\) |
| `panels` | string | Non | Tableau JSON des configurations de panneaux |
| `overwrite` | boolean | Non | Écraser le tableau de bord existant avec le même titre |
| `message` | string | Non | Message de commit pour la version du tableau de bord |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | L'ID numérique du tableau de bord créé |
| `uid` | string | L'UID du tableau de bord créé |
| `url` | string | Le chemin d'URL vers le tableau de bord |
| `status` | string | Statut de l'opération \(success\) |
| `version` | number | Le numéro de version du tableau de bord |
| `slug` | string | Slug convivial pour l'URL du tableau de bord |

### `grafana_update_dashboard`

Mettre à jour un tableau de bord existant. Récupère le tableau de bord actuel et fusionne vos modifications.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Token de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex. : https://your-grafana.com\) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |
| `dashboardUid` | string | Oui | L'UID du tableau de bord à mettre à jour |
| `title` | string | Non | Nouveau titre pour le tableau de bord |
| `folderUid` | string | Non | Nouvel UID de dossier pour déplacer le tableau de bord |
| `tags` | string | Non | Liste de nouvelles étiquettes séparées par des virgules |
| `timezone` | string | Non | Fuseau horaire du tableau de bord \(ex. : browser, utc\) |
| `refresh` | string | Non | Intervalle d'actualisation automatique \(ex. : 5s, 1m, 5m\) |
| `panels` | string | Non | Tableau JSON des configurations de panneaux |
| `overwrite` | boolean | Non | Écraser même en cas de conflit de version |
| `message` | string | Non | Message de commit pour cette version |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | L'ID numérique du tableau de bord mis à jour |
| `uid` | string | L'UID du tableau de bord mis à jour |
| `url` | string | Le chemin URL vers le tableau de bord |
| `status` | string | Statut de l'opération \(success\) |
| `version` | number | Le nouveau numéro de version du tableau de bord |
| `slug` | string | Slug convivial pour URL du tableau de bord |

### `grafana_delete_dashboard`

Supprimer un tableau de bord par son UID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Token de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex. : https://your-grafana.com\) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |
| `dashboardUid` | string | Oui | L'UID du tableau de bord à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `title` | string | Le titre du tableau de bord supprimé |
| `message` | string | Message de confirmation |
| `id` | number | L'ID du tableau de bord supprimé |

### `grafana_list_alert_rules`

Lister toutes les règles d'alerte dans l'instance Grafana

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Token de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex. : https://your-grafana.com\) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `rules` | array | Liste des règles d'alerte |

### `grafana_get_alert_rule`

Obtenir une règle d'alerte spécifique par son UID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `alertRuleUid` | string | Oui | L'UID de la règle d'alerte à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `uid` | string | UID de la règle d'alerte |
| `title` | string | Titre de la règle d'alerte |
| `condition` | string | Condition d'alerte |
| `data` | json | Données de requête de la règle d'alerte |
| `folderUID` | string | UID du dossier parent |
| `ruleGroup` | string | Nom du groupe de règles |
| `noDataState` | string | État lorsqu'aucune donnée n'est retournée |
| `execErrState` | string | État en cas d'erreur d'exécution |
| `annotations` | json | Annotations d'alerte |
| `labels` | json | Étiquettes d'alerte |

### `grafana_create_alert_rule`

Créer une nouvelle règle d'alerte

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `title` | string | Oui | Le titre de la règle d'alerte |
| `folderUid` | string | Oui | L'UID du dossier dans lequel créer l'alerte |
| `ruleGroup` | string | Oui | Le nom du groupe de règles |
| `condition` | string | Oui | Le refId de la requête ou de l'expression à utiliser comme condition d'alerte |
| `data` | string | Oui | Tableau JSON d'objets de données de requête/expression |
| `forDuration` | string | Non | Durée d'attente avant déclenchement \(ex., 5m, 1h\) |
| `noDataState` | string | Non | État lorsqu'aucune donnée n'est retournée \(NoData, Alerting, OK\) |
| `execErrState` | string | Non | État en cas d'erreur d'exécution \(Alerting, OK\) |
| `annotations` | string | Non | Objet JSON d'annotations |
| `labels` | string | Non | Objet JSON d'étiquettes |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `uid` | string | L'UID de la règle d'alerte créée |
| `title` | string | Titre de la règle d'alerte |
| `folderUID` | string | UID du dossier parent |
| `ruleGroup` | string | Nom du groupe de règles |

### `grafana_update_alert_rule`

Mettre à jour une règle d'alerte existante. Récupère la règle actuelle et fusionne vos modifications.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (ex. : https://your-grafana.com) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `alertRuleUid` | string | Oui | L'UID de la règle d'alerte à mettre à jour |
| `title` | string | Non | Nouveau titre pour la règle d'alerte |
| `folderUid` | string | Non | Nouvel UID de dossier pour déplacer l'alerte |
| `ruleGroup` | string | Non | Nouveau nom du groupe de règles |
| `condition` | string | Non | Nouvelle référence de condition |
| `data` | string | Non | Nouveau tableau JSON d'objets de données de requête/expression |
| `forDuration` | string | Non | Durée d'attente avant déclenchement (ex. : 5m, 1h) |
| `noDataState` | string | Non | État en l'absence de données (NoData, Alerting, OK) |
| `execErrState` | string | Non | État en cas d'erreur d'exécution (Alerting, OK) |
| `annotations` | string | Non | Objet JSON d'annotations |
| `labels` | string | Non | Objet JSON d'étiquettes |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `uid` | string | L'UID de la règle d'alerte mise à jour |
| `title` | string | Titre de la règle d'alerte |
| `folderUID` | string | UID du dossier parent |
| `ruleGroup` | string | Nom du groupe de règles |

### `grafana_delete_alert_rule`

Supprimer une règle d'alerte par son UID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (par ex., https://your-grafana.com) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |
| `alertRuleUid` | string | Oui | L'UID de la règle d'alerte à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de confirmation |

### `grafana_list_contact_points`

Lister tous les points de contact de notification d'alerte

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (par ex., https://your-grafana.com) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `contactPoints` | array | Liste des points de contact |

### `grafana_create_annotation`

Créer une annotation sur un tableau de bord ou comme annotation globale

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton de compte de service Grafana |
| `baseUrl` | chaîne | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | chaîne | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `text` | chaîne | Oui | Le contenu textuel de l'annotation |
| `tags` | chaîne | Non | Liste d'étiquettes séparées par des virgules |
| `dashboardUid` | chaîne | Oui | UID du tableau de bord auquel ajouter l'annotation |
| `panelId` | nombre | Non | ID du panneau auquel ajouter l'annotation |
| `time` | nombre | Non | Heure de début en millisecondes d'époque \(par défaut : maintenant\) |
| `timeEnd` | nombre | Non | Heure de fin en millisecondes d'époque \(pour les annotations de plage\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | nombre | L'ID de l'annotation créée |
| `message` | chaîne | Message de confirmation |

### `grafana_list_annotations`

Interroger les annotations par plage de temps, tableau de bord ou tags

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton de compte de service Grafana |
| `baseUrl` | chaîne | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | chaîne | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `from` | nombre | Non | Heure de début en millisecondes d'époque |
| `to` | nombre | Non | Heure de fin en millisecondes d'époque |
| `dashboardUid` | chaîne | Oui | UID du tableau de bord pour interroger les annotations |
| `panelId` | nombre | Non | Filtrer par ID de panneau |
| `tags` | chaîne | Non | Liste d'étiquettes séparées par des virgules pour filtrer |
| `type` | chaîne | Non | Filtrer par type \(alerte ou annotation\) |
| `limit` | nombre | Non | Nombre maximum d'annotations à retourner |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `annotations` | array | Liste des annotations |

### `grafana_update_annotation`

Mettre à jour une annotation existante

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (ex. : https://your-grafana.com) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `annotationId` | number | Oui | L'ID de l'annotation à mettre à jour |
| `text` | string | Oui | Nouveau contenu textuel pour l'annotation |
| `tags` | string | Non | Liste de nouvelles balises séparées par des virgules |
| `time` | number | Non | Nouvelle heure de début en millisecondes d'époque |
| `timeEnd` | number | Non | Nouvelle heure de fin en millisecondes d'époque |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | L'ID de l'annotation mise à jour |
| `message` | string | Message de confirmation |

### `grafana_delete_annotation`

Supprimer une annotation par son ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (ex. : https://your-grafana.com) |
| `organizationId` | string | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `annotationId` | number | Oui | L'ID de l'annotation à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de confirmation |

### `grafana_list_data_sources`

Lister toutes les sources de données configurées dans Grafana

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (ex. : https://your-grafana.com) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `dataSources` | array | Liste des sources de données |

### `grafana_get_data_source`

Obtenir une source de données par son ID ou UID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Oui | Jeton de compte de service Grafana |
| `baseUrl` | string | Oui | URL de l'instance Grafana (ex. : https://your-grafana.com) |
| `organizationId` | string | Non | ID d'organisation pour les instances Grafana multi-organisations |
| `dataSourceId` | string | Oui | L'ID ou l'UID de la source de données à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | ID de la source de données |
| `uid` | string | UID de la source de données |
| `name` | string | Nom de la source de données |
| `type` | string | Type de source de données |
| `url` | string | URL de connexion de la source de données |
| `database` | string | Nom de la base de données (si applicable) |
| `isDefault` | boolean | Indique si c'est la source de données par défaut |
| `jsonData` | json | Configuration supplémentaire de la source de données |

### `grafana_list_folders`

Lister tous les dossiers dans Grafana

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton de compte de service Grafana |
| `baseUrl` | chaîne | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | chaîne | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `limit` | nombre | Non | Nombre maximum de dossiers à retourner |
| `page` | nombre | Non | Numéro de page pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `folders` | tableau | Liste des dossiers |

### `grafana_create_folder`

Créer un nouveau dossier dans Grafana

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton de compte de service Grafana |
| `baseUrl` | chaîne | Oui | URL de l'instance Grafana \(ex., https://your-grafana.com\) |
| `organizationId` | chaîne | Non | ID de l'organisation pour les instances Grafana multi-organisations |
| `title` | chaîne | Oui | Le titre du nouveau dossier |
| `uid` | chaîne | Non | UID optionnel pour le dossier \(généré automatiquement si non fourni\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | L'identifiant numérique du dossier créé |
| `uid` | string | L'UID du dossier créé |
| `title` | string | Le titre du dossier créé |
| `url` | string | Le chemin URL vers le dossier |
| `hasAcl` | boolean | Si le dossier possède des permissions ACL personnalisées |
| `canSave` | boolean | Si l'utilisateur actuel peut enregistrer le dossier |
| `canEdit` | boolean | Si l'utilisateur actuel peut modifier le dossier |
| `canAdmin` | boolean | Si l'utilisateur actuel a des droits d'administrateur sur le dossier |
| `canDelete` | boolean | Si l'utilisateur actuel peut supprimer le dossier |
| `createdBy` | string | Nom d'utilisateur de la personne qui a créé le dossier |
| `created` | string | Horodatage de la création du dossier |
| `updatedBy` | string | Nom d'utilisateur de la personne qui a dernièrement mis à jour le dossier |
| `updated` | string | Horodatage de la dernière mise à jour du dossier |
| `version` | number | Numéro de version du dossier |

## Notes

- Catégorie : `tools`
- Type : `grafana`
```

--------------------------------------------------------------------------------

````
