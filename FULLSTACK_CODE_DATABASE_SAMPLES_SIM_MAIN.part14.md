---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 14
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 14 of 933)

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

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/de/execution/api.mdx

```text
---
title: Externe API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Sim bietet eine umfassende externe API zum Abfragen von Workflow-Ausführungsprotokollen und zum Einrichten von Webhooks für Echtzeit-Benachrichtigungen, wenn Workflows abgeschlossen werden.

## Authentifizierung

Alle API-Anfragen erfordern einen API-Schlüssel, der im Header `x-api-key` übergeben wird:

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://sim.ai/api/v1/logs?workspaceId=YOUR_WORKSPACE_ID
```

Sie können API-Schlüssel in Ihren Benutzereinstellungen im Sim-Dashboard generieren.

## Logs-API

Alle API-Antworten enthalten Informationen über Ihre Workflow-Ausführungslimits und -nutzung:

```json
"limits": {
  "workflowExecutionRateLimit": {
    "sync": {
      "requestsPerMinute": 60,  // Sustained rate limit per minute
      "maxBurst": 120,          // Maximum burst capacity
      "remaining": 118,         // Current tokens available (up to maxBurst)
      "resetAt": "..."          // When tokens next refill
    },
    "async": {
      "requestsPerMinute": 200, // Sustained rate limit per minute
      "maxBurst": 400,          // Maximum burst capacity
      "remaining": 398,         // Current tokens available
      "resetAt": "..."          // When tokens next refill
    }
  },
  "usage": {
    "currentPeriodCost": 1.234,  // Current billing period usage in USD
    "limit": 10,                  // Usage limit in USD
    "plan": "pro",                // Current subscription plan
    "isExceeded": false           // Whether limit is exceeded
  }
}
```

**Hinweis:** Ratenbegrenzungen verwenden einen Token-Bucket-Algorithmus. `remaining` kann `requestsPerMinute` bis zu `maxBurst` überschreiten, wenn du dein volles Kontingent in letzter Zeit nicht genutzt hast, was Burst-Traffic ermöglicht. Die Ratenbegrenzungen im Antworttext gelten für Workflow-Ausführungen. Die Ratenbegrenzungen für den Aufruf dieses API-Endpunkts befinden sich in den Antwort-Headern (`X-RateLimit-*`).

### Logs abfragen

Fragen Sie Workflow-Ausführungsprotokolle mit umfangreichen Filteroptionen ab.

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs
    ```

    **Erforderliche Parameter:**
    - `workspaceId` - Ihre Workspace-ID

    **Optionale Filter:**
    - `workflowIds` - Kommagetrennte Workflow-IDs
    - `folderIds` - Kommagetrennte Ordner-IDs
    - `triggers` - Kommagetrennte Auslösertypen: `api`, `webhook`, `schedule`, `manual`, `chat`
    - `level` - Nach Level filtern: `info`, `error`
    - `startDate` - ISO-Zeitstempel für den Beginn des Datumsbereichs
    - `endDate` - ISO-Zeitstempel für das Ende des Datumsbereichs
    - `executionId` - Exakte Übereinstimmung der Ausführungs-ID
    - `minDurationMs` - Minimale Ausführungsdauer in Millisekunden
    - `maxDurationMs` - Maximale Ausführungsdauer in Millisekunden
    - `minCost` - Minimale Ausführungskosten
    - `maxCost` - Maximale Ausführungskosten
    - `model` - Nach verwendetem KI-Modell filtern

    **Paginierung:**
    - `limit` - Ergebnisse pro Seite (Standard: 100)
    - `cursor` - Cursor für die nächste Seite
    - `order` - Sortierreihenfolge: `desc`, `asc` (Standard: desc)

    **Detailebene:**
    - `details` - Detailebene der Antwort: `basic`, `full` (Standard: basic)
    - `includeTraceSpans` - Trace-Spans einschließen (Standard: false)
    - `includeFinalOutput` - Endgültige Ausgabe einschließen (Standard: false)
  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": [
        {
          "id": "log_abc123",
          "workflowId": "wf_xyz789",
          "executionId": "exec_def456",
          "level": "info",
          "trigger": "api",
          "startedAt": "2025-01-01T12:34:56.789Z",
          "endedAt": "2025-01-01T12:34:57.123Z",
          "totalDurationMs": 334,
          "cost": {
            "total": 0.00234
          },
          "files": null
        }
      ],
      "nextCursor": "eyJzIjoiMjAyNS0wMS0wMVQxMjozNDo1Ni43ODlaIiwiaWQiOiJsb2dfYWJjMTIzIn0",
      "limits": {
        "workflowExecutionRateLimit": {
          "sync": {
            "requestsPerMinute": 60,
            "maxBurst": 120,
            "remaining": 118,
            "resetAt": "2025-01-01T12:35:56.789Z"
          },
          "async": {
            "requestsPerMinute": 200,
            "maxBurst": 400,
            "remaining": 398,
            "resetAt": "2025-01-01T12:35:56.789Z"
          }
        },
        "usage": {
          "currentPeriodCost": 1.234,
          "limit": 10,
          "plan": "pro",
          "isExceeded": false
        }
      }
    }
    ```

  </Tab>
</Tabs>

### Log-Details abrufen

Rufen Sie detaillierte Informationen zu einem bestimmten Logeintrag ab.

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/{id}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": {
        "id": "log_abc123",
        "workflowId": "wf_xyz789",
        "executionId": "exec_def456",
        "level": "info",
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "workflow": {
          "id": "wf_xyz789",
          "name": "My Workflow",
          "description": "Process customer data"
        },
        "executionData": {
          "traceSpans": [...],
          "finalOutput": {...}
        },
        "cost": {
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          },
          "models": {
            "gpt-4o": {
              "input": 0.001,
              "output": 0.00134,
              "total": 0.00234,
              "tokens": {
                "prompt": 123,
                "completion": 456,
                "total": 579
              }
            }
          }
        },
        "limits": {
          "workflowExecutionRateLimit": {
            "sync": {
              "requestsPerMinute": 60,
              "maxBurst": 120,
              "remaining": 118,
              "resetAt": "2025-01-01T12:35:56.789Z"
            },
            "async": {
              "requestsPerMinute": 200,
              "maxBurst": 400,
              "remaining": 398,
              "resetAt": "2025-01-01T12:35:56.789Z"
            }
          },
          "usage": {
            "currentPeriodCost": 1.234,
            "limit": 10,
            "plan": "pro",
            "isExceeded": false
          }
        }
      }
    }
    ```

  </Tab>
</Tabs>

### Ausführungsdetails abrufen

Rufen Sie Ausführungsdetails einschließlich des Workflow-Zustandsschnappschusses ab.

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/executions/{executionId}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "executionId": "exec_def456",
      "workflowId": "wf_xyz789",
      "workflowState": {
        "blocks": {...},
        "edges": [...],
        "loops": {...},
        "parallels": {...}
      },
      "executionMetadata": {
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "cost": {...}
      }
    }
    ```

  </Tab>
</Tabs>

## Benachrichtigungen

Erhalten Sie Echtzeit-Benachrichtigungen, wenn Workflow-Ausführungen abgeschlossen sind, per Webhook, E-Mail oder Slack. Benachrichtigungen werden auf Workspace-Ebene von der Protokollseite aus konfiguriert.

### Konfiguration

Konfigurieren Sie Benachrichtigungen von der Protokollseite aus, indem Sie auf die Menütaste klicken und "Benachrichtigungen konfigurieren" auswählen.

**Benachrichtigungskanäle:**
- **Webhook**: Senden Sie HTTP POST-Anfragen an Ihren Endpunkt
- **E-Mail**: Erhalten Sie E-Mail-Benachrichtigungen mit Ausführungsdetails
- **Slack**: Posten Sie Nachrichten in einen Slack-Kanal

**Workflow-Auswahl:**
- Wählen Sie bestimmte Workflows zur Überwachung aus
- Oder wählen Sie "Alle Workflows", um aktuelle und zukünftige Workflows einzubeziehen

**Filteroptionen:**
- `levelFilter`: Zu empfangende Protokollebenen (`info`, `error`)
- `triggerFilter`: Zu empfangende Auslösertypen (`api`, `webhook`, `schedule`, `manual`, `chat`)

**Optionale Daten:**
- `includeFinalOutput`: Schließt die endgültige Ausgabe des Workflows ein
- `includeTraceSpans`: Schließt detaillierte Ausführungs-Trace-Spans ein
- `includeRateLimits`: Schließt Informationen zum Ratenlimit ein (Sync/Async-Limits und verbleibende)
- `includeUsageData`: Schließt Abrechnungszeitraum-Nutzung und -Limits ein

### Alarmregeln

Anstatt Benachrichtigungen für jede Ausführung zu erhalten, konfigurieren Sie Alarmregeln, um nur bei erkannten Problemen benachrichtigt zu werden:

**Aufeinanderfolgende Fehler**
- Alarm nach X aufeinanderfolgenden fehlgeschlagenen Ausführungen (z.B. 3 Fehler in Folge)
- Wird zurückgesetzt, wenn eine Ausführung erfolgreich ist

**Fehlerrate**
- Alarm, wenn die Fehlerrate X% in den letzten Y Stunden überschreitet
- Erfordert mindestens 5 Ausführungen im Zeitfenster
- Wird erst nach Ablauf des vollständigen Zeitfensters ausgelöst

**Latenz-Schwellenwert**
- Alarm, wenn eine Ausführung länger als X Sekunden dauert
- Nützlich zum Erkennen langsamer oder hängender Workflows

**Latenz-Spitze**
- Alarm, wenn die Ausführung X% langsamer als der Durchschnitt ist
- Vergleicht mit der durchschnittlichen Dauer über das konfigurierte Zeitfenster
- Erfordert mindestens 5 Ausführungen, um eine Baseline zu etablieren

**Kostenschwelle**
- Alarmierung, wenn eine einzelne Ausführung mehr als $X kostet
- Nützlich, um teure LLM-Aufrufe zu erkennen

**Keine Aktivität**
- Alarmierung, wenn innerhalb von X Stunden keine Ausführungen stattfinden
- Nützlich zur Überwachung geplanter Workflows, die regelmäßig ausgeführt werden sollten

**Fehlerzählung**
- Alarmierung, wenn die Fehleranzahl X innerhalb eines Zeitfensters überschreitet
- Erfasst die Gesamtfehler, nicht aufeinanderfolgende

Alle Alarmtypen beinhalten eine Abklingzeit von 1 Stunde, um Benachrichtigungsspam zu vermeiden.

### Webhook-Konfiguration

Für Webhooks stehen zusätzliche Optionen zur Verfügung:
- `url`: Ihre Webhook-Endpunkt-URL
- `secret`: Optionales Geheimnis für HMAC-Signaturverifizierung

### Payload-Struktur

Wenn eine Workflow-Ausführung abgeschlossen ist, sendet Sim die folgende Payload (über Webhook POST, E-Mail oder Slack):

```json
{
  "id": "evt_123",
  "type": "workflow.execution.completed",
  "timestamp": 1735925767890,
  "data": {
    "workflowId": "wf_xyz789",
    "executionId": "exec_def456",
    "status": "success",
    "level": "info",
    "trigger": "api",
    "startedAt": "2025-01-01T12:34:56.789Z",
    "endedAt": "2025-01-01T12:34:57.123Z",
    "totalDurationMs": 334,
    "cost": {
      "total": 0.00234,
      "tokens": {
        "prompt": 123,
        "completion": 456,
        "total": 579
      },
      "models": {
        "gpt-4o": {
          "input": 0.001,
          "output": 0.00134,
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          }
        }
      }
    },
    "files": null,
    "finalOutput": {...},  // Only if includeFinalOutput=true
    "traceSpans": [...],   // Only if includeTraceSpans=true
    "rateLimits": {...},   // Only if includeRateLimits=true
    "usage": {...}         // Only if includeUsageData=true
  },
  "links": {
    "log": "/v1/logs/log_abc123",
    "execution": "/v1/logs/executions/exec_def456"
  }
}
```

### Webhook-Header

Jede Webhook-Anfrage enthält diese Header (nur Webhook-Kanal):

- `sim-event`: Ereignistyp (immer `workflow.execution.completed`)
- `sim-timestamp`: Unix-Zeitstempel in Millisekunden
- `sim-delivery-id`: Eindeutige Zustell-ID für Idempotenz
- `sim-signature`: HMAC-SHA256-Signatur zur Verifizierung (falls Geheimnis konfiguriert)
- `Idempotency-Key`: Gleich wie Zustell-ID zur Erkennung von Duplikaten

### Signaturverifizierung

Wenn Sie ein Webhook-Geheimnis konfigurieren, überprüfen Sie die Signatur, um sicherzustellen, dass der Webhook von Sim stammt:

<Tabs items={['Node.js', 'Python']}>
  <Tab value="Node.js">

    ```javascript
    import crypto from 'crypto';

    function verifyWebhookSignature(body, signature, secret) {
      const [timestampPart, signaturePart] = signature.split(',');
      const timestamp = timestampPart.replace('t=', '');
      const expectedSignature = signaturePart.replace('v1=', '');
      
      const signatureBase = `${timestamp}.${body}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(signatureBase);
      const computedSignature = hmac.digest('hex');
      
      return computedSignature === expectedSignature;
    }

    // In your webhook handler
    app.post('/webhook', (req, res) => {
      const signature = req.headers['sim-signature'];
      const body = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
        return res.status(401).send('Invalid signature');
      }
      
      // Process the webhook...
    });
    ```

  </Tab>
  <Tab value="Python">

    ```python
    import hmac
    import hashlib
    import json

    def verify_webhook_signature(body: str, signature: str, secret: str) -> bool:
        timestamp_part, signature_part = signature.split(',')
        timestamp = timestamp_part.replace('t=', '')
        expected_signature = signature_part.replace('v1=', '')
        
        signature_base = f"{timestamp}.{body}"
        computed_signature = hmac.new(
            secret.encode(),
            signature_base.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(computed_signature, expected_signature)

    # In your webhook handler
    @app.route('/webhook', methods=['POST'])
    def webhook():
        signature = request.headers.get('sim-signature')
        body = json.dumps(request.json)
        
        if not verify_webhook_signature(body, signature, os.environ['WEBHOOK_SECRET']):
            return 'Invalid signature', 401
        
        # Process the webhook...
    ```

  </Tab>
</Tabs>

### Wiederholungsrichtlinie

Fehlgeschlagene Webhook-Zustellungen werden mit exponentiellem Backoff und Jitter wiederholt:

- Maximale Versuche: 5
- Wiederholungsverzögerungen: 5 Sekunden, 15 Sekunden, 1 Minute, 3 Minuten, 10 Minuten
- Jitter: Bis zu 10% zusätzliche Verzögerung, um Überlastung zu vermeiden
- Nur HTTP 5xx und 429 Antworten lösen Wiederholungen aus
- Zustellungen haben ein Timeout nach 30 Sekunden

<Callout type="info">
  Webhook-Zustellungen werden asynchron verarbeitet und beeinträchtigen nicht die Leistung der Workflow-Ausführung.
</Callout>

## Best Practices

1. **Polling-Strategie**: Verwende bei der Abfrage von Logs eine cursor-basierte Paginierung mit `order=asc` und `startDate`, um neue Logs effizient abzurufen.

2. **Webhook-Sicherheit**: Konfiguriere immer ein Webhook-Secret und überprüfe Signaturen, um sicherzustellen, dass Anfragen von Sim stammen.

3. **Idempotenz**: Verwende den `Idempotency-Key`Header, um doppelte Webhook-Zustellungen zu erkennen und zu behandeln.

4. **Datenschutz**: Standardmäßig werden `finalOutput` und `traceSpans` aus den Antworten ausgeschlossen. Aktiviere diese nur, wenn du die Daten benötigst und die Datenschutzauswirkungen verstehst.

5. **Rate-Limiting**: Implementiere exponentielles Backoff, wenn du 429-Antworten erhältst. Überprüfe den `Retry-After`Header für die empfohlene Wartezeit.

## Rate-Limiting

Die API verwendet einen **Token-Bucket-Algorithmus** für die Ratenbegrenzung, der eine faire Nutzung ermöglicht und gleichzeitig Burst-Traffic zulässt:

| Plan | Anfragen/Minute | Burst-Kapazität |
|------|-----------------|----------------|
| Free | 10 | 20 |
| Pro | 30 | 60 |
| Team | 60 | 120 |
| Enterprise | 120 | 240 |

**Wie es funktioniert:**
- Tokens werden mit der Rate `requestsPerMinute` aufgefüllt
- Du kannst im Leerlauf bis zu `maxBurst` Tokens ansammeln
- Jede Anfrage verbraucht 1 Token
- Die Burst-Kapazität ermöglicht die Bewältigung von Verkehrsspitzen

Informationen zur Ratenbegrenzung sind in den Antwort-Headern enthalten:
- `X-RateLimit-Limit`: Anfragen pro Minute (Auffüllrate)
- `X-RateLimit-Remaining`: Aktuell verfügbare Tokens
- `X-RateLimit-Reset`: ISO-Zeitstempel, wann Tokens als nächstes aufgefüllt werden

## Beispiel: Abfragen nach neuen Logs

```javascript
let cursor = null;
const workspaceId = 'YOUR_WORKSPACE_ID';
const startDate = new Date().toISOString();

async function pollLogs() {
  const params = new URLSearchParams({
    workspaceId,
    startDate,
    order: 'asc',
    limit: '100'
  });
  
  if (cursor) {
    params.append('cursor', cursor);
  }
  
  const response = await fetch(
    `https://sim.ai/api/v1/logs?${params}`,
    {
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    
    // Process new logs
    for (const log of data.data) {
      console.log(`New execution: ${log.executionId}`);
    }
    
    // Update cursor for next poll
    if (data.nextCursor) {
      cursor = data.nextCursor;
    }
  }
}

// Poll every 30 seconds
setInterval(pollLogs, 30000);
```

## Beispiel: Verarbeitung von Webhooks

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

app.post('/sim-webhook', (req, res) => {
  // Verify signature
  const signature = req.headers['sim-signature'];
  const body = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Check timestamp to prevent replay attacks
  const timestamp = parseInt(req.headers['sim-timestamp']);
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  
  if (timestamp < fiveMinutesAgo) {
    return res.status(401).send('Timestamp too old');
  }
  
  // Process the webhook
  const event = req.body;
  
  switch (event.type) {
    case 'workflow.execution.completed':
      const { workflowId, executionId, status, cost } = event.data;
      
      if (status === 'error') {
        console.error(`Workflow ${workflowId} failed: ${executionId}`);
        // Handle error...
      } else {
        console.log(`Workflow ${workflowId} completed: ${executionId}`);
        console.log(`Cost: $${cost.total}`);
        // Process successful execution...
      }
      break;
  }
  
  // Return 200 to acknowledge receipt
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/de/execution/basics.mdx

```text
---
title: Grundlagen
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Das Verständnis der Workflow-Ausführung in Sim ist entscheidend für die Erstellung effizienter und zuverlässiger Automatisierungen. Die Ausführungs-Engine verwaltet automatisch Abhängigkeiten, Parallelität und Datenfluss, um sicherzustellen, dass Ihre Workflows reibungslos und vorhersehbar ablaufen.

## Wie Workflows ausgeführt werden

Die Ausführungs-Engine von Sim verarbeitet Workflows intelligent, indem sie Abhängigkeiten analysiert und Blöcke in der effizientesten Reihenfolge ausführt.

### Parallele Ausführung als Standard

Mehrere Blöcke werden gleichzeitig ausgeführt, wenn sie nicht voneinander abhängig sind. Diese parallele Ausführung verbessert die Leistung erheblich, ohne dass eine manuelle Konfiguration erforderlich ist.

<Image
  src="/static/execution/concurrency.png"
  alt="Mehrere Blöcke, die nach dem Start-Block parallel ausgeführt werden"
  width={800}
  height={500}
/>

In diesem Beispiel werden sowohl der Kundensupport- als auch der Deep-Researcher-Agentenblock gleichzeitig nach dem Start-Block ausgeführt, was die Effizienz maximiert.

### Automatische Ausgabekombination

Wenn Blöcke mehrere Abhängigkeiten haben, wartet die Ausführungs-Engine automatisch auf den Abschluss aller Abhängigkeiten und stellt dann ihre kombinierten Ausgaben dem nächsten Block zur Verfügung. Keine manuelle Kombination erforderlich.

<Image
  src="/static/execution/combination.png"
  alt="Funktionsblock, der automatisch Ausgaben von mehreren vorherigen Blöcken empfängt"
  width={800}
  height={500}
/>

Der Funktionsblock erhält Ausgaben von beiden Agentenblöcken, sobald diese abgeschlossen sind, sodass Sie die kombinierten Ergebnisse verarbeiten können.

### Intelligentes Routing

Workflows können sich in mehrere Richtungen verzweigen, indem sie Routing-Blöcke verwenden. Die Ausführungs-Engine unterstützt sowohl deterministisches Routing (mit Bedingungsblöcken) als auch KI-gesteuertes Routing (mit Router-Blöcken).

<Image
  src="/static/execution/routing.png"
  alt="Workflow, der sowohl bedingte als auch router-basierte Verzweigungen zeigt"
  width={800}
  height={500}
/>

Dieser Workflow zeigt, wie die Ausführung unterschiedlichen Pfaden basierend auf Bedingungen oder KI-Entscheidungen folgen kann, wobei jeder Pfad unabhängig ausgeführt wird.

## Blocktypen

Sim bietet verschiedene Arten von Blöcken, die spezifische Zwecke in Ihren Workflows erfüllen:

<Cards>
  <Card title="Auslöser" href="/triggers">
    **Starter-Blöcke** initiieren Workflows und **Webhook-Blöcke** reagieren auf externe Ereignisse. Jeder Workflow benötigt einen Auslöser, um die Ausführung zu beginnen.
  </Card>
  
  <Card title="Verarbeitungsblöcke" href="/blocks">
    **Agent-Blöcke** interagieren mit KI-Modellen, **Funktionsblöcke** führen benutzerdefinierten Code aus und **API-Blöcke** verbinden sich mit externen Diensten. Diese Blöcke transformieren und verarbeiten Ihre Daten.
  </Card>
  
  <Card title="Kontrollfluss" href="/blocks">
    **Router-Blöcke** nutzen KI, um Pfade zu wählen, **Bedingungsblöcke** verzweigen basierend auf Logik und **Schleifen-/Parallelblöcke** handhaben Iterationen und Nebenläufigkeit.
  </Card>
  
  <Card title="Ausgabe & Antwort" href="/blocks">
    **Antwortblöcke** formatieren endgültige Ausgaben für APIs und Chat-Schnittstellen und liefern strukturierte Ergebnisse aus Ihren Workflows.
  </Card>
</Cards>

Alle Blöcke werden automatisch basierend auf ihren Abhängigkeiten ausgeführt - Sie müssen die Ausführungsreihenfolge oder das Timing nicht manuell verwalten.

## Ausführungsüberwachung

Wenn Workflows ausgeführt werden, bietet Sim Echtzeit-Einblick in den Ausführungsprozess:

- **Live-Block-Status**: Sehen Sie, welche Blöcke gerade ausgeführt werden, abgeschlossen sind oder fehlgeschlagen sind
- **Ausführungsprotokolle**: Detaillierte Protokolle erscheinen in Echtzeit und zeigen Eingaben, Ausgaben und eventuelle Fehler
- **Leistungskennzahlen**: Verfolgen Sie die Ausführungszeit und Kosten für jeden Block
- **Pfadvisualisierung**: Verstehen Sie, welche Ausführungspfade durch Ihren Workflow genommen wurden

<Callout type="info">
  Alle Ausführungsdetails werden erfasst und sind auch nach Abschluss der Workflows zur Überprüfung verfügbar, was bei der Fehlerbehebung und Optimierung hilft.
</Callout>

## Wichtige Ausführungsprinzipien

Das Verständnis dieser Grundprinzipien wird Ihnen helfen, bessere Workflows zu erstellen:

1. **Abhängigkeitsbasierte Ausführung**: Blöcke werden nur ausgeführt, wenn alle ihre Abhängigkeiten abgeschlossen sind
2. **Automatische Parallelisierung**: Unabhängige Blöcke laufen ohne Konfiguration gleichzeitig
3. **Intelligenter Datenfluss**: Ausgaben fließen automatisch zu verbundenen Blöcken
4. **Fehlerbehandlung**: Fehlgeschlagene Blöcke stoppen ihren Ausführungspfad, beeinflussen aber keine unabhängigen Pfade
5. **Zustandspersistenz**: Alle Blockausgaben und Ausführungsdetails werden für die Fehlerbehebung gespeichert

## Nächste Schritte

Nachdem Sie die Grundlagen der Ausführung verstanden haben, erkunden Sie:
- **[Blocktypen](/blocks)** - Erfahren Sie mehr über spezifische Block-Funktionen
- **[Protokollierung](/execution/logging)** - Überwachen Sie Workflow-Ausführungen und beheben Sie Probleme
- **[Kostenberechnung](/execution/costs)** - Verstehen und optimieren Sie Workflow-Kosten
- **[Trigger](/triggers)** - Richten Sie verschiedene Möglichkeiten ein, Ihre Workflows auszuführen
```

--------------------------------------------------------------------------------

---[FILE: costs.mdx]---
Location: sim-main/apps/docs/content/docs/de/execution/costs.mdx

```text
---
title: Kostenberechnung
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim berechnet automatisch die Kosten für alle Workflow-Ausführungen und bietet transparente Preise basierend auf der Nutzung von KI-Modellen und Ausführungsgebühren. Das Verständnis dieser Kosten hilft Ihnen, Workflows zu optimieren und Ihr Budget effektiv zu verwalten.

## Wie Kosten berechnet werden

Jede Workflow-Ausführung umfasst zwei Kostenkomponenten:

**Basis-Ausführungsgebühr**: 0,001 $ pro Ausführung

**KI-Modellnutzung**: Variable Kosten basierend auf dem Token-Verbrauch

```javascript
modelCost = (inputTokens × inputPrice + outputTokens × outputPrice) / 1,000,000
totalCost = baseExecutionCharge + modelCost
```

<Callout type="info">
  KI-Modellpreise werden pro Million Token berechnet. Die Berechnung teilt durch 1.000.000, um die tatsächlichen Kosten zu ermitteln. Workflows ohne KI-Blöcke verursachen nur die Basis-Ausführungsgebühr.
</Callout>

## Modellaufschlüsselung in Logs

Für Workflows mit KI-Blöcken können Sie detaillierte Kosteninformationen in den Logs einsehen:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-cost.png"
    alt="Modellaufschlüsselung"
    width={600}
    height={400}
    className="my-6"
  />
</div>

Die Modellaufschlüsselung zeigt:
- **Token-Nutzung**: Eingabe- und Ausgabe-Token-Anzahl für jedes Modell
- **Kostenaufschlüsselung**: Einzelkosten pro Modell und Operation
- **Modellverteilung**: Welche Modelle verwendet wurden und wie oft
- **Gesamtkosten**: Gesamtkosten für die gesamte Workflow-Ausführung

## Preisoptionen

<Tabs items={['Hosted Models', 'Bring Your Own API Key']}>
  <Tab>
    **Gehostete Modelle** - Sim stellt API-Schlüssel mit einem 2,5-fachen Preismultiplikator bereit:

    **OpenAI**
    | Modell | Basispreis (Eingabe/Ausgabe) | Gehosteter Preis (Eingabe/Ausgabe) |
    |-------|---------------------------|----------------------------|
    | GPT-5.1 | $1,25 / $10,00 | $3,13 / $25,00 |
    | GPT-5 | $1,25 / $10,00 | $3,13 / $25,00 |
    | GPT-5 Mini | $0,25 / $2,00 | $0,63 / $5,00 |
    | GPT-5 Nano | $0,05 / $0,40 | $0,13 / $1,00 |
    | GPT-4o | $2,50 / $10,00 | $6,25 / $25,00 |
    | GPT-4.1 | $2,00 / $8,00 | $5,00 / $20,00 |
    | GPT-4.1 Mini | $0,40 / $1,60 | $1,00 / $4,00 |
    | GPT-4.1 Nano | $0,10 / $0,40 | $0,25 / $1,00 |
    | o1 | $15,00 / $60,00 | $37,50 / $150,00 |
    | o3 | $2,00 / $8,00 | $5,00 / $20,00 |
    | o4 Mini | $1,10 / $4,40 | $2,75 / $11,00 |

    **Anthropic**
    | Modell | Basispreis (Eingabe/Ausgabe) | Gehosteter Preis (Eingabe/Ausgabe) |
    |-------|---------------------------|----------------------------|
    | Claude Opus 4.5 | $5,00 / $25,00 | $12,50 / $62,50 |
    | Claude Opus 4.1 | $15,00 / $75,00 | $37,50 / $187,50 |
    | Claude Sonnet 4.5 | $3,00 / $15,00 | $7,50 / $37,50 |
    | Claude Sonnet 4.0 | $3,00 / $15,00 | $7,50 / $37,50 |
    | Claude Haiku 4.5 | $1,00 / $5,00 | $2,50 / $12,50 |

    **Google**
    | Modell | Basispreis (Eingabe/Ausgabe) | Gehosteter Preis (Eingabe/Ausgabe) |
    |-------|---------------------------|----------------------------|
    | Gemini 3 Pro Preview | $2,00 / $12,00 | $5,00 / $30,00 |
    | Gemini 2.5 Pro | $0,15 / $0,60 | $0,38 / $1,50 |
    | Gemini 2.5 Flash | $0,15 / $0,60 | $0,38 / $1,50 |

    *Der 2,5-fache Multiplikator deckt Infrastruktur- und API-Verwaltungskosten ab.*
  </Tab>

  <Tab>
    **Eigene API-Schlüssel** - Nutzen Sie jedes Modell zum Basispreis:

    | Anbieter | Beispielmodelle | Input / Output |
    |----------|----------------|----------------|
    | Deepseek | V3, R1 | $0,75 / $1,00 |
    | xAI | Grok 4 Latest, Grok 3 | $3,00 / $15,00 |
    | Groq | Llama 4 Scout, Llama 3.3 70B | $0,11 / $0,34 |
    | Cerebras | Llama 4 Scout, Llama 3.3 70B | $0,11 / $0,34 |
    | Ollama | Lokale Modelle | Kostenlos |
    | VLLM | Lokale Modelle | Kostenlos |

    *Bezahlen Sie Anbieter direkt ohne Aufschlag*
  </Tab>
</Tabs>

<Callout type="warning">
  Die angezeigten Preise entsprechen den Tarifen vom 10. September 2025. Überprüfen Sie die Dokumentation der Anbieter für aktuelle Preise.
</Callout>

## Strategien zur Kostenoptimierung

- **Modellauswahl**: Wählen Sie Modelle basierend auf der Komplexität der Aufgabe. Einfache Aufgaben können GPT-4.1-nano verwenden, während komplexes Denken möglicherweise o1 oder Claude Opus erfordert.
- **Prompt-Engineering**: Gut strukturierte, präzise Prompts reduzieren den Token-Verbrauch ohne Qualitätseinbußen.
- **Lokale Modelle**: Verwenden Sie Ollama oder VLLM für unkritische Aufgaben, um API-Kosten vollständig zu eliminieren.
- **Caching und Wiederverwendung**: Speichern Sie häufig verwendete Ergebnisse in Variablen oder Dateien, um wiederholte KI-Modellaufrufe zu vermeiden.
- **Batch-Verarbeitung**: Verarbeiten Sie mehrere Elemente in einer einzigen KI-Anfrage anstatt einzelne Aufrufe zu tätigen.

## Nutzungsüberwachung

Überwachen Sie Ihre Nutzung und Abrechnung unter Einstellungen → Abonnement:

- **Aktuelle Nutzung**: Echtzeit-Nutzung und -Kosten für den aktuellen Zeitraum
- **Nutzungslimits**: Plangrenzen mit visuellen Fortschrittsanzeigen
- **Abrechnungsdetails**: Prognostizierte Gebühren und Mindestverpflichtungen
- **Planverwaltung**: Upgrade-Optionen und Abrechnungsverlauf

### Programmatische Nutzungsverfolgung

Sie können Ihre aktuelle Nutzung und Limits programmatisch über die API abfragen:

**Endpunkt:**

```text
GET /api/users/me/usage-limits
```

**Authentifizierung:**
- Fügen Sie Ihren API-Schlüssel im `X-API-Key` Header hinzu

**Beispielanfrage:**

```bash
curl -X GET -H "X-API-Key: YOUR_API_KEY" -H "Content-Type: application/json" https://sim.ai/api/users/me/usage-limits
```

**Beispielantwort:**

```json
{
  "success": true,
  "rateLimit": {
    "sync": {
      "isLimited": false,
      "requestsPerMinute": 25,
      "maxBurst": 50,
      "remaining": 50,
      "resetAt": "2025-09-08T22:51:55.999Z"
    },
    "async": {
      "isLimited": false,
      "requestsPerMinute": 200,
      "maxBurst": 400,
      "remaining": 400,
      "resetAt": "2025-09-08T22:51:56.155Z"
    },
    "authType": "api"
  },
  "usage": {
    "currentPeriodCost": 12.34,
    "limit": 100,
    "plan": "pro"
  }
}
```

**Rate-Limit-Felder:**
- `requestsPerMinute`: Dauerhafte Rate-Begrenzung (Tokens werden mit dieser Rate aufgefüllt)
- `maxBurst`: Maximale Tokens, die Sie ansammeln können (Burst-Kapazität)
- `remaining`: Aktuell verfügbare Tokens (können bis zu `maxBurst` sein)

**Antwortfelder:**
- `currentPeriodCost` spiegelt die Nutzung in der aktuellen Abrechnungsperiode wider
- `limit` wird von individuellen Limits (Free/Pro) oder gepoolten Organisationslimits (Team/Enterprise) abgeleitet
- `plan` ist der aktive Plan mit der höchsten Priorität, der mit Ihrem Benutzer verknüpft ist

## Plan-Limits

Verschiedene Abonnementpläne haben unterschiedliche Nutzungslimits:

| Plan | Monatliches Nutzungslimit | Rate-Limits (pro Minute) |
|------|-------------------|-------------------------|
| **Free** | $10 | 5 sync, 10 async |
| **Pro** | $100 | 10 sync, 50 async |
| **Team** | $500 (gepoolt) | 50 sync, 100 async |
| **Enterprise** | Individuell | Individuell |

## Abrechnungsmodell

Sim verwendet ein **Basisabonnement + Mehrverbrauch**-Abrechnungsmodell:

### Wie es funktioniert

**Pro-Plan ($20/Monat):**
- Monatliches Abonnement beinhaltet $20 Nutzung
- Nutzung unter $20 → Keine zusätzlichen Kosten
- Nutzung über $20 → Zahlen Sie den Mehrverbrauch am Monatsende
- Beispiel: $35 Nutzung = $20 (Abonnement) + $15 (Mehrverbrauch)

**Team-Plan ($40/Benutzer/Monat):**
- Gepoolte Nutzung für alle Teammitglieder
- Mehrverbrauch wird aus der Gesamtnutzung des Teams berechnet
- Organisationsinhaber erhält eine Rechnung

**Enterprise-Pläne:**
- Fester monatlicher Preis, kein Mehrverbrauch
- Individuelle Nutzungslimits gemäß Vereinbarung

### Schwellenwert-Abrechnung

Wenn der nicht abgerechnete Mehrverbrauch $50 erreicht, berechnet Sim automatisch den gesamten nicht abgerechneten Betrag.

**Beispiel:**
- Tag 10: $70 Mehrverbrauch → Sofortige Abrechnung von $70
- Tag 15: Zusätzliche $35 Nutzung ($105 insgesamt) → Bereits abgerechnet, keine Aktion
- Tag 20: Weitere $50 Nutzung ($155 insgesamt, $85 nicht abgerechnet) → Sofortige Abrechnung von $85

Dies verteilt große Überziehungsgebühren über den Monat, anstatt eine große Rechnung am Ende des Abrechnungszeitraums zu erhalten.

## Best Practices für Kostenmanagement

1. **Regelmäßig überwachen**: Überprüfen Sie Ihr Nutzungs-Dashboard häufig, um Überraschungen zu vermeiden
2. **Budgets festlegen**: Nutzen Sie Planlimits als Leitplanken für Ihre Ausgaben
3. **Workflows optimieren**: Überprüfen Sie kostenintensive Ausführungen und optimieren Sie Prompts oder Modellauswahl
4. **Passende Modelle verwenden**: Passen Sie die Modellkomplexität an die Aufgabenanforderungen an
5. **Ähnliche Aufgaben bündeln**: Kombinieren Sie wenn möglich mehrere Anfragen, um den Overhead zu reduzieren

## Nächste Schritte

- Überprüfen Sie Ihre aktuelle Nutzung unter [Einstellungen → Abonnement](https://sim.ai/settings/subscription)
- Erfahren Sie mehr über [Protokollierung](/execution/logging), um Ausführungsdetails zu verfolgen
- Erkunden Sie die [Externe API](/execution/api) für programmatische Kostenüberwachung
- Sehen Sie sich [Workflow-Optimierungstechniken](/blocks) an, um Kosten zu reduzieren
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/de/execution/index.mdx

```text
---
title: Übersicht
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Die Ausführungs-Engine von Sim bringt Ihre Workflows zum Leben, indem sie Blöcke in der richtigen Reihenfolge verarbeitet, den Datenfluss verwaltet und Fehler elegant behandelt, sodass Sie genau verstehen können, wie Workflows in Sim ausgeführt werden.

<Callout type="info">
  Jede Workflow-Ausführung folgt einem deterministischen Pfad, der auf Ihren Blockverbindungen und Ihrer Logik basiert, um vorhersehbare und zuverlässige Ergebnisse zu gewährleisten.
</Callout>

## Dokumentationsübersicht

<Cards>
  <Card title="Grundlagen der Ausführung" href="/execution/basics">
    Erfahren Sie mehr über den grundlegenden Ausführungsablauf, Blocktypen und wie Daten durch Ihren
    Workflow fließen
  </Card>

  <Card title="Protokollierung" href="/execution/logging">
    Überwachen Sie Workflow-Ausführungen mit umfassender Protokollierung und Echtzeit-Sichtbarkeit
  </Card>
  
  <Card title="Kostenberechnung" href="/execution/costs">
    Verstehen Sie, wie die Kosten für Workflow-Ausführungen berechnet und optimiert werden
  </Card>
  
  <Card title="Externe API" href="/execution/api">
    Greifen Sie programmgesteuert über REST-API auf Ausführungsprotokolle zu und richten Sie Webhooks ein
  </Card>
</Cards>

## Schlüsselkonzepte

### Topologische Ausführung
Blöcke werden in Abhängigkeitsreihenfolge ausgeführt, ähnlich wie eine Tabellenkalkulation Zellen neu berechnet. Die Ausführungs-Engine bestimmt automatisch, welche Blöcke basierend auf abgeschlossenen Abhängigkeiten ausgeführt werden können.

### Pfadverfolgung
Die Engine verfolgt aktiv Ausführungspfade durch Ihren Workflow. Router- und Bedingungsblöcke aktualisieren diese Pfade dynamisch und stellen sicher, dass nur relevante Blöcke ausgeführt werden.

### Schichtbasierte Verarbeitung
Anstatt Blöcke einzeln auszuführen, identifiziert die Engine Schichten von Blöcken, die parallel ausgeführt werden können, und optimiert so die Leistung für komplexe Workflows.

### Ausführungskontext
Jeder Workflow behält während der Ausführung einen umfangreichen Kontext bei, der Folgendes enthält:
- Block-Ausgaben und -Zustände
- Aktive Ausführungspfade
- Verfolgung von Schleifen- und Paralleliterationen
- Umgebungsvariablen
- Routing-Entscheidungen

## Deployment-Snapshots

Alle öffentlichen Einstiegspunkte – API, Chat, Zeitplan, Webhook und manuelle Ausführungen – führen den aktiven Deployment-Snapshot des Workflows aus. Veröffentliche ein neues Deployment, wann immer du die Arbeitsfläche änderst, damit jeder Auslöser die aktualisierte Version verwendet.

<div className='flex justify-center my-6'>
  <Image
    src='/static/execution/deployment-versions.png'
    alt='Tabelle mit Deployment-Versionen'
    width={500}
    height={280}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

Das Deploy-Modal behält eine vollständige Versionshistorie bei – untersuche jeden Snapshot, vergleiche ihn mit deinem Entwurf und führe Upgrades oder Rollbacks mit einem Klick durch, wenn du eine frühere Version wiederherstellen musst.

## Programmatische Ausführung

Führe Workflows aus deinen Anwendungen heraus mit unseren offiziellen SDKs aus:

```bash
# TypeScript/JavaScript
npm install simstudio-ts-sdk

# Python
pip install simstudio-sdk
```

```typescript
// TypeScript Example
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({ 
  apiKey: 'your-api-key' 
});

const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello' }
});
```

## Best Practices

### Design für Zuverlässigkeit
- Behandle Fehler elegant mit geeigneten Fallback-Pfaden
- Verwende Umgebungsvariablen für sensible Daten
- Füge Logging zu Funktionsblöcken für Debugging hinzu

### Optimiere Performance
- Minimiere externe API-Aufrufe wo möglich
- Nutze parallele Ausführung für unabhängige Operationen
- Cache Ergebnisse mit Memory-Blöcken wenn angemessen

### Überwache Ausführungen
- Überprüfe Logs regelmäßig, um Leistungsmuster zu verstehen
- Verfolge Kosten für KI-Modellnutzung
- Verwende Workflow-Snapshots zur Fehlerbehebung

## Was kommt als nächstes?

Beginne mit [Ausführungsgrundlagen](/execution/basics), um zu verstehen, wie Workflows laufen, und erkunde dann [Logging](/execution/logging), um deine Ausführungen zu überwachen, sowie [Kostenberechnung](/execution/costs), um deine Ausgaben zu optimieren.
```

--------------------------------------------------------------------------------

````
