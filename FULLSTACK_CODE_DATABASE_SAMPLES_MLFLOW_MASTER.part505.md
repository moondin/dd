---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 505
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 505 of 991)

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

---[FILE: RenameExperimentModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RenameExperimentModal.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { RenameExperimentModal } from './RenameExperimentModal';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import { IntlProvider } from 'react-intl';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import userEvent from '@testing-library/user-event';
import { MlflowService } from '../../sdk/MlflowService';
import { getExperimentApi, updateExperimentApi } from '../../actions';
import Utils from '../../../common/utils/Utils';

jest.mock('../../actions', () => ({
  getExperimentApi: jest.fn(() => ({ type: 'action', meta: {}, payload: Promise.resolve({}) })),
  updateExperimentApi: jest.fn(() => ({ type: 'action', meta: {}, payload: Promise.resolve({}) })),
}));

describe('RenameExperimentModal', () => {
  let wrapper: any;
  let minimalProps: any;
  let mockUpdateExperimentApi: any;
  let mockGetExperimentApi: any;

  beforeEach(() => {
    jest.mocked(updateExperimentApi).mockClear();
    jest.mocked(getExperimentApi).mockClear();
    jest.spyOn(MlflowService, 'getExperimentByName').mockImplementation(() => Promise.reject({} as any));
    jest.spyOn(Utils, 'logErrorAndNotifyUser');
    jest.clearAllMocks();
  });

  const renderTestComponent = () => {
    minimalProps = {
      isOpen: true,
      experimentId: '123',
      experimentName: 'testName',
      experimentNames: ['arrayName1', 'arrayName2'],
      onClose: jest.fn(() => Promise.resolve({})),
      updateExperimentApi: mockUpdateExperimentApi,
      getExperimentApi: mockGetExperimentApi,
    };

    render(<RenameExperimentModal {...minimalProps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <MockedReduxStoreProvider
            state={{
              entities: { experimentsById: {} },
            }}
          >
            {children}
          </MockedReduxStoreProvider>
        </IntlProvider>
      ),
    });
  };

  test('should render with minimal props without exploding', async () => {
    renderTestComponent();
    expect(screen.getByText('Rename Experiment')).toBeInTheDocument();
  });

  test('form submission should result in updateExperimentApi and getExperimentApi calls', async () => {
    renderTestComponent();
    await userEvent.clear(screen.getByLabelText('New experiment name'));
    await userEvent.type(screen.getByLabelText('New experiment name'), 'renamed');
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateExperimentApi).toHaveBeenCalledTimes(1);
      expect(updateExperimentApi).toHaveBeenCalledWith('123', 'renamed');
      expect(getExperimentApi).toHaveBeenCalledTimes(1);
    });
  });

  test('if updateExperimentApi fails, error is reported', async () => {
    const error = new Error('123');
    jest
      .mocked(updateExperimentApi)
      .mockImplementation(() => ({ type: 'action', meta: {}, payload: Promise.reject(error) } as any));

    renderTestComponent();
    await userEvent.clear(screen.getByLabelText('New experiment name'));
    await userEvent.type(screen.getByLabelText('New experiment name'), 'renamed');
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(Utils.logErrorAndNotifyUser).toHaveBeenLastCalledWith(error);
    });
  });

  test('if getExperimentApi fails, error is reported', async () => {
    const error = new Error('123');
    jest
      .mocked(getExperimentApi)
      .mockImplementation(() => ({ type: 'action', meta: {}, payload: Promise.reject(error) } as any));

    renderTestComponent();
    await userEvent.clear(screen.getByLabelText('New experiment name'));
    await userEvent.type(screen.getByLabelText('New experiment name'), 'renamed');
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(Utils.logErrorAndNotifyUser).toHaveBeenLastCalledWith(error);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RenameExperimentModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RenameExperimentModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { GenericInputModal } from './GenericInputModal';
import { RenameForm, NEW_NAME_FIELD } from './RenameForm';
import { getExperimentNameValidator } from '../../../common/forms/validations';

import { updateExperimentApi, getExperimentApi } from '../../actions';
import { getExperiments } from '../../reducers/Reducers';
import Utils from '../../../common/utils/Utils';

type RenameExperimentModalImplProps = {
  isOpen?: boolean;
  experimentId?: string;
  experimentName?: string;
  experimentNames: string[];
  onClose: (...args: any[]) => any;
  updateExperimentApi: (...args: any[]) => any;
  getExperimentApi: (...args: any[]) => any;
  onExperimentRenamed: () => void;
};

class RenameExperimentModalImpl extends Component<RenameExperimentModalImplProps> {
  handleRenameExperiment = (values: any) => {
    // get value of input field
    const newExperimentName = values[NEW_NAME_FIELD];
    const updateExperimentPromise = this.props
      .updateExperimentApi(this.props.experimentId, newExperimentName)
      .then(() => {
        this.props.getExperimentApi(this.props.experimentId);
        this.props.onExperimentRenamed();
      })
      .catch((e: any) => Utils.logErrorAndNotifyUser(e));

    return updateExperimentPromise;
  };

  debouncedExperimentNameValidator = debounce(
    getExperimentNameValidator(() => this.props.experimentNames),
    400,
  );

  render() {
    const { isOpen, experimentName } = this.props;
    return (
      <GenericInputModal
        title="Rename Experiment"
        okText="Save"
        isOpen={isOpen}
        handleSubmit={this.handleRenameExperiment}
        onClose={this.props.onClose}
      >
        {/* @ts-expect-error TS(2769): No overload matches this call. */}
        <RenameForm
          type="experiment"
          name={experimentName}
          visible={isOpen}
          validator={this.debouncedExperimentNameValidator}
        />
      </GenericInputModal>
    );
  }
}

const mapStateToProps = (state: any) => {
  const experiments = getExperiments(state);
  const experimentNames = experiments.map((e) => e.name);
  return { experimentNames };
};

const mapDispatchToProps = {
  updateExperimentApi,
  getExperimentApi,
};

export const RenameExperimentModal = connect(mapStateToProps, mapDispatchToProps)(RenameExperimentModalImpl);
```

--------------------------------------------------------------------------------

---[FILE: RenameForm.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RenameForm.test.tsx
Signals: React

```typescript
import { describe, jest, it, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { RenameForm } from './RenameForm';
import { identity } from 'lodash';

describe('Render test', () => {
  const minimalProps = {
    type: 'run',
    name: 'Test',
    visible: true,
    // eslint-disable-next-line no-unused-vars
    form: { getFieldDecorator: jest.fn(() => identity) },
    innerRef: {},
  };

  it('should render with minimal props without exploding', () => {
    renderWithIntl(<RenameForm {...minimalProps} />);
    expect(screen.getByTestId('rename-modal-input')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RenameForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RenameForm.tsx
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

export const NEW_NAME_FIELD = 'newName';

type Props = {
  type: string;
  name: string;
  visible: boolean;
  validator?: (...args: any[]) => any;
  innerRef: any;
};

/**
 * Component that renders a form for updating a run's or experiment's name.
 */
class RenameFormComponent extends Component<Props> {
  inputToAutoFocus: any;

  componentDidUpdate(prevProps: Props) {
    this.autoFocus(prevProps);
    this.resetFields(prevProps);
  }

  autoFocusInputRef = (inputToAutoFocus: any) => {
    this.inputToAutoFocus = inputToAutoFocus;
    inputToAutoFocus && inputToAutoFocus.focus();
    inputToAutoFocus && inputToAutoFocus.select();
  };

  autoFocus = (prevProps: any) => {
    if (prevProps.visible === false && this.props.visible === true) {
      // focus on input field
      this.inputToAutoFocus && this.inputToAutoFocus.focus();
      // select text
      this.inputToAutoFocus && this.inputToAutoFocus.select();
    }
  };

  resetFields = (prevProps: any) => {
    const formRef = this.props.innerRef;
    if (prevProps.name !== this.props.name) {
      // reset input field to reset displayed initialValue
      formRef.current.resetFields([NEW_NAME_FIELD]);
    }
  };

  render() {
    return (
      // @ts-expect-error TS(2322): Type '{ children: Element; ref: any; layout: "vert... Remove this comment to see the full error message
      <LegacyForm ref={this.props.innerRef} layout="vertical">
        <LegacyForm.Item
          name={NEW_NAME_FIELD}
          initialValue={this.props.name}
          rules={[
            { required: true, message: `Please input a new name for the ${this.props.type}.` },
            { validator: this.props.validator },
          ]}
          label={`New ${this.props.type} name`}
        >
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_modals_renameform.tsx_69"
            placeholder={`Input a ${this.props.type} name`}
            ref={this.autoFocusInputRef}
            data-testid="rename-modal-input"
          />
        </LegacyForm.Item>
      </LegacyForm>
    );
  }
}

export const RenameForm = RenameFormComponent;
```

--------------------------------------------------------------------------------

---[FILE: RenameRunModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RenameRunModal.enzyme.test.tsx
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
import { shallowWithInjectIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { RenameRunModalWithIntl } from './RenameRunModal';
import { GenericInputModal } from './GenericInputModal';

describe('RenameRunModal', () => {
  let wrapper: any;
  let minimalProps: any;
  let mockUpdateRunApi: any;

  beforeEach(() => {
    mockUpdateRunApi = jest.fn(() => Promise.resolve({}));
    minimalProps = {
      isOpen: false,
      runUuid: 'testUuid',
      runName: 'testName',
      onClose: jest.fn(() => Promise.resolve({})),
      updateRunApi: mockUpdateRunApi,
    };

    wrapper = shallowWithInjectIntl(<RenameRunModalWithIntl {...minimalProps} />);
  });

  test('should render with minimal props without exploding', () => {
    expect(wrapper.length).toBe(1);
    expect(wrapper.find(GenericInputModal).length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('handleRenameRun closes modal in both success & failure cases', (done) => {
    const values = { newName: 'renamed' };
    const promise = wrapper.find(GenericInputModal).prop('handleSubmit')(values);
    promise.finally(() => {
      expect(mockUpdateRunApi).toHaveBeenCalledTimes(1);
      expect(mockUpdateRunApi).toHaveBeenCalledWith('testUuid', 'renamed', expect.any(String));
      done();
    });

    const mockFailUpdateRunApi = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          window.setTimeout(() => {
            reject();
          }, 100);
        }),
    );
    const failProps = { ...minimalProps, updateRunApi: mockFailUpdateRunApi };
    const failWrapper = shallowWithInjectIntl(<RenameRunModalWithIntl {...failProps} />);
    const failPromise = failWrapper.find(GenericInputModal).prop('handleSubmit')(values);
    failPromise.finally(() => {
      expect(mockFailUpdateRunApi).toHaveBeenCalledTimes(1);
      // @ts-expect-error Expected 0 arguments, but got 3
      expect(mockFailUpdateRunApi).toHaveBeenCalledWith('testUuid', 'renamed', expect.any(String));
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RenameRunModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RenameRunModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';

import { GenericInputModal } from './GenericInputModal';
import { RenameForm, NEW_NAME_FIELD } from './RenameForm';

import { updateRunApi } from '../../actions';
import { getUUID } from '../../../common/utils/ActionUtils';

type Props = {
  isOpen?: boolean;
  runUuid: string;
  runName: string;
  onClose: () => void;
  updateRunApi: (runId: string, newName: string, id: string) => any;
  intl: IntlShape;
  onSuccess?: () => void;
};

class RenameRunModalImpl extends Component<Props> {
  formRef = React.createRef();

  handleRenameRun = (values: Record<string, string>) => {
    // get value of input field
    const newRunName = values[NEW_NAME_FIELD];

    const updateRunRequestId = getUUID();

    return this.props
      .updateRunApi(this.props.runUuid, newRunName, updateRunRequestId)
      .then(() => this.props.onSuccess?.());
  };

  render() {
    const { isOpen = false, runName } = this.props;
    return (
      <GenericInputModal
        title={this.props.intl.formatMessage({
          defaultMessage: 'Rename Run',
          description: 'Modal title to rename the experiment run name',
        })}
        okText={this.props.intl.formatMessage({
          defaultMessage: 'Save',
          description: 'Modal button text to save the changes to rename the experiment run name',
        })}
        isOpen={isOpen}
        handleSubmit={this.handleRenameRun}
        onClose={this.props.onClose}
      >
        <RenameForm
          type="run"
          name={runName}
          innerRef={this.formRef}
          visible={isOpen}
          validator={async (_, value) => {
            if (typeof value === 'string' && value.length && !value.trim()) {
              throw new Error(
                this.props.intl.formatMessage({
                  defaultMessage: 'Run name cannot consist only of whitespace!',
                  description: "An error shown when user sets the run's name to whitespace characters only",
                }),
              );
            }
            return true;
          }}
        />
      </GenericInputModal>
    );
  }
}

const mapDispatchToProps = {
  updateRunApi,
};

export const RenameRunModalWithIntl = injectIntl(RenameRunModalImpl);
export const RenameRunModal = connect(undefined, mapDispatchToProps)(RenameRunModalWithIntl);
```

--------------------------------------------------------------------------------

---[FILE: RestoreRunModal.d.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RestoreRunModal.d.ts

```typescript
const RestoreRunModal: React.FC<
  React.PropsWithChildren<{
    isOpen?: boolean;
    onClose?: () => void;
    selectedRunIds?: string[];
  }>
>;

export default RestoreRunModal;
```

--------------------------------------------------------------------------------

---[FILE: RestoreRunModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RestoreRunModal.enzyme.test.tsx
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
import { shallow } from 'enzyme';
import { RestoreRunModalImpl } from './RestoreRunModal';
import { ConfirmModal } from './ConfirmModal';

describe('RestoreRunModal', () => {
  let wrapper: any;
  let minimalProps: any;
  let mockOpenErrorModal: any;
  let mockRestoreRunApi: any;

  beforeEach(() => {
    mockOpenErrorModal = jest.fn(() => Promise.resolve({}));
    mockRestoreRunApi = jest.fn(() => Promise.resolve({}));
    minimalProps = {
      isOpen: false,
      onClose: jest.fn(() => Promise.resolve({})),
      selectedRunIds: ['run1', 'run2'],
      openErrorModal: mockOpenErrorModal,
      restoreRunApi: mockRestoreRunApi,
    };

    wrapper = shallow(<RestoreRunModalImpl {...minimalProps} />);
  });

  test('should render with minimal props without exploding', () => {
    expect(wrapper.length).toBe(1);
    expect(wrapper.find(ConfirmModal).length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('handleRenameExperiment', (done) => {
    const promise = wrapper.find(ConfirmModal).prop('handleSubmit')();
    promise.finally(() => {
      expect(mockRestoreRunApi).toHaveBeenCalledTimes(2);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('handleRenameExperiment errors correctly', (done) => {
    const mockFailRestoreRunApi = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          window.setTimeout(() => {
            reject(
              new Error('Limit exceeded', {
                // @ts-expect-error TS(2554): Object literal may only specify known properties, and 'textJson' does not exist in type 'ErrorOptions'.
                textJson: { error_code: 'RESOURCE_LIMIT_EXCEEDED', message: 'Limit exceeded' },
              }),
            );
          }, 1000);
        }),
    );
    const failRunApiProps = { ...minimalProps, restoreRunApi: mockFailRestoreRunApi };
    wrapper = shallow(<RestoreRunModalImpl {...failRunApiProps} />);

    const promise = wrapper.find(ConfirmModal).prop('handleSubmit')();
    promise.finally(() => {
      expect(mockFailRestoreRunApi).toHaveBeenCalledTimes(2);
      expect(mockOpenErrorModal).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RestoreRunModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/RestoreRunModal.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { connect } from 'react-redux';
import { openErrorModal, restoreRunApi } from '../../actions';
import Utils from '../../../common/utils/Utils';

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  selectedRunIds: string[];
  openErrorModal: (...args: any[]) => any;
  restoreRunApi: (...args: any[]) => any;
  onSuccess?: () => void;
};

export class RestoreRunModalImpl extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const restorePromises: any = [];
    this.props.selectedRunIds.forEach((runId) => {
      restorePromises.push(this.props.restoreRunApi(runId));
    });
    return Promise.all(restorePromises)
      .catch((e) => {
        let errorMessage = 'While restoring an experiment run, an error occurred.';
        if (e.textJson && e.textJson.error_code === 'RESOURCE_LIMIT_EXCEEDED') {
          errorMessage = errorMessage + ' ' + e.textJson.message;
        }
        this.props.openErrorModal(errorMessage);
      })
      .then(() => {
        this.props.onSuccess?.();
      });
  }

  render() {
    const number = this.props.selectedRunIds.length;
    return (
      <ConfirmModal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        handleSubmit={this.handleSubmit}
        title={`Restore Experiment ${Utils.pluralize('Run', number)}`}
        helpText={`${number} experiment ${Utils.pluralize('run', number)} will be restored.`}
        confirmButtonText="Restore"
      />
    );
  }
}

const mapDispatchToProps = {
  restoreRunApi,
  openErrorModal,
};

export default connect(null, mapDispatchToProps)(RestoreRunModalImpl);
```

--------------------------------------------------------------------------------

---[FILE: PromptEngineering.utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/prompt-engineering/PromptEngineering.utils.test.ts

```typescript
import { describe, test, expect, it } from '@jest/globals';
import {
  canEvaluateOnRun,
  compilePromptInputText,
  extractEvaluationPrerequisitesForRun,
  extractPromptInputVariables,
  getPromptInputVariableNameViolations,
} from './PromptEngineering.utils';

describe('PromptEngineering utils', () => {
  describe('extractPromptInputVariables', () => {
    test('correctly extracts multiple variable names', () => {
      const variables = extractPromptInputVariables('this {{a}} is a {{b}} test but {{a}} is duplicated');
      expect(variables).toEqual(['a', 'b']);
    });
    test('correctly handles spaces in the variable name', () => {
      const variables = extractPromptInputVariables('this {{a  }} is a {{   b}} test but {{ cc }}');
      expect(variables).toEqual(['a', 'b', 'cc']);
    });
    test('correctly handles malformed templates with not matching brackets', () => {
      expect(extractPromptInputVariables('this {{a} asdafsdf')).toEqual([]);
      expect(extractPromptInputVariables('this {a}} asdafsdf')).toEqual([]);
    });
    test('correctly handles malformed templates with spaces inside', () => {
      expect(extractPromptInputVariables('this {{a ww}} asdafsdf')).toEqual([]);
    });
    test('correctly handles letter case', () => {
      expect(extractPromptInputVariables('this {{ONE}} parameter and another {{One}} parameter')).toEqual(['one']);
    });
  });

  describe('extractEvaluationPrerequisitesForRun', () => {
    test('correctly extracts existing values', () => {
      const evaluationPrerequisites = extractEvaluationPrerequisitesForRun({
        runUuid: 'test-run',
        params: [
          { key: 'model_route', value: 'test-model-route' },
          { key: 'prompt_template', value: 'test-prompt-template' },
          { key: 'max_tokens', value: '1000' },
          { key: 'temperature', value: '0.5' },
          { key: 'stop', value: '[END]' },
        ],
      } as any);
      expect(evaluationPrerequisites).toEqual({
        parameters: {
          max_tokens: 1000,
          temperature: 0.5,
          stop: ['END'],
        },
        promptTemplate: 'test-prompt-template',
        routeName: 'test-model-route',
      });
    });
    test('correctly extracts existing with empty stop sequence', () => {
      const evaluationPrerequisites = extractEvaluationPrerequisitesForRun({
        runUuid: 'test-run',
        params: [{ key: 'stop', value: '[]' }],
      } as any);
      expect(evaluationPrerequisites).toEqual({
        parameters: {
          stop: [],
        },
      });
    });
    test('correctly handles missing and invalid values', () => {
      const evaluationPrerequisites = extractEvaluationPrerequisitesForRun({
        runUuid: 'test-run',
        params: [
          { key: 'max_tokens', value: 'some-invalid-value' },
          { key: 'temperature', value: 'some-invalid-value' },
        ],
      } as any);
      expect(evaluationPrerequisites).toEqual({
        parameters: {
          max_tokens: undefined,
          temperature: undefined,
          stop: undefined,
        },
        promptTemplate: undefined,
        routeName: undefined,
      });
    });
  });
  describe('canEvaluateOnRun', () => {
    const promptRun: any = {
      tags: {
        'mlflow.runSourceType': { key: 'mlflow.runSourceType', value: 'PROMPT_ENGINEERING' },
      },
    };
    const genericRun: any = {
      tags: {
        'mlflow.runSourceType': { key: 'mlflow.runSourceType', value: 'some-other-run-source' },
      },
    };
    it('correctly determines evaluateable runs', () => {
      expect(canEvaluateOnRun(promptRun)).toBeTruthy();
      expect(canEvaluateOnRun(genericRun)).toBeFalsy();
    });
  });
  describe('compilePromptInputText', () => {
    test('correctly compiles the input text', () => {
      expect(
        compilePromptInputText('my name is {{ name }} {{ surname }}', {
          name: 'John',
          surname: 'Johnson',
        }),
      ).toEqual('my name is John Johnson');
    });

    test('correctly handles the casing', () => {
      expect(
        compilePromptInputText('my name is {{ nAmE }}', {
          NaMe: 'John',
        }),
      ).toEqual('my name is John');
    });

    test('correctly handles loosely formatted brackets', () => {
      expect(
        compilePromptInputText('my name is {{   name     }} and surname is {{    surname}}', {
          name: 'John',
          surname: 'Johnson',
        }),
      ).toEqual('my name is John and surname is Johnson');
    });

    test('correctly handles fields with no values', () => {
      expect(
        compilePromptInputText('the value is {{ value }} and not provided value is {{ not_provided }}', {
          value: 'TestValue',
        }),
      ).toEqual('the value is TestValue and not provided value is {{ not_provided }}');
    });
  });
  describe('getPromptInputVariableNameViolations', () => {
    it('should return nothing on valid template', () => {
      expect(getPromptInputVariableNameViolations('this is {{var_a}} and {{var_b}}')).toEqual({
        namesWithSpaces: [],
      });
    });
    it('should report invalid names with spaces inside', () => {
      expect(
        getPromptInputVariableNameViolations(
          'this is {{invalid var a}} and {{valid_var_b}} and {{    invalid-var c  }} and {{ valid-var-d }} and {{    invalid-var named_e  }}',
        ),
      ).toEqual({
        namesWithSpaces: ['invalid var a', 'invalid-var c', 'invalid-var named_e'],
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PromptEngineering.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/prompt-engineering/PromptEngineering.utils.ts

```typescript
import { MLFLOW_RUN_SOURCE_TYPE_TAG, MLflowRunSourceType } from '../../constants';
import type { ModelGatewayRouteType } from '../../sdk/ModelGatewayService';
import type { RunRowType } from '../experiment-page/utils/experimentPage.row-types';
import {
  extractRunRowParam,
  extractRunRowParamFloat,
  extractRunRowParamInteger,
} from '../experiment-page/utils/experimentPage.row-utils';

export const DEFAULT_PROMPTLAB_NEW_TEMPLATE_VALUE =
  'I have an online store selling {{ stock_type }}. Write a one-sentence advertisement for use in social media.';
export const DEFAULT_PROMPTLAB_INPUT_VALUES = { stock_type: 'books' };

export const DEFAULT_PROMPTLAB_OUTPUT_COLUMN = 'output';
export const DEFAULT_PROMPTLAB_PROMPT_COLUMN = 'prompt';
export const PROMPTLAB_METADATA_COLUMN_LATENCY = 'MLFLOW_latency';
export const PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS = 'MLFLOW_total_tokens';

const PARAM_MODEL_ROUTE = 'model_route';
const PARAM_ROUTE_TYPE = 'route_type';
const PARAM_PROMPT_TEMPLATE = 'prompt_template';
const PARAM_MAX_TOKENS = 'max_tokens';
const PARAM_TEMPERATURE = 'temperature';
const PARAM_STOP = 'stop';

export const extractPromptInputVariables = (promptTemplate: string) => {
  const pattern = /\{\{\s*([\w-]+)\s*\}\}/g;
  const matches = Array.from(promptTemplate.matchAll(pattern));
  if (!matches.length) {
    return [];
  }

  const uniqueMatches = new Set(matches.map(([, entry]) => entry.toLowerCase()));
  return Array.from(uniqueMatches);
};

export const getPromptInputVariableNameViolations = (promptTemplate: string) => {
  const namesWithSpacesPattern = /\{\{\s*([\w-]+(\s+[\w-]+)+)\s*\}\}/g;
  const namesWithSpacesMatch = promptTemplate.matchAll(namesWithSpacesPattern);
  const namesWithSpaces = Array.from(namesWithSpacesMatch).map(([, match]) => match);
  return { namesWithSpaces };
};

export const compilePromptInputText = (inputTemplate: string, inputValues: Record<string, string>) =>
  Object.entries(inputValues).reduce(
    (current, [key, value]) => current.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'gi'), value),
    inputTemplate,
  );

/**
 * Parses the run entity and extracts its required parameters
 */
export const extractRequiredInputParamsForRun = (run: RunRowType) => {
  const promptTemplate = extractRunRowParam(run, PARAM_PROMPT_TEMPLATE);
  if (!promptTemplate) {
    return [];
  }
  const requiredInputs = extractPromptInputVariables(promptTemplate);
  return requiredInputs;
};

/**
 * Parses the run entity and extracts all information necessary for evaluating values
 */
export const extractEvaluationPrerequisitesForRun = (run: RunRowType) => {
  const routeName = extractRunRowParam(run, PARAM_MODEL_ROUTE);
  const routeType = extractRunRowParam(run, PARAM_ROUTE_TYPE) as ModelGatewayRouteType;
  const promptTemplate = extractRunRowParam(run, PARAM_PROMPT_TEMPLATE);
  const max_tokens = extractRunRowParamInteger(run, PARAM_MAX_TOKENS);

  const temperature = extractRunRowParamFloat(run, PARAM_TEMPERATURE);
  const stopString = extractRunRowParam(run, PARAM_STOP);
  const stop = stopString
    ?.slice(1, -1)
    .split(',')
    .map((item) => item.trim())
    // Remove empty entries
    .filter(Boolean);

  return { routeName, routeType, promptTemplate, parameters: { max_tokens, temperature, stop } };
};

/**
 * Returns `true` if run appears to originate from the prompt engineering,
 * thus contains necessary data for the evaluation of new values.
 */
export const canEvaluateOnRun = (run?: RunRowType) =>
  run?.tags?.[MLFLOW_RUN_SOURCE_TYPE_TAG]?.value === MLflowRunSourceType.PROMPT_ENGINEERING;
```

--------------------------------------------------------------------------------

````
