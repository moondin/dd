---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 480
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 480 of 991)

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

---[FILE: ExperimentViewRunsControls.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControls.tsx
Signals: React

```typescript
import React, { useCallback, useMemo } from 'react';
import type { UpdateExperimentViewStateFn } from '../../../../types';
import { useRunSortOptions } from '../../hooks/useRunSortOptions';
import type { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { ExperimentViewRunsControlsActions } from './ExperimentViewRunsControlsActions';
import { ExperimentViewRunsControlsFilters } from './ExperimentViewRunsControlsFilters';
import type { ErrorWrapper } from '../../../../../common/utils/ErrorWrapper';
import { ToggleButton, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { ExperimentViewRunsColumnSelector } from './ExperimentViewRunsColumnSelector';
import { useExperimentPageViewMode } from '../../hooks/useExperimentPageViewMode';
import Utils from '../../../../../common/utils/Utils';
import { downloadRunsCsv } from '../../utils/experimentPage.common-utils';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { ExperimentViewRunsGroupBySelector } from './ExperimentViewRunsGroupBySelector';
import { useUpdateExperimentViewUIState } from '../../contexts/ExperimentPageUIStateContext';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { ExperimentViewRunsSortSelectorV2 } from './ExperimentViewRunsSortSelectorV2';

type ExperimentViewRunsControlsProps = {
  viewState: ExperimentPageViewState;
  updateViewState: UpdateExperimentViewStateFn;

  searchFacetsState: ExperimentPageSearchFacetsState;

  experimentId: string;

  runsData: ExperimentRunsSelectorResult;

  expandRows: boolean;
  updateExpandRows: (expandRows: boolean) => void;

  requestError: ErrorWrapper | Error | null;

  refreshRuns: () => void;
  uiState: ExperimentPageUIState;
  isLoading: boolean;
  isComparingExperiments: boolean;
};

/**
 * This component houses all controls related to searching runs: sort controls,
 * filters and run related actions (delete, restore, download CSV).
 */
export const ExperimentViewRunsControls = React.memo(
  ({
    runsData,
    viewState,
    updateViewState,
    searchFacetsState,
    experimentId,
    requestError,
    expandRows,
    updateExpandRows,
    refreshRuns,
    uiState,
    isLoading,
    isComparingExperiments,
  }: ExperimentViewRunsControlsProps) => {
    const [compareRunsMode, setCompareRunsMode] = useExperimentPageViewMode();

    const { paramKeyList, metricKeyList, tagsList } = runsData;
    const { orderByAsc, orderByKey } = searchFacetsState;

    const updateUIState = useUpdateExperimentViewUIState();

    const isComparingRuns = compareRunsMode !== 'TABLE';
    const isEvaluationMode = compareRunsMode === 'ARTIFACT';

    const { theme } = useDesignSystemTheme();

    const filteredParamKeys = paramKeyList;
    const filteredMetricKeys = metricKeyList;
    const filteredTagKeys = Utils.getVisibleTagKeyList(tagsList);

    const onDownloadCsv = useCallback(
      () => downloadRunsCsv(runsData, filteredTagKeys, filteredParamKeys, filteredMetricKeys),
      [filteredMetricKeys, filteredParamKeys, filteredTagKeys, runsData],
    );

    const sortOptions = useRunSortOptions(filteredMetricKeys, filteredParamKeys);

    const selectedRunsCount = Object.values(viewState.runsSelected).filter(Boolean).length;
    const canRestoreRuns = selectedRunsCount > 0;
    const canRenameRuns = selectedRunsCount === 1;
    const canCompareRuns = selectedRunsCount > 1;
    const showActionButtons = canCompareRuns || canRenameRuns || canRestoreRuns;

    const showGroupBySelector = !isEvaluationMode;

    // Shows or hides the column selector
    const changeColumnSelectorVisible = useCallback(
      (value: boolean) => updateViewState({ columnSelectorVisible: value }),
      [updateViewState],
    );

    const toggleExpandedRows = useCallback(() => updateExpandRows(!expandRows), [expandRows, updateExpandRows]);

    const multipleDatasetsArePresent = useMemo(
      () => runsData.datasetsList.some((datasetsInRun) => datasetsInRun?.length > 1),
      [runsData],
    );

    return (
      <div
        css={{
          display: 'flex',
          gap: theme.spacing.sm,
          flexDirection: 'column' as const,
          marginBottom: theme.spacing.sm,
        }}
      >
        {showActionButtons && (
          <ExperimentViewRunsControlsActions
            runsData={runsData}
            searchFacetsState={searchFacetsState}
            viewState={viewState}
            refreshRuns={refreshRuns}
          />
        )}

        {!showActionButtons && (
          <ExperimentViewRunsControlsFilters
            onDownloadCsv={onDownloadCsv}
            searchFacetsState={searchFacetsState}
            experimentId={experimentId}
            viewState={viewState}
            updateViewState={updateViewState}
            runsData={runsData}
            requestError={requestError}
            refreshRuns={refreshRuns}
            viewMaximized={uiState.viewMaximized}
            autoRefreshEnabled={uiState.autoRefreshEnabled}
            hideEmptyCharts={uiState.hideEmptyCharts}
            areRunsGrouped={Boolean(uiState.groupBy)}
            additionalControls={
              <>
                <ExperimentViewRunsSortSelectorV2
                  orderByAsc={orderByAsc}
                  orderByKey={orderByKey}
                  metricKeys={filteredMetricKeys}
                  paramKeys={filteredParamKeys}
                />

                {!isComparingRuns && (
                  <ExperimentViewRunsColumnSelector
                    columnSelectorVisible={viewState.columnSelectorVisible}
                    onChangeColumnSelectorVisible={changeColumnSelectorVisible}
                    runsData={runsData}
                    selectedColumns={uiState.selectedColumns}
                  />
                )}

                {!isComparingRuns && multipleDatasetsArePresent && (
                  <ToggleButton
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrols.tsx_175"
                    onClick={toggleExpandedRows}
                  >
                    <FormattedMessage
                      defaultMessage="Expand rows"
                      description="Label for the expand rows button above the experiment runs table"
                    />
                  </ToggleButton>
                )}
                {showGroupBySelector && (
                  <ExperimentViewRunsGroupBySelector
                    groupBy={uiState.groupBy}
                    onChange={(groupBy) => {
                      updateUIState((state) => ({ ...state, groupBy }));
                    }}
                    runsData={runsData}
                    isLoading={isLoading}
                    useGroupedValuesInCharts={uiState.useGroupedValuesInCharts ?? true}
                    onUseGroupedValuesInChartsChange={(useGroupedValuesInCharts) => {
                      updateUIState((state) => ({ ...state, useGroupedValuesInCharts }));
                    }}
                  />
                )}
              </>
            }
          />
        )}
      </div>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsActions.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActions.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { useState } from 'react';
import type { ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
// import { SearchExperimentRunsFacetsState } from '../../models/SearchExperimentRunsFacetsState';
import { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import { experimentRunsSelector } from '../../utils/experimentRuns.selector';
import type { ExperimentViewRunsControlsActionsProps } from './ExperimentViewRunsControlsActions';
import { ExperimentViewRunsControlsActions } from './ExperimentViewRunsControlsActions';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { DesignSystemProvider } from '@databricks/design-system';

const MOCK_EXPERIMENT = EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'];

const MOCK_RUNS_DATA = experimentRunsSelector(EXPERIMENT_RUNS_MOCK_STORE, {
  experiments: [MOCK_EXPERIMENT],
});

const DEFAULT_VIEW_STATE = new ExperimentPageViewState();

const doMock = (additionalProps: Partial<ExperimentViewRunsControlsActionsProps> = {}) => {
  const mockUpdateSearchFacets = jest.fn();
  let currentState: any;

  const getCurrentState = () => currentState;

  const Component = () => {
    const [searchFacetsState, setSearchFacetsState] = useState<ExperimentPageSearchFacetsState>(
      createExperimentPageSearchFacetsState(),
    );

    currentState = searchFacetsState;

    const props: ExperimentViewRunsControlsActionsProps = {
      runsData: MOCK_RUNS_DATA,
      searchFacetsState,
      viewState: DEFAULT_VIEW_STATE,
      refreshRuns: jest.fn(),
      ...additionalProps,
    };
    return (
      <Provider
        store={createStore((s) => s as any, EXPERIMENT_RUNS_MOCK_STORE, compose(applyMiddleware(promiseMiddleware())))}
      >
        <DesignSystemProvider>
          <MemoryRouter>
            <IntlProvider locale="en">
              <ExperimentViewRunsControlsActions {...props} />
            </IntlProvider>
          </MemoryRouter>
        </DesignSystemProvider>
      </Provider>
    );
  };
  return {
    wrapper: mountWithIntl(<Component />),
    mockUpdateSearchFacets,
    getCurrentState,
  };
};

// @ts-expect-error TS(2709): Cannot use namespace 'ReactWrapper' as a type.
const getActionButtons = (wrapper: ReactWrapper) => {
  const deleteButton = wrapper.find("button[data-testid='runs-delete-button']");
  const compareButton = wrapper.find("button[data-testid='runs-compare-button']");
  const renameButton = wrapper.find("button[data-testid='run-rename-button']");
  return { deleteButton, compareButton, renameButton };
};

describe('ExperimentViewRunsControlsFilters', () => {
  test('should render with given search facets model properly', () => {
    const { wrapper } = doMock();
    expect(wrapper).toBeTruthy();
  });

  test('should enable delete buttons when there is single row selected', () => {
    const { wrapper } = doMock({
      viewState: {
        runsSelected: { '123': true },
        hiddenChildRunsSelected: {},
        columnSelectorVisible: false,
        previewPaneVisible: false,
        artifactViewState: {},
      },
    });

    const { deleteButton, compareButton, renameButton } = getActionButtons(wrapper);

    // All buttons should be visible
    expect(deleteButton.length).toBe(1);
    expect(compareButton.length).toBe(1);
    expect(renameButton.length).toBe(1);

    // Only compare button should be disabled
    expect(deleteButton.getDOMNode().getAttribute('disabled')).toBeNull();
    expect(compareButton.getDOMNode().getAttribute('disabled')).not.toBeNull();
    expect(renameButton.getDOMNode().getAttribute('disabled')).toBeNull();
  });

  test('should enable delete and compare buttons when there are multiple rows selected', () => {
    const { wrapper } = doMock({
      viewState: {
        runsSelected: { '123': true, '321': true },
        hiddenChildRunsSelected: {},
        columnSelectorVisible: false,
        previewPaneVisible: false,
        artifactViewState: {},
      },
    });

    const { deleteButton, compareButton, renameButton } = getActionButtons(wrapper);

    // All buttons should be visible
    expect(deleteButton.length).toBe(1);
    expect(compareButton.length).toBe(1);
    expect(renameButton.length).toBe(1);

    // Only rename button should be disabled
    expect(deleteButton.getDOMNode().getAttribute('disabled')).toBeNull();
    expect(compareButton.getDOMNode().getAttribute('disabled')).toBeNull();
    expect(renameButton.getDOMNode().getAttribute('disabled')).not.toBeNull();
  });

  test('should enable rename button when necessary', () => {
    const { wrapper } = doMock({
      viewState: {
        runsSelected: { '123': true },
        hiddenChildRunsSelected: {},
        columnSelectorVisible: false,
        previewPaneVisible: false,
        artifactViewState: {},
      },
    });

    const deleteButton = wrapper.find("button[data-testid='run-rename-button']");
    expect(deleteButton.getDOMNode().getAttribute('disabled')).toBeNull();
  });

  test('should disable rename button when necessary', () => {
    const { wrapper } = doMock({
      viewState: {
        runsSelected: { '123': true, '321': true },
        hiddenChildRunsSelected: {},
        columnSelectorVisible: false,
        previewPaneVisible: false,
        artifactViewState: {},
      },
    });

    const deleteButton = wrapper.find("button[data-testid='run-rename-button']");
    expect(deleteButton.getDOMNode().getAttribute('disabled')).not.toBeNull();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsActions.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActions.stories.tsx
Signals: React, Redux/RTK

```typescript
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import { ExperimentViewRunsControlsActions } from './ExperimentViewRunsControlsActions';
import { experimentRunsSelector } from '../../utils/experimentRuns.selector';
import { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import { useRunSortOptions } from '../../hooks/useRunSortOptions';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';

const MOCK_EXPERIMENT = EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'];

const MOCK_RUNS_DATA = experimentRunsSelector(EXPERIMENT_RUNS_MOCK_STORE, {
  experiments: [MOCK_EXPERIMENT],
});

export default {
  title: 'ExperimentView/ExperimentViewRunsControlsActions',
  component: ExperimentViewRunsControlsActions,
  argTypes: {},
};

const createComponentWrapper = (viewState: ExperimentPageViewState) => () => {
  const [searchFacetsState] = useState(() => createExperimentPageSearchFacetsState());

  const sortOptions = useRunSortOptions(['metric1'], ['param1']);

  return (
    <Provider
      store={createStore((s) => s as any, EXPERIMENT_RUNS_MOCK_STORE, compose(applyMiddleware(promiseMiddleware())))}
    >
      <MemoryRouter>
        <IntlProvider locale="en">
          <div
            css={{
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: '1px solid #ccc',
            }}
          >
            <h2>Component:</h2>
          </div>
          <ExperimentViewRunsControlsActions
            runsData={MOCK_RUNS_DATA}
            searchFacetsState={searchFacetsState}
            viewState={viewState}
            refreshRuns={() => {}}
          />
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  );
};

export const Default = createComponentWrapper(new ExperimentPageViewState());
export const WithOneRunSelected = createComponentWrapper(
  Object.assign(new ExperimentPageViewState(), {
    runsSelected: {
      experiment123456789_run1: true,
    },
  }),
);

export const WithTwoRunsSelected = createComponentWrapper(
  Object.assign(new ExperimentPageViewState(), {
    runsSelected: {
      experiment123456789_run1: true,
      experiment123456789_run2: true,
    },
  }),
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsActions.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActions.tsx
Signals: React

```typescript
import { Button } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from '../../../../../common/utils/RoutingUtils';
import { Tooltip } from '@databricks/design-system';
import { LIFECYCLE_FILTER } from '../../../../constants';
import Routes from '../../../../routes';
import type { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { ExperimentViewRunModals } from './ExperimentViewRunModals';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import type { RunInfoEntity } from '../../../../types';
import { useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentViewRunsControlsActionsSelectTags } from './ExperimentViewRunsControlsActionsSelectTags';

export type ExperimentViewRunsControlsActionsProps = {
  viewState: ExperimentPageViewState;
  searchFacetsState: ExperimentPageSearchFacetsState;
  runsData: ExperimentRunsSelectorResult;
  refreshRuns: () => void;
};

const CompareRunsButtonWrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => <>{children}</>;

export const ExperimentViewRunsControlsActions = React.memo(
  ({ viewState, runsData, searchFacetsState, refreshRuns }: ExperimentViewRunsControlsActionsProps) => {
    const { runsSelected } = viewState;
    const { runInfos, tagsList } = runsData;
    const { lifecycleFilter } = searchFacetsState;

    const navigate = useNavigate();
    const { theme } = useDesignSystemTheme();

    const [showDeleteRunModal, setShowDeleteRunModal] = useState(false);
    const [showRestoreRunModal, setShowRestoreRunModal] = useState(false);
    const [showRenameRunModal, setShowRenameRunModal] = useState(false);
    const [renamedRunName, setRenamedRunName] = useState('');

    const renameButtonClicked = useCallback(() => {
      const runsSelectedList = Object.keys(runsSelected);
      const selectedRun = runInfos.find((info) => info.runUuid === runsSelectedList[0]);
      if (selectedRun) {
        setRenamedRunName(selectedRun.runName);
        setShowRenameRunModal(true);
      }
    }, [runInfos, runsSelected]);

    const compareButtonClicked = useCallback(() => {
      const runsSelectedList = Object.keys(runsSelected);
      const experimentIds = runInfos
        .filter(({ runUuid }: RunInfoEntity) => runsSelectedList.includes(runUuid))
        .map(({ experimentId }: any) => experimentId);

      navigate(Routes.getCompareRunPageRoute(runsSelectedList, [...new Set(experimentIds)].sort()));
    }, [navigate, runInfos, runsSelected]);

    const onDeleteRun = useCallback(() => setShowDeleteRunModal(true), []);
    const onRestoreRun = useCallback(() => setShowRestoreRunModal(true), []);
    const onCloseDeleteRunModal = useCallback(() => setShowDeleteRunModal(false), []);
    const onCloseRestoreRunModal = useCallback(() => setShowRestoreRunModal(false), []);
    const onCloseRenameRunModal = useCallback(() => setShowRenameRunModal(false), []);

    const selectedRunsCount = Object.values(viewState.runsSelected).filter(Boolean).length;
    const canRestoreRuns = selectedRunsCount > 0;
    const canRenameRuns = selectedRunsCount === 1;
    const canCompareRuns = selectedRunsCount > 1;
    const showActionButtons = canCompareRuns || canRenameRuns || canRestoreRuns;

    return (
      <>
        <div css={styles.controlBar}>
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactions.tsx_110"
            data-testid="run-rename-button"
            onClick={renameButtonClicked}
            disabled={!canRenameRuns}
          >
            <FormattedMessage
              defaultMessage="Rename"
              description="Label for the rename run button above the experiment runs table"
            />
          </Button>
          {lifecycleFilter === LIFECYCLE_FILTER.ACTIVE ? (
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactions.tsx_117"
              data-testid="runs-delete-button"
              disabled={!canRestoreRuns}
              onClick={onDeleteRun}
              danger
            >
              <FormattedMessage
                defaultMessage="Delete"
                // eslint-disable-next-line max-len
                description="String for the delete button to delete a particular experiment run"
              />
            </Button>
          ) : null}
          {lifecycleFilter === LIFECYCLE_FILTER.DELETED ? (
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactions.tsx_126"
              data-testid="runs-restore-button"
              disabled={!canRestoreRuns}
              onClick={onRestoreRun}
            >
              <FormattedMessage
                defaultMessage="Restore"
                // eslint-disable-next-line max-len
                description="String for the restore button to undo the experiments that were deleted"
              />
            </Button>
          ) : null}
          <div css={styles.buttonSeparator} />
          <CompareRunsButtonWrapper>
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactions.tsx_136"
              data-testid="runs-compare-button"
              disabled={!canCompareRuns}
              onClick={compareButtonClicked}
            >
              <FormattedMessage
                defaultMessage="Compare"
                // eslint-disable-next-line max-len
                description="String for the compare button to compare experiment runs to find an ideal model"
              />
            </Button>
          </CompareRunsButtonWrapper>

          <div css={styles.buttonSeparator} />
          <ExperimentViewRunsControlsActionsSelectTags
            runsSelected={runsSelected}
            runInfos={runInfos}
            tagsList={tagsList}
            refreshRuns={refreshRuns}
          />
        </div>
        <ExperimentViewRunModals
          runsSelected={runsSelected}
          onCloseRenameRunModal={onCloseRenameRunModal}
          onCloseDeleteRunModal={onCloseDeleteRunModal}
          onCloseRestoreRunModal={onCloseRestoreRunModal}
          showDeleteRunModal={showDeleteRunModal}
          showRestoreRunModal={showRestoreRunModal}
          showRenameRunModal={showRenameRunModal}
          renamedRunName={renamedRunName}
          refreshRuns={refreshRuns}
        />
      </>
    );
  },
);

const styles = {
  buttonSeparator: (theme: Theme) => ({
    borderLeft: `1px solid ${theme.colors.border}`,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    height: '100%',
  }),
  controlBar: (theme: Theme) => ({
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsActionsAddNewTagModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActionsAddNewTagModal.tsx
Signals: React

```typescript
import { FormUI, Input, Modal, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import type { KeyValueEntity } from '../../../../../common/types';
import { useState } from 'react';

export const ExperimentViewRunsControlsActionsAddNewTagModal = ({
  isOpen,
  setIsOpen,
  selectedRunsExistingTagKeys,
  addNewTag,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedRunsExistingTagKeys: string[];
  addNewTag: (tag: KeyValueEntity) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const [tagKey, setTagKey] = useState<string>('');
  const [tagValue, setTagValue] = useState<string>('');

  const isTagKeyAllowedChars = tagKey === '' || /^[^,.:/=\-\s]+$/.test(tagKey);
  const isTagKeyDuplicate = selectedRunsExistingTagKeys.includes(tagKey);
  const isTagKeyValid = isTagKeyAllowedChars && !isTagKeyDuplicate;
  const isTagNonEmptyAndTagKeyValid = tagKey.length > 0 && tagValue.length > 0 && isTagKeyValid;

  const onConfirmTag = () => {
    if (isTagNonEmptyAndTagKeyValid) {
      addNewTag({ key: tagKey, value: tagValue });
      setIsOpen(false);
      setTagKey('');
      setTagValue('');
    }
  };

  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactionsaddnewtagmodal.tsx_34"
      title={<FormattedMessage defaultMessage="Add New Tag" description="Add new key-value tag modal > Modal title" />}
      visible={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={onConfirmTag}
      okText={<FormattedMessage defaultMessage="Add" description="Add new key-value tag modal > Add button text" />}
      cancelText={
        <FormattedMessage defaultMessage="Cancel" description="Add new key-value tag modal > Cancel button text" />
      }
      okButtonProps={{ disabled: !isTagNonEmptyAndTagKeyValid }}
    >
      <form css={{ display: 'flex', alignItems: 'flex-end', gap: theme.spacing.md }}>
        <div css={{ display: 'flex', gap: theme.spacing.md, flex: 1 }}>
          <div css={{ flex: 1 }}>
            <FormUI.Label htmlFor="key">
              <FormattedMessage defaultMessage="Key" description="Add new key-value tag modal > Key input label" />
            </FormUI.Label>
            <Input
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactionsaddnewtagmodal.tsx_51"
              value={tagKey}
              onChange={(e) => setTagKey(e.target.value)}
              validationState={isTagKeyValid ? undefined : 'warning'}
              data-testid="add-new-tag-key-input"
            />
            {!isTagKeyAllowedChars && (
              <FormUI.Hint>
                <FormattedMessage
                  defaultMessage=", . : / - = and blank spaces are not allowed"
                  description="Add new key-value tag modal > Invalid characters error"
                />
              </FormUI.Hint>
            )}
            {isTagKeyDuplicate && (
              <FormUI.Hint>
                <FormattedMessage
                  defaultMessage="Tag key already exists on one or more of the selected runs. Please choose a different key."
                  description="Add new key-value tag modal > Duplicate tag key error"
                />
              </FormUI.Hint>
            )}
          </div>
          <div css={{ flex: 1 }}>
            <FormUI.Label htmlFor="value">
              <FormattedMessage defaultMessage="Value" description="Add new key-value tag modal > Value input label" />
            </FormUI.Label>
            <Input
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactionsaddnewtagmodal.tsx_78"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
              data-testid="add-new-tag-value-input"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsActionsSelectTags.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActionsSelectTags.test.tsx

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ExperimentViewRunsControlsActionsSelectTags } from './ExperimentViewRunsControlsActionsSelectTags';
import type { RunInfoEntity } from '../../../../types';
import type { KeyValueEntity } from '../../../../../common/types';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { setRunTagsBulkApi } from '@mlflow/mlflow/src/experiment-tracking/actions';
import { MockedReduxStoreProvider } from '../../../../../common/utils/TestUtils';
import userEvent from '@testing-library/user-event';

jest.mock('@mlflow/mlflow/src/experiment-tracking/actions', () => ({
  setRunTagsBulkApi: jest.fn(() => ({ type: 'setRunTagsBulkApi', payload: Promise.resolve() })),
}));

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(10000);

describe('ExperimentViewRunsControlsActionsSelectTags', () => {
  beforeEach(() => {
    jest.mocked(setRunTagsBulkApi).mockClear();
  });

  const runsSelected = {
    runUuid1: true,
    runUuid2: false,
    runUuid3: true,
  };

  const runInfos = [{ runUuid: 'runUuid1' }, { runUuid: 'runUuid2' }, { runUuid: 'runUuid3' }] as RunInfoEntity[];

  const tagsList = [
    {
      tag1: {
        key: 'tag1',
        value: 'test1',
      },
      tag2: {
        key: 'tag2',
        value: 'test2',
      },
      // Doesn't have tag3
    },
    {
      tag1: {
        key: 'tag1',
        value: 'test2',
      },
      tag3: {
        key: 'tag3',
        value: 'test3',
      },
    },
    {
      tag2: {
        key: 'tag2',
        value: 'test1',
      },
      tag3: {
        key: 'tag3',
        value: 'test3',
      },
    },
  ] as Record<string, KeyValueEntity>[];

  const refreshRuns = jest.fn();

  const renderComponent = () => {
    render(
      <MockedReduxStoreProvider>
        <MemoryRouter>
          <IntlProvider locale="en">
            <ExperimentViewRunsControlsActionsSelectTags
              runInfos={runInfos}
              runsSelected={runsSelected}
              tagsList={tagsList}
              refreshRuns={refreshRuns}
            />
          </IntlProvider>
        </MemoryRouter>
      </MockedReduxStoreProvider>,
    );
  };

  it('renders the component correctly', () => {
    renderComponent();
    // Assert that the component renders without errors
    expect(screen.getByText('Add tags')).toBeInTheDocument();
  });

  it('opens the dropdown when the trigger is clicked', async () => {
    renderComponent();

    // Click on the trigger to open the dropdown
    await userEvent.click(screen.getByTestId('runs-tag-multiselect-trigger'));

    // Assert that the dropdown is open
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('selects and deselects tags correctly', async () => {
    renderComponent();

    // Click on the trigger to open the dropdown
    await userEvent.click(screen.getByTestId('runs-tag-multiselect-trigger'));

    // expect(screen.getByText("tag1: test1")).toBePartiallyChecked();
    await userEvent.click(screen.getByRole('option', { name: 'tag1: test1' }));
    expect(screen.getByRole('checkbox', { name: 'tag1: test1' })).toBeChecked();
    await userEvent.click(screen.getByRole('option', { name: 'tag1: test1' }));
    expect(screen.getByRole('checkbox', { name: 'tag1: test1' })).not.toBeChecked();
  });

  it("adds a new tag when the 'Add new tag' button is clicked", async () => {
    renderComponent();

    // Click on the trigger to open the dropdown
    await userEvent.click(screen.getByTestId('runs-tag-multiselect-trigger'));

    // Click on the 'Add new tag' button
    await userEvent.click(screen.getByTestId('runs-add-new-tag-button'));

    // Assert that the add new tag modal is open
    expect(screen.getByLabelText('Add New Tag')).toBeInTheDocument();

    // Input a new tag key and value into the modal input boxes
    await userEvent.type(screen.getByTestId('add-new-tag-key-input'), 'newTag');
    await userEvent.type(screen.getByTestId('add-new-tag-value-input'), 'newValue');

    // Click on the 'Add' button
    await userEvent.click(screen.getByText('Add'));

    // Assert that it shows up on the dropdown
    expect(screen.getByRole('option', { name: 'newTag: newValue' })).toBeInTheDocument();
  });

  it("saves the selected tags when the 'Save' button is clicked", async () => {
    renderComponent();

    // Click on the trigger to open the dropdown
    await userEvent.click(screen.getByTestId('runs-tag-multiselect-trigger'));

    // Select some tags
    await userEvent.click(screen.getByRole('option', { name: 'tag1: test1' }));
    await userEvent.click(screen.getByRole('option', { name: 'tag2: test2' }));
    await userEvent.click(screen.getByRole('option', { name: 'tag2: test1' }));
    await userEvent.click(screen.getByRole('option', { name: 'tag2: test1' }));

    // Click on the 'Save' button
    await userEvent.click(screen.getByText('Save'));

    // Two runs are selected
    expect(setRunTagsBulkApi).toHaveBeenCalledTimes(2);
    // Assert the function was called with the correct arguments
    expect(setRunTagsBulkApi).toHaveBeenCalledWith(
      'runUuid1',
      [
        { key: 'tag1', value: 'test1' },
        { key: 'tag2', value: 'test2' },
      ],
      [
        { key: 'tag1', value: 'test1' },
        { key: 'tag2', value: 'test2' },
      ],
    );

    expect(setRunTagsBulkApi).toHaveBeenCalledWith(
      'runUuid3',
      [
        { key: 'tag2', value: 'test1' },
        { key: 'tag3', value: 'test3' },
      ],
      [
        { key: 'tag1', value: 'test1' },
        { key: 'tag2', value: 'test2' },
        { key: 'tag3', value: 'test3' },
      ],
    );
  });
});
```

--------------------------------------------------------------------------------

````
