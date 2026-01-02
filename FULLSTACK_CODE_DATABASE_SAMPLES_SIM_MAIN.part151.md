---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 151
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 151 of 933)

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

---[FILE: typescript.mdx]---
Location: sim-main/apps/docs/content/docs/fr/sdks/typescript.mdx

```text
---
title: TypeScript
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Le SDK officiel TypeScript/JavaScript pour Sim offre une sécurité de type complète et prend en charge les environnements Node.js et navigateur, vous permettant d'exécuter des flux de travail par programmation depuis vos applications Node.js, applications web et autres environnements JavaScript.

<Callout type="info">
  Le SDK TypeScript fournit une sécurité de type complète, une prise en charge de l'exécution asynchrone, une limitation automatique du débit avec backoff exponentiel et un suivi d'utilisation.
</Callout>

## Installation

Installez le SDK en utilisant votre gestionnaire de paquets préféré :

<Tabs items={['npm', 'yarn', 'bun']}>
  <Tab value="npm">

    ```bash
    npm install simstudio-ts-sdk
    ```

  </Tab>
  <Tab value="yarn">

    ```bash
    yarn add simstudio-ts-sdk
    ```

  </Tab>
  <Tab value="bun">

    ```bash
    bun add simstudio-ts-sdk
    ```

  </Tab>
</Tabs>

## Démarrage rapide

Voici un exemple simple pour vous aider à démarrer :

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

// Initialize the client
const client = new SimStudioClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://sim.ai' // optional, defaults to https://sim.ai
});

// Execute a workflow
try {
  const result = await client.executeWorkflow('workflow-id');
  console.log('Workflow executed successfully:', result);
} catch (error) {
  console.error('Workflow execution failed:', error);
}
```

## Référence de l'API

### SimStudioClient

#### Constructeur

```typescript
new SimStudioClient(config: SimStudioConfig)
```

**Configuration :**
- `config.apiKey` (string) : Votre clé API Sim
- `config.baseUrl` (string, optionnel) : URL de base pour l'API Sim (par défaut `https://sim.ai`)

#### Méthodes

##### executeWorkflow()

Exécuter un flux de travail avec des données d'entrée optionnelles.

```typescript
const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello, world!' },
  timeout: 30000 // 30 seconds
});
```

**Paramètres :**
- `workflowId` (string) : L'identifiant du workflow à exécuter
- `options` (ExecutionOptions, facultatif) :
  - `input` (any) : Données d'entrée à transmettre au workflow
  - `timeout` (number) : Délai d'expiration en millisecondes (par défaut : 30000)
  - `stream` (boolean) : Activer les réponses en streaming (par défaut : false)
  - `selectedOutputs` (string[]) : Sorties de blocs à diffuser au format `blockName.attribute` (par exemple, `["agent1.content"]`)
  - `async` (boolean) : Exécuter de manière asynchrone (par défaut : false)

**Retourne :** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

Lorsque `async: true`, retourne immédiatement un identifiant de tâche pour l'interrogation. Sinon, attend la fin de l'exécution.

##### getWorkflowStatus()

Obtenir le statut d'un workflow (statut de déploiement, etc.).

```typescript
const status = await client.getWorkflowStatus('workflow-id');
console.log('Is deployed:', status.isDeployed);
```

**Paramètres :**
- `workflowId` (string) : L'identifiant du workflow

**Retourne :** `Promise<WorkflowStatus>`

##### validateWorkflow()

Valider qu'un workflow est prêt pour l'exécution.

```typescript
const isReady = await client.validateWorkflow('workflow-id');
if (isReady) {
  // Workflow is deployed and ready
}
```

**Paramètres :**
- `workflowId` (string) : L'identifiant du workflow

**Retourne :** `Promise<boolean>`

##### getJobStatus()

Obtenir le statut d'une exécution de tâche asynchrone.

```typescript
const status = await client.getJobStatus('task-id-from-async-execution');
console.log('Status:', status.status); // 'queued', 'processing', 'completed', 'failed'
if (status.status === 'completed') {
  console.log('Output:', status.output);
}
```

**Paramètres :**
- `taskId` (string) : L'identifiant de tâche retourné par l'exécution asynchrone

**Retourne :** `Promise<JobStatus>`

**Champs de réponse :**
- `success` (boolean) : Indique si la requête a réussi
- `taskId` (string) : L'identifiant de la tâche
- `status` (string) : L'un des états suivants : `'queued'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`
- `metadata` (object) : Contient `startedAt`, `completedAt` et `duration`
- `output` (any, facultatif) : La sortie du workflow (une fois terminé)
- `error` (any, facultatif) : Détails de l'erreur (en cas d'échec)
- `estimatedDuration` (number, facultatif) : Durée estimée en millisecondes (lorsqu'en traitement/en file d'attente)

##### executeWithRetry()

Exécuter un workflow avec une nouvelle tentative automatique en cas d'erreurs de limitation de débit, en utilisant un backoff exponentiel.

```typescript
const result = await client.executeWithRetry('workflow-id', {
  input: { message: 'Hello' },
  timeout: 30000
}, {
  maxRetries: 3,           // Maximum number of retries
  initialDelay: 1000,      // Initial delay in ms (1 second)
  maxDelay: 30000,         // Maximum delay in ms (30 seconds)
  backoffMultiplier: 2     // Exponential backoff multiplier
});
```

**Paramètres :**
- `workflowId` (string) : L'identifiant du workflow à exécuter
- `options` (ExecutionOptions, facultatif) : Identique à `executeWorkflow()`
- `retryOptions` (RetryOptions, facultatif) :
  - `maxRetries` (number) : Nombre maximum de tentatives (par défaut : 3)
  - `initialDelay` (number) : Délai initial en ms (par défaut : 1000)
  - `maxDelay` (number) : Délai maximum en ms (par défaut : 30000)
  - `backoffMultiplier` (number) : Multiplicateur de backoff (par défaut : 2)

**Retourne :** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

La logique de nouvelle tentative utilise un backoff exponentiel (1s → 2s → 4s → 8s...) avec une variation aléatoire de ±25 % pour éviter l'effet de horde. Si l'API fournit un en-tête `retry-after`, celui-ci sera utilisé à la place.

##### getRateLimitInfo()

Obtenir les informations actuelles de limitation de débit à partir de la dernière réponse de l'API.

```typescript
const rateLimitInfo = client.getRateLimitInfo();
if (rateLimitInfo) {
  console.log('Limit:', rateLimitInfo.limit);
  console.log('Remaining:', rateLimitInfo.remaining);
  console.log('Reset:', new Date(rateLimitInfo.reset * 1000));
}
```

**Retourne :** `RateLimitInfo | null`

##### getUsageLimits()

Obtenir les limites d'utilisation actuelles et les informations de quota pour votre compte.

```typescript
const limits = await client.getUsageLimits();
console.log('Sync requests remaining:', limits.rateLimit.sync.remaining);
console.log('Async requests remaining:', limits.rateLimit.async.remaining);
console.log('Current period cost:', limits.usage.currentPeriodCost);
console.log('Plan:', limits.usage.plan);
```

**Retourne :** `Promise<UsageLimits>`

**Structure de la réponse :**

```typescript
{
  success: boolean
  rateLimit: {
    sync: {
      isLimited: boolean
      limit: number
      remaining: number
      resetAt: string
    }
    async: {
      isLimited: boolean
      limit: number
      remaining: number
      resetAt: string
    }
    authType: string  // 'api' or 'manual'
  }
  usage: {
    currentPeriodCost: number
    limit: number
    plan: string  // e.g., 'free', 'pro'
  }
}
```

##### setApiKey()

Mettre à jour la clé API.

```typescript
client.setApiKey('new-api-key');
```

##### setBaseUrl()

Mettre à jour l'URL de base.

```typescript
client.setBaseUrl('https://my-custom-domain.com');
```

## Types

### WorkflowExecutionResult

```typescript
interface WorkflowExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  logs?: any[];
  metadata?: {
    duration?: number;
    executionId?: string;
    [key: string]: any;
  };
  traceSpans?: any[];
  totalDuration?: number;
}
```

### AsyncExecutionResult

```typescript
interface AsyncExecutionResult {
  success: boolean;
  taskId: string;
  status: 'queued';
  createdAt: string;
  links: {
    status: string;  // e.g., "/api/jobs/{taskId}"
  };
}
```

### WorkflowStatus

```typescript
interface WorkflowStatus {
  isDeployed: boolean;
  deployedAt?: string;
  needsRedeployment: boolean;
}
```

### RateLimitInfo

```typescript
interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}
```

### UsageLimits

```typescript
interface UsageLimits {
  success: boolean;
  rateLimit: {
    sync: {
      isLimited: boolean;
      limit: number;
      remaining: number;
      resetAt: string;
    };
    async: {
      isLimited: boolean;
      limit: number;
      remaining: number;
      resetAt: string;
    };
    authType: string;
  };
  usage: {
    currentPeriodCost: number;
    limit: number;
    plan: string;
  };
}
```

### SimStudioError

```typescript
class SimStudioError extends Error {
  code?: string;
  status?: number;
}
```

**Codes d'erreur courants :**
- `UNAUTHORIZED` : Clé API invalide
- `TIMEOUT` : Délai d'attente dépassé
- `RATE_LIMIT_EXCEEDED` : Limite de débit dépassée
- `USAGE_LIMIT_EXCEEDED` : Limite d'utilisation dépassée
- `EXECUTION_ERROR` : Échec de l'exécution du workflow

## Exemples

### Exécution basique d'un workflow

<Steps>
  <Step title="Initialiser le client">
    Configurez le SimStudioClient avec votre clé API.
  </Step>
  <Step title="Valider le workflow">
    Vérifiez si le workflow est déployé et prêt pour l'exécution.
  </Step>
  <Step title="Exécuter le workflow">
    Lancez le workflow avec vos données d'entrée.
  </Step>
  <Step title="Gérer le résultat">
    Traitez le résultat de l'exécution et gérez les éventuelles erreurs.
  </Step>
</Steps>

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function runWorkflow() {
  try {
    // Check if workflow is ready
    const isReady = await client.validateWorkflow('my-workflow-id');
    if (!isReady) {
      throw new Error('Workflow is not deployed or ready');
    }

    // Execute the workflow
    const result = await client.executeWorkflow('my-workflow-id', {
      input: {
        message: 'Process this data',
        userId: '12345'
      }
    });

    if (result.success) {
      console.log('Output:', result.output);
      console.log('Duration:', result.metadata?.duration);
    } else {
      console.error('Workflow failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

runWorkflow();
```

### Gestion des erreurs

Gérez différents types d'erreurs qui peuvent survenir pendant l'exécution du workflow :

```typescript
import { SimStudioClient, SimStudioError } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithErrorHandling() {
  try {
    const result = await client.executeWorkflow('workflow-id');
    return result;
  } catch (error) {
    if (error instanceof SimStudioError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          console.error('Invalid API key');
          break;
        case 'TIMEOUT':
          console.error('Workflow execution timed out');
          break;
        case 'USAGE_LIMIT_EXCEEDED':
          console.error('Usage limit exceeded');
          break;
        case 'INVALID_JSON':
          console.error('Invalid JSON in request body');
          break;
        default:
          console.error('Workflow error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### Configuration de l'environnement

Configurez le client en utilisant des variables d'environnement :

<Tabs items={['Development', 'Production']}>
  <Tab value="Development">

    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';

    // Development configuration
    const apiKey = process.env.SIM_API_KEY;
    if (!apiKey) {
      throw new Error('SIM_API_KEY environment variable is required');
    }

    const client = new SimStudioClient({
      apiKey,
      baseUrl: process.env.SIM_BASE_URL // optional
    });
    ```

  </Tab>
  <Tab value="Production">

    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';

    // Production configuration with validation
    const apiKey = process.env.SIM_API_KEY;
    if (!apiKey) {
      throw new Error('SIM_API_KEY environment variable is required');
    }

    const client = new SimStudioClient({
      apiKey,
      baseUrl: process.env.SIM_BASE_URL || 'https://sim.ai'
    });
    ```

  </Tab>
</Tabs>

### Intégration avec Node.js Express

Intégration avec un serveur Express.js :

```typescript
import express from 'express';
import { SimStudioClient } from 'simstudio-ts-sdk';

const app = express();
const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

app.use(express.json());

app.post('/execute-workflow', async (req, res) => {
  try {
    const { workflowId, input } = req.body;
    
    const result = await client.executeWorkflow(workflowId, {
      input,
      timeout: 60000
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Route API Next.js

Utilisation avec les routes API Next.js :

```typescript
// pages/api/workflow.ts or app/api/workflow/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflowId, input } = req.body;

    const result = await client.executeWorkflow(workflowId, {
      input,
      timeout: 30000
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({
      error: 'Failed to execute workflow'
    });
  }
}
```

### Utilisation dans le navigateur

Utilisation dans le navigateur (avec une configuration CORS appropriée) :

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

// Note: In production, use a proxy server to avoid exposing API keys
const client = new SimStudioClient({
  apiKey: 'your-public-api-key', // Use with caution in browser
  baseUrl: 'https://sim.ai'
});

async function executeClientSideWorkflow() {
  try {
    const result = await client.executeWorkflow('workflow-id', {
      input: {
        userInput: 'Hello from browser'
      }
    });

    console.log('Workflow result:', result);

    // Update UI with result
    document.getElementById('result')!.textContent =
      JSON.stringify(result.output, null, 2);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Téléchargement de fichiers

Les objets File sont automatiquement détectés et convertis au format base64. Incluez-les dans votre entrée sous le nom de champ correspondant au format d'entrée du déclencheur API de votre workflow.

Le SDK convertit les objets File dans ce format :

```typescript
{
  type: 'file',
  data: 'data:mime/type;base64,base64data',
  name: 'filename',
  mime: 'mime/type'
}
```

Alternativement, vous pouvez fournir manuellement des fichiers en utilisant le format URL :

```typescript
{
  type: 'url',
  data: 'https://example.com/file.pdf',
  name: 'file.pdf',
  mime: 'application/pdf'
}
```

<Tabs items={['Browser', 'Node.js']}>
  <Tab value="Browser">

    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';

    const client = new SimStudioClient({
      apiKey: process.env.NEXT_PUBLIC_SIM_API_KEY!
    });

    // From file input
    async function handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      const files = Array.from(input.files || []);

      // Include files under the field name from your API trigger's input format
      const result = await client.executeWorkflow('workflow-id', {
        input: {
          documents: files,  // Must match your workflow's "files" field name
          instructions: 'Analyze these documents'
        }
      });

      console.log('Result:', result);
    }
    ```

  </Tab>
  <Tab value="Node.js">

    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';
    import fs from 'fs';

    const client = new SimStudioClient({
      apiKey: process.env.SIM_API_KEY!
    });

    // Read file and create File object
    const fileBuffer = fs.readFileSync('./document.pdf');
    const file = new File([fileBuffer], 'document.pdf', {
      type: 'application/pdf'
    });

    // Include files under the field name from your API trigger's input format
    const result = await client.executeWorkflow('workflow-id', {
      input: {
        documents: [file],  // Must match your workflow's "files" field name
        query: 'Summarize this document'
      }
    });
    ```

  </Tab>
</Tabs>

<Callout type="warning">
  Lorsque vous utilisez le SDK dans le navigateur, faites attention à ne pas exposer des clés API sensibles. Envisagez d'utiliser un proxy backend ou des clés API publiques avec des permissions limitées.
</Callout>

### Exemple de hook React

Créez un hook React personnalisé pour l'exécution du workflow :

```typescript
import { useState, useCallback } from 'react';
import { SimStudioClient, WorkflowExecutionResult } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

interface UseWorkflowResult {
  result: WorkflowExecutionResult | null;
  loading: boolean;
  error: Error | null;
  executeWorkflow: (workflowId: string, input?: any) => Promise<void>;
}

export function useWorkflow(): UseWorkflowResult {
  const [result, setResult] = useState<WorkflowExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeWorkflow = useCallback(async (workflowId: string, input?: any) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const workflowResult = await client.executeWorkflow(workflowId, {
        input,
        timeout: 30000
      });
      setResult(workflowResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    error,
    executeWorkflow
  };
}

// Usage in component
function WorkflowComponent() {
  const { result, loading, error, executeWorkflow } = useWorkflow();

  const handleExecute = () => {
    executeWorkflow('my-workflow-id', {
      message: 'Hello from React!'
    });
  };

  return (
    <div>
      <button onClick={handleExecute} disabled={loading}>
        {loading ? 'Executing...' : 'Execute Workflow'}
      </button>

      {error && <div>Error: {error.message}</div>}
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Exécution asynchrone du workflow

Exécutez des workflows de manière asynchrone pour les tâches de longue durée :

```typescript
import { SimStudioClient, AsyncExecutionResult } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeAsync() {
  try {
    // Start async execution
    const result = await client.executeWorkflow('workflow-id', {
      input: { data: 'large dataset' },
      async: true  // Execute asynchronously
    });

    // Check if result is an async execution
    if ('taskId' in result) {
      console.log('Task ID:', result.taskId);
      console.log('Status endpoint:', result.links.status);

      // Poll for completion
      let status = await client.getJobStatus(result.taskId);

      while (status.status === 'queued' || status.status === 'processing') {
        console.log('Current status:', status.status);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        status = await client.getJobStatus(result.taskId);
      }

      if (status.status === 'completed') {
        console.log('Workflow completed!');
        console.log('Output:', status.output);
        console.log('Duration:', status.metadata.duration);
      } else {
        console.error('Workflow failed:', status.error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

executeAsync();
```

### Limitation de débit et nouvelle tentative

Gérez automatiquement les limites de débit avec un backoff exponentiel :

```typescript
import { SimStudioClient, SimStudioError } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithRetryHandling() {
  try {
    // Automatically retries on rate limit
    const result = await client.executeWithRetry('workflow-id', {
      input: { message: 'Process this' }
    }, {
      maxRetries: 5,
      initialDelay: 1000,
      maxDelay: 60000,
      backoffMultiplier: 2
    });

    console.log('Success:', result);
  } catch (error) {
    if (error instanceof SimStudioError && error.code === 'RATE_LIMIT_EXCEEDED') {
      console.error('Rate limit exceeded after all retries');

      // Check rate limit info
      const rateLimitInfo = client.getRateLimitInfo();
      if (rateLimitInfo) {
        console.log('Rate limit resets at:', new Date(rateLimitInfo.reset * 1000));
      }
    }
  }
}
```

### Surveillance de l'utilisation

Surveillez l'utilisation et les limites de votre compte :

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function checkUsage() {
  try {
    const limits = await client.getUsageLimits();

    console.log('=== Rate Limits ===');
    console.log('Sync requests:');
    console.log('  Limit:', limits.rateLimit.sync.limit);
    console.log('  Remaining:', limits.rateLimit.sync.remaining);
    console.log('  Resets at:', limits.rateLimit.sync.resetAt);
    console.log('  Is limited:', limits.rateLimit.sync.isLimited);

    console.log('\nAsync requests:');
    console.log('  Limit:', limits.rateLimit.async.limit);
    console.log('  Remaining:', limits.rateLimit.async.remaining);
    console.log('  Resets at:', limits.rateLimit.async.resetAt);
    console.log('  Is limited:', limits.rateLimit.async.isLimited);

    console.log('\n=== Usage ===');
    console.log('Current period cost: $' + limits.usage.currentPeriodCost.toFixed(2));
    console.log('Limit: $' + limits.usage.limit.toFixed(2));
    console.log('Plan:', limits.usage.plan);

    const percentUsed = (limits.usage.currentPeriodCost / limits.usage.limit) * 100;
    console.log('Usage: ' + percentUsed.toFixed(1) + '%');

    if (percentUsed > 80) {
      console.warn('⚠️  Warning: You are approaching your usage limit!');
    }
  } catch (error) {
    console.error('Error checking usage:', error);
  }
}

checkUsage();
```

### Exécution de workflow en streaming

Exécutez des workflows avec des réponses en streaming en temps réel :

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithStreaming() {
  try {
    // Enable streaming for specific block outputs
    const result = await client.executeWorkflow('workflow-id', {
      input: { message: 'Count to five' },
      stream: true,
      selectedOutputs: ['agent1.content'] // Use blockName.attribute format
    });

    console.log('Workflow result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

La réponse en streaming suit le format Server-Sent Events (SSE) :

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**Exemple de streaming avec React :**

```typescript
import { useState, useEffect } from 'react';

function StreamingWorkflow() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const executeStreaming = async () => {
    setLoading(true);
    setOutput('');

    // IMPORTANT: Make this API call from your backend server, not the browser
    // Never expose your API key in client-side code
    const response = await fetch('https://sim.ai/api/workflows/WORKFLOW_ID/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.SIM_API_KEY! // Server-side environment variable only
      },
      body: JSON.stringify({
        message: 'Generate a story',
        stream: true,
        selectedOutputs: ['agent1.content']
      })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            setLoading(false);
            break;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              setOutput(prev => prev + parsed.chunk);
            } else if (parsed.event === 'done') {
              console.log('Execution complete:', parsed.metadata);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  };

  return (
    <div>
      <button onClick={executeStreaming} disabled={loading}>
        {loading ? 'Generating...' : 'Start Streaming'}
      </button>
      <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
    </div>
  );
}
```

## Obtenir votre clé API

<Steps>
  <Step title="Connectez-vous à Sim">
    Accédez à [Sim](https://sim.ai) et connectez-vous à votre compte.
  </Step>
  <Step title="Ouvrez votre workflow">
    Accédez au workflow que vous souhaitez exécuter par programmation.
  </Step>
  <Step title="Déployez votre workflow">
    Cliquez sur "Déployer" pour déployer votre workflow s'il n'a pas encore été déployé.
  </Step>
  <Step title="Créez ou sélectionnez une clé API">
    Pendant le processus de déploiement, sélectionnez ou créez une clé API.
  </Step>
  <Step title="Copiez la clé API">
    Copiez la clé API pour l'utiliser dans votre application TypeScript/JavaScript.
  </Step>
</Steps>

## Prérequis

- Node.js 16+
- TypeScript 5.0+ (pour les projets TypeScript)

## Licence

Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: docker.mdx]---
Location: sim-main/apps/docs/content/docs/fr/self-hosting/docker.mdx

```text
---
title: Docker
description: Déployer Sim Studio avec Docker Compose
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Démarrage rapide

```bash
# Clone and start
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Configuration de production

### 1. Configurer l'environnement

```bash
# Generate secrets
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
BETTER_AUTH_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
EOF
```

### 2. Démarrer les services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 3. Configurer SSL

<Tabs items={['Caddy (Recommandé)', 'Nginx + Certbot']}>
  <Tab value="Caddy (Recommandé)">
Caddy gère automatiquement les certificats SSL.

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

Créez `/etc/caddy/Caddyfile` :

```
sim.yourdomain.com {
    reverse_proxy localhost:3000

    handle /socket.io/* {
        reverse_proxy localhost:3002
    }
}
```

```bash
sudo systemctl restart caddy
```

  </Tab>
  <Tab value="Nginx + Certbot">

```bash
# Install
sudo apt install nginx certbot python3-certbot-nginx -y

# Create /etc/nginx/sites-available/sim
server {
    listen 80;
    server_name sim.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Enable and get certificate
sudo ln -s /etc/nginx/sites-available/sim /etc/nginx/sites-enabled/
sudo certbot --nginx -d sim.yourdomain.com
```

  </Tab>
</Tabs>

## Ollama

```bash
# With GPU
docker compose -f docker-compose.ollama.yml --profile gpu --profile setup up -d

# CPU only
docker compose -f docker-compose.ollama.yml --profile cpu --profile setup up -d
```

Télécharger des modèles supplémentaires :

```bash
docker compose -f docker-compose.ollama.yml exec ollama ollama pull llama3.2
```

### Ollama externe

Si Ollama s'exécute sur votre machine hôte (pas dans Docker) :

```bash
# macOS/Windows
OLLAMA_URL=http://host.docker.internal:11434 docker compose -f docker-compose.prod.yml up -d

# Linux - use your host IP
OLLAMA_URL=http://192.168.1.100:11434 docker compose -f docker-compose.prod.yml up -d
```

<Callout type="warning">
  À l'intérieur de Docker, `localhost` fait référence au conteneur, pas à votre hôte. Utilisez `host.docker.internal` ou l'IP de votre hôte.
</Callout>

## Commandes

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f simstudio

# Stop
docker compose -f docker-compose.prod.yml down

# Update
docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d

# Backup database
docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres simstudio > backup.sql
```
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/fr/self-hosting/environment-variables.mdx

```text
---
title: Variables d'environnement
description: Référence de configuration pour Sim Studio
---

import { Callout } from 'fumadocs-ui/components/callout'

## Obligatoires

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL |
| `BETTER_AUTH_SECRET` | Secret d'authentification (32 caractères hexadécimaux) : `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | URL de votre application |
| `ENCRYPTION_KEY` | Clé de chiffrement (32 caractères hexadécimaux) : `openssl rand -hex 32` |
| `INTERNAL_API_SECRET` | Secret API interne (32 caractères hexadécimaux) : `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application |
| `NEXT_PUBLIC_SOCKET_URL` | URL WebSocket (par défaut : `http://localhost:3002`) |

## Fournisseurs d'IA

| Variable | Fournisseur |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY_1` | Anthropic Claude |
| `GEMINI_API_KEY_1` | Google Gemini |
| `MISTRAL_API_KEY` | Mistral |
| `OLLAMA_URL` | Ollama (par défaut : `http://localhost:11434`) |

<Callout type="info">
  Pour l'équilibrage de charge, ajoutez plusieurs clés avec les suffixes `_1`, `_2`, `_3` (par exemple, `OPENAI_API_KEY_1`, `OPENAI_API_KEY_2`). Fonctionne avec OpenAI, Anthropic et Gemini.
</Callout>

<Callout type="info">
  Dans Docker, utilisez `OLLAMA_URL=http://host.docker.internal:11434` pour Ollama sur la machine hôte.
</Callout>

### Azure OpenAI

| Variable | Description |
|----------|-------------|
| `AZURE_OPENAI_API_KEY` | Clé API Azure OpenAI |
| `AZURE_OPENAI_ENDPOINT` | URL du point de terminaison Azure OpenAI |
| `AZURE_OPENAI_API_VERSION` | Version de l'API (par exemple, `2024-02-15-preview`) |

### vLLM (auto-hébergé)

| Variable | Description |
|----------|-------------|
| `VLLM_BASE_URL` | URL du serveur vLLM (par exemple, `http://localhost:8000/v1`) |
| `VLLM_API_KEY` | Jeton bearer optionnel pour vLLM |

## Fournisseurs OAuth

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | ID client OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Secret client OAuth Google |
| `GITHUB_CLIENT_ID` | ID client OAuth GitHub |
| `GITHUB_CLIENT_SECRET` | Secret client OAuth GitHub |

## Optionnel

| Variable | Description |
|----------|-------------|
| `API_ENCRYPTION_KEY` | Chiffre les clés API stockées (32 caractères hexadécimaux) : `openssl rand -hex 32` |
| `COPILOT_API_KEY` | Clé API pour les fonctionnalités copilot |
| `ADMIN_API_KEY` | Clé API administrateur pour les opérations GitOps |
| `RESEND_API_KEY` | Service de messagerie pour les notifications |
| `ALLOWED_LOGIN_DOMAINS` | Restreindre les inscriptions à des domaines (séparés par des virgules) |
| `ALLOWED_LOGIN_EMAILS` | Restreindre les inscriptions à des emails spécifiques (séparés par des virgules) |
| `DISABLE_REGISTRATION` | Définir à `true` pour désactiver les inscriptions de nouveaux utilisateurs |

## Exemple de fichier .env

```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=<openssl rand -hex 32>
BETTER_AUTH_URL=https://sim.yourdomain.com
ENCRYPTION_KEY=<openssl rand -hex 32>
INTERNAL_API_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
OPENAI_API_KEY=sk-...
```

Voir `apps/sim/.env.example` pour toutes les options.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/self-hosting/index.mdx

```text
---
title: Auto-hébergement
description: Déployez Sim Studio sur votre propre infrastructure
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'

Déployez Sim Studio sur votre propre infrastructure avec Docker ou Kubernetes.

## Prérequis

| Ressource | Minimum | Recommandé |
|----------|---------|-------------|
| CPU | 2 cœurs | 4+ cœurs |
| RAM | 12 Go | 16+ Go |
| Stockage | 20 Go SSD | 50+ Go SSD |
| Docker | 20.10+ | Dernière version |

## Démarrage rapide

```bash
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Options de déploiement

<Cards>
  <Card title="Docker" href="/self-hosting/docker">
    Déployez avec Docker Compose sur n'importe quel serveur
  </Card>
  <Card title="Kubernetes" href="/self-hosting/kubernetes">
    Déployez avec Helm sur des clusters Kubernetes
  </Card>
  <Card title="Plateformes cloud" href="/self-hosting/platforms">
    Guides pour Railway, DigitalOcean, AWS, Azure, GCP
  </Card>
</Cards>

## Architecture

| Composant | Port | Description |
|-----------|------|-------------|
| simstudio | 3000 | Application principale |
| realtime | 3002 | Serveur WebSocket |
| db | 5432 | PostgreSQL avec pgvector |
| migrations | - | Migrations de base de données (exécutées une seule fois) |
```

--------------------------------------------------------------------------------

---[FILE: kubernetes.mdx]---
Location: sim-main/apps/docs/content/docs/fr/self-hosting/kubernetes.mdx

```text
---
title: Kubernetes
description: Déployer Sim Studio avec Helm
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Prérequis

- Kubernetes 1.19+
- Helm 3.0+
- Support du provisionneur PV

## Installation

```bash
# Clone repo
git clone https://github.com/simstudioai/sim.git && cd sim

# Generate secrets
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)

# Install
helm install sim ./helm/sim \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --namespace simstudio --create-namespace
```

## Valeurs spécifiques au cloud

<Tabs items={['AWS EKS', 'Azure AKS', 'GCP GKE']}>
  <Tab value="AWS EKS">

```bash
helm install sim ./helm/sim \
  --values ./helm/sim/examples/values-aws.yaml \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --set app.env.NEXT_PUBLIC_APP_URL="https://sim.yourdomain.com" \
  --namespace simstudio --create-namespace
```

  </Tab>
  <Tab value="Azure AKS">

```bash
helm install sim ./helm/sim \
  --values ./helm/sim/examples/values-azure.yaml \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --set app.env.NEXT_PUBLIC_APP_URL="https://sim.yourdomain.com" \
  --namespace simstudio --create-namespace
```

  </Tab>
  <Tab value="GCP GKE">

```bash
helm install sim ./helm/sim \
  --values ./helm/sim/examples/values-gcp.yaml \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --set app.env.NEXT_PUBLIC_APP_URL="https://sim.yourdomain.com" \
  --namespace simstudio --create-namespace
```

  </Tab>
</Tabs>

## Configuration clé

```yaml
# Custom values.yaml
app:
  replicaCount: 2
  env:
    NEXT_PUBLIC_APP_URL: "https://sim.yourdomain.com"
    OPENAI_API_KEY: "sk-..."

postgresql:
  persistence:
    size: 50Gi

ingress:
  enabled: true
  className: nginx
  tls:
    enabled: true
  app:
    host: sim.yourdomain.com
```

Voir `helm/sim/values.yaml` pour toutes les options.

## Base de données externe

```yaml
postgresql:
  enabled: false

externalDatabase:
  enabled: true
  host: "your-db-host"
  port: 5432
  username: "postgres"
  password: "your-password"
  database: "simstudio"
  sslMode: "require"
```

## Commandes

```bash
# Port forward for local access
kubectl port-forward deployment/sim-sim-app 3000:3000 -n simstudio

# View logs
kubectl logs -l app.kubernetes.io/component=app -n simstudio --tail=100

# Upgrade
helm upgrade sim ./helm/sim --namespace simstudio

# Uninstall
helm uninstall sim --namespace simstudio
```
```

--------------------------------------------------------------------------------

````
