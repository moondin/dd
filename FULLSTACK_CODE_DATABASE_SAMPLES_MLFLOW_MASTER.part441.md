---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 441
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 441 of 991)

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

---[FILE: ArtifactPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactPage.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect, it } from '@jest/globals';
import React from 'react';
import { shallowWithIntl, mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { ArtifactPageImpl, ConnectedArtifactPage } from './ArtifactPage';
import { ArtifactNode } from '../utils/ArtifactUtils';
import { Provider } from 'react-redux';
import { BrowserRouter } from '../../common/utils/RoutingUtils';
import { pending } from '../../common/utils/ActionUtils';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { SEARCH_MODEL_VERSIONS } from '../../model-registry/actions';
import {
  ModelVersionStatus,
  Stages,
  MODEL_VERSION_STATUS_POLL_INTERVAL as POLL_INTERVAL,
} from '../../model-registry/constants';
import Utils from '../../common/utils/Utils';
import { mockModelVersionDetailed } from '../../model-registry/test-utils';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { ErrorCodes } from '../../common/constants';
import { ArtifactView } from './ArtifactView';
import { RunTag } from '../sdk/MlflowMessages';

describe('ArtifactPage', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    const node = getTestArtifactNode();
    minimalProps = {
      runUuid: 'fakeUuid',
      runTags: {},
      artifactNode: node,
      artifactRootUri: 'dbfs:/',
      listArtifactsApi: jest.fn(() => Promise.resolve({})),
      params: {},
    };
    minimalStore = mockStore({
      apis: {},
      entities: {
        artifactsByRunUuid: {
          fakeUuid: node,
        },
        artifactRootUriByRunUuid: {
          fakeUuid: '8',
        },
        modelVersionsByModel: {
          'Model A': {
            1: mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY),
          },
        },
      },
    });
  });
  const getTestArtifactNode = () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const rootNode = new ArtifactNode(true, undefined);
    rootNode.isLoaded = true;
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const dir1 = new ArtifactNode(false, { path: 'dir1', is_dir: true });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const file1 = new ArtifactNode(false, { path: 'file1', is_dir: false, file_size: '159' });
    rootNode.children = { dir1, file1 };
    return rootNode;
  };
  const getArtifactPageInstance = () => {
    const mountedComponent = mountWithIntl(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <ConnectedArtifactPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    );
    return mountedComponent.find(ArtifactPageImpl).instance();
  };
  test('should render with minimal props without exploding', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <ConnectedArtifactPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    );
    expect(wrapper.length).toBe(1);
  });
  test('should render spinner while ListArtifacts API request is unresolved', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <ConnectedArtifactPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    );
    expect(wrapper.find('ArtifactViewBrowserSkeleton').length).toBe(1);
  });
  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should make correct number of API requests if artifact path specified in url', (done) => {
    const mock = jest.fn();
    const props = {
      ...minimalProps,
      apis: {},
      listArtifactsApi: mock,
      initialSelectedArtifactPath: 'some/test/directory/file',
      searchModelVersionsApi: jest.fn(),
    };
    wrapper = shallowWithIntl(<ArtifactPageImpl {...props} />).dive();
    setImmediate(() => {
      expect(mock.mock.calls.length).toBe(5);
      done();
    });
  });
  test('ArtifactPage renders error message when listArtifacts request fails', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const props = { ...minimalProps, apis: {}, searchModelVersionsApi: jest.fn() };
    wrapper = shallowWithIntl(<ArtifactPageImpl {...props} />).dive();
    const responseErrorWrapper = new ErrorWrapper(
      `{'error_code': '${ErrorCodes.PERMISSION_DENIED}', 'message': 'request failed'}`,
      403,
    );
    const artifactPageInstance = wrapper.instance();
    const listArtifactsErrorRequest = {
      id: artifactPageInstance.listArtifactsRequestId,
      active: false,
      error: responseErrorWrapper,
    };
    const artifactViewInstance = shallowWithIntl(
      artifactPageInstance.renderArtifactView(false, true, [listArtifactsErrorRequest]),
    );
    expect(artifactViewInstance.find('[data-testid="artifact-view-error"]').length).toBe(1);
    jest.clearAllMocks();
  });
  test('ArtifactPage renders ArtifactView when listArtifacts request succeeds', () => {
    const props = { ...minimalProps, apis: {}, searchModelVersionsApi: jest.fn() };
    wrapper = shallowWithIntl(<ArtifactPageImpl {...props} />).dive();
    const artifactPageInstance = wrapper.instance();
    const listArtifactsSuccessRequest = {
      id: artifactPageInstance.listArtifactsRequestId,
      active: true,
      payload: {},
    };
    const artifactViewInstance = shallowWithIntl(
      <Provider store={minimalStore}>
        <BrowserRouter>
          {artifactPageInstance.renderArtifactView(false, false, [listArtifactsSuccessRequest])}
        </BrowserRouter>
      </Provider>,
    );
    expect(artifactViewInstance.find(ArtifactView).length).toBe(1);
  });
  test('should poll for model versions if registry is enabled and active node is directory', () => {
    jest.useFakeTimers();
    expect(Utils.isModelRegistryEnabled()).toEqual(true);
    getArtifactPageInstance().handleActiveNodeChange(true);
    jest.advanceTimersByTime(POLL_INTERVAL * 3);
    const expectedActions = minimalStore.getActions().filter((action: any) => {
      return action.type === pending(SEARCH_MODEL_VERSIONS);
    });
    expect(expectedActions).toHaveLength(3);
  });
  test('should not poll for model versions if active node is not directory', () => {
    jest.useFakeTimers();
    expect(getArtifactPageInstance().state.activeNodeIsDirectory).toEqual(false);
    jest.advanceTimersByTime(POLL_INTERVAL * 3);
    const expectedActions = minimalStore.getActions().filter((action: any) => {
      return action.type === pending(SEARCH_MODEL_VERSIONS);
    });
    expect(expectedActions).toHaveLength(0);
  });
  test('should not report multiple errors', () => {
    jest.useFakeTimers();
    Utils.isModelRegistryEnabled = jest.fn<() => boolean>().mockReturnValue(true);
    Utils.logErrorAndNotifyUser = jest.fn();
    expect(Utils.logErrorAndNotifyUser).toHaveBeenCalledTimes(0);
    const props = {
      ...minimalProps,
      apis: {},
      searchModelVersionsApi: jest.fn(() => {
        throw Error('err');
      }),
    };
    // Create our wrapper with the intial props
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <ArtifactPageImpl {...props} />
        </BrowserRouter>
      </Provider>,
    );
    wrapper.find(ArtifactPageImpl).setState({ activeNodeIsDirectory: true });
    // Wait multiple poll intervals
    jest.advanceTimersByTime(POLL_INTERVAL * 3);
    // We should have only one error call
    expect(Utils.logErrorAndNotifyUser).toHaveBeenCalledTimes(1);
    // Let's change the run uuid now by changing the props
    // sadly, enzyme provides no convenient method to change
    // the deeply nested component props so we need to
    // improvise: https://github.com/enzymejs/enzyme/issues/1925
    wrapper.setProps({
      children: (
        <BrowserRouter>
          <ArtifactPageImpl {...props} runUuid="anotherFakeUuid" />
        </BrowserRouter>
      ),
    });
    // Wait another multiple poll intervals
    jest.advanceTimersByTime(POLL_INTERVAL * 5);
    // We should have only one more error call
    expect(Utils.logErrorAndNotifyUser).toHaveBeenCalledTimes(2);
    jest.clearAllMocks();
  });
  describe('autoselect logged model', () => {
    const generateLoggedModel = ({ time = '2021-05-01', path = 'someRunPath' } = {}) => ({
      run_id: `run-uuid`,
      artifact_path: path,
      utc_time_created: time,
      flavors: { keras: {}, python_function: {} },
    });
    const getLoggedModelRunTag = (models: any) =>
      models.length > 0
        ? {
            'mlflow.log-model.history': (RunTag as any).fromJs({
              key: 'mlflow.log-model.history',
              value: JSON.stringify(models),
            }),
          }
        : {};
    const getInstance = ({ initialPath = '', models = [] } = {}) => {
      const props = {
        ...minimalProps,
        runTags: getLoggedModelRunTag(models),
        ...(initialPath && {
          params: {
            initialSelectedArtifactPath: initialPath,
          },
        }),
      };

      if (initialPath) {
        props.location = { pathname: `/artifactPath/${initialPath}` };
      }

      const artifactPageWrapper = mountWithIntl(
        <Provider store={minimalStore}>
          <BrowserRouter>
            <ConnectedArtifactPage {...props} />
          </BrowserRouter>
        </Provider>,
      );
      return artifactPageWrapper.find(ArtifactPageImpl).instance();
    };
    it('selects path from route when present', () => {
      const instance = getInstance({
        initialPath: 'passedInPath',
      });
      expect(instance.props['initialSelectedArtifactPath']).toBe('passedInPath');
    });
    it('autoselects from runtag if no path is present', () => {
      const instance = getInstance({
        // @ts-expect-error TS(2322): Type '{ run_id: string; artifact_path: string; utc... Remove this comment to see the full error message
        models: [generateLoggedModel()],
      });
      expect(instance.props['initialSelectedArtifactPath']).toBe('someRunPath');
    });
    it('autoselects the most recent path', () => {
      const instance = getInstance({
        models: [
          // @ts-expect-error TS(2322): Type '{ run_id: string; artifact_path: string; utc... Remove this comment to see the full error message
          generateLoggedModel({
            path: 'reallyOldRunPath',
            time: '1776-07-04',
          }),
          // @ts-expect-error TS(2322): Type '{ run_id: string; artifact_path: string; utc... Remove this comment to see the full error message
          generateLoggedModel({
            path: 'moreRecentRunPath',
            time: '2021-07-04',
          }),
        ],
      });
      expect(instance.props['initialSelectedArtifactPath']).toBe('moreRecentRunPath');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ArtifactPage.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactPage.intg.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, it, expect, afterEach, test } from '@jest/globals';
import { last } from 'lodash';
import { render, screen, waitFor } from '@testing-library/react';
import ArtifactPage from './ArtifactPage';
import { MockedReduxStoreProvider } from '../../common/utils/TestUtils';
import { MlflowService } from '../sdk/MlflowService';
import { ArtifactNode } from '../utils/ArtifactUtils';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import { getArtifactContent, getArtifactBytesContent } from '../../common/utils/ArtifactUtils';
import { TestRouter, testRoute } from '../../common/utils/RoutingTestUtils';
import { MLFLOW_LOGGED_ARTIFACTS_TAG } from '../constants';
import Utils from '../../common/utils/Utils';
import { Services } from '../../model-registry/services';
import type { ReduxState } from '../../redux-types';
import { applyMiddleware, combineReducers, createStore, type DeepPartial } from 'redux';
import type { KeyValueEntity } from '../../common/types';
// eslint-disable-next-line import/no-nodejs-modules
import { readFileSync } from 'fs';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { DesignSystemProvider } from '@databricks/design-system';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larger timeout for integration testing

jest.mock('../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../common/utils/ArtifactUtils')>('../../common/utils/ArtifactUtils'),
  getArtifactContent: jest.fn(),
  getArtifactBytesContent: jest.fn(),
}));

jest.mock('../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../common/utils/FeatureUtils')>('../../common/utils/FeatureUtils'),
}));

// List of various artifacts to be downloaded and rendered
const artifactTestCases: string[] = [
  // JSON files
  'json/table_eval_data.json',
  'json/table_unnamed_columns.json',
  'json/table_eval_broken.json',

  // GeoJSON files
  'geojson/sample.geojson',

  // CSV files
  'csv/csv_colons.csv',
  'csv/csv_commas.csv',
  'csv/csv_broken.csv',

  // Image files
  'png/sample_small.png',

  // HTML files
  'html/test_html.html',

  // PDF files
  'pdf/pdf_sample.pdf',
];

// A small stub that satisfies <RequestStateWrapper> by
// providing fake API responses that are always fulfilled
const alwaysFulfilledResponseApiStub = new Proxy(
  {},
  {
    get() {
      return { active: false };
    },
  },
);

/**
 * Local util that loads a fixture file from the artifact-fixtures directory
 */
const loadLocalArtifactFixtureFile = (fileName: string) =>
  readFileSync([__dirname, 'run-page/artifact-fixtures', fileName].join('/'));

/**
 * Mocks the artifact retrieval utils to return the provided artifact data
 */
const mockArtifactRetrieval = <T extends BlobPart>(artifactData: T) => {
  const getArtifactContentMocked = (_: string, isBinary = false) => {
    return new Promise((fetchArtifactResolve, reject) => {
      const blob = new Blob([artifactData]);
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        if (!event?.target?.result) {
          return reject();
        }
        fetchArtifactResolve(event.target.result);
      };

      if (isBinary) {
        fileReader.readAsArrayBuffer(blob);
      } else {
        fileReader.readAsText(blob);
      }
    });
  };
  // @ts-expect-error Type 'unknown' is not assignable to type 'R'
  jest.mocked(getArtifactContent).mockImplementation(getArtifactContentMocked);
  jest.mocked(getArtifactBytesContent).mockImplementation((...props) => getArtifactContentMocked(...props, true));
};

/**
 * Creates fake run tags. If a file is JSON, it will be tagged as a logged artifact.
 */
const createRunTagsForFile = (baseFileName: string): Record<string, KeyValueEntity> => {
  if (baseFileName.endsWith('.json')) {
    return {
      [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
        key: MLFLOW_LOGGED_ARTIFACTS_TAG,
        value: `[{"path": "${baseFileName}", "type": "table"}]`,
      },
    };
  }

  return {};
};

describe('Artifact page, artifact files rendering integration test', () => {
  beforeEach(() => {
    jest.spyOn(MlflowService, 'listArtifacts').mockResolvedValue({});
    jest.spyOn(Services, 'searchRegisteredModels').mockResolvedValue({ registered_models: [] });
  });
  it.each(artifactTestCases)('renders artifact file: %s', async (fileName) => {
    const fileContents = loadLocalArtifactFixtureFile(fileName);
    const baseFilename = last(fileName.split('/')) ?? '';

    const runTags = createRunTagsForFile(baseFilename);

    mockArtifactRetrieval(fileContents);

    const testReduxStoreState: DeepPartial<ReduxState> = {
      apis: alwaysFulfilledResponseApiStub,
      entities: {
        modelVersionsByModel: {},
        artifactRootUriByRunUuid: {
          'test-run-uuid': 'dbfs:/some-path/',
        },
        artifactsByRunUuid: {
          'test-run-uuid': new ArtifactNode(true, undefined, {
            [baseFilename]: new ArtifactNode(
              false,
              {
                path: baseFilename,
                is_dir: false,
                file_size: 1000,
              },
              undefined,
            ),
          }),
        },
      },
    };

    render(<ArtifactPage runUuid="test-run-uuid" runTags={runTags} experimentId="test-experiment-id" />, {
      wrapper: ({ children }) => (
        <TestRouter
          routes={[
            testRoute(
              <DesignSystemProvider>
                <IntlProvider locale="en">
                  <MockedReduxStoreProvider state={testReduxStoreState}>{children}</MockedReduxStoreProvider>
                </IntlProvider>
              </DesignSystemProvider>,
            ),
          ]}
        />
      ),
    });

    // Wait for the artifact tree to be rendered
    await waitFor(() => {
      expect(screen.getByText(baseFilename)).toBeInTheDocument();
    });

    // Click on the artifact to open it
    await userEvent.click(screen.getByText(baseFilename));

    // Wait for the artifact to be loaded and rendered
    await waitFor(() => {
      expect(screen.getByTitle(baseFilename)).toBeInTheDocument();
      expect(screen.queryByText('Artifact loading')).not.toBeInTheDocument();
    });
  });

  it('renders model artifact', async () => {
    const fileContents = loadLocalArtifactFixtureFile('models/MLmodel');

    const runTags = {
      [Utils.loggedModelsTag]: {
        key: Utils.loggedModelsTag,
        value: `[{"artifact_path":"logged_model","signature":{"inputs":"","outputs":"","params":null},"flavors":{"python_function":{"cloudpickle_version":"2.2.1","loader_module":"mlflow.pyfunc.model","python_model":"python_model.pkl","env":{"conda":"conda.yaml","virtualenv":"python_env.yaml"},"python_version":"3.10.12"}},"run_id":"test-run-uuid","model_uuid":"test-model-uuid","utc_time_created":"2023-01-01 10:57:14.780880"}]`,
      },
    };

    mockArtifactRetrieval(fileContents);

    const testReduxStoreState: DeepPartial<ReduxState> = {
      apis: alwaysFulfilledResponseApiStub,
      entities: {
        modelVersionsByModel: {},
        artifactRootUriByRunUuid: {
          'test-run-uuid': 'dbfs:/some-path/',
        },
        artifactsByRunUuid: {
          'test-run-uuid': new ArtifactNode(true, undefined, {
            logged_model: new ArtifactNode(
              false,
              {
                path: 'logged_model',
                is_dir: true,
              },
              {
                MLmodel: new ArtifactNode(
                  false,
                  {
                    is_dir: false,
                    file_size: 1000,
                    path: 'logged_model/MLmodel',
                  },
                  undefined,
                ),
              },
            ),
          }),
        },
      },
    };

    render(<ArtifactPage runUuid="test-run-uuid" runTags={runTags} experimentId="test-experiment-id" />, {
      wrapper: ({ children }) => (
        <TestRouter
          routes={[
            testRoute(
              <IntlProvider locale="en">
                <DesignSystemProvider>
                  <MockedReduxStoreProvider state={testReduxStoreState}>{children}</MockedReduxStoreProvider>
                </DesignSystemProvider>
              </IntlProvider>,
            ),
          ]}
        />
      ),
    });

    // Wait for the artifact tree to be rendered
    await waitFor(() => {
      expect(screen.getByLabelText('logged_model')).toBeInTheDocument();
    });

    // Click on the artifact to open it
    await userEvent.click(screen.getByLabelText('logged_model'));

    // Wait for the artifact to be loaded and rendered
    await waitFor(() => {
      expect(screen.getByText('test_model_input')).toBeInTheDocument();
      expect(screen.getByText('test_model_output')).toBeInTheDocument();
    });
  });
});

describe('Artifact page, artifact list request error handling', () => {
  beforeEach(() => {
    jest.spyOn(MlflowService, 'listArtifacts').mockResolvedValue({});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Mock failed API response as a slice of redux store which ArtifactPage uses for getting error state
  const alwaysFailingResponseApiStub = new Proxy(
    {},
    {
      get() {
        return { active: false, error: new ErrorWrapper({ message: 'User does not have permissions' }, 403) };
      },
    },
  );

  const testReduxStoreState: DeepPartial<ReduxState> = {
    apis: alwaysFailingResponseApiStub,
    entities: {
      modelVersionsByModel: {},
      artifactRootUriByRunUuid: {},
      artifactsByRunUuid: {},
    },
  };

  test('renders error message when artifact list request fails', async () => {
    render(<ArtifactPage runUuid="test-run-uuid" runTags={{}} experimentId="test-experiment-id" />, {
      wrapper: ({ children }) => (
        <TestRouter
          routes={[
            testRoute(
              <IntlProvider locale="en">
                <MockedReduxStoreProvider state={testReduxStoreState}>{children}</MockedReduxStoreProvider>
              </IntlProvider>,
            ),
          ]}
        />
      ),
    });

    await waitFor(() => {
      expect(screen.getByText('Loading artifact failed')).toBeInTheDocument();
      expect(screen.getByText('User does not have permissions')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ArtifactPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactPage.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { first, isEmpty, isUndefined } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withRouterNext } from '../../common/utils/withRouterNext';
import { ArtifactView } from './ArtifactView';
import { Spinner } from '../../common/components/Spinner';
import { listArtifactsApi, listArtifactsLoggedModelApi } from '../actions';
import { searchModelVersionsApi } from '../../model-registry/actions';
import { connect } from 'react-redux';
import { getArtifactRootUri, getArtifacts } from '../reducers/Reducers';
import { MODEL_VERSION_STATUS_POLL_INTERVAL as POLL_INTERVAL } from '../../model-registry/constants';
import RequestStateWrapper from '../../common/components/RequestStateWrapper';
import Utils from '../../common/utils/Utils';
import { getUUID } from '../../common/utils/ActionUtils';
import { getLoggedModelPathsFromTags } from '../../common/utils/TagUtils';
import { ArtifactViewBrowserSkeleton } from './artifact-view-components/ArtifactViewSkeleton';
import { DangerIcon, Empty } from '@databricks/design-system';
import { ArtifactViewErrorState } from './artifact-view-components/ArtifactViewErrorState';
import type { LoggedModelArtifactViewerProps } from './artifact-view-components/ArtifactViewComponents.types';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import type { UseGetRunQueryResponseOutputs } from './run-page/hooks/useGetRunQuery';
import type { ReduxState } from '../../redux-types';
import { asyncGetLoggedModel } from '../hooks/logged-models/useGetLoggedModelQuery';
import type { KeyValueEntity } from '../../common/types';

type ArtifactPageImplProps = {
  runUuid?: string;
  initialSelectedArtifactPath?: string;
  artifactRootUri?: string;
  apis: any;
  listArtifactsApi: (...args: any[]) => any;
  listArtifactsLoggedModelApi: typeof listArtifactsLoggedModelApi;
  searchModelVersionsApi: (...args: any[]) => any;
  runTags?: any;
  runOutputs?: UseGetRunQueryResponseOutputs;
  entityTags?: Partial<KeyValueEntity>[];

  /**
   * If true, the artifact browser will try to use all available height
   */
  useAutoHeight?: boolean;
} & LoggedModelArtifactViewerProps;

type ArtifactPageImplState = {
  errorThrown: boolean;
  activeNodeIsDirectory: boolean;
  fallbackEntityTags?: Partial<KeyValueEntity>[];
};

export class ArtifactPageImpl extends Component<ArtifactPageImplProps, ArtifactPageImplState> {
  pollIntervalId: any;

  getFailedtoListArtifactsMsg = () => {
    return (
      <span>
        <FormattedMessage
          // eslint-disable-next-line max-len
          defaultMessage="Unable to list artifacts stored under {artifactUri} for the current run. Please contact your tracking server administrator to notify them of this error, which can happen when the tracking server lacks permission to list artifacts under the current run's root artifact directory."
          // eslint-disable-next-line max-len
          description="Error message when the artifact is unable to load. This message is displayed in the open source ML flow only"
          values={{ artifactUri: this.props.artifactRootUri }}
        />
      </span>
    );
  };

  state: ArtifactPageImplState = { activeNodeIsDirectory: false, errorThrown: false };

  searchRequestId = getUUID();

  listArtifactRequestIds = [getUUID()].concat(
    this.props.initialSelectedArtifactPath
      ? this.props.initialSelectedArtifactPath.split('/').map((s) => getUUID())
      : [],
  );

  pollModelVersionsForCurrentRun = async () => {
    const { apis, runUuid, isLoggedModelsMode } = this.props;
    const { activeNodeIsDirectory } = this.state;
    const searchRequest = apis[this.searchRequestId];
    // Do not poll for run's model versions if we are in the logged models mode
    if (isLoggedModelsMode && !runUuid) {
      return;
    }
    if (activeNodeIsDirectory && !(searchRequest && searchRequest.active)) {
      try {
        // searchModelVersionsApi may be sync or async so we're not using <promise>.catch() syntax
        await this.props.searchModelVersionsApi({ run_id: runUuid }, this.searchRequestId);
      } catch (error) {
        // We're not reporting errors more than once when polling
        // in order to avoid flooding logs
        if (!this.state.errorThrown) {
          const errorString = error instanceof Error ? error.toString() : JSON.stringify(error);
          const errorMessage = `Error while fetching model version for run: ${errorString}`;
          Utils.logErrorAndNotifyUser(errorMessage);
          this.setState({ errorThrown: true });
        }
      }
    }
  };

  handleActiveNodeChange = (activeNodeIsDirectory: any) => {
    this.setState({ activeNodeIsDirectory });
  };

  pollArtifactsForCurrentRun = async () => {
    const { runUuid, loggedModelId, isFallbackToLoggedModelArtifacts } = this.props;

    const usingLoggedModels = this.props.isLoggedModelsMode;

    let fallbackEntityTags: Partial<KeyValueEntity>[] | undefined = undefined;

    // In the logged models mode, fetch artifacts for the model instead of the run
    if (usingLoggedModels && loggedModelId) {
      // If falling back from run artifacts to logged model artifacts, fetch the logged model's tags
      // in order to correctly resolve artifact storage path.
      if (isFallbackToLoggedModelArtifacts) {
        const loggedModelData = await asyncGetLoggedModel(loggedModelId, true);
        fallbackEntityTags = loggedModelData?.model?.info?.tags;
        this.setState({
          fallbackEntityTags,
        });
      }
      await this.props.listArtifactsLoggedModelApi(
        this.props.loggedModelId,
        undefined,
        this.props.experimentId,
        this.listArtifactRequestIds[0],
        fallbackEntityTags ?? this.props.entityTags,
      );
    } else {
      await this.props.listArtifactsApi(
        runUuid,
        undefined,
        this.listArtifactRequestIds[0],
        this.props.experimentId,
        this.props.entityTags,
      );
    }
    if (this.props.initialSelectedArtifactPath) {
      const parts = this.props.initialSelectedArtifactPath.split('/');
      let pathSoFar = '';
      for (let i = 0; i < parts.length; i++) {
        pathSoFar += parts[i];
        // ML-12477: ListArtifacts API requests need to be sent and fulfilled for parent
        // directories before nested child directories, as our Reducers assume that parent
        // directories are listed before their children to construct the correct artifact tree.
        // Index i + 1 because listArtifactRequestIds[0] would have been used up by
        // root-level artifact API call above.

        // In the logged models mode, fetch artifacts for the model instead of the run
        if (usingLoggedModels && loggedModelId) {
          await this.props.listArtifactsLoggedModelApi(
            this.props.loggedModelId,
            pathSoFar,
            this.props.experimentId,
            this.listArtifactRequestIds[i + 1],
            fallbackEntityTags ?? this.props.entityTags,
          );
        } else {
          await this.props.listArtifactsApi(
            runUuid,
            pathSoFar,
            this.listArtifactRequestIds[i + 1],
            this.props.experimentId,
            this.props.entityTags,
          );
        }
        pathSoFar += '/';
      }
    }
  };

  componentDidMount() {
    if (this.props.runUuid && this.isWorkspaceModelRegistryEnabled) {
      this.pollModelVersionsForCurrentRun();
      this.pollIntervalId = setInterval(this.pollModelVersionsForCurrentRun, POLL_INTERVAL);
    }
    this.pollArtifactsForCurrentRun();
  }

  componentDidUpdate(prevProps: ArtifactPageImplProps) {
    if (prevProps.runUuid !== this.props.runUuid) {
      this.setState({
        errorThrown: false,
      });
    }
    // If the component eventually falls back to logged model artifacts, poll artifacts for the current run
    if (!prevProps.isFallbackToLoggedModelArtifacts && this.props.isFallbackToLoggedModelArtifacts) {
      this.pollArtifactsForCurrentRun();
    }
  }

  get isWorkspaceModelRegistryEnabled() {
    return Utils.isModelRegistryEnabled();
  }

  componentWillUnmount() {
    if (this.isWorkspaceModelRegistryEnabled && !isUndefined(this.pollIntervalId)) {
      clearInterval(this.pollIntervalId);
    }
  }

  renderErrorCondition = (shouldRenderError: any) => {
    return shouldRenderError;
  };

  renderArtifactView = (isLoading: any, shouldRenderError: any, requests: any) => {
    if (isLoading && !shouldRenderError) {
      return <ArtifactViewBrowserSkeleton />;
    }
    if (this.renderErrorCondition(shouldRenderError)) {
      const failedReq = requests[0];
      if (failedReq && failedReq.error) {
        // eslint-disable-next-line no-console -- TODO(FEINF-3587)
        console.error(failedReq.error);
      }
      const errorDescription = (() => {
        const error = failedReq?.error;
        if (error instanceof ErrorWrapper) {
          return error.getMessageField();
        }

        return this.getFailedtoListArtifactsMsg();
      })();
      return (
        <ArtifactViewErrorState
          css={{ flex: this.props.useAutoHeight ? 1 : 'unset', height: this.props.useAutoHeight ? 'auto' : undefined }}
          data-testid="artifact-view-error"
          description={errorDescription}
        />
      );
    }
    return (
      <ArtifactView
        {...this.props}
        entityTags={this.state.fallbackEntityTags ?? this.props.entityTags}
        handleActiveNodeChange={this.handleActiveNodeChange}
        useAutoHeight={this.props.useAutoHeight}
      />
    );
  };

  render() {
    return (
      <RequestStateWrapper
        requestIds={this.listArtifactRequestIds}
        // eslint-disable-next-line no-trailing-spaces
      >
        {this.renderArtifactView}
      </RequestStateWrapper>
    );
  }
}

type ArtifactPageOwnProps = Omit<
  ArtifactPageImplProps,
  | 'apis'
  | 'initialSelectedArtifactPath'
  | 'listArtifactsApi'
  | 'listArtifactsLoggedModelApi'
  | 'searchModelVersionsApi'
  /* prettier-ignore */
>;

const validVolumesPrefix = ['/Volumes/', 'dbfs:/Volumes/'];

// Internal utility function to determine if the component should fallback to logged model artifacts
// if there are no run artifacts available
const shouldFallbackToLoggedModelArtifacts = (
  state: ReduxState,
  ownProps: ArtifactPageOwnProps & WithRouterNextProps,
): {
  isFallbackToLoggedModelArtifacts: boolean;
  fallbackLoggedModelId?: string;
} => {
  const isVolumePath = validVolumesPrefix.some((prefix) => ownProps.artifactRootUri?.startsWith(prefix));

  // Execute only if feature is enabled and we are currently fetching >run< artifacts.
  // Also, do not fallback to logged model artifacts for Volume-based artifact paths.
  if (!ownProps.isLoggedModelsMode) {
    // Let's check if the root artifact is already present (i.e. run artifacts are fetched)
    const rootArtifact = getArtifacts(ownProps.runUuid, state);
    const isRunArtifactsEmpty = rootArtifact && !rootArtifact.fileInfo && isEmpty(rootArtifact.children);

    // Check if we have a logged model id to fallback to
    const loggedModelId = first(ownProps.runOutputs?.modelOutputs)?.modelId;

    // If true, return relevant information to the component
    if (isRunArtifactsEmpty && loggedModelId) {
      return {
        isFallbackToLoggedModelArtifacts: true,
        fallbackLoggedModelId: loggedModelId,
      };
    }
  }
  // Otherwise, do not fallback to logged model artifacts
  return {
    isFallbackToLoggedModelArtifacts: false,
  };
};

const mapStateToProps = (state: any, ownProps: ArtifactPageOwnProps & WithRouterNextProps) => {
  const { runUuid, location, runOutputs } = ownProps;
  const currentPathname = location?.pathname || '';

  const initialSelectedArtifactPathMatch = currentPathname.match(/\/(?:artifactPath|artifacts)\/(.+)/);

  // Check the conditions to fallback to logged model artifacts
  const { isFallbackToLoggedModelArtifacts, fallbackLoggedModelId } = shouldFallbackToLoggedModelArtifacts(
    state,
    ownProps,
  );

  // The dot ("*") parameter behavior is not stable between implementations
  // so we'll extract the catch-all after /artifactPath, e.g.
  // `/experiments/123/runs/321/artifactPath/models/requirements.txt`
  // is getting transformed into
  // `models/requirements.txt`
  const initialSelectedArtifactPath = initialSelectedArtifactPathMatch?.[1] || undefined;

  const { apis } = state;
  const artifactRootUri = ownProps.artifactRootUri ?? getArtifactRootUri(runUuid, state);

  // Autoselect most recently created logged model
  let selectedPath = initialSelectedArtifactPath;
  if (!selectedPath) {
    const loggedModelPaths = getLoggedModelPathsFromTags(ownProps.runTags ?? {});
    if (loggedModelPaths.length > 0) {
      selectedPath = first(loggedModelPaths);
    }
  }
  return {
    artifactRootUri,
    apis,
    initialSelectedArtifactPath: selectedPath,

    // Use the run outputs if available, otherwise fallback to the run outputs from the Redux store
    isLoggedModelsMode: isFallbackToLoggedModelArtifacts ? true : ownProps.isLoggedModelsMode,
    loggedModelId: isFallbackToLoggedModelArtifacts ? fallbackLoggedModelId : ownProps.loggedModelId,
    isFallbackToLoggedModelArtifacts,
  };
};

const mapDispatchToProps = {
  listArtifactsApi,
  listArtifactsLoggedModelApi,
  searchModelVersionsApi,
};

export const ConnectedArtifactPage = connect(mapStateToProps, mapDispatchToProps)(ArtifactPageImpl);

export default withRouterNext(ConnectedArtifactPage);
```

--------------------------------------------------------------------------------

---[FILE: ArtifactView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactView.css

```text
div.mlflow-artifact-view {
  display: flex;
  overflow: hidden;
}

.mlflow-artifact-left {
  min-width: 200px;
  max-width: 400px;
  flex: 1;
}

.mlflow-artifact-left li {
  white-space: nowrap;
}

.mlflow-artifact-right {
  flex: 3;
  min-width: 400px;
  max-width: calc(100% - 200px); /* 200px is the min-width of .mlflow-artifact-left */

  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mlflow-artifact-info-left {
  flex: 1;
  max-width: 75%;
}
.mlflow-artifact-info-right {
  margin-left: auto;
}

.mlflow-artifact-info-path {
  display: flex;
  align-items: center;
}

.mlflow-artifact-info-text {
  min-width: 0;
}

.mlflow-artifact-info-size {
  overflow: hidden;
  text-overflow: ellipsis;
}

.mlflow-loading-spinner {
  height: 20px;
  opacity: 0;
  -webkit-animation: spin 3s linear infinite;
  -moz-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}

.mlflow-artifact-info-right .model-version-link {
  display: flex;
  align-items: baseline;
  max-width: 140px;
  padding-top: 1px;
  padding-left: 4px;
}

.mlflow-artifact-info-right .model-version-link .model-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.mlflow-artifact-info-right .model-version-info {
  font-size: 12px;
}

.mlflow-artifact-info-right .model-version-info .model-version-link-section {
  display: flex;
  align-items: center;
}

.mlflow-artifact-info-right .model-version-info .model-version-status-text {
  overflow: hidden;
  max-width: 160px;
  text-overflow: ellipsis;
}
```

--------------------------------------------------------------------------------

````
