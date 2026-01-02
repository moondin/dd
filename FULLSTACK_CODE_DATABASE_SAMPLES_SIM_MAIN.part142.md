---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 142
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 142 of 933)

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

---[FILE: wordpress.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/wordpress.mdx

```text
---
title: WordPress
description: Gestionar contenido de WordPress
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wordpress"
  color="#21759B"
/>

{/* MANUAL-CONTENT-START:intro */}
[WordPress](https://wordpress.org/) es el sistema de gestión de contenido de código abierto líder en el mundo, que facilita la publicación y gestión de sitios web, blogs y todo tipo de contenido en línea. Con WordPress, puedes crear y actualizar entradas o páginas, organizar tu contenido con categorías y etiquetas, gestionar archivos multimedia, moderar comentarios y administrar cuentas de usuario, lo que te permite ejecutar desde blogs personales hasta sitios web empresariales complejos.

La integración de Sim con WordPress permite a tus agentes automatizar tareas esenciales del sitio web. Puedes crear programáticamente nuevas entradas de blog con títulos específicos, contenido, categorías, etiquetas e imágenes destacadas. Actualizar entradas existentes —como cambiar su contenido, título o estado de publicación— es sencillo. También puedes publicar o guardar contenido como borradores, gestionar páginas estáticas, trabajar con cargas multimedia, supervisar comentarios y asignar contenido a taxonomías organizativas relevantes.

Al conectar WordPress con tus automatizaciones, Sim permite a tus agentes agilizar la publicación de contenido, los flujos de trabajo editoriales y la gestión diaria del sitio, ayudándote a mantener tu sitio web actualizado, organizado y seguro sin esfuerzo manual.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Intégrate con WordPress para crear, actualizar y gestionar entradas, páginas, multimedia, comentarios, categorías, etiquetas y usuarios. Compatible con sitios de WordPress.com mediante OAuth y sitios de WordPress autoalojados utilizando autenticación de Contraseñas de Aplicación.

## Herramientas

### `wordpress_create_post`

Crear una nueva entrada de blog en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `title` | string | Sí | Título de la entrada |
| `content` | string | No | Contenido de la entrada \(HTML o texto plano\) |
| `status` | string | No | Estado de la entrada: publish, draft, pending, private o future |
| `excerpt` | string | No | Extracto de la entrada |
| `categories` | string | No | IDs de categorías separados por comas |
| `tags` | string | No | IDs de etiquetas separados por comas |
| `featuredMedia` | number | No | ID del medio de la imagen destacada |
| `slug` | string | No | Slug de URL para la entrada |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `post` | object | La entrada creada |

### `wordpress_update_post`

Actualizar una entrada de blog existente en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `postId` | number | Sí | El ID de la entrada a actualizar |
| `title` | string | No | Título de la entrada |
| `content` | string | No | Contenido de la entrada \(HTML o texto plano\) |
| `status` | string | No | Estado de la entrada: publish, draft, pending, private, o future |
| `excerpt` | string | No | Extracto de la entrada |
| `categories` | string | No | IDs de categorías separados por comas |
| `tags` | string | No | IDs de etiquetas separados por comas |
| `featuredMedia` | number | No | ID del archivo multimedia de la imagen destacada |
| `slug` | string | No | URL slug para la entrada |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `post` | object | La entrada actualizada |

### `wordpress_delete_post`

Eliminar una entrada de blog de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `postId` | number | Sí | El ID de la entrada a eliminar |
| `force` | boolean | No | Omitir la papelera y forzar la eliminación permanente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indica si la publicación fue eliminada |
| `post` | object | La publicación eliminada |

### `wordpress_get_post`

Obtener una sola publicación de blog de WordPress.com por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `postId` | number | Sí | El ID de la publicación a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `post` | object | La publicación recuperada |

### `wordpress_list_posts`

Listar publicaciones de blog de WordPress.com con filtros opcionales

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `perPage` | number | No | Número de publicaciones por página \(predeterminado: 10, máx: 100\) |
| `page` | number | No | Número de página para paginación |
| `status` | string | No | Filtro de estado de publicación: publish, draft, pending, private |
| `author` | number | No | Filtrar por ID de autor |
| `categories` | string | No | IDs de categorías separados por comas para filtrar |
| `tags` | string | No | IDs de etiquetas separados por comas para filtrar |
| `search` | string | No | Término de búsqueda para filtrar publicaciones |
| `orderBy` | string | No | Ordenar por campo: date, id, title, slug, modified |
| `order` | string | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `posts` | array | Lista de publicaciones |

### `wordpress_create_page`

Crear una nueva página en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `title` | string | Sí | Título de la página |
| `content` | string | No | Contenido de la página \(HTML o texto plano\) |
| `status` | string | No | Estado de la página: publish, draft, pending, private |
| `excerpt` | string | No | Extracto de la página |
| `parent` | number | No | ID de la página padre para páginas jerárquicas |
| `menuOrder` | number | No | Orden en el menú de páginas |
| `featuredMedia` | number | No | ID del medio de la imagen destacada |
| `slug` | string | No | Slug de URL para la página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `page` | object | La página creada |

### `wordpress_update_page`

Actualizar una página existente en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `pageId` | number | Sí | El ID de la página a actualizar |
| `title` | string | No | Título de la página |
| `content` | string | No | Contenido de la página \(HTML o texto plano\) |
| `status` | string | No | Estado de la página: publish, draft, pending, private |
| `excerpt` | string | No | Extracto de la página |
| `parent` | number | No | ID de la página padre para páginas jerárquicas |
| `menuOrder` | number | No | Orden en el menú de páginas |
| `featuredMedia` | number | No | ID del medio de la imagen destacada |
| `slug` | string | No | Slug de URL para la página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `page` | objeto | La página actualizada |

### `wordpress_delete_page`

Eliminar una página de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | cadena | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `pageId` | número | Sí | El ID de la página a eliminar |
| `force` | booleano | No | Omitir la papelera y forzar la eliminación permanente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | booleano | Si la página fue eliminada |
| `page` | objeto | La página eliminada |

### `wordpress_get_page`

Obtener una sola página de WordPress.com por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | cadena | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `pageId` | número | Sí | El ID de la página a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `page` | objeto | La página recuperada |

### `wordpress_list_pages`

Listar páginas de WordPress.com con filtros opcionales

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | cadena | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `perPage` | número | No | Número de páginas por solicitud \(predeterminado: 10, máx: 100\) |
| `page` | número | No | Número de página para paginación |
| `status` | cadena | No | Filtro de estado de página: publish, draft, pending, private |
| `parent` | número | No | Filtrar por ID de página padre |
| `search` | cadena | No | Término de búsqueda para filtrar páginas |
| `orderBy` | cadena | No | Ordenar por campo: date, id, title, slug, modified, menu_order |
| `order` | cadena | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pages` | array | Lista de páginas |

### `wordpress_upload_media`

Subir un archivo multimedia (imagen, video, documento) a WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `file` | file | No | Archivo para subir \(objeto UserFile\) |
| `filename` | string | No | Anulación opcional del nombre de archivo \(p. ej., imagen.jpg\) |
| `title` | string | No | Título del medio |
| `caption` | string | No | Leyenda del medio |
| `altText` | string | No | Texto alternativo para accesibilidad |
| `description` | string | No | Descripción del medio |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `media` | object | El elemento multimedia subido |

### `wordpress_get_media`

Obtener un solo elemento multimedia de WordPress.com por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `mediaId` | number | Sí | El ID del elemento multimedia a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `media` | object | El elemento multimedia recuperado |

### `wordpress_list_media`

Listar elementos multimedia de la biblioteca multimedia de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `perPage` | number | No | Número de elementos multimedia por solicitud \(predeterminado: 10, máx: 100\) |
| `page` | number | No | Número de página para paginación |
| `search` | string | No | Término de búsqueda para filtrar multimedia |
| `mediaType` | string | No | Filtrar por tipo de multimedia: imagen, video, audio, aplicación |
| `mimeType` | string | No | Filtrar por tipo MIME específico \(p. ej., image/jpeg\) |
| `orderBy` | string | No | Ordenar por campo: fecha, id, título, slug |
| `order` | string | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `media` | array | Lista de elementos multimedia |

### `wordpress_delete_media`

Eliminar un elemento multimedia de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `mediaId` | number | Sí | El ID del elemento multimedia a eliminar |
| `force` | boolean | No | Forzar eliminación \(los elementos multimedia no tienen papelera, por lo que la eliminación es permanente\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | boolean | Si el medio fue eliminado |
| `media` | object | El elemento multimedia eliminado |

### `wordpress_create_comment`

Crear un nuevo comentario en una entrada de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `postId` | number | Sí | El ID de la entrada en la que comentar |
| `content` | string | Sí | Contenido del comentario |
| `parent` | number | No | ID del comentario padre para respuestas |
| `authorName` | string | No | Nombre visible del autor del comentario |
| `authorEmail` | string | No | Correo electrónico del autor del comentario |
| `authorUrl` | string | No | URL del autor del comentario |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `comment` | object | El comentario creado |

### `wordpress_list_comments`

Listar comentarios de WordPress.com con filtros opcionales

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `perPage` | number | No | Número de comentarios por solicitud \(predeterminado: 10, máx: 100\) |
| `page` | number | No | Número de página para paginación |
| `postId` | number | No | Filtrar por ID de entrada |
| `status` | string | No | Filtrar por estado del comentario: approved, hold, spam, trash |
| `search` | string | No | Término de búsqueda para filtrar comentarios |
| `orderBy` | string | No | Ordenar por campo: date, id, parent |
| `order` | string | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `comments` | array | Lista de comentarios |

### `wordpress_update_comment`

Actualizar un comentario en WordPress.com (contenido o estado)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `commentId` | number | Sí | El ID del comentario a actualizar |
| `content` | string | No | Contenido actualizado del comentario |
| `status` | string | No | Estado del comentario: approved, hold, spam, trash |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `comment` | object | El comentario actualizado |

### `wordpress_delete_comment`

Eliminar un comentario de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `commentId` | number | Sí | El ID del comentario a eliminar |
| `force` | boolean | No | Omitir la papelera y forzar la eliminación permanente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | boolean | Si el comentario fue eliminado |
| `comment` | object | El comentario eliminado |

### `wordpress_create_category`

Crear una nueva categoría en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com (p. ej., 12345678 o misitio.wordpress.com) |
| `name` | string | Sí | Nombre de la categoría |
| `description` | string | No | Descripción de la categoría |
| `parent` | number | No | ID de la categoría padre para categorías jerárquicas |
| `slug` | string | No | Slug de URL para la categoría |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `category` | object | La categoría creada |

### `wordpress_list_categories`

Listar categorías de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com (p. ej., 12345678 o misitio.wordpress.com) |
| `perPage` | number | No | Número de categorías por solicitud (predeterminado: 10, máx: 100) |
| `page` | number | No | Número de página para paginación |
| `search` | string | No | Término de búsqueda para filtrar categorías |
| `order` | string | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `categories` | array | Lista de categorías |

### `wordpress_create_tag`

Crear una nueva etiqueta en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com (p. ej., 12345678 o misitio.wordpress.com) |
| `name` | string | Sí | Nombre de la etiqueta |
| `description` | string | No | Descripción de la etiqueta |
| `slug` | string | No | Slug de URL para la etiqueta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tag` | object | La etiqueta creada |

### `wordpress_list_tags`

Listar etiquetas de WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `perPage` | number | No | Número de etiquetas por solicitud \(predeterminado: 10, máx: 100\) |
| `page` | number | No | Número de página para paginación |
| `search` | string | No | Término de búsqueda para filtrar etiquetas |
| `order` | string | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tags` | array | Lista de etiquetas |

### `wordpress_get_current_user`

Obtener información sobre el usuario autenticado actualmente en WordPress.com

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `user` | object | El usuario actual |

### `wordpress_list_users`

Listar usuarios de WordPress.com (requiere privilegios de administrador)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `perPage` | number | No | Número de usuarios por solicitud \(predeterminado: 10, máx: 100\) |
| `page` | number | No | Número de página para paginación |
| `search` | string | No | Término de búsqueda para filtrar usuarios |
| `roles` | string | No | Nombres de roles separados por comas para filtrar |
| `order` | string | No | Dirección de ordenamiento: asc o desc |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `users` | array | Lista de usuarios |

### `wordpress_get_user`

Obtener un usuario específico de WordPress.com por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `userId` | number | Sí | El ID del usuario a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `user` | object | El usuario recuperado |

### `wordpress_search_content`

Buscar en todos los tipos de contenido en WordPress.com (entradas, páginas, multimedia)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio o dominio de WordPress.com \(p. ej., 12345678 o misitio.wordpress.com\) |
| `query` | string | Sí | Consulta de búsqueda |
| `perPage` | number | No | Número de resultados por solicitud \(predeterminado: 10, máx: 100\) |
| `page` | number | No | Número de página para paginación |
| `type` | string | No | Filtrar por tipo de contenido: post, page, attachment |
| `subtype` | string | No | Filtrar por slug de tipo de entrada \(p. ej., post, page\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Resultados de búsqueda |

## Notas

- Categoría: `tools`
- Tipo: `wordpress`
```

--------------------------------------------------------------------------------

---[FILE: x.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/x.mdx

```text
---
title: X
description: Interactúa con X
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="x"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[X](https://x.com/) (anteriormente Twitter) es una plataforma popular de redes sociales que permite la comunicación en tiempo real, compartir contenido e interactuar con audiencias en todo el mundo.

La integración de X en Sim utiliza autenticación OAuth para conectarse de forma segura con la API de X, permitiendo a tus agentes interactuar con la plataforma de manera programática. Esta implementación OAuth garantiza un acceso seguro a las funciones de X mientras mantiene la privacidad y seguridad del usuario.

Con la integración de X, tus agentes pueden:

- **Publicar contenido**: crear nuevos tweets, responder a conversaciones existentes o compartir medios directamente desde tus flujos de trabajo
- **Monitorear conversaciones**: seguir menciones, palabras clave o cuentas específicas para mantenerse informado sobre discusiones relevantes
- **Interactuar con audiencias**: responder automáticamente a menciones, mensajes directos o activadores específicos
- **Analizar tendencias**: obtener información de temas tendencia, hashtags o patrones de interacción de usuarios
- **Investigar información**: buscar contenido específico, perfiles de usuario o conversaciones para informar decisiones de agentes

En Sim, la integración con X permite escenarios sofisticados de automatización de redes sociales. Tus agentes pueden monitorear menciones de marca y responder adecuadamente, programar y publicar contenido basado en activadores específicos, realizar escucha social para investigación de mercado, o crear experiencias interactivas que abarquen tanto la IA conversacional como la interacción en redes sociales. Al conectar Sim con X a través de OAuth, puedes construir agentes inteligentes que mantengan una presencia consistente y receptiva en redes sociales mientras se adhieren a las políticas de la plataforma y las mejores prácticas para el uso de API.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra X en el flujo de trabajo. Puede publicar un nuevo tweet, obtener detalles de tweets, buscar tweets y obtener el perfil de usuario. Requiere OAuth.

## Herramientas

### `x_write`

Publica nuevos tweets, responde a tweets o crea encuestas en X (Twitter)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El contenido de texto de tu tweet |
| `replyTo` | string | No | ID del tweet al que responder |
| `mediaIds` | array | No | Array de IDs de medios para adjuntar al tweet |
| `poll` | object | No | Configuración de encuesta para el tweet |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tweet` | object | Los datos del tweet recién creado |

### `x_read`

Lee detalles de tweets, incluyendo respuestas y contexto de la conversación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `tweetId` | string | Sí | ID del tweet a leer |
| `includeReplies` | boolean | No | Si se deben incluir las respuestas al tweet |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tweet` | object | Los datos del tweet principal |

### `x_search`

Busca tweets usando palabras clave, hashtags o consultas avanzadas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda \(admite operadores de búsqueda de X\) |
| `maxResults` | number | No | Número máximo de resultados a devolver \(predeterminado: 10, máximo: 100\) |
| `startTime` | string | No | Hora de inicio para la búsqueda \(formato ISO 8601\) |
| `endTime` | string | No | Hora de finalización para la búsqueda \(formato ISO 8601\) |
| `sortOrder` | string | No | Orden de clasificación para los resultados \(recency o relevancy\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `tweets` | array | Array de tweets que coinciden con la consulta de búsqueda |

### `x_user`

Obtener información del perfil de usuario

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `username` | string | Sí | Nombre de usuario a buscar \(sin el símbolo @\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `user` | object | Información del perfil de usuario de X |

## Notas

- Categoría: `tools`
- Tipo: `x`
```

--------------------------------------------------------------------------------

---[FILE: youtube.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/youtube.mdx

```text
---
title: YouTube
description: Interactúa con videos, canales y listas de reproducción de YouTube
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="youtube"
  color="#FF0000"
/>

{/* MANUAL-CONTENT-START:intro */}
[YouTube](https://www.youtube.com/) es la plataforma de compartición de videos más grande del mundo, alojando miles de millones de videos y atendiendo a más de 2 mil millones de usuarios mensuales registrados.

Con las amplias capacidades de la API de YouTube, puedes:

- **Buscar contenido**: Encontrar videos relevantes en la extensa biblioteca de YouTube usando palabras clave específicas, filtros y parámetros
- **Acceder a metadatos**: Obtener información detallada sobre videos incluyendo títulos, descripciones, número de visualizaciones y métricas de interacción
- **Analizar tendencias**: Identificar contenido popular y temas tendencia dentro de categorías o regiones específicas
- **Extraer insights**: Recopilar datos sobre preferencias de la audiencia, rendimiento del contenido y patrones de interacción

En Sim, la integración con YouTube permite a tus agentes buscar y analizar programáticamente el contenido de YouTube como parte de sus flujos de trabajo. Esto permite potentes escenarios de automatización que requieren información actualizada de videos. Tus agentes pueden buscar videos instructivos, investigar tendencias de contenido, recopilar información de canales educativos o monitorear creadores específicos para nuevas subidas. Esta integración cierra la brecha entre tus flujos de trabajo de IA y el repositorio de videos más grande del mundo, permitiendo automatizaciones más sofisticadas y conscientes del contenido. Al conectar Sim con YouTube, puedes crear agentes que se mantengan actualizados con la información más reciente, proporcionen respuestas más precisas y entreguen más valor a los usuarios - todo sin requerir intervención manual o código personalizado.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra YouTube en el flujo de trabajo. Puede buscar videos, obtener detalles de videos, obtener información del canal, obtener todos los videos de un canal, obtener listas de reproducción del canal, obtener elementos de listas de reproducción, encontrar videos relacionados y obtener comentarios de videos.

## Herramientas

### `youtube_search`

Busca videos en YouTube utilizando la API de datos de YouTube. Admite filtrado avanzado por canal, rango de fechas, duración, categoría, calidad, subtítulos y más.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda para videos de YouTube |
| `maxResults` | number | No | Número máximo de videos a devolver (1-50) |
| `apiKey` | string | Sí | Clave API de YouTube |
| `channelId` | string | No | Filtrar resultados a un ID de canal específico de YouTube |
| `publishedAfter` | string | No | Solo devolver videos publicados después de esta fecha (formato RFC 3339: "2024-01-01T00:00:00Z") |
| `publishedBefore` | string | No | Solo devolver videos publicados antes de esta fecha (formato RFC 3339: "2024-01-01T00:00:00Z") |
| `videoDuration` | string | No | Filtrar por duración del video: "short" (menos de 4 minutos), "medium" (4-20 minutos), "long" (más de 20 minutos), "any" |
| `order` | string | No | Ordenar resultados por: "date", "rating", "relevance" (predeterminado), "title", "videoCount", "viewCount" |
| `videoCategoryId` | string | No | Filtrar por ID de categoría de YouTube (ej., "10" para Música, "20" para Juegos) |
| `videoDefinition` | string | No | Filtrar por calidad de video: "high" (HD), "standard", "any" |
| `videoCaption` | string | No | Filtrar por disponibilidad de subtítulos: "closedCaption" (tiene subtítulos), "none" (sin subtítulos), "any" |
| `regionCode` | string | No | Devolver resultados relevantes para una región específica (código de país ISO 3166-1 alpha-2, ej., "US", "ES") |
| `relevanceLanguage` | string | No | Devolver resultados más relevantes para un idioma (código ISO 639-1, ej., "en", "es") |
| `safeSearch` | string | No | Nivel de filtrado de contenido: "moderate" (predeterminado), "none", "strict" |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | array | Array de videos de YouTube que coinciden con la consulta de búsqueda |

### `youtube_video_details`

Obtén información detallada sobre un video específico de YouTube.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `videoId` | string | Sí | ID del video de YouTube |
| `apiKey` | string | Sí | Clave API de YouTube |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `videoId` | string | ID del video de YouTube |
| `title` | string | Título del video |
| `description` | string | Descripción del video |
| `channelId` | string | ID del canal |
| `channelTitle` | string | Nombre del canal |
| `publishedAt` | string | Fecha y hora de publicación |
| `duration` | string | Duración del video en formato ISO 8601 |
| `viewCount` | number | Número de visualizaciones |
| `likeCount` | number | Número de me gusta |
| `commentCount` | number | Número de comentarios |
| `thumbnail` | string | URL de la miniatura del video |
| `tags` | array | Etiquetas del video |

### `youtube_channel_info`

Obtén información detallada sobre un canal de YouTube.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `channelId` | string | No | ID del canal de YouTube \(usa channelId o username\) |
| `username` | string | No | Nombre de usuario del canal de YouTube \(usa channelId o username\) |
| `apiKey` | string | Sí | Clave API de YouTube |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `channelId` | string | ID del canal de YouTube |
| `title` | string | Nombre del canal |
| `description` | string | Descripción del canal |
| `subscriberCount` | number | Número de suscriptores |
| `videoCount` | number | Número de videos |
| `viewCount` | number | Vistas totales del canal |
| `publishedAt` | string | Fecha de creación del canal |
| `thumbnail` | string | URL de la miniatura del canal |
| `customUrl` | string | URL personalizada del canal |

### `youtube_channel_videos`

Obtener todos los videos de un canal específico de YouTube, con opciones de ordenación.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `channelId` | string | Sí | ID del canal de YouTube del que obtener videos |
| `maxResults` | number | No | Número máximo de videos a devolver \(1-50\) |
| `order` | string | No | Orden de clasificación: "date" \(más recientes primero\), "rating", "relevance", "title", "viewCount" |
| `pageToken` | string | No | Token de página para paginación |
| `apiKey` | string | Sí | Clave API de YouTube |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | array | Array de videos del canal |

### `youtube_channel_playlists`

Obtener todas las listas de reproducción de un canal específico de YouTube.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `channelId` | string | Sí | ID del canal de YouTube del que obtener listas de reproducción |
| `maxResults` | number | No | Número máximo de listas de reproducción a devolver \(1-50\) |
| `pageToken` | string | No | Token de página para paginación |
| `apiKey` | string | Sí | Clave API de YouTube |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | array | Array de listas de reproducción del canal |

### `youtube_playlist_items`

Obtener videos de una lista de reproducción de YouTube.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `playlistId` | string | Sí | ID de la lista de reproducción de YouTube |
| `maxResults` | number | No | Número máximo de videos a devolver |
| `pageToken` | string | No | Token de página para paginación |
| `apiKey` | string | Sí | Clave API de YouTube |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | array | Array de videos en la lista de reproducción |

### `youtube_comments`

Obtener comentarios de un video de YouTube.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `videoId` | string | Sí | ID del video de YouTube |
| `maxResults` | number | No | Número máximo de comentarios a devolver |
| `order` | string | No | Orden de los comentarios: time (tiempo) o relevance (relevancia) |
| `pageToken` | string | No | Token de página para paginación |
| `apiKey` | string | Sí | Clave API de YouTube |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | array | Array de comentarios del video |

## Notas

- Categoría: `tools`
- Tipo: `youtube`
```

--------------------------------------------------------------------------------

````
