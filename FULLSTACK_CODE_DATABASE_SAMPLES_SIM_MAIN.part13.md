---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 13
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 13 of 933)

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

---[FILE: workflow.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/workflow.mdx

```text
---
title: Workflow-Block
description: Führe einen anderen Workflow innerhalb des aktuellen Ablaufs aus
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

## Was er macht

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow.png'
    alt='Workflow-Block-Konfiguration'
    width={500}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

Füge einen Workflow-Block hinzu, wenn du einen untergeordneten Workflow als Teil eines größeren Ablaufs aufrufen möchtest. Der Block führt die neueste bereitgestellte Version dieses Workflows aus, wartet auf dessen Abschluss und setzt dann mit dem übergeordneten Workflow fort.

## Konfiguration

1. **Wähle einen Workflow** aus dem Dropdown-Menü (Selbstreferenzen sind blockiert, um Schleifen zu verhindern).
2. **Eingaben zuordnen**: Wenn der untergeordnete Workflow einen Eingabeformular-Trigger hat, siehst du jedes Feld und kannst übergeordnete Variablen verbinden. Die zugeordneten Werte sind das, was der untergeordnete Workflow erhält.

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow-2.png'
    alt='Workflow-Block mit Beispiel für Eingabezuordnung'
    width={700}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

3. **Ausgaben**: Nachdem der untergeordnete Workflow abgeschlossen ist, stellt der Block folgendes bereit:
   - `result` – die endgültige Antwort des untergeordneten Workflows
   - `success` – ob er ohne Fehler ausgeführt wurde
   - `error` – Nachricht, wenn die Ausführung fehlschlägt

## Bereitstellungsstatus-Badge

Der Workflow-Block zeigt ein Bereitstellungsstatus-Badge an, das dir hilft zu verfolgen, ob der untergeordnete Workflow ausführungsbereit ist:

- **Bereitgestellt** – Der untergeordnete Workflow wurde bereitgestellt und ist einsatzbereit. Der Block führt die aktuell bereitgestellte Version aus.
- **Nicht bereitgestellt** – Der untergeordnete Workflow wurde noch nie bereitgestellt. Du musst ihn bereitstellen, bevor der Workflow-Block ihn ausführen kann.
- **Erneut bereitstellen** – Seit der letzten Bereitstellung wurden Änderungen im untergeordneten Workflow erkannt. Klicke auf das Badge, um den untergeordneten Workflow mit den neuesten Änderungen erneut bereitzustellen.

<Callout type="warn">
Der Workflow-Block führt immer die zuletzt bereitgestellte Version des untergeordneten Workflows aus, nicht die Editor-Version. Stelle sicher, dass du nach Änderungen eine erneute Bereitstellung durchführst, damit der Block die neueste Logik verwendet.
</Callout>

## Hinweise zur Ausführung

- Untergeordnete Workflows laufen im gleichen Workspace-Kontext, sodass Umgebungsvariablen und Tools übernommen werden.
- Der Block verwendet Bereitstellungsversionierung: Jede API-, Zeitplan-, Webhook-, manuelle oder Chat-Ausführung ruft den bereitgestellten Snapshot auf. Stelle den untergeordneten Workflow nach Änderungen erneut bereit.
- Wenn der untergeordnete Workflow fehlschlägt, löst der Block einen Fehler aus, es sei denn, du behandelst ihn nachgelagert.

<Callout>
Halte untergeordnete Workflows fokussiert. Kleine, wiederverwendbare Abläufe machen es einfacher, sie zu kombinieren, ohne tiefe Verschachtelungen zu erzeugen.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/de/connections/basics.mdx

```text
---
title: Grundlagen
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Video } from '@/components/ui/video'

## Wie Verbindungen funktionieren

Verbindungen sind die Pfade, die den Datenfluss zwischen Blöcken in Ihrem Workflow ermöglichen. In Sim definieren Verbindungen, wie Informationen von einem Block zum anderen übertragen werden und ermöglichen so den Datenfluss durch Ihren gesamten Workflow.

<Callout type="info">
  Jede Verbindung stellt eine gerichtete Beziehung dar, bei der Daten vom Ausgang eines Quellblocks
  zum Eingang eines Zielblocks fließen.
</Callout>

### Verbindungen erstellen

<Steps>
  <Step>
    <strong>Quellblock auswählen</strong>: Klicken Sie auf den Ausgangsport des Blocks, von dem aus Sie verbinden möchten
  </Step>
  <Step>
    <strong>Verbindung ziehen</strong>: Ziehen Sie zum Eingangsport des Zielblocks
  </Step>
  <Step>
    <strong>Verbindung bestätigen</strong>: Loslassen, um die Verbindung zu erstellen
  </Step>
</Steps>

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="connections-build.mp4" width={700} height={450} />
</div>

### Verbindungsablauf

Der Datenfluss durch Verbindungen folgt diesen Prinzipien:

1. **Gerichteter Fluss**: Daten fließen immer von Ausgängen zu Eingängen
2. **Ausführungsreihenfolge**: Blöcke werden basierend auf ihren Verbindungen der Reihe nach ausgeführt
3. **Datentransformation**: Daten können beim Übergang zwischen Blöcken transformiert werden
4. **Bedingte Pfade**: Einige Blöcke (wie Router und Bedingung) können den Fluss auf verschiedene Pfade leiten

<Callout type="warning">
  Das Löschen einer Verbindung stoppt sofort den Datenfluss zwischen den Blöcken. Stellen Sie sicher, dass dies beabsichtigt ist, bevor Sie Verbindungen entfernen.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: data-structure.mdx]---
Location: sim-main/apps/docs/content/docs/de/connections/data-structure.mdx

```text
---
title: Datenstruktur
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Wenn Sie Blöcke verbinden, ist das Verständnis der Datenstruktur verschiedener Block-Ausgaben wichtig, da die Ausgabedatenstruktur des Quellblocks bestimmt, welche Werte im Zielblock verfügbar sind. Jeder Blocktyp erzeugt eine spezifische Ausgabestruktur, auf die Sie in nachgelagerten Blöcken verweisen können.

<Callout type="info">
  Das Verständnis dieser Datenstrukturen ist wesentlich für die effektive Nutzung von Verbindungs-Tags und
  den Zugriff auf die richtigen Daten in Ihren Workflows.
</Callout>

## Block-Ausgabestrukturen

Verschiedene Blocktypen erzeugen unterschiedliche Ausgabestrukturen. Hier ist, was Sie von jedem Blocktyp erwarten können:

<Tabs items={['Agent Output', 'API Output', 'Function Output', 'Evaluator Output', 'Condition Output', 'Router Output']}>
  <Tab>

    ```json
    {
      "content": "The generated text response",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "toolCalls": [...],
      "cost": [...],
      "usage": [...]
    }
    ```

    ### Ausgabefelder des Agent-Blocks

    - **content**: Die vom Agenten generierte Haupttextantwort
    - **model**: Das verwendete KI-Modell (z.B. "gpt-4o", "claude-3-opus")
    - **tokens**: Token-Nutzungsstatistiken
      - **prompt**: Anzahl der Token in der Eingabeaufforderung
      - **completion**: Anzahl der Token in der Vervollständigung
      - **total**: Insgesamt verwendete Token
    - **toolCalls**: Array von Werkzeugaufrufen des Agenten (falls vorhanden)
    - **cost**: Array von Kostenobjekten für jeden Werkzeugaufruf (falls vorhanden)
    - **usage**: Token-Nutzungsstatistiken für die gesamte Antwort

  </Tab>
  <Tab>

    ```json
    {
      "data": "Response data",
      "status": 200,
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      }
    }
    ```

    ### Ausgabefelder des API-Blocks

    - **data**: Die Antwortdaten von der API (kann jeden Typ haben)
    - **status**: HTTP-Statuscode der Antwort
    - **headers**: Von der API zurückgegebene HTTP-Header

  </Tab>
  <Tab>

    ```json
    {
      "result": "Function return value",
      "stdout": "Console output",
    }
    ```

    ### Ausgabefelder des Funktionsblocks

    - **result**: Der Rückgabewert der Funktion (kann jeden Typ haben)
    - **stdout**: Während der Funktionsausführung erfasste Konsolenausgabe

  </Tab>
  <Tab>

    ```json
    {
      "content": "Evaluation summary",
      "model": "gpt-5",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "metric1": 8.5,
      "metric2": 7.2,
      "metric3": 9.0
    }
    ```

    ### Ausgabefelder des Evaluator-Blocks

    - **content**: Zusammenfassung der Auswertung
    - **model**: Das für die Auswertung verwendete KI-Modell
    - **tokens**: Statistiken zur Token-Nutzung
    - **[metricName]**: Bewertung für jede im Evaluator definierte Metrik (dynamische Felder)

  </Tab>
  <Tab>

    ```json
    {
      "conditionResult": true,
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Follow-up Agent"
      },
      "selectedOption": "condition-1"
    }
    ```

    ### Ausgabefelder des Condition-Blocks

    - **conditionResult**: Boolesches Ergebnis der Bedingungsauswertung
    - **selectedPath**: Informationen über den ausgewählten Pfad
      - **blockId**: ID des nächsten Blocks im ausgewählten Pfad
      - **blockType**: Typ des nächsten Blocks
      - **blockTitle**: Titel des nächsten Blocks
    - **selectedOption**: ID der ausgewählten Bedingung

  </Tab>
  <Tab>

    ```json
    {
      "content": "Routing decision",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Customer Service Agent"
      }
    }
    ```

    ### Ausgabefelder des Router-Blocks

    - **content**: Der Routing-Entscheidungstext
    - **model**: Das für das Routing verwendete KI-Modell
    - **tokens**: Statistiken zur Token-Nutzung
    - **selectedPath**: Informationen über den ausgewählten Pfad
      - **blockId**: ID des ausgewählten Zielblocks
      - **blockType**: Typ des ausgewählten Blocks
      - **blockTitle**: Titel des ausgewählten Blocks

  </Tab>
</Tabs>

## Benutzerdefinierte Ausgabestrukturen

Einige Blöcke können basierend auf ihrer Konfiguration benutzerdefinierte Ausgabestrukturen erzeugen:

1. **Agent-Blöcke mit Antwortformat**: Bei Verwendung eines Antwortformats in einem Agent-Block entspricht die Ausgabestruktur dem definierten Schema anstelle der Standardstruktur.

2. **Function-Blöcke**: Das Feld `result` kann jede Datenstruktur enthalten, die von Ihrem Funktionscode zurückgegeben wird.

3. **API-Blöcke**: Das Feld `data` enthält die Rückgabe der API, die jede gültige JSON-Struktur sein kann.

<Callout type="warning">
  Überprüfen Sie während der Entwicklung immer die tatsächliche Ausgabestruktur Ihrer Blöcke, um sicherzustellen, dass Sie in Ihren Verbindungen auf die richtigen Felder verweisen.
</Callout>

## Verschachtelte Datenstrukturen

Viele Block-Ausgaben enthalten verschachtelte Datenstrukturen. Du kannst auf diese mit Punktnotation in Verbindungs-Tags zugreifen:

```
<blockName.path.to.nested.data>
```

Zum Beispiel:

- `<agent1.tokens.total>` - Greife auf die Gesamtzahl der Tokens aus einem Agent-Block zu
- `<api1.data.results[0].id>` - Greife auf die ID des ersten Ergebnisses einer API-Antwort zu
- `<function1.result.calculations.total>` - Greife auf ein verschachteltes Feld im Ergebnis eines Funktionsblocks zu
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/connections/index.mdx

```text
---
title: Übersicht
description: Verbinde deine Blöcke miteinander.
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { ConnectIcon } from '@/components/icons'
import { Video } from '@/components/ui/video'

Verbindungen sind die Pfade, die den Datenfluss zwischen Blöcken in deinem Workflow ermöglichen. Sie definieren, wie Informationen von einem Block zum anderen weitergegeben werden und ermöglichen dir, komplexe, mehrstufige Prozesse zu erstellen.

<Callout type="info">
  Richtig konfigurierte Verbindungen sind entscheidend für die Erstellung effektiver Workflows. Sie bestimmen, wie
  Daten durch dein System fließen und wie Blöcke miteinander interagieren.
</Callout>

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

## Verbindungstypen

Sim unterstützt verschiedene Arten von Verbindungen, die verschiedene Workflow-Muster ermöglichen:

<Cards>
  <Card title="Grundlagen der Verbindungen" href="/connections/basics">
    Lerne, wie Verbindungen funktionieren und wie du sie in deinen Workflows erstellst
  </Card>
  <Card title="Verbindungs-Tags" href="/connections/tags">
    Verstehe, wie du Verbindungs-Tags verwendest, um auf Daten zwischen Blöcken zu verweisen
  </Card>
  <Card title="Datenstruktur" href="/connections/data-structure">
    Erkunde die Ausgabedatenstrukturen verschiedener Blocktypen
  </Card>
  <Card title="Datenzugriff" href="/connections/accessing-data">
    Lerne Techniken für den Zugriff und die Manipulation verbundener Daten
  </Card>
  <Card title="Best Practices" href="/connections/best-practices">
    Folge empfohlenen Mustern für effektives Verbindungsmanagement
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/de/connections/tags.mdx

```text
---
title: Tags
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Video } from '@/components/ui/video'

Verbindungs-Tags sind visuelle Darstellungen der verfügbaren Daten aus verbundenen Blöcken und bieten eine einfache Möglichkeit, auf Daten zwischen Blöcken und Ausgaben aus vorherigen Blöcken in Ihrem Workflow zu verweisen.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

### Was sind Verbindungs-Tags?

Verbindungs-Tags sind interaktive Elemente, die erscheinen, wenn Blöcke verbunden werden. Sie repräsentieren die Daten, die von einem Block zum anderen fließen können und ermöglichen es Ihnen:

- Verfügbare Daten aus Quellblöcken zu visualisieren
- Auf bestimmte Datenfelder in Zielblöcken zu verweisen
- Dynamische Datenflüsse zwischen Blöcken zu erstellen

<Callout type="info">
  Verbindungs-Tags machen es einfach zu sehen, welche Daten aus vorherigen Blöcken verfügbar sind und diese in Ihrem
  aktuellen Block zu verwenden, ohne sich komplexe Datenstrukturen merken zu müssen.
</Callout>

## Verwendung von Verbindungs-Tags

Es gibt zwei Hauptmethoden, um Verbindungs-Tags in Ihren Workflows zu verwenden:

<div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">Drag and Drop</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Klicken Sie auf einen Verbindungs-Tag und ziehen Sie ihn in Eingabefelder von Zielblöcken. Ein Dropdown-Menü wird
      angezeigt, das verfügbare Werte zeigt.
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>Fahren Sie mit dem Mauszeiger über einen Verbindungs-Tag, um verfügbare Daten zu sehen</li>
      <li>Klicken und ziehen Sie den Tag in ein Eingabefeld</li>
      <li>Wählen Sie das spezifische Datenfeld aus dem Dropdown-Menü</li>
      <li>Die Referenz wird automatisch eingefügt</li>
    </ol>
  </div>

  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">Spitze-Klammer-Syntax</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Geben Sie <code>&lt;&gt;</code> in Eingabefeldern ein, um ein Dropdown-Menü mit verfügbaren Verbindungswerten
      aus vorherigen Blöcken zu sehen.
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>Klicken Sie in ein beliebiges Eingabefeld, in dem Sie verbundene Daten verwenden möchten</li>
      <li>
        Geben Sie <code>&lt;&gt;</code> ein, um das Verbindungs-Dropdown-Menü aufzurufen
      </li>
      <li>Durchsuchen und wählen Sie die Daten aus, auf die Sie verweisen möchten</li>
      <li>Tippen Sie weiter oder wählen Sie aus dem Dropdown-Menü, um die Referenz zu vervollständigen</li>
    </ol>
  </div>
</div>

## Tag-Syntax

Verbindungs-Tags verwenden eine einfache Syntax, um auf Daten zu verweisen:

```
<blockName.path.to.data>
```

Wobei:

- `blockName` ist der Name des Quellblocks
- `path.to.data` ist der Pfad zum spezifischen Datenfeld

Zum Beispiel:

- `<agent1.content>` - Verweist auf das Inhaltsfeld eines Blocks mit der ID "agent1"
- `<api2.data.users[0].name>` - Verweist auf den Namen des ersten Benutzers im Benutzer-Array aus dem Datenfeld eines Blocks mit der ID "api2"

## Dynamische Tag-Referenzen

Verbindungs-Tags werden zur Laufzeit ausgewertet, was bedeutet:

1. Sie verweisen immer auf die aktuellsten Daten
2. Sie können in Ausdrücken verwendet und mit statischem Text kombiniert werden
3. Sie können in andere Datenstrukturen eingebettet werden

### Beispiele

```javascript
// Reference in text
"The user's name is <userBlock.name>"

// Reference in JSON
{
  "userName": "<userBlock.name>",
  "orderTotal": <apiBlock.data.total>
}

// Reference in code
const greeting = "Hello, <userBlock.name>!";
const total = <apiBlock.data.total> * 1.1; // Add 10% tax
```

<Callout type="warning">
  Wenn Sie Verbindungs-Tags in numerischen Kontexten verwenden, stellen Sie sicher, dass die referenzierten Daten tatsächlich eine Zahl sind,
  um Typkonvertierungsprobleme zu vermeiden.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/copilot/index.mdx

```text
---
title: Copilot
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'
import { MessageCircle, Package, Zap, Infinity as InfinityIcon, Brain, BrainCircuit } from 'lucide-react'

Copilot ist dein Assistent im Editor, der dir hilft, Workflows mit Sim Copilot zu erstellen und zu bearbeiten sowie diese zu verstehen und zu verbessern. Er kann:

- **Erklären**: Beantwortet Fragen zu Sim und deinem aktuellen Workflow
- **Anleiten**: Schlägt Bearbeitungen und Best Practices vor
- **Bearbeiten**: Nimmt Änderungen an Blöcken, Verbindungen und Einstellungen vor, wenn du zustimmst

<Callout type="info">
  Copilot ist ein von Sim verwalteter Dienst. Für selbst gehostete Installationen generiere einen Copilot API-Schlüssel in der gehosteten App (sim.ai → Einstellungen → Copilot)
  1. Gehe zu [sim.ai](https://sim.ai) → Einstellungen → Copilot und generiere einen Copilot API-Schlüssel
  2. Setze `COPILOT_API_KEY` in deiner selbst gehosteten Umgebung auf diesen Wert
</Callout>

## Kontextmenü (@)

Verwende das `@` Symbol, um auf verschiedene Ressourcen zu verweisen und Copilot mehr Kontext über deinen Arbeitsbereich zu geben:

<Image
  src="/static/copilot/copilot-menu.png"
  alt="Copilot-Kontextmenü mit verfügbaren Referenzoptionen"
  width={600}
  height={400}
/>

Das `@` Menü bietet Zugriff auf:
- **Chats**: Verweise auf vorherige Copilot-Gespräche
- **Alle Workflows**: Verweise auf beliebige Workflows in deinem Arbeitsbereich
- **Workflow-Blöcke**: Verweise auf bestimmte Blöcke aus Workflows
- **Blöcke**: Verweise auf Blocktypen und Vorlagen
- **Wissen**: Verweise auf deine hochgeladenen Dokumente und Wissensdatenbank
- **Dokumentation**: Verweise auf Sim-Dokumentation
- **Vorlagen**: Verweise auf Workflow-Vorlagen
- **Logs**: Verweise auf Ausführungsprotokolle und Ergebnisse

Diese kontextbezogenen Informationen helfen Copilot, genauere und relevantere Unterstützung für deinen spezifischen Anwendungsfall zu bieten.

## Modi

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        Fragen
      </span>
    }
  >
    <div className="m-0 text-sm">
      Frage-Antwort-Modus für Erklärungen, Anleitungen und Vorschläge ohne Änderungen an deinem Workflow vorzunehmen.
    </div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        Agent
      </span>
    }
  >
    <div className="m-0 text-sm">
      Erstellen-und-Bearbeiten-Modus. Copilot schlägt spezifische Änderungen vor (Blöcke hinzufügen, Variablen verbinden, Einstellungen anpassen) und wendet sie an, wenn du zustimmst.
    </div>
  </Card>
</Cards>

<div className="flex justify-center">
  <Image
    src="/static/copilot/copilot-mode.png"
    alt="Copilot-Modusauswahl-Oberfläche"
    width={600}
    height={400}
    className="my-6"
  />
</div>

## Tiefenebenen

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Zap className="h-4 w-4 text-muted-foreground" />
        Schnell
      </span>
    }
  >
    <div className="m-0 text-sm">Am schnellsten und günstigsten. Ideal für kleine Änderungen, einfache Arbeitsabläufe und geringfügige Anpassungen.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <InfinityIcon className="h-4 w-4 text-muted-foreground" />
        Auto
      </span>
    }
  >
    <div className="m-0 text-sm">Ausgewogene Geschwindigkeit und Denkleistung. Empfohlene Standardeinstellung für die meisten Aufgaben.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Brain className="h-4 w-4 text-muted-foreground" />
        Erweitert
      </span>
    }
  >
    <div className="m-0 text-sm">Mehr Denkleistung für umfangreichere Arbeitsabläufe und komplexe Änderungen bei gleichzeitiger Leistungsfähigkeit.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
        Behemoth
      </span>
    }
  >
    <div className="m-0 text-sm">Maximale Denkleistung für tiefgreifende Planung, Fehlerbehebung und komplexe architektonische Änderungen.</div>
  </Card>
</Cards>

### Modusauswahl-Oberfläche

Du kannst einfach zwischen verschiedenen Denkmodi über die Modusauswahl in der Copilot-Oberfläche wechseln:

<Image
  src="/static/copilot/copilot-models.png"
  alt="Copilot-Modusauswahl zeigt den erweiterten Modus mit MAX-Umschalter"
  width={600}
  height={300}
/>

Die Oberfläche ermöglicht dir:
- **Denkebene auswählen**: Wähle zwischen Schnell, Auto, Erweitert oder Behemoth
- **MAX-Modus aktivieren**: Umschalten für maximale Denkfähigkeiten, wenn du die gründlichste Analyse benötigst
- **Modusbeschreibungen anzeigen**: Verstehe, wofür jeder Modus optimiert ist

Wähle deinen Modus basierend auf der Komplexität deiner Aufgabe - verwende Schnell für einfache Fragen und Behemoth für komplexe architektonische Änderungen.

## Abrechnung und Kostenberechnung

### Wie Kosten berechnet werden

Die Copilot-Nutzung wird pro Token vom zugrundeliegenden LLM abgerechnet:

- **Eingabe-Tokens**: werden zum Basispreis des Anbieters berechnet (**zum Selbstkostenpreis**)
- **Ausgabe-Tokens**: werden mit dem **1,5-fachen** des Basis-Ausgabepreises des Anbieters berechnet

```javascript
copilotCost = (inputTokens × inputPrice + outputTokens × (outputPrice × 1.5)) / 1,000,000
```

| Komponente | Angewendeter Tarif    |
|------------|------------------------|
| Eingabe    | inputPrice             |
| Ausgabe    | outputPrice × 1,5      |

<Callout type="warning">
  Die angezeigten Preise spiegeln die Tarife vom 4. September 2025 wider. Überprüfen Sie die Anbieter-Dokumentation für aktuelle Preise.
</Callout>

<Callout type="info">
  Modellpreise werden pro Million Tokens angegeben. Die Berechnung teilt durch 1.000.000, um die tatsächlichen Kosten zu ermitteln. Siehe <a href="/execution/costs">die Seite zur Kostenberechnung</a> für Hintergründe und Beispiele.
</Callout>
```

--------------------------------------------------------------------------------

````
