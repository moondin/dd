---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 101
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 101 of 933)

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

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/copilot/index.mdx

```text
---
title: Copilot
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'
import { MessageCircle, Package, Zap, Infinity as InfinityIcon, Brain, BrainCircuit } from 'lucide-react'

Copilot es tu asistente integrado en el editor que te ayuda a crear y editar flujos de trabajo con Sim Copilot, así como a entenderlos y mejorarlos. Puede:

- **Explicar**: Responder preguntas sobre Sim y tu flujo de trabajo actual
- **Guiar**: Sugerir ediciones y mejores prácticas
- **Editar**: Realizar cambios en bloques, conexiones y configuraciones cuando los apruebes

<Callout type="info">
  Copilot es un servicio gestionado por Sim. Para implementaciones autoalojadas, genera una clave API de Copilot en la aplicación alojada (sim.ai → Configuración → Copilot)
  1. Ve a [sim.ai](https://sim.ai) → Configuración → Copilot y genera una clave API de Copilot
  2. Establece `COPILOT_API_KEY` en tu entorno autoalojado con ese valor
</Callout>

## Menú contextual (@)

Usa el símbolo `@` para hacer referencia a varios recursos y proporcionar a Copilot más contexto sobre tu espacio de trabajo:

<Image
  src="/static/copilot/copilot-menu.png"
  alt="Menú contextual de Copilot mostrando opciones de referencia disponibles"
  width={600}
  height={400}
/>

El menú `@` proporciona acceso a:
- **Chats**: Referencia conversaciones previas con copilot
- **Todos los flujos de trabajo**: Referencia cualquier flujo de trabajo en tu espacio de trabajo
- **Bloques de flujo de trabajo**: Referencia bloques específicos de los flujos de trabajo
- **Bloques**: Referencia tipos de bloques y plantillas
- **Conocimiento**: Referencia tus documentos subidos y base de conocimientos
- **Documentación**: Referencia la documentación de Sim
- **Plantillas**: Referencia plantillas de flujo de trabajo
- **Registros**: Referencia registros de ejecución y resultados

Esta información contextual ayuda a Copilot a proporcionar asistencia más precisa y relevante para tu caso de uso específico.

## Modos

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        Preguntar
      </span>
    }
  >
    <div className="m-0 text-sm">
      Modo de preguntas y respuestas para explicaciones, orientación y sugerencias sin realizar cambios en tu flujo de trabajo.
    </div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        Agente
      </span>
    }
  >
    <div className="m-0 text-sm">
      Modo de construcción y edición. Copilot propone ediciones específicas (añadir bloques, conectar variables, ajustar configuraciones) y las aplica cuando las apruebas.
    </div>
  </Card>
</Cards>

<div className="flex justify-center">
  <Image
    src="/static/copilot/copilot-mode.png"
    alt="Interfaz de selección de modo de Copilot"
    width={600}
    height={400}
    className="my-6"
  />
</div>

## Niveles de profundidad

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Zap className="h-4 w-4 text-muted-foreground" />
        Rápido
      </span>
    }
  >
    <div className="m-0 text-sm">El más rápido y económico. Ideal para ediciones pequeñas, flujos de trabajo simples y ajustes menores.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <InfinityIcon className="h-4 w-4 text-muted-foreground" />
        Auto
      </span>
    }
  >
    <div className="m-0 text-sm">Equilibrio entre velocidad y razonamiento. Opción predeterminada recomendada para la mayoría de las tareas.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Brain className="h-4 w-4 text-muted-foreground" />
        Avanzado
      </span>
    }
  >
    <div className="m-0 text-sm">Mayor razonamiento para flujos de trabajo más grandes y ediciones complejas sin perder rendimiento.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
        Behemoth
      </span>
    }
  >
    <div className="m-0 text-sm">Máximo razonamiento para planificación profunda, depuración y cambios arquitectónicos complejos.</div>
  </Card>
</Cards>

### Interfaz de selección de modo

Puedes cambiar fácilmente entre diferentes modos de razonamiento utilizando el selector de modo en la interfaz de Copilot:

<Image
  src="/static/copilot/copilot-models.png"
  alt="Selección de modo de Copilot mostrando el modo Avanzado con el interruptor MAX"
  width={600}
  height={300}
/>

La interfaz te permite:
- **Seleccionar nivel de razonamiento**: Elige entre Rápido, Auto, Avanzado o Behemoth
- **Activar modo MAX**: Activa el interruptor para obtener las máximas capacidades de razonamiento cuando necesites el análisis más exhaustivo
- **Ver descripciones de modos**: Comprende para qué está optimizado cada modo

Elige tu modo según la complejidad de tu tarea - usa Rápido para preguntas simples y Behemoth para cambios arquitectónicos complejos.

## Facturación y cálculo de costos

### Cómo se calculan los costos

El uso de Copilot se factura por token del LLM subyacente:

- **Tokens de entrada**: facturados a la tarifa base del proveedor (**a costo**)
- **Tokens de salida**: facturados a **1,5×** la tarifa base de salida del proveedor

```javascript
copilotCost = (inputTokens × inputPrice + outputTokens × (outputPrice × 1.5)) / 1,000,000
```

| Componente | Tarifa aplicada       |
|------------|----------------------|
| Entrada    | inputPrice           |
| Salida     | outputPrice × 1,5    |

<Callout type="warning">
  Los precios mostrados reflejan las tarifas a partir del 4 de septiembre de 2025. Consulta la documentación del proveedor para conocer los precios actuales.
</Callout>

<Callout type="info">
  Los precios de los modelos son por millón de tokens. El cálculo divide por 1.000.000 para obtener el costo real. Consulta <a href="/execution/costs">la página de Cálculo de Costos</a> para obtener información general y ejemplos.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/es/execution/api.mdx

```text
---
title: API externa
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Sim proporciona una API externa completa para consultar registros de ejecución de flujos de trabajo y configurar webhooks para notificaciones en tiempo real cuando los flujos de trabajo se completan.

## Autenticación

Todas las solicitudes a la API requieren una clave de API pasada en el encabezado `x-api-key`:

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://sim.ai/api/v1/logs?workspaceId=YOUR_WORKSPACE_ID
```

Puedes generar claves de API desde la configuración de usuario en el panel de control de Sim.

## API de registros

Todas las respuestas de la API incluyen información sobre tus límites de ejecución de flujos de trabajo y su uso:

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

**Nota:** Los límites de tasa utilizan un algoritmo de cubo de tokens. `remaining` puede exceder `requestsPerMinute` hasta `maxBurst` cuando no has usado tu asignación completa recientemente, permitiendo tráfico en ráfagas. Los límites de tasa en el cuerpo de la respuesta son para ejecuciones de flujo de trabajo. Los límites de tasa para llamar a este punto final de la API están en los encabezados de respuesta (`X-RateLimit-*`).

### Consultar registros

Consulta los registros de ejecución de flujos de trabajo con amplias opciones de filtrado.

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs
    ```

    **Parámetros requeridos:**
    - `workspaceId` - Tu ID de espacio de trabajo

    **Filtros opcionales:**
    - `workflowIds` - IDs de flujos de trabajo separados por comas
    - `folderIds` - IDs de carpetas separados por comas
    - `triggers` - Tipos de disparadores separados por comas: `api`, `webhook`, `schedule`, `manual`, `chat`
    - `level` - Filtrar por nivel: `info`, `error`
    - `startDate` - Marca de tiempo ISO para el inicio del rango de fechas
    - `endDate` - Marca de tiempo ISO para el fin del rango de fechas
    - `executionId` - Coincidencia exacta de ID de ejecución
    - `minDurationMs` - Duración mínima de ejecución en milisegundos
    - `maxDurationMs` - Duración máxima de ejecución en milisegundos
    - `minCost` - Costo mínimo de ejecución
    - `maxCost` - Costo máximo de ejecución
    - `model` - Filtrar por modelo de IA utilizado

    **Paginación:**
    - `limit` - Resultados por página (predeterminado: 100)
    - `cursor` - Cursor para la siguiente página
    - `order` - Orden de clasificación: `desc`, `asc` (predeterminado: desc)

    **Nivel de detalle:**
    - `details` - Nivel de detalle de la respuesta: `basic`, `full` (predeterminado: básico)
    - `includeTraceSpans` - Incluir intervalos de seguimiento (predeterminado: falso)
    - `includeFinalOutput` - Incluir salida final (predeterminado: falso)
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

### Obtener detalles del registro

Recupera información detallada sobre una entrada de registro específica.

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

### Obtener detalles de ejecución

Recupera detalles de ejecución incluyendo la instantánea del estado del flujo de trabajo.

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

## Notificaciones

Recibe notificaciones en tiempo real cuando se completan las ejecuciones de flujos de trabajo a través de webhook, correo electrónico o Slack. Las notificaciones se configuran a nivel de espacio de trabajo desde la página de Registros.

### Configuración

Configura las notificaciones desde la página de Registros haciendo clic en el botón de menú y seleccionando "Configurar notificaciones".

**Canales de notificación:**
- **Webhook**: Envía solicitudes HTTP POST a tu punto de conexión
- **Correo electrónico**: Recibe notificaciones por correo con detalles de la ejecución
- **Slack**: Publica mensajes en un canal de Slack

**Selección de flujos de trabajo:**
- Selecciona flujos de trabajo específicos para monitorear
- O elige "Todos los flujos de trabajo" para incluir los flujos actuales y futuros

**Opciones de filtrado:**
- `levelFilter`: Niveles de registro a recibir (`info`, `error`)
- `triggerFilter`: Tipos de disparadores a recibir (`api`, `webhook`, `schedule`, `manual`, `chat`)

**Datos opcionales:**
- `includeFinalOutput`: Incluir la salida final del flujo de trabajo
- `includeTraceSpans`: Incluir trazas detalladas de la ejecución
- `includeRateLimits`: Incluir información de límites de tasa (límites sincrónicos/asincrónicos y restantes)
- `includeUsageData`: Incluir uso y límites del período de facturación

### Reglas de alerta

En lugar de recibir notificaciones por cada ejecución, configura reglas de alerta para ser notificado solo cuando se detecten problemas:

**Fallos consecutivos**
- Alerta después de X ejecuciones fallidas consecutivas (por ejemplo, 3 fallos seguidos)
- Se reinicia cuando una ejecución tiene éxito

**Tasa de fallos**
- Alerta cuando la tasa de fallos supera el X% durante las últimas Y horas
- Requiere un mínimo de 5 ejecuciones en la ventana de tiempo
- Solo se activa después de que haya transcurrido la ventana de tiempo completa

**Umbral de latencia**
- Alerta cuando cualquier ejecución tarda más de X segundos
- Útil para detectar flujos de trabajo lentos o bloqueados

**Pico de latencia**
- Alerta cuando la ejecución es X% más lenta que el promedio
- Compara con la duración promedio durante la ventana de tiempo configurada
- Requiere un mínimo de 5 ejecuciones para establecer una línea base

**Umbral de costo**
- Alerta cuando una sola ejecución cuesta más de $X
- Útil para detectar llamadas costosas a LLM

**Sin actividad**
- Alerta cuando no ocurren ejecuciones dentro de X horas
- Útil para monitorear flujos de trabajo programados que deberían ejecutarse regularmente

**Recuento de errores**
- Alerta cuando el recuento de errores excede X dentro de una ventana de tiempo
- Rastrea errores totales, no consecutivos

Todos los tipos de alertas incluyen un período de enfriamiento de 1 hora para evitar el spam de notificaciones.

### Configuración de webhook

Para webhooks, hay opciones adicionales disponibles:
- `url`: La URL de tu endpoint webhook
- `secret`: Secreto opcional para verificación de firma HMAC

### Estructura de carga útil

Cuando se completa la ejecución de un flujo de trabajo, Sim envía la siguiente carga útil (vía webhook POST, correo electrónico o Slack):

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

### Encabezados de webhook

Cada solicitud de webhook incluye estos encabezados (solo canal webhook):

- `sim-event`: Tipo de evento (siempre `workflow.execution.completed`)
- `sim-timestamp`: Marca de tiempo Unix en milisegundos
- `sim-delivery-id`: ID único de entrega para idempotencia
- `sim-signature`: Firma HMAC-SHA256 para verificación (si se configura un secreto)
- `Idempotency-Key`: Igual que el ID de entrega para detección de duplicados

### Verificación de firma

Si configuras un secreto de webhook, verifica la firma para asegurar que el webhook proviene de Sim:

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

### Política de reintentos

Las entregas de webhook fallidas se reintentan con retroceso exponencial y fluctuación:

- Máximo de intentos: 5
- Retrasos de reintento: 5 segundos, 15 segundos, 1 minuto, 3 minutos, 10 minutos
- Fluctuación: Hasta un 10% de retraso adicional para prevenir el efecto de manada
- Solo las respuestas HTTP 5xx y 429 activan reintentos
- Las entregas agotan el tiempo después de 30 segundos

<Callout type="info">
  Las entregas de webhook se procesan de forma asíncrona y no afectan el rendimiento de ejecución del flujo de trabajo.
</Callout>

## Mejores prácticas

1. **Estrategia de sondeo**: Cuando consultes registros, utiliza paginación basada en cursores con `order=asc` y `startDate` para obtener nuevos registros de manera eficiente.

2. **Seguridad de webhook**: Siempre configura un secreto de webhook y verifica las firmas para asegurar que las solicitudes provienen de Sim.

3. **Idempotencia**: Utiliza la cabecera `Idempotency-Key` para detectar y manejar entregas duplicadas de webhook.

4. **Privacidad**: Por defecto, `finalOutput` y `traceSpans` están excluidos de las respuestas. Habilítalos solo si necesitas los datos y comprendes las implicaciones de privacidad.

5. **Limitación de tasa**: Implementa retroceso exponencial cuando recibas respuestas 429. Verifica la cabecera `Retry-After` para conocer el tiempo de espera recomendado.

## Limitación de tasa

La API utiliza un **algoritmo de cubo de tokens** para limitar la tasa, proporcionando un uso justo mientras permite tráfico en ráfagas:

| Plan | Solicitudes/Minuto | Capacidad de ráfaga |
|------|-----------------|----------------|
| Free | 10 | 20 |
| Pro | 30 | 60 |
| Team | 60 | 120 |
| Enterprise | 120 | 240 |

**Cómo funciona:**
- Los tokens se recargan a una tasa de `requestsPerMinute`
- Puedes acumular hasta `maxBurst` tokens cuando estás inactivo
- Cada solicitud consume 1 token
- La capacidad de ráfaga permite manejar picos de tráfico

La información del límite de tasa se incluye en los encabezados de respuesta:
- `X-RateLimit-Limit`: Solicitudes por minuto (tasa de recarga)
- `X-RateLimit-Remaining`: Tokens disponibles actualmente
- `X-RateLimit-Reset`: Marca de tiempo ISO cuando los tokens se recargan nuevamente

## Ejemplo: Sondeo para nuevos registros

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

## Ejemplo: Procesamiento de webhooks

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
Location: sim-main/apps/docs/content/docs/es/execution/basics.mdx

```text
---
title: Conceptos básicos
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Entender cómo se ejecutan los flujos de trabajo en Sim es clave para crear automatizaciones eficientes y confiables. El motor de ejecución gestiona automáticamente las dependencias, la concurrencia y el flujo de datos para garantizar que tus flujos de trabajo funcionen de manera fluida y predecible.

## Cómo se ejecutan los flujos de trabajo

El motor de ejecución de Sim procesa los flujos de trabajo de manera inteligente analizando las dependencias y ejecutando los bloques en el orden más eficiente posible.

### Ejecución concurrente por defecto

Múltiples bloques se ejecutan simultáneamente cuando no dependen entre sí. Esta ejecución paralela mejora dramáticamente el rendimiento sin requerir configuración manual.

<Image
  src="/static/execution/concurrency.png"
  alt="Múltiples bloques ejecutándose concurrentemente después del bloque de Inicio"
  width={800}
  height={500}
/>

En este ejemplo, tanto el bloque de agente de Atención al Cliente como el de Investigador Profundo se ejecutan simultáneamente después del bloque de Inicio, maximizando la eficiencia.

### Combinación automática de salidas

Cuando los bloques tienen múltiples dependencias, el motor de ejecución espera automáticamente a que todas las dependencias se completen, y luego proporciona sus salidas combinadas al siguiente bloque. No se requiere combinación manual.

<Image
  src="/static/execution/combination.png"
  alt="Bloque de función recibiendo automáticamente salidas de múltiples bloques anteriores"
  width={800}
  height={500}
/>

El bloque de Función recibe las salidas de ambos bloques de agente tan pronto como se completan, permitiéndote procesar los resultados combinados.

### Enrutamiento inteligente

Los flujos de trabajo pueden ramificarse en múltiples direcciones utilizando bloques de enrutamiento. El motor de ejecución admite tanto el enrutamiento determinista (con bloques de Condición) como el enrutamiento basado en IA (con bloques de Router).

<Image
  src="/static/execution/routing.png"
  alt="Flujo de trabajo mostrando ramificación tanto condicional como basada en router"
  width={800}
  height={500}
/>

Este flujo de trabajo demuestra cómo la ejecución puede seguir diferentes caminos basados en condiciones o decisiones de IA, con cada camino ejecutándose independientemente.

## Tipos de bloques

Sim proporciona diferentes tipos de bloques que sirven para propósitos específicos en tus flujos de trabajo:

<Cards>
  <Card title="Disparadores" href="/triggers">
    Los **bloques de inicio** inician flujos de trabajo y los **bloques de Webhook** responden a eventos externos. Cada flujo de trabajo necesita un disparador para comenzar la ejecución.
  </Card>
  
  <Card title="Bloques de procesamiento" href="/blocks">
    Los **bloques de agente** interactúan con modelos de IA, los **bloques de función** ejecutan código personalizado, y los **bloques de API** conectan con servicios externos. Estos bloques transforman y procesan tus datos.
  </Card>
  
  <Card title="Control de flujo" href="/blocks">
    Los **bloques de enrutador** usan IA para elegir caminos, los **bloques de condición** ramifican basándose en lógica, y los **bloques de bucle/paralelo** manejan iteraciones y concurrencia.
  </Card>
  
  <Card title="Salida y respuesta" href="/blocks">
    Los **bloques de respuesta** formatean las salidas finales para APIs e interfaces de chat, devolviendo resultados estructurados de tus flujos de trabajo.
  </Card>
</Cards>

Todos los bloques se ejecutan automáticamente basándose en sus dependencias - no necesitas gestionar manualmente el orden de ejecución o el tiempo.

## Monitoreo de ejecución

Cuando los flujos de trabajo se ejecutan, Sim proporciona visibilidad en tiempo real del proceso de ejecución:

- **Estados de bloques en vivo**: Vea qué bloques se están ejecutando actualmente, cuáles han completado o fallado
- **Registros de ejecución**: Los registros detallados aparecen en tiempo real mostrando entradas, salidas y cualquier error
- **Métricas de rendimiento**: Realice seguimiento del tiempo de ejecución y costos para cada bloque
- **Visualización de rutas**: Comprenda qué rutas de ejecución se tomaron a través de su flujo de trabajo

<Callout type="info">
  Todos los detalles de ejecución son capturados y están disponibles para revisión incluso después de que los flujos de trabajo se completen, ayudando con la depuración y optimización.
</Callout>

## Principios clave de ejecución

Entender estos principios fundamentales le ayudará a construir mejores flujos de trabajo:

1. **Ejecución basada en dependencias**: Los bloques solo se ejecutan cuando todas sus dependencias han completado
2. **Paralelización automática**: Los bloques independientes se ejecutan simultáneamente sin configuración
3. **Flujo inteligente de datos**: Las salidas fluyen automáticamente a los bloques conectados
4. **Manejo de errores**: Los bloques fallidos detienen su ruta de ejecución pero no afectan rutas independientes
5. **Persistencia de estado**: Todas las salidas de bloques y detalles de ejecución se conservan para depuración

## Próximos pasos

Ahora que entiende los conceptos básicos de ejecución, explore:
- **[Tipos de bloques](/blocks)** - Aprenda sobre las capacidades específicas de los bloques
- **[Registro](/execution/logging)** - Monitoree las ejecuciones de flujos de trabajo y solucione problemas
- **[Cálculo de costos](/execution/costs)** - Comprenda y optimice los costos de flujos de trabajo
- **[Disparadores](/triggers)** - Configure diferentes formas de ejecutar sus flujos de trabajo
```

--------------------------------------------------------------------------------

````
