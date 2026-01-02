---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 39
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 39 of 933)

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

---[FILE: pinecone.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/pinecone.mdx

```text
---
title: Pinecone
description: Verwende die Pinecone Vektordatenbank
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pinecone"
  color="#0D1117"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pinecone](https://www.pinecone.io) ist eine Vektordatenbank, die für die Entwicklung von hochleistungsfähigen Vektorsuchanwendungen konzipiert wurde. Sie ermöglicht die effiziente Speicherung, Verwaltung und Ähnlichkeitssuche von hochdimensionalen Vektoreinbettungen und ist damit ideal für KI-Anwendungen, die semantische Suchfunktionen erfordern.

Mit Pinecone können Sie:

- **Vektoreinbettungen speichern**: Effiziente Verwaltung hochdimensionaler Vektoren im großen Maßstab
- **Ähnlichkeitssuche durchführen**: Finden Sie die ähnlichsten Vektoren zu einem Abfragevektor in Millisekunden
- **Semantische Suche aufbauen**: Erstellen Sie Sucherlebnisse, die auf Bedeutung statt auf Schlüsselwörtern basieren
- **Empfehlungssysteme implementieren**: Generieren Sie personalisierte Empfehlungen basierend auf Inhaltsähnlichkeit
- **Machine-Learning-Modelle bereitstellen**: Operationalisieren Sie ML-Modelle, die auf Vektorähnlichkeit basieren
- **Nahtlos skalieren**: Verarbeiten Sie Milliarden von Vektoren mit konstanter Leistung
- **Echtzeit-Indizes pflegen**: Aktualisieren Sie Ihre Vektordatenbank in Echtzeit, wenn neue Daten eintreffen

In Sim ermöglicht die Pinecone-Integration Ihren Agenten, Vektorsuchfunktionen programmatisch als Teil ihrer Workflows zu nutzen. Dies erlaubt anspruchsvolle Automatisierungsszenarien, die natürliche Sprachverarbeitung mit semantischer Suche und Abruf kombinieren. Ihre Agenten können Embeddings aus Text generieren, diese Vektoren in Pinecone-Indizes speichern und Ähnlichkeitssuchen durchführen, um die relevantesten Informationen zu finden. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und der Vektorsuchinfrastruktur und ermöglicht eine intelligentere Informationsgewinnung basierend auf semantischer Bedeutung statt exakter Schlüsselwortübereinstimmung. Durch die Verbindung von Sim mit Pinecone können Sie Agenten erstellen, die Kontext verstehen, relevante Informationen aus großen Datensätzen abrufen und genauere sowie personalisierte Antworten an Benutzer liefern - alles ohne komplexes Infrastrukturmanagement oder spezialisiertes Wissen über Vektordatenbanken.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Pinecone in den Workflow. Kann Embeddings generieren, Text einfügen, mit Text suchen, Vektoren abrufen und mit Vektoren suchen. Erfordert API-Schlüssel.

## Tools

### `pinecone_generate_embeddings`

Generieren von Embeddings aus Text mit Pinecone

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `model` | string | Ja | Modell zur Generierung von Embeddings |
| `inputs` | array | Ja | Array von Texteingaben, für die Embeddings generiert werden sollen |
| `apiKey` | string | Ja | Pinecone API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | array | Generierte Embedding-Daten mit Werten und Vektortyp |
| `model` | string | Für die Generierung von Embeddings verwendetes Modell |
| `vector_type` | string | Typ des generierten Vektors \(dicht/spärlich\) |
| `usage` | object | Nutzungsstatistiken für die Embedding-Generierung |

### `pinecone_upsert_text`

Text-Datensätze in einen Pinecone-Index einfügen oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Ja | Vollständige Pinecone-Index-Host-URL |
| `namespace` | string | Ja | Namespace, in den Datensätze eingefügt werden sollen |
| `records` | array | Ja | Datensatz oder Array von Datensätzen zum Einfügen, jeder enthält _id, Text und optionale Metadaten |
| `apiKey` | string | Ja | Pinecone API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `statusText` | string | Status des Einfügevorgangs |
| `upsertedCount` | number | Anzahl der erfolgreich eingefügten Datensätze |

### `pinecone_search_text`

Nach ähnlichem Text in einem Pinecone-Index suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Ja | Vollständige Pinecone-Index-Host-URL |
| `namespace` | string | Nein | Namespace, in dem gesucht werden soll |
| `searchQuery` | string | Ja | Text, nach dem gesucht werden soll |
| `topK` | string | Nein | Anzahl der zurückzugebenden Ergebnisse |
| `fields` | array | Nein | Felder, die in den Ergebnissen zurückgegeben werden sollen |
| `filter` | object | Nein | Filter, der auf die Suche angewendet werden soll |
| `rerank` | object | Nein | Parameter für die Neusortierung |
| `apiKey` | string | Ja | Pinecone API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `matches` | array | Suchergebnisse mit ID, Bewertung und Metadaten |

### `pinecone_search_vector`

Suche nach ähnlichen Vektoren in einem Pinecone-Index

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Ja | Vollständige Pinecone-Index-Host-URL |
| `namespace` | string | Nein | Namespace, in dem gesucht werden soll |
| `vector` | array | Ja | Zu suchender Vektor |
| `topK` | number | Nein | Anzahl der zurückzugebenden Ergebnisse |
| `filter` | object | Nein | Filter für die Suche |
| `includeValues` | boolean | Nein | Vektorwerte in der Antwort einschließen |
| `includeMetadata` | boolean | Nein | Metadaten in der Antwort einschließen |
| `apiKey` | string | Ja | Pinecone API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `matches` | array | Vektorsuchergebnisse mit ID, Bewertung, Werten und Metadaten |
| `namespace` | string | Namespace, in dem die Suche durchgeführt wurde |

### `pinecone_fetch`

Vektoren nach ID aus einem Pinecone-Index abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Ja | Vollständige Pinecone-Index-Host-URL |
| `ids` | array | Ja | Array von Vektor-IDs zum Abrufen |
| `namespace` | string | Nein | Namespace, aus dem Vektoren abgerufen werden sollen |
| `apiKey` | string | Ja | Pinecone API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `matches` | Array | Abgerufene Vektoren mit ID, Werten, Metadaten und Bewertung |

## Hinweise

- Kategorie: `tools`
- Typ: `pinecone`
```

--------------------------------------------------------------------------------

---[FILE: pipedrive.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/pipedrive.mdx

```text
---
title: Pipedrive
description: Interagiere mit Pipedrive CRM
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pipedrive"
  color="#2E6936"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pipedrive](https://www.pipedrive.com) ist eine leistungsstarke, vertriebsorientierte CRM-Plattform, die Vertriebsteams dabei hilft, Leads zu verwalten, Deals zu verfolgen und ihre Vertriebspipeline zu optimieren. Mit Fokus auf Einfachheit und Effektivität entwickelt, ist Pipedrive bei Vertriebsprofis und wachsenden Unternehmen weltweit aufgrund seines intuitiven visuellen Pipeline-Managements und handlungsrelevanter Vertriebseinblicke sehr beliebt.

Pipedrive bietet eine umfassende Suite von Tools zur Verwaltung des gesamten Vertriebsprozesses von der Lead-Erfassung bis zum Abschluss. Mit seiner robusten API und umfangreichen Integrationsmöglichkeiten ermöglicht Pipedrive Vertriebsteams, wiederkehrende Aufgaben zu automatisieren, Datenkonsistenz zu gewährleisten und sich auf das Wesentliche zu konzentrieren – Deals abzuschließen.

Zu den Hauptfunktionen von Pipedrive gehören:

- Visuelle Vertriebspipeline: Intuitive Drag-and-Drop-Oberfläche zur Verwaltung von Deals durch anpassbare Vertriebsphasen
- Lead-Management: Umfassender Lead-Posteingang zum Erfassen, Qualifizieren und Konvertieren potenzieller Chancen
- Aktivitätsverfolgung: Ausgeklügeltes System zur Planung und Verfolgung von Anrufen, Meetings, E-Mails und Aufgaben
- Projektmanagement: Integrierte Projektverfolgungsfunktionen für Kundenerfolg und Lieferung nach dem Verkauf
- E-Mail-Integration: Native Postfach-Integration für nahtlose Kommunikationsverfolgung innerhalb des CRM

In Sim ermöglicht die Pipedrive-Integration Ihren KI-Agenten eine nahtlose Interaktion mit Ihrem Verkaufsprozess. Dies schafft Möglichkeiten für automatisierte Lead-Qualifizierung, Erstellung und Aktualisierung von Deals, Aktivitätsplanung und Pipeline-Management als Teil Ihrer KI-gestützten Verkaufsprozesse. Die Integration ermöglicht Agenten, Deals, Leads, Aktivitäten und Projekte programmatisch zu erstellen, abzurufen, zu aktualisieren und zu verwalten, was intelligente Verkaufsautomatisierung erleichtert und sicherstellt, dass wichtige Kundeninformationen ordnungsgemäß verfolgt und bearbeitet werden. Durch die Verbindung von Sim mit Pipedrive können Sie KI-Agenten erstellen, die die Sichtbarkeit der Verkaufspipeline aufrechterhalten, Routine-CRM-Aufgaben automatisieren, Leads intelligent qualifizieren und sicherstellen, dass keine Chancen verloren gehen – was die Produktivität des Verkaufsteams steigert und ein konstantes Umsatzwachstum fördert.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Pipedrive in Ihren Workflow. Verwalten Sie Deals, Kontakte, Verkaufspipeline, Projekte, Aktivitäten, Dateien und Kommunikation mit leistungsstarken CRM-Funktionen.

## Tools

### `pipedrive_get_all_deals`

Alle Deals von Pipedrive mit optionalen Filtern abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `status` | string | Nein | Ruft nur Deals mit einem bestimmten Status ab. Werte: open, won, lost. Wenn nicht angegeben, werden alle nicht gelöschten Deals zurückgegeben |
| `person_id` | string | Nein | Wenn angegeben, werden nur Deals zurückgegeben, die mit der angegebenen Person verknüpft sind |
| `org_id` | string | Nein | Wenn angegeben, werden nur Deals zurückgegeben, die mit der angegebenen Organisation verknüpft sind |
| `pipeline_id` | string | Nein | Wenn angegeben, werden nur Deals in der angegebenen Pipeline zurückgegeben |
| `updated_since` | string | Nein | Wenn gesetzt, werden nur Deals zurückgegeben, die nach diesem Zeitpunkt aktualisiert wurden. Format: 2025-01-01T10:20:00Z |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 500\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deals` | array | Array von Deal-Objekten aus Pipedrive |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `pipedrive_get_deal`

Detaillierte Informationen über einen bestimmten Deal abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Ja | Die ID des abzurufenden Deals |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deal` | object | Deal-Objekt mit vollständigen Details |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `pipedrive_create_deal`

Einen neuen Deal in Pipedrive erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Der Titel des Deals |
| `value` | string | Nein | Der Geldwert des Deals |
| `currency` | string | Nein | Währungscode (z.B. USD, EUR) |
| `person_id` | string | Nein | ID der Person, mit der dieser Deal verbunden ist |
| `org_id` | string | Nein | ID der Organisation, mit der dieser Deal verbunden ist |
| `pipeline_id` | string | Nein | ID der Pipeline, in der dieser Deal platziert werden soll |
| `stage_id` | string | Nein | ID der Phase, in der dieser Deal platziert werden soll |
| `status` | string | Nein | Status des Deals: open, won, lost |
| `expected_close_date` | string | Nein | Erwartetes Abschlussdatum im Format JJJJ-MM-TT |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deal` | object | Das erstellte Deal-Objekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `pipedrive_update_deal`

Aktualisieren eines bestehenden Deals in Pipedrive

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Ja | Die ID des zu aktualisierenden Deals |
| `title` | string | Nein | Neuer Titel für den Deal |
| `value` | string | Nein | Neuer Geldwert für den Deal |
| `status` | string | Nein | Neuer Status: open, won, lost |
| `stage_id` | string | Nein | Neue Phase-ID für den Deal |
| `expected_close_date` | string | Nein | Neues erwartetes Abschlussdatum im Format JJJJ-MM-TT |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deal` | object | Das aktualisierte Deal-Objekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `pipedrive_get_files`

Dateien von Pipedrive mit optionalen Filtern abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Nein | Dateien nach Deal-ID filtern |
| `person_id` | string | Nein | Dateien nach Personen-ID filtern |
| `org_id` | string | Nein | Dateien nach Organisations-ID filtern |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse (Standard: 100, max: 500) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `files` | array | Array von Datei-Objekten aus Pipedrive |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `pipedrive_get_mail_messages`

E-Mail-Threads aus dem Pipedrive-Postfach abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `folder` | string | Nein | Nach Ordner filtern: inbox, drafts, sent, archive \(Standard: inbox\) |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 50\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `messages` | array | Array von E-Mail-Thread-Objekten aus der Pipedrive-Mailbox |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Erfolgsstatus der Operation |

### `pipedrive_get_mail_thread`

Alle Nachrichten aus einem bestimmten E-Mail-Thread abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `thread_id` | string | Ja | Die ID des E-Mail-Threads |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `messages` | array | Array von E-Mail-Nachrichtenobjekten aus dem Thread |
| `metadata` | object | Operationsmetadaten einschließlich Thread-ID |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_get_pipelines`

Alle Pipelines aus Pipedrive abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `sort_by` | string | Nein | Feld für die Sortierung: id, update_time, add_time \(Standard: id\) |
| `sort_direction` | string | Nein | Sortierrichtung: asc, desc \(Standard: asc\) |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 500\) |
| `cursor` | string | Nein | Für Paginierung, der Marker, der das erste Element auf der nächsten Seite darstellt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pipelines` | array | Array von Pipeline-Objekten aus Pipedrive |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_get_pipeline_deals`

Alle Deals in einer bestimmten Pipeline abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pipeline_id` | string | Ja | Die ID der Pipeline |
| `stage_id` | string | Nein | Nach bestimmter Phase innerhalb der Pipeline filtern |
| `status` | string | Nein | Nach Deal-Status filtern: open, won, lost |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 500\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deals` | array | Array von Deal-Objekten aus der Pipeline |
| `metadata` | object | Operationsmetadaten einschließlich Pipeline-ID |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_get_projects`

Alle Projekte oder ein bestimmtes Projekt von Pipedrive abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | Nein | Optional: ID eines bestimmten abzurufenden Projekts |
| `status` | string | Nein | Nach Projektstatus filtern: open, completed, deleted \(nur für die Auflistung aller\) |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 500, nur für die Auflistung aller\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `projects` | array | Array von Projektobjekten (bei Auflistung aller) |
| `project` | object | Einzelnes Projektobjekt (wenn project_id angegeben ist) |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_create_project`

Erstelle ein neues Projekt in Pipedrive

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Der Titel des Projekts |
| `description` | string | Nein | Beschreibung des Projekts |
| `start_date` | string | Nein | Projektstartdatum im Format JJJJ-MM-TT |
| `end_date` | string | Nein | Projektendedatum im Format JJJJ-MM-TT |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `project` | object | Das erstellte Projektobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_get_activities`

Aktivitäten (Aufgaben) von Pipedrive mit optionalen Filtern abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Nein | Aktivitäten nach Deal-ID filtern |
| `person_id` | string | Nein | Aktivitäten nach Personen-ID filtern |
| `org_id` | string | Nein | Aktivitäten nach Organisations-ID filtern |
| `type` | string | Nein | Nach Aktivitätstyp filtern \(Anruf, Meeting, Aufgabe, Frist, E-Mail, Mittagessen\) |
| `done` | string | Nein | Nach Abschlussstatus filtern: 0 für nicht erledigt, 1 für erledigt |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 500\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `activities` | array | Array von Aktivitätsobjekten aus Pipedrive |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_create_activity`

Eine neue Aktivität (Aufgabe) in Pipedrive erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `subject` | string | Ja | Der Betreff/Titel der Aktivität |
| `type` | string | Ja | Aktivitätstyp: call, meeting, task, deadline, email, lunch |
| `due_date` | string | Ja | Fälligkeitsdatum im Format JJJJ-MM-TT |
| `due_time` | string | Nein | Fälligkeitszeit im Format HH:MM |
| `duration` | string | Nein | Dauer im Format HH:MM |
| `deal_id` | string | Nein | ID des zu verknüpfenden Deals |
| `person_id` | string | Nein | ID der zu verknüpfenden Person |
| `org_id` | string | Nein | ID der zu verknüpfenden Organisation |
| `note` | string | Nein | Notizen für die Aktivität |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `activity` | object | Das erstellte Aktivitätsobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_update_activity`

Eine bestehende Aktivität (Aufgabe) in Pipedrive aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `activity_id` | string | Ja | Die ID der zu aktualisierenden Aktivität |
| `subject` | string | Nein | Neuer Betreff/Titel für die Aktivität |
| `due_date` | string | Nein | Neues Fälligkeitsdatum im Format JJJJ-MM-TT |
| `due_time` | string | Nein | Neue Fälligkeitszeit im Format HH:MM |
| `duration` | string | Nein | Neue Dauer im Format HH:MM |
| `done` | string | Nein | Als erledigt markieren: 0 für nicht erledigt, 1 für erledigt |
| `note` | string | Nein | Neue Notizen für die Aktivität |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `activity` | object | Das aktualisierte Aktivitätsobjekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_get_leads`

Alle Leads oder einen bestimmten Lead von Pipedrive abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Nein | Optional: ID eines bestimmten abzurufenden Leads |
| `archived` | string | Nein | Archivierte Leads anstelle von aktiven abrufen |
| `owner_id` | string | Nein | Nach Besitzer-Benutzer-ID filtern |
| `person_id` | string | Nein | Nach Personen-ID filtern |
| `organization_id` | string | Nein | Nach Organisations-ID filtern |
| `limit` | string | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 100, max: 500\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `leads` | array | Array von Lead-Objekten (bei Auflistung aller) |
| `lead` | object | Einzelnes Lead-Objekt (wenn lead_id angegeben ist) |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_create_lead`

Einen neuen Lead in Pipedrive erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Der Name des Leads |
| `person_id` | string | Nein | ID der Person \(ERFORDERLICH, es sei denn, organization_id wird angegeben\) |
| `organization_id` | string | Nein | ID der Organisation \(ERFORDERLICH, es sei denn, person_id wird angegeben\) |
| `owner_id` | string | Nein | ID des Benutzers, der den Lead besitzen wird |
| `value_amount` | string | Nein | Potenzieller Wertbetrag |
| `value_currency` | string | Nein | Währungscode \(z.B. USD, EUR\) |
| `expected_close_date` | string | Nein | Erwartetes Abschlussdatum im Format JJJJ-MM-TT |
| `visible_to` | string | Nein | Sichtbarkeit: 1 \(Besitzer & Follower\), 3 \(Gesamtes Unternehmen\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `lead` | object | Das erstellte Lead-Objekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_update_lead`

Einen vorhandenen Lead in Pipedrive aktualisieren

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Ja | Die ID des zu aktualisierenden Leads |
| `title` | string | Nein | Neuer Name für den Lead |
| `person_id` | string | Nein | Neue Personen-ID |
| `organization_id` | string | Nein | Neue Organisations-ID |
| `owner_id` | string | Nein | Neue Besitzer-Benutzer-ID |
| `value_amount` | string | Nein | Neuer Wertbetrag |
| `value_currency` | string | Nein | Neuer Währungscode (z.B. USD, EUR) |
| `expected_close_date` | string | Nein | Neues erwartetes Abschlussdatum im Format JJJJ-MM-TT |
| `is_archived` | string | Nein | Lead archivieren: true oder false |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `lead` | object | Das aktualisierte Lead-Objekt |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

### `pipedrive_delete_lead`

Einen bestimmten Lead aus Pipedrive löschen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Ja | Die ID des zu löschenden Leads |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | object | Löschbestätigungsdaten |
| `metadata` | object | Operationsmetadaten |
| `success` | boolean | Status des Operationserfolgs |

## Hinweise

- Kategorie: `tools`
- Typ: `pipedrive`
```

--------------------------------------------------------------------------------

---[FILE: polymarket.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/polymarket.mdx

```text
---
title: Polymarket
description: Zugriff auf Prognosemarktdaten von Polymarket
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="polymarket"
  color="#4C82FB"
/>

{/* MANUAL-CONTENT-START:intro */}
[Polymarket](https://polymarket.com) ist eine dezentralisierte Plattform für Prognosemärkte, auf der Nutzer mit Blockchain-Technologie auf den Ausgang zukünftiger Ereignisse handeln können. Polymarket bietet eine umfassende API, die Entwicklern und Agenten den Zugriff auf Live-Marktdaten, Ereignislisten, Preisinformationen und Orderbuch-Statistiken ermöglicht, um datengesteuerte Workflows und KI-Automatisierungen zu unterstützen.

Mit der API von Polymarket und der Sim-Integration können Sie Agenten befähigen, programmatisch Informationen zu Prognosemärkten abzurufen, offene Märkte und zugehörige Ereignisse zu erkunden, historische Preisdaten zu analysieren und auf Orderbücher und Markt-Mittelwerte zuzugreifen. Dies schafft neue Möglichkeiten für Recherchen, automatisierte Analysen und die Entwicklung intelligenter Agenten, die auf Echtzeit-Ereigniswahrscheinlichkeiten reagieren, die aus Marktpreisen abgeleitet werden.

Zu den wichtigsten Funktionen der Polymarket-Integration gehören:

- **Marktlisting & Filterung:** Auflistung aller aktuellen oder historischen Prognosemärkte, Filterung nach Tags, Sortierung und Seitenweise Durchblättern der Ergebnisse.
- **Marktdetails:** Abrufen von Details für einen einzelnen Markt anhand der Markt-ID oder des Slugs, einschließlich seiner Ergebnisse und Status.
- **Ereignislisten:** Zugriff auf Listen von Polymarket-Ereignissen und detaillierte Ereignisinformationen.
- **Orderbuch- & Preisdaten:** Analyse des Orderbuchs, Abruf der aktuellen Marktpreise, Einsicht in den Mittelwert oder Erhalt historischer Preisinformationen für jeden Markt.
- **Automatisierungsbereit:** Erstellen von Agenten oder Tools, die programmatisch auf Marktentwicklungen, sich ändernde Quoten oder bestimmte Ereignisausgänge reagieren.

Durch die Nutzung dieser dokumentierten API-Endpunkte können Sie die umfangreichen On-Chain-Prognosemarktdaten von Polymarket nahtlos in Ihre eigenen KI-Workflows, Dashboards, Recherchetools und Handelsautomatisierungen integrieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Polymarket-Prognosemärkte in den Workflow. Kann Märkte, Markt, Ereignisse, Ereignis, Tags, Serien, Orderbuch, Preis, Mittelpunkt, Preisverlauf, letzten Handelspreis, Spread, Tick-Größe, Positionen, Trades und Suche abrufen.

## Tools

### `polymarket_get_markets`

Rufen Sie eine Liste von Prognosemärkten von Polymarket mit optionaler Filterung ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `closed` | string | Nein | Nach geschlossenem Status filtern \(true/false\). Verwenden Sie false für nur aktive Märkte. |
| `order` | string | Nein | Sortierfeld \(z.B. volumeNum, liquidityNum, startDate, endDate, createdAt\) |
| `ascending` | string | Nein | Sortierrichtung \(true für aufsteigend, false für absteigend\) |
| `tagId` | string | Nein | Nach Tag-ID filtern |
| `limit` | string | Nein | Anzahl der Ergebnisse pro Seite \(max 50\) |
| `offset` | string | Nein | Paginierungsoffset \(überspringe diese Anzahl an Ergebnissen\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Marktdaten und Metadaten |

### `polymarket_get_market`

Rufen Sie Details eines bestimmten Prognosemarktes nach ID oder Slug ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `marketId` | string | Nein | Die Markt-ID. Erforderlich, wenn Slug nicht angegeben wird. |
| `slug` | string | Nein | Der Markt-Slug \(z.B. "will-trump-win"\). Erforderlich, wenn marketId nicht angegeben wird. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Marktdaten und Metadaten |

### `polymarket_get_events`

Ruft eine Liste von Events von Polymarket mit optionaler Filterung ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `closed` | string | Nein | Nach geschlossenem Status filtern \(true/false\). Verwenden Sie false für nur aktive Ereignisse. |
| `order` | string | Nein | Sortierfeld \(z.B. volume, liquidity, startDate, endDate, createdAt\) |
| `ascending` | string | Nein | Sortierrichtung \(true für aufsteigend, false für absteigend\) |
| `tagId` | string | Nein | Nach Tag-ID filtern |
| `limit` | string | Nein | Anzahl der Ergebnisse pro Seite \(max 50\) |
| `offset` | string | Nein | Paginierungsoffset \(überspringe diese Anzahl an Ergebnissen\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Event-Daten und Metadaten |

### `polymarket_get_event`

Ruft Details eines bestimmten Events nach ID oder Slug ab

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `eventId` | string | Nein | Die Event-ID. Erforderlich, wenn kein Slug angegeben wird. |
| `slug` | string | Nein | Der Event-Slug \(z.B. "2024-presidential-election"\). Erforderlich, wenn keine eventId angegeben wird. |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Event-Daten und Metadaten |

### `polymarket_get_tags`

Verfügbare Tags zum Filtern von Märkten von Polymarket abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Nein | Anzahl der Ergebnisse pro Seite \(max 50\) |
| `offset` | string | Nein | Paginierungsoffset \(überspringe diese Anzahl an Ergebnissen\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Tag-Daten und Metadaten |

### `polymarket_search`

Nach Märkten, Ereignissen und Profilen auf Polymarket suchen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchbegriff |
| `limit` | string | Nein | Anzahl der Ergebnisse pro Seite \(max 50\) |
| `offset` | string | Nein | Paginierungsoffset |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Suchergebnisse und Metadaten |

### `polymarket_get_series`

Serien (verwandte Marktgruppen) von Polymarket abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `limit` | string | Nein | Anzahl der Ergebnisse pro Seite \(max 50\) |
| `offset` | string | Nein | Paginierungsoffset \(überspringe diese Anzahl an Ergebnissen\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `series` | array | Array von Serien-Objekten |

### `polymarket_get_series_by_id`

Eine bestimmte Serie (zugehörige Marktgruppe) anhand der ID von Polymarket abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `seriesId` | string | Ja | Die Serien-ID |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `series` | object | Serien-Objekt mit Details |

### `polymarket_get_orderbook`

Die Orderbuch-Zusammenfassung für einen bestimmten Token abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID (aus den clobTokenIds des Marktes) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `orderbook` | object | Orderbuch mit Geld- und Briefkurs-Arrays |

### `polymarket_get_price`

Den Marktpreis für einen bestimmten Token und eine bestimmte Seite abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID (aus den clobTokenIds des Marktes) |
| `side` | string | Ja | Orderseite: buy oder sell |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `price` | string | Marktpreis |

### `polymarket_get_midpoint`

Abrufen des Mittelpreises für einen bestimmten Token

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID (aus market clobTokenIds) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `midpoint` | string | Mittelkurs |

### `polymarket_get_price_history`

Abrufen historischer Preisdaten für einen bestimmten Markttoken

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID (aus market clobTokenIds) |
| `interval` | string | Nein | Zeitraum, der zum aktuellen Zeitpunkt endet (1m, 1h, 6h, 1d, 1w, max). Schließt sich gegenseitig mit startTs/endTs aus. |
| `fidelity` | number | Nein | Datenauflösung in Minuten (z.B. 60 für stündlich) |
| `startTs` | number | Nein | Startzeitstempel (Unix-Sekunden UTC) |
| `endTs` | number | Nein | Endzeitstempel (Unix-Sekunden UTC) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `history` | array | Array von Preisverlaufseinträgen mit Zeitstempel \(t\) und Preis \(p\) |

### `polymarket_get_last_trade_price`

Den letzten Handelspreis für einen bestimmten Token abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID \(aus market clobTokenIds\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `price` | string | Letzter Handelspreis |

### `polymarket_get_spread`

Die Geld-Brief-Spanne für einen bestimmten Token abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID \(aus market clobTokenIds\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `spread` | object | Geld-Brief-Spanne mit Geld- und Briefkursen |

### `polymarket_get_tick_size`

Die minimale Tickgröße für einen bestimmten Token abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Ja | Die CLOB-Token-ID \(aus market clobTokenIds\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tickSize` | string | Minimale Tick-Größe |

### `polymarket_get_positions`

Benutzerpositionen von Polymarket abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `user` | string | Ja | Wallet-Adresse des Benutzers |
| `market` | string | Nein | Optionale Markt-ID zum Filtern von Positionen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `positions` | array | Array von Positions-Objekten |

### `polymarket_get_trades`

Handelshistorie von Polymarket abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `user` | string | Nein | Wallet-Adresse des Benutzers zum Filtern von Trades |
| `market` | string | Nein | Markt-ID zum Filtern von Trades |
| `limit` | string | Nein | Anzahl der Ergebnisse pro Seite \(max 50\) |
| `offset` | string | Nein | Paginierungsoffset \(überspringe diese Anzahl an Ergebnissen\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `trades` | array | Array von Handelsobjekten |

## Hinweise

- Kategorie: `tools`
- Typ: `polymarket`
```

--------------------------------------------------------------------------------

````
