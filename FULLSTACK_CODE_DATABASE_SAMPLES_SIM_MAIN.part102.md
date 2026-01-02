---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 102
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 102 of 933)

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

---[FILE: costs.mdx]---
Location: sim-main/apps/docs/content/docs/es/execution/costs.mdx

```text
---
title: Cálculo de costos
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim calcula automáticamente los costos de todas las ejecuciones de flujos de trabajo, proporcionando precios transparentes basados en el uso de modelos de IA y cargos de ejecución. Entender estos costos te ayuda a optimizar los flujos de trabajo y gestionar tu presupuesto de manera efectiva.

## Cómo se calculan los costos

Cada ejecución de flujo de trabajo incluye dos componentes de costo:

**Cargo base por ejecución**: $0.001 por ejecución

**Uso de modelos de IA**: Costo variable basado en el consumo de tokens

```javascript
modelCost = (inputTokens × inputPrice + outputTokens × outputPrice) / 1,000,000
totalCost = baseExecutionCharge + modelCost
```

<Callout type="info">
  Los precios de los modelos de IA son por millón de tokens. El cálculo divide por 1.000.000 para obtener el costo real. Los flujos de trabajo sin bloques de IA solo incurren en el cargo base de ejecución.
</Callout>

## Desglose de modelos en los registros

Para flujos de trabajo que utilizan bloques de IA, puedes ver información detallada de costos en los registros:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-cost.png"
    alt="Desglose de modelos"
    width={600}
    height={400}
    className="my-6"
  />
</div>

El desglose del modelo muestra:
- **Uso de tokens**: Recuentos de tokens de entrada y salida para cada modelo
- **Desglose de costos**: Costos individuales por modelo y operación
- **Distribución de modelos**: Qué modelos se utilizaron y cuántas veces
- **Costo total**: Costo agregado para toda la ejecución del flujo de trabajo

## Opciones de precios

<Tabs items={['Hosted Models', 'Bring Your Own API Key']}>
  <Tab>
    **Modelos alojados** - Sim proporciona claves API con un multiplicador de precio de 2.5x:

    **OpenAI**
    | Modelo | Precio base (Entrada/Salida) | Precio alojado (Entrada/Salida) |
    |-------|---------------------------|----------------------------|
    | GPT-5.1 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 Mini | $0.25 / $2.00 | $0.63 / $5.00 |
    | GPT-5 Nano | $0.05 / $0.40 | $0.13 / $1.00 |
    | GPT-4o | $2.50 / $10.00 | $6.25 / $25.00 |
    | GPT-4.1 | $2.00 / $8.00 | $5.00 / $20.00 |
    | GPT-4.1 Mini | $0.40 / $1.60 | $1.00 / $4.00 |
    | GPT-4.1 Nano | $0.10 / $0.40 | $0.25 / $1.00 |
    | o1 | $15.00 / $60.00 | $37.50 / $150.00 |
    | o3 | $2.00 / $8.00 | $5.00 / $20.00 |
    | o4 Mini | $1.10 / $4.40 | $2.75 / $11.00 |

    **Anthropic**
    | Modelo | Precio base (Entrada/Salida) | Precio alojado (Entrada/Salida) |
    |-------|---------------------------|----------------------------|
    | Claude Opus 4.5 | $5.00 / $25.00 | $12.50 / $62.50 |
    | Claude Opus 4.1 | $15.00 / $75.00 | $37.50 / $187.50 |
    | Claude Sonnet 4.5 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Sonnet 4.0 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Haiku 4.5 | $1.00 / $5.00 | $2.50 / $12.50 |

    **Google**
    | Modelo | Precio base (Entrada/Salida) | Precio alojado (Entrada/Salida) |
    |-------|---------------------------|----------------------------|
    | Gemini 3 Pro Preview | $2.00 / $12.00 | $5.00 / $30.00 |
    | Gemini 2.5 Pro | $0.15 / $0.60 | $0.38 / $1.50 |
    | Gemini 2.5 Flash | $0.15 / $0.60 | $0.38 / $1.50 |

    *El multiplicador de 2.5x cubre los costos de infraestructura y gestión de API.*
  </Tab>

  <Tab>
    **Tus propias claves API** - Usa cualquier modelo con precio base:

    | Proveedor | Modelos de ejemplo | Entrada / Salida |
    |----------|----------------|----------------|
    | Deepseek | V3, R1 | $0.75 / $1.00 |
    | xAI | Grok 4 Latest, Grok 3 | $3.00 / $15.00 |
    | Groq | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Cerebras | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Ollama | Modelos locales | Gratis |
    | VLLM | Modelos locales | Gratis |

    *Paga directamente a los proveedores sin recargo*
  </Tab>
</Tabs>

<Callout type="warning">
  Los precios mostrados reflejan las tarifas a partir del 10 de septiembre de 2025. Consulta la documentación del proveedor para conocer los precios actuales.
</Callout>

## Estrategias de optimización de costos

- **Selección de modelos**: Elige modelos según la complejidad de la tarea. Las tareas simples pueden usar GPT-4.1-nano mientras que el razonamiento complejo podría necesitar o1 o Claude Opus.
- **Ingeniería de prompts**: Los prompts bien estructurados y concisos reducen el uso de tokens sin sacrificar la calidad.
- **Modelos locales**: Usa Ollama o VLLM para tareas no críticas para eliminar por completo los costos de API.
- **Almacenamiento en caché y reutilización**: Guarda resultados frecuentemente utilizados en variables o archivos para evitar llamadas repetidas al modelo de IA.
- **Procesamiento por lotes**: Procesa múltiples elementos en una sola solicitud de IA en lugar de hacer llamadas individuales.

## Monitoreo de uso

Monitorea tu uso y facturación en Configuración → Suscripción:

- **Uso actual**: Uso y costos en tiempo real para el período actual
- **Límites de uso**: Límites del plan con indicadores visuales de progreso
- **Detalles de facturación**: Cargos proyectados y compromisos mínimos
- **Gestión del plan**: Opciones de actualización e historial de facturación

### Seguimiento programático de uso

Puedes consultar tu uso actual y límites de forma programática utilizando la API:

**Endpoint:**

```text
GET /api/users/me/usage-limits
```

**Autenticación:**
- Incluye tu clave API en el encabezado `X-API-Key`

**Ejemplo de solicitud:**

```bash
curl -X GET -H "X-API-Key: YOUR_API_KEY" -H "Content-Type: application/json" https://sim.ai/api/users/me/usage-limits
```

**Ejemplo de respuesta:**

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

**Campos de límite de tasa:**
- `requestsPerMinute`: Límite de tasa sostenida (los tokens se recargan a esta velocidad)
- `maxBurst`: Máximo de tokens que puedes acumular (capacidad de ráfaga)
- `remaining`: Tokens disponibles actualmente (puede ser hasta `maxBurst`)

**Campos de respuesta:**
- `currentPeriodCost` refleja el uso en el período de facturación actual
- `limit` se deriva de límites individuales (Gratuito/Pro) o límites agrupados de la organización (Equipo/Empresa)
- `plan` es el plan activo de mayor prioridad asociado a tu usuario

## Límites del plan

Los diferentes planes de suscripción tienen diferentes límites de uso:

| Plan | Límite de uso mensual | Límites de tasa (por minuto) |
|------|-------------------|-------------------------|
| **Gratuito** | $10 | 5 sincrónico, 10 asincrónico |
| **Pro** | $100 | 10 sincrónico, 50 asincrónico |
| **Equipo** | $500 (agrupado) | 50 sincrónico, 100 asincrónico |
| **Empresa** | Personalizado | Personalizado |

## Modelo de facturación

Sim utiliza un modelo de facturación de **suscripción base + excedente**:

### Cómo funciona

**Plan Pro ($20/mes):**
- La suscripción mensual incluye $20 de uso
- Uso por debajo de $20 → Sin cargos adicionales
- Uso por encima de $20 → Pagas el excedente al final del mes
- Ejemplo: $35 de uso = $20 (suscripción) + $15 (excedente)

**Plan de Equipo ($40/usuario/mes):**
- Uso agrupado entre todos los miembros del equipo
- Excedente calculado del uso total del equipo
- El propietario de la organización recibe una sola factura

**Planes Empresariales:**
- Precio mensual fijo, sin excedentes
- Límites de uso personalizados según el acuerdo

### Facturación por umbral

Cuando el excedente no facturado alcanza los $50, Sim factura automáticamente el monto total no facturado.

**Ejemplo:**
- Día 10: $70 de excedente → Factura inmediata de $70
- Día 15: $35 adicionales de uso ($105 en total) → Ya facturado, sin acción
- Día 20: Otros $50 de uso ($155 en total, $85 no facturados) → Factura inmediata de $85

Esto distribuye los cargos por exceso a lo largo del mes en lugar de una gran factura al final del período.

## Mejores prácticas para la gestión de costos

1. **Monitorear regularmente**: Revisa tu panel de uso con frecuencia para evitar sorpresas
2. **Establecer presupuestos**: Utiliza los límites del plan como guías para tu gasto
3. **Optimizar flujos de trabajo**: Revisa las ejecuciones de alto costo y optimiza los prompts o la selección de modelos
4. **Usar modelos apropiados**: Ajusta la complejidad del modelo a los requisitos de la tarea
5. **Agrupar tareas similares**: Combina múltiples solicitudes cuando sea posible para reducir la sobrecarga

## Próximos pasos

- Revisa tu uso actual en [Configuración → Suscripción](https://sim.ai/settings/subscription)
- Aprende sobre [Registro](/execution/logging) para seguir los detalles de ejecución
- Explora la [API externa](/execution/api) para el monitoreo programático de costos
- Consulta las [técnicas de optimización de flujo de trabajo](/blocks) para reducir costos
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/execution/index.mdx

```text
---
title: Descripción general
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

El motor de ejecución de Sim da vida a tus flujos de trabajo procesando bloques en el orden correcto, gestionando el flujo de datos y manejando errores con elegancia, para que puedas entender exactamente cómo se ejecutan los flujos de trabajo en Sim.

<Callout type="info">
  Cada ejecución de flujo de trabajo sigue una ruta determinista basada en tus conexiones de bloques y lógica, asegurando resultados predecibles y confiables.
</Callout>

## Resumen de la documentación

<Cards>
  <Card title="Fundamentos de ejecución" href="/execution/basics">
    Aprende sobre el flujo de ejecución fundamental, tipos de bloques y cómo fluyen los datos a través de tu
    flujo de trabajo
  </Card>

  <Card title="Registro" href="/execution/logging">
    Monitorea las ejecuciones de flujos de trabajo con registro completo y visibilidad en tiempo real
  </Card>
  
  <Card title="Cálculo de costos" href="/execution/costs">
    Comprende cómo se calculan y optimizan los costos de ejecución de flujos de trabajo
  </Card>
  
  <Card title="API externa" href="/execution/api">
    Accede a registros de ejecución y configura webhooks programáticamente a través de API REST
  </Card>
</Cards>

## Conceptos clave

### Ejecución topológica
Los bloques se ejecutan en orden de dependencia, similar a cómo una hoja de cálculo recalcula celdas. El motor de ejecución determina automáticamente qué bloques pueden ejecutarse basándose en las dependencias completadas.

### Seguimiento de rutas
El motor rastrea activamente las rutas de ejecución a través de tu flujo de trabajo. Los bloques de enrutador y condición actualizan dinámicamente estas rutas, asegurando que solo se ejecuten los bloques relevantes.

### Procesamiento basado en capas
En lugar de ejecutar bloques uno por uno, el motor identifica capas de bloques que pueden ejecutarse en paralelo, optimizando el rendimiento para flujos de trabajo complejos.

### Contexto de ejecución
Cada flujo de trabajo mantiene un contexto enriquecido durante la ejecución que contiene:
- Salidas y estados de bloques
- Rutas de ejecución activas
- Seguimiento de iteraciones de bucle y paralelas
- Variables de entorno
- Decisiones de enrutamiento

## Instantáneas de despliegue

Todos los puntos de entrada públicos—API, Chat, Programación, Webhook y ejecuciones manuales—ejecutan la instantánea de despliegue activa del flujo de trabajo. Publica un nuevo despliegue cada vez que cambies el lienzo para que cada disparador utilice la versión actualizada.

<div className='flex justify-center my-6'>
  <Image
    src='/static/execution/deployment-versions.png'
    alt='Tabla de versiones de despliegue'
    width={500}
    height={280}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

El modal de Despliegue mantiene un historial completo de versiones—inspecciona cualquier instantánea, compárala con tu borrador, y promueve o revierte con un clic cuando necesites restaurar una versión anterior.

## Ejecución programática

Ejecuta flujos de trabajo desde tus aplicaciones usando nuestros SDK oficiales:

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

## Mejores prácticas

### Diseña para la fiabilidad
- Maneja los errores con elegancia mediante rutas de respaldo apropiadas
- Usa variables de entorno para datos sensibles
- Añade registros a los bloques de Función para depuración

### Optimiza el rendimiento
- Minimiza las llamadas a API externas cuando sea posible
- Usa ejecución paralela para operaciones independientes
- Almacena resultados en caché con bloques de Memoria cuando sea apropiado

### Monitorea las ejecuciones
- Revisa los registros regularmente para entender patrones de rendimiento
- Haz seguimiento de los costos por uso de modelos de IA
- Usa instantáneas de flujo de trabajo para depurar problemas

## ¿Qué sigue?

Comienza con [Fundamentos de ejecución](/execution/basics) para entender cómo funcionan los flujos de trabajo, luego explora [Registro](/execution/logging) para monitorear tus ejecuciones y [Cálculo de costos](/execution/costs) para optimizar tu gasto.
```

--------------------------------------------------------------------------------

---[FILE: logging.mdx]---
Location: sim-main/apps/docs/content/docs/es/execution/logging.mdx

```text
---
title: Registro
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim proporciona un registro completo para todas las ejecuciones de flujos de trabajo, dándote visibilidad total sobre cómo se ejecutan tus flujos de trabajo, qué datos fluyen a través de ellos y dónde podrían ocurrir problemas.

## Sistema de registro

Sim ofrece dos interfaces de registro complementarias para adaptarse a diferentes flujos de trabajo y casos de uso:

### Consola en tiempo real

Durante la ejecución manual o por chat del flujo de trabajo, los registros aparecen en tiempo real en el panel de Consola en el lado derecho del editor de flujo de trabajo:

<div className="flex justify-center">
  <Image
    src="/static/logs/console.png"
    alt="Panel de consola en tiempo real"
    width={400}
    height={300}
    className="my-6"
  />
</div>

La consola muestra:
- Progreso de ejecución de bloques con resaltado del bloque activo
- Resultados en tiempo real a medida que se completan los bloques
- Tiempo de ejecución para cada bloque
- Indicadores de estado de éxito/error

### Página de registros

Todas las ejecuciones de flujos de trabajo, ya sean activadas manualmente, a través de API, Chat, Programación o Webhook, se registran en la página dedicada de Registros:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs.png"
    alt="Página de registros"
    width={600}
    height={400}
    className="my-6"
  />
</div>

La página de Registros proporciona:
- Filtrado completo por rango de tiempo, estado, tipo de activación, carpeta y flujo de trabajo
- Funcionalidad de búsqueda en todos los registros
- Modo en vivo para actualizaciones en tiempo real
- Retención de registros de 7 días (ampliable para una retención más larga)

## Barra lateral de detalles de registro

Al hacer clic en cualquier entrada de registro se abre una vista detallada en la barra lateral:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-sidebar.png"
    alt="Detalles de la barra lateral de registros"
    width={600}
    height={400}
    className="my-6"
  />
</div>

### Entrada/Salida de bloque

Visualiza el flujo de datos completo para cada bloque con pestañas para cambiar entre:

<Tabs items={['Output', 'Input']}>
  <Tab>
    **Pestaña de salida** muestra el resultado de la ejecución del bloque:
    - Datos estructurados con formato JSON
    - Renderizado de Markdown para contenido generado por IA
    - Botón de copiar para fácil extracción de datos
  </Tab>
  
  <Tab>
    **Pestaña de entrada** muestra lo que se pasó al bloque:
    - Valores de variables resueltos
    - Salidas referenciadas de otros bloques
    - Variables de entorno utilizadas
    - Las claves API se redactan automáticamente por seguridad
  </Tab>
</Tabs>

### Cronología de ejecución

Para los registros a nivel de flujo de trabajo, visualiza métricas detalladas de ejecución:
- Marcas de tiempo de inicio y fin
- Duración total del flujo de trabajo
- Tiempos de ejecución de bloques individuales
- Identificación de cuellos de botella de rendimiento

## Instantáneas del flujo de trabajo

Para cualquier ejecución registrada, haz clic en "Ver instantánea" para ver el estado exacto del flujo de trabajo en el momento de la ejecución:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-frozen-canvas.png"
    alt="Instantánea del flujo de trabajo"
    width={600}
    height={400}
    className="my-6"
  />
</div>

La instantánea proporciona:
- Lienzo congelado que muestra la estructura del flujo de trabajo
- Estados de los bloques y conexiones tal como estaban durante la ejecución
- Haz clic en cualquier bloque para ver sus entradas y salidas
- Útil para depurar flujos de trabajo que han sido modificados desde entonces

<Callout type="info">
  Las instantáneas de flujo de trabajo solo están disponibles para ejecuciones posteriores a la introducción del sistema mejorado de registro. Los registros migrados más antiguos muestran un mensaje de "Estado registrado no encontrado".
</Callout>

## Retención de registros

- **Plan gratuito**: 7 días de retención de registros
- **Plan pro**: 30 días de retención de registros
- **Plan de equipo**: 90 días de retención de registros
- **Plan empresarial**: Períodos de retención personalizados disponibles

## Mejores prácticas

### Para desarrollo
- Utiliza la consola en tiempo real para obtener retroalimentación inmediata durante las pruebas
- Verifica las entradas y salidas de los bloques para comprobar el flujo de datos
- Usa instantáneas del flujo de trabajo para comparar versiones funcionales vs. defectuosas

### Para producción
- Supervisa regularmente la página de registros para detectar errores o problemas de rendimiento
- Configura filtros para centrarte en flujos de trabajo específicos o períodos de tiempo
- Utiliza el modo en vivo durante implementaciones críticas para observar las ejecuciones en tiempo real

### Para depuración
- Siempre verifica la cronología de ejecución para identificar bloques lentos
- Compara las entradas entre ejecuciones exitosas y fallidas
- Utiliza instantáneas del flujo de trabajo para ver el estado exacto cuando ocurrieron los problemas

## Próximos pasos

- Aprende sobre [Cálculo de costos](/execution/costs) para entender los precios de los flujos de trabajo
- Explora la [API externa](/execution/api) para acceso programático a los registros
- Configura [Notificaciones](/execution/api#notifications) para alertas en tiempo real vía webhook, correo electrónico o Slack
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/getting-started/index.mdx

```text
---
title: Primeros pasos
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

Construye tu primer flujo de trabajo de IA en 10 minutos. En este tutorial, crearás un agente de investigación de personas que utiliza herramientas de búsqueda avanzadas potenciadas por LLM para extraer y estructurar información sobre individuos.

<Callout type="info">
  Este tutorial cubre los conceptos esenciales para construir flujos de trabajo en Sim. Tiempo estimado de finalización: 10 minutos.
</Callout>

## Lo que vas a construir

Un agente de investigación de personas que:
1. Acepta la entrada del usuario a través de una interfaz de chat
2. Busca en la web utilizando herramientas potenciadas por IA (Exa y Linkup)
3. Extrae y estructura información sobre individuos
4. Devuelve datos JSON formateados con ubicación, profesión y educación

<Image
  src="/static/getting-started/started-1.png"
  alt="Ejemplo de primeros pasos"
  width={800}
  height={500}
/>

## Tutorial paso a paso

<Steps>
  <Step title="Crear un flujo de trabajo y añadir un agente de IA">
    Haz clic en **Nuevo flujo de trabajo** en el panel de control y nómbralo "Primeros pasos".
    
    Cada nuevo flujo de trabajo incluye un **bloque de Inicio** por defecto—este es el punto de entrada que recibe la entrada del usuario. Como activaremos este flujo de trabajo a través del chat, no se necesita configuración para el bloque de Inicio.
    
    Arrastra un **Bloque de Agente** al lienzo desde el panel izquierdo y configúralo:
    - **Modelo**: Selecciona "OpenAI GPT-4o"
    - **Prompt del sistema**: "Eres un agente de investigación de personas. Cuando se te proporcione el nombre de una persona, utiliza tus herramientas de búsqueda disponibles para encontrar información completa sobre ella, incluyendo su ubicación, profesión, formación académica y otros detalles relevantes."
    - **Prompt del usuario**: Arrastra la conexión desde la salida del bloque de Inicio a este campo para conectar `<start.input>` al prompt del usuario
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-2.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Añadir herramientas de búsqueda al agente">
    Mejora tu agente con capacidades de búsqueda web. Haz clic en el bloque de Agente para seleccionarlo.
    
    En la sección de **Herramientas**:
    - Haz clic en **Añadir herramienta**
    - Selecciona **Exa** y **Linkup** de las herramientas disponibles
    - Proporciona tus claves API para ambas herramientas para habilitar la búsqueda web y el acceso a datos
    
    <div className="mx-auto w-3/5 overflow-hidden rounded-lg">
      <Video src="getting-started/started-3.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Probar tu flujo de trabajo">
    Prueba tu flujo de trabajo usando el **panel de Chat** en el lado derecho de la pantalla.
    
    En el panel de chat:
    - Haz clic en el menú desplegable y selecciona `agent1.content` para ver la salida del agente
    - Introduce un mensaje de prueba: "John es un ingeniero de software de San Francisco que estudió Ciencias de la Computación en la Universidad de Stanford."
    - Haz clic en **Enviar** para ejecutar el flujo de trabajo
    
    El agente analizará a la persona y devolverá información estructurada.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-4.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Configurar la salida estructurada">
    Configura tu agente para que devuelva datos JSON estructurados. Haz clic en el bloque de Agente para seleccionarlo.
    
    En la sección **Formato de respuesta**:
    - Haz clic en el **icono de varita mágica** (✨) junto al campo de esquema
    - Introduce el prompt: "crear un esquema llamado persona, que contenga ubicación, profesión y educación"
    - La IA generará automáticamente el esquema JSON
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-5.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Probar con salida estructurada">
    Vuelve al **panel de Chat** para probar el formato de respuesta estructurada.
    
    Con el formato de respuesta configurado, ahora hay nuevas opciones de salida disponibles:
    - Haz clic en el menú desplegable y selecciona la opción de salida estructurada (el esquema que acabas de crear)
    - Introduce un mensaje de prueba: "Sarah es una gerente de marketing de Nueva York que tiene un MBA de Harvard Business School."
    - Haz clic en **Enviar** para ejecutar el flujo de trabajo
    
    El agente ahora devolverá una salida JSON estructurada con la información de la persona organizada en campos de ubicación, profesión y educación.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-6.mp4" width={700} height={450} />
    </div>
  </Step>
</Steps>

## Lo que has construido

Has creado con éxito un flujo de trabajo de IA que:
- ✅ Acepta la entrada del usuario a través de una interfaz de chat
- ✅ Procesa texto no estructurado utilizando IA
- ✅ Integra herramientas de búsqueda externas (Exa y Linkup)
- ✅ Devuelve datos JSON estructurados con esquemas generados por IA
- ✅ Demuestra pruebas e iteración en tiempo real
- ✅ Muestra el poder del desarrollo visual sin código

## Conceptos clave que has aprendido

### Tipos de bloques utilizados

<Files>
  <File
    name="Bloque de inicio"
    icon={<ConnectIcon className="h-4 w-4" />}
    annotation="Punto de entrada para la entrada del usuario (incluido automáticamente)"
  />
  <File
    name="Bloque de agente"
    icon={<AgentIcon className="h-4 w-4" />}
    annotation="Modelo de IA para procesamiento y análisis de texto"
  />
</Files>

### Conceptos fundamentales del flujo de trabajo

**Flujo de datos**  
Conecta bloques arrastrando conexiones para pasar datos entre los pasos del flujo de trabajo

**Interfaz de chat**  
Prueba flujos de trabajo en tiempo real con el panel de chat y selecciona diferentes opciones de salida

**Integración de herramientas**  
Amplía las capacidades del agente integrando servicios externos como Exa y Linkup

**Referencias de variables**  
Accede a las salidas de los bloques utilizando la sintaxis `<blockName.output>`

**Salida estructurada**  
Define esquemas JSON para garantizar respuestas consistentes y formateadas desde la IA

**Esquemas generados por IA**  
Utiliza la varita mágica (✨) para generar esquemas a partir de indicaciones en lenguaje natural

**Desarrollo iterativo**  
Construye, prueba y refina flujos de trabajo rápidamente con retroalimentación inmediata

## Próximos pasos

<Cards>
  <Card title="Explorar bloques de flujo de trabajo" href="/blocks">
    Descubre bloques de flujo de trabajo de API, Función, Condición y otros
  </Card>
  <Card title="Explorar integraciones" href="/tools">
    Conecta más de 80 servicios incluyendo Gmail, Slack, Notion y más
  </Card>
  <Card title="Añadir lógica personalizada" href="/blocks/function">
    Escribe funciones personalizadas para procesamiento avanzado de datos
  </Card>
  <Card title="Implementar tu flujo de trabajo" href="/execution">
    Haz que tu flujo de trabajo sea accesible a través de API REST o webhooks
  </Card>
</Cards>

## Recursos

**¿Necesitas explicaciones detalladas?** Visita la [documentación de Bloques](/blocks) para guías completas sobre cada componente.

**¿Buscas integraciones?** Explora la [documentación de Herramientas](/tools) para ver las más de 80 integraciones disponibles.

**¿Listo para salir a producción?** Aprende sobre [Ejecución e Implementación](/execution) para hacer que tus flujos de trabajo estén listos para producción.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/introduction/index.mdx

```text
---
title: Introducción
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Sim es un constructor de flujos de trabajo visuales de código abierto para crear e implementar flujos de trabajo de agentes de IA. Diseña sistemas de automatización inteligentes utilizando una interfaz sin código—conecta modelos de IA, bases de datos, APIs y herramientas empresariales a través de un lienzo intuitivo de arrastrar y soltar. Ya sea que estés creando chatbots, automatizando procesos empresariales u orquestando complejos flujos de datos, Sim proporciona las herramientas para dar vida a tus flujos de trabajo de IA.

<div className="flex justify-center">
  <Image
    src="/static/introduction.png"
    alt="Lienzo visual de flujos de trabajo de Sim"
    width={700}
    height={450}
    className="my-6"
  />
</div>

## Lo Que Puedes Crear

**Asistentes de IA y chatbots**  
Construye agentes conversacionales inteligentes que se integran con tus herramientas y datos. Habilita capacidades como búsqueda web, gestión de calendario, automatización de correo electrónico e interacción fluida con sistemas empresariales.

**Automatización de procesos empresariales**  
Elimina tareas manuales en toda tu organización. Automatiza la entrada de datos, genera informes, responde a consultas de clientes y optimiza los flujos de trabajo de creación de contenido.

**Procesamiento y análisis de datos**  
Transforma datos brutos en información procesable. Extrae información de documentos, realiza análisis de conjuntos de datos, genera informes automatizados y sincroniza datos entre plataformas.

**Flujos de trabajo de integración de API**  
Orquesta interacciones complejas entre múltiples servicios. Crea puntos de conexión API unificados, implementa lógica empresarial sofisticada y construye sistemas de automatización basados en eventos.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/chat-workflow.mp4" width={700} height={450} />
</div>

## Cómo funciona

**Editor visual de flujos de trabajo**  
Diseña flujos de trabajo utilizando un lienzo intuitivo de arrastrar y soltar. Conecta modelos de IA, bases de datos, APIs y servicios de terceros a través de una interfaz visual sin código que hace que la lógica de automatización compleja sea fácil de entender y mantener.

**Sistema de bloques modulares**  
Construye con componentes especializados: bloques de procesamiento (agentes de IA, llamadas a API, funciones personalizadas), bloques lógicos (ramificación condicional, bucles, enrutadores) y bloques de salida (respuestas, evaluadores). Cada bloque maneja una tarea específica en tu flujo de trabajo.

**Activadores de ejecución flexibles**  
Inicia flujos de trabajo a través de múltiples canales, incluyendo interfaces de chat, APIs REST, webhooks, trabajos cron programados o eventos externos de plataformas como Slack y GitHub.

**Colaboración en tiempo real**  
Permite que tu equipo construya juntos. Múltiples usuarios pueden editar flujos de trabajo simultáneamente con actualizaciones en vivo y controles de permisos granulares.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/build-workflow.mp4" width={700} height={450} />
</div>

## Integraciones

Sim proporciona integraciones nativas con más de 80 servicios en múltiples categorías:

- **Modelos de IA**: OpenAI, Anthropic, Google Gemini, Groq, Cerebras, modelos locales a través de Ollama o VLLM
- **Comunicación**: Gmail, Slack, Microsoft Teams, Telegram, WhatsApp  
- **Productividad**: Notion, Google Workspace, Airtable, Monday.com
- **Desarrollo**: GitHub, Jira, Linear, pruebas automatizadas de navegador
- **Búsqueda y datos**: Google Search, Perplexity, Firecrawl, Exa AI
- **Bases de datos**: PostgreSQL, MySQL, Supabase, Pinecone, Qdrant

Para integraciones personalizadas, aprovecha nuestro [soporte MCP (Protocolo de Contexto de Modelo)](/mcp) para conectar cualquier servicio o herramienta externa.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/integrations-sidebar.mp4" width={700} height={450} />
</div>

## Copilot

**Haz preguntas y recibe orientación**  
Copiloto responde preguntas sobre Sim, explica tus flujos de trabajo y proporciona sugerencias para mejorarlos. Usa el símbolo `@` para hacer referencia a flujos de trabajo, bloques, documentación, conocimiento y registros para obtener asistencia contextual.

**Construye y edita flujos de trabajo**  
Cambia al modo Agente para permitir que Copiloto proponga y aplique cambios directamente en tu lienzo. Añade bloques, configura ajustes, conecta variables y reestructura flujos de trabajo con comandos en lenguaje natural.

**Niveles de razonamiento adaptativo**  
Elige entre los modos Rápido, Automático, Avanzado o Behemoth según la complejidad de la tarea. Comienza con Rápido para preguntas simples, y escala hasta Behemoth para cambios arquitectónicos complejos y depuración profunda.

Aprende más sobre las [capacidades de Copiloto](/copilot) y cómo maximizar la productividad con asistencia de IA.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/copilot-workflow.mp4" width={700} height={450} />
</div>

## Opciones de implementación

**Alojado en la nube**  
Comienza inmediatamente en [sim.ai](https://sim.ai) con infraestructura totalmente gestionada, escalado automático y observabilidad integrada. Concéntrate en construir flujos de trabajo mientras nosotros nos encargamos de las operaciones.

**Autoalojado**  
Implementa en tu propia infraestructura usando Docker Compose o Kubernetes. Mantén control completo sobre tus datos con soporte para modelos de IA locales a través de la integración con Ollama.

## Próximos pasos

¿Listo para construir tu primer flujo de trabajo con IA?

<Cards>
  <Card title="Primeros pasos" href="/getting-started">
    Crea tu primer flujo de trabajo en 10 minutos
  </Card>
  <Card title="Bloques de flujo de trabajo" href="/blocks">
    Aprende sobre los componentes básicos
  </Card>
  <Card title="Herramientas e integraciones" href="/tools">
    Explora más de 80 integraciones incorporadas
  </Card>
  <Card title="Permisos de equipo" href="/permissions/roles-and-permissions">
    Configura roles y permisos del espacio de trabajo
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

````
