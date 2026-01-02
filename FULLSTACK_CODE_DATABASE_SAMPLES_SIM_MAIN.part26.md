---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 26
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 26 of 933)

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

---[FILE: google_drive.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_drive.mdx

```text
---
title: Google Drive
description: Dateien erstellen, hochladen und auflisten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_drive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Drive](https://drive.google.com) ist Googles Cloud-Speicher- und Dateisynchronisierungsdienst, der es Benutzern ermöglicht, Dateien zu speichern, Dateien über verschiedene Geräte zu synchronisieren und Dateien mit anderen zu teilen. Als Kernkomponente des Produktivitätsökosystems von Google bietet Google Drive robuste Speicher-, Organisations- und Kollaborationsfunktionen.

Erfahren Sie, wie Sie das Google Drive-Tool in Sim integrieren, um mühelos Informationen aus Ihrem Drive durch Ihre Workflows abzurufen. Dieses Tutorial führt Sie durch die Verbindung mit Google Drive, die Einrichtung des Datenabrufs und die Verwendung gespeicherter Dokumente und Dateien zur Verbesserung der Automatisierung. Perfekt für die Synchronisierung wichtiger Daten mit Ihren Agenten in Echtzeit.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cRoRr4b-EAs"
  title="Use the Google Drive tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Mit Google Drive können Sie:

- **Dateien in der Cloud speichern**: Laden Sie Ihre Dateien hoch und greifen Sie von überall mit Internetzugang darauf zu
- **Inhalte organisieren**: Erstellen Sie Ordner, verwenden Sie Farbcodierung und implementieren Sie Namenskonventionen
- **Teilen und zusammenarbeiten**: Steuern Sie Zugriffsberechtigungen und arbeiten Sie gleichzeitig an Dateien
- **Effizient suchen**: Finden Sie Dateien schnell mit Googles leistungsstarker Suchtechnologie
- **Zugriff über verschiedene Geräte**: Nutzen Sie Google Drive auf Desktop-, Mobil- und Webplattformen
- **Integration mit anderen Diensten**: Verbinden Sie sich mit Google Docs, Sheets, Slides und Anwendungen von Drittanbietern

In Sim ermöglicht die Google Drive-Integration Ihren Agenten, direkt und programmatisch mit Ihrem Cloud-Speicher zu interagieren. Dies erlaubt leistungsstarke Automatisierungsszenarien wie Dateiverwaltung, Inhaltsorganisation und Dokumenten-Workflows. Ihre Agenten können neue Dateien in bestimmte Ordner hochladen, bestehende Dateien herunterladen, um deren Inhalte zu verarbeiten, und Ordnerinhalte auflisten, um durch Ihre Speicherstruktur zu navigieren. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Ihrem Dokumentenverwaltungssystem und ermöglicht nahtlose Dateioperationen ohne manuelle Eingriffe. Durch die Verbindung von Sim mit Google Drive können Sie dateibasierte Workflows automatisieren, Dokumente intelligent verwalten und Cloud-Speicheroperationen in die Fähigkeiten Ihres Agenten integrieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Google Drive in den Workflow. Kann Dateien erstellen, hochladen und auflisten. Erfordert OAuth.

## Tools

### `google_drive_upload`

Eine Datei zu Google Drive hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Ja | Der Name der hochzuladenden Datei |
| `file` | file | Nein | Binärdatei zum Hochladen (UserFile-Objekt) |
| `content` | string | Nein | Textinhalt zum Hochladen (verwenden Sie entweder diesen ODER file, nicht beides) |
| `mimeType` | string | Nein | Der MIME-Typ der hochzuladenden Datei (wird automatisch aus der Datei erkannt, wenn nicht angegeben) |
| `folderSelector` | string | Nein | Wählen Sie den Ordner aus, in den die Datei hochgeladen werden soll |
| `folderId` | string | Nein | Die ID des Ordners, in den die Datei hochgeladen werden soll (interne Verwendung) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | json | Metadaten der hochgeladenen Datei einschließlich ID, Name und Links |

### `google_drive_create_folder`

Einen neuen Ordner in Google Drive erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Ja | Name des zu erstellenden Ordners |
| `folderSelector` | string | Nein | Wählen Sie den übergeordneten Ordner aus, in dem der Ordner erstellt werden soll |
| `folderId` | string | Nein | ID des übergeordneten Ordners \(interne Verwendung\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | json | Metadaten des erstellten Ordners einschließlich ID, Name und Informationen zum übergeordneten Ordner |

### `google_drive_download`

Eine Datei von Google Drive herunterladen (exportiert Google Workspace-Dateien automatisch)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Ja | Die ID der herunterzuladenden Datei |
| `mimeType` | string | Nein | Der MIME-Typ, in den Google Workspace-Dateien exportiert werden sollen (optional) |
| `fileName` | string | Nein | Optionale Überschreibung des Dateinamens |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | file | Heruntergeladene Datei, die in den Ausführungsdateien gespeichert ist |

### `google_drive_list`

Dateien und Ordner in Google Drive auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | Nein | Wählen Sie den Ordner aus, aus dem Dateien aufgelistet werden sollen |
| `folderId` | string | Nein | Die ID des Ordners, aus dem Dateien aufgelistet werden sollen (interne Verwendung) |
| `query` | string | Nein | Suchbegriff, um Dateien nach Namen zu filtern (z.B. "budget" findet Dateien mit "budget" im Namen). Verwenden Sie hier KEINE Google Drive-Abfragesyntax - geben Sie einfach einen einfachen Suchbegriff ein. |
| `pageSize` | number | Nein | Die maximale Anzahl der zurückzugebenden Dateien (Standard: 100) |
| `pageToken` | string | Nein | Das Seitentoken für die Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `files` | json | Array von Metadatenobjekten der Dateien aus dem angegebenen Ordner |

## Hinweise

- Kategorie: `tools`
- Typ: `google_drive`
```

--------------------------------------------------------------------------------

---[FILE: google_forms.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_forms.mdx

```text
---
title: Google Forms
description: Antworten aus einem Google-Formular lesen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_forms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Forms](https://forms.google.com) ist Googles Online-Umfrage- und Formular-Tool, mit dem Benutzer Formulare erstellen, Antworten sammeln und Ergebnisse analysieren können. Als Teil der Google-Produktivitätssuite macht Google Forms es einfach, Informationen, Feedback und Daten von Benutzern zu sammeln.

Erfahren Sie, wie Sie das Google Forms-Tool in Sim integrieren, um Formularantworten automatisch in Ihren Workflows zu lesen und zu verarbeiten. Dieses Tutorial führt Sie durch die Verbindung mit Google Forms, das Abrufen von Antworten und die Nutzung der gesammelten Daten zur Automatisierung. Perfekt für die Synchronisierung von Umfrageergebnissen, Registrierungen oder Feedback mit Ihren Agenten in Echtzeit.

Mit Google Forms können Sie:

- **Umfragen und Formulare erstellen**: Entwerfen Sie benutzerdefinierte Formulare für Feedback, Registrierung, Quizze und mehr
- **Antworten automatisch sammeln**: Erfassen Sie Daten von Benutzern in Echtzeit
- **Ergebnisse analysieren**: Sehen Sie sich Antworten in Google Forms an oder exportieren Sie sie nach Google Sheets für weitere Analysen
- **Einfach zusammenarbeiten**: Teilen Sie Formulare und arbeiten Sie mit anderen zusammen, um Fragen zu erstellen und zu überprüfen
- **Mit anderen Google-Diensten integrieren**: Verbinden Sie sich mit Google Sheets, Drive und mehr

In Sim ermöglicht die Google Forms-Integration Ihren Agenten den programmatischen Zugriff auf Formularantworten. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie die Verarbeitung von Umfragedaten, das Auslösen von Workflows basierend auf neuen Einreichungen und die Synchronisierung von Formularergebnissen mit anderen Tools. Ihre Agenten können alle Antworten für ein Formular abrufen, eine bestimmte Antwort abrufen und die Daten nutzen, um intelligente Automatisierung zu steuern. Durch die Verbindung von Sim mit Google Forms können Sie die Datenerfassung automatisieren, die Feedback-Verarbeitung optimieren und Formularantworten in die Fähigkeiten Ihres Agenten integrieren.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Google Forms in Ihren Workflow. Geben Sie eine Formular-ID an, um Antworten aufzulisten, oder geben Sie eine Antwort-ID an, um eine einzelne Antwort abzurufen. Erfordert OAuth.

## Tools

### `google_forms_get_responses`

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| formId | string | Ja | Die ID des Google-Formulars |
| responseId | string | Nein | Falls angegeben, wird diese spezifische Antwort zurückgegeben |
| pageSize | number | Nein | Maximale Anzahl der zurückzugebenden Antworten (der Dienst kann weniger zurückgeben). Standardwert ist 5000 |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | json | Antwort oder Liste von Antworten |

## Hinweise

- Kategorie: `tools`
- Typ: `google_forms`
```

--------------------------------------------------------------------------------

---[FILE: google_groups.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_groups.mdx

```text
---
title: Google Groups
description: Google Workspace-Gruppen und deren Mitglieder verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_groups"
  color="#E8F0FE"
/>

## Gebrauchsanweisung

Verbinden Sie sich mit Google Workspace, um Gruppen und deren Mitglieder mit der Admin SDK Directory API zu erstellen, zu aktualisieren und zu verwalten.

## Tools

### `google_groups_list_groups`

Alle Gruppen in einer Google Workspace-Domain auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `customer` | string | Nein | Kunden-ID oder "my_customer" für die Domain des authentifizierten Benutzers |
| `domain` | string | Nein | Domainname zum Filtern von Gruppen |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(1-200\) |
| `pageToken` | string | Nein | Token für Paginierung |
| `query` | string | Nein | Suchabfrage zum Filtern von Gruppen \(z.B. "email:admin*"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `groups` | json | Array von Gruppenobjekten |
| `nextPageToken` | string | Token zum Abrufen der nächsten Ergebnisseite |

### `google_groups_get_group`

Details einer bestimmten Google-Gruppe nach E-Mail oder Gruppen-ID abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `group` | json | Gruppenobjekt |

### `google_groups_create_group`

Eine neue Google-Gruppe in der Domain erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | E-Mail-Adresse für die neue Gruppe (z.B. team@yourdomain.com) |
| `name` | string | Ja | Anzeigename für die Gruppe |
| `description` | string | Nein | Beschreibung der Gruppe |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `group` | json | Erstelltes Gruppenobjekt |

### `google_groups_update_group`

Eine bestehende Google-Gruppe aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `name` | string | Nein | Neuer Anzeigename für die Gruppe |
| `description` | string | Nein | Neue Beschreibung für die Gruppe |
| `email` | string | Nein | Neue E-Mail-Adresse für die Gruppe |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `group` | json | Aktualisiertes Gruppenobjekt |

### `google_groups_delete_group`

Eine Google-Gruppe löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID zum Löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgsmeldung |

### `google_groups_list_members`

Alle Mitglieder einer Google-Gruppe auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(1-200\) |
| `pageToken` | string | Nein | Token für Seitenumbruch |
| `roles` | string | Nein | Nach Rollen filtern \(durch Komma getrennt: OWNER, MANAGER, MEMBER\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `members` | json | Array von Mitgliederobjekten |
| `nextPageToken` | string | Token zum Abrufen der nächsten Ergebnisseite |

### `google_groups_get_member`

Details eines bestimmten Mitglieds in einer Google-Gruppe abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `memberKey` | string | Ja | E-Mail-Adresse des Mitglieds oder eindeutige Mitglieds-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `member` | json | Mitgliederobjekt |

### `google_groups_add_member`

Ein neues Mitglied zu einer Google-Gruppe hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `email` | string | Ja | E-Mail-Adresse des hinzuzufügenden Mitglieds |
| `role` | string | Nein | Rolle für das Mitglied \(MEMBER, MANAGER oder OWNER\). Standardmäßig MEMBER. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `member` | json | Hinzugefügtes Mitgliederobjekt |

### `google_groups_remove_member`

Ein Mitglied aus einer Google-Gruppe entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `memberKey` | string | Ja | E-Mail-Adresse oder eindeutige ID des zu entfernenden Mitglieds |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgsmeldung |

### `google_groups_update_member`

Ein Mitglied aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `memberKey` | string | Ja | E-Mail-Adresse des Mitglieds oder eindeutige Mitglieds-ID |
| `role` | string | Ja | Neue Rolle für das Mitglied \(MEMBER, MANAGER oder OWNER\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `member` | json | Aktualisiertes Mitgliederobjekt |

### `google_groups_has_member`

Prüfen, ob ein Benutzer Mitglied einer Google-Gruppe ist

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Ja | E-Mail-Adresse der Gruppe oder eindeutige Gruppen-ID |
| `memberKey` | string | Ja | Zu prüfende E-Mail-Adresse des Mitglieds oder eindeutige Mitglieds-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `isMember` | boolean | Gibt an, ob der Benutzer ein Mitglied der Gruppe ist |

## Hinweise

- Kategorie: `tools`
- Typ: `google_groups`
```

--------------------------------------------------------------------------------

---[FILE: google_search.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_search.mdx

```text
---
title: Google Suche
description: Das Web durchsuchen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_search"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Search](https://www.google.com) ist die weltweit am häufigsten genutzte Suchmaschine, die Zugang zu Milliarden von Webseiten und Informationsquellen bietet. Google Search verwendet ausgeklügelte Algorithmen, um relevante Suchergebnisse basierend auf Nutzeranfragen zu liefern, was es zu einem unverzichtbaren Werkzeug für die Informationssuche im Internet macht.

Erfahren Sie, wie Sie das Google Search-Tool in Sim integrieren können, um mühelos Echtzeit-Suchergebnisse in Ihren Workflows abzurufen. Dieses Tutorial führt Sie durch die Verbindung mit Google Search, die Konfiguration von Suchanfragen und die Nutzung von Live-Daten zur Verbesserung der Automatisierung. Perfekt, um Ihre Agenten mit aktuellen Informationen und intelligenterer Entscheidungsfindung auszustatten.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/1B7hV9b5UMQ"
  title="Verwenden Sie das Google Search-Tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Mit Google Search können Sie:

- **Relevante Informationen finden**: Zugriff auf Milliarden von Webseiten mit Googles leistungsstarken Suchalgorithmen
- **Spezifische Ergebnisse erhalten**: Verwenden Sie Suchoperatoren, um Ihre Anfragen zu verfeinern und gezielt auszurichten
- **Vielfältige Inhalte entdecken**: Finden Sie Texte, Bilder, Videos, Nachrichten und andere Inhaltstypen
- **Auf Wissensgraphen zugreifen**: Erhalten Sie strukturierte Informationen über Personen, Orte und Dinge
- **Suchfunktionen nutzen**: Nutzen Sie spezialisierte Suchwerkzeuge wie Taschenrechner, Einheitenumrechner und mehr

In Sim ermöglicht die Google Search-Integration Ihren Agenten, das Web programmatisch zu durchsuchen und Suchergebnisse in ihre Workflows einzubinden. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie Recherche, Faktenprüfung, Datensammlung und Informationssynthese. Ihre Agenten können Suchanfragen formulieren, relevante Ergebnisse abrufen und Informationen aus diesen Ergebnissen extrahieren, um Entscheidungen zu treffen oder Erkenntnisse zu gewinnen. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und den umfangreichen Informationen, die im Web verfügbar sind, und ermöglicht Ihren Agenten den Zugriff auf aktuelle Informationen aus dem gesamten Internet. Durch die Verbindung von Sim mit Google Search können Sie Agenten erstellen, die mit den neuesten Informationen auf dem Laufenden bleiben, Fakten überprüfen, Recherchen durchführen und Benutzern relevante Webinhalte bereitstellen - alles ohne Ihren Workflow zu verlassen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriert Google-Suche in den Workflow. Kann im Web suchen. Erfordert API-Schlüssel.

## Tools

### `google_search`

Durchsuchen des Webs mit der Custom Search API

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die auszuführende Suchanfrage |
| `searchEngineId` | string | Ja | Custom Search Engine ID |
| `num` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 10, max: 10\) |
| `apiKey` | string | Ja | Google API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | array | Array von Suchergebnissen von Google |

## Hinweise

- Kategorie: `tools`
- Typ: `google_search`
```

--------------------------------------------------------------------------------

---[FILE: google_sheets.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_sheets.mdx

```text
---
title: Google Sheets
description: Daten lesen, schreiben und aktualisieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_sheets"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Sheets](https://sheets.google.com) ist eine leistungsstarke cloudbasierte Tabellenkalkulationsanwendung, mit der Benutzer Tabellenkalkulationen in Echtzeit erstellen, bearbeiten und gemeinsam daran arbeiten können. Als Teil der Google-Produktivitätssuite bietet Google Sheets eine vielseitige Plattform für Datenorganisation, -analyse und -visualisierung mit robusten Formatierungs-, Formel- und Freigabefunktionen.

Erfahren Sie, wie Sie das Google Sheets "Lesen"-Tool in Sim integrieren, um mühelos Daten aus Ihren Tabellenkalkulationen abzurufen und in Ihre Workflows zu integrieren. Dieses Tutorial führt Sie durch die Verbindung mit Google Sheets, die Einrichtung von Datenabfragen und die Verwendung dieser Informationen zur Automatisierung von Prozessen in Echtzeit. Perfekt für die Synchronisierung von Live-Daten mit Ihren Agenten.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/xxP7MZRuq_0"
  title="Verwenden des Google Sheets Lese-Tools in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Entdecken Sie, wie Sie das Google Sheets "Schreiben"-Tool in Sim verwenden können, um automatisch Daten aus Ihren Workflows an Ihre Google Sheets zu senden. Dieses Tutorial behandelt die Einrichtung der Integration, die Konfiguration von Schreibvorgängen und die nahtlose Aktualisierung Ihrer Tabellen während der Ausführung von Workflows. Perfekt für die Führung von Echtzeit-Aufzeichnungen ohne manuelle Eingabe.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cO86qTj7qeY"
  title="Verwenden des Google Sheets Schreib-Tools in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Erfahren Sie, wie Sie das Google Sheets "Aktualisieren"-Tool in Sim nutzen können, um bestehende Einträge in Ihren Tabellenkalkulationen basierend auf der Workflow-Ausführung zu ändern. Dieses Tutorial zeigt die Einrichtung der Aktualisierungslogik, das Mapping von Datenfeldern und die sofortige Synchronisierung von Änderungen. Perfekt, um Ihre Daten aktuell und konsistent zu halten.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/95by2fL9yn4"
  title="Verwenden Sie das Google Sheets Update-Tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Erfahren Sie, wie Sie das Google Sheets "Append"-Tool in Sim verwenden können, um mühelos neue Datenzeilen während der Workflow-Ausführung zu Ihren Tabellen hinzuzufügen. Dieses Tutorial führt Sie durch die Einrichtung der Integration, die Konfiguration von Append-Aktionen und die Sicherstellung eines reibungslosen Datenwachstums. Perfekt für die Erweiterung von Datensätzen ohne manuellen Aufwand!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/8DgNvLBCsAo"
  title="Verwenden Sie das Google Sheets Append-Tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Mit Google Sheets können Sie:

- **Tabellen erstellen und bearbeiten**: Entwickeln Sie datengesteuerte Dokumente mit umfassenden Formatierungs- und Berechnungsoptionen
- **In Echtzeit zusammenarbeiten**: Arbeiten Sie gleichzeitig mit mehreren Benutzern an derselben Tabelle
- **Daten analysieren**: Verwenden Sie Formeln, Funktionen und Pivot-Tabellen, um Ihre Daten zu verarbeiten und zu verstehen
- **Informationen visualisieren**: Erstellen Sie Diagramme, Grafiken und bedingte Formatierungen, um Daten visuell darzustellen
- **Überall zugreifen**: Nutzen Sie Google Sheets geräteübergreifend mit automatischer Cloud-Synchronisierung
- **Offline arbeiten**: Arbeiten Sie ohne Internetverbindung weiter, wobei Änderungen synchronisiert werden, sobald Sie wieder online sind
- **Mit anderen Diensten integrieren**: Verbinden Sie mit Google Drive, Forms und Drittanbieteranwendungen

In Sim ermöglicht die Google Sheets-Integration Ihren Agenten, direkt programmatisch mit Tabellendaten zu interagieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie Datenextraktion, -analyse, -berichterstattung und -verwaltung. Ihre Agenten können bestehende Tabellen lesen, um Informationen zu extrahieren, in Tabellen schreiben, um Daten zu aktualisieren, und neue Tabellen von Grund auf erstellen. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und der Datenverwaltung und ermöglicht eine nahtlose Interaktion mit strukturierten Daten. Durch die Verbindung von Sim mit Google Sheets können Sie Daten-Workflows automatisieren, Berichte generieren, Erkenntnisse aus Daten gewinnen und aktuelle Informationen pflegen - alles durch Ihre intelligenten Agenten. Die Integration unterstützt verschiedene Datenformate und Bereichsspezifikationen, was sie flexibel genug macht, um unterschiedliche Datenverwaltungsanforderungen zu erfüllen, während die kollaborative und zugängliche Natur von Google Sheets erhalten bleibt.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriert Google Sheets in den Workflow. Kann Daten lesen, schreiben, anhängen und aktualisieren. Erfordert OAuth.

## Tools

### `google_sheets_read`

Daten aus einer Google Sheets-Tabelle lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der Tabelle \(zu finden in der URL: docs.google.com/spreadsheets/d/\{SPREADSHEET_ID\}/edit\). |
| `range` | string | Nein | Der A1-Notationsbereich zum Lesen \(z.B. "Sheet1!A1:D10", "A1:B5"\). Standardmäßig wird das erste Tabellenblatt A1:Z1000 verwendet, wenn nicht angegeben. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | json | Tabellendaten einschließlich Bereich und Zellwerte |
| `metadata` | json | Tabellenmetadaten einschließlich ID und URL |

### `google_sheets_write`

Daten in eine Google Sheets-Tabelle schreiben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der Tabelle |
| `range` | string | Nein | Der A1-Notationsbereich, in den geschrieben werden soll \(z.B. "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | Ja | Die zu schreibenden Daten als 2D-Array \(z.B. \[\["Name", "Alter"\], \["Alice", 30\], \["Bob", 25\]\]\) oder Array von Objekten. |
| `valueInputOption` | string | Nein | Das Format der zu schreibenden Daten |
| `includeValuesInResponse` | boolean | Nein | Ob die geschriebenen Werte in der Antwort enthalten sein sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updatedRange` | string | Bereich der aktualisierten Zellen |
| `updatedRows` | number | Anzahl der aktualisierten Zeilen |
| `updatedColumns` | number | Anzahl der aktualisierten Spalten |
| `updatedCells` | number | Anzahl der aktualisierten Zellen |
| `metadata` | json | Tabellenmetadaten einschließlich ID und URL |

### `google_sheets_update`

Daten in einer Google Sheets-Tabelle aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der zu aktualisierenden Tabelle |
| `range` | string | Nein | Der A1-Notationsbereich, der aktualisiert werden soll \(z.B. "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | Ja | Die zu aktualisierenden Daten als 2D-Array \(z.B. \[\["Name", "Alter"\], \["Alice", 30\]\]\) oder Array von Objekten. |
| `valueInputOption` | string | Nein | Das Format der zu aktualisierenden Daten |
| `includeValuesInResponse` | boolean | Nein | Ob die aktualisierten Werte in der Antwort enthalten sein sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updatedRange` | string | Bereich der aktualisierten Zellen |
| `updatedRows` | number | Anzahl der aktualisierten Zeilen |
| `updatedColumns` | number | Anzahl der aktualisierten Spalten |
| `updatedCells` | number | Anzahl der aktualisierten Zellen |
| `metadata` | json | Tabellen-Metadaten einschließlich ID und URL |

### `google_sheets_append`

Daten am Ende einer Google Sheets-Tabelle anhängen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Ja | Die ID der Tabelle, an die angehängt werden soll |
| `range` | string | Nein | Der A1-Notationsbereich, an den angehängt werden soll (z.B. "Sheet1", "Sheet1!A:D") |
| `values` | array | Ja | Die anzuhängenden Daten als 2D-Array (z.B. [["Alice", 30], ["Bob", 25]]) oder Array von Objekten |
| `valueInputOption` | string | Nein | Das Format der anzuhängenden Daten |
| `insertDataOption` | string | Nein | Wie die Daten eingefügt werden sollen (OVERWRITE oder INSERT_ROWS) |
| `includeValuesInResponse` | boolean | Nein | Ob die angehängten Werte in der Antwort enthalten sein sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tableRange` | string | Bereich der Tabelle, in dem Daten angehängt wurden |
| `updatedRange` | string | Bereich der Zellen, die aktualisiert wurden |
| `updatedRows` | number | Anzahl der aktualisierten Zeilen |
| `updatedColumns` | number | Anzahl der aktualisierten Spalten |
| `updatedCells` | number | Anzahl der aktualisierten Zellen |
| `metadata` | json | Tabellenkalkulationsmetadaten einschließlich ID und URL |

## Hinweise

- Kategorie: `tools`
- Typ: `google_sheets`
```

--------------------------------------------------------------------------------

---[FILE: google_slides.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_slides.mdx

```text
---
title: Google Slides
description: Präsentationen lesen, schreiben und erstellen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_slides"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Slides](https://slides.google.com) ist eine dynamische cloudbasierte Präsentationsanwendung, mit der Benutzer in Echtzeit Präsentationen erstellen, bearbeiten, gemeinsam daran arbeiten und präsentieren können. Als Teil der Google-Produktivitätssuite bietet Google Slides eine flexible Plattform zum Gestalten ansprechender Präsentationen, zur Zusammenarbeit mit anderen und zum nahtlosen Teilen von Inhalten über die Cloud.

Erfahren Sie, wie Sie die Google Slides-Tools in Sim integrieren können, um Präsentationen mühelos als Teil Ihrer automatisierten Workflows zu verwalten. Mit Sim können Sie Google Slides-Präsentationen direkt über Ihre Agenten und automatisierten Prozesse lesen, schreiben, erstellen und aktualisieren, wodurch es einfach wird, aktuelle Informationen zu liefern, benutzerdefinierte Berichte zu generieren oder Marken-Präsentationen programmatisch zu erstellen.

Mit Google Slides können Sie:

- **Präsentationen erstellen und bearbeiten**: Gestalten Sie visuell ansprechende Folien mit Designs, Layouts und Multimedia-Inhalten
- **In Echtzeit zusammenarbeiten**: Arbeiten Sie gleichzeitig mit Teammitgliedern, kommentieren Sie, weisen Sie Aufgaben zu und erhalten Sie Live-Feedback zu Präsentationen
- **Überall präsentieren**: Zeigen Sie Präsentationen online oder offline an, teilen Sie Links oder veröffentlichen Sie im Web
- **Bilder und umfangreiche Inhalte hinzufügen**: Fügen Sie Bilder, Grafiken, Diagramme und Videos ein, um Ihre Präsentationen ansprechend zu gestalten
- **Mit anderen Diensten integrieren**: Verbinden Sie sich nahtlos mit Google Drive, Docs, Sheets und anderen Drittanbieter-Tools
- **Von jedem Gerät aus zugreifen**: Nutzen Sie Google Slides auf Desktop-Computern, Laptops, Tablets und mobilen Geräten für maximale Flexibilität

In Sim ermöglicht die Google Slides-Integration Ihren Agenten, direkt programmatisch mit Präsentationsdateien zu interagieren. Automatisieren Sie Aufgaben wie das Lesen von Folieninhalten, das Einfügen neuer Folien oder Bilder, das Ersetzen von Text in einer gesamten Präsentation, das Erstellen neuer Präsentationen und das Abrufen von Folien-Miniaturansichten. Dies ermöglicht Ihnen, die Inhaltserstellung zu skalieren, Präsentationen aktuell zu halten und sie in automatisierte Dokumenten-Workflows einzubetten. Durch die Verbindung von Sim mit Google Slides ermöglichen Sie KI-gestütztes Präsentationsmanagement – so wird es einfach, Präsentationen ohne manuellen Aufwand zu generieren, zu aktualisieren oder Informationen daraus zu extrahieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Google Slides in den Workflow. Kann Präsentationen lesen, schreiben, erstellen, Text ersetzen, Folien hinzufügen, Bilder einfügen und Vorschaubilder abrufen.

## Tools

### `google_slides_read`

Inhalte aus einer Google Slides-Präsentation lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Ja | Die ID der zu lesenden Präsentation |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `slides` | json | Array von Folien mit ihren Inhalten |
| `metadata` | json | Präsentationsmetadaten einschließlich ID, Titel und URL |

### `google_slides_write`

Inhalte in einer Google Slides-Präsentation schreiben oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Ja | Die ID der Präsentation, in die geschrieben werden soll |
| `content` | string | Ja | Der Inhalt, der in die Folie geschrieben werden soll |
| `slideIndex` | number | Nein | Der Index der Folie, in die geschrieben werden soll \(standardmäßig die erste Folie\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Gibt an, ob der Präsentationsinhalt erfolgreich aktualisiert wurde |
| `metadata` | json | Aktualisierte Präsentationsmetadaten einschließlich ID, Titel und URL |

### `google_slides_create`

Eine neue Google Slides-Präsentation erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Der Titel der zu erstellenden Präsentation |
| `content` | string | Nein | Der Inhalt, der zur ersten Folie hinzugefügt werden soll |
| `folderSelector` | string | Nein | Wählen Sie den Ordner aus, in dem die Präsentation erstellt werden soll |
| `folderId` | string | Nein | Die ID des Ordners, in dem die Präsentation erstellt werden soll \(interne Verwendung\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `metadata` | json | Metadaten der erstellten Präsentation einschließlich ID, Titel und URL |

### `google_slides_replace_all_text`

Suchen und ersetzen aller Textvorkommen in einer Google Slides-Präsentation

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Ja | Die ID der Präsentation |
| `findText` | string | Ja | Der zu suchende Text (z.B. \{\{placeholder\}\}) |
| `replaceText` | string | Ja | Der Text, durch den ersetzt werden soll |
| `matchCase` | boolean | Nein | Ob die Suche Groß-/Kleinschreibung berücksichtigen soll (Standard: true) |
| `pageObjectIds` | string | Nein | Kommagetrennte Liste von Folienobjekt-IDs, um Ersetzungen auf bestimmte Folien zu beschränken (leer lassen für alle Folien) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `occurrencesChanged` | number | Anzahl der Textvorkommen, die ersetzt wurden |
| `metadata` | json | Operationsmetadaten einschließlich Präsentations-ID und URL |

### `google_slides_add_slide`

Eine neue Folie mit einem bestimmten Layout zu einer Google Slides-Präsentation hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Ja | Die ID der Präsentation |
| `layout` | string | Nein | Das vordefinierte Layout für die Folie (BLANK, TITLE, TITLE_AND_BODY, TITLE_ONLY, SECTION_HEADER, usw.). Standard ist BLANK. |
| `insertionIndex` | number | Nein | Der optionale nullbasierte Index, der angibt, wo die Folie eingefügt werden soll. Wenn nicht angegeben, wird die Folie am Ende hinzugefügt. |
| `placeholderIdMappings` | string | Nein | JSON-Array von Platzhalter-Zuordnungen, um Platzhaltern benutzerdefinierte Objekt-IDs zuzuweisen. Format: \[\{"layoutPlaceholder":\{"type":"TITLE"\},"objectId":"custom_title_id"\}\] |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `slideId` | string | Die Objekt-ID der neu erstellten Folie |
| `metadata` | json | Operationsmetadaten einschließlich Präsentations-ID, Layout und URL |

### `google_slides_add_image`

Ein Bild in eine bestimmte Folie einer Google Slides-Präsentation einfügen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Ja | Die ID der Präsentation |
| `pageObjectId` | string | Ja | Die Objekt-ID der Folie/Seite, zu der das Bild hinzugefügt werden soll |
| `imageUrl` | string | Ja | Die öffentlich zugängliche URL des Bildes \(muss PNG, JPEG oder GIF sein, max. 50MB\) |
| `width` | number | Nein | Breite des Bildes in Punkten \(Standard: 300\) |
| `height` | number | Nein | Höhe des Bildes in Punkten \(Standard: 200\) |
| `positionX` | number | Nein | X-Position vom linken Rand in Punkten \(Standard: 100\) |
| `positionY` | number | Nein | Y-Position vom oberen Rand in Punkten \(Standard: 100\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `imageId` | string | Die Objekt-ID des neu erstellten Bildes |
| `metadata` | json | Operationsmetadaten einschließlich Präsentations-ID und Bild-URL |

### `google_slides_get_thumbnail`

Ein Vorschaubild einer bestimmten Folie in einer Google Slides-Präsentation generieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Ja | Die ID der Präsentation |
| `pageObjectId` | string | Ja | Die Objekt-ID der Folie/Seite, für die ein Thumbnail erstellt werden soll |
| `thumbnailSize` | string | Nein | Die Größe des Thumbnails: SMALL \(200px\), MEDIUM \(800px\) oder LARGE \(1600px\). Standardmäßig MEDIUM. |
| `mimeType` | string | Nein | Der MIME-Typ des Thumbnail-Bildes: PNG oder GIF. Standardmäßig PNG. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contentUrl` | string | URL zum Thumbnail-Bild \(gültig für 30 Minuten\) |
| `width` | number | Breite des Thumbnails in Pixeln |
| `height` | number | Höhe des Thumbnails in Pixeln |
| `metadata` | json | Operationsmetadaten einschließlich Präsentations-ID und Seitenobjekt-ID |

## Hinweise

- Kategorie: `tools`
- Typ: `google_slides`
```

--------------------------------------------------------------------------------

````
