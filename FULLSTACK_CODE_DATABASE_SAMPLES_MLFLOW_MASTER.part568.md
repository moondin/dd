---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 568
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 568 of 991)

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

---[FILE: useUpdatePromptVersionMetadataModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useUpdatePromptVersionMetadataModal.tsx
Signals: React

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useEditKeyValueTagsModal } from '../../../../common/hooks/useEditKeyValueTagsModal';
import { RegisteredPromptsApi } from '../api';
import type { RegisteredPromptVersion } from '../types';
import { useCallback } from 'react';
import { diffCurrentAndNewTags, isUserFacingTag } from '../../../../common/utils/TagUtils';
import { FormattedMessage } from 'react-intl';

type UpdatePromptVersionMetadataPayload = {
  promptName: string;
  promptVersion: string;
  toAdd: { key: string; value: string }[];
  toDelete: { key: string }[];
};

export const useUpdatePromptVersionMetadataModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const updateMutation = useMutation<unknown, Error, UpdatePromptVersionMetadataPayload>({
    mutationFn: async ({ toAdd, toDelete, promptName, promptVersion }) => {
      return Promise.all([
        ...toAdd.map(({ key, value }) =>
          RegisteredPromptsApi.setRegisteredPromptVersionTag(promptName, promptVersion, key, value),
        ),
        ...toDelete.map(({ key }) =>
          RegisteredPromptsApi.deleteRegisteredPromptVersionTag(promptName, promptVersion, key),
        ),
      ]);
    },
  });

  const {
    EditTagsModal: EditPromptVersionMetadataModal,
    showEditTagsModal,
    isLoading,
  } = useEditKeyValueTagsModal<Pick<RegisteredPromptVersion, 'name' | 'version' | 'tags'>>({
    title: (
      <FormattedMessage
        defaultMessage="Add/Edit Prompt Version Metadata"
        description="Title for a modal that allows the user to add or edit metadata tags on prompt versions."
      />
    ),
    valueRequired: true,
    saveTagsHandler: (promptVersion, currentTags, newTags) => {
      const { addedOrModifiedTags, deletedTags } = diffCurrentAndNewTags(currentTags, newTags);

      return new Promise<void>((resolve, reject) => {
        if (!promptVersion.name) {
          return reject();
        }
        // Send all requests to the mutation
        updateMutation.mutate(
          {
            promptName: promptVersion.name,
            promptVersion: promptVersion.version,
            toAdd: addedOrModifiedTags,
            toDelete: deletedTags,
          },
          {
            onSuccess: () => {
              resolve();
              onSuccess?.();
            },
            onError: reject,
          },
        );
      });
    },
  });

  const showEditPromptVersionMetadataModal = useCallback(
    (promptVersion: RegisteredPromptVersion) =>
      showEditTagsModal({
        name: promptVersion.name,
        version: promptVersion.version,
        tags: promptVersion.tags?.filter((tag) => isUserFacingTag(tag.key)),
      }),
    [showEditTagsModal],
  );

  return { EditPromptVersionMetadataModal, showEditPromptVersionMetadataModal, isLoading };
};
```

--------------------------------------------------------------------------------

---[FILE: useUpdateRegisteredPromptTags.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useUpdateRegisteredPromptTags.tsx
Signals: React

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useEditKeyValueTagsModal } from '../../../../common/hooks/useEditKeyValueTagsModal';
import { RegisteredPromptsApi } from '../api';
import type { RegisteredPrompt } from '../types';
import { useCallback } from 'react';
import { diffCurrentAndNewTags, isUserFacingTag } from '../../../../common/utils/TagUtils';

type UpdateTagsPayload = {
  promptId: string;
  toAdd: { key: string; value: string }[];
  toDelete: { key: string }[];
};

export const useUpdateRegisteredPromptTags = ({ onSuccess }: { onSuccess?: () => void }) => {
  const updateMutation = useMutation<unknown, Error, UpdateTagsPayload>({
    mutationFn: async ({ toAdd, toDelete, promptId }) => {
      return Promise.all([
        ...toAdd.map(({ key, value }) => RegisteredPromptsApi.setRegisteredPromptTag(promptId, key, value)),
        ...toDelete.map(({ key }) => RegisteredPromptsApi.deleteRegisteredPromptTag(promptId, key)),
      ]);
    },
  });

  const { EditTagsModal, showEditTagsModal, isLoading } = useEditKeyValueTagsModal<
    Pick<RegisteredPrompt, 'name' | 'tags'>
  >({
    valueRequired: true,
    saveTagsHandler: (prompt, currentTags, newTags) => {
      const { addedOrModifiedTags, deletedTags } = diffCurrentAndNewTags(currentTags, newTags);

      return new Promise<void>((resolve, reject) => {
        if (!prompt.name) {
          return reject();
        }
        // Send all requests to the mutation
        updateMutation.mutate(
          {
            promptId: prompt.name,
            toAdd: addedOrModifiedTags,
            toDelete: deletedTags,
          },
          {
            onSuccess: () => {
              resolve();
              onSuccess?.();
            },
            onError: reject,
          },
        );
      });
    },
  });

  const showEditPromptTagsModal = useCallback(
    (prompt: RegisteredPrompt) =>
      showEditTagsModal({
        name: prompt.name,
        tags: prompt.tags.filter((tag) => isUserFacingTag(tag.key)),
      }),
    [showEditTagsModal],
  );

  return { EditTagsModal, showEditPromptTagsModal, isLoading };
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationDataReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/EvaluationDataReducer.test.ts
Signals: Redux/RTK

```typescript
import { describe, it, expect } from '@jest/globals';
import { rejected } from '../../common/utils/ActionUtils';
import { fulfilled, pending } from '../../common/utils/ActionUtils';
import { AsyncRejectedAction } from '../../redux-types';
import { GET_EVALUATION_TABLE_ARTIFACT, GetEvaluationTableArtifactAction, UPLOAD_ARTIFACT_API } from '../actions';
import { WRITE_BACK_EVALUATION_ARTIFACTS } from '../actions/PromptEngineeringActions';
import type { EvaluationArtifactTable, EvaluationArtifactTableEntry } from '../types';
import { evaluationDataReducer } from './EvaluationDataReducer';

describe('evaluationDataReducer', () => {
  const emptyState: ReturnType<typeof evaluationDataReducer> = {
    evaluationArtifactsByRunUuid: {},
    evaluationArtifactsErrorByRunUuid: {},
    evaluationArtifactsLoadingByRunUuid: {},
    evaluationDraftInputValues: [],
    evaluationPendingDataByRunUuid: {},
    evaluationPendingDataLoadingByRunUuid: {},
    evaluationArtifactsBeingUploaded: {},
  };

  const MOCK_ENTRY_A: EvaluationArtifactTableEntry = {
    input: 'input_a',
    output: 'output_a',
    target: 'target_a',
  };

  const MOCK_ENTRY_B: EvaluationArtifactTableEntry = {
    input: 'input_b',
    output: 'output_b',
    target: 'target_b',
  };

  const MOCK_ENTRY_C: EvaluationArtifactTableEntry = {
    input: 'input_c',
    output: 'output_c',
    target: 'target_c',
  };

  const MOCK_ENTRIES = [MOCK_ENTRY_A, MOCK_ENTRY_B, MOCK_ENTRY_C];
  const MOCK_COLUMNS = ['input', 'output', 'target'];

  const mockFulfilledAction = (
    runUuid: string,
    artifactPath: string,
    payload: Omit<EvaluationArtifactTable, 'path'> | Error = {
      entries: MOCK_ENTRIES,
      columns: MOCK_COLUMNS,
    },
  ) => ({
    type: fulfilled(GET_EVALUATION_TABLE_ARTIFACT),
    meta: { runUuid, artifactPath },
    payload: { ...payload, path: artifactPath } as any,
  });

  const mockPendingAction = (runUuid: string, artifactPath: string) => ({
    type: pending(GET_EVALUATION_TABLE_ARTIFACT),
    meta: { runUuid, artifactPath },
    payload: {} as any,
  });

  const mockRejectedAction = (runUuid: string, artifactPath: string) => ({
    type: rejected(GET_EVALUATION_TABLE_ARTIFACT),
    meta: { runUuid, artifactPath },
    payload: new Error('Mock error') as any,
  });

  it('artifact entries are correctly populated for multiple runs', () => {
    let state = emptyState;
    state = evaluationDataReducer(
      state,
      mockFulfilledAction('run_1', '/some/artifact', {
        entries: [MOCK_ENTRY_A, MOCK_ENTRY_B],
        columns: MOCK_COLUMNS,
      }),
    );
    state = evaluationDataReducer(
      state,
      mockFulfilledAction('run_2', '/some/other/artifact', {
        entries: [MOCK_ENTRY_C],
        columns: MOCK_COLUMNS,
      }),
    );
    const { evaluationArtifactsByRunUuid } = state;
    expect(evaluationArtifactsByRunUuid['run_1']).toEqual({
      '/some/artifact': {
        columns: ['input', 'output', 'target'],
        entries: [
          { input: 'input_a', output: 'output_a', target: 'target_a' },
          { input: 'input_b', output: 'output_b', target: 'target_b' },
        ],
        path: '/some/artifact',
      },
    });
    expect(evaluationArtifactsByRunUuid['run_2']).toEqual({
      '/some/other/artifact': {
        columns: ['input', 'output', 'target'],
        entries: [{ input: 'input_c', output: 'output_c', target: 'target_c' }],
        path: '/some/other/artifact',
      },
    });
  });

  it('correctly sets loading state', () => {
    let state = emptyState;
    state = evaluationDataReducer(state, mockPendingAction('run_1', '/some/artifact'));
    state = evaluationDataReducer(state, mockPendingAction('run_2', '/some/artifact'));
    state = evaluationDataReducer(state, mockFulfilledAction('run_1', '/some/artifact'));
    const { evaluationArtifactsLoadingByRunUuid } = state;

    expect(evaluationArtifactsLoadingByRunUuid['run_1']['/some/artifact']).toEqual(false);
    expect(evaluationArtifactsLoadingByRunUuid['run_2']['/some/artifact']).toEqual(true);
  });

  it('correctly marks failed attempts to fetch artifacts', () => {
    let state = emptyState;
    state = evaluationDataReducer(state, mockRejectedAction('run_1', '/some/artifact'));
    const { evaluationArtifactsErrorByRunUuid } = state;

    expect(evaluationArtifactsErrorByRunUuid['run_1']['/some/artifact']).toMatch(/Mock error/);
  });

  it('correctly indicates artifacts being currently uploaded', () => {
    let state = emptyState;
    state = evaluationDataReducer(state, {
      type: pending(WRITE_BACK_EVALUATION_ARTIFACTS),
      meta: { runUuidsToUpdate: ['run_1', 'run_2'], artifactPath: '/some/artifact' },
    });

    expect(state.evaluationArtifactsBeingUploaded).toEqual({
      run_1: { '/some/artifact': true },
      run_2: { '/some/artifact': true },
    });

    state = evaluationDataReducer(state, {
      type: fulfilled(UPLOAD_ARTIFACT_API),
      meta: { id: '1', runUuid: 'run_1', filePath: '/some/artifact' },
      payload: {},
    });

    expect(state.evaluationArtifactsBeingUploaded).toEqual({
      run_1: { '/some/artifact': false },
      run_2: { '/some/artifact': true },
    });

    state = evaluationDataReducer(state, {
      type: rejected(UPLOAD_ARTIFACT_API),
      meta: { id: '1', runUuid: 'run_2', filePath: '/some/artifact' },
      payload: new Error() as any,
    });

    expect(state.evaluationArtifactsBeingUploaded).toEqual({
      run_1: { '/some/artifact': false },
      run_2: { '/some/artifact': false },
    });
  });

  it('correctly saves newly written data', () => {
    let state = emptyState;
    const newEvaluationTable = {
      columns: MOCK_COLUMNS,
      entries: MOCK_ENTRIES,
      path: '/some/artifact',
    };

    state = evaluationDataReducer(state, {
      type: fulfilled(WRITE_BACK_EVALUATION_ARTIFACTS),
      payload: [
        {
          runUuid: 'run_1',
          newEvaluationTable,
        },
      ],
      meta: { runUuidsToUpdate: ['run_1'], artifactPath: '/some/artifact' },
    });

    expect(state.evaluationArtifactsByRunUuid).toEqual({
      run_1: { '/some/artifact': newEvaluationTable },
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationDataReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/EvaluationDataReducer.ts
Signals: Redux/RTK

```typescript
import { combineReducers } from 'redux';
import { fulfilled, pending, rejected } from '../../common/utils/ActionUtils';
import type { EvaluationArtifactTable, PendingEvaluationArtifactTableEntry } from '../types';

import type { AsyncAction, AsyncFulfilledAction, AsyncPendingAction, AsyncRejectedAction } from '../../redux-types';
import type {
  DiscardPendingEvaluationDataAction,
  EvaluateAddInputValues,
  EvaluatePromptTableValueAction,
  WriteBackEvaluationArtifactsAction,
} from '../actions/PromptEngineeringActions';
import type { GetEvaluationTableArtifactAction, UploadArtifactApiAction } from '../actions';
import {
  DEFAULT_PROMPTLAB_OUTPUT_COLUMN,
  DEFAULT_PROMPTLAB_PROMPT_COLUMN,
} from '../components/prompt-engineering/PromptEngineering.utils';

export interface EvaluationDataReduxState {
  /**
   * Stores artifact data indexed by run UUID and by the artifact path
   */
  evaluationArtifactsByRunUuid: {
    [runUuid: string]: { [artifactPath: string]: EvaluationArtifactTable };
  };
  /**
   * Determines if particular artifact is being loaded, indexed by run UUID and by the artifact path
   */
  evaluationArtifactsLoadingByRunUuid: {
    [runUuid: string]: { [artifactPath: string]: boolean };
  };
  /**
   * Stores errors of fetching artifacts, indexed by run UUID and by the artifact path
   */
  evaluationArtifactsErrorByRunUuid: {
    [runUuid: string]: { [artifactPath: string]: string };
  };

  evaluationPendingDataByRunUuid: {
    [runUuid: string]: PendingEvaluationArtifactTableEntry[];
  };

  evaluationPendingDataLoadingByRunUuid: {
    [runUuid: string]: { [inputHash: string]: boolean };
  };

  evaluationDraftInputValues: Record<string, string>[];

  evaluationArtifactsBeingUploaded: {
    [runUuid: string]: { [artifactPath: string]: boolean };
  };
}

const evaluationArtifactsBeingUploaded = (
  state: {
    [runUuid: string]: { [artifactPath: string]: boolean };
  } = {},
  action:
    | AsyncPendingAction<WriteBackEvaluationArtifactsAction>
    | AsyncFulfilledAction<UploadArtifactApiAction>
    | AsyncRejectedAction<UploadArtifactApiAction>,
) => {
  if (action.type === pending('WRITE_BACK_EVALUATION_ARTIFACTS') && action.meta) {
    const { runUuidsToUpdate, artifactPath } = action.meta;
    return runUuidsToUpdate.reduce<{
      [runUuid: string]: { [artifactPath: string]: boolean };
    }>(
      (aggregate, runUuid) => ({
        ...aggregate,
        [runUuid]: { [artifactPath]: true },
      }),
      {},
    );
  }
  if (
    (action.type === fulfilled('UPLOAD_ARTIFACT_API') || action.type === rejected('UPLOAD_ARTIFACT_API')) &&
    action.meta
  ) {
    const { filePath, runUuid } = action.meta;
    return { ...state, [runUuid]: { ...state[runUuid], [filePath]: false } };
  }
  return state;
};

const evaluationDraftInputValues = (
  state: Record<string, string>[] = [],
  action:
    | EvaluateAddInputValues
    | AsyncFulfilledAction<WriteBackEvaluationArtifactsAction>
    | DiscardPendingEvaluationDataAction,
) => {
  if (action.type === 'DISCARD_PENDING_EVALUATION_DATA') {
    return [];
  }
  if (action.type === 'EVALUATE_ADD_INPUT_VALUES') {
    return [...state, action.payload];
  }
  if (action.type === fulfilled('WRITE_BACK_EVALUATION_ARTIFACTS')) {
    return [];
  }
  return state;
};

const evaluationArtifactsByRunUuid = (
  state: { [runUuid: string]: EvaluationArtifactTable[] } = {},
  action:
    | AsyncFulfilledAction<GetEvaluationTableArtifactAction>
    | AsyncFulfilledAction<WriteBackEvaluationArtifactsAction>,
) => {
  if (action.type === fulfilled('WRITE_BACK_EVALUATION_ARTIFACTS') && action.meta) {
    const { artifactPath } = action.meta;
    const updatedRunTables = action.payload;

    const newState = { ...state };

    for (const { runUuid, newEvaluationTable } of updatedRunTables) {
      newState[runUuid] = { ...newState[runUuid], [artifactPath]: newEvaluationTable };
    }

    return newState;
  }
  if (action.type === fulfilled('GET_EVALUATION_TABLE_ARTIFACT') && action.meta) {
    const { runUuid, artifactPath } = action.meta;
    return { ...state, [runUuid]: { ...state[runUuid], [artifactPath]: action.payload } };
  }
  return state;
};

const evaluationPendingDataLoadingByRunUuid = (
  state: {
    [runUuid: string]: { [inputHash: string]: boolean };
  } = {},
  action: AsyncAction,
) => {
  if (action.meta && action.type === pending('EVALUATE_PROMPT_TABLE_VALUE')) {
    const { rowKey, run } = action.meta;
    const runEntries = state[run.runUuid] || {};
    runEntries[rowKey] = true;
    return { ...state, [run.runUuid]: runEntries };
  }
  if (
    action.meta &&
    (action.type === fulfilled('EVALUATE_PROMPT_TABLE_VALUE') ||
      action.type === rejected('EVALUATE_PROMPT_TABLE_VALUE'))
  ) {
    const { rowKey, run } = action.meta;
    const runEntries = state[run.runUuid] || {};
    runEntries[rowKey] = false;
    return { ...state, [run.runUuid]: runEntries };
  }
  return state;
};
const evaluationPendingDataByRunUuid = (
  state: {
    [runUuid: string]: PendingEvaluationArtifactTableEntry[];
  } = {},
  action:
    | AsyncFulfilledAction<EvaluatePromptTableValueAction>
    | AsyncFulfilledAction<WriteBackEvaluationArtifactsAction>
    | DiscardPendingEvaluationDataAction,
) => {
  if (action.type === 'DISCARD_PENDING_EVALUATION_DATA') {
    return {};
  }
  if (action.type === fulfilled('WRITE_BACK_EVALUATION_ARTIFACTS')) {
    const newState = { ...state };
    for (const runUuid of action.meta?.runUuidsToUpdate || []) {
      delete newState[runUuid];
    }
    return newState;
  }
  if (action.type === fulfilled('EVALUATE_PROMPT_TABLE_VALUE') && action.meta) {
    const { run, inputValues, startTime, compiledPrompt, gatewayRoute } = action.meta;

    const evaluationTime = !startTime ? 0 : performance.now() - startTime;

    const { metadata, text } = action.payload;

    const newEntry: PendingEvaluationArtifactTableEntry = {
      entryData: {
        ...inputValues,
        [DEFAULT_PROMPTLAB_OUTPUT_COLUMN]: text,
        [DEFAULT_PROMPTLAB_PROMPT_COLUMN]: compiledPrompt,
      },
      evaluationTime,
      totalTokens: metadata.total_tokens,
      isPending: true,
    };

    const runEntries = state[run.runUuid] || [];
    const existingEntry = runEntries.find(({ entryData: entry }) =>
      Object.entries(inputValues).every(([key, value]) => entry[key] === value),
    );
    const runEntriesWithoutDuplicate = existingEntry ? runEntries.filter((e) => e !== existingEntry) : runEntries;

    runEntriesWithoutDuplicate.push(newEntry);
    return { ...state, [run.runUuid]: runEntriesWithoutDuplicate };
  }
  return state;
};

const evaluationArtifactsLoadingByRunUuid = (
  state: {
    [runUuid: string]: { [artifactPath: string]: boolean };
  } = {},
  action:
    | AsyncPendingAction<GetEvaluationTableArtifactAction>
    | AsyncRejectedAction<GetEvaluationTableArtifactAction>
    | AsyncFulfilledAction<GetEvaluationTableArtifactAction>,
) => {
  if (action.type === pending('GET_EVALUATION_TABLE_ARTIFACT') && action.meta) {
    const { runUuid, artifactPath } = action.meta;
    return { ...state, [runUuid]: { ...state[runUuid], [artifactPath]: true } };
  }
  if (
    action.type === rejected('GET_EVALUATION_TABLE_ARTIFACT') ||
    action.type === fulfilled('GET_EVALUATION_TABLE_ARTIFACT')
  ) {
    if (!action.meta) {
      return state;
    }
    const { runUuid, artifactPath } = action.meta;
    return { ...state, [runUuid]: { ...state[runUuid], [artifactPath]: false } };
  }
  return state;
};

const evaluationArtifactsErrorByRunUuid = (
  state: {
    [runUuid: string]: { [artifactPath: string]: string };
  } = {},
  action: AsyncRejectedAction<GetEvaluationTableArtifactAction>,
) => {
  if (action.type === rejected('GET_EVALUATION_TABLE_ARTIFACT') && action.meta) {
    const { runUuid, artifactPath } = action.meta;
    const error = action.payload;
    return { ...state, [runUuid]: { ...state[runUuid], [artifactPath]: error?.toString() } };
  }
  return state;
};

export const evaluationDataReducer = combineReducers({
  evaluationDraftInputValues,
  evaluationArtifactsByRunUuid,
  evaluationArtifactsLoadingByRunUuid,
  evaluationArtifactsErrorByRunUuid,
  evaluationPendingDataByRunUuid,
  evaluationPendingDataLoadingByRunUuid,
  evaluationArtifactsBeingUploaded,
});
```

--------------------------------------------------------------------------------

---[FILE: ImageReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/ImageReducer.test.ts
Signals: Redux/RTK

```typescript
import { describe, it, expect, jest } from '@jest/globals';
import { imagesByRunUuid } from './ImageReducer';
import type { AsyncFulfilledAction } from '@mlflow/mlflow/src/redux-types';
import type { ListImagesAction } from '@mlflow/mlflow/src/experiment-tracking/actions';

describe('ImageReducer', () => {
  it('should return the initial state', () => {
    const initialState = {};
    const action: AsyncFulfilledAction<ListImagesAction> = {
      type: 'LIST_IMAGES_API_FULFILLED',
      payload: {
        files: [],
        root_uri: '',
      },
    };
    const newState = imagesByRunUuid(initialState, action);
    expect(newState).toEqual({});
  });

  it('should add images to the state', () => {
    const initialState = {};
    const action: AsyncFulfilledAction<ListImagesAction> = {
      type: 'LIST_IMAGES_API_FULFILLED',
      payload: {
        files: [
          {
            path: 'images/image1%step%0%timestamp%1%UUID.png',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image2%step%1%timestamp%1%UUID.png',
            is_dir: false,
            file_size: 123,
          },
        ],
        root_uri: '',
      },
      meta: {
        id: '123',
        runUuid: '123',
      },
    };
    const newState = imagesByRunUuid(initialState, action);
    expect(newState).toEqual({
      '123': {
        image1: {
          'image1%step%0%timestamp%1%UUID': {
            filepath: 'images/image1%step%0%timestamp%1%UUID.png',
            step: 0,
            timestamp: 1,
          },
        },
        image2: {
          'image2%step%1%timestamp%1%UUID': {
            filepath: 'images/image2%step%1%timestamp%1%UUID.png',
            step: 1,
            timestamp: 1,
          },
        },
      },
    });
  });

  it('should add images to the state with + delimiter', () => {
    const initialState = {};
    const action: AsyncFulfilledAction<ListImagesAction> = {
      type: 'LIST_IMAGES_API_FULFILLED',
      payload: {
        files: [
          {
            path: 'images/image1+step+0+timestamp+1+UUID.png',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image2+step+1+timestamp+1+UUID.png',
            is_dir: false,
            file_size: 123,
          },
        ],
        root_uri: '',
      },
      meta: {
        id: '123',
        runUuid: '123',
      },
    };
    const newState = imagesByRunUuid(initialState, action);
    expect(newState).toEqual({
      '123': {
        image1: {
          'image1+step+0+timestamp+1+UUID': {
            filepath: 'images/image1+step+0+timestamp+1+UUID.png',
            step: 0,
            timestamp: 1,
          },
        },
        image2: {
          'image2+step+1+timestamp+1+UUID': {
            filepath: 'images/image2+step+1+timestamp+1+UUID.png',
            step: 1,
            timestamp: 1,
          },
        },
      },
    });
  });

  it('should handle error and prevent state update on malformed inputs', () => {
    const initialState = {};
    const action: AsyncFulfilledAction<ListImagesAction> = {
      type: 'LIST_IMAGES_API_FULFILLED',
      payload: {
        files: [
          {
            path: 'images/image1%step%0%1%UUID.png',
            is_dir: false,
            file_size: 123,
          },
        ],
        root_uri: '',
      },
      meta: {
        id: '123',
        runUuid: '123',
      },
    };
    const newState = imagesByRunUuid(initialState, action);
    expect(newState).toEqual({});
  });

  it('should add image and compressed image to the state', () => {
    const initialState = {};
    const action: AsyncFulfilledAction<ListImagesAction> = {
      type: 'LIST_IMAGES_API_FULFILLED',
      payload: {
        files: [
          {
            path: 'images/image1%step%0%timestamp%1%UUID.png',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image2%step%1%timestamp%1%UUID.png',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image1%step%0%timestamp%1%UUID.json',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image2%step%1%timestamp%1%UUID.json',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image1%step%0%timestamp%1%UUID%compressed.webp',
            is_dir: false,
            file_size: 123,
          },
          {
            path: 'images/image2%step%1%timestamp%1%UUID%compressed.webp',
            is_dir: false,
            file_size: 123,
          },
        ],
        root_uri: '',
      },
      meta: {
        id: '123',
        runUuid: '123',
      },
    };
    const newState = imagesByRunUuid(initialState, action);
    expect(newState).toEqual({
      '123': {
        image1: {
          'image1%step%0%timestamp%1%UUID': {
            filepath: 'images/image1%step%0%timestamp%1%UUID.png',
            compressed_filepath: 'images/image1%step%0%timestamp%1%UUID%compressed.webp',
            step: 0,
            timestamp: 1,
          },
        },
        image2: {
          'image2%step%1%timestamp%1%UUID': {
            filepath: 'images/image2%step%1%timestamp%1%UUID.png',
            compressed_filepath: 'images/image2%step%1%timestamp%1%UUID%compressed.webp',
            step: 1,
            timestamp: 1,
          },
        },
      },
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ImageReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/ImageReducer.ts
Signals: Redux/RTK

```typescript
import { fulfilled } from '@mlflow/mlflow/src/common/utils/ActionUtils';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import type { ListImagesAction } from '@mlflow/mlflow/src/experiment-tracking/actions';
import { LIST_IMAGES_API } from '@mlflow/mlflow/src/experiment-tracking/actions';
import {
  IMAGE_COMPRESSED_FILE_EXTENSION,
  IMAGE_FILE_EXTENSION,
  MLFLOW_LOGGED_IMAGE_ARTIFACTS_PATH,
} from '@mlflow/mlflow/src/experiment-tracking/constants';
import type { ArtifactFileInfo, ImageEntity } from '@mlflow/mlflow/src/experiment-tracking/types';
import type { AsyncFulfilledAction } from '@mlflow/mlflow/src/redux-types';

class ImagePathParseError extends Error {
  public filename: string;

  constructor(message: string, filename: string) {
    super(message);
    this.filename = filename;
    this.name = 'ImagePathParseError';
  }
}

const IMAGE_FILEPATH_DELIMITERS = ['%', '+'];

const parseImageFile = (filename: string) => {
  // Extract extension
  const extension = filename.split('.').pop();
  let fileKey = extension ? filename.slice(0, -(extension.length + 1)) : filename;

  const delimiter = IMAGE_FILEPATH_DELIMITERS.find((delimiter) => fileKey.includes(delimiter));
  if (delimiter === undefined) {
    throw new ImagePathParseError('Logged image path parse: incorrect filename format for image file', filename);
  }
  // The variables retrieved here are not reliable on OSS due to the usage of "%" as the separator.
  // Need to switch to a different separator on the backend to fully resolve the issue.
  const [serializedImageKey, stepLabel, stepString, timestampLabel, timestampString, _, compressed] =
    fileKey.split(delimiter);
  const isCompressed = fileKey.endsWith('compressed');

  if (stepLabel !== 'step' || timestampLabel !== 'timestamp') {
    throw new ImagePathParseError(
      'Logged image path parse: failed to parse step and timestamp from image filename',
      filename,
    );
  }

  const step = parseInt(stepString, 10);
  const timestamp = parseInt(timestampString, 10);
  const imageKey = serializedImageKey.replace(/#/g, '/');

  if (isCompressed) {
    fileKey = fileKey.slice(0, -('compressed'.length + 1));
  }
  return { imageKey, step, timestamp, fileKey, extension, isCompressed };
};

// TODO: add tests for this reducer
export const imagesByRunUuid = (
  state: Record<string, Record<string, Record<string, ImageEntity>>> = {},
  action: AsyncFulfilledAction<ListImagesAction>,
) => {
  switch (action.type) {
    case fulfilled(LIST_IMAGES_API): {
      if (!action.meta) {
        return state;
      }
      // Populate state with image keys
      const { runUuid } = action.meta;
      const { files } = action.payload;
      try {
        if (!files) {
          // There are no images for this run
          return {
            ...state,
            [runUuid]: {},
          };
        }
        // Filter images to only include directories
        const result = files.reduce((acc: Record<string, Record<string, ImageEntity>>, file: ArtifactFileInfo) => {
          if (!file.is_dir) {
            if (!file.path) {
              return acc;
            }
            const { imageKey, step, timestamp, fileKey, extension, isCompressed } = parseImageFile(
              file.path.slice((MLFLOW_LOGGED_IMAGE_ARTIFACTS_PATH + '/').length),
            );

            // Double check extension of image files
            if (extension === IMAGE_FILE_EXTENSION || extension === IMAGE_COMPRESSED_FILE_EXTENSION) {
              if (isCompressed) {
                acc[imageKey] = {
                  ...acc[imageKey],
                  [fileKey]: {
                    ...acc[imageKey]?.[fileKey],
                    compressed_filepath: file.path,
                  },
                };
              } else {
                // Set the step and timestamp when retrieving the uncompressed image file.
                acc[imageKey] = {
                  ...acc[imageKey],
                  [fileKey]: {
                    ...acc[imageKey]?.[fileKey],
                    filepath: file.path,
                    step: step,
                    timestamp: timestamp,
                  },
                };
              }
            }
          }
          return acc;
        }, {} as Record<string, Record<string, ImageEntity>>);
        return {
          ...state,
          [runUuid]: result,
        };
      } catch (e) {
        // On malformed inputs we will report alert and continue without updating the state
        Utils.logErrorAndNotifyUser(e);
        return state;
      }
    }
    default:
      return state;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: InputsOutputsReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/InputsOutputsReducer.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import { fulfilled } from '../../common/utils/ActionUtils';
import { GET_RUN_API, LOAD_MORE_RUNS_API, SEARCH_RUNS_API } from '../actions';
import { mockRunInfo } from '../utils/test-utils/ReduxStoreFixtures';
import { runInputsOutputsByUuid } from './InputsOutputsReducer';

describe('test runInputsOutputsByUuid', () => {
  test('should set up initial state correctly', () => {
    expect(runInputsOutputsByUuid(undefined, {})).toEqual({});
  });

  test('GET_RUN_API correctly updates state', () => {
    const runUuid = 'run01';
    const inputs = {
      datasetInputs: [
        {
          dataset: {
            digest: 'digest1',
            name: 'dataset1',
            profile: '{}',
            schema: '{}',
            source: '{}',
            sourceType: 'local',
          },
          tags: [],
        },
      ],
    };
    const outputs = {
      modelOutputs: [{ modelId: 'model1' }],
    };

    const action = {
      type: fulfilled(GET_RUN_API),
      payload: {
        run: {
          info: { runUuid },
          inputs,
          outputs,
        },
      },
    };

    const newState = runInputsOutputsByUuid(undefined, action);
    expect(newState).toEqual({
      [runUuid]: {
        inputs,
        outputs,
      },
    });
  });

  test('SEARCH_RUNS_API correctly updates state', () => {
    const runA = mockRunInfo('runA');
    const runB = mockRunInfo('runB');
    const runC = mockRunInfo('runC');

    const inputsA = {
      datasetInputs: [
        {
          dataset: {
            digest: 'digest1',
            name: 'dataset1',
            profile: '{}',
            schema: '{}',
            source: '{}',
            sourceType: 'local',
          },
          tags: [],
        },
      ],
    };

    const outputsB = {
      modelOutputs: [{ modelId: 'model1' }],
    };

    const action = {
      type: fulfilled(SEARCH_RUNS_API),
      payload: {
        runs: [
          // Run with only inputs
          { info: runA, inputs: inputsA },
          // Run with only outputs
          { info: runB, outputs: outputsB },
          // Run with neither inputs nor outputs
          { info: runC },
        ],
      },
    };

    const newState = runInputsOutputsByUuid(undefined, action);
    expect(newState).toEqual({
      [runA.runUuid]: {
        inputs: inputsA,
        outputs: undefined,
      },
      [runB.runUuid]: {
        inputs: undefined,
        outputs: outputsB,
      },
      [runC.runUuid]: {
        inputs: undefined,
        outputs: undefined,
      },
    });
  });

  test('LOAD_MORE_RUNS_API correctly updates state', () => {
    // Initial state with existing runs
    const initialState = {
      existingRun: {
        inputs: { modelInputs: [{ modelId: 'model1' }] },
        outputs: {},
      },
    };

    const runD = mockRunInfo('runD');
    const runE = mockRunInfo('runE');

    const inputsD = {
      modelInputs: [{ modelId: 'model2' }],
    };

    const outputsE = {
      modelOutputs: [{ modelId: 'model3' }],
    };

    const action = {
      type: fulfilled(LOAD_MORE_RUNS_API),
      payload: {
        runs: [
          { info: runD, inputs: inputsD },
          { info: runE, outputs: outputsE },
        ],
      },
    };

    const newState = runInputsOutputsByUuid(initialState, action);
    expect(newState).toEqual({
      existingRun: {
        inputs: { modelInputs: [{ modelId: 'model1' }] },
        outputs: {},
      },
      [runD.runUuid]: {
        inputs: inputsD,
        outputs: undefined,
      },
      [runE.runUuid]: {
        inputs: undefined,
        outputs: outputsE,
      },
    });
  });

  test('SEARCH_RUNS_API with no payload', () => {
    expect(
      runInputsOutputsByUuid(undefined, {
        type: fulfilled(SEARCH_RUNS_API),
      }),
    ).toEqual({});
  });

  test('SEARCH_RUNS_API with empty runs array', () => {
    expect(
      runInputsOutputsByUuid(undefined, {
        type: fulfilled(SEARCH_RUNS_API),
        payload: {
          runs: [],
        },
      }),
    ).toEqual({});
  });
});
```

--------------------------------------------------------------------------------

---[FILE: InputsOutputsReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/InputsOutputsReducer.ts

```typescript
import { fulfilled } from '../../common/utils/ActionUtils';
import { LOAD_MORE_RUNS_API, SEARCH_RUNS_API, GET_RUN_API } from '../actions';
import type { RunInputsType, RunOutputsType } from '../types';

export const runInputsOutputsByUuid = (
  state: Record<string, { inputs?: RunInputsType; outputs?: RunOutputsType }> = {},
  action: any,
) => {
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const { run } = action.payload;
      const runUuid = run.info.runUuid;
      if (runUuid) {
        return {
          ...state,
          [runUuid]: {
            inputs: run.inputs,
            outputs: run.outputs,
          },
        };
      }
      return state;
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      if (action.payload && action.payload.runs) {
        const newState = { ...state };
        action.payload.runs.forEach(
          (runJson: { info: { runUuid: string }; inputs?: RunInputsType; outputs?: RunOutputsType }) => {
            if (!runJson) {
              return;
            }
            const runUuid: string = runJson.info.runUuid;
            if (runUuid) {
              newState[runUuid] = {
                inputs: runJson.inputs,
                outputs: runJson.outputs,
              };
            }
          },
        );
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
};
```

--------------------------------------------------------------------------------

````
