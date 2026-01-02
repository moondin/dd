---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 36
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 36 of 933)

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

---[FILE: mailgun.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/mailgun.mdx

```text
---
title: Mailgun
description: E-Mails versenden und Mailinglisten mit Mailgun verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailgun"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailgun](https://www.mailgun.com) ist ein leistungsstarker E-Mail-Zustelldienst, der für Entwickler und Unternehmen konzipiert wurde, um E-Mails mühelos zu versenden, zu empfangen und zu verfolgen. Mailgun ermöglicht es Ihnen, robuste APIs für zuverlässige Transaktions- und Marketing-E-Mails, flexible Mailinglisten-Verwaltung und fortschrittliches Event-Tracking zu nutzen.

Mit Mailguns umfassendem Funktionsumfang können Sie wichtige E-Mail-Operationen automatisieren und die Zustellbarkeit sowie das Engagement der Empfänger genau überwachen. Dies macht es zu einer idealen Lösung für Workflow-Automatisierung, bei der Kommunikation, Benachrichtigungen und Kampagnen-Mails zentrale Bestandteile Ihrer Prozesse sind.

Zu den wichtigsten Funktionen von Mailgun gehören:

- **Versand von Transaktions-E-Mails:** Zustellung von E-Mails mit hohem Volumen wie Kontobenachrichtigungen, Quittungen, Warnmeldungen und Passwort-Zurücksetzungen.
- **Reichhaltige E-Mail-Inhalte:** Versenden Sie sowohl Nur-Text- als auch HTML-E-Mails und verwenden Sie Tags zur Kategorisierung und Verfolgung Ihrer Nachrichten.
- **Mailinglisten-Verwaltung:** Erstellen, aktualisieren und verwalten Sie Mailinglisten und Mitglieder, um Gruppenkommunikation effizient zu versenden.
- **Domain-Informationen:** Rufen Sie Details zu Ihren Sende-Domains ab, um Konfiguration und Zustand zu überwachen.
- **Event-Tracking:** Analysieren Sie die Zustellbarkeit von E-Mails und das Engagement mit detaillierten Ereignisdaten zu gesendeten Nachrichten.
- **Nachrichtenabruf:** Greifen Sie auf gespeicherte Nachrichten für Compliance-, Analyse- oder Fehlerbehebungszwecke zu.

Durch die Integration von Mailgun in Sim können Ihre Agenten programmatisch E-Mails versenden, E-Mail-Listen verwalten, auf Domain-Informationen zugreifen und Ereignisse in Echtzeit überwachen – als Teil automatisierter Workflows. Dies ermöglicht eine intelligente, datengesteuerte Interaktion mit Ihren Nutzern direkt aus Ihren KI-gestützten Prozessen heraus.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Mailgun in Ihren Workflow. Senden Sie Transaktions-E-Mails, verwalten Sie Mailinglisten und Mitglieder, sehen Sie Domain-Informationen ein und verfolgen Sie E-Mail-Ereignisse. Unterstützt Text- und HTML-E-Mails, Tags für Tracking und umfassende Listenverwaltung.

## Tools

### `mailgun_send_message`

E-Mail über die Mailgun API versenden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `domain` | string | Ja | Mailgun-Domain \(z.B. mg.example.com\) |
| `from` | string | Ja | E-Mail-Adresse des Absenders |
| `to` | string | Ja | E-Mail-Adresse des Empfängers \(durch Komma getrennt für mehrere\) |
| `subject` | string | Ja | Betreff der E-Mail |
| `text` | string | Nein | Nur-Text-Inhalt der E-Mail |
| `html` | string | Nein | HTML-Inhalt der E-Mail |
| `cc` | string | Nein | CC-E-Mail-Adresse \(durch Komma getrennt für mehrere\) |
| `bcc` | string | Nein | BCC-E-Mail-Adresse \(durch Komma getrennt für mehrere\) |
| `tags` | string | Nein | Tags für die E-Mail \(durch Komma getrennt\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Nachricht erfolgreich gesendet wurde |
| `id` | string | Nachrichten-ID |
| `message` | string | Antwortnachricht von Mailgun |

### `mailgun_get_message`

Eine gespeicherte Nachricht anhand ihres Schlüssels abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `domain` | string | Ja | Mailgun-Domain |
| `messageKey` | string | Ja | Speicherschlüssel der Nachricht |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Anfrage erfolgreich war |
| `recipients` | string | Nachrichtenempfänger |
| `from` | string | Absender-E-Mail |
| `subject` | string | Nachrichtenbetreff |
| `bodyPlain` | string | Nur-Text-Inhalt |
| `strippedText` | string | Bereinigter Text |
| `strippedSignature` | string | Bereinigte Signatur |
| `bodyHtml` | string | HTML-Inhalt |
| `strippedHtml` | string | Bereinigtes HTML |
| `attachmentCount` | number | Anzahl der Anhänge |
| `timestamp` | number | Nachrichtenzeitstempel |
| `messageHeaders` | json | Nachrichtenheader |
| `contentIdMap` | json | Content-ID-Zuordnung |

### `mailgun_list_messages`

Ereignisse (Logs) für über Mailgun gesendete Nachrichten auflisten

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `domain` | string | Ja | Mailgun-Domain |
| `event` | string | Nein | Nach Ereignistyp filtern \(accepted, delivered, failed, opened, clicked, usw.\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ereignisse \(Standard: 100\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Anfrage erfolgreich war |
| `items` | json | Array von Ereigniselementen |
| `paging` | json | Paginierungsinformationen |

### `mailgun_create_mailing_list`

Eine neue Mailingliste erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `address` | string | Ja | Mailinglisten-Adresse \(z.B. liste@beispiel.com\) |
| `name` | string | Nein | Name der Mailingliste |
| `description` | string | Nein | Beschreibung der Mailingliste |
| `accessLevel` | string | Nein | Zugriffsebene: readonly, members oder everyone |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Liste erfolgreich erstellt wurde |
| `message` | string | Antwortnachricht |
| `list` | json | Details der erstellten Mailingliste |

### `mailgun_get_mailing_list`

Details einer Mailingliste abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `address` | string | Ja | Mailinglisten-Adresse |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Anfrage erfolgreich war |
| `list` | json | Details der Mailingliste |

### `mailgun_add_list_member`

Ein Mitglied zu einer Mailingliste hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `listAddress` | string | Ja | Mailinglisten-Adresse |
| `address` | string | Ja | E-Mail-Adresse des Mitglieds |
| `name` | string | Nein | Name des Mitglieds |
| `vars` | string | Nein | JSON-String mit benutzerdefinierten Variablen |
| `subscribed` | boolean | Nein | Ob das Mitglied abonniert ist |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Mitglied erfolgreich hinzugefügt wurde |
| `message` | string | Antwortnachricht |
| `member` | json | Details des hinzugefügten Mitglieds |

### `mailgun_list_domains`

Alle Domains für Ihr Mailgun-Konto auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Anfrage erfolgreich war |
| `totalCount` | number | Gesamtanzahl der Domains |
| `items` | json | Array von Domain-Objekten |

### `mailgun_get_domain`

Details einer bestimmten Domain abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Mailgun API-Schlüssel |
| `domain` | string | Ja | Domainname |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Anfrage erfolgreich war |
| `domain` | json | Domain-Details |

## Hinweise

- Kategorie: `tools`
- Typ: `mailgun`
```

--------------------------------------------------------------------------------

---[FILE: mcp.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/mcp.mdx

```text
---
title: MCP Tool
description: Führe Tools von Model Context Protocol (MCP) Servern aus
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mcp"
  color="#181C1E"
/>

## Gebrauchsanweisung

Integriere MCP in den Workflow. Kann Tools von MCP-Servern ausführen. Erfordert MCP-Server in den Workspace-Einstellungen.

## Hinweise

- Kategorie: `tools`
- Typ: `mcp`
```

--------------------------------------------------------------------------------

---[FILE: mem0.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/mem0.mdx

```text
---
title: Mem0
description: Agent-Speicherverwaltung
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mem0"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mem0](https://mem0.ai) ist ein leistungsstarkes Gedächtnisverwaltungssystem, das speziell für KI-Agenten entwickelt wurde. Es bietet einen persistenten, durchsuchbaren Speicher, der es Agenten ermöglicht, vergangene Interaktionen zu erinnern, aus Erfahrungen zu lernen und Kontext über Gespräche und Workflow-Ausführungen hinweg zu bewahren.

Mit Mem0 können Sie:

- **Agenten-Erinnerungen speichern**: Gesprächsverlauf, Benutzerpräferenzen und wichtigen Kontext sichern
- **Relevante Informationen abrufen**: Semantische Suche nutzen, um die relevantesten vergangenen Interaktionen zu finden
- **Kontextbewusste Agenten erstellen**: Ihren Agenten ermöglichen, auf vergangene Gespräche zu verweisen und Kontinuität zu wahren
- **Interaktionen personalisieren**: Antworten basierend auf Benutzerhistorie und -präferenzen anpassen
- **Langzeitgedächtnis implementieren**: Agenten erstellen, die im Laufe der Zeit lernen und sich anpassen
- **Gedächtnisverwaltung skalieren**: Gedächtnisanforderungen für mehrere Benutzer und komplexe Workflows verwalten

In Sim ermöglicht die Mem0-Integration Ihren Agenten, ein persistentes Gedächtnis über Workflow-Ausführungen hinweg zu bewahren. Dies erlaubt natürlichere, kontextbewusste Interaktionen, bei denen Agenten vergangene Gespräche abrufen, Benutzerpräferenzen speichern und auf früheren Interaktionen aufbauen können. Durch die Verbindung von Sim mit Mem0 können Sie Agenten erstellen, die menschenähnlicher in ihrer Fähigkeit wirken, sich an vergangene Erfahrungen zu erinnern und daraus zu lernen. Die Integration unterstützt das Hinzufügen neuer Erinnerungen, das semantische Durchsuchen bestehender Erinnerungen und das Abrufen spezifischer Gedächtniseinträge. Diese Gedächtnisverwaltungsfähigkeit ist wesentlich für die Entwicklung anspruchsvoller Agenten, die Kontext über Zeit hinweg bewahren, Interaktionen basierend auf Benutzerhistorie personalisieren und ihre Leistung durch angesammeltes Wissen kontinuierlich verbessern können.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Mem0 in den Workflow. Kann Erinnerungen hinzufügen, durchsuchen und abrufen. API-Schlüssel erforderlich.

## Tools

### `mem0_add_memories`

Fügen Sie Erinnerungen zu Mem0 für persistente Speicherung und Abruf hinzu

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Benutzer-ID, die mit dem Speicher verknüpft ist |
| `messages` | json | Ja | Array von Nachrichtenobjekten mit Rolle und Inhalt |
| `apiKey` | string | Ja | Ihr Mem0 API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ids` | array | Array von erstellten Speicher-IDs |
| `memories` | array | Array von erstellten Speicherobjekten |

### `mem0_search_memories`

Suche nach Speichern in Mem0 mit semantischer Suche

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Benutzer-ID, für die Speicher gesucht werden sollen |
| `query` | string | Ja | Suchanfrage zum Finden relevanter Speicher |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse |
| `apiKey` | string | Ja | Ihr Mem0 API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `searchResults` | array | Array von Suchergebnissen mit Speicherdaten, die jeweils ID, Daten und Bewertung enthalten |
| `ids` | array | Array von Speicher-IDs, die in den Suchergebnissen gefunden wurden |

### `mem0_get_memories`

Abrufen von Speichern aus Mem0 nach ID oder Filterkriterien

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Benutzer-ID, für die Erinnerungen abgerufen werden sollen |
| `memoryId` | string | Nein | Spezifische Erinnerungs-ID zum Abrufen |
| `startDate` | string | Nein | Startdatum für die Filterung nach created_at \(Format: JJJJ-MM-TT\) |
| `endDate` | string | Nein | Enddatum für die Filterung nach created_at \(Format: JJJJ-MM-TT\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse |
| `apiKey` | string | Ja | Ihr Mem0 API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `memories` | array | Array von abgerufenen Erinnerungsobjekten |
| `ids` | array | Array von Erinnerungs-IDs, die abgerufen wurden |

## Hinweise

- Kategorie: `tools`
- Typ: `mem0`
```

--------------------------------------------------------------------------------

---[FILE: memory.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/memory.mdx

```text
---
title: Memory
description: Speicher hinzufügen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="memory"
  color="#F64F9E"
/>

## Gebrauchsanweisung

Memory in den Workflow integrieren. Kann Erinnerungen hinzufügen, eine Erinnerung abrufen, alle Erinnerungen abrufen und Erinnerungen löschen.

## Tools

### `memory_add`

Füge eine neue Erinnerung zur Datenbank hinzu oder ergänze bestehende Erinnerungen mit derselben ID.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Nein | Konversationskennung (z.B. user-123, session-abc). Wenn bereits eine Erinnerung mit dieser conversationId für diesen Block existiert, wird die neue Nachricht angehängt. |
| `id` | string | Nein | Legacy-Parameter für die Konversationskennung. Verwenden Sie stattdessen conversationId. Für Abwärtskompatibilität bereitgestellt. |
| `role` | string | Ja | Rolle für Agent-Erinnerung (user, assistant oder system) |
| `content` | string | Ja | Inhalt für Agent-Erinnerung |
| `blockId` | string | Nein | Optionale Block-ID. Wenn nicht angegeben, wird die aktuelle Block-ID aus dem Ausführungskontext verwendet oder standardmäßig "default" gesetzt. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Speicher erfolgreich hinzugefügt wurde |
| `memories` | array | Array von Speicherobjekten einschließlich des neuen oder aktualisierten Speichers |
| `error` | string | Fehlermeldung, falls der Vorgang fehlgeschlagen ist |

### `memory_get`

Erinnerungen nach conversationId, blockId, blockName oder einer Kombination abrufen. Gibt alle übereinstimmenden Erinnerungen zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Nein | Konversationskennung (z.B. user-123, session-abc). Wenn allein angegeben, werden alle Erinnerungen für diese Konversation über alle Blöcke hinweg zurückgegeben. |
| `id` | string | Nein | Legacy-Parameter für die Konversationskennung. Verwenden Sie stattdessen conversationId. Für Abwärtskompatibilität bereitgestellt. |
| `blockId` | string | Nein | Block-Kennung. Wenn allein angegeben, werden alle Erinnerungen für diesen Block über alle Konversationen hinweg zurückgegeben. Wenn mit conversationId angegeben, werden Erinnerungen für diese spezifische Konversation in diesem Block zurückgegeben. |
| `blockName` | string | Nein | Blockname. Alternative zu blockId. Wenn allein angegeben, werden alle Erinnerungen für Blöcke mit diesem Namen zurückgegeben. Wenn mit conversationId angegeben, werden Erinnerungen für diese Konversation in Blöcken mit diesem Namen zurückgegeben. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Erinnerung erfolgreich abgerufen wurde |
| `memories` | array | Array von Speicherobjekten mit conversationId, blockId, blockName und data-Feldern |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `error` | string | Fehlermeldung, wenn der Vorgang fehlgeschlagen ist |

### `memory_get_all`

Alle Speicher aus der Datenbank abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob alle Erinnerungen erfolgreich abgerufen wurden |
| `memories` | array | Array aller Speicherobjekte mit key, conversationId, blockId, blockName und data-Feldern |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `error` | string | Fehlermeldung, wenn der Vorgang fehlgeschlagen ist |

### `memory_delete`

Löschen von Erinnerungen nach conversationId, blockId, blockName oder einer Kombination davon. Unterstützt Massenlöschung.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Nein | Konversationskennung (z.B. user-123, session-abc). Wenn allein angegeben, werden alle Erinnerungen für diese Konversation über alle Blöcke hinweg gelöscht. |
| `id` | string | Nein | Legacy-Parameter für die Konversationskennung. Verwenden Sie stattdessen conversationId. Für Abwärtskompatibilität bereitgestellt. |
| `blockId` | string | Nein | Block-Kennung. Wenn allein angegeben, werden alle Erinnerungen für diesen Block über alle Konversationen hinweg gelöscht. Wenn mit conversationId angegeben, werden Erinnerungen für diese spezifische Konversation in diesem Block gelöscht. |
| `blockName` | string | Nein | Blockname. Alternative zu blockId. Wenn allein angegeben, werden alle Erinnerungen für Blöcke mit diesem Namen gelöscht. Wenn mit conversationId angegeben, werden Erinnerungen für diese Konversation in Blöcken mit diesem Namen gelöscht. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Erinnerung erfolgreich gelöscht wurde |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `error` | string | Fehlermeldung, wenn der Vorgang fehlgeschlagen ist |

## Hinweise

- Kategorie: `blocks`
- Typ: `memory`
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/de/tools/meta.json

```json
{
  "pages": [
    "index",
    "airtable",
    "arxiv",
    "asana",
    "browser_use",
    "clay",
    "confluence",
    "discord",
    "elevenlabs",
    "exa",
    "file",
    "firecrawl",
    "github",
    "gmail",
    "google_calendar",
    "google_docs",
    "google_drive",
    "google_forms",
    "google_search",
    "google_sheets",
    "google_vault",
    "hubspot",
    "huggingface",
    "hunter",
    "image_generator",
    "jina",
    "jira",
    "knowledge",
    "linear",
    "linkup",
    "mem0",
    "memory",
    "microsoft_excel",
    "microsoft_planner",
    "microsoft_teams",
    "mistral_parse",
    "mongodb",
    "mysql",
    "notion",
    "onedrive",
    "openai",
    "outlook",
    "parallel_ai",
    "perplexity",
    "pinecone",
    "pipedrive",
    "postgresql",
    "qdrant",
    "reddit",
    "resend",
    "s3",
    "salesforce",
    "serper",
    "sharepoint",
    "slack",
    "stagehand",
    "stagehand_agent",
    "stripe",
    "supabase",
    "tavily",
    "telegram",
    "thinking",
    "translate",
    "trello",
    "twilio_sms",
    "twilio_voice",
    "typeform",
    "vision",
    "wealthbox",
    "webflow",
    "whatsapp",
    "wikipedia",
    "x",
    "youtube",
    "zep"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/microsoft_excel.mdx

```text
---
title: Microsoft Excel
description: Daten lesen, schreiben und aktualisieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_excel"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/excel) ist eine leistungsstarke Tabellenkalkulationsanwendung, die Datenverwaltung, -analyse und -visualisierung ermöglicht. Durch die Microsoft Excel-Integration in Sim können Sie programmgesteuert Tabellenkalkulationsdaten lesen, schreiben und bearbeiten, um Ihre Workflow-Automatisierungsanforderungen zu unterstützen.

Mit der Microsoft Excel-Integration können Sie:

- **Tabellenkalkulationsdaten lesen**: Zugriff auf Daten aus bestimmten Bereichen, Blättern und Zellen
- **Daten schreiben und aktualisieren**: Neue Daten hinzufügen oder bestehende Tabelleninhalte ändern
- **Tabellen verwalten**: Tabellarische Datenstrukturen erstellen und bearbeiten
- **Mehrere Blätter verwalten**: Mit mehreren Arbeitsblättern in einer Arbeitsmappe arbeiten
- **Daten verarbeiten**: Tabellenkalkulationsdaten importieren, exportieren und transformieren

In Sim bietet die Microsoft Excel-Integration nahtlosen Zugriff auf Tabellenkalkulationsfunktionen durch OAuth-Authentifizierung. Sie können Daten aus bestimmten Bereichen lesen, neue Informationen schreiben, bestehende Zellen aktualisieren und verschiedene Datenformate verarbeiten. Die Integration unterstützt sowohl Lese- als auch Schreibvorgänge mit flexiblen Ein- und Ausgabeoptionen. Dies ermöglicht es Ihnen, Workflows zu erstellen, die Tabellenkalkulationsdaten effektiv verwalten können, sei es beim Extrahieren von Informationen zur Analyse, beim automatischen Aktualisieren von Datensätzen oder bei der Aufrechterhaltung der Datenkonsistenz über Ihre Anwendungen hinweg.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Microsoft Excel in den Workflow. Kann lesen, schreiben, aktualisieren, zu Tabellen hinzufügen und neue Arbeitsblätter erstellen.

## Tools

### `microsoft_excel_read`

Daten aus einer Microsoft Excel-Tabelle lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der zu lesenden Tabelle |
| `range` | string | Nein | Der zu lesende Zellbereich. Akzeptiert "Tabellenname!A1:B2" für explizite Bereiche oder nur "Tabellenname" um den verwendeten Bereich dieses Tabellenblatts zu lesen. Falls nicht angegeben, wird der verwendete Bereich des ersten Tabellenblatts gelesen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | object | Bereichsdaten aus der Tabelle |

### `microsoft_excel_write`

Daten in eine Microsoft Excel-Tabelle schreiben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der Tabelle, in die geschrieben werden soll |
| `range` | string | Nein | Der Zellbereich, in den geschrieben werden soll |
| `values` | array | Ja | Die Daten, die in die Tabelle geschrieben werden sollen |
| `valueInputOption` | string | Nein | Das Format der zu schreibenden Daten |
| `includeValuesInResponse` | boolean | Nein | Ob die geschriebenen Werte in der Antwort enthalten sein sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updatedRange` | string | Der Bereich, der aktualisiert wurde |
| `updatedRows` | number | Anzahl der aktualisierten Zeilen |
| `updatedColumns` | number | Anzahl der aktualisierten Spalten |
| `updatedCells` | number | Anzahl der aktualisierten Zellen |
| `metadata` | object | Tabellen-Metadaten |

### `microsoft_excel_table_add`

Neue Zeilen zu einer Microsoft Excel-Tabelle hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der Tabellenkalkulation, die die Tabelle enthält |
| `tableName` | string | Ja | Der Name der Tabelle, zu der Zeilen hinzugefügt werden sollen |
| `values` | array | Ja | Die Daten, die zur Tabelle hinzugefügt werden sollen \(Array von Arrays oder Array von Objekten\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `index` | number | Index der ersten Zeile, die hinzugefügt wurde |
| `values` | array | Array von Zeilen, die zur Tabelle hinzugefügt wurden |
| `metadata` | object | Metadaten der Tabellenkalkulation |

### `microsoft_excel_worksheet_add`

Ein neues Arbeitsblatt (Tabellenblatt) in einer Microsoft Excel-Arbeitsmappe erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der Excel-Arbeitsmappe, zu der das Arbeitsblatt hinzugefügt werden soll |
| `worksheetName` | string | Ja | Der Name des neuen Arbeitsblatts. Muss innerhalb der Arbeitsmappe eindeutig sein und darf 31 Zeichen nicht überschreiten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `worksheet` | object | Details des neu erstellten Arbeitsblatts |

## Hinweise

- Kategorie: `tools`
- Typ: `microsoft_excel`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_planner.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/microsoft_planner.mdx

```text
---
title: Microsoft Planner
description: Verwalten von Aufgaben, Plänen und Buckets in Microsoft Planner
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_planner"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Planner](https://www.microsoft.com/en-us/microsoft-365/planner) ist ein Aufgabenverwaltungstool, das Teams hilft, Arbeit visuell mithilfe von Boards, Aufgaben und Buckets zu organisieren. Integriert in Microsoft 365 bietet es eine einfache, intuitive Möglichkeit, Teamprojekte zu verwalten, Verantwortlichkeiten zuzuweisen und den Fortschritt zu verfolgen.

Mit Microsoft Planner können Sie:

- **Aufgaben erstellen und verwalten**: Neue Aufgaben mit Fälligkeitsdaten, Prioritäten und zugewiesenen Benutzern hinzufügen
- **Mit Buckets organisieren**: Aufgaben nach Phase, Status oder Kategorie gruppieren, um den Arbeitsablauf Ihres Teams abzubilden
- **Projektstatus visualisieren**: Boards, Diagramme und Filter verwenden, um die Arbeitsbelastung zu überwachen und den Fortschritt zu verfolgen
- **In Microsoft 365 integriert bleiben**: Aufgaben nahtlos mit Teams, Outlook und anderen Microsoft-Tools verbinden

In Sim ermöglicht die Microsoft Planner-Integration Ihren Agenten, Aufgaben programmatisch zu erstellen, zu lesen und zu verwalten als Teil ihrer Workflows. Agenten können neue Aufgaben basierend auf eingehenden Anfragen generieren, Aufgabendetails abrufen, um Entscheidungen zu treffen, und den Status über Projekte hinweg verfolgen — alles ohne menschliches Eingreifen. Ob Sie Workflows für Kundenonboarding, interne Projektverfolgung oder die Generierung von Folgeaufgaben erstellen, die Integration von Microsoft Planner mit Sim gibt Ihren Agenten eine strukturierte Möglichkeit, Arbeit zu koordinieren, Aufgabenerstellung zu automatisieren und Teams aufeinander abzustimmen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisungen

Integrieren Sie Microsoft Planner in den Workflow. Verwalten Sie Aufgaben, Pläne, Buckets und Aufgabendetails einschließlich Checklisten und Referenzen.

## Tools

### `microsoft_planner_read_task`

Aufgaben aus Microsoft Planner lesen - alle Benutzeraufgaben oder alle Aufgaben aus einem bestimmten Plan abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Nein | Die ID des Plans, aus dem Aufgaben abgerufen werden sollen \(wenn nicht angegeben, werden alle Benutzeraufgaben abgerufen\) |
| `taskId` | string | Nein | Die ID der abzurufenden Aufgabe |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob Aufgaben erfolgreich abgerufen wurden |
| `tasks` | array | Array von Aufgabenobjekten mit gefilterten Eigenschaften |
| `metadata` | object | Metadaten einschließlich planId, userId und planUrl |

### `microsoft_planner_create_task`

Eine neue Aufgabe in Microsoft Planner erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Ja | Die ID des Plans, in dem die Aufgabe erstellt wird |
| `title` | string | Ja | Der Titel der Aufgabe |
| `description` | string | Nein | Die Beschreibung der Aufgabe |
| `dueDateTime` | string | Nein | Das Fälligkeitsdatum und die Uhrzeit für die Aufgabe \(ISO 8601-Format\) |
| `assigneeUserId` | string | Nein | Die Benutzer-ID, der die Aufgabe zugewiesen werden soll |
| `bucketId` | string | Nein | Die Bucket-ID, in der die Aufgabe platziert werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob die Aufgabe erfolgreich erstellt wurde |
| `task` | object | Das erstellte Aufgabenobjekt mit allen Eigenschaften |
| `metadata` | object | Metadaten einschließlich planId, taskId und taskUrl |

### `microsoft_planner_update_task`

Eine Aufgabe in Microsoft Planner aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Ja | Die ID der zu aktualisierenden Aufgabe |
| `etag` | string | Ja | Der ETag-Wert der zu aktualisierenden Aufgabe \(If-Match-Header\) |
| `title` | string | Nein | Der neue Titel der Aufgabe |
| `bucketId` | string | Nein | Die Bucket-ID, in die die Aufgabe verschoben werden soll |
| `dueDateTime` | string | Nein | Das Fälligkeitsdatum und die Uhrzeit für die Aufgabe \(ISO 8601-Format\) |
| `startDateTime` | string | Nein | Das Startdatum und die Uhrzeit für die Aufgabe \(ISO 8601-Format\) |
| `percentComplete` | number | Nein | Der Prozentsatz der Aufgabenfertigstellung \(0-100\) |
| `priority` | number | Nein | Die Priorität der Aufgabe \(0-10\) |
| `assigneeUserId` | string | Nein | Die Benutzer-ID, der die Aufgabe zugewiesen werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob die Aufgabe erfolgreich aktualisiert wurde |
| `message` | string | Erfolgsmeldung bei Aktualisierung der Aufgabe |
| `task` | object | Das aktualisierte Aufgabenobjekt mit allen Eigenschaften |
| `taskId` | string | ID der aktualisierten Aufgabe |
| `etag` | string | Neuer ETag nach der Aktualisierung - verwenden Sie diesen für nachfolgende Operationen |
| `metadata` | object | Metadaten einschließlich taskId, planId und taskUrl |

### `microsoft_planner_delete_task`

Eine Aufgabe aus Microsoft Planner löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Ja | Die ID der zu löschenden Aufgabe |
| `etag` | string | Ja | Der ETag-Wert der zu löschenden Aufgabe \(If-Match-Header\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob die Aufgabe erfolgreich gelöscht wurde |
| `deleted` | boolean | Bestätigung der Löschung |
| `metadata` | object | Zusätzliche Metadaten |

### `microsoft_planner_list_plans`

Alle Pläne auflisten, die mit dem aktuellen Benutzer geteilt wurden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob Pläne erfolgreich abgerufen wurden |
| `plans` | array | Array von Planobjekten, die mit dem aktuellen Benutzer geteilt wurden |
| `metadata` | object | Metadaten einschließlich userId und Anzahl |

### `microsoft_planner_read_plan`

Details eines bestimmten Microsoft Planner-Plans abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Ja | Die ID des abzurufenden Plans |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob der Plan erfolgreich abgerufen wurde |
| `plan` | object | Das Planobjekt mit allen Eigenschaften |
| `metadata` | object | Metadaten einschließlich planId und planUrl |

### `microsoft_planner_list_buckets`

Alle Buckets in einem Microsoft Planner-Plan auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Ja | Die ID des Plans |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob Buckets erfolgreich abgerufen wurden |
| `buckets` | array | Array von Bucket-Objekten |
| `metadata` | object | Metadaten einschließlich planId und Anzahl |

### `microsoft_planner_read_bucket`

Details eines bestimmten Buckets abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Ja | Die ID des abzurufenden Buckets |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob der Bucket erfolgreich abgerufen wurde |
| `bucket` | object | Das Bucket-Objekt mit allen Eigenschaften |
| `metadata` | object | Metadaten einschließlich bucketId und planId |

### `microsoft_planner_create_bucket`

Einen neuen Bucket in einem Microsoft Planner-Plan erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Ja | Die ID des Plans, in dem der Bucket erstellt wird |
| `name` | string | Ja | Der Name des Buckets |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob der Bucket erfolgreich erstellt wurde |
| `bucket` | object | Das erstellte Bucket-Objekt mit allen Eigenschaften |
| `metadata` | object | Metadaten einschließlich bucketId und planId |

### `microsoft_planner_update_bucket`

Einen Bucket in Microsoft Planner aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Ja | Die ID des zu aktualisierenden Buckets |
| `name` | string | Nein | Der neue Name des Buckets |
| `etag` | string | Ja | Der ETag-Wert des zu aktualisierenden Buckets \(If-Match-Header\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob der Bucket erfolgreich aktualisiert wurde |
| `bucket` | object | Das aktualisierte Bucket-Objekt mit allen Eigenschaften |
| `metadata` | object | Metadaten einschließlich bucketId und planId |

### `microsoft_planner_delete_bucket`

Einen Bucket aus Microsoft Planner löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Ja | Die ID des zu löschenden Buckets |
| `etag` | string | Ja | Der ETag-Wert des zu löschenden Buckets \(If-Match-Header\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob der Bucket erfolgreich gelöscht wurde |
| `deleted` | boolean | Bestätigung der Löschung |
| `metadata` | object | Zusätzliche Metadaten |

### `microsoft_planner_get_task_details`

Detaillierte Informationen über eine Aufgabe abrufen, einschließlich Checkliste und Referenzen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Ja | Die ID der Aufgabe |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob die Aufgabendetails erfolgreich abgerufen wurden |
| `taskDetails` | object | Die Aufgabendetails einschließlich Beschreibung, Checkliste und Referenzen |
| `etag` | string | Der ETag-Wert für diese Aufgabendetails - verwenden Sie diesen für Aktualisierungsoperationen |
| `metadata` | object | Metadaten einschließlich taskId |

### `microsoft_planner_update_task_details`

Aktualisieren von Aufgabendetails einschließlich Beschreibung, Checklistenelementen und Referenzen in Microsoft Planner

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Ja | Die ID der Aufgabe |
| `etag` | string | Ja | Der ETag-Wert aus den zu aktualisierenden Aufgabendetails \(If-Match-Header\) |
| `description` | string | Nein | Die Beschreibung der Aufgabe |
| `checklist` | object | Nein | Checklistenelemente als JSON-Objekt |
| `references` | object | Nein | Referenzen als JSON-Objekt |
| `previewType` | string | Nein | Vorschautyp: automatic, noPreview, checklist, description oder reference |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob die Aufgabendetails erfolgreich aktualisiert wurden |
| `taskDetails` | object | Das aktualisierte Aufgabendetailobjekt mit allen Eigenschaften |
| `metadata` | object | Metadaten einschließlich taskId |

## Hinweise

- Kategorie: `tools`
- Typ: `microsoft_planner`
```

--------------------------------------------------------------------------------

````
