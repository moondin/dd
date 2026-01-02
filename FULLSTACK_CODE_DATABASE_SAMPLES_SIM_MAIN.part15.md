---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 15
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 15 of 933)

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

---[FILE: logging.mdx]---
Location: sim-main/apps/docs/content/docs/de/execution/logging.mdx

```text
---
title: Protokollierung
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim bietet umfassende Protokollierung für alle Workflow-Ausführungen und gibt Ihnen vollständige Transparenz darüber, wie Ihre Workflows laufen, welche Daten durch sie fließen und wo möglicherweise Probleme auftreten.

## Protokollierungssystem

Sim bietet zwei komplementäre Protokollierungsschnittstellen, die verschiedenen Workflows und Anwendungsfällen entsprechen:

### Echtzeit-Konsole

Während der manuellen oder Chat-Workflow-Ausführung erscheinen Protokolle in Echtzeit im Konsolen-Panel auf der rechten Seite des Workflow-Editors:

<div className="flex justify-center">
  <Image
    src="/static/logs/console.png"
    alt="Echtzeit-Konsolen-Panel"
    width={400}
    height={300}
    className="my-6"
  />
</div>

Die Konsole zeigt:
- Fortschritt der Blockausführung mit Hervorhebung des aktiven Blocks
- Echtzeit-Ausgaben nach Abschluss der Blöcke
- Ausführungszeit für jeden Block
- Erfolgs-/Fehlerstatusanzeigen

### Protokollseite

Alle Workflow-Ausführungen – ob manuell ausgelöst, über API, Chat, Zeitplan oder Webhook – werden auf der dedizierten Protokollseite protokolliert:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs.png"
    alt="Protokollseite"
    width={600}
    height={400}
    className="my-6"
  />
</div>

Die Protokollseite bietet:
- Umfassende Filterung nach Zeitraum, Status, Auslösertyp, Ordner und Workflow
- Suchfunktion über alle Protokolle
- Live-Modus für Echtzeit-Updates
- 7-tägige Protokollaufbewahrung (erweiterbar für längere Aufbewahrung)

## Protokolldetails-Seitenleiste

Durch Klicken auf einen Protokolleintrag öffnet sich eine detaillierte Seitenleistenansicht:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-sidebar.png"
    alt="Protokoll-Seitenleiste mit Details"
    width={600}
    height={400}
    className="my-6"
  />
</div>

### Block-Eingabe/Ausgabe

Sehen Sie den vollständigen Datenfluss für jeden Block mit Tabs zum Umschalten zwischen:

<Tabs items={['Output', 'Input']}>
  <Tab>
    **Output-Tab** zeigt das Ausführungsergebnis des Blocks:
    - Strukturierte Daten mit JSON-Formatierung
    - Markdown-Rendering für KI-generierte Inhalte
    - Kopierschaltfläche für einfache Datenextraktion
  </Tab>
  
  <Tab>
    **Input-Tab** zeigt, was an den Block übergeben wurde:
    - Aufgelöste Variablenwerte
    - Referenzierte Ausgaben anderer Blöcke
    - Verwendete Umgebungsvariablen
    - API-Schlüssel werden aus Sicherheitsgründen automatisch unkenntlich gemacht
  </Tab>
</Tabs>

### Ausführungszeitlinie

Für Workflow-übergreifende Protokolle, sehen Sie detaillierte Ausführungsmetriken:
- Start- und Endzeitstempel
- Gesamtdauer des Workflows
- Ausführungszeiten einzelner Blöcke
- Identifikation von Leistungsengpässen

## Workflow-Snapshots

Für jede protokollierte Ausführung klicken Sie auf "Snapshot anzeigen", um den exakten Workflow-Zustand zum Ausführungszeitpunkt zu sehen:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-frozen-canvas.png"
    alt="Workflow-Snapshot"
    width={600}
    height={400}
    className="my-6"
  />
</div>

Der Snapshot bietet:
- Eingefrorene Arbeitsfläche, die die Workflow-Struktur zeigt
- Block-Zustände und Verbindungen, wie sie während der Ausführung waren
- Klicken Sie auf einen beliebigen Block, um dessen Ein- und Ausgaben zu sehen
- Nützlich zum Debuggen von Workflows, die seitdem geändert wurden

<Callout type="info">
  Workflow-Snapshots sind nur für Ausführungen verfügbar, die nach der Einführung des erweiterten Protokollierungssystems durchgeführt wurden. Ältere migrierte Protokolle zeigen die Meldung "Protokollierter Zustand nicht gefunden".
</Callout>

## Protokollaufbewahrung

- **Kostenloser Plan**: 7 Tage Protokollaufbewahrung
- **Pro-Plan**: 30 Tage Protokollaufbewahrung
- **Team-Plan**: 90 Tage Protokollaufbewahrung
- **Enterprise-Plan**: Individuelle Aufbewahrungszeiträume verfügbar

## Best Practices

### Für die Entwicklung
- Verwenden Sie die Echtzeit-Konsole für sofortiges Feedback während des Testens
- Überprüfen Sie Block-Ein- und Ausgaben, um den Datenfluss zu verifizieren
- Nutzen Sie Workflow-Snapshots, um funktionierende mit fehlerhaften Versionen zu vergleichen

### Für die Produktion
- Überwachen Sie die Protokollseite regelmäßig auf Fehler oder Leistungsprobleme
- Richten Sie Filter ein, um sich auf bestimmte Workflows oder Zeiträume zu konzentrieren
- Verwenden Sie den Live-Modus während kritischer Bereitstellungen, um Ausführungen in Echtzeit zu beobachten

### Für das Debugging
- Überprüfen Sie immer die Ausführungszeitlinie, um langsame Blöcke zu identifizieren
- Vergleichen Sie Eingaben zwischen funktionierenden und fehlerhaften Ausführungen
- Verwenden Sie Workflow-Snapshots, um den genauen Zustand zu sehen, wenn Probleme aufgetreten sind

## Nächste Schritte

- Erfahren Sie mehr über die [Kostenberechnung](/execution/costs), um die Preisgestaltung von Workflows zu verstehen
- Erkunden Sie die [externe API](/execution/api) für programmatischen Zugriff auf Protokolle
- Richten Sie [Benachrichtigungen](/execution/api#notifications) für Echtzeit-Warnungen per Webhook, E-Mail oder Slack ein
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/getting-started/index.mdx

```text
---
title: Erste Schritte
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import {
  AgentIcon,
  ApiIcon,
  ChartBarIcon,
  CodeIcon,
  ConditionalIcon,
  ConnectIcon,
  ExaAIIcon,
  FirecrawlIcon,
  GmailIcon,
  NotionIcon,
  PerplexityIcon,
  SlackIcon,
} from '@/components/icons'
import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

Erstelle deinen ersten KI-Workflow in 10 Minuten. In diesem Tutorial wirst du einen Personenrecherche-Agenten erstellen, der fortschrittliche LLM-gestützte Suchwerkzeuge nutzt, um Informationen über Personen zu extrahieren und zu strukturieren.

<Callout type="info">
  Dieses Tutorial behandelt die wesentlichen Konzepte zum Erstellen von Workflows in Sim. Geschätzte Bearbeitungszeit: 10 Minuten.
</Callout>

## Was du erstellen wirst

Einen Personenrecherche-Agenten, der:
1. Benutzereingaben über eine Chat-Schnittstelle akzeptiert
2. Das Web mit KI-gestützten Tools durchsucht (Exa und Linkup)
3. Informationen über Personen extrahiert und strukturiert
4. Formatierte JSON-Daten mit Standort, Beruf und Ausbildung zurückgibt

<Image
  src="/static/getting-started/started-1.png"
  alt="Beispiel für erste Schritte"
  width={800}
  height={500}
/>

## Schritt-für-Schritt-Anleitung

<Steps>
  <Step title="Workflow erstellen und einen KI-Agenten hinzufügen">
    Klicke im Dashboard auf **Neuer Workflow** und benenne ihn "Getting Started".
    
    Jeder neue Workflow enthält standardmäßig einen **Start-Block** – dies ist der Eingangspunkt, der Benutzereingaben empfängt. Da wir diesen Workflow über Chat auslösen werden, ist keine Konfiguration für den Start-Block erforderlich.
    
    Ziehe einen **Agenten-Block** aus dem linken Bereich auf die Arbeitsfläche und konfiguriere ihn:
    - **Modell**: Wähle "OpenAI GPT-4o"
    - **System-Prompt**: "Du bist ein Personenrecherche-Agent. Wenn dir ein Name einer Person gegeben wird, nutze deine verfügbaren Suchwerkzeuge, um umfassende Informationen über sie zu finden, einschließlich ihres Standorts, Berufs, Bildungshintergrunds und anderer relevanter Details."
    - **Benutzer-Prompt**: Ziehe die Verbindung vom Ausgabefeld des Start-Blocks in dieses Feld, um `<start.input>` mit dem Benutzer-Prompt zu verbinden
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-2.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Suchwerkzeuge zum Agenten hinzufügen">
    Erweitere deinen Agenten mit Websuche-Funktionen. Klicke auf den Agenten-Block, um ihn auszuwählen.
    
    Im Bereich **Tools**:
    - Klicke auf **Tool hinzufügen**
    - Wähle **Exa** und **Linkup** aus den verfügbaren Tools
    - Gib deine API-Schlüssel für beide Tools ein, um Websuche und Datenzugriff zu ermöglichen
    
    <div className="mx-auto w-3/5 overflow-hidden rounded-lg">
      <Video src="getting-started/started-3.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Workflow testen">
    Teste deinen Workflow mit dem **Chat-Panel** auf der rechten Seite des Bildschirms.
    
    Im Chat-Panel:
    - Klicke auf das Dropdown-Menü und wähle `agent1.content`, um die Ausgabe des Agenten anzuzeigen
    - Gib eine Testnachricht ein: "John ist ein Softwareentwickler aus San Francisco, der Informatik an der Stanford University studiert hat."
    - Klicke auf **Senden**, um den Workflow auszuführen
    
    Der Agent wird die Person analysieren und strukturierte Informationen zurückgeben.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-4.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Strukturierte Ausgabe konfigurieren">
    Konfiguriere deinen Agenten, um strukturierte JSON-Daten zurückzugeben. Klicke auf den Agenten-Block, um ihn auszuwählen.
    
    Im Bereich **Antwortformat**:
    - Klicke auf das **Zauberstab-Symbol** (✨) neben dem Schema-Feld
    - Gib den Prompt ein: "Erstelle ein Schema namens person, das Standort, Beruf und Ausbildung enthält"
    - Die KI wird automatisch das JSON-Schema generieren
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-5.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Mit strukturierter Ausgabe testen">
    Kehre zum **Chat-Panel** zurück, um das strukturierte Antwortformat zu testen.
    
    Mit dem konfigurierten Antwortformat sind jetzt neue Ausgabeoptionen verfügbar:
    - Klicke auf das Dropdown-Menü und wähle die Option für strukturierte Ausgabe (das Schema, das du gerade erstellt hast)
    - Gib eine Testnachricht ein: "Sarah ist eine Marketing-Managerin aus New York mit einem MBA von der Harvard Business School."
    - Klicke auf **Senden**, um den Workflow auszuführen
    
    Der Agent wird nun strukturierte JSON-Ausgabe zurückgeben, wobei die Informationen der Person in die Felder Standort, Beruf und Ausbildung organisiert sind.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-6.mp4" width={700} height={450} />
    </div>
  </Step>
</Steps>

## Was du erstellt hast

Du hast erfolgreich einen KI-Workflow erstellt, der:
- ✅ Benutzereingaben über eine Chat-Schnittstelle akzeptiert
- ✅ Unstrukturierten Text mit KI verarbeitet
- ✅ Externe Suchwerkzeuge integriert (Exa und Linkup)
- ✅ Strukturierte JSON-Daten mit KI-generierten Schemas zurückgibt
- ✅ Echtzeit-Tests und Iteration demonstriert
- ✅ Die Leistungsfähigkeit der visuellen, codefreien Entwicklung zeigt

## Wichtige Konzepte, die du gelernt hast

### Verwendete Block-Typen

<Files>
  <File
    name="Start Block"
    icon={<ConnectIcon className="h-4 w-4" />}
    annotation="Einstiegspunkt für Benutzereingaben (automatisch enthalten)"
  />
  <File
    name="Agent Block"
    icon={<AgentIcon className="h-4 w-4" />}
    annotation="KI-Modell für Textverarbeitung und -analyse"
  />
</Files>

### Grundlegende Workflow-Konzepte

**Datenfluss**  
Verbinde Blöcke durch Ziehen von Verbindungen, um Daten zwischen Workflow-Schritten zu übertragen

**Chat-Schnittstelle**  
Teste Workflows in Echtzeit mit dem Chat-Panel und wähle verschiedene Ausgabeoptionen

**Tool-Integration**  
Erweitere die Fähigkeiten des Agenten durch Integration externer Dienste wie Exa und Linkup

**Variablenreferenzen**  
Greife auf Block-Ausgaben mit der `<blockName.output>` Syntax zu

**Strukturierte Ausgabe**  
Definiere JSON-Schemas, um konsistente, formatierte Antworten von der KI zu gewährleisten

**KI-generierte Schemas**  
Verwende den Zauberstab (✨), um Schemas aus natürlichsprachigen Eingabeaufforderungen zu generieren

**Iterative Entwicklung**  
Erstelle, teste und verfeinere Workflows schnell mit sofortigem Feedback

## Nächste Schritte

<Cards>
  <Card title="Workflow-Blöcke erkunden" href="/blocks">
    Entdecke API-, Funktions-, Bedingungs- und andere Workflow-Blöcke
  </Card>
  <Card title="Integrationen durchsuchen" href="/tools">
    Verbinde über 80 Dienste einschließlich Gmail, Slack, Notion und mehr
  </Card>
  <Card title="Benutzerdefinierte Logik hinzufügen" href="/blocks/function">
    Schreibe benutzerdefinierte Funktionen für fortgeschrittene Datenverarbeitung
  </Card>
  <Card title="Deinen Workflow bereitstellen" href="/execution">
    Mache deinen Workflow über REST API oder Webhooks zugänglich
  </Card>
</Cards>

## Ressourcen

**Brauchst du detaillierte Erklärungen?** Besuche die [Blocks-Dokumentation](/blocks) für umfassende Anleitungen zu jeder Komponente.

**Suchst du nach Integrationen?** Erkunde die [Tools-Dokumentation](/tools), um alle 80+ verfügbaren Integrationen zu sehen.

**Bereit für den Livebetrieb?** Erfahre mehr über [Ausführung und Bereitstellung](/execution), um deine Workflows produktionsreif zu machen.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/introduction/index.mdx

```text
---
title: Einführung
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Sim ist ein Open-Source-Tool zur visuellen Workflow-Erstellung für die Entwicklung und Bereitstellung von KI-Agenten-Workflows. Entwerfen Sie intelligente Automatisierungssysteme mit einer No-Code-Oberfläche – verbinden Sie KI-Modelle, Datenbanken, APIs und Business-Tools über eine intuitive Drag-and-Drop-Oberfläche. Ob Sie Chatbots entwickeln, Geschäftsprozesse automatisieren oder komplexe Datenpipelines orchestrieren – Sim bietet die Werkzeuge, um Ihre KI-Workflows zum Leben zu erwecken.

<div className="flex justify-center">
  <Image
    src="/static/introduction.png"
    alt="Sim visuelle Workflow-Leinwand"
    width={700}
    height={450}
    className="my-6"
  />
</div>

## Was Sie erstellen können

**KI-Assistenten & Chatbots**  
Entwickeln Sie intelligente Konversationsagenten, die sich in Ihre Tools und Daten integrieren lassen. Ermöglichen Sie Funktionen wie Websuche, Kalenderverwaltung, E-Mail-Automatisierung und nahtlose Interaktion mit Geschäftssystemen.

**Automatisierung von Geschäftsprozessen**  
Beseitigen Sie manuelle Aufgaben in Ihrer gesamten Organisation. Automatisieren Sie Dateneingaben, erstellen Sie Berichte, beantworten Sie Kundenanfragen und optimieren Sie Workflows zur Inhaltserstellung.

**Datenverarbeitung & -analyse**  
Verwandeln Sie Rohdaten in umsetzbare Erkenntnisse. Extrahieren Sie Informationen aus Dokumenten, führen Sie Datensatzanalysen durch, erstellen Sie automatisierte Berichte und synchronisieren Sie Daten über verschiedene Plattformen hinweg.

**API-Integrations-Workflows**  
Orchestieren Sie komplexe Interaktionen zwischen mehreren Diensten. Erstellen Sie einheitliche API-Endpunkte, implementieren Sie anspruchsvolle Geschäftslogik und bauen Sie ereignisgesteuerte Automatisierungssysteme.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/chat-workflow.mp4" width={700} height={450} />
</div>

## Wie es funktioniert

**Visueller Workflow-Editor**  
Entwerfen Sie Workflows mit einer intuitiven Drag-and-Drop-Oberfläche. Verbinden Sie KI-Modelle, Datenbanken, APIs und Dienste von Drittanbietern über eine visuelle No-Code-Schnittstelle, die komplexe Automatisierungslogik leicht verständlich und wartbar macht.

**Modulares Blocksystem**  
Bauen Sie mit spezialisierten Komponenten: Verarbeitungsblöcke (KI-Agenten, API-Aufrufe, benutzerdefinierte Funktionen), Logikblöcke (bedingte Verzweigungen, Schleifen, Router) und Ausgabeblöcke (Antworten, Evaluatoren). Jeder Block übernimmt eine bestimmte Aufgabe in Ihrem Workflow.

**Flexible Ausführungsauslöser**  
Starten Sie Workflows über mehrere Kanäle, einschließlich Chat-Schnittstellen, REST-APIs, Webhooks, geplante Cron-Jobs oder externe Ereignisse von Plattformen wie Slack und GitHub.

**Echtzeit-Zusammenarbeit**  
Ermöglichen Sie Ihrem Team, gemeinsam zu arbeiten. Mehrere Benutzer können Workflows gleichzeitig bearbeiten, mit Live-Updates und detaillierten Berechtigungskontrollen.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/build-workflow.mp4" width={700} height={450} />
</div>

## Integrationen

Sim bietet native Integrationen mit über 80 Diensten in verschiedenen Kategorien:

- **KI-Modelle**: OpenAI, Anthropic, Google Gemini, Groq, Cerebras, lokale Modelle über Ollama oder VLLM
- **Kommunikation**: Gmail, Slack, Microsoft Teams, Telegram, WhatsApp  
- **Produktivität**: Notion, Google Workspace, Airtable, Monday.com
- **Entwicklung**: GitHub, Jira, Linear, automatisierte Browser-Tests
- **Suche & Daten**: Google Search, Perplexity, Firecrawl, Exa AI
- **Datenbanken**: PostgreSQL, MySQL, Supabase, Pinecone, Qdrant

Für benutzerdefinierte Integrationen nutzen Sie unsere [MCP (Model Context Protocol)-Unterstützung](/mcp), um beliebige externe Dienste oder Tools anzubinden.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/integrations-sidebar.mp4" width={700} height={450} />
</div>

## Copilot

**Fragen stellen & Anleitung erhalten**  
Der Copilot beantwortet Fragen zu Sim, erklärt Ihre Workflows und gibt Verbesserungsvorschläge. Verwenden Sie das `@` Symbol, um auf Workflows, Blöcke, Dokumentation, Wissen und Protokolle für kontextbezogene Unterstützung zu verweisen.

**Workflows erstellen & bearbeiten**  
Wechseln Sie in den Agent-Modus, damit der Copilot Änderungen direkt auf Ihrer Arbeitsfläche vorschlagen und anwenden kann. Fügen Sie Blöcke hinzu, konfigurieren Sie Einstellungen, verbinden Sie Variablen und strukturieren Sie Workflows mit natürlichsprachlichen Befehlen um.

**Adaptive Reasoning-Stufen**  
Wählen Sie zwischen den Modi Schnell, Auto, Erweitert oder Behemoth, je nach Komplexität der Aufgabe. Beginnen Sie mit Schnell für einfache Fragen und steigern Sie sich bis zu Behemoth für komplexe architektonische Änderungen und tiefgehendes Debugging.

Erfahren Sie mehr über [Copilot-Funktionen](/copilot) und wie Sie die Produktivität mit KI-Unterstützung maximieren können.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/copilot-workflow.mp4" width={700} height={450} />
</div>

## Bereitstellungsoptionen

**Cloud-Hosting**  
Starten Sie sofort bei [sim.ai](https://sim.ai) mit vollständig verwalteter Infrastruktur, automatischer Skalierung und integrierter Beobachtbarkeit. Konzentrieren Sie sich auf den Aufbau von Workflows, während wir den Betrieb übernehmen.

**Self-Hosting**  
Stellen Sie die Lösung auf Ihrer eigenen Infrastruktur mit Docker Compose oder Kubernetes bereit. Behalten Sie die vollständige Kontrolle über Ihre Daten mit Unterstützung für lokale KI-Modelle durch Ollama-Integration.

## Nächste Schritte

Bereit, Ihren ersten KI-Workflow zu erstellen?

<Cards>
  <Card title="Erste Schritte" href="/getting-started">
    Erstellen Sie Ihren ersten Workflow in 10 Minuten
  </Card>
  <Card title="Workflow-Blöcke" href="/blocks">
    Erfahren Sie mehr über die Bausteine
  </Card>
  <Card title="Tools & Integrationen" href="/tools">
    Entdecken Sie über 80 integrierte Integrationen
  </Card>
  <Card title="Team-Berechtigungen" href="/permissions/roles-and-permissions">
    Richten Sie Workspace-Rollen und Berechtigungen ein
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/knowledgebase/index.mdx

```text
---
title: Übersicht
description: Laden Sie Ihre Dokumente hoch, verarbeiten und durchsuchen Sie sie
  mit intelligenter Vektorsuche und Chunking
---

import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

Die Wissensdatenbank ermöglicht es Ihnen, Ihre Dokumente hochzuladen, zu verarbeiten und mit intelligenter Vektorsuche und Chunking zu durchsuchen. Dokumente verschiedener Typen werden automatisch verarbeitet, eingebettet und durchsuchbar gemacht. Ihre Dokumente werden intelligent in Chunks aufgeteilt, und Sie können sie mit natürlichsprachlichen Abfragen anzeigen, bearbeiten und durchsuchen.

## Upload und Verarbeitung

Laden Sie einfach Ihre Dokumente hoch, um zu beginnen. Sim verarbeitet sie automatisch im Hintergrund, extrahiert Text, erstellt Embeddings und teilt sie in durchsuchbare Chunks auf.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-1.mp4" width={700} height={450} />
</div>

Das System übernimmt den gesamten Verarbeitungsprozess für Sie:

1. **Textextraktion**: Inhalte werden aus Ihren Dokumenten mit spezialisierten Parsern für jeden Dateityp extrahiert
2. **Intelligentes Chunking**: Dokumente werden in sinnvolle Chunks mit konfigurierbarer Größe und Überlappung aufgeteilt
3. **Embedding-Generierung**: Vektoreinbettungen werden für semantische Suchfunktionen erstellt
4. **Verarbeitungsstatus**: Verfolgen Sie den Fortschritt während Ihre Dokumente verarbeitet werden

## Unterstützte Dateitypen

Sim unterstützt PDF, Word (DOC/DOCX), Klartext (TXT), Markdown (MD), HTML, Excel (XLS/XLSX), PowerPoint (PPT/PPTX) und CSV-Dateien. Dateien können bis zu 100MB groß sein, wobei die optimale Leistung bei Dateien unter 50MB liegt. Sie können mehrere Dokumente gleichzeitig hochladen, und PDF-Dateien werden mit OCR-Verarbeitung für gescannte Dokumente unterstützt.

## Anzeigen und Bearbeiten von Chunks

Sobald Ihre Dokumente verarbeitet sind, können Sie die einzelnen Chunks anzeigen und bearbeiten. Dies gibt Ihnen volle Kontrolle darüber, wie Ihre Inhalte organisiert und durchsucht werden.

<Image src="/static/knowledgebase/knowledgebase.png" alt="Dokumentchunk-Ansicht mit verarbeiteten Inhalten" width={800} height={500} />

### Chunk-Konfiguration
- **Standardgröße der Chunks**: 1.024 Zeichen
- **Konfigurierbarer Bereich**: 100-4.000 Zeichen pro Chunk
- **Intelligente Überlappung**: Standardmäßig 200 Zeichen zur Kontexterhaltung
- **Hierarchische Aufteilung**: Respektiert Dokumentstruktur (Abschnitte, Absätze, Sätze)

### Bearbeitungsfunktionen
- **Chunk-Inhalt bearbeiten**: Textinhalt einzelner Chunks ändern
- **Chunk-Grenzen anpassen**: Chunks bei Bedarf zusammenführen oder teilen
- **Metadaten hinzufügen**: Chunks mit zusätzlichem Kontext anreichern
- **Massenoperationen**: Effiziente Verwaltung mehrerer Chunks

## Erweiterte PDF-Verarbeitung

Für PDF-Dokumente bietet Sim erweiterte Verarbeitungsfunktionen:

### OCR-Unterstützung
Bei Konfiguration mit Azure oder [Mistral OCR](https://docs.mistral.ai/ocr/):
- **Verarbeitung gescannter Dokumente**: Text aus bildbasierten PDFs extrahieren
- **Umgang mit gemischten Inhalten**: Verarbeitung von PDFs mit Text und Bildern
- **Hohe Genauigkeit**: Fortschrittliche KI-Modelle gewährleisten präzise Textextraktion

## Verwendung des Wissensblocks in Workflows

Sobald Ihre Dokumente verarbeitet sind, können Sie sie in Ihren KI-Workflows über den Wissensblock nutzen. Dies ermöglicht Retrieval-Augmented Generation (RAG), wodurch Ihre KI-Agenten auf Ihre Dokumentinhalte zugreifen und darüber nachdenken können, um genauere, kontextbezogene Antworten zu liefern.

<Image src="/static/knowledgebase/knowledgebase-2.png" alt="Verwendung des Wissensblocks in Workflows" width={800} height={500} />

### Funktionen des Wissensblocks
- **Semantische Suche**: Relevante Inhalte mit natürlichsprachlichen Abfragen finden
- **Kontextintegration**: Automatisches Einbinden relevanter Chunks in Agenten-Prompts
- **Dynamischer Abruf**: Suche erfolgt in Echtzeit während der Workflow-Ausführung
- **Relevanzbewertung**: Ergebnisse nach semantischer Ähnlichkeit geordnet

### Integrationsoptionen
- **System-Prompts**: Kontext für Ihre KI-Agenten bereitstellen
- **Dynamischer Kontext**: Suche und Einbindung relevanter Informationen während Gesprächen
- **Dokumentübergreifende Suche**: Abfrage über Ihre gesamte Wissensdatenbank
- **Gefilterte Suche**: Kombination mit Tags für präzisen Inhaltsabruf

## Vektorsuchtechnologie

Sim verwendet Vektorsuche, die von [pgvector](https://github.com/pgvector/pgvector) unterstützt wird, um die Bedeutung und den Kontext Ihrer Inhalte zu verstehen:

### Semantisches Verständnis
- **Kontextuelle Suche**: Findet relevante Inhalte, auch wenn exakte Schlüsselwörter nicht übereinstimmen
- **Konzeptbasierte Abfrage**: Versteht Beziehungen zwischen Ideen
- **Mehrsprachige Unterstützung**: Funktioniert über verschiedene Sprachen hinweg
- **Synonymerkennung**: Findet verwandte Begriffe und Konzepte

### Suchfunktionen
- **Natürlichsprachige Abfragen**: Stellen Sie Fragen in natürlicher Sprache
- **Ähnlichkeitssuche**: Finden Sie konzeptionell ähnliche Inhalte
- **Hybridsuche**: Kombiniert Vektor- und traditionelle Schlüsselwortsuche
- **Konfigurierbare Ergebnisse**: Steuern Sie die Anzahl und den Relevanz-Schwellenwert der Ergebnisse

## Dokumentenverwaltung

### Organisationsfunktionen
- **Massenupload**: Laden Sie mehrere Dateien gleichzeitig über die asynchrone API hoch
- **Verarbeitungsstatus**: Echtzeit-Updates zum Dokumentenverarbeitungsprozess
- **Suchen und Filtern**: Finden Sie Dokumente schnell in großen Sammlungen
- **Metadaten-Tracking**: Automatische Erfassung von Dateiinformationen und Verarbeitungsdetails

### Sicherheit und Datenschutz
- **Sichere Speicherung**: Dokumente werden mit Sicherheit auf Unternehmensniveau gespeichert
- **Zugriffskontrolle**: Workspace-basierte Berechtigungen
- **Verarbeitungsisolierung**: Jeder Workspace hat eine isolierte Dokumentenverarbeitung
- **Datenaufbewahrung**: Konfigurieren Sie Richtlinien zur Dokumentenaufbewahrung

## Erste Schritte

1. **Navigieren Sie zu Ihrer Wissensdatenbank**: Zugriff über Ihre Workspace-Seitenleiste
2. **Dokumente hochladen**: Drag & Drop oder wählen Sie Dateien zum Hochladen aus
3. **Verarbeitung überwachen**: Beobachten Sie, wie Dokumente verarbeitet und in Chunks aufgeteilt werden
4. **Chunks erkunden**: Sehen und bearbeiten Sie die verarbeiteten Inhalte
5. **Zu Workflows hinzufügen**: Verwenden Sie den Wissensblock, um ihn in Ihre KI-Agenten zu integrieren

Die Wissensdatenbank verwandelt Ihre statischen Dokumente in eine intelligente, durchsuchbare Ressource, die Ihre KI-Workflows für fundiertere und kontextbezogenere Antworten nutzen können.
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/de/knowledgebase/tags.mdx

```text
---
title: Tags und Filterung
---

import { Video } from '@/components/ui/video'

Tags bieten eine leistungsstarke Möglichkeit, Ihre Dokumente zu organisieren und präzise Filterungen für Ihre Vektorsuchen zu erstellen. Durch die Kombination von tag-basierter Filterung mit semantischer Suche können Sie genau die Inhalte aus Ihrer Wissensdatenbank abrufen, die Sie benötigen.

## Tags zu Dokumenten hinzufügen

Sie können jedem Dokument in Ihrer Wissensdatenbank benutzerdefinierte Tags hinzufügen, um Ihre Inhalte zu organisieren und zu kategorisieren und so leichter auffindbar zu machen.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag.mp4" width={700} height={450} />
</div>

### Tag-Verwaltung
- **Benutzerdefinierte Tags**: Erstellen Sie Ihr eigenes Tag-System, das zu Ihrem Arbeitsablauf passt
- **Mehrere Tags pro Dokument**: Wenden Sie so viele Tags wie nötig auf jedes Dokument an, es stehen 7 Tag-Slots pro Wissensdatenbank zur Verfügung, die von allen Dokumenten in der Wissensdatenbank gemeinsam genutzt werden
- **Tag-Organisation**: Gruppieren Sie verwandte Dokumente mit einheitlichen Tags

### Best Practices für Tags
- **Einheitliche Benennung**: Verwenden Sie standardisierte Tag-Namen für alle Ihre Dokumente
- **Beschreibende Tags**: Verwenden Sie klare, aussagekräftige Tag-Namen
- **Regelmäßige Bereinigung**: Entfernen Sie ungenutzte oder veraltete Tags regelmäßig

## Verwendung von Tags in Wissensblöcken

Tags werden besonders leistungsstark, wenn sie mit dem Wissensblock in Ihren Workflows kombiniert werden. Sie können Ihre Suchen auf bestimmte getaggte Inhalte filtern und so sicherstellen, dass Ihre KI-Agenten die relevantesten Informationen erhalten.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag2.mp4" width={700} height={450} />
</div>

## Suchmodi

Der Wissensblock unterstützt drei verschiedene Suchmodi, abhängig davon, was Sie angeben:

### 1. Nur-Tag-Suche
Wenn Sie **nur Tags angeben** (keine Suchanfrage):
- **Direkter Abruf**: Ruft alle Dokumente ab, die die angegebenen Tags haben
- **Keine Vektorsuche**: Ergebnisse basieren ausschließlich auf Tag-Übereinstimmung
- **Schnelle Leistung**: Schneller Abruf ohne semantische Verarbeitung
- **Exakte Übereinstimmung**: Nur Dokumente mit allen angegebenen Tags werden zurückgegeben

**Anwendungsfall**: Wenn du alle Dokumente aus einer bestimmten Kategorie oder einem Projekt benötigst

### 2. Nur Vektorsuche
Wenn du **nur eine Suchanfrage angibst** (keine Tags):
- **Semantische Suche**: Findet Inhalte basierend auf Bedeutung und Kontext
- **Vollständige Wissensdatenbank**: Durchsucht alle Dokumente
- **Relevanz-Ranking**: Ergebnisse nach semantischer Ähnlichkeit geordnet
- **Natürliche Sprache**: Verwende Fragen oder Phrasen, um relevante Inhalte zu finden

**Anwendungsfall**: Wenn du die relevantesten Inhalte unabhängig von der Organisation benötigst

### 3. Kombinierte Tag-Filterung + Vektorsuche
Wenn du **sowohl Tags als auch eine Suchanfrage angibst**:
1. **Zuerst**: Filtere Dokumente auf solche mit den angegebenen Tags
2. **Dann**: Führe eine Vektorsuche innerhalb dieser gefilterten Teilmenge durch
3. **Ergebnis**: Semantisch relevante Inhalte nur aus deinen getaggten Dokumenten

**Anwendungsfall**: Wenn du relevante Inhalte aus einer bestimmten Kategorie oder einem Projekt benötigst

### Suchkonfiguration

#### Tag-Filterung
- **Mehrere Tags**: Verwende mehrere Tags für ODER-Logik (Dokument muss einen oder mehrere der Tags haben)
- **Tag-Kombinationen**: Mische verschiedene Tag-Typen für präzise Filterung
- **Groß-/Kleinschreibung**: Tag-Abgleich ist unabhängig von Groß-/Kleinschreibung
- **Teilabgleich**: Exakte Übereinstimmung des Tag-Namens erforderlich

#### Vektorsuche-Parameter
- **Abfragekomplexität**: Fragen in natürlicher Sprache funktionieren am besten
- **Ergebnislimits**: Konfiguriere, wie viele Chunks abgerufen werden sollen
- **Relevanzschwelle**: Lege minimale Ähnlichkeitswerte fest
- **Kontextfenster**: Passe die Chunk-Größe an deinen Anwendungsfall an

## Integration mit Workflows

### Konfiguration des Wissensblocks
1. **Wissensdatenbank auswählen**: Wähle aus, welche Wissensdatenbank durchsucht werden soll
2. **Tags hinzufügen**: Gib Filterungs-Tags an (optional)
3. **Anfrage eingeben**: Füge deine Suchanfrage hinzu (optional)
4. **Ergebnisse konfigurieren**: Lege die Anzahl der abzurufenden Chunks fest
5. **Suche testen**: Sieh dir die Ergebnisse an, bevor du sie im Workflow verwendest

### Dynamische Tag-Nutzung
- **Variable Tags**: Verwenden Sie Workflow-Variablen als Tag-Werte
- **Bedingte Filterung**: Wenden Sie verschiedene Tags basierend auf Workflow-Logik an
- **Kontextbezogene Suche**: Passen Sie Tags basierend auf dem Gesprächskontext an
- **Mehrstufige Filterung**: Verfeinern Sie Suchen durch Workflow-Schritte

### Leistungsoptimierung
- **Effiziente Filterung**: Tag-Filterung erfolgt vor der Vektorsuche für bessere Leistung
- **Caching**: Häufig verwendete Tag-Kombinationen werden für Geschwindigkeit zwischengespeichert
- **Parallele Verarbeitung**: Mehrere Tag-Suchen können gleichzeitig ausgeführt werden
- **Ressourcenmanagement**: Automatische Optimierung der Suchressourcen

## Erste Schritte mit Tags

1. **Planen Sie Ihre Tag-Struktur**: Entscheiden Sie sich für einheitliche Namenskonventionen
2. **Beginnen Sie mit dem Taggen**: Fügen Sie Ihren vorhandenen Dokumenten relevante Tags hinzu
3. **Testen Sie Kombinationen**: Experimentieren Sie mit Tag- und Suchanfragekombinationen
4. **Integration in Workflows**: Verwenden Sie den Knowledge-Block mit Ihrer Tagging-Strategie
5. **Verfeinern Sie im Laufe der Zeit**: Passen Sie Ihren Tagging-Ansatz basierend auf Suchergebnissen an

Tags verwandeln Ihre Wissensdatenbank von einem einfachen Dokumentenspeicher in ein präzise organisiertes, durchsuchbares Intelligenzsystem, das Ihre KI-Workflows mit chirurgischer Präzision navigieren können.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/mcp/index.mdx

```text
---
title: MCP (Model Context Protocol)
---

import { Image } from '@/components/ui/image'
import { Callout } from 'fumadocs-ui/components/callout'

Das Model Context Protocol ([MCP](https://modelcontextprotocol.com/)) ermöglicht es Ihnen, externe Tools und Dienste über ein standardisiertes Protokoll zu verbinden, wodurch Sie APIs und Dienste direkt in Ihre Workflows integrieren können. Mit MCP können Sie die Fähigkeiten von Sim erweitern, indem Sie benutzerdefinierte Integrationen hinzufügen, die nahtlos mit Ihren Agenten und Workflows zusammenarbeiten.

## Was ist MCP?

MCP ist ein offener Standard, der es KI-Assistenten ermöglicht, sich sicher mit externen Datenquellen und Tools zu verbinden. Es bietet eine standardisierte Methode, um:

- Verbindungen zu Datenbanken, APIs und Dateisystemen herzustellen
- Auf Echtzeitdaten von externen Diensten zuzugreifen
- Benutzerdefinierte Tools und Skripte auszuführen
- Sicheren, kontrollierten Zugriff auf externe Ressourcen zu gewährleisten

## Konfiguration von MCP-Servern

MCP-Server stellen Sammlungen von Tools bereit, die Ihre Agenten nutzen können. Konfigurieren Sie diese in den Workspace-Einstellungen:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-1.png"
    alt="Konfiguration eines MCP-Servers in den Einstellungen"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Navigieren Sie zu Ihren Workspace-Einstellungen
2. Gehen Sie zum Abschnitt **MCP-Server**
3. Klicken Sie auf **MCP-Server hinzufügen**
4. Geben Sie die Server-Konfigurationsdetails ein
5. Speichern Sie die Konfiguration

<Callout type="info">
Sie können MCP-Server auch direkt über die Symbolleiste in einem Agent-Block für eine schnelle Einrichtung konfigurieren.
</Callout>

## Verwendung von MCP-Tools in Agenten

Sobald MCP-Server konfiguriert sind, werden ihre Tools innerhalb Ihrer Agent-Blöcke verfügbar:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-2.png"
    alt="Verwendung eines MCP-Tools im Agent-Block"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Öffnen Sie einen **Agent**-Block
2. Im Abschnitt **Tools** sehen Sie die verfügbaren MCP-Tools
3. Wählen Sie die Tools aus, die der Agent verwenden soll
4. Der Agent kann nun während der Ausführung auf diese Tools zugreifen

## Eigenständiger MCP-Tool-Block

Für eine genauere Kontrolle können Sie den dedizierten MCP-Tool-Block verwenden, um bestimmte MCP-Tools auszuführen:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-3.png"
    alt="Eigenständiger MCP-Tool-Block"
    width={700}
    height={450}
    className="my-6"
  />
</div>

Der MCP-Tool-Block ermöglicht es Ihnen:
- Jedes konfigurierte MCP-Tool direkt auszuführen
- Spezifische Parameter an das Tool zu übergeben
- Die Ausgabe des Tools in nachfolgenden Workflow-Schritten zu verwenden
- Mehrere MCP-Tools miteinander zu verketten

### Wann MCP-Tool vs. Agent verwenden

**Verwenden Sie einen Agenten mit MCP-Tools, wenn:**
- Sie möchten, dass die KI entscheidet, welche Tools zu verwenden sind
- Sie komplexe Überlegungen benötigen, wann und wie Tools eingesetzt werden sollen
- Sie eine natürlichsprachliche Interaktion mit den Tools wünschen

**Verwenden Sie den MCP-Tool-Block, wenn:**
- Sie eine deterministische Tool-Ausführung benötigen
- Sie ein bestimmtes Tool mit bekannten Parametern ausführen möchten
- Sie strukturierte Workflows mit vorhersehbaren Schritten erstellen

## Berechtigungsanforderungen

MCP-Funktionalität erfordert spezifische Workspace-Berechtigungen:

| Aktion | Erforderliche Berechtigung |
|--------|-------------------|
| MCP-Server in den Einstellungen konfigurieren | **Admin** |
| MCP-Tools in Agenten verwenden | **Write** oder **Admin** |
| Verfügbare MCP-Tools anzeigen | **Read**, **Write** oder **Admin** |
| MCP-Tool-Blöcke ausführen | **Write** oder **Admin** |

## Häufige Anwendungsfälle

### Datenbankintegration
Verbinden Sie sich mit Datenbanken, um Daten innerhalb Ihrer Workflows abzufragen, einzufügen oder zu aktualisieren.

### API-Integrationen
Greifen Sie auf externe APIs und Webdienste zu, die keine integrierten Sim-Integrationen haben.

### Dateisystemzugriff
Lesen, schreiben und bearbeiten Sie Dateien auf lokalen oder entfernten Dateisystemen.

### Benutzerdefinierte Geschäftslogik
Führen Sie benutzerdefinierte Skripte oder Tools aus, die auf die Bedürfnisse Ihrer Organisation zugeschnitten sind.

### Echtzeit-Datenzugriff
Rufen Sie Live-Daten von externen Systemen während der Workflow-Ausführung ab.

## Sicherheitsüberlegungen

- MCP-Server laufen mit den Berechtigungen des Benutzers, der sie konfiguriert hat
- Überprüfen Sie immer die MCP-Server-Quellen vor der Installation
- Verwenden Sie Umgebungsvariablen für sensible Konfigurationsdaten
- Überprüfen Sie die MCP-Server-Funktionen, bevor Sie Agenten Zugriff gewähren

## Fehlerbehebung

### MCP-Server erscheint nicht
- Überprüfen Sie, ob die Serverkonfiguration korrekt ist
- Prüfen Sie, ob Sie die erforderlichen Berechtigungen haben
- Stellen Sie sicher, dass der MCP-Server läuft und zugänglich ist

### Fehler bei der Tool-Ausführung
- Überprüfen Sie, ob die Tool-Parameter korrekt formatiert sind
- Prüfen Sie die MCP-Server-Logs auf Fehlermeldungen
- Stellen Sie sicher, dass die erforderliche Authentifizierung konfiguriert ist

### Berechtigungsfehler
- Bestätigen Sie Ihre Workspace-Berechtigungsstufe
- Prüfen Sie, ob der MCP-Server zusätzliche Authentifizierung erfordert
- Stellen Sie sicher, dass der Server für Ihren Workspace richtig konfiguriert ist
```

--------------------------------------------------------------------------------

````
