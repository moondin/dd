---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 20
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 20 of 933)

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

---[FILE: calendly.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/calendly.mdx

```text
---
title: Calendly
description: Verwalte Calendly-Terminplanung und Ereignisse
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="calendly"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Calendly](https://calendly.com/) ist eine beliebte Plattform zur Terminplanungsautomatisierung, die Ihnen hilft, Meetings, Events und Termine mühelos zu buchen. Mit Calendly können Teams und Einzelpersonen die Terminplanung optimieren, den E-Mail-Austausch reduzieren und Aufgaben rund um Veranstaltungen automatisieren.

Mit der Sim Calendly-Integration können Ihre Agenten:

- **Informationen über Ihr Konto und geplante Ereignisse abrufen**: Verwenden Sie Tools, um Benutzerinformationen, Ereignistypen und geplante Ereignisse für Analysen oder Automatisierungen abzurufen.
- **Ereignistypen und Terminplanung verwalten**: Greifen Sie auf verfügbare Ereignistypen für Benutzer oder Organisationen zu und listen Sie diese auf, rufen Sie Details zu bestimmten Ereignistypen ab und überwachen Sie geplante Meetings und Teilnehmerdaten.
- **Automatisieren Sie Follow-ups und Workflows**: Wenn Benutzer Meetings planen, umplanen oder stornieren, können Sim-Agenten automatisch entsprechende Workflows auslösen – wie das Senden von Erinnerungen, das Aktualisieren von CRMs oder das Benachrichtigen von Teilnehmern.
- **Einfache Integration über Webhooks**: Richten Sie Sim-Workflows ein, um auf Calendly-Webhook-Ereignisse in Echtzeit zu reagieren, einschließlich wenn Eingeladene Termine planen, stornieren oder mit Routing-Formularen interagieren.

Ob Sie die Meeting-Vorbereitung automatisieren, Einladungen verwalten oder benutzerdefinierte Workflows als Reaktion auf Planungsaktivitäten ausführen möchten – die Calendly-Tools in Sim bieten Ihnen flexiblen und sicheren Zugriff. Erschließen Sie neue Automatisierungsmöglichkeiten, indem Sie sofort auf Planungsänderungen reagieren – und optimieren Sie so die Abläufe und die Kommunikation Ihres Teams.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Calendly in Ihren Workflow. Verwalten Sie Ereignistypen, geplante Ereignisse, Eingeladene und Webhooks. Kann auch Workflows basierend auf Calendly-Webhook-Ereignissen auslösen (Eingeladener hat Termin vereinbart, Eingeladener hat storniert, Routing-Formular wurde eingereicht). Erfordert einen persönlichen Zugriffstoken.

## Tools

### `calendly_get_current_user`

Informationen über den aktuell authentifizierten Calendly-Benutzer abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönlicher Zugriffstoken |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `resource` | object | Informationen zum aktuellen Benutzer |

### `calendly_list_event_types`

Eine Liste aller Ereignistypen für einen Benutzer oder eine Organisation abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönliches Zugriffstoken |
| `user` | string | Nein | Nur Ereignistypen zurückgeben, die zu diesem Benutzer gehören \(URI-Format\) |
| `organization` | string | Nein | Nur Ereignistypen zurückgeben, die zu dieser Organisation gehören \(URI-Format\) |
| `count` | number | Nein | Anzahl der Ergebnisse pro Seite \(Standard: 20, max: 100\) |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `sort` | string | Nein | Sortierreihenfolge für Ergebnisse \(z.B. "name:asc", "name:desc"\) |
| `active` | boolean | Nein | Bei true werden nur aktive Ereignistypen angezeigt. Bei false oder nicht ausgewählt werden alle Ereignistypen angezeigt \(sowohl aktive als auch inaktive\). |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `collection` | array | Array von Ereignistyp-Objekten |

### `calendly_get_event_type`

Detaillierte Informationen über einen bestimmten Ereignistyp abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönliches Zugriffstoken |
| `eventTypeUuid` | string | Ja | Ereignistyp-UUID \(kann vollständige URI oder nur die UUID sein\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `resource` | object | Details zum Ereignistyp |

### `calendly_list_scheduled_events`

Eine Liste geplanter Ereignisse für einen Benutzer oder eine Organisation abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönliches Zugriffstoken |
| `user` | string | Nein | Gibt Ereignisse zurück, die zu diesem Benutzer gehören \(URI-Format\). Entweder "user" oder "organization" muss angegeben werden. |
| `organization` | string | Nein | Gibt Ereignisse zurück, die zu dieser Organisation gehören \(URI-Format\). Entweder "user" oder "organization" muss angegeben werden. |
| `invitee_email` | string | Nein | Gibt Ereignisse zurück, bei denen der Eingeladene diese E-Mail hat |
| `count` | number | Nein | Anzahl der Ergebnisse pro Seite \(Standard: 20, max: 100\) |
| `max_start_time` | string | Nein | Gibt Ereignisse mit Startzeit vor diesem Zeitpunkt zurück \(ISO 8601-Format\) |
| `min_start_time` | string | Nein | Gibt Ereignisse mit Startzeit nach diesem Zeitpunkt zurück \(ISO 8601-Format\) |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `sort` | string | Nein | Sortierreihenfolge für Ergebnisse \(z.B. "start_time:asc", "start_time:desc"\) |
| `status` | string | Nein | Nach Status filtern \("active" oder "canceled"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `collection` | array | Array von geplanten Ereignisobjekten |

### `calendly_get_scheduled_event`

Detaillierte Informationen über ein bestimmtes geplantes Ereignis abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönliches Zugriffstoken |
| `eventUuid` | string | Ja | UUID des geplanten Ereignisses \(kann vollständige URI oder nur die UUID sein\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `resource` | object | Details zum geplanten Ereignis |

### `calendly_list_event_invitees`

Eine Liste der Eingeladenen für ein geplantes Ereignis abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönliches Zugriffstoken |
| `eventUuid` | string | Ja | UUID des geplanten Ereignisses \(kann vollständige URI oder nur die UUID sein\) |
| `count` | number | Nein | Anzahl der Ergebnisse pro Seite \(Standard: 20, max: 100\) |
| `email` | string | Nein | Eingeladene nach E-Mail-Adresse filtern |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `sort` | string | Nein | Sortierreihenfolge für Ergebnisse \(z.B. "created_at:asc", "created_at:desc"\) |
| `status` | string | Nein | Nach Status filtern \("active" oder "canceled"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `collection` | array | Array von Eingeladenen-Objekten |

### `calendly_cancel_event`

Ein geplantes Ereignis stornieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Calendly persönliches Zugriffstoken |
| `eventUuid` | string | Ja | UUID des zu stornierenden geplanten Ereignisses \(kann vollständige URI oder nur die UUID sein\) |
| `reason` | string | Nein | Grund für die Stornierung \(wird an Eingeladene gesendet\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `resource` | object | Stornierungsdetails |

## Hinweise

- Kategorie: `tools`
- Typ: `calendly`
```

--------------------------------------------------------------------------------

---[FILE: clay.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/clay.mdx

```text
---
title: Clay
description: Populate Clay workbook
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="clay"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Clay](https://www.clay.com/) is a data enrichment and workflow automation platform that helps teams streamline lead generation, research, and data operations through powerful integrations and flexible inputs.

Learn how to use the Clay Tool in Sim to seamlessly insert data into a Clay workbook through webhook triggers. This tutorial walks you through setting up a webhook, configuring data mapping, and automating real-time updates to your Clay workbooks. Perfect for streamlining lead generation and data enrichment directly from your workflow!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cx_75X5sI_s"
  title="Clay Integration with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Clay, you can:

- **Enrich agent outputs**: Automatically feed your Sim agent data into Clay tables for structured tracking and analysis
- **Trigger workflows via webhooks**: Use Clay’s webhook support to initiate Sim agent tasks from within Clay
- **Leverage data loops**: Seamlessly iterate over enriched data rows with agents that operate across dynamic datasets

In Sim, the Clay integration allows your agents to push structured data into Clay tables via webhooks. This makes it easy to collect, enrich, and manage dynamic outputs such as leads, research summaries, or action items—all in a collaborative, spreadsheet-like interface. Your agents can populate rows in real time, enabling asynchronous workflows where AI-generated insights are captured, reviewed, and used by your team. Whether you're automating research, enriching CRM data, or tracking operational outcomes, Clay becomes a living data layer that interacts intelligently with your agents. By connecting Sim with Clay, you gain a powerful way to operationalize agent results, loop over datasets with precision, and maintain a clean, auditable record of AI-driven work.
{/* MANUAL-CONTENT-END */}

## Usage Instructions

Integrate Clay into the workflow. Can populate a table with data.

## Tools

### `clay_populate`

Populate Clay with data from a JSON file. Enables direct communication and notifications with timestamp tracking and channel confirmation.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `webhookURL` | string | Ja | Die Webhook-URL, die befüllt werden soll |
| `data` | json | Ja | Die Daten, die befüllt werden sollen |
| `authToken` | string | Nein | Optionaler Auth-Token für die Clay-Webhook-Authentifizierung \(die meisten Webhooks benötigen dies nicht\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | json | Antwortdaten vom Clay-Webhook |
| `metadata` | object | Webhook-Antwort-Metadaten |

## Notes

- Category: `tools`
- Type: `clay`
```

--------------------------------------------------------------------------------

---[FILE: confluence.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/confluence.mdx

```text
---
title: Confluence
description: Mit Confluence interagieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="confluence"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Confluence](https://www.atlassian.com/software/confluence) ist Atlassians leistungsstarke Plattform für Teamzusammenarbeit und Wissensmanagement. Sie dient als zentraler Arbeitsbereich, in dem Teams Informationen über Abteilungen und Organisationen hinweg erstellen, organisieren und teilen können.

Mit Confluence können Sie:

- **Strukturierte Dokumentation erstellen**: Umfassende Wikis, Projektpläne und Wissensbasen mit umfangreicher Formatierung aufbauen
- **In Echtzeit zusammenarbeiten**: Gemeinsam mit Teammitgliedern an Dokumenten arbeiten, mit Kommentaren, Erwähnungen und Bearbeitungsfunktionen
- **Informationen hierarchisch organisieren**: Inhalte mit Bereichen, Seiten und verschachtelten Hierarchien für intuitive Navigation strukturieren
- **Mit anderen Tools integrieren**: Verbindung mit Jira, Trello und anderen Atlassian-Produkten für nahtlose Workflow-Integration
- **Zugriffsberechtigungen kontrollieren**: Verwalten, wer bestimmte Inhalte ansehen, bearbeiten oder kommentieren kann

In Sim ermöglicht die Confluence-Integration Ihren Agenten den Zugriff auf die Wissensdatenbank Ihrer Organisation. Agenten können Informationen von Confluence-Seiten abrufen, nach bestimmten Inhalten suchen und bei Bedarf sogar Dokumentationen aktualisieren. Dies ermöglicht es Ihren Workflows, das in Ihrer Confluence-Instanz gespeicherte kollektive Wissen zu nutzen und Agenten zu erstellen, die auf interne Dokumentationen verweisen, etablierte Verfahren befolgen und aktuelle Informationsressourcen als Teil ihrer Tätigkeiten pflegen können.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Confluence in den Workflow. Kann Seiten lesen, erstellen, aktualisieren, löschen, Kommentare verwalten, Anhänge hinzufügen, Labels vergeben und Inhalte durchsuchen.

## Tools

### `confluence_retrieve`

Ruft Inhalte von Confluence-Seiten über die Confluence-API ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID zum Abrufen |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Abrufs |
| `pageId` | string | Confluence-Seiten-ID |
| `content` | string | Seiteninhalt ohne HTML-Tags |
| `title` | string | Seitentitel |

### `confluence_update`

Aktualisiert eine Confluence-Seite über die Confluence-API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID zum Aktualisieren |
| `title` | string | Nein | Neuer Titel für die Seite |
| `content` | string | Nein | Neuer Inhalt für die Seite im Confluence-Speicherformat |
| `version` | number | Nein | Versionsnummer der Seite (erforderlich zur Vermeidung von Konflikten) |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Aktualisierung |
| `pageId` | string | Confluence-Seiten-ID |
| `title` | string | Aktualisierter Seitentitel |
| `success` | boolean | Erfolgsstatus der Aktualisierungsoperation |

### `confluence_create_page`

Erstellen Sie eine neue Seite in einem Confluence-Space.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `spaceId` | string | Ja | Confluence-Space-ID, in dem die Seite erstellt wird |
| `title` | string | Ja | Titel der neuen Seite |
| `content` | string | Ja | Seiteninhalt im Confluence-Speicherformat (HTML) |
| `parentId` | string | Nein | Übergeordnete Seiten-ID, wenn eine Unterseite erstellt wird |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Erstellung |
| `pageId` | string | Erstellte Seiten-ID |
| `title` | string | Seitentitel |
| `url` | string | Seiten-URL |

### `confluence_delete_page`

Löschen einer Confluence-Seite (verschiebt sie in den Papierkorb, wo sie wiederhergestellt werden kann).

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID zum Löschen |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Löschung |
| `pageId` | string | Gelöschte Seiten-ID |
| `deleted` | boolean | Löschstatus |

### `confluence_search`

Suche nach Inhalten in Confluence-Seiten, Blog-Beiträgen und anderen Inhalten.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `query` | string | Ja | Suchabfragestring |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse (Standard: 25) |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Suche |
| `results` | array | Suchergebnisse |

### `confluence_create_comment`

Einen Kommentar zu einer Confluence-Seite hinzufügen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID, zu der ein Kommentar hinzugefügt werden soll |
| `comment` | string | Ja | Kommentartext im Confluence-Speicherformat |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Erstellung |
| `commentId` | string | Erstellte Kommentar-ID |
| `pageId` | string | Seiten-ID |

### `confluence_list_comments`

Listet alle Kommentare auf einer Confluence-Seite auf.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID, von der Kommentare aufgelistet werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Kommentare (Standard: 25) |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Abrufs |
| `comments` | array | Liste der Kommentare |

### `confluence_update_comment`

Aktualisiert einen vorhandenen Kommentar auf einer Confluence-Seite.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `commentId` | string | Ja | Confluence-Kommentar-ID zum Aktualisieren |
| `comment` | string | Ja | Aktualisierter Kommentartext im Confluence-Speicherformat |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Aktualisierung |
| `commentId` | string | Aktualisierte Kommentar-ID |
| `updated` | boolean | Aktualisierungsstatus |

### `confluence_delete_comment`

Löscht einen Kommentar von einer Confluence-Seite.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `commentId` | string | Ja | Confluence-Kommentar-ID zum Löschen |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Löschung |
| `commentId` | string | Gelöschte Kommentar-ID |
| `deleted` | boolean | Löschstatus |

### `confluence_upload_attachment`

Laden Sie eine Datei als Anhang zu einer Confluence-Seite hoch.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID, an die die Datei angehängt werden soll |
| `file` | file | Ja | Die als Anhang hochzuladende Datei |
| `fileName` | string | Nein | Optionaler benutzerdefinierter Dateiname für den Anhang |
| `comment` | string | Nein | Optionaler Kommentar zum Anhang |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Uploads |
| `attachmentId` | string | Hochgeladene Anhangs-ID |
| `title` | string | Dateiname des Anhangs |
| `fileSize` | number | Dateigröße in Bytes |
| `mediaType` | string | MIME-Typ des Anhangs |
| `downloadUrl` | string | Download-URL für den Anhang |
| `pageId` | string | Seiten-ID, zu der der Anhang hinzugefügt wurde |

### `confluence_list_attachments`

Listen Sie alle Anhänge einer Confluence-Seite auf.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID, von der Anhänge aufgelistet werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Anhänge (Standard: 25) |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Abrufs |
| `attachments` | array | Liste der Anhänge |

### `confluence_delete_attachment`

Löschen eines Anhangs von einer Confluence-Seite (wird in den Papierkorb verschoben).

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `attachmentId` | string | Ja | Confluence-Anhangs-ID zum Löschen |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Löschung |
| `attachmentId` | string | Gelöschte Anhangs-ID |
| `deleted` | boolean | Löschstatus |

### `confluence_list_labels`

Listet alle Labels einer Confluence-Seite auf.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `pageId` | string | Ja | Confluence-Seiten-ID, von der Labels aufgelistet werden sollen |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Abrufs |
| `labels` | array | Liste der Labels |

### `confluence_get_space`

Ruft Details zu einem bestimmten Confluence-Space ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `spaceId` | string | Ja | Confluence-Space-ID zum Abrufen |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Abrufs |
| `spaceId` | string | Space-ID |
| `name` | string | Space-Name |
| `key` | string | Space-Schlüssel |
| `type` | string | Space-Typ |
| `status` | string | Space-Status |
| `url` | string | Space-URL |

### `confluence_list_spaces`

Listet alle Confluence-Spaces auf, auf die der Benutzer zugreifen kann.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Confluence-Domain (z.B. ihrfirma.atlassian.net) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Spaces (Standard: 25) |
| `cloudId` | string | Nein | Confluence Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel des Abrufs |
| `spaces` | array | Liste der Spaces |

## Hinweise

- Kategorie: `tools`
- Typ: `confluence`
```

--------------------------------------------------------------------------------

---[FILE: cursor.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/cursor.mdx

```text
---
title: Cursor
description: Starten und verwalten Sie Cursor Cloud-Agenten zur Arbeit an
  GitHub-Repositories
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="cursor"
  color="#1E1E1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Cursor](https://www.cursor.so/) ist eine KI-IDE und cloudbasierte Plattform, mit der Sie leistungsstarke KI-Agenten starten und verwalten können, die direkt mit Ihren GitHub-Repositories arbeiten können. Cursor-Agenten können Entwicklungsaufgaben automatisieren, die Produktivität Ihres Teams steigern und mit Ihnen zusammenarbeiten, indem sie Codeänderungen vornehmen, auf natürlichsprachliche Anweisungen reagieren und einen Gesprächsverlauf über ihre Aktivitäten führen.

Mit Cursor können Sie:

- **Cloud-Agenten für Codebasen starten**: Erstellen Sie sofort neue KI-Agenten, die in der Cloud an Ihren Repositories arbeiten
- **Codierungsaufgaben mit natürlicher Sprache delegieren**: Leiten Sie Agenten mit schriftlichen Anweisungen, Änderungen und Klarstellungen an
- **Fortschritt und Ergebnisse überwachen**: Rufen Sie den Agentenstatus ab, sehen Sie detaillierte Ergebnisse und prüfen Sie aktuelle oder abgeschlossene Aufgaben
- **Zugriff auf den vollständigen Gesprächsverlauf**: Überprüfen Sie alle Eingabeaufforderungen und KI-Antworten für Transparenz und Nachvollziehbarkeit
- **Steuerung und Verwaltung des Agenten-Lebenszyklus**: Listen Sie aktive Agenten auf, beenden Sie Agenten und verwalten Sie API-basierte Agentenstarts und Nachverfolgungen

In Sim ermöglicht die Cursor-Integration Ihren Agenten und Workflows, programmatisch mit Cursor-Cloud-Agenten zu interagieren. Das bedeutet, Sie können Sim verwenden, um:

- Alle Cloud-Agenten auflisten und ihren aktuellen Status durchsuchen (`cursor_list_agents`)
- Aktuellen Status und Ausgaben für jeden Agenten abrufen (`cursor_get_agent`)
- Den vollständigen Gesprächsverlauf für jeden Codierungsagenten anzeigen (`cursor_get_conversation`)
- Nachfolgende Anweisungen oder neue Eingabeaufforderungen zu einem laufenden Agenten hinzufügen
- Agenten nach Bedarf verwalten und beenden

Diese Integration hilft Ihnen, die flexible Intelligenz von Sim-Agenten mit den leistungsstarken Automatisierungsfunktionen von Cursor zu kombinieren, wodurch es möglich wird, KI-gesteuerte Entwicklung über Ihre Projekte hinweg zu skalieren.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Interagieren Sie mit der Cursor Cloud Agents API, um KI-Agenten zu starten, die an Ihren GitHub-Repositories arbeiten können. Unterstützt das Starten von Agenten, das Hinzufügen von Folgeanweisungen, die Statusprüfung, die Anzeige von Konversationen und die Verwaltung des Agenten-Lebenszyklus.

## Tools

### `cursor_list_agents`

Listet alle Cloud-Agenten für den authentifizierten Benutzer mit optionaler Paginierung auf.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `limit` | number | Nein | Anzahl der zurückzugebenden Agenten \(Standard: 20, max: 100\) |
| `cursor` | string | Nein | Paginierungscursor aus der vorherigen Antwort |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Menschenlesbare Liste der Agenten |
| `metadata` | object | Metadaten der Agentenliste |

### `cursor_get_agent`

Ruft den aktuellen Status und die Ergebnisse eines Cloud-Agenten ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `agentId` | string | Ja | Eindeutige Kennung für den Cloud-Agenten \(z.B. bc_abc123\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Menschenlesbare Agentendetails |
| `metadata` | object | Agenten-Metadaten |

### `cursor_get_conversation`

Ruft den Konversationsverlauf eines Cloud-Agenten ab, einschließlich aller Benutzeraufforderungen und Assistentenantworten.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `agentId` | string | Ja | Eindeutige Kennung für den Cloud-Agenten \(z.B. bc_abc123\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Menschenlesbarer Konversationsverlauf |
| `metadata` | object | Konversations-Metadaten |

### `cursor_launch_agent`

Starten Sie einen neuen Cloud-Agenten, um an einem GitHub-Repository mit den angegebenen Anweisungen zu arbeiten.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `repository` | string | Ja | GitHub-Repository-URL \(z.B. https://github.com/your-org/your-repo\) |
| `ref` | string | Nein | Branch, Tag oder Commit, von dem aus gearbeitet werden soll \(standardmäßig der Hauptbranch\) |
| `promptText` | string | Ja | Der Anweisungstext für den Agenten |
| `promptImages` | string | Nein | JSON-Array von Bildobjekten mit Base64-Daten und Abmessungen |
| `model` | string | Nein | Zu verwendendes Modell \(leer lassen für automatische Auswahl\) |
| `branchName` | string | Nein | Benutzerdefinierter Branch-Name für den Agenten |
| `autoCreatePr` | boolean | Nein | Automatisches Erstellen eines PR, wenn der Agent fertig ist |
| `openAsCursorGithubApp` | boolean | Nein | Öffnen des PR als Cursor GitHub App |
| `skipReviewerRequest` | boolean | Nein | Überspringen der Anfrage nach Prüfern für den PR |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung mit Agenten-Details |
| `metadata` | object | Metadaten zum Startergebnis |

### `cursor_add_followup`

Fügen Sie einem bestehenden Cloud-Agenten eine Folgeanweisung hinzu.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `agentId` | string | Ja | Eindeutige Kennung für den Cloud-Agenten \(z.B. bc_abc123\) |
| `followupPromptText` | string | Ja | Der Folgeanweisungstext für den Agenten |
| `promptImages` | string | Nein | JSON-Array von Bildobjekten mit Base64-Daten und Abmessungen \(max. 5\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Ergebnis-Metadaten |

### `cursor_stop_agent`

Stoppt einen laufenden Cloud-Agenten. Dies pausiert den Agenten, ohne ihn zu löschen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `agentId` | string | Ja | Eindeutige Kennung für den Cloud-Agenten \(z.B. bc_abc123\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Ergebnis-Metadaten |

### `cursor_delete_agent`

Löscht einen Cloud-Agenten dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Cursor API-Schlüssel |
| `agentId` | string | Ja | Eindeutige Kennung für den Cloud-Agenten \(z.B. bc_abc123\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Ergebnis-Metadaten |

## Hinweise

- Kategorie: `tools`
- Typ: `cursor`
```

--------------------------------------------------------------------------------

````
