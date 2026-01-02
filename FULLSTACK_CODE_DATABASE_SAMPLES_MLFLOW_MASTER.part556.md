---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 556
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 556 of 991)

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

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/types.ts

```typescript
interface ScheduledScorerBase {
  name: string;
  sampleRate?: number; // Percentage between 0 and 100
  filterString?: string;
  type: 'llm' | 'custom-code';
  version?: number;
  // Whether the UI disables monitoring for this scorer. If disabled, the UI
  // will not show the form fields for monitoring (sample rate, filter string, etc.)
  disableMonitoring?: boolean;
}

// LLM Template Constants
export const LLM_TEMPLATE = {
  CORRECTNESS: 'Correctness',
  GUIDELINES: 'Guidelines',
  RELEVANCE_TO_QUERY: 'RelevanceToQuery',
  RETRIEVAL_GROUNDEDNESS: 'RetrievalGroundedness',
  RETRIEVAL_RELEVANCE: 'RetrievalRelevance',
  RETRIEVAL_SUFFICIENCY: 'RetrievalSufficiency',
  SAFETY: 'Safety',
  CUSTOM: 'Custom',
} as const;

export type LLMTemplate =
  | 'Correctness'
  | 'Guidelines'
  | 'RelevanceToQuery'
  | 'RetrievalGroundedness'
  | 'RetrievalRelevance'
  | 'RetrievalSufficiency'
  | 'Safety'
  | 'Custom';

export interface LLMScorer extends ScheduledScorerBase {
  type: 'llm';
  llmTemplate?: LLMTemplate;
  guidelines?: string[];
  instructions?: string;
  model?: string;
  // True if the scorer is an instructions-based LLM scorer that uses instructions_judge_pydantic_data
  // rather than builtin_scorer_pydantic_data.
  is_instructions_judge?: boolean;
}

export interface CustomCodeScorer extends ScheduledScorerBase {
  type: 'custom-code';
  code: string;
  callSignature: string;
  originalFuncName: string;
}

export type ScheduledScorer = LLMScorer | CustomCodeScorer;

export type ScorerConfig = {
  name: string;
  serialized_scorer: string;
  builtin?: {
    name: string;
  };
  custom?: Record<string, unknown>;
  sample_rate?: number;
  filter_string?: string;
  scorer_version?: number;
};
```

--------------------------------------------------------------------------------

````
