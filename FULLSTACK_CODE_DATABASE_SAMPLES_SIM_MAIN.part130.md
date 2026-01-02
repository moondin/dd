---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 130
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 130 of 933)

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

---[FILE: qdrant.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/qdrant.mdx

```text
---
title: Qdrant
description: Usa la base de datos vectorial Qdrant
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="qdrant"
  color="#1A223F"
/>

{/* MANUAL-CONTENT-START:intro */}
[Qdrant](https://qdrant.tech) es una base de datos vectorial de código abierto diseñada para el almacenamiento, gestión y recuperación eficiente de embeddings vectoriales de alta dimensionalidad. Qdrant permite búsquedas semánticas rápidas y escalables, lo que la hace ideal para aplicaciones de IA que requieren búsqueda por similitud, sistemas de recomendación y recuperación de información contextual.

Con Qdrant, puedes:

- **Almacenar embeddings vectoriales**: Gestionar y persistir vectores de alta dimensionalidad de manera eficiente y a escala
- **Realizar búsquedas de similitud semántica**: Encontrar los vectores más similares a un vector de consulta en tiempo real
- **Filtrar y organizar datos**: Utilizar filtrado avanzado para refinar los resultados de búsqueda basados en metadatos o payload
- **Obtener puntos específicos**: Recuperar vectores y sus payloads asociados por ID
- **Escalar sin problemas**: Manejar grandes colecciones y cargas de trabajo de alto rendimiento

En Sim, la integración con Qdrant permite a tus agentes interactuar con Qdrant de forma programática como parte de sus flujos de trabajo. Las operaciones compatibles incluyen:

- **Upsert**: Insertar o actualizar puntos (vectores y cargas útiles) en una colección de Qdrant
- **Search**: Realizar búsquedas de similitud para encontrar vectores más similares a un vector de consulta dado, con filtrado opcional y personalización de resultados
- **Fetch**: Recuperar puntos específicos de una colección por sus IDs, con opciones para incluir cargas útiles y vectores

Esta integración permite a tus agentes aprovechar potentes capacidades de búsqueda y gestión de vectores, habilitando escenarios avanzados de automatización como búsqueda semántica, recomendaciones y recuperación contextual. Al conectar Sim con Qdrant, puedes crear agentes que entiendan el contexto, recuperen información relevante de grandes conjuntos de datos y ofrezcan respuestas más inteligentes y personalizadas, todo sin gestionar infraestructuras complejas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Qdrant en el flujo de trabajo. Puede insertar, buscar y recuperar puntos. Requiere clave API.

## Herramientas

### `qdrant_upsert_points`

Insertar o actualizar puntos en una colección de Qdrant

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Sí | URL base de Qdrant |
| `apiKey` | string | No | Clave API de Qdrant \(opcional\) |
| `collection` | string | Sí | Nombre de la colección |
| `points` | array | Sí | Array de puntos para upsert |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `status` | string | Estado de la operación upsert |
| `data` | object | Datos de resultado de la operación upsert |

### `qdrant_search_vector`

Buscar vectores similares en una colección de Qdrant

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Sí | URL base de Qdrant |
| `apiKey` | string | No | Clave API de Qdrant \(opcional\) |
| `collection` | string | Sí | Nombre de la colección |
| `vector` | array | Sí | Vector para buscar |
| `limit` | number | No | Número de resultados a devolver |
| `filter` | object | No | Filtro para aplicar a la búsqueda |
| `search_return_data` | string | No | Datos a devolver de la búsqueda |
| `with_payload` | boolean | No | Incluir payload en la respuesta |
| `with_vector` | boolean | No | Incluir vector en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | array | Resultados de búsqueda de vectores con ID, puntuación, payload y datos de vector opcionales |
| `status` | string | Estado de la operación de búsqueda |

### `qdrant_fetch_points`

Obtener puntos por ID desde una colección de Qdrant

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `url` | string | Sí | URL base de Qdrant |
| `apiKey` | string | No | Clave API de Qdrant \(opcional\) |
| `collection` | string | Sí | Nombre de la colección |
| `ids` | array | Sí | Array de IDs de puntos para recuperar |
| `fetch_return_data` | string | No | Datos a devolver de la recuperación |
| `with_payload` | boolean | No | Incluir payload en la respuesta |
| `with_vector` | boolean | No | Incluir vector en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | array | Puntos recuperados con ID, carga útil y datos vectoriales opcionales |
| `status` | string | Estado de la operación de recuperación |

## Notas

- Categoría: `tools`
- Tipo: `qdrant`
```

--------------------------------------------------------------------------------

---[FILE: rds.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/rds.mdx

```text
---
title: Amazon RDS
description: Conéctate a Amazon RDS a través de Data API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="rds"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon RDS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) es una base de datos relacional completamente administrada que se inicia, se apaga y escala automáticamente según las necesidades de tu aplicación. Te permite ejecutar bases de datos SQL en la nube sin tener que administrar servidores de bases de datos.

Con RDS Aurora Serverless, puedes:

- **Consultar datos**: Ejecutar consultas SQL flexibles en tus tablas
- **Insertar nuevos registros**: Añadir datos a tu base de datos automáticamente
- **Actualizar registros existentes**: Modificar datos en tus tablas usando filtros personalizados
- **Eliminar registros**: Quitar datos no deseados utilizando criterios precisos
- **Ejecutar SQL puro**: Ejecutar cualquier comando SQL válido compatible con Aurora

En Sim, la integración con RDS permite a tus agentes trabajar con bases de datos Amazon Aurora Serverless de forma segura y programática. Las operaciones compatibles incluyen:

- **Consulta**: Ejecutar SELECT y otras consultas SQL para obtener filas de tu base de datos
- **Inserción**: Insertar nuevos registros en tablas con datos estructurados
- **Actualización**: Cambiar datos en filas que coincidan con tus condiciones especificadas
- **Eliminación**: Eliminar registros de una tabla mediante filtros o criterios personalizados
- **Ejecución**: Ejecutar SQL puro para escenarios avanzados

Esta integración permite a tus agentes automatizar una amplia gama de operaciones de bases de datos sin intervención manual. Al conectar Sim con Amazon RDS, puedes crear agentes que gestionen, actualicen y recuperen datos relacionales dentro de tus flujos de trabajo, todo sin tener que manejar infraestructura o conexiones de bases de datos.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Amazon RDS Aurora Serverless en el flujo de trabajo utilizando la Data API. Puede consultar, insertar, actualizar, eliminar y ejecutar SQL puro sin administrar conexiones de base de datos.

## Herramientas

### `rds_query`

Ejecutar una consulta SELECT en Amazon RDS utilizando la API de datos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `resourceArn` | string | Sí | ARN del clúster de Aurora DB |
| `secretArn` | string | Sí | ARN del secreto de Secrets Manager que contiene las credenciales de la base de datos |
| `database` | string | No | Nombre de la base de datos (opcional) |
| `query` | string | Sí | Consulta SQL SELECT para ejecutar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas devueltas por la consulta |
| `rowCount` | number | Número de filas devueltas |

### `rds_insert`

Insertar datos en una tabla de Amazon RDS utilizando la API de datos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `resourceArn` | string | Sí | ARN del clúster de Aurora DB |
| `secretArn` | string | Sí | ARN del secreto de Secrets Manager que contiene las credenciales de la base de datos |
| `database` | string | No | Nombre de la base de datos (opcional) |
| `table` | string | Sí | Nombre de la tabla donde insertar |
| `data` | object | Sí | Datos a insertar como pares clave-valor |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas insertadas |
| `rowCount` | number | Número de filas insertadas |

### `rds_update`

Actualizar datos en una tabla de Amazon RDS utilizando la API de datos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `resourceArn` | string | Sí | ARN del clúster de Aurora DB |
| `secretArn` | string | Sí | ARN del secreto de Secrets Manager que contiene las credenciales de la base de datos |
| `database` | string | No | Nombre de la base de datos (opcional) |
| `table` | string | Sí | Nombre de la tabla a actualizar |
| `data` | object | Sí | Datos a actualizar como pares clave-valor |
| `conditions` | object | Sí | Condiciones para la actualización (p. ej., `{"id": 1}`) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas actualizadas |
| `rowCount` | number | Número de filas actualizadas |

### `rds_delete`

Eliminar datos de una tabla de Amazon RDS utilizando la API de datos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `resourceArn` | string | Sí | ARN del clúster de Aurora DB |
| `secretArn` | string | Sí | ARN del secreto de Secrets Manager que contiene las credenciales de la base de datos |
| `database` | string | No | Nombre de la base de datos (opcional) |
| `table` | string | Sí | Nombre de la tabla de la que eliminar |
| `conditions` | object | Sí | Condiciones para la eliminación (p. ej., `{"id": 1}`) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas eliminadas |
| `rowCount` | number | Número de filas eliminadas |

### `rds_execute`

Ejecutar SQL sin procesar en Amazon RDS usando la API de datos

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `resourceArn` | string | Sí | ARN del clúster de Aurora DB |
| `secretArn` | string | Sí | ARN del secreto de Secrets Manager que contiene las credenciales de la base de datos |
| `database` | string | No | Nombre de la base de datos (opcional) |
| `query` | string | Sí | Consulta SQL sin procesar para ejecutar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `rows` | array | Array de filas devueltas o afectadas |
| `rowCount` | number | Número de filas afectadas |

## Notas

- Categoría: `tools`
- Tipo: `rds`
```

--------------------------------------------------------------------------------

---[FILE: reddit.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/reddit.mdx

```text
---
title: Reddit
description: Accede a datos y contenido de Reddit
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="reddit"
  color="#FF5700"
/>

{/* MANUAL-CONTENT-START:intro */}
[Reddit](https://www.reddit.com/) es una plataforma social donde los usuarios comparten y discuten contenido en comunidades temáticas llamadas subreddits.

En Sim, puedes usar la integración de Reddit para:

- **Obtener publicaciones**: Recupera publicaciones de cualquier subreddit, con opciones para ordenar (Destacadas, Nuevas, Mejores, En ascenso) y filtrar las Mejores publicaciones por tiempo (Día, Semana, Mes, Año, Todo el tiempo).
- **Obtener comentarios**: Recupera comentarios de una publicación específica, con opciones para ordenar y establecer el número de comentarios.

Estas operaciones permiten a tus agentes acceder y analizar contenido de Reddit como parte de tus flujos de trabajo automatizados.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Reddit en flujos de trabajo. Lee publicaciones, comentarios y busca contenido. Envía publicaciones, vota, responde, edita y administra tu cuenta de Reddit.

## Herramientas

### `reddit_get_posts`

Obtener publicaciones de un subreddit con diferentes opciones de ordenación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Sí | El nombre del subreddit del que obtener publicaciones \(sin el prefijo r/\) |
| `sort` | string | No | Método de ordenación para publicaciones: "hot", "new", "top", o "rising" \(predeterminado: "hot"\) |
| `limit` | number | No | Número máximo de publicaciones a devolver \(predeterminado: 10, máximo: 100\) |
| `time` | string | No | Filtro de tiempo para publicaciones ordenadas por "top": "day", "week", "month", "year", o "all" \(predeterminado: "day"\) |
| `after` | string | No | Nombre completo de un elemento para obtener elementos posteriores \(para paginación\) |
| `before` | string | No | Nombre completo de un elemento para obtener elementos anteriores \(para paginación\) |
| `count` | number | No | Recuento de elementos ya vistos en el listado \(usado para numeración\) |
| `show` | string | No | Mostrar elementos que normalmente serían filtrados \(p. ej., "all"\) |
| `sr_detail` | boolean | No | Expandir detalles del subreddit en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `subreddit` | string | Nombre del subreddit del que se obtuvieron las publicaciones |
| `posts` | array | Array de publicaciones con título, autor, URL, puntuación, recuento de comentarios y metadatos |

### `reddit_get_comments`

Obtener comentarios de una publicación específica de Reddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `postId` | string | Sí | El ID de la publicación de Reddit de la que obtener comentarios |
| `subreddit` | string | Sí | El subreddit donde se encuentra la publicación \(sin el prefijo r/\) |
| `sort` | string | No | Método de ordenación para comentarios: "confidence", "top", "new", "controversial", "old", "random", "qa" \(predeterminado: "confidence"\) |
| `limit` | number | No | Número máximo de comentarios a devolver \(predeterminado: 50, máximo: 100\) |
| `depth` | number | No | Profundidad máxima de subárboles en el hilo \(controla niveles de comentarios anidados\) |
| `context` | number | No | Número de comentarios principales a incluir |
| `showedits` | boolean | No | Mostrar información de edición para comentarios |
| `showmore` | boolean | No | Incluir elementos "cargar más comentarios" en la respuesta |
| `showtitle` | boolean | No | Incluir título de la publicación en la respuesta |
| `threaded` | boolean | No | Devolver comentarios en formato anidado/jerarquizado |
| `truncate` | number | No | Entero para truncar la profundidad de comentarios |
| `after` | string | No | Nombre completo de un elemento para obtener elementos posteriores \(para paginación\) |
| `before` | string | No | Nombre completo de un elemento para obtener elementos anteriores \(para paginación\) |
| `count` | number | No | Recuento de elementos ya vistos en el listado \(usado para numeración\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `post` | object | Información de la publicación incluyendo ID, título, autor, contenido y metadatos |

### `reddit_get_controversial`

Obtener publicaciones controvertidas de un subreddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Sí | El nombre del subreddit del que obtener publicaciones \(sin el prefijo r/\) |
| `time` | string | No | Filtro de tiempo para publicaciones controvertidas: "hour", "day", "week", "month", "year", o "all" \(predeterminado: "all"\) |
| `limit` | number | No | Número máximo de publicaciones a devolver \(predeterminado: 10, máximo: 100\) |
| `after` | string | No | Nombre completo de un elemento para obtener elementos posteriores \(para paginación\) |
| `before` | string | No | Nombre completo de un elemento para obtener elementos anteriores \(para paginación\) |
| `count` | number | No | Recuento de elementos ya vistos en el listado \(usado para numeración\) |
| `show` | string | No | Mostrar elementos que normalmente serían filtrados \(p. ej., "all"\) |
| `sr_detail` | boolean | No | Expandir detalles del subreddit en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `subreddit` | string | Nombre del subreddit del que se obtuvieron las publicaciones |
| `posts` | array | Array de publicaciones controvertidas con título, autor, URL, puntuación, recuento de comentarios y metadatos |

### `reddit_search`

Buscar publicaciones dentro de un subreddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Sí | El nombre del subreddit en el que buscar \(sin el prefijo r/\) |
| `query` | string | Sí | Texto de la consulta de búsqueda |
| `sort` | string | No | Método de ordenación para los resultados de búsqueda: "relevance", "hot", "top", "new", o "comments" \(predeterminado: "relevance"\) |
| `time` | string | No | Filtro de tiempo para los resultados de búsqueda: "hour", "day", "week", "month", "year", o "all" \(predeterminado: "all"\) |
| `limit` | number | No | Número máximo de publicaciones a devolver \(predeterminado: 10, máximo: 100\) |
| `restrict_sr` | boolean | No | Restringir la búsqueda solo al subreddit especificado \(predeterminado: true\) |
| `after` | string | No | Nombre completo de un elemento para obtener elementos posteriores \(para paginación\) |
| `before` | string | No | Nombre completo de un elemento para obtener elementos anteriores \(para paginación\) |
| `count` | number | No | Recuento de elementos ya vistos en el listado \(usado para numeración\) |
| `show` | string | No | Mostrar elementos que normalmente serían filtrados \(p. ej., "all"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `subreddit` | string | Nombre del subreddit donde se realizó la búsqueda |
| `posts` | array | Array de publicaciones de resultados de búsqueda con título, autor, URL, puntuación, recuento de comentarios y metadatos |

### `reddit_submit_post`

Enviar una nueva publicación a un subreddit (texto o enlace)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Sí | El nombre del subreddit donde publicar \(sin el prefijo r/\) |
| `title` | string | Sí | Título de la publicación \(máximo 300 caracteres\) |
| `text` | string | No | Contenido de texto para una publicación de texto \(admite markdown\) |
| `url` | string | No | URL para una publicación de enlace \(no se puede usar con texto\) |
| `nsfw` | boolean | No | Marcar publicación como NSFW |
| `spoiler` | boolean | No | Marcar publicación como spoiler |
| `send_replies` | boolean | No | Enviar notificaciones de respuesta a la bandeja de entrada \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la publicación se envió correctamente |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos de la publicación incluyendo ID, nombre, URL y enlace permanente |

### `reddit_vote`

Votar positivamente, negativamente o quitar el voto a una publicación o comentario de Reddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `id` | string | Sí | Nombre completo del elemento para votar \(p. ej., t3_xxxxx para publicación, t1_xxxxx para comentario\) |
| `dir` | number | Sí | Dirección del voto: 1 \(voto positivo\), 0 \(quitar voto\), o -1 \(voto negativo\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el voto fue exitoso |
| `message` | string | Mensaje de éxito o error |

### `reddit_save`

Guardar una publicación o comentario de Reddit en tus elementos guardados

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `id` | string | Sí | Nombre completo del elemento a guardar \(p. ej., t3_xxxxx para publicación, t1_xxxxx para comentario\) |
| `category` | string | No | Categoría bajo la cual guardar \(función de Reddit Gold\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si el guardado fue exitoso |
| `message` | string | Mensaje de éxito o error |

### `reddit_unsave`

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `subreddit` | string | Nombre del subreddit |
| `posts` | json | Datos de publicaciones |
| `post` | json | Datos de una sola publicación |
| `comments` | json | Datos de comentarios |

### `reddit_reply`

Añadir una respuesta de comentario a una publicación o comentario de Reddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `parent_id` | string | Sí | Nombre completo del elemento al que responder \(p. ej., t3_xxxxx para publicación, t1_xxxxx para comentario\) |
| `text` | string | Sí | Texto del comentario en formato markdown |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la respuesta se publicó correctamente |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del comentario incluyendo ID, nombre, permalink y cuerpo |

### `reddit_edit`

Editar el texto de tu propia publicación o comentario de Reddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `thing_id` | string | Sí | Nombre completo del elemento a editar \(p. ej., t3_xxxxx para publicación, t1_xxxxx para comentario\) |
| `text` | string | Sí | Nuevo contenido de texto en formato markdown |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la edición fue exitosa |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del contenido actualizado |

### `reddit_delete`

Eliminar tu propia publicación o comentario de Reddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `id` | string | Sí | Nombre completo del elemento a eliminar \(p. ej., t3_xxxxx para publicación, t1_xxxxx para comentario\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la eliminación fue exitosa |
| `message` | string | Mensaje de éxito o error |

### `reddit_subscribe`

Suscribirse o cancelar la suscripción a un subreddit

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Sí | El nombre del subreddit \(sin el prefijo r/\) |
| `action` | string | Sí | Acción a realizar: "sub" para suscribirse o "unsub" para cancelar la suscripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la acción de suscripción fue exitosa |
| `message` | string | Mensaje de éxito o error |

## Notas

- Categoría: `tools`
- Tipo: `reddit`
```

--------------------------------------------------------------------------------

---[FILE: resend.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/resend.mdx

```text
---
title: Resend
description: Envía correos electrónicos con Resend.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="resend"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Resend](https://resend.com/) es un servicio de correo electrónico moderno diseñado para que los desarrolladores envíen correos electrónicos transaccionales y de marketing con facilidad. Proporciona una API y un panel de control simples y confiables para gestionar la entrega de correos electrónicos, plantillas y análisis, lo que lo convierte en una opción popular para integrar funcionalidades de correo electrónico en aplicaciones y flujos de trabajo.

Con Resend, puedes:

- **Enviar correos electrónicos transaccionales**: Entrega restablecimientos de contraseña, notificaciones, confirmaciones y más con alta entregabilidad
- **Gestionar plantillas**: Crear y actualizar plantillas de correo electrónico para mantener una marca y mensajes consistentes
- **Seguir análisis**: Monitorear tasas de entrega, apertura y clics para optimizar el rendimiento de tus correos electrónicos
- **Integrar fácilmente**: Usar una API directa y SDKs para una integración perfecta con tus aplicaciones
- **Garantizar seguridad**: Beneficiarte de una sólida autenticación y verificación de dominio para proteger tu reputación de correo electrónico

En Sim, la integración con Resend permite a tus agentes enviar correos electrónicos de forma programática como parte de tus flujos de trabajo automatizados. Esto habilita casos de uso como el envío de notificaciones, alertas o mensajes personalizados directamente desde tus agentes impulsados por Sim. Al conectar Sim con Resend, puedes automatizar tareas de comunicación, asegurando una entrega de correos electrónicos oportuna y confiable sin intervención manual. La integración aprovecha tu clave API de Resend, manteniendo tus credenciales seguras mientras habilita potentes escenarios de automatización de correos electrónicos.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Resend en el flujo de trabajo. Puede enviar correos electrónicos. Requiere clave API.

## Herramientas

### `resend_send`

Envía un correo electrónico usando tu propia clave API de Resend y dirección de remitente

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `fromAddress` | string | Sí | Dirección de correo electrónico desde la que enviar |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `subject` | string | Sí | Asunto del correo electrónico |
| `body` | string | Sí | Contenido del cuerpo del correo electrónico |
| `contentType` | string | No | Tipo de contenido para el cuerpo del correo electrónico \(texto o html\) |
| `resendApiKey` | string | Sí | Clave API de Resend para enviar correos electrónicos |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el correo electrónico se envió correctamente |
| `to` | string | Dirección de correo electrónico del destinatario |
| `subject` | string | Asunto del correo electrónico |
| `body` | string | Contenido del cuerpo del correo electrónico |

## Notas

- Categoría: `tools`
- Tipo: `resend`
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/s3.mdx

```text
---
title: S3
description: Subir, descargar, listar y gestionar archivos S3
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="s3"
  color="linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon S3](https://aws.amazon.com/s3/) es un servicio de almacenamiento en la nube altamente escalable, seguro y duradero proporcionado por Amazon Web Services. Está diseñado para almacenar y recuperar cualquier cantidad de datos desde cualquier lugar en la web, lo que lo convierte en una de las soluciones de almacenamiento en la nube más utilizadas por empresas de todos los tamaños.

Con Amazon S3, puedes:

- **Almacenar datos ilimitados**: Subir archivos de cualquier tamaño y tipo con capacidad de almacenamiento prácticamente ilimitada
- **Acceder desde cualquier lugar**: Recuperar tus archivos desde cualquier parte del mundo con acceso de baja latencia
- **Garantizar la durabilidad de los datos**: Beneficiarte de una durabilidad del 99,999999999% (11 nueves) con replicación automática de datos
- **Controlar el acceso**: Gestionar permisos y controles de acceso con políticas de seguridad detalladas
- **Escalar automáticamente**: Manejar cargas de trabajo variables sin intervención manual ni planificación de capacidad
- **Integrar sin problemas**: Conectar fácilmente con otros servicios de AWS y aplicaciones de terceros
- **Optimizar costos**: Elegir entre múltiples clases de almacenamiento para optimizar costos según los patrones de acceso

En Sim, la integración con S3 permite a tus agentes recuperar y acceder a archivos almacenados en tus buckets de Amazon S3 utilizando URLs prefirmadas seguras. Esto permite potentes escenarios de automatización como procesamiento de documentos, análisis de datos almacenados, recuperación de archivos de configuración y acceso a contenido multimedia como parte de tus flujos de trabajo. Tus agentes pueden obtener archivos de S3 de forma segura sin exponer tus credenciales de AWS, facilitando la incorporación de activos almacenados en la nube a tus procesos de automatización. Esta integración cierra la brecha entre tu almacenamiento en la nube y los flujos de trabajo de IA, permitiendo un acceso fluido a tus datos almacenados mientras mantiene las mejores prácticas de seguridad a través de los robustos mecanismos de autenticación de AWS.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra S3 en el flujo de trabajo. Sube archivos, descarga objetos, lista contenidos de buckets, elimina objetos y copia objetos entre buckets. Requiere clave de acceso AWS y clave de acceso secreta.

## Herramientas

### `s3_put_object`

Subir un archivo a un bucket de AWS S3

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Sí | Tu ID de clave de acceso AWS |
| `secretAccessKey` | string | Sí | Tu clave de acceso secreta AWS |
| `region` | string | Sí | Región AWS (ej., us-east-1) |
| `bucketName` | string | Sí | Nombre del bucket S3 |
| `objectKey` | string | Sí | Clave/ruta del objeto en S3 (ej., carpeta/archivo.ext) |
| `file` | file | No | Archivo para subir |
| `content` | string | No | Contenido de texto para subir (alternativa al archivo) |
| `contentType` | string | No | Cabecera Content-Type (autodetectada del archivo si no se proporciona) |
| `acl` | string | No | Lista de control de acceso (ej., private, public-read) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `url` | string | URL del objeto S3 subido |
| `metadata` | object | Metadatos de subida incluyendo ETag y ubicación |

### `s3_get_object`

Recuperar un objeto de un bucket AWS S3

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Sí | Tu ID de clave de acceso AWS |
| `secretAccessKey` | string | Sí | Tu clave de acceso secreta AWS |
| `s3Uri` | string | Sí | URL del objeto S3 |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `url` | string | URL prefirmada para descargar el objeto S3 |
| `metadata` | object | Metadatos del archivo incluyendo tipo, tamaño, nombre y fecha de última modificación |

### `s3_list_objects`

Listar objetos en un bucket de AWS S3

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `accessKeyId` | string | Sí | Tu ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Tu clave de acceso secreta de AWS |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `bucketName` | string | Sí | Nombre del bucket S3 |
| `prefix` | string | No | Prefijo para filtrar objetos (p. ej., carpeta/) |
| `maxKeys` | number | No | Número máximo de objetos a devolver (predeterminado: 1000) |
| `continuationToken` | string | No | Token para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `objects` | array | Lista de objetos S3 |

### `s3_delete_object`

Eliminar un objeto de un bucket de AWS S3

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `accessKeyId` | string | Sí | Tu ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Tu clave de acceso secreta de AWS |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `bucketName` | string | Sí | Nombre del bucket S3 |
| `objectKey` | string | Sí | Clave/ruta del objeto a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indica si el objeto fue eliminado correctamente |
| `metadata` | object | Metadatos de la eliminación |

### `s3_copy_object`

Copiar un objeto dentro de o entre buckets de AWS S3

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `accessKeyId` | string | Sí | Tu ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Tu clave de acceso secreta de AWS |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `sourceBucket` | string | Sí | Nombre del bucket de origen |
| `sourceKey` | string | Sí | Clave/ruta del objeto de origen |
| `destinationBucket` | string | Sí | Nombre del bucket de destino |
| `destinationKey` | string | Sí | Clave/ruta del objeto de destino |
| `acl` | string | No | Lista de control de acceso para el objeto copiado (p. ej., private, public-read) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `url` | string | URL del objeto S3 copiado |
| `metadata` | object | Metadatos de la operación de copia |

## Notas

- Categoría: `tools`
- Tipo: `s3`
```

--------------------------------------------------------------------------------

````
