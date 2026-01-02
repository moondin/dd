---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 125
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 125 of 933)

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

---[FILE: microsoft_teams.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/microsoft_teams.mdx

```text
---
title: Microsoft Teams
description: Gestionar mensajes, reacciones y miembros en Teams
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_teams"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://teams.microsoft.com) es una robusta plataforma de comunicación y colaboración que permite a los usuarios participar en mensajería en tiempo real, reuniones y compartir contenido dentro de equipos y organizaciones. Como parte del ecosistema de productividad de Microsoft, Microsoft Teams ofrece una funcionalidad de chat perfectamente integrada con Office 365, permitiendo a los usuarios publicar mensajes, coordinar trabajo y mantenerse conectados a través de dispositivos y flujos de trabajo.

Con Microsoft Teams, puedes:

- **Enviar y recibir mensajes**: Comunícate instantáneamente con individuos o grupos en hilos de chat  
- **Colaborar en tiempo real**: Comparte actualizaciones e información entre equipos dentro de canales y chats  
- **Organizar conversaciones**: Mantén el contexto con discusiones encadenadas e historial de chat persistente  
- **Compartir archivos y contenido**: Adjunta y visualiza documentos, imágenes y enlaces directamente en el chat  
- **Integrar con Microsoft 365**: Conéctate perfectamente con Outlook, SharePoint, OneDrive y más  
- **Acceder desde varios dispositivos**: Usa Teams en escritorio, web y móvil con conversaciones sincronizadas en la nube  
- **Comunicación segura**: Aprovecha las funciones de seguridad y cumplimiento de nivel empresarial

En Sim, la integración con Microsoft Teams permite a tus agentes interactuar directamente con los mensajes de chat de forma programática. Esto permite potentes escenarios de automatización como enviar actualizaciones, publicar alertas, coordinar tareas y responder a conversaciones en tiempo real. Tus agentes pueden escribir nuevos mensajes en chats o canales, actualizar contenido basado en datos de flujo de trabajo e interactuar con usuarios donde ocurre la colaboración. Al integrar Sim con Microsoft Teams, reduces la brecha entre flujos de trabajo inteligentes y comunicación de equipo, permitiendo a tus agentes agilizar la colaboración, automatizar tareas de comunicación y mantener a tus equipos alineados.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Microsoft Teams en el flujo de trabajo. Lee, escribe, actualiza y elimina mensajes de chat y canal. Responde a mensajes, añade reacciones y lista miembros de equipos/canales. Se puede usar en modo disparador para iniciar un flujo de trabajo cuando se envía un mensaje a un chat o canal. Para mencionar usuarios en mensajes, envuelve su nombre en etiquetas `<at>`: `<at>userName</at>`

## Herramientas

### `microsoft_teams_read_chat`

Leer contenido de un chat de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Sí | El ID del chat del que leer |
| `includeAttachments` | boolean | No | Descargar e incluir archivos adjuntos de mensajes \(contenidos alojados\) en el almacenamiento |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación de lectura del chat de Teams |
| `messageCount` | number | Número de mensajes recuperados del chat |
| `chatId` | string | ID del chat del que se leyó |
| `messages` | array | Array de objetos de mensajes de chat |
| `attachmentCount` | number | Número total de archivos adjuntos encontrados |
| `attachmentTypes` | array | Tipos de archivos adjuntos encontrados |
| `content` | string | Contenido formateado de los mensajes de chat |
| `attachments` | file[] | Archivos adjuntos subidos para mayor comodidad \(aplanados\) |

### `microsoft_teams_write_chat`

Escribir o actualizar contenido en un chat de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Sí | El ID del chat en el que escribir |
| `content` | string | Sí | El contenido para escribir en el mensaje |
| `files` | file[] | No | Archivos para adjuntar al mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito del envío del mensaje de chat de Teams |
| `messageId` | string | Identificador único para el mensaje enviado |
| `chatId` | string | ID del chat donde se envió el mensaje |
| `createdTime` | string | Marca de tiempo cuando se creó el mensaje |
| `url` | string | URL web del mensaje |
| `updatedContent` | boolean | Si el contenido se actualizó correctamente |

### `microsoft_teams_read_channel`

Leer contenido de un canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo del que leer |
| `channelId` | string | Sí | El ID del canal del que leer |
| `includeAttachments` | boolean | No | Descargar e incluir archivos adjuntos de mensajes \(contenidos alojados\) en el almacenamiento |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación de lectura del canal de Teams |
| `messageCount` | number | Número de mensajes recuperados del canal |
| `teamId` | string | ID del equipo del que se leyó |
| `channelId` | string | ID del canal del que se leyó |
| `messages` | array | Array de objetos de mensajes del canal |
| `attachmentCount` | number | Número total de archivos adjuntos encontrados |
| `attachmentTypes` | array | Tipos de archivos adjuntos encontrados |
| `content` | string | Contenido formateado de los mensajes del canal |
| `attachments` | file[] | Archivos adjuntos subidos para mayor comodidad \(aplanados\) |

### `microsoft_teams_write_channel`

Escribir o enviar un mensaje a un canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo en el que escribir |
| `channelId` | string | Sí | El ID del canal en el que escribir |
| `content` | string | Sí | El contenido para escribir en el canal |
| `files` | file[] | No | Archivos para adjuntar al mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito del envío del mensaje al canal de Teams |
| `messageId` | string | Identificador único para el mensaje enviado |
| `teamId` | string | ID del equipo donde se envió el mensaje |
| `channelId` | string | ID del canal donde se envió el mensaje |
| `createdTime` | string | Marca de tiempo cuando se creó el mensaje |
| `url` | string | URL web del mensaje |
| `updatedContent` | boolean | Si el contenido se actualizó correctamente |

### `microsoft_teams_update_chat_message`

Actualizar un mensaje existente en un chat de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Sí | El ID del chat que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a actualizar |
| `content` | string | Sí | El nuevo contenido para el mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la actualización fue exitosa |
| `messageId` | string | ID del mensaje actualizado |
| `updatedContent` | boolean | Si el contenido se actualizó correctamente |

### `microsoft_teams_update_channel_message`

Actualizar un mensaje existente en un canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo |
| `channelId` | string | Sí | El ID del canal que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a actualizar |
| `content` | string | Sí | El nuevo contenido para el mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la actualización fue exitosa |
| `messageId` | string | ID del mensaje actualizado |
| `updatedContent` | boolean | Si el contenido se actualizó correctamente |

### `microsoft_teams_delete_chat_message`

Eliminar de forma suave un mensaje en un chat de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Sí | El ID del chat que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la eliminación fue exitosa |
| `deleted` | boolean | Confirmación de eliminación |
| `messageId` | string | ID del mensaje eliminado |

### `microsoft_teams_delete_channel_message`

Eliminar de forma suave un mensaje en un canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo |
| `channelId` | string | Sí | El ID del canal que contiene el mensaje |
| `messageId` | string | Sí | El ID del mensaje a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la eliminación fue exitosa |
| `deleted` | boolean | Confirmación de eliminación |
| `messageId` | string | ID del mensaje eliminado |

### `microsoft_teams_reply_to_message`

Responder a un mensaje existente en un canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo |
| `channelId` | string | Sí | El ID del canal |
| `messageId` | string | Sí | El ID del mensaje al que responder |
| `content` | string | Sí | El contenido de la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la respuesta fue exitosa |
| `messageId` | string | ID del mensaje de respuesta |
| `updatedContent` | boolean | Si el contenido se envió correctamente |

### `microsoft_teams_get_message`

Obtener un mensaje específico de un chat o canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | No | El ID del equipo \(para mensajes de canal\) |
| `channelId` | string | No | El ID del canal \(para mensajes de canal\) |
| `chatId` | string | No | El ID del chat \(para mensajes de chat\) |
| `messageId` | string | Sí | El ID del mensaje a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la recuperación fue exitosa |
| `content` | string | El contenido del mensaje |
| `metadata` | object | Metadatos del mensaje incluyendo remitente, marca de tiempo, etc. |

### `microsoft_teams_set_reaction`

Añadir una reacción con emoji a un mensaje en Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | No | El ID del equipo \(para mensajes de canal\) |
| `channelId` | string | No | El ID del canal \(para mensajes de canal\) |
| `chatId` | string | No | El ID del chat \(para mensajes de chat\) |
| `messageId` | string | Sí | El ID del mensaje al que reaccionar |
| `reactionType` | string | Sí | La reacción con emoji \(p. ej., ❤️, 👍, 😊\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la reacción se añadió correctamente |
| `reactionType` | string | El emoji que se añadió |
| `messageId` | string | ID del mensaje |

### `microsoft_teams_unset_reaction`

Eliminar una reacción con emoji de un mensaje en Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | No | El ID del equipo \(para mensajes de canal\) |
| `channelId` | string | No | El ID del canal \(para mensajes de canal\) |
| `chatId` | string | No | El ID del chat \(para mensajes de chat\) |
| `messageId` | string | Sí | El ID del mensaje |
| `reactionType` | string | Sí | La reacción con emoji a eliminar \(p. ej., ❤️, 👍, 😊\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la reacción se eliminó correctamente |
| `reactionType` | string | El emoji que fue eliminado |
| `messageId` | string | ID del mensaje |

### `microsoft_teams_list_team_members`

Listar todos los miembros de un equipo de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el listado fue exitoso |
| `members` | array | Array de miembros del equipo |
| `memberCount` | number | Número total de miembros |

### `microsoft_teams_list_channel_members`

Listar todos los miembros de un canal de Microsoft Teams

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Sí | El ID del equipo |
| `channelId` | string | Sí | El ID del canal |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el listado fue exitoso |
| `members` | array | Array de miembros del canal |
| `memberCount` | number | Número total de miembros |

## Notas

- Categoría: `tools`
- Tipo: `microsoft_teams`
```

--------------------------------------------------------------------------------

---[FILE: mistral_parse.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/mistral_parse.mdx

```text
---
title: Mistral Parser
description: Extraer texto de documentos PDF
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mistral_parse"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
La herramienta Mistral Parse proporciona una forma potente de extraer y procesar contenido de documentos PDF utilizando la [API de OCR de Mistral](https://mistral.ai/). Esta herramienta aprovecha el reconocimiento óptico de caracteres avanzado para extraer con precisión texto y estructura de archivos PDF, facilitando la incorporación de datos de documentos en los flujos de trabajo de tus agentes.

Con la herramienta Mistral Parse, puedes:

- **Extraer texto de PDFs**: Convertir con precisión el contenido de PDF a formatos de texto, markdown o JSON
- **Procesar PDFs desde URLs**: Extraer directamente contenido de PDFs alojados en línea proporcionando sus URLs
- **Mantener la estructura del documento**: Preservar el formato, tablas y diseño de los PDFs originales
- **Extraer imágenes**: Incluir opcionalmente imágenes incrustadas de los PDFs
- **Seleccionar páginas específicas**: Procesar solo las páginas que necesitas de documentos de múltiples páginas

La herramienta Mistral Parse es particularmente útil para escenarios donde tus agentes necesitan trabajar con contenido PDF, como analizar informes, extraer datos de formularios o procesar texto de documentos escaneados. Simplifica el proceso de hacer que el contenido PDF esté disponible para tus agentes, permitiéndoles trabajar con información almacenada en PDFs tan fácilmente como con entrada de texto directa.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Mistral Parse en el flujo de trabajo. Puede extraer texto de documentos PDF cargados o de una URL. Requiere clave API.

## Herramientas

### `mistral_parser`

Analizar documentos PDF utilizando la API de OCR de Mistral

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `filePath` | string | Sí | URL a un documento PDF para ser procesado |
| `fileUpload` | object | No | Datos de carga de archivo desde el componente de carga de archivos |
| `resultType` | string | No | Tipo de resultado analizado \(markdown, texto o json\). Por defecto es markdown. |
| `includeImageBase64` | boolean | No | Incluir imágenes codificadas en base64 en la respuesta |
| `pages` | array | No | Páginas específicas para procesar \(array de números de página, comenzando desde 0\) |
| `imageLimit` | number | No | Número máximo de imágenes para extraer del PDF |
| `imageMinSize` | number | No | Altura y anchura mínimas de las imágenes para extraer del PDF |
| `apiKey` | string | Sí | Clave API de Mistral \(MISTRAL_API_KEY\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el PDF se analizó correctamente |
| `content` | string | Contenido extraído en el formato solicitado \(markdown, texto o JSON\) |
| `metadata` | object | Metadatos de procesamiento que incluyen jobId, fileType, pageCount e información de uso |

## Notas

- Categoría: `tools`
- Tipo: `mistral_parse`
```

--------------------------------------------------------------------------------

---[FILE: mongodb.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/mongodb.mdx

```text
---
title: MongoDB
description: Conectar a la base de datos MongoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mongodb"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
La herramienta [MongoDB](https://www.mongodb.com/) te permite conectarte a una base de datos MongoDB y realizar una amplia gama de operaciones orientadas a documentos directamente dentro de tus flujos de trabajo con agentes. Con una configuración flexible y una gestión segura de conexiones, puedes interactuar fácilmente con tus datos y manipularlos.

Con la herramienta MongoDB, puedes:

- **Encontrar documentos**: Consultar colecciones y recuperar documentos con la operación `mongodb_query` utilizando filtros de consulta avanzados.
- **Insertar documentos**: Añadir uno o varios documentos a una colección utilizando la operación `mongodb_insert`.
- **Actualizar documentos**: Modificar documentos existentes con la operación `mongodb_update` especificando criterios de filtro y acciones de actualización.
- **Eliminar documentos**: Eliminar documentos de una colección utilizando la operación `mongodb_delete`, especificando filtros y opciones de eliminación.
- **Agregar datos**: Ejecutar pipelines de agregación complejos con la operación `mongodb_execute` para transformar y analizar tus datos.

La herramienta MongoDB es ideal para flujos de trabajo donde tus agentes necesitan gestionar o analizar datos estructurados basados en documentos. Ya sea procesando contenido generado por usuarios, gestionando datos de aplicaciones o impulsando análisis, la herramienta MongoDB simplifica el acceso y la manipulación de tus datos de manera segura y programática.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra MongoDB en el flujo de trabajo. Puede encontrar, insertar, actualizar, eliminar y agregar datos.

## Herramientas

### `mongodb_query`

Ejecutar operación de búsqueda en colección de MongoDB

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MongoDB |
| `port` | number | Sí | Puerto del servidor MongoDB \(predeterminado: 27017\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | No | Nombre de usuario de MongoDB |
| `password` | string | No | Contraseña de MongoDB |
| `authSource` | string | No | Base de datos de autenticación |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `collection` | string | Sí | Nombre de la colección a consultar |
| `query` | string | No | Filtro de consulta MongoDB como cadena JSON |
| `limit` | number | No | Número máximo de documentos a devolver |
| `sort` | string | No | Criterios de ordenación como cadena JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `documents` | array | Array de documentos devueltos por la consulta |
| `documentCount` | number | Número de documentos devueltos |

### `mongodb_insert`

Insertar documentos en colección de MongoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MongoDB |
| `port` | number | Sí | Puerto del servidor MongoDB \(predeterminado: 27017\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | No | Nombre de usuario de MongoDB |
| `password` | string | No | Contraseña de MongoDB |
| `authSource` | string | No | Base de datos de autenticación |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `collection` | string | Sí | Nombre de la colección en la que insertar |
| `documents` | array | Sí | Array de documentos a insertar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `documentCount` | number | Número de documentos insertados |
| `insertedId` | string | ID del documento insertado \(inserción única\) |
| `insertedIds` | array | Array de IDs de documentos insertados \(inserción múltiple\) |

### `mongodb_update`

Actualizar documentos en colección de MongoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MongoDB |
| `port` | number | Sí | Puerto del servidor MongoDB \(predeterminado: 27017\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | No | Nombre de usuario de MongoDB |
| `password` | string | No | Contraseña de MongoDB |
| `authSource` | string | No | Base de datos de autenticación |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `collection` | string | Sí | Nombre de la colección a actualizar |
| `filter` | string | Sí | Criterios de filtro como cadena JSON |
| `update` | string | Sí | Operaciones de actualización como cadena JSON |
| `upsert` | boolean | No | Crear documento si no se encuentra |
| `multi` | boolean | No | Actualizar múltiples documentos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `matchedCount` | number | Número de documentos que coinciden con el filtro |
| `modifiedCount` | number | Número de documentos modificados |
| `documentCount` | number | Número total de documentos afectados |
| `insertedId` | string | ID del documento insertado \(si hay upsert\) |

### `mongodb_delete`

Eliminar documentos de una colección de MongoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MongoDB |
| `port` | number | Sí | Puerto del servidor MongoDB \(predeterminado: 27017\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | No | Nombre de usuario de MongoDB |
| `password` | string | No | Contraseña de MongoDB |
| `authSource` | string | No | Base de datos de autenticación |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `collection` | string | Sí | Nombre de la colección de donde eliminar |
| `filter` | string | Sí | Criterios de filtro como cadena JSON |
| `multi` | boolean | No | Eliminar múltiples documentos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `deletedCount` | number | Número de documentos eliminados |
| `documentCount` | number | Número total de documentos afectados |

### `mongodb_execute`

Ejecutar pipeline de agregación de MongoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MongoDB |
| `port` | number | Sí | Puerto del servidor MongoDB \(predeterminado: 27017\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | No | Nombre de usuario de MongoDB |
| `password` | string | No | Contraseña de MongoDB |
| `authSource` | string | No | Base de datos de autenticación |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `collection` | string | Sí | Nombre de la colección donde ejecutar el pipeline |
| `pipeline` | string | Sí | Pipeline de agregación como cadena JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `documents` | array | Array de documentos devueltos por la agregación |
| `documentCount` | number | Número de documentos devueltos |

## Notas

- Categoría: `tools`
- Tipo: `mongodb`
```

--------------------------------------------------------------------------------

---[FILE: mysql.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/mysql.mdx

```text
---
title: MySQL
description: Conectar a la base de datos MySQL
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mysql"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
La herramienta [MySQL](https://www.mysql.com/) te permite conectarte a cualquier base de datos MySQL y realizar una amplia gama de operaciones directamente dentro de tus flujos de trabajo agénticos. Con manejo seguro de conexiones y configuración flexible, puedes gestionar e interactuar fácilmente con tus datos.

Con la herramienta MySQL, puedes:

- **Consultar datos**: Ejecutar consultas SELECT para recuperar datos de tus tablas MySQL usando la operación `mysql_query`.
- **Insertar registros**: Añadir nuevas filas a tus tablas con la operación `mysql_insert` especificando la tabla y los datos a insertar.
- **Actualizar registros**: Modificar datos existentes en tus tablas usando la operación `mysql_update`, proporcionando la tabla, los nuevos datos y las condiciones WHERE.
- **Eliminar registros**: Borrar filas de tus tablas con la operación `mysql_delete`, especificando la tabla y las condiciones WHERE.
- **Ejecutar SQL directo**: Ejecutar cualquier comando SQL personalizado usando la operación `mysql_execute` para casos de uso avanzados.

La herramienta MySQL es ideal para escenarios donde tus agentes necesitan interactuar con datos estructurados—como automatizar informes, sincronizar datos entre sistemas o impulsar flujos de trabajo basados en datos. Simplifica el acceso a bases de datos, facilitando la lectura, escritura y gestión de tus datos MySQL de forma programática.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra MySQL en el flujo de trabajo. Puede consultar, insertar, actualizar, eliminar y ejecutar SQL sin procesar.

## Herramientas

### `mysql_query`

Ejecutar consulta SELECT en base de datos MySQL

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MySQL |
| `port` | number | Sí | Puerto del servidor MySQL \(predeterminado: 3306\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de la base de datos |
| `password` | string | Sí | Contraseña de la base de datos |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `query` | string | Sí | Consulta SQL SELECT a ejecutar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas devueltas por la consulta |
| `rowCount` | number | Número de filas devueltas |

### `mysql_insert`

Insertar nuevo registro en base de datos MySQL

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MySQL |
| `port` | number | Sí | Puerto del servidor MySQL \(predeterminado: 3306\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de la base de datos |
| `password` | string | Sí | Contraseña de la base de datos |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `table` | string | Sí | Nombre de la tabla donde insertar |
| `data` | object | Sí | Datos a insertar como pares clave-valor |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas insertadas |
| `rowCount` | number | Número de filas insertadas |

### `mysql_update`

Actualizar registros existentes en la base de datos MySQL

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MySQL |
| `port` | number | Sí | Puerto del servidor MySQL \(predeterminado: 3306\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de la base de datos |
| `password` | string | Sí | Contraseña de la base de datos |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `table` | string | Sí | Nombre de la tabla a actualizar |
| `data` | object | Sí | Datos a actualizar como pares clave-valor |
| `where` | string | Sí | Condición de la cláusula WHERE \(sin la palabra clave WHERE\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas actualizadas |
| `rowCount` | number | Número de filas actualizadas |

### `mysql_delete`

Eliminar registros de la base de datos MySQL

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MySQL |
| `port` | number | Sí | Puerto del servidor MySQL \(predeterminado: 3306\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de la base de datos |
| `password` | string | Sí | Contraseña de la base de datos |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `table` | string | Sí | Nombre de la tabla de la que eliminar |
| `where` | string | Sí | Condición de la cláusula WHERE \(sin la palabra clave WHERE\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas eliminadas |
| `rowCount` | number | Número de filas eliminadas |

### `mysql_execute`

Ejecutar consulta SQL en bruto en base de datos MySQL

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor MySQL |
| `port` | number | Sí | Puerto del servidor MySQL \(predeterminado: 3306\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de la base de datos |
| `password` | string | Sí | Contraseña de la base de datos |
| `ssl` | string | No | Modo de conexión SSL \(disabled, required, preferred\) |
| `query` | string | Sí | Consulta SQL en bruto para ejecutar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas devueltas por la consulta |
| `rowCount` | number | Número de filas afectadas |

## Notas

- Categoría: `tools`
- Tipo: `mysql`
```

--------------------------------------------------------------------------------

---[FILE: neo4j.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/neo4j.mdx

```text
---
title: Neo4j
description: Conectar a la base de datos de grafos Neo4j
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="neo4j"
  color="#FFFFFF"
/>

## Instrucciones de uso

Integra la base de datos de grafos Neo4j en el flujo de trabajo. Puede consultar, crear, fusionar, actualizar y eliminar nodos y relaciones.

## Herramientas

### `neo4j_query`

Ejecuta consultas MATCH para leer nodos y relaciones de la base de datos de grafos Neo4j. Para un mejor rendimiento y para evitar grandes conjuntos de resultados, incluye LIMIT en tu consulta (por ejemplo, 

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor Neo4j |
| `port` | number | Sí | Puerto del servidor Neo4j \(predeterminado: 7687 para el protocolo Bolt\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de Neo4j |
| `password` | string | Sí | Contraseña de Neo4j |
| `encryption` | string | No | Modo de cifrado de conexión \(enabled, disabled\) |
| `cypherQuery` | string | Sí | Consulta Cypher para ejecutar \(normalmente declaraciones MATCH\) |
| `parameters` | object | No | Parámetros para la consulta Cypher como un objeto JSON. Úsalo para cualquier valor dinámico incluyendo LIMIT \(por ejemplo, query: "MATCH \(n\) RETURN n LIMIT $limit", parameters: \{limit: 100\}\). |
| `parameters` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `records` | array | Array de registros devueltos por la consulta |
| `recordCount` | number | Número de registros devueltos |
| `summary` | json | Resumen de ejecución de la consulta con tiempos y contadores |

### `neo4j_create`

Ejecuta sentencias CREATE para añadir nuevos nodos y relaciones a la base de datos de grafos Neo4j

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor Neo4j |
| `port` | number | Sí | Puerto del servidor Neo4j \(predeterminado: 7687 para el protocolo Bolt\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de Neo4j |
| `password` | string | Sí | Contraseña de Neo4j |
| `encryption` | string | No | Modo de cifrado de conexión \(enabled, disabled\) |
| `cypherQuery` | string | Sí | Sentencia Cypher CREATE a ejecutar |
| `parameters` | object | No | Parámetros para la consulta Cypher como objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `summary` | json | Resumen de creación con contadores de nodos y relaciones creados |

### `neo4j_merge`

Ejecuta sentencias MERGE para encontrar o crear nodos y relaciones en Neo4j (operación upsert)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor Neo4j |
| `port` | number | Sí | Puerto del servidor Neo4j \(predeterminado: 7687 para el protocolo Bolt\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de Neo4j |
| `password` | string | Sí | Contraseña de Neo4j |
| `encryption` | string | No | Modo de cifrado de conexión \(enabled, disabled\) |
| `cypherQuery` | string | Sí | Sentencia Cypher MERGE a ejecutar |
| `parameters` | object | No | Parámetros para la consulta Cypher como objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `summary` | json | Resumen de fusión con contadores para nodos/relaciones creados o coincidentes |

### `neo4j_update`

Ejecuta declaraciones SET para actualizar propiedades de nodos y relaciones existentes en Neo4j

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor Neo4j |
| `port` | number | Sí | Puerto del servidor Neo4j \(predeterminado: 7687 para protocolo Bolt\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de Neo4j |
| `password` | string | Sí | Contraseña de Neo4j |
| `encryption` | string | No | Modo de cifrado de conexión \(enabled, disabled\) |
| `cypherQuery` | string | Sí | Consulta Cypher con declaraciones MATCH y SET para actualizar propiedades |
| `parameters` | object | No | Parámetros para la consulta Cypher como objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `summary` | json | Resumen de actualización con contadores para propiedades establecidas |

### `neo4j_delete`

Ejecuta declaraciones DELETE o DETACH DELETE para eliminar nodos y relaciones de Neo4j

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor Neo4j |
| `port` | number | Sí | Puerto del servidor Neo4j \(predeterminado: 7687 para protocolo Bolt\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de Neo4j |
| `password` | string | Sí | Contraseña de Neo4j |
| `encryption` | string | No | Modo de cifrado de conexión \(enabled, disabled\) |
| `cypherQuery` | string | Sí | Consulta Cypher con declaraciones MATCH y DELETE/DETACH DELETE |
| `parameters` | object | No | Parámetros para la consulta Cypher como objeto JSON |
| `detach` | boolean | No | Si se debe usar DETACH DELETE para eliminar relaciones antes de eliminar nodos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `summary` | json | Resumen de eliminación con contadores para nodos y relaciones eliminados |

### `neo4j_execute`

Ejecuta consultas Cypher arbitrarias en la base de datos de grafos Neo4j para operaciones complejas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor Neo4j |
| `port` | number | Sí | Puerto del servidor Neo4j \(predeterminado: 7687 para el protocolo Bolt\) |
| `database` | string | Sí | Nombre de la base de datos a la que conectarse |
| `username` | string | Sí | Nombre de usuario de Neo4j |
| `password` | string | Sí | Contraseña de Neo4j |
| `encryption` | string | No | Modo de cifrado de conexión \(enabled, disabled\) |
| `cypherQuery` | string | Sí | Consulta Cypher a ejecutar \(cualquier declaración Cypher válida\) |
| `parameters` | object | No | Parámetros para la consulta Cypher como un objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `records` | array | Array de registros devueltos por la consulta |
| `recordCount` | number | Número de registros devueltos |
| `summary` | json | Resumen de ejecución con tiempos y contadores |

## Notas

- Categoría: `tools`
- Tipo: `neo4j`
```

--------------------------------------------------------------------------------

````
