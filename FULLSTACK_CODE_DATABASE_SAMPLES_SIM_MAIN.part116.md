---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 116
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 116 of 933)

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

---[FILE: hubspot.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/hubspot.mdx

```text
---
title: HubSpot
description: Interactúa con HubSpot CRM o activa flujos de trabajo desde eventos de HubSpot
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hubspot"
  color="#FF7A59"
/>

{/* MANUAL-CONTENT-START:intro */}
[HubSpot](https://www.hubspot.com) es una plataforma CRM completa que proporciona un conjunto completo de herramientas de marketing, ventas y servicio al cliente para ayudar a las empresas a crecer mejor. Con sus potentes capacidades de automatización y su extensa API, HubSpot se ha convertido en una de las principales plataformas CRM del mundo, sirviendo a empresas de todos los tamaños en diferentes industrias.

HubSpot CRM ofrece una solución completa para gestionar las relaciones con los clientes, desde el contacto inicial hasta el éxito del cliente a largo plazo. La plataforma combina gestión de contactos, seguimiento de oportunidades, automatización de marketing y herramientas de servicio al cliente en un sistema unificado que ayuda a los equipos a mantenerse alineados y enfocados en el éxito del cliente.

Las características principales de HubSpot CRM incluyen:

- Gestión de contactos y empresas: Base de datos completa para almacenar y organizar información de clientes y prospectos
- Pipeline de oportunidades: Pipeline visual de ventas para seguir oportunidades a través de etapas personalizables
- Eventos de marketing: Seguimiento y gestión de campañas y eventos de marketing con atribución detallada
- Gestión de tickets: Sistema de tickets de soporte al cliente para seguir y resolver problemas de los clientes
- Presupuestos y artículos: Creación y gestión de presupuestos de ventas con artículos detallados
- Gestión de usuarios y equipos: Organización de equipos, asignación de propiedad y seguimiento de la actividad de los usuarios en toda la plataforma

En Sim, la integración con HubSpot permite que tus agentes de IA interactúen sin problemas con los datos de tu CRM y automaticen procesos empresariales clave. Esto crea poderosas oportunidades para la calificación inteligente de leads, el enriquecimiento automatizado de contactos, la gestión de acuerdos, la automatización del soporte al cliente y la sincronización de datos en toda tu infraestructura tecnológica. La integración permite a los agentes crear, recuperar, actualizar y buscar en todos los objetos principales de HubSpot, habilitando flujos de trabajo sofisticados que pueden responder a eventos del CRM, mantener la calidad de los datos y asegurar que tu equipo tenga la información más actualizada de los clientes. Al conectar Sim con HubSpot, puedes crear agentes de IA que califiquen automáticamente los leads, dirijan tickets de soporte, actualicen etapas de acuerdos basados en interacciones con clientes, generen presupuestos y mantengan los datos de tu CRM sincronizados con otros sistemas empresariales, aumentando en última instancia la productividad del equipo y mejorando las experiencias de los clientes.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra HubSpot en tu flujo de trabajo. Gestiona contactos, empresas, acuerdos, tickets y otros objetos CRM con potentes capacidades de automatización. Puede utilizarse en modo disparador para iniciar flujos de trabajo cuando los contactos son creados, eliminados o actualizados.

## Herramientas

### `hubspot_get_users`

Recuperar todos los usuarios de la cuenta de HubSpot

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Número de resultados a devolver \(predeterminado: 100\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `users` | array | Array de objetos de usuario de HubSpot |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_list_contacts`

Recuperar todos los contactos de la cuenta de HubSpot con soporte de paginación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `limit` | string | No | Número máximo de resultados por página \(máximo 100, predeterminado 100\) |
| `after` | string | No | Cursor de paginación para la siguiente página de resultados |
| `properties` | string | No | Lista separada por comas de propiedades a devolver \(p. ej., "email,firstname,lastname"\) |
| `associations` | string | No | Lista separada por comas de tipos de objetos para los que recuperar IDs asociados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contacts` | array | Array de objetos de contacto de HubSpot |
| `paging` | object | Información de paginación |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_get_contact`

Recuperar un solo contacto por ID o email desde HubSpot

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `contactId` | string | Sí | El ID o email del contacto a recuperar |
| `idProperty` | string | No | Propiedad a usar como identificador único \(p. ej., "email"\). Si no se especifica, usa el ID del registro |
| `properties` | string | No | Lista separada por comas de propiedades a devolver |
| `associations` | string | No | Lista separada por comas de tipos de objetos para los que recuperar IDs asociados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contact` | object | Objeto de contacto de HubSpot con propiedades |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_create_contact`

Crear un nuevo contacto en HubSpot. Requiere al menos uno de: email, firstname o lastname

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `properties` | objeto | Sí | Propiedades del contacto como objeto JSON. Debe incluir al menos uno de: email, firstname o lastname |
| `associations` | array | No | Array de asociaciones para crear con el contacto \(p. ej., empresas, acuerdos\). Cada objeto debe tener "to" \(con "id"\) y "types" \(con "associationCategory" y "associationTypeId"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contact` | object | Objeto de contacto de HubSpot creado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_update_contact`

Actualizar un contacto existente en HubSpot por ID o email

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Sí | El ID o email del contacto a actualizar |
| `idProperty` | string | No | Propiedad a usar como identificador único \(p. ej., "email"\). Si no se especifica, usa el ID del registro |
| `properties` | objeto | Sí | Propiedades del contacto a actualizar como objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contact` | object | Objeto de contacto de HubSpot actualizado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_search_contacts`

Buscar contactos en HubSpot usando filtros, ordenación y consultas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `filterGroups` | array | No | Array de grupos de filtros. Cada grupo contiene filtros con propertyName, operator y value |
| `sorts` | array | No | Array de objetos de ordenación con propertyName y direction ("ASCENDING" o "DESCENDING") |
| `query` | string | No | Cadena de consulta de búsqueda |
| `properties` | array | No | Array de nombres de propiedades a devolver |
| `limit` | number | No | Número máximo de resultados a devolver (máx. 100) |
| `after` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `contacts` | array | Array de objetos de contacto de HubSpot coincidentes |
| `total` | number | Número total de contactos coincidentes |
| `paging` | object | Información de paginación |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_list_companies`

Recuperar todas las empresas de la cuenta de HubSpot con soporte de paginación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `limit` | string | No | Número máximo de resultados por página (máx. 100, predeterminado 100) |
| `after` | string | No | Cursor de paginación para la siguiente página de resultados |
| `properties` | string | No | Lista separada por comas de propiedades a devolver |
| `associations` | string | No | Lista separada por comas de tipos de objetos para recuperar IDs asociados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `companies` | array | Array de objetos de empresa de HubSpot |
| `paging` | object | Información de paginación |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_get_company`

Recuperar una sola empresa por ID o dominio desde HubSpot

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Sí | El ID o dominio de la empresa a recuperar |
| `idProperty` | string | No | Propiedad a usar como identificador único \(p. ej., "domain"\). Si no se especifica, usa el ID del registro |
| `properties` | string | No | Lista separada por comas de propiedades a devolver |
| `associations` | string | No | Lista separada por comas de tipos de objetos para recuperar los IDs asociados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `company` | object | Objeto de empresa de HubSpot con propiedades |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_create_company`

Crear una nueva empresa en HubSpot

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `properties` | object | Sí | Propiedades de la empresa como objeto JSON \(p. ej., nombre, dominio, ciudad, industria\) |
| `associations` | array | No | Array de asociaciones a crear con la empresa |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `company` | object | Objeto de empresa de HubSpot creado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_update_company`

Actualizar una empresa existente en HubSpot por ID o dominio

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Sí | El ID o dominio de la empresa a actualizar |
| `idProperty` | string | No | Propiedad a usar como identificador único \(p. ej., "domain"\). Si no se especifica, usa el ID del registro |
| `properties` | object | Sí | Propiedades de la empresa a actualizar como objeto JSON |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `company` | object | Objeto de empresa de HubSpot actualizado |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_search_companies`

Buscar empresas en HubSpot usando filtros, ordenación y consultas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | No | Array de grupos de filtros. Cada grupo contiene filtros con propertyName, operator y value |
| `sorts` | array | No | Array de objetos de ordenación con propertyName y direction ("ASCENDING" o "DESCENDING") |
| `query` | string | No | Cadena de consulta de búsqueda |
| `properties` | array | No | Array de nombres de propiedades a devolver |
| `limit` | number | No | Número máximo de resultados a devolver (máx. 100) |
| `after` | string | No | Cursor de paginación para la siguiente página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `companies` | array | Array de objetos de empresa de HubSpot coincidentes |
| `total` | number | Número total de empresas coincidentes |
| `paging` | object | Información de paginación |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

### `hubspot_list_deals`

Recuperar todos los acuerdos de la cuenta de HubSpot con soporte de paginación

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Número máximo de resultados por página (máx. 100, predeterminado 100) |
| `after` | string | No | Cursor de paginación para la siguiente página de resultados |
| `properties` | string | No | Lista separada por comas de propiedades a devolver |
| `associations` | string | No | Lista separada por comas de tipos de objetos para recuperar IDs asociados |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deals` | array | Array de objetos de negocio de HubSpot |
| `paging` | object | Información de paginación |
| `metadata` | object | Metadatos de la operación |
| `success` | boolean | Estado de éxito de la operación |

## Notas

- Categoría: `tools`
- Tipo: `hubspot`
```

--------------------------------------------------------------------------------

---[FILE: huggingface.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/huggingface.mdx

```text
---
title: Hugging Face
description: Usa la API de Inferencia de Hugging Face
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="huggingface"
  color="#0B0F19"
/>

{/* MANUAL-CONTENT-START:intro */}
[HuggingFace](https://huggingface.co/) es una plataforma líder de IA que proporciona acceso a miles de modelos de aprendizaje automático preentrenados y potentes capacidades de inferencia. Con su extenso centro de modelos y una API robusta, HuggingFace ofrece herramientas completas tanto para investigación como para aplicaciones de IA en producción.
Con HuggingFace, puedes:

Acceder a modelos preentrenados: Utiliza modelos para generación de texto, traducción, procesamiento de imágenes y más
Generar completados de IA: Crea contenido utilizando modelos de lenguaje de última generación a través de la API de Inferencia
Procesamiento de lenguaje natural: Procesa y analiza texto con modelos especializados de PLN
Implementar a escala: Aloja y sirve modelos para aplicaciones en producción
Personalizar modelos: Ajusta modelos existentes para casos de uso específicos

En Sim, la integración con HuggingFace permite a tus agentes generar completados programáticamente utilizando la API de Inferencia de HuggingFace. Esto permite potentes escenarios de automatización como generación de contenido, análisis de texto, completado de código y escritura creativa. Tus agentes pueden generar completados con indicaciones en lenguaje natural, acceder a modelos especializados para diferentes tareas e integrar contenido generado por IA en flujos de trabajo. Esta integración cierra la brecha entre tus flujos de trabajo de IA y las capacidades de aprendizaje automático, permitiendo una automatización fluida impulsada por IA con una de las plataformas de ML más completas del mundo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Hugging Face en el flujo de trabajo. Puede generar completados utilizando la API de Inferencia de Hugging Face. Requiere clave API.

## Herramientas

### `huggingface_chat`

Genera completados utilizando la API de Inferencia de Hugging Face

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | No | Indicación del sistema para guiar el comportamiento del modelo |
| `content` | string | Sí | El contenido del mensaje del usuario para enviar al modelo |
| `provider` | string | Sí | El proveedor a utilizar para la solicitud de API \(p. ej., novita, cerebras, etc.\) |
| `model` | string | Sí | Modelo a utilizar para completados de chat \(p. ej., deepseek/deepseek-v3-0324\) |
| `maxTokens` | number | No | Número máximo de tokens a generar |
| `temperature` | number | No | Temperatura de muestreo \(0-2\). Valores más altos hacen que la salida sea más aleatoria |
| `apiKey` | string | Sí | Token de API de Hugging Face |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Resultados del completado del chat |

## Notas

- Categoría: `tools`
- Tipo: `huggingface`
```

--------------------------------------------------------------------------------

---[FILE: hunter.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/hunter.mdx

```text
---
title: Hunter io
description: Encuentra y verifica direcciones de correo electrónico profesionales
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hunter"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Hunter.io](https://hunter.io/) es una plataforma líder para encontrar y verificar direcciones de correo electrónico profesionales, descubrir empresas y enriquecer datos de contacto. Hunter.io proporciona APIs robustas para búsqueda de dominios, búsqueda de correos electrónicos, verificación y descubrimiento de empresas, convirtiéndola en una herramienta esencial para ventas, reclutamiento y desarrollo de negocios.

Con Hunter.io, puedes:

- **Encontrar direcciones de correo electrónico por dominio:** Busca todas las direcciones de correo electrónico disponibles públicamente asociadas con un dominio de empresa específico.
- **Descubrir empresas:** Utiliza filtros avanzados y búsqueda potenciada por IA para encontrar empresas que coincidan con tus criterios.
- **Encontrar una dirección de correo electrónico específica:** Localiza la dirección de correo electrónico más probable para una persona en una empresa utilizando su nombre y dominio.
- **Verificar direcciones de correo electrónico:** Comprueba la entregabilidad y validez de cualquier dirección de correo electrónico.
- **Enriquecer datos de empresa:** Obtén información detallada sobre empresas, incluyendo tamaño, tecnologías utilizadas y más.

En Sim, la integración con Hunter.io permite a tus agentes buscar y verificar direcciones de correo electrónico de forma programática, descubrir empresas y enriquecer datos de contacto utilizando la API de Hunter.io. Esto te permite automatizar la generación de leads, el enriquecimiento de contactos y la verificación de correos electrónicos directamente dentro de tus flujos de trabajo. Tus agentes pueden aprovechar las herramientas de Hunter.io para agilizar el alcance, mantener tu CRM actualizado y potenciar escenarios de automatización inteligente para ventas, reclutamiento y más.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Hunter en el flujo de trabajo. Puede buscar dominios, encontrar direcciones de correo electrónico, verificar direcciones de correo electrónico, descubrir empresas, encontrar empresas y contar direcciones de correo electrónico. Requiere clave API.

## Herramientas

### `hunter_discover`

Devuelve empresas que coinciden con un conjunto de criterios utilizando la búsqueda potenciada por IA de Hunter.io.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `query` | string | No | Consulta de búsqueda en lenguaje natural para empresas |
| `domain` | string | No | Nombres de dominio de empresas para filtrar |
| `headcount` | string | No | Filtro de tamaño de empresa \(p. ej., "1-10", "11-50"\) |
| `company_type` | string | No | Tipo de organización |
| `technology` | string | No | Tecnología utilizada por las empresas |
| `apiKey` | string | Sí | Clave API de Hunter.io |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `results` | array | Array de empresas que coinciden con los criterios de búsqueda, cada una contiene dominio, nombre, recuento de personal, tecnologías y email_count |

### `hunter_domain_search`

Devuelve todas las direcciones de correo electrónico encontradas utilizando un nombre de dominio dado, con fuentes.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `domain` | string | Sí | Nombre de dominio para buscar direcciones de correo electrónico |
| `limit` | number | No | Máximo de direcciones de correo electrónico a devolver \(predeterminado: 10\) |
| `offset` | number | No | Número de direcciones de correo electrónico a omitir |
| `type` | string | No | Filtro para correos personales o genéricos |
| `seniority` | string | No | Filtrar por nivel de antigüedad: junior, senior o ejecutivo |
| `department` | string | No | Filtrar por departamentos específicos \(p. ej., ventas, marketing\) |
| `apiKey` | string | Sí | Clave API de Hunter.io |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `domain` | string | El nombre de dominio buscado |
| `disposable` | boolean | Si el dominio acepta direcciones de correo desechables |
| `webmail` | boolean | Si el dominio es un proveedor de webmail |
| `accept_all` | boolean | Si el dominio acepta todas las direcciones de correo |
| `pattern` | string | El patrón de correo electrónico utilizado por la organización |
| `organization` | string | El nombre de la organización |
| `description` | string | Descripción de la organización |
| `industry` | string | Sector de la organización |
| `twitter` | string | Perfil de Twitter de la organización |
| `facebook` | string | Perfil de Facebook de la organización |
| `linkedin` | string | Perfil de LinkedIn de la organización |
| `instagram` | string | Perfil de Instagram de la organización |
| `youtube` | string | Canal de YouTube de la organización |
| `technologies` | array | Array de tecnologías utilizadas por la organización |
| `country` | string | País donde se encuentra la organización |
| `state` | string | Estado donde se encuentra la organización |
| `city` | string | Ciudad donde se encuentra la organización |
| `postal_code` | string | Código postal de la organización |
| `street` | string | Dirección de la organización |
| `emails` | array | Array de direcciones de correo encontradas para el dominio, cada una contiene valor, tipo, confianza, fuentes y detalles de la persona |

### `hunter_email_finder`

Encuentra la dirección de correo electrónico más probable para una persona dado su nombre y el dominio de la empresa.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Nombre del dominio de la empresa |
| `first_name` | string | Yes | Nombre de la persona |
| `last_name` | string | Yes | Apellido de la persona |
| `company` | string | No | Nombre de la empresa |
| `apiKey` | string | Yes | Clave API de Hunter.io |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `email` | string | La dirección de correo electrónico encontrada |
| `score` | number | Puntuación de confianza para la dirección de correo electrónico encontrada |
| `sources` | array | Array de fuentes donde se encontró el correo electrónico, cada una contiene domain, uri, extracted_on, last_seen_on y still_on_page |
| `verification` | object | Información de verificación que contiene fecha y estado |

### `hunter_email_verifier`

Verifica la entregabilidad de una dirección de correo electrónico y proporciona un estado de verificación detallado.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | La dirección de correo electrónico a verificar |
| `apiKey` | string | Yes | Clave API de Hunter.io |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `result` | string | Resultado de entregabilidad: deliverable, undeliverable o risky |
| `score` | number | Puntuación de confianza para el resultado de verificación |
| `email` | string | La dirección de correo electrónico verificada |
| `regexp` | boolean | Si el correo electrónico sigue un patrón regex válido |
| `gibberish` | boolean | Si el correo electrónico parece ser incoherente |
| `disposable` | boolean | Si el correo electrónico es de un proveedor de correo desechable |
| `webmail` | boolean | Si el correo electrónico es de un proveedor de webmail |
| `mx_records` | boolean | Si existen registros MX para el dominio |
| `smtp_server` | boolean | Si el servidor SMTP es accesible |
| `smtp_check` | boolean | Si la comprobación SMTP fue exitosa |
| `accept_all` | boolean | Si el dominio acepta todas las direcciones de correo electrónico |
| `block` | boolean | Si el correo electrónico está bloqueado |
| `status` | string | Estado de verificación: valid, invalid, accept_all, webmail, disposable o unknown |
| `sources` | array | Array de fuentes donde se encontró el correo electrónico |

### `hunter_companies_find`

Enriquece los datos de la empresa utilizando el nombre de dominio.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Sí | Dominio para encontrar datos de la empresa |
| `apiKey` | string | Sí | Clave API de Hunter.io |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `person` | object | Información de la persona \(indefinido para la herramienta companies_find\) |
| `company` | object | Información de la empresa incluyendo nombre, dominio, industria, tamaño, país, linkedin y twitter |

### `hunter_email_count`

Devuelve el número total de direcciones de correo electrónico encontradas para un dominio o empresa.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `domain` | string | No | Dominio para contar correos electrónicos \(obligatorio si no se proporciona la empresa\) |
| `company` | string | No | Nombre de la empresa para contar correos electrónicos \(obligatorio si no se proporciona el dominio\) |
| `type` | string | No | Filtro para correos personales o genéricos solamente |
| `apiKey` | string | Sí | Clave API de Hunter.io |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `total` | number | Número total de direcciones de correo electrónico encontradas |
| `personal_emails` | number | Número de direcciones de correo electrónico personales encontradas |
| `generic_emails` | number | Número de direcciones de correo electrónico genéricas encontradas |
| `department` | object | Desglose de direcciones de correo electrónico por departamento \(ejecutivo, ti, finanzas, gestión, ventas, legal, soporte, rrhh, marketing, comunicación\) |
| `seniority` | object | Desglose de direcciones de correo electrónico por nivel de antigüedad \(junior, senior, ejecutivo\) |

## Notas

- Categoría: `tools`
- Tipo: `hunter`
```

--------------------------------------------------------------------------------

---[FILE: image_generator.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/image_generator.mdx

```text
---
title: Generador de imágenes
description: Generar imágenes
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="image_generator"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DALL-E](https://openai.com/dall-e-3) es el sistema avanzado de IA de OpenAI diseñado para generar imágenes y arte realistas a partir de descripciones en lenguaje natural. Como modelo de generación de imágenes de última generación, DALL-E puede crear visuales detallados y creativos basados en indicaciones textuales, permitiendo a los usuarios transformar sus ideas en contenido visual sin necesidad de habilidades artísticas.

Con DALL-E, puedes:

- **Generar imágenes realistas**: Crear visuales fotorrealistas a partir de descripciones textuales
- **Diseñar arte conceptual**: Transformar ideas abstractas en representaciones visuales
- **Producir variaciones**: Generar múltiples interpretaciones de la misma indicación
- **Controlar el estilo artístico**: Especificar estilos artísticos, medios y estéticas visuales
- **Crear escenas detalladas**: Describir escenas complejas con múltiples elementos y relaciones
- **Visualizar productos**: Generar maquetas de productos y conceptos de diseño
- **Ilustrar ideas**: Convertir conceptos escritos en ilustraciones visuales

En Sim, la integración con DALL-E permite a tus agentes generar imágenes de forma programática como parte de sus flujos de trabajo. Esto permite potentes escenarios de automatización como creación de contenido, diseño visual e ideación creativa. Tus agentes pueden formular instrucciones detalladas, generar imágenes correspondientes e incorporar estos elementos visuales en sus resultados o procesos posteriores. Esta integración cierra la brecha entre el procesamiento del lenguaje natural y la creación de contenido visual, permitiendo que tus agentes se comuniquen no solo a través de texto sino también mediante imágenes convincentes. Al conectar Sim con DALL-E, puedes crear agentes que produzcan contenido visual bajo demanda, ilustren conceptos, generen recursos de diseño y mejoren las experiencias de usuario con elementos visuales enriquecidos - todo sin requerir intervención humana en el proceso creativo.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra el Generador de Imágenes en el flujo de trabajo. Puede generar imágenes usando DALL-E 3 o GPT Image. Requiere Clave API.

## Herramientas

### `openai_image`

Generar imágenes usando OpenAI

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `model` | string | Sí | El modelo a utilizar \(gpt-image-1 o dall-e-3\) |
| `prompt` | string | Sí | Una descripción textual de la imagen deseada |
| `size` | string | Sí | El tamaño de las imágenes generadas \(1024x1024, 1024x1792, o 1792x1024\) |
| `quality` | string | No | La calidad de la imagen \(standard o hd\) |
| `style` | string | No | El estilo de la imagen \(vivid o natural\) |
| `background` | string | No | El color de fondo, solo para gpt-image-1 |
| `n` | number | No | El número de imágenes a generar \(1-10\) |
| `apiKey` | string | Sí | Tu clave API de OpenAI |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito de la operación |
| `output` | object | Datos de la imagen generada |

## Notas

- Categoría: `tools`
- Tipo: `image_generator`
```

--------------------------------------------------------------------------------

````
