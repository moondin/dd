---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 31
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 31 of 933)

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

---[FILE: jira.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/jira.mdx

```text
---
title: Jira
description: Mit Jira interagieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jira"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jira](https://www.atlassian.com/jira) ist eine führende Projektmanagement- und Issue-Tracking-Plattform, die Teams dabei hilft, agile Softwareentwicklungsprojekte effektiv zu planen, zu verfolgen und zu verwalten. Als Teil der Atlassian-Suite hat sich Jira zum Industriestandard für Softwareentwicklungsteams und Projektmanagement-Fachleute weltweit entwickelt.

Jira bietet ein umfassendes Set an Werkzeugen für die Verwaltung komplexer Projekte durch sein flexibles und anpassbares Workflow-System. Mit seinen robusten API- und Integrationsfähigkeiten ermöglicht Jira Teams, ihre Entwicklungsprozesse zu optimieren und eine klare Übersicht über den Projektfortschritt zu behalten.

Zu den Hauptfunktionen von Jira gehören:

- Agiles Projektmanagement: Unterstützung für Scrum- und Kanban-Methoden mit anpassbaren Boards und Workflows
- Issue-Tracking: Ausgeklügeltes Tracking-System für Bugs, Stories, Epics und Tasks mit detaillierter Berichterstattung
- Workflow-Automatisierung: Leistungsstarke Automatisierungsregeln zur Optimierung wiederkehrender Aufgaben und Prozesse
- Erweiterte Suche: JQL (Jira Query Language) für komplexe Issue-Filterung und Berichterstattung

In Sim ermöglicht die Jira-Integration Ihren Agenten eine nahtlose Interaktion mit Ihrem Projektmanagement-Workflow. Dies schafft Möglichkeiten für automatisierte Issue-Erstellung, -Aktualisierung und -Verfolgung als Teil Ihrer KI-Workflows. Die Integration ermöglicht es Agenten, Jira-Issues programmatisch zu erstellen, abzurufen und zu aktualisieren, was automatisierte Projektmanagement-Aufgaben erleichtert und sicherstellt, dass wichtige Informationen ordnungsgemäß verfolgt und dokumentiert werden. Durch die Verbindung von Sim mit Jira können Sie intelligente Agenten erstellen, die die Projektübersicht aufrechterhalten und gleichzeitig Routine-Projektmanagementaufgaben automatisieren, die Teamproduktivität steigern und eine konsistente Projektverfolgung gewährleisten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Jira in den Workflow. Kann Issues lesen, schreiben und aktualisieren. Kann auch Workflows basierend auf Jira-Webhook-Ereignissen auslösen.

## Tools

### `jira_retrieve`

Ruft detaillierte Informationen zu einem bestimmten Jira-Issue ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `projectId` | string | Nein | Jira-Projekt-ID \(optional; nicht erforderlich, um ein einzelnes Issue abzurufen\). |
| `issueKey` | string | Ja | Jira-Issue-Key zum Abrufen \(z.B. PROJ-123\) |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key \(z.B. PROJ-123\) |
| `summary` | string | Issue-Zusammenfassung |
| `description` | json | Inhalt der Issue-Beschreibung |
| `created` | string | Zeitstempel der Issue-Erstellung |
| `updated` | string | Zeitstempel der letzten Issue-Aktualisierung |
| `issue` | json | Vollständiges Issue-Objekt mit allen Feldern |

### `jira_update`

Ein Jira-Issue aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `projectId` | string | Nein | Jira-Projekt-ID, in der Issues aktualisiert werden sollen. Wenn nicht angegeben, werden alle Issues abgerufen. |
| `issueKey` | string | Ja | Jira-Issue-Key zum Aktualisieren |
| `summary` | string | Nein | Neue Zusammenfassung für das Issue |
| `description` | string | Nein | Neue Beschreibung für das Issue |
| `status` | string | Nein | Neuer Status für das Issue |
| `priority` | string | Nein | Neue Priorität für das Issue |
| `assignee` | string | Nein | Neuer Bearbeiter für das Issue |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Aktualisierter Issue-Key \(z.B. PROJ-123\) |
| `summary` | string | Issue-Zusammenfassung nach der Aktualisierung |

### `jira_write`

Ein Jira-Issue erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain (z.B. ihrfirma.atlassian.net) |
| `projectId` | string | Ja | Projekt-ID für das Issue |
| `summary` | string | Ja | Zusammenfassung für das Issue |
| `description` | string | Nein | Beschreibung für das Issue |
| `priority` | string | Nein | Priorität für das Issue |
| `assignee` | string | Nein | Bearbeiter für das Issue |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie anhand der Domain abgerufen. |
| `issueType` | string | Ja | Art des zu erstellenden Issues (z.B. Task, Story) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Erstellter Issue-Key \(z.B. PROJ-123\) |
| `summary` | string | Issue-Zusammenfassung |
| `url` | string | URL zum erstellten Issue |

### `jira_bulk_read`

Mehrere Jira-Issues in Masse abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain (z.B. ihrfirma.atlassian.net) |
| `projectId` | string | Ja | Jira-Projekt-ID |
| `cloudId` | string | Nein | Jira-Cloud-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `issues` | array | Array von Jira-Issues mit Zeitstempel, Zusammenfassung, Beschreibung, Erstellungs- und Aktualisierungszeitstempeln |

### `jira_delete_issue`

Ein Jira-Issue löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key zum Löschen \(z.B. PROJ-123\) |
| `deleteSubtasks` | boolean | Nein | Ob Unteraufgaben gelöscht werden sollen. Wenn false, können übergeordnete Issues mit Unteraufgaben nicht gelöscht werden. |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Gelöschter Issue-Key |

### `jira_assign_issue`

Ein Jira-Issue einem Benutzer zuweisen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key zum Zuweisen \(z.B. PROJ-123\) |
| `accountId` | string | Ja | Account-ID des Benutzers, dem das Issue zugewiesen werden soll. Verwenden Sie "-1" für automatische Zuweisung oder null, um die Zuweisung aufzuheben. |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key, der zugewiesen wurde |
| `assigneeId` | string | Konto-ID des Bearbeiters |

### `jira_transition_issue`

Ein Jira-Issue zwischen Workflow-Status verschieben (z.B. To Do -> In Progress)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key für den Übergang \(z.B. PROJ-123\) |
| `transitionId` | string | Ja | ID des auszuführenden Übergangs \(z.B. "11" für "To Do", "21" für "In Progress"\) |
| `comment` | string | Nein | Optionaler Kommentar, der beim Übergang des Issues hinzugefügt werden soll |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key, der übergangen wurde |
| `transitionId` | string | Angewendete Übergangs-ID |

### `jira_search_issues`

Nach Jira-Issues mit JQL (Jira Query Language) suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `jql` | string | Ja | JQL-Abfragestring zur Suche nach Issues \(z.B. "project = PROJ AND status = Open"\) |
| `startAt` | number | Nein | Der Index des ersten zurückzugebenden Ergebnisses \(für Paginierung\) |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 50\) |
| `fields` | array | Nein | Array von Feldnamen, die zurückgegeben werden sollen \(Standard: \['summary', 'status', 'assignee', 'created', 'updated'\]\) |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `total` | number | Gesamtanzahl der übereinstimmenden Issues |
| `startAt` | number | Paginierungsstartindex |
| `maxResults` | number | Maximale Ergebnisse pro Seite |
| `issues` | array | Array übereinstimmender Issues mit Key, Zusammenfassung, Status, Bearbeiter, Erstellungs- und Aktualisierungsdatum |

### `jira_add_comment`

Einen Kommentar zu einem Jira-Issue hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, zu dem ein Kommentar hinzugefügt werden soll \(z.B. PROJ-123\) |
| `body` | string | Ja | Text des Kommentars |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key, zu dem der Kommentar hinzugefügt wurde |
| `commentId` | string | Erstellte Kommentar-ID |
| `body` | string | Kommentartextinhalt |

### `jira_get_comments`

Alle Kommentare eines Jira-Issues abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, von dem Kommentare abgerufen werden sollen \(z.B. PROJ-123\) |
| `startAt` | number | Nein | Index des ersten zurückzugebenden Kommentars \(Standard: 0\) |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Kommentare \(Standard: 50\) |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `total` | number | Gesamtanzahl der Kommentare |
| `comments` | array | Array von Kommentaren mit ID, Autor, Inhalt, Erstellungs- und Aktualisierungsdatum |

### `jira_update_comment`

Einen bestehenden Kommentar zu einem Jira-Issue aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, der den Kommentar enthält \(z.B. PROJ-123\) |
| `commentId` | string | Ja | ID des zu aktualisierenden Kommentars |
| `body` | string | Ja | Aktualisierter Kommentartext |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `commentId` | string | Aktualisierte Kommentar-ID |
| `body` | string | Aktualisierter Kommentartext |

### `jira_delete_comment`

Einen Kommentar aus einem Jira-Issue löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, der den Kommentar enthält \(z.B. PROJ-123\) |
| `commentId` | string | Ja | ID des zu löschenden Kommentars |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `commentId` | string | ID des gelöschten Kommentars |

### `jira_get_attachments`

Alle Anhänge eines Jira-Issues abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, von dem Anhänge abgerufen werden sollen \(z.B. PROJ-123\) |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `attachments` | array | Array von Anhängen mit ID, Dateiname, Größe, MIME-Typ, Erstellungsdatum und Autor |

### `jira_delete_attachment`

Einen Anhang von einem Jira-Issue löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `attachmentId` | string | Ja | ID des zu löschenden Anhangs |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `attachmentId` | string | ID des gelöschten Anhangs |

### `jira_add_worklog`

Einen Zeiterfassungseintrag zu einem Jira-Issue hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain (z.B. ihrfirma.atlassian.net) |
| `issueKey` | string | Ja | Jira-Issue-Key, zu dem der Worklog hinzugefügt werden soll (z.B. PROJ-123) |
| `timeSpentSeconds` | number | Ja | Aufgewendete Zeit in Sekunden |
| `comment` | string | Nein | Optionaler Kommentar für den Worklog-Eintrag |
| `started` | string | Nein | Optionale Startzeit im ISO-Format (standardmäßig aktuelle Zeit) |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie anhand der Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key, zu dem der Worklog hinzugefügt wurde |
| `worklogId` | string | ID des erstellten Worklogs |
| `timeSpentSeconds` | number | Aufgewendete Zeit in Sekunden |

### `jira_get_worklogs`

Alle Worklog-Einträge eines Jira-Issues abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain (z.B. ihrfirma.atlassian.net) |
| `issueKey` | string | Ja | Jira-Issue-Key, von dem Worklogs abgerufen werden sollen (z.B. PROJ-123) |
| `startAt` | number | Nein | Index des ersten zurückzugebenden Worklogs (Standard: 0) |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Worklogs (Standard: 50) |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie anhand der Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `total` | number | Gesamtanzahl der Worklogs |
| `worklogs` | array | Array von Worklogs mit ID, Autor, aufgewendeter Zeit in Sekunden, aufgewendeter Zeit, Kommentar, Erstellungs-, Aktualisierungs- und Startdatum |

### `jira_update_worklog`

Aktualisieren eines vorhandenen Worklog-Eintrags in einem Jira-Issue

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, der den Worklog enthält \(z.B. PROJ-123\) |
| `worklogId` | string | Ja | ID des zu aktualisierenden Worklog-Eintrags |
| `timeSpentSeconds` | number | Nein | Aufgewendete Zeit in Sekunden |
| `comment` | string | Nein | Optionaler Kommentar für den Worklog-Eintrag |
| `started` | string | Nein | Optionale Startzeit im ISO-Format |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `worklogId` | string | ID des aktualisierten Worklogs |

### `jira_delete_worklog`

Löschen eines Worklog-Eintrags aus einem Jira-Issue

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, der den Worklog enthält \(z.B. PROJ-123\) |
| `worklogId` | string | Ja | ID des zu löschenden Worklog-Eintrags |
| `cloudId` | string | Nein | Jira Cloud ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `worklogId` | string | ID des gelöschten Worklogs |

### `jira_create_issue_link`

Eine Verknüpfungsbeziehung zwischen zwei Jira-Issues erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `inwardIssueKey` | string | Ja | Jira-Issue-Key für das eingehende Issue \(z.B. PROJ-123\) |
| `outwardIssueKey` | string | Ja | Jira-Issue-Key für das ausgehende Issue \(z.B. PROJ-456\) |
| `linkType` | string | Ja | Die Art der Verknüpfungsbeziehung \(z.B. "Blocks", "Relates to", "Duplicates"\) |
| `comment` | string | Nein | Optionaler Kommentar zur Issue-Verknüpfung |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie anhand der Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `inwardIssue` | string | Key des eingehenden Issues |
| `outwardIssue` | string | Key des ausgehenden Issues |
| `linkType` | string | Art der Issue-Verknüpfung |
| `linkId` | string | ID der erstellten Verknüpfung |

### `jira_delete_issue_link`

Eine Verknüpfung zwischen zwei Jira-Issues löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `linkId` | string | Ja | ID der zu löschenden Issue-Verknüpfung |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie anhand der Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `linkId` | string | ID der gelöschten Verknüpfung |

### `jira_add_watcher`

Einen Beobachter zu einem Jira-Issue hinzufügen, um Benachrichtigungen über Aktualisierungen zu erhalten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, zu dem ein Beobachter hinzugefügt werden soll \(z.B. PROJ-123\) |
| `accountId` | string | Ja | Account-ID des Benutzers, der als Beobachter hinzugefügt werden soll |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `watcherAccountId` | string | Account-ID des hinzugefügten Beobachters |

### `jira_remove_watcher`

Einen Beobachter von einem Jira-Issue entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Ihre Jira-Domain \(z.B. ihrfirma.atlassian.net\) |
| `issueKey` | string | Ja | Jira-Issue-Key, von dem ein Beobachter entfernt werden soll \(z.B. PROJ-123\) |
| `accountId` | string | Ja | Account-ID des Benutzers, der als Beobachter entfernt werden soll |
| `cloudId` | string | Nein | Jira Cloud-ID für die Instanz. Wenn nicht angegeben, wird sie über die Domain abgerufen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ts` | string | Zeitstempel der Operation |
| `issueKey` | string | Issue-Key |
| `watcherAccountId` | string | Account-ID des entfernten Beobachters |

## Hinweise

- Kategorie: `tools`
- Typ: `jira`
```

--------------------------------------------------------------------------------

---[FILE: kalshi.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/kalshi.mdx

```text
---
title: Kalshi
description: Zugriff auf Prognosemärkte und Handel auf Kalshi
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="kalshi"
  color="#09C285"
/>

{/* MANUAL-CONTENT-START:intro */}
[Kalshi](https://kalshi.com) ist eine bundesweit regulierte Börse, an der Nutzer direkt mit den Ergebnissen zukünftiger Ereignisse handeln können – Prognosemärkte. Kalshis robuste API und Sim-Integration ermöglichen es Agenten und Workflows, programmatisch auf alle Aspekte der Plattform zuzugreifen und unterstützen alles von Forschung und Analyse bis hin zu automatisiertem Handel und Überwachung.

Mit Kalshis Integration in Sim können Sie:

- **Markt- & Ereignisdaten:** Echtzeit- und historische Daten für Märkte und Ereignisse suchen, filtern und abrufen; detaillierte Informationen zum Marktstatus, Serien, Ereignisgruppierungen und mehr abrufen.
- **Konto- & Guthaben-Management:** Zugriff auf Kontostände, verfügbare Mittel und Überwachung von Echtzeit-Positionen.
- **Auftrags- & Handelsmanagement:** Neue Aufträge platzieren, bestehende stornieren, offene Aufträge einsehen, ein Live-Orderbuch abrufen und auf vollständige Handelshistorien zugreifen.
- **Ausführungsanalyse:** Abruf von aktuellen Trades, historischen Ausführungen und Candlestick-Daten für Backtesting oder Marktstrukturforschung.
- **Überwachung:** Börsenweiten oder serienspezifischen Status prüfen, Echtzeit-Updates über Marktänderungen oder Handelsunterbrechungen erhalten und Reaktionen automatisieren.
- **Automatisierungsbereit:** Entwicklung von End-to-End automatisierten Agenten und Dashboards, die Wahrscheinlichkeiten von Ereignissen in der realen Welt konsumieren, analysieren und damit handeln.

Durch die Nutzung dieser einheitlichen Tools und Endpunkte können Sie Kalshis Prognosemärkte, Live-Handelsfunktionen und umfangreiche Ereignisdaten nahtlos in Ihre KI-gestützten Anwendungen, Dashboards und Workflows integrieren – und so eine anspruchsvolle, automatisierte Entscheidungsfindung ermöglichen, die an reale Ergebnisse gekoppelt ist.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Kalshi-Prognosemärkte in den Workflow. Kann Märkte, Markt, Ereignisse, Ereignis, Kontostand, Positionen, Aufträge, Orderbuch, Trades, Candlesticks, Ausführungen, Serien, Börsenstatus abrufen und Trades platzieren/stornieren/ändern.

## Tools

### `kalshi_get_markets`

Rufe eine Liste von Prognosemärkten von Kalshi mit optionaler Filterung ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `status` | string | Nein | Nach Status filtern \(unopened, open, closed, settled\) |
| `seriesTicker` | string | Nein | Nach Serien-Ticker filtern |
| `eventTicker` | string | Nein | Nach Event-Ticker filtern |
| `limit` | string | Nein | Anzahl der Ergebnisse \(1-1000, standard: 100\) |
| `cursor` | string | Nein | Paginierungscursor für die nächste Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `markets` | array | Array von Markt-Objekten |
| `paging` | object | Paginierungscursor zum Abrufen weiterer Ergebnisse |

### `kalshi_get_market`

Rufe Details eines bestimmten Prognosemarkts nach Ticker ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | Ja | Der Markt-Ticker \(z.B. "KXBTC-24DEC31"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `market` | object | Markt-Objekt mit Details |

### `kalshi_get_events`

Rufe eine Liste von Events von Kalshi mit optionaler Filterung ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `status` | string | Nein | Nach Status filtern \(open, closed, settled\) |
| `seriesTicker` | string | Nein | Nach Serien-Ticker filtern |
| `withNestedMarkets` | string | Nein | Verschachtelte Märkte in der Antwort einschließen \(true/false\) |
| `limit` | string | Nein | Anzahl der Ergebnisse \(1-200, standard: 200\) |
| `cursor` | string | Nein | Paginierungscursor für die nächste Seite |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `events` | array | Array von Ereignis-Objekten |
| `paging` | object | Paginierungscursor zum Abrufen weiterer Ergebnisse |

### `kalshi_get_event`

Details eines bestimmten Ereignisses anhand des Tickers abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `eventTicker` | string | Ja | Der Ereignis-Ticker |
| `withNestedMarkets` | string | Nein | Verschachtelte Märkte in die Antwort einbeziehen \(true/false\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `event` | object | Ereignis-Objekt mit Details |

### `kalshi_get_balance`

Kontostand und Portfoliowert von Kalshi abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `balance` | number | Kontostand in Cent |
| `portfolioValue` | number | Portfoliowert in Cent |
| `balanceDollars` | number | Kontostand in Dollar |
| `portfolioValueDollars` | number | Portfoliowert in Dollar |

### `kalshi_get_positions`

Offene Positionen von Kalshi abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `ticker` | string | Nein | Nach Markt-Ticker filtern |
| `eventTicker` | string | Nein | Nach Ereignis-Ticker filtern \(max. 10 durch Komma getrennt\) |
| `settlementStatus` | string | Nein | Nach Abrechnungsstatus filtern \(all, unsettled, settled\). Standard: unsettled |
| `limit` | string | Nein | Anzahl der Ergebnisse \(1-1000, Standard: 100\) |
| `cursor` | string | Nein | Paginierungscursor für die nächste Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `positions` | array | Array von Positions-Objekten |
| `paging` | object | Paginierungscursor zum Abrufen weiterer Ergebnisse |

### `kalshi_get_orders`

Rufen Sie Ihre Bestellungen von Kalshi mit optionaler Filterung ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `ticker` | string | Nein | Nach Markt-Ticker filtern |
| `eventTicker` | string | Nein | Nach Event-Ticker filtern \(maximal 10 durch Komma getrennt\) |
| `status` | string | Nein | Nach Status filtern \(resting, canceled, executed\) |
| `limit` | string | Nein | Anzahl der Ergebnisse \(1-200, Standard: 100\) |
| `cursor` | string | Nein | Paginierungscursor für die nächste Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `orders` | array | Array von Auftrags-Objekten |
| `paging` | object | Paginierungscursor zum Abrufen weiterer Ergebnisse |

### `kalshi_get_order`

Rufen Sie Details zu einem bestimmten Auftrag anhand der ID von Kalshi ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `orderId` | string | Ja | Die abzurufende Auftrags-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Auftrags-Objekt mit Details |

### `kalshi_get_orderbook`

Rufen Sie das Orderbuch (Ja- und Nein-Gebote) für einen bestimmten Markt ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | Ja | Markt-Ticker \(z.B. KXBTC-24DEC31\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `orderbook` | object | Orderbuch mit Ja/Nein-Geboten und -Anfragen |

### `kalshi_get_trades`

Rufen Sie aktuelle Trades über alle Märkte hinweg ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Nein | Anzahl der Ergebnisse \(1-1000, Standard: 100\) |
| `cursor` | string | Nein | Paginierungscursor für die nächste Seite |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `trades` | array | Array von Handelsobjekten |
| `paging` | object | Paginierungscursor zum Abrufen weiterer Ergebnisse |

### `kalshi_get_candlesticks`

OHLC-Kerzendaten für einen bestimmten Markt abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | Ja | Serien-Ticker |
| `ticker` | string | Ja | Markt-Ticker \(z.B. KXBTC-24DEC31\) |
| `startTs` | number | Ja | Startzeitstempel \(Unix-Sekunden\) |
| `endTs` | number | Ja | Endzeitstempel \(Unix-Sekunden\) |
| `periodInterval` | number | Ja | Periodenintervall: 1 \(1min\), 60 \(1Stunde\) oder 1440 \(1Tag\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `candlesticks` | array | Array von OHLC-Kerzendaten |

### `kalshi_get_fills`

Ihr Portfolio abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `ticker` | string | Nein | Nach Markt-Ticker filtern |
| `orderId` | string | Nein | Nach Bestell-ID filtern |
| `minTs` | number | Nein | Minimaler Zeitstempel \(Unix-Millisekunden\) |
| `maxTs` | number | Nein | Maximaler Zeitstempel \(Unix-Millisekunden\) |
| `limit` | string | Nein | Anzahl der Ergebnisse \(1-1000, Standard: 100\) |
| `cursor` | string | Nein | Paginierungscursor für die nächste Seite |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `fills` | array | Array von Ausführungs-/Handelsobjekten |
| `paging` | object | Paginierungscursor zum Abrufen weiterer Ergebnisse |

### `kalshi_get_series_by_ticker`

Details einer bestimmten Marktserie nach Ticker abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | Ja | Serien-Ticker |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `series` | object | Serienobjekt mit Details |

### `kalshi_get_exchange_status`

Den aktuellen Status der Kalshi-Börse abrufen (Handel und Börsenaktivität)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `status` | object | Börsenstatus mit trading_active und exchange_active Flags |

### `kalshi_create_order`

Eine neue Order auf einem Kalshi-Prognosemarkt erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `ticker` | string | Ja | Markt-Ticker \(z.B. KXBTC-24DEC31\) |
| `side` | string | Ja | Seite der Order: 'yes' oder 'no' |
| `action` | string | Ja | Aktionstyp: 'buy' oder 'sell' |
| `count` | string | Ja | Anzahl der Kontrakte \(mindestens 1\) |
| `type` | string | Nein | Ordertyp: 'limit' oder 'market' \(Standard: limit\) |
| `yesPrice` | string | Nein | Yes-Preis in Cent \(1-99\) |
| `noPrice` | string | Nein | No-Preis in Cent \(1-99\) |
| `yesPriceDollars` | string | Nein | Yes-Preis in Dollar \(z.B. "0.56"\) |
| `noPriceDollars` | string | Nein | No-Preis in Dollar \(z.B. "0.56"\) |
| `clientOrderId` | string | Nein | Benutzerdefinierte Order-ID |
| `expirationTs` | string | Nein | Unix-Zeitstempel für Order-Ablauf |
| `timeInForce` | string | Nein | Gültigkeitsdauer: 'fill_or_kill', 'good_till_canceled', 'immediate_or_cancel' |
| `buyMaxCost` | string | Nein | Maximale Kosten in Cent \(aktiviert automatisch fill_or_kill\) |
| `postOnly` | string | Nein | Auf 'true' setzen für Maker-Only-Orders |
| `reduceOnly` | string | Nein | Auf 'true' setzen für ausschließliche Positionsreduzierung |
| `selfTradePreventionType` | string | Nein | Selbsthandel-Prävention: 'taker_at_cross' oder 'maker' |
| `orderGroupId` | string | Nein | Zugehörige Ordergruppen-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Das erstellte Auftragsobjekt |

### `kalshi_cancel_order`

Einen bestehenden Auftrag auf Kalshi stornieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `orderId` | string | Ja | Die zu stornierende Auftrags-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Das stornierte Auftragsobjekt |
| `reducedBy` | number | Anzahl der stornierten Kontrakte |

### `kalshi_amend_order`

Preis oder Menge eines bestehenden Auftrags auf Kalshi ändern

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Ja | Ihre Kalshi API-Schlüssel-ID |
| `privateKey` | string | Ja | Ihr RSA Private Key \(PEM-Format\) |
| `orderId` | string | Ja | Die zu ändernde Auftrags-ID |
| `ticker` | string | Ja | Markt-Ticker |
| `side` | string | Ja | Seite des Auftrags: 'yes' oder 'no' |
| `action` | string | Ja | Aktionstyp: 'buy' oder 'sell' |
| `clientOrderId` | string | Ja | Die ursprüngliche vom Kunden angegebene Auftrags-ID |
| `updatedClientOrderId` | string | Ja | Die neue vom Kunden angegebene Auftrags-ID nach der Änderung |
| `count` | string | Nein | Aktualisierte Menge für den Auftrag |
| `yesPrice` | string | Nein | Aktualisierter Ja-Preis in Cent \(1-99\) |
| `noPrice` | string | Nein | Aktualisierter Nein-Preis in Cent \(1-99\) |
| `yesPriceDollars` | string | Nein | Aktualisierter Ja-Preis in Dollar \(z.B. "0.56"\) |
| `noPriceDollars` | string | Nein | Aktualisierter Nein-Preis in Dollar \(z.B. "0.56"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `order` | object | Das geänderte Auftragsobjekt |

## Hinweise

- Kategorie: `tools`
- Typ: `kalshi`
```

--------------------------------------------------------------------------------

````
