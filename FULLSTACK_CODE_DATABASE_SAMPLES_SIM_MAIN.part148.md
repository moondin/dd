---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 148
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 148 of 933)

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

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/fr/execution/api.mdx

```text
---
title: API externe
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Sim fournit une API externe complète pour interroger les journaux d'exécution des workflows et configurer des webhooks pour des notifications en temps réel lorsque les workflows sont terminés.

## Authentification

Toutes les requêtes API nécessitent une clé API transmise dans l'en-tête `x-api-key` :

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://sim.ai/api/v1/logs?workspaceId=YOUR_WORKSPACE_ID
```

Vous pouvez générer des clés API depuis vos paramètres utilisateur dans le tableau de bord Sim.

## API des journaux

Toutes les réponses API incluent des informations sur vos limites d'exécution de workflow et votre utilisation :

```json
"limits": {
  "workflowExecutionRateLimit": {
    "sync": {
      "requestsPerMinute": 60,  // Sustained rate limit per minute
      "maxBurst": 120,          // Maximum burst capacity
      "remaining": 118,         // Current tokens available (up to maxBurst)
      "resetAt": "..."          // When tokens next refill
    },
    "async": {
      "requestsPerMinute": 200, // Sustained rate limit per minute
      "maxBurst": 400,          // Maximum burst capacity
      "remaining": 398,         // Current tokens available
      "resetAt": "..."          // When tokens next refill
    }
  },
  "usage": {
    "currentPeriodCost": 1.234,  // Current billing period usage in USD
    "limit": 10,                  // Usage limit in USD
    "plan": "pro",                // Current subscription plan
    "isExceeded": false           // Whether limit is exceeded
  }
}
```

**Remarque :** les limites de débit utilisent un algorithme de seau à jetons. `remaining` peut dépasser `requestsPerMinute` jusqu'à `maxBurst` lorsque vous n'avez pas utilisé récemment votre allocation complète, permettant ainsi un trafic en rafale. Les limites de débit dans le corps de la réponse concernent les exécutions de workflow. Les limites de débit pour appeler ce point de terminaison API se trouvent dans les en-têtes de réponse (`X-RateLimit-*`).

### Interrogation des journaux

Interrogez les journaux d'exécution des workflows avec de nombreuses options de filtrage.

<Tabs items={['Requête', 'Réponse']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs
    ```

    **Paramètres requis :**
    - `workspaceId` - Votre ID d'espace de travail

    **Filtres optionnels :**
    - `workflowIds` - IDs de workflow séparés par des virgules
    - `folderIds` - IDs de dossier séparés par des virgules
    - `triggers` - Types de déclencheurs séparés par des virgules : `api`, `webhook`, `schedule`, `manual`, `chat`
    - `level` - Filtrer par niveau : `info`, `error`
    - `startDate` - Horodatage ISO pour le début de la plage de dates
    - `endDate` - Horodatage ISO pour la fin de la plage de dates
    - `executionId` - Correspondance exacte de l'ID d'exécution
    - `minDurationMs` - Durée minimale d'exécution en millisecondes
    - `maxDurationMs` - Durée maximale d'exécution en millisecondes
    - `minCost` - Coût minimal d'exécution
    - `maxCost` - Coût maximal d'exécution
    - `model` - Filtrer par modèle d'IA utilisé

    **Pagination :**
    - `limit` - Résultats par page (par défaut : 100)
    - `cursor` - Curseur pour la page suivante
    - `order` - Ordre de tri : `desc`, `asc` (par défaut : desc)

    **Niveau de détail :**
    - `details` - Niveau de détail de la réponse : `basic`, `full` (par défaut : basic)
    - `includeTraceSpans` - Inclure les intervalles de trace (par défaut : false)
    - `includeFinalOutput` - Inclure la sortie finale (par défaut : false)
  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": [
        {
          "id": "log_abc123",
          "workflowId": "wf_xyz789",
          "executionId": "exec_def456",
          "level": "info",
          "trigger": "api",
          "startedAt": "2025-01-01T12:34:56.789Z",
          "endedAt": "2025-01-01T12:34:57.123Z",
          "totalDurationMs": 334,
          "cost": {
            "total": 0.00234
          },
          "files": null
        }
      ],
      "nextCursor": "eyJzIjoiMjAyNS0wMS0wMVQxMjozNDo1Ni43ODlaIiwiaWQiOiJsb2dfYWJjMTIzIn0",
      "limits": {
        "workflowExecutionRateLimit": {
          "sync": {
            "requestsPerMinute": 60,
            "maxBurst": 120,
            "remaining": 118,
            "resetAt": "2025-01-01T12:35:56.789Z"
          },
          "async": {
            "requestsPerMinute": 200,
            "maxBurst": 400,
            "remaining": 398,
            "resetAt": "2025-01-01T12:35:56.789Z"
          }
        },
        "usage": {
          "currentPeriodCost": 1.234,
          "limit": 10,
          "plan": "pro",
          "isExceeded": false
        }
      }
    }
    ```

  </Tab>
</Tabs>

### Obtenir les détails du journal

Récupérer des informations détaillées sur une entrée de journal spécifique.

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/{id}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": {
        "id": "log_abc123",
        "workflowId": "wf_xyz789",
        "executionId": "exec_def456",
        "level": "info",
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "workflow": {
          "id": "wf_xyz789",
          "name": "My Workflow",
          "description": "Process customer data"
        },
        "executionData": {
          "traceSpans": [...],
          "finalOutput": {...}
        },
        "cost": {
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          },
          "models": {
            "gpt-4o": {
              "input": 0.001,
              "output": 0.00134,
              "total": 0.00234,
              "tokens": {
                "prompt": 123,
                "completion": 456,
                "total": 579
              }
            }
          }
        },
        "limits": {
          "workflowExecutionRateLimit": {
            "sync": {
              "requestsPerMinute": 60,
              "maxBurst": 120,
              "remaining": 118,
              "resetAt": "2025-01-01T12:35:56.789Z"
            },
            "async": {
              "requestsPerMinute": 200,
              "maxBurst": 400,
              "remaining": 398,
              "resetAt": "2025-01-01T12:35:56.789Z"
            }
          },
          "usage": {
            "currentPeriodCost": 1.234,
            "limit": 10,
            "plan": "pro",
            "isExceeded": false
          }
        }
      }
    }
    ```

  </Tab>
</Tabs>

### Obtenir les détails d'exécution

Récupérer les détails d'exécution, y compris l'instantané de l'état du workflow.

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/executions/{executionId}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "executionId": "exec_def456",
      "workflowId": "wf_xyz789",
      "workflowState": {
        "blocks": {...},
        "edges": [...],
        "loops": {...},
        "parallels": {...}
      },
      "executionMetadata": {
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "cost": {...}
      }
    }
    ```

  </Tab>
</Tabs>

## Notifications

Recevez des notifications en temps réel lorsque les exécutions de flux de travail sont terminées via webhook, e-mail ou Slack. Les notifications sont configurées au niveau de l'espace de travail depuis la page Logs.

### Configuration

Configurez les notifications depuis la page Logs en cliquant sur le bouton menu et en sélectionnant "Configurer les notifications".

**Canaux de notification :**
- **Webhook** : envoi de requêtes HTTP POST à votre point de terminaison
- **E-mail** : réception de notifications par e-mail avec les détails d'exécution
- **Slack** : publication de messages dans un canal Slack

**Sélection de flux de travail :**
- Sélectionnez des flux de travail spécifiques à surveiller
- Ou choisissez "Tous les flux de travail" pour inclure les flux actuels et futurs

**Options de filtrage :**
- `levelFilter` : niveaux de journalisation à recevoir (`info`, `error`)
- `triggerFilter` : types de déclencheurs à recevoir (`api`, `webhook`, `schedule`, `manual`, `chat`)

**Données optionnelles :**
- `includeFinalOutput` : inclure le résultat final du flux de travail
- `includeTraceSpans` : inclure les traces détaillées d'exécution
- `includeRateLimits` : inclure les informations de limite de débit (limites synchrones/asynchrones et restantes)
- `includeUsageData` : inclure l'utilisation et les limites de la période de facturation

### Règles d'alerte

Au lieu de recevoir des notifications pour chaque exécution, configurez des règles d'alerte pour être notifié uniquement lorsque des problèmes sont détectés :

**Échecs consécutifs**
- Alerte après X exécutions échouées consécutives (par exemple, 3 échecs d'affilée)
- Réinitialisation lorsqu'une exécution réussit

**Taux d'échec**
- Alerte lorsque le taux d'échec dépasse X % au cours des Y dernières heures
- Nécessite un minimum de 5 exécutions dans la fenêtre
- Ne se déclenche qu'après l'écoulement complet de la fenêtre temporelle

**Seuil de latence**
- Alerte lorsqu'une exécution prend plus de X secondes
- Utile pour détecter les flux de travail lents ou bloqués

**Pic de latence**
- Alerte lorsque l'exécution est X % plus lente que la moyenne
- Compare à la durée moyenne sur la fenêtre temporelle configurée
- Nécessite un minimum de 5 exécutions pour établir une référence

**Seuil de coût**
- Alerte lorsqu'une seule exécution coûte plus de X €
- Utile pour détecter les appels LLM coûteux

**Aucune activité**
- Alerte lorsqu'aucune exécution ne se produit pendant X heures
- Utile pour surveiller les workflows programmés qui devraient s'exécuter régulièrement

**Nombre d'erreurs**
- Alerte lorsque le nombre d'erreurs dépasse X dans une fenêtre temporelle
- Suit le total des erreurs, pas les erreurs consécutives

Tous les types d'alertes incluent un temps de récupération d'une heure pour éviter le spam de notifications.

### Configuration du webhook

Pour les webhooks, des options supplémentaires sont disponibles :
- `url` : l'URL de votre point de terminaison webhook
- `secret` : secret optionnel pour la vérification de signature HMAC

### Structure de la charge utile

Lorsqu'une exécution de workflow se termine, Sim envoie la charge utile suivante (via webhook POST, e-mail ou Slack) :

```json
{
  "id": "evt_123",
  "type": "workflow.execution.completed",
  "timestamp": 1735925767890,
  "data": {
    "workflowId": "wf_xyz789",
    "executionId": "exec_def456",
    "status": "success",
    "level": "info",
    "trigger": "api",
    "startedAt": "2025-01-01T12:34:56.789Z",
    "endedAt": "2025-01-01T12:34:57.123Z",
    "totalDurationMs": 334,
    "cost": {
      "total": 0.00234,
      "tokens": {
        "prompt": 123,
        "completion": 456,
        "total": 579
      },
      "models": {
        "gpt-4o": {
          "input": 0.001,
          "output": 0.00134,
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          }
        }
      }
    },
    "files": null,
    "finalOutput": {...},  // Only if includeFinalOutput=true
    "traceSpans": [...],   // Only if includeTraceSpans=true
    "rateLimits": {...},   // Only if includeRateLimits=true
    "usage": {...}         // Only if includeUsageData=true
  },
  "links": {
    "log": "/v1/logs/log_abc123",
    "execution": "/v1/logs/executions/exec_def456"
  }
}
```

### En-têtes webhook

Chaque requête webhook inclut ces en-têtes (canal webhook uniquement) :

- `sim-event` : type d'événement (toujours `workflow.execution.completed`)
- `sim-timestamp` : horodatage Unix en millisecondes
- `sim-delivery-id` : ID de livraison unique pour l'idempotence
- `sim-signature` : signature HMAC-SHA256 pour vérification (si un secret est configuré)
- `Idempotency-Key` : identique à l'ID de livraison pour la détection des doublons

### Vérification de signature

Si vous configurez un secret webhook, vérifiez la signature pour vous assurer que le webhook provient de Sim :

<Tabs items={['Node.js', 'Python']}>
  <Tab value="Node.js">

    ```javascript
    import crypto from 'crypto';

    function verifyWebhookSignature(body, signature, secret) {
      const [timestampPart, signaturePart] = signature.split(',');
      const timestamp = timestampPart.replace('t=', '');
      const expectedSignature = signaturePart.replace('v1=', '');
      
      const signatureBase = `${timestamp}.${body}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(signatureBase);
      const computedSignature = hmac.digest('hex');
      
      return computedSignature === expectedSignature;
    }

    // In your webhook handler
    app.post('/webhook', (req, res) => {
      const signature = req.headers['sim-signature'];
      const body = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
        return res.status(401).send('Invalid signature');
      }
      
      // Process the webhook...
    });
    ```

  </Tab>
  <Tab value="Python">

    ```python
    import hmac
    import hashlib
    import json

    def verify_webhook_signature(body: str, signature: str, secret: str) -> bool:
        timestamp_part, signature_part = signature.split(',')
        timestamp = timestamp_part.replace('t=', '')
        expected_signature = signature_part.replace('v1=', '')
        
        signature_base = f"{timestamp}.{body}"
        computed_signature = hmac.new(
            secret.encode(),
            signature_base.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(computed_signature, expected_signature)

    # In your webhook handler
    @app.route('/webhook', methods=['POST'])
    def webhook():
        signature = request.headers.get('sim-signature')
        body = json.dumps(request.json)
        
        if not verify_webhook_signature(body, signature, os.environ['WEBHOOK_SECRET']):
            return 'Invalid signature', 401
        
        # Process the webhook...
    ```

  </Tab>
</Tabs>

### Politique de nouvelle tentative

Les livraisons de webhook échouées sont réessayées avec un backoff exponentiel et du jitter :

- Nombre maximum de tentatives : 5
- Délais de nouvelle tentative : 5 secondes, 15 secondes, 1 minute, 3 minutes, 10 minutes
- Jitter : jusqu'à 10 % de délai supplémentaire pour éviter l'effet de horde
- Seules les réponses HTTP 5xx et 429 déclenchent de nouvelles tentatives
- Les livraisons expirent après 30 secondes

<Callout type="info">
  Les livraisons de webhook sont traitées de manière asynchrone et n'affectent pas les performances d'exécution du workflow.
</Callout>

## Bonnes pratiques

1. **Stratégie de polling** : Lors du polling des logs, utilisez la pagination basée sur curseur avec `order=asc` et `startDate` pour récupérer efficacement les nouveaux logs.

2. **Sécurité des webhooks** : Configurez toujours un secret de webhook et vérifiez les signatures pour vous assurer que les requêtes proviennent de Sim.

3. **Idempotence** : Utilisez l'en-tête `Idempotency-Key` pour détecter et gérer les livraisons de webhook en double.

4. **Confidentialité** : Par défaut, `finalOutput` et `traceSpans` sont exclus des réponses. Activez-les uniquement si vous avez besoin des données et comprenez les implications en matière de confidentialité.

5. **Limitation de débit** : Implémentez un backoff exponentiel lorsque vous recevez des réponses 429. Vérifiez l'en-tête `Retry-After` pour connaître le temps d'attente recommandé.

## Limitation de débit

L'API utilise un **algorithme de seau à jetons** pour limiter le débit, offrant une utilisation équitable tout en permettant des pics de trafic :

| Forfait | Requêtes/minute | Capacité de rafale |
|------|-----------------|----------------|
| Gratuit | 10 | 20 |
| Pro | 30 | 60 |
| Équipe | 60 | 120 |
| Entreprise | 120 | 240 |

**Comment ça fonctionne :**
- Les jetons se rechargent au rythme de `requestsPerMinute`
- Vous pouvez accumuler jusqu'à `maxBurst` jetons en période d'inactivité
- Chaque requête consomme 1 jeton
- La capacité de rafale permet de gérer les pics de trafic

Les informations sur les limites de débit sont incluses dans les en-têtes de réponse :
- `X-RateLimit-Limit` : requêtes par minute (taux de recharge)
- `X-RateLimit-Remaining` : jetons actuellement disponibles
- `X-RateLimit-Reset` : horodatage ISO indiquant quand les jetons seront rechargés

## Exemple : interrogation pour de nouveaux journaux

```javascript
let cursor = null;
const workspaceId = 'YOUR_WORKSPACE_ID';
const startDate = new Date().toISOString();

async function pollLogs() {
  const params = new URLSearchParams({
    workspaceId,
    startDate,
    order: 'asc',
    limit: '100'
  });
  
  if (cursor) {
    params.append('cursor', cursor);
  }
  
  const response = await fetch(
    `https://sim.ai/api/v1/logs?${params}`,
    {
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    
    // Process new logs
    for (const log of data.data) {
      console.log(`New execution: ${log.executionId}`);
    }
    
    // Update cursor for next poll
    if (data.nextCursor) {
      cursor = data.nextCursor;
    }
  }
}

// Poll every 30 seconds
setInterval(pollLogs, 30000);
```

## Exemple : traitement des webhooks

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

app.post('/sim-webhook', (req, res) => {
  // Verify signature
  const signature = req.headers['sim-signature'];
  const body = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Check timestamp to prevent replay attacks
  const timestamp = parseInt(req.headers['sim-timestamp']);
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  
  if (timestamp < fiveMinutesAgo) {
    return res.status(401).send('Timestamp too old');
  }
  
  // Process the webhook
  const event = req.body;
  
  switch (event.type) {
    case 'workflow.execution.completed':
      const { workflowId, executionId, status, cost } = event.data;
      
      if (status === 'error') {
        console.error(`Workflow ${workflowId} failed: ${executionId}`);
        // Handle error...
      } else {
        console.log(`Workflow ${workflowId} completed: ${executionId}`);
        console.log(`Cost: $${cost.total}`);
        // Process successful execution...
      }
      break;
  }
  
  // Return 200 to acknowledge receipt
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/fr/execution/basics.mdx

```text
---
title: Principes de base
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Comprendre comment les workflows s'exécutent dans Sim est essentiel pour créer des automatisations efficaces et fiables. Le moteur d'exécution gère automatiquement les dépendances, la concurrence et le flux de données pour garantir que vos workflows fonctionnent de manière fluide et prévisible.

## Comment les workflows s'exécutent

Le moteur d'exécution de Sim traite les workflows de manière intelligente en analysant les dépendances et en exécutant les blocs dans l'ordre le plus efficace possible.

### Exécution concurrente par défaut

Plusieurs blocs s'exécutent simultanément lorsqu'ils ne dépendent pas les uns des autres. Cette exécution parallèle améliore considérablement les performances sans nécessiter de configuration manuelle.

<Image
  src="/static/execution/concurrency.png"
  alt="Plusieurs blocs s'exécutant simultanément après le bloc de démarrage"
  width={800}
  height={500}
/>

Dans cet exemple, les blocs d'agent de support client et de chercheur approfondi s'exécutent simultanément après le bloc de démarrage, maximisant ainsi l'efficacité.

### Combinaison automatique des sorties

Lorsque des blocs ont plusieurs dépendances, le moteur d'exécution attend automatiquement que toutes les dépendances soient terminées, puis fournit leurs sorties combinées au bloc suivant. Aucune combinaison manuelle n'est requise.

<Image
  src="/static/execution/combination.png"
  alt="Bloc de fonction recevant automatiquement les sorties de plusieurs blocs précédents"
  width={800}
  height={500}
/>

Le bloc de fonction reçoit les sorties des deux blocs d'agent dès qu'ils sont terminés, vous permettant de traiter les résultats combinés.

### Routage intelligent

Les workflows peuvent se ramifier dans plusieurs directions en utilisant des blocs de routage. Le moteur d'exécution prend en charge à la fois le routage déterministe (avec des blocs de condition) et le routage basé sur l'IA (avec des blocs de routeur).

<Image
  src="/static/execution/routing.png"
  alt="Workflow montrant à la fois des ramifications conditionnelles et basées sur un routeur"
  width={800}
  height={500}
/>

Ce flux de travail démontre comment l'exécution peut suivre différents chemins basés sur des conditions ou des décisions d'IA, chaque chemin s'exécutant indépendamment.

## Types de blocs

Sim fournit différents types de blocs qui servent à des fins spécifiques dans vos flux de travail :

<Cards>
  <Card title="Déclencheurs" href="/triggers">
    Les **blocs de démarrage** initient les flux de travail et les **blocs Webhook** répondent aux événements externes. Chaque flux de travail nécessite un déclencheur pour commencer l'exécution.
  </Card>
  
  <Card title="Blocs de traitement" href="/blocks">
    Les **blocs Agent** interagissent avec les modèles d'IA, les **blocs Fonction** exécutent du code personnalisé, et les **blocs API** se connectent à des services externes. Ces blocs transforment et traitent vos données.
  </Card>
  
  <Card title="Flux de contrôle" href="/blocks">
    Les **blocs Routeur** utilisent l'IA pour choisir des chemins, les **blocs Condition** créent des branches basées sur la logique, et les **blocs Boucle/Parallèle** gèrent les itérations et la concurrence.
  </Card>
  
  <Card title="Sortie et réponse" href="/blocks">
    Les **blocs Réponse** formatent les sorties finales pour les API et les interfaces de chat, renvoyant des résultats structurés de vos flux de travail.
  </Card>
</Cards>

Tous les blocs s'exécutent automatiquement en fonction de leurs dépendances - vous n'avez pas besoin de gérer manuellement l'ordre ou le timing d'exécution.

## Surveillance d'exécution

Lorsque les workflows s'exécutent, Sim offre une visibilité en temps réel sur le processus d'exécution :

- **États des blocs en direct** : Visualisez quels blocs sont en cours d'exécution, terminés ou en échec
- **Journaux d'exécution** : Des journaux détaillés apparaissent en temps réel montrant les entrées, les sorties et les erreurs éventuelles
- **Métriques de performance** : Suivez le temps d'exécution et les coûts pour chaque bloc
- **Visualisation du chemin** : Comprenez quels chemins d'exécution ont été empruntés dans votre workflow

<Callout type="info">
  Tous les détails d'exécution sont capturés et disponibles pour examen même après la fin des workflows, facilitant le débogage et l'optimisation.
</Callout>

## Principes clés d'exécution

Comprendre ces principes fondamentaux vous aidera à créer de meilleurs workflows :

1. **Exécution basée sur les dépendances** : Les blocs ne s'exécutent que lorsque toutes leurs dépendances sont terminées
2. **Parallélisation automatique** : Les blocs indépendants s'exécutent simultanément sans configuration
3. **Flux de données intelligent** : Les sorties circulent automatiquement vers les blocs connectés
4. **Gestion des erreurs** : Les blocs en échec arrêtent leur chemin d'exécution mais n'affectent pas les chemins indépendants
5. **Persistance d'état** : Toutes les sorties de blocs et les détails d'exécution sont conservés pour le débogage

## Prochaines étapes

Maintenant que vous comprenez les bases de l'exécution, explorez :
- **[Types de blocs](/blocks)** - Découvrez les capacités spécifiques des blocs
- **[Journalisation](/execution/logging)** - Surveillez les exécutions de workflow et déboguez les problèmes
- **[Calcul des coûts](/execution/costs)** - Comprenez et optimisez les coûts des workflows
- **[Déclencheurs](/triggers)** - Configurez différentes façons d'exécuter vos workflows
```

--------------------------------------------------------------------------------

---[FILE: costs.mdx]---
Location: sim-main/apps/docs/content/docs/fr/execution/costs.mdx

```text
---
title: Calcul des coûts
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim calcule automatiquement les coûts pour toutes les exécutions de flux de travail, offrant une tarification transparente basée sur l'utilisation des modèles d'IA et les frais d'exécution. Comprendre ces coûts vous aide à optimiser les flux de travail et à gérer efficacement votre budget.

## Comment les coûts sont calculés

Chaque exécution de flux de travail comprend deux composantes de coût :

**Frais d'exécution de base** : 0,001 $ par exécution

**Utilisation du modèle d'IA** : coût variable basé sur la consommation de tokens

```javascript
modelCost = (inputTokens × inputPrice + outputTokens × outputPrice) / 1,000,000
totalCost = baseExecutionCharge + modelCost
```

<Callout type="info">
  Les prix des modèles d'IA sont par million de tokens. Le calcul divise par 1 000 000 pour obtenir le coût réel. Les flux de travail sans blocs d'IA n'engendrent que les frais d'exécution de base.
</Callout>

## Répartition des modèles dans les journaux

Pour les flux de travail utilisant des blocs d'IA, vous pouvez consulter des informations détaillées sur les coûts dans les journaux :

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-cost.png"
    alt="Répartition des modèles"
    width={600}
    height={400}
    className="my-6"
  />
</div>

La répartition des modèles montre :
- **Utilisation des tokens** : nombre de tokens d'entrée et de sortie pour chaque modèle
- **Ventilation des coûts** : coûts individuels par modèle et opération
- **Distribution des modèles** : quels modèles ont été utilisés et combien de fois
- **Coût total** : coût global pour l'ensemble de l'exécution du flux de travail

## Options de tarification

<Tabs items={['Hosted Models', 'Bring Your Own API Key']}>
  <Tab>
    **Modèles hébergés** - Sim fournit des clés API avec un multiplicateur de prix de 2,5x :

    **OpenAI**
    | Modèle | Prix de base (Entrée/Sortie) | Prix hébergé (Entrée/Sortie) |
    |-------|---------------------------|----------------------------|
    | GPT-5.1 | 1,25 $ / 10,00 $ | 3,13 $ / 25,00 $ |
    | GPT-5 | 1,25 $ / 10,00 $ | 3,13 $ / 25,00 $ |
    | GPT-5 Mini | 0,25 $ / 2,00 $ | 0,63 $ / 5,00 $ |
    | GPT-5 Nano | 0,05 $ / 0,40 $ | 0,13 $ / 1,00 $ |
    | GPT-4o | 2,50 $ / 10,00 $ | 6,25 $ / 25,00 $ |
    | GPT-4.1 | 2,00 $ / 8,00 $ | 5,00 $ / 20,00 $ |
    | GPT-4.1 Mini | 0,40 $ / 1,60 $ | 1,00 $ / 4,00 $ |
    | GPT-4.1 Nano | 0,10 $ / 0,40 $ | 0,25 $ / 1,00 $ |
    | o1 | 15,00 $ / 60,00 $ | 37,50 $ / 150,00 $ |
    | o3 | 2,00 $ / 8,00 $ | 5,00 $ / 20,00 $ |
    | o4 Mini | 1,10 $ / 4,40 $ | 2,75 $ / 11,00 $ |

    **Anthropic**
    | Modèle | Prix de base (Entrée/Sortie) | Prix hébergé (Entrée/Sortie) |
    |-------|---------------------------|----------------------------|
    | Claude Opus 4.5 | 5,00 $ / 25,00 $ | 12,50 $ / 62,50 $ |
    | Claude Opus 4.1 | 15,00 $ / 75,00 $ | 37,50 $ / 187,50 $ |
    | Claude Sonnet 4.5 | 3,00 $ / 15,00 $ | 7,50 $ / 37,50 $ |
    | Claude Sonnet 4.0 | 3,00 $ / 15,00 $ | 7,50 $ / 37,50 $ |
    | Claude Haiku 4.5 | 1,00 $ / 5,00 $ | 2,50 $ / 12,50 $ |

    **Google**
    | Modèle | Prix de base (Entrée/Sortie) | Prix hébergé (Entrée/Sortie) |
    |-------|---------------------------|----------------------------|
    | Gemini 3 Pro Preview | 2,00 $ / 12,00 $ | 5,00 $ / 30,00 $ |
    | Gemini 2.5 Pro | 0,15 $ / 0,60 $ | 0,38 $ / 1,50 $ |
    | Gemini 2.5 Flash | 0,15 $ / 0,60 $ | 0,38 $ / 1,50 $ |

    *Le multiplicateur de 2,5x couvre les coûts d'infrastructure et de gestion des API.*
  </Tab>

  <Tab>
    **Vos propres clés API** - Utilisez n'importe quel modèle au prix de base :

    | Fournisseur | Exemples de modèles | Entrée / Sortie |
    |----------|----------------|----------------|
    | Deepseek | V3, R1 | 0,75 $ / 1,00 $ |
    | xAI | Grok 4 Latest, Grok 3 | 3,00 $ / 15,00 $ |
    | Groq | Llama 4 Scout, Llama 3.3 70B | 0,11 $ / 0,34 $ |
    | Cerebras | Llama 4 Scout, Llama 3.3 70B | 0,11 $ / 0,34 $ |
    | Ollama | Modèles locaux | Gratuit |
    | VLLM | Modèles locaux | Gratuit |

    *Payez directement les fournisseurs sans majoration*
  </Tab>
</Tabs>

<Callout type="warning">
  Les prix indiqués reflètent les tarifs en date du 10 septembre 2025. Consultez la documentation des fournisseurs pour les tarifs actuels.
</Callout>

## Stratégies d'optimisation des coûts

- **Sélection du modèle** : choisissez les modèles en fonction de la complexité de la tâche. Les tâches simples peuvent utiliser GPT-4.1-nano tandis que le raisonnement complexe pourrait nécessiter o1 ou Claude Opus.
- **Ingénierie de prompt** : des prompts bien structurés et concis réduisent l'utilisation de tokens sans sacrifier la qualité.
- **Modèles locaux** : utilisez Ollama ou VLLM pour les tâches non critiques afin d'éliminer complètement les coûts d'API.
- **Mise en cache et réutilisation** : stockez les résultats fréquemment utilisés dans des variables ou des fichiers pour éviter des appels répétés aux modèles d'IA.
- **Traitement par lots** : traitez plusieurs éléments dans une seule requête d'IA plutôt que de faire des appels individuels.

## Suivi de l'utilisation

Surveillez votre utilisation et votre facturation dans Paramètres → Abonnement :

- **Utilisation actuelle** : utilisation et coûts en temps réel pour la période en cours
- **Limites d'utilisation** : limites du forfait avec indicateurs visuels de progression
- **Détails de facturation** : frais prévisionnels et engagements minimums
- **Gestion du forfait** : options de mise à niveau et historique de facturation

### Suivi d'utilisation programmatique

Vous pouvez interroger votre utilisation actuelle et vos limites par programmation en utilisant l'API :

**Point de terminaison :**

```text
GET /api/users/me/usage-limits
```

**Authentification :**
- Incluez votre clé API dans l'en-tête `X-API-Key`

**Exemple de requête :**

```bash
curl -X GET -H "X-API-Key: YOUR_API_KEY" -H "Content-Type: application/json" https://sim.ai/api/users/me/usage-limits
```

**Exemple de réponse :**

```json
{
  "success": true,
  "rateLimit": {
    "sync": {
      "isLimited": false,
      "requestsPerMinute": 25,
      "maxBurst": 50,
      "remaining": 50,
      "resetAt": "2025-09-08T22:51:55.999Z"
    },
    "async": {
      "isLimited": false,
      "requestsPerMinute": 200,
      "maxBurst": 400,
      "remaining": 400,
      "resetAt": "2025-09-08T22:51:56.155Z"
    },
    "authType": "api"
  },
  "usage": {
    "currentPeriodCost": 12.34,
    "limit": 100,
    "plan": "pro"
  }
}
```

**Champs de limite de débit :**
- `requestsPerMinute` : limite de débit soutenu (les jetons se rechargent à ce rythme)
- `maxBurst` : nombre maximum de jetons que vous pouvez accumuler (capacité de rafale)
- `remaining` : jetons actuellement disponibles (peut aller jusqu'à `maxBurst`)

**Champs de réponse :**
- `currentPeriodCost` reflète l'utilisation dans la période de facturation actuelle
- `limit` est dérivé des limites individuelles (Gratuit/Pro) ou des limites mutualisées de l'organisation (Équipe/Entreprise)
- `plan` est le plan actif de plus haute priorité associé à votre utilisateur

## Limites des forfaits

Les différents forfaits d'abonnement ont des limites d'utilisation différentes :

| Forfait | Limite d'utilisation mensuelle | Limites de débit (par minute) |
|------|-------------------|-------------------------|
| **Gratuit** | 10 $ | 5 sync, 10 async |
| **Pro** | 100 $ | 10 sync, 50 async |
| **Équipe** | 500 $ (mutualisé) | 50 sync, 100 async |
| **Entreprise** | Personnalisé | Personnalisé |

## Modèle de facturation

Sim utilise un modèle de facturation **abonnement de base + dépassement** :

### Comment ça fonctionne

**Forfait Pro (20 $/mois) :**
- L'abonnement mensuel inclut 20 $ d'utilisation
- Utilisation inférieure à 20 $ → Pas de frais supplémentaires
- Utilisation supérieure à 20 $ → Paiement du dépassement en fin de mois
- Exemple : 35 $ d'utilisation = 20 $ (abonnement) + 15 $ (dépassement)

**Forfait Équipe (40 $/siège/mois) :**
- Utilisation mutualisée pour tous les membres de l'équipe
- Dépassement calculé à partir de l'utilisation totale de l'équipe
- Le propriétaire de l'organisation reçoit une seule facture

**Forfaits Entreprise :**
- Prix mensuel fixe, pas de dépassements
- Limites d'utilisation personnalisées selon l'accord

### Facturation par seuil

Lorsque le dépassement non facturé atteint 50 $, Sim facture automatiquement le montant total non facturé.

**Exemple :**
- Jour 10 : 70 $ de dépassement → Facturation immédiate de 70 $
- Jour 15 : 35 $ d'utilisation supplémentaire (105 $ au total) → Déjà facturé, aucune action
- Jour 20 : 50 $ d'utilisation supplémentaire (155 $ au total, 85 $ non facturés) → Facturation immédiate de 85 $

Cela répartit les frais de dépassement importants tout au long du mois au lieu d'une seule facture importante en fin de période.

## Meilleures pratiques de gestion des coûts

1. **Surveillez régulièrement** : vérifiez fréquemment votre tableau de bord d'utilisation pour éviter les surprises
2. **Définissez des budgets** : utilisez les limites du plan comme garde-fous pour vos dépenses
3. **Optimisez les flux de travail** : examinez les exécutions à coût élevé et optimisez les prompts ou la sélection de modèles
4. **Utilisez des modèles appropriés** : adaptez la complexité du modèle aux exigences de la tâche
5. **Regroupez les tâches similaires** : combinez plusieurs requêtes lorsque c'est possible pour réduire les frais généraux

## Prochaines étapes

- Examinez votre utilisation actuelle dans [Paramètres → Abonnement](https://sim.ai/settings/subscription)
- Apprenez-en plus sur la [Journalisation](/execution/logging) pour suivre les détails d'exécution
- Explorez l'[API externe](/execution/api) pour la surveillance programmatique des coûts
- Consultez les [techniques d'optimisation de flux de travail](/blocks) pour réduire les coûts
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/execution/index.mdx

```text
---
title: Aperçu
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Le moteur d'exécution de Sim donne vie à vos flux de travail en traitant les blocs dans le bon ordre, en gérant le flux de données et en traitant les erreurs avec élégance, afin que vous puissiez comprendre exactement comment les flux de travail sont exécutés dans Sim.

<Callout type="info">
  Chaque exécution de flux de travail suit un chemin déterministe basé sur vos connexions de blocs et votre logique, garantissant des résultats prévisibles et fiables.
</Callout>

## Aperçu de la documentation

<Cards>
  <Card title="Principes fondamentaux d'exécution" href="/execution/basics">
    Découvrez le flux d'exécution fondamental, les types de blocs et comment les données circulent dans votre
    flux de travail
  </Card>

  <Card title="Journalisation" href="/execution/logging">
    Surveillez les exécutions de flux de travail avec une journalisation complète et une visibilité en temps réel
  </Card>
  
  <Card title="Calcul des coûts" href="/execution/costs">
    Comprenez comment les coûts d'exécution des flux de travail sont calculés et optimisés
  </Card>
  
  <Card title="API externe" href="/execution/api">
    Accédez aux journaux d'exécution et configurez des webhooks par programmation via l'API REST
  </Card>
</Cards>

## Concepts clés

### Exécution topologique
Les blocs s'exécutent dans l'ordre des dépendances, similaire à la façon dont un tableur recalcule les cellules. Le moteur d'exécution détermine automatiquement quels blocs peuvent s'exécuter en fonction des dépendances terminées.

### Suivi des chemins
Le moteur suit activement les chemins d'exécution à travers votre flux de travail. Les blocs Routeur et Condition mettent à jour dynamiquement ces chemins, garantissant que seuls les blocs pertinents s'exécutent.

### Traitement par couches
Au lieu d'exécuter les blocs un par un, le moteur identifie des couches de blocs qui peuvent s'exécuter en parallèle, optimisant les performances pour les flux de travail complexes.

### Contexte d'exécution
Chaque flux de travail maintient un contexte riche pendant l'exécution contenant :
- Sorties et états des blocs
- Chemins d'exécution actifs
- Suivi des itérations de boucle et parallèles
- Variables d'environnement
- Décisions de routage

## Instantanés de déploiement

Tous les points d'entrée publics — API, Chat, Planification, Webhook et exécutions manuelles — exécutent l'instantané de déploiement actif du workflow. Publiez un nouveau déploiement chaque fois que vous modifiez le canevas afin que chaque déclencheur utilise la version mise à jour.

<div className='flex justify-center my-6'>
  <Image
    src='/static/execution/deployment-versions.png'
    alt='Tableau des versions de déploiement'
    width={500}
    height={280}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

La fenêtre de déploiement conserve un historique complet des versions — inspectez n'importe quel instantané, comparez-le à votre brouillon, et promouvez ou revenez en arrière en un clic lorsque vous devez restaurer une version antérieure.

## Exécution programmatique

Exécutez des workflows depuis vos applications en utilisant nos SDK officiels :

```bash
# TypeScript/JavaScript
npm install simstudio-ts-sdk

# Python
pip install simstudio-sdk
```

```typescript
// TypeScript Example
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({ 
  apiKey: 'your-api-key' 
});

const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello' }
});
```

## Bonnes pratiques

### Conception pour la fiabilité
- Gérez les erreurs avec élégance en prévoyant des chemins de repli appropriés
- Utilisez des variables d'environnement pour les données sensibles
- Ajoutez des journalisations aux blocs de fonction pour le débogage

### Optimisation des performances
- Minimisez les appels API externes lorsque possible
- Utilisez l'exécution parallèle pour les opérations indépendantes
- Mettez en cache les résultats avec des blocs de mémoire lorsque c'est approprié

### Surveillance des exécutions
- Examinez régulièrement les journaux pour comprendre les modèles de performance
- Suivez les coûts d'utilisation des modèles d'IA
- Utilisez des instantanés de workflow pour déboguer les problèmes

## Et ensuite ?

Commencez par les [Principes de base de l'exécution](/execution/basics) pour comprendre comment les workflows s'exécutent, puis explorez la [Journalisation](/execution/logging) pour surveiller vos exécutions et le [Calcul des coûts](/execution/costs) pour optimiser vos dépenses.
```

--------------------------------------------------------------------------------

````
