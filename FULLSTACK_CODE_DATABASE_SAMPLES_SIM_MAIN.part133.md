---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 133
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 133 of 933)

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

---[FILE: servicenow.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/servicenow.mdx

```text
---
title: ServiceNow
description: Crear, leer, actualizar y eliminar registros de ServiceNow
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="servicenow"
  color="#032D42"
/>

{/* MANUAL-CONTENT-START:intro */}
[ServiceNow](https://www.servicenow.com/) es una potente plataforma en la nube diseñada para optimizar y automatizar la gestión de servicios de TI (ITSM), flujos de trabajo y procesos empresariales en toda tu organización. ServiceNow te permite gestionar incidencias, solicitudes, tareas, usuarios y más utilizando su amplia API.

Con ServiceNow, puedes:

- **Automatizar flujos de trabajo de TI**: crear, leer, actualizar y eliminar registros en cualquier tabla de ServiceNow, como incidencias, tareas, solicitudes de cambio y usuarios.
- **Integrar sistemas**: conectar ServiceNow con tus otras herramientas y procesos para una automatización fluida.
- **Mantener una única fuente de verdad**: mantener todos tus datos de servicio y operaciones organizados y accesibles.
- **Impulsar la eficiencia operativa**: reducir el trabajo manual y mejorar la calidad del servicio con flujos de trabajo personalizables y automatización.

En Sim, la integración de ServiceNow permite que tus agentes interactúen directamente con tu instancia de ServiceNow como parte de sus flujos de trabajo. Los agentes pueden crear, leer, actualizar o eliminar registros en cualquier tabla de ServiceNow y aprovechar datos de tickets o usuarios para automatización y toma de decisiones sofisticadas. Esta integración conecta tu automatización de flujos de trabajo y operaciones de TI, permitiendo que tus agentes gestionen solicitudes de servicio, incidencias, usuarios y activos sin intervención manual. Al conectar Sim con ServiceNow, puedes automatizar tareas de gestión de servicios, mejorar los tiempos de respuesta y garantizar un acceso consistente y seguro a los datos de servicio vitales de tu organización.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra ServiceNow en tu flujo de trabajo. Crea, lee, actualiza y elimina registros en cualquier tabla de ServiceNow, incluyendo incidencias, tareas, solicitudes de cambio, usuarios y más.

## Herramientas

### `servicenow_create_record`

Crear un nuevo registro en una tabla de ServiceNow

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Sí | URL de la instancia de ServiceNow \(p. ej., https://instance.service-now.com\) |
| `username` | string | Sí | Nombre de usuario de ServiceNow |
| `password` | string | Sí | Contraseña de ServiceNow |
| `tableName` | string | Sí | Nombre de la tabla \(p. ej., incident, task, sys_user\) |
| `fields` | json | Sí | Campos a establecer en el registro \(objeto JSON\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `record` | json | Registro de ServiceNow creado con sys_id y otros campos |
| `metadata` | json | Metadatos de la operación |

### `servicenow_read_record`

Leer registros de una tabla de ServiceNow

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Sí | URL de la instancia de ServiceNow \(p. ej., https://instance.service-now.com\) |
| `username` | string | Sí | Nombre de usuario de ServiceNow |
| `password` | string | Sí | Contraseña de ServiceNow |
| `tableName` | string | Sí | Nombre de la tabla |
| `sysId` | string | No | sys_id del registro específico |
| `number` | string | No | Número de registro \(p. ej., INC0010001\) |
| `query` | string | No | Cadena de consulta codificada \(p. ej., "active=true^priority=1"\) |
| `limit` | number | No | Número máximo de registros a devolver |
| `fields` | string | No | Lista de campos separados por comas a devolver |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `records` | array | Array de registros de ServiceNow |
| `metadata` | json | Metadatos de la operación |

### `servicenow_update_record`

Actualiza un registro existente en una tabla de ServiceNow

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Sí | URL de la instancia de ServiceNow \(ej., https://instance.service-now.com\) |
| `username` | string | Sí | Nombre de usuario de ServiceNow |
| `password` | string | Sí | Contraseña de ServiceNow |
| `tableName` | string | Sí | Nombre de la tabla |
| `sysId` | string | Sí | sys_id del registro a actualizar |
| `fields` | json | Sí | Campos a actualizar \(objeto JSON\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `record` | json | Registro de ServiceNow actualizado |
| `metadata` | json | Metadatos de la operación |

### `servicenow_delete_record`

Elimina un registro de una tabla de ServiceNow

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Sí | URL de la instancia de ServiceNow \(ej., https://instance.service-now.com\) |
| `username` | string | Sí | Nombre de usuario de ServiceNow |
| `password` | string | Sí | Contraseña de ServiceNow |
| `tableName` | string | Sí | Nombre de la tabla |
| `sysId` | string | Sí | sys_id del registro a eliminar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la eliminación fue exitosa |
| `metadata` | json | Metadatos de la operación |

## Notas

- Categoría: `tools`
- Tipo: `servicenow`
```

--------------------------------------------------------------------------------

---[FILE: sftp.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/sftp.mdx

```text
---
title: SFTP
description: Transferir archivos a través de SFTP (Protocolo de transferencia de
  archivos SSH)
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sftp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SFTP (Protocolo de transferencia de archivos SSH)](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol) es un protocolo de red seguro que te permite subir, descargar y gestionar archivos en servidores remotos. SFTP opera sobre SSH, lo que lo hace ideal para transferencias de archivos automatizadas y cifradas, así como para la gestión remota de archivos dentro de flujos de trabajo modernos.

Con las herramientas SFTP integradas en Sim, puedes automatizar fácilmente el movimiento de archivos entre tus agentes de IA y sistemas o servidores externos. Esto permite a tus agentes gestionar intercambios críticos de datos, copias de seguridad, generación de documentos y orquestación de sistemas remotos, todo con una seguridad robusta.

**Funcionalidades clave disponibles a través de las herramientas SFTP:**

- **Subir archivos:** Transfiere sin problemas archivos de cualquier tipo desde tu flujo de trabajo a un servidor remoto, con soporte tanto para autenticación por contraseña como por clave privada SSH.
- **Descargar archivos:** Recupera archivos de servidores SFTP remotos directamente para su procesamiento, archivo o automatización adicional.
- **Listar y gestionar archivos:** Enumera directorios, elimina o crea archivos y carpetas, y gestiona permisos del sistema de archivos de forma remota.
- **Autenticación flexible:** Conéctate usando contraseñas tradicionales o claves SSH, con soporte para frases de contraseña y control de permisos.
- **Soporte para archivos grandes:** Gestiona programáticamente cargas y descargas de archivos grandes, con límites de tamaño incorporados para mayor seguridad.

Al integrar SFTP en Sim, puedes automatizar operaciones seguras de archivos como parte de cualquier flujo de trabajo, ya sea recopilación de datos, informes, mantenimiento de sistemas remotos o intercambio dinámico de contenido entre plataformas.

Las secciones a continuación describen las principales herramientas SFTP disponibles:

- **sftp_upload:** Sube uno o más archivos a un servidor remoto.
- **sftp_download:** Descarga archivos desde un servidor remoto a tu flujo de trabajo.
- **sftp_list:** Lista el contenido de directorios en un servidor SFTP remoto.
- **sftp_delete:** Elimina archivos o directorios de un servidor remoto.
- **sftp_create:** Crea nuevos archivos en un servidor SFTP remoto.
- **sftp_mkdir:** Crea nuevos directorios de forma remota.

Consulta la documentación de la herramienta a continuación para conocer los parámetros detallados de entrada y salida para cada operación.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Sube, descarga, lista y gestiona archivos en servidores remotos a través de SFTP. Compatible con autenticación por contraseña y clave privada para transferencias seguras de archivos.

## Herramientas

### `sftp_upload`

Subir archivos a un servidor SFTP remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SFTP |
| `port` | number | Sí | Puerto del servidor SFTP \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SFTP |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `remotePath` | string | Sí | Directorio de destino en el servidor remoto |
| `files` | file[] | No | Archivos para subir |
| `fileContent` | string | No | Contenido directo del archivo para subir \(para archivos de texto\) |
| `fileName` | string | No | Nombre del archivo cuando se usa contenido directo |
| `overwrite` | boolean | No | Si se deben sobrescribir archivos existentes \(predeterminado: true\) |
| `permissions` | string | No | Permisos del archivo \(p. ej., 0644\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la subida fue exitosa |
| `uploadedFiles` | json | Array de detalles de archivos subidos \(nombre, rutaRemota, tamaño\) |
| `message` | string | Mensaje de estado de la operación |

### `sftp_download`

Descargar un archivo desde un servidor SFTP remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SFTP |
| `port` | number | Sí | Puerto del servidor SFTP \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SFTP |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `remotePath` | string | Sí | Ruta al archivo en el servidor remoto |
| `encoding` | string | No | Codificación de salida: utf-8 para texto, base64 para binario \(predeterminado: utf-8\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la descarga fue exitosa |
| `fileName` | string | Nombre del archivo descargado |
| `content` | string | Contenido del archivo \(texto o codificado en base64\) |
| `size` | number | Tamaño del archivo en bytes |
| `encoding` | string | Codificación del contenido \(utf-8 o base64\) |
| `message` | string | Mensaje de estado de la operación |

### `sftp_list`

Listar archivos y directorios en un servidor SFTP remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SFTP |
| `port` | number | Sí | Puerto del servidor SFTP \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SFTP |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `remotePath` | string | Sí | Ruta del directorio en el servidor remoto |
| `detailed` | boolean | No | Incluir información detallada de archivos \(tamaño, permisos, fecha de modificación\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la operación fue exitosa |
| `path` | string | Ruta del directorio que fue listado |
| `entries` | json | Array de entradas del directorio con nombre, tipo, tamaño, permisos, modifiedAt |
| `count` | number | Número de entradas en el directorio |
| `message` | string | Mensaje de estado de la operación |

### `sftp_delete`

Eliminar un archivo o directorio en un servidor SFTP remoto

#### Entrada

| Parámetro | Tipo | Requerido | Descripción |
| --------- | ---- | -------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SFTP |
| `port` | number | Sí | Puerto del servidor SFTP \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SFTP |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `remotePath` | string | Sí | Ruta al archivo o directorio a eliminar |
| `recursive` | boolean | No | Eliminar directorios recursivamente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la eliminación fue exitosa |
| `deletedPath` | string | Ruta que fue eliminada |
| `message` | string | Mensaje de estado de la operación |

### `sftp_mkdir`

Crear un directorio en un servidor SFTP remoto

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `host` | string | Sí | Nombre de host o dirección IP del servidor SFTP |
| `port` | number | Sí | Puerto del servidor SFTP \(predeterminado: 22\) |
| `username` | string | Sí | Nombre de usuario SFTP |
| `password` | string | No | Contraseña para autenticación \(si no se usa clave privada\) |
| `privateKey` | string | No | Clave privada para autenticación \(formato OpenSSH\) |
| `passphrase` | string | No | Frase de contraseña para clave privada cifrada |
| `remotePath` | string | Sí | Ruta para el nuevo directorio |
| `recursive` | boolean | No | Crear directorios principales si no existen |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si el directorio se creó correctamente |
| `createdPath` | string | Ruta del directorio creado |
| `message` | string | Mensaje de estado de la operación |

## Notas

- Categoría: `tools`
- Tipo: `sftp`
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/sharepoint.mdx

```text
---
title: Sharepoint
description: Trabajar con páginas y listas
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sharepoint"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration) es una plataforma colaborativa de Microsoft que permite a los usuarios crear y gestionar sitios web internos, compartir documentos y organizar recursos de equipo. Proporciona una solución potente y flexible para crear espacios de trabajo digitales y agilizar la gestión de contenidos en las organizaciones.

Con SharePoint, puedes:

- **Crear sitios de equipo y comunicación**: Configura páginas y portales para facilitar la colaboración, anuncios y distribución de contenido
- **Organizar y compartir contenido**: Almacena documentos, gestiona archivos y habilita el control de versiones con capacidades seguras de compartición
- **Personalizar páginas**: Añade partes de texto para adaptar cada sitio a las necesidades de tu equipo
- **Mejorar la capacidad de descubrimiento**: Utiliza herramientas de metadatos, búsqueda y navegación para ayudar a los usuarios a encontrar rápidamente lo que necesitan
- **Colaborar de forma segura**: Controla el acceso con configuraciones robustas de permisos e integración con Microsoft 365

En Sim, la integración con SharePoint permite a tus agentes crear y acceder a sitios y páginas de SharePoint como parte de sus flujos de trabajo. Esto facilita la gestión automatizada de documentos, el intercambio de conocimientos y la creación de espacios de trabajo sin esfuerzo manual. Los agentes pueden generar nuevas páginas de proyectos, cargar o recuperar archivos y organizar recursos de forma dinámica, basándose en las entradas del flujo de trabajo. Al conectar Sim con SharePoint, incorporas la colaboración estructurada y la gestión de contenidos en tus flujos de automatización, dando a tus agentes la capacidad de coordinar actividades de equipo, mostrar información clave y mantener una única fuente de verdad en toda tu organización.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra SharePoint en el flujo de trabajo. Lee/crea páginas, enumera sitios y trabaja con listas (leer, crear, actualizar elementos). Requiere OAuth.

## Herramientas

### `sharepoint_create_page`

Crear una nueva página en un sitio de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | No | El ID del sitio de SharePoint \(uso interno\) |
| `siteSelector` | string | No | Seleccionar el sitio de SharePoint |
| `pageName` | string | Sí | El nombre de la página a crear |
| `pageTitle` | string | No | El título de la página \(por defecto es el nombre de la página si no se proporciona\) |
| `pageContent` | string | No | El contenido de la página |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `page` | object | Información de la página de SharePoint creada |

### `sharepoint_read_page`

Leer una página específica de un sitio de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Seleccionar el sitio de SharePoint |
| `siteId` | string | No | El ID del sitio de SharePoint \(uso interno\) |
| `pageId` | string | No | El ID de la página a leer |
| `pageName` | string | No | El nombre de la página a leer \(alternativa a pageId\) |
| `maxPages` | number | No | Número máximo de páginas a devolver cuando se listan todas las páginas \(predeterminado: 10, máximo: 50\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `page` | objeto | Información sobre la página de SharePoint |

### `sharepoint_list_sites`

Listar detalles de todos los sitios de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | cadena | No | Seleccionar el sitio de SharePoint |
| `groupId` | cadena | No | El ID del grupo para acceder a un sitio de equipo de grupo |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `site` | objeto | Información sobre el sitio actual de SharePoint |

### `sharepoint_create_list`

Crear una nueva lista en un sitio de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | No | El ID del sitio de SharePoint \(uso interno\) |
| `siteSelector` | string | No | Seleccionar el sitio de SharePoint |
| `listDisplayName` | string | Sí | Nombre visible de la lista a crear |
| `listDescription` | string | No | Descripción de la lista |
| `listTemplate` | string | No | Nombre de la plantilla de lista \(p. ej., 'genericList'\) |
| `pageContent` | string | No | JSON opcional de columnas. Puede ser un array de nivel superior de definiciones de columnas o un objeto con \{ columns: \[...\] \}. |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `list` | object | Información de la lista de SharePoint creada |

### `sharepoint_get_list`

Obtener metadatos (y opcionalmente columnas/elementos) de una lista de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Seleccionar el sitio de SharePoint |
| `siteId` | string | No | El ID del sitio de SharePoint \(uso interno\) |
| `listId` | string | No | El ID de la lista a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `list` | objeto | Información sobre la lista de SharePoint |

### `sharepoint_update_list`

Actualizar las propiedades (campos) de un elemento de lista de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | cadena | No | Seleccionar el sitio de SharePoint |
| `siteId` | cadena | No | El ID del sitio de SharePoint \(uso interno\) |
| `listId` | cadena | No | El ID de la lista que contiene el elemento |
| `itemId` | cadena | Sí | El ID del elemento de lista a actualizar |
| `listItemFields` | objeto | Sí | Valores de campo para actualizar en el elemento de lista |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `item` | objeto | Elemento de lista de SharePoint actualizado |

### `sharepoint_add_list_items`

Añadir un nuevo elemento a una lista de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | cadena | No | Seleccionar el sitio de SharePoint |
| `siteId` | cadena | No | El ID del sitio de SharePoint \(uso interno\) |
| `listId` | cadena | Sí | El ID de la lista a la que añadir el elemento |
| `listItemFields` | objeto | Sí | Valores de campo para el nuevo elemento de lista |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `item` | object | Elemento de lista de SharePoint creado |

### `sharepoint_upload_file`

Subir archivos a una biblioteca de documentos de SharePoint

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `siteId` | cadena | No | El ID del sitio de SharePoint |
| `driveId` | cadena | No | El ID de la biblioteca de documentos \(unidad\). Si no se proporciona, usa la unidad predeterminada. |
| `folderPath` | cadena | No | Ruta de carpeta opcional dentro de la biblioteca de documentos \(p. ej., /Documents/Subfolder\) |
| `fileName` | cadena | No | Opcional: sobrescribir el nombre del archivo subido |
| `files` | archivo[] | No | Archivos para subir a SharePoint |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `uploadedFiles` | array | Array de objetos de archivos subidos |

## Notas

- Categoría: `tools`
- Tipo: `sharepoint`
```

--------------------------------------------------------------------------------

---[FILE: shopify.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/shopify.mdx

```text
---
title: Shopify
description: Gestiona productos, pedidos, clientes e inventario en tu tienda Shopify
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="shopify"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Shopify](https://www.shopify.com/) es una plataforma líder de comercio electrónico diseñada para ayudar a los comerciantes a construir, administrar y hacer crecer sus tiendas en línea. Shopify facilita la gestión de todos los aspectos de tu tienda, desde productos e inventario hasta pedidos y clientes.

Con Shopify en Sim, tus agentes pueden:

- **Crear y gestionar productos**: Añadir nuevos productos, actualizar detalles de productos y eliminar productos de tu tienda.
- **Listar y recuperar pedidos**: Obtener información sobre los pedidos de los clientes, incluyendo filtrado y gestión de pedidos.
- **Gestionar clientes**: Acceder y actualizar detalles de clientes, o añadir nuevos clientes a tu tienda.
- **Ajustar niveles de inventario**: Cambiar programáticamente los niveles de stock de productos para mantener tu inventario preciso.

Utiliza la integración de Shopify en Sim para automatizar flujos de trabajo comunes de gestión de tiendas, como sincronizar inventario, cumplir pedidos o gestionar listados, directamente desde tus automatizaciones. Permite a tus agentes acceder, actualizar y organizar todos los datos de tu tienda utilizando herramientas simples y programáticas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Shopify en tu flujo de trabajo. Gestiona productos, pedidos, clientes e inventario. Crea, lee, actualiza y elimina productos. Lista y gestiona pedidos. Maneja datos de clientes y ajusta niveles de inventario.

## Herramientas

### `shopify_create_product`

Crear un nuevo producto en tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `title` | string | Sí | Título del producto |
| `descriptionHtml` | string | No | Descripción del producto \(HTML\) |
| `vendor` | string | No | Proveedor/marca del producto |
| `productType` | string | No | Tipo/categoría del producto |
| `tags` | array | No | Etiquetas del producto |
| `status` | string | No | Estado del producto \(ACTIVE, DRAFT, ARCHIVED\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `product` | object | El producto creado |

### `shopify_get_product`

Obtener un solo producto por ID de tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `productId` | string | Sí | ID del producto \(gid://shopify/Product/123456789\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `product` | object | Los detalles del producto |

### `shopify_list_products`

Listar productos de tu tienda Shopify con filtrado opcional

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `first` | number | No | Número de productos a devolver \(predeterminado: 50, máximo: 250\) |
| `query` | string | No | Consulta de búsqueda para filtrar productos \(p. ej., "title:camisa" o "vendor:Nike" o "status:active"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `products` | array | Lista de productos |
| `pageInfo` | object | Información de paginación |

### `shopify_update_product`

Actualizar un producto existente en tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `productId` | string | Sí | ID del producto a actualizar \(gid://shopify/Product/123456789\) |
| `title` | string | No | Nuevo título del producto |
| `descriptionHtml` | string | No | Nueva descripción del producto \(HTML\) |
| `vendor` | string | No | Nuevo proveedor/marca del producto |
| `productType` | string | No | Nuevo tipo/categoría del producto |
| `tags` | array | No | Nuevas etiquetas del producto |
| `status` | string | No | Nuevo estado del producto \(ACTIVE, DRAFT, ARCHIVED\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `product` | objeto | El producto actualizado |

### `shopify_delete_product`

Eliminar un producto de tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `productId` | string | Sí | ID del producto a eliminar \(gid://shopify/Product/123456789\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deletedId` | string | El ID del producto eliminado |

### `shopify_get_order`

Obtener un pedido individual por ID de tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `orderId` | string | Sí | ID del pedido \(gid://shopify/Order/123456789\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | objeto | Los detalles del pedido |

### `shopify_list_orders`

Listar pedidos de tu tienda Shopify con filtrado opcional

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `first` | number | No | Número de pedidos a devolver \(predeterminado: 50, máximo: 250\) |
| `status` | string | No | Filtrar por estado del pedido \(abierto, cerrado, cancelado, cualquiera\) |
| `query` | string | No | Consulta de búsqueda para filtrar pedidos \(p. ej., "financial_status:paid" o "fulfillment_status:unfulfilled" o "email:customer@example.com"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `orders` | array | Lista de pedidos |
| `pageInfo` | object | Información de paginación |

### `shopify_update_order`

Actualizar un pedido existente en tu tienda Shopify (nota, etiquetas, correo electrónico)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `orderId` | string | Sí | ID del pedido a actualizar \(gid://shopify/Order/123456789\) |
| `note` | string | No | Nueva nota del pedido |
| `tags` | array | No | Nuevas etiquetas del pedido |
| `email` | string | No | Nuevo correo electrónico del cliente para el pedido |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | object | El pedido actualizado |

### `shopify_cancel_order`

Cancelar un pedido en tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `orderId` | string | Sí | ID del pedido a cancelar \(gid://shopify/Order/123456789\) |
| `reason` | string | Sí | Motivo de cancelación \(CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER\) |
| `notifyCustomer` | boolean | No | Si se debe notificar al cliente sobre la cancelación |
| `refund` | boolean | No | Si se debe reembolsar el pedido |
| `restock` | boolean | No | Si se debe reponer el inventario |
| `staffNote` | string | No | Una nota sobre la cancelación para referencia del personal |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `order` | object | El resultado de la cancelación |

### `shopify_create_customer`

Crear un nuevo cliente en tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `email` | string | No | Dirección de correo electrónico del cliente |
| `firstName` | string | No | Nombre del cliente |
| `lastName` | string | No | Apellido del cliente |
| `phone` | string | No | Número de teléfono del cliente |
| `note` | string | No | Nota sobre el cliente |
| `tags` | array | No | Etiquetas del cliente |
| `addresses` | array | No | Direcciones del cliente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `customer` | object | El cliente creado |

### `shopify_get_customer`

Obtener un solo cliente por ID de tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `customerId` | string | Sí | ID del cliente \(gid://shopify/Customer/123456789\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `customer` | object | Los detalles del cliente |

### `shopify_list_customers`

Lista los clientes de tu tienda Shopify con filtrado opcional

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `first` | number | No | Número de clientes a devolver \(predeterminado: 50, máximo: 250\) |
| `query` | string | No | Consulta de búsqueda para filtrar clientes \(ej., "first_name:John" o "last_name:Smith" o "email:*@gmail.com" o "tag:vip"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `customers` | array | Lista de clientes |
| `pageInfo` | object | Información de paginación |

### `shopify_update_customer`

Actualiza un cliente existente en tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `customerId` | string | Sí | ID del cliente a actualizar \(gid://shopify/Customer/123456789\) |
| `email` | string | No | Nueva dirección de correo electrónico del cliente |
| `firstName` | string | No | Nuevo nombre del cliente |
| `lastName` | string | No | Nuevo apellido del cliente |
| `phone` | string | No | Nuevo número de teléfono del cliente |
| `note` | string | No | Nueva nota sobre el cliente |
| `tags` | array | No | Nuevas etiquetas del cliente |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `customer` | object | El cliente actualizado |

### `shopify_delete_customer`

Eliminar un cliente de tu tienda Shopify

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `customerId` | string | Sí | ID del cliente a eliminar \(gid://shopify/Customer/123456789\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `deletedId` | string | El ID del cliente eliminado |

### `shopify_list_inventory_items`

Listar artículos de inventario de tu tienda Shopify. Utiliza esto para encontrar IDs de artículos de inventario por SKU.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `first` | number | No | Número de artículos de inventario a devolver \(predeterminado: 50, máximo: 250\) |
| `query` | string | No | Consulta de búsqueda para filtrar artículos de inventario \(ej., "sku:ABC123"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `inventoryItems` | array | Lista de artículos de inventario con sus IDs, SKUs y niveles de stock |
| `pageInfo` | object | Información de paginación |

### `shopify_get_inventory_level`

Obtener nivel de inventario para una variante de producto en una ubicación específica

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `inventoryItemId` | string | Sí | ID del artículo de inventario \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | string | No | ID de ubicación para filtrar \(opcional\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | Los detalles del nivel de inventario |

### `shopify_adjust_inventory`

Ajustar la cantidad de inventario para una variante de producto en una ubicación específica

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `inventoryItemId` | string | Sí | ID del artículo de inventario \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | string | Sí | ID de ubicación \(gid://shopify/Location/123456789\) |
| `delta` | number | Sí | Cantidad a ajustar \(positivo para aumentar, negativo para disminuir\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | El resultado del ajuste de inventario |

### `shopify_list_locations`

Listar ubicaciones de inventario de tu tienda Shopify. Utiliza esto para encontrar los IDs de ubicación necesarios para operaciones de inventario.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `first` | number | No | Número de ubicaciones a devolver \(predeterminado: 50, máximo: 250\) |
| `includeInactive` | boolean | No | Si se deben incluir ubicaciones desactivadas \(predeterminado: false\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `locations` | array | Lista de ubicaciones con sus IDs, nombres y direcciones |
| `pageInfo` | object | Información de paginación |

### `shopify_create_fulfillment`

Crea un envío para marcar los artículos del pedido como enviados. Requiere un ID de orden de envío (obtén esto desde los detalles del pedido).

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `fulfillmentOrderId` | string | Sí | El ID de la orden de envío \(ej., gid://shopify/FulfillmentOrder/123456789\) |
| `trackingNumber` | string | No | Número de seguimiento para el envío |
| `trackingCompany` | string | No | Nombre del transportista \(ej., UPS, FedEx, USPS, DHL\) |
| `trackingUrl` | string | No | URL para rastrear el envío |
| `notifyCustomer` | boolean | No | Si se debe enviar un correo electrónico de confirmación de envío al cliente \(predeterminado: true\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `fulfillment` | object | El envío creado con información de seguimiento y artículos enviados |

### `shopify_list_collections`

Lista las colecciones de productos de tu tienda Shopify. Filtra por título, tipo (personalizada/inteligente) o identificador.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(ej., mitienda.myshopify.com\) |
| `first` | number | No | Número de colecciones a devolver \(predeterminado: 50, máx: 250\) |
| `query` | string | No | Consulta de búsqueda para filtrar colecciones \(ej., "title:Verano" o "collection_type:smart"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `collections` | array | Lista de colecciones con sus IDs, títulos y recuentos de productos |
| `pageInfo` | object | Información de paginación |

### `shopify_get_collection`

Obtén una colección específica por ID, incluyendo sus productos. Usa esto para recuperar productos dentro de una colección.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Sí | El dominio de tu tienda Shopify \(p. ej., mitienda.myshopify.com\) |
| `collectionId` | string | Sí | El ID de la colección \(p. ej., gid://shopify/Collection/123456789\) |
| `productsFirst` | number | No | Número de productos a devolver de esta colección \(predeterminado: 50, máx: 250\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `collection` | object | Los detalles de la colección incluyendo sus productos |

## Notas

- Categoría: `tools`
- Tipo: `shopify`
```

--------------------------------------------------------------------------------

````
