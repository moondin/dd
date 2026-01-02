---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 134
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 134 of 933)

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

---[FILE: slack.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/slack.mdx

```text
---
title: Slack
description: Envía, actualiza, elimina mensajes, añade reacciones en Slack o
  activa flujos de trabajo desde eventos de Slack
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="slack"
  color="#611f69"
/>

{/* MANUAL-CONTENT-START:intro */}
[Slack](https://www.slack.com/) es una plataforma de comunicación empresarial que ofrece a los equipos un lugar unificado para mensajería, herramientas y archivos.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/J5jz3UaWmE8"
  title="Integración de Slack con Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Con Slack, puedes:

- **Automatiza notificaciones de agentes**: Envía actualizaciones en tiempo real desde tus agentes Sim a cualquier canal de Slack
- **Crea endpoints de webhook**: Configura bots de Slack como webhooks para activar flujos de trabajo de Sim desde actividades de Slack
- **Mejora los flujos de trabajo de agentes**: Integra mensajería de Slack en tus agentes para entregar resultados, alertas y actualizaciones de estado
- **Crea y comparte lienzos de Slack**: Genera programáticamente documentos colaborativos (lienzos) en canales de Slack
- **Lee mensajes de canales**: Recupera y procesa mensajes recientes de cualquier canal de Slack para monitoreo o activación de flujos de trabajo
- **Gestiona mensajes de bot**: Actualiza, elimina y añade reacciones a mensajes enviados por tu bot

En Sim, la integración con Slack permite a tus agentes interactuar programáticamente con Slack con capacidades completas de gestión de mensajes como parte de sus flujos de trabajo:

- **Enviar mensajes**: Los agentes pueden enviar mensajes formateados a cualquier canal o usuario de Slack, compatible con la sintaxis mrkdwn de Slack para formato enriquecido
- **Actualizar mensajes**: Editar mensajes de bot enviados previamente para corregir información o proporcionar actualizaciones de estado
- **Eliminar mensajes**: Eliminar mensajes de bot cuando ya no son necesarios o contienen errores
- **Añadir reacciones**: Expresar sentimiento o reconocimiento añadiendo reacciones con emojis a cualquier mensaje
- **Crear lienzos**: Crear y compartir lienzos de Slack (documentos colaborativos) directamente en canales, permitiendo compartir contenido más rico y documentación
- **Leer mensajes**: Leer mensajes recientes de canales, permitiendo monitoreo, informes o activación de acciones adicionales basadas en la actividad del canal
- **Descargar archivos**: Recuperar archivos compartidos en canales de Slack para procesamiento o archivo

Esto permite escenarios de automatización potentes como enviar notificaciones con actualizaciones dinámicas, gestionar flujos conversacionales con mensajes de estado editables, reconocer mensajes importantes con reacciones y mantener canales limpios eliminando mensajes de bot obsoletos. Tus agentes pueden entregar información oportuna, actualizar mensajes a medida que avanzan los flujos de trabajo, crear documentos colaborativos o alertar a miembros del equipo cuando se necesita atención. Esta integración cierra la brecha entre tus flujos de trabajo de IA y la comunicación de tu equipo, asegurando que todos se mantengan informados con información precisa y actualizada. Al conectar Sim con Slack, puedes crear agentes que mantengan a tu equipo actualizado con información relevante en el momento adecuado, mejorar la colaboración compartiendo y actualizando información automáticamente, y reducir la necesidad de actualizaciones manuales de estado, todo mientras aprovechas tu espacio de trabajo de Slack existente donde tu equipo ya se comunica.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Slack en el flujo de trabajo. Puede enviar, actualizar y eliminar mensajes, crear lienzos, leer mensajes y añadir reacciones. Requiere Token de Bot en lugar de OAuth en modo avanzado. Se puede usar en modo de disparador para iniciar un flujo de trabajo cuando se envía un mensaje a un canal.

## Herramientas

### `slack_message`

Envía mensajes a canales de Slack o mensajes directos. Compatible con el formato mrkdwn de Slack.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | No | Canal de Slack objetivo (p. ej., #general) |
| `userId` | string | No | ID de usuario de Slack objetivo para mensajes directos (p. ej., U1234567890) |
| `text` | string | Sí | Texto del mensaje a enviar (admite formato mrkdwn de Slack) |
| `thread_ts` | string | No | Marca de tiempo del hilo al que responder (crea respuesta en hilo) |
| `files` | file[] | No | Archivos para adjuntar al mensaje |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | object | Objeto de mensaje completo con todas las propiedades devueltas por Slack |
| `ts` | string | Marca de tiempo del mensaje |
| `channel` | string | ID del canal donde se envió el mensaje |
| `fileCount` | number | Número de archivos subidos (cuando se adjuntan archivos) |

### `slack_canvas`

Crea y comparte lienzos de Slack en canales. Los lienzos son documentos colaborativos dentro de Slack.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | Sí | Canal de Slack objetivo (p. ej., #general) |
| `title` | string | Sí | Título del lienzo |
| `content` | string | Sí | Contenido del lienzo en formato markdown |
| `document_content` | object | No | Contenido estructurado del documento de lienzo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `canvas_id` | string | ID del lienzo creado |
| `channel` | string | Canal donde se creó el lienzo |
| `title` | string | Título del lienzo |

### `slack_message_reader`

Lee los últimos mensajes de los canales de Slack. Recupera el historial de conversaciones con opciones de filtrado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | No | Canal de Slack del que leer mensajes (p. ej., #general) |
| `userId` | string | No | ID de usuario para conversación por MD (p. ej., U1234567890) |
| `limit` | number | No | Número de mensajes a recuperar (predeterminado: 10, máx: 100) |
| `oldest` | string | No | Inicio del rango de tiempo (marca de tiempo) |
| `latest` | string | No | Fin del rango de tiempo (marca de tiempo) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `messages` | array | Array de objetos de mensaje del canal |

### `slack_list_channels`

Lista todos los canales en un espacio de trabajo de Slack. Devuelve los canales públicos y privados a los que el bot tiene acceso.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `includePrivate` | boolean | No | Incluir canales privados de los que el bot es miembro (predeterminado: true) |
| `excludeArchived` | boolean | No | Excluir canales archivados (predeterminado: true) |
| `limit` | number | No | Número máximo de canales a devolver (predeterminado: 100, máx: 200) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `channels` | array | Array de objetos de canal del espacio de trabajo |

### `slack_list_members`

Lista todos los miembros (IDs de usuario) en un canal de Slack. Úsalo con Obtener Información de Usuario para resolver IDs a nombres.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | Sí | ID del canal del que listar miembros |
| `limit` | number | No | Número máximo de miembros a devolver (predeterminado: 100, máx: 200) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `members` | array | Array de IDs de usuario que son miembros del canal (p. ej., U1234567890) |

### `slack_list_users`

Lista todos los usuarios en un espacio de trabajo de Slack. Devuelve perfiles de usuario con nombres y avatares.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `includeDeleted` | boolean | No | Incluir usuarios desactivados/eliminados \(predeterminado: false\) |
| `limit` | number | No | Número máximo de usuarios a devolver \(predeterminado: 100, máx: 200\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `users` | array | Array de objetos de usuario del espacio de trabajo |

### `slack_get_user`

Obtiene información detallada sobre un usuario específico de Slack mediante su ID de usuario.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `userId` | string | Sí | ID de usuario a buscar \(p. ej., U1234567890\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `user` | object | Información detallada del usuario |

### `slack_download`

Descargar un archivo de Slack

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `fileId` | string | Sí | El ID del archivo a descargar |
| `fileName` | string | No | Anulación opcional del nombre del archivo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `file` | file | Archivo descargado almacenado en los archivos de ejecución |

### `slack_update_message`

Actualizar un mensaje enviado previamente por el bot en Slack

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | Sí | ID del canal donde se publicó el mensaje (p. ej., C1234567890) |
| `timestamp` | string | Sí | Marca de tiempo del mensaje a actualizar (p. ej., 1405894322.002768) |
| `text` | string | Sí | Nuevo texto del mensaje (admite formato mrkdwn de Slack) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | object | Objeto de mensaje actualizado completo con todas las propiedades devueltas por Slack |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del mensaje actualizado |

### `slack_delete_message`

Eliminar un mensaje enviado previamente por el bot en Slack

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | Sí | ID del canal donde se publicó el mensaje (p. ej., C1234567890) |
| `timestamp` | string | Sí | Marca de tiempo del mensaje a eliminar (p. ej., 1405894322.002768) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos del mensaje eliminado |

### `slack_add_reaction`

Añadir una reacción emoji a un mensaje de Slack

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Método de autenticación: oauth o bot_token |
| `botToken` | string | No | Token del bot para Bot personalizado |
| `channel` | string | Sí | ID del canal donde se publicó el mensaje (p. ej., C1234567890) |
| `timestamp` | string | Sí | Marca de tiempo del mensaje al que reaccionar (p. ej., 1405894322.002768) |
| `name` | string | Sí | Nombre de la reacción emoji (sin dos puntos, p. ej., thumbsup, heart, eyes) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Mensaje de éxito |
| `metadata` | object | Metadatos de la reacción |

## Notas

- Categoría: `tools`
- Tipo: `slack`
```

--------------------------------------------------------------------------------

---[FILE: sms.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/sms.mdx

```text
---
title: SMS
description: Envía mensajes SMS utilizando el servicio SMS interno
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
El bloque SMS te permite enviar mensajes de texto directamente desde tus flujos de trabajo utilizando la infraestructura de envío de SMS propia de Sim, impulsada por Twilio. Esta integración te permite entregar programáticamente notificaciones, alertas y otra información importante a los dispositivos móviles de los usuarios sin requerir ninguna configuración externa o OAuth.

Nuestro servicio interno de SMS está diseñado para ser fiable y fácil de usar, lo que lo hace ideal para automatizar comunicaciones y asegurar que tus mensajes lleguen a los destinatarios de manera eficiente.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Envía mensajes SMS directamente utilizando el servicio interno de SMS impulsado por Twilio. No requiere configuración externa ni OAuth. Perfecto para enviar notificaciones, alertas o mensajes de texto de propósito general desde tus flujos de trabajo. Requiere números de teléfono válidos con códigos de país.

## Herramientas

### `sms_send`

Envía un mensaje SMS utilizando el servicio interno de SMS impulsado por Twilio

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `to` | string | Sí | Número de teléfono del destinatario \(incluir código de país, p. ej., +1234567890\) |
| `body` | string | Sí | Contenido del mensaje SMS |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el SMS se envió correctamente |
| `to` | string | Número de teléfono del destinatario |
| `body` | string | Contenido del mensaje SMS |

## Notas

- Categoría: `tools`
- Tipo: `sms`
```

--------------------------------------------------------------------------------

---[FILE: smtp.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/smtp.mdx

```text
---
title: SMTP
description: Envía correos electrónicos a través de cualquier servidor de correo SMTP
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="smtp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SMTP (Simple Mail Transfer Protocol)](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) es el estándar fundamental para la transmisión de correos electrónicos a través de Internet. Al conectarte a cualquier servidor compatible con SMTP—como Gmail, Outlook, o la infraestructura de correo de tu organización—puedes enviar correos electrónicos de forma programática y automatizar tus comunicaciones salientes.

La integración SMTP te permite personalizar completamente el envío de correos electrónicos mediante conectividad directa con el servidor, admitiendo casos de uso de correo electrónico tanto básicos como avanzados. Con SMTP, puedes controlar todos los aspectos de la entrega de mensajes, la gestión de destinatarios y el formato del contenido, lo que lo hace adecuado para notificaciones transaccionales, envíos masivos y cualquier flujo de trabajo automatizado que requiera una entrega robusta de correos electrónicos salientes.

**Las características clave disponibles a través de la integración SMTP incluyen:**

- **Entrega universal de correos electrónicos:** Envía correos electrónicos utilizando cualquier servidor SMTP configurando parámetros estándar de conexión al servidor.
- **Remitente y destinatarios personalizables:** Especifica la dirección del remitente, el nombre para mostrar, los destinatarios principales, así como los campos CC y CCO.
- **Soporte para contenido enriquecido:** Envía correos electrónicos de texto plano o con formato HTML enriquecido según tus requisitos.
- **Archivos adjuntos:** Incluye múltiples archivos como adjuntos en los correos electrónicos salientes.
- **Seguridad flexible:** Conéctate usando protocolos TLS, SSL o estándar (sin cifrar) según lo admita tu proveedor SMTP.
- **Encabezados avanzados:** Configura encabezados de respuesta y otras opciones avanzadas de correo electrónico para atender flujos de correo complejos e interacciones de usuario.

Al integrar SMTP con Sim, los agentes y flujos de trabajo pueden enviar correos electrónicos de forma programática como parte de cualquier proceso automatizado—desde el envío de notificaciones y confirmaciones, hasta la automatización de comunicaciones externas, informes y entrega de documentos. Esto ofrece un enfoque altamente flexible e independiente del proveedor para gestionar el correo electrónico directamente dentro de tus procesos impulsados por IA.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Envía correos electrónicos utilizando cualquier servidor SMTP (Gmail, Outlook, servidores personalizados, etc.). Configura los ajustes de conexión SMTP y envía correos electrónicos con control total sobre el contenido, destinatarios y archivos adjuntos.

## Herramientas

### `smtp_send_mail`

Enviar correos electrónicos a través del servidor SMTP

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `smtpHost` | string | Sí | Nombre del host del servidor SMTP \(p. ej., smtp.gmail.com\) |
| `smtpPort` | number | Sí | Puerto del servidor SMTP \(587 para TLS, 465 para SSL\) |
| `smtpUsername` | string | Sí | Nombre de usuario para autenticación SMTP |
| `smtpPassword` | string | Sí | Contraseña para autenticación SMTP |
| `smtpSecure` | string | Sí | Protocolo de seguridad \(TLS, SSL o Ninguno\) |
| `from` | string | Sí | Dirección de correo electrónico del remitente |
| `to` | string | Sí | Dirección de correo electrónico del destinatario |
| `subject` | string | Sí | Asunto del correo electrónico |
| `body` | string | Sí | Contenido del cuerpo del correo electrónico |
| `contentType` | string | No | Tipo de contenido \(texto o html\) |
| `fromName` | string | No | Nombre para mostrar del remitente |
| `cc` | string | No | Destinatarios en CC \(separados por comas\) |
| `bcc` | string | No | Destinatarios en CCO \(separados por comas\) |
| `replyTo` | string | No | Dirección de correo electrónico de respuesta |
| `attachments` | file[] | No | Archivos para adjuntar al correo electrónico |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el correo electrónico se envió correctamente |
| `messageId` | string | ID del mensaje del servidor SMTP |
| `to` | string | Dirección de correo electrónico del destinatario |
| `subject` | string | Asunto del correo electrónico |
| `error` | string | Mensaje de error si el envío falló |

## Notas

- Categoría: `tools`
- Tipo: `smtp`
```

--------------------------------------------------------------------------------

````
