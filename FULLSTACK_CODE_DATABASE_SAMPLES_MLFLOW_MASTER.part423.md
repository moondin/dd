---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 423
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 423 of 991)

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

---[FILE: DetailsPageLayout.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/details-page-layout/DetailsPageLayout.tsx
Signals: React

```typescript
import { type ReactNode } from 'react';
import type { AsideSections } from '@databricks/web-shared/utils';
import { OverviewLayout } from '@databricks/web-shared/utils';

/**
 * A wrapper for the details page layout, conditionally rendering sidebar-enabled layout based on prop.
 */
export const DetailsPageLayout = ({
  children,
  className,
  secondarySections = [],
  usingSidebarLayout,
  sidebarSize = 'lg',
}: {
  children: ReactNode;
  className?: string;
  secondarySections?: AsideSections;
  usingSidebarLayout?: boolean;
  sidebarSize?: 'sm' | 'lg';
}) => {
  if (usingSidebarLayout) {
    return (
      <div className={className}>
        {/* prettier-ignore */}
        <OverviewLayout
          asideSections={secondarySections}
          isTabLayout
          sidebarSize={sidebarSize}
          verticalStackOrder="aside-first"
        >
          {children}
        </OverviewLayout>
      </div>
    );
  }
  return <div className={className}>{children}</div>;
};
```

--------------------------------------------------------------------------------

---[FILE: AppErrorBoundary.css]---
Location: mlflow-master/mlflow/server/js/src/common/components/error-boundaries/AppErrorBoundary.css

```text
.mlflow-center {
  text-align: center;
}

.mlflow-error-image {
  margin: 12% auto 60px;
  display: block;
}
```

--------------------------------------------------------------------------------

---[FILE: AppErrorBoundary.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/error-boundaries/AppErrorBoundary.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, afterEach, test, expect } from '@jest/globals';
import React from 'react';
import { mount, shallow } from 'enzyme';
import AppErrorBoundary from './AppErrorBoundary';
import { SupportPageUrl } from '../../constants';
import Utils from '../../utils/Utils';

describe('AppErrorBoundary', () => {
  let wrapper: any;
  let minimalProps: any;

  beforeEach(() => {
    minimalProps = {
      children: <div data-testid="child-component">testChild</div>,
    };
    wrapper = shallow(<AppErrorBoundary {...minimalProps} />).dive();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should render with minimal props without exploding', () => {
    expect(wrapper.find('[data-testid="child-component"]')).toHaveLength(1);
    expect(wrapper.find('.mlflow-error-image').length).toBe(0);
  });

  test('componentDidCatch causes error message to render', () => {
    const instance = wrapper.instance();
    instance.componentDidCatch('testError', 'testInfo');
    instance.forceUpdate();
    expect(wrapper.find('.mlflow-error-image').length).toBe(1);
    expect(wrapper.text()).not.toMatch('testChild');
    expect(wrapper.find({ href: SupportPageUrl }).length).toBe(1);
  });
  test('register its notifications API in global utils', () => {
    jest.spyOn(Utils, 'registerNotificationsApi').mockImplementation(() => {});
    mount(<AppErrorBoundary {...minimalProps} />);
    expect(Utils.registerNotificationsApi).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AppErrorBoundary.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/error-boundaries/AppErrorBoundary.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import './AppErrorBoundary.css';
import defaultErrorImg from '../../static/default-error.svg';
import Utils from '../../utils/Utils';
import { withNotifications } from '@databricks/design-system';

type Props = {
  service?: string;
  notificationAPI?: any;
  notificationContextHolder?: React.ReactNode;
};

type State = any;

class AppErrorBoundary extends Component<React.PropsWithChildren<Props>, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    // Register this component's notifications API (corresponding to locally mounted
    // notification context) in the global Utils object.
    Utils.registerNotificationsApi(this.props.notificationAPI);
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true });
    // eslint-disable-next-line no-console -- TODO(FEINF-3587)
    console.error(error, errorInfo);
  }

  render() {
    return (
      <>
        {/* @ts-expect-error TS(4111): Property 'hasError' comes from an index signature,... Remove this comment to see the full error message */}
        {this.state.hasError ? (
          <div>
            <img className="mlflow-error-image" alt="Error" src={defaultErrorImg} />
            <h1 className="mlflow-center">Something went wrong</h1>
            <h4 className="mlflow-center">
              If this error persists, please report an issue {/* Reported during ESLint upgrade */}
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a href={Utils.getSupportPageUrl()} target="_blank">
                here
              </a>
              .
            </h4>
          </div>
        ) : (
          this.props.children
        )}
        {this.props.notificationContextHolder}
      </>
    );
  }
}

// @ts-expect-error TS(2345): Argument of type 'typeof AppErrorBoundary' is not ... Remove this comment to see the full error message
export default withNotifications(AppErrorBoundary);
```

--------------------------------------------------------------------------------

---[FILE: SectionErrorBoundary.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/error-boundaries/SectionErrorBoundary.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { SectionErrorBoundary } from './SectionErrorBoundary';
import { SupportPageUrl } from '../../constants';

describe('SectionErrorBoundary', () => {
  let minimalProps: any;

  beforeEach(() => {
    minimalProps = { children: 'testChild' };
  });

  test('should render with minimal props without exploding', () => {
    renderWithIntl(<SectionErrorBoundary {...minimalProps} />);
    expect(screen.getByText('testChild')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-fail')).not.toBeInTheDocument();
  });

  test('componentDidCatch causes error message to render', () => {
    const ErrorComponent = () => {
      throw new Error('error msg');
    };
    renderWithIntl(
      <SectionErrorBoundary {...minimalProps}>
        <ErrorComponent />{' '}
      </SectionErrorBoundary>,
    );

    expect(screen.getByTestId('icon-fail')).toBeInTheDocument();
    expect(screen.queryByText('testChild')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /here/i })).toHaveAttribute('href', SupportPageUrl);
  });

  test('should show error if showServerError prop passed in', () => {
    const ErrorComponent = () => {
      throw new Error('some error message');
    };
    renderWithIntl(
      <SectionErrorBoundary {...minimalProps} showServerError>
        <ErrorComponent />{' '}
      </SectionErrorBoundary>,
    );

    expect(screen.getByText(/error message: some error message/i)).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SectionErrorBoundary.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/error-boundaries/SectionErrorBoundary.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import Utils from '../../utils/Utils';

type Props = {
  showServerError?: boolean;
};

type State = any;

export class SectionErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error });
    // eslint-disable-next-line no-console -- TODO(FEINF-3587)
    console.error(error, errorInfo);
  }

  renderErrorMessage(error: any) {
    return this.props.showServerError ? <div>Error message: {error.message}</div> : '';
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <div>
          <p>
            <i
              data-testid="icon-fail"
              className="fa fa-exclamation-triangle mlflow-icon-fail"
              css={classNames.wrapper}
            />
            <span> Something went wrong with this section. </span>
            <span>If this error persists, please report an issue </span>
            {/* Reported during ESLint upgrade */}
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a href={Utils.getSupportPageUrl()} target="_blank">
              here
            </a>
            .{this.renderErrorMessage(error)}
          </p>
        </div>
      );
    }

    return children;
  }
}

const classNames = {
  wrapper: {
    marginLeft: -2, // to align the failure icon with the collapsable section caret toggle
  },
};
```

--------------------------------------------------------------------------------

---[FILE: EditableFormTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/tables/EditableFormTable.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { EditableTable } from './EditableFormTable';
import { renderWithIntl, screen } from '../../utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';

describe('unit tests', () => {
  const minimalProps = {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        width: 200,
        editable: true,
      },
    ],
    data: [
      { key: 'tag1', name: 'tag1', value: 'value1' },
      { key: 'tag2', name: 'tag2', value: 'value2' },
    ],
    onSaveEdit: () => {},
    onDelete: () => {},
  };

  test('should render with minimal props without exploding', () => {
    renderWithIntl(<EditableTable {...minimalProps} />);
    expect(screen.getByText('tag1')).toBeInTheDocument();
  });

  test('should display only one modal when deleting a tag', async () => {
    // Prep
    renderWithIntl(<EditableTable {...minimalProps} />);

    // Assert
    expect(screen.queryByTestId('editable-form-table-remove-modal')).not.toBeInTheDocument();

    // Update
    await userEvent.click(screen.getAllByTestId('editable-table-button-delete')[0]);

    // Assert
    expect(screen.getByTestId('editable-form-table-remove-modal')).toBeVisible();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EditableFormTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/tables/EditableFormTable.tsx
Signals: React, TypeORM

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import {
  Input,
  Button,
  LegacyForm,
  Modal,
  LegacyTable,
  PencilIcon,
  Spinner,
  TrashIcon,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
const EditableContext = React.createContext();

type EditableCellProps = {
  editing?: boolean;
  dataIndex?: string;
  title?: string;
  record?: any;
  index?: number;
  save?: (...args: any[]) => any;
  cancel?: (...args: any[]) => any;
  recordKey?: string;
};

class EditableCell extends React.Component<EditableCellProps> {
  handleKeyPress = (event: any) => {
    const { save, recordKey, cancel } = this.props;
    if (event.key === 'Enter') {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      save(recordKey);
    } else if (event.key === 'Escape') {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      cancel();
    }
  };

  render() {
    const { editing, dataIndex, record, children } = this.props;
    return (
      <EditableContext.Consumer>
        {/* @ts-expect-error TS(2322): Type '({ formRef }: { formRef: any; }) => Element'... Remove this comment to see the full error message */}
        {({ formRef }) => (
          <div className={editing ? 'editing-cell' : ''}>
            {editing ? (
              // @ts-expect-error TS(2322): Type '{ children: Element; ref: any; }' is not ass... Remove this comment to see the full error message
              <LegacyForm ref={formRef}>
                {/* @ts-expect-error TS(2322): Type '{ children: Element; style: { margin: number... Remove this comment to see the full error message */}
                <LegacyForm.Item style={{ margin: 0 }} name={dataIndex} initialValue={record[dataIndex]}>
                  <Input
                    componentId="codegen_mlflow_app_src_common_components_tables_editableformtable.tsx_50"
                    onKeyDown={this.handleKeyPress}
                    data-testid="editable-table-edited-input"
                  />
                </LegacyForm.Item>
              </LegacyForm>
            ) : (
              children
            )}
          </div>
        )}
      </EditableContext.Consumer>
    );
  }
}

type EditableTableProps = {
  columns: any[];
  data: any[];
  onSaveEdit: (...args: any[]) => any;
  onDelete: (...args: any[]) => any;
  intl?: any;
};

type EditableTableState = any;

export class EditableTable extends React.Component<EditableTableProps, EditableTableState> {
  columns: any;
  form: any;

  constructor(props: EditableTableProps) {
    super(props);
    this.state = { editingKey: '', isRequestPending: false, deletingKey: '' };
    this.columns = this.initColumns();
    this.form = React.createRef();
  }

  initColumns = () => [
    ...this.props.columns.map((col) =>
      col.editable
        ? {
            ...col,
            render: (text: any, record: any) => (
              <EditableCell
                record={record}
                dataIndex={col.dataIndex}
                title={col.title}
                editing={this.isEditing(record)}
                save={this.save}
                cancel={this.cancel}
                recordKey={record.key}
                children={text}
              />
            ),
          }
        : col,
    ),
    {
      title: (
        <FormattedMessage
          defaultMessage="Actions"
          description="Column title for actions column in editable form table in MLflow"
        />
      ),
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        const { editingKey, isRequestPending } = this.state;
        const editing = this.isEditing(record);
        if (editing && isRequestPending) {
          return <Spinner size="small" />;
        }
        return editing ? (
          <span>
            <Button
              componentId="codegen_mlflow_app_src_common_components_tables_editableformtable.tsx_120"
              type="link"
              onClick={() => this.save(record.key)}
              style={{ marginRight: 10 }}
              data-testid="editable-table-button-save"
            >
              <FormattedMessage
                defaultMessage="Save"
                description="Text for saving changes on rows in editable form table in MLflow"
              />
            </Button>
            <Button
              componentId="codegen_mlflow_app_src_common_components_tables_editableformtable.tsx_131"
              type="link"
              // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
              onClick={() => this.cancel(record.key)}
              data-testid="editable-table-button-cancel"
            >
              <FormattedMessage
                defaultMessage="Cancel"
                description="Text for canceling changes on rows in editable form table in MLflow"
              />
            </Button>
          </span>
        ) : (
          <span>
            <Button
              componentId="codegen_mlflow_app_src_common_components_tables_editableformtable.tsx_145"
              icon={<PencilIcon />}
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.key)}
              data-testid="editable-table-button-edit"
            />
            <Button
              componentId="codegen_mlflow_app_src_common_components_tables_editableformtable.tsx_151"
              icon={<TrashIcon />}
              disabled={editingKey !== ''}
              onClick={() => this.setState({ deletingKey: record.key })}
              data-testid="editable-table-button-delete"
            />
          </span>
        );
      },
    },
  ];

  // @ts-expect-error TS(4111): Property 'editingKey' comes from an index signatur... Remove this comment to see the full error message
  isEditing = (record: any) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (key: any) => {
    this.form.current.validateFields().then((values: any) => {
      const record = this.props.data.find((r) => r.key === key);
      if (record) {
        this.setState({ isRequestPending: true });
        this.props.onSaveEdit({ ...record, ...values }).then(() => {
          this.setState({ editingKey: '', isRequestPending: false });
        });
      }
    });
  };

  delete = async (key: any) => {
    try {
      const record = this.props.data.find((r) => r.key === key);
      if (record) {
        this.setState({ isRequestPending: true });
        await this.props.onDelete({ ...record });
      }
    } finally {
      this.setState({ deletingKey: '', isRequestPending: false });
    }
  };

  edit = (key: any) => {
    this.setState({ editingKey: key });
  };

  render() {
    const { data } = this.props;
    return (
      <EditableContext.Provider value={{ formRef: this.form }}>
        <LegacyTable
          className="editable-table"
          data-testid="editable-table"
          dataSource={data}
          columns={this.columns}
          size="middle"
          tableLayout="fixed"
          pagination={false}
          locale={{
            emptyText: (
              <FormattedMessage
                defaultMessage="No tags found."
                description="Text for no tags found in editable form table in MLflow"
              />
            ),
          }}
          scroll={{ y: 280 }}
        />
        <Modal
          componentId="codegen_mlflow_app_src_common_components_tables_editableformtable.tsx_228"
          data-testid="editable-form-table-remove-modal"
          title={
            <FormattedMessage
              defaultMessage="Are you sure you want to delete this tag？"
              description="Title text for confirmation pop-up to delete a tag from table
                     in MLflow"
            />
          }
          // @ts-expect-error TS(4111): Property 'deletingKey' comes from an index signatu... Remove this comment to see the full error message
          visible={this.state.deletingKey}
          okText={
            <FormattedMessage
              defaultMessage="Confirm"
              description="OK button text for confirmation pop-up to delete a tag from table
                     in MLflow"
            />
          }
          cancelText={
            <FormattedMessage
              defaultMessage="Cancel"
              description="Cancel button text for confirmation pop-up to delete a tag from
                     table in MLflow"
            />
          }
          // @ts-expect-error TS(4111): Property 'isRequestPending' comes from an index si... Remove this comment to see the full error message
          confirmLoading={this.state.isRequestPending}
          // @ts-expect-error TS(4111): Property 'deletingKey' comes from an index signatu... Remove this comment to see the full error message
          onOk={() => this.delete(this.state.deletingKey)}
          onCancel={() => this.setState({ deletingKey: '' })}
        />
      </EditableContext.Provider>
    );
  }
}

export const EditableFormTable = EditableTable;
```

--------------------------------------------------------------------------------

---[FILE: DarkThemeContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/contexts/DarkThemeContext.tsx
Signals: React

```typescript
import React, { createContext, useContext } from 'react';

interface DarkThemeContextType {
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}

const DarkThemeContext = createContext<DarkThemeContextType>({
  setIsDarkTheme: () => {},
});

export const DarkThemeProvider = ({
  children,
  setIsDarkTheme,
}: {
  children: React.ReactNode;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}) => {
  return <DarkThemeContext.Provider value={{ setIsDarkTheme }}>{children}</DarkThemeContext.Provider>;
};

export const useDarkThemeContext = () => useContext(DarkThemeContext);
```

--------------------------------------------------------------------------------

---[FILE: validations.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/forms/validations.test.ts

```typescript
import { test, jest, expect, describe } from '@jest/globals';
import { getExperimentNameValidator, modelNameValidator } from './validations';
import { Services as ModelRegistryService } from '../../model-registry/services';

test('ExperimentNameValidator works properly', () => {
  const experimentNames = ['Default', 'Test Experiment'];
  const value = experimentNames[0];
  const experimentNameValidator = getExperimentNameValidator(() => experimentNames);

  const mockCallback = jest.fn((err) => err);

  // pass one of the existing experiments as input value
  experimentNameValidator(undefined, value, mockCallback);
  expect(mockCallback).toHaveBeenCalledWith(`Experiment "${value}" already exists.`);

  // no input value passed, no error message expected
  experimentNameValidator(undefined, '', mockCallback);
  expect(mockCallback).toHaveBeenCalledWith(undefined);

  // input value == undefined, no error message expected
  experimentNameValidator(undefined, undefined, mockCallback);
  expect(mockCallback).toHaveBeenCalledWith(undefined);
});

describe('modelNameValidator should work properly', () => {
  test('should invoke callback with undefined for empty name', () => {
    const mockCallback = jest.fn((err) => err);
    modelNameValidator(undefined, '', mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(undefined);
  });

  test('should invoke callback with undefined for undefined name', () => {
    const mockCallback = jest.fn((err) => err);
    modelNameValidator(undefined, undefined, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(undefined);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should invoke callback with error message when model exists', (done) => {
    // getRegisteredModel returns resolved promise indicates model exists
    ModelRegistryService.getRegisteredModel = jest.fn(() => Promise.resolve());
    const mockCallback = jest.fn((err) => err);
    const modelName = 'model A';
    modelNameValidator(undefined, modelName, mockCallback);
    // Check callback invocation in the next tick. We are doing this because returning a promise
    // in callback based validator leads to incorrect form error message behavior.
    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledWith(`Model "${modelName}" already exists.`);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should invoke callback with undefined when model does not exist', (done) => {
    // getRegisteredModel returns rejected promise indicates model does not exist
    ModelRegistryService.getRegisteredModel = jest.fn(() => Promise.reject());
    const mockCallback = jest.fn((err) => err);
    const modelName = 'model A';
    modelNameValidator(undefined, modelName, mockCallback);
    // Check callback invocation in the next tick. We are doing this because returning a promise
    // in callback based validator leads to incorrect form error message behavior.
    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledWith(undefined);
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: validations.ts]---
Location: mlflow-master/mlflow/server/js/src/common/forms/validations.ts

```typescript
import { MlflowService } from '../../experiment-tracking/sdk/MlflowService';
import { Services as ModelRegistryService } from '../../model-registry/services';

export const getExperimentNameValidator = (getExistingExperimentNames: () => string[]) => {
  return (rule: unknown, value: string | undefined, callback: (arg?: string) => void) => {
    if (!value) {
      // no need to execute below validations when no value is entered
      // eslint-disable-next-line callback-return
      callback(undefined);
    } else if (getExistingExperimentNames().includes(value)) {
      // getExistingExperimentNames returns the names of all active experiments
      // check whether the passed value is part of the list
      // eslint-disable-next-line callback-return
      callback(`Experiment "${value}" already exists.`);
    } else {
      // on-demand validation whether experiment already exists in deleted state
      MlflowService.getExperimentByName({ experiment_name: value })
        .then((res) =>
          callback(`Experiment "${value}" already exists in deleted state.
                                 You can restore the experiment, or permanently delete the
                                 experiment from the .trash folder (under tracking server's
                                 root folder) in order to use this experiment name again.`),
        )
        .catch((e) => callback(undefined)); // no experiment returned
    }
  };
};

export const modelNameValidator = (rule: unknown, name: string | undefined, callback: (arg?: string) => void) => {
  if (!name) {
    callback(undefined);
    return;
  }

  ModelRegistryService.getRegisteredModel({ name: name })
    .then(() => callback(`Model "${name}" already exists.`))
    .catch((e) => callback(undefined));
};
```

--------------------------------------------------------------------------------

---[FILE: useArrayMemo.ts]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useArrayMemo.ts
Signals: React

```typescript
import { useRef } from 'react';

/**
 * A custom hook that memoizes an array based on the reference of its elements, not the array itself.
 */
export function useArrayMemo<T>(array: T[]) {
  // This holds reference to previous value
  const ref = useRef<T[]>();
  // Check if each element of the old and new array match
  const areArraysConsideredTheSame =
    ref.current && array.length === ref.current.length
      ? array.every((element, i) => {
          return element === ref.current?.[i];
        })
      : // Initially there's no old array defined/stored, so set to false
        false;

  if (!areArraysConsideredTheSame) {
    ref.current = array;
  }

  return areArraysConsideredTheSame && ref.current ? ref.current : array;
}
```

--------------------------------------------------------------------------------

---[FILE: useBrowserKeyShortcutListener.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useBrowserKeyShortcutListener.test.tsx

```typescript
import { describe, jest, beforeEach, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useBrowserKeyShortcutListener } from './useBrowserKeyShortcutListener';
import userEvent from '@testing-library/user-event';

describe('useBrowserKeyShortcutListener', () => {
  const callback = jest.fn<() => void>();

  beforeEach(() => {
    callback.mockClear();
  });

  it('listens to a single CTRL/CMD+S key combination', async () => {
    renderHook(() => useBrowserKeyShortcutListener('s', { ctrlOrCmdKey: true }, callback));
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Control>}s{/Control}');
    expect(callback).toHaveBeenCalled();
  });

  it('listens to a single ALT/OPT+S key combination', async () => {
    renderHook(() => useBrowserKeyShortcutListener('s', { altOrOptKey: true }, callback));
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Alt>}s{/Alt}');
    expect(callback).toHaveBeenCalled();
  });

  it('listens to a single SHIFT+S key combination', async () => {
    renderHook(() => useBrowserKeyShortcutListener('s', { shiftKey: true }, callback));
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Shift>}s{/Shift}');
    expect(callback).toHaveBeenCalled();
  });

  it('listens to a complex key combination with two modifiers', async () => {
    renderHook(() => useBrowserKeyShortcutListener('s', { altOrOptKey: true, ctrlOrCmdKey: true }, callback));
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Control>}{Alt>}s{/Control}{/Alt}');
    expect(callback).toHaveBeenCalled();
  });

  it('listens to a complex key combination with three modifiers', async () => {
    renderHook(() =>
      useBrowserKeyShortcutListener('s', { altOrOptKey: true, ctrlOrCmdKey: true, shiftKey: true }, callback),
    );
    await userEvent.keyboard('{Shift>}{Alt>}s{/Alt}{/Shift}');
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Shift>}{Control>}s{/Control}{/Shift}');
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Alt>}{Control>}s{/Control}{/Alt}');
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Shift>}{Control>}{Alt>}s{/Control}{/Alt}{/Shift}');
    expect(callback).toHaveBeenCalled();
  });

  it('listens to a complex key combination with three modifiers but sends incomplete combination', async () => {
    renderHook(() =>
      useBrowserKeyShortcutListener('s', { altOrOptKey: true, ctrlOrCmdKey: true, shiftKey: true }, callback),
    );
    expect(callback).not.toHaveBeenCalled();
    await userEvent.keyboard('{Shift>}{Alt>}s{/Alt}{/Shift}');
    expect(callback).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useBrowserKeyShortcutListener.ts]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useBrowserKeyShortcutListener.ts
Signals: React

```typescript
import { useEffect } from 'react';

declare interface NavigatorWithUserData extends Navigator {
  userAgentData: any;
}

const isMacKeyboard = () =>
  // userAgentData should be supported in modern Chromium based browsers
  /mac/i.test((window.navigator as NavigatorWithUserData).userAgentData?.platform) ||
  // if not, falls back to navigator.platform
  /mac/i.test(window.navigator.platform);

const systemModifierKey: keyof KeyboardEvent = isMacKeyboard() ? 'metaKey' : 'ctrlKey';

/**
 * Triggers certain action when a keyboard combination is pressed
 *
 * @example
 *
 * // Listens to CMD+S action
 * useBrowserKeyShortcutListener('s', { ctrlOrCmdKey: true }, () => { ... })
 */
export const useBrowserKeyShortcutListener = (
  /**
   * A single key (e.g. "s") that will be listened for pressing
   */
  key: string,
  /**
   * Determines which modifier keys are necessary to trigger the action
   */
  modifierKeys: { shiftKey?: boolean; ctrlOrCmdKey?: boolean; altOrOptKey?: boolean } = {},
  /**
   * A callback function. If returns true, the default action for the key combination will be prevented.
   */
  fn: () => boolean | void,
) => {
  const { altOrOptKey = false, ctrlOrCmdKey = false, shiftKey = false } = modifierKeys;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (!ctrlOrCmdKey || e[systemModifierKey]) &&
        (!altOrOptKey || e.altKey) &&
        (!shiftKey || e.shiftKey) &&
        e.key === key
      ) {
        const shouldPreventDefault = fn();
        if (shouldPreventDefault) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, fn, ctrlOrCmdKey, altOrOptKey, shiftKey]);

  return { isMacKeyboard };
};
```

--------------------------------------------------------------------------------

---[FILE: useDragAndDropElement.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useDragAndDropElement.test.tsx

```typescript
import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import { DragAndDropProvider, useDragAndDropElement } from './useDragAndDropElement';
import { act, fireEvent, render, screen } from '../utils/TestUtils.react18';

describe('useDragAndDropElement', () => {
  const onDrop = jest.fn();

  // A single draggable component used for testing
  const SingleComponent = ({ id, groupKey = 'group' }: { id: string; groupKey?: string }) => {
    const { dragHandleRef, dragPreviewRef, dropTargetRef, isDragging, isOver } = useDragAndDropElement({
      dragGroupKey: groupKey,
      dragKey: `test-key-${id}`,
      onDrop,
    });

    return (
      <div
        data-testid={`element-${id}`}
        ref={(ref) => {
          dragPreviewRef(ref);
          dropTargetRef(ref);
        }}
      >
        <h2>Element {id}</h2>
        {isOver && <h3>Drag is over element {id}</h3>}
        <div ref={dragHandleRef} data-testid={`handle-${id}`}>
          handle
        </div>
      </div>
    );
  };

  beforeEach(() => {
    onDrop.mockClear();
  });

  test('drag and drop within single group', async () => {
    render(
      <div>
        <DragAndDropProvider>
          <SingleComponent id="a" />
          <SingleComponent id="b" />
          <SingleComponent id="c" />
        </DragAndDropProvider>
      </div>,
    );

    await act(async () => {
      fireEvent.dragStart(screen.getByTestId('handle-a'));
      fireEvent.dragEnter(screen.getByTestId('element-b'));
    });

    expect(screen.getByText('Drag is over element b')).toBeInTheDocument();

    await act(async () => {
      fireEvent.dragEnter(screen.getByTestId('element-c'));
      fireEvent.drop(screen.getByTestId('element-c'));
    });

    expect(onDrop).toHaveBeenLastCalledWith('test-key-a', 'test-key-c');
  });

  test('Prevent dropping on elements belonging to a different drag group', async () => {
    render(
      <div>
        <DragAndDropProvider>
          <SingleComponent id="a" groupKey="group_1" />
          <SingleComponent id="b" groupKey="group_2" />
        </DragAndDropProvider>
      </div>,
    );

    await act(async () => {
      fireEvent.dragStart(screen.getByTestId('handle-a'));
      fireEvent.dragEnter(screen.getByTestId('element-b'));
      fireEvent.drop(screen.getByTestId('element-b'));
    });

    expect(onDrop).not.toHaveBeenCalled();
  });

  test('Rendering two adjacent drag and drop providers works', async () => {
    render(
      <div>
        <DragAndDropProvider>
          <SingleComponent id="a" />
        </DragAndDropProvider>
        <DragAndDropProvider>
          <SingleComponent id="b" />
        </DragAndDropProvider>
      </div>,
    );

    // We should have UI rendered without errors
    expect(screen.getByText('Element a')).toBeInTheDocument();
    expect(screen.getByText('Element b')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````
