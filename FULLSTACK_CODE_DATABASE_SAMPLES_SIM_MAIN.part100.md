---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 100
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 100 of 933)

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

---[FILE: parallel.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/parallel.mdx

```text
---
title: Paralelo
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Paralelo es un contenedor que ejecuta múltiples instancias concurrentemente para un procesamiento más rápido del flujo de trabajo. Procesa elementos simultáneamente en lugar de secuencialmente.

<Callout type="info">
  Los bloques paralelos son nodos contenedores que ejecutan su contenido múltiples veces simultáneamente, a diferencia de los bucles que ejecutan secuencialmente.
</Callout>

## Opciones de configuración

### Tipo de paralelismo

Elige entre dos tipos de ejecución paralela:

<Tabs items={['Count-based', 'Collection-based']}>
  <Tab>
    **Paralelismo basado en conteo** - Ejecuta un número fijo de instancias paralelas:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-1.png"
        alt="Ejecución paralela basada en conteo"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Úsalo cuando necesites ejecutar la misma operación múltiples veces concurrentemente.
    

    ```
    Example: Run 5 parallel instances
    - Instance 1 ┐
    - Instance 2 ├─ All execute simultaneously
    - Instance 3 │
    - Instance 4 │
    - Instance 5 ┘
    ```

  </Tab>
  <Tab>
    **Paralelismo basado en colección** - Distribuye una colección entre instancias paralelas:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-2.png"
        alt="Ejecución paralela basada en colección"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Cada instancia procesa un elemento de la colección simultáneamente.
    

    ```
    Example: Process ["task1", "task2", "task3"] in parallel
    - Instance 1: Process "task1" ┐
    - Instance 2: Process "task2" ├─ All execute simultaneously
    - Instance 3: Process "task3" ┘
    ```

  </Tab>
</Tabs>

## Cómo usar bloques paralelos

### Creación de un bloque paralelo

1. Arrastra un bloque Paralelo desde la barra de herramientas a tu lienzo
2. Configura el tipo de paralelismo y los parámetros
3. Arrastra un solo bloque dentro del contenedor paralelo
4. Conecta el bloque según sea necesario

### Acceso a los resultados

Después de que un bloque paralelo se completa, puedes acceder a los resultados agregados:

- **`<parallel.results>`**: Array de resultados de todas las instancias paralelas

## Ejemplos de casos de uso

**Procesamiento por lotes de API** - Procesa múltiples llamadas API simultáneamente

```
Parallel (Collection) → API (Call Endpoint) → Function (Aggregate)
```

**Procesamiento de IA con múltiples modelos** - Obtén respuestas de varios modelos de IA concurrentemente

```
Parallel (["gpt-4o", "claude-3.7-sonnet", "gemini-2.5-pro"]) → Agent → Evaluator (Select Best)
```

## Características avanzadas

### Agregación de resultados

Los resultados de todas las instancias paralelas se recopilan automáticamente:

### Procesamiento paralelo de datos

### Aislamiento de instancias

Cada instancia paralela se ejecuta de forma independiente:
- Ámbitos de variables separados
- Sin estado compartido entre instancias
- Los fallos en una instancia no afectan a las demás

### Limitaciones

<Callout type="warning">
  Los bloques contenedores (Bucles y Paralelos) no pueden anidarse unos dentro de otros. Esto significa:
  - No puedes colocar un bloque de Bucle dentro de un bloque Paralelo
  - No puedes colocar otro bloque Paralelo dentro de un bloque Paralelo
  - No puedes colocar ningún bloque contenedor dentro de otro bloque contenedor
</Callout>

<Callout type="info">
  Aunque la ejecución en paralelo es más rápida, ten en cuenta:
  - Límites de tasa de API al realizar solicitudes concurrentes
  - Uso de memoria con conjuntos de datos grandes
  - Máximo de 20 instancias concurrentes para evitar el agotamiento de recursos
</Callout>

## Paralelo vs Bucle

Entendiendo cuándo usar cada uno:

| Característica | Paralelo | Bucle |
|---------|----------|------|
| Ejecución | Concurrente | Secuencial |
| Velocidad | Más rápido para operaciones independientes | Más lento pero ordenado |
| Orden | Sin orden garantizado | Mantiene el orden |
| Caso de uso | Operaciones independientes | Operaciones dependientes |
| Uso de recursos | Mayor | Menor |

## Entradas y Salidas

<Tabs items={['Configuración', 'Variables', 'Resultados']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Tipo de paralelo</strong>: Elige entre 'count' o 'collection'
      </li>
      <li>
        <strong>Count</strong>: Número de instancias a ejecutar (basado en conteo)
      </li>
      <li>
        <strong>Collection</strong>: Array u objeto a distribuir (basado en colección)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.currentItem</strong>: Elemento para esta instancia
      </li>
      <li>
        <strong>parallel.index</strong>: Número de instancia (base 0)
      </li>
      <li>
        <strong>parallel.items</strong>: Colección completa (basado en colección)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.results</strong>: Array de todos los resultados de instancias
      </li>
      <li>
        <strong>Access</strong>: Disponible en bloques después del paralelo
      </li>
    </ul>
  </Tab>
</Tabs>

## Mejores prácticas

- **Solo operaciones independientes**: Asegúrate de que las operaciones no dependan entre sí
- **Gestionar límites de tasa**: Añade retrasos o limitaciones para flujos de trabajo con uso intensivo de API
- **Manejo de errores**: Cada instancia debe manejar sus propios errores correctamente
```

--------------------------------------------------------------------------------

---[FILE: response.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/response.mdx

```text
---
title: Respuesta
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque de Respuesta formatea y envía respuestas HTTP estructuradas de vuelta a los llamadores de la API. Úsalo para devolver resultados del flujo de trabajo con códigos de estado y encabezados adecuados.

<div className="flex justify-center">
  <Image
    src="/static/blocks/response.png"
    alt="Configuración del bloque de respuesta"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
  Los bloques de Respuesta son bloques terminales - finalizan la ejecución del flujo de trabajo y no pueden conectarse a otros bloques.
</Callout>

## Opciones de configuración

### Datos de respuesta

Los datos de respuesta son el contenido principal que se enviará de vuelta al llamador de la API. Deben estar formateados como JSON y pueden incluir:

- Valores estáticos
- Referencias dinámicas a variables del flujo de trabajo usando la sintaxis `<variable.name>`
- Objetos y arrays anidados
- Cualquier estructura JSON válida

### Código de estado

Establece el código de estado HTTP para la respuesta (por defecto es 200):

**Éxito (2xx):**
- **200**: OK - Respuesta de éxito estándar
- **201**: Creado - Recurso creado exitosamente
- **204**: Sin contenido - Éxito sin cuerpo de respuesta

**Error del cliente (4xx):**
- **400**: Solicitud incorrecta - Parámetros de solicitud inválidos
- **401**: No autorizado - Se requiere autenticación
- **404**: No encontrado - El recurso no existe
- **422**: Entidad no procesable - Errores de validación

**Error del servidor (5xx):**
- **500**: Error interno del servidor - Error del lado del servidor
- **502**: Puerta de enlace incorrecta - Error de servicio externo
- **503**: Servicio no disponible - Servicio temporalmente caído

### Encabezados de respuesta

Configura encabezados HTTP adicionales para incluir en la respuesta.

Los encabezados se configuran como pares clave-valor:

| Clave | Valor |
|-----|-------|
| Content-Type | application/json |
| Cache-Control | no-cache |
| X-API-Version | 1.0 |

## Ejemplos de casos de uso

**Respuesta de punto final de API** - Devuelve datos estructurados desde una API de búsqueda

```
Agent (Search) → Function (Format & Paginate) → Response (200, JSON)
```

**Confirmación de webhook** - Confirma la recepción y procesamiento del webhook

```
Webhook Trigger → Function (Process) → Response (200, Confirmation)
```

**Manejo de respuestas de error** - Devuelve respuestas de error apropiadas

```
Condition (Error Detected) → Router → Response (400/500, Error Details)
```

## Salidas

Los bloques de respuesta son terminales - finalizan la ejecución del flujo de trabajo y envían la respuesta HTTP al solicitante de la API. No hay salidas disponibles para bloques posteriores.

## Referencias de variables

Usa la sintaxis `<variable.name>` para insertar dinámicamente variables del flujo de trabajo en tu respuesta:

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
  Los nombres de variables distinguen entre mayúsculas y minúsculas y deben coincidir exactamente con las variables disponibles en tu flujo de trabajo.
</Callout>

## Mejores prácticas

- **Usa códigos de estado significativos**: Elige códigos de estado HTTP apropiados que reflejen con precisión el resultado del flujo de trabajo
- **Estructura tus respuestas de manera consistente**: Mantén una estructura JSON consistente en todos tus puntos finales de API para una mejor experiencia del desarrollador
- **Incluye metadatos relevantes**: Añade marcas de tiempo e información de versión para ayudar con la depuración y el monitoreo
- **Maneja los errores con elegancia**: Usa lógica condicional en tu flujo de trabajo para establecer respuestas de error apropiadas con mensajes descriptivos
- **Valida las referencias de variables**: Asegúrate de que todas las variables referenciadas existan y contengan los tipos de datos esperados antes de que se ejecute el bloque de Respuesta
```

--------------------------------------------------------------------------------

---[FILE: router.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/router.mdx

```text
---
title: Router
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Router utiliza IA para dirigir flujos de trabajo de manera inteligente basándose en el análisis de contenido. A diferencia de los bloques de Condición que utilizan reglas simples, los Routers comprenden el contexto y la intención.

<div className="flex justify-center">
  <Image
    src="/static/blocks/router.png"
    alt="Bloque Router con múltiples caminos"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Router vs Condición

**Usa Router cuando:**
- Se necesita análisis de contenido impulsado por IA
- Trabajas con contenido no estructurado o variable
- Se requiere enrutamiento basado en intención (p. ej., "dirigir tickets de soporte a departamentos")

**Usa Condición cuando:**
- Las decisiones simples basadas en reglas son suficientes
- Trabajas con datos estructurados o comparaciones numéricas
- Se necesita un enrutamiento rápido y determinista

## Opciones de configuración

### Contenido/Prompt

El contenido o prompt que el Router analizará para tomar decisiones de enrutamiento. Esto puede ser:

- Una consulta o entrada directa del usuario
- Resultado de un bloque anterior
- Un mensaje generado por el sistema

### Bloques de destino

Los posibles bloques de destino entre los que el Router puede seleccionar. El Router detectará automáticamente los bloques conectados, pero también puedes:

- Personalizar las descripciones de los bloques de destino para mejorar la precisión del enrutamiento
- Especificar criterios de enrutamiento para cada bloque de destino
- Excluir ciertos bloques de ser considerados como destinos de enrutamiento

### Selección de modelo

Elige un modelo de IA para impulsar la decisión de enrutamiento:

- **OpenAI**: GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Otros proveedores**: Groq, Cerebras, xAI, DeepSeek
- **Modelos locales**: modelos compatibles con Ollama o VLLM

Utiliza modelos con fuertes capacidades de razonamiento como GPT-4o o Claude 3.7 Sonnet para obtener mejores resultados.

### Clave API

Tu clave API para el proveedor LLM seleccionado. Se almacena de forma segura y se utiliza para la autenticación.

## Salidas

- **`<router.prompt>`**: Resumen del prompt de enrutamiento
- **`<router.selected_path>`**: Bloque de destino elegido
- **`<router.tokens>`**: Estadísticas de uso de tokens
- **`<router.cost>`**: Costo estimado de enrutamiento
- **`<router.model>`**: Modelo utilizado para la toma de decisiones

## Ejemplos de casos de uso

**Clasificación de soporte al cliente** - Enrutar tickets a departamentos especializados

```
Input (Ticket) → Router → Agent (Engineering) or Agent (Finance)
```

**Clasificación de contenido** - Clasificar y enrutar contenido generado por usuarios

```
Input (Feedback) → Router → Workflow (Product) or Workflow (Technical)
```

**Calificación de leads** - Enrutar leads según criterios de calificación

```
Input (Lead) → Router → Agent (Enterprise Sales) or Workflow (Self-serve)
```

## Mejores prácticas

- **Proporcionar descripciones claras de los objetivos**: Ayuda al Router a entender cuándo seleccionar cada destino con descripciones específicas y detalladas
- **Usar criterios de enrutamiento específicos**: Define condiciones claras y ejemplos para cada ruta para mejorar la precisión
- **Implementar rutas alternativas**: Conecta un destino predeterminado para cuando ninguna ruta específica sea apropiada
- **Probar con entradas diversas**: Asegúrate de que el Router maneja varios tipos de entrada, casos extremos y contenido inesperado
- **Monitorear el rendimiento del enrutamiento**: Revisa las decisiones de enrutamiento regularmente y refina los criterios basándote en patrones de uso reales
- **Elegir modelos apropiados**: Usa modelos con fuertes capacidades de razonamiento para decisiones de enrutamiento complejas
```

--------------------------------------------------------------------------------

---[FILE: variables.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/variables.mdx

```text
---
title: Variables
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

El bloque Variables actualiza las variables del flujo de trabajo durante la ejecución. Las variables deben inicializarse primero en la sección Variables de tu flujo de trabajo, luego puedes usar este bloque para actualizar sus valores mientras se ejecuta tu flujo de trabajo.

<div className="flex justify-center">
  <Image
    src="/static/blocks/variables.png"
    alt="Bloque de variables"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout>
  Accede a las variables en cualquier parte de tu flujo de trabajo usando la sintaxis `<variable.variableName>`.
</Callout>

## Cómo usar variables

### 1. Inicializar en variables de flujo de trabajo

Primero, crea tus variables en la sección Variables del flujo de trabajo (accesible desde la configuración del flujo de trabajo):

```
customerEmail = ""
retryCount = 0
currentStatus = "pending"
```

### 2. Actualizar con el bloque de variables

Usa el bloque Variables para actualizar estos valores durante la ejecución:

```
customerEmail = <api.email>
retryCount = <variable.retryCount> + 1
currentStatus = "processing"
```

### 3. Acceder desde cualquier lugar

Referencia variables en cualquier bloque:

```
Agent prompt: "Send email to <variable.customerEmail>"
Condition: <variable.retryCount> < 5
API body: {"status": "<variable.currentStatus>"}
```

## Ejemplos de casos de uso

**Contador de bucle y estado** - Seguimiento del progreso a través de iteraciones

```
Loop → Agent (Process) → Variables (itemsProcessed + 1) → Variables (Store lastResult)
```

**Lógica de reintentos** - Seguimiento de intentos de API

```
API (Try) → Variables (retryCount + 1) → Condition (retryCount < 3)
```

**Configuración dinámica** - Almacenar contexto de usuario para el flujo de trabajo

```
API (Fetch Profile) → Variables (userId, userTier) → Agent (Personalize)
```

## Salidas

- **`<variables.assignments>`**: Objeto JSON con todas las asignaciones de variables de este bloque

## Mejores prácticas

- **Inicializar en la configuración del flujo de trabajo**: Siempre crea variables en la sección Variables del flujo de trabajo antes de usarlas
- **Actualizar dinámicamente**: Usa bloques de Variables para actualizar valores basados en salidas de bloques o cálculos
- **Usar en bucles**: Perfecto para seguir el estado a través de iteraciones
- **Nombrar descriptivamente**: Usa nombres claros como `currentIndex`, `totalProcessed`, o `lastError`
```

--------------------------------------------------------------------------------

---[FILE: wait.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/wait.mdx

```text
---
title: Espera
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

El bloque Espera pausa tu flujo de trabajo durante un tiempo específico antes de continuar con el siguiente bloque. Úsalo para añadir retrasos entre acciones, respetar límites de frecuencia de API o espaciar operaciones.

<div className="flex justify-center">
  <Image
    src="/static/blocks/wait.png"
    alt="Bloque de espera"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuración

### Cantidad de espera

Introduce la duración para pausar la ejecución:
- **Entrada**: Número positivo
- **Máximo**: 600 segundos (10 minutos) o 10 minutos

### Unidad

Elige la unidad de tiempo:
- **Segundos**: Para retrasos cortos y precisos
- **Minutos**: Para pausas más largas

<Callout type="info">
  Los bloques de espera pueden cancelarse deteniendo el flujo de trabajo. El tiempo máximo de espera es de 10 minutos.
</Callout>

## Salidas

- **`<wait.waitDuration>`**: La duración de espera en milisegundos
- **`<wait.status>`**: Estado de la espera ('esperando', 'completado' o 'cancelado')

## Ejemplos de casos de uso

**Limitación de tasa de API** - Mantente dentro de los límites de tasa de API entre solicitudes

```
API (Request 1) → Wait (2s) → API (Request 2)
```

**Notificaciones programadas** - Envía mensajes de seguimiento después de un retraso

```
Function (Send Email) → Wait (5min) → Function (Follow-up)
```

**Retrasos de procesamiento** - Espera a que el sistema externo complete el procesamiento

```
API (Trigger Job) → Wait (30s) → API (Check Status)
```

## Mejores prácticas

- **Mantén esperas razonables**: Usa Wait para retrasos de hasta 10 minutos. Para retrasos más largos, considera flujos de trabajo programados
- **Monitorea el tiempo de ejecución**: Recuerda que las esperas extienden la duración total del flujo de trabajo
```

--------------------------------------------------------------------------------

---[FILE: workflow.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/workflow.mdx

```text
---
title: Bloque de flujo de trabajo
description: Ejecuta otro flujo de trabajo dentro del flujo actual
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

## Qué hace

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow.png'
    alt='Configuración del bloque de flujo de trabajo'
    width={500}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

Coloca un bloque de Flujo de trabajo cuando quieras llamar a un flujo de trabajo secundario como parte de un flujo más grande. El bloque ejecuta la última versión implementada de ese flujo de trabajo, espera a que termine y luego continúa con el principal.

## Cómo configurarlo

1. **Elige un flujo de trabajo** del menú desplegable (las auto-referencias están bloqueadas para evitar bucles).
2. **Mapea las entradas**: Si el flujo de trabajo hijo tiene un disparador de Formulario de Entrada, verás cada campo y podrás conectar variables del padre. Los valores mapeados son los que recibe el hijo.

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow-2.png'
    alt='Bloque de flujo de trabajo con ejemplo de mapeo de entrada'
    width={700}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

3. **Salidas**: Después de que el hijo finalice, el bloque expone:
   - `result` – la respuesta final del flujo de trabajo hijo
   - `success` – si se ejecutó sin errores
   - `error` – mensaje cuando la ejecución falla

## Insignia de estado de implementación

El bloque de flujo de trabajo muestra una insignia de estado de implementación para ayudarte a realizar un seguimiento de si el flujo de trabajo secundario está listo para ejecutarse:

- **Implementado** – El flujo de trabajo secundario ha sido implementado y está listo para usar. El bloque ejecutará la versión implementada actual.
- **No implementado** – El flujo de trabajo secundario nunca ha sido implementado. Debes implementarlo antes de que el bloque de flujo de trabajo pueda ejecutarlo.
- **Reimplementar** – Se han detectado cambios en el flujo de trabajo secundario desde la última implementación. Haz clic en la insignia para reimplementar el flujo de trabajo secundario con los últimos cambios.

<Callout type="warn">
El bloque de flujo de trabajo siempre ejecuta la versión implementada más reciente del flujo de trabajo secundario, no la versión del editor. Asegúrate de reimplementar después de hacer cambios para garantizar que el bloque utilice la lógica más reciente.
</Callout>

## Notas de ejecución

- Los flujos de trabajo secundarios se ejecutan en el mismo contexto de espacio de trabajo, por lo que las variables de entorno y las herramientas se mantienen.
- El bloque utiliza el control de versiones de implementación: cualquier API, programación, webhook, ejecución manual o de chat llama a la instantánea implementada. Reimplementa el flujo secundario cuando lo cambies.
- Si el flujo secundario falla, el bloque genera un error a menos que lo manejes posteriormente.

<Callout>
Mantén los flujos de trabajo secundarios enfocados. Los flujos pequeños y reutilizables facilitan su combinación sin crear anidamientos profundos.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/es/connections/basics.mdx

```text
---
title: Conceptos básicos
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Video } from '@/components/ui/video'

## Cómo funcionan las conexiones

Las conexiones son las vías que permiten que los datos fluyan entre bloques en tu flujo de trabajo. En Sim, las conexiones definen cómo la información pasa de un bloque a otro, permitiendo el flujo de datos a través de tu flujo de trabajo.

<Callout type="info">
  Cada conexión representa una relación dirigida donde los datos fluyen desde la salida de un bloque de origen
  hacia la entrada de un bloque de destino.
</Callout>

### Creación de conexiones

<Steps>
  <Step>
    <strong>Seleccionar bloque de origen</strong>: Haz clic en el puerto de salida del bloque desde el que quieres conectar
  </Step>
  <Step>
    <strong>Dibujar conexión</strong>: Arrastra hasta el puerto de entrada del bloque de destino
  </Step>
  <Step>
    <strong>Confirmar conexión</strong>: Suelta para crear la conexión
  </Step>
</Steps>

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="connections-build.mp4" width={700} height={450} />
</div>

### Flujo de conexión

El flujo de datos a través de las conexiones sigue estos principios:

1. **Flujo direccional**: Los datos siempre fluyen desde las salidas hacia las entradas
2. **Orden de ejecución**: Los bloques se ejecutan en orden según sus conexiones
3. **Transformación de datos**: Los datos pueden transformarse al pasar entre bloques
4. **Rutas condicionales**: Algunos bloques (como Router y Condition) pueden dirigir el flujo a diferentes rutas

<Callout type="warning">
  Eliminar una conexión detendrá inmediatamente el flujo de datos entre los bloques. Asegúrate de que esto es
  lo que deseas antes de eliminar conexiones.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: data-structure.mdx]---
Location: sim-main/apps/docs/content/docs/es/connections/data-structure.mdx

```text
---
title: Estructura de datos
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Cuando conectas bloques, entender la estructura de datos de las diferentes salidas de bloques es importante porque la estructura de datos de salida del bloque de origen determina qué valores están disponibles en el bloque de destino. Cada tipo de bloque produce una estructura de salida específica a la que puedes hacer referencia en bloques posteriores.

<Callout type="info">
  Entender estas estructuras de datos es esencial para utilizar eficazmente las etiquetas de conexión y
  acceder a los datos correctos en tus flujos de trabajo.
</Callout>

## Estructuras de salida de bloques

Diferentes tipos de bloques producen diferentes estructuras de salida. Esto es lo que puedes esperar de cada tipo de bloque:

<Tabs items={['Salida del agente', 'Salida de API', 'Salida de función', 'Salida del evaluador', 'Salida de condición', 'Salida del enrutador']}>
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

    ### Campos de salida del bloque de agente

    - **content**: La respuesta de texto principal generada por el agente
    - **model**: El modelo de IA utilizado (p. ej., "gpt-4o", "claude-3-opus")
    - **tokens**: Estadísticas de uso de tokens
      - **prompt**: Número de tokens en el prompt
      - **completion**: Número de tokens en la respuesta
      - **total**: Total de tokens utilizados
    - **toolCalls**: Array de llamadas a herramientas realizadas por el agente (si las hay)
    - **cost**: Array de objetos de costo para cada llamada a herramienta (si las hay)
    - **usage**: Estadísticas de uso de tokens para toda la respuesta

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

    ### Campos de salida del bloque de API

    - **data**: Los datos de respuesta de la API (puede ser de cualquier tipo)
    - **status**: Código de estado HTTP de la respuesta
    - **headers**: Cabeceras HTTP devueltas por la API

  </Tab>
  <Tab>

    ```json
    {
      "result": "Function return value",
      "stdout": "Console output",
    }
    ```

    ### Campos de salida del bloque de función

    - **result**: El valor de retorno de la función (puede ser de cualquier tipo)
    - **stdout**: Salida de consola capturada durante la ejecución de la función

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

    ### Campos de salida del bloque evaluador

    - **content**: Resumen de la evaluación
    - **model**: El modelo de IA utilizado para la evaluación
    - **tokens**: Estadísticas de uso de tokens
    - **[metricName]**: Puntuación para cada métrica definida en el evaluador (campos dinámicos)

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

    ### Campos de salida del bloque de condición

    - **conditionResult**: resultado booleano de la evaluación de la condición
    - **selectedPath**: información sobre la ruta seleccionada
      - **blockId**: ID del siguiente bloque en la ruta seleccionada
      - **blockType**: tipo del siguiente bloque
      - **blockTitle**: título del siguiente bloque
    - **selectedOption**: ID de la condición seleccionada

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

    ### Campos de salida del bloque enrutador

    - **content**: El texto de decisión de enrutamiento
    - **model**: El modelo de IA utilizado para el enrutamiento
    - **tokens**: Estadísticas de uso de tokens
    - **selectedPath**: Información sobre la ruta seleccionada
      - **blockId**: ID del bloque de destino seleccionado
      - **blockType**: Tipo del bloque seleccionado
      - **blockTitle**: Título del bloque seleccionado

  </Tab>
</Tabs>

## Estructuras de salida personalizadas

Algunos bloques pueden producir estructuras de salida personalizadas según su configuración:

1. **Bloques de agente con formato de respuesta**: Al usar un formato de respuesta en un bloque de agente, la estructura de salida coincidirá con el esquema definido en lugar de la estructura estándar.

2. **Bloques de función**: El campo `result` puede contener cualquier estructura de datos devuelta por el código de tu función.

3. **Bloques de API**: El campo `data` contendrá lo que devuelva la API, que podría ser cualquier estructura JSON válida.

<Callout type="warning">
  Verifica siempre la estructura de salida real de tus bloques durante el desarrollo para asegurarte de que
  estás referenciando los campos correctos en tus conexiones.
</Callout>

## Estructuras de datos anidadas

Muchas salidas de bloques contienen estructuras de datos anidadas. Puedes acceder a estas utilizando la notación de punto en las etiquetas de conexión:

```
<blockName.path.to.nested.data>
```

Por ejemplo:

- `<agent1.tokens.total>` - Accede al total de tokens desde un bloque de Agente
- `<api1.data.results[0].id>` - Accede al ID del primer resultado de una respuesta de API
- `<function1.result.calculations.total>` - Accede a un campo anidado en el resultado de un bloque de Función
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/connections/index.mdx

```text
---
title: Descripción general
description: Conecta tus bloques entre sí.
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { ConnectIcon } from '@/components/icons'
import { Video } from '@/components/ui/video'

Las conexiones son las vías que permiten que los datos fluyan entre bloques en tu flujo de trabajo. Definen cómo se pasa la información de un bloque a otro, permitiéndote crear procesos sofisticados de múltiples pasos.

<Callout type="info">
  Las conexiones correctamente configuradas son esenciales para crear flujos de trabajo efectivos. Determinan cómo
  se mueven los datos a través de tu sistema y cómo los bloques interactúan entre sí.
</Callout>

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

## Tipos de conexiones

Sim admite diferentes tipos de conexiones que permiten varios patrones de flujo de trabajo:

<Cards>
  <Card title="Conceptos básicos de conexiones" href="/connections/basics">
    Aprende cómo funcionan las conexiones y cómo crearlas en tus flujos de trabajo
  </Card>
  <Card title="Etiquetas de conexión" href="/connections/tags">
    Comprende cómo usar etiquetas de conexión para referenciar datos entre bloques
  </Card>
  <Card title="Estructura de datos" href="/connections/data-structure">
    Explora las estructuras de datos de salida de diferentes tipos de bloques
  </Card>
  <Card title="Acceso a datos" href="/connections/accessing-data">
    Aprende técnicas para acceder y manipular datos conectados
  </Card>
  <Card title="Mejores prácticas" href="/connections/best-practices">
    Sigue los patrones recomendados para una gestión eficaz de conexiones
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/es/connections/tags.mdx

```text
---
title: Etiquetas
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Video } from '@/components/ui/video'

Las etiquetas de conexión son representaciones visuales de los datos disponibles desde bloques conectados, proporcionando una manera fácil de referenciar datos entre bloques y salidas de bloques anteriores en tu flujo de trabajo.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

### ¿Qué son las etiquetas de conexión?

Las etiquetas de conexión son elementos interactivos que aparecen cuando los bloques están conectados. Representan los datos que pueden fluir de un bloque a otro y te permiten:

- Visualizar datos disponibles de bloques de origen
- Referenciar campos de datos específicos en bloques de destino
- Crear flujos de datos dinámicos entre bloques

<Callout type="info">
  Las etiquetas de conexión facilitan ver qué datos están disponibles de bloques anteriores y usarlos en tu
  bloque actual sin tener que recordar estructuras de datos complejas.
</Callout>

## Uso de etiquetas de conexión

Hay dos formas principales de usar etiquetas de conexión en tus flujos de trabajo:

<div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">Arrastrar y soltar</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Haz clic en una etiqueta de conexión y arrástrala a los campos de entrada de los bloques de destino. Aparecerá un menú desplegable
      mostrando los valores disponibles.
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>Pasa el cursor sobre una etiqueta de conexión para ver los datos disponibles</li>
      <li>Haz clic y arrastra la etiqueta a un campo de entrada</li>
      <li>Selecciona el campo de datos específico del menú desplegable</li>
      <li>La referencia se inserta automáticamente</li>
    </ol>
  </div>

  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">Sintaxis de corchetes angulares</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Escribe <code>&lt;&gt;</code> en los campos de entrada para ver un menú desplegable de valores de conexión disponibles
      de bloques anteriores.
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>Haz clic en cualquier campo de entrada donde quieras usar datos conectados</li>
      <li>
        Escribe <code>&lt;&gt;</code> para activar el menú desplegable de conexión
      </li>
      <li>Navega y selecciona los datos que quieres referenciar</li>
      <li>Continúa escribiendo o selecciona del menú desplegable para completar la referencia</li>
    </ol>
  </div>
</div>

## Sintaxis de etiquetas

Las etiquetas de conexión utilizan una sintaxis simple para hacer referencia a los datos:

```
<blockName.path.to.data>
```

Donde:

- `blockName` es el nombre del bloque de origen
- `path.to.data` es la ruta al campo de datos específico

Por ejemplo:

- `<agent1.content>` - Hace referencia al campo de contenido de un bloque con ID "agent1"
- `<api2.data.users[0].name>` - Hace referencia al nombre del primer usuario en el array de usuarios desde el campo de datos de un bloque con ID "api2"

## Referencias dinámicas de etiquetas

Las etiquetas de conexión se evalúan en tiempo de ejecución, lo que significa:

1. Siempre hacen referencia a los datos más actuales
2. Pueden utilizarse en expresiones y combinarse con texto estático
3. Pueden anidarse dentro de otras estructuras de datos

### Ejemplos

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
  Cuando utilices etiquetas de conexión en contextos numéricos, asegúrate de que los datos referenciados sean realmente un número
  para evitar problemas de conversión de tipos.
</Callout>
```

--------------------------------------------------------------------------------

````
