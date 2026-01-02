---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 122
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 122 of 933)

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

---[FILE: linkedin.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/linkedin.mdx

```text
---
title: LinkedIn
description: Comparte publicaciones y gestiona tu presencia en LinkedIn
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkedin"
  color="#0072B1"
/>

{/* MANUAL-CONTENT-START:intro */}
[LinkedIn](https://www.linkedin.com) es la plataforma de redes profesionales más grande del mundo, que permite a los usuarios desarrollar sus carreras, conectarse con su red y compartir contenido profesional. LinkedIn es ampliamente utilizado por profesionales de diversas industrias para branding personal, reclutamiento, búsqueda de empleo y desarrollo de negocios.

Con LinkedIn, puedes compartir fácilmente publicaciones en tu feed personal para interactuar con tu red y acceder a información sobre tu perfil para destacar tus logros profesionales. La integración automatizada con Sim te permite aprovechar la funcionalidad de LinkedIn de forma programática, permitiendo que agentes y flujos de trabajo publiquen actualizaciones, informen sobre tu presencia profesional y mantengan tu feed activo sin esfuerzo manual.

Las características clave de LinkedIn disponibles a través de esta integración incluyen:

- **Compartir publicaciones:** Publica automáticamente actualizaciones profesionales, artículos o anuncios en tu feed personal de LinkedIn.
- **Información del perfil:** Obtén información detallada sobre tu perfil de LinkedIn para monitorear o usar en tareas posteriores dentro de tus flujos de trabajo.

Estas capacidades facilitan mantener tu red de LinkedIn comprometida y extender tu alcance profesional de manera eficiente como parte de tu estrategia de automatización de IA o flujo de trabajo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra LinkedIn en flujos de trabajo. Comparte publicaciones en tu feed personal y accede a la información de tu perfil de LinkedIn.

## Herramientas

### `linkedin_share_post`

Comparte una publicación en tu feed personal de LinkedIn

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El contenido de texto de tu publicación en LinkedIn |
| `visibility` | string | No | Quién puede ver esta publicación: "PUBLIC" o "CONNECTIONS" \(predeterminado: "PUBLIC"\) |
| `request` | string | No | Sin descripción |
| `output` | string | No | Sin descripción |
| `output` | string | No | Sin descripción |
| `specificContent` | string | No | Sin descripción |
| `shareCommentary` | string | No | Sin descripción |
| `visibility` | string | No | Sin descripción |
| `headers` | string | No | Sin descripción |
| `output` | string | No | Sin descripción |
| `output` | string | No | Sin descripción |
| `output` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `postId` | string | ID de la publicación creada |
| `profile` | json | Información del perfil de LinkedIn |
| `error` | string | Mensaje de error si la operación falló |

### `linkedin_get_profile`

Recuperar la información de tu perfil de LinkedIn

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `postId` | string | ID de la publicación creada |
| `profile` | json | Información del perfil de LinkedIn |
| `error` | string | Mensaje de error si la operación falló |

## Notas

- Categoría: `tools`
- Tipo: `linkedin`
```

--------------------------------------------------------------------------------

---[FILE: linkup.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/linkup.mdx

```text
---
title: Linkup
description: Busca en la web con Linkup
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkup"
  color="#D6D3C7"
/>

{/* MANUAL-CONTENT-START:intro */}
[Linkup](https://linkup.so) es una potente herramienta de búsqueda web que se integra perfectamente con Sim, permitiendo a tus agentes de IA acceder a información actualizada de la web con la atribución adecuada de las fuentes.

Linkup mejora tus agentes de IA proporcionándoles la capacidad de buscar en la web información actual. Cuando se integra en el conjunto de herramientas de tu agente:

- **Acceso a información en tiempo real**: Los agentes pueden recuperar la información más reciente de la web, manteniendo las respuestas actualizadas y relevantes.
- **Atribución de fuentes**: Toda la información viene con las citas adecuadas, garantizando transparencia y credibilidad.
- **Implementación sencilla**: Añade Linkup al conjunto de herramientas de tus agentes con una configuración mínima.
- **Conciencia contextual**: Los agentes pueden utilizar información de la web mientras mantienen su personalidad y estilo conversacional.

Para implementar Linkup en tu agente, simplemente añade la herramienta a la configuración de tu agente. Tu agente podrá entonces buscar en la web siempre que necesite responder preguntas que requieran información actual.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Linkup en el flujo de trabajo. Puede buscar en la web. Requiere clave API.

## Herramientas

### `linkup_search`

Busca información en la web usando Linkup

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `q` | string | Sí | La consulta de búsqueda |
| `depth` | string | Sí | Profundidad de búsqueda \(debe ser "standard" o "deep"\) |
| `outputType` | string | Sí | Tipo de salida a devolver \(debe ser "sourcedAnswer" o "searchResults"\) |
| `apiKey` | string | Sí | Introduce tu clave API de Linkup |
| `includeImages` | boolean | No | Si se deben incluir imágenes en los resultados de búsqueda |
| `fromDate` | string | No | Fecha de inicio para filtrar resultados \(formato AAAA-MM-DD\) |
| `toDate` | string | No | Fecha de fin para filtrar resultados \(formato AAAA-MM-DD\) |
| `excludeDomains` | string | No | Lista separada por comas de nombres de dominio a excluir de los resultados de búsqueda |
| `includeDomains` | string | No | Lista separada por comas de nombres de dominio a los que restringir los resultados de búsqueda |
| `includeInlineCitations` | boolean | No | Añadir citas en línea a las respuestas \(solo se aplica cuando outputType es "sourcedAnswer"\) |
| `includeSources` | boolean | No | Incluir fuentes en la respuesta |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `answer` | string | La respuesta con fuentes a la consulta de búsqueda |
| `sources` | array | Array de fuentes utilizadas para compilar la respuesta, cada una contiene nombre, url y fragmento |

## Notas

- Categoría: `tools`
- Tipo: `linkup`
```

--------------------------------------------------------------------------------

````
