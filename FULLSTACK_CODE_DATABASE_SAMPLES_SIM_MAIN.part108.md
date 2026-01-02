---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 108
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 108 of 933)

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

---[FILE: calendly.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/calendly.mdx

```text
---
title: Calendly
description: Gestiona programación y eventos de Calendly
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="calendly"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Calendly](https://calendly.com/) es una popular plataforma de automatización de programación que te ayuda a reservar reuniones, eventos y citas con facilidad. Con Calendly, los equipos e individuos pueden simplificar la programación, reducir los intercambios de correos electrónicos y automatizar tareas relacionadas con eventos.

Con la integración de Sim Calendly, tus agentes pueden:

- **Recuperar información sobre tu cuenta y eventos programados**: Utiliza herramientas para obtener información de usuario, tipos de eventos y eventos programados para análisis o automatización.
- **Gestionar tipos de eventos y programación**: Accede y lista los tipos de eventos disponibles para usuarios u organizaciones, recupera detalles sobre tipos de eventos específicos y monitorea reuniones programadas y datos de invitados.
- **Automatizar seguimientos y flujos de trabajo**: Cuando los usuarios programan, reprograman o cancelan reuniones, los agentes de Sim pueden activar automáticamente los flujos de trabajo correspondientes, como enviar recordatorios, actualizar CRMs o notificar a los participantes.
- **Integración fácil mediante webhooks**: Configura flujos de trabajo de Sim para responder a eventos de webhook de Calendly en tiempo real, incluyendo cuando los invitados programan, cancelan o interactúan con formularios de enrutamiento.

Ya sea que quieras automatizar la preparación de reuniones, gestionar invitaciones o ejecutar flujos de trabajo personalizados en respuesta a la actividad de programación, las herramientas de Calendly en Sim te brindan acceso flexible y seguro. Desbloquea nuevas automatizaciones reaccionando instantáneamente a los cambios de programación, simplificando las operaciones y comunicaciones de tu equipo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Calendly en tu flujo de trabajo. Gestiona tipos de eventos, eventos programados, invitados y webhooks. También puede activar flujos de trabajo basados en eventos de webhook de Calendly (invitado programado, invitado cancelado, formulario de enrutamiento enviado). Requiere un token de acceso personal.

## Herramientas

### `calendly_get_current_user`

Obtener información sobre el usuario de Calendly actualmente autenticado

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `resource` | object | Información del usuario actual |

### `calendly_list_event_types`

Recuperar una lista de todos los tipos de eventos para un usuario u organización

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |
| `user` | string | No | Devolver solo tipos de eventos que pertenecen a este usuario \(formato URI\) |
| `organization` | string | No | Devolver solo tipos de eventos que pertenecen a esta organización \(formato URI\) |
| `count` | number | No | Número de resultados por página \(predeterminado: 20, máximo: 100\) |
| `pageToken` | string | No | Token de página para paginación |
| `sort` | string | No | Orden de clasificación para resultados \(p. ej., "name:asc", "name:desc"\) |
| `active` | boolean | No | Cuando es verdadero, muestra solo tipos de eventos activos. Cuando es falso o no está marcado, muestra todos los tipos de eventos \(tanto activos como inactivos\). |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `collection` | array | Array de objetos de tipo de evento |

### `calendly_get_event_type`

Obtener información detallada sobre un tipo de evento específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |
| `eventTypeUuid` | string | Sí | UUID del tipo de evento \(puede ser URI completa o solo el UUID\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `resource` | object | Detalles del tipo de evento |

### `calendly_list_scheduled_events`

Recuperar una lista de eventos programados para un usuario u organización

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |
| `user` | string | No | Devolver eventos que pertenecen a este usuario \(formato URI\). Se debe proporcionar "usuario" u "organización". |
| `organization` | string | No | Devolver eventos que pertenecen a esta organización \(formato URI\). Se debe proporcionar "usuario" u "organización". |
| `invitee_email` | string | No | Devolver eventos donde el invitado tiene este correo electrónico |
| `count` | number | No | Número de resultados por página \(predeterminado: 20, máximo: 100\) |
| `max_start_time` | string | No | Devolver eventos con hora de inicio antes de esta hora \(formato ISO 8601\) |
| `min_start_time` | string | No | Devolver eventos con hora de inicio después de esta hora \(formato ISO 8601\) |
| `pageToken` | string | No | Token de página para paginación |
| `sort` | string | No | Orden de clasificación para resultados \(p. ej., "start_time:asc", "start_time:desc"\) |
| `status` | string | No | Filtrar por estado \("active" o "canceled"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `collection` | array | Array de objetos de eventos programados |

### `calendly_get_scheduled_event`

Obtener información detallada sobre un evento programado específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |
| `eventUuid` | string | Sí | UUID del evento programado \(puede ser URI completa o solo el UUID\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `resource` | object | Detalles del evento programado |

### `calendly_list_event_invitees`

Recuperar una lista de invitados para un evento programado

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |
| `eventUuid` | string | Sí | UUID del evento programado \(puede ser URI completa o solo el UUID\) |
| `count` | number | No | Número de resultados por página \(predeterminado: 20, máximo: 100\) |
| `email` | string | No | Filtrar invitados por dirección de correo electrónico |
| `pageToken` | string | No | Token de página para paginación |
| `sort` | string | No | Orden de clasificación para resultados \(p. ej., "created_at:asc", "created_at:desc"\) |
| `status` | string | No | Filtrar por estado \("active" o "canceled"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `collection` | array | Array de objetos de invitados |

### `calendly_cancel_event`

Cancelar un evento programado

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Calendly |
| `eventUuid` | string | Sí | UUID del evento programado a cancelar \(puede ser URI completa o solo el UUID\) |
| `reason` | string | No | Motivo de la cancelación \(se enviará a los invitados\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `resource` | object | Detalles de la cancelación |

## Notas

- Categoría: `tools`
- Tipo: `calendly`
```

--------------------------------------------------------------------------------

---[FILE: clay.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/clay.mdx

```text
---
title: Clay
description: Poblar libro de trabajo de Clay
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="clay"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Clay](https://www.clay.com/) es una plataforma de enriquecimiento de datos y automatización de flujos de trabajo que ayuda a los equipos a agilizar la generación de leads, la investigación y las operaciones de datos a través de integraciones potentes y entradas flexibles.

Aprende a usar la herramienta Clay en Sim para insertar datos sin problemas en un libro de trabajo de Clay a través de disparadores webhook. Este tutorial te guía a través de la configuración de un webhook, la asignación de datos y la automatización de actualizaciones en tiempo real para tus libros de trabajo de Clay. ¡Perfecto para agilizar la generación de leads y el enriquecimiento de datos directamente desde tu flujo de trabajo!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cx_75X5sI_s"
  title="Integración de Clay con Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Con Clay, puedes:

- **Enriquecer salidas de agentes**: Alimenta automáticamente los datos de tu agente Sim en tablas de Clay para un seguimiento y análisis estructurado
- **Activar flujos de trabajo mediante webhooks**: Usa el soporte de webhook de Clay para iniciar tareas de agentes Sim desde Clay
- **Aprovechar bucles de datos**: Itera sin problemas sobre filas de datos enriquecidos con agentes que operan en conjuntos de datos dinámicos

En Sim, la integración con Clay permite que tus agentes envíen datos estructurados a tablas de Clay a través de webhooks. Esto facilita la recopilación, el enriquecimiento y la gestión de salidas dinámicas como leads, resúmenes de investigación o elementos de acción, todo en una interfaz colaborativa similar a una hoja de cálculo. Tus agentes pueden poblar filas en tiempo real, permitiendo flujos de trabajo asincrónicos donde los conocimientos generados por IA son capturados, revisados y utilizados por tu equipo. Ya sea que estés automatizando investigaciones, enriqueciendo datos de CRM o haciendo seguimiento de resultados operativos, Clay se convierte en una capa de datos viva que interactúa inteligentemente con tus agentes. Al conectar Sim con Clay, obtienes una forma poderosa de operacionalizar los resultados de los agentes, recorrer conjuntos de datos con precisión y mantener un registro limpio y auditable del trabajo impulsado por IA.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Clay en el flujo de trabajo. Puede completar una tabla con datos. Requiere una clave API.

## Herramientas

### `clay_populate`

Poblar Clay con datos de un archivo JSON. Permite comunicación directa y notificaciones con seguimiento de marca de tiempo y confirmación de canal.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `webhookURL` | string | Sí | La URL del webhook a completar |
| `data` | json | Sí | Los datos para completar |
| `authToken` | string | No | Token de autenticación opcional para la autenticación del webhook de Clay \(la mayoría de los webhooks no requieren esto\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | json | Datos de respuesta del webhook de Clay |
| `metadata` | object | Metadatos de respuesta del webhook |

## Notas

- Categoría: `tools`
- Tipo: `clay`
```

--------------------------------------------------------------------------------

---[FILE: confluence.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/confluence.mdx

```text
---
title: Confluence
description: Interactúa con Confluence
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="confluence"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Confluence](https://www.atlassian.com/software/confluence) es la potente plataforma de colaboración en equipo y gestión del conocimiento de Atlassian. Sirve como un espacio de trabajo centralizado donde los equipos pueden crear, organizar y compartir información entre departamentos y organizaciones.

Con Confluence, puedes:

- **Crear documentación estructurada**: Construir wikis completas, planes de proyectos y bases de conocimiento con formato enriquecido
- **Colaborar en tiempo real**: Trabajar juntos en documentos con compañeros de equipo, con comentarios, menciones y capacidades de edición
- **Organizar la información jerárquicamente**: Estructurar el contenido con espacios, páginas y jerarquías anidadas para una navegación intuitiva
- **Integrar con otras herramientas**: Conectar con Jira, Trello y otros productos de Atlassian para una integración fluida del flujo de trabajo
- **Controlar permisos de acceso**: Gestionar quién puede ver, editar o comentar contenido específico

En Sim, la integración con Confluence permite a tus agentes acceder y aprovechar la base de conocimientos de tu organización. Los agentes pueden recuperar información de las páginas de Confluence, buscar contenido específico e incluso actualizar la documentación cuando sea necesario. Esto permite que tus flujos de trabajo incorporen el conocimiento colectivo almacenado en tu instancia de Confluence, haciendo posible crear agentes que puedan consultar documentación interna, seguir procedimientos establecidos y mantener recursos de información actualizados como parte de sus operaciones.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Confluence en el flujo de trabajo. Puede leer, crear, actualizar, eliminar páginas, gestionar comentarios, adjuntos, etiquetas y buscar contenido.

## Herramientas

### `confluence_retrieve`

Recupera contenido de las páginas de Confluence utilizando la API de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence a recuperar |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la recuperación |
| `pageId` | string | ID de la página de Confluence |
| `content` | string | Contenido de la página con etiquetas HTML eliminadas |
| `title` | string | Título de la página |

### `confluence_update`

Actualiza una página de Confluence utilizando la API de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence a actualizar |
| `title` | string | No | Nuevo título para la página |
| `content` | string | No | Nuevo contenido para la página en formato de almacenamiento de Confluence |
| `version` | number | No | Número de versión de la página \(requerido para prevenir conflictos\) |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de actualización |
| `pageId` | string | ID de página de Confluence |
| `title` | string | Título de página actualizado |
| `success` | boolean | Estado de éxito de la operación de actualización |

### `confluence_create_page`

Crear una nueva página en un espacio de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `spaceId` | string | Sí | ID del espacio de Confluence donde se creará la página |
| `title` | string | Sí | Título de la nueva página |
| `content` | string | Sí | Contenido de la página en formato de almacenamiento de Confluence \(HTML\) |
| `parentId` | string | No | ID de la página padre si se está creando una página hija |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de creación |
| `pageId` | string | ID de la página creada |
| `title` | string | Título de la página |
| `url` | string | URL de la página |

### `confluence_delete_page`

Eliminar una página de Confluence (la mueve a la papelera donde puede ser restaurada).

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence a eliminar |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de eliminación |
| `pageId` | string | ID de página eliminada |
| `deleted` | boolean | Estado de eliminación |

### `confluence_search`

Buscar contenido en páginas de Confluence, publicaciones de blog y otro contenido.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `query` | string | Sí | Cadena de consulta de búsqueda |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 25\) |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de búsqueda |
| `results` | array | Resultados de búsqueda |

### `confluence_create_comment`

Añadir un comentario a una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence donde comentar |
| `comment` | string | Sí | Texto del comentario en formato de almacenamiento de Confluence |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de creación |
| `commentId` | string | ID del comentario creado |
| `pageId` | string | ID de la página |

### `confluence_list_comments`

Listar todos los comentarios en una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence de la que listar comentarios |
| `limit` | number | No | Número máximo de comentarios a devolver \(predeterminado: 25\) |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la recuperación |
| `comments` | array | Lista de comentarios |

### `confluence_update_comment`

Actualizar un comentario existente en una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `commentId` | string | Sí | ID del comentario de Confluence a actualizar |
| `comment` | string | Sí | Texto del comentario actualizado en formato de almacenamiento de Confluence |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de actualización |
| `commentId` | string | ID del comentario actualizado |
| `updated` | boolean | Estado de actualización |

### `confluence_delete_comment`

Eliminar un comentario de una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `commentId` | string | Sí | ID del comentario de Confluence a eliminar |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de eliminación |
| `commentId` | string | ID del comentario eliminado |
| `deleted` | boolean | Estado de eliminación |

### `confluence_upload_attachment`

Sube un archivo como adjunto a una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence a la que adjuntar el archivo |
| `file` | file | Sí | El archivo a subir como adjunto |
| `fileName` | string | No | Nombre de archivo personalizado opcional para el adjunto |
| `comment` | string | No | Comentario opcional para añadir al adjunto |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la subida |
| `attachmentId` | string | ID del adjunto subido |
| `title` | string | Nombre del archivo adjunto |
| `fileSize` | number | Tamaño del archivo en bytes |
| `mediaType` | string | Tipo MIME del adjunto |
| `downloadUrl` | string | URL de descarga del adjunto |
| `pageId` | string | ID de la página a la que se añadió el adjunto |

### `confluence_list_attachments`

Lista todos los adjuntos en una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence de la que listar adjuntos |
| `limit` | number | No | Número máximo de adjuntos a devolver \(predeterminado: 25\) |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la recuperación |
| `attachments` | array | Lista de archivos adjuntos |

### `confluence_delete_attachment`

Eliminar un archivo adjunto de una página de Confluence (lo mueve a la papelera).

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `attachmentId` | string | Sí | ID del archivo adjunto de Confluence a eliminar |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de eliminación |
| `attachmentId` | string | ID del archivo adjunto eliminado |
| `deleted` | boolean | Estado de eliminación |

### `confluence_list_labels`

Listar todas las etiquetas de una página de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `pageId` | string | Sí | ID de la página de Confluence de la que listar etiquetas |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la recuperación |
| `labels` | array | Lista de etiquetas |

### `confluence_get_space`

Obtener detalles sobre un espacio específico de Confluence.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `spaceId` | string | Sí | ID del espacio de Confluence a recuperar |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la recuperación |
| `spaceId` | string | ID del espacio |
| `name` | string | Nombre del espacio |
| `key` | string | Clave del espacio |
| `type` | string | Tipo de espacio |
| `status` | string | Estado del espacio |
| `url` | string | URL del espacio |

### `confluence_list_spaces`

Listar todos los espacios de Confluence accesibles para el usuario.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Confluence \(p. ej., tuempresa.atlassian.net\) |
| `limit` | number | No | Número máximo de espacios a devolver \(predeterminado: 25\) |
| `cloudId` | string | No | ID de Confluence Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la recuperación |
| `spaces` | array | Lista de espacios |

## Notas

- Categoría: `tools`
- Tipo: `confluence`
```

--------------------------------------------------------------------------------

---[FILE: cursor.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/cursor.mdx

```text
---
title: Cursor
description: Lanza y gestiona agentes en la nube de Cursor para trabajar en
  repositorios de GitHub
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="cursor"
  color="#1E1E1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Cursor](https://www.cursor.so/) es un IDE con IA y una plataforma basada en la nube que te permite lanzar y gestionar potentes agentes de IA capaces de trabajar directamente en tus repositorios de GitHub. Los agentes de Cursor pueden automatizar tareas de desarrollo, mejorar la productividad de tu equipo y colaborar contigo realizando cambios en el código, respondiendo a instrucciones en lenguaje natural y manteniendo un historial de conversaciones sobre sus actividades.

Con Cursor, puedes:

- **Lanzar agentes en la nube para bases de código**: Crear instantáneamente nuevos agentes de IA que trabajen en tus repositorios en la nube
- **Delegar tareas de programación usando lenguaje natural**: Guiar a los agentes con instrucciones escritas, modificaciones y aclaraciones
- **Monitorizar el progreso y los resultados**: Obtener el estado del agente, ver resultados detallados e inspeccionar tareas actuales o completadas
- **Acceder al historial completo de conversaciones**: Revisar todos los prompts y respuestas de IA para mayor transparencia y capacidad de auditoría
- **Controlar y gestionar el ciclo de vida del agente**: Listar agentes activos, terminar agentes y gestionar lanzamientos de agentes basados en API y seguimientos

En Sim, la integración con Cursor permite que tus agentes y flujos de trabajo interactúen programáticamente con los agentes en la nube de Cursor. Esto significa que puedes usar Sim para:

- Listar todos los agentes en la nube y explorar su estado actual (`cursor_list_agents`)
- Recuperar el estado actualizado y los resultados de cualquier agente (`cursor_get_agent`)
- Ver el historial completo de conversaciones de cualquier agente de programación (`cursor_get_conversation`)
- Añadir instrucciones de seguimiento o nuevos prompts a un agente en ejecución
- Gestionar y terminar agentes según sea necesario

Esta integración te ayuda a combinar la inteligencia flexible de los agentes de Sim con las potentes capacidades de automatización de desarrollo de Cursor, haciendo posible escalar el desarrollo impulsado por IA en todos tus proyectos.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Interactúa con la API de Agentes en la Nube de Cursor para lanzar agentes de IA que pueden trabajar en tus repositorios de GitHub. Permite lanzar agentes, añadir instrucciones de seguimiento, verificar el estado, ver conversaciones y gestionar el ciclo de vida de los agentes.

## Herramientas

### `cursor_list_agents`

Lista todos los agentes en la nube para el usuario autenticado con paginación opcional.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `limit` | number | No | Número de agentes a devolver \(predeterminado: 20, máximo: 100\) |
| `cursor` | string | No | Cursor de paginación de la respuesta anterior |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Lista legible de agentes |
| `metadata` | object | Metadatos de la lista de agentes |

### `cursor_get_agent`

Recupera el estado actual y los resultados de un agente en la nube.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `agentId` | string | Sí | Identificador único para el agente en la nube \(p. ej., bc_abc123\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Detalles del agente en formato legible |
| `metadata` | object | Metadatos del agente |

### `cursor_get_conversation`

Recupera el historial de conversación de un agente en la nube, incluyendo todas las instrucciones del usuario y las respuestas del asistente.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `agentId` | string | Sí | Identificador único para el agente en la nube \(p. ej., bc_abc123\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Historial de conversación en formato legible |
| `metadata` | object | Metadatos de la conversación |

### `cursor_launch_agent`

Inicia un nuevo agente en la nube para trabajar en un repositorio de GitHub con las instrucciones proporcionadas.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `repository` | string | Sí | URL del repositorio de GitHub \(p. ej., https://github.com/your-org/your-repo\) |
| `ref` | string | No | Rama, etiqueta o commit desde donde trabajar \(por defecto usa la rama principal\) |
| `promptText` | string | Sí | El texto de instrucciones para el agente |
| `promptImages` | string | No | Array JSON de objetos de imagen con datos en base64 y dimensiones |
| `model` | string | No | Modelo a utilizar \(dejar vacío para selección automática\) |
| `branchName` | string | No | Nombre de rama personalizado para que el agente utilice |
| `autoCreatePr` | boolean | No | Crear automáticamente un PR cuando el agente termine |
| `openAsCursorGithubApp` | boolean | No | Abrir el PR como la aplicación de GitHub de Cursor |
| `skipReviewerRequest` | boolean | No | Omitir la solicitud de revisores en el PR |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito con detalles del agente |
| `metadata` | object | Metadatos del resultado de lanzamiento |

### `cursor_add_followup`

Añade una instrucción de seguimiento a un agente en la nube existente.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `agentId` | string | Sí | Identificador único para el agente en la nube \(p. ej., bc_abc123\) |
| `followupPromptText` | string | Sí | El texto de instrucción de seguimiento para el agente |
| `promptImages` | string | No | Array JSON de objetos de imagen con datos en base64 y dimensiones \(máximo 5\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del resultado |

### `cursor_stop_agent`

Detener un agente en la nube en ejecución. Esto pausa el agente sin eliminarlo.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `agentId` | string | Sí | Identificador único para el agente en la nube \(p. ej., bc_abc123\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del resultado |

### `cursor_delete_agent`

Eliminar permanentemente un agente en la nube. Esta acción no se puede deshacer.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Cursor |
| `agentId` | string | Sí | Identificador único para el agente en la nube \(p. ej., bc_abc123\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del resultado |

## Notas

- Categoría: `tools`
- Tipo: `cursor`
```

--------------------------------------------------------------------------------

````
