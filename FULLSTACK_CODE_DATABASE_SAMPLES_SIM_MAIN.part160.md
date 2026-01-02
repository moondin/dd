---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 160
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 160 of 933)

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

---[FILE: google_docs.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_docs.mdx

```text
---
title: Google Docs
description: Lisez, écrivez et créez des documents
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_docs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Docs](https://docs.google.com) est un service puissant de création et d'édition de documents basé sur le cloud qui permet aux utilisateurs de créer, modifier et collaborer sur des documents en temps réel. En tant que partie intégrante de la suite de productivité de Google, Google Docs offre une plateforme polyvalente pour les documents texte avec de solides capacités de formatage, de commentaires et de partage.

Apprenez à intégrer l'outil « Lecture » de Google Docs dans Sim pour récupérer sans effort les données de vos documents et les intégrer dans vos flux de travail. Ce tutoriel vous guide à travers la connexion à Google Docs, la configuration des lectures de données et l'utilisation de ces informations pour automatiser les processus en temps réel. Parfait pour synchroniser des données en direct avec vos agents.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/f41gy9rBHhE"
  title="Utiliser l'outil de lecture Google Docs dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Apprenez à intégrer l'outil « Mise à jour » de Google Docs dans Sim pour ajouter facilement du contenu à vos documents via vos flux de travail. Ce tutoriel vous guide à travers la connexion à Google Docs, la configuration des écritures de données et l'utilisation de ces informations pour automatiser les mises à jour de documents de manière transparente. Parfait pour maintenir une documentation dynamique en temps réel avec un minimum d'effort.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/L64ROHS2ivA"
  title="Utiliser l'outil de mise à jour Google Docs dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Apprenez à intégrer l'outil « Création » de Google Docs dans Sim pour générer facilement de nouveaux documents via vos flux de travail. Ce tutoriel vous guide à travers la connexion à Google Docs, la configuration de la création de documents et l'utilisation des données de flux de travail pour remplir automatiquement le contenu. Parfait pour rationaliser la génération de documents et améliorer la productivité.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/lWpHH4qddWk"
  title="Utiliser l'outil de création Google Docs dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Avec Google Docs, vous pouvez :

- **Créer et modifier des documents** : développer des documents texte avec des options de mise en forme complètes
- **Collaborer en temps réel** : travailler simultanément avec plusieurs utilisateurs sur le même document
- **Suivre les modifications** : consulter l'historique des révisions et restaurer les versions précédentes
- **Commenter et suggérer** : fournir des commentaires et proposer des modifications sans changer le contenu original
- **Accéder partout** : utiliser Google Docs sur différents appareils avec synchronisation automatique dans le cloud
- **Travailler hors ligne** : continuer à travailler sans connexion internet avec synchronisation des modifications lors de la reconnexion
- **Intégrer avec d'autres services** : se connecter à Google Drive, Sheets, Slides et des applications tierces

Dans Sim, l'intégration de Google Docs permet à vos agents d'interagir directement avec le contenu des documents de manière programmatique. Cela permet des scénarios d'automatisation puissants tels que la création de documents, l'extraction de contenu, l'édition collaborative et la gestion documentaire. Vos agents peuvent lire des documents existants pour extraire des informations, écrire dans des documents pour mettre à jour le contenu et créer de nouveaux documents à partir de zéro. Cette intégration comble le fossé entre vos flux de travail IA et la gestion documentaire, permettant une interaction fluide avec l'une des plateformes de documents les plus utilisées au monde. En connectant Sim avec Google Docs, vous pouvez automatiser les flux de travail documentaires, générer des rapports, extraire des informations des documents et maintenir la documentation - le tout grâce à vos agents intelligents.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Docs dans le flux de travail. Peut lire, écrire et créer des documents. Nécessite OAuth.

## Outils

### `google_docs_read`

Lire le contenu d'un document Google Docs

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `documentId` | chaîne | Oui | L'ID du document à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Contenu textuel extrait du document |
| `metadata` | json | Métadonnées du document incluant l'ID, le titre et l'URL |

### `google_docs_write`

Écrire ou mettre à jour le contenu d'un document Google Docs

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `documentId` | chaîne | Oui | L'ID du document dans lequel écrire |
| `content` | chaîne | Oui | Le contenu à écrire dans le document |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `updatedContent` | booléen | Indique si le contenu du document a été mis à jour avec succès |
| `metadata` | json | Métadonnées du document mis à jour incluant l'ID, le titre et l'URL |

### `google_docs_create`

Créer un nouveau document Google Docs

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `title` | chaîne | Oui | Le titre du document à créer |
| `content` | chaîne | Non | Le contenu du document à créer |
| `folderSelector` | chaîne | Non | Sélectionner le dossier dans lequel créer le document |
| `folderId` | chaîne | Non | L'ID du dossier dans lequel créer le document \(usage interne\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | json | Métadonnées du document créé incluant l'ID, le titre et l'URL |

## Notes

- Catégorie : `tools`
- Type : `google_docs`
```

--------------------------------------------------------------------------------

---[FILE: google_drive.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_drive.mdx

```text
---
title: Google Drive
description: Créer, téléverser et lister des fichiers
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_drive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Drive](https://drive.google.com) est le service de stockage cloud et de synchronisation de fichiers de Google qui permet aux utilisateurs de stocker des fichiers, de synchroniser des fichiers entre appareils et de partager des fichiers avec d'autres personnes. En tant que composant essentiel de l'écosystème de productivité de Google, Google Drive offre des capacités robustes de stockage, d'organisation et de collaboration.

Apprenez à intégrer l'outil Google Drive dans Sim pour extraire sans effort des informations de votre Drive à travers vos flux de travail. Ce tutoriel vous guide dans la connexion à Google Drive, la configuration de la récupération de données et l'utilisation de documents et fichiers stockés pour améliorer l'automatisation. Parfait pour synchroniser des données importantes avec vos agents en temps réel.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cRoRr4b-EAs"
  title="Utiliser l'outil Google Drive dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Avec Google Drive, vous pouvez :

- **Stocker des fichiers dans le cloud** : téléverser et accéder à vos fichiers depuis n'importe où avec un accès internet
- **Organiser le contenu** : créer des dossiers, utiliser le codage couleur et mettre en œuvre des conventions de nommage
- **Partager et collaborer** : contrôler les permissions d'accès et travailler simultanément sur des fichiers
- **Rechercher efficacement** : trouver rapidement des fichiers grâce à la puissante technologie de recherche de Google
- **Accéder depuis différents appareils** : utiliser Google Drive sur ordinateur, mobile et plateformes web
- **Intégrer avec d'autres services** : se connecter avec Google Docs, Sheets, Slides et des applications tierces

Dans Sim, l'intégration de Google Drive permet à vos agents d'interagir directement avec votre stockage cloud de manière programmatique. Cela permet des scénarios d'automatisation puissants tels que la gestion de fichiers, l'organisation de contenu et les flux de travail documentaires. Vos agents peuvent téléverser de nouveaux fichiers dans des dossiers spécifiques, télécharger des fichiers existants pour traiter leur contenu et lister le contenu des dossiers pour naviguer dans votre structure de stockage. Cette intégration comble le fossé entre vos flux de travail IA et votre système de gestion documentaire, permettant des opérations de fichiers fluides sans intervention manuelle. En connectant Sim avec Google Drive, vous pouvez automatiser les flux de travail basés sur des fichiers, gérer intelligemment les documents et incorporer des opérations de stockage cloud dans les capacités de votre agent.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Drive dans le flux de travail. Peut créer, téléverser et lister des fichiers. Nécessite OAuth.

## Outils

### `google_drive_upload`

Téléverser un fichier vers Google Drive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `fileName` | string | Oui | Le nom du fichier à télécharger |
| `file` | file | Non | Fichier binaire à télécharger \(objet UserFile\) |
| `content` | string | Non | Contenu textuel à télécharger \(utilisez ceci OU fichier, pas les deux\) |
| `mimeType` | string | Non | Le type MIME du fichier à télécharger \(détecté automatiquement à partir du fichier si non fourni\) |
| `folderSelector` | string | Non | Sélectionnez le dossier dans lequel télécharger le fichier |
| `folderId` | string | Non | L'ID du dossier dans lequel télécharger le fichier \(usage interne\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | json | Métadonnées du fichier téléchargé incluant l'ID, le nom et les liens |

### `google_drive_create_folder`

Créer un nouveau dossier dans Google Drive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Oui | Nom du dossier à créer |
| `folderSelector` | string | Non | Sélectionner le dossier parent dans lequel créer le dossier |
| `folderId` | string | Non | ID du dossier parent \(usage interne\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | json | Métadonnées du dossier créé incluant l'ID, le nom et les informations sur le parent |

### `google_drive_download`

Télécharger un fichier depuis Google Drive (exporte automatiquement les fichiers Google Workspace)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Oui | L'ID du fichier à télécharger |
| `mimeType` | string | Non | Le type MIME pour exporter les fichiers Google Workspace \(facultatif\) |
| `fileName` | string | Non | Remplacement facultatif du nom de fichier |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Fichier téléchargé stocké dans les fichiers d'exécution |

### `google_drive_list`

Lister les fichiers et dossiers dans Google Drive

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `folderSelector` | string | Non | Sélectionner le dossier à partir duquel lister les fichiers |
| `folderId` | string | Non | L'ID du dossier à partir duquel lister les fichiers (usage interne) |
| `query` | string | Non | Terme de recherche pour filtrer les fichiers par nom (ex. "budget" trouve les fichiers avec "budget" dans le nom). N'utilisez PAS la syntaxe de requête Google Drive ici - fournissez simplement un terme de recherche ordinaire. |
| `pageSize` | number | Non | Le nombre maximum de fichiers à retourner (par défaut : 100) |
| `pageToken` | string | Non | Le jeton de page à utiliser pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `files` | json | Tableau d'objets de métadonnées de fichiers du dossier spécifié |

## Notes

- Catégorie : `tools`
- Type : `google_drive`
```

--------------------------------------------------------------------------------

---[FILE: google_forms.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_forms.mdx

```text
---
title: Google Forms
description: Lire les réponses d'un formulaire Google
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_forms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Forms](https://forms.google.com) est l'outil de sondage et de formulaire en ligne de Google qui permet aux utilisateurs de créer des formulaires, de collecter des réponses et d'analyser les résultats. En tant que partie intégrante de la suite de productivité de Google, Google Forms facilite la collecte d'informations, de retours et de données des utilisateurs.

Découvrez comment intégrer l'outil Google Forms dans Sim pour lire et traiter automatiquement les réponses aux formulaires dans vos flux de travail. Ce tutoriel vous guide à travers la connexion à Google Forms, la récupération des réponses et l'utilisation des données collectées pour alimenter l'automatisation. Parfait pour synchroniser les résultats de sondages, les inscriptions ou les retours avec vos agents en temps réel.

Avec Google Forms, vous pouvez :

- **Créer des sondages et des formulaires** : Concevoir des formulaires personnalisés pour les retours, les inscriptions, les quiz et plus encore
- **Collecter des réponses automatiquement** : Recueillir des données des utilisateurs en temps réel
- **Analyser les résultats** : Consulter les réponses dans Google Forms ou les exporter vers Google Sheets pour une analyse plus approfondie
- **Collaborer facilement** : Partager des formulaires et travailler avec d'autres pour créer et réviser des questions
- **Intégrer avec d'autres services Google** : Se connecter à Google Sheets, Drive et plus encore

Dans Sim, l'intégration de Google Forms permet à vos agents d'accéder par programmation aux réponses des formulaires. Cela permet des scénarios d'automatisation puissants tels que le traitement des données d'enquête, le déclenchement de flux de travail basés sur de nouvelles soumissions et la synchronisation des résultats de formulaires avec d'autres outils. Vos agents peuvent récupérer toutes les réponses d'un formulaire, obtenir une réponse spécifique et utiliser les données pour piloter une automatisation intelligente. En connectant Sim avec Google Forms, vous pouvez automatiser la collecte de données, simplifier le traitement des retours et intégrer les réponses aux formulaires dans les capacités de votre agent.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Forms dans votre flux de travail. Fournissez un ID de formulaire pour lister les réponses, ou spécifiez un ID de réponse pour récupérer une seule réponse. Nécessite OAuth.

## Outils

### `google_forms_get_responses`

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| formId | string | Oui | L'ID du formulaire Google |
| responseId | string | Non | Si fourni, renvoie cette réponse spécifique |
| pageSize | number | Non | Nombre maximal de réponses à renvoyer (le service peut en renvoyer moins). Par défaut 5000 |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | json | Réponse ou liste de réponses |

## Remarques

- Catégorie : `tools`
- Type : `google_forms`
```

--------------------------------------------------------------------------------

---[FILE: google_groups.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_groups.mdx

```text
---
title: Google Groups
description: Gérer les groupes Google Workspace et leurs membres
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_groups"
  color="#E8F0FE"
/>

## Instructions d'utilisation

Connectez-vous à Google Workspace pour créer, mettre à jour et gérer les groupes et leurs membres à l'aide de l'API Admin SDK Directory.

## Outils

### `google_groups_list_groups`

Lister tous les groupes dans un domaine Google Workspace

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `customer` | string | Non | ID client ou "my_customer" pour le domaine de l'utilisateur authentifié |
| `domain` | string | Non | Nom de domaine pour filtrer les groupes |
| `maxResults` | number | Non | Nombre maximum de résultats à retourner (1-200) |
| `pageToken` | string | Non | Jeton pour la pagination |
| `query` | string | Non | Requête de recherche pour filtrer les groupes (ex. : "email:admin*") |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `groups` | json | Tableau d'objets de groupe |
| `nextPageToken` | string | Jeton pour récupérer la page suivante de résultats |

### `google_groups_get_group`

Obtenir les détails d'un groupe Google spécifique par email ou ID de groupe

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Oui | Adresse email du groupe ou ID unique du groupe |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `group` | json | Objet de groupe |

### `google_groups_create_group`

Créer un nouveau groupe Google dans le domaine

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `email` | chaîne | Oui | Adresse e-mail pour le nouveau groupe \(ex., team@yourdomain.com\) |
| `name` | chaîne | Oui | Nom d'affichage pour le groupe |
| `description` | chaîne | Non | Description du groupe |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `group` | json | Objet de groupe créé |

### `google_groups_update_group`

Mettre à jour un groupe Google existant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `groupKey` | chaîne | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `name` | chaîne | Non | Nouveau nom d'affichage pour le groupe |
| `description` | chaîne | Non | Nouvelle description pour le groupe |
| `email` | chaîne | Non | Nouvelle adresse e-mail pour le groupe |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `group` | json | Objet de groupe mis à jour |

### `google_groups_delete_group`

Supprimer un groupe Google

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `groupKey` | chaîne | Oui | Adresse e-mail du groupe ou identifiant unique du groupe à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de succès |

### `google_groups_list_members`

Lister tous les membres d'un groupe Google

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | chaîne | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `maxResults` | nombre | Non | Nombre maximum de résultats à retourner \(1-200\) |
| `pageToken` | chaîne | Non | Jeton pour la pagination |
| `roles` | chaîne | Non | Filtrer par rôles \(séparés par des virgules : OWNER, MANAGER, MEMBER\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `members` | json | Tableau d'objets de membre |
| `nextPageToken` | string | Jeton pour récupérer la page suivante de résultats |

### `google_groups_get_member`

Obtenir les détails d'un membre spécifique dans un groupe Google

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | chaîne | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `memberKey` | chaîne | Oui | Adresse e-mail du membre ou identifiant unique du membre |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `member` | json | Objet de membre |

### `google_groups_add_member`

Ajouter un nouveau membre à un groupe Google

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | chaîne | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `email` | chaîne | Oui | Adresse e-mail du membre à ajouter |
| `role` | chaîne | Non | Rôle pour le membre \(MEMBER, MANAGER, ou OWNER\). Par défaut MEMBER. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `member` | json | Objet de membre ajouté |

### `google_groups_remove_member`

Supprimer un membre d'un groupe Google

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `memberKey` | string | Oui | Adresse e-mail ou identifiant unique du membre à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de succès |

### `google_groups_update_member`

Mettre à jour un membre

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `memberKey` | string | Oui | Adresse e-mail du membre ou identifiant unique du membre |
| `role` | string | Oui | Nouveau rôle pour le membre \(MEMBER, MANAGER ou OWNER\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `member` | json | Objet de membre mis à jour |

### `google_groups_has_member`

Vérifier si un utilisateur est membre d'un groupe Google

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Oui | Adresse e-mail du groupe ou identifiant unique du groupe |
| `memberKey` | string | Oui | Adresse e-mail du membre ou identifiant unique du membre à vérifier |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `isMember` | boolean | Indique si l'utilisateur est membre du groupe |

## Notes

- Catégorie : `tools`
- Type : `google_groups`
```

--------------------------------------------------------------------------------

---[FILE: google_search.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_search.mdx

```text
---
title: Recherche Google
description: Rechercher sur le web
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_search"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Search](https://www.google.com) est le moteur de recherche le plus utilisé au monde, donnant accès à des milliards de pages web et de sources d'information. Google Search utilise des algorithmes sophistiqués pour fournir des résultats de recherche pertinents basés sur les requêtes des utilisateurs, ce qui en fait un outil essentiel pour trouver des informations sur internet.

Apprenez à intégrer l'outil Google Search dans Sim pour récupérer sans effort des résultats de recherche en temps réel à travers vos flux de travail. Ce tutoriel vous guide dans la connexion à Google Search, la configuration des requêtes de recherche et l'utilisation de données en direct pour améliorer l'automatisation. Parfait pour alimenter vos agents avec des informations à jour et une prise de décision plus intelligente.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/1B7hV9b5UMQ"
  title="Utiliser l'outil Google Search dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Avec Google Search, vous pouvez :

- **Trouver des informations pertinentes** : accéder à des milliards de pages web grâce aux puissants algorithmes de recherche de Google
- **Obtenir des résultats spécifiques** : utiliser des opérateurs de recherche pour affiner et cibler vos requêtes
- **Découvrir des contenus variés** : trouver du texte, des images, des vidéos, des actualités et d'autres types de contenu
- **Accéder aux graphes de connaissances** : obtenir des informations structurées sur les personnes, les lieux et les choses
- **Utiliser des fonctionnalités de recherche** : profiter d'outils de recherche spécialisés comme les calculatrices, les convertisseurs d'unités, et plus encore

Dans Sim, l'intégration de Google Search permet à vos agents de rechercher sur le web de manière programmatique et d'incorporer les résultats de recherche dans leurs flux de travail. Cela permet des scénarios d'automatisation puissants tels que la recherche, la vérification des faits, la collecte de données et la synthèse d'informations. Vos agents peuvent formuler des requêtes de recherche, récupérer des résultats pertinents et extraire des informations de ces résultats pour prendre des décisions ou générer des insights. Cette intégration comble le fossé entre vos flux de travail IA et la vaste quantité d'informations disponibles sur le web, permettant à vos agents d'accéder à des informations actualisées provenant de l'internet. En connectant Sim avec Google Search, vous pouvez créer des agents qui restent informés avec les dernières informations, vérifient les faits, mènent des recherches et fournissent aux utilisateurs du contenu web pertinent - le tout sans quitter votre flux de travail.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Search dans le flux de travail. Peut effectuer des recherches sur le web. Nécessite une clé API.

## Outils

### `google_search`

Rechercher sur le web avec l'API Custom Search

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `query` | chaîne | Oui | La requête de recherche à exécuter |
| `searchEngineId` | chaîne | Oui | Identifiant du moteur de recherche personnalisé |
| `num` | chaîne | Non | Nombre de résultats à retourner \(par défaut : 10, max : 10\) |
| `apiKey` | chaîne | Oui | Clé API Google |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | tableau | Tableau des résultats de recherche de Google |

## Remarques

- Catégorie : `tools`
- Type : `google_search`
```

--------------------------------------------------------------------------------

---[FILE: google_sheets.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/google_sheets.mdx

```text
---
title: Google Sheets
description: Lire, écrire et mettre à jour des données
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_sheets"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Sheets](https://sheets.google.com) est une application de tableur puissante basée sur le cloud qui permet aux utilisateurs de créer, modifier et collaborer sur des feuilles de calcul en temps réel. En tant que partie intégrante de la suite bureautique de Google, Google Sheets offre une plateforme polyvalente pour l'organisation, l'analyse et la visualisation des données avec de solides capacités de formatage, de formules et de partage.

Découvrez comment intégrer l'outil « Lecture » de Google Sheets dans Sim pour récupérer facilement les données de vos feuilles de calcul et les intégrer dans vos flux de travail. Ce tutoriel vous guide à travers la connexion à Google Sheets, la configuration des lectures de données et l'utilisation de ces informations pour automatiser les processus en temps réel. Parfait pour synchroniser des données en direct avec vos agents.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/xxP7MZRuq_0"
  title="Utiliser l'outil de lecture Google Sheets dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Découvrez comment utiliser l'outil « Écriture » de Google Sheets dans Sim pour envoyer automatiquement des données de vos flux de travail vers vos feuilles Google Sheets. Ce tutoriel couvre la configuration de l'intégration, la configuration des opérations d'écriture et la mise à jour transparente de vos feuilles lors de l'exécution des flux de travail. Parfait pour maintenir des enregistrements en temps réel sans saisie manuelle.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cO86qTj7qeY"
  title="Utiliser l'outil d'écriture Google Sheets dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Explorez comment tirer parti de l'outil « Mise à jour » de Google Sheets dans Sim pour modifier des entrées existantes dans vos feuilles de calcul en fonction de l'exécution du flux de travail. Ce tutoriel démontre la configuration de la logique de mise à jour, le mappage des champs de données et la synchronisation instantanée des modifications. Parfait pour maintenir vos données actuelles et cohérentes.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/95by2fL9yn4"
  title="Utiliser l'outil de mise à jour Google Sheets dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Découvrez comment utiliser l'outil "Ajouter" de Google Sheets dans Sim pour ajouter sans effort de nouvelles lignes de données à vos feuilles de calcul pendant l'exécution du flux de travail. Ce tutoriel vous guide à travers la configuration de l'intégration, la mise en place des actions d'ajout et l'assurance d'une croissance fluide des données. Parfait pour développer vos enregistrements sans effort manuel !

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/8DgNvLBCsAo"
  title="Utiliser l'outil d'ajout Google Sheets dans Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Avec Google Sheets, vous pouvez :

- **Créer et modifier des feuilles de calcul** : développer des documents basés sur des données avec des options complètes de formatage et de calcul
- **Collaborer en temps réel** : travailler simultanément avec plusieurs utilisateurs sur la même feuille de calcul
- **Analyser des données** : utiliser des formules, des fonctions et des tableaux croisés dynamiques pour traiter et comprendre vos données
- **Visualiser les informations** : créer des graphiques, des diagrammes et du formatage conditionnel pour représenter visuellement les données
- **Accéder partout** : utiliser Google Sheets sur différents appareils avec synchronisation automatique dans le cloud
- **Travailler hors ligne** : continuer à travailler sans connexion internet avec synchronisation des modifications lors de la reconnexion
- **Intégrer avec d'autres services** : se connecter à Google Drive, Forms et applications tierces

Dans Sim, l'intégration de Google Sheets permet à vos agents d'interagir directement avec les données des feuilles de calcul de manière programmatique. Cela permet des scénarios d'automatisation puissants tels que l'extraction de données, l'analyse, la création de rapports et la gestion. Vos agents peuvent lire des feuilles de calcul existantes pour extraire des informations, écrire dans des feuilles de calcul pour mettre à jour des données et créer de nouvelles feuilles de calcul à partir de zéro. Cette intégration comble le fossé entre vos flux de travail IA et la gestion des données, permettant une interaction transparente avec des données structurées. En connectant Sim à Google Sheets, vous pouvez automatiser les flux de travail de données, générer des rapports, extraire des informations à partir des données et maintenir des informations à jour - le tout grâce à vos agents intelligents. L'intégration prend en charge divers formats de données et spécifications de plages, ce qui la rend suffisamment flexible pour gérer divers besoins de gestion de données tout en maintenant la nature collaborative et accessible de Google Sheets.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Google Sheets dans le flux de travail. Peut lire, écrire, ajouter et mettre à jour des données. Nécessite OAuth.

## Outils

### `google_sheets_read`

Lire des données d'une feuille de calcul Google Sheets

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant de la feuille de calcul \(trouvé dans l'URL : docs.google.com/spreadsheets/d/\{SPREADSHEET_ID\}/edit\). |
| `range` | chaîne | Non | La plage en notation A1 à lire \(par exemple "Sheet1!A1:D10", "A1:B5"\). Par défaut, première feuille A1:Z1000 si non spécifié. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | json | Données de la feuille incluant la plage et les valeurs des cellules |
| `metadata` | json | Métadonnées de la feuille de calcul incluant l'ID et l'URL |

### `google_sheets_write`

Écrire des données dans une feuille de calcul Google Sheets

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant de la feuille de calcul |
| `range` | chaîne | Non | La plage en notation A1 où écrire \(par exemple "Sheet1!A1:D10", "A1:B5"\) |
| `values` | tableau | Oui | Les données à écrire sous forme de tableau 2D \(par exemple \[\["Nom", "Âge"\], \["Alice", 30\], \["Bob", 25\]\]\) ou tableau d'objets. |
| `valueInputOption` | chaîne | Non | Le format des données à écrire |
| `includeValuesInResponse` | booléen | Non | Indique si les valeurs écrites doivent être incluses dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `updatedRange` | string | Plage de cellules qui ont été mises à jour |
| `updatedRows` | number | Nombre de lignes mises à jour |
| `updatedColumns` | number | Nombre de colonnes mises à jour |
| `updatedCells` | number | Nombre de cellules mises à jour |
| `metadata` | json | Métadonnées de la feuille de calcul, y compris l'ID et l'URL |

### `google_sheets_update`

Mettre à jour des données dans une feuille de calcul Google Sheets

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant de la feuille de calcul à mettre à jour |
| `range` | chaîne | Non | La plage en notation A1 à mettre à jour \(par exemple "Sheet1!A1:D10", "A1:B5"\) |
| `values` | tableau | Oui | Les données à mettre à jour sous forme de tableau 2D \(par exemple \[\["Nom", "Âge"\], \["Alice", 30\]\]\) ou tableau d'objets. |
| `valueInputOption` | chaîne | Non | Le format des données à mettre à jour |
| `includeValuesInResponse` | booléen | Non | Indique si les valeurs mises à jour doivent être incluses dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `updatedRange` | string | Plage de cellules qui ont été mises à jour |
| `updatedRows` | number | Nombre de lignes mises à jour |
| `updatedColumns` | number | Nombre de colonnes mises à jour |
| `updatedCells` | number | Nombre de cellules mises à jour |
| `metadata` | json | Métadonnées de la feuille de calcul, y compris l'ID et l'URL |

### `google_sheets_append`

Ajouter des données à la fin d'une feuille de calcul Google Sheets

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `spreadsheetId` | chaîne | Oui | L'identifiant de la feuille de calcul à laquelle ajouter des données |
| `range` | chaîne | Non | La plage de notation A1 après laquelle ajouter des données \(ex. "Feuille1", "Feuille1!A:D"\) |
| `values` | tableau | Oui | Les données à ajouter sous forme de tableau 2D \(ex. \[\["Alice", 30\], \["Bob", 25\]\]\) ou tableau d'objets. |
| `valueInputOption` | chaîne | Non | Le format des données à ajouter |
| `insertDataOption` | chaîne | Non | Comment insérer les données \(OVERWRITE ou INSERT_ROWS\) |
| `includeValuesInResponse` | booléen | Non | Indique s'il faut inclure les valeurs ajoutées dans la réponse |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tableRange` | chaîne | Plage du tableau où les données ont été ajoutées |
| `updatedRange` | chaîne | Plage de cellules qui ont été mises à jour |
| `updatedRows` | nombre | Nombre de lignes mises à jour |
| `updatedColumns` | nombre | Nombre de colonnes mises à jour |
| `updatedCells` | nombre | Nombre de cellules mises à jour |
| `metadata` | json | Métadonnées de la feuille de calcul, y compris l'ID et l'URL |

## Remarques

- Catégorie : `tools`
- Type : `google_sheets`
```

--------------------------------------------------------------------------------

````
