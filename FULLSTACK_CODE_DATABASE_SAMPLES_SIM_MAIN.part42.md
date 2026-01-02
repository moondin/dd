---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 42
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 42 of 933)

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

---[FILE: qdrant.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/qdrant.mdx

```text
---
title: Qdrant
description: Verwenden Sie die Qdrant-Vektordatenbank
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="qdrant"
  color="#1A223F"
/>

{/* MANUAL-CONTENT-START:intro */}
[Qdrant](https://qdrant.tech) ist eine Open-Source-Vektordatenbank, die für die effiziente Speicherung, Verwaltung und Abfrage hochdimensionaler Vektoreinbettungen entwickelt wurde. Qdrant ermöglicht schnelle und skalierbare semantische Suche und ist damit ideal für KI-Anwendungen, die Ähnlichkeitssuche, Empfehlungssysteme und kontextbezogene Informationsabfrage erfordern.

Mit Qdrant können Sie:

- **Vektoreinbettungen speichern**: Effiziente Verwaltung und Persistierung hochdimensionaler Vektoren im großen Maßstab
- **Semantische Ähnlichkeitssuche durchführen**: Finden Sie in Echtzeit die ähnlichsten Vektoren zu einem Abfragevektor
- **Daten filtern und organisieren**: Verwenden Sie fortschrittliche Filterung, um Suchergebnisse basierend auf Metadaten oder Payload einzugrenzen
- **Bestimmte Punkte abrufen**: Rufen Sie Vektoren und ihre zugehörigen Payloads per ID ab
- **Nahtlos skalieren**: Bewältigen Sie große Sammlungen und Workloads mit hohem Durchsatz

In Sim ermöglicht die Qdrant-Integration Ihren Agenten, programmatisch mit Qdrant als Teil ihrer Workflows zu interagieren. Unterstützte Operationen umfassen:

- **Upsert**: Einfügen oder Aktualisieren von Punkten (Vektoren und Payloads) in einer Qdrant-Sammlung
- **Search**: Durchführung einer Ähnlichkeitssuche, um Vektoren zu finden, die einem gegebenen Abfragevektor am ähnlichsten sind, mit optionaler Filterung und Anpassung der Ergebnisse
- **Fetch**: Abrufen bestimmter Punkte aus einer Sammlung anhand ihrer IDs, mit Optionen zum Einbeziehen von Payloads und Vektoren

Diese Integration ermöglicht es Ihren Agenten, leistungsstarke Vektorsuch- und Verwaltungsfunktionen zu nutzen und fortschrittliche Automatisierungsszenarien wie semantische Suche, Empfehlungen und kontextbezogenen Abruf zu ermöglichen. Durch die Verbindung von Sim mit Qdrant können Sie Agenten erstellen, die Kontext verstehen, relevante Informationen aus großen Datensätzen abrufen und intelligentere und personalisierte Antworten liefern – alles ohne komplexe Infrastruktur verwalten zu müssen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Qdrant in den Workflow. Kann Punkte einfügen, suchen und abrufen. Benötigt API-Schlüssel.

## Tools

### `qdrant_upsert_points`

Punkte in einer Qdrant-Sammlung einfügen oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Qdrant-Basis-URL |
| `apiKey` | string | Nein | Qdrant-API-Schlüssel \(optional\) |
| `collection` | string | Ja | Sammlungsname |
| `points` | array | Ja | Array von Punkten zum Einfügen/Aktualisieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `status` | string | Status der Upsert-Operation |
| `data` | object | Ergebnisdaten der Upsert-Operation |

### `qdrant_search_vector`

Suche nach ähnlichen Vektoren in einer Qdrant-Sammlung

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Qdrant-Basis-URL |
| `apiKey` | string | Nein | Qdrant-API-Schlüssel \(optional\) |
| `collection` | string | Ja | Sammlungsname |
| `vector` | array | Ja | Zu suchender Vektor |
| `limit` | number | Nein | Anzahl der zurückzugebenden Ergebnisse |
| `filter` | object | Nein | Auf die Suche anzuwendender Filter |
| `search_return_data` | string | Nein | Aus der Suche zurückzugebende Daten |
| `with_payload` | boolean | Nein | Payload in Antwort einschließen |
| `with_vector` | boolean | Nein | Vektor in Antwort einschließen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | array | Vektorsuchergebnisse mit ID, Bewertung, Payload und optionalen Vektordaten |
| `status` | string | Status des Suchvorgangs |

### `qdrant_fetch_points`

Punkte anhand der ID aus einer Qdrant-Sammlung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Qdrant-Basis-URL |
| `apiKey` | string | Nein | Qdrant-API-Schlüssel \(optional\) |
| `collection` | string | Ja | Sammlungsname |
| `ids` | array | Ja | Array von Punkt-IDs zum Abrufen |
| `fetch_return_data` | string | Nein | Aus dem Abruf zurückzugebende Daten |
| `with_payload` | boolean | Nein | Payload in Antwort einschließen |
| `with_vector` | boolean | Nein | Vektor in Antwort einschließen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | array | Abgerufene Punkte mit ID, Payload und optionalen Vektordaten |
| `status` | string | Status des Abrufvorgangs |

## Hinweise

- Kategorie: `tools`
- Typ: `qdrant`
```

--------------------------------------------------------------------------------

---[FILE: rds.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/rds.mdx

```text
---
title: Amazon RDS
description: Verbindung zu Amazon RDS über Data API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="rds"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon RDS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) ist eine vollständig verwaltete relationale Datenbank, die automatisch startet, herunterfährt und ihre Kapazität basierend auf den Anforderungen Ihrer Anwendung skaliert. Sie ermöglicht es Ihnen, SQL-Datenbanken in der Cloud zu betreiben, ohne Datenbankserver verwalten zu müssen.

Mit RDS Aurora Serverless können Sie:

- **Daten abfragen**: Flexible SQL-Abfragen über Ihre Tabellen ausführen
- **Neue Datensätze einfügen**: Automatisch Daten zu Ihrer Datenbank hinzufügen
- **Bestehende Datensätze aktualisieren**: Daten in Ihren Tabellen mit benutzerdefinierten Filtern ändern
- **Datensätze löschen**: Unerwünschte Daten mit präzisen Kriterien entfernen
- **Raw-SQL ausführen**: Jeden gültigen SQL-Befehl ausführen, der von Aurora unterstützt wird

In Sim ermöglicht die RDS-Integration Ihren Agenten, sicher und programmatisch mit Amazon Aurora Serverless-Datenbanken zu arbeiten. Zu den unterstützten Operationen gehören:

- **Abfrage**: SELECT und andere SQL-Abfragen ausführen, um Zeilen aus Ihrer Datenbank abzurufen
- **Einfügen**: Neue Datensätze mit strukturierten Daten in Tabellen einfügen
- **Aktualisieren**: Daten in Zeilen ändern, die Ihren angegebenen Bedingungen entsprechen
- **Löschen**: Datensätze aus einer Tabelle nach benutzerdefinierten Filtern oder Kriterien entfernen
- **Ausführen**: Raw-SQL für fortgeschrittene Szenarien ausführen

Diese Integration ermöglicht es Ihren Agenten, eine breite Palette von Datenbankoperationen ohne manuelle Eingriffe zu automatisieren. Durch die Verbindung von Sim mit Amazon RDS können Sie Agenten erstellen, die relationale Daten innerhalb Ihrer Workflows verwalten, aktualisieren und abrufen – alles ohne Datenbankinfrastruktur oder -verbindungen zu verwalten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Amazon RDS Aurora Serverless in den Workflow mit der Data API. Kann Daten abfragen, einfügen, aktualisieren, löschen und Raw-SQL ausführen, ohne Datenbankverbindungen verwalten zu müssen.

## Tools

### `rds_query`

Führen Sie eine SELECT-Abfrage auf Amazon RDS mit der Data API aus

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `resourceArn` | string | Ja | ARN des Aurora-DB-Clusters |
| `secretArn` | string | Ja | ARN des Secrets Manager-Geheimnisses mit DB-Anmeldedaten |
| `database` | string | Nein | Datenbankname (optional) |
| `query` | string | Ja | SQL-SELECT-Abfrage zur Ausführung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der zurückgegebenen Zeilen aus der Abfrage |
| `rowCount` | number | Anzahl der zurückgegebenen Zeilen |

### `rds_insert`

Daten in eine Amazon RDS-Tabelle mit der Data API einfügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `resourceArn` | string | Ja | ARN des Aurora-DB-Clusters |
| `secretArn` | string | Ja | ARN des Secrets Manager-Geheimnisses mit DB-Anmeldedaten |
| `database` | string | Nein | Datenbankname (optional) |
| `table` | string | Ja | Tabellenname zum Einfügen |
| `data` | object | Ja | Einzufügende Daten als Schlüssel-Wert-Paare |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der eingefügten Zeilen |
| `rowCount` | number | Anzahl der eingefügten Zeilen |

### `rds_update`

Daten in einer Amazon RDS-Tabelle über die Data API aktualisieren

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `resourceArn` | string | Ja | ARN des Aurora-DB-Clusters |
| `secretArn` | string | Ja | ARN des Secrets Manager-Geheimnisses mit DB-Anmeldedaten |
| `database` | string | Nein | Datenbankname (optional) |
| `table` | string | Ja | Name der zu aktualisierenden Tabelle |
| `data` | object | Ja | Zu aktualisierende Daten als Schlüssel-Wert-Paare |
| `conditions` | object | Ja | Bedingungen für die Aktualisierung (z.B. `{"id": 1}`) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der aktualisierten Zeilen |
| `rowCount` | number | Anzahl der aktualisierten Zeilen |

### `rds_delete`

Daten aus einer Amazon RDS-Tabelle über die Data API löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS geheimer Zugriffsschlüssel |
| `resourceArn` | string | Ja | ARN des Aurora-DB-Clusters |
| `secretArn` | string | Ja | ARN des Secrets Manager-Geheimnisses mit DB-Anmeldedaten |
| `database` | string | Nein | Datenbankname (optional) |
| `table` | string | Ja | Tabellenname, aus dem gelöscht werden soll |
| `conditions` | object | Ja | Bedingungen für das Löschen (z.B. `{"id": 1}`) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der gelöschten Zeilen |
| `rowCount` | number | Anzahl der gelöschten Zeilen |

### `rds_execute`

Rohes SQL auf Amazon RDS über die Data API ausführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS geheimer Zugriffsschlüssel |
| `resourceArn` | string | Ja | ARN des Aurora-DB-Clusters |
| `secretArn` | string | Ja | ARN des Secrets Manager-Geheimnisses mit DB-Anmeldedaten |
| `database` | string | Nein | Datenbankname (optional) |
| `query` | string | Ja | Rohe SQL-Abfrage zur Ausführung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `rows` | array | Array der zurückgegebenen oder betroffenen Zeilen |
| `rowCount` | number | Anzahl der betroffenen Zeilen |

## Hinweise

- Kategorie: `tools`
- Typ: `rds`
```

--------------------------------------------------------------------------------

---[FILE: reddit.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/reddit.mdx

```text
---
title: Reddit
description: Zugriff auf Reddit-Daten und -Inhalte
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="reddit"
  color="#FF5700"
/>

{/* MANUAL-CONTENT-START:intro */}
[Reddit](https://www.reddit.com/) ist eine soziale Plattform, auf der Nutzer Inhalte in themenbasierten Communities, sogenannten Subreddits, teilen und diskutieren.

In Sim können Sie die Reddit-Integration für folgende Zwecke nutzen:

- **Beiträge abrufen**: Rufen Sie Beiträge aus beliebigen Subreddits ab, mit Optionen zum Sortieren (Hot, New, Top, Rising) und Filtern von Top-Beiträgen nach Zeit (Tag, Woche, Monat, Jahr, Gesamte Zeit).
- **Kommentare abrufen**: Holen Sie Kommentare zu einem bestimmten Beitrag, mit Optionen zum Sortieren und Festlegen der Anzahl der Kommentare.

Diese Operationen ermöglichen es Ihren Agenten, auf Reddit-Inhalte zuzugreifen und diese als Teil Ihrer automatisierten Workflows zu analysieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriere Reddit in Workflows. Lese Beiträge, Kommentare und durchsuche Inhalte. Veröffentliche Beiträge, stimme ab, antworte, bearbeite und verwalte dein Reddit-Konto.

## Tools

### `reddit_get_posts`

Beiträge aus einem Subreddit mit verschiedenen Sortieroptionen abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Ja | Der Name des Subreddits, aus dem Beiträge abgerufen werden sollen \(ohne das r/ Präfix\) |
| `sort` | string | Nein | Sortiermethode für Beiträge: "hot", "new", "top" oder "rising" \(Standard: "hot"\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Beiträge \(Standard: 10, max: 100\) |
| `time` | string | Nein | Zeitfilter für nach "top" sortierte Beiträge: "day", "week", "month", "year" oder "all" \(Standard: "day"\) |
| `after` | string | Nein | Vollständiger Name eines Elements, nach dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `before` | string | Nein | Vollständiger Name eines Elements, vor dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `count` | number | Nein | Anzahl der bereits gesehenen Elemente in der Liste \(für Nummerierung verwendet\) |
| `show` | string | Nein | Zeige Elemente an, die normalerweise gefiltert würden \(z.B. "all"\) |
| `sr_detail` | boolean | Nein | Erweitere Subreddit-Details in der Antwort |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `subreddit` | string | Name des Subreddits, aus dem Beiträge abgerufen wurden |
| `posts` | array | Array von Beiträgen mit Titel, Autor, URL, Punktzahl, Kommentaranzahl und Metadaten |

### `reddit_get_comments`

Kommentare von einem bestimmten Reddit-Beitrag abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `postId` | string | Ja | Die ID des Reddit-Beitrags, aus dem Kommentare abgerufen werden sollen |
| `subreddit` | string | Ja | Das Subreddit, in dem sich der Beitrag befindet \(ohne das r/ Präfix\) |
| `sort` | string | Nein | Sortiermethode für Kommentare: "confidence", "top", "new", "controversial", "old", "random", "qa" \(Standard: "confidence"\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Kommentare \(Standard: 50, max: 100\) |
| `depth` | number | Nein | Maximale Tiefe von Unterbäumen im Thread \(steuert verschachtelte Kommentarebenen\) |
| `context` | number | Nein | Anzahl der einzubeziehenden übergeordneten Kommentare |
| `showedits` | boolean | Nein | Bearbeitungsinformationen für Kommentare anzeigen |
| `showmore` | boolean | Nein | "Mehr Kommentare laden"-Elemente in die Antwort einbeziehen |
| `showtitle` | boolean | Nein | Beitragstitel in die Antwort einbeziehen |
| `threaded` | boolean | Nein | Kommentare im verschachtelten Format zurückgeben |
| `truncate` | number | Nein | Ganzzahl zur Kürzung der Kommentartiefe |
| `after` | string | Nein | Vollständiger Name eines Elements, nach dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `before` | string | Nein | Vollständiger Name eines Elements, vor dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `count` | number | Nein | Anzahl der bereits gesehenen Elemente in der Liste \(für Nummerierung verwendet\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `post` | object | Beitragsinformationen einschließlich ID, Titel, Autor, Inhalt und Metadaten |

### `reddit_get_controversial`

Kontroverse Beiträge aus einem Subreddit abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Ja | Der Name des Subreddits, aus dem Beiträge abgerufen werden sollen \(ohne das r/ Präfix\) |
| `time` | string | Nein | Zeitfilter für kontroverse Beiträge: "hour", "day", "week", "month", "year" oder "all" \(Standard: "all"\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Beiträge \(Standard: 10, max: 100\) |
| `after` | string | Nein | Vollständiger Name eines Elements, nach dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `before` | string | Nein | Vollständiger Name eines Elements, vor dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `count` | number | Nein | Anzahl der bereits gesehenen Elemente in der Liste \(für Nummerierung verwendet\) |
| `show` | string | Nein | Zeigt Elemente an, die normalerweise gefiltert würden \(z.B. "all"\) |
| `sr_detail` | boolean | Nein | Erweitert Subreddit-Details in der Antwort |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `subreddit` | string | Name des Subreddits, aus dem Beiträge abgerufen wurden |
| `posts` | array | Array von kontroversen Beiträgen mit Titel, Autor, URL, Punktzahl, Kommentaranzahl und Metadaten |

### `reddit_search`

Nach Beiträgen innerhalb eines Subreddits suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Ja | Der Name des Subreddits, in dem gesucht werden soll \(ohne das r/ Präfix\) |
| `query` | string | Ja | Suchanfragentext |
| `sort` | string | Nein | Sortiermethode für Suchergebnisse: "relevance", "hot", "top", "new" oder "comments" \(Standard: "relevance"\) |
| `time` | string | Nein | Zeitfilter für Suchergebnisse: "hour", "day", "week", "month", "year" oder "all" \(Standard: "all"\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Beiträge \(Standard: 10, max: 100\) |
| `restrict_sr` | boolean | Nein | Suche nur auf das angegebene Subreddit beschränken \(Standard: true\) |
| `after` | string | Nein | Vollständiger Name eines Elements, nach dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `before` | string | Nein | Vollständiger Name eines Elements, vor dem Elemente abgerufen werden sollen \(für Paginierung\) |
| `count` | number | Nein | Anzahl der bereits gesehenen Elemente in der Liste \(für Nummerierung verwendet\) |
| `show` | string | Nein | Zeigt Elemente an, die normalerweise gefiltert würden \(z.B. "all"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `subreddit` | string | Name des Subreddits, in dem die Suche durchgeführt wurde |
| `posts` | array | Array von Suchergebnisbeiträgen mit Titel, Autor, URL, Punktzahl, Kommentaranzahl und Metadaten |

### `reddit_submit_post`

Einen neuen Beitrag in einem Subreddit einreichen (Text oder Link)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Ja | Der Name des Subreddits, in dem gepostet werden soll \(ohne das r/ Präfix\) |
| `title` | string | Ja | Titel der Einreichung \(maximal 300 Zeichen\) |
| `text` | string | Nein | Textinhalt für einen Selbstbeitrag \(Markdown wird unterstützt\) |
| `url` | string | Nein | URL für einen Link-Beitrag \(kann nicht zusammen mit Text verwendet werden\) |
| `nsfw` | boolean | Nein | Beitrag als NSFW markieren |
| `spoiler` | boolean | Nein | Beitrag als Spoiler markieren |
| `send_replies` | boolean | Nein | Antwortbenachrichtigungen an den Posteingang senden \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Beitrag erfolgreich eingereicht wurde |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Beitragsdaten einschließlich ID, Name, URL und Permalink |

### `reddit_vote`

Upvote, Downvote oder Zurücknahme einer Stimme für einen Reddit-Beitrag oder -Kommentar

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `id` | string | Ja | Vollständiger Name des Elements, für das abgestimmt werden soll \(z.B. t3_xxxxx für Beitrag, t1_xxxxx für Kommentar\) |
| `dir` | number | Ja | Abstimmungsrichtung: 1 \(Upvote\), 0 \(Zurücknahme\), oder -1 \(Downvote\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Abstimmung erfolgreich war |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `reddit_save`

Einen Reddit-Beitrag oder Kommentar in deinen gespeicherten Elementen speichern

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `id` | string | Ja | Vollständiger Name des zu speichernden Elements \(z.B. t3_xxxxx für Beitrag, t1_xxxxx für Kommentar\) |
| `category` | string | Nein | Kategorie, unter der gespeichert werden soll \(Reddit Gold-Funktion\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Speichern erfolgreich war |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `reddit_unsave`

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `subreddit` | string | Subreddit-Name |
| `posts` | json | Beitragsdaten |
| `post` | json | Daten eines einzelnen Beitrags |
| `comments` | json | Kommentardaten |

### `reddit_reply`

Einen Kommentar zu einem Reddit-Beitrag oder Kommentar hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `parent_id` | string | Ja | Vollständiger Name des Elements, auf das geantwortet werden soll \(z.B. t3_xxxxx für Beitrag, t1_xxxxx für Kommentar\) |
| `text` | string | Ja | Kommentartext im Markdown-Format |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Antwort erfolgreich gepostet wurde |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Kommentardaten einschließlich ID, Name, Permalink und Inhalt |

### `reddit_edit`

Bearbeite den Text deines eigenen Reddit-Beitrags oder -Kommentars

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `thing_id` | string | Ja | Vollständiger Name des zu bearbeitenden Elements \(z.B. t3_xxxxx für Beiträge, t1_xxxxx für Kommentare\) |
| `text` | string | Ja | Neuer Textinhalt im Markdown-Format |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Bearbeitung erfolgreich war |
| `message` | string | Erfolgs- oder Fehlermeldung |
| `data` | object | Aktualisierte Inhaltsdaten |

### `reddit_delete`

Lösche deinen eigenen Reddit-Beitrag oder -Kommentar

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `id` | string | Ja | Vollständiger Name des zu löschenden Elements \(z.B. t3_xxxxx für Beiträge, t1_xxxxx für Kommentare\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Löschung erfolgreich war |
| `message` | string | Erfolgs- oder Fehlermeldung |

### `reddit_subscribe`

Subreddit abonnieren oder Abonnement kündigen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Ja | Der Name des Subreddits \(ohne das r/ Präfix\) |
| `action` | string | Ja | Auszuführende Aktion: "sub" zum Abonnieren oder "unsub" zum Kündigen des Abonnements |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Abonnementaktion erfolgreich war |
| `message` | string | Erfolgs- oder Fehlermeldung |

## Hinweise

- Kategorie: `tools`
- Typ: `reddit`
```

--------------------------------------------------------------------------------

---[FILE: resend.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/resend.mdx

```text
---
title: Resend
description: E-Mails mit Resend versenden.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="resend"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Resend](https://resend.com/) ist ein moderner E-Mail-Service, der für Entwickler konzipiert wurde, um Transaktions- und Marketing-E-Mails einfach zu versenden. Er bietet eine einfache, zuverlässige API und ein Dashboard zur Verwaltung von E-Mail-Zustellung, Vorlagen und Analysen, was ihn zu einer beliebten Wahl für die Integration von E-Mail-Funktionalität in Anwendungen und Workflows macht.

Mit Resend können Sie:

- **Transaktions-E-Mails versenden**: Liefern Sie Passwort-Zurücksetzungen, Benachrichtigungen, Bestätigungen und mehr mit hoher Zustellbarkeit
- **Vorlagen verwalten**: Erstellen und aktualisieren Sie E-Mail-Vorlagen für konsistentes Branding und Messaging
- **Analysen verfolgen**: Überwachen Sie Zustell-, Öffnungs- und Klickraten, um Ihre E-Mail-Performance zu optimieren
- **Einfach integrieren**: Nutzen Sie eine unkomplizierte API und SDKs für eine nahtlose Integration in Ihre Anwendungen
- **Sicherheit gewährleisten**: Profitieren Sie von robuster Authentifizierung und Domain-Verifizierung zum Schutz Ihrer E-Mail-Reputation

In Sim ermöglicht die Resend-Integration Ihren Agenten, E-Mails programmatisch als Teil Ihrer automatisierten Workflows zu versenden. Dies ermöglicht Anwendungsfälle wie das Senden von Benachrichtigungen, Warnungen oder benutzerdefinierten Nachrichten direkt von Ihren Sim-gestützten Agenten. Durch die Verbindung von Sim mit Resend können Sie Kommunikationsaufgaben automatisieren und eine zeitnahe und zuverlässige E-Mail-Zustellung ohne manuelle Eingriffe sicherstellen. Die Integration nutzt Ihren Resend-API-Schlüssel und hält Ihre Anmeldedaten sicher, während sie leistungsstarke E-Mail-Automatisierungsszenarien ermöglicht.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Resend in den Workflow. Kann E-Mails versenden. Benötigt API-Schlüssel.

## Tools

### `resend_send`

Senden Sie eine E-Mail mit Ihrem eigenen Resend API-Schlüssel und Absenderadresse

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fromAddress` | string | Ja | E-Mail-Adresse, von der gesendet wird |
| `to` | string | Ja | E-Mail-Adresse des Empfängers |
| `subject` | string | Ja | Betreff der E-Mail |
| `body` | string | Ja | Inhalt der E-Mail |
| `contentType` | string | Nein | Inhaltstyp für den E-Mail-Text (text oder html) |
| `resendApiKey` | string | Ja | Resend API-Schlüssel zum Senden von E-Mails |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die E-Mail erfolgreich gesendet wurde |
| `to` | string | E-Mail-Adresse des Empfängers |
| `subject` | string | Betreff der E-Mail |
| `body` | string | Inhalt der E-Mail |

## Hinweise

- Kategorie: `tools`
- Typ: `resend`
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/s3.mdx

```text
---
title: S3
description: S3-Dateien hochladen, herunterladen, auflisten und verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="s3"
  color="linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon S3](https://aws.amazon.com/s3/) ist ein hochskalierbarer, sicherer und langlebiger Cloud-Speicherdienst von Amazon Web Services. Er wurde entwickelt, um beliebige Datenmengen von überall im Web zu speichern und abzurufen, was ihn zu einer der am häufigsten genutzten Cloud-Speicherlösungen für Unternehmen aller Größen macht.

Mit Amazon S3 können Sie:

- **Unbegrenzt Daten speichern**: Laden Sie Dateien jeder Größe und jeden Typs mit praktisch unbegrenzter Speicherkapazität hoch
- **Von überall zugreifen**: Rufen Sie Ihre Dateien von überall auf der Welt mit geringer Latenz ab
- **Datenhaltbarkeit sicherstellen**: Profitieren Sie von 99,999999999% (11 Neunen) Haltbarkeit durch automatische Datenreplikation
- **Zugriff kontrollieren**: Verwalten Sie Berechtigungen und Zugriffskontrollen mit detaillierten Sicherheitsrichtlinien
- **Automatisch skalieren**: Bewältigen Sie unterschiedliche Arbeitslasten ohne manuelle Eingriffe oder Kapazitätsplanung
- **Nahtlos integrieren**: Verbinden Sie sich einfach mit anderen AWS-Diensten und Anwendungen von Drittanbietern
- **Kosten optimieren**: Wählen Sie aus mehreren Speicherklassen, um Kosten basierend auf Zugriffsmustern zu optimieren

In Sim ermöglicht die S3-Integration Ihren Agenten das Abrufen und Zugreifen auf Dateien, die in Ihren Amazon S3-Buckets gespeichert sind, mithilfe sicherer vorsignierter URLs. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie die Verarbeitung von Dokumenten, die Analyse gespeicherter Daten, das Abrufen von Konfigurationsdateien und den Zugriff auf Medieninhalte als Teil Ihrer Workflows. Ihre Agenten können Dateien sicher von S3 abrufen, ohne Ihre AWS-Anmeldeinformationen preiszugeben, wodurch es einfach wird, in der Cloud gespeicherte Assets in Ihre Automatisierungsprozesse einzubinden. Diese Integration überbrückt die Lücke zwischen Ihrer Cloud-Speicherung und KI-Workflows und ermöglicht einen nahtlosen Zugriff auf Ihre gespeicherten Daten unter Beibehaltung der Sicherheitsstandards durch die robusten Authentifizierungsmechanismen von AWS.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

S3 in den Workflow integrieren. Dateien hochladen, Objekte herunterladen, Bucket-Inhalte auflisten, Objekte löschen und Objekte zwischen Buckets kopieren. Erfordert AWS-Zugriffsschlüssel und geheimen Zugriffsschlüssel.

## Tools

### `s3_put_object`

Eine Datei in einen AWS S3-Bucket hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Ja | Ihre AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | Ihr AWS-geheimer Zugriffsschlüssel |
| `region` | string | Ja | AWS-Region (z. B. us-east-1) |
| `bucketName` | string | Ja | S3-Bucket-Name |
| `objectKey` | string | Ja | Objektschlüssel/Pfad in S3 (z. B. ordner/dateiname.ext) |
| `file` | file | Nein | Hochzuladende Datei |
| `content` | string | Nein | Hochzuladender Textinhalt (Alternative zur Datei) |
| `contentType` | string | Nein | Content-Type-Header (wird automatisch aus der Datei erkannt, wenn nicht angegeben) |
| `acl` | string | Nein | Zugriffskontrollliste (z. B. private, public-read) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `url` | string | URL des hochgeladenen S3-Objekts |
| `metadata` | object | Upload-Metadaten einschließlich ETag und Speicherort |

### `s3_get_object`

Ein Objekt aus einem AWS S3-Bucket abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Ja | Ihre AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | Ihr AWS-geheimer Zugriffsschlüssel |
| `s3Uri` | string | Ja | S3-Objekt-URL |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `url` | string | Vorsignierte URL zum Herunterladen des S3-Objekts |
| `metadata` | object | Dateimetadaten einschließlich Typ, Größe, Name und Datum der letzten Änderung |

### `s3_list_objects`

Objekte in einem AWS S3-Bucket auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Ja | Ihre AWS Access Key ID |
| `secretAccessKey` | string | Ja | Ihr AWS Secret Access Key |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `bucketName` | string | Ja | S3-Bucket-Name |
| `prefix` | string | Nein | Präfix zum Filtern von Objekten (z.B. ordner/) |
| `maxKeys` | number | Nein | Maximale Anzahl zurückzugebender Objekte (Standard: 1000) |
| `continuationToken` | string | Nein | Token für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `objects` | array | Liste der S3-Objekte |

### `s3_delete_object`

Ein Objekt aus einem AWS S3-Bucket löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Ja | Ihre AWS Access Key ID |
| `secretAccessKey` | string | Ja | Ihr AWS Secret Access Key |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `bucketName` | string | Ja | S3-Bucket-Name |
| `objectKey` | string | Ja | Objekt-Schlüssel/Pfad zum Löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob das Objekt erfolgreich gelöscht wurde |
| `metadata` | object | Löschmetadaten |

### `s3_copy_object`

Ein Objekt innerhalb von oder zwischen AWS S3-Buckets kopieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Ja | Ihre AWS Access Key ID |
| `secretAccessKey` | string | Ja | Ihr AWS Secret Access Key |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `sourceBucket` | string | Ja | Name des Quell-Buckets |
| `sourceKey` | string | Ja | Quell-Objektschlüssel/-pfad |
| `destinationBucket` | string | Ja | Name des Ziel-Buckets |
| `destinationKey` | string | Ja | Ziel-Objektschlüssel/-pfad |
| `acl` | string | Nein | Zugriffskontrollliste für das kopierte Objekt (z.B. private, public-read) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `url` | string | URL des kopierten S3-Objekts |
| `metadata` | object | Metadaten des Kopiervorgangs |

## Hinweise

- Kategorie: `tools`
- Typ: `s3`
```

--------------------------------------------------------------------------------

````
