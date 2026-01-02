---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 138
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 138 of 933)

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

---[FILE: stt.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/stt.mdx

```text
---
title: Voz a texto
description: Convierte voz a texto usando IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stt"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Transcribe voz a texto utilizando los modelos de IA más avanzados de proveedores de clase mundial. Las herramientas de reconocimiento de voz (STT) de Sim te permiten convertir audio y video en transcripciones precisas, con marcas de tiempo y opcionalmente traducidas, compatibles con una diversidad de idiomas y mejoradas con características avanzadas como la diarización e identificación de hablantes.

**Proveedores y modelos compatibles:**

- **[OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text/overview)** (OpenAI):  
  Whisper de OpenAI es un modelo de aprendizaje profundo de código abierto reconocido por su robustez en diferentes idiomas y condiciones de audio. Admite modelos avanzados como `whisper-1`, destacándose en transcripción, traducción y tareas que exigen alta generalización del modelo. Respaldado por OpenAI—la empresa conocida por ChatGPT e investigación líder en IA—Whisper es ampliamente utilizado en investigación y como referencia para evaluación comparativa.

- **[Deepgram](https://deepgram.com/)** (Deepgram Inc.):  
  Con sede en San Francisco, Deepgram ofrece APIs de reconocimiento de voz escalables y de nivel de producción para desarrolladores y empresas. Los modelos de Deepgram incluyen `nova-3`, `nova-2` y `whisper-large`, ofreciendo transcripción en tiempo real y por lotes con precisión líder en la industria, soporte multilingüe, puntuación automática, diarización inteligente, análisis de llamadas y características para casos de uso que van desde telefonía hasta producción de medios.

- **[ElevenLabs](https://elevenlabs.io/)** (ElevenLabs):  
  Líder en IA de voz, ElevenLabs es especialmente conocido por su síntesis y reconocimiento de voz premium. Su producto STT ofrece alta precisión y comprensión natural de numerosos idiomas, dialectos y acentos. Los modelos recientes de STT de ElevenLabs están optimizados para claridad, distinción de hablantes y son adecuados tanto para escenarios creativos como de accesibilidad. ElevenLabs es reconocido por sus avances de vanguardia en tecnologías de voz impulsadas por IA.

- **[AssemblyAI](https://www.assemblyai.com/)** (AssemblyAI Inc.):  
  AssemblyAI proporciona reconocimiento de voz altamente preciso basado en API, con características como capítulos automáticos, detección de temas, resúmenes, análisis de sentimientos y moderación de contenido junto con la transcripción. Su modelo propietario, incluyendo el aclamado `Conformer-2`, impulsa algunas de las aplicaciones más grandes de medios, centros de llamadas y cumplimiento normativo en la industria. AssemblyAI cuenta con la confianza de empresas Fortune 500 y startups líderes en IA a nivel mundial.

- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** (Google Cloud):  
  La API Speech-to-Text de nivel empresarial de Google admite más de 125 idiomas y variantes, ofreciendo alta precisión y características como transmisión en tiempo real, confianza a nivel de palabra, diarización de hablantes, puntuación automática, vocabulario personalizado y ajuste específico por dominio. Modelos como `latest_long`, `video`, y modelos optimizados por dominio están disponibles, impulsados por años de investigación de Google y desplegados para escalabilidad global.

- **[AWS Transcribe](https://aws.amazon.com/transcribe/)** (Amazon Web Services):  
  AWS Transcribe aprovecha la infraestructura en la nube de Amazon para ofrecer un robusto reconocimiento de voz como API. Admite múltiples idiomas y características como identificación de hablantes, vocabulario personalizado, identificación de canales (para audio de centros de llamadas) y transcripción específica para medicina. Los modelos populares incluyen `standard` y variaciones específicas por dominio. AWS Transcribe es ideal para organizaciones que ya utilizan la nube de Amazon.

**Cómo elegir:**  
Selecciona el proveedor y modelo que se adapte a tu aplicación—ya sea que necesites transcripción rápida y lista para empresas con análisis adicionales (Deepgram, AssemblyAI, Google, AWS), alta versatilidad y acceso de código abierto (OpenAI Whisper), o comprensión avanzada de hablantes/contextual (ElevenLabs). Considera el precio, la cobertura de idiomas, la precisión y cualquier característica especial (como resúmenes, capítulos o análisis de sentimiento) que puedas necesitar.

Para más detalles sobre capacidades, precios, características destacadas y opciones de ajuste fino, consulta la documentación oficial de cada proveedor a través de los enlaces anteriores.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Transcribe archivos de audio y video a texto utilizando proveedores líderes de IA. Compatible con múltiples idiomas, marcas de tiempo y diarización de hablantes.

## Herramientas

### `stt_whisper`

Transcribe audio a texto usando OpenAI Whisper

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor STT \(whisper\) |
| `apiKey` | string | Sí | Clave API de OpenAI |
| `model` | string | No | Modelo de Whisper a utilizar \(predeterminado: whisper-1\) |
| `audioFile` | file | No | Archivo de audio o video para transcribir |
| `audioFileReference` | file | No | Referencia al archivo de audio/video de bloques anteriores |
| `audioUrl` | string | No | URL al archivo de audio o video |
| `language` | string | No | Código de idioma \(p.ej., "en", "es", "fr"\) o "auto" para detección automática |
| `timestamps` | string | No | Granularidad de marca de tiempo: none, sentence, o word |
| `translateToEnglish` | boolean | No | Traducir audio a inglés |
| `prompt` | string | No | Texto opcional para guiar el estilo del modelo o continuar un segmento de audio anterior. Ayuda con nombres propios y contexto. |
| `temperature` | number | No | Temperatura de muestreo entre 0 y 1. Valores más altos hacen que la salida sea más aleatoria, valores más bajos más enfocada y determinista. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `transcript` | string | Texto transcrito completo |
| `segments` | array | Segmentos con marcas de tiempo |
| `language` | string | Idioma detectado o especificado |
| `duration` | number | Duración del audio en segundos |

### `stt_deepgram`

Transcribir audio a texto usando Deepgram

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor STT \(deepgram\) |
| `apiKey` | string | Sí | Clave API de Deepgram |
| `model` | string | No | Modelo de Deepgram a utilizar \(nova-3, nova-2, whisper-large, etc.\) |
| `audioFile` | file | No | Archivo de audio o video para transcribir |
| `audioFileReference` | file | No | Referencia al archivo de audio/video de bloques anteriores |
| `audioUrl` | string | No | URL al archivo de audio o video |
| `language` | string | No | Código de idioma \(p.ej., "en", "es", "fr"\) o "auto" para detección automática |
| `timestamps` | string | No | Granularidad de marcas de tiempo: none, sentence, o word |
| `diarization` | boolean | No | Habilitar diarización de hablantes |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `transcript` | string | Texto transcrito completo |
| `segments` | array | Segmentos con marcas de tiempo y etiquetas de hablantes |
| `language` | string | Idioma detectado o especificado |
| `duration` | number | Duración del audio en segundos |
| `confidence` | number | Puntuación de confianza general |

### `stt_elevenlabs`

Transcribir audio a texto usando ElevenLabs

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor STT \(elevenlabs\) |
| `apiKey` | string | Sí | Clave API de ElevenLabs |
| `model` | string | No | Modelo de ElevenLabs a utilizar \(scribe_v1, scribe_v1_experimental\) |
| `audioFile` | file | No | Archivo de audio o video para transcribir |
| `audioFileReference` | file | No | Referencia al archivo de audio/video de bloques anteriores |
| `audioUrl` | string | No | URL al archivo de audio o video |
| `language` | string | No | Código de idioma \(p.ej., "en", "es", "fr"\) o "auto" para detección automática |
| `timestamps` | string | No | Granularidad de marcas de tiempo: none, sentence, o word |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `transcript` | string | Texto transcrito completo |
| `segments` | array | Segmentos con marcas de tiempo |
| `language` | string | Idioma detectado o especificado |
| `duration` | number | Duración del audio en segundos |
| `confidence` | number | Puntuación de confianza general |

### `stt_assemblyai`

Transcribir audio a texto usando AssemblyAI con funciones avanzadas de PLN

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor STT \(assemblyai\) |
| `apiKey` | string | Sí | Clave API de AssemblyAI |
| `model` | string | No | Modelo de AssemblyAI a utilizar \(predeterminado: best\) |
| `audioFile` | file | No | Archivo de audio o video para transcribir |
| `audioFileReference` | file | No | Referencia al archivo de audio/video de bloques anteriores |
| `audioUrl` | string | No | URL al archivo de audio o video |
| `language` | string | No | Código de idioma \(p.ej., "en", "es", "fr"\) o "auto" para detección automática |
| `timestamps` | string | No | Granularidad de marcas de tiempo: none, sentence, o word |
| `diarization` | boolean | No | Habilitar diarización de hablantes |
| `sentiment` | boolean | No | Habilitar análisis de sentimiento |
| `entityDetection` | boolean | No | Habilitar detección de entidades |
| `piiRedaction` | boolean | No | Habilitar redacción de IIP |
| `summarization` | boolean | No | Habilitar resumen automático |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `transcript` | string | Texto transcrito completo |
| `segments` | array | Segmentos con marcas de tiempo y etiquetas de hablantes |
| `language` | string | Idioma detectado o especificado |
| `duration` | number | Duración del audio en segundos |
| `confidence` | number | Puntuación de confianza general |
| `sentiment` | array | Resultados del análisis de sentimiento |
| `entities` | array | Entidades detectadas |
| `summary` | string | Resumen generado automáticamente |

### `stt_gemini`

Transcribe audio a texto usando Google Gemini con capacidades multimodales

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Sí | Proveedor STT \(gemini\) |
| `apiKey` | string | Sí | Clave API de Google |
| `model` | string | No | Modelo de Gemini a utilizar \(predeterminado: gemini-2.5-flash\) |
| `audioFile` | file | No | Archivo de audio o video para transcribir |
| `audioFileReference` | file | No | Referencia al archivo de audio/video de bloques anteriores |
| `audioUrl` | string | No | URL al archivo de audio o video |
| `language` | string | No | Código de idioma \(p.ej., "en", "es", "fr"\) o "auto" para detección automática |
| `timestamps` | string | No | Granularidad de marcas de tiempo: none, sentence, o word |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `transcript` | string | Texto transcrito completo |
| `segments` | array | Segmentos con marcas de tiempo |
| `language` | string | Idioma detectado o especificado |
| `duration` | number | Duración del audio en segundos |
| `confidence` | number | Puntuación de confianza general |

## Notas

- Categoría: `tools`
- Tipo: `stt`
```

--------------------------------------------------------------------------------

---[FILE: supabase.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/supabase.mdx

```text
---
title: Supabase
description: Usa la base de datos Supabase
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="supabase"
  color="#1C1C1C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Supabase](https://www.supabase.com/) es una potente plataforma backend-as-a-service de código abierto que proporciona a los desarrolladores un conjunto de herramientas para construir, escalar y gestionar aplicaciones modernas. Supabase ofrece una base de datos [PostgreSQL](https://www.postgresql.org/) completamente gestionada, autenticación robusta, APIs RESTful y GraphQL instantáneas, suscripciones en tiempo real, almacenamiento de archivos y funciones edge, todo accesible a través de una interfaz unificada y amigable para desarrolladores. Su naturaleza de código abierto y compatibilidad con frameworks populares la convierten en una alternativa convincente a Firebase, con el beneficio adicional de la flexibilidad y transparencia de SQL.

**¿Por qué Supabase?**
- **APIs instantáneas:** Cada tabla y vista en tu base de datos está disponible instantáneamente a través de endpoints REST y GraphQL, facilitando la creación de aplicaciones basadas en datos sin escribir código backend personalizado.
- **Datos en tiempo real:** Supabase permite suscripciones en tiempo real, permitiendo que tus aplicaciones reaccionen instantáneamente a los cambios en tu base de datos.
- **Autenticación y autorización:** Gestión de usuarios incorporada con soporte para email, OAuth, SSO y más, además de seguridad a nivel de fila para un control de acceso granular.
- **Almacenamiento:** Sube, sirve y gestiona archivos de forma segura con almacenamiento integrado que se integra perfectamente con tu base de datos.
- **Funciones Edge:** Despliega funciones serverless cerca de tus usuarios para lógica personalizada de baja latencia.

**Uso de Supabase en Sim**

La integración de Supabase en Sim facilita la conexión de tus flujos de trabajo basados en agentes con tus proyectos de Supabase. Con solo unos pocos campos de configuración —tu ID de proyecto, nombre de tabla y clave secreta de rol de servicio— puedes interactuar de forma segura con tu base de datos directamente desde tus bloques de Sim. La integración abstrae la complejidad de las llamadas a la API, permitiéndote concentrarte en construir lógica y automatizaciones.

**Beneficios clave de usar Supabase en Sim:**
- **Operaciones de base de datos sin código/con poco código:** Consulta, inserta, actualiza y elimina filas en tus tablas de Supabase sin escribir SQL o código backend.
- **Consultas flexibles:** Utiliza la [sintaxis de filtro de PostgREST](https://postgrest.org/en/stable/api.html#operators) para realizar consultas avanzadas, incluyendo filtrado, ordenamiento y limitación de resultados.
- **Integración perfecta:** Conecta fácilmente Supabase con otras herramientas y servicios en tu flujo de trabajo, habilitando potentes automatizaciones como sincronización de datos, activación de notificaciones o enriquecimiento de registros.
- **Seguro y escalable:** Todas las operaciones utilizan tu clave secreta de rol de servicio de Supabase, asegurando un acceso seguro a tus datos con la escalabilidad de una plataforma cloud gestionada.

Ya sea que estés construyendo herramientas internas, automatizando procesos de negocio o impulsando aplicaciones de producción, Supabase en Sim proporciona una forma rápida, confiable y amigable para desarrolladores de gestionar tus datos y lógica de backend—sin necesidad de gestionar infraestructura. Simplemente configura tu bloque, selecciona la operación que necesitas y deja que Sim se encargue del resto.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Supabase en el flujo de trabajo. Admite operaciones de base de datos (consulta, inserción, actualización, eliminación, upsert), búsqueda de texto completo, funciones RPC, conteo de filas, búsqueda vectorial y gestión completa de almacenamiento (subir, descargar, listar, mover, copiar, eliminar archivos y buckets).

## Herramientas

### `supabase_query`

Consultar datos de una tabla de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Sí | Tu ID de proyecto de Supabase \(ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | El nombre de la tabla de Supabase a consultar |
| `filter` | string | No | Filtro de PostgREST \(ej., "id=eq.123"\) |
| `orderBy` | string | No | Columna para ordenar \(añade DESC para orden descendente\) |
| `limit` | number | No | Número máximo de filas a devolver |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros devueltos por la consulta |

### `supabase_insert`

Insertar datos en una tabla de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla Supabase donde insertar datos |
| `data` | array | Sí | Los datos a insertar \(array de objetos o un solo objeto\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros insertados |

### `supabase_get_row`

Obtener una sola fila de una tabla de Supabase basada en criterios de filtro

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto de Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla de Supabase para consultar |
| `filter` | string | Sí | Filtro PostgREST para encontrar la fila específica \(p. ej., "id=eq.123"\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array que contiene los datos de la fila si se encuentran, array vacío si no se encuentran |

### `supabase_update`

Actualizar filas en una tabla de Supabase según criterios de filtro

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla Supabase a actualizar |
| `filter` | string | Sí | Filtro PostgREST para identificar las filas a actualizar \(p. ej., "id=eq.123"\) |
| `data` | object | Sí | Datos para actualizar en las filas coincidentes |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros actualizados |

### `supabase_delete`

Eliminar filas de una tabla de Supabase según criterios de filtro

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla Supabase de la que eliminar |
| `filter` | string | Sí | Filtro PostgREST para identificar las filas a eliminar \(p. ej., "id=eq.123"\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros eliminados |

### `supabase_upsert`

Insertar o actualizar datos en una tabla de Supabase (operación upsert)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla Supabase donde hacer upsert de datos |
| `data` | array | Sí | Los datos para upsert \(insertar o actualizar\) - array de objetos o un solo objeto |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros insertados o actualizados |

### `supabase_count`

Contar filas en una tabla de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla Supabase de la que contar filas |
| `filter` | string | No | Filtro PostgREST \(p. ej., "status=eq.active"\) |
| `countType` | string | No | Tipo de conteo: exact, planned o estimated \(predeterminado: exact\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `count` | number | Número de filas que coinciden con el filtro |

### `supabase_text_search`

Realizar búsqueda de texto completo en una tabla de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `table` | string | Sí | Nombre de la tabla Supabase en la que buscar |
| `column` | string | Sí | La columna en la que buscar |
| `query` | string | Sí | La consulta de búsqueda |
| `searchType` | string | No | Tipo de búsqueda: plain, phrase o websearch \(predeterminado: websearch\) |
| `language` | string | No | Idioma para la configuración de búsqueda de texto \(predeterminado: english\) |
| `limit` | number | No | Número máximo de filas a devolver |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros que coinciden con la consulta de búsqueda |

### `supabase_vector_search`

Realizar búsqueda de similitud usando pgvector en una tabla de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase (p. ej., jdrkgepadsdopsntdlom) |
| `functionName` | string | Sí | Nombre de la función PostgreSQL que realiza la búsqueda vectorial (p. ej., match_documents) |
| `queryEmbedding` | array | Sí | El vector/embedding de consulta para buscar elementos similares |
| `matchThreshold` | number | No | Umbral mínimo de similitud (0-1), típicamente 0.7-0.9 |
| `matchCount` | number | No | Número máximo de resultados a devolver (predeterminado: 10) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de registros con puntuaciones de similitud de la búsqueda vectorial. Cada registro incluye un campo de similitud (0-1) que indica cuán similar es al vector de consulta. |

### `supabase_rpc`

Llamar a una función PostgreSQL en Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase (p. ej., jdrkgepadsdopsntdlom) |
| `functionName` | string | Sí | Nombre de la función PostgreSQL a llamar |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | json | Resultado devuelto por la función |

### `supabase_storage_upload`

Subir un archivo a un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `path` | string | Sí | La ruta donde se almacenará el archivo \(p. ej., "carpeta/archivo.jpg"\) |
| `fileContent` | string | Sí | El contenido del archivo \(codificado en base64 para archivos binarios, o texto plano\) |
| `contentType` | string | No | Tipo MIME del archivo \(p. ej., "image/jpeg", "text/plain"\) |
| `upsert` | boolean | No | Si es verdadero, sobrescribe el archivo existente \(predeterminado: false\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | object | Resultado de la subida incluyendo ruta del archivo y metadatos |

### `supabase_storage_download`

Descargar un archivo de un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `path` | string | Sí | La ruta al archivo a descargar \(p. ej., "carpeta/archivo.jpg"\) |
| `fileName` | string | No | Anulación opcional del nombre del archivo |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | file | Archivo descargado almacenado en archivos de ejecución |

### `supabase_storage_list`

Listar archivos en un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `path` | string | No | La ruta de la carpeta desde donde listar archivos \(predeterminado: raíz\) |
| `limit` | number | No | Número máximo de archivos a devolver \(predeterminado: 100\) |
| `offset` | number | No | Número de archivos a omitir \(para paginación\) |
| `sortBy` | string | No | Columna para ordenar: name, created_at, updated_at \(predeterminado: name\) |
| `sortOrder` | string | No | Orden de clasificación: asc o desc \(predeterminado: asc\) |
| `search` | string | No | Término de búsqueda para filtrar archivos por nombre |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de objetos de archivo con metadatos |

### `supabase_storage_delete`

Eliminar archivos de un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `paths` | array | Sí | Array de rutas de archivos a eliminar \(p. ej., \["carpeta/archivo1.jpg", "carpeta/archivo2.jpg"\]\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de objetos de archivos eliminados |

### `supabase_storage_move`

Mover un archivo dentro de un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `fromPath` | string | Sí | La ruta actual del archivo \(p. ej., "carpeta/viejo.jpg"\) |
| `toPath` | string | Sí | La nueva ruta para el archivo \(p. ej., "nuevacarpeta/nuevo.jpg"\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | object | Resultado de la operación de movimiento |

### `supabase_storage_copy`

Copiar un archivo dentro de un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `fromPath` | string | Sí | La ruta del archivo de origen \(p. ej., "carpeta/origen.jpg"\) |
| `toPath` | string | Sí | La ruta para el archivo copiado \(p. ej., "carpeta/copia.jpg"\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | object | Resultado de la operación de copia |

### `supabase_storage_create_bucket`

Crear un nuevo bucket de almacenamiento en Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket a crear |
| `isPublic` | boolean | No | Si el bucket debe ser accesible públicamente \(predeterminado: false\) |
| `fileSizeLimit` | number | No | Tamaño máximo de archivo en bytes \(opcional\) |
| `allowedMimeTypes` | array | No | Array de tipos MIME permitidos \(p. ej., \["image/png", "image/jpeg"\]\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | object | Información del bucket creado |

### `supabase_storage_list_buckets`

Listar todos los buckets de almacenamiento en Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | array | Array de objetos de bucket |

### `supabase_storage_delete_bucket`

Eliminar un bucket de almacenamiento en Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket a eliminar |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `results` | object | Resultado de la operación de eliminación |

### `supabase_storage_get_public_url`

Obtener la URL pública para un archivo en un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `path` | string | Sí | La ruta al archivo \(p. ej., "carpeta/archivo.jpg"\) |
| `download` | boolean | No | Si es verdadero, fuerza la descarga en lugar de mostrar en línea \(predeterminado: false\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `publicUrl` | string | La URL pública para acceder al archivo |

### `supabase_storage_create_signed_url`

Crear una URL firmada temporal para un archivo en un bucket de almacenamiento de Supabase

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Sí | ID de tu proyecto Supabase \(p. ej., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Sí | El nombre del bucket de almacenamiento |
| `path` | string | Sí | La ruta al archivo \(p. ej., "carpeta/archivo.jpg"\) |
| `expiresIn` | number | Sí | Número de segundos hasta que expire la URL \(p. ej., 3600 para 1 hora\) |
| `download` | boolean | No | Si es verdadero, fuerza la descarga en lugar de mostrar en línea \(predeterminado: false\) |
| `apiKey` | string | Sí | Tu clave secreta de rol de servicio de Supabase |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `signedUrl` | string | La URL firmada temporal para acceder al archivo |

## Notas

- Categoría: `tools`
- Tipo: `supabase`
```

--------------------------------------------------------------------------------

````
