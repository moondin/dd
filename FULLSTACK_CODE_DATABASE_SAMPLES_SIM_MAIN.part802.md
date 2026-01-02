---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 802
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 802 of 933)

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

---[FILE: deployment-copilot.yaml]---
Location: sim-main/helm/sim/templates/deployment-copilot.yaml

```yaml
{{- if .Values.copilot.enabled }}
{{- include "sim.copilot.validate" . }}
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-copilot
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot
spec:
  type: {{ .Values.copilot.server.service.type }}
  ports:
    - port: {{ .Values.copilot.server.service.port }}
      targetPort: {{ .Values.copilot.server.service.targetPort }}
      protocol: TCP
      name: http
  selector:
    app.kubernetes.io/name: {{ include "sim.name" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/component: copilot
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "sim.fullname" . }}-copilot
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot
spec:
  replicas: {{ .Values.copilot.server.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "sim.name" . }}
      app.kubernetes.io/instance: {{ .Release.Name }}
      app.kubernetes.io/component: copilot
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        app.kubernetes.io/name: {{ include "sim.name" . }}
        app.kubernetes.io/instance: {{ .Release.Name }}
        app.kubernetes.io/component: copilot
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.copilot.server.podSecurityContext }}
      securityContext:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.copilot.server.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      containers:
        - name: copilot
          image: {{ include "sim.image" (dict "context" . "image" .Values.copilot.server.image) }}
          imagePullPolicy: {{ .Values.copilot.server.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.copilot.server.service.targetPort }}
              protocol: TCP
          envFrom:
            - secretRef:
                name: {{ include "sim.copilot.envSecretName" . }}
            - secretRef:
                name: {{ include "sim.copilot.databaseSecretName" . }}
            {{- with .Values.copilot.server.extraEnvFrom }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
          {{- with .Values.copilot.server.extraEnv }}
          env:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- if .Values.copilot.server.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.copilot.server.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.copilot.server.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.copilot.server.readinessProbe | nindent 12 }}
          {{- end }}
          {{- with .Values.copilot.server.resources }}
          resources:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .Values.copilot.server.securityContext }}
          securityContext:
            {{- toYaml . | nindent 12 }}
          {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: deployment-ollama.yaml]---
Location: sim-main/helm/sim/templates/deployment-ollama.yaml

```yaml
{{- if .Values.ollama.enabled }}
---
# PersistentVolumeClaim for Ollama data
{{- if .Values.ollama.persistence.enabled }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "sim.fullname" . }}-ollama-data
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.ollama.labels" . | nindent 4 }}
spec:
  {{- if .Values.ollama.persistence.storageClass }}
  {{- if (eq "-" .Values.ollama.persistence.storageClass) }}
  storageClassName: ""
  {{- else }}
  storageClassName: {{ .Values.ollama.persistence.storageClass | quote }}
  {{- end }}
  {{- else if .Values.global.storageClass }}
  storageClassName: {{ .Values.global.storageClass | quote }}
  {{- end }}
  accessModes:
    {{- range .Values.ollama.persistence.accessModes }}
    - {{ . | quote }}
    {{- end }}
  resources:
    requests:
      storage: {{ .Values.ollama.persistence.size | quote }}
{{- end }}

---
# Deployment for Ollama
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "sim.fullname" . }}-ollama
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.ollama.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.ollama.replicaCount }}
  selector:
    matchLabels:
      {{- include "sim.ollama.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        {{- include "sim.ollama.selectorLabels" . | nindent 8 }}
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "sim.serviceAccountName" . }}
      {{- include "sim.nodeSelector" .Values.ollama | nindent 6 }}
      {{- include "sim.tolerations" .Values.ollama | nindent 6 }}
      {{- include "sim.affinity" .Values | nindent 6 }}
      containers:
        - name: ollama
          image: {{ include "sim.image" (dict "context" . "image" .Values.ollama.image) }}
          imagePullPolicy: {{ .Values.ollama.image.pullPolicy }}
          command: ["ollama", "serve"]
          ports:
            - name: http
              containerPort: {{ .Values.ollama.service.targetPort }}
              protocol: TCP
          env:
            {{- range $key, $value := .Values.ollama.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
            {{- with .Values.extraEnvVars }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
          {{- if .Values.ollama.startupProbe }}
          startupProbe:
            {{- toYaml .Values.ollama.startupProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.ollama.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.ollama.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.ollama.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.ollama.readinessProbe | nindent 12 }}
          {{- end }}
          {{- include "sim.resources" .Values.ollama | nindent 10 }}
          volumeMounts:
            {{- if .Values.ollama.persistence.enabled }}
            - name: ollama-data
              mountPath: /root/.ollama
            {{- end }}
            {{- with .Values.extraVolumeMounts }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
      {{- if .Values.ollama.persistence.enabled }}
      volumes:
        - name: ollama-data
          persistentVolumeClaim:
            claimName: {{ include "sim.fullname" . }}-ollama-data
        {{- with .Values.extraVolumes }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: deployment-realtime.yaml]---
Location: sim-main/helm/sim/templates/deployment-realtime.yaml

```yaml
{{- if .Values.realtime.enabled }}
{{- include "sim.validateSecrets" . }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "sim.fullname" . }}-realtime
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.realtime.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.realtime.replicaCount }}
  selector:
    matchLabels:
      {{- include "sim.realtime.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        {{- include "sim.realtime.selectorLabels" . | nindent 8 }}
        {{- with .Values.podLabels }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "sim.serviceAccountName" . }}
      {{- include "sim.podSecurityContext" .Values.realtime | nindent 6 }}
      {{- include "sim.nodeSelector" .Values.realtime | nindent 6 }}
      {{- include "sim.tolerations" .Values | nindent 6 }}
      {{- include "sim.affinity" .Values | nindent 6 }}
      containers:
        - name: realtime
          image: {{ include "sim.image" (dict "context" . "image" .Values.realtime.image) }}
          imagePullPolicy: {{ .Values.realtime.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.realtime.service.targetPort }}
              protocol: TCP
          env:
            - name: DATABASE_URL
              value: {{ include "sim.databaseUrl" . | quote }}
            {{- range $key, $value := .Values.realtime.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
            {{- if .Values.telemetry.enabled }}
            # OpenTelemetry configuration
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: "http://{{ include "sim.fullname" . }}-otel-collector:4318"
            - name: OTEL_SERVICE_NAME
              value: sim-realtime
            - name: OTEL_SERVICE_VERSION
              value: {{ .Chart.AppVersion | quote }}
            - name: OTEL_RESOURCE_ATTRIBUTES
              value: "service.name=sim-realtime,service.version={{ .Chart.AppVersion }},deployment.environment={{ .Values.realtime.env.NODE_ENV }}"
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
          {{- if .Values.realtime.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.realtime.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.realtime.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.realtime.readinessProbe | nindent 12 }}
          {{- end }}
          {{- include "sim.resources" .Values.realtime | nindent 10 }}
          {{- include "sim.securityContext" .Values.realtime | nindent 10 }}
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

---[FILE: external-db-secret.yaml]---
Location: sim-main/helm/sim/templates/external-db-secret.yaml

```yaml
{{- if .Values.externalDatabase.enabled }}
---
# Secret for external database credentials
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "sim.fullname" . }}-external-db-secret
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
type: Opaque
data:
  EXTERNAL_DB_PASSWORD: {{ .Values.externalDatabase.password | b64enc }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: gpu-device-plugin.yaml]---
Location: sim-main/helm/sim/templates/gpu-device-plugin.yaml

```yaml
{{- if and .Values.ollama.enabled .Values.ollama.gpu.enabled }}
---
# NVIDIA Device Plugin DaemonSet for GPU support
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: {{ include "sim.fullname" . }}-nvidia-device-plugin
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: nvidia-device-plugin
spec:
  selector:
    matchLabels:
      {{- include "sim.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/component: nvidia-device-plugin
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        {{- include "sim.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/component: nvidia-device-plugin
    spec:
      tolerations:
        # Allow scheduling on GPU nodes
        - key: nvidia.com/gpu
          operator: Exists
          effect: NoSchedule
        - key: sku
          operator: Equal
          value: gpu
          effect: NoSchedule
      nodeSelector:
        # Only schedule on nodes with NVIDIA GPUs
        accelerator: nvidia
      priorityClassName: system-node-critical
      runtimeClassName: nvidia
      hostNetwork: true
      hostPID: true
      volumes:
        - name: device-plugin
          hostPath:
            path: /var/lib/kubelet/device-plugins
        - name: dev
          hostPath:
            path: /dev
        - name: sys
          hostPath:
            path: /sys
        - name: proc-driver-nvidia
          hostPath:
            path: /proc/driver/nvidia
      containers:
        - name: nvidia-device-plugin
          image: nvcr.io/nvidia/k8s-device-plugin:v0.14.5
          imagePullPolicy: Always
          args:
            - --mig-strategy=single
            - --pass-device-specs=true
            - --fail-on-init-error=false
            - --device-list-strategy=envvar
            - --nvidia-driver-root=/host-sys/fs/cgroup
          env:
            - name: NVIDIA_MIG_MONITOR_DEVICES
              value: all
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop: ["ALL"]
          volumeMounts:
            - name: device-plugin
              mountPath: /var/lib/kubelet/device-plugins
            - name: dev
              mountPath: /dev
            - name: sys
              mountPath: /host-sys
              readOnly: true
            - name: proc-driver-nvidia
              mountPath: /proc/driver/nvidia
              readOnly: true
          resources:
            requests:
              cpu: 50m
              memory: 10Mi
            limits:
              cpu: 50m
              memory: 20Mi
  {{- if .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml .Values.nodeSelector | nindent 8 }}
  {{- end }}
---
# RuntimeClass for NVIDIA Container Runtime
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: {{ include "sim.fullname" . }}-nvidia
  labels:
    {{- include "sim.labels" . | nindent 4 }}
handler: nvidia
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: hpa.yaml]---
Location: sim-main/helm/sim/templates/hpa.yaml

```yaml
{{- if .Values.autoscaling.enabled }}
---
# HorizontalPodAutoscaler for main application
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "sim.fullname" . }}-app
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.app.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "sim.fullname" . }}-app
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    {{- end }}
    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
    {{- end }}
    {{- with .Values.autoscaling.customMetrics }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
  {{- if .Values.autoscaling.behavior }}
  behavior:
    {{- toYaml .Values.autoscaling.behavior | nindent 4 }}
  {{- end }}
{{- end }}

{{- if and .Values.autoscaling.enabled .Values.realtime.enabled }}
---
# HorizontalPodAutoscaler for realtime service
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "sim.fullname" . }}-realtime
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.realtime.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "sim.fullname" . }}-realtime
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    {{- end }}
    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
    {{- end }}
    {{- with .Values.autoscaling.customMetrics }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
  {{- if .Values.autoscaling.behavior }}
  behavior:
    {{- toYaml .Values.autoscaling.behavior | nindent 4 }}
  {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: ingress.yaml]---
Location: sim-main/helm/sim/templates/ingress.yaml

```yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "sim.fullname" . }}-ingress
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .Values.ingress.className }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  {{- if .Values.ingress.tls.enabled }}
  tls:
    - hosts:
        - {{ .Values.ingress.app.host }}
        {{- if .Values.realtime.enabled }}
        - {{ .Values.ingress.realtime.host }}
        {{- end }}
        {{- if and .Values.copilot.enabled .Values.ingress.copilot }}
        - {{ .Values.ingress.copilot.host }}
        {{- end }}
      secretName: {{ .Values.ingress.tls.secretName }}
  {{- end }}
  rules:
    # Main application ingress rule
    - host: {{ .Values.ingress.app.host }}
      http:
        paths:
          {{- range .Values.ingress.app.paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "sim.fullname" $ }}-app
                port:
                  number: {{ $.Values.app.service.port }}
          {{- end }}
    {{- if .Values.realtime.enabled }}
    # Realtime service ingress rule
    - host: {{ .Values.ingress.realtime.host }}
      http:
        paths:
          {{- range .Values.ingress.realtime.paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "sim.fullname" $ }}-realtime
                port:
                  number: {{ $.Values.realtime.service.port }}
          {{- end }}
    {{- end }}
    {{- if and .Values.copilot.enabled .Values.ingress.copilot }}
    # Copilot service ingress rule
    - host: {{ .Values.ingress.copilot.host }}
      http:
        paths:
          {{- range .Values.ingress.copilot.paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "sim.fullname" $ }}-copilot
                port:
                  number: {{ $.Values.copilot.server.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: job-copilot-migrations.yaml]---
Location: sim-main/helm/sim/templates/job-copilot-migrations.yaml

```yaml
{{- if and .Values.copilot.enabled .Values.copilot.migrations.enabled }}
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "sim.fullname" . }}-copilot-migrations
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot-migrations
  annotations:
    "helm.sh/hook": post-install,post-upgrade
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation
spec:
  backoffLimit: {{ .Values.copilot.migrations.backoffLimit }}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ include "sim.name" . }}
        app.kubernetes.io/instance: {{ .Release.Name }}
        app.kubernetes.io/component: copilot-migrations
    spec:
      {{- with .Values.global.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      restartPolicy: {{ .Values.copilot.migrations.restartPolicy }}
      {{- with .Values.copilot.migrations.podSecurityContext }}
      securityContext:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.copilot.server.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- if .Values.copilot.postgresql.enabled }}
      initContainers:
        - name: wait-for-postgres
          image: postgres:16-alpine
          command:
            - /bin/sh
            - -c
            - |
              until pg_isready -h {{ include "sim.fullname" . }}-copilot-postgresql -p {{ .Values.copilot.postgresql.service.port }} -U {{ .Values.copilot.postgresql.auth.username }}; do
                echo "Waiting for Copilot PostgreSQL to be ready..."
                sleep 2
              done
              echo "Copilot PostgreSQL is ready!"
          envFrom:
            - secretRef:
                name: {{ include "sim.fullname" . }}-copilot-postgresql-secret
          {{- with .Values.copilot.migrations.securityContext }}
          securityContext:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- end }}
      containers:
        - name: migrations
          image: {{ include "sim.image" (dict "context" . "image" .Values.copilot.migrations.image) }}
          imagePullPolicy: {{ .Values.copilot.migrations.image.pullPolicy }}
          command: ["/usr/local/bin/migrate"]
          envFrom:
            - secretRef:
                name: {{ include "sim.copilot.envSecretName" . }}
            - secretRef:
                name: {{ include "sim.copilot.databaseSecretName" . }}
            {{- with .Values.copilot.server.extraEnvFrom }}
            {{- toYaml . | nindent 12 }}
            {{- end }}
          {{- with .Values.copilot.server.extraEnv }}
          env:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .Values.copilot.migrations.resources }}
          resources:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with .Values.copilot.migrations.securityContext }}
          securityContext:
            {{- toYaml . | nindent 12 }}
          {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: networkpolicy.yaml]---
Location: sim-main/helm/sim/templates/networkpolicy.yaml

```yaml
{{- if .Values.networkPolicy.enabled }}
---
# Network Policy for main application
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "sim.fullname" . }}-app
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.app.labels" . | nindent 4 }}
spec:
  podSelector:
    matchLabels:
      {{- include "sim.app.selectorLabels" . | nindent 6 }}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow ingress from realtime service
  {{- if .Values.realtime.enabled }}
  - from:
    - podSelector:
        matchLabels:
          {{- include "sim.realtime.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.app.service.targetPort }}
  {{- end }}
  # Allow ingress from ingress controller
  {{- if .Values.ingress.enabled }}
  - from: []
    ports:
    - protocol: TCP
      port: {{ .Values.app.service.targetPort }}
  {{- end }}
  # Allow custom ingress rules
  {{- with .Values.networkPolicy.ingress }}
  {{- toYaml . | nindent 2 }}
  {{- end }}
  egress:
  # Allow egress to PostgreSQL
  {{- if .Values.postgresql.enabled }}
  - to:
    - podSelector:
        matchLabels:
          {{- include "sim.postgresql.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.postgresql.service.targetPort }}
  {{- end }}
  # Allow egress to realtime service
  {{- if .Values.realtime.enabled }}
  - to:
    - podSelector:
        matchLabels:
          {{- include "sim.realtime.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.realtime.service.targetPort }}
  {{- end }}
  # Allow egress to Ollama
  {{- if .Values.ollama.enabled }}
  - to:
    - podSelector:
        matchLabels:
          {{- include "sim.ollama.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.ollama.service.targetPort }}
  {{- end }}
  # Allow DNS resolution
  - to: []
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
  # Allow HTTPS egress for external APIs
  - to: []
    ports:
    - protocol: TCP
      port: 443
  # Allow custom egress rules
  {{- with .Values.networkPolicy.egress }}
  {{- toYaml . | nindent 2 }}
  {{- end }}

{{- if .Values.realtime.enabled }}
---
# Network Policy for realtime service
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "sim.fullname" . }}-realtime
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.realtime.labels" . | nindent 4 }}
spec:
  podSelector:
    matchLabels:
      {{- include "sim.realtime.selectorLabels" . | nindent 6 }}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow ingress from main application
  - from:
    - podSelector:
        matchLabels:
          {{- include "sim.app.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.realtime.service.targetPort }}
  # Allow ingress from ingress controller
  {{- if .Values.ingress.enabled }}
  - from: []
    ports:
    - protocol: TCP
      port: {{ .Values.realtime.service.targetPort }}
  {{- end }}
  egress:
  # Allow egress to PostgreSQL
  {{- if .Values.postgresql.enabled }}
  - to:
    - podSelector:
        matchLabels:
          {{- include "sim.postgresql.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.postgresql.service.targetPort }}
  {{- end }}
  # Allow DNS resolution
  - to: []
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
  # Allow HTTPS egress for external APIs
  - to: []
    ports:
    - protocol: TCP
      port: 443
{{- end }}

{{- if .Values.postgresql.enabled }}
---
# Network Policy for PostgreSQL
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "sim.fullname" . }}-postgresql
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
spec:
  podSelector:
    matchLabels:
      {{- include "sim.postgresql.selectorLabels" . | nindent 6 }}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow ingress from main application
  - from:
    - podSelector:
        matchLabels:
          {{- include "sim.app.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.postgresql.service.targetPort }}
  # Allow ingress from realtime service
  {{- if .Values.realtime.enabled }}
  - from:
    - podSelector:
        matchLabels:
          {{- include "sim.realtime.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.postgresql.service.targetPort }}
  {{- end }}
  # Allow ingress from migrations job
  {{- if .Values.migrations.enabled }}
  - from:
    - podSelector:
        matchLabels:
          {{- include "sim.migrations.labels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.postgresql.service.targetPort }}
  {{- end }}
  egress:
  # Allow minimal egress (for health checks, etc.)
  - to: []
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
{{- end }}

{{- if .Values.ollama.enabled }}
---
# Network Policy for Ollama
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "sim.fullname" . }}-ollama
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.ollama.labels" . | nindent 4 }}
spec:
  podSelector:
    matchLabels:
      {{- include "sim.ollama.selectorLabels" . | nindent 6 }}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow ingress from main application
  - from:
    - podSelector:
        matchLabels:
          {{- include "sim.app.selectorLabels" . | nindent 10 }}
    ports:
    - protocol: TCP
      port: {{ .Values.ollama.service.targetPort }}
  egress:
  # Allow DNS resolution
  - to: []
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
  # Allow HTTPS egress for model downloads
  - to: []
    ports:
    - protocol: TCP
      port: 443
{{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: poddisruptionbudget.yaml]---
Location: sim-main/helm/sim/templates/poddisruptionbudget.yaml

```yaml
{{- if and .Values.podDisruptionBudget.enabled .Values.app.enabled }}
{{- with .Values.podDisruptionBudget }}
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "sim.fullname" $ }}-app-pdb
  namespace: {{ $.Release.Namespace }}
  labels:
    {{- include "sim.app.labels" $ | nindent 4 }}
spec:
  {{- if .minAvailable }}
  minAvailable: {{ .minAvailable }}
  {{- else if .maxUnavailable }}
  maxUnavailable: {{ .maxUnavailable }}
  {{- else }}
  maxUnavailable: 1
  {{- end }}
  {{- if .unhealthyPodEvictionPolicy }}
  unhealthyPodEvictionPolicy: {{ .unhealthyPodEvictionPolicy }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "sim.app.selectorLabels" $ | nindent 6 }}
{{- end }}
{{- end }}
{{- if and .Values.podDisruptionBudget.enabled .Values.realtime.enabled }}
{{- with .Values.podDisruptionBudget }}
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "sim.fullname" $ }}-realtime-pdb
  namespace: {{ $.Release.Namespace }}
  labels:
    {{- include "sim.realtime.labels" $ | nindent 4 }}
spec:
  {{- if .minAvailable }}
  minAvailable: {{ .minAvailable }}
  {{- else if .maxUnavailable }}
  maxUnavailable: {{ .maxUnavailable }}
  {{- else }}
  maxUnavailable: 1
  {{- end }}
  {{- if .unhealthyPodEvictionPolicy }}
  unhealthyPodEvictionPolicy: {{ .unhealthyPodEvictionPolicy }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "sim.realtime.selectorLabels" $ | nindent 6 }}
{{- end }}
{{- end }}
{{- if and .Values.copilot.enabled .Values.copilot.server.podDisruptionBudget.enabled }}
{{- with .Values.copilot.server.podDisruptionBudget }}
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "sim.fullname" $ }}-copilot-pdb
  namespace: {{ $.Release.Namespace }}
  labels:
    {{- include "sim.labels" $ | nindent 4 }}
    app.kubernetes.io/component: copilot
spec:
  {{- if .minAvailable }}
  minAvailable: {{ .minAvailable }}
  {{- else if .maxUnavailable }}
  maxUnavailable: {{ .maxUnavailable }}
  {{- else }}
  maxUnavailable: 1
  {{- end }}
  {{- if .unhealthyPodEvictionPolicy }}
  unhealthyPodEvictionPolicy: {{ .unhealthyPodEvictionPolicy }}
  {{- end }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "sim.name" $ }}
      app.kubernetes.io/instance: {{ $.Release.Name }}
      app.kubernetes.io/component: copilot
{{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: secrets-copilot.yaml]---
Location: sim-main/helm/sim/templates/secrets-copilot.yaml

```yaml
{{- if and .Values.copilot.enabled .Values.copilot.server.secret.create }}
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "sim.copilot.envSecretName" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot
  {{- with .Values.copilot.server.secret.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
type: Opaque
stringData:
  {{- range $key, $value := .Values.copilot.server.env }}
  {{ $key }}: {{ $value | quote }}
  {{- end }}
{{- end }}
{{- if and .Values.copilot.enabled (not .Values.copilot.postgresql.enabled) (or (not .Values.copilot.database.existingSecretName) (eq .Values.copilot.database.existingSecretName "")) (ne .Values.copilot.database.url "") }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "sim.copilot.databaseSecretName" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
    app.kubernetes.io/component: copilot
  {{- with .Values.copilot.server.secret.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
type: Opaque
stringData:
  {{ include "sim.copilot.databaseSecretKey" . }}: {{ required "copilot.database.url is required when using an external database" .Values.copilot.database.url | quote }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: serviceaccount.yaml]---
Location: sim-main/helm/sim/templates/serviceaccount.yaml

```yaml
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "sim.serviceAccountName" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: servicemonitor.yaml]---
Location: sim-main/helm/sim/templates/servicemonitor.yaml

```yaml
{{- if .Values.monitoring.serviceMonitor.enabled }}
---
# ServiceMonitor for main application
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {{ include "sim.fullname" . }}-app
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.app.labels" . | nindent 4 }}
    {{- with .Values.monitoring.serviceMonitor.labels }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
  {{- with .Values.monitoring.serviceMonitor.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  selector:
    matchLabels:
      {{- include "sim.app.selectorLabels" . | nindent 6 }}
  endpoints:
  - port: http
    path: {{ .Values.monitoring.serviceMonitor.path }}
    interval: {{ .Values.monitoring.serviceMonitor.interval }}
    scrapeTimeout: {{ .Values.monitoring.serviceMonitor.scrapeTimeout }}
    {{- with .Values.monitoring.serviceMonitor.metricRelabelings }}
    metricRelabelings:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with .Values.monitoring.serviceMonitor.relabelings }}
    relabelings:
      {{- toYaml . | nindent 6 }}
    {{- end }}
  {{- if .Values.monitoring.serviceMonitor.targetLabels }}
  targetLabels:
    {{- toYaml .Values.monitoring.serviceMonitor.targetLabels | nindent 4 }}
  {{- end }}
{{- end }}

{{- if and .Values.monitoring.serviceMonitor.enabled .Values.realtime.enabled }}
---
# ServiceMonitor for realtime service
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {{ include "sim.fullname" . }}-realtime
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.realtime.labels" . | nindent 4 }}
    {{- with .Values.monitoring.serviceMonitor.labels }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
  {{- with .Values.monitoring.serviceMonitor.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  selector:
    matchLabels:
      {{- include "sim.realtime.selectorLabels" . | nindent 6 }}
  endpoints:
  - port: http
    path: {{ .Values.monitoring.serviceMonitor.path }}
    interval: {{ .Values.monitoring.serviceMonitor.interval }}
    scrapeTimeout: {{ .Values.monitoring.serviceMonitor.scrapeTimeout }}
    {{- with .Values.monitoring.serviceMonitor.metricRelabelings }}
    metricRelabelings:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with .Values.monitoring.serviceMonitor.relabelings }}
    relabelings:
      {{- toYaml . | nindent 6 }}
    {{- end }}
  {{- if .Values.monitoring.serviceMonitor.targetLabels }}
  targetLabels:
    {{- toYaml .Values.monitoring.serviceMonitor.targetLabels | nindent 4 }}
  {{- end }}
{{- end }}
```

--------------------------------------------------------------------------------

---[FILE: services.yaml]---
Location: sim-main/helm/sim/templates/services.yaml

```yaml
{{- if .Values.app.enabled }}
---
# Service for main application
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-app
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.app.labels" . | nindent 4 }}
spec:
  type: {{ .Values.app.service.type }}
  ports:
    - port: {{ .Values.app.service.port }}
      targetPort: {{ .Values.app.service.targetPort }}
      protocol: TCP
      name: http
  selector:
    {{- include "sim.app.selectorLabels" . | nindent 4 }}
{{- end }}

{{- if .Values.realtime.enabled }}
---
# Service for realtime server
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-realtime
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.realtime.labels" . | nindent 4 }}
spec:
  type: {{ .Values.realtime.service.type }}
  ports:
    - port: {{ .Values.realtime.service.port }}
      targetPort: {{ .Values.realtime.service.targetPort }}
      protocol: TCP
      name: http
  selector:
    {{- include "sim.realtime.selectorLabels" . | nindent 4 }}
{{- end }}

{{- if .Values.postgresql.enabled }}
---
# Service for PostgreSQL
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-postgresql
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.postgresql.labels" . | nindent 4 }}
spec:
  type: {{ .Values.postgresql.service.type }}
  ports:
    - port: {{ .Values.postgresql.service.port }}
      targetPort: {{ .Values.postgresql.service.targetPort }}
      protocol: TCP
      name: postgresql
  selector:
    {{- include "sim.postgresql.selectorLabels" . | nindent 4 }}
{{- end }}

{{- if .Values.ollama.enabled }}
---
# Service for Ollama
apiVersion: v1
kind: Service
metadata:
  name: {{ include "sim.fullname" . }}-ollama
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "sim.ollama.labels" . | nindent 4 }}
spec:
  type: {{ .Values.ollama.service.type }}
  ports:
    - port: {{ .Values.ollama.service.port }}
      targetPort: {{ .Values.ollama.service.targetPort }}
      protocol: TCP
      name: http
  selector:
    {{- include "sim.ollama.selectorLabels" . | nindent 4 }}
{{- end }}
```

--------------------------------------------------------------------------------

````
