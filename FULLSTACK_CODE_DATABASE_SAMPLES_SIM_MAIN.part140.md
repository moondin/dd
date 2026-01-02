---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 140
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 140 of 933)

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

---[FILE: tts.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/tts.mdx

```text
---
title: Texto a voz
description: Convierte texto a voz utilizando voces de IA
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tts"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Convierte texto en voz de sonido natural utilizando las últimas voces de IA. Las herramientas de texto a voz (TTS) de Sim te permiten generar audio a partir de texto escrito en docenas de idiomas, con una selección de voces expresivas, formatos y controles avanzados como velocidad, estilo, emoción y más.

**Proveedores y modelos compatibles:**

- **[OpenAI Text-to-Speech](https://platform.openai.com/docs/guides/text-to-speech/voice-options)** (OpenAI):  
  La API TTS de OpenAI ofrece voces ultra realistas utilizando modelos avanzados de IA como `tts-1`, `tts-1-hd` y `gpt-4o-mini-tts`. Las voces incluyen tanto masculinas como femeninas, con opciones como alloy, echo, fable, onyx, nova, shimmer, ash, ballad, coral, sage y verse. Compatible con múltiples formatos de audio (mp3, opus, aac, flac, wav, pcm), velocidad ajustable y síntesis en streaming.

- **[Deepgram Aura](https://deepgram.com/products/text-to-speech)** (Deepgram Inc.):  
  Aura de Deepgram proporciona voces de IA expresivas en inglés y multilingües, optimizadas para claridad conversacional, baja latencia y personalización. Están disponibles modelos como `aura-asteria-en`, `aura-luna-en` y otros. Compatible con múltiples formatos de codificación (linear16, mp3, opus, aac, flac) y ajuste fino de velocidad, frecuencia de muestreo y estilo.

- **[ElevenLabs Text-to-Speech](https://elevenlabs.io/text-to-speech)** (ElevenLabs):  
  ElevenLabs lidera en TTS realista y emocionalmente rico, ofreciendo docenas de voces en más de 29 idiomas y la capacidad de clonar voces personalizadas. Los modelos admiten diseño de voz, síntesis de habla y acceso directo a API, con controles avanzados para estilo, emoción, estabilidad y similitud. Adecuado para audiolibros, creación de contenido, accesibilidad y más.

- **[Cartesia TTS](https://docs.cartesia.ai/)** (Cartesia):  
  Cartesia ofrece texto a voz de alta calidad, rápido y seguro con un enfoque en la privacidad y la implementación flexible. Proporciona streaming instantáneo, síntesis en tiempo real y es compatible con múltiples voces y acentos internacionales, accesibles a través de una API sencilla.

- **[Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)** (Google Cloud):  
  Google utiliza los modelos DeepMind WaveNet y Neural2 para potenciar voces de alta fidelidad en más de 50 idiomas y variantes. Las características incluyen selección de voz, tono, velocidad de habla, control de volumen, etiquetas SSML y acceso tanto a voces estándar como a voces premium de calidad de estudio. Ampliamente utilizado para accesibilidad, IVR y medios.

- **[Microsoft Azure Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)** (Microsoft Azure):  
  Azure proporciona más de 400 voces neuronales en más de 140 idiomas y configuraciones regionales, con personalización única de voz, estilo, emoción, rol y controles en tiempo real. Ofrece soporte SSML para pronunciación, entonación y más. Ideal para necesidades globales, empresariales o creativas de TTS.

- **[PlayHT](https://play.ht/)** (PlayHT):  
  PlayHT se especializa en síntesis de voz realista, clonación de voz y reproducción instantánea con más de 800 voces en más de 100 idiomas. Las características incluyen controles de emoción, tono y velocidad, audio con múltiples voces y creación de voces personalizadas a través de la API o estudio en línea.

**Cómo elegir:**  
Selecciona tu proveedor y modelo priorizando idiomas, tipos de voces compatibles, formatos deseados (mp3, wav, etc.), granularidad de control (velocidad, emoción, etc.) y características especializadas (clonación de voz, acento, streaming). Para casos de uso creativos, de accesibilidad o de desarrollo, asegúrate de la compatibilidad con los requisitos de tu aplicación y compara costos.

¡Visita el sitio oficial de cada proveedor para obtener información actualizada sobre capacidades, precios y documentación!
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Genera voz de sonido natural a partir de texto utilizando voces de IA de última generación de OpenAI, Deepgram, ElevenLabs, Cartesia, Google Cloud, Azure y PlayHT. Compatible con múltiples voces, idiomas y formatos de audio.

## Herramientas

### `tts_openai`

Convierte texto a voz utilizando modelos TTS de OpenAI

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `apiKey` | string | Sí | Clave API de OpenAI |
| `model` | string | No | Modelo TTS a utilizar \(tts-1, tts-1-hd, o gpt-4o-mini-tts\) |
| `voice` | string | No | Voz a utilizar \(alloy, ash, ballad, cedar, coral, echo, marin, sage, shimmer, verse\) |
| `responseFormat` | string | No | Formato de audio \(mp3, opus, aac, flac, wav, pcm\) |
| `speed` | number | No | Velocidad del habla \(0.25 a 4.0, predeterminado: 1.0\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL del archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

### `tts_deepgram`

Convertir texto a voz usando Deepgram Aura

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `apiKey` | string | Sí | Clave API de Deepgram |
| `model` | string | No | Modelo/voz de Deepgram (ej., aura-asteria-en, aura-luna-en) |
| `voice` | string | No | Identificador de voz (alternativa al parámetro model) |
| `encoding` | string | No | Codificación de audio (linear16, mp3, opus, aac, flac) |
| `sampleRate` | number | No | Frecuencia de muestreo (8000, 16000, 24000, 48000) |
| `bitRate` | number | No | Tasa de bits para formatos comprimidos |
| `container` | string | No | Formato de contenedor (none, wav, ogg) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL del archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

### `tts_elevenlabs`

Convierte texto a voz usando voces de ElevenLabs

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `voiceId` | string | Sí | El ID de la voz a utilizar |
| `apiKey` | string | Sí | Clave API de ElevenLabs |
| `modelId` | string | No | Modelo a utilizar \(p. ej., eleven_monolingual_v1, eleven_turbo_v2_5, eleven_flash_v2_5\) |
| `stability` | number | No | Estabilidad de voz \(0.0 a 1.0, predeterminado: 0.5\) |
| `similarityBoost` | number | No | Aumento de similitud \(0.0 a 1.0, predeterminado: 0.8\) |
| `style` | number | No | Exageración de estilo \(0.0 a 1.0\) |
| `useSpeakerBoost` | boolean | No | Usar potenciador de altavoz \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL al archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

### `tts_cartesia`

Convierte texto a voz usando Cartesia Sonic (latencia ultra baja)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `apiKey` | string | Sí | Clave API de Cartesia |
| `modelId` | string | No | ID del modelo \(sonic-english, sonic-multilingual\) |
| `voice` | string | No | ID de voz o embedding |
| `language` | string | No | Código de idioma \(en, es, fr, de, it, pt, etc.\) |
| `outputFormat` | json | No | Configuración de formato de salida \(container, encoding, sampleRate\) |
| `speed` | number | No | Multiplicador de velocidad |
| `emotion` | array | No | Etiquetas de emoción para Sonic-3 \(p. ej., \['positivity:high'\]\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL al archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

### `tts_google`

Convertir texto a voz utilizando Google Cloud Text-to-Speech

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `apiKey` | string | Sí | Clave API de Google Cloud |
| `voiceId` | string | No | ID de voz (p. ej., en-US-Neural2-A, en-US-Wavenet-D) |
| `languageCode` | string | Sí | Código de idioma (p. ej., en-US, es-ES, fr-FR) |
| `gender` | string | No | Género de voz (MALE, FEMALE, NEUTRAL) |
| `audioEncoding` | string | No | Codificación de audio (LINEAR16, MP3, OGG_OPUS, MULAW, ALAW) |
| `speakingRate` | number | No | Velocidad de habla (0.25 a 2.0, predeterminado: 1.0) |
| `pitch` | number | No | Tono de voz (-20.0 a 20.0, predeterminado: 0.0) |
| `volumeGainDb` | number | No | Ganancia de volumen en dB (-96.0 a 16.0) |
| `sampleRateHertz` | number | No | Frecuencia de muestreo en Hz |
| `effectsProfileId` | array | No | Perfil de efectos (p. ej., ['headphone-class-device']) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL al archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

### `tts_azure`

Convertir texto a voz usando Azure Cognitive Services

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `apiKey` | string | Sí | Clave de API de Azure Speech Services |
| `voiceId` | string | No | ID de voz (p. ej., en-US-JennyNeural, en-US-GuyNeural) |
| `region` | string | No | Región de Azure (p. ej., eastus, westus, westeurope) |
| `outputFormat` | string | No | Formato de audio de salida |
| `rate` | string | No | Velocidad de habla (p. ej., +10%, -20%, 1.5) |
| `pitch` | string | No | Tono de voz (p. ej., +5Hz, -2st, bajo) |
| `style` | string | No | Estilo de habla (p. ej., alegre, triste, enojado - solo voces neurales) |
| `styleDegree` | number | No | Intensidad del estilo (0.01 a 2.0) |
| `role` | string | No | Rol (p. ej., Niña, Niño, MujerJovenAdulta) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL al archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

### `tts_playht`

Convertir texto a voz usando PlayHT (clonación de voz)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `text` | string | Sí | El texto a convertir en voz |
| `apiKey` | string | Sí | Clave API de PlayHT \(encabezado AUTHORIZATION\) |
| `userId` | string | Sí | ID de usuario de PlayHT \(encabezado X-USER-ID\) |
| `voice` | string | No | ID de voz o URL del manifiesto |
| `quality` | string | No | Nivel de calidad \(draft, standard, premium\) |
| `outputFormat` | string | No | Formato de salida \(mp3, wav, ogg, flac, mulaw\) |
| `speed` | number | No | Multiplicador de velocidad \(0.5 a 2.0\) |
| `temperature` | number | No | Creatividad/aleatoriedad \(0.0 a 2.0\) |
| `voiceGuidance` | number | No | Estabilidad de voz \(1.0 a 6.0\) |
| `textGuidance` | number | No | Adherencia al texto \(1.0 a 6.0\) |
| `sampleRate` | number | No | Frecuencia de muestreo \(8000, 16000, 22050, 24000, 44100, 48000\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL del archivo de audio generado |
| `audioFile` | file | Objeto de archivo de audio generado |
| `duration` | number | Duración del audio en segundos |
| `characterCount` | number | Número de caracteres procesados |
| `format` | string | Formato de audio |
| `provider` | string | Proveedor de TTS utilizado |

## Notas

- Categoría: `tools`
- Tipo: `tts`
```

--------------------------------------------------------------------------------

---[FILE: twilio_sms.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/twilio_sms.mdx

```text
---
title: Twilio SMS
description: Enviar mensajes SMS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_sms"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio SMS](https://www.twilio.com/en-us/sms) es una potente plataforma de comunicaciones en la nube que permite a las empresas integrar capacidades de mensajería en sus aplicaciones y servicios.

Twilio SMS proporciona una API robusta para enviar y recibir mensajes de texto programáticamente a nivel global. Con cobertura en más de 180 países y un SLA de disponibilidad del 99,999%, Twilio se ha establecido como líder de la industria en tecnología de comunicaciones.

Las características principales de Twilio SMS incluyen:

- **Alcance global**: Envía mensajes a destinatarios de todo el mundo con números de teléfono locales en múltiples países
- **Mensajería programable**: Personaliza la entrega de mensajes con webhooks, recibos de entrega y opciones de programación
- **Análisis avanzados**: Realiza seguimiento de tasas de entrega, métricas de participación y optimiza tus campañas de mensajería

En Sim, la integración de Twilio SMS permite a tus agentes aprovechar estas potentes capacidades de mensajería como parte de sus flujos de trabajo. Esto crea oportunidades para escenarios sofisticados de interacción con clientes como recordatorios de citas, códigos de verificación, alertas y conversaciones interactivas. La integración conecta tus flujos de trabajo de IA con los canales de comunicación de los clientes, permitiendo que tus agentes entreguen información oportuna y relevante directamente a los dispositivos móviles de los usuarios. Al conectar Sim con Twilio SMS, puedes crear agentes inteligentes que interactúen con los clientes a través de su canal de comunicación preferido, mejorando la experiencia del usuario mientras automatizas tareas rutinarias de mensajería.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integrar Twilio en el flujo de trabajo. Puede enviar mensajes SMS.

## Herramientas

### `twilio_send_sms`

Envía mensajes de texto a uno o varios destinatarios utilizando la API de Twilio.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `phoneNumbers` | string | Sí | Números de teléfono a los que enviar el mensaje, separados por saltos de línea |
| `message` | string | Sí | Mensaje a enviar |
| `accountSid` | string | Sí | SID de la cuenta de Twilio |
| `authToken` | string | Sí | Token de autenticación de Twilio |
| `fromNumber` | string | Sí | Número de teléfono de Twilio desde el que enviar el mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Estado de éxito del envío de SMS |
| `messageId` | string | Identificador único del mensaje de Twilio \(SID\) |
| `status` | string | Estado de entrega del mensaje desde Twilio |
| `fromNumber` | string | Número de teléfono desde el que se envió el mensaje |
| `toNumber` | string | Número de teléfono al que se envió el mensaje |

## Notas

- Categoría: `tools`
- Tipo: `twilio_sms`
```

--------------------------------------------------------------------------------

---[FILE: twilio_voice.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/twilio_voice.mdx

```text
---
title: Twilio Voice
description: Realiza y gestiona llamadas telefónicas
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_voice"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio Voice](https://www.twilio.com/en-us/voice) es una potente plataforma de comunicaciones en la nube que permite a las empresas realizar, recibir y gestionar llamadas telefónicas de forma programática a través de una API sencilla.

Twilio Voice proporciona una API robusta para crear aplicaciones de voz sofisticadas con alcance global. Con cobertura en más de 100 países, fiabilidad de nivel operador y un SLA de disponibilidad del 99,95%, Twilio se ha establecido como líder de la industria en comunicaciones de voz programables.

Las características principales de Twilio Voice incluyen:

- **Red de voz global**: Realiza y recibe llamadas en todo el mundo con números de teléfono locales en múltiples países
- **Control de llamadas programable**: Utiliza TwiML para controlar el flujo de llamadas, grabar conversaciones, recopilar entradas DTMF e implementar sistemas IVR
- **Capacidades avanzadas**: Reconocimiento de voz, texto a voz, desvío de llamadas, conferencias y detección de contestadores automáticos
- **Análisis en tiempo real**: Seguimiento de la calidad de las llamadas, duración, costes y optimización de tus aplicaciones de voz

En Sim, la integración de Twilio Voice permite a tus agentes aprovechar estas potentes capacidades de voz como parte de sus flujos de trabajo. Esto crea oportunidades para escenarios sofisticados de interacción con clientes como recordatorios de citas, llamadas de verificación, líneas de soporte automatizadas y sistemas de respuesta de voz interactiva. La integración conecta tus flujos de trabajo de IA con canales de comunicación por voz, permitiendo a tus agentes entregar información oportuna y relevante directamente a través de llamadas telefónicas. Al conectar Sim con Twilio Voice, puedes crear agentes inteligentes que interactúen con los clientes a través de su canal de comunicación preferido, mejorando la experiencia del usuario mientras automatizas tareas rutinarias de llamadas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Twilio Voice en el flujo de trabajo. Realiza llamadas salientes y recupera grabaciones de llamadas.

## Herramientas

### `twilio_voice_make_call`

Realiza una llamada telefónica saliente utilizando la API de Twilio Voice.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `to` | string | Sí | Número de teléfono a llamar \(formato E.164, p. ej., +14155551234\) |
| `from` | string | Sí | Tu número de teléfono de Twilio desde el que llamar \(formato E.164\) |
| `url` | string | No | URL que devuelve instrucciones TwiML para la llamada |
| `twiml` | string | No | Instrucciones TwiML para ejecutar \(alternativa a URL\). Usa corchetes en lugar de paréntesis angulares, p. ej., \[Response\]\[Say\]Hello\[/Say\]\[/Response\] |
| `statusCallback` | string | No | URL del webhook para actualizaciones del estado de la llamada |
| `statusCallbackMethod` | string | No | Método HTTP para la devolución de llamada de estado \(GET o POST\) |
| `accountSid` | string | Sí | SID de la cuenta de Twilio |
| `authToken` | string | Sí | Token de autenticación de Twilio |
| `record` | boolean | No | Si se debe grabar la llamada |
| `recordingStatusCallback` | string | No | URL del webhook para actualizaciones del estado de la grabación |
| `timeout` | number | No | Tiempo de espera para respuesta antes de rendirse \(segundos, predeterminado: 60\) |
| `machineDetection` | string | No | Detección de contestador automático: Enable o DetectMessageEnd |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la llamada se inició correctamente |
| `callSid` | string | Identificador único para la llamada |
| `status` | string | Estado de la llamada \(en cola, sonando, en progreso, completada, etc.\) |
| `direction` | string | Dirección de la llamada \(outbound-api\) |
| `from` | string | Número de teléfono desde el que se realiza la llamada |
| `to` | string | Número de teléfono al que se realiza la llamada |
| `duration` | number | Duración de la llamada en segundos |
| `price` | string | Costo de la llamada |
| `priceUnit` | string | Moneda del precio |
| `error` | string | Mensaje de error si la llamada falló |

### `twilio_voice_list_calls`

Recupera una lista de llamadas realizadas hacia y desde una cuenta.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `accountSid` | string | Sí | SID de la cuenta de Twilio |
| `authToken` | string | Sí | Token de autenticación de Twilio |
| `to` | string | No | Filtrar por llamadas a este número de teléfono |
| `from` | string | No | Filtrar por llamadas desde este número de teléfono |
| `status` | string | No | Filtrar por estado de llamada \(en cola, sonando, en progreso, completada, etc.\) |
| `startTimeAfter` | string | No | Filtrar llamadas que comenzaron en o después de esta fecha \(AAAA-MM-DD\) |
| `startTimeBefore` | string | No | Filtrar llamadas que comenzaron en o antes de esta fecha \(AAAA-MM-DD\) |
| `pageSize` | number | No | Número de registros a devolver \(máximo 1000, predeterminado 50\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Indica si las llamadas se recuperaron correctamente |
| `calls` | array | Array de objetos de llamada |
| `total` | number | Número total de llamadas devueltas |
| `page` | number | Número de página actual |
| `pageSize` | number | Número de llamadas por página |
| `error` | string | Mensaje de error si la recuperación falló |

### `twilio_voice_get_recording`

Recupera información de grabación de llamadas y transcripción (si está habilitada a través de TwiML).

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `recordingSid` | string | Sí | SID de grabación a recuperar |
| `accountSid` | string | Sí | SID de la cuenta de Twilio |
| `authToken` | string | Sí | Token de autenticación de Twilio |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la grabación se recuperó correctamente |
| `recordingSid` | string | Identificador único para la grabación |
| `callSid` | string | SID de llamada al que pertenece esta grabación |
| `duration` | number | Duración de la grabación en segundos |
| `status` | string | Estado de la grabación \(completada, procesando, etc.\) |
| `channels` | number | Número de canales \(1 para mono, 2 para dual\) |
| `source` | string | Cómo se creó la grabación |
| `mediaUrl` | string | URL para descargar el archivo multimedia de la grabación |
| `price` | string | Costo de la grabación |
| `priceUnit` | string | Moneda del precio |
| `uri` | string | URI relativa del recurso de grabación |
| `transcriptionText` | string | Texto transcrito de la grabación \(si está disponible\) |
| `transcriptionStatus` | string | Estado de la transcripción \(completada, en progreso, fallida\) |
| `transcriptionPrice` | string | Costo de la transcripción |
| `transcriptionPriceUnit` | string | Moneda del precio de la transcripción |
| `error` | string | Mensaje de error si la recuperación falló |

## Notas

- Categoría: `tools`
- Tipo: `twilio_voice`
```

--------------------------------------------------------------------------------

---[FILE: typeform.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/typeform.mdx

```text
---
title: Typeform
description: Interactúa con Typeform
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="typeform"
  color="#262627"
/>

{/* MANUAL-CONTENT-START:intro */}
[Typeform](https://www.typeform.com/) es una plataforma fácil de usar para crear formularios conversacionales, encuestas y cuestionarios con un enfoque en la experiencia atractiva del usuario.

Con Typeform, puedes:

- **Crear formularios interactivos**: Diseña formularios conversacionales atractivos que involucran a los encuestados con una interfaz única de una pregunta a la vez
- **Personalizar tu experiencia**: Utiliza lógica condicional, campos ocultos y temas personalizados para crear recorridos de usuario personalizados
- **Integrar con otras herramientas**: Conéctate con más de 1000 aplicaciones a través de integraciones nativas y APIs
- **Analizar datos de respuestas**: Obtén información procesable a través de herramientas completas de análisis e informes

En Sim, la integración de Typeform permite a tus agentes interactuar programáticamente con tus datos de Typeform como parte de sus flujos de trabajo. Los agentes pueden recuperar respuestas de formularios, procesar datos de envío e incorporar comentarios de usuarios directamente en los procesos de toma de decisiones. Esta integración es particularmente valiosa para escenarios como la calificación de leads, análisis de comentarios de clientes y personalización basada en datos. Al conectar Sim con Typeform, puedes crear flujos de trabajo de automatización inteligentes que transforman las respuestas de formularios en información procesable - analizando sentimientos, categorizando comentarios, generando resúmenes e incluso desencadenando acciones de seguimiento basadas en patrones específicos de respuesta.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Typeform en el flujo de trabajo. Puede recuperar respuestas, descargar archivos y obtener información de formularios. Se puede usar en modo de activación para iniciar un flujo de trabajo cuando se envía un formulario. Requiere clave API.

## Herramientas

### `typeform_responses`

Recuperar respuestas de formularios de Typeform

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `formId` | string | Sí | ID del formulario de Typeform |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |
| `pageSize` | number | No | Número de respuestas a recuperar \(predeterminado: 25\) |
| `since` | string | No | Recuperar respuestas enviadas después de esta fecha \(formato ISO 8601\) |
| `until` | string | No | Recuperar respuestas enviadas antes de esta fecha \(formato ISO 8601\) |
| `completed` | string | No | Filtrar por estado de finalización \(true/false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `total_items` | number | Número total de respuestas |
| `page_count` | number | Número total de páginas disponibles |
| `items` | array | Array de objetos de respuesta con response_id, submitted_at, answers y metadata |

### `typeform_files`

Descargar archivos subidos en respuestas de Typeform

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Sí | ID del formulario de Typeform |
| `responseId` | string | Sí | ID de respuesta que contiene los archivos |
| `fieldId` | string | Sí | ID único del campo de carga de archivos |
| `filename` | string | Sí | Nombre del archivo subido |
| `inline` | boolean | No | Si se debe solicitar el archivo con Content-Disposition en línea |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `fileUrl` | string | URL de descarga directa para el archivo subido |
| `contentType` | string | Tipo MIME del archivo subido |
| `filename` | string | Nombre original del archivo subido |

### `typeform_insights`

Obtener información y análisis para formularios de Typeform

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Sí | ID del formulario de Typeform |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `fields` | array | Número de usuarios que abandonaron en este campo |

### `typeform_list_forms`

Recupera una lista de todos los formularios en tu cuenta de Typeform

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |
| `search` | string | No | Consulta de búsqueda para filtrar formularios por título |
| `page` | number | No | Número de página \(predeterminado: 1\) |
| `pageSize` | number | No | Número de formularios por página \(predeterminado: 10, máx: 200\) |
| `workspaceId` | string | No | Filtrar formularios por ID de espacio de trabajo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `total_items` | number | Número total de formularios en la cuenta |
| `page_count` | number | Número total de páginas disponibles |
| `items` | array | Array de objetos de formulario con id, title, created_at, last_updated_at, settings, theme y _links |

### `typeform_get_form`

Recuperar detalles completos y estructura de un formulario específico

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |
| `formId` | string | Sí | Identificador único del formulario |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | Identificador único del formulario |
| `title` | string | Título del formulario |
| `type` | string | Tipo de formulario \(form, quiz, etc.\) |
| `settings` | object | Configuración del formulario incluyendo idioma, barra de progreso, etc. |
| `theme` | object | Referencia del tema |
| `workspace` | object | Referencia del espacio de trabajo |
| `fields` | array | Array de campos/preguntas del formulario |
| `welcome_screens` | array | Array de pantallas de bienvenida |
| `thankyou_screens` | array | Array de pantallas de agradecimiento |
| `_links` | object | Enlaces a recursos relacionados incluyendo URL pública del formulario |

### `typeform_create_form`

Crear un nuevo formulario con campos y configuraciones

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |
| `title` | string | Sí | Título del formulario |
| `type` | string | No | Tipo de formulario \(predeterminado: "form"\). Opciones: "form", "quiz" |
| `workspaceId` | string | No | ID del espacio de trabajo donde crear el formulario |
| `fields` | json | No | Array de objetos de campo que definen la estructura del formulario. Cada campo necesita: tipo, título y propiedades/validaciones opcionales |
| `settings` | json | No | Objeto de configuración del formulario \(idioma, barra_de_progreso, etc.\) |
| `themeId` | string | No | ID del tema a aplicar al formulario |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | Identificador único del formulario creado |
| `title` | string | Título del formulario |
| `type` | string | Tipo de formulario |
| `fields` | array | Array de campos del formulario creado |
| `_links` | object | Enlaces a recursos relacionados incluyendo URL pública del formulario |

### `typeform_update_form`

Actualizar un formulario existente usando operaciones JSON Patch

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |
| `formId` | string | Sí | Identificador único del formulario a actualizar |
| `operations` | json | Sí | Array de operaciones JSON Patch \(RFC 6902\). Cada operación necesita: op \(add/remove/replace\), path, y value \(para add/replace\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `id` | string | Identificador único del formulario actualizado |
| `title` | string | Título del formulario |
| `type` | string | Tipo de formulario |
| `settings` | object | Configuración del formulario |
| `theme` | object | Referencia del tema |
| `workspace` | object | Referencia del espacio de trabajo |
| `fields` | array | Array de campos del formulario |
| `welcome_screens` | array | Array de pantallas de bienvenida |
| `thankyou_screens` | array | Array de pantallas de agradecimiento |
| `_links` | object | Enlaces a recursos relacionados |

### `typeform_delete_form`

Eliminar permanentemente un formulario y todas sus respuestas

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Sí | Token de acceso personal de Typeform |
| `formId` | string | Sí | Identificador único del formulario a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | boolean | Si el formulario se eliminó correctamente |
| `message` | string | Mensaje de confirmación de eliminación |

## Notas

- Categoría: `tools`
- Tipo: `typeform`
```

--------------------------------------------------------------------------------

````
