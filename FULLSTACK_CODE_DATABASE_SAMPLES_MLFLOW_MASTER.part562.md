---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 562
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 562 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: scorerTransformUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/utils/scorerTransformUtils.ts

```typescript
import { type CausableError, ErrorName, PredefinedError } from '@databricks/web-shared/errors';
import { ErrorLogType } from '@databricks/web-shared/errors';
import type { ScheduledScorer, LLMScorer, CustomCodeScorer, ScorerConfig, LLMTemplate } from '../types';
import { LLM_TEMPLATE } from '../types';
import type { LLMScorerFormData } from '../LLMScorerFormRenderer';
import type { CustomCodeScorerFormData } from '../CustomCodeScorerFormRenderer';
import type { ScorerType } from '../constants';
import type { RegisterScorerResponse, MLflowScorer } from '../api';

// Union type for all form data - combines both form interfaces
export type ScorerFormData = (LLMScorerFormData | CustomCodeScorerFormData) & {
  scorerType: ScorerType;
};

// Local error class for scorer transformation issues
export class ScorerTransformationError extends PredefinedError {
  errorLogType = ErrorLogType.ApplicationError;
  errorName = ErrorName.ScorerTransformationError;
  isUserError = true;
  displayMessage: React.ReactNode;

  constructor(message?: string, cause?: CausableError) {
    super(message, cause);
    this.displayMessage = this.message;
  }
}

/**
 * Transform backend ScorerConfig to frontend ScheduledScorer
 */
export function transformScorerConfig(config: ScorerConfig): ScheduledScorer {
  const baseFields: Partial<ScheduledScorer> = {
    name: config.name,
    // Convert from backend float (0-1) to frontend percentage (0-100)
    sampleRate: config.sample_rate !== undefined ? config.sample_rate * 100 : undefined,
    version: config.scorer_version,
    disableMonitoring: true,
  };

  // Only add filterString if it has a value
  if (config.filter_string) {
    baseFields.filterString = config.filter_string;
  }

  try {
    const serializedData = JSON.parse(config.serialized_scorer);

    // Determine scorer type based on the serialized data
    if (serializedData.instructions_judge_pydantic_data) {
      // Instructions-based LLM scorer
      const instructions = serializedData.instructions_judge_pydantic_data.instructions || '';
      const model = serializedData.instructions_judge_pydantic_data.model;
      const result = {
        ...baseFields,
        type: 'llm',
        llmTemplate: LLM_TEMPLATE.CUSTOM,
        instructions,
        model,
        is_instructions_judge: true,
      } as LLMScorer;
      return result;
    } else if (serializedData.builtin_scorer_class === LLM_TEMPLATE.GUIDELINES) {
      const rawGuidelines = serializedData.builtin_scorer_pydantic_data?.guidelines || [];
      // Ensure guidelines is always an array - if it's a string, put it in an array
      const guidelines = Array.isArray(rawGuidelines) ? rawGuidelines : [rawGuidelines].filter(Boolean);
      const model = serializedData.builtin_scorer_pydantic_data?.model;
      return {
        ...baseFields,
        type: 'llm',
        llmTemplate: LLM_TEMPLATE.GUIDELINES,
        guidelines,
        model,
        is_instructions_judge: false,
      } as LLMScorer;
    } else if (serializedData.builtin_scorer_class && config.builtin) {
      const model = serializedData.builtin_scorer_pydantic_data?.model;
      return {
        ...baseFields,
        type: 'llm',
        llmTemplate: serializedData.builtin_scorer_class,
        model,
        is_instructions_judge: false,
      } as LLMScorer;
    } else {
      // Custom scorer - extract code from call_source
      const callSource = serializedData.call_source || '';
      const originalFuncName = serializedData.original_func_name;
      const callSignature = serializedData.call_signature;

      let code;
      if (originalFuncName && callSignature) {
        // Build complete function definition with name and signature
        code = `def ${originalFuncName}${callSignature}:\n    ${callSource.replace(/\n/g, '\n    ')}`;
      } else {
        // Just use the call_source as-is
        code = callSource;
      }

      return {
        ...baseFields,
        type: 'custom-code',
        code,
        callSignature,
        originalFuncName,
      } as CustomCodeScorer;
    }
  } catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));
    throw new ScorerTransformationError(`Failed to parse scorer configuration: ${cause.message}`, cause);
  }
}

/**
 * Transform frontend ScheduledScorer to backend ScorerConfig
 */
export function transformScheduledScorer(scorer: ScheduledScorer): ScorerConfig {
  const config: ScorerConfig = {
    name: scorer.name,
    serialized_scorer: '',
  };

  // Add sample_rate if provided (convert from percentage 0-100 to float 0-1)
  if (scorer.sampleRate !== undefined) {
    config.sample_rate = scorer.sampleRate / 100;
  }

  // Add filter_string if provided
  if (scorer.filterString) {
    config.filter_string = scorer.filterString;
  }

  // Common base for all serialized scorers
  const baseSerializedScorer = {
    mlflow_version: '3.3.2+ui', // Valid PyPI version with local version identifier to distinguish scorers created from UI
    serialization_version: 1,
  };

  // Build serialized_scorer based on scorer type
  if (scorer.type === 'llm') {
    const llmScorer = scorer as LLMScorer;

    if (llmScorer.is_instructions_judge) {
      if (!llmScorer.instructions) {
        throw new ScorerTransformationError('Instructions are required for instructions-based LLM scorers');
      }
      config.serialized_scorer = JSON.stringify({
        ...baseSerializedScorer,
        name: llmScorer.name,
        aggregations: [],
        builtin_scorer_class: null,
        builtin_scorer_pydantic_data: null,
        call_source: null,
        call_signature: null,
        original_func_name: null,
        instructions_judge_pydantic_data: {
          instructions: llmScorer.instructions || '',
          ...(llmScorer.model && { model: llmScorer.model }),
        },
      });
      config.custom = {};
    } else if (llmScorer.llmTemplate) {
      // Build pydantic data - common fields for all built-in scorers
      const pydanticData: any = {
        name: llmScorer.name,
        required_columns: ['outputs', 'inputs'],
      };

      // Add guidelines if this is a Guidelines scorer
      if (llmScorer.llmTemplate === LLM_TEMPLATE.GUIDELINES && llmScorer.guidelines) {
        pydanticData.guidelines = llmScorer.guidelines;
      }

      // Add model if specified
      if (llmScorer.model) {
        pydanticData.model = llmScorer.model;
      }

      config.serialized_scorer = JSON.stringify({
        ...baseSerializedScorer,
        name: llmScorer.name,
        builtin_scorer_class: llmScorer.llmTemplate,
        builtin_scorer_pydantic_data: pydanticData,
      });
      config.builtin = {
        name: llmScorer.name,
      };
    }
  } else if (scorer.type === 'custom-code') {
    const customCodeScorer = scorer as CustomCodeScorer;

    // For custom code scorers, we preserve the original serialized format
    // and only update the modifiable fields (sample_rate and filter_string)
    // The serialized_scorer should remain unchanged from the original
    config.serialized_scorer = JSON.stringify({
      ...baseSerializedScorer,
      name: customCodeScorer.name,
      call_source: customCodeScorer.code,
      call_signature: customCodeScorer.callSignature,
      original_func_name: customCodeScorer.originalFuncName,
    });
    config.custom = {}; // this is needed for custom scorers
  }

  return config;
}

/**
 * Convert registerScorer API response to ScorerConfig
 * Maps the response fields from the /api/3.0/mlflow/scorers/register endpoint to the ScorerConfig type.
 */
export function convertRegisterScorerResponseToConfig(response: RegisterScorerResponse): ScorerConfig {
  const config: ScorerConfig = {
    name: response.name,
    serialized_scorer: response.serialized_scorer,
    scorer_version: response.version,
  };

  // Check if this is a built-in scorer by parsing serialized_scorer
  try {
    const serializedData = JSON.parse(response.serialized_scorer);
    if (serializedData.builtin_scorer_class) {
      config.builtin = { name: response.name };
    }
  } catch {
    // If parsing fails, treat as non-builtin scorer
  }

  return config;
}

/**
 * Convert MLflowScorer from listScorers API response to ScorerConfig
 * Maps the response fields from the /api/3.0/mlflow/scorers/list endpoint to the ScorerConfig type.
 */
export function convertMLflowScorerToConfig(scorer: MLflowScorer): ScorerConfig {
  const config: ScorerConfig = {
    name: scorer.scorer_name,
    serialized_scorer: scorer.serialized_scorer,
    scorer_version: scorer.scorer_version,
  };

  // Check if this is a built-in scorer by parsing serialized_scorer
  try {
    const serializedData = JSON.parse(scorer.serialized_scorer);
    if (serializedData.builtin_scorer_class) {
      config.builtin = { name: scorer.scorer_name };
    }
  } catch {
    // If parsing fails, treat as non-builtin scorer
  }

  return config;
}

/**
 * Convert ScorerFormData to ScheduledScorer for API calls
 * Supports both creating new scorers and updating existing ones
 */
export function convertFormDataToScheduledScorer(
  formData: ScorerFormData,
  baseScorer?: ScheduledScorer,
): ScheduledScorer {
  // For new scorers, create base object from scratch
  if (!baseScorer) {
    const newScorer: ScheduledScorer = {
      name: formData.name,
      sampleRate: formData.sampleRate,
      filterString: formData.filterString || '',
      type: formData.scorerType,
    } as ScheduledScorer;

    if (formData.scorerType === 'llm') {
      const llmFormData = formData as LLMScorerFormData;
      const result = {
        ...newScorer,
        type: 'llm' as const,
        llmTemplate: llmFormData.llmTemplate as LLMTemplate,
        // Add guidelines if this is a Guidelines scorer
        guidelines:
          llmFormData.llmTemplate === LLM_TEMPLATE.GUIDELINES
            ? (llmFormData.guidelines || '')
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
            : undefined,
        // Add instructions for instructions judges (Custom, Safety, RelevanceToQuery)
        instructions: llmFormData.isInstructionsJudge ? llmFormData.instructions : undefined,
        // Add model for all LLM scorers
        model: llmFormData.model || undefined,
        is_instructions_judge: llmFormData.isInstructionsJudge,
      };
      return result;
    }
  }

  // For updating existing scorers - baseScorer is required for updates
  if (!baseScorer) {
    throw new ScorerTransformationError('Base scorer is required for updates');
  }

  // For code-based scorers, only sample rate and filter string can be updated
  if (baseScorer.type === 'custom-code' && formData.scorerType === 'custom-code') {
    const updatedScorer: CustomCodeScorer = {
      ...baseScorer,
      sampleRate: formData.sampleRate,
      filterString: formData.filterString || '',
      // Keep all other fields from baseScorer unchanged
    };
    return updatedScorer;
  }

  // For updating llm based scorers
  const updatedScorer: ScheduledScorer = {
    ...baseScorer,
    name: formData.name,
    sampleRate: formData.sampleRate,
    filterString: formData.filterString || '',
  };

  // Update LLM-specific fields if this is an LLM scorer
  if (baseScorer && baseScorer.type === 'llm' && formData.scorerType === 'llm') {
    const llmFormData = formData as LLMScorerFormData;
    (updatedScorer as LLMScorer).llmTemplate = llmFormData.llmTemplate as LLMTemplate;

    // Add guidelines if this is a Guidelines scorer
    if (llmFormData.llmTemplate === LLM_TEMPLATE.GUIDELINES) {
      (updatedScorer as LLMScorer).guidelines = (llmFormData.guidelines || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    }

    // Add instructions for instructions judges (Custom, Safety, RelevanceToQuery)
    if (llmFormData.isInstructionsJudge) {
      (updatedScorer as LLMScorer).instructions = llmFormData.instructions;
    }
    (updatedScorer as LLMScorer).is_instructions_judge = llmFormData.isInstructionsJudge;

    // Add model for all LLM scorers
    (updatedScorer as LLMScorer).model = llmFormData.model || undefined;
  }

  return updatedScorer;
}
```

--------------------------------------------------------------------------------

---[FILE: ExperimentTracesPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-traces/ExperimentTracesPage.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import invariant from 'invariant';
import { useParams } from '../../../common/utils/RoutingUtils';
import { ExperimentViewTraces } from '../../components/experiment-page/components/ExperimentViewTraces';

const ExperimentTracesPage = () => {
  const { experimentId } = useParams();
  invariant(experimentId, 'Experiment ID must be defined');

  const experimentIds = useMemo(() => [experimentId], [experimentId]);

  return <ExperimentViewTraces experimentIds={experimentIds} />;
};

export default ExperimentTracesPage;
```

--------------------------------------------------------------------------------

---[FILE: api.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/api.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { setupServer } from '../../../common/utils/setup-msw';
import { NotFoundError } from '@databricks/web-shared/errors';
import { rest } from 'msw';
import { RegisteredPromptsApi } from './api';
import { buildSearchFilterClause } from './utils';

describe('PromptsPage', () => {
  const server = setupServer();

  it('should properly return error when API responds with bare status', async () => {
    server.use(rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) => res(ctx.status(404))));

    const expectedMessage = new NotFoundError({}).message;

    await expect(RegisteredPromptsApi.listRegisteredPrompts()).rejects.toThrow(expectedMessage);
  });

  it('should properly return error with message extracted from API', async () => {
    server.use(
      rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) =>
        res(
          ctx.status(404),
          ctx.json({
            code: 'NOT_FOUND',
            message: 'Custom message: models not found',
          }),
        ),
      ),
    );

    await expect(RegisteredPromptsApi.listRegisteredPrompts()).rejects.toThrow('Custom message: models not found');
  });
});

describe('buildSearchFilterClause', () => {
  it('should return empty string when search filter is undefined', () => {
    expect(buildSearchFilterClause(undefined)).toBe('');
  });

  it('should return empty string when search filter is empty string', () => {
    expect(buildSearchFilterClause('')).toBe('');
  });

  it('should wrap simple text search in ILIKE pattern', () => {
    expect(buildSearchFilterClause('my-prompt')).toBe("name ILIKE '%my-prompt%'");
  });

  it('should treat filter with ILIKE as raw SQL filter', () => {
    expect(buildSearchFilterClause('name ILIKE "%test%"')).toBe('name ILIKE "%test%"');
  });

  it('should treat filter with LIKE as raw SQL filter', () => {
    expect(buildSearchFilterClause('name LIKE "test%"')).toBe('name LIKE "test%"');
  });

  it('should treat filter with equals sign as raw SQL filter', () => {
    expect(buildSearchFilterClause('tags.environment = "production"')).toBe('tags.environment = "production"');
  });

  it('should treat filter with not equals as raw SQL filter', () => {
    expect(buildSearchFilterClause('tags.status != "archived"')).toBe('tags.status != "archived"');
  });

  it('should be case insensitive for SQL keywords', () => {
    expect(buildSearchFilterClause('name ilike "%test%"')).toBe('name ilike "%test%"');
    expect(buildSearchFilterClause('name like "test%"')).toBe('name like "test%"');
  });

  it('should require whitespace before ILIKE/LIKE to avoid false positives', () => {
    expect(buildSearchFilterClause('prompt-ILIKE-test')).toBe("name ILIKE '%prompt-ILIKE-test%'");
    expect(buildSearchFilterClause('prompt-LIKE-test')).toBe("name ILIKE '%prompt-LIKE-test%'");
  });

  it('should handle complex SQL filters', () => {
    const complexFilter = 'name ILIKE "%prompt%" AND tags.env = "prod"';
    expect(buildSearchFilterClause(complexFilter)).toBe(complexFilter);
  });
});

describe('RegisteredPromptsApi.listRegisteredPrompts with experimentId', () => {
  const server = setupServer();

  it('should include experiment ID filter when experimentId is provided', async () => {
    const experimentId = '123';
    let capturedFilter = '';

    server.use(
      rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) => {
        capturedFilter = req.url.searchParams.get('filter') || '';
        return res(
          ctx.json({
            registered_models: [],
          }),
        );
      }),
    );

    await RegisteredPromptsApi.listRegisteredPrompts(undefined, undefined, experimentId);

    expect(capturedFilter).toContain("tags.`mlflow.prompt.is_prompt` = 'true'");
    expect(capturedFilter).toContain(`tags.\`_mlflow_experiment_ids\` ILIKE '%,${experimentId},%'`);
    expect(capturedFilter).toContain(' AND ');
  });

  it('should combine experiment ID filter with search filter', async () => {
    const experimentId = '456';
    const searchFilter = 'my-prompt';
    let capturedFilter = '';

    server.use(
      rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) => {
        capturedFilter = req.url.searchParams.get('filter') || '';
        return res(
          ctx.json({
            registered_models: [],
          }),
        );
      }),
    );

    await RegisteredPromptsApi.listRegisteredPrompts(searchFilter, undefined, experimentId);

    expect(capturedFilter).toContain("tags.`mlflow.prompt.is_prompt` = 'true'");
    expect(capturedFilter).toContain(`tags.\`_mlflow_experiment_ids\` ILIKE '%,${experimentId},%'`);
    expect(capturedFilter).toContain("name ILIKE '%my-prompt%'");
  });

  it('should not include experiment ID filter when experimentId is not provided', async () => {
    let capturedFilter = '';

    server.use(
      rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) => {
        capturedFilter = req.url.searchParams.get('filter') || '';
        return res(
          ctx.json({
            registered_models: [],
          }),
        );
      }),
    );

    await RegisteredPromptsApi.listRegisteredPrompts();

    expect(capturedFilter).toContain("tags.`mlflow.prompt.is_prompt` = 'true'");
    expect(capturedFilter).not.toContain('_mlflow_experiment_ids');
  });
});

describe('RegisteredPromptsApi.createRegisteredPrompt with additionalTags', () => {
  const server = setupServer();

  it('should include additional tags when creating a prompt', async () => {
    let capturedBody: any = null;

    server.use(
      rest.post('/ajax-api/2.0/mlflow/registered-models/create', async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.json({}));
      }),
    );

    const additionalTags = [{ key: '_mlflow_experiment_ids', value: ',789,' }];
    await RegisteredPromptsApi.createRegisteredPrompt('test-prompt', additionalTags);

    expect(capturedBody.name).toBe('test-prompt');
    expect(capturedBody.tags).toEqual(
      expect.arrayContaining([
        { key: 'mlflow.prompt.is_prompt', value: 'true' },
        { key: '_mlflow_experiment_ids', value: ',789,' },
      ]),
    );
  });

  it('should only include default tag when no additional tags provided', async () => {
    let capturedBody: any = null;

    server.use(
      rest.post('/ajax-api/2.0/mlflow/registered-models/create', async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.json({}));
      }),
    );

    await RegisteredPromptsApi.createRegisteredPrompt('test-prompt');

    expect(capturedBody.name).toBe('test-prompt');
    expect(capturedBody.tags).toEqual([{ key: 'mlflow.prompt.is_prompt', value: 'true' }]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/api.ts

```typescript
import { matchPredefinedError, UnknownError } from '@databricks/web-shared/errors';
import { fetchEndpoint } from '../../../common/utils/FetchUtils';
import type { RegisteredPrompt, RegisteredPromptsListResponse, RegisteredPromptVersion } from './types';
import {
  IS_PROMPT_TAG_NAME,
  IS_PROMPT_TAG_VALUE,
  REGISTERED_PROMPT_SOURCE_RUN_IDS,
  PROMPT_EXPERIMENT_IDS_TAG_KEY,
  buildSearchFilterClause,
} from './utils';

const defaultErrorHandler = async ({
  reject,
  response,
  err: originalError,
}: {
  reject: (cause: any) => void;
  response: Response;
  err: Error;
}) => {
  // Try to match the error to one of the predefined errors
  const predefinedError = matchPredefinedError(response);
  const error = predefinedError instanceof UnknownError ? originalError : predefinedError;
  if (response) {
    try {
      // Try to extract exact error message from the response
      const messageFromResponse = (await response.json())?.message;
      if (messageFromResponse) {
        error.message = messageFromResponse;
      }
    } catch {
      // If we fail to extract the message, we will keep the original error message
    }
  }

  reject(error);
};

export const RegisteredPromptsApi = {
  listRegisteredPrompts: (searchFilter?: string, pageToken?: string, experimentId?: string) => {
    const params = new URLSearchParams();
    const searchClause = buildSearchFilterClause(searchFilter);

    // Build filter for prompts, optionally filtered by experiment ID
    let filter = `tags.\`${IS_PROMPT_TAG_NAME}\` = '${IS_PROMPT_TAG_VALUE}'`;

    if (experimentId) {
      // Filter by experiment ID using ILIKE to match comma-separated list
      filter += ` AND tags.\`${PROMPT_EXPERIMENT_IDS_TAG_KEY}\` ILIKE '%,${experimentId},%'`;
    }

    if (searchClause) {
      filter += ` AND ${searchClause}`;
    }

    if (pageToken) {
      params.append('page_token', pageToken);
    }

    params.append('filter', filter);

    const relativeUrl = ['ajax-api/2.0/mlflow/registered-models/search', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<RegisteredPromptsListResponse>;
  },
  setRegisteredPromptTag: (promptName: string, key: string, value: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/registered-models/set-tag',
      method: 'POST',
      body: JSON.stringify({ key, value, name: promptName }),
      error: defaultErrorHandler,
    });
  },
  deleteRegisteredPromptTag: (promptName: string, key: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/registered-models/delete-tag',
      method: 'DELETE',
      body: JSON.stringify({ key, name: promptName }),
      error: defaultErrorHandler,
    });
  },
  createRegisteredPrompt: (promptName: string, additionalTags: { key: string; value: string }[] = []) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/registered-models/create',
      method: 'POST',
      body: JSON.stringify({
        name: promptName,
        tags: [
          {
            key: IS_PROMPT_TAG_NAME,
            value: IS_PROMPT_TAG_VALUE,
          },
          ...additionalTags,
        ],
      }),
      error: defaultErrorHandler,
    }) as Promise<{
      registered_model?: RegisteredPrompt;
    }>;
  },
  createRegisteredPromptVersion: (
    promptName: string,
    tags: { key: string; value: string }[] = [],
    description?: string,
  ) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/model-versions/create',
      method: 'POST',
      body: JSON.stringify({
        name: promptName,
        description,
        // Put a placeholder source here for now to satisfy the API validation
        // TODO: remove source after it's no longer needed
        source: 'dummy-source',
        tags: [
          {
            key: IS_PROMPT_TAG_NAME,
            value: IS_PROMPT_TAG_VALUE,
          },
          ...tags,
        ],
      }),
      error: defaultErrorHandler,
    }) as Promise<{
      model_version?: RegisteredPromptVersion;
    }>;
  },
  setRegisteredPromptVersionTag: (promptName: string, promptVersion: string, key: string, value: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/model-versions/set-tag',
      method: 'POST',
      body: JSON.stringify({ key, value, name: promptName, version: promptVersion }),
      error: defaultErrorHandler,
    });
  },
  deleteRegisteredPromptVersionTag: (promptName: string, promptVersion: string, key: string) => {
    fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/model-versions/delete-tag',
      method: 'DELETE',
      body: JSON.stringify({ key, name: promptName, version: promptVersion }),
      error: defaultErrorHandler,
    });
  },
  getPromptDetails: (promptName: string) => {
    const params = new URLSearchParams();
    params.append('name', promptName);
    const relativeUrl = ['ajax-api/2.0/mlflow/registered-models/get', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<{
      registered_model: RegisteredPrompt;
    }>;
  },
  getPromptVersions: (promptName: string) => {
    const params = new URLSearchParams();
    params.append('filter', `name='${promptName}' AND tags.\`${IS_PROMPT_TAG_NAME}\` = '${IS_PROMPT_TAG_VALUE}'`);
    const relativeUrl = ['ajax-api/2.0/mlflow/model-versions/search', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<{
      model_versions?: RegisteredPromptVersion[];
    }>;
  },
  getPromptVersionsForRun: (runUuid: string) => {
    const params = new URLSearchParams();
    params.append(
      'filter',
      `tags.\`${IS_PROMPT_TAG_NAME}\` = '${IS_PROMPT_TAG_VALUE}' AND tags.\`${REGISTERED_PROMPT_SOURCE_RUN_IDS}\` ILIKE "%${runUuid}%"`,
    );
    const relativeUrl = ['ajax-api/2.0/mlflow/model-versions/search', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<{
      model_versions?: RegisteredPromptVersion[];
    }>;
  },
  deleteRegisteredPrompt: (promptName: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/registered-models/delete',
      method: 'DELETE',
      body: JSON.stringify({ name: promptName }),
      error: defaultErrorHandler,
    });
  },
  deleteRegisteredPromptVersion: (promptName: string, version: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/2.0/mlflow/model-versions/delete',
      method: 'DELETE',
      body: JSON.stringify({ name: promptName, version }),
      error: defaultErrorHandler,
    });
  },
};
```

--------------------------------------------------------------------------------

---[FILE: diff.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/diff.ts

```typescript
import { diffWords } from 'diff';

export { diffWords };
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPromptDetailsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/ExperimentPromptDetailsPage.tsx

```typescript
import invariant from 'invariant';
import { useParams } from '../../../common/utils/RoutingUtils';
import PromptsDetailsPage from './PromptsDetailsPage';

const ExperimentPromptDetailsPage = () => {
  const { experimentId } = useParams();
  invariant(experimentId, 'Experiment ID must be defined');

  return <PromptsDetailsPage experimentId={experimentId} />;
};

export default ExperimentPromptDetailsPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPromptsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/ExperimentPromptsPage.tsx

```typescript
import invariant from 'invariant';
import { useParams } from '../../../common/utils/RoutingUtils';
import PromptsPage from './PromptsPage';

const ExperimentPromptsPage = () => {
  const { experimentId } = useParams();
  invariant(experimentId, 'Experiment ID must be defined');

  return <PromptsPage experimentId={experimentId} />;
};

export default ExperimentPromptsPage;
```

--------------------------------------------------------------------------------

---[FILE: PromptsDetailsPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/PromptsDetailsPage.test.tsx

```typescript
/* eslint-disable jest/no-standalone-expect */
import { jest, describe, beforeAll, it, expect, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { render, screen, waitFor, within } from '@testing-library/react';
import { setupServer } from '../../../common/utils/setup-msw';
import { IntlProvider } from 'react-intl';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import PromptsDetailsPage from './PromptsDetailsPage';
import {
  getFailedRegisteredPromptDetailsResponse,
  getMockedRegisteredPromptDeleteResponse,
  getMockedRegisteredPromptDetailsResponse,
  getMockedRegisteredPromptSetTagsResponse,
  getMockedRegisteredPromptSourceRunResponse,
  getMockedRegisteredPromptVersionsResponse,
  getMockedRegisteredPromptCreateVersionResponse,
} from './test-utils';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';
import { getTableRowByCellText } from '@databricks/design-system/test-utils/rtl';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // increase timeout due to heavier use of tables, modals and forms

describe('PromptsDetailsPage', () => {
  const server = setupServer(
    getMockedRegisteredPromptDetailsResponse('prompt1'),
    getMockedRegisteredPromptVersionsResponse('prompt1', 2),
  );

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  const renderTestComponent = () => {
    const queryClient = new QueryClient();
    render(<PromptsDetailsPage />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <MockedReduxStoreProvider>
              <TestRouter
                routes={[
                  testRoute(
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
                    '/prompt/:promptName',
                  ),
                  testRoute(<div />, '*'),
                ]}
                initialEntries={['/prompt/prompt1']}
              />
            </MockedReduxStoreProvider>
          </DesignSystemProvider>
        </IntlProvider>
      ),
    });
  };
  it('should render basic prompt details', async () => {
    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    expect(screen.getByRole('status', { name: 'some_tag' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'some_version_tag' })).toBeInTheDocument();
  });

  it("should preview prompt versions' contents, aliases and commit message", async () => {
    server.use(getMockedRegisteredPromptVersionsResponse('prompt1', 2));
    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('radio', { name: 'Preview' }));

    await userEvent.click(screen.getByText('Version 2'));
    expect(screen.getByText('content for prompt version 2')).toBeInTheDocument();
    expect(screen.getAllByRole('status', { name: 'alias2' })).toHaveLength(2);
    expect(screen.getByText('some commit message for version 2')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Version 1'));
    expect(screen.getByText('content of prompt version 1')).toBeInTheDocument();
    expect(screen.getAllByRole('status', { name: 'alias1' })).toHaveLength(2);
    expect(screen.getByText('some commit message for version 1')).toBeInTheDocument();
  });

  test("should compare prompt versions' contents", async () => {
    server.use(getMockedRegisteredPromptVersionsResponse('prompt1', 3));

    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('radio', { name: 'Compare' }));

    const table = screen.getByLabelText('Prompt versions table');

    const rowForVersion3 = getTableRowByCellText(table, 'Version 3', { columnHeaderName: 'Version' });
    const rowForVersion2 = getTableRowByCellText(table, 'Version 2', { columnHeaderName: 'Version' });

    await userEvent.click(within(rowForVersion3).getByLabelText('Select as baseline version'));
    await userEvent.click(within(rowForVersion2).getByLabelText('Select as compared version'));

    // Mocked data contains following content for versions:
    // Version 1: content of prompt version 1
    // Version 2: content for prompt version 2

    // We set up expected diffs and assert that they are displayed correctly:
    const diffByWord = [['text', 'content'], ' ', ['of', 'for'], ' prompt version ', ['3', '2']].flat().join('');
    expect(document.body).toHaveTextContent(diffByWord);

    // Switch sides and expect the diff to change:
    await userEvent.click(screen.getByLabelText('Switch sides'));
    const diffByWordSwitched = [['content', 'text'], ' ', ['for', 'of'], ' prompt version ', ['2', '3']]
      .flat()
      .join('');
    expect(document.body).toHaveTextContent(diffByWordSwitched);
  });

  it('should edit tags', async () => {
    const setTagSpy = jest.fn();
    server.use(getMockedRegisteredPromptSetTagsResponse(setTagSpy));

    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Edit tags')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Edit tags'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('combobox'), 'new_tag');
    await userEvent.click(screen.getByText('Add tag "new_tag"'));

    await userEvent.type(screen.getByPlaceholderText('Type a value'), 'new_value');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByText('Save tags'));

    await waitFor(() => {
      expect(setTagSpy).toHaveBeenCalledWith({ key: 'new_tag', value: 'new_value', name: 'prompt1' });
    });
  });

  it('should delete the prompt', async () => {
    const deletePromptSpy = jest.fn();
    server.use(getMockedRegisteredPromptDeleteResponse(deletePromptSpy));

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText('More actions'));
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deletePromptSpy).toHaveBeenCalledWith({ name: 'prompt1' });
    });
  });

  it('should create a new chat prompt version', async () => {
    const createVersionSpy = jest.fn();
    server.use(getMockedRegisteredPromptCreateVersionResponse(createVersionSpy));

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Create prompt version' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('radio', { name: 'Chat' }));

    const firstContent = document.querySelector('textarea[name="chatMessages.0.content"]') as HTMLTextAreaElement;
    await userEvent.type(firstContent, 'Hello');
    await userEvent.click(screen.getAllByRole('button', { name: 'Add message' })[0]);
    await userEvent.clear(screen.getAllByPlaceholderText('role')[1]);
    await userEvent.type(screen.getAllByPlaceholderText('role')[1], 'assistant');
    const secondContent = document.querySelector('textarea[name="chatMessages.1.content"]') as HTMLTextAreaElement;
    await userEvent.type(secondContent, 'Hi!');
    await userEvent.type(screen.getByLabelText('Commit message (optional):'), 'commit message');
    await userEvent.click(screen.getByText('Create'));

    const expectedMessages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi!' },
    ];

    await waitFor(() => {
      expect(createVersionSpy).toHaveBeenCalled();
    });

    const payload = createVersionSpy.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: 'prompt1',
      description: 'commit message',
    });
    expect((payload as any).tags).toEqual(
      expect.arrayContaining([
        { key: 'mlflow.prompt.is_prompt', value: 'true' },
        { key: 'mlflow.prompt.text', value: JSON.stringify(expectedMessages) },
        { key: '_mlflow_prompt_type', value: 'chat' },
      ]),
    );
  });

  it('should display table and react to change page mode', async () => {
    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'prompt1' })).toBeInTheDocument();
    });

    expect(screen.getByText('Version 2')).toBeInTheDocument();
    expect(screen.getByText('Version 1')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Preview' }));
    expect(screen.queryByRole('columnheader', { name: 'Registered at' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Compare' }));
    expect(screen.queryByRole('columnheader', { name: 'Registered at' })).not.toBeInTheDocument();
  });

  it('should display 404 UI component upon showstopper failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(getFailedRegisteredPromptDetailsResponse(404));

    renderTestComponent();
    expect(await screen.findByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: "Prompt name 'prompt1' does not exist, go back to the home page." }),
    ).toBeInTheDocument();
    jest.restoreAllMocks();
  });
});
```

--------------------------------------------------------------------------------

````
