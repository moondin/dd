---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 572
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 572 of 991)

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

---[FILE: EvaluationArtifactService.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/EvaluationArtifactService.test.ts

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { EvaluationTableParseError, fetchEvaluationTableArtifact } from './EvaluationArtifactService';

const mockGetArtifactChunkedText = jest.fn();

jest.mock('../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../common/utils/ArtifactUtils')>('../../common/utils/ArtifactUtils'),
  getArtifactChunkedText: () => mockGetArtifactChunkedText(),
}));

describe('fetchEvaluationTableArtifact', () => {
  const MOCK_RESPONSE = {
    columns: ['inputs', 'outputs', 'targets'],
    data: [
      ['Input A', 'Output A', 'Prompt A'],
      ['Input B', 'Output B', 'Prompt B'],
      ['Input C', 'Output C', 'Prompt C'],
    ],
  };
  const mockResponse = (response: Partial<typeof MOCK_RESPONSE>) =>
    mockGetArtifactChunkedText.mockImplementation(() => Promise.resolve(JSON.stringify(response)));

  beforeEach(() => {
    mockResponse(MOCK_RESPONSE);
  });

  it('correctly fetches and parses data', async () => {
    const result = await fetchEvaluationTableArtifact('run_1', '/some/artifact');
    expect(result.entries).toHaveLength(3);
    expect(result.entries.map(({ inputs }) => inputs)).toEqual(['Input A', 'Input B', 'Input C']);
    expect(result.entries.map(({ outputs }) => outputs)).toEqual(['Output A', 'Output B', 'Output C']);
    expect(result.entries.map(({ targets }) => targets)).toEqual(['Prompt A', 'Prompt B', 'Prompt C']);
  });

  it('fails on malformed response without columns field', async () => {
    mockResponse({ data: [] });
    await expect(fetchEvaluationTableArtifact('run_1', '/some/artifact')).rejects.toThrow(
      /does not contain "columns" field/,
    );
  });

  it('fails on malformed response without data field', async () => {
    mockResponse({ columns: [] });
    await expect(fetchEvaluationTableArtifact('run_1', '/some/artifact')).rejects.toThrow(
      /does not contain "data" field/,
    );
  });

  it('fails with specific error on non-JSON response', async () => {
    mockGetArtifactChunkedText.mockImplementation(() => Promise.resolve('[[[[[some invalid json{{'));

    await expect(fetchEvaluationTableArtifact('run_1', '/some/artifact')).rejects.toThrow(EvaluationTableParseError);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationArtifactService.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/EvaluationArtifactService.ts

```typescript
import { getArtifactChunkedText, getArtifactLocationUrl } from '../../common/utils/ArtifactUtils';
import type { EvaluationArtifactTable, EvaluationArtifactTableEntry } from '../types';

// Reflects structure logged by mlflow.log_table()
export interface RawEvaluationArtifact {
  columns: string[];
  data: (string | number | null | boolean | Record<string, any>)[][];
}

export class EvaluationTableParseError extends Error {}

/**
 * Service function that fetches and parses evaluation artifact table.
 */
export const fetchEvaluationTableArtifact = async (
  runUuid: string,
  artifactPath: string,
): Promise<EvaluationArtifactTable> => {
  const fullArtifactSrcPath = getArtifactLocationUrl(artifactPath, runUuid);

  return getArtifactChunkedText(fullArtifactSrcPath)
    .then((artifactContent) => {
      try {
        return JSON.parse(artifactContent);
      } catch {
        throw new EvaluationTableParseError(`Artifact ${artifactPath} is malformed and/or not valid JSON`);
      }
    })
    .then((data) => parseEvaluationTableArtifact(artifactPath, data));
};

export const parseEvaluationTableArtifact = (
  path: string,
  rawEvaluationArtifact: RawEvaluationArtifact,
): EvaluationArtifactTable => {
  const { columns, data } = rawEvaluationArtifact;
  if (!columns) {
    throw new SyntaxError(`Artifact ${path} is malformed, it does not contain "columns" field`);
  }
  if (!data) {
    throw new SyntaxError(`Artifact ${path} is malformed, it does not contain "data" field`);
  }
  const columnsToIndex = columns.reduce<Record<string, number>>(
    (currentMap, columnName, index) => ({
      ...currentMap,
      [columnName]: index,
    }),
    {},
  );

  const entries: EvaluationArtifactTableEntry[] = [];
  for (const rawDataEntry of data) {
    const entry: EvaluationArtifactTableEntry = {};
    for (const column of columns) {
      entry[column] = rawDataEntry[columnsToIndex[column]];
    }
    entries.push(entry);
  }
  return {
    columns,
    path,
    entries,
    rawArtifactFile: rawEvaluationArtifact,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: FieldNameTransformers.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/FieldNameTransformers.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  transformGetRunResponse,
  transformSearchRunsResponse,
  transformSearchExperimentsResponse,
} from './FieldNameTransformers';

describe('transformSearchRunsResponse', () => {
  it('transforms the search runs response', () => {
    const snakeCaseResponse = {
      runs: [
        {
          info: {
            experiment_id: '1',
            artifact_uri: '/something',
            run_name: 'Run abc',
            run_uuid: '123',
            status: 'ACTIVE',
          },
          inputs: {
            model_inputs: [
              {
                model_id: 'm-1',
              },
            ],
            dataset_inputs: [
              {
                dataset: {
                  name: 'dataset',
                  digest: '608a286f',
                  source_type: 'code',
                  source: '{}',
                  profile: '{}',
                },
              },
            ],
          },
          outputs: {
            model_outputs: [
              {
                model_id: 'm-2',
              },
            ],
          },
        },
        {
          info: {
            experiment_id: '2',
            artifact_uri: '/something_else',
            run_name: 'Run xyz',
            run_uuid: '124',
            status: 'ACTIVE',
          },
        },
      ],
    };

    const transformedResponse = transformSearchRunsResponse(snakeCaseResponse);

    expect(transformedResponse).toEqual({
      runs: [
        {
          info: expect.objectContaining({
            experimentId: '1',
            artifactUri: '/something',
            runName: 'Run abc',
            runUuid: '123',
            status: 'ACTIVE',
          }),
          inputs: expect.objectContaining({
            modelInputs: [
              expect.objectContaining({
                modelId: 'm-1',
              }),
            ],
            datasetInputs: [
              expect.objectContaining({
                dataset: expect.objectContaining({
                  name: 'dataset',
                }),
              }),
            ],
          }),
          outputs: expect.objectContaining({
            modelOutputs: [
              expect.objectContaining({
                modelId: 'm-2',
              }),
            ],
          }),
        },
        {
          info: expect.objectContaining({
            experimentId: '2',
            artifactUri: '/something_else',
            runName: 'Run xyz',
            runUuid: '124',
            status: 'ACTIVE',
          }),
        },
      ],
    });
  });

  it('returns the response if it is invalid', () => {
    const response = null;

    const transformedResponse = transformSearchRunsResponse(response);

    expect(transformedResponse).toBeNull();
  });
});

describe('transformGetRunResponse', () => {
  it('transforms the get run response', () => {
    const originalResponse = {
      run: {
        info: {
          experiment_id: '1',
          artifact_uri: '/something',
          run_name: 'Run abc',
          run_uuid: '123',
          status: 'ACTIVE',
        },
      },
    };

    const transformedResponse = transformGetRunResponse(originalResponse);

    expect(transformedResponse).toEqual({
      run: {
        info: expect.objectContaining({
          experimentId: '1',
          artifactUri: '/something',
          runName: 'Run abc',
          runUuid: '123',
          status: 'ACTIVE',
        }),
      },
    });
  });

  it('returns the response if it is invalid', () => {
    const originalResponse = null;

    const transformedResponse = transformGetRunResponse(originalResponse);

    expect(transformedResponse).toBeNull();
  });
});

describe('transformSearchExperimentsResponse', () => {
  it('transforms the search experiments response', () => {
    const originalResponse = {
      experiments: [
        {
          experiment_id: '1',
          name: 'Experiment 1',
          lifecycle_stage: 'active',
        },
        {
          experiment_id: '2',
          name: 'Experiment 2',
          lifecycle_stage: 'deleted',
        },
      ],
    };

    const transformedResponse = transformSearchExperimentsResponse(originalResponse);

    expect(transformedResponse).toEqual({
      experiments: [
        expect.objectContaining({
          experimentId: '1',
          name: 'Experiment 1',
          lifecycleStage: 'active',
        }),
        expect.objectContaining({
          experimentId: '2',
          name: 'Experiment 2',
          lifecycleStage: 'deleted',
        }),
      ],
    });
  });

  it('returns the response if it is invalid', () => {
    const originalResponse = null;

    const transformedResponse = transformSearchExperimentsResponse(originalResponse);

    expect(transformedResponse).toBeNull();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: FieldNameTransformers.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/FieldNameTransformers.ts

```typescript
import type {
  ExperimentEntity,
  GetRunApiResponse,
  RunInfoEntity,
  SearchRunsApiResponse,
  GetExperimentApiResponse,
  SearchExperimentsApiResponse,
  RunDatasetWithTags,
  RunEntity,
  RunModelEntity,
} from '../types';

const transformRunInfoEntity = (snakeCaseRunInfoEntity: any): RunInfoEntity => ({
  ...snakeCaseRunInfoEntity,
  artifactUri: snakeCaseRunInfoEntity.artifact_uri,
  endTime: snakeCaseRunInfoEntity.end_time,
  experimentId: snakeCaseRunInfoEntity.experiment_id,
  lifecycleStage: snakeCaseRunInfoEntity.lifecycle_stage,
  runUuid: snakeCaseRunInfoEntity.run_uuid,
  runName: snakeCaseRunInfoEntity.run_name,
  startTime: snakeCaseRunInfoEntity.start_time,
});

const transformDatasetInputEntity = (snakeCaseDatasetInputEntity: any): RunDatasetWithTags => {
  if (!snakeCaseDatasetInputEntity || !snakeCaseDatasetInputEntity.dataset) {
    return snakeCaseDatasetInputEntity;
  }
  return {
    ...snakeCaseDatasetInputEntity,
    dataset: {
      ...snakeCaseDatasetInputEntity.dataset,
      sourceType: snakeCaseDatasetInputEntity.dataset.source_type,
    },
  };
};

const transformModelEntity = (snakeCaseModelEntity: any): RunModelEntity => {
  return {
    modelId: snakeCaseModelEntity.model_id,
  };
};

const transformRunInputsEntity = (snakeCaseInputsData: any): RunEntity['inputs'] => {
  if (!snakeCaseInputsData) {
    return snakeCaseInputsData;
  }

  const datasetInputs = snakeCaseInputsData.dataset_inputs
    ?.map((input: any) => transformDatasetInputEntity(input))
    .filter(Boolean);

  const modelInputs = snakeCaseInputsData.model_inputs
    ?.map((input: any) => transformModelEntity(input))
    .filter(Boolean);

  return {
    ...(datasetInputs?.length ? { datasetInputs } : {}),
    ...(modelInputs?.length ? { modelInputs } : {}),
  };
};

const transformRunOutputsEntity = (snakeCaseOutputsData: any): RunEntity['outputs'] => {
  if (!snakeCaseOutputsData) {
    return snakeCaseOutputsData;
  }

  const modelOutputs = snakeCaseOutputsData.model_outputs
    ?.map((output: any) => transformModelEntity(output))
    .filter(Boolean);

  return {
    ...(modelOutputs?.length ? { modelOutputs } : {}),
  };
};

const transformExperimentEntity = (snakeCaseExperimentEntity: any): Omit<ExperimentEntity, 'allowedActions'> => ({
  ...snakeCaseExperimentEntity,
  artifactLocation: snakeCaseExperimentEntity.artifact_location,
  creationTime: snakeCaseExperimentEntity.creation_time,
  experimentId: snakeCaseExperimentEntity.experiment_id,
  lastUpdateTime: snakeCaseExperimentEntity.last_update_time,
  lifecycleStage: snakeCaseExperimentEntity.lifecycle_stage,
  tags: snakeCaseExperimentEntity.tags ?? [],
});

export const transformGetRunResponse = (originalResponse: any): GetRunApiResponse => {
  if (!originalResponse || !originalResponse.run || !originalResponse.run.info) {
    return originalResponse;
  }
  return {
    ...originalResponse,
    run: {
      ...originalResponse.run,
      info: transformRunInfoEntity(originalResponse.run.info),
      inputs: transformRunInputsEntity(originalResponse.run.inputs),
    },
  };
};

export const transformSearchRunsResponse = (originalResponse: any): SearchRunsApiResponse => {
  if (!originalResponse || !originalResponse.runs) {
    return originalResponse;
  }

  return {
    ...originalResponse,
    runs: originalResponse.runs.map((run: any) => ({
      ...run,
      info: transformRunInfoEntity(run.info),
      inputs: transformRunInputsEntity(run.inputs),
      outputs: transformRunOutputsEntity(run.outputs),
    })),
  };
};

export const transformSearchExperimentsResponse = (originalResponse: any): SearchExperimentsApiResponse => {
  if (!originalResponse || !originalResponse.experiments) {
    return originalResponse;
  }
  return {
    ...originalResponse,
    experiments: originalResponse.experiments.map((experiment: any) => transformExperimentEntity(experiment)),
  };
};

export const transformGetExperimentResponse = (originalResponse: any): GetExperimentApiResponse => {
  if (!originalResponse || !originalResponse.experiment) {
    return originalResponse;
  }
  return {
    ...originalResponse,
    experiment: transformExperimentEntity(originalResponse.experiment),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: MlflowEnums.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/MlflowEnums.ts

```typescript
/**
 * DO NOT EDIT!!!
 *
 * @NOTE(dli) 01-12-2017
 *   This file is generated. For now, it is a snapshot of the proto enums as of
 *   Sep 17, 2018 6:47:39 PM. We will update the generation pipeline to actually
 *   place these generated enums in the correct location shortly.
 */

export enum SourceType {
  NOTEBOOK = 'NOTEBOOK',
  JOB = 'JOB',
  PROJECT = 'PROJECT',
  LOCAL = 'LOCAL',
  UNKNOWN = 'UNKNOWN',
}

export const ViewType = {
  ACTIVE_ONLY: 'ACTIVE_ONLY',
  DELETED_ONLY: 'DELETED_ONLY',
  ALL: 'ALL',
};
export enum ModelGatewayRouteTask {
  LLM_V1_COMPLETIONS = 'llm/v1/completions',
  LLM_V1_CHAT = 'llm/v1/chat',
  LLM_V1_EMBEDDINGS = 'llm/v1/embeddings',
}
```

--------------------------------------------------------------------------------

---[FILE: MlflowLocalStorageMessages.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/MlflowLocalStorageMessages.test.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { test, expect } from '@jest/globals';
import { ExperimentPagePersistedState } from './MlflowLocalStorageMessages';

test('Local storage messages ignore unknown fields', () => {
  const persistedState = ExperimentPagePersistedState({ heyYallImAnUnknownField: 'value' });
  expect((persistedState as any).searchInput).toEqual('');
});
```

--------------------------------------------------------------------------------

---[FILE: MlflowLocalStorageMessages.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/MlflowLocalStorageMessages.ts

```typescript
/**
 * This class contains definitions of message entities corresponding to data stored in LocalStorage.
 * The backwards-compatibility behavior of these messages is as follows:
 *
 * Backwards-compatible changes:
 * 1) Adding a new field: Backwards-compatible. New fields that are absent from old data in
 *    local storage will take on the specified default value.
 * 2) Removing a field: Backwards-compatible. Unknown fields from old data in local storage will be
 *    ignored at construction-time.
 *
 * Backwards-incompatible changes (AVOID MAKING SUCH CHANGES):
 * 1) Changing the type of a field. Old data loaded from local storage will be of the wrong type.
 * 2) Changing the role/usage of a field. It's better to add a new field than to repurpose an
 *    existing field, since a repurposed field may be populated with unexpected data cached in
 *    local storage.
 */
import Immutable from 'immutable';
import {
  DEFAULT_CATEGORIZED_UNCHECKED_KEYS,
  DEFAULT_DIFF_SWITCH_SELECTED,
  DEFAULT_ORDER_BY_KEY,
  DEFAULT_ORDER_BY_ASC,
  DEFAULT_START_TIME,
  DEFAULT_LIFECYCLE_FILTER,
  DEFAULT_MODEL_VERSION_FILTER,
} from '../constants';

/**
 * This class wraps attributes of the ExperimentPage component's state that should be
 * persisted in / restored from local storage.
 */
export const ExperimentPagePersistedState = Immutable.Record(
  {
    // SQL-like query string used to filter runs, e.g. "params.alpha = '0.5'"
    searchInput: '',
    // Canonical order_by key like "params.`alpha`". May be null to indicate the table
    // should use the natural row ordering provided by the server.
    orderByKey: DEFAULT_ORDER_BY_KEY,
    // Whether the order imposed by orderByKey should be ascending or descending.
    orderByAsc: DEFAULT_ORDER_BY_ASC,
    // Filter key to show results based on start time
    startTime: DEFAULT_START_TIME,
    // Lifecycle filter of runs to display
    lifecycleFilter: DEFAULT_LIFECYCLE_FILTER,
    // Filter of model versions to display
    modelVersionFilter: DEFAULT_MODEL_VERSION_FILTER,
    // Unchecked keys in the columns dropdown
    categorizedUncheckedKeys: DEFAULT_CATEGORIZED_UNCHECKED_KEYS,
    // Switch to select only columns with differences
    diffSwitchSelected: DEFAULT_DIFF_SWITCH_SELECTED,
    // Columns unselected before turning on the diff-view switch
    preSwitchCategorizedUncheckedKeys: DEFAULT_CATEGORIZED_UNCHECKED_KEYS,
    // Columns unselected as the result of turning on the diff-view switch
    postSwitchCategorizedUncheckedKeys: DEFAULT_CATEGORIZED_UNCHECKED_KEYS,
  },
  'ExperimentPagePersistedState',
);
```

--------------------------------------------------------------------------------

````
