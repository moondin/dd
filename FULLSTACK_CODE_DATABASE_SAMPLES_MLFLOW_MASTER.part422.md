---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 422
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 422 of 991)

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

---[FILE: RequestStateWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/RequestStateWrapper.tsx
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
import { getApis } from '../../experiment-tracking/reducers/Reducers';
import { Spinner } from './Spinner';
import { ErrorCodes } from '../constants';
import type { ErrorWrapper } from '../utils/ErrorWrapper';
import type { ReduxState } from '../../redux-types';

export const DEFAULT_ERROR_MESSAGE = 'A request error occurred.';

type RequestStateWrapperProps = {
  children?: React.ReactNode;
  customSpinner?: React.ReactNode;
  shouldOptimisticallyRender?: boolean;
  requests: any[];
  requestIds?: string[];
  requestIdsWith404sToIgnore?: string[];
  description?: any; // TODO: PropTypes.oneOf(Object.values(LoadingDescription))
  permissionDeniedView?: React.ReactNode;
  suppressErrorThrow?: boolean;
  customRequestErrorHandlerFn?: (
    failedRequests: {
      id: string;
      active?: boolean;
      error: Error | ErrorWrapper;
    }[],
  ) => void;
};

type RequestStateWrapperState = any;

export class RequestStateWrapper extends Component<RequestStateWrapperProps, RequestStateWrapperState> {
  static defaultProps = {
    requests: [],
    requestIdsWith404sToIgnore: [],
    shouldOptimisticallyRender: false,
  };

  state = {
    shouldRender: false,
    shouldRenderError: false,
  };

  static getErrorRequests(requests: any, requestIdsWith404sToIgnore: any) {
    return requests.filter((r: any) => {
      if (r.error !== undefined) {
        return !(
          requestIdsWith404sToIgnore &&
          requestIdsWith404sToIgnore.includes(r.id) &&
          r.error.getErrorCode() === ErrorCodes.RESOURCE_DOES_NOT_EXIST
        );
      }
      return false;
    });
  }

  static getDerivedStateFromProps(nextProps: any) {
    const shouldRender = nextProps.requests.length
      ? nextProps.requests.every((r: any) => r && r.active === false)
      : false;

    const requestErrors = RequestStateWrapper.getErrorRequests(
      nextProps.requests,
      nextProps.requestIdsWith404sToIgnore,
    );

    return {
      shouldRender,
      shouldRenderError: requestErrors.length > 0,
      requestErrors,
    };
  }

  getRenderedContent() {
    const { children, requests, customSpinner, permissionDeniedView, suppressErrorThrow, customRequestErrorHandlerFn } =
      this.props;
    // @ts-expect-error TS(2339): Property 'requestErrors' does not exist on type '{... Remove this comment to see the full error message
    const { shouldRender, shouldRenderError, requestErrors } = this.state;
    const permissionDeniedErrors = requestErrors.filter((failedRequest: any) => {
      return failedRequest.error.getErrorCode() === ErrorCodes.PERMISSION_DENIED;
    });

    if (typeof children === 'function') {
      return children(!shouldRender, shouldRenderError, requests, requestErrors);
    } else if (shouldRender || shouldRenderError || this.props.shouldOptimisticallyRender) {
      if (permissionDeniedErrors.length > 0 && permissionDeniedView) {
        return permissionDeniedView;
      }
      if (shouldRenderError && !suppressErrorThrow) {
        customRequestErrorHandlerFn ? customRequestErrorHandlerFn(requestErrors) : triggerError(requestErrors);
      }

      return children;
    }

    return customSpinner || <Spinner />;
  }

  render() {
    return this.getRenderedContent();
  }
}

export const triggerError = (requests: any) => {
  // This triggers the OOPS error boundary.
  // eslint-disable-next-line no-console -- TODO(FEINF-3587)
  console.error('ERROR', requests);
  throw Error(`${DEFAULT_ERROR_MESSAGE}: ${requests.error}`);
};

const mapStateToProps = (state: ReduxState, ownProps: Omit<RequestStateWrapperProps, 'requests'>) => ({
  requests: getApis(ownProps.requestIds, state),
});

export default connect(mapStateToProps)(RequestStateWrapper);
```

--------------------------------------------------------------------------------

---[FILE: ScrollablePageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ScrollablePageWrapper.tsx

```typescript
import { PageWrapper } from '@databricks/design-system';

/**
 * Wraps the page content in the scrollable container so e.g. constrained tables behave correctly.
 */
export const ScrollablePageWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <PageWrapper css={{ height: '100%' }} className={className}>
      {children}
    </PageWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Spinner.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/Spinner.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  test('should render with no props without exploding', () => {
    renderWithIntl(<Spinner />);
    expect(screen.getByAltText('Page loading...')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Spinner.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/Spinner.tsx

```typescript
import spinner from '../static/mlflow-spinner.png';
import type { Interpolation, Theme } from '@emotion/react';
import { keyframes } from '@emotion/react';

type Props = {
  showImmediately?: boolean;
};

export function Spinner({ showImmediately }: Props) {
  return (
    <div css={(theme) => styles.spinner(theme, showImmediately)}>
      <img alt="Page loading..." src={spinner} />
    </div>
  );
}

const styles = {
  spinner: (theme: Theme, immediate?: boolean): Interpolation<Theme> => ({
    width: 100,
    marginTop: 100,
    marginLeft: 'auto',
    marginRight: 'auto',

    img: {
      position: 'absolute',
      opacity: 0,
      top: '50%',
      left: '50%',
      width: theme.general.heightBase * 2,
      height: theme.general.heightBase * 2,
      marginTop: -theme.general.heightBase,
      marginLeft: -theme.general.heightBase,
      animation: `${keyframes`
          0% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
          `} 3s linear infinite`,
      animationDelay: immediate ? '0s' : '0.5s',
    },
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/TagAssignmentModal.tsx

```typescript
import { useTagAssignmentModal } from '../hooks/useTagAssignmentModal';
import type { TagAssignmentModalParams } from '../hooks/useTagAssignmentModal';

export const TagAssignmentModal = (props: TagAssignmentModalParams) => {
  const { TagAssignmentModal } = useTagAssignmentModal({ ...props });

  return TagAssignmentModal;
};
```

--------------------------------------------------------------------------------

---[FILE: TagList.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/TagList.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import { Tag, Button, PencilIcon } from '@databricks/design-system';
import type { KeyValueEntity } from '../types';
import { FormattedMessage } from 'react-intl';
import { KeyValueTag } from './KeyValueTag';

interface Props {
  tags: KeyValueEntity[];
  onEdit: () => void;
}

export const TagList = ({ tags, onEdit }: Props) => {
  const { theme } = useDesignSystemTheme();

  const hasTags = tags.length > 0;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: theme.spacing.xs,
      }}
    >
      {tags?.map((tag) => (
        <KeyValueTag key={tag.key} tag={tag} />
      ))}
      <Button
        componentId="databricks-experiment-tracking-prompt-edit-tags-button"
        size="small"
        icon={hasTags ? <PencilIcon /> : undefined}
        onClick={onEdit}
      >
        {hasTags ? null : (
          <FormattedMessage defaultMessage="Add tags" description="Add new prompt version tags button" />
        )}
      </Button>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TagSelectDropdown.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/TagSelectDropdown.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { fireEvent, renderHook, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Control } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { KeyValueEntity } from '../types';
import { screen, waitFor, act, selectAntdOption } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

import { TagKeySelectDropdown } from './TagSelectDropdown';
import { DesignSystemProvider } from '@databricks/design-system';

describe('TagKeySelectDropdown', () => {
  function renderTestComponent(allAvailableTags: string[], control: Control<KeyValueEntity>) {
    return renderWithIntl(
      <DesignSystemProvider>
        <TagKeySelectDropdown allAvailableTags={allAvailableTags} control={control} />
      </DesignSystemProvider>,
    );
  }

  test('it should render list of tags', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    const { container } = renderTestComponent(['tag1', 'tag2'], result.current.control);
    await act(async () => {
      fireEvent.mouseDown(within(container).getByRole('combobox'));
    });
    expect(screen.getByRole('option', { name: 'tag1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'tag2' })).toBeInTheDocument();
  });

  test('it should filter tags by search input', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    renderTestComponent(['tag1', 'tag2'], result.current.control);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'tag1');
    expect(screen.getByRole('option', { name: 'tag1' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'tag2' })).not.toBeInTheDocument();
  });

  test('it should filter tags by search input based on lowercase', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    renderTestComponent(['tag1', 'tag2'], result.current.control);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'TAG1');
    expect(screen.getByRole('option', { name: 'tag1' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'tag2' })).not.toBeInTheDocument();
  });

  test('it should give the chance to add a new tag', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    renderTestComponent(['tag1', 'tag2'], result.current.control);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'tag_non_existing');
    // user-event v14 does not pass down keyCode, so we need to use fireEvent
    fireEvent.keyDown(input, { keyCode: 13 });
    await waitFor(() => {
      expect(result.current.getValues().key).toBe('tag_non_existing');
    });
  });

  test('it should not allow to add a new tag with invalid characters', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    renderTestComponent(['tag1', 'tag2'], result.current.control);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'invalid-tag');
    // user-event v14 does not pass down keyCode, so we need to use fireEvent
    fireEvent.keyDown(input, { keyCode: 13 });
    await waitFor(() => {
      // Do not add the value
      expect(result.current.getValues().key).toBe(undefined);
    });
  });

  test('it should call handleChange with selected tag', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    const { container } = renderTestComponent(['tag1', 'tag2'], result.current.control);
    await selectAntdOption(container, 'tag1');
    await waitFor(() => {
      expect(result.current.getValues().key).toBe('tag1');
    });
  });

  test('it should insert key as lowercase', async () => {
    const { result } = renderHook(() => useForm<KeyValueEntity>());
    renderTestComponent(['tag1', 'tag2'], result.current.control);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'TAG_NON_EXISTING');
    // user-event v14 does not pass down keyCode, so we need to use fireEvent
    fireEvent.keyDown(input, { keyCode: 13 });
    await waitFor(() => {
      expect(result.current.getValues().key).toBe('tag_non_existing');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagSelectDropdown.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/TagSelectDropdown.tsx
Signals: React

```typescript
import { sortedIndexOf } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { PlusIcon, LegacySelect, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import type { KeyValueEntity } from '../types';

/**
 * Will show an extra row at the bottom of the dropdown menu to create a new tag when
 * The user has typed something in the search input
 * and either
 * 1. The search input is not an exact match for an existing tag name
 * 2. There are no tags available based on search input
 */

function DropdownMenu(menu: React.ReactElement, allAvailableTags: string[]) {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const searchValue = menu.props.searchValue.toLowerCase();

  const resolvedMenu = useMemo(() => {
    if (!searchValue) return menu;

    const doesTagExists = sortedIndexOf(allAvailableTags, searchValue) >= 0;
    if (doesTagExists) return menu;

    const isValidTagKey = /^[^,.:/=\-\s]+$/.test(searchValue);

    // Overriding the menu to add a new option at the top
    return React.cloneElement(menu, {
      flattenOptions: [
        {
          data: {
            value: searchValue,
            disabled: !isValidTagKey,
            style: {
              color: isValidTagKey ? theme.colors.actionTertiaryTextDefault : theme.colors.actionDisabledText,
            },
            children: (
              <Tooltip
                content={
                  isValidTagKey
                    ? undefined
                    : intl.formatMessage({
                        defaultMessage: ', . : / - = and blank spaces are not allowed',
                        description:
                          'Key-value tag editor modal > Tag dropdown Manage Modal > Invalid characters error',
                      })
                }
                componentId="mlflow.common.components.tag-select-dropdown.add-new-tag-tooltip"
                side="right"
              >
                <span css={{ display: 'block' }}>
                  <PlusIcon css={{ marginRight: theme.spacing.sm }} />
                  {intl.formatMessage(
                    {
                      defaultMessage: 'Add tag "{tagKey}"',
                      description: 'Key-value tag editor modal > Tag dropdown Manage Modal > Add new tag button',
                    },
                    {
                      tagKey: searchValue,
                    },
                  )}
                </span>
              </Tooltip>
            ),
          },
          key: searchValue,
          groupOption: false,
        },
        ...menu.props.flattenOptions,
      ],
    });
  }, [allAvailableTags, menu, searchValue, intl, theme]);

  return resolvedMenu;
}

function getDropdownMenu(allAvailableTags: string[]) {
  return (menu: React.ReactElement) => DropdownMenu(menu, allAvailableTags);
}

/**
 * Used in tag edit feature, allows selecting existing / adding new tag value
 */
export function TagKeySelectDropdown({
  allAvailableTags,
  control,
  onKeyChangeCallback,
}: {
  allAvailableTags: string[];
  control: Control<KeyValueEntity>;
  onKeyChangeCallback?: (key?: string) => void;
}) {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<{ blur: () => void; focus: () => void }>(null);

  const { field, fieldState } = useController({
    control: control,
    name: 'key',
    rules: {
      required: {
        message: intl.formatMessage({
          defaultMessage: 'A tag key is required',
          description: 'Key-value tag editor modal > Tag dropdown > Tag key required error message',
        }),
        value: true,
      },
    },
  });

  const handleDropdownVisibleChange = (visible: boolean) => {
    setIsOpen(visible);
  };

  const handleClear = () => {
    field.onChange(undefined);
    onKeyChangeCallback?.(undefined);
  };

  const handleSelect = (key: string) => {
    field.onChange(key);
    onKeyChangeCallback?.(key);
  };

  return (
    <LegacySelect
      allowClear
      ref={selectRef}
      dangerouslySetAntdProps={{
        showSearch: true,
        dropdownRender: getDropdownMenu(allAvailableTags),
      }}
      css={{ width: '100%' }}
      placeholder={intl.formatMessage({
        defaultMessage: 'Type a key',
        description: 'Key-value tag editor modal > Tag dropdown > Tag input placeholder',
      })}
      value={field.value}
      defaultValue={field.value}
      open={isOpen}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}
      onSelect={handleSelect}
      onClear={handleClear}
      validationState={fieldState.error ? 'error' : undefined}
    >
      {allAvailableTags.map((tag) => (
        <LegacySelect.Option value={tag} key={tag}>
          {tag}
        </LegacySelect.Option>
      ))}
    </LegacySelect>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ToggleIconButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ToggleIconButton.tsx
Signals: React

```typescript
import React from 'react';

import type { ButtonProps } from '@databricks/design-system';
import {
  DesignSystemEventProviderAnalyticsEventTypes,
  DesignSystemEventProviderComponentTypes,
  useDesignSystemEventComponentCallbacks,
  useDesignSystemTheme,
} from '@databricks/design-system';

export interface ToggleIconButtonProps extends ButtonProps {
  pressed?: boolean;
}

/**
 * WARNING: Temporary component!
 *
 * This component recreates "Toggle button with icon" pattern which is not
 * available in the design system yet.
 *
 * TODO: replace this component with the one from DuBois design system when available.
 */
const ToggleIconButton = React.forwardRef<HTMLButtonElement, ToggleIconButtonProps>(
  (props: ToggleIconButtonProps, ref) => {
    const {
      pressed,
      onClick,
      icon,
      onBlur,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      componentId,
      analyticsEvents,
      type,
      ...remainingProps
    } = props;
    const { theme } = useDesignSystemTheme();

    const eventContext = useDesignSystemEventComponentCallbacks({
      componentType: DesignSystemEventProviderComponentTypes.Button,
      componentId,
      analyticsEvents: analyticsEvents ?? [DesignSystemEventProviderAnalyticsEventTypes.OnClick],
    });

    return (
      <button
        onClick={(event) => {
          eventContext.onClick(event);
          onClick?.(event);
        }}
        css={{
          cursor: 'pointer',
          width: theme.general.heightSm,
          height: theme.general.heightSm,
          borderRadius: theme.legacyBorders.borderRadiusMd,
          lineHeight: theme.typography.lineHeightBase,
          padding: 0,
          border: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: pressed ? theme.colors.actionDefaultBackgroundPress : 'transparent',
          color: pressed ? theme.colors.actionDefaultTextPress : theme.colors.textSecondary,
          '&:hover': {
            background: theme.colors.actionDefaultBackgroundHover,
            color: theme.colors.actionDefaultTextHover,
          },
        }}
        ref={ref}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...remainingProps}
      >
        {icon}
      </button>
    );
  },
);

export { ToggleIconButton };
```

--------------------------------------------------------------------------------

---[FILE: TrimmedText.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/TrimmedText.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { TrimmedText } from './TrimmedText';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';

const trimmedTextDataTestId = 'trimmed-text';
const trimmedTextButtonDataTestId = 'trimmed-text-button';

const getDefaultTrimmedTextProps = (overrides = {}) => ({
  text: '0123456789',
  maxSize: 10,
  className: 'some class',
  allowShowMore: false,
  dataTestId: trimmedTextDataTestId,
  ...overrides,
});

describe('TrimmedText', () => {
  test.each([true, false])(
    'render normal text if length is less than or equal to max size when allowShowMore is %s',
    (allowShowMore) => {
      renderWithIntl(<TrimmedText {...getDefaultTrimmedTextProps({ allowShowMore: allowShowMore })} />);
      expect(screen.getByTestId(trimmedTextDataTestId)).toHaveTextContent('0123456789');
    },
  );

  test('render trimmed text if length is greater than max size', () => {
    renderWithIntl(<TrimmedText {...getDefaultTrimmedTextProps({ maxSize: 5 })} />);
    expect(screen.getByTestId(trimmedTextDataTestId)).toHaveTextContent('01234...');
    expect(screen.queryByTestId(trimmedTextButtonDataTestId)).not.toBeInTheDocument();
  });

  test('render show more button if configured', async () => {
    renderWithIntl(<TrimmedText {...getDefaultTrimmedTextProps({ maxSize: 5, allowShowMore: true })} />);

    const trimmedText = screen.getByTestId(trimmedTextDataTestId);
    const button = screen.getByTestId(trimmedTextButtonDataTestId);

    expect(trimmedText).toHaveTextContent('01234...');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('expand');

    await userEvent.click(button);

    expect(trimmedText).toHaveTextContent('0123456789');
    expect(button).toHaveTextContent('collapse');

    await userEvent.click(button);

    expect(trimmedText).toHaveTextContent('01234...');
    expect(button).toHaveTextContent('expand');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TrimmedText.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/TrimmedText.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { Button } from '@databricks/design-system';

type Props = {
  text: string;
  maxSize: number;
  className?: string;
  allowShowMore?: boolean;
  dataTestId?: string;
};

export const TrimmedText = ({ text, maxSize, className, allowShowMore = false, dataTestId }: Props) => {
  if (text.length <= maxSize) {
    return (
      <span className={className} data-testid={dataTestId}>
        {text}
      </span>
    );
  }
  const trimmedText = `${text.substr(0, maxSize)}...`;
  // Reported during ESLint upgrade
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showMore, setShowMore] = useState(false);
  return (
    <span className={className} data-testid={dataTestId}>
      {showMore ? text : trimmedText}
      {allowShowMore && (
        <Button
          componentId="codegen_mlflow_app_src_common_components_trimmedtext.tsx_30"
          type="link"
          onClick={() => setShowMore(!showMore)}
          size="small"
          css={styles.expandButton}
          data-testid="trimmed-text-button"
        >
          {showMore ? 'collapse' : 'expand'}
        </Button>
      )}
    </span>
  );
};

const styles = {
  expandButton: {
    display: 'inline-block',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: UnifiedTaggingForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/UnifiedTaggingForm.tsx

```typescript
import {
  useTagAssignmentForm,
  TagAssignmentRoot,
  TagAssignmentRow,
  TagAssignmentLabel,
  TagAssignmentKey,
  TagAssignmentValue,
  TagAssignmentRemoveButton,
} from '@databricks/web-shared/unified-tagging';
import type { UseFormReturn } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import type { KeyValueEntity } from '../types';

const keyProperty = 'key';
const valueProperty = 'value';

interface Props {
  name: string;
  form: UseFormReturn<any>;
  initialTags?: KeyValueEntity[];
}

/**
 * A component used for displaying the unified tagging form.
 */
export const UnifiedTaggingForm = ({ form, name, initialTags }: Props) => {
  const intl = useIntl();

  const tagsForm = useTagAssignmentForm({
    name,
    emptyValue: { key: '', value: '' },
    keyProperty,
    valueProperty,
    form,
    defaultValues: initialTags,
  });

  return (
    <TagAssignmentRoot {...tagsForm}>
      <TagAssignmentRow>
        <TagAssignmentLabel>
          <FormattedMessage defaultMessage="Key" description="Tag assignment modal > Key label" />
        </TagAssignmentLabel>
        <TagAssignmentLabel>
          <FormattedMessage defaultMessage="Value" description="Tag assignment modal > Value label" />
        </TagAssignmentLabel>
      </TagAssignmentRow>

      {tagsForm.fields.map((field, index) => {
        return (
          <TagAssignmentRow key={field.id}>
            <TagAssignmentKey
              index={index}
              rules={{
                validate: {
                  unique: (value) => {
                    const tags = tagsForm.getTagsValues();
                    if (tags?.findIndex((tag) => tag[keyProperty] === value) !== index) {
                      return intl.formatMessage({
                        defaultMessage: 'Key must be unique',
                        description: 'Error message for unique key in tag assignment modal',
                      });
                    }
                    return true;
                  },
                  required: (value) => {
                    const tags = tagsForm.getTagsValues();
                    if (tags?.at(index)?.[valueProperty] && !value) {
                      return intl.formatMessage({
                        defaultMessage: 'Key is required if value is present',
                        description: 'Error message for required key in tag assignment modal',
                      });
                    }
                    return true;
                  },
                },
              }}
            />
            <TagAssignmentValue index={index} />
            <TagAssignmentRemoveButton index={index} componentId="endpoint-tags-section.remove-button" />
          </TagAssignmentRow>
        );
      })}
    </TagAssignmentRoot>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AgGrid.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ag-grid/AgGrid.tsx

```typescript
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import type { AgGridReactProps, AgReactUiProps } from '@ag-grid-community/react/main';
import { AgGridReact } from '@ag-grid-community/react/main';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import { AgGridFontInjector } from './AgGridFontInjector';

/**
 * A local wrapper component that embeds imported AgGrid instance.
 * Extracted to a separate module to ensure that it will be in placed a single chunk.
 */
const MLFlowAgGrid = (props: AgGridReactProps | AgReactUiProps) => (
  <>
    <AgGridFontInjector />
    <AgGridReact modules={[ClientSideRowModelModule]} {...props} />
  </>
);

export default MLFlowAgGrid;
```

--------------------------------------------------------------------------------

---[FILE: AgGridFontInjector.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ag-grid/AgGridFontInjector.tsx
Signals: React

```typescript
import { useEffect, useRef } from 'react';

// eslint-disable-next-line max-len
const stylesContent = `@font-face { font-family: "agGridBalham"; src: url("data:application/font-woff;charset=utf-8;base64,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") format("woff"); font-weight: normal; font-style: normal; }`;

/**
 * Embedding agGrid inside shadow DOM imposes a problem with its embedded fonts
 * that are not being present on the main document level which results in erroneous
 * checkbox rendering. This components checks if the component is being rendered inside
 * shadow DOM part and if true, it reinjects the snapshotted agGrid styles later on.
 */
export const AgGridFontInjector = () => {
  const domElementReference = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (domElementReference.current && domElementReference.current.getRootNode() !== document) {
      const injectedStyleElement = document.createElement('style');
      injectedStyleElement.className = `ag-grid-snapshot-base-css`;
      injectedStyleElement.appendChild(document.createTextNode(stylesContent));
      document.head.appendChild(injectedStyleElement);

      return () => injectedStyleElement.remove();
    }

    return () => {};
  }, []);

  return <span ref={domElementReference} />;
};
```

--------------------------------------------------------------------------------

---[FILE: AgGridLoader.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ag-grid/AgGridLoader.tsx
Signals: React

```typescript
import type { AgGridReactProps, AgReactUiProps } from '@ag-grid-community/react';
import { Spinner } from '@databricks/design-system';
import React from 'react';

const MLFlowAgGridImpl = React.lazy(() => import('./AgGrid'));

/**
 * A simple loader that will lazily load MLflow's ag grid implementation.
 * Extracted to a separate module for testing purposes.
 */
export const MLFlowAgGridLoader = (props: AgGridReactProps | AgReactUiProps) => (
  <React.Suspense
    fallback={
      <div
        css={(cssTheme) => ({
          display: 'flex',
          justifyContent: 'center',
          margin: cssTheme.spacing.md,
        })}
      >
        <Spinner />
      </div>
    }
  >
    <MLFlowAgGridImpl {...props} />
  </React.Suspense>
);
```

--------------------------------------------------------------------------------

````
