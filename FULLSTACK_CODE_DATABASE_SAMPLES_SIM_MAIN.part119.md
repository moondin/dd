---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 119
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 119 of 933)

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

---[FILE: jira.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/jira.mdx

```text
---
title: Jira
description: Interactúa con Jira
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jira"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jira](https://www.atlassian.com/jira) es una plataforma líder de gestión de proyectos y seguimiento de incidencias que ayuda a los equipos a planificar, rastrear y gestionar proyectos de desarrollo de software ágil de manera efectiva. Como parte de la suite de Atlassian, Jira se ha convertido en el estándar de la industria para equipos de desarrollo de software y profesionales de gestión de proyectos en todo el mundo.

Jira proporciona un conjunto completo de herramientas para gestionar proyectos complejos a través de su sistema de flujo de trabajo flexible y personalizable. Con su robusta API y capacidades de integración, Jira permite a los equipos optimizar sus procesos de desarrollo y mantener una clara visibilidad del progreso del proyecto.

Las características principales de Jira incluyen:

- Gestión de proyectos ágiles: Soporte para metodologías Scrum y Kanban con tableros y flujos de trabajo personalizables
- Seguimiento de incidencias: Sistema sofisticado de seguimiento para errores, historias, épicas y tareas con informes detallados
- Automatización de flujos de trabajo: Potentes reglas de automatización para optimizar tareas y procesos repetitivos
- Búsqueda avanzada: JQL (Jira Query Language) para filtrado e informes complejos de incidencias

En Sim, la integración con Jira permite a tus agentes interactuar sin problemas con tu flujo de trabajo de gestión de proyectos. Esto crea oportunidades para la creación, actualización y seguimiento automatizado de incidencias como parte de tus flujos de trabajo de IA. La integración permite a los agentes crear, recuperar y actualizar incidencias de Jira de forma programática, facilitando tareas automatizadas de gestión de proyectos y asegurando que la información importante sea debidamente rastreada y documentada. Al conectar Sim con Jira, puedes construir agentes inteligentes que mantengan la visibilidad del proyecto mientras automatizan tareas rutinarias de gestión de proyectos, mejorando la productividad del equipo y asegurando un seguimiento consistente del proyecto.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Jira en el flujo de trabajo. Puede leer, escribir y actualizar incidencias. También puede activar flujos de trabajo basados en eventos webhook de Jira.

## Herramientas

### `jira_retrieve`

Recupera información detallada sobre una incidencia específica de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `projectId` | string | No | ID del proyecto de Jira \(opcional; no es necesario para recuperar una sola incidencia\). |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a recuperar \(p. ej., PROJ-123\) |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de la incidencia (p. ej., PROJ-123) |
| `summary` | string | Resumen de la incidencia |
| `description` | json | Contenido de la descripción de la incidencia |
| `created` | string | Marca de tiempo de creación de la incidencia |
| `updated` | string | Marca de tiempo de última actualización de la incidencia |
| `issue` | json | Objeto completo de la incidencia con todos los campos |

### `jira_update`

Actualizar una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `projectId` | string | No | ID del proyecto de Jira para actualizar incidencias. Si no se proporciona, se recuperarán todas las incidencias. |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a actualizar |
| `summary` | string | No | Nuevo resumen para la incidencia |
| `description` | string | No | Nueva descripción para la incidencia |
| `status` | string | No | Nuevo estado para la incidencia |
| `priority` | string | No | Nueva prioridad para la incidencia |
| `assignee` | string | No | Nuevo asignado para la incidencia |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de la incidencia actualizada (p. ej., PROJ-123) |
| `summary` | string | Resumen de la incidencia después de la actualización |

### `jira_write`

Escribir una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `projectId` | string | Sí | ID del proyecto para la incidencia |
| `summary` | string | Sí | Resumen de la incidencia |
| `description` | string | No | Descripción de la incidencia |
| `priority` | string | No | Prioridad de la incidencia |
| `assignee` | string | No | Asignado para la incidencia |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |
| `issueType` | string | Sí | Tipo de incidencia a crear \(p. ej., Tarea, Historia\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de la incidencia creada (p. ej., PROJ-123) |
| `summary` | string | Resumen de la incidencia |
| `url` | string | URL de la incidencia creada |

### `jira_bulk_read`

Recuperar múltiples incidencias de Jira en bloque

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `projectId` | string | Sí | ID del proyecto de Jira |
| `cloudId` | string | No | ID de Jira cloud |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issues` | array | Array de incidencias de Jira con marca de tiempo, resumen, descripción, y marcas de tiempo de creación y actualización |

### `jira_delete_issue`

Eliminar una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a eliminar \(p. ej., PROJ-123\) |
| `deleteSubtasks` | boolean | No | Si se deben eliminar las subtareas. Si es falso, las incidencias principales con subtareas no se pueden eliminar. |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de la incidencia eliminada |

### `jira_assign_issue`

Asignar una incidencia de Jira a un usuario

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a asignar \(p. ej., PROJ-123\) |
| `accountId` | string | Sí | ID de cuenta del usuario al que asignar la incidencia. Usa "-1" para asignación automática o null para desasignar. |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de la incidencia que fue asignada |
| `assigneeId` | string | ID de cuenta del asignado |

### `jira_transition_issue`

Mover una incidencia de Jira entre estados de flujo de trabajo (p. ej., Pendiente -> En progreso)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a transicionar \(p. ej., PROJ-123\) |
| `transitionId` | string | Sí | ID de la transición a ejecutar \(p. ej., "11" para "Pendiente", "21" para "En progreso"\) |
| `comment` | string | No | Comentario opcional para añadir al transicionar la incidencia |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia que fue transicionada |
| `transitionId` | string | ID de transición aplicada |

### `jira_search_issues`

Buscar incidencias de Jira usando JQL (Jira Query Language)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `jql` | string | Sí | Cadena de consulta JQL para buscar incidencias \(p. ej., "project = PROJ AND status = Open"\) |
| `startAt` | number | No | El índice del primer resultado a devolver \(para paginación\) |
| `maxResults` | number | No | Número máximo de resultados a devolver \(predeterminado: 50\) |
| `fields` | array | No | Array de nombres de campos a devolver \(predeterminado: \['summary', 'status', 'assignee', 'created', 'updated'\]\) |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `total` | number | Número total de incidencias coincidentes |
| `startAt` | number | Índice de inicio de paginación |
| `maxResults` | number | Máximo de resultados por página |
| `issues` | array | Array de incidencias coincidentes con clave, resumen, estado, asignado, creado, actualizado |

### `jira_add_comment`

Añadir un comentario a una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a la que añadir el comentario \(p. ej., PROJ-123\) |
| `body` | string | Sí | Texto del cuerpo del comentario |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia a la que se añadió el comentario |
| `commentId` | string | ID del comentario creado |
| `body` | string | Contenido de texto del comentario |

### `jira_get_comments`

Obtener todos los comentarios de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira de la que obtener comentarios \(p. ej., PROJ-123\) |
| `startAt` | number | No | Índice del primer comentario a devolver \(predeterminado: 0\) |
| `maxResults` | number | No | Número máximo de comentarios a devolver \(predeterminado: 50\) |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `total` | number | Número total de comentarios |
| `comments` | array | Array de comentarios con id, autor, cuerpo, creado, actualizado |

### `jira_update_comment`

Actualizar un comentario existente en una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de incidencia de Jira que contiene el comentario \(p. ej., PROJ-123\) |
| `commentId` | string | Sí | ID del comentario a actualizar |
| `body` | string | Sí | Texto actualizado del comentario |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `commentId` | string | ID del comentario actualizado |
| `body` | string | Texto actualizado del comentario |

### `jira_delete_comment`

Eliminar un comentario de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de incidencia de Jira que contiene el comentario \(p. ej., PROJ-123\) |
| `commentId` | string | Sí | ID del comentario a eliminar |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `commentId` | string | ID del comentario eliminado |

### `jira_get_attachments`

Obtener todos los adjuntos de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira de la que obtener los adjuntos \(p. ej., PROJ-123\) |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `attachments` | array | Array de adjuntos con id, nombre de archivo, tamaño, tipo MIME, fecha de creación y autor |

### `jira_delete_attachment`

Eliminar un adjunto de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `attachmentId` | string | Sí | ID del adjunto a eliminar |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `attachmentId` | string | ID del adjunto eliminado |

### `jira_add_worklog`

Añadir una entrada de registro de trabajo de seguimiento de tiempo a una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a la que añadir el registro de trabajo \(p. ej., PROJ-123\) |
| `timeSpentSeconds` | number | Sí | Tiempo dedicado en segundos |
| `comment` | string | No | Comentario opcional para la entrada del registro de trabajo |
| `started` | string | No | Hora de inicio opcional en formato ISO \(por defecto es la hora actual\) |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia a la que se añadió el registro de trabajo |
| `worklogId` | string | ID del registro de trabajo creado |
| `timeSpentSeconds` | number | Tiempo empleado en segundos |

### `jira_get_worklogs`

Obtener todas las entradas de registro de trabajo de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira de la que obtener los registros de trabajo \(p. ej., PROJ-123\) |
| `startAt` | number | No | Índice del primer registro de trabajo a devolver \(predeterminado: 0\) |
| `maxResults` | number | No | Número máximo de registros de trabajo a devolver \(predeterminado: 50\) |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `total` | number | Número total de registros de trabajo |
| `worklogs` | array | Array de registros de trabajo con id, autor, segundos empleados, tiempo empleado, comentario, fecha de creación, actualización e inicio |

### `jira_update_worklog`

Actualizar una entrada existente de registro de trabajo en una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de incidencia de Jira que contiene el registro de trabajo \(p. ej., PROJ-123\) |
| `worklogId` | string | Sí | ID de la entrada de registro de trabajo a actualizar |
| `timeSpentSeconds` | number | No | Tiempo empleado en segundos |
| `comment` | string | No | Comentario opcional para la entrada de registro de trabajo |
| `started` | string | No | Hora de inicio opcional en formato ISO |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `worklogId` | string | ID del registro de trabajo actualizado |

### `jira_delete_worklog`

Eliminar una entrada de registro de trabajo de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de incidencia de Jira que contiene el registro de trabajo \(p. ej., PROJ-123\) |
| `worklogId` | string | Sí | ID de la entrada de registro de trabajo a eliminar |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `worklogId` | string | ID del registro de trabajo eliminado |

### `jira_create_issue_link`

Crear una relación de enlace entre dos incidencias de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `inwardIssueKey` | string | Sí | Clave de incidencia de Jira para la incidencia de entrada \(p. ej., PROJ-123\) |
| `outwardIssueKey` | string | Sí | Clave de incidencia de Jira para la incidencia de salida \(p. ej., PROJ-456\) |
| `linkType` | string | Sí | El tipo de relación de enlace \(p. ej., "Bloquea", "Se relaciona con", "Duplica"\) |
| `comment` | string | No | Comentario opcional para añadir al enlace de la incidencia |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `inwardIssue` | string | Clave de incidencia de entrada |
| `outwardIssue` | string | Clave de incidencia de salida |
| `linkType` | string | Tipo de enlace de incidencia |
| `linkId` | string | ID del enlace creado |

### `jira_delete_issue_link`

Eliminar un enlace entre dos incidencias de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `linkId` | string | Sí | ID del enlace de incidencia a eliminar |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá utilizando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `linkId` | string | ID del enlace eliminado |

### `jira_add_watcher`

Añadir un observador a una incidencia de Jira para recibir notificaciones sobre actualizaciones

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira a la que añadir el observador \(p. ej., PROJ-123\) |
| `accountId` | string | Sí | ID de cuenta del usuario que se añadirá como observador |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `watcherAccountId` | string | ID de cuenta del observador añadido |

### `jira_remove_watcher`

Eliminar un observador de una incidencia de Jira

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Tu dominio de Jira \(p. ej., tuempresa.atlassian.net\) |
| `issueKey` | string | Sí | Clave de la incidencia de Jira de la que eliminar el observador \(p. ej., PROJ-123\) |
| `accountId` | string | Sí | ID de cuenta del usuario que se eliminará como observador |
| `cloudId` | string | No | ID de Jira Cloud para la instancia. Si no se proporciona, se obtendrá usando el dominio. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ts` | string | Marca de tiempo de la operación |
| `issueKey` | string | Clave de incidencia |
| `watcherAccountId` | string | ID de cuenta del observador eliminado |

## Notas

- Categoría: `tools`
- Tipo: `jira`
```

--------------------------------------------------------------------------------

---[FILE: kalshi.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/kalshi.mdx

```text
---
title: Kalshi
description: Accede a mercados de predicción y opera en Kalshi
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="kalshi"
  color="#09C285"
/>

{/* MANUAL-CONTENT-START:intro */}
[Kalshi](https://kalshi.com) es un mercado regulado federalmente donde los usuarios pueden operar directamente sobre los resultados de eventos futuros—mercados de predicción. La robusta API de Kalshi y la integración con Sim permiten a los agentes y flujos de trabajo acceder programáticamente a todos los aspectos de la plataforma, admitiendo desde investigación y análisis hasta operaciones automatizadas y monitoreo.

Con la integración de Kalshi en Sim, puedes:

- **Datos de mercados y eventos:** Buscar, filtrar y obtener datos en tiempo real e históricos de mercados y eventos; obtener detalles granulares sobre el estado del mercado, series, agrupaciones de eventos y más.
- **Gestión de cuentas y saldos:** Acceder a saldos de cuenta, fondos disponibles y monitorear posiciones abiertas en tiempo real.
- **Gestión de órdenes y operaciones:** Colocar nuevas órdenes, cancelar las existentes, ver órdenes abiertas, obtener un libro de órdenes en vivo y acceder a historiales completos de operaciones.
- **Análisis de ejecución:** Obtener operaciones recientes, ejecuciones históricas y datos de velas para backtesting o investigación de estructura de mercado.
- **Monitoreo:** Verificar el estado de todo el mercado o a nivel de series, recibir actualizaciones en tiempo real sobre cambios en el mercado o interrupciones de operaciones, y automatizar respuestas.
- **Listo para automatización:** Construir agentes automatizados y paneles de control de extremo a extremo que consuman, analicen y operen con probabilidades de eventos del mundo real.

Al utilizar estas herramientas y puntos de acceso unificados, puedes incorporar sin problemas los mercados de predicción de Kalshi, capacidades de operación en vivo y datos profundos de eventos en tus aplicaciones impulsadas por IA, paneles de control y flujos de trabajo, permitiendo una toma de decisiones sofisticada y automatizada vinculada a resultados del mundo real.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra los mercados de predicción de Kalshi en el flujo de trabajo. Puede obtener mercados, mercado específico, eventos, evento específico, saldo, posiciones, órdenes, libro de órdenes, operaciones, gráficos de velas, ejecuciones, series, estado del intercambio y realizar/cancelar/modificar operaciones.

## Herramientas

### `kalshi_get_markets`

Obtener una lista de mercados de predicción de Kalshi con filtrado opcional

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `status` | string | No | Filtrar por estado \(unopened, open, closed, settled\) |
| `seriesTicker` | string | No | Filtrar por ticker de serie |
| `eventTicker` | string | No | Filtrar por ticker de evento |
| `limit` | string | No | Número de resultados \(1-1000, predeterminado: 100\) |
| `cursor` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `markets` | array | Array de objetos de mercado |
| `paging` | object | Cursor de paginación para obtener más resultados |

### `kalshi_get_market`

Obtener detalles de un mercado de predicción específico por ticker

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `ticker` | string | Sí | El ticker del mercado \(p. ej., "KXBTC-24DEC31"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `market` | object | Objeto de mercado con detalles |

### `kalshi_get_events`

Obtener una lista de eventos de Kalshi con filtrado opcional

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `status` | string | No | Filtrar por estado \(open, closed, settled\) |
| `seriesTicker` | string | No | Filtrar por ticker de serie |
| `withNestedMarkets` | string | No | Incluir mercados anidados en la respuesta \(true/false\) |
| `limit` | string | No | Número de resultados \(1-200, predeterminado: 200\) |
| `cursor` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `events` | array | Array de objetos de eventos |
| `paging` | object | Cursor de paginación para obtener más resultados |

### `kalshi_get_event`

Recuperar detalles de un evento específico por ticker

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `eventTicker` | string | Sí | El ticker del evento |
| `withNestedMarkets` | string | No | Incluir mercados anidados en la respuesta \(true/false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `event` | object | Objeto de evento con detalles |

### `kalshi_get_balance`

Recuperar el saldo de tu cuenta y el valor de la cartera desde Kalshi

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `balance` | number | Saldo de la cuenta en centavos |
| `portfolioValue` | number | Valor de la cartera en centavos |
| `balanceDollars` | number | Saldo de la cuenta en dólares |
| `portfolioValueDollars` | number | Valor de la cartera en dólares |

### `kalshi_get_positions`

Recuperar tus posiciones abiertas desde Kalshi

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `ticker` | string | No | Filtrar por ticker de mercado |
| `eventTicker` | string | No | Filtrar por ticker de evento \(máximo 10 separados por comas\) |
| `settlementStatus` | string | No | Filtrar por estado de liquidación \(all, unsettled, settled\). Predeterminado: unsettled |
| `limit` | string | No | Número de resultados \(1-1000, predeterminado: 100\) |
| `cursor` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `positions` | array | Array de objetos de posición |
| `paging` | object | Cursor de paginación para obtener más resultados |

### `kalshi_get_orders`

Recupera tus órdenes de Kalshi con filtrado opcional

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `ticker` | string | No | Filtrar por ticker de mercado |
| `eventTicker` | string | No | Filtrar por ticker de evento \(máximo 10 separados por comas\) |
| `status` | string | No | Filtrar por estado \(en espera, cancelado, ejecutado\) |
| `limit` | string | No | Número de resultados \(1-200, predeterminado: 100\) |
| `cursor` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `orders` | array | Array de objetos de órdenes |
| `paging` | object | Cursor de paginación para obtener más resultados |

### `kalshi_get_order`

Recupera detalles de una orden específica por ID desde Kalshi

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `orderId` | string | Sí | El ID de la orden a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | object | Objeto de orden con detalles |

### `kalshi_get_orderbook`

Recupera el libro de órdenes (ofertas de sí y no) para un mercado específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | Sí | Ticker del mercado \(p. ej., KXBTC-24DEC31\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `orderbook` | object | Libro de órdenes con ofertas y demandas de sí/no |

### `kalshi_get_trades`

Recupera operaciones recientes de todos los mercados

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Número de resultados \(1-1000, predeterminado: 100\) |
| `cursor` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `trades` | array | Array de objetos de operaciones |
| `paging` | object | Cursor de paginación para obtener más resultados |

### `kalshi_get_candlesticks`

Obtener datos de velas OHLC para un mercado específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | Sí | Ticker de serie |
| `ticker` | string | Sí | Ticker del mercado \(p. ej., KXBTC-24DEC31\) |
| `startTs` | number | Sí | Marca de tiempo inicial \(segundos Unix\) |
| `endTs` | number | Sí | Marca de tiempo final \(segundos Unix\) |
| `periodInterval` | number | Sí | Intervalo de período: 1 \(1min\), 60 \(1hora\), o 1440 \(1día\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `candlesticks` | array | Array de datos de velas OHLC |

### `kalshi_get_fills`

Recuperar tu portafolio

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `ticker` | string | No | Filtrar por ticker de mercado |
| `orderId` | string | No | Filtrar por ID de orden |
| `minTs` | number | No | Marca de tiempo mínima \(milisegundos Unix\) |
| `maxTs` | number | No | Marca de tiempo máxima \(milisegundos Unix\) |
| `limit` | string | No | Número de resultados \(1-1000, predeterminado: 100\) |
| `cursor` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `fills` | array | Array de objetos de ejecuciones/operaciones |
| `paging` | object | Cursor de paginación para obtener más resultados |

### `kalshi_get_series_by_ticker`

Obtener detalles de una serie de mercado específica por ticker

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | Sí | Ticker de la serie |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `series` | object | Objeto de serie con detalles |

### `kalshi_get_exchange_status`

Obtener el estado actual del intercambio Kalshi (actividad de trading y del intercambio)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `status` | object | Estado del exchange con indicadores trading_active y exchange_active |

### `kalshi_create_order`

Crear una nueva orden en un mercado de predicción de Kalshi

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `ticker` | string | Sí | Ticker del mercado \(p. ej., KXBTC-24DEC31\) |
| `side` | string | Sí | Lado de la orden: 'yes' o 'no' |
| `action` | string | Sí | Tipo de acción: 'buy' o 'sell' |
| `count` | string | Sí | Número de contratos \(mínimo 1\) |
| `type` | string | No | Tipo de orden: 'limit' o 'market' \(predeterminado: limit\) |
| `yesPrice` | string | No | Precio de 'yes' en centavos \(1-99\) |
| `noPrice` | string | No | Precio de 'no' en centavos \(1-99\) |
| `yesPriceDollars` | string | No | Precio de 'yes' en dólares \(p. ej., "0.56"\) |
| `noPriceDollars` | string | No | Precio de 'no' en dólares \(p. ej., "0.56"\) |
| `clientOrderId` | string | No | Identificador personalizado de la orden |
| `expirationTs` | string | No | Marca de tiempo Unix para la expiración de la orden |
| `timeInForce` | string | No | Tiempo en vigor: 'fill_or_kill', 'good_till_canceled', 'immediate_or_cancel' |
| `buyMaxCost` | string | No | Costo máximo en centavos \(habilita automáticamente fill_or_kill\) |
| `postOnly` | string | No | Establecer como 'true' para órdenes solo maker |
| `reduceOnly` | string | No | Establecer como 'true' solo para reducción de posición |
| `selfTradePreventionType` | string | No | Prevención de auto-negociación: 'taker_at_cross' o 'maker' |
| `orderGroupId` | string | No | ID de grupo de órdenes asociado |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | object | El objeto de orden creada |

### `kalshi_cancel_order`

Cancelar una orden existente en Kalshi

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `orderId` | string | Sí | El ID de la orden a cancelar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | object | El objeto de orden cancelada |
| `reducedBy` | number | Número de contratos cancelados |

### `kalshi_amend_order`

Modificar el precio o la cantidad de una orden existente en Kalshi

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Sí | Tu ID de clave API de Kalshi |
| `privateKey` | string | Sí | Tu clave privada RSA \(formato PEM\) |
| `orderId` | string | Sí | El ID de la orden a modificar |
| `ticker` | string | Sí | Ticker del mercado |
| `side` | string | Sí | Lado de la orden: 'yes' o 'no' |
| `action` | string | Sí | Tipo de acción: 'buy' o 'sell' |
| `clientOrderId` | string | Sí | El ID de orden original especificado por el cliente |
| `updatedClientOrderId` | string | Sí | El nuevo ID de orden especificado por el cliente después de la modificación |
| `count` | string | No | Cantidad actualizada para la orden |
| `yesPrice` | string | No | Precio actualizado para 'yes' en centavos \(1-99\) |
| `noPrice` | string | No | Precio actualizado para 'no' en centavos \(1-99\) |
| `yesPriceDollars` | string | No | Precio actualizado para 'yes' en dólares \(p. ej., "0.56"\) |
| `noPriceDollars` | string | No | Precio actualizado para 'no' en dólares \(p. ej., "0.56"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | object | El objeto de orden modificada |

## Notas

- Categoría: `tools`
- Tipo: `kalshi`
```

--------------------------------------------------------------------------------

````
