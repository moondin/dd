---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 600
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 600 of 991)

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

---[FILE: ModelListView.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelListView.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import './ModelListView.css';
import Utils from '../../common/utils/Utils';
import {
  REGISTERED_MODELS_PER_PAGE_COMPACT,
  REGISTERED_MODELS_SEARCH_NAME_FIELD,
  REGISTERED_MODELS_SEARCH_TIMESTAMP_FIELD,
} from '../constants';
import { ModelRegistryDocUrl, ModelRegistryOnboardingString, onboarding } from '../../common/constants';
import { CreateModelButton } from './CreateModelButton';
import LocalStorageUtils from '../../common/utils/LocalStorageUtils';
import { PageHeader } from '../../shared/building_blocks/PageHeader';

import { FormattedMessage, type IntlShape, injectIntl } from 'react-intl';
import { Alert, CursorPagination, Spacer as DuBoisSpacer, Spacer, Typography } from '@databricks/design-system';
import { shouldShowModelsNextUI } from '../../common/utils/FeatureUtils';
import { ModelListFilters } from './model-list/ModelListFilters';
import { ModelListTable } from './model-list/ModelListTable';
import { PageContainer } from '../../common/components/PageContainer';
import { ModelsNextUIToggleSwitch } from './ModelsNextUIToggleSwitch';
import { withNextModelsUIContext } from '../hooks/useNextModelsUI';

const NAME_COLUMN_INDEX = 'name';
const LAST_MODIFIED_COLUMN_INDEX = 'last_updated_timestamp';

type ModelListViewImplProps = {
  models: any[];
  showEditPermissionModal: (...args: any[]) => any;
  permissionLevel: string;
  selectedOwnerFilter: string;
  selectedStatusFilter: string;
  onOwnerFilterChange: (...args: any[]) => any;
  onStatusFilterChange: (...args: any[]) => any;
  searchInput: string;
  orderByKey: string;
  orderByAsc: boolean;
  currentPage: number;
  nextPageToken: string | null;
  loading?: boolean;
  error?: Error;
  onSearch: (...args: any[]) => any;
  onClickNext: (...args: any[]) => any;
  onClickPrev: (...args: any[]) => any;
  onClickSortableColumn: (...args: any[]) => any;
  onSetMaxResult: (...args: any[]) => any;
  maxResultValue: number;
  intl: IntlShape;
};

type ModelListViewImplState = any;

export class ModelListViewImpl extends React.Component<ModelListViewImplProps, ModelListViewImplState> {
  constructor(props: ModelListViewImplProps) {
    super(props);

    this.state = {
      maxResultsSelection: REGISTERED_MODELS_PER_PAGE_COMPACT,
    };
  }

  static defaultProps = {
    models: [],
    searchInput: '',
  };

  disableOnboardingHelper() {
    const onboardingInformationStore = ModelListViewImpl.getLocalStore(onboarding);
    onboardingInformationStore.setItem('showRegistryHelper', 'false');
  }

  /**
   * Returns a LocalStorageStore instance that can be used to persist data associated with the
   * ModelRegistry component.
   */
  static getLocalStore(key: any) {
    return LocalStorageUtils.getStoreForComponent('ModelListView', key);
  }

  componentDidMount() {
    const pageTitle = 'MLflow Models';
    Utils.updatePageTitle(pageTitle);
  }

  handleSearch = (event: any, searchInput: any) => {
    event?.preventDefault();
    this.props.onSearch(searchInput);
  };

  static getSortFieldName = (column: any) => {
    switch (column) {
      case NAME_COLUMN_INDEX:
        return REGISTERED_MODELS_SEARCH_NAME_FIELD;
      case LAST_MODIFIED_COLUMN_INDEX:
        return REGISTERED_MODELS_SEARCH_TIMESTAMP_FIELD;
      default:
        return null;
    }
  };

  unifiedTableSortChange = ({ orderByKey, orderByAsc }: any) => {
    // Different column keys are used for sorting and data accessing,
    // mapping to proper keys happens below
    const fieldMappedToSortKey =
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      {
        timestamp: 'last_updated_timestamp',
      }[orderByKey] || orderByKey;

    this.handleTableChange(undefined, undefined, {
      field: fieldMappedToSortKey,
      order: orderByAsc ? 'undefined' : 'descend',
    });
  };

  handleTableChange = (pagination: any, filters: any, sorter: any) => {
    this.props.onClickSortableColumn(ModelListViewImpl.getSortFieldName(sorter.field), sorter.order);
  };

  static getLearnMoreLinkUrl = () => ModelRegistryDocUrl;

  static getLearnMoreDisplayString = () => ModelRegistryOnboardingString;

  handleClickNext = () => {
    this.props.onClickNext();
  };

  handleClickPrev = () => {
    this.props.onClickPrev();
  };

  handleSetMaxResult = ({ item, key, keyPath, domEvent }: any) => {
    this.props.onSetMaxResult(key);
  };

  render() {
    // prettier-ignore
    const {
      models,
      currentPage,
      nextPageToken,
      searchInput,
    } = this.props;
    const { loading, error } = this.props;

    // Determine if we use any filters at the moment
    const isFiltered =
      // prettier-ignore
      Boolean(searchInput);

    const title = (
      <FormattedMessage
        defaultMessage="Registered Models"
        description="Header for displaying models in the model registry"
      />
    );
    return (
      <PageContainer data-testid="ModelListView-container" usesFullHeight>
        <div>
          <PageHeader title={title} spacerSize="xs">
            <CreateModelButton />
          </PageHeader>
          {/* TODO[SHIP-6202]: Move the description to the Header prop 'description' once it's been added */}
          <Typography.Hint>
            {ModelListViewImpl.getLearnMoreDisplayString()}{' '}
            <FormattedMessage
              defaultMessage="<link>Learn more</link>"
              description="Learn more link on the model list page with cloud-specific link"
              values={{
                link: (chunks) => (
                  <Typography.Link
                    componentId="codegen_mlflow_app_src_model-registry_components_modellistview.tsx_244"
                    href={ModelListViewImpl.getLearnMoreLinkUrl()}
                    openInNewTab
                  >
                    {chunks}
                  </Typography.Link>
                ),
              }}
            />
          </Typography.Hint>
          <Spacer />

          <ModelListFilters
            searchFilter={this.props.searchInput}
            onSearchFilterChange={(value) => this.handleSearch(null, value)}
            isFiltered={isFiltered}
          />
        </div>
        <ModelListTable
          modelsData={models}
          onSortChange={this.unifiedTableSortChange}
          orderByKey={this.props.orderByKey}
          orderByAsc={this.props.orderByAsc}
          isLoading={loading || false}
          error={error}
          pagination={
            <div
              data-testid="model-list-view-pagination"
              css={{ width: '100%', alignItems: 'center', display: 'flex' }}
            >
              <div css={{ flex: 1 }}>{shouldShowModelsNextUI() && <ModelsNextUIToggleSwitch />}</div>
              <div>
                <CursorPagination
                  componentId="codegen_mlflow_app_src_model-registry_components_modellistview.tsx_305"
                  hasNextPage={Boolean(nextPageToken)}
                  hasPreviousPage={currentPage > 1}
                  onNextPage={this.handleClickNext}
                  onPreviousPage={this.handleClickPrev}
                  pageSizeSelect={{
                    onChange: (num) => this.handleSetMaxResult({ key: num }),
                    default: this.props.maxResultValue,
                    options: [10, 25, 50, 100],
                  }}
                />
              </div>
            </div>
          }
          isFiltered={isFiltered}
        />
      </PageContainer>
    );
  }
}

export const ModelListView = withNextModelsUIContext(injectIntl<'intl', ModelListViewImplProps>(ModelListViewImpl));

const styles = {
  nameSearchBox: {
    width: '446px',
  },
  searchFlexBar: {
    marginBottom: '24px',
  },
  questionMark: {
    marginLeft: 4,
    cursor: 'pointer',
    color: '#888',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: ModelPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelPage.tsx
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
  searchModelVersionsApi,
  getRegisteredModelApi,
  updateRegisteredModelApi,
  deleteRegisteredModelApi,
} from '../actions';
import { ModelView } from './ModelView';
import { getModelVersions } from '../reducers';
import LocalStorageUtils from '../../common/utils/LocalStorageUtils';
import { MODEL_VERSIONS_SEARCH_TIMESTAMP_FIELD, MODEL_VERSIONS_PER_PAGE_COMPACT } from '../constants';
import { PageContainer } from '../../common/components/PageContainer';
import RequestStateWrapper, { triggerError } from '../../common/components/RequestStateWrapper';
import { Spinner } from '../../common/components/Spinner';
import { ErrorView } from '../../common/components/ErrorView';
import { ModelRegistryRoutes } from '../routes';
import Utils from '../../common/utils/Utils';
import { getUUID } from '../../common/utils/ActionUtils';
import { injectIntl } from 'react-intl';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';
import { ErrorCodes } from '../../common/constants';

type ModelPageImplState = {
  maxResultsSelection: number;
  pageTokens: Record<number, string | null>;
  loading: boolean;
  error: Error | undefined;
};

type ModelPageImplProps = WithRouterNextProps<{ subpage: string }> & {
  modelName: string;
  model?: any;
  modelVersions?: any[];
  emailSubscriptionStatus?: string;
  userLevelEmailSubscriptionStatus?: string;
  searchModelVersionsApi: (...args: any[]) => any;
  getRegisteredModelApi: (...args: any[]) => any;
  updateRegisteredModelApi: (...args: any[]) => any;
  deleteRegisteredModelApi: (...args: any[]) => any;
  setEmailSubscriptionStatusApi: (...args: any[]) => any;
  getEmailSubscriptionStatusApi: (...args: any[]) => any;
  getUserLevelEmailSubscriptionStatusApi: (...args: any[]) => any;
  searchEndpointsByModelNameApi: (...args: any[]) => any;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void;
  intl?: any;
};

/**
 * Returns a LocalStorageStore instance that can be used to persist data associated with the
 * ModelRegistry component.
 */
function getModelPageSessionStore(key: any) {
  return LocalStorageUtils.getSessionScopedStoreForComponent('ModelPage', key);
}

export function getOrderByExpr(orderByKey: string, orderByAsc: boolean): string {
  return orderByKey ? `${orderByKey} ${orderByAsc ? 'ASC' : 'DESC'}` : '';
}

export class ModelPageImpl extends React.Component<ModelPageImplProps, ModelPageImplState> {
  constructor(props: ModelPageImplProps) {
    super(props);
    const persistedPageTokens = this.getPersistedPageTokens();
    const maxResultsForTokens = this.getPersistedMaxResults();

    this.state = {
      maxResultsSelection: maxResultsForTokens,
      pageTokens: persistedPageTokens,
      loading: true,
      error: undefined,
    };
  }
  modelPageStoreKey = 'ModelPageStore';
  defaultPersistedPageTokens = { 1: null };

  initSearchModelVersionsApiRequestId = getUUID();
  initgetRegisteredModelApiRequestId = getUUID();
  updateRegisteredModelApiId = getUUID();
  deleteRegisteredModelApiId = getUUID();

  criticalInitialRequestIds = [this.initSearchModelVersionsApiRequestId, this.initgetRegisteredModelApiRequestId];

  componentDidMount() {
    this.loadModelVersions(true);
  }

  updateUrlWithState(orderByKey: string, orderByAsc: boolean, page: number): Promise<void> {
    return new Promise((resolve) => {
      const newParams = new URLSearchParams(this.props.searchParams);
      if (orderByKey) newParams.set('orderByKey', orderByKey);
      if (orderByAsc !== undefined) newParams.set('orderByAsc', String(orderByAsc));
      if (page) newParams.set('page', String(page));
      this.props.setSearchParams(newParams);
      resolve();
    });
  }

  resetHistoryState() {
    this.setState((prevState: any) => ({
      pageTokens: this.defaultPersistedPageTokens,
    }));
    this.setPersistedPageTokens(this.defaultPersistedPageTokens);
  }

  isEmptyPageResponse = (value: any) => {
    return !value || !value.model_versions || !value.next_page_token;
  };

  // Loads the initial set of model versions.
  loadModelVersions(isInitialLoading = true) {
    this.loadPage(this.currentPage, isInitialLoading, true);
  }

  get currentPage() {
    const urlPage = parseInt(this.props.searchParams.get('page') || '1', 10);
    return isNaN(urlPage) ? 1 : urlPage;
  }

  get orderByKey() {
    return this.props.searchParams.get('orderByKey') ?? MODEL_VERSIONS_SEARCH_TIMESTAMP_FIELD;
  }

  get orderByAsc() {
    return this.props.searchParams.get('orderByAsc') === 'true';
  }

  getPersistedPageTokens() {
    const store = getModelPageSessionStore(this.modelPageStoreKey);
    if (store && store.getItem('page_tokens')) {
      return JSON.parse(store.getItem('page_tokens'));
    } else {
      return this.defaultPersistedPageTokens;
    }
  }

  setPersistedPageTokens(page_tokens: any) {
    const store = getModelPageSessionStore(this.modelPageStoreKey);
    if (store) {
      store.setItem('page_tokens', JSON.stringify(page_tokens));
    }
  }

  getPersistedMaxResults() {
    const store = getModelPageSessionStore(this.modelPageStoreKey);
    if (store && store.getItem('max_results')) {
      return parseInt(store.getItem('max_results'), 10);
    } else {
      return MODEL_VERSIONS_PER_PAGE_COMPACT;
    }
  }

  setMaxResultsInStore(max_results: any) {
    const store = getModelPageSessionStore(this.modelPageStoreKey);
    store.setItem('max_results', max_results.toString());
  }

  handleEditDescription = (description: any) => {
    const { model } = this.props;
    return this.props
      .updateRegisteredModelApi(model.name, description, this.updateRegisteredModelApiId)
      .then(() => this.loadPage(1, false, true));
  };

  handleDelete = () => {
    const { model } = this.props;
    return this.props.deleteRegisteredModelApi(model.name, this.deleteRegisteredModelApiId).then(() => {
      this.props.navigate(ModelRegistryRoutes.modelListPageRoute);
    });
  };

  loadPage = (page: number, isInitialLoading: boolean, loadModelMetadata = false) => {
    const { modelName } = this.props;
    const { pageTokens } = this.state;
    this.setState({ loading: true, error: undefined });
    const filters_obj = { name: modelName };
    const promiseValues = [
      this.props
        .searchModelVersionsApi(
          filters_obj,
          isInitialLoading ? this.initSearchModelVersionsApiRequestId : null,
          this.state.maxResultsSelection,
          getOrderByExpr(this.orderByKey, this.orderByAsc),
          pageTokens[page],
        )
        .then((response: any) => {
          this.updatePageState(page, response);
        }),
    ];
    if (loadModelMetadata) {
      promiseValues.push(
        this.props.getRegisteredModelApi(
          modelName,
          isInitialLoading === true ? this.initgetRegisteredModelApiRequestId : null,
        ),
      );
    }
    return Promise.all(promiseValues)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false, error });
        this.resetHistoryState();
      });
  };

  getNextPageTokenFromResponse(response: any) {
    const { value } = response;
    if (this.isEmptyPageResponse(value)) {
      // Why we could be here:
      // 1. There are no models returned: we went to the previous page but all models after that
      //    page's token has been deleted.
      // 2. If `next_page_token` is not returned, assume there is no next page.
      return null;
    } else {
      return value.next_page_token;
    }
  }

  updatePageState = (page: any, response = {}) => {
    const nextPageToken = this.getNextPageTokenFromResponse(response);
    this.setState(
      (prevState: any) => ({
        pageTokens: {
          ...prevState.pageTokens,
          [page + 1]: nextPageToken,
        },
      }),
      () => {
        this.setPersistedPageTokens(this.state.pageTokens);
      },
    );
  };

  handleMaxResultsChange = (key: string) => {
    this.setState({ maxResultsSelection: parseInt(key, 10) }, () => {
      this.resetHistoryState();
      const { maxResultsSelection } = this.state;
      this.setMaxResultsInStore(maxResultsSelection);
      this.loadPage(1, false);
    });
  };

  handleClickNext = () => {
    const nextPage = this.currentPage + 1;
    this.updateUrlWithState(this.orderByKey, this.orderByAsc, nextPage).then(() => {
      this.loadPage(nextPage, false);
    });
  };

  handleClickPrev = () => {
    const prevPage = this.currentPage - 1;
    this.updateUrlWithState(this.orderByKey, this.orderByAsc, prevPage).then(() => {
      this.loadPage(prevPage, false);
    });
  };

  handleClickSortableColumn = (orderByKey: string, orderByDesc: boolean) => {
    const orderByAsc = !orderByDesc;
    this.resetHistoryState();
    this.updateUrlWithState(orderByKey, orderByAsc, 1).then(() => {
      this.loadPage(1, false);
    });
  };

  getMaxResultsSelection = () => {
    return this.state.maxResultsSelection;
  };

  render() {
    const { model, modelVersions, navigate, modelName } = this.props;
    const { pageTokens } = this.state;
    return (
      <PageContainer>
        <RequestStateWrapper requestIds={this.criticalInitialRequestIds}>
          {(loading: any, hasError: any, requests: any) => {
            if (hasError) {
              if (Utils.shouldRender404(requests, [this.initgetRegisteredModelApiRequestId])) {
                return (
                  <ErrorView
                    statusCode={404}
                    subMessage={this.props.intl.formatMessage(
                      {
                        defaultMessage: 'Model {modelName} does not exist',
                        description: 'Sub-message text for error message on overall model page',
                      },
                      {
                        modelName: modelName,
                      },
                    )}
                    fallbackHomePageReactRoute={ModelRegistryRoutes.modelListPageRoute}
                  />
                );
              }
              const permissionDeniedErrors = requests.filter((request: any) => {
                return (
                  this.criticalInitialRequestIds.includes(request.id) &&
                  request.error?.getErrorCode() === ErrorCodes.PERMISSION_DENIED
                );
              });
              if (permissionDeniedErrors && permissionDeniedErrors[0]) {
                return (
                  <ErrorView
                    statusCode={403}
                    subMessage={this.props.intl.formatMessage(
                      {
                        defaultMessage: 'Permission denied for {modelName}. Error: "{errorMsg}"',
                        description: 'Permission denied error message on registered model detail page',
                      },
                      {
                        modelName: modelName,
                        errorMsg: permissionDeniedErrors[0].error?.getMessageField(),
                      },
                    )}
                    fallbackHomePageReactRoute={ModelRegistryRoutes.modelListPageRoute}
                  />
                );
              }
              // TODO(Zangr) Have a more generic boundary to handle all errors, not just 404.
              triggerError(requests);
            } else if (loading) {
              return <Spinner />;
            } else if (model) {
              // Null check to prevent NPE after delete operation
              return (
                <ModelView
                  model={model}
                  modelVersions={modelVersions}
                  handleEditDescription={this.handleEditDescription}
                  handleDelete={this.handleDelete}
                  navigate={navigate}
                  onMetadataUpdated={this.loadModelVersions}
                  orderByKey={this.orderByKey}
                  orderByAsc={this.orderByAsc}
                  currentPage={this.currentPage}
                  nextPageToken={pageTokens[this.currentPage + 1]}
                  onClickNext={this.handleClickNext}
                  onClickPrev={this.handleClickPrev}
                  onClickSortableColumn={this.handleClickSortableColumn}
                  onSetMaxResult={this.handleMaxResultsChange}
                  maxResultValue={this.getMaxResultsSelection()}
                  loading={this.state.loading}
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

const mapStateToProps = (state: any, ownProps: WithRouterNextProps<{ modelName: string }>) => {
  const modelName = decodeURIComponent(ownProps.params.modelName);
  const model = state.entities.modelByName[modelName];
  const modelVersions = getModelVersions(state, modelName);
  return {
    modelName,
    model,
    modelVersions,
  };
};

const mapDispatchToProps = {
  searchModelVersionsApi,
  getRegisteredModelApi,
  updateRegisteredModelApi,
  deleteRegisteredModelApi,
};

const ModelPageWithRouter = withRouterNext(
  // @ts-expect-error TS(2769): No overload matches this call.
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(ModelPageImpl)),
);

export const ModelPage = withErrorBoundary(ErrorUtils.mlflowServices.MODEL_REGISTRY, ModelPageWithRouter);

export default ModelPage;
```

--------------------------------------------------------------------------------

---[FILE: ModelsNextUIPromoModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelsNextUIPromoModal.tsx

```typescript
import { Button, Modal, Typography } from '@databricks/design-system';
import { ReactComponent as PromoContentSvg } from '../../common/static/promo-modal-content.svg';
import { FormattedMessage } from 'react-intl';
import { modelStagesMigrationGuideLink } from '../../common/constants';

export const ModelsNextUIPromoModal = ({
  visible,
  onClose,
  onTryItNow,
}: {
  visible: boolean;
  onClose: () => void;
  onTryItNow: () => void;
}) => (
  <Modal
    componentId="codegen_mlflow_app_src_model-registry_components_modelsnextuipromomodal.tsx_15"
    visible={visible}
    title={
      <FormattedMessage
        defaultMessage="Flexible, governed deployments with the new Model Registry UI"
        description="Model registry > OSS Promo modal for model version aliases > modal title"
      />
    }
    onCancel={onClose}
    footer={
      <>
        <Button
          componentId="codegen_mlflow_app_src_model-registry_components_modelsnextuipromomodal.tsx_26"
          href={modelStagesMigrationGuideLink}
          rel="noopener"
          target="_blank"
        >
          <FormattedMessage
            defaultMessage="Learn more"
            description="Model registry > OSS Promo modal for model version aliases > learn more link"
          />
        </Button>
        <Button
          componentId="codegen_mlflow_app_src_model-registry_components_modelsnextuipromomodal.tsx_32"
          type="primary"
          onClick={onTryItNow}
        >
          <FormattedMessage
            defaultMessage="Try it now"
            description="Model registry > OSS Promo modal for model version aliases > try it now button label"
          />
        </Button>
      </>
    }
  >
    <PromoContentSvg width="100%" />
    <Typography.Text>
      <FormattedMessage
        defaultMessage={`With the latest Model Registry UI, you can use <b>Model Aliases</b> for flexible 
        references to specific model versions, streamlining deployment in a given environment. Use 
        <b>Model Tags</b> to annotate model versions with metadata, like the status of pre-deployment checks.`}
        description="Model registry > OSS Promo modal for model version aliases > description paragraph body"
        values={{
          b: (chunks: any) => <b>{chunks}</b>,
        }}
      />
    </Typography.Text>
  </Modal>
);
```

--------------------------------------------------------------------------------

---[FILE: ModelsNextUIToggleSwitch.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelsNextUIToggleSwitch.test.tsx

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { renderWithIntl, act, screen, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { useNextModelsUIContext, withNextModelsUIContext } from '../hooks/useNextModelsUI';
import { ModelsNextUIToggleSwitch } from './ModelsNextUIToggleSwitch';

jest.mock('../../common/utils/FeatureUtils', () => ({
  shouldShowModelsNextUI: () => true,
}));

describe('ModelsNextUIToggleSwitch', () => {
  const renderTestComponent = (additionalElement: React.ReactNode = null) => {
    const Component = withNextModelsUIContext(() => {
      return (
        <>
          <ModelsNextUIToggleSwitch />
          {additionalElement}
        </>
      );
    });

    return renderWithIntl(<Component />);
  };

  const mockSeenPromoModal = () =>
    jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => (key.match(/promo/) ? 'true' : ''));

  const mockUnseenPromoModal = () =>
    jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => (key.match(/promo/) ? 'false' : ''));

  test('it should render the switch and display the promo modal', () => {
    mockUnseenPromoModal();

    renderTestComponent();
    expect(screen.getByRole('switch', { name: /New model registry UI/ })).toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByText(/Flexible, governed deployments/)).toBeInTheDocument();
  });

  test("it should not render display the promo modal when it's already seen", () => {
    mockSeenPromoModal();
    renderTestComponent();
    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('it should display confirmation modal when trying to switch off', async () => {
    mockSeenPromoModal();

    const PreviewComponent = () => {
      const { usingNextModelsUI } = useNextModelsUIContext();
      return <div>{usingNextModelsUI ? 'enabled' : 'disabled'}</div>;
    };

    renderTestComponent(<PreviewComponent />);

    expect(screen.getByText('enabled')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('switch'));

    expect(within(screen.getByRole('dialog')).getByText(/your feedback is invaluable/)).toBeInTheDocument();
  });

  test('it should disable and enable using switch', async () => {
    mockSeenPromoModal();

    const PreviewComponent = () => {
      const { usingNextModelsUI } = useNextModelsUIContext();
      return <div>{usingNextModelsUI ? 'enabled' : 'disabled'}</div>;
    };

    renderTestComponent(<PreviewComponent />);

    expect(screen.getByText('enabled')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('switch'));

    await userEvent.click(screen.getByText('Disable'));

    expect(screen.getByText('disabled')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('switch'));

    expect(screen.getByText('enabled')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelsNextUIToggleSwitch.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelsNextUIToggleSwitch.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ModelsNextUIPromoModal } from './ModelsNextUIPromoModal';
import { Modal, Switch, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useNextModelsUIContext } from '../hooks/useNextModelsUI';

const promoModalSeenStorageKey = '_mlflow_model_registry_promo_modal_dismissed';

export const ModelsNextUIToggleSwitch = () => {
  const { usingNextModelsUI, setUsingNextModelsUI } = useNextModelsUIContext();

  const promoModalVisited = window.localStorage.getItem(promoModalSeenStorageKey) === 'true';

  const [promoModalVisible, setPromoModalVisible] = useState(!promoModalVisited);
  const [confirmDisableModalVisible, setConfirmDisableModalVisible] = useState(false);

  const setPromoModalVisited = useCallback(() => {
    setPromoModalVisible(false);
    window.localStorage.setItem(promoModalSeenStorageKey, 'true');
  }, []);

  const intl = useIntl();
  const label = intl.formatMessage({
    defaultMessage: 'New model registry UI',
    description: 'Model registry > Switcher for the new model registry UI containing aliases > label',
  });
  const switchNextUI = (newUsingNewUIValue: boolean) => {
    if (!newUsingNewUIValue) {
      setConfirmDisableModalVisible(true);
    } else {
      setUsingNextModelsUI(true);
    }
  };
  const { theme } = useDesignSystemTheme();
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
        <label>{label}</label>
        <Switch
          componentId="codegen_mlflow_app_src_model-registry_components_modelsnextuitoggleswitch.tsx_39"
          checked={usingNextModelsUI}
          aria-label={label}
          onChange={switchNextUI}
        />
      </div>
      <ModelsNextUIPromoModal
        visible={promoModalVisible}
        onClose={() => {
          setPromoModalVisited();
        }}
        onTryItNow={() => {
          setPromoModalVisited();
        }}
      />
      <Modal
        componentId="codegen_mlflow_app_src_model-registry_components_modelsnextuitoggleswitch.tsx_50"
        visible={confirmDisableModalVisible}
        title={
          <FormattedMessage
            defaultMessage="Disable the new model stages"
            description="Model registry > Switcher for the new model registry UI containing aliases > disable confirmation modal title"
          />
        }
        okText="Disable"
        onCancel={() => {
          setConfirmDisableModalVisible(false);
        }}
        onOk={() => {
          setUsingNextModelsUI(false);
          setConfirmDisableModalVisible(false);
        }}
      >
        <FormattedMessage
          defaultMessage="
          Thank you for exploring the new Model Registry UI. We are dedicated to providing the best experience, and your feedback is invaluable.
          Please share your thoughts with us <link>here</link>."
          description="Model registry > Switcher for the new model registry UI containing aliases > disable confirmation modal content"
          values={{
            link: (chunks) => (
              <Typography.Link
                componentId="codegen_mlflow_app_src_model-registry_components_modelsnextuitoggleswitch.tsx_74"
                href="https://forms.gle/aMB4qDrhMeEm2r359"
                openInNewTab
              >
                {chunks}
              </Typography.Link>
            ),
          }}
        />
      </Modal>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelStageTransitionDropdown.css]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelStageTransitionDropdown.css

```text
.mlflow-stage-transition-dropdown .ant-tag {
  cursor: pointer;
  border-radius: 4px;
}
```

--------------------------------------------------------------------------------

---[FILE: ModelStageTransitionDropdown.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelStageTransitionDropdown.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import { ModelStageTransitionDropdown } from './ModelStageTransitionDropdown';
import { Stages } from '../constants';
import { Dropdown } from '@databricks/design-system';
import { mockGetFieldValue } from '../test-utils';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

describe('ModelStageTransitionDropdown', () => {
  let wrapper: any;
  let minimalProps: any;
  let commonProps: any;

  beforeEach(() => {
    minimalProps = {
      currentStage: Stages.NONE,
    };
    commonProps = {
      ...minimalProps,
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = mountWithIntl(<ModelStageTransitionDropdown {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should omit current stage in dropdown', () => {
    const props = {
      ...commonProps,
      currentStage: Stages.STAGING,
    };
    wrapper = mountWithIntl(<ModelStageTransitionDropdown {...props} />);
    wrapper.find('.mlflow-stage-transition-dropdown').first().simulate('click');
    const menuHtml = mountWithIntl(wrapper.find(Dropdown).props().overlay).html();

    expect(menuHtml).not.toContain(Stages.STAGING);
    expect(menuHtml).toContain(Stages.PRODUCTION);
    expect(menuHtml).toContain(Stages.NONE);
    expect(menuHtml).toContain(Stages.ARCHIVED);
  });

  test('handleMenuItemClick - archiveExistingVersions', () => {
    const mockOnSelect = jest.fn();
    const props = {
      ...commonProps,
      onSelect: mockOnSelect,
    };
    const activity = {};
    wrapper = shallow(<ModelStageTransitionDropdown {...props} />);
    const mockArchiveFieldValues = [true, false, undefined];
    mockArchiveFieldValues.forEach((fieldValue) => {
      const expectArchiveFieldValue = Boolean(fieldValue); // undefined should become false also
      const instance = wrapper.instance();
      instance.transitionFormRef = {
        current: {
          getFieldValue: mockGetFieldValue('', fieldValue),
          resetFields: () => {},
        },
      };
      instance.handleMenuItemClick(activity);
      instance.state.handleConfirm({
        archiveExistingVersions: fieldValue,
      });
      // eslint-disable-next-line jest/no-standalone-expect
      expect(mockOnSelect).toHaveBeenCalledWith(activity, expectArchiveFieldValue);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelStageTransitionDropdown.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelStageTransitionDropdown.tsx
Signals: React

```typescript
import React from 'react';
import { Dropdown, Menu, ChevronDownIcon, ArrowRightIcon } from '@databricks/design-system';
import {
  Stages,
  StageTagComponents,
  ActivityTypes,
  type PendingModelVersionActivity,
  ACTIVE_STAGES,
} from '../constants';
import { remove } from 'lodash';
import { FormattedMessage } from 'react-intl';
import type { ModelStageTransitionFormModalValues } from './ModelStageTransitionFormModal';
import { ModelStageTransitionFormModal } from './ModelStageTransitionFormModal';

type ModelStageTransitionDropdownProps = {
  currentStage?: string;
  permissionLevel?: string;
  onSelect?: (activity: PendingModelVersionActivity, comment?: string, archiveExistingVersions?: boolean) => void;
};

type ModelStageTransitionDropdownState = {
  confirmModalVisible: boolean;
  confirmingActivity: PendingModelVersionActivity | null;
  handleConfirm: ((values: ModelStageTransitionFormModalValues) => void) | undefined;
};

export class ModelStageTransitionDropdown extends React.Component<
  ModelStageTransitionDropdownProps,
  ModelStageTransitionDropdownState
> {
  static defaultProps = {
    currentStage: Stages.NONE,
  };

  state: ModelStageTransitionDropdownState = {
    confirmModalVisible: false,
    confirmingActivity: null,
    handleConfirm: undefined,
  };

  handleMenuItemClick = (activity: PendingModelVersionActivity) => {
    const { onSelect } = this.props;
    this.setState({
      confirmModalVisible: true,
      confirmingActivity: activity,
      handleConfirm:
        onSelect &&
        ((values: ModelStageTransitionFormModalValues) => {
          this.setState({ confirmModalVisible: false });

          if (values) {
            const { archiveExistingVersions = false } = values;
            // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
            onSelect(activity, archiveExistingVersions);
            return;
          }
        }),
    });
  };

  handleConfirmModalCancel = () => {
    this.setState({ confirmModalVisible: false });
  };

  getNoneCurrentStages = (currentStage?: string) => {
    const stages = Object.values(Stages);
    remove(stages, (s) => s === currentStage);
    return stages;
  };

  getMenu() {
    const { currentStage } = this.props;
    const nonCurrentStages = this.getNoneCurrentStages(currentStage);
    return (
      <Menu>
        {nonCurrentStages.map((stage) => (
          <Menu.Item
            key={`transition-to-${stage}`}
            onClick={() =>
              this.handleMenuItemClick({
                type: ActivityTypes.APPLIED_TRANSITION,
                to_stage: stage,
              })
            }
          >
            <FormattedMessage
              defaultMessage="Transition to"
              description="Text for transitioning a model version to a different stage under
                 dropdown menu in model version page"
            />
            &nbsp;&nbsp;&nbsp;
            <ArrowRightIcon />
            &nbsp;&nbsp;&nbsp;
            {StageTagComponents[stage]}
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  renderConfirmModal() {
    const { confirmModalVisible, confirmingActivity, handleConfirm } = this.state;

    if (!confirmingActivity) {
      return null;
    }

    const allowArchivingExistingVersions =
      confirmingActivity.type === ActivityTypes.APPLIED_TRANSITION &&
      ACTIVE_STAGES.includes(confirmingActivity.to_stage);

    return (
      <ModelStageTransitionFormModal
        visible={confirmModalVisible}
        toStage={confirmingActivity.to_stage}
        onConfirm={handleConfirm}
        onCancel={this.handleConfirmModalCancel}
        transitionDescription={renderActivityDescription(confirmingActivity)}
        allowArchivingExistingVersions={allowArchivingExistingVersions}
      />
    );
  }

  render() {
    const { currentStage } = this.props;
    return (
      <span>
        <Dropdown overlay={this.getMenu()} trigger={['click']} className="mlflow-stage-transition-dropdown">
          <span>
            {StageTagComponents[currentStage ?? Stages.NONE]}
            <ChevronDownIcon css={{ cursor: 'pointer', marginLeft: -4 }} />
          </span>
        </Dropdown>
        {this.renderConfirmModal()}
      </span>
    );
  }
}

export const renderActivityDescription = (activity: PendingModelVersionActivity) => {
  if (activity) {
    return (
      <div>
        <FormattedMessage
          defaultMessage="Transition to"
          description="Text for activity description under confirmation modal for model
             version stage transition"
        />
        &nbsp;&nbsp;&nbsp;
        <ArrowRightIcon />
        &nbsp;&nbsp;&nbsp;
        {StageTagComponents[activity.to_stage]}
      </div>
    );
  }
  return null;
};
```

--------------------------------------------------------------------------------

````
