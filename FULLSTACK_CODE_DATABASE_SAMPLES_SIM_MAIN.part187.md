---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 187
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 187 of 933)

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

---[FILE: video_generator.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/video_generator.mdx

```text
---
title: Générateur de vidéos
description: Générer des vidéos à partir de texte en utilisant l'IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="video_generator"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Créez des vidéos à partir de prompts textuels en utilisant des modèles d'IA de pointe des meilleurs fournisseurs. Le générateur de vidéos de Sim intègre des capacités puissantes et créatives de synthèse vidéo à votre flux de travail, prenant en charge divers modèles, formats d'image, résolutions, contrôles de caméra, audio natif, et des fonctionnalités avancées de style et de cohérence.

**Fournisseurs et modèles pris en charge :**

- **[Runway Gen-4](https://research.runwayml.com/gen2/)** (Runway ML) :  
  Runway est un pionnier dans la génération de texte en vidéo, connu pour ses modèles puissants comme Gen-2, Gen-3 et Gen-4. Le dernier modèle [Gen-4](https://research.runwayml.com/gen2/) (et Gen-4 Turbo pour des résultats plus rapides) prend en charge des mouvements plus réalistes, une meilleure cohérence du monde et des références visuelles pour les personnages, objets, styles et lieux. Supporte les formats 16:9, 9:16 et 1:1, des durées de 5 à 10 secondes, jusqu'à la résolution 4K, des préréglages de style et le téléchargement direct d'images de référence pour des générations cohérentes. Runway alimente des outils créatifs pour les cinéastes, studios et créateurs de contenu du monde entier.

- **[Google Veo](https://deepmind.google/technologies/veo/)** (Google DeepMind) :  
  [Veo](https://deepmind.google/technologies/veo/) est le modèle de génération vidéo de nouvelle génération de Google, offrant des vidéos de haute qualité avec audio natif jusqu'à 1080p et 16 secondes. Prend en charge les mouvements avancés, les effets cinématographiques et la compréhension nuancée du texte. Veo peut générer des vidéos avec son intégré—activant l'audio natif ainsi que des clips silencieux. Les options incluent le format 16:9, une durée variable, différents modèles (veo-3, veo-3.1) et des contrôles basés sur les prompts. Idéal pour la narration, la publicité, la recherche et l'idéation.

- **[Luma Dream Machine](https://lumalabs.ai/dream-machine)** (Luma AI) :  
  [Dream Machine](https://lumalabs.ai/dream-machine) produit des vidéos étonnamment réalistes et fluides à partir de texte. Il intègre un contrôle avancé de la caméra, des prompts de cinématographie et prend en charge les modèles ray-1 et ray-2. Dream Machine supporte des formats précis (16:9, 9:16, 1:1), des durées variables et la spécification de trajectoires de caméra pour une direction visuelle complexe. Luma est reconnu pour sa fidélité visuelle révolutionnaire et est soutenu par d'éminents chercheurs en vision par IA.

- **[MiniMax Hailuo-02](https://minimax.chat/)** (via [Fal.ai](https://fal.ai/)) :  
  [MiniMax Hailuo-02](https://minimax.chat/) est un modèle sophistiqué chinois de génération vidéo, disponible mondialement via [Fal.ai](https://fal.ai/). Générez des vidéos jusqu'à 16 secondes en format paysage ou portrait, avec des options d'optimisation de prompt pour améliorer la clarté et la créativité. Points d'accès pro et standard disponibles, prenant en charge des hautes résolutions (jusqu'à 1920×1080). Bien adapté pour les projets créatifs nécessitant une traduction et une optimisation de prompt, la narration commerciale et le prototypage rapide d'idées visuelles.

**Comment choisir :**  
Sélectionnez votre fournisseur et modèle selon vos besoins en matière de qualité, vitesse, durée, audio, coût et fonctionnalités uniques. Runway et Veo offrent un réalisme et des capacités cinématographiques de premier ordre ; Luma excelle dans la fluidité du mouvement et le contrôle de la caméra ; MiniMax est idéal pour les prompts en langue chinoise et offre un accès rapide et abordable. Tenez compte de la prise en charge des références, des préréglages de style, des exigences audio et des tarifs lors de la sélection de votre outil.

Pour plus de détails sur les fonctionnalités, les restrictions, les tarifs et les avancées des modèles, consultez la documentation officielle de chaque fournisseur ci-dessus.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Générez des vidéos de haute qualité à partir de prompts textuels en utilisant les principaux fournisseurs d'IA. Prend en charge plusieurs modèles, formats d'image, résolutions et fonctionnalités spécifiques aux fournisseurs comme la cohérence du monde, les contrôles de caméra et la génération audio.

## Outils

### `video_runway`

Générer des vidéos avec Runway Gen-4 avec cohérence du monde et références visuelles

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `provider` | string | Oui | Fournisseur vidéo \(runway\) |
| `apiKey` | string | Oui | Clé API Runway |
| `model` | string | Non | Modèle Runway : gen-4 \(par défaut, qualité supérieure\) ou gen-4-turbo \(plus rapide\) |
| `prompt` | string | Oui | Prompt textuel décrivant la vidéo à générer |
| `duration` | number | Non | Durée de la vidéo en secondes \(5 ou 10, par défaut : 5\) |
| `aspectRatio` | string | Non | Format d'image : 16:9 \(paysage\), 9:16 \(portrait\), ou 1:1 \(carré\) |
| `resolution` | string | Non | Résolution vidéo \(sortie 720p\). Remarque : Gen-4 Turbo produit nativement en 720p |
| `visualReference` | json | Oui | Image de référence OBLIGATOIRE pour Gen-4 \(objet UserFile\). Gen-4 prend uniquement en charge la conversion d'image en vidéo, pas la génération uniquement textuelle |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL de la vidéo générée |
| `videoFile` | json | Objet du fichier vidéo avec métadonnées |
| `duration` | number | Durée de la vidéo en secondes |
| `width` | number | Largeur de la vidéo en pixels |
| `height` | number | Hauteur de la vidéo en pixels |
| `provider` | string | Fournisseur utilisé \(runway\) |
| `model` | string | Modèle utilisé |
| `jobId` | string | ID de tâche Runway |

### `video_veo`

Générer des vidéos avec Google Veo 3/3.1 avec génération audio native

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Oui | Fournisseur de vidéo \(veo\) |
| `apiKey` | string | Oui | Clé API Google Gemini |
| `model` | string | Non | Modèle Veo : veo-3 \(par défaut, qualité maximale\), veo-3-fast \(plus rapide\), ou veo-3.1 \(le plus récent\) |
| `prompt` | string | Oui | Instruction textuelle décrivant la vidéo à générer |
| `duration` | number | Non | Durée de la vidéo en secondes \(4, 6, ou 8, par défaut : 8\) |
| `aspectRatio` | string | Non | Format d'image : 16:9 \(paysage\) ou 9:16 \(portrait\) |
| `resolution` | string | Non | Résolution vidéo : 720p ou 1080p \(par défaut : 1080p\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL de la vidéo générée |
| `videoFile` | json | Objet du fichier vidéo avec métadonnées |
| `duration` | number | Durée de la vidéo en secondes |
| `width` | number | Largeur de la vidéo en pixels |
| `height` | number | Hauteur de la vidéo en pixels |
| `provider` | string | Fournisseur utilisé \(veo\) |
| `model` | string | Modèle utilisé |
| `jobId` | string | ID de tâche Veo |

### `video_luma`

Générer des vidéos en utilisant Luma Dream Machine avec des contrôles de caméra avancés

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Oui | Fournisseur de vidéo \(luma\) |
| `apiKey` | string | Oui | Clé API Luma AI |
| `model` | string | Non | Modèle Luma : ray-2 \(par défaut\) |
| `prompt` | string | Oui | Texte décrivant la vidéo à générer |
| `duration` | number | Non | Durée de la vidéo en secondes \(5 ou 9, par défaut : 5\) |
| `aspectRatio` | string | Non | Format d'image : 16:9 \(paysage\), 9:16 \(portrait\), ou 1:1 \(carré\) |
| `resolution` | string | Non | Résolution vidéo : 540p, 720p, ou 1080p \(par défaut : 1080p\) |
| `cameraControl` | json | Non | Contrôles de caméra sous forme de tableau d'objets concept. Format : \[\{ "key": "concept_name" \}\]. Clés valides : truck_left, truck_right, pan_left, pan_right, tilt_up, tilt_down, zoom_in, zoom_out, push_in, pull_out, orbit_left, orbit_right, crane_up, crane_down, static, handheld, et plus de 20 autres options prédéfinies |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL de la vidéo générée |
| `videoFile` | json | Objet fichier vidéo avec métadonnées |
| `duration` | number | Durée de la vidéo en secondes |
| `width` | number | Largeur de la vidéo en pixels |
| `height` | number | Hauteur de la vidéo en pixels |
| `provider` | string | Fournisseur utilisé \(luma\) |
| `model` | string | Modèle utilisé |
| `jobId` | string | ID de tâche Luma |

### `video_minimax`

Générez des vidéos en utilisant MiniMax Hailuo via l'API de la plateforme MiniMax avec un réalisme avancé et une optimisation des instructions

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | chaîne | Oui | Fournisseur de vidéo \(minimax\) |
| `apiKey` | chaîne | Oui | Clé API MiniMax de platform.minimax.io |
| `model` | chaîne | Non | Modèle MiniMax : hailuo-02 \(par défaut\) |
| `prompt` | chaîne | Oui | Instruction textuelle décrivant la vidéo à générer |
| `duration` | nombre | Non | Durée de la vidéo en secondes \(6 ou 10, par défaut : 6\) |
| `promptOptimizer` | booléen | Non | Activer l'optimisation des instructions pour de meilleurs résultats \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | chaîne | URL de la vidéo générée |
| `videoFile` | json | Objet fichier vidéo avec métadonnées |
| `duration` | nombre | Durée de la vidéo en secondes |
| `width` | nombre | Largeur de la vidéo en pixels |
| `height` | nombre | Hauteur de la vidéo en pixels |
| `provider` | chaîne | Fournisseur utilisé \(minimax\) |
| `model` | chaîne | Modèle utilisé |
| `jobId` | chaîne | ID de tâche MiniMax |

### `video_falai`

Générez des vidéos en utilisant la plateforme Fal.ai avec accès à plusieurs modèles dont Veo 3.1, Sora 2, Kling 2.5, MiniMax Hailuo, et plus encore

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | chaîne | Oui | Fournisseur de vidéo \(falai\) |
| `apiKey` | chaîne | Oui | Clé API Fal.ai |
| `model` | chaîne | Oui | Modèle Fal.ai : veo-3.1 \(Google Veo 3.1\), sora-2 \(OpenAI Sora 2\), kling-2.5-turbo-pro \(Kling 2.5 Turbo Pro\), kling-2.1-pro \(Kling 2.1 Master\), minimax-hailuo-2.3-pro \(MiniMax Hailuo Pro\), minimax-hailuo-2.3-standard \(MiniMax Hailuo Standard\), wan-2.1 \(WAN T2V\), ltxv-0.9.8 \(LTXV 13B\) |
| `prompt` | chaîne | Oui | Instruction textuelle décrivant la vidéo à générer |
| `duration` | nombre | Non | Durée de la vidéo en secondes \(varie selon le modèle\) |
| `aspectRatio` | chaîne | Non | Format d'image \(varie selon le modèle\) : 16:9, 9:16, 1:1 |
| `resolution` | chaîne | Non | Résolution vidéo \(varie selon le modèle\) : 540p, 720p, 1080p |
| `promptOptimizer` | booléen | Non | Activer l'optimisation des instructions pour les modèles MiniMax \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL de la vidéo générée |
| `videoFile` | json | Objet du fichier vidéo avec métadonnées |
| `duration` | number | Durée de la vidéo en secondes |
| `width` | number | Largeur de la vidéo en pixels |
| `height` | number | Hauteur de la vidéo en pixels |
| `provider` | string | Fournisseur utilisé \(falai\) |
| `model` | string | Modèle utilisé |
| `jobId` | string | ID de tâche |

## Notes

- Catégorie : `tools`
- Type : `video_generator`
```

--------------------------------------------------------------------------------

---[FILE: vision.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/vision.mdx

```text
---
title: Vision
description: Analysez des images avec des modèles de vision
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="vision"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
Vision est un outil qui vous permet d'analyser des images avec des modèles de vision.

Avec Vision, vous pouvez :

- **Analyser des images** : Analyser des images avec des modèles de vision
- **Extraire du texte** : Extraire du texte à partir d'images
- **Identifier des objets** : Identifier des objets dans des images
- **Décrire des images** : Décrire des images en détail
- **Générer des images** : Générer des images à partir de texte

Dans Sim, l'intégration de Vision permet à vos agents d'analyser des images avec des modèles de vision dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation puissants qui nécessitent l'analyse d'images avec des modèles de vision. Vos agents peuvent analyser des images avec des modèles de vision, extraire du texte à partir d'images, identifier des objets dans des images, décrire des images en détail et générer des images à partir de texte. Cette intégration comble le fossé entre vos flux de travail IA et vos besoins d'analyse d'images, permettant des automatisations plus sophistiquées et centrées sur l'image. En connectant Sim avec Vision, vous pouvez créer des agents qui restent à jour avec les dernières informations, fournissent des réponses plus précises et offrent plus de valeur aux utilisateurs - le tout sans nécessiter d'intervention manuelle ou de code personnalisé.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer Vision dans le flux de travail. Peut analyser des images avec des modèles de vision. Nécessite une clé API.

## Outils

### `vision_tool`

Traitez et analysez des images en utilisant des modèles de vision avancés. Capable de comprendre le contenu des images, d'extraire du texte, d'identifier des objets et de fournir des descriptions visuelles détaillées.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Oui | Clé API pour le fournisseur de modèle sélectionné |
| `imageUrl` | string | Non | URL d'image accessible publiquement |
| `imageFile` | file | Non | Fichier image à analyser |
| `model` | string | Non | Modèle de vision à utiliser \(gpt-4o, claude-3-opus-20240229, etc\) |
| `prompt` | string | Non | Invite personnalisée pour l'analyse d'image |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Le contenu analysé et la description de l'image |
| `model` | string | Le modèle de vision qui a été utilisé pour l'analyse |
| `tokens` | number | Total des jetons utilisés pour l'analyse |
| `usage` | object | Répartition détaillée de l'utilisation des jetons |

## Notes

- Catégorie : `tools`
- Type : `vision`
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/wealthbox.mdx

```text
---
title: Wealthbox
description: Interagir avec Wealthbox
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wealthbox"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wealthbox](https://www.wealthbox.com/) est une plateforme CRM complète conçue spécifiquement pour les conseillers financiers et les professionnels de la gestion de patrimoine. Elle fournit un système centralisé pour gérer les relations clients, suivre les interactions et organiser les flux de travail dans le secteur des services financiers.

Avec Wealthbox, vous pouvez :

- **Gérer les relations clients** : Stocker des informations de contact détaillées, des données contextuelles et l'historique des relations pour tous vos clients
- **Suivre les interactions** : Créer et maintenir des notes concernant les réunions, les appels et autres points de contact avec les clients
- **Organiser les tâches** : Planifier et gérer les activités de suivi, les échéances et les actions importantes
- **Documenter les flux de travail** : Conserver des enregistrements complets des communications clients et des processus métier
- **Accéder aux données clients** : Récupérer rapidement des informations grâce à une gestion organisée des contacts et des capacités de recherche
- **Automatiser les suivis** : Définir des rappels et planifier des tâches pour assurer un engagement client cohérent

Dans Sim, l'intégration de Wealthbox permet à vos agents d'interagir de manière transparente avec vos données CRM grâce à l'authentification OAuth. Cela permet des scénarios d'automatisation puissants comme la création automatique de notes client à partir de transcriptions de réunions, la mise à jour des informations de contact, la planification de tâches de suivi et la récupération de détails client pour des communications personnalisées. Vos agents peuvent lire les notes, contacts et tâches existants pour comprendre l'historique client, tout en créant de nouvelles entrées pour maintenir des dossiers à jour. Cette intégration comble le fossé entre vos flux de travail IA et votre gestion de la relation client, permettant la saisie automatisée de données, des insights clients intelligents et des processus administratifs rationalisés qui libèrent du temps pour des activités à plus forte valeur ajoutée face aux clients.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Wealthbox dans le flux de travail. Peut lire et écrire des notes, lire et écrire des contacts, et lire et écrire des tâches. Nécessite OAuth.

## Outils

### `wealthbox_read_note`

Lire le contenu d'une note Wealthbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `noteId` | chaîne | Non | L'identifiant de la note à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données et métadonnées de la note |

### `wealthbox_write_note`

Créer ou mettre à jour une note Wealthbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `content` | chaîne | Oui | Le corps principal de la note |
| `contactId` | chaîne | Non | Identifiant du contact à lier à cette note |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données et métadonnées de la note créée ou mise à jour |

### `wealthbox_read_contact`

Lire le contenu d'un contact Wealthbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `contactId` | chaîne | Non | L'identifiant du contact à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données et métadonnées du contact |

### `wealthbox_write_contact`

Créer un nouveau contact Wealthbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `firstName` | chaîne | Oui | Le prénom du contact |
| `lastName` | chaîne | Oui | Le nom de famille du contact |
| `emailAddress` | chaîne | Non | L'adresse e-mail du contact |
| `backgroundInformation` | chaîne | Non | Informations générales sur le contact |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données et métadonnées du contact créé ou mis à jour |

### `wealthbox_read_task`

Lire le contenu d'une tâche Wealthbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | chaîne | Non | L'identifiant de la tâche à lire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données et métadonnées de la tâche |

### `wealthbox_write_task`

Créer ou mettre à jour une tâche Wealthbox

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `title` | chaîne | Oui | Le nom/titre de la tâche |
| `dueDate` | chaîne | Oui | La date et l'heure d'échéance de la tâche \(format : "AAAA-MM-JJ HH:MM AM/PM -HHMM", ex. : "2015-05-24 11:00 AM -0400"\) |
| `contactId` | chaîne | Non | ID du contact à lier à cette tâche |
| `description` | chaîne | Non | Description ou notes concernant la tâche |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données et métadonnées de la tâche créée ou mise à jour |

## Notes

- Catégorie : `tools`
- Type : `wealthbox`
```

--------------------------------------------------------------------------------

---[FILE: webflow.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/webflow.mdx

```text
---
title: Webflow
description: Gérer les collections CMS de Webflow
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webflow"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Webflow](https://webflow.com/) est une plateforme puissante de conception web visuelle qui vous permet de créer des sites web responsifs sans écrire de code. Elle combine une interface de conception visuelle avec un CMS (système de gestion de contenu) robuste qui vous permet de créer, gérer et publier du contenu dynamique pour vos sites web.

Avec Webflow, vous pouvez :

- **Concevoir visuellement** : créer des sites web personnalisés avec un éditeur visuel qui génère du code HTML/CSS propre et sémantique
- **Gérer du contenu dynamiquement** : utiliser le CMS pour créer des collections de contenu structuré comme des articles de blog, des produits, des membres d'équipe ou toute donnée personnalisée
- **Publier instantanément** : déployer vos sites sur l'hébergement de Webflow ou exporter le code pour un hébergement personnalisé
- **Créer des designs responsifs** : construire des sites qui fonctionnent parfaitement sur ordinateur, tablette et appareils mobiles
- **Personnaliser les collections** : définir des champs personnalisés et des structures de données pour vos types de contenu
- **Automatiser les mises à jour de contenu** : gérer programmatiquement votre contenu CMS via des API

Dans Sim, l'intégration Webflow permet à vos agents d'interagir de manière transparente avec vos collections CMS Webflow grâce à l'authentification API. Cela permet des scénarios d'automatisation puissants tels que la création automatique d'articles de blog à partir de contenu généré par IA, la mise à jour d'informations sur les produits, la gestion des profils des membres de l'équipe et la récupération d'éléments CMS pour la génération de contenu dynamique. Vos agents peuvent lister les éléments existants pour parcourir votre contenu, récupérer des éléments spécifiques par ID, créer de nouvelles entrées pour ajouter du contenu frais, mettre à jour des éléments existants pour maintenir les informations à jour et supprimer du contenu obsolète. Cette intégration comble le fossé entre vos flux de travail IA et votre CMS Webflow, permettant une gestion automatisée du contenu, des mises à jour dynamiques de sites web et des flux de travail de contenu rationalisés qui maintiennent vos sites frais et à jour sans intervention manuelle.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intègre le CMS Webflow dans le flux de travail. Peut créer, obtenir, lister, mettre à jour ou supprimer des éléments dans les collections CMS Webflow. Gérez votre contenu Webflow par programmation. Peut être utilisé en mode déclencheur pour lancer des flux de travail lorsque les éléments de collection changent ou lorsque des formulaires sont soumis.

## Outils

### `webflow_list_items`

Lister tous les éléments d'une collection CMS Webflow

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteId` | string | Oui | ID du site Webflow |
| `collectionId` | string | Oui | ID de la collection |
| `offset` | number | Non | Décalage pour la pagination \(facultatif\) |
| `limit` | number | Non | Nombre maximum d'éléments à retourner \(facultatif, par défaut : 100\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | json | Tableau des éléments de la collection |
| `metadata` | json | Métadonnées sur la requête |

### `webflow_get_item`

Obtenir un seul élément d'une collection CMS Webflow

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteId` | string | Oui | ID du site Webflow |
| `collectionId` | string | Oui | ID de la collection |
| `itemId` | string | Oui | ID de l'élément à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `item` | json | L'objet de l'élément récupéré |
| `metadata` | json | Métadonnées sur l'élément récupéré |

### `webflow_create_item`

Créer un nouvel élément dans une collection CMS Webflow

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteId` | string | Oui | ID du site Webflow |
| `collectionId` | string | Oui | ID de la collection |
| `fieldData` | json | Oui | Données des champs pour le nouvel élément sous forme d'objet JSON. Les clés doivent correspondre aux noms des champs de la collection. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `item` | json | L'objet de l'élément créé |
| `metadata` | json | Métadonnées concernant l'élément créé |

### `webflow_update_item`

Mettre à jour un élément existant dans une collection CMS Webflow

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteId` | string | Oui | ID du site Webflow |
| `collectionId` | string | Oui | ID de la collection |
| `itemId` | string | Oui | ID de l'élément à mettre à jour |
| `fieldData` | json | Oui | Données des champs à mettre à jour sous forme d'objet JSON. N'incluez que les champs que vous souhaitez modifier. |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `item` | json | L'objet de l'élément mis à jour |
| `metadata` | json | Métadonnées concernant l'élément mis à jour |

### `webflow_delete_item`

Supprimer un élément d'une collection CMS Webflow

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `siteId` | string | Oui | ID du site Webflow |
| `collectionId` | string | Oui | ID de la collection |
| `itemId` | string | Oui | ID de l'élément à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si la suppression a réussi |
| `metadata` | json | Métadonnées concernant la suppression |

## Notes

- Catégorie : `tools`
- Type : `webflow`
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/webhook.mdx

```text
---
title: Webhook
description: Déclencher l'exécution de flux de travail à partir de webhooks externes
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webhook"
  color="#10B981"
/>

## Notes

- Catégorie : `triggers`
- Type : `webhook`
```

--------------------------------------------------------------------------------

---[FILE: whatsapp.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/whatsapp.mdx

```text
---
title: WhatsApp
description: Envoyer des messages WhatsApp
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="whatsapp"
  color="#25D366"
/>

{/* MANUAL-CONTENT-START:intro */}
[WhatsApp](https://www.whatsapp.com/) est une plateforme de messagerie mondialement populaire qui permet une communication sécurisée et fiable entre les individus et les entreprises.

L'API WhatsApp Business offre aux organisations de puissantes capacités pour :

- **Engager les clients** : envoyer des messages personnalisés, des notifications et des mises à jour directement sur l'application de messagerie préférée des clients
- **Automatiser les conversations** : créer des chatbots interactifs et des systèmes de réponse automatisés pour les demandes courantes
- **Améliorer le support** : fournir un service client en temps réel via une interface familière avec prise en charge de médias riches
- **Générer des conversions** : faciliter les transactions et les suivis avec les clients dans un environnement sécurisé et conforme

Dans Sim, l'intégration WhatsApp permet à vos agents d'exploiter ces capacités de messagerie dans le cadre de leurs flux de travail. Cela crée des opportunités pour des scénarios sophistiqués d'engagement client comme les rappels de rendez-vous, les codes de vérification, les alertes et les conversations interactives. L'intégration comble le fossé entre vos flux de travail IA et les canaux de communication client, permettant à vos agents de délivrer des informations opportunes et pertinentes directement sur les appareils mobiles des utilisateurs. En connectant Sim avec WhatsApp, vous pouvez construire des agents intelligents qui engagent les clients via leur plateforme de messagerie préférée, améliorant l'expérience utilisateur tout en automatisant les tâches de messagerie routinières.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer WhatsApp dans le flux de travail. Peut envoyer des messages.

## Outils

### `whatsapp_send_message`

Envoyer des messages WhatsApp

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `phoneNumber` | chaîne | Oui | Numéro de téléphone du destinataire avec l'indicatif du pays |
| `message` | chaîne | Oui | Contenu du message à envoyer |
| `phoneNumberId` | chaîne | Oui | ID du numéro de téléphone WhatsApp Business |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite d'envoi du message WhatsApp |
| `messageId` | chaîne | Identifiant unique du message WhatsApp |
| `phoneNumber` | chaîne | Numéro de téléphone du destinataire |
| `status` | chaîne | Statut de livraison du message |
| `timestamp` | chaîne | Horodatage d'envoi du message |

## Remarques

- Catégorie : `tools`
- Type : `whatsapp`
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/wikipedia.mdx

```text
---
title: Wikipedia
description: Rechercher et récupérer du contenu depuis Wikipedia
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wikipedia"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wikipedia](https://www.wikipedia.org/) est la plus grande encyclopédie gratuite en ligne au monde, offrant des millions d'articles sur une vaste gamme de sujets, rédigés et maintenus de manière collaborative par des bénévoles.

Avec Wikipedia, vous pouvez :

- **Rechercher des articles** : trouvez des pages Wikipedia pertinentes en recherchant des mots-clés ou des sujets
- **Obtenir des résumés d'articles** : récupérez des résumés concis des pages Wikipedia pour une référence rapide
- **Accéder au contenu complet** : obtenez le contenu intégral des articles Wikipedia pour des informations approfondies
- **Découvrir des articles aléatoires** : explorez de nouveaux sujets en récupérant des pages Wikipedia au hasard

Dans Sim, l'intégration de Wikipedia permet à vos agents d'accéder et d'interagir programmatiquement avec le contenu de Wikipedia dans le cadre de leurs flux de travail. Les agents peuvent rechercher des articles, récupérer des résumés, obtenir le contenu complet des pages et découvrir des articles aléatoires, ce qui permet à vos automatisations de disposer d'informations fiables et à jour provenant de la plus grande encyclopédie du monde. Cette intégration est idéale pour des scénarios tels que la recherche, l'enrichissement de contenu, la vérification des faits et la découverte de connaissances, permettant à vos agents d'incorporer facilement les données de Wikipedia dans leurs processus de prise de décision et d'exécution des tâches.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Wikipédia dans le flux de travail. Permet d'obtenir le résumé d'une page, de rechercher des pages, d'obtenir le contenu d'une page et d'accéder à une page aléatoire.

## Outils

### `wikipedia_summary`

Obtenez un résumé et des métadonnées pour une page Wikipedia spécifique.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `pageTitle` | string | Oui | Titre de la page Wikipedia dont vous souhaitez obtenir le résumé |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `summary` | objet | Résumé et métadonnées de la page Wikipédia |

### `wikipedia_search`

Rechercher des pages Wikipédia par titre ou contenu.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | chaîne | Oui | Requête de recherche pour trouver des pages Wikipédia |
| `searchLimit` | nombre | Non | Nombre maximum de résultats à retourner \(par défaut : 10, max : 50\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `searchResults` | tableau | Tableau des pages Wikipédia correspondantes |

### `wikipedia_content`

Obtenir le contenu HTML complet d'une page Wikipédia.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `pageTitle` | chaîne | Oui | Titre de la page Wikipédia dont on veut obtenir le contenu |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | objet | Contenu HTML complet et métadonnées de la page Wikipédia |

### `wikipedia_random`

Obtenir une page Wikipédia aléatoire.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `randomPage` | objet | Données d'une page Wikipédia aléatoire |

## Notes

- Catégorie : `tools`
- Type : `wikipedia`
```

--------------------------------------------------------------------------------

````
