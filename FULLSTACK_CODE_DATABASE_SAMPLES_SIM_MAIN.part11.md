---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 11
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 11 of 933)

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

---[FILE: search-trigger.tsx]---
Location: sim-main/apps/docs/components/ui/search-trigger.tsx

```typescript
'use client'

import { Search } from 'lucide-react'

export function SearchTrigger() {
  const handleClick = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  return (
    <button
      type='button'
      className='flex h-10 w-[460px] cursor-pointer items-center gap-2 rounded-xl border border-border/50 px-3 py-2 text-sm backdrop-blur-xl transition-colors hover:border-border'
      style={{
        backgroundColor: 'hsla(0, 0%, 5%, 0.85)',
        backdropFilter: 'blur(33px) saturate(180%)',
        WebkitBackdropFilter: 'blur(33px) saturate(180%)',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
      onClick={handleClick}
    >
      <Search className='h-4 w-4' />
      <span>Search...</span>
      <kbd
        className='ml-auto flex items-center gap-0.5 font-medium'
        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
      >
        <span style={{ fontSize: '15px', lineHeight: '1' }}>⌘</span>
        <span style={{ fontSize: '13px', lineHeight: '1' }}>K</span>
      </kbd>
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: theme-toggle.tsx]---
Location: sim-main/apps/docs/components/ui/theme-toggle.tsx
Signals: React

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className='flex cursor-pointer items-center justify-center rounded-md p-1 text-muted-foreground'>
        <Moon className='h-4 w-4' />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='flex cursor-pointer items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground'
      aria-label='Toggle theme'
    >
      {theme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: video.tsx]---
Location: sim-main/apps/docs/components/ui/video.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import { getAssetUrl } from '@/lib/utils'
import { Lightbox } from './lightbox'

interface VideoProps {
  src: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  enableLightbox?: boolean
}

export function Video({
  src,
  className = 'w-full rounded-xl border border-border shadow-sm overflow-hidden outline-none focus:outline-none',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  enableLightbox = true,
}: VideoProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleVideoClick = () => {
    if (enableLightbox) {
      setIsLightboxOpen(true)
    }
  }

  return (
    <>
      <video
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        className={`${className} ${enableLightbox ? 'cursor-pointer transition-opacity hover:opacity-90' : ''}`}
        src={getAssetUrl(src)}
        onClick={handleVideoClick}
      />

      {enableLightbox && (
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          src={src}
          alt={`Video: ${src}`}
          type='video'
        />
      )}
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/index.mdx

```text
---
title: Dokumentation
---

import { Card, Cards } from 'fumadocs-ui/components/card'

# Sim Dokumentation

Willkommen bei Sim, einem visuellen Workflow-Builder für KI-Anwendungen. Erstellen Sie leistungsstarke KI-Agenten, Automatisierungs-Workflows und Datenverarbeitungs-Pipelines, indem Sie Blöcke auf einer Leinwand verbinden.

## Schnellstart

<Cards>
  <Card title="Einführung" href="/introduction">
    Erfahren Sie, was Sie mit Sim erstellen können
  </Card>
  <Card title="Erste Schritte" href="/getting-started">
    Erstellen Sie Ihren ersten Workflow in 10 Minuten
  </Card>
  <Card title="Workflow-Blöcke" href="/blocks">
    Lernen Sie die Bausteine kennen
  </Card>
  <Card title="Tools & Integrationen" href="/tools">
    Entdecken Sie über 80 integrierte Schnittstellen
  </Card>
</Cards>

## Kernkonzepte

<Cards>
  <Card title="Verbindungen" href="/connections">
    Verstehen Sie, wie Daten zwischen Blöcken fließen
  </Card>
  <Card title="Variablen" href="/variables">
    Arbeiten Sie mit Workflow- und Umgebungsvariablen
  </Card>
  <Card title="Ausführung" href="/execution">
    Überwachen Sie Workflow-Ausführungen und verwalten Sie Kosten
  </Card>
  <Card title="Trigger" href="/triggers">
    Starten Sie Workflows über API, Webhooks oder Zeitpläne
  </Card>
</Cards>

## Erweiterte Funktionen

<Cards>
  <Card title="Team-Management" href="/permissions/roles-and-permissions">
    Workspace-Rollen und Berechtigungen einrichten
  </Card>
  <Card title="MCP-Integration" href="/mcp">
    Externe Dienste mit dem Model Context Protocol verbinden
  </Card>
  <Card title="SDKs" href="/sdks">
    Sim in Ihre Anwendungen integrieren
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: agent.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/agent.mdx

```text
---
title: Agent
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Agent-Block verbindet deinen Workflow mit Large Language Models (LLMs). Er verarbeitet natürlichsprachliche Eingaben, ruft externe Tools auf und generiert strukturierte oder unstrukturierte Ausgaben.

<div className="flex justify-center">
  <Image
    src="/static/blocks/agent.png"
    alt="Agent-Block-Konfiguration"
    width={500}
    height={400}
    className="my-6"
  />
</div> 

## Konfigurationsoptionen

### System-Prompt

Der System-Prompt legt die Betriebsparameter und Verhaltenseinschränkungen des Agenten fest. Diese Konfiguration definiert die Rolle des Agenten, die Antwortmethodik und die Verarbeitungsgrenzen für alle eingehenden Anfragen.

```markdown
You are a helpful assistant that specializes in financial analysis.
Always provide clear explanations and cite sources when possible.
When responding to questions about investments, include risk disclaimers.
```

### Benutzer-Prompt

Der Benutzer-Prompt stellt die primären Eingabedaten für die Inferenzverarbeitung dar. Dieser Parameter akzeptiert natürlichsprachlichen Text oder strukturierte Daten, die der Agent analysieren und auf die er reagieren wird. Zu den Eingabequellen gehören:

- **Statische Konfiguration**: Direkte Texteingabe, die in der Block-Konfiguration angegeben ist
- **Dynamische Eingabe**: Daten, die von vorgelagerten Blöcken über Verbindungsschnittstellen übergeben werden
- **Laufzeitgenerierung**: Programmatisch generierte Inhalte während der Workflow-Ausführung

### Modellauswahl

Der Agent-Block unterstützt mehrere LLM-Anbieter über eine einheitliche Inferenzschnittstelle. Verfügbare Modelle umfassen:

- **OpenAI**: GPT-5.1, GPT-5, GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 4.5 Sonnet, Claude Opus 4.1
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Andere Anbieter**: Groq, Cerebras, xAI, Azure OpenAI, OpenRouter
- **Lokale Modelle**: Ollama oder VLLM-kompatible Modelle

### Temperatur

Steuert die Zufälligkeit und Kreativität der Antworten:

- **Niedrig (0-0,3)**: Deterministisch und fokussiert. Am besten für faktische Aufgaben und Genauigkeit.
- **Mittel (0,3-0,7)**: Ausgewogene Kreativität und Fokus. Gut für allgemeine Verwendung.
- **Hoch (0,7-2,0)**: Kreativ und abwechslungsreich. Ideal für Brainstorming und Content-Generierung.

### API-Schlüssel

Ihr API-Schlüssel für den ausgewählten LLM-Anbieter. Dieser wird sicher gespeichert und für die Authentifizierung verwendet.

### Tools

Erweitern Sie die Fähigkeiten des Agenten mit externen Integrationen. Wählen Sie aus über 60 vorgefertigten Tools oder definieren Sie benutzerdefinierte Funktionen.

**Verfügbare Kategorien:**
- **Kommunikation**: Gmail, Slack, Telegram, WhatsApp, Microsoft Teams
- **Datenquellen**: Notion, Google Sheets, Airtable, Supabase, Pinecone
- **Webdienste**: Firecrawl, Google Search, Exa AI, Browser-Automatisierung
- **Entwicklung**: GitHub, Jira, Linear
- **KI-Dienste**: OpenAI, Perplexity, Hugging Face, ElevenLabs

**Ausführungsmodi:**
- **Auto**: Modell entscheidet kontextbasiert, wann Tools verwendet werden
- **Erforderlich**: Tool muss bei jeder Anfrage aufgerufen werden
- **Keine**: Tool verfügbar, aber dem Modell nicht vorgeschlagen

### Antwortformat

Der Parameter für das Antwortformat erzwingt die Generierung strukturierter Ausgaben durch JSON-Schema-Validierung. Dies gewährleistet konsistente, maschinenlesbare Antworten, die vordefinierten Datenstrukturen entsprechen:

```json
{
  "type": "object",
  "properties": {
    "sentiment": {
      "type": "string",
      "enum": ["positive", "neutral", "negative"]
    },
    "summary": {
      "type": "string",
      "description": "Brief summary of the content"
    }
  },
  "required": ["sentiment", "summary"]
}
```

Diese Konfiguration beschränkt die Ausgabe des Modells auf die Einhaltung des angegebenen Schemas, verhindert Freitextantworten und stellt die Generierung strukturierter Daten sicher.

### Zugriff auf Ergebnisse

Nach Abschluss eines Agenten können Sie auf seine Ausgaben zugreifen:

- **response**: Der Antworttext oder die strukturierten Daten des Agenten
- **usage**: Token-Nutzungsstatistiken (Prompt, Completion, Gesamt)
- **toolExecutions**: Details zu allen Tools, die der Agent während der Ausführung verwendet hat
- **estimatedCost**: Geschätzte Kosten des API-Aufrufs (falls verfügbar)

## Erweiterte Funktionen

### Memory + Agent: Gesprächsverlauf

Verwenden Sie einen memory Block mit einer konsistenten memoryId (zum Beispiel, conversationHistory), um Nachrichten zwischen Durchläufen zu speichern und diesen Verlauf in den Prompt des Agenten einzubeziehen.

- Fügen Sie die Nachricht des Benutzers vor dem Agenten hinzu
- Lesen Sie den Gesprächsverlauf für den Kontext
- Hängen Sie die Antwort des Agenten nach dessen Ausführung an

Siehe den [`Memory`](/tools/memory) Blockverweis für Details.

## Ausgaben

- **`<agent.content>`**: Antworttext des Agenten
- **`<agent.tokens>`**: Token-Nutzungsstatistiken
- **`<agent.tool_calls>`**: Details zur Tool-Ausführung
- **`<agent.cost>`**: Geschätzte Kosten des API-Aufrufs

## Beispielanwendungsfälle

**Automatisierung des Kundenservice** - Bearbeitung von Anfragen mit Datenbank- und Tool-Zugriff

```
API (Ticket) → Agent (Postgres, KB, Linear) → Gmail (Reply) → Memory (Save)
```

**Multi-Modell-Inhaltsanalyse** - Analyse von Inhalten mit verschiedenen KI-Modellen

```
Function (Process) → Agent (GPT-4o Technical) → Agent (Claude Sentiment) → Function (Report)
```

**Tool-gestützter Rechercheassistent** - Recherche mit Websuche und Dokumentenzugriff

```
Input → Agent (Google Search, Notion) → Function (Compile Report)
```

## Bewährte Praktiken

- **Sei spezifisch in System-Prompts**: Definiere die Rolle, den Ton und die Einschränkungen des Agenten klar. Je spezifischer deine Anweisungen sind, desto besser kann der Agent seinen vorgesehenen Zweck erfüllen.
- **Wähle die richtige Temperatureinstellung**: Verwende niedrigere Temperatureinstellungen (0-0,3), wenn Genauigkeit wichtig ist, oder erhöhe die Temperatur (0,7-2,0) für kreativere oder vielfältigere Antworten
- **Nutze Tools effektiv**: Integriere Tools, die den Zweck des Agenten ergänzen und seine Fähigkeiten erweitern. Sei selektiv bei der Auswahl der Tools, um den Agenten nicht zu überfordern. Für Aufgaben mit wenig Überschneidung verwende einen anderen Agent-Block für die besten Ergebnisse.
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/api.mdx

```text
---
title: API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der API-Block verbindet Ihren Workflow mit externen Diensten durch HTTP-Anfragen. Unterstützt GET, POST, PUT, DELETE und PATCH Methoden für die Interaktion mit REST-APIs.

<div className="flex justify-center">
  <Image
    src="/static/blocks/api.png"
    alt="API-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Konfigurationsoptionen

### URL

Die Endpunkt-URL für die API-Anfrage. Diese kann sein:

- Eine statische URL, die direkt im Block eingegeben wird
- Eine dynamische URL, die mit der Ausgabe eines anderen Blocks verbunden ist
- Eine URL mit Pfadparametern

### Methode

Wählen Sie die HTTP-Methode für Ihre Anfrage:

- **GET**: Daten vom Server abrufen
- **POST**: Daten an den Server senden, um eine Ressource zu erstellen
- **PUT**: Eine bestehende Ressource auf dem Server aktualisieren
- **DELETE**: Eine Ressource vom Server entfernen
- **PATCH**: Eine bestehende Ressource teilweise aktualisieren

### Abfrageparameter

Definieren Sie Schlüssel-Wert-Paare, die als Abfrageparameter an die URL angehängt werden. Zum Beispiel:

```
Key: apiKey
Value: your_api_key_here

Key: limit
Value: 10
```

Diese würden der URL als `?apiKey=your_api_key_here&limit=10` hinzugefügt.

### Header

Konfigurieren Sie HTTP-Header für Ihre Anfrage. Häufige Header sind:

```
Key: Content-Type
Value: application/json

Key: Authorization
Value: Bearer your_token_here
```

### Anfragekörper

Für Methoden, die einen Anfragekörper unterstützen (POST, PUT, PATCH), können Sie die zu sendenden Daten definieren. Der Körper kann sein:

- JSON-Daten, die direkt im Block eingegeben werden
- Daten, die mit der Ausgabe eines anderen Blocks verbunden sind
- Dynamisch während der Workflow-Ausführung generiert

### Zugriff auf Ergebnisse

Nach Abschluss einer API-Anfrage können Sie auf folgende Ausgaben zugreifen:

- **`<api.data>`**: Die Antwortdaten vom API
- **`<api.status>`**: HTTP-Statuscode (200, 404, 500, usw.)
- **`<api.headers>`**: Antwort-Header vom Server
- **`<api.error>`**: Fehlerdetails, falls die Anfrage fehlgeschlagen ist

## Erweiterte Funktionen

### Dynamische URL-Konstruktion

Erstellen Sie URLs dynamisch mit Variablen aus vorherigen Blöcken:

```javascript
// In a Function block before the API
const userId = <start.userId>;
const apiUrl = `https://api.example.com/users/${userId}/profile`;
```

### Anfrage-Wiederholungen

Der API-Block verarbeitet automatisch:
- Netzwerk-Timeouts mit exponentiellem Backoff
- Antworten bei Ratenbegrenzung (429-Statuscodes)
- Serverfehler (5xx-Statuscodes) mit Wiederholungslogik
- Verbindungsfehler mit Wiederverbindungsversuchen

### Antwortvalidierung

Validieren Sie API-Antworten vor der Verarbeitung:

```javascript
// In a Function block after the API
if (<api.status> === 200) {
  const data = <api.data>;
  // Process successful response
} else {
  // Handle error response
  console.error(`API Error: ${<api.status>}`);
}
```

## Ausgaben

- **`<api.data>`**: Antwortdaten vom API
- **`<api.status>`**: HTTP-Statuscode
- **`<api.headers>`**: Antwort-Header
- **`<api.error>`**: Fehlerdetails bei fehlgeschlagener Anfrage

## Anwendungsbeispiele

**Benutzerprofildaten abrufen** - Benutzerinformationen von externem Dienst abrufen

```
Function (Build ID) → API (GET /users/{id}) → Function (Format) → Response
```

**Zahlungsabwicklung** - Zahlung über die Stripe-API verarbeiten

```
Function (Validate) → API (Stripe) → Condition (Success) → Supabase (Update)
```

## Bewährte Praktiken

- **Umgebungsvariablen für sensible Daten verwenden**: Keine API-Schlüssel oder Anmeldedaten im Code festlegen
- **Fehler elegant behandeln**: Fehlerbehandlungslogik für fehlgeschlagene Anfragen einbinden
- **Antworten validieren**: Statuscode und Antwortformate vor der Datenverarbeitung prüfen
- **Ratenbegrenzungen respektieren**: Achten Sie auf API-Ratenbegrenzungen und implementieren Sie angemessene Drosselung
```

--------------------------------------------------------------------------------

---[FILE: condition.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/condition.mdx

```text
---
title: Bedingung
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Bedingungsblock verzweigt die Workflow-Ausführung basierend auf booleschen Ausdrücken. Bewerten Sie Bedingungen anhand vorheriger Block-Ausgaben und leiten Sie zu verschiedenen Pfaden weiter, ohne dass ein LLM erforderlich ist.

<div className="flex justify-center">
  <Image
    src="/static/blocks/condition.png"
    alt="Bedingungsblock"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Konfigurationsoptionen

### Bedingungen

Definieren Sie eine oder mehrere Bedingungen, die ausgewertet werden. Jede Bedingung umfasst:

- **Ausdruck**: Ein JavaScript/TypeScript-Ausdruck, der zu wahr oder falsch ausgewertet wird
- **Pfad**: Der Zielblock, zu dem weitergeleitet werden soll, wenn die Bedingung wahr ist
- **Beschreibung**: Optionale Erklärung, was die Bedingung prüft

Sie können mehrere Bedingungen erstellen, die der Reihe nach ausgewertet werden, wobei die erste übereinstimmende Bedingung den Ausführungspfad bestimmt.

### Format für Bedingungsausdrücke

Bedingungen verwenden JavaScript-Syntax und können auf Eingabewerte aus vorherigen Blöcken verweisen.

<Tabs items={['Schwellenwert', 'Textanalyse', 'Mehrere Bedingungen']}>
  <Tab>

    ```javascript
    // Check if a score is above a threshold
    <agent.score> > 75
    ```

  </Tab>
  <Tab>

    ```javascript
    // Check if a text contains specific keywords
    <agent.text>.includes('urgent') || <agent.text>.includes('emergency')
    ```

  </Tab>
  <Tab>

    ```javascript
    // Check multiple conditions
    <agent.age> >= 18 && <agent.country> === 'US'
    ```

  </Tab>
</Tabs>

### Zugriff auf Ergebnisse

Nach der Auswertung einer Bedingung können Sie auf folgende Ausgaben zugreifen:

- **condition.result**: Boolesches Ergebnis der Bedingungsauswertung
- **condition.matched_condition**: ID der übereinstimmenden Bedingung
- **condition.content**: Beschreibung des Auswertungsergebnisses
- **condition.path**: Details zum gewählten Routing-Ziel

## Erweiterte Funktionen

### Komplexe Ausdrücke

Verwenden Sie JavaScript-Operatoren und -Funktionen in Bedingungen:

```javascript
// String operations
<user.email>.endsWith('@company.com')

// Array operations
<api.tags>.includes('urgent')

// Mathematical operations
<agent.confidence> * 100 > 85

// Date comparisons
new Date(<api.created_at>) > new Date('2024-01-01')
```

### Auswertung mehrerer Bedingungen

Bedingungen werden der Reihe nach ausgewertet, bis eine übereinstimmt:

```javascript
// Condition 1: Check for high priority
<ticket.priority> === 'high'

// Condition 2: Check for urgent keywords
<ticket.subject>.toLowerCase().includes('urgent')

// Condition 3: Default fallback
true
```

### Fehlerbehandlung

Bedingungen behandeln automatisch:
- Undefinierte oder Null-Werte mit sicherer Auswertung
- Typabweichungen mit geeigneten Fallbacks
- Ungültige Ausdrücke mit Fehlerprotokollierung
- Fehlende Variablen mit Standardwerten

## Ausgaben

- **`<condition.result>`**: Boolesches Ergebnis der Auswertung
- **`<condition.matched_condition>`**: ID der übereinstimmenden Bedingung
- **`<condition.content>`**: Beschreibung des Auswertungsergebnisses
- **`<condition.path>`**: Details zum gewählten Routing-Ziel

## Beispielanwendungsfälle

**Kundenservice-Routing** - Tickets basierend auf Priorität weiterleiten

```
API (Ticket) → Condition (priority === 'high') → Agent (Escalation) or Agent (Standard)
```

**Inhaltsmoderation** - Inhalte basierend auf Analysen filtern

```
Agent (Analyze) → Condition (toxicity > 0.7) → Moderation or Publish
```

**Benutzer-Onboarding-Ablauf** - Onboarding basierend auf Benutzertyp personalisieren

```
Function (Process) → Condition (account_type === 'enterprise') → Advanced or Simple
```

## Bewährte Praktiken

- **Bedingungen korrekt anordnen**: Platzieren Sie spezifischere Bedingungen vor allgemeinen, um sicherzustellen, dass spezifische Logik Vorrang vor Fallbacks hat
- **Verwenden Sie den Else-Zweig bei Bedarf**: Wenn keine Bedingungen übereinstimmen und der Else-Zweig nicht verbunden ist, endet der Workflow-Zweig ordnungsgemäß. Verbinden Sie den Else-Zweig, wenn Sie einen Fallback-Pfad für nicht übereinstimmende Fälle benötigen
- **Halten Sie Ausdrücke einfach**: Verwenden Sie klare, unkomplizierte boolesche Ausdrücke für bessere Lesbarkeit und einfachere Fehlersuche
- **Dokumentieren Sie Ihre Bedingungen**: Fügen Sie Beschreibungen hinzu, um den Zweck jeder Bedingung für bessere Teamzusammenarbeit und Wartung zu erklären
- **Testen Sie Grenzfälle**: Überprüfen Sie, ob Bedingungen Grenzwerte korrekt behandeln, indem Sie mit Werten an den Grenzen Ihrer Bedingungsbereiche testen
```

--------------------------------------------------------------------------------

---[FILE: evaluator.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/evaluator.mdx

```text
---
title: Evaluator
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Evaluator-Block nutzt KI, um die Inhaltsqualität anhand benutzerdefinierter Metriken zu bewerten. Perfekt für Qualitätskontrolle, A/B-Tests und um sicherzustellen, dass KI-Ausgaben bestimmte Standards erfüllen.

<div className="flex justify-center">
  <Image
    src="/static/blocks/evaluator.png"
    alt="Evaluator-Block-Konfiguration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Konfigurationsoptionen

### Bewertungsmetriken

Definieren Sie benutzerdefinierte Metriken, anhand derer Inhalte bewertet werden. Jede Metrik umfasst:

- **Name**: Eine kurze Bezeichnung für die Metrik
- **Beschreibung**: Eine detaillierte Erklärung, was die Metrik misst
- **Bereich**: Der numerische Bereich für die Bewertung (z.B. 1-5, 0-10)

Beispielmetriken:

```
Accuracy (1-5): How factually accurate is the content?
Clarity (1-5): How clear and understandable is the content?
Relevance (1-5): How relevant is the content to the original query?
```

### Inhalt

Der zu bewertende Inhalt. Dies kann sein:

- Direkt in der Blockkonfiguration bereitgestellt
- Verbunden mit der Ausgabe eines anderen Blocks (typischerweise ein Agent-Block)
- Dynamisch während der Workflow-Ausführung generiert

### Modellauswahl

Wählen Sie ein KI-Modell für die Durchführung der Bewertung:

- **OpenAI**: GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Andere Anbieter**: Groq, Cerebras, xAI, DeepSeek
- **Lokale Modelle**: Ollama oder VLLM-kompatible Modelle

Verwenden Sie Modelle mit starken Argumentationsfähigkeiten wie GPT-4o oder Claude 3.7 Sonnet für beste Ergebnisse.

### API-Schlüssel

Ihr API-Schlüssel für den ausgewählten LLM-Anbieter. Dieser wird sicher gespeichert und für die Authentifizierung verwendet.

## Beispielanwendungsfälle

**Bewertung der Inhaltsqualität** - Inhalte vor der Veröffentlichung bewerten

```
Agent (Generate) → Evaluator (Score) → Condition (Check threshold) → Publish or Revise
```

**A/B-Tests von Inhalten** - Vergleich mehrerer KI-generierter Antworten

```
Parallel (Variations) → Evaluator (Score Each) → Function (Select Best) → Response
```

**Qualitätskontrolle im Kundenservice** - Sicherstellen, dass Antworten Qualitätsstandards erfüllen

```
Agent (Support Response) → Evaluator (Score) → Function (Log) → Condition (Review if Low)
```

## Ausgaben

- **`<evaluator.content>`**: Zusammenfassung der Bewertung mit Punktzahlen
- **`<evaluator.model>`**: Für die Bewertung verwendetes Modell
- **`<evaluator.tokens>`**: Statistik zur Token-Nutzung
- **`<evaluator.cost>`**: Geschätzte Bewertungskosten

## Best Practices

- **Verwenden Sie spezifische Metrikbeschreibungen**: Definieren Sie klar, was jede Metrik misst, um genauere Bewertungen zu erhalten
- **Wählen Sie geeignete Bereiche**: Wählen Sie Bewertungsbereiche, die ausreichend Granularität bieten, ohne zu komplex zu sein
- **Verbinden Sie mit Agent-Blöcken**: Verwenden Sie Evaluator-Blöcke, um die Ausgaben von Agent-Blöcken zu bewerten und Feedback-Schleifen zu erstellen
- **Verwenden Sie konsistente Metriken**: Für vergleichende Analysen sollten Sie konsistente Metriken über ähnliche Bewertungen hinweg beibehalten
- **Kombinieren Sie mehrere Metriken**: Verwenden Sie verschiedene Metriken, um eine umfassende Bewertung zu erhalten
```

--------------------------------------------------------------------------------

---[FILE: function.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/function.mdx

```text
---
title: Funktion
---

import { Image } from '@/components/ui/image'

Der Funktionsblock führt benutzerdefinierten JavaScript- oder TypeScript-Code in Ihren Workflows aus. Transformieren Sie Daten, führen Sie Berechnungen durch oder implementieren Sie benutzerdefinierte Logik.

<div className="flex justify-center">
  <Image
    src="/static/blocks/function.png"
    alt="Funktionsblock mit Code-Editor"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Ausgaben

- **`<function.result>`**: Der von Ihrer Funktion zurückgegebene Wert
- **`<function.stdout>`**: Console.log()-Ausgabe Ihres Codes

## Beispielanwendungsfälle

**Datenverarbeitungspipeline** - Transformation von API-Antworten in strukturierte Daten

```
API (Fetch) → Function (Process & Validate) → Function (Calculate Metrics) → Response
```

**Implementierung von Geschäftslogik** - Berechnung von Treuepunkten und Stufen

```
Agent (Get History) → Function (Calculate Score) → Function (Determine Tier) → Condition (Route)
```

**Datenvalidierung und -bereinigung** - Validierung und Bereinigung von Benutzereingaben

```
Input → Function (Validate & Sanitize) → API (Save to Database)
```

### Beispiel: Treuepunkte-Rechner

```javascript title="loyalty-calculator.js"
// Process customer data and calculate loyalty score
const { purchaseHistory, accountAge, supportTickets } = <agent>;

// Calculate metrics
const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
const purchaseFrequency = purchaseHistory.length / (accountAge / 365);
const ticketRatio = supportTickets.resolved / supportTickets.total;

// Calculate loyalty score (0-100)
const spendScore = Math.min(totalSpent / 1000 * 30, 30);
const frequencyScore = Math.min(purchaseFrequency * 20, 40);
const supportScore = ticketRatio * 30;

const loyaltyScore = Math.round(spendScore + frequencyScore + supportScore);

return {
  customer: <agent.name>,
  loyaltyScore,
  loyaltyTier: loyaltyScore >= 80 ? "Platinum" : loyaltyScore >= 60 ? "Gold" : "Silver",
  metrics: { spendScore, frequencyScore, supportScore }
};
```

## Best Practices

- **Funktionen fokussiert halten**: Schreiben Sie Funktionen, die eine Sache gut erledigen, um die Wartbarkeit und Fehlersuche zu verbessern
- **Fehler elegant behandeln**: Verwenden Sie try/catch-Blöcke, um potenzielle Fehler zu behandeln und aussagekräftige Fehlermeldungen bereitzustellen
- **Grenzfälle testen**: Stellen Sie sicher, dass Ihr Code ungewöhnliche Eingaben, Null-Werte und Grenzbedingungen korrekt behandelt
- **Für Leistung optimieren**: Achten Sie bei großen Datensätzen auf die Berechnungskomplexität und den Speicherverbrauch
- **Console.log() zum Debuggen verwenden**: Nutzen Sie die Stdout-Ausgabe zum Debuggen und Überwachen der Funktionsausführung
```

--------------------------------------------------------------------------------

---[FILE: guardrails.mdx]---
Location: sim-main/apps/docs/content/docs/de/blocks/guardrails.mdx

```text
---
title: Guardrails
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Der Guardrails-Block validiert und schützt Ihre KI-Workflows, indem er Inhalte anhand mehrerer Validierungstypen überprüft. Stellen Sie die Datenqualität sicher, verhindern Sie Halluzinationen, erkennen Sie personenbezogene Daten und erzwingen Sie Formatanforderungen, bevor Inhalte durch Ihren Workflow fließen.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails.png"
    alt="Guardrails-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Validierungstypen

### JSON-Validierung

Überprüft, ob der Inhalt korrekt formatiertes JSON ist. Perfekt, um sicherzustellen, dass strukturierte LLM-Ausgaben sicher geparst werden können.

**Anwendungsfälle:**
- Validierung von JSON-Antworten aus Agent-Blöcken vor dem Parsen
- Sicherstellen, dass API-Payloads korrekt formatiert sind
- Überprüfung der Integrität strukturierter Daten

**Ausgabe:**
- `passed`: `true` bei gültigem JSON, sonst `false`
- `error`: Fehlermeldung bei fehlgeschlagener Validierung (z.B. "Ungültiges JSON: Unerwartetes Token...")

### Regex-Validierung

Prüft, ob der Inhalt einem bestimmten regulären Ausdrucksmuster entspricht.

**Anwendungsfälle:**
- Validierung von E-Mail-Adressen
- Überprüfung von Telefonnummernformaten
- Verifizierung von URLs oder benutzerdefinierten Kennungen
- Durchsetzung spezifischer Textmuster

**Konfiguration:**
- **Regex-Muster**: Der reguläre Ausdruck, gegen den geprüft wird (z.B. `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` für E-Mails)

**Ausgabe:**
- `passed`: `true` wenn der Inhalt dem Muster entspricht, sonst `false`
- `error`: Fehlermeldung bei fehlgeschlagener Validierung

### Halluzinationserkennung

Verwendet Retrieval-Augmented Generation (RAG) mit LLM-Bewertung, um zu erkennen, wann KI-generierte Inhalte im Widerspruch zu Ihrer Wissensdatenbank stehen oder nicht darin begründet sind.

**Funktionsweise:**
1. Abfrage Ihrer Wissensdatenbank nach relevantem Kontext
2. Übermittlung sowohl der KI-Ausgabe als auch des abgerufenen Kontexts an ein LLM
3. LLM weist einen Konfidenzwert zu (Skala 0-10)
   - **0** = Vollständige Halluzination (völlig unbegründet)
   - **10** = Vollständig begründet (komplett durch die Wissensdatenbank gestützt)
4. Validierung besteht, wenn der Wert ≥ Schwellenwert ist (Standard: 3)

**Konfiguration:**
- **Wissensdatenbank**: Wählen Sie aus Ihren vorhandenen Wissensdatenbanken
- **Modell**: Wählen Sie LLM für die Bewertung (erfordert starkes Denkvermögen - GPT-4o, Claude 3.7 Sonnet empfohlen)
- **API-Schlüssel**: Authentifizierung für den ausgewählten LLM-Anbieter (automatisch ausgeblendet für gehostete/Ollama oder VLLM-kompatible Modelle)
- **Vertrauensschwelle**: Mindestpunktzahl zum Bestehen (0-10, Standard: 3)
- **Top K** (Erweitert): Anzahl der abzurufenden Wissensdatenbank-Chunks (Standard: 10)

**Ausgabe:**
- `passed`: `true` wenn Konfidenzwert ≥ Schwellenwert
- `score`: Konfidenzwert (0-10)
- `reasoning`: Erklärung des LLM für den Wert
- `error`: Fehlermeldung bei fehlgeschlagener Validierung

**Anwendungsfälle:**
- Validierung von Agent-Antworten anhand der Dokumentation
- Sicherstellung der faktischen Richtigkeit von Kundendienstantworten
- Überprüfung, ob generierte Inhalte mit dem Quellmaterial übereinstimmen
- Qualitätskontrolle für RAG-Anwendungen

### PII-Erkennung

Erkennt personenbezogene Daten mithilfe von Microsoft Presidio. Unterstützt über 40 Entitätstypen in mehreren Ländern und Sprachen.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails-2.png"
    alt="PII-Erkennungskonfiguration"
    width={700}
    height={450}
    className="my-6"
  />
</div>

**Funktionsweise:**
1. Übergabe des zu validierenden Inhalts (z.B. `<agent1.content>`)
2. Auswahl der zu erkennenden PII-Typen über den Modal-Selektor
3. Auswahl des Erkennungsmodus (Erkennen oder Maskieren)
4. Inhalt wird auf übereinstimmende PII-Entitäten gescannt
5. Gibt Erkennungsergebnisse und optional maskierten Text zurück

<div className="mx-auto w-3/5 overflow-hidden rounded-lg">
  <Video src="guardrails.mp4" width={500} height={350} />
</div>

**Konfiguration:**
- **Zu erkennende PII-Typen**: Auswahl aus gruppierten Kategorien über Modal-Selektor
  - **Allgemein**: Personenname, E-Mail, Telefon, Kreditkarte, IP-Adresse usw.
  - **USA**: Sozialversicherungsnummer, Führerschein, Reisepass usw.
  - **UK**: NHS-Nummer, Sozialversicherungsnummer
  - **Spanien**: NIF, NIE, CIF
  - **Italien**: Steuernummer, Führerschein, Umsatzsteuer-ID
  - **Polen**: PESEL, NIP, REGON
  - **Singapur**: NRIC/FIN, UEN
  - **Australien**: ABN, ACN, TFN, Medicare
  - **Indien**: Aadhaar, PAN, Reisepass, Wählernummer
- **Modus**: 
  - **Erkennen**: Nur PII identifizieren (Standard)
  - **Maskieren**: Erkannte PII durch maskierte Werte ersetzen
- **Sprache**: Erkennungssprache (Standard: Englisch)

**Ausgabe:**
- `passed`: `false` wenn ausgewählte PII-Typen erkannt werden
- `detectedEntities`: Array erkannter PII mit Typ, Position und Konfidenz
- `maskedText`: Inhalt mit maskierter PII (nur wenn Modus = "Mask")
- `error`: Fehlermeldung bei fehlgeschlagener Validierung

**Anwendungsfälle:**
- Blockieren von Inhalten mit sensiblen persönlichen Informationen
- Maskieren von personenbezogenen Daten vor der Protokollierung oder Speicherung
- Einhaltung der DSGVO, HIPAA und anderer Datenschutzbestimmungen
- Bereinigung von Benutzereingaben vor der Verarbeitung

## Konfiguration

### Zu validierende Inhalte

Der zu validierende Eingabeinhalt. Dieser stammt typischerweise aus:
- Ausgaben von Agent-Blöcken: `<agent.content>`
- Ergebnisse von Funktionsblöcken: `<function.output>`
- API-Antworten: `<api.output>`
- Jede andere Blockausgabe

### Validierungstyp

Wählen Sie aus vier Validierungstypen:
- **Gültiges JSON**: Prüfen, ob der Inhalt korrekt formatiertes JSON ist
- **Regex-Übereinstimmung**: Überprüfen, ob der Inhalt einem Regex-Muster entspricht
- **Halluzinationsprüfung**: Validierung gegen Wissensdatenbank mit LLM-Bewertung
- **PII-Erkennung**: Erkennung und optional Maskierung personenbezogener Daten

## Ausgaben

Alle Validierungstypen geben zurück:

- **`<guardrails.passed>`**: Boolescher Wert, der angibt, ob die Validierung bestanden wurde
- **`<guardrails.validationType>`**: Der durchgeführte Validierungstyp
- **`<guardrails.input>`**: Die ursprüngliche Eingabe, die validiert wurde
- **`<guardrails.error>`**: Fehlermeldung, wenn die Validierung fehlgeschlagen ist (optional)

Zusätzliche Ausgaben nach Typ:

**Halluzinationsprüfung:**
- **`<guardrails.score>`**: Konfidenzwert (0-10)
- **`<guardrails.reasoning>`**: Erklärung des LLM

**PII-Erkennung:**
- **`<guardrails.detectedEntities>`**: Array erkannter PII-Entitäten
- **`<guardrails.maskedText>`**: Inhalt mit maskierten PII (wenn Modus = "Mask")

## Beispielanwendungsfälle

**JSON vor dem Parsen validieren** - Stellen Sie sicher, dass die Agent-Ausgabe gültiges JSON ist

```
Agent (Generate) → Guardrails (Validate) → Condition (Check passed) → Function (Parse)
```

**Halluzinationen verhindern** - Validieren Sie Kundendienstantworten anhand der Wissensdatenbank

```
Agent (Response) → Guardrails (Check KB) → Condition (Score ≥ 3) → Send or Flag
```

**PII in Benutzereingaben blockieren** - Bereinigen Sie von Benutzern übermittelte Inhalte

```
Input → Guardrails (Detect PII) → Condition (No PII) → Process or Reject
```

## Bewährte Praktiken

- **Verkettung mit Bedingungsblöcken**: Verwenden Sie `<guardrails.passed>`, um die Workflow-Logik basierend auf Validierungsergebnissen zu verzweigen
- **JSON-Validierung vor dem Parsen verwenden**: Validieren Sie immer die JSON-Struktur, bevor Sie versuchen, LLM-Ausgaben zu parsen
- **Geeignete PII-Typen auswählen**: Wählen Sie nur die für Ihren Anwendungsfall relevanten PII-Entitätstypen für bessere Leistung
- **Angemessene Konfidenzgrenzwerte festlegen**: Passen Sie für die Halluzinationserkennung den Grenzwert an Ihre Genauigkeitsanforderungen an (höher = strenger)
- **Starke Modelle für die Halluzinationserkennung verwenden**: GPT-4o oder Claude 3.7 Sonnet bieten genauere Konfidenzwerte
- **PII für die Protokollierung maskieren**: Verwenden Sie den Modus "Mask", wenn Sie Inhalte protokollieren oder speichern müssen, die PII enthalten könnten
- **Regex-Muster testen**: Validieren Sie Ihre Regex-Muster gründlich, bevor Sie sie in der Produktion einsetzen
- **Validierungsfehler überwachen**: Verfolgen Sie `<guardrails.error>`Nachrichten, um häufige Validierungsprobleme zu identifizieren

<Callout type="info">
  Die Validierung von Guardrails erfolgt synchron in Ihrem Workflow. Für die Erkennung von Halluzinationen sollten Sie schnellere Modelle (wie GPT-4o-mini) wählen, wenn die Latenz kritisch ist.
</Callout>
```

--------------------------------------------------------------------------------

````
