---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 190
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 190 of 933)

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

---[FILE: zoom.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/zoom.mdx

```text
---
title: Zoom
description: Créer et gérer des réunions et enregistrements Zoom
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zoom"
  color="#2D8CFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zoom](https://zoom.us/) est une plateforme de communication cloud de premier plan pour les réunions vidéo, les webinaires et la collaboration en ligne. Elle permet aux utilisateurs et aux organisations de planifier, d'héberger et de gérer facilement des réunions, en fournissant des outils pour le partage d'écran, le chat, les enregistrements, et plus encore.

Avec Zoom, vous pouvez :

- **Planifier et gérer des réunions** : Créer des réunions instantanées ou programmées, y compris des événements récurrents
- **Configurer les options de réunion** : Définir des mots de passe pour les réunions, activer les salles d'attente et contrôler la vidéo/l'audio des participants
- **Envoyer des invitations et partager des détails** : Récupérer les invitations et les informations de réunion pour un partage facile
- **Obtenir et mettre à jour les données de réunion** : Accéder aux détails des réunions, modifier les réunions existantes et gérer les paramètres par programmation

Dans Sim, l'intégration Zoom permet à vos agents d'automatiser la planification et la gestion des réunions. Utilisez les actions d'outils pour :

- Créer par programmation de nouvelles réunions avec des paramètres personnalisés
- Lister toutes les réunions pour un utilisateur spécifique (ou vous-même)
- Récupérer les détails ou les invitations pour n'importe quelle réunion
- Mettre à jour ou supprimer des réunions existantes directement depuis vos automatisations

Pour vous connecter à Zoom, déposez le bloc Zoom et cliquez sur `Connect` pour vous authentifier avec votre compte Zoom. Une fois connecté, vous pouvez utiliser les outils Zoom pour créer, lister, mettre à jour et supprimer des réunions Zoom. À tout moment, vous pouvez déconnecter votre compte Zoom en cliquant sur `Disconnect` dans Paramètres > Intégrations, et l'accès à votre compte Zoom sera immédiatement révoqué.

Ces fonctionnalités vous permettent de rationaliser la collaboration à distance, d'automatiser les sessions vidéo récurrentes et de gérer l'environnement Zoom de votre organisation, le tout dans le cadre de vos flux de travail.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Zoom dans vos flux de travail. Créez, listez, mettez à jour et supprimez des réunions Zoom. Obtenez les détails des réunions, les invitations, les enregistrements et les participants. Gérez les enregistrements cloud de manière programmatique.

## Outils

### `zoom_create_meeting`

Créer une nouvelle réunion Zoom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `userId` | string | Oui | L'ID utilisateur ou l'adresse e-mail. Utilisez "me" pour l'utilisateur authentifié. |
| `topic` | string | Oui | Sujet de la réunion |
| `type` | number | Non | Type de réunion : 1=instantanée, 2=programmée, 3=récurrente sans heure fixe, 8=récurrente à heure fixe |
| `startTime` | string | Non | Heure de début de la réunion au format ISO 8601 \(ex., 2025-06-03T10:00:00Z\) |
| `duration` | number | Non | Durée de la réunion en minutes |
| `timezone` | string | Non | Fuseau horaire pour la réunion \(ex., America/Los_Angeles\) |
| `password` | string | Non | Mot de passe de la réunion |
| `agenda` | string | Non | Ordre du jour de la réunion |
| `hostVideo` | boolean | Non | Démarrer avec la vidéo de l'hôte activée |
| `participantVideo` | boolean | Non | Démarrer avec la vidéo des participants activée |
| `joinBeforeHost` | boolean | Non | Autoriser les participants à rejoindre avant l'hôte |
| `muteUponEntry` | boolean | Non | Mettre les participants en sourdine à l'entrée |
| `waitingRoom` | boolean | Non | Activer la salle d'attente |
| `autoRecording` | string | Non | Paramètre d'enregistrement automatique : local, cloud, ou none |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `meeting` | object | La réunion créée avec toutes ses propriétés |

### `zoom_list_meetings`

Lister toutes les réunions pour un utilisateur Zoom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Oui | L'ID utilisateur ou l'adresse e-mail. Utilisez "me" pour l'utilisateur authentifié. |
| `type` | string | Non | Filtre de type de réunion : scheduled, live, upcoming, upcoming_meetings, ou previous_meetings |
| `pageSize` | number | Non | Nombre d'enregistrements par page \(max 300\) |
| `nextPageToken` | string | Non | Jeton pour la pagination pour obtenir la page suivante de résultats |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `meetings` | array | Liste des réunions |
| `pageInfo` | object | Informations de pagination |

### `zoom_get_meeting`

Obtenir les détails d'une réunion Zoom spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion |
| `occurrenceId` | string | Non | ID d'occurrence pour les réunions récurrentes |
| `showPreviousOccurrences` | boolean | Non | Afficher les occurrences précédentes pour les réunions récurrentes |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `meeting` | object | Les détails de la réunion |

Obtenir les détails d'une réunion Zoom spécifique

Mettre à jour une réunion Zoom existante

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion à mettre à jour |
| `topic` | string | Non | Sujet de la réunion |
| `type` | number | Non | Type de réunion : 1=instantanée, 2=programmée, 3=récurrente sans heure fixe, 8=récurrente à heure fixe |
| `startTime` | string | Non | Heure de début de la réunion au format ISO 8601 \(ex., 2025-06-03T10:00:00Z\) |
| `duration` | number | Non | Durée de la réunion en minutes |
| `timezone` | string | Non | Fuseau horaire pour la réunion \(ex., America/Los_Angeles\) |
| `password` | string | Non | Mot de passe de la réunion |
| `agenda` | string | Non | Ordre du jour de la réunion |
| `hostVideo` | boolean | Non | Démarrer avec la vidéo de l'hôte activée |
| `participantVideo` | boolean | Non | Démarrer avec la vidéo des participants activée |
| `joinBeforeHost` | boolean | Non | Autoriser les participants à rejoindre avant l'hôte |
| `muteUponEntry` | boolean | Non | Mettre les participants en sourdine à l'entrée |
| `waitingRoom` | boolean | Non | Activer la salle d'attente |
| `autoRecording` | string | Non | Paramètre d'enregistrement automatique : local, cloud ou none |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la réunion a été mise à jour avec succès |

Supprimer une réunion Zoom

Supprimer ou annuler une réunion Zoom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion à supprimer |
| `occurrenceId` | string | Non | ID d'occurrence pour supprimer une occurrence spécifique d'une réunion récurrente |
| `scheduleForReminder` | boolean | Non | Envoyer un e-mail de rappel d'annulation aux inscrits |
| `cancelMeetingReminder` | boolean | Non | Envoyer un e-mail d'annulation aux inscrits et aux hôtes alternatifs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la réunion a été supprimée avec succès |

### `zoom_get_meeting_invitation`

Obtenir le texte d'invitation pour une réunion Zoom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `invitation` | string | Le texte d'invitation de la réunion |

### `zoom_list_recordings`

Lister tous les enregistrements cloud pour un utilisateur Zoom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Oui | L'ID utilisateur ou l'adresse e-mail. Utilisez "me" pour l'utilisateur authentifié. |
| `from` | string | Non | Date de début au format aaaa-mm-jj (dans les 6 derniers mois) |
| `to` | string | Non | Date de fin au format aaaa-mm-jj |
| `pageSize` | number | Non | Nombre d'enregistrements par page (max 300) |
| `nextPageToken` | string | Non | Jeton pour la pagination pour obtenir la page suivante de résultats |
| `trash` | boolean | Non | Définir sur true pour lister les enregistrements de la corbeille |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `recordings` | array | Liste des enregistrements |
| `pageInfo` | object | Informations de pagination |

Obtenir tous les enregistrements pour une réunion Zoom spécifique

Obtenir tous les enregistrements pour une réunion Zoom spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion ou l'UUID de la réunion |
| `includeFolderItems` | boolean | Non | Inclure les éléments dans un dossier |
| `ttl` | number | Non | Durée de vie des URL de téléchargement en secondes \(max 604800\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `recording` | object | L'enregistrement de la réunion avec tous les fichiers |

Supprimer les enregistrements cloud pour une réunion Zoom

Supprimer les enregistrements cloud pour une réunion Zoom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion ou l'UUID de la réunion |
| `recordingId` | string | Non | ID de fichier d'enregistrement spécifique à supprimer. Si non fourni, supprime tous les enregistrements. |
| `action` | string | Non | Action de suppression : "trash" \(déplacer vers la corbeille\) ou "delete" \(supprimer définitivement\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Si l'enregistrement a été supprimé avec succès |

Lister les participants d'une réunion Zoom passée

Lister les participants d'une réunion Zoom passée

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Oui | L'ID de la réunion passée ou l'UUID |
| `pageSize` | number | Non | Nombre d'enregistrements par page \(max 300\) |
| `nextPageToken` | string | Non | Jeton pour la pagination pour obtenir la page suivante de résultats |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `participants` | array | Liste des participants à la réunion |
| `pageInfo` | object | Informations de pagination |

## Notes

- Catégorie : `tools`
- Type : `zoom`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/triggers/index.mdx

```text
---
title: Aperçu
description: Les déclencheurs sont les moyens essentiels pour lancer les flux de travail Sim
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

<div className="flex justify-center">
  <Image
    src="/static/blocks/triggers.png"
    alt="Aperçu des déclencheurs"
    width={500}
    height={350}
    className="my-6"
  />
</div>

## Déclencheurs principaux

Utilisez le bloc Démarrer pour tout ce qui provient de l'éditeur, du déploiement vers l'API ou des expériences de déploiement vers le chat. D'autres déclencheurs restent disponibles pour les flux de travail basés sur des événements :

<Cards>
  <Card title="Start" href="/triggers/start">
    Point d'entrée unifié qui prend en charge les exécutions de l'éditeur, les déploiements d'API et les déploiements de chat
  </Card>
  <Card title="Webhook" href="/triggers/webhook">
    Recevoir des charges utiles de webhook externes
  </Card>
  <Card title="Schedule" href="/triggers/schedule">
    Exécution basée sur cron ou intervalle
  </Card>
  <Card title="RSS Feed" href="/triggers/rss">
    Surveiller les flux RSS et Atom pour du nouveau contenu
  </Card>
</Cards>

## Comparaison rapide

| Déclencheur | Condition de démarrage |
|---------|-----------------|
| **Start** | Exécutions de l'éditeur, requêtes de déploiement d'API ou messages de chat |
| **Schedule** | Minuteur géré dans le bloc de planification |
| **Webhook** | Sur requête HTTP entrante |
| **RSS Feed** | Nouvel élément publié dans le flux |

> Le bloc Démarrer expose toujours les champs `input`, `conversationId` et `files`. Ajoutez des champs personnalisés au format d'entrée pour des données structurées supplémentaires.

## Utilisation des déclencheurs

1. Déposez le bloc Démarrer dans l'emplacement de départ (ou un déclencheur alternatif comme Webhook/Planification).
2. Configurez tout schéma ou authentification requis.
3. Connectez le bloc au reste du flux de travail.

> Les déploiements alimentent chaque déclencheur. Mettez à jour le flux de travail, redéployez, et tous les points d'entrée des déclencheurs récupèrent le nouveau snapshot. En savoir plus dans [Exécution → Snapshots de déploiement](/execution).

## Priorité d'exécution manuelle

Lorsque vous cliquez sur **Exécuter** dans l'éditeur, Sim sélectionne automatiquement quel déclencheur exécuter selon l'ordre de priorité suivant :

1. **Bloc Démarrer** (priorité la plus élevée)
2. **Déclencheurs de planification**
3. **Déclencheurs externes** (webhooks, intégrations comme Slack, Gmail, Airtable, etc.)

Si votre flux de travail comporte plusieurs déclencheurs, le déclencheur de priorité la plus élevée sera exécuté. Par exemple, si vous avez à la fois un bloc Démarrer et un déclencheur Webhook, cliquer sur Exécuter exécutera le bloc Démarrer.

**Déclencheurs externes avec charges utiles simulées** : lorsque des déclencheurs externes (webhooks et intégrations) sont exécutés manuellement, Sim génère automatiquement des charges utiles simulées basées sur la structure de données attendue du déclencheur. Cela garantit que les blocs en aval peuvent résoudre correctement les variables pendant les tests.
```

--------------------------------------------------------------------------------

---[FILE: rss.mdx]---
Location: sim-main/apps/docs/content/docs/fr/triggers/rss.mdx

```text
---
title: Flux RSS
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

Le bloc Flux RSS surveille les flux RSS et Atom – lorsque de nouveaux éléments sont publiés, votre workflow se déclenche automatiquement.

<div className="flex justify-center">
  <Image
    src="/static/blocks/rss.png"
    alt="Bloc Flux RSS"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration

1. **Ajouter le bloc Flux RSS** - Faites glisser le bloc Flux RSS pour démarrer votre workflow
2. **Saisir l'URL du flux** - Collez l'URL de n'importe quel flux RSS ou Atom
3. **Déployer** - Déployez votre workflow pour activer l'interrogation

Une fois déployé, le flux est vérifié chaque minute pour détecter de nouveaux éléments.

## Champs de sortie

| Champ | Type | Description |
|-------|------|-------------|
| `title` | string | Titre de l'élément |
| `link` | string | Lien de l'élément |
| `pubDate` | string | Date de publication |
| `item` | object | Élément brut avec tous les champs |
| `feed` | object | Métadonnées brutes du flux |

Accédez directement aux champs mappés (`<rss.title>`) ou utilisez les objets bruts pour n'importe quel champ (`<rss.item.author>`, `<rss.feed.language>`).

## Cas d'utilisation

- **Surveillance de contenu** - Suivez les blogs, sites d'actualités ou mises à jour des concurrents
- **Automatisation de podcast** - Déclenchez des workflows lors de la sortie de nouveaux épisodes
- **Suivi des versions** - Surveillez les versions GitHub, les journaux de modifications ou les mises à jour de produits
- **Agrégation sociale** - Collectez du contenu à partir de plateformes qui exposent des flux RSS

<Callout>
Les déclencheurs RSS ne s'activent que pour les éléments publiés après l'enregistrement du déclencheur. Les éléments existants du flux ne sont pas traités.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/fr/triggers/schedule.mdx

```text
---
title: Planification
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Le bloc Planification déclenche automatiquement des workflows de manière récurrente à des intervalles ou moments spécifiés.

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule.png"
    alt="Bloc de planification"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Options de planification

Configurez quand votre workflow s'exécute en utilisant les options du menu déroulant :

<Tabs items={['Intervalles simples', 'Expressions cron']}>
  <Tab>
    <ul className="list-disc space-y-1 pl-6">
      <li><strong>Toutes les quelques minutes</strong> : intervalles de 5, 15, 30 minutes</li>
      <li><strong>Toutes les heures</strong> : chaque heure ou toutes les quelques heures</li>
      <li><strong>Quotidien</strong> : une ou plusieurs fois par jour</li>
      <li><strong>Hebdomadaire</strong> : jours spécifiques de la semaine</li>
      <li><strong>Mensuel</strong> : jours spécifiques du mois</li>
    </ul>
  </Tab>
  <Tab>
    <p>Utilisez des expressions cron pour une planification avancée :</p>
    <div className="text-sm space-y-1">
      <div><code>0 9 * * 1-5</code> - Chaque jour de semaine à 9h</div>
      <div><code>*/15 * * * *</code> - Toutes les 15 minutes</div>
      <div><code>0 0 1 * *</code> - Premier jour de chaque mois</div>
    </div>
  </Tab>
</Tabs>

## Configuration des planifications

Lorsqu'un workflow est planifié :
- La planification devient **active** et affiche la prochaine heure d'exécution
- Cliquez sur le bouton **"Planifié"** pour désactiver la planification
- Les planifications se désactivent automatiquement après **3 échecs consécutifs**

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-2.png"
    alt="Bloc de planification actif"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Planification désactivée"
    width={500}
    height={350}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Planification désactivée"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Les planifications désactivées indiquent quand elles ont été actives pour la dernière fois. Cliquez sur le badge **"Désactivé"** pour réactiver la planification.

<Callout>
Les blocs de planification ne peuvent pas recevoir de connexions entrantes et servent uniquement de déclencheurs de workflow.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: start.mdx]---
Location: sim-main/apps/docs/content/docs/fr/triggers/start.mdx

```text
---
title: Démarrer
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Démarrer est le déclencheur par défaut pour les flux de travail créés dans Sim. Il collecte des entrées structurées et les distribue au reste de votre graphe pour les tests d'éditeur, les déploiements d'API et les expériences de chat.

<div className="flex justify-center">
  <Image
    src="/static/start.png"
    alt="Bloc de démarrage avec champs de format d'entrée"
    width={360}
    height={380}
    className="my-6"
  />
</div>

<Callout type="info">
Le bloc Démarrer se trouve dans l'emplacement de départ lorsque vous créez un flux de travail. Gardez-le à cet endroit lorsque vous souhaitez que le même point d'entrée serve aux exécutions de l'éditeur, aux requêtes de déploiement d'API et aux sessions de chat. Remplacez-le par des déclencheurs Webhook ou Planification lorsque vous n'avez besoin que d'une exécution basée sur des événements.
</Callout>

## Champs exposés par Démarrer

Le bloc Démarrer émet différentes données selon la surface d'exécution :

- **Champs de format d'entrée** — Chaque champ que vous ajoutez devient disponible comme <code>&lt;start.fieldName&gt;</code>. Par exemple, un champ `customerId` apparaît comme <code>&lt;start.customerId&gt;</code> dans les blocs et modèles en aval.
- **Champs spécifiques au chat** — Lorsque le flux de travail s'exécute depuis le panneau latéral de chat ou une expérience de chat déployée, Sim fournit également <code>&lt;start.input&gt;</code> (dernier message de l'utilisateur), <code>&lt;start.conversationId&gt;</code> (ID de session active) et <code>&lt;start.files&gt;</code> (pièces jointes du chat).

Limitez les champs de format d'entrée aux noms que vous prévoyez de référencer ultérieurement — ces valeurs sont les seuls champs structurés partagés entre les exécutions de l'éditeur, de l'API et du chat.

## Configurer le format d'entrée

Utilisez le sous-bloc Format d'entrée pour définir le schéma qui s'applique à tous les modes d'exécution :

1. Ajoutez un champ pour chaque valeur que vous souhaitez collecter.
2. Choisissez un type (`string`, `number`, `boolean`, `object`, `array`, ou `files`). Les champs de fichier acceptent les téléchargements depuis le chat et les appelants API.
3. Fournissez des valeurs par défaut lorsque vous souhaitez que la fenêtre d'exécution manuelle remplisse automatiquement les données de test. Ces valeurs par défaut sont ignorées pour les exécutions déployées.
4. Réorganisez les champs pour contrôler leur apparence dans le formulaire de l'éditeur.

Référencez les valeurs structurées en aval avec des expressions telles que <code>&lt;start.customerId&gt;</code> selon le bloc que vous connectez.

## Comment il se comporte selon le point d'entrée

<Tabs items={['Exécution dans l\'éditeur', 'Déploiement vers API', 'Déploiement vers chat']}>
  <Tab>
    <div className="space-y-3">
      <p>
        Lorsque vous cliquez sur <strong>Exécuter</strong> dans l'éditeur, le bloc Start affiche le format d'entrée sous forme de formulaire. Les valeurs par défaut facilitent les tests répétés sans avoir à retaper les données. La soumission du formulaire déclenche immédiatement le flux de travail et les valeurs deviennent disponibles sur <code>&lt;start.fieldName&gt;</code> (par exemple <code>&lt;start.sampleField&gt;</code>).
      </p>
      <p>
        Les champs de fichiers dans le formulaire sont directement téléchargés dans le{' '}
        <code>&lt;start.fieldName&gt;</code> correspondant ; utilisez ces valeurs pour alimenter
        les outils en aval ou les étapes de stockage.
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        Le déploiement vers l'API transforme le format d'entrée en un contrat JSON pour les clients. Chaque champ devient une partie du corps de la requête, et Sim convertit les types primitifs lors de l'ingestion. Les champs de fichiers attendent des objets qui référencent des fichiers téléchargés ; utilisez le point de terminaison de téléchargement de fichiers d'exécution avant d'invoquer le flux de travail.
      </p>
      <p>
        Les appelants de l'API peuvent inclure des propriétés optionnelles supplémentaires.
        Elles sont préservées dans les sorties <code>&lt;start.fieldName&gt;</code> pour que
        vous puissiez expérimenter sans avoir à redéployer immédiatement.
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        Dans les déploiements de chat, le bloc Start se lie à la conversation active. Le dernier message remplit <code>&lt;start.input&gt;</code>, l'identifiant de session est disponible à <code>&lt;start.conversationId&gt;</code>, et les pièces jointes de l'utilisateur apparaissent sur <code>&lt;start.files&gt;</code>, ainsi que tous les champs du format d'entrée définis comme <code>&lt;start.fieldName&gt;</code>.
      </p>
      <p>
        Si vous lancez le chat avec un contexte structuré supplémentaire (par exemple à partir
        d'une intégration), il fusionne dans les sorties <code>&lt;start.fieldName&gt;</code>
        correspondantes, gardant les blocs en aval cohérents avec l'API et les exécutions manuelles.
      </p>
    </div>
  </Tab>
</Tabs>

## Référencement des données Start en aval

- Connectez <code>&lt;start.fieldName&gt;</code> directement aux agents, outils ou fonctions qui attendent des charges utiles structurées.
- Utilisez la syntaxe de modèle comme <code>&lt;start.sampleField&gt;</code> ou <code>&lt;start.files[0].url&gt;</code> (chat uniquement) dans les champs de prompt.
- Gardez <code>&lt;start.conversationId&gt;</code> à portée de main lorsque vous devez regrouper des sorties, mettre à jour l'historique de conversation ou rappeler l'API de chat.

## Bonnes pratiques

- Considérez le bloc Start comme le point d'entrée unique lorsque vous souhaitez prendre en charge à la fois les appelants API et chat.
- Préférez les champs de format d'entrée nommés plutôt que d'analyser du JSON brut dans les nœuds en aval ; la conversion de type se fait automatiquement.
- Ajoutez une validation ou un routage immédiatement après Start si certains champs sont nécessaires pour que votre flux de travail réussisse.

- Connectez <code>&lt;start.fieldName&gt;</code> directement aux agents, outils ou fonctions qui attendent des charges utiles structurées.
- Utilisez la syntaxe de modèle comme <code>&lt;start.sampleField&gt;</code> ou <code>&lt;start.files[0].url&gt;</code> (chat uniquement) dans les champs de prompt.
- Gardez <code>&lt;start.conversationId&gt;</code> à portée de main lorsque vous devez regrouper des sorties, mettre à jour l'historique de conversation ou rappeler l'API de chat.

## Meilleures pratiques

- Traitez le bloc Start comme le point d'entrée unique lorsque vous souhaitez prendre en charge à la fois les appelants API et chat.
- Préférez les champs de format d'entrée nommés plutôt que d'analyser du JSON brut dans les nœuds en aval ; la conversion de type se fait automatiquement.
- Ajoutez une validation ou un routage immédiatement après Start si certains champs sont nécessaires pour que votre flux de travail réussisse.
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/fr/triggers/webhook.mdx

```text
---
title: Webhooks
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Les webhooks permettent aux services externes de déclencher l'exécution de flux de travail en envoyant des requêtes HTTP à votre workflow. Sim prend en charge deux approches pour les déclencheurs basés sur les webhooks.

## Déclencheur de webhook générique

Le bloc Webhook générique crée un point de terminaison flexible qui peut recevoir n'importe quelle charge utile et déclencher votre flux de travail :

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Configuration de webhook générique"
    width={500}
    height={400}
    className="my-6"
  />
</div>

### Comment ça fonctionne

1. **Ajoutez un bloc Webhook générique** - Faites glisser le bloc Webhook générique pour démarrer votre flux de travail
2. **Configurez la charge utile** - Définissez la structure de charge utile attendue (facultatif)
3. **Obtenez l'URL du webhook** - Copiez le point de terminaison unique généré automatiquement
4. **Intégration externe** - Configurez votre service externe pour envoyer des requêtes POST à cette URL
5. **Exécution du flux de travail** - Chaque requête vers l'URL du webhook déclenche le flux de travail

### Fonctionnalités

- **Charge utile flexible** : accepte n'importe quelle structure de charge utile JSON
- **Analyse automatique** : les données du webhook sont automatiquement analysées et disponibles pour les blocs suivants
- **Authentification** : authentification optionnelle par jeton bearer ou en-tête personnalisé
- **Limitation de débit** : protection intégrée contre les abus
- **Déduplication** : empêche les exécutions en double provenant de requêtes répétées

<Callout type="info">
Le déclencheur Webhook générique s'active chaque fois que l'URL du webhook reçoit une requête, ce qui le rend parfait pour les intégrations en temps réel.
</Callout>

## Mode déclencheur pour les blocs de service

Alternativement, vous pouvez utiliser des blocs de service spécifiques (comme Slack, GitHub, etc.) en "mode déclencheur" pour créer des points de terminaison webhook plus spécialisés :

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="slack-trigger.mp4" width={700} height={450} />
</div>

### Configuration du mode déclencheur

1. **Ajouter un bloc de service** - Choisissez un bloc de service (par ex., Slack, GitHub, Airtable)
2. **Activer le mode déclencheur** - Basculez sur « Utiliser comme déclencheur » dans les paramètres du bloc
3. **Configurer le service** - Configurez l'authentification et les filtres d'événements spécifiques à ce service
4. **Enregistrement du webhook** - Le service enregistre automatiquement le webhook auprès de la plateforme externe
5. **Exécution basée sur les événements** - Le workflow se déclenche uniquement pour des événements spécifiques de ce service

### Quand utiliser chaque approche

**Utilisez le webhook générique quand :**
- Vous intégrez des applications ou services personnalisés
- Vous avez besoin d'une flexibilité maximale dans la structure de la charge utile
- Vous travaillez avec des services qui n'ont pas de blocs dédiés
- Vous créez des intégrations internes

**Utilisez le mode déclencheur quand :**
- Vous travaillez avec des services pris en charge (Slack, GitHub, etc.)
- Vous souhaitez un filtrage d'événements spécifique au service
- Vous avez besoin d'un enregistrement automatique du webhook
- Vous voulez une gestion structurée des données pour ce service

## Services pris en charge pour le mode déclencheur

**Développement et gestion de projet**
- GitHub - Problèmes, PRs, pushes, releases, exécutions de workflow
- Jira - Événements liés aux tickets, journaux de travail
- Linear - Problèmes, commentaires, projets, cycles, étiquettes

**Communication**
- Slack - Messages, mentions, réactions
- Microsoft Teams - Messages de chat, notifications de canal
- Telegram - Messages de bot, commandes
- WhatsApp - Événements de messagerie

**Email**
- Gmail - Nouveaux emails (interrogation), changements d'étiquettes
- Outlook - Nouveaux emails (interrogation), événements de dossier

**CRM et ventes**
- HubSpot - Contacts, entreprises, affaires, tickets, conversations
- Stripe - Paiements, abonnements, clients

**Formulaires et sondages**
- Typeform - Soumissions de formulaires
- Google Forms - Réponses aux formulaires
- Webflow - Éléments de collection, soumissions de formulaires

**Autres**
- Airtable - Modifications d'enregistrements
- Twilio Voice - Appels entrants, statut d'appel

## Sécurité et bonnes pratiques

### Options d'authentification

- **Jetons Bearer** : Inclure l'en-tête `Authorization: Bearer <token>`
- **En-têtes personnalisés** : Définir des en-têtes d'authentification personnalisés

### Gestion des charges utiles

- **Validation** : Valider les charges utiles entrantes pour éviter les données mal formées
- **Limites de taille** : Les webhooks ont des limites de taille de charge utile pour la sécurité
- **Gestion des erreurs** : Configurer les réponses d'erreur pour les requêtes invalides

### Test des webhooks

1. Utiliser des outils comme Postman ou curl pour tester vos points de terminaison webhook
2. Vérifier les journaux d'exécution du workflow pour le débogage
3. Vérifier que la structure de la charge utile correspond à vos attentes
4. Tester les scénarios d'authentification et d'erreur

<Callout type="warning">
Validez et assainissez toujours les données webhook entrantes avant de les traiter dans vos workflows.
</Callout>

## Cas d'utilisation courants

### Notifications en temps réel
- Messages Slack déclenchant des réponses automatisées
- Notifications par email pour les événements critiques

### Intégration CI/CD  
- Déploiements automatisés déclenchés par des push GitHub
- Mises à jour du statut de build
- Pipelines de tests automatisés

### Synchronisation des données
- Mise à jour d'autres systèmes suite aux changements dans Airtable
- Actions de suivi déclenchées par des soumissions de formulaires
- Traitement des commandes e-commerce

### Support client
- Workflows de création de tickets de support
- Processus d'escalade automatisés
- Routage de communication multicanal
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/fr/variables/environment-variables.mdx

```text
---
title: Variables d'environnement
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

Les variables d'environnement offrent un moyen sécurisé de gérer les valeurs de configuration et les secrets dans vos workflows, y compris les clés API et autres données sensibles dont vos workflows ont besoin. Elles gardent les secrets en dehors de vos définitions de workflow tout en les rendant disponibles pendant l'exécution.

## Types de variables

Les variables d'environnement dans Sim fonctionnent à deux niveaux :

- **Variables d'environnement personnelles** : privées à votre compte, vous seul pouvez les voir et les utiliser
- **Variables d'environnement d'espace de travail** : partagées dans tout l'espace de travail, disponibles pour tous les membres de l'équipe

<Callout type="info">
Les variables d'environnement d'espace de travail ont priorité sur les variables personnelles en cas de conflit de noms.
</Callout>

## Configuration des variables d'environnement

Accédez aux Paramètres pour configurer vos variables d'environnement :

<Image
  src="/static/environment/environment-1.png"
  alt="Fenêtre modale de variables d'environnement pour créer de nouvelles variables"
  width={500}
  height={350}
/>

Depuis les paramètres de votre espace de travail, vous pouvez créer et gérer des variables d'environnement personnelles et au niveau de l'espace de travail. Les variables personnelles sont privées à votre compte, tandis que les variables d'espace de travail sont partagées avec tous les membres de l'équipe.

### Définir des variables au niveau de l'espace de travail

Utilisez le bouton de portée d'espace de travail pour rendre les variables disponibles à toute votre équipe :

<Image
  src="/static/environment/environment-2.png"
  alt="Activer la portée d'espace de travail pour les variables d'environnement"
  width={500}
  height={350}
/>

Lorsque vous activez la portée d'espace de travail, la variable devient disponible pour tous les membres de l'espace de travail et peut être utilisée dans n'importe quel workflow au sein de cet espace de travail.

### Vue des variables d'espace de travail

Une fois que vous avez des variables à portée d'espace de travail, elles apparaissent dans votre liste de variables d'environnement :

<Image
  src="/static/environment/environment-3.png"
  alt="Variables à portée d'espace de travail dans la liste des variables d'environnement"
  width={500}
  height={350}
/>

## Utilisation des variables dans les workflows

Pour référencer des variables d'environnement dans vos workflows, utilisez la notation `{{}}`. Lorsque vous tapez `{{` dans n'importe quel champ de saisie, un menu déroulant apparaîtra affichant à la fois vos variables d'environnement personnelles et celles au niveau de l'espace de travail. Sélectionnez simplement la variable que vous souhaitez utiliser.

<Image
  src="/static/environment/environment-4.png"
  alt="Utilisation des variables d'environnement avec la notation à double accolade"
  width={500}
  height={350}
/>

## Comment les variables sont résolues

**Les variables d'espace de travail ont toujours la priorité** sur les variables personnelles, quel que soit l'utilisateur qui exécute le flux de travail.

Lorsqu'aucune variable d'espace de travail n'existe pour une clé, les variables personnelles sont utilisées :
- **Exécutions manuelles (UI)** : Vos variables personnelles
- **Exécutions automatisées (API, webhook, planification, chat déployé)** : Variables personnelles du propriétaire du flux de travail

<Callout type="info">
Les variables personnelles sont idéales pour les tests. Utilisez les variables d'espace de travail pour les flux de travail en production.
</Callout>

## Bonnes pratiques de sécurité

### Pour les données sensibles
- Stockez les clés API, les jetons et les mots de passe comme variables d'environnement au lieu de les coder en dur
- Utilisez des variables d'espace de travail pour les ressources partagées dont plusieurs membres de l'équipe ont besoin
- Conservez vos identifiants personnels dans des variables personnelles

### Nommage des variables
- Utilisez des noms descriptifs : `DATABASE_URL` au lieu de `DB`
- Suivez des conventions de nommage cohérentes au sein de votre équipe
- Envisagez des préfixes pour éviter les conflits : `PROD_API_KEY`, `DEV_API_KEY`

### Contrôle d'accès
- Les variables d'environnement de l'espace de travail respectent les permissions de l'espace de travail
- Seuls les utilisateurs disposant d'un accès en écriture ou supérieur peuvent créer/modifier les variables d'espace de travail
- Les variables personnelles sont toujours privées pour l'utilisateur individuel
```

--------------------------------------------------------------------------------

````
