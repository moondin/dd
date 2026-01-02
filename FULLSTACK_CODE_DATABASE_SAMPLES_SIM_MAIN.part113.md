---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 113
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 113 of 933)

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

---[FILE: gitlab.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/gitlab.mdx

```text
---
title: GitLab
description: Interactúa con proyectos, issues, solicitudes de fusión y pipelines de GitLab
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gitlab"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitLab](https://gitlab.com/) es una plataforma DevOps integral que permite a los equipos gestionar, colaborar y automatizar su ciclo de vida de desarrollo de software. Con GitLab, puedes manejar sin esfuerzo la gestión del código fuente, CI/CD, revisiones y colaboración en una sola aplicación.

Con GitLab en Sim, puedes:

- **Gestionar proyectos y repositorios**: Listar y recuperar tus proyectos de GitLab, acceder a detalles y organizar tus repositorios
- **Trabajar con issues**: Listar, crear y comentar issues para realizar seguimiento del trabajo y colaborar eficazmente
- **Gestionar solicitudes de fusión**: Revisar, crear y gestionar solicitudes de fusión para cambios de código y revisiones por pares
- **Automatizar pipelines de CI/CD**: Activar, monitorear e interactuar con pipelines de GitLab como parte de tus flujos de automatización
- **Colaborar con comentarios**: Añadir comentarios a issues o solicitudes de fusión para una comunicación eficiente dentro de tu equipo

Usando la integración de GitLab en Sim, tus agentes pueden interactuar programáticamente con tus proyectos de GitLab. Automatiza la gestión de proyectos, seguimiento de issues, revisiones de código y operaciones de pipeline de manera fluida en tus flujos de trabajo, optimizando tu proceso de desarrollo de software y mejorando la colaboración en todo tu equipo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra GitLab en el flujo de trabajo. Puede gestionar proyectos, issues, solicitudes de fusión, pipelines y añadir comentarios. Compatible con todas las operaciones principales de DevOps de GitLab.

## Herramientas

### `gitlab_list_projects`

Listar proyectos de GitLab accesibles para el usuario autenticado

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `owned` | boolean | No | Limitar a proyectos propiedad del usuario actual |
| `membership` | boolean | No | Limitar a proyectos de los que el usuario actual es miembro |
| `search` | string | No | Buscar proyectos por nombre |
| `visibility` | string | No | Filtrar por visibilidad \(public, internal, private\) |
| `orderBy` | string | No | Ordenar por campo \(id, name, path, created_at, updated_at, last_activity_at\) |
| `sort` | string | No | Dirección de ordenación \(asc, desc\) |
| `perPage` | number | No | Número de resultados por página \(predeterminado 20, máximo 100\) |
| `page` | number | No | Número de página para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `projects` | array | Lista de proyectos de GitLab |
| `total` | number | Número total de proyectos |

### `gitlab_get_project`

Obtener detalles de un proyecto específico de GitLab

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL \(p. ej., "namespace/project"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `project` | object | Los detalles del proyecto de GitLab |

### `gitlab_list_issues`

Listar issues en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `state` | string | No | Filtrar por estado \(opened, closed, all\) |
| `labels` | string | No | Lista de nombres de etiquetas separados por comas |
| `assigneeId` | number | No | Filtrar por ID de usuario asignado |
| `milestoneTitle` | string | No | Filtrar por título de hito |
| `search` | string | No | Buscar issues por título y descripción |
| `orderBy` | string | No | Ordenar por campo \(created_at, updated_at\) |
| `sort` | string | No | Dirección de ordenación \(asc, desc\) |
| `perPage` | number | No | Número de resultados por página \(predeterminado 20, máximo 100\) |
| `page` | number | No | Número de página para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issues` | array | Lista de issues de GitLab |
| `total` | number | Número total de issues |

### `gitlab_get_issue`

Obtener detalles de un issue específico de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `issueIid` | number | Sí | Número del issue dentro del proyecto \(el # mostrado en la interfaz de GitLab\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issue` | object | Los detalles del issue de GitLab |

### `gitlab_create_issue`

Crear un nuevo issue en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `title` | string | Sí | Título del issue |
| `description` | string | No | Descripción del issue \(Markdown soportado\) |
| `labels` | string | No | Lista de nombres de etiquetas separados por comas |
| `assigneeIds` | array | No | Array de IDs de usuarios para asignar |
| `milestoneId` | number | No | ID del hito para asignar |
| `dueDate` | string | No | Fecha de vencimiento en formato AAAA-MM-DD |
| `confidential` | boolean | No | Si el issue es confidencial |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issue` | object | El issue de GitLab creado |

### `gitlab_update_issue`

Actualizar un issue existente en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `issueIid` | number | Sí | ID interno del issue (IID) |
| `title` | string | No | Nuevo título del issue |
| `description` | string | No | Nueva descripción del issue (compatible con Markdown) |
| `stateEvent` | string | No | Evento de estado (cerrar o reabrir) |
| `labels` | string | No | Lista de nombres de etiquetas separados por comas |
| `assigneeIds` | array | No | Array de IDs de usuarios para asignar |
| `milestoneId` | number | No | ID del hito para asignar |
| `dueDate` | string | No | Fecha de vencimiento en formato AAAA-MM-DD |
| `confidential` | boolean | No | Si el issue es confidencial |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issue` | object | El issue de GitLab actualizado |

### `gitlab_delete_issue`

Eliminar un issue de un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `issueIid` | number | Sí | ID interno del issue (IID) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el issue fue eliminado correctamente |

### `gitlab_create_issue_note`

Añadir un comentario a un issue de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `issueIid` | number | Sí | ID interno del issue (IID) |
| `body` | string | Sí | Cuerpo del comentario (compatible con Markdown) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `note` | object | El comentario creado |

### `gitlab_list_merge_requests`

Listar merge requests en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `state` | string | No | Filtrar por estado (opened, closed, merged, all) |
| `labels` | string | No | Lista de nombres de etiquetas separados por comas |
| `sourceBranch` | string | No | Filtrar por rama de origen |
| `targetBranch` | string | No | Filtrar por rama de destino |
| `orderBy` | string | No | Ordenar por campo (created_at, updated_at) |
| `sort` | string | No | Dirección de ordenación (asc, desc) |
| `perPage` | number | No | Número de resultados por página (predeterminado 20, máximo 100) |
| `page` | number | No | Número de página para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `mergeRequests` | array | Lista de solicitudes de fusión de GitLab |
| `total` | number | Número total de solicitudes de fusión |

### `gitlab_get_merge_request`

Obtener detalles de una solicitud de fusión específica de GitLab

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `mergeRequestIid` | number | Sí | ID interno de la solicitud de fusión \(IID\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `mergeRequest` | object | Los detalles de la solicitud de fusión de GitLab |

### `gitlab_create_merge_request`

Crear una nueva solicitud de fusión en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `sourceBranch` | string | Sí | Nombre de la rama de origen |
| `targetBranch` | string | Sí | Nombre de la rama de destino |
| `title` | string | Sí | Título de la solicitud de fusión |
| `description` | string | No | Descripción de la solicitud de fusión \(Markdown soportado\) |
| `labels` | string | No | Lista de nombres de etiquetas separados por comas |
| `assigneeIds` | array | No | Array de IDs de usuarios para asignar |
| `milestoneId` | number | No | ID del hito para asignar |
| `removeSourceBranch` | boolean | No | Eliminar rama de origen después de la fusión |
| `squash` | boolean | No | Comprimir commits al fusionar |
| `draft` | boolean | No | Marcar como borrador \(trabajo en progreso\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `mergeRequest` | object | La solicitud de fusión de GitLab creada |

### `gitlab_update_merge_request`

Actualizar una solicitud de fusión existente en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `mergeRequestIid` | number | Sí | ID interno de la solicitud de fusión (IID) |
| `title` | string | No | Nuevo título de la solicitud de fusión |
| `description` | string | No | Nueva descripción de la solicitud de fusión |
| `stateEvent` | string | No | Evento de estado (cerrar o reabrir) |
| `labels` | string | No | Lista de nombres de etiquetas separados por comas |
| `assigneeIds` | array | No | Array de IDs de usuarios para asignar |
| `milestoneId` | number | No | ID del hito para asignar |
| `targetBranch` | string | No | Nueva rama de destino |
| `removeSourceBranch` | boolean | No | Eliminar rama de origen después de la fusión |
| `squash` | boolean | No | Comprimir commits al fusionar |
| `draft` | boolean | No | Marcar como borrador (trabajo en progreso) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `mergeRequest` | object | La solicitud de fusión de GitLab actualizada |

### `gitlab_merge_merge_request`

Fusionar una solicitud de fusión en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `mergeRequestIid` | number | Sí | ID interno de la solicitud de fusión (IID) |
| `mergeCommitMessage` | string | No | Mensaje personalizado para el commit de fusión |
| `squashCommitMessage` | string | No | Mensaje personalizado para el commit comprimido |
| `squash` | boolean | No | Comprimir commits antes de fusionar |
| `shouldRemoveSourceBranch` | boolean | No | Eliminar rama de origen después de la fusión |
| `mergeWhenPipelineSucceeds` | boolean | No | Fusionar cuando la pipeline tenga éxito |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `mergeRequest` | object | La solicitud de fusión de GitLab fusionada |

### `gitlab_create_merge_request_note`

Añadir un comentario a una solicitud de fusión de GitLab

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `mergeRequestIid` | number | Sí | ID interno de la solicitud de fusión (IID) |
| `body` | string | Sí | Cuerpo del comentario (compatible con Markdown) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `note` | object | El comentario creado |

### `gitlab_list_pipelines`

Listar pipelines en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `ref` | string | No | Filtrar por ref (rama o etiqueta) |
| `status` | string | No | Filtrar por estado (created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled) |
| `orderBy` | string | No | Ordenar por campo (id, status, ref, updated_at, user_id) |
| `sort` | string | No | Dirección de ordenación (asc, desc) |
| `perPage` | number | No | Número de resultados por página (predeterminado 20, máximo 100) |
| `page` | number | No | Número de página para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pipelines` | array | Lista de pipelines de GitLab |
| `total` | number | Número total de pipelines |

### `gitlab_get_pipeline`

Obtener detalles de un pipeline específico de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `pipelineId` | number | Sí | ID del pipeline |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pipeline` | object | Los detalles del pipeline de GitLab |

### `gitlab_create_pipeline`

Activar un nuevo pipeline en un proyecto de GitLab

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `ref` | string | Sí | Rama o etiqueta en la que ejecutar el pipeline |
| `variables` | array | No | Array de variables para el pipeline \(cada una con clave, valor y tipo de variable opcional\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pipeline` | object | El pipeline de GitLab creado |

### `gitlab_retry_pipeline`

Reintentar un pipeline de GitLab fallido

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID del proyecto o ruta codificada en URL |
| `pipelineId` | number | Sí | ID del pipeline |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pipeline` | objeto | El pipeline de GitLab reintentado |

### `gitlab_cancel_pipeline`

Cancelar un pipeline de GitLab en ejecución

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | cadena | Sí | ID del proyecto o ruta codificada en URL |
| `pipelineId` | número | Sí | ID del pipeline |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pipeline` | objeto | El pipeline de GitLab cancelado |

## Notas

- Categoría: `tools`
- Tipo: `gitlab`
```

--------------------------------------------------------------------------------

---[FILE: gmail.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/gmail.mdx

```text
---
title: Gmail
description: Envía, lee, busca y mueve mensajes de Gmail o activa flujos de
  trabajo a partir de eventos de Gmail
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gmail"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Gmail](https://gmail.com) es el popular servicio de correo electrónico de Google que proporciona una plataforma robusta para enviar, recibir y gestionar comunicaciones por correo electrónico. Con más de 1.800 millones de usuarios activos en todo el mundo, Gmail ofrece una experiencia rica en funciones con potentes capacidades de búsqueda, herramientas de organización y opciones de integración.

Con Gmail, puedes:

- **Enviar y recibir correos electrónicos**: Comunícate con contactos a través de una interfaz limpia e intuitiva
- **Organizar mensajes**: Usa etiquetas, carpetas y filtros para mantener tu bandeja de entrada organizada
- **Buscar eficientemente**: Encuentra mensajes específicos rápidamente con la potente tecnología de búsqueda de Google
- **Automatizar flujos de trabajo**: Crea filtros y reglas para procesar automáticamente los correos entrantes
- **Acceder desde cualquier lugar**: Usa Gmail en diferentes dispositivos con contenido y configuraciones sincronizados
- **Integrar con otros servicios**: Conéctate con Google Calendar, Drive y otras herramientas de productividad

En Sim, la integración con Gmail permite a tus agentes gestionar completamente los correos electrónicos de forma programática con amplias capacidades de automatización. Esto permite potentes escenarios de automatización como enviar notificaciones, procesar mensajes entrantes, extraer información de correos electrónicos y gestionar flujos de comunicación a gran escala. Tus agentes pueden:

- **Redactar y enviar**: Crear correos electrónicos personalizados con archivos adjuntos y enviarlos a destinatarios
- **Leer y buscar**: Encontrar mensajes específicos utilizando la sintaxis de búsqueda de Gmail y extraer contenido
- **Organizar inteligentemente**: Marcar mensajes como leídos/no leídos, archivar o desarchivar correos y gestionar etiquetas
- **Limpiar la bandeja de entrada**: Eliminar mensajes, mover correos entre etiquetas y mantener la bandeja de entrada vacía
- **Activar flujos de trabajo**: Escuchar nuevos correos en tiempo real, permitiendo flujos de trabajo receptivos que reaccionan a los mensajes entrantes

Esta integración cierra la brecha entre tus flujos de trabajo de IA y las comunicaciones por correo electrónico, permitiendo una interacción perfecta con una de las plataformas de comunicación más utilizadas del mundo. Ya sea que estés automatizando respuestas de atención al cliente, procesando recibos, gestionando suscripciones o coordinando comunicaciones de equipo, la integración con Gmail proporciona todas las herramientas que necesitas para una automatización completa del correo electrónico.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Gmail en el flujo de trabajo. Puede enviar, leer, buscar y mover correos electrónicos. Se puede usar en modo de activación para iniciar un flujo de trabajo cuando se recibe un nuevo correo electrónico.

## Herramientas

### `gmail_send`

Enviar correos electrónicos usando Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `subject` | string | No | Asunto del correo electrónico |
| `body` | string | Sí | Contenido del cuerpo del correo electrónico |
| `contentType` | string | No | Tipo de contenido para el cuerpo del correo electrónico \(texto o html\) |
| `threadId` | string | No | ID del hilo para responder \(para encadenar mensajes\) |
| `replyToMessageId` | string | No | ID del mensaje de Gmail para responder - use el campo "id" de los resultados de Gmail Read \(no el "messageId" de RFC\) |
| `cc` | string | No | Destinatarios en CC \(separados por comas\) |
| `bcc` | string | No | Destinatarios en CCO \(separados por comas\) |
| `attachments` | file[] | No | Archivos para adjuntar al correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_draft`

Crear borradores de correos electrónicos usando Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `subject` | string | No | Asunto del correo electrónico |
| `body` | string | Sí | Contenido del cuerpo del correo electrónico |
| `contentType` | string | No | Tipo de contenido para el cuerpo del correo electrónico \(texto o html\) |
| `threadId` | string | No | ID del hilo para responder \(para encadenar mensajes\) |
| `replyToMessageId` | string | No | ID del mensaje de Gmail para responder - use el campo "id" de los resultados de Gmail Read \(no el "messageId" de RFC\) |
| `cc` | string | No | Destinatarios en CC \(separados por comas\) |
| `bcc` | string | No | Destinatarios en CCO \(separados por comas\) |
| `attachments` | file[] | No | Archivos para adjuntar al borrador del correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del borrador |

### `gmail_read`

Leer correos electrónicos de Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | No | ID del mensaje a leer |
| `folder` | string | No | Carpeta/etiqueta de donde leer los correos electrónicos |
| `unreadOnly` | boolean | No | Recuperar solo mensajes no leídos |
| `maxResults` | number | No | Número máximo de mensajes a recuperar (predeterminado: 1, máximo: 10) |
| `includeAttachments` | boolean | No | Descargar e incluir archivos adjuntos del correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Contenido de texto del correo electrónico |
| `metadata` | json | Metadatos del correo electrónico |
| `attachments` | file[] | Archivos adjuntos del correo electrónico |

### `gmail_search`

Buscar correos electrónicos en Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda para correos electrónicos |
| `maxResults` | number | No | Número máximo de resultados a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Resumen de resultados de búsqueda |
| `metadata` | object | Metadatos de búsqueda |

### `gmail_move`

Mover correos electrónicos entre etiquetas/carpetas de Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje a mover |
| `addLabelIds` | string | Sí | IDs de etiquetas separados por comas para añadir (ej., INBOX, Label_123) |
| `removeLabelIds` | string | No | IDs de etiquetas separados por comas para eliminar (ej., INBOX, SPAM) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_mark_read`

Marcar un mensaje de Gmail como leído

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje a marcar como leído |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_mark_unread`

Marcar un mensaje de Gmail como no leído

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje para marcar como no leído |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_archive`

Archivar un mensaje de Gmail (quitar de la bandeja de entrada)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje para archivar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_unarchive`

Desarchivar un mensaje de Gmail (volver a la bandeja de entrada)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje para desarchivar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_delete`

Eliminar un mensaje de Gmail (mover a la papelera)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_add_label`

Añadir etiqueta(s) a un mensaje de Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje al que añadir etiquetas |
| `labelIds` | string | Sí | IDs de etiquetas separadas por comas para añadir \(p.ej., INBOX, Label_123\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

### `gmail_remove_label`

Eliminar etiqueta(s) de un mensaje de Gmail

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje del que eliminar etiquetas |
| `labelIds` | string | Sí | IDs de etiquetas separadas por comas para eliminar \(p.ej., INBOX, Label_123\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del correo electrónico |

## Notas

- Categoría: `tools`
- Tipo: `gmail`
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_calendar.mdx

```text
---
title: Google Calendar
description: Gestionar eventos de Google Calendar
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_calendar"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Calendar](https://calendar.google.com) es el potente servicio de calendario y programación de Google que proporciona una plataforma completa para gestionar eventos, reuniones y citas. Con una integración perfecta en todo el ecosistema de Google y una adopción generalizada, Google Calendar ofrece funciones robustas tanto para necesidades de programación personales como profesionales.

Con Google Calendar, puedes:

- **Crear y gestionar eventos**: Programar reuniones, citas y recordatorios con información detallada
- **Enviar invitaciones de calendario**: Notificar y coordinar automáticamente con los asistentes mediante invitaciones por correo electrónico
- **Creación de eventos con lenguaje natural**: Añadir eventos rápidamente usando lenguaje conversacional como "Reunión con Juan mañana a las 3pm"
- **Ver y buscar eventos**: Encontrar y acceder fácilmente a tus eventos programados en múltiples calendarios
- **Gestionar múltiples calendarios**: Organizar diferentes tipos de eventos en varios calendarios

En Sim, la integración con Google Calendar permite a tus agentes crear, leer y gestionar eventos de calendario de forma programática. Esto permite potentes escenarios de automatización como programar reuniones, enviar invitaciones de calendario, comprobar disponibilidad y gestionar detalles de eventos. Tus agentes pueden crear eventos con entrada en lenguaje natural, enviar invitaciones de calendario automatizadas a los asistentes, recuperar información de eventos y listar próximos eventos. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la gestión de calendarios, permitiendo una automatización de programación y coordinación perfecta con una de las plataformas de calendario más utilizadas del mundo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Google Calendar en el flujo de trabajo. Puede crear, leer, actualizar y listar eventos del calendario. Requiere OAuth.

## Herramientas

### `google_calendar_create`

Crear un nuevo evento en Google Calendar

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | ID del calendario \(por defecto es el primario\) |
| `summary` | string | Sí | Título/resumen del evento |
| `description` | string | No | Descripción del evento |
| `location` | string | No | Ubicación del evento |
| `startDateTime` | string | Sí | Fecha y hora de inicio. DEBE incluir el desplazamiento de zona horaria \(p. ej., 2025-06-03T10:00:00-08:00\) O proporcionar el parámetro timeZone |
| `endDateTime` | string | Sí | Fecha y hora de finalización. DEBE incluir el desplazamiento de zona horaria \(p. ej., 2025-06-03T11:00:00-08:00\) O proporcionar el parámetro timeZone |
| `timeZone` | string | No | Zona horaria \(p. ej., America/Los_Angeles\). Obligatorio si la fecha y hora no incluye desplazamiento. Por defecto es America/Los_Angeles si no se proporciona. |
| `attendees` | array | No | Array de direcciones de correo electrónico de los asistentes |
| `sendUpdates` | string | No | Cómo enviar actualizaciones a los asistentes: all, externalOnly o none |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de confirmación de creación del evento |
| `metadata` | json | Metadatos del evento creado incluyendo ID, estado y detalles |

### `google_calendar_list`

Listar eventos de Google Calendar

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | ID del calendario \(por defecto es el primario\) |
| `timeMin` | string | No | Límite inferior para eventos \(marca de tiempo RFC3339, p. ej., 2025-06-03T00:00:00Z\) |
| `timeMax` | string | No | Límite superior para eventos \(marca de tiempo RFC3339, p. ej., 2025-06-04T00:00:00Z\) |
| `orderBy` | string | No | Orden de los eventos devueltos \(startTime o updated\) |
| `showDeleted` | boolean | No | Incluir eventos eliminados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Resumen del recuento de eventos encontrados |
| `metadata` | json | Lista de eventos con tokens de paginación y detalles del evento |

### `google_calendar_get`

Obtener un evento específico de Google Calendar

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | ID del calendario (predeterminado: primario) |
| `eventId` | string | Sí | ID del evento a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de confirmación de recuperación del evento |
| `metadata` | json | Detalles del evento incluyendo ID, estado, horarios y asistentes |

### `google_calendar_quick_add`

Crear eventos a partir de texto en lenguaje natural

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | ID del calendario (predeterminado: primario) |
| `text` | string | Sí | Texto en lenguaje natural que describe el evento (p. ej., "Reunión con Juan mañana a las 3pm") |
| `attendees` | array | No | Array de direcciones de correo electrónico de los asistentes (también se acepta cadena separada por comas) |
| `sendUpdates` | string | No | Cómo enviar actualizaciones a los asistentes: all, externalOnly o none |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de confirmación de creación del evento a partir de lenguaje natural |
| `metadata` | json | Metadatos del evento creado incluyendo detalles analizados |

### `google_calendar_invite`

Invitar asistentes a un evento existente de Google Calendar

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | ID del calendario \(por defecto es el primario\) |
| `eventId` | string | Sí | ID del evento al que invitar asistentes |
| `attendees` | array | Sí | Array de direcciones de correo electrónico de los asistentes a invitar |
| `sendUpdates` | string | No | Cómo enviar actualizaciones a los asistentes: all, externalOnly, o none |
| `replaceExisting` | boolean | No | Si reemplazar a los asistentes existentes o añadirlos \(por defecto es false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de confirmación de invitación a asistentes con estado de entrega de correo electrónico |
| `metadata` | json | Metadatos actualizados del evento incluyendo lista de asistentes y detalles |

## Notas

- Categoría: `tools`
- Tipo: `google_calendar`
```

--------------------------------------------------------------------------------

````
