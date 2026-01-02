---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 801
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 801 of 933)

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

---[FILE: values-copilot.yaml]---
Location: sim-main/helm/sim/examples/values-copilot.yaml
Signals: Docker

```yaml
# Enable the copilot service
copilot:
  enabled: true
  
  # Server configuration
  server:
    image:
      repository: simstudioai/copilot
      tag: latest
      pullPolicy: Always
    
    replicaCount: 2
    
    # Node scheduling (OPTIONAL)
    # By default, copilot runs on the same nodes as the main Sim platform
    nodeSelector: {}
    # nodeSelector:
    #   workload-type: copilot
    
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "1Gi"
        cpu: "500m"
    
    # Required secrets (set via values or provide your own secret)
    env:
      PORT: "8080"
      SERVICE_NAME: "copilot"
      ENVIRONMENT: "production"
      AGENT_API_DB_ENCRYPTION_KEY: ""          # openssl rand -hex 32
      INTERNAL_API_SECRET: ""                  # reuse Sim INTERNAL_API_SECRET
      LICENSE_KEY: ""                          # Provided by Sim team
      OPENAI_API_KEY_1: ""                     # At least one provider key required
      ANTHROPIC_API_KEY_1: ""                  # Optional secondary provider
      SIM_BASE_URL: "https://sim.example.com"  # Base URL for Sim deployment
      SIM_AGENT_API_KEY: ""                    # Must match SIM-side COPILOT_API_KEY
      REDIS_URL: "redis://default:password@redis:6379"
      # Optional configuration
      LOG_LEVEL: "info"
      CORS_ALLOWED_ORIGINS: "https://sim.example.com"
      OTEL_EXPORTER_OTLP_ENDPOINT: ""
    
    # Create a Secret from the values above. Set create=false to reference an existing secret instead.
    secret:
      create: true
      name: ""
      annotations: {}
    
    extraEnv: []
    extraEnvFrom: []
    
    service:
      type: ClusterIP
      port: 8080
      targetPort: 8080
  
  # Internal PostgreSQL database (disable to use an external database)
  postgresql:
    enabled: true
    
    image:
      repository: postgres
      tag: 16-alpine
      pullPolicy: IfNotPresent
    
    auth:
      username: copilot
      password: ""  # REQUIRED - set via --set copilot.postgresql.auth.password
      database: copilot
    
    nodeSelector: {}
    # nodeSelector:
    #   workload-type: copilot
    
    resources:
      limits:
        memory: "1Gi"
        cpu: "500m"
      requests:
        memory: "512Mi"
        cpu: "250m"
    
    persistence:
      enabled: true
      size: 10Gi
  
  # External database configuration (only used when postgresql.enabled=false)
  database:
    existingSecretName: ""
    secretKey: DATABASE_URL
    url: ""
  
  # Migration job
  migrations:
    enabled: true
    
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "100m"

# Optional: Configure ingress to expose copilot service
# Uncomment if you need external access to copilot
# ingress:
#   enabled: true
#   className: nginx
#   annotations:
#     cert-manager.io/cluster-issuer: letsencrypt-prod
#     nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
#   copilot:
#     host: copilot.yourdomain.com
#     paths:
#       - path: /
#         pathType: Prefix
#   tls:
#     enabled: true
#     secretName: copilot-tls-secret

# If using private Docker Hub repository
# global:
#   imagePullSecrets:
#     - name: dockerhub-secret
```

--------------------------------------------------------------------------------

---[FILE: values-development.yaml]---
Location: sim-main/helm/sim/examples/values-development.yaml

```yaml
# Development values for Sim
# This configuration is suitable for development and testing

# Global configuration
global:
  imageRegistry: "ghcr.io"

# Main application
app:
  enabled: true
  replicaCount: 1
  
  # Resource allocation for development environment
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  # Development URLs
  env:
    NEXT_PUBLIC_APP_URL: "http://localhost:3000"
    BETTER_AUTH_URL: "http://localhost:3000"
    NEXT_PUBLIC_SOCKET_URL: "http://localhost:3002"
    
    # Example secrets for development (replace with secure values for production)
    # For production, generate using: openssl rand -hex 32
    BETTER_AUTH_SECRET: "dev-32-char-auth-secret-not-secure-dev"
    ENCRYPTION_KEY: "dev-32-char-encryption-key-not-secure"
    INTERNAL_API_SECRET: "dev-32-char-internal-secret-not-secure"
    CRON_SECRET: "dev-32-char-cron-secret-not-for-prod"

    # Optional: API Key Encryption (leave empty for dev, encrypts API keys at rest)
    # For production, generate 64-char hex using: openssl rand -hex 32
    API_ENCRYPTION_KEY: ""  # Optional - if not set, API keys stored in plain text

# Realtime service
realtime:
  enabled: true
  replicaCount: 1
  
  # Resource allocation for realtime WebSocket service in development
  resources:
    limits:
      memory: "2Gi"
      cpu: "1000m"
    requests:
      memory: "1Gi"
      cpu: "500m"
  
  env:
    NEXT_PUBLIC_APP_URL: "http://localhost:3000"
    BETTER_AUTH_URL: "http://localhost:3000"
    NEXT_PUBLIC_SOCKET_URL: "http://localhost:3002"
    BETTER_AUTH_SECRET: "dev-32-char-auth-secret-not-secure-dev"
    ALLOWED_ORIGINS: "http://localhost:3000"

# Database migrations
migrations:
  enabled: true

# PostgreSQL database
postgresql:
  enabled: true
  
  # Simple authentication for development
  auth:
    username: postgres
    password: "postgres"
    database: simstudio
  
  # PostgreSQL with pgvector extension for vector operations
  image:
    repository: pgvector/pgvector
    tag: pg17
    pullPolicy: IfNotPresent
  
  # Minimal resource allocation for development PostgreSQL
  resources:
    limits:
      memory: "1Gi"
      cpu: "500m"
    requests:
      memory: "512Mi"
      cpu: "250m"
  
  # Persistence disabled for easier development (data will be lost on restart)
  persistence:
    enabled: false
  
  # SSL/TLS disabled for local development
  tls:
    enabled: false
  
  # Minimal PostgreSQL configuration for development
  config:
    maxConnections: 100
    sharedBuffers: "256MB"
    maxWalSize: "1GB"
    minWalSize: "80MB"

# Ollama AI models (disabled by default for development)
ollama:
  enabled: false

# Ingress (disabled for development - use port-forward for local access)
ingress:
  enabled: false

# Pod disruption budget (disabled for development)
podDisruptionBudget:
  enabled: false

# Network policies (disabled for development)
networkPolicy:
  enabled: false
```

--------------------------------------------------------------------------------

---[FILE: values-external-db.yaml]---
Location: sim-main/helm/sim/examples/values-external-db.yaml

```yaml
# External Database Example for Sim
# Use this configuration when connecting to a managed database service
# (AWS RDS, Azure Database, Google Cloud SQL, etc.)

# Global configuration
global:
  imageRegistry: "ghcr.io"

# Main application
app:
  enabled: true
  replicaCount: 2
  
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  env:
    NEXT_PUBLIC_APP_URL: "https://simstudio.acme.com"
    BETTER_AUTH_URL: "https://simstudio.acme.com"
    SOCKET_SERVER_URL: "https://simstudio-ws.acme.com"
    NEXT_PUBLIC_SOCKET_URL: "https://simstudio-ws.acme.com"
    
    # Security settings (REQUIRED - replace with your own secure secrets)
    # Generate using: openssl rand -hex 32
    BETTER_AUTH_SECRET: ""  # Set via --set flag or external secret manager
    ENCRYPTION_KEY: ""      # Set via --set flag or external secret manager
    INTERNAL_API_SECRET: "" # Set via --set flag or external secret manager
    CRON_SECRET: ""         # Set via --set flag or external secret manager

    # Optional: API Key Encryption (RECOMMENDED for production)
    # Generate 64-character hex string using: openssl rand -hex 32
    API_ENCRYPTION_KEY: ""  # Optional but recommended - encrypts API keys at rest
    
    NODE_ENV: "production"
    NEXT_TELEMETRY_DISABLED: "1"

# Realtime service
realtime:
  enabled: true
  replicaCount: 2
  
  resources:
    limits:
      memory: "4Gi"
      cpu: "1000m"
    requests:
      memory: "2Gi"
      cpu: "500m"
  
  env:
    NEXT_PUBLIC_APP_URL: "https://simstudio.acme.com"
    BETTER_AUTH_URL: "https://simstudio.acme.com"
    NEXT_PUBLIC_SOCKET_URL: "https://simstudio-ws.acme.com"
    BETTER_AUTH_SECRET: ""  # Must match main app secret - set via --set flag
    ALLOWED_ORIGINS: "https://simstudio.acme.com"
    NODE_ENV: "production"

# Database migrations
migrations:
  enabled: true
  
  resources:
    limits:
      memory: "2Gi"
      cpu: "1000m"
    requests:
      memory: "1Gi"
      cpu: "500m"

# Disable internal PostgreSQL
postgresql:
  enabled: false

# Configure external database connection
externalDatabase:
  enabled: true
  
  # Database connection details (REQUIRED - configure for your external database)
  host: ""                    # Database hostname (e.g., "postgres.acme.com" or RDS endpoint)
  port: 5432
  username: ""                # Database username (e.g., "simstudio_user")
  password: ""                # Database password - set via --set flag or external secret
  database: ""                # Database name (e.g., "simstudio_production")
  
  # SSL mode for database connections (recommended: 'require' for production)
  sslMode: "require"          # Options: disable, allow, prefer, require, verify-ca, verify-full

# Ollama (optional for AI models)
ollama:
  enabled: false

# Ingress configuration
ingress:
  enabled: true
  className: nginx
  
  annotations:
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  
  app:
    host: simstudio.acme.com
    paths:
      - path: /
        pathType: Prefix
  
  realtime:
    host: simstudio-ws.acme.com
    paths:
      - path: /
        pathType: Prefix
  
  tls:
    enabled: true
    secretName: simstudio-tls-secret

# Production-ready features (autoscaling, monitoring, etc.)
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

podDisruptionBudget:
  enabled: true
  minAvailable: null
  maxUnavailable: 1  
  unhealthyPodEvictionPolicy: AlwaysAllow 
monitoring:
  serviceMonitor:
    enabled: true
    labels:
      monitoring: "prometheus"
    interval: 15s

networkPolicy:
  enabled: true
  # Custom egress rules to allow database connectivity
  egress:
    - to: []  # Allow outbound connections to external database
      ports:
      - protocol: TCP
        port: 5432

# Example deployment command with secure secret generation:
# helm install sim ./helm/sim \
#   --values ./helm/sim/examples/values-external-db.yaml \
#   --set externalDatabase.host="your-db-host.com" \
#   --set externalDatabase.username="your-db-user" \
#   --set externalDatabase.password="your-db-password" \
#   --set externalDatabase.database="your-db-name" \
#   --set app.env.BETTER_AUTH_SECRET="$(openssl rand -hex 32)" \
#   --set app.env.ENCRYPTION_KEY="$(openssl rand -hex 32)" \
#   --set app.env.INTERNAL_API_SECRET="$(openssl rand -hex 32)" \
#   --set app.env.CRON_SECRET="$(openssl rand -hex 32)" \
#   --set app.env.API_ENCRYPTION_KEY="$(openssl rand -hex 32)" \
#   --set realtime.env.BETTER_AUTH_SECRET="$(openssl rand -hex 32)"
```

--------------------------------------------------------------------------------

---[FILE: values-gcp.yaml]---
Location: sim-main/helm/sim/examples/values-gcp.yaml

```yaml
# GCP-specific values for Sim 
# Example configuration for Google Kubernetes Engine (GKE) deployment

# Global configuration
global:
  imageRegistry: "ghcr.io"
  storageClass: "standard-rwo"

# Main application
app:
  enabled: true
  replicaCount: 2

  # Node selector for application pods
  # Uncomment and customize based on your GKE node labels:
  # nodeSelector:
  #   cloud.google.com/gke-nodepool: "default-pool"
  
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  # Production URLs (REQUIRED - update with your actual domain names)
  env:
    NEXT_PUBLIC_APP_URL: "https://simstudio.acme.com"
    BETTER_AUTH_URL: "https://simstudio.acme.com"
    # SOCKET_SERVER_URL is auto-detected (uses internal service http://sim-realtime:3002)
    NEXT_PUBLIC_SOCKET_URL: "https://simstudio-ws.acme.com"  # Public WebSocket URL for browsers
    
    # Security settings (REQUIRED - replace with your own secure secrets)
    # Generate using: openssl rand -hex 32
    BETTER_AUTH_SECRET: "your-secure-production-auth-secret-here"
    ENCRYPTION_KEY: "your-secure-production-encryption-key-here"
    INTERNAL_API_SECRET: "your-secure-production-internal-api-secret-here"
    CRON_SECRET: "your-secure-production-cron-secret-here"

    # Optional: API Key Encryption (RECOMMENDED for production)
    # Generate 64-character hex string using: openssl rand -hex 32
    API_ENCRYPTION_KEY: "your-64-char-hex-api-encryption-key-here"  # Optional but recommended
    
    NODE_ENV: "production"
    NEXT_TELEMETRY_DISABLED: "1"
    
    # GCP-specific environment variables
    GOOGLE_CLOUD_PROJECT: "your-project-id"
    GOOGLE_CLOUD_REGION: "us-central1"

# Realtime service
realtime:
  enabled: true
  replicaCount: 2

  # Node selector for realtime pods
  # Uncomment and customize based on your GKE node labels:
  # nodeSelector:
  #   cloud.google.com/gke-nodepool: "default-pool"
  
  resources:
    limits:
      memory: "4Gi"
      cpu: "1000m"
    requests:
      memory: "2Gi"
      cpu: "500m"
  
  env:
    NEXT_PUBLIC_APP_URL: "https://simstudio.acme.com"
    BETTER_AUTH_URL: "https://simstudio.acme.com"
    NEXT_PUBLIC_SOCKET_URL: "https://simstudio-ws.acme.com"
    BETTER_AUTH_SECRET: "your-secure-production-auth-secret-here"
    ALLOWED_ORIGINS: "https://simstudio.acme.com"
    NODE_ENV: "production"

# Database migrations
migrations:
  enabled: true
  
  resources:
    limits:
      memory: "2Gi"
      cpu: "1000m"
    requests:
      memory: "1Gi"
      cpu: "500m"

# PostgreSQL database
postgresql:
  enabled: true

  # Node selector for database pods
  # Uncomment and customize (recommended: memory-optimized machine types):
  # nodeSelector:
  #   cloud.google.com/gke-nodepool: "database-pool"
  
  # Database authentication (REQUIRED - set secure credentials)
  auth:
    username: postgres
    password: "your-secure-postgres-password"
    database: simstudio
  
  # Resource allocation optimized for GKE
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  # Persistent storage using Google Cloud Persistent Disk
  persistence:
    enabled: true
    storageClass: "standard-rwo"
    size: 50Gi
    accessModes:
      - ReadWriteOnce
  
  # SSL/TLS configuration (requires cert-manager to be installed)
  tls:
    enabled: false  # Set to true if cert-manager is installed
    certificatesSecret: postgres-tls-secret
  
  # PostgreSQL performance tuning for GCP infrastructure
  config:
    maxConnections: 1000
    sharedBuffers: "2GB"
    maxWalSize: "8GB"
    minWalSize: "160MB"

# Ollama AI models with GPU acceleration (GCP GPU instances)
# Set ollama.enabled: false if you don't need local AI models
ollama:
  enabled: false
  replicaCount: 1

  # GPU node targeting - uncomment and customize for GPU node pools
  # Recommended: T4 or V100 GPU instances
  # nodeSelector:
  #   cloud.google.com/gke-nodepool: "gpu-pool"
  #   cloud.google.com/gke-accelerator: "nvidia-tesla-t4"
  
  tolerations:
    - key: "nvidia.com/gpu"
      operator: "Equal"
      value: "present"
      effect: "NoSchedule"
  
  # GPU resource allocation for AI model serving
  gpu:
    enabled: true
    count: 1
  
  resources:
    limits:
      memory: "16Gi"
      cpu: "4000m"
      nvidia.com/gpu: "1"
    requests:
      memory: "8Gi"
      cpu: "2000m"
  
  # High-performance SSD storage for AI models
  persistence:
    enabled: true
    storageClass: "premium-rwo"
    size: 100Gi
    accessModes:
      - ReadWriteOnce
  
  env:
    NVIDIA_DRIVER_CAPABILITIES: "all"
    OLLAMA_LOAD_TIMEOUT: "-1"
    OLLAMA_KEEP_ALIVE: "-1"
    OLLAMA_DEBUG: "1"

# Ingress using Google Cloud Load Balancer
ingress:
  enabled: true
  className: gce
  
  annotations:
    kubernetes.io/ingress.class: gce
    kubernetes.io/ingress.global-static-ip-name: "simstudio-ip"
    networking.gke.io/managed-certificates: "simstudio-ssl-cert"
    kubernetes.io/ingress.allow-http: "false"
  
  # Main application
  app:
    host: simstudio.acme.com
    paths:
      - path: /
        pathType: Prefix
  
  # Realtime service
  realtime:
    host: simstudio-ws.acme.com
    paths:
      - path: /
        pathType: Prefix
  
  # TLS configuration
  tls:
    enabled: true
    secretName: simstudio-tls-secret

# Pod disruption budget for high availability
podDisruptionBudget:
  enabled: true
  minAvailable: null
  maxUnavailable: 1  
  unhealthyPodEvictionPolicy: AlwaysAllow 
# Network policies
networkPolicy:
  enabled: true

# Pod anti-affinity for high availability across GCP zones
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
      - weight: 50
        podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: app.kubernetes.io/name
                operator: In
                values: ["simstudio"]
          topologyKey: topology.gke.io/zone

# Service Account with Workload Identity integration
serviceAccount:
  create: true
  annotations:
    iam.gke.io/gcp-service-account: "simstudio@your-project-id.iam.gserviceaccount.com"

# Additional environment variables for GCP service integration
extraEnvVars:
  - name: GOOGLE_APPLICATION_CREDENTIALS
    value: "/var/secrets/google/key.json"

# Additional volumes for service account credentials
extraVolumes:
  - name: google-cloud-key
    secret:
      secretName: google-service-account-key

extraVolumeMounts:
  - name: google-cloud-key
    mountPath: /var/secrets/google
    readOnly: true
```

--------------------------------------------------------------------------------

---[FILE: values-production.yaml]---
Location: sim-main/helm/sim/examples/values-production.yaml

```yaml
# Production values for Sim
# This configuration is suitable for production deployments

# Global configuration
global:
  imageRegistry: "ghcr.io"
  storageClass: "managed-csi-premium"

# Main application
app:
  enabled: true
  replicaCount: 2
  
  resources:
    limits:
      memory: "6Gi"
      cpu: "2000m"
    requests:
      memory: "4Gi"
      cpu: "1000m"
  
  # Production URLs (REQUIRED - update with your actual domain names)
  env:
    NEXT_PUBLIC_APP_URL: "https://sim.acme.ai"
    BETTER_AUTH_URL: "https://sim.acme.ai"
    SOCKET_SERVER_URL: "https://sim-ws.acme.ai"
    NEXT_PUBLIC_SOCKET_URL: "https://sim-ws.acme.ai"
    
    # Security settings (REQUIRED - replace with your own secure secrets)
    # Generate using: openssl rand -hex 32
    BETTER_AUTH_SECRET: "your-production-auth-secret-here"
    ENCRYPTION_KEY: "your-production-encryption-key-here"
    INTERNAL_API_SECRET: "your-production-internal-api-secret-here"
    CRON_SECRET: "your-production-cron-secret-here"

    # Optional: API Key Encryption (RECOMMENDED for production)
    # Generate 64-character hex string using: openssl rand -hex 32
    API_ENCRYPTION_KEY: "your-64-char-hex-api-encryption-key-here"  # Optional but recommended
    
    # Email verification (set to true if you want to require email verification)
    EMAIL_VERIFICATION_ENABLED: "false"
    
    # Optional third-party service integrations (configure as needed)
    RESEND_API_KEY: "your-resend-api-key"
    GOOGLE_CLIENT_ID: "your-google-client-id"
    GOOGLE_CLIENT_SECRET: "your-google-client-secret"

# Realtime service
realtime:
  enabled: true
  replicaCount: 2
  
  resources:
    limits:
      memory: "4Gi"
      cpu: "1000m"
    requests:
      memory: "2Gi"
      cpu: "500m"
  
  env:
    NEXT_PUBLIC_APP_URL: "https://sim.acme.ai"
    BETTER_AUTH_URL: "https://sim.acme.ai"
    NEXT_PUBLIC_SOCKET_URL: "https://sim-ws.acme.ai"
    BETTER_AUTH_SECRET: "your-production-auth-secret-here"
    ALLOWED_ORIGINS: "https://sim.acme.ai"

# Database migrations
migrations:
  enabled: true
  resources:
    limits:
      memory: "2Gi"
      cpu: "1000m"
    requests:
      memory: "1Gi"
      cpu: "500m"

# PostgreSQL database
postgresql:
  enabled: true
  
  # Database authentication (REQUIRED - set secure credentials)
  auth:
    username: postgres
    password: "your-secure-postgres-password"
    database: simstudio
  
  # Resource allocation for production workloads
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  # Persistent storage configuration
  persistence:
    enabled: true
    storageClass: "managed-csi-premium"
    size: 50Gi
  
  # SSL/TLS configuration (recommended for production)
  tls:
    enabled: true
    certificatesSecret: postgres-tls-secret
  
  # PostgreSQL performance configuration for production
  config:
    maxConnections: 1000
    sharedBuffers: "2GB"
    maxWalSize: "8GB"
    minWalSize: "160MB"

# Ollama AI models (optional - enable if you need local AI model serving)
ollama:
  enabled: false

# Ingress configuration
ingress:
  enabled: true
  className: nginx
  
  annotations:
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  
  # Main application
  app:
    host: sim.acme.ai
    paths:
      - path: /
        pathType: Prefix
  
  # Realtime service
  realtime:
    host: sim-ws.acme.ai
    paths:
      - path: /
        pathType: Prefix
  
  # TLS configuration
  tls:
    enabled: true
    secretName: sim-tls-secret

# Horizontal Pod Autoscaler (automatically scales pods based on CPU/memory usage)
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 2
        periodSeconds: 60

# Pod disruption budget (ensures minimum availability during cluster maintenance)
podDisruptionBudget:
  enabled: true
  minAvailable: null
  maxUnavailable: 1  
  unhealthyPodEvictionPolicy: AlwaysAllow 

# Monitoring integration with Prometheus
monitoring:
  serviceMonitor:
    enabled: true
    labels:
      monitoring: "prometheus"
    interval: 15s
    scrapeTimeout: 10s

# Network policies (restricts pod-to-pod communication for security)
networkPolicy:
  enabled: true

# Shared storage for data sharing between pods (enterprise feature)
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

# Telemetry and observability (comprehensive monitoring and tracing)
telemetry:
  enabled: true
  resources:
    limits:
      memory: "1Gi"
      cpu: "500m"
    requests:
      memory: "512Mi"
      cpu: "200m"
  # Configure endpoints based on your observability infrastructure
  prometheus:
    enabled: true
    endpoint: "http://prometheus-server/api/v1/write"
  jaeger:
    enabled: true
    endpoint: "http://jaeger-collector:14250"
```

--------------------------------------------------------------------------------

---[FILE: values-whitelabeled.yaml]---
Location: sim-main/helm/sim/examples/values-whitelabeled.yaml

```yaml
# Whitelabeled deployment example for Sim
# This configuration shows how to customize branding for Acme Corp

# Global configuration
global:
  imageRegistry: "ghcr.io"
  storageClass: "managed-csi-premium"

# Main application with custom branding
app:
  enabled: true
  replicaCount: 1
  
  # Custom branding configuration
  env:
    # Application URLs (update with your domain)
    NEXT_PUBLIC_APP_URL: "https://sim.acme.ai"
    BETTER_AUTH_URL: "https://sim.acme.ai"
    SOCKET_SERVER_URL: "https://sim-ws.acme.ai"
    NEXT_PUBLIC_SOCKET_URL: "https://sim-ws.acme.ai"
    
    # Security settings (REQUIRED)
    # Generate using: openssl rand -hex 32
    BETTER_AUTH_SECRET: "your-production-auth-secret-here"
    ENCRYPTION_KEY: "your-production-encryption-key-here"
    INTERNAL_API_SECRET: "your-production-internal-api-secret-here"
    CRON_SECRET: "your-production-cron-secret-here"

    # Optional: API Key Encryption (RECOMMENDED for production)
    # Generate 64-character hex string using: openssl rand -hex 32
    API_ENCRYPTION_KEY: "your-64-char-hex-api-encryption-key-here"  # Optional but recommended
    
    # UI Branding & Whitelabeling Configuration
    NEXT_PUBLIC_BRAND_NAME: "Acme AI Studio"
    NEXT_PUBLIC_BRAND_LOGO_URL: "https://acme.com/assets/logo.png"
    NEXT_PUBLIC_BRAND_FAVICON_URL: "https://acme.com/assets/favicon.ico"
    NEXT_PUBLIC_CUSTOM_CSS_URL: "https://acme.com/assets/theme.css"
    NEXT_PUBLIC_SUPPORT_EMAIL: "ai-support@acme.com"
    NEXT_PUBLIC_DOCUMENTATION_URL: "https://docs.acme.com/ai-studio"
    NEXT_PUBLIC_TERMS_URL: "https://acme.com/terms"
    NEXT_PUBLIC_PRIVACY_URL: "https://acme.com/privacy"

# Realtime service
realtime:
  enabled: true
  replicaCount: 1
  env:
    NEXT_PUBLIC_APP_URL: "https://sim.acme.ai"
    BETTER_AUTH_URL: "https://sim.acme.ai"
    NEXT_PUBLIC_SOCKET_URL: "https://sim-ws.acme.ai"
    BETTER_AUTH_SECRET: "your-production-auth-secret-here"
    ALLOWED_ORIGINS: "https://sim.acme.ai"

# PostgreSQL database  
postgresql:
  enabled: true
  auth:
    password: "your-secure-db-password-here"
  persistence:
    enabled: true
    size: 20Gi

# Ingress configuration
ingress:
  enabled: true
  className: "nginx"
  annotations:
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  
  app:
    host: "sim.acme.ai"
    paths:
      - path: /
        pathType: Prefix
  
  realtime:
    host: "sim-ws.acme.ai" 
    paths:
      - path: /
        pathType: Prefix
  
  tls:
    enabled: true
    secretName: "sim-acme-tls"

# Auto-scaling
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

--------------------------------------------------------------------------------

---[FILE: certificate-postgresql.yaml]---
Location: sim-main/helm/sim/templates/certificate-postgresql.yaml

```yaml
{{- if and .Values.postgresql.enabled .Values.postgresql.tls.enabled }}
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: {{ include "sim.fullname" . }}-postgresql-tls-certificate
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
spec:
  secretName: {{ .Values.postgresql.tls.certificatesSecret }}
  duration: {{ .Values.postgresql.tls.duration | default "87600h" }}  # Default: 10 years
  renewBefore: {{ .Values.postgresql.tls.renewBefore | default "2160h" }}  # Default: 90 days before expiry
  isCA: false
  {{- if .Values.postgresql.tls.rotationPolicy }}
  rotationPolicy: {{ .Values.postgresql.tls.rotationPolicy }}
  {{- end }}
  privateKey:
    algorithm: {{ .Values.postgresql.tls.privateKey.algorithm | default "RSA" }}
    size: {{ .Values.postgresql.tls.privateKey.size | default 4096 }}
  usages:
    - server auth
    - client auth
  dnsNames:
  - {{ include "sim.fullname" . }}-postgresql
  - {{ include "sim.fullname" . }}-postgresql.{{ .Release.Namespace }}.svc.cluster.local
  {{- with .Values.postgresql.tls.additionalDnsNames }}
  {{- toYaml . | nindent 2 }}
  {{- end }}
  issuerRef:
    name: {{ .Values.postgresql.tls.issuerRef.name }}
    kind: {{ .Values.postgresql.tls.issuerRef.kind | default "ClusterIssuer" }}
    {{- if .Values.postgresql.tls.issuerRef.group }}
    group: {{ .Values.postgresql.tls.issuerRef.group }}
    {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: cronjobs.yaml]---
Location: sim-main/helm/sim/templates/cronjobs.yaml

```yaml
{{- if .Values.cronjobs.enabled }}
{{- range $jobKey, $jobConfig := .Values.cronjobs.jobs }}
{{- if $jobConfig.enabled }}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: {{ include "sim.fullname" $ }}-{{ $jobConfig.name }}
  labels:
    {{- include "sim.labels" $ | nindent 4 }}
    app.kubernetes.io/component: cronjob-{{ $jobConfig.name }}
spec:
  schedule: {{ $jobConfig.schedule | quote }}
  concurrencyPolicy: {{ $jobConfig.concurrencyPolicy | default "Forbid" }}
  successfulJobsHistoryLimit: {{ $jobConfig.successfulJobsHistoryLimit | default 3 }}
  failedJobsHistoryLimit: {{ $jobConfig.failedJobsHistoryLimit | default 1 }}
  {{- with $.Values.cronjobs.startingDeadlineSeconds }}
  startingDeadlineSeconds: {{ . }}
  {{- end }}
  jobTemplate:
    spec:
      {{- with $.Values.cronjobs.activeDeadlineSeconds }}
      activeDeadlineSeconds: {{ . }}
      {{- end }}
      template:
        metadata:
          labels:
            {{- include "sim.selectorLabels" $ | nindent 12 }}
            app.kubernetes.io/component: cronjob-{{ $jobConfig.name }}
        spec:
          restartPolicy: {{ $.Values.cronjobs.restartPolicy | default "OnFailure" }}
          {{- with $.Values.cronjobs.podSecurityContext }}
          securityContext:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          containers:
          - name: {{ $jobConfig.name }}
            image: "{{ $.Values.cronjobs.image.repository }}:{{ $.Values.cronjobs.image.tag }}"
            imagePullPolicy: {{ $.Values.cronjobs.image.pullPolicy }}
            {{- with $.Values.cronjobs.securityContext }}
            securityContext:
              {{- toYaml . | nindent 14 }}
            {{- end }}
            env:
            - name: CRON_SECRET
              value: {{ $.Values.app.env.CRON_SECRET | quote }}
            command:
            - /bin/sh
            - -c
            args:
            - |
              echo "Starting cron job: {{ $jobConfig.name }}"
              echo "Making HTTP request to {{ $jobConfig.path }}"
              
              # Determine the service URL (use internal service regardless of ingress)
              SERVICE_URL="http://{{ include "sim.fullname" $ }}-app:{{ $.Values.app.service.port }}"
              
              # Make the HTTP request with timeout and retry logic
              for i in $(seq 1 3); do
                echo "Attempt $i/3"
                if curl -f -s -S --max-time 60 --retry 2 --retry-delay 5 \
                  -H "Content-Type: application/json" \
                  -H "User-Agent: Kubernetes-CronJob/{{ $jobConfig.name }}" \
                  -H "Authorization: Bearer ${CRON_SECRET}" \
                  "$SERVICE_URL{{ $jobConfig.path }}"; then
                  echo "Success: HTTP request completed"
                  exit 0
                fi
                echo "Attempt $i failed, retrying..."
                sleep 10
              done
              echo "Error: All attempts failed"
              exit 1
            resources:
              {{- toYaml $.Values.cronjobs.resources | nindent 14 }}
          {{- with $.Values.global.imagePullSecrets }}
          imagePullSecrets:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with $.Values.app.nodeSelector }}
          nodeSelector:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with $.Values.affinity }}
          affinity:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with $.Values.tolerations }}
          tolerations:
            {{- toYaml . | nindent 12 }}
          {{- end }}
{{- end }}
{{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: deployment-app.yaml]---
Location: sim-main/helm/sim/templates/deployment-app.yaml

```yaml
{{- if .Values.app.enabled }}
{{- include "sim.validateSecrets" . }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "sim.fullname" . }}-app
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.app.replicaCount }}
  selector:
    matchLabels:
      {{- include "sim.app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        {{- include "sim.app.selectorLabels" . | nindent 8 }}
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "sim.serviceAccountName" . }}
      {{- include "sim.podSecurityContext" .Values.app | nindent 6 }}
      {{- include "sim.nodeSelector" .Values.app | nindent 6 }}
      {{- include "sim.tolerations" .Values | nindent 6 }}
      {{- include "sim.affinity" .Values | nindent 6 }}
      {{- if .Values.migrations.enabled }}
      initContainers:
        - name: migrations
          image: {{ include "sim.image" (dict "context" . "image" .Values.migrations.image) }}
          imagePullPolicy: {{ .Values.migrations.image.pullPolicy }}
          command: ["/bin/sh", "-c"]
          args:
            - |
              cd /app/packages/db
              export DATABASE_URL="{{ include "sim.databaseUrl" . }}"
              bun run db:migrate
          {{- if .Values.postgresql.enabled }}
          envFrom:
            - secretRef:
                name: {{ include "sim.fullname" . }}-postgresql-secret
          {{- else if .Values.externalDatabase.enabled }}
          envFrom:
            - secretRef:
                name: {{ include "sim.fullname" . }}-external-db-secret
          {{- end }}
          {{- include "sim.resources" .Values.migrations | nindent 10 }}
          {{- include "sim.securityContext" .Values.migrations | nindent 10 }}
      {{- end }}
      containers:
        - name: app
          image: {{ include "sim.image" (dict "context" . "image" .Values.app.image) }}
          imagePullPolicy: {{ .Values.app.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.app.service.targetPort }}
              protocol: TCP
          env:
            - name: DATABASE_URL
              value: {{ include "sim.databaseUrl" . | quote }}
            - name: SOCKET_SERVER_URL
              value: {{ include "sim.socketServerUrl" . | quote }}
            - name: OLLAMA_URL
              value: {{ include "sim.ollamaUrl" . | quote }}
            {{- range $key, $value := omit .Values.app.env "DATABASE_URL" "SOCKET_SERVER_URL" "OLLAMA_URL" }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
            {{- if .Values.telemetry.enabled }}
            # OpenTelemetry configuration
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: "http://{{ include "sim.fullname" . }}-otel-collector:4318"
            - name: OTEL_SERVICE_NAME
              value: sim-app
            - name: OTEL_SERVICE_VERSION
              value: {{ .Chart.AppVersion | quote }}
            - name: OTEL_RESOURCE_ATTRIBUTES
              value: "service.name=sim-app,service.version={{ .Chart.AppVersion }},deployment.environment={{ .Values.app.env.NODE_ENV }}"
            {{- end }}
            {{- with .Values.extraEnvVars }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
          {{- if .Values.postgresql.enabled }}
          envFrom:
            - secretRef:
                name: {{ include "sim.fullname" . }}-postgresql-secret
          {{- else if .Values.externalDatabase.enabled }}
          envFrom:
            - secretRef:
                name: {{ include "sim.fullname" . }}-external-db-secret
          {{- end }}
          {{- if .Values.app.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.app.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.app.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.app.readinessProbe | nindent 12 }}
          {{- end }}
          {{- include "sim.resources" .Values.app | nindent 10 }}
          {{- include "sim.securityContext" .Values.app | nindent 10 }}
          {{- with .Values.extraVolumeMounts }}
          volumeMounts:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- with .Values.extraVolumes }}
      volumes:
        {{- toYaml . | nindent 8 }}
      {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

````
