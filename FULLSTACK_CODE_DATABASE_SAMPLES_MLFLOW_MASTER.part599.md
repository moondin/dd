---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 599
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 599 of 991)

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

---[FILE: CreateModelButton.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CreateModelButton.test.tsx
Signals: Redux/RTK

```typescript
import { describe, test, expect } from '@jest/globals';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { CreateModelButton } from './CreateModelButton';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';

const minimalProps = {};

const mockStore = configureStore([thunk, promiseMiddleware()]);
const minimalStore = mockStore({});

const buttonDataTestId = 'create-model-button';
const inputModelDataTestId = 'mlflow-input-modal';

describe('CreateModelButton', () => {
  test('should render with minimal props and store without exploding', () => {
    renderWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CreateModelButton {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId(buttonDataTestId)).toBeInTheDocument();
  });

  test('should render button type link correctly', () => {
    const { container } = renderWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CreateModelButton buttonType="link" />
        </MemoryRouter>
      </Provider>,
    );

    expect(container.querySelector('.ant-btn-link')).toBeInTheDocument();
  });

  test('should hide modal by default', () => {
    renderWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CreateModelButton buttonType="link" />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByTestId(inputModelDataTestId)).not.toBeInTheDocument();
  });

  test('should show modal after button click', async () => {
    renderWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CreateModelButton buttonType="link" />
        </MemoryRouter>
      </Provider>,
    );

    await userEvent.click(screen.getByTestId(buttonDataTestId));
    expect(screen.getByTestId(inputModelDataTestId)).toBeVisible();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CreateModelButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CreateModelButton.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import type { ButtonProps } from '@databricks/design-system';
import { Button } from '@databricks/design-system';
import { CreateModelModal } from './CreateModelModal';
import { FormattedMessage } from 'react-intl';

type Props = {
  buttonType?: ButtonProps['type'];
  buttonText?: React.ReactNode;
};

export function CreateModelButton({
  buttonType = 'primary',
  buttonText = <FormattedMessage defaultMessage="Create Model" description="Create button to register a new model" />,
}: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const hideModal = () => {
    setModalVisible(false);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  return (
    <div css={styles.wrapper}>
      <Button
        componentId="codegen_mlflow_app_src_model-registry_components_CreateModelButton.tsx_28"
        className="create-model-btn"
        css={styles.getButtonSize(buttonType)}
        type={buttonType}
        onClick={showModal}
        data-testid="create-model-button"
      >
        {buttonText}
      </Button>
      <CreateModelModal modalVisible={modalVisible} hideModal={hideModal} />
    </div>
  );
}

const styles = {
  getButtonSize: (buttonType: string) =>
    buttonType === 'primary'
      ? {
          height: '40px',
          width: 'fit-content',
        }
      : { padding: '0px' },
  wrapper: { display: 'inline' },
};
```

--------------------------------------------------------------------------------

---[FILE: CreateModelForm.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CreateModelForm.test.tsx
Signals: React

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import React from 'react';
import { CreateModelForm } from './CreateModelForm';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

describe('Render test', () => {
  const minimalProps = {
    visible: true,
    form: { getFieldDecorator: jest.fn(() => (c: any) => c) },
  };

  test('should render form in modal', () => {
    renderWithIntl(<CreateModelForm {...minimalProps} />);
    expect(screen.getByTestId('create-model-form-modal')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CreateModelForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CreateModelForm.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';

import { LegacyForm, Input } from '@databricks/design-system';
import { ModelRegistryDocUrl } from '../../common/constants';
import { FormattedMessage, injectIntl } from 'react-intl';

export const MODEL_NAME_FIELD = 'modelName';

type Props = {
  visible: boolean;
  validator?: (...args: any[]) => any;
  intl?: any;
  innerRef: any;
};

/**
 * Component that renders a form for creating a new experiment.
 */
class CreateModelFormImpl extends Component<Props> {
  static getLearnMoreLinkUrl = () => ModelRegistryDocUrl;

  render() {
    const learnMoreLinkUrl = CreateModelFormImpl.getLearnMoreLinkUrl();
    return (
      // @ts-expect-error TS(2322)
      <LegacyForm ref={this.props.innerRef} layout="vertical" data-testid="create-model-form-modal">
        <LegacyForm.Item
          name={MODEL_NAME_FIELD}
          label={this.props.intl.formatMessage({
            defaultMessage: 'Model name',
            description: 'Text for form title on creating model in the model registry',
          })}
          rules={[
            {
              required: true,
              message: this.props.intl.formatMessage({
                defaultMessage: 'Please input a name for the new model.',
                description: 'Error message for having no input for creating models in the model registry',
              }),
            },
            { validator: this.props.validator },
          ]}
        >
          <Input componentId="codegen_mlflow_app_src_model-registry_components_createmodelform.tsx_62" autoFocus />
        </LegacyForm.Item>
        <p className="create-modal-explanatory-text">
          <FormattedMessage
            defaultMessage="After creation, you can register logged models as new versions.&nbsp;"
            description="Text for form description on creating model in the model registry"
          />
          <FormattedMessage
            defaultMessage="<link>Learn more</link>"
            description="Learn more link on the form for creating model in the model registry"
            values={{
              link: (
                chunks: any, // Reported during ESLint upgrade
              ) => (
                // eslint-disable-next-line react/jsx-no-target-blank
                <a href={learnMoreLinkUrl} target="_blank">
                  {chunks}
                </a>
              ),
            }}
          />
          .
        </p>
      </LegacyForm>
    );
  }
}

// @ts-expect-error TS(2769): No overload matches this call.
export const CreateModelForm = injectIntl(CreateModelFormImpl);
```

--------------------------------------------------------------------------------

---[FILE: CreateModelModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CreateModelModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { GenericInputModal } from '../../experiment-tracking/components/modals/GenericInputModal';
import { CreateModelForm, MODEL_NAME_FIELD } from './CreateModelForm';
import { connect } from 'react-redux';
import { createRegisteredModelApi } from '../actions';
import { getUUID } from '../../common/utils/ActionUtils';
import { ModelRegistryRoutes } from '../routes';
import { debounce } from 'lodash';
import { modelNameValidator } from '../../common/forms/validations';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';

type Props = WithRouterNextProps & {
  createRegisteredModelApi: (...args: any[]) => any;
  modalVisible: boolean;
  hideModal: (...args: any[]) => any;
  navigateBackOnCancel?: boolean;
  intl: IntlShape;
};

class CreateModelModalImpl extends React.Component<Props> {
  createRegisteredModelRequestId = getUUID();

  handleCreateRegisteredModel = async (values: any) => {
    const result = await this.props.createRegisteredModelApi(
      values[MODEL_NAME_FIELD],
      this.createRegisteredModelRequestId,
    );
    const newModel = result.value && result.value.registered_model;
    if (newModel) {
      // Jump to the page of newly created model. Here we are yielding to next tick to allow modal
      // and form to finish closing and cleaning up.
      setTimeout(() => this.props.navigate(ModelRegistryRoutes.getModelPageRoute(newModel.name)));
    }
  };

  debouncedModelNameValidator = debounce(modelNameValidator, 400);

  handleOnCancel = () => {
    if (this.props.navigateBackOnCancel) {
      this.props.navigate(ModelRegistryRoutes.modelListPageRoute);
    }
  };

  render() {
    const { modalVisible, hideModal } = this.props;
    return (
      <GenericInputModal
        title={this.props.intl.formatMessage({
          defaultMessage: 'Create Model',
          description: 'Title text for creating model in the model registry',
        })}
        okText={this.props.intl.formatMessage({
          defaultMessage: 'Create',
          description: 'Create button text for creating model in the model registry',
        })}
        cancelText={this.props.intl.formatMessage({
          defaultMessage: 'Cancel',
          description: 'Cancel button text for creating model in the model registry',
        })}
        isOpen={modalVisible}
        handleSubmit={this.handleCreateRegisteredModel}
        onClose={hideModal}
        onCancel={this.handleOnCancel}
      >
        {/* @ts-expect-error TS(2322): Type '{ visible: boolean; validator: ((rule: any, ... Remove this comment to see the full error message */}
        <CreateModelForm visible={modalVisible} validator={this.debouncedModelNameValidator} />
      </GenericInputModal>
    );
  }
}

const mapDispatchToProps = {
  createRegisteredModelApi,
};

const CreateModelModalWithRouter = withRouterNext(
  connect(undefined, mapDispatchToProps)(injectIntl<'intl', Props>(CreateModelModalImpl)),
);

export const CreateModelModal = withErrorBoundary(ErrorUtils.mlflowServices.MODEL_REGISTRY, CreateModelModalWithRouter);
```

--------------------------------------------------------------------------------

---[FILE: ModelListPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelListPage.enzyme.test.tsx
Signals: Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { mockModelVersionDetailed, mockRegisteredModelDetailed } from '../test-utils';
import {
  ModelVersionStatus,
  REGISTERED_MODELS_SEARCH_TIMESTAMP_FIELD,
  REGISTERED_MODELS_SEARCH_NAME_FIELD,
  Stages,
} from '../constants';
import { Provider } from 'react-redux';
import { MemoryRouter, createMLflowRoutePath } from '../../common/utils/RoutingUtils';
import { ModelListPageImpl } from './ModelListPage';
import { IntlProvider } from 'react-intl';

const flushPromises = () => new Promise(setImmediate);

describe('ModelListPage', () => {
  let wrapper: any;
  let minimalProps: any;
  let minimalStore: any;
  let instance;
  let navigateSpy: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  const noop = () => {};
  const loadPageMock = (page: any, isInitialLoading: any) => {};

  beforeEach(() => {
    const location = {
      pathName: '/models',
      search: '',
    };

    navigateSpy = jest.fn();

    minimalProps = {
      models: [],
      searchRegisteredModelsApi: jest.fn(() => Promise.resolve({})),
      getRegistryWidePermissionsApi: jest.fn(() => Promise.resolve({})),
      apis: {},
      navigate: navigateSpy,
      location,
    };
    const name = 'Model A';
    const versions = [mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY)];
    minimalStore = mockStore({
      entities: {
        modelByName: {
          // @ts-expect-error TS(2345): Argument of type '{ name: any; creation_timestamp:... Remove this comment to see the full error message
          [name]: mockRegisteredModelDetailed(name, versions),
        },
      },
      apis: {},
    });
  });

  describe('the states should be correctly set upon user input and clear', () => {
    beforeEach(() => {
      wrapper = mount(
        <IntlProvider locale="en">
          <Provider store={minimalStore}>
            <MemoryRouter>
              <ModelListPageImpl {...minimalProps} />
            </MemoryRouter>
          </Provider>
        </IntlProvider>,
      );
    });

    test('the states should be correctly set when page is loaded initially', () => {
      instance = wrapper.find(ModelListPageImpl).instance();
      jest.spyOn(instance, 'loadPage').mockImplementation(loadPageMock);
      expect(instance.state.searchInput).toBe('');
      expect(instance.state.orderByKey).toBe(REGISTERED_MODELS_SEARCH_NAME_FIELD);
      expect(instance.state.orderByAsc).toBe(true);
    });

    test('the states should be correctly set when user enters name search', () => {
      instance = wrapper.find(ModelListPageImpl).instance();
      jest.spyOn(instance, 'loadPage').mockImplementation(loadPageMock);
      instance.handleSearch('abc');
      expect(instance.state.searchInput).toBe('abc');
      expect(instance.state.currentPage).toBe(1);
    });

    test('the states should be correctly set when user enters tag search', () => {
      instance = wrapper.find(ModelListPageImpl).instance();
      jest.spyOn(instance, 'loadPage').mockImplementation(loadPageMock);
      instance.handleSearch('tags.k = v');
      expect(instance.state.searchInput).toBe('tags.k = v');
      expect(instance.state.currentPage).toBe(1);
    });

    test('the states should be correctly set when user enters name and tag search', () => {
      instance = wrapper.find(ModelListPageImpl).instance();
      jest.spyOn(instance, 'loadPage').mockImplementation(loadPageMock);
      instance.handleSearch('name ilike "%xyz%" AND tags.k="v"');
      expect(instance.state.searchInput).toBe('name ilike "%xyz%" AND tags.k="v"');
      expect(instance.state.currentPage).toBe(1);
    });
    test('the states should be correctly set when user clear input', () => {
      instance = wrapper.find(ModelListPageImpl).instance();
      instance.state.searchInput = 'abc';
      jest.spyOn(instance, 'loadPage').mockImplementation(loadPageMock);
    });
  });

  test('should render with minimal props and store without exploding', () => {
    wrapper = mount(
      <IntlProvider locale="en">
        <Provider store={minimalStore}>
          <MemoryRouter>
            <ModelListPageImpl {...minimalProps} />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    expect(wrapper.find(ModelListPageImpl).length).toBe(1);
  });

  test('updateUrlWithSearchFilter correctly pushes url with params', () => {
    wrapper = mount(
      <IntlProvider locale="en">
        <Provider store={minimalStore}>
          <MemoryRouter>
            <ModelListPageImpl {...minimalProps} />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    instance = wrapper.find(ModelListPageImpl).instance();
    instance.updateUrlWithSearchFilter(
      'name ilike "%name%" AND tag.key=value',
      REGISTERED_MODELS_SEARCH_TIMESTAMP_FIELD,
      false,
      2,
    );
    const expectedUrl = `/models?searchInput=name%20ilike%20%22%25name%25%22%20AND%20tag.key%3Dvalue&orderByKey=timestamp&orderByAsc=false&page=2`;
    expect(navigateSpy).toHaveBeenCalledWith(createMLflowRoutePath(expectedUrl));
  });

  test('should construct pushes URL correctly from old URLs with nameSearchInput', () => {
    minimalProps['location']['search'] = 'nameSearchInput=abc';
    wrapper = mount(
      <IntlProvider locale="en">
        <Provider store={minimalStore}>
          <MemoryRouter>
            <ModelListPageImpl {...minimalProps} />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    instance = wrapper.find(ModelListPageImpl).instance();
    const expectedUrl = '/models?searchInput=abc';
    instance.render();
    expect(navigateSpy).toHaveBeenCalledWith(createMLflowRoutePath(expectedUrl));
  });

  test('should pushes URL correctly from old URLs with tagSearchInput', () => {
    minimalProps['location']['search'] = 'tagSearchInput=tags.k%20%3D%20"v"';
    wrapper = mount(
      <IntlProvider locale="en">
        <Provider store={minimalStore}>
          <MemoryRouter>
            <ModelListPageImpl {...minimalProps} />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    instance = wrapper.find(ModelListPageImpl).instance();
    const expectedUrl = `/models?searchInput=tags.k%20%3D%20%22v%22`;
    instance.render();
    expect(navigateSpy).toHaveBeenCalledWith(createMLflowRoutePath(expectedUrl));
  });

  test('should pushes URL correctly from old URLs with nameSearchInput and tagSearchInput', () => {
    minimalProps['location']['search'] = 'nameSearchInput=abc&tagSearchInput=tags.k%20%3D%20"v"';
    wrapper = mount(
      <IntlProvider locale="en">
        <Provider store={minimalStore}>
          <MemoryRouter>
            <ModelListPageImpl {...minimalProps} />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    instance = wrapper.find(ModelListPageImpl).instance();
    const expectedUrl = '/models?searchInput=name%20ilike%20%27%25abc%25%27%20AND%20tags.k%20%3D%20%22v%22';
    instance.render();
    expect(navigateSpy).toHaveBeenCalledWith(createMLflowRoutePath(expectedUrl));
  });

  test('should pushes URL correctly from URLs with searchInput', () => {
    minimalProps['location']['search'] = 'searchInput=name%20ilike%20"%25ab%25"%20AND%20tags.a%20%3D%201';
    wrapper = mount(
      <IntlProvider locale="en">
        <Provider store={minimalStore}>
          <MemoryRouter>
            <ModelListPageImpl {...minimalProps} />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    instance = wrapper.find(ModelListPageImpl).instance();
    const expectedUrl = '/models?searchInput=name%20ilike%20%22%25ab%25%22%20AND%20tags.a%20%3D%201';
    instance.render();
    expect(navigateSpy).toHaveBeenCalledWith(createMLflowRoutePath(expectedUrl));
  });
  // eslint-disable-next-line
});
```

--------------------------------------------------------------------------------

---[FILE: ModelListPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelListPage.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { ModelListView } from './ModelListView';
import { connect } from 'react-redux';
import { getUUID } from '../../common/utils/ActionUtils';
import Utils from '../../common/utils/Utils';
import { getCombinedSearchFilter, constructSearchInputFromURLState } from '../utils/SearchUtils';
import {
  AntdTableSortOrder,
  REGISTERED_MODELS_PER_PAGE_COMPACT,
  REGISTERED_MODELS_SEARCH_NAME_FIELD,
} from '../constants';
import { searchRegisteredModelsApi } from '../actions';
import LocalStorageUtils from '../../common/utils/LocalStorageUtils';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { createMLflowRoutePath } from '../../common/utils/RoutingUtils';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { ScrollablePageWrapper } from '../../common/components/ScrollablePageWrapper';

type ModelListPageImplProps = WithRouterNextProps & {
  models?: any[];
  searchRegisteredModelsApi: (...args: any[]) => any;
};

type ModelListPageImplState = {
  orderByKey: string;
  orderByAsc: boolean;
  currentPage: number;
  maxResultsSelection: number;
  pageTokens: Record<number, string | null>;
  loading: boolean;
  error: Error | undefined;
  searchInput: string;
};

export class ModelListPageImpl extends React.Component<ModelListPageImplProps, ModelListPageImplState> {
  constructor(props: ModelListPageImplProps) {
    super(props);
    this.state = {
      orderByKey: REGISTERED_MODELS_SEARCH_NAME_FIELD,
      orderByAsc: true,
      currentPage: 1,
      maxResultsSelection: this.getPersistedMaxResults(),
      pageTokens: {},
      loading: true,
      error: undefined,
      searchInput: constructSearchInputFromURLState(this.getUrlState() as Record<string, string>),
    };
  }
  modelListPageStoreKey = 'ModelListPageStore';
  defaultPersistedPageTokens = { 1: null };
  initialSearchRegisteredModelsApiId = getUUID();
  searchRegisteredModelsApiId = getUUID();
  criticalInitialRequestIds = [this.initialSearchRegisteredModelsApiId];

  getUrlState() {
    return this.props.location ? Utils.getSearchParamsFromUrl(this.props.location.search) : {};
  }

  componentDidMount() {
    const urlState = this.getUrlState();
    const persistedPageTokens = this.getPersistedPageTokens();
    const maxResultsForTokens = this.getPersistedMaxResults();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        // @ts-expect-error TS(4111): Property 'orderByKey' comes from an index signatur... Remove this comment to see the full error message
        orderByKey: urlState.orderByKey === undefined ? this.state.orderByKey : urlState.orderByKey,
        orderByAsc:
          // @ts-expect-error TS(4111): Property 'orderByAsc' comes from an index signatur... Remove this comment to see the full error message
          urlState.orderByAsc === undefined
            ? this.state.orderByAsc
            : // @ts-expect-error TS(4111): Property 'orderByAsc' comes from an index signatur... Remove this comment to see the full error message
              urlState.orderByAsc === 'true',
        currentPage:
          // @ts-expect-error TS(4111): Property 'page' comes from an index signature, so ... Remove this comment to see the full error message
          urlState.page !== undefined && (urlState as any).page in persistedPageTokens
            ? // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
              parseInt(urlState.page, 10)
            : this.state.currentPage,
        maxResultsSelection: maxResultsForTokens,
        pageTokens: persistedPageTokens,
      },
      () => {
        this.loadModels(true);
      },
    );
  }

  getPersistedPageTokens() {
    const store = ModelListPageImpl.getLocalStore(this.modelListPageStoreKey);
    if (store && store.getItem('page_tokens')) {
      return JSON.parse(store.getItem('page_tokens'));
    } else {
      return this.defaultPersistedPageTokens;
    }
  }

  setPersistedPageTokens(page_tokens: any) {
    const store = ModelListPageImpl.getLocalStore(this.modelListPageStoreKey);
    if (store) {
      store.setItem('page_tokens', JSON.stringify(page_tokens));
    }
  }

  getPersistedMaxResults() {
    const store = ModelListPageImpl.getLocalStore(this.modelListPageStoreKey);
    if (store && store.getItem('max_results')) {
      return parseInt(store.getItem('max_results'), 10);
    } else {
      return REGISTERED_MODELS_PER_PAGE_COMPACT;
    }
  }

  setMaxResultsInStore(max_results: any) {
    const store = ModelListPageImpl.getLocalStore(this.modelListPageStoreKey);
    store.setItem('max_results', max_results.toString());
  }

  /**
   * Returns a LocalStorageStore instance that can be used to persist data associated with the
   * ModelRegistry component.
   */
  static getLocalStore(key: any) {
    return LocalStorageUtils.getSessionScopedStoreForComponent('ModelListPage', key);
  }

  // Loads the initial set of models.
  loadModels(isInitialLoading = false) {
    this.loadPage(this.state.currentPage, isInitialLoading);
  }

  resetHistoryState() {
    this.setState((prevState: any) => ({
      currentPage: 1,
      pageTokens: this.defaultPersistedPageTokens,
    }));
    this.setPersistedPageTokens(this.defaultPersistedPageTokens);
  }

  /**
   *
   * @param orderByKey column key to sort by
   * @param orderByAsc is sort by ascending order
   * @returns {string} ex. 'name ASC'
   */
  static getOrderByExpr = (orderByKey: any, orderByAsc: any) =>
    orderByKey ? `${orderByKey} ${orderByAsc ? 'ASC' : 'DESC'}` : '';

  pollIntervalId: any;

  isEmptyPageResponse = (value: any) => {
    return !value || !value.registered_models || !value.next_page_token;
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
        currentPage: page,

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

  handleSearch = (searchInput: any) => {
    this.resetHistoryState();
    this.setState({ searchInput: searchInput }, () => {
      this.loadPage(1, false);
    });
  };

  // Note: this method is no longer used by the UI but is used in tests. Probably best to refactor at some point.
  handleSearchInputChange = (searchInput: any) => {
    this.setState({ searchInput: searchInput });
  };

  updateUrlWithSearchFilter = (searchInput: any, orderByKey: any, orderByAsc: any, page: any) => {
    const urlParams = {};
    if (searchInput) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      urlParams['searchInput'] = searchInput;
    }
    if (orderByKey && orderByKey !== REGISTERED_MODELS_SEARCH_NAME_FIELD) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      urlParams['orderByKey'] = orderByKey;
    }
    if (orderByAsc === false) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      urlParams['orderByAsc'] = orderByAsc;
    }
    if (page && page !== 1) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      urlParams['page'] = page;
    }
    const newUrl = createMLflowRoutePath(`/models?${Utils.getSearchUrlFromState(urlParams)}`);
    if (newUrl !== this.props.location.pathname + this.props.location.search) {
      this.props.navigate(newUrl);
    }
  };

  handleMaxResultsChange = (key: any) => {
    this.setState({ maxResultsSelection: parseInt(key, 10) }, () => {
      this.resetHistoryState();
      const { maxResultsSelection } = this.state;
      this.setMaxResultsInStore(maxResultsSelection);
      this.loadPage(1, false);
    });
  };

  handleClickNext = () => {
    const { currentPage } = this.state;
    this.loadPage(currentPage + 1, false);
  };

  handleClickPrev = () => {
    const { currentPage } = this.state;
    this.loadPage(currentPage - 1, false);
  };

  handleClickSortableColumn = (orderByKey: any, sortOrder: any) => {
    const orderByAsc = sortOrder !== AntdTableSortOrder.DESC; // default to true
    this.setState({ orderByKey, orderByAsc }, () => {
      this.resetHistoryState();
      this.loadPage(1, false);
    });
  };

  getMaxResultsSelection = () => {
    return this.state.maxResultsSelection;
  };

  loadPage(page: any, isInitialLoading: any) {
    const {
      searchInput,
      pageTokens,
      orderByKey,
      orderByAsc,
      // eslint-disable-nextline
    } = this.state;
    this.setState({ loading: true, error: undefined });
    this.updateUrlWithSearchFilter(searchInput, orderByKey, orderByAsc, page);
    this.props
      .searchRegisteredModelsApi(
        getCombinedSearchFilter({
          query: searchInput,
          // eslint-disable-nextline
        }),
        this.state.maxResultsSelection,
        ModelListPageImpl.getOrderByExpr(orderByKey, orderByAsc),
        pageTokens[page],
        isInitialLoading ? this.initialSearchRegisteredModelsApiId : this.searchRegisteredModelsApiId,
      )
      .then((r: any) => {
        this.updatePageState(page, r);
      })
      .catch((e: any) => {
        this.setState({ currentPage: 1, error: e });
        this.resetHistoryState();
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const {
      orderByKey,
      orderByAsc,
      currentPage,
      pageTokens,
      searchInput,
      // eslint-disable-nextline
    } = this.state;
    const { models } = this.props;
    return (
      <ScrollablePageWrapper>
        <ModelListView
          // @ts-expect-error TS(2322): Type '{ models: any[] | undefined; loading: any; e... Remove this comment to see the full error message
          models={models}
          loading={this.state.loading}
          error={this.state.error}
          searchInput={searchInput}
          orderByKey={orderByKey}
          orderByAsc={orderByAsc}
          currentPage={currentPage}
          nextPageToken={pageTokens[currentPage + 1]}
          onSearch={this.handleSearch}
          onClickNext={this.handleClickNext}
          onClickPrev={this.handleClickPrev}
          onClickSortableColumn={this.handleClickSortableColumn}
          onSetMaxResult={this.handleMaxResultsChange}
          maxResultValue={this.getMaxResultsSelection()}
        />
      </ScrollablePageWrapper>
    );
  }
}

const mapStateToProps = (state: any) => {
  const models = Object.values(state.entities.modelByName);
  return {
    models,
  };
};

const mapDispatchToProps = {
  searchRegisteredModelsApi,
};

const ModelListPageWithRouter = withRouterNext(connect(mapStateToProps, mapDispatchToProps)(ModelListPageImpl));

export const ModelListPage = ModelListPageWithRouter;
```

--------------------------------------------------------------------------------

---[FILE: ModelListPageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelListPageWrapper.tsx

```typescript
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';
import { ModelListPage } from './ModelListPage';
const ModelListPageWrapperImpl = () => {
  return <ModelListPage />;
};
export const ModelListPageWrapper = withErrorBoundary(
  ErrorUtils.mlflowServices.MODEL_REGISTRY,
  ModelListPageWrapperImpl,
);

export default ModelListPageWrapper;
```

--------------------------------------------------------------------------------

---[FILE: ModelListView.css]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelListView.css

```text
.mlflow-pagination-section {
  padding-bottom: 30px;
}

.mlflow-ui-container .ant-alert-info .ant-alert-icon {
  color: #00b379;
}

.mlflow-search-input-tooltip .du-bois-light-popover-inner .du-bois-light-popover-inner-content {
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  border-radius: 4px;
}

.mlflow-search-input-tooltip .du-bois-light-popover-arrow-content {
  background-color: rgba(0, 0, 0, 0.75);
}
```

--------------------------------------------------------------------------------

---[FILE: ModelListView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelListView.enzyme.test.tsx
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
import { ModelListView, ModelListViewImpl } from './ModelListView';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import Utils from '../../common/utils/Utils';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

const mockStore = configureStore([thunk, promiseMiddleware()]);

describe('ModelListView', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStore: any;
  let onSearchSpy;
  beforeEach(() => {
    onSearchSpy = jest.fn();
    minimalProps = {
      models: [],
      searchInput: '',
      orderByKey: 'name',
      orderByAsc: true,
      currentPage: 1,
      nextPageToken: null,
      selectedStatusFilter: '',
      selectedOwnerFilter: '',
      onSearch: onSearchSpy,
      onClickNext: jest.fn(),
      onClickPrev: jest.fn(),
      onClickSortableColumn: jest.fn(),
      onSetMaxResult: jest.fn(),
      maxResultValue: 10,
      onStatusFilterChange: jest.fn(),
      onOwnerFilterChange: jest.fn(),
    };
    minimalStore = mockStore({});
  });
  function setupModelListViewWithIntl(propsParam: any) {
    const props = propsParam || minimalProps;
    return mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <ModelListView {...props} />
        </MemoryRouter>
      </Provider>,
    );
  }
  test('should render with minimal props without exploding', () => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    wrapper = setupModelListViewWithIntl();
    expect(wrapper.length).toBe(1);
  });
  test('should not display onBoarding helper if disabled', () => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    wrapper = setupModelListViewWithIntl();
    wrapper.find(ModelListViewImpl).setState({
      showOnboardingHelper: false,
    });
    expect(wrapper.find("[data-testid='showOnboardingHelper']").length).toBe(0);
  });
  test('Page title is set', () => {
    const mockUpdatePageTitle = jest.fn();
    Utils.updatePageTitle = mockUpdatePageTitle;
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    wrapper = setupModelListViewWithIntl();
    expect(mockUpdatePageTitle.mock.calls[0][0]).toBe('MLflow Models');
  });
  // eslint-disable-next-line
});
```

--------------------------------------------------------------------------------

````
