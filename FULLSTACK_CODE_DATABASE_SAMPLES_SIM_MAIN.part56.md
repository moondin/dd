---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 56
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 56 of 933)

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

---[FILE: zoom.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/zoom.mdx

```text
---
title: Zoom
description: Zoom-Meetings und -Aufzeichnungen erstellen und verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zoom"
  color="#2D8CFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zoom](https://zoom.us/) ist eine führende cloudbasierte Kommunikationsplattform für Videomeetings, Webinare und Online-Zusammenarbeit. Sie ermöglicht Benutzern und Organisationen, Meetings einfach zu planen, zu hosten und zu verwalten und bietet Tools für Bildschirmfreigabe, Chat, Aufzeichnungen und mehr.

Mit Zoom können Sie:

- **Meetings planen und verwalten**: Sofortige oder geplante Meetings erstellen, einschließlich wiederkehrender Termine
- **Meeting-Optionen konfigurieren**: Meeting-Passwörter festlegen, Warteräume aktivieren und Video/Audio der Teilnehmer steuern
- **Einladungen versenden und Details teilen**: Meeting-Einladungen und Informationen zum einfachen Teilen abrufen
- **Meeting-Daten abrufen und aktualisieren**: Auf Meeting-Details zugreifen, bestehende Meetings ändern und Einstellungen programmgesteuert verwalten

In Sim ermöglicht die Zoom-Integration Ihren Agenten die Automatisierung der Planung und Meeting-Verwaltung. Verwenden Sie Tool-Aktionen, um:

- Neue Meetings mit benutzerdefinierten Einstellungen programmgesteuert zu erstellen
- Alle Meetings für einen bestimmten Benutzer (oder sich selbst) aufzulisten
- Details oder Einladungen für jedes Meeting abzurufen
- Bestehende Meetings direkt aus Ihren Automatisierungen zu aktualisieren oder zu löschen

Um eine Verbindung zu Zoom herzustellen, fügen Sie den Zoom-Block ein und klicken Sie auf `Connect`, um sich mit Ihrem Zoom-Konto zu authentifizieren. Nach der Verbindung können Sie die Zoom-Tools verwenden, um Zoom-Meetings zu erstellen, aufzulisten, zu aktualisieren und zu löschen. Sie können Ihr Zoom-Konto jederzeit trennen, indem Sie unter Einstellungen > Integrationen auf `Disconnect` klicken, und der Zugriff auf Ihr Zoom-Konto wird sofort widerrufen.

Diese Funktionen ermöglichen es Ihnen, die Zusammenarbeit aus der Ferne zu optimieren, wiederkehrende Videositzungen zu automatisieren und die Zoom-Umgebung Ihrer Organisation als Teil Ihrer Workflows zu verwalten.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Zoom in Workflows. Erstellen, listen, aktualisieren und löschen Sie Zoom-Meetings. Erhalten Sie Meeting-Details, Einladungen, Aufzeichnungen und Teilnehmerinformationen. Verwalten Sie Cloud-Aufzeichnungen programmatisch.

## Tools

### `zoom_create_meeting`

Ein neues Zoom-Meeting erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Die Benutzer-ID oder E-Mail-Adresse. Verwenden Sie "me" für den authentifizierten Benutzer. |
| `topic` | string | Ja | Meeting-Thema |
| `type` | number | Nein | Meeting-Typ: 1=sofort, 2=geplant, 3=wiederkehrend ohne feste Zeit, 8=wiederkehrend mit fester Zeit |
| `startTime` | string | Nein | Meeting-Startzeit im ISO 8601-Format \(z.B. 2025-06-03T10:00:00Z\) |
| `duration` | number | Nein | Meeting-Dauer in Minuten |
| `timezone` | string | Nein | Zeitzone für das Meeting \(z.B. America/Los_Angeles\) |
| `password` | string | Nein | Meeting-Passwort |
| `agenda` | string | Nein | Meeting-Agenda |
| `hostVideo` | boolean | Nein | Mit eingeschaltetem Host-Video starten |
| `participantVideo` | boolean | Nein | Mit eingeschaltetem Teilnehmer-Video starten |
| `joinBeforeHost` | boolean | Nein | Teilnehmern erlauben, vor dem Host beizutreten |
| `muteUponEntry` | boolean | Nein | Teilnehmer beim Betreten stummschalten |
| `waitingRoom` | boolean | Nein | Warteraum aktivieren |
| `autoRecording` | string | Nein | Automatische Aufzeichnungseinstellung: local, cloud oder none |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `meeting` | object | Das erstellte Meeting mit allen seinen Eigenschaften |

### `zoom_list_meetings`

Alle Meetings für einen Zoom-Benutzer auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Die Benutzer-ID oder E-Mail-Adresse. Verwenden Sie "me" für den authentifizierten Benutzer. |
| `type` | string | Nein | Meeting-Typ-Filter: scheduled, live, upcoming, upcoming_meetings oder previous_meetings |
| `pageSize` | number | Nein | Anzahl der Datensätze pro Seite \(max. 300\) |
| `nextPageToken` | string | Nein | Token für Paginierung, um die nächste Ergebnisseite zu erhalten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `meetings` | array | Liste der Meetings |
| `pageInfo` | object | Paginierungsinformationen |

### `zoom_get_meeting`

Details eines bestimmten Zoom-Meetings abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die Meeting-ID |
| `occurrenceId` | string | Nein | Vorkommnis-ID für wiederkehrende Meetings |
| `showPreviousOccurrences` | boolean | Nein | Frühere Vorkommnisse für wiederkehrende Meetings anzeigen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `meeting` | object | Die Meeting-Details |

Details eines bestimmten Zoom-Meetings abrufen

Ein bestehendes Zoom-Meeting aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die zu aktualisierende Meeting-ID |
| `topic` | string | Nein | Meeting-Thema |
| `type` | number | Nein | Meeting-Typ: 1=sofort, 2=geplant, 3=wiederkehrend ohne feste Zeit, 8=wiederkehrend mit fester Zeit |
| `startTime` | string | Nein | Meeting-Startzeit im ISO 8601-Format \(z.B. 2025-06-03T10:00:00Z\) |
| `duration` | number | Nein | Meeting-Dauer in Minuten |
| `timezone` | string | Nein | Zeitzone für das Meeting \(z.B. Europe/Berlin\) |
| `password` | string | Nein | Meeting-Passwort |
| `agenda` | string | Nein | Meeting-Agenda |
| `hostVideo` | boolean | Nein | Mit eingeschaltetem Host-Video starten |
| `participantVideo` | boolean | Nein | Mit eingeschaltetem Teilnehmer-Video starten |
| `joinBeforeHost` | boolean | Nein | Teilnehmern erlauben, vor dem Host beizutreten |
| `muteUponEntry` | boolean | Nein | Teilnehmer beim Betreten stummschalten |
| `waitingRoom` | boolean | Nein | Warteraum aktivieren |
| `autoRecording` | string | Nein | Automatische Aufzeichnungseinstellung: local, cloud oder none |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Meeting erfolgreich aktualisiert wurde |

Ein Zoom-Meeting löschen

Ein Zoom-Meeting löschen oder abbrechen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die zu löschende Meeting-ID |
| `occurrenceId` | string | Nein | Occurrence-ID zum Löschen eines bestimmten Termins eines wiederkehrenden Meetings |
| `scheduleForReminder` | boolean | Nein | Erinnerungs-E-Mail zur Stornierung an Teilnehmer senden |
| `cancelMeetingReminder` | boolean | Nein | Stornierungs-E-Mail an Teilnehmer und alternative Hosts senden |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob das Meeting erfolgreich gelöscht wurde |

### `zoom_get_meeting_invitation`

Den Einladungstext für ein Zoom-Meeting abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die Meeting-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `invitation` | string | Der Meeting-Einladungstext |

### `zoom_list_recordings`

Alle Cloud-Aufzeichnungen eines Zoom-Benutzers auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Ja | Die Benutzer-ID oder E-Mail-Adresse. Verwenden Sie "me" für den authentifizierten Benutzer. |
| `from` | string | Nein | Startdatum im Format yyyy-mm-dd (innerhalb der letzten 6 Monate) |
| `to` | string | Nein | Enddatum im Format yyyy-mm-dd |
| `pageSize` | number | Nein | Anzahl der Datensätze pro Seite (max. 300) |
| `nextPageToken` | string | Nein | Token für die Paginierung, um die nächste Ergebnisseite zu erhalten |
| `trash` | boolean | Nein | Auf true setzen, um Aufzeichnungen aus dem Papierkorb aufzulisten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `recordings` | array | Liste der Aufzeichnungen |
| `pageInfo` | object | Paginierungsinformationen |

Alle Aufzeichnungen für ein bestimmtes Zoom-Meeting abrufen

Alle Aufzeichnungen für ein bestimmtes Zoom-Meeting abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die Meeting-ID oder Meeting-UUID |
| `includeFolderItems` | boolean | Nein | Elemente innerhalb eines Ordners einbeziehen |
| `ttl` | number | Nein | Gültigkeitsdauer für Download-URLs in Sekunden \(max. 604800\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `recording` | object | Die Meeting-Aufzeichnung mit allen Dateien |

Cloud-Aufzeichnungen für ein Zoom-Meeting löschen

Cloud-Aufzeichnungen für ein Zoom-Meeting löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die Meeting-ID oder Meeting-UUID |
| `recordingId` | string | Nein | Spezifische Aufzeichnungsdatei-ID zum Löschen. Wenn nicht angegeben, werden alle Aufzeichnungen gelöscht. |
| `action` | string | Nein | Löschaktion: "trash" \(in Papierkorb verschieben\) oder "delete" \(dauerhaft löschen\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Aufzeichnung erfolgreich gelöscht wurde |

Teilnehmer eines vergangenen Zoom-Meetings auflisten

Teilnehmer eines vergangenen Zoom-Meetings auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Ja | Die vergangene Meeting-ID oder UUID |
| `pageSize` | number | Nein | Anzahl der Datensätze pro Seite \(max. 300\) |
| `nextPageToken` | string | Nein | Token für Paginierung, um die nächste Ergebnisseite zu erhalten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `participants` | array | Liste der Meeting-Teilnehmer |
| `pageInfo` | object | Paginierungsinformationen |

## Hinweise

- Kategorie: `tools`
- Typ: `zoom`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/triggers/index.mdx

```text
---
title: Übersicht
description: Trigger sind die grundlegenden Möglichkeiten, um Sim-Workflows zu starten
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

<div className="flex justify-center">
  <Image
    src="/static/blocks/triggers.png"
    alt="Triggers-Übersicht"
    width={500}
    height={350}
    className="my-6"
  />
</div>

## Kern-Trigger

Verwende den Start-Block für alles, was aus dem Editor, deploy-to-API oder deploy-to-chat Erfahrungen stammt. Andere Trigger bleiben für ereignisgesteuerte Workflows verfügbar:

<Cards>
  <Card title="Start" href="/triggers/start">
    Einheitlicher Einstiegspunkt, der Editor-Ausführungen, API-Bereitstellungen und Chat-Bereitstellungen unterstützt
  </Card>
  <Card title="Webhook" href="/triggers/webhook">
    Externe Webhook-Payloads empfangen
  </Card>
  <Card title="Schedule" href="/triggers/schedule">
    Cron- oder intervallbasierte Ausführung
  </Card>
  <Card title="RSS Feed" href="/triggers/rss">
    RSS- und Atom-Feeds auf neue Inhalte überwachen
  </Card>
</Cards>

## Schneller Vergleich

| Trigger | Startbedingung |
|---------|-----------------|
| **Start** | Editor-Ausführungen, Deploy-to-API-Anfragen oder Chat-Nachrichten |
| **Schedule** | Timer, der im Schedule-Block verwaltet wird |
| **Webhook** | Bei eingehender HTTP-Anfrage |
| **RSS Feed** | Neues Element im Feed veröffentlicht |

> Der Start-Block stellt immer `input`, `conversationId` und `files` Felder bereit. Füge benutzerdefinierte Felder zum Eingabeformat für zusätzliche strukturierte Daten hinzu.

## Verwendung von Triggern

1. Platziere den Start-Block im Start-Slot (oder einen alternativen Trigger wie Webhook/Schedule).
2. Konfiguriere alle erforderlichen Schema- oder Auth-Einstellungen.
3. Verbinde den Block mit dem Rest des Workflows.

> Bereitstellungen steuern jeden Trigger. Aktualisiere den Workflow, stelle ihn erneut bereit, und alle Trigger-Einstiegspunkte übernehmen den neuen Snapshot. Erfahre mehr unter [Ausführung → Bereitstellungs-Snapshots](/execution).

## Priorität bei manueller Ausführung

Wenn du im Editor auf **Run** klickst, wählt Sim automatisch aus, welcher Trigger basierend auf der folgenden Prioritätsreihenfolge ausgeführt wird:

1. **Start-Block** (höchste Priorität)
2. **Schedule-Trigger**
3. **Externe Trigger** (Webhooks, Integrationen wie Slack, Gmail, Airtable usw.)

Wenn dein Workflow mehrere Trigger hat, wird der Trigger mit der höchsten Priorität ausgeführt. Wenn du beispielsweise sowohl einen Start-Block als auch einen Webhook-Trigger hast, wird beim Klicken auf Run der Start-Block ausgeführt.

**Externe Auslöser mit Mock-Payloads**: Wenn externe Auslöser (Webhooks und Integrationen) manuell ausgeführt werden, generiert Sim automatisch Mock-Payloads basierend auf der erwarteten Datenstruktur des Auslösers. Dies stellt sicher, dass nachgelagerte Blöcke während des Testens Variablen korrekt auflösen können.
```

--------------------------------------------------------------------------------

---[FILE: rss.mdx]---
Location: sim-main/apps/docs/content/docs/de/triggers/rss.mdx

```text
---
title: RSS-Feed
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

Der RSS-Feed-Block überwacht RSS- und Atom-Feeds – wenn neue Einträge veröffentlicht werden, wird Ihr Workflow automatisch ausgelöst.

<div className="flex justify-center">
  <Image
    src="/static/blocks/rss.png"
    alt="RSS-Feed-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Konfiguration

1. **RSS-Feed-Block hinzufügen** - Ziehen Sie den RSS-Feed-Block, um Ihren Workflow zu starten
2. **Feed-URL eingeben** - Fügen Sie die URL eines beliebigen RSS- oder Atom-Feeds ein
3. **Bereitstellen** - Stellen Sie Ihren Workflow bereit, um das Polling zu aktivieren

Nach der Bereitstellung wird der Feed jede Minute auf neue Einträge überprüft.

## Ausgabefelder

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `title` | string | Titel des Eintrags |
| `link` | string | Link des Eintrags |
| `pubDate` | string | Veröffentlichungsdatum |
| `item` | object | Rohdaten des Eintrags mit allen Feldern |
| `feed` | object | Rohdaten der Feed-Metadaten |

Greifen Sie direkt auf zugeordnete Felder zu (`<rss.title>`) oder verwenden Sie die Rohobjekte für beliebige Felder (`<rss.item.author>`, `<rss.feed.language>`).

## Anwendungsfälle

- **Inhaltsüberwachung** - Verfolgen Sie Blogs, Nachrichtenseiten oder Updates von Wettbewerbern
- **Podcast-Automatisierung** - Lösen Sie Workflows aus, wenn neue Episoden erscheinen
- **Release-Tracking** - Überwachen Sie GitHub-Releases, Changelogs oder Produkt-Updates
- **Social-Media-Aggregation** - Sammeln Sie Inhalte von Plattformen, die RSS-Feeds anbieten

<Callout>
RSS-Trigger werden nur für Einträge ausgelöst, die nach dem Speichern des Triggers veröffentlicht wurden. Bestehende Feed-Einträge werden nicht verarbeitet.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/de/triggers/schedule.mdx

```text
---
title: Zeitplan
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Der Zeitplan-Block löst Workflows automatisch nach einem wiederkehrenden Zeitplan zu bestimmten Intervallen oder Zeiten aus.

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule.png"
    alt="Zeitplan-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Zeitplan-Optionen

Konfigurieren Sie, wann Ihr Workflow ausgeführt wird, mit den Dropdown-Optionen:

<Tabs items={['Einfache Intervalle', 'Cron-Ausdrücke']}>
  <Tab>
    <ul className="list-disc space-y-1 pl-6">
      <li><strong>Alle paar Minuten</strong>: 5, 15, 30 Minuten-Intervalle</li>
      <li><strong>Stündlich</strong>: Jede Stunde oder alle paar Stunden</li>
      <li><strong>Täglich</strong>: Einmal oder mehrmals pro Tag</li>
      <li><strong>Wöchentlich</strong>: Bestimmte Wochentage</li>
      <li><strong>Monatlich</strong>: Bestimmte Tage des Monats</li>
    </ul>
  </Tab>
  <Tab>
    <p>Verwenden Sie Cron-Ausdrücke für erweiterte Zeitplanung:</p>
    <div className="text-sm space-y-1">
      <div><code>0 9 * * 1-5</code> - Jeden Wochentag um 9 Uhr</div>
      <div><code>*/15 * * * *</code> - Alle 15 Minuten</div>
      <div><code>0 0 1 * *</code> - Am ersten Tag jedes Monats</div>
    </div>
  </Tab>
</Tabs>

## Zeitpläne konfigurieren

Wenn ein Workflow geplant ist:
- Der Zeitplan wird **aktiv** und zeigt die nächste Ausführungszeit an
- Klicken Sie auf die Schaltfläche **"Geplant"**, um den Zeitplan zu deaktivieren
- Zeitpläne werden nach **3 aufeinanderfolgenden Fehlern** automatisch deaktiviert

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-2.png"
    alt="Aktiver Zeitplan-Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Deaktivierter Zeitplan"
    width={500}
    height={350}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Deaktivierter Zeitplan"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Deaktivierte Zeitpläne zeigen an, wann sie zuletzt aktiv waren. Klicken Sie auf das **"Deaktiviert"**-Badge, um den Zeitplan wieder zu aktivieren.

<Callout>
Zeitplan-Blöcke können keine eingehenden Verbindungen empfangen und dienen ausschließlich als Workflow-Auslöser.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: start.mdx]---
Location: sim-main/apps/docs/content/docs/de/triggers/start.mdx

```text
---
title: Start
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Der Start-Block ist der Standard-Auslöser für Workflows, die in Sim erstellt werden. Er sammelt strukturierte Eingaben und verteilt sie an den Rest deines Graphen für Editor-Tests, API-Bereitstellungen und Chat-Erlebnisse.

<div className="flex justify-center">
  <Image
    src="/static/start.png"
    alt="Start-Block mit Eingabeformat-Feldern"
    width={360}
    height={380}
    className="my-6"
  />
</div>

<Callout type="info">
Der Start-Block befindet sich in der Startposition, wenn du einen Workflow erstellst. Behalte ihn dort, wenn du denselben Einstiegspunkt für Editor-Ausführungen, Deploy-to-API-Anfragen und Chat-Sitzungen verwenden möchtest. Tausche ihn mit Webhook- oder Schedule-Triggern aus, wenn du nur ereignisgesteuerte Ausführung benötigst.
</Callout>

## Von Start bereitgestellte Felder

Der Start-Block gibt je nach Ausführungsumgebung unterschiedliche Daten aus:

- **Eingabeformat-Felder** — Jedes Feld, das du hinzufügst, wird als <code>&lt;start.fieldName&gt;</code> verfügbar. Zum Beispiel erscheint ein `customerId`Feld als <code>&lt;start.customerId&gt;</code> in nachgelagerten Blöcken und Vorlagen.
- **Nur-Chat-Felder** — Wenn der Workflow über das Chat-Seitenfeld oder ein bereitgestelltes Chat-Erlebnis ausgeführt wird, stellt Sim auch <code>&lt;start.input&gt;</code> (neueste Benutzernachricht), <code>&lt;start.conversationId&gt;</code> (aktive Sitzungs-ID) und <code>&lt;start.files&gt;</code> (Chat-Anhänge) bereit.

Halte die Eingabeformat-Felder auf die Namen beschränkt, auf die du später verweisen möchtest – diese Werte sind die einzigen strukturierten Felder, die über Editor-, API- und Chat-Ausführungen hinweg geteilt werden.

## Konfiguriere das Eingabeformat

Verwende den Eingabeformat-Unterblock, um das Schema zu definieren, das für alle Ausführungsmodi gilt:

1. Füge ein Feld für jeden Wert hinzu, den du sammeln möchtest.
2. Wähle einen Typ (`string`, `number`, `boolean`, `object`, `array` oder `files`). Dateifelder akzeptieren Uploads von Chat- und API-Aufrufern.
3. Gib Standardwerte an, wenn du möchtest, dass das manuelle Ausführungsmodal automatisch Testdaten einfügt. Diese Standardwerte werden für bereitgestellte Ausführungen ignoriert.
4. Ordne Felder neu an, um zu steuern, wie sie im Editor-Formular erscheinen.

Referenzieren Sie strukturierte Werte nachgelagert mit Ausdrücken wie <code>&lt;start.customerId&gt;</code> abhängig vom Block, den Sie verbinden.

## Wie es sich je nach Einstiegspunkt verhält

<Tabs items={['Editor-Ausführung', 'Bereitstellung als API', 'Bereitstellung für Chat']}>
  <Tab>
    <div className="space-y-3">
      <p>
        Wenn Sie im Editor auf <strong>Ausführen</strong> klicken, rendert der Start-Block das Eingabeformat als Formular. Standardwerte erleichtern das erneute Testen ohne erneute Dateneingabe. Durch das Absenden des Formulars wird der Workflow sofort ausgelöst und die Werte werden unter <code>&lt;start.feldName&gt;</code> (zum Beispiel <code>&lt;start.sampleField&gt;</code>) verfügbar.
      </p>
      <p>
        Dateifelder im Formular werden direkt in die entsprechenden{' '}
        <code>&lt;start.fieldName&gt;</code> hochgeladen; verwenden Sie diese Werte,
        um nachgelagerte Tools oder Speicherschritte zu versorgen.
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        Die Bereitstellung als API verwandelt das Eingabeformat in einen JSON-Vertrag für Clients. Jedes Feld wird Teil des Anforderungskörpers, und Sim erzwingt primitive Typen bei der Aufnahme. Dateifelder erwarten Objekte, die auf hochgeladene Dateien verweisen; verwenden Sie den Ausführungs-Datei-Upload-Endpunkt, bevor Sie den Workflow aufrufen.
      </p>
      <p>
        API-Aufrufer können zusätzliche optionale Eigenschaften einbeziehen. Diese
        werden in den <code>&lt;start.fieldName&gt;</code>Ausgaben beibehalten, sodass
        Sie experimentieren können, ohne sofort neu bereitzustellen.
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        Bei Chat-Bereitstellungen bindet sich der Start-Block an die aktive Konversation. Die neueste Nachricht füllt <code>&lt;start.input&gt;</code>, die Sitzungskennung ist unter <code>&lt;start.conversationId&gt;</code> verfügbar, und Benutzeranhänge erscheinen unter <code>&lt;start.files&gt;</code>, zusammen mit allen Eingabeformatfeldern, die als <code>&lt;start.fieldName&gt;</code> definiert sind.
      </p>
      <p>
        Wenn Sie den Chat mit zusätzlichem strukturiertem Kontext starten (zum
        Beispiel aus einer Einbettung), wird dieser mit den entsprechenden{' '}
        <code>&lt;start.fieldName&gt;</code>Ausgaben zusammengeführt, wodurch
        nachgelagerte Blöcke konsistent mit API- und manuellen Ausführungen bleiben.
      </p>
    </div>
  </Tab>
</Tabs>

## Referenzierung von Start-Daten in nachgelagerten Komponenten

- Verbinde <code>&lt;start.fieldName&gt;</code> direkt mit Agenten, Tools oder Funktionen, die strukturierte Daten erwarten.
- Verwende Template-Syntax wie <code>&lt;start.sampleField&gt;</code> oder <code>&lt;start.files[0].url&gt;</code> (nur für Chat) in Prompt-Feldern.
- Halte <code>&lt;start.conversationId&gt;</code> bereit, wenn du Ausgaben gruppieren, den Gesprächsverlauf aktualisieren oder die Chat-API erneut aufrufen musst.

## Best Practices

- Behandle den Start-Block als einzigen Einstiegspunkt, wenn du sowohl API- als auch Chat-Aufrufer unterstützen möchtest.
- Bevorzuge benannte Eingabeformat-Felder gegenüber dem Parsen von rohem JSON in nachgelagerten Knoten; Typumwandlung erfolgt automatisch.
- Füge unmittelbar nach dem Start Validierung oder Routing hinzu, wenn bestimmte Felder für den Erfolg deines Workflows erforderlich sind.

- Verbinde <code>&lt;start.fieldName&gt;</code> direkt mit Agenten, Tools oder Funktionen, die strukturierte Daten erwarten.
- Verwende Template-Syntax wie <code>&lt;start.sampleField&gt;</code> oder <code>&lt;start.files[0].url&gt;</code> (nur im Chat) in Prompt-Feldern.
- Halte <code>&lt;start.conversationId&gt;</code> bereit, wenn du Ausgaben gruppieren, Gesprächsverlauf aktualisieren oder die Chat-API erneut aufrufen musst.

## Bewährte Praktiken

- Behandle den Start-Block als einzigen Einstiegspunkt, wenn du sowohl API- als auch Chat-Aufrufer unterstützen möchtest.
- Bevorzuge benannte Eingabeformat-Felder gegenüber dem Parsen von rohem JSON in nachgelagerten Knoten; Typumwandlung erfolgt automatisch.
- Füge Validierung oder Routing unmittelbar nach dem Start hinzu, wenn bestimmte Felder für den Erfolg deines Workflows erforderlich sind.
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/de/triggers/webhook.mdx

```text
---
title: Webhooks
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Webhooks ermöglichen externen Diensten die Ausführung von Workflows durch das Senden von HTTP-Anfragen an Ihren Workflow. Sim unterstützt zwei Ansätze für webhook-basierte Auslöser.

## Generischer Webhook-Auslöser

Der generische Webhook-Block erstellt einen flexiblen Endpunkt, der beliebige Payloads empfangen und Ihren Workflow auslösen kann:

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Generische Webhook-Konfiguration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

### Funktionsweise

1. **Generischen Webhook-Block hinzufügen** - Ziehen Sie den generischen Webhook-Block an den Anfang Ihres Workflows
2. **Payload konfigurieren** - Richten Sie die erwartete Payload-Struktur ein (optional)
3. **Webhook-URL erhalten** - Kopieren Sie den automatisch generierten eindeutigen Endpunkt
4. **Externe Integration** - Konfigurieren Sie Ihren externen Dienst, um POST-Anfragen an diese URL zu senden
5. **Workflow-Ausführung** - Jede Anfrage an die Webhook-URL löst den Workflow aus

### Funktionen

- **Flexible Payload**: Akzeptiert jede JSON-Payload-Struktur
- **Automatische Analyse**: Webhook-Daten werden automatisch analysiert und stehen nachfolgenden Blöcken zur Verfügung
- **Authentifizierung**: Optionale Bearer-Token- oder benutzerdefinierte Header-Authentifizierung
- **Rate-Limiting**: Eingebauter Schutz gegen Missbrauch
- **Deduplizierung**: Verhindert doppelte Ausführungen bei wiederholten Anfragen

<Callout type="info">
Der generische Webhook-Auslöser wird jedes Mal aktiviert, wenn die Webhook-URL eine Anfrage erhält, was ihn perfekt für Echtzeit-Integrationen macht.
</Callout>

## Auslösemodus für Service-Blöcke

Alternativ können Sie spezifische Service-Blöcke (wie Slack, GitHub usw.) im "Auslösemodus" verwenden, um speziellere Webhook-Endpunkte zu erstellen:

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="slack-trigger.mp4" width={700} height={450} />
</div>

### Einrichten des Trigger-Modus

1. **Service-Block hinzufügen** - Wähle einen Service-Block (z.B. Slack, GitHub, Airtable)
2. **Trigger-Modus aktivieren** - Schalte "Als Trigger verwenden" in den Block-Einstellungen ein
3. **Service konfigurieren** - Richte Authentifizierung und Event-Filter für diesen Service ein
4. **Webhook-Registrierung** - Der Service registriert den Webhook automatisch bei der externen Plattform
5. **Ereignisbasierte Ausführung** - Workflow wird nur für bestimmte Ereignisse dieses Services ausgelöst

### Wann welcher Ansatz verwendet werden sollte

**Verwende Generic Webhook, wenn:**
- Du mit benutzerdefinierten Anwendungen oder Diensten integrierst
- Du maximale Flexibilität bei der Payload-Struktur benötigst
- Du mit Diensten arbeitest, die keine dedizierten Blöcke haben
- Du interne Integrationen erstellst

**Verwende den Trigger-Modus, wenn:**
- Du mit unterstützten Diensten arbeitest (Slack, GitHub, etc.)
- Du dienstspezifische Ereignisfilterung benötigst
- Du automatische Webhook-Registrierung benötigst
- Du strukturierte Datenverarbeitung für diesen Dienst wünschst

## Unterstützte Dienste für den Trigger-Modus

**Entwicklung & Projektmanagement**
- GitHub - Issues, PRs, Pushes, Releases, Workflow-Ausführungen
- Jira - Issue-Events, Arbeitsprotokolle
- Linear - Issues, Kommentare, Projekte, Zyklen, Labels

**Kommunikation**
- Slack - Nachrichten, Erwähnungen, Reaktionen
- Microsoft Teams - Chat-Nachrichten, Kanal-Benachrichtigungen
- Telegram - Bot-Nachrichten, Befehle
- WhatsApp - Messaging-Events

**E-Mail**
- Gmail - Neue E-Mails (Polling), Label-Änderungen
- Outlook - Neue E-Mails (Polling), Ordner-Events

**CRM & Vertrieb**
- HubSpot - Kontakte, Unternehmen, Deals, Tickets, Konversationen
- Stripe - Zahlungen, Abonnements, Kunden

**Formulare & Umfragen**
- Typeform - Formularübermittlungen
- Google Forms - Formularantworten
- Webflow - Sammlungselemente, Formularübermittlungen

**Sonstiges**
- Airtable - Datensatzänderungen
- Twilio Voice - Eingehende Anrufe, Anrufstatus

## Sicherheit und Best Practices

### Authentifizierungsoptionen

- **Bearer Tokens**: `Authorization: Bearer <token>` Header einfügen
- **Benutzerdefinierte Header**: Benutzerdefinierte Authentifizierungs-Header definieren

### Payload-Verarbeitung

- **Validierung**: Eingehende Payloads validieren, um fehlerhafte Daten zu vermeiden
- **Größenbeschränkungen**: Webhooks haben Payload-Größenbeschränkungen aus Sicherheitsgründen
- **Fehlerbehandlung**: Fehlermeldungen für ungültige Anfragen konfigurieren

### Webhooks testen

1. Tools wie Postman oder curl verwenden, um Webhook-Endpunkte zu testen
2. Workflow-Ausführungsprotokolle zur Fehlerbehebung überprüfen
3. Sicherstellen, dass die Payload-Struktur den Erwartungen entspricht
4. Authentifizierungs- und Fehlerszenarien testen

<Callout type="warning">
Validieren und bereinigen Sie immer eingehende Webhook-Daten, bevor Sie sie in Ihren Workflows verarbeiten.
</Callout>

## Häufige Anwendungsfälle

### Echtzeit-Benachrichtigungen
- Slack-Nachrichten, die automatisierte Antworten auslösen
- E-Mail-Benachrichtigungen für kritische Ereignisse

### CI/CD-Integration  
- GitHub-Pushes, die Deployment-Workflows auslösen
- Build-Status-Aktualisierungen
- Automatisierte Test-Pipelines

### Datensynchronisierung
- Airtable-Änderungen, die andere Systeme aktualisieren
- Formularübermittlungen, die Folgemaßnahmen auslösen
- E-Commerce-Auftragsverarbeitung

### Kundensupport
- Workflows zur Erstellung von Support-Tickets
- Automatisierte Eskalationsprozesse
- Multi-Channel-Kommunikationsrouting
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/de/variables/environment-variables.mdx

```text
---
title: Umgebungsvariablen
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

Umgebungsvariablen bieten eine sichere Möglichkeit, Konfigurationswerte und Geheimnisse in Ihren Workflows zu verwalten, einschließlich API-Schlüssel und anderer sensibler Daten, auf die Ihre Workflows zugreifen müssen. Sie halten Geheimnisse aus Ihren Workflow-Definitionen heraus und machen sie während der Ausführung verfügbar.

## Variablentypen

Umgebungsvariablen in Sim funktionieren auf zwei Ebenen:

- **Persönliche Umgebungsvariablen**: Privat für Ihr Konto, nur Sie können sie sehen und verwenden
- **Workspace-Umgebungsvariablen**: Werden im gesamten Workspace geteilt und sind für alle Teammitglieder verfügbar

<Callout type="info">
Workspace-Umgebungsvariablen haben Vorrang vor persönlichen Variablen, wenn es einen Namenskonflikt gibt.
</Callout>

## Einrichten von Umgebungsvariablen

Navigieren Sie zu den Einstellungen, um Ihre Umgebungsvariablen zu konfigurieren:

<Image
  src="/static/environment/environment-1.png"
  alt="Umgebungsvariablen-Modal zum Erstellen neuer Variablen"
  width={500}
  height={350}
/>

In Ihren Workspace-Einstellungen können Sie sowohl persönliche als auch Workspace-Umgebungsvariablen erstellen und verwalten. Persönliche Variablen sind privat für Ihr Konto, während Workspace-Variablen mit allen Teammitgliedern geteilt werden.

### Variablen auf Workspace-Ebene setzen

Verwenden Sie den Workspace-Bereichsschalter, um Variablen für Ihr gesamtes Team verfügbar zu machen:

<Image
  src="/static/environment/environment-2.png"
  alt="Workspace-Bereich für Umgebungsvariablen umschalten"
  width={500}
  height={350}
/>

Wenn Sie den Workspace-Bereich aktivieren, wird die Variable für alle Workspace-Mitglieder verfügbar und kann in jedem Workflow innerhalb dieses Workspaces verwendet werden.

### Ansicht der Workspace-Variablen

Sobald Sie Workspace-Variablen haben, erscheinen sie in Ihrer Liste der Umgebungsvariablen:

<Image
  src="/static/environment/environment-3.png"
  alt="Workspace-Variablen in der Liste der Umgebungsvariablen"
  width={500}
  height={350}
/>

## Verwendung von Variablen in Workflows

Um Umgebungsvariablen in Ihren Workflows zu referenzieren, verwenden Sie die `{{}}` Notation. Wenn Sie `{{` in ein beliebiges Eingabefeld eingeben, erscheint ein Dropdown-Menü mit Ihren persönlichen und Workspace-Umgebungsvariablen. Wählen Sie einfach die Variable aus, die Sie verwenden möchten.

<Image
  src="/static/environment/environment-4.png"
  alt="Verwendung von Umgebungsvariablen mit doppelter Klammernotation"
  width={500}
  height={350}
/>

## Wie Variablen aufgelöst werden

**Workspace-Variablen haben immer Vorrang** vor persönlichen Variablen, unabhängig davon, wer den Workflow ausführt.

Wenn keine Workspace-Variable für einen Schlüssel existiert, werden persönliche Variablen verwendet:
- **Manuelle Ausführungen (UI)**: Ihre persönlichen Variablen
- **Automatisierte Ausführungen (API, Webhook, Zeitplan, bereitgestellter Chat)**: Persönliche Variablen des Workflow-Besitzers

<Callout type="info">
Persönliche Variablen eignen sich am besten zum Testen. Verwenden Sie Workspace-Variablen für Produktions-Workflows.
</Callout>

## Sicherheits-Best-Practices

### Für sensible Daten
- Speichern Sie API-Schlüssel, Tokens und Passwörter als Umgebungsvariablen anstatt sie im Code festzuschreiben
- Verwenden Sie Workspace-Variablen für gemeinsam genutzte Ressourcen, die mehrere Teammitglieder benötigen
- Bewahren Sie persönliche Anmeldedaten in persönlichen Variablen auf

### Variablenbenennung
- Verwenden Sie beschreibende Namen: `DATABASE_URL` anstatt `DB`
- Folgen Sie einheitlichen Benennungskonventionen in Ihrem Team
- Erwägen Sie Präfixe, um Konflikte zu vermeiden: `PROD_API_KEY`, `DEV_API_KEY`

### Zugriffskontrolle
- Workspace-Umgebungsvariablen respektieren Workspace-Berechtigungen
- Nur Benutzer mit Schreibzugriff oder höher können Workspace-Variablen erstellen/ändern
- Persönliche Variablen sind immer privat für den einzelnen Benutzer
```

--------------------------------------------------------------------------------

````
