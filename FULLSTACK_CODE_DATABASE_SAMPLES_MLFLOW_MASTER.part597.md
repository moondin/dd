---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 597
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 597 of 991)

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

---[FILE: reducers.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/reducers.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import {
  SEARCH_REGISTERED_MODELS,
  SEARCH_MODEL_VERSIONS,
  GET_REGISTERED_MODEL,
  GET_MODEL_VERSION,
  DELETE_MODEL_VERSION,
  DELETE_REGISTERED_MODEL,
  SET_REGISTERED_MODEL_TAG,
  DELETE_REGISTERED_MODEL_TAG,
  SET_MODEL_VERSION_TAG,
  DELETE_MODEL_VERSION_TAG,
  PARSE_MLMODEL_FILE,
} from './actions';
import { getProtoField } from './utils';
import { flatMap, isEmpty, isEqual, omit } from 'lodash';
import { fulfilled, rejected } from '../common/utils/ActionUtils';
import { RegisteredModelTag, ModelVersionTag } from './sdk/ModelRegistryMessages';

const modelByName = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(SEARCH_REGISTERED_MODELS): {
      const models = action.payload[getProtoField('registered_models')];
      const nameToModelMap = {};
      if (models) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        models.forEach((model: any) => (nameToModelMap[model.name] = model));
      }
      return {
        ...nameToModelMap,
      };
    }
    case rejected(SEARCH_REGISTERED_MODELS): {
      return {};
    }
    case fulfilled(GET_REGISTERED_MODEL): {
      const detailedModel = action.payload[getProtoField('registered_model')];

      // If model retrieved from API contains no assigned aliases,
      // the corresponding field will be excluded from the payload.
      // We set it explicitly to make sure it works properly with the equality check below.
      detailedModel.aliases ||= [];

      const { modelName } = action.meta;
      const modelWithUpdatedMetadata = {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        ...state[modelName],
        ...detailedModel,
      };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (isEqual(modelWithUpdatedMetadata, state[modelName])) {
        return state;
      }
      return {
        ...state,
        ...{ [modelName]: modelWithUpdatedMetadata },
      };
    }
    case fulfilled(DELETE_REGISTERED_MODEL): {
      const { model } = action.meta;
      return omit(state, model.name);
    }
    default:
      return state;
  }
};

// 2-levels lookup for model version indexed by (modelName, version)
const modelVersionsByModel = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(GET_MODEL_VERSION): {
      const modelVersion = action.payload[getProtoField('model_version')];
      const { modelName } = action.meta;
      const updatedMap = {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        ...state[modelName],
        [modelVersion.version]: modelVersion,
      };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (isEqual(state[modelName], updatedMap)) {
        return state;
      }
      return {
        ...state,
        [modelName]: updatedMap,
      };
    }
    case fulfilled(SEARCH_MODEL_VERSIONS): {
      const modelVersions = action.payload[getProtoField('model_versions')];
      const nameToModelVersionMap: Record<string, Record<string, any>> = {};
      if (modelVersions) {
        modelVersions.forEach((modelVersion: any) => {
          const { name, version } = modelVersion;
          (nameToModelVersionMap[name] ||= {})[version] = modelVersion;
        });
      }
      return {
        ...nameToModelVersionMap,
      };
    }
    case fulfilled(DELETE_MODEL_VERSION): {
      const { modelName, version } = action.meta;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const modelVersionByVersion = state[modelName];
      return {
        ...state,
        [modelName]: omit(modelVersionByVersion, version),
      };
    }
    case fulfilled(DELETE_REGISTERED_MODEL): {
      const { model } = action.meta;
      return omit(state, model.name);
    }
    default:
      return state;
  }
};

const mlModelArtifactByModelVersion = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(PARSE_MLMODEL_FILE): {
      const artifact = action.payload;
      const { modelName, version } = action.meta;
      return {
        ...state,
        [modelName]: {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          ...state[modelName],
          [version]: artifact,
        },
      };
    }
    default:
      return state;
  }
};

export const getModelVersionSchemas = (state: any, modelName: any, version: any) => {
  const schemaMap = {};
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  schemaMap['inputs'] = [];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  schemaMap['outputs'] = [];
  if (
    state.entities.mlModelArtifactByModelVersion[modelName] &&
    state.entities.mlModelArtifactByModelVersion[modelName][version]
  ) {
    const artifact = state.entities.mlModelArtifactByModelVersion[modelName][version];
    if (artifact.signature) {
      if (artifact.signature.inputs) {
        try {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          schemaMap['inputs'] = JSON.parse(artifact.signature.inputs.replace(/(\r\n|\n|\r)/gm, ''));
        } catch (error) {
          // eslint-disable-next-line no-console -- TODO(FEINF-3587)
          console.error(error);
        }
      }
      if (artifact.signature.outputs) {
        try {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          schemaMap['outputs'] = JSON.parse(artifact.signature.outputs.replace(/(\r\n|\n|\r)/gm, ''));
        } catch (error) {
          // eslint-disable-next-line no-console -- TODO(FEINF-3587)
          console.error(error);
        }
      }
    }
  }
  return schemaMap;
};

export const getModelVersion = (state: any, modelName: any, version: any) => {
  const modelVersions = state.entities.modelVersionsByModel[modelName];
  return modelVersions && modelVersions[version];
};

export const getModelVersions = (state: any, modelName: any) => {
  const modelVersions = state.entities.modelVersionsByModel[modelName];
  return modelVersions && Object.values(modelVersions);
};

export const getAllModelVersions = (state: any) => {
  return flatMap(Object.values(state.entities.modelVersionsByModel), (modelVersionByVersion) =>
    // @ts-expect-error TS(2769): No overload matches this call.
    Object.values(modelVersionByVersion),
  );
};

const tagsByRegisteredModel = (state = {}, action: any) => {
  const tagArrToObject = (tags: any) => {
    const tagObj = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    tags.forEach((tag: any) => (tagObj[tag.key] = (RegisteredModelTag as any).fromJs(tag)));
    return tagObj;
  };
  switch (action.type) {
    case fulfilled(GET_REGISTERED_MODEL): {
      const detailedModel = action.payload[getProtoField('registered_model')];
      const { modelName } = action.meta;
      if (detailedModel.tags && detailedModel.tags.length > 0) {
        const { tags } = detailedModel;
        const newState = { ...state };
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newState[modelName] = tagArrToObject(tags);
        return isEqual(newState, state) ? state : newState;
      } else {
        return state;
      }
    }
    case fulfilled(SET_REGISTERED_MODEL_TAG): {
      const { modelName, key, value } = action.meta;
      const tag = (RegisteredModelTag as any).fromJs({
        key: key,
        value: value,
      });
      let newState = { ...state };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const oldTags = newState[modelName] || {};
      newState = {
        ...newState,
        [modelName]: {
          ...oldTags,
          [tag.key]: tag,
        },
      };
      return newState;
    }
    case fulfilled(DELETE_REGISTERED_MODEL_TAG): {
      const { modelName, key } = action.meta;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const oldTags = state[modelName] || {};
      const newTags = omit(oldTags, key);
      if (Object.keys(newTags).length === 0) {
        return omit({ ...state }, modelName);
      } else {
        return { ...state, [modelName]: newTags };
      }
    }
    default:
      return state;
  }
};

export const getRegisteredModelTags = (modelName: any, state: any) =>
  state.entities.tagsByRegisteredModel[modelName] || {};

const tagsByModelVersion = (state = {}, action: any) => {
  const tagArrToObject = (tags: any) => {
    const tagObj = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    tags.forEach((tag: any) => (tagObj[tag.key] = (ModelVersionTag as any).fromJs(tag)));
    return tagObj;
  };
  switch (action.type) {
    case fulfilled(GET_MODEL_VERSION): {
      const modelVersion = action.payload[getProtoField('model_version')];
      const { modelName, version } = action.meta;
      if (modelVersion.tags && modelVersion.tags.length > 0) {
        const { tags } = modelVersion;
        const newState = { ...state };
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newState[modelName] = newState[modelName] || {};
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newState[modelName][version] = tagArrToObject(tags);
        return newState;
      } else {
        return state;
      }
    }
    case fulfilled(SET_MODEL_VERSION_TAG): {
      const { modelName, version, key, value } = action.meta;
      const tag = (ModelVersionTag as any).fromJs({
        key: key,
        value: value,
      });
      const newState = { ...state };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newState[modelName] = newState[modelName] || {};
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const oldTags = newState[modelName][version] || {};
      return {
        ...newState,
        [modelName]: {
          [version]: {
            ...oldTags,
            [tag.key]: tag,
          },
        },
      };
    }
    case fulfilled(DELETE_MODEL_VERSION_TAG): {
      const { modelName, version, key } = action.meta;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const oldTags = state[modelName] ? state[modelName][version] || {} : {};
      const newState = { ...state };
      const newTags = omit(oldTags, key);
      if (Object.keys(newTags).length === 0) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newState[modelName] = omit({ ...state[modelName] }, version);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (isEmpty(newState[modelName])) {
          return omit({ ...state }, modelName);
        } else {
          return newState;
        }
      } else {
        return {
          ...newState,
          [modelName]: {
            [version]: newTags,
          },
        };
      }
    }
    default:
      return state;
  }
};

export const getModelVersionTags = (modelName: any, version: any, state: any) => {
  if (state.entities.tagsByModelVersion[modelName]) {
    return state.entities.tagsByModelVersion[modelName][version] || {};
  } else {
    return {};
  }
};

const reducers = {
  modelByName,
  modelVersionsByModel,
  tagsByRegisteredModel,
  tagsByModelVersion,
  mlModelArtifactByModelVersion,
};

export default reducers;
```

--------------------------------------------------------------------------------

---[FILE: route-defs.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/route-defs.ts

```typescript
import { createLazyRouteElement } from '../common/utils/RoutingUtils';

import { ModelRegistryRoutePaths } from './routes';

export const getRouteDefs = () => [
  {
    path: ModelRegistryRoutePaths.modelListPage,
    element: createLazyRouteElement(() => import('./components/ModelListPageWrapper')),
    pageId: 'mlflow.model-registry.model-list',
  },
  {
    path: ModelRegistryRoutePaths.modelPage,
    element: createLazyRouteElement(() => import('./components/ModelPage')),
    pageId: 'mlflow.model-registry.model-page',
  },
  {
    path: ModelRegistryRoutePaths.modelSubpage,
    element: createLazyRouteElement(() => import('./components/ModelPage')),
    pageId: 'mlflow.model-registry.model-page.subpage',
  },
  {
    path: ModelRegistryRoutePaths.modelSubpageRouteWithName,
    element: createLazyRouteElement(() => import('./components/ModelPage')),
    pageId: 'mlflow.model-registry.model-page.subpage.section',
  },
  {
    path: ModelRegistryRoutePaths.modelVersionPage,
    element: createLazyRouteElement(() => import('./components/ModelVersionPage')),
    pageId: 'mlflow.model-registry.model-version-page',
  },
  {
    path: ModelRegistryRoutePaths.compareModelVersionsPage,
    element: createLazyRouteElement(() => import('./components/CompareModelVersionsPage')),
    pageId: 'mlflow.model-registry.compare-model-versions',
  },
];
```

--------------------------------------------------------------------------------

---[FILE: routes.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/routes.test.tsx

```typescript
import { describe, expect, test } from '@jest/globals';
import { ModelRegistryRoutes } from './routes';

describe('model registry page routes working in Databricks path-based router', () => {
  test('yields correct route paths for listing page', () => {
    // eslint-disable-next-line jest/no-standalone-expect
    expect(ModelRegistryRoutes.modelListPageRoute).toEqual('/models');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: routes.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/routes.ts

```typescript
import { createMLflowRoutePath, generatePath } from '../common/utils/RoutingUtils';

// Route path definitions (used in defining route elements)
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class ModelRegistryRoutePaths {
  static get modelListPage() {
    return createMLflowRoutePath('/models');
  }
  static get modelPage() {
    return createMLflowRoutePath('/models/:modelName');
  }
  static get modelSubpage() {
    return createMLflowRoutePath('/models/:modelName/:subpage');
  }
  static get modelSubpageRouteWithName() {
    return createMLflowRoutePath('/models/:modelName/:subpage/:name');
  }
  static get modelVersionPage() {
    return createMLflowRoutePath('/models/:modelName/versions/:version');
  }
  static get compareModelVersionsPage() {
    return createMLflowRoutePath('/compare-model-versions');
  }
  static get createModel() {
    return createMLflowRoutePath('/createModel');
  }
}

// Concrete routes and functions for generating parametrized paths
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class ModelRegistryRoutes {
  static get modelListPageRoute() {
    return ModelRegistryRoutePaths.modelListPage;
  }
  static getModelPageRoute(modelName: string) {
    return generatePath(ModelRegistryRoutePaths.modelPage, {
      modelName: encodeURIComponent(modelName),
    });
  }
  static getModelPageServingRoute(modelName: string) {
    return generatePath(ModelRegistryRoutePaths.modelSubpage, {
      modelName: encodeURIComponent(modelName),
      subpage: PANES.SERVING,
    });
  }
  static getModelVersionPageRoute(modelName: string, version: string) {
    return generatePath(ModelRegistryRoutePaths.modelVersionPage, {
      modelName: encodeURIComponent(modelName),
      version,
    });
  }
  static getCompareModelVersionsPageRoute(modelName: string, runsToVersions: Record<string, string>) {
    const path = generatePath(ModelRegistryRoutePaths.compareModelVersionsPage);
    const query =
      `?name=${JSON.stringify(encodeURIComponent(modelName))}` +
      `&runs=${JSON.stringify(runsToVersions, (_, v) => (v === undefined ? null : v))}`;

    return [path, query].join('');
  }
}

export const PANES = Object.freeze({
  DETAILS: 'details',
  SERVING: 'serving',
});
```

--------------------------------------------------------------------------------

---[FILE: services.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/services.ts

```typescript
import {
  deleteJson,
  getBigIntJson,
  getJson,
  patchBigIntJson,
  patchJson,
  postBigIntJson,
  postJson,
} from '../common/utils/FetchUtils';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class Services {
  /**
   * Create a registered model
   */
  static createRegisteredModel = (data: any) =>
    postBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/create', data });

  /**
   * List all registered models
   */
  static listRegisteredModels = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/list', data });

  /**
   * Search registered models
   */
  static searchRegisteredModels = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/search', data });

  /**
   * Update registered model
   */
  static updateRegisteredModel = (data: any) =>
    patchBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/update', data });

  /**
   * Delete registered model
   */
  static deleteRegisteredModel = (data: any) =>
    deleteJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/delete', data });

  /**
   * Set registered model tag
   */
  static setRegisteredModelTag = (data: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/set-tag', data });

  /**
   * Delete registered model tag
   */
  static deleteRegisteredModelTag = (data: any) =>
    deleteJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/delete-tag', data });

  /**
   * Create model version
   */
  static createModelVersion = (data: any) =>
    postBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/create', data });

  /**
   * Search model versions
   */
  static searchModelVersions = (data: any) =>
    getJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/search', data });

  /**
   * Update model version
   */
  static updateModelVersion = (data: any) =>
    patchJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/update', data });

  /**
   * Transition model version stage
   */
  static transitionModelVersionStage = (data: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/transition-stage', data });

  /**
   * Delete model version
   */
  static deleteModelVersion = (data: any) =>
    deleteJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/delete', data });

  /**
   * Get individual registered model
   */
  static getRegisteredModel = (data: any) =>
    getJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/get', data });

  /**
   * Get individual model version
   */
  static getModelVersion = (data: any) => getJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/get', data });

  /**
   * Set model version tag
   */
  static setModelVersionTag = (data: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/set-tag', data });

  /**
   * Delete model version tag
   */
  static deleteModelVersionTag = (data: any) =>
    deleteJson({ relativeUrl: 'ajax-api/2.0/mlflow/model-versions/delete-tag', data });

  /**
   * Set model version alias
   */
  static setModelVersionAlias = (data: { name: string; version: string; alias: string }) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/alias', data });

  /**
   * Delete model version alias
   */
  static deleteModelVersionAlias = (data: { name: string; version: string; alias: string }) =>
    deleteJson({ relativeUrl: 'ajax-api/2.0/mlflow/registered-models/alias', data });
}
```

--------------------------------------------------------------------------------

---[FILE: test-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/test-utils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

/* prettier-ignore */
export const mockRegisteredModelDetailed = (
  name: any,
  latestVersions = [],
  tags = [],
  _unused1 = '',
  _unused2 = 0,
) => {
  return {
    creation_timestamp: 1571344731467,
    last_updated_timestamp: 1573581360069,
    latest_versions: latestVersions,
    name,
    tags,
  };
};

export const mockModelVersionDetailed = (
  name: any,
  version: any,
  stage: any,
  status: any,
  tags = [],
  run_link = undefined,
  run_id = 'b99a0fc567ae4d32994392c800c0b6ce',
  user_id = 'richard@example.com',
  source = 'path/to/model',
) => {
  return {
    name,
    // Use version-based timestamp to make creation_timestamp differ across model versions
    // and prevent React duplicate key warning.
    creation_timestamp: version.toString(),
    last_updated_timestamp: (version + 1).toString(),
    user_id: user_id,
    current_stage: stage,
    description: '',
    source: source,
    run_id: run_id,
    run_link: run_link,
    status,
    version,
    tags,
  };
};

export const mockGetFieldValue = (comment: any, archive: any) => {
  return (key: any) => {
    if (key === 'comment') {
      return comment;
    } else if (key === 'archiveExistingVersions') {
      return archive;
    }
    throw new Error('Missing mockGetFieldValue key');
  };
};
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/utils.tsx
Signals: React

```typescript
import React from 'react';
import {
  CircleIcon as DuboisCircleIcon,
  CheckCircleIcon,
  useDesignSystemTheme,
  WarningFillIcon,
} from '@databricks/design-system';
/**
 * Get a unique key for a model version object.
 * @param modelName
 * @param version
 * @returns {string}
 */
export const getModelVersionKey = (modelName: any, version: any) => `${modelName}_${version}`;

export const getProtoField = (fieldName: any) => `${fieldName}`;

export function ReadyIcon() {
  const { theme } = useDesignSystemTheme();
  return <CheckCircleIcon css={{ color: theme.colors.textValidationSuccess }} />;
}

export function FailedIcon() {
  const { theme } = useDesignSystemTheme();
  return <WarningFillIcon css={{ color: theme.colors.textValidationDanger }} />;
}

type CircleIconProps = {
  type: 'FAILED' | 'PENDING' | 'READY';
};

export function CircleIcon({ type }: CircleIconProps) {
  const { theme } = useDesignSystemTheme();
  let color;
  switch (type) {
    case 'FAILED': {
      color = theme.colors.textValidationDanger;
      break;
    }
    case 'PENDING': {
      color = theme.colors.yellow400; // textValidationWarning was too dark/red
      break;
    }
    case 'READY':
    default: {
      color = theme.colors.green500;
      break;
    }
  }
  return <DuboisCircleIcon css={{ color, fontSize: 16 }} />;
}
```

--------------------------------------------------------------------------------

---[FILE: CompareModelVersionsPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CompareModelVersionsPage.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { CompareModelVersionsPageImpl, CompareModelVersionsPage } from './CompareModelVersionsPage';

describe('CompareModelVersionPage', () => {
  let wrapper;
  let minimalStore: any;
  let minimalProps: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    const modelName = 'normal-model-name';
    minimalProps = {
      location: {
        search:
          '?name=' +
          encodeURI(JSON.stringify(modelName)) +
          '&runs=' +
          JSON.stringify({
            1: '123',
            2: '234',
          }),
      },
      versionsToRuns: {
        1: '123',
        2: '234',
      },
      getRegisteredModelApi: jest.fn(),
      getModelVersionApi: jest.fn(),
      parseMlModelFile: jest.fn(),
    };
    minimalStore = mockStore({
      apis: {},
    });
  });

  test('should render with minimal props and store without exploding', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CompareModelVersionsPage {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    );
  });

  test('should render with name with model name with special characters', () => {
    const props: any = {
      location: {
        search:
          '?name=' +
          encodeURI(JSON.stringify('funky?!@#$^*()_=name~[]')) +
          '&runs=' +
          JSON.stringify({
            1: '123',
            2: '234',
          }),
      },
    };
    wrapper = mount(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CompareModelVersionsPage {...props} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find(CompareModelVersionsPageImpl).length).toBe(1);
  });

  test('should remove getRunRequest and getMlModelFileRequest api ids from state on 404', async () => {
    const mockError = {
      getErrorCode() {
        return 'RESOURCE_DOES_NOT_EXIST';
      },
    };
    const getRunApi = jest.fn().mockReturnValue(Promise.reject(mockError));
    const getModelVersionArtifactApi = jest.fn().mockReturnValue(Promise.reject(mockError));
    const myProps = {
      getRunApi: getRunApi,
      getModelVersionArtifactApi: getModelVersionArtifactApi,
      ...minimalProps,
    };
    const wrapper2 = shallow(<CompareModelVersionsPageImpl {...myProps} />);
    expect(wrapper2.state('requestIds').length).toBe(4);
    await expect(getRunApi).toHaveBeenCalled();
    await expect(getModelVersionArtifactApi).toHaveBeenCalled();
    expect(wrapper2.state('requestIds').length).toBe(2);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareModelVersionsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CompareModelVersionsPage.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import qs from 'qs';
import { connect } from 'react-redux';
import { getRunApi } from '../../experiment-tracking/actions';
import { getUUID } from '../../common/utils/ActionUtils';
import { getRegisteredModelApi, getModelVersionApi, getModelVersionArtifactApi, parseMlModelFile } from '../actions';
import RequestStateWrapper from '../../common/components/RequestStateWrapper';
import { CompareModelVersionsView } from './CompareModelVersionsView';
import { without } from 'lodash';
import { PageContainer } from '../../common/components/PageContainer';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';

type CompareModelVersionsPageImplProps = {
  modelName: string;
  versionsToRuns: any;
  getRunApi: (...args: any[]) => any;
  getRegisteredModelApi: (...args: any[]) => any;
  getModelVersionApi: (...args: any[]) => any;
  getModelVersionArtifactApi: (...args: any[]) => any;
  parseMlModelFile: (...args: any[]) => any;
};

type CompareModelVersionsPageImplState = any;

// TODO: Write integration tests for this component
export class CompareModelVersionsPageImpl extends Component<
  CompareModelVersionsPageImplProps,
  CompareModelVersionsPageImplState
> {
  registeredModelRequestId = getUUID();
  versionRequestId = getUUID();
  runRequestId = getUUID();
  getMlModelFileRequestId = getUUID();

  state = {
    requestIds: [
      // requests that must be fulfilled before rendering
      this.registeredModelRequestId,
      this.runRequestId,
      this.versionRequestId,
      this.getMlModelFileRequestId,
    ],
    requestIdsWith404ErrorsToIgnore: [this.runRequestId, this.getMlModelFileRequestId],
  };

  removeRunRequestId() {
    this.setState((prevState: any) => ({
      requestIds: without(prevState.requestIds, this.runRequestId),
    }));
  }

  componentDidMount() {
    this.props.getRegisteredModelApi(this.props.modelName, this.registeredModelRequestId);
    for (const modelVersion in this.props.versionsToRuns) {
      if ({}.hasOwnProperty.call(this.props.versionsToRuns, modelVersion)) {
        const runID = this.props.versionsToRuns[modelVersion];
        if (runID) {
          this.props.getRunApi(runID, this.runRequestId).catch(() => {
            // Failure of this call should not block the page. Here we remove
            // `runRequestId` from `requestIds` to unblock RequestStateWrapper
            // from rendering its content
            this.removeRunRequestId();
          });
        } else {
          this.removeRunRequestId();
        }
        const { modelName } = this.props;
        this.props.getModelVersionApi(modelName, modelVersion, this.versionRequestId);
        this.props
          .getModelVersionArtifactApi(modelName, modelVersion)
          .then((content: any) =>
            this.props.parseMlModelFile(modelName, modelVersion, content.value, this.getMlModelFileRequestId),
          )
          .catch(() => {
            // Failure of this call chain should not block the page. Here we remove
            // `getMlModelFileRequestId` from `requestIds` to unblock RequestStateWrapper
            // from rendering its content
            this.setState((prevState: any) => ({
              requestIds: without(prevState.requestIds, this.getMlModelFileRequestId),
            }));
          });
      }
    }
  }

  render() {
    return (
      <PageContainer>
        <RequestStateWrapper
          requestIds={this.state.requestIds}
          requestIdsWith404sToIgnore={this.state.requestIdsWith404ErrorsToIgnore}
        >
          <CompareModelVersionsView modelName={this.props.modelName} versionsToRuns={this.props.versionsToRuns} />
        </RequestStateWrapper>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: any, ownProps: WithRouterNextProps) => {
  const { location } = ownProps;
  const searchValues = qs.parse(location.search);
  // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
  const modelName = decodeURIComponent(JSON.parse(searchValues['?name']));
  // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
  const versionsToRuns = JSON.parse(searchValues['runs']);
  return { modelName, versionsToRuns };
};

const mapDispatchToProps = {
  getRunApi,
  getRegisteredModelApi,
  getModelVersionApi,
  getModelVersionArtifactApi,
  parseMlModelFile,
};

const CompareModelVersionsPageWithRouter = withRouterNext(
  connect(mapStateToProps, mapDispatchToProps)(CompareModelVersionsPageImpl),
);

export const CompareModelVersionsPage = withErrorBoundary(
  ErrorUtils.mlflowServices.MODEL_REGISTRY,
  CompareModelVersionsPageWithRouter,
);

export default CompareModelVersionsPage;
```

--------------------------------------------------------------------------------

---[FILE: CompareModelVersionsView.css]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CompareModelVersionsView.css

```text
.sticky-header {
  position: sticky;
  left: 0;
}

.compare-model-table {
  display: block;
  overflow: auto;
  width: 100%;
}

.compare-table-row {
  display: inline-flex;
}

.compare-table .head-value {
  overflow: hidden;
  overflow-wrap: break-word;
  z-index: 10;
}

.compare-table .diff-row .data-value {
  background-color: rgba(249, 237, 190, 0.5) ;
  color: #555;
}

.compare-table .diff-row:hover,
.compare-table .diff-row .head-value,
.compare-table .diff-row .head-value > span {
  background-color: rgba(249, 237, 190, 1.0) ;
  color: #555;
}
```

--------------------------------------------------------------------------------

````
