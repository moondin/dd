---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 182
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 182 of 933)

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

---[FILE: sqs.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/sqs.mdx

```text
---
title: Amazon SQS
description: Se connecter à Amazon SQS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sqs"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) est un service de file d'attente de messages entièrement géré qui permet de découpler et de mettre à l'échelle des microservices, des systèmes distribués et des applications sans serveur. SQS élimine la complexité et les frais généraux associés à la gestion et à l'exploitation d'un middleware orienté messages, et permet aux développeurs de se concentrer sur un travail différenciant.

Avec Amazon SQS, vous pouvez :

- **Envoyer des messages** : publier des messages dans des files d'attente pour un traitement asynchrone
- **Découpler des applications** : permettre un couplage souple entre les composants de votre système
- **Mettre à l'échelle les charges de travail** : gérer des charges de travail variables sans provisionner d'infrastructure
- **Assurer la fiabilité** : redondance intégrée et haute disponibilité
- **Prendre en charge les files d'attente FIFO** : maintenir un ordre strict des messages et un traitement exactement une fois

Dans Sim, l'intégration SQS permet à vos agents d'envoyer des messages aux files d'attente Amazon SQS de manière sécurisée et programmatique. Les opérations prises en charge comprennent :

- **Envoi de message** : envoyer des messages aux files d'attente SQS avec un ID de groupe de messages facultatif et un ID de déduplication pour les files d'attente FIFO

Cette intégration permet à vos agents d'automatiser les flux de travail d'envoi de messages sans intervention manuelle. En connectant Sim à Amazon SQS, vous pouvez créer des agents qui publient des messages dans des files d'attente au sein de vos flux de travail, le tout sans avoir à gérer l'infrastructure ou les connexions des files d'attente.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Amazon SQS dans le flux de travail. Peut envoyer des messages aux files d'attente SQS.

## Outils

### `sqs_send`

Envoyer un message à une file d'attente Amazon SQS

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `region` | string | Oui | Région AWS (par ex., us-east-1) |
| `accessKeyId` | string | Oui | ID de clé d'accès AWS |
| `secretAccessKey` | string | Oui | Clé d'accès secrète AWS |
| `queueUrl` | string | Oui | URL de la file d'attente |
| `data` | object | Oui | Corps du message à envoyer |
| `messageGroupId` | string | Non | ID de groupe de messages (facultatif) |
| `messageDeduplicationId` | string | Non | ID de déduplication de message (facultatif) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message d'état de l'opération |
| `id` | string | ID du message |

## Notes

- Catégorie : `tools`
- Type : `sqs`
```

--------------------------------------------------------------------------------

---[FILE: ssh.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/ssh.mdx

```text
---
title: SSH
description: Connectez-vous aux serveurs distants via SSH
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ssh"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[SSH (Secure Shell)](https://en.wikipedia.org/wiki/Secure_Shell) est un protocole largement utilisé pour se connecter de manière sécurisée à des serveurs distants, vous permettant d'exécuter des commandes, de transférer des fichiers et de gérer des systèmes via des canaux chiffrés.

Avec la prise en charge SSH dans Sim, vos agents peuvent :

- **Exécuter des commandes à distance** : lancer des commandes shell sur n'importe quel serveur accessible via SSH
- **Télécharger et exécuter des scripts** : transférer et exécuter facilement des scripts multi-lignes pour une automatisation avancée
- **Transférer des fichiers en toute sécurité** : télécharger et téléverser des fichiers dans le cadre de vos flux de travail (bientôt disponible ou via commande)
- **Automatiser la gestion des serveurs** : effectuer des mises à jour, de la maintenance, de la surveillance, des déploiements et des tâches de configuration de manière programmatique
- **Utiliser une authentification flexible** : se connecter avec une authentification par mot de passe ou par clé privée, y compris la prise en charge des clés chiffrées

Les outils SSH Sim suivants permettent à vos agents d'interagir avec les serveurs dans le cadre d'automatisations plus larges :

- `ssh_execute_command` : exécuter n'importe quelle commande shell à distance et capturer la sortie, le statut et les erreurs.
- `ssh_execute_script` : téléverser et exécuter un script complet multi-lignes sur le système distant.
- (D'autres outils seront bientôt disponibles, comme le transfert de fichiers.)

En intégrant SSH dans vos flux de travail d'agents, vous pouvez automatiser l'accès sécurisé, les opérations à distance et l'orchestration de serveurs—simplifiant ainsi DevOps, l'automatisation informatique et la gestion à distance personnalisée, le tout depuis Sim.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Exécutez des commandes, transférez des fichiers et gérez des serveurs distants via SSH. Prend en charge l'authentification par mot de passe et par clé privée pour un accès sécurisé aux serveurs.

## Outils

### `ssh_execute_command`

Exécuter une commande shell sur un serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `command` | string | Oui | Commande shell à exécuter sur le serveur distant |
| `workingDirectory` | string | Non | Répertoire de travail pour l'exécution de la commande |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `stdout` | string | Sortie standard de la commande |
| `stderr` | string | Sortie d'erreur standard |
| `exitCode` | number | Code de sortie de la commande |
| `success` | boolean | Si la commande a réussi \(code de sortie 0\) |
| `message` | string | Message d'état de l'opération |

### `ssh_execute_script`

Télécharger et exécuter un script multi-lignes sur un serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `script` | string | Oui | Contenu du script à exécuter \(bash, python, etc.\) |
| `interpreter` | string | Non | Interpréteur de script \(par défaut : /bin/bash\) |
| `workingDirectory` | string | Non | Répertoire de travail pour l'exécution du script |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `stdout` | string | Sortie standard du script |
| `stderr` | string | Sortie d'erreur standard |
| `exitCode` | number | Code de sortie du script |
| `success` | boolean | Si le script a réussi \(code de sortie 0\) |
| `scriptPath` | string | Chemin temporaire où le script a été téléchargé |
| `message` | string | Message d'état de l'opération |

### `ssh_check_command_exists`

Vérifier si une commande/un programme existe sur le serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | nombre | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SSH |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `commandName` | chaîne | Oui | Nom de la commande à vérifier \(ex. docker, git, python3\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `commandExists` | booléen | Indique si la commande existe |
| `commandPath` | chaîne | Chemin complet vers la commande \(si trouvée\) |
| `version` | chaîne | Sortie de la version de la commande \(si applicable\) |
| `message` | chaîne | Message d'état de l'opération |

### `ssh_upload_file`

Téléverser un fichier vers un serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | nombre | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SSH |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `fileContent` | chaîne | Oui | Contenu du fichier à téléverser \(encodé en base64 pour les fichiers binaires\) |
| `fileName` | chaîne | Oui | Nom du fichier à téléverser |
| `remotePath` | chaîne | Oui | Chemin de destination sur le serveur distant |
| `permissions` | chaîne | Non | Permissions du fichier \(ex. 0644\) |
| `overwrite` | booléen | Non | Indique s'il faut écraser les fichiers existants \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `uploaded` | boolean | Indique si le fichier a été téléversé avec succès |
| `remotePath` | string | Chemin final sur le serveur distant |
| `size` | number | Taille du fichier en octets |
| `message` | string | Message d'état de l'opération |

### `ssh_download_file`

Télécharger un fichier depuis un serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `remotePath` | string | Oui | Chemin du fichier sur le serveur distant |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `downloaded` | boolean | Indique si le fichier a été téléchargé avec succès |
| `fileContent` | string | Contenu du fichier \(encodé en base64 pour les fichiers binaires\) |
| `fileName` | string | Nom du fichier téléchargé |
| `remotePath` | string | Chemin source sur le serveur distant |
| `size` | number | Taille du fichier en octets |
| `message` | string | Message d'état de l'opération |

### `ssh_list_directory`

Lister les fichiers et répertoires dans un répertoire distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | nombre | Oui | Port du serveur SSH (par défaut : 22) |
| `username` | chaîne | Oui | Nom d'utilisateur SSH |
| `password` | chaîne | Non | Mot de passe pour l'authentification (si vous n'utilisez pas de clé privée) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification (format OpenSSH) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `path` | chaîne | Oui | Chemin du répertoire distant à lister |
| `detailed` | booléen | Non | Inclure les détails des fichiers (taille, permissions, date de modification) |
| `recursive` | booléen | Non | Lister les sous-répertoires de manière récursive (par défaut : false) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `entries` | tableau | Tableau des entrées de fichiers et de répertoires |

### `ssh_check_file_exists`

Vérifier si un fichier ou un répertoire existe sur le serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | nombre | Oui | Port du serveur SSH (par défaut : 22) |
| `username` | chaîne | Oui | Nom d'utilisateur SSH |
| `password` | chaîne | Non | Mot de passe pour l'authentification (si vous n'utilisez pas de clé privée) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification (format OpenSSH) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `path` | chaîne | Oui | Chemin du fichier ou du répertoire distant à vérifier |
| `type` | chaîne | Non | Type attendu : fichier, répertoire ou n'importe lequel (par défaut : n'importe lequel) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `exists` | boolean | Indique si le chemin existe |
| `type` | string | Type de chemin (fichier, répertoire, lien symbolique, non_trouvé) |
| `size` | number | Taille du fichier s'il s'agit d'un fichier |
| `permissions` | string | Permissions du fichier (ex. 0755) |
| `modified` | string | Horodatage de dernière modification |
| `message` | string | Message d'état de l'opération |

### `ssh_create_directory`

Créer un répertoire sur le serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH (par défaut : 22) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification (si vous n'utilisez pas de clé privée) |
| `privateKey` | string | Non | Clé privée pour l'authentification (format OpenSSH) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `path` | string | Oui | Chemin du répertoire à créer |
| `recursive` | boolean | Non | Créer les répertoires parents s'ils n'existent pas (par défaut : true) |
| `permissions` | string | Non | Permissions du répertoire (par défaut : 0755) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `created` | boolean | Indique si le répertoire a été créé avec succès |
| `remotePath` | string | Chemin du répertoire créé |
| `alreadyExists` | boolean | Indique si le répertoire existait déjà |
| `message` | string | Message d'état de l'opération |

### `ssh_delete_file`

Supprimer un fichier ou un répertoire du serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `path` | string | Oui | Chemin à supprimer |
| `recursive` | boolean | Non | Supprimer récursivement les répertoires \(par défaut : false\) |
| `force` | boolean | Non | Forcer la suppression sans confirmation \(par défaut : false\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indique si le chemin a été supprimé avec succès |
| `remotePath` | string | Chemin supprimé |
| `message` | string | Message d'état de l'opération |

### `ssh_move_rename`

Déplacer ou renommer un fichier ou un répertoire sur le serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |
| `sourcePath` | string | Oui | Chemin actuel du fichier ou du répertoire |
| `destinationPath` | string | Oui | Nouveau chemin pour le fichier ou le répertoire |
| `overwrite` | boolean | Non | Écraser la destination si elle existe \(par défaut : false\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `moved` | boolean | Indique si l'opération a réussi |
| `sourcePath` | string | Chemin d'origine |
| `destinationPath` | string | Nouveau chemin |
| `message` | string | Message d'état de l'opération |

### `ssh_get_system_info`

Récupérer les informations système du serveur SSH distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | number | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | string | Oui | Nom d'utilisateur SSH |
| `password` | string | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | string | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | string | Non | Phrase secrète pour la clé privée chiffrée |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `hostname` | string | Nom d'hôte du serveur |
| `os` | string | Système d'exploitation \(ex. : Linux, Darwin\) |
| `architecture` | string | Architecture CPU \(ex. : x64, arm64\) |
| `uptime` | number | Temps de fonctionnement du système en secondes |
| `memory` | json | Informations sur la mémoire \(totale, libre, utilisée\) |
| `diskSpace` | json | Informations sur l'espace disque \(total, libre, utilisé\) |
| `message` | string | Message d'état de l'opération |

### `ssh_read_file_content`

Lire le contenu d'un fichier distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | nombre | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SSH |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `path` | chaîne | Oui | Chemin du fichier distant à lire |
| `encoding` | chaîne | Non | Encodage du fichier \(par défaut : utf-8\) |
| `maxSize` | nombre | Non | Taille maximale du fichier à lire en Mo \(par défaut : 10\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Contenu du fichier sous forme de chaîne |
| `size` | nombre | Taille du fichier en octets |
| `lines` | nombre | Nombre de lignes dans le fichier |
| `remotePath` | chaîne | Chemin du fichier distant |
| `message` | chaîne | Message d'état de l'opération |

### `ssh_write_file_content`

Écrire ou ajouter du contenu à un fichier distant

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `host` | chaîne | Oui | Nom d'hôte ou adresse IP du serveur SSH |
| `port` | nombre | Oui | Port du serveur SSH \(par défaut : 22\) |
| `username` | chaîne | Oui | Nom d'utilisateur SSH |
| `password` | chaîne | Non | Mot de passe pour l'authentification \(si vous n'utilisez pas de clé privée\) |
| `privateKey` | chaîne | Non | Clé privée pour l'authentification \(format OpenSSH\) |
| `passphrase` | chaîne | Non | Phrase secrète pour la clé privée chiffrée |
| `path` | chaîne | Oui | Chemin du fichier distant où écrire |
| `content` | chaîne | Oui | Contenu à écrire dans le fichier |
| `mode` | chaîne | Non | Mode d'écriture : overwrite, append, ou create \(par défaut : overwrite\) |
| `permissions` | chaîne | Non | Permissions du fichier \(ex. : 0644\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `written` | boolean | Indique si le fichier a été écrit avec succès |
| `remotePath` | string | Chemin du fichier |
| `size` | number | Taille finale du fichier en octets |
| `message` | string | Message d'état de l'opération |

## Notes

- Catégorie : `tools`
- Type : `ssh`
```

--------------------------------------------------------------------------------

---[FILE: stagehand.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/stagehand.mdx

```text
---
title: Stagehand
description: Automatisation web et extraction de données
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stagehand"
  color="#FFC83C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Stagehand](https://stagehand.com) est un outil qui permet à la fois l'extraction de données structurées à partir de pages web et l'automatisation web autonome en utilisant Browserbase et les LLM modernes (OpenAI ou Anthropic).

Stagehand offre deux capacités principales dans Sim :

- **stagehand_extract** : Extrait des données structurées d'une seule page web. Vous spécifiez ce que vous voulez (un schéma), et l'IA récupère et analyse les données dans cette forme à partir de la page. C'est idéal pour extraire des listes, des champs ou des objets lorsque vous savez exactement quelles informations vous avez besoin et où les obtenir.

- **stagehand_agent** : Exécute un agent web autonome capable d'accomplir des tâches en plusieurs étapes, d'interagir avec des éléments, de naviguer entre les pages et de renvoyer des résultats structurés. C'est beaucoup plus flexible : l'agent peut faire des choses comme se connecter, rechercher, remplir des formulaires, recueillir des données de plusieurs endroits et produire un résultat final selon un schéma demandé.

**Différences clés :**

- *stagehand_extract* est une opération rapide “extraire ces données de cette page”. Il fonctionne mieux pour les tâches d'extraction directes en une seule étape.
- *stagehand_agent* effectue des tâches autonomes complexes en plusieurs étapes sur le web — comme la navigation, la recherche, ou même des transactions — et peut extraire dynamiquement des données selon vos instructions et un schéma optionnel.

En pratique, utilisez **stagehand_extract** lorsque vous savez ce que vous voulez et où, et utilisez **stagehand_agent** lorsque vous avez besoin d'un bot pour réfléchir et exécuter des flux de travail interactifs.

En intégrant Stagehand, les agents Sim peuvent automatiser la collecte de données, l'analyse et l'exécution de flux de travail sur le web : mise à jour de bases de données, organisation d'informations et génération de rapports personnalisés — de manière transparente et autonome.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Stagehand dans le flux de travail. Peut extraire des données structurées à partir de pages web ou exécuter un agent autonome pour effectuer des tâches.

## Outils

### `stagehand_extract`

Extraire des données structurées d'une page web en utilisant Stagehand

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `url` | chaîne | Oui | URL de la page web à partir de laquelle extraire les données |
| `instruction` | chaîne | Oui | Instructions pour l'extraction |
| `provider` | chaîne | Non | Fournisseur d'IA à utiliser : openai ou anthropic |
| `apiKey` | chaîne | Oui | Clé API pour le fournisseur sélectionné |
| `schema` | json | Oui | Schéma JSON définissant la structure des données à extraire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `data` | objet | Données structurées extraites correspondant au schéma fourni |

### `stagehand_agent`

Exécuter un agent web autonome pour accomplir des tâches et extraire des données structurées

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `startUrl` | chaîne | Oui | URL de la page web sur laquelle démarrer l'agent |
| `task` | chaîne | Oui | La tâche à accomplir ou l'objectif à atteindre sur le site web |
| `variables` | json | Non | Variables optionnelles à substituer dans la tâche (format : \{key: value\}). Référence dans la tâche en utilisant %key% |
| `format` | chaîne | Non | Pas de description |
| `provider` | chaîne | Non | Fournisseur d'IA à utiliser : openai ou anthropic |
| `apiKey` | chaîne | Oui | Clé API pour le fournisseur sélectionné |
| `outputSchema` | json | Non | Schéma JSON optionnel définissant la structure des données que l'agent doit renvoyer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `agentResult` | object | Résultat de l'exécution de l'agent Stagehand |

## Notes

- Catégorie : `tools`
- Type : `stagehand`
```

--------------------------------------------------------------------------------

````
