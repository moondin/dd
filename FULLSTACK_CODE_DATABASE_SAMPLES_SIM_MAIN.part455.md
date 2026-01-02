---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 455
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 455 of 933)

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

---[FILE: function.ts]---
Location: sim-main/apps/sim/blocks/blocks/function.ts

```typescript
import { CodeIcon } from '@/components/icons'
import { CodeLanguage, getLanguageDisplayName } from '@/lib/execution/languages'
import type { BlockConfig } from '@/blocks/types'
import type { CodeExecutionOutput } from '@/tools/function/types'

export const FunctionBlock: BlockConfig<CodeExecutionOutput> = {
  type: 'function',
  name: 'Function',
  description: 'Run custom logic',
  longDescription:
    'This is a core workflow block. Execute custom JavaScript or Python code within your workflow. JavaScript without imports runs locally for fast execution, while code with imports or Python uses E2B sandbox.',
  bestPractices: `
  - JavaScript code without external imports runs in a local VM for fastest execution.
  - JavaScript code with import/require statements requires E2B and runs in a secure sandbox.
  - Python code always requires E2B and runs in a secure sandbox.
  - Can reference workflow variables using <blockName.output> syntax as usual within code. Avoid XML/HTML tags.
  `,
  docsLink: 'https://docs.sim.ai/blocks/function',
  category: 'blocks',
  bgColor: '#FF402F',
  icon: CodeIcon,
  subBlocks: [
    {
      id: 'language',
      type: 'dropdown',
      options: [
        { label: getLanguageDisplayName(CodeLanguage.JavaScript), id: CodeLanguage.JavaScript },
        { label: getLanguageDisplayName(CodeLanguage.Python), id: CodeLanguage.Python },
      ],
      placeholder: 'Select language',
      value: () => CodeLanguage.JavaScript,
      requiresFeature: 'NEXT_PUBLIC_E2B_ENABLED',
    },
    {
      id: 'code',
      title: 'Code',
      type: 'code',
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert JavaScript programmer.
Generate ONLY the raw body of a JavaScript function based on the user's request. Never wrap in markdown formatting.
The code should be executable within an 'async function(params, environmentVariables) {...}' context.
- 'params' (object): Contains input parameters derived from the JSON schema. Access these directly using the parameter name wrapped in angle brackets, e.g., '<paramName>'. Do NOT use 'params.paramName'.
- 'environmentVariables' (object): Contains environment variables. Reference these using the double curly brace syntax: '{{ENV_VAR_NAME}}'. Do NOT use 'environmentVariables.VAR_NAME' or env.

Current code context: {context}

IMPORTANT FORMATTING RULES:
1. Reference Environment Variables: Use the exact syntax {{VARIABLE_NAME}}. Do NOT wrap it in quotes (e.g., use 'apiKey = {{SERVICE_API_KEY}}' not 'apiKey = "{{SERVICE_API_KEY}}"'). Our system replaces these placeholders before execution.
2. Reference Input Parameters/Workflow Variables: Use the exact syntax <variable_name>. Do NOT wrap it in quotes (e.g., use 'userId = <userId>;' not 'userId = "<userId>";'). This includes parameters defined in the block's schema and outputs from previous blocks.
3. Function Body ONLY: Do NOT include the function signature (e.g., 'async function myFunction() {' or the surrounding '}').
4. Imports: Do NOT include import/require statements unless they are standard Node.js built-in modules (e.g., 'crypto', 'fs'). External libraries are not supported in this context.
5. Output: Ensure the code returns a value if the function is expected to produce output. Use 'return'.
6. Clarity: Write clean, readable code.
7. No Explanations: Do NOT include markdown formatting, comments explaining the rules, or any text other than the raw JavaScript code for the function body.

Example Scenario:
User Prompt: "Fetch user data from an API. Use the User ID passed in as 'userId' and an API Key stored as the 'SERVICE_API_KEY' environment variable."

Generated Code:
const userId = <block.content>; // Correct: Accessing input parameter without quotes
const apiKey = {{SERVICE_API_KEY}}; // Correct: Accessing environment variable without quotes
const url = \`https://api.example.com/users/\${userId}\`;

try {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    // Throwing an error will mark the block execution as failed
    throw new Error(\`API request failed with status \${response.status}: \${await response.text()}\`);
  }

  const data = await response.json();
  console.log('User data fetched successfully.'); // Optional: logging for debugging
  return data; // Return the fetched data which becomes the block's output
} catch (error) {
  console.error(\`Error fetching user data: \${error.message}\`);
  // Re-throwing the error ensures the workflow knows this step failed.
  throw error;
}`,
        placeholder: 'Describe the function you want to create...',
        generationType: 'javascript-function-body',
      },
    },
  ],
  tools: {
    access: ['function_execute'],
  },
  inputs: {
    code: { type: 'string', description: 'JavaScript or Python code to execute' },
    language: { type: 'string', description: 'Language (javascript or python)' },
    timeout: { type: 'number', description: 'Execution timeout' },
  },
  outputs: {
    result: { type: 'json', description: 'Return value from the executed JavaScript function' },
    stdout: {
      type: 'string',
      description: 'Console log output and debug messages from function execution',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: generic_webhook.ts]---
Location: sim-main/apps/sim/blocks/blocks/generic_webhook.ts
Signals: React

```typescript
import type { SVGProps } from 'react'
import { createElement } from 'react'
import { Webhook } from 'lucide-react'
import type { BlockConfig } from '@/blocks/types'
import { getTrigger } from '@/triggers'

const WebhookIcon = (props: SVGProps<SVGSVGElement>) => createElement(Webhook, props)

export const GenericWebhookBlock: BlockConfig = {
  type: 'generic_webhook',
  name: 'Webhook',
  description: 'Receive webhooks from any service by configuring a custom webhook.',
  category: 'triggers',
  icon: WebhookIcon,
  bgColor: '#10B981', // Green color for triggers
  triggerAllowed: true,
  bestPractices: `
  - You can test the webhook by sending a request to the webhook URL. E.g. depending on authorization:  curl -X POST http://localhost:3000/api/webhooks/trigger/d8abcf0d-1ee5-4b77-bb07-b1e8142ea4e9 -H "Content-Type: application/json" -H "X-Sim-Secret: 1234" -d '{"message": "Test webhook trigger", "data": {"key": "v"}}'
  - Continuing example above, the body can be accessed in downstream block using dot notation. E.g. <webhook1.message> and <webhook1.data.key>
  - Only use when there's no existing integration for the service with triggerAllowed flag set to true.
  `,
  subBlocks: [...getTrigger('generic_webhook').subBlocks],

  tools: {
    access: [], // No external tools needed for triggers
  },

  inputs: {}, // No inputs - webhook triggers receive data externally

  outputs: {},

  triggers: {
    enabled: true,
    available: ['generic_webhook'],
  },
}
```

--------------------------------------------------------------------------------

````
