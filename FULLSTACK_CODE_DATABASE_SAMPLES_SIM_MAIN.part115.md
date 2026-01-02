---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 115
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 115 of 933)

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

---[FILE: google_slides.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_slides.mdx

```text
---
title: Google Slides
description: Lee, escribe y crea presentaciones
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_slides"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Slides](https://slides.google.com) es una aplicación dinámica de presentaciones basada en la nube que permite a los usuarios crear, editar, colaborar y presentar diapositivas en tiempo real. Como parte del conjunto de productividad de Google, Google Slides ofrece una plataforma flexible para diseñar presentaciones atractivas, colaborar con otros y compartir contenido sin problemas a través de la nube.

Aprende cómo integrar las herramientas de Google Slides en Sim para gestionar presentaciones sin esfuerzo como parte de tus flujos de trabajo automatizados. Con Sim, puedes leer, escribir, crear y actualizar presentaciones de Google Slides directamente a través de tus agentes y procesos automatizados, facilitando la entrega de información actualizada, la generación de informes personalizados o la producción de presentaciones corporativas de forma programática.

Con Google Slides, puedes:

- **Crear y editar presentaciones**: Diseña diapositivas visualmente atractivas con temas, diseños y contenido multimedia
- **Colaborar en tiempo real**: Trabaja simultáneamente con compañeros, comenta, asigna tareas y recibe comentarios en vivo sobre las presentaciones
- **Presentar en cualquier lugar**: Muestra presentaciones en línea o sin conexión, comparte enlaces o publica en la web
- **Añadir imágenes y contenido enriquecido**: Inserta imágenes, gráficos, diagramas y videos para hacer tus presentaciones más atractivas
- **Integrar con otros servicios**: Conéctate sin problemas con Google Drive, Docs, Sheets y otras herramientas de terceros
- **Acceder desde cualquier dispositivo**: Usa Google Slides en ordenadores de escritorio, portátiles, tabletas y dispositivos móviles para máxima flexibilidad

En Sim, la integración con Google Slides permite a tus agentes interactuar directamente con archivos de presentación de forma programática. Automatiza tareas como leer el contenido de diapositivas, insertar nuevas diapositivas o imágenes, reemplazar texto en toda una presentación, generar nuevas presentaciones y recuperar miniaturas de diapositivas. Esto te permite escalar la creación de contenido, mantener las presentaciones actualizadas e incorporarlas en flujos de trabajo de documentos automatizados. Al conectar Sim con Google Slides, facilitas la gestión de presentaciones impulsada por IA, haciendo que sea fácil generar, actualizar o extraer información de presentaciones sin esfuerzo manual.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Google Slides en el flujo de trabajo. Puede leer, escribir, crear presentaciones, reemplazar texto, añadir diapositivas, añadir imágenes y obtener miniaturas.

## Herramientas

### `google_slides_read`

Leer contenido de una presentación de Google Slides

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Sí | El ID de la presentación a leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `slides` | json | Array de diapositivas con su contenido |
| `metadata` | json | Metadatos de la presentación incluyendo ID, título y URL |

### `google_slides_write`

Escribir o actualizar contenido en una presentación de Google Slides

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Sí | El ID de la presentación en la que escribir |
| `content` | string | Sí | El contenido a escribir en la diapositiva |
| `slideIndex` | number | No | El índice de la diapositiva en la que escribir \(por defecto, primera diapositiva\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Indica si el contenido de la presentación se actualizó correctamente |
| `metadata` | json | Metadatos de la presentación actualizada incluyendo ID, título y URL |

### `google_slides_create`

Crear una nueva presentación de Google Slides

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | El título de la presentación a crear |
| `content` | string | No | El contenido a añadir a la primera diapositiva |
| `folderSelector` | string | No | Seleccionar la carpeta donde crear la presentación |
| `folderId` | string | No | El ID de la carpeta donde crear la presentación \(uso interno\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `metadata` | json | Metadatos de la presentación creada, incluyendo ID, título y URL |

### `google_slides_replace_all_text`

Buscar y reemplazar todas las ocurrencias de texto en una presentación de Google Slides

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Sí | El ID de la presentación |
| `findText` | string | Sí | El texto a buscar \(p. ej., \{\{placeholder\}\}\) |
| `replaceText` | string | Sí | El texto con el que reemplazar |
| `matchCase` | boolean | No | Si la búsqueda debe distinguir entre mayúsculas y minúsculas \(predeterminado: true\) |
| `pageObjectIds` | string | No | Lista separada por comas de IDs de objetos de diapositivas para limitar los reemplazos a diapositivas específicas \(dejar vacío para todas las diapositivas\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `occurrencesChanged` | number | Número de ocurrencias de texto que fueron reemplazadas |
| `metadata` | json | Metadatos de la operación, incluyendo ID de la presentación y URL |

### `google_slides_add_slide`

Añadir una nueva diapositiva a una presentación de Google Slides con un diseño específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Sí | El ID de la presentación |
| `layout` | string | No | El diseño predefinido para la diapositiva \(BLANK, TITLE, TITLE_AND_BODY, TITLE_ONLY, SECTION_HEADER, etc.\). Por defecto es BLANK. |
| `insertionIndex` | number | No | El índice opcional basado en cero que indica dónde insertar la diapositiva. Si no se especifica, la diapositiva se añade al final. |
| `placeholderIdMappings` | string | No | Array JSON de mapeos de marcadores de posición para asignar IDs de objeto personalizados a los marcadores. Formato: \[\{"layoutPlaceholder":\{"type":"TITLE"\},"objectId":"custom_title_id"\}\] |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `slideId` | string | El ID del objeto de la diapositiva recién creada |
| `metadata` | json | Metadatos de la operación incluyendo ID de la presentación, diseño y URL |

### `google_slides_add_image`

Insertar una imagen en una diapositiva específica de una presentación de Google Slides

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Sí | El ID de la presentación |
| `pageObjectId` | string | Sí | El ID del objeto de la diapositiva/página donde se añadirá la imagen |
| `imageUrl` | string | Sí | La URL de acceso público de la imagen \(debe ser PNG, JPEG o GIF, máximo 50MB\) |
| `width` | number | No | Ancho de la imagen en puntos \(predeterminado: 300\) |
| `height` | number | No | Altura de la imagen en puntos \(predeterminado: 200\) |
| `positionX` | number | No | Posición X desde el borde izquierdo en puntos \(predeterminado: 100\) |
| `positionY` | number | No | Posición Y desde el borde superior en puntos \(predeterminado: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `imageId` | string | El ID del objeto de la imagen recién creada |
| `metadata` | json | Metadatos de la operación incluyendo ID de la presentación y URL de la imagen |

### `google_slides_get_thumbnail`

Generar una imagen en miniatura de una diapositiva específica en una presentación de Google Slides

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Sí | El ID de la presentación |
| `pageObjectId` | string | Sí | El ID del objeto de la diapositiva/página para obtener una miniatura |
| `thumbnailSize` | string | No | El tamaño de la miniatura: SMALL \(200px\), MEDIUM \(800px\), o LARGE \(1600px\). Por defecto es MEDIUM. |
| `mimeType` | string | No | El tipo MIME de la imagen en miniatura: PNG o GIF. Por defecto es PNG. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contentUrl` | string | URL de la imagen en miniatura \(válida durante 30 minutos\) |
| `width` | number | Ancho de la miniatura en píxeles |
| `height` | number | Alto de la miniatura en píxeles |
| `metadata` | json | Metadatos de la operación incluyendo el ID de la presentación y el ID del objeto de la página |

## Notas

- Categoría: `tools`
- Tipo: `google_slides`
```

--------------------------------------------------------------------------------

---[FILE: google_vault.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/google_vault.mdx

```text
---
title: Google Vault
description: Buscar, exportar y gestionar retenciones/exportaciones para asuntos de Vault
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_vault"
  color="#E8F0FE"
/>

## Instrucciones de uso

Conecta Google Vault para crear exportaciones, listar exportaciones y gestionar retenciones dentro de los asuntos.

## Herramientas

### `google_vault_create_matters_export`

Crear una exportación en un asunto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Sí | Sin descripción |
| `exportName` | string | Sí | Sin descripción |
| `corpus` | string | Sí | Corpus de datos para exportar \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | No | Lista separada por comas de correos electrónicos de usuarios para delimitar la exportación |
| `orgUnitId` | string | No | ID de la unidad organizativa para delimitar la exportación \(alternativa a los correos electrónicos\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `export` | json | Objeto de exportación creado |

### `google_vault_list_matters_export`

Listar exportaciones para un asunto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Sí | Sin descripción |
| `pageSize` | number | No | Sin descripción |
| `pageToken` | string | No | Sin descripción |
| `exportId` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `exports` | json | Array de objetos de exportación |
| `export` | json | Objeto de exportación único \(cuando se proporciona exportId\) |
| `nextPageToken` | string | Token para obtener la siguiente página de resultados |

### `google_vault_download_export_file`

Descargar un solo archivo de una exportación de Google Vault (objeto GCS)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Sí | Sin descripción |
| `bucketName` | string | Sí | Sin descripción |
| `objectName` | string | Sí | Sin descripción |
| `fileName` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | file | Archivo de exportación de Vault descargado almacenado en archivos de ejecución |

### `google_vault_create_matters_holds`

Crear una retención en un asunto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Sí | Sin descripción |
| `holdName` | string | Sí | Sin descripción |
| `corpus` | string | Sí | Corpus de datos para retener \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | No | Lista separada por comas de correos electrónicos de usuarios para poner en retención |
| `orgUnitId` | string | No | ID de unidad organizativa para poner en retención \(alternativa a cuentas\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `hold` | json | Objeto de retención creado |

### `google_vault_list_matters_holds`

Listar retenciones para un asunto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Sí | Sin descripción |
| `pageSize` | number | No | Sin descripción |
| `pageToken` | string | No | Sin descripción |
| `holdId` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `holds` | json | Array de objetos de retención |
| `hold` | json | Objeto de retención único \(cuando se proporciona holdId\) |
| `nextPageToken` | string | Token para obtener la siguiente página de resultados |

### `google_vault_create_matters`

Crear un nuevo asunto en Google Vault

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `name` | string | Sí | Sin descripción |
| `description` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `matter` | json | Objeto de asunto creado |

### `google_vault_list_matters`

Listar asuntos, o obtener un asunto específico si se proporciona matterId

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | No | Sin descripción |
| `pageToken` | string | No | Sin descripción |
| `matterId` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `matters` | json | Array de objetos de asunto |
| `matter` | json | Objeto de asunto único \(cuando se proporciona matterId\) |
| `nextPageToken` | string | Token para obtener la siguiente página de resultados |

## Notas

- Categoría: `tools`
- Tipo: `google_vault`
```

--------------------------------------------------------------------------------

---[FILE: grafana.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/grafana.mdx

```text
---
title: Grafana
description: Interactúa con paneles, alertas y anotaciones de Grafana
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="grafana"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Grafana](https://grafana.com/) es una plataforma líder de código abierto para monitorización, observabilidad y visualización. Permite a los usuarios consultar, visualizar, alertar y analizar datos de diversas fuentes, convirtiéndola en una herramienta esencial para la monitorización de infraestructuras y aplicaciones.

Con Grafana, puedes:

- **Visualizar datos**: Crear y personalizar paneles para mostrar métricas, registros y trazas en tiempo real
- **Monitorizar salud y estado**: Comprobar la salud de tu instancia de Grafana y las fuentes de datos conectadas
- **Gestionar alertas y anotaciones**: Configurar reglas de alerta, gestionar notificaciones y anotar paneles con eventos importantes
- **Organizar contenido**: Organizar paneles y fuentes de datos en carpetas para una mejor gestión de acceso

En Sim, la integración de Grafana permite a tus agentes interactuar directamente con tu instancia de Grafana a través de API, habilitando acciones como:

- Comprobar el estado de salud del servidor Grafana, la base de datos y las fuentes de datos
- Recuperar, listar y gestionar paneles, reglas de alerta, anotaciones, fuentes de datos y carpetas
- Automatizar la monitorización de tu infraestructura integrando datos y alertas de Grafana en tus automatizaciones de flujo de trabajo

Estas capacidades permiten a los agentes de Sim monitorizar sistemas, responder proactivamente a las alertas y ayudar a garantizar la fiabilidad y visibilidad de tus servicios, todo como parte de tus flujos de trabajo automatizados.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Grafana en flujos de trabajo. Gestiona paneles, alertas, anotaciones, fuentes de datos, carpetas y monitoriza el estado de salud.

## Herramientas

### `grafana_get_dashboard`

Obtener un panel por su UID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `dashboardUid` | string | Sí | El UID del panel a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `dashboard` | json | El objeto JSON completo del panel de control |
| `meta` | json | Metadatos del panel de control \(versión, permisos, etc.\) |

### `grafana_list_dashboards`

Buscar y listar todos los paneles de control

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de la organización para instancias Grafana multi-organización |
| `query` | string | No | Consulta de búsqueda para filtrar paneles por título |
| `tag` | string | No | Filtrar por etiqueta \(separadas por comas para múltiples etiquetas\) |
| `folderIds` | string | No | Filtrar por IDs de carpetas \(separados por comas\) |
| `starred` | boolean | No | Devolver solo paneles destacados |
| `limit` | number | No | Número máximo de paneles a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `dashboards` | array | Lista de resultados de búsqueda de paneles |

### `grafana_create_dashboard`

Crear un nuevo panel de control

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de la organización para instancias Grafana multi-organización |
| `title` | string | Sí | El título del nuevo panel de control |
| `folderUid` | string | No | El UID de la carpeta donde crear el panel de control |
| `tags` | string | No | Lista de etiquetas separadas por comas |
| `timezone` | string | No | Zona horaria del panel \(p. ej., browser, utc\) |
| `refresh` | string | No | Intervalo de actualización automática \(p. ej., 5s, 1m, 5m\) |
| `panels` | string | No | Array JSON de configuraciones de paneles |
| `overwrite` | boolean | No | Sobrescribir panel existente con el mismo título |
| `message` | string | No | Mensaje de commit para la versión del panel |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | number | El ID numérico del panel de control creado |
| `uid` | string | El UID del panel de control creado |
| `url` | string | La ruta URL al panel de control |
| `status` | string | Estado de la operación \(éxito\) |
| `version` | number | El número de versión del panel de control |
| `slug` | string | Slug amigable para URL del panel de control |

### `grafana_update_dashboard`

Actualiza un panel de control existente. Obtiene el panel de control actual y fusiona tus cambios.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `dashboardUid` | string | Sí | El UID del panel de control a actualizar |
| `title` | string | No | Nuevo título para el panel de control |
| `folderUid` | string | No | Nuevo UID de carpeta para mover el panel de control |
| `tags` | string | No | Lista de nuevas etiquetas separadas por comas |
| `timezone` | string | No | Zona horaria del panel de control \(p. ej., browser, utc\) |
| `refresh` | string | No | Intervalo de actualización automática \(p. ej., 5s, 1m, 5m\) |
| `panels` | string | No | Array JSON de configuraciones de paneles |
| `overwrite` | boolean | No | Sobrescribir incluso si hay un conflicto de versiones |
| `message` | string | No | Mensaje de commit para esta versión |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | number | El ID numérico del panel actualizado |
| `uid` | string | El UID del panel actualizado |
| `url` | string | La ruta URL al panel |
| `status` | string | Estado de la operación \(éxito\) |
| `version` | number | El nuevo número de versión del panel |
| `slug` | string | Slug amigable para URL del panel |

### `grafana_delete_dashboard`

Eliminar un panel por su UID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `dashboardUid` | string | Sí | El UID del panel a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `title` | string | El título del panel eliminado |
| `message` | string | Mensaje de confirmación |
| `id` | number | El ID del panel eliminado |

### `grafana_list_alert_rules`

Listar todas las reglas de alerta en la instancia de Grafana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `rules` | array | Lista de reglas de alerta |

### `grafana_get_alert_rule`

Obtener una regla de alerta específica por su UID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `alertRuleUid` | string | Sí | El UID de la regla de alerta a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `uid` | string | UID de la regla de alerta |
| `title` | string | Título de la regla de alerta |
| `condition` | string | Condición de alerta |
| `data` | json | Datos de consulta de la regla de alerta |
| `folderUID` | string | UID de la carpeta principal |
| `ruleGroup` | string | Nombre del grupo de reglas |
| `noDataState` | string | Estado cuando no se devuelven datos |
| `execErrState` | string | Estado en caso de error de ejecución |
| `annotations` | json | Anotaciones de alerta |
| `labels` | json | Etiquetas de alerta |

### `grafana_create_alert_rule`

Crear una nueva regla de alerta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `title` | string | Sí | El título de la regla de alerta |
| `folderUid` | string | Sí | El UID de la carpeta donde crear la alerta |
| `ruleGroup` | string | Sí | El nombre del grupo de reglas |
| `condition` | string | Sí | El refId de la consulta o expresión a usar como condición de alerta |
| `data` | string | Sí | Array JSON de objetos de datos de consulta/expresión |
| `forDuration` | string | No | Duración de espera antes de activarse \(p. ej., 5m, 1h\) |
| `noDataState` | string | No | Estado cuando no se devuelven datos \(NoData, Alerting, OK\) |
| `execErrState` | string | No | Estado en caso de error de ejecución \(Alerting, OK\) |
| `annotations` | string | No | Objeto JSON de anotaciones |
| `labels` | string | No | Objeto JSON de etiquetas |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `uid` | string | El UID de la regla de alerta creada |
| `title` | string | Título de la regla de alerta |
| `folderUID` | string | UID de la carpeta principal |
| `ruleGroup` | string | Nombre del grupo de reglas |

### `grafana_update_alert_rule`

Actualiza una regla de alerta existente. Obtiene la regla actual y fusiona tus cambios.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana (p. ej., https://your-grafana.com) |
| `organizationId` | string | No | ID de la organización para instancias de Grafana multi-organización |
| `alertRuleUid` | string | Sí | El UID de la regla de alerta a actualizar |
| `title` | string | No | Nuevo título para la regla de alerta |
| `folderUid` | string | No | Nuevo UID de carpeta para mover la alerta |
| `ruleGroup` | string | No | Nuevo nombre del grupo de reglas |
| `condition` | string | No | Nuevo refId de condición |
| `data` | string | No | Nuevo array JSON de objetos de datos de consulta/expresión |
| `forDuration` | string | No | Duración de espera antes de activar (p. ej., 5m, 1h) |
| `noDataState` | string | No | Estado cuando no se devuelven datos (NoData, Alerting, OK) |
| `execErrState` | string | No | Estado en caso de error de ejecución (Alerting, OK) |
| `annotations` | string | No | Objeto JSON de anotaciones |
| `labels` | string | No | Objeto JSON de etiquetas |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `uid` | string | El UID de la regla de alerta actualizada |
| `title` | string | Título de la regla de alerta |
| `folderUID` | string | UID de la carpeta principal |
| `ruleGroup` | string | Nombre del grupo de reglas |

### `grafana_delete_alert_rule`

Eliminar una regla de alerta por su UID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana (p. ej., https://your-grafana.com) |
| `organizationId` | string | No | ID de la organización para instancias de Grafana multi-organización |
| `alertRuleUid` | string | Sí | El UID de la regla de alerta a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de confirmación |

### `grafana_list_contact_points`

Listar todos los puntos de contacto para notificaciones de alerta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana (p. ej., https://your-grafana.com) |
| `organizationId` | string | No | ID de la organización para instancias de Grafana multi-organización |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contactPoints` | array | Lista de puntos de contacto |

### `grafana_create_annotation`

Crear una anotación en un panel o como una anotación global

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `text` | string | Sí | El contenido de texto de la anotación |
| `tags` | string | No | Lista de etiquetas separadas por comas |
| `dashboardUid` | string | Sí | UID del panel de control donde añadir la anotación |
| `panelId` | number | No | ID del panel donde añadir la anotación |
| `time` | number | No | Hora de inicio en milisegundos de época \(por defecto es ahora\) |
| `timeEnd` | number | No | Hora de finalización en milisegundos de época \(para anotaciones de rango\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | number | El ID de la anotación creada |
| `message` | string | Mensaje de confirmación |

### `grafana_list_annotations`

Consultar anotaciones por rango de tiempo, panel o etiquetas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `from` | number | No | Hora de inicio en milisegundos de época |
| `to` | number | No | Hora de finalización en milisegundos de época |
| `dashboardUid` | string | Sí | UID del panel de control para consultar anotaciones |
| `panelId` | number | No | Filtrar por ID de panel |
| `tags` | string | No | Lista de etiquetas separadas por comas para filtrar |
| `type` | string | No | Filtrar por tipo \(alerta o anotación\) |
| `limit` | number | No | Número máximo de anotaciones a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `annotations` | array | Lista de anotaciones |

### `grafana_update_annotation`

Actualizar una anotación existente

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `annotationId` | number | Sí | El ID de la anotación a actualizar |
| `text` | string | Sí | Nuevo contenido de texto para la anotación |
| `tags` | string | No | Lista de nuevas etiquetas separadas por comas |
| `time` | number | No | Nueva hora de inicio en milisegundos de época |
| `timeEnd` | number | No | Nueva hora de finalización en milisegundos de época |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | number | El ID de la anotación actualizada |
| `message` | string | Mensaje de confirmación |

### `grafana_delete_annotation`

Eliminar una anotación por su ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `annotationId` | number | Sí | El ID de la anotación a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de confirmación |

### `grafana_list_data_sources`

Listar todas las fuentes de datos configuradas en Grafana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana (ej., https://your-grafana.com) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `dataSources` | array | Lista de fuentes de datos |

### `grafana_get_data_source`

Obtener una fuente de datos por su ID o UID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana (ej., https://your-grafana.com) |
| `organizationId` | string | No | ID de organización para instancias Grafana multi-organización |
| `dataSourceId` | string | Sí | El ID o UID de la fuente de datos a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | number | ID de la fuente de datos |
| `uid` | string | UID de la fuente de datos |
| `name` | string | Nombre de la fuente de datos |
| `type` | string | Tipo de fuente de datos |
| `url` | string | URL de conexión de la fuente de datos |
| `database` | string | Nombre de la base de datos (si aplica) |
| `isDefault` | boolean | Si esta es la fuente de datos predeterminada |
| `jsonData` | json | Configuración adicional de la fuente de datos |

### `grafana_list_folders`

Listar todas las carpetas en Grafana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de la organización para instancias de Grafana multi-organización |
| `limit` | number | No | Número máximo de carpetas a devolver |
| `page` | number | No | Número de página para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `folders` | array | Lista de carpetas |

### `grafana_create_folder`

Crear una nueva carpeta en Grafana

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de cuenta de servicio de Grafana |
| `baseUrl` | string | Sí | URL de la instancia de Grafana \(p. ej., https://your-grafana.com\) |
| `organizationId` | string | No | ID de la organización para instancias de Grafana multi-organización |
| `title` | string | Sí | El título de la nueva carpeta |
| `uid` | string | No | UID opcional para la carpeta \(se genera automáticamente si no se proporciona\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | number | El ID numérico de la carpeta creada |
| `uid` | string | El UID de la carpeta creada |
| `title` | string | El título de la carpeta creada |
| `url` | string | La ruta URL a la carpeta |
| `hasAcl` | boolean | Si la carpeta tiene permisos ACL personalizados |
| `canSave` | boolean | Si el usuario actual puede guardar la carpeta |
| `canEdit` | boolean | Si el usuario actual puede editar la carpeta |
| `canAdmin` | boolean | Si el usuario actual tiene derechos de administrador en la carpeta |
| `canDelete` | boolean | Si el usuario actual puede eliminar la carpeta |
| `createdBy` | string | Nombre de usuario de quien creó la carpeta |
| `created` | string | Marca de tiempo cuando se creó la carpeta |
| `updatedBy` | string | Nombre de usuario de quien actualizó por última vez la carpeta |
| `updated` | string | Marca de tiempo cuando se actualizó por última vez la carpeta |
| `version` | number | Número de versión de la carpeta |

## Notas

- Categoría: `tools`
- Tipo: `grafana`
```

--------------------------------------------------------------------------------

````
