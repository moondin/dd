---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 124
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 124 of 933)

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

---[FILE: mailgun.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/mailgun.mdx

```text
---
title: Mailgun
description: Envía correos electrónicos y gestiona listas de correo con Mailgun
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailgun"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailgun](https://www.mailgun.com) es un potente servicio de envío de correos electrónicos diseñado para desarrolladores y empresas que permite enviar, recibir y rastrear correos electrónicos sin esfuerzo. Mailgun te permite aprovechar APIs robustas para correos electrónicos transaccionales y de marketing confiables, gestión flexible de listas de correo y seguimiento avanzado de eventos.

Con el conjunto completo de funciones de Mailgun, puedes automatizar operaciones clave de correo electrónico y monitorear de cerca la entregabilidad y el compromiso de los destinatarios. Esto lo convierte en una solución ideal para la automatización de flujos de trabajo donde las comunicaciones, notificaciones y correos de campaña son partes fundamentales de tus procesos.

Las características principales de Mailgun incluyen:

- **Envío de correos electrónicos transaccionales:** Entrega correos electrónicos de alto volumen como notificaciones de cuenta, recibos, alertas y restablecimientos de contraseña.
- **Contenido de correo electrónico enriquecido:** Envía correos electrónicos tanto en texto plano como en HTML, y utiliza etiquetas para categorizar y rastrear tus mensajes.
- **Gestión de listas de correo:** Crea, actualiza y gestiona listas de correo y miembros para enviar comunicaciones grupales de manera eficiente.
- **Información de dominio:** Obtén detalles sobre tus dominios de envío para monitorear la configuración y el estado.
- **Seguimiento de eventos:** Analiza la entregabilidad y el compromiso del correo electrónico con datos detallados de eventos en los mensajes enviados.
- **Recuperación de mensajes:** Accede a mensajes almacenados para necesidades de cumplimiento, análisis o solución de problemas.

Al integrar Mailgun en Sim, tus agentes pueden enviar correos electrónicos programáticamente, gestionar listas de correo, acceder a información de dominio y monitorear eventos en tiempo real como parte de flujos de trabajo automatizados. Esto permite una participación inteligente y basada en datos con tus usuarios directamente desde tus procesos impulsados por IA.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Mailgun en tu flujo de trabajo. Envía correos electrónicos transaccionales, gestiona listas de correo y miembros, visualiza información de dominio y realiza seguimiento de eventos de correo electrónico. Compatible con correos electrónicos de texto y HTML, etiquetas para seguimiento y gestión integral de listas.

## Herramientas

### `mailgun_send_message`

Enviar un correo electrónico usando la API de Mailgun

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `domain` | string | Sí | Dominio de Mailgun \(ej., mg.example.com\) |
| `from` | string | Sí | Dirección de correo del remitente |
| `to` | string | Sí | Dirección de correo del destinatario \(separados por comas para múltiples\) |
| `subject` | string | Sí | Asunto del correo electrónico |
| `text` | string | No | Cuerpo de texto plano del correo electrónico |
| `html` | string | No | Cuerpo HTML del correo electrónico |
| `cc` | string | No | Dirección de correo CC \(separados por comas para múltiples\) |
| `bcc` | string | No | Dirección de correo BCC \(separados por comas para múltiples\) |
| `tags` | string | No | Etiquetas para el correo electrónico \(separadas por comas\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el mensaje fue enviado con éxito |
| `id` | string | ID del mensaje |
| `message` | string | Mensaje de respuesta de Mailgun |

### `mailgun_get_message`

Recuperar un mensaje almacenado por su clave

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `domain` | string | Sí | Dominio de Mailgun |
| `messageKey` | string | Sí | Clave de almacenamiento del mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la solicitud fue exitosa |
| `recipients` | string | Destinatarios del mensaje |
| `from` | string | Correo electrónico del remitente |
| `subject` | string | Asunto del mensaje |
| `bodyPlain` | string | Cuerpo en texto plano |
| `strippedText` | string | Texto simplificado |
| `strippedSignature` | string | Firma simplificada |
| `bodyHtml` | string | Cuerpo HTML |
| `strippedHtml` | string | HTML simplificado |
| `attachmentCount` | number | Número de archivos adjuntos |
| `timestamp` | number | Marca de tiempo del mensaje |
| `messageHeaders` | json | Encabezados del mensaje |
| `contentIdMap` | json | Mapa de ID de contenido |

### `mailgun_list_messages`

Listar eventos (registros) para mensajes enviados a través de Mailgun

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `domain` | string | Sí | Dominio de Mailgun |
| `event` | string | No | Filtrar por tipo de evento \(accepted, delivered, failed, opened, clicked, etc.\) |
| `limit` | number | No | Número máximo de eventos a devolver \(predeterminado: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la solicitud fue exitosa |
| `items` | json | Array de elementos de eventos |
| `paging` | json | Información de paginación |

### `mailgun_create_mailing_list`

Crear una nueva lista de correo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `address` | string | Sí | Dirección de la lista de correo \(ej., lista@ejemplo.com\) |
| `name` | string | No | Nombre de la lista de correo |
| `description` | string | No | Descripción de la lista de correo |
| `accessLevel` | string | No | Nivel de acceso: readonly, members, o everyone |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la lista fue creada con éxito |
| `message` | string | Mensaje de respuesta |
| `list` | json | Detalles de la lista de correo creada |

### `mailgun_get_mailing_list`

Obtener detalles de una lista de correo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `address` | string | Sí | Dirección de la lista de correo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la solicitud fue exitosa |
| `list` | json | Detalles de la lista de correo |

### `mailgun_add_list_member`

Añadir un miembro a una lista de correo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `listAddress` | string | Sí | Dirección de la lista de correo |
| `address` | string | Sí | Dirección de correo electrónico del miembro |
| `name` | string | No | Nombre del miembro |
| `vars` | string | No | Cadena JSON de variables personalizadas |
| `subscribed` | boolean | No | Si el miembro está suscrito |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el miembro fue añadido con éxito |
| `message` | string | Mensaje de respuesta |
| `member` | json | Detalles del miembro añadido |

### `mailgun_list_domains`

Listar todos los dominios para tu cuenta de Mailgun

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la solicitud fue exitosa |
| `totalCount` | number | Número total de dominios |
| `items` | json | Array de objetos de dominio |

### `mailgun_get_domain`

Obtener detalles de un dominio específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Clave API de Mailgun |
| `domain` | string | Sí | Nombre de dominio |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la solicitud fue exitosa |
| `domain` | json | Detalles del dominio |

## Notas

- Categoría: `tools`
- Tipo: `mailgun`
```

--------------------------------------------------------------------------------

---[FILE: mcp.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/mcp.mdx

```text
---
title: Herramienta MCP
description: Ejecuta herramientas desde servidores de Protocolo de Contexto de Modelo (MCP)
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mcp"
  color="#181C1E"
/>

## Instrucciones de uso

Integra MCP en el flujo de trabajo. Puede ejecutar herramientas desde servidores MCP. Requiere servidores MCP en la configuración del espacio de trabajo.

## Notas

- Categoría: `tools`
- Tipo: `mcp`
```

--------------------------------------------------------------------------------

---[FILE: mem0.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/mem0.mdx

```text
---
title: Mem0
description: Gestión de memoria del agente
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mem0"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mem0](https://mem0.ai) es un potente sistema de gestión de memoria diseñado específicamente para agentes de IA. Proporciona un almacén de memoria persistente y con capacidad de búsqueda que permite a los agentes recordar interacciones pasadas, aprender de experiencias y mantener el contexto a través de conversaciones y ejecuciones de flujos de trabajo.

Con Mem0, puedes:

- **Almacenar memorias del agente**: Guardar historial de conversaciones, preferencias de usuario y contexto importante
- **Recuperar información relevante**: Usar búsqueda semántica para encontrar las interacciones pasadas más relevantes
- **Construir agentes conscientes del contexto**: Permitir que tus agentes hagan referencia a conversaciones pasadas y mantengan la continuidad
- **Personalizar interacciones**: Adaptar respuestas basadas en el historial y preferencias del usuario
- **Implementar memoria a largo plazo**: Crear agentes que aprenden y se adaptan con el tiempo
- **Escalar la gestión de memoria**: Manejar necesidades de memoria para múltiples usuarios y flujos de trabajo complejos

En Sim, la integración con Mem0 permite a tus agentes mantener una memoria persistente a través de las ejecuciones de flujos de trabajo. Esto permite interacciones más naturales y conscientes del contexto donde los agentes pueden recordar conversaciones pasadas, recordar preferencias de usuario y construir sobre interacciones previas. Al conectar Sim con Mem0, puedes crear agentes que se sienten más humanos en su capacidad para recordar y aprender de experiencias pasadas. La integración permite añadir nuevas memorias, buscar memorias existentes semánticamente y recuperar registros específicos de memoria. Esta capacidad de gestión de memoria es esencial para construir agentes sofisticados que puedan mantener el contexto a lo largo del tiempo, personalizar interacciones basadas en el historial del usuario y mejorar continuamente su rendimiento a través del conocimiento acumulado.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Mem0 en el flujo de trabajo. Puede añadir, buscar y recuperar memorias. Requiere clave API.

## Herramientas

### `mem0_add_memories`

Añade recuerdos a Mem0 para almacenamiento persistente y recuperación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Sí | ID de usuario asociado con el recuerdo |
| `messages` | json | Sí | Array de objetos de mensaje con rol y contenido |
| `apiKey` | string | Sí | Tu clave API de Mem0 |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `ids` | array | Array de IDs de recuerdos que fueron creados |
| `memories` | array | Array de objetos de recuerdos que fueron creados |

### `mem0_search_memories`

Busca recuerdos en Mem0 usando búsqueda semántica

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Sí | ID de usuario para buscar recuerdos |
| `query` | string | Sí | Consulta de búsqueda para encontrar recuerdos relevantes |
| `limit` | number | No | Número máximo de resultados a devolver |
| `apiKey` | string | Sí | Tu clave API de Mem0 |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `searchResults` | array | Array de resultados de búsqueda con datos de recuerdos, cada uno contiene id, datos y puntuación |
| `ids` | array | Array de IDs de recuerdos encontrados en los resultados de búsqueda |

### `mem0_get_memories`

Recuperar recuerdos de Mem0 por ID o criterios de filtro

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `userId` | string | Sí | ID de usuario para recuperar recuerdos |
| `memoryId` | string | No | ID específico del recuerdo a recuperar |
| `startDate` | string | No | Fecha de inicio para filtrar por created_at \(formato: AAAA-MM-DD\) |
| `endDate` | string | No | Fecha de fin para filtrar por created_at \(formato: AAAA-MM-DD\) |
| `limit` | number | No | Número máximo de resultados a devolver |
| `apiKey` | string | Sí | Tu clave API de Mem0 |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `memories` | array | Array de objetos de recuerdos recuperados |
| `ids` | array | Array de IDs de recuerdos que fueron recuperados |

## Notas

- Categoría: `tools`
- Tipo: `mem0`
```

--------------------------------------------------------------------------------

---[FILE: memory.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/memory.mdx

```text
---
title: Memoria
description: Añadir almacén de memoria
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="memory"
  color="#F64F9E"
/>

## Instrucciones de uso

Integra la Memoria en el flujo de trabajo. Puede añadir, obtener una memoria, obtener todas las memorias y eliminar memorias.

## Herramientas

### `memory_add`

Añade una nueva memoria a la base de datos o agrega a una memoria existente con el mismo ID.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `conversationId` | string | No | Identificador de conversación (p. ej., user-123, session-abc). Si ya existe una memoria con este conversationId para este bloque, el nuevo mensaje se añadirá a ella. |
| `id` | string | No | Parámetro heredado para el identificador de conversación. Use conversationId en su lugar. Proporcionado para compatibilidad con versiones anteriores. |
| `role` | string | Sí | Rol para la memoria del agente (user, assistant o system) |
| `content` | string | Sí | Contenido para la memoria del agente |
| `blockId` | string | No | ID de bloque opcional. Si no se proporciona, utiliza el ID del bloque actual del contexto de ejecución, o por defecto "default". |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si la memoria se añadió correctamente |
| `memories` | array | Array de objetos de memoria incluyendo la memoria nueva o actualizada |
| `error` | string | Mensaje de error si la operación falló |

### `memory_get`

Recuperar memoria por conversationId, blockId, blockName o una combinación. Devuelve todas las memorias coincidentes.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `conversationId` | string | No | Identificador de conversación (p. ej., user-123, session-abc). Si se proporciona solo, devuelve todas las memorias para esta conversación en todos los bloques. |
| `id` | string | No | Parámetro heredado para el identificador de conversación. Use conversationId en su lugar. Proporcionado para compatibilidad con versiones anteriores. |
| `blockId` | string | No | Identificador de bloque. Si se proporciona solo, devuelve todas las memorias para este bloque en todas las conversaciones. Si se proporciona con conversationId, devuelve las memorias para esa conversación específica en este bloque. |
| `blockName` | string | No | Nombre del bloque. Alternativa a blockId. Si se proporciona solo, devuelve todas las memorias para bloques con este nombre. Si se proporciona con conversationId, devuelve las memorias para esa conversación en bloques con este nombre. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la memoria fue recuperada con éxito |
| `memories` | array | Array de objetos de memoria con campos conversationId, blockId, blockName y data |
| `message` | string | Mensaje de éxito o error |
| `error` | string | Mensaje de error si la operación falló |

### `memory_get_all`

Recuperar todas las memorias de la base de datos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si todas las memorias fueron recuperadas con éxito |
| `memories` | array | Array de todos los objetos de memoria con campos key, conversationId, blockId, blockName y data |
| `message` | string | Mensaje de éxito o error |
| `error` | string | Mensaje de error si la operación falló |

### `memory_delete`

Eliminar memorias por conversationId, blockId, blockName o una combinación. Admite eliminación masiva.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `conversationId` | string | No | Identificador de conversación (p. ej., user-123, session-abc). Si se proporciona solo, elimina todas las memorias para esta conversación en todos los bloques. |
| `id` | string | No | Parámetro heredado para el identificador de conversación. Use conversationId en su lugar. Proporcionado para compatibilidad con versiones anteriores. |
| `blockId` | string | No | Identificador de bloque. Si se proporciona solo, elimina todas las memorias para este bloque en todas las conversaciones. Si se proporciona con conversationId, elimina las memorias para esa conversación específica en este bloque. |
| `blockName` | string | No | Nombre del bloque. Alternativa a blockId. Si se proporciona solo, elimina todas las memorias para bloques con este nombre. Si se proporciona con conversationId, elimina las memorias para esa conversación en bloques con este nombre. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la memoria fue eliminada con éxito |
| `message` | string | Mensaje de éxito o error |
| `error` | string | Mensaje de error si la operación falló |

## Notas

- Categoría: `blocks`
- Tipo: `memory`
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/es/tools/meta.json

```json
{
  "pages": [
    "index",
    "airtable",
    "arxiv",
    "asana",
    "browser_use",
    "clay",
    "confluence",
    "discord",
    "elevenlabs",
    "exa",
    "file",
    "firecrawl",
    "github",
    "gmail",
    "google_calendar",
    "google_docs",
    "google_drive",
    "google_forms",
    "google_search",
    "google_sheets",
    "google_vault",
    "hubspot",
    "huggingface",
    "hunter",
    "image_generator",
    "jina",
    "jira",
    "knowledge",
    "linear",
    "linkup",
    "mem0",
    "memory",
    "microsoft_excel",
    "microsoft_planner",
    "microsoft_teams",
    "mistral_parse",
    "mongodb",
    "mysql",
    "notion",
    "onedrive",
    "openai",
    "outlook",
    "parallel_ai",
    "perplexity",
    "pinecone",
    "pipedrive",
    "postgresql",
    "qdrant",
    "reddit",
    "resend",
    "s3",
    "salesforce",
    "serper",
    "sharepoint",
    "slack",
    "stagehand",
    "stagehand_agent",
    "stripe",
    "supabase",
    "tavily",
    "telegram",
    "thinking",
    "translate",
    "trello",
    "twilio_sms",
    "twilio_voice",
    "typeform",
    "vision",
    "wealthbox",
    "webflow",
    "whatsapp",
    "wikipedia",
    "x",
    "youtube",
    "zep"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/microsoft_excel.mdx

```text
---
title: Microsoft Excel
description: Leer, escribir y actualizar datos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_excel"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/excel) es una potente aplicación de hojas de cálculo que permite la gestión, análisis y visualización de datos. A través de la integración de Microsoft Excel en Sim, puedes leer, escribir y manipular datos de hojas de cálculo de forma programática para satisfacer tus necesidades de automatización de flujos de trabajo.

Con la integración de Microsoft Excel, puedes:

- **Leer datos de hojas de cálculo**: Acceder a datos de rangos, hojas y celdas específicas
- **Escribir y actualizar datos**: Añadir nuevos datos o modificar contenido existente en hojas de cálculo
- **Gestionar tablas**: Crear y manipular estructuras de datos tabulares
- **Manejar múltiples hojas**: Trabajar con varias hojas de trabajo en un libro
- **Procesar datos**: Importar, exportar y transformar datos de hojas de cálculo

En Sim, la integración de Microsoft Excel proporciona acceso fluido a la funcionalidad de hojas de cálculo mediante autenticación OAuth. Puedes leer datos de rangos específicos, escribir nueva información, actualizar celdas existentes y manejar varios formatos de datos. La integración admite operaciones tanto de lectura como de escritura con opciones flexibles de entrada y salida. Esto te permite crear flujos de trabajo que pueden gestionar eficazmente datos de hojas de cálculo, ya sea extrayendo información para análisis, actualizando registros automáticamente o manteniendo la consistencia de datos en todas tus aplicaciones.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Microsoft Excel en el flujo de trabajo. Puede leer, escribir, actualizar, añadir a tablas y crear nuevas hojas de cálculo.

## Herramientas

### `microsoft_excel_read`

Leer datos de una hoja de cálculo de Microsoft Excel

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo de la que leer |
| `range` | string | No | El rango de celdas del que leer. Acepta "NombreHoja!A1:B2" para rangos explícitos o simplemente "NombreHoja" para leer el rango utilizado de esa hoja. Si se omite, lee el rango utilizado de la primera hoja. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | object | Datos del rango de la hoja de cálculo |

### `microsoft_excel_write`

Escribir datos en una hoja de cálculo de Microsoft Excel

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo en la que escribir |
| `range` | string | No | El rango de celdas en el que escribir |
| `values` | array | Sí | Los datos a escribir en la hoja de cálculo |
| `valueInputOption` | string | No | El formato de los datos a escribir |
| `includeValuesInResponse` | boolean | No | Si se deben incluir los valores escritos en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updatedRange` | string | El rango que fue actualizado |
| `updatedRows` | number | Número de filas que fueron actualizadas |
| `updatedColumns` | number | Número de columnas que fueron actualizadas |
| `updatedCells` | number | Número de celdas que fueron actualizadas |
| `metadata` | object | Metadatos de la hoja de cálculo |

### `microsoft_excel_table_add`

Añadir nuevas filas a una tabla de Microsoft Excel

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo que contiene la tabla |
| `tableName` | string | Sí | El nombre de la tabla a la que añadir filas |
| `values` | array | Sí | Los datos para añadir a la tabla \(matriz de matrices o matriz de objetos\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `index` | number | Índice de la primera fila que fue añadida |
| `values` | array | Matriz de filas que fueron añadidas a la tabla |
| `metadata` | object | Metadatos de la hoja de cálculo |

### `microsoft_excel_worksheet_add`

Crear una nueva hoja de cálculo en un libro de Microsoft Excel

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Sí | El ID del libro de Excel al que añadir la hoja de cálculo |
| `worksheetName` | string | Sí | El nombre de la nueva hoja de cálculo. Debe ser único dentro del libro y no puede exceder los 31 caracteres |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `worksheet` | object | Detalles de la hoja de cálculo recién creada |

## Notas

- Categoría: `tools`
- Tipo: `microsoft_excel`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_planner.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/microsoft_planner.mdx

```text
---
title: Microsoft Planner
description: Gestiona tareas, planes y buckets en Microsoft Planner
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_planner"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Planner](https://www.microsoft.com/en-us/microsoft-365/planner) es una herramienta de gestión de tareas que ayuda a los equipos a organizar el trabajo visualmente mediante tableros, tareas y contenedores. Integrado con Microsoft 365, ofrece una forma sencilla e intuitiva de gestionar proyectos en equipo, asignar responsabilidades y seguir el progreso.

Con Microsoft Planner, puedes:

- **Crear y gestionar tareas**: Añadir nuevas tareas con fechas de vencimiento, prioridades y usuarios asignados
- **Organizar con contenedores**: Agrupar tareas por fase, estado o categoría para reflejar el flujo de trabajo de tu equipo
- **Visualizar el estado del proyecto**: Usar tableros, gráficos y filtros para monitorear la carga de trabajo y seguir el progreso
- **Mantener la integración con Microsoft 365**: Conectar sin problemas las tareas con Teams, Outlook y otras herramientas de Microsoft

En Sim, la integración de Microsoft Planner permite a tus agentes crear, leer y gestionar tareas de forma programática como parte de sus flujos de trabajo. Los agentes pueden generar nuevas tareas basadas en solicitudes entrantes, recuperar detalles de tareas para tomar decisiones y seguir el estado de los proyectos, todo sin intervención humana. Ya sea que estés creando flujos de trabajo para la incorporación de clientes, seguimiento de proyectos internos o generación de tareas de seguimiento, la integración de Microsoft Planner con Sim proporciona a tus agentes una forma estructurada de coordinar el trabajo, automatizar la creación de tareas y mantener a los equipos alineados.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Microsoft Planner en el flujo de trabajo. Gestiona tareas, planes, buckets y detalles de tareas incluyendo listas de verificación y referencias.

## Herramientas

### `microsoft_planner_read_task`

Leer tareas de Microsoft Planner - obtener todas las tareas del usuario o todas las tareas de un plan específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `planId` | string | No | El ID del plan del que obtener tareas (si no se proporciona, obtiene todas las tareas del usuario) |
| `taskId` | string | No | El ID de la tarea a obtener |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si las tareas se recuperaron correctamente |
| `tasks` | array | Array de objetos de tarea con propiedades filtradas |
| `metadata` | object | Metadatos que incluyen planId, userId y planUrl |

### `microsoft_planner_create_task`

Crear una nueva tarea en Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Sí | El ID del plan donde se creará la tarea |
| `title` | string | Sí | El título de la tarea |
| `description` | string | No | La descripción de la tarea |
| `dueDateTime` | string | No | La fecha y hora de vencimiento para la tarea (formato ISO 8601) |
| `assigneeUserId` | string | No | El ID del usuario al que asignar la tarea |
| `bucketId` | string | No | El ID del bucket donde colocar la tarea |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si la tarea se creó correctamente |
| `task` | object | El objeto de tarea creado con todas sus propiedades |
| `metadata` | object | Metadatos que incluyen planId, taskId y taskUrl |

### `microsoft_planner_update_task`

Actualizar una tarea en Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Sí | El ID de la tarea a actualizar |
| `etag` | string | Sí | El valor ETag de la tarea a actualizar (encabezado If-Match) |
| `title` | string | No | El nuevo título de la tarea |
| `bucketId` | string | No | El ID del bucket al que mover la tarea |
| `dueDateTime` | string | No | La fecha y hora de vencimiento para la tarea (formato ISO 8601) |
| `startDateTime` | string | No | La fecha y hora de inicio para la tarea (formato ISO 8601) |
| `percentComplete` | number | No | El porcentaje de finalización de la tarea (0-100) |
| `priority` | number | No | La prioridad de la tarea (0-10) |
| `assigneeUserId` | string | No | El ID del usuario al que asignar la tarea |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si la tarea se actualizó correctamente |
| `message` | string | Mensaje de éxito cuando la tarea se actualiza |
| `task` | object | El objeto de tarea actualizado con todas sus propiedades |
| `taskId` | string | ID de la tarea actualizada |
| `etag` | string | Nuevo ETag después de la actualización - úselo para operaciones posteriores |
| `metadata` | object | Metadatos que incluyen taskId, planId y taskUrl |

### `microsoft_planner_delete_task`

Eliminar una tarea de Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Sí | El ID de la tarea a eliminar |
| `etag` | string | Sí | El valor ETag de la tarea a eliminar (encabezado If-Match) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si la tarea se eliminó correctamente |
| `deleted` | boolean | Confirmación de eliminación |
| `metadata` | object | Metadatos adicionales |

### `microsoft_planner_list_plans`

Listar todos los planes compartidos con el usuario actual

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si los planes se recuperaron correctamente |
| `plans` | array | Array de objetos de plan compartidos con el usuario actual |
| `metadata` | object | Metadatos que incluyen userId y count |

### `microsoft_planner_read_plan`

Obtener detalles de un plan específico de Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Sí | El ID del plan a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el plan se recuperó correctamente |
| `plan` | object | El objeto de plan con todas sus propiedades |
| `metadata` | object | Metadatos que incluyen planId y planUrl |

### `microsoft_planner_list_buckets`

Listar todos los buckets en un plan de Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Sí | El ID del plan |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si los buckets se recuperaron correctamente |
| `buckets` | array | Array de objetos bucket |
| `metadata` | object | Metadatos que incluyen planId y count |

### `microsoft_planner_read_bucket`

Obtener detalles de un bucket específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Sí | El ID del bucket a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el bucket se recuperó correctamente |
| `bucket` | object | El objeto bucket con todas sus propiedades |
| `metadata` | object | Metadatos que incluyen bucketId y planId |

### `microsoft_planner_create_bucket`

Crear un nuevo bucket en un plan de Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Sí | El ID del plan donde se creará el bucket |
| `name` | string | Sí | El nombre del bucket |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el bucket se creó correctamente |
| `bucket` | object | El objeto bucket creado con todas sus propiedades |
| `metadata` | object | Metadatos que incluyen bucketId y planId |

### `microsoft_planner_update_bucket`

Actualizar un bucket en Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Sí | El ID del bucket a actualizar |
| `name` | string | No | El nuevo nombre del bucket |
| `etag` | string | Sí | El valor ETag del bucket a actualizar (encabezado If-Match) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el bucket se actualizó correctamente |
| `bucket` | object | El objeto bucket actualizado con todas sus propiedades |
| `metadata` | object | Metadatos que incluyen bucketId y planId |

### `microsoft_planner_delete_bucket`

Eliminar un bucket de Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Sí | El ID del bucket a eliminar |
| `etag` | string | Sí | El valor ETag del bucket a eliminar (encabezado If-Match) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el bucket se eliminó correctamente |
| `deleted` | boolean | Confirmación de eliminación |
| `metadata` | object | Metadatos adicionales |

### `microsoft_planner_get_task_details`

Obtener información detallada sobre una tarea, incluyendo lista de verificación y referencias

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Sí | El ID de la tarea |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si los detalles de la tarea se recuperaron correctamente |
| `taskDetails` | object | Los detalles de la tarea incluyendo descripción, lista de verificación y referencias |
| `etag` | string | El valor ETag para estos detalles de tarea - úselo para operaciones de actualización |
| `metadata` | object | Metadatos incluyendo taskId |

### `microsoft_planner_update_task_details`

Actualizar detalles de la tarea incluyendo descripción, elementos de la lista de verificación y referencias en Microsoft Planner

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Sí | El ID de la tarea |
| `etag` | string | Sí | El valor ETag de los detalles de la tarea a actualizar (encabezado If-Match) |
| `description` | string | No | La descripción de la tarea |
| `checklist` | object | No | Elementos de la lista de verificación como objeto JSON |
| `references` | object | No | Referencias como objeto JSON |
| `previewType` | string | No | Tipo de vista previa: automatic, noPreview, checklist, description, o reference |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si los detalles de la tarea se actualizaron correctamente |
| `taskDetails` | object | El objeto de detalles de la tarea actualizado con todas sus propiedades |
| `metadata` | object | Metadatos incluyendo taskId |

## Notas

- Categoría: `tools`
- Tipo: `microsoft_planner`
```

--------------------------------------------------------------------------------

````
