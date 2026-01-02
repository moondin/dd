---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 601
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 601 of 991)

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

---[FILE: ModelStageTransitionFormModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelStageTransitionFormModal.test.tsx
Signals: React

```typescript
import { describe, it, jest, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ModelStageTransitionFormModal, ModelStageTransitionFormModalMode } from './ModelStageTransitionFormModal';
import type { ComponentProps } from 'react';
import { Stages } from '../constants';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';

describe('ModelStageTransitionFormModal', () => {
  const renderTestComponent = (props: Partial<ComponentProps<typeof ModelStageTransitionFormModal>>) => {
    render(
      <ModelStageTransitionFormModal
        visible
        transitionDescription={null}
        allowArchivingExistingVersions
        toStage={Stages.STAGING}
        {...props}
      />,
      {
        wrapper: ({ children }) => (
          <DesignSystemProvider>
            <IntlProvider locale="en">{children}</IntlProvider>
          </DesignSystemProvider>
        ),
      },
    );
  };

  it('should handle form submission', async () => {
    const onConfirm = jest.fn();
    renderTestComponent({ onConfirm });

    expect(await screen.findByText('Stage transition')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Comment'), 'test comment');
    await userEvent.click(screen.getByLabelText(/Transition existing/));
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onConfirm).toHaveBeenCalledWith(
      { comment: 'test comment', archiveExistingVersions: true },
      expect.anything(),
    );
  });

  it.each([
    [ModelStageTransitionFormModalMode.Approve, 'Approve pending request'],
    [ModelStageTransitionFormModalMode.Reject, 'Reject pending request'],
    [ModelStageTransitionFormModalMode.Cancel, 'Cancel pending request'],
  ])('should display proper modal title when particular operating mode is selected', async (mode, expectedTitle) => {
    const onConfirm = jest.fn();
    renderTestComponent({ onConfirm, mode });

    expect(await screen.findByText(expectedTitle)).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelStageTransitionFormModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelStageTransitionFormModal.tsx
Signals: React

```typescript
import type { ModalProps } from '@databricks/design-system';
import {
  FormUI,
  Modal,
  RHFControlledComponents,
  Spacer,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { archiveExistingVersionToolTipText, Stages, StageTagComponents } from '../constants';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';

export interface ModelStageTransitionFormModalValues {
  comment: string;
  archiveExistingVersions: boolean;
}

export enum ModelStageTransitionFormModalMode {
  RequestOrDirect,
  Approve,
  Reject,
  Cancel,
}

export const ModelStageTransitionFormModal = ({
  visible,
  onCancel,
  toStage,
  allowArchivingExistingVersions,
  transitionDescription,
  onConfirm,
  mode = ModelStageTransitionFormModalMode.RequestOrDirect,
}: {
  toStage?: string;
  transitionDescription: React.ReactNode;
  allowArchivingExistingVersions?: boolean;
  onConfirm?: (values: ModelStageTransitionFormModalValues) => void;
  mode?: ModelStageTransitionFormModalMode;
} & Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { theme } = useDesignSystemTheme();
  const form = useForm<ModelStageTransitionFormModalValues>({
    defaultValues: {
      comment: '',
      archiveExistingVersions: false,
    },
  });

  const getModalTitle = () => {
    if (mode === ModelStageTransitionFormModalMode.Approve) {
      return (
        <FormattedMessage
          defaultMessage="Approve pending request"
          description="Title for a model version stage transition modal when approving a pending request"
        />
      );
    }
    if (mode === ModelStageTransitionFormModalMode.Reject) {
      return (
        <FormattedMessage
          defaultMessage="Reject pending request"
          description="Title for a model version stage transition modal when rejecting a pending request"
        />
      );
    }
    if (mode === ModelStageTransitionFormModalMode.Cancel) {
      return (
        <FormattedMessage
          defaultMessage="Cancel pending request"
          description="Title for a model version stage transition modal when cancelling a pending request"
        />
      );
    }
    return (
      <FormattedMessage
        defaultMessage="Stage transition"
        description="Title for a model version stage transition modal"
      />
    );
  };

  // Reset form values when modal is reopened
  useEffect(() => {
    if (visible) {
      form.reset();
    }
  }, [form, visible]);

  return (
    <Modal
      title={getModalTitle()}
      componentId="mlflow.model_registry.stage_transition_modal_v2"
      visible={visible}
      onCancel={onCancel}
      okText={
        <FormattedMessage
          defaultMessage="OK"
          description="Confirmation button text on the model version stage transition request/approval modal"
        />
      }
      cancelText={
        <FormattedMessage
          defaultMessage="Cancel"
          description="Cancellation button text on the model version stage transition request/approval modal"
        />
      }
      onOk={onConfirm && form.handleSubmit(onConfirm)}
    >
      {transitionDescription}
      <Spacer size="sm" />
      <FormUI.Label htmlFor="mlflow.model_registry.stage_transition_modal_v2.comment">Comment</FormUI.Label>
      <RHFControlledComponents.TextArea
        name="comment"
        id="mlflow.model_registry.stage_transition_modal_v2.comment"
        componentId="mlflow.model_registry.stage_transition_modal_v2.comment"
        control={form.control}
        rows={4}
      />
      <Spacer size="sm" />

      {allowArchivingExistingVersions && toStage && (
        <RHFControlledComponents.Checkbox
          name="archiveExistingVersions"
          componentId="mlflow.model_registry.stage_transition_modal_v2.archive_existing_versions"
          control={form.control}
        >
          <Tooltip
            componentId="mlflow.model_registry.stage_transition_modal_v2.archive_existing_versions.tooltip"
            content={archiveExistingVersionToolTipText(toStage)}
          >
            <span css={{ '[role=status]': { marginRight: theme.spacing.xs } }}>
              <FormattedMessage
                defaultMessage="Transition existing {currentStage} model version to {archivedStage}"
                description="Description text for checkbox for archiving existing model versions
                  in the toStage for model version stage transition request"
                values={{
                  currentStage: <span css={{ marginLeft: theme.spacing.xs }}>{StageTagComponents[toStage]}</span>,
                  archivedStage: (
                    <span css={{ marginLeft: theme.spacing.xs }}>{StageTagComponents[Stages.ARCHIVED]}</span>
                  ),
                }}
              />
            </span>
          </Tooltip>
        </RHFControlledComponents.Checkbox>
      )}
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelVersionPage.enzyme.test.tsx
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
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { mockModelVersionDetailed, mockRegisteredModelDetailed } from '../test-utils';
import { ModelVersionStatus, Stages } from '../constants';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { ModelVersionPage, ModelVersionPageImpl } from './ModelVersionPage';
import { ErrorView } from '../../common/components/ErrorView';
import { Spinner } from '../../common/components/Spinner';
import Utils from '../../common/utils/Utils';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { ErrorCodes } from '../../common/constants';
import { ModelRegistryRoutes } from '../routes';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { getUUID } from '../../common/utils/ActionUtils';
import { getModelVersionApi } from '../actions';

jest.mock('../../common/utils/ActionUtils', () => ({
  getUUID: jest.fn(),
}));

jest.mock('../actions', () => ({
  ...jest.requireActual<typeof import('../actions')>('../actions'),
  getModelVersionApi: jest.fn(),
}));

describe('ModelVersionPage', () => {
  let wrapper;
  let instance;
  let minimalProps: any;
  let minimalStoreState: any;
  let minimalStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  const navigate = jest.fn();

  const mountComponent = (props = minimalProps, store = minimalStore) => {
    return mountWithIntl(
      <Provider store={store}>
        <MemoryRouter>
          <ModelVersionPage {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    // Simple mock of getUUID
    let counter = 0;
    (getUUID as any).mockImplementation(() => `${counter++}`);
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    jest
      .mocked(getModelVersionApi)
      .mockImplementation(jest.requireActual<typeof import('../actions')>('../actions').getModelVersionApi);
    minimalProps = {
      params: {
        modelName: encodeURIComponent('Model A'),
        version: '1',
      },
      navigate,
    };
    const versions = [mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY)];
    minimalStoreState = {
      entities: {
        runInfosByUuid: {},
        modelByName: {
          // @ts-expect-error TS(2345): Argument of type '{ name: any; creation_timestamp:... Remove this comment to see the full error message
          'Model A': mockRegisteredModelDetailed('Model A', versions),
        },
        modelVersionsByModel: {
          'Model A': {
            1: mockModelVersionDetailed('Model A', '1', Stages.PRODUCTION, ModelVersionStatus.READY),
          },
        },
        activitiesByModelVersion: {},
        transitionRequestsByModelVersion: {},
        mlModelArtifactByModelVersion: {},
      },
    };
    minimalStore = mockStore({
      ...minimalStoreState,
      apis: {},
    });
  });
  test('should render with minimal props and store without exploding', () => {
    wrapper = mountComponent();
    expect(wrapper.find(ModelVersionPage).length).toBe(1);
    expect(wrapper.find(Spinner).length).toBe(1);
  });
  test('should fetch new data when props are updated after mount', () => {
    // eslint-disable-next-line no-unused-vars
    const endpoint = 'ajax-api/2.0/mlflow/model-versions/get';
    const TestComponent = ({ params = minimalProps.params }) => (
      <Provider store={minimalStore}>
        <MemoryRouter>
          <ModelVersionPage {...minimalProps} params={params} />
        </MemoryRouter>
      </Provider>
    );
    // Initial mount
    wrapper = mountWithIntl(<TestComponent />);
    // Assert first (original) call for model version
    expect(global.fetch).toHaveBeenCalledWith(endpoint + '?name=Model+A&version=1', expect.anything());
    // Update the mocked params object with new params
    wrapper.setProps({
      params: {
        ...minimalProps.params,
        version: '5',
      },
    });
    // Assert second call for model version
    expect(global.fetch).toHaveBeenCalledWith(endpoint + '?name=Model+A&version=5', expect.anything());
  });
  test('should redirect to model page when model version is deleted', async () => {
    wrapper = mountComponent();
    instance = wrapper.find(ModelVersionPageImpl).instance();
    const mockError = {
      getErrorCode() {
        return 'RESOURCE_DOES_NOT_EXIST';
      },
    };
    Utils.isBrowserTabVisible = jest.fn(() => true);
    instance.loadData = jest.fn(() => Promise.reject(mockError));
    expect(instance.props.modelName).toEqual('Model A');
    await instance.pollData();
    expect(navigate).toHaveBeenCalledWith(ModelRegistryRoutes.getModelPageRoute('Model A'));
  });
  test('should show ErrorView when resource is not found', () => {
    (getUUID as any).mockImplementation(() => 'resource_not_found_error');
    // Populate store with failed model version get request
    const myStore = mockStore({
      ...minimalStoreState,
      apis: {
        resource_not_found_error: {
          id: 'resource_not_found_error',
          active: false,
          error: new ErrorWrapper(`{"error_code": "${ErrorCodes.RESOURCE_DOES_NOT_EXIST}"}`, 404),
        },
      },
    });
    wrapper = mountComponent(minimalProps, myStore);
    expect(wrapper.find(ErrorView).length).toBe(1);
    expect(wrapper.find(ErrorView).prop('statusCode')).toBe(404);
    expect(wrapper.find(ErrorView).prop('subMessage')).toBe('Model Model A v1 does not exist');
  });
  test('should not crash runtime when API call rejects', () => {
    const httpError = new ErrorWrapper(`{"error_code": "${ErrorCodes.RESOURCE_DOES_NOT_EXIST}"}`, 404);
    jest.mocked(getModelVersionApi).mockImplementation(() => {
      return {
        type: 'GET_MODEL_VERSION',
        payload: Promise.reject(httpError),
        meta: { id: 'abc', modelName: 'abc', version: '1' },
      };
    });
    (getUUID as any).mockImplementation(() => 'resource_not_found_error');
    const myStore = mockStore({
      ...minimalStoreState,
      apis: {
        resource_not_found_error: {
          id: 'resource_not_found_error',
          active: false,
          error: httpError,
        },
      },
    });

    // This test would fail if any unhandled promise rejection occurs
    expect(() => mountComponent(minimalProps, myStore)).not.toThrow();
  });
  test('should show ErrorView when resource conflict error is thrown', () => {
    const testMessage = 'Detected model version conflict';
    (getUUID as any).mockImplementation(() => 'resource_conflict_id');
    // Populate store with failed model version get request
    const myStore = mockStore({
      ...minimalStoreState,
      apis: {
        resource_conflict_id: {
          id: 'resource_conflict_id',
          active: false,
          error: new ErrorWrapper(
            `{"error_code": "${ErrorCodes.RESOURCE_CONFLICT}", "message": "${testMessage}"}`,
            409,
          ),
        },
      },
    });
    wrapper = mountComponent(minimalProps, myStore);
    expect(wrapper.find(ErrorView).length).toBe(1);
    expect(wrapper.find(ErrorView).prop('statusCode')).toBe(409);
    expect(wrapper.find(ErrorView).prop('subMessage')).toBe(testMessage);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelVersionPage.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
  getModelVersionApi,
  getRegisteredModelApi,
  updateModelVersionApi,
  deleteModelVersionApi,
  transitionModelVersionStageApi,
  getModelVersionArtifactApi,
  parseMlModelFile,
} from '../actions';
import { getRunApi } from '../../experiment-tracking/actions';
import { getModelVersion, getModelVersionSchemas } from '../reducers';
import { ModelVersionView } from './ModelVersionView';
import type { PendingModelVersionActivity } from '../constants';
import { ActivityTypes, MODEL_VERSION_STATUS_POLL_INTERVAL as POLL_INTERVAL } from '../constants';
import Utils from '../../common/utils/Utils';
import { getRunInfo, getRunTags } from '../../experiment-tracking/reducers/Reducers';
import RequestStateWrapper, { triggerError } from '../../common/components/RequestStateWrapper';
import { ErrorView } from '../../common/components/ErrorView';
import { Spinner } from '../../common/components/Spinner';
import { ModelRegistryRoutes } from '../routes';
import { getProtoField } from '../utils';
import { getUUID } from '../../common/utils/ActionUtils';
import { without } from 'lodash';
import { PageContainer } from '../../common/components/PageContainer';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';
import type { ModelEntity, RunInfoEntity } from '../../experiment-tracking/types';
import type { ReduxState } from '../../redux-types';
import { ErrorCodes } from '../../common/constants';
import { injectIntl } from 'react-intl';

type ModelVersionPageImplProps = WithRouterNextProps & {
  modelName: string;
  version: string;
  modelVersion?: any;
  runInfo?: any;
  runDisplayName?: string;
  modelEntity?: ModelEntity;
  getModelVersionApi: (...args: any[]) => any;
  getRegisteredModelApi: typeof getRegisteredModelApi;
  updateModelVersionApi: (...args: any[]) => any;
  transitionModelVersionStageApi: (...args: any[]) => any;
  deleteModelVersionApi: (...args: any[]) => any;
  getRunApi: (...args: any[]) => any;
  apis: any;
  getModelVersionArtifactApi: (...args: any[]) => any;
  parseMlModelFile: (...args: any[]) => any;
  schema?: any;
  activities?: Record<string, unknown>[];
  intl?: any;
};

type ModelVersionPageImplState = any;

export class ModelVersionPageImpl extends React.Component<ModelVersionPageImplProps, ModelVersionPageImplState> {
  listTransitionRequestId: any;
  pollIntervalId: any;

  initGetModelVersionDetailsRequestId = getUUID();
  getRunRequestId = getUUID();
  updateModelVersionRequestId = getUUID();
  transitionModelVersionStageRequestId = getUUID();
  getModelVersionDetailsRequestId = getUUID();
  initGetMlModelFileRequestId = getUUID();
  state = {
    criticalInitialRequestIds: [this.initGetModelVersionDetailsRequestId, this.initGetMlModelFileRequestId],
  };

  pollingRelatedRequestIds = [this.getModelVersionDetailsRequestId, this.getRunRequestId];

  hasPendingPollingRequest = () =>
    this.pollingRelatedRequestIds.every((requestId) => {
      const request = this.props.apis[requestId];
      return Boolean(request && request.active);
    });

  loadData = (isInitialLoading: any) => {
    const promises = [this.getModelVersionDetailAndRunInfo(isInitialLoading)];
    return Promise.all(promises);
  };

  pollData = () => {
    const { modelName, version, navigate } = this.props;
    if (!this.hasPendingPollingRequest() && Utils.isBrowserTabVisible()) {
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      return this.loadData().catch((e) => {
        if (e.getErrorCode() === 'RESOURCE_DOES_NOT_EXIST') {
          Utils.logErrorAndNotifyUser(e);
          this.props.deleteModelVersionApi(modelName, version, undefined, true);
          navigate(ModelRegistryRoutes.getModelPageRoute(modelName));
        } else {
          // eslint-disable-next-line no-console -- TODO(FEINF-3587)
          console.error(e);
        }
      });
    }
    return Promise.resolve();
  };

  // We need to do this because currently the ModelVersionDetailed we got does not contain
  // experimentId. We need experimentId to construct a link to the source run. This workaround can
  // be removed after the availability of experimentId.
  getModelVersionDetailAndRunInfo(isInitialLoading: any) {
    const { modelName, version } = this.props;
    return this.props
      .getModelVersionApi(
        modelName,
        version,
        isInitialLoading === true ? this.initGetModelVersionDetailsRequestId : this.getModelVersionDetailsRequestId,
      )
      .then(({ value }: any) => {
        // Do not fetch run info if there is no run_id (e.g. model version created directly from a logged model)
        if (value && !value[getProtoField('model_version')].run_link && value[getProtoField('model_version')]?.run_id) {
          this.props.getRunApi(value[getProtoField('model_version')].run_id, this.getRunRequestId);
        }
      });
  }
  // We need this for getting mlModel artifact file,
  // this will be replaced with a single backend call in the future when supported
  getModelVersionMlModelFile() {
    const { modelName, version } = this.props;
    this.props
      .getModelVersionArtifactApi(modelName, version)
      .then((content: any) =>
        this.props.parseMlModelFile(modelName, version, content.value, this.initGetMlModelFileRequestId),
      )
      .catch(() => {
        // Failure of this call chain should not block the page. Here we remove
        // `initGetMlModelFileRequestId` from `criticalInitialRequestIds`
        // to unblock RequestStateWrapper from rendering its content
        this.setState((prevState: any) => ({
          criticalInitialRequestIds: without(prevState.criticalInitialRequestIds, this.initGetMlModelFileRequestId),
        }));
      });
  }

  // prettier-ignore
  handleStageTransitionDropdownSelect = (
    activity: PendingModelVersionActivity,
    archiveExistingVersions?: boolean,
  ) => {
    const { modelName, version } = this.props;
    const toStage = activity.to_stage;
    if (activity.type === ActivityTypes.APPLIED_TRANSITION) {
      this.props
        .transitionModelVersionStageApi(
          modelName,
          version.toString(),
          toStage,
          archiveExistingVersions,
          this.transitionModelVersionStageRequestId,
        )
        .then(this.loadData)
        .catch(Utils.logErrorAndNotifyUser);
    }
  };

  handleEditDescription = (description: any) => {
    const { modelName, version } = this.props;
    return (
      this.props
        .updateModelVersionApi(modelName, version, description, this.updateModelVersionRequestId)
        .then(this.loadData)
        // eslint-disable-next-line no-console -- TODO(FEINF-3587)
        .catch(console.error)
    );
  };

  componentDidMount() {
    // eslint-disable-next-line no-console -- TODO(FEINF-3587)
    this.loadData(true).catch(console.error);
    this.loadModelDataWithAliases();
    this.pollIntervalId = setInterval(this.pollData, POLL_INTERVAL);
    this.getModelVersionMlModelFile();
  }

  loadModelDataWithAliases = () => {
    this.props.getRegisteredModelApi(this.props.modelName);
  };

  // Make a new initial load if model version or name has changed
  componentDidUpdate(prevProps: ModelVersionPageImplProps) {
    if (this.props.version !== prevProps.version || this.props.modelName !== prevProps.modelName) {
      // eslint-disable-next-line no-console -- TODO(FEINF-3587)
      this.loadData(true).catch(console.error);
      this.getModelVersionMlModelFile();
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollIntervalId);
  }

  render() {
    const { modelName, version, modelVersion, runInfo, runDisplayName, navigate, schema, modelEntity } = this.props;

    return (
      <PageContainer>
        <RequestStateWrapper
          requestIds={this.state.criticalInitialRequestIds}
          // eslint-disable-next-line no-trailing-spaces
        >
          {(loading: any, hasError: any, requests: any) => {
            if (hasError) {
              clearInterval(this.pollIntervalId);
              const resourceConflictError = Utils.getResourceConflictError(
                requests,
                this.state.criticalInitialRequestIds,
              );
              if (resourceConflictError) {
                return (
                  <ErrorView
                    statusCode={409}
                    subMessage={resourceConflictError.error.getMessageField()}
                    fallbackHomePageReactRoute={ModelRegistryRoutes.modelListPageRoute}
                  />
                );
              }
              if (Utils.shouldRender404(requests, this.state.criticalInitialRequestIds)) {
                return (
                  <ErrorView
                    statusCode={404}
                    subMessage={`Model ${modelName} v${version} does not exist`}
                    fallbackHomePageReactRoute={ModelRegistryRoutes.modelListPageRoute}
                  />
                );
              }
              // TODO(Zangr) Have a more generic boundary to handle all errors, not just 404.
              const permissionDeniedErrors = requests.filter((request: any) => {
                return (
                  this.state.criticalInitialRequestIds.includes(request.id) &&
                  request.error?.getErrorCode() === ErrorCodes.PERMISSION_DENIED
                );
              });
              if (permissionDeniedErrors && permissionDeniedErrors[0]) {
                return (
                  <ErrorView
                    statusCode={403}
                    subMessage={this.props.intl.formatMessage(
                      {
                        defaultMessage: 'Permission denied for {modelName} version {version}. Error: "{errorMsg}"',
                        description: 'Permission denied error message on model version detail page',
                      },
                      {
                        modelName: modelName,
                        version: version,
                        errorMsg: permissionDeniedErrors[0].error?.getMessageField(),
                      },
                    )}
                    fallbackHomePageReactRoute={ModelRegistryRoutes.modelListPageRoute}
                  />
                );
              }
              triggerError(requests);
            } else if (loading) {
              return <Spinner />;
            } else if (modelVersion) {
              // Null check to prevent NPE after delete operation
              return (
                <ModelVersionView
                  modelName={modelName}
                  modelVersion={modelVersion}
                  modelEntity={modelEntity}
                  runInfo={runInfo}
                  runDisplayName={runDisplayName}
                  handleEditDescription={this.handleEditDescription}
                  deleteModelVersionApi={this.props.deleteModelVersionApi}
                  navigate={navigate}
                  handleStageTransitionDropdownSelect={this.handleStageTransitionDropdownSelect}
                  schema={schema}
                  onAliasesModified={this.loadModelDataWithAliases}
                />
              );
            }
            return null;
          }}
        </RequestStateWrapper>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: ReduxState, ownProps: WithRouterNextProps<{ modelName: string; version: string }>) => {
  const modelName = decodeURIComponent(ownProps.params.modelName);
  const { version } = ownProps.params;
  const modelVersion = getModelVersion(state, modelName, version);
  const schema = getModelVersionSchemas(state, modelName, version);
  let runInfo: RunInfoEntity | null = null;
  if (modelVersion && !modelVersion.run_link) {
    runInfo = getRunInfo(modelVersion && modelVersion.run_id, state);
  }
  const tags = runInfo && getRunTags(runInfo.runUuid, state);
  const runDisplayName = tags && runInfo && Utils.getRunDisplayName(runInfo, runInfo.runUuid);
  const modelEntity = state.entities.modelByName[modelName];
  const { apis } = state;
  return {
    modelName,
    version,
    modelVersion,
    schema,
    runInfo,
    runDisplayName,
    apis,
    modelEntity,
  };
};

const mapDispatchToProps = {
  getModelVersionApi,
  getRegisteredModelApi,
  updateModelVersionApi,
  transitionModelVersionStageApi,
  getModelVersionArtifactApi,
  parseMlModelFile,
  deleteModelVersionApi,
  getRunApi,
};

const ModelVersionPageWithRouter = withRouterNext(
  // @ts-expect-error TS(2769): No overload matches this call.
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(ModelVersionPageImpl)),
);

export const ModelVersionPage = withErrorBoundary(ErrorUtils.mlflowServices.MODEL_REGISTRY, ModelVersionPageWithRouter);

export default ModelVersionPage;
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionTable.css]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelVersionTable.css

```text
.mlflow-table-endpoint-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
}
```

--------------------------------------------------------------------------------

````
