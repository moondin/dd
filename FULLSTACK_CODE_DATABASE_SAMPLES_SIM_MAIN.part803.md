---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 803
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 803 of 933)

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

---[FILE: shared-storage.yaml]---
Location: sim-main/helm/sim/templates/shared-storage.yaml

```yaml
{{- if .Values.sharedStorage.enabled }}
{{- range .Values.sharedStorage.volumes }}
---
# Shared Storage PVC for {{ .name }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "sim.fullname" $ }}-{{ .name }}
  namespace: {{ $.Release.Namespace }}
  labels:
    {{- include "sim.labels" $ | nindent 4 }}
    sim.ai/volume-type: shared-storage
    sim.ai/volume-name: {{ .name }}
  {{- with .annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .storageClass }}
  {{- if (eq "-" .storageClass) }}
  storageClassName: ""
  {{- else }}
  storageClassName: {{ .storageClass | quote }}
  {{- end }}
  {{- else if $.Values.sharedStorage.storageClass }}
  storageClassName: {{ $.Values.sharedStorage.storageClass | quote }}
  {{- else if $.Values.global.storageClass }}
  storageClassName: {{ $.Values.global.storageClass | quote }}
  {{- end }}
  accessModes:
    {{- if .accessModes }}
    {{- range .accessModes }}
    - {{ . | quote }}
    {{- end }}
    {{- else }}
    {{- range $.Values.sharedStorage.defaultAccessModes }}
    - {{ . | quote }}
    {{- end }}
    {{- end }}
  resources:
    requests:
      storage: {{ .size | quote }}
  {{- if .selector }}
  selector:
    {{- toYaml .selector | nindent 4 }}
  {{- end }}
{{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: statefulset-copilot-postgres.yaml]---
Location: sim-main/helm/sim/templates/statefulset-copilot-postgres.yaml

```yaml
{{- if and .Values.copilot.enabled .Values.copilot.postgresql.enabled }}
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "sim.fullname" . }}-copilot-postgresql-secret
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot-postgresql
type: Opaque
stringData:
  POSTGRES_USER: {{ .Values.copilot.postgresql.auth.username | quote }}
  POSTGRES_PASSWORD: {{ required "copilot.postgresql.auth.password is required when copilot is enabled" .Values.copilot.postgresql.auth.password | quote }}
  POSTGRES_DB: {{ .Values.copilot.postgresql.auth.database | quote }}
  DATABASE_URL: "postgresql://{{ .Values.copilot.postgresql.auth.username }}:{{ .Values.copilot.postgresql.auth.password }}@{{ include "sim.fullname" . }}-copilot-postgresql:{{ .Values.copilot.postgresql.service.port }}/{{ .Values.copilot.postgresql.auth.database }}"
---
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-copilot-postgresql
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot-postgresql
spec:
  type: {{ .Values.copilot.postgresql.service.type }}
  ports:
    - port: {{ .Values.copilot.postgresql.service.port }}
      targetPort: {{ .Values.copilot.postgresql.service.targetPort }}
      protocol: TCP
      name: postgresql
  selector:
    app.kubernetes.io/name: {{ include "sim.name" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/component: copilot-postgresql
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ include "sim.fullname" . }}-copilot-postgresql
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot-postgresql
spec:
  serviceName: {{ include "sim.fullname" . }}-copilot-postgresql
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "sim.name" . }}
      app.kubernetes.io/instance: {{ .Release.Name }}
      app.kubernetes.io/component: copilot-postgresql
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ include "sim.name" . }}
        app.kubernetes.io/instance: {{ .Release.Name }}
        app.kubernetes.io/component: copilot-postgresql
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.copilot.postgresql.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.copilot.postgresql.podSecurityContext }}
      securityContext:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      containers:
        - name: postgresql
          image: {{ include "sim.image" (dict "context" . "image" .Values.copilot.postgresql.image) }}
          imagePullPolicy: {{ .Values.copilot.postgresql.image.pullPolicy }}
          ports:
            - name: postgresql
              containerPort: {{ .Values.copilot.postgresql.service.targetPort }}
              protocol: TCP
          envFrom:
            - secretRef:
                name: {{ include "sim.fullname" . }}-copilot-postgresql-secret
          {{- if .Values.copilot.postgresql.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.copilot.postgresql.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.copilot.postgresql.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.copilot.postgresql.readinessProbe | nindent 12 }}
          {{- end }}
          {{- with .Values.copilot.postgresql.resources }}
          resources:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .Values.copilot.postgresql.securityContext }}
          securityContext:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- if .Values.copilot.postgresql.persistence.enabled }}
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
              subPath: pgdata
          {{- end }}
  {{- if .Values.copilot.postgresql.persistence.enabled }}
  volumeClaimTemplates:
    - metadata:
        name: data
        labels:
          {{- include "sim.labels" . | nindent 10 }}
          app.kubernetes.io/component: copilot-postgresql
      spec:
        accessModes:
          {{- range .Values.copilot.postgresql.persistence.accessModes }}
          - {{ . | quote }}
          {{- end }}
        {{- if .Values.copilot.postgresql.persistence.storageClass }}
        {{- if (eq "-" .Values.copilot.postgresql.persistence.storageClass) }}
        storageClassName: ""
        {{- else }}
        storageClassName: {{ .Values.copilot.postgresql.persistence.storageClass | quote }}
        {{- end }}
        {{- else if .Values.global.storageClass }}
        storageClassName: {{ .Values.global.storageClass | quote }}
        {{- end }}
        resources:
          requests:
            storage: {{ .Values.copilot.postgresql.persistence.size | quote }}
  {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: statefulset-postgresql.yaml]---
Location: sim-main/helm/sim/templates/statefulset-postgresql.yaml

```yaml
{{- if .Values.postgresql.enabled }}
---
# ConfigMap for PostgreSQL configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "sim.fullname" . }}-postgresql-config
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
data:
  postgresql.conf: |
    hba_file = '/etc/postgresql/pg_hba.conf'
    listen_addresses = '0.0.0.0'
    max_connections = {{ .Values.postgresql.config.maxConnections }}
    tcp_keepalives_idle = 60
    tcp_keepalives_interval = 5
    tcp_keepalives_count = 3
    authentication_timeout = 1min
    password_encryption = scram-sha-256
    {{- if .Values.postgresql.tls.enabled }}
    ssl = on
    ssl_cert_file = '/etc/postgresql/tls/tls.crt'
    ssl_key_file = '/etc/postgresql/tls/tls.key'
    {{- else }}
    ssl = off
    {{- end }}
    shared_buffers = {{ .Values.postgresql.config.sharedBuffers }}
    dynamic_shared_memory_type = posix
    max_wal_size = {{ .Values.postgresql.config.maxWalSize }}
    min_wal_size = {{ .Values.postgresql.config.minWalSize }}
    log_timezone = 'Etc/UTC'
    idle_in_transaction_session_timeout = 50000000
    datestyle = 'iso, mdy'
    timezone = 'Etc/UTC'
    lc_messages = 'en_US.utf8'
    lc_monetary = 'en_US.utf8'
    lc_numeric = 'en_US.utf8'
    lc_time = 'en_US.utf8'
    default_text_search_config = 'pg_catalog.english'
  
  pg_hba.conf: |
    # Secure authentication for all connections
    local all         all               scram-sha-256
    host  all         all 127.0.0.1/32  scram-sha-256
    host  all         all ::1/128       scram-sha-256
    host  all         all all           scram-sha-256

    # Replication connections also require authentication
    local replication all               scram-sha-256
    host  replication all 127.0.0.1/32  scram-sha-256
    host  replication all ::1/128       scram-sha-256

---
# ConfigMap for PostgreSQL environment variables
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "sim.fullname" . }}-postgresql-env
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
data:
  POSTGRES_DB: {{ .Values.postgresql.auth.database | quote }}
  POSTGRES_USER: {{ .Values.postgresql.auth.username | quote }}
  PGDATA: "/var/lib/postgresql/data/pgdata"

---
# Secret for PostgreSQL password
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "sim.fullname" . }}-postgresql-secret
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
type: Opaque
data:
  POSTGRES_PASSWORD: {{ .Values.postgresql.auth.password | b64enc }}

---
# StatefulSet for PostgreSQL
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ include "sim.fullname" . }}-postgresql
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
spec:
  serviceName: {{ include "sim.fullname" . }}-postgresql
  replicas: 1
  minReadySeconds: 10
  selector:
    matchLabels:
      {{- include "sim.postgresql.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        {{- include "sim.postgresql.selectorLabels" . | nindent 8 }}
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "sim.serviceAccountName" . }}
      {{- include "sim.podSecurityContext" .Values.postgresql | nindent 6 }}
      {{- include "sim.nodeSelector" .Values.postgresql | nindent 6 }}
      {{- include "sim.tolerations" .Values | nindent 6 }}
      {{- include "sim.affinity" .Values | nindent 6 }}
      containers:
        - name: postgresql
          image: {{ include "sim.image" (dict "context" . "image" .Values.postgresql.image) }}
          imagePullPolicy: {{ .Values.postgresql.image.pullPolicy }}
          args: ["-c", "config_file=/etc/postgresql/postgresql.conf"]
          ports:
            - name: postgresql
              containerPort: {{ .Values.postgresql.service.targetPort }}
              protocol: TCP
          envFrom:
            - configMapRef:
                name: {{ include "sim.fullname" . }}-postgresql-env
            - secretRef:
                name: {{ include "sim.fullname" . }}-postgresql-secret
          {{- if .Values.postgresql.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.postgresql.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.postgresql.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.postgresql.readinessProbe | nindent 12 }}
          {{- end }}
          {{- include "sim.resources" .Values.postgresql | nindent 10 }}
          {{- include "sim.securityContext" .Values.postgresql | nindent 10 }}
          volumeMounts:
            {{- if .Values.postgresql.persistence.enabled }}
            - name: postgresql-data
              mountPath: /var/lib/postgresql/data
              subPath: pgdata
            {{- end }}
            - name: postgresql-config
              mountPath: "/etc/postgresql"
            {{- if .Values.postgresql.tls.enabled }}
            - name: postgresql-tls
              mountPath: "/etc/postgresql/tls"
              readOnly: true
            {{- end }}
            {{- with .Values.extraVolumeMounts }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
      volumes:
        - name: postgresql-config
          configMap:
            name: {{ include "sim.fullname" . }}-postgresql-config
        {{- if .Values.postgresql.tls.enabled }}
        - name: postgresql-tls
          secret:
            secretName: {{ .Values.postgresql.tls.certificatesSecret }}
            defaultMode: 0600
        {{- end }}
        {{- with .Values.extraVolumes }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
  {{- if .Values.postgresql.persistence.enabled }}
  volumeClaimTemplates:
    - metadata:
        name: postgresql-data
        labels:
          {{- include "sim.postgresql.labels" . | nindent 10 }}
      spec:
        {{- if .Values.postgresql.persistence.storageClass }}
        {{- if (eq "-" .Values.postgresql.persistence.storageClass) }}
        storageClassName: ""
        {{- else }}
        storageClassName: {{ .Values.postgresql.persistence.storageClass | quote }}
        {{- end }}
        {{- else if .Values.global.storageClass }}
        storageClassName: {{ .Values.global.storageClass | quote }}
        {{- end }}
        accessModes:
          {{- range .Values.postgresql.persistence.accessModes }}
          - {{ . | quote }}
          {{- end }}
        resources:
          requests:
            storage: {{ .Values.postgresql.persistence.size | quote }}
  {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: telemetry.yaml]---
Location: sim-main/helm/sim/templates/telemetry.yaml

```yaml
{{- if .Values.telemetry.enabled }}
---
# OpenTelemetry Collector Configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "sim.fullname" . }}-otel-config
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: telemetry
data:
  otel-config.yaml: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
      prometheus:
        config:
          scrape_configs:
            - job_name: 'sim-app'
              static_configs:
                - targets: ['{{ include "sim.fullname" . }}-app:{{ .Values.app.service.port }}']
            - job_name: 'sim-realtime'
              static_configs:
                - targets: ['{{ include "sim.fullname" . }}-realtime:{{ .Values.realtime.service.port }}']
      
    processors:
      batch:
        timeout: 1s
        send_batch_size: 1024
      memory_limiter:
        limit_mib: 512
      
    exporters:
      {{- if .Values.telemetry.jaeger.enabled }}
      jaeger:
        endpoint: {{ .Values.telemetry.jaeger.endpoint }}
        tls:
          insecure: {{ not .Values.telemetry.jaeger.tls.enabled }}
      {{- end }}
      {{- if .Values.telemetry.prometheus.enabled }}
      prometheusremotewrite:
        endpoint: {{ .Values.telemetry.prometheus.endpoint }}
        headers:
          Authorization: {{ .Values.telemetry.prometheus.auth | quote }}
      {{- end }}
      {{- if .Values.telemetry.otlp.enabled }}
      otlp:
        endpoint: {{ .Values.telemetry.otlp.endpoint }}
        tls:
          insecure: {{ not .Values.telemetry.otlp.tls.enabled }}
      {{- end }}
      logging:
        loglevel: info
    
    extensions:
      health_check:
        endpoint: 0.0.0.0:13133
      pprof:
        endpoint: 0.0.0.0:1777
      zpages:
        endpoint: 0.0.0.0:55679
    
    service:
      extensions: [health_check, pprof, zpages]
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters:
            - logging
            {{- if .Values.telemetry.jaeger.enabled }}
            - jaeger
            {{- end }}
            {{- if .Values.telemetry.otlp.enabled }}
            - otlp
            {{- end }}
        metrics:
          receivers: [otlp, prometheus]
          processors: [memory_limiter, batch]
          exporters:
            - logging
            {{- if .Values.telemetry.prometheus.enabled }}
            - prometheusremotewrite
            {{- end }}
            {{- if .Values.telemetry.otlp.enabled }}
            - otlp
            {{- end }}
        logs:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters:
            - logging
            {{- if .Values.telemetry.otlp.enabled }}
            - otlp
            {{- end }}
---
# OpenTelemetry Collector Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "sim.fullname" . }}-otel-collector
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: telemetry
spec:
  replicas: {{ .Values.telemetry.replicaCount }}
  selector:
    matchLabels:
      {{- include "sim.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/component: telemetry
  template:
    metadata:
      labels:
        {{- include "sim.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/component: telemetry
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "sim.serviceAccountName" . }}
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
        - name: otel-collector
          image: {{ include "sim.image" (dict "context" . "image" .Values.telemetry.image) }}
          imagePullPolicy: {{ .Values.telemetry.image.pullPolicy }}
          command:
            - /otelcol-contrib
            - --config=/etc/otel-collector-config/otel-config.yaml
          ports:
            - name: otlp-grpc
              containerPort: 4317
              protocol: TCP
            - name: otlp-http
              containerPort: 4318
              protocol: TCP
            - name: health
              containerPort: 13133
              protocol: TCP
            - name: pprof
              containerPort: 1777
              protocol: TCP
            - name: zpages
              containerPort: 55679
              protocol: TCP
          env:
            - name: GOGC
              value: "80"
          volumeMounts:
            - name: otel-config
              mountPath: /etc/otel-collector-config
              readOnly: true
          livenessProbe:
            httpGet:
              path: /
              port: health
            initialDelaySeconds: 10
            periodSeconds: 30
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /
              port: health
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          resources:
            {{- toYaml .Values.telemetry.resources | nindent 12 }}
      volumes:
        - name: otel-config
          configMap:
            name: {{ include "sim.fullname" . }}-otel-config
      {{- with .Values.telemetry.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.telemetry.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.telemetry.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
---
# OpenTelemetry Collector Service
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-otel-collector
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: telemetry
spec:
  type: {{ .Values.telemetry.service.type }}
  ports:
    - name: otlp-grpc
      port: 4317
      targetPort: otlp-grpc
      protocol: TCP
    - name: otlp-http
      port: 4318
      targetPort: otlp-http
      protocol: TCP
    - name: health
      port: 13133
      targetPort: health
      protocol: TCP
  selector:
    {{- include "sim.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/component: telemetry
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: _helpers.tpl]---
Location: sim-main/helm/sim/templates/_helpers.tpl

```text
{{/*
Expand the name of the chart.
*/}}
{{- define "sim.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "sim.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "sim.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "sim.labels" -}}
helm.sh/chart: {{ include "sim.chart" . }}
{{ include "sim.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- with .Values.global.commonLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "sim.selectorLabels" -}}
app.kubernetes.io/name: {{ include "sim.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
App specific labels
*/}}
{{- define "sim.app.labels" -}}
{{ include "sim.labels" . }}
app.kubernetes.io/component: app
{{- end }}

{{/*
App selector labels
*/}}
{{- define "sim.app.selectorLabels" -}}
{{ include "sim.selectorLabels" . }}
app.kubernetes.io/component: app
{{- end }}

{{/*
Realtime specific labels
*/}}
{{- define "sim.realtime.labels" -}}
{{ include "sim.labels" . }}
app.kubernetes.io/component: realtime
{{- end }}

{{/*
Realtime selector labels
*/}}
{{- define "sim.realtime.selectorLabels" -}}
{{ include "sim.selectorLabels" . }}
app.kubernetes.io/component: realtime
{{- end }}

{{/*
PostgreSQL specific labels
*/}}
{{- define "sim.postgresql.labels" -}}
{{ include "sim.labels" . }}
app.kubernetes.io/component: postgresql
{{- end }}

{{/*
PostgreSQL selector labels
*/}}
{{- define "sim.postgresql.selectorLabels" -}}
{{ include "sim.selectorLabels" . }}
app.kubernetes.io/component: postgresql
{{- end }}

{{/*
Ollama specific labels
*/}}
{{- define "sim.ollama.labels" -}}
{{ include "sim.labels" . }}
app.kubernetes.io/component: ollama
{{- end }}

{{/*
Ollama selector labels
*/}}
{{- define "sim.ollama.selectorLabels" -}}
{{ include "sim.selectorLabels" . }}
app.kubernetes.io/component: ollama
{{- end }}

{{/*
Migrations specific labels
*/}}
{{- define "sim.migrations.labels" -}}
{{ include "sim.labels" . }}
app.kubernetes.io/component: migrations
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "sim.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "sim.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create image name with registry
Expects context with image object passed as second parameter
Usage: {{ include "sim.image" (dict "context" . "image" .Values.app.image) }}
*/}}
{{- define "sim.image" -}}
{{- $registry := "" -}}
{{- $repository := .image.repository -}}
{{- $tag := .image.tag | toString -}}
{{- /* Use global registry for simstudioai images or when explicitly set for all images */ -}}
{{- if .context.Values.global.imageRegistry -}}
  {{- if or (hasPrefix "simstudioai/" $repository) .context.Values.global.useRegistryForAllImages -}}
    {{- $registry = .context.Values.global.imageRegistry -}}
  {{- end -}}
{{- end -}}
{{- if $registry -}}
{{- printf "%s/%s:%s" $registry $repository $tag }}
{{- else -}}
{{- printf "%s:%s" $repository $tag }}
{{- end -}}
{{- end }}

{{/*
Database URL for internal PostgreSQL
*/}}
{{- define "sim.databaseUrl" -}}
{{- if .Values.postgresql.enabled }}
{{- $host := printf "%s-postgresql" (include "sim.fullname" .) }}
{{- $port := .Values.postgresql.service.port }}
{{- $username := .Values.postgresql.auth.username }}
{{- $database := .Values.postgresql.auth.database }}
{{- $sslMode := ternary "require" "disable" .Values.postgresql.tls.enabled }}
{{- printf "postgresql://%s:$(POSTGRES_PASSWORD)@%s:%v/%s?sslmode=%s" $username $host $port $database $sslMode }}
{{- else if .Values.externalDatabase.enabled }}
{{- $host := .Values.externalDatabase.host }}
{{- $port := .Values.externalDatabase.port }}
{{- $username := .Values.externalDatabase.username }}
{{- $database := .Values.externalDatabase.database }}
{{- $sslMode := .Values.externalDatabase.sslMode }}
{{- printf "postgresql://%s:$(EXTERNAL_DB_PASSWORD)@%s:%v/%s?sslmode=%s" $username $host $port $database $sslMode }}
{{- end }}
{{- end }}

{{/*
Validate required secrets and reject default placeholder values
*/}}
{{- define "sim.validateSecrets" -}}
{{- if and .Values.app.enabled (not .Values.app.env.BETTER_AUTH_SECRET) }}
{{- fail "app.env.BETTER_AUTH_SECRET is required for production deployment" }}
{{- end }}
{{- if and .Values.app.enabled (eq .Values.app.env.BETTER_AUTH_SECRET "CHANGE-ME-32-CHAR-SECRET-FOR-PRODUCTION-USE") }}
{{- fail "app.env.BETTER_AUTH_SECRET must not use the default placeholder value. Generate a secure secret with: openssl rand -hex 32" }}
{{- end }}
{{- if and .Values.app.enabled (not .Values.app.env.ENCRYPTION_KEY) }}
{{- fail "app.env.ENCRYPTION_KEY is required for production deployment" }}
{{- end }}
{{- if and .Values.app.enabled (eq .Values.app.env.ENCRYPTION_KEY "CHANGE-ME-32-CHAR-ENCRYPTION-KEY-FOR-PROD") }}
{{- fail "app.env.ENCRYPTION_KEY must not use the default placeholder value. Generate a secure key with: openssl rand -hex 32" }}
{{- end }}
{{- if and .Values.realtime.enabled (eq .Values.realtime.env.BETTER_AUTH_SECRET "CHANGE-ME-32-CHAR-SECRET-FOR-PRODUCTION-USE") }}
{{- fail "realtime.env.BETTER_AUTH_SECRET must not use the default placeholder value. Generate a secure secret with: openssl rand -hex 32" }}
{{- end }}
{{- if and .Values.postgresql.enabled (not .Values.postgresql.auth.password) }}
{{- fail "postgresql.auth.password is required when using internal PostgreSQL" }}
{{- end }}
{{- if and .Values.postgresql.enabled (eq .Values.postgresql.auth.password "CHANGE-ME-SECURE-PASSWORD") }}
{{- fail "postgresql.auth.password must not use the default placeholder value. Set a secure password for production" }}
{{- end }}
{{- if and .Values.postgresql.enabled (not (regexMatch "^[a-zA-Z0-9._-]+$" .Values.postgresql.auth.password)) }}
{{- fail "postgresql.auth.password must only contain alphanumeric characters, hyphens, underscores, or periods to ensure DATABASE_URL compatibility. Generate with: openssl rand -base64 16 | tr -d '/+='" }}
{{- end }}
{{- if and .Values.externalDatabase.enabled (not .Values.externalDatabase.password) }}
{{- fail "externalDatabase.password is required when using external database" }}
{{- end }}
{{- if and .Values.externalDatabase.enabled .Values.externalDatabase.password (not (regexMatch "^[a-zA-Z0-9._-]+$" .Values.externalDatabase.password)) }}
{{- fail "externalDatabase.password must only contain alphanumeric characters, hyphens, underscores, or periods to ensure DATABASE_URL compatibility." }}
{{- end }}
{{- end }}

{{/*
Ollama URL
*/}}
{{- define "sim.ollamaUrl" -}}
{{- if .Values.ollama.enabled }}
{{- $serviceName := printf "%s-ollama" (include "sim.fullname" .) }}
{{- $port := .Values.ollama.service.port }}
{{- printf "http://%s:%v" $serviceName $port }}
{{- else }}
{{- .Values.app.env.OLLAMA_URL | default "http://localhost:11434" }}
{{- end }}
{{- end }}

{{/*
Socket Server URL (internal)
*/}}
{{- define "sim.socketServerUrl" -}}
{{- if .Values.realtime.enabled }}
{{- $serviceName := printf "%s-realtime" (include "sim.fullname" .) }}
{{- $port := .Values.realtime.service.port }}
{{- printf "http://%s:%v" $serviceName $port }}
{{- else }}
{{- .Values.app.env.SOCKET_SERVER_URL | default "http://localhost:3002" }}
{{- end }}
{{- end }}

{{/*
Resource limits and requests
*/}}
{{- define "sim.resources" -}}
{{- if .resources }}
resources:
  {{- if .resources.limits }}
  limits:
    {{- toYaml .resources.limits | nindent 4 }}
  {{- end }}
  {{- if .resources.requests }}
  requests:
    {{- toYaml .resources.requests | nindent 4 }}
  {{- end }}
{{- end }}
{{- end }}

{{/*
Security context
*/}}
{{- define "sim.securityContext" -}}
{{- if .securityContext }}
securityContext:
  {{- toYaml .securityContext | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Pod security context
*/}}
{{- define "sim.podSecurityContext" -}}
{{- if .podSecurityContext }}
securityContext:
  {{- toYaml .podSecurityContext | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Node selector
*/}}
{{- define "sim.nodeSelector" -}}
{{- if .nodeSelector }}
nodeSelector:
  {{- toYaml .nodeSelector | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Tolerations
*/}}
{{- define "sim.tolerations" -}}
{{- if .tolerations }}
tolerations:
  {{- toYaml .tolerations | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Affinity
*/}}
{{- define "sim.affinity" -}}
{{- if .affinity }}
affinity:
  {{- toYaml .affinity | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Copilot environment secret name
*/}}
{{- define "sim.copilot.envSecretName" -}}
{{- if and .Values.copilot.server.secret.name (ne .Values.copilot.server.secret.name "") -}}
{{- .Values.copilot.server.secret.name -}}
{{- else -}}
{{- printf "%s-copilot-env" (include "sim.fullname" .) -}}
{{- end -}}
{{- end }}

{{/*
Copilot database secret name
*/}}
{{- define "sim.copilot.databaseSecretName" -}}
{{- if .Values.copilot.postgresql.enabled -}}
{{- printf "%s-copilot-postgresql-secret" (include "sim.fullname" .) -}}
{{- else if and .Values.copilot.database.existingSecretName (ne .Values.copilot.database.existingSecretName "") -}}
{{- .Values.copilot.database.existingSecretName -}}
{{- else -}}
{{- printf "%s-copilot-database-secret" (include "sim.fullname" .) -}}
{{- end -}}
{{- end }}

{{/*
Copilot database secret key
*/}}
{{- define "sim.copilot.databaseSecretKey" -}}
{{- default "DATABASE_URL" .Values.copilot.database.secretKey -}}
{{- end }}

{{/*
Validate Copilot configuration
*/}}
{{- define "sim.copilot.validate" -}}
{{- if .Values.copilot.enabled -}}
  {{- if and (not .Values.copilot.server.secret.create) (or (not .Values.copilot.server.secret.name) (eq .Values.copilot.server.secret.name "")) -}}
    {{- fail "copilot.server.secret.name must be provided when copilot.server.secret.create=false" -}}
  {{- end -}}
  {{- if .Values.copilot.server.secret.create -}}
    {{- $env := .Values.copilot.server.env -}}
    {{- $required := list "AGENT_API_DB_ENCRYPTION_KEY" "INTERNAL_API_SECRET" "LICENSE_KEY" "SIM_BASE_URL" "SIM_AGENT_API_KEY" "REDIS_URL" -}}
    {{- range $key := $required -}}
      {{- if not (and $env (index $env $key) (ne (index $env $key) "")) -}}
        {{- fail (printf "copilot.server.env.%s is required when copilot is enabled" $key) -}}
      {{- end -}}
    {{- end -}}
    {{- $hasOpenAI := and $env (ne (default "" (index $env "OPENAI_API_KEY_1")) "") -}}
    {{- $hasAnthropic := and $env (ne (default "" (index $env "ANTHROPIC_API_KEY_1")) "") -}}
    {{- if not (or $hasOpenAI $hasAnthropic) -}}
      {{- fail "Set at least one of copilot.server.env.OPENAI_API_KEY_1 or copilot.server.env.ANTHROPIC_API_KEY_1" -}}
    {{- end -}}
  {{- end -}}
  {{- if .Values.copilot.postgresql.enabled -}}
    {{- if or (not .Values.copilot.postgresql.auth.password) (eq .Values.copilot.postgresql.auth.password "") -}}
      {{- fail "copilot.postgresql.auth.password is required when copilot.postgresql.enabled=true" -}}
    {{- end -}}
  {{- else -}}
    {{- if and (or (not .Values.copilot.database.existingSecretName) (eq .Values.copilot.database.existingSecretName "")) (or (not .Values.copilot.database.url) (eq .Values.copilot.database.url "")) -}}
      {{- fail "Provide copilot.database.existingSecretName or copilot.database.url when copilot.postgresql.enabled=false" -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/packages/README.md

```text
# Sim SDKs

This directory contains the official SDKs for [Sim](https://sim.ai), allowing developers to execute workflows programmatically from their applications.

## Available SDKs

### Package Installation Commands

- **TypeScript/JavaScript**: `npm install simstudio-ts-sdk`
- **Python**: `pip install simstudio-sdk`

### 🟢 TypeScript/JavaScript SDK (`simstudio-ts-sdk`)

**Directory:** `ts-sdk/`

The TypeScript SDK provides type-safe workflow execution for Node.js and browser environments.

**Installation:**
```bash
npm install simstudio-ts-sdk
# or 
yarn add simstudio-ts-sdk
# or
bun add simstudio-ts-sdk
```

**Quick Start:**
```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: 'your-api-key-here'
});

const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello, world!' }
});
```

### 🐍 Python SDK (`simstudio-sdk`)

**Directory:** `python-sdk/`

The Python SDK provides Pythonic workflow execution with comprehensive error handling and data classes.

**Installation:**
```bash
pip install simstudio-sdk
```

**Quick Start:**
```python
from simstudio import SimStudioClient

client = SimStudioClient(api_key='your-api-key-here')

result = client.execute_workflow('workflow-id', 
    input_data={'message': 'Hello, world!'})
```

## Core Features

Both SDKs provide the same core functionality:

✅ **Workflow Execution** - Execute deployed workflows with optional input data  
✅ **Status Checking** - Check deployment status and workflow readiness  
✅ **Error Handling** - Comprehensive error handling with specific error codes  
✅ **Timeout Support** - Configurable timeouts for workflow execution  
✅ **Input Validation** - Validate workflows before execution  
✅ **Type Safety** - Full type definitions (TypeScript) and data classes (Python)  

## API Compatibility

Both SDKs are built on top of the same REST API endpoints:

- `POST /api/workflows/{id}/execute` - Execute workflow (with or without input)
- `GET /api/workflows/{id}/status` - Get workflow status

## Authentication

Both SDKs use API key authentication via the `X-API-Key` header. You can obtain an API key by:

1. Logging in to your [Sim](https://sim.ai) account
2. Navigating to your workflow
3. Clicking "Deploy" to deploy your workflow
4. Creating or selecting an API key during deployment

## Environment Variables

Both SDKs support environment variable configuration:

```bash
# Required
SIM_API_KEY=your-api-key-here

# Optional
SIM_BASE_URL=https://sim.ai  # or your custom domain
```

## Error Handling

Both SDKs provide consistent error handling with these error codes:

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid API key |
| `TIMEOUT` | Request timed out |
| `USAGE_LIMIT_EXCEEDED` | Account usage limit exceeded |
| `INVALID_JSON` | Invalid JSON in request body |
| `EXECUTION_ERROR` | General execution error |
| `STATUS_ERROR` | Error getting workflow status |

## Examples

### TypeScript Example

```typescript
import { SimStudioClient, SimStudioError } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

try {
  // Check if workflow is ready
  const isReady = await client.validateWorkflow('workflow-id');
  if (!isReady) {
    throw new Error('Workflow not deployed');
  }

  // Execute workflow
  const result = await client.executeWorkflow('workflow-id', {
    input: { data: 'example' },
    timeout: 30000
  });

  if (result.success) {
    console.log('Output:', result.output);
  }
} catch (error) {
  if (error instanceof SimStudioError) {
    console.error(`Error ${error.code}: ${error.message}`);
  }
}
```

### Python Example

```python
from simstudio import SimStudioClient, SimStudioError
import os

client = SimStudioClient(api_key=os.getenv('SIM_API_KEY'))

try:
    # Check if workflow is ready
    is_ready = client.validate_workflow('workflow-id')
    if not is_ready:
        raise Exception('Workflow not deployed')

    # Execute workflow
    result = client.execute_workflow('workflow-id', 
        input_data={'data': 'example'},
        timeout=30.0)

    if result.success:
        print(f'Output: {result.output}')
        
except SimStudioError as error:
    print(f'Error {error.code}: {error}')
```

## Development

### Building the SDKs

**TypeScript SDK:**
```bash
cd packages/ts-sdk
bun install
bun run build
```

**Python SDK:**
```bash
cd packages/python-sdk
pip install -e ".[dev]"
python -m build
```

### Running Examples

**TypeScript:**
```bash
cd packages/ts-sdk
SIM_API_KEY=your-key bun run examples/basic-usage.ts
```

**Python:**
```bash
cd packages/python-sdk
SIM_API_KEY=your-key python examples/basic_usage.py
```

### Testing

**TypeScript:**
```bash
cd packages/ts-sdk
bun run test
```

**Python:**
```bash
cd packages/python-sdk
pytest
```

## Publishing

The SDKs are automatically published to npm and PyPI when changes are pushed to the main branch. See [Publishing Setup](../.github/PUBLISHING.md) for details on:

- Setting up GitHub secrets for automated publishing
- Manual publishing instructions
- Version management and semantic versioning
- Troubleshooting common issues

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for your changes
5. Run the test suite: `bun run test` (TypeScript) or `pytest` (Python)
6. Update version numbers if needed
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

## License

Both SDKs are licensed under the Apache-2.0 License. See the [LICENSE](../LICENSE) file for details.

## Support

- 📖 [Documentation](https://docs.sim.ai)
- 💬 [Discord Community](https://discord.gg/simstudio)
- 🐛 [Issue Tracker](https://github.com/simstudioai/sim/issues)
- 📧 [Email Support](mailto:support@sim.ai)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: sim-main/packages/cli/package.json
Signals: Docker

```json
{
  "name": "simstudio",
  "version": "0.1.19",
  "description": "Sim CLI - Run Sim with a single command",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "simstudio": "dist/index.js"
  },
  "scripts": {
    "build": "bun run build:tsc",
    "build:tsc": "tsc",
    "prepublishOnly": "bun run build"
  },
  "files": [
    "dist"
  ],
  "keywords": [
    "simstudio",
    "ai",
    "workflow",
    "ui",
    "cli",
    "sim",
    "sim-studio",
    "agent",
    "agents",
    "automation",
    "docker"
  ],
  "author": "Sim",
  "license": "Apache-2.0",
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^11.1.0",
    "dotenv": "^16.3.1",
    "inquirer": "^8.2.6",
    "listr2": "^6.6.1"
  },
  "devDependencies": {
    "@types/inquirer": "^8.2.6",
    "@types/node": "^20.5.1",
    "typescript": "^5.1.6"
  },
  "engines": {
    "node": ">=16"
  },
  "turbo": {
    "tasks": {
      "build": {
        "outputs": [
          "dist/**"
        ]
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
