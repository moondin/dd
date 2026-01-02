---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 114
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 114 of 933)

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

---[FILE: google_docs.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_docs.mdx

```text
---
title: Google Docs
description: Lee, escribe y crea documentos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_docs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Docs](https://docs.google.com) es un potente servicio de creación y edición de documentos basado en la nube que permite a los usuarios crear, editar y colaborar en documentos en tiempo real. Como parte de la suite de productividad de Google, Google Docs ofrece una plataforma versátil para documentos de texto con sólidas capacidades de formato, comentarios y compartición.

Aprende cómo integrar la herramienta "Leer" de Google Docs en Sim para obtener datos de tus documentos sin esfuerzo e integrarlos en tus flujos de trabajo. Este tutorial te guía a través de la conexión con Google Docs, la configuración de lecturas de datos y el uso de esa información para automatizar procesos en tiempo real. Perfecto para sincronizar datos en vivo con tus agentes.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/f41gy9rBHhE"
  title="Usa la herramienta Leer de Google Docs en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Aprende cómo integrar la herramienta "Actualizar" de Google Docs en Sim para añadir contenido en tus documentos sin esfuerzo a través de tus flujos de trabajo. Este tutorial te guía a través de la conexión con Google Docs, la configuración de escrituras de datos y el uso de esa información para automatizar actualizaciones de documentos de manera fluida. Perfecto para mantener documentación dinámica en tiempo real con un mínimo esfuerzo.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/L64ROHS2ivA"
  title="Usa la herramienta Actualizar de Google Docs en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Aprende cómo integrar la herramienta "Crear" de Google Docs en Sim para generar nuevos documentos sin esfuerzo a través de tus flujos de trabajo. Este tutorial te guía a través de la conexión con Google Docs, la configuración de creación de documentos y el uso de datos de flujo de trabajo para poblar contenido automáticamente. Perfecto para agilizar la generación de documentos y mejorar la productividad.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/lWpHH4qddWk"
  title="Usa la herramienta de creación de Google Docs en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Con Google Docs, puedes:

- **Crear y editar documentos**: Desarrolla documentos de texto con opciones completas de formato
- **Colaborar en tiempo real**: Trabaja simultáneamente con múltiples usuarios en el mismo documento
- **Seguir los cambios**: Visualiza el historial de revisiones y restaura versiones anteriores
- **Comentar y sugerir**: Proporciona retroalimentación y propón ediciones sin cambiar el contenido original
- **Acceder desde cualquier lugar**: Usa Google Docs en diferentes dispositivos con sincronización automática en la nube
- **Trabajar sin conexión**: Continúa trabajando sin conexión a internet con cambios que se sincronizan al volver a conectarte
- **Integrar con otros servicios**: Conéctate con Google Drive, Sheets, Slides y aplicaciones de terceros

En Sim, la integración con Google Docs permite a tus agentes interactuar directamente con el contenido de los documentos de forma programática. Esto permite potentes escenarios de automatización como creación de documentos, extracción de contenido, edición colaborativa y gestión de documentos. Tus agentes pueden leer documentos existentes para extraer información, escribir en documentos para actualizar contenido y crear nuevos documentos desde cero. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la gestión de documentos, permitiendo una interacción perfecta con una de las plataformas de documentos más utilizadas del mundo. Al conectar Sim con Google Docs, puedes automatizar flujos de trabajo de documentos, generar informes, extraer información de documentos y mantener la documentación, todo a través de tus agentes inteligentes.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Google Docs en el flujo de trabajo. Puede leer, escribir y crear documentos. Requiere OAuth.

## Herramientas

### `google_docs_read`

Leer contenido de un documento de Google Docs

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | Sí | El ID del documento a leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Contenido de texto extraído del documento |
| `metadata` | json | Metadatos del documento incluyendo ID, título y URL |

### `google_docs_write`

Escribir o actualizar contenido en un documento de Google Docs

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | Sí | El ID del documento en el que escribir |
| `content` | string | Sí | El contenido a escribir en el documento |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Indica si el contenido del documento se actualizó correctamente |
| `metadata` | json | Metadatos del documento actualizado incluyendo ID, título y URL |

### `google_docs_create`

Crear un nuevo documento de Google Docs

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | El título del documento a crear |
| `content` | string | No | El contenido del documento a crear |
| `folderSelector` | string | No | Seleccionar la carpeta donde crear el documento |
| `folderId` | string | No | El ID de la carpeta donde crear el documento \(uso interno\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `metadata` | json | Metadatos del documento creado, incluyendo ID, título y URL |

## Notas

- Categoría: `tools`
- Tipo: `google_docs`
```

--------------------------------------------------------------------------------

---[FILE: google_drive.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_drive.mdx

```text
---
title: Google Drive
description: Crear, subir y listar archivos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_drive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Drive](https://drive.google.com) es el servicio de almacenamiento en la nube y sincronización de archivos de Google que permite a los usuarios almacenar archivos, sincronizarlos entre dispositivos y compartirlos con otros. Como componente central del ecosistema de productividad de Google, Google Drive ofrece capacidades robustas de almacenamiento, organización y colaboración.

Aprende cómo integrar la herramienta Google Drive en Sim para extraer información de tu Drive sin esfuerzo a través de tus flujos de trabajo. Este tutorial te guía a través de la conexión con Google Drive, la configuración de la recuperación de datos y el uso de documentos y archivos almacenados para mejorar la automatización. Perfecto para sincronizar datos importantes con tus agentes en tiempo real.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cRoRr4b-EAs"
  title="Usa la herramienta Google Drive en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Con Google Drive, puedes:

- **Almacenar archivos en la nube**: Sube y accede a tus archivos desde cualquier lugar con acceso a internet
- **Organizar contenido**: Crea carpetas, usa códigos de color e implementa convenciones de nomenclatura
- **Compartir y colaborar**: Controla los permisos de acceso y trabaja simultáneamente en archivos
- **Buscar eficientemente**: Encuentra archivos rápidamente con la potente tecnología de búsqueda de Google
- **Acceder desde varios dispositivos**: Usa Google Drive en plataformas de escritorio, móviles y web
- **Integrar con otros servicios**: Conéctate con Google Docs, Sheets, Slides y aplicaciones de terceros

En Sim, la integración con Google Drive permite a tus agentes interactuar directamente con tu almacenamiento en la nube de forma programática. Esto permite potentes escenarios de automatización como gestión de archivos, organización de contenido y flujos de trabajo de documentos. Tus agentes pueden subir nuevos archivos a carpetas específicas, descargar archivos existentes para procesar su contenido y listar el contenido de carpetas para navegar por la estructura de almacenamiento. Esta integración cierra la brecha entre tus flujos de trabajo de IA y tu sistema de gestión de documentos, permitiendo operaciones de archivos sin intervención manual. Al conectar Sim con Google Drive, puedes automatizar flujos de trabajo basados en archivos, gestionar documentos de manera inteligente e incorporar operaciones de almacenamiento en la nube a las capacidades de tu agente.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Google Drive en el flujo de trabajo. Puede crear, subir y listar archivos. Requiere OAuth.

## Herramientas

### `google_drive_upload`

Subir un archivo a Google Drive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `fileName` | string | Sí | El nombre del archivo a subir |
| `file` | file | No | Archivo binario para subir \(objeto UserFile\) |
| `content` | string | No | Contenido de texto para subir \(use esto O archivo, no ambos\) |
| `mimeType` | string | No | El tipo MIME del archivo a subir \(auto-detectado del archivo si no se proporciona\) |
| `folderSelector` | string | No | Seleccione la carpeta donde subir el archivo |
| `folderId` | string | No | El ID de la carpeta donde subir el archivo \(uso interno\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | json | Metadatos del archivo subido incluyendo ID, nombre y enlaces |

### `google_drive_create_folder`

Crear una nueva carpeta en Google Drive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Sí | Nombre de la carpeta a crear |
| `folderSelector` | string | No | Seleccionar la carpeta principal donde crear la carpeta |
| `folderId` | string | No | ID de la carpeta principal \(uso interno\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | json | Metadatos de la carpeta creada incluyendo ID, nombre e información de la carpeta principal |

### `google_drive_download`

Descargar un archivo de Google Drive (exporta automáticamente archivos de Google Workspace)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Sí | El ID del archivo a descargar |
| `mimeType` | string | No | El tipo MIME para exportar archivos de Google Workspace \(opcional\) |
| `fileName` | string | No | Anulación opcional del nombre del archivo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | file | Archivo descargado almacenado en los archivos de ejecución |

### `google_drive_list`

Listar archivos y carpetas en Google Drive

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | No | Selecciona la carpeta desde la que listar archivos |
| `folderId` | string | No | El ID de la carpeta desde la que listar archivos \(uso interno\) |
| `query` | string | No | Término de búsqueda para filtrar archivos por nombre \(p. ej. "presupuesto" encuentra archivos con "presupuesto" en el nombre\). NO uses la sintaxis de consulta de Google Drive aquí - solo proporciona un término de búsqueda simple. |
| `pageSize` | number | No | El número máximo de archivos a devolver \(predeterminado: 100\) |
| `pageToken` | string | No | El token de página para usar en la paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `files` | json | Array de objetos de metadatos de archivos de la carpeta especificada |

## Notas

- Categoría: `tools`
- Tipo: `google_drive`
```

--------------------------------------------------------------------------------

---[FILE: google_forms.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_forms.mdx

```text
---
title: Google Forms
description: Lee respuestas de un formulario de Google
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_forms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Forms](https://forms.google.com) es la herramienta de encuestas y formularios en línea de Google que permite a los usuarios crear formularios, recopilar respuestas y analizar resultados. Como parte del conjunto de herramientas de productividad de Google, Google Forms facilita la recopilación de información, comentarios y datos de los usuarios.

Aprende cómo integrar la herramienta Google Forms en Sim para leer y procesar automáticamente las respuestas de formularios en tus flujos de trabajo. Este tutorial te guía a través de la conexión de Google Forms, la recuperación de respuestas y el uso de los datos recopilados para impulsar la automatización. Perfecto para sincronizar resultados de encuestas, registros o comentarios con tus agentes en tiempo real.

Con Google Forms, puedes:

- **Crear encuestas y formularios**: Diseña formularios personalizados para comentarios, registro, cuestionarios y más
- **Recopilar respuestas automáticamente**: Reúne datos de usuarios en tiempo real
- **Analizar resultados**: Visualiza respuestas en Google Forms o expórtalas a Google Sheets para un análisis más detallado
- **Colaborar fácilmente**: Comparte formularios y trabaja con otros para crear y revisar preguntas
- **Integrar con otros servicios de Google**: Conéctate con Google Sheets, Drive y más

En Sim, la integración con Google Forms permite a tus agentes acceder programáticamente a las respuestas de los formularios. Esto permite potentes escenarios de automatización como procesar datos de encuestas, activar flujos de trabajo basados en nuevos envíos y sincronizar resultados de formularios con otras herramientas. Tus agentes pueden obtener todas las respuestas de un formulario, recuperar una respuesta específica y usar los datos para impulsar la automatización inteligente. Al conectar Sim con Google Forms, puedes automatizar la recopilación de datos, agilizar el procesamiento de comentarios e incorporar respuestas de formularios a las capacidades de tu agente.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Google Forms en tu flujo de trabajo. Proporciona un ID de formulario para listar respuestas, o especifica un ID de respuesta para obtener una sola respuesta. Requiere OAuth.

## Herramientas

### `google_forms_get_responses`

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| formId | string | Sí | El ID del formulario de Google |
| responseId | string | No | Si se proporciona, devuelve esta respuesta específica |
| pageSize | number | No | Máximo de respuestas a devolver (el servicio puede devolver menos). Por defecto es 5000 |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | json | Respuesta o lista de respuestas |

## Notas

- Categoría: `tools`
- Tipo: `google_forms`
```

--------------------------------------------------------------------------------

---[FILE: google_groups.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_groups.mdx

```text
---
title: Google Groups
description: Administra los Grupos de Google Workspace y sus miembros
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_groups"
  color="#E8F0FE"
/>

## Instrucciones de uso

Conéctate a Google Workspace para crear, actualizar y administrar grupos y sus miembros utilizando la API de directorio de Admin SDK.

## Herramientas

### `google_groups_list_groups`

Listar todos los grupos en un dominio de Google Workspace

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `customer` | string | No | ID del cliente o "my_customer" para el dominio del usuario autenticado |
| `domain` | string | No | Nombre de dominio para filtrar grupos |
| `maxResults` | number | No | Número máximo de resultados a devolver (1-200) |
| `pageToken` | string | No | Token para paginación |
| `query` | string | No | Consulta de búsqueda para filtrar grupos (p. ej., "email:admin*") |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `groups` | json | Array de objetos de grupo |
| `nextPageToken` | string | Token para obtener la siguiente página de resultados |

### `google_groups_get_group`

Obtener detalles de un Grupo de Google específico por correo electrónico o ID de grupo

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `group` | json | Objeto de grupo |

### `google_groups_create_group`

Crear un nuevo Grupo de Google en el dominio

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `email` | string | Sí | Dirección de correo electrónico para el nuevo grupo (p. ej., equipo@tudominio.com) |
| `name` | string | Sí | Nombre visible para el grupo |
| `description` | string | No | Descripción del grupo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `group` | json | Objeto de grupo creado |

### `google_groups_update_group`

Actualizar un grupo de Google existente

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `name` | string | No | Nuevo nombre visible para el grupo |
| `description` | string | No | Nueva descripción para el grupo |
| `email` | string | No | Nueva dirección de correo electrónico para el grupo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `group` | json | Objeto de grupo actualizado |

### `google_groups_delete_group`

Eliminar un grupo de Google

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito |

### `google_groups_list_members`

Listar todos los miembros de un Grupo de Google

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `maxResults` | number | No | Número máximo de resultados a devolver \(1-200\) |
| `pageToken` | string | No | Token para paginación |
| `roles` | string | No | Filtrar por roles \(separados por comas: OWNER, MANAGER, MEMBER\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `members` | json | Array de objetos de miembro |
| `nextPageToken` | string | Token para obtener la siguiente página de resultados |

### `google_groups_get_member`

Obtener detalles de un miembro específico en un Grupo de Google

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `memberKey` | string | Sí | Dirección de correo electrónico del miembro o ID único del miembro |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `member` | json | Objeto de miembro |

### `google_groups_add_member`

Añadir un nuevo miembro a un Grupo de Google

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `email` | string | Sí | Dirección de correo electrónico del miembro a añadir |
| `role` | string | No | Rol para el miembro \(MEMBER, MANAGER, o OWNER\). Por defecto es MEMBER. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `member` | json | Objeto de miembro añadido |

### `google_groups_remove_member`

Eliminar un miembro de un grupo de Google

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `memberKey` | string | Sí | Dirección de correo electrónico o ID único del miembro a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito |

### `google_groups_update_member`

Actualizar un miembro

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `memberKey` | string | Sí | Dirección de correo electrónico del miembro o ID único del miembro |
| `role` | string | Sí | Nuevo rol para el miembro \(MEMBER, MANAGER, o OWNER\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `member` | json | Objeto de miembro actualizado |

### `google_groups_has_member`

Comprobar si un usuario es miembro de un grupo de Google

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Sí | Dirección de correo electrónico del grupo o ID único del grupo |
| `memberKey` | string | Sí | Dirección de correo electrónico del miembro o ID único del miembro a comprobar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `isMember` | boolean | Indica si el usuario es miembro del grupo |

## Notas

- Categoría: `tools`
- Tipo: `google_groups`
```

--------------------------------------------------------------------------------

---[FILE: google_search.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_search.mdx

```text
---
title: Búsqueda de Google
description: Buscar en la web
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_search"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Search](https://www.google.com) es el motor de búsqueda más utilizado del mundo, que proporciona acceso a miles de millones de páginas web y fuentes de información. Google Search utiliza algoritmos sofisticados para ofrecer resultados de búsqueda relevantes basados en las consultas de los usuarios, lo que lo convierte en una herramienta esencial para encontrar información en internet.

Aprende cómo integrar la herramienta de Google Search en Sim para obtener sin esfuerzo resultados de búsqueda en tiempo real a través de tus flujos de trabajo. Este tutorial te guía a través de la conexión con Google Search, la configuración de consultas de búsqueda y el uso de datos en vivo para mejorar la automatización. Perfecto para potenciar tus agentes con información actualizada y toma de decisiones más inteligente.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/1B7hV9b5UMQ"
  title="Usa la herramienta de Google Search en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Con Google Search, puedes:

- **Encontrar información relevante**: Accede a miles de millones de páginas web con los potentes algoritmos de búsqueda de Google
- **Obtener resultados específicos**: Utiliza operadores de búsqueda para refinar y dirigir tus consultas
- **Descubrir contenido diverso**: Encuentra texto, imágenes, videos, noticias y otros tipos de contenido
- **Acceder a gráficos de conocimiento**: Obtén información estructurada sobre personas, lugares y cosas
- **Utilizar funciones de búsqueda**: Aprovecha herramientas de búsqueda especializadas como calculadoras, convertidores de unidades y más

En Sim, la integración de Google Search permite a tus agentes buscar en la web de forma programática e incorporar resultados de búsqueda en sus flujos de trabajo. Esto permite escenarios de automatización potentes como investigación, verificación de hechos, recopilación de datos y síntesis de información. Tus agentes pueden formular consultas de búsqueda, recuperar resultados relevantes y extraer información de esos resultados para tomar decisiones o generar ideas. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la vasta información disponible en la web, permitiendo a tus agentes acceder a información actualizada de toda internet. Al conectar Sim con Google Search, puedes crear agentes que se mantengan informados con la información más reciente, verifiquen hechos, realicen investigaciones y proporcionen a los usuarios contenido web relevante, todo sin salir de tu flujo de trabajo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra la Búsqueda de Google en el flujo de trabajo. Puede buscar en la web. Requiere clave API.

## Herramientas

### `google_search`

Buscar en la web con la API de Custom Search

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda a ejecutar |
| `searchEngineId` | string | Sí | ID del motor de búsqueda personalizado |
| `num` | string | No | Número de resultados a devolver \(predeterminado: 10, máximo: 10\) |
| `apiKey` | string | Sí | Clave de API de Google |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | array | Array de resultados de búsqueda de Google |

## Notas

- Categoría: `tools`
- Tipo: `google_search`
```

--------------------------------------------------------------------------------

---[FILE: google_sheets.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_sheets.mdx

```text
---
title: Google Sheets
description: Leer, escribir y actualizar datos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_sheets"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Sheets](https://sheets.google.com) es una potente aplicación de hojas de cálculo basada en la nube que permite a los usuarios crear, editar y colaborar en hojas de cálculo en tiempo real. Como parte del conjunto de productividad de Google, Google Sheets ofrece una plataforma versátil para la organización, análisis y visualización de datos con sólidas capacidades de formato, fórmulas y opciones para compartir.

Aprende cómo integrar la herramienta "Leer" de Google Sheets en Sim para obtener datos de tus hojas de cálculo sin esfuerzo e integrarlos en tus flujos de trabajo. Este tutorial te guía a través de la conexión con Google Sheets, la configuración de lecturas de datos y el uso de esa información para automatizar procesos en tiempo real. Perfecto para sincronizar datos en vivo con tus agentes.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/xxP7MZRuq_0"
  title="Usa la herramienta Leer de Google Sheets en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Descubre cómo usar la herramienta "Escribir" de Google Sheets en Sim para enviar automáticamente datos desde tus flujos de trabajo a tus hojas de cálculo de Google. Este tutorial cubre la configuración de la integración, la configuración de operaciones de escritura y la actualización de tus hojas sin problemas a medida que se ejecutan los flujos de trabajo. Perfecto para mantener registros en tiempo real sin entrada manual.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cO86qTj7qeY"
  title="Usa la herramienta Escribir de Google Sheets en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Explora cómo aprovechar la herramienta "Actualizar" de Google Sheets en Sim para modificar entradas existentes en tus hojas de cálculo basadas en la ejecución del flujo de trabajo. Este tutorial demuestra cómo configurar la lógica de actualización, mapear campos de datos y sincronizar cambios instantáneamente. Perfecto para mantener tus datos actualizados y consistentes.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/95by2fL9yn4"
  title="Usa la herramienta de actualización de Google Sheets en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Aprende a usar la herramienta "Añadir" de Google Sheets en Sim para agregar sin esfuerzo nuevas filas de datos a tus hojas de cálculo durante la ejecución del flujo de trabajo. Este tutorial te guía a través de la configuración de la integración, la configuración de acciones de añadir y asegurando un crecimiento fluido de datos. ¡Perfecto para expandir registros sin esfuerzo manual!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/8DgNvLBCsAo"
  title="Usa la herramienta Añadir de Google Sheets en Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Con Google Sheets, puedes:

- **Crear y editar hojas de cálculo**: Desarrolla documentos basados en datos con opciones completas de formato y cálculo
- **Colaborar en tiempo real**: Trabaja simultáneamente con múltiples usuarios en la misma hoja de cálculo
- **Analizar datos**: Usa fórmulas, funciones y tablas dinámicas para procesar y entender tus datos
- **Visualizar información**: Crea gráficos, diagramas y formato condicional para representar datos visualmente
- **Acceder desde cualquier lugar**: Usa Google Sheets en diferentes dispositivos con sincronización automática en la nube
- **Trabajar sin conexión**: Continúa trabajando sin conexión a internet con cambios que se sincronizan cuando vuelves a estar en línea
- **Integrar con otros servicios**: Conéctate con Google Drive, Forms y aplicaciones de terceros

En Sim, la integración con Google Sheets permite a tus agentes interactuar directamente con datos de hojas de cálculo de forma programática. Esto permite potentes escenarios de automatización como extracción de datos, análisis, informes y gestión. Tus agentes pueden leer hojas de cálculo existentes para extraer información, escribir en hojas de cálculo para actualizar datos y crear nuevas hojas de cálculo desde cero. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la gestión de datos, permitiendo una interacción fluida con datos estructurados. Al conectar Sim con Google Sheets, puedes automatizar flujos de trabajo de datos, generar informes, extraer información de los datos y mantener información actualizada - todo a través de tus agentes inteligentes. La integración admite varios formatos de datos y especificaciones de rangos, haciéndola lo suficientemente flexible para manejar diversas necesidades de gestión de datos mientras mantiene la naturaleza colaborativa y accesible de Google Sheets.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Google Sheets en el flujo de trabajo. Puede leer, escribir, añadir y actualizar datos. Requiere OAuth.

## Herramientas

### `google_sheets_read`

Leer datos de una hoja de cálculo de Google Sheets

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo \(se encuentra en la URL: docs.google.com/spreadsheets/d/\{SPREADSHEET_ID\}/edit\). |
| `range` | string | No | El rango en notación A1 para leer \(por ejemplo, "Sheet1!A1:D10", "A1:B5"\). Si no se especifica, por defecto es la primera hoja A1:Z1000. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | json | Datos de la hoja incluyendo rango y valores de celdas |
| `metadata` | json | Metadatos de la hoja de cálculo incluyendo ID y URL |

### `google_sheets_write`

Escribir datos en una hoja de cálculo de Google Sheets

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo |
| `range` | string | No | El rango en notación A1 donde escribir \(por ejemplo, "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | Sí | Los datos a escribir como un array 2D \(por ejemplo, \[\["Nombre", "Edad"\], \["Alice", 30\], \["Bob", 25\]\]\) o array de objetos. |
| `valueInputOption` | string | No | El formato de los datos a escribir |
| `includeValuesInResponse` | boolean | No | Si se deben incluir los valores escritos en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updatedRange` | string | Rango de celdas que fueron actualizadas |
| `updatedRows` | number | Número de filas actualizadas |
| `updatedColumns` | number | Número de columnas actualizadas |
| `updatedCells` | number | Número de celdas actualizadas |
| `metadata` | json | Metadatos de la hoja de cálculo incluyendo ID y URL |

### `google_sheets_update`

Actualizar datos en una hoja de cálculo de Google Sheets

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo a actualizar |
| `range` | string | No | El rango en notación A1 para actualizar \(por ejemplo, "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | Sí | Los datos para actualizar como un array 2D \(por ejemplo, \[\["Nombre", "Edad"\], \["Alice", 30\]\]\) o array de objetos. |
| `valueInputOption` | string | No | El formato de los datos a actualizar |
| `includeValuesInResponse` | boolean | No | Si se deben incluir los valores actualizados en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updatedRange` | string | Rango de celdas que fueron actualizadas |
| `updatedRows` | number | Número de filas actualizadas |
| `updatedColumns` | number | Número de columnas actualizadas |
| `updatedCells` | number | Número de celdas actualizadas |
| `metadata` | json | Metadatos de la hoja de cálculo incluyendo ID y URL |

### `google_sheets_append`

Añadir datos al final de una hoja de cálculo de Google Sheets

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `spreadsheetId` | string | Sí | El ID de la hoja de cálculo a la que añadir datos |
| `range` | string | No | El rango en notación A1 después del cual añadir datos (ej. "Hoja1", "Hoja1!A:D") |
| `values` | array | Sí | Los datos a añadir como un array 2D (ej. [["Alice", 30], ["Bob", 25]]) o array de objetos. |
| `valueInputOption` | string | No | El formato de los datos a añadir |
| `insertDataOption` | string | No | Cómo insertar los datos (OVERWRITE o INSERT_ROWS) |
| `includeValuesInResponse` | boolean | No | Si se deben incluir los valores añadidos en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tableRange` | string | Rango de la tabla donde se añadieron los datos |
| `updatedRange` | string | Rango de celdas que fueron actualizadas |
| `updatedRows` | number | Número de filas actualizadas |
| `updatedColumns` | number | Número de columnas actualizadas |
| `updatedCells` | number | Número de celdas actualizadas |
| `metadata` | json | Metadatos de la hoja de cálculo incluyendo ID y URL |

## Notas

- Categoría: `tools`
- Tipo: `google_sheets`
```

--------------------------------------------------------------------------------

````
