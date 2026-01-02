---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 44
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 44 of 933)

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

---[FILE: sendgrid.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/sendgrid.mdx

```text
---
title: SendGrid
description: Senden Sie E-Mails und verwalten Sie Kontakte, Listen und Vorlagen mit SendGrid
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sendgrid"
  color="#1A82E2"
/>

{/* MANUAL-CONTENT-START:intro */}
[SendGrid](https://sendgrid.com) ist eine führende cloudbasierte E-Mail-Zustellplattform, der Entwickler und Unternehmen vertrauen, um zuverlässige Transaktions- und Marketing-E-Mails in großem Umfang zu versenden. Mit seinen robusten APIs und leistungsstarken Tools ermöglicht SendGrid die Verwaltung aller Aspekte Ihrer E-Mail-Kommunikation, vom Versenden von Benachrichtigungen und Quittungen bis hin zur Verwaltung komplexer Marketingkampagnen.

SendGrid bietet Benutzern eine vollständige Suite von E-Mail-Funktionen, mit denen Sie kritische E-Mail-Workflows automatisieren und Kontaktlisten, Vorlagen und Empfängerengagement genau verwalten können. Die nahtlose Integration mit Sim ermöglicht es Agenten und Workflows, gezielte Nachrichten zu versenden, dynamische Kontakt- und Empfängerlisten zu pflegen, personalisierte E-Mails über Vorlagen auszulösen und die Ergebnisse in Echtzeit zu verfolgen.

Zu den wichtigsten Funktionen von SendGrid gehören:

- **Transaktions-E-Mails:** Versenden Sie automatisierte und umfangreiche Transaktions-E-Mails (wie Benachrichtigungen, Quittungen und Passwort-Zurücksetzungen).
- **Dynamische Vorlagen:** Verwenden Sie umfangreiche HTML- oder Textvorlagen mit dynamischen Daten für hochpersonalisierte Kommunikation im großen Maßstab.
- **Kontaktverwaltung:** Fügen Sie Marketing-Kontakte hinzu und aktualisieren Sie diese, verwalten Sie Empfängerlisten und Zielsegmente für Kampagnen.
- **Unterstützung für Anhänge:** Fügen Sie Ihren E-Mails einen oder mehrere Dateianhänge hinzu.
- **Umfassende API-Abdeckung:** Verwalten Sie E-Mails, Kontakte, Listen, Vorlagen, Unterdrückungsgruppen und mehr programmatisch.

Durch die Verbindung von SendGrid mit Sim können Ihre Agenten:

- Sowohl einfache als auch fortgeschrittene (vorlagenbasierte oder an mehrere Empfänger gerichtete) E-Mails als Teil eines beliebigen Workflows versenden.
- Kontakte und Listen automatisch verwalten und segmentieren.
- Vorlagen für Konsistenz und dynamische Personalisierung nutzen.
- E-Mail-Engagement innerhalb Ihrer automatisierten Prozesse verfolgen und darauf reagieren.

Diese Integration ermöglicht es Ihnen, alle kritischen Kommunikationsabläufe zu automatisieren, sicherzustellen, dass Nachrichten die richtige Zielgruppe erreichen, und die Kontrolle über die E-Mail-Strategie Ihrer Organisation direkt aus Sim-Workflows zu behalten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie SendGrid in Ihren Workflow. Senden Sie transaktionale E-Mails, verwalten Sie Marketing-Kontakte und -Listen und arbeiten Sie mit E-Mail-Vorlagen. Unterstützt dynamische Vorlagen, Anhänge und umfassendes Kontaktmanagement.

## Tools

### `sendgrid_send_mail`

Eine E-Mail über die SendGrid API senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `from` | string | Ja | E-Mail-Adresse des Absenders \(muss in SendGrid verifiziert sein\) |
| `fromName` | string | Nein | Name des Absenders |
| `to` | string | Ja | E-Mail-Adresse des Empfängers |
| `toName` | string | Nein | Name des Empfängers |
| `subject` | string | Nein | E-Mail-Betreff \(erforderlich, es sei denn, es wird eine Vorlage mit vordefiniertem Betreff verwendet\) |
| `content` | string | Nein | E-Mail-Inhalt \(erforderlich, es sei denn, es wird eine Vorlage mit vordefiniertem Inhalt verwendet\) |
| `contentType` | string | Nein | Inhaltstyp \(text/plain oder text/html\) |
| `cc` | string | Nein | CC E-Mail-Adresse |
| `bcc` | string | Nein | BCC E-Mail-Adresse |
| `replyTo` | string | Nein | Antwort-an E-Mail-Adresse |
| `replyToName` | string | Nein | Antwort-an Name |
| `attachments` | file[] | Nein | Dateien, die der E-Mail angehängt werden sollen |
| `templateId` | string | Nein | Zu verwendende SendGrid-Vorlagen-ID |
| `dynamicTemplateData` | json | Nein | JSON-Objekt mit dynamischen Vorlagendaten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die E-Mail erfolgreich gesendet wurde |
| `messageId` | string | SendGrid-Nachrichten-ID |
| `to` | string | E-Mail-Adresse des Empfängers |
| `subject` | string | E-Mail-Betreff |

### `sendgrid_add_contact`

Einen neuen Kontakt zu SendGrid hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `email` | string | Ja | E-Mail-Adresse des Kontakts |
| `firstName` | string | Nein | Vorname des Kontakts |
| `lastName` | string | Nein | Nachname des Kontakts |
| `customFields` | json | Nein | JSON-Objekt mit benutzerdefinierten Feld-Schlüssel-Wert-Paaren \(verwende Feld-IDs wie e1_T, e2_N, e3_D, nicht Feldnamen\) |
| `listIds` | string | Nein | Kommagetrennte Listen-IDs, zu denen der Kontakt hinzugefügt werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobId` | string | Job-ID zur Verfolgung der asynchronen Kontakterstellung |
| `email` | string | E-Mail-Adresse des Kontakts |
| `firstName` | string | Vorname des Kontakts |
| `lastName` | string | Nachname des Kontakts |
| `message` | string | Statusmeldung |

### `sendgrid_get_contact`

Einen bestimmten Kontakt anhand der ID von SendGrid abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `contactId` | string | Ja | Kontakt-ID |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Kontakt-ID |
| `email` | string | E-Mail-Adresse des Kontakts |
| `firstName` | string | Vorname des Kontakts |
| `lastName` | string | Nachname des Kontakts |
| `createdAt` | string | Erstellungszeitstempel |
| `updatedAt` | string | Zeitstempel der letzten Aktualisierung |
| `listIds` | json | Array von Listen-IDs, zu denen der Kontakt gehört |
| `customFields` | json | Benutzerdefinierte Feldwerte |

### `sendgrid_search_contacts`

Suche nach Kontakten in SendGrid mit einer Abfrage

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `query` | string | Ja | Suchabfrage (z.B. "email LIKE '%example.com%' AND CONTAINS(list_ids, 'list-id')") |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contacts` | json | Array übereinstimmender Kontakte |
| `contactCount` | number | Gesamtzahl der gefundenen Kontakte |

### `sendgrid_delete_contacts`

Einen oder mehrere Kontakte aus SendGrid löschen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `contactIds` | string | Ja | Kommagetrennte Kontakt-IDs zum Löschen |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobId` | string | Job-ID für die Löschanfrage |

### `sendgrid_create_list`

Erstellen einer neuen Kontaktliste in SendGrid

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `name` | string | Ja | Listenname |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Listen-ID |
| `name` | string | Listenname |
| `contactCount` | number | Anzahl der Kontakte in der Liste |

### `sendgrid_get_list`

Eine bestimmte Liste anhand der ID von SendGrid abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `listId` | string | Ja | Listen-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Listen-ID |
| `name` | string | Listenname |
| `contactCount` | number | Anzahl der Kontakte in der Liste |

### `sendgrid_list_all_lists`

Alle Kontaktlisten von SendGrid abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `pageSize` | number | Nein | Anzahl der Listen, die pro Seite zurückgegeben werden sollen (Standard: 100) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `lists` | json | Array von Listen |

### `sendgrid_delete_list`

Eine Kontaktliste von SendGrid löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `listId` | string | Ja | Listen-ID zum Löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Erfolgsmeldung |

### `sendgrid_add_contacts_to_list`

Kontakte hinzufügen oder aktualisieren und einer Liste in SendGrid zuweisen (verwendet PUT /v3/marketing/contacts)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `listId` | string | Ja | Listen-ID, zu der Kontakte hinzugefügt werden sollen |
| `contacts` | json | Ja | JSON-Array von Kontaktobjekten. Jeder Kontakt muss mindestens Folgendes enthalten: E-Mail \(oder phone_number_id/external_id/anonymous_id\). Beispiel: \[\{"email": "user@example.com", "first_name": "John"\}\] |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobId` | string | Job-ID zur Verfolgung des asynchronen Vorgangs |
| `message` | string | Statusmeldung |

### `sendgrid_remove_contacts_from_list`

Kontakte aus einer bestimmten Liste in SendGrid entfernen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `listId` | string | Ja | Listen-ID |
| `contactIds` | string | Ja | Kommagetrennte Kontakt-IDs, die aus der Liste entfernt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobId` | string | Job-ID für die Anfrage |

### `sendgrid_create_template`

Eine neue E-Mail-Vorlage in SendGrid erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `name` | string | Ja | Vorlagenname |
| `generation` | string | Nein | Vorlagenerstellungstyp \(legacy oder dynamic, standard: dynamic\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Vorlagen-ID |
| `name` | string | Vorlagenname |
| `generation` | string | Vorlagenerstellung |
| `updatedAt` | string | Zeitstempel der letzten Aktualisierung |
| `versions` | json | Array von Vorlagenversionen |

### `sendgrid_get_template`

Eine bestimmte Vorlage anhand der ID von SendGrid abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `templateId` | string | Ja | Vorlagen-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Vorlagen-ID |
| `name` | string | Vorlagenname |
| `generation` | string | Vorlagenerstellung |
| `updatedAt` | string | Zeitstempel der letzten Aktualisierung |
| `versions` | json | Array von Vorlagenversionen |

### `sendgrid_list_templates`

Alle E-Mail-Vorlagen von SendGrid abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `generations` | string | Nein | Nach Generation filtern (legacy, dynamic oder beides) |
| `pageSize` | number | Nein | Anzahl der Vorlagen pro Seite (Standard: 20) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `templates` | json | Array von Vorlagen |

### `sendgrid_delete_template`

Eine E-Mail-Vorlage von SendGrid löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `templateId` | string | Ja | Zu löschende Vorlagen-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `message` | string | Status- oder Erfolgsmeldung |
| `messageId` | string | E-Mail-Nachrichten-ID \(send_mail\) |
| `to` | string | E-Mail-Adresse des Empfängers \(send_mail\) |
| `subject` | string | E-Mail-Betreff \(send_mail, create_template_version\) |
| `id` | string | Ressourcen-ID |
| `jobId` | string | Job-ID für asynchrone Operationen |
| `email` | string | E-Mail-Adresse des Kontakts |
| `firstName` | string | Vorname des Kontakts |
| `lastName` | string | Nachname des Kontakts |
| `createdAt` | string | Erstellungszeitstempel |
| `updatedAt` | string | Zeitstempel der letzten Aktualisierung |
| `listIds` | json | Array von Listen-IDs, zu denen der Kontakt gehört |
| `customFields` | json | Benutzerdefinierte Feldwerte |
| `contacts` | json | Array von Kontakten |
| `contactCount` | number | Anzahl der Kontakte |
| `lists` | json | Array von Listen |
| `name` | string | Ressourcenname |
| `templates` | json | Array von Vorlagen |
| `generation` | string | Vorlagengeneration |
| `versions` | json | Array von Vorlagenversionen |
| `templateId` | string | Vorlagen-ID |
| `active` | boolean | Ob die Vorlagenversion aktiv ist |
| `htmlContent` | string | HTML-Inhalt |
| `plainContent` | string | Nur-Text-Inhalt |

### `sendgrid_create_template_version`

Eine neue Version einer E-Mail-Vorlage in SendGrid erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | SendGrid API-Schlüssel |
| `templateId` | string | Ja | Vorlagen-ID |
| `name` | string | Ja | Versionsname |
| `subject` | string | Ja | E-Mail-Betreffzeile |
| `htmlContent` | string | Nein | HTML-Inhalt der Vorlage |
| `plainContent` | string | Nein | Nur-Text-Inhalt der Vorlage |
| `active` | boolean | Nein | Ob diese Version aktiv ist \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Versions-ID |
| `templateId` | string | Vorlagen-ID |
| `name` | string | Versionsname |
| `subject` | string | E-Mail-Betreff |
| `active` | boolean | Ob diese Version aktiv ist |
| `htmlContent` | string | HTML-Inhalt |
| `plainContent` | string | Nur-Text-Inhalt |
| `updatedAt` | string | Zeitstempel der letzten Aktualisierung |

## Hinweise

- Kategorie: `tools`
- Typ: `sendgrid`
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/sentry.mdx

```text
---
title: Sentry
description: Verwalte Sentry-Probleme, Projekte, Ereignisse und Releases
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sentry"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Verbessere deine Fehlerüberwachung und Anwendungszuverlässigkeit mit [Sentry](https://sentry.io/) — der branchenführenden Plattform für Echtzeit-Fehlerverfolgung, Leistungsüberwachung und Release-Management. Integriere Sentry nahtlos in deine automatisierten Agent-Workflows, um Probleme einfach zu überwachen, kritische Ereignisse zu verfolgen, Projekte zu verwalten und Releases über all deine Anwendungen und Dienste hinweg zu orchestrieren.

Mit dem Sentry-Tool kannst du:

- **Probleme überwachen und priorisieren**: Rufe umfassende Listen von Problemen mit der `sentry_issues_list` Operation ab und erhalte detaillierte Informationen zu einzelnen Fehlern und Bugs über `sentry_issues_get`. Greife sofort auf Metadaten, Tags, Stack-Traces und Statistiken zu, um die mittlere Zeit bis zur Lösung zu reduzieren.
- **Ereignisdaten verfolgen**: Analysiere spezifische Fehler- und Ereignisinstanzen mit `sentry_events_list` und `sentry_events_get`, die tiefe Einblicke in Fehlervorkommen und Benutzerauswirkungen bieten.
- **Projekte und Teams verwalten**: Nutze `sentry_projects_list` und `sentry_project_get`, um alle deine Sentry-Projekte aufzulisten und zu überprüfen, was eine reibungslose Teamzusammenarbeit und zentralisierte Konfiguration gewährleistet.
- **Releases koordinieren**: Automatisiere Versionsverfolgung, Deployment-Gesundheit und Änderungsmanagement in deinem Codebase mit Operationen wie `sentry_releases_list`, `sentry_release_get` und mehr.
- **Leistungsstarke Anwendungseinblicke gewinnen**: Nutze erweiterte Filter und Abfragen, um ungelöste oder hochprioritäre Probleme zu finden, Ereignisstatistiken im Zeitverlauf zu aggregieren und Regressionen zu verfolgen, während sich dein Codebase weiterentwickelt.

Die Sentry-Integration ermöglicht Engineering- und DevOps-Teams, Probleme frühzeitig zu erkennen, die wichtigsten Bugs zu priorisieren und die Anwendungsgesundheit über verschiedene Entwicklungsstacks hinweg kontinuierlich zu verbessern. Orchestriere programmatisch Workflow-Automatisierung für moderne Beobachtbarkeit, Vorfallreaktion und Release-Lifecycle-Management – reduziere Ausfallzeiten und erhöhe die Benutzerzufriedenheit.

**Verfügbare Sentry-Operationen**:
- `sentry_issues_list`: Sentry-Probleme für Organisationen und Projekte auflisten, mit leistungsstarker Suche und Filterung.
- `sentry_issues_get`: Detaillierte Informationen zu einem bestimmten Sentry-Problem abrufen.
- `sentry_events_list`: Ereignisse für ein bestimmtes Problem zur Ursachenanalyse auflisten.
- `sentry_events_get`: Vollständige Details zu einem einzelnen Ereignis erhalten, einschließlich Stack-Traces, Kontext und Metadaten.
- `sentry_projects_list`: Alle Sentry-Projekte innerhalb Ihrer Organisation auflisten.
- `sentry_project_get`: Konfiguration und Details für ein bestimmtes Projekt abrufen.
- `sentry_releases_list`: Aktuelle Releases und deren Bereitstellungsstatus auflisten.
- `sentry_release_get`: Detaillierte Release-Informationen abrufen, einschließlich zugehöriger Commits und Probleme.

Ob Sie proaktiv die App-Gesundheit verwalten, Produktionsfehler beheben oder Release-Workflows automatisieren – Sentry stattet Sie mit erstklassigem Monitoring, handlungsorientierten Warnungen und nahtloser DevOps-Integration aus. Verbessern Sie Ihre Softwarequalität und Suchsichtbarkeit, indem Sie Sentry für Fehlerverfolgung, Beobachtbarkeit und Release-Management nutzen – alles in Ihren agentischen Workflows.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Sentry in den Workflow. Überwachen Sie Probleme, verwalten Sie Projekte, verfolgen Sie Ereignisse und koordinieren Sie Releases über Ihre Anwendungen hinweg.

## Tools

### `sentry_issues_list`

Listet Probleme von Sentry für eine bestimmte Organisation und optional ein bestimmtes Projekt auf. Gibt Problemdetails zurück, einschließlich Status, Fehlerzahlen und Zeitstempel der letzten Sichtung.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry-API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `projectSlug` | string | Nein | Filtert Probleme nach einem bestimmten Projekt-Slug \(optional\) |
| `query` | string | Nein | Suchanfrage zum Filtern von Problemen. Unterstützt Sentry-Suchsyntax \(z.B. "is:unresolved", "level:error"\) |
| `statsPeriod` | string | Nein | Zeitraum für Statistiken \(z.B. "24h", "7d", "30d"\). Standardmäßig 24h, wenn nicht angegeben. |
| `cursor` | string | Nein | Paginierungscursor zum Abrufen der nächsten Ergebnisseite |
| `limit` | number | Nein | Anzahl der Probleme, die pro Seite zurückgegeben werden sollen \(Standard: 25, max: 100\) |
| `status` | string | Nein | Nach Problemstatus filtern: unresolved, resolved, ignored oder muted |
| `sort` | string | Nein | Sortierreihenfolge: date, new, freq, priority oder user \(Standard: date\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `issues` | array | Liste der Sentry-Probleme |

### `sentry_issues_get`

Ruft detaillierte Informationen zu einem bestimmten Sentry-Problem anhand seiner ID ab. Gibt vollständige Problemdetails einschließlich Metadaten, Tags und Statistiken zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry-API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `issueId` | string | Ja | Die eindeutige ID des abzurufenden Problems |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `issue` | object | Detaillierte Informationen zum Sentry-Problem |

### `sentry_issues_update`

Aktualisiert ein Sentry-Problem durch Ändern seines Status, seiner Zuweisung, seines Lesezeichen-Status oder anderer Eigenschaften. Gibt die aktualisierten Problemdetails zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry-API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `issueId` | string | Ja | Die eindeutige ID des zu aktualisierenden Problems |
| `status` | string | Nein | Neuer Status für das Problem: resolved, unresolved, ignored oder resolvedInNextRelease |
| `assignedTo` | string | Nein | Benutzer-ID oder E-Mail, der das Problem zugewiesen werden soll. Leerer String zum Aufheben der Zuweisung. |
| `isBookmarked` | boolean | Nein | Ob das Problem als Lesezeichen gespeichert werden soll |
| `isSubscribed` | boolean | Nein | Ob Problemaktualisierungen abonniert werden sollen |
| `isPublic` | boolean | Nein | Ob das Problem öffentlich sichtbar sein soll |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `issue` | object | Das aktualisierte Sentry-Problem |

### `sentry_projects_list`

Listet alle Projekte in einer Sentry-Organisation auf. Gibt Projektdetails zurück, einschließlich Name, Plattform, Teams und Konfiguration.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry-API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `cursor` | string | Nein | Paginierungscursor zum Abrufen der nächsten Ergebnisseite |
| `limit` | number | Nein | Anzahl der Projekte, die pro Seite zurückgegeben werden sollen \(Standard: 25, max: 100\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `projects` | array | Liste der Sentry-Projekte |

### `sentry_projects_get`

Ruft detaillierte Informationen über ein bestimmtes Sentry-Projekt anhand seines Slugs ab. Gibt vollständige Projektdetails zurück, einschließlich Teams, Funktionen und Konfiguration.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry-API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `projectSlug` | string | Ja | Die ID oder der Slug des abzurufenden Projekts |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `project` | object | Detaillierte Informationen über das Sentry-Projekt |

### `sentry_projects_create`

Erstellt ein neues Sentry-Projekt in einer Organisation. Erfordert ein Team, dem das Projekt zugeordnet wird. Gibt die Details des erstellten Projekts zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `name` | string | Ja | Der Name des Projekts |
| `teamSlug` | string | Ja | Der Slug des Teams, das dieses Projekt besitzen wird |
| `slug` | string | Nein | URL-freundliche Projektkennung \(wird automatisch aus dem Namen generiert, wenn nicht angegeben\) |
| `platform` | string | Nein | Plattform/Sprache für das Projekt \(z.B. javascript, python, node, react-native\). Wenn nicht angegeben, wird standardmäßig "other" verwendet |
| `defaultRules` | boolean | Nein | Ob Standardalarmregeln erstellt werden sollen \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `project` | object | Das neu erstellte Sentry-Projekt |

### `sentry_projects_update`

Aktualisiert ein Sentry-Projekt durch Änderung des Namens, Slugs, der Plattform oder anderer Einstellungen. Gibt die aktualisierten Projektdetails zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `projectSlug` | string | Ja | Der Slug des zu aktualisierenden Projekts |
| `name` | string | Nein | Neuer Name für das Projekt |
| `slug` | string | Nein | Neue URL-freundliche Projektkennung |
| `platform` | string | Nein | Neue Plattform/Sprache für das Projekt \(z.B. javascript, python, node\) |
| `isBookmarked` | boolean | Nein | Ob das Projekt als Lesezeichen gespeichert werden soll |
| `digestsMinDelay` | number | Nein | Minimale Verzögerung \(in Sekunden\) für Digest-Benachrichtigungen |
| `digestsMaxDelay` | number | Nein | Maximale Verzögerung \(in Sekunden\) für Digest-Benachrichtigungen |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `project` | object | Das aktualisierte Sentry-Projekt |

### `sentry_events_list`

Listet Ereignisse aus einem Sentry-Projekt auf. Kann nach Problem-ID, Abfrage oder Zeitraum gefiltert werden. Gibt Ereignisdetails einschließlich Kontext, Tags und Benutzerinformationen zurück.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `projectSlug` | string | Ja | Der Slug des Projekts, aus dem Ereignisse aufgelistet werden sollen |
| `issueId` | string | Nein | Filtert Ereignisse nach einer bestimmten Problem-ID |
| `query` | string | Nein | Suchabfrage zum Filtern von Ereignissen. Unterstützt Sentry-Suchsyntax \(z.B. "user.email:*@example.com"\) |
| `cursor` | string | Nein | Paginierungscursor zum Abrufen der nächsten Ergebnisseite |
| `limit` | number | Nein | Anzahl der Ereignisse, die pro Seite zurückgegeben werden sollen \(Standard: 50, max: 100\) |
| `statsPeriod` | string | Nein | Abfragezeitraum \(z.B. "24h", "7d", "30d"\). Standardmäßig 90d, wenn nicht angegeben. |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `events` | array | Liste der Sentry-Ereignisse |

### `sentry_events_get`

Ruft detaillierte Informationen über ein bestimmtes Sentry-Ereignis anhand seiner ID ab. Gibt vollständige Ereignisdetails zurück, einschließlich Stack-Traces, Breadcrumbs, Kontext und Benutzerinformationen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `projectSlug` | string | Ja | Der Slug des Projekts |
| `eventId` | string | Ja | Die eindeutige ID des abzurufenden Ereignisses |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `event` | object | Detaillierte Informationen über das Sentry-Ereignis |

### `sentry_releases_list`

Listet Releases für eine Sentry-Organisation oder ein Projekt auf. Gibt Release-Details zurück, einschließlich Version, Commits, Deploy-Informationen und zugehörige Projekte.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `projectSlug` | string | Nein | Filtert Releases nach einem bestimmten Projekt-Slug \(optional\) |
| `query` | string | Nein | Suchanfrage zum Filtern von Releases \(z.B. Versionsnamen-Muster\) |
| `cursor` | string | Nein | Paginierungscursor zum Abrufen der nächsten Ergebnisseite |
| `limit` | number | Nein | Anzahl der Releases, die pro Seite zurückgegeben werden sollen \(Standard: 25, max: 100\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `releases` | array | Liste der Sentry-Releases |

### `sentry_releases_create`

Erstelle ein neues Release in Sentry. Ein Release ist eine Version deines Codes, die in einer Umgebung bereitgestellt wird. Kann Commit-Informationen und zugehörige Projekte enthalten. Gibt die Details des erstellten Releases zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `version` | string | Ja | Versionskennung für das Release \(z.B. "2.0.0", "my-app@1.0.0" oder ein Git-Commit-SHA\) |
| `projects` | string | Ja | Kommagetrennte Liste von Projekt-Slugs, die mit diesem Release verknüpft werden sollen |
| `ref` | string | Nein | Git-Referenz \(Commit-SHA, Tag oder Branch\) für dieses Release |
| `url` | string | Nein | URL, die auf das Release verweist \(z.B. GitHub-Release-Seite\) |
| `dateReleased` | string | Nein | ISO 8601-Zeitstempel für den Zeitpunkt der Bereitstellung des Releases \(standardmäßig aktuelle Zeit\) |
| `commits` | string | Nein | JSON-Array von Commit-Objekten mit id, repository \(optional\) und message \(optional\). Beispiel: \[\{"id":"abc123","message":"Fix bug"\}\] |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `release` | object | Das neu erstellte Sentry-Release |

### `sentry_releases_deploy`

Erstelle einen Deploy-Eintrag für ein Sentry-Release in einer bestimmten Umgebung. Deploys verfolgen, wann und wo Releases bereitgestellt werden. Gibt die Details des erstellten Deploys zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Sentry API-Authentifizierungstoken |
| `organizationSlug` | string | Ja | Der Slug der Organisation |
| `version` | string | Ja | Versionskennung des Releases, das bereitgestellt wird |
| `environment` | string | Ja | Name der Umgebung, in der das Release bereitgestellt wird (z.B. "production", "staging") |
| `name` | string | Nein | Optionaler Name für dieses Deployment (z.B. "Deploy v2.0 to Production") |
| `url` | string | Nein | URL, die auf das Deployment verweist (z.B. CI/CD-Pipeline-URL) |
| `dateStarted` | string | Nein | ISO 8601-Zeitstempel für den Beginn des Deployments (standardmäßig aktuelle Zeit) |
| `dateFinished` | string | Nein | ISO 8601-Zeitstempel für den Abschluss des Deployments |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deploy` | object | Der neu erstellte Deployment-Datensatz |

## Hinweise

- Kategorie: `tools`
- Typ: `sentry`
```

--------------------------------------------------------------------------------

---[FILE: serper.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/serper.mdx

```text
---
title: Serper
description: Durchsuchen Sie das Web mit Serper
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="serper"
  color="#2B3543"
/>

{/* MANUAL-CONTENT-START:intro */}
[Serper](https://www.serper.com/) ist eine Google-Such-API, die Entwicklern programmatischen Zugriff auf Google-Suchergebnisse bietet. Sie stellt eine zuverlässige, leistungsstarke Möglichkeit dar, Google-Suchfunktionen in Anwendungen zu integrieren, ohne die Komplexität von Web-Scraping oder die Einschränkungen anderer Such-APIs.

Mit Serper können Sie:

- **Auf Google-Suchergebnisse zugreifen**: Strukturierte Daten aus Google-Suchergebnissen programmatisch abrufen
- **Verschiedene Suchtypen durchführen**: Web-Suchen, Bildersuchen, Nachrichtensuchen und mehr ausführen
- **Umfangreiche Metadaten abrufen**: Titel, Snippets, URLs und andere relevante Informationen aus Suchergebnissen erhalten
- **Ihre Anwendungen skalieren**: Suchgestützte Funktionen mit einer zuverlässigen und schnellen API erstellen
- **Ratenbegrenzungen vermeiden**: Konsistenten Zugriff auf Suchergebnisse ohne Sorge vor IP-Sperren erhalten

In Sim ermöglicht die Serper-Integration Ihren Agenten, die Leistungsfähigkeit der Websuche als Teil ihrer Workflows zu nutzen. Dies erlaubt anspruchsvolle Automatisierungsszenarien, die aktuelle Informationen aus dem Internet erfordern. Ihre Agenten können Suchanfragen formulieren, relevante Ergebnisse abrufen und diese Informationen nutzen, um Entscheidungen zu treffen oder Antworten zu liefern. Diese Integration überbrückt die Lücke zwischen Ihrer Workflow-Automatisierung und dem umfangreichen Wissen, das im Web verfügbar ist, und ermöglicht Ihren Agenten den Zugriff auf Echtzeit-Informationen ohne manuelle Eingriffe. Durch die Verbindung von Sim mit Serper können Sie Agenten erstellen, die mit den neuesten Informationen aktuell bleiben, genauere Antworten liefern und mehr Wert für Benutzer schaffen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Serper in den Workflow. Kann das Web durchsuchen. Erfordert API-Schlüssel.

## Tools

### `serper_search`

Ein leistungsstarkes Websuch-Tool, das Zugriff auf Google-Suchergebnisse über die Serper.dev API bietet. Unterstützt verschiedene Arten von Suchen, einschließlich regulärer Websuche, Nachrichten, Orte und Bilder, wobei jedes Ergebnis relevante Metadaten wie Titel, URLs, Snippets und typenspezifische Informationen enthält.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die Suchanfrage |
| `num` | number | Nein | Anzahl der zurückzugebenden Ergebnisse |
| `gl` | string | Nein | Ländercode für Suchergebnisse |
| `hl` | string | Nein | Sprachcode für Suchergebnisse |
| `type` | string | Nein | Art der durchzuführenden Suche |
| `apiKey` | string | Ja | Serper API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `searchResults` | array | Suchergebnisse mit Titeln, Links, Textausschnitten und typspezifischen Metadaten \(Datum für Nachrichten, Bewertung für Orte, Bild-URL für Bilder\) |

## Hinweise

- Kategorie: `tools`
- Typ: `serper`
```

--------------------------------------------------------------------------------

````
