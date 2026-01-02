---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 425
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 425 of 991)

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

---[FILE: useEditKeyValueTagsModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useEditKeyValueTagsModal.tsx
Signals: React

```typescript
import { isEqual, sortBy } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { truncate } from 'lodash';

import {
  Button,
  FormUI,
  Modal,
  PlusIcon,
  Popover,
  RHFControlledComponents,
  RestoreAntDDefaultClsPrefix,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { Typography } from '@databricks/design-system';
import type { KeyValueEntity } from '../types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { TagKeySelectDropdown } from '../components/TagSelectDropdown';
import { KeyValueTag } from '../components/KeyValueTag';
import { ErrorWrapper } from '../utils/ErrorWrapper';

function getTagsMap(tags: KeyValueEntity[]) {
  return new Map(tags.map((tag) => [tag.key, tag]));
}

/**
 * Provides methods to initialize and display modal used to add and remove tags from any compatible entity
 */
export const useEditKeyValueTagsModal = <T extends { tags?: KeyValueEntity[] }>({
  onSuccess,
  saveTagsHandler,
  allAvailableTags,
  valueRequired = false,
  title,
}: {
  onSuccess?: () => void;
  saveTagsHandler: (editedEntity: T, existingTags: KeyValueEntity[], newTags: KeyValueEntity[]) => Promise<any>;
  allAvailableTags?: string[];
  valueRequired?: boolean;
  title?: React.ReactNode;
}) => {
  const editedEntityRef = useRef<T>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme } = useDesignSystemTheme();

  const [initialTags, setInitialTags] = useState<Map<string, KeyValueEntity>>(new Map());
  const [finalTags, setFinalTags] = useState<Map<string, KeyValueEntity>>(new Map());

  const [showModal, setShowModal] = useState(false);

  const form = useForm<KeyValueEntity>({
    defaultValues: {
      key: undefined,
      value: '',
    },
  });

  const hideModal = () => setShowModal(false);

  /**
   * Function used to invoke the modal and start editing tags of the particular model version
   */
  const showEditTagsModal = useCallback(
    (editedEntity: T) => {
      editedEntityRef.current = editedEntity;
      setInitialTags(getTagsMap(editedEntity.tags || []));
      setFinalTags(getTagsMap(editedEntity.tags || []));
      form.reset();

      setShowModal(true);
    },
    [form],
  );

  const saveTags = async () => {
    if (!editedEntityRef.current) {
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    saveTagsHandler(editedEntityRef.current, Array.from(initialTags.values()), Array.from(finalTags.values()))
      .then(() => {
        hideModal();
        onSuccess?.();
        setIsLoading(false);
      })
      .catch((e: ErrorWrapper | Error) => {
        setIsLoading(false);
        setErrorMessage(e instanceof ErrorWrapper ? e.getUserVisibleError()?.message : e.message);
      });
  };

  const intl = useIntl();
  const formValues = form.watch();

  const [isLoading, setIsLoading] = useState(false);

  const hasNewValues = useMemo(
    () => !isEqual(sortBy(Array.from(initialTags.values()), 'key'), sortBy(Array.from(finalTags.values()), 'key')),
    [initialTags, finalTags],
  );
  const isDirty = formValues.key || formValues.value;
  const showPopoverMessage = hasNewValues && isDirty;

  const onKeyChangeCallback = (key: string | undefined) => {
    const tag = key ? finalTags.get(key) : undefined;
    /**
     * If a tag value exists for provided key, set the value to the existing tag value
     */
    form.setValue('value', tag?.value ?? '');
  };

  const handleTagDelete = ({ key }: KeyValueEntity) => {
    setFinalTags((currentFinalTags) => {
      currentFinalTags.delete(key);
      return new Map(currentFinalTags);
    });
  };

  const onSubmit = () => {
    // Do not accept form if no value provided while it's required
    if (valueRequired && !formValues.value.trim()) {
      return;
    }

    // Add new tag to existing tags leaving only one tag per key value
    const newEntries = new Map(finalTags);
    newEntries.set(formValues.key, formValues);

    setFinalTags(newEntries);
    form.reset();
  };

  const EditTagsModal = (
    <Modal
      componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_135"
      destroyOnClose
      visible={showModal}
      title={
        title ?? (
          <FormattedMessage
            defaultMessage="Add/Edit tags"
            description="Key-value tag editor modal > Title of the update tags modal"
          />
        )
      }
      onCancel={hideModal}
      footer={
        <RestoreAntDDefaultClsPrefix>
          <Button
            componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_147"
            dangerouslyUseFocusPseudoClass
            onClick={hideModal}
            /**
             * Hack: The footer will remove the margin to the save tags button
             * if the button if wrapped on another component.
             */
            css={{ marginRight: !hasNewValues ? theme.spacing.sm : 0 }}
          >
            {intl.formatMessage({
              defaultMessage: 'Cancel',
              description: 'Key-value tag editor modal > Manage Tag cancel button',
            })}
          </Button>
          {showPopoverMessage ? (
            <UnsavedTagPopoverTrigger formValues={formValues} isLoading={isLoading} onSaveTask={saveTags} />
          ) : (
            <Tooltip
              content={
                !hasNewValues
                  ? intl.formatMessage({
                      defaultMessage: 'Please add or remove one or more tags before saving',
                      description: 'Key-value tag editor modal > Tag disabled message',
                    })
                  : undefined
              }
              componentId="mlflow.common.hooks.useeditkeyvaluetagsmodal.tooltip"
            >
              <Button
                componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_174"
                dangerouslyUseFocusPseudoClass
                disabled={!hasNewValues}
                loading={isLoading}
                type="primary"
                onClick={saveTags}
              >
                {intl.formatMessage({
                  defaultMessage: 'Save tags',
                  description: 'Key-value tag editor modal > Manage Tag save button',
                })}
              </Button>
            </Tooltip>
          )}
        </RestoreAntDDefaultClsPrefix>
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        css={{ display: 'flex', alignItems: 'flex-end', gap: theme.spacing.md }}
      >
        <div css={{ minWidth: 0, display: 'flex', gap: theme.spacing.md, flex: 1 }}>
          <div css={{ flex: 1 }}>
            <FormUI.Label htmlFor="key">
              {intl.formatMessage({
                defaultMessage: 'Key',
                description: 'Key-value tag editor modal > Key input label',
              })}
            </FormUI.Label>
            <TagKeySelectDropdown
              allAvailableTags={allAvailableTags || []}
              control={form.control}
              onKeyChangeCallback={onKeyChangeCallback}
            />
          </div>
          <div css={{ flex: 1 }}>
            <FormUI.Label htmlFor="value">
              {valueRequired
                ? intl.formatMessage({
                    defaultMessage: 'Value',
                    description: 'Key-value tag editor modal > Value input label (required)',
                  })
                : intl.formatMessage({
                    defaultMessage: 'Value (optional)',
                    description: 'Key-value tag editor modal > Value input label',
                  })}
            </FormUI.Label>
            <RHFControlledComponents.Input
              componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_223"
              name="value"
              control={form.control}
              aria-label={
                valueRequired
                  ? intl.formatMessage({
                      defaultMessage: 'Value',
                      description: 'Key-value tag editor modal > Value input label (required)',
                    })
                  : intl.formatMessage({
                      defaultMessage: 'Value (optional)',
                      description: 'Key-value tag editor modal > Value input label',
                    })
              }
              placeholder={intl.formatMessage({
                defaultMessage: 'Type a value',
                description: 'Key-value tag editor modal > Value input placeholder',
              })}
            />
          </div>
        </div>
        <Tooltip
          content={intl.formatMessage({
            defaultMessage: 'Add tag',
            description: 'Key-value tag editor modal > Add tag button',
          })}
          componentId="mlflow.common.hooks.useeditkeyvaluetagsmodal.add-tag-tooltip"
        >
          <Button
            componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_248"
            htmlType="submit"
            aria-label={intl.formatMessage({
              defaultMessage: 'Add tag',
              description: 'Key-value tag editor modal > Add tag button',
            })}
          >
            <PlusIcon />
          </Button>
        </Tooltip>
      </form>
      {errorMessage && <FormUI.Message type="error" message={errorMessage} />}
      <div
        css={{
          display: 'flex',
          rowGap: theme.spacing.xs,
          flexWrap: 'wrap',
          marginTop: theme.spacing.sm,
        }}
      >
        {Array.from(finalTags.values()).map((tag) => (
          <KeyValueTag isClosable tag={tag} onClose={() => handleTagDelete(tag)} key={tag.key} />
        ))}
      </div>
    </Modal>
  );

  return { EditTagsModal, showEditTagsModal, isLoading };
};

function UnsavedTagPopoverTrigger({
  isLoading,
  formValues,
  onSaveTask,
}: {
  isLoading: boolean;
  formValues: any;
  onSaveTask: () => void;
}) {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const tagKeyDisplay = `${truncate(formValues.key, { length: 20 }) || '_'}`;
  const tagValueDisplay = formValues.value ? `:${truncate(formValues.value, { length: 20 })}` : '';
  const fullTagDisplay = `${tagKeyDisplay}${tagValueDisplay}`;

  const shownText = intl.formatMessage(
    {
      defaultMessage: 'Are you sure you want to save and close without adding "{tag}"',
      description: 'Key-value tag editor modal > Unsaved tag message',
    },
    {
      tag: fullTagDisplay,
    },
  );
  return (
    <Popover.Root componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_309">
      <Popover.Trigger asChild>
        <Button
          componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_306"
          dangerouslyUseFocusPseudoClass
          loading={isLoading}
          type="primary"
        >
          {intl.formatMessage({
            defaultMessage: 'Save tags',
            description: 'Key-value tag editor modal > Manage Tag save button',
          })}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" aria-label={shownText}>
        <Typography.Paragraph css={{ maxWidth: 400 }}>{shownText}</Typography.Paragraph>
        <Popover.Close asChild>
          <Button
            componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_316"
            onClick={onSaveTask}
          >
            {intl.formatMessage({
              defaultMessage: 'Yes, save and close',
              description: 'Key-value tag editor modal > Unsaved tag message > Yes, save and close button',
            })}
          </Button>
        </Popover.Close>
        <Popover.Close asChild>
          <Button
            componentId="codegen_mlflow_app_src_common_hooks_useeditkeyvaluetagsmodal.tsx_324"
            type="primary"
            css={{ marginLeft: theme.spacing.sm }}
          >
            {intl.formatMessage({
              defaultMessage: 'Cancel',
              description: 'Key-value tag editor modal > Unsaved tag message > cancel button',
            })}
          </Button>
        </Popover.Close>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: useIsTabActive.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useIsTabActive.tsx
Signals: React

```typescript
import { useEffect, useState } from 'react';

/**
 * Hook that returns whether the browser tab is active or not.
 * @returns true if the tab is active, false otherwise
 */
export const useIsTabActive = () => {
  const [isTabActive, setIsTabActive] = useState(document.visibilityState === 'visible');
  useEffect(() => {
    document.addEventListener('visibilitychange', (x) => {
      setIsTabActive(document.visibilityState === 'visible');
    });
  }, []);
  return isTabActive;
};
```

--------------------------------------------------------------------------------

---[FILE: useMemoDeep.ts]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useMemoDeep.ts
Signals: React

```typescript
import { isEqual } from 'lodash';
import { useRef } from 'react';

/**
 * Utility hook that memoizes value based on deep comparison.
 * Dedicated to a few limited use cases where deep comparison is still cheaper than resulting re-renders.
 */
export const useMemoDeep = <T>(factory: () => T, deps: unknown[]): T => {
  const ref = useRef<{ deps: unknown[]; value: T }>();

  if (!ref.current || !isEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
};
```

--------------------------------------------------------------------------------

---[FILE: useMLflowDarkTheme.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useMLflowDarkTheme.tsx
Signals: React

```typescript
import { Global } from '@emotion/react';
import { useEffect, useState } from 'react';

// bundled JS needs to read this key in order to enable dark mode
const databricksDarkModePrefLocalStorageKey = 'databricks-dark-mode-pref';
const darkModePrefLocalStorageKey = '_mlflow_dark_mode_toggle_enabled';
const darkModeBodyClassName = 'dark-mode';

// CSS attributes to be applied when dark mode is enabled. Affects inputs and other form elements.
const darkModeCSSStyles = { body: { [`&.${darkModeBodyClassName}`]: { colorScheme: 'dark' } } };
// This component is used to set the global CSS.
const DarkModeStylesComponent = () => <Global styles={darkModeCSSStyles} />;

/**
 * This hook is used to toggle the dark mode for the entire app.
 * Used in open source MLflow.
 * Returns a boolean value with the current state, setter function, and a component to be rendered in the root of the app.
 */
export const useMLflowDarkTheme = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.ComponentType<React.PropsWithChildren<unknown>>,
] => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // If the user has explicitly set a preference, use that.
    const darkModePref = localStorage.getItem(darkModePrefLocalStorageKey);
    if (darkModePref !== null) {
      return darkModePref === 'true';
    }
    // Otherwise, use the system preference as a default.
    return window.matchMedia('(prefers-color-scheme: dark)').matches || false;
  });

  useEffect(() => {
    // Update the theme when the user changes their system preference.
    document.body.classList.toggle(darkModeBodyClassName, isDarkTheme);
    // Persist the user's preference in local storage.
    localStorage.setItem(darkModePrefLocalStorageKey, isDarkTheme ? 'true' : 'false');
    localStorage.setItem(databricksDarkModePrefLocalStorageKey, isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return [isDarkTheme, setIsDarkTheme, DarkModeStylesComponent];
};
```

--------------------------------------------------------------------------------

---[FILE: useSafeDeferredValue.ts]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useSafeDeferredValue.ts
Signals: React

```typescript
import { identity, isFunction } from 'lodash';
import React from 'react';

/**
 * A safe version of `useDeferredValue` that falls back to identity (A->A) if `useDeferredValue` is not supported
 * by current React version.
 */
export const useSafeDeferredValue: <T>(value: T) => T =
  'useDeferredValue' in React && isFunction(React.useDeferredValue) ? React.useDeferredValue : identity;
```

--------------------------------------------------------------------------------

---[FILE: useScrollToBottom.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useScrollToBottom.tsx
Signals: React

```typescript
import { useCallback, useRef } from 'react';

// If we're within threshold px of the bottom, auto-scroll
const THRESHOLD_PX = 32;

/**
 * Custom hook to manage auto-scrolling to the bottom of a container
 * when new content is added, if the user is already near the bottom.
 */
export const useScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const scrollDistanceToBottom = useRef(0);

  const handleScroll = useCallback(() => {
    if (elementRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = elementRef.current;
      // Remember scroll distance to the bottom
      scrollDistanceToBottom.current = scrollHeight - (scrollTop + clientHeight);
    }
  }, []);

  const tryScrollToBottom = useCallback(() => {
    if (elementRef.current && scrollDistanceToBottom.current < THRESHOLD_PX) {
      elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }
  }, []);

  return { elementRef, handleScroll, tryScrollToBottom };
};
```

--------------------------------------------------------------------------------

---[FILE: useTagAssignmentModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useTagAssignmentModal.test.tsx

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';

import type { TagAssignmentModalParams } from './useTagAssignmentModal';
import { useTagAssignmentModal } from './useTagAssignmentModal';
import type { KeyValueEntity } from '../types';
import { DesignSystemProvider } from '@databricks/design-system';
import { waitFor, screen } from '@testing-library/react';
import { renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

describe('useTagAssignmentModal', () => {
  function renderTestComponent(params: Partial<TagAssignmentModalParams> = {}) {
    function TestComponent() {
      const { TagAssignmentModal, showTagAssignmentModal } = useTagAssignmentModal({
        componentIdPrefix: 'test',
        onSubmit: () => Promise.resolve(),
        ...params,
      });

      return (
        <>
          <button onClick={showTagAssignmentModal}>Open Modal</button>
          {TagAssignmentModal}
        </>
      );
    }

    return renderWithIntl(
      <DesignSystemProvider>
        <TestComponent />
      </DesignSystemProvider>,
    );
  }

  test('should call onSubmit with new tags when adding a tag', async () => {
    const mockOnSubmit = jest.fn<any>(() => Promise.resolve());
    renderTestComponent({ onSubmit: mockOnSubmit });

    await userEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

    // Find the first key input and type a tag key
    const keyInputs = screen.getAllByRole('textbox');
    await userEvent.type(keyInputs[0], 'newTag');

    // Find the value input (should be the second textbox)
    await userEvent.type(keyInputs[1], 'newValue');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        [{ key: 'newTag', value: 'newValue' }], // newTags
        [], // deletedTags
      );
    });
  });

  test('should not include edited tags in deletedTags when only the value changes', async () => {
    const initialTags: KeyValueEntity[] = [{ key: 'tagToEdit', value: 'oldValue' }];

    const mockOnSubmit = jest.fn<any>(() => Promise.resolve());
    renderTestComponent({ initialTags, onSubmit: mockOnSubmit });

    await userEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

    // Find the value input and change it
    const inputs = screen.getAllByRole('textbox');
    const valueInput = inputs[1]; // Second input should be the value

    // Clear and type new value
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, 'newValue');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        [{ key: 'tagToEdit', value: 'newValue' }], // newTags - should include the edited tag
        [], // deletedTags - should be empty because key is not deleted, just value changed
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useTagAssignmentModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useTagAssignmentModal.tsx
Signals: React

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Alert, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import type { FieldValues } from 'react-hook-form';
import type { KeyValueEntity } from '../types';
import { UnifiedTaggingForm } from '../components/UnifiedTaggingForm';
import { useMemoDeep } from './useMemoDeep';

interface Params {
  componentIdPrefix: string;
  title?: React.ReactNode;
  isLoading?: boolean;
  visible?: boolean;
  initialTags?: KeyValueEntity[];
  error?: string;
  onSubmit: (newTags: KeyValueEntity[], deletedTags: KeyValueEntity[]) => Promise<any>;
  onSuccess?: () => void;
  onClose?: () => void;
}

const keyProperty = 'key' as const;
const valueProperty = 'value' as const;
const formName = 'tags';

const emptyValue = { key: '', value: '' };

export const useTagAssignmentModal = ({
  componentIdPrefix,
  title,
  visible,
  initialTags,
  isLoading = false,
  error,
  onSubmit,
  onSuccess,
  onClose,
}: Params) => {
  const baseComponentId = `${componentIdPrefix}.tag-assignment-modal`;

  const memoizedInitialTags = useMemoDeep(() => initialTags, [initialTags]);

  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useDesignSystemTheme();
  const form = useForm<{ tags: KeyValueEntity[] }>({ mode: 'onChange' });

  const showTagAssignmentModal = () => {
    setIsVisible(true);
  };

  const hideTagAssignmentModal = () => {
    setIsVisible(false);
    form.reset({ [formName]: [emptyValue] });
    onClose?.();
  };

  const handleSubmit = (data: FieldValues) => {
    const tags: KeyValueEntity[] = data[formName].filter((tag: FieldValues) => Boolean(tag[keyProperty]));

    // Find tags that are new (not in initialTags at all based on key) or updated (key exists but value changed)
    const newTags =
      tags.filter(
        (tag) =>
          !initialTags?.some((t) => t[keyProperty] === tag[keyProperty] && t[valueProperty] === tag[valueProperty]),
      ) ?? [];

    // Find tags that were deleted (in initialTags but not in current tags based on key)
    const deletedTags = initialTags?.filter((tag) => !tags.some((t) => t[keyProperty] === tag[keyProperty])) ?? [];

    onSubmit(newTags, deletedTags).then(() => {
      hideTagAssignmentModal();
      onSuccess?.();
    });
  };

  const defaultTitleNode = (
    <FormattedMessage defaultMessage="Add tags" description="Tag assignment modal > Title of the add tags modal" />
  );

  const TagAssignmentModal = (
    <Modal
      componentId={`${baseComponentId}`}
      title={title ?? defaultTitleNode}
      visible={visible ?? isVisible}
      destroyOnClose
      onCancel={hideTagAssignmentModal}
      footer={
        <>
          <Button
            componentId={`${baseComponentId}.submit-button`}
            onClick={hideTagAssignmentModal}
            disabled={isLoading}
          >
            <FormattedMessage defaultMessage="Cancel" description="Tag assignment modal > Cancel button" />
          </Button>
          <Button
            componentId={`${baseComponentId}.submit-button`}
            type="primary"
            onClick={form.handleSubmit(handleSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            <FormattedMessage defaultMessage="Save" description="Tag assignment modal > Save button" />
          </Button>
        </>
      }
    >
      {error && (
        <Alert
          type="error"
          message={error}
          componentId={`${baseComponentId}.error`}
          closable={false}
          css={{ marginBottom: theme.spacing.sm }}
        />
      )}
      <UnifiedTaggingForm name={formName} form={form} initialTags={memoizedInitialTags} />
    </Modal>
  );

  return {
    TagAssignmentModal,
    showTagAssignmentModal,
    hideTagAssignmentModal,
  };
};

export type { Params as TagAssignmentModalParams };
```

--------------------------------------------------------------------------------

---[FILE: ModelBuilder.ts]---
Location: mlflow-master/mlflow/server/js/src/common/sdk/ModelBuilder.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class ModelBuilder {
  /**
   * @param {Immutable.Record schema} AnemicRecord: generated Immutable Record
   * @param {Object<string, func>} prototypeFuncs: functions to add to
   *   AnemicRecord's prototype
   */
  static extend(AnemicRecord: any, prototypeFuncs: any) {
    const FatRecord = class FatRecord extends AnemicRecord {};
    Object.keys(prototypeFuncs).forEach((funcName) => {
      if (FatRecord.prototype[funcName]) {
        throw new Error(`Duplicate prototype function: ${funcName} already exists on the model.`);
      }
      FatRecord.prototype[funcName] = prototypeFuncs[funcName];
    });

    return FatRecord;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RecordUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/sdk/RecordUtils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class RecordUtils {
  /**
   * This function is our implementation of Immutable.fromJS, but fixes a bug with
   * their implementation.
   * @param {object} pojo - a javascript object that we want to convert to an
   *   Immutable Record
   * @param {function} fromJsReviver - a function that takes a key and value
   *   and returns the value as an Immutable object, based on the key
   * @return {object} still a plain javascript object, but all the nested objects
   *   have already been converted to Immutable types so you can do:
   *     new RecordType(RecordUtils.fromJs({...}, RecordType.fromJsReviver));
   *   to create an Immutable Record with nested Immutables.
   */
  static fromJs(pojo: any, fromJsReviver: any) {
    const record = {};
    for (const key in pojo) {
      // don't convert keys with undefined value
      if (pojo.hasOwnProperty(key) && pojo[key] !== undefined) {
        // Record an event when the value is null, since if it's null and we still create the
        // object, it might cause some bug CJ-18735
        if (pojo[key] === null) {
          (window as any).recordEvent(
            'clientsideEvent',
            {
              eventType: 'nullValueForNestedProto',
              property: key,
            },
            pojo,
          );
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        record[key] = fromJsReviver(key, pojo[key]);
      }
    }
    return record;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: 404-overflow.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/404-overflow.svg

```text
<?xml version="1.0" encoding="UTF-8"?>
<svg width="346px" height="197px" viewBox="0 0 346 197" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 52 (66869) - http://www.bohemiancoding.com/sketch -->
    <title>404_overflow</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <circle id="path-1" cx="57.5" cy="57.5" r="57.5"></circle>
        <filter x="-6.1%" y="-4.3%" width="112.2%" height="112.2%" filterUnits="objectBoundingBox" id="filter-2">
            <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feMorphology radius="8" operator="erode" in="SourceAlpha" result="shadowInner"></feMorphology>
            <feOffset dx="0" dy="2" in="shadowInner" result="shadowInner"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="shadowInner" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0.031372549   0 0 0 0 0.129411765   0 0 0 0 0.258823529  0 0 0 0.24 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
    </defs>
    <g id="404" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-547.000000, -251.000000)" id="404_overflow">
            <g transform="translate(547.000000, 253.000000)">
                <path d="M50.24,76.44 L50.24,20.92 L49.92,20.92 L12.16,76.44 L50.24,76.44 Z M63.04,76.44 L78.4,76.44 L78.4,88.44 L63.04,88.44 L63.04,115 L50.24,115 L50.24,88.44 L0.48,88.44 L0.48,75.32 L52.16,1.56 L63.04,1.56 L63.04,76.44 Z M317.12,76.44 L317.12,20.92 L316.8,20.92 L279.04,76.44 L317.12,76.44 Z M329.92,76.44 L345.28,76.44 L345.28,88.44 L329.92,88.44 L329.92,115 L317.12,115 L317.12,88.44 L267.36,88.44 L267.36,75.32 L319.04,1.56 L329.92,1.56 L329.92,76.44 Z" id="4-4" fill="#082142"></path>
                <g id="Group" transform="translate(117.000000, 0.000000)">
                    <path d="M0.0801745244,57 C4.84697407,61.6666667 9.61377361,64 14.3805732,64 C19.1473727,64 23.9141722,61.6666667 28.6809718,57 C33.4477713,61.6666667 38.2145709,64 42.9813704,64 C47.74817,64 52.5149695,61.6666667 57.281769,57 C62.0485686,61.6666667 66.8153681,64 71.5821677,64 C76.3489672,64 81.1157668,61.6666667 85.8825663,57 C90.6493658,61.6666667 95.4161654,64 100.182965,64 C104.949764,64 109.716564,61.6666667 114.483364,57 L114.483364,168.52833 C114.483364,172.127473 111.565682,175.045154 107.96654,175.045154 L107.96654,175.045154 C104.367397,175.045154 101.449716,172.127473 101.449716,168.52833 L101.449716,133.219241 C101.449716,129.796312 98.6748836,127.02148 95.2519544,127.02148 L95.2519544,127.02148 C91.8290251,127.02148 89.0541927,129.796312 89.0541927,133.219241 L89.0541927,188.76149 C89.0541927,191.673526 86.6935218,194.034196 83.7814867,194.034196 L83.7814867,194.034196 C80.8694516,194.034196 78.5087807,191.673526 78.5087807,188.76149 L78.5087807,122.676113 C78.5087807,119.337992 75.8026994,116.631911 72.464579,116.631911 L72.464579,116.631911 C69.1264586,116.631911 66.4203773,119.337992 66.4203773,122.676113 L66.4203773,136.693606 C66.4203773,140.432611 63.3893149,143.463674 59.6503099,143.463674 L59.6503099,143.463674 C55.9113048,143.463674 52.8802424,140.432611 52.8802424,136.693606 L52.8802424,120.764573 C52.8802424,117.295796 50.0682437,114.483798 46.5994674,114.483798 L46.5994674,114.483798 C43.1306912,114.483798 40.3186925,117.295796 40.3186925,120.764573 L40.3186925,144.581254 C40.3186925,147.672796 37.8125029,150.178985 34.7209615,150.178985 L34.7209615,150.178985 C31.62942,150.178985 29.1232304,147.672796 29.1232304,144.581254 L29.1232304,117.793016 C29.1232304,114.135428 26.15817,111.170368 22.5005825,111.170368 L19.7347109,111.170368 C17.6046722,111.170368 15.8779346,112.897105 15.8779346,115.027144 L15.8779346,115.027144 C15.8779346,117.157183 14.151197,118.88392 12.0211583,118.88392 L11.3556643,118.88392 C8.78242431,118.88392 6.62195706,116.946393 6.34280382,114.388339 L0.0801745244,57 Z" id="Path-3" fill="#43C8EC"></path>
                    <rect id="Rectangle" fill="#43C8EC" x="7" y="123" width="10" height="20" rx="4.5"></rect>
                    <g id="Oval">
                        <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                        <circle stroke="#082142" stroke-width="8" stroke-linejoin="square" cx="57.5" cy="57.5" r="53.5"></circle>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: accelerated-tag.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/accelerated-tag.svg

```text
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="20" rx="4" fill="#8A63BF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.3042 3.03469C11.5707 3.12491 11.75 3.37495 11.75 3.65629V8.25004L14.5938 8.25004C14.8434 8.25004 15.0715 8.39172 15.1821 8.61555C15.2927 8.83939 15.2667 9.1066 15.1151 9.30493L9.42755 16.7424C9.25665 16.9659 8.96231 17.0556 8.69582 16.9654C8.42934 16.8752 8.25 16.6251 8.25 16.3438L8.25001 11.75H5.40625C5.15658 11.75 4.92853 11.6084 4.81792 11.3845C4.70731 11.1607 4.73329 10.8935 4.88496 10.6952L10.5725 3.25765C10.7434 3.03417 11.0377 2.94448 11.3042 3.03469ZM6.73423 10.4375H8.90625C9.0803 10.4375 9.24722 10.5067 9.37029 10.6298C9.49336 10.7528 9.5625 10.9197 9.5625 11.0938V14.4053L13.2658 9.56254L11.0938 9.56254C10.7313 9.56254 10.4375 9.26873 10.4375 8.90629V5.5948L6.73423 10.4375Z" fill="white"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: chart-bar.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/chart-bar.svg

```text
<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 0.813599V15.1865H17" stroke="#A3AEB8" stroke-linecap="round"/>
<rect x="3.16943" y="10.5763" width="2.16949" height="3.25424" fill="#338ECC"/>
<rect x="6.42371" y="5.15259" width="2.16949" height="8.67797" fill="#338ECC"/>
<rect x="9.67798" y="8.40686" width="2.16949" height="5.42373" fill="#338ECC"/>
<rect x="12.9323" y="1.89832" width="2.16949" height="11.9322" fill="#338ECC"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: chart-contour.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/chart-contour.svg

```text
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1V17H17" stroke="#A3AEB8" stroke-linecap="round"/>
<path d="M12.9749 4.94148C12.9188 4.71702 12.221 4.73284 12.0618 4.71515C11.1779 4.61693 10.2817 4.66052 9.39271 4.66052C8.11919 4.66052 7.15648 4.97961 6.24753 5.90922C5.86197 6.30355 5.5235 6.77684 5.23295 7.24378C4.99434 7.62726 4.65544 7.93479 4.40569 8.31299C3.93777 9.02154 3.56281 9.80723 3.56281 10.6699C3.56281 11.1806 3.37479 11.598 3.76962 12.0669C4.19449 12.5714 4.6863 12.9507 5.27978 13.2649C5.88594 13.5858 6.42202 13.8619 7.13723 13.8619C7.74338 13.8619 8.34952 13.8619 8.95567 13.8619C9.45735 13.8619 9.96042 13.8731 10.4619 13.8619C11.1412 13.8468 11.9484 13.1895 12.413 12.7381C13.581 11.6035 14.2393 9.88016 14.2393 8.24665C14.2393 7.69923 14.3797 7.17063 14.3797 6.62723C14.3797 6.40084 14.4779 5.87696 14.2744 5.71411C13.9268 5.43606 13.5785 5.13789 13.1857 4.94148" stroke="#338ECC" stroke-linecap="round"/>
<path d="M11.9213 6.83789C11.2761 6.83789 10.6309 6.83789 9.98577 6.83789C9.19776 6.83789 8.80182 7.44144 8.2844 7.97734C7.58163 8.70521 7.28544 9.67306 7.28544 10.666C7.28544 10.9641 7.22004 11.177 7.46104 11.3645C7.6831 11.5372 8.10719 11.6142 8.37806 11.6142C9.07316 11.6142 9.91042 11.5583 10.4462 11.0523C10.9277 10.5975 11.473 10.3701 11.8159 9.75284C12.045 9.34042 12.2022 8.86324 12.2022 8.38317C12.2022 8.14903 12.2022 7.9149 12.2022 7.68077C12.2022 7.4241 12.0208 7.38817 11.9213 7.18909" stroke="#338ECC" stroke-linecap="round"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: chart-difference.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/chart-difference.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="2" width="4" height="1" fill="#338ECC"/>
<rect x="5" y="2" width="4" height="1" fill="#338ECC"/>
<rect x="10" y="2" width="4" height="1" fill="#338ECC"/>
<rect y="4" width="4" height="1" fill="#338ECC"/>
<rect x="5" y="4" width="4" height="1" fill="#338ECC"/>
<rect x="10" y="4" width="4" height="1" fill="#338ECC"/>
<rect y="6" width="4" height="1" fill="#D9D9D9"/>
<rect x="5" y="6" width="4" height="1" fill="#D9D9D9"/>
<rect x="10" y="6" width="4" height="1" fill="#D9D9D9"/>
<rect y="8" width="4" height="1" fill="#D9D9D9"/>
<rect x="5" y="8" width="4" height="1" fill="#D9D9D9"/>
<rect x="10" y="8" width="4" height="1" fill="#D9D9D9"/>
<rect y="10" width="4" height="1" fill="#D9D9D9"/>
<rect x="5" y="10" width="4" height="1" fill="#D9D9D9"/>
<rect x="10" y="10" width="4" height="1" fill="#D9D9D9"/>
<rect y="12" width="4" height="1" fill="#D9D9D9"/>
<rect x="5" y="12" width="4" height="1" fill="#D9D9D9"/>
<rect x="10" y="12" width="4" height="1" fill="#D9D9D9"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: chart-image.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/chart-image.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" stroke="#C4C4C4"/>
<line x1="8.5" y1="0.800049" x2="8.5" y2="16" stroke="#C4C4C4"/>
<line x1="16" y1="5.69995" x2="-2.63656e-08" y2="5.69995" stroke="#C4C4C4"/>
<line x1="16" y1="10.9" x2="-2.63656e-08" y2="10.9" stroke="#C4C4C4"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: chart-line.svg]---
Location: mlflow-master/mlflow/server/js/src/common/static/chart-line.svg

```text
<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.38977 15.717L8.79655 10.8113L12.5254 14.9622L19.644 7.03772" stroke="#338ECC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 1V21H21" stroke="#A3AEB8" stroke-linecap="round"/>
</svg>
```

--------------------------------------------------------------------------------

````
