---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 52
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 52 of 933)

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
Location: sim-main/apps/docs/content/docs/de/tools/tts.mdx

```text
---
title: Text-zu-Sprache
description: Text mit KI-Stimmen in Sprache umwandeln
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tts"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Wandeln Sie Text in natürlich klingende Sprache mit den neuesten KI-Stimmen um. Die Text-zu-Sprache (TTS)-Tools von Sim ermöglichen es Ihnen, Audio aus geschriebenem Text in Dutzenden von Sprachen zu generieren, mit einer Auswahl an ausdrucksstarken Stimmen, Formaten und erweiterten Steuerungsmöglichkeiten wie Geschwindigkeit, Stil, Emotion und mehr.

**Unterstützte Anbieter & Modelle:**

- **[OpenAI Text-to-Speech](https://platform.openai.com/docs/guides/text-to-speech/voice-options)** (OpenAI):  
  OpenAIs TTS-API bietet ultra-realistische Stimmen mit fortschrittlichen KI-Modellen wie `tts-1`, `tts-1-hd` und `gpt-4o-mini-tts`. Die Stimmen umfassen sowohl männliche als auch weibliche Optionen wie alloy, echo, fable, onyx, nova, shimmer, ash, ballad, coral, sage und verse. Unterstützt werden verschiedene Audioformate (mp3, opus, aac, flac, wav, pcm), einstellbare Geschwindigkeit und Streaming-Synthese.

- **[Deepgram Aura](https://deepgram.com/products/text-to-speech)** (Deepgram Inc.):  
  Deepgrams Aura bietet ausdrucksstarke englische und mehrsprachige KI-Stimmen, optimiert für Gesprächsklarheit, geringe Latenz und Anpassungsfähigkeit. Modelle wie `aura-asteria-en`, `aura-luna-en` und andere stehen zur Verfügung. Unterstützt werden verschiedene Kodierungsformate (linear16, mp3, opus, aac, flac) und Feinabstimmung bei Geschwindigkeit, Abtastrate und Stil.

- **[ElevenLabs Text-to-Speech](https://elevenlabs.io/text-to-speech)** (ElevenLabs):  
  ElevenLabs führt im Bereich lebensechter, emotional reicher TTS und bietet Dutzende von Stimmen in über 29 Sprachen sowie die Möglichkeit, benutzerdefinierte Stimmen zu klonen. Die Modelle unterstützen Stimmdesign, Sprachsynthese und direkten API-Zugriff mit erweiterten Steuerungsmöglichkeiten für Stil, Emotion, Stabilität und Ähnlichkeit. Geeignet für Hörbücher, Content-Erstellung, Barrierefreiheit und mehr.

- **[Cartesia TTS](https://docs.cartesia.ai/)** (Cartesia):  
  Cartesia bietet hochwertige, schnelle und sichere Text-zu-Sprache-Umwandlung mit Fokus auf Datenschutz und flexibler Bereitstellung. Es ermöglicht sofortiges Streaming, Echtzeit-Synthese und unterstützt mehrere internationale Stimmen und Akzente, zugänglich über eine einfache API.

- **[Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)** (Google Cloud):  
  Google nutzt DeepMind WaveNet und Neural2-Modelle für hochwertige Stimmen in über 50 Sprachen und Varianten. Zu den Funktionen gehören Stimmauswahl, Tonhöhe, Sprechgeschwindigkeit, Lautstärkeregelung, SSML-Tags und Zugriff auf Standard- und Premium-Stimmen in Studioqualität. Wird häufig für Barrierefreiheit, IVR und Medien verwendet.

- **[Microsoft Azure Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)** (Microsoft Azure):  
  Azure bietet über 400 neuronale Stimmen in mehr als 140 Sprachen und Regionen mit einzigartiger Stimmanpassung, Stil, Emotion, Rolle und Echtzeit-Steuerung. Unterstützt SSML für Aussprache, Intonation und mehr. Ideal für globale, Unternehmens- oder kreative TTS-Anforderungen.

- **[PlayHT](https://play.ht/)** (PlayHT):  
  PlayHT spezialisiert sich auf realistische Sprachsynthese, Stimmklonen und sofortige Streaming-Wiedergabe mit über 800 Stimmen in mehr als 100 Sprachen. Zu den Funktionen gehören Emotions-, Tonhöhen- und Geschwindigkeitssteuerung, Mehrfachstimmen-Audio und benutzerdefinierte Stimmerstellung über die API oder das Online-Studio.

**Auswahlkriterien:**  
Wählen Sie Ihren Anbieter und das Modell, indem Sie Sprachen, unterstützte Stimmtypen, gewünschte Formate (mp3, wav usw.), Steuerungsgranularität (Geschwindigkeit, Emotion usw.) und spezielle Funktionen (Stimmklonen, Akzent, Streaming) priorisieren. Stellen Sie für kreative, Barrierefreiheits- oder Entwickleranwendungsfälle die Kompatibilität mit den Anforderungen Ihrer Anwendung sicher und vergleichen Sie die Kosten.

Besuchen Sie die offizielle Website jedes Anbieters für aktuelle Informationen zu Funktionen, Preisen und Dokumentation!
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Erzeugen Sie natürlich klingende Sprache aus Text mit modernsten KI-Stimmen von OpenAI, Deepgram, ElevenLabs, Cartesia, Google Cloud, Azure und PlayHT. Unterstützt mehrere Stimmen, Sprachen und Audioformate.

## Tools

### `tts_openai`

Text in Sprache umwandeln mit OpenAI TTS-Modellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `apiKey` | string | Ja | OpenAI API-Schlüssel |
| `model` | string | Nein | Zu verwendendes TTS-Modell \(tts-1, tts-1-hd oder gpt-4o-mini-tts\) |
| `voice` | string | Nein | Zu verwendende Stimme \(alloy, ash, ballad, cedar, coral, echo, marin, sage, shimmer, verse\) |
| `responseFormat` | string | Nein | Audioformat \(mp3, opus, aac, flac, wav, pcm\) |
| `speed` | number | Nein | Sprechgeschwindigkeit \(0,25 bis 4,0, Standard: 1,0\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

### `tts_deepgram`

Text in Sprache umwandeln mit Deepgram Aura

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `apiKey` | string | Ja | Deepgram API-Schlüssel |
| `model` | string | Nein | Deepgram Modell/Stimme \(z.B. aura-asteria-en, aura-luna-en\) |
| `voice` | string | Nein | Stimmenkennung \(Alternative zum Modellparameter\) |
| `encoding` | string | Nein | Audiokodierung \(linear16, mp3, opus, aac, flac\) |
| `sampleRate` | number | Nein | Abtastrate \(8000, 16000, 24000, 48000\) |
| `bitRate` | number | Nein | Bitrate für komprimierte Formate |
| `container` | string | Nein | Container-Format \(none, wav, ogg\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

### `tts_elevenlabs`

Text in Sprache umwandeln mit ElevenLabs-Stimmen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `voiceId` | string | Ja | Die ID der zu verwendenden Stimme |
| `apiKey` | string | Ja | ElevenLabs API-Schlüssel |
| `modelId` | string | Nein | Zu verwendendes Modell \(z.B. eleven_monolingual_v1, eleven_turbo_v2_5, eleven_flash_v2_5\) |
| `stability` | number | Nein | Stimmstabilität \(0.0 bis 1.0, Standard: 0.5\) |
| `similarityBoost` | number | Nein | Ähnlichkeitsverstärkung \(0.0 bis 1.0, Standard: 0.8\) |
| `style` | number | Nein | Stilübertreibung \(0.0 bis 1.0\) |
| `useSpeakerBoost` | boolean | Nein | Sprecherverstärkung verwenden \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

### `tts_cartesia`

Text in Sprache umwandeln mit Cartesia Sonic (extrem geringe Latenz)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `apiKey` | string | Ja | Cartesia API-Schlüssel |
| `modelId` | string | Nein | Modell-ID \(sonic-english, sonic-multilingual\) |
| `voice` | string | Nein | Stimm-ID oder Embedding |
| `language` | string | Nein | Sprachcode \(en, es, fr, de, it, pt, usw.\) |
| `outputFormat` | json | Nein | Ausgabeformatkonfiguration \(Container, Kodierung, Abtastrate\) |
| `speed` | number | Nein | Geschwindigkeitsmultiplikator |
| `emotion` | array | Nein | Emotions-Tags für Sonic-3 \(z.B. \['positivity:high'\]\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

### `tts_google`

Text in Sprache umwandeln mit Google Cloud Text-to-Speech

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `apiKey` | string | Ja | Google Cloud API-Schlüssel |
| `voiceId` | string | Nein | Stimm-ID (z.B. en-US-Neural2-A, en-US-Wavenet-D) |
| `languageCode` | string | Ja | Sprachcode (z.B. en-US, es-ES, fr-FR) |
| `gender` | string | Nein | Stimmgeschlecht (MALE, FEMALE, NEUTRAL) |
| `audioEncoding` | string | Nein | Audiokodierung (LINEAR16, MP3, OGG_OPUS, MULAW, ALAW) |
| `speakingRate` | number | Nein | Sprechgeschwindigkeit (0,25 bis 2,0, Standard: 1,0) |
| `pitch` | number | Nein | Stimmhöhe (-20,0 bis 20,0, Standard: 0,0) |
| `volumeGainDb` | number | Nein | Lautstärkeverstärkung in dB (-96,0 bis 16,0) |
| `sampleRateHertz` | number | Nein | Abtastrate in Hz |
| `effectsProfileId` | array | Nein | Effektprofil (z.B. ['headphone-class-device']) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

### `tts_azure`

Text in Sprache umwandeln mit Azure Cognitive Services

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `apiKey` | string | Ja | Azure Speech Services API-Schlüssel |
| `voiceId` | string | Nein | Stimm-ID \(z.B. en-US-JennyNeural, en-US-GuyNeural\) |
| `region` | string | Nein | Azure-Region \(z.B. eastus, westus, westeurope\) |
| `outputFormat` | string | Nein | Ausgabe-Audioformat |
| `rate` | string | Nein | Sprechgeschwindigkeit \(z.B. +10%, -20%, 1.5\) |
| `pitch` | string | Nein | Stimmhöhe \(z.B. +5Hz, -2st, low\) |
| `style` | string | Nein | Sprechstil \(z.B. cheerful, sad, angry - nur für neurale Stimmen\) |
| `styleDegree` | number | Nein | Stilintensität \(0.01 bis 2.0\) |
| `role` | string | Nein | Rolle \(z.B. Girl, Boy, YoungAdultFemale\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

### `tts_playht`

Text in Sprache umwandeln mit PlayHT (Stimmklonen)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der in Sprache umzuwandelnde Text |
| `apiKey` | string | Ja | PlayHT API-Schlüssel \(AUTHORIZATION-Header\) |
| `userId` | string | Ja | PlayHT Benutzer-ID \(X-USER-ID-Header\) |
| `voice` | string | Nein | Stimm-ID oder Manifest-URL |
| `quality` | string | Nein | Qualitätsstufe \(draft, standard, premium\) |
| `outputFormat` | string | Nein | Ausgabeformat \(mp3, wav, ogg, flac, mulaw\) |
| `speed` | number | Nein | Geschwindigkeitsmultiplikator \(0,5 bis 2,0\) |
| `temperature` | number | Nein | Kreativität/Zufälligkeit \(0,0 bis 2,0\) |
| `voiceGuidance` | number | Nein | Stimmstabilität \(1,0 bis 6,0\) |
| `textGuidance` | number | Nein | Texttreue \(1,0 bis 6,0\) |
| `sampleRate` | number | Nein | Abtastrate \(8000, 16000, 22050, 24000, 44100, 48000\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL zur generierten Audiodatei |
| `audioFile` | file | Generiertes Audiodateiobjekt |
| `duration` | number | Audiodauer in Sekunden |
| `characterCount` | number | Anzahl der verarbeiteten Zeichen |
| `format` | string | Audioformat |
| `provider` | string | Verwendeter TTS-Anbieter |

## Notizen

- Kategorie: `tools`
- Typ: `tts`
```

--------------------------------------------------------------------------------

---[FILE: twilio_sms.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/twilio_sms.mdx

```text
---
title: Twilio SMS
description: SMS-Nachrichten versenden
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_sms"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio SMS](https://www.twilio.com/en-us/sms) ist eine leistungsstarke Cloud-Kommunikationsplattform, die es Unternehmen ermöglicht, Messaging-Funktionen in ihre Anwendungen und Dienste zu integrieren.

Twilio SMS bietet eine robuste API zum programmatischen Senden und Empfangen von Textnachrichten weltweit. Mit Abdeckung in über 180 Ländern und einer 99,999% Verfügbarkeits-SLA hat sich Twilio als Branchenführer in der Kommunikationstechnologie etabliert.

Zu den wichtigsten Funktionen von Twilio SMS gehören:

- **Globale Reichweite**: Senden Sie Nachrichten an Empfänger weltweit mit lokalen Telefonnummern in mehreren Ländern
- **Programmierbares Messaging**: Passen Sie die Nachrichtenzustellung mit Webhooks, Zustellbestätigungen und Planungsoptionen an
- **Erweiterte Analytik**: Verfolgen Sie Zustellraten, Engagement-Metriken und optimieren Sie Ihre Messaging-Kampagnen

In Sim ermöglicht die Twilio SMS-Integration Ihren Agenten, diese leistungsstarken Messaging-Funktionen als Teil ihrer Workflows zu nutzen. Dies schafft Möglichkeiten für anspruchsvolle Kundenbindungsszenarien wie Terminerinnerungen, Verifizierungscodes, Warnmeldungen und interaktive Gespräche. Die Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Kundenkommunikationskanälen und ermöglicht es Ihren Agenten, zeitnahe, relevante Informationen direkt auf die Mobilgeräte der Benutzer zu liefern. Durch die Verbindung von Sim mit Twilio SMS können Sie intelligente Agenten erstellen, die Kunden über ihren bevorzugten Kommunikationskanal ansprechen, die Benutzererfahrung verbessern und gleichzeitig routinemäßige Messaging-Aufgaben automatisieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Twilio in den Workflow integrieren. Kann SMS-Nachrichten senden.

## Tools

### `twilio_send_sms`

Senden Sie Textnachrichten an einzelne oder mehrere Empfänger über die Twilio API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `phoneNumbers` | string | Ja | Telefonnummern, an die die Nachricht gesendet werden soll, durch Zeilenumbrüche getrennt |
| `message` | string | Ja | Zu sendende Nachricht |
| `accountSid` | string | Ja | Twilio Account SID |
| `authToken` | string | Ja | Twilio Auth Token |
| `fromNumber` | string | Ja | Twilio-Telefonnummer, von der die Nachricht gesendet wird |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | SMS-Sendeerfolg-Status |
| `messageId` | string | Eindeutige Twilio-Nachrichtenkennung \(SID\) |
| `status` | string | Nachrichtenzustellungsstatus von Twilio |
| `fromNumber` | string | Telefonnummer, von der die Nachricht gesendet wurde |
| `toNumber` | string | Telefonnummer, an die die Nachricht gesendet wurde |

## Hinweise

- Kategorie: `tools`
- Typ: `twilio_sms`
```

--------------------------------------------------------------------------------

---[FILE: twilio_voice.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/twilio_voice.mdx

```text
---
title: Twilio Voice
description: Telefonate tätigen und verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_voice"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio Voice](https://www.twilio.com/en-us/voice) ist eine leistungsstarke Cloud-Kommunikationsplattform, die es Unternehmen ermöglicht, Telefonate programmgesteuert über eine einfache API zu tätigen, zu empfangen und zu verwalten.

Twilio Voice bietet eine robuste API zum Erstellen anspruchsvoller Sprachanwendungen mit globaler Reichweite. Mit Abdeckung in über 100 Ländern, Carrier-Grade-Zuverlässigkeit und einer 99,95% Verfügbarkeits-SLA hat sich Twilio als Branchenführer im Bereich programmierbarer Sprachkommunikation etabliert.

Zu den wichtigsten Funktionen von Twilio Voice gehören:

- **Globales Sprachnetzwerk**: Weltweit Anrufe tätigen und empfangen mit lokalen Telefonnummern in mehreren Ländern
- **Programmierbare Anrufsteuerung**: Verwendung von TwiML zur Steuerung des Anrufablaufs, Aufzeichnung von Gesprächen, Erfassung von DTMF-Eingaben und Implementierung von IVR-Systemen
- **Erweiterte Funktionen**: Spracherkennung, Text-to-Speech, Anrufweiterleitung, Konferenzschaltung und Anrufbeantworter-Erkennung
- **Echtzeit-Analytik**: Überwachung von Anrufqualität, -dauer, -kosten und Optimierung Ihrer Sprachanwendungen

In Sim ermöglicht die Twilio Voice-Integration Ihren Agenten, diese leistungsstarken Sprachfunktionen als Teil ihrer Workflows zu nutzen. Dies schafft Möglichkeiten für anspruchsvolle Kundenbindungsszenarien wie Terminerinnerungen, Verifizierungsanrufe, automatisierte Support-Hotlines und interaktive Sprachdialogsysteme. Die Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Sprachkommunikationskanälen und ermöglicht es Ihren Agenten, zeitnahe, relevante Informationen direkt über Telefonanrufe zu liefern. Durch die Verbindung von Sim mit Twilio Voice können Sie intelligente Agenten erstellen, die Kunden über ihren bevorzugten Kommunikationskanal ansprechen, die Benutzererfahrung verbessern und gleichzeitig routinemäßige Anrufaufgaben automatisieren.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Twilio Voice in den Workflow. Tätigen Sie ausgehende Anrufe und rufen Sie Anrufaufzeichnungen ab.

## Tools

### `twilio_voice_make_call`

Tätigen Sie einen ausgehenden Anruf mit der Twilio Voice API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `to` | string | Ja | Anzurufende Telefonnummer \(E.164-Format, z.B. +14155551234\) |
| `from` | string | Ja | Ihre Twilio-Telefonnummer, von der aus angerufen wird \(E.164-Format\) |
| `url` | string | Nein | URL, die TwiML-Anweisungen für den Anruf zurückgibt |
| `twiml` | string | Nein | TwiML-Anweisungen zur Ausführung \(Alternative zur URL\). Verwenden Sie eckige Klammern anstelle von spitzen Klammern, z.B. \[Response\]\[Say\]Hello\[/Say\]\[/Response\] |
| `statusCallback` | string | Nein | Webhook-URL für Anrufstatus-Updates |
| `statusCallbackMethod` | string | Nein | HTTP-Methode für Status-Callback \(GET oder POST\) |
| `accountSid` | string | Ja | Twilio Account SID |
| `authToken` | string | Ja | Twilio Auth Token |
| `record` | boolean | Nein | Ob der Anruf aufgezeichnet werden soll |
| `recordingStatusCallback` | string | Nein | Webhook-URL für Aufzeichnungsstatus-Updates |
| `timeout` | number | Nein | Wartezeit auf Antwort bevor aufgegeben wird \(Sekunden, Standard: 60\) |
| `machineDetection` | string | Nein | Anrufbeantworter-Erkennung: Enable oder DetectMessageEnd |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Anruf erfolgreich eingeleitet wurde |
| `callSid` | string | Eindeutige Kennung für den Anruf |
| `status` | string | Anrufstatus \(queued, ringing, in-progress, completed, usw.\) |
| `direction` | string | Anrufrichtung \(outbound-api\) |
| `from` | string | Telefonnummer, von der aus angerufen wird |
| `to` | string | Telefonnummer, die angerufen wird |
| `duration` | number | Anrufdauer in Sekunden |
| `price` | string | Kosten des Anrufs |
| `priceUnit` | string | Währung des Preises |
| `error` | string | Fehlermeldung, wenn der Anruf fehlgeschlagen ist |

### `twilio_voice_list_calls`

Rufen Sie eine Liste der Anrufe ab, die zu und von einem Konto getätigt wurden.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `accountSid` | string | Ja | Twilio Account SID |
| `authToken` | string | Ja | Twilio Auth Token |
| `to` | string | Nein | Nach Anrufen zu dieser Telefonnummer filtern |
| `from` | string | Nein | Nach Anrufen von dieser Telefonnummer filtern |
| `status` | string | Nein | Nach Anrufstatus filtern \(queued, ringing, in-progress, completed, etc.\) |
| `startTimeAfter` | string | Nein | Anrufe filtern, die an oder nach diesem Datum begonnen haben \(JJJJ-MM-TT\) |
| `startTimeBefore` | string | Nein | Anrufe filtern, die an oder vor diesem Datum begonnen haben \(JJJJ-MM-TT\) |
| `pageSize` | number | Nein | Anzahl der zurückzugebenden Datensätze \(max. 1000, Standard 50\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Anrufe erfolgreich abgerufen wurden |
| `calls` | array | Array von Anrufobjekten |
| `total` | number | Gesamtanzahl der zurückgegebenen Anrufe |
| `page` | number | Aktuelle Seitennummer |
| `pageSize` | number | Anzahl der Anrufe pro Seite |
| `error` | string | Fehlermeldung, wenn der Abruf fehlgeschlagen ist |

### `twilio_voice_get_recording`

Rufen Sie Anrufaufzeichnungsinformationen und Transkription ab (falls über TwiML aktiviert).

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `recordingSid` | string | Ja | Abzurufende Recording SID |
| `accountSid` | string | Ja | Twilio Account SID |
| `authToken` | string | Ja | Twilio Auth Token |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Aufnahme erfolgreich abgerufen wurde |
| `recordingSid` | string | Eindeutige Kennung für die Aufnahme |
| `callSid` | string | Call SID, zu der diese Aufnahme gehört |
| `duration` | number | Dauer der Aufnahme in Sekunden |
| `status` | string | Aufnahmestatus \(completed, processing, usw.\) |
| `channels` | number | Anzahl der Kanäle \(1 für Mono, 2 für Dual\) |
| `source` | string | Wie die Aufnahme erstellt wurde |
| `mediaUrl` | string | URL zum Herunterladen der Aufnahmedatei |
| `price` | string | Kosten der Aufnahme |
| `priceUnit` | string | Währung des Preises |
| `uri` | string | Relativer URI der Aufnahmeressource |
| `transcriptionText` | string | Transkribierter Text aus der Aufnahme \(falls verfügbar\) |
| `transcriptionStatus` | string | Transkriptionsstatus \(completed, in-progress, failed\) |
| `transcriptionPrice` | string | Kosten der Transkription |
| `transcriptionPriceUnit` | string | Währung des Transkriptionspreises |
| `error` | string | Fehlermeldung, falls der Abruf fehlgeschlagen ist |

## Hinweise

- Kategorie: `tools`
- Typ: `twilio_voice`
```

--------------------------------------------------------------------------------

---[FILE: typeform.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/typeform.mdx

```text
---
title: Typeform
description: Mit Typeform interagieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="typeform"
  color="#262627"
/>

{/* MANUAL-CONTENT-START:intro */}
[Typeform](https://www.typeform.com/) ist eine benutzerfreundliche Plattform zur Erstellung von konversationellen Formularen, Umfragen und Quiz mit Fokus auf ein ansprechendes Nutzererlebnis.

Mit Typeform können Sie:

- **Interaktive Formulare erstellen**: Gestalten Sie schöne, konversationelle Formulare, die Befragte mit einer einzigartigen Frage-für-Frage-Oberfläche einbinden
- **Ihr Erlebnis anpassen**: Verwenden Sie bedingte Logik, versteckte Felder und benutzerdefinierte Designs, um personalisierte Benutzerreisen zu erstellen
- **Mit anderen Tools integrieren**: Verbinden Sie sich mit über 1000 Apps durch native Integrationen und APIs
- **Antwortdaten analysieren**: Erhalten Sie umsetzbare Erkenntnisse durch umfassende Analyse- und Berichtswerkzeuge

In Sim ermöglicht die Typeform-Integration Ihren Agenten, programmatisch mit Ihren Typeform-Daten als Teil ihrer Workflows zu interagieren. Agenten können Formularantworten abrufen, Übermittlungsdaten verarbeiten und Benutzerfeedback direkt in Entscheidungsprozesse einbeziehen. Diese Integration ist besonders wertvoll für Szenarien wie Lead-Qualifizierung, Kundenfeedback-Analyse und datengesteuerte Personalisierung. Durch die Verbindung von Sim mit Typeform können Sie intelligente Automatisierungs-Workflows erstellen, die Formularantworten in umsetzbare Erkenntnisse umwandeln - Stimmungen analysieren, Feedback kategorisieren, Zusammenfassungen generieren und sogar Folgemaßnahmen basierend auf spezifischen Antwortmustern auslösen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriert Typeform in den Workflow. Kann Antworten abrufen, Dateien herunterladen und Formularstatistiken erhalten. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn ein Formular abgesendet wird. Erfordert API-Schlüssel.

## Tools

### `typeform_responses`

Formularantworten von Typeform abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Ja | Typeform Formular-ID |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |
| `pageSize` | number | Nein | Anzahl der abzurufenden Antworten \(Standard: 25\) |
| `since` | string | Nein | Antworten abrufen, die nach diesem Datum übermittelt wurden \(ISO 8601-Format\) |
| `until` | string | Nein | Antworten abrufen, die vor diesem Datum übermittelt wurden \(ISO 8601-Format\) |
| `completed` | string | Nein | Nach Abschlussstatus filtern \(true/false\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `total_items` | number | Gesamtanzahl der Antworten |
| `page_count` | number | Gesamtanzahl der verfügbaren Seiten |
| `items` | array | Array von Antwortobjekten mit response_id, submitted_at, answers und metadata |

### `typeform_files`

Dateien herunterladen, die in Typeform-Antworten hochgeladen wurden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Ja | Typeform Formular-ID |
| `responseId` | string | Ja | Antwort-ID, die die Dateien enthält |
| `fieldId` | string | Ja | Eindeutige ID des Datei-Upload-Feldes |
| `filename` | string | Ja | Dateiname der hochgeladenen Datei |
| `inline` | boolean | Nein | Ob die Datei mit Inline Content-Disposition angefordert werden soll |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `fileUrl` | string | Direkter Download-Link für die hochgeladene Datei |
| `contentType` | string | MIME-Typ der hochgeladenen Datei |
| `filename` | string | Ursprünglicher Dateiname der hochgeladenen Datei |

### `typeform_insights`

Einblicke und Analysen für Typeform-Formulare abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Ja | Typeform Formular-ID |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `fields` | array | Anzahl der Benutzer, die bei diesem Feld abgebrochen haben |

### `typeform_list_forms`

Eine Liste aller Formulare in Ihrem Typeform-Konto abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |
| `search` | string | Nein | Suchanfrage zum Filtern von Formularen nach Titel |
| `page` | number | Nein | Seitennummer \(Standard: 1\) |
| `pageSize` | number | Nein | Anzahl der Formulare pro Seite \(Standard: 10, max: 200\) |
| `workspaceId` | string | Nein | Formulare nach Workspace-ID filtern |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `total_items` | number | Gesamtanzahl der Formulare im Konto |
| `page_count` | number | Gesamtanzahl der verfügbaren Seiten |
| `items` | array | Array von Formularobjekten mit id, title, created_at, last_updated_at, settings, theme und _links |

### `typeform_get_form`

Vollständige Details und Struktur eines bestimmten Formulars abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |
| `formId` | string | Ja | Eindeutige Formular-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Eindeutige Formular-ID |
| `title` | string | Formulartitel |
| `type` | string | Formulartyp \(form, quiz, etc.\) |
| `settings` | object | Formulareinstellungen einschließlich Sprache, Fortschrittsbalken, etc. |
| `theme` | object | Theme-Referenz |
| `workspace` | object | Workspace-Referenz |
| `fields` | array | Array von Formularfeldern/Fragen |
| `welcome_screens` | array | Array von Begrüßungsbildschirmen |
| `thankyou_screens` | array | Array von Dankesbildschirmen |
| `_links` | object | Links zu verwandten Ressourcen einschließlich öffentlicher Formular-URL |

### `typeform_create_form`

Ein neues Formular mit Feldern und Einstellungen erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |
| `title` | string | Ja | Formulartitel |
| `type` | string | Nein | Formulartyp \(Standard: "form"\). Optionen: "form", "quiz" |
| `workspaceId` | string | Nein | Workspace-ID, in der das Formular erstellt werden soll |
| `fields` | json | Nein | Array von Feldobjekten, die die Formularstruktur definieren. Jedes Feld benötigt: Typ, Titel und optionale Eigenschaften/Validierungen |
| `settings` | json | Nein | Formulareinstellungsobjekt \(Sprache, Fortschrittsbalken, etc.\) |
| `themeId` | string | Nein | Theme-ID, die auf das Formular angewendet werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Eindeutige Kennung des erstellten Formulars |
| `title` | string | Formulartitel |
| `type` | string | Formulartyp |
| `fields` | array | Array der erstellten Formularfelder |
| `_links` | object | Links zu verwandten Ressourcen einschließlich öffentlicher Formular-URL |

### `typeform_update_form`

Ein bestehendes Formular mit JSON Patch-Operationen aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |
| `formId` | string | Ja | Eindeutige Kennung des zu aktualisierenden Formulars |
| `operations` | json | Ja | Array von JSON Patch-Operationen \(RFC 6902\). Jede Operation benötigt: op \(add/remove/replace\), path und value \(für add/replace\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Eindeutige Kennung des aktualisierten Formulars |
| `title` | string | Formulartitel |
| `type` | string | Formulartyp |
| `settings` | object | Formulareinstellungen |
| `theme` | object | Theme-Referenz |
| `workspace` | object | Workspace-Referenz |
| `fields` | array | Array von Formularfeldern |
| `welcome_screens` | array | Array von Begrüßungsbildschirmen |
| `thankyou_screens` | array | Array von Dankesbildschirmen |
| `_links` | object | Links zu verwandten Ressourcen |

### `typeform_delete_form`

Ein Formular und alle seine Antworten dauerhaft löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Typeform persönliches Zugriffstoken |
| `formId` | string | Ja | Eindeutige Kennung des zu löschenden Formulars |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob das Formular erfolgreich gelöscht wurde |
| `message` | string | Löschbestätigungsnachricht |

## Hinweise

- Kategorie: `tools`
- Typ: `typeform`
```

--------------------------------------------------------------------------------

````
