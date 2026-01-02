---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 27
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 27 of 933)

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

---[FILE: google_vault.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_vault.mdx

```text
---
title: Google Vault
description: Suchen, exportieren und verwalten von Sperren/Exporten für
  Vault-Angelegenheiten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_vault"
  color="#E8F0FE"
/>

## Nutzungsanleitung

Verbinden Sie Google Vault, um Exporte zu erstellen, Exporte aufzulisten und Sperren innerhalb von Angelegenheiten zu verwalten.

## Tools

### `google_vault_create_matters_export`

Einen Export in einer Angelegenheit erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Ja | Keine Beschreibung |
| `exportName` | string | Ja | Keine Beschreibung |
| `corpus` | string | Ja | Zu exportierender Datenkorpus \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | Nein | Kommagetrennte Liste von Benutzer-E-Mails zur Eingrenzung des Exports |
| `orgUnitId` | string | Nein | Organisationseinheit-ID zur Eingrenzung des Exports \(Alternative zu E-Mails\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `export` | json | Erstelltes Export-Objekt |

### `google_vault_list_matters_export`

Exporte für eine Angelegenheit auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Ja | Keine Beschreibung |
| `pageSize` | number | Nein | Keine Beschreibung |
| `pageToken` | string | Nein | Keine Beschreibung |
| `exportId` | string | Nein | Keine Beschreibung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `exports` | json | Array von Export-Objekten |
| `export` | json | Einzelnes Export-Objekt \(wenn exportId angegeben ist\) |
| `nextPageToken` | string | Token zum Abrufen der nächsten Ergebnisseite |

### `google_vault_download_export_file`

Eine einzelne Datei aus einem Google Vault-Export herunterladen (GCS-Objekt)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Ja | Keine Beschreibung |
| `bucketName` | string | Ja | Keine Beschreibung |
| `objectName` | string | Ja | Keine Beschreibung |
| `fileName` | string | Nein | Keine Beschreibung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | file | Heruntergeladene Vault-Exportdatei in den Ausführungsdateien gespeichert |

### `google_vault_create_matters_holds`

Eine Aufbewahrung in einer Angelegenheit erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Ja | Keine Beschreibung |
| `holdName` | string | Ja | Keine Beschreibung |
| `corpus` | string | Ja | Datenkorpus zur Aufbewahrung \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | Nein | Kommagetrennte Liste von Benutzer-E-Mails, die aufbewahrt werden sollen |
| `orgUnitId` | string | Nein | Organisationseinheit-ID zur Aufbewahrung \(Alternative zu Konten\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `hold` | json | Erstelltes Hold-Objekt |

### `google_vault_list_matters_holds`

Aufbewahrungen für eine Angelegenheit auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Ja | Keine Beschreibung |
| `pageSize` | number | Nein | Keine Beschreibung |
| `pageToken` | string | Nein | Keine Beschreibung |
| `holdId` | string | Nein | Keine Beschreibung |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `holds` | json | Array von Hold-Objekten |
| `hold` | json | Einzelnes Hold-Objekt \(wenn holdId angegeben ist\) |
| `nextPageToken` | string | Token zum Abrufen der nächsten Ergebnisseite |

### `google_vault_create_matters`

Einen neuen Fall in Google Vault erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `name` | string | Ja | Keine Beschreibung |
| `description` | string | Nein | Keine Beschreibung |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `matter` | json | Erstelltes Matter-Objekt |

### `google_vault_list_matters`

Fälle auflisten oder einen bestimmten Fall abrufen, wenn matterId angegeben ist

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | Nein | Keine Beschreibung |
| `pageToken` | string | Nein | Keine Beschreibung |
| `matterId` | string | Nein | Keine Beschreibung |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `matters` | json | Array von Matter-Objekten |
| `matter` | json | Einzelnes Matter-Objekt \(wenn matterId angegeben ist\) |
| `nextPageToken` | string | Token zum Abrufen der nächsten Ergebnisseite |

## Hinweise

- Kategorie: `tools`
- Typ: `google_vault`
```

--------------------------------------------------------------------------------

---[FILE: grafana.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/grafana.mdx

```text
---
title: Grafana
description: Interagiere mit Grafana-Dashboards, Alarmen und Anmerkungen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="grafana"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Grafana](https://grafana.com/) ist eine führende Open-Source-Plattform für Monitoring, Observability und Visualisierung. Sie ermöglicht Benutzern, Daten aus verschiedenen Quellen abzufragen, zu visualisieren, zu überwachen und zu analysieren, was sie zu einem wesentlichen Werkzeug für Infrastruktur- und Anwendungsmonitoring macht.

Mit Grafana kannst du:

- **Daten visualisieren**: Dashboards erstellen und anpassen, um Metriken, Logs und Traces in Echtzeit anzuzeigen
- **Gesundheit und Status überwachen**: Den Zustand deiner Grafana-Instanz und verbundener Datenquellen überprüfen
- **Alarme und Anmerkungen verwalten**: Alarmregeln einrichten, Benachrichtigungen verwalten und Dashboards mit wichtigen Ereignissen versehen
- **Inhalte organisieren**: Dashboards und Datenquellen in Ordnern organisieren für besseres Zugriffsmanagement

In Sim ermöglicht die Grafana-Integration deinen Agenten, direkt über die API mit deiner Grafana-Instanz zu interagieren, was Aktionen wie folgende ermöglicht:

- Überprüfung des Gesundheitsstatus von Grafana-Server, Datenbank und Datenquellen
- Abrufen, Auflisten und Verwalten von Dashboards, Alarmregeln, Anmerkungen, Datenquellen und Ordnern
- Automatisierung der Überwachung deiner Infrastruktur durch Integration von Grafana-Daten und Alarmen in deine Workflow-Automatisierungen

Diese Fähigkeiten ermöglichen es Sim-Agenten, Systeme zu überwachen, proaktiv auf Alarme zu reagieren und die Zuverlässigkeit und Sichtbarkeit deiner Dienste zu gewährleisten – alles als Teil deiner automatisierten Workflows.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriere Grafana in Workflows. Verwalte Dashboards, Alarme, Anmerkungen, Datenquellen, Ordner und überwache den Gesundheitsstatus.

## Tools

### `grafana_get_dashboard`

Ein Dashboard anhand seiner UID abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `dashboardUid` | string | Ja | Die UID des abzurufenden Dashboards |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `dashboard` | json | Das vollständige Dashboard-JSON-Objekt |
| `meta` | json | Dashboard-Metadaten \(Version, Berechtigungen usw.\) |

### `grafana_list_dashboards`

Suchen und auflisten aller Dashboards

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `query` | string | Nein | Suchanfrage zum Filtern von Dashboards nach Titel |
| `tag` | string | Nein | Nach Tag filtern \(kommagetrennt für mehrere Tags\) |
| `folderIds` | string | Nein | Nach Ordner-IDs filtern \(kommagetrennt\) |
| `starred` | boolean | Nein | Nur mit Stern markierte Dashboards zurückgeben |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Dashboards |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `dashboards` | array | Liste der Dashboard-Suchergebnisse |

### `grafana_create_dashboard`

Ein neues Dashboard erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `title` | string | Ja | Der Titel des neuen Dashboards |
| `folderUid` | string | Nein | Die UID des Ordners, in dem das Dashboard erstellt werden soll |
| `tags` | string | Nein | Kommagetrennte Liste von Tags |
| `timezone` | string | Nein | Dashboard-Zeitzone \(z.B. browser, utc\) |
| `refresh` | string | Nein | Auto-Aktualisierungsintervall \(z.B. 5s, 1m, 5m\) |
| `panels` | string | Nein | JSON-Array von Panel-Konfigurationen |
| `overwrite` | boolean | Nein | Vorhandenes Dashboard mit gleichem Titel überschreiben |
| `message` | string | Nein | Commit-Nachricht für die Dashboard-Version |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `id` | number | Die numerische ID des erstellten Dashboards |
| `uid` | string | Die UID des erstellten Dashboards |
| `url` | string | Der URL-Pfad zum Dashboard |
| `status` | string | Status der Operation \(success\) |
| `version` | number | Die Versionsnummer des Dashboards |
| `slug` | string | URL-freundlicher Slug des Dashboards |

### `grafana_update_dashboard`

Aktualisiert ein bestehendes Dashboard. Ruft das aktuelle Dashboard ab und führt Ihre Änderungen zusammen.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `dashboardUid` | string | Ja | Die UID des zu aktualisierenden Dashboards |
| `title` | string | Nein | Neuer Titel für das Dashboard |
| `folderUid` | string | Nein | Neue Ordner-UID, um das Dashboard zu verschieben |
| `tags` | string | Nein | Kommagetrennte Liste neuer Tags |
| `timezone` | string | Nein | Dashboard-Zeitzone \(z.B. browser, utc\) |
| `refresh` | string | Nein | Auto-Refresh-Intervall \(z.B. 5s, 1m, 5m\) |
| `panels` | string | Nein | JSON-Array von Panel-Konfigurationen |
| `overwrite` | boolean | Nein | Überschreiben auch bei Versionskonflikten |
| `message` | string | Nein | Commit-Nachricht für diese Version |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | number | Die numerische ID des aktualisierten Dashboards |
| `uid` | string | Die UID des aktualisierten Dashboards |
| `url` | string | Der URL-Pfad zum Dashboard |
| `status` | string | Status der Operation \(success\) |
| `version` | number | Die neue Versionsnummer des Dashboards |
| `slug` | string | URL-freundlicher Slug des Dashboards |

### `grafana_delete_dashboard`

Löschen eines Dashboards anhand seiner UID

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `dashboardUid` | string | Ja | Die UID des zu löschenden Dashboards |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `title` | string | Der Titel des gelöschten Dashboards |
| `message` | string | Bestätigungsnachricht |
| `id` | number | Die ID des gelöschten Dashboards |

### `grafana_list_alert_rules`

Alle Alarmregeln in der Grafana-Instanz auflisten

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `rules` | array | Liste der Alarmregeln |

### `grafana_get_alert_rule`

Eine bestimmte Alarmregel anhand ihrer UID abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `alertRuleUid` | string | Ja | Die UID der abzurufenden Alarmregel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `uid` | string | Alarmregel-UID |
| `title` | string | Alarmregel-Titel |
| `condition` | string | Alarmbedingung |
| `data` | json | Alarmregel-Abfragedaten |
| `folderUID` | string | Übergeordnete Ordner-UID |
| `ruleGroup` | string | Regelgruppenname |
| `noDataState` | string | Status, wenn keine Daten zurückgegeben werden |
| `execErrState` | string | Status bei Ausführungsfehler |
| `annotations` | json | Alarmanmerkungen |
| `labels` | json | Alarmlabels |

### `grafana_create_alert_rule`

Eine neue Alarmregel erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `title` | string | Ja | Der Titel der Alarmregel |
| `folderUid` | string | Ja | Die UID des Ordners, in dem der Alarm erstellt werden soll |
| `ruleGroup` | string | Ja | Der Name der Regelgruppe |
| `condition` | string | Ja | Die refId der Abfrage oder des Ausdrucks, der als Alarmbedingung verwendet werden soll |
| `data` | string | Ja | JSON-Array von Abfrage-/Ausdrucksdatenobjekten |
| `forDuration` | string | Nein | Wartezeit vor dem Auslösen \(z.B. 5m, 1h\) |
| `noDataState` | string | Nein | Status, wenn keine Daten zurückgegeben werden \(NoData, Alerting, OK\) |
| `execErrState` | string | Nein | Status bei Ausführungsfehler \(Alerting, OK\) |
| `annotations` | string | Nein | JSON-Objekt von Anmerkungen |
| `labels` | string | Nein | JSON-Objekt von Labels |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `uid` | string | Die UID der erstellten Alarmregel |
| `title` | string | Titel der Alarmregel |
| `folderUID` | string | UID des übergeordneten Ordners |
| `ruleGroup` | string | Name der Regelgruppe |

### `grafana_update_alert_rule`

Aktualisiert eine bestehende Alarmregel. Ruft die aktuelle Regel ab und führt Ihre Änderungen zusammen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service-Account-Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL (z.B. https://your-grafana.com) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `alertRuleUid` | string | Ja | Die UID der zu aktualisierenden Alarmregel |
| `title` | string | Nein | Neuer Titel für die Alarmregel |
| `folderUid` | string | Nein | Neue Ordner-UID, um den Alarm zu verschieben |
| `ruleGroup` | string | Nein | Neuer Name der Regelgruppe |
| `condition` | string | Nein | Neue Bedingung refId |
| `data` | string | Nein | Neues JSON-Array von Abfrage-/Ausdrucksdatenobjekten |
| `forDuration` | string | Nein | Wartezeit vor dem Auslösen (z.B. 5m, 1h) |
| `noDataState` | string | Nein | Status, wenn keine Daten zurückgegeben werden (NoData, Alerting, OK) |
| `execErrState` | string | Nein | Status bei Ausführungsfehler (Alerting, OK) |
| `annotations` | string | Nein | JSON-Objekt von Anmerkungen |
| `labels` | string | Nein | JSON-Objekt von Labels |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `uid` | string | Die UID der aktualisierten Alarmregel |
| `title` | string | Titel der Alarmregel |
| `folderUID` | string | UID des übergeordneten Ordners |
| `ruleGroup` | string | Name der Regelgruppe |

### `grafana_delete_alert_rule`

Löschen einer Alarmregel anhand ihrer UID

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service-Account-Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `alertRuleUid` | string | Ja | Die UID der zu löschenden Alarmregel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Bestätigungsnachricht |

### `grafana_list_contact_points`

Alle Alarmbenachrichtigungs-Kontaktpunkte auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service-Account-Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contactPoints` | array | Liste der Kontaktpunkte |

### `grafana_create_annotation`

Eine Anmerkung auf einem Dashboard oder als globale Anmerkung erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `text` | string | Ja | Der Textinhalt der Anmerkung |
| `tags` | string | Nein | Kommagetrennte Liste von Tags |
| `dashboardUid` | string | Ja | UID des Dashboards, zu dem die Anmerkung hinzugefügt werden soll |
| `panelId` | number | Nein | ID des Panels, zu dem die Anmerkung hinzugefügt werden soll |
| `time` | number | Nein | Startzeit in Epochenmillisekunden \(standardmäßig jetzt\) |
| `timeEnd` | number | Nein | Endzeit in Epochenmillisekunden \(für Bereichsanmerkungen\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | number | Die ID der erstellten Anmerkung |
| `message` | string | Bestätigungsnachricht |

### `grafana_list_annotations`

Anmerkungen nach Zeitraum, Dashboard oder Tags abfragen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `from` | number | Nein | Startzeit in Epochenmillisekunden |
| `to` | number | Nein | Endzeit in Epochenmillisekunden |
| `dashboardUid` | string | Ja | Dashboard-UID, von der Anmerkungen abgefragt werden sollen |
| `panelId` | number | Nein | Nach Panel-ID filtern |
| `tags` | string | Nein | Kommagetrennte Liste von Tags zum Filtern |
| `type` | string | Nein | Nach Typ filtern \(alert oder annotation\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Anmerkungen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `annotations` | array | Liste der Anmerkungen |

### `grafana_update_annotation`

Eine vorhandene Anmerkung aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service-Account-Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `annotationId` | number | Ja | Die ID der zu aktualisierenden Anmerkung |
| `text` | string | Ja | Neuer Textinhalt für die Anmerkung |
| `tags` | string | Nein | Kommagetrennte Liste neuer Tags |
| `time` | number | Nein | Neue Startzeit in Epochenmillisekunden |
| `timeEnd` | number | Nein | Neue Endzeit in Epochenmillisekunden |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | number | Die ID der aktualisierten Anmerkung |
| `message` | string | Bestätigungsnachricht |

### `grafana_delete_annotation`

Eine Anmerkung anhand ihrer ID löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service-Account-Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `annotationId` | number | Ja | Die ID der zu löschenden Anmerkung |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Bestätigungsnachricht |

### `grafana_list_data_sources`

Alle in Grafana konfigurierten Datenquellen auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `dataSources` | array | Liste der Datenquellen |

### `grafana_get_data_source`

Eine Datenquelle anhand ihrer ID oder UID abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Multi-Org-Grafana-Instanzen |
| `dataSourceId` | string | Ja | Die ID oder UID der abzurufenden Datenquelle |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `id` | number | Datenquellen-ID |
| `uid` | string | Datenquellen-UID |
| `name` | string | Name der Datenquelle |
| `type` | string | Typ der Datenquelle |
| `url` | string | Verbindungs-URL der Datenquelle |
| `database` | string | Datenbankname \(falls zutreffend\) |
| `isDefault` | boolean | Ob dies die Standard-Datenquelle ist |
| `jsonData` | json | Zusätzliche Konfiguration der Datenquelle |

### `grafana_list_folders`

Alle Ordner in Grafana auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Grafana-Instanzen mit mehreren Organisationen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ordner |
| `page` | number | Nein | Seitennummer für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `folders` | array | Liste der Ordner |

### `grafana_create_folder`

Einen neuen Ordner in Grafana erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Grafana Service Account Token |
| `baseUrl` | string | Ja | Grafana-Instanz-URL \(z.B. https://your-grafana.com\) |
| `organizationId` | string | Nein | Organisations-ID für Grafana-Instanzen mit mehreren Organisationen |
| `title` | string | Ja | Der Titel des neuen Ordners |
| `uid` | string | Nein | Optionale UID für den Ordner \(wird automatisch generiert, wenn nicht angegeben\) |

#### Ausgabe

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `id` | number | Die numerische ID des erstellten Ordners |
| `uid` | string | Die UID des erstellten Ordners |
| `title` | string | Der Titel des erstellten Ordners |
| `url` | string | Der URL-Pfad zum Ordner |
| `hasAcl` | boolean | Ob der Ordner benutzerdefinierte ACL-Berechtigungen hat |
| `canSave` | boolean | Ob der aktuelle Benutzer den Ordner speichern kann |
| `canEdit` | boolean | Ob der aktuelle Benutzer den Ordner bearbeiten kann |
| `canAdmin` | boolean | Ob der aktuelle Benutzer Administratorrechte für den Ordner hat |
| `canDelete` | boolean | Ob der aktuelle Benutzer den Ordner löschen kann |
| `createdBy` | string | Benutzername desjenigen, der den Ordner erstellt hat |
| `created` | string | Zeitstempel, wann der Ordner erstellt wurde |
| `updatedBy` | string | Benutzername desjenigen, der den Ordner zuletzt aktualisiert hat |
| `updated` | string | Zeitstempel, wann der Ordner zuletzt aktualisiert wurde |
| `version` | number | Versionsnummer des Ordners |

## Notizen

- Kategorie: `tools`
- Typ: `grafana`
```

--------------------------------------------------------------------------------

---[FILE: hubspot.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/hubspot.mdx

```text
---
title: HubSpot
description: Interagieren Sie mit HubSpot CRM oder lösen Sie Workflows von
  HubSpot-Ereignissen aus
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hubspot"
  color="#FF7A59"
/>

{/* MANUAL-CONTENT-START:intro */}
[HubSpot](https://www.hubspot.com) ist eine umfassende CRM-Plattform, die eine vollständige Suite von Marketing-, Vertriebs- und Kundenservice-Tools bietet, um Unternehmen beim besseren Wachstum zu unterstützen. Mit seinen leistungsstarken Automatisierungsfunktionen und umfangreicher API ist HubSpot zu einer der weltweit führenden CRM-Plattformen geworden, die Unternehmen aller Größen und Branchen bedient.

HubSpot CRM bietet eine komplette Lösung für die Verwaltung von Kundenbeziehungen, vom ersten Kontakt bis zum langfristigen Kundenerfolg. Die Plattform kombiniert Kontaktverwaltung, Deal-Tracking, Marketing-Automatisierung und Kundenservice-Tools in einem einheitlichen System, das Teams dabei hilft, aufeinander abgestimmt und auf den Kundenerfolg fokussiert zu bleiben.

Zu den wichtigsten Funktionen von HubSpot CRM gehören:

- Kontakt- & Unternehmensverwaltung: Umfassende Datenbank zur Speicherung und Organisation von Kunden- und Interessenteninformationen
- Deal-Pipeline: Visuelle Vertriebspipeline zur Verfolgung von Verkaufschancen durch anpassbare Phasen
- Marketing-Events: Verfolgen und Verwalten von Marketingkampagnen und Veranstaltungen mit detaillierter Attribution
- Ticket-Management: Kundenservice-Ticketsystem zur Verfolgung und Lösung von Kundenproblemen
- Angebote & Artikelpositionen: Erstellen und Verwalten von Verkaufsangeboten mit detaillierten Produktpositionen
- Benutzer- & Teamverwaltung: Teams organisieren, Verantwortlichkeiten zuweisen und Benutzeraktivitäten auf der gesamten Plattform verfolgen

In Sim ermöglicht die HubSpot-Integration Ihren KI-Agenten eine nahtlose Interaktion mit Ihren CRM-Daten und die Automatisierung wichtiger Geschäftsprozesse. Dies schafft leistungsstarke Möglichkeiten für intelligente Lead-Qualifizierung, automatisierte Kontaktanreicherung, Deal-Management, Kundenservice-Automatisierung und Datensynchronisierung in Ihrem Tech-Stack. Die Integration ermöglicht Agenten das Erstellen, Abrufen, Aktualisieren und Durchsuchen aller wichtigen HubSpot-Objekte und ermöglicht so anspruchsvolle Workflows, die auf CRM-Ereignisse reagieren, die Datenqualität aufrechterhalten und sicherstellen, dass Ihr Team über die aktuellsten Kundeninformationen verfügt. Durch die Verbindung von Sim mit HubSpot können Sie KI-Agenten erstellen, die automatisch Leads qualifizieren, Support-Tickets weiterleiten, Deal-Phasen basierend auf Kundeninteraktionen aktualisieren, Angebote generieren und Ihre CRM-Daten mit anderen Geschäftssystemen synchronisieren – was letztendlich die Teamproduktivität steigert und die Kundenerfahrung verbessert.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie HubSpot in Ihren Workflow. Verwalten Sie Kontakte, Unternehmen, Deals, Tickets und andere CRM-Objekte mit leistungsstarken Automatisierungsfunktionen. Kann im Trigger-Modus verwendet werden, um Workflows zu starten, wenn Kontakte erstellt, gelöscht oder aktualisiert werden.

## Tools

### `hubspot_get_users`

Alle Benutzer vom HubSpot-Konto abrufen

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `users` | array | Array von HubSpot-Benutzerobjekten |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_list_contacts`

Alle Kontakte vom HubSpot-Konto mit Paginierungsunterstützung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Nein | Maximale Anzahl von Ergebnissen pro Seite \(max. 100, Standard 100\) |
| `after` | string | Nein | Paginierungscursor für die nächste Ergebnisseite |
| `properties` | string | Nein | Kommagetrennte Liste der zurückzugebenden Eigenschaften \(z.B. "email,firstname,lastname"\) |
| `associations` | string | Nein | Kommagetrennte Liste der Objekttypen, für die zugehörige IDs abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contacts` | array | Array von HubSpot-Kontaktobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_get_contact`

Einen einzelnen Kontakt anhand von ID oder E-Mail aus HubSpot abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Ja | Die ID oder E-Mail des abzurufenden Kontakts |
| `idProperty` | string | Nein | Eigenschaft, die als eindeutiger Identifikator verwendet werden soll \(z.B. "email"\). Falls nicht angegeben, wird die Datensatz-ID verwendet |
| `properties` | string | Nein | Kommagetrennte Liste der zurückzugebenden Eigenschaften |
| `associations` | string | Nein | Kommagetrennte Liste der Objekttypen, für die zugehörige IDs abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contact` | object | HubSpot-Kontaktobjekt mit Eigenschaften |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_create_contact`

Erstellt einen neuen Kontakt in HubSpot. Erfordert mindestens eines der folgenden Felder: E-Mail, Vorname oder Nachname

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `properties` | object | Ja | Kontakteigenschaften als JSON-Objekt. Muss mindestens eines der folgenden Felder enthalten: E-Mail, Vorname oder Nachname |
| `associations` | array | Nein | Array von Verknüpfungen, die mit dem Kontakt erstellt werden sollen \(z.B. Unternehmen, Deals\). Jedes Objekt sollte "to" \(mit "id"\) und "types" \(mit "associationCategory" und "associationTypeId"\) enthalten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contact` | object | Erstelltes HubSpot-Kontaktobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_update_contact`

Aktualisiert einen bestehenden Kontakt in HubSpot anhand von ID oder E-Mail

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Ja | Die ID oder E-Mail des zu aktualisierenden Kontakts |
| `idProperty` | string | Nein | Eigenschaft, die als eindeutiger Identifikator verwendet werden soll \(z.B. "email"\). Wenn nicht angegeben, wird die Datensatz-ID verwendet |
| `properties` | object | Ja | Zu aktualisierende Kontakteigenschaften als JSON-Objekt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contact` | object | Aktualisiertes HubSpot-Kontaktobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_search_contacts`

Suche nach Kontakten in HubSpot mit Filtern, Sortierung und Abfragen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | Nein | Array von Filtergruppen. Jede Gruppe enthält Filter mit propertyName, operator und value |
| `sorts` | array | Nein | Array von Sortierobjekten mit propertyName und direction ("ASCENDING" oder "DESCENDING") |
| `query` | string | Nein | Suchabfragestring |
| `properties` | array | Nein | Array von Eigenschaftsnamen, die zurückgegeben werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse (max. 100) |
| `after` | string | Nein | Paginierungscursor für die nächste Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contacts` | array | Array übereinstimmender HubSpot-Kontaktobjekte |
| `total` | number | Gesamtanzahl übereinstimmender Kontakte |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_list_companies`

Alle Unternehmen aus dem HubSpot-Konto mit Paginierungsunterstützung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Nein | Maximale Anzahl der Ergebnisse pro Seite (max. 100, Standard 100) |
| `after` | string | Nein | Paginierungscursor für die nächste Ergebnisseite |
| `properties` | string | Nein | Kommagetrennte Liste der zurückzugebenden Eigenschaften |
| `associations` | string | Nein | Kommagetrennte Liste der Objekttypen, für die zugehörige IDs abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `companies` | array | Array von HubSpot-Unternehmensobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_get_company`

Ruft ein einzelnes Unternehmen anhand der ID oder Domain von HubSpot ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Ja | Die ID oder Domain des abzurufenden Unternehmens |
| `idProperty` | string | Nein | Eigenschaft, die als eindeutiger Identifikator verwendet wird (z.B. "domain"). Falls nicht angegeben, wird die Datensatz-ID verwendet |
| `properties` | string | Nein | Kommagetrennte Liste der zurückzugebenden Eigenschaften |
| `associations` | string | Nein | Kommagetrennte Liste der Objekttypen, für die zugehörige IDs abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `company` | object | HubSpot-Unternehmensobjekt mit Eigenschaften |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_create_company`

Erstellt ein neues Unternehmen in HubSpot

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `properties` | object | Ja | Unternehmensdaten als JSON-Objekt (z.B. Name, Domain, Stadt, Branche) |
| `associations` | array | Nein | Array von Verknüpfungen, die mit dem Unternehmen erstellt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `company` | object | Erstelltes HubSpot-Unternehmensobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_update_company`

Aktualisiert ein bestehendes Unternehmen in HubSpot anhand der ID oder Domain

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Ja | Die ID oder Domain des zu aktualisierenden Unternehmens |
| `idProperty` | string | Nein | Eigenschaft, die als eindeutiger Identifikator verwendet wird (z.B. "domain"). Falls nicht angegeben, wird die Datensatz-ID verwendet |
| `properties` | object | Ja | Zu aktualisierende Unternehmensdaten als JSON-Objekt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `company` | object | Aktualisiertes HubSpot-Unternehmensobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_search_companies`

Suche nach Unternehmen in HubSpot mit Filtern, Sortierung und Abfragen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | Nein | Array von Filtergruppen. Jede Gruppe enthält Filter mit propertyName, operator und value |
| `sorts` | array | Nein | Array von Sortierobjekten mit propertyName und direction ("ASCENDING" oder "DESCENDING") |
| `query` | string | Nein | Suchabfragestring |
| `properties` | array | Nein | Array von Eigenschaftsnamen, die zurückgegeben werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse (max. 100) |
| `after` | string | Nein | Paginierungscursor für die nächste Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `companies` | array | Array übereinstimmender HubSpot-Unternehmensobjekte |
| `total` | number | Gesamtzahl übereinstimmender Unternehmen |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `hubspot_list_deals`

Alle Deals vom HubSpot-Konto mit Paginierungsunterstützung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Nein | Maximale Anzahl von Ergebnissen pro Seite (max. 100, Standard 100) |
| `after` | string | Nein | Paginierungscursor für die nächste Ergebnisseite |
| `properties` | string | Nein | Kommagetrennte Liste der zurückzugebenden Eigenschaften |
| `associations` | string | Nein | Kommagetrennte Liste der Objekttypen, für die zugehörige IDs abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deals` | array | Array von HubSpot-Deal-Objekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

## Hinweise

- Kategorie: `tools`
- Typ: `hubspot`
```

--------------------------------------------------------------------------------

````
