---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 127
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 127 of 933)

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

---[FILE: pinecone.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/pinecone.mdx

```text
---
title: Pinecone
description: Usa la base de datos vectorial Pinecone
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pinecone"
  color="#0D1117"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pinecone](https://www.pinecone.io) es una base de datos vectorial diseñada para crear aplicaciones de búsqueda vectorial de alto rendimiento. Permite el almacenamiento eficiente, la gestión y la búsqueda por similitud de embeddings vectoriales de alta dimensionalidad, lo que la hace ideal para aplicaciones de IA que requieren capacidades de búsqueda semántica.

Con Pinecone, puedes:

- **Almacenar embeddings vectoriales**: Gestionar eficientemente vectores de alta dimensionalidad a escala
- **Realizar búsquedas por similitud**: Encontrar los vectores más similares a un vector de consulta en milisegundos
- **Construir búsquedas semánticas**: Crear experiencias de búsqueda basadas en significado en lugar de palabras clave
- **Implementar sistemas de recomendación**: Generar recomendaciones personalizadas basadas en similitud de contenido
- **Desplegar modelos de aprendizaje automático**: Operacionalizar modelos de ML que dependen de la similitud vectorial
- **Escalar sin problemas**: Manejar miles de millones de vectores con rendimiento consistente
- **Mantener índices en tiempo real**: Actualizar tu base de datos vectorial en tiempo real a medida que llegan nuevos datos

En Sim, la integración con Pinecone permite a tus agentes aprovechar las capacidades de búsqueda vectorial de forma programática como parte de sus flujos de trabajo. Esto permite escenarios de automatización sofisticados que combinan el procesamiento del lenguaje natural con la búsqueda y recuperación semántica. Tus agentes pueden generar embeddings a partir de texto, almacenar estos vectores en índices de Pinecone y realizar búsquedas de similitud para encontrar la información más relevante. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la infraestructura de búsqueda vectorial, permitiendo una recuperación de información más inteligente basada en el significado semántico en lugar de la coincidencia exacta de palabras clave. Al conectar Sim con Pinecone, puedes crear agentes que entienden el contexto, recuperan información relevante de grandes conjuntos de datos y ofrecen respuestas más precisas y personalizadas a los usuarios, todo sin requerir una gestión compleja de infraestructura o conocimientos especializados de bases de datos vectoriales.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Pinecone en el flujo de trabajo. Puede generar embeddings, insertar texto, buscar con texto, obtener vectores y buscar con vectores. Requiere clave API.

## Herramientas

### `pinecone_generate_embeddings`

Generar embeddings a partir de texto usando Pinecone

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `model` | string | Sí | Modelo a utilizar para generar embeddings |
| `inputs` | array | Sí | Array de entradas de texto para generar embeddings |
| `apiKey` | string | Sí | Clave API de Pinecone |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | array | Datos de embeddings generados con valores y tipo de vector |
| `model` | string | Modelo utilizado para generar embeddings |
| `vector_type` | string | Tipo de vector generado \(denso/disperso\) |
| `usage` | object | Estadísticas de uso para la generación de embeddings |

### `pinecone_upsert_text`

Insertar o actualizar registros de texto en un índice de Pinecone

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Sí | URL completa del host del índice de Pinecone |
| `namespace` | string | Sí | Espacio de nombres donde insertar los registros |
| `records` | array | Sí | Registro o matriz de registros para insertar, cada uno conteniendo _id, texto y metadatos opcionales |
| `apiKey` | string | Sí | Clave API de Pinecone |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `statusText` | string | Estado de la operación de inserción |
| `upsertedCount` | number | Número de registros insertados correctamente |

### `pinecone_search_text`

Buscar texto similar en un índice de Pinecone

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Sí | URL completa del host del índice de Pinecone |
| `namespace` | string | No | Espacio de nombres donde buscar |
| `searchQuery` | string | Sí | Texto a buscar |
| `topK` | string | No | Número de resultados a devolver |
| `fields` | array | No | Campos a devolver en los resultados |
| `filter` | object | No | Filtro a aplicar a la búsqueda |
| `rerank` | object | No | Parámetros de reordenación |
| `apiKey` | string | Sí | Clave API de Pinecone |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `matches` | array | Resultados de búsqueda con ID, puntuación y metadatos |

### `pinecone_search_vector`

Buscar vectores similares en un índice de Pinecone

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Sí | URL completa del host del índice de Pinecone |
| `namespace` | string | No | Espacio de nombres donde buscar |
| `vector` | array | Sí | Vector a buscar |
| `topK` | number | No | Número de resultados a devolver |
| `filter` | object | No | Filtro a aplicar a la búsqueda |
| `includeValues` | boolean | No | Incluir valores de vector en la respuesta |
| `includeMetadata` | boolean | No | Incluir metadatos en la respuesta |
| `apiKey` | string | Sí | Clave API de Pinecone |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `matches` | array | Resultados de búsqueda de vectores con ID, puntuación, valores y metadatos |
| `namespace` | string | Espacio de nombres donde se realizó la búsqueda |

### `pinecone_fetch`

Obtener vectores por ID desde un índice de Pinecone

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Sí | URL completa del host del índice de Pinecone |
| `ids` | array | Sí | Array de IDs de vectores a obtener |
| `namespace` | string | No | Espacio de nombres desde donde obtener los vectores |
| `apiKey` | string | Sí | Clave API de Pinecone |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `matches` | array | Vectores obtenidos con ID, valores, metadatos y puntuación |

## Notas

- Categoría: `tools`
- Tipo: `pinecone`
```

--------------------------------------------------------------------------------

---[FILE: pipedrive.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/pipedrive.mdx

```text
---
title: Pipedrive
description: Interactúa con Pipedrive CRM
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pipedrive"
  color="#2E6936"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pipedrive](https://www.pipedrive.com) es una potente plataforma CRM enfocada en ventas diseñada para ayudar a los equipos de ventas a gestionar leads, seguir oportunidades y optimizar su pipeline de ventas. Construida con simplicidad y efectividad en mente, Pipedrive se ha convertido en favorita entre profesionales de ventas y empresas en crecimiento en todo el mundo por su intuitiva gestión visual de pipeline y sus perspectivas de ventas procesables.

Pipedrive proporciona un conjunto completo de herramientas para gestionar todo el proceso de ventas, desde la captación de leads hasta el cierre de oportunidades. Con su robusta API y amplias capacidades de integración, Pipedrive permite a los equipos de ventas automatizar tareas repetitivas, mantener la consistencia de datos y centrarse en lo más importante: cerrar ventas.

Las características principales de Pipedrive incluyen:

- Pipeline visual de ventas: Interfaz intuitiva de arrastrar y soltar para gestionar oportunidades a través de etapas de venta personalizables
- Gestión de leads: Bandeja de entrada completa para capturar, calificar y convertir oportunidades potenciales
- Seguimiento de actividades: Sistema sofisticado para programar y seguir llamadas, reuniones, correos electrónicos y tareas
- Gestión de proyectos: Capacidades integradas de seguimiento de proyectos para el éxito del cliente y la entrega post-venta
- Integración de correo electrónico: Integración nativa con el buzón para un seguimiento fluido de las comunicaciones dentro del CRM

En Sim, la integración con Pipedrive permite que tus agentes de IA interactúen sin problemas con tu flujo de trabajo de ventas. Esto crea oportunidades para la calificación automatizada de leads, creación y actualización de acuerdos, programación de actividades y gestión de pipeline como parte de tus procesos de ventas impulsados por IA. La integración permite a los agentes crear, recuperar, actualizar y gestionar acuerdos, leads, actividades y proyectos de forma programática, facilitando la automatización inteligente de ventas y asegurando que la información crítica del cliente sea correctamente rastreada y se actúe en consecuencia. Al conectar Sim con Pipedrive, puedes construir agentes de IA que mantienen la visibilidad del pipeline de ventas, automatizan tareas rutinarias de CRM, califican leads de manera inteligente y aseguran que ninguna oportunidad se pierda, mejorando la productividad del equipo de ventas e impulsando un crecimiento constante de ingresos.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Pipedrive en tu flujo de trabajo. Gestiona acuerdos, contactos, pipeline de ventas, proyectos, actividades, archivos y comunicaciones con potentes capacidades de CRM.

## Herramientas

### `pipedrive_get_all_deals`

Recupera todos los acuerdos de Pipedrive con filtros opcionales

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `status` | string | No | Solo obtiene acuerdos con un estado específico. Valores: open, won, lost. Si se omite, se devuelven todos los acuerdos no eliminados |
| `person_id` | string | No | Si se proporciona, solo se devuelven los acuerdos vinculados a la persona especificada |
| `org_id` | string | No | Si se proporciona, solo se devuelven los acuerdos vinculados a la organización especificada |
| `pipeline_id` | string | No | Si se proporciona, solo se devuelven los acuerdos en el pipeline especificado |
| `updated_since` | string | No | Si se establece, solo se devuelven los acuerdos actualizados después de esta hora. Formato: 2025-01-01T10:20:00Z |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máximo: 500\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deals` | array | Array de objetos de acuerdos de Pipedrive |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_deal`

Recuperar información detallada sobre un acuerdo específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Sí | El ID del acuerdo a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deal` | object | Objeto de acuerdo con detalles completos |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_create_deal`

Crear un nuevo acuerdo en Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | El título del acuerdo |
| `value` | string | No | El valor monetario del acuerdo |
| `currency` | string | No | Código de moneda (p. ej., USD, EUR) |
| `person_id` | string | No | ID de la persona asociada a este acuerdo |
| `org_id` | string | No | ID de la organización asociada a este acuerdo |
| `pipeline_id` | string | No | ID del pipeline en el que se debe colocar este acuerdo |
| `stage_id` | string | No | ID de la etapa en la que se debe colocar este acuerdo |
| `status` | string | No | Estado del acuerdo: open, won, lost |
| `expected_close_date` | string | No | Fecha de cierre prevista en formato AAAA-MM-DD |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deal` | object | El objeto de acuerdo creado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_update_deal`

Actualizar un acuerdo existente en Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Sí | El ID del acuerdo a actualizar |
| `title` | string | No | Nuevo título para el acuerdo |
| `value` | string | No | Nuevo valor monetario para el acuerdo |
| `status` | string | No | Nuevo estado: open, won, lost |
| `stage_id` | string | No | Nuevo ID de etapa para el acuerdo |
| `expected_close_date` | string | No | Nueva fecha de cierre prevista en formato AAAA-MM-DD |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deal` | object | El objeto de acuerdo actualizado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_files`

Recuperar archivos de Pipedrive con filtros opcionales

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | No | Filtrar archivos por ID de acuerdo |
| `person_id` | string | No | Filtrar archivos por ID de persona |
| `org_id` | string | No | Filtrar archivos por ID de organización |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máx: 500\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `files` | array | Array de objetos de archivo de Pipedrive |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_mail_messages`

Recuperar hilos de correo del buzón de Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `folder` | string | No | Filtrar por carpeta: inbox, drafts, sent, archive \(predeterminado: inbox\) |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 50\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `messages` | array | Array de objetos de hilos de correo del buzón de Pipedrive |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_mail_thread`

Recuperar todos los mensajes de un hilo de correo específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `thread_id` | string | Sí | El ID del hilo de correo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `messages` | array | Array de objetos de mensajes de correo del hilo |
| `metadata` | object | Metadatos de la operación incluyendo ID del hilo |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_pipelines`

Recuperar todos los pipelines de Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `sort_by` | string | No | Campo para ordenar: id, update_time, add_time \(predeterminado: id\) |
| `sort_direction` | string | No | Dirección de ordenación: asc, desc \(predeterminado: asc\) |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máximo: 500\) |
| `cursor` | string | No | Para paginación, el marcador que representa el primer elemento en la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pipelines` | array | Array de objetos de pipeline de Pipedrive |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_pipeline_deals`

Recuperar todos los acuerdos en un pipeline específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `pipeline_id` | string | Sí | El ID del pipeline |
| `stage_id` | string | No | Filtrar por etapa específica dentro del pipeline |
| `status` | string | No | Filtrar por estado del acuerdo: open, won, lost |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máximo: 500\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deals` | array | Array de objetos de acuerdos del pipeline |
| `metadata` | object | Metadatos de la operación incluyendo ID del pipeline |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_projects`

Recuperar todos los proyectos o un proyecto específico de Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | No | Opcional: ID de un proyecto específico a recuperar |
| `status` | string | No | Filtrar por estado del proyecto: open, completed, deleted \(solo para listar todos\) |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máximo: 500, solo para listar todos\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `projects` | array | Array de objetos de proyectos \(al listar todos\) |
| `project` | object | Objeto de un solo proyecto \(cuando se proporciona project_id\) |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_create_project`

Crear un nuevo proyecto en Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | El título del proyecto |
| `description` | string | No | Descripción del proyecto |
| `start_date` | string | No | Fecha de inicio del proyecto en formato AAAA-MM-DD |
| `end_date` | string | No | Fecha de finalización del proyecto en formato AAAA-MM-DD |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `project` | object | El objeto del proyecto creado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_activities`

Recuperar actividades (tareas) de Pipedrive con filtros opcionales

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | No | Filtrar actividades por ID de negocio |
| `person_id` | string | No | Filtrar actividades por ID de persona |
| `org_id` | string | No | Filtrar actividades por ID de organización |
| `type` | string | No | Filtrar por tipo de actividad \(llamada, reunión, tarea, fecha límite, correo electrónico, almuerzo\) |
| `done` | string | No | Filtrar por estado de finalización: 0 para no realizado, 1 para realizado |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máximo: 500\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `activities` | array | Array de objetos de actividades de Pipedrive |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_create_activity`

Crear una nueva actividad (tarea) en Pipedrive

#### Input

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `subject` | string | Sí | El asunto/título de la actividad |
| `type` | string | Sí | Tipo de actividad: call, meeting, task, deadline, email, lunch |
| `due_date` | string | Sí | Fecha de vencimiento en formato AAAA-MM-DD |
| `due_time` | string | No | Hora de vencimiento en formato HH:MM |
| `duration` | string | No | Duración en formato HH:MM |
| `deal_id` | string | No | ID del negocio a asociar |
| `person_id` | string | No | ID de la persona a asociar |
| `org_id` | string | No | ID de la organización a asociar |
| `note` | string | No | Notas para la actividad |

#### Output

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `activity` | object | El objeto de actividad creado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_update_activity`

Actualizar una actividad existente (tarea) en Pipedrive

#### Input

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `activity_id` | string | Sí | El ID de la actividad a actualizar |
| `subject` | string | No | Nuevo asunto/título para la actividad |
| `due_date` | string | No | Nueva fecha de vencimiento en formato AAAA-MM-DD |
| `due_time` | string | No | Nueva hora de vencimiento en formato HH:MM |
| `duration` | string | No | Nueva duración en formato HH:MM |
| `done` | string | No | Marcar como completada: 0 para no completada, 1 para completada |
| `note` | string | No | Nuevas notas para la actividad |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `activity` | object | El objeto de actividad actualizado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_get_leads`

Recuperar todos los leads o un lead específico de Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | No | Opcional: ID de un lead específico para recuperar |
| `archived` | string | No | Obtener leads archivados en lugar de activos |
| `owner_id` | string | No | Filtrar por ID de usuario propietario |
| `person_id` | string | No | Filtrar por ID de persona |
| `organization_id` | string | No | Filtrar por ID de organización |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100, máx: 500\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `leads` | array | Array de objetos de leads \(al listar todos\) |
| `lead` | object | Objeto de lead individual \(cuando se proporciona lead_id\) |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_create_lead`

Crear un nuevo lead en Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | El nombre del lead |
| `person_id` | string | No | ID de la persona \(OBLIGATORIO a menos que se proporcione organization_id\) |
| `organization_id` | string | No | ID de la organización \(OBLIGATORIO a menos que se proporcione person_id\) |
| `owner_id` | string | No | ID del usuario que será propietario del lead |
| `value_amount` | string | No | Cantidad de valor potencial |
| `value_currency` | string | No | Código de moneda \(p. ej., USD, EUR\) |
| `expected_close_date` | string | No | Fecha de cierre esperada en formato AAAA-MM-DD |
| `visible_to` | string | No | Visibilidad: 1 \(Propietario y seguidores\), 3 \(Toda la empresa\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `lead` | object | El objeto de lead creado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_update_lead`

Actualizar un lead existente en Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Sí | El ID del lead a actualizar |
| `title` | string | No | Nuevo nombre para el lead |
| `person_id` | string | No | Nuevo ID de persona |
| `organization_id` | string | No | Nuevo ID de organización |
| `owner_id` | string | No | Nuevo ID de usuario propietario |
| `value_amount` | string | No | Nuevo valor de cantidad |
| `value_currency` | string | No | Nuevo código de moneda (p. ej., USD, EUR) |
| `expected_close_date` | string | No | Nueva fecha de cierre prevista en formato AAAA-MM-DD |
| `is_archived` | string | No | Archivar el lead: true o false |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `lead` | object | El objeto de lead actualizado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `pipedrive_delete_lead`

Eliminar un lead específico de Pipedrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Sí | El ID del lead a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | object | Datos de confirmación de eliminación |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

## Notas

- Categoría: `tools`
- Tipo: `pipedrive`
```

--------------------------------------------------------------------------------

---[FILE: polymarket.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/polymarket.mdx

```text
---
title: Polymarket
description: Accede a datos de mercados de predicción desde Polymarket
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="polymarket"
  color="#4C82FB"
/>

{/* MANUAL-CONTENT-START:intro */}
[Polymarket](https://polymarket.com) es una plataforma descentralizada de mercados de predicción donde los usuarios pueden operar sobre el resultado de eventos futuros utilizando tecnología blockchain. Polymarket proporciona una API completa, permitiendo a desarrolladores y agentes acceder a datos de mercado en vivo, listados de eventos, información de precios y estadísticas de libro de órdenes para potenciar flujos de trabajo basados en datos y automatizaciones de IA.

Con la API de Polymarket y la integración de Sim, puedes permitir que los agentes recuperen programáticamente información de mercados de predicción, exploren mercados abiertos y eventos asociados, analicen datos históricos de precios y accedan a libros de órdenes y puntos medios del mercado. Esto crea nuevas posibilidades para la investigación, análisis automatizado y desarrollo de agentes inteligentes que reaccionan a probabilidades de eventos en tiempo real derivadas de los precios del mercado.

Las características principales de la integración de Polymarket incluyen:

- **Listado y filtrado de mercados:** Lista todos los mercados de predicción actuales o históricos, filtra por etiqueta, ordena y navega por los resultados paginados.
- **Detalle del mercado:** Recupera detalles de un solo mercado por ID o slug, incluyendo sus resultados y estado.
- **Listados de eventos:** Accede a listas de eventos de Polymarket e información detallada de eventos.
- **Libro de órdenes y datos de precios:** Analiza el libro de órdenes, obtén los últimos precios del mercado, visualiza el punto medio u obtén información histórica de precios para cualquier mercado.
- **Listo para automatización:** Construye agentes o herramientas que reaccionan programáticamente a desarrollos del mercado, cambios en las probabilidades o resultados específicos de eventos.

Al utilizar estos endpoints de API documentados, puedes integrar perfectamente los ricos datos de mercados de predicción en cadena de Polymarket en tus propios flujos de trabajo de IA, paneles de control, herramientas de investigación y automatizaciones de trading.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra los mercados de predicción de Polymarket en el flujo de trabajo. Puede obtener mercados, mercado, eventos, evento, etiquetas, series, libro de órdenes, precio, punto medio, historial de precios, último precio de operación, diferencial, tamaño de tick, posiciones, operaciones y búsqueda.

## Herramientas

### `polymarket_get_markets`

Obtener una lista de mercados de predicción de Polymarket con filtrado opcional

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `closed` | string | No | Filtrar por estado cerrado \(true/false\). Use false para mostrar solo mercados activos. |
| `order` | string | No | Campo de ordenación \(p. ej., volumeNum, liquidityNum, startDate, endDate, createdAt\) |
| `ascending` | string | No | Dirección de ordenación \(true para ascendente, false para descendente\) |
| `tagId` | string | No | Filtrar por ID de etiqueta |
| `limit` | string | No | Número de resultados por página \(máximo 50\) |
| `offset` | string | No | Desplazamiento de paginación \(omitir esta cantidad de resultados\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `markets` | array | Array de objetos de mercado |

### `polymarket_get_market`

Obtener detalles de un mercado de predicción específico por ID o slug

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `marketId` | string | No | El ID del mercado. Requerido si no se proporciona el slug. |
| `slug` | string | No | El slug del mercado \(p. ej., "will-trump-win"\). Requerido si no se proporciona marketId. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `market` | object | Objeto de mercado con detalles |

### `polymarket_get_events`

Obtener una lista de eventos de Polymarket con filtrado opcional

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `closed` | string | No | Filtrar por estado cerrado \(true/false\). Use false para mostrar solo eventos activos. |
| `order` | string | No | Campo de ordenación \(p. ej., volume, liquidity, startDate, endDate, createdAt\) |
| `ascending` | string | No | Dirección de ordenación \(true para ascendente, false para descendente\) |
| `tagId` | string | No | Filtrar por ID de etiqueta |
| `limit` | string | No | Número de resultados por página \(máximo 50\) |
| `offset` | string | No | Desplazamiento de paginación \(omitir esta cantidad de resultados\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `events` | array | Array de objetos de eventos |

### `polymarket_get_event`

Obtener detalles de un evento específico por ID o slug

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `eventId` | string | No | El ID del evento. Requerido si no se proporciona el slug. |
| `slug` | string | No | El slug del evento (ej., "2024-presidential-election"). Requerido si no se proporciona eventId. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `event` | object | Objeto de evento con detalles |

### `polymarket_get_tags`

Obtener etiquetas disponibles para filtrar mercados de Polymarket

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Número de resultados por página \(máx 50\) |
| `offset` | string | No | Desplazamiento de paginación \(omitir esta cantidad de resultados\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tags` | array | Array de objetos de etiquetas con id, etiqueta y slug |

### `polymarket_search`

Buscar mercados, eventos y perfiles en Polymarket

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Término de búsqueda |
| `limit` | string | No | Número de resultados por página \(máx 50\) |
| `offset` | string | No | Desplazamiento de paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | object | Resultados de búsqueda que contienen arrays de mercados, eventos y perfiles |

### `polymarket_get_series`

Obtener series (grupos de mercados relacionados) de Polymarket

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Número de resultados por página \(máx 50\) |
| `offset` | string | No | Desplazamiento de paginación \(omitir esta cantidad de resultados\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de series y metadatos |

### `polymarket_get_series_by_id`

Recuperar una serie específica (grupo de mercado relacionado) por ID desde Polymarket

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `seriesId` | string | Sí | El ID de la serie |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de serie y metadatos |

### `polymarket_get_orderbook`

Recuperar el resumen del libro de órdenes para un token específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del libro de órdenes y metadatos |

### `polymarket_get_price`

Recuperar el precio de mercado para un token y lado específicos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |
| `side` | string | Sí | Lado de la orden: compra o venta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de precio de mercado y metadatos |

### `polymarket_get_midpoint`

Recuperar el precio medio para un token específico

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de precio medio y metadatos |

### `polymarket_get_price_history`

Recuperar datos históricos de precios para un token de mercado específico

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |
| `interval` | string | No | Duración que termina en el tiempo actual (1m, 1h, 6h, 1d, 1w, max). Mutuamente excluyente con startTs/endTs. |
| `fidelity` | number | No | Resolución de datos en minutos (por ejemplo, 60 para datos por hora) |
| `startTs` | number | No | Marca de tiempo de inicio (segundos Unix UTC) |
| `endTs` | number | No | Marca de tiempo de fin (segundos Unix UTC) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del historial de precios y metadatos |

### `polymarket_get_last_trade_price`

Recuperar el último precio de operación para un token específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del último precio de operación y metadatos |

### `polymarket_get_spread`

Recuperar el diferencial de oferta y demanda para un token específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del diferencial de compra-venta y metadatos |

### `polymarket_get_tick_size`

Recuperar el tamaño mínimo de tick para un token específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Sí | El ID del token CLOB (de los clobTokenIds del mercado) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del tamaño mínimo de tick y metadatos |

### `polymarket_get_positions`

Recuperar las posiciones del usuario desde Polymarket

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `user` | string | Sí | Dirección de la cartera del usuario |
| `market` | string | No | ID de mercado opcional para filtrar posiciones |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de posiciones y metadatos |

### `polymarket_get_trades`

Recuperar historial de operaciones de Polymarket

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `user` | string | No | Dirección de la cartera del usuario para filtrar operaciones |
| `market` | string | No | ID de mercado para filtrar operaciones |
| `limit` | string | No | Número de resultados por página \(máximo 50\) |
| `offset` | string | No | Desplazamiento de paginación \(omitir esta cantidad de resultados\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `trades` | array | Array de objetos de operaciones |

## Notas

- Categoría: `tools`
- Tipo: `polymarket`
```

--------------------------------------------------------------------------------

````
