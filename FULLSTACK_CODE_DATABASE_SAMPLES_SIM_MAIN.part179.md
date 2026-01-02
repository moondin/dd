---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 179
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 179 of 933)

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

---[FILE: servicenow.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/servicenow.mdx

```text
---
title: ServiceNow
description: Créer, lire, mettre à jour et supprimer des enregistrements ServiceNow
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="servicenow"
  color="#032D42"
/>

{/* MANUAL-CONTENT-START:intro */}
[ServiceNow](https://www.servicenow.com/) est une plateforme cloud puissante conçue pour rationaliser et automatiser la gestion des services informatiques (ITSM), les workflows et les processus métier au sein de votre organisation. ServiceNow vous permet de gérer les incidents, les demandes, les tâches, les utilisateurs et bien plus encore grâce à son API étendue.

Avec ServiceNow, vous pouvez :

- **Automatiser les workflows informatiques** : créer, lire, mettre à jour et supprimer des enregistrements dans n'importe quelle table ServiceNow, tels que les incidents, les tâches, les demandes de changement et les utilisateurs.
- **Intégrer les systèmes** : connecter ServiceNow avec vos autres outils et processus pour une automatisation transparente.
- **Maintenir une source unique de vérité** : garder toutes vos données de service et d'exploitation organisées et accessibles.
- **Améliorer l'efficacité opérationnelle** : réduire le travail manuel et améliorer la qualité du service grâce à des workflows personnalisables et à l'automatisation.

Dans Sim, l'intégration ServiceNow permet à vos agents d'interagir directement avec votre instance ServiceNow dans le cadre de leurs workflows. Les agents peuvent créer, lire, mettre à jour ou supprimer des enregistrements dans n'importe quelle table ServiceNow et exploiter les données de tickets ou d'utilisateurs pour une automatisation et une prise de décision sophistiquées. Cette intégration relie votre automatisation de workflow et vos opérations informatiques, permettant à vos agents de gérer les demandes de service, les incidents, les utilisateurs et les actifs sans intervention manuelle. En connectant Sim avec ServiceNow, vous pouvez automatiser les tâches de gestion des services, améliorer les temps de réponse et garantir un accès cohérent et sécurisé aux données de service vitales de votre organisation.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez ServiceNow dans votre workflow. Créez, lisez, mettez à jour et supprimez des enregistrements dans n'importe quelle table ServiceNow, y compris les incidents, les tâches, les demandes de changement, les utilisateurs et bien plus encore.

## Outils

### `servicenow_create_record`

Créer un nouvel enregistrement dans une table ServiceNow

#### Entrée

| Paramètre | Type | Requis | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Oui | URL de l'instance ServiceNow (par ex., https://instance.service-now.com) |
| `username` | string | Oui | Nom d'utilisateur ServiceNow |
| `password` | string | Oui | Mot de passe ServiceNow |
| `tableName` | string | Oui | Nom de la table (par ex., incident, task, sys_user) |
| `fields` | json | Oui | Champs à définir sur l'enregistrement (objet JSON) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Enregistrement ServiceNow créé avec sys_id et autres champs |
| `metadata` | json | Métadonnées de l'opération |

### `servicenow_read_record`

Lire des enregistrements d'une table ServiceNow

#### Entrée

| Paramètre | Type | Requis | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Oui | URL de l'instance ServiceNow (par ex., https://instance.service-now.com) |
| `username` | string | Oui | Nom d'utilisateur ServiceNow |
| `password` | string | Oui | Mot de passe ServiceNow |
| `tableName` | string | Oui | Nom de la table |
| `sysId` | string | Non | sys_id d'enregistrement spécifique |
| `number` | string | Non | Numéro d'enregistrement (par ex., INC0010001) |
| `query` | string | Non | Chaîne de requête encodée (par ex., "active=true^priority=1") |
| `limit` | number | Non | Nombre maximum d'enregistrements à retourner |
| `fields` | string | Non | Liste de champs à retourner, séparés par des virgules |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `records` | array | Tableau d'enregistrements ServiceNow |
| `metadata` | json | Métadonnées de l'opération |

### `servicenow_update_record`

Mettre à jour un enregistrement existant dans une table ServiceNow

#### Entrée

| Paramètre | Type | Requis | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Oui | URL de l'instance ServiceNow \(par exemple, https://instance.service-now.com\) |
| `username` | string | Oui | Nom d'utilisateur ServiceNow |
| `password` | string | Oui | Mot de passe ServiceNow |
| `tableName` | string | Oui | Nom de la table |
| `sysId` | string | Oui | sys_id de l'enregistrement à mettre à jour |
| `fields` | json | Oui | Champs à mettre à jour \(objet JSON\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Enregistrement ServiceNow mis à jour |
| `metadata` | json | Métadonnées de l'opération |

### `servicenow_delete_record`

Supprimer un enregistrement d'une table ServiceNow

#### Entrée

| Paramètre | Type | Requis | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Oui | URL de l'instance ServiceNow \(par exemple, https://instance.service-now.com\) |
| `username` | string | Oui | Nom d'utilisateur ServiceNow |
| `password` | string | Oui | Mot de passe ServiceNow |
| `tableName` | string | Oui | Nom de la table |
| `sysId` | string | Oui | sys_id de l'enregistrement à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la suppression a réussi |
| `metadata` | json | Métadonnées de l'opération |

## Remarques

- Catégorie : `tools`
- Type : `servicenow`
```

--------------------------------------------------------------------------------

---[FILE: sftp.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/sftp.mdx

```text
---
title: SFTP
description: Transférer des fichiers via SFTP (Protocole de transfert de fichiers SSH)
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sftp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SFTP (Protocole de transfert de fichiers SSH)](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol) est un protocole réseau sécurisé qui vous permet de téléverser, télécharger et gérer des fichiers sur des serveurs distants. SFTP fonctionne via SSH, ce qui en fait une solution idéale pour les transferts de fichiers automatisés et chiffrés, ainsi que pour la gestion de fichiers à distance dans les flux de travail modernes.

Grâce aux outils SFTP intégrés à Sim, vous pouvez facilement automatiser le déplacement de fichiers entre vos agents IA et des systèmes ou serveurs externes. Cela permet à vos agents de gérer les échanges de données critiques, les sauvegardes, la génération de documents et l'orchestration de systèmes distants, le tout avec une sécurité robuste.

**Fonctionnalités clés disponibles via les outils SFTP :**

- **Téléversement de fichiers :** Transférez facilement des fichiers de tout type depuis votre flux de travail vers un serveur distant, avec prise en charge de l'authentification par mot de passe et par clé privée SSH.
- **Téléchargement de fichiers :** Récupérez des fichiers depuis des serveurs SFTP distants directement pour traitement, archivage ou automatisation supplémentaire.
- **Liste et gestion des fichiers :** Énumérez les répertoires, supprimez ou créez des fichiers et dossiers, et gérez les permissions du système de fichiers à distance.
- **Authentification flexible :** Connectez-vous en utilisant soit des mots de passe traditionnels, soit des clés SSH, avec prise en charge des phrases secrètes et du contrôle des permissions.
- **Prise en charge des fichiers volumineux :** Gérez de manière programmatique les téléversements et téléchargements de fichiers volumineux, avec des limites de taille intégrées pour la sécurité.

En intégrant SFTP à Sim, vous pouvez automatiser les opérations de fichiers sécurisées dans le cadre de n'importe quel flux de travail, qu'il s'agisse de collecte de données, de rapports, de maintenance de systèmes distants ou d'échange dynamique de contenu entre plateformes.

Les sections ci-dessous décrivent les principaux outils SFTP disponibles :

- **sftp_upload :** Téléverser un ou plusieurs fichiers vers un serveur distant.
- **sftp_download :** Télécharger des fichiers depuis un serveur distant vers votre flux de travail.
- **sftp_list :** Lister le contenu des répertoires sur un serveur SFTP distant.
- **sftp_delete :** Supprimer des fichiers ou des répertoires d'un serveur distant.
- **sftp_create :** Créer de nouveaux fichiers sur un serveur SFTP distant.
- **sftp_mkdir :** Créer de nouveaux répertoires à distance.

Consultez la documentation de l'outil ci-dessous pour les paramètres d'entrée et de sortie détaillés pour chaque opération.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Téléchargez, téléchargez, listez et gérez des fichiers sur des serveurs distants via SFTP. Prend en charge l'authentification par mot de passe et par clé privée pour des transferts de fichiers sécurisés.

## Outils

### `sftp_upload`

Téléverser des fichiers vers un serveur SFTP distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SFTP |
| `port` | number | Oui | Port du serveur SFTP \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SFTP |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `remotePath` | string | Oui | Répertoire de destination sur le serveur distant |
| `files` | file[] | Non | Fichiers à téléverser |
| `fileContent` | string | Non | Contenu direct du fichier à téléverser \(pour les fichiers texte\) |
| `fileName` | string | Non | Nom du fichier lors de l'utilisation du contenu direct |
| `overwrite` | boolean | Non | Écraser les fichiers existants \(par défaut : true\) |
| `permissions` | string | Non | Permissions du fichier \(ex. 0644\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Si le téléversement a réussi |
| `uploadedFiles` | json | Tableau des détails des fichiers téléversés \(nom, chemin distant, taille\) |
| `message` | string | Message d'état de l'opération |

### `sftp_download`

Télécharger un fichier depuis un serveur SFTP distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SFTP |
| `port` | nombre | Oui | Port du serveur SFTP \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SFTP |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `remotePath` | chaîne | Oui | Chemin vers le fichier sur le serveur distant |
| `encoding` | chaîne | Non | Encodage de sortie : utf-8 pour le texte, base64 pour le binaire \(par défaut : utf-8\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le téléchargement a réussi |
| `fileName` | chaîne | Nom du fichier téléchargé |
| `content` | chaîne | Contenu du fichier \(texte ou encodé en base64\) |
| `size` | nombre | Taille du fichier en octets |
| `encoding` | chaîne | Encodage du contenu \(utf-8 ou base64\) |
| `message` | chaîne | Message d'état de l'opération |

### `sftp_list`

Lister les fichiers et répertoires sur un serveur SFTP distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SFTP |
| `port` | nombre | Oui | Port du serveur SFTP \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SFTP |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `remotePath` | chaîne | Oui | Chemin du répertoire sur le serveur distant |
| `detailed` | booléen | Non | Inclure des informations détaillées sur les fichiers \(taille, permissions, date de modification\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'opération a réussi |
| `path` | string | Chemin du répertoire qui a été listé |
| `entries` | json | Tableau des entrées du répertoire avec nom, type, taille, permissions, modifiedAt |
| `count` | number | Nombre d'entrées dans le répertoire |
| `message` | string | Message d'état de l'opération |

### `sftp_delete`

Supprimer un fichier ou un répertoire sur un serveur SFTP distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SFTP |
| `port` | number | Oui | Port du serveur SFTP \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SFTP |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `remotePath` | string | Oui | Chemin vers le fichier ou le répertoire à supprimer |
| `recursive` | boolean | Non | Supprimer les répertoires de façon récursive |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la suppression a réussi |
| `deletedPath` | string | Chemin qui a été supprimé |
| `message` | string | Message d'état de l'opération |

### `sftp_mkdir`

Créer un répertoire sur un serveur SFTP distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SFTP |
| `port` | nombre | Oui | Port du serveur SFTP \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SFTP |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `remotePath` | chaîne | Oui | Chemin pour le nouveau répertoire |
| `recursive` | booléen | Non | Créer les répertoires parents s'ils n'existent pas |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Indique si le répertoire a été créé avec succès |
| `createdPath` | chaîne | Chemin du répertoire créé |
| `message` | chaîne | Message d'état de l'opération |

## Remarques

- Catégorie : `tools`
- Type : `sftp`
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/sharepoint.mdx

```text
---
title: Sharepoint
description: Travailler avec des pages et des listes
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sharepoint"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration) est une plateforme collaborative de Microsoft qui permet aux utilisateurs de créer et de gérer des sites web internes, de partager des documents et d'organiser les ressources d'équipe. Elle offre une solution puissante et flexible pour créer des espaces de travail numériques et rationaliser la gestion de contenu dans les organisations.

Avec SharePoint, vous pouvez :

- **Créer des sites d'équipe et de communication** : Mettre en place des pages et des portails pour faciliter la collaboration, les annonces et la distribution de contenu
- **Organiser et partager du contenu** : Stocker des documents, gérer des fichiers et activer le contrôle de version avec des fonctionnalités de partage sécurisées
- **Personnaliser les pages** : Ajouter des parties textuelles pour adapter chaque site aux besoins de votre équipe
- **Améliorer la découvrabilité** : Utiliser les métadonnées, la recherche et les outils de navigation pour aider les utilisateurs à trouver rapidement ce dont ils ont besoin
- **Collaborer en toute sécurité** : Contrôler l'accès grâce à des paramètres d'autorisation robustes et à l'intégration avec Microsoft 365

Dans Sim, l'intégration SharePoint permet à vos agents de créer et d'accéder aux sites et pages SharePoint dans le cadre de leurs flux de travail. Cela permet une gestion automatisée des documents, le partage des connaissances et la création d'espaces de travail sans effort manuel. Les agents peuvent générer de nouvelles pages de projet, télécharger ou récupérer des fichiers et organiser dynamiquement les ressources en fonction des entrées du flux de travail. En connectant Sim à SharePoint, vous intégrez la collaboration structurée et la gestion de contenu dans vos flux d'automatisation — donnant à vos agents la capacité de coordonner les activités d'équipe, de mettre en évidence les informations clés et de maintenir une source unique de vérité dans toute votre organisation.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez SharePoint dans le flux de travail. Lisez/créez des pages, répertoriez des sites et travaillez avec des listes (lecture, création, mise à jour d'éléments). Nécessite OAuth.

## Outils

### `sharepoint_create_page`

Créer une nouvelle page dans un site SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Non | L'ID du site SharePoint \(usage interne\) |
| `siteSelector` | chaîne | Non | Sélectionner le site SharePoint |
| `pageName` | chaîne | Oui | Le nom de la page à créer |
| `pageTitle` | chaîne | Non | Le titre de la page \(par défaut, le nom de la page si non fourni\) |
| `pageContent` | chaîne | Non | Le contenu de la page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `page` | objet | Informations sur la page SharePoint créée |

### `sharepoint_read_page`

Lire une page spécifique d'un site SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | chaîne | Non | Sélectionner le site SharePoint |
| `siteId` | chaîne | Non | L'ID du site SharePoint \(usage interne\) |
| `pageId` | chaîne | Non | L'ID de la page à lire |
| `pageName` | chaîne | Non | Le nom de la page à lire \(alternative à pageId\) |
| `maxPages` | nombre | Non | Nombre maximum de pages à retourner lors de la liste de toutes les pages \(par défaut : 10, max : 50\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `page` | objet | Informations sur la page SharePoint |

### `sharepoint_list_sites`

Lister les détails de tous les sites SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | chaîne | Non | Sélectionner le site SharePoint |
| `groupId` | chaîne | Non | L'ID de groupe pour accéder à un site d'équipe de groupe |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `site` | objet | Informations sur le site SharePoint actuel |

### `sharepoint_create_list`

Créer une nouvelle liste dans un site SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Non | L'ID du site SharePoint \(usage interne\) |
| `siteSelector` | chaîne | Non | Sélectionnez le site SharePoint |
| `listDisplayName` | chaîne | Oui | Nom d'affichage de la liste à créer |
| `listDescription` | chaîne | Non | Description de la liste |
| `listTemplate` | chaîne | Non | Nom du modèle de liste \(par exemple, 'genericList'\) |
| `pageContent` | chaîne | Non | JSON optionnel des colonnes. Soit un tableau de premier niveau de définitions de colonnes, soit un objet avec \{ columns: \[...\] \}. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `list` | objet | Informations sur la liste SharePoint créée |

### `sharepoint_get_list`

Obtenir les métadonnées (et éventuellement les colonnes/éléments) d'une liste SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | chaîne | Non | Sélectionnez le site SharePoint |
| `siteId` | chaîne | Non | L'ID du site SharePoint \(usage interne\) |
| `listId` | chaîne | Non | L'ID de la liste à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `list` | objet | Informations sur la liste SharePoint |

### `sharepoint_update_list`

Mettre à jour les propriétés (champs) d'un élément de liste SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteSelector` | chaîne | Non | Sélectionner le site SharePoint |
| `siteId` | chaîne | Non | L'ID du site SharePoint \(usage interne\) |
| `listId` | chaîne | Non | L'ID de la liste contenant l'élément |
| `itemId` | chaîne | Oui | L'ID de l'élément de liste à mettre à jour |
| `listItemFields` | objet | Oui | Valeurs des champs à mettre à jour sur l'élément de liste |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `item` | objet | Élément de liste SharePoint mis à jour |

### `sharepoint_add_list_items`

Ajouter un nouvel élément à une liste SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteSelector` | chaîne | Non | Sélectionner le site SharePoint |
| `siteId` | chaîne | Non | L'ID du site SharePoint \(usage interne\) |
| `listId` | chaîne | Oui | L'ID de la liste à laquelle ajouter l'élément |
| `listItemFields` | objet | Oui | Valeurs des champs pour le nouvel élément de liste |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `item` | object | Élément de liste SharePoint créé |

### `sharepoint_upload_file`

Télécharger des fichiers vers une bibliothèque de documents SharePoint

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteId` | chaîne | Non | L'ID du site SharePoint |
| `driveId` | chaîne | Non | L'ID de la bibliothèque de documents \(lecteur\). Si non fourni, utilise le lecteur par défaut. |
| `folderPath` | chaîne | Non | Chemin de dossier optionnel dans la bibliothèque de documents \(par exemple, /Documents/Sousdossier\) |
| `fileName` | chaîne | Non | Optionnel : remplacer le nom du fichier téléchargé |
| `files` | fichier[] | Non | Fichiers à télécharger vers SharePoint |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `uploadedFiles` | tableau | Tableau d'objets de fichiers téléchargés |

## Remarques

- Catégorie : `tools`
- Type : `sharepoint`
```

--------------------------------------------------------------------------------

````
