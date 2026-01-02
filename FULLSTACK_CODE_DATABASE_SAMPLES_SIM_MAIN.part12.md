---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 12
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 12 of 933)

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

---[FILE: human-in-the-loop.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/human-in-the-loop.mdx

```text
---
title: Human in the Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Der Human in the Loop Block pausiert die Workflow-Ausführung und wartet auf menschliches Eingreifen, bevor er fortfährt. Verwenden Sie ihn, um Genehmigungspunkte hinzuzufügen, Feedback zu sammeln oder zusätzliche Eingaben an kritischen Entscheidungspunkten einzuholen.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-1.png"
    alt="Human in the Loop Block Konfiguration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Wenn die Ausführung diesen Block erreicht, pausiert der Workflow auf unbestimmte Zeit, bis ein Mensch über das Genehmigungsportal, die API oder den Webhook eine Eingabe macht.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-2.png"
    alt="Human in the Loop Genehmigungsportal"
    width={700}
    height={500}
    className="my-6"
  />
</div>

## Konfigurationsoptionen

### Pausierte Ausgabe

Definiert, welche Daten dem Genehmigenden angezeigt werden. Dies ist der Kontext, der im Genehmigungsportal angezeigt wird, um eine fundierte Entscheidung zu ermöglichen.

Verwenden Sie den visuellen Builder oder den JSON-Editor, um die Daten zu strukturieren. Referenzieren Sie Workflow-Variablen mit der `<blockName.output>` Syntax.

```json
{
  "customerName": "<agent1.content.name>",
  "proposedAction": "<router1.selectedPath>",
  "confidenceScore": "<evaluator1.score>",
  "generatedEmail": "<agent2.content>"
}
```

### Benachrichtigung

Konfiguriert, wie Genehmigende benachrichtigt werden, wenn eine Genehmigung erforderlich ist. Unterstützte Kanäle sind:

- **Slack** - Nachrichten an Kanäle oder DMs
- **Gmail** - E-Mail mit Genehmigungslink
- **Microsoft Teams** - Team-Kanal-Benachrichtigungen
- **SMS** - Textwarnungen über Twilio
- **Webhooks** - Benutzerdefinierte Benachrichtigungssysteme

Fügen Sie die Genehmigungs-URL (`<blockId.url>`) in Ihre Benachrichtigungsnachrichten ein, damit Genehmigende auf das Portal zugreifen können.

### Fortsetzungseingabe

Definiert die Felder, die Genehmigende bei der Antwort ausfüllen. Diese Daten werden nach der Fortsetzung des Workflows für nachfolgende Blöcke verfügbar.

```json
{
  "approved": {
    "type": "boolean",
    "description": "Approve or reject this request"
  },
  "comments": {
    "type": "string",
    "description": "Optional feedback or explanation"
  }
}
```

Greifen Sie in nachgelagerten Blöcken auf Wiederaufnahmedaten mit `<blockId.resumeInput.fieldName>` zu. 

## Genehmigungsmethoden

<Tabs items={['Genehmigungsportal', 'API', 'Webhook']}>
  <Tab>
    ### Genehmigungsportal
    
    Jeder Block generiert eine eindeutige Portal-URL (`<blockId.url>`) mit einer visuellen Oberfläche, die alle pausierten Ausgabedaten und Formularfelder für die Fortsetzungseingabe anzeigt. Mobilgerätekompatibel und sicher.
    
    Teilen Sie diese URL in Benachrichtigungen, damit Genehmiger die Anfragen prüfen und beantworten können.
  </Tab>
  <Tab>
    ### REST API
    
    Workflows programmatisch fortsetzen:
    

    ```bash
    POST /api/workflows/{workflowId}/executions/{executionId}/resume/{blockId}
    
    {
      "approved": true,
      "comments": "Looks good to proceed"
    }
    ```

    
    Erstellen Sie benutzerdefinierte Genehmigungs-UIs oder integrieren Sie bestehende Systeme.
  </Tab>
  <Tab>
    ### Webhook
    
    Fügen Sie ein Webhook-Tool im Benachrichtigungsbereich hinzu, um Genehmigungsanfragen an externe Systeme zu senden. Integration mit Ticketing-Systemen wie Jira oder ServiceNow.
  </Tab>
</Tabs>

## Häufige Anwendungsfälle

**Inhaltsgenehmigung** - Überprüfung von KI-generierten Inhalten vor der Veröffentlichung

```
Agent → Human in the Loop → API (Publish)
```

**Mehrstufige Genehmigungen** - Verkettung mehrerer Genehmigungsschritte für wichtige Entscheidungen

```
Agent → Human in the Loop (Manager) → Human in the Loop (Director) → Execute
```

**Datenvalidierung** - Überprüfung extrahierter Daten vor der Verarbeitung

```
Agent (Extract) → Human in the Loop (Validate) → Function (Process)
```

**Qualitätskontrolle** - Überprüfung von KI-Ausgaben vor dem Versand an Kunden

```
Agent (Generate) → Human in the Loop (QA) → Gmail (Send)
```

## Block-Ausgaben

**`url`** - Eindeutige URL für das Genehmigungsportal  
**`resumeInput.*`** - Alle in der Fortsetzungseingabe definierten Felder werden verfügbar, nachdem der Workflow fortgesetzt wird

Zugriff über `<blockId.resumeInput.fieldName>`.

## Beispiel

**Pausierte Ausgabe:**

```json
{
  "title": "<agent1.content.title>",
  "body": "<agent1.content.body>",
  "qualityScore": "<evaluator1.score>"
}
```

**Fortsetzungseingabe:**

```json
{
  "approved": { "type": "boolean" },
  "feedback": { "type": "string" }
}
```

**Nachgelagerte Verwendung:**

```javascript
// Condition block
<approval1.resumeInput.approved> === true
```

Das Beispiel unten zeigt ein Genehmigungsportal, wie es von einem Genehmiger gesehen wird, nachdem der Workflow angehalten wurde. Genehmiger können die Daten überprüfen und Eingaben als Teil der Workflow-Wiederaufnahme bereitstellen. Auf das Genehmigungsportal kann direkt über die eindeutige URL, `<blockId.url>`, zugegriffen werden.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="hitl-resume.mp4" width={700} height={450} />
</div>

## Verwandte Blöcke

- **[Bedingung](/blocks/condition)** - Verzweigung basierend auf Genehmigungsentscheidungen
- **[Variablen](/blocks/variables)** - Speichern von Genehmigungsverlauf und Metadaten
- **[Antwort](/blocks/response)** - Rückgabe von Workflow-Ergebnissen an API-Aufrufer
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/index.mdx

```text
---
title: Übersicht
description: Die Bausteine deiner KI-Workflows
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Blöcke sind die Bausteine, die du miteinander verbindest, um KI-Workflows zu erstellen. Betrachte sie als spezialisierte Module, die jeweils eine bestimmte Aufgabe übernehmen – vom Chatten mit KI-Modellen über API-Aufrufe bis hin zur Datenverarbeitung.

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Grundlegende Blocktypen

Sim bietet wesentliche Blocktypen, die die Kernfunktionen von KI-Workflows abdecken:

### Verarbeitungsblöcke
- **[Agent](/blocks/agent)** - Chatte mit KI-Modellen (OpenAI, Anthropic, Google, lokale Modelle)
- **[Function](/blocks/function)** - Führe benutzerdefinierten JavaScript/TypeScript-Code aus
- **[API](/blocks/api)** - Verbinde dich mit externen Diensten über HTTP-Anfragen

### Logikblöcke
- **[Condition](/blocks/condition)** - Verzweige Workflow-Pfade basierend auf booleschen Ausdrücken
- **[Router](/blocks/router)** - Nutze KI, um Anfragen intelligent auf verschiedene Pfade zu leiten
- **[Evaluator](/blocks/evaluator)** - Bewerte und beurteile die Inhaltsqualität mit KI

### Ablaufsteuerungsblöcke
- **[Variablen](/blocks/variables)** - Workflow-bezogene Variablen setzen und verwalten
- **[Warten](/blocks/wait)** - Workflow-Ausführung für eine bestimmte Zeitverzögerung pausieren
- **[Mensch in der Schleife](/blocks/human-in-the-loop)** - Pausieren für menschliche Genehmigung und Feedback vor dem Fortfahren

### Ausgabeblöcke
- **[Antwort](/blocks/response)** - Formatieren und Zurückgeben der endgültigen Ergebnisse aus Ihrem Workflow

## Wie Blöcke funktionieren

Jeder Block hat drei Hauptkomponenten:

**Eingaben**: Daten, die in den Block von anderen Blöcken oder Benutzereingaben kommen
**Konfiguration**: Einstellungen, die steuern, wie der Block sich verhält
**Ausgaben**: Daten, die der Block für andere Blöcke zur Verwendung erzeugt

<Steps>
  <Step>
    <strong>Eingabe empfangen</strong>: Block erhält Daten von verbundenen Blöcken oder Benutzereingaben
  </Step>
  <Step>
    <strong>Verarbeiten</strong>: Block verarbeitet die Eingabe gemäß seiner Konfiguration
  </Step>
  <Step>
    <strong>Ergebnisse ausgeben</strong>: Block erzeugt Ausgabedaten für die nächsten Blöcke im Workflow
  </Step>
</Steps>

## Blöcke verbinden

Sie erstellen Workflows, indem Sie Blöcke miteinander verbinden. Die Ausgabe eines Blocks wird zur Eingabe eines anderen:

- **Ziehen zum Verbinden**: Ziehen Sie von einem Ausgabeport zu einem Eingabeport
- **Mehrfachverbindungen**: Eine Ausgabe kann mit mehreren Eingaben verbunden werden
- **Verzweigende Pfade**: Einige Blöcke können basierend auf Bedingungen zu verschiedenen Pfaden weiterleiten

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Häufige Muster

### Sequentielle Verarbeitung
Verbinden Sie Blöcke in einer Kette, wobei jeder Block die Ausgabe des vorherigen verarbeitet:

```
User Input → Agent → Function → Response
```

### Bedingte Verzweigung
Verwenden Sie Bedingung- oder Router-Blöcke, um verschiedene Pfade zu erstellen:

```
User Input → Router → Agent A (for questions)
                   → Agent B (for commands)
```

### Qualitätskontrolle
Verwenden Sie Evaluator-Blöcke, um Ausgaben zu bewerten und zu filtern:

```
Agent → Evaluator → Condition → Response (if good)
                              → Agent (retry if bad)
```

## Block-Konfiguration

Jeder Blocktyp hat spezifische Konfigurationsoptionen:

**Alle Blöcke**:
- Eingabe-/Ausgabeverbindungen
- Fehlerbehandlungsverhalten
- Einstellungen für Ausführungs-Timeout

**KI-Blöcke** (Agent, Router, Evaluator):
- Modellauswahl (OpenAI, Anthropic, Google, lokal)
- API-Schlüssel und Authentifizierung
- Temperatur und andere Modellparameter
- Systemaufforderungen und Anweisungen

**Logik-Blöcke** (Bedingung, Funktion):
- Benutzerdefinierte Ausdrücke oder Code
- Variablenreferenzen
- Einstellungen für Ausführungsumgebung

**Integrations-Blöcke** (API, Response):
- Endpunktkonfiguration
- Header und Authentifizierung
- Anfrage-/Antwortformatierung

<Cards>
  <Card title="Agent-Block" href="/blocks/agent">
    Verbindung zu KI-Modellen herstellen und intelligente Antworten erstellen
  </Card>
  <Card title="Funktionsblock" href="/blocks/function">
    Benutzerdefinierten Code ausführen, um Daten zu verarbeiten und zu transformieren
  </Card>
  <Card title="API-Block" href="/blocks/api">
    Integration mit externen Diensten und APIs
  </Card>
  <Card title="Bedingungsblock" href="/blocks/condition">
    Verzweigende Logik basierend auf Datenbewertung erstellen
  </Card>
  <Card title="Mensch-in-der-Schleife-Block" href="/blocks/human-in-the-loop">
    Pausieren für menschliche Genehmigung und Feedback vor dem Fortfahren
  </Card>
  <Card title="Variablenblock" href="/blocks/variables">
    Workflow-bezogene Variablen setzen und verwalten
  </Card>
  <Card title="Warteblock" href="/blocks/wait">
    Workflow-Ausführung für bestimmte Zeitverzögerungen pausieren
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: loop.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/loop.mdx

```text
---
title: Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Schleifenblock ist ein Container, der Blöcke wiederholt ausführt. Iteriere über Sammlungen, wiederhole Operationen eine festgelegte Anzahl von Malen oder fahre fort, solange eine Bedingung erfüllt ist.

<Callout type="info">
  Schleifenblöcke sind Container-Knoten, die andere Blöcke in sich enthalten. Die enthaltenen Blöcke werden mehrfach ausgeführt, basierend auf deiner Konfiguration.
</Callout>

## Konfigurationsoptionen

### Schleifentyp

Wähle zwischen vier Arten von Schleifen:

<Tabs items={['For-Schleife', 'ForEach-Schleife', 'While-Schleife', 'Do-While-Schleife']}>
  <Tab>
    **For-Schleife (Iterationen)** - Eine numerische Schleife, die eine festgelegte Anzahl von Malen ausgeführt wird:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-1.png"
        alt="For-Schleife mit Iterationen"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Verwende diese, wenn du eine Operation eine bestimmte Anzahl von Malen wiederholen musst.
    

    ```
    Example: Run 5 times
    - Iteration 1
    - Iteration 2
    - Iteration 3
    - Iteration 4
    - Iteration 5
    ```

  </Tab>
  <Tab>
    **ForEach-Schleife (Sammlung)** - Eine sammlungsbasierte Schleife, die über jedes Element in einem Array oder Objekt iteriert:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-2.png"
        alt="ForEach-Schleife mit Sammlung"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Verwende diese, wenn du eine Sammlung von Elementen verarbeiten musst.
    

    ```
    Example: Process ["apple", "banana", "orange"]
    - Iteration 1: Process "apple"
    - Iteration 2: Process "banana"
    - Iteration 3: Process "orange"
    ```

  </Tab>
  <Tab>
    **While-Schleife (Bedingungsbasiert)** - Wird ausgeführt, solange eine Bedingung als wahr ausgewertet wird:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-3.png"
        alt="While-Schleife mit Bedingung"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Verwende diese, wenn du eine Schleife benötigst, die läuft, bis eine bestimmte Bedingung erfüllt ist. Die Bedingung wird **vor** jeder Iteration überprüft.

    ```
    Example: While {"<variable.i>"} < 10
    - Check condition → Execute if true
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Execute if true
    - Check condition → Exit if false
    ```

  </Tab>
  <Tab>
    **Do-While-Schleife (Bedingungsbasiert)** - Wird mindestens einmal ausgeführt und dann fortgesetzt, solange eine Bedingung wahr ist:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-4.png"
        alt="Do-While-Schleife mit Bedingung"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Verwende diese, wenn du eine Operation mindestens einmal ausführen musst und dann die Schleife fortsetzen willst, bis eine Bedingung erfüllt ist. Die Bedingung wird **nach** jeder Iteration überprüft.

    ```
    Example: Do-while {"<variable.i>"} < 10
    - Execute blocks
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Continue if true
    - Check condition → Exit if false
    ```

  </Tab>
</Tabs>

## Wie man Schleifen verwendet

### Eine Schleife erstellen

1. Ziehe einen Schleifenblock aus der Werkzeugleiste auf deine Leinwand
2. Konfiguriere den Schleifentyp und die Parameter
3. Ziehe andere Blöcke in den Schleifencontainer
4. Verbinde die Blöcke nach Bedarf

### Auf Ergebnisse zugreifen

Nach Abschluss einer Schleife kannst du auf aggregierte Ergebnisse zugreifen:

- **loop.results**: Array mit Ergebnissen aller Schleifendurchläufe

## Beispielanwendungsfälle

**Verarbeitung von API-Ergebnissen** - ForEach-Schleife verarbeitet Kundendatensätze aus einer API

```javascript
// Beispiel: ForEach-Schleife für API-Ergebnisse
const customers = await api.getCustomers();

loop.forEach(customers, (customer) => {
  // Verarbeite jeden Kunden
  if (customer.status === 'active') {
    sendEmail(customer.email, 'Sonderangebot');
  }
});
```

**Iterative Inhaltsgenerierung** - For-Schleife generiert mehrere Inhaltsvariationen

```javascript
// Beispiel: For-Schleife für Inhaltsgenerierung
const variations = [];

loop.for(5, (i) => {
  // Generiere 5 verschiedene Variationen
  const content = ai.generateContent({
    prompt: `Variation ${i+1} für Produktbeschreibung`,
    temperature: 0.7 + (i * 0.1)
  });
  variations.push(content);
});
```

**Zähler mit While-Schleife** - While-Schleife verarbeitet Elemente mit Zähler

```javascript
// Beispiel: While-Schleife mit Zähler
let counter = 0;
let processedItems = 0;

loop.while(() => counter < items.length, () => {
  if (items[counter].isValid) {
    processItem(items[counter]);
    processedItems++;
  }
  counter++;
});

console.log(`${processedItems} gültige Elemente verarbeitet`);
```

## Erweiterte Funktionen

### Einschränkungen

<Callout type="warning">
  Container-Blöcke (Schleifen und Parallele) können nicht ineinander verschachtelt werden. Das bedeutet:
  - Du kannst keinen Schleifenblock in einen anderen Schleifenblock platzieren
  - Du kannst keinen Parallel-Block in einen Schleifenblock platzieren
  - Du kannst keinen Container-Block in einen anderen Container-Block platzieren
  
  Wenn du mehrdimensionale Iterationen benötigst, erwäge eine Umstrukturierung deines Workflows, um sequentielle Schleifen zu verwenden oder Daten in Stufen zu verarbeiten.
</Callout>

<Callout type="info">
  Schleifen werden sequentiell ausgeführt, nicht parallel. Wenn du eine gleichzeitige Ausführung benötigst, verwende stattdessen den Parallel-Block.
</Callout>

## Eingaben und Ausgaben

<Tabs items={['Configuration', 'Variables', 'Results']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Schleifentyp</strong>: Wähle zwischen 'for', 'forEach', 'while' oder 'doWhile'
      </li>
      <li>
        <strong>Iterationen</strong>: Anzahl der Ausführungen (für for-Schleifen)
      </li>
      <li>
        <strong>Sammlung</strong>: Array oder Objekt zum Durchlaufen (für forEach-Schleifen)
      </li>
      <li>
        <strong>Bedingung</strong>: Boolescher Ausdruck zur Auswertung (für while/do-while-Schleifen)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.currentItem</strong>: Aktuell verarbeitetes Element
      </li>
      <li>
        <strong>loop.index</strong>: Aktuelle Iterationsnummer (0-basiert)
      </li>
      <li>
        <strong>loop.items</strong>: Vollständige Sammlung (für forEach-Schleifen)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.results</strong>: Array aller Iterationsergebnisse
      </li>
      <li>
        <strong>Struktur</strong>: Ergebnisse behalten die Iterationsreihenfolge bei
      </li>
      <li>
        <strong>Zugriff</strong>: Verfügbar in Blöcken nach der Schleife
      </li>
    </ul>
  </Tab>
</Tabs>

## Bewährte Praktiken

- **Setzen Sie vernünftige Grenzen**: Halten Sie die Anzahl der Iterationen in einem vernünftigen Rahmen, um lange Ausführungszeiten zu vermeiden
- **Verwenden Sie ForEach für Sammlungen**: Verwenden Sie beim Verarbeiten von Arrays oder Objekten ForEach anstelle von For-Schleifen
- **Behandeln Sie Fehler elegant**: Erwägen Sie, Fehlerbehandlung innerhalb von Schleifen hinzuzufügen, um robuste Workflows zu gewährleisten
```

--------------------------------------------------------------------------------

---[FILE: parallel.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/parallel.mdx

```text
---
title: Parallel
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Parallel-Block ist ein Container, der mehrere Instanzen gleichzeitig ausführt, um Workflows schneller zu verarbeiten. Verarbeiten Sie Elemente simultan statt sequentiell.

<Callout type="info">
  Parallel-Blöcke sind Container-Knoten, die ihre Inhalte mehrfach gleichzeitig ausführen, im Gegensatz zu Schleifen, die sequentiell ausgeführt werden.
</Callout>

## Konfigurationsoptionen

### Parallel-Typ

Wählen Sie zwischen zwei Arten der parallelen Ausführung:

<Tabs items={['Count-based', 'Collection-based']}>
  <Tab>
    **Anzahlbasierte Parallelisierung** - Führen Sie eine feste Anzahl paralleler Instanzen aus:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-1.png"
        alt="Anzahlbasierte parallele Ausführung"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Verwenden Sie diese Option, wenn Sie dieselbe Operation mehrmals gleichzeitig ausführen müssen.
    

```javascript
// Beispiel: 3 parallele Instanzen ausführen
const results = await blocks.parallel({
  type: 'count',
  count: 3,
  async process(index) {
    // Jede Instanz erhält einen eindeutigen Index (0, 1, 2)
    return `Ergebnis von Instanz ${index}`;
  }
});
```

  </Tab>
  <Tab>
    **Sammlungsbasierte Parallelisierung** - Verteilen Sie eine Sammlung auf parallele Instanzen:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-2.png"
        alt="Sammlungsbasierte parallele Ausführung"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Jede Instanz verarbeitet gleichzeitig ein Element aus der Sammlung.
    

```javascript
// Beispiel: Eine Liste von URLs parallel verarbeiten
const urls = [
  'https://example.com/api/1',
  'https://example.com/api/2',
  'https://example.com/api/3'
];

const results = await blocks.parallel({
  type: 'collection',
  items: urls,
  async process(url, index) {
    // Jede Instanz verarbeitet eine URL
    const response = await fetch(url);
    return response.json();
  }
});
```

  </Tab>
</Tabs>

## Verwendung von Parallel-Blöcken

### Erstellen eines Parallel-Blocks

1. Ziehen Sie einen Parallel-Block aus der Symbolleiste auf Ihre Leinwand
2. Konfigurieren Sie den Parallel-Typ und die Parameter
3. Ziehen Sie einen einzelnen Block in den Parallel-Container
4. Verbinden Sie den Block nach Bedarf

### Zugriff auf Ergebnisse

Nach Abschluss eines Parallel-Blocks können Sie auf aggregierte Ergebnisse zugreifen:

- **`results`**: Array von Ergebnissen aus allen parallelen Instanzen

## Beispielanwendungsfälle

**Batch-API-Verarbeitung** - Verarbeiten Sie mehrere API-Aufrufe gleichzeitig

<div className="mb-4 rounded-md border p-4">
  <h4 className="font-medium">Szenario: Mehrere API-Endpunkte abfragen</h4>
  <ol className="list-decimal pl-5 text-sm">
    <li>Sammlungsbasierte Parallelisierung über eine Liste von API-Endpunkten</li>
    <li>Jede Instanz führt einen API-Aufruf durch und verarbeitet die Antwort</li>
    <li>Ergebnisse werden in einem Array gesammelt und können weiterverarbeitet werden</li>
  </ol>
</div>

**Multi-Modell-KI-Verarbeitung** - Erhalten Sie Antworten von mehreren KI-Modellen gleichzeitig

<div className="mb-4 rounded-md border p-4">
  <h4 className="font-medium">Szenario: Antworten von mehreren KI-Modellen erhalten</h4>
  <ol className="list-decimal pl-5 text-sm">
    <li>Sammlungsbasierte Parallelverarbeitung über eine Liste von Modell-IDs (z.B. ["gpt-4o", "claude-3.7-sonnet", "gemini-2.5-pro"])</li>
    <li>Innerhalb des parallelen Blocks: Das Modell des Agenten wird auf das aktuelle Element aus der Sammlung gesetzt</li>
    <li>Nach dem parallelen Block: Vergleichen und Auswählen der besten Antwort</li>
  </ol>
</div>

## Erweiterte Funktionen

### Ergebnisaggregation

Ergebnisse aus allen parallelen Instanzen werden automatisch gesammelt:

### Anwendungsbeispiele

### Instanzisolierung

Jede parallele Instanz läuft unabhängig:
- Separate Variablenbereiche
- Kein gemeinsamer Zustand zwischen Instanzen
- Fehler in einer Instanz beeinflussen andere nicht

### Einschränkungen

<Callout type="warning">
  Container-Blöcke (Schleifen und Parallele) können nicht ineinander verschachtelt werden. Das bedeutet:
  - Sie können keinen Schleifenblock in einen Parallelblock platzieren
  - Sie können keinen weiteren Parallelblock in einen Parallelblock platzieren
  - Sie können keinen Container-Block in einen anderen Container-Block platzieren
</Callout>

<Callout type="info">
  Während die parallele Ausführung schneller ist, beachten Sie bitte:
  - API-Ratenbegrenzungen bei gleichzeitigen Anfragen
  - Speicherverbrauch bei großen Datensätzen
  - Maximum von 20 gleichzeitigen Instanzen, um Ressourcenerschöpfung zu vermeiden
</Callout>

## Parallel vs. Schleife

Wann Sie welche Methode verwenden sollten:

| Funktion | Parallel | Schleife |
|---------|----------|------|
| Ausführung | Gleichzeitig | Sequentiell |
| Geschwindigkeit | Schneller für unabhängige Operationen | Langsamer, aber geordnet |
| Reihenfolge | Keine garantierte Reihenfolge | Behält Reihenfolge bei |
| Anwendungsfall | Unabhängige Operationen | Abhängige Operationen |
| Ressourcennutzung | Höher | Niedriger |

## Eingaben und Ausgaben

<Tabs items={['Configuration', 'Variables', 'Results']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Parallel-Typ</strong>: Wählen Sie zwischen 'count' oder 'collection'
      </li>
      <li>
        <strong>Anzahl</strong>: Anzahl der auszuführenden Instanzen (anzahlbasiert)
      </li>
      <li>
        <strong>Sammlung</strong>: Array oder Objekt zur Verteilung (sammlungsbasiert)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.currentItem</strong>: Element für diese Instanz
      </li>
      <li>
        <strong>parallel.index</strong>: Instanznummer (0-basiert)
      </li>
      <li>
        <strong>parallel.items</strong>: Vollständige Sammlung (sammlungsbasiert)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.results</strong>: Array aller Instanzergebnisse
      </li>
      <li>
        <strong>Zugriff</strong>: Verfügbar in Blöcken nach der Parallelausführung
      </li>
    </ul>
  </Tab>
</Tabs>

## Best Practices

- **Nur unabhängige Operationen**: Stellen Sie sicher, dass Operationen nicht voneinander abhängen
- **Ratenbegrenzungen berücksichtigen**: Fügen Sie Verzögerungen oder Drosselungen für API-intensive Workflows hinzu
- **Fehlerbehandlung**: Jede Instanz sollte ihre eigenen Fehler angemessen behandeln
```

--------------------------------------------------------------------------------

---[FILE: response.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/response.mdx

```text
---
title: Antwort
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Response-Block formatiert und sendet strukturierte HTTP-Antworten zurück an API-Aufrufer. Verwenden Sie ihn, um Workflow-Ergebnisse mit korrekten Statuscodes und Headern zurückzugeben.

<div className="flex justify-center">
  <Image
    src="/static/blocks/response.png"
    alt="Konfiguration des Antwort-Blocks"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
  Response-Blöcke sind terminale Blöcke - sie beenden die Workflow-Ausführung und können nicht mit anderen Blöcken verbunden werden.
</Callout>

## Konfigurationsoptionen

### Antwortdaten

Die Antwortdaten sind der Hauptinhalt, der an den API-Aufrufer zurückgesendet wird. Diese sollten als JSON formatiert sein und können Folgendes enthalten:

- Statische Werte
- Dynamische Verweise auf Workflow-Variablen mit der `<variable.name>` Syntax
- Verschachtelte Objekte und Arrays
- Jede gültige JSON-Struktur

### Statuscode

Legen Sie den HTTP-Statuscode für die Antwort fest (standardmäßig 200):

**Erfolg (2xx):**
- **200**: OK - Standard-Erfolgsantwort
- **201**: Erstellt - Ressource erfolgreich erstellt
- **204**: Kein Inhalt - Erfolg ohne Antworttext

**Client-Fehler (4xx):**
- **400**: Ungültige Anfrage - Ungültige Anfrageparameter
- **401**: Nicht autorisiert - Authentifizierung erforderlich
- **404**: Nicht gefunden - Ressource existiert nicht
- **422**: Nicht verarbeitbare Entität - Validierungsfehler

**Server-Fehler (5xx):**
- **500**: Interner Serverfehler - Serverseitiger Fehler
- **502**: Bad Gateway - Fehler eines externen Dienstes
- **503**: Dienst nicht verfügbar - Dienst vorübergehend nicht erreichbar

### Antwort-Header

Konfigurieren Sie zusätzliche HTTP-Header, die in die Antwort aufgenommen werden sollen.

Header werden als Schlüssel-Wert-Paare konfiguriert:

| Schlüssel | Wert |
|-----|-------|
| Content-Type | application/json |
| Cache-Control | no-cache |
| X-API-Version | 1.0 |

## Beispielanwendungsfälle

**API-Endpunkt-Antwort** - Strukturierte Daten von einer Such-API zurückgeben

```
Agent (Search) → Function (Format & Paginate) → Response (200, JSON)
```

**Webhook-Bestätigung** - Bestätigung des Webhook-Empfangs und der Verarbeitung

```
Webhook Trigger → Function (Process) → Response (200, Confirmation)
```

**Fehlerantwort-Behandlung** - Angemessene Fehlerantworten zurückgeben

```
Condition (Error Detected) → Router → Response (400/500, Error Details)
```

## Ausgaben

Antwortblöcke sind endgültig - sie beenden die Workflow-Ausführung und senden die HTTP-Antwort an den API-Aufrufer. Es stehen keine Ausgaben für nachgelagerte Blöcke zur Verfügung.

## Variablenreferenzen

Verwenden Sie die `<variable.name>` Syntax, um Workflow-Variablen dynamisch in Ihre Antwort einzufügen:

```json
{
  "user": {
    "id": "<variable.userId>",
    "name": "<variable.userName>",
    "email": "<variable.userEmail>"
  },
  "query": "<variable.searchQuery>",
  "results": "<variable.searchResults>",
  "totalFound": "<variable.resultCount>",
  "processingTime": "<variable.executionTime>ms"
}
```

<Callout type="warning">
  Variablennamen sind Groß- und Kleinschreibung sensitiv und müssen exakt mit den in Ihrem Workflow verfügbaren Variablen übereinstimmen.
</Callout>

## Best Practices

- **Verwenden Sie aussagekräftige Statuscodes**: Wählen Sie passende HTTP-Statuscodes, die das Ergebnis des Workflows genau widerspiegeln
- **Strukturieren Sie Ihre Antworten einheitlich**: Behalten Sie eine konsistente JSON-Struktur über alle Ihre API-Endpunkte bei, um eine bessere Entwicklererfahrung zu gewährleisten
- **Fügen Sie relevante Metadaten hinzu**: Fügen Sie Zeitstempel und Versionsinformationen hinzu, um bei der Fehlerbehebung und Überwachung zu helfen
- **Behandeln Sie Fehler elegant**: Verwenden Sie bedingte Logik in Ihrem Workflow, um angemessene Fehlerantworten mit aussagekräftigen Meldungen zu setzen
- **Validieren Sie Variablenreferenzen**: Stellen Sie sicher, dass alle referenzierten Variablen existieren und die erwarteten Datentypen enthalten, bevor der Antwortblock ausgeführt wird
```

--------------------------------------------------------------------------------

---[FILE: router.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/router.mdx

```text
---
title: Router
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Router-Block verwendet KI, um Workflows basierend auf Inhaltsanalysen intelligent zu leiten. Im Gegensatz zu Bedingungsblöcken, die einfache Regeln verwenden, verstehen Router Kontext und Absicht.

<div className="flex justify-center">
  <Image
    src="/static/blocks/router.png"
    alt="Router-Block mit mehreren Pfaden"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Router vs. Bedingung

**Verwende Router, wenn:**
- KI-gestützte Inhaltsanalyse benötigt wird
- Mit unstrukturierten oder variierenden Inhalten gearbeitet wird
- Absichtsbasierte Weiterleitung erforderlich ist (z.B. "Support-Tickets an Abteilungen weiterleiten")

**Verwende Bedingung, wenn:**
- Einfache regelbasierte Entscheidungen ausreichen
- Mit strukturierten Daten oder numerischen Vergleichen gearbeitet wird
- Schnelle, deterministische Weiterleitung benötigt wird

## Konfigurationsoptionen

### Inhalt/Prompt

Der Inhalt oder Prompt, den der Router analysieren wird, um Weiterleitungsentscheidungen zu treffen. Dies kann sein:

- Eine direkte Benutzeranfrage oder -eingabe
- Ausgabe eines vorherigen Blocks
- Eine systemgenerierte Nachricht

### Zielblöcke

Die möglichen Zielblöcke, aus denen der Router auswählen kann. Der Router erkennt automatisch verbundene Blöcke, aber du kannst auch:

- Die Beschreibungen von Zielblöcken anpassen, um die Weiterleitungsgenauigkeit zu verbessern
- Weiterleitungskriterien für jeden Zielblock festlegen
- Bestimmte Blöcke von der Berücksichtigung als Weiterleitungsziele ausschließen

### Modellauswahl

Wähle ein KI-Modell für die Weiterleitungsentscheidung:

- **OpenAI**: GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Andere Anbieter**: Groq, Cerebras, xAI, DeepSeek
- **Lokale Modelle**: Ollama oder VLLM-kompatible Modelle

Verwende Modelle mit starken Argumentationsfähigkeiten wie GPT-4o oder Claude 3.7 Sonnet für beste Ergebnisse.

### API-Schlüssel

Ihr API-Schlüssel für den ausgewählten LLM-Anbieter. Dieser wird sicher gespeichert und für die Authentifizierung verwendet.

## Ausgaben

- **`<router.prompt>`**: Zusammenfassung des Routing-Prompts
- **`<router.selected_path>`**: Ausgewählter Zielblock
- **`<router.tokens>`**: Token-Nutzungsstatistiken
- **`<router.cost>`**: Geschätzte Routing-Kosten
- **`<router.model>`**: Für die Entscheidungsfindung verwendetes Modell

## Beispielanwendungsfälle

**Kundensupport-Triage** - Tickets an spezialisierte Abteilungen weiterleiten

```
Input (Ticket) → Router → Agent (Engineering) or Agent (Finance)
```

**Inhaltsklassifizierung** - Nutzergenerierte Inhalte klassifizieren und weiterleiten

```
Input (Feedback) → Router → Workflow (Product) or Workflow (Technical)
```

**Lead-Qualifizierung** - Leads basierend auf Qualifizierungskriterien weiterleiten

```
Input (Lead) → Router → Agent (Enterprise Sales) or Workflow (Self-serve)
```

## Best Practices

- **Klare Zielbeschreibungen bereitstellen**: Helfen Sie dem Router zu verstehen, wann jedes Ziel ausgewählt werden soll, mit spezifischen, detaillierten Beschreibungen
- **Spezifische Routing-Kriterien verwenden**: Definieren Sie klare Bedingungen und Beispiele für jeden Pfad, um die Genauigkeit zu verbessern
- **Fallback-Pfade implementieren**: Verbinden Sie ein Standardziel für Fälle, in denen kein spezifischer Pfad geeignet ist
- **Mit verschiedenen Eingaben testen**: Stellen Sie sicher, dass der Router verschiedene Eingabetypen, Grenzfälle und unerwartete Inhalte verarbeiten kann
- **Routing-Leistung überwachen**: Überprüfen Sie Routing-Entscheidungen regelmäßig und verfeinern Sie Kriterien basierend auf tatsächlichen Nutzungsmustern
- **Geeignete Modelle auswählen**: Verwenden Sie Modelle mit starken Argumentationsfähigkeiten für komplexe Routing-Entscheidungen
```

--------------------------------------------------------------------------------

---[FILE: variables.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/variables.mdx

```text
---
title: Variablen
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

Der Variablen-Block aktualisiert Workflow-Variablen während der Ausführung. Variablen müssen zuerst im Variablen-Bereich deines Workflows initialisiert werden, dann kannst du diesen Block verwenden, um ihre Werte während der Ausführung deines Workflows zu aktualisieren.

<div className="flex justify-center">
  <Image
    src="/static/blocks/variables.png"
    alt="Variablen-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout>
  Greife überall in deinem Workflow auf Variablen zu, indem du die `<variable.variableName>` Syntax verwendest.
</Callout>

## Wie man Variablen verwendet

### 1. Initialisierung in Workflow-Variablen

Erstellen Sie zunächst Ihre Variablen im Variablenbereich des Workflows (zugänglich über die Workflow-Einstellungen):

```
customerEmail = ""
retryCount = 0
currentStatus = "pending"
```

### 2. Aktualisierung mit dem Variablen-Block

Verwenden Sie den Variablen-Block, um diese Werte während der Ausführung zu aktualisieren:

```
customerEmail = <api.email>
retryCount = <variable.retryCount> + 1
currentStatus = "processing"
```

### 3. Überall zugreifen

Referenzieren Sie Variablen in jedem Block:

```
Agent prompt: "Send email to <variable.customerEmail>"
Condition: <variable.retryCount> < 5
API body: {"status": "<variable.currentStatus>"}
```

## Beispielanwendungsfälle

**Schleifenzähler und Status** - Fortschritt durch Iterationen verfolgen

```
Loop → Agent (Process) → Variables (itemsProcessed + 1) → Variables (Store lastResult)
```

**Wiederholungslogik** - API-Wiederholungsversuche verfolgen

```
API (Try) → Variables (retryCount + 1) → Condition (retryCount < 3)
```

**Dynamische Konfiguration** - Benutzerkontext für Workflow speichern

```
API (Fetch Profile) → Variables (userId, userTier) → Agent (Personalize)
```

## Ausgaben

- **`<variables.assignments>`**: JSON-Objekt mit allen Variablenzuweisungen aus diesem Block

## Bewährte Praktiken

- **In Workflow-Einstellungen initialisieren**: Erstellen Sie Variablen immer im Variablenbereich des Workflows, bevor Sie sie verwenden
- **Dynamisch aktualisieren**: Verwenden Sie Variablen-Blöcke, um Werte basierend auf Block-Ausgaben oder Berechnungen zu aktualisieren
- **In Schleifen verwenden**: Perfekt für die Verfolgung des Status über Iterationen hinweg
- **Beschreibend benennen**: Verwenden Sie klare Namen wie `currentIndex`, `totalProcessed` oder `lastError`
```

--------------------------------------------------------------------------------

---[FILE: wait.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/wait.mdx

```text
---
title: Warten
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

Der Warten-Block pausiert deinen Workflow für eine bestimmte Zeit, bevor er mit dem nächsten Block fortfährt. Verwende ihn, um Verzögerungen zwischen Aktionen einzufügen, API-Ratenbegrenzungen einzuhalten oder Operationen zeitlich zu verteilen.

<div className="flex justify-center">
  <Image
    src="/static/blocks/wait.png"
    alt="Warte-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Konfiguration

### Wartezeit

Geben Sie die Dauer für die Ausführungspause ein:
- **Eingabe**: Positive Zahl
- **Maximum**: 600 Sekunden (10 Minuten) oder 10 Minuten

### Einheit

Wählen Sie die Zeiteinheit:
- **Sekunden**: Für kurze, präzise Verzögerungen
- **Minuten**: Für längere Pausen

<Callout type="info">
  Warteblöcke können durch Stoppen des Workflows abgebrochen werden. Die maximale Wartezeit beträgt 10 Minuten.
</Callout>

## Ausgaben

- **`<wait.waitDuration>`**: Die Wartezeit in Millisekunden
- **`<wait.status>`**: Status der Wartezeit ('waiting', 'completed' oder 'cancelled')

## Beispielanwendungsfälle

**API-Ratenbegrenzung** - Bleiben Sie zwischen Anfragen innerhalb der API-Ratenlimits

```
API (Request 1) → Wait (2s) → API (Request 2)
```

**Zeitgesteuerte Benachrichtigungen** - Senden Sie Folgenachrichten nach einer Verzögerung

```
Function (Send Email) → Wait (5min) → Function (Follow-up)
```

**Verarbeitungsverzögerungen** - Warten Sie, bis das externe System die Verarbeitung abgeschlossen hat

```
API (Trigger Job) → Wait (30s) → API (Check Status)
```

## Bewährte Praktiken

- **Halten Sie Wartezeiten angemessen**: Verwenden Sie Wait für Verzögerungen bis zu 10 Minuten. Für längere Verzögerungen sollten Sie geplante Workflows in Betracht ziehen
- **Überwachen Sie die Ausführungszeit**: Denken Sie daran, dass Wartezeiten die Gesamtdauer des Workflows verlängern
```

--------------------------------------------------------------------------------

````
