---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 800
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 800 of 933)

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

---[FILE: values.yaml]---
Location: sim-main/helm/sim/values.yaml

```yaml
# Global configuration
global:
  # Image registry and pull policy
  imageRegistry: "ghcr.io"
  # Use registry for all images, not just simstudioai/* images
  useRegistryForAllImages: false
  imagePullSecrets: []
  
  # Common labels applied to all resources
  commonLabels: {}
  
  # Storage class for persistent volumes
  storageClass: ""

# Main Sim application configuration
app:
  # Enable/disable the main application
  enabled: true
  
  # Image configuration
  image:
    repository: simstudioai/simstudio
    tag: latest
    pullPolicy: Always
  
  # Number of replicas
  replicaCount: 1
  
  # Resource limits and requests
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  # Node selector for pod scheduling (leave empty to allow scheduling on any node)
  nodeSelector: {}
  
  # Pod security context
  podSecurityContext:
    fsGroup: 1001
  
  # Container security context
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
  
  # Environment variables
  env:
    # Application URLs
    NEXT_PUBLIC_APP_URL: "http://localhost:3000"
    BETTER_AUTH_URL: "http://localhost:3000"
    # SOCKET_SERVER_URL: Auto-detected when realtime.enabled=true (uses internal service)
    # Only set this if using an external WebSocket service with realtime.enabled=false
    NEXT_PUBLIC_SOCKET_URL: "http://localhost:3002"  # Public WebSocket URL for browsers
    
    # Node environment
    NODE_ENV: "production"
    NEXT_TELEMETRY_DISABLED: "1"
    
    # Authentication and encryption secrets (REQUIRED for production)
    # Generate secure 32-character secrets using: openssl rand -hex 32
    BETTER_AUTH_SECRET: ""  # REQUIRED - set via --set flag or external secret manager
    ENCRYPTION_KEY: ""      # REQUIRED - set via --set flag or external secret manager
    INTERNAL_API_SECRET: "" # REQUIRED - set via --set flag or external secret manager, used for internal service-to-service authentication

    # Optional: Scheduled Jobs Authentication
    # Generate using: openssl rand -hex 32
    CRON_SECRET: ""         # OPTIONAL - required only if cronjobs.enabled=true, authenticates scheduled job requests

    # Optional: API Key Encryption (RECOMMENDED for production)
    # Generate 64-character hex string using: openssl rand -hex 32 (outputs 64 hex chars = 32 bytes)
    API_ENCRYPTION_KEY: ""  # OPTIONAL - encrypts API keys at rest, must be exactly 64 hex characters, if not set keys stored in plain text
    
    # Email & Communication
    EMAIL_VERIFICATION_ENABLED: "false"                   # Enable email verification for user registration and login (defaults to false)
    RESEND_API_KEY: ""                                    # Resend API key for transactional emails
    FROM_EMAIL_ADDRESS: ""                                # Complete from address (e.g., "Sim <noreply@domain.com>" or "DoNotReply@domain.com")
    EMAIL_DOMAIN: ""                                      # Domain for sending emails (fallback when FROM_EMAIL_ADDRESS not set)
    
    # OAuth Integration Credentials (leave empty if not using)
    GOOGLE_CLIENT_ID: ""                                  # Google OAuth client ID
    GOOGLE_CLIENT_SECRET: ""                              # Google OAuth client secret
    GITHUB_CLIENT_ID: ""                                  # GitHub OAuth client ID  
    GITHUB_CLIENT_SECRET: ""                              # GitHub OAuth client secret
    
    # AI Provider API Keys (leave empty if not using)
    OPENAI_API_KEY: ""                                    # Primary OpenAI API key
    OPENAI_API_KEY_1: ""                                  # Additional OpenAI API key for load balancing
    OPENAI_API_KEY_2: ""                                  # Additional OpenAI API key for load balancing
    OPENAI_API_KEY_3: ""                                  # Additional OpenAI API key for load balancing
    MISTRAL_API_KEY: ""                                   # Mistral AI API key
    ANTHROPIC_API_KEY_1: ""                               # Primary Anthropic Claude API key
    ANTHROPIC_API_KEY_2: ""                               # Additional Anthropic API key for load balancing
    ANTHROPIC_API_KEY_3: ""                               # Additional Anthropic API key for load balancing
    OLLAMA_URL: ""                                        # Ollama local LLM server URL
    ELEVENLABS_API_KEY: ""                                # ElevenLabs API key for text-to-speech in deployed chat
    
    # Rate Limiting Configuration (per minute)
    RATE_LIMIT_WINDOW_MS: "60000"                         # Rate limit window duration (1 minute)
    RATE_LIMIT_FREE_SYNC: "10"                            # Sync API executions per minute
    RATE_LIMIT_FREE_ASYNC: "50"                           # Async API executions per minute
    
    # UI Branding & Whitelabeling Configuration
    NEXT_PUBLIC_BRAND_NAME: "Sim"                         # Custom brand name
    NEXT_PUBLIC_BRAND_LOGO_URL: ""                        # Custom logo URL (leave empty for default)
    NEXT_PUBLIC_BRAND_FAVICON_URL: ""                     # Custom favicon URL (leave empty for default)
    NEXT_PUBLIC_CUSTOM_CSS_URL: ""                        # Custom stylesheet URL (leave empty for none)
    NEXT_PUBLIC_SUPPORT_EMAIL: "help@sim.ai"             # Support email address
    NEXT_PUBLIC_DOCUMENTATION_URL: ""                    # Documentation URL (leave empty for none)
    NEXT_PUBLIC_TERMS_URL: ""                            # Terms of service URL (leave empty for none)
    NEXT_PUBLIC_PRIVACY_URL: ""                          # Privacy policy URL (leave empty for none)
    
    # Access Control (leave empty if not restricting login)
    ALLOWED_LOGIN_EMAILS: ""                             # Comma-separated list of allowed email addresses for login
    ALLOWED_LOGIN_DOMAINS: ""                            # Comma-separated list of allowed email domains for login
    
  
  # Service configuration
  service:
    type: ClusterIP
    port: 3000
    targetPort: 3000
  
  # Health checks
  livenessProbe:
    httpGet:
      path: /
      port: 3000
    initialDelaySeconds: 10
    periodSeconds: 90
    timeoutSeconds: 5
    failureThreshold: 3
  
  readinessProbe:
    httpGet:
      path: /
      port: 3000
    initialDelaySeconds: 10
    periodSeconds: 90
    timeoutSeconds: 5
    failureThreshold: 3

# Realtime socket server configuration
realtime:
  # Enable/disable the realtime service
  enabled: true
  
  # Image configuration
  image:
    repository: simstudioai/realtime
    tag: latest
    pullPolicy: Always
  
  # Number of replicas
  replicaCount: 1
  
  # Resource limits and requests
  resources:
    limits:
      memory: "2Gi"
      cpu: "1000m"
    requests:
      memory: "1Gi"
      cpu: "500m"
  
  # Node selector for pod scheduling (leave empty to allow scheduling on any node)
  nodeSelector: {}
  
  # Pod security context
  podSecurityContext:
    fsGroup: 1001
  
  # Container security context
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
  
  # Environment variables
  env:
    # Application URLs
    NEXT_PUBLIC_APP_URL: "http://localhost:3000"
    BETTER_AUTH_URL: "http://localhost:3000"
    NEXT_PUBLIC_SOCKET_URL: "http://localhost:3002"
    
    # Authentication secret (REQUIRED for production)
    # Must match the BETTER_AUTH_SECRET value from the main app configuration
    BETTER_AUTH_SECRET: ""  # REQUIRED - set via --set flag or external secret manager
    
    # Cross-Origin Resource Sharing (CORS) allowed origins
    ALLOWED_ORIGINS: "http://localhost:3000"
    
    # Node environment
    NODE_ENV: "production"
  
  # Service configuration
  service:
    type: ClusterIP
    port: 3002
    targetPort: 3002
  
  # Health checks
  livenessProbe:
    httpGet:
      path: /health
      port: 3002
    initialDelaySeconds: 10
    periodSeconds: 90
    timeoutSeconds: 5
    failureThreshold: 3
  
  readinessProbe:
    httpGet:
      path: /health
      port: 3002
    initialDelaySeconds: 10
    periodSeconds: 90
    timeoutSeconds: 5
    failureThreshold: 3

# Database migrations job configuration
migrations:
  # Enable/disable migrations job
  enabled: true
  
  # Image configuration
  image:
    repository: simstudioai/migrations
    tag: latest
    pullPolicy: Always
  
  # Resource limits and requests
  resources:
    limits:
      memory: "1Gi"
    requests:
      memory: "512Mi"
      cpu: "100m"
  
  # Pod security context
  podSecurityContext:
    fsGroup: 1001
  
  # Container security context
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001

# PostgreSQL database configuration
postgresql:
  # Enable/disable internal PostgreSQL deployment
  enabled: true
  
  # Image configuration
  image:
    repository: pgvector/pgvector
    tag: pg17
    pullPolicy: IfNotPresent
  
  # Authentication configuration
  auth:
    username: postgres
    password: ""  # REQUIRED - set via --set flag or external secret manager
    database: sim
  
  # Node selector for database pod scheduling (leave empty to allow scheduling on any node)
  nodeSelector: {}
  
  # Resource limits and requests
  resources:
    limits:
      memory: "2Gi"
    requests:
      memory: "1Gi"
      cpu: "500m"
  
  # Pod security context
  podSecurityContext:
    fsGroup: 999
  
  # Container security context
  securityContext:
    runAsUser: 999
  
  # Persistence configuration
  persistence:
    enabled: true
    storageClass: ""
    size: 10Gi
    accessModes:
      - ReadWriteOnce
  
  # SSL/TLS configuration (enable for production deployments with certificates)
  # Requires cert-manager to be installed in the cluster
  tls:
    enabled: false
    certificatesSecret: postgres-tls-secret
    # Certificate configuration (only used if enabled)
    duration: "87600h"  # 10 years (default)
    renewBefore: "2160h"  # Renew 90 days before expiry (default)
    rotationPolicy: ""  # Set to "Always" to rotate private key on renewal (recommended for security)
    privateKey:
      algorithm: RSA  # RSA or ECDSA
      size: 4096  # Key size in bits
    # Issuer reference (REQUIRED if tls.enabled is true)
    issuerRef:
      name: selfsigned-cluster-issuer  # Name of your cert-manager Issuer/ClusterIssuer
      kind: ClusterIssuer  # ClusterIssuer or Issuer
      group: ""  # Optional: cert-manager.io (leave empty for default)
    # Additional DNS names (optional)
    additionalDnsNames: []
    # Example:
    # additionalDnsNames:
    #   - postgres.example.com
    #   - db.example.com
  
  # PostgreSQL configuration
  config:
    maxConnections: 1000
    sharedBuffers: "1280MB"
    maxWalSize: "4GB"
    minWalSize: "80MB"
  
  # Service configuration
  service:
    type: ClusterIP
    port: 5432
    targetPort: 5432
  
  # Health checks
  livenessProbe:
    exec:
      command: ["pg_isready", "-U", "postgres", "-d", "sim"]
    initialDelaySeconds: 10
    periodSeconds: 5
  
  readinessProbe:
    exec:
      command: ["pg_isready", "-U", "postgres", "-d", "sim"]
    initialDelaySeconds: 5
    periodSeconds: 3

# External database configuration (use when connecting to managed database services)
externalDatabase:
  # Enable to use an external database instead of the internal PostgreSQL instance
  enabled: false
  
  # Database connection details
  host: "external-db.example.com"
  port: 5432
  username: postgres
  password: ""
  database: sim
  
  # SSL configuration
  sslMode: require

# Ollama local AI models configuration
ollama:
  # Enable/disable Ollama deployment
  enabled: false
  
  # Image configuration
  image:
    repository: ollama/ollama
    tag: latest
    pullPolicy: Always
  
  # Number of replicas
  replicaCount: 1
  
  # GPU configuration
  gpu:
    enabled: false
    count: 1
  
  # Node selector for GPU workloads (adjust labels based on your cluster configuration)
  nodeSelector:
    accelerator: nvidia
  
  # Tolerations for GPU nodes (adjust based on your cluster's GPU node taints)
  tolerations:
    - key: "sku"
      operator: "Equal"
      value: "gpu"
      effect: "NoSchedule"
  
  # Resource limits and requests
  resources:
    limits:
      memory: "8Gi"
      nvidia.com/gpu: "1"
    requests:
      memory: "4Gi"
      cpu: "1000m"
  
  # Environment variables
  env:
    NVIDIA_DRIVER_CAPABILITIES: "all"
    OLLAMA_LOAD_TIMEOUT: "-1"
    OLLAMA_KEEP_ALIVE: "-1"
    OLLAMA_DEBUG: "1"
  
  # Persistence configuration
  persistence:
    enabled: true
    storageClass: ""
    size: 100Gi
    accessModes:
      - ReadWriteOnce
  
  # Service configuration
  service:
    type: ClusterIP
    port: 11434
    targetPort: 11434
  
  # Health checks
  startupProbe:
    httpGet:
      path: /
      port: 11434
    initialDelaySeconds: 10
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 10
  
  livenessProbe:
    httpGet:
      path: /
      port: 11434
    initialDelaySeconds: 60
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 5
  
  readinessProbe:
    httpGet:
      path: /
      port: 11434
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 3

# Ingress configuration
ingress:
  # Enable/disable ingress
  enabled: false
  
  # Ingress class name
  className: nginx
  
  # Annotations
  annotations:
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
  
  # Main application host configuration
  app:
    host: sim.local
    paths:
      - path: /
        pathType: Prefix
  
  # Realtime service host configuration
  realtime:
    host: sim-ws.local
    paths:
      - path: /
        pathType: Prefix
  
  # TLS configuration
  tls:
    enabled: false
    secretName: sim-tls-secret

# Service Account configuration
serviceAccount:
  # Specifies whether a service account should be created
  create: true
  
  # Annotations to add to the service account
  annotations: {}
  
  # The name of the service account to use
  name: ""

# Horizontal Pod Autoscaler
autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80
  # Custom metrics for scaling (advanced users can add custom metrics here)
  customMetrics: []
  # Scaling behavior configuration (customize scale-up/down policies)
  # Example configuration:
  # behavior:
  #   scaleDown:
  #     stabilizationWindowSeconds: 300
  #     policies:
  #     - type: Percent
  #       value: 50
  #       periodSeconds: 60
  #   scaleUp:
  #     stabilizationWindowSeconds: 60
  #     policies:
  #     - type: Percent
  #       value: 100
  #       periodSeconds: 15
  #     - type: Pods
  #       value: 2
  #       periodSeconds: 60
  behavior: {}

# Pod disruption budget
# Note: PDBs only protect against voluntary disruptions (node drains, autoscaler)
# They do NOT affect rolling updates - use deployment.strategy.rollingUpdate for that
podDisruptionBudget:
  enabled: false
  # Use either minAvailable or maxUnavailable (not both)
  # Recommendation: Use maxUnavailable as it scales better with HPA
  # - minAvailable: minimum pods that must remain available (e.g., 1, "50%")
  # - maxUnavailable: maximum pods that can be unavailable (e.g., 1, "25%")
  minAvailable: null
  maxUnavailable: 1
  # unhealthyPodEvictionPolicy: allows eviction of unhealthy pods during node drains
  # Options: IfHealthyBudget (default) | AlwaysAllow (recommended for production)
  # Set to null to use K8s default (IfHealthyBudget)
  unhealthyPodEvictionPolicy: null

# Monitoring configuration
monitoring:
  # ServiceMonitor for Prometheus
  serviceMonitor:
    enabled: false
    # Additional labels for ServiceMonitor
    labels: {}
    # Additional annotations for ServiceMonitor
    annotations: {}
    # Metrics path
    path: /metrics
    # Scrape interval
    interval: 30s
    # Scrape timeout
    scrapeTimeout: 10s
    # Target labels to be added to scraped metrics
    targetLabels: []
    # Metric relabeling configurations
    metricRelabelings: []
    # Relabeling configurations
    relabelings: []

# Network policies
networkPolicy:
  enabled: false
  
  # Custom ingress rules
  ingress: []
  
  # Custom egress rules  
  egress: []

# Shared storage for enterprise workflows requiring data sharing between pods
sharedStorage:
  enabled: false
  # Storage class for shared volumes (must support ReadWriteMany access)
  storageClass: ""
  # Default access modes for shared volumes (ReadWriteMany required for multi-pod access)
  defaultAccessModes:
    - ReadWriteMany
  # Define shared volumes for your workflows (uncomment and customize as needed)
  # Example volume configurations:
  # volumes:
  #   - name: output-share
  #     size: 100Gi
  #     accessModes:
  #       - ReadWriteMany
  #     annotations: {}
  #   - name: rawdata-share
  #     size: 500Gi
  #     accessModes:
  #       - ReadWriteMany
  #   - name: model-share
  #     size: 200Gi
  #     accessModes:
  #       - ReadWriteMany
  #   - name: logs-share
  #     size: 50Gi
  #     accessModes:
  #       - ReadWriteMany
  volumes: []

# Additional volumes for custom configurations (advanced users)
extraVolumes: []
extraVolumeMounts: []

# Additional environment variables for custom integrations
extraEnvVars: []

# Pod annotations for custom metadata
podAnnotations: {}

# Pod labels for custom labeling
podLabels: {}

# Affinity settings for advanced pod scheduling
affinity: {}

# Tolerations for scheduling on tainted nodes
tolerations: []

# CronJob configuration for scheduled tasks
cronjobs:
  # Enable/disable all cron jobs
  enabled: true
  
  # Individual job configurations
  jobs:
    scheduleExecution:
      enabled: true
      name: schedule-execution
      schedule: "*/1 * * * *"
      path: "/api/schedules/execute"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 3
      failedJobsHistoryLimit: 1
      
    gmailWebhookPoll:
      enabled: true
      name: gmail-webhook-poll
      schedule: "*/1 * * * *"
      path: "/api/webhooks/poll/gmail"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 3
      failedJobsHistoryLimit: 1
      
    outlookWebhookPoll:
      enabled: true
      name: outlook-webhook-poll
      schedule: "*/1 * * * *"
      path: "/api/webhooks/poll/outlook"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 3
      failedJobsHistoryLimit: 1

    rssWebhookPoll:
      enabled: true
      name: rss-webhook-poll
      schedule: "*/1 * * * *"
      path: "/api/webhooks/poll/rss"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 3
      failedJobsHistoryLimit: 1

    renewSubscriptions:
      enabled: true
      name: renew-subscriptions
      schedule: "0 */12 * * *"
      path: "/api/cron/renew-subscriptions"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 3
      failedJobsHistoryLimit: 1

    inactivityAlertPoll:
      enabled: true
      name: inactivity-alert-poll
      schedule: "*/15 * * * *"
      path: "/api/notifications/poll"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 3
      failedJobsHistoryLimit: 1

  # Global CronJob settings
  image:
    repository: curlimages/curl
    tag: 8.5.0
    pullPolicy: IfNotPresent
    
  resources:
    limits:
      memory: "128Mi"
      cpu: "100m"
    requests:
      memory: "64Mi"
      cpu: "50m"
      
  restartPolicy: OnFailure
  activeDeadlineSeconds: 300
  startingDeadlineSeconds: 60
  
  # Pod security context
  podSecurityContext:
    fsGroup: 1001
  
  # Container security context
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001

# Observability and telemetry configuration
telemetry:
  # Enable/disable telemetry collection
  enabled: false
  
  # OpenTelemetry Collector image
  image:
    repository: otel/opentelemetry-collector-contrib
    tag: 0.91.0
    pullPolicy: IfNotPresent
  
  # Number of collector replicas
  replicaCount: 1
  
  # Resource limits and requests
  resources:
    limits:
      memory: "512Mi"
      cpu: "500m"
    requests:
      memory: "256Mi"
      cpu: "100m"
  
  # Node selector for telemetry pod scheduling (leave empty to allow scheduling on any node)
  nodeSelector: {}
  
  # Tolerations for telemetry workloads
  tolerations: []
  
  # Affinity for telemetry workloads
  affinity: {}
  
  # Service configuration
  service:
    type: ClusterIP
  
  # Jaeger tracing backend
  jaeger:
    enabled: false
    endpoint: "http://jaeger-collector:14250"
    tls:
      enabled: false
  
  # Prometheus metrics backend
  prometheus:
    enabled: false
    endpoint: "http://prometheus-server/api/v1/write"
    auth: ""
  
  # Generic OTLP backend
  otlp:
    enabled: false
    endpoint: "http://otlp-collector:4317"
    tls:
      enabled: false

# Copilot service configuration (optional microservice)
copilot:
  # Enable/disable the copilot service
  enabled: false
  
  # Server deployment configuration
  server:
    # Image configuration
    image:
      repository: simstudioai/copilot
      tag: latest
      pullPolicy: Always
    
    # Number of replicas
    replicaCount: 1
    
    # Resource limits and requests
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "1Gi"
        cpu: "500m"
    
    # Node selector for pod scheduling
    # Leave empty to run on same infrastructure as main Sim platform
    # Or specify labels to isolate on dedicated nodes: { "workload-type": "copilot" }
    nodeSelector: {}
    
    # Pod security context
    podSecurityContext:
      fsGroup: 1001
    
    # Container security context
    securityContext:
      runAsNonRoot: true
      runAsUser: 1001
    
    # Environment variables (required and optional)
    env:
      PORT: "8080"
      SERVICE_NAME: "copilot"
      ENVIRONMENT: "production"
      AGENT_API_DB_ENCRYPTION_KEY: ""
      INTERNAL_API_SECRET: ""
      LICENSE_KEY: ""
      OPENAI_API_KEY_1: ""
      ANTHROPIC_API_KEY_1: ""
      SIM_BASE_URL: ""
      SIM_AGENT_API_KEY: ""
      REDIS_URL: ""
      # Optional configuration
      LOG_LEVEL: "info"
      CORS_ALLOWED_ORIGINS: ""
      OTEL_EXPORTER_OTLP_ENDPOINT: ""
    
    # Optional: additional static environment variables
    extraEnv: []
    
    # Optional: references to existing ConfigMaps/Secrets
    extraEnvFrom: []
    
    # Secret generation configuration (set create=false to use an existing secret)
    secret:
      create: true
      name: ""
      annotations: {}
    
    # Service configuration
    service:
      type: ClusterIP
      port: 8080
      targetPort: 8080
    
    # Health checks
    readinessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 30
      timeoutSeconds: 5
      failureThreshold: 3

    # Pod Disruption Budget for high availability
    podDisruptionBudget:
      enabled: false
      minAvailable: 1

  # PostgreSQL database for copilot (separate from main Sim database)
  postgresql:
    # Enable/disable internal PostgreSQL for copilot
    enabled: true
    
    # Image configuration
    image:
      repository: postgres
      tag: 16-alpine
      pullPolicy: IfNotPresent
    
    # Authentication configuration
    auth:
      username: copilot
      password: ""  # REQUIRED - set via --set flag or external secret manager
      database: copilot
    
    # Node selector for database pod scheduling
    # Leave empty to run on same infrastructure as main Sim platform
    # Or specify labels to isolate on dedicated nodes: { "workload-type": "copilot" }
    nodeSelector: {}
    
    # Resource limits and requests
    resources:
      limits:
        memory: "1Gi"
        cpu: "500m"
      requests:
        memory: "512Mi"
        cpu: "250m"
    
    # Pod security context
    podSecurityContext:
      fsGroup: 999
    
    # Container security context
    securityContext:
      runAsUser: 999
    
    # Persistence configuration
    persistence:
      enabled: true
      storageClass: ""
      size: 10Gi
      accessModes:
        - ReadWriteOnce
    
    # Service configuration
    service:
      type: ClusterIP
      port: 5432
      targetPort: 5432
    
    # Health checks
    livenessProbe:
      exec:
        command: ["pg_isready", "-U", "copilot", "-d", "copilot"]
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 5
      failureThreshold: 10
    
    readinessProbe:
      exec:
        command: ["pg_isready", "-U", "copilot", "-d", "copilot"]
      initialDelaySeconds: 5
      periodSeconds: 3
      timeoutSeconds: 5
      failureThreshold: 10
  
  # External database configuration (use when connecting to a managed database)
  database:
    existingSecretName: ""
    secretKey: DATABASE_URL
    url: ""
  
  # Migration job configuration
  migrations:
    # Enable/disable migrations job
    enabled: true
    
    # Image configuration (same as server)
    image:
      repository: simstudioai/copilot
      tag: latest
      pullPolicy: Always
    
    # Resource limits and requests
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "100m"
    
    # Pod security context
    podSecurityContext:
      fsGroup: 1001
    
    # Container security context
    securityContext:
      runAsNonRoot: true
      runAsUser: 1001
    
    # Job configuration
    backoffLimit: 3
    restartPolicy: OnFailure
```

--------------------------------------------------------------------------------

---[FILE: values-aws.yaml]---
Location: sim-main/helm/sim/examples/values-aws.yaml

```yaml
# AWS-specific values for Sim
# Example configuration for Amazon EKS deployment

# Global configuration
global:
  imageRegistry: "ghcr.io"
  storageClass: "gp2"  # Use gp2 (default on EKS) or create gp3 StorageClass for better performance

# Main application
app:
  enabled: true
  replicaCount: 2

  # Node selector for application pods
  # Uncomment and customize based on your EKS node labels:
  # nodeSelector:
  #   node.kubernetes.io/instance-type: "t3.large"
  
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
    
    # AWS-specific environment variables
    AWS_REGION: "us-west-2"

# Realtime service
realtime:
  enabled: true
  replicaCount: 2

  # Node selector for realtime pods
  # Uncomment and customize based on your EKS node labels:
  # nodeSelector:
  #   node.kubernetes.io/instance-type: "t3.medium"
  
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
  # Uncomment and customize (recommended: memory-optimized EC2 instances like r5.large):
  # nodeSelector:
  #   node.kubernetes.io/instance-type: "r5.large"
  
  # Database authentication (REQUIRED - set secure credentials)
  auth:
    username: postgres
    password: "your-secure-postgres-password"
    database: simstudio
  
  # Resource allocation optimized for AWS EKS
  resources:
    limits:
      memory: "4Gi"
      cpu: "2000m"
    requests:
      memory: "2Gi"
      cpu: "1000m"
  
  # Persistent storage using AWS EBS volumes
  persistence:
    enabled: true
    storageClass: "gp2"  # Use gp2 (default) or create gp3 StorageClass
    size: 50Gi
    accessModes:
      - ReadWriteOnce
  
  # SSL/TLS configuration (requires cert-manager to be installed)
  tls:
    enabled: false  # Set to true if cert-manager is installed
    certificatesSecret: postgres-tls-secret
  
  # PostgreSQL performance tuning for AWS infrastructure
  config:
    maxConnections: 1000
    sharedBuffers: "2GB"
    maxWalSize: "8GB"
    minWalSize: "160MB"

# Ollama AI models with GPU acceleration (AWS EC2 GPU instances)
# Set ollama.enabled: false if you don't need local AI models
ollama:
  enabled: false
  replicaCount: 1

  # GPU node targeting - uncomment and customize for GPU instances
  # Recommended: g4dn.xlarge or p3.2xlarge instances
  # nodeSelector:
  #   node.kubernetes.io/instance-type: "g4dn.xlarge"
  
  tolerations:
    - key: "nvidia.com/gpu"
      operator: "Equal"
      value: "true"
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
  
  # High-performance storage for AI models
  persistence:
    enabled: true
    storageClass: "gp2"  # Use gp2 (default) or create gp3 StorageClass
    size: 100Gi
    accessModes:
      - ReadWriteOnce
  
  env:
    NVIDIA_DRIVER_CAPABILITIES: "all"
    OLLAMA_LOAD_TIMEOUT: "-1"
    OLLAMA_KEEP_ALIVE: "-1"
    OLLAMA_DEBUG: "1"

# Ingress using AWS Application Load Balancer (ALB)
ingress:
  enabled: true
  className: alb
  
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/ssl-redirect: "443"
    alb.ingress.kubernetes.io/certificate-arn: "arn:aws:acm:us-west-2:123456789012:certificate/your-cert-arn"
  
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

# Pod anti-affinity for high availability across AWS Availability Zones
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
          topologyKey: topology.kubernetes.io/zone

# Service Account with IAM roles for service account (IRSA) integration
serviceAccount:
  create: true
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/SimStudioServiceRole"
```

--------------------------------------------------------------------------------

---[FILE: values-azure.yaml]---
Location: sim-main/helm/sim/examples/values-azure.yaml

```yaml
# Azure-specific values for Sim
# Example configuration for Azure AKS deployment

# Global configuration
global:
  imageRegistry: "ghcr.io"
  # Use "managed-csi-premium" for Premium SSD (requires Premium storage-capable VMs like Standard_DS*)
  # Use "managed-csi" for Standard SSD (works with all VM types)
  storageClass: "managed-csi"

# Main application
app:
  enabled: true
  replicaCount: 2

  # Node selector for application pods
  # Uncomment and customize based on your AKS node labels:
  # nodeSelector:
  #   agentpool: "application"
  
  resources:
    limits:
      memory: "4Gi"
    requests:
      memory: "2Gi"
      cpu: "500m"
  
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

# Realtime service
realtime:
  enabled: true
  replicaCount: 2

  # Node selector for realtime pods
  # Uncomment and customize based on your AKS node labels:
  # nodeSelector:
  #   agentpool: "application"
  
  resources:
    limits:
      memory: "4Gi"
    requests:
      memory: "1Gi"
      cpu: "250m"
  
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

# PostgreSQL database
postgresql:
  enabled: true

  # Node selector for database pods
  # Uncomment and customize (recommended: memory-optimized VM sizes):
  # nodeSelector:
  #   agentpool: "database"
  
  # Database authentication (REQUIRED - set secure credentials)
  auth:
    username: postgres
    password: "your-secure-postgres-password"
    database: simstudio
  
  # Resource allocation for production workloads
  resources:
    limits:
      memory: "2Gi"
    requests:
      memory: "1Gi"
      cpu: "500m"
  
  # Persistent storage using Azure Managed Disk
  persistence:
    enabled: true
    storageClass: "managed-csi"
    size: 10Gi
  
  # SSL/TLS configuration (requires cert-manager to be installed)
  tls:
    enabled: false  # Set to true if cert-manager is installed
    certificatesSecret: postgres-tls-secret
  
  # PostgreSQL performance tuning for Azure infrastructure
  config:
    maxConnections: 1000
    sharedBuffers: "1280MB"
    maxWalSize: "4GB"
    minWalSize: "80MB"

# Ollama AI models with GPU acceleration (Azure NC-series VMs)
# Set ollama.enabled: false if you don't need local AI models
ollama:
  enabled: false
  replicaCount: 1

  # GPU node targeting - uncomment and customize for GPU node pools
  # Recommended: NC6s_v3 or NC12s_v3 VMs
  # nodeSelector:
  #   agentpool: "gpu"
  
  tolerations:
    - key: "sku"
      operator: "Equal"
      value: "gpu"
      effect: "NoSchedule"
  
  # GPU resource allocation for AI model serving
  gpu:
    enabled: true
    count: 1
  
  resources:
    limits:
      memory: "8Gi"
      nvidia.com/gpu: "1"
    requests:
      memory: "4Gi"
      cpu: "1000m"
  
  # High-performance storage for AI models (use managed-csi-premium for GPU workloads)
  persistence:
    enabled: true
    storageClass: "managed-csi-premium"
    size: 100Gi
  
  env:
    NVIDIA_DRIVER_CAPABILITIES: "all"
    OLLAMA_LOAD_TIMEOUT: "-1"
    OLLAMA_KEEP_ALIVE: "-1"
    OLLAMA_DEBUG: "1"

# Ingress configuration (NGINX ingress controller on Azure AKS)
ingress:
  enabled: true
  className: nginx
  
  annotations:
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
  
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
```

--------------------------------------------------------------------------------

````
