---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 798
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 798 of 933)

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

---[FILE: app.Dockerfile]---
Location: sim-main/docker/app.Dockerfile

```text
# ========================================
# Base Stage: Debian-based Bun
# ========================================
FROM oven/bun:1.3.3-slim AS base

# ========================================
# Dependencies Stage: Install Dependencies
# ========================================
FROM base AS deps
WORKDIR /app

# Install Node.js 22 for isolated-vm compilation (requires node-gyp and V8)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock turbo.json ./
RUN mkdir -p apps packages/db
COPY apps/sim/package.json ./apps/sim/package.json
COPY packages/db/package.json ./packages/db/package.json

# Install turbo globally, then dependencies, then rebuild isolated-vm for Node.js
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install -g turbo && \
    HUSKY=0 bun install --omit=dev --ignore-scripts && \
    cd $(readlink -f node_modules/isolated-vm) && npx node-gyp rebuild --release && cd /app

# ========================================
# Builder Stage: Build the Application
# ========================================
FROM base AS builder
WORKDIR /app

# Install turbo globally (cached for fast reinstall)
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install -g turbo

# Copy node_modules from deps stage (cached if dependencies don't change)
COPY --from=deps /app/node_modules ./node_modules

# Copy package configuration files (needed for build)
COPY package.json bun.lock turbo.json ./
COPY apps/sim/package.json ./apps/sim/package.json
COPY packages/db/package.json ./packages/db/package.json

# Copy workspace configuration files (needed for turbo)
COPY apps/sim/next.config.ts ./apps/sim/next.config.ts
COPY apps/sim/tsconfig.json ./apps/sim/tsconfig.json
COPY apps/sim/tailwind.config.ts ./apps/sim/tailwind.config.ts
COPY apps/sim/postcss.config.mjs ./apps/sim/postcss.config.mjs

# Copy source code (changes most frequently - placed last to maximize cache hits)
COPY apps/sim ./apps/sim
COPY packages ./packages

# Required for standalone nextjs build
WORKDIR /app/apps/sim
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    HUSKY=0 bun install sharp

ENV NEXT_TELEMETRY_DISABLED=1 \
    VERCEL_TELEMETRY_DISABLED=1 \
    DOCKER_BUILD=1

WORKDIR /app

# Provide dummy database URLs during image build so server code that imports @sim/db
# can be evaluated without crashing. Runtime environments should override these.
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}

# Provide dummy NEXT_PUBLIC_APP_URL for build-time evaluation
# Runtime environments should override this with the actual URL
ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN bun run build

# ========================================
# Runner Stage: Run the actual app
# ========================================

FROM base AS runner
WORKDIR /app

# Install Node.js 22 (for isolated-vm worker), Python, and other runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv bash ffmpeg curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Create non-root user and group
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs nextjs

# Copy application artifacts from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/public ./apps/sim/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/.next/static ./apps/sim/.next/static

# Copy isolated-vm native module (compiled for Node.js in deps stage)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/isolated-vm ./node_modules/isolated-vm

# Copy the isolated-vm worker script
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/lib/execution/isolated-vm-worker.cjs ./apps/sim/lib/execution/isolated-vm-worker.cjs

# Guardrails setup (files need to be owned by nextjs for runtime)
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/lib/guardrails/setup.sh ./apps/sim/lib/guardrails/setup.sh
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/lib/guardrails/requirements.txt ./apps/sim/lib/guardrails/requirements.txt
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim/lib/guardrails/validate_pii.py ./apps/sim/lib/guardrails/validate_pii.py

# Run guardrails setup as root, then fix ownership of generated venv files
RUN chmod +x ./apps/sim/lib/guardrails/setup.sh && \
    cd ./apps/sim/lib/guardrails && \
    ./setup.sh && \
    chown -R nextjs:nodejs /app/apps/sim/lib/guardrails

# Create .next/cache directory with correct ownership
RUN mkdir -p apps/sim/.next/cache && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["bun", "apps/sim/server.js"]
```

--------------------------------------------------------------------------------

---[FILE: db.Dockerfile]---
Location: sim-main/docker/db.Dockerfile

```text
# ========================================
# Base Stage: Alpine Linux with Bun
# ========================================
FROM oven/bun:1.3.3-alpine AS base

# ========================================
# Dependencies Stage: Install Dependencies
# ========================================
FROM base AS deps
WORKDIR /app

# Copy only package files needed for migrations (these change less frequently)
COPY package.json bun.lock turbo.json ./
RUN mkdir -p packages/db
COPY packages/db/package.json ./packages/db/package.json

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --ignore-scripts

# ========================================
# Runner Stage: Production Environment
# ========================================
FROM base AS runner
WORKDIR /app

# Create non-root user and group (cached separately)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy only the necessary files from deps (cached if dependencies don't change)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy package configuration files (needed for migrations)
COPY --chown=nextjs:nodejs packages/db/drizzle.config.ts ./packages/db/drizzle.config.ts

# Copy database package source code (changes most frequently - placed last)
COPY --chown=nextjs:nodejs packages/db ./packages/db

# Switch to non-root user
USER nextjs

WORKDIR /app/packages/db
```

--------------------------------------------------------------------------------

---[FILE: realtime.Dockerfile]---
Location: sim-main/docker/realtime.Dockerfile

```text
# ========================================
# Base Stage: Alpine Linux with Bun
# ========================================
FROM oven/bun:1.3.3-alpine AS base

# ========================================
# Dependencies Stage: Install Dependencies
# ========================================
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lock turbo.json ./
RUN mkdir -p apps packages/db
COPY apps/sim/package.json ./apps/sim/package.json
COPY packages/db/package.json ./packages/db/package.json

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --omit=dev --ignore-scripts

# ========================================
# Builder Stage: Prepare source code
# ========================================
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage (cached if dependencies don't change)
COPY --from=deps /app/node_modules ./node_modules

# Copy package configuration files (needed for build)
COPY package.json bun.lock turbo.json ./
COPY apps/sim/package.json ./apps/sim/package.json
COPY packages/db/package.json ./packages/db/package.json

# Copy source code (changes most frequently - placed last to maximize cache hits)
COPY apps/sim ./apps/sim
COPY packages ./packages

# ========================================
# Runner Stage: Run the Socket Server
# ========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user and group (cached separately)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package.json first (changes less frequently)
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy node_modules from builder (cached if dependencies don't change)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy db package (needed by socket-server)
COPY --from=builder --chown=nextjs:nodejs /app/packages/db ./packages/db

# Copy sim app (changes most frequently - placed last)
COPY --from=builder --chown=nextjs:nodejs /app/apps/sim ./apps/sim

# Switch to non-root user
USER nextjs

# Expose socket server port (default 3002, but configurable via PORT env var)
EXPOSE 3002
ENV PORT=3002 \
    SOCKET_PORT=3002 \
    HOSTNAME="0.0.0.0"

# Run the socket server directly
CMD ["bun", "apps/sim/socket-server/index.ts"]
```

--------------------------------------------------------------------------------

---[FILE: .helmignore]---
Location: sim-main/helm/sim/.helmignore

```text
# Patterns to ignore when building packages.
# This supports shell glob matching, relative path matching, and
# negation (prefixed with !). Only one pattern per line.
.DS_Store
# Common VCS dirs
.git/
.gitignore
.bzr/
.bzrignore
.hg/
.hgignore
.svn/
# Common backup files
*.swp
*.bak
*.tmp
*.orig
*~
# Various IDEs
.project
.idea/
*.tmproj
.vscode/
# Examples directory (included in chart but ignored during packaging)
examples/
# Test files
*_test.yaml
test/
```

--------------------------------------------------------------------------------

---[FILE: Chart.yaml]---
Location: sim-main/helm/sim/Chart.yaml
Signals: Next.js

```yaml
apiVersion: v2
name: sim
description: A Helm chart for Sim - AI agent workflow platform
type: application
version: 0.1.0
appVersion: "1.0.0"
home: https://sim.ai
icon: https://raw.githubusercontent.com/simstudioai/sim/main/apps/sim/public/sim.svg
sources:
  - https://github.com/simstudioai/sim
maintainers:
  - name: Sim Team
    email: help@sim.ai
    url: https://sim.ai
keywords:
  - ai
  - workflow
  - automation
  - agents
  - nextjs
annotations:
  category: AI/ML Platform
  licenses: Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/helm/sim/README.md

```text
# Sim Helm Chart

This Helm chart deploys Sim, a lightweight AI agent workflow platform, on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- PV provisioner support in the underlying infrastructure (for persistent storage)

## Installation

### Quick Start

Install the chart from this repository:

```bash
# From the repository root
helm install sim ./helm/sim
```

### Custom Configuration

Install with custom values:

```bash
helm install sim ./helm/sim -f custom-values.yaml
```

## Configuration Examples

The chart includes several pre-configured values files for different scenarios:

| Example File | Description | Use Case |
|-------------|-------------|----------|
| `values-development.yaml` | Minimal resources, no SSL | Local development and testing |
| `values-production.yaml` | High availability, security-focused | Generic production deployment |
| `values-external-db.yaml` | External database configuration | Production with managed database |
| `values-azure.yaml` | Azure AKS optimized | Azure Kubernetes Service |
| `values-aws.yaml` | AWS EKS optimized | Amazon Elastic Kubernetes Service |
| `values-gcp.yaml` | GCP GKE optimized | Google Kubernetes Engine |

### Development Environment

```bash
helm install sim-dev ./helm/sim \
  --values ./helm/sim/examples/values-development.yaml \
  --namespace simstudio-dev --create-namespace
```

### Production Environment

```bash
helm install sim-prod ./helm/sim \
  --values ./helm/sim/examples/values-production.yaml \
  --namespace simstudio-prod --create-namespace
```

### Azure Environment

```bash
helm install sim-azure ./helm/sim \
  --values ./helm/sim/examples/values-azure.yaml \
  --namespace simstudio --create-namespace
```

### AWS Environment (EKS)

```bash
helm install sim-aws ./helm/sim \
  --values ./helm/sim/examples/values-aws.yaml \
  --namespace simstudio --create-namespace
```

### GCP Environment (GKE)

```bash
helm install sim-gcp ./helm/sim \
  --values ./helm/sim/examples/values-gcp.yaml \
  --namespace simstudio --create-namespace
```

### External Database (Managed Services)

```bash
helm install sim-prod ./helm/sim \
  --values ./helm/sim/examples/values-external-db.yaml \
  --set externalDatabase.host="your-rds-endpoint.com" \
  --set externalDatabase.username="simstudio_user" \
  --set externalDatabase.password="secure-password" \
  --set externalDatabase.database="simstudio_prod" \
  --namespace simstudio --create-namespace
```

## Cloud-Specific Features

Each cloud platform example includes optimized configurations:

### Azure (AKS)
- **Storage**: Premium managed disks (`managed-csi-premium`)
- **Node Selectors**: Role-based node targeting (`node-role: application`, `node-role: datalake`)
- **GPU Support**: NVIDIA GPU nodes with tolerations
- **Ingress**: NGINX ingress controller with SSL redirect

### AWS (EKS)
- **Storage**: EBS GP3 volumes for optimal performance
- **EBS CSI Driver**: Required for persistent storage (install as EKS add-on)
- **Node Selectors**: Instance type targeting (`t3.large`, `r5.large`, `g4dn.xlarge`)
- **GPU Support**: GPU-optimized instances (G4, P3 families)
- **Ingress**: Application Load Balancer (ALB) with AWS Certificate Manager
- **IAM**: Service Account annotations for IAM roles

**Prerequisites for AWS:**
```bash
# Install EBS CSI driver add-on
aws eks create-addon --cluster-name your-cluster --addon-name aws-ebs-csi-driver

# Create IAM role for EBS CSI driver (if using IRSA)
aws iam create-role --role-name AmazonEKS_EBS_CSI_DriverRole \
  --assume-role-policy-document file://ebs-csi-trust-policy.json
aws iam attach-role-policy --role-name AmazonEKS_EBS_CSI_DriverRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy
```

### GCP (GKE)
- **Storage**: Persistent Disk with standard and premium options
- **Node Selectors**: Node pool and machine family targeting
- **GPU Support**: Tesla T4/V100 GPUs with GKE accelerator labels
- **Ingress**: Google Cloud Load Balancer with managed certificates
- **Workload Identity**: Service Account annotations for GCP IAM

## Configuration

The following table lists the configurable parameters and their default values.

### Global Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.imageRegistry` | Global Docker image registry | `"ghcr.io"` |
| `global.useRegistryForAllImages` | Use custom registry for all images (not just simstudioai/*) | `false` |
| `global.imagePullSecrets` | Global Docker registry secret names | `[]` |
| `global.storageClass` | Global storage class for PVCs | `""` |
| `global.commonLabels` | Common labels to add to all resources | `{}` |

### Application Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `app.enabled` | Enable the main application | `true` |
| `app.replicaCount` | Number of app replicas | `1` |
| `app.image.repository` | App image repository | `simstudioai/sim` |
| `app.image.tag` | App image tag | `latest` |
| `app.image.pullPolicy` | App image pull policy | `Always` |
| `app.resources` | App resource limits and requests | See values.yaml |
| `app.nodeSelector` | App node selector | `{}` |
| `app.podSecurityContext` | App pod security context | `fsGroup: 1001` |
| `app.securityContext` | App container security context | `runAsNonRoot: true, runAsUser: 1001` |
| `app.service.type` | App service type | `ClusterIP` |
| `app.service.port` | App service port | `3000` |
| `app.service.targetPort` | App service target port | `3000` |
| `app.livenessProbe` | App liveness probe configuration | See values.yaml |
| `app.readinessProbe` | App readiness probe configuration | See values.yaml |
| `app.env` | App environment variables | See values.yaml |

### Realtime Service Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `realtime.enabled` | Enable the realtime service | `true` |
| `realtime.replicaCount` | Number of realtime replicas | `1` |
| `realtime.image.repository` | Realtime image repository | `simstudioai/realtime` |
| `realtime.image.tag` | Realtime image tag | `latest` |
| `realtime.image.pullPolicy` | Realtime image pull policy | `Always` |
| `realtime.resources` | Realtime resource limits and requests | See values.yaml |
| `realtime.nodeSelector` | Realtime node selector | `{}` |
| `realtime.podSecurityContext` | Realtime pod security context | `fsGroup: 1001` |
| `realtime.securityContext` | Realtime container security context | `runAsNonRoot: true, runAsUser: 1001` |
| `realtime.service.type` | Realtime service type | `ClusterIP` |
| `realtime.service.port` | Realtime service port | `3002` |
| `realtime.service.targetPort` | Realtime service target port | `3002` |
| `realtime.livenessProbe` | Realtime liveness probe configuration | See values.yaml |
| `realtime.readinessProbe` | Realtime readiness probe configuration | See values.yaml |
| `realtime.env` | Realtime environment variables | See values.yaml |

### PostgreSQL Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgresql.enabled` | Enable internal PostgreSQL | `true` |
| `postgresql.image.repository` | PostgreSQL image repository | `pgvector/pgvector` |
| `postgresql.image.tag` | PostgreSQL image tag | `pg17` |
| `postgresql.image.pullPolicy` | PostgreSQL image pull policy | `IfNotPresent` |
| `postgresql.auth.username` | PostgreSQL username | `postgres` |
| `postgresql.auth.password` | PostgreSQL password | `""` (REQUIRED) |
| `postgresql.auth.database` | PostgreSQL database name | `sim` |
| `postgresql.nodeSelector` | PostgreSQL node selector | `{}` |
| `postgresql.resources` | PostgreSQL resource limits and requests | See values.yaml |
| `postgresql.podSecurityContext` | PostgreSQL pod security context | `fsGroup: 999` |
| `postgresql.securityContext` | PostgreSQL container security context | `runAsUser: 999` |
| `postgresql.persistence.enabled` | Enable PostgreSQL persistence | `true` |
| `postgresql.persistence.storageClass` | PostgreSQL storage class | `""` |
| `postgresql.persistence.size` | PostgreSQL PVC size | `10Gi` |
| `postgresql.persistence.accessModes` | PostgreSQL PVC access modes | `["ReadWriteOnce"]` |
| `postgresql.tls.enabled` | Enable PostgreSQL SSL/TLS | `false` |
| `postgresql.tls.certificatesSecret` | PostgreSQL TLS certificates secret | `postgres-tls-secret` |
| `postgresql.config.maxConnections` | PostgreSQL max connections | `1000` |
| `postgresql.config.sharedBuffers` | PostgreSQL shared buffers | `"1280MB"` |
| `postgresql.config.maxWalSize` | PostgreSQL max WAL size | `"4GB"` |
| `postgresql.config.minWalSize` | PostgreSQL min WAL size | `"80MB"` |
| `postgresql.service.type` | PostgreSQL service type | `ClusterIP` |
| `postgresql.service.port` | PostgreSQL service port | `5432` |
| `postgresql.service.targetPort` | PostgreSQL service target port | `5432` |
| `postgresql.livenessProbe` | PostgreSQL liveness probe configuration | See values.yaml |
| `postgresql.readinessProbe` | PostgreSQL readiness probe configuration | See values.yaml |

### External Database Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `externalDatabase.enabled` | Use external database instead of internal PostgreSQL | `false` |
| `externalDatabase.host` | External database host | `"external-db.example.com"` |
| `externalDatabase.port` | External database port | `5432` |
| `externalDatabase.username` | External database username | `postgres` |
| `externalDatabase.password` | External database password | `""` |
| `externalDatabase.database` | External database name | `sim` |
| `externalDatabase.sslMode` | External database SSL mode | `require` |

### Ollama Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ollama.enabled` | Enable Ollama for local AI models | `false` |
| `ollama.image.repository` | Ollama image repository | `ollama/ollama` |
| `ollama.image.tag` | Ollama image tag | `latest` |
| `ollama.image.pullPolicy` | Ollama image pull policy | `Always` |
| `ollama.replicaCount` | Number of Ollama replicas | `1` |
| `ollama.gpu.enabled` | Enable GPU support for Ollama | `false` |
| `ollama.gpu.count` | Number of GPUs to allocate | `1` |
| `ollama.nodeSelector` | Ollama node selector | `accelerator: nvidia` |
| `ollama.tolerations` | Ollama tolerations for GPU nodes | See values.yaml |
| `ollama.resources` | Ollama resource limits and requests | See values.yaml |
| `ollama.env` | Ollama environment variables | See values.yaml |
| `ollama.persistence.enabled` | Enable Ollama persistence | `true` |
| `ollama.persistence.storageClass` | Ollama storage class | `""` |
| `ollama.persistence.size` | Ollama PVC size | `100Gi` |
| `ollama.persistence.accessModes` | Ollama PVC access modes | `["ReadWriteOnce"]` |
| `ollama.service.type` | Ollama service type | `ClusterIP` |
| `ollama.service.port` | Ollama service port | `11434` |
| `ollama.service.targetPort` | Ollama service target port | `11434` |
| `ollama.startupProbe` | Ollama startup probe configuration | See values.yaml |
| `ollama.livenessProbe` | Ollama liveness probe configuration | See values.yaml |
| `ollama.readinessProbe` | Ollama readiness probe configuration | See values.yaml |

### Ingress Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.className` | Ingress class name | `nginx` |
| `ingress.annotations` | Ingress annotations | See values.yaml |
| `ingress.app.host` | App ingress hostname | `sim.local` |
| `ingress.app.paths` | App ingress paths | `[{path: "/", pathType: "Prefix"}]` |
| `ingress.realtime.host` | Realtime ingress hostname | `sim-ws.local` |
| `ingress.realtime.paths` | Realtime ingress paths | `[{path: "/", pathType: "Prefix"}]` |
| `ingress.tls.enabled` | Enable TLS for ingress | `false` |
| `ingress.tls.secretName` | TLS secret name | `sim-tls-secret` |

### Autoscaling Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `autoscaling.enabled` | Enable Horizontal Pod Autoscaler | `false` |
| `autoscaling.minReplicas` | Minimum number of replicas | `1` |
| `autoscaling.maxReplicas` | Maximum number of replicas | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | Target CPU utilization | `80` |
| `autoscaling.targetMemoryUtilizationPercentage` | Target memory utilization | `80` |
| `autoscaling.customMetrics` | Custom metrics for scaling | `[]` |
| `autoscaling.behavior` | Scaling behavior configuration | `{}` |

### Monitoring Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `monitoring.serviceMonitor.enabled` | Enable ServiceMonitor for Prometheus | `false` |
| `monitoring.serviceMonitor.labels` | Additional labels for ServiceMonitor | `{}` |
| `monitoring.serviceMonitor.annotations` | Additional annotations for ServiceMonitor | `{}` |
| `monitoring.serviceMonitor.path` | Metrics endpoint path | `/metrics` |
| `monitoring.serviceMonitor.interval` | Scrape interval | `30s` |
| `monitoring.serviceMonitor.scrapeTimeout` | Scrape timeout | `10s` |
| `monitoring.serviceMonitor.targetLabels` | Target labels to add to scraped metrics | `[]` |
| `monitoring.serviceMonitor.metricRelabelings` | Metric relabeling configurations | `[]` |
| `monitoring.serviceMonitor.relabelings` | Relabeling configurations | `[]` |

### Security Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `networkPolicy.enabled` | Enable network policies | `false` |
| `networkPolicy.ingress` | Custom ingress rules | `[]` |
| `networkPolicy.egress` | Custom egress rules | `[]` |
| `podDisruptionBudget.enabled` | Enable pod disruption budget | `false` |
| `podDisruptionBudget.minAvailable` | Minimum available pods | `1` |

### Migration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `migrations.enabled` | Enable database migrations job | `true` |
| `migrations.image.repository` | Migrations image repository | `simstudioai/migrations` |
| `migrations.image.tag` | Migrations image tag | `latest` |
| `migrations.image.pullPolicy` | Migrations image pull policy | `Always` |
| `migrations.resources` | Migrations resource limits and requests | See values.yaml |
| `migrations.podSecurityContext` | Migrations pod security context | `fsGroup: 1001` |
| `migrations.securityContext` | Migrations container security context | `runAsNonRoot: true, runAsUser: 1001` |

### CronJob Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `cronjobs.enabled` | Enable all scheduled cron jobs | `true` |
| `cronjobs.image.repository` | CronJob image repository for HTTP requests | `curlimages/curl` |
| `cronjobs.image.tag` | CronJob image tag | `8.5.0` |
| `cronjobs.image.pullPolicy` | CronJob image pull policy | `IfNotPresent` |
| `cronjobs.resources` | CronJob resource limits and requests | See values.yaml |
| `cronjobs.restartPolicy` | CronJob pod restart policy | `OnFailure` |
| `cronjobs.activeDeadlineSeconds` | CronJob active deadline in seconds | `300` |
| `cronjobs.startingDeadlineSeconds` | CronJob starting deadline in seconds | `60` |
| `cronjobs.podSecurityContext` | CronJob pod security context | `fsGroup: 1001` |
| `cronjobs.securityContext` | CronJob container security context | `runAsNonRoot: true, runAsUser: 1001` |
| `cronjobs.jobs.scheduleExecution.enabled` | Enable schedule execution cron job | `true` |
| `cronjobs.jobs.scheduleExecution.name` | Schedule execution job name | `schedule-execution` |
| `cronjobs.jobs.scheduleExecution.schedule` | Schedule execution cron schedule | `"*/1 * * * *"` |
| `cronjobs.jobs.scheduleExecution.path` | Schedule execution API path | `"/api/schedules/execute"` |
| `cronjobs.jobs.scheduleExecution.concurrencyPolicy` | Schedule execution concurrency policy | `Forbid` |
| `cronjobs.jobs.scheduleExecution.successfulJobsHistoryLimit` | Schedule execution successful jobs history | `3` |
| `cronjobs.jobs.scheduleExecution.failedJobsHistoryLimit` | Schedule execution failed jobs history | `1` |
| `cronjobs.jobs.gmailWebhookPoll.enabled` | Enable Gmail webhook polling cron job | `true` |
| `cronjobs.jobs.gmailWebhookPoll.name` | Gmail webhook polling job name | `gmail-webhook-poll` |
| `cronjobs.jobs.gmailWebhookPoll.schedule` | Gmail webhook polling cron schedule | `"*/1 * * * *"` |
| `cronjobs.jobs.gmailWebhookPoll.path` | Gmail webhook polling API path | `"/api/webhooks/poll/gmail"` |
| `cronjobs.jobs.gmailWebhookPoll.concurrencyPolicy` | Gmail webhook polling concurrency policy | `Forbid` |
| `cronjobs.jobs.gmailWebhookPoll.successfulJobsHistoryLimit` | Gmail webhook polling successful jobs history | `3` |
| `cronjobs.jobs.gmailWebhookPoll.failedJobsHistoryLimit` | Gmail webhook polling failed jobs history | `1` |
| `cronjobs.jobs.outlookWebhookPoll.enabled` | Enable Outlook webhook polling cron job | `true` |
| `cronjobs.jobs.outlookWebhookPoll.name` | Outlook webhook polling job name | `outlook-webhook-poll` |
| `cronjobs.jobs.outlookWebhookPoll.schedule` | Outlook webhook polling cron schedule | `"*/1 * * * *"` |
| `cronjobs.jobs.outlookWebhookPoll.path` | Outlook webhook polling API path | `"/api/webhooks/poll/outlook"` |
| `cronjobs.jobs.outlookWebhookPoll.concurrencyPolicy` | Outlook webhook polling concurrency policy | `Forbid` |
| `cronjobs.jobs.outlookWebhookPoll.successfulJobsHistoryLimit` | Outlook webhook polling successful jobs history | `3` |
| `cronjobs.jobs.outlookWebhookPoll.failedJobsHistoryLimit` | Outlook webhook polling failed jobs history | `1` |

### Shared Storage Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `sharedStorage.enabled` | Enable shared storage for multi-pod data sharing | `false` |
| `sharedStorage.storageClass` | Storage class for shared volumes (must support ReadWriteMany) | `""` |
| `sharedStorage.defaultAccessModes` | Default access modes for shared volumes | `["ReadWriteMany"]` |
| `sharedStorage.volumes` | Array of shared volume definitions | `[]` |
| `sharedStorage.volumes[].name` | Shared volume name | Required |
| `sharedStorage.volumes[].size` | Shared volume size | Required |
| `sharedStorage.volumes[].accessModes` | Shared volume access modes | Uses default |
| `sharedStorage.volumes[].storageClass` | Shared volume storage class | Uses global |
| `sharedStorage.volumes[].annotations` | Shared volume annotations | `{}` |
| `sharedStorage.volumes[].selector` | Shared volume selector | `{}` |

### Telemetry Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `telemetry.enabled` | Enable telemetry and observability collection | `false` |
| `telemetry.replicaCount` | Number of telemetry collector replicas | `1` |
| `telemetry.image.repository` | Telemetry collector image repository | `otel/opentelemetry-collector-contrib` |
| `telemetry.image.tag` | Telemetry collector image tag | `0.91.0` |
| `telemetry.image.pullPolicy` | Telemetry collector image pull policy | `IfNotPresent` |
| `telemetry.resources` | Telemetry collector resource limits and requests | See values.yaml |
| `telemetry.nodeSelector` | Telemetry collector node selector | `{}` |
| `telemetry.tolerations` | Telemetry collector tolerations | `[]` |
| `telemetry.affinity` | Telemetry collector affinity | `{}` |
| `telemetry.service.type` | Telemetry collector service type | `ClusterIP` |
| `telemetry.jaeger.enabled` | Enable Jaeger tracing backend | `false` |
| `telemetry.jaeger.endpoint` | Jaeger collector endpoint | `"http://jaeger-collector:14250"` |
| `telemetry.jaeger.tls.enabled` | Enable TLS for Jaeger connection | `false` |
| `telemetry.prometheus.enabled` | Enable Prometheus metrics backend | `false` |
| `telemetry.prometheus.endpoint` | Prometheus remote write endpoint | `"http://prometheus-server/api/v1/write"` |
| `telemetry.prometheus.auth` | Prometheus authentication header | `""` |
| `telemetry.otlp.enabled` | Enable generic OTLP backend | `false` |
| `telemetry.otlp.endpoint` | OTLP collector endpoint | `"http://otlp-collector:4317"` |
| `telemetry.otlp.tls.enabled` | Enable TLS for OTLP connection | `false` |

### Service Account Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `serviceAccount.create` | Create a service account | `true` |
| `serviceAccount.annotations` | Service account annotations | `{}` |
| `serviceAccount.name` | Service account name (auto-generated if empty) | `""` |

### Common Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `nameOverride` | Override the name of the chart | `""` |
| `fullnameOverride` | Override the fullname of the chart | `""` |
| `extraVolumes` | Additional volumes for all pods | `[]` |
| `extraVolumeMounts` | Additional volume mounts for all containers | `[]` |
| `extraEnvVars` | Additional environment variables for all containers | `[]` |
| `podAnnotations` | Additional annotations for all pods | `{}` |
| `podLabels` | Additional labels for all pods | `{}` |
| `affinity` | Affinity settings for all pods | `{}` |
| `tolerations` | Tolerations for all pods | `[]` |

## Enterprise Features

### Autoscaling

Enable automatic horizontal scaling based on CPU and memory usage:

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80
```

### Shared Storage

Enable shared storage for multi-pod data sharing and enterprise workflows:

```yaml
sharedStorage:
  enabled: true
  storageClass: "managed-csi-premium"
  volumes:
    - name: output-share
      size: 100Gi
      accessModes:
        - ReadWriteMany
    - name: model-share
      size: 200Gi
      accessModes:
        - ReadWriteMany
    - name: logs-share
      size: 50Gi
      accessModes:
        - ReadWriteMany
```

This creates persistent volume claims that can be shared across multiple pods for:
- Output data sharing between workflow steps
- Model storage and caching
- Centralized logging and audit trails
- Temporary data exchange

### Telemetry and Observability

Enable comprehensive telemetry collection with OpenTelemetry:

```yaml
telemetry:
  enabled: true
  resources:
    limits:
      memory: "1Gi"
      cpu: "500m"
    requests:
      memory: "512Mi"
      cpu: "200m"
  
  # Enable Jaeger for distributed tracing
  jaeger:
    enabled: true
    endpoint: "http://jaeger-collector:14250"
  
  # Enable Prometheus for metrics
  prometheus:
    enabled: true
    endpoint: "http://prometheus-server/api/v1/write"
    auth: "Bearer your-prometheus-token"
  
  # Enable generic OTLP for flexibility
  otlp:
    enabled: true
    endpoint: "http://otlp-collector:4317"
```

This automatically configures:
- OpenTelemetry Collector for metrics, traces, and logs
- Automatic service discovery for Sim components
- Environment variable injection for applications
- Support for multiple observability backends

### GPU Support

Enable GPU device plugin support for AI workloads:

```yaml
ollama:
  enabled: true
  gpu:
    enabled: true
    count: 1
  nodeSelector:
    accelerator: nvidia
  tolerations:
    - key: "sku"
      operator: "Equal"
      value: "gpu"
      effect: "NoSchedule"
```

This deploys:
- NVIDIA Device Plugin DaemonSet
- RuntimeClass for NVIDIA container runtime
- Proper node scheduling and resource allocation

### Monitoring Integration

Enable Prometheus monitoring with ServiceMonitor:

```yaml
monitoring:
  serviceMonitor:
    enabled: true
    labels:
      monitoring: "prometheus"
    interval: 15s
```

### Network Security

Enable network policies for micro-segmentation:

```yaml
networkPolicy:
  enabled: true
```

This creates network policies that:
- Allow communication between Sim components
- Restrict unnecessary network access
- Permit DNS resolution and HTTPS egress
- Support custom ingress/egress rules

### CronJobs for Scheduled Tasks

Enable automated scheduled tasks functionality:

```yaml
cronjobs:
  enabled: true
  
  # Customize individual jobs
  jobs:
    scheduleExecution:
      enabled: true
      schedule: "*/1 * * * *"  # Every minute
    
    gmailWebhookPoll:
      enabled: true
      schedule: "*/1 * * * *"  # Every minute
    
    outlookWebhookPoll:
      enabled: true
      schedule: "*/1 * * * *"  # Every minute
    
      
  # Global job configuration
  resources:
    limits:
      memory: "256Mi"
      cpu: "200m"
    requests:
      memory: "128Mi"
      cpu: "100m"
```

This creates Kubernetes CronJob resources that:
- Execute HTTP requests to your application's API endpoints
- Handle retries and error logging automatically
- Use minimal resources with curl-based containers
- Support individual enable/disable per job
- Follow Kubernetes security best practices

### High Availability

Configure pod disruption budgets and anti-affinity:

```yaml
podDisruptionBudget:
  enabled: true
  minAvailable: 1

affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: app.kubernetes.io/name
                operator: In
                values: ["simstudio"]
          topologyKey: kubernetes.io/hostname
```

## Upgrading

To upgrade your release:

```bash
helm upgrade sim ./helm/sim
```

## Uninstalling

To uninstall/delete the release:

```bash
helm uninstall sim
```

## Security Considerations

### Production Secrets

For production deployments, make sure to:

1. **Change default secrets**: Update `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, and `INTERNAL_API_SECRET` with secure, randomly generated values using `openssl rand -hex 32`
2. **Use strong database passwords**: Set `postgresql.auth.password` to a strong password
3. **Enable TLS**: Configure `postgresql.tls.enabled=true` and provide proper certificates
4. **Configure ingress TLS**: Enable HTTPS with proper SSL certificates

**Required Secrets:**
- `BETTER_AUTH_SECRET`: Authentication JWT signing (minimum 32 characters)
- `ENCRYPTION_KEY`: Encrypts sensitive data like environment variables (minimum 32 characters)
- `INTERNAL_API_SECRET`: Internal service-to-service authentication (minimum 32 characters)

**Optional Security (Recommended for Production):**
- `CRON_SECRET`: Authenticates scheduled job requests to API endpoints (required only if `cronjobs.enabled=true`)
- `API_ENCRYPTION_KEY`: Encrypts API keys at rest in database (must be exactly 64 hex characters). If not set, API keys are stored in plain text. Generate using: `openssl rand -hex 32` (outputs 64 hex chars representing 32 bytes)

### Example secure values:

```yaml
app:
  env:
    BETTER_AUTH_SECRET: "your-secure-random-string-here"
    ENCRYPTION_KEY: "your-secure-encryption-key-here"
    INTERNAL_API_SECRET: "your-secure-internal-api-secret-here"
    CRON_SECRET: "your-secure-cron-secret-here"
    API_ENCRYPTION_KEY: "your-64-char-hex-string-for-api-key-encryption"  # Optional but recommended

postgresql:
  auth:
    password: "your-secure-database-password"
  tls:
    enabled: true
    certificatesSecret: "postgres-tls-secret"

ingress:
  enabled: true
  tls:
    enabled: true
    secretName: "simstudio-tls-secret"
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check if PostgreSQL pod is running: `kubectl get pods -l app.kubernetes.io/component=postgresql`
   - Verify database credentials in the secret: `kubectl get secret <release>-postgresql-secret -o yaml`

2. **Migration Issues**
   - Check migration job logs: `kubectl logs job/<release>-migrations`
   - Ensure database is accessible from the migration job

3. **Image Pull Issues**
   - Verify image names and tags in values.yaml
   - Check if image pull secrets are configured correctly

### Getting Logs

```bash
# App logs
kubectl logs deployment/<release>-app

# Realtime logs
kubectl logs deployment/<release>-realtime

# PostgreSQL logs
kubectl logs statefulset/<release>-postgresql

# Migration logs
kubectl logs job/<release>-migrations
```

## Support

- Documentation: https://docs.sim.ai
- GitHub Issues: https://github.com/simstudioai/sim/issues
- Discord: https://discord.gg/Hr4UWYEcTT
```

--------------------------------------------------------------------------------

````
