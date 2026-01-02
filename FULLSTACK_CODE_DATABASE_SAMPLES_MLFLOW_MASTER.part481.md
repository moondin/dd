---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 481
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 481 of 991)

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

---[FILE: ExperimentViewRunsControlsActionsSelectTags.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsActionsSelectTags.tsx
Signals: React, Redux/RTK

```typescript
import {
  Button,
  DialogCombobox,
  DialogComboboxTrigger,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  DialogComboboxFooter,
  PlusIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useState } from 'react';
import { isUserFacingTag } from '@mlflow/mlflow/src/common/utils/TagUtils';
import { setRunTagsBulkApi } from '@mlflow/mlflow/src/experiment-tracking/actions';
import type { RunInfoEntity } from '../../../../types';
import type { KeyValueEntity } from '../../../../../common/types';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '@mlflow/mlflow/src/redux-types';
import { ExperimentViewRunsControlsActionsAddNewTagModal } from './ExperimentViewRunsControlsActionsAddNewTagModal';
import { uniq } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import { ErrorWrapper } from '@mlflow/mlflow/src/common/utils/ErrorWrapper';

const convertTagToString = (tag: KeyValueEntity) => {
  return `${tag.key}: ${tag.value}`;
};
const convertStringToTag = (tagString: string) => {
  const sep = ': ';
  const [key, ...splits] = tagString.split(sep);
  return { key, value: splits.join(sep) };
};

const getRunsTagsSelection = (
  runInfos: RunInfoEntity[],
  runsSelected: Record<string, boolean>,
  tagsList: Record<string, KeyValueEntity>[],
) => {
  const selectedRunsTagArray: string[][] = runInfos.flatMap((run, idx) => {
    if (runsSelected[run.runUuid]) {
      const tags = tagsList[idx];
      return [
        Object.keys(tags)
          .filter(isUserFacingTag)
          .map((tagKey) => convertTagToString(tags[tagKey])),
      ];
    }
    return [];
  });

  const allRunsTags: string[] = tagsList.flatMap((tags) => {
    return Object.keys(tags)
      .filter(isUserFacingTag)
      .map((tagKey) => convertTagToString(tags[tagKey]));
  });

  const selectedRunsAllSelectedTags: string[] = allRunsTags.filter((tag) =>
    selectedRunsTagArray.every((selectedTags) => selectedTags.includes(tag)),
  );
  const selectedRunsAllNotSelectedTags: string[] = allRunsTags.filter((tag) =>
    selectedRunsTagArray.every((selectedTags) => !selectedTags.includes(tag)),
  );
  const selectedRunsIndeterminateTags: string[] = allRunsTags.filter(
    (tag) =>
      !selectedRunsAllSelectedTags.includes(tag) &&
      selectedRunsTagArray.some((selectedTags) => selectedTags.includes(tag)),
  );

  return {
    allSelectedTags: selectedRunsAllSelectedTags,
    allNotSelectedTags: selectedRunsAllNotSelectedTags,
    indeterminateTags: selectedRunsIndeterminateTags,
    allTags: allRunsTags,
  };
};

export const ExperimentViewRunsControlsActionsSelectTags = ({
  runInfos,
  runsSelected,
  tagsList,
  refreshRuns,
}: {
  runInfos: RunInfoEntity[];
  runsSelected: Record<string, boolean>;
  tagsList: Record<string, KeyValueEntity>[];
  refreshRuns: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean | undefined>>({});
  const [isAddNewTagModalOpen, setIsAddNewTagModalOpen] = useState(false);
  const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
  const [isSavingTagsLoading, setIsSavingTagsLoading] = useState(false);

  const { allSelectedTags, allNotSelectedTags, indeterminateTags, allTags } = getRunsTagsSelection(
    runInfos,
    runsSelected,
    tagsList,
  );

  const openDropdown = (newTag?: KeyValueEntity) => {
    setSelectedTags(() => {
      const selectedValues: Record<string, boolean | undefined> = { ...selectedTags };
      allTags.forEach((tag) => {
        if (allSelectedTags.includes(tag)) {
          selectedValues[tag] = true;
        } else if (allNotSelectedTags.includes(tag)) {
          selectedValues[tag] = false;
        } else if (indeterminateTags.includes(tag)) {
          selectedValues[tag] = undefined;
        }
      });
      if (newTag !== undefined) {
        selectedValues[convertTagToString(newTag)] = true;
      }
      return selectedValues;
    });
    setIsMultiSelectOpen(true);
  };

  const handleChange = (updatedTagString: string) => {
    setSelectedTags((selectedTags) => ({
      ...selectedTags,
      [updatedTagString]: !selectedTags[updatedTagString],
    }));
  };

  const dispatch = useDispatch<ThunkDispatch>();

  const saveTags = () => {
    setIsSavingTagsLoading(true);
    const selectedRunIdxs = runInfos.flatMap((runInfo, idx) => (runsSelected[runInfo.runUuid] ? [idx] : []));
    selectedRunIdxs.forEach((idx) => {
      const runUuid = runInfos[idx].runUuid;
      // Get all non-system tags for the selected run
      const existingKeys = Object.values(tagsList[idx]).filter((tag) => isUserFacingTag(tag.key));
      // Get all new tags that are explicitly selected. If its indeterminate, and the key is in existingKeys, then it should stay
      const newKeys = Object.keys(selectedTags)
        .filter((tag) => {
          if (selectedTags[tag] === undefined) {
            return existingKeys.map((tag) => convertTagToString(tag)).includes(tag);
          } else {
            return selectedTags[tag];
          }
        })
        .map((tagString) => convertStringToTag(tagString));
      dispatch(setRunTagsBulkApi(runUuid, existingKeys, newKeys))
        .then(() => {
          refreshRuns();
        })
        .catch((e) => {
          const message = e instanceof ErrorWrapper ? e.getMessageField() : e.message;
          Utils.displayGlobalErrorNotification(message);
        })
        .finally(() => {
          setIsSavingTagsLoading(false);
          setIsMultiSelectOpen(false);
        });
    });
  };

  const addNewTag = (tag: KeyValueEntity) => {
    openDropdown(tag);
  };

  const addNewTagModal = () => {
    setIsAddNewTagModalOpen(true);
    setIsMultiSelectOpen(false);
  };

  return (
    <>
      <DialogCombobox
        componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsactionsselecttags.tsx_162"
        open={isMultiSelectOpen}
        label="Add tags"
        id="runs-tag-multiselect"
        multiSelect
      >
        <DialogComboboxTrigger
          onClick={() => {
            if (isMultiSelectOpen) {
              setIsMultiSelectOpen(false);
            } else {
              // Open the dropdown and render tag selections.
              openDropdown();
            }
          }}
          data-testid="runs-tag-multiselect-trigger"
        />
        <DialogComboboxContent matchTriggerWidth>
          <DialogComboboxOptionList>
            {Object.keys(selectedTags).map((tagString) => {
              const isIndeterminate = selectedTags[tagString] === undefined;
              return (
                <DialogComboboxOptionListCheckboxItem
                  key={tagString}
                  value={tagString}
                  onChange={handleChange}
                  checked={selectedTags[tagString]}
                  indeterminate={isIndeterminate}
                />
              );
            })}
          </DialogComboboxOptionList>
          <DialogComboboxFooter>
            <div css={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm }}>
              <Button
                componentId="mlflow.experiment_page.runs.add_new_tag"
                onClick={addNewTagModal}
                icon={<PlusIcon />}
                data-testid="runs-add-new-tag-button"
              >
                <FormattedMessage
                  defaultMessage="Add new tag"
                  description="Experiment tracking > experiment page > runs > add new tag button"
                />
              </Button>
              <Button
                type="primary"
                componentId="mlflow.experiment_page.runs.add_tags"
                onClick={saveTags}
                disabled={Object.keys(selectedTags).length === 0}
                loading={isSavingTagsLoading}
              >
                <FormattedMessage
                  defaultMessage="Save"
                  description="Experiment tracking > experiment page > runs > save tags button"
                />
              </Button>
            </div>
          </DialogComboboxFooter>
        </DialogComboboxContent>
      </DialogCombobox>
      <ExperimentViewRunsControlsActionsAddNewTagModal
        isOpen={isAddNewTagModalOpen}
        setIsOpen={setIsAddNewTagModalOpen}
        selectedRunsExistingTagKeys={uniq(
          allSelectedTags.concat(indeterminateTags).map((tag) => convertStringToTag(tag).key),
        )}
        addNewTag={addNewTag}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsFilters.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsFilters.enzyme.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from '../../../../../common/utils/RoutingUtils';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import { experimentRunsSelector } from '../../utils/experimentRuns.selector';
import type { ExperimentViewRunsControlsFiltersProps } from './ExperimentViewRunsControlsFilters';
import { ExperimentViewRunsControlsFilters } from './ExperimentViewRunsControlsFilters';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';

jest.mock('../../../evaluation-artifacts-compare/EvaluationCreatePromptRunModal', () => ({
  EvaluationCreatePromptRunModal: () => <div />,
}));

const MOCK_EXPERIMENT = EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'];

const MOCK_RUNS_DATA = experimentRunsSelector(EXPERIMENT_RUNS_MOCK_STORE, {
  experiments: [MOCK_EXPERIMENT],
});

jest.mock('./ExperimentViewRunsColumnSelector', () => ({
  ExperimentViewRunsColumnSelector: () => <div />,
}));

const mockStore = configureStore([thunk, promiseMiddleware()]);
const minimalStore = mockStore({
  entities: {
    datasetsByExperimentId: {},
    experimentsById: {},
  },
  apis: jest.fn((key) => {
    return {};
  }),
});

const doSimpleMock = (props: ExperimentViewRunsControlsFiltersProps) =>
  mountWithIntl(
    <Provider store={minimalStore}>
      <DesignSystemProvider>
        <IntlProvider locale="en">
          <BrowserRouter>
            <ExperimentViewRunsControlsFilters {...props} />
          </BrowserRouter>
        </IntlProvider>
      </DesignSystemProvider>
    </Provider>,
  );

describe('ExperimentViewRunsControlsFilters', () => {
  test('should render with given search facets model properly', () => {
    const searchFacetsState = createExperimentPageSearchFacetsState();

    const wrapper = doSimpleMock({
      runsData: MOCK_RUNS_DATA,
      experimentId: '123456789',
      onDownloadCsv: () => {},
      viewState: { runsSelected: {}, viewMaximized: false } as any,
      updateViewState: () => {},
      searchFacetsState,
      requestError: null,
      refreshRuns: () => {},
      viewMaximized: false,
    });

    expect(wrapper).toBeTruthy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsFilters.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsFilters.stories.tsx
Signals: React, Redux/RTK

```typescript
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import { ExperimentViewRunsControlsFilters } from './ExperimentViewRunsControlsFilters';
import { experimentRunsSelector } from '../../utils/experimentRuns.selector';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';

const MOCK_EXPERIMENT = EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'];

const MOCK_RUNS_DATA = experimentRunsSelector(EXPERIMENT_RUNS_MOCK_STORE, {
  experiments: [MOCK_EXPERIMENT],
});

const MOCK_ACTIONS = {
  searchRunsPayload: () => Promise.resolve({}),
  searchRunsApi: () => ({ type: 'foobar', payload: Promise.resolve({}), meta: {} }),
};

export default {
  title: 'ExperimentView/ExperimentViewRunsControlsFilters',
  component: ExperimentViewRunsControlsFilters,
  argTypes: {},
};

export const Default = () => {
  const [searchFacetsState] = useState(() => createExperimentPageSearchFacetsState());
  const [messages] = useState<string[]>([]);

  return (
    <Provider
      store={createStore(
        // Identity reducer
        (s) => s as any,
        EXPERIMENT_RUNS_MOCK_STORE,
        compose(applyMiddleware(promiseMiddleware())),
      )}
    >
      <IntlProvider locale="en">
        <MemoryRouter>
          <div
            css={{
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: '1px solid #ccc',
            }}
          >
            <h2>Component:</h2>
          </div>
          <ExperimentViewRunsControlsFilters
            runsData={MOCK_RUNS_DATA}
            searchFacetsState={searchFacetsState}
            experimentId="123"
            viewState={{} as any}
            updateViewState={() => {}}
            onDownloadCsv={() => {
              // eslint-disable-next-line no-alert
              window.alert('Downloading dummy CSV...');
            }}
            requestError={null}
            refreshRuns={() => {}}
            viewMaximized={false}
          />
          <div
            css={{
              marginTop: 20,
              paddingTop: 10,
              borderTop: '1px solid #ccc',
            }}
          >
            <h2>Debug info:</h2>
            <h3>Current search-sort-filter state:</h3>
            <div css={{ fontFamily: 'monospace', marginBottom: 10 }}>{JSON.stringify(searchFacetsState)}</div>
            <h3>Log:</h3>
            {messages.map((m, i) => (
              <div key={i} css={{ fontFamily: 'monospace' }}>
                - {m}
              </div>
            ))}
          </div>
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControlsFilters.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControlsFilters.tsx
Signals: React, Redux/RTK

```typescript
import {
  Button,
  Tag,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  DialogComboboxOptionListSelectItem,
  DialogComboboxOptionListSearch,
  DialogComboboxTrigger,
  DownloadIcon,
  ClipboardIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  OverflowIcon,
  PlusIcon,
  SidebarIcon,
  Tooltip,
  useDesignSystemTheme,
  DropdownMenu,
  ToggleButton,
  SegmentedControlGroup,
  SegmentedControlButton,
  ListIcon,
  ChartLineIcon,
  TableIcon,
} from '@databricks/design-system';
import { Theme } from '@emotion/react';

import { shouldEnablePromptLab } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { ToggleIconButton } from '../../../../../common/components/ToggleIconButton';
import type { ErrorWrapper } from '../../../../../common/utils/ErrorWrapper';
import { LIFECYCLE_FILTER } from '../../../../constants';
import type { UpdateExperimentViewStateFn } from '../../../../types';
import { useExperimentIds } from '../../hooks/useExperimentIds';
import type { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import { getStartTimeColumnDisplayName } from '../../utils/experimentPage.common-utils';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { RunsSearchAutoComplete } from './RunsSearchAutoComplete';
import type { ExperimentStoreEntities, DatasetSummary, ExperimentViewRunsCompareMode } from '../../../../types';
import { datasetSummariesEqual } from '../../../../utils/DatasetUtils';
import { CreateNotebookRunModal } from '@mlflow/mlflow/src/experiment-tracking/components/evaluation-artifacts-compare/CreateNotebookRunModal';
import { PreviewBadge } from '@mlflow/mlflow/src/shared/building_blocks/PreviewBadge';
import { useCreateNewRun } from '../../hooks/useCreateNewRun';
import { useExperimentPageViewMode } from '../../hooks/useExperimentPageViewMode';
import { useUpdateExperimentPageSearchFacets } from '../../hooks/useExperimentPageSearchFacets';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { useUpdateExperimentViewUIState } from '../../contexts/ExperimentPageUIStateContext';

export type ExperimentViewRunsControlsFiltersProps = {
  searchFacetsState: ExperimentPageSearchFacetsState;
  experimentId: string;
  viewState: ExperimentPageViewState;
  updateViewState: UpdateExperimentViewStateFn;
  runsData: ExperimentRunsSelectorResult;
  onDownloadCsv: () => void;
  requestError: ErrorWrapper | Error | null;
  additionalControls?: React.ReactNode;
  refreshRuns: () => void;
  viewMaximized: boolean;
  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;
  areRunsGrouped?: boolean;
};

export const ExperimentViewRunsControlsFilters = React.memo(
  ({
    searchFacetsState,
    experimentId,
    runsData,
    viewState,
    updateViewState,
    onDownloadCsv,
    requestError,
    additionalControls,
    refreshRuns,
    viewMaximized,
    autoRefreshEnabled = false,
    hideEmptyCharts = false,
    areRunsGrouped = false,
  }: ExperimentViewRunsControlsFiltersProps) => {
    const setUrlSearchFacets = useUpdateExperimentPageSearchFacets();

    const [pageViewMode, setViewModeInURL] = useExperimentPageViewMode();
    const updateUIState = useUpdateExperimentViewUIState();

    const isComparingExperiments = useExperimentIds().length > 1;
    const { startTime, lifecycleFilter, datasetsFilter, searchFilter } = searchFacetsState;

    // Use modernized view mode value getter if flag is set
    const compareRunsMode = pageViewMode;

    const intl = useIntl();
    const { createNewRun } = useCreateNewRun();
    const [isCreateRunWithNotebookModalOpen, setCreateRunWithNotebookModalOpenValue] = useState(false);
    const { theme } = useDesignSystemTheme();

    // List of labels for "start time" filter
    const startTimeColumnLabels: Record<string, string> = useMemo(() => getStartTimeColumnDisplayName(intl), [intl]);

    const currentLifecycleFilterValue =
      lifecycleFilter === LIFECYCLE_FILTER.ACTIVE
        ? intl.formatMessage({
            defaultMessage: 'Active',
            description: 'Linked model dropdown option to show active experiment runs',
          })
        : intl.formatMessage({
            defaultMessage: 'Deleted',
            description: 'Linked model dropdown option to show deleted experiment runs',
          });

    const currentStartTimeFilterLabel = intl.formatMessage({
      defaultMessage: 'Time created',
      description: 'Label for the start time select dropdown for experiment runs view',
    });

    // Show preview sidebar only on table view and artifact view
    const displaySidebarToggleButton = compareRunsMode === undefined || compareRunsMode === 'ARTIFACT';

    const datasetSummaries: DatasetSummary[] = useSelector(
      (state: { entities: ExperimentStoreEntities }) => state.entities.datasetsByExperimentId[experimentId],
    );

    const updateDatasetsFilter = (summary: DatasetSummary) => {
      const newDatasetsFilter = datasetsFilter.some((item) => datasetSummariesEqual(item, summary))
        ? datasetsFilter.filter((item) => !datasetSummariesEqual(item, summary))
        : [...datasetsFilter, summary];

      setUrlSearchFacets({
        datasetsFilter: newDatasetsFilter,
      });
    };

    const hasDatasets = datasetSummaries !== undefined;

    const searchFilterChange = (newSearchFilter: string) => {
      setUrlSearchFacets({ searchFilter: newSearchFilter });
    };

    return (
      <div
        css={{
          display: 'flex',
          gap: theme.spacing.sm,
          justifyContent: 'space-between',
          [theme.responsive.mediaQueries.xs]: {
            flexDirection: 'column',
          },
        }}
      >
        <div
          css={{
            display: 'flex',
            gap: theme.spacing.sm,
            alignItems: 'center',
            flexWrap: 'wrap' as const,
          }}
        >
          <SegmentedControlGroup
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_184"
            name="runs-view-mode"
            value={pageViewMode}
            onChange={({ target }) => {
              const { value } = target;
              const newValue = value as ExperimentViewRunsCompareMode;

              if (pageViewMode === newValue) {
                return;
              }

              setViewModeInURL(newValue);
            }}
          >
            <SegmentedControlButton
              value="TABLE"
              icon={
                <Tooltip
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_201"
                  content={intl.formatMessage({
                    defaultMessage: 'Table view',
                    description: 'Experiment page > control bar > table view toggle button tooltip',
                  })}
                >
                  <ListIcon />
                </Tooltip>
              }
            />
            <SegmentedControlButton
              value="CHART"
              icon={
                <Tooltip
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_211"
                  content={intl.formatMessage({
                    defaultMessage: 'Chart view',
                    description: 'Experiment page > control bar > chart view toggle button tooltip',
                  })}
                >
                  <ChartLineIcon />
                </Tooltip>
              }
            />
            <SegmentedControlButton
              value="ARTIFACT"
              disabled={areRunsGrouped}
              icon={
                <Tooltip
                  componentId="mlflow.experiment_page.mode.artifact"
                  content={
                    areRunsGrouped
                      ? intl.formatMessage({
                          defaultMessage: 'Unavailable when runs are grouped',
                          description: 'Experiment page > view mode switch > evaluation mode disabled tooltip',
                        })
                      : intl.formatMessage({
                          defaultMessage: 'Artifact evaluation',
                          description:
                            'A tooltip for the view mode switcher in the experiment view, corresponding to artifact evaluation view',
                        })
                  }
                >
                  <TableIcon />
                </Tooltip>
              }
            />
          </SegmentedControlGroup>

          <RunsSearchAutoComplete
            runsData={runsData}
            searchFilter={searchFilter}
            onSearchFilterChange={searchFilterChange}
            onClear={() => {
              setUrlSearchFacets(createExperimentPageSearchFacetsState());
            }}
            requestError={requestError}
          />

          <DialogCombobox
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_217"
            label={currentStartTimeFilterLabel}
            value={startTime !== 'ALL' ? [startTimeColumnLabels[startTime]] : []}
          >
            <DialogComboboxTrigger
              allowClear={startTime !== 'ALL'}
              onClear={() => {
                setUrlSearchFacets({ startTime: 'ALL' });
              }}
              data-testid="start-time-select-dropdown"
            />
            <DialogComboboxContent>
              <DialogComboboxOptionList>
                {Object.keys(startTimeColumnLabels).map((startTimeKey) => (
                  <DialogComboboxOptionListSelectItem
                    key={startTimeKey}
                    checked={startTimeKey === startTime}
                    title={startTimeColumnLabels[startTimeKey]}
                    data-testid={`start-time-select-${startTimeKey}`}
                    value={startTimeKey}
                    onChange={() => {
                      setUrlSearchFacets({ startTime: startTimeKey });
                    }}
                  >
                    {startTimeColumnLabels[startTimeKey]}
                  </DialogComboboxOptionListSelectItem>
                ))}
              </DialogComboboxOptionList>
            </DialogComboboxContent>
          </DialogCombobox>

          <DialogCombobox
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_248"
            label={intl.formatMessage({
              defaultMessage: 'State',
              description: 'Filtering label to filter experiments based on state of active or deleted',
            })}
            value={[currentLifecycleFilterValue]}
          >
            <DialogComboboxTrigger allowClear={false} data-testid="lifecycle-filter" />
            <DialogComboboxContent>
              <DialogComboboxOptionList>
                <DialogComboboxOptionListSelectItem
                  checked={lifecycleFilter === LIFECYCLE_FILTER.ACTIVE}
                  key={LIFECYCLE_FILTER.ACTIVE}
                  data-testid="active-runs-menu-item"
                  value={LIFECYCLE_FILTER.ACTIVE}
                  onChange={() => {
                    setUrlSearchFacets({ lifecycleFilter: LIFECYCLE_FILTER.ACTIVE });
                  }}
                >
                  <FormattedMessage
                    defaultMessage="Active"
                    description="Linked model dropdown option to show active experiment runs"
                  />
                </DialogComboboxOptionListSelectItem>
                <DialogComboboxOptionListSelectItem
                  checked={lifecycleFilter === LIFECYCLE_FILTER.DELETED}
                  key={LIFECYCLE_FILTER.DELETED}
                  data-testid="deleted-runs-menu-item"
                  value={LIFECYCLE_FILTER.DELETED}
                  onChange={() => {
                    setUrlSearchFacets({ lifecycleFilter: LIFECYCLE_FILTER.DELETED });
                  }}
                >
                  <FormattedMessage
                    defaultMessage="Deleted"
                    description="Linked model dropdown option to show deleted experiment runs"
                  />
                </DialogComboboxOptionListSelectItem>
              </DialogComboboxOptionList>
            </DialogComboboxContent>
          </DialogCombobox>
          <DialogCombobox
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_289"
            label={intl.formatMessage({
              defaultMessage: 'Datasets',
              description: 'Filtering label to filter runs based on datasets used',
            })}
            value={datasetsFilter.map((datasetSummary) => datasetSummary.name)}
            multiSelect
          >
            <Tooltip
              componentId="mlflow.experiment-tracking.runs-filters.clear-1"
              content={
                !hasDatasets && (
                  <FormattedMessage
                    defaultMessage="No datasets were recorded for this experiment's runs."
                    description="Message to indicate that no datasets were recorded for this experiment's runs."
                  />
                )
              }
            >
              <>
                <DialogComboboxTrigger
                  allowClear
                  onClear={() => setUrlSearchFacets({ datasetsFilter: [] })}
                  data-testid="datasets-select-dropdown"
                  showTagAfterValueCount={1}
                  disabled={!hasDatasets}
                />
                {hasDatasets && (
                  <DialogComboboxContent maxHeight={600}>
                    <DialogComboboxOptionList>
                      <DialogComboboxOptionListSearch>
                        {datasetSummaries.map((summary: DatasetSummary) => (
                          <DialogComboboxOptionListCheckboxItem
                            key={summary.name + summary.digest + summary.context}
                            checked={datasetsFilter.some((item) => datasetSummariesEqual(item, summary))}
                            title={summary.name}
                            data-testid={`dataset-dropdown-${summary.name}`}
                            value={summary.name}
                            onChange={() => updateDatasetsFilter(summary)}
                          >
                            {summary.name} ({summary.digest}){' '}
                            {summary.context && (
                              <Tag
                                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_329"
                                css={{ textTransform: 'capitalize', marginRight: theme.spacing.xs }}
                              >
                                {summary.context}
                              </Tag>
                            )}
                          </DialogComboboxOptionListCheckboxItem>
                        ))}
                      </DialogComboboxOptionListSearch>
                    </DialogComboboxOptionList>
                  </DialogComboboxContent>
                )}
              </>
            </Tooltip>
          </DialogCombobox>
          {additionalControls}
        </div>
        <div
          css={{
            display: 'flex',
            gap: theme.spacing.sm,
            alignItems: 'flex-start',
          }}
        >
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_338"
                icon={<OverflowIcon />}
                aria-label={intl.formatMessage({
                  defaultMessage: 'More options',
                  description: 'Experiment page > control bar > more options button accessible label',
                })}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_362"
                className="csv-button"
                onClick={onDownloadCsv}
              >
                <DropdownMenu.IconWrapper>
                  <DownloadIcon />
                </DropdownMenu.IconWrapper>
                {`Download ${runsData.runInfos.length} runs`}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.CheckboxItem
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_382"
                checked={hideEmptyCharts}
                onClick={() =>
                  updateUIState((state) => ({
                    ...state,
                    hideEmptyCharts: !state.hideEmptyCharts,
                  }))
                }
              >
                <DropdownMenu.ItemIndicator />
                <FormattedMessage
                  defaultMessage="Hide charts with no data"
                  description="Experiment page > control bar > label for a checkbox toggle button that hides chart cards with no corresponding data"
                />
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.Separator />
              <DropdownMenu.CheckboxItem
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_402"
                checked={autoRefreshEnabled}
                onClick={() =>
                  updateUIState((state) => ({
                    ...state,
                    autoRefreshEnabled: !state.autoRefreshEnabled,
                  }))
                }
              >
                <DropdownMenu.ItemIndicator />
                <FormattedMessage
                  defaultMessage="Auto-refresh"
                  description="String for the auto-refresh button that refreshes the runs list automatically"
                />
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <CreateNotebookRunModal
            isOpen={isCreateRunWithNotebookModalOpen}
            closeModal={() => setCreateRunWithNotebookModalOpenValue(false)}
            experimentId={experimentId}
          />

          {displaySidebarToggleButton && (
            <Tooltip
              componentId="mlflow.experiment-tracking.runs-filters.toggle-sidepane"
              content={intl.formatMessage({
                defaultMessage: 'Toggle the preview sidepane',
                description: 'Experiment page > control bar > expanded view toggle button tooltip',
              })}
            >
              <ToggleIconButton
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_403"
                pressed={viewState.previewPaneVisible}
                icon={<SidebarIcon />}
                onClick={() => updateViewState({ previewPaneVisible: !viewState.previewPaneVisible })}
              />
            </Tooltip>
          )}
          {/* TODO: Add tooltip to guide users to this button */}
          {!isComparingExperiments && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_415"
                  icon={<PlusIcon />}
                >
                  <FormattedMessage
                    defaultMessage="New run"
                    description="Button used to pop up a modal to create a new run"
                  />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {shouldEnablePromptLab() && (
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_461"
                    onSelect={() => createNewRun()}
                  >
                    {' '}
                    <FormattedMessage
                      defaultMessage="using Prompt Engineering"
                      description="String for creating a new run with prompt engineering modal"
                    />
                    <PreviewBadge />
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscontrolsfilters.tsx_469"
                  onSelect={() => setCreateRunWithNotebookModalOpenValue(true)}
                >
                  {' '}
                  <FormattedMessage
                    defaultMessage="using Notebook"
                    description="String for creating a new run from a notebook"
                  />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>
      </div>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsEmptyTable.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsEmptyTable.enzyme.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { LoggingRunsDocUrl } from '../../../../../common/constants';
import { ExperimentViewRunsEmptyTable } from './ExperimentViewRunsEmptyTable';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

describe('ExperimentRunsTableEmptyOverlay', () => {
  let wrapper;

  test('should render button when runs are filtered', () => {
    wrapper = mountWithIntl(<ExperimentViewRunsEmptyTable onClearFilters={() => {}} isFiltered />);
    expect(wrapper.find('Button')).toHaveLength(1);
  });

  test('should render correct link', () => {
    wrapper = mountWithIntl(<ExperimentViewRunsEmptyTable onClearFilters={() => {}} isFiltered={false} />);
    // eslint-disable-next-line jest/no-standalone-expect
    expect(wrapper.find(`a[href="${LoggingRunsDocUrl}"]`)).toHaveLength(1);
  });
});
```

--------------------------------------------------------------------------------

````
