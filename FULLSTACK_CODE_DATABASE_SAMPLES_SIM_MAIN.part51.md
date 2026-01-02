---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 51
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 51 of 933)

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

---[FILE: tavily.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/tavily.mdx

```text
---
title: Tavily
description: Informationen suchen und extrahieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tavily"
  color="#0066FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Tavily](https://www.tavily.com/) ist eine KI-gestützte Such-API, die speziell für LLM-Anwendungen entwickelt wurde. Sie bietet zuverlässige Informationsabruffunktionen in Echtzeit mit Funktionen, die für KI-Anwendungsfälle optimiert sind, einschließlich semantischer Suche, Inhaltsextraktion und strukturiertem Datenabruf.

Mit Tavily können Sie:

- **Kontextbezogene Suchen durchführen**: Erhalten Sie relevante Ergebnisse basierend auf semantischem Verständnis anstatt nur auf Keyword-Matching
- **Strukturierte Inhalte extrahieren**: Ziehen Sie spezifische Informationen aus Webseiten in einem sauberen, nutzbaren Format
- **Auf Echtzeit-Informationen zugreifen**: Rufen Sie aktuelle Daten aus dem gesamten Web ab
- **Mehrere URLs gleichzeitig verarbeiten**: Extrahieren Sie Inhalte von mehreren Webseiten in einer einzigen Anfrage
- **KI-optimierte Ergebnisse erhalten**: Bekommen Sie Suchergebnisse, die speziell für die Verarbeitung durch KI-Systeme formatiert sind

In Sim ermöglicht die Tavily-Integration Ihren Agenten, das Web zu durchsuchen und Informationen als Teil ihrer Workflows zu extrahieren. Dies erlaubt anspruchsvolle Automatisierungsszenarien, die aktuelle Informationen aus dem Internet benötigen. Ihre Agenten können Suchanfragen formulieren, relevante Ergebnisse abrufen und Inhalte von bestimmten Webseiten extrahieren, um ihre Entscheidungsprozesse zu unterstützen. Diese Integration überbrückt die Lücke zwischen Ihrer Workflow-Automatisierung und dem umfangreichen Wissen, das im Web verfügbar ist, und ermöglicht Ihren Agenten den Zugriff auf Echtzeit-Informationen ohne manuelle Eingriffe. Durch die Verbindung von Sim mit Tavily können Sie Agenten erstellen, die mit den neuesten Informationen auf dem Laufenden bleiben, genauere Antworten liefern und mehr Wert für Benutzer schaffen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Tavily in den Workflow. Kann das Web durchsuchen und Inhalte von bestimmten URLs extrahieren. Benötigt API-Schlüssel.

## Tools

### `tavily_search`

KI-gestützte Websuchen mit Tavily durchführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die auszuführende Suchanfrage |
| `max_results` | number | Nein | Maximale Anzahl an Ergebnissen \(1-20\) |
| `topic` | string | Nein | Kategorie-Typ: general, news oder finance \(Standard: general\) |
| `search_depth` | string | Nein | Suchbereich: basic \(1 Kredit\) oder advanced \(2 Kredite\) \(Standard: basic\) |
| `include_answer` | string | Nein | LLM-generierte Antwort: true/basic für schnelle Antwort oder advanced für detaillierte |
| `include_raw_content` | string | Nein | Geparster HTML-Inhalt: true/markdown oder text-Format |
| `include_images` | boolean | Nein | Bildsuchergebnisse einbeziehen |
| `include_image_descriptions` | boolean | Nein | Beschreibenden Text für Bilder hinzufügen |
| `include_favicon` | boolean | Nein | Favicon-URLs einbeziehen |
| `chunks_per_source` | number | Nein | Maximale Anzahl relevanter Abschnitte pro Quelle \(1-3, Standard: 3\) |
| `time_range` | string | Nein | Nach Aktualität filtern: day/d, week/w, month/m, year/y |
| `start_date` | string | Nein | Frühestes Veröffentlichungsdatum \(Format JJJJ-MM-TT\) |
| `end_date` | string | Nein | Spätestes Veröffentlichungsdatum \(Format JJJJ-MM-TT\) |
| `include_domains` | string | Nein | Kommagetrennte Liste von Domains auf der Whitelist \(max. 300\) |
| `exclude_domains` | string | Nein | Kommagetrennte Liste von Domains auf der Blacklist \(max. 150\) |
| `country` | string | Nein | Ergebnisse aus bestimmtem Land bevorzugen \(nur für allgemeine Themen\) |
| `auto_parameters` | boolean | Nein | Automatische Parameterkonfiguration basierend auf der Abfrageabsicht |
| `apiKey` | string | Ja | Tavily API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `query` | string | Die ausgeführte Suchanfrage |
| `results` | array | Ergebnisse des Tools |

### `tavily_extract`

Extrahieren Sie Rohinhalt von mehreren Webseiten gleichzeitig mit Tavily

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Ja | URL oder Array von URLs, aus denen Inhalte extrahiert werden sollen |
| `extract_depth` | string | Nein | Die Tiefe der Extraktion \(basic=1 Kredit/5 URLs, advanced=2 Kredite/5 URLs\) |
| `format` | string | Nein | Ausgabeformat: markdown oder text \(Standard: markdown\) |
| `include_images` | boolean | Nein | Bilder in die Extraktionsausgabe einbeziehen |
| `include_favicon` | boolean | Nein | Favicon-URL für jedes Ergebnis hinzufügen |
| `apiKey` | string | Ja | Tavily API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Die URL, die extrahiert wurde |

### `tavily_crawl`

Systematisches Crawlen und Extrahieren von Inhalten aus Websites mit Tavily

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Die Stamm-URL, bei der der Crawl beginnen soll |
| `instructions` | string | Nein | Anweisungen in natürlicher Sprache für den Crawler \(kostet 2 Kredite pro 10 Seiten\) |
| `max_depth` | number | Nein | Wie weit von der Basis-URL aus erkundet werden soll \(1-5, Standard: 1\) |
| `max_breadth` | number | Nein | Links, die pro Seitenebene verfolgt werden \(≥1, Standard: 20\) |
| `limit` | number | Nein | Gesamtzahl der verarbeiteten Links vor dem Stopp \(≥1, Standard: 50\) |
| `select_paths` | string | Nein | Kommagetrennte Regex-Muster, um bestimmte URL-Pfade einzuschließen \(z.B. /docs/.*\) |
| `select_domains` | string | Nein | Kommagetrennte Regex-Muster, um das Crawlen auf bestimmte Domains zu beschränken |
| `exclude_paths` | string | Nein | Kommagetrennte Regex-Muster, um bestimmte URL-Pfade zu überspringen |
| `exclude_domains` | string | Nein | Kommagetrennte Regex-Muster, um bestimmte Domains zu blockieren |
| `allow_external` | boolean | Nein | Links zu externen Domains in die Ergebnisse einbeziehen \(Standard: true\) |
| `include_images` | boolean | Nein | Bilder in die Crawl-Ausgabe einbeziehen |
| `extract_depth` | string | Nein | Extraktionstiefe: basic \(1 Kredit/5 Seiten\) oder advanced \(2 Kredite/5 Seiten\) |
| `format` | string | Nein | Ausgabeformat: markdown oder text \(Standard: markdown\) |
| `include_favicon` | boolean | Nein | Favicon-URL für jedes Ergebnis hinzufügen |
| `apiKey` | string | Ja | Tavily API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `base_url` | string | Die Basis-URL, die durchsucht wurde |
| `results` | array | Die durchsuchte Seiten-URL |

### `tavily_map`

Entdecken und visualisieren der Website-Struktur mit Tavily

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Die Root-URL, bei der die Kartierung beginnen soll |
| `instructions` | string | Nein | Natürlichsprachliche Anleitung für das Kartierungsverhalten \(kostet 2 Kredite pro 10 Seiten\) |
| `max_depth` | number | Nein | Wie weit von der Basis-URL aus erkundet werden soll \(1-5, Standard: 1\) |
| `max_breadth` | number | Nein | Links, die pro Ebene verfolgt werden sollen \(Standard: 20\) |
| `limit` | number | Nein | Gesamtzahl der zu verarbeitenden Links \(Standard: 50\) |
| `select_paths` | string | Nein | Durch Kommas getrennte Regex-Muster für URL-Pfadfilterung \(z.B. /docs/.*\) |
| `select_domains` | string | Nein | Durch Kommas getrennte Regex-Muster, um die Kartierung auf bestimmte Domains zu beschränken |
| `exclude_paths` | string | Nein | Durch Kommas getrennte Regex-Muster, um bestimmte URL-Pfade auszuschließen |
| `exclude_domains` | string | Nein | Durch Kommas getrennte Regex-Muster, um Domains auszuschließen |
| `allow_external` | boolean | Nein | Externe Domain-Links in Ergebnisse einbeziehen \(Standard: true\) |
| `apiKey` | string | Ja | Tavily API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `base_url` | string | Die Basis-URL, die kartiert wurde |
| `results` | array | Entdeckte URL |

## Hinweise

- Kategorie: `tools`
- Typ: `tavily`
```

--------------------------------------------------------------------------------

---[FILE: telegram.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/telegram.mdx

```text
---
title: Telegram
description: Sende Nachrichten über Telegram oder löse Workflows durch
  Telegram-Ereignisse aus
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="telegram"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Telegram](https://telegram.org) ist eine sichere, cloudbasierte Messaging-Plattform, die eine schnelle und zuverlässige Kommunikation über verschiedene Geräte und Plattformen ermöglicht. Mit über 700 Millionen monatlich aktiven Nutzern hat sich Telegram als einer der weltweit führenden Messaging-Dienste etabliert, bekannt für seine Sicherheit, Geschwindigkeit und leistungsstarken API-Funktionen.

Die Bot-API von Telegram bietet ein robustes Framework für die Erstellung automatisierter Messaging-Lösungen und die Integration von Kommunikationsfunktionen in Anwendungen. Mit Unterstützung für Rich Media, Inline-Tastaturen und benutzerdefinierte Befehle können Telegram-Bots komplexe Interaktionsmuster und automatisierte Workflows ermöglichen.

Erfahre, wie du einen Webhook-Trigger in Sim erstellst, der nahtlos Workflows aus Telegram-Nachrichten initiiert. Dieses Tutorial führt dich durch die Einrichtung eines Webhooks, die Konfiguration mit der Bot-API von Telegram und das Auslösen automatisierter Aktionen in Echtzeit. Perfekt, um Aufgaben direkt aus deinem Chat zu optimieren!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/9oKcJtQ0_IM"
  title="Verwende Telegram mit Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Lerne, wie du das Telegram-Tool in Sim verwendest, um nahtlos automatisierte Nachrichtenübermittlung an jede Telegram-Gruppe zu ermöglichen. Dieses Tutorial führt dich durch die Integration des Tools in deinen Workflow, die Konfiguration von Gruppennachrichten und das Auslösen automatisierter Updates in Echtzeit. Perfekt, um die Kommunikation direkt aus deinem Arbeitsbereich zu verbessern!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/AG55LpUreGI"
  title="Verwende Telegram mit Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Hauptfunktionen von Telegram sind:

- Sichere Kommunikation: Ende-zu-Ende-Verschlüsselung und sichere Cloud-Speicherung für Nachrichten und Medien
- Bot-Plattform: Leistungsstarke Bot-API zur Erstellung automatisierter Messaging-Lösungen und interaktiver Erlebnisse
- Umfangreiche Medienunterstützung: Senden und Empfangen von Nachrichten mit Textformatierung, Bildern, Dateien und interaktiven Elementen
- Globale Reichweite: Verbindung mit Nutzern weltweit mit Unterstützung für mehrere Sprachen und Plattformen

In Sim ermöglicht die Telegram-Integration Ihren Agenten, diese leistungsstarken Messaging-Funktionen als Teil ihrer Arbeitsabläufe zu nutzen. Dies schafft Möglichkeiten für automatisierte Benachrichtigungen, Warnmeldungen und interaktive Gespräche über Telegrams sichere Messaging-Plattform. Die Integration ermöglicht es Agenten, Nachrichten programmatisch an Einzelpersonen oder Kanäle zu senden und ermöglicht so zeitnahe Kommunikation und Updates. Durch die Verbindung von Sim mit Telegram können Sie intelligente Agenten erstellen, die Benutzer über eine sichere und weit verbreitete Messaging-Plattform ansprechen, die perfekt für die Übermittlung von Benachrichtigungen, Updates und interaktive Kommunikation geeignet ist.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriert Telegram in den Workflow. Kann Nachrichten senden. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn eine Nachricht an einen Chat gesendet wird.

## Tools

### `telegram_message`

Sendet Nachrichten an Telegram-Kanäle oder Benutzer über die Telegram Bot API. Ermöglicht direkte Kommunikation und Benachrichtigungen mit Nachrichtenverfolgung und Chat-Bestätigung.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `text` | string | Ja | Zu sendender Nachrichtentext |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Telegram-Nachrichtendaten |

## Hinweise

- Kategorie: `tools`
- Typ: `telegram`

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `messageId` | string | Ja | Nachrichten-ID zum Löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Ergebnis des Löschvorgangs |

### `telegram_send_photo`

Senden Sie Fotos an Telegram-Kanäle oder Benutzer über die Telegram Bot API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `photo` | string | Ja | Zu sendendes Foto. Übergeben Sie eine file_id oder HTTP-URL |
| `caption` | string | Nein | Fotobeschreibung (optional) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Telegram-Nachrichtendaten einschließlich optionaler Foto(s) |

### `telegram_send_video`

Senden Sie Videos an Telegram-Kanäle oder Benutzer über die Telegram Bot API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `video` | string | Ja | Zu sendendes Video. Übergeben Sie eine file_id oder HTTP-URL |
| `caption` | string | Nein | Videobeschreibung (optional) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Telegram-Nachrichtendaten einschließlich optionaler Medien |

### `telegram_send_audio`

Senden Sie Audiodateien an Telegram-Kanäle oder Benutzer über die Telegram Bot API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `audio` | string | Ja | Zu sendende Audiodatei. Übergeben Sie eine file_id oder HTTP-URL |
| `caption` | string | Nein | Audio-Beschriftung \(optional\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Telegram-Nachrichtendaten einschließlich Sprach-/Audioinformationen |

### `telegram_send_animation`

Senden Sie Animationen (GIFs) an Telegram-Kanäle oder Benutzer über die Telegram Bot API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `animation` | string | Ja | Zu sendende Animation. Übergeben Sie eine file_id oder HTTP-URL |
| `caption` | string | Nein | Animations-Beschriftung \(optional\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Telegram-Nachrichtendaten einschließlich optionaler Medien |

### `telegram_send_document`

Senden Sie Dokumente (PDF, ZIP, DOC, etc.) an Telegram-Kanäle oder -Nutzer über die Telegram Bot API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Ihr Telegram Bot API-Token |
| `chatId` | string | Ja | Ziel-Telegram-Chat-ID |
| `files` | file[] | Nein | Zu sendende Dokumentdatei \(PDF, ZIP, DOC, etc.\). Maximale Größe: 50MB |
| `caption` | string | Nein | Dokumentbeschreibung \(optional\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Telegram-Nachrichtendaten einschließlich Dokument |

## Hinweise

- Kategorie: `tools`
- Typ: `telegram`
```

--------------------------------------------------------------------------------

---[FILE: thinking.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/thinking.mdx

```text
---
title: Denken
description: Fordert das Modell auf, seinen Denkprozess darzulegen.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="thinking"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Das Thinking-Tool ermutigt KI-Modelle, vor dem Beantworten komplexer Anfragen explizit zu argumentieren. Indem es einen speziellen Raum für schrittweise Analysen bietet, hilft dieses Tool den Modellen, Probleme zu zerlegen, mehrere Perspektiven zu berücksichtigen und zu durchdachteren Schlussfolgerungen zu gelangen.

Forschungen haben gezeigt, dass die Aufforderung an Sprachmodelle, "Schritt für Schritt zu denken", ihre Argumentationsfähigkeiten erheblich verbessern kann. Laut [Anthropics Forschung zu Claudes Think-Tool](https://www.anthropic.com/engineering/claude-think-tool) zeigen Modelle, wenn ihnen Raum gegeben wird, ihre Argumentation explizit auszuarbeiten:

- **Verbesserte Problemlösung**: Aufbrechen komplexer Probleme in überschaubare Schritte
- **Erhöhte Genauigkeit**: Reduzierung von Fehlern durch sorgfältige Bearbeitung jeder Problemkomponente
- **Größere Transparenz**: Sichtbarmachung und Überprüfbarkeit des Argumentationsprozesses des Modells
- **Nuanciertere Antworten**: Berücksichtigung mehrerer Blickwinkel vor dem Ziehen von Schlussfolgerungen

In Sim schafft das Thinking-Tool eine strukturierte Möglichkeit für Ihre Agenten, sich an dieser Art des überlegten Denkens zu beteiligen. Durch die Integration von Denkschritten in Ihre Workflows können Sie Ihren Agenten helfen, komplexe Aufgaben effektiver zu bewältigen, häufige Denkfehler zu vermeiden und qualitativ hochwertigere Ergebnisse zu erzielen. Dies ist besonders wertvoll für Aufgaben, die mehrstufiges Denken, komplexe Entscheidungsfindung oder Situationen erfordern, in denen Genauigkeit entscheidend ist.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Fügt einen Schritt hinzu, bei dem das Modell seinen Denkprozess explizit darlegt, bevor es fortfährt. Dies kann die Qualität des Denkens verbessern, indem eine schrittweise Analyse gefördert wird.

## Tools

### `thinking_tool`

Verarbeitet einen bereitgestellten Gedanken/eine Anweisung und macht ihn für nachfolgende Schritte verfügbar.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `thought` | string | Ja | Ihre interne Argumentation, Analyse oder Denkprozess. Nutzen Sie dies, um das Problem Schritt für Schritt zu durchdenken, bevor Sie antworten. |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `acknowledgedThought` | string | Der Gedanke, der verarbeitet und bestätigt wurde |

## Hinweise

- Kategorie: `tools`
- Typ: `thinking`
```

--------------------------------------------------------------------------------

---[FILE: translate.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/translate.mdx

```text
---
title: Übersetzen
description: Text in jede Sprache übersetzen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="translate"
  color="#FF4B4B"
/>

{/* MANUAL-CONTENT-START:intro */}
Übersetzen ist ein Tool, mit dem Sie Text zwischen verschiedenen Sprachen übersetzen können.

Mit Übersetzen können Sie:

- **Text übersetzen**: Text zwischen Sprachen übersetzen
- **Dokumente übersetzen**: Dokumente zwischen Sprachen übersetzen
- **Webseiten übersetzen**: Webseiten zwischen Sprachen übersetzen
- **Bilder übersetzen**: Bilder zwischen Sprachen übersetzen
- **Audio übersetzen**: Audiodateien zwischen Sprachen übersetzen
- **Videos übersetzen**: Videos zwischen Sprachen übersetzen
- **Sprache übersetzen**: Gesprochene Sprache zwischen Sprachen übersetzen
- **Text übersetzen**: Text zwischen Sprachen übersetzen
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Übersetzen in den Workflow. Kann Text in jede Sprache übersetzen.

## Tools

### `llm_chat`

Senden Sie eine Chat-Completion-Anfrage an jeden unterstützten LLM-Anbieter

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `model` | string | Ja | Das zu verwendende Modell \(z. B. gpt-4o, claude-sonnet-4-5, gemini-2.0-flash\) |
| `systemPrompt` | string | Nein | System-Prompt zur Festlegung des Verhaltens des Assistenten |
| `context` | string | Ja | Die Benutzernachricht oder der Kontext, der an das Modell gesendet werden soll |
| `apiKey` | string | Nein | API-Schlüssel für den Anbieter \(verwendet Plattform-Schlüssel, falls nicht für gehostete Modelle angegeben\) |
| `temperature` | number | Nein | Temperatur für die Antwortgenerierung \(0-2\) |
| `maxTokens` | number | Nein | Maximale Anzahl von Tokens in der Antwort |
| `azureEndpoint` | string | Nein | Azure OpenAI-Endpunkt-URL |
| `azureApiVersion` | string | Nein | Azure OpenAI-API-Version |
| `vertexProject` | string | Nein | Google Cloud-Projekt-ID für Vertex AI |
| `vertexLocation` | string | Nein | Google Cloud-Standort für Vertex AI \(Standard: us-central1\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Der generierte Antwortinhalt |
| `model` | string | Das für die Generierung verwendete Modell |
| `tokens` | object | Informationen zur Token-Nutzung |

## Hinweise

- Kategorie: `tools`
- Typ: `translate`
```

--------------------------------------------------------------------------------

---[FILE: trello.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/trello.mdx

```text
---
title: Trello
description: Trello-Boards und -Karten verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="trello"
  color="#0052CC"
/>

{/* MANUAL-CONTENT-START:intro */}
[Trello](https://trello.com) ist ein visuelles Kollaborationstool, das Ihnen hilft, Projekte, Aufgaben und Arbeitsabläufe mithilfe von Boards, Listen und Karten zu organisieren.

Mit Trello in Sim können Sie:

- **Boards und Listen anzeigen**: Sehen Sie die Boards, auf die Sie Zugriff haben, und die zugehörigen Listen ein.
- **Karten auflisten und durchsuchen**: Rufen Sie alle Karten auf einem Board ab oder filtern Sie nach Listen, um deren Inhalt und Status zu sehen.
- **Karten erstellen**: Fügen Sie einer Trello-Liste neue Karten hinzu, einschließlich Beschreibungen, Labels und Fälligkeitsdaten.
- **Karten aktualisieren und verschieben**: Bearbeiten Sie Karteneigenschaften, verschieben Sie Karten zwischen Listen und legen Sie Fälligkeitsdaten oder Labels fest.
- **Aktuelle Aktivitäten abrufen**: Rufen Sie Aktionen und Aktivitätsverlauf für Boards und Karten ab.
- **Karten kommentieren**: Fügen Sie Karten Kommentare für die Zusammenarbeit und Nachverfolgung hinzu.

Die Integration von Trello mit Sim ermöglicht es Ihren Agenten, die Aufgaben, Boards und Projekte Ihres Teams programmatisch zu verwalten. Automatisieren Sie Projektmanagement-Workflows, halten Sie Aufgabenlisten aktuell, synchronisieren Sie mit anderen Tools oder lösen Sie intelligente Workflows als Reaktion auf Trello-Ereignisse aus – alles durch Ihre KI-Agenten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Trello, um Boards und Karten zu verwalten. Listen Sie Boards auf, listen Sie Karten auf, erstellen Sie Karten, aktualisieren Sie Karten, rufen Sie Aktionen ab und fügen Sie Kommentare hinzu.

## Tools

### `trello_list_lists`

Alle Listen auf einem Trello-Board auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Ja | ID des Boards, von dem Listen aufgelistet werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `lists` | array | Array von Listenobjekten mit id, name, closed, pos und idBoard |
| `count` | number | Anzahl der zurückgegebenen Listen |

### `trello_list_cards`

Alle Listen eines Trello-Boards auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Ja | ID des Boards, von dem Listen aufgelistet werden sollen |
| `listId` | string | Nein | Optional: Karten nach Listen-ID filtern |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `cards` | array | Array von Kartenobjekten mit id, name, desc, url, Board/Listen-IDs, Labels und Fälligkeitsdatum |
| `count` | number | Anzahl der zurückgegebenen Karten |

### `trello_create_card`

Eine neue Karte auf einem Trello-Board erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Ja | ID des Boards, auf dem die Karte erstellt werden soll |
| `listId` | string | Ja | ID der Liste, in der die Karte erstellt werden soll |
| `name` | string | Ja | Name/Titel der Karte |
| `desc` | string | Nein | Beschreibung der Karte |
| `pos` | string | Nein | Position der Karte \(top, bottom oder positive Gleitkommazahl\) |
| `due` | string | Nein | Fälligkeitsdatum \(ISO 8601-Format\) |
| `labels` | string | Nein | Kommagetrennte Liste von Label-IDs |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `card` | object | Das erstellte Kartenobjekt mit id, name, desc, url und anderen Eigenschaften |

### `trello_update_card`

Eine bestehende Karte in Trello aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | Ja | ID der zu aktualisierenden Karte |
| `name` | string | Nein | Neuer Name/Titel der Karte |
| `desc` | string | Nein | Neue Beschreibung der Karte |
| `closed` | boolean | Nein | Karte archivieren/schließen \(true\) oder wieder öffnen \(false\) |
| `idList` | string | Nein | Karte in eine andere Liste verschieben |
| `due` | string | Nein | Fälligkeitsdatum \(ISO 8601-Format\) |
| `dueComplete` | boolean | Nein | Fälligkeitsdatum als abgeschlossen markieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `card` | object | Das aktualisierte Kartenobjekt mit id, name, desc, url und anderen Eigenschaften |

### `trello_get_actions`

Aktivitäten/Aktionen von einem Board oder einer Karte abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Nein | ID des Boards, von dem Aktionen abgerufen werden sollen \(entweder boardId oder cardId erforderlich\) |
| `cardId` | string | Nein | ID der Karte, von der Aktionen abgerufen werden sollen \(entweder boardId oder cardId erforderlich\) |
| `filter` | string | Nein | Aktionen nach Typ filtern \(z.B. "commentCard,updateCard,createCard" oder "all"\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Aktionen \(Standard: 50, max: 1000\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `actions` | array | Array von Aktionsobjekten mit type, date, member und data |
| `count` | number | Anzahl der zurückgegebenen Aktionen |

### `trello_add_comment`

Einen Kommentar zu einer Trello-Karte hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | Ja | ID der Karte, die kommentiert werden soll |
| `text` | string | Ja | Kommentartext |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `comment` | object | Das erstellte Kommentarobjekt mit id, text, date und member creator |

## Hinweise

- Kategorie: `tools`
- Typ: `trello`
```

--------------------------------------------------------------------------------

````
