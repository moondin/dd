---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 420
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 420 of 991)

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

---[FILE: EditableNote.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/EditableNote.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { Alert, Button, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { Prompt } from './Prompt';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMde, { SvgIcon } from 'react-mde';
import { forceAnchorTagNewTab, getMarkdownConverter, sanitizeConvertedHtml } from '../utils/MarkdownUtils';
import './EditableNote.css';
import type { IntlShape } from 'react-intl';
import { FormattedMessage, injectIntl } from 'react-intl';

type EditableNoteImplProps = {
  defaultMarkdown?: string;
  defaultSelectedTab?: string;
  onSubmit?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  showEditor?: boolean;
  saveText?: any;
  toolbarCommands?: any[];
  maxEditorHeight?: number;
  minEditorHeight?: number;
  childProps?: any;
  intl: IntlShape;
};

type EditableNoteImplState = any;

const getReactMdeIcon = (name: string) => <TooltipIcon name={name} />;

export class EditableNoteImpl extends Component<EditableNoteImplProps, EditableNoteImplState> {
  static defaultProps = {
    defaultMarkdown: '',
    defaultSelectedTab: 'write',
    showEditor: false,
    saveText: (
      <FormattedMessage defaultMessage="Save" description="Default text for save button on editable notes in MLflow" />
    ),
    confirmLoading: false,
    toolbarCommands: [
      ['header', 'bold', 'italic', 'strikethrough'],
      ['link', 'quote', 'code', 'image'],
      ['unordered-list', 'ordered-list', 'checked-list'],
    ],
    maxEditorHeight: 500,
    minEditorHeight: 200,
    childProps: {},
  };

  state = {
    markdown: this.props.defaultMarkdown,
    selectedTab: this.props.defaultSelectedTab,
    error: null,
  };

  converter = getMarkdownConverter();

  componentDidUpdate(prevProps: EditableNoteImplProps) {
    if (
      prevProps.defaultMarkdown !== this.props.defaultMarkdown ||
      prevProps.defaultSelectedTab !== this.props.defaultSelectedTab
    ) {
      this.setState({
        markdown: this.props.defaultMarkdown,
        selectedTab: this.props.defaultSelectedTab,
      });
    }
  }

  handleMdeValueChange = (markdown: any) => {
    this.setState({ markdown });
  };

  handleTabChange = (selectedTab: any) => {
    this.setState({ selectedTab });
  };

  handleSubmitClick = () => {
    const { onSubmit } = this.props;
    const { markdown } = this.state;
    this.setState({ confirmLoading: true });
    if (onSubmit) {
      return Promise.resolve(onSubmit(markdown))
        .then(() => {
          this.setState({ confirmLoading: false, error: null });
        })
        .catch((e) => {
          this.setState({
            confirmLoading: false,
            error:
              e && e.getMessageField
                ? e.getMessageField()
                : this.props.intl.formatMessage({
                    defaultMessage: 'Failed to submit',
                    description: 'Message text for failing to save changes in editable note in MLflow',
                  }),
          });
        });
    }
    return null;
  };

  handleCancelClick = () => {
    // Reset to the last defaultMarkdown passed in as props.
    this.setState({
      markdown: this.props.defaultMarkdown,
      selectedTab: this.props.defaultSelectedTab,
    });
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  contentHasChanged() {
    return this.state.markdown !== this.props.defaultMarkdown;
  }

  renderActions() {
    // @ts-expect-error TS(2339): Property 'confirmLoading' does not exist on type '... Remove this comment to see the full error message
    const { confirmLoading } = this.state;
    return (
      <div className="mlflow-editable-note-actions" data-testid="editable-note-actions">
        <div>
          <Button
            componentId="codegen_mlflow_app_src_common_components_editablenote.tsx_114"
            type="primary"
            className="editable-note-save-button"
            onClick={this.handleSubmitClick}
            disabled={!this.contentHasChanged() || confirmLoading}
            loading={confirmLoading}
            data-testid="editable-note-save-button"
          >
            {this.props.saveText}
          </Button>
          <Button
            componentId="codegen_mlflow_app_src_common_components_editablenote.tsx_124"
            htmlType="button"
            className="editable-note-cancel-button"
            onClick={this.handleCancelClick}
            disabled={confirmLoading}
          >
            <FormattedMessage
              defaultMessage="Cancel"
              description="Text for the cancel button in an editable note in MLflow"
            />
          </Button>
        </div>
      </div>
    );
  }

  getSanitizedHtmlContent() {
    const { markdown } = this.state;
    if (markdown) {
      const sanitized = sanitizeConvertedHtml(this.converter.makeHtml(markdown));
      return forceAnchorTagNewTab(sanitized);
    }
    return null;
  }

  render() {
    const { showEditor } = this.props;
    const { markdown, selectedTab, error } = this.state;
    const htmlContent = this.getSanitizedHtmlContent();
    return (
      <div className="note-view-outer-container" data-testid="note-view-outer-container">
        {showEditor ? (
          <React.Fragment>
            <div className="note-view-text-area">
              <ReactMde
                value={markdown}
                minEditorHeight={this.props.minEditorHeight}
                maxEditorHeight={this.props.maxEditorHeight}
                minPreviewHeight={50}
                childProps={this.props.childProps}
                toolbarCommands={this.props.toolbarCommands}
                onChange={this.handleMdeValueChange}
                // @ts-expect-error TS(2322): Type 'string' is not assignable to type '"write" |... Remove this comment to see the full error message
                selectedTab={selectedTab}
                onTabChange={this.handleTabChange}
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                generateMarkdownPreview={(md) => Promise.resolve(this.getSanitizedHtmlContent(md))}
                getIcon={getReactMdeIcon}
              />
            </div>
            {error && (
              <Alert
                componentId="codegen_mlflow_app_src_common_components_editablenote.tsx_178"
                type="error"
                message={this.props.intl.formatMessage({
                  defaultMessage: 'There was an error submitting your note.',
                  description: 'Error message text when saving an editable note in MLflow',
                })}
                description={error}
                closable
              />
            )}
            {this.renderActions()}
            <Prompt
              when={this.contentHasChanged()}
              message={this.props.intl.formatMessage({
                defaultMessage: 'Are you sure you want to navigate away? Your pending text changes will be lost.',
                description: 'Prompt text for navigating away before saving changes in editable note in MLflow',
              })}
            />
          </React.Fragment>
        ) : (
          <HTMLNoteContent content={htmlContent} />
        )}
      </div>
    );
  }
}

type TooltipIconProps = {
  name?: string;
};

function TooltipIcon(props: TooltipIconProps) {
  const { theme } = useDesignSystemTheme();
  const { name } = props;
  return (
    <Tooltip side="top" content={name} componentId="mlflow.common.components.editable-note.tooltip-icon">
      <span css={{ color: theme.colors.textPrimary }}>
        {/* @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message */}
        <SvgIcon icon={name} />
      </span>
    </Tooltip>
  );
}

type HTMLNoteContentProps = {
  content?: string;
};

function HTMLNoteContent(props: HTMLNoteContentProps) {
  const { content } = props;
  return content ? (
    <div className="note-view-outer-container" data-testid="note-view-outer-container">
      <div className="note-view-text-area">
        <div className="note-view-preview note-editor-preview">
          <div
            className="note-editor-preview-content"
            data-testid="note-editor-preview-content"
            // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <FormattedMessage defaultMessage="None" description="Default text for no content in an editable note in MLflow" />
    </div>
  );
}

export const EditableNote = injectIntl(EditableNoteImpl);
```

--------------------------------------------------------------------------------

---[FILE: EditableTagsTableView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/EditableTagsTableView.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, jest, test, expect } from '@jest/globals';
import React from 'react';
import { EditableTagsTableView } from './EditableTagsTableView';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from '../utils/RoutingUtils';
import { DesignSystemProvider } from '@databricks/design-system';

const editableTableDataTestId = 'editable-table';
const tagNameInputDataTestId = 'tags-form-input-name';
const addTagButtonDataTestId = 'add-tag-button';

describe('unit tests', () => {
  const minimalProps = {
    tags: {
      tag1: { key: 'tag1', value: 'value1' },
      tag2: { key: 'tag2', value: 'value2' },
    },
    // eslint-disable-next-line no-unused-vars
    form: { getFieldDecorator: jest.fn((opts) => (c: any) => c) },
    handleAddTag: () => {},
    handleSaveEdit: () => {},
    handleDeleteTag: () => {},
    isRequestPending: false,
  };

  const renderTestComponent = () =>
    renderWithIntl(
      <DesignSystemProvider>
        <BrowserRouter>
          <EditableTagsTableView {...minimalProps} />
        </BrowserRouter>
      </DesignSystemProvider>,
    );

  test('should render with minimal props without exploding', () => {
    renderTestComponent();
    expect(screen.getByTestId(editableTableDataTestId)).toBeInTheDocument();
  });

  test('should validate tag name properly', async () => {
    renderTestComponent();

    await userEvent.type(screen.getByTestId(tagNameInputDataTestId), 'tag1');
    await userEvent.click(screen.getByTestId(addTagButtonDataTestId));
    const validateText = await screen.findByText('Tag "tag1" already exists.');
    expect(validateText).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EditableTagsTableView.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/EditableTagsTableView.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import Utils from '../utils/Utils';
import { LegacyForm, Input, Button, Spacer } from '@databricks/design-system';
import { EditableFormTable } from './tables/EditableFormTable';
import { sortBy } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';

type Props = {
  tags: any;
  handleAddTag: (...args: any[]) => any;
  handleSaveEdit: (...args: any[]) => any;
  handleDeleteTag: (...args: any[]) => any;
  isRequestPending: boolean;
  intl: {
    formatMessage: (...args: any[]) => any;
  };
  innerRef?: any;
};

class EditableTagsTableViewImpl extends Component<Props> {
  tableColumns = [
    {
      title: this.props.intl.formatMessage({
        defaultMessage: 'Name',
        description: 'Column title for name column in editable tags table view in MLflow',
      }),
      dataIndex: 'name',
      width: 200,
    },
    {
      title: this.props.intl.formatMessage({
        defaultMessage: 'Value',
        description: 'Column title for value column in editable tags table view in MLflow',
      }),
      dataIndex: 'value',
      width: 200,
      editable: true,
    },
  ];

  getData = () =>
    sortBy(
      Utils.getVisibleTagValues(this.props.tags).map((values) => ({
        key: values[0],
        name: values[0],
        value: values[1],
      })),
      'name',
    );

  getTagNamesAsSet = () => new Set(Utils.getVisibleTagValues(this.props.tags).map((values) => values[0]));

  tagNameValidator = (rule: any, value: any, callback: any) => {
    const tagNamesSet = this.getTagNamesAsSet();
    callback(
      tagNamesSet.has(value)
        ? this.props.intl.formatMessage(
            {
              defaultMessage: 'Tag "{value}" already exists.',
              description: 'Validation message for tags that already exist in tags table in MLflow',
            },
            {
              value: value,
            },
          )
        : undefined,
    );
  };

  render() {
    const { isRequestPending, handleSaveEdit, handleDeleteTag, handleAddTag, innerRef } = this.props;

    return (
      <>
        <EditableFormTable
          columns={this.tableColumns}
          data={this.getData()}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDeleteTag}
        />
        <Spacer size="sm" />
        <div>
          {/* @ts-expect-error TS(2322): Type '{ children: Element[]; ref: any; layout: "in... Remove this comment to see the full error message */}
          <LegacyForm ref={innerRef} layout="inline" onFinish={handleAddTag} css={styles.form}>
            <LegacyForm.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: this.props.intl.formatMessage({
                    defaultMessage: 'Name is required.',
                    description: 'Error message for name requirement in editable tags table view in MLflow',
                  }),
                },
                {
                  validator: this.tagNameValidator,
                },
              ]}
            >
              <Input
                componentId="codegen_mlflow_app_src_common_components_editabletagstableview.tsx_107"
                aria-label="tag name"
                data-testid="tags-form-input-name"
                placeholder={this.props.intl.formatMessage({
                  defaultMessage: 'Name',
                  description: 'Default text for name placeholder in editable tags table form in MLflow',
                })}
              />
            </LegacyForm.Item>
            <LegacyForm.Item name="value" rules={[]}>
              <Input
                componentId="codegen_mlflow_app_src_common_components_editabletagstableview.tsx_117"
                aria-label="tag value"
                data-testid="tags-form-input-value"
                placeholder={this.props.intl.formatMessage({
                  defaultMessage: 'Value',
                  description: 'Default text for value placeholder in editable tags table form in MLflow',
                })}
              />
            </LegacyForm.Item>
            <LegacyForm.Item>
              <Button
                componentId="codegen_mlflow_app_src_common_components_editabletagstableview.tsx_127"
                loading={isRequestPending}
                htmlType="submit"
                data-testid="add-tag-button"
              >
                <FormattedMessage
                  defaultMessage="Add"
                  description="Add button text in editable tags table view in MLflow"
                />
              </Button>
            </LegacyForm.Item>
          </LegacyForm>
        </div>
      </>
    );
  }
}

const styles = {
  form: (theme: any) => ({
    '& > div': { marginRight: theme.spacing.sm },
  }),
};

// @ts-expect-error TS(2769): No overload matches this call.
export const EditableTagsTableView = injectIntl(EditableTagsTableViewImpl);
```

--------------------------------------------------------------------------------

---[FILE: ErrorView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ErrorView.test.tsx
Signals: React

```typescript
import { describe, test, expect, it } from '@jest/globals';
import React from 'react';
import { ErrorView } from './ErrorView';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { MemoryRouter } from '../utils/RoutingUtils';

describe('ErrorView', () => {
  test('should render 400', () => {
    renderWithIntl(
      <MemoryRouter>
        <ErrorView statusCode={400} fallbackHomePageReactRoute="/path/to" />
      </MemoryRouter>,
    );

    const errorImage = screen.getByRole('img');
    expect(errorImage).toBeInTheDocument();
    expect(errorImage).toHaveAttribute('alt', '400 Bad Request');

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Bad Request');

    const subtitle = screen.getByRole('heading', { level: 2 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('Go back to');

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/path/to');
  });

  it('should render 404', () => {
    renderWithIntl(
      <MemoryRouter>
        <ErrorView statusCode={404} fallbackHomePageReactRoute="/path/to" />
      </MemoryRouter>,
    );

    const errorImage = screen.getByRole('img');
    expect(errorImage).toBeInTheDocument();
    expect(errorImage).toHaveAttribute('alt', '404 Not Found');

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Page Not Found');

    const subtitle = screen.getByRole('heading', { level: 2 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('Go back to');

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/path/to');
  });

  test('should render 404 with sub message', () => {
    renderWithIntl(
      <MemoryRouter>
        <ErrorView statusCode={404} fallbackHomePageReactRoute="/path/to" subMessage="sub message" />
      </MemoryRouter>,
    );

    const errorImage = screen.getByRole('img');
    expect(errorImage).toBeInTheDocument();
    expect(errorImage).toHaveAttribute('alt', '404 Not Found');

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Page Not Found');

    const subtitle = screen.getByRole('heading', { level: 2 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('sub message, go back to ');

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/path/to');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ErrorView.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ErrorView.tsx
Signals: React

```typescript
import { Component } from 'react';
import errorDefaultImg from '../static/default-error.svg';
import error404Img from '../static/404-overflow.svg';
import Routes from '../../experiment-tracking/routes';
import { Link } from '../utils/RoutingUtils';
import { FormattedMessage } from 'react-intl';
import type { DesignSystemHocProps } from '@databricks/design-system';
import { WithDesignSystemThemeHoc } from '@databricks/design-system';

const altMessages: Record<number, string> = {
  400: '400 Bad Request',
  401: '401 Unauthorized',
  404: '404 Not Found',
  409: '409 Conflict',
  500: '500 Internal Server Error',
  502: '502 Bad Gateway',
  503: '503 Service Unavailable',
};

type ErrorImageProps = {
  statusCode: number;
};

function ErrorImage(props: ErrorImageProps) {
  const { statusCode } = props;
  const alt = altMessages[statusCode] || statusCode.toString();

  switch (props.statusCode) {
    case 404:
      return (
        <img className="mlflow-center" alt={alt} style={{ height: '300px', marginTop: '80px' }} src={error404Img} />
      );
    default:
      return (
        <img
          className="mlflow-center"
          alt={alt}
          src={errorDefaultImg}
          style={{
            margin: '12% auto 60px',
            display: 'block',
          }}
        />
      );
  }
}

type ErrorViewImplProps = DesignSystemHocProps & {
  statusCode: number;
  subMessage?: string;
  fallbackHomePageReactRoute?: string;
};

class ErrorViewImpl extends Component<ErrorViewImplProps> {
  static centerMessages: Record<number, string> = {
    400: 'Bad Request',
    404: 'Page Not Found',
    409: 'Resource Conflict',
  };

  renderErrorMessage(subMessage?: string, fallbackHomePageReactRoute?: string) {
    if (subMessage) {
      return (
        <FormattedMessage
          defaultMessage="{subMessage}, go back to <link>the home page.</link>"
          description="Default error message for error views in MLflow"
          values={{
            link: (chunks) => (
              <Link data-testid="error-view-link" to={fallbackHomePageReactRoute || Routes.rootRoute}>
                {chunks}
              </Link>
            ),
            subMessage: subMessage,
          }}
        />
      );
    } else {
      return (
        <FormattedMessage
          defaultMessage="Go back to <link>the home page.</link>"
          description="Default error message for error views in MLflow"
          values={{
            link: (chunks) => (
              <Link data-testid="error-view-link" to={fallbackHomePageReactRoute || Routes.rootRoute}>
                {chunks}
              </Link>
            ),
          }}
        />
      );
    }
  }

  render() {
    const { statusCode, subMessage, fallbackHomePageReactRoute, designSystemThemeApi } = this.props;
    const centerMessage = ErrorViewImpl.centerMessages[statusCode] || 'HTTP Request Error';

    return (
      <div className="mlflow-center">
        <ErrorImage statusCode={statusCode} />
        <h1 style={{ paddingTop: '10px' }}>{centerMessage}</h1>
        <h2 style={{ color: designSystemThemeApi.theme.colors.textSecondary }}>
          {this.renderErrorMessage(subMessage, fallbackHomePageReactRoute)}
        </h2>
      </div>
    );
  }
}

export const ErrorView = WithDesignSystemThemeHoc(ErrorViewImpl);
```

--------------------------------------------------------------------------------

---[FILE: ErrorViewV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ErrorViewV2.tsx

```typescript
import { Empty, WarningIcon } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

/**
 * A simple wrapper over <Empty> component displaying an error message.
 */
export const ErrorViewV2 = ({
  error,
  image,
  title,
  button,
  className,
}: {
  error: Error;
  image?: React.ReactElement;
  title?: React.ReactElement;
  button?: React.ReactElement;
  className?: string;
}) => {
  return (
    <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <Empty
        description={error.message}
        image={image ?? <WarningIcon />}
        title={
          title ?? (
            <FormattedMessage
              defaultMessage="Error"
              description="A generic error message for error state in MLflow UI"
            />
          )
        }
        button={button}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExpandableCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ExpandableCell.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import { Button, ChevronDownIcon, ChevronRightIcon, useDesignSystemTheme } from '@databricks/design-system';

export const ExpandedJSONValueCell = ({ value }: { value: string }) => {
  const structuredJSONValue = useMemo(() => {
    // Attempts to parse the value as JSON and returns a pretty printed version if successful.
    // If JSON structure is not found, returns null.
    try {
      const objectData = JSON.parse(value);
      return JSON.stringify(objectData, null, 2);
    } catch (e) {
      return null;
    }
  }, [value]);
  return (
    <div
      css={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: structuredJSONValue ? 'monospace' : undefined,
      }}
    >
      {structuredJSONValue || value}
    </div>
  );
};

const ExpandableCell = ({
  value,
  isExpanded,
  toggleExpanded,
  hideCollapseButton,
}: {
  value: string;
  isExpanded: boolean;
  toggleExpanded: () => void;
  hideCollapseButton?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing.xs,
      }}
    >
      {!hideCollapseButton && (
        <Button
          componentId="mlflow.common.expandable_cell"
          size="small"
          icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => toggleExpanded()}
          css={{ flexShrink: 0 }}
        />
      )}
      <div
        title={value}
        css={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? undefined : '3',
        }}
      >
        {isExpanded ? <ExpandedJSONValueCell value={value} /> : value}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExpandableList.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ExpandableList.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';
import ExpandableList from './ExpandableList';

const minimalProps = {
  // eslint-disable-next-line react/jsx-key
  children: [<div>testchild</div>],
};

const advancedProps = {
  // eslint-disable-next-line react/jsx-key
  children: [<div>testchild1</div>, <div>testchild2</div>],
  showLines: 1,
};

describe('ExpandableList', () => {
  test('should render with minimal props without exploding', () => {
    renderWithIntl(<ExpandableList {...minimalProps} />);
    expect(screen.getByText('testchild')).toBeInTheDocument();
  });

  test('expanding a longer list displays single element and expander and correctly expands', async () => {
    renderWithIntl(<ExpandableList {...advancedProps} />);
    expect(screen.getByText('testchild1')).toBeInTheDocument();
    expect(screen.queryByText('testchild2')).not.toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();

    await userEvent.click(screen.getByText('+1 more'));
    expect(screen.getByText('testchild1')).toBeInTheDocument();
    expect(screen.getByText('testchild2')).toBeInTheDocument();
    expect(screen.getByText('Less')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Less'));
    expect(screen.getByText('testchild1')).toBeInTheDocument();
    expect(screen.queryByText('testchild2')).not.toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExpandableList.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ExpandableList.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';

type Props = {
  onToggle?: (...args: any[]) => any;
  showLines?: number;
};

type State = any;

class ExpandableList extends Component<Props, State> {
  state = {
    toggled: false,
  };

  static defaultProps = {
    showLines: 1,
  };

  handleToggle = () => {
    this.setState((prevState: any) => ({
      toggled: !prevState.toggled,
    }));
    if (this.props.onToggle) {
      this.props.onToggle();
    }
  };

  render() {
    if ((this.props.children as any).length <= (this.props.showLines ?? 1)) {
      return (
        <div css={expandableListClassName}>
          {(this.props.children as any).map((item: any, index: any) => (
            <div className="expandable-list-item" key={index}>
              {item}
            </div>
          ))}
        </div>
      );
    } else {
      const expandedElems = (this.props.children as any).slice(this.props.showLines).map((item: any, index: any) => (
        <div className="expandable-list-item" key={index}>
          {item}
        </div>
      ));
      const expandedContent = (
        <div className="expanded-list-elems">
          {expandedElems}
          <div onClick={this.handleToggle} className="expander-text">
            Less
          </div>
        </div>
      );
      const showMore = (
        <div onClick={this.handleToggle} className="expander-text">
          +{(this.props.children as any).length - (this.props.showLines ?? 1)} more
        </div>
      );
      return (
        <div css={expandableListClassName}>
          {(this.props.children as any).slice(0, this.props.showLines).map((item: any, index: any) => (
            <div className="expandable-list-item" key={index}>
              {item}
            </div>
          ))}
          {this.state.toggled ? expandedContent : showMore}
        </div>
      );
    }
  }
}

const expandableListClassName = {
  '.expander-text': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default ExpandableList;
```

--------------------------------------------------------------------------------

---[FILE: IconButton.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/IconButton.test.tsx
Signals: React

```typescript
import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { IconButton } from './IconButton';
import userEvent from '@testing-library/user-event';

const minimalProps = { icon: () => <span /> };

describe('IconButton', () => {
  test('should render with minimal props without exploding', () => {
    renderWithIntl(<IconButton {...minimalProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should not have padding', () => {
    renderWithIntl(<IconButton {...minimalProps} />);
    expect(screen.getByRole('button')).toHaveStyle('padding: 0px');
  });

  test('should propagate props to Button', () => {
    const props = {
      className: 'dummy-class',
      style: { margin: 5 },
    };
    renderWithIntl(<IconButton {...{ ...minimalProps, ...props }} />);

    expect(screen.getByRole('button')).toHaveStyle('padding: 0px');
    expect(screen.getByRole('button')).toHaveStyle('margin: 5px');
  });

  test('should trigger onClick when clicked', async () => {
    const mockOnClick = jest.fn();
    const props = {
      ...minimalProps,
      onClick: mockOnClick,
    };
    renderWithIntl(<IconButton {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: IconButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/IconButton.tsx
Signals: React

```typescript
import React from 'react';
import { Button } from '@databricks/design-system';

type Props = {
  icon: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  restProps?: unknown;
};

export const IconButton = ({ icon, className, style, onClick, ...restProps }: Props) => {
  return (
    <Button
      componentId="codegen_mlflow_app_src_common_components_iconbutton.tsx_20"
      type="link"
      className={className}
      style={{ padding: 0, ...style }}
      onClick={onClick}
      {...restProps}
    >
      {icon}
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: JsonFormatting.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/JsonFormatting.tsx
Signals: React

```typescript
import React from 'react';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { isObject } from 'lodash';

interface JsonPreviewProps {
  json: string;
  wrapperStyle?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
  codeSnippetStyle?: React.CSSProperties;
}

export const JsonPreview: React.FC<React.PropsWithChildren<JsonPreviewProps>> = ({
  json,
  wrapperStyle,
  overlayStyle,
  codeSnippetStyle,
}) => {
  const { formattedJson, isJsonContent } = useFormattedJson(json);

  const defaultWrapperStyle: React.CSSProperties = {
    position: 'relative',
    maxHeight: 'calc(1.5em * 9)',
    overflow: 'hidden',
  };

  const defaultOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 6,
    height: '2em',
    background: 'linear-gradient(transparent, white)',
  };

  const defaultCodeSnippetStyle: React.CSSProperties = {
    padding: '5px',
    overflowX: 'hidden',
  };

  return (
    <div style={{ ...defaultWrapperStyle, ...wrapperStyle }}>
      {isJsonContent ? (
        <>
          <CodeSnippet language="json" style={{ ...defaultCodeSnippetStyle, ...codeSnippetStyle }}>
            {formattedJson}
          </CodeSnippet>
          <div css={{ ...defaultOverlayStyle, ...overlayStyle }} />
        </>
      ) : (
        <>{json}</>
      )}
    </div>
  );
};

function useFormattedJson(json: string) {
  return React.useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      const isJson = isObject(parsed) && typeof parsed !== 'function' && !(parsed instanceof Date);
      return {
        formattedJson: isJson ? JSON.stringify(parsed, null, 2) : json,
        isJsonContent: isJson,
      };
    } catch (e) {
      return {
        formattedJson: json,
        isJsonContent: false,
      };
    }
  }, [json]);
}

export const FormattedJsonDisplay: React.FC<React.PropsWithChildren<{ json: string }>> = ({ json }) => {
  const { formattedJson, isJsonContent } = useFormattedJson(json);

  return (
    <div css={{ whiteSpace: 'pre-wrap' }}>
      {isJsonContent ? (
        <CodeSnippet language="json" wrapLongLines>
          {formattedJson}
        </CodeSnippet>
      ) : (
        <span>{json}</span>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTag.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/KeyValueTag.test.tsx

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import { screen, renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { KeyValueEntity } from '../types';
import { KeyValueTag, getKeyAndValueComplexTruncation } from './KeyValueTag';
import { DesignSystemProvider } from '@databricks/design-system';

describe('KeyValueTag', () => {
  const handleTagClose = jest.fn();
  function renderTestComponent(tag: KeyValueEntity, isClosable = true) {
    renderWithIntl(
      <DesignSystemProvider>
        <KeyValueTag tag={tag} isClosable={isClosable} onClose={isClosable ? handleTagClose : undefined} />
      </DesignSystemProvider>,
    );
  }

  function createTestTag(key: string, value: string): KeyValueEntity {
    return {
      key,
      value,
    } as KeyValueEntity;
  }

  test('it should render only tag key if tag value is empty', () => {
    renderTestComponent(createTestTag('tagKey', ''));
    expect(screen.getByText('tagKey')).toBeInTheDocument();
    expect(screen.queryByText(':')).not.toBeInTheDocument();
  });

  test('it should render tag key and value if tag value is not empty', () => {
    renderTestComponent(createTestTag('tagKey', 'tagValue'));
    expect(screen.getByText('tagKey')).toBeInTheDocument();
    expect(screen.getByText(': tagValue')).toBeInTheDocument();
  });

  test('it should call handleTagClose when click on close button', () => {
    renderTestComponent(createTestTag('tagKey', 'tagValue'));
    expect(handleTagClose).not.toHaveBeenCalled();
    screen.getByRole('button').click();
    expect(handleTagClose).toHaveBeenCalled();
  });

  test('it should not render handleTagClose when onClose is not provided', () => {
    renderTestComponent(createTestTag('tagKey', 'tagValue'), false);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  describe('getKeyAndValueComplexTruncation', () => {
    test('it should not truncate tag key and value if they are short', () => {
      const result = getKeyAndValueComplexTruncation(createTestTag('tagKey', 'tagValue'));
      expect(result.shouldTruncateKey).toBe(false);
      expect(result.shouldTruncateValue).toBe(false);
    });

    test('it should truncate tag key if it is too long', () => {
      const longKey = '123'.repeat(100);
      const result = getKeyAndValueComplexTruncation(createTestTag(longKey, 'value'));
      expect(result.shouldTruncateKey).toBe(true);
      expect(result.shouldTruncateValue).toBe(false);
    });

    test('it should truncate tag value if it is too long', () => {
      const longValue = '123'.repeat(100);
      const result = getKeyAndValueComplexTruncation(createTestTag('key', longValue));
      expect(result.shouldTruncateKey).toBe(false);
      expect(result.shouldTruncateValue).toBe(true);
    });

    test('it should truncate tag key and value if they are too long', () => {
      const longKey = '123'.repeat(100);
      const longValue = 'abc'.repeat(100);
      const result = getKeyAndValueComplexTruncation(createTestTag(longKey, longValue));
      expect(result.shouldTruncateKey).toBe(true);
      expect(result.shouldTruncateValue).toBe(true);
    });

    test('it should accept custom charsLength', () => {
      const result = getKeyAndValueComplexTruncation(createTestTag('tagKey', 'tagValue'), 5);
      expect(result.shouldTruncateKey).toBe(true);
      expect(result.shouldTruncateValue).toBe(true);
    });
  });
});
```

--------------------------------------------------------------------------------

````
