---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 48
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 48 of 933)

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

---[FILE: sqs.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/sqs.mdx

```text
---
title: Amazon SQS
description: Verbindung zu Amazon SQS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sqs"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) ist ein vollständig verwalteter Message-Queuing-Dienst, der es ermöglicht, Microservices, verteilte Systeme und serverlose Anwendungen zu entkoppeln und zu skalieren. SQS beseitigt die Komplexität und den Aufwand, die mit der Verwaltung und dem Betrieb von nachrichtenorientierter Middleware verbunden sind, und ermöglicht Entwicklern, sich auf differenzierende Arbeit zu konzentrieren.

Mit Amazon SQS können Sie:

- **Nachrichten senden**: Veröffentlichen Sie Nachrichten in Warteschlangen für asynchrone Verarbeitung
- **Anwendungen entkoppeln**: Ermöglichen Sie eine lose Kopplung zwischen Komponenten Ihres Systems
- **Workloads skalieren**: Bewältigen Sie variable Arbeitslasten ohne Bereitstellung von Infrastruktur
- **Zuverlässigkeit gewährleisten**: Eingebaute Redundanz und hohe Verfügbarkeit
- **FIFO-Warteschlangen unterstützen**: Strikte Nachrichtenreihenfolge und genau einmalige Verarbeitung beibehalten

In Sim ermöglicht die SQS-Integration Ihren Agenten, Nachrichten sicher und programmatisch an Amazon SQS-Warteschlangen zu senden. Unterstützte Operationen umfassen:

- **Nachricht senden**: Senden Sie Nachrichten an SQS-Warteschlangen mit optionaler Nachrichtengruppen-ID und Deduplizierungs-ID für FIFO-Warteschlangen

Diese Integration ermöglicht es Ihren Agenten, Workflows zum Senden von Nachrichten ohne manuelle Eingriffe zu automatisieren. Durch die Verbindung von Sim mit Amazon SQS können Sie Agenten erstellen, die Nachrichten innerhalb Ihrer Workflows in Warteschlangen veröffentlichen – alles ohne Verwaltung der Warteschlangen-Infrastruktur oder Verbindungen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Amazon SQS in den Workflow. Kann Nachrichten an SQS-Warteschlangen senden.

## Tools

### `sqs_send`

Eine Nachricht an eine Amazon SQS-Warteschlange senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `queueUrl` | string | Ja | Queue-URL |
| `data` | object | Ja | Zu sendender Nachrichtentext |
| `messageGroupId` | string | Nein | Nachrichtengruppen-ID (optional) |
| `messageDeduplicationId` | string | Nein | Nachrichtendeduplizierungs-ID (optional) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `id` | string | Nachrichten-ID |

## Hinweise

- Kategorie: `tools`
- Typ: `sqs`
```

--------------------------------------------------------------------------------

---[FILE: ssh.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/ssh.mdx

```text
---
title: SSH
description: Verbindung zu Remote-Servern über SSH herstellen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ssh"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[SSH (Secure Shell)](https://en.wikipedia.org/wiki/Secure_Shell) ist ein weit verbreitetes Protokoll für die sichere Verbindung zu Remote-Servern, das es ermöglicht, Befehle auszuführen, Dateien zu übertragen und Systeme über verschlüsselte Kanäle zu verwalten.

Mit SSH-Unterstützung in Sim können Ihre Agenten:

- **Remote-Befehle ausführen**: Shell-Befehle auf jedem SSH-zugänglichen Server ausführen
- **Skripte hochladen und ausführen**: Einfaches Übertragen und Ausführen von mehrzeiligen Skripten für erweiterte Automatisierung
- **Dateien sicher übertragen**: Hoch- und Herunterladen von Dateien als Teil Ihrer Workflows (demnächst oder per Befehl)
- **Serververwaltung automatisieren**: Programmatische Durchführung von Updates, Wartung, Überwachung, Bereitstellungen und Konfigurationsaufgaben
- **Flexible Authentifizierung nutzen**: Verbindung mit Passwort- oder Private-Key-Authentifizierung, einschließlich Unterstützung für verschlüsselte Schlüssel

Die folgenden Sim SSH-Tools ermöglichen es Ihren Agenten, mit Servern als Teil größerer Automatisierungen zu interagieren:

- `ssh_execute_command`: Führt einen einzelnen Shell-Befehl remote aus und erfasst Ausgabe, Status und Fehler.
- `ssh_execute_script`: Lädt ein vollständiges mehrzeiliges Skript hoch und führt es auf dem Remote-System aus.
- (Weitere Tools wie Dateiübertragung kommen in Kürze.)

Durch die Integration von SSH in Ihre Agenten-Workflows können Sie sicheren Zugriff, Remote-Operationen und Server-Orchestrierung automatisieren – und so DevOps, IT-Automatisierung und benutzerdefinierte Remote-Verwaltung rationalisieren, alles innerhalb von Sim.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Führen Sie Befehle aus, übertragen Sie Dateien und verwalten Sie Remote-Server über SSH. Unterstützt Passwort- und Private-Key-Authentifizierung für sicheren Serverzugriff.

## Tools

### `ssh_execute_command`

Einen Shell-Befehl auf einem Remote-SSH-Server ausführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein Private Key verwendet wird\) |
| `privateKey` | string | Nein | Private Key für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten Private Key |
| `command` | string | Ja | Shell-Befehl, der auf dem Remote-Server ausgeführt werden soll |
| `workingDirectory` | string | Nein | Arbeitsverzeichnis für die Befehlsausführung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `stdout` | string | Standardausgabe des Befehls |
| `stderr` | string | Standardfehlerausgabe |
| `exitCode` | number | Exit-Code des Befehls |
| `success` | boolean | Ob der Befehl erfolgreich war (Exit-Code 0) |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_execute_script`

Ein mehrzeiliges Skript auf einem entfernten SSH-Server hochladen und ausführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port (Standard: 22) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung (falls kein privater Schlüssel verwendet wird) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung (OpenSSH-Format) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `script` | string | Ja | Skriptinhalt zur Ausführung (bash, python, etc.) |
| `interpreter` | string | Nein | Skript-Interpreter (Standard: /bin/bash) |
| `workingDirectory` | string | Nein | Arbeitsverzeichnis für die Skriptausführung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `stdout` | string | Standardausgabe des Skripts |
| `stderr` | string | Standardfehlerausgabe |
| `exitCode` | number | Exit-Code des Skripts |
| `success` | boolean | Ob das Skript erfolgreich war (Exit-Code 0) |
| `scriptPath` | string | Temporärer Pfad, wohin das Skript hochgeladen wurde |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_check_command_exists`

Überprüfen, ob ein Befehl/Programm auf dem entfernten SSH-Server existiert

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `commandName` | string | Ja | Zu überprüfender Befehlsname \(z.B. docker, git, python3\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `commandExists` | boolean | Ob der Befehl existiert |
| `commandPath` | string | Vollständiger Pfad zum Befehl \(falls gefunden\) |
| `version` | string | Versionsinformation des Befehls \(falls zutreffend\) |
| `message` | string | Statusmeldung der Operation |

### `ssh_upload_file`

Eine Datei auf einen entfernten SSH-Server hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `fileContent` | string | Ja | Hochzuladender Dateiinhalt \(base64-kodiert für Binärdateien\) |
| `fileName` | string | Ja | Name der hochzuladenden Datei |
| `remotePath` | string | Ja | Zielpfad auf dem entfernten Server |
| `permissions` | string | Nein | Dateiberechtigungen \(z.B. 0644\) |
| `overwrite` | boolean | Nein | Ob bestehende Dateien überschrieben werden sollen \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `uploaded` | boolean | Ob die Datei erfolgreich hochgeladen wurde |
| `remotePath` | string | Endgültiger Pfad auf dem Remote-Server |
| `size` | number | Dateigröße in Bytes |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_download_file`

Eine Datei von einem Remote-SSH-Server herunterladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `remotePath` | string | Ja | Pfad der Datei auf dem Remote-Server |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `downloaded` | boolean | Ob die Datei erfolgreich heruntergeladen wurde |
| `fileContent` | string | Dateiinhalt \(base64-kodiert für Binärdateien\) |
| `fileName` | string | Name der heruntergeladenen Datei |
| `remotePath` | string | Quellpfad auf dem Remote-Server |
| `size` | number | Dateigröße in Bytes |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_list_directory`

Dateien und Verzeichnisse in einem Remote-Verzeichnis auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `path` | string | Ja | Remote-Verzeichnispfad zum Auflisten |
| `detailed` | boolean | Nein | Dateidetails einschließen \(Größe, Berechtigungen, Änderungsdatum\) |
| `recursive` | boolean | Nein | Unterverzeichnisse rekursiv auflisten \(Standard: false\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `entries` | array | Array von Datei- und Verzeichniseinträgen |

### `ssh_check_file_exists`

Überprüfen, ob eine Datei oder ein Verzeichnis auf dem Remote-SSH-Server existiert

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `path` | string | Ja | Remote-Datei- oder Verzeichnispfad zur Überprüfung |
| `type` | string | Nein | Erwarteter Typ: Datei, Verzeichnis oder beliebig \(Standard: beliebig\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `exists` | boolean | Ob der Pfad existiert |
| `type` | string | Typ des Pfads (Datei, Verzeichnis, Symlink, nicht_gefunden) |
| `size` | number | Dateigröße, wenn es eine Datei ist |
| `permissions` | string | Dateiberechtigungen (z.B. 0755) |
| `modified` | string | Zeitstempel der letzten Änderung |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_create_directory`

Erstellt ein Verzeichnis auf dem entfernten SSH-Server

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port (Standard: 22) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung (wenn kein privater Schlüssel verwendet wird) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung (OpenSSH-Format) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `path` | string | Ja | Verzeichnispfad zum Erstellen |
| `recursive` | boolean | Nein | Übergeordnete Verzeichnisse erstellen, wenn sie nicht existieren (Standard: true) |
| `permissions` | string | Nein | Verzeichnisberechtigungen (Standard: 0755) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `created` | boolean | Ob das Verzeichnis erfolgreich erstellt wurde |
| `remotePath` | string | Erstellter Verzeichnispfad |
| `alreadyExists` | boolean | Ob das Verzeichnis bereits existierte |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_delete_file`

Löschen einer Datei oder eines Verzeichnisses vom entfernten SSH-Server

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `path` | string | Ja | Zu löschender Pfad |
| `recursive` | boolean | Nein | Verzeichnisse rekursiv löschen \(Standard: false\) |
| `force` | boolean | Nein | Löschen ohne Bestätigung erzwingen \(Standard: false\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob der Pfad erfolgreich gelöscht wurde |
| `remotePath` | string | Gelöschter Pfad |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_move_rename`

Verschieben oder umbenennen einer Datei oder eines Verzeichnisses auf dem entfernten SSH-Server

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `sourcePath` | string | Ja | Aktueller Pfad der Datei oder des Verzeichnisses |
| `destinationPath` | string | Ja | Neuer Pfad für die Datei oder das Verzeichnis |
| `overwrite` | boolean | Nein | Ziel überschreiben, falls es existiert \(Standard: false\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `moved` | boolean | Ob der Vorgang erfolgreich war |
| `sourcePath` | string | Ursprünglicher Pfad |
| `destinationPath` | string | Neuer Pfad |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_get_system_info`

Systeminformationen vom entfernten SSH-Server abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `hostname` | string | Server-Hostname |
| `os` | string | Betriebssystem \(z.B. Linux, Darwin\) |
| `architecture` | string | CPU-Architektur \(z.B. x64, arm64\) |
| `uptime` | number | Systemlaufzeit in Sekunden |
| `memory` | json | Speicherinformationen \(gesamt, frei, verwendet\) |
| `diskSpace` | json | Festplattenplatzinformationen \(gesamt, frei, verwendet\) |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_read_file_content`

Inhalt einer entfernten Datei lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `path` | string | Ja | Pfad zur entfernten Datei, die gelesen werden soll |
| `encoding` | string | Nein | Dateikodierung \(Standard: utf-8\) |
| `maxSize` | number | Nein | Maximale zu lesende Dateigröße in MB \(Standard: 10\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Dateiinhalt als Zeichenfolge |
| `size` | number | Dateigröße in Bytes |
| `lines` | number | Anzahl der Zeilen in der Datei |
| `remotePath` | string | Pfad zur entfernten Datei |
| `message` | string | Statusmeldung des Vorgangs |

### `ssh_write_file_content`

Inhalt in eine entfernte Datei schreiben oder anhängen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `host` | string | Ja | SSH-Server-Hostname oder IP-Adresse |
| `port` | number | Ja | SSH-Server-Port \(Standard: 22\) |
| `username` | string | Ja | SSH-Benutzername |
| `password` | string | Nein | Passwort für die Authentifizierung \(wenn kein privater Schlüssel verwendet wird\) |
| `privateKey` | string | Nein | Privater Schlüssel für die Authentifizierung \(OpenSSH-Format\) |
| `passphrase` | string | Nein | Passphrase für verschlüsselten privaten Schlüssel |
| `path` | string | Ja | Pfad zur entfernten Datei, in die geschrieben werden soll |
| `content` | string | Ja | Inhalt, der in die Datei geschrieben werden soll |
| `mode` | string | Nein | Schreibmodus: überschreiben, anhängen oder erstellen \(Standard: überschreiben\) |
| `permissions` | string | Nein | Dateiberechtigungen \(z.B. 0644\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `written` | boolean | Ob die Datei erfolgreich geschrieben wurde |
| `remotePath` | string | Dateipfad |
| `size` | number | Endgültige Dateigröße in Bytes |
| `message` | string | Statusmeldung der Operation |

## Hinweise

- Kategorie: `tools`
- Typ: `ssh`
```

--------------------------------------------------------------------------------

---[FILE: stagehand.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/stagehand.mdx

```text
---
title: Stagehand
description: Web-Automatisierung und Datenextraktion
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stagehand"
  color="#FFC83C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Stagehand](https://stagehand.com) ist ein Tool, das sowohl die Extraktion strukturierter Daten aus Webseiten als auch autonome Web-Automatisierung mittels Browserbase und modernen LLMs (OpenAI oder Anthropic) ermöglicht.

Stagehand bietet zwei Hauptfunktionen in Sim:

- **stagehand_extract**: Extrahiert strukturierte Daten von einer einzelnen Webseite. Sie geben an, was Sie möchten (ein Schema), und die KI ruft die Daten in dieser Form von der Seite ab und analysiert sie. Dies eignet sich am besten zum Extrahieren von Listen, Feldern oder Objekten, wenn Sie genau wissen, welche Informationen Sie benötigen und woher Sie diese bekommen.

- **stagehand_agent**: Führt einen autonomen Web-Agenten aus, der in der Lage ist, mehrstufige Aufgaben zu erledigen, mit Elementen zu interagieren, zwischen Seiten zu navigieren und strukturierte Ergebnisse zurückzugeben. Dies ist viel flexibler: der Agent kann Dinge wie Anmeldungen, Suchen, Ausfüllen von Formularen, Sammeln von Daten aus verschiedenen Quellen durchführen und ein Endergebnis gemäß einem angeforderten Schema ausgeben.

**Wesentliche Unterschiede:**

- *stagehand_extract* ist ein schneller “extrahiere diese Daten von dieser Seite” Vorgang. Es funktioniert am besten für direkte, einstufige Extraktionsaufgaben.
- *stagehand_agent* führt komplexe, mehrstufige autonome Aufgaben im Web aus — wie Navigation, Suche oder sogar Transaktionen — und kann Daten dynamisch gemäß Ihren Anweisungen und einem optionalen Schema extrahieren.

In der Praxis verwenden Sie **stagehand_extract**, wenn Sie wissen, was Sie wollen und woher, und **stagehand_agent**, wenn Sie einen Bot benötigen, der interaktive Arbeitsabläufe durchdenkt und ausführt.

Durch die Integration von Stagehand können Sim-Agenten die Datenerfassung, -analyse und Workflow-Ausführung im Web automatisieren: Datenbanken aktualisieren, Informationen organisieren und benutzerdefinierte Berichte erstellen — nahtlos und autonom.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Stagehand in den Workflow. Kann strukturierte Daten aus Webseiten extrahieren oder einen autonomen Agenten ausführen, um Aufgaben zu erledigen.

## Tools

### `stagehand_extract`

Extrahieren Sie strukturierte Daten von einer Webseite mit Stagehand

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | URL der Webseite, aus der Daten extrahiert werden sollen |
| `instruction` | string | Ja | Anweisungen für die Extraktion |
| `provider` | string | Nein | Zu verwendender KI-Anbieter: openai oder anthropic |
| `apiKey` | string | Ja | API-Schlüssel für den ausgewählten Anbieter |
| `schema` | json | Ja | JSON-Schema, das die Struktur der zu extrahierenden Daten definiert |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | object | Extrahierte strukturierte Daten, die dem bereitgestellten Schema entsprechen |

### `stagehand_agent`

Führen Sie einen autonomen Web-Agenten aus, um Aufgaben zu erledigen und strukturierte Daten zu extrahieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `startUrl` | string | Ja | URL der Webseite, auf der der Agent starten soll |
| `task` | string | Ja | Die zu erledigende Aufgabe oder das zu erreichende Ziel auf der Website |
| `variables` | json | Nein | Optionale Variablen, die in der Aufgabe ersetzt werden sollen (Format: \{key: value\}). Referenzierung in der Aufgabe mit %key% |
| `format` | string | Nein | Keine Beschreibung |
| `provider` | string | Nein | Zu verwendender KI-Anbieter: openai oder anthropic |
| `apiKey` | string | Ja | API-Schlüssel für den ausgewählten Anbieter |
| `outputSchema` | json | Nein | Optionales JSON-Schema, das die Struktur der Daten definiert, die der Agent zurückgeben soll |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `agentResult` | object | Ergebnis der Stagehand-Agent-Ausführung |

## Hinweise

- Kategorie: `tools`
- Typ: `stagehand`
```

--------------------------------------------------------------------------------

````
