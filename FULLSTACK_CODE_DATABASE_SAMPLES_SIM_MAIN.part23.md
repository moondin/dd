---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 23
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 23 of 933)

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

---[FILE: exa.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/exa.mdx

```text
---
title: Exa
description: Suche mit Exa AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="exa"
  color="#1F40ED"
/>

{/* MANUAL-CONTENT-START:intro */}
[Exa](https://exa.ai/) ist eine KI-gestützte Suchmaschine, die speziell für Entwickler und Forscher konzipiert wurde und hochrelevante und aktuelle Informationen aus dem gesamten Web liefert. Sie kombiniert fortschrittliche semantische Suchfunktionen mit KI-Verständnis, um genauere und kontextuell relevantere Ergebnisse als herkömmliche Suchmaschinen zu liefern.

Mit Exa können Sie:

- **Mit natürlicher Sprache suchen**: Informationen mit konversationellen Anfragen und Fragen finden
- **Präzise Ergebnisse erhalten**: Hochrelevante Suchergebnisse mit semantischem Verständnis erhalten
- **Auf aktuelle Informationen zugreifen**: Aktuelle Informationen aus dem gesamten Web abrufen
- **Ähnliche Inhalte finden**: Verwandte Ressourcen basierend auf Inhaltsähnlichkeit entdecken
- **Webseiteninhalte extrahieren**: Den vollständigen Text von Webseiten abrufen und verarbeiten
- **Fragen mit Quellenangaben beantworten**: Fragen stellen und direkte Antworten mit unterstützenden Quellen erhalten
- **Rechercheaufgaben durchführen**: Mehrstufige Recherche-Workflows automatisieren, um Informationen zu sammeln, zu synthetisieren und zusammenzufassen

In Sim ermöglicht die Exa-Integration Ihren Agenten, im Web nach Informationen zu suchen, Inhalte von bestimmten URLs abzurufen, ähnliche Ressourcen zu finden, Fragen mit Quellenangaben zu beantworten und Rechercheaufgaben durchzuführen – alles programmatisch über API-Aufrufe. Dies ermöglicht Ihren Agenten den Zugriff auf Echtzeit-Informationen aus dem Internet und verbessert ihre Fähigkeit, genaue, aktuelle und relevante Antworten zu liefern. Die Integration ist besonders wertvoll für Rechercheaufgaben, Informationssammlung, Content-Discovery und die Beantwortung von Fragen, die aktuelle Informationen aus dem gesamten Web erfordern.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Exa in den Workflow. Kann suchen, Inhalte abrufen, ähnliche Links finden, Fragen beantworten und Recherchen durchführen. Erfordert API-Schlüssel.

## Tools

### `exa_search`

Durchsuchen Sie das Web mit Exa AI. Liefert relevante Suchergebnisse mit Titeln, URLs und Textausschnitten.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die auszuführende Suchanfrage |
| `numResults` | number | Nein | Anzahl der zurückzugebenden Ergebnisse \(Standard: 10, max: 25\) |
| `useAutoprompt` | boolean | Nein | Ob Autoprompt zur Verbesserung der Anfrage verwendet werden soll \(Standard: false\) |
| `type` | string | Nein | Suchtyp: neural, keyword, auto oder fast \(Standard: auto\) |
| `includeDomains` | string | Nein | Kommagetrennte Liste von Domains, die in den Ergebnissen enthalten sein sollen |
| `excludeDomains` | string | Nein | Kommagetrennte Liste von Domains, die aus den Ergebnissen ausgeschlossen werden sollen |
| `category` | string | Nein | Nach Kategorie filtern: company, research paper, news, pdf, github, tweet, personal site, linkedin profile, financial report |
| `text` | boolean | Nein | Vollständigen Textinhalt in Ergebnissen einschließen \(Standard: false\) |
| `highlights` | boolean | Nein | Hervorgehobene Ausschnitte in Ergebnissen einschließen \(Standard: false\) |
| `summary` | boolean | Nein | KI-generierte Zusammenfassungen in Ergebnissen einschließen \(Standard: false\) |
| `livecrawl` | string | Nein | Live-Crawling-Modus: never \(Standard\), fallback, always oder preferred \(immer livecrawl versuchen, bei Fehlschlag auf Cache zurückgreifen\) |
| `apiKey` | string | Ja | Exa AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Suchergebnisse mit Titeln, URLs und Textausschnitten |

### `exa_get_contents`

Ruft den Inhalt von Webseiten mit Exa AI ab. Gibt den Titel, Textinhalt und optionale Zusammenfassungen für jede URL zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Ja | Kommagetrennte Liste von URLs, von denen Inhalte abgerufen werden sollen |
| `text` | boolean | Nein | Wenn true, gibt den vollständigen Seitentext mit Standardeinstellungen zurück. Wenn false, deaktiviert die Textrückgabe. |
| `summaryQuery` | string | Nein | Anfrage zur Steuerung der Zusammenfassungserstellung |
| `subpages` | number | Nein | Anzahl der Unterseiten, die von den bereitgestellten URLs gecrawlt werden sollen |
| `subpageTarget` | string | Nein | Kommagetrennte Schlüsselwörter zur Zielausrichtung auf bestimmte Unterseiten \(z.B. "docs,tutorial,about"\) |
| `highlights` | boolean | Nein | Hervorgehobene Ausschnitte in Ergebnissen einschließen \(Standard: false\) |
| `livecrawl` | string | Nein | Live-Crawling-Modus: never \(Standard\), fallback, always oder preferred \(immer livecrawl versuchen, bei Fehlschlag auf Cache zurückgreifen\) |
| `apiKey` | string | Ja | Exa AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Abgerufene Inhalte von URLs mit Titel, Text und Zusammenfassungen |

### `exa_find_similar_links`

Finde Webseiten, die einer bestimmten URL ähnlich sind, mit Exa AI. Gibt eine Liste ähnlicher Links mit Titeln und Textausschnitten zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Die URL, für die ähnliche Links gefunden werden sollen |
| `numResults` | number | Nein | Anzahl der zurückzugebenden ähnlichen Links \(Standard: 10, max: 25\) |
| `text` | boolean | Nein | Ob der vollständige Text der ähnlichen Seiten eingeschlossen werden soll |
| `includeDomains` | string | Nein | Kommagetrennte Liste von Domains, die in den Ergebnissen enthalten sein sollen |
| `excludeDomains` | string | Nein | Kommagetrennte Liste von Domains, die aus den Ergebnissen ausgeschlossen werden sollen |
| `excludeSourceDomain` | boolean | Nein | Die Quell-Domain aus den Ergebnissen ausschließen \(Standard: false\) |
| `highlights` | boolean | Nein | Hervorgehobene Ausschnitte in Ergebnissen einschließen \(Standard: false\) |
| `summary` | boolean | Nein | KI-generierte Zusammenfassungen in Ergebnissen einschließen \(Standard: false\) |
| `livecrawl` | string | Nein | Live-Crawling-Modus: never \(Standard\), fallback, always oder preferred \(versucht immer livecrawl, fällt auf Cache zurück, wenn es fehlschlägt\) |
| `apiKey` | string | Ja | Exa AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `similarLinks` | array | Gefundene ähnliche Links mit Titeln, URLs und Textausschnitten |

### `exa_answer`

Erhalte eine KI-generierte Antwort auf eine Frage mit Quellenangaben aus dem Web mit Exa AI.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die zu beantwortende Frage |
| `text` | boolean | Nein | Ob der vollständige Text der Antwort einbezogen werden soll |
| `apiKey` | string | Ja | Exa AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `answer` | string | KI-generierte Antwort auf die Frage |
| `citations` | array | Quellen und Zitierungen für die Antwort |

### `exa_research`

Führe umfassende Recherchen mit KI durch, um detaillierte Berichte mit Quellenangaben zu erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Rechercheabfrage oder Thema |
| `model` | string | Nein | Recherchemodell: exa-research-fast, exa-research (Standard) oder exa-research-pro |
| `apiKey` | string | Ja | Exa AI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `research` | array | Umfassende Forschungsergebnisse mit Quellenangaben und Zusammenfassungen |

## Hinweise

- Kategorie: `tools`
- Typ: `exa`
```

--------------------------------------------------------------------------------

---[FILE: file.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/file.mdx

```text
---
title: Datei
description: Mehrere Dateien lesen und parsen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="file"
  color="#40916C"
/>

{/* MANUAL-CONTENT-START:intro */}
Das Datei-Parser-Tool bietet eine leistungsstarke Möglichkeit, Inhalte aus verschiedenen Dateiformaten zu extrahieren und zu verarbeiten, wodurch Dokumentendaten einfach in Ihre Agent-Workflows integriert werden können. Dieses Tool unterstützt mehrere Dateiformate und kann Dateien mit einer Größe von bis zu 200 MB verarbeiten.

Mit dem Datei-Parser können Sie:

- **Mehrere Dateiformate verarbeiten**: Text aus PDFs, CSVs, Word-Dokumenten (DOCX), Textdateien und mehr extrahieren
- **Große Dateien verarbeiten**: Dokumente mit einer Größe von bis zu 200 MB verarbeiten
- **Dateien von URLs parsen**: Inhalte direkt aus online gehosteten Dateien extrahieren, indem Sie deren URLs angeben
- **Mehrere Dateien gleichzeitig verarbeiten**: Mehrere Dateien in einem einzigen Vorgang hochladen und parsen
- **Strukturierte Daten extrahieren**: Formatierung und Struktur der Originaldokumente wenn möglich beibehalten

Das Datei-Parser-Tool ist besonders nützlich für Szenarien, in denen Ihre Agenten mit Dokumenteninhalten arbeiten müssen, wie z.B. bei der Analyse von Berichten, der Extraktion von Daten aus Tabellenkalkulationen oder der Verarbeitung von Text aus verschiedenen Dokumentenquellen. Es vereinfacht den Prozess, Dokumenteninhalte für Ihre Agenten verfügbar zu machen, sodass sie genauso einfach mit in Dateien gespeicherten Informationen arbeiten können wie mit direkter Texteingabe.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Datei in den Workflow integrieren. Kann eine Datei manuell hochladen oder eine Datei-URL einfügen.

## Tools

### `file_parser`

Parsen einer oder mehrerer hochgeladener Dateien oder Dateien von URLs (Text, PDF, CSV, Bilder usw.)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `filePath` | string | Ja | Pfad zu der/den Datei(en). Kann ein einzelner Pfad, URL oder ein Array von Pfaden sein. |
| `fileType` | string | Nein | Typ der zu parsenden Datei (wird automatisch erkannt, wenn nicht angegeben) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `files` | array | Array der geparsten Dateien |
| `combinedContent` | string | Kombinierter Inhalt aller geparsten Dateien |

## Hinweise

- Kategorie: `tools`
- Typ: `file`
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/firecrawl.mdx

```text
---
title: Firecrawl
description: Scrapen, suchen, crawlen, mappen und extrahieren von Webdaten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="firecrawl"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Firecrawl](https://firecrawl.dev/) ist eine leistungsstarke Web-Scraping- und Content-Extraktions-API, die sich nahtlos in Sim integriert und Entwicklern ermöglicht, saubere, strukturierte Inhalte von jeder Website zu extrahieren. Diese Integration bietet eine einfache Möglichkeit, Webseiten in nutzbare Datenformate wie Markdown und HTML umzuwandeln und dabei die wesentlichen Inhalte zu bewahren.

Mit Firecrawl in Sim können Sie:

- **Saubere Inhalte extrahieren**: Entfernen Sie Werbung, Navigationselemente und andere Ablenkungen, um nur den Hauptinhalt zu erhalten
- **In strukturierte Formate umwandeln**: Transformieren Sie Webseiten in Markdown, HTML oder JSON
- **Metadaten erfassen**: Extrahieren Sie SEO-Metadaten, Open Graph-Tags und andere Seiteninformationen
- **JavaScript-lastige Seiten verarbeiten**: Verarbeiten Sie Inhalte von modernen Webanwendungen, die auf JavaScript basieren
- **Inhalte filtern**: Konzentrieren Sie sich auf bestimmte Teile einer Seite mit CSS-Selektoren
- **Skalierbar verarbeiten**: Bewältigen Sie umfangreiche Scraping-Anforderungen mit einer zuverlässigen API
- **Im Web suchen**: Führen Sie intelligente Websuchen durch und erhalten Sie strukturierte Ergebnisse
- **Ganze Websites crawlen**: Durchsuchen Sie mehrere Seiten einer Website und aggregieren Sie deren Inhalte

In Sim ermöglicht die Firecrawl-Integration Ihren Agenten, programmatisch auf Webinhalte zuzugreifen und diese als Teil ihrer Workflows zu verarbeiten. Unterstützte Operationen umfassen:

- **Scrape**: Extrahieren Sie strukturierte Inhalte (Markdown, HTML, Metadaten) von einer einzelnen Webseite.
- **Search**: Durchsuchen Sie das Web nach Informationen mit Firecrawls intelligenten Suchfunktionen.
- **Crawl**: Durchsuchen Sie mehrere Seiten einer Website und erhalten Sie strukturierte Inhalte und Metadaten für jede Seite.

Dies ermöglicht Ihren Agenten, Informationen von Websites zu sammeln, strukturierte Daten zu extrahieren und diese Informationen zu nutzen, um Entscheidungen zu treffen oder Erkenntnisse zu gewinnen – ohne sich mit den Komplexitäten des rohen HTML-Parsings oder der Browser-Automatisierung auseinandersetzen zu müssen. Konfigurieren Sie einfach den Firecrawl-Block mit Ihrem API-Schlüssel, wählen Sie die Operation (Scrape, Search oder Crawl) und geben Sie die relevanten Parameter an. Ihre Agenten können sofort mit Webinhalten in einem sauberen, strukturierten Format arbeiten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Firecrawl in den Workflow. Scrapen Sie Seiten, durchsuchen Sie das Web, crawlen Sie ganze Websites, erfassen Sie URL-Strukturen und extrahieren Sie strukturierte Daten mit KI.

## Tools

### `firecrawl_scrape`

Extrahieren Sie strukturierte Inhalte von Webseiten mit umfassender Metadaten-Unterstützung. Konvertiert Inhalte in Markdown oder HTML und erfasst dabei SEO-Metadaten, Open Graph-Tags und Seiteninformationen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Die URL, von der Inhalte gescrapt werden sollen |
| `scrapeOptions` | json | Nein | Optionen für das Content-Scraping |
| `apiKey` | string | Ja | Firecrawl API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `markdown` | string | Seiteninhalt im Markdown-Format |
| `html` | string | Roher HTML-Inhalt der Seite |
| `metadata` | object | Seiten-Metadaten einschließlich SEO- und Open Graph-Informationen |

### `firecrawl_search`

Suche nach Informationen im Web mit Firecrawl

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die zu verwendende Suchanfrage |
| `apiKey` | string | Ja | Firecrawl API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `data` | array | Suchergebnisdaten |

### `firecrawl_crawl`

Crawlen Sie ganze Websites und extrahieren Sie strukturierte Inhalte von allen zugänglichen Seiten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Die zu crawlende Website-URL |
| `limit` | number | Nein | Maximale Anzahl der zu crawlenden Seiten \(Standard: 100\) |
| `onlyMainContent` | boolean | Nein | Nur Hauptinhalt von Seiten extrahieren |
| `apiKey` | string | Ja | Firecrawl API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pages` | array | Array von gecrawlten Seiten mit ihrem Inhalt und Metadaten |

### `firecrawl_map`

Erhalten Sie schnell und zuverlässig eine vollständige Liste aller URLs einer Website. Nützlich, um alle Seiten einer Website zu entdecken, ohne sie zu crawlen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `url` | string | Ja | Die Basis-URL, von der Links erfasst und entdeckt werden sollen |
| `search` | string | Nein | Filtert Ergebnisse nach Relevanz zu einem Suchbegriff \(z.B. "blog"\) |
| `sitemap` | string | Nein | Steuert die Sitemap-Nutzung: "skip", "include" \(Standard\) oder "only" |
| `includeSubdomains` | boolean | Nein | Ob URLs von Subdomains einbezogen werden sollen \(Standard: true\) |
| `ignoreQueryParameters` | boolean | Nein | URLs mit Query-Strings ausschließen \(Standard: true\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Links \(max: 100.000, Standard: 5.000\) |
| `timeout` | number | Nein | Timeout der Anfrage in Millisekunden |
| `location` | json | Nein | Geografischer Kontext für Proxying \(Land, Sprachen\) |
| `apiKey` | string | Ja | Firecrawl API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Mapping-Vorgang erfolgreich war |
| `links` | array | Array der entdeckten URLs von der Website |

### `firecrawl_extract`

Extrahieren Sie strukturierte Daten aus vollständigen Webseiten mithilfe von natürlichsprachlichen Anweisungen und JSON-Schema. Leistungsstarke Agenten-Funktion für intelligente Datenextraktion.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `urls` | json | Ja | Array von URLs, aus denen Daten extrahiert werden sollen \(unterstützt Glob-Format\) |
| `prompt` | string | Nein | Natürlichsprachliche Anleitung für den Extraktionsprozess |
| `schema` | json | Nein | JSON-Schema, das die Struktur der zu extrahierenden Daten definiert |
| `enableWebSearch` | boolean | Nein | Websuche aktivieren, um ergänzende Informationen zu finden \(Standard: false\) |
| `ignoreSitemap` | boolean | Nein | Sitemap.xml-Dateien beim Scannen ignorieren \(Standard: false\) |
| `includeSubdomains` | boolean | Nein | Scanning auf Subdomains erweitern \(Standard: true\) |
| `showSources` | boolean | Nein | Datenquellen in der Antwort zurückgeben \(Standard: false\) |
| `ignoreInvalidURLs` | boolean | Nein | Ungültige URLs im Array überspringen \(Standard: true\) |
| `scrapeOptions` | json | Nein | Erweiterte Scraping-Konfigurationsoptionen |
| `apiKey` | string | Ja | Firecrawl API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Extraktionsvorgang erfolgreich war |
| `data` | object | Extrahierte strukturierte Daten gemäß dem Schema oder der Eingabeaufforderung |

## Hinweise

- Kategorie: `tools`
- Typ: `firecrawl`
```

--------------------------------------------------------------------------------

---[FILE: generic_webhook.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/generic_webhook.mdx

```text
---
title: Webhook
description: Empfangen Sie Webhooks von jedem Dienst durch Konfiguration eines
  benutzerdefinierten Webhooks.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"
import { Image } from '@/components/ui/image'

<BlockInfoCard 
  type="generic_webhook"
  color="#10B981"
/>

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Webhook-Block-Konfiguration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Übersicht

Der generische Webhook-Block ermöglicht den Empfang von Webhooks von jedem externen Dienst. Dies ist ein flexibler Trigger, der jede JSON-Nutzlast verarbeiten kann und sich daher ideal für die Integration mit Diensten eignet, die keinen dedizierten Sim-Block haben.

## Grundlegende Verwendung

### Einfacher Durchleitungsmodus

Ohne ein definiertes Eingabeformat leitet der Webhook den gesamten Anforderungstext unverändert weiter:

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Test webhook trigger",
    "data": {
      "key": "value"
    }
  }'
```

Greifen Sie in nachgelagerten Blöcken auf die Daten zu mit:
- `<webhook1.message>` → "Test webhook trigger"
- `<webhook1.data.key>` → "value"

### Strukturiertes Eingabeformat (optional)

Definieren Sie ein Eingabeschema, um typisierte Felder zu erhalten und erweiterte Funktionen wie Datei-Uploads zu aktivieren:

**Konfiguration des Eingabeformats:**

```json
[
  { "name": "message", "type": "string" },
  { "name": "priority", "type": "number" },
  { "name": "documents", "type": "files" }
]
```

**Webhook-Anfrage:**

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Invoice submission",
    "priority": 1,
    "documents": [
      {
        "type": "file",
        "data": "data:application/pdf;base64,JVBERi0xLjQK...",
        "name": "invoice.pdf",
        "mime": "application/pdf"
      }
    ]
  }'
```

## Datei-Uploads

### Unterstützte Dateiformate

Der Webhook unterstützt zwei Dateieingabeformate:

#### 1. Base64-kodierte Dateien
Zum direkten Hochladen von Dateiinhalten:

```json
{
  "documents": [
    {
      "type": "file",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "name": "screenshot.png",
      "mime": "image/png"
    }
  ]
}
```

- **Maximale Größe**: 20MB pro Datei
- **Format**: Standard-Daten-URL mit Base64-Kodierung
- **Speicherung**: Dateien werden in sicheren Ausführungsspeicher hochgeladen

#### 2. URL-Referenzen
Zum Übergeben vorhandener Datei-URLs:

```json
{
  "documents": [
    {
      "type": "url",
      "data": "https://example.com/files/document.pdf",
      "name": "document.pdf",
      "mime": "application/pdf"
    }
  ]
}
```

### Zugriff auf Dateien in nachgelagerten Blöcken

Dateien werden in `UserFile`Objekte mit den folgenden Eigenschaften verarbeitet:

```typescript
{
  id: string,          // Unique file identifier
  name: string,        // Original filename
  url: string,         // Presigned URL (valid for 5 minutes)
  size: number,        // File size in bytes
  type: string,        // MIME type
  key: string,         // Storage key
  uploadedAt: string,  // ISO timestamp
  expiresAt: string    // ISO timestamp (5 minutes)
}
```

**Zugriff in Blöcken:**
- `<webhook1.documents[0].url>` → Download-URL
- `<webhook1.documents[0].name>` → "invoice.pdf"
- `<webhook1.documents[0].size>` → 524288
- `<webhook1.documents[0].type>` → "application/pdf"

### Vollständiges Datei-Upload-Beispiel

```bash
# Create a base64-encoded file
echo "Hello World" | base64
# SGVsbG8gV29ybGQK

# Send webhook with file
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "subject": "Document for review",
    "attachments": [
      {
        "type": "file",
        "data": "data:text/plain;base64,SGVsbG8gV29ybGQK",
        "name": "sample.txt",
        "mime": "text/plain"
      }
    ]
  }'
```

## Authentifizierung

### Authentifizierung konfigurieren (Optional)

In der Webhook-Konfiguration:
1. Aktiviere "Authentifizierung erforderlich"
2. Setze einen geheimen Token
3. Wähle den Header-Typ:
   - **Benutzerdefinierter Header**: `X-Sim-Secret: your-token`
   - **Authorization Bearer**: `Authorization: Bearer your-token`

### Verwendung der Authentifizierung

```bash
# With custom header
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret-token" \
  -d '{"message": "Authenticated request"}'

# With bearer token
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{"message": "Authenticated request"}'
```

## Best Practices

1. **Eingabeformat für Struktur verwenden**: Definiere ein Eingabeformat, wenn du das erwartete Schema kennst. Dies bietet:
   - Typvalidierung
   - Bessere Autovervollständigung im Editor
   - Datei-Upload-Funktionen

2. **Authentifizierung**: Aktiviere immer die Authentifizierung für Produktions-Webhooks, um unbefugten Zugriff zu verhindern.

3. **Dateigrößenbeschränkungen**: Halte Dateien unter 20 MB. Verwende für größere Dateien URL-Referenzen.

4. **Dateiablauf**: Heruntergeladene Dateien haben URLs mit einer Gültigkeit von 5 Minuten. Verarbeite sie umgehend oder speichere sie an anderer Stelle, wenn sie länger benötigt werden.

5. **Fehlerbehandlung**: Die Webhook-Verarbeitung erfolgt asynchron. Überprüfe die Ausführungsprotokolle auf Fehler.

6. **Testen**: Verwende die Schaltfläche "Webhook testen" im Editor, um deine Konfiguration vor der Bereitstellung zu validieren.

## Anwendungsfälle

- **Formularübermittlungen**: Empfange Daten von benutzerdefinierten Formularen mit Datei-Uploads
- **Drittanbieter-Integrationen**: Verbinde mit Diensten, die Webhooks senden (Stripe, GitHub usw.)
- **Dokumentenverarbeitung**: Akzeptiere Dokumente von externen Systemen zur Verarbeitung
- **Ereignisbenachrichtigungen**: Empfange Ereignisdaten aus verschiedenen Quellen
- **Benutzerdefinierte APIs**: Erstelle benutzerdefinierte API-Endpunkte für deine Anwendungen

## Hinweise

- Kategorie: `triggers`
- Typ: `generic_webhook`
- **Dateiunterstützung**: Verfügbar über Eingabeformat-Konfiguration
- **Maximale Dateigröße**: 20 MB pro Datei
```

--------------------------------------------------------------------------------

````
