---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 107
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 107 of 933)

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

---[FILE: apollo.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/apollo.mdx

```text
---
title: Apollo
description: Busca, enriquece y gestiona contactos con Apollo.io
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apollo"
  color="#EBF212"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apollo.io](https://apollo.io/) es una plataforma líder de inteligencia y participación de ventas que permite a los usuarios encontrar, enriquecer e interactuar con contactos y empresas a gran escala. Apollo.io combina una extensa base de datos de contactos con sólidas herramientas de enriquecimiento y automatización de flujos de trabajo, ayudando a los equipos de ventas, marketing y reclutamiento a acelerar el crecimiento.

Con Apollo.io, puedes:

- **Buscar millones de contactos y empresas**: Encuentra leads precisos utilizando filtros avanzados
- **Enriquecer leads y cuentas**: Completa detalles faltantes con datos verificados e información actualizada
- **Gestionar y organizar registros CRM**: Mantén tus datos de personas y empresas precisos y accionables
- **Automatizar el alcance**: Añade contactos a secuencias y crea tareas de seguimiento directamente desde Apollo.io

En Sim, la integración de Apollo.io permite a tus agentes realizar operaciones básicas de Apollo de forma programática:

- **Buscar personas y empresas**: Usa `apollo_people_search` para descubrir nuevos leads utilizando filtros flexibles.
- **Enriquecer datos de personas**: Usa `apollo_people_enrich` para aumentar contactos con información verificada.
- **Enriquecer personas en masa**: Usa `apollo_people_bulk_enrich` para el enriquecimiento a gran escala de múltiples contactos a la vez.
- **Buscar y enriquecer empresas**: Usa `apollo_company_search` y `apollo_company_enrich` para descubrir y actualizar información clave de empresas.

Esto permite a tus agentes construir flujos de trabajo potentes para prospección, enriquecimiento de CRM y automatización sin entrada manual de datos o cambio de pestañas. Integra Apollo.io como una fuente dinámica de datos y motor CRM — capacitando a tus agentes para identificar, calificar y contactar leads sin problemas como parte de sus operaciones diarias.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Apollo.io en el flujo de trabajo. Busca personas y empresas, enriquece datos de contacto, gestiona tus contactos y cuentas de CRM, añade contactos a secuencias y crea tareas.

## Herramientas

### `apollo_people_search`

Buscar en Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `person_titles` | array | No | Títulos de trabajo para buscar (p. ej., ["CEO", "VP of Sales"]) |
| `person_locations` | array | No | Ubicaciones donde buscar (p. ej., ["San Francisco, CA", "New York, NY"]) |
| `person_seniorities` | array | No | Niveles de antigüedad (p. ej., ["senior", "executive", "manager"]) |
| `organization_names` | array | No | Nombres de empresas donde buscar |
| `q_keywords` | string | No | Palabras clave para buscar |
| `page` | number | No | Número de página para paginación (predeterminado: 1) |
| `per_page` | number | No | Resultados por página (predeterminado: 25, máx: 100) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `people` | json | Array de personas que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación incluyendo página, por_página y total_entradas |

### `apollo_people_enrich`

Enriquecer datos de una persona usando Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `first_name` | string | No | Nombre de la persona |
| `last_name` | string | No | Apellido de la persona |
| `email` | string | No | Dirección de correo electrónico de la persona |
| `organization_name` | string | No | Nombre de la empresa donde trabaja la persona |
| `domain` | string | No | Dominio de la empresa (p. ej., apollo.io) |
| `linkedin_url` | string | No | URL del perfil de LinkedIn |
| `reveal_personal_emails` | boolean | No | Revelar direcciones de correo electrónico personales (usa créditos) |
| `reveal_phone_number` | boolean | No | Revelar números de teléfono (usa créditos) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `person` | json | Datos enriquecidos de la persona desde Apollo |
| `metadata` | json | Metadatos de enriquecimiento incluyendo estado de enriquecimiento |

### `apollo_people_bulk_enrich`

Enriquece datos de hasta 10 personas a la vez usando Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `people` | array | Sí | Array de personas para enriquecer \(máximo 10\) |
| `reveal_personal_emails` | boolean | No | Revelar direcciones de correo electrónico personales \(usa créditos\) |
| `reveal_phone_number` | boolean | No | Revelar números de teléfono \(usa créditos\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `people` | json | Array de datos de personas enriquecidos |
| `metadata` | json | Metadatos de enriquecimiento masivo incluyendo recuentos totales y enriquecidos |

### `apollo_organization_search`

Buscar en Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `organization_locations` | array | No | Ubicaciones de empresas para buscar |
| `organization_num_employees_ranges` | array | No | Rangos de número de empleados \(p. ej., \["1-10", "11-50"\]\) |
| `q_organization_keyword_tags` | array | No | Etiquetas de industria o palabras clave |
| `q_organization_name` | string | No | Nombre de la organización a buscar |
| `page` | number | No | Número de página para paginación |
| `per_page` | number | No | Resultados por página \(máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `organizations` | json | Array de organizaciones que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación que incluye page, per_page y total_entries |

### `apollo_organization_enrich`

Enriquecer datos para una sola organización usando Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `organization_name` | string | No | Nombre de la organización \(se requiere al menos uno de organization_name o domain\) |
| `domain` | string | No | Dominio de la empresa \(por ejemplo, apollo.io\) \(se requiere al menos uno de domain u organization_name\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `organization` | json | Datos enriquecidos de la organización desde Apollo |
| `metadata` | json | Metadatos de enriquecimiento que incluyen el estado de enriquecimiento |

### `apollo_organization_bulk_enrich`

Enriquecer datos para hasta 10 organizaciones a la vez usando Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `organizations` | array | Sí | Array de organizaciones para enriquecer \(máximo 10\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `organizations` | json | Array de datos de organizaciones enriquecidos |
| `metadata` | json | Metadatos de enriquecimiento masivo que incluyen recuentos totales y enriquecidos |

### `apollo_contact_create`

Crear un nuevo contacto en tu base de datos de Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `first_name` | string | Sí | Nombre del contacto |
| `last_name` | string | Sí | Apellido del contacto |
| `email` | string | No | Dirección de correo electrónico del contacto |
| `title` | string | No | Cargo laboral |
| `account_id` | string | No | ID de cuenta de Apollo para asociar |
| `owner_id` | string | No | ID de usuario del propietario del contacto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contact` | json | Datos del contacto creado en Apollo |
| `metadata` | json | Metadatos de creación incluyendo estado de creación |

### `apollo_contact_update`

Actualizar un contacto existente en tu base de datos de Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `contact_id` | string | Sí | ID del contacto a actualizar |
| `first_name` | string | No | Nombre del contacto |
| `last_name` | string | No | Apellido del contacto |
| `email` | string | No | Dirección de correo electrónico |
| `title` | string | No | Cargo laboral |
| `account_id` | string | No | ID de cuenta de Apollo |
| `owner_id` | string | No | ID de usuario del propietario del contacto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contact` | json | Datos de contacto actualizados de Apollo |
| `metadata` | json | Metadatos de actualización incluyendo estado actualizado |

### `apollo_contact_search`

Buscar tu equipo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `q_keywords` | string | No | Palabras clave para buscar |
| `contact_stage_ids` | array | No | Filtrar por IDs de etapa de contacto |
| `page` | number | No | Número de página para paginación |
| `per_page` | number | No | Resultados por página \(máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contacts` | json | Array de contactos que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación incluyendo page, per_page y total_entries |

### `apollo_contact_bulk_create`

Crea hasta 100 contactos a la vez en tu base de datos de Apollo. Admite deduplicación para evitar crear contactos duplicados. Se requiere clave maestra.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `contacts` | array | Sí | Array de contactos para crear \(máx 100\). Cada contacto debe incluir first_name, last_name y opcionalmente email, title, account_id, owner_id |
| `run_dedupe` | boolean | No | Habilitar deduplicación para evitar crear contactos duplicados. Cuando es true, los contactos existentes se devuelven sin modificación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `created_contacts` | json | Array de contactos recién creados |
| `existing_contacts` | json | Array de contactos existentes \(cuando la deduplicación está habilitada\) |
| `metadata` | json | Metadatos de creación masiva que incluyen recuentos de contactos creados y existentes |

### `apollo_contact_bulk_update`

Actualiza hasta 100 contactos existentes a la vez en tu base de datos de Apollo. Cada contacto debe incluir un campo id. Se requiere clave maestra.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `contacts` | array | Sí | Array de contactos para actualizar \(máximo 100\). Cada contacto debe incluir campo id, y opcionalmente first_name, last_name, email, title, account_id, owner_id |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updated_contacts` | json | Array de contactos actualizados correctamente |
| `failed_contacts` | json | Array de contactos cuya actualización falló |
| `metadata` | json | Metadatos de actualización masiva que incluyen recuentos de contactos actualizados y fallidos |

### `apollo_account_create`

Crea una nueva cuenta (empresa) en tu base de datos de Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `name` | string | Sí | Nombre de la empresa |
| `website_url` | string | No | URL del sitio web de la empresa |
| `phone` | string | No | Número de teléfono de la empresa |
| `owner_id` | string | No | ID de usuario del propietario de la cuenta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `account` | json | Datos de la cuenta creada desde Apollo |
| `metadata` | json | Metadatos de creación incluyendo el estado de creación |

### `apollo_account_update`

Actualizar una cuenta existente en tu base de datos de Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `account_id` | string | Sí | ID de la cuenta a actualizar |
| `name` | string | No | Nombre de la empresa |
| `website_url` | string | No | URL del sitio web de la empresa |
| `phone` | string | No | Número de teléfono de la empresa |
| `owner_id` | string | No | ID de usuario del propietario de la cuenta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `account` | json | Datos de la cuenta actualizada desde Apollo |
| `metadata` | json | Metadatos de actualización incluyendo el estado de actualización |

### `apollo_account_search`

Buscar en tu equipo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `q_keywords` | string | No | Palabras clave para buscar en los datos de la cuenta |
| `owner_id` | string | No | Filtrar por ID de usuario propietario de la cuenta |
| `account_stage_ids` | array | No | Filtrar por IDs de etapa de cuenta |
| `page` | number | No | Número de página para paginación |
| `per_page` | number | No | Resultados por página \(máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `accounts` | json | Array de cuentas que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación que incluye page, per_page y total_entries |

### `apollo_account_bulk_create`

Crea hasta 100 cuentas a la vez en tu base de datos de Apollo. Nota: Apollo no aplica deduplicación - se pueden crear cuentas duplicadas si las entradas comparten nombres o dominios similares. Se requiere clave maestra.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `accounts` | array | Sí | Array de cuentas para crear \(máximo 100\). Cada cuenta debe incluir name \(obligatorio\), y opcionalmente website_url, phone, owner_id |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `created_accounts` | json | Array de cuentas recién creadas |
| `failed_accounts` | json | Array de cuentas que no se pudieron crear |
| `metadata` | json | Metadatos de creación masiva que incluyen recuentos de cuentas creadas y fallidas |

### `apollo_account_bulk_update`

Actualiza hasta 1000 cuentas existentes a la vez en tu base de datos de Apollo (¡límite más alto que para contactos!). Cada cuenta debe incluir un campo id. Se requiere clave maestra.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `accounts` | array | Sí | Array de cuentas para actualizar \(máximo 1000\). Cada cuenta debe incluir el campo id, y opcionalmente name, website_url, phone, owner_id |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updated_accounts` | json | Array de cuentas actualizadas con éxito |
| `failed_accounts` | json | Array de cuentas que no se pudieron actualizar |
| `metadata` | json | Metadatos de actualización masiva que incluyen recuentos de cuentas actualizadas y fallidas |

### `apollo_opportunity_create`

Crear una nueva oportunidad para una cuenta en tu base de datos de Apollo (se requiere clave maestra)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `name` | string | Sí | Nombre de la oportunidad/negocio |
| `account_id` | string | Sí | ID de la cuenta a la que pertenece esta oportunidad |
| `amount` | number | No | Valor monetario de la oportunidad |
| `stage_id` | string | No | ID de la etapa del negocio |
| `owner_id` | string | No | ID de usuario del propietario de la oportunidad |
| `close_date` | string | No | Fecha de cierre prevista \(formato ISO 8601\) |
| `description` | string | No | Descripción o notas sobre la oportunidad |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `opportunity` | json | Datos de la oportunidad creada desde Apollo |
| `metadata` | json | Metadatos de creación que incluyen el estado de creación |

### `apollo_opportunity_search`

Buscar y listar todas las oportunidades/negocios en tu equipo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `q_keywords` | string | No | Palabras clave para buscar en nombres de oportunidades |
| `account_ids` | array | No | Filtrar por IDs de cuentas específicas |
| `stage_ids` | array | No | Filtrar por IDs de etapas de negocio |
| `owner_ids` | array | No | Filtrar por IDs de propietarios de oportunidades |
| `page` | number | No | Número de página para paginación |
| `per_page` | number | No | Resultados por página \(máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `opportunities` | json | Array de oportunidades que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación incluyendo página, por_página y total_entradas |

### `apollo_opportunity_get`

Recuperar detalles completos de un negocio/oportunidad específico por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `opportunity_id` | string | Sí | ID de la oportunidad a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `opportunity` | json | Datos completos de la oportunidad desde Apollo |
| `metadata` | json | Metadatos de recuperación incluyendo estado de búsqueda |

### `apollo_opportunity_update`

Actualizar un negocio/oportunidad existente en tu base de datos de Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo |
| `opportunity_id` | string | Sí | ID de la oportunidad a actualizar |
| `name` | string | No | Nombre de la oportunidad/acuerdo |
| `amount` | number | No | Valor monetario de la oportunidad |
| `stage_id` | string | No | ID de la etapa del acuerdo |
| `owner_id` | string | No | ID de usuario del propietario de la oportunidad |
| `close_date` | string | No | Fecha prevista de cierre (formato ISO 8601) |
| `description` | string | No | Descripción o notas sobre la oportunidad |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `opportunity` | json | Datos actualizados de la oportunidad desde Apollo |
| `metadata` | json | Metadatos de actualización incluyendo estado actualizado |

### `apollo_sequence_search`

Buscar secuencias/campañas en tu equipo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo (se requiere clave maestra) |
| `q_name` | string | No | Buscar secuencias por nombre |
| `active` | boolean | No | Filtrar por estado activo (true para secuencias activas, false para inactivas) |
| `page` | number | No | Número de página para paginación |
| `per_page` | number | No | Resultados por página (máx: 100) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `sequences` | json | Array de secuencias/campañas que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación que incluye página, por_página y total_entradas |

### `apollo_sequence_add_contacts`

Añadir contactos a una secuencia de Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `sequence_id` | string | Sí | ID de la secuencia a la que añadir contactos |
| `contact_ids` | array | Sí | Array de IDs de contactos para añadir a la secuencia |
| `emailer_campaign_id` | string | No | ID de campaña de correo electrónico opcional |
| `send_email_from_user_id` | string | No | ID de usuario desde el que enviar correos electrónicos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contacts_added` | json | Array de IDs de contactos añadidos a la secuencia |
| `metadata` | json | Metadatos de la secuencia que incluyen sequence_id y recuento total_añadidos |

### `apollo_task_create`

Crear una nueva tarea en Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `note` | string | Sí | Nota/descripción de la tarea |
| `contact_id` | string | No | ID de contacto para asociar |
| `account_id` | string | No | ID de cuenta para asociar |
| `due_at` | string | No | Fecha de vencimiento en formato ISO |
| `priority` | string | No | Prioridad de la tarea |
| `type` | string | No | Tipo de tarea |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `task` | json | Datos de la tarea creada desde Apollo |
| `metadata` | json | Metadatos de creación incluyendo el estado de creación |

### `apollo_task_search`

Buscar tareas en Apollo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |
| `contact_id` | string | No | Filtrar por ID de contacto |
| `account_id` | string | No | Filtrar por ID de cuenta |
| `completed` | boolean | No | Filtrar por estado de finalización |
| `page` | number | No | Número de página para paginación |
| `per_page` | number | No | Resultados por página \(máx: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tasks` | json | Array de tareas que coinciden con los criterios de búsqueda |
| `metadata` | json | Información de paginación incluyendo página, por_página y total_entradas |

### `apollo_email_accounts`

Obtener lista de equipo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Apollo \(se requiere clave maestra\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `email_accounts` | json | Array de cuentas de correo electrónico del equipo vinculadas en Apollo |
| `metadata` | json | Metadatos incluyendo el recuento total de cuentas de correo electrónico |

## Notas

- Categoría: `tools`
- Tipo: `apollo`
```

--------------------------------------------------------------------------------

---[FILE: arxiv.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/arxiv.mdx

```text
---
title: ArXiv
description: Busca y recupera artículos académicos de ArXiv
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="arxiv"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[ArXiv](https://arxiv.org/) es un repositorio gratuito de acceso abierto de artículos científicos en campos como física, matemáticas, informática, biología cuantitativa, finanzas cuantitativas, estadística, ingeniería eléctrica, ciencias de sistemas y economía. ArXiv proporciona una amplia colección de preprints y artículos publicados, convirtiéndolo en un recurso primario para investigadores y profesionales de todo el mundo.

Con ArXiv, puedes:

- **Buscar artículos académicos**: Encuentra investigaciones por palabras clave, nombres de autores, títulos, categorías y más
- **Recuperar metadatos de artículos**: Accede a resúmenes, listas de autores, fechas de publicación y otra información bibliográfica
- **Descargar PDFs completos**: Obtén el texto completo de la mayoría de los artículos para un estudio en profundidad
- **Explorar contribuciones de autores**: Visualiza todos los artículos de un autor específico
- **Mantenerte actualizado**: Descubre las últimas publicaciones y temas tendencia en tu campo

En Sim, la integración con ArXiv permite a tus agentes buscar, recuperar y analizar artículos científicos de ArXiv de forma programática. Esto te permite automatizar revisiones de literatura, crear asistentes de investigación o incorporar conocimiento científico actualizado en tus flujos de trabajo con agentes. Utiliza ArXiv como una fuente dinámica de datos para investigación, descubrimiento y extracción de conocimiento dentro de tus proyectos de Sim.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra ArXiv en el flujo de trabajo. Puede buscar artículos, obtener detalles de artículos y obtener artículos de autores. No requiere OAuth ni una clave API.

## Herramientas

### `arxiv_search`

Busca artículos académicos en ArXiv por palabras clave, autores, títulos u otros campos.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `searchQuery` | string | Sí | La consulta de búsqueda a ejecutar |
| `searchField` | string | No | Campo en el que buscar: all (todos), ti (título), au (autor), abs (resumen), co (comentario), jr (revista), cat (categoría), rn (número de informe) |
| `maxResults` | number | No | Número máximo de resultados a devolver (predeterminado: 10, máximo: 2000) |
| `sortBy` | string | No | Ordenar por: relevance (relevancia), lastUpdatedDate (fecha de última actualización), submittedDate (fecha de envío) (predeterminado: relevance) |
| `sortOrder` | string | No | Orden de clasificación: ascending (ascendente), descending (descendente) (predeterminado: descending) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `papers` | json | Array de artículos que coinciden con la consulta de búsqueda |

### `arxiv_get_paper`

Obtén información detallada sobre un artículo específico de ArXiv mediante su ID.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `paperId` | string | Sí | ID del artículo de ArXiv (p. ej., "1706.03762") |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `paper` | json | Información detallada sobre el artículo de ArXiv solicitado |

### `arxiv_get_author_papers`

Busca artículos de un autor específico en ArXiv.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `authorName` | string | Sí | Nombre del autor a buscar |
| `maxResults` | number | No | Número máximo de resultados a devolver (predeterminado: 10, máximo: 2000) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `authorPapers` | json | Array de artículos escritos por el autor especificado |

## Notas

- Categoría: `tools`
- Tipo: `arxiv`
```

--------------------------------------------------------------------------------

---[FILE: asana.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/asana.mdx

```text
---
title: Asana
description: Interactúa con Asana
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="asana"
  color="#E0E0E0"
/>

## Instrucciones de uso

Integra Asana en el flujo de trabajo. Puede leer, escribir y actualizar tareas.

## Herramientas

### `asana_get_task`

Recupera una tarea individual por GID u obtén múltiples tareas con filtros

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `taskGid` | string | No | El identificador único global \(GID\) de la tarea. Si no se proporciona, obtendrá múltiples tareas. |
| `workspace` | string | No | GID del espacio de trabajo para filtrar tareas \(requerido cuando no se usa taskGid\) |
| `project` | string | No | GID del proyecto para filtrar tareas |
| `limit` | number | No | Número máximo de tareas a devolver \(predeterminado: 50\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `ts` | string | Marca de tiempo de la respuesta |
| `gid` | string | Identificador único global de la tarea |
| `resource_type` | string | Tipo de recurso \(tarea\) |
| `resource_subtype` | string | Subtipo de recurso |
| `name` | string | Nombre de la tarea |
| `notes` | string | Notas o descripción de la tarea |
| `completed` | boolean | Si la tarea está completada |
| `assignee` | object | Detalles del asignado |

### `asana_create_task`

Crear una nueva tarea en Asana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Sí | GID del espacio de trabajo donde se creará la tarea |
| `name` | string | Sí | Nombre de la tarea |
| `notes` | string | No | Notas o descripción para la tarea |
| `assignee` | string | No | GID del usuario al que se asignará la tarea |
| `due_on` | string | No | Fecha de vencimiento en formato AAAA-MM-DD |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `ts` | string | Marca de tiempo de la respuesta |
| `gid` | string | Identificador único global de la tarea |
| `name` | string | Nombre de la tarea |
| `notes` | string | Notas o descripción de la tarea |
| `completed` | boolean | Si la tarea está completada |
| `created_at` | string | Marca de tiempo de creación de la tarea |
| `permalink_url` | string | URL a la tarea en Asana |

### `asana_update_task`

Actualizar una tarea existente en Asana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | Sí | El identificador único global (GID) de la tarea a actualizar |
| `name` | string | No | Nombre actualizado para la tarea |
| `notes` | string | No | Notas o descripción actualizadas para la tarea |
| `assignee` | string | No | GID del usuario asignado actualizado |
| `completed` | boolean | No | Marcar tarea como completada o no completada |
| `due_on` | string | No | Fecha de vencimiento actualizada en formato AAAA-MM-DD |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `ts` | string | Marca de tiempo de la respuesta |
| `gid` | string | Identificador único global de la tarea |
| `name` | string | Nombre de la tarea |
| `notes` | string | Notas o descripción de la tarea |
| `completed` | boolean | Si la tarea está completada |
| `modified_at` | string | Marca de tiempo de última modificación de la tarea |

### `asana_get_projects`

Recuperar todos los proyectos de un espacio de trabajo de Asana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Sí | GID del espacio de trabajo del que recuperar los proyectos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `ts` | string | Marca de tiempo de la respuesta |
| `projects` | array | Array de proyectos |

### `asana_search_tasks`

Buscar tareas en un espacio de trabajo de Asana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Sí | GID del espacio de trabajo donde buscar tareas |
| `text` | string | No | Texto a buscar en los nombres de las tareas |
| `assignee` | string | No | Filtrar tareas por GID del usuario asignado |
| `projects` | array | No | Array de GIDs de proyectos para filtrar tareas |
| `completed` | boolean | No | Filtrar por estado de finalización |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `ts` | string | Marca de tiempo de la respuesta |
| `tasks` | array | Array de tareas coincidentes |

### `asana_add_comment`

Añadir un comentario (historia) a una tarea de Asana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `taskGid` | string | Sí | El identificador único global \(GID\) de la tarea |
| `text` | string | Sí | El contenido de texto del comentario |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `ts` | string | Marca de tiempo de la respuesta |
| `gid` | string | Identificador único global del comentario |
| `text` | string | Contenido de texto del comentario |
| `created_at` | string | Marca de tiempo de creación del comentario |
| `created_by` | object | Detalles del autor del comentario |

## Notas

- Categoría: `tools`
- Tipo: `asana`
```

--------------------------------------------------------------------------------

---[FILE: browser_use.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/browser_use.mdx

```text
---
title: Uso del navegador
description: Ejecutar tareas de automatización del navegador
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="browser_use"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[BrowserUse](https://browser-use.com/) es una potente plataforma de automatización de navegador que te permite crear y ejecutar tareas de navegador de forma programática. Proporciona una manera de automatizar interacciones web mediante instrucciones en lenguaje natural, permitiéndote navegar por sitios web, completar formularios, extraer datos y realizar secuencias complejas de acciones sin escribir código.

Con BrowserUse, puedes:

- **Automatizar interacciones web**: Navegar a sitios web, hacer clic en botones, completar formularios y realizar otras acciones de navegador
- **Extraer datos**: Obtener contenido de sitios web, incluyendo texto, imágenes y datos estructurados
- **Ejecutar flujos de trabajo complejos**: Encadenar múltiples acciones para completar tareas web sofisticadas
- **Monitorear la ejecución de tareas**: Observar la ejecución de tareas de navegador en tiempo real con retroalimentación visual
- **Procesar resultados programáticamente**: Recibir salidas estructuradas de tareas de automatización web

En Sim, la integración de BrowserUse permite a tus agentes interactuar con la web como si fueran usuarios humanos. Esto posibilita escenarios como investigación, recopilación de datos, envío de formularios y pruebas web, todo a través de simples instrucciones en lenguaje natural. Tus agentes pueden recopilar información de sitios web, interactuar con aplicaciones web y realizar acciones que normalmente requerirían navegación manual, ampliando sus capacidades para incluir toda la web como recurso.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra el uso del navegador en el flujo de trabajo. Puede navegar por la web y realizar acciones como si un usuario real estuviera interactuando con el navegador. Requiere clave API.

## Herramientas

### `browser_use_run_task`

Ejecuta una tarea de automatización de navegador usando BrowserUse

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `task` | string | Sí | Qué debe hacer el agente de navegador |
| `variables` | json | No | Variables opcionales para usar como secretos \(formato: \{key: value\}\) |
| `format` | string | No | Sin descripción |
| `save_browser_data` | boolean | No | Si se deben guardar los datos del navegador |
| `model` | string | No | Modelo LLM a utilizar \(predeterminado: gpt-4o\) |
| `apiKey` | string | Sí | Clave API para la API de BrowserUse |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | Identificador de ejecución de tarea |
| `success` | boolean | Estado de finalización de tarea |
| `output` | json | Datos de salida de la tarea |
| `steps` | json | Pasos de ejecución realizados |

## Notas

- Categoría: `tools`
- Tipo: `browser_use`
```

--------------------------------------------------------------------------------

````
