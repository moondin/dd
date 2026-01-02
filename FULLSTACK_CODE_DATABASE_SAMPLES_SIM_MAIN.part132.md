---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 132
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 132 of 933)

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

---[FILE: sendgrid.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/sendgrid.mdx

```text
---
title: SendGrid
description: Envía correos electrónicos y gestiona contactos, listas y
  plantillas con SendGrid
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sendgrid"
  color="#1A82E2"
/>

{/* MANUAL-CONTENT-START:intro */}
[SendGrid](https://sendgrid.com) es una plataforma líder de envío de correos electrónicos en la nube en la que confían desarrolladores y empresas para enviar correos electrónicos transaccionales y de marketing fiables a gran escala. Con sus sólidas APIs y potentes herramientas, SendGrid te permite gestionar todos los aspectos de tu comunicación por correo electrónico, desde el envío de notificaciones y recibos hasta la gestión de complejas campañas de marketing.

SendGrid ofrece a los usuarios un conjunto completo de operaciones de correo electrónico, permitiéndote automatizar flujos de trabajo críticos de correo electrónico y gestionar de cerca listas de contactos, plantillas y la participación de los destinatarios. Su integración perfecta con Sim permite a los agentes y flujos de trabajo entregar mensajes específicos, mantener listas dinámicas de contactos y destinatarios, activar correos electrónicos personalizados a través de plantillas y seguir los resultados en tiempo real.

Las características principales de SendGrid incluyen:

- **Correo electrónico transaccional:** Envía correos electrónicos transaccionales automatizados y de alto volumen (como notificaciones, recibos y restablecimientos de contraseña).
- **Plantillas dinámicas:** Utiliza plantillas de texto o HTML enriquecido con datos dinámicos para una comunicación altamente personalizada a gran escala.
- **Gestión de contactos:** Añade y actualiza contactos de marketing, gestiona listas de destinatarios y segmentos objetivo para campañas.
- **Soporte para archivos adjuntos:** Incluye uno o más archivos adjuntos en tus correos electrónicos.
- **Cobertura integral de API:** Gestiona programáticamente correos electrónicos, contactos, listas, plantillas, grupos de supresión y más.

Al conectar SendGrid con Sim, tus agentes pueden:

- Enviar correos electrónicos tanto simples como avanzados (con plantillas o múltiples destinatarios) como parte de cualquier flujo de trabajo.
- Gestionar y segmentar contactos y listas automáticamente.
- Aprovechar las plantillas para mantener consistencia y personalización dinámica.
- Realizar seguimiento y responder a la interacción con los correos electrónicos dentro de tus procesos automatizados.

Esta integración te permite automatizar todos los flujos de comunicación críticos, asegurar que los mensajes lleguen a la audiencia correcta y mantener el control sobre la estrategia de correo electrónico de tu organización, directamente desde los flujos de trabajo de Sim.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra SendGrid en tu flujo de trabajo. Envía correos electrónicos transaccionales, gestiona contactos y listas de marketing, y trabaja con plantillas de correo electrónico. Compatible con plantillas dinámicas, archivos adjuntos y gestión integral de contactos.

## Herramientas

### `sendgrid_send_mail`

Enviar un correo electrónico usando la API de SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `from` | string | Sí | Dirección de correo electrónico del remitente \(debe estar verificada en SendGrid\) |
| `fromName` | string | No | Nombre del remitente |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `toName` | string | No | Nombre del destinatario |
| `subject` | string | No | Asunto del correo electrónico \(obligatorio a menos que se use una plantilla con asunto predefinido\) |
| `content` | string | No | Contenido del cuerpo del correo electrónico \(obligatorio a menos que se use una plantilla con contenido predefinido\) |
| `contentType` | string | No | Tipo de contenido \(text/plain o text/html\) |
| `cc` | string | No | Dirección de correo electrónico CC |
| `bcc` | string | No | Dirección de correo electrónico BCC |
| `replyTo` | string | No | Dirección de correo electrónico de respuesta |
| `replyToName` | string | No | Nombre de respuesta |
| `attachments` | file[] | No | Archivos para adjuntar al correo electrónico |
| `templateId` | string | No | ID de plantilla de SendGrid a utilizar |
| `dynamicTemplateData` | json | No | Objeto JSON de datos de plantilla dinámica |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el correo electrónico se envió correctamente |
| `messageId` | string | ID del mensaje de SendGrid |
| `to` | string | Dirección de correo electrónico del destinatario |
| `subject` | string | Asunto del correo electrónico |

### `sendgrid_add_contact`

Añadir un nuevo contacto a SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `email` | string | Sí | Dirección de correo electrónico del contacto |
| `firstName` | string | No | Nombre del contacto |
| `lastName` | string | No | Apellido del contacto |
| `customFields` | json | No | Objeto JSON de pares clave-valor de campos personalizados \(use IDs de campo como e1_T, e2_N, e3_D, no nombres de campo\) |
| `listIds` | string | No | Lista separada por comas de IDs a los que añadir el contacto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `jobId` | string | ID de trabajo para seguimiento de la creación asíncrona de contactos |
| `email` | string | Dirección de correo electrónico del contacto |
| `firstName` | string | Nombre del contacto |
| `lastName` | string | Apellido del contacto |
| `message` | string | Mensaje de estado |

### `sendgrid_get_contact`

Obtener un contacto específico por ID desde SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `contactId` | string | Sí | ID del contacto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | ID del contacto |
| `email` | string | Dirección de correo electrónico del contacto |
| `firstName` | string | Nombre del contacto |
| `lastName` | string | Apellido del contacto |
| `createdAt` | string | Marca de tiempo de creación |
| `updatedAt` | string | Marca de tiempo de última actualización |
| `listIds` | json | Array de IDs de listas a las que pertenece el contacto |
| `customFields` | json | Valores de campos personalizados |

### `sendgrid_search_contacts`

Buscar contactos en SendGrid usando una consulta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `query` | string | Sí | Consulta de búsqueda (p. ej., "email LIKE '%example.com%' AND CONTAINS(list_ids, 'list-id')") |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contacts` | json | Array de contactos coincidentes |
| `contactCount` | number | Número total de contactos encontrados |

### `sendgrid_delete_contacts`

Eliminar uno o más contactos de SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `contactIds` | string | Sí | IDs de contactos separados por comas para eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `jobId` | string | ID de trabajo para la solicitud de eliminación |

### `sendgrid_create_list`

Crear una nueva lista de contactos en SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `name` | string | Sí | Nombre de la lista |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | ID de la lista |
| `name` | string | Nombre de la lista |
| `contactCount` | number | Número de contactos en la lista |

### `sendgrid_get_list`

Obtener una lista específica por ID desde SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `listId` | string | Sí | ID de la lista |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | ID de la lista |
| `name` | string | Nombre de la lista |
| `contactCount` | number | Número de contactos en la lista |

### `sendgrid_list_all_lists`

Obtener todas las listas de contactos desde SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `pageSize` | number | No | Número de listas a devolver por página \(predeterminado: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `lists` | json | Array de listas |

### `sendgrid_delete_list`

Eliminar una lista de contactos de SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `listId` | string | Sí | ID de la lista a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito |

### `sendgrid_add_contacts_to_list`

Añadir o actualizar contactos y asignarlos a una lista en SendGrid (usa PUT /v3/marketing/contacts)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `listId` | string | Sí | ID de la lista a la que añadir contactos |
| `contacts` | json | Sí | Array JSON de objetos de contacto. Cada contacto debe tener al menos: email \(o phone_number_id/external_id/anonymous_id\). Ejemplo: \[\{"email": "user@example.com", "first_name": "John"\}\] |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `jobId` | string | ID del trabajo para seguimiento de la operación asíncrona |
| `message` | string | Mensaje de estado |

### `sendgrid_remove_contacts_from_list`

Eliminar contactos de una lista específica en SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `listId` | string | Sí | ID de la lista |
| `contactIds` | string | Sí | IDs de contactos separados por comas para eliminar de la lista |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `jobId` | string | ID del trabajo para la solicitud |

### `sendgrid_create_template`

Crear una nueva plantilla de correo electrónico en SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `name` | string | Sí | Nombre de la plantilla |
| `generation` | string | No | Tipo de generación de plantilla \(legacy o dynamic, predeterminado: dynamic\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | ID de la plantilla |
| `name` | string | Nombre de la plantilla |
| `generation` | string | Generación de la plantilla |
| `updatedAt` | string | Marca de tiempo de la última actualización |
| `versions` | json | Array de versiones de la plantilla |

### `sendgrid_get_template`

Obtener una plantilla específica por ID desde SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `templateId` | string | Sí | ID de la plantilla |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | ID de la plantilla |
| `name` | string | Nombre de la plantilla |
| `generation` | string | Generación de la plantilla |
| `updatedAt` | string | Marca de tiempo de la última actualización |
| `versions` | json | Array de versiones de la plantilla |

### `sendgrid_list_templates`

Obtener todas las plantillas de correo electrónico de SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `generations` | string | No | Filtrar por generación \(legacy, dynamic, o ambas\) |
| `pageSize` | number | No | Número de plantillas a devolver por página \(predeterminado: 20\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `templates` | json | Array de plantillas |

### `sendgrid_delete_template`

Eliminar una plantilla de correo electrónico de SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `templateId` | string | Sí | ID de la plantilla a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `message` | string | Mensaje de estado o éxito |
| `messageId` | string | ID del mensaje de correo electrónico \(send_mail\) |
| `to` | string | Dirección de correo electrónico del destinatario \(send_mail\) |
| `subject` | string | Asunto del correo electrónico \(send_mail, create_template_version\) |
| `id` | string | ID del recurso |
| `jobId` | string | ID de trabajo para operaciones asíncronas |
| `email` | string | Dirección de correo electrónico del contacto |
| `firstName` | string | Nombre del contacto |
| `lastName` | string | Apellido del contacto |
| `createdAt` | string | Marca de tiempo de creación |
| `updatedAt` | string | Marca de tiempo de última actualización |
| `listIds` | json | Array de IDs de listas a las que pertenece el contacto |
| `customFields` | json | Valores de campos personalizados |
| `contacts` | json | Array de contactos |
| `contactCount` | number | Número de contactos |
| `lists` | json | Array de listas |
| `name` | string | Nombre del recurso |
| `templates` | json | Array de plantillas |
| `generation` | string | Generación de plantilla |
| `versions` | json | Array de versiones de plantilla |
| `templateId` | string | ID de plantilla |
| `active` | boolean | Si la versión de la plantilla está activa |
| `htmlContent` | string | Contenido HTML |
| `plainContent` | string | Contenido de texto plano |

### `sendgrid_create_template_version`

Crear una nueva versión de una plantilla de correo electrónico en SendGrid

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de SendGrid |
| `templateId` | string | Sí | ID de la plantilla |
| `name` | string | Sí | Nombre de la versión |
| `subject` | string | Sí | Línea de asunto del correo electrónico |
| `htmlContent` | string | No | Contenido HTML de la plantilla |
| `plainContent` | string | No | Contenido de texto plano de la plantilla |
| `active` | boolean | No | Si esta versión está activa \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | ID de la versión |
| `templateId` | string | ID de la plantilla |
| `name` | string | Nombre de la versión |
| `subject` | string | Asunto del correo electrónico |
| `active` | boolean | Si esta versión está activa |
| `htmlContent` | string | Contenido HTML |
| `plainContent` | string | Contenido de texto plano |
| `updatedAt` | string | Marca de tiempo de la última actualización |

## Notas

- Categoría: `tools`
- Tipo: `sendgrid`
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/sentry.mdx

```text
---
title: Sentry
description: Gestiona problemas, proyectos, eventos y lanzamientos de Sentry
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sentry"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Potencia tu monitoreo de errores y la fiabilidad de aplicaciones con [Sentry](https://sentry.io/) — la plataforma líder en la industria para seguimiento de errores en tiempo real, monitoreo de rendimiento y gestión de lanzamientos. Integra Sentry sin problemas en tus flujos de trabajo de agentes automatizados para monitorear fácilmente problemas, seguir eventos críticos, gestionar proyectos y orquestar lanzamientos en todas tus aplicaciones y servicios.

Con la herramienta Sentry, puedes:

- **Monitorear y clasificar problemas**: Obtén listas completas de problemas usando la operación `sentry_issues_list` y recupera información detallada sobre errores y fallos individuales a través de `sentry_issues_get`. Accede instantáneamente a metadatos, etiquetas, trazas de pila y estadísticas para reducir el tiempo medio de resolución.
- **Seguir datos de eventos**: Analiza instancias específicas de errores y eventos con `sentry_events_list` y `sentry_events_get`, proporcionando una visión profunda de las ocurrencias de errores y el impacto en los usuarios.
- **Gestionar proyectos y equipos**: Usa `sentry_projects_list` y `sentry_project_get` para enumerar y revisar todos tus proyectos de Sentry, asegurando una colaboración fluida del equipo y una configuración centralizada.
- **Coordinar lanzamientos**: Automatiza el seguimiento de versiones, la salud de los despliegues y la gestión de cambios en tu código con operaciones como `sentry_releases_list`, `sentry_release_get`, y más.
- **Obtener potentes perspectivas de aplicaciones**: Aprovecha filtros avanzados y consultas para encontrar problemas no resueltos o de alta prioridad, agregar estadísticas de eventos a lo largo del tiempo y seguir regresiones a medida que evoluciona tu código.

La integración de Sentry capacita a los equipos de ingeniería y DevOps para detectar problemas temprano, priorizar los errores más impactantes y mejorar continuamente la salud de las aplicaciones en todos los entornos de desarrollo. Orquesta programáticamente la automatización de flujos de trabajo para la observabilidad moderna, respuesta a incidentes y gestión del ciclo de vida de lanzamientos, reduciendo el tiempo de inactividad y aumentando la satisfacción del usuario.

**Operaciones clave de Sentry disponibles**:
- `sentry_issues_list`: Lista problemas de Sentry para organizaciones y proyectos, con potentes búsquedas y filtrado.
- `sentry_issues_get`: Recupera información detallada de un problema específico de Sentry.
- `sentry_events_list`: Enumera los eventos de un problema específico para análisis de causa raíz.
- `sentry_events_get`: Obtén detalles completos de un evento individual, incluyendo trazas de pila, contexto y metadatos.
- `sentry_projects_list`: Lista todos los proyectos de Sentry dentro de tu organización.
- `sentry_project_get`: Recupera la configuración y detalles de un proyecto específico.
- `sentry_releases_list`: Lista versiones recientes y su estado de implementación.
- `sentry_release_get`: Recupera información detallada de versiones, incluyendo commits y problemas asociados.

Ya sea que estés gestionando proactivamente la salud de la aplicación, solucionando errores en producción o automatizando flujos de trabajo de lanzamiento, Sentry te equipa con monitoreo de clase mundial, alertas procesables e integración DevOps perfecta. Mejora la calidad de tu software y la visibilidad en búsquedas aprovechando Sentry para seguimiento de errores, observabilidad y gestión de versiones, todo desde tus flujos de trabajo agénticos.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Sentry en el flujo de trabajo. Monitorea problemas, gestiona proyectos, realiza seguimiento de eventos y coordina lanzamientos en todas tus aplicaciones.

## Herramientas

### `sentry_issues_list`

Lista problemas de Sentry para una organización específica y opcionalmente un proyecto específico. Devuelve detalles del problema incluyendo estado, recuento de errores y marcas de tiempo de última visualización.

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `projectSlug` | string | No | Filtrar problemas por slug de proyecto específico \(opcional\) |
| `query` | string | No | Consulta de búsqueda para filtrar problemas. Admite sintaxis de búsqueda de Sentry \(p.ej., "is:unresolved", "level:error"\) |
| `statsPeriod` | string | No | Período de tiempo para estadísticas \(p.ej., "24h", "7d", "30d"\). Por defecto es 24h si no se especifica. |
| `cursor` | string | No | Cursor de paginación para recuperar la siguiente página de resultados |
| `limit` | number | No | Número de problemas a devolver por página \(predeterminado: 25, máx: 100\) |
| `status` | string | No | Filtrar por estado del problema: unresolved, resolved, ignored o muted |
| `sort` | string | No | Orden de clasificación: date, new, freq, priority o user \(predeterminado: date\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issues` | array | Lista de problemas de Sentry |

### `sentry_issues_get`

Recupera información detallada sobre un problema específico de Sentry mediante su ID. Devuelve detalles completos del problema, incluyendo metadatos, etiquetas y estadísticas.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `issueId` | string | Sí | El ID único del problema a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issue` | object | Información detallada sobre el problema de Sentry |

### `sentry_issues_update`

Actualiza un problema de Sentry cambiando su estado, asignación, estado de marcador u otras propiedades. Devuelve los detalles actualizados del problema.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `issueId` | string | Sí | El ID único del problema a actualizar |
| `status` | string | No | Nuevo estado para el problema: resolved, unresolved, ignored, o resolvedInNextRelease |
| `assignedTo` | string | No | ID de usuario o correo electrónico para asignar el problema. Usar cadena vacía para desasignar. |
| `isBookmarked` | boolean | No | Si se debe marcar el problema como favorito |
| `isSubscribed` | boolean | No | Si se debe suscribir a las actualizaciones del problema |
| `isPublic` | boolean | No | Si el problema debe ser visible públicamente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `issue` | object | El problema de Sentry actualizado |

### `sentry_projects_list`

Lista todos los proyectos en una organización de Sentry. Devuelve detalles del proyecto incluyendo nombre, plataforma, equipos y configuración.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `cursor` | string | No | Cursor de paginación para recuperar la siguiente página de resultados |
| `limit` | number | No | Número de proyectos a devolver por página \(predeterminado: 25, máximo: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `projects` | array | Lista de proyectos de Sentry |

### `sentry_projects_get`

Recupera información detallada sobre un proyecto específico de Sentry por su slug. Devuelve detalles completos del proyecto incluyendo equipos, características y configuración.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `projectSlug` | string | Sí | El ID o slug del proyecto a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `project` | object | Información detallada sobre el proyecto de Sentry |

### `sentry_projects_create`

Crea un nuevo proyecto de Sentry en una organización. Requiere un equipo para asociar el proyecto. Devuelve los detalles del proyecto creado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `name` | string | Sí | El nombre del proyecto |
| `teamSlug` | string | Sí | El slug del equipo que será propietario de este proyecto |
| `slug` | string | No | Identificador del proyecto compatible con URL \(generado automáticamente a partir del nombre si no se proporciona\) |
| `platform` | string | No | Plataforma/lenguaje para el proyecto \(por ejemplo, javascript, python, node, react-native\). Si no se especifica, el valor predeterminado es "other" |
| `defaultRules` | boolean | No | Si se deben crear reglas de alerta predeterminadas \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `project` | object | El proyecto de Sentry recién creado |

### `sentry_projects_update`

Actualiza un proyecto de Sentry cambiando su nombre, slug, plataforma u otros ajustes. Devuelve los detalles del proyecto actualizado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `projectSlug` | string | Sí | El slug del proyecto a actualizar |
| `name` | string | No | Nuevo nombre para el proyecto |
| `slug` | string | No | Nuevo identificador del proyecto compatible con URL |
| `platform` | string | No | Nueva plataforma/lenguaje para el proyecto \(por ejemplo, javascript, python, node\) |
| `isBookmarked` | boolean | No | Si se debe marcar el proyecto como favorito |
| `digestsMinDelay` | number | No | Retraso mínimo \(en segundos\) para notificaciones de resumen |
| `digestsMaxDelay` | number | No | Retraso máximo \(en segundos\) para notificaciones de resumen |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `project` | objeto | El proyecto de Sentry actualizado |

### `sentry_events_list`

Lista eventos de un proyecto de Sentry. Puede filtrarse por ID de problema, consulta o período de tiempo. Devuelve detalles del evento incluyendo contexto, etiquetas e información del usuario.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `projectSlug` | string | Sí | El slug del proyecto del que listar eventos |
| `issueId` | string | No | Filtrar eventos por un ID de problema específico |
| `query` | string | No | Consulta de búsqueda para filtrar eventos. Admite sintaxis de búsqueda de Sentry \(p. ej., "user.email:*@example.com"\) |
| `cursor` | string | No | Cursor de paginación para recuperar la siguiente página de resultados |
| `limit` | number | No | Número de eventos a devolver por página \(predeterminado: 50, máx: 100\) |
| `statsPeriod` | string | No | Período de tiempo para consultar \(p. ej., "24h", "7d", "30d"\). Por defecto es 90d si no se especifica. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `events` | array | Lista de eventos de Sentry |

### `sentry_events_get`

Recupera información detallada sobre un evento específico de Sentry por su ID. Devuelve detalles completos del evento incluyendo trazas de pila, migas de pan, contexto e información del usuario.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `projectSlug` | string | Sí | El slug del proyecto |
| `eventId` | string | Sí | El ID único del evento a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `event` | object | Información detallada sobre el evento de Sentry |

### `sentry_releases_list`

Lista las versiones para una organización o proyecto de Sentry. Devuelve detalles de la versión incluyendo versión, commits, información de despliegue y proyectos asociados.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `projectSlug` | string | No | Filtrar versiones por slug de proyecto específico \(opcional\) |
| `query` | string | No | Consulta de búsqueda para filtrar versiones \(p. ej., patrón de nombre de versión\) |
| `cursor` | string | No | Cursor de paginación para recuperar la siguiente página de resultados |
| `limit` | number | No | Número de versiones a devolver por página \(predeterminado: 25, máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `releases` | array | Lista de versiones de Sentry |

### `sentry_releases_create`

Crea una nueva versión en Sentry. Una versión es una versión de tu código desplegada en un entorno. Puede incluir información de commits y proyectos asociados. Devuelve los detalles de la versión creada.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `version` | string | Sí | Identificador de versión para la release \(p. ej., "2.0.0", "my-app@1.0.0", o un SHA de commit git\) |
| `projects` | string | Sí | Lista separada por comas de slugs de proyectos para asociar con esta versión |
| `ref` | string | No | Referencia Git \(SHA de commit, etiqueta o rama\) para esta versión |
| `url` | string | No | URL que apunta a la versión \(p. ej., página de lanzamiento de GitHub\) |
| `dateReleased` | string | No | Marca de tiempo ISO 8601 para cuando se desplegó la versión \(por defecto es la hora actual\) |
| `commits` | string | No | Array JSON de objetos de commit con id, repository \(opcional\), y message \(opcional\). Ejemplo: \[\{"id":"abc123","message":"Fix bug"\}\] |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `release` | object | La versión de Sentry recién creada |

### `sentry_releases_deploy`

Crea un registro de despliegue para una versión de Sentry en un entorno específico. Los despliegues rastrean cuándo y dónde se despliegan las versiones. Devuelve los detalles del despliegue creado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de autenticación de la API de Sentry |
| `organizationSlug` | string | Sí | El slug de la organización |
| `version` | string | Sí | Identificador de versión de la release que se está desplegando |
| `environment` | string | Sí | Nombre del entorno donde se está desplegando la release \(p. ej., "production", "staging"\) |
| `name` | string | No | Nombre opcional para este despliegue \(p. ej., "Deploy v2.0 to Production"\) |
| `url` | string | No | URL que apunta al despliegue \(p. ej., URL del pipeline de CI/CD\) |
| `dateStarted` | string | No | Marca de tiempo ISO 8601 para cuando comenzó el despliegue \(por defecto es la hora actual\) |
| `dateFinished` | string | No | Marca de tiempo ISO 8601 para cuando finalizó el despliegue |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deploy` | object | El registro de despliegue recién creado |

## Notas

- Categoría: `tools`
- Tipo: `sentry`
```

--------------------------------------------------------------------------------

---[FILE: serper.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/serper.mdx

```text
---
title: Serper
description: Busca en la web usando Serper
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="serper"
  color="#2B3543"
/>

{/* MANUAL-CONTENT-START:intro */}
[Serper](https://www.serper.com/) es una API de Google Search que proporciona a los desarrolladores acceso programático a los resultados de búsqueda de Google. Ofrece una forma fiable y de alto rendimiento para integrar las capacidades de búsqueda de Google en aplicaciones sin la complejidad del web scraping o las limitaciones de otras APIs de búsqueda.

Con Serper, puedes:

- **Acceder a resultados de búsqueda de Google**: Obtener datos estructurados de los resultados de búsqueda de Google de forma programática
- **Realizar diferentes tipos de búsqueda**: Ejecutar búsquedas web, búsquedas de imágenes, búsquedas de noticias y más
- **Recuperar metadatos enriquecidos**: Obtener títulos, fragmentos, URLs y otra información relevante de los resultados de búsqueda
- **Escalar tus aplicaciones**: Crear funcionalidades basadas en búsquedas con una API fiable y rápida
- **Evitar limitaciones de frecuencia**: Obtener acceso constante a los resultados de búsqueda sin preocuparte por bloqueos de IP

En Sim, la integración de Serper permite a tus agentes aprovechar el poder de la búsqueda web como parte de sus flujos de trabajo. Esto permite escenarios de automatización sofisticados que requieren información actualizada de internet. Tus agentes pueden formular consultas de búsqueda, recuperar resultados relevantes y usar esta información para tomar decisiones o proporcionar respuestas. Esta integración cierra la brecha entre la automatización de tu flujo de trabajo y el vasto conocimiento disponible en la web, permitiendo a tus agentes acceder a información en tiempo real sin intervención manual. Al conectar Sim con Serper, puedes crear agentes que se mantengan actualizados con la información más reciente, proporcionen respuestas más precisas y entreguen más valor a los usuarios.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Serper en el flujo de trabajo. Puede buscar en la web. Requiere clave API.

## Herramientas

### `serper_search`

Una potente herramienta de búsqueda web que proporciona acceso a los resultados de búsqueda de Google a través de la API de Serper.dev. Admite diferentes tipos de búsquedas, incluyendo búsqueda web regular, noticias, lugares e imágenes, y cada resultado contiene metadatos relevantes como títulos, URLs, fragmentos e información específica según el tipo.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda |
| `num` | number | No | Número de resultados a devolver |
| `gl` | string | No | Código de país para los resultados de búsqueda |
| `hl` | string | No | Código de idioma para los resultados de búsqueda |
| `type` | string | No | Tipo de búsqueda a realizar |
| `apiKey` | string | Sí | Clave API de Serper |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `searchResults` | array | Resultados de búsqueda con títulos, enlaces, fragmentos y metadatos específicos según el tipo \(fecha para noticias, calificación para lugares, imageUrl para imágenes\) |

## Notas

- Categoría: `tools`
- Tipo: `serper`
```

--------------------------------------------------------------------------------

````
