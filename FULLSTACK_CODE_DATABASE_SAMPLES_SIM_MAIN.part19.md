---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 19
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 19 of 933)

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

---[FILE: apollo.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/apollo.mdx

```text
---
title: Apollo
description: Suchen, anreichern und verwalten Sie Kontakte mit Apollo.io
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apollo"
  color="#EBF212"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apollo.io](https://apollo.io/) ist eine führende Plattform für Vertriebsintelligenz und -engagement, die Benutzern ermöglicht, Kontakte und Unternehmen im großen Maßstab zu finden, anzureichern und zu kontaktieren. Apollo.io kombiniert eine umfangreiche Kontaktdatenbank mit robusten Anreicherungs- und Workflow-Automatisierungstools und unterstützt Vertriebs-, Marketing- und Recruiting-Teams bei der Beschleunigung des Wachstums.

Mit Apollo.io können Sie:

- **Millionen von Kontakten und Unternehmen durchsuchen**: Finden Sie präzise Leads mit erweiterten Filtern
- **Leads und Accounts anreichern**: Füllen Sie fehlende Details mit verifizierten Daten und aktuellen Informationen
- **CRM-Datensätze verwalten und organisieren**: Halten Sie Ihre Personen- und Unternehmensdaten genau und handlungsfähig
- **Outreach automatisieren**: Fügen Sie Kontakte zu Sequenzen hinzu und erstellen Sie Follow-up-Aufgaben direkt aus Apollo.io

In Sim ermöglicht die Apollo.io-Integration Ihren Agenten, zentrale Apollo-Operationen programmatisch durchzuführen:

- **Personen und Unternehmen suchen**: Verwenden Sie `apollo_people_search`, um neue Leads mit flexiblen Filtern zu entdecken.
- **Personendaten anreichern**: Verwenden Sie `apollo_people_enrich`, um Kontakte mit verifizierten Informationen zu ergänzen.
- **Personen in Masse anreichern**: Verwenden Sie `apollo_people_bulk_enrich` für die großflächige Anreicherung mehrerer Kontakte auf einmal.
- **Unternehmen suchen und anreichern**: Verwenden Sie `apollo_company_search` und `apollo_company_enrich`, um wichtige Unternehmensinformationen zu entdecken und zu aktualisieren.

Dies ermöglicht Ihren Agenten, leistungsstarke Workflows für Prospecting, CRM-Anreicherung und Automatisierung zu erstellen, ohne manuelle Dateneingabe oder Tabwechsel. Integrieren Sie Apollo.io als dynamische Datenquelle und CRM-Engine – und befähigen Sie Ihre Agenten, Leads nahtlos als Teil ihrer täglichen Arbeit zu identifizieren, zu qualifizieren und zu kontaktieren.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriert Apollo.io in den Workflow. Suche nach Personen und Unternehmen, reichere Kontaktdaten an, verwalte deine CRM-Kontakte und Konten, füge Kontakte zu Sequenzen hinzu und erstelle Aufgaben.

## Tools

### `apollo_people_search`

Apollo durchsuchen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `person_titles` | array | Nein | Zu suchende Berufsbezeichnungen (z.B. ["CEO", "VP of Sales"]) |
| `person_locations` | array | Nein | Orte, in denen gesucht werden soll (z.B. ["San Francisco, CA", "New York, NY"]) |
| `person_seniorities` | array | Nein | Hierarchieebenen (z.B. ["senior", "executive", "manager"]) |
| `organization_names` | array | Nein | Unternehmensnamen, in denen gesucht werden soll |
| `q_keywords` | string | Nein | Zu suchende Schlüsselwörter |
| `page` | number | Nein | Seitennummer für Paginierung (Standard: 1) |
| `per_page` | number | Nein | Ergebnisse pro Seite (Standard: 25, max: 100) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `people` | json | Array von Personen, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich page, per_page und total_entries |

### `apollo_people_enrich`

Daten für eine einzelne Person mit Apollo anreichern

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `first_name` | string | Nein | Vorname der Person |
| `last_name` | string | Nein | Nachname der Person |
| `email` | string | Nein | E-Mail-Adresse der Person |
| `organization_name` | string | Nein | Name des Unternehmens, in dem die Person arbeitet |
| `domain` | string | Nein | Unternehmensdomäne (z.B. apollo.io) |
| `linkedin_url` | string | Nein | LinkedIn-Profil-URL |
| `reveal_personal_emails` | boolean | Nein | Persönliche E-Mail-Adressen aufdecken (verbraucht Credits) |
| `reveal_phone_number` | boolean | Nein | Telefonnummern aufdecken (verbraucht Credits) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `person` | json | Angereicherte Personendaten von Apollo |
| `metadata` | json | Anreicherungsmetadaten einschließlich Anreicherungsstatus |

### `apollo_people_bulk_enrich`

Daten für bis zu 10 Personen gleichzeitig mit Apollo anreichern

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `people` | array | Ja | Array von Personen zur Anreicherung (max. 10) |
| `reveal_personal_emails` | boolean | Nein | Persönliche E-Mail-Adressen anzeigen (verbraucht Credits) |
| `reveal_phone_number` | boolean | Nein | Telefonnummern anzeigen (verbraucht Credits) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `people` | json | Array von angereicherten Personendaten |
| `metadata` | json | Metadaten zur Massenanreicherung einschließlich Gesamt- und angereicherter Anzahl |

### `apollo_organization_search`

Apollo durchsuchen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `organization_locations` | array | Nein | Zu durchsuchende Unternehmensstandorte |
| `organization_num_employees_ranges` | array | Nein | Bereiche der Mitarbeiterzahl (z.B. ["1-10", "11-50"]) |
| `q_organization_keyword_tags` | array | Nein | Branchen- oder Schlüsselwort-Tags |
| `q_organization_name` | string | Nein | Zu suchender Organisationsname |
| `page` | number | Nein | Seitennummer für Paginierung |
| `per_page` | number | Nein | Ergebnisse pro Seite (max: 100) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `organizations` | json | Array von Organisationen, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich page, per_page und total_entries |

### `apollo_organization_enrich`

Daten für eine einzelne Organisation mit Apollo anreichern

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `organization_name` | string | Nein | Name der Organisation \(mindestens einer von organization_name oder domain ist erforderlich\) |
| `domain` | string | Nein | Unternehmensdomäne \(z.B. apollo.io\) \(mindestens einer von domain oder organization_name ist erforderlich\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `organization` | json | Angereicherte Organisationsdaten von Apollo |
| `metadata` | json | Anreicherungsmetadaten einschließlich des Anreicherungsstatus |

### `apollo_organization_bulk_enrich`

Daten für bis zu 10 Organisationen gleichzeitig mit Apollo anreichern

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `organizations` | array | Ja | Array von zu anreichernden Organisationen \(max. 10\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `organizations` | json | Array von angereicherten Organisationsdaten |
| `metadata` | json | Metadaten zur Massenanreicherung einschließlich Gesamt- und angereicherte Anzahl |

### `apollo_contact_create`

Einen neuen Kontakt in Ihrer Apollo-Datenbank erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `first_name` | string | Ja | Vorname des Kontakts |
| `last_name` | string | Ja | Nachname des Kontakts |
| `email` | string | Nein | E-Mail-Adresse des Kontakts |
| `title` | string | Nein | Berufsbezeichnung |
| `account_id` | string | Nein | Apollo-Konto-ID für die Zuordnung |
| `owner_id` | string | Nein | Benutzer-ID des Kontaktinhabers |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `contact` | json | Erstellte Kontaktdaten von Apollo |
| `metadata` | json | Erstellungsmetadaten einschließlich Erstellungsstatus |

### `apollo_contact_update`

Einen bestehenden Kontakt in Ihrer Apollo-Datenbank aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `contact_id` | string | Ja | ID des zu aktualisierenden Kontakts |
| `first_name` | string | Nein | Vorname des Kontakts |
| `last_name` | string | Nein | Nachname des Kontakts |
| `email` | string | Nein | E-Mail-Adresse |
| `title` | string | Nein | Berufsbezeichnung |
| `account_id` | string | Nein | Apollo-Konto-ID |
| `owner_id` | string | Nein | Benutzer-ID des Kontaktinhabers |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `contact` | json | Aktualisierte Kontaktdaten von Apollo |
| `metadata` | json | Aktualisierte Metadaten einschließlich des aktualisierten Status |

### `apollo_contact_search`

Dein Team durchsuchen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `q_keywords` | string | Nein | Suchbegriffe |
| `contact_stage_ids` | array | Nein | Nach Kontaktphasen-IDs filtern |
| `page` | number | Nein | Seitennummer für Paginierung |
| `per_page` | number | Nein | Ergebnisse pro Seite \(max: 100\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `contacts` | json | Array von Kontakten, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich page, per_page und total_entries |

### `apollo_contact_bulk_create`

Erstelle bis zu 100 Kontakte auf einmal in deiner Apollo-Datenbank. Unterstützt Deduplizierung, um das Erstellen von Duplikaten zu verhindern. Master-Schlüssel erforderlich.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel \(Master-Schlüssel erforderlich\) |
| `contacts` | array | Ja | Array von zu erstellenden Kontakten \(max. 100\). Jeder Kontakt sollte first_name, last_name und optional email, title, account_id, owner_id enthalten |
| `run_dedupe` | boolean | Nein | Aktiviere Deduplizierung, um das Erstellen von Duplikaten zu verhindern. Bei true werden bestehende Kontakte ohne Änderung zurückgegeben |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `created_contacts` | json | Array neu erstellter Kontakte |
| `existing_contacts` | json | Array bestehender Kontakte \(wenn Deduplizierung aktiviert ist\) |
| `metadata` | json | Metadaten zur Massenerstellung einschließlich Anzahl erstellter und bestehender Kontakte |

### `apollo_contact_bulk_update`

Aktualisieren Sie bis zu 100 bestehende Kontakte gleichzeitig in Ihrer Apollo-Datenbank. Jeder Kontakt muss ein ID-Feld enthalten. Master-Key erforderlich.

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel \(Master-Key erforderlich\) |
| `contacts` | array | Ja | Array zu aktualisierender Kontakte \(max. 100\). Jeder Kontakt muss ein ID-Feld enthalten und optional first_name, last_name, email, title, account_id, owner_id |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updated_contacts` | json | Array erfolgreich aktualisierter Kontakte |
| `failed_contacts` | json | Array von Kontakten, deren Aktualisierung fehlgeschlagen ist |
| `metadata` | json | Metadaten zur Massenaktualisierung einschließlich Anzahl aktualisierter und fehlgeschlagener Kontakte |

### `apollo_account_create`

Erstellen Sie ein neues Konto (Unternehmen) in Ihrer Apollo-Datenbank

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `name` | string | Ja | Unternehmensname |
| `website_url` | string | Nein | Unternehmens-Website-URL |
| `phone` | string | Nein | Telefonnummer des Unternehmens |
| `owner_id` | string | Nein | Benutzer-ID des Kontoinhabers |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `account` | json | Erstellte Kontodaten von Apollo |
| `metadata` | json | Erstellungsmetadaten einschließlich Erstellungsstatus |

### `apollo_account_update`

Aktualisieren eines vorhandenen Kontos in Ihrer Apollo-Datenbank

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `account_id` | string | Ja | ID des zu aktualisierenden Kontos |
| `name` | string | Nein | Firmenname |
| `website_url` | string | Nein | Firmen-Website-URL |
| `phone` | string | Nein | Telefonnummer des Unternehmens |
| `owner_id` | string | Nein | Benutzer-ID des Kontoinhabers |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `account` | json | Aktualisierte Kontodaten von Apollo |
| `metadata` | json | Aktualisierungsmetadaten einschließlich Aktualisierungsstatus |

### `apollo_account_search`

Durchsuchen Ihres Teams

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel \(Hauptschlüssel erforderlich\) |
| `q_keywords` | string | Nein | Suchbegriffe für Kontodaten |
| `owner_id` | string | Nein | Filtern nach Benutzer-ID des Kontoinhabers |
| `account_stage_ids` | array | Nein | Filtern nach Kontophase-IDs |
| `page` | number | Nein | Seitennummer für Paginierung |
| `per_page` | number | Nein | Ergebnisse pro Seite \(max: 100\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `accounts` | json | Array von Konten, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich page, per_page und total_entries |

### `apollo_account_bulk_create`

Erstellen Sie bis zu 100 Konten auf einmal in Ihrer Apollo-Datenbank. Hinweis: Apollo wendet keine Deduplizierung an - doppelte Konten können erstellt werden, wenn Einträge ähnliche Namen oder Domains haben. Master-Key erforderlich.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel \(Master-Key erforderlich\) |
| `accounts` | array | Ja | Array von zu erstellenden Konten \(max. 100\). Jedes Konto sollte einen Namen \(erforderlich\) und optional website_url, phone, owner_id enthalten |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `created_accounts` | json | Array neu erstellter Konten |
| `failed_accounts` | json | Array von Konten, deren Erstellung fehlgeschlagen ist |
| `metadata` | json | Metadaten zur Massenerstellung einschließlich Anzahl erstellter und fehlgeschlagener Konten |

### `apollo_account_bulk_update`

Aktualisieren Sie bis zu 1000 bestehende Konten auf einmal in Ihrer Apollo-Datenbank (höheres Limit als bei Kontakten!). Jedes Konto muss ein id-Feld enthalten. Master-Key erforderlich.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel \(Master-Key erforderlich\) |
| `accounts` | array | Ja | Array zu aktualisierender Konten \(max. 1000\). Jedes Konto muss ein id-Feld enthalten und optional name, website_url, phone, owner_id |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `updated_accounts` | json | Array der erfolgreich aktualisierten Konten |
| `failed_accounts` | json | Array der Konten, deren Aktualisierung fehlgeschlagen ist |
| `metadata` | json | Metadaten zur Massenaktualisierung, einschließlich der Anzahl aktualisierter und fehlgeschlagener Konten |

### `apollo_opportunity_create`

Erstellen Sie einen neuen Deal für ein Konto in Ihrer Apollo-Datenbank (Master-Key erforderlich)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel \(Master-Key erforderlich\) |
| `name` | string | Ja | Name der Opportunity/des Deals |
| `account_id` | string | Ja | ID des Kontos, zu dem diese Opportunity gehört |
| `amount` | number | Nein | Geldwert der Opportunity |
| `stage_id` | string | Nein | ID der Deal-Phase |
| `owner_id` | string | Nein | Benutzer-ID des Opportunity-Eigentümers |
| `close_date` | string | Nein | Erwartetes Abschlussdatum \(ISO 8601-Format\) |
| `description` | string | Nein | Beschreibung oder Notizen zur Opportunity |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `opportunity` | json | Erstellte Opportunity-Daten von Apollo |
| `metadata` | json | Erstellungsmetadaten einschließlich Erstellungsstatus |

### `apollo_opportunity_search`

Suchen und listen Sie alle Deals/Opportunities in Ihrem Team auf

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `q_keywords` | string | Nein | Suchbegriffe für die Suche in Opportunity-Namen |
| `account_ids` | array | Nein | Nach bestimmten Account-IDs filtern |
| `stage_ids` | array | Nein | Nach Deal-Phase-IDs filtern |
| `owner_ids` | array | Nein | Nach Opportunity-Besitzer-IDs filtern |
| `page` | number | Nein | Seitennummer für Paginierung |
| `per_page` | number | Nein | Ergebnisse pro Seite \(max: 100\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `opportunities` | json | Array von Opportunities, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich page, per_page und total_entries |

### `apollo_opportunity_get`

Vollständige Details eines bestimmten Deals/Opportunity anhand der ID abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `opportunity_id` | string | Ja | ID der abzurufenden Opportunity |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `opportunity` | json | Vollständige Opportunity-Daten von Apollo |
| `metadata` | json | Abruf-Metadaten einschließlich Gefunden-Status |

### `apollo_opportunity_update`

Einen bestehenden Deal/Opportunity in Ihrer Apollo-Datenbank aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel |
| `opportunity_id` | string | Ja | ID der zu aktualisierenden Opportunity |
| `name` | string | Nein | Name der Opportunity/des Deals |
| `amount` | number | Nein | Geldwert der Opportunity |
| `stage_id` | string | Nein | ID der Deal-Phase |
| `owner_id` | string | Nein | Benutzer-ID des Opportunity-Eigentümers |
| `close_date` | string | Nein | Erwartetes Abschlussdatum (ISO 8601-Format) |
| `description` | string | Nein | Beschreibung oder Notizen zur Opportunity |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `opportunity` | json | Aktualisierte Opportunity-Daten von Apollo |
| `metadata` | json | Aktualisierungsmetadaten einschließlich Aktualisierungsstatus |

### `apollo_sequence_search`

Suche nach Sequenzen/Kampagnen in deinem Team

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel (Master-Schlüssel erforderlich) |
| `q_name` | string | Nein | Sequenzen nach Namen durchsuchen |
| `active` | boolean | Nein | Nach Aktivitätsstatus filtern (true für aktive Sequenzen, false für inaktive) |
| `page` | number | Nein | Seitennummer für Paginierung |
| `per_page` | number | Nein | Ergebnisse pro Seite (max: 100) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `sequences` | json | Array von Sequenzen/Kampagnen, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich page, per_page und total_entries |

### `apollo_sequence_add_contacts`

Kontakte zu einer Apollo-Sequenz hinzufügen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel (Master-Schlüssel erforderlich) |
| `sequence_id` | string | Ja | ID der Sequenz, zu der Kontakte hinzugefügt werden sollen |
| `contact_ids` | array | Ja | Array von Kontakt-IDs, die zur Sequenz hinzugefügt werden sollen |
| `emailer_campaign_id` | string | Nein | Optionale E-Mail-Kampagnen-ID |
| `send_email_from_user_id` | string | Nein | Benutzer-ID, von der E-Mails gesendet werden sollen |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `contacts_added` | json | Array von Kontakt-IDs, die zur Sequenz hinzugefügt wurden |
| `metadata` | json | Sequenz-Metadaten einschließlich sequence_id und total_added Anzahl |

### `apollo_task_create`

Eine neue Aufgabe in Apollo erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel (Master-Schlüssel erforderlich) |
| `note` | string | Ja | Aufgabennotiz/Beschreibung |
| `contact_id` | string | Nein | Zu verknüpfende Kontakt-ID |
| `account_id` | string | Nein | Zu verknüpfende Account-ID |
| `due_at` | string | Nein | Fälligkeitsdatum im ISO-Format |
| `priority` | string | Nein | Aufgabenpriorität |
| `type` | string | Nein | Aufgabentyp |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `task` | json | Erstellte Aufgabendaten von Apollo |
| `metadata` | json | Erstellungsmetadaten einschließlich des Erstellungsstatus |

### `apollo_task_search`

Suche nach Aufgaben in Apollo

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel (Master-Schlüssel erforderlich) |
| `contact_id` | string | Nein | Nach Kontakt-ID filtern |
| `account_id` | string | Nein | Nach Konto-ID filtern |
| `completed` | boolean | Nein | Nach Abschlussstatus filtern |
| `page` | number | Nein | Seitennummer für Paginierung |
| `per_page` | number | Nein | Ergebnisse pro Seite (max: 100) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tasks` | json | Array von Aufgaben, die den Suchkriterien entsprechen |
| `metadata` | json | Paginierungsinformationen einschließlich Seite, pro_Seite und Gesamteinträge |

### `apollo_email_accounts`

Liste des Teams abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | Apollo API-Schlüssel (Master-Schlüssel erforderlich) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `email_accounts` | json | Array von Team-E-Mail-Konten, die in Apollo verknüpft sind |
| `metadata` | json | Metadaten einschließlich der Gesamtanzahl von E-Mail-Konten |

## Notizen

- Kategorie: `tools`
- Typ: `apollo`
```

--------------------------------------------------------------------------------

---[FILE: arxiv.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/arxiv.mdx

```text
---
title: ArXiv
description: Suche und rufe wissenschaftliche Arbeiten von ArXiv ab
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="arxiv"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[ArXiv](https://arxiv.org/) ist ein kostenfreies, frei zugängliches Repository für wissenschaftliche Forschungsarbeiten in Bereichen wie Physik, Mathematik, Informatik, quantitative Biologie, quantitative Finanzwissenschaft, Statistik, Elektrotechnik, Systemwissenschaften und Wirtschaftswissenschaften. ArXiv bietet eine umfangreiche Sammlung von Preprints und veröffentlichten Artikeln und ist damit eine primäre Ressource für Forscher und Praktiker weltweit.

Mit ArXiv können Sie:

- **Nach wissenschaftlichen Arbeiten suchen**: Finden Sie Forschungsarbeiten anhand von Schlüsselwörtern, Autorennamen, Titeln, Kategorien und mehr
- **Metadaten von Arbeiten abrufen**: Zugriff auf Abstracts, Autorenlisten, Veröffentlichungsdaten und andere bibliografische Informationen
- **Volltext-PDFs herunterladen**: Erhalten Sie den vollständigen Text der meisten Arbeiten für eingehende Studien
- **Autorenbeiträge erkunden**: Sehen Sie alle Arbeiten eines bestimmten Autors
- **Auf dem Laufenden bleiben**: Entdecken Sie die neuesten Einreichungen und Trendthemen in Ihrem Fachgebiet

In Sim ermöglicht die ArXiv-Integration Ihren Agenten, wissenschaftliche Arbeiten von ArXiv programmatisch zu suchen, abzurufen und zu analysieren. Dies erlaubt Ihnen, Literaturrecherchen zu automatisieren, Forschungsassistenten zu erstellen oder aktuelles wissenschaftliches Wissen in Ihre agentischen Workflows einzubinden. Nutzen Sie ArXiv als dynamische Datenquelle für Forschung, Entdeckung und Wissensextraktion innerhalb Ihrer Sim-Projekte.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriert ArXiv in den Workflow. Kann nach Arbeiten suchen, Arbeitsdetails abrufen und Autorenarbeiten finden. Benötigt kein OAuth oder einen API-Schlüssel.

## Tools

### `arxiv_search`

Suche nach wissenschaftlichen Artikeln auf ArXiv nach Schlüsselwörtern, Autoren, Titeln oder anderen Feldern.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `searchQuery` | string | Ja | Die auszuführende Suchanfrage |
| `searchField` | string | Nein | Feld, in dem gesucht werden soll: all, ti \(Titel\), au \(Autor\), abs \(Abstract\), co \(Kommentar\), jr \(Journal\), cat \(Kategorie\), rn \(Berichtsnummer\) |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 10, max: 2000\) |
| `sortBy` | string | Nein | Sortieren nach: relevance, lastUpdatedDate, submittedDate \(Standard: relevance\) |
| `sortOrder` | string | Nein | Sortierreihenfolge: ascending, descending \(Standard: descending\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `papers` | json | Array von Artikeln, die der Suchanfrage entsprechen |

### `arxiv_get_paper`

Erhalte detaillierte Informationen über einen bestimmten ArXiv-Artikel anhand seiner ID.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `paperId` | string | Ja | ArXiv-Artikel-ID \(z.B. "1706.03762"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `paper` | json | Detaillierte Informationen über den angeforderten ArXiv-Artikel |

### `arxiv_get_author_papers`

Suche nach Artikeln eines bestimmten Autors auf ArXiv.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authorName` | string | Ja | Zu suchender Autorenname |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 10, max: 2000\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `authorPapers` | json | Array von Publikationen, die vom angegebenen Autor verfasst wurden |

## Hinweise

- Kategorie: `tools`
- Typ: `arxiv`
```

--------------------------------------------------------------------------------

---[FILE: asana.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/asana.mdx

```text
---
title: Asana
description: Mit Asana interagieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="asana"
  color="#E0E0E0"
/>

## Nutzungsanleitung

Integriere Asana in den Workflow. Kann Aufgaben lesen, schreiben und aktualisieren.

## Tools

### `asana_get_task`

Eine einzelne Aufgabe anhand der GID abrufen oder mehrere Aufgaben mit Filtern erhalten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | Nein | Die global eindeutige Kennung \(GID\) der Aufgabe. Wenn nicht angegeben, werden mehrere Aufgaben abgerufen. |
| `workspace` | string | Nein | Workspace-GID zum Filtern von Aufgaben \(erforderlich, wenn taskGid nicht verwendet wird\) |
| `project` | string | Nein | Projekt-GID zum Filtern von Aufgaben |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Aufgaben \(Standard: 50\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `ts` | string | Zeitstempel der Antwort |
| `gid` | string | Global eindeutige Kennung der Aufgabe |
| `resource_type` | string | Ressourcentyp \(task\) |
| `resource_subtype` | string | Ressourcen-Subtyp |
| `name` | string | Aufgabenname |
| `notes` | string | Aufgabennotizen oder -beschreibung |
| `completed` | boolean | Ob die Aufgabe abgeschlossen ist |
| `assignee` | object | Details zum Zugewiesenen |

### `asana_create_task`

Eine neue Aufgabe in Asana erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Ja | Workspace-GID, in dem die Aufgabe erstellt wird |
| `name` | string | Ja | Name der Aufgabe |
| `notes` | string | Nein | Notizen oder Beschreibung für die Aufgabe |
| `assignee` | string | Nein | Benutzer-GID, dem die Aufgabe zugewiesen werden soll |
| `due_on` | string | Nein | Fälligkeitsdatum im Format JJJJ-MM-TT |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `ts` | string | Zeitstempel der Antwort |
| `gid` | string | Global eindeutige Kennung der Aufgabe |
| `name` | string | Aufgabenname |
| `notes` | string | Aufgabennotizen oder -beschreibung |
| `completed` | boolean | Ob die Aufgabe abgeschlossen ist |
| `created_at` | string | Zeitstempel der Aufgabenerstellung |
| `permalink_url` | string | URL zur Aufgabe in Asana |

### `asana_update_task`

Eine bestehende Aufgabe in Asana aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | Ja | Die global eindeutige Kennung (GID) der zu aktualisierenden Aufgabe |
| `name` | string | Nein | Aktualisierter Name für die Aufgabe |
| `notes` | string | Nein | Aktualisierte Notizen oder Beschreibung für die Aufgabe |
| `assignee` | string | Nein | Aktualisierte Benutzer-GID des Zugewiesenen |
| `completed` | boolean | Nein | Aufgabe als abgeschlossen oder nicht abgeschlossen markieren |
| `due_on` | string | Nein | Aktualisiertes Fälligkeitsdatum im Format JJJJ-MM-TT |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `ts` | string | Zeitstempel der Antwort |
| `gid` | string | Global eindeutige Kennung der Aufgabe |
| `name` | string | Aufgabenname |
| `notes` | string | Aufgabennotizen oder -beschreibung |
| `completed` | boolean | Ob die Aufgabe abgeschlossen ist |
| `modified_at` | string | Zeitstempel der letzten Änderung der Aufgabe |

### `asana_get_projects`

Alle Projekte aus einem Asana-Workspace abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Ja | Workspace-GID, aus der Projekte abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `ts` | string | Zeitstempel der Antwort |
| `projects` | array | Array von Projekten |

### `asana_search_tasks`

Nach Aufgaben in einem Asana-Workspace suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Ja | Workspace-GID, in der nach Aufgaben gesucht werden soll |
| `text` | string | Nein | Text, nach dem in Aufgabennamen gesucht werden soll |
| `assignee` | string | Nein | Aufgaben nach Bearbeiter-GID filtern |
| `projects` | array | Nein | Array von Projekt-GIDs, nach denen Aufgaben gefiltert werden sollen |
| `completed` | boolean | Nein | Nach Abschlussstatus filtern |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `ts` | string | Zeitstempel der Antwort |
| `tasks` | array | Array von passenden Aufgaben |

### `asana_add_comment`

Einen Kommentar (Story) zu einer Asana-Aufgabe hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | Ja | Die global eindeutige Kennung \(GID\) der Aufgabe |
| `text` | string | Ja | Der Textinhalt des Kommentars |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `ts` | string | Zeitstempel der Antwort |
| `gid` | string | Global eindeutige Kennung des Kommentars |
| `text` | string | Textinhalt des Kommentars |
| `created_at` | string | Erstellungszeitstempel des Kommentars |
| `created_by` | object | Details zum Autor des Kommentars |

## Hinweise

- Kategorie: `tools`
- Typ: `asana`
```

--------------------------------------------------------------------------------

---[FILE: browser_use.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/browser_use.mdx

```text
---
title: Browser-Nutzung
description: Browser-Automatisierungsaufgaben ausführen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="browser_use"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[BrowserUse](https://browser-use.com/) ist eine leistungsstarke Browser-Automatisierungsplattform, die es ermöglicht, Browser-Aufgaben programmatisch zu erstellen und auszuführen. Sie bietet eine Möglichkeit, Webinteraktionen durch natürlichsprachliche Anweisungen zu automatisieren, sodass Sie Websites navigieren, Formulare ausfüllen, Daten extrahieren und komplexe Aktionssequenzen durchführen können, ohne Code zu schreiben.

Mit BrowserUse können Sie:

- **Webinteraktionen automatisieren**: Zu Websites navigieren, Buttons klicken, Formulare ausfüllen und andere Browser-Aktionen durchführen
- **Daten extrahieren**: Inhalte von Websites extrahieren, einschließlich Text, Bilder und strukturierte Daten
- **Komplexe Workflows ausführen**: Mehrere Aktionen verketten, um anspruchsvolle Web-Aufgaben zu erledigen
- **Aufgabenausführung überwachen**: Browser-Aufgaben in Echtzeit mit visuellem Feedback beobachten
- **Ergebnisse programmatisch verarbeiten**: Strukturierte Ausgaben von Web-Automatisierungsaufgaben erhalten

In Sim ermöglicht die BrowserUse-Integration Ihren Agenten, mit dem Web zu interagieren, als wären sie menschliche Benutzer. Dies ermöglicht Szenarien wie Recherche, Datenerfassung, Formularübermittlung und Web-Tests - alles durch einfache natürlichsprachliche Anweisungen. Ihre Agenten können Informationen von Websites sammeln, mit Webanwendungen interagieren und Aktionen durchführen, die normalerweise manuelles Browsen erfordern würden, wodurch ihre Fähigkeiten erweitert werden, um das gesamte Web als Ressource einzubeziehen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Browser Use in den Workflow. Kann im Web navigieren und Aktionen ausführen, als ob ein echter Benutzer mit dem Browser interagieren würde. Erfordert API-Schlüssel.

## Tools

### `browser_use_run_task`

Führt eine Browser-Automatisierungsaufgabe mit BrowserUse aus

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `task` | string | Ja | Was der Browser-Agent tun soll |
| `variables` | json | Nein | Optionale Variablen zur Verwendung als Secrets \(Format: \{key: value\}\) |
| `format` | string | Nein | Keine Beschreibung |
| `save_browser_data` | boolean | Nein | Ob Browser-Daten gespeichert werden sollen |
| `model` | string | Nein | Zu verwendende LLM-Modell \(Standard: gpt-4o\) |
| `apiKey` | string | Ja | API-Schlüssel für die BrowserUse API |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `id` | string | Aufgabenausführungskennung |
| `success` | boolean | Status der Aufgabenfertigstellung |
| `output` | json | Ausgabedaten der Aufgabe |
| `steps` | json | Ausgeführte Schritte |

## Hinweise

- Kategorie: `tools`
- Typ: `browser_use`
```

--------------------------------------------------------------------------------

````
