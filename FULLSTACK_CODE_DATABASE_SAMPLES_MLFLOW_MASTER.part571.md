---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 571
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 571 of 991)

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

---[FILE: Reducers.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/Reducers.ts
Signals: Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { combineReducers } from 'redux';
import {
  CLOSE_ERROR_MODAL,
  GET_EXPERIMENT_API,
  GET_RUN_API,
  LIST_ARTIFACTS_API,
  LIST_ARTIFACTS_LOGGED_MODEL_API,
  OPEN_ERROR_MODAL,
  SEARCH_RUNS_API,
  LOAD_MORE_RUNS_API,
  SET_EXPERIMENT_TAG_API,
  SET_TAG_API,
  DELETE_TAG_API,
  SET_COMPARE_EXPERIMENTS,
  SEARCH_DATASETS_API,
} from '../actions';
import { Param, RunTag, ExperimentTag } from '../sdk/MlflowMessages';
import { ArtifactNode } from '../utils/ArtifactUtils';
import { metricsByRunUuid, latestMetricsByRunUuid, minMetricsByRunUuid, maxMetricsByRunUuid } from './MetricReducer';
import modelRegistryReducers from '../../model-registry/reducers';
import { isArray, isEqual, merge, update, intersection, omit, union } from 'lodash';
import { fulfilled, isFulfilledApi, isPendingApi, isRejectedApi, rejected } from '../../common/utils/ActionUtils';
import { SEARCH_MODEL_VERSIONS } from '../../model-registry/actions';
import { getProtoField } from '../../model-registry/utils';
import Utils from '../../common/utils/Utils';
import { evaluationDataReducer as evaluationData } from './EvaluationDataReducer';
import { modelGatewayReducer as modelGateway } from './ModelGatewayReducer';
import type {
  DatasetSummary,
  ExperimentEntity,
  ModelVersionInfoEntity,
  RunInfoEntity,
} from '@mlflow/mlflow/src/experiment-tracking/types';
import { sampledMetricsByRunUuid } from './SampledMetricsReducer';
import type { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { imagesByRunUuid } from './ImageReducer';
import { colorByRunUuid } from './RunColorReducer';
import { runInputsOutputsByUuid } from './InputsOutputsReducer';

export type ApisReducerReduxState = Record<
  string,
  { active: boolean; id: string; data: any; error?: Error | ErrorWrapper }
>;
export type ViewsReducerReduxState = {
  errorModal: {
    isOpen: boolean;
    text: string;
  };
};
export type ComparedExperimentsReducerReduxState = {
  comparedExperimentIds: string[];
  hasComparedExperimentsBefore: boolean;
};

export const getExperiments = (state: any): ExperimentEntity[] => {
  return Object.values(state.entities.experimentsById);
};

export const getExperiment = (id: any, state: any) => {
  return state.entities.experimentsById[id];
};

export const experimentsById = (state = {}, action: any): any => {
  switch (action.type) {
    case fulfilled(GET_EXPERIMENT_API): {
      const { experiment } = action.payload;

      const existingExperiment = (state as any)[experiment.experimentId] || {};

      return {
        ...state,
        [experiment.experimentId]: merge({}, existingExperiment, experiment),
      };
    }
    default:
      return state;
  }
};

export const getRunInfo = (runUuid: any, state: any) => {
  return state.entities.runInfosByUuid[runUuid];
};

export const getRunDatasets = (runUuid: string, state: any) => {
  return state.entities.runDatasetsByUuid[runUuid];
};

export const runUuidsMatchingFilter = (state = [], action: any) => {
  switch (action.type) {
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const isLoadingMore = action.type === fulfilled(LOAD_MORE_RUNS_API);
      const newState = isLoadingMore ? [...state] : [];
      if (isArray(action.payload?.runsMatchingFilter)) {
        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        newState.push(...action.payload.runsMatchingFilter.map(({ info }: any) => info.runUuid));
      }
      return newState;
    }
    default:
      return state;
  }
};

export const runDatasetsByUuid = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const { run } = action.payload;
      const runUuid = run.info.runUuid;
      const runInputInfo = run.inputs || [];
      const newState = { ...state };
      if (runInputInfo && runUuid) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newState[runUuid] = runInputInfo.datasetInputs;
      }
      return newState;
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const newState = { ...state };
      if (action.payload && action.payload.runs) {
        action.payload.runs.forEach((runJson: any) => {
          if (!runJson) {
            return;
          }
          const runInputInfo = runJson.inputs;
          const runUuid = runJson.info.runUuid;
          if (runInputInfo && runUuid) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            newState[runUuid] = runInputInfo.datasetInputs;
          }
        });
      }
      return newState;
    }
    default:
      return state;
  }
};

export const runInfosByUuid = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const runInfo: RunInfoEntity = action.payload.run.info;
      return amendRunInfosByUuid(state, runInfo);
    }
    case fulfilled(SEARCH_RUNS_API): {
      const newState = {};
      if (action.payload && action.payload.runs) {
        action.payload.runs.forEach((rJson: any) => {
          const runInfo: RunInfoEntity = rJson.info;
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runInfo.runUuid] = runInfo;
        });
      }
      return newState;
    }
    case rejected(SEARCH_RUNS_API): {
      return {};
    }
    case fulfilled(LOAD_MORE_RUNS_API): {
      const newState = { ...state };
      if (action.payload && action.payload.runs) {
        action.payload.runs.forEach((rJson: any) => {
          const runInfo: RunInfoEntity = rJson.info;
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runInfo.runUuid] = runInfo;
        });
      }
      return newState;
    }
    default:
      return state;
  }
};

export const runInfoOrderByUuid = (state: string[] = [], action: any) => {
  switch (action.type) {
    case fulfilled(SEARCH_RUNS_API): {
      const newState: Set<string> = new Set();
      if (action.payload && action.payload.runs) {
        action.payload.runs.forEach((rJson: any) => {
          const runInfo: RunInfoEntity = rJson.info;
          newState.add(runInfo.runUuid);
        });
      }
      const newStateArray = Array.from(newState);
      if (isEqual(state, newStateArray)) {
        return state;
      }
      return newStateArray;
    }
    case fulfilled(LOAD_MORE_RUNS_API): {
      const newState: Set<string> = new Set(state);
      if (action.payload && action.payload.runs) {
        action.payload.runs.forEach((rJson: any) => {
          const runInfo: RunInfoEntity = rJson.info;
          newState.add(runInfo.runUuid);
        });
      }
      return Array.from(newState);
    }
    case rejected(SEARCH_RUNS_API): {
      return [];
    }
    default:
      return state;
  }
};

export const modelVersionsByRunUuid = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(SEARCH_MODEL_VERSIONS): {
      let newState: Record<string, ModelVersionInfoEntity[]> = { ...state };
      const updatedState: Record<string, ModelVersionInfoEntity[]> = {};
      if (action.payload) {
        const modelVersions: ModelVersionInfoEntity[] = action.payload[getProtoField('model_versions')];
        if (modelVersions) {
          modelVersions.forEach((model_version: any) => {
            if (model_version.run_id in updatedState) {
              updatedState[model_version.run_id].push(model_version);
            } else {
              updatedState[model_version.run_id] = [model_version];
            }
          });
        }
      }
      newState = { ...newState, ...updatedState };
      if (isEqual(state, newState)) {
        return state;
      }
      return newState;
    }
    default:
      return state;
  }
};

const amendRunInfosByUuid = (state: any, runInfo: any) => {
  return {
    ...state,
    [runInfo.runUuid]: runInfo,
  };
};

export const getParams = (runUuid: any, state: any) => {
  const params = state.entities.paramsByRunUuid[runUuid];
  if (params) {
    return params;
  } else {
    return {};
  }
};

export const paramsByRunUuid = (state = {}, action: any) => {
  const paramArrToObject = (params: any) => {
    const paramObj = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    params.forEach((p: any) => (paramObj[p.key] = (Param as any).fromJs(p)));
    return paramObj;
  };
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const { run } = action.payload;
      const runUuid = run.info.runUuid;
      const params = run.data.params || [];
      const newState = { ...state };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newState[runUuid] = paramArrToObject(params);
      return newState;
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const { runs } = action.payload;
      const newState = { ...state };
      if (runs) {
        runs.forEach((rJson: any) => {
          const runUuid = rJson.info.runUuid;
          const params = rJson.data.params || [];
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid] = paramArrToObject(params);
        });
      }
      return newState;
    }
    default:
      return state;
  }
};

export const getRunTags = (runUuid: any, state: any) => state.entities.tagsByRunUuid[runUuid] || {};

export const getExperimentTags = (experimentId: any, state: any) => {
  const tags = state.entities.experimentTagsByExperimentId[experimentId];
  return tags || {};
};

export const tagsByRunUuid = (state = {}, action: any) => {
  const tagArrToObject = (tags: any) => {
    const tagObj = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    tags.forEach((tag: any) => (tagObj[tag.key] = (RunTag as any).fromJs(tag)));
    return tagObj;
  };
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const runInfo: RunInfoEntity = action.payload.run.info;
      const tags = action.payload.run.data.tags || [];
      const runUuid = runInfo.runUuid;
      const newState = { ...state };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newState[runUuid] = tagArrToObject(tags);
      return newState;
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const { runs } = action.payload;
      const newState = { ...state };
      if (runs) {
        runs.forEach((rJson: any) => {
          const runUuid = rJson.info.runUuid;
          const tags = rJson.data.tags || [];
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid] = tagArrToObject(tags);
        });
      }
      return newState;
    }
    case fulfilled(SET_TAG_API): {
      const tag = { key: action.meta.key, value: action.meta.value };
      return amendTagsByRunUuid(state, [tag], action.meta.runUuid);
    }
    case fulfilled(DELETE_TAG_API): {
      const { runUuid } = action.meta;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const oldTags = state[runUuid] ? state[runUuid] : {};
      const newTags = omit(oldTags, action.meta.key);
      if (Object.keys(newTags).length === 0) {
        return omit({ ...state }, runUuid);
      } else {
        return { ...state, [runUuid]: newTags };
      }
    }
    default:
      return state;
  }
};

const amendTagsByRunUuid = (state: any, tags: any, runUuid: any) => {
  let newState = { ...state };
  if (tags) {
    tags.forEach((tJson: any) => {
      const tag = (RunTag as any).fromJs(tJson);
      const oldTags = newState[runUuid] ? newState[runUuid] : {};
      newState = {
        ...newState,
        [runUuid]: {
          ...oldTags,
          [tag.key]: tag,
        },
      };
    });
  }
  return newState;
};

export const experimentTagsByExperimentId = (state = {}, action: any) => {
  const tagArrToObject = (tags: any) => {
    const tagObj = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    tags.forEach((tag: any) => (tagObj[tag.key] = (ExperimentTag as any).fromJs(tag)));
    return tagObj;
  };
  switch (action.type) {
    case fulfilled(GET_EXPERIMENT_API): {
      const { experiment } = action.payload;
      const newState = { ...state };
      const tags = experiment.tags || [];
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newState[experiment.experimentId] = tagArrToObject(tags);
      return newState;
    }
    case fulfilled(SET_EXPERIMENT_TAG_API): {
      const tag = { key: action.meta.key, value: action.meta.value };
      return amendExperimentTagsByExperimentId(state, [tag], action.meta.experimentId);
    }
    default:
      return state;
  }
};

const amendExperimentTagsByExperimentId = (state: any, tags: any, expId: any) => {
  let newState = { ...state };
  if (tags) {
    tags.forEach((tJson: any) => {
      const tag = (ExperimentTag as any).fromJs(tJson);
      const oldTags = newState[expId] ? newState[expId] : {};
      newState = {
        ...newState,
        [expId]: {
          ...oldTags,
          [tag.key]: tag,
        },
      };
    });
  }
  return newState;
};

export const getArtifacts = (runUuid: any, state: any) => {
  return state.entities.artifactsByRunUuid[runUuid];
};

export const artifactsByRunUuid = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(LIST_ARTIFACTS_LOGGED_MODEL_API):
    case fulfilled(LIST_ARTIFACTS_API): {
      const queryPath = action.meta.path;
      const { runUuid, loggedModelId } = action.meta;

      // If the artifact belongs to a logged model instead of run, use its id as a store identifier
      const storeIdentifier = loggedModelId ?? runUuid;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      let artifactNode = state[storeIdentifier] || new ArtifactNode(true);
      // Make deep copy.
      artifactNode = artifactNode.deepCopy();
      const { files } = action.payload;
      // If there are no files, or if its not a dbfs:/ bucket, we show No Artifacts Recorded.
      if (files === undefined) {
        return {
          ...state,
          [storeIdentifier]: artifactNode,
        };
      }
      // Sort files to list directories first in the artifact tree view.
      files.sort((a: any, b: any) => b.is_dir - a.is_dir);
      // Do not coerce these out of JSON because we use JSON.parse(JSON.stringify
      // to deep copy. This does not work on the autogenerated immutable objects.
      if (queryPath === undefined) {
        // If queryPath is undefined, then we should set the root's children.
        artifactNode.setChildren(files);
      } else {
        // Otherwise, traverse the queryPath to get to the appropriate artifact node.
        // Filter out empty strings caused by spurious instances of slash, i.e.
        // "model/" instead of just "model"
        const pathParts = queryPath.split('/').filter((item: any) => item);
        let curArtifactNode = artifactNode;
        pathParts.forEach((part: any) => {
          curArtifactNode = curArtifactNode.children[part];
        });
        // Then set children on that artifact node.
        // ML-12477: This can throw error if we supply an invalid queryPath in the URL.
        try {
          if (curArtifactNode.fileInfo.is_dir) {
            curArtifactNode.setChildren(files);
          }
        } catch (err) {
          Utils.logErrorAndNotifyUser(`Unable to construct the artifact tree.`);
        }
      }
      return {
        ...state,
        [storeIdentifier]: artifactNode,
      };
    }
    default:
      return state;
  }
};

export const getArtifactRootUri = (runUuid: any, state: any) => {
  return state.entities.artifactRootUriByRunUuid[runUuid];
};

export const artifactRootUriByRunUuid = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const runInfo: RunInfoEntity = action.payload.run.info;
      const runUuid = runInfo.runUuid;
      return {
        ...state,
        [runUuid]: runInfo.artifactUri,
      };
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const { runs } = action.payload;
      const newState: any = { ...state };
      if (runs) {
        runs.forEach((rJson: any) => {
          const runUuid = rJson.info.runUuid;
          const tags = rJson.data.tags || [];
          newState[runUuid] = rJson.info.artifactUri;
        });
      }
      return newState;
    }
    default:
      return state;
  }
};

const getExperimentDatasets = (experimentId: string, state: any) => {
  return state.entities.datasetsByExperimentId[experimentId];
};

export const datasetsByExperimentId = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(SEARCH_DATASETS_API): {
      let newState: Record<string, DatasetSummary[]> = Object.assign({}, state);
      if (action.payload && action.payload.dataset_summaries) {
        newState = {};
        action.payload.dataset_summaries.forEach((dataset_summary: DatasetSummary) => {
          newState[dataset_summary.experiment_id] = [
            ...(newState[dataset_summary.experiment_id] || []),
            dataset_summary,
          ];
        });
      }
      return newState;
    }
    default:
      return state;
  }
};

const entities = combineReducers({
  experimentsById,
  runInfosByUuid,
  runInfoOrderByUuid,
  runDatasetsByUuid,
  runInputsOutputsByUuid,
  runUuidsMatchingFilter,
  metricsByRunUuid,
  imagesByRunUuid,
  latestMetricsByRunUuid,
  minMetricsByRunUuid,
  maxMetricsByRunUuid,
  paramsByRunUuid,
  tagsByRunUuid,
  experimentTagsByExperimentId,
  artifactsByRunUuid,
  artifactRootUriByRunUuid,
  modelVersionsByRunUuid,
  datasetsByExperimentId,
  sampledMetricsByRunUuid,
  colorByRunUuid,
  ...modelRegistryReducers,
});

export const getSharedParamKeysByRunUuids = (runUuids: any, state: any) =>
  intersection(...runUuids.map((runUuid: any) => Object.keys(state.entities.paramsByRunUuid[runUuid])));

export const getSharedMetricKeysByRunUuids = (runUuids: any, state: any) =>
  intersection(...runUuids.map((runUuid: any) => Object.keys(state.entities.latestMetricsByRunUuid[runUuid])));

export const getAllParamKeysByRunUuids = (runUuids: any, state: any) =>
  union(...runUuids.map((runUuid: any) => Object.keys(state.entities.paramsByRunUuid[runUuid])));

export const getAllMetricKeysByRunUuids = (runUuids: any, state: any) =>
  union(...runUuids.map((runUuid: any) => Object.keys(state.entities.latestMetricsByRunUuid[runUuid])));

export const getApis = (requestIds: any, state: any) => {
  return requestIds.map((id: any) => state.apis[id] || {});
};

export const apis = (state: ApisReducerReduxState = {}, action: any): ApisReducerReduxState => {
  if (isPendingApi(action)) {
    if (!action?.meta?.id) {
      return state;
    }
    return {
      ...state,
      [action.meta.id]: { id: action.meta.id, active: true },
    };
  } else if (isFulfilledApi(action)) {
    if (!action?.meta?.id) {
      return state;
    }
    return {
      ...state,
      [action.meta.id]: { id: action.meta.id, active: false, data: action.payload },
    };
  } else if (isRejectedApi(action)) {
    if (!action?.meta?.id) {
      return state;
    }
    return {
      ...state,
      [action.meta.id]: { id: action.meta.id, active: false, error: action.payload },
    };
  } else {
    return state;
  }
};

// This state is used in the following components to show a breadcrumb link for navigating back to
// the compare-experiments page.
// - RunView
// - CompareRunView
// - MetricView
const defaultCompareExperimentsState: ComparedExperimentsReducerReduxState = {
  // Experiment IDs compared on `/compare-experiments`.
  comparedExperimentIds: [],
  // Indicates whether the user has navigated to `/compare-experiments` before
  // Should be set to false when the user navigates to `/experiments/<experiment_id>`
  hasComparedExperimentsBefore: false,
};
const compareExperiments = (
  state: ComparedExperimentsReducerReduxState = defaultCompareExperimentsState,
  action: any,
): ComparedExperimentsReducerReduxState => {
  if (action.type === SET_COMPARE_EXPERIMENTS) {
    const { comparedExperimentIds, hasComparedExperimentsBefore } = action.payload;
    return {
      ...state,
      comparedExperimentIds,
      hasComparedExperimentsBefore,
    };
  } else {
    return state;
  }
};

export const isErrorModalOpen = (state: any) => {
  return state.views.errorModal.isOpen;
};

export const getErrorModalText = (state: any) => {
  return state.views.errorModal.text;
};

const errorModalDefault = {
  isOpen: false,
  text: '',
};

const errorModal = (state = errorModalDefault, action: any) => {
  switch (action.type) {
    case CLOSE_ERROR_MODAL: {
      return {
        ...state,
        isOpen: false,
      };
    }
    case OPEN_ERROR_MODAL: {
      return {
        isOpen: true,
        text: action.text,
      };
    }
    default:
      return state;
  }
};

export const views = combineReducers({
  errorModal,
});

export const rootReducer = combineReducers({
  entities,
  views,
  apis,
  compareExperiments,
  evaluationData,
  modelGateway,
});

export const getEntities = (state: any) => {
  return state.entities;
};
```

--------------------------------------------------------------------------------

---[FILE: RunColorReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/RunColorReducer.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { fulfilled } from '../../common/utils/ActionUtils';
import { GET_RUN_API, SEARCH_RUNS_API } from '../actions';
import { MLFLOW_RUN_COLOR_TAG } from '../constants';
import {
  RUN_COLOR_ACTION_INITIALIZE_RUN_COLORS,
  RUN_COLOR_ACTION_SET_RUN_COLOR,
  colorByRunUuid,
} from './RunColorReducer';

describe('colorByRunUuid reducer', () => {
  it('handles initialization action', () => {
    const initialState = {};
    const action = {
      type: RUN_COLOR_ACTION_INITIALIZE_RUN_COLORS,
      values: {
        runUuid1: '#FF0000',
        runUuid2: '#0000AA',
      },
    };
    const newState = colorByRunUuid(initialState, action);
    expect(newState).toEqual({
      runUuid1: '#FF0000',
      runUuid2: '#0000AA',
    });
  });

  it('handles setting color action', () => {
    const initialState = {
      runUuid1: '#FF0000',
    };
    const action = {
      type: RUN_COLOR_ACTION_SET_RUN_COLOR,
      runOrGroupUuid: 'runUuid2',
      colorValue: '#0000AA',
    };
    const newState = colorByRunUuid(initialState, action);
    expect(newState).toEqual({
      runUuid1: '#FF0000',
      runUuid2: '#0000AA',
    });
  });

  it('handles API response for a single run', () => {
    const initialState = {};
    const action = {
      type: fulfilled(GET_RUN_API),
      payload: {
        run: {
          info: {
            runUuid: 'runUuid1',
          },
          data: {
            tags: [{ key: MLFLOW_RUN_COLOR_TAG, value: '#FF0000' }],
          },
        },
      },
    };
    const newState = colorByRunUuid(initialState, action);
    expect(newState).toEqual({
      runUuid1: '#FF0000',
    });
  });

  it('handles API response for multiple runs', () => {
    const initialState = {};
    const action = {
      type: fulfilled(SEARCH_RUNS_API),
      payload: {
        runs: [
          {
            info: {
              runUuid: 'runUuid1',
            },
            data: {
              tags: [{ key: MLFLOW_RUN_COLOR_TAG, value: '#FF0000' }],
            },
          },
          {
            info: {
              runUuid: 'runUuid2',
            },
            data: {
              tags: [{ key: MLFLOW_RUN_COLOR_TAG, value: '#0000AA' }],
            },
          },
        ],
      },
    };
    const newState = colorByRunUuid(initialState, action);
    expect(newState).toEqual({
      runUuid1: '#FF0000',
      runUuid2: '#0000AA',
    });
  });

  it('handles unknown action type', () => {
    const initialState = {
      runUuid1: '#FF0000',
    };
    const action = {
      type: 'UNKNOWN_ACTION',
    };
    const newState = colorByRunUuid(initialState, action);
    expect(newState).toEqual({
      runUuid1: '#FF0000',
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunColorReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/RunColorReducer.ts

```typescript
import { fulfilled } from '../../common/utils/ActionUtils';
import { GET_RUN_API, LOAD_MORE_RUNS_API, SEARCH_RUNS_API } from '../actions';
import { MLFLOW_RUN_COLOR_TAG } from '../constants';
import type { RunEntity } from '../types';

export const RUN_COLOR_ACTION_INITIALIZE_RUN_COLORS = 'INITIALIZE_RUN_COLORS';
export const RUN_COLOR_ACTION_SET_RUN_COLOR = 'SET_RUN_COLOR';

/**
 * Reducer for run colors. The state is a mapping from run/group UUIDs to color values.
 * Allows to manually set colors for runs/groups, but also listens to API responses and
 * automatically sets colors for runs that have a color tag.
 */
export const colorByRunUuid = (state: Record<string, string> = {}, action: any) => {
  switch (action.type) {
    case RUN_COLOR_ACTION_INITIALIZE_RUN_COLORS: {
      return { ...state, ...action.values };
    }
    case RUN_COLOR_ACTION_SET_RUN_COLOR: {
      const { runOrGroupUuid, colorValue } = action;
      return { ...state, [runOrGroupUuid]: colorValue };
    }
    case fulfilled(GET_RUN_API): {
      const run: RunEntity = action.payload.run;
      const runUuid = run.info.runUuid;
      const colorTag = run?.data?.tags?.find((tag) => tag.key === MLFLOW_RUN_COLOR_TAG);
      if (colorTag) {
        return { ...state, [runUuid]: colorTag.value };
      }

      return state;
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const newState = { ...state };
      if (action.payload && action.payload.runs) {
        for (const run of action.payload.runs as RunEntity[]) {
          const runUuid = run.info.runUuid;
          const colorTag = run?.data?.tags?.find((tag) => tag.key === MLFLOW_RUN_COLOR_TAG);
          if (colorTag) {
            newState[runUuid] = colorTag.value;
          }
        }
      }
      return newState;
    }

    default:
      return state;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: SampledMetricsReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/SampledMetricsReducer.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { fulfilled, pending, rejected } from '../../common/utils/ActionUtils';
import { createChartAxisRangeKey } from '../components/runs-charts/components/RunsCharts.common';
import { sampledMetricsByRunUuid } from './SampledMetricsReducer';

const testRunIds = ['run_1'];
const testMetricKey = 'test_metric_key';
const testDefaultRangeKey = createChartAxisRangeKey();
const testCustomRangeKey = createChartAxisRangeKey([-100, 200]);

describe('SampledMetricsReducer', () => {
  it('should be able to initialize empty state', () => {
    expect(sampledMetricsByRunUuid(undefined, {} as any)).toEqual({});
  });

  it('should be able to start loading sampled metrics for two ranges', () => {
    const pendingFirstRangeState = sampledMetricsByRunUuid(
      {},
      {
        type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
        meta: {
          runUuids: testRunIds,
          key: testMetricKey,
          rangeKey: testDefaultRangeKey,
          maxResults: 100,
        },
      },
    );
    const pendingSecondRangeState = sampledMetricsByRunUuid(pendingFirstRangeState, {
      type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
      meta: {
        runUuids: testRunIds,
        key: testMetricKey,
        rangeKey: testCustomRangeKey,
        maxResults: 100,
      },
    });
    expect(pendingSecondRangeState).toEqual({
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: true,
            refreshing: false,
            metricsHistory: undefined,
          },
          '-100,200': {
            loading: true,
            refreshing: false,
            metricsHistory: undefined,
          },
        },
      },
    });
  });

  it('should be able to populate sampled metrics for one of ranges', () => {
    const pendingFirstRangeState = sampledMetricsByRunUuid(
      {},
      {
        type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
        meta: {
          runUuids: testRunIds,
          key: testMetricKey,
          rangeKey: testDefaultRangeKey,
          maxResults: 100,
        },
      },
    );
    const pendingSecondRangeState = sampledMetricsByRunUuid(pendingFirstRangeState, {
      type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
      meta: {
        runUuids: testRunIds,
        key: testMetricKey,
        rangeKey: testCustomRangeKey,
        maxResults: 100,
      },
    });
    const loadedFirstRangeState = sampledMetricsByRunUuid(pendingSecondRangeState, {
      type: 'GET_SAMPLED_METRIC_HISTORY_API_BULK_FULFILLED',
      payload: {
        metrics: [
          { run_id: testRunIds[0], key: testMetricKey, value: 123, step: 0, timestamp: 1 } as any,
          { run_id: 'other_run', key: testMetricKey, value: 123, step: 0, timestamp: 1 } as any,
        ],
      },
      meta: {
        runUuids: testRunIds,
        key: testMetricKey,
        rangeKey: testDefaultRangeKey,
        maxResults: 100,
      },
    });
    expect(loadedFirstRangeState).toEqual({
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            lastUpdatedTime: expect.anything(),
            metricsHistory: [{ run_id: testRunIds[0], key: testMetricKey, value: 123, step: 0, timestamp: 1 }],
          },
          '-100,200': {
            loading: true,
            refreshing: false,
            metricsHistory: undefined,
            lastUpdatedTime: undefined,
          },
        },
      },
    });
  });

  it('should be able to save error state', () => {
    const thrownError = new Error('This is an exception');
    const pendingFirstRangeState = sampledMetricsByRunUuid(
      {},
      {
        type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
        meta: {
          runUuids: testRunIds,
          key: testMetricKey,
          rangeKey: testDefaultRangeKey,
          maxResults: 100,
        },
      },
    );
    const errorInTheRangeState = sampledMetricsByRunUuid(pendingFirstRangeState, {
      type: rejected('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
      payload: thrownError,
      meta: {
        runUuids: testRunIds,
        key: testMetricKey,
        rangeKey: testDefaultRangeKey,
        maxResults: 100,
      },
    });
    expect(errorInTheRangeState).toEqual({
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            error: thrownError,
          },
        },
      },
    });
  });

  it('indicates "refreshing" state of sampled metric data', () => {
    const testMetricsHistory = [{ run_id: 'run_1', key: testMetricKey, value: 123, step: 0, timestamp: 1 }] as any;
    const initialState = {
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            metricsHistory: testMetricsHistory,
          },
        },
      },
    };
    const pendingState = sampledMetricsByRunUuid(initialState, {
      type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
      meta: {
        runUuids: testRunIds,
        key: testMetricKey,
        rangeKey: testDefaultRangeKey,
        maxResults: 100,
        isRefreshing: true,
      },
    });

    expect(pendingState).toEqual({
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: true,
            metricsHistory: testMetricsHistory,
          },
        },
      },
    });

    const refreshedState = sampledMetricsByRunUuid(pendingState, {
      type: fulfilled('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
      payload: { metrics: testMetricsHistory },
      meta: {
        runUuids: testRunIds,
        key: testMetricKey,
        rangeKey: testDefaultRangeKey,
        maxResults: 100,
        isRefreshing: true,
      },
    });

    expect(refreshedState).toEqual({
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            metricsHistory: testMetricsHistory,
            lastUpdatedTime: expect.anything(),
          },
        },
      },
    });
  });

  it('handles refreshing state correctly with multiple run IDs', () => {
    const multipleRunIds = ['run_1', 'run_2', 'run_3'];
    const testMetricsHistory = [{ run_id: 'run_1', key: testMetricKey, value: 123, step: 0, timestamp: 1 }] as any;

    const initialState = {
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            metricsHistory: testMetricsHistory,
          },
        },
      },
      run_2: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            metricsHistory: testMetricsHistory,
          },
        },
      },
      run_3: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: false,
            metricsHistory: testMetricsHistory,
          },
        },
      },
    };

    const pendingState = sampledMetricsByRunUuid(initialState, {
      type: pending('GET_SAMPLED_METRIC_HISTORY_API_BULK'),
      meta: {
        runUuids: multipleRunIds,
        key: testMetricKey,
        rangeKey: testDefaultRangeKey,
        maxResults: 100,
        isRefreshing: true,
      },
    });

    expect(pendingState).toEqual({
      run_1: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: true,
            metricsHistory: testMetricsHistory,
          },
        },
      },
      run_2: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: true,
            metricsHistory: testMetricsHistory,
          },
        },
      },
      run_3: {
        test_metric_key: {
          DEFAULT: {
            loading: false,
            refreshing: true,
            metricsHistory: testMetricsHistory,
          },
        },
      },
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SampledMetricsReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/SampledMetricsReducer.ts
Signals: Redux/RTK

```typescript
import { groupBy } from 'lodash';
import { fulfilled, pending, rejected } from '../../common/utils/ActionUtils';
import type { AsyncFulfilledAction, AsyncPendingAction, AsyncRejectedAction } from '../../redux-types';
import {
  GET_SAMPLED_METRIC_HISTORY_API_BULK,
  type GetSampledMetricHistoryBulkAction,
} from '../sdk/SampledMetricHistoryService';
import type { SampledMetricsByRunUuidState } from '../types';

export const sampledMetricsByRunUuid = (
  state: SampledMetricsByRunUuidState = {},
  action:
    | AsyncFulfilledAction<GetSampledMetricHistoryBulkAction>
    | AsyncPendingAction<GetSampledMetricHistoryBulkAction>
    | AsyncRejectedAction<GetSampledMetricHistoryBulkAction>,
) => {
  if (action.type === rejected(GET_SAMPLED_METRIC_HISTORY_API_BULK) && action.meta) {
    const { runUuids, key, rangeKey } = action.meta;
    const updatedState = { ...state };
    for (const runUuid of runUuids) {
      if (updatedState[runUuid]?.[key]?.[rangeKey]) {
        const existingEntry = updatedState[runUuid][key][rangeKey];
        updatedState[runUuid][key][rangeKey] = {
          // In case of failure, retain previous data entry and set error
          ...existingEntry,
          error: action.payload,
          refreshing: false,
          loading: false,
        };
      }
    }
    return updatedState;
  }
  if (action.type === pending(GET_SAMPLED_METRIC_HISTORY_API_BULK) && action.meta) {
    const { runUuids, key, rangeKey, isRefreshing } = action.meta;
    const updatedState = { ...state };
    for (const runUuid of runUuids) {
      if (!updatedState[runUuid]) {
        updatedState[runUuid] = {
          [key]: {
            [rangeKey]: {
              metricsHistory: undefined,
              refreshing: false,
              loading: true,
            },
          },
        };
      } else if (!updatedState[runUuid][key]) {
        updatedState[runUuid][key] = {
          [rangeKey]: {
            metricsHistory: undefined,
            refreshing: false,
            loading: true,
          },
        };
      } else if (!updatedState[runUuid][key][rangeKey]) {
        updatedState[runUuid][key][rangeKey] = {
          metricsHistory: undefined,
          refreshing: false,
          loading: true,
        };
      } else if (updatedState[runUuid][key][rangeKey] && isRefreshing) {
        updatedState[runUuid][key][rangeKey] = {
          ...updatedState[runUuid][key][rangeKey],
          refreshing: true,
        };
      }
    }
    return updatedState;
  }
  if (action.type === fulfilled(GET_SAMPLED_METRIC_HISTORY_API_BULK) && action.meta) {
    const { runUuids, key, rangeKey } = action.meta;

    const updatedState = { ...state };
    const { metrics } = action.payload;
    const resultsByRunUuid = groupBy(metrics, 'run_id');

    for (const runUuid of runUuids) {
      const resultList = resultsByRunUuid[runUuid];
      if (updatedState[runUuid]?.[key]?.[rangeKey]) {
        updatedState[runUuid][key][rangeKey] = {
          metricsHistory: resultList || [],
          loading: false,
          refreshing: false,
          lastUpdatedTime: Date.now(),
        };
      }
    }
    return updatedState;
  }
  return state;
};
```

--------------------------------------------------------------------------------

````
