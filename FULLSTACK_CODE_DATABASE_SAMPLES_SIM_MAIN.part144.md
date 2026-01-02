---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 144
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 144 of 933)

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
Location: sim-main/apps/docs/content/docs/es/tools/zoom.mdx

```text
---
title: Zoom
description: Crea y gestiona reuniones y grabaciones de Zoom
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zoom"
  color="#2D8CFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zoom](https://zoom.us/) es una plataforma líder de comunicaciones basada en la nube para videoconferencias, webinars y colaboración en línea. Permite a usuarios y organizaciones programar, organizar y gestionar reuniones fácilmente, proporcionando herramientas para compartir pantalla, chat, grabaciones y más.

Con Zoom, puedes:

- **Programar y gestionar reuniones**: Crear reuniones instantáneas o programadas, incluyendo eventos recurrentes
- **Configurar opciones de reunión**: Establecer contraseñas de reunión, habilitar salas de espera y controlar el video/audio de los participantes
- **Enviar invitaciones y compartir detalles**: Obtener invitaciones e información de reuniones para compartir fácilmente
- **Obtener y actualizar datos de reuniones**: Acceder a detalles de reuniones, modificar reuniones existentes y gestionar configuraciones de forma programática

En Sim, la integración con Zoom permite a tus agentes automatizar la programación y gestión de reuniones. Usa acciones de herramientas para:

- Crear programáticamente nuevas reuniones con configuraciones personalizadas
- Listar todas las reuniones para un usuario específico (o para ti mismo)
- Obtener detalles o invitaciones para cualquier reunión
- Actualizar o eliminar reuniones existentes directamente desde tus automatizaciones

Para conectarte a Zoom, arrastra el bloque de Zoom y haz clic en `Connect` para autenticarte con tu cuenta de Zoom. Una vez conectado, puedes usar las herramientas de Zoom para crear, listar, actualizar y eliminar reuniones de Zoom. En cualquier momento, puedes desconectar tu cuenta de Zoom haciendo clic en `Disconnect` en Configuración > Integraciones, y el acceso a tu cuenta de Zoom será revocado inmediatamente.

Estas capacidades te permiten agilizar la colaboración remota, automatizar sesiones de video recurrentes y gestionar el entorno de Zoom de tu organización, todo como parte de tus flujos de trabajo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Zoom en los flujos de trabajo. Crea, lista, actualiza y elimina reuniones de Zoom. Obtén detalles de reuniones, invitaciones, grabaciones y participantes. Gestiona grabaciones en la nube de forma programática.

## Herramientas

### `zoom_create_meeting`

Crear una nueva reunión de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Sí | El ID de usuario o dirección de correo electrónico. Use "me" para el usuario autenticado. |
| `topic` | string | Sí | Tema de la reunión |
| `type` | number | No | Tipo de reunión: 1=instantánea, 2=programada, 3=recurrente sin hora fija, 8=recurrente con hora fija |
| `startTime` | string | No | Hora de inicio de la reunión en formato ISO 8601 \(ej., 2025-06-03T10:00:00Z\) |
| `duration` | number | No | Duración de la reunión en minutos |
| `timezone` | string | No | Zona horaria para la reunión \(ej., America/Los_Angeles\) |
| `password` | string | No | Contraseña de la reunión |
| `agenda` | string | No | Agenda de la reunión |
| `hostVideo` | boolean | No | Iniciar con video del anfitrión activado |
| `participantVideo` | boolean | No | Iniciar con video de participantes activado |
| `joinBeforeHost` | boolean | No | Permitir que los participantes se unan antes que el anfitrión |
| `muteUponEntry` | boolean | No | Silenciar participantes al entrar |
| `waitingRoom` | boolean | No | Habilitar sala de espera |
| `autoRecording` | string | No | Configuración de grabación automática: local, cloud o none |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `meeting` | object | La reunión creada con todas sus propiedades |

### `zoom_list_meetings`

Listar todas las reuniones de un usuario de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Sí | El ID de usuario o dirección de correo electrónico. Usa "me" para el usuario autenticado. |
| `type` | string | No | Filtro de tipo de reunión: scheduled, live, upcoming, upcoming_meetings, o previous_meetings |
| `pageSize` | number | No | Número de registros por página \(máximo 300\) |
| `nextPageToken` | string | No | Token para paginación para obtener la siguiente página de resultados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `meetings` | array | Lista de reuniones |
| `pageInfo` | object | Información de paginación |

### `zoom_get_meeting`

Obtener detalles de una reunión específica de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión |
| `occurrenceId` | string | No | ID de ocurrencia para reuniones recurrentes |
| `showPreviousOccurrences` | boolean | No | Mostrar ocurrencias anteriores para reuniones recurrentes |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `meeting` | object | Los detalles de la reunión |

Obtener detalles de una reunión específica de Zoom

Actualizar una reunión existente de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión a actualizar |
| `topic` | string | No | Tema de la reunión |
| `type` | number | No | Tipo de reunión: 1=instantánea, 2=programada, 3=recurrente sin hora fija, 8=recurrente con hora fija |
| `startTime` | string | No | Hora de inicio de la reunión en formato ISO 8601 \(p. ej., 2025-06-03T10:00:00Z\) |
| `duration` | number | No | Duración de la reunión en minutos |
| `timezone` | string | No | Zona horaria para la reunión \(p. ej., America/Los_Angeles\) |
| `password` | string | No | Contraseña de la reunión |
| `agenda` | string | No | Agenda de la reunión |
| `hostVideo` | boolean | No | Iniciar con video del anfitrión activado |
| `participantVideo` | boolean | No | Iniciar con video de participantes activado |
| `joinBeforeHost` | boolean | No | Permitir que los participantes se unan antes que el anfitrión |
| `muteUponEntry` | boolean | No | Silenciar participantes al entrar |
| `waitingRoom` | boolean | No | Habilitar sala de espera |
| `autoRecording` | string | No | Configuración de grabación automática: local, cloud o none |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la reunión se actualizó correctamente |

Eliminar una reunión de Zoom

Eliminar o cancelar una reunión de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión a eliminar |
| `occurrenceId` | string | No | ID de ocurrencia para eliminar una ocurrencia específica de una reunión recurrente |
| `scheduleForReminder` | boolean | No | Enviar correo electrónico de recordatorio de cancelación a los registrados |
| `cancelMeetingReminder` | boolean | No | Enviar correo electrónico de cancelación a los registrados y anfitriones alternativos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la reunión se eliminó correctamente |

### `zoom_get_meeting_invitation`

Obtener el texto de invitación para una reunión de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `invitation` | string | El texto de invitación de la reunión |

### `zoom_list_recordings`

Listar todas las grabaciones en la nube para un usuario de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Sí | El ID de usuario o dirección de correo electrónico. Usa "me" para el usuario autenticado. |
| `from` | string | No | Fecha de inicio en formato aaaa-mm-dd (dentro de los últimos 6 meses) |
| `to` | string | No | Fecha de fin en formato aaaa-mm-dd |
| `pageSize` | number | No | Número de registros por página (máx. 300) |
| `nextPageToken` | string | No | Token para paginación para obtener la siguiente página de resultados |
| `trash` | boolean | No | Establecer como true para listar grabaciones de la papelera |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `recordings` | array | Lista de grabaciones |
| `pageInfo` | object | Información de paginación |

Obtener todas las grabaciones para una reunión específica de Zoom

Obtener todas las grabaciones para una reunión específica de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión o UUID de la reunión |
| `includeFolderItems` | boolean | No | Incluir elementos dentro de una carpeta |
| `ttl` | number | No | Tiempo de vida para URLs de descarga en segundos \(máx. 604800\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `recording` | object | La grabación de la reunión con todos los archivos |

Eliminar grabaciones en la nube para una reunión de Zoom

Eliminar grabaciones en la nube para una reunión de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión o UUID de la reunión |
| `recordingId` | string | No | ID específico del archivo de grabación a eliminar. Si no se proporciona, elimina todas las grabaciones. |
| `action` | string | No | Acción de eliminación: "trash" \(mover a la papelera\) o "delete" \(eliminar permanentemente\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la grabación se eliminó correctamente |

Listar participantes de una reunión pasada de Zoom

Listar participantes de una reunión pasada de Zoom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Sí | El ID de la reunión pasada o UUID |
| `pageSize` | number | No | Número de registros por página \(máx. 300\) |
| `nextPageToken` | string | No | Token para paginación para obtener la siguiente página de resultados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `participants` | array | Lista de participantes de la reunión |
| `pageInfo` | object | Información de paginación |

## Notas

- Categoría: `tools`
- Tipo: `zoom`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/triggers/index.mdx

```text
---
title: Descripción general
description: Los disparadores son las formas principales de iniciar flujos de trabajo de Sim
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

<div className="flex justify-center">
  <Image
    src="/static/blocks/triggers.png"
    alt="Resumen de disparadores"
    width={500}
    height={350}
    className="my-6"
  />
</div>

## Disparadores principales

Utiliza el bloque Start para todo lo que se origina desde el editor, despliegue a API o experiencias de despliegue a chat. Otros disparadores siguen disponibles para flujos de trabajo basados en eventos:

<Cards>
  <Card title="Start" href="/triggers/start">
    Punto de entrada unificado que admite ejecuciones del editor, despliegues de API y despliegues de chat
  </Card>
  <Card title="Webhook" href="/triggers/webhook">
    Recibe cargas útiles de webhooks externos
  </Card>
  <Card title="Schedule" href="/triggers/schedule">
    Ejecución basada en cron o intervalos
  </Card>
  <Card title="RSS Feed" href="/triggers/rss">
    Monitorea feeds RSS y Atom para nuevo contenido
  </Card>
</Cards>

## Comparación rápida

| Disparador | Condición de inicio |
|---------|-----------------|
| **Start** | Ejecuciones del editor, solicitudes de despliegue a API o mensajes de chat |
| **Schedule** | Temporizador gestionado en el bloque de programación |
| **Webhook** | Al recibir una solicitud HTTP entrante |
| **RSS Feed** | Nuevo elemento publicado en el feed |

> El bloque Start siempre expone los campos `input`, `conversationId` y `files`. Añade campos personalizados al formato de entrada para datos estructurados adicionales.

## Uso de disparadores

1. Coloca el bloque Start en la ranura de inicio (o un disparador alternativo como Webhook/Schedule).
2. Configura cualquier esquema o autenticación requerida.
3. Conecta el bloque al resto del flujo de trabajo.

> Los despliegues alimentan cada disparador. Actualiza el flujo de trabajo, vuelve a desplegarlo, y todos los puntos de entrada de los disparadores recogen la nueva instantánea. Aprende más en [Ejecución → Instantáneas de despliegue](/execution).

## Prioridad de ejecución manual

Cuando haces clic en **Ejecutar** en el editor, Sim selecciona automáticamente qué disparador ejecutar según el siguiente orden de prioridad:

1. **Bloque Start** (prioridad más alta)
2. **Disparadores de programación**
3. **Disparadores externos** (webhooks, integraciones como Slack, Gmail, Airtable, etc.)

Si tu flujo de trabajo tiene múltiples disparadores, se ejecutará el disparador de mayor prioridad. Por ejemplo, si tienes tanto un bloque Start como un disparador Webhook, al hacer clic en Ejecutar se ejecutará el bloque Start.

**Disparadores externos con cargas útiles simuladas**: Cuando los disparadores externos (webhooks e integraciones) se ejecutan manualmente, Sim genera automáticamente cargas útiles simuladas basadas en la estructura de datos esperada del disparador. Esto asegura que los bloques posteriores puedan resolver las variables correctamente durante las pruebas.
```

--------------------------------------------------------------------------------

---[FILE: rss.mdx]---
Location: sim-main/apps/docs/content/docs/es/triggers/rss.mdx

```text
---
title: Feed RSS
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

El bloque de Feed RSS monitorea feeds RSS y Atom – cuando se publican nuevos elementos, tu flujo de trabajo se activa automáticamente.

<div className="flex justify-center">
  <Image
    src="/static/blocks/rss.png"
    alt="Bloque de Feed RSS"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuración

1. **Añadir bloque de Feed RSS** - Arrastra el bloque de Feed RSS para iniciar tu flujo de trabajo
2. **Introducir URL del feed** - Pega la URL de cualquier feed RSS o Atom
3. **Implementar** - Implementa tu flujo de trabajo para activar el sondeo

Una vez implementado, el feed se comprueba cada minuto en busca de nuevos elementos.

## Campos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | string | Título del elemento |
| `link` | string | Enlace del elemento |
| `pubDate` | string | Fecha de publicación |
| `item` | object | Elemento en bruto con todos los campos |
| `feed` | object | Metadatos en bruto del feed |

Accede a los campos mapeados directamente (`<rss.title>`) o utiliza los objetos en bruto para cualquier campo (`<rss.item.author>`, `<rss.feed.language>`).

## Casos de uso

- **Monitoreo de contenido** - Sigue blogs, sitios de noticias o actualizaciones de competidores
- **Automatización de podcasts** - Activa flujos de trabajo cuando se publican nuevos episodios
- **Seguimiento de lanzamientos** - Monitorea lanzamientos de GitHub, registros de cambios o actualizaciones de productos
- **Agregación social** - Recopila contenido de plataformas que exponen feeds RSS

<Callout>
Los disparadores RSS solo se activan para elementos publicados después de guardar el disparador. Los elementos existentes en el feed no se procesan.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/es/triggers/schedule.mdx

```text
---
title: Programación
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

El bloque de Programación activa automáticamente flujos de trabajo de forma recurrente en intervalos o momentos específicos.

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule.png"
    alt="Bloque de programación"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Opciones de programación

Configura cuándo se ejecuta tu flujo de trabajo utilizando las opciones desplegables:

<Tabs items={['Intervalos simples', 'Expresiones cron']}>
  <Tab>
    <ul className="list-disc space-y-1 pl-6">
      <li><strong>Cada pocos minutos</strong>: intervalos de 5, 15, 30 minutos</li>
      <li><strong>Por hora</strong>: Cada hora o cada pocas horas</li>
      <li><strong>Diariamente</strong>: Una o varias veces al día</li>
      <li><strong>Semanalmente</strong>: Días específicos de la semana</li>
      <li><strong>Mensualmente</strong>: Días específicos del mes</li>
    </ul>
  </Tab>
  <Tab>
    <p>Usa expresiones cron para programación avanzada:</p>
    <div className="text-sm space-y-1">
      <div><code>0 9 * * 1-5</code> - Cada día laborable a las 9 AM</div>
      <div><code>*/15 * * * *</code> - Cada 15 minutos</div>
      <div><code>0 0 1 * *</code> - Primer día de cada mes</div>
    </div>
  </Tab>
</Tabs>

## Configuración de programaciones

Cuando un flujo de trabajo está programado:
- La programación se vuelve **activa** y muestra el próximo tiempo de ejecución
- Haz clic en el botón **"Programado"** para desactivar la programación
- Las programaciones se desactivan automáticamente después de **3 fallos consecutivos**

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-2.png"
    alt="Bloque de programación activo"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Programación desactivada"
    width={500}
    height={350}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Programación desactivada"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Las programaciones desactivadas muestran cuándo estuvieron activas por última vez. Haz clic en la insignia **"Desactivado"** para reactivar la programación.

<Callout>
Los bloques de programación no pueden recibir conexiones entrantes y funcionan exclusivamente como disparadores de flujos de trabajo.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: start.mdx]---
Location: sim-main/apps/docs/content/docs/es/triggers/start.mdx

```text
---
title: Inicio
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Inicio es el disparador predeterminado para los flujos de trabajo creados en Sim. Recopila entradas estructuradas y se distribuye al resto de tu gráfico para pruebas de editor, implementaciones de API y experiencias de chat.

<div className="flex justify-center">
  <Image
    src="/static/start.png"
    alt="Bloque de inicio con campos de formato de entrada"
    width={360}
    height={380}
    className="my-6"
  />
</div>

<Callout type="info">
El bloque Inicio se sitúa en la posición inicial cuando creas un flujo de trabajo. Mantenlo allí cuando quieras que el mismo punto de entrada sirva para ejecuciones del editor, solicitudes de implementación de API y sesiones de chat. Cámbialo por disparadores de Webhook o Programación cuando solo necesites ejecución basada en eventos.
</Callout>

## Campos expuestos por Inicio

El bloque Inicio emite diferentes datos dependiendo de la superficie de ejecución:

- **Campos de formato de entrada** — Cada campo que añadas estará disponible como <code>&lt;start.fieldName&gt;</code>. Por ejemplo, un campo `customerId` aparecerá como <code>&lt;start.customerId&gt;</code> en bloques y plantillas posteriores.
- **Campos exclusivos de chat** — Cuando el flujo de trabajo se ejecuta desde el panel lateral de chat o una experiencia de chat implementada, Sim también proporciona <code>&lt;start.input&gt;</code> (último mensaje del usuario), <code>&lt;start.conversationId&gt;</code> (id de sesión activa), y <code>&lt;start.files&gt;</code> (archivos adjuntos del chat).

Mantén los campos de formato de entrada limitados a los nombres que esperas referenciar más tarde—esos valores son los únicos campos estructurados compartidos entre ejecuciones de editor, API y chat.

## Configurar el formato de entrada

Usa el sub-bloque de formato de entrada para definir el esquema que se aplica en todos los modos de ejecución:

1. Añade un campo para cada valor que quieras recopilar.
2. Elige un tipo (`string`, `number`, `boolean`, `object`, `array`, o `files`). Los campos de archivo aceptan cargas desde chat y llamadas a la API.
3. Proporciona valores predeterminados cuando quieras que el modal de ejecución manual complete automáticamente datos de prueba. Estos valores predeterminados se ignoran para ejecuciones implementadas.
4. Reordena los campos para controlar cómo aparecen en el formulario del editor.

Haz referencia a valores estructurados posteriores con expresiones como <code>&lt;start.customerId&gt;</code> dependiendo del bloque que conectes.

## Cómo se comporta por punto de entrada

<Tabs items={['Ejecución en el editor', 'Despliegue a API', 'Despliegue a chat']}>
  <Tab>
    <div className="space-y-3">
      <p>
        Cuando haces clic en <strong>Ejecutar</strong> en el editor, el bloque Inicio muestra el Formato de Entrada como un formulario. Los valores predeterminados facilitan volver a probar sin tener que volver a escribir datos. Al enviar el formulario se activa el flujo de trabajo inmediatamente y los valores quedan disponibles en <code>&lt;start.fieldName&gt;</code> (por ejemplo <code>&lt;start.sampleField&gt;</code>).
      </p>
      <p>
        Los campos de archivo en el formulario se cargan directamente en el
        correspondiente <code>&lt;start.fieldName&gt;</code>; usa esos valores para
        alimentar herramientas posteriores o pasos de almacenamiento.
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        Desplegar a API convierte el Formato de Entrada en un contrato JSON para los clientes. Cada campo se convierte en parte del cuerpo de la solicitud, y Sim fuerza los tipos primitivos durante la ingesta. Los campos de archivo esperan objetos que hagan referencia a archivos cargados; utiliza el punto de conexión de carga de archivos de ejecución antes de invocar el flujo de trabajo.
      </p>
      <p>
        Los que llaman a la API pueden incluir propiedades opcionales adicionales.
        Estas se conservan dentro de las salidas <code>&lt;start.fieldName&gt;</code>
        para que puedas experimentar sin tener que redesplegar inmediatamente.
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        En los despliegues de chat, el bloque Inicio se vincula a la conversación activa. El último mensaje rellena <code>&lt;start.input&gt;</code>, el identificador de sesión está disponible en <code>&lt;start.conversationId&gt;</code>, y los archivos adjuntos del usuario aparecen en <code>&lt;start.files&gt;</code>, junto con cualquier campo del Formato de Entrada definido como <code>&lt;start.fieldName&gt;</code>.
      </p>
      <p>
        Si inicias el chat con contexto estructurado adicional (por ejemplo, desde una
        incrustación), este se fusiona con las salidas{' '}
        <code>&lt;start.fieldName&gt;</code> correspondientes, manteniendo los bloques
        posteriores consistentes con la API y las ejecuciones manuales.
      </p>
    </div>
  </Tab>
</Tabs>

## Referenciando datos de Start en nodos posteriores

- Conecta <code>&lt;start.fieldName&gt;</code> directamente a agentes, herramientas o funciones que esperan cargas estructuradas.
- Usa sintaxis de plantillas como <code>&lt;start.sampleField&gt;</code> o <code>&lt;start.files[0].url&gt;</code> (solo en chat) en campos de prompt.
- Mantén <code>&lt;start.conversationId&gt;</code> a mano cuando necesites agrupar salidas, actualizar el historial de conversación o llamar de nuevo a la API de chat.

## Mejores prácticas

- Trata el bloque Start como el único punto de entrada cuando quieras dar soporte tanto a llamadas de API como de chat.
- Prefiere campos con formato de entrada nombrados en lugar de analizar JSON sin procesar en nodos posteriores; la conversión de tipos ocurre automáticamente.
- Añade validación o enrutamiento inmediatamente después de Start si ciertos campos son necesarios para que tu flujo de trabajo tenga éxito.

- Conecta <code>&lt;start.fieldName&gt;</code> directamente a agentes, herramientas o funciones que esperan cargas estructuradas.
- Usa sintaxis de plantillas como <code>&lt;start.sampleField&gt;</code> o <code>&lt;start.files[0].url&gt;</code> (solo en chat) en campos de prompt.
- Mantén <code>&lt;start.conversationId&gt;</code> a mano cuando necesites agrupar salidas, actualizar el historial de conversación o llamar de nuevo a la API de chat.

## Mejores prácticas

- Trata el bloque Start como el único punto de entrada cuando quieras admitir tanto llamadas de API como de chat.
- Prefiere campos de Formato de Entrada con nombre en lugar de analizar JSON sin procesar en nodos posteriores; la conversión de tipos ocurre automáticamente.
- Añade validación o enrutamiento inmediatamente después de Start si ciertos campos son necesarios para que tu flujo de trabajo tenga éxito.
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/es/triggers/webhook.mdx

```text
---
title: Webhooks
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Los webhooks permiten que servicios externos activen la ejecución de flujos de trabajo mediante el envío de solicitudes HTTP a tu flujo de trabajo. Sim admite dos enfoques para los disparadores basados en webhooks.

## Disparador de webhook genérico

El bloque de webhook genérico crea un punto de conexión flexible que puede recibir cualquier carga útil y activar tu flujo de trabajo:

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Configuración genérica de webhook"
    width={500}
    height={400}
    className="my-6"
  />
</div>

### Cómo funciona

1. **Añadir bloque de webhook genérico** - Arrastra el bloque de webhook genérico para iniciar tu flujo de trabajo
2. **Configurar carga útil** - Configura la estructura de carga útil esperada (opcional)
3. **Obtener URL del webhook** - Copia el punto de conexión único generado automáticamente
4. **Integración externa** - Configura tu servicio externo para enviar solicitudes POST a esta URL
5. **Ejecución del flujo de trabajo** - Cada solicitud a la URL del webhook activa el flujo de trabajo

### Características

- **Carga útil flexible**: Acepta cualquier estructura de carga útil JSON
- **Análisis automático**: Los datos del webhook se analizan automáticamente y están disponibles para los bloques subsiguientes
- **Autenticación**: Autenticación opcional mediante token bearer o encabezado personalizado
- **Limitación de tasa**: Protección incorporada contra abusos
- **Deduplicación**: Evita ejecuciones duplicadas de solicitudes repetidas

<Callout type="info">
El disparador de webhook genérico se activa cada vez que la URL del webhook recibe una solicitud, lo que lo hace perfecto para integraciones en tiempo real.
</Callout>

## Modo de disparador para bloques de servicio

Alternativamente, puedes usar bloques de servicio específicos (como Slack, GitHub, etc.) en "modo de disparador" para crear puntos de conexión de webhook más especializados:

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="slack-trigger.mp4" width={700} height={450} />
</div>

### Configuración del modo de activación

1. **Añadir bloque de servicio** - Elige un bloque de servicio (p. ej., Slack, GitHub, Airtable)
2. **Habilitar modo de activación** - Activa "Usar como activador" en la configuración del bloque
3. **Configurar servicio** - Configura la autenticación y los filtros de eventos específicos para ese servicio
4. **Registro del webhook** - El servicio registra automáticamente el webhook en la plataforma externa
5. **Ejecución basada en eventos** - El flujo de trabajo se activa solo para eventos específicos de ese servicio

### Cuándo usar cada enfoque

**Usa webhook genérico cuando:**
- Integres con aplicaciones o servicios personalizados
- Necesites máxima flexibilidad en la estructura de la carga útil
- Trabajes con servicios que no tienen bloques dedicados
- Construyas integraciones internas

**Usa el modo de activación cuando:**
- Trabajes con servicios compatibles (Slack, GitHub, etc.)
- Quieras filtrado de eventos específico del servicio
- Necesites registro automático de webhooks
- Quieras manejo estructurado de datos para ese servicio

## Servicios compatibles con el modo de activación

**Desarrollo y gestión de proyectos**
- GitHub - Issues, PRs, pushes, releases, ejecuciones de workflow
- Jira - Eventos de issues, registros de trabajo
- Linear - Issues, comentarios, proyectos, ciclos, etiquetas

**Comunicación**
- Slack - Mensajes, menciones, reacciones
- Microsoft Teams - Mensajes de chat, notificaciones de canal
- Telegram - Mensajes de bot, comandos
- WhatsApp - Eventos de mensajería

**Correo electrónico**
- Gmail - Nuevos correos (polling), cambios de etiquetas
- Outlook - Nuevos correos (polling), eventos de carpetas

**CRM y ventas**
- HubSpot - Contactos, empresas, acuerdos, tickets, conversaciones
- Stripe - Pagos, suscripciones, clientes

**Formularios y encuestas**
- Typeform - Envíos de formularios
- Google Forms - Respuestas de formularios
- Webflow - Elementos de colección, envíos de formularios

**Otros**
- Airtable - Cambios en registros
- Twilio Voice - Llamadas entrantes, estado de llamadas

## Seguridad y mejores prácticas

### Opciones de autenticación

- **Tokens Bearer**: Incluir encabezado `Authorization: Bearer <token>`
- **Encabezados personalizados**: Definir encabezados de autenticación personalizados

### Manejo de payload

- **Validación**: Validar payloads entrantes para prevenir datos malformados
- **Límites de tamaño**: Los webhooks tienen límites de tamaño de payload por seguridad
- **Manejo de errores**: Configurar respuestas de error para solicitudes inválidas

### Pruebas de webhooks

1. Usar herramientas como Postman o curl para probar tus endpoints de webhook
2. Revisar los registros de ejecución del flujo de trabajo para depuración
3. Verificar que la estructura del payload coincida con tus expectativas
4. Probar escenarios de autenticación y error

<Callout type="warning">
Siempre valida y desinfecta los datos entrantes de webhook antes de procesarlos en tus flujos de trabajo.
</Callout>

## Casos de uso comunes

### Notificaciones en tiempo real
- Mensajes de Slack que desencadenan respuestas automatizadas
- Notificaciones por correo electrónico para eventos críticos

### Integración CI/CD  
- Envíos de GitHub que activan flujos de trabajo de despliegue
- Actualizaciones del estado de compilación
- Canales de pruebas automatizadas

### Sincronización de datos
- Cambios en Airtable que actualizan otros sistemas
- Envíos de formularios que activan acciones de seguimiento
- Procesamiento de pedidos de comercio electrónico

### Atención al cliente
- Flujos de trabajo de creación de tickets de soporte
- Procesos automatizados de escalamiento
- Enrutamiento de comunicación multicanal
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/es/variables/environment-variables.mdx

```text
---
title: Variables de entorno
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

Las variables de entorno proporcionan una forma segura de gestionar valores de configuración y secretos en tus flujos de trabajo, incluyendo claves API y otros datos sensibles que tus flujos de trabajo necesitan acceder. Mantienen los secretos fuera de las definiciones de tu flujo de trabajo mientras los hacen disponibles durante la ejecución.

## Tipos de variables

Las variables de entorno en Sim funcionan en dos niveles:

- **Variables de entorno personales**: Privadas para tu cuenta, solo tú puedes verlas y usarlas
- **Variables de entorno del espacio de trabajo**: Compartidas en todo el espacio de trabajo, disponibles para todos los miembros del equipo

<Callout type="info">
Las variables de entorno del espacio de trabajo tienen prioridad sobre las personales cuando hay un conflicto de nombres.
</Callout>

## Configuración de variables de entorno

Navega a Configuración para configurar tus variables de entorno:

<Image
  src="/static/environment/environment-1.png"
  alt="Modal de variables de entorno para crear nuevas variables"
  width={500}
  height={350}
/>

Desde la configuración de tu espacio de trabajo, puedes crear y gestionar variables de entorno tanto personales como a nivel de espacio de trabajo. Las variables personales son privadas para tu cuenta, mientras que las variables del espacio de trabajo se comparten con todos los miembros del equipo.

### Hacer variables con ámbito de espacio de trabajo

Usa el interruptor de ámbito del espacio de trabajo para hacer que las variables estén disponibles para todo tu equipo:

<Image
  src="/static/environment/environment-2.png"
  alt="Interruptor de ámbito del espacio de trabajo para variables de entorno"
  width={500}
  height={350}
/>

Cuando habilitas el ámbito del espacio de trabajo, la variable se vuelve disponible para todos los miembros del espacio de trabajo y puede ser utilizada en cualquier flujo de trabajo dentro de ese espacio de trabajo.

### Vista de variables del espacio de trabajo

Una vez que tienes variables con ámbito de espacio de trabajo, aparecen en tu lista de variables de entorno:

<Image
  src="/static/environment/environment-3.png"
  alt="Variables con ámbito de espacio de trabajo en la lista de variables de entorno"
  width={500}
  height={350}
/>

## Uso de variables en flujos de trabajo

Para hacer referencia a variables de entorno en tus flujos de trabajo, utiliza la notación `{{}}`. Cuando escribas `{{` en cualquier campo de entrada, aparecerá un menú desplegable mostrando tanto tus variables de entorno personales como las del espacio de trabajo. Simplemente selecciona la variable que deseas utilizar.

<Image
  src="/static/environment/environment-4.png"
  alt="Uso de variables de entorno con notación de doble llave"
  width={500}
  height={350}
/>

## Cómo se resuelven las variables

**Las variables del espacio de trabajo siempre tienen prioridad** sobre las variables personales, independientemente de quién ejecute el flujo de trabajo.

Cuando no existe una variable de espacio de trabajo para una clave, se utilizan las variables personales:
- **Ejecuciones manuales (UI)**: Tus variables personales
- **Ejecuciones automatizadas (API, webhook, programación, chat implementado)**: Variables personales del propietario del flujo de trabajo

<Callout type="info">
Las variables personales son mejores para pruebas. Usa variables de espacio de trabajo para flujos de trabajo de producción.
</Callout>

## Mejores prácticas de seguridad

### Para datos sensibles
- Almacena claves API, tokens y contraseñas como variables de entorno en lugar de codificarlos directamente
- Usa variables de espacio de trabajo para recursos compartidos que varios miembros del equipo necesitan
- Mantén las credenciales personales en variables personales

### Nomenclatura de variables
- Usa nombres descriptivos: `DATABASE_URL` en lugar de `DB`
- Sigue convenciones de nomenclatura consistentes en todo tu equipo
- Considera usar prefijos para evitar conflictos: `PROD_API_KEY`, `DEV_API_KEY`

### Control de acceso
- Las variables de entorno del espacio de trabajo respetan los permisos del espacio de trabajo
- Solo los usuarios con acceso de escritura o superior pueden crear/modificar variables del espacio de trabajo
- Las variables personales siempre son privadas para el usuario individual
```

--------------------------------------------------------------------------------

````
