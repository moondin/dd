---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 424
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 424 of 991)

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

---[FILE: useDragAndDropElement.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useDragAndDropElement.tsx
Signals: React

```typescript
// eslint-disable-next-line import/no-extraneous-dependencies
import { type DragDropManager, createDragDropManager } from 'dnd-core';
import { useLayoutEffect, useRef, useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export interface useDragAndDropElementProps {
  /**
   * Unique drag element identifier, used in drop events
   */
  dragKey: string;
  /**
   * Group key - items are droppable only within a single group
   */
  dragGroupKey: string;
  /**
   * Callback function, conveys both dragged and target element key
   */
  onDrop: (draggedKey: string, targetDropKey: string) => void;

  /**
   * If true, drag and drop will be disabled
   */
  disabled?: boolean;
}

interface DraggedItem {
  key: string;
  groupKey: string;
}

/**
 * A hook enabling drag-and-drop capabilities for any component.
 * Used component will serve as both DnD source and target.
 */
export const useDragAndDropElement = ({
  dragGroupKey,
  dragKey,
  onDrop,
  disabled = false,
}: useDragAndDropElementProps) => {
  const dropListener = useRef(onDrop);

  dropListener.current = onDrop;

  const [{ isOver, draggedItem }, dropTargetRef] = useDrop<
    DraggedItem,
    never,
    { isOver: boolean; draggedItem: DraggedItem }
  >(
    {
      canDrop: () => !disabled,
      accept: `dnd-${dragGroupKey}`,
      drop: ({ key: sourceKey }: { key: string }, monitor) => {
        if (sourceKey === dragKey || monitor.didDrop()) {
          return;
        }
        dropListener.current(sourceKey, dragKey);
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }), draggedItem: monitor.getItem() }),
    },
    [disabled, dragGroupKey, dragKey],
  );

  const [{ isDragging }, dragHandleRef, dragPreviewRef] = useDrag(
    {
      canDrag: () => !disabled,
      type: `dnd-${dragGroupKey}`,
      item: { key: dragKey, groupKey: dragGroupKey },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [disabled, dragGroupKey, dragKey],
  );

  const isDraggingOtherGroup = Boolean(draggedItem && draggedItem.groupKey !== dragGroupKey);

  return { dropTargetRef, dragHandleRef, dragPreviewRef, isDragging, isOver, isDraggingOtherGroup };
};

/**
 * Create a scoped DndProvider that will limit its functionality to a single root element.
 * It should prevent HTML5Backend collisions, see:
 * https://github.com/react-dnd/react-dnd/blob/7c88c37489a53b5ac98699c46a506a8e085f1c03/packages/backend-html5/src/HTML5BackendImpl.ts#L107-L109
 */
export const DragAndDropProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const rootElementRef = useRef<HTMLDivElement>(null);
  const [manager, setManager] = useState<DragDropManager | null>(null);

  useLayoutEffect(() => {
    const rootElement = rootElementRef.current;
    const dragDropManager = createDragDropManager(HTML5Backend, undefined, { rootElement });
    setManager(dragDropManager);
    return () => {
      dragDropManager.getBackend().teardown();
    };
  }, []);

  return (
    <div css={{ display: 'contents' }} ref={rootElementRef}>
      {manager && <DndProvider manager={manager}>{children}</DndProvider>}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useEditAliasesModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useEditAliasesModal.test.tsx

```typescript
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import userEventGlobal, { PointerEventsCheckLevel } from '@testing-library/user-event';

import { useEditAliasesModal } from './useEditAliasesModal';
import type { ModelEntity } from '../../experiment-tracking/types';
import {
  fastFillInput,
  findAntdOptionContaining,
  renderWithIntl,
  type RenderResult,
} from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { ErrorWrapper } from '../utils/ErrorWrapper';

const MOCK_MODEL = {
  name: 'test-model',
  aliases: [
    { alias: 'champion', version: '1' },
    { alias: 'challenger', version: '2' },
    { alias: 'latest', version: '2' },
  ],
};

const MOCK_MODEL_MANY_ALIASES = {
  name: 'test-model',
  aliases: [
    { alias: 'champion1', version: '1' },
    { alias: 'champion2', version: '1' },
    { alias: 'champion3', version: '1' },
    { alias: 'champion4', version: '1' },
    { alias: 'champion5', version: '1' },
    { alias: 'champion6', version: '1' },
    { alias: 'champion7', version: '1' },
    { alias: 'champion8', version: '1' },
    { alias: 'champion9', version: '1' },
    { alias: 'champion10', version: '1' },
    { alias: 'challenger', version: '2' },
  ],
};

const handleSave = jest.fn<Parameters<typeof useEditAliasesModal>[0]['onSave']>(
  () => new Promise((resolve) => resolve),
);

describe('useEditAliasesModal', () => {
  let userEvent: ReturnType<typeof userEventGlobal.setup>;

  beforeEach(() => {
    // Remove pointer event check otherwise there's some div that and pointer-events: none that blocks clicks
    userEvent = userEventGlobal.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderComponentWithHook = (model: Partial<ModelEntity> = {}, onSuccess = () => {}) => {
    const TestComponent = () => {
      const { EditAliasesModal, showEditAliasesModal } = useEditAliasesModal({
        aliases: model.aliases ?? [],
        onSuccess,
        onSave: handleSave,
        getTitle: (version: string) => <h1>Title</h1>,
        description: <p>Description</p>,
      });
      return (
        <div>
          <button onClick={() => showEditAliasesModal('1')}>edit version 1 aliases</button>
          <button onClick={() => showEditAliasesModal('2')}>edit version 2 aliases</button>
          {EditAliasesModal}
        </div>
      );
    };

    return renderWithIntl(<TestComponent />);
  };

  const findOption = (scope: RenderResult, text: string) =>
    scope.getAllByTestId('model-alias-option').find(({ textContent }) => textContent?.includes(text)) as HTMLElement;

  test('should initialize and render modal with properly displayed tags', async () => {
    const component = renderComponentWithHook(MOCK_MODEL);

    await userEvent.click(component.getByText('edit version 1 aliases'));

    expect(component.getByRole('status', { name: 'champion' })).toBeInTheDocument();

    await userEvent.click(component.getByText('Cancel'));

    await userEvent.click(component.getByText('edit version 2 aliases'));

    expect(component.getByRole('status', { name: 'challenger' })).toBeInTheDocument();
    expect(component.getByRole('status', { name: 'latest' })).toBeInTheDocument();
  });

  test('should display warning for conflicting aliases', async () => {
    const component = renderComponentWithHook(MOCK_MODEL);

    await userEvent.click(component.getByText('edit version 1 aliases'));

    expect(component.getByTitle('champion')).toBeInTheDocument();

    await userEvent.click(component.getByRole('combobox'));

    await userEvent.type(component.getByRole('combobox'), 'challenger');
    await userEvent.click(await findOption(component, 'challenger'));

    expect(
      component.getByText(
        'The "challenger" alias is also being used on version 2. Adding it to this version will remove it from version 2.',
      ),
    ).toBeInTheDocument();
  });

  test('should select a new alias', async () => {
    const component = renderComponentWithHook(MOCK_MODEL);

    await userEvent.click(component.getByText('edit version 1 aliases'));

    expect(component.getByTitle('champion')).toBeInTheDocument();

    await userEvent.click(component.getByRole('combobox'));

    await fastFillInput(component.getByRole('combobox') as HTMLInputElement, 'new_alias_for_v1');
    await userEvent.click(await findAntdOptionContaining('new_alias_for_v1'));

    expect(component.getByRole('status', { name: 'champion' })).toBeInTheDocument();
    expect(component.getByRole('status', { name: 'new_alias_for_v1' })).toBeInTheDocument();
  });

  test('should not be able to add too many aliases', async () => {
    const component = renderComponentWithHook(MOCK_MODEL_MANY_ALIASES);

    await userEvent.click(component.getByText('edit version 1 aliases'));
    await userEvent.click(component.getByRole('combobox'));
    await userEvent.click(findOption(component, 'challenger'));

    expect(component.getByText(/You are exceeding a limit of \d+ aliases/)).toBeInTheDocument();
    expect(component.getByRole('button', { name: 'Save aliases' })).toBeDisabled();
  });

  test('should invoke proper API requests for adding and removing aliases', async () => {
    const component = renderComponentWithHook(MOCK_MODEL);

    await userEvent.click(component.getByText('edit version 1 aliases'));

    expect(component.getByTitle('champion')).toBeInTheDocument();

    expect(component.getByRole('button', { name: 'Save aliases' })).toBeDisabled();

    await userEvent.click(component.getByRole('combobox'));
    await userEvent.click(findOption(component, 'champion'));
    await userEvent.click(findOption(component, 'challenger'));

    await userEvent.click(component.getByText('Save aliases'));

    expect(handleSave).toHaveBeenCalledWith('1', ['champion'], ['challenger']);
  });

  test('should display error message on failure', async () => {
    handleSave.mockRejectedValue(new ErrorWrapper({ message: 'some error message' }, 500));

    const component = renderComponentWithHook(MOCK_MODEL);

    await userEvent.click(component.getByText('edit version 1 aliases'));

    await userEvent.click(component.getByRole('combobox'));
    await userEvent.click(findOption(component, 'challenger'));

    await userEvent.click(component.getByText('Save aliases'));

    expect(await component.findByText(/some error message/)).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEditAliasesModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useEditAliasesModal.tsx
Signals: React

```typescript
import { isEqual } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

import { Alert, Button, LegacyForm, Modal, useDesignSystemTheme } from '@databricks/design-system';
import { Typography } from '@databricks/design-system';
import { AliasSelect } from '../components/AliasSelect';
import { FormattedMessage } from 'react-intl';

import { ErrorWrapper } from '../utils/ErrorWrapper';
import type { AliasMap } from '../types';

const MAX_ALIASES_PER_MODEL_VERSION = 10;

/**
 * Provides methods to initialize and display modal used to add and remove aliases from the model version
 */
export const useEditAliasesModal = ({
  aliases,
  onSuccess,
  onSave,
  getTitle,
  description,
}: {
  aliases: AliasMap;
  onSuccess?: () => void;
  onSave: (currentlyEditedVersion: string, existingAliases: string[], draftAliases: string[]) => Promise<any>;
  getTitle: (version: string) => React.ReactNode;
  description?: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = LegacyForm.useForm();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme } = useDesignSystemTheme();

  // We will keep version's existing aliases in `existingAliases` state array
  const [existingAliases, setExistingAliases] = useState<string[]>([]);
  // Currently edited aliases will be kept in `draftAliases` state array
  const [draftAliases, setDraftAliases] = useState<string[]>([]);
  // Currently edited version
  const [currentlyEditedVersion, setCurrentlyEditedVersion] = useState<string>('0');

  /**
   * Function used to invoke the modal and start editing aliases of the particular model version
   */
  const showEditAliasesModal = useCallback(
    (versionNumber: string) => {
      const modelVersionAliases =
        aliases.filter(({ version }) => version === versionNumber).map(({ alias }) => alias) || [];

      if (versionNumber) {
        setExistingAliases(modelVersionAliases);
        setDraftAliases(modelVersionAliases);
        setCurrentlyEditedVersion(versionNumber);
        setShowModal(true);
      }
    },
    [aliases],
  );

  // // Finds and stores alias values found in other model versions
  const conflictedAliases = useMemo(() => {
    const versionsWithAliases = aliases.reduce<{ version: string; aliases: string[] }[]>((aliasMap, aliasEntry) => {
      if (!aliasMap.some(({ version }) => version === aliasEntry.version)) {
        return [...aliasMap, { version: aliasEntry.version, aliases: [aliasEntry.alias] }];
      }
      aliasMap.find(({ version }) => version === aliasEntry.version)?.aliases.push(aliasEntry.alias);
      return aliasMap;
    }, []);
    const otherVersionMappings = versionsWithAliases.filter(
      ({ version: otherVersion }) => otherVersion !== currentlyEditedVersion,
    );
    return draftAliases
      .map((alias) => ({
        alias,
        otherVersion: otherVersionMappings.find((version) =>
          version.aliases?.find((alias_name) => alias_name === alias),
        ),
      }))
      .filter(({ otherVersion }) => otherVersion);
  }, [aliases, draftAliases, currentlyEditedVersion]);

  // Maps particular aliases to versions
  const aliasToVersionMap = useMemo(
    () =>
      aliases.reduce<Record<string, string>>((result, { alias, version }) => {
        return { ...result, [alias]: version };
      }, {}) || {},
    [aliases],
  );

  const save = () => {
    setErrorMessage('');
    setIsLoading(true);
    onSave(currentlyEditedVersion, existingAliases, draftAliases)
      .then(() => {
        setIsLoading(false);
        setShowModal(false);
        onSuccess?.();
      })
      .catch((e: ErrorWrapper | Error) => {
        setIsLoading(false);
        if (e instanceof ErrorWrapper) {
          const extractedErrorMessage = e.getMessageField() || e.getUserVisibleError().toString() || e.text;
          setErrorMessage(extractedErrorMessage);
        } else {
          setErrorMessage(e.message);
        }
      });
  };

  // Indicates if there is any pending change to the alias set
  const isPristine = isEqual(existingAliases.slice().sort(), draftAliases.slice().sort());
  const isExceedingLimit = draftAliases.length > MAX_ALIASES_PER_MODEL_VERSION;

  const isInvalid = isPristine || isExceedingLimit;

  const EditAliasesModal = (
    <Modal
      componentId="mlflow.edit-aliases-modal"
      visible={showModal}
      footer={
        <div>
          <Button componentId="mlflow.edit-aliases-modal.cancel-button" onClick={() => setShowModal(false)}>
            <FormattedMessage defaultMessage="Cancel" description="Alias editor > Cancel editing aliases" />
          </Button>
          <Button
            componentId="mlflow.edit-aliases-modal.save-button"
            loading={isLoading}
            type="primary"
            disabled={isInvalid}
            onClick={save}
          >
            <FormattedMessage defaultMessage="Save aliases" description="Alias editor > Confirm change of aliases" />
          </Button>
        </div>
      }
      destroyOnClose
      title={getTitle(currentlyEditedVersion)}
      onCancel={() => setShowModal(false)}
      confirmLoading={false}
    >
      <Typography.Paragraph>{description}</Typography.Paragraph>
      <LegacyForm form={form} layout="vertical">
        <LegacyForm.Item>
          <AliasSelect
            disabled={false}
            renderKey={conflictedAliases} // todo
            aliasToVersionMap={aliasToVersionMap}
            version={currentlyEditedVersion}
            draftAliases={draftAliases}
            existingAliases={existingAliases}
            setDraftAliases={setDraftAliases}
          />
        </LegacyForm.Item>
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          {isExceedingLimit && (
            <Alert
              componentId="mlflow.edit-aliases-modal.exceeding-limit-alert"
              role="alert"
              message={
                <FormattedMessage
                  defaultMessage="You are exceeding a limit of {limit} aliases assigned to the single model version"
                  description="Alias editor > Warning about exceeding aliases limit"
                  values={{ limit: MAX_ALIASES_PER_MODEL_VERSION }}
                />
              }
              type="error"
              closable={false}
            />
          )}
          {conflictedAliases.map(({ alias, otherVersion }) => (
            <Alert
              componentId="mlflow.edit-aliases-modal.conflicted-alias-alert"
              role="alert"
              key={alias}
              message={
                <FormattedMessage
                  defaultMessage='The "{alias}" alias is also being used on version {otherVersion}. Adding it to this version will remove it from version {otherVersion}.'
                  description="Alias editor > Warning about reusing alias from the other version"
                  values={{ otherVersion: otherVersion?.version, alias }}
                />
              }
              type="info"
              closable={false}
            />
          ))}
          {errorMessage && (
            <Alert
              componentId="mlflow.edit-aliases-modal.error-alert"
              role="alert"
              message={errorMessage}
              type="error"
              closable={false}
            />
          )}
        </div>
      </LegacyForm>
    </Modal>
  );

  return { EditAliasesModal, showEditAliasesModal };
};
```

--------------------------------------------------------------------------------

---[FILE: useEditKeyValueTagsModal.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useEditKeyValueTagsModal.intg.test.tsx
Signals: React, Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';

import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import type { ModelVersionInfoEntity } from '../../experiment-tracking/types';
import { updateModelVersionTagsApi } from '../../model-registry/actions';
import { Services as ModelRegistryServices } from '../../model-registry/services';
import type { ThunkDispatch } from '../../redux-types';
import { DesignSystemProvider } from '@databricks/design-system';
import { act, screen, within, fastFillInput, renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { useEditKeyValueTagsModal } from './useEditKeyValueTagsModal';

const ERRONEOUS_TAG_KEY = 'forbidden_tag';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // increase timeout since it's integration testing

/**
 * A super simple mocked API to that mimics storing registered model
 * versions and and is capable of updating the tags
 */
class MockDatabase {
  // Internal storage:
  modelVersions: ModelVersionInfoEntity[] = [
    {
      name: 'test_model',
      creation_timestamp: 1234,
      current_stage: '',
      last_updated_timestamp: 1234,
      run_id: 'experiment123456789_run4',
      source: 'notebook',
      status: 'active',
      user_id: '123',
      version: '1',
      tags: [
        { key: 'existing_tag_1', value: 'existing_tag_value_1' },
        { key: 'existing_tag_2', value: 'existing_tag_value_2' },
      ] as any,
    },
  ];
  private getVersion(findName: string, findVersion: string) {
    return this.modelVersions.find(({ name, version }) => name === findName && version === findVersion) || null;
  }
  // Exposed "API":
  getModelVersion = async (findName: string, findVersion: string) => {
    return Promise.resolve(this.getVersion(findName, findVersion));
  };
  setTag = async ({ name, key, version, value }: { name: string; version: string; key: string; value?: string }) => {
    if (key === ERRONEOUS_TAG_KEY) {
      throw new Error('You shall not use this tag!');
    }
    const modelVersion = this.getVersion(name, version);
    if (!modelVersion) {
      return;
    }
    const existingTag = modelVersion.tags?.find(({ key: existingKey }) => existingKey === key);
    if (existingTag && value) {
      existingTag.value = value;
      return;
    }
    modelVersion.tags?.push({ key, value: value || '' } as any);
  };
  deleteTag = async ({ name, key, version }: { name: string; version: string; key: string }) => {
    const modelVersion = this.getVersion(name, version);
    if (!modelVersion) {
      return;
    }
    modelVersion.tags = (modelVersion.tags || []).filter(({ key: existingKey }) => existingKey !== key);
  };
}

describe('useEditKeyValueTagsModal integration', () => {
  // Wire up service to the mocked "database" server
  const database = new MockDatabase();
  ModelRegistryServices.deleteModelVersionTag = jest.fn(database.deleteTag);
  ModelRegistryServices.setModelVersionTag = jest.fn(database.setTag);

  // Mock redux store to enable redux actions
  const mockStoreFactory = configureStore([thunk, promiseMiddleware()]);
  const mockStore = mockStoreFactory({});

  function renderTestComponent() {
    function TestComponent() {
      const dispatch = useDispatch<ThunkDispatch>();
      const [modelVersion, setModelVersion] = useState<ModelVersionInfoEntity | null>(null);

      const fetchModelVersion = () => database.getModelVersion('test_model', '1').then(setModelVersion);
      useEffect(() => {
        fetchModelVersion();
      }, []);

      const { showEditTagsModal, EditTagsModal } = useEditKeyValueTagsModal<ModelVersionInfoEntity>({
        allAvailableTags: [],
        saveTagsHandler: async (savedModelVersion, existingTags, newTags) =>
          dispatch(updateModelVersionTagsApi(savedModelVersion, existingTags, newTags)),
        onSuccess: fetchModelVersion,
      });
      return (
        <>
          {modelVersion && (
            <div>
              <span>
                Model name: {modelVersion.name} version {modelVersion.version}
              </span>
              <ul>
                {modelVersion.tags?.map(({ key, value }) => (
                  <li key={key} title={key}>
                    {key}
                    {value && `: ${value}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => modelVersion && showEditTagsModal(modelVersion)}>change tags</button>
          {EditTagsModal}
        </>
      );
    }
    renderWithIntl(
      <Provider store={mockStore}>
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      </Provider>,
    );
  }

  test('it should display model details and modify its tags using the modal', async () => {
    // Render the component, wait to load initial data
    await act(async () => {
      renderTestComponent();
    });

    // Assert existence of existing tags
    expect(screen.getByText('Model name: test_model version 1')).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'existing_tag_1' })).toContainHTML(
      'existing_tag_1: existing_tag_value_1',
    );
    expect(screen.getByRole('listitem', { name: 'existing_tag_2' })).toContainHTML(
      'existing_tag_2: existing_tag_value_2',
    );

    // Open the modal in order to modify tags
    await userEvent.click(screen.getByRole('button', { name: 'change tags' }));
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();

    // Add a new tag with value
    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'new_tag_with_value');
    await userEvent.click(screen.getByText(/Add tag "new_tag_with_value"/));
    await fastFillInput(screen.getByLabelText('Value (optional)'), 'tag_value');
    await userEvent.click(screen.getByLabelText('Add tag'));

    // Add another tag without value
    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'new_tag_without_value');

    await userEvent.click(screen.getByText(/Add tag "new_tag_without_value"/));
    await userEvent.click(screen.getByLabelText('Add tag'));

    // Add yet another tag without value
    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'another_tag');
    await userEvent.click(screen.getByText(/Add tag "another_tag"/));
    await userEvent.click(screen.getByLabelText('Add tag'));

    // Delete existing tag
    await userEvent.click(within(screen.getByRole('status', { name: 'existing_tag_1' })).getByRole('button'));
    // Also, scratch one of the newly added tags
    await userEvent.click(within(screen.getByRole('status', { name: 'another_tag' })).getByRole('button'));

    // Save the tags
    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    // Assert tags from newly refreshed model version
    expect(screen.queryByRole('listitem', { name: 'existing_tag_1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: 'existing_tag_2' })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'new_tag_without_value' })).toContainHTML('new_tag_without_value');
    expect(screen.getByRole('listitem', { name: 'new_tag_with_value' })).toContainHTML('new_tag_with_value: tag_value');
    expect(screen.queryByRole('listitem', { name: 'another_tag' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'change tags' }));
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
  });
  test('should react accordingly when API responds with an error', async () => {
    // Render the component, wait to load initial data
    await act(async () => {
      renderTestComponent();
    });

    // Open the modal in order to modify tags
    await userEvent.click(screen.getByRole('button', { name: 'change tags' }));

    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'forbidden_tag');

    await userEvent.click(screen.getByText(/Add tag "forbidden_tag"/));
    await userEvent.click(screen.getByLabelText('Add tag'));

    // Attempt to save it
    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    // Confirm there's an error and that the tag was not added
    expect(screen.getByText(/You shall not use this tag!/)).toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: 'forbidden_tag' })).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEditKeyValueTagsModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/hooks/useEditKeyValueTagsModal.test.tsx

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';

import { useEditKeyValueTagsModal } from './useEditKeyValueTagsModal';
import type { KeyValueEntity } from '../types';
import { DesignSystemProvider } from '@databricks/design-system';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
  selectAntdOption,
  renderWithIntl,
} from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

describe('useEditKeyValueTagsModal', () => {
  function renderTestComponent(
    editedEntity: { tags?: KeyValueEntity[] } = {},
    allAvailableTags: string[],
    saveTagsHandler = jest.fn<Parameters<typeof useEditKeyValueTagsModal>[0]['saveTagsHandler']>(),
    onSuccess = jest.fn(),
  ) {
    function TestComponent() {
      const { showEditTagsModal, EditTagsModal } = useEditKeyValueTagsModal({
        allAvailableTags,
        saveTagsHandler,
        onSuccess,
      });
      return (
        <>
          <button onClick={() => showEditTagsModal(editedEntity)}>trigger button</button>
          {EditTagsModal}
        </>
      );
    }
    const { rerender } = renderWithIntl(
      <DesignSystemProvider>
        <TestComponent />
      </DesignSystemProvider>,
    );
    return {
      rerender: () =>
        rerender(
          <DesignSystemProvider>
            <TestComponent />
          </DesignSystemProvider>,
        ),
    };
  }

  test('it should open and close the creation modal properly', async () => {
    renderTestComponent({ tags: [] }, []);
    // When click on trigger button
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));
    // Then modal shown with correct header
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    // When click on close
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    // Then modal closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('should show list of provided tags', async () => {
    renderTestComponent({}, ['tag3', 'tag4']);
    // When click on trigger button
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));
    // Then modal shown with correct header
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    // Then list of tags shown
    await act(async () => {
      const select = within(screen.getByRole('dialog')).getByRole('combobox');
      fireEvent.mouseDown(select);
    });
    expect(screen.getByRole('option', { name: 'tag3' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'tag4' })).toBeInTheDocument();
  });

  const existingTags = [{ key: 'tag1', value: 'tagvalue1' }] as KeyValueEntity[];
  const existingTaggedEntity = { tags: existingTags };

  test('it should properly add tag with key only', async () => {
    const saveHandlerFn = jest
      .fn<Parameters<typeof useEditKeyValueTagsModal>[0]['saveTagsHandler']>()
      .mockResolvedValue({});

    renderTestComponent(existingTaggedEntity, ['tag1', 'tag2'], saveHandlerFn);

    // When click on trigger button to open modal
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));
    // Then modal shown with correct header
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    // And fill out the form
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('combobox'));
    await userEvent.paste('newtag', {
      clipboardData: { getData: jest.fn() },
    } as any);
    await userEvent.click(screen.getByText(/Add tag "newtag"/));
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(saveHandlerFn).toHaveBeenCalledWith(existingTaggedEntity, existingTags, [
      { key: 'tag1', value: 'tagvalue1' },
      { key: 'newtag', value: '' },
    ]);
  });

  test('it should properly select already existing tag', async () => {
    const saveHandlerFn = jest
      .fn<Parameters<typeof useEditKeyValueTagsModal>[0]['saveTagsHandler']>()
      .mockResolvedValue({});

    renderTestComponent(existingTaggedEntity, ['tag1', 'tag2'], saveHandlerFn);

    // When click on trigger button to open modal
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));
    // Then modal shown with correct header
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    // And fill out the form
    await selectAntdOption(screen.getByRole('dialog'), 'tag2');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(saveHandlerFn).toHaveBeenCalledWith(existingTaggedEntity, existingTags, [
      { key: 'tag1', value: 'tagvalue1' },
      { key: 'tag2', value: '' },
    ]);
  });

  test('it should properly add tag with key and value', async () => {
    const saveHandlerFn = jest
      .fn<Parameters<typeof useEditKeyValueTagsModal>[0]['saveTagsHandler']>()
      .mockResolvedValue({});

    renderTestComponent(existingTaggedEntity, ['tag1', 'tag2'], saveHandlerFn);

    // When click on trigger button to open modal
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));
    // Then modal shown with correct header
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    // And fill out the form
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('combobox'));
    await userEvent.paste('newtag', {
      clipboardData: { getData: jest.fn() },
    } as any);

    await userEvent.click(screen.getByText(/Add tag "newtag"/));

    await userEvent.type(screen.getByLabelText('Value (optional)'), 'newvalue');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(saveHandlerFn).toHaveBeenCalledWith(existingTaggedEntity, existingTags, [
      { key: 'tag1', value: 'tagvalue1' },
      { key: 'newtag', value: 'newvalue' },
    ]);
  });

  test('it should properly display error when saving tags', async () => {
    const saveHandlerFn = jest
      .fn<Parameters<typeof useEditKeyValueTagsModal>[0]['saveTagsHandler']>()
      .mockRejectedValue({ message: 'This is a test exception' });

    renderTestComponent(existingTaggedEntity, ['tag1', 'tag2'], saveHandlerFn);

    // When click on trigger button to open modal
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));
    // Then modal shown with correct header
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    // And fill out the form
    await userEvent.type(within(screen.getByRole('dialog')).getByRole('combobox'), 'newtag', {
      delay: 1,
    });

    await userEvent.click(screen.getByText(/Add tag "newtag"/));
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(screen.getByText(/This is a test exception/)).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````
