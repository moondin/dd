---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 186
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 186 of 933)

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

---[FILE: tts.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/tts.mdx

```text
---
title: Synthèse vocale
description: Convertir du texte en parole en utilisant des voix IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tts"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Convertissez du texte en parole naturelle en utilisant les dernières voix d'IA. Les outils de synthèse vocale (TTS) de Sim vous permettent de générer de l'audio à partir de texte écrit dans des dizaines de langues, avec un choix de voix expressives, de formats et de contrôles avancés comme la vitesse, le style, l'émotion, et plus encore.

**Fournisseurs et modèles pris en charge :**

- **[OpenAI Text-to-Speech](https://platform.openai.com/docs/guides/text-to-speech/voice-options)** (OpenAI) :  
  L'API TTS d'OpenAI offre des voix ultra-réalistes utilisant des modèles d'IA avancés comme `tts-1`, `tts-1-hd`, et `gpt-4o-mini-tts`. Les voix incluent des options masculines et féminines, comme alloy, echo, fable, onyx, nova, shimmer, ash, ballad, coral, sage et verse. Prend en charge plusieurs formats audio (mp3, opus, aac, flac, wav, pcm), vitesse ajustable et synthèse en streaming.

- **[Deepgram Aura](https://deepgram.com/products/text-to-speech)** (Deepgram Inc.) :  
  Aura de Deepgram fournit des voix IA expressives en anglais et multilingues, optimisées pour la clarté conversationnelle, la faible latence et la personnalisation. Des modèles comme `aura-asteria-en`, `aura-luna-en`, et d'autres sont disponibles. Prend en charge plusieurs formats d'encodage (linear16, mp3, opus, aac, flac) et permet d'ajuster la vitesse, la fréquence d'échantillonnage et le style.

- **[ElevenLabs Text-to-Speech](https://elevenlabs.io/text-to-speech)** (ElevenLabs) :  
  ElevenLabs est leader dans la synthèse vocale réaliste et émotionnellement riche, offrant des dizaines de voix dans plus de 29 langues et la possibilité de cloner des voix personnalisées. Les modèles prennent en charge la conception vocale, la synthèse de parole et l'accès direct à l'API, avec des contrôles avancés pour le style, l'émotion, la stabilité et la similarité. Convient aux livres audio, à la création de contenu, à l'accessibilité et plus encore.

- **[Cartesia TTS](https://docs.cartesia.ai/)** (Cartesia) :  
  Cartesia offre une synthèse vocale de haute qualité, rapide et sécurisée avec un accent sur la confidentialité et le déploiement flexible. Il fournit un streaming instantané, une synthèse en temps réel et prend en charge plusieurs voix et accents internationaux, accessibles via une API simple.

- **[Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)** (Google Cloud) :  
  Google utilise les modèles DeepMind WaveNet et Neural2 pour alimenter des voix haute-fidélité dans plus de 50 langues et variantes. Les fonctionnalités comprennent la sélection de voix, la hauteur, la vitesse d'élocution, le contrôle du volume, les balises SSML et l'accès aux voix standard et premium de qualité studio. Largement utilisé pour l'accessibilité, l'IVR et les médias.

- **[Microsoft Azure Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)** (Microsoft Azure) :  
  Azure propose plus de 400 voix neurales dans plus de 140 langues et régions, avec des personnalisations uniques de voix, de style, d'émotion, de rôle et des contrôles en temps réel. Offre la prise en charge SSML pour la prononciation, l'intonation et plus encore. Idéal pour les besoins TTS mondiaux, d'entreprise ou créatifs.

- **[PlayHT](https://play.ht/)** (PlayHT) :  
  PlayHT se spécialise dans la synthèse vocale réaliste, le clonage de voix et la lecture en streaming instantanée avec plus de 800 voix dans plus de 100 langues. Les fonctionnalités incluent le contrôle des émotions, de la hauteur et de la vitesse, l'audio multi-voix et la création de voix personnalisées via l'API ou le studio en ligne.

**Comment choisir :**  
Sélectionnez votre fournisseur et votre modèle en priorisant les langues, les types de voix pris en charge, les formats souhaités (mp3, wav, etc.), la granularité du contrôle (vitesse, émotion, etc.) et les fonctionnalités spécialisées (clonage de voix, accent, streaming). Pour les cas d'utilisation créatifs, d'accessibilité ou de développement, assurez-vous de la compatibilité avec les exigences de votre application et comparez les coûts.

Visitez le site officiel de chaque fournisseur pour obtenir des informations à jour sur les capacités, les tarifs et la documentation !
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Générez des discours naturels à partir de texte en utilisant des voix IA de pointe d'OpenAI, Deepgram, ElevenLabs, Cartesia, Google Cloud, Azure et PlayHT. Prend en charge plusieurs voix, langues et formats audio.

## Outils

### `tts_openai`

Convertir du texte en discours à l'aide des modèles TTS d'OpenAI

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Oui | Le texte à convertir en discours |
| `apiKey` | string | Oui | Clé API OpenAI |
| `model` | string | Non | Modèle TTS à utiliser \(tts-1, tts-1-hd, ou gpt-4o-mini-tts\) |
| `voice` | string | Non | Voix à utiliser \(alloy, ash, ballad, cedar, coral, echo, marin, sage, shimmer, verse\) |
| `responseFormat` | string | Non | Format audio \(mp3, opus, aac, flac, wav, pcm\) |
| `speed` | number | Non | Vitesse d'élocution \(0,25 à 4,0, par défaut : 1,0\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL vers le fichier audio généré |
| `audioFile` | file | Objet du fichier audio généré |
| `duration` | number | Durée de l'audio en secondes |
| `characterCount` | number | Nombre de caractères traités |
| `format` | string | Format audio |
| `provider` | string | Fournisseur TTS utilisé |

### `tts_deepgram`

Convertir du texte en parole en utilisant Deepgram Aura

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `text` | string | Oui | Le texte à convertir en parole |
| `apiKey` | string | Oui | Clé API Deepgram |
| `model` | string | Non | Modèle/voix Deepgram (ex. : aura-asteria-en, aura-luna-en) |
| `voice` | string | Non | Identifiant de voix (alternative au paramètre modèle) |
| `encoding` | string | Non | Encodage audio (linear16, mp3, opus, aac, flac) |
| `sampleRate` | number | Non | Taux d'échantillonnage (8000, 16000, 24000, 48000) |
| `bitRate` | number | Non | Débit binaire pour les formats compressés |
| `container` | string | Non | Format de conteneur (none, wav, ogg) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL vers le fichier audio généré |
| `audioFile` | file | Objet du fichier audio généré |
| `duration` | number | Durée de l'audio en secondes |
| `characterCount` | number | Nombre de caractères traités |
| `format` | string | Format audio |
| `provider` | string | Fournisseur TTS utilisé |

### `tts_elevenlabs`

Convertir du texte en parole en utilisant les voix ElevenLabs

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `text` | chaîne | Oui | Le texte à convertir en parole |
| `voiceId` | chaîne | Oui | L'identifiant de la voix à utiliser |
| `apiKey` | chaîne | Oui | Clé API ElevenLabs |
| `modelId` | chaîne | Non | Modèle à utiliser \(ex. : eleven_monolingual_v1, eleven_turbo_v2_5, eleven_flash_v2_5\) |
| `stability` | nombre | Non | Stabilité de la voix \(0.0 à 1.0, par défaut : 0.5\) |
| `similarityBoost` | nombre | Non | Amplification de similarité \(0.0 à 1.0, par défaut : 0.8\) |
| `style` | nombre | Non | Exagération du style \(0.0 à 1.0\) |
| `useSpeakerBoost` | booléen | Non | Utiliser l'amplification du locuteur \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | chaîne | URL vers le fichier audio généré |
| `audioFile` | fichier | Objet du fichier audio généré |
| `duration` | nombre | Durée audio en secondes |
| `characterCount` | nombre | Nombre de caractères traités |
| `format` | chaîne | Format audio |
| `provider` | chaîne | Fournisseur TTS utilisé |

### `tts_cartesia`

Convertir du texte en parole en utilisant Cartesia Sonic (latence ultra-faible)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `text` | chaîne | Oui | Le texte à convertir en parole |
| `apiKey` | chaîne | Oui | Clé API Cartesia |
| `modelId` | chaîne | Non | ID du modèle \(sonic-english, sonic-multilingual\) |
| `voice` | chaîne | Non | ID de voix ou embedding |
| `language` | chaîne | Non | Code de langue \(en, es, fr, de, it, pt, etc.\) |
| `outputFormat` | json | Non | Configuration du format de sortie \(container, encoding, sampleRate\) |
| `speed` | nombre | Non | Multiplicateur de vitesse |
| `emotion` | tableau | Non | Tags d'émotion pour Sonic-3 \(ex. : \['positivity:high'\]\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL vers le fichier audio généré |
| `audioFile` | file | Objet du fichier audio généré |
| `duration` | number | Durée de l'audio en secondes |
| `characterCount` | number | Nombre de caractères traités |
| `format` | string | Format audio |
| `provider` | string | Fournisseur TTS utilisé |

### `tts_google`

Convertir du texte en parole en utilisant Google Cloud Text-to-Speech

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `text` | string | Oui | Le texte à convertir en parole |
| `apiKey` | string | Oui | Clé API Google Cloud |
| `voiceId` | string | Non | ID de voix (ex. : en-US-Neural2-A, en-US-Wavenet-D) |
| `languageCode` | string | Oui | Code de langue (ex. : en-US, es-ES, fr-FR) |
| `gender` | string | Non | Genre de voix (MALE, FEMALE, NEUTRAL) |
| `audioEncoding` | string | Non | Encodage audio (LINEAR16, MP3, OGG_OPUS, MULAW, ALAW) |
| `speakingRate` | number | Non | Débit de parole (0,25 à 2,0, par défaut : 1,0) |
| `pitch` | number | Non | Hauteur de la voix (-20,0 à 20,0, par défaut : 0,0) |
| `volumeGainDb` | number | Non | Gain de volume en dB (-96,0 à 16,0) |
| `sampleRateHertz` | number | Non | Taux d'échantillonnage en Hz |
| `effectsProfileId` | array | Non | Profil d'effets (ex. : ['headphone-class-device']) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL vers le fichier audio généré |
| `audioFile` | file | Objet du fichier audio généré |
| `duration` | number | Durée de l'audio en secondes |
| `characterCount` | number | Nombre de caractères traités |
| `format` | string | Format audio |
| `provider` | string | Fournisseur TTS utilisé |

### `tts_azure`

Convertir du texte en parole en utilisant Azure Cognitive Services

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Oui | Le texte à convertir en parole |
| `apiKey` | string | Oui | Clé API d'Azure Speech Services |
| `voiceId` | string | Non | ID de voix (ex. : en-US-JennyNeural, en-US-GuyNeural) |
| `region` | string | Non | Région Azure (ex. : eastus, westus, westeurope) |
| `outputFormat` | string | Non | Format audio de sortie |
| `rate` | string | Non | Débit de parole (ex. : +10%, -20%, 1.5) |
| `pitch` | string | Non | Hauteur de la voix (ex. : +5Hz, -2st, low) |
| `style` | string | Non | Style de parole (ex. : joyeux, triste, en colère - voix neurales uniquement) |
| `styleDegree` | number | Non | Intensité du style (0.01 à 2.0) |
| `role` | string | Non | Rôle (ex. : fille, garçon, jeune femme adulte) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL vers le fichier audio généré |
| `audioFile` | file | Objet du fichier audio généré |
| `duration` | number | Durée de l'audio en secondes |
| `characterCount` | number | Nombre de caractères traités |
| `format` | string | Format audio |
| `provider` | string | Fournisseur TTS utilisé |

### `tts_playht`

Convertir du texte en parole avec PlayHT (clonage vocal)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `text` | chaîne | Oui | Le texte à convertir en parole |
| `apiKey` | chaîne | Oui | Clé API PlayHT \(en-tête AUTHORIZATION\) |
| `userId` | chaîne | Oui | ID utilisateur PlayHT \(en-tête X-USER-ID\) |
| `voice` | chaîne | Non | ID de voix ou URL du manifeste |
| `quality` | chaîne | Non | Niveau de qualité \(draft, standard, premium\) |
| `outputFormat` | chaîne | Non | Format de sortie \(mp3, wav, ogg, flac, mulaw\) |
| `speed` | nombre | Non | Multiplicateur de vitesse \(0,5 à 2,0\) |
| `temperature` | nombre | Non | Créativité/aléatoire \(0,0 à 2,0\) |
| `voiceGuidance` | nombre | Non | Stabilité de la voix \(1,0 à 6,0\) |
| `textGuidance` | nombre | Non | Adhérence au texte \(1,0 à 6,0\) |
| `sampleRate` | nombre | Non | Taux d'échantillonnage \(8000, 16000, 22050, 24000, 44100, 48000\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | chaîne | URL vers le fichier audio généré |
| `audioFile` | fichier | Objet du fichier audio généré |
| `duration` | nombre | Durée audio en secondes |
| `characterCount` | nombre | Nombre de caractères traités |
| `format` | chaîne | Format audio |
| `provider` | chaîne | Fournisseur TTS utilisé |

## Notes

- Catégorie : `tools`
- Type : `tts`
```

--------------------------------------------------------------------------------

---[FILE: twilio_sms.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/twilio_sms.mdx

```text
---
title: Twilio SMS
description: Envoyer des messages SMS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_sms"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio SMS](https://www.twilio.com/en-us/sms) est une plateforme de communication cloud puissante qui permet aux entreprises d'intégrer des fonctionnalités de messagerie dans leurs applications et services.

Twilio SMS fournit une API robuste pour l'envoi et la réception programmatiques de messages texte à l'échelle mondiale. Avec une couverture dans plus de 180 pays et un SLA de disponibilité de 99,999 %, Twilio s'est imposé comme un leader du secteur dans les technologies de communication.

Les fonctionnalités clés de Twilio SMS comprennent :

- **Portée mondiale** : envoyez des messages aux destinataires du monde entier avec des numéros de téléphone locaux dans plusieurs pays
- **Messagerie programmable** : personnalisez la livraison des messages avec des webhooks, des accusés de réception et des options de planification
- **Analyses avancées** : suivez les taux de livraison, les métriques d'engagement et optimisez vos campagnes de messagerie

Dans Sim, l'intégration de Twilio SMS permet à vos agents d'exploiter ces puissantes fonctionnalités de messagerie dans le cadre de leurs flux de travail. Cela crée des opportunités pour des scénarios sophistiqués d'engagement client comme les rappels de rendez-vous, les codes de vérification, les alertes et les conversations interactives. L'intégration comble le fossé entre vos flux de travail IA et les canaux de communication client, permettant à vos agents de délivrer des informations opportunes et pertinentes directement sur les appareils mobiles des utilisateurs. En connectant Sim avec Twilio SMS, vous pouvez construire des agents intelligents qui engagent les clients via leur canal de communication préféré, améliorant l'expérience utilisateur tout en automatisant les tâches de messagerie routinières.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrer Twilio dans le flux de travail. Peut envoyer des messages SMS.

## Outils

### `twilio_send_sms`

Envoyez des messages texte à un ou plusieurs destinataires en utilisant l'API Twilio.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `phoneNumbers` | chaîne | Oui | Numéros de téléphone auxquels envoyer le message, séparés par des sauts de ligne |
| `message` | chaîne | Oui | Message à envoyer |
| `accountSid` | chaîne | Oui | SID du compte Twilio |
| `authToken` | chaîne | Oui | Jeton d'authentification Twilio |
| `fromNumber` | chaîne | Oui | Numéro de téléphone Twilio à partir duquel envoyer le message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite d'envoi du SMS |
| `messageId` | chaîne | Identifiant unique du message Twilio \(SID\) |
| `status` | chaîne | Statut de livraison du message de Twilio |
| `fromNumber` | chaîne | Numéro de téléphone à partir duquel le message a été envoyé |
| `toNumber` | chaîne | Numéro de téléphone auquel le message a été envoyé |

## Remarques

- Catégorie : `tools`
- Type : `twilio_sms`
```

--------------------------------------------------------------------------------

---[FILE: twilio_voice.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/twilio_voice.mdx

```text
---
title: Twilio Voice
description: Passer et gérer des appels téléphoniques
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_voice"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio Voice](https://www.twilio.com/en-us/voice) est une puissante plateforme de communication cloud qui permet aux entreprises de passer, recevoir et gérer des appels téléphoniques de manière programmatique via une API simple.

Twilio Voice fournit une API robuste pour créer des applications vocales sophistiquées avec une portée mondiale. Avec une couverture dans plus de 100 pays, une fiabilité de niveau opérateur et un SLA de disponibilité de 99,95 %, Twilio s'est imposé comme le leader du secteur dans les communications vocales programmables.

Les fonctionnalités clés de Twilio Voice comprennent :

- **Réseau vocal mondial** : passez et recevez des appels dans le monde entier avec des numéros de téléphone locaux dans plusieurs pays
- **Contrôle d'appel programmable** : utilisez TwiML pour contrôler le flux d'appels, enregistrer des conversations, recueillir des entrées DTMF et mettre en œuvre des systèmes SVI
- **Capacités avancées** : reconnaissance vocale, synthèse vocale, transfert d'appel, conférence et détection de répondeur
- **Analyses en temps réel** : suivez la qualité des appels, la durée, les coûts et optimisez vos applications vocales

Dans Sim, l'intégration de Twilio Voice permet à vos agents d'exploiter ces puissantes capacités vocales dans le cadre de leurs flux de travail. Cela crée des opportunités pour des scénarios sophistiqués d'engagement client comme les rappels de rendez-vous, les appels de vérification, les lignes d'assistance automatisées et les systèmes de réponse vocale interactive. L'intégration comble le fossé entre vos flux de travail d'IA et les canaux de communication vocale, permettant à vos agents de fournir des informations opportunes et pertinentes directement par téléphone. En connectant Sim avec Twilio Voice, vous pouvez créer des agents intelligents qui interagissent avec les clients via leur canal de communication préféré, améliorant l'expérience utilisateur tout en automatisant les tâches d'appel routinières.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Twilio Voice dans le flux de travail. Effectuez des appels sortants et récupérez les enregistrements d'appels.

## Outils

### `twilio_voice_make_call`

Effectuer un appel téléphonique sortant à l'aide de l'API Twilio Voice.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Oui | Numéro de téléphone à appeler \(format E.164, par ex., +14155551234\) |
| `from` | string | Oui | Votre numéro de téléphone Twilio pour émettre l'appel \(format E.164\) |
| `url` | string | Non | URL qui renvoie les instructions TwiML pour l'appel |
| `twiml` | string | Non | Instructions TwiML à exécuter \(alternative à l'URL\). Utilisez des crochets au lieu des chevrons, par ex., \[Response\]\[Say\]Hello\[/Say\]\[/Response\] |
| `statusCallback` | string | Non | URL de webhook pour les mises à jour de statut d'appel |
| `statusCallbackMethod` | string | Non | Méthode HTTP pour le callback de statut \(GET ou POST\) |
| `accountSid` | string | Oui | SID du compte Twilio |
| `authToken` | string | Oui | Jeton d'authentification Twilio |
| `record` | boolean | Non | Indique si l'appel doit être enregistré |
| `recordingStatusCallback` | string | Non | URL de webhook pour les mises à jour de statut d'enregistrement |
| `timeout` | number | Non | Temps d'attente avant d'abandonner \(en secondes, par défaut : 60\) |
| `machineDetection` | string | Non | Détection de répondeur : Enable ou DetectMessageEnd |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'appel a été initié avec succès |
| `callSid` | string | Identifiant unique pour l'appel |
| `status` | string | Statut de l'appel \(en file d'attente, en sonnerie, en cours, terminé, etc.\) |
| `direction` | string | Direction de l'appel \(outbound-api\) |
| `from` | string | Numéro de téléphone d'origine de l'appel |
| `to` | string | Numéro de téléphone de destination de l'appel |
| `duration` | number | Durée de l'appel en secondes |
| `price` | string | Coût de l'appel |
| `priceUnit` | string | Devise du prix |
| `error` | string | Message d'erreur si l'appel a échoué |

### `twilio_voice_list_calls`

Récupérer une liste des appels émis et reçus d'un compte.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `accountSid` | string | Oui | SID du compte Twilio |
| `authToken` | string | Oui | Jeton d'authentification Twilio |
| `to` | string | Non | Filtrer par appels vers ce numéro de téléphone |
| `from` | string | Non | Filtrer par appels depuis ce numéro de téléphone |
| `status` | string | Non | Filtrer par statut d'appel \(en attente, sonnerie, en cours, terminé, etc.\) |
| `startTimeAfter` | string | Non | Filtrer les appels qui ont commencé à partir de cette date \(AAAA-MM-JJ\) |
| `startTimeBefore` | string | Non | Filtrer les appels qui ont commencé avant ou à cette date \(AAAA-MM-JJ\) |
| `pageSize` | number | Non | Nombre d'enregistrements à retourner \(max 1000, par défaut 50\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si les appels ont été récupérés avec succès |
| `calls` | array | Tableau d'objets d'appel |
| `total` | number | Nombre total d'appels retournés |
| `page` | number | Numéro de page actuel |
| `pageSize` | number | Nombre d'appels par page |
| `error` | string | Message d'erreur si la récupération a échoué |

### `twilio_voice_get_recording`

Récupérer les informations d'enregistrement d'appel et la transcription (si activée via TwiML).

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `recordingSid` | string | Oui | SID de l'enregistrement à récupérer |
| `accountSid` | string | Oui | SID du compte Twilio |
| `authToken` | string | Oui | Jeton d'authentification Twilio |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'enregistrement a été récupéré avec succès |
| `recordingSid` | string | Identifiant unique pour l'enregistrement |
| `callSid` | string | SID de l'appel auquel appartient cet enregistrement |
| `duration` | number | Durée de l'enregistrement en secondes |
| `status` | string | Statut de l'enregistrement \(terminé, en cours de traitement, etc.\) |
| `channels` | number | Nombre de canaux \(1 pour mono, 2 pour stéréo\) |
| `source` | string | Comment l'enregistrement a été créé |
| `mediaUrl` | string | URL pour télécharger le fichier média de l'enregistrement |
| `price` | string | Coût de l'enregistrement |
| `priceUnit` | string | Devise du prix |
| `uri` | string | URI relative de la ressource d'enregistrement |
| `transcriptionText` | string | Texte transcrit de l'enregistrement \(si disponible\) |
| `transcriptionStatus` | string | Statut de la transcription \(terminée, en cours, échouée\) |
| `transcriptionPrice` | string | Coût de la transcription |
| `transcriptionPriceUnit` | string | Devise du prix de la transcription |
| `error` | string | Message d'erreur si la récupération a échoué |

## Notes

- Catégorie : `tools`
- Type : `twilio_voice`
```

--------------------------------------------------------------------------------

---[FILE: typeform.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/typeform.mdx

```text
---
title: Typeform
description: Interagir avec Typeform
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="typeform"
  color="#262627"
/>

{/* MANUAL-CONTENT-START:intro */}
[Typeform](https://www.typeform.com/) est une plateforme conviviale pour créer des formulaires conversationnels, des sondages et des quiz avec un accent sur l'expérience utilisateur engageante.

Avec Typeform, vous pouvez :

- **Créer des formulaires interactifs** : concevoir de beaux formulaires conversationnels qui engagent les répondants avec une interface unique présentant une question à la fois
- **Personnaliser votre expérience** : utiliser la logique conditionnelle, les champs masqués et les thèmes personnalisés pour créer des parcours utilisateur personnalisés
- **Intégrer avec d'autres outils** : se connecter à plus de 1000 applications grâce aux intégrations natives et aux API
- **Analyser les données de réponse** : obtenir des informations exploitables grâce à des outils d'analyse et de reporting complets

Dans Sim, l'intégration Typeform permet à vos agents d'interagir programmatiquement avec vos données Typeform dans le cadre de leurs flux de travail. Les agents peuvent récupérer les réponses aux formulaires, traiter les données de soumission et incorporer directement les retours des utilisateurs dans les processus de prise de décision. Cette intégration est particulièrement précieuse pour des scénarios comme la qualification des prospects, l'analyse des retours clients et la personnalisation basée sur les données. En connectant Sim avec Typeform, vous pouvez créer des flux de travail d'automatisation intelligents qui transforment les réponses aux formulaires en informations exploitables - analysant le sentiment, catégorisant les retours, générant des résumés et même déclenchant des actions de suivi basées sur des modèles de réponse spécifiques.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Typeform dans le flux de travail. Permet de récupérer les réponses, télécharger des fichiers et obtenir des informations sur les formulaires. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'un formulaire est soumis. Nécessite une clé API.

## Outils

### `typeform_responses`

Récupérer les réponses aux formulaires depuis Typeform

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `formId` | string | Oui | ID du formulaire Typeform |
| `apiKey` | string | Oui | Token d'accès personnel Typeform |
| `pageSize` | number | Non | Nombre de réponses à récupérer \(par défaut : 25\) |
| `since` | string | Non | Récupérer les réponses soumises après cette date \(format ISO 8601\) |
| `until` | string | Non | Récupérer les réponses soumises avant cette date \(format ISO 8601\) |
| `completed` | string | Non | Filtrer par statut d'achèvement \(true/false\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `total_items` | nombre | Nombre total de réponses |
| `page_count` | nombre | Nombre total de pages disponibles |
| `items` | tableau | Tableau d'objets de réponse avec response_id, submitted_at, answers et metadata |

### `typeform_files`

Télécharger les fichiers importés dans les réponses Typeform

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `formId` | chaîne | Oui | ID du formulaire Typeform |
| `responseId` | chaîne | Oui | ID de réponse contenant les fichiers |
| `fieldId` | chaîne | Oui | ID unique du champ d'importation de fichier |
| `filename` | chaîne | Oui | Nom du fichier importé |
| `inline` | booléen | Non | Indique si le fichier doit être demandé avec Content-Disposition en ligne |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `fileUrl` | chaîne | URL de téléchargement direct pour le fichier importé |
| `contentType` | chaîne | Type MIME du fichier importé |
| `filename` | chaîne | Nom d'origine du fichier importé |

### `typeform_insights`

Récupérer les insights et analyses pour les formulaires Typeform

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `formId` | chaîne | Oui | ID du formulaire Typeform |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `fields` | array | Nombre d'utilisateurs qui ont abandonné à ce champ |

### `typeform_list_forms`

Récupérer la liste de tous les formulaires dans votre compte Typeform

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |
| `search` | chaîne | Non | Requête de recherche pour filtrer les formulaires par titre |
| `page` | nombre | Non | Numéro de page \(par défaut : 1\) |
| `pageSize` | nombre | Non | Nombre de formulaires par page \(par défaut : 10, max : 200\) |
| `workspaceId` | chaîne | Non | Filtrer les formulaires par ID d'espace de travail |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `total_items` | nombre | Nombre total de formulaires dans le compte |
| `page_count` | nombre | Nombre total de pages disponibles |
| `items` | tableau | Tableau d'objets de formulaire avec id, title, created_at, last_updated_at, settings, theme et _links |

### `typeform_get_form`

Récupérer les détails complets et la structure d'un formulaire spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |
| `formId` | chaîne | Oui | Identifiant unique du formulaire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | chaîne | Identifiant unique du formulaire |
| `title` | chaîne | Titre du formulaire |
| `type` | chaîne | Type de formulaire \(form, quiz, etc.\) |
| `settings` | objet | Paramètres du formulaire incluant langue, barre de progression, etc. |
| `theme` | objet | Référence du thème |
| `workspace` | objet | Référence de l'espace de travail |
| `fields` | tableau | Tableau des champs/questions du formulaire |
| `welcome_screens` | tableau | Tableau des écrans d'accueil |
| `thankyou_screens` | tableau | Tableau des écrans de remerciement |
| `_links` | objet | Liens vers les ressources associées, y compris l'URL publique du formulaire |

### `typeform_create_form`

Créer un nouveau formulaire avec champs et paramètres

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |
| `title` | chaîne | Oui | Titre du formulaire |
| `type` | chaîne | Non | Type de formulaire \(par défaut : "form"\). Options : "form", "quiz" |
| `workspaceId` | chaîne | Non | ID de l'espace de travail où créer le formulaire |
| `fields` | json | Non | Tableau d'objets de champs définissant la structure du formulaire. Chaque champ nécessite : type, titre et propriétés/validations optionnelles |
| `settings` | json | Non | Objet de paramètres du formulaire \(langue, barre de progression, etc.\) |
| `themeId` | chaîne | Non | ID du thème à appliquer au formulaire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | chaîne | Identifiant unique du formulaire créé |
| `title` | chaîne | Titre du formulaire |
| `type` | chaîne | Type de formulaire |
| `fields` | tableau | Tableau des champs du formulaire créé |
| `_links` | objet | Liens vers les ressources associées, y compris l'URL publique du formulaire |

### `typeform_update_form`

Mettre à jour un formulaire existant à l'aide d'opérations JSON Patch

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |
| `formId` | chaîne | Oui | Identifiant unique du formulaire à mettre à jour |
| `operations` | json | Oui | Tableau d'opérations JSON Patch \(RFC 6902\). Chaque opération nécessite : op \(add/remove/replace\), path, et value \(pour add/replace\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | chaîne | Identifiant unique du formulaire mis à jour |
| `title` | chaîne | Titre du formulaire |
| `type` | chaîne | Type de formulaire |
| `settings` | objet | Paramètres du formulaire |
| `theme` | objet | Référence du thème |
| `workspace` | objet | Référence de l'espace de travail |
| `fields` | tableau | Tableau des champs du formulaire |
| `welcome_screens` | tableau | Tableau des écrans d'accueil |
| `thankyou_screens` | tableau | Tableau des écrans de remerciement |
| `_links` | objet | Liens vers les ressources associées |

### `typeform_delete_form`

Supprimer définitivement un formulaire et toutes ses réponses

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton d'accès personnel Typeform |
| `formId` | chaîne | Oui | Identifiant unique du formulaire à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | booléen | Indique si le formulaire a été supprimé avec succès |
| `message` | chaîne | Message de confirmation de suppression |

## Notes

- Catégorie : `tools`
- Type : `typeform`
```

--------------------------------------------------------------------------------

````
