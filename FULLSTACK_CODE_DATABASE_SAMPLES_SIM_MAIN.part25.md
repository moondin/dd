---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 25
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 25 of 933)

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

---[FILE: gitlab.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/gitlab.mdx

```text
---
title: GitLab
description: Interagiere mit GitLab-Projekten, Issues, Merge Requests und Pipelines
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gitlab"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitLab](https://gitlab.com/) ist eine umfassende DevOps-Plattform, die Teams ermöglicht, ihren Software-Entwicklungszyklus zu verwalten, zusammenzuarbeiten und zu automatisieren. Mit GitLab kannst du mühelos Quellcodeverwaltung, CI/CD, Reviews und Zusammenarbeit in einer einzigen Anwendung handhaben.

Mit GitLab in Sim kannst du:

- **Projekte und Repositories verwalten**: Liste und rufe deine GitLab-Projekte ab, greife auf Details zu und organisiere deine Repositories
- **Mit Issues arbeiten**: Issues auflisten, erstellen und kommentieren, um Arbeit zu verfolgen und effektiv zusammenzuarbeiten
- **Merge Requests bearbeiten**: Überprüfe, erstelle und verwalte Merge Requests für Codeänderungen und Peer-Reviews
- **CI/CD-Pipelines automatisieren**: Starte, überwache und interagiere mit GitLab-Pipelines als Teil deiner Automatisierungsabläufe
- **Mit Kommentaren zusammenarbeiten**: Füge Kommentare zu Issues oder Merge Requests hinzu für eine effiziente Kommunikation innerhalb deines Teams

Mit Sims GitLab-Integration können deine Agenten programmatisch mit deinen GitLab-Projekten interagieren. Automatisiere Projektverwaltung, Issue-Tracking, Code-Reviews und Pipeline-Operationen nahtlos in deinen Workflows, optimiere deinen Software-Entwicklungsprozess und verbessere die Zusammenarbeit in deinem Team.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriere GitLab in den Workflow. Kann Projekte, Issues, Merge Requests, Pipelines verwalten und Kommentare hinzufügen. Unterstützt alle grundlegenden GitLab DevOps-Operationen.

## Tools

### `gitlab_list_projects`

GitLab-Projekte auflisten, auf die der authentifizierte Benutzer Zugriff hat

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `owned` | boolean | Nein | Beschränkung auf Projekte, die dem aktuellen Benutzer gehören |
| `membership` | boolean | Nein | Beschränkung auf Projekte, in denen der aktuelle Benutzer Mitglied ist |
| `search` | string | Nein | Projekte nach Namen durchsuchen |
| `visibility` | string | Nein | Nach Sichtbarkeit filtern \(public, internal, private\) |
| `orderBy` | string | Nein | Nach Feld sortieren \(id, name, path, created_at, updated_at, last_activity_at\) |
| `sort` | string | Nein | Sortierrichtung \(asc, desc\) |
| `perPage` | number | Nein | Anzahl der Ergebnisse pro Seite \(Standard 20, max 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `projects` | array | Liste der GitLab-Projekte |
| `total` | number | Gesamtanzahl der Projekte |

### `gitlab_get_project`

Details zu einem bestimmten GitLab-Projekt abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad \(z.B. "namespace/project"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `project` | object | Die GitLab-Projektdetails |

### `gitlab_list_issues`

Issues in einem GitLab-Projekt auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `state` | string | Nein | Nach Status filtern \(opened, closed, all\) |
| `labels` | string | Nein | Kommagetrennte Liste von Label-Namen |
| `assigneeId` | number | Nein | Nach Bearbeiter-Benutzer-ID filtern |
| `milestoneTitle` | string | Nein | Nach Meilenstein-Titel filtern |
| `search` | string | Nein | Issues nach Titel und Beschreibung durchsuchen |
| `orderBy` | string | Nein | Sortieren nach Feld \(created_at, updated_at\) |
| `sort` | string | Nein | Sortierrichtung \(asc, desc\) |
| `perPage` | number | Nein | Anzahl der Ergebnisse pro Seite \(Standard 20, max 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `issues` | array | Liste der GitLab-Issues |
| `total` | number | Gesamtanzahl der Issues |

### `gitlab_get_issue`

Details zu einem bestimmten GitLab-Issue abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `issueIid` | number | Ja | Issue-Nummer innerhalb des Projekts \(die # in der GitLab-UI angezeigt\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `issue` | object | Die GitLab-Issue-Details |

### `gitlab_create_issue`

Ein neues Issue in einem GitLab-Projekt erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `title` | string | Ja | Issue-Titel |
| `description` | string | Nein | Issue-Beschreibung \(Markdown unterstützt\) |
| `labels` | string | Nein | Kommagetrennte Liste von Label-Namen |
| `assigneeIds` | array | Nein | Array von Benutzer-IDs für die Zuweisung |
| `milestoneId` | number | Nein | Meilenstein-ID für die Zuweisung |
| `dueDate` | string | Nein | Fälligkeitsdatum im Format JJJJ-MM-TT |
| `confidential` | boolean | Nein | Ob das Issue vertraulich ist |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `issue` | object | Das erstellte GitLab-Issue |

### `gitlab_update_issue`

Ein bestehendes Issue in einem GitLab-Projekt aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `issueIid` | number | Ja | Interne Issue-ID (IID) |
| `title` | string | Nein | Neuer Issue-Titel |
| `description` | string | Nein | Neue Issue-Beschreibung (Markdown unterstützt) |
| `stateEvent` | string | Nein | Status-Event (close oder reopen) |
| `labels` | string | Nein | Kommagetrennte Liste von Label-Namen |
| `assigneeIds` | array | Nein | Array von Benutzer-IDs für die Zuweisung |
| `milestoneId` | number | Nein | Meilenstein-ID für die Zuweisung |
| `dueDate` | string | Nein | Fälligkeitsdatum im Format JJJJ-MM-TT |
| `confidential` | boolean | Nein | Ob das Issue vertraulich ist |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `issue` | object | Das aktualisierte GitLab-Issue |

### `gitlab_delete_issue`

Ein Issue aus einem GitLab-Projekt löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `issueIid` | number | Ja | Interne Issue-ID (IID) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Issue erfolgreich gelöscht wurde |

### `gitlab_create_issue_note`

Einen Kommentar zu einem GitLab-Issue hinzufügen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `issueIid` | number | Ja | Interne Issue-ID (IID) |
| `body` | string | Ja | Kommentartext (Markdown unterstützt) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `note` | object | Der erstellte Kommentar |

### `gitlab_list_merge_requests`

Merge-Requests in einem GitLab-Projekt auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `state` | string | Nein | Nach Status filtern (opened, closed, merged, all) |
| `labels` | string | Nein | Kommagetrennte Liste von Label-Namen |
| `sourceBranch` | string | Nein | Nach Quell-Branch filtern |
| `targetBranch` | string | Nein | Nach Ziel-Branch filtern |
| `orderBy` | string | Nein | Sortieren nach Feld (created_at, updated_at) |
| `sort` | string | Nein | Sortierrichtung (asc, desc) |
| `perPage` | number | Nein | Anzahl der Ergebnisse pro Seite (Standard 20, max 100) |
| `page` | number | Nein | Seitennummer für Paginierung |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `mergeRequests` | array | Liste der GitLab Merge-Requests |
| `total` | number | Gesamtanzahl der Merge-Requests |

### `gitlab_get_merge_request`

Details zu einem bestimmten GitLab Merge-Request abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `mergeRequestIid` | number | Ja | Interne ID des Merge-Requests \(IID\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `mergeRequest` | object | Die Details des GitLab Merge-Requests |

### `gitlab_create_merge_request`

Einen neuen Merge-Request in einem GitLab-Projekt erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `sourceBranch` | string | Ja | Name des Quellbranches |
| `targetBranch` | string | Ja | Name des Zielbranches |
| `title` | string | Ja | Titel des Merge-Requests |
| `description` | string | Nein | Beschreibung des Merge-Requests \(Markdown unterstützt\) |
| `labels` | string | Nein | Kommagetrennte Liste von Label-Namen |
| `assigneeIds` | array | Nein | Array von Benutzer-IDs für die Zuweisung |
| `milestoneId` | number | Nein | Meilenstein-ID für die Zuweisung |
| `removeSourceBranch` | boolean | Nein | Quellbranch nach dem Merge löschen |
| `squash` | boolean | Nein | Commits beim Merge zusammenfassen |
| `draft` | boolean | Nein | Als Entwurf markieren \(in Bearbeitung\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `mergeRequest` | object | Der erstellte GitLab Merge Request |

### `gitlab_update_merge_request`

Einen bestehenden Merge Request in einem GitLab-Projekt aktualisieren

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Projekt-ID oder URL-kodierter Pfad |
| `mergeRequestIid` | number | Yes | Interne ID des Merge Requests \(IID\) |
| `title` | string | No | Neuer Titel des Merge Requests |
| `description` | string | No | Neue Beschreibung des Merge Requests |
| `stateEvent` | string | No | Status-Event \(close oder reopen\) |
| `labels` | string | No | Kommagetrennte Liste von Label-Namen |
| `assigneeIds` | array | No | Array von Benutzer-IDs für die Zuweisung |
| `milestoneId` | number | No | Meilenstein-ID für die Zuweisung |
| `targetBranch` | string | No | Neuer Ziel-Branch |
| `removeSourceBranch` | boolean | No | Quell-Branch nach dem Merge löschen |
| `squash` | boolean | No | Commits beim Merge zusammenfassen |
| `draft` | boolean | No | Als Entwurf markieren \(work in progress\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `mergeRequest` | object | Der aktualisierte GitLab Merge Request |

### `gitlab_merge_merge_request`

Einen Merge Request in einem GitLab-Projekt zusammenführen

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Projekt-ID oder URL-kodierter Pfad |
| `mergeRequestIid` | number | Yes | Interne ID des Merge Requests \(IID\) |
| `mergeCommitMessage` | string | No | Benutzerdefinierte Merge-Commit-Nachricht |
| `squashCommitMessage` | string | No | Benutzerdefinierte Squash-Commit-Nachricht |
| `squash` | boolean | No | Commits vor dem Merge zusammenfassen |
| `shouldRemoveSourceBranch` | boolean | No | Quell-Branch nach dem Merge löschen |
| `mergeWhenPipelineSucceeds` | boolean | No | Merge durchführen, wenn Pipeline erfolgreich ist |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `mergeRequest` | object | Der zusammengeführte GitLab Merge Request |

### `gitlab_create_merge_request_note`

Einen Kommentar zu einem GitLab Merge Request hinzufügen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-kodierter Pfad |
| `mergeRequestIid` | number | Ja | Interne ID des Merge Requests \(IID\) |
| `body` | string | Ja | Kommentartext \(Markdown wird unterstützt\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `note` | object | Der erstellte Kommentar |

### `gitlab_list_pipelines`

Pipelines in einem GitLab-Projekt auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-kodierter Pfad |
| `ref` | string | Nein | Nach Ref filtern \(Branch oder Tag\) |
| `status` | string | Nein | Nach Status filtern \(created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled\) |
| `orderBy` | string | Nein | Sortieren nach Feld \(id, status, ref, updated_at, user_id\) |
| `sort` | string | Nein | Sortierrichtung \(asc, desc\) |
| `perPage` | number | Nein | Anzahl der Ergebnisse pro Seite \(Standard 20, max 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pipelines` | array | Liste der GitLab-Pipelines |
| `total` | number | Gesamtanzahl der Pipelines |

### `gitlab_get_pipeline`

Details zu einer bestimmten GitLab-Pipeline abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `pipelineId` | number | Ja | Pipeline-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pipeline` | object | Die GitLab-Pipeline-Details |

### `gitlab_create_pipeline`

Eine neue Pipeline in einem GitLab-Projekt auslösen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `ref` | string | Ja | Branch oder Tag, auf dem die Pipeline ausgeführt werden soll |
| `variables` | array | Nein | Array von Variablen für die Pipeline \(jede mit key, value und optionalem variable_type\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pipeline` | object | Die erstellte GitLab-Pipeline |

### `gitlab_retry_pipeline`

Eine fehlgeschlagene GitLab-Pipeline wiederholen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `pipelineId` | number | Ja | Pipeline-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pipeline` | object | Die wiederholte GitLab-Pipeline |

### `gitlab_cancel_pipeline`

Eine laufende GitLab-Pipeline abbrechen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Projekt-ID oder URL-codierter Pfad |
| `pipelineId` | number | Ja | Pipeline-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pipeline` | object | Die abgebrochene GitLab-Pipeline |

## Hinweise

- Kategorie: `tools`
- Typ: `gitlab`
```

--------------------------------------------------------------------------------

---[FILE: gmail.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/gmail.mdx

```text
---
title: Gmail
description: Gmail-Nachrichten senden, lesen, suchen und verschieben oder
  Workflows durch Gmail-Ereignisse auslösen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gmail"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Gmail](https://gmail.com) ist Googles beliebter E-Mail-Dienst, der eine robuste Plattform zum Senden, Empfangen und Verwalten von E-Mail-Kommunikation bietet. Mit über 1,8 Milliarden aktiven Nutzern weltweit bietet Gmail eine funktionsreiche Erfahrung mit leistungsstarken Suchfunktionen, Organisationstools und Integrationsoptionen.

Mit Gmail können Sie:

- **E-Mails senden und empfangen**: Kommunizieren Sie mit Kontakten über eine übersichtliche, intuitive Benutzeroberfläche
- **Nachrichten organisieren**: Verwenden Sie Labels, Ordner und Filter, um Ihren Posteingang zu organisieren
- **Effizient suchen**: Finden Sie bestimmte Nachrichten schnell mit Googles leistungsstarker Suchtechnologie
- **Workflows automatisieren**: Erstellen Sie Filter und Regeln, um eingehende E-Mails automatisch zu verarbeiten
- **Von überall zugreifen**: Nutzen Sie Gmail geräteübergreifend mit synchronisierten Inhalten und Einstellungen
- **Mit anderen Diensten integrieren**: Verbinden Sie sich mit Google Kalender, Drive und anderen Produktivitätstools

In Sim ermöglicht die Gmail-Integration Ihren Agenten, E-Mails programmgesteuert mit umfassenden Automatisierungsfunktionen zu verwalten. Dies erlaubt leistungsstarke Automatisierungsszenarien wie das Senden von Benachrichtigungen, die Verarbeitung eingehender Nachrichten, das Extrahieren von Informationen aus E-Mails und die Verwaltung von Kommunikationsabläufen im großen Maßstab. Ihre Agenten können:

- **Verfassen und senden**: Personalisierte E-Mails mit Anhängen erstellen und an Empfänger senden
- **Lesen und suchen**: Bestimmte Nachrichten mit Gmails Abfragesyntax finden und Inhalte extrahieren
- **Intelligent organisieren**: Nachrichten als gelesen/ungelesen markieren, E-Mails archivieren oder aus dem Archiv holen und Labels verwalten
- **Posteingang aufräumen**: Nachrichten löschen, E-Mails zwischen Labels verschieben und einen leeren Posteingang pflegen
- **Workflows auslösen**: In Echtzeit auf neue E-Mails hören und reaktionsfähige Workflows ermöglichen, die auf eingehende Nachrichten reagieren

Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und E-Mail-Kommunikationen und ermöglicht eine nahtlose Interaktion mit einer der weltweit am häufigsten genutzten Kommunikationsplattformen. Ob Sie Kundenservice-Antworten automatisieren, Belege verarbeiten, Abonnements verwalten oder Teamkommunikation koordinieren - die Gmail-Integration bietet alle Werkzeuge, die Sie für eine umfassende E-Mail-Automatisierung benötigen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Gmail in den Workflow. Kann E-Mails senden, lesen, suchen und verschieben. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn eine neue E-Mail empfangen wird.

## Tools

### `gmail_send`

E-Mails mit Gmail senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `to` | string | Ja | E-Mail-Adresse des Empfängers |
| `subject` | string | Nein | Betreff der E-Mail |
| `body` | string | Ja | Inhalt der E-Mail |
| `contentType` | string | Nein | Inhaltstyp für den E-Mail-Text (text oder html) |
| `threadId` | string | Nein | Thread-ID für Antworten (für Threading) |
| `replyToMessageId` | string | Nein | Gmail-Nachrichten-ID für Antworten - verwenden Sie das "id"-Feld aus den Gmail-Leseergebnissen (nicht die RFC "messageId") |
| `cc` | string | Nein | CC-Empfänger (durch Kommas getrennt) |
| `bcc` | string | Nein | BCC-Empfänger (durch Kommas getrennt) |
| `attachments` | file[] | Nein | Dateien, die an die E-Mail angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_draft`

E-Mail-Entwürfe in Gmail erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `to` | string | Ja | E-Mail-Adresse des Empfängers |
| `subject` | string | Nein | Betreff der E-Mail |
| `body` | string | Ja | Inhalt der E-Mail |
| `contentType` | string | Nein | Inhaltstyp für den E-Mail-Text (text oder html) |
| `threadId` | string | Nein | Thread-ID für Antworten (für Threading) |
| `replyToMessageId` | string | Nein | Gmail-Nachrichten-ID für Antworten - verwenden Sie das "id"-Feld aus den Gmail-Leseergebnissen (nicht die RFC "messageId") |
| `cc` | string | Nein | CC-Empfänger (durch Kommas getrennt) |
| `bcc` | string | Nein | BCC-Empfänger (durch Kommas getrennt) |
| `attachments` | file[] | Nein | Dateien, die an den E-Mail-Entwurf angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Entwurfs-Metadaten |

### `gmail_read`

E-Mails aus Gmail lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Nein | ID der zu lesenden Nachricht |
| `folder` | string | Nein | Ordner/Label, aus dem E-Mails gelesen werden sollen |
| `unreadOnly` | boolean | Nein | Nur ungelesene Nachrichten abrufen |
| `maxResults` | number | Nein | Maximale Anzahl abzurufender Nachrichten \(Standard: 1, max: 10\) |
| `includeAttachments` | boolean | Nein | E-Mail-Anhänge herunterladen und einschließen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Textinhalt der E-Mail |
| `metadata` | json | Metadaten der E-Mail |
| `attachments` | file[] | Anhänge der E-Mail |

### `gmail_search`

E-Mails in Gmail durchsuchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchanfrage für E-Mails |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Zusammenfassung der Suchergebnisse |
| `metadata` | object | Such-Metadaten |

### `gmail_move`

E-Mails zwischen Gmail-Labels/Ordnern verschieben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der zu verschiebenden Nachricht |
| `addLabelIds` | string | Ja | Kommagetrennte Label-IDs zum Hinzufügen \(z.B. INBOX, Label_123\) |
| `removeLabelIds` | string | Nein | Kommagetrennte Label-IDs zum Entfernen \(z.B. INBOX, SPAM\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_mark_read`

Eine Gmail-Nachricht als gelesen markieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der als gelesen zu markierenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_mark_unread`

Eine Gmail-Nachricht als ungelesen markieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der Nachricht, die als ungelesen markiert werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_archive`

Eine Gmail-Nachricht archivieren (aus dem Posteingang entfernen)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der zu archivierenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_unarchive`

Eine Gmail-Nachricht aus dem Archiv holen (zurück in den Posteingang verschieben)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der Nachricht, die aus dem Archiv geholt werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_delete`

Eine Gmail-Nachricht löschen (in den Papierkorb verschieben)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der zu löschenden Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_add_label`

Label(s) zu einer Gmail-Nachricht hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der Nachricht, zu der Labels hinzugefügt werden sollen |
| `labelIds` | string | Ja | Durch Kommas getrennte Label-IDs zum Hinzufügen \(z.B. INBOX, Label_123\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

### `gmail_remove_label`

Label(s) von einer Gmail-Nachricht entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Ja | ID der Nachricht, von der Labels entfernt werden sollen |
| `labelIds` | string | Ja | Durch Kommas getrennte Label-IDs zum Entfernen \(z.B. INBOX, Label_123\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | E-Mail-Metadaten |

## Hinweise

- Kategorie: `tools`
- Typ: `gmail`
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_calendar.mdx

```text
---
title: Google Kalender
description: Google Kalender-Ereignisse verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_calendar"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Kalender](https://calendar.google.com) ist Googles leistungsstarker Kalender- und Planungsdienst, der eine umfassende Plattform für die Verwaltung von Ereignissen, Meetings und Terminen bietet. Mit nahtloser Integration in Googles Ökosystem und weitverbreiteter Nutzung bietet Google Kalender robuste Funktionen für persönliche und berufliche Planungsbedürfnisse.

Mit Google Kalender können Sie:

- **Ereignisse erstellen und verwalten**: Planen Sie Meetings, Termine und Erinnerungen mit detaillierten Informationen
- **Kalendereinladungen versenden**: Benachrichtigen und koordinieren Sie automatisch mit Teilnehmern durch E-Mail-Einladungen
- **Ereigniserstellung mit natürlicher Sprache**: Fügen Sie schnell Ereignisse mit Umgangssprache hinzu, wie "Meeting mit John morgen um 15 Uhr"
- **Ereignisse anzeigen und suchen**: Finden und greifen Sie einfach auf Ihre geplanten Ereignisse über mehrere Kalender hinweg zu
- **Mehrere Kalender verwalten**: Organisieren Sie verschiedene Arten von Ereignissen über verschiedene Kalender hinweg

In Sim ermöglicht die Google Kalender-Integration Ihren Agenten, Kalenderereignisse programmatisch zu erstellen, zu lesen und zu verwalten. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie das Planen von Meetings, das Versenden von Kalendereinladungen, das Überprüfen der Verfügbarkeit und das Verwalten von Ereignisdetails. Ihre Agenten können Ereignisse mit natürlichsprachlicher Eingabe erstellen, automatisierte Kalendereinladungen an Teilnehmer senden, Ereignisinformationen abrufen und bevorstehende Ereignisse auflisten. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und der Kalenderverwaltung und ermöglicht eine nahtlose Planungsautomatisierung und Koordination mit einer der weltweit am häufigsten genutzten Kalenderplattformen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriert Google Kalender in den Workflow. Kann Kalenderereignisse erstellen, lesen, aktualisieren und auflisten. Erfordert OAuth.

## Tools

### `google_calendar_create`

Erstellt ein neues Ereignis in Google Kalender

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | Nein | Kalender-ID (standardmäßig primary) |
| `summary` | string | Ja | Ereignistitel/Zusammenfassung |
| `description` | string | Nein | Ereignisbeschreibung |
| `location` | string | Nein | Ereignisort |
| `startDateTime` | string | Ja | Startdatum und -uhrzeit. MUSS Zeitzonen-Offset enthalten (z.B. 2025-06-03T10:00:00-08:00) ODER timeZone-Parameter bereitstellen |
| `endDateTime` | string | Ja | Enddatum und -uhrzeit. MUSS Zeitzonen-Offset enthalten (z.B. 2025-06-03T11:00:00-08:00) ODER timeZone-Parameter bereitstellen |
| `timeZone` | string | Nein | Zeitzone (z.B. America/Los_Angeles). Erforderlich, wenn datetime keinen Offset enthält. Standardmäßig America/Los_Angeles, wenn nicht angegeben. |
| `attendees` | array | Nein | Array von E-Mail-Adressen der Teilnehmer |
| `sendUpdates` | string | Nein | Wie Updates an Teilnehmer gesendet werden: all, externalOnly oder none |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Bestätigungsnachricht zur Ereigniserstellung |
| `metadata` | json | Metadaten des erstellten Ereignisses einschließlich ID, Status und Details |

### `google_calendar_list`

Ereignisse aus Google Kalender auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | Nein | Kalender-ID \(standardmäßig primary\) |
| `timeMin` | string | Nein | Untere Grenze für Ereignisse \(RFC3339-Zeitstempel, z.B. 2025-06-03T00:00:00Z\) |
| `timeMax` | string | Nein | Obere Grenze für Ereignisse \(RFC3339-Zeitstempel, z.B. 2025-06-04T00:00:00Z\) |
| `orderBy` | string | Nein | Reihenfolge der zurückgegebenen Ereignisse \(startTime oder updated\) |
| `showDeleted` | boolean | Nein | Gelöschte Ereignisse einbeziehen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Zusammenfassung der gefundenen Ereignisanzahl |
| `metadata` | json | Liste der Ereignisse mit Paginierungstoken und Ereignisdetails |

### `google_calendar_get`

Ein bestimmtes Ereignis aus Google Kalender abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | Nein | Kalender-ID (standardmäßig primary) |
| `eventId` | string | Ja | Ereignis-ID zum Abrufen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Bestätigungsnachricht zum Abrufen des Ereignisses |
| `metadata` | json | Ereignisdetails einschließlich ID, Status, Zeiten und Teilnehmer |

### `google_calendar_quick_add`

Ereignisse aus natürlichsprachlichem Text erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | Nein | Kalender-ID (standardmäßig primary) |
| `text` | string | Ja | Natürlichsprachlicher Text, der das Ereignis beschreibt (z.B. "Meeting mit John morgen um 15 Uhr") |
| `attendees` | array | Nein | Array von E-Mail-Adressen der Teilnehmer (auch durch Komma getrennte Zeichenfolge akzeptiert) |
| `sendUpdates` | string | Nein | Wie Updates an Teilnehmer gesendet werden: all, externalOnly oder none |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Bestätigungsnachricht zur Ereigniserstellung aus natürlicher Sprache |
| `metadata` | json | Metadaten des erstellten Ereignisses einschließlich analysierter Details |

### `google_calendar_invite`

Teilnehmer zu einem bestehenden Google Kalender-Ereignis einladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | Nein | Kalender-ID (standardmäßig primär) |
| `eventId` | string | Ja | Ereignis-ID, zu der Teilnehmer eingeladen werden sollen |
| `attendees` | array | Ja | Array von E-Mail-Adressen der einzuladenden Teilnehmer |
| `sendUpdates` | string | Nein | Wie Updates an Teilnehmer gesendet werden: all, externalOnly oder none |
| `replaceExisting` | boolean | Nein | Ob bestehende Teilnehmer ersetzt oder hinzugefügt werden sollen (standardmäßig false) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Bestätigungsnachricht für die Teilnehmereinladung mit E-Mail-Zustellungsstatus |
| `metadata` | json | Aktualisierte Ereignismetadaten einschließlich Teilnehmerliste und Details |

## Hinweise

- Kategorie: `tools`
- Typ: `google_calendar`
```

--------------------------------------------------------------------------------

---[FILE: google_docs.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/google_docs.mdx

```text
---
title: Google Docs
description: Dokumente lesen, schreiben und erstellen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_docs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Docs](https://docs.google.com) ist ein leistungsstarker cloudbasierter Dienst zur Dokumentenerstellung und -bearbeitung, der es Benutzern ermöglicht, Dokumente in Echtzeit zu erstellen, zu bearbeiten und gemeinsam daran zu arbeiten. Als Teil der Google-Produktivitätssuite bietet Google Docs eine vielseitige Plattform für Textdokumente mit umfangreichen Formatierungs-, Kommentierungs- und Freigabefunktionen.

Erfahren Sie, wie Sie das Google Docs "Lesen"-Tool in Sim integrieren, um mühelos Daten aus Ihren Dokumenten abzurufen und in Ihre Workflows zu integrieren. Dieses Tutorial führt Sie durch die Verbindung mit Google Docs, die Einrichtung von Datenabfragen und die Verwendung dieser Informationen zur Automatisierung von Prozessen in Echtzeit. Perfekt für die Synchronisierung von Live-Daten mit Ihren Agenten.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/f41gy9rBHhE"
  title="Use the Google Docs Read tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Erfahren Sie, wie Sie das Google Docs "Aktualisieren"-Tool in Sim integrieren, um mühelos Inhalte in Ihren Dokumenten über Ihre Workflows hinzuzufügen. Dieses Tutorial führt Sie durch die Verbindung mit Google Docs, die Konfiguration von Datenschreibvorgängen und die Verwendung dieser Informationen zur nahtlosen Automatisierung von Dokumentaktualisierungen. Perfekt für die Pflege dynamischer Echtzeit-Dokumentation mit minimalem Aufwand.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/L64ROHS2ivA"
  title="Use the Google Docs Update tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Erfahren Sie, wie Sie das Google Docs "Erstellen"-Tool in Sim integrieren, um mühelos neue Dokumente über Ihre Workflows zu generieren. Dieses Tutorial führt Sie durch die Verbindung mit Google Docs, die Einrichtung der Dokumentenerstellung und die Verwendung von Workflow-Daten zur automatischen Befüllung von Inhalten. Perfekt für die Rationalisierung der Dokumentenerstellung und die Steigerung der Produktivität.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/lWpHH4qddWk"
  title="Verwenden Sie das Google Docs Erstellungstool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Mit Google Docs können Sie:

- **Dokumente erstellen und bearbeiten**: Textdokumente mit umfassenden Formatierungsoptionen entwickeln
- **In Echtzeit zusammenarbeiten**: Gleichzeitig mit mehreren Benutzern am selben Dokument arbeiten
- **Änderungen verfolgen**: Versionsverlauf anzeigen und frühere Versionen wiederherstellen
- **Kommentieren und vorschlagen**: Feedback geben und Änderungen vorschlagen, ohne den Originalinhalt zu verändern
- **Von überall zugreifen**: Google Docs geräteübergreifend nutzen mit automatischer Cloud-Synchronisierung
- **Offline arbeiten**: Ohne Internetverbindung weiterarbeiten, wobei Änderungen synchronisiert werden, sobald Sie wieder online sind
- **Mit anderen Diensten integrieren**: Verbindung mit Google Drive, Sheets, Slides und Drittanbieteranwendungen herstellen

In Sim ermöglicht die Google Docs-Integration Ihren Agenten, direkt programmatisch mit Dokumentinhalten zu interagieren. Dies erlaubt leistungsstarke Automatisierungsszenarien wie Dokumenterstellung, Inhaltsextraktion, kollaboratives Bearbeiten und Dokumentenverwaltung. Ihre Agenten können bestehende Dokumente lesen, um Informationen zu extrahieren, in Dokumente schreiben, um Inhalte zu aktualisieren, und neue Dokumente von Grund auf erstellen. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und der Dokumentenverwaltung und ermöglicht eine nahtlose Interaktion mit einer der weltweit am häufigsten genutzten Dokumentenplattformen. Durch die Verbindung von Sim mit Google Docs können Sie Dokumenten-Workflows automatisieren, Berichte generieren, Erkenntnisse aus Dokumenten extrahieren und Dokumentationen pflegen - alles durch Ihre intelligenten Agenten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Google Docs in den Workflow. Kann Dokumente lesen, schreiben und erstellen. Erfordert OAuth.

## Tools

### `google_docs_read`

Inhalte aus einem Google Docs-Dokument lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | Ja | Die ID des zu lesenden Dokuments |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Extrahierter Textinhalt des Dokuments |
| `metadata` | json | Dokument-Metadaten einschließlich ID, Titel und URL |

### `google_docs_write`

Inhalte in einem Google Docs-Dokument schreiben oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | Ja | Die ID des Dokuments, in das geschrieben werden soll |
| `content` | string | Ja | Der Inhalt, der in das Dokument geschrieben werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Gibt an, ob der Dokumentinhalt erfolgreich aktualisiert wurde |
| `metadata` | json | Aktualisierte Dokument-Metadaten einschließlich ID, Titel und URL |

### `google_docs_create`

Ein neues Google Docs-Dokument erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Der Titel des zu erstellenden Dokuments |
| `content` | string | Nein | Der Inhalt des zu erstellenden Dokuments |
| `folderSelector` | string | Nein | Wählen Sie den Ordner aus, in dem das Dokument erstellt werden soll |
| `folderId` | string | Nein | Die ID des Ordners, in dem das Dokument erstellt werden soll \(interne Verwendung\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `metadata` | json | Metadaten des erstellten Dokuments einschließlich ID, Titel und URL |

## Hinweise

- Kategorie: `tools`
- Typ: `google_docs`
```

--------------------------------------------------------------------------------

````
