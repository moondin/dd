---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 155
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 155 of 933)

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

---[FILE: datadog.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/datadog.mdx

```text
---
title: Datadog
description: Surveillez l'infrastructure, les applications et les journaux avec Datadog
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="datadog"
  color="#632CA6"
/>

{/* MANUAL-CONTENT-START:intro */}
[Datadog](https://datadoghq.com/) est une plateforme complète de surveillance et d'analyse pour l'infrastructure, les applications, les journaux et plus encore. Elle permet aux organisations d'obtenir une visibilité en temps réel sur la santé et les performances des systèmes, de détecter les anomalies et d'automatiser la réponse aux incidents.

Avec Datadog, vous pouvez :

- **Surveiller les métriques** : collecter, visualiser et analyser les métriques des serveurs, des services cloud et des applications personnalisées.
- **Interroger les données chronologiques** : exécuter des requêtes avancées sur les métriques de performance pour l'analyse des tendances et les rapports.
- **Gérer les moniteurs et les événements** : configurer des moniteurs pour détecter les problèmes, déclencher des alertes et créer des événements pour l'observabilité.
- **Gérer les temps d'arrêt** : planifier et gérer de manière programmatique les temps d'arrêt planifiés pour supprimer les alertes pendant la maintenance.
- **Analyser les journaux et les traces** *(avec une configuration supplémentaire dans Datadog)* : centraliser et inspecter les journaux ou les traces distribuées pour un dépannage plus approfondi.

L'intégration Datadog de Sim permet à vos agents d'automatiser ces opérations et d'interagir avec votre compte Datadog de manière programmatique. Utilisez-la pour soumettre des métriques personnalisées, interroger des données chronologiques, gérer des moniteurs, créer des événements et rationaliser vos flux de travail de surveillance directement dans les automatisations Sim.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez la surveillance Datadog dans les flux de travail. Soumettez des métriques, gérez des moniteurs, interrogez des journaux, créez des événements, gérez des temps d'arrêt et plus encore.

## Outils

### `datadog_submit_metrics`

Soumettez des métriques personnalisées à Datadog. Utilisez-les pour suivre les performances des applications, les métriques commerciales ou les données de surveillance personnalisées.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `series` | string | Oui | Tableau JSON des séries de métriques à soumettre. Chaque série doit inclure le nom de la métrique, le type \(gauge/rate/count\), les points \(paires timestamp/valeur\) et des tags optionnels. |
| `apiKey` | string | Oui | Clé API Datadog |
| `site` | string | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si les métriques ont été soumises avec succès |
| `errors` | array | Toutes les erreurs survenues pendant la soumission |

### `datadog_query_timeseries`

Interroge les données de séries temporelles de métriques depuis Datadog. Utilisez-le pour analyser les tendances, créer des rapports ou récupérer des valeurs de métriques.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Oui | Requête de métriques Datadog (par exemple, "avg:system.cpu.user\{*\}") |
| `from` | number | Oui | Heure de début sous forme d'horodatage Unix en secondes |
| `to` | number | Oui | Heure de fin sous forme d'horodatage Unix en secondes |
| `apiKey` | string | Oui | Clé API Datadog |
| `applicationKey` | string | Oui | Clé d'application Datadog |
| `site` | string | Non | Site/région Datadog (par défaut : datadoghq.com) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `series` | array | Tableau de données de séries temporelles avec nom de métrique, tags et points de données |
| `status` | string | Statut de la requête |

### `datadog_create_event`

Publie un événement dans le flux d'événements Datadog. Utilisez-le pour les notifications de déploiement, les alertes ou tout autre événement significatif.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Oui | Titre de l'événement |
| `text` | string | Oui | Corps/description de l'événement. Prend en charge le markdown. |
| `alertType` | string | Non | Type d'alerte : error, warning, info, success, user_update, recommendation ou snapshot |
| `priority` | string | Non | Priorité de l'événement : normal ou low |
| `host` | string | Non | Nom d'hôte à associer à cet événement |
| `tags` | string | Non | Liste de tags séparés par des virgules (par exemple, "env:production,service:api") |
| `aggregationKey` | string | Non | Clé pour regrouper les événements ensemble |
| `sourceTypeName` | string | Non | Nom du type de source pour l'événement |
| `dateHappened` | number | Non | Horodatage Unix indiquant quand l'événement s'est produit (par défaut : maintenant) |
| `apiKey` | string | Oui | Clé API Datadog |
| `site` | string | Non | Site/région Datadog (par défaut : datadoghq.com) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `event` | objet | Les détails de l'événement créé |

### `datadog_create_monitor`

Créer un nouveau moniteur/alerte dans Datadog. Les moniteurs peuvent suivre des métriques, des vérifications de service, des événements et plus encore.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `name` | chaîne | Oui | Nom du moniteur |
| `type` | chaîne | Oui | Type de moniteur : alerte métrique, vérification de service, alerte d'événement, alerte de processus, alerte de journal, alerte de requête, composite, alerte de synthèse, alerte SLO |
| `query` | chaîne | Oui | Requête du moniteur \(ex., "avg\(last_5m\):avg:system.cpu.idle\{*\} &lt; 20"\) |
| `message` | chaîne | Non | Message à inclure avec les notifications. Peut inclure des @-mentions et du markdown. |
| `tags` | chaîne | Non | Liste de tags séparés par des virgules |
| `priority` | nombre | Non | Priorité du moniteur \(1-5, où 1 est la plus haute\) |
| `options` | chaîne | Non | Chaîne JSON des options du moniteur \(seuils, notify_no_data, renotify_interval, etc.\) |
| `apiKey` | chaîne | Oui | Clé API Datadog |
| `applicationKey` | chaîne | Oui | Clé d'application Datadog |
| `site` | chaîne | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `monitor` | objet | Les détails du moniteur créé |

### `datadog_get_monitor`

Récupérer les détails d'un moniteur spécifique par ID.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `monitorId` | chaîne | Oui | L'ID du moniteur à récupérer |
| `groupStates` | chaîne | Non | États de groupe séparés par des virgules à inclure : alert, warn, no data, ok |
| `withDowntimes` | booléen | Non | Inclure les données de temps d'arrêt avec le moniteur |
| `apiKey` | chaîne | Oui | Clé API Datadog |
| `applicationKey` | chaîne | Oui | Clé d'application Datadog |
| `site` | chaîne | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `monitor` | objet | Les détails du moniteur |

### `datadog_list_monitors`

Liste tous les moniteurs dans Datadog avec filtrage optionnel par nom, tags ou état.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `groupStates` | chaîne | Non | États de groupe séparés par des virgules pour filtrer : alert, warn, no data, ok |
| `name` | chaîne | Non | Filtrer les moniteurs par nom \(correspondance partielle\) |
| `tags` | chaîne | Non | Liste de tags séparés par des virgules pour filtrer |
| `monitorTags` | chaîne | Non | Liste de tags de moniteur séparés par des virgules pour filtrer |
| `withDowntimes` | booléen | Non | Inclure les données de temps d'arrêt avec les moniteurs |
| `page` | nombre | Non | Numéro de page pour la pagination \(indexé à partir de 0\) |
| `pageSize` | nombre | Non | Nombre de moniteurs par page \(max 1000\) |
| `apiKey` | chaîne | Oui | Clé API Datadog |
| `applicationKey` | chaîne | Oui | Clé d'application Datadog |
| `site` | chaîne | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `monitors` | tableau | Liste des moniteurs |

### `datadog_mute_monitor`

Mettre en sourdine un moniteur pour supprimer temporairement les notifications.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `monitorId` | chaîne | Oui | L'ID du moniteur à mettre en sourdine |
| `scope` | chaîne | Non | Portée à mettre en sourdine \(par ex., "host:myhost"\). Si non spécifié, met en sourdine toutes les portées. |
| `end` | nombre | Non | Horodatage Unix indiquant quand la mise en sourdine doit se terminer. Si non spécifié, met en sourdine indéfiniment. |
| `apiKey` | chaîne | Oui | Clé API Datadog |
| `applicationKey` | chaîne | Oui | Clé d'application Datadog |
| `site` | chaîne | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si le moniteur a été mis en sourdine avec succès |

### `datadog_query_logs`

Recherchez et récupérez des logs depuis Datadog. Utilisez-les pour le dépannage, l'analyse ou la surveillance.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Oui | Requête de recherche de logs \(ex., "service:web-app status:error"\) |
| `from` | string | Oui | Heure de début au format ISO-8601 ou relatif \(ex., "now-1h"\) |
| `to` | string | Oui | Heure de fin au format ISO-8601 ou relatif \(ex., "now"\) |
| `limit` | number | Non | Nombre maximum de logs à retourner \(par défaut : 50, max : 1000\) |
| `sort` | string | Non | Ordre de tri : timestamp \(plus ancien d'abord\) ou -timestamp \(plus récent d'abord\) |
| `indexes` | string | Non | Liste d'index de logs à rechercher, séparés par des virgules |
| `apiKey` | string | Oui | Clé API Datadog |
| `applicationKey` | string | Oui | Clé d'application Datadog |
| `site` | string | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `logs` | array | Liste des entrées de logs |

### `datadog_send_logs`

Envoyez des entrées de logs à Datadog pour une journalisation et une analyse centralisées.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `logs` | string | Oui | Tableau JSON d'entrées de logs. Chaque entrée doit avoir un message et éventuellement ddsource, ddtags, hostname, service. |
| `apiKey` | string | Oui | Clé API Datadog |
| `site` | string | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si les journaux ont été envoyés avec succès |

### `datadog_create_downtime`

Planifiez une période d'arrêt pour supprimer les notifications de surveillance pendant les fenêtres de maintenance.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `scope` | string | Oui | Portée à laquelle appliquer la période d'arrêt (par ex., "host:myhost", "env:production", ou "*" pour tous) |
| `message` | string | Non | Message à afficher pendant la période d'arrêt |
| `start` | number | Non | Horodatage Unix pour le début de la période d'arrêt (par défaut : maintenant) |
| `end` | number | Non | Horodatage Unix pour la fin de la période d'arrêt |
| `timezone` | string | Non | Fuseau horaire pour la période d'arrêt (par ex., "America/New_York") |
| `monitorId` | string | Non | ID de surveillance spécifique à mettre en sourdine |
| `monitorTags` | string | Non | Tags de surveillance séparés par des virgules à faire correspondre (par ex., "team:backend,priority:high") |
| `muteFirstRecoveryNotification` | boolean | Non | Mettre en sourdine la première notification de récupération |
| `apiKey` | string | Oui | Clé API Datadog |
| `applicationKey` | string | Oui | Clé d'application Datadog |
| `site` | string | Non | Site/région Datadog (par défaut : datadoghq.com) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `downtime` | object | Les détails de la période d'arrêt créée |

### `datadog_list_downtimes`

Listez toutes les périodes d'arrêt planifiées dans Datadog.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `currentOnly` | boolean | Non | Renvoyer uniquement les périodes d'arrêt actuellement actives |
| `monitorId` | string | Non | Filtrer par ID de surveillance |
| `apiKey` | string | Oui | Clé API Datadog |
| `applicationKey` | string | Oui | Clé d'application Datadog |
| `site` | string | Non | Site/région Datadog (par défaut : datadoghq.com) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `downtimes` | array | Liste des temps d'arrêt |

### `datadog_cancel_downtime`

Annuler un temps d'arrêt programmé.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `downtimeId` | string | Oui | L'ID du temps d'arrêt à annuler |
| `apiKey` | string | Oui | Clé API Datadog |
| `applicationKey` | string | Oui | Clé d'application Datadog |
| `site` | string | Non | Site/région Datadog \(par défaut : datadoghq.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si le temps d'arrêt a été annulé avec succès |

## Remarques

- Catégorie : `tools`
- Type : `datadog`
```

--------------------------------------------------------------------------------

---[FILE: discord.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/discord.mdx

```text
---
title: Discord
description: Interagir avec Discord
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="discord"
  color="#5865F2"
/>

{/* MANUAL-CONTENT-START:intro */}
[Discord](https://discord.com) est une plateforme de communication puissante qui vous permet de vous connecter avec vos amis, des communautés et des équipes. Elle offre une gamme de fonctionnalités pour la collaboration en équipe, notamment des canaux textuels, des canaux vocaux et des appels vidéo.

Avec un compte Discord ou un bot, vous pouvez :

- **Envoyer des messages** : envoyer des messages dans un canal spécifique
- **Obtenir des messages** : récupérer des messages d'un canal spécifique
- **Obtenir des informations sur un serveur** : récupérer des informations sur un serveur spécifique
- **Obtenir des informations sur un utilisateur** : récupérer des informations sur un utilisateur spécifique

Dans Sim, l'intégration Discord permet à vos agents d'accéder et d'exploiter les serveurs Discord de votre organisation. Les agents peuvent récupérer des informations depuis les canaux Discord, rechercher des utilisateurs spécifiques, obtenir des informations sur les serveurs et envoyer des messages. Cela permet à vos workflows de s'intégrer à vos communautés Discord, d'automatiser les notifications et de créer des expériences interactives.

> **Important :** pour lire le contenu des messages, votre bot Discord doit avoir l'option « Message Content Intent » activée dans le portail développeur Discord. Sans cette permission, vous recevrez toujours les métadonnées des messages, mais le champ de contenu apparaîtra vide.

Les composants Discord dans Sim utilisent un chargement paresseux efficace, ne récupérant les données que lorsque nécessaire pour minimiser les appels API et éviter les limitations de taux. Le rafraîchissement des jetons se produit automatiquement en arrière-plan pour maintenir votre connexion.

### Configuration de votre bot Discord

1. Accédez au [Portail des développeurs Discord](https://discord.com/developers/applications)
2. Créez une nouvelle application et naviguez vers l'onglet « Bot »
3. Créez un bot et copiez votre jeton de bot
4. Sous « Intents privilégiés de passerelle », activez l'**Intent de contenu des messages** pour lire le contenu des messages
5. Invitez votre bot sur vos serveurs avec les permissions appropriées
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégration complète de Discord : messages, fils de discussion, canaux, rôles, membres, invitations et webhooks.

## Outils

### `discord_send_message`

Envoyer un message à un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord où envoyer le message |
| `content` | chaîne | Non | Le contenu textuel du message |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `files` | fichier[] | Non | Fichiers à joindre au message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du message Discord |

### `discord_get_messages`

Récupérer des messages d'un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord pour récupérer les messages |
| `limit` | nombre | Non | Nombre maximum de messages à récupérer \(par défaut : 10, max : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Conteneur pour les données des messages |

### `discord_get_server`

Récupérer des informations sur un serveur Discord (guilde)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Informations sur le serveur Discord \(guilde\) |

### `discord_get_user`

Récupérer des informations sur un utilisateur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Jeton du bot Discord pour l'authentification |
| `userId` | chaîne | Oui | L'ID de l'utilisateur Discord |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Message de succès ou d'erreur |
| `data` | object | Informations de l'utilisateur Discord |

### `discord_edit_message`

Modifier un message existant dans un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à modifier |
| `content` | chaîne | Non | Le nouveau contenu textuel du message |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du message Discord mis à jour |

### `discord_delete_message`

Supprimer un message d'un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à supprimer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_add_reaction`

Ajouter une réaction emoji à un message Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord contenant le message |
| `messageId` | chaîne | Oui | L'ID du message auquel réagir |
| `emoji` | chaîne | Oui | L'emoji à utiliser pour la réaction \(emoji unicode ou emoji personnalisé au format nom:id\) |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_remove_reaction`

Supprimer une réaction d'un message Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord contenant le message |
| `messageId` | chaîne | Oui | L'ID du message avec la réaction |
| `emoji` | chaîne | Oui | L'emoji à supprimer \(emoji unicode ou emoji personnalisé au format nom:id\) |
| `userId` | chaîne | Non | L'ID de l'utilisateur dont la réaction doit être supprimée \(omettre pour supprimer la propre réaction du bot\) |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_pin_message`

Épingler un message dans un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à épingler |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_unpin_message`

Désépingler un message dans un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord contenant le message |
| `messageId` | chaîne | Oui | L'ID du message à désépingler |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_create_thread`

Créer un fil de discussion dans un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord où créer le fil de discussion |
| `name` | chaîne | Oui | Le nom du fil de discussion \(1-100 caractères\) |
| `messageId` | chaîne | Non | L'ID du message à partir duquel créer un fil de discussion \(si création à partir d'un message existant\) |
| `autoArchiveDuration` | nombre | Non | Durée en minutes avant l'auto-archivage du fil de discussion \(60, 1440, 4320, 10080\) |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du fil de discussion créé |

### `discord_join_thread`

Rejoindre un fil de discussion dans Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `threadId` | chaîne | Oui | L'ID du fil de discussion à rejoindre |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_leave_thread`

Quitter un fil de discussion Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `threadId` | chaîne | Oui | L'ID du fil de discussion à quitter |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_archive_thread`

Archiver ou désarchiver un fil de discussion dans Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `threadId` | chaîne | Oui | L'ID du fil de discussion à archiver/désarchiver |
| `archived` | booléen | Oui | Indique s'il faut archiver \(true\) ou désarchiver \(false\) le fil de discussion |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données mises à jour du fil de discussion |

### `discord_create_channel`

Créer un nouveau canal dans un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `name` | chaîne | Oui | Le nom du canal \(1-100 caractères\) |
| `type` | nombre | Non | Type de canal \(0=texte, 2=vocal, 4=catégorie, 5=annonce, 13=scène\) |
| `topic` | chaîne | Non | Sujet du canal \(0-1024 caractères\) |
| `parentId` | chaîne | Non | ID de la catégorie parente pour le canal |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du canal créé |

### `discord_update_channel`

Mettre à jour un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord à mettre à jour |
| `name` | chaîne | Non | Le nouveau nom pour le canal |
| `topic` | chaîne | Non | Le nouveau sujet pour le canal |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du canal mis à jour |

### `discord_delete_channel`

Supprimer un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord à supprimer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_get_channel`

Obtenir des informations sur un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord à récupérer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du canal |

### `discord_create_role`

Créer un nouveau rôle dans un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `name` | chaîne | Oui | Le nom du rôle |
| `color` | nombre | Non | Valeur de couleur RGB en entier \(par exemple, 0xFF0000 pour rouge\) |
| `hoist` | booléen | Non | Indique si les membres du rôle doivent être affichés séparément des membres en ligne |
| `mentionable` | booléen | Non | Indique si le rôle peut être mentionné |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du rôle créé |

### `discord_update_role`

Mettre à jour un rôle dans un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `roleId` | chaîne | Oui | L'ID du rôle à mettre à jour |
| `name` | chaîne | Non | Le nouveau nom pour le rôle |
| `color` | nombre | Non | Valeur de couleur RGB en entier |
| `hoist` | booléen | Non | Indique si les membres du rôle sont affichés séparément |
| `mentionable` | booléen | Non | Indique si le rôle peut être mentionné |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du rôle mis à jour |

### `discord_delete_role`

Supprimer un rôle d'un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `roleId` | chaîne | Oui | L'ID du rôle à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_assign_role`

Attribuer un rôle à un membre dans un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à qui attribuer le rôle |
| `roleId` | chaîne | Oui | L'ID du rôle à attribuer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_remove_role`

Retirer un rôle d'un membre dans un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à qui retirer le rôle |
| `roleId` | chaîne | Oui | L'ID du rôle à retirer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_kick_member`

Expulser un membre d'un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à expulser |
| `reason` | chaîne | Non | Raison de l'expulsion du membre |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_ban_member`

Bannir un membre d'un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à bannir |
| `reason` | chaîne | Non | Raison du bannissement du membre |
| `deleteMessageDays` | nombre | Non | Nombre de jours pour lesquels supprimer les messages \(0-7\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_unban_member`

Débannir un membre d'un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à débannir |
| `reason` | chaîne | Non | Raison du débannissement du membre |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_get_member`

Obtenir des informations sur un membre d'un serveur Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du membre |

### `discord_update_member`

Mettre à jour un membre dans un serveur Discord (par ex., changer le surnom)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |
| `userId` | chaîne | Oui | L'ID de l'utilisateur à mettre à jour |
| `nick` | chaîne | Non | Nouveau surnom pour le membre \(null pour supprimer\) |
| `mute` | booléen | Non | Indique s'il faut mettre en sourdine le membre dans les canaux vocaux |
| `deaf` | booléen | Non | Indique s'il faut rendre sourd le membre dans les canaux vocaux |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du membre mises à jour |

### `discord_create_invite`

Créer un lien d'invitation pour un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord pour lequel créer une invitation |
| `maxAge` | nombre | Non | Durée de l'invitation en secondes \(0 = n'expire jamais, par défaut 86400\) |
| `maxUses` | nombre | Non | Nombre maximum d'utilisations \(0 = illimité, par défaut 0\) |
| `temporary` | booléen | Non | Si l'invitation accorde une adhésion temporaire |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données de l'invitation créée |

### `discord_get_invite`

Obtenir des informations sur une invitation Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `inviteCode` | chaîne | Oui | Le code d'invitation à récupérer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données de l'invitation |

### `discord_delete_invite`

Supprimer une invitation Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `inviteCode` | chaîne | Oui | Le code d'invitation à supprimer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

### `discord_create_webhook`

Créer un webhook dans un canal Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `channelId` | chaîne | Oui | L'ID du canal Discord où créer le webhook |
| `name` | chaîne | Oui | Nom du webhook \(1-80 caractères\) |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du webhook créé |

### `discord_execute_webhook`

Exécuter un webhook Discord pour envoyer un message

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `webhookId` | chaîne | Oui | L'ID du webhook |
| `webhookToken` | chaîne | Oui | Le jeton du webhook |
| `content` | chaîne | Oui | Le contenu du message à envoyer |
| `username` | chaîne | Non | Remplacer le nom d'utilisateur par défaut du webhook |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Message envoyé via webhook |

### `discord_get_webhook`

Obtenir des informations sur un webhook Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `webhookId` | chaîne | Oui | L'ID du webhook à récupérer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |
| `data` | objet | Données du webhook |

### `discord_delete_webhook`

Supprimer un webhook Discord

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `botToken` | chaîne | Oui | Le jeton du bot pour l'authentification |
| `webhookId` | chaîne | Oui | L'ID du webhook à supprimer |
| `serverId` | chaîne | Oui | L'ID du serveur Discord \(ID de guilde\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | chaîne | Message de succès ou d'erreur |

## Notes

- Catégorie : `tools`
- Type : `discord`
```

--------------------------------------------------------------------------------

````
