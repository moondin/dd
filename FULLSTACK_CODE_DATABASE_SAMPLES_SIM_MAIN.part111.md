---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 111
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 111 of 933)

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

---[FILE: exa.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/exa.mdx

```text
---
title: Exa
description: Busca con Exa AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="exa"
  color="#1F40ED"
/>

{/* MANUAL-CONTENT-START:intro */}
[Exa](https://exa.ai/) es un motor de búsqueda impulsado por IA diseñado específicamente para desarrolladores e investigadores, que proporciona información altamente relevante y actualizada de toda la web. Combina capacidades avanzadas de búsqueda semántica con comprensión de IA para ofrecer resultados más precisos y contextualmente relevantes que los motores de búsqueda tradicionales.

Con Exa, puedes:

- **Buscar con lenguaje natural**: Encuentra información utilizando consultas y preguntas conversacionales
- **Obtener resultados precisos**: Recibe resultados de búsqueda altamente relevantes con comprensión semántica
- **Acceder a información actualizada**: Obtén información actual de toda la web
- **Encontrar contenido similar**: Descubre recursos relacionados basados en similitud de contenido
- **Extraer contenidos de páginas web**: Recupera y procesa el texto completo de páginas web
- **Responder preguntas con citas**: Haz preguntas y recibe respuestas directas con fuentes de apoyo
- **Realizar tareas de investigación**: Automatiza flujos de trabajo de investigación de múltiples pasos para recopilar, sintetizar y resumir información

En Sim, la integración de Exa permite a tus agentes buscar información en la web, recuperar contenido de URLs específicas, encontrar recursos similares, responder preguntas con citas y realizar tareas de investigación, todo de forma programática a través de llamadas a la API. Esto permite a tus agentes acceder a información en tiempo real desde internet, mejorando su capacidad para proporcionar respuestas precisas, actuales y relevantes. La integración es particularmente valiosa para tareas de investigación, recopilación de información, descubrimiento de contenido y respuesta a preguntas que requieren información actualizada de toda la web.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Exa en el flujo de trabajo. Puede buscar, obtener contenidos, encontrar enlaces similares, responder a preguntas y realizar investigaciones. Requiere clave API.

## Herramientas

### `exa_search`

Busca en la web usando Exa AI. Devuelve resultados de búsqueda relevantes con títulos, URLs y fragmentos de texto.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda a ejecutar |
| `numResults` | number | No | Número de resultados a devolver \(predeterminado: 10, máximo: 25\) |
| `useAutoprompt` | boolean | No | Si se debe usar autoprompt para mejorar la consulta \(predeterminado: false\) |
| `type` | string | No | Tipo de búsqueda: neural, keyword, auto o fast \(predeterminado: auto\) |
| `includeDomains` | string | No | Lista separada por comas de dominios a incluir en los resultados |
| `excludeDomains` | string | No | Lista separada por comas de dominios a excluir de los resultados |
| `category` | string | No | Filtrar por categoría: company, research paper, news, pdf, github, tweet, personal site, linkedin profile, financial report |
| `text` | boolean | No | Incluir contenido de texto completo en los resultados \(predeterminado: false\) |
| `highlights` | boolean | No | Incluir fragmentos destacados en los resultados \(predeterminado: false\) |
| `summary` | boolean | No | Incluir resúmenes generados por IA en los resultados \(predeterminado: false\) |
| `livecrawl` | string | No | Modo de rastreo en vivo: never \(predeterminado\), fallback, always, o preferred \(siempre intenta livecrawl, recurre a caché si falla\) |
| `apiKey` | string | Sí | Clave API de Exa AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Resultados de búsqueda con títulos, URLs y fragmentos de texto |

### `exa_get_contents`

Recupera el contenido de páginas web usando Exa AI. Devuelve el título, contenido de texto y resúmenes opcionales para cada URL.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `urls` | string | Sí | Lista separada por comas de URLs para recuperar contenido |
| `text` | boolean | No | Si es true, devuelve el texto completo de la página con la configuración predeterminada. Si es false, desactiva la devolución de texto. |
| `summaryQuery` | string | No | Consulta para guiar la generación del resumen |
| `subpages` | number | No | Número de subpáginas a rastrear desde las URLs proporcionadas |
| `subpageTarget` | string | No | Palabras clave separadas por comas para dirigirse a subpáginas específicas \(por ejemplo, "docs,tutorial,about"\) |
| `highlights` | boolean | No | Incluir fragmentos destacados en los resultados \(predeterminado: false\) |
| `livecrawl` | string | No | Modo de rastreo en vivo: never \(predeterminado\), fallback, always, o preferred \(siempre intenta livecrawl, recurre a caché si falla\) |
| `apiKey` | string | Sí | Clave API de Exa AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Contenido recuperado de URLs con título, texto y resúmenes |

### `exa_find_similar_links`

Encuentra páginas web similares a una URL determinada utilizando Exa AI. Devuelve una lista de enlaces similares con títulos y fragmentos de texto.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `url` | string | Sí | La URL para encontrar enlaces similares |
| `numResults` | number | No | Número de enlaces similares a devolver \(predeterminado: 10, máximo: 25\) |
| `text` | boolean | No | Si se debe incluir el texto completo de las páginas similares |
| `includeDomains` | string | No | Lista separada por comas de dominios a incluir en los resultados |
| `excludeDomains` | string | No | Lista separada por comas de dominios a excluir de los resultados |
| `excludeSourceDomain` | boolean | No | Excluir el dominio de origen de los resultados \(predeterminado: false\) |
| `highlights` | boolean | No | Incluir fragmentos destacados en los resultados \(predeterminado: false\) |
| `summary` | boolean | No | Incluir resúmenes generados por IA en los resultados \(predeterminado: false\) |
| `livecrawl` | string | No | Modo de rastreo en vivo: never \(predeterminado\), fallback, always o preferred \(siempre intenta rastreo en vivo, recurre a caché si falla\) |
| `apiKey` | string | Sí | Clave API de Exa AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `similarLinks` | array | Enlaces similares encontrados con títulos, URLs y fragmentos de texto |

### `exa_answer`

Obtén una respuesta generada por IA a una pregunta con citas de la web utilizando Exa AI.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | La pregunta a responder |
| `text` | boolean | No | Si se debe incluir el texto completo de la respuesta |
| `apiKey` | string | Sí | Clave API de Exa AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `answer` | string | Respuesta generada por IA a la pregunta |
| `citations` | array | Fuentes y citas para la respuesta |

### `exa_research`

Realiza investigaciones exhaustivas utilizando IA para generar informes detallados con citas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta o tema de investigación |
| `model` | string | No | Modelo de investigación: exa-research-fast, exa-research \(predeterminado\), o exa-research-pro |
| `apiKey` | string | Sí | Clave API de Exa AI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `research` | array | Hallazgos de investigación exhaustivos con citas y resúmenes |

## Notas

- Categoría: `tools`
- Tipo: `exa`
```

--------------------------------------------------------------------------------

---[FILE: file.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/file.mdx

```text
---
title: Archivo
description: Leer y analizar múltiples archivos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="file"
  color="#40916C"
/>

{/* MANUAL-CONTENT-START:intro */}
La herramienta de análisis de archivos proporciona una forma potente de extraer y procesar contenido de varios formatos de archivo, facilitando la incorporación de datos de documentos en los flujos de trabajo de tu agente. Esta herramienta es compatible con múltiples formatos de archivo y puede manejar archivos de hasta 200MB de tamaño.

Con el analizador de archivos, puedes:

- **Procesar múltiples formatos de archivo**: Extraer texto de PDFs, CSVs, documentos Word (DOCX), archivos de texto y más
- **Manejar archivos grandes**: Procesar documentos de hasta 200MB de tamaño
- **Analizar archivos desde URLs**: Extraer directamente contenido de archivos alojados en línea proporcionando sus URLs
- **Procesar múltiples archivos a la vez**: Subir y analizar varios archivos en una sola operación
- **Extraer datos estructurados**: Mantener el formato y la estructura de los documentos originales cuando sea posible

La herramienta de análisis de archivos es particularmente útil para escenarios donde tus agentes necesitan trabajar con contenido de documentos, como analizar informes, extraer datos de hojas de cálculo o procesar texto de varias fuentes de documentos. Simplifica el proceso de hacer que el contenido de documentos esté disponible para tus agentes, permitiéndoles trabajar con información almacenada en archivos tan fácilmente como con entrada de texto directa.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integrar archivo en el flujo de trabajo. Puede cargar un archivo manualmente o insertar una URL de archivo.

## Herramientas

### `file_parser`

Analiza uno o más archivos subidos o archivos desde URLs (texto, PDF, CSV, imágenes, etc.)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `filePath` | string | Sí | Ruta al archivo\(s\). Puede ser una única ruta, URL o un array de rutas. |
| `fileType` | string | No | Tipo de archivo a analizar \(auto-detectado si no se especifica\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `files` | array | Array de archivos analizados |
| `combinedContent` | string | Contenido combinado de todos los archivos analizados |

## Notas

- Categoría: `tools`
- Tipo: `file`
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/firecrawl.mdx

```text
---
title: Firecrawl
description: Raspa, busca, rastrea, mapea y extrae datos web
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="firecrawl"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Firecrawl](https://firecrawl.dev/) es una potente API de extracción de contenido y web scraping que se integra perfectamente en Sim, permitiendo a los desarrolladores extraer contenido limpio y estructurado de cualquier sitio web. Esta integración proporciona una forma sencilla de transformar páginas web en formatos de datos utilizables como Markdown y HTML, preservando el contenido esencial.

Con Firecrawl en Sim, puedes:

- **Extraer contenido limpio**: Eliminar anuncios, elementos de navegación y otras distracciones para obtener solo el contenido principal
- **Convertir a formatos estructurados**: Transformar páginas web en Markdown, HTML o JSON
- **Capturar metadatos**: Extraer metadatos SEO, etiquetas Open Graph y otra información de la página
- **Manejar sitios con uso intensivo de JavaScript**: Procesar contenido de aplicaciones web modernas que dependen de JavaScript
- **Filtrar contenido**: Enfocarse en partes específicas de una página usando selectores CSS
- **Procesar a escala**: Manejar necesidades de scraping de alto volumen con una API confiable
- **Buscar en la web**: Realizar búsquedas web inteligentes y obtener resultados estructurados
- **Rastrear sitios completos**: Rastrear múltiples páginas de un sitio web y agregar su contenido

En Sim, la integración de Firecrawl permite a tus agentes acceder y procesar contenido web de forma programática como parte de sus flujos de trabajo. Las operaciones compatibles incluyen:

- **Scrape**: Extraer contenido estructurado (Markdown, HTML, metadatos) de una sola página web.
- **Search**: Buscar información en la web utilizando las capacidades de búsqueda inteligente de Firecrawl.
- **Crawl**: Rastrear múltiples páginas de un sitio web, devolviendo contenido estructurado y metadatos para cada página.

Esto permite a tus agentes recopilar información de sitios web, extraer datos estructurados y utilizar esa información para tomar decisiones o generar ideas, todo sin tener que navegar por las complejidades del análisis de HTML crudo o la automatización del navegador. Simplemente configura el bloque Firecrawl con tu clave API, selecciona la operación (Scrape, Search o Crawl) y proporciona los parámetros relevantes. Tus agentes pueden comenzar inmediatamente a trabajar con contenido web en un formato limpio y estructurado.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Firecrawl en el flujo de trabajo. Extrae datos de páginas, busca en la web, rastrea sitios completos, mapea estructuras de URL y extrae datos estructurados con IA.

## Herramientas

### `firecrawl_scrape`

Extrae contenido estructurado de páginas web con soporte integral de metadatos. Convierte el contenido a markdown o HTML mientras captura metadatos SEO, etiquetas Open Graph e información de la página.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | La URL de la que extraer contenido |
| `scrapeOptions` | json | No | Opciones para la extracción de contenido |
| `apiKey` | string | Sí | Clave API de Firecrawl |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `markdown` | string | Contenido de la página en formato markdown |
| `html` | string | Contenido HTML sin procesar de la página |
| `metadata` | object | Metadatos de la página incluyendo información SEO y Open Graph |

### `firecrawl_search`

Busca información en la web usando Firecrawl

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | La consulta de búsqueda a utilizar |
| `apiKey` | string | Sí | Clave API de Firecrawl |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | array | Datos de resultados de búsqueda |

### `firecrawl_crawl`

Rastrea sitios web completos y extrae contenido estructurado de todas las páginas accesibles

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | La URL del sitio web a rastrear |
| `limit` | number | No | Número máximo de páginas a rastrear (predeterminado: 100) |
| `onlyMainContent` | boolean | No | Extraer solo el contenido principal de las páginas |
| `apiKey` | string | Sí | Clave API de Firecrawl |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pages` | array | Array de páginas rastreadas con su contenido y metadatos |

### `firecrawl_map`

Obtén una lista completa de URLs de cualquier sitio web de forma rápida y confiable. Útil para descubrir todas las páginas de un sitio sin necesidad de rastrearlas.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | La URL base para mapear y descubrir enlaces |
| `search` | string | No | Filtrar resultados por relevancia a un término de búsqueda (ej., "blog") |
| `sitemap` | string | No | Controla el uso del sitemap: "skip", "include" (predeterminado), o "only" |
| `includeSubdomains` | boolean | No | Incluir URLs de subdominios (predeterminado: true) |
| `ignoreQueryParameters` | boolean | No | Excluir URLs que contengan cadenas de consulta (predeterminado: true) |
| `limit` | number | No | Número máximo de enlaces a devolver (máx: 100.000, predeterminado: 5.000) |
| `timeout` | number | No | Tiempo de espera de la solicitud en milisegundos |
| `location` | json | No | Contexto geográfico para proxy (país, idiomas) |
| `apiKey` | string | Sí | Clave API de Firecrawl |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la operación de mapeo fue exitosa |
| `links` | array | Array de URLs descubiertas del sitio web |

### `firecrawl_extract`

Extrae datos estructurados de páginas web completas utilizando instrucciones en lenguaje natural y esquema JSON. Función agente potente para la extracción inteligente de datos.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `urls` | json | Sí | Array de URLs de las que extraer datos (admite formato glob) |
| `prompt` | string | No | Instrucciones en lenguaje natural para el proceso de extracción |
| `schema` | json | No | Esquema JSON que define la estructura de los datos a extraer |
| `enableWebSearch` | boolean | No | Habilitar búsqueda web para encontrar información complementaria (predeterminado: false) |
| `ignoreSitemap` | boolean | No | Ignorar archivos sitemap.xml durante el escaneo (predeterminado: false) |
| `includeSubdomains` | boolean | No | Extender el escaneo a subdominios (predeterminado: true) |
| `showSources` | boolean | No | Devolver fuentes de datos en la respuesta (predeterminado: false) |
| `ignoreInvalidURLs` | boolean | No | Omitir URLs inválidas en el array (predeterminado: true) |
| `scrapeOptions` | json | No | Opciones avanzadas de configuración de extracción |
| `apiKey` | string | Sí | Clave API de Firecrawl |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la operación de extracción fue exitosa |
| `data` | object | Datos estructurados extraídos según el esquema o indicación |

## Notas

- Categoría: `tools`
- Tipo: `firecrawl`
```

--------------------------------------------------------------------------------

---[FILE: generic_webhook.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/generic_webhook.mdx

```text
---
title: Webhook
description: Recibe webhooks de cualquier servicio configurando un webhook personalizado.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"
import { Image } from '@/components/ui/image'

<BlockInfoCard 
  type="generic_webhook"
  color="#10B981"
/>

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Configuración del bloque Webhook"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Descripción general

El bloque Webhook genérico te permite recibir webhooks desde cualquier servicio externo. Este es un disparador flexible que puede manejar cualquier carga útil JSON, lo que lo hace ideal para integrarse con servicios que no tienen un bloque Sim dedicado.

## Uso básico

### Modo de paso simple

Sin definir un formato de entrada, el webhook transmite todo el cuerpo de la solicitud tal como está:

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Test webhook trigger",
    "data": {
      "key": "value"
    }
  }'
```

Accede a los datos en bloques posteriores usando:
- `<webhook1.message>` → "Test webhook trigger"
- `<webhook1.data.key>` → "value"

### Formato de entrada estructurado (opcional)

Define un esquema de entrada para obtener campos tipados y habilitar funciones avanzadas como cargas de archivos:

**Configuración del formato de entrada:**

```json
[
  { "name": "message", "type": "string" },
  { "name": "priority", "type": "number" },
  { "name": "documents", "type": "files" }
]
```

**Solicitud de webhook:**

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Invoice submission",
    "priority": 1,
    "documents": [
      {
        "type": "file",
        "data": "data:application/pdf;base64,JVBERi0xLjQK...",
        "name": "invoice.pdf",
        "mime": "application/pdf"
      }
    ]
  }'
```

## Cargas de archivos

### Formatos de archivo compatibles

El webhook admite dos formatos de entrada de archivos:

#### 1. Archivos codificados en Base64
Para cargar contenido de archivos directamente:

```json
{
  "documents": [
    {
      "type": "file",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "name": "screenshot.png",
      "mime": "image/png"
    }
  ]
}
```

- **Tamaño máximo**: 20MB por archivo
- **Formato**: URL de datos estándar con codificación base64
- **Almacenamiento**: Los archivos se cargan en almacenamiento seguro de ejecución

#### 2. Referencias URL
Para pasar URLs de archivos existentes:

```json
{
  "documents": [
    {
      "type": "url",
      "data": "https://example.com/files/document.pdf",
      "name": "document.pdf",
      "mime": "application/pdf"
    }
  ]
}
```

### Acceso a archivos en bloques posteriores

Los archivos se procesan en objetos `UserFile` con las siguientes propiedades:

```typescript
{
  id: string,          // Unique file identifier
  name: string,        // Original filename
  url: string,         // Presigned URL (valid for 5 minutes)
  size: number,        // File size in bytes
  type: string,        // MIME type
  key: string,         // Storage key
  uploadedAt: string,  // ISO timestamp
  expiresAt: string    // ISO timestamp (5 minutes)
}
```

**Acceso en bloques:**
- `<webhook1.documents[0].url>` → URL de descarga
- `<webhook1.documents[0].name>` → "invoice.pdf"
- `<webhook1.documents[0].size>` → 524288
- `<webhook1.documents[0].type>` → "application/pdf"

### Ejemplo completo de carga de archivos

```bash
# Create a base64-encoded file
echo "Hello World" | base64
# SGVsbG8gV29ybGQK

# Send webhook with file
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "subject": "Document for review",
    "attachments": [
      {
        "type": "file",
        "data": "data:text/plain;base64,SGVsbG8gV29ybGQK",
        "name": "sample.txt",
        "mime": "text/plain"
      }
    ]
  }'
```

## Autenticación

### Configurar autenticación (opcional)

En la configuración del webhook:
1. Habilitar "Requerir autenticación"
2. Establecer un token secreto
3. Elegir tipo de encabezado:
   - **Encabezado personalizado**: `X-Sim-Secret: your-token`
   - **Autorización Bearer**: `Authorization: Bearer your-token`

### Uso de la autenticación

```bash
# With custom header
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret-token" \
  -d '{"message": "Authenticated request"}'

# With bearer token
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{"message": "Authenticated request"}'
```

## Mejores prácticas

1. **Usar formato de entrada para estructura**: Define un formato de entrada cuando conozcas el esquema esperado. Esto proporciona:
   - Validación de tipo
   - Mejor autocompletado en el editor
   - Capacidades de carga de archivos

2. **Autenticación**: Habilita siempre la autenticación para webhooks en producción para prevenir accesos no autorizados.

3. **Límites de tamaño de archivo**: Mantén los archivos por debajo de 20MB. Para archivos más grandes, usa referencias URL en su lugar.

4. **Caducidad de archivos**: Los archivos descargados tienen URLs con caducidad de 5 minutos. Procésalos rápidamente o almacénalos en otro lugar si los necesitas por más tiempo.

5. **Manejo de errores**: El procesamiento de webhooks es asíncrono. Revisa los registros de ejecución para detectar errores.

6. **Pruebas**: Usa el botón "Probar webhook" en el editor para validar tu configuración antes de implementarla.

## Casos de uso

- **Envíos de formularios**: Recibe datos de formularios personalizados con cargas de archivos
- **Integraciones con terceros**: Conéctate con servicios que envían webhooks (Stripe, GitHub, etc.)
- **Procesamiento de documentos**: Acepta documentos de sistemas externos para procesarlos
- **Notificaciones de eventos**: Recibe datos de eventos de varias fuentes
- **APIs personalizadas**: Construye endpoints de API personalizados para tus aplicaciones

## Notas

- Categoría: `triggers`
- Tipo: `generic_webhook`
- **Soporte de archivos**: disponible a través de la configuración del formato de entrada
- **Tamaño máximo de archivo**: 20MB por archivo
```

--------------------------------------------------------------------------------

````
