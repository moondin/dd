---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 21
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 21 of 933)

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

---[FILE: datadog.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/datadog.mdx

```text
---
title: Datadog
description: Überwachen Sie Infrastruktur, Anwendungen und Logs mit Datadog
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="datadog"
  color="#632CA6"
/>

{/* MANUAL-CONTENT-START:intro */}
[Datadog](https://datadoghq.com/) ist eine umfassende Überwachungs- und Analyseplattform für Infrastruktur, Anwendungen, Logs und mehr. Sie ermöglicht Organisationen Echtzeit-Einblicke in den Zustand und die Leistung von Systemen, erkennt Anomalien und automatisiert die Reaktion auf Vorfälle.

Mit Datadog können Sie:

- **Metriken überwachen**: Sammeln, visualisieren und analysieren Sie Metriken von Servern, Cloud-Diensten und benutzerdefinierten Anwendungen.
- **Zeitreihendaten abfragen**: Führen Sie erweiterte Abfragen zu Leistungsmetriken für Trendanalysen und Berichte durch.
- **Monitore und Ereignisse verwalten**: Richten Sie Monitore ein, um Probleme zu erkennen, Warnungen auszulösen und Ereignisse für die Beobachtbarkeit zu erstellen.
- **Ausfallzeiten verwalten**: Planen und programmieren Sie geplante Ausfallzeiten, um Warnungen während der Wartung zu unterdrücken.
- **Logs und Traces analysieren** *(mit zusätzlicher Einrichtung in Datadog)*: Zentralisieren und untersuchen Sie Logs oder verteilte Traces für eine tiefere Fehlerbehebung.

Die Datadog-Integration von Sim ermöglicht es Ihren Agenten, diese Vorgänge zu automatisieren und programmatisch mit Ihrem Datadog-Konto zu interagieren. Verwenden Sie sie, um benutzerdefinierte Metriken zu übermitteln, Zeitreihendaten abzufragen, Monitore zu verwalten, Ereignisse zu erstellen und Ihre Überwachungsabläufe direkt innerhalb von Sim-Automatisierungen zu optimieren.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Datadog-Überwachung in Workflows. Übermitteln Sie Metriken, verwalten Sie Monitore, fragen Sie Logs ab, erstellen Sie Ereignisse, handhaben Sie Ausfallzeiten und mehr.

## Tools

### `datadog_submit_metrics`

Übermitteln Sie benutzerdefinierte Metriken an Datadog. Verwenden Sie diese zur Verfolgung der Anwendungsleistung, Geschäftsmetriken oder benutzerdefinierten Überwachungsdaten.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `series` | string | Ja | JSON-Array von Metrikserien zur Übermittlung. Jede Serie sollte den Metriknamen, Typ \(gauge/rate/count\), Punkte \(Zeitstempel/Wert-Paare\) und optionale Tags enthalten. |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `site` | string | Nein | Datadog-Site/Region \(Standard: datadoghq.com\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Metriken erfolgreich übermittelt wurden |
| `errors` | array | Alle Fehler, die während der Übermittlung aufgetreten sind |

### `datadog_query_timeseries`

Abfrage von Metrik-Zeitreihendaten aus Datadog. Verwenden Sie dies zur Analyse von Trends, zur Erstellung von Berichten oder zum Abrufen von Metrikwerten.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Datadog-Metrikabfrage (z.B. "avg:system.cpu.user\{*\}") |
| `from` | number | Ja | Startzeit als Unix-Zeitstempel in Sekunden |
| `to` | number | Ja | Endzeit als Unix-Zeitstempel in Sekunden |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog-Site/Region (Standard: datadoghq.com) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `series` | array | Array von Zeitreihendaten mit Metrikname, Tags und Datenpunkten |
| `status` | string | Abfragestatus |

### `datadog_create_event`

Veröffentlichen Sie ein Ereignis im Datadog-Ereignisstrom. Verwenden Sie dies für Deployment-Benachrichtigungen, Warnungen oder andere wichtige Vorkommnisse.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Ereignistitel |
| `text` | string | Ja | Ereignistext/Beschreibung. Unterstützt Markdown. |
| `alertType` | string | Nein | Warnungstyp: error, warning, info, success, user_update, recommendation oder snapshot |
| `priority` | string | Nein | Ereignispriorität: normal oder low |
| `host` | string | Nein | Hostname, der mit diesem Ereignis verknüpft werden soll |
| `tags` | string | Nein | Kommagetrennte Liste von Tags (z.B. "env:production,service:api") |
| `aggregationKey` | string | Nein | Schlüssel zum Zusammenfassen von Ereignissen |
| `sourceTypeName` | string | Nein | Quelltypname für das Ereignis |
| `dateHappened` | number | Nein | Unix-Zeitstempel, wann das Ereignis aufgetreten ist (standardmäßig jetzt) |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `site` | string | Nein | Datadog-Site/Region (Standard: datadoghq.com) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `event` | object | Die Details des erstellten Events |

### `datadog_create_monitor`

Erstellen Sie einen neuen Monitor/Alert in Datadog. Monitore können Metriken, Service-Checks, Events und mehr überwachen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `name` | string | Ja | Name des Monitors |
| `type` | string | Ja | Monitor-Typ: metric alert, service check, event alert, process alert, log alert, query alert, composite, synthetics alert, slo alert |
| `query` | string | Ja | Monitor-Abfrage (z.B. `avg(last_5m):avg:system.cpu.idle{*} < 20`) |
| `message` | string | Nein | Nachricht, die bei Benachrichtigungen enthalten sein soll. Kann @-Erwähnungen und Markdown enthalten. |
| `tags` | string | Nein | Kommagetrennte Liste von Tags |
| `priority` | number | Nein | Monitor-Priorität (1-5, wobei 1 die höchste ist) |
| `options` | string | Nein | JSON-String mit Monitor-Optionen (Schwellenwerte, notify_no_data, renotify_interval, usw.) |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog Site/Region (Standard: datadoghq.com) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `monitor` | object | Die Details des erstellten Monitors |

### `datadog_get_monitor`

Rufen Sie Details eines bestimmten Monitors anhand seiner ID ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | Ja | Die ID des abzurufenden Monitors |
| `groupStates` | string | Nein | Kommagetrennte Gruppenzustände, die einbezogen werden sollen: alert, warn, no data, ok |
| `withDowntimes` | boolean | Nein | Downtime-Daten mit dem Monitor einbeziehen |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog Site/Region (Standard: datadoghq.com) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `monitor` | object | Die Monitor-Details |

### `datadog_list_monitors`

Listet alle Monitore in Datadog auf, mit optionaler Filterung nach Namen, Tags oder Status.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `groupStates` | string | Nein | Kommagetrennte Gruppenstatus zur Filterung: alert, warn, no data, ok |
| `name` | string | Nein | Filtert Monitore nach Namen \(teilweise Übereinstimmung\) |
| `tags` | string | Nein | Kommagetrennte Liste von Tags zur Filterung |
| `monitorTags` | string | Nein | Kommagetrennte Liste von Monitor-Tags zur Filterung |
| `withDowntimes` | boolean | Nein | Downtime-Daten mit Monitoren einbeziehen |
| `page` | number | Nein | Seitennummer für Paginierung \(0-indiziert\) |
| `pageSize` | number | Nein | Anzahl der Monitore pro Seite \(max. 1000\) |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog Site/Region \(Standard: datadoghq.com\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `monitors` | array | Liste der Monitore |

### `datadog_mute_monitor`

Stummschalten eines Monitors, um Benachrichtigungen vorübergehend zu unterdrücken.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | Ja | Die ID des stummzuschaltenden Monitors |
| `scope` | string | Nein | Bereich zum Stummschalten \(z.B. "host:myhost"\). Wenn nicht angegeben, werden alle Bereiche stummgeschaltet. |
| `end` | number | Nein | Unix-Zeitstempel, wann die Stummschaltung enden soll. Wenn nicht angegeben, wird auf unbestimmte Zeit stummgeschaltet. |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog Site/Region \(Standard: datadoghq.com\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Gibt an, ob der Monitor erfolgreich stummgeschaltet wurde |

### `datadog_query_logs`

Suchen und abrufen von Logs aus Datadog. Verwenden Sie dies zur Fehlerbehebung, Analyse oder Überwachung.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Log-Suchabfrage (z.B. "service:web-app status:error") |
| `from` | string | Ja | Startzeit im ISO-8601-Format oder relativ (z.B. "now-1h") |
| `to` | string | Ja | Endzeit im ISO-8601-Format oder relativ (z.B. "now") |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Logs (Standard: 50, max: 1000) |
| `sort` | string | Nein | Sortierreihenfolge: timestamp (älteste zuerst) oder -timestamp (neueste zuerst) |
| `indexes` | string | Nein | Kommagetrennte Liste der zu durchsuchenden Log-Indizes |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog Site/Region (Standard: datadoghq.com) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `logs` | array | Liste der Log-Einträge |

### `datadog_send_logs`

Senden von Log-Einträgen an Datadog für zentralisiertes Logging und Analyse.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `logs` | string | Ja | JSON-Array von Log-Einträgen. Jeder Eintrag sollte message und optional ddsource, ddtags, hostname, service enthalten. |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `site` | string | Nein | Datadog Site/Region (Standard: datadoghq.com) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Logs erfolgreich gesendet wurden |

### `datadog_create_downtime`

Planen Sie eine Ausfallzeit, um Monitor-Benachrichtigungen während Wartungsfenstern zu unterdrücken.

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `scope` | string | Yes | Bereich, auf den die Ausfallzeit angewendet werden soll (z.B. "host:myhost", "env:production" oder "*" für alle) |
| `message` | string | No | Nachricht, die während der Ausfallzeit angezeigt werden soll |
| `start` | number | No | Unix-Zeitstempel für den Beginn der Ausfallzeit (standardmäßig jetzt) |
| `end` | number | No | Unix-Zeitstempel für das Ende der Ausfallzeit |
| `timezone` | string | No | Zeitzone für die Ausfallzeit (z.B. "America/New_York") |
| `monitorId` | string | No | Spezifische Monitor-ID, die stummgeschaltet werden soll |
| `monitorTags` | string | No | Kommagetrennte Monitor-Tags zur Übereinstimmung (z.B. "team:backend,priority:high") |
| `muteFirstRecoveryNotification` | boolean | No | Die erste Wiederherstellungsbenachrichtigung stummschalten |
| `apiKey` | string | Yes | Datadog API-Schlüssel |
| `applicationKey` | string | Yes | Datadog Anwendungsschlüssel |
| `site` | string | No | Datadog Site/Region (Standard: datadoghq.com) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `downtime` | object | Die Details der erstellten Ausfallzeit |

### `datadog_list_downtimes`

Listet alle geplanten Ausfallzeiten in Datadog auf.

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `currentOnly` | boolean | No | Nur aktuell aktive Ausfallzeiten zurückgeben |
| `monitorId` | string | No | Nach Monitor-ID filtern |
| `apiKey` | string | Yes | Datadog API-Schlüssel |
| `applicationKey` | string | Yes | Datadog Anwendungsschlüssel |
| `site` | string | No | Datadog Site/Region (Standard: datadoghq.com) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `downtimes` | array | Liste der Ausfallzeiten |

### `datadog_cancel_downtime`

Eine geplante Ausfallzeit abbrechen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `downtimeId` | string | Ja | Die ID der abzubrechenden Ausfallzeit |
| `apiKey` | string | Ja | Datadog API-Schlüssel |
| `applicationKey` | string | Ja | Datadog Anwendungsschlüssel |
| `site` | string | Nein | Datadog Site/Region \(Standard: datadoghq.com\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Ausfallzeit erfolgreich abgebrochen wurde |

## Hinweise

- Kategorie: `tools`
- Typ: `datadog`
```

--------------------------------------------------------------------------------

---[FILE: discord.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/discord.mdx

```text
---
title: Discord
description: Mit Discord interagieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="discord"
  color="#5865F2"
/>

{/* MANUAL-CONTENT-START:intro */}
[Discord](https://discord.com) ist eine leistungsstarke Kommunikationsplattform, die es dir ermöglicht, dich mit Freunden, Communities und Teams zu verbinden. Sie bietet eine Reihe von Funktionen für die Teamzusammenarbeit, darunter Textkanäle, Sprachkanäle und Videoanrufe.

Mit einem Discord-Account oder -Bot kannst du:

- **Nachrichten senden**: Nachrichten an einen bestimmten Kanal senden
- **Nachrichten abrufen**: Nachrichten aus einem bestimmten Kanal abrufen
- **Server abrufen**: Informationen über einen bestimmten Server abrufen
- **Benutzer abrufen**: Informationen über einen bestimmten Benutzer abrufen

In Sim ermöglicht die Discord-Integration deinen Agenten den Zugriff auf die Discord-Server deiner Organisation. Agenten können Informationen aus Discord-Kanälen abrufen, nach bestimmten Benutzern suchen, Serverinformationen erhalten und Nachrichten senden. Dies ermöglicht deinen Workflows, sich mit deinen Discord-Communities zu integrieren, Benachrichtigungen zu automatisieren und interaktive Erlebnisse zu schaffen.

> **Wichtig:** Um Nachrichteninhalte lesen zu können, benötigt dein Discord-Bot die Berechtigung "Message Content Intent" im Discord Developer Portal. Ohne diese Berechtigung erhältst du zwar weiterhin Nachrichten-Metadaten, aber das Inhaltsfeld wird leer angezeigt.

Discord-Komponenten in Sim verwenden effizientes Lazy Loading und rufen Daten nur bei Bedarf ab, um API-Aufrufe zu minimieren und Rate-Limiting zu verhindern. Die Token-Aktualisierung erfolgt automatisch im Hintergrund, um deine Verbindung aufrechtzuerhalten.

### Einrichtung deines Discord-Bots

1. Gehe zum [Discord Developer Portal](https://discord.com/developers/applications)
2. Erstelle eine neue Anwendung und navigiere zum "Bot"-Tab
3. Erstelle einen Bot und kopiere deinen Bot-Token
4. Aktiviere unter "Privileged Gateway Intents" den **Message Content Intent**, um Nachrichteninhalte lesen zu können
5. Lade deinen Bot mit den entsprechenden Berechtigungen auf deine Server ein
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Umfassende Discord-Integration: Nachrichten, Threads, Kanäle, Rollen, Mitglieder, Einladungen und Webhooks.

## Tools

### `discord_send_message`

Eine Nachricht an einen Discord-Kanal senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, an die die Nachricht gesendet werden soll |
| `content` | string | Nein | Der Textinhalt der Nachricht |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `files` | file[] | Nein | Dateien, die an die Nachricht angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Discord-Nachrichtendaten |

### `discord_get_messages`

Nachrichten aus einem Discord-Kanal abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, von der Nachrichten abgerufen werden sollen |
| `limit` | number | Nein | Maximale Anzahl der abzurufenden Nachrichten \(Standard: 10, max: 100\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Container für Nachrichtendaten |

### `discord_get_server`

Informationen über einen Discord-Server (Guild) abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Discord-Server \(Guild\) Informationen |

### `discord_get_user`

Informationen über einen Discord-Benutzer abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Discord-Bot-Token zur Authentifizierung |
| `userId` | string | Ja | Die Discord-Benutzer-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Discord-Benutzerinformationen |

### `discord_edit_message`

Eine bestehende Nachricht in einem Discord-Kanal bearbeiten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu bearbeitenden Nachricht |
| `content` | string | Nein | Der neue Textinhalt für die Nachricht |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Aktualisierte Discord-Nachrichtendaten |

### `discord_delete_message`

Eine Nachricht aus einem Discord-Kanal löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu löschenden Nachricht |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_add_reaction`

Füge eine Reaktions-Emoji zu einer Discord-Nachricht hinzu

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die die Nachricht enthält |
| `messageId` | string | Ja | Die ID der Nachricht, auf die reagiert werden soll |
| `emoji` | string | Ja | Das Emoji für die Reaktion \(Unicode-Emoji oder benutzerdefiniertes Emoji im Format name:id\) |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_remove_reaction`

Entferne eine Reaktion von einer Discord-Nachricht

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die die Nachricht enthält |
| `messageId` | string | Ja | Die ID der Nachricht mit der Reaktion |
| `emoji` | string | Ja | Das zu entfernende Emoji \(Unicode-Emoji oder benutzerdefiniertes Emoji im Format name:id\) |
| `userId` | string | Nein | Die Benutzer-ID, deren Reaktion entfernt werden soll \(weglassen, um die eigene Reaktion des Bots zu entfernen\) |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_pin_message`

Eine Nachricht in einem Discord-Kanal anpinnen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die die Nachricht enthält |
| `messageId` | string | Ja | Die ID der anzupinnenden Nachricht |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_unpin_message`

Eine Nachricht in einem Discord-Kanal lösen (Unpin)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die die Nachricht enthält |
| `messageId` | string | Ja | Die ID der zu lösenden Nachricht |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_create_thread`

Einen Thread in einem Discord-Kanal erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, in der der Thread erstellt werden soll |
| `name` | string | Ja | Der Name des Threads \(1-100 Zeichen\) |
| `messageId` | string | Nein | Die Nachrichten-ID, aus der ein Thread erstellt werden soll \(falls aus einer bestehenden Nachricht erstellt wird\) |
| `autoArchiveDuration` | number | Nein | Dauer in Minuten bis zur automatischen Archivierung des Threads \(60, 1440, 4320, 10080\) |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Erstellte Thread-Daten |

### `discord_join_thread`

Einem Thread in Discord beitreten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `threadId` | string | Ja | Die Thread-ID, der beigetreten werden soll |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_leave_thread`

Einen Thread in Discord verlassen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `threadId` | string | Ja | Die Thread-ID, die verlassen werden soll |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_archive_thread`

Einen Thread in Discord archivieren oder dearchivieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `threadId` | string | Ja | Die Thread-ID zum Archivieren/Dearchivieren |
| `archived` | boolean | Ja | Ob der Thread archiviert \(true\) oder dearchiviert \(false\) werden soll |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Aktualisierte Thread-Daten |

### `discord_create_channel`

Einen neuen Kanal in einem Discord-Server erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `name` | string | Ja | Der Name des Kanals \(1-100 Zeichen\) |
| `type` | number | Nein | Kanaltyp \(0=Text, 2=Sprache, 4=Kategorie, 5=Ankündigung, 13=Bühne\) |
| `topic` | string | Nein | Kanalthema \(0-1024 Zeichen\) |
| `parentId` | string | Nein | Übergeordnete Kategorie-ID für den Kanal |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Daten des erstellten Kanals |

### `discord_update_channel`

Discord-Kanal aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die aktualisiert werden soll |
| `name` | string | Nein | Der neue Name für den Kanal |
| `topic` | string | Nein | Das neue Thema für den Kanal |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Daten des aktualisierten Kanals |

### `discord_delete_channel`

Discord-Kanal löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die gelöscht werden soll |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_get_channel`

Informationen über einen Discord-Kanal abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, die abgerufen werden soll |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Kanaldaten |

### `discord_create_role`

Eine neue Rolle in einem Discord-Server erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `name` | string | Ja | Der Name der Rolle |
| `color` | number | Nein | RGB-Farbwert als Ganzzahl \(z.B. 0xFF0000 für rot\) |
| `hoist` | boolean | Nein | Ob Rollenmitglieder getrennt von Online-Mitgliedern angezeigt werden sollen |
| `mentionable` | boolean | Nein | Ob die Rolle erwähnt werden kann |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Daten der erstellten Rolle |

### `discord_update_role`

Eine Rolle in einem Discord-Server aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `roleId` | string | Ja | Die zu aktualisierende Rollen-ID |
| `name` | string | Nein | Der neue Name für die Rolle |
| `color` | number | Nein | RGB-Farbwert als Ganzzahl |
| `hoist` | boolean | Nein | Ob Rollenmitglieder separat angezeigt werden sollen |
| `mentionable` | boolean | Nein | Ob die Rolle erwähnt werden kann |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Aktualisierte Rollendaten |

### `discord_delete_role`

Eine Rolle aus einem Discord-Server löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `roleId` | string | Ja | Die zu löschende Rollen-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_assign_role`

Eine Rolle einem Mitglied auf einem Discord-Server zuweisen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die Benutzer-ID, der die Rolle zugewiesen werden soll |
| `roleId` | string | Ja | Die Rollen-ID, die zugewiesen werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_remove_role`

Eine Rolle von einem Mitglied auf einem Discord-Server entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die Benutzer-ID, von der die Rolle entfernt werden soll |
| `roleId` | string | Ja | Die Rollen-ID, die entfernt werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_kick_member`

Ein Mitglied von einem Discord-Server entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die Benutzer-ID des zu entfernenden Benutzers |
| `reason` | string | Nein | Grund für die Entfernung des Mitglieds |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_ban_member`

Ein Mitglied von einem Discord-Server sperren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die Benutzer-ID, die gesperrt werden soll |
| `reason` | string | Nein | Grund für die Sperrung des Mitglieds |
| `deleteMessageDays` | number | Nein | Anzahl der Tage, für die Nachrichten gelöscht werden sollen \(0-7\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_unban_member`

Die Sperrung eines Mitglieds auf einem Discord-Server aufheben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die Benutzer-ID, deren Sperrung aufgehoben werden soll |
| `reason` | string | Nein | Grund für die Aufhebung der Sperrung des Mitglieds |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_get_member`

Informationen über ein Mitglied in einem Discord-Server abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die abzurufende Benutzer-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Mitgliedsdaten |

### `discord_update_member`

Ein Mitglied in einem Discord-Server aktualisieren (z.B. Nickname ändern)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |
| `userId` | string | Ja | Die zu aktualisierende Benutzer-ID |
| `nick` | string | Nein | Neuer Nickname für das Mitglied \(null zum Entfernen\) |
| `mute` | boolean | Nein | Ob das Mitglied in Sprachkanälen stummgeschaltet werden soll |
| `deaf` | boolean | Nein | Ob das Mitglied in Sprachkanälen taub geschaltet werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Aktualisierte Mitgliedsdaten |

### `discord_create_invite`

Einen Einladungslink für einen Discord-Kanal erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, für die eine Einladung erstellt werden soll |
| `maxAge` | number | Nein | Dauer der Einladung in Sekunden \(0 = läuft nie ab, Standard 86400\) |
| `maxUses` | number | Nein | Maximale Anzahl der Verwendungen \(0 = unbegrenzt, Standard 0\) |
| `temporary` | boolean | Nein | Ob die Einladung temporäre Mitgliedschaft gewährt |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Erstellte Einladungsdaten |

### `discord_get_invite`

Informationen über eine Discord-Einladung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `inviteCode` | string | Ja | Der abzurufende Einladungscode |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Einladungsdaten |

### `discord_delete_invite`

Discord-Einladung löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `inviteCode` | string | Ja | Der zu löschende Einladungscode |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `discord_create_webhook`

Webhook in einem Discord-Kanal erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `channelId` | string | Ja | Die Discord-Kanal-ID, in der der Webhook erstellt werden soll |
| `name` | string | Ja | Name des Webhooks \(1-80 Zeichen\) |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Erstellte Webhook-Daten |

### `discord_execute_webhook`

Discord-Webhook ausführen, um eine Nachricht zu senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `webhookId` | string | Ja | Die Webhook-ID |
| `webhookToken` | string | Ja | Der Webhook-Token |
| `content` | string | Ja | Der zu sendende Nachrichteninhalt |
| `username` | string | Nein | Überschreibt den Standardbenutzernamen des Webhooks |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Über Webhook gesendete Nachricht |

### `discord_get_webhook`

Informationen über einen Discord-Webhook abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `webhookId` | string | Ja | Die abzurufende Webhook-ID |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Webhook-Daten |

### `discord_delete_webhook`

Einen Discord-Webhook löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Ja | Der Bot-Token zur Authentifizierung |
| `webhookId` | string | Ja | Die zu löschende Webhook-ID |
| `serverId` | string | Ja | Die Discord-Server-ID \(Guild-ID\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgs- oder Fehlermeldung |

## Hinweise

- Kategorie: `tools`
- Typ: `discord`
```

--------------------------------------------------------------------------------

````
