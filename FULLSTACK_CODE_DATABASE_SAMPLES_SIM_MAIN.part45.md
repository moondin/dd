---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 45
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 45 of 933)

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

---[FILE: servicenow.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/servicenow.mdx

```text
---
title: ServiceNow
description: ServiceNow-Datensätze erstellen, lesen, aktualisieren und löschen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="servicenow"
  color="#032D42"
/>

{/* MANUAL-CONTENT-START:intro */}
[ServiceNow](https://www.servicenow.com/) ist eine leistungsstarke Cloud-Plattform zur Optimierung und Automatisierung von IT-Service-Management (ITSM), Workflows und Geschäftsprozessen in Ihrem Unternehmen. ServiceNow ermöglicht Ihnen die Verwaltung von Vorfällen, Anfragen, Aufgaben, Benutzern und mehr über seine umfangreiche API.

Mit ServiceNow können Sie:

- **IT-Workflows automatisieren**: Datensätze in jeder ServiceNow-Tabelle erstellen, lesen, aktualisieren und löschen, z. B. Vorfälle, Aufgaben, Änderungsanfragen und Benutzer.
- **Systeme integrieren**: ServiceNow mit Ihren anderen Tools und Prozessen für nahtlose Automatisierung verbinden.
- **Eine einzige Informationsquelle pflegen**: Alle Ihre Service- und Betriebsdaten organisiert und zugänglich halten.
- **Betriebliche Effizienz steigern**: Manuelle Arbeit reduzieren und Servicequalität mit anpassbaren Workflows und Automatisierung verbessern.

In Sim ermöglicht die ServiceNow-Integration Ihren Agenten, direkt mit Ihrer ServiceNow-Instanz als Teil ihrer Workflows zu interagieren. Agenten können Datensätze in jeder ServiceNow-Tabelle erstellen, lesen, aktualisieren oder löschen und Ticket- oder Benutzerdaten für ausgefeilte Automatisierung und Entscheidungsfindung nutzen. Diese Integration verbindet Ihre Workflow-Automatisierung und IT-Betrieb und befähigt Ihre Agenten, Serviceanfragen, Vorfälle, Benutzer und Assets ohne manuelle Eingriffe zu verwalten. Durch die Verbindung von Sim mit ServiceNow können Sie Service-Management-Aufgaben automatisieren, Reaktionszeiten verbessern und konsistenten, sicheren Zugriff auf die wichtigen Servicedaten Ihres Unternehmens gewährleisten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie ServiceNow in Ihren Workflow. Erstellen, lesen, aktualisieren und löschen Sie Datensätze in jeder ServiceNow-Tabelle, einschließlich Vorfälle, Aufgaben, Änderungsanfragen, Benutzer und mehr.

## Tools

### `servicenow_create_record`

Einen neuen Datensatz in einer ServiceNow-Tabelle erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Ja | ServiceNow-Instanz-URL \(z. B. https://instance.service-now.com\) |
| `username` | string | Ja | ServiceNow-Benutzername |
| `password` | string | Ja | ServiceNow-Passwort |
| `tableName` | string | Ja | Tabellenname \(z. B. incident, task, sys_user\) |
| `fields` | json | Ja | Felder, die für den Datensatz festgelegt werden sollen \(JSON-Objekt\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `record` | json | Erstellter ServiceNow-Datensatz mit sys_id und anderen Feldern |
| `metadata` | json | Metadaten der Operation |

### `servicenow_read_record`

Datensätze aus einer ServiceNow-Tabelle lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Ja | ServiceNow-Instanz-URL \(z. B. https://instance.service-now.com\) |
| `username` | string | Ja | ServiceNow-Benutzername |
| `password` | string | Ja | ServiceNow-Passwort |
| `tableName` | string | Ja | Tabellenname |
| `sysId` | string | Nein | Spezifische Datensatz-sys_id |
| `number` | string | Nein | Datensatznummer \(z. B. INC0010001\) |
| `query` | string | Nein | Kodierte Abfragezeichenfolge \(z. B. "active=true^priority=1"\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Datensätze |
| `fields` | string | Nein | Durch Kommas getrennte Liste der zurückzugebenden Felder |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `records` | array | Array von ServiceNow-Datensätzen |
| `metadata` | json | Metadaten der Operation |

### `servicenow_update_record`

Einen bestehenden Datensatz in einer ServiceNow-Tabelle aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Ja | ServiceNow-Instanz-URL \(z. B. https://instance.service-now.com\) |
| `username` | string | Ja | ServiceNow-Benutzername |
| `password` | string | Ja | ServiceNow-Passwort |
| `tableName` | string | Ja | Tabellenname |
| `sysId` | string | Ja | Datensatz-sys_id zum Aktualisieren |
| `fields` | json | Ja | Zu aktualisierende Felder \(JSON-Objekt\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `record` | json | Aktualisierter ServiceNow-Datensatz |
| `metadata` | json | Metadaten der Operation |

### `servicenow_delete_record`

Einen Datensatz aus einer ServiceNow-Tabelle löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Ja | ServiceNow-Instanz-URL \(z. B. https://instance.service-now.com\) |
| `username` | string | Ja | ServiceNow-Benutzername |
| `password` | string | Ja | ServiceNow-Passwort |
| `tableName` | string | Ja | Tabellenname |
| `sysId` | string | Ja | Datensatz-sys_id zum Löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Löschen erfolgreich war |
| `metadata` | json | Metadaten der Operation |

## Hinweise

- Kategorie: `tools`
- Typ: `servicenow`
```

--------------------------------------------------------------------------------

---[FILE: sftp.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/sftp.mdx

```text
---
title: SFTP
description: Übertragen Sie Dateien über SFTP (SSH File Transfer Protocol)
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sftp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SFTP (SSH File Transfer Protocol)](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol) ist ein sicheres Netzwerkprotokoll, das es Ihnen ermöglicht, Dateien auf entfernten Servern hochzuladen, herunterzuladen und zu verwalten. SFTP arbeitet über SSH und ist damit ideal für automatisierte, verschlüsselte Dateiübertragungen und die Fernverwaltung von Dateien in modernen Arbeitsabläufen.

Mit den in Sim integrierten SFTP-Tools können Sie die Übertragung von Dateien zwischen Ihren KI-Agenten und externen Systemen oder Servern einfach automatisieren. Dies ermöglicht Ihren Agenten, kritische Datenaustausche, Backups, Dokumentenerstellung und die Orchestrierung entfernter Systeme – alles mit robuster Sicherheit – zu verwalten.

**Wichtige Funktionen, die über SFTP-Tools verfügbar sind:**

- **Dateien hochladen:** Übertragen Sie nahtlos Dateien jeder Art von Ihrem Workflow auf einen entfernten Server, mit Unterstützung für Passwort- und SSH-Private-Key-Authentifizierung.
- **Dateien herunterladen:** Rufen Sie Dateien von entfernten SFTP-Servern direkt zur Verarbeitung, Archivierung oder weiteren Automatisierung ab.
- **Dateien auflisten & verwalten:** Verzeichnisse auflisten, Dateien und Ordner löschen oder erstellen und Dateisystemberechtigungen ferngesteuert verwalten.
- **Flexible Authentifizierung:** Verbinden Sie sich entweder mit herkömmlichen Passwörtern oder SSH-Schlüsseln, mit Unterstützung für Passphrasen und Berechtigungskontrolle.
- **Unterstützung großer Dateien:** Verwalten Sie programmatisch große Datei-Uploads und -Downloads, mit integrierten Größenbeschränkungen für die Sicherheit.

Durch die Integration von SFTP in Sim können Sie sichere Dateioperationen als Teil jedes Workflows automatisieren, sei es Datenerfassung, Berichterstattung, Wartung entfernter Systeme oder dynamischer Inhaltsaustausch zwischen Plattformen.

Die folgenden Abschnitte beschreiben die wichtigsten verfügbaren SFTP-Tools:

- **sftp_upload:** Laden Sie eine oder mehrere Dateien auf einen entfernten Server hoch.
- **sftp_download:** Laden Sie Dateien von einem entfernten Server in Ihren Workflow herunter.
- **sftp_list:** Listen Sie Verzeichnisinhalte auf einem entfernten SFTP-Server auf.
- **sftp_delete:** Löschen Sie Dateien oder Verzeichnisse von einem entfernten Server.
- **sftp_create:** Erstellen Sie neue Dateien auf einem entfernten SFTP-Server.
- **sftp_mkdir:** Erstellen Sie neue Verzeichnisse aus der Ferne.

Siehe die Werkzeugdokumentation unten für detaillierte Ein- und Ausgabeparameter für jede Operation.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Dateien auf Remote-Servern über SFTP hochladen, herunterladen, auflisten und verwalten. Unterstützt sowohl Passwort- als auch Private-Key-Authentifizierung für sichere Dateiübertragungen.

## Werkzeuge

### `sftp_upload`

Dateien auf einen Remote-SFTP-Server hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SFTP-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SFTP-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SFTP-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein Private Key verwendet wird\) |
| `privateKey` | string | Nein | Private Key für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten Private Key |
| `remotePath` | string | Ja | Zielverzeichnis auf dem Remote-Server |
| `files` | file[] | Nein | Hochzuladende Dateien |
| `fileContent` | string | Nein | Direkter Dateiinhalt zum Hochladen \(für Textdateien\) |
| `fileName` | string | Nein | Dateiname bei Verwendung von direktem Inhalt |
| `overwrite` | boolean | Nein | Ob bestehende Dateien überschrieben werden sollen \(Standard: true\) |
| `permissions` | string | Nein | Dateiberechtigungen \(z.B. 0644\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Upload erfolgreich war |
| `uploadedFiles` | json | Array mit Details zu hochgeladenen Dateien \(Name, remotePath, Größe\) |
| `message` | string | Statusmeldung des Vorgangs |

### `sftp_download`

Datei von einem entfernten SFTP-Server herunterladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SFTP-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SFTP-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SFTP-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `remotePath` | string | Ja | Pfad zur Datei auf dem entfernten Server |
| `encoding` | string | Nein | Ausgabe-Kodierung: utf-8 für Text, base64 für Binärdaten \(Standard: utf-8\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Download erfolgreich war |
| `fileName` | string | Name der heruntergeladenen Datei |
| `content` | string | Dateiinhalt \(Text oder base64-kodiert\) |
| `size` | number | Dateigröße in Bytes |
| `encoding` | string | Inhaltskodierung \(utf-8 oder base64\) |
| `message` | string | Statusmeldung des Vorgangs |

### `sftp_list`

Dateien und Verzeichnisse auf einem entfernten SFTP-Server auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SFTP-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SFTP-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SFTP-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `remotePath` | string | Ja | Verzeichnispfad auf dem entfernten Server |
| `detailed` | boolean | Nein | Detaillierte Dateiinformationen einschließen \(Größe, Berechtigungen, Änderungsdatum\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Vorgang erfolgreich war |
| `path` | string | Verzeichnispfad, der aufgelistet wurde |
| `entries` | json | Array von Verzeichniseinträgen mit Name, Typ, Größe, Berechtigungen, modifiedAt |
| `count` | number | Anzahl der Einträge im Verzeichnis |
| `message` | string | Statusmeldung des Vorgangs |

### `sftp_delete`

Löschen einer Datei oder eines Verzeichnisses auf einem entfernten SFTP-Server

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SFTP-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SFTP-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SFTP-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `remotePath` | string | Ja | Pfad zur Datei oder zum Verzeichnis, das gelöscht werden soll |
| `recursive` | boolean | Nein | Verzeichnisse rekursiv löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Löschen erfolgreich war |
| `deletedPath` | string | Pfad, der gelöscht wurde |
| `message` | string | Statusmeldung des Vorgangs |

### `sftp_mkdir`

Ein Verzeichnis auf einem entfernten SFTP-Server erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SFTP-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SFTP-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SFTP-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `remotePath` | string | Ja | Pfad für das neue Verzeichnis |
| `recursive` | boolean | Nein | Übergeordnete Verzeichnisse erstellen, falls sie nicht existieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Verzeichnis erfolgreich erstellt wurde |
| `createdPath` | string | Pfad des erstellten Verzeichnisses |
| `message` | string | Statusmeldung des Vorgangs |

## Hinweise

- Kategorie: `tools`
- Typ: `sftp`
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/sharepoint.mdx

```text
---
title: Sharepoint
description: Mit Seiten und Listen arbeiten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sharepoint"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration) ist eine kollaborative Plattform von Microsoft, die es Benutzern ermöglicht, interne Websites zu erstellen und zu verwalten, Dokumente zu teilen und Teamressourcen zu organisieren. Sie bietet eine leistungsstarke, flexible Lösung für die Erstellung digitaler Arbeitsumgebungen und die Optimierung des Inhaltsmanagements in Organisationen.

Mit SharePoint können Sie:

- **Team- und Kommunikationsseiten erstellen**: Richten Sie Seiten und Portale ein, um Zusammenarbeit, Ankündigungen und Inhaltsverteilung zu unterstützen
- **Inhalte organisieren und teilen**: Speichern Sie Dokumente, verwalten Sie Dateien und ermöglichen Sie Versionskontrolle mit sicheren Freigabefunktionen
- **Seiten anpassen**: Fügen Sie Textbereiche hinzu, um jede Seite an die Bedürfnisse Ihres Teams anzupassen
- **Auffindbarkeit verbessern**: Nutzen Sie Metadaten, Such- und Navigationswerkzeuge, damit Benutzer schnell finden, was sie benötigen
- **Sicher zusammenarbeiten**: Steuern Sie den Zugriff mit robusten Berechtigungseinstellungen und Microsoft 365-Integration

In Sim ermöglicht die SharePoint-Integration Ihren Agenten, SharePoint-Websites und -Seiten im Rahmen ihrer Workflows zu erstellen und darauf zuzugreifen. Dies ermöglicht automatisiertes Dokumentenmanagement, Wissensaustausch und die Erstellung von Arbeitsumgebungen ohne manuellen Aufwand. Agenten können neue Projektseiten erstellen, Dateien hoch- oder herunterladen und Ressourcen dynamisch organisieren, basierend auf Workflow-Eingaben. Durch die Verbindung von Sim mit SharePoint bringen Sie strukturierte Zusammenarbeit und Inhaltsmanagement in Ihre Automatisierungsabläufe – und geben Ihren Agenten die Möglichkeit, Teamaktivitäten zu koordinieren, wichtige Informationen bereitzustellen und eine einheitliche Informationsquelle in Ihrer Organisation zu pflegen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie SharePoint in den Workflow. Lesen/erstellen Sie Seiten, listen Sie Websites auf und arbeiten Sie mit Listen (lesen, erstellen, Elemente aktualisieren). Erfordert OAuth.

## Tools

### `sharepoint_create_page`

Eine neue Seite in einer SharePoint-Website erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Nein | Die ID der SharePoint-Website (interne Verwendung) |
| `siteSelector` | string | Nein | Wählen Sie die SharePoint-Website aus |
| `pageName` | string | Ja | Der Name der zu erstellenden Seite |
| `pageTitle` | string | Nein | Der Titel der Seite (standardmäßig der Seitenname, wenn nicht angegeben) |
| `pageContent` | string | Nein | Der Inhalt der Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `page` | object | Informationen zur erstellten SharePoint-Seite |

### `sharepoint_read_page`

Eine bestimmte Seite von einer SharePoint-Website lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | Nein | Wählen Sie die SharePoint-Website aus |
| `siteId` | string | Nein | Die ID der SharePoint-Website (interne Verwendung) |
| `pageId` | string | Nein | Die ID der zu lesenden Seite |
| `pageName` | string | Nein | Der Name der zu lesenden Seite (Alternative zur pageId) |
| `maxPages` | number | Nein | Maximale Anzahl der zurückzugebenden Seiten beim Auflisten aller Seiten (Standard: 10, max: 50) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `page` | object | Informationen über die SharePoint-Seite |

### `sharepoint_list_sites`

Details aller SharePoint-Websites auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | Nein | SharePoint-Website auswählen |
| `groupId` | string | Nein | Die Gruppen-ID für den Zugriff auf eine Gruppen-Teamwebsite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `site` | object | Informationen über die aktuelle SharePoint-Website |

### `sharepoint_create_list`

Eine neue Liste in einer SharePoint-Website erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Nein | Die ID der SharePoint-Website (interne Verwendung) |
| `siteSelector` | string | Nein | SharePoint-Website auswählen |
| `listDisplayName` | string | Ja | Anzeigename der zu erstellenden Liste |
| `listDescription` | string | Nein | Beschreibung der Liste |
| `listTemplate` | string | Nein | Listenvorlagenname (z.B. 'genericList') |
| `pageContent` | string | Nein | Optionales JSON von Spalten. Entweder ein Array von Spaltendefinitionen auf oberster Ebene oder ein Objekt mit \{ columns: \[...\] \}. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `list` | object | Informationen zur erstellten SharePoint-Liste |

### `sharepoint_get_list`

Metadaten (und optional Spalten/Elemente) für eine SharePoint-Liste abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | Nein | SharePoint-Website auswählen |
| `siteId` | string | Nein | Die ID der SharePoint-Website (interne Verwendung) |
| `listId` | string | Nein | Die ID der abzurufenden Liste |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `list` | object | Informationen über die SharePoint-Liste |

### `sharepoint_update_list`

Eigenschaften (Felder) eines SharePoint-Listenelements aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | Nein | SharePoint-Website auswählen |
| `siteId` | string | Nein | Die ID der SharePoint-Website (interne Verwendung) |
| `listId` | string | Nein | Die ID der Liste, die das Element enthält |
| `itemId` | string | Ja | Die ID des zu aktualisierenden Listenelements |
| `listItemFields` | object | Ja | Feldwerte, die im Listenelement aktualisiert werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `item` | object | Aktualisiertes SharePoint-Listenelement |

### `sharepoint_add_list_items`

Ein neues Element zu einer SharePoint-Liste hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | Nein | SharePoint-Website auswählen |
| `siteId` | string | Nein | Die ID der SharePoint-Website (interne Verwendung) |
| `listId` | string | Ja | Die ID der Liste, zu der das Element hinzugefügt werden soll |
| `listItemFields` | object | Ja | Feldwerte für das neue Listenelement |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `item` | object | Erstelltes SharePoint-Listenelement |

### `sharepoint_upload_file`

Dateien in eine SharePoint-Dokumentenbibliothek hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Nein | Die ID der SharePoint-Website |
| `driveId` | string | Nein | Die ID der Dokumentenbibliothek (Laufwerk). Wenn nicht angegeben, wird das Standardlaufwerk verwendet. |
| `folderPath` | string | Nein | Optionaler Ordnerpfad innerhalb der Dokumentenbibliothek (z.B. /Documents/Subfolder) |
| `fileName` | string | Nein | Optional: Überschreiben des hochgeladenen Dateinamens |
| `files` | file[] | Nein | Dateien, die nach SharePoint hochgeladen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `uploadedFiles` | array | Array von hochgeladenen Dateiobjekten |

## Hinweise

- Kategorie: `tools`
- Typ: `sharepoint`
```

--------------------------------------------------------------------------------

---[FILE: shopify.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/shopify.mdx

```text
---
title: Shopify
description: Verwalte Produkte, Bestellungen, Kunden und Lagerbestand in deinem Shopify-Shop
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="shopify"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Shopify](https://www.shopify.com/) ist eine führende E-Commerce-Plattform, die entwickelt wurde, um Händlern beim Aufbau, Betrieb und Wachstum ihrer Online-Shops zu helfen. Shopify macht es einfach, jeden Aspekt deines Shops zu verwalten, von Produkten und Lagerbestand bis hin zu Bestellungen und Kunden.

Mit Shopify in Sim können deine Agenten:

- **Produkte erstellen und verwalten**: Neue Produkte hinzufügen, Produktdetails aktualisieren und Produkte aus deinem Shop entfernen.
- **Bestellungen auflisten und abrufen**: Informationen über Kundenbestellungen erhalten, einschließlich Filterung und Bestellverwaltung.
- **Kunden verwalten**: Auf Kundendetails zugreifen und diese aktualisieren oder neue Kunden zu deinem Shop hinzufügen.
- **Lagerbestände anpassen**: Produktbestände programmatisch ändern, um deinen Lagerbestand genau zu halten.

Nutze Sims Shopify-Integration, um gängige Shop-Management-Workflows zu automatisieren – wie Lagerbestandssynchronisierung, Auftragsabwicklung oder Angebotsverwaltung – direkt aus deinen Automatisierungen heraus. Ermögliche deinen Agenten, auf alle deine Shop-Daten zuzugreifen, sie zu aktualisieren und zu organisieren, mit einfachen, programmatischen Tools.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriere Shopify in deinen Workflow. Verwalte Produkte, Bestellungen, Kunden und Lagerbestand. Erstelle, lese, aktualisiere und lösche Produkte. Liste und verwalte Bestellungen. Bearbeite Kundendaten und passe Lagerbestände an.

## Tools

### `shopify_create_product`

Erstelle ein neues Produkt in deinem Shopify-Shop

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Deine Shopify-Shop-Domain \(z.B. meinshop.myshopify.com\) |
| `title` | string | Ja | Produkttitel |
| `descriptionHtml` | string | Nein | Produktbeschreibung \(HTML\) |
| `vendor` | string | Nein | Produktanbieter/Marke |
| `productType` | string | Nein | Produkttyp/Kategorie |
| `tags` | array | Nein | Produkt-Tags |
| `status` | string | Nein | Produktstatus \(ACTIVE, DRAFT, ARCHIVED\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `product` | object | Das erstellte Produkt |

### `shopify_get_product`

Ein einzelnes Produkt anhand der ID aus Ihrem Shopify-Shop abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `productId` | string | Ja | Produkt-ID \(gid://shopify/Product/123456789\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `product` | object | Die Produktdetails |

### `shopify_list_products`

Produkte aus Ihrem Shopify-Shop mit optionaler Filterung auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `first` | number | Nein | Anzahl der zurückzugebenden Produkte \(Standard: 50, max: 250\) |
| `query` | string | Nein | Suchanfrage zum Filtern von Produkten \(z.B. "title:shirt" oder "vendor:Nike" oder "status:active"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `products` | array | Liste der Produkte |
| `pageInfo` | object | Paginierungsinformationen |

### `shopify_update_product`

Ein bestehendes Produkt in Ihrem Shopify-Shop aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `productId` | string | Ja | Zu aktualisierende Produkt-ID \(gid://shopify/Product/123456789\) |
| `title` | string | Nein | Neuer Produkttitel |
| `descriptionHtml` | string | Nein | Neue Produktbeschreibung \(HTML\) |
| `vendor` | string | Nein | Neuer Produktanbieter/Marke |
| `productType` | string | Nein | Neuer Produkttyp/Kategorie |
| `tags` | array | Nein | Neue Produkt-Tags |
| `status` | string | Nein | Neuer Produktstatus \(ACTIVE, DRAFT, ARCHIVED\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `product` | object | Das aktualisierte Produkt |

### `shopify_delete_product`

Ein Produkt aus Ihrem Shopify-Shop löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `productId` | string | Ja | Produkt-ID zum Löschen \(gid://shopify/Product/123456789\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deletedId` | string | Die ID des gelöschten Produkts |

### `shopify_get_order`

Eine einzelne Bestellung anhand der ID aus Ihrem Shopify-Shop abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `orderId` | string | Ja | Bestell-ID \(gid://shopify/Order/123456789\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Die Bestelldetails |

### `shopify_list_orders`

Bestellungen aus Ihrem Shopify-Shop mit optionaler Filterung auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `first` | number | Nein | Anzahl der zurückzugebenden Bestellungen \(Standard: 50, max: 250\) |
| `status` | string | Nein | Nach Bestellstatus filtern \(open, closed, cancelled, any\) |
| `query` | string | Nein | Suchanfrage zum Filtern von Bestellungen \(z.B. "financial_status:paid" oder "fulfillment_status:unfulfilled" oder "email:customer@example.com"\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `orders` | array | Liste der Bestellungen |
| `pageInfo` | object | Paginierungsinformationen |

### `shopify_update_order`

Aktualisieren einer bestehenden Bestellung in Ihrem Shopify-Shop (Hinweis, Tags, E-Mail)

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `orderId` | string | Ja | Zu aktualisierende Bestell-ID \(gid://shopify/Order/123456789\) |
| `note` | string | Nein | Neuer Bestellhinweis |
| `tags` | array | Nein | Neue Bestell-Tags |
| `email` | string | Nein | Neue Kunden-E-Mail für die Bestellung |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Die aktualisierte Bestellung |

### `shopify_cancel_order`

Stornieren einer Bestellung in Ihrem Shopify-Shop

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `orderId` | string | Ja | Zu stornierende Bestell-ID \(gid://shopify/Order/123456789\) |
| `reason` | string | Ja | Stornierungsgrund \(CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER\) |
| `notifyCustomer` | boolean | Nein | Ob der Kunde über die Stornierung benachrichtigt werden soll |
| `refund` | boolean | Nein | Ob die Bestellung erstattet werden soll |
| `restock` | boolean | Nein | Ob der Bestand wieder aufgefüllt werden soll |
| `staffNote` | string | Nein | Ein Hinweis zur Stornierung für Mitarbeiter |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Das Stornierungsergebnis |

### `shopify_create_customer`

Einen neuen Kunden in Ihrem Shopify-Shop erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `email` | string | Nein | E-Mail-Adresse des Kunden |
| `firstName` | string | Nein | Vorname des Kunden |
| `lastName` | string | Nein | Nachname des Kunden |
| `phone` | string | Nein | Telefonnummer des Kunden |
| `note` | string | Nein | Notiz zum Kunden |
| `tags` | array | Nein | Kundentags |
| `addresses` | array | Nein | Kundenanschriften |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `customer` | object | Der erstellte Kunde |

### `shopify_get_customer`

Einen einzelnen Kunden anhand der ID aus Ihrem Shopify-Shop abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain \(z.B. mystore.myshopify.com\) |
| `customerId` | string | Ja | Kunden-ID \(gid://shopify/Customer/123456789\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `customer` | object | Die Kundendetails |

### `shopify_list_customers`

Kunden aus deinem Shopify-Shop mit optionaler Filterung auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Deine Shopify-Shop-Domain \(z.B. meinshop.myshopify.com\) |
| `first` | number | Nein | Anzahl der zurückzugebenden Kunden \(Standard: 50, max: 250\) |
| `query` | string | Nein | Suchanfrage zum Filtern von Kunden \(z.B. "first_name:John" oder "last_name:Smith" oder "email:*@gmail.com" oder "tag:vip"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `customers` | array | Liste der Kunden |
| `pageInfo` | object | Paginierungsinformationen |

### `shopify_update_customer`

Einen bestehenden Kunden in deinem Shopify-Shop aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Deine Shopify-Shop-Domain \(z.B. meinshop.myshopify.com\) |
| `customerId` | string | Ja | Kunden-ID zum Aktualisieren \(gid://shopify/Customer/123456789\) |
| `email` | string | Nein | Neue E-Mail-Adresse des Kunden |
| `firstName` | string | Nein | Neuer Vorname des Kunden |
| `lastName` | string | Nein | Neuer Nachname des Kunden |
| `phone` | string | Nein | Neue Telefonnummer des Kunden |
| `note` | string | Nein | Neue Notiz über den Kunden |
| `tags` | array | Nein | Neue Kunden-Tags |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `customer` | object | Der aktualisierte Kunde |

### `shopify_delete_customer`

Einen Kunden aus Ihrem Shopify-Shop löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain (z.B. meinshop.myshopify.com) |
| `customerId` | string | Ja | Kunden-ID zum Löschen (gid://shopify/Customer/123456789) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deletedId` | string | Die ID des gelöschten Kunden |

### `shopify_list_inventory_items`

Bestandsartikel aus Ihrem Shopify-Shop auflisten. Verwenden Sie dies, um Bestandsartikel-IDs anhand der SKU zu finden.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain (z.B. meinshop.myshopify.com) |
| `first` | number | Nein | Anzahl der zurückzugebenden Bestandsartikel (Standard: 50, max: 250) |
| `query` | string | Nein | Suchanfrage zum Filtern von Bestandsartikeln (z.B. "sku:ABC123") |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `inventoryItems` | array | Liste der Bestandsartikel mit ihren IDs, SKUs und Lagerbeständen |
| `pageInfo` | object | Paginierungsinformationen |

### `shopify_get_inventory_level`

Bestandsmenge für eine Produktvariante an einem bestimmten Standort abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Shop-Domain (z.B. meinshop.myshopify.com) |
| `inventoryItemId` | string | Ja | Bestandsartikel-ID (gid://shopify/InventoryItem/123456789) |
| `locationId` | string | Nein | Standort-ID zum Filtern (optional) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | Die Details zum Bestandsniveau |

### `shopify_adjust_inventory`

Bestandsmenge für eine Produktvariante an einem bestimmten Standort anpassen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Store-Domain (z.B. mystore.myshopify.com) |
| `inventoryItemId` | string | Ja | Inventar-Element-ID (gid://shopify/InventoryItem/123456789) |
| `locationId` | string | Ja | Standort-ID (gid://shopify/Location/123456789) |
| `delta` | number | Ja | Anzahl der Anpassung (positiv für Erhöhung, negativ für Verringerung) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | Das Ergebnis der Bestandsanpassung |

### `shopify_list_locations`

Listet Bestandsstandorte aus Ihrem Shopify-Store auf. Verwenden Sie dies, um Standort-IDs zu finden, die für Bestandsoperationen benötigt werden.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Store-Domain (z.B. mystore.myshopify.com) |
| `first` | number | Nein | Anzahl der zurückzugebenden Standorte (Standard: 50, max: 250) |
| `includeInactive` | boolean | Nein | Ob deaktivierte Standorte einbezogen werden sollen (Standard: false) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `locations` | array | Liste der Standorte mit ihren IDs, Namen und Adressen |
| `pageInfo` | object | Paginierungsinformationen |

### `shopify_create_fulfillment`

Erstelle eine Fulfillment-Anfrage, um Bestellartikel als versendet zu markieren. Erfordert eine Fulfillment-Auftrags-ID (diese findest du in den Bestelldetails).

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Deine Shopify-Store-Domain \(z.B. meinshop.myshopify.com\) |
| `fulfillmentOrderId` | string | Ja | Die Fulfillment-Auftrags-ID \(z.B. gid://shopify/FulfillmentOrder/123456789\) |
| `trackingNumber` | string | Nein | Sendungsverfolgungsnummer |
| `trackingCompany` | string | Nein | Name des Versanddienstleisters \(z.B. UPS, FedEx, USPS, DHL\) |
| `trackingUrl` | string | Nein | URL zur Sendungsverfolgung |
| `notifyCustomer` | boolean | Nein | Ob eine Versandbestätigungs-E-Mail an den Kunden gesendet werden soll \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `fulfillment` | object | Das erstellte Fulfillment mit Tracking-Informationen und erfüllten Artikeln |

### `shopify_list_collections`

Liste Produktkollektionen aus deinem Shopify-Shop auf. Filtere nach Titel, Typ (benutzerdefiniert/smart) oder Handle.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Deine Shopify-Store-Domain \(z.B. meinshop.myshopify.com\) |
| `first` | number | Nein | Anzahl der zurückzugebenden Kollektionen \(Standard: 50, max: 250\) |
| `query` | string | Nein | Suchanfrage zum Filtern von Kollektionen \(z.B. "title:Sommer" oder "collection_type:smart"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `collections` | array | Liste der Kollektionen mit ihren IDs, Titeln und Produktanzahlen |
| `pageInfo` | object | Paginierungsinformationen |

### `shopify_get_collection`

Rufen Sie eine bestimmte Kollektion anhand ihrer ID ab, einschließlich ihrer Produkte. Verwenden Sie dies, um Produkte innerhalb einer Kollektion abzurufen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Ja | Ihre Shopify-Store-Domain \(z.B. mystore.myshopify.com\) |
| `collectionId` | string | Ja | Die Kollektions-ID \(z.B. gid://shopify/Collection/123456789\) |
| `productsFirst` | number | Nein | Anzahl der Produkte, die aus dieser Kollektion zurückgegeben werden sollen \(Standard: 50, max: 250\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `collection` | object | Die Kollektionsdetails einschließlich ihrer Produkte |

## Hinweise

- Kategorie: `tools`
- Typ: `shopify`
```

--------------------------------------------------------------------------------

````
