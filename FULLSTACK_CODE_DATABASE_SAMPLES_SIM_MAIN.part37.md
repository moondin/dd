---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 37
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 37 of 933)

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

---[FILE: microsoft_teams.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/microsoft_teams.mdx

```text
---
title: Microsoft Teams
description: Nachrichten, Reaktionen und Mitglieder in Teams verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_teams"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://teams.microsoft.com) ist eine leistungsstarke Kommunikations- und Kollaborationsplattform, die es Nutzern ermöglicht, in Echtzeit Nachrichten auszutauschen, an Meetings teilzunehmen und Inhalte innerhalb von Teams und Organisationen zu teilen. Als Teil des Microsoft-Produktivitätsökosystems bietet Microsoft Teams nahtlose Chat-Funktionalität mit Office 365-Integration, sodass Nutzer Nachrichten senden, Arbeit koordinieren und über verschiedene Geräte und Arbeitsabläufe hinweg verbunden bleiben können.

Mit Microsoft Teams können Sie:

- **Nachrichten senden und empfangen**: Sofortige Kommunikation mit Einzelpersonen oder Gruppen in Chat-Threads  
- **In Echtzeit zusammenarbeiten**: Updates und Informationen in Teams über Kanäle und Chats teilen  
- **Gespräche organisieren**: Kontext durch strukturierte Diskussionen und dauerhafte Chat-Verläufe bewahren  
- **Dateien und Inhalte teilen**: Dokumente, Bilder und Links direkt im Chat anhängen und anzeigen  
- **Mit Microsoft 365 integrieren**: Nahtlose Verbindung mit Outlook, SharePoint, OneDrive und mehr  
- **Geräteübergreifender Zugriff**: Teams auf Desktop, Web und Mobilgeräten mit Cloud-synchronisierten Gesprächen nutzen  
- **Sichere Kommunikation**: Unternehmensklasse-Sicherheits- und Compliance-Funktionen nutzen

In Sim ermöglicht die Microsoft Teams-Integration Ihren Agenten, direkt programmatisch mit Chat-Nachrichten zu interagieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie das Senden von Updates, Veröffentlichen von Warnungen, Koordinieren von Aufgaben und Reagieren auf Gespräche in Echtzeit. Ihre Agenten können neue Nachrichten an Chats oder Kanäle schreiben, Inhalte basierend auf Workflow-Daten aktualisieren und mit Benutzern dort interagieren, wo Zusammenarbeit stattfindet. Durch die Integration von Sim mit Microsoft Teams überbrücken Sie die Lücke zwischen intelligenten Workflows und Teamkommunikation — und befähigen Ihre Agenten, die Zusammenarbeit zu optimieren, Kommunikationsaufgaben zu automatisieren und Ihre Teams aufeinander abzustimmen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Microsoft Teams in den Workflow integrieren. Chat- und Kanalnachrichten lesen, schreiben, aktualisieren und löschen. Auf Nachrichten antworten, Reaktionen hinzufügen und Team-/Kanalmitglieder auflisten. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn eine Nachricht an einen Chat oder Kanal gesendet wird. Um Benutzer in Nachrichten zu erwähnen, umschließen Sie ihren Namen mit `<at>` Tags: `<at>userName</at>`

## Tools

### `microsoft_teams_read_chat`

Inhalte aus einem Microsoft Teams-Chat lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Ja | Die ID des Chats, aus dem gelesen werden soll |
| `includeAttachments` | boolean | Nein | Nachrichtenanhänge \(gehostete Inhalte\) herunterladen und in den Speicher aufnehmen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus des Teams-Chat-Lesevorgangs |
| `messageCount` | number | Anzahl der aus dem Chat abgerufenen Nachrichten |
| `chatId` | string | ID des Chats, aus dem gelesen wurde |
| `messages` | array | Array von Chat-Nachrichtenobjekten |
| `attachmentCount` | number | Gesamtanzahl der gefundenen Anhänge |
| `attachmentTypes` | array | Arten der gefundenen Anhänge |
| `content` | string | Formatierter Inhalt der Chat-Nachrichten |
| `attachments` | file[] | Hochgeladene Anhänge zur Vereinfachung \(abgeflacht\) |

### `microsoft_teams_write_chat`

Inhalte in einem Microsoft Teams-Chat schreiben oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Ja | Die ID des Chats, in den geschrieben werden soll |
| `content` | string | Ja | Der Inhalt, der in die Nachricht geschrieben werden soll |
| `files` | file[] | Nein | Dateien, die der Nachricht angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus des Sendens der Teams-Chatnachricht |
| `messageId` | string | Eindeutige Kennung für die gesendete Nachricht |
| `chatId` | string | ID des Chats, in dem die Nachricht gesendet wurde |
| `createdTime` | string | Zeitstempel der Nachrichtenerstellung |
| `url` | string | Web-URL zur Nachricht |
| `updatedContent` | boolean | Ob der Inhalt erfolgreich aktualisiert wurde |

### `microsoft_teams_read_channel`

Inhalte aus einem Microsoft Teams-Kanal lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams, aus dem gelesen werden soll |
| `channelId` | string | Ja | Die ID des Kanals, aus dem gelesen werden soll |
| `includeAttachments` | boolean | Nein | Nachrichtenanhänge \(gehostete Inhalte\) herunterladen und in den Speicher aufnehmen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus des Teams-Kanal-Lesevorgangs |
| `messageCount` | number | Anzahl der aus dem Kanal abgerufenen Nachrichten |
| `teamId` | string | ID des Teams, aus dem gelesen wurde |
| `channelId` | string | ID des Kanals, aus dem gelesen wurde |
| `messages` | array | Array von Kanal-Nachrichtenobjekten |
| `attachmentCount` | number | Gesamtanzahl der gefundenen Anhänge |
| `attachmentTypes` | array | Arten der gefundenen Anhänge |
| `content` | string | Formatierter Inhalt der Kanal-Nachrichten |
| `attachments` | file[] | Hochgeladene Anhänge zur Vereinfachung \(abgeflacht\) |

### `microsoft_teams_write_channel`

Schreiben oder senden einer Nachricht an einen Microsoft Teams-Kanal

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams, in das geschrieben werden soll |
| `channelId` | string | Ja | Die ID des Kanals, in den geschrieben werden soll |
| `content` | string | Ja | Der Inhalt, der in den Kanal geschrieben werden soll |
| `files` | file[] | Nein | Dateien, die der Nachricht angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des erfolgreichen Sendens der Teams-Kanalnachricht |
| `messageId` | string | Eindeutige Kennung für die gesendete Nachricht |
| `teamId` | string | ID des Teams, in dem die Nachricht gesendet wurde |
| `channelId` | string | ID des Kanals, in dem die Nachricht gesendet wurde |
| `createdTime` | string | Zeitstempel der Nachrichtenerstellung |
| `url` | string | Web-URL zur Nachricht |
| `updatedContent` | boolean | Ob der Inhalt erfolgreich aktualisiert wurde |

### `microsoft_teams_update_chat_message`

Eine bestehende Nachricht in einem Microsoft Teams-Chat aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Ja | Die ID des Chats, der die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu aktualisierenden Nachricht |
| `content` | string | Ja | Der neue Inhalt für die Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Aktualisierung erfolgreich war |
| `messageId` | string | ID der aktualisierten Nachricht |
| `updatedContent` | boolean | Ob der Inhalt erfolgreich aktualisiert wurde |

### `microsoft_teams_update_channel_message`

Eine bestehende Nachricht in einem Microsoft Teams-Kanal aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams |
| `channelId` | string | Ja | Die ID des Kanals, der die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu aktualisierenden Nachricht |
| `content` | string | Ja | Der neue Inhalt für die Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Aktualisierung erfolgreich war |
| `messageId` | string | ID der aktualisierten Nachricht |
| `updatedContent` | boolean | Ob der Inhalt erfolgreich aktualisiert wurde |

### `microsoft_teams_delete_chat_message`

Soft-Delete einer Nachricht in einem Microsoft Teams-Chat

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Ja | Die ID des Chats, der die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu löschenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Löschen erfolgreich war |
| `deleted` | boolean | Bestätigung des Löschvorgangs |
| `messageId` | string | ID der gelöschten Nachricht |

### `microsoft_teams_delete_channel_message`

Soft-Delete einer Nachricht in einem Microsoft Teams-Kanal

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams |
| `channelId` | string | Ja | Die ID des Kanals, der die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu löschenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Löschen erfolgreich war |
| `deleted` | boolean | Bestätigung des Löschvorgangs |
| `messageId` | string | ID der gelöschten Nachricht |

### `microsoft_teams_reply_to_message`

Auf eine bestehende Nachricht in einem Microsoft Teams-Kanal antworten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams |
| `channelId` | string | Ja | Die ID des Kanals |
| `messageId` | string | Ja | Die ID der Nachricht, auf die geantwortet werden soll |
| `content` | string | Ja | Der Antwortinhalt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Antwort erfolgreich war |
| `messageId` | string | ID der Antwortnachricht |
| `updatedContent` | boolean | Ob der Inhalt erfolgreich gesendet wurde |

### `microsoft_teams_get_message`

Eine bestimmte Nachricht aus einem Microsoft Teams-Chat oder -Kanal abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Nein | Die ID des Teams \(für Kanalnachrichten\) |
| `channelId` | string | Nein | Die ID des Kanals \(für Kanalnachrichten\) |
| `chatId` | string | Nein | Die ID des Chats \(für Chatnachrichten\) |
| `messageId` | string | Ja | Die ID der abzurufenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Abruf erfolgreich war |
| `content` | string | Der Nachrichteninhalt |
| `metadata` | object | Nachrichtenmetadaten einschließlich Absender, Zeitstempel usw. |

### `microsoft_teams_set_reaction`

Eine Emoji-Reaktion zu einer Nachricht in Microsoft Teams hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Nein | Die ID des Teams (für Kanalnachrichten) |
| `channelId` | string | Nein | Die ID des Kanals (für Kanalnachrichten) |
| `chatId` | string | Nein | Die ID des Chats (für Chatnachrichten) |
| `messageId` | string | Ja | Die ID der Nachricht, auf die reagiert werden soll |
| `reactionType` | string | Ja | Die Emoji-Reaktion (z.B. ❤️, 👍, 😊) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Reaktion erfolgreich hinzugefügt wurde |
| `reactionType` | string | Das Emoji, das hinzugefügt wurde |
| `messageId` | string | ID der Nachricht |

### `microsoft_teams_unset_reaction`

Eine Emoji-Reaktion von einer Nachricht in Microsoft Teams entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Nein | Die ID des Teams (für Kanalnachrichten) |
| `channelId` | string | Nein | Die ID des Kanals (für Kanalnachrichten) |
| `chatId` | string | Nein | Die ID des Chats (für Chatnachrichten) |
| `messageId` | string | Ja | Die ID der Nachricht |
| `reactionType` | string | Ja | Die zu entfernende Emoji-Reaktion (z.B. ❤️, 👍, 😊) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Reaktion erfolgreich entfernt wurde |
| `reactionType` | string | Das Emoji, das entfernt wurde |
| `messageId` | string | ID der Nachricht |

### `microsoft_teams_list_team_members`

Alle Mitglieder eines Microsoft Teams-Teams auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Auflistung erfolgreich war |
| `members` | array | Array der Teammitglieder |
| `memberCount` | number | Gesamtzahl der Mitglieder |

### `microsoft_teams_list_channel_members`

Alle Mitglieder eines Microsoft Teams-Kanals auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Ja | Die ID des Teams |
| `channelId` | string | Ja | Die ID des Kanals |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Auflistung erfolgreich war |
| `members` | array | Array der Kanalmitglieder |
| `memberCount` | number | Gesamtzahl der Mitglieder |

## Hinweise

- Kategorie: `tools`
- Typ: `microsoft_teams`
```

--------------------------------------------------------------------------------

---[FILE: mistral_parse.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/mistral_parse.mdx

```text
---
title: Mistral Parser
description: Text aus PDF-Dokumenten extrahieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mistral_parse"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
Das Mistral Parse-Tool bietet eine leistungsstarke Möglichkeit, Inhalte aus PDF-Dokumenten mit der [Mistral OCR API](https://mistral.ai/) zu extrahieren und zu verarbeiten. Dieses Tool nutzt fortschrittliche optische Zeichenerkennung, um Text und Struktur aus PDF-Dateien präzise zu extrahieren und macht es einfach, Dokumentendaten in Ihre Agent-Workflows zu integrieren.

Mit dem Mistral Parse-Tool können Sie:

- **Text aus PDFs extrahieren**: PDF-Inhalte präzise in Text-, Markdown- oder JSON-Formate konvertieren
- **PDFs von URLs verarbeiten**: Inhalte direkt aus online gehosteten PDFs extrahieren, indem Sie deren URLs angeben
- **Dokumentstruktur beibehalten**: Formatierung, Tabellen und Layout aus den Original-PDFs bewahren
- **Bilder extrahieren**: Optional eingebettete Bilder aus den PDFs einbeziehen
- **Bestimmte Seiten auswählen**: Nur die Seiten verarbeiten, die Sie aus mehrseitigen Dokumenten benötigen

Das Mistral Parse-Tool ist besonders nützlich für Szenarien, in denen Ihre Agenten mit PDF-Inhalten arbeiten müssen, wie zum Beispiel bei der Analyse von Berichten, der Extraktion von Daten aus Formularen oder der Verarbeitung von Text aus gescannten Dokumenten. Es vereinfacht den Prozess, PDF-Inhalte für Ihre Agenten verfügbar zu machen und ermöglicht ihnen, mit Informationen aus PDFs genauso einfach zu arbeiten wie mit direkter Texteingabe.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Mistral Parse in den Workflow. Kann Text aus hochgeladenen PDF-Dokumenten oder von einer URL extrahieren. Erfordert API-Schlüssel.

## Tools

### `mistral_parser`

PDF-Dokumente mit der Mistral OCR API analysieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `filePath` | string | Ja | URL zu einem zu verarbeitenden PDF-Dokument |
| `fileUpload` | object | Nein | Datei-Upload-Daten von der Datei-Upload-Komponente |
| `resultType` | string | Nein | Art des geparsten Ergebnisses \(markdown, text oder json\). Standardmäßig markdown. |
| `includeImageBase64` | boolean | Nein | Base64-kodierte Bilder in die Antwort einschließen |
| `pages` | array | Nein | Bestimmte zu verarbeitende Seiten \(Array von Seitenzahlen, beginnend bei 0\) |
| `imageLimit` | number | Nein | Maximale Anzahl der aus dem PDF zu extrahierenden Bilder |
| `imageMinSize` | number | Nein | Minimale Höhe und Breite der aus dem PDF zu extrahierenden Bilder |
| `apiKey` | string | Ja | Mistral API-Schlüssel \(MISTRAL_API_KEY\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das PDF erfolgreich geparst wurde |
| `content` | string | Extrahierter Inhalt im angeforderten Format \(markdown, text oder JSON\) |
| `metadata` | object | Verarbeitungsmetadaten einschließlich jobId, fileType, pageCount und Nutzungsinformationen |

## Notizen

- Kategorie: `tools`
- Typ: `mistral_parse`
```

--------------------------------------------------------------------------------

---[FILE: mongodb.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/mongodb.mdx

```text
---
title: MongoDB
description: Verbindung zur MongoDB-Datenbank herstellen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mongodb"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Das [MongoDB](https://www.mongodb.com/)-Tool ermöglicht es Ihnen, eine Verbindung zu einer MongoDB-Datenbank herzustellen und eine Vielzahl von dokumentenorientierten Operationen direkt innerhalb Ihrer agentischen Workflows durchzuführen. Mit flexibler Konfiguration und sicherem Verbindungsmanagement können Sie einfach mit Ihren Daten interagieren und diese manipulieren.

Mit dem MongoDB-Tool können Sie:

- **Dokumente finden**: Sammlungen abfragen und Dokumente mit der `mongodb_query`Operation unter Verwendung umfangreicher Abfragefilter abrufen.
- **Dokumente einfügen**: Fügen Sie ein oder mehrere Dokumente zu einer Sammlung mit der `mongodb_insert`Operation hinzu.
- **Dokumente aktualisieren**: Ändern Sie bestehende Dokumente mit der `mongodb_update`Operation, indem Sie Filterkriterien und Aktualisierungsaktionen angeben.
- **Dokumente löschen**: Entfernen Sie Dokumente aus einer Sammlung mit der `mongodb_delete`Operation, indem Sie Filter und Löschoptionen angeben.
- **Daten aggregieren**: Führen Sie komplexe Aggregationspipelines mit der `mongodb_execute`Operation aus, um Ihre Daten zu transformieren und zu analysieren.

Das MongoDB-Tool ist ideal für Workflows, bei denen Ihre Agenten strukturierte, dokumentenbasierte Daten verwalten oder analysieren müssen. Ob bei der Verarbeitung von benutzergenerierten Inhalten, der Verwaltung von App-Daten oder der Unterstützung von Analysen - das MongoDB-Tool vereinfacht den Datenzugriff und die Datenmanipulation auf sichere, programmatische Weise.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie MongoDB in den Workflow. Kann Daten finden, einfügen, aktualisieren, löschen und aggregieren.

## Tools

### `mongodb_query`

Führt eine Suchoperation in einer MongoDB-Sammlung aus

#### Eingabe

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MongoDB-Server-Hostname oder IP-Adresse |
| `port` | number | Yes | MongoDB-Server-Port \(Standard: 27017\) |
| `database` | string | Yes | Datenbankname, zu dem eine Verbindung hergestellt werden soll |
| `username` | string | No | MongoDB-Benutzername |
| `password` | string | No | MongoDB-Passwort |
| `authSource` | string | No | Authentifizierungsdatenbank |
| `ssl` | string | No | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `collection` | string | Yes | Name der abzufragenden Sammlung |
| `query` | string | No | MongoDB-Abfragefilter als JSON-String |
| `limit` | number | No | Maximale Anzahl der zurückzugebenden Dokumente |
| `sort` | string | No | Sortierkriterien als JSON-String |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `documents` | array | Array der aus der Abfrage zurückgegebenen Dokumente |
| `documentCount` | number | Anzahl der zurückgegebenen Dokumente |

### `mongodb_insert`

Dokumente in MongoDB-Sammlung einfügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MongoDB-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MongoDB-Server-Port \(Standard: 27017\) |
| `database` | string | Ja | Name der Datenbank, zu der verbunden werden soll |
| `username` | string | Nein | MongoDB-Benutzername |
| `password` | string | Nein | MongoDB-Passwort |
| `authSource` | string | Nein | Authentifizierungsdatenbank |
| `ssl` | string | Nein | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `collection` | string | Ja | Name der Sammlung, in die eingefügt werden soll |
| `documents` | array | Ja | Array der einzufügenden Dokumente |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `documentCount` | number | Anzahl der eingefügten Dokumente |
| `insertedId` | string | ID des eingefügten Dokuments \(einzelnes Einfügen\) |
| `insertedIds` | array | Array der IDs der eingefügten Dokumente \(mehrfaches Einfügen\) |

### `mongodb_update`

Dokumente in MongoDB-Sammlung aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MongoDB-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MongoDB-Server-Port \(Standard: 27017\) |
| `database` | string | Ja | Name der Datenbank, zu der verbunden werden soll |
| `username` | string | Nein | MongoDB-Benutzername |
| `password` | string | Nein | MongoDB-Passwort |
| `authSource` | string | Nein | Authentifizierungsdatenbank |
| `ssl` | string | Nein | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `collection` | string | Ja | Name der zu aktualisierenden Sammlung |
| `filter` | string | Ja | Filterkriterien als JSON-String |
| `update` | string | Ja | Update-Operationen als JSON-String |
| `upsert` | boolean | Nein | Dokument erstellen, falls nicht gefunden |
| `multi` | boolean | Nein | Mehrere Dokumente aktualisieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `matchedCount` | number | Anzahl der vom Filter gefundenen Dokumente |
| `modifiedCount` | number | Anzahl der geänderten Dokumente |
| `documentCount` | number | Gesamtzahl der betroffenen Dokumente |
| `insertedId` | string | ID des eingefügten Dokuments \(bei Upsert\) |

### `mongodb_delete`

Dokumente aus MongoDB-Sammlung löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MongoDB-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MongoDB-Server-Port \(Standard: 27017\) |
| `database` | string | Ja | Name der Datenbank, zu der verbunden werden soll |
| `username` | string | Nein | MongoDB-Benutzername |
| `password` | string | Nein | MongoDB-Passwort |
| `authSource` | string | Nein | Authentifizierungsdatenbank |
| `ssl` | string | Nein | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `collection` | string | Ja | Name der Sammlung, aus der gelöscht werden soll |
| `filter` | string | Ja | Filterkriterien als JSON-String |
| `multi` | boolean | Nein | Mehrere Dokumente löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `deletedCount` | number | Anzahl der gelöschten Dokumente |
| `documentCount` | number | Gesamtanzahl der betroffenen Dokumente |

### `mongodb_execute`

MongoDB-Aggregationspipeline ausführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MongoDB-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MongoDB-Server-Port \(Standard: 27017\) |
| `database` | string | Ja | Name der Datenbank, zu der verbunden werden soll |
| `username` | string | Nein | MongoDB-Benutzername |
| `password` | string | Nein | MongoDB-Passwort |
| `authSource` | string | Nein | Authentifizierungsdatenbank |
| `ssl` | string | Nein | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `collection` | string | Ja | Name der Sammlung, auf der die Pipeline ausgeführt werden soll |
| `pipeline` | string | Ja | Aggregationspipeline als JSON-String |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `documents` | array | Array von Dokumenten, die von der Aggregation zurückgegeben wurden |
| `documentCount` | number | Anzahl der zurückgegebenen Dokumente |

## Hinweise

- Kategorie: `tools`
- Typ: `mongodb`
```

--------------------------------------------------------------------------------

---[FILE: mysql.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/mysql.mdx

```text
---
title: MySQL
description: Verbindung zur MySQL-Datenbank herstellen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mysql"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Das [MySQL](https://www.mysql.com/) Tool ermöglicht es Ihnen, eine Verbindung zu jeder MySQL-Datenbank herzustellen und eine Vielzahl von Datenbankoperationen direkt in Ihren agentischen Workflows durchzuführen. Mit sicherer Verbindungshandhabung und flexibler Konfiguration können Sie Ihre Daten einfach verwalten und mit ihnen interagieren.

Mit dem MySQL-Tool können Sie:

- **Daten abfragen**: Führen Sie SELECT-Abfragen aus, um Daten aus Ihren MySQL-Tabellen mit der `mysql_query` Operation abzurufen.
- **Datensätze einfügen**: Fügen Sie mit der `mysql_insert` Operation neue Zeilen zu Ihren Tabellen hinzu, indem Sie die Tabelle und die einzufügenden Daten angeben.
- **Datensätze aktualisieren**: Ändern Sie bestehende Daten in Ihren Tabellen mit der `mysql_update` Operation, indem Sie die Tabelle, neue Daten und WHERE-Bedingungen angeben.
- **Datensätze löschen**: Entfernen Sie Zeilen aus Ihren Tabellen mit der `mysql_delete` Operation, indem Sie die Tabelle und WHERE-Bedingungen angeben.
- **Raw SQL ausführen**: Führen Sie beliebige benutzerdefinierte SQL-Befehle mit der `mysql_execute` Operation für fortgeschrittene Anwendungsfälle aus.

Das MySQL-Tool ist ideal für Szenarien, in denen Ihre Agenten mit strukturierten Daten interagieren müssen – wie beispielsweise bei der Automatisierung von Berichten, der Synchronisierung von Daten zwischen Systemen oder der Unterstützung datengesteuerter Workflows. Es vereinfacht den Datenbankzugriff und macht es einfach, MySQL-Daten programmgesteuert zu lesen, zu schreiben und zu verwalten.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie MySQL in den Workflow. Kann Abfragen, Einfügen, Aktualisieren, Löschen und rohe SQL-Befehle ausführen.

## Tools

### `mysql_query`

SELECT-Abfrage in MySQL-Datenbank ausführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MySQL-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MySQL-Server-Port \(Standard: 3306\) |
| `database` | string | Ja | Datenbankname für die Verbindung |
| `username` | string | Ja | Datenbank-Benutzername |
| `password` | string | Ja | Datenbank-Passwort |
| `ssl` | string | Nein | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `query` | string | Ja | SQL SELECT-Abfrage zum Ausführen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der zurückgegebenen Zeilen aus der Abfrage |
| `rowCount` | number | Anzahl der zurückgegebenen Zeilen |

### `mysql_insert`

Neuen Datensatz in MySQL-Datenbank einfügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MySQL-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MySQL-Server-Port \(Standard: 3306\) |
| `database` | string | Ja | Datenbankname für die Verbindung |
| `username` | string | Ja | Datenbank-Benutzername |
| `password` | string | Ja | Datenbank-Passwort |
| `ssl` | string | Nein | SSL-Verbindungsmodus \(disabled, required, preferred\) |
| `table` | string | Ja | Tabellenname zum Einfügen |
| `data` | object | Ja | Einzufügende Daten als Schlüssel-Wert-Paare |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der eingefügten Zeilen |
| `rowCount` | number | Anzahl der eingefügten Zeilen |

### `mysql_update`

Bestehende Datensätze in MySQL-Datenbank aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MySQL-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MySQL-Server-Port (Standard: 3306) |
| `database` | string | Ja | Name der Datenbank, zu der verbunden werden soll |
| `username` | string | Ja | Datenbank-Benutzername |
| `password` | string | Ja | Datenbank-Passwort |
| `ssl` | string | Nein | SSL-Verbindungsmodus (disabled, required, preferred) |
| `table` | string | Ja | Name der zu aktualisierenden Tabelle |
| `data` | object | Ja | Zu aktualisierende Daten als Schlüssel-Wert-Paare |
| `where` | string | Ja | WHERE-Klausel-Bedingung (ohne WHERE-Schlüsselwort) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der aktualisierten Zeilen |
| `rowCount` | number | Anzahl der aktualisierten Zeilen |

### `mysql_delete`

Datensätze aus MySQL-Datenbank löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MySQL-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MySQL-Server-Port (Standard: 3306) |
| `database` | string | Ja | Name der Datenbank, zu der verbunden werden soll |
| `username` | string | Ja | Datenbank-Benutzername |
| `password` | string | Ja | Datenbank-Passwort |
| `ssl` | string | Nein | SSL-Verbindungsmodus (disabled, required, preferred) |
| `table` | string | Ja | Name der Tabelle, aus der gelöscht werden soll |
| `where` | string | Ja | WHERE-Klausel-Bedingung (ohne WHERE-Schlüsselwort) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der gelöschten Zeilen |
| `rowCount` | number | Anzahl der gelöschten Zeilen |

### `mysql_execute`

Führt eine rohe SQL-Abfrage auf einer MySQL-Datenbank aus

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | MySQL-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | MySQL-Server-Port (Standard: 3306) |
| `database` | string | Ja | Datenbankname für die Verbindung |
| `username` | string | Ja | Datenbank-Benutzername |
| `password` | string | Ja | Datenbank-Passwort |
| `ssl` | string | Nein | SSL-Verbindungsmodus (disabled, required, preferred) |
| `query` | string | Ja | Rohe SQL-Abfrage zur Ausführung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der von der Abfrage zurückgegebenen Zeilen |
| `rowCount` | number | Anzahl der betroffenen Zeilen |

## Hinweise

- Kategorie: `tools`
- Typ: `mysql`
```

--------------------------------------------------------------------------------

---[FILE: neo4j.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/neo4j.mdx

```text
---
title: Neo4j
description: Verbindung zur Neo4j-Graphdatenbank
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="neo4j"
  color="#FFFFFF"
/>

## Nutzungsanleitung

Integrieren Sie die Neo4j-Graphdatenbank in den Workflow. Kann Knoten und Beziehungen abfragen, erstellen, zusammenführen, aktualisieren und löschen.

## Tools

### `neo4j_query`

Führen Sie MATCH-Abfragen aus, um Knoten und Beziehungen aus der Neo4j-Graphdatenbank zu lesen. Für beste Leistung und zur Vermeidung großer Ergebnismengen, fügen Sie LIMIT in Ihre Abfrage ein (z.B. 

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | Neo4j-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | Neo4j-Server-Port \(Standard: 7687 für Bolt-Protokoll\) |
| `database` | string | Ja | Datenbankname für die Verbindung |
| `username` | string | Ja | Neo4j-Benutzername |
| `password` | string | Ja | Neo4j-Passwort |
| `encryption` | string | Nein | Verbindungsverschlüsselungsmodus \(enabled, disabled\) |
| `cypherQuery` | string | Ja | Auszuführende Cypher-Abfrage \(typischerweise MATCH-Anweisungen\) |
| `parameters` | object | Nein | Parameter für die Cypher-Abfrage als JSON-Objekt. Verwenden Sie diese für dynamische Werte einschließlich LIMIT \(z.B. query: "MATCH \(n\) RETURN n LIMIT $limit", parameters: \{limit: 100\}\). |
| `parameters` | string | Nein | Keine Beschreibung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `records` | array | Array von Datensätzen, die von der Abfrage zurückgegeben wurden |
| `recordCount` | number | Anzahl der zurückgegebenen Datensätze |
| `summary` | json | Zusammenfassung der Abfrageausführung mit Zeitangaben und Zählern |

### `neo4j_create`

Führe CREATE-Anweisungen aus, um neue Knoten und Beziehungen zur Neo4j-Graphdatenbank hinzuzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | Neo4j-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | Neo4j-Server-Port \(Standard: 7687 für Bolt-Protokoll\) |
| `database` | string | Ja | Datenbankname, zu dem verbunden werden soll |
| `username` | string | Ja | Neo4j-Benutzername |
| `password` | string | Ja | Neo4j-Passwort |
| `encryption` | string | Nein | Verbindungsverschlüsselungsmodus \(enabled, disabled\) |
| `cypherQuery` | string | Ja | Auszuführende Cypher CREATE-Anweisung |
| `parameters` | object | Nein | Parameter für die Cypher-Abfrage als JSON-Objekt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `summary` | json | Erstellungszusammenfassung mit Zählern für erstellte Knoten und Beziehungen |

### `neo4j_merge`

Führe MERGE-Anweisungen aus, um Knoten und Beziehungen in Neo4j zu finden oder zu erstellen (Upsert-Operation)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | Neo4j-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | Neo4j-Server-Port \(Standard: 7687 für Bolt-Protokoll\) |
| `database` | string | Ja | Datenbankname, zu dem verbunden werden soll |
| `username` | string | Ja | Neo4j-Benutzername |
| `password` | string | Ja | Neo4j-Passwort |
| `encryption` | string | Nein | Verbindungsverschlüsselungsmodus \(enabled, disabled\) |
| `cypherQuery` | string | Ja | Auszuführende Cypher MERGE-Anweisung |
| `parameters` | object | Nein | Parameter für die Cypher-Abfrage als JSON-Objekt |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `summary` | json | Zusammenfassung der Zusammenführung mit Zählern für erstellte oder zugeordnete Knoten/Beziehungen |

### `neo4j_update`

Führt SET-Anweisungen aus, um Eigenschaften vorhandener Knoten und Beziehungen in Neo4j zu aktualisieren

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j-Server-Hostname oder IP-Adresse |
| `port` | number | Yes | Neo4j-Server-Port \(Standard: 7687 für Bolt-Protokoll\) |
| `database` | string | Yes | Datenbankname, zu dem eine Verbindung hergestellt werden soll |
| `username` | string | Yes | Neo4j-Benutzername |
| `password` | string | Yes | Neo4j-Passwort |
| `encryption` | string | No | Verbindungsverschlüsselungsmodus \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher-Abfrage mit MATCH- und SET-Anweisungen zum Aktualisieren von Eigenschaften |
| `parameters` | object | No | Parameter für die Cypher-Abfrage als JSON-Objekt |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `summary` | json | Aktualisierungszusammenfassung mit Zählern für gesetzte Eigenschaften |

### `neo4j_delete`

Führt DELETE- oder DETACH DELETE-Anweisungen aus, um Knoten und Beziehungen aus Neo4j zu entfernen

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j-Server-Hostname oder IP-Adresse |
| `port` | number | Yes | Neo4j-Server-Port \(Standard: 7687 für Bolt-Protokoll\) |
| `database` | string | Yes | Datenbankname, zu dem eine Verbindung hergestellt werden soll |
| `username` | string | Yes | Neo4j-Benutzername |
| `password` | string | Yes | Neo4j-Passwort |
| `encryption` | string | No | Verbindungsverschlüsselungsmodus \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher-Abfrage mit MATCH- und DELETE/DETACH DELETE-Anweisungen |
| `parameters` | object | No | Parameter für die Cypher-Abfrage als JSON-Objekt |
| `detach` | boolean | No | Ob DETACH DELETE verwendet werden soll, um Beziehungen zu entfernen, bevor Knoten gelöscht werden |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `summary` | json | Löschzusammenfassung mit Zählern für gelöschte Knoten und Beziehungen |

### `neo4j_execute`

Führt beliebige Cypher-Abfragen auf der Neo4j-Graphdatenbank für komplexe Operationen aus

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | Neo4j-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | Neo4j-Server-Port (Standard: 7687 für Bolt-Protokoll) |
| `database` | string | Ja | Datenbankname für die Verbindung |
| `username` | string | Ja | Neo4j-Benutzername |
| `password` | string | Ja | Neo4j-Passwort |
| `encryption` | string | Nein | Verbindungsverschlüsselungsmodus (enabled, disabled) |
| `cypherQuery` | string | Ja | Auszuführende Cypher-Abfrage (jede gültige Cypher-Anweisung) |
| `parameters` | object | Nein | Parameter für die Cypher-Abfrage als JSON-Objekt |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `records` | array | Array von Datensätzen, die von der Abfrage zurückgegeben wurden |
| `recordCount` | number | Anzahl der zurückgegebenen Datensätze |
| `summary` | json | Ausführungszusammenfassung mit Zeiterfassung und Zählern |

## Hinweise

- Kategorie: `tools`
- Typ: `neo4j`
```

--------------------------------------------------------------------------------

````
