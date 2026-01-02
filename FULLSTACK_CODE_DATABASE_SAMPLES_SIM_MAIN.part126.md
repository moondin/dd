---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 126
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 126 of 933)

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

---[FILE: notion.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/notion.mdx

```text
---
title: Notion
description: Administrar páginas de Notion
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="notion"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Notion](https://www.notion.so) es un espacio de trabajo todo en uno que combina notas, documentos, wikis y herramientas de gestión de proyectos en una sola plataforma. Ofrece un entorno flexible y personalizable donde los usuarios pueden crear, organizar y colaborar en contenido en varios formatos.

Con Notion, puedes:

- **Crear contenido versátil**: Construir documentos, wikis, bases de datos, tableros kanban, calendarios y más
- **Organizar información**: Estructurar contenido jerárquicamente con páginas anidadas y potentes bases de datos
- **Colaborar sin problemas**: Compartir espacios de trabajo y páginas con miembros del equipo para colaboración en tiempo real
- **Personalizar tu espacio de trabajo**: Diseñar tu flujo de trabajo ideal con plantillas flexibles y bloques de construcción
- **Conectar información**: Enlazar entre páginas y bases de datos para crear una red de conocimiento
- **Acceder desde cualquier lugar**: Usar Notion en plataformas web, escritorio y móviles con sincronización automática

En Sim, la integración con Notion permite a tus agentes interactuar directamente con tu espacio de trabajo de Notion de forma programática. Esto permite potentes escenarios de automatización como gestión del conocimiento, creación de contenido y recuperación de información. Tus agentes pueden:

- **Leer páginas de Notion**: Extraer contenido y metadatos de cualquier página de Notion.
- **Leer bases de datos de Notion**: Recuperar la estructura e información de bases de datos.
- **Escribir en páginas**: Añadir nuevo contenido a páginas existentes de Notion.
- **Crear nuevas páginas**: Generar nuevas páginas de Notion bajo una página principal, con títulos y contenido personalizados.
- **Consultar bases de datos**: Buscar y filtrar entradas de bases de datos utilizando criterios avanzados de filtrado y ordenación.
- **Buscar en el espacio de trabajo**: Buscar en todo tu espacio de trabajo de Notion páginas o bases de datos que coincidan con consultas específicas.
- **Crear nuevas bases de datos**: Crear programáticamente nuevas bases de datos con propiedades y estructura personalizadas.

Esta integración cierra la brecha entre tus flujos de trabajo de IA y tu base de conocimiento, permitiendo una gestión de documentación e información sin problemas. Al conectar Sim con Notion, puedes automatizar procesos de documentación, mantener repositorios de información actualizados, generar informes y organizar información de manera inteligente, todo a través de tus agentes inteligentes.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Notion en el flujo de trabajo. Puede leer páginas, leer bases de datos, crear páginas, crear bases de datos, añadir contenido, consultar bases de datos y buscar en el espacio de trabajo. Requiere OAuth.

## Herramientas

### `notion_read`

Leer contenido de una página de Notion

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `pageId` | string | Sí | El ID de la página de Notion para leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Contenido de la página en formato markdown con encabezados, párrafos, listas y tareas pendientes |
| `metadata` | object | Metadatos de la página incluyendo título, URL y marcas de tiempo |

### `notion_read_database`

Leer información y estructura de base de datos desde Notion

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `databaseId` | string | Sí | El ID de la base de datos de Notion para leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Información de la base de datos incluyendo título, esquema de propiedades y metadatos |
| `metadata` | object | Metadatos de la base de datos incluyendo título, ID, URL, marcas de tiempo y esquema de propiedades |

### `notion_write`

Añadir contenido a una página de Notion

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `pageId` | string | Sí | El ID de la página de Notion a la que añadir contenido |
| `content` | string | Sí | El contenido para añadir a la página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito que confirma que el contenido se añadió a la página |

### `notion_create_page`

Crear una nueva página en Notion

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | Sí | ID de la página padre |
| `title` | string | No | Título de la nueva página |
| `content` | string | No | Contenido opcional para añadir a la página al crearla |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito que confirma la creación de la página |
| `metadata` | object | Metadatos de la página incluyendo título, ID de página, URL y marcas de tiempo |

### `notion_query_database`

Consultar y filtrar entradas de base de datos de Notion con filtrado avanzado

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | Sí | El ID de la base de datos a consultar |
| `filter` | string | No | Condiciones de filtro en formato JSON \(opcional\) |
| `sorts` | string | No | Criterios de ordenación como array JSON \(opcional\) |
| `pageSize` | number | No | Número de resultados a devolver \(predeterminado: 100, máximo: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Lista formateada de entradas de la base de datos con sus propiedades |
| `metadata` | object | Metadatos de la consulta incluyendo recuento total de resultados, información de paginación y array de resultados sin procesar |

### `notion_search`

Buscar en todas las páginas y bases de datos en el espacio de trabajo de Notion

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | No | Términos de búsqueda \(dejar vacío para obtener todas las páginas\) |
| `filterType` | string | No | Filtrar por tipo de objeto: página, base de datos, o dejar vacío para todos |
| `pageSize` | number | No | Número de resultados a devolver \(predeterminado: 100, máximo: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Lista formateada de resultados de búsqueda incluyendo páginas y bases de datos |
| `metadata` | object | Metadatos de búsqueda incluyendo recuento total de resultados, información de paginación y matriz de resultados sin procesar |

### `notion_create_database`

Crear una nueva base de datos en Notion con propiedades personalizadas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | Sí | ID de la página principal donde se creará la base de datos |
| `title` | string | Sí | Título para la nueva base de datos |
| `properties` | string | No | Propiedades de la base de datos como objeto JSON \(opcional, creará una propiedad "Nombre" predeterminada si está vacío\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito con detalles de la base de datos y lista de propiedades |
| `metadata` | object | Metadatos de la base de datos incluyendo ID, título, URL, tiempo de creación y esquema de propiedades |

## Notas

- Categoría: `tools`
- Tipo: `notion`
```

--------------------------------------------------------------------------------

---[FILE: onedrive.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/onedrive.mdx

```text
---
title: OneDrive
description: Crear, subir, descargar, listar y eliminar archivos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="onedrive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[OneDrive](https://onedrive.live.com) es el servicio de almacenamiento en la nube y sincronización de archivos de Microsoft que permite a los usuarios almacenar, acceder y compartir archivos de forma segura en todos sus dispositivos. Integrado profundamente en el ecosistema de Microsoft 365, OneDrive facilita la colaboración fluida, el control de versiones y el acceso en tiempo real al contenido entre equipos y organizaciones.

Aprende a integrar la herramienta OneDrive en Sim para extraer, gestionar y organizar automáticamente tus archivos en la nube dentro de tus flujos de trabajo. Este tutorial te guía a través de la conexión con OneDrive, la configuración del acceso a archivos y el uso del contenido almacenado para impulsar la automatización. Ideal para sincronizar documentos y medios esenciales con tus agentes en tiempo real.

Con OneDrive, puedes:

- **Almacenar archivos de forma segura en la nube**: Subir y acceder a documentos, imágenes y otros archivos desde cualquier dispositivo
- **Organizar tu contenido**: Crear carpetas estructuradas y gestionar versiones de archivos con facilidad
- **Colaborar en tiempo real**: Compartir archivos, editarlos simultáneamente con otros y realizar seguimiento de cambios
- **Acceder desde múltiples dispositivos**: Usar OneDrive desde plataformas de escritorio, móviles y web
- **Integrar con Microsoft 365**: Trabajar sin problemas con Word, Excel, PowerPoint y Teams
- **Controlar permisos**: Compartir archivos y carpetas con configuraciones de acceso personalizadas y controles de caducidad

En Sim, la integración con OneDrive permite a tus agentes interactuar directamente con tu almacenamiento en la nube. Los agentes pueden subir nuevos archivos a carpetas específicas, recuperar y leer archivos existentes, y listar contenidos de carpetas para organizar y acceder a la información de forma dinámica. Esta integración permite a tus agentes incorporar operaciones con archivos en flujos de trabajo inteligentes — automatizando la recepción de documentos, el análisis de contenido y la gestión estructurada del almacenamiento. Al conectar Sim con OneDrive, capacitas a tus agentes para gestionar y utilizar documentos en la nube de forma programática, eliminando pasos manuales y mejorando la automatización con acceso seguro a archivos en tiempo real.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra OneDrive en el flujo de trabajo. Puede crear archivos de texto y Excel, subir archivos, descargar archivos, listar archivos y eliminar archivos o carpetas.

## Herramientas

### `onedrive_upload`

Subir un archivo a OneDrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Sí | El nombre del archivo a subir |
| `file` | file | No | El archivo a subir \(binario\) |
| `content` | string | No | El contenido de texto a subir \(si no se proporciona un archivo\) |
| `mimeType` | string | No | El tipo MIME del archivo a crear \(p. ej., text/plain para .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet para .xlsx\) |
| `folderSelector` | string | No | Seleccionar la carpeta donde subir el archivo |
| `manualFolderId` | string | No | ID de carpeta introducido manualmente \(modo avanzado\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el archivo se subió correctamente |
| `file` | object | El objeto del archivo subido con metadatos que incluyen id, nombre, webViewLink, webContentLink y marcas de tiempo |

### `onedrive_create_folder`

Crear una nueva carpeta en OneDrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `folderName` | string | Sí | Nombre de la carpeta a crear |
| `folderSelector` | string | No | Seleccionar la carpeta principal donde crear la carpeta |
| `manualFolderId` | string | No | ID de carpeta principal introducido manualmente \(modo avanzado\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si la carpeta se creó correctamente |
| `file` | object | El objeto de la carpeta creada con metadatos que incluyen id, nombre, webViewLink y marcas de tiempo |

### `onedrive_download`

Descargar un archivo de OneDrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Sí | El ID del archivo a descargar |
| `fileName` | string | No | Anulación opcional del nombre del archivo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | file | Archivo descargado almacenado en los archivos de ejecución |

### `onedrive_list`

Listar archivos y carpetas en OneDrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | No | Seleccionar la carpeta de la que listar archivos |
| `manualFolderId` | string | No | El ID de carpeta introducido manualmente (modo avanzado) |
| `query` | string | No | Una consulta para filtrar los archivos |
| `pageSize` | number | No | El número de archivos a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si los archivos se listaron correctamente |
| `files` | array | Array de objetos de archivo y carpeta con metadatos |
| `nextPageToken` | string | Token para recuperar la siguiente página de resultados (opcional) |

### `onedrive_delete`

Eliminar un archivo o carpeta de OneDrive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Sí | El ID del archivo o carpeta a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el archivo se eliminó correctamente |
| `deleted` | boolean | Confirmación de que el archivo fue eliminado |
| `fileId` | string | El ID del archivo eliminado |

## Notas

- Categoría: `tools`
- Tipo: `onedrive`
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/openai.mdx

```text
---
title: Embeddings
description: Generar embeddings de Open AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="openai"
  color="#10a37f"
/>

{/* MANUAL-CONTENT-START:intro */}
[OpenAI](https://www.openai.com) es una empresa líder en investigación y despliegue de IA que ofrece una suite de potentes modelos y APIs de IA. OpenAI proporciona tecnologías de vanguardia que incluyen modelos de lenguaje grandes (como GPT-4), generación de imágenes (DALL-E) y embeddings que permiten a los desarrolladores crear aplicaciones sofisticadas impulsadas por IA.

Con OpenAI, puedes:

- **Generar texto**: Crea texto similar al humano para diversas aplicaciones usando modelos GPT
- **Crear imágenes**: Transforma descripciones textuales en contenido visual con DALL-E
- **Producir embeddings**: Convierte texto en vectores numéricos para búsqueda semántica y análisis
- **Construir asistentes de IA**: Desarrolla agentes conversacionales con conocimiento especializado
- **Procesar y analizar datos**: Extrae insights y patrones de texto no estructurado
- **Traducir idiomas**: Convierte contenido entre diferentes idiomas con alta precisión
- **Resumir contenido**: Condensa texto extenso preservando la información clave

En Sim, la integración de OpenAI permite a tus agentes aprovechar estas potentes capacidades de IA de forma programática como parte de sus flujos de trabajo. Esto permite escenarios de automatización sofisticados que combinan comprensión del lenguaje natural, generación de contenido y análisis semántico. Tus agentes pueden generar embeddings vectoriales a partir de texto, que son representaciones numéricas que capturan el significado semántico, permitiendo sistemas avanzados de búsqueda, clasificación y recomendación. Además, a través de la integración con DALL-E, los agentes pueden crear imágenes a partir de descripciones textuales, abriendo posibilidades para la generación de contenido visual. Esta integración cierra la brecha entre tu automatización de flujos de trabajo y las capacidades de IA de vanguardia, permitiendo a tus agentes entender el contexto, generar contenido relevante y tomar decisiones inteligentes basadas en la comprensión semántica. Al conectar Sim con OpenAI, puedes crear agentes que procesen información de manera más inteligente, generen contenido creativo y ofrezcan experiencias más personalizadas a los usuarios.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integrar Embeddings en el flujo de trabajo. Puede generar embeddings a partir de texto. Requiere clave API.

## Herramientas

### `openai_embeddings`

Generar embeddings a partir de texto usando OpenAI

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `input` | string | Sí | Texto para generar embeddings |
| `model` | string | No | Modelo a utilizar para los embeddings |
| `encodingFormat` | string | No | El formato en el que se devolverán los embeddings |
| `apiKey` | string | Sí | Clave API de OpenAI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Resultados de la generación de embeddings |

## Notas

- Categoría: `tools`
- Tipo: `openai`
```

--------------------------------------------------------------------------------

---[FILE: outlook.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/outlook.mdx

```text
---
title: Outlook
description: Enviar, leer, redactar borradores, reenviar y mover mensajes de
  correo electrónico de Outlook
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="outlook"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Outlook](https://outlook.office365.com) es una plataforma completa de correo electrónico y calendario que ayuda a los usuarios a gestionar comunicaciones, horarios y tareas de manera eficiente. Como parte del conjunto de productividad de Microsoft, Outlook ofrece herramientas robustas para enviar y organizar correos electrónicos, coordinar reuniones e integrarse perfectamente con las aplicaciones de Microsoft 365, permitiendo a individuos y equipos mantenerse organizados y conectados en todos sus dispositivos.

Con Microsoft Outlook, puedes:

- **Enviar y recibir correos electrónicos**: Comunícate de forma clara y profesional con individuos o listas de distribución  
- **Gestionar calendarios y eventos**: Programa reuniones, configura recordatorios y visualiza disponibilidad  
- **Organizar tu bandeja de entrada**: Utiliza carpetas, categorías y reglas para mantener tu correo electrónico optimizado  
- **Acceder a contactos y tareas**: Mantén un seguimiento de personas clave y elementos de acción en un solo lugar  
- **Integrar con Microsoft 365**: Trabaja sin problemas con Word, Excel, Teams y otras aplicaciones de Microsoft  
- **Acceder desde varios dispositivos**: Usa Outlook en escritorio, web y móvil con sincronización en tiempo real  
- **Mantener privacidad y seguridad**: Aprovecha el cifrado de nivel empresarial y los controles de cumplimiento

En Sim, la integración con Microsoft Outlook permite a tus agentes interactuar directamente con datos de correo electrónico y calendario de forma programática con capacidades completas de gestión de correo electrónico. Esto permite potentes escenarios de automatización en todo tu flujo de trabajo de correo electrónico. Tus agentes pueden:

- **Enviar y redactar borradores**: Componer correos electrónicos profesionales con archivos adjuntos y guardar borradores para más tarde
- **Leer y reenviar**: Acceder a los mensajes de la bandeja de entrada y reenviar comunicaciones importantes a los miembros del equipo
- **Organizar eficientemente**: Marcar correos electrónicos como leídos o no leídos, mover mensajes entre carpetas y copiar correos electrónicos para referencia
- **Limpiar la bandeja de entrada**: Eliminar mensajes no deseados y mantener estructuras de carpetas organizadas
- **Activar flujos de trabajo**: Reaccionar a nuevos correos electrónicos en tiempo real, permitiendo automatización receptiva basada en mensajes entrantes

Al conectar Sim con Microsoft Outlook, permites que los agentes inteligentes automaticen las comunicaciones, simplifiquen la programación, mantengan visibilidad en la correspondencia organizacional y mantengan las bandejas de entrada organizadas, todo dentro de tu ecosistema de flujo de trabajo. Ya sea que estés gestionando comunicaciones con clientes, procesando facturas, coordinando actualizaciones del equipo o automatizando seguimientos, la integración con Outlook proporciona capacidades de automatización de correo electrónico de nivel empresarial.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Outlook en el flujo de trabajo. Puede leer, redactar borradores, enviar, reenviar y mover mensajes de correo electrónico. Se puede utilizar en modo de activación para iniciar un flujo de trabajo cuando se recibe un nuevo correo electrónico.

## Herramientas

### `outlook_send`

Enviar correos electrónicos usando Outlook

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `subject` | string | Sí | Asunto del correo electrónico |
| `body` | string | Sí | Contenido del cuerpo del correo electrónico |
| `contentType` | string | No | Tipo de contenido para el cuerpo del correo electrónico \(texto o html\) |
| `replyToMessageId` | string | No | ID del mensaje al que se responde \(para el hilo\) |
| `conversationId` | string | No | ID de conversación para el hilo |
| `cc` | string | No | Destinatarios en CC \(separados por comas\) |
| `bcc` | string | No | Destinatarios en CCO \(separados por comas\) |
| `attachments` | file[] | No | Archivos para adjuntar al correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito del envío del correo electrónico |
| `status` | string | Estado de entrega del correo electrónico |
| `timestamp` | string | Marca de tiempo cuando se envió el correo electrónico |
| `message` | string | Mensaje de éxito o error |

### `outlook_draft`

Crear borradores de correos electrónicos usando Outlook

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `subject` | string | Sí | Asunto del correo electrónico |
| `body` | string | Sí | Contenido del cuerpo del correo electrónico |
| `contentType` | string | No | Tipo de contenido para el cuerpo del correo electrónico \(texto o html\) |
| `cc` | string | No | Destinatarios en CC \(separados por comas\) |
| `bcc` | string | No | Destinatarios en CCO \(separados por comas\) |
| `attachments` | file[] | No | Archivos para adjuntar al borrador del correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la creación del borrador |
| `messageId` | string | Identificador único para el correo electrónico en borrador |
| `status` | string | Estado del borrador del correo electrónico |
| `subject` | string | Asunto del correo electrónico en borrador |
| `timestamp` | string | Marca de tiempo cuando se creó el borrador |
| `message` | string | Mensaje de éxito o error |

### `outlook_read`

Leer correos electrónicos desde Outlook

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `folder` | string | No | ID de la carpeta desde donde leer los correos electrónicos \(predeterminado: Bandeja de entrada\) |
| `maxResults` | number | No | Número máximo de correos electrónicos a recuperar \(predeterminado: 1, máximo: 10\) |
| `includeAttachments` | boolean | No | Descargar e incluir archivos adjuntos de correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o estado |
| `results` | array | Array de objetos de mensajes de correo electrónico |
| `attachments` | file[] | Todos los archivos adjuntos de correo electrónico aplanados de todos los correos |

### `outlook_forward`

Reenviar un mensaje existente de Outlook a destinatarios específicos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | El ID del mensaje a reenviar |
| `to` | string | Sí | Dirección(es) de correo electrónico del destinatario, separadas por comas |
| `comment` | string | No | Comentario opcional para incluir con el mensaje reenviado |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `results` | object | Detalles del resultado de entrega |

### `outlook_move`

Mover correos electrónicos entre carpetas de Outlook

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje a mover |
| `destinationId` | string | Sí | ID de la carpeta de destino |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito del movimiento del correo electrónico |
| `message` | string | Mensaje de éxito o error |
| `messageId` | string | ID del mensaje movido |
| `newFolderId` | string | ID de la carpeta de destino |

### `outlook_mark_read`

Marcar un mensaje de Outlook como leído

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje que se marcará como leído |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `message` | string | Mensaje de éxito o error |
| `messageId` | string | ID del mensaje |
| `isRead` | boolean | Estado de lectura del mensaje |

### `outlook_mark_unread`

Marcar un mensaje de Outlook como no leído

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje que se marcará como no leído |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `message` | string | Mensaje de éxito o error |
| `messageId` | string | ID del mensaje |
| `isRead` | boolean | Estado de lectura del mensaje |

### `outlook_delete`

Eliminar un mensaje de Outlook (mover a elementos eliminados)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `message` | string | Mensaje de éxito o error |
| `messageId` | string | ID del mensaje eliminado |
| `status` | string | Estado de eliminación |

### `outlook_copy`

Copiar un mensaje de Outlook a otra carpeta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Sí | ID del mensaje a copiar |
| `destinationId` | string | Sí | ID de la carpeta de destino |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la copia del correo electrónico |
| `message` | string | Mensaje de éxito o error |
| `originalMessageId` | string | ID del mensaje original |
| `copiedMessageId` | string | ID del mensaje copiado |
| `destinationFolderId` | string | ID de la carpeta de destino |

## Notas

- Categoría: `tools`
- Tipo: `outlook`
```

--------------------------------------------------------------------------------

---[FILE: parallel_ai.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/parallel_ai.mdx

```text
---
title: Parallel AI
description: Investigación web con Parallel AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="parallel_ai"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Parallel AI](https://parallel.ai/) es una plataforma avanzada de búsqueda web y extracción de contenido diseñada para ofrecer resultados completos y de alta calidad para cualquier consulta. Al aprovechar el procesamiento inteligente y la extracción de datos a gran escala, Parallel AI permite a usuarios y agentes acceder, analizar y sintetizar información de toda la web con rapidez y precisión.

Con Parallel AI, puedes:

- **Buscar en la web de forma inteligente**: Obtener información relevante y actualizada de una amplia gama de fuentes  
- **Extraer y resumir contenido**: Conseguir extractos concisos y significativos de páginas web y documentos  
- **Personalizar objetivos de búsqueda**: Adaptar consultas a necesidades o preguntas específicas para resultados más precisos  
- **Procesar resultados a gran escala**: Manejar grandes volúmenes de resultados de búsqueda con opciones de procesamiento avanzadas  
- **Integrar con flujos de trabajo**: Usar Parallel AI dentro de Sim para automatizar la investigación, recopilación de contenido y extracción de conocimiento  
- **Controlar la granularidad de salida**: Especificar el número de resultados y la cantidad de contenido por resultado  
- **Acceso seguro mediante API**: Proteger tus búsquedas y datos con autenticación por clave API

En Sim, la integración con Parallel AI permite a tus agentes realizar búsquedas web y extraer contenido de forma programática. Esto posibilita potentes escenarios de automatización como investigación en tiempo real, análisis competitivo, monitoreo de contenido y creación de bases de conocimiento. Al conectar Sim con Parallel AI, desbloqueas la capacidad de que los agentes recopilen, procesen y utilicen datos web como parte de tus flujos de trabajo automatizados.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Parallel AI en el flujo de trabajo. Puede buscar en la web, extraer información de URLs y realizar investigaciones profundas.

## Herramientas

### `parallel_search`

Busca en la web usando Parallel AI. Proporciona resultados de búsqueda completos con procesamiento inteligente y extracción de contenido.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `objective` | string | Sí | El objetivo de búsqueda o pregunta a responder |
| `search_queries` | string | No | Lista opcional de consultas de búsqueda separadas por comas para ejecutar |
| `processor` | string | No | Método de procesamiento: base o pro \(predeterminado: base\) |
| `max_results` | number | No | Número máximo de resultados a devolver \(predeterminado: 5\) |
| `max_chars_per_result` | number | No | Máximo de caracteres por resultado \(predeterminado: 1500\) |
| `apiKey` | string | Sí | Clave API de Parallel AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Resultados de búsqueda con extractos de páginas relevantes |

### `parallel_extract`

Extrae información específica de URLs concretas utilizando Parallel AI. Procesa las URLs proporcionadas para obtener contenido relevante basado en tu objetivo.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `urls` | string | Sí | Lista de URLs separadas por comas para extraer información |
| `objective` | string | Sí | Qué información extraer de las URLs proporcionadas |
| `excerpts` | boolean | Sí | Incluir extractos relevantes del contenido |
| `full_content` | boolean | Sí | Incluir contenido completo de la página |
| `apiKey` | string | Sí | Clave API de Parallel AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Información extraída de las URLs proporcionadas |

### `parallel_deep_research`

Realiza investigaciones exhaustivas y profundas en la web utilizando Parallel AI. Sintetiza información de múltiples fuentes con citas. Puede tardar hasta 15 minutos en completarse.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `input` | string | Sí | Consulta de investigación o pregunta \(hasta 15.000 caracteres\) |
| `processor` | string | No | Nivel de cómputo: base, lite, pro, ultra, ultra2x, ultra4x, ultra8x \(predeterminado: base\) |
| `include_domains` | string | No | Lista de dominios separados por comas para restringir la investigación \(política de fuentes\) |
| `exclude_domains` | string | No | Lista de dominios separados por comas para excluir de la investigación \(política de fuentes\) |
| `apiKey` | string | Sí | Clave API de Parallel AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `status` | string | Estado de la tarea (completada, fallida) |
| `run_id` | string | ID único para esta tarea de investigación |
| `message` | string | Mensaje de estado |
| `content` | object | Resultados de la investigación (estructurados según output_schema) |
| `basis` | array | Citas y fuentes con razonamiento y niveles de confianza |

## Notas

- Categoría: `tools`
- Tipo: `parallel_ai`
```

--------------------------------------------------------------------------------

---[FILE: perplexity.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/perplexity.mdx

```text
---
title: Perplexity
description: Usa Perplexity AI para chat y búsqueda
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="perplexity"
  color="#20808D"
/>

{/* MANUAL-CONTENT-START:intro */}
[Perplexity AI](https://www.perplexity.ai) es un motor de búsqueda y respuestas impulsado por IA que combina las capacidades de los grandes modelos de lenguaje con búsquedas web en tiempo real para proporcionar información precisa y actualizada, así como respuestas completas a preguntas complejas.

Con Perplexity AI, puedes:

- **Obtener respuestas precisas**: Recibir respuestas completas a preguntas con citas de fuentes confiables
- **Acceder a información en tiempo real**: Obtener información actualizada a través de las capacidades de búsqueda web de Perplexity
- **Explorar temas en profundidad**: Profundizar en temas con preguntas de seguimiento e información relacionada
- **Verificar información**: Comprobar la credibilidad de las respuestas a través de las fuentes y referencias proporcionadas
- **Generar contenido**: Crear resúmenes, análisis y contenido creativo basado en información actual
- **Investigar eficientemente**: Agilizar procesos de investigación con respuestas completas a consultas complejas
- **Interactuar conversacionalmente**: Participar en diálogos naturales para refinar preguntas y explorar temas

En Sim, la integración de Perplexity permite a tus agentes aprovechar estas potentes capacidades de IA de forma programática como parte de sus flujos de trabajo. Esto permite escenarios de automatización sofisticados que combinan comprensión del lenguaje natural, recuperación de información en tiempo real y generación de contenido. Tus agentes pueden formular consultas, recibir respuestas completas con citas e incorporar esta información en sus procesos de toma de decisiones o resultados. Esta integración cierra la brecha entre la automatización de tu flujo de trabajo y el acceso a información actual y confiable, permitiendo que tus agentes tomen decisiones más informadas y proporcionen respuestas más precisas. Al conectar Sim con Perplexity, puedes crear agentes que se mantengan actualizados con la información más reciente, proporcionen respuestas bien investigadas y entreguen insights más valiosos a los usuarios - todo sin requerir investigación manual o recopilación de información.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Perplexity en el flujo de trabajo. Puede generar completados utilizando modelos de chat de Perplexity AI o realizar búsquedas web con filtrado avanzado.

## Herramientas

### `perplexity_chat`

Genera completados utilizando los modelos de chat de Perplexity AI

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `systemPrompt` | string | No | Instrucción del sistema para guiar el comportamiento del modelo |
| `content` | string | Sí | El contenido del mensaje del usuario para enviar al modelo |
| `model` | string | Sí | Modelo a utilizar para los completados de chat (p. ej., sonar, mistral) |
| `max_tokens` | number | No | Número máximo de tokens a generar |
| `temperature` | number | No | Temperatura de muestreo entre 0 y 1 |
| `apiKey` | string | Sí | Clave API de Perplexity |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Contenido de texto generado |
| `model` | string | Modelo utilizado para la generación |
| `usage` | object | Información de uso de tokens |

### `perplexity_search`

Obtén resultados de búsqueda clasificados de Perplexity

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Una consulta de búsqueda o array de consultas \(máximo 5 para búsqueda multi-consulta\) |
| `max_results` | number | No | Número máximo de resultados de búsqueda a devolver \(1-20, predeterminado: 10\) |
| `search_domain_filter` | array | No | Lista de dominios/URLs para limitar los resultados de búsqueda \(máximo 20\) |
| `max_tokens_per_page` | number | No | Número máximo de tokens recuperados de cada página web \(predeterminado: 1024\) |
| `country` | string | No | Código de país para filtrar resultados de búsqueda \(ej., US, GB, DE\) |
| `search_recency_filter` | string | No | Filtrar resultados por actualidad: hora, día, semana, mes o año |
| `search_after_date` | string | No | Incluir solo contenido publicado después de esta fecha \(formato: MM/DD/AAAA\) |
| `search_before_date` | string | No | Incluir solo contenido publicado antes de esta fecha \(formato: MM/DD/AAAA\) |
| `apiKey` | string | Sí | Clave API de Perplexity |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Array de resultados de búsqueda |

## Notas

- Categoría: `tools`
- Tipo: `perplexity`
```

--------------------------------------------------------------------------------

````
