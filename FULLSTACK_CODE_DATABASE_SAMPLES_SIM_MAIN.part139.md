---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 139
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 139 of 933)

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

---[FILE: tavily.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/tavily.mdx

```text
---
title: Tavily
description: Buscar y extraer información
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tavily"
  color="#0066FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Tavily](https://www.tavily.com/) es una API de búsqueda impulsada por IA diseñada específicamente para aplicaciones LLM. Proporciona capacidades de recuperación de información confiables y en tiempo real con características optimizadas para casos de uso de IA, incluyendo búsqueda semántica, extracción de contenido y recuperación de datos estructurados.

Con Tavily, puedes:

- **Realizar búsquedas contextuales**: Obtener resultados relevantes basados en la comprensión semántica en lugar de solo coincidencia de palabras clave
- **Extraer contenido estructurado**: Obtener información específica de páginas web en un formato limpio y utilizable
- **Acceder a información en tiempo real**: Recuperar datos actualizados de toda la web
- **Procesar múltiples URLs simultáneamente**: Extraer contenido de varias páginas web en una sola solicitud
- **Recibir resultados optimizados para IA**: Obtener resultados de búsqueda específicamente formateados para el consumo por sistemas de IA

En Sim, la integración de Tavily permite a tus agentes buscar en la web y extraer información como parte de sus flujos de trabajo. Esto permite escenarios de automatización sofisticados que requieren información actualizada de internet. Tus agentes pueden formular consultas de búsqueda, recuperar resultados relevantes y extraer contenido de páginas web específicas para informar sus procesos de toma de decisiones. Esta integración cierra la brecha entre la automatización de tu flujo de trabajo y el vasto conocimiento disponible en la web, permitiendo a tus agentes acceder a información en tiempo real sin intervención manual. Al conectar Sim con Tavily, puedes crear agentes que se mantengan actualizados con la información más reciente, proporcionen respuestas más precisas y entreguen más valor a los usuarios.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Tavily en el flujo de trabajo. Puede buscar en la web y extraer contenido de URLs específicas. Requiere clave API.

## Herramientas

### `tavily_search`

Realiza búsquedas web potenciadas por IA usando Tavily

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda a ejecutar |
| `max_results` | number | No | Número máximo de resultados \(1-20\) |
| `topic` | string | No | Tipo de categoría: general, noticias o finanzas \(predeterminado: general\) |
| `search_depth` | string | No | Alcance de búsqueda: básico \(1 crédito\) o avanzado \(2 créditos\) \(predeterminado: básico\) |
| `include_answer` | string | No | Respuesta generada por LLM: true/basic para respuesta rápida o advanced para detallada |
| `include_raw_content` | string | No | Contenido HTML analizado: true/markdown o formato de texto |
| `include_images` | boolean | No | Incluir resultados de búsqueda de imágenes |
| `include_image_descriptions` | boolean | No | Añadir texto descriptivo para imágenes |
| `include_favicon` | boolean | No | Incluir URLs de favicon |
| `chunks_per_source` | number | No | Número máximo de fragmentos relevantes por fuente \(1-3, predeterminado: 3\) |
| `time_range` | string | No | Filtrar por actualidad: día/d, semana/w, mes/m, año/y |
| `start_date` | string | No | Fecha de publicación más temprana \(formato AAAA-MM-DD\) |
| `end_date` | string | No | Fecha de publicación más reciente \(formato AAAA-MM-DD\) |
| `include_domains` | string | No | Lista separada por comas de dominios permitidos \(máx. 300\) |
| `exclude_domains` | string | No | Lista separada por comas de dominios bloqueados \(máx. 150\) |
| `country` | string | No | Potenciar resultados del país especificado \(solo tema general\) |
| `auto_parameters` | boolean | No | Configuración automática de parámetros basada en la intención de la consulta |
| `apiKey` | string | Sí | Clave API de Tavily |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `query` | string | La consulta de búsqueda que se ejecutó |
| `results` | array | Resultados generados por la herramienta |

### `tavily_extract`

Extrae contenido en bruto de múltiples páginas web simultáneamente usando Tavily

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Sí | URL o array de URLs de donde extraer contenido |
| `extract_depth` | string | No | La profundidad de extracción \(básica=1 crédito/5 URLs, avanzada=2 créditos/5 URLs\) |
| `format` | string | No | Formato de salida: markdown o texto \(predeterminado: markdown\) |
| `include_images` | boolean | No | Incorporar imágenes en la salida de extracción |
| `include_favicon` | boolean | No | Añadir URL del favicon para cada resultado |
| `apiKey` | string | Sí | Clave API de Tavily |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | La URL que fue extraída |

### `tavily_crawl`

Rastrea y extrae contenido sistemáticamente de sitios web usando Tavily

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | La URL raíz para comenzar el rastreo |
| `instructions` | string | No | Instrucciones en lenguaje natural para el rastreador \(cuesta 2 créditos por 10 páginas\) |
| `max_depth` | number | No | Qué tan lejos de la URL base explorar \(1-5, predeterminado: 1\) |
| `max_breadth` | number | No | Enlaces seguidos por nivel de página \(≥1, predeterminado: 20\) |
| `limit` | number | No | Total de enlaces procesados antes de detenerse \(≥1, predeterminado: 50\) |
| `select_paths` | string | No | Patrones regex separados por comas para incluir rutas de URL específicas \(ej., /docs/.*\) |
| `select_domains` | string | No | Patrones regex separados por comas para restringir el rastreo a ciertos dominios |
| `exclude_paths` | string | No | Patrones regex separados por comas para omitir rutas de URL específicas |
| `exclude_domains` | string | No | Patrones regex separados por comas para bloquear ciertos dominios |
| `allow_external` | boolean | No | Incluir enlaces de dominios externos en los resultados \(predeterminado: true\) |
| `include_images` | boolean | No | Incorporar imágenes en la salida del rastreo |
| `extract_depth` | string | No | Profundidad de extracción: básica \(1 crédito/5 páginas\) o avanzada \(2 créditos/5 páginas\) |
| `format` | string | No | Formato de salida: markdown o texto \(predeterminado: markdown\) |
| `include_favicon` | boolean | No | Añadir URL del favicon para cada resultado |
| `apiKey` | string | Sí | Clave API de Tavily |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `base_url` | string | La URL base que fue rastreada |
| `results` | array | La URL de la página rastreada |

### `tavily_map`

Descubre y visualiza la estructura de sitios web usando Tavily

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | La URL raíz para comenzar el mapeo |
| `instructions` | string | No | Guía en lenguaje natural para el comportamiento de mapeo \(cuesta 2 créditos por cada 10 páginas\) |
| `max_depth` | number | No | Qué tan lejos de la URL base explorar \(1-5, predeterminado: 1\) |
| `max_breadth` | number | No | Enlaces a seguir por nivel \(predeterminado: 20\) |
| `limit` | number | No | Total de enlaces a procesar \(predeterminado: 50\) |
| `select_paths` | string | No | Patrones regex separados por comas para filtrar rutas de URL \(ej., /docs/.*\) |
| `select_domains` | string | No | Patrones regex separados por comas para restringir el mapeo a dominios específicos |
| `exclude_paths` | string | No | Patrones regex separados por comas para excluir rutas de URL específicas |
| `exclude_domains` | string | No | Patrones regex separados por comas para excluir dominios |
| `allow_external` | boolean | No | Incluir enlaces de dominios externos en los resultados \(predeterminado: true\) |
| `apiKey` | string | Sí | Clave API de Tavily |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `base_url` | string | La URL base que fue mapeada |
| `results` | array | URL descubierta |

## Notas

- Categoría: `tools`
- Tipo: `tavily`
```

--------------------------------------------------------------------------------

---[FILE: telegram.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/telegram.mdx

```text
---
title: Telegram
description: Envía mensajes a través de Telegram o activa flujos de trabajo
  desde eventos de Telegram
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="telegram"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Telegram](https://telegram.org) es una plataforma de mensajería segura basada en la nube que permite una comunicación rápida y confiable en diferentes dispositivos y plataformas. Con más de 700 millones de usuarios activos mensuales, Telegram se ha establecido como uno de los servicios de mensajería líderes en el mundo, conocido por su seguridad, velocidad y potentes capacidades de API.

La API de Bot de Telegram proporciona un marco robusto para crear soluciones de mensajería automatizadas e integrar funciones de comunicación en aplicaciones. Con soporte para contenido multimedia, teclados en línea y comandos personalizados, los bots de Telegram pueden facilitar patrones de interacción sofisticados y flujos de trabajo automatizados.

Aprende cómo crear un disparador de webhook en Sim que inicia flujos de trabajo sin problemas a partir de mensajes de Telegram. Este tutorial te guía a través de la configuración de un webhook, su configuración con la API de bot de Telegram y la activación de acciones automatizadas en tiempo real. ¡Perfecto para agilizar tareas directamente desde tu chat!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/9oKcJtQ0_IM"
  title="Usa Telegram con Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Aprende cómo usar la herramienta de Telegram en Sim para automatizar sin problemas la entrega de mensajes a cualquier grupo de Telegram. Este tutorial te guía a través de la integración de la herramienta en tu flujo de trabajo, la configuración de mensajería grupal y la activación de actualizaciones automatizadas en tiempo real. ¡Perfecto para mejorar la comunicación directamente desde tu espacio de trabajo!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/AG55LpUreGI"
  title="Usa Telegram con Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Características principales de Telegram:

- Comunicación segura: Cifrado de extremo a extremo y almacenamiento seguro en la nube para mensajes y contenido multimedia
- Plataforma de bots: Potente API de bots para crear soluciones de mensajería automatizada y experiencias interactivas
- Soporte para contenido multimedia: Envía y recibe mensajes con formato de texto, imágenes, archivos y elementos interactivos
- Alcance global: Conéctate con usuarios de todo el mundo con soporte para múltiples idiomas y plataformas

En Sim, la integración con Telegram permite a tus agentes aprovechar estas potentes capacidades de mensajería como parte de sus flujos de trabajo. Esto crea oportunidades para notificaciones automatizadas, alertas y conversaciones interactivas a través de la plataforma de mensajería segura de Telegram. La integración permite a los agentes enviar mensajes de forma programática a individuos o canales, facilitando la comunicación oportuna y actualizaciones. Al conectar Sim con Telegram, puedes crear agentes inteligentes que interactúen con los usuarios a través de una plataforma de mensajería segura y ampliamente adoptada, perfecta para entregar notificaciones, actualizaciones y comunicaciones interactivas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Telegram en el flujo de trabajo. Puede enviar mensajes. Se puede usar en modo de activación para iniciar un flujo de trabajo cuando se envía un mensaje a un chat.

## Herramientas

### `telegram_message`

Envía mensajes a canales o usuarios de Telegram a través de la API de Bot de Telegram. Permite la comunicación directa y notificaciones con seguimiento de mensajes y confirmación de chat.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `text` | string | Sí | Texto del mensaje a enviar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Telegram |

## Notas

- Categoría: `tools`
- Tipo: `telegram`

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `messageId` | string | Sí | ID del mensaje a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Resultado de la operación de eliminación |

### `telegram_send_photo`

Envía fotos a canales o usuarios de Telegram a través de la API de Bot de Telegram.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `photo` | string | Sí | Foto a enviar. Proporciona un file_id o URL HTTP |
| `caption` | string | No | Pie de foto (opcional) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Telegram incluyendo foto(s) opcional(es) |

### `telegram_send_video`

Envía videos a canales o usuarios de Telegram a través de la API de Bot de Telegram.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `video` | string | Sí | Video a enviar. Proporciona un file_id o URL HTTP |
| `caption` | string | No | Pie de video (opcional) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Telegram incluyendo medios opcionales |

### `telegram_send_audio`

Envía archivos de audio a canales o usuarios de Telegram a través de la API de Bot de Telegram.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `audio` | string | Sí | Archivo de audio para enviar. Proporciona un file_id o URL HTTP |
| `caption` | string | No | Leyenda del audio \(opcional\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Telegram incluyendo información de voz/audio |

### `telegram_send_animation`

Envía animaciones (GIFs) a canales o usuarios de Telegram a través de la API de Bot de Telegram.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `animation` | string | Sí | Animación para enviar. Proporciona un file_id o URL HTTP |
| `caption` | string | No | Leyenda de la animación \(opcional\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Telegram incluyendo medios opcionales |

### `telegram_send_document`

Envía documentos (PDF, ZIP, DOC, etc.) a canales o usuarios de Telegram a través de la API de Bot de Telegram.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `botToken` | string | Sí | Tu token de API de Bot de Telegram |
| `chatId` | string | Sí | ID del chat de Telegram objetivo |
| `files` | file[] | No | Archivo de documento para enviar \(PDF, ZIP, DOC, etc.\). Tamaño máximo: 50MB |
| `caption` | string | No | Leyenda del documento \(opcional\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de éxito o error |
| `data` | object | Datos del mensaje de Telegram incluyendo documento |

## Notas

- Categoría: `tools`
- Tipo: `telegram`
```

--------------------------------------------------------------------------------

---[FILE: thinking.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/thinking.mdx

```text
---
title: Pensamiento
description: Obliga al modelo a detallar su proceso de pensamiento.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="thinking"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
La herramienta de Pensamiento anima a los modelos de IA a realizar un razonamiento explícito antes de responder a consultas complejas. Al proporcionar un espacio dedicado para el análisis paso a paso, esta herramienta ayuda a los modelos a desglosar problemas, considerar múltiples perspectivas y llegar a conclusiones más reflexivas.

Las investigaciones han demostrado que incitar a los modelos de lenguaje a "pensar paso a paso" puede mejorar significativamente sus capacidades de razonamiento. Según [la investigación de Anthropic sobre la herramienta Think de Claude](https://www.anthropic.com/engineering/claude-think-tool), cuando a los modelos se les da espacio para desarrollar explícitamente su razonamiento, demuestran:

- **Resolución de problemas mejorada**: Desglosando problemas complejos en pasos manejables
- **Mayor precisión**: Reduciendo errores al trabajar cuidadosamente en cada componente de un problema
- **Mayor transparencia**: Haciendo visible y auditable el proceso de razonamiento del modelo
- **Respuestas más matizadas**: Considerando múltiples ángulos antes de llegar a conclusiones

En Sim, la herramienta de Pensamiento crea una oportunidad estructurada para que tus agentes participen en este tipo de razonamiento deliberado. Al incorporar pasos de pensamiento en tus flujos de trabajo, puedes ayudar a tus agentes a abordar tareas complejas de manera más efectiva, evitar errores comunes de razonamiento y producir resultados de mayor calidad. Esto es particularmente valioso para tareas que involucran razonamiento de múltiples pasos, toma de decisiones complejas o situaciones donde la precisión es crítica.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Añade un paso donde el modelo explícitamente describe su proceso de pensamiento antes de continuar. Esto puede mejorar la calidad del razonamiento al fomentar un análisis paso a paso.

## Herramientas

### `thinking_tool`

Procesa un pensamiento/instrucción proporcionado, haciéndolo disponible para los pasos subsiguientes.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `thought` | string | Sí | Tu razonamiento interno, análisis o proceso de pensamiento. Utiliza esto para analizar el problema paso a paso antes de responder. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `acknowledgedThought` | string | El pensamiento que fue procesado y reconocido |

## Notas

- Categoría: `tools`
- Tipo: `thinking`
```

--------------------------------------------------------------------------------

---[FILE: translate.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/translate.mdx

```text
---
title: Traducir
description: Traduce texto a cualquier idioma
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="translate"
  color="#FF4B4B"
/>

{/* MANUAL-CONTENT-START:intro */}
Traducir es una herramienta que te permite traducir texto entre diferentes idiomas.

Con Traducir, puedes:

- **Traducir texto**: Traducir texto entre idiomas
- **Traducir documentos**: Traducir documentos entre idiomas
- **Traducir sitios web**: Traducir sitios web entre idiomas
- **Traducir imágenes**: Traducir imágenes entre idiomas
- **Traducir audio**: Traducir audio entre idiomas
- **Traducir videos**: Traducir videos entre idiomas
- **Traducir voz**: Traducir voz entre idiomas
- **Traducir texto**: Traducir texto entre idiomas
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Translate en el flujo de trabajo. Puede traducir texto a cualquier idioma.

## Herramientas

### `llm_chat`

Envía una solicitud de completado de chat a cualquier proveedor de LLM compatible

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `model` | string | Sí | El modelo a utilizar \(ej., gpt-4o, claude-sonnet-4-5, gemini-2.0-flash\) |
| `systemPrompt` | string | No | Prompt del sistema para establecer el comportamiento del asistente |
| `context` | string | Sí | El mensaje del usuario o contexto a enviar al modelo |
| `apiKey` | string | No | Clave API del proveedor \(usa la clave de la plataforma si no se proporciona para modelos alojados\) |
| `temperature` | number | No | Temperatura para la generación de respuestas \(0-2\) |
| `maxTokens` | number | No | Tokens máximos en la respuesta |
| `azureEndpoint` | string | No | URL del endpoint de Azure OpenAI |
| `azureApiVersion` | string | No | Versión de la API de Azure OpenAI |
| `vertexProject` | string | No | ID del proyecto de Google Cloud para Vertex AI |
| `vertexLocation` | string | No | Ubicación de Google Cloud para Vertex AI \(por defecto us-central1\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | El contenido de la respuesta generada |
| `model` | string | El modelo utilizado para la generación |
| `tokens` | object | Información de uso de tokens |

## Notas

- Categoría: `tools`
- Tipo: `translate`
```

--------------------------------------------------------------------------------

---[FILE: trello.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/trello.mdx

```text
---
title: Trello
description: Gestiona tableros y tarjetas de Trello
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="trello"
  color="#0052CC"
/>

{/* MANUAL-CONTENT-START:intro */}
[Trello](https://trello.com) es una herramienta de colaboración visual que te ayuda a organizar proyectos, tareas y flujos de trabajo utilizando tableros, listas y tarjetas.

Con Trello en Sim, puedes:

- **Listar tableros y listas**: Ver los tableros a los que tienes acceso y sus listas asociadas.
- **Listar y buscar tarjetas**: Obtener todas las tarjetas en un tablero o filtrar por lista para ver su contenido y estado.
- **Crear tarjetas**: Añadir nuevas tarjetas a una lista de Trello, incluyendo descripciones, etiquetas y fechas de vencimiento.
- **Actualizar y mover tarjetas**: Editar propiedades de tarjetas, mover tarjetas entre listas y establecer fechas de vencimiento o etiquetas.
- **Obtener actividad reciente**: Recuperar acciones e historial de actividad para tableros y tarjetas.
- **Comentar en tarjetas**: Añadir comentarios a las tarjetas para colaboración y seguimiento.

La integración de Trello con Sim permite a tus agentes gestionar programáticamente las tareas, tableros y proyectos de tu equipo. Automatiza flujos de trabajo de gestión de proyectos, mantén listas de tareas actualizadas, sincroniza con otras herramientas o activa flujos de trabajo inteligentes en respuesta a eventos de Trello, todo a través de tus agentes de IA.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra con Trello para gestionar tableros y tarjetas. Lista tableros, lista tarjetas, crea tarjetas, actualiza tarjetas, obtiene acciones y añade comentarios.

## Herramientas

### `trello_list_lists`

Listar todas las listas en un tablero de Trello

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Sí | ID del tablero del que listar las listas |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `lists` | array | Array de objetos de lista con id, nombre, closed, pos e idBoard |
| `count` | number | Número de listas devueltas |

### `trello_list_cards`

Listar todas las listas en un tablero de Trello

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Sí | ID del tablero del que listar las listas |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `cards` | array | Array de objetos de tarjeta con id, nombre, desc, url, IDs de tablero/lista, etiquetas y fecha de vencimiento |
| `count` | number | Número de tarjetas devueltas |

### `trello_create_card`

Crear una nueva tarjeta en un tablero de Trello

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Sí | ID del tablero en el que crear la tarjeta |
| `listId` | string | Sí | ID de la lista en la que crear la tarjeta |
| `name` | string | Sí | Nombre/título de la tarjeta |
| `desc` | string | No | Descripción de la tarjeta |
| `pos` | string | No | Posición de la tarjeta \(top, bottom, o número flotante positivo\) |
| `due` | string | No | Fecha de vencimiento \(formato ISO 8601\) |
| `labels` | string | No | Lista de IDs de etiquetas separados por comas |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `card` | object | El objeto de tarjeta creada con id, nombre, desc, url y otras propiedades |

### `trello_update_card`

Actualizar una tarjeta existente en Trello

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | Sí | ID de la tarjeta a actualizar |
| `name` | string | No | Nuevo nombre/título de la tarjeta |
| `desc` | string | No | Nueva descripción de la tarjeta |
| `closed` | boolean | No | Archivar/cerrar la tarjeta \(true\) o reabrirla \(false\) |
| `idList` | string | No | Mover tarjeta a una lista diferente |
| `due` | string | No | Fecha de vencimiento \(formato ISO 8601\) |
| `dueComplete` | boolean | No | Marcar la fecha de vencimiento como completada |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `card` | object | El objeto de tarjeta actualizada con id, nombre, desc, url y otras propiedades |

### `trello_get_actions`

Obtener actividad/acciones de un tablero o tarjeta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | No | ID del tablero del que obtener acciones \(se requiere boardId o cardId\) |
| `cardId` | string | No | ID de la tarjeta de la que obtener acciones \(se requiere boardId o cardId\) |
| `filter` | string | No | Filtrar acciones por tipo \(p.ej., "commentCard,updateCard,createCard" o "all"\) |
| `limit` | number | No | Número máximo de acciones a devolver \(predeterminado: 50, máx: 1000\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `actions` | array | Array de objetos de acción con tipo, fecha, miembro y datos |
| `count` | number | Número de acciones devueltas |

### `trello_add_comment`

Añadir un comentario a una tarjeta de Trello

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | Sí | ID de la tarjeta en la que comentar |
| `text` | string | Sí | Texto del comentario |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `comment` | object | El objeto de comentario creado con id, texto, fecha y miembro creador |

## Notas

- Categoría: `tools`
- Tipo: `trello`
```

--------------------------------------------------------------------------------

````
