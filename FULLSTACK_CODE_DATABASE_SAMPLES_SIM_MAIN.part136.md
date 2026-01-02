---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 136
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 136 of 933)

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

---[FILE: sqs.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/sqs.mdx

```text
---
title: Amazon SQS
description: Conectar a Amazon SQS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sqs"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) es un servicio de cola de mensajes completamente administrado que permite desacoplar y escalar microservicios, sistemas distribuidos y aplicaciones sin servidor. SQS elimina la complejidad y la sobrecarga asociadas con la gestión y operación de middleware orientado a mensajes, y permite a los desarrolladores centrarse en el trabajo diferenciador.

Con Amazon SQS, puedes:

- **Enviar mensajes**: Publicar mensajes en colas para procesamiento asíncrono
- **Desacoplar aplicaciones**: Permitir un acoplamiento flexible entre los componentes de tu sistema
- **Escalar cargas de trabajo**: Manejar cargas de trabajo variables sin aprovisionar infraestructura
- **Garantizar fiabilidad**: Redundancia incorporada y alta disponibilidad
- **Soportar colas FIFO**: Mantener un orden estricto de mensajes y procesamiento exactamente una vez

En Sim, la integración con SQS permite a tus agentes enviar mensajes a las colas de Amazon SQS de forma segura y programática. Las operaciones compatibles incluyen:

- **Enviar mensaje**: Enviar mensajes a colas SQS con ID de grupo de mensajes opcional e ID de deduplicación para colas FIFO

Esta integración permite a tus agentes automatizar flujos de trabajo de envío de mensajes sin intervención manual. Al conectar Sim con Amazon SQS, puedes crear agentes que publiquen mensajes en colas dentro de tus flujos de trabajo, todo sin tener que gestionar la infraestructura o las conexiones de las colas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Amazon SQS en el flujo de trabajo. Puede enviar mensajes a colas SQS.

## Herramientas

### `sqs_send`

Enviar un mensaje a una cola de Amazon SQS

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `region` | string | Sí | Región de AWS (p. ej., us-east-1) |
| `accessKeyId` | string | Sí | ID de clave de acceso de AWS |
| `secretAccessKey` | string | Sí | Clave de acceso secreta de AWS |
| `queueUrl` | string | Sí | URL de la cola |
| `data` | object | Sí | Cuerpo del mensaje a enviar |
| `messageGroupId` | string | No | ID del grupo de mensajes (opcional) |
| `messageDeduplicationId` | string | No | ID de deduplicación del mensaje (opcional) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `message` | string | Mensaje de estado de la operación |
| `id` | string | ID del mensaje |

## Notas

- Categoría: `tools`
- Tipo: `sqs`
```

--------------------------------------------------------------------------------

---[FILE: ssh.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/ssh.mdx

```text
---
title: SSH
description: Conéctate a servidores remotos vía SSH
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ssh"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[SSH (Secure Shell)](https://en.wikipedia.org/wiki/Secure_Shell) es un protocolo ampliamente utilizado para conectarse de forma segura a servidores remotos, permitiéndote ejecutar comandos, transferir archivos y gestionar sistemas a través de canales cifrados.

Con el soporte SSH en Sim, tus agentes pueden:

- **Ejecutar comandos remotos**: Ejecuta comandos de shell en cualquier servidor accesible por SSH
- **Subir y ejecutar scripts**: Transfiere y ejecuta fácilmente scripts de múltiples líneas para automatización avanzada
- **Transferir archivos de forma segura**: Sube y descarga archivos como parte de tus flujos de trabajo (próximamente o mediante comando)
- **Automatizar la gestión de servidores**: Realiza actualizaciones, mantenimiento, monitoreo, despliegues y tareas de configuración de forma programática
- **Usar autenticación flexible**: Conéctate con autenticación por contraseña o clave privada, incluyendo soporte para claves cifradas

Las siguientes herramientas SSH de Sim permiten a tus agentes interactuar con servidores como parte de automatizaciones más amplias:

- `ssh_execute_command`: Ejecuta cualquier comando shell de forma remota y captura la salida, el estado y los errores.
- `ssh_execute_script`: Sube y ejecuta un script completo de múltiples líneas en el sistema remoto.
- (Próximamente herramientas adicionales, como la transferencia de archivos).

Al integrar SSH en los flujos de trabajo de tus agentes, puedes automatizar el acceso seguro, las operaciones remotas y la orquestación de servidores, agilizando DevOps, automatización de TI y gestión remota personalizada, todo desde Sim.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Ejecuta comandos, transfiere archivos y gestiona servidores remotos vía SSH. Compatible con autenticación por contraseña y clave privada para acceso seguro al servidor.

## Herramientas

### `ssh_execute_command`

Ejecuta un comando shell en un servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `command` | string | Sí | Comando shell para ejecutar en el servidor remoto |
| `workingDirectory` | string | No | Directorio de trabajo para la ejecución del comando |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `stdout` | string | Salida estándar del comando |
| `stderr` | string | Salida de error estándar |
| `exitCode` | number | Código de salida del comando |
| `success` | boolean | Si el comando tuvo éxito \(código de salida 0\) |
| `message` | string | Mensaje de estado de la operación |

### `ssh_execute_script`

Subir y ejecutar un script de múltiples líneas en un servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `script` | string | Sí | Contenido del script a ejecutar \(bash, python, etc.\) |
| `interpreter` | string | No | Intérprete del script \(predeterminado: /bin/bash\) |
| `workingDirectory` | string | No | Directorio de trabajo para la ejecución del script |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `stdout` | string | Salida estándar del script |
| `stderr` | string | Salida de error estándar |
| `exitCode` | number | Código de salida del script |
| `success` | boolean | Si el script tuvo éxito \(código de salida 0\) |
| `scriptPath` | string | Ruta temporal donde se subió el script |
| `message` | string | Mensaje de estado de la operación |

### `ssh_check_command_exists`

Comprobar si un comando/programa existe en el servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `commandName` | string | Sí | Nombre del comando a comprobar \(p. ej., docker, git, python3\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `commandExists` | boolean | Si el comando existe o no |
| `commandPath` | string | Ruta completa al comando \(si se encuentra\) |
| `version` | string | Salida de la versión del comando \(si es aplicable\) |
| `message` | string | Mensaje de estado de la operación |

### `ssh_upload_file`

Subir un archivo a un servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `fileContent` | string | Sí | Contenido del archivo a subir \(codificado en base64 para archivos binarios\) |
| `fileName` | string | Sí | Nombre del archivo que se está subiendo |
| `remotePath` | string | Sí | Ruta de destino en el servidor remoto |
| `permissions` | string | No | Permisos del archivo \(p. ej., 0644\) |
| `overwrite` | boolean | No | Si se deben sobrescribir archivos existentes \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `uploaded` | boolean | Indica si el archivo se subió correctamente |
| `remotePath` | string | Ruta final en el servidor remoto |
| `size` | number | Tamaño del archivo en bytes |
| `message` | string | Mensaje de estado de la operación |

### `ssh_download_file`

Descargar un archivo desde un servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `remotePath` | string | Sí | Ruta del archivo en el servidor remoto |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `downloaded` | boolean | Indica si el archivo se descargó correctamente |
| `fileContent` | string | Contenido del archivo \(codificado en base64 para archivos binarios\) |
| `fileName` | string | Nombre del archivo descargado |
| `remotePath` | string | Ruta de origen en el servidor remoto |
| `size` | number | Tamaño del archivo en bytes |
| `message` | string | Mensaje de estado de la operación |

### `ssh_list_directory`

Listar archivos y directorios en un directorio remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `path` | string | Sí | Ruta del directorio remoto a listar |
| `detailed` | boolean | No | Incluir detalles del archivo \(tamaño, permisos, fecha de modificación\) |
| `recursive` | boolean | No | Listar subdirectorios recursivamente \(predeterminado: false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `entries` | array | Array de entradas de archivos y directorios |

### `ssh_check_file_exists`

Comprobar si un archivo o directorio existe en el servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `path` | string | Sí | Ruta del archivo o directorio remoto a comprobar |
| `type` | string | No | Tipo esperado: archivo, directorio o cualquiera \(predeterminado: cualquiera\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `exists` | boolean | Si la ruta existe |
| `type` | string | Tipo de ruta (archivo, directorio, enlace simbólico, no_encontrado) |
| `size` | number | Tamaño del archivo si es un archivo |
| `permissions` | string | Permisos del archivo (p. ej., 0755) |
| `modified` | string | Marca de tiempo de última modificación |
| `message` | string | Mensaje de estado de la operación |

### `ssh_create_directory`

Crear un directorio en el servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH (predeterminado: 22) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación (si no se usa clave privada) |
| `privateKey` | string | No | Clave privada para autenticación (formato OpenSSH) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `path` | string | Sí | Ruta del directorio a crear |
| `recursive` | boolean | No | Crear directorios padre si no existen (predeterminado: true) |
| `permissions` | string | No | Permisos del directorio (predeterminado: 0755) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `created` | boolean | Si el directorio se creó correctamente |
| `remotePath` | string | Ruta del directorio creado |
| `alreadyExists` | boolean | Si el directorio ya existía |
| `message` | string | Mensaje de estado de la operación |

### `ssh_delete_file`

Eliminar un archivo o directorio del servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `path` | string | Sí | Ruta a eliminar |
| `recursive` | boolean | No | Eliminar directorios recursivamente \(predeterminado: false\) |
| `force` | boolean | No | Forzar eliminación sin confirmación \(predeterminado: false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deleted` | boolean | Si la ruta se eliminó correctamente |
| `remotePath` | string | Ruta eliminada |
| `message` | string | Mensaje de estado de la operación |

### `ssh_move_rename`

Mover o renombrar un archivo o directorio en el servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `sourcePath` | string | Sí | Ruta actual del archivo o directorio |
| `destinationPath` | string | Sí | Nueva ruta para el archivo o directorio |
| `overwrite` | boolean | No | Sobrescribir destino si existe \(predeterminado: false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `moved` | boolean | Si la operación fue exitosa |
| `sourcePath` | string | Ruta original |
| `destinationPath` | string | Nueva ruta |
| `message` | string | Mensaje de estado de la operación |

### `ssh_get_system_info`

Obtener información del sistema desde el servidor SSH remoto

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `hostname` | string | Nombre de host del servidor |
| `os` | string | Sistema operativo \(p. ej., Linux, Darwin\) |
| `architecture` | string | Arquitectura de CPU \(p. ej., x64, arm64\) |
| `uptime` | number | Tiempo de actividad del sistema en segundos |
| `memory` | json | Información de memoria \(total, libre, usada\) |
| `diskSpace` | json | Información de espacio en disco \(total, libre, usado\) |
| `message` | string | Mensaje de estado de la operación |

### `ssh_read_file_content`

Leer el contenido de un archivo remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `path` | string | Sí | Ruta del archivo remoto a leer |
| `encoding` | string | No | Codificación del archivo \(predeterminado: utf-8\) |
| `maxSize` | number | No | Tamaño máximo de archivo a leer en MB \(predeterminado: 10\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `content` | string | Contenido del archivo como cadena de texto |
| `size` | number | Tamaño del archivo en bytes |
| `lines` | number | Número de líneas en el archivo |
| `remotePath` | string | Ruta del archivo remoto |
| `message` | string | Mensaje de estado de la operación |

### `ssh_write_file_content`

Escribir o añadir contenido a un archivo remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SSH |
| `port` | number | Sí | Puerto del servidor SSH \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SSH |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `path` | string | Sí | Ruta del archivo remoto donde escribir |
| `content` | string | Sí | Contenido a escribir en el archivo |
| `mode` | string | No | Modo de escritura: sobrescribir, añadir o crear \(predeterminado: sobrescribir\) |
| `permissions` | string | No | Permisos del archivo \(p. ej., 0644\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `written` | boolean | Si el archivo se escribió correctamente |
| `remotePath` | string | Ruta del archivo |
| `size` | number | Tamaño final del archivo en bytes |
| `message` | string | Mensaje de estado de la operación |

## Notas

- Categoría: `tools`
- Tipo: `ssh`
```

--------------------------------------------------------------------------------

---[FILE: stagehand.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/stagehand.mdx

```text
---
title: Stagehand
description: Automatización web y extracción de datos
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stagehand"
  color="#FFC83C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Stagehand](https://stagehand.com) es una herramienta que permite tanto la extracción de datos estructurados de páginas web como la automatización web autónoma utilizando Browserbase y LLMs modernos (OpenAI o Anthropic).

Stagehand ofrece dos capacidades principales en Sim:

- **stagehand_extract**: Extrae datos estructurados de una sola página web. Especificas lo que quieres (un esquema), y la IA recupera y analiza los datos en esa forma desde la página. Esto es mejor para extraer listas, campos u objetos cuando sabes exactamente qué información necesitas y dónde obtenerla.

- **stagehand_agent**: Ejecuta un agente web autónomo capaz de completar tareas de múltiples pasos, interactuar con elementos, navegar entre páginas y devolver resultados estructurados. Esto es mucho más flexible: el agente puede hacer cosas como iniciar sesión, buscar, completar formularios, recopilar datos de múltiples lugares y generar un resultado final según un esquema solicitado.

**Diferencias clave:**

- *stagehand_extract* es una operación rápida de “extraer estos datos de esta página”. Funciona mejor para tareas de extracción directas, de un solo paso.
- *stagehand_agent* realiza tareas autónomas complejas de múltiples pasos en la web — como navegación, búsqueda o incluso transacciones — y puede extraer datos dinámicamente según tus instrucciones y un esquema opcional.

En la práctica, usa **stagehand_extract** cuando sabes qué quieres y dónde, y usa **stagehand_agent** cuando necesitas que un bot piense y ejecute flujos de trabajo interactivos.

Al integrar Stagehand, los agentes de Sim pueden automatizar la recopilación de datos, el análisis y la ejecución de flujos de trabajo en la web: actualizando bases de datos, organizando información y generando informes personalizados, de manera fluida y autónoma.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Stagehand en el flujo de trabajo. Puede extraer datos estructurados de páginas web o ejecutar un agente autónomo para realizar tareas.

## Herramientas

### `stagehand_extract`

Extraer datos estructurados de una página web usando Stagehand

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `url` | string | Sí | URL de la página web de la que extraer datos |
| `instruction` | string | Sí | Instrucciones para la extracción |
| `provider` | string | No | Proveedor de IA a utilizar: openai o anthropic |
| `apiKey` | string | Sí | Clave API para el proveedor seleccionado |
| `schema` | json | Sí | Esquema JSON que define la estructura de los datos a extraer |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `data` | object | Datos estructurados extraídos que coinciden con el esquema proporcionado |

### `stagehand_agent`

Ejecutar un agente web autónomo para completar tareas y extraer datos estructurados

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `startUrl` | string | Sí | URL de la página web donde iniciar el agente |
| `task` | string | Sí | La tarea a completar o el objetivo a lograr en el sitio web |
| `variables` | json | No | Variables opcionales para sustituir en la tarea \(formato: \{key: value\}\). Referencia en la tarea usando %key% |
| `format` | string | No | Sin descripción |
| `provider` | string | No | Proveedor de IA a utilizar: openai o anthropic |
| `apiKey` | string | Sí | Clave API para el proveedor seleccionado |
| `outputSchema` | json | No | Esquema JSON opcional que define la estructura de los datos que el agente debe devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `agentResult` | objeto | Resultado de la ejecución del agente Stagehand |

## Notas

- Categoría: `tools`
- Tipo: `stagehand`
```

--------------------------------------------------------------------------------

````
