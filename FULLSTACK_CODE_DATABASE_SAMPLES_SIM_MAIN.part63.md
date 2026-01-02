---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 63
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 63 of 933)

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
Location: sim-main/apps/docs/content/docs/en/self-hosting/platforms.mdx

```text
---
title: Cloud Platforms
description: Deploy Sim Studio on cloud platforms
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Railway

One-click deployment with automatic PostgreSQL provisioning.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/new/template/sim-studio)

After deployment, add environment variables in Railway dashboard:
- `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, `INTERNAL_API_SECRET` (auto-generated)
- `OPENAI_API_KEY` or other AI provider keys
- Custom domain in Settings → Networking

## VPS Deployment

For DigitalOcean, AWS EC2, Azure VMs, or any Linux server:

<Tabs items={['DigitalOcean', 'AWS EC2', 'Azure VM']}>
  <Tab value="DigitalOcean">
**Recommended:** 16 GB RAM Droplet, Ubuntu 24.04

```bash
# Create Droplet via console, then SSH in
ssh root@your-droplet-ip
```
  </Tab>
  <Tab value="AWS EC2">
**Recommended:** t3.xlarge (16 GB RAM), Ubuntu 24.04

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```
  </Tab>
  <Tab value="Azure VM">
**Recommended:** Standard_D4s_v3 (16 GB RAM), Ubuntu 24.04

```bash
ssh azureuser@your-vm-ip
```
  </Tab>
</Tabs>

### Install Docker

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Logout and reconnect, then verify
docker --version
```

### Deploy Sim Studio

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

### SSL with Caddy

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

Point your domain's DNS A record to your server IP.

## Kubernetes (EKS, AKS, GKE)

See the [Kubernetes guide](/self-hosting/kubernetes) for Helm deployment on managed Kubernetes.

## Managed Database (Optional)

For production, use a managed PostgreSQL service:

- **AWS RDS** / **Azure Database** / **Cloud SQL** - Enable pgvector extension
- **Supabase** / **Neon** - pgvector included

Set `DATABASE_URL` in your environment:
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: sim-main/apps/docs/content/docs/en/self-hosting/troubleshooting.mdx

```text
---
title: Troubleshooting
description: Common issues and solutions
---

## Database Connection Failed

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/database`

## Ollama Models Not Showing

Inside Docker, `localhost` = the container, not your host machine.

```bash
# For host-machine Ollama, use:
OLLAMA_URL=http://host.docker.internal:11434  # macOS/Windows
OLLAMA_URL=http://192.168.1.x:11434           # Linux (use actual IP)
```

## WebSocket/Realtime Not Working

1. Check `NEXT_PUBLIC_SOCKET_URL` matches your domain
2. Verify realtime service is running: `docker compose ps realtime`
3. Ensure reverse proxy passes WebSocket upgrades (see [Docker guide](/self-hosting/docker))

## 502 Bad Gateway

```bash
# Check app is running
docker compose ps simstudio
docker compose logs simstudio

# Common causes: out of memory, database not ready
```

## Migration Errors

```bash
# View migration logs
docker compose logs migrations

# Run manually
docker compose exec simstudio bun run db:migrate
```

## pgvector Not Found

Use the correct PostgreSQL image:
```yaml
image: pgvector/pgvector:pg17  # NOT postgres:17
```

## Certificate Errors (CERT_HAS_EXPIRED)

If you see SSL certificate errors when calling external APIs:

```bash
# Update CA certificates in container
docker compose exec simstudio apt-get update && apt-get install -y ca-certificates

# Or set in environment (not recommended for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Blank Page After Login

1. Check browser console for errors
2. Verify `NEXT_PUBLIC_APP_URL` matches your actual domain
3. Clear browser cookies and local storage
4. Check that all services are running: `docker compose ps`

## Windows-Specific Issues

**Turbopack errors on Windows:**
```bash
# Use WSL2 for better compatibility
wsl --install

# Or disable Turbopack in package.json
# Change "next dev --turbopack" to "next dev"
```

**Line ending issues:**
```bash
# Configure git to use LF
git config --global core.autocrlf input
```

## View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f simstudio
```

## Getting Help

- [GitHub Issues](https://github.com/simstudioai/sim/issues)
- [Discord](https://discord.gg/Hr4UWYEcTT)
```

--------------------------------------------------------------------------------

---[FILE: ahrefs.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/ahrefs.mdx

```text
---
title: Ahrefs
description: SEO analysis with Ahrefs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ahrefs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Ahrefs](https://ahrefs.com/) is a leading SEO toolset for analyzing websites, tracking rankings, monitoring backlinks, and researching keywords. It provides detailed insights into your own website as well as your competitors, helping you make data-driven decisions to improve your search visibility.

With the Ahrefs integration in Sim, you can:

- **Analyze Domain Rating & Authority**: Instantly check the Domain Rating (DR) and Ahrefs Rank of any website to gauge its authority.
- **Fetch Backlinks**: Retrieve a list of backlinks pointing to a site or specific URL, with details like anchor text, referring page DR, and more.
- **Get Backlink Statistics**: Access metrics on backlink types (dofollow, nofollow, text, image, redirect, etc.) for a domain or URL.
- **Explore Organic Keywords** *(planned)*: View keywords a domain ranks for and their positions in Google search results.
- **Discover Top Pages** *(planned)*: Identify the highest-performing pages by organic traffic and links.

These tools let your agents automate SEO research, monitor competitors, and generate reports—all as part of your workflow automations. To use the Ahrefs integration, you’ll need an Ahrefs Enterprise subscription with API access.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Ahrefs SEO tools into your workflow. Analyze domain ratings, backlinks, organic keywords, top pages, and more. Requires an Ahrefs Enterprise plan with API access.



## Tools

### `ahrefs_domain_rating`

Get the Domain Rating (DR) and Ahrefs Rank for a target domain. Domain Rating shows the strength of a website

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain to analyze \(e.g., example.com\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `domainRating` | number | Domain Rating score \(0-100\) |
| `ahrefsRank` | number | Ahrefs Rank - global ranking based on backlink profile strength |

### `ahrefs_backlinks`

Get a list of backlinks pointing to a target domain or URL. Returns details about each backlink including source URL, anchor text, and domain rating.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain or URL to analyze |
| `mode` | string | No | Analysis mode: domain \(entire domain\), prefix \(URL prefix\), subdomains \(include all subdomains\), exact \(exact URL match\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `limit` | number | No | Maximum number of results to return \(default: 100\) |
| `offset` | number | No | Number of results to skip for pagination |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `backlinks` | array | List of backlinks pointing to the target |

### `ahrefs_backlinks_stats`

Get backlink statistics for a target domain or URL. Returns totals for different backlink types including dofollow, nofollow, text, image, and redirect links.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain or URL to analyze |
| `mode` | string | No | Analysis mode: domain \(entire domain\), prefix \(URL prefix\), subdomains \(include all subdomains\), exact \(exact URL match\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `stats` | object | Backlink statistics summary |

### `ahrefs_referring_domains`

Get a list of domains that link to a target domain or URL. Returns unique referring domains with their domain rating, backlink counts, and discovery dates.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain or URL to analyze |
| `mode` | string | No | Analysis mode: domain \(entire domain\), prefix \(URL prefix\), subdomains \(include all subdomains\), exact \(exact URL match\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `limit` | number | No | Maximum number of results to return \(default: 100\) |
| `offset` | number | No | Number of results to skip for pagination |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `referringDomains` | array | List of domains linking to the target |

### `ahrefs_organic_keywords`

Get organic keywords that a target domain or URL ranks for in Google search results. Returns keyword details including search volume, ranking position, and estimated traffic.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain or URL to analyze |
| `country` | string | No | Country code for search results \(e.g., us, gb, de\). Default: us |
| `mode` | string | No | Analysis mode: domain \(entire domain\), prefix \(URL prefix\), subdomains \(include all subdomains\), exact \(exact URL match\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `limit` | number | No | Maximum number of results to return \(default: 100\) |
| `offset` | number | No | Number of results to skip for pagination |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `keywords` | array | List of organic keywords the target ranks for |

### `ahrefs_top_pages`

Get the top pages of a target domain sorted by organic traffic. Returns page URLs with their traffic, keyword counts, and estimated traffic value.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain to analyze |
| `country` | string | No | Country code for traffic data \(e.g., us, gb, de\). Default: us |
| `mode` | string | No | Analysis mode: domain \(entire domain\), prefix \(URL prefix\), subdomains \(include all subdomains\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `limit` | number | No | Maximum number of results to return \(default: 100\) |
| `offset` | number | No | Number of results to skip for pagination |
| `select` | string | No | Comma-separated list of fields to return \(e.g., url,traffic,keywords,top_keyword,value\). Default: url,traffic,keywords,top_keyword,value |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pages` | array | List of top pages by organic traffic |

### `ahrefs_keyword_overview`

Get detailed metrics for a keyword including search volume, keyword difficulty, CPC, clicks, and traffic potential.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyword` | string | Yes | The keyword to analyze |
| `country` | string | No | Country code for keyword data \(e.g., us, gb, de\). Default: us |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `overview` | object | Keyword metrics overview |

### `ahrefs_broken_backlinks`

Get a list of broken backlinks pointing to a target domain or URL. Useful for identifying link reclamation opportunities.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Yes | The target domain or URL to analyze |
| `mode` | string | No | Analysis mode: domain \(entire domain\), prefix \(URL prefix\), subdomains \(include all subdomains\), exact \(exact URL match\) |
| `date` | string | No | Date for historical data in YYYY-MM-DD format \(defaults to today\) |
| `limit` | number | No | Maximum number of results to return \(default: 100\) |
| `offset` | number | No | Number of results to skip for pagination |
| `apiKey` | string | Yes | Ahrefs API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `brokenBacklinks` | array | List of broken backlinks |



## Notes

- Category: `tools`
- Type: `ahrefs`
```

--------------------------------------------------------------------------------

---[FILE: airtable.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/airtable.mdx

```text
---
title: Airtable
description: Read, create, and update Airtable
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="airtable"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Airtable](https://airtable.com/) is a powerful cloud-based platform that combines the functionality of a database with the simplicity of a spreadsheet. It allows users to create flexible databases for organizing, storing, and collaborating on information.

With Airtable, you can:

- **Create custom databases**: Build tailored solutions for project management, content calendars, inventory tracking, and more
- **Visualize data**: View your information as a grid, kanban board, calendar, or gallery
- **Automate workflows**: Set up triggers and actions to automate repetitive tasks
- **Integrate with other tools**: Connect with hundreds of other applications through native integrations and APIs

In Sim, the Airtable integration enables your agents to interact with your Airtable bases programmatically. This allows for seamless data operations like retrieving information, creating new records, and updating existing data - all within your agent workflows. Use Airtable as a dynamic data source or destination for your agents, enabling them to access and manipulate structured information as part of their decision-making and task execution processes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrates Airtable into the workflow. Can create, get, list, or update Airtable records. Can be used in trigger mode to trigger a workflow when an update is made to an Airtable table.



## Tools

### `airtable_list_records`

Read records from an Airtable table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Yes | ID of the Airtable base |
| `tableId` | string | Yes | ID of the table |
| `maxRecords` | number | No | Maximum number of records to return |
| `filterFormula` | string | No | Formula to filter records \(e.g., "\(\{Field Name\} = \'Value\'\)"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `records` | json | Array of retrieved Airtable records |

### `airtable_get_record`

Retrieve a single record from an Airtable table by its ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Yes | ID of the Airtable base |
| `tableId` | string | Yes | ID or name of the table |
| `recordId` | string | Yes | ID of the record to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Retrieved Airtable record with id, createdTime, and fields |
| `metadata` | json | Operation metadata including record count |

### `airtable_create_records`

Write new records to an Airtable table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Yes | ID of the Airtable base |
| `tableId` | string | Yes | ID or name of the table |
| `records` | json | Yes | Array of records to create, each with a `fields` object |
| `fields` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `records` | json | Array of created Airtable records |

### `airtable_update_record`

Update an existing record in an Airtable table by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Yes | ID of the Airtable base |
| `tableId` | string | Yes | ID or name of the table |
| `recordId` | string | Yes | ID of the record to update |
| `fields` | json | Yes | An object containing the field names and their new values |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Updated Airtable record with id, createdTime, and fields |
| `metadata` | json | Operation metadata including record count and updated field names |

### `airtable_update_multiple_records`

Update multiple existing records in an Airtable table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Yes | ID of the Airtable base |
| `tableId` | string | Yes | ID or name of the table |
| `records` | json | Yes | Array of records to update, each with an `id` and a `fields` object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `records` | json | Array of updated Airtable records |



## Notes

- Category: `tools`
- Type: `airtable`
```

--------------------------------------------------------------------------------

---[FILE: apify.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/apify.mdx

```text
---
title: Apify
description: Run Apify actors and retrieve results
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apify"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apify](https://apify.com/) is a powerful platform for building, deploying, and running web automation and web scraping actors at scale. Apify enables you to extract useful data from any website, automate workflows, and connect your data pipelines seamlessly.

With Apify, you can:

- **Run ready-made or custom actors**: Integrate public actors or develop your own, automating a wide range of web data extraction and browser tasks.
- **Retrieve datasets**: Access and manage structured datasets collected by actors in real time.
- **Scale web automation**: Leverage cloud infrastructure to run tasks reliably, asynchronously or synchronously, with robust error handling.

In Sim, the Apify integration allows your agents to perform core Apify operations programmatically:

- **Run Actor (Sync)**: Use `apify_run_actor_sync` to launch an Apify actor and wait for its completion, retrieving the results as soon as the run finishes.
- **Run Actor (Async)**: Use `apify_run_actor_async` to start an actor in the background and periodically poll for results, suitable for longer or complex jobs.

These operations equip your agents to automate, scrape, and orchestrate data collection or browser automation tasks directly inside workflows — all with flexible configuration and result handling, without the need for manual runs or external tools. Integrate Apify as a dynamic automation and data-extraction engine that programmatically powers your agents' web-scale workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Apify into your workflow. Run any Apify actor with custom input and retrieve results. Supports both synchronous and asynchronous execution with automatic dataset fetching.



## Tools

### `apify_run_actor_sync`

Run an APIFY actor synchronously and get results (max 5 minutes)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | APIFY API token from console.apify.com/account#/integrations |
| `actorId` | string | Yes | Actor ID or username/actor-name \(e.g., "janedoe/my-actor" or actor ID\) |
| `input` | string | No | Actor input as JSON string. See actor documentation for required fields. |
| `timeout` | number | No | Timeout in seconds \(default: actor default\) |
| `build` | string | No | Actor build to run \(e.g., "latest", "beta", or build tag/number\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the actor run succeeded |
| `runId` | string | APIFY run ID |
| `status` | string | Run status \(SUCCEEDED, FAILED, etc.\) |
| `items` | array | Dataset items \(if completed\) |

### `apify_run_actor_async`

Run an APIFY actor asynchronously with polling for long-running tasks

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | APIFY API token from console.apify.com/account#/integrations |
| `actorId` | string | Yes | Actor ID or username/actor-name \(e.g., "janedoe/my-actor" or actor ID\) |
| `input` | string | No | Actor input as JSON string |
| `waitForFinish` | number | No | Initial wait time in seconds \(0-60\) before polling starts |
| `itemLimit` | number | No | Max dataset items to fetch \(1-250000, default 100\) |
| `timeout` | number | No | Timeout in seconds \(default: actor default\) |
| `build` | string | No | Actor build to run \(e.g., "latest", "beta", or build tag/number\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the actor run succeeded |
| `runId` | string | APIFY run ID |
| `status` | string | Run status \(SUCCEEDED, FAILED, etc.\) |
| `datasetId` | string | Dataset ID containing results |
| `items` | array | Dataset items \(if completed\) |



## Notes

- Category: `tools`
- Type: `apify`
```

--------------------------------------------------------------------------------

````
