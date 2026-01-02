---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 106
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 106 of 933)

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

---[FILE: platforms.mdx]---
Location: sim-main/apps/docs/content/docs/es/self-hosting/platforms.mdx

```text
---
title: Plataformas en la nube
description: Despliega Sim Studio en plataformas en la nube
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Railway

Despliegue con un solo clic con aprovisionamiento automático de PostgreSQL.

[

![Desplegar en Railway](https://railway.app/button.svg)

](https://railway.com/new/template/sim-studio)

Después del despliegue, añade variables de entorno en el panel de Railway:
- `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, `INTERNAL_API_SECRET` (generadas automáticamente)
- `OPENAI_API_KEY` u otras claves de proveedores de IA
- Dominio personalizado en Configuración → Redes

## Despliegue en VPS

Para DigitalOcean, AWS EC2, Azure VMs o cualquier servidor Linux:

<Tabs items={['DigitalOcean', 'AWS EC2', 'Azure VM']}>
  <Tab value="DigitalOcean">
**Recomendado:** Droplet de 16 GB RAM, Ubuntu 24.04

```bash
# Create Droplet via console, then SSH in
ssh root@your-droplet-ip
```

  </Tab>
  <Tab value="AWS EC2">
**Recomendado:** t3.xlarge (16 GB RAM), Ubuntu 24.04

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

  </Tab>
  <Tab value="Azure VM">
**Recomendado:** Standard_D4s_v3 (16 GB RAM), Ubuntu 24.04

```bash
ssh azureuser@your-vm-ip
```

  </Tab>
</Tabs>

### Instalar Docker

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Logout and reconnect, then verify
docker --version
```

### Desplegar Sim Studio

```bash
git clone https://github.com/simstudioai/sim.git && cd sim

# Create .env with secrets
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
BETTER_AUTH_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
EOF

# Start
docker compose -f docker-compose.prod.yml up -d
```

### SSL con Caddy

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy

# Configure (replace domain)
echo 'sim.yourdomain.com {
    reverse_proxy localhost:3000
    handle /socket.io/* {
        reverse_proxy localhost:3002
    }
}' | sudo tee /etc/caddy/Caddyfile

sudo systemctl restart caddy
```

Apunta el registro DNS A de tu dominio a la IP de tu servidor.

## Kubernetes (EKS, AKS, GKE)

Consulta la [guía de Kubernetes](/self-hosting/kubernetes) para la implementación con Helm en Kubernetes gestionado.

## Base de datos gestionada (Opcional)

Para producción, utiliza un servicio de PostgreSQL gestionado:

- **AWS RDS** / **Azure Database** / **Cloud SQL** - Habilita la extensión pgvector
- **Supabase** / **Neon** - pgvector incluido

Establece `DATABASE_URL` en tu entorno:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: sim-main/apps/docs/content/docs/es/self-hosting/troubleshooting.mdx

```text
---
title: Solución de problemas
description: Problemas comunes y soluciones
---

## Falló la conexión a la base de datos

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

Verifica el formato de `DATABASE_URL`: `postgresql://user:pass@host:5432/database`

## Los modelos de Ollama no se muestran

Dentro de Docker, `localhost` = el contenedor, no tu máquina host.

```bash
# For host-machine Ollama, use:
OLLAMA_URL=http://host.docker.internal:11434  # macOS/Windows
OLLAMA_URL=http://192.168.1.x:11434           # Linux (use actual IP)
```

## WebSocket/Tiempo real no funciona

1. Comprueba que `NEXT_PUBLIC_SOCKET_URL` coincida con tu dominio
2. Verifica que el servicio en tiempo real esté funcionando: `docker compose ps realtime`
3. Asegúrate de que el proxy inverso pase las actualizaciones de WebSocket (consulta la [guía de Docker](/self-hosting/docker))

## Error 502 Bad Gateway

```bash
# Check app is running
docker compose ps simstudio
docker compose logs simstudio

# Common causes: out of memory, database not ready
```

## Errores de migración

```bash
# View migration logs
docker compose logs migrations

# Run manually
docker compose exec simstudio bun run db:migrate
```

## pgvector no encontrado

Usa la imagen correcta de PostgreSQL:

```yaml
image: pgvector/pgvector:pg17  # NOT postgres:17
```

## Errores de certificado (CERT_HAS_EXPIRED)

Si ves errores de certificado SSL al llamar a APIs externas:

```bash
# Update CA certificates in container
docker compose exec simstudio apt-get update && apt-get install -y ca-certificates

# Or set in environment (not recommended for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Página en blanco después del inicio de sesión

1. Revisa la consola del navegador para ver errores
2. Verifica que `NEXT_PUBLIC_APP_URL` coincida con tu dominio actual
3. Borra las cookies del navegador y el almacenamiento local
4. Comprueba que todos los servicios estén funcionando: `docker compose ps`

## Problemas específicos de Windows

**Errores de Turbopack en Windows:**

```bash
# Use WSL2 for better compatibility
wsl --install

# Or disable Turbopack in package.json
# Change "next dev --turbopack" to "next dev"
```

**Problemas de fin de línea:**

```bash
# Configure git to use LF
git config --global core.autocrlf input
```

## Ver registros

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f simstudio
```

## Obtener ayuda

- [GitHub Issues](https://github.com/simstudioai/sim/issues)
- [Discord](https://discord.gg/Hr4UWYEcTT)
```

--------------------------------------------------------------------------------

---[FILE: ahrefs.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/ahrefs.mdx

```text
---
title: Ahrefs
description: Análisis SEO con Ahrefs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ahrefs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Ahrefs](https://ahrefs.com/) es un conjunto de herramientas SEO líder para analizar sitios web, seguir posiciones, monitorear backlinks e investigar palabras clave. Proporciona información detallada sobre tu propio sitio web y el de tus competidores, ayudándote a tomar decisiones basadas en datos para mejorar tu visibilidad en los buscadores.

Con la integración de Ahrefs en Sim, puedes:

- **Analizar Domain Rating y autoridad**: Comprobar instantáneamente el Domain Rating (DR) y el Ahrefs Rank de cualquier sitio web para evaluar su autoridad.
- **Obtener backlinks**: Recuperar una lista de backlinks que apuntan a un sitio o URL específica, con detalles como texto ancla, DR de la página referente y más.
- **Obtener estadísticas de backlinks**: Acceder a métricas sobre tipos de backlinks (dofollow, nofollow, texto, imagen, redirección, etc.) para un dominio o URL.
- **Explorar palabras clave orgánicas** *(planificado)*: Ver las palabras clave por las que un dominio se posiciona y sus posiciones en los resultados de búsqueda de Google.
- **Descubrir páginas principales** *(planificado)*: Identificar las páginas con mejor rendimiento por tráfico orgánico y enlaces.

Estas herramientas permiten a tus agentes automatizar la investigación SEO, monitorear competidores y generar informes, todo como parte de tus automatizaciones de flujo de trabajo. Para usar la integración de Ahrefs, necesitarás una suscripción Ahrefs Enterprise con acceso a API.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra las herramientas SEO de Ahrefs en tu flujo de trabajo. Analiza calificaciones de dominio, backlinks, palabras clave orgánicas, páginas principales y más. Requiere un plan Ahrefs Enterprise con acceso a API.

## Herramientas

### `ahrefs_domain_rating`

Obtén el Domain Rating (DR) y el Ahrefs Rank para un dominio objetivo. El Domain Rating muestra la fortaleza de un sitio web

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `target` | string | Sí | El dominio objetivo a analizar \(p. ej., example.com\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto es hoy\) |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `domainRating` | number | Puntuación de Domain Rating \(0-100\) |
| `ahrefsRank` | number | Ahrefs Rank - clasificación global basada en la fuerza del perfil de backlinks |

### `ahrefs_backlinks`

Obtener una lista de backlinks que apuntan a un dominio o URL objetivo. Devuelve detalles sobre cada backlink incluyendo URL de origen, texto de anclaje y domain rating.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `target` | string | Sí | El dominio o URL objetivo a analizar |
| `mode` | string | No | Modo de análisis: domain \(dominio completo\), prefix \(prefijo URL\), subdomains \(incluir todos los subdominios\), exact \(coincidencia exacta de URL\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto es hoy\) |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 100\) |
| `offset` | number | No | Número de resultados a omitir para paginación |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `backlinks` | array | Lista de backlinks que apuntan al objetivo |

### `ahrefs_backlinks_stats`

Obtén estadísticas de backlinks para un dominio o URL objetivo. Devuelve totales para diferentes tipos de backlinks incluyendo enlaces dofollow, nofollow, texto, imagen y redirección.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `target` | string | Sí | El dominio o URL objetivo para analizar |
| `mode` | string | No | Modo de análisis: domain \(dominio completo\), prefix \(prefijo URL\), subdomains \(incluir todos los subdominios\), exact \(coincidencia exacta de URL\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto es hoy\) |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `stats` | object | Resumen de estadísticas de backlinks |

### `ahrefs_referring_domains`

Obtén una lista de dominios que enlazan a un dominio o URL objetivo. Devuelve dominios de referencia únicos con su calificación de dominio, recuento de backlinks y fechas de descubrimiento.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `target` | string | Sí | El dominio o URL objetivo para analizar |
| `mode` | string | No | Modo de análisis: domain \(dominio completo\), prefix \(prefijo URL\), subdomains \(incluir todos los subdominios\), exact \(coincidencia exacta de URL\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto es hoy\) |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 100\) |
| `offset` | number | No | Número de resultados a omitir para paginación |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `referringDomains` | array | Lista de dominios que enlazan al objetivo |

### `ahrefs_organic_keywords`

Obtén palabras clave orgánicas por las que un dominio o URL objetivo se posiciona en los resultados de búsqueda de Google. Devuelve detalles de las palabras clave, incluyendo volumen de búsqueda, posición en el ranking y tráfico estimado.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `target` | string | Sí | El dominio o URL objetivo a analizar |
| `country` | string | No | Código de país para los resultados de búsqueda \(p. ej., us, gb, de\). Predeterminado: us |
| `mode` | string | No | Modo de análisis: domain \(dominio completo\), prefix \(prefijo de URL\), subdomains \(incluir todos los subdominios\), exact \(coincidencia exacta de URL\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto: hoy\) |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 100\) |
| `offset` | number | No | Número de resultados a omitir para la paginación |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `keywords` | array | Lista de palabras clave orgánicas por las que se posiciona el objetivo |

### `ahrefs_top_pages`

Obtén las páginas principales de un dominio objetivo ordenadas por tráfico orgánico. Devuelve URLs de páginas con su tráfico, recuento de palabras clave y valor estimado del tráfico.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `target` | string | Sí | El dominio objetivo a analizar |
| `country` | string | No | Código de país para datos de tráfico \(p. ej., us, gb, de\). Predeterminado: us |
| `mode` | string | No | Modo de análisis: domain \(dominio completo\), prefix \(prefijo URL\), subdomains \(incluir todos los subdominios\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto es hoy\) |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 100\) |
| `offset` | number | No | Número de resultados a omitir para paginación |
| `select` | string | No | Lista separada por comas de campos a devolver \(p. ej., url,traffic,keywords,top_keyword,value\). Predeterminado: url,traffic,keywords,top_keyword,value |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `pages` | array | Lista de páginas principales por tráfico orgánico |

### `ahrefs_keyword_overview`

Obtener métricas detalladas para una palabra clave incluyendo volumen de búsqueda, dificultad de la palabra clave, CPC, clics y potencial de tráfico.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ---------- | ----------- |
| `keyword` | string | Sí | La palabra clave a analizar |
| `country` | string | No | Código de país para datos de palabras clave \(p. ej., us, gb, de\). Predeterminado: us |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `overview` | object | Resumen de métricas de palabra clave |

### `ahrefs_broken_backlinks`

Obtén una lista de backlinks rotos que apuntan a un dominio o URL objetivo. Útil para identificar oportunidades de recuperación de enlaces.

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `target` | string | Sí | El dominio o URL objetivo para analizar |
| `mode` | string | No | Modo de análisis: domain \(dominio completo\), prefix \(prefijo de URL\), subdomains \(incluir todos los subdominios\), exact \(coincidencia exacta de URL\) |
| `date` | string | No | Fecha para datos históricos en formato AAAA-MM-DD \(por defecto: hoy\) |
| `limit` | number | No | Número máximo de resultados a devolver \(predeterminado: 100\) |
| `offset` | number | No | Número de resultados a omitir para paginación |
| `apiKey` | string | Sí | Clave API de Ahrefs |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `brokenBacklinks` | array | Lista de backlinks rotos |

## Notas

- Categoría: `tools`
- Tipo: `ahrefs`
```

--------------------------------------------------------------------------------

---[FILE: airtable.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/airtable.mdx

```text
---
title: Airtable
description: Lee, crea y actualiza Airtable
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="airtable"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Airtable](https://airtable.com/) es una potente plataforma basada en la nube que combina la funcionalidad de una base de datos con la simplicidad de una hoja de cálculo. Permite a los usuarios crear bases de datos flexibles para organizar, almacenar y colaborar con información.

Con Airtable, puedes:

- **Crear bases de datos personalizadas**: Construye soluciones a medida para gestión de proyectos, calendarios de contenido, seguimiento de inventario y más
- **Visualizar datos**: Ve tu información como una cuadrícula, tablero kanban, calendario o galería
- **Automatizar flujos de trabajo**: Configura disparadores y acciones para automatizar tareas repetitivas
- **Integrar con otras herramientas**: Conéctate con cientos de otras aplicaciones a través de integraciones nativas y APIs

En Sim, la integración de Airtable permite a tus agentes interactuar con tus bases de Airtable de forma programática. Esto permite operaciones de datos fluidas como recuperar información, crear nuevos registros y actualizar datos existentes, todo dentro de los flujos de trabajo de tu agente. Utiliza Airtable como una fuente o destino de datos dinámico para tus agentes, permitiéndoles acceder y manipular información estructurada como parte de sus procesos de toma de decisiones y ejecución de tareas.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Airtable en el flujo de trabajo. Puede crear, obtener, listar o actualizar registros de Airtable. Requiere OAuth. Se puede usar en modo de activación para iniciar un flujo de trabajo cuando se realiza una actualización en una tabla de Airtable.

## Herramientas

### `airtable_list_records`

Leer registros de una tabla de Airtable

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `baseId` | string | Sí | ID de la base de Airtable |
| `tableId` | string | Sí | ID de la tabla |
| `maxRecords` | number | No | Número máximo de registros a devolver |
| `filterFormula` | string | No | Fórmula para filtrar registros \(p. ej., "\(\{Nombre del campo\} = \'Valor\'\)"\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `records` | json | Array de registros de Airtable recuperados |

### `airtable_get_record`

Recuperar un solo registro de una tabla de Airtable por su ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `baseId` | string | Sí | ID de la base de Airtable |
| `tableId` | string | Sí | ID o nombre de la tabla |
| `recordId` | string | Sí | ID del registro a recuperar |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `record` | json | Registro de Airtable recuperado con id, createdTime y campos |
| `metadata` | json | Metadatos de la operación incluyendo el recuento de registros |

### `airtable_create_records`

Escribir nuevos registros en una tabla de Airtable

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Sí | ID de la base de Airtable |
| `tableId` | string | Sí | ID o nombre de la tabla |
| `records` | json | Sí | Array de registros para crear, cada uno con un objeto `fields` |
| `fields` | string | No | Sin descripción |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `records` | json | Array de registros de Airtable creados |

### `airtable_update_record`

Actualizar un registro existente en una tabla de Airtable por ID

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Sí | ID de la base de Airtable |
| `tableId` | string | Sí | ID o nombre de la tabla |
| `recordId` | string | Sí | ID del registro a actualizar |
| `fields` | json | Sí | Un objeto que contiene los nombres de los campos y sus nuevos valores |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `record` | json | Registro de Airtable actualizado con id, createdTime y campos |
| `metadata` | json | Metadatos de la operación incluyendo el recuento de registros y los nombres de campos actualizados |

### `airtable_update_multiple_records`

Actualizar múltiples registros existentes en una tabla de Airtable

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Sí | ID de la base de Airtable |
| `tableId` | string | Sí | ID o nombre de la tabla |
| `records` | json | Sí | Array de registros para actualizar, cada uno con un `id` y un objeto `fields` |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `records` | json | Array de registros de Airtable actualizados |

## Notas

- Categoría: `tools`
- Tipo: `airtable`
```

--------------------------------------------------------------------------------

---[FILE: apify.mdx]---
Location: sim-main/apps/docs/content/docs/es/tools/apify.mdx

```text
---
title: Apify
description: Ejecuta actores de Apify y obtén resultados
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apify"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apify](https://apify.com/) es una plataforma potente para crear, implementar y ejecutar automatización web y actores de scraping web a escala. Apify te permite extraer datos útiles de cualquier sitio web, automatizar flujos de trabajo y conectar tus canales de datos sin problemas.

Con Apify, puedes:

- **Ejecutar actores predefinidos o personalizados**: Integra actores públicos o desarrolla los tuyos propios, automatizando una amplia gama de tareas de extracción de datos web y navegador.
- **Recuperar conjuntos de datos**: Accede y gestiona conjuntos de datos estructurados recopilados por actores en tiempo real.
- **Escalar la automatización web**: Aprovecha la infraestructura en la nube para ejecutar tareas de manera confiable, de forma asíncrona o síncrona, con un manejo robusto de errores.

En Sim, la integración de Apify permite a tus agentes realizar operaciones principales de Apify de forma programática:

- **Ejecutar actor (Sincrónico)**: Usa `apify_run_actor_sync` para lanzar un actor de Apify y esperar a que se complete, obteniendo los resultados tan pronto como finalice la ejecución.
- **Ejecutar actor (Asincrónico)**: Usa `apify_run_actor_async` para iniciar un actor en segundo plano y consultar periódicamente los resultados, adecuado para trabajos más largos o complejos.

Estas operaciones equipan a tus agentes para automatizar, extraer y orquestar tareas de recopilación de datos o automatización de navegador directamente dentro de los flujos de trabajo — todo con configuración flexible y manejo de resultados, sin necesidad de ejecuciones manuales o herramientas externas. Integra Apify como un motor dinámico de automatización y extracción de datos que impulsa programáticamente los flujos de trabajo a escala web de tus agentes.
{/* MANUAL-CONTENT-END */}

## Instrucciones de uso

Integra Apify en tu flujo de trabajo. Ejecuta cualquier actor de Apify con entrada personalizada y obtén resultados. Admite ejecución tanto síncrona como asíncrona con recuperación automática de conjuntos de datos.

## Herramientas

### `apify_run_actor_sync`

Ejecuta un actor de APIFY de forma sincrónica y obtén resultados (máximo 5 minutos)

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Token de API de APIFY desde console.apify.com/account#/integrations |
| `actorId` | string | Sí | ID del actor o nombreusuario/nombre-actor \(p.ej., "janedoe/my-actor" o ID del actor\) |
| `input` | string | No | Entrada del actor como cadena JSON. Consulta la documentación del actor para los campos requeridos. |
| `timeout` | number | No | Tiempo de espera en segundos \(predeterminado: el predeterminado del actor\) |
| `build` | string | No | Versión del actor a ejecutar \(p.ej., "latest", "beta", o etiqueta/número de versión\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la ejecución del actor tuvo éxito |
| `runId` | string | ID de ejecución de APIFY |
| `status` | string | Estado de la ejecución \(SUCCEEDED, FAILED, etc.\) |
| `items` | array | Elementos del conjunto de datos \(si se completó\) |

### `apify_run_actor_async`

Ejecuta un actor de APIFY de forma asincrónica con sondeo para tareas de larga duración

#### Entrada

| Parámetro | Tipo | Obligatorio | Descripción |
| --------- | ---- | ----------- | ----------- |
| `apiKey` | string | Sí | Token de API de APIFY desde console.apify.com/account#/integrations |
| `actorId` | string | Sí | ID del actor o nombreusuario/nombre-actor \(p.ej., "janedoe/my-actor" o ID del actor\) |
| `input` | string | No | Entrada del actor como cadena JSON |
| `waitForFinish` | number | No | Tiempo de espera inicial en segundos \(0-60\) antes de que comience el sondeo |
| `itemLimit` | number | No | Número máximo de elementos del conjunto de datos a recuperar \(1-250000, predeterminado 100\) |
| `timeout` | number | No | Tiempo de espera en segundos \(predeterminado: el predeterminado del actor\) |
| `build` | string | No | Versión del actor a ejecutar \(p.ej., "latest", "beta", o etiqueta/número de versión\) |

#### Salida

| Parámetro | Tipo | Descripción |
| --------- | ---- | ----------- |
| `success` | boolean | Si la ejecución del actor tuvo éxito |
| `runId` | string | ID de ejecución de APIFY |
| `status` | string | Estado de la ejecución \(SUCCEEDED, FAILED, etc.\) |
| `datasetId` | string | ID del conjunto de datos que contiene los resultados |
| `items` | array | Elementos del conjunto de datos \(si se completó\) |

## Notas

- Categoría: `tools`
- Tipo: `apify`
```

--------------------------------------------------------------------------------

````
