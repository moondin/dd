---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 110
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 110 of 933)

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

---[FILE: dropbox.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/dropbox.mdx

```text
---
title: Dropbox
description: Sube, descarga, comparte y gestiona archivos en Dropbox
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dropbox"
  color="#0061FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Dropbox](https://dropbox.com/) es una popular plataforma de almacenamiento en la nube y colaboración que permite a individuos y equipos almacenar, acceder y compartir archivos de forma segura desde cualquier lugar. Dropbox está diseñado para facilitar la gestión de archivos, la sincronización y una potente colaboración, ya sea que trabajes solo o en grupo.

Con Dropbox en Sim, puedes:

- **Subir y descargar archivos**: Sube cualquier archivo a tu Dropbox o recupera contenido bajo demanda sin problemas
- **Listar contenidos de carpetas**: Navega por los archivos y carpetas dentro de cualquier directorio de Dropbox
- **Crear nuevas carpetas**: Organiza tus archivos creando programáticamente nuevas carpetas en tu Dropbox
- **Buscar archivos y carpetas**: Localiza documentos, imágenes u otros elementos por nombre o contenido
- **Generar enlaces compartidos**: Crea rápidamente enlaces públicos o privados compartibles para archivos y carpetas
- **Gestionar archivos**: Mueve, elimina o renombra archivos y carpetas como parte de flujos de trabajo automatizados

Estas capacidades permiten a tus agentes Sim automatizar operaciones de Dropbox directamente dentro de tus flujos de trabajo — desde hacer copias de seguridad de archivos importantes hasta distribuir contenido y mantener carpetas organizadas. Usa Dropbox como fuente y destino para archivos, permitiendo una gestión fluida del almacenamiento en la nube como parte de tus procesos de negocio.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Dropbox en tu flujo de trabajo para la gestión de archivos, compartir y colaboración. Sube archivos, descarga contenido, crea carpetas, gestiona enlaces compartidos y más.

## Herramientas

### `dropbox_upload`

Subir un archivo a Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | string | Sí | La ruta en Dropbox donde se guardará el archivo \(p. ej., /carpeta/documento.pdf\) |
| `fileContent` | string | Sí | El contenido codificado en base64 del archivo a subir |
| `fileName` | string | No | Nombre de archivo opcional \(usado si la ruta es una carpeta\) |
| `mode` | string | No | Modo de escritura: add \(predeterminado\) u overwrite |
| `autorename` | boolean | No | Si es true, renombra el archivo si hay un conflicto |
| `mute` | boolean | No | Si es true, no notifica al usuario sobre esta subida |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | object | Los metadatos del archivo subido |

### `dropbox_download`

Descargar un archivo de Dropbox y obtener un enlace temporal

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | string | Sí | La ruta del archivo a descargar \(p. ej., /carpeta/documento.pdf\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | object | Los metadatos del archivo |

### `dropbox_list_folder`

Listar el contenido de una carpeta en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | string | Sí | La ruta de la carpeta a listar \(usar "" para la raíz\) |
| `recursive` | boolean | No | Si es verdadero, lista el contenido recursivamente |
| `includeDeleted` | boolean | No | Si es verdadero, incluye archivos/carpetas eliminados |
| `includeMediaInfo` | boolean | No | Si es verdadero, incluye información multimedia para fotos/videos |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 500\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `entries` | array | Lista de archivos y carpetas en el directorio |

### `dropbox_create_folder`

Crear una nueva carpeta en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | string | Sí | La ruta donde se debe crear la carpeta \(p. ej., /nueva-carpeta\) |
| `autorename` | boolean | No | Si es verdadero, renombra la carpeta si hay un conflicto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `folder` | objeto | Los metadatos de la carpeta creada |

### `dropbox_delete`

Eliminar un archivo o carpeta en Dropbox (mueve a la papelera)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | cadena | Sí | La ruta del archivo o carpeta a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `metadata` | objeto | Metadatos del elemento eliminado |

### `dropbox_copy`

Copiar un archivo o carpeta en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fromPath` | cadena | Sí | La ruta de origen del archivo o carpeta a copiar |
| `toPath` | cadena | Sí | La ruta de destino para el archivo o carpeta copiado |
| `autorename` | booleano | No | Si es verdadero, renombra el archivo si hay un conflicto en el destino |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `metadata` | objeto | Metadatos del elemento copiado |

### `dropbox_move`

Mover o renombrar un archivo o carpeta en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `fromPath` | cadena | Sí | La ruta de origen del archivo o carpeta a mover |
| `toPath` | cadena | Sí | La ruta de destino para el archivo o carpeta movido |
| `autorename` | booleano | No | Si es verdadero, renombra el archivo si hay un conflicto en el destino |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `metadata` | object | Metadatos del elemento movido |

### `dropbox_get_metadata`

Obtener metadatos de un archivo o carpeta en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | string | Sí | La ruta del archivo o carpeta del que obtener metadatos |
| `includeMediaInfo` | boolean | No | Si es verdadero, incluye información multimedia para fotos/videos |
| `includeDeleted` | boolean | No | Si es verdadero, incluye archivos eliminados en los resultados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `metadata` | object | Metadatos del archivo o carpeta |

### `dropbox_create_shared_link`

Crear un enlace compartible para un archivo o carpeta en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `path` | string | Sí | La ruta del archivo o carpeta a compartir |
| `requestedVisibility` | string | No | Visibilidad: public, team_only, o password |
| `linkPassword` | string | No | Contraseña para el enlace compartido \(solo si la visibilidad es password\) |
| `expires` | string | No | Fecha de caducidad en formato ISO 8601 \(p. ej., 2025-12-31T23:59:59Z\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `sharedLink` | object | El enlace compartido creado |

### `dropbox_search`

Buscar archivos y carpetas en Dropbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda |
| `path` | string | No | Limitar la búsqueda a una ruta de carpeta específica |
| `fileExtensions` | string | No | Lista separada por comas de extensiones de archivo para filtrar \(p. ej., pdf,xlsx\) |
| `maxResults` | number | No | Número máximo de resultados a devolver \(predeterminado: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `matches` | array | Resultados de la búsqueda |

## Notas

- Categoría: `tools`
- Tipo: `dropbox`
```

--------------------------------------------------------------------------------

---[FILE: duckduckgo.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/duckduckgo.mdx

```text
---
title: DuckDuckGo
description: Busca con DuckDuckGo
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="duckduckgo"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DuckDuckGo](https://duckduckgo.com/) es un motor de búsqueda web enfocado en la privacidad que ofrece respuestas instantáneas, resúmenes, temas relacionados y más, sin rastrear a ti o tus búsquedas. DuckDuckGo facilita encontrar información sin perfiles de usuario ni anuncios dirigidos.

Con DuckDuckGo en Sim, puedes:

- **Buscar en la web**: Encuentra instantáneamente respuestas, hechos y resúmenes para una consulta de búsqueda determinada
- **Obtener respuestas directas**: Recibe respuestas específicas para cálculos, conversiones o consultas factuales
- **Acceder a resúmenes**: Recibe breves sumarios o descripciones para tus temas de búsqueda
- **Obtener temas relacionados**: Descubre enlaces y referencias relevantes para tu búsqueda
- **Filtrar resultados**: Opcionalmente elimina HTML o evita la desambiguación para obtener resultados más limpios

Estas características permiten a tus agentes Sim automatizar el acceso a conocimientos web actualizados, desde mostrar hechos en un flujo de trabajo hasta enriquecer documentos y análisis con información actualizada. Como la API de Respuestas Instantáneas de DuckDuckGo es abierta y no requiere una clave API, es simple y segura para la privacidad al integrarla en tus procesos de negocio automatizados.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Busca en la web usando la API de Respuestas Instantáneas de DuckDuckGo. Devuelve respuestas instantáneas, resúmenes, temas relacionados y más. Uso gratuito sin necesidad de clave API.

## Herramientas

### `duckduckgo_search`

Busca en la web usando la API de Respuestas Instantáneas de DuckDuckGo. Devuelve respuestas instantáneas, resúmenes y temas relacionados para tu consulta. Uso gratuito sin necesidad de clave API.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda a ejecutar |
| `noHtml` | boolean | No | Eliminar HTML del texto en los resultados \(predeterminado: true\) |
| `skipDisambig` | boolean | No | Omitir resultados de desambiguación \(predeterminado: false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `heading` | string | El encabezado/título de la respuesta instantánea |
| `abstract` | string | Un breve resumen abstracto del tema |
| `abstractText` | string | Versión en texto plano del resumen |
| `abstractSource` | string | La fuente del resumen \(p. ej., Wikipedia\) |
| `abstractURL` | string | URL a la fuente del resumen |
| `image` | string | URL a una imagen relacionada con el tema |
| `answer` | string | Respuesta directa si está disponible \(p. ej., para cálculos\) |
| `answerType` | string | Tipo de respuesta \(p. ej., calc, ip, etc.\) |
| `type` | string | Tipo de respuesta: A \(artículo\), D \(desambiguación\), C \(categoría\), N \(nombre\), E \(exclusivo\) |
| `relatedTopics` | array | Array de temas relacionados con URLs y descripciones |

## Notas

- Categoría: `tools`
- Tipo: `duckduckgo`
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/dynamodb.mdx

```text
---
title: Amazon DynamoDB
description: Conectar a Amazon DynamoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dynamodb"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) es un servicio de base de datos NoSQL completamente administrado ofrecido por AWS que proporciona un rendimiento rápido y predecible con escalabilidad perfecta. DynamoDB te permite almacenar y recuperar cualquier cantidad de datos y atender cualquier nivel de tráfico de solicitudes, sin necesidad de administrar hardware o infraestructura.

Con DynamoDB, puedes:

- **Obtener elementos**: Buscar elementos en tus tablas usando claves primarias
- **Poner elementos**: Añadir o reemplazar elementos en tus tablas
- **Consultar elementos**: Recuperar múltiples elementos usando consultas a través de índices
- **Escanear tablas**: Leer todos o parte de los datos en una tabla
- **Actualizar elementos**: Modificar atributos específicos de elementos existentes
- **Eliminar elementos**: Eliminar registros de tus tablas

En Sim, la integración con DynamoDB permite a tus agentes acceder y manipular de forma segura las tablas de DynamoDB utilizando credenciales de AWS. Las operaciones compatibles incluyen:

- **Get**: Recuperar un elemento por su clave
- **Put**: Insertar o sobrescribir elementos
- **Query**: Ejecutar consultas utilizando condiciones de clave y filtros
- **Scan**: Leer múltiples elementos escaneando la tabla o índice
- **Update**: Cambiar atributos específicos de uno o más elementos
- **Delete**: Eliminar un elemento de una tabla

Esta integración permite a los agentes de Sim automatizar tareas de gestión de datos dentro de tus tablas de DynamoDB de forma programática, para que puedas crear flujos de trabajo que gestionen, modifiquen y recuperen datos NoSQL escalables sin esfuerzo manual ni gestión de servidores.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Amazon DynamoDB en flujos de trabajo. Compatible con operaciones Get, Put, Query, Scan, Update y Delete en tablas de DynamoDB.

## Herramientas

### `dynamodb_get`

Obtener un elemento de una tabla DynamoDB mediante clave primaria

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS \(p. ej., us-east-1\) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `tableName` | string | Sí | Nombre de la tabla DynamoDB |
| `key` | object | Sí | Clave primaria del elemento a recuperar |
| `consistentRead` | boolean | No | Usar lectura fuertemente consistente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `item` | object | Elemento recuperado |

### `dynamodb_put`

Poner un elemento en una tabla DynamoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS \(p. ej., us-east-1\) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `tableName` | string | Sí | Nombre de la tabla DynamoDB |
| `item` | object | Sí | Elemento a poner en la tabla |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `item` | object | Elemento creado |

### `dynamodb_query`

Consultar elementos de una tabla DynamoDB usando condiciones de clave

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS \(p. ej., us-east-1\) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `tableName` | string | Sí | Nombre de la tabla DynamoDB |
| `keyConditionExpression` | string | Sí | Expresión de condición de clave \(p. ej., "pk = :pk"\) |
| `filterExpression` | string | No | Expresión de filtro para resultados |
| `expressionAttributeNames` | object | No | Mapeos de nombres de atributos para palabras reservadas |
| `expressionAttributeValues` | object | No | Valores de atributos de expresión |
| `indexName` | string | No | Nombre del índice secundario para consultar |
| `limit` | number | No | Número máximo de elementos a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `items` | array | Array de elementos devueltos |
| `count` | number | Número de elementos devueltos |

### `dynamodb_scan`

Escanear todos los elementos en una tabla DynamoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS \(p. ej., us-east-1\) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `tableName` | string | Sí | Nombre de la tabla DynamoDB |
| `filterExpression` | string | No | Expresión de filtro para resultados |
| `projectionExpression` | string | No | Atributos a recuperar |
| `expressionAttributeNames` | object | No | Mapeos de nombres de atributos para palabras reservadas |
| `expressionAttributeValues` | object | No | Valores de atributos de expresión |
| `limit` | number | No | Número máximo de elementos a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `items` | array | Array de elementos devueltos |
| `count` | number | Número de elementos devueltos |

### `dynamodb_update`

Actualizar un elemento en una tabla de DynamoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS \(p. ej., us-east-1\) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `tableName` | string | Sí | Nombre de la tabla de DynamoDB |
| `key` | object | Sí | Clave primaria del elemento a actualizar |
| `updateExpression` | string | Sí | Expresión de actualización \(p. ej., "SET #name = :name"\) |
| `expressionAttributeNames` | object | No | Mapeos de nombres de atributos para palabras reservadas |
| `expressionAttributeValues` | object | No | Valores de atributos de expresión |
| `conditionExpression` | string | No | Condición que debe cumplirse para que la actualización tenga éxito |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `item` | object | Elemento actualizado |

### `dynamodb_delete`

Eliminar un elemento de una tabla de DynamoDB

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS \(p. ej., us-east-1\) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `tableName` | string | Sí | Nombre de la tabla de DynamoDB |
| `key` | object | Sí | Clave primaria del elemento a eliminar |
| `conditionExpression` | string | No | Condición que debe cumplirse para que la eliminación tenga éxito |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |

## Notas

- Categoría: `tools`
- Tipo: `dynamodb`
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/elasticsearch.mdx

```text
---
title: Elasticsearch
description: Busca, indexa y gestiona datos en Elasticsearch
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elasticsearch"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Elasticsearch](https://www.elastic.co/elasticsearch/) es un potente motor de búsqueda y análisis distribuido que te permite indexar, buscar y analizar grandes volúmenes de datos en tiempo real. Es ampliamente utilizado para potenciar funciones de búsqueda, análisis de datos de registros y eventos, observabilidad y más.

Con Elasticsearch en Sim, obtienes acceso programático a las capacidades principales de Elasticsearch, incluyendo:

- **Búsqueda de documentos**: Realiza búsquedas avanzadas en texto estructurado o no estructurado utilizando Query DSL, con soporte para ordenación, paginación y selección de campos.
- **Indexación de documentos**: Añade nuevos documentos o actualiza los existentes en cualquier índice de Elasticsearch para su recuperación y análisis inmediatos.
- **Obtener, actualizar o eliminar documentos**: Recupera, modifica o elimina documentos específicos por ID.
- **Operaciones masivas**: Ejecuta múltiples acciones de indexación o actualización en una sola solicitud para un procesamiento de datos de alto rendimiento.
- **Gestión de índices**: Crea, elimina u obtén detalles sobre índices como parte de tu automatización de flujo de trabajo.
- **Monitorización de clústeres**: Comprueba la salud y las estadísticas de tu despliegue de Elasticsearch.

Las herramientas de Elasticsearch de Sim funcionan tanto con entornos autoalojados como con Elastic Cloud. Integra Elasticsearch en tus flujos de trabajo de agentes para automatizar la ingesta de datos, buscar en vastos conjuntos de datos, ejecutar informes o construir aplicaciones personalizadas basadas en búsquedas, todo sin intervención manual.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Elasticsearch en flujos de trabajo para búsquedas potentes, indexación y gestión de datos. Admite operaciones CRUD de documentos, consultas de búsqueda avanzadas, operaciones masivas, gestión de índices y monitorización de clústeres. Funciona tanto con despliegues autoalojados como con Elastic Cloud.

## Herramientas

### `elasticsearch_search`

Busca documentos en Elasticsearch usando Query DSL. Devuelve documentos coincidentes con puntuaciones y metadatos.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch (para self-hosted) |
| `cloudId` | string | No | ID de Elastic Cloud (para despliegues en la nube) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice para buscar |
| `query` | string | No | Query DSL como cadena JSON |
| `from` | number | No | Desplazamiento inicial para paginación (predeterminado: 0) |
| `size` | number | No | Número de resultados a devolver (predeterminado: 10) |
| `sort` | string | No | Especificación de ordenación como cadena JSON |
| `sourceIncludes` | string | No | Lista separada por comas de campos a incluir en _source |
| `sourceExcludes` | string | No | Lista separada por comas de campos a excluir de _source |
| `trackTotalHits` | boolean | No | Seguimiento preciso del recuento total de coincidencias (predeterminado: true) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `took` | number | Tiempo en milisegundos que tardó la búsqueda |
| `timed_out` | boolean | Si la búsqueda agotó el tiempo de espera |
| `hits` | object | Resultados de búsqueda con recuento total y documentos coincidentes |
| `aggregations` | json | Resultados de agregación si los hay |

### `elasticsearch_index_document`

Indexar (crear o actualizar) un documento en Elasticsearch.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en cloud\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice de destino |
| `documentId` | string | No | ID del documento \(se genera automáticamente si no se proporciona\) |
| `document` | string | Sí | Cuerpo del documento como cadena JSON |
| `refresh` | string | No | Política de actualización: true, false o wait_for |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `_index` | string | Índice donde se almacenó el documento |
| `_id` | string | ID del documento |
| `_version` | number | Versión del documento |
| `result` | string | Resultado de la operación \(created o updated\) |

### `elasticsearch_get_document`

Recuperar un documento por ID desde Elasticsearch.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en cloud\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice |
| `documentId` | string | Sí | ID del documento a recuperar |
| `sourceIncludes` | string | No | Lista separada por comas de campos a incluir |
| `sourceExcludes` | string | No | Lista separada por comas de campos a excluir |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `_index` | string | Nombre del índice |
| `_id` | string | ID del documento |
| `_version` | number | Versión del documento |
| `found` | boolean | Si el documento fue encontrado |
| `_source` | json | Contenido del documento |

### `elasticsearch_update_document`

Actualiza parcialmente un documento en Elasticsearch usando la fusión de documentos.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch (para self-hosted) |
| `cloudId` | string | No | ID de Elastic Cloud (para despliegues en la nube) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice |
| `documentId` | string | Sí | ID del documento a actualizar |
| `document` | string | Sí | Documento parcial para fusionar como cadena JSON |
| `retryOnConflict` | number | No | Número de reintentos en conflicto de versión |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `_index` | string | Nombre del índice |
| `_id` | string | ID del documento |
| `_version` | number | Nueva versión del documento |
| `result` | string | Resultado de la operación (updated o noop) |

### `elasticsearch_delete_document`

Elimina un documento de Elasticsearch por ID.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice |
| `documentId` | string | Sí | ID del documento a eliminar |
| `refresh` | string | No | Política de actualización: true, false o wait_for |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `_index` | string | Nombre del índice |
| `_id` | string | ID del documento |
| `_version` | number | Versión del documento |
| `result` | string | Resultado de la operación \(deleted o not_found\) |

### `elasticsearch_bulk`

Realiza múltiples operaciones de indexación, creación, eliminación o actualización en una sola petición para un alto rendimiento.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | No | Índice predeterminado para operaciones que no especifican uno |
| `operations` | string | Sí | Operaciones masivas como cadena NDJSON \(JSON delimitado por nuevas líneas\) |
| `refresh` | string | No | Política de actualización: true, false o wait_for |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `took` | number | Tiempo en milisegundos que tardó la operación masiva |
| `errors` | boolean | Si alguna operación tuvo un error |
| `items` | array | Resultados para cada operación |

### `elasticsearch_count`

Contar documentos que coinciden con una consulta en Elasticsearch.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice donde contar documentos |
| `query` | string | No | Consulta opcional para filtrar documentos \(cadena JSON\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `count` | number | Número de documentos que coinciden con la consulta |
| `_shards` | object | Estadísticas de fragmentos |

### `elasticsearch_create_index`

Crear un nuevo índice con configuraciones y mapeos opcionales.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice a crear |
| `settings` | string | No | Configuraciones del índice como cadena JSON |
| `mappings` | string | No | Mapeos del índice como cadena JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Si la solicitud fue reconocida |
| `shards_acknowledged` | boolean | Si los fragmentos fueron reconocidos |
| `index` | string | Nombre del índice creado |

### `elasticsearch_delete_index`

Elimina un índice y todos sus documentos. Esta operación es irreversible.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Si la eliminación fue reconocida |

### `elasticsearch_get_index`

Recupera información del índice incluyendo configuraciones, mapeos y alias.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `index` | string | Sí | Nombre del índice del que recuperar información |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `index` | json | Información del índice incluyendo alias, mapeos y configuraciones |

### `elasticsearch_cluster_health`

Obtener el estado de salud del clúster de Elasticsearch.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch \(para self-hosted\) |
| `cloudId` | string | No | ID de Elastic Cloud \(para despliegues en la nube\) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |
| `waitForStatus` | string | No | Esperar hasta que el clúster alcance este estado: green, yellow o red |
| `timeout` | string | No | Tiempo de espera para la operación de espera \(p. ej., 30s, 1m\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `cluster_name` | string | Nombre del clúster |
| `status` | string | Estado de salud del clúster: green, yellow o red |
| `number_of_nodes` | number | Número total de nodos en el clúster |
| `number_of_data_nodes` | number | Número de nodos de datos |
| `active_shards` | number | Número de fragmentos activos |
| `unassigned_shards` | number | Número de fragmentos no asignados |

### `elasticsearch_cluster_stats`

Obtén estadísticas completas sobre el clúster de Elasticsearch.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `deploymentType` | string | Sí | Tipo de despliegue: self_hosted o cloud |
| `host` | string | No | URL del host de Elasticsearch (para self-hosted) |
| `cloudId` | string | No | ID de Elastic Cloud (para despliegues en la nube) |
| `authMethod` | string | Sí | Método de autenticación: api_key o basic_auth |
| `apiKey` | string | No | Clave API de Elasticsearch |
| `username` | string | No | Nombre de usuario para autenticación básica |
| `password` | string | No | Contraseña para autenticación básica |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `cluster_name` | string | Nombre del clúster |
| `status` | string | Estado de salud del clúster |
| `nodes` | object | Estadísticas de nodos incluyendo recuento y versiones |
| `indices` | object | Estadísticas de índices incluyendo recuento de documentos y tamaño de almacenamiento |

## Notas

- Categoría: `tools`
- Tipo: `elasticsearch`
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/elevenlabs.mdx

```text
---
title: ElevenLabs
description: Convertir TTS usando ElevenLabs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elevenlabs"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[ElevenLabs](https://elevenlabs.io/) es una plataforma de texto a voz de última generación que crea voces de IA increíblemente naturales y expresivas. Ofrece algunas de las voces sintéticas más realistas y emocionalmente matizadas disponibles actualmente, lo que la hace ideal para crear contenido de audio realista.

Con ElevenLabs, puedes:

- **Generar voz de sonido natural**: Crear audio casi indistinguible del habla humana
- **Elegir entre diversas opciones de voz**: Acceder a una biblioteca de voces prediseñadas con diferentes acentos, tonos y características
- **Clonar voces**: Crear voces personalizadas basadas en muestras de audio (con los permisos adecuados)
- **Controlar parámetros del habla**: Ajustar estabilidad, claridad y tono emocional para perfeccionar el resultado
- **Añadir emociones realistas**: Incorporar emociones de sonido natural como felicidad, tristeza o entusiasmo

En Sim, la integración de ElevenLabs permite a tus agentes convertir texto en voz realista, mejorando la interactividad y el compromiso de tus aplicaciones. Esto es particularmente valioso para crear asistentes de voz, generar contenido de audio, desarrollar aplicaciones accesibles o construir interfaces conversacionales que se sientan más humanas. La integración te permite incorporar sin problemas las capacidades avanzadas de síntesis de voz de ElevenLabs en los flujos de trabajo de tus agentes, cerrando la brecha entre la IA basada en texto y la comunicación humana natural.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra ElevenLabs en el flujo de trabajo. Puede convertir texto a voz. Requiere clave API.

## Herramientas

### `elevenlabs_tts`

Convertir TTS usando voces de ElevenLabs

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `voiceId` | string | Sí | El ID de la voz a utilizar |
| `modelId` | string | No | El ID del modelo a utilizar \(por defecto es eleven_monolingual_v1\) |
| `apiKey` | string | Sí | Tu clave API de ElevenLabs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | La URL del audio generado |
| `audioFile` | file | El archivo de audio generado |

## Notas

- Categoría: `tools`
- Tipo: `elevenlabs`
```

--------------------------------------------------------------------------------

````
