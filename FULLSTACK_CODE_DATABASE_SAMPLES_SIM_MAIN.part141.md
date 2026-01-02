---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 141
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 141 of 933)

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

---[FILE: video_generator.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/video_generator.mdx

```text
---
title: Generador de vídeos
description: Genera vídeos a partir de texto usando IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="video_generator"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Crea vídeos a partir de indicaciones de texto utilizando modelos de IA de vanguardia de los principales proveedores. El Generador de Vídeos de Sim incorpora potentes capacidades de síntesis creativa de vídeo a tu flujo de trabajo, con soporte para diversos modelos, relaciones de aspecto, resoluciones, controles de cámara, audio nativo y funciones avanzadas de estilo y consistencia.

**Proveedores y modelos compatibles:**

- **[Runway Gen-4](https://research.runwayml.com/gen2/)** (Runway ML):  
  Runway es pionero en la generación de texto a vídeo, conocido por potentes modelos como Gen-2, Gen-3 y Gen-4. El último modelo [Gen-4](https://research.runwayml.com/gen2/) (y Gen-4 Turbo para resultados más rápidos) admite un movimiento más realista, mayor consistencia del entorno y referencias visuales para personajes, objetos, estilo y ubicación. Compatible con relaciones de aspecto 16:9, 9:16 y 1:1, duraciones de 5-10 segundos, resolución de hasta 4K, ajustes preestablecidos de estilo y carga directa de imágenes de referencia para generaciones consistentes. Runway potencia herramientas creativas para cineastas, estudios y creadores de contenido en todo el mundo.

- **[Google Veo](https://deepmind.google/technologies/veo/)** (Google DeepMind):  
  [Veo](https://deepmind.google/technologies/veo/) es el modelo de generación de vídeo de próxima generación de Google, que ofrece vídeos de alta calidad con audio nativo de hasta 1080p y 16 segundos. Compatible con movimiento avanzado, efectos cinematográficos y comprensión matizada del texto. Veo puede generar vídeos con sonido incorporado, activando tanto audio nativo como clips silenciosos. Las opciones incluyen relación de aspecto 16:9, duración variable, diferentes modelos (veo-3, veo-3.1) y controles basados en indicaciones. Ideal para narración, publicidad, investigación e ideación.

- **[Luma Dream Machine](https://lumalabs.ai/dream-machine)** (Luma AI):  
  [Dream Machine](https://lumalabs.ai/dream-machine) ofrece vídeos sorprendentemente realistas y fluidos a partir de texto. Incorpora control avanzado de cámara, indicaciones de cinematografía y es compatible con los modelos ray-1 y ray-2. Dream Machine admite relaciones de aspecto precisas (16:9, 9:16, 1:1), duraciones variables y la especificación de trayectorias de cámara para una dirección visual intrincada. Luma es reconocido por su revolucionaria fidelidad visual y cuenta con el respaldo de destacados investigadores en visión por IA.

- **[MiniMax Hailuo-02](https://minimax.chat/)** (a través de [Fal.ai](https://fal.ai/)):  
  [MiniMax Hailuo-02](https://minimax.chat/) es un sofisticado modelo generativo de video chino, disponible globalmente a través de [Fal.ai](https://fal.ai/). Genera videos de hasta 16 segundos en formato horizontal o vertical, con opciones para optimización de prompts para mejorar la claridad y creatividad. Endpoints pro y estándar disponibles, soportando altas resoluciones (hasta 1920×1080). Bien adaptado para proyectos creativos que necesitan traducción y optimización de prompts, narración comercial y prototipado rápido de ideas visuales.

**Cómo elegir:**  
Selecciona tu proveedor y modelo según tus necesidades de calidad, velocidad, duración, audio, costo y características únicas. Runway y Veo ofrecen realismo y capacidades cinematográficas líderes en el mundo; Luma sobresale en movimiento fluido y control de cámara; MiniMax es ideal para prompts en idioma chino y ofrece acceso rápido y asequible. Considera el soporte de referencias, preajustes de estilo, requisitos de audio y precios al seleccionar tu herramienta.

Para más detalles sobre características, restricciones, precios y avances de modelos, consulta la documentación oficial de cada proveedor mencionada anteriormente.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Genera videos de alta calidad a partir de prompts de texto utilizando proveedores líderes de IA. Compatible con múltiples modelos, relaciones de aspecto, resoluciones y características específicas de proveedores como consistencia del mundo, controles de cámara y generación de audio.

## Herramientas

### `video_runway`

Genera videos usando Runway Gen-4 con consistencia del mundo y referencias visuales

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor de video \(runway\) |
| `apiKey` | string | Sí | Clave API de Runway |
| `model` | string | No | Modelo de Runway: gen-4 \(predeterminado, mayor calidad\) o gen-4-turbo \(más rápido\) |
| `prompt` | string | Sí | Prompt de texto que describe el video a generar |
| `duration` | number | No | Duración del video en segundos \(5 o 10, predeterminado: 5\) |
| `aspectRatio` | string | No | Relación de aspecto: 16:9 \(horizontal\), 9:16 \(vertical\), o 1:1 \(cuadrado\) |
| `resolution` | string | No | Resolución de video \(salida 720p\). Nota: Gen-4 Turbo produce nativamente a 720p |
| `visualReference` | json | Sí | Imagen de referencia REQUERIDA para Gen-4 \(objeto UserFile\). Gen-4 solo admite generación de imagen a video, no generación solo de texto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL del video generado |
| `videoFile` | json | Objeto de archivo de video con metadatos |
| `duration` | number | Duración del video en segundos |
| `width` | number | Ancho del video en píxeles |
| `height` | number | Alto del video en píxeles |
| `provider` | string | Proveedor utilizado \(runway\) |
| `model` | string | Modelo utilizado |
| `jobId` | string | ID de trabajo de Runway |

### `video_veo`

Generar videos usando Google Veo 3/3.1 con generación de audio nativa

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor de video \(veo\) |
| `apiKey` | string | Sí | Clave API de Google Gemini |
| `model` | string | No | Modelo Veo: veo-3 \(predeterminado, mayor calidad\), veo-3-fast \(más rápido\), o veo-3.1 \(más reciente\) |
| `prompt` | string | Sí | Texto descriptivo del video a generar |
| `duration` | number | No | Duración del video en segundos \(4, 6, u 8, predeterminado: 8\) |
| `aspectRatio` | string | No | Relación de aspecto: 16:9 \(horizontal\) o 9:16 \(vertical\) |
| `resolution` | string | No | Resolución de video: 720p o 1080p \(predeterminado: 1080p\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL del video generado |
| `videoFile` | json | Objeto de archivo de video con metadatos |
| `duration` | number | Duración del video en segundos |
| `width` | number | Ancho del video en píxeles |
| `height` | number | Alto del video en píxeles |
| `provider` | string | Proveedor utilizado \(veo\) |
| `model` | string | Modelo utilizado |
| `jobId` | string | ID de trabajo de Veo |

### `video_luma`

Genera videos usando Luma Dream Machine con controles avanzados de cámara

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor de video \(luma\) |
| `apiKey` | string | Sí | Clave API de Luma AI |
| `model` | string | No | Modelo de Luma: ray-2 \(predeterminado\) |
| `prompt` | string | Sí | Texto descriptivo del video a generar |
| `duration` | number | No | Duración del video en segundos \(5 o 9, predeterminado: 5\) |
| `aspectRatio` | string | No | Relación de aspecto: 16:9 \(horizontal\), 9:16 \(vertical\), o 1:1 \(cuadrado\) |
| `resolution` | string | No | Resolución de video: 540p, 720p, o 1080p \(predeterminado: 1080p\) |
| `cameraControl` | json | No | Controles de cámara como array de objetos de concepto. Formato: \[\{ "key": "concept_name" \}\]. Claves válidas: truck_left, truck_right, pan_left, pan_right, tilt_up, tilt_down, zoom_in, zoom_out, push_in, pull_out, orbit_left, orbit_right, crane_up, crane_down, static, handheld, y más de 20 opciones predefinidas adicionales |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL del video generado |
| `videoFile` | json | Objeto de archivo de video con metadatos |
| `duration` | number | Duración del video en segundos |
| `width` | number | Ancho del video en píxeles |
| `height` | number | Alto del video en píxeles |
| `provider` | string | Proveedor utilizado \(luma\) |
| `model` | string | Modelo utilizado |
| `jobId` | string | ID de trabajo de Luma |

### `video_minimax`

Genera videos usando MiniMax Hailuo a través de la API de la plataforma MiniMax con realismo avanzado y optimización de instrucciones

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor de video \(minimax\) |
| `apiKey` | string | Sí | Clave API de MiniMax desde platform.minimax.io |
| `model` | string | No | Modelo de MiniMax: hailuo-02 \(predeterminado\) |
| `prompt` | string | Sí | Instrucción de texto que describe el video a generar |
| `duration` | number | No | Duración del video en segundos \(6 o 10, predeterminado: 6\) |
| `promptOptimizer` | boolean | No | Habilitar optimización de instrucciones para mejores resultados \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL del video generado |
| `videoFile` | json | Objeto de archivo de video con metadatos |
| `duration` | number | Duración del video en segundos |
| `width` | number | Ancho del video en píxeles |
| `height` | number | Alto del video en píxeles |
| `provider` | string | Proveedor utilizado \(minimax\) |
| `model` | string | Modelo utilizado |
| `jobId` | string | ID de trabajo de MiniMax |

### `video_falai`

Genera videos usando la plataforma Fal.ai con acceso a múltiples modelos incluyendo Veo 3.1, Sora 2, Kling 2.5, MiniMax Hailuo y más

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor de video \(falai\) |
| `apiKey` | string | Sí | Clave API de Fal.ai |
| `model` | string | Sí | Modelo de Fal.ai: veo-3.1 \(Google Veo 3.1\), sora-2 \(OpenAI Sora 2\), kling-2.5-turbo-pro \(Kling 2.5 Turbo Pro\), kling-2.1-pro \(Kling 2.1 Master\), minimax-hailuo-2.3-pro \(MiniMax Hailuo Pro\), minimax-hailuo-2.3-standard \(MiniMax Hailuo Standard\), wan-2.1 \(WAN T2V\), ltxv-0.9.8 \(LTXV 13B\) |
| `prompt` | string | Sí | Instrucción de texto que describe el video a generar |
| `duration` | number | No | Duración del video en segundos \(varía según el modelo\) |
| `aspectRatio` | string | No | Relación de aspecto \(varía según el modelo\): 16:9, 9:16, 1:1 |
| `resolution` | string | No | Resolución de video \(varía según el modelo\): 540p, 720p, 1080p |
| `promptOptimizer` | boolean | No | Habilitar optimización de instrucciones para modelos MiniMax \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL del video generado |
| `videoFile` | json | Objeto de archivo de video con metadatos |
| `duration` | number | Duración del video en segundos |
| `width` | number | Ancho del video en píxeles |
| `height` | number | Alto del video en píxeles |
| `provider` | string | Proveedor utilizado \(falai\) |
| `model` | string | Modelo utilizado |
| `jobId` | string | ID del trabajo |

## Notas

- Categoría: `tools`
- Tipo: `video_generator`
```

--------------------------------------------------------------------------------

---[FILE: vision.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/vision.mdx

```text
---
title: Visión
description: Analiza imágenes con modelos de visión
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="vision"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
Visión es una herramienta que te permite analizar imágenes con modelos de visión.

Con Vision, puedes:

- **Analizar imágenes**: Analizar imágenes con modelos de visión
- **Extraer texto**: Extraer texto de imágenes
- **Identificar objetos**: Identificar objetos en imágenes
- **Describir imágenes**: Describir imágenes en detalle
- **Generar imágenes**: Generar imágenes a partir de texto

En Sim, la integración de Vision permite a tus agentes analizar imágenes con modelos de visión como parte de sus flujos de trabajo. Esto permite potentes escenarios de automatización que requieren analizar imágenes con modelos de visión. Tus agentes pueden analizar imágenes con modelos de visión, extraer texto de imágenes, identificar objetos en imágenes, describir imágenes en detalle y generar imágenes a partir de texto. Esta integración cierra la brecha entre tus flujos de trabajo de IA y tus necesidades de análisis de imágenes, permitiendo automatizaciones más sofisticadas y centradas en imágenes. Al conectar Sim con Vision, puedes crear agentes que se mantengan actualizados con la información más reciente, proporcionen respuestas más precisas y entreguen más valor a los usuarios - todo sin requerir intervención manual o código personalizado.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Vision en el flujo de trabajo. Puede analizar imágenes con modelos de visión. Requiere clave API.

## Herramientas

### `vision_tool`

Procesa y analiza imágenes utilizando modelos avanzados de visión. Capaz de comprender el contenido de imágenes, extraer texto, identificar objetos y proporcionar descripciones visuales detalladas.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `apiKey` | string | Sí | Clave API para el proveedor de modelo seleccionado |
| `imageUrl` | string | No | URL de imagen accesible públicamente |
| `imageFile` | file | No | Archivo de imagen para analizar |
| `model` | string | No | Modelo de visión a utilizar \(gpt-4o, claude-3-opus-20240229, etc\) |
| `prompt` | string | No | Prompt personalizado para análisis de imagen |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | El contenido analizado y la descripción de la imagen |
| `model` | string | El modelo de visión que se utilizó para el análisis |
| `tokens` | number | Total de tokens utilizados para el análisis |
| `usage` | object | Desglose detallado del uso de tokens |

## Notas

- Categoría: `tools`
- Tipo: `vision`
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/wealthbox.mdx

```text
---
title: Wealthbox
description: Interactúa con Wealthbox
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wealthbox"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wealthbox](https://www.wealthbox.com/) es una plataforma CRM completa diseñada específicamente para asesores financieros y profesionales de gestión patrimonial. Proporciona un sistema centralizado para gestionar relaciones con clientes, seguimiento de interacciones y organización de flujos de trabajo empresariales en la industria de servicios financieros.

Con Wealthbox, puedes:

- **Gestionar relaciones con clientes**: Almacenar información detallada de contactos, datos de antecedentes e historiales de relaciones para todos tus clientes
- **Seguimiento de interacciones**: Crear y mantener notas sobre reuniones, llamadas y otros puntos de contacto con clientes
- **Organizar tareas**: Programar y gestionar actividades de seguimiento, fechas límite y elementos de acción importantes
- **Documentar flujos de trabajo**: Mantener registros completos de comunicaciones con clientes y procesos de negocio
- **Acceder a datos de clientes**: Recuperar información rápidamente con gestión organizada de contactos y capacidades de búsqueda
- **Automatizar seguimientos**: Establecer recordatorios y programar tareas para asegurar un compromiso constante con el cliente

En Sim, la integración de Wealthbox permite a tus agentes interactuar sin problemas con tus datos de CRM mediante autenticación OAuth. Esto permite potentes escenarios de automatización como la creación automática de notas de clientes a partir de transcripciones de reuniones, actualización de información de contacto, programación de tareas de seguimiento y recuperación de detalles de clientes para comunicaciones personalizadas. Tus agentes pueden leer notas existentes, contactos y tareas para entender el historial del cliente, mientras también crean nuevas entradas para mantener registros actualizados. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la gestión de relaciones con clientes, permitiendo la entrada automatizada de datos, información inteligente sobre clientes y procesos administrativos optimizados que liberan tiempo para actividades más valiosas orientadas al cliente.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Wealthbox en el flujo de trabajo. Puede leer y escribir notas, leer y escribir contactos, y leer y escribir tareas. Requiere OAuth.

## Herramientas

### `wealthbox_read_note`

Leer contenido de una nota de Wealthbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `noteId` | string | No | El ID de la nota a leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos y metadatos de la nota |

### `wealthbox_write_note`

Crear o actualizar una nota de Wealthbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `content` | string | Sí | El cuerpo principal de la nota |
| `contactId` | string | No | ID del contacto para vincular a esta nota |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos y metadatos de la nota creada o actualizada |

### `wealthbox_read_contact`

Leer contenido de un contacto de Wealthbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `contactId` | string | No | El ID del contacto a leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos y metadatos del contacto |

### `wealthbox_write_contact`

Crear un nuevo contacto en Wealthbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `firstName` | string | Sí | El nombre del contacto |
| `lastName` | string | Sí | El apellido del contacto |
| `emailAddress` | string | No | La dirección de correo electrónico del contacto |
| `backgroundInformation` | string | No | Información de antecedentes sobre el contacto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos y metadatos del contacto creado o actualizado |

### `wealthbox_read_task`

Leer contenido de una tarea de Wealthbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | No | El ID de la tarea a leer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos y metadatos de la tarea |

### `wealthbox_write_task`

Crear o actualizar una tarea de Wealthbox

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `title` | string | Sí | El nombre/título de la tarea |
| `dueDate` | string | Sí | La fecha y hora de vencimiento de la tarea \(formato: "AAAA-MM-DD HH:MM AM/PM -HHMM", p. ej., "2015-05-24 11:00 AM -0400"\) |
| `contactId` | string | No | ID del contacto para vincular a esta tarea |
| `description` | string | No | Descripción o notas sobre la tarea |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos y metadatos de la tarea creada o actualizada |

## Notas

- Categoría: `tools`
- Tipo: `wealthbox`
```

--------------------------------------------------------------------------------

---[FILE: webflow.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/webflow.mdx

```text
---
title: Webflow
description: Gestionar colecciones CMS de Webflow
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webflow"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Webflow](https://webflow.com/) es una potente plataforma visual de diseño web que te permite crear sitios web responsivos sin escribir código. Combina una interfaz de diseño visual con un robusto CMS (Sistema de Gestión de Contenidos) que te permite crear, gestionar y publicar contenido dinámico para tus sitios web.

Con Webflow, puedes:

- **Diseñar visualmente**: Crear sitios web personalizados con un editor visual que genera código HTML/CSS limpio y semántico
- **Gestionar contenido dinámicamente**: Usar el CMS para crear colecciones de contenido estructurado como entradas de blog, productos, miembros del equipo o cualquier dato personalizado
- **Publicar instantáneamente**: Implementar tus sitios en el alojamiento de Webflow o exportar el código para alojamiento personalizado
- **Crear diseños responsivos**: Construir sitios que funcionen perfectamente en dispositivos de escritorio, tabletas y móviles
- **Personalizar colecciones**: Definir campos personalizados y estructuras de datos para tus tipos de contenido
- **Automatizar actualizaciones de contenido**: Gestionar programáticamente el contenido de tu CMS a través de APIs

En Sim, la integración con Webflow permite a tus agentes interactuar sin problemas con tus colecciones CMS de Webflow mediante autenticación API. Esto permite potentes escenarios de automatización como la creación automática de entradas de blog a partir de contenido generado por IA, actualización de información de productos, gestión de perfiles de miembros del equipo y recuperación de elementos CMS para la generación de contenido dinámico. Tus agentes pueden listar elementos existentes para navegar por tu contenido, recuperar elementos específicos por ID, crear nuevas entradas para añadir contenido fresco, actualizar elementos existentes para mantener la información actualizada y eliminar contenido obsoleto. Esta integración cierra la brecha entre tus flujos de trabajo de IA y tu CMS de Webflow, permitiendo la gestión automatizada de contenido, actualizaciones dinámicas del sitio web y flujos de trabajo de contenido optimizados que mantienen tus sitios frescos y actualizados sin intervención manual.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra el CMS de Webflow en el flujo de trabajo. Puede crear, obtener, listar, actualizar o eliminar elementos en las colecciones del CMS de Webflow. Gestiona tu contenido de Webflow de forma programática. Se puede usar en modo de activación para iniciar flujos de trabajo cuando cambian los elementos de la colección o se envían formularios.

## Herramientas

### `webflow_list_items`

Listar todos los elementos de una colección del CMS de Webflow

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio de Webflow |
| `collectionId` | string | Sí | ID de la colección |
| `offset` | number | No | Desplazamiento para paginación \(opcional\) |
| `limit` | number | No | Número máximo de elementos a devolver \(opcional, predeterminado: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `items` | json | Array de elementos de la colección |
| `metadata` | json | Metadatos sobre la consulta |

### `webflow_get_item`

Obtener un solo elemento de una colección del CMS de Webflow

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio de Webflow |
| `collectionId` | string | Sí | ID de la colección |
| `itemId` | string | Sí | ID del elemento a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `item` | json | El objeto del elemento recuperado |
| `metadata` | json | Metadatos sobre el elemento recuperado |

### `webflow_create_item`

Crear un nuevo elemento en una colección del CMS de Webflow

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio de Webflow |
| `collectionId` | string | Sí | ID de la colección |
| `fieldData` | json | Sí | Datos de campo para el nuevo elemento como objeto JSON. Las claves deben coincidir con los nombres de campo de la colección. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `item` | json | El objeto del elemento creado |
| `metadata` | json | Metadatos sobre el elemento creado |

### `webflow_update_item`

Actualizar un elemento existente en una colección CMS de Webflow

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio de Webflow |
| `collectionId` | string | Sí | ID de la colección |
| `itemId` | string | Sí | ID del elemento a actualizar |
| `fieldData` | json | Sí | Datos de campo para actualizar como objeto JSON. Solo incluye los campos que quieres cambiar. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `item` | json | El objeto del elemento actualizado |
| `metadata` | json | Metadatos sobre el elemento actualizado |

### `webflow_delete_item`

Eliminar un elemento de una colección CMS de Webflow

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Sí | ID del sitio de Webflow |
| `collectionId` | string | Sí | ID de la colección |
| `itemId` | string | Sí | ID del elemento a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la eliminación fue exitosa |
| `metadata` | json | Metadatos sobre la eliminación |

## Notas

- Categoría: `tools`
- Tipo: `webflow`
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/webhook.mdx

```text
---
title: Webhook
description: Activa la ejecución de flujos de trabajo desde webhooks externos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webhook"
  color="#10B981"
/>

## Notas

- Categoría: `triggers`
- Tipo: `webhook`
```

--------------------------------------------------------------------------------

---[FILE: whatsapp.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/whatsapp.mdx

```text
---
title: WhatsApp
description: Enviar mensajes de WhatsApp
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="whatsapp"
  color="#25D366"
/>

{/* MANUAL-CONTENT-START:intro */}
[WhatsApp](https://www.whatsapp.com/) es una plataforma de mensajería globalmente popular que permite una comunicación segura y confiable entre individuos y empresas.

La API de WhatsApp Business proporciona a las organizaciones potentes capacidades para:

- **Interactuar con clientes**: Enviar mensajes personalizados, notificaciones y actualizaciones directamente a la aplicación de mensajería preferida de los clientes
- **Automatizar conversaciones**: Crear chatbots interactivos y sistemas de respuesta automatizada para consultas comunes
- **Mejorar el soporte**: Proporcionar servicio al cliente en tiempo real a través de una interfaz familiar con soporte para contenido multimedia
- **Impulsar conversiones**: Facilitar transacciones y seguimientos con clientes en un entorno seguro y conforme

En Sim, la integración con WhatsApp permite a tus agentes aprovechar estas capacidades de mensajería como parte de sus flujos de trabajo. Esto crea oportunidades para escenarios sofisticados de interacción con clientes como recordatorios de citas, códigos de verificación, alertas y conversaciones interactivas. La integración conecta tus flujos de trabajo de IA con los canales de comunicación de los clientes, permitiendo que tus agentes entreguen información oportuna y relevante directamente a los dispositivos móviles de los usuarios. Al conectar Sim con WhatsApp, puedes construir agentes inteligentes que interactúen con los clientes a través de su plataforma de mensajería preferida, mejorando la experiencia del usuario mientras automatizas tareas rutinarias de mensajería.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integrar WhatsApp en el flujo de trabajo. Puede enviar mensajes.

## Herramientas

### `whatsapp_send_message`

Enviar mensajes de WhatsApp

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `phoneNumber` | string | Sí | Número de teléfono del destinatario con código de país |
| `message` | string | Sí | Contenido del mensaje a enviar |
| `phoneNumberId` | string | Sí | ID del número de teléfono de WhatsApp Business |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito del envío del mensaje de WhatsApp |
| `messageId` | string | Identificador único del mensaje de WhatsApp |
| `phoneNumber` | string | Número de teléfono del destinatario |
| `status` | string | Estado de entrega del mensaje |
| `timestamp` | string | Marca de tiempo del envío del mensaje |

## Notas

- Categoría: `tools`
- Tipo: `whatsapp`
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/wikipedia.mdx

```text
---
title: Wikipedia
description: Busca y recupera contenido de Wikipedia
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wikipedia"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wikipedia](https://www.wikipedia.org/) es la enciclopedia en línea gratuita más grande del mundo, que ofrece millones de artículos sobre una amplia gama de temas, escritos y mantenidos colaborativamente por voluntarios.

Con Wikipedia, puedes:

- **Buscar artículos**: Encuentra páginas relevantes de Wikipedia buscando por palabras clave o temas
- **Obtener resúmenes de artículos**: Recupera resúmenes concisos de páginas de Wikipedia para consultas rápidas
- **Acceder al contenido completo**: Obtén el contenido completo de los artículos de Wikipedia para información detallada
- **Descubrir artículos aleatorios**: Explora nuevos temas recuperando páginas aleatorias de Wikipedia

En Sim, la integración con Wikipedia permite a tus agentes acceder e interactuar programáticamente con el contenido de Wikipedia como parte de sus flujos de trabajo. Los agentes pueden buscar artículos, obtener resúmenes, recuperar contenido completo de páginas y descubrir artículos aleatorios, potenciando tus automatizaciones con información actualizada y confiable de la enciclopedia más grande del mundo. Esta integración es ideal para escenarios como investigación, enriquecimiento de contenido, verificación de hechos y descubrimiento de conocimiento, permitiendo a tus agentes incorporar perfectamente datos de Wikipedia en sus procesos de toma de decisiones y ejecución de tareas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Wikipedia en el flujo de trabajo. Puede obtener resúmenes de páginas, buscar páginas, obtener contenido de páginas y obtener páginas aleatorias.

## Herramientas

### `wikipedia_summary`

Obtén un resumen y metadatos de una página específica de Wikipedia.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `pageTitle` | string | Sí | Título de la página de Wikipedia para obtener el resumen |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `summary` | object | Resumen y metadatos de la página de Wikipedia |

### `wikipedia_search`

Buscar páginas de Wikipedia por título o contenido.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda para encontrar páginas de Wikipedia |
| `searchLimit` | number | No | Número máximo de resultados a devolver \(predeterminado: 10, máximo: 50\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `searchResults` | array | Array de páginas de Wikipedia coincidentes |

### `wikipedia_content`

Obtener el contenido HTML completo de una página de Wikipedia.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | Sí | Título de la página de Wikipedia para obtener su contenido |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | object | Contenido HTML completo y metadatos de la página de Wikipedia |

### `wikipedia_random`

Obtener una página aleatoria de Wikipedia.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `randomPage` | object | Datos de una página aleatoria de Wikipedia |

## Notas

- Categoría: `tools`
- Tipo: `wikipedia`
```

--------------------------------------------------------------------------------

````
