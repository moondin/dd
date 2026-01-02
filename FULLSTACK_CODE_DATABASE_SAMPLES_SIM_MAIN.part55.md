---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 55
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 55 of 933)

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

---[FILE: zendesk.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/zendesk.mdx

```text
---
title: Zendesk
description: Verwalte Support-Tickets, Benutzer und Organisationen in Zendesk
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zendesk"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zendesk](https://www.zendesk.com/) ist eine führende Kundenservice- und Support-Plattform, die Organisationen befähigt, Support-Tickets, Benutzer und Organisationen effizient durch eine robuste Reihe von Tools und APIs zu verwalten. Die Zendesk-Integration in Sim ermöglicht deinen Agenten, wichtige Support-Vorgänge zu automatisieren und deine Support-Daten mit dem Rest deines Workflows zu synchronisieren.

Mit Zendesk in Sim kannst du:

- **Tickets verwalten:**
  - Listen von Support-Tickets mit erweiterten Filter- und Sortiermöglichkeiten abrufen.
  - Detaillierte Informationen zu einem einzelnen Ticket für Nachverfolgung und Lösung erhalten.
  - Neue Tickets einzeln oder in großen Mengen erstellen, um Kundenprobleme programmatisch zu erfassen.
  - Tickets aktualisieren oder Massenaktualisierungen durchführen, um komplexe Workflows zu optimieren.
  - Tickets löschen oder zusammenführen, wenn Fälle gelöst werden oder Duplikate auftreten.

- **Benutzerverwaltung:**
  - Listen von Benutzern abrufen oder Benutzer nach Kriterien suchen, um deine Kunden- und Agenten-Verzeichnisse aktuell zu halten.
  - Detaillierte Informationen zu einzelnen Benutzern oder zum aktuell angemeldeten Benutzer erhalten.
  - Neue Benutzer erstellen oder sie in großen Mengen einrichten, um die Bereitstellung von Kunden und Agenten zu automatisieren.
  - Benutzerdetails aktualisieren oder Massenaktualisierungen durchführen, um die Informationsgenauigkeit zu gewährleisten.
  - Benutzer bei Bedarf für Datenschutz oder Kontoverwaltung löschen.

- **Organisationsverwaltung:**
  - Organisationen auflisten, suchen und automatisch vervollständigen für optimiertes Support- und Kontomanagement.
  - Organisationsdetails abrufen und deine Datenbank organisiert halten.
  - Organisationen erstellen, aktualisieren oder löschen, um Änderungen in deiner Kundenbasis widerzuspiegeln.
  - Massenorganisationserstellung für große Onboarding-Maßnahmen durchführen.

- **Erweiterte Suche & Analyse:**
  - Nutzen Sie vielseitige Suchendpunkte, um Tickets, Benutzer oder Organisationen schnell nach beliebigen Feldern zu finden.
  - Rufen Sie Zählungen von Suchergebnissen ab, um Berichte und Analysen zu erstellen.

Durch die Nutzung der Zendesk-Sim-Integration können Ihre automatisierten Workflows nahtlos die Ticket-Triage, Benutzer-Onboarding/Offboarding, Unternehmensverwaltung übernehmen und Ihre Support-Abläufe reibungslos am Laufen halten. Ob Sie Support mit Produkt-, CRM- oder Automatisierungssystemen integrieren - Zendesk-Tools in Sim bieten robuste, programmatische Kontrolle, um erstklassigen Support im großen Maßstab zu ermöglichen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Zendesk in den Workflow. Kann Tickets abrufen, Ticket abrufen, Ticket erstellen, Tickets in Masse erstellen, Ticket aktualisieren, Tickets in Masse aktualisieren, Ticket löschen, Tickets zusammenführen, Benutzer abrufen, Benutzer abrufen, aktuellen Benutzer abrufen, Benutzer suchen, Benutzer erstellen, Benutzer in Masse erstellen, Benutzer aktualisieren, Benutzer in Masse aktualisieren, Benutzer löschen, Organisationen abrufen, Organisation abrufen, Organisationen automatisch vervollständigen, Organisation erstellen, Organisationen in Masse erstellen, Organisation aktualisieren, Organisation löschen, suchen, Suchanzahl.

## Tools

### `zendesk_get_tickets`

Eine Liste von Tickets aus Zendesk mit optionaler Filterung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain \(z.B. "mycompany" für mycompany.zendesk.com\) |
| `status` | string | Nein | Nach Status filtern \(new, open, pending, hold, solved, closed\) |
| `priority` | string | Nein | Nach Priorität filtern \(low, normal, high, urgent\) |
| `type` | string | Nein | Nach Typ filtern \(problem, incident, question, task\) |
| `assigneeId` | string | Nein | Nach Bearbeiter-Benutzer-ID filtern |
| `organizationId` | string | Nein | Nach Organisations-ID filtern |
| `sortBy` | string | Nein | Sortierfeld \(created_at, updated_at, priority, status\) |
| `sortOrder` | string | Nein | Sortierreihenfolge \(asc oder desc\) |
| `perPage` | string | Nein | Ergebnisse pro Seite \(Standard: 100, max: 100\) |
| `page` | string | Nein | Seitennummer |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tickets` | array | Array von Ticket-Objekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |

### `zendesk_get_ticket`

Ein einzelnes Ticket anhand der ID von Zendesk abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `ticketId` | string | Ja | Ticket-ID zum Abrufen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ticket` | object | Ticket-Objekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_create_ticket`

Ein neues Ticket in Zendesk erstellen mit Unterstützung für benutzerdefinierte Felder

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `subject` | string | Nein | Ticket-Betreff \(optional - wird automatisch generiert, wenn nicht angegeben\) |
| `description` | string | Ja | Ticket-Beschreibung \(erster Kommentar\) |
| `priority` | string | Nein | Priorität \(low, normal, high, urgent\) |
| `status` | string | Nein | Status \(new, open, pending, hold, solved, closed\) |
| `type` | string | Nein | Typ \(problem, incident, question, task\) |
| `tags` | string | Nein | Kommagetrennte Tags |
| `assigneeId` | string | Nein | Bearbeiter-Benutzer-ID |
| `groupId` | string | Nein | Gruppen-ID |
| `requesterId` | string | Nein | Anforderer-Benutzer-ID |
| `customFields` | string | Nein | Benutzerdefinierte Felder als JSON-Objekt \(z.B. \{"field_id": "value"\}\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ticket` | object | Erstelltes Ticket-Objekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_create_tickets_bulk`

Erstellen Sie mehrere Tickets in Zendesk auf einmal (maximal 100)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Yes | Zendesk API-Token |
| `subdomain` | string | Yes | Ihre Zendesk-Subdomain |
| `tickets` | string | Yes | JSON-Array von Ticket-Objekten zum Erstellen \(maximal 100\). Jedes Ticket sollte Betreff- und Kommentareigenschaften haben. |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job-Status-Objekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_update_ticket`

Aktualisieren Sie ein bestehendes Ticket in Zendesk mit Unterstützung für benutzerdefinierte Felder

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Yes | Zendesk API-Token |
| `subdomain` | string | Yes | Ihre Zendesk-Subdomain |
| `ticketId` | string | Yes | Zu aktualisierende Ticket-ID |
| `subject` | string | No | Neuer Ticket-Betreff |
| `comment` | string | No | Einen Kommentar zum Ticket hinzufügen |
| `priority` | string | No | Priorität \(low, normal, high, urgent\) |
| `status` | string | No | Status \(new, open, pending, hold, solved, closed\) |
| `type` | string | No | Typ \(problem, incident, question, task\) |
| `tags` | string | No | Kommagetrennte Tags |
| `assigneeId` | string | No | Bearbeiter-Benutzer-ID |
| `groupId` | string | No | Gruppen-ID |
| `customFields` | string | No | Benutzerdefinierte Felder als JSON-Objekt |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `ticket` | object | Aktualisiertes Ticket-Objekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_update_tickets_bulk`

Mehrere Tickets in Zendesk auf einmal aktualisieren (max. 100)

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `ticketIds` | string | Ja | Kommagetrennte Ticket-IDs zur Aktualisierung \(max. 100\) |
| `status` | string | Nein | Neuer Status für alle Tickets |
| `priority` | string | Nein | Neue Priorität für alle Tickets |
| `assigneeId` | string | Nein | Neue Bearbeiter-ID für alle Tickets |
| `groupId` | string | Nein | Neue Gruppen-ID für alle Tickets |
| `tags` | string | Nein | Kommagetrennte Tags, die allen Tickets hinzugefügt werden sollen |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job-Status-Objekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_delete_ticket`

Ein Ticket aus Zendesk löschen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `ticketId` | string | Ja | Zu löschende Ticket-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Löschvorgang erfolgreich |
| `metadata` | object | Operationsmetadaten |

### `zendesk_merge_tickets`

Mehrere Tickets in ein Zielticket zusammenführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `targetTicketId` | string | Ja | Zielticket-ID \(Tickets werden in dieses zusammengeführt\) |
| `sourceTicketIds` | string | Ja | Kommagetrennte Quellticket-IDs zum Zusammenführen |
| `targetComment` | string | Nein | Kommentar, der nach dem Zusammenführen zum Zielticket hinzugefügt wird |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job-Status-Objekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_get_users`

Eine Liste von Benutzern aus Zendesk mit optionaler Filterung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain \(z.B. "mycompany" für mycompany.zendesk.com\) |
| `role` | string | Nein | Nach Rolle filtern \(end-user, agent, admin\) |
| `permissionSet` | string | Nein | Nach Berechtigungssatz-ID filtern |
| `perPage` | string | Nein | Ergebnisse pro Seite \(Standard: 100, max: 100\) |
| `page` | string | Nein | Seitennummer |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `users` | array | Array von Benutzerobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |

### `zendesk_get_user`

Einen einzelnen Benutzer anhand der ID von Zendesk abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `userId` | string | Ja | Zu abzurufende Benutzer-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Benutzerobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_get_current_user`

Den aktuell authentifizierten Benutzer von Zendesk abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Aktuelles Benutzerobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_search_users`

Nach Benutzern in Zendesk mit einer Abfragezeichenfolge suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `query` | string | Nein | Suchabfragestring |
| `externalId` | string | Nein | Externe ID für die Suche |
| `perPage` | string | Nein | Ergebnisse pro Seite \(Standard: 100, max: 100\) |
| `page` | string | Nein | Seitennummer |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `users` | array | Array von Benutzerobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |

### `zendesk_create_user`

Einen neuen Benutzer in Zendesk erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `name` | string | Ja | Benutzername |
| `userEmail` | string | Nein | Benutzer-E-Mail |
| `role` | string | Nein | Benutzerrolle \(end-user, agent, admin\) |
| `phone` | string | Nein | Telefonnummer des Benutzers |
| `organizationId` | string | Nein | Organisations-ID |
| `verified` | string | Nein | Auf "true" setzen, um die E-Mail-Verifizierung zu überspringen |
| `tags` | string | Nein | Kommagetrennte Tags |
| `customFields` | string | Nein | Benutzerdefinierte Felder als JSON-Objekt \(z.B. \{"field_id": "value"\}\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Erstelltes Benutzerobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_create_users_bulk`

Erstellen mehrerer Benutzer in Zendesk mittels Massenimport

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Yes | Zendesk API-Token |
| `subdomain` | string | Yes | Ihre Zendesk-Subdomain |
| `users` | string | Yes | JSON-Array von Benutzerobjekten zum Erstellen |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job-Statusobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_update_user`

Aktualisieren eines vorhandenen Benutzers in Zendesk

#### Input

| Parameter | Type | Required | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Yes | Zendesk API-Token |
| `subdomain` | string | Yes | Ihre Zendesk-Subdomain |
| `userId` | string | Yes | Zu aktualisierende Benutzer-ID |
| `name` | string | No | Neuer Benutzername |
| `userEmail` | string | No | Neue Benutzer-E-Mail |
| `role` | string | No | Benutzerrolle \(end-user, agent, admin\) |
| `phone` | string | No | Telefonnummer des Benutzers |
| `organizationId` | string | No | Organisations-ID |
| `verified` | string | No | Auf "true" setzen, um Benutzer als verifiziert zu markieren |
| `tags` | string | No | Kommagetrennte Tags |
| `customFields` | string | No | Benutzerdefinierte Felder als JSON-Objekt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Aktualisiertes Benutzerobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_update_users_bulk`

Mehrere Benutzer in Zendesk über Massenaktualisierung aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `users` | string | Ja | JSON-Array von Benutzerobjekten zur Aktualisierung \(muss das Feld id enthalten\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job-Statusobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_delete_user`

Einen Benutzer aus Zendesk löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `userId` | string | Ja | Zu löschende Benutzer-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Löscherfolg |
| `metadata` | object | Operationsmetadaten |

### `zendesk_get_organizations`

Eine Liste von Organisationen von Zendesk abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain \(z.B. "mycompany" für mycompany.zendesk.com\) |
| `perPage` | string | Nein | Ergebnisse pro Seite \(Standard: 100, max: 100\) |
| `page` | string | Nein | Seitennummer |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `organizations` | array | Array von Organisationsobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |

### `zendesk_get_organization`

Eine einzelne Organisation anhand der ID von Zendesk abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `organizationId` | string | Ja | Abzurufende Organisations-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `organization` | object | Organisationsobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_autocomplete_organizations`

Autovervollständigung von Organisationen in Zendesk nach Namenspräfix (für Namensabgleich/Autovervollständigung)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `name` | string | Ja | Zu suchender Organisationsname |
| `perPage` | string | Nein | Ergebnisse pro Seite \(Standard: 100, max: 100\) |
| `page` | string | Nein | Seitennummer |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `organizations` | array | Array von Organisationsobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |

### `zendesk_create_organization`

Eine neue Organisation in Zendesk erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `name` | string | Ja | Name der Organisation |
| `domainNames` | string | Nein | Kommagetrennte Domainnamen |
| `details` | string | Nein | Details zur Organisation |
| `notes` | string | Nein | Notizen zur Organisation |
| `tags` | string | Nein | Kommagetrennte Tags |
| `customFields` | string | Nein | Benutzerdefinierte Felder als JSON-Objekt (z.B. \{"field_id": "value"\}) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `organization` | object | Erstelltes Organisationsobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_create_organizations_bulk`

Mehrere Organisationen in Zendesk über Massenimport erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `organizations` | string | Ja | JSON-Array mit zu erstellenden Organisationsobjekten |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job-Statusobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_update_organization`

Eine bestehende Organisation in Zendesk aktualisieren

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `organizationId` | string | Ja | Zu aktualisierende Organisations-ID |
| `name` | string | Nein | Neuer Organisationsname |
| `domainNames` | string | Nein | Kommagetrennte Domainnamen |
| `details` | string | Nein | Organisationsdetails |
| `notes` | string | Nein | Organisationsnotizen |
| `tags` | string | Nein | Kommagetrennte Tags |
| `customFields` | string | Nein | Benutzerdefinierte Felder als JSON-Objekt |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `organization` | object | Aktualisiertes Organisationsobjekt |
| `metadata` | object | Operationsmetadaten |

### `zendesk_delete_organization`

Eine Organisation aus Zendesk löschen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `organizationId` | string | Ja | Zu löschende Organisations-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Löscherfolg |
| `metadata` | object | Operationsmetadaten |

### `zendesk_search`

Einheitliche Suche über Tickets, Benutzer und Organisationen in Zendesk

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `query` | string | Ja | Suchabfragestring |
| `sortBy` | string | Nein | Sortierfeld \(relevance, created_at, updated_at, priority, status, ticket_type\) |
| `sortOrder` | string | Nein | Sortierreihenfolge \(asc oder desc\) |
| `perPage` | string | Nein | Ergebnisse pro Seite \(Standard: 100, max: 100\) |
| `page` | string | Nein | Seitennummer |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Array von Ergebnisobjekten |
| `paging` | object | Paginierungsinformationen |
| `metadata` | object | Operationsmetadaten |

### `zendesk_search_count`

Zählen der Anzahl von Suchergebnissen, die einer Abfrage in Zendesk entsprechen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Ihre Zendesk-E-Mail-Adresse |
| `apiToken` | string | Ja | Zendesk-API-Token |
| `subdomain` | string | Ja | Ihre Zendesk-Subdomain |
| `query` | string | Ja | Suchabfragestring |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `count` | number | Anzahl der übereinstimmenden Ergebnisse |
| `metadata` | object | Operationsmetadaten |

## Hinweise

- Kategorie: `tools`
- Typ: `zendesk`
```

--------------------------------------------------------------------------------

---[FILE: zep.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/zep.mdx

```text
---
title: Zep
description: Langzeitgedächtnis für KI-Agenten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zep"
  color="#E8E8E8"
/>

## Nutzungsanleitung

Integriere Zep für Langzeitgedächtnisverwaltung. Erstelle Threads, füge Nachrichten hinzu, rufe Kontext mit KI-gestützten Zusammenfassungen und Faktenextraktion ab.

## Tools

### `zep_create_thread`

Starte einen neuen Konversations-Thread in Zep

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Ja | Eindeutige Kennung für den Thread |
| `userId` | string | Ja | Benutzer-ID, die mit dem Thread verknüpft ist |
| `apiKey` | string | Ja | Dein Zep API-Schlüssel |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `threadId` | string | Die Thread-ID |
| `userId` | string | Die Benutzer-ID |
| `uuid` | string | Interne UUID |
| `createdAt` | string | Erstellungszeitstempel |
| `projectUuid` | string | Projekt-UUID |

### `zep_get_threads`

Liste alle Konversations-Threads auf

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | Nein | Anzahl der Threads, die pro Seite abgerufen werden sollen |
| `pageNumber` | number | Nein | Seitennummer für Paginierung |
| `orderBy` | string | Nein | Feld, nach dem die Ergebnisse sortiert werden sollen \(created_at, updated_at, user_id, thread_id\) |
| `asc` | boolean | Nein | Sortierrichtung: true für aufsteigend, false für absteigend |
| `apiKey` | string | Ja | Dein Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `threads` | array | Array von Thread-Objekten |
| `responseCount` | number | Anzahl der Threads in dieser Antwort |
| `totalCount` | number | Gesamtanzahl der verfügbaren Threads |

### `zep_delete_thread`

Einen Konversations-Thread aus Zep löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Ja | Thread-ID zum Löschen |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob der Thread gelöscht wurde |

### `zep_get_context`

Benutzerkontext aus einem Thread mit Zusammenfassungs- oder Basismodus abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Ja | Thread-ID, aus der der Kontext abgerufen werden soll |
| `mode` | string | Nein | Kontextmodus: "summary" \(natürliche Sprache\) oder "basic" \(rohe Fakten\) |
| `minRating` | number | Nein | Mindestbewertung, nach der relevante Fakten gefiltert werden |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `context` | string | Die Kontext-Zeichenfolge \(Zusammenfassung oder Basismodus\) |

### `zep_get_messages`

Nachrichten aus einem Thread abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Ja | Thread-ID, aus der Nachrichten abgerufen werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Nachrichten |
| `cursor` | string | Nein | Cursor für Paginierung |
| `lastn` | number | Nein | Anzahl der neuesten Nachrichten, die zurückgegeben werden sollen \(überschreibt Limit und Cursor\) |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `messages` | array | Array von Nachrichtenobjekten |
| `rowCount` | number | Anzahl der Nachrichten in dieser Antwort |
| `totalCount` | number | Gesamtanzahl der Nachrichten im Thread |

### `zep_add_messages`

Nachrichten zu einem bestehenden Thread hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Ja | Thread-ID, zu der Nachrichten hinzugefügt werden sollen |
| `messages` | json | Ja | Array von Nachrichtenobjekten mit Rolle und Inhalt |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `threadId` | string | Die Thread-ID |
| `added` | boolean | Ob Nachrichten erfolgreich hinzugefügt wurden |
| `messageIds` | array | Array der hinzugefügten Nachrichten-UUIDs |

### `zep_add_user`

Einen neuen Benutzer in Zep erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Eindeutige Kennung für den Benutzer |
| `email` | string | Nein | E-Mail-Adresse des Benutzers |
| `firstName` | string | Nein | Vorname des Benutzers |
| `lastName` | string | Nein | Nachname des Benutzers |
| `metadata` | json | Nein | Zusätzliche Metadaten als JSON-Objekt |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `userId` | string | Die Benutzer-ID |
| `email` | string | E-Mail des Benutzers |
| `firstName` | string | Vorname des Benutzers |
| `lastName` | string | Nachname des Benutzers |
| `uuid` | string | Interne UUID |
| `createdAt` | string | Erstellungszeitstempel |
| `metadata` | object | Benutzermetadaten |

### `zep_get_user`

Benutzerinformationen von Zep abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Zu abzurufende Benutzer-ID |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `userId` | string | Die Benutzer-ID |
| `email` | string | E-Mail des Benutzers |
| `firstName` | string | Vorname des Benutzers |
| `lastName` | string | Nachname des Benutzers |
| `uuid` | string | Interne UUID |
| `createdAt` | string | Erstellungszeitstempel |
| `updatedAt` | string | Zeitstempel der letzten Aktualisierung |
| `metadata` | object | Benutzermetadaten |

### `zep_get_user_threads`

Alle Konversations-Threads für einen bestimmten Benutzer auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Benutzer-ID, für die Threads abgerufen werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Threads |
| `apiKey` | string | Ja | Ihr Zep API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `threads` | array | Array von Thread-Objekten für diesen Benutzer |
| `totalCount` | number | Gesamtanzahl der zurückgegebenen Threads |

## Hinweise

- Kategorie: `tools`
- Typ: `zep`
```

--------------------------------------------------------------------------------

````
