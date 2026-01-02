---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 605
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 605 of 991)

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

---[FILE: RegisterModel.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/RegisterModel.enzyme.test.tsx
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
import { shallowWithInjectIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { RegisterModelWithIntl } from './RegisterModel';
import { getProtoField } from '../utils';
describe('RegisterModelButton', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    minimalProps = {
      disabled: false,
      runUuid: 'runUuid',
      modelPath: 'modelPath',
      // connected props
      modelByName: {},
      createRegisteredModelApi: jest.fn(() => Promise.resolve({})),
      createModelVersionApi: jest.fn(() => Promise.resolve({})),
      searchModelVersionsApi: jest.fn(() => Promise.resolve({})),
      searchRegisteredModelsApi: jest.fn(() => Promise.resolve({})),
    };
    minimalStore = mockStore({
      entities: {
        modelByName: {},
      },
    });
  });

  test('should render with minimal props and store without exploding', () => {
    wrapper = mountWithIntl(<RegisterModelWithIntl {...minimalProps} store={minimalStore} />);
    expect(wrapper.find('button').length).toBe(1);
  });

  test('handleSearchRegisteredModel should invoke api', () => {
    const response = { value: {} };
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    response.value[getProtoField('registered_models')] = [
      {
        name: 'Model A',
      },
    ];

    const searchRegisteredModelsApi = jest.fn(() => Promise.resolve(response));
    const props = {
      ...minimalProps,
      searchRegisteredModelsApi,
    };
    wrapper = shallowWithInjectIntl(<RegisterModelWithIntl {...props} store={minimalStore} />);
    expect(props.searchRegisteredModelsApi.mock.calls.length).toBe(1);
    const instance = wrapper.instance();
    instance.handleSearchRegisteredModels('A');
    expect(props.searchRegisteredModelsApi.mock.calls.length).toBe(2);
  });

  describe('source URI construction', () => {
    test('should use models:/ format for logged models with model_id', async () => {
      const createModelVersionApi = jest.fn((...params: any) => Promise.resolve({}));
      const props = {
        ...minimalProps,
        runUuid: 'test-run-uuid',
        modelPath: 'mlflow-artifacts:/exp/models/m-12345/artifacts',
        modelRelativePath: 'model',
        loggedModelId: 'm-12345-model-id',
        createModelVersionApi,
      };
      wrapper = mountWithIntl(<RegisterModelWithIntl {...props} store={minimalStore} />);
      const instance = wrapper.find('RegisterModelImpl').instance();

      // Mock form validation
      instance.form.current = {
        validateFields: jest.fn(() =>
          Promise.resolve({
            selectedModel: 'existing-model',
          }),
        ),
        resetFields: jest.fn(),
      };

      await instance.handleRegisterModel();

      expect(createModelVersionApi).toHaveBeenCalledWith(
        'existing-model',
        'models:/m-12345-model-id', // Should use models:/ format
        'test-run-uuid',
        [],
        expect.any(String),
        'm-12345-model-id',
      );
    });

    test('should use runs:/ format for regular artifacts with run context', async () => {
      const createModelVersionApi = jest.fn((...params: any) => Promise.resolve({}));
      const props = {
        ...minimalProps,
        runUuid: 'test-run-uuid',
        modelPath: 'file:///path/to/artifacts/my_model',
        modelRelativePath: 'my_model',
        createModelVersionApi,
      };
      wrapper = mountWithIntl(<RegisterModelWithIntl {...props} store={minimalStore} />);
      const instance = wrapper.find('RegisterModelImpl').instance();

      // Mock form validation
      instance.form.current = {
        validateFields: jest.fn(() =>
          Promise.resolve({
            selectedModel: 'existing-model',
          }),
        ),
        resetFields: jest.fn(),
      };

      await instance.handleRegisterModel();

      expect(createModelVersionApi).toHaveBeenCalledWith(
        'existing-model',
        'runs:/test-run-uuid/my_model', // Should use runs:/ format
        'test-run-uuid',
        [],
        expect.any(String),
        undefined,
      );
    });

    test('should fall back to absolute modelPath when no run context', async () => {
      const createModelVersionApi = jest.fn((...params: any) => Promise.resolve({}));
      const props = {
        ...minimalProps,
        modelPath: 'file:///absolute/path/to/model',
        runUuid: undefined,
        modelRelativePath: undefined,
        createModelVersionApi,
      };
      wrapper = mountWithIntl(<RegisterModelWithIntl {...props} store={minimalStore} />);
      const instance = wrapper.find('RegisterModelImpl').instance();

      // Mock form validation
      instance.form.current = {
        validateFields: jest.fn(() =>
          Promise.resolve({
            selectedModel: 'existing-model',
          }),
        ),
        resetFields: jest.fn(),
      };

      await instance.handleRegisterModel();

      expect(createModelVersionApi).toHaveBeenCalledWith(
        'existing-model',
        'file:///absolute/path/to/model', // Should use absolute path as fallback
        undefined,
        [],
        expect.any(String),
        undefined,
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RegisterModel.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/RegisterModel.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { identity, isUndefined, debounce } from 'lodash';
import type { ButtonProps } from '@databricks/design-system';
import { Button, Modal, Spacer, Typography } from '@databricks/design-system';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import {
  CREATE_NEW_MODEL_OPTION_VALUE,
  MODEL_NAME_FIELD,
  RegisterModelForm,
  SELECTED_MODEL_FIELD,
} from './RegisterModelForm';
import {
  createModelVersionApi,
  createRegisteredModelApi,
  searchModelVersionsApi,
  searchRegisteredModelsApi,
} from '../actions';
import { connect } from 'react-redux';
import Utils from '../../common/utils/Utils';
import { getUUID } from '../../common/utils/ActionUtils';
import { getModelNameFilter } from '../utils/SearchUtils';

const MAX_SEARCH_REGISTERED_MODELS = 5;

type RegisterModelImplProps = {
  disabled: boolean;
  runUuid?: string;
  loggedModelId?: string;
  modelPath: string;
  modelRelativePath?: string;
  modelByName: any;
  createRegisteredModelApi: (...args: any[]) => any;
  createModelVersionApi: (...args: any[]) => any;
  searchModelVersionsApi: (...args: any[]) => any;
  searchRegisteredModelsApi: (...args: any[]) => any;
  intl: IntlShape;
  /**
   * Type of button to display ("primary", "link", etc.)
   */
  buttonType?: ButtonProps['type'];
  /**
   * Whether to show the button. If set to true, only modal will be used and button will not be shown.
   */
  showButton?: boolean;
  /**
   * Whether the modal is visible. If set, modal visibility will be controlled by the props.
   */
  modalVisible?: boolean;
  /**
   * Callback to close the modal. If set, modal visibility will be controlled by the parent component.
   */
  onCloseModal?: () => void;
  /**
   * Callback to run after the model is registered.
   */
  onRegisterSuccess?: (data?: { value: { status?: string } }) => void;
  /**
   * Callback to run after the model is registered.
   */
  onRegisterFailure?: (reason?: any) => void;
};

type RegisterModelImplState = any; // used in drop-down list so not many are visible at once

/**
 * Component with a set of controls used to register a logged model.
 * Includes register modal and optional "Register" button.
 */
export class RegisterModelImpl extends React.Component<RegisterModelImplProps, RegisterModelImplState> {
  form: any;

  state = {
    visible: false,
    confirmLoading: false,
    modelByName: {},
  };

  createRegisteredModelRequestId = getUUID();

  createModelVersionRequestId = getUUID();

  searchModelVersionRequestId = getUUID();
  constructor() {
    // @ts-expect-error TS(2554): Expected 1-2 arguments, but got 0.
    super();
    this.form = React.createRef();
  }

  showRegisterModal = () => {
    this.setState({ visible: true });
  };

  hideRegisterModal = () => {
    this.setState({ visible: false });
    this.props.onCloseModal?.();
  };

  resetAndClearModalForm = () => {
    this.setState({ visible: false, confirmLoading: false });
    this.form.current?.resetFields();
    this.props.onCloseModal?.();
  };

  handleRegistrationFailure = (e: any) => {
    this.setState({ confirmLoading: false });
    Utils.logErrorAndNotifyUser(e);
  };

  handleSearchRegisteredModels = (input: any) => {
    if (this.isWorkspaceModelRegistryEnabled) {
      this.props.searchRegisteredModelsApi(getModelNameFilter(input), MAX_SEARCH_REGISTERED_MODELS);
    }
  };

  reloadModelVersionsForCurrentRun = () => {
    const { runUuid } = this.props;
    return this.props.searchModelVersionsApi({ run_id: runUuid }, this.searchModelVersionRequestId);
  };

  handleRegisterModel = () => {
    return this.form.current.validateFields().then((values: any) => {
      this.setState({ confirmLoading: true });
      const { runUuid, modelPath, modelRelativePath, loggedModelId } = this.props;
      // Construct source URI to maintain connection to source run:
      // 1. For logged models (MLflow 3.0+), use models:/{model_id} format
      // 2. For regular artifacts with run context, use runs:/<run_id>/<model_path> format
      // 3. Otherwise, fall back to the absolute artifact URI for backward compatibility
      let sourceUri = modelPath;
      if (loggedModelId) {
        sourceUri = `models:/${loggedModelId}`;
      } else if (modelRelativePath && runUuid) {
        sourceUri = `runs:/${runUuid}/${modelRelativePath}`;
      }
      const selectedModelName = values[SELECTED_MODEL_FIELD];
      if (selectedModelName === CREATE_NEW_MODEL_OPTION_VALUE) {
        // When user choose to create a new registered model during the registration, we need to
        // 1. Create a new registered model
        // 2. Create model version #1 in the new registered model
        return this.props
          .createRegisteredModelApi(values[MODEL_NAME_FIELD], this.createRegisteredModelRequestId)
          .then(() =>
            this.props.createModelVersionApi(
              values[MODEL_NAME_FIELD],
              sourceUri,
              runUuid,
              [],
              this.createModelVersionRequestId,
              this.props.loggedModelId,
            ),
          )
          .then(this.props.onRegisterSuccess ?? identity)
          .then(this.resetAndClearModalForm)
          .catch(this.props.onRegisterFailure ?? this.handleRegistrationFailure)
          .then(this.reloadModelVersionsForCurrentRun)
          .catch(Utils.logErrorAndNotifyUser);
      } else {
        return this.props
          .createModelVersionApi(
            selectedModelName,
            sourceUri,
            runUuid,
            [],
            this.createModelVersionRequestId,
            this.props.loggedModelId,
          )
          .then(this.props.onRegisterSuccess ?? identity)
          .then(this.resetAndClearModalForm)
          .catch(this.props.onRegisterFailure ?? this.handleRegistrationFailure)
          .then(this.reloadModelVersionsForCurrentRun)
          .catch(Utils.logErrorAndNotifyUser);
      }
    });
  };

  get isWorkspaceModelRegistryEnabled() {
    return true;
  }

  componentDidMount() {
    if (this.isWorkspaceModelRegistryEnabled) {
      this.props.searchRegisteredModelsApi();
    }
  }

  componentDidUpdate(prevProps: RegisterModelImplProps, prevState: RegisterModelImplState) {
    // Repopulate registered model list every time user launch the modal
    if (prevState.visible === false && this.state.visible === true && this.isWorkspaceModelRegistryEnabled) {
      this.props.searchRegisteredModelsApi();
    }
  }
  renderRegisterModelForm() {
    const { modelByName } = this.props;
    return (
      <RegisterModelForm
        modelByName={modelByName}
        innerRef={this.form}
        onSearchRegisteredModels={debounce(this.handleSearchRegisteredModels, 300)}
      />
    );
  }

  renderFooter() {
    return [
      <Button
        componentId="codegen_mlflow_app_src_model-registry_components_registermodel.tsx_242"
        key="back"
        onClick={this.hideRegisterModal}
      >
        <FormattedMessage
          defaultMessage="Cancel"
          description="Cancel button text to cancel the flow to register the model"
        />
      </Button>,
      <Button
        componentId="codegen_mlflow_app_src_model-registry_components_registermodel.tsx_248"
        key="submit"
        type="primary"
        onClick={() => this.handleRegisterModel()}
        data-testid="confirm-register-model"
      >
        <FormattedMessage defaultMessage="Register" description="Register button text to register the model" />
      </Button>,
    ];
  }

  renderHelper(disableButton: boolean, form: React.ReactNode, footer: React.ReactNode) {
    const { visible, confirmLoading } = this.state;
    const { showButton = true, buttonType } = this.props;
    return (
      <div className="register-model-btn-wrapper">
        {showButton && (
          <Button
            componentId="codegen_mlflow_app_src_model-registry_components_registermodel.tsx_261"
            className="register-model-btn"
            type={buttonType}
            onClick={this.showRegisterModal}
            disabled={disableButton}
            htmlType="button"
          >
            <FormattedMessage
              defaultMessage="Register model"
              description="Button text to register the model for deployment"
            />
          </Button>
        )}
        <Modal
          title={this.props.intl.formatMessage({
            defaultMessage: 'Register model',
            description: 'Register model modal title to register the model for deployment',
          })}
          // @ts-expect-error TS(2322): Type '{ children: Element; title: any; width: numb... Remove this comment to see the full error message
          width={540}
          visible={this.props.modalVisible || visible}
          onOk={() => this.handleRegisterModel()}
          okText={this.props.intl.formatMessage({
            defaultMessage: 'Register',
            description: 'Confirmation text to register the model',
          })}
          confirmLoading={confirmLoading}
          onCancel={this.hideRegisterModal}
          centered
          footer={footer}
        >
          {form}
        </Modal>
      </div>
    );
  }

  render() {
    const { disabled } = this.props;
    return this.renderHelper(disabled, this.renderRegisterModelForm(), this.renderFooter());
  }
}

const mapStateToProps = (state: any) => {
  return {
    modelByName: state.entities.modelByName,
  };
};

const mapDispatchToProps = {
  createRegisteredModelApi,
  createModelVersionApi,
  searchModelVersionsApi,
  searchRegisteredModelsApi,
};

export const RegisterModelWithIntl = injectIntl(RegisterModelImpl);
export const RegisterModel = connect(mapStateToProps, mapDispatchToProps)(RegisterModelWithIntl);

// ..
```

--------------------------------------------------------------------------------

---[FILE: RegisterModelForm.css]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/RegisterModelForm.css

```text
.mlflow-model-select-dropdown .ant-select-dropdown-menu-item-group-title {
  color: #666;
  font-weight: bold;
}

.mlflow-model-select-dropdown .mlflow-create-new-model-option {
  border-top: 1px solid #ccc;
}

.mlflow-register-model-form .modal-explanatory-text {
  color: rgba(0, 0, 0, 0.52);
  font-size: 13px;
}
```

--------------------------------------------------------------------------------

---[FILE: RegisterModelForm.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/RegisterModelForm.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { RegisterModelForm, CREATE_NEW_MODEL_OPTION_VALUE } from './RegisterModelForm';
import { mockRegisteredModelDetailed } from '../test-utils';

describe('RegisterModelForm', () => {
  let wrapper;
  let instance;
  let minimalProps: any;

  beforeEach(() => {
    minimalProps = {
      modelByName: {},
      onSearchRegisteredModels: jest.fn(),
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<RegisterModelForm {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should list "Create New Model" and existing models in dropdown options', () => {
    const modelByName = {
      'Model A': mockRegisteredModelDetailed('Model A', []),
    };
    const props = {
      ...minimalProps,
      modelByName,
    };
    wrapper = shallow(<RegisterModelForm {...props} />);
    expect(wrapper.find('.mlflow-create-new-model-option').length).toBe(1);
    expect(wrapper.find('[value="Model A"]').length).toBe(1);
  });

  test('should show model name input when user choose "Create New Model"', () => {
    const modelByName = {
      'Model A': mockRegisteredModelDetailed('Model A', []),
    };
    const props = {
      ...minimalProps,
      modelByName,
    };
    wrapper = shallow(<RegisterModelForm {...props} />);
    instance = wrapper.instance();
    instance.setState({ selectedModel: CREATE_NEW_MODEL_OPTION_VALUE });
    expect(wrapper.find('[label="Model Name"]').length).toBe(1);
  });

  test('should search registered model when user types model name', () => {
    const modelByName = {
      'Model A': mockRegisteredModelDetailed('Model A', []),
    };
    const onSearchRegisteredModels = jest.fn(() => Promise.resolve({}));
    const props = {
      ...minimalProps,
      modelByName,
      onSearchRegisteredModels,
    };
    wrapper = mount(<RegisterModelForm {...props} />);
    wrapper.find('input#selectedModel').simulate('change', { target: { value: 'Model B' } });
    expect(onSearchRegisteredModels.mock.calls.length).toBe(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RegisterModelForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/RegisterModelForm.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { LegacyForm, Input, LegacySelect } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

import './RegisterModelForm.css';

const { Option, OptGroup } = LegacySelect;

const CREATE_NEW_MODEL_LABEL = 'Create New Model';
// Include 'CREATE_NEW_MODEL_LABEL' as part of the value for filtering to work properly. Also added
// prefix and postfix to avoid value conflict with actual model names.
export const CREATE_NEW_MODEL_OPTION_VALUE = `$$$__${CREATE_NEW_MODEL_LABEL}__$$$`;
export const SELECTED_MODEL_FIELD = 'selectedModel';
export const MODEL_NAME_FIELD = 'modelName';
const DESCRIPTION_FIELD = 'description';

type Props = {
  modelByName?: any;
  isCopy?: boolean;
  onSearchRegisteredModels: (...args: any[]) => any;
  innerRef: any;
};

type State = any;

export class RegisterModelForm extends React.Component<Props, State> {
  state = {
    selectedModel: null,
  };

  handleModelSelectChange = (selectedModel: any) => {
    this.setState({ selectedModel });
  };

  modelNameValidator = (rule: any, value: any, callback: any) => {
    const { modelByName } = this.props;
    callback(modelByName[value] ? `Model "${value}" already exists.` : undefined);
  };

  handleFilterOption = (input: any, option: any) => {
    const value = (option && option.value) || '';
    return value.toLowerCase().indexOf(input.toLowerCase()) !== -1;
  };

  renderExplanatoryText() {
    const { isCopy } = this.props;
    const { selectedModel } = this.state;
    const creatingNewModel = selectedModel === CREATE_NEW_MODEL_OPTION_VALUE;

    if (!selectedModel || creatingNewModel) {
      return null;
    }

    const explanation = isCopy ? (
      <FormattedMessage
        defaultMessage="The model version will be copied to {selectedModel} as a new version."
        description="Model registry > OSS Promote model modal > copy explanatory text"
        values={{ selectedModel: selectedModel }}
      />
    ) : (
      <FormattedMessage
        defaultMessage="The model will be registered as a new version of {selectedModel}."
        description="Explantory text for registering a model"
        values={{ selectedModel: selectedModel }}
      />
    );

    return <p className="modal-explanatory-text">{explanation}</p>;
  }

  renderModel(model: any) {
    return (
      <Option value={model.name} key={model.name}>
        {model.name}
      </Option>
    );
  }
  render() {
    const { modelByName, innerRef, isCopy } = this.props;
    const { selectedModel } = this.state;
    const creatingNewModel = selectedModel === CREATE_NEW_MODEL_OPTION_VALUE;
    return (
      // @ts-expect-error TS(2322): Type '{ children: (Element | null)[]; ref: any; la... Remove this comment to see the full error message
      <LegacyForm ref={innerRef} layout="vertical" className="mlflow-register-model-form">
        {/* "+ Create new model" OR "Select existing model" */}
        <LegacyForm.Item
          label={isCopy ? <b>Copy to model</b> : 'Model'}
          name={SELECTED_MODEL_FIELD}
          rules={[{ required: true, message: 'Please select a model or create a new one.' }]}
        >
          <LegacySelect
            dropdownClassName="mlflow-model-select-dropdown"
            onChange={this.handleModelSelectChange}
            placeholder="Select a model"
            filterOption={this.handleFilterOption}
            onSearch={this.props.onSearchRegisteredModels}
            // @ts-expect-error TS(2769): No overload matches this call.
            showSearch
          >
            <Option value={CREATE_NEW_MODEL_OPTION_VALUE} className="mlflow-create-new-model-option">
              <i className="fa fa-plus fa-fw" style={{ fontSize: 13 }} /> {CREATE_NEW_MODEL_LABEL}
            </Option>
            <OptGroup label="Models">{Object.values(modelByName).map((model) => this.renderModel(model))}</OptGroup>
          </LegacySelect>
        </LegacyForm.Item>

        {/* Name the new model when "+ Create new model" is selected */}
        {creatingNewModel ? (
          <LegacyForm.Item
            label="Model Name"
            name={MODEL_NAME_FIELD}
            rules={[
              { required: true, message: 'Please input a name for the new model.' },
              { validator: this.modelNameValidator },
            ]}
          >
            <Input
              componentId="codegen_mlflow_app_src_model-registry_components_registermodelform.tsx_132"
              placeholder="Input a model name"
            />
          </LegacyForm.Item>
        ) : null}

        {/* Explanatory text shown when existing model is selected */}
        {this.renderExplanatoryText()}
      </LegacyForm>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: SchemaTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/SchemaTable.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import userEvent from '@testing-library/user-event';

import { SchemaTable } from './SchemaTable';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { getByPlaceholderText, renderWithIntl, within } from '../../common/utils/TestUtils.react18';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000); // Higher timeout due to testing heavier table

async function clickHeaderRow(container: HTMLElement, name: string | RegExp): Promise<void> {
  const row = within(container).getByRole('row', { name });
  if (!row) {
    throw new Error("Couldn't find the row to click");
  }
  await userEvent.click(row);
}

describe('SchemaTable', () => {
  let minimalProps: any;
  let props: any;

  beforeEach(() => {
    minimalProps = {
      schema: {
        inputs: [],
        outputs: [],
      },
    };
    props = {
      schema: {
        inputs: [
          { name: 'column1', type: 'string' },
          { name: 'column2', type: 'string' },
        ],
        outputs: [
          { name: 'score1', type: 'long' },
          { name: 'score2', type: 'long' },
        ],
      },
    };
  });

  test('should render with minimal props without exploding', () => {
    const { container } = renderWithIntl(<SchemaTable {...minimalProps} />);
    expect(container).not.toBeNull();
  });

  test('should nested table not be rendered by default', () => {
    const { container } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    expect(container.innerHTML).toContain('Inputs');
    expect(container.innerHTML).toContain('Outputs');
    expect(container.innerHTML).toContain('Name');
    expect(container.innerHTML).toContain('Type');
    expect(container.innerHTML).not.toContain('column1');
    expect(container.innerHTML).not.toContain('string');
    expect(container.innerHTML).not.toContain('score1');
    expect(container.innerHTML).not.toContain('long');
  });

  test('should inputs table render by click', async () => {
    const { container, getByRole } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );

    expect(getByRole('table')).toBeInTheDocument();
    // click to render inputs table
    await clickHeaderRow(container, /Inputs/);

    expect(container.innerHTML).toContain('Inputs');
    expect(container.innerHTML).toContain('Outputs');
    expect(container.innerHTML).toContain('Name');
    expect(container.innerHTML).toContain('Type');
    expect(container.innerHTML).toContain('column1');
    expect(container.innerHTML).toContain('string');
    expect(container.innerHTML).not.toContain('score1');
    expect(container.innerHTML).not.toContain('long');
  });

  test('Should display optional input field schema as expected', async () => {
    props = {
      schema: {
        // column1 is required but column2 is optional
        inputs: [
          { name: 'column1', type: 'string' },
          { name: 'column2', type: 'float', optional: true },
        ],
        outputs: [{ name: 'score1', type: 'long' }],
      },
    };
    const wrapper = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    // click to render input schema table
    await clickHeaderRow(wrapper.container, /Inputs/);
    expect(wrapper.container.innerHTML).toContain('column1');
    // the optional input param should have (optional) after the name"
    const col2 = wrapper.getByText('column2');
    expect(col2.textContent).toEqual('column2 (optional)');
    expect(wrapper.container.innerHTML).toContain('string');
    expect(wrapper.container.innerHTML).toContain('float');
  });

  test('Should display required input field schema as expected', async () => {
    props = {
      schema: {
        // column1 is required but column2 is optional
        inputs: [{ name: 'column', type: 'string', required: true }],
        outputs: [{ name: 'score', type: 'long', required: true }],
      },
    };
    const wrapper = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    // click to render input schema table
    await clickHeaderRow(wrapper.container, /Inputs/);
    expect(wrapper.container.innerHTML).toContain('column');
    // the optional input param should have (optional) after the name"
    const col2 = wrapper.getByText('column');
    expect(col2.textContent).toEqual('column (required)');
  });

  test('Should display optional output field schema as expected', async () => {
    props = {
      schema: {
        inputs: [{ name: 'column1', type: 'string' }],
        // output contains an optional parameter
        outputs: [{ name: 'score1', type: 'long', optional: true }],
      },
    };
    const wrapper = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    // click to render output schema table
    await clickHeaderRow(wrapper.container, /Outputs/);
    // the optional output name should have (optional) after the name
    const score1 = wrapper.getByText('score1');
    expect(score1.textContent).toEqual('score1 (optional)');
  });

  test('should outputs table render by click', async () => {
    const { container, getByRole } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    // click to render outputs table
    expect(getByRole('table')).toBeInTheDocument();
    await clickHeaderRow(container, /Outputs/);

    expect(container.innerHTML).toContain('Inputs');
    expect(container.innerHTML).toContain('Outputs');
    expect(container.innerHTML).toContain('Name');
    expect(container.innerHTML).toContain('Type');
    expect(container.innerHTML).not.toContain('column1');
    expect(container.innerHTML).not.toContain('string');
    expect(container.innerHTML).toContain('score1');
    expect(container.innerHTML).toContain('long');
  });

  test('should inputs and outputs table render by click', async () => {
    const { container, getByRole } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    expect(getByRole('table')).toBeInTheDocument();
    // click to render inputs and outputs table
    await clickHeaderRow(container, /Inputs/);
    await clickHeaderRow(container, /Outputs/);
    expect(container.innerHTML).toContain('Inputs');
    expect(container.innerHTML).toContain('Outputs');
    expect(container.innerHTML).toContain('Name');
    expect(container.innerHTML).toContain('Type');
    expect(container.innerHTML).toContain('column1');
    expect(container.innerHTML).toContain('string');
    expect(container.innerHTML).toContain('score1');
    expect(container.innerHTML).toContain('long');
  });

  test('Should display tensorSpec as expected', async () => {
    props = {
      schema: {
        inputs: [
          {
            name: 'TensorInput',
            type: 'tensor',
            'tensor-spec': { dtype: 'float64', shape: [-1, 28, 28] },
          },
        ],
        outputs: [
          {
            name: 'TensorOutput',
            type: 'tensor',
            'tensor-spec': { dtype: 'float64', shape: [-1] },
          },
        ],
      },
    };
    const { container, getByRole } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );
    expect(getByRole('table')).toBeInTheDocument();
    await clickHeaderRow(container, /Inputs/);
    await clickHeaderRow(container, /Outputs/);
    expect(container.innerHTML).toContain('Inputs');
    expect(container.innerHTML).toContain('Outputs');
    expect(container.innerHTML).toContain('Name');
    expect(container.innerHTML).toContain('Type');
    expect(container.innerHTML).toContain('TensorInput');
    expect(container.innerHTML).toContain('Tensor (dtype: float64, shape: [-1,28,28])');
    expect(container.innerHTML).toContain('TensorOutput');
    expect(container.innerHTML).toContain('Tensor (dtype: float64, shape: [-1])');
  });

  test('should render object/array column types correctly', async () => {
    props = {
      schema: {
        // column1 is required but column2 is optional
        inputs: [
          {
            name: 'objectCol',
            type: 'object',
            properties: {
              prop1: { type: 'string', required: true },
            },
            required: true,
          },
          {
            name: 'arrayCol',
            type: 'array',
            items: { type: 'binary', required: true },
            required: true,
          },
        ],
        outputs: [{ name: 'score1', type: 'long', required: true }],
      },
    };

    const { container, getByRole } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable {...props} />
      </MemoryRouter>,
    );

    expect(getByRole('table')).toBeInTheDocument();
    await clickHeaderRow(container, /Inputs/);

    const signatures = container.getElementsByTagName('pre');
    expect(signatures).toHaveLength(2);
    expect(signatures[0].textContent).toEqual('{\n  prop1: string\n}');
    expect(signatures[1].textContent).toEqual('Array(binary)');
  });

  test('should handle large schemas (>100 columns)', async () => {
    const { container, getByRole, getByText, getByPlaceholderText } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable
          schema={{
            ...props.schema,
            // Render schema with 500 input columns
            inputs: new Array(500)
              .fill({ name: 'column1', type: 'string' })
              .map((item, index) => ({ ...item, name: `column${index}` })),
          }}
        />
      </MemoryRouter>,
    );
    expect(getByRole('table')).toBeInTheDocument();
    await clickHeaderRow(container, /Inputs/);

    expect(
      getByText(
        'Schema is too large to display all rows. Please search for a column name to filter the results. Currently showing 100 results from 500 total rows.',
      ),
    ).toBeInTheDocument();

    await userEvent.click(getByPlaceholderText('Search for a field'));
    await userEvent.paste('column499');

    expect(
      getByText(
        'Schema is too large to display all rows. Please search for a column name to filter the results. Currently showing 1 results from 500 total rows.',
      ),
    ).toBeInTheDocument();
  });

  test('should handle non-string column names', async () => {
    // Create a large schema with > 100 fields to trigger the search functionality
    type Column =
      | { name: string; type: 'string' }
      | { name: number; type: 'integer' | 'float' }
      | { name: boolean; type: 'boolean' };

    const manyInputs: Column[] = Array.from(
      { length: 101 },
      (_, i): Column => ({
        name: `regular_column_${i}`,
        type: 'string',
      }),
    );

    // Add non-string column names
    manyInputs.push(
      { name: 123, type: 'integer' },
      { name: true, type: 'boolean' },
      { name: 0, type: 'integer' },
      { name: 3.14, type: 'float' },
    );

    const { container, getByRole, getByPlaceholderText } = renderWithIntl(
      <MemoryRouter>
        <SchemaTable
          schema={{
            ...props.schema,
            inputs: manyInputs,
          }}
        />
      </MemoryRouter>,
    );
    expect(getByRole('table')).toBeInTheDocument();
    await clickHeaderRow(container, /Inputs/);

    // Verify that search field appears (since we have > 100 columns)
    const searchField = getByPlaceholderText('Search for a field');
    expect(searchField).toBeInTheDocument();

    // Search for the numeric column name
    await userEvent.click(searchField);
    await userEvent.paste('123');

    // The numeric column should be found and displayed
    expect(container.innerHTML).toContain('123');
    expect(container.innerHTML).toContain('integer');

    // Clear search and try a boolean column name
    await userEvent.clear(searchField);
    await userEvent.paste('true');

    // The boolean column should be found and displayed
    expect(container.innerHTML).toContain('true');
    expect(container.innerHTML).toContain('boolean');

    // Clear search and try a float column name
    await userEvent.clear(searchField);
    await userEvent.paste('3.14');

    // The float column should be found and displayed
    expect(container.innerHTML).toContain('3.14');
    expect(container.innerHTML).toContain('float');
  });
});
```

--------------------------------------------------------------------------------

````
