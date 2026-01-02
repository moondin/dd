---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 118
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 118 of 933)

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

---[FILE: intercom.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/intercom.mdx

```text
---
title: Intercom
description: Gestiona contactos, empresas, conversaciones, tickets y mensajes en Intercom
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="intercom"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Intercom](https://www.intercom.com/) es una plataforma líder de comunicación con clientes que te permite gestionar y automatizar tus interacciones con contactos, empresas, conversaciones, tickets y mensajes, todo en un solo lugar. La integración de Intercom en Sim permite a tus agentes gestionar programáticamente las relaciones con los clientes, las solicitudes de soporte y las conversaciones directamente desde tus flujos de trabajo automatizados.

Con las herramientas de Intercom, puedes:

- **Gestión de contactos:** Crear, obtener, actualizar, listar, buscar y eliminar contactos—automatiza tus procesos de CRM y mantén actualizados los registros de tus clientes.
- **Gestión de empresas:** Crear nuevas empresas, recuperar detalles de empresas y listar todas las empresas relacionadas con tus usuarios o clientes comerciales.
- **Manejo de conversaciones:** Obtener, listar, responder y buscar conversaciones—permitiendo a los agentes seguir hilos de soporte en curso, proporcionar respuestas y automatizar acciones de seguimiento.
- **Gestión de tickets:** Crear y recuperar tickets programáticamente, ayudándote a automatizar el servicio al cliente, el seguimiento de problemas de soporte y las escalaciones de flujo de trabajo.
- **Enviar mensajes:** Activar mensajes a usuarios o leads para incorporación, soporte o marketing, todo desde dentro de tu automatización de flujo de trabajo.

Al integrar las herramientas de Intercom en Sim, potencias tus flujos de trabajo para comunicarte directamente con tus usuarios, automatizar procesos de atención al cliente, gestionar leads y agilizar las comunicaciones a escala. Ya sea que necesites crear nuevos contactos, mantener sincronizados los datos de los clientes, gestionar tickets de soporte o enviar mensajes de engagement personalizados, las herramientas de Intercom proporcionan una forma integral de gestionar las interacciones con los clientes como parte de tus automatizaciones inteligentes.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Intercom en el flujo de trabajo. Puede crear, obtener, actualizar, listar, buscar y eliminar contactos; crear, obtener y listar empresas; obtener, listar, responder y buscar conversaciones; crear y obtener tickets; y crear mensajes.

## Herramientas

### `intercom_create_contact`

Crear un nuevo contacto en Intercom con email, external_id o rol

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `email` | string | No | La dirección de correo electrónico del contacto |
| `external_id` | string | No | Un identificador único para el contacto proporcionado por el cliente |
| `phone` | string | No | El número de teléfono del contacto |
| `name` | string | No | El nombre del contacto |
| `avatar` | string | No | Una URL de imagen de avatar para el contacto |
| `signed_up_at` | number | No | El momento en que el usuario se registró como marca de tiempo Unix |
| `last_seen_at` | number | No | El momento en que el usuario fue visto por última vez como marca de tiempo Unix |
| `owner_id` | string | No | El id de un administrador que ha sido asignado como propietario de la cuenta del contacto |
| `unsubscribed_from_emails` | boolean | No | Si el contacto está dado de baja de los correos electrónicos |
| `custom_attributes` | string | No | Atributos personalizados como objeto JSON \(p. ej., \{"nombre_atributo": "valor"\}\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del contacto creado |

### `intercom_get_contact`

Obtener un solo contacto por ID desde Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Sí | ID del contacto a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del contacto |

### `intercom_update_contact`

Actualizar un contacto existente en Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Sí | ID del contacto a actualizar |
| `email` | string | No | Dirección de correo electrónico del contacto |
| `phone` | string | No | Número de teléfono del contacto |
| `name` | string | No | Nombre del contacto |
| `avatar` | string | No | URL de imagen de avatar para el contacto |
| `signed_up_at` | number | No | El momento en que el usuario se registró como marca de tiempo Unix |
| `last_seen_at` | number | No | El momento en que el usuario fue visto por última vez como marca de tiempo Unix |
| `owner_id` | string | No | El id de un administrador que ha sido asignado como propietario de la cuenta del contacto |
| `unsubscribed_from_emails` | boolean | No | Si el contacto está dado de baja de los correos electrónicos |
| `custom_attributes` | string | No | Atributos personalizados como objeto JSON (p. ej., \{"nombre_atributo": "valor"\}) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del contacto actualizado |

### `intercom_list_contacts`

Listar todos los contactos de Intercom con soporte de paginación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | No | Número de resultados por página \(máx: 150\) |
| `starting_after` | string | No | Cursor para paginación - ID para comenzar después |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Lista de contactos |

### `intercom_search_contacts`

Buscar contactos en Intercom usando una consulta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda \(p. ej., \{"field":"email","operator":"=","value":"user@example.com"\}\) |
| `per_page` | number | No | Número de resultados por página \(máx: 150\) |
| `starting_after` | string | No | Cursor para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Resultados de la búsqueda |

### `intercom_delete_contact`

Eliminar un contacto de Intercom por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Sí | ID del contacto a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Resultado de la eliminación |

### `intercom_create_company`

Crear o actualizar una empresa en Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `company_id` | string | Sí | Tu identificador único para la empresa |
| `name` | string | No | El nombre de la empresa |
| `website` | string | No | El sitio web de la empresa |
| `plan` | string | No | El nombre del plan de la empresa |
| `size` | number | No | El número de empleados en la empresa |
| `industry` | string | No | El sector en el que opera la empresa |
| `monthly_spend` | number | No | Cuántos ingresos genera la empresa para tu negocio. Nota: Este campo trunca los decimales a números enteros \(por ejemplo, 155.98 se convierte en 155\) |
| `custom_attributes` | string | No | Atributos personalizados como objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de la empresa creada o actualizada |

### `intercom_get_company`

Recuperar una única empresa por ID desde Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Sí | ID de la empresa a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de la empresa |

### `intercom_list_companies`

Lista todas las empresas de Intercom con soporte de paginación. Nota: Este endpoint tiene un límite de 10,000 empresas que pueden ser devueltas usando paginación. Para conjuntos de datos mayores a 10,000 empresas, usa la API Scroll en su lugar.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | No | Número de resultados por página |
| `page` | number | No | Número de página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Lista de empresas |

### `intercom_get_conversation`

Recuperar una sola conversación por ID desde Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Sí | ID de la conversación a recuperar |
| `display_as` | string | No | Establecer como "plaintext" para recuperar mensajes en texto plano |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de la conversación |

### `intercom_list_conversations`

Listar todas las conversaciones de Intercom con soporte de paginación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | No | Número de resultados por página \(máx: 150\) |
| `starting_after` | string | No | Cursor para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Lista de conversaciones |

### `intercom_reply_conversation`

Responder a una conversación como administrador en Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Sí | ID de la conversación a la que responder |
| `message_type` | string | Sí | Tipo de mensaje: "comment" o "note" |
| `body` | string | Sí | El texto del cuerpo de la respuesta |
| `admin_id` | string | No | El ID del administrador que escribe la respuesta. Si no se proporciona, se utilizará un administrador predeterminado \(Operator/Fin\). |
| `attachment_urls` | string | No | Lista separada por comas de URLs de imágenes \(máximo 10\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Conversación actualizada con respuesta |

### `intercom_search_conversations`

Buscar conversaciones en Intercom usando una consulta

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `query` | string | Sí | Consulta de búsqueda como objeto JSON |
| `per_page` | number | No | Número de resultados por página (máx: 150) |
| `starting_after` | string | No | Cursor para paginación |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Resultados de la búsqueda |

### `intercom_create_ticket`

Crear un nuevo ticket en Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `ticket_type_id` | string | Sí | El ID del tipo de ticket |
| `contacts` | string | Sí | Array JSON de identificadores de contacto (p. ej., \{"id": "contact_id"\}) |
| `ticket_attributes` | string | Sí | Objeto JSON con atributos del ticket incluyendo _default_title_ y _default_description_ |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del ticket creado |

### `intercom_get_ticket`

Recuperar un solo ticket por ID desde Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `ticketId` | string | Sí | ID del ticket a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del ticket |

### `intercom_create_message`

Crear y enviar un nuevo mensaje iniciado por el administrador en Intercom

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `message_type` | string | Sí | Tipo de mensaje: "inapp" o "email" |
| `subject` | string | No | El asunto del mensaje \(para tipo email\) |
| `body` | string | Sí | El cuerpo del mensaje |
| `from_type` | string | Sí | Tipo de remitente: "admin" |
| `from_id` | string | Sí | El ID del administrador que envía el mensaje |
| `to_type` | string | Sí | Tipo de destinatario: "contact" |
| `to_id` | string | Sí | El ID del contacto que recibe el mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos del mensaje creado |

## Notas

- Categoría: `tools`
- Tipo: `intercom`
```

--------------------------------------------------------------------------------

---[FILE: jina.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/jina.mdx

```text
---
title: Jina
description: Busca en la web o extrae contenido de URLs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jina"
  color="#333333"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jina AI](https://jina.ai/) es una potente herramienta de extracción de contenido que se integra perfectamente con Sim para transformar el contenido web en texto limpio y legible. Esta integración permite a los desarrolladores incorporar fácilmente capacidades de procesamiento de contenido web en sus flujos de trabajo basados en agentes.

Jina AI Reader se especializa en extraer el contenido más relevante de las páginas web, eliminando el desorden, la publicidad y los problemas de formato para producir texto limpio y estructurado que está optimizado para modelos de lenguaje y otras tareas de procesamiento de texto.

Con la integración de Jina AI en Sim, puedes:

- **Extraer contenido limpio** de cualquier página web simplemente proporcionando una URL
- **Procesar diseños web complejos** en texto estructurado y legible
- **Mantener el contexto importante** mientras eliminas elementos innecesarios
- **Preparar contenido web** para su posterior procesamiento en tus flujos de trabajo con agentes
- **Agilizar tareas de investigación** convirtiendo rápidamente la información web en datos utilizables

Esta integración es particularmente valiosa para crear agentes que necesitan recopilar y procesar información de la web, realizar investigaciones o analizar contenido en línea como parte de su flujo de trabajo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Jina AI en el flujo de trabajo. Busca en la web y obtén resultados compatibles con LLM, o extrae contenido limpio de URLs específicas con opciones de análisis avanzadas.

## Herramientas

### `jina_read_url`

Extrae y procesa contenido web en texto limpio y compatible con LLM usando Jina AI Reader. Admite análisis avanzado de contenido, recopilación de enlaces y múltiples formatos de salida con opciones de procesamiento configurables.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | La URL para leer y convertir a markdown |
| `useReaderLMv2` | boolean | No | Si se debe usar ReaderLM-v2 para mejor calidad \(3x costo de tokens\) |
| `gatherLinks` | boolean | No | Si se deben recopilar todos los enlaces al final |
| `jsonResponse` | boolean | No | Si se debe devolver la respuesta en formato JSON |
| `apiKey` | string | Sí | Tu clave API de Jina AI |
| `withImagesummary` | boolean | No | Recopilar todas las imágenes de la página con metadatos |
| `retainImages` | string | No | Control de inclusión de imágenes: "none" elimina todas, "all" mantiene todas |
| `returnFormat` | string | No | Formato de salida: markdown, html, text, screenshot o pageshot |
| `withIframe` | boolean | No | Incluir contenido de iframe en la extracción |
| `withShadowDom` | boolean | No | Extraer contenido de Shadow DOM |
| `noCache` | boolean | No | Omitir contenido en caché para recuperación en tiempo real |
| `withGeneratedAlt` | boolean | No | Generar texto alternativo para imágenes usando VLM |
| `robotsTxt` | string | No | User-Agent del bot para verificación de robots.txt |
| `dnt` | boolean | No | Do Not Track - evita almacenamiento en caché/seguimiento |
| `noGfm` | boolean | No | Deshabilitar GitHub Flavored Markdown |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | El contenido extraído de la URL, procesado en texto limpio y compatible con LLM |
| `links` | array | Lista de enlaces encontrados en la página (cuando gatherLinks o withLinksummary está activado) |
| `images` | array | Lista de imágenes encontradas en la página (cuando withImagesummary está activado) |

### `jina_search`

Busca en la web y devuelve los 5 mejores resultados con contenido compatible con LLM. Cada resultado se procesa automáticamente a través de la API de Jina Reader. Admite filtrado geográfico, restricciones de sitios y paginación.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `q` | string | Sí | Cadena de consulta de búsqueda |
| `apiKey` | string | Sí | Tu clave API de Jina AI |
| `num` | number | No | Número máximo de resultados por página \(predeterminado: 5\) |
| `site` | string | No | Restringir resultados a dominio\(s\) específicos. Puede ser separado por comas para múltiples sitios \(ej., "jina.ai,github.com"\) |
| `withFavicon` | boolean | No | Incluir favicons de sitios web en los resultados |
| `withImagesummary` | boolean | No | Recopilar todas las imágenes de las páginas de resultados con metadatos |
| `withLinksummary` | boolean | No | Recopilar todos los enlaces de las páginas de resultados |
| `retainImages` | string | No | Control de inclusión de imágenes: "none" elimina todas, "all" mantiene todas |
| `noCache` | boolean | No | Omitir contenido en caché para recuperación en tiempo real |
| `withGeneratedAlt` | boolean | No | Generar texto alternativo para imágenes usando VLM |
| `respondWith` | string | No | Establecer como "no-content" para obtener solo metadatos sin contenido de página |
| `returnFormat` | string | No | Formato de salida: markdown, html, text, screenshot o pageshot |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Array de resultados de búsqueda, cada uno contiene título, descripción, url y contenido compatible con LLM |

## Notas

- Categoría: `tools`
- Tipo: `jina`
```

--------------------------------------------------------------------------------

````
