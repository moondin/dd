---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 103
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 103 of 933)

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

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/knowledgebase/index.mdx

```text
---
title: Descripción general
description: Sube, procesa y busca a través de tus documentos con búsqueda
  vectorial inteligente y fragmentación
---

import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

La base de conocimientos te permite cargar, procesar y buscar a través de tus documentos con búsqueda vectorial inteligente y fragmentación. Los documentos de varios tipos se procesan, incorporan y hacen buscables automáticamente. Tus documentos se fragmentan de manera inteligente, y puedes verlos, editarlos y buscar a través de ellos utilizando consultas en lenguaje natural.

## Carga y procesamiento

Simplemente carga tus documentos para comenzar. Sim los procesa automáticamente en segundo plano, extrayendo texto, creando incrustaciones y dividiéndolos en fragmentos buscables.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-1.mp4" width={700} height={450} />
</div>

El sistema maneja todo el proceso por ti:

1. **Extracción de texto**: El contenido se extrae de tus documentos utilizando analizadores especializados para cada tipo de archivo
2. **Fragmentación inteligente**: Los documentos se dividen en fragmentos significativos con tamaño y superposición configurables
3. **Generación de incrustaciones**: Se crean incrustaciones vectoriales para capacidades de búsqueda semántica
4. **Estado del procesamiento**: Sigue el progreso mientras tus documentos son procesados

## Tipos de archivos compatibles

Sim admite archivos PDF, Word (DOC/DOCX), texto plano (TXT), Markdown (MD), HTML, Excel (XLS/XLSX), PowerPoint (PPT/PPTX) y CSV. Los archivos pueden tener hasta 100MB cada uno, con un rendimiento óptimo para archivos de menos de 50MB. Puedes cargar múltiples documentos simultáneamente, y los archivos PDF incluyen procesamiento OCR para documentos escaneados.

## Visualización y edición de fragmentos

Una vez que tus documentos están procesados, puedes ver y editar los fragmentos individuales. Esto te da control total sobre cómo se organiza y busca tu contenido.

<Image src="/static/knowledgebase/knowledgebase.png" alt="Vista de fragmentos de documentos mostrando contenido procesado" width={800} height={500} />

### Configuración de fragmentos
- **Tamaño predeterminado del fragmento**: 1.024 caracteres
- **Rango configurable**: 100-4.000 caracteres por fragmento
- **Superposición inteligente**: 200 caracteres por defecto para preservar el contexto
- **División jerárquica**: Respeta la estructura del documento (secciones, párrafos, oraciones)

### Capacidades de edición
- **Editar contenido de fragmentos**: Modificar el contenido de texto de fragmentos individuales
- **Ajustar límites de fragmentos**: Fusionar o dividir fragmentos según sea necesario
- **Añadir metadatos**: Mejorar fragmentos con contexto adicional
- **Operaciones masivas**: Gestionar múltiples fragmentos de manera eficiente

## Procesamiento avanzado de PDF

Para documentos PDF, Sim ofrece capacidades de procesamiento mejoradas:

### Soporte OCR
Cuando se configura con Azure o [Mistral OCR](https://docs.mistral.ai/ocr/):
- **Procesamiento de documentos escaneados**: Extraer texto de PDFs basados en imágenes
- **Manejo de contenido mixto**: Procesar PDFs con texto e imágenes
- **Alta precisión**: Modelos avanzados de IA aseguran una extracción precisa del texto

## Uso del bloque de conocimiento en flujos de trabajo

Una vez que tus documentos son procesados, puedes utilizarlos en tus flujos de trabajo de IA a través del bloque de Conocimiento. Esto permite la Generación Aumentada por Recuperación (RAG), permitiendo a tus agentes de IA acceder y razonar sobre el contenido de tus documentos para proporcionar respuestas más precisas y contextuales.

<Image src="/static/knowledgebase/knowledgebase-2.png" alt="Uso del bloque de conocimiento en flujos de trabajo" width={800} height={500} />

### Características del bloque de conocimiento
- **Búsqueda semántica**: Encontrar contenido relevante usando consultas en lenguaje natural
- **Integración de contexto**: Incluir automáticamente fragmentos relevantes en los prompts del agente
- **Recuperación dinámica**: La búsqueda ocurre en tiempo real durante la ejecución del flujo de trabajo
- **Puntuación de relevancia**: Resultados clasificados por similitud semántica

### Opciones de integración
- **Prompts del sistema**: Proporcionar contexto a tus agentes de IA
- **Contexto dinámico**: Buscar e incluir información relevante durante las conversaciones
- **Búsqueda multi-documento**: Consultar a través de toda tu base de conocimiento
- **Búsqueda filtrada**: Combinar con etiquetas para una recuperación precisa de contenido

## Tecnología de búsqueda vectorial

Sim utiliza búsqueda vectorial impulsada por [pgvector](https://github.com/pgvector/pgvector) para entender el significado y contexto de tu contenido:

### Comprensión semántica
- **Búsqueda contextual**: Encuentra contenido relevante incluso cuando las palabras clave exactas no coinciden
- **Recuperación basada en conceptos**: Comprende las relaciones entre ideas
- **Soporte multilingüe**: Funciona en diferentes idiomas
- **Reconocimiento de sinónimos**: Encuentra términos y conceptos relacionados

### Capacidades de búsqueda
- **Consultas en lenguaje natural**: Haz preguntas en español simple
- **Búsqueda por similitud**: Encuentra contenido conceptualmente similar
- **Búsqueda híbrida**: Combina búsqueda vectorial y tradicional por palabras clave
- **Resultados configurables**: Controla el número y umbral de relevancia de los resultados

## Gestión de documentos

### Características de organización
- **Carga masiva**: Sube múltiples archivos a la vez mediante la API asíncrona
- **Estado de procesamiento**: Actualizaciones en tiempo real sobre el procesamiento de documentos
- **Búsqueda y filtrado**: Encuentra documentos rápidamente en grandes colecciones
- **Seguimiento de metadatos**: Captura automática de información de archivos y detalles de procesamiento

### Seguridad y privacidad
- **Almacenamiento seguro**: Documentos almacenados con seguridad de nivel empresarial
- **Control de acceso**: Permisos basados en espacios de trabajo
- **Aislamiento de procesamiento**: Cada espacio de trabajo tiene procesamiento de documentos aislado
- **Retención de datos**: Configura políticas de retención de documentos

## Primeros pasos

1. **Navega a tu base de conocimiento**: Accede desde la barra lateral de tu espacio de trabajo
2. **Sube documentos**: Arrastra y suelta o selecciona archivos para subir
3. **Monitorea el procesamiento**: Observa cómo se procesan y dividen los documentos
4. **Explora fragmentos**: Visualiza y edita el contenido procesado
5. **Añade a flujos de trabajo**: Usa el bloque de Conocimiento para integrarlo con tus agentes de IA

La base de conocimiento transforma tus documentos estáticos en un recurso inteligente y consultable que tus flujos de trabajo de IA pueden aprovechar para obtener respuestas más informadas y contextuales.
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/es/knowledgebase/tags.mdx

```text
---
title: Etiquetas y filtrado
---

import { Video } from '@/components/ui/video'

Las etiquetas proporcionan una forma poderosa de organizar tus documentos y crear filtros precisos para tus búsquedas vectoriales. Al combinar el filtrado basado en etiquetas con la búsqueda semántica, puedes recuperar exactamente el contenido que necesitas de tu base de conocimientos.

## Añadir etiquetas a documentos

Puedes añadir etiquetas personalizadas a cualquier documento en tu base de conocimientos para organizar y categorizar tu contenido para una recuperación más fácil.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag.mp4" width={700} height={450} />
</div>

### Gestión de etiquetas
- **Etiquetas personalizadas**: Crea tu propio sistema de etiquetas que se adapte a tu flujo de trabajo
- **Múltiples etiquetas por documento**: Aplica tantas etiquetas como necesites a cada documento, hay 7 espacios para etiquetas disponibles por base de conocimientos que son compartidos por todos los documentos en la base de conocimientos
- **Organización de etiquetas**: Agrupa documentos relacionados con un etiquetado consistente

### Mejores prácticas para etiquetas
- **Nomenclatura consistente**: Usa nombres de etiquetas estandarizados en todos tus documentos
- **Etiquetas descriptivas**: Utiliza nombres de etiquetas claros y significativos
- **Limpieza regular**: Elimina periódicamente las etiquetas no utilizadas u obsoletas

## Uso de etiquetas en bloques de conocimiento

Las etiquetas se vuelven poderosas cuando se combinan con el bloque de Conocimiento en tus flujos de trabajo. Puedes filtrar tus búsquedas a contenido específico etiquetado, asegurando que tus agentes de IA obtengan la información más relevante.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag2.mp4" width={700} height={450} />
</div>

## Modos de búsqueda

El bloque de Conocimiento admite tres modos diferentes de búsqueda dependiendo de lo que proporciones:

### 1. Búsqueda solo por etiquetas
Cuando **solo proporcionas etiquetas** (sin consulta de búsqueda):
- **Recuperación directa**: Obtiene todos los documentos que tienen las etiquetas especificadas
- **Sin búsqueda vectorial**: Los resultados se basan puramente en la coincidencia de etiquetas
- **Rendimiento rápido**: Recuperación rápida sin procesamiento semántico
- **Coincidencia exacta**: Solo se devuelven documentos con todas las etiquetas especificadas

**Caso de uso**: Cuando necesitas todos los documentos de una categoría o proyecto específico

### 2. Solo búsqueda vectorial
Cuando **solo proporcionas una consulta de búsqueda** (sin etiquetas):
- **Búsqueda semántica**: Encuentra contenido basado en significado y contexto
- **Base de conocimiento completa**: Busca en todos los documentos
- **Clasificación por relevancia**: Resultados ordenados por similitud semántica
- **Lenguaje natural**: Usa preguntas o frases para encontrar contenido relevante

**Caso de uso**: Cuando necesitas el contenido más relevante independientemente de la organización

### 3. Combinación de filtrado por etiquetas + búsqueda vectorial
Cuando **proporcionas tanto etiquetas como una consulta de búsqueda**:
1. **Primero**: Filtra documentos solo a aquellos con las etiquetas especificadas
2. **Luego**: Realiza una búsqueda vectorial dentro de ese subconjunto filtrado
3. **Resultado**: Contenido semánticamente relevante solo de tus documentos etiquetados

**Caso de uso**: Cuando necesitas contenido relevante de una categoría o proyecto específico

### Configuración de búsqueda

#### Filtrado por etiquetas
- **Múltiples etiquetas**: Usa múltiples etiquetas para lógica OR (el documento debe tener una o más de las etiquetas)
- **Combinaciones de etiquetas**: Mezcla diferentes tipos de etiquetas para un filtrado preciso
- **Sensibilidad a mayúsculas**: La coincidencia de etiquetas no distingue entre mayúsculas y minúsculas
- **Coincidencia parcial**: Se requiere coincidencia exacta del nombre de la etiqueta

#### Parámetros de búsqueda vectorial
- **Complejidad de consulta**: Las preguntas en lenguaje natural funcionan mejor
- **Límites de resultados**: Configura cuántos fragmentos recuperar
- **Umbral de relevancia**: Establece puntuaciones mínimas de similitud
- **Ventana de contexto**: Ajusta el tamaño del fragmento para tu caso de uso

## Integración con flujos de trabajo

### Configuración del bloque de conocimiento
1. **Seleccionar base de conocimiento**: Elige qué base de conocimiento buscar
2. **Añadir etiquetas**: Especifica etiquetas de filtrado (opcional)
3. **Introducir consulta**: Añade tu consulta de búsqueda (opcional)
4. **Configurar resultados**: Establece el número de fragmentos a recuperar
5. **Probar búsqueda**: Vista previa de resultados antes de usar en el flujo de trabajo

### Uso dinámico de etiquetas
- **Etiquetas variables**: Usa variables de flujo de trabajo como valores de etiquetas
- **Filtrado condicional**: Aplica diferentes etiquetas según la lógica del flujo de trabajo
- **Búsqueda contextual**: Ajusta las etiquetas según el contexto de la conversación
- **Filtrado en múltiples pasos**: Refina las búsquedas a través de los pasos del flujo de trabajo

### Optimización del rendimiento
- **Filtrado eficiente**: El filtrado por etiquetas ocurre antes de la búsqueda vectorial para un mejor rendimiento
- **Almacenamiento en caché**: Las combinaciones de etiquetas utilizadas con frecuencia se almacenan en caché para mayor velocidad
- **Procesamiento paralelo**: Múltiples búsquedas de etiquetas pueden ejecutarse simultáneamente
- **Gestión de recursos**: Optimización automática de los recursos de búsqueda

## Primeros pasos con etiquetas

1. **Planifica tu estructura de etiquetas**: Decide convenciones de nomenclatura consistentes
2. **Comienza a etiquetar**: Añade etiquetas relevantes a tus documentos existentes
3. **Prueba combinaciones**: Experimenta con combinaciones de etiquetas + consultas de búsqueda
4. **Integra en flujos de trabajo**: Usa el bloque de Conocimiento con tu estrategia de etiquetado
5. **Refina con el tiempo**: Ajusta tu enfoque de etiquetado basándote en los resultados de búsqueda

Las etiquetas transforman tu base de conocimiento de un simple almacén de documentos a un sistema de inteligencia organizado con precisión que tus flujos de trabajo de IA pueden navegar con precisión quirúrgica.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/mcp/index.mdx

```text
---
title: MCP (Protocolo de Contexto de Modelo)
---

import { Image } from '@/components/ui/image'
import { Callout } from 'fumadocs-ui/components/callout'

El Protocolo de Contexto de Modelo ([MCP](https://modelcontextprotocol.com/)) te permite conectar herramientas y servicios externos utilizando un protocolo estandarizado, permitiéndote integrar APIs y servicios directamente en tus flujos de trabajo. Con MCP, puedes ampliar las capacidades de Sim añadiendo integraciones personalizadas que funcionan perfectamente con tus agentes y flujos de trabajo.

## ¿Qué es MCP?

MCP es un estándar abierto que permite a los asistentes de IA conectarse de forma segura a fuentes de datos y herramientas externas. Proporciona una forma estandarizada para:

- Conectar a bases de datos, APIs y sistemas de archivos
- Acceder a datos en tiempo real desde servicios externos
- Ejecutar herramientas y scripts personalizados
- Mantener un acceso seguro y controlado a recursos externos

## Configuración de servidores MCP

Los servidores MCP proporcionan colecciones de herramientas que tus agentes pueden utilizar. Configúralos en los ajustes del espacio de trabajo:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-1.png"
    alt="Configuración del servidor MCP en Ajustes"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Navega a los ajustes de tu espacio de trabajo
2. Ve a la sección **Servidores MCP**
3. Haz clic en **Añadir servidor MCP**
4. Introduce los detalles de configuración del servidor
5. Guarda la configuración

<Callout type="info">
También puedes configurar servidores MCP directamente desde la barra de herramientas en un bloque de Agente para una configuración rápida.
</Callout>

## Uso de herramientas MCP en agentes

Una vez que los servidores MCP están configurados, sus herramientas estarán disponibles dentro de tus bloques de agente:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-2.png"
    alt="Uso de herramienta MCP en bloque de Agente"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Abre un bloque de **Agente**
2. En la sección **Herramientas**, verás las herramientas MCP disponibles
3. Selecciona las herramientas que quieres que use el agente
4. El agente ahora puede acceder a estas herramientas durante la ejecución

## Bloque de herramienta MCP independiente

Para un control más preciso, puedes usar el bloque dedicado de Herramienta MCP para ejecutar herramientas MCP específicas:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-3.png"
    alt="Bloque de herramienta MCP independiente"
    width={700}
    height={450}
    className="my-6"
  />
</div>

El bloque de Herramienta MCP te permite:
- Ejecutar cualquier herramienta MCP configurada directamente
- Pasar parámetros específicos a la herramienta
- Usar la salida de la herramienta en pasos posteriores del flujo de trabajo
- Encadenar múltiples herramientas MCP

### Cuándo usar Herramienta MCP vs Agente

**Usa Agente con herramientas MCP cuando:**
- Quieres que la IA decida qué herramientas usar
- Necesitas un razonamiento complejo sobre cuándo y cómo usar las herramientas
- Deseas una interacción en lenguaje natural con las herramientas

**Usa el bloque Herramienta MCP cuando:**
- Necesites una ejecución determinista de herramientas
- Quieras ejecutar una herramienta específica con parámetros conocidos
- Estés construyendo flujos de trabajo estructurados con pasos predecibles

## Requisitos de permisos

La funcionalidad MCP requiere permisos específicos del espacio de trabajo:

| Acción | Permiso requerido |
|--------|-------------------|
| Configurar servidores MCP en ajustes | **Admin** |
| Usar herramientas MCP en agentes | **Write** o **Admin** |
| Ver herramientas MCP disponibles | **Read**, **Write**, o **Admin** |
| Ejecutar bloques de Herramienta MCP | **Write** o **Admin** |

## Casos de uso comunes

### Integración con bases de datos
Conéctate a bases de datos para consultar, insertar o actualizar datos dentro de tus flujos de trabajo.

### Integraciones de API
Accede a APIs externas y servicios web que no tienen integraciones incorporadas en Sim.

### Acceso al sistema de archivos
Lee, escribe y manipula archivos en sistemas de archivos locales o remotos.

### Lógica de negocio personalizada
Ejecuta scripts o herramientas personalizadas específicas para las necesidades de tu organización.

### Acceso a datos en tiempo real
Obtén datos en vivo de sistemas externos durante la ejecución del flujo de trabajo.

## Consideraciones de seguridad

- Los servidores MCP se ejecutan con los permisos del usuario que los configuró
- Verifica siempre las fuentes del servidor MCP antes de la instalación
- Usa variables de entorno para datos de configuración sensibles
- Revisa las capacidades del servidor MCP antes de conceder acceso a los agentes

## Solución de problemas

### El servidor MCP no aparece
- Verifica que la configuración del servidor sea correcta
- Comprueba que tienes los permisos necesarios
- Asegúrate de que el servidor MCP esté en funcionamiento y sea accesible

### Fallos en la ejecución de herramientas
- Verifica que los parámetros de la herramienta estén correctamente formateados
- Revisa los registros del servidor MCP para ver mensajes de error
- Asegúrate de que la autenticación requerida esté configurada

### Errores de permisos
- Confirma tu nivel de permisos en el espacio de trabajo
- Comprueba si el servidor MCP requiere autenticación adicional
- Verifica que el servidor esté configurado correctamente para tu espacio de trabajo
```

--------------------------------------------------------------------------------

---[FILE: roles-and-permissions.mdx]---
Location: sim-main/apps/docs/content/docs/es/permissions/roles-and-permissions.mdx

```text
---
title: Roles y permisos
---

import { Video } from '@/components/ui/video'

Cuando invitas a miembros del equipo a tu organización o espacio de trabajo, necesitarás elegir qué nivel de acceso otorgarles. Esta guía explica lo que permite hacer cada nivel de permiso, ayudándote a entender los roles del equipo y qué acceso proporciona cada nivel de permiso.

## Cómo invitar a alguien a un espacio de trabajo

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="invitations.mp4" width={700} height={450} />
</div>

## Niveles de permiso del espacio de trabajo

Al invitar a alguien a un espacio de trabajo, puedes asignar uno de tres niveles de permiso:

| Permiso | Lo que pueden hacer |
|------------|------------------|
| **Lectura** | Ver flujos de trabajo, ver resultados de ejecución, pero no pueden realizar ningún cambio |
| **Escritura** | Crear y editar flujos de trabajo, ejecutar flujos de trabajo, gestionar variables de entorno |
| **Administrador** | Todo lo que puede hacer Escritura, además de invitar/eliminar usuarios y gestionar la configuración del espacio de trabajo |

## Lo que puede hacer cada nivel de permiso

Aquí hay un desglose detallado de lo que los usuarios pueden hacer con cada nivel de permiso:

### Permiso de lectura
**Perfecto para:** Interesados, observadores o miembros del equipo que necesitan visibilidad pero no deberían hacer cambios

**Lo que pueden hacer:**
- Ver todos los flujos de trabajo en el espacio de trabajo
- Ver resultados y registros de ejecución de flujos de trabajo
- Explorar configuraciones y ajustes de flujos de trabajo
- Ver variables de entorno (pero no editarlas)

**Lo que no pueden hacer:**
- Crear, editar o eliminar flujos de trabajo
- Ejecutar o implementar flujos de trabajo
- Cambiar cualquier configuración del espacio de trabajo
- Invitar a otros usuarios

### Permiso de escritura  
**Perfecto para:** Desarrolladores, creadores de contenido o miembros del equipo que trabajan activamente en automatización

**Lo que pueden hacer:**
- Todo lo que pueden hacer los usuarios de Lectura, además de:
- Crear, editar y eliminar flujos de trabajo
- Ejecutar e implementar flujos de trabajo
- Añadir, editar y eliminar variables de entorno del espacio de trabajo
- Usar todas las herramientas e integraciones disponibles
- Colaborar en tiempo real en la edición de flujos de trabajo

**Lo que no pueden hacer:**
- Invitar o eliminar usuarios del espacio de trabajo
- Cambiar la configuración del espacio de trabajo
- Eliminar el espacio de trabajo

### Permiso de administrador
**Perfecto para:** Líderes de equipo, gerentes de proyecto o líderes técnicos que necesitan gestionar el espacio de trabajo

**Lo que pueden hacer:**
- Todo lo que los usuarios con permiso de escritura pueden hacer, además de:
- Invitar a nuevos usuarios al espacio de trabajo con cualquier nivel de permiso
- Eliminar usuarios del espacio de trabajo
- Gestionar la configuración e integraciones del espacio de trabajo
- Configurar conexiones con herramientas externas
- Eliminar flujos de trabajo creados por otros usuarios

**Lo que no pueden hacer:**
- Eliminar el espacio de trabajo (solo el propietario del espacio de trabajo puede hacer esto)
- Eliminar al propietario del espacio de trabajo

---

## Propietario del espacio de trabajo vs administrador

Cada espacio de trabajo tiene un **Propietario** (la persona que lo creó) además de cualquier número de **Administradores**.

### Propietario del espacio de trabajo
- Tiene todos los permisos de administrador
- Puede eliminar el espacio de trabajo
- No puede ser eliminado del espacio de trabajo
- Puede transferir la propiedad a otro usuario

### Administrador del espacio de trabajo  
- Puede hacer todo excepto eliminar el espacio de trabajo o eliminar al propietario
- Puede ser eliminado del espacio de trabajo por el propietario u otros administradores

---

## Escenarios comunes

### Añadir un nuevo desarrollador a tu equipo
1. **Nivel de organización**: Invítalo como **Miembro de la organización**
2. **Nivel de espacio de trabajo**: Dale permiso de **Escritura** para que pueda crear y editar flujos de trabajo

### Añadir un gerente de proyecto
1. **Nivel de organización**: Invítalo como **Miembro de la organización** 
2. **Nivel de espacio de trabajo**: Dale permiso de **Administrador** para que pueda gestionar el equipo y ver todo

### Añadir un interesado o cliente
1. **Nivel de organización**: Invítalo como **Miembro de la organización**
2. **Nivel de espacio de trabajo**: Dale permiso de **Lectura** para que pueda ver el progreso pero no hacer cambios

---

## Variables de entorno

Los usuarios pueden crear dos tipos de variables de entorno:

### Variables de entorno personales
- Solo visibles para el usuario individual
- Disponibles en todos los flujos de trabajo que ejecutan
- Gestionadas en la configuración del usuario

### Variables de entorno del espacio de trabajo
- **Permiso de lectura**: Puede ver nombres y valores de variables
- **Permiso de escritura/administración**: Puede añadir, editar y eliminar variables
- Disponibles para todos los miembros del espacio de trabajo
- Si una variable personal tiene el mismo nombre que una variable del espacio de trabajo, la personal tiene prioridad

---

## Mejores prácticas

### Comienza con permisos mínimos
Otorga a los usuarios el nivel de permiso más bajo que necesiten para hacer su trabajo. Siempre puedes aumentar los permisos más tarde.

### Usa la estructura de la organización sabiamente
- Haz que los líderes de equipo de confianza sean **Administradores de la organización**
- La mayoría de los miembros del equipo deberían ser **Miembros de la organización**
- Reserva los permisos de **Administrador** del espacio de trabajo para personas que necesiten gestionar usuarios

### Revisa los permisos regularmente
Revisa periódicamente quién tiene acceso a qué, especialmente cuando los miembros del equipo cambian de roles o dejan la empresa.

### Seguridad de las variables de entorno
- Usa variables de entorno personales para claves API sensibles
- Usa variables de entorno del espacio de trabajo para configuración compartida
- Audita regularmente quién tiene acceso a variables sensibles

---

## Roles de la organización

Al invitar a alguien a tu organización, puedes asignar uno de dos roles:

### Administrador de la organización
**Lo que pueden hacer:**
- Invitar y eliminar miembros del equipo de la organización
- Crear nuevos espacios de trabajo
- Gestionar la facturación y configuración de suscripción
- Acceder a todos los espacios de trabajo dentro de la organización

### Miembro de la organización  
**Lo que pueden hacer:**
- Acceder a espacios de trabajo a los que han sido específicamente invitados
- Ver la lista de miembros de la organización
- No pueden invitar a nuevas personas ni gestionar la configuración de la organización
```

--------------------------------------------------------------------------------

````
