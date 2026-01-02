---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 99
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 99 of 933)

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

---[FILE: condition.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/condition.mdx

```text
---
title: Condición
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Condición ramifica la ejecución del flujo de trabajo basándose en expresiones booleanas. Evalúa condiciones utilizando las salidas de bloques anteriores y dirige a diferentes rutas sin requerir un LLM.

<div className="flex justify-center">
  <Image
    src="/static/blocks/condition.png"
    alt="Bloque de condición"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Opciones de configuración

### Condiciones

Define una o más condiciones que serán evaluadas. Cada condición incluye:

- **Expresión**: Una expresión JavaScript/TypeScript que evalúa a verdadero o falso
- **Ruta**: El bloque de destino al que dirigirse si la condición es verdadera
- **Descripción**: Explicación opcional de lo que verifica la condición

Puedes crear múltiples condiciones que se evalúan en orden, siendo la primera condición coincidente la que determina la ruta de ejecución.

### Formato de expresión de condición

Las condiciones utilizan sintaxis JavaScript y pueden hacer referencia a valores de entrada de bloques anteriores.

<Tabs items={['Umbral de puntuación', 'Análisis de texto', 'Múltiples condiciones']}>
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

### Acceso a resultados

Después de que una condición se evalúa, puedes acceder a sus salidas:

- **`<condition.result>`**: Resultado booleano de la evaluación de la condición
- **`<condition.matched_condition>`**: ID de la condición que coincidió
- **`<condition.content>`**: Descripción del resultado de la evaluación
- **`<condition.path>`**: Detalles del destino de enrutamiento elegido

## Funciones avanzadas

### Expresiones complejas

Usa operadores y funciones JavaScript en las condiciones:

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

### Evaluación de múltiples condiciones

Las condiciones se evalúan en orden hasta que una coincide:

```javascript
// Condition 1: Check for high priority
<ticket.priority> === 'high'

// Condition 2: Check for urgent keywords
<ticket.subject>.toLowerCase().includes('urgent')

// Condition 3: Default fallback
true
```

### Manejo de errores

Las condiciones manejan automáticamente:
- Valores indefinidos o nulos con evaluación segura
- Discrepancias de tipo con alternativas apropiadas
- Expresiones inválidas con registro de errores
- Variables faltantes con valores predeterminados

## Salidas

- **`<condition.result>`**: Resultado booleano de la evaluación
- **`<condition.matched_condition>`**: ID de la condición coincidente
- **`<condition.content>`**: Descripción del resultado de la evaluación
- **`<condition.path>`**: Detalles del destino de enrutamiento elegido

## Ejemplos de casos de uso

**Enrutamiento de atención al cliente** - Enrutar tickets según la prioridad

```
API (Ticket) → Condition (priority === 'high') → Agent (Escalation) or Agent (Standard)
```

**Moderación de contenido** - Filtrar contenido basado en análisis

```
Agent (Analyze) → Condition (toxicity > 0.7) → Moderation or Publish
```

**Flujo de incorporación de usuarios** - Personalizar la incorporación según el tipo de usuario

```
Function (Process) → Condition (account_type === 'enterprise') → Advanced or Simple
```

## Mejores prácticas

- **Ordena las condiciones correctamente**: Coloca las condiciones más específicas antes que las generales para asegurar que la lógica específica tenga prioridad sobre las alternativas
- **Usa la rama else cuando sea necesario**: Si ninguna condición coincide y la rama else no está conectada, la rama del flujo de trabajo terminará correctamente. Conecta la rama else si necesitas una ruta alternativa para casos no coincidentes
- **Mantén las expresiones simples**: Usa expresiones booleanas claras y directas para mejorar la legibilidad y facilitar la depuración
- **Documenta tus condiciones**: Añade descripciones para explicar el propósito de cada condición para una mejor colaboración en equipo y mantenimiento
- **Prueba casos límite**: Verifica que las condiciones manejen correctamente los valores límite probando con valores en los extremos de los rangos de tus condiciones
```

--------------------------------------------------------------------------------

---[FILE: evaluator.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/evaluator.mdx

```text
---
title: Evaluador
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Evaluador utiliza IA para puntuar y evaluar la calidad del contenido según métricas personalizadas. Perfecto para control de calidad, pruebas A/B y para garantizar que los resultados de IA cumplan con estándares específicos.

<div className="flex justify-center">
  <Image
    src="/static/blocks/evaluator.png"
    alt="Configuración del bloque Evaluador"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Opciones de configuración

### Métricas de evaluación

Define métricas personalizadas para evaluar el contenido. Cada métrica incluye:

- **Nombre**: Un identificador corto para la métrica
- **Descripción**: Una explicación detallada de lo que mide la métrica
- **Rango**: El rango numérico para la puntuación (p. ej., 1-5, 0-10)

Ejemplos de métricas:

```
Accuracy (1-5): How factually accurate is the content?
Clarity (1-5): How clear and understandable is the content?
Relevance (1-5): How relevant is the content to the original query?
```

### Contenido

El contenido que se evaluará. Puede ser:

- Proporcionado directamente en la configuración del bloque
- Conectado desde la salida de otro bloque (típicamente un bloque Agente)
- Generado dinámicamente durante la ejecución del flujo de trabajo

### Selección de modelo

Elige un modelo de IA para realizar la evaluación:

- **OpenAI**: GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Otros proveedores**: Groq, Cerebras, xAI, DeepSeek
- **Modelos locales**: modelos compatibles con Ollama o VLLM

Utiliza modelos con fuertes capacidades de razonamiento como GPT-4o o Claude 3.7 Sonnet para obtener mejores resultados.

### Clave API

Tu clave API para el proveedor de LLM seleccionado. Se almacena de forma segura y se utiliza para la autenticación.

## Ejemplos de casos de uso

**Evaluación de calidad de contenido** - Evalúa el contenido antes de su publicación

```
Agent (Generate) → Evaluator (Score) → Condition (Check threshold) → Publish or Revise
```

**Pruebas A/B de contenido** - Compara múltiples respuestas generadas por IA

```
Parallel (Variations) → Evaluator (Score Each) → Function (Select Best) → Response
```

**Control de calidad de atención al cliente** - Asegura que las respuestas cumplan con los estándares de calidad

```
Agent (Support Response) → Evaluator (Score) → Function (Log) → Condition (Review if Low)
```

## Salidas

- **`<evaluator.content>`**: Resumen de la evaluación con puntuaciones
- **`<evaluator.model>`**: Modelo utilizado para la evaluación
- **`<evaluator.tokens>`**: Estadísticas de uso de tokens
- **`<evaluator.cost>`**: Costo estimado de la evaluación

## Mejores prácticas

- **Usa descripciones específicas de métricas**: Define claramente qué mide cada métrica para obtener evaluaciones más precisas
- **Elige rangos apropiados**: Selecciona rangos de puntuación que proporcionen suficiente detalle sin ser excesivamente complejos
- **Conecta con bloques de Agente**: Utiliza bloques Evaluadores para evaluar las salidas de bloques de Agente y crear bucles de retroalimentación
- **Usa métricas consistentes**: Para análisis comparativos, mantén métricas consistentes en evaluaciones similares
- **Combina múltiples métricas**: Utiliza varias métricas para obtener una evaluación integral
```

--------------------------------------------------------------------------------

---[FILE: function.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/function.mdx

```text
---
title: Función
---

import { Image } from '@/components/ui/image'

El bloque de Función ejecuta código JavaScript o TypeScript personalizado en tus flujos de trabajo. Transforma datos, realiza cálculos o implementa lógica personalizada.

<div className="flex justify-center">
  <Image
    src="/static/blocks/function.png"
    alt="Bloque de función con editor de código"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Salidas

- **`<function.result>`**: El valor devuelto por tu función
- **`<function.stdout>`**: Salida de console.log() de tu código

## Ejemplos de casos de uso

**Pipeline de procesamiento de datos** - Transforma respuestas de API en datos estructurados

```
API (Fetch) → Function (Process & Validate) → Function (Calculate Metrics) → Response
```

**Implementación de lógica de negocio** - Calcula puntuaciones y niveles de fidelización

```
Agent (Get History) → Function (Calculate Score) → Function (Determine Tier) → Condition (Route)
```

**Validación y limpieza de datos** - Valida y limpia la entrada del usuario

```
Input → Function (Validate & Sanitize) → API (Save to Database)
```

### Ejemplo: Calculadora de puntuación de fidelización

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

## Mejores prácticas

- **Mantén las funciones enfocadas**: Escribe funciones que hagan una sola cosa bien para mejorar la mantenibilidad y la depuración
- **Maneja los errores con elegancia**: Usa bloques try/catch para manejar posibles errores y proporcionar mensajes de error significativos
- **Prueba casos extremos**: Asegúrate de que tu código maneje correctamente entradas inusuales, valores nulos y condiciones límite
- **Optimiza el rendimiento**: Ten en cuenta la complejidad computacional y el uso de memoria para grandes conjuntos de datos
- **Usa console.log() para depuración**: Aprovecha la salida stdout para depurar y monitorear la ejecución de funciones
```

--------------------------------------------------------------------------------

---[FILE: guardrails.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/guardrails.mdx

```text
---
title: Guardrails
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

El bloque Guardrails valida y protege tus flujos de trabajo de IA comprobando el contenido contra múltiples tipos de validación. Asegura la calidad de los datos, previene alucinaciones, detecta información personal identificable (PII) y aplica requisitos de formato antes de que el contenido avance por tu flujo de trabajo.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails.png"
    alt="Bloque de barandillas de protección"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Tipos de validación

### Validación JSON

Valida que el contenido esté correctamente formateado en JSON. Perfecto para garantizar que las salidas estructuradas de LLM puedan analizarse de forma segura.

**Casos de uso:**
- Validar respuestas JSON de bloques de Agente antes de analizarlas
- Asegurar que las cargas útiles de API estén correctamente formateadas
- Verificar la integridad de datos estructurados

**Salida:**
- `passed`: `true` si es JSON válido, `false` en caso contrario
- `error`: Mensaje de error si la validación falla (p. ej., "JSON no válido: Token inesperado...")

### Validación con expresiones regulares

Comprueba si el contenido coincide con un patrón de expresión regular especificado.

**Casos de uso:**
- Validar direcciones de correo electrónico
- Comprobar formatos de números de teléfono
- Verificar URLs o identificadores personalizados
- Aplicar patrones de texto específicos

**Configuración:**
- **Patrón Regex**: La expresión regular para comparar (p. ej., `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` para correos electrónicos)

**Salida:**
- `passed`: `true` si el contenido coincide con el patrón, `false` en caso contrario
- `error`: Mensaje de error si la validación falla

### Detección de alucinaciones

Utiliza Generación Aumentada por Recuperación (RAG) con puntuación LLM para detectar cuando el contenido generado por IA contradice o no está fundamentado en tu base de conocimientos.

**Cómo funciona:**
1. Consulta tu base de conocimientos para obtener contexto relevante
2. Envía tanto la salida de IA como el contexto recuperado a un LLM
3. El LLM asigna una puntuación de confianza (escala 0-10)
   - **0** = Alucinación completa (totalmente infundada)
   - **10** = Completamente fundamentado (totalmente respaldado por la base de conocimientos)
4. La validación se aprueba si la puntuación ≥ umbral (predeterminado: 3)

**Configuración:**
- **Base de conocimiento**: Selecciona entre tus bases de conocimiento existentes
- **Modelo**: Elige el LLM para la puntuación (requiere razonamiento sólido - se recomienda GPT-4o, Claude 3.7 Sonnet)
- **Clave API**: Autenticación para el proveedor LLM seleccionado (se oculta automáticamente para modelos alojados/Ollama o compatibles con VLLM)
- **Umbral de confianza**: Puntuación mínima para aprobar (0-10, predeterminado: 3)
- **Top K** (Avanzado): Número de fragmentos de la base de conocimiento a recuperar (predeterminado: 10)

**Salida:**
- `passed`: `true` si la puntuación de confianza ≥ umbral
- `score`: Puntuación de confianza (0-10)
- `reasoning`: Explicación del LLM para la puntuación
- `error`: Mensaje de error si la validación falla

**Casos de uso:**
- Validar respuestas del agente contra documentación
- Asegurar que las respuestas de atención al cliente sean precisas
- Verificar que el contenido generado coincida con el material de origen
- Control de calidad para aplicaciones RAG

### Detección de PII

Detecta información de identificación personal utilizando Microsoft Presidio. Compatible con más de 40 tipos de entidades en múltiples países e idiomas.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails-2.png"
    alt="Configuración de detección de PII"
    width={700}
    height={450}
    className="my-6"
  />
</div>

**Cómo funciona:**
1. Pasa el contenido a validar (p. ej., `<agent1.content>`)
2. Selecciona los tipos de PII a detectar usando el selector modal
3. Elige el modo de detección (Detectar o Enmascarar)
4. El contenido es escaneado para encontrar entidades PII coincidentes
5. Devuelve los resultados de detección y opcionalmente el texto enmascarado

<div className="mx-auto w-3/5 overflow-hidden rounded-lg">
  <Video src="guardrails.mp4" width={500} height={350} />
</div>

**Configuración:**
- **Tipos de PII a detectar**: Selecciona de categorías agrupadas mediante selector modal
  - **Común**: Nombre de persona, correo electrónico, teléfono, tarjeta de crédito, dirección IP, etc.
  - **EE.UU.**: SSN, licencia de conducir, pasaporte, etc.
  - **Reino Unido**: Número NHS, número de seguro nacional
  - **España**: NIF, NIE, CIF
  - **Italia**: Código fiscal, licencia de conducir, código IVA
  - **Polonia**: PESEL, NIP, REGON
  - **Singapur**: NRIC/FIN, UEN
  - **Australia**: ABN, ACN, TFN, Medicare
  - **India**: Aadhaar, PAN, pasaporte, número de votante
- **Modo**: 
  - **Detectar**: Solo identificar PII (predeterminado)
  - **Enmascarar**: Reemplazar PII detectada con valores enmascarados
- **Idioma**: Idioma de detección (predeterminado: inglés)

**Salida:**
- `passed`: `false` si se detectan los tipos de PII seleccionados
- `detectedEntities`: Array de PII detectada con tipo, ubicación y confianza
- `maskedText`: Contenido con PII enmascarada (solo si modo = "Mask")
- `error`: Mensaje de error si la validación falla

**Casos de uso:**
- Bloquear contenido que contiene información personal sensible
- Enmascarar PII antes de registrar o almacenar datos
- Cumplimiento de GDPR, HIPAA y otras regulaciones de privacidad
- Sanear entradas de usuario antes del procesamiento

## Configuración

### Contenido a validar

El contenido de entrada para validar. Esto típicamente proviene de:
- Salidas de bloques de agente: `<agent.content>`
- Resultados de bloques de función: `<function.output>`
- Respuestas de API: `<api.output>`
- Cualquier otra salida de bloque

### Tipo de validación

Elige entre cuatro tipos de validación:
- **JSON válido**: Comprueba si el contenido es JSON correctamente formateado
- **Coincidencia regex**: Verifica si el contenido coincide con un patrón regex
- **Verificación de alucinaciones**: Valida contra base de conocimiento con puntuación de LLM
- **Detección de PII**: Detecta y opcionalmente enmascara información de identificación personal

## Salidas

Todos los tipos de validación devuelven:

- **`<guardrails.passed>`**: Booleano que indica si la validación pasó
- **`<guardrails.validationType>`**: El tipo de validación realizada
- **`<guardrails.input>`**: La entrada original que fue validada
- **`<guardrails.error>`**: Mensaje de error si la validación falló (opcional)

Salidas adicionales por tipo:

**Verificación de alucinaciones:**
- **`<guardrails.score>`**: Puntuación de confianza (0-10)
- **`<guardrails.reasoning>`**: Explicación del LLM

**Detección de PII:**
- **`<guardrails.detectedEntities>`**: Array de entidades PII detectadas
- **`<guardrails.maskedText>`**: Contenido con PII enmascarado (si el modo = "Mask")

## Ejemplos de casos de uso

**Validar JSON antes de analizar** - Asegurar que la salida del Agente es JSON válido

```
Agent (Generate) → Guardrails (Validate) → Condition (Check passed) → Function (Parse)
```

**Prevenir alucinaciones** - Validar respuestas de atención al cliente contra base de conocimiento

```
Agent (Response) → Guardrails (Check KB) → Condition (Score ≥ 3) → Send or Flag
```

**Bloquear PII en entradas de usuario** - Sanear contenido enviado por usuarios

```
Input → Guardrails (Detect PII) → Condition (No PII) → Process or Reject
```

## Mejores prácticas

- **Encadenar con bloques de Condición**: Usar `<guardrails.passed>` para ramificar la lógica del flujo de trabajo basada en resultados de validación
- **Usar validación JSON antes de analizar**: Siempre validar la estructura JSON antes de intentar analizar salidas de LLM
- **Elegir tipos de PII apropiados**: Seleccionar solo los tipos de entidades PII relevantes para tu caso de uso para mejor rendimiento
- **Establecer umbrales de confianza razonables**: Para detección de alucinaciones, ajustar el umbral según tus requisitos de precisión (más alto = más estricto)
- **Usar modelos potentes para detección de alucinaciones**: GPT-4o o Claude 3.7 Sonnet proporcionan puntuaciones de confianza más precisas
- **Enmascarar PII para registro**: Usar modo "Mask" cuando necesites registrar o almacenar contenido que pueda contener PII
- **Probar patrones regex**: Validar tus patrones regex exhaustivamente antes de implementarlos en producción
- **Monitorear fallos de validación**: Seguir los mensajes `<guardrails.error>` para identificar problemas comunes de validación

<Callout type="info">
  La validación de barandillas ocurre de forma sincrónica en tu flujo de trabajo. Para la detección de alucinaciones, elige modelos más rápidos (como GPT-4o-mini) si la latencia es crítica.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: human-in-the-loop.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/human-in-the-loop.mdx

```text
---
title: Human in the Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

El bloque Human in the Loop pausa la ejecución del flujo de trabajo y espera la intervención humana antes de continuar. Úsalo para añadir puntos de aprobación, recopilar comentarios o reunir información adicional en puntos críticos de decisión.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-1.png"
    alt="Configuración del bloque Human in the Loop"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Cuando la ejecución llega a este bloque, el flujo de trabajo se pausa indefinidamente hasta que un humano proporcione información a través del portal de aprobación, API o webhook.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-2.png"
    alt="Portal de aprobación Human in the Loop"
    width={700}
    height={500}
    className="my-6"
  />
</div>

## Opciones de configuración

### Salida en pausa

Define qué datos se muestran al aprobador. Este es el contexto que se muestra en el portal de aprobación para ayudarles a tomar una decisión informada.

Utiliza el constructor visual o el editor JSON para estructurar los datos. Haz referencia a las variables del flujo de trabajo usando la sintaxis `<blockName.output>`.

```json
{
  "customerName": "<agent1.content.name>",
  "proposedAction": "<router1.selectedPath>",
  "confidenceScore": "<evaluator1.score>",
  "generatedEmail": "<agent2.content>"
}
```

### Notificación

Configura cómo se alerta a los aprobadores cuando se necesita aprobación. Los canales compatibles incluyen:

- **Slack** - Mensajes a canales o mensajes directos
- **Gmail** - Correo electrónico con enlace de aprobación
- **Microsoft Teams** - Notificaciones de canal de equipo
- **SMS** - Alertas de texto vía Twilio
- **Webhooks** - Sistemas de notificación personalizados

Incluye la URL de aprobación (`<blockId.url>`) en tus mensajes de notificación para que los aprobadores puedan acceder al portal.

### Entrada para reanudar

Define los campos que los aprobadores completan al responder. Estos datos estarán disponibles para los bloques posteriores después de que el flujo de trabajo se reanude.

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

Accede a los datos del resumen en bloques posteriores usando `<blockId.resumeInput.fieldName>`. 

## Métodos de aprobación

<Tabs items={['Portal de aprobación', 'API', 'Webhook']}>
  <Tab>
    ### Portal de aprobación
    
    Cada bloque genera una URL única del portal (`<blockId.url>`) con una interfaz visual que muestra todos los datos de salida pausados y campos de formulario para reanudar la entrada. Adaptable a dispositivos móviles y seguro.
    
    Comparte esta URL en notificaciones para que los aprobadores revisen y respondan.
  </Tab>
  <Tab>
    ### API REST
    
    Reanuda flujos de trabajo programáticamente:
    

    ```bash
    POST /api/workflows/{workflowId}/executions/{executionId}/resume/{blockId}
    
    {
      "approved": true,
      "comments": "Looks good to proceed"
    }
    ```

    
    Construye interfaces de aprobación personalizadas o intégralas con sistemas existentes.
  </Tab>
  <Tab>
    ### Webhook
    
    Añade una herramienta de webhook a la sección de Notificación para enviar solicitudes de aprobación a sistemas externos. Integra con sistemas de tickets como Jira o ServiceNow.
  </Tab>
</Tabs>

## Casos de uso comunes

**Aprobación de contenido** - Revisa el contenido generado por IA antes de publicarlo

```
Agent → Human in the Loop → API (Publish)
```

**Aprobaciones de múltiples etapas** - Encadena múltiples pasos de aprobación para decisiones de alto riesgo

```
Agent → Human in the Loop (Manager) → Human in the Loop (Director) → Execute
```

**Validación de datos** - Verifica los datos extraídos antes de procesarlos

```
Agent (Extract) → Human in the Loop (Validate) → Function (Process)
```

**Control de calidad** - Revisa las salidas de IA antes de enviarlas a los clientes

```
Agent (Generate) → Human in the Loop (QA) → Gmail (Send)
```

## Salidas del bloque

**`url`** - URL única para el portal de aprobación  
**`resumeInput.*`** - Todos los campos definidos en Reanudar entrada quedan disponibles después de que el flujo de trabajo se reanude

Accede usando `<blockId.resumeInput.fieldName>`.

## Ejemplo

**Salida pausada:**

```json
{
  "title": "<agent1.content.title>",
  "body": "<agent1.content.body>",
  "qualityScore": "<evaluator1.score>"
}
```

**Reanudar entrada:**

```json
{
  "approved": { "type": "boolean" },
  "feedback": { "type": "string" }
}
```

**Uso posterior:**

```javascript
// Condition block
<approval1.resumeInput.approved> === true
```

El ejemplo a continuación muestra un portal de aprobación como lo ve un aprobador después de que el flujo de trabajo se pausa. Los aprobadores pueden revisar los datos y proporcionar entradas como parte de la reanudación del flujo de trabajo. Se puede acceder al portal de aprobación directamente a través de la URL única, `<blockId.url>`.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="hitl-resume.mp4" width={700} height={450} />
</div>

## Bloques relacionados

- **[Condición](/blocks/condition)** - Ramificación basada en decisiones de aprobación
- **[Variables](/blocks/variables)** - Almacenar historial de aprobación y metadatos
- **[Respuesta](/blocks/response)** - Devolver resultados del flujo de trabajo a los solicitantes de API
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/index.mdx

```text
---
title: Descripción general
description: Los componentes de construcción de tus flujos de trabajo de IA
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Los bloques son los componentes de construcción que conectas para crear flujos de trabajo de IA. Piensa en ellos como módulos especializados que manejan tareas específicas—desde chatear con modelos de IA hasta realizar llamadas API o procesar datos.

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Tipos de bloques principales

Sim proporciona tipos de bloques esenciales que manejan las funciones principales de los flujos de trabajo de IA:

### Bloques de procesamiento
- **[Agente](/blocks/agent)** - Chatea con modelos de IA (OpenAI, Anthropic, Google, modelos locales)
- **[Función](/blocks/function)** - Ejecuta código personalizado de JavaScript/TypeScript
- **[API](/blocks/api)** - Conecta con servicios externos mediante peticiones HTTP

### Bloques lógicos
- **[Condición](/blocks/condition)** - Ramifica caminos de flujo de trabajo basados en expresiones booleanas
- **[Enrutador](/blocks/router)** - Usa IA para dirigir inteligentemente las solicitudes a diferentes caminos
- **[Evaluador](/blocks/evaluator)** - Puntúa y evalúa la calidad del contenido usando IA

### Bloques de control de flujo
- **[Variables](/blocks/variables)** - Establece y gestiona variables de alcance del flujo de trabajo
- **[Espera](/blocks/wait)** - Pausa la ejecución del flujo de trabajo durante un tiempo específico
- **[Humano en el proceso](/blocks/human-in-the-loop)** - Pausa para aprobación y retroalimentación humana antes de continuar

### Bloques de salida
- **[Respuesta](/blocks/response)** - Formatear y devolver resultados finales desde tu flujo de trabajo

## Cómo funcionan los bloques

Cada bloque tiene tres componentes principales:

**Entradas**: Datos que ingresan al bloque desde otros bloques o entrada del usuario
**Configuración**: Ajustes que controlan cómo se comporta el bloque
**Salidas**: Datos que el bloque produce para que otros bloques los utilicen

<Steps>
  <Step>
    <strong>Recibir entrada</strong>: El bloque recibe datos de bloques conectados o entrada del usuario
  </Step>
  <Step>
    <strong>Procesar</strong>: El bloque procesa la entrada según su configuración
  </Step>
  <Step>
    <strong>Resultados de salida</strong>: El bloque produce datos de salida para los siguientes bloques en el flujo de trabajo
  </Step>
</Steps>

## Conectando bloques

Creas flujos de trabajo conectando bloques entre sí. La salida de un bloque se convierte en la entrada de otro:

- **Arrastrar para conectar**: Arrastra desde un puerto de salida a un puerto de entrada
- **Múltiples conexiones**: Una salida puede conectarse a múltiples entradas
- **Rutas ramificadas**: Algunos bloques pueden dirigir a diferentes rutas según las condiciones

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Patrones comunes

### Procesamiento secuencial
Conecta bloques en cadena donde cada bloque procesa la salida del anterior:

```
User Input → Agent → Function → Response
```

### Ramificación condicional
Utiliza bloques de Condición o Enrutador para crear diferentes rutas:

```
User Input → Router → Agent A (for questions)
                   → Agent B (for commands)
```

### Control de calidad
Utiliza bloques Evaluadores para evaluar y filtrar salidas:

```
Agent → Evaluator → Condition → Response (if good)
                              → Agent (retry if bad)
```

## Configuración de bloques

Cada tipo de bloque tiene opciones de configuración específicas:

**Todos los bloques**:
- Conexiones de entrada/salida
- Comportamiento de manejo de errores
- Configuración de tiempo de espera de ejecución

**Bloques de IA** (Agente, Enrutador, Evaluador):
- Selección de modelo (OpenAI, Anthropic, Google, local)
- Claves API y autenticación
- Temperatura y otros parámetros del modelo
- Instrucciones y prompts del sistema

**Bloques lógicos** (Condición, Función):
- Expresiones o código personalizado
- Referencias de variables
- Configuración del entorno de ejecución

**Bloques de integración** (API, Respuesta):
- Configuración de endpoint
- Encabezados y autenticación
- Formato de solicitud/respuesta

<Cards>
  <Card title="Bloque de agente" href="/blocks/agent">
    Conéctate a modelos de IA y crea respuestas inteligentes
  </Card>
  <Card title="Bloque de función" href="/blocks/function">
    Ejecuta código personalizado para procesar y transformar datos
  </Card>
  <Card title="Bloque de API" href="/blocks/api">
    Integra con servicios externos y APIs
  </Card>
  <Card title="Bloque de condición" href="/blocks/condition">
    Crea lógica de ramificación basada en evaluación de datos
  </Card>
  <Card title="Bloque de humano en el proceso" href="/blocks/human-in-the-loop">
    Pausa para aprobación y retroalimentación humana antes de continuar
  </Card>
  <Card title="Bloque de variables" href="/blocks/variables">
    Establece y gestiona variables de alcance del flujo de trabajo
  </Card>
  <Card title="Bloque de espera" href="/blocks/wait">
    Pausa la ejecución del flujo de trabajo durante tiempos específicos
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: loop.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/loop.mdx

```text
---
title: Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Loop es un contenedor que ejecuta bloques repetidamente. Itera sobre colecciones, repite operaciones un número fijo de veces o continúa mientras se cumpla una condición.

<Callout type="info">
  Los bloques Loop son nodos contenedores que albergan otros bloques dentro de ellos. Los bloques contenidos se ejecutan múltiples veces según tu configuración.
</Callout>

## Opciones de configuración

### Tipo de bucle

Elige entre cuatro tipos de bucles:

<Tabs items={['For Loop', 'ForEach Loop', 'While Loop', 'Do-While Loop']}>
  <Tab>
    **Bucle For (Iteraciones)** - Un bucle numérico que se ejecuta un número fijo de veces:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-1.png"
        alt="Bucle For con iteraciones"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Úsalo cuando necesites repetir una operación un número específico de veces.
    

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
    **Bucle ForEach (Colección)** - Un bucle basado en colecciones que itera sobre cada elemento en un array u objeto:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-2.png"
        alt="Bucle ForEach con colección"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Úsalo cuando necesites procesar una colección de elementos.
    

    ```
    Example: Process ["apple", "banana", "orange"]
    - Iteration 1: Process "apple"
    - Iteration 2: Process "banana"
    - Iteration 3: Process "orange"
    ```

  </Tab>
  <Tab>
    **Bucle While (Basado en condición)** - Continúa ejecutándose mientras una condición se evalúe como verdadera:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-3.png"
        alt="Bucle While con condición"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Úsalo cuando necesites repetir hasta que se cumpla una condición específica. La condición se verifica **antes** de cada iteración.

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
    **Bucle Do-While (Basado en condición)** - Se ejecuta al menos una vez, luego continúa mientras una condición sea verdadera:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-4.png"
        alt="Bucle Do-While con condición"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Úsalo cuando necesites ejecutar al menos una vez, luego repetir hasta que se cumpla una condición. La condición se verifica **después** de cada iteración.

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

## Cómo usar bucles

### Creando un bucle

1. Arrastra un bloque de Bucle desde la barra de herramientas a tu lienzo
2. Configura el tipo de bucle y los parámetros
3. Arrastra otros bloques dentro del contenedor del bucle
4. Conecta los bloques según sea necesario

### Accediendo a los resultados

Después de que un bucle se completa, puedes acceder a los resultados agregados:

- **loop.results**: Array de resultados de todas las iteraciones del bucle

## Ejemplos de casos de uso

**Procesamiento de resultados de API** - Bucle ForEach procesa registros de clientes desde una API

```javascript
// Procesar cada cliente en la respuesta de la API
forEach(response.customers, (customer) => {
  // Verificar estado de la cuenta
  if (customer.status === 'active') {
    // Enviar correo electrónico de bienvenida
    sendEmail(customer.email, 'Bienvenido a nuestro servicio');
  }
});
```

**Generación iterativa de contenido** - Bucle For genera múltiples variaciones de contenido

```javascript
// Generar 3 variaciones de contenido
for (let i = 0; i < 3; i++) {
  // Crear variación con diferentes tonos
  const variation = generateContent({
    topic: 'beneficios del producto',
    tone: ['profesional', 'casual', 'entusiasta'][i]
  });
  // Guardar variación
  variations.push(variation);
}
```

**Contador con bucle While** - Bucle While procesa elementos con contador

```javascript
// Procesar elementos mientras haya disponibles
let count = 0;
while (count < items.length) {
  // Procesar elemento actual
  processItem(items[count]);
  // Incrementar contador
  count++;
}
```

## Características avanzadas

### Limitaciones

<Callout type="warning">
  Los bloques contenedores (Bucles y Paralelos) no pueden anidarse unos dentro de otros. Esto significa:
  - No puedes colocar un bloque de Bucle dentro de otro bloque de Bucle
  - No puedes colocar un bloque Paralelo dentro de un bloque de Bucle
  - No puedes colocar ningún bloque contenedor dentro de otro bloque contenedor
  
  Si necesitas iteración multidimensional, considera reestructurar tu flujo de trabajo para usar bucles secuenciales o procesar datos por etapas.
</Callout>

<Callout type="info">
  Los bucles se ejecutan secuencialmente, no en paralelo. Si necesitas ejecución concurrente, usa el bloque Paralelo en su lugar.
</Callout>

## Entradas y salidas

<Tabs items={['Configuración', 'Variables', 'Resultados']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Tipo de bucle</strong>: Elige entre 'for', 'forEach', 'while', o 'doWhile'
      </li>
      <li>
        <strong>Iteraciones</strong>: Número de veces a ejecutar (bucles for)
      </li>
      <li>
        <strong>Colección</strong>: Array u objeto sobre el que iterar (bucles forEach)
      </li>
      <li>
        <strong>Condición</strong>: Expresión booleana a evaluar (bucles while/do-while)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.currentItem</strong>: Elemento actual siendo procesado
      </li>
      <li>
        <strong>loop.index</strong>: Número de iteración actual (base 0)
      </li>
      <li>
        <strong>loop.items</strong>: Colección completa (bucles forEach)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.results</strong>: Array de todos los resultados de iteración
      </li>
      <li>
        <strong>Estructura</strong>: Los resultados mantienen el orden de iteración
      </li>
      <li>
        <strong>Acceso</strong>: Disponible en bloques después del bucle
      </li>
    </ul>
  </Tab>
</Tabs>

## Mejores prácticas

- **Establece límites razonables**: Mantén el número de iteraciones en un nivel razonable para evitar tiempos de ejecución prolongados
- **Usa ForEach para colecciones**: Cuando proceses arrays u objetos, utiliza bucles ForEach en lugar de bucles For
- **Maneja los errores con elegancia**: Considera añadir manejo de errores dentro de los bucles para flujos de trabajo robustos
```

--------------------------------------------------------------------------------

````
