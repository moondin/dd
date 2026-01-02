---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 109
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 109 of 933)

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

---[FILE: datadog.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/datadog.mdx

```text
---
title: Datadog
description: Monitorea infraestructura, aplicaciones y registros con Datadog
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="datadog"
  color="#632CA6"
/>

{/* MANUAL-CONTENT-START:intro */}
[Datadog](https://datadoghq.com/) es una plataforma integral de monitoreo y análisis para infraestructura, aplicaciones, registros y más. Permite a las organizaciones obtener visibilidad en tiempo real sobre la salud y el rendimiento de los sistemas, detectar anomalías y automatizar la respuesta a incidentes.

Con Datadog, puedes:

- **Monitorear métricas**: Recopilar, visualizar y analizar métricas de servidores, servicios en la nube y aplicaciones personalizadas.
- **Consultar datos de series temporales**: Ejecutar consultas avanzadas sobre métricas de rendimiento para análisis de tendencias e informes.
- **Gestionar monitores y eventos**: Configurar monitores para detectar problemas, activar alertas y crear eventos para observabilidad.
- **Manejar tiempos de inactividad**: Programar y gestionar de forma programática los tiempos de inactividad planificados para suprimir alertas durante el mantenimiento.
- **Analizar registros y trazas** *(con configuración adicional en Datadog)*: Centralizar e inspeccionar registros o trazas distribuidas para una solución de problemas más profunda.

La integración de Datadog de Sim permite que tus agentes automaticen estas operaciones e interactúen con tu cuenta de Datadog de forma programática. Úsala para enviar métricas personalizadas, consultar datos de series temporales, gestionar monitores, crear eventos y optimizar tus flujos de trabajo de monitoreo directamente dentro de las automatizaciones de Sim.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra el monitoreo de Datadog en los flujos de trabajo. Envía métricas, gestiona monitores, consulta registros, crea eventos, maneja tiempos de inactividad y más.

## Herramientas

### `datadog_submit_metrics`

Envía métricas personalizadas a Datadog. Utilízalo para seguir el rendimiento de aplicaciones, métricas de negocio o datos de monitoreo personalizados.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `series` | string | Sí | Array JSON de series métricas para enviar. Cada serie debe incluir nombre de métrica, tipo \(gauge/rate/count\), puntos \(pares de marca de tiempo/valor\) y etiquetas opcionales. |
| `apiKey` | string | Sí | Clave API de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si las métricas se enviaron correctamente |
| `errors` | array | Cualquier error que haya ocurrido durante el envío |

### `datadog_query_timeseries`

Consulta datos de series temporales de métricas desde Datadog. Útil para analizar tendencias, crear informes o recuperar valores de métricas.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de métricas de Datadog (p. ej., "avg:system.cpu.user\{*\}") |
| `from` | number | Sí | Tiempo de inicio como marca de tiempo Unix en segundos |
| `to` | number | Sí | Tiempo de finalización como marca de tiempo Unix en segundos |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog (predeterminado: datadoghq.com) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `series` | array | Array de datos de series temporales con nombre de métrica, etiquetas y puntos de datos |
| `status` | string | Estado de la consulta |

### `datadog_create_event`

Publica un evento en el flujo de eventos de Datadog. Útil para notificaciones de despliegue, alertas o cualquier suceso significativo.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | Título del evento |
| `text` | string | Sí | Cuerpo/descripción del evento. Admite markdown. |
| `alertType` | string | No | Tipo de alerta: error, warning, info, success, user_update, recommendation o snapshot |
| `priority` | string | No | Prioridad del evento: normal o low |
| `host` | string | No | Nombre del host asociado con este evento |
| `tags` | string | No | Lista de etiquetas separadas por comas (p. ej., "env:production,service:api") |
| `aggregationKey` | string | No | Clave para agrupar eventos |
| `sourceTypeName` | string | No | Nombre del tipo de fuente para el evento |
| `dateHappened` | number | No | Marca de tiempo Unix cuando ocurrió el evento (por defecto: ahora) |
| `apiKey` | string | Sí | Clave API de Datadog |
| `site` | string | No | Sitio/región de Datadog (predeterminado: datadoghq.com) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `event` | object | Los detalles del evento creado |

### `datadog_create_monitor`

Crear un nuevo monitor/alerta en Datadog. Los monitores pueden rastrear métricas, verificaciones de servicio, eventos y más.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `name` | string | Sí | Nombre del monitor |
| `type` | string | Sí | Tipo de monitor: alerta de métrica, verificación de servicio, alerta de evento, alerta de proceso, alerta de registro, alerta de consulta, compuesto, alerta de sintéticos, alerta de slo |
| `query` | string | Sí | Consulta del monitor \(p. ej., "avg\(last_5m\):avg:system.cpu.idle\{*\} &lt; 20"\) |
| `message` | string | No | Mensaje para incluir con las notificaciones. Puede incluir menciones con @ y markdown. |
| `tags` | string | No | Lista de etiquetas separadas por comas |
| `priority` | number | No | Prioridad del monitor \(1-5, donde 1 es la más alta\) |
| `options` | string | No | Cadena JSON de opciones del monitor \(umbrales, notify_no_data, renotify_interval, etc.\) |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `monitor` | object | Los detalles del monitor creado |

### `datadog_get_monitor`

Recuperar detalles de un monitor específico por ID.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | Sí | El ID del monitor a recuperar |
| `groupStates` | string | No | Estados de grupo separados por comas para incluir: alerta, advertencia, sin datos, ok |
| `withDowntimes` | boolean | No | Incluir datos de tiempo de inactividad con el monitor |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `monitor` | object | Los detalles del monitor |

### `datadog_list_monitors`

Lista todos los monitores en Datadog con filtrado opcional por nombre, etiquetas o estado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupStates` | string | No | Estados de grupo separados por comas para filtrar: alert, warn, no data, ok |
| `name` | string | No | Filtrar monitores por nombre \(coincidencia parcial\) |
| `tags` | string | No | Lista de etiquetas separadas por comas para filtrar |
| `monitorTags` | string | No | Lista de etiquetas de monitor separadas por comas para filtrar |
| `withDowntimes` | boolean | No | Incluir datos de tiempo de inactividad con los monitores |
| `page` | number | No | Número de página para paginación \(indexado desde 0\) |
| `pageSize` | number | No | Número de monitores por página \(máximo 1000\) |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `monitors` | array | Lista de monitores |

### `datadog_mute_monitor`

Silencia un monitor para suprimir temporalmente las notificaciones.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | Sí | El ID del monitor a silenciar |
| `scope` | string | No | Ámbito a silenciar \(p. ej., "host:myhost"\). Si no se especifica, silencia todos los ámbitos. |
| `end` | number | No | Marca de tiempo Unix cuando debe finalizar el silenciamiento. Si no se especifica, silencia indefinidamente. |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el monitor se silenció correctamente |

### `datadog_query_logs`

Busca y recupera registros desde Datadog. Útil para solución de problemas, análisis o monitoreo.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda de registros \(p. ej., "service:web-app status:error"\) |
| `from` | string | Sí | Hora de inicio en formato ISO-8601 o relativo \(p. ej., "now-1h"\) |
| `to` | string | Sí | Hora de fin en formato ISO-8601 o relativo \(p. ej., "now"\) |
| `limit` | number | No | Número máximo de registros a devolver \(predeterminado: 50, máx: 1000\) |
| `sort` | string | No | Orden de clasificación: timestamp \(más antiguos primero\) o -timestamp \(más recientes primero\) |
| `indexes` | string | No | Lista separada por comas de índices de registros para buscar |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `logs` | array | Lista de entradas de registro |

### `datadog_send_logs`

Envía entradas de registro a Datadog para registro centralizado y análisis.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `logs` | string | Sí | Array JSON de entradas de registro. Cada entrada debe tener message y opcionalmente ddsource, ddtags, hostname, service. |
| `apiKey` | string | Sí | Clave API de Datadog |
| `site` | string | No | Sitio/región de Datadog \(predeterminado: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si los registros se enviaron correctamente |

### `datadog_create_downtime`

Programa un tiempo de inactividad para suprimir las notificaciones del monitor durante las ventanas de mantenimiento.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `scope` | string | Sí | Ámbito para aplicar el tiempo de inactividad \(p. ej., "host:myhost", "env:production", o "*" para todos\) |
| `message` | string | No | Mensaje a mostrar durante el tiempo de inactividad |
| `start` | number | No | Marca de tiempo Unix para el inicio del tiempo de inactividad \(por defecto es ahora\) |
| `end` | number | No | Marca de tiempo Unix para el final del tiempo de inactividad |
| `timezone` | string | No | Zona horaria para el tiempo de inactividad \(p. ej., "America/New_York"\) |
| `monitorId` | string | No | ID específico del monitor a silenciar |
| `monitorTags` | string | No | Etiquetas de monitor separadas por comas para coincidir \(p. ej., "team:backend,priority:high"\) |
| `muteFirstRecoveryNotification` | boolean | No | Silenciar la primera notificación de recuperación |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(por defecto: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `downtime` | object | Los detalles del tiempo de inactividad creado |

### `datadog_list_downtimes`

Listar todos los tiempos de inactividad programados en Datadog.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `currentOnly` | boolean | No | Solo devolver tiempos de inactividad actualmente activos |
| `monitorId` | string | No | Filtrar por ID de monitor |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog \(por defecto: datadoghq.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `downtimes` | array | Lista de tiempos de inactividad |

### `datadog_cancel_downtime`

Cancelar un tiempo de inactividad programado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `downtimeId` | string | Sí | El ID del tiempo de inactividad a cancelar |
| `apiKey` | string | Sí | Clave API de Datadog |
| `applicationKey` | string | Sí | Clave de aplicación de Datadog |
| `site` | string | No | Sitio/región de Datadog (predeterminado: datadoghq.com) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el tiempo de inactividad se canceló correctamente |

## Notas

- Categoría: `tools`
- Tipo: `datadog`
```

--------------------------------------------------------------------------------

---[FILE: discord.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/discord.mdx

```text
---
title: Discord
description: Interactúa con Discord
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="discord"
  color="#5865F2"
/>

{/* MANUAL-CONTENT-START:intro */}
[Discord](https://discord.com) es una potente plataforma de comunicación que te permite conectar con amigos, comunidades y equipos. Ofrece una variedad de funciones para la colaboración en equipo, incluyendo canales de texto, canales de voz y videollamadas.

Con una cuenta o bot de Discord, puedes:

- **Enviar mensajes**: Enviar mensajes a un canal específico
- **Obtener mensajes**: Obtener mensajes de un canal específico
- **Obtener servidor**: Obtener información sobre un servidor específico
- **Obtener usuario**: Obtener información sobre un usuario específico

En Sim, la integración con Discord permite a tus agentes acceder y aprovechar los servidores de Discord de tu organización. Los agentes pueden recuperar información de los canales de Discord, buscar usuarios específicos, obtener información del servidor y enviar mensajes. Esto permite que tus flujos de trabajo se integren con tus comunidades de Discord, automaticen notificaciones y creen experiencias interactivas.

> **Importante:** Para leer el contenido de los mensajes, tu bot de Discord necesita tener habilitado el "Message Content Intent" en el Portal de Desarrolladores de Discord. Sin este permiso, seguirás recibiendo los metadatos del mensaje pero el campo de contenido aparecerá vacío.

Los componentes de Discord en Sim utilizan una carga diferida eficiente, obteniendo datos solo cuando es necesario para minimizar las llamadas a la API y evitar limitaciones de tasa. La actualización de tokens ocurre automáticamente en segundo plano para mantener tu conexión.

### Configuración de tu bot de Discord

1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications)
2. Crea una nueva aplicación y navega a la pestaña "Bot"
3. Crea un bot y copia tu token de bot
4. En "Privileged Gateway Intents", habilita el **Message Content Intent** para leer el contenido de los mensajes
5. Invita a tu bot a tus servidores con los permisos apropiados
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integración completa con Discord: mensajes, hilos, canales, roles, miembros, invitaciones y webhooks.

## Herramientas

### `discord_send_message`

Enviar un mensaje a un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord al que enviar el mensaje |
| `content` | string | No | El contenido de texto del mensaje |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `files` | file[] | No | Archivos para adjuntar al mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Discord |

### `discord_get_messages`

Recuperar mensajes de un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord del que recuperar mensajes |
| `limit` | number | No | Número máximo de mensajes a recuperar \(predeterminado: 10, máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Contenedor para datos de mensajes |

### `discord_get_server`

Recuperar información sobre un servidor de Discord (guild)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Información del servidor de Discord \(guild\) |

### `discord_get_user`

Recuperar información sobre un usuario de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | Token del bot de Discord para autenticación |
| `userId` | string | Sí | El ID del usuario de Discord |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Información del usuario de Discord |

### `discord_edit_message`

Editar un mensaje existente en un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a editar |
| `content` | string | No | El nuevo contenido de texto para el mensaje |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos actualizados del mensaje de Discord |

### `discord_delete_message`

Eliminar un mensaje de un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a eliminar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_add_reaction`

Añadir una reacción con emoji a un mensaje de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje al que reaccionar |
| `emoji` | string | Sí | El emoji para reaccionar \(emoji unicode o emoji personalizado en formato nombre:id\) |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_remove_reaction`

Eliminar una reacción de un mensaje de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje con la reacción |
| `emoji` | string | Sí | El emoji a eliminar \(emoji unicode o emoji personalizado en formato nombre:id\) |
| `userId` | string | No | El ID del usuario cuya reacción se eliminará \(omitir para eliminar la propia reacción del bot\) |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_pin_message`

Fijar un mensaje en un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a fijar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_unpin_message`

Desfijar un mensaje en un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a desfijar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_create_thread`

Crear un hilo en un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord donde crear el hilo |
| `name` | string | Sí | El nombre del hilo \(1-100 caracteres\) |
| `messageId` | string | No | El ID del mensaje para crear un hilo a partir de él \(si se crea desde un mensaje existente\) |
| `autoArchiveDuration` | number | No | Duración en minutos para auto-archivar el hilo \(60, 1440, 4320, 10080\) |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del hilo creado |

### `discord_join_thread`

Unirse a un hilo en Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `threadId` | string | Sí | El ID del hilo al que unirse |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_leave_thread`

Abandonar un hilo en Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `threadId` | string | Sí | El ID del hilo que se va a abandonar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_archive_thread`

Archivar o desarchivar un hilo en Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `threadId` | string | Sí | El ID del hilo que se va a archivar/desarchivar |
| `archived` | boolean | Sí | Si se debe archivar \(true\) o desarchivar \(false\) el hilo |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos actualizados del hilo |

### `discord_create_channel`

Crear un nuevo canal en un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `name` | string | Sí | El nombre del canal \(1-100 caracteres\) |
| `type` | number | No | Tipo de canal \(0=texto, 2=voz, 4=categoría, 5=anuncio, 13=escenario\) |
| `topic` | string | No | Tema del canal \(0-1024 caracteres\) |
| `parentId` | string | No | ID de la categoría padre para el canal |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del canal creado |

### `discord_update_channel`

Actualizar un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord a actualizar |
| `name` | string | No | El nuevo nombre para el canal |
| `topic` | string | No | El nuevo tema para el canal |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del canal actualizado |

### `discord_delete_channel`

Eliminar un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord a eliminar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_get_channel`

Obtener información sobre un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord a recuperar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del canal |

### `discord_create_role`

Crear un nuevo rol en un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `name` | string | Sí | El nombre del rol |
| `color` | number | No | Valor de color RGB como entero \(p. ej., 0xFF0000 para rojo\) |
| `hoist` | boolean | No | Si se deben mostrar los miembros del rol por separado de los miembros en línea |
| `mentionable` | boolean | No | Si el rol puede ser mencionado |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del rol creado |

### `discord_update_role`

Actualizar un rol en un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `roleId` | string | Sí | El ID del rol a actualizar |
| `name` | string | No | El nuevo nombre para el rol |
| `color` | number | No | Valor de color RGB como entero |
| `hoist` | boolean | No | Si se deben mostrar los miembros del rol por separado |
| `mentionable` | boolean | No | Si el rol puede ser mencionado |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del rol actualizado |

### `discord_delete_role`

Eliminar un rol de un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `roleId` | string | Sí | El ID del rol a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_assign_role`

Asignar un rol a un miembro en un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario al que asignar el rol |
| `roleId` | string | Sí | El ID del rol a asignar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_remove_role`

Eliminar un rol de un miembro en un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario al que quitar el rol |
| `roleId` | string | Sí | El ID del rol a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_kick_member`

Expulsar a un miembro de un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario a expulsar |
| `reason` | string | No | Motivo para expulsar al miembro |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_ban_member`

Banear a un miembro de un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario a banear |
| `reason` | string | No | Motivo para banear al miembro |
| `deleteMessageDays` | number | No | Número de días para eliminar mensajes \(0-7\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_unban_member`

Desbanear a un miembro de un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario a desbanear |
| `reason` | string | No | Motivo para desbanear al miembro |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_get_member`

Obtener información sobre un miembro en un servidor de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del miembro |

### `discord_update_member`

Actualizar un miembro en un servidor de Discord (p. ej., cambiar apodo)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |
| `userId` | string | Sí | El ID del usuario a actualizar |
| `nick` | string | No | Nuevo apodo para el miembro \(null para eliminar\) |
| `mute` | boolean | No | Si se debe silenciar al miembro en canales de voz |
| `deaf` | boolean | No | Si se debe ensordecer al miembro en canales de voz |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos actualizados del miembro |

### `discord_create_invite`

Crear un enlace de invitación para un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord para el que crear una invitación |
| `maxAge` | number | No | Duración de la invitación en segundos \(0 = nunca expira, predeterminado 86400\) |
| `maxUses` | number | No | Número máximo de usos \(0 = ilimitado, predeterminado 0\) |
| `temporary` | boolean | No | Si la invitación otorga membresía temporal |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos de la invitación creada |

### `discord_get_invite`

Obtener información sobre una invitación de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `inviteCode` | string | Sí | El código de invitación a recuperar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos de la invitación |

### `discord_delete_invite`

Eliminar una invitación de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `inviteCode` | string | Sí | El código de invitación a eliminar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

### `discord_create_webhook`

Crear un webhook en un canal de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `channelId` | string | Sí | El ID del canal de Discord donde crear el webhook |
| `name` | string | Sí | Nombre del webhook \(1-80 caracteres\) |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del webhook creado |

### `discord_execute_webhook`

Ejecutar un webhook de Discord para enviar un mensaje

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `webhookId` | string | Sí | El ID del webhook |
| `webhookToken` | string | Sí | El token del webhook |
| `content` | string | Sí | El contenido del mensaje a enviar |
| `username` | string | No | Sobrescribir el nombre de usuario predeterminado del webhook |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Mensaje enviado a través del webhook |

### `discord_get_webhook`

Obtener información sobre un webhook de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `webhookId` | string | Sí | El ID del webhook a recuperar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del webhook |

### `discord_delete_webhook`

Eliminar un webhook de Discord

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Sí | El token del bot para autenticación |
| `webhookId` | string | Sí | El ID del webhook a eliminar |
| `serverId` | string | Sí | El ID del servidor de Discord \(ID del guild\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |

## Notas

- Categoría: `tools`
- Tipo: `discord`
```

--------------------------------------------------------------------------------

````
