---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 38
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 38 of 933)

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

---[FILE: notion.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/notion.mdx

```text
---
title: Notion
description: Notion-Seiten verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="notion"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Notion](https://www.notion.so) ist ein All-in-One-Arbeitsbereich, der Notizen, Dokumente, Wikis und Projektmanagement-Tools auf einer einzigen Plattform vereint. Es bietet eine flexible und anpassbare Umgebung, in der Benutzer Inhalte in verschiedenen Formaten erstellen, organisieren und gemeinsam daran arbeiten können.

Mit Notion können Sie:

- **Vielseitige Inhalte erstellen**: Dokumente, Wikis, Datenbanken, Kanban-Boards, Kalender und mehr erstellen
- **Informationen organisieren**: Inhalte hierarchisch mit verschachtelten Seiten und leistungsstarken Datenbanken strukturieren
- **Nahtlos zusammenarbeiten**: Arbeitsbereiche und Seiten mit Teammitgliedern für Echtzeit-Zusammenarbeit teilen
- **Ihren Arbeitsbereich anpassen**: Gestalten Sie Ihren idealen Arbeitsablauf mit flexiblen Vorlagen und Bausteinen
- **Informationen verknüpfen**: Verlinken Sie Seiten und Datenbanken, um ein Wissensnetzwerk zu erstellen
- **Überall zugreifen**: Nutzen Sie Notion über Web-, Desktop- und mobile Plattformen mit automatischer Synchronisierung

In Sim ermöglicht die Notion-Integration Ihren Agenten, direkt programmatisch mit Ihrem Notion-Arbeitsbereich zu interagieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie Wissensmanagement, Inhaltserstellung und Informationsabruf. Ihre Agenten können:

- **Notion-Seiten lesen**: Inhalte und Metadaten von jeder Notion-Seite extrahieren.
- **Notion-Datenbanken lesen**: Datenbankstruktur und -informationen abrufen.
- **In Seiten schreiben**: Neue Inhalte zu bestehenden Notion-Seiten hinzufügen.
- **Neue Seiten erstellen**: Neue Notion-Seiten unter einer übergeordneten Seite mit benutzerdefinierten Titeln und Inhalten generieren.
- **Datenbanken abfragen**: Datenbankeinträge mit erweiterten Filter- und Sortierkriterien suchen und filtern.
- **Arbeitsbereich durchsuchen**: Den gesamten Notion-Arbeitsbereich nach Seiten oder Datenbanken durchsuchen, die bestimmten Abfragen entsprechen.
- **Neue Datenbanken erstellen**: Programmatisch neue Datenbanken mit benutzerdefinierten Eigenschaften und Struktur erstellen.

Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Ihrer Wissensbasis und ermöglicht ein nahtloses Dokumenten- und Informationsmanagement. Durch die Verbindung von Sim mit Notion können Sie Dokumentationsprozesse automatisieren, aktuelle Informationsrepositorien pflegen, Berichte generieren und Informationen intelligent organisieren – alles durch Ihre intelligenten Agenten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integration mit Notion in den Arbeitsablauf. Kann Seiten lesen, Datenbanken lesen, Seiten erstellen, Datenbanken erstellen, Inhalte anhängen, Datenbanken abfragen und Workspace durchsuchen. Erfordert OAuth.

## Tools

### `notion_read`

Inhalte von einer Notion-Seite lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | Ja | Die ID der zu lesenden Notion-Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Seiteninhalt im Markdown-Format mit Überschriften, Absätzen, Listen und Aufgaben |
| `metadata` | object | Seiten-Metadaten einschließlich Titel, URL und Zeitstempeln |

### `notion_read_database`

Datenbankinformationen und -struktur aus Notion lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | Ja | Die ID der zu lesenden Notion-Datenbank |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Datenbankinformationen einschließlich Titel, Eigenschaften-Schema und Metadaten |
| `metadata` | object | Datenbank-Metadaten einschließlich Titel, ID, URL, Zeitstempeln und Eigenschaften-Schema |

### `notion_write`

Inhalte zu einer Notion-Seite hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | Ja | Die ID der Notion-Seite, zu der Inhalte hinzugefügt werden sollen |
| `content` | string | Ja | Der Inhalt, der zur Seite hinzugefügt werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung, die bestätigt, dass der Inhalt zur Seite hinzugefügt wurde |

### `notion_create_page`

Eine neue Seite in Notion erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | Ja | ID der übergeordneten Seite |
| `title` | string | Nein | Titel der neuen Seite |
| `content` | string | Nein | Optionaler Inhalt, der bei der Erstellung zur Seite hinzugefügt wird |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung, die die Seitenerstellung bestätigt |
| `metadata` | object | Seiten-Metadaten einschließlich Titel, Seiten-ID, URL und Zeitstempel |

### `notion_query_database`

Notion-Datenbankeinträge mit erweiterter Filterung abfragen und filtern

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | Ja | Die ID der abzufragenden Datenbank |
| `filter` | string | Nein | Filterbedingungen als JSON \(optional\) |
| `sorts` | string | Nein | Sortierkriterien als JSON-Array \(optional\) |
| `pageSize` | number | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 100\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Formatierte Liste von Datenbankeinträgen mit ihren Eigenschaften |
| `metadata` | object | Abfrage-Metadaten einschließlich Gesamtergebnisanzahl, Paginierungsinformationen und Array mit Rohergebnissen |

### `notion_search`

Durchsuche alle Seiten und Datenbanken im Notion-Workspace

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Nein | Suchbegriffe \(leer lassen, um alle Seiten zu erhalten\) |
| `filterType` | string | Nein | Nach Objekttyp filtern: page, database oder leer lassen für alle |
| `pageSize` | number | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 100\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Formatierte Liste der Suchergebnisse mit Seiten und Datenbanken |
| `metadata` | object | Suchdaten einschließlich Gesamtanzahl der Ergebnisse, Paginierungsinformationen und Array der Rohergebnisse |

### `notion_create_database`

Erstelle eine neue Datenbank in Notion mit benutzerdefinierten Eigenschaften

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | Ja | ID der übergeordneten Seite, auf der die Datenbank erstellt wird |
| `title` | string | Ja | Titel für die neue Datenbank |
| `properties` | string | Nein | Datenbankeigenschaften als JSON-Objekt \(optional, erstellt eine Standard-"Name"-Eigenschaft, wenn leer\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung mit Datenbankdetails und Eigenschaftsliste |
| `metadata` | object | Datenbankmetadaten einschließlich ID, Titel, URL, Erstellungszeit und Eigenschaftsschema |

## Notizen

- Kategorie: `tools`
- Typ: `notion`
```

--------------------------------------------------------------------------------

---[FILE: onedrive.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/onedrive.mdx

```text
---
title: OneDrive
description: Dateien erstellen, hochladen, herunterladen, auflisten und löschen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="onedrive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[OneDrive](https://onedrive.live.com) ist Microsofts Cloud-Speicher- und Dateisynchronisierungsdienst, der es Benutzern ermöglicht, Dateien sicher zu speichern, darauf zuzugreifen und sie geräteübergreifend zu teilen. OneDrive ist tief in das Microsoft 365-Ökosystem integriert und unterstützt nahtlose Zusammenarbeit, Versionskontrolle und Echtzeitzugriff auf Inhalte für Teams und Organisationen.

Erfahren Sie, wie Sie das OneDrive-Tool in Sim integrieren, um Ihre Cloud-Dateien automatisch abzurufen, zu verwalten und in Ihren Workflows zu organisieren. Dieses Tutorial führt Sie durch die Verbindung mit OneDrive, die Einrichtung des Dateizugriffs und die Verwendung gespeicherter Inhalte zur Automatisierung. Ideal für die Synchronisierung wichtiger Dokumente und Medien mit Ihren Agenten in Echtzeit.

Mit OneDrive können Sie:

- **Dateien sicher in der Cloud speichern**: Dokumente, Bilder und andere Dateien von jedem Gerät aus hochladen und darauf zugreifen
- **Ihre Inhalte organisieren**: Strukturierte Ordner erstellen und Dateiversionen mühelos verwalten
- **In Echtzeit zusammenarbeiten**: Dateien teilen, gleichzeitig mit anderen bearbeiten und Änderungen verfolgen
- **Geräteübergreifender Zugriff**: OneDrive von Desktop-, Mobil- und Webplattformen aus nutzen
- **Integration mit Microsoft 365**: Nahtlos mit Word, Excel, PowerPoint und Teams arbeiten
- **Berechtigungen kontrollieren**: Dateien und Ordner mit benutzerdefinierten Zugriffseinstellungen und Ablaufkontrollen teilen

In Sim ermöglicht die OneDrive-Integration Ihren Agenten die direkte Interaktion mit Ihrem Cloud-Speicher. Agenten können neue Dateien in bestimmte Ordner hochladen, bestehende Dateien abrufen und lesen sowie Ordnerinhalte auflisten, um Informationen dynamisch zu organisieren und darauf zuzugreifen. Diese Integration ermöglicht es Ihren Agenten, Dateioperationen in intelligente Workflows einzubinden – Automatisierung der Dokumentenaufnahme, Inhaltsanalyse und strukturiertes Speichermanagement. Durch die Verbindung von Sim mit OneDrive befähigen Sie Ihre Agenten, Cloud-Dokumente programmatisch zu verwalten und zu nutzen, wodurch manuelle Schritte entfallen und die Automatisierung durch sicheren Echtzeit-Dateizugriff verbessert wird.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriert OneDrive in den Workflow. Kann Text- und Excel-Dateien erstellen, Dateien hochladen, Dateien herunterladen, Dateien auflisten und Dateien oder Ordner löschen.

## Tools

### `onedrive_upload`

Eine Datei auf OneDrive hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Ja | Der Name der hochzuladenden Datei |
| `file` | file | Nein | Die hochzuladende Datei \(binär\) |
| `content` | string | Nein | Der hochzuladende Textinhalt \(falls keine Datei bereitgestellt wird\) |
| `mimeType` | string | Nein | Der MIME-Typ der zu erstellenden Datei \(z.B. text/plain für .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet für .xlsx\) |
| `folderSelector` | string | Nein | Ordner auswählen, in den die Datei hochgeladen werden soll |
| `manualFolderId` | string | Nein | Manuell eingegebene Ordner-ID \(erweiterter Modus\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Datei erfolgreich hochgeladen wurde |
| `file` | object | Das hochgeladene Dateiobjekt mit Metadaten einschließlich ID, Name, webViewLink, webContentLink und Zeitstempeln |

### `onedrive_create_folder`

Einen neuen Ordner in OneDrive erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `folderName` | string | Ja | Name des zu erstellenden Ordners |
| `folderSelector` | string | Nein | Wählen Sie den übergeordneten Ordner aus, in dem der Ordner erstellt werden soll |
| `manualFolderId` | string | Nein | Manuell eingegebene übergeordnete Ordner-ID \(erweiterter Modus\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Ordner erfolgreich erstellt wurde |
| `file` | object | Das erstellte Ordnerobjekt mit Metadaten einschließlich ID, Name, webViewLink und Zeitstempeln |

### `onedrive_download`

Eine Datei von OneDrive herunterladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Ja | Die ID der herunterzuladenden Datei |
| `fileName` | string | Nein | Optionale Überschreibung des Dateinamens |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | file | Heruntergeladene Datei, gespeichert in Ausführungsdateien |

### `onedrive_list`

Dateien und Ordner in OneDrive auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | Nein | Ordner auswählen, aus dem Dateien aufgelistet werden sollen |
| `manualFolderId` | string | Nein | Die manuell eingegebene Ordner-ID (erweiterter Modus) |
| `query` | string | Nein | Eine Abfrage zum Filtern der Dateien |
| `pageSize` | number | Nein | Die Anzahl der zurückzugebenden Dateien |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob Dateien erfolgreich aufgelistet wurden |
| `files` | array | Array von Datei- und Ordnerobjekten mit Metadaten |
| `nextPageToken` | string | Token zum Abrufen der nächsten Ergebnisseite (optional) |

### `onedrive_delete`

Eine Datei oder einen Ordner von OneDrive löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Ja | Die ID der zu löschenden Datei oder des zu löschenden Ordners |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Datei erfolgreich gelöscht wurde |
| `deleted` | boolean | Bestätigung, dass die Datei gelöscht wurde |
| `fileId` | string | Die ID der gelöschten Datei |

## Hinweise

- Kategorie: `tools`
- Typ: `onedrive`
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/openai.mdx

```text
---
title: Embeddings
description: Open AI Embeddings generieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="openai"
  color="#10a37f"
/>

{/* MANUAL-CONTENT-START:intro */}
[OpenAI](https://www.openai.com) ist ein führendes Unternehmen für KI-Forschung und -Implementierung, das eine Reihe leistungsstarker KI-Modelle und APIs anbietet. OpenAI bietet modernste Technologien, darunter große Sprachmodelle (wie GPT-4), Bildgenerierung (DALL-E) und Embeddings, die es Entwicklern ermöglichen, anspruchsvolle KI-gestützte Anwendungen zu erstellen.

Mit OpenAI können Sie:

- **Text generieren**: Menschenähnlichen Text für verschiedene Anwendungen mit GPT-Modellen erstellen
- **Bilder erstellen**: Textbeschreibungen mit DALL-E in visuelle Inhalte umwandeln
- **Embeddings erzeugen**: Text in numerische Vektoren für semantische Suche und Analyse umwandeln
- **KI-Assistenten entwickeln**: Konversationsagenten mit spezialisiertem Wissen erstellen
- **Daten verarbeiten und analysieren**: Erkenntnisse und Muster aus unstrukturiertem Text extrahieren
- **Sprachen übersetzen**: Inhalte mit hoher Genauigkeit zwischen verschiedenen Sprachen konvertieren
- **Inhalte zusammenfassen**: Lange Texte verdichten und dabei wichtige Informationen bewahren

In Sim ermöglicht die OpenAI-Integration Ihren Agenten, diese leistungsstarken KI-Fähigkeiten programmatisch als Teil ihrer Workflows zu nutzen. Dies erlaubt anspruchsvolle Automatisierungsszenarien, die natürliches Sprachverständnis, Inhaltsgenerierung und semantische Analyse kombinieren. Ihre Agenten können Vektoreinbettungen aus Text generieren, die als numerische Darstellungen semantische Bedeutungen erfassen und fortschrittliche Such-, Klassifizierungs- und Empfehlungssysteme ermöglichen. Zusätzlich können Agenten durch die DALL-E-Integration Bilder aus Textbeschreibungen erstellen, was Möglichkeiten für die Generierung visueller Inhalte eröffnet. Diese Integration überbrückt die Lücke zwischen Ihrer Workflow-Automatisierung und modernsten KI-Fähigkeiten und ermöglicht Ihren Agenten, Kontext zu verstehen, relevante Inhalte zu generieren und intelligente Entscheidungen auf Basis semantischen Verständnisses zu treffen. Durch die Verbindung von Sim mit OpenAI können Sie Agenten erstellen, die Informationen intelligenter verarbeiten, kreative Inhalte generieren und personalisierte Erfahrungen für Benutzer liefern.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Embeddings in den Workflow integrieren. Kann Embeddings aus Text generieren. Erfordert API-Schlüssel.

## Tools

### `openai_embeddings`

Embeddings aus Text mit OpenAI generieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `input` | string | Ja | Text, für den Embeddings generiert werden sollen |
| `model` | string | Nein | Modell, das für Embeddings verwendet werden soll |
| `encodingFormat` | string | Nein | Das Format, in dem die Embeddings zurückgegeben werden sollen |
| `apiKey` | string | Ja | OpenAI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Ergebnisse der Embedding-Generierung |

## Hinweise

- Kategorie: `tools`
- Typ: `openai`
```

--------------------------------------------------------------------------------

---[FILE: outlook.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/outlook.mdx

```text
---
title: Outlook
description: Outlook-E-Mail-Nachrichten senden, lesen, entwerfen, weiterleiten
  und verschieben
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="outlook"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Outlook](https://outlook.office365.com) ist eine umfassende E-Mail- und Kalenderplattform, die Benutzern hilft, Kommunikation, Termine und Aufgaben effizient zu verwalten. Als Teil der Microsoft-Produktivitätssuite bietet Outlook robuste Tools zum Senden und Organisieren von E-Mails, Koordinieren von Meetings und nahtloser Integration mit Microsoft 365-Anwendungen — so können Einzelpersonen und Teams über verschiedene Geräte hinweg organisiert und vernetzt bleiben.

Mit Microsoft Outlook können Sie:

- **E-Mails senden und empfangen**: Kommunizieren Sie klar und professionell mit Einzelpersonen oder Verteilerlisten  
- **Kalender und Termine verwalten**: Planen Sie Meetings, setzen Sie Erinnerungen und sehen Sie Verfügbarkeiten  
- **Ihren Posteingang organisieren**: Nutzen Sie Ordner, Kategorien und Regeln, um Ihre E-Mails zu strukturieren  
- **Auf Kontakte und Aufgaben zugreifen**: Behalten Sie wichtige Personen und Aktionspunkte an einem Ort im Blick  
- **Mit Microsoft 365 integrieren**: Arbeiten Sie nahtlos mit Word, Excel, Teams und anderen Microsoft-Apps  
- **Geräteübergreifender Zugriff**: Nutzen Sie Outlook auf Desktop, Web und Mobilgeräten mit Echtzeit-Synchronisation  
- **Datenschutz und Sicherheit gewährleisten**: Nutzen Sie Verschlüsselung und Compliance-Kontrollen auf Unternehmensebene

In Sim ermöglicht die Microsoft Outlook-Integration Ihren Agenten, direkt und programmgesteuert mit E-Mail- und Kalenderdaten zu interagieren, mit vollständigen E-Mail-Verwaltungsfunktionen. Dies ermöglicht leistungsstarke Automatisierungsszenarien für Ihren gesamten E-Mail-Workflow. Ihre Agenten können:

- **Senden und entwerfen**: Professionelle E-Mails mit Anhängen verfassen und Entwürfe für später speichern
- **Lesen und weiterleiten**: Auf Posteingang-Nachrichten zugreifen und wichtige Mitteilungen an Teammitglieder weiterleiten
- **Effizient organisieren**: E-Mails als gelesen oder ungelesen markieren, Nachrichten zwischen Ordnern verschieben und E-Mails zur Referenz kopieren
- **Posteingang aufräumen**: Unerwünschte Nachrichten löschen und organisierte Ordnerstrukturen pflegen
- **Workflows auslösen**: In Echtzeit auf neue E-Mails reagieren und reaktionsschnelle Automatisierung basierend auf eingehenden Nachrichten ermöglichen

Durch die Verbindung von Sim mit Microsoft Outlook ermöglichen Sie intelligenten Agenten, Kommunikation zu automatisieren, Terminplanung zu optimieren, Überblick über die Organisationskorrespondenz zu behalten und Posteingänge zu organisieren – alles innerhalb Ihres Workflow-Ökosystems. Ob Sie Kundenkommunikation verwalten, Rechnungen bearbeiten, Team-Updates koordinieren oder Nachfassaktionen automatisieren – die Outlook-Integration bietet E-Mail-Automatisierungsfunktionen auf Unternehmensniveau.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Outlook in den Workflow. Kann E-Mail-Nachrichten lesen, entwerfen, senden, weiterleiten und verschieben. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn eine neue E-Mail empfangen wird.

## Tools

### `outlook_send`

E-Mails mit Outlook senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `to` | string | Ja | E-Mail-Adresse des Empfängers |
| `subject` | string | Ja | E-Mail-Betreff |
| `body` | string | Ja | E-Mail-Inhalt |
| `contentType` | string | Nein | Inhaltstyp für den E-Mail-Text \(text oder html\) |
| `replyToMessageId` | string | Nein | Nachrichten-ID, auf die geantwortet wird \(für Threading\) |
| `conversationId` | string | Nein | Konversations-ID für Threading |
| `cc` | string | Nein | CC-Empfänger \(durch Kommas getrennt\) |
| `bcc` | string | Nein | BCC-Empfänger \(durch Kommas getrennt\) |
| `attachments` | file[] | Nein | Dateien, die an die E-Mail angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des erfolgreichen E-Mail-Versands |
| `status` | string | Zustellungsstatus der E-Mail |
| `timestamp` | string | Zeitstempel, wann die E-Mail gesendet wurde |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `outlook_draft`

E-Mails mit Outlook entwerfen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `to` | string | Ja | E-Mail-Adresse des Empfängers |
| `subject` | string | Ja | E-Mail-Betreff |
| `body` | string | Ja | E-Mail-Inhalt |
| `contentType` | string | Nein | Inhaltstyp für den E-Mail-Text \(text oder html\) |
| `cc` | string | Nein | CC-Empfänger \(durch Kommas getrennt\) |
| `bcc` | string | Nein | BCC-Empfänger \(durch Kommas getrennt\) |
| `attachments` | file[] | Nein | Dateien, die an den E-Mail-Entwurf angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status der erfolgreichen Erstellung des E-Mail-Entwurfs |
| `messageId` | string | Eindeutige Kennung für die entworfene E-Mail |
| `status` | string | Entwurfsstatus der E-Mail |
| `subject` | string | Betreff der entworfenen E-Mail |
| `timestamp` | string | Zeitstempel, wann der Entwurf erstellt wurde |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `outlook_read`

E-Mails aus Outlook lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `folder` | string | Nein | Ordner-ID, aus der E-Mails gelesen werden sollen \(Standard: Posteingang\) |
| `maxResults` | number | Nein | Maximale Anzahl der abzurufenden E-Mails \(Standard: 1, max: 10\) |
| `includeAttachments` | boolean | Nein | E-Mail-Anhänge herunterladen und einbeziehen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Statusmeldung |
| `results` | array | Array von E-Mail-Nachrichtenobjekten |
| `attachments` | file[] | Alle E-Mail-Anhänge aus allen E-Mails zusammengefasst |

### `outlook_forward`

Eine bestehende Outlook-Nachricht an bestimmte Empfänger weiterleiten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | Die ID der weiterzuleitenden Nachricht |
| `to` | string | Ja | E-Mail-Adresse(n) der Empfänger, durch Kommas getrennt |
| `comment` | string | Nein | Optionaler Kommentar, der mit der weitergeleiteten Nachricht eingefügt wird |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `results` | object | Details zum Zustellungsergebnis |

### `outlook_move`

E-Mails zwischen Outlook-Ordnern verschieben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der zu verschiebenden Nachricht |
| `destinationId` | string | Ja | ID des Zielordners |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des erfolgreichen E-Mail-Verschiebens |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `messageId` | string | ID der verschobenen Nachricht |
| `newFolderId` | string | ID des Zielordners |

### `outlook_mark_read`

Outlook-Nachricht als gelesen markieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der Nachricht, die als gelesen markiert werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `messageId` | string | ID der Nachricht |
| `isRead` | boolean | Lesestatus der Nachricht |

### `outlook_mark_unread`

Outlook-Nachricht als ungelesen markieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der Nachricht, die als ungelesen markiert werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `messageId` | string | ID der Nachricht |
| `isRead` | boolean | Lesestatus der Nachricht |

### `outlook_delete`

Outlook-Nachricht löschen (in den Ordner "Gelöschte Elemente" verschieben)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der zu löschenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `messageId` | string | ID der gelöschten Nachricht |
| `status` | string | Löschstatus |

### `outlook_copy`

Eine Outlook-Nachricht in einen anderen Ordner kopieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der zu kopierenden Nachricht |
| `destinationId` | string | Ja | ID des Zielordners |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des erfolgreichen Kopierens der E-Mail |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `originalMessageId` | string | ID der ursprünglichen Nachricht |
| `copiedMessageId` | string | ID der kopierten Nachricht |
| `destinationFolderId` | string | ID des Zielordners |

## Hinweise

- Kategorie: `tools`
- Typ: `outlook`
```

--------------------------------------------------------------------------------

---[FILE: parallel_ai.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/parallel_ai.mdx

```text
---
title: Parallel AI
description: Webrecherche mit Parallel AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="parallel_ai"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Parallel AI](https://parallel.ai/) ist eine fortschrittliche Websuche- und Inhaltsextraktionsplattform, die umfassende, hochwertige Ergebnisse für jede Anfrage liefert. Durch die Nutzung intelligenter Verarbeitung und großflächiger Datenextraktion ermöglicht Parallel AI Benutzern und Agenten den Zugriff, die Analyse und die Synthese von Informationen aus dem gesamten Web mit Geschwindigkeit und Genauigkeit.

Mit Parallel AI können Sie:

- **Intelligent im Web suchen**: Relevante, aktuelle Informationen aus einer Vielzahl von Quellen abrufen  
- **Inhalte extrahieren und zusammenfassen**: Präzise, aussagekräftige Auszüge aus Webseiten und Dokumenten erhalten  
- **Suchziele anpassen**: Anfragen auf spezifische Bedürfnisse oder Fragen für gezielte Ergebnisse zuschneiden  
- **Ergebnisse im großen Maßstab verarbeiten**: Große Mengen von Suchergebnissen mit erweiterten Verarbeitungsoptionen handhaben  
- **In Arbeitsabläufe integrieren**: Parallel AI innerhalb von Sim nutzen, um Recherche, Inhaltssammlung und Wissensextraktion zu automatisieren  
- **Ausgabedetailgrad steuern**: Die Anzahl der Ergebnisse und die Menge an Inhalt pro Ergebnis festlegen  
- **Sichere API-Zugriffe**: Ihre Suchen und Daten mit API-Schlüssel-Authentifizierung schützen

In Sim ermöglicht die Parallel AI-Integration Ihren Agenten, Websuchen durchzuführen und Inhalte programmatisch zu extrahieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie Echtzeit-Recherche, Wettbewerbsanalyse, Inhaltsüberwachung und Erstellung von Wissensdatenbanken. Durch die Verbindung von Sim mit Parallel AI erschließen Sie die Fähigkeit für Agenten, Webdaten als Teil Ihrer automatisierten Arbeitsabläufe zu sammeln, zu verarbeiten und zu nutzen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Parallel AI in den Workflow. Kann im Web suchen, Informationen aus URLs extrahieren und tiefgehende Recherchen durchführen.

## Tools

### `parallel_search`

Durchsuchen Sie das Web mit Parallel AI. Bietet umfassende Suchergebnisse mit intelligenter Verarbeitung und Inhaltsextraktion.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `objective` | string | Ja | Das Suchziel oder die zu beantwortende Frage |
| `search_queries` | string | Nein | Optionale, durch Kommas getrennte Liste von auszuführenden Suchanfragen |
| `processor` | string | Nein | Verarbeitungsmethode: base oder pro \(Standard: base\) |
| `max_results` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 5\) |
| `max_chars_per_result` | number | Nein | Maximale Zeichen pro Ergebnis \(Standard: 1500\) |
| `apiKey` | string | Ja | Parallel AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Suchergebnisse mit Auszügen aus relevanten Seiten |

### `parallel_extract`

Extrahieren Sie gezielte Informationen aus bestimmten URLs mit Parallel AI. Verarbeitet bereitgestellte URLs, um relevante Inhalte basierend auf Ihrem Ziel zu extrahieren.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Ja | Durch Kommas getrennte Liste von URLs, aus denen Informationen extrahiert werden sollen |
| `objective` | string | Ja | Welche Informationen aus den bereitgestellten URLs extrahiert werden sollen |
| `excerpts` | boolean | Ja | Relevante Auszüge aus dem Inhalt einschließen |
| `full_content` | boolean | Ja | Vollständigen Seiteninhalt einschließen |
| `apiKey` | string | Ja | Parallel AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Extrahierte Informationen aus den bereitgestellten URLs |

### `parallel_deep_research`

Führen Sie umfassende tiefgehende Recherchen im Web mit Parallel AI durch. Synthetisiert Informationen aus mehreren Quellen mit Zitaten. Kann bis zu 15 Minuten dauern.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `input` | string | Ja | Rechercheabfrage oder Frage \(bis zu 15.000 Zeichen\) |
| `processor` | string | Nein | Rechenleistungsstufe: base, lite, pro, ultra, ultra2x, ultra4x, ultra8x \(Standard: base\) |
| `include_domains` | string | Nein | Durch Kommas getrennte Liste von Domains, auf die die Recherche beschränkt werden soll \(Quellenrichtlinie\) |
| `exclude_domains` | string | Nein | Durch Kommas getrennte Liste von Domains, die von der Recherche ausgeschlossen werden sollen \(Quellenrichtlinie\) |
| `apiKey` | string | Ja | Parallel AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `status` | string | Aufgabenstatus (abgeschlossen, fehlgeschlagen) |
| `run_id` | string | Eindeutige ID für diese Rechercheaufgabe |
| `message` | string | Statusmeldung |
| `content` | object | Rechercheergebnisse (strukturiert basierend auf output_schema) |
| `basis` | array | Zitate und Quellen mit Begründung und Vertrauensstufen |

## Hinweise

- Kategorie: `tools`
- Typ: `parallel_ai`
```

--------------------------------------------------------------------------------

---[FILE: perplexity.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/perplexity.mdx

```text
---
title: Perplexity
description: Nutze Perplexity AI für Chat und Suche
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="perplexity"
  color="#20808D"
/>

{/* MANUAL-CONTENT-START:intro */}
[Perplexity AI](https://www.perplexity.ai) ist eine KI-gestützte Such- und Antwortmaschine, die die Fähigkeiten großer Sprachmodelle mit Echtzeit-Websuche kombiniert, um genaue, aktuelle Informationen und umfassende Antworten auf komplexe Fragen zu liefern.

Mit Perplexity AI kannst du:

- **Genaue antworten erhalten**: Erhalte umfassende Antworten auf Fragen mit Zitaten aus zuverlässigen Quellen
- **Auf echtzeit-informationen zugreifen**: Erhalte aktuelle Informationen durch die Websuchfunktionen von Perplexity
- **Themen tiefgehend erforschen**: Tauche tiefer in Themen ein mit Folgefragen und verwandten Informationen
- **Informationen überprüfen**: Prüfe die Glaubwürdigkeit von Antworten durch bereitgestellte Quellen und Referenzen
- **Inhalte generieren**: Erstelle Zusammenfassungen, Analysen und kreative Inhalte basierend auf aktuellen Informationen
- **Effizient recherchieren**: Optimiere Rechercheprozesse mit umfassenden Antworten auf komplexe Anfragen
- **Konversationell interagieren**: Führe natürliche Dialoge, um Fragen zu verfeinern und Themen zu erkunden

In Sim ermöglicht die Perplexity-Integration deinen Agenten, diese leistungsstarken KI-Fähigkeiten programmatisch als Teil ihrer Workflows zu nutzen. Dies erlaubt anspruchsvolle Automatisierungsszenarien, die natürliches Sprachverständnis, Echtzeit-Informationsabruf und Inhaltsgenerierung kombinieren. Deine Agenten können Anfragen formulieren, umfassende Antworten mit Zitaten erhalten und diese Informationen in ihre Entscheidungsprozesse oder Ausgaben einbeziehen. Diese Integration überbrückt die Lücke zwischen deiner Workflow-Automatisierung und dem Zugriff auf aktuelle, zuverlässige Informationen, wodurch deine Agenten fundiertere Entscheidungen treffen und genauere Antworten liefern können. Durch die Verbindung von Sim mit Perplexity kannst du Agenten erstellen, die mit den neuesten Informationen auf dem Laufenden bleiben, gut recherchierte Antworten liefern und wertvollere Erkenntnisse für Benutzer bereitstellen - alles ohne manuelle Recherche oder Informationssammlung.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriere Perplexity in den Workflow. Kann Vervollständigungen mit Perplexity AI Chat-Modellen generieren oder Websuchen mit erweiterter Filterung durchführen.

## Tools

### `perplexity_chat`

Generieren Sie Vervollständigungen mit Perplexity AI-Chatmodellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | Nein | System-Prompt zur Steuerung des Modellverhaltens |
| `content` | string | Ja | Der Inhalt der Benutzernachricht, der an das Modell gesendet wird |
| `model` | string | Ja | Modell für Chat-Vervollständigungen \(z.B. sonar, mistral\) |
| `max_tokens` | number | Nein | Maximale Anzahl der zu generierenden Tokens |
| `temperature` | number | Nein | Sampling-Temperatur zwischen 0 und 1 |
| `apiKey` | string | Ja | Perplexity API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Generierter Textinhalt |
| `model` | string | Für die Generierung verwendetes Modell |
| `usage` | object | Informationen zur Token-Nutzung |

### `perplexity_search`

Erhalte bewertete Suchergebnisse von Perplexity

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Eine Suchanfrage oder ein Array von Anfragen \(maximal 5 für Multi-Anfrage-Suche\) |
| `max_results` | number | Nein | Maximale Anzahl der zurückzugebenden Suchergebnisse \(1-20, Standard: 10\) |
| `search_domain_filter` | array | Nein | Liste der Domains/URLs, auf die die Suchergebnisse beschränkt werden sollen \(max. 20\) |
| `max_tokens_per_page` | number | Nein | Maximale Anzahl der von jeder Webseite abgerufenen Tokens \(Standard: 1024\) |
| `country` | string | Nein | Ländercode zur Filterung der Suchergebnisse \(z.B. US, GB, DE\) |
| `search_recency_filter` | string | Nein | Filtere Ergebnisse nach Aktualität: Stunde, Tag, Woche, Monat oder Jahr |
| `search_after_date` | string | Nein | Nur Inhalte einbeziehen, die nach diesem Datum veröffentlicht wurden \(Format: MM/TT/JJJJ\) |
| `search_before_date` | string | Nein | Nur Inhalte einbeziehen, die vor diesem Datum veröffentlicht wurden \(Format: MM/TT/JJJJ\) |
| `apiKey` | string | Ja | Perplexity API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Array von Suchergebnissen |

## Hinweise

- Kategorie: `tools`
- Typ: `perplexity`
```

--------------------------------------------------------------------------------

````
