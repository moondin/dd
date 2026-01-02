---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 483
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 483 of 991)

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

---[FILE: ExperimentViewRunsSortSelectorV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsSortSelectorV2.tsx
Signals: React

```typescript
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  Input,
  SearchIcon,
  useDesignSystemTheme,
  DropdownMenu,
  Button,
  ChevronDownIcon,
} from '@databricks/design-system';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { middleTruncateStr } from '../../../../../common/utils/StringUtils';
import { ATTRIBUTE_COLUMN_SORT_KEY, ATTRIBUTE_COLUMN_SORT_LABEL, COLUMN_TYPES } from '../../../../constants';
import { useUpdateExperimentPageSearchFacets } from '../../hooks/useExperimentPageSearchFacets';
import { useUpdateExperimentViewUIState } from '../../contexts/ExperimentPageUIStateContext';
import { ToggleIconButton } from '../../../../../common/components/ToggleIconButton';
import { makeCanonicalSortKey } from '../../utils/experimentPage.common-utils';
import { customMetricBehaviorDefs } from '../../utils/customMetricBehaviorUtils';

type SORT_KEY_TYPE = keyof (typeof ATTRIBUTE_COLUMN_SORT_KEY & typeof ATTRIBUTE_COLUMN_SORT_LABEL);

const ExperimentViewRunsSortSelectorV2Body = ({
  sortOptions,
  orderByKey,
  orderByAsc,
  onOptionSelected,
}: {
  sortOptions: {
    label: string;
    value: string;
  }[];
  orderByKey: string;
  orderByAsc: boolean;
  onOptionSelected: () => void;
}) => {
  const { theme } = useDesignSystemTheme();

  const setUrlSearchFacets = useUpdateExperimentPageSearchFacets();
  const updateUIState = useUpdateExperimentViewUIState();
  const inputElementRef = useRef<React.ComponentRef<typeof Input>>(null);
  const [filter, setFilter] = useState('');
  const firstElementRef = useRef<HTMLDivElement>(null);

  // Merge all sort options and filter them by the search query
  const filteredSortOptions = useMemo(
    () =>
      sortOptions.filter((option) => {
        return option.label.toLowerCase().includes(filter.toLowerCase());
      }),
    [sortOptions, filter],
  );

  const handleChange = (orderByKey: string) => {
    setUrlSearchFacets({
      orderByKey,
    });

    updateUIState((currentUIState) => {
      if (!currentUIState.selectedColumns.includes(orderByKey)) {
        return {
          ...currentUIState,
          selectedColumns: [...currentUIState.selectedColumns, orderByKey],
        };
      }
      return currentUIState;
    });

    onOptionSelected();
  };
  const setOrder = (ascending: boolean) => {
    setUrlSearchFacets({
      orderByAsc: ascending,
    });
    onOptionSelected();
  };

  // Autofocus won't work everywhere so let's focus input everytime the dropdown is opened
  useEffect(() => {
    requestAnimationFrame(() => {
      inputElementRef.current?.focus();
    });
  }, []);

  return (
    <>
      <div
        css={{
          padding: `${theme.spacing.sm}px ${theme.spacing.lg / 2}px ${theme.spacing.sm}px`,
          width: '100%',
          display: 'flex',
          gap: theme.spacing.xs,
        }}
      >
        <Input
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunssortselectorv2.tsx_97"
          prefix={<SearchIcon />}
          value={filter}
          type="search"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search"
          autoFocus
          ref={inputElementRef}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Tab') {
              firstElementRef.current?.focus();
              return;
            }
            e.stopPropagation();
          }}
        />
        <div
          css={{
            display: 'flex',
            gap: theme.spacing.xs,
          }}
        >
          <ToggleIconButton
            pressed={!orderByAsc}
            icon={<ArrowDownIcon />}
            componentId="mlflow.experiment_page.sort_select_v2.sort_desc"
            onClick={() => setOrder(false)}
            aria-label="Sort descending"
            data-testid="sort-select-desc"
          />
          <ToggleIconButton
            pressed={orderByAsc}
            icon={<ArrowUpIcon />}
            componentId="mlflow.experiment_page.sort_select_v2.sort_asc"
            onClick={() => setOrder(true)}
            aria-label="Sort ascending"
            data-testid="sort-select-asc"
          />
        </div>
      </div>
      <DropdownMenu.Group css={{ maxHeight: 400, overflowY: 'auto' }}>
        {filteredSortOptions.map((sortOption, index) => (
          <DropdownMenu.CheckboxItem
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunssortselectorv2.tsx_137"
            key={sortOption.value}
            onClick={() => handleChange(sortOption.value)}
            checked={sortOption.value === orderByKey}
            data-testid={`sort-select-${sortOption.label}`}
            ref={index === 0 ? firstElementRef : undefined}
          >
            <DropdownMenu.ItemIndicator />
            <span css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {middleTruncateStr(sortOption.label, 50)}
            </span>
          </DropdownMenu.CheckboxItem>
        ))}
        {!filteredSortOptions.length && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunssortselectorv2.tsx_151"
            disabled
          >
            <FormattedMessage
              defaultMessage="No results"
              description="Experiment page > sort selector > no results after filtering by search query"
            />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Group>
    </>
  );
};

export const ExperimentViewRunsSortSelectorV2 = React.memo(
  ({
    metricKeys,
    paramKeys,
    orderByAsc,
    orderByKey,
  }: {
    orderByKey: string;
    orderByAsc: boolean;
    metricKeys: string[];
    paramKeys: string[];
  }) => {
    const intl = useIntl();
    const [open, setOpen] = useState(false);
    const { theme } = useDesignSystemTheme();

    // Get sort options for attributes (e.g. start time, run name, etc.)
    const attributeSortOptions = useMemo(
      () =>
        Object.keys(ATTRIBUTE_COLUMN_SORT_LABEL).map((sortLabelKey) => ({
          label: ATTRIBUTE_COLUMN_SORT_LABEL[sortLabelKey as SORT_KEY_TYPE],
          value: ATTRIBUTE_COLUMN_SORT_KEY[sortLabelKey as SORT_KEY_TYPE],
        })),
      [],
    );

    // Get sort options for metrics
    const metricsSortOptions = useMemo(
      () =>
        metricKeys.map((sortLabelKey) => {
          const canonicalSortKey = makeCanonicalSortKey(COLUMN_TYPES.METRICS, sortLabelKey);
          const displayName = customMetricBehaviorDefs[sortLabelKey]?.displayName ?? sortLabelKey;
          return {
            label: displayName,
            value: canonicalSortKey,
          };
        }),
      [
        // A list of metric key names that need to be turned into canonical sort keys
        metricKeys,
      ],
    );

    // Get sort options for params
    const paramsSortOptions = useMemo(
      () =>
        paramKeys.map((sortLabelKey) => ({
          label: sortLabelKey,
          value: `${makeCanonicalSortKey(COLUMN_TYPES.PARAMS, sortLabelKey)}`,
        })),
      [paramKeys],
    );

    const sortOptions = useMemo(
      () => [...attributeSortOptions, ...metricsSortOptions, ...paramsSortOptions],
      [attributeSortOptions, metricsSortOptions, paramsSortOptions],
    );

    // Generate the label for the sort select dropdown
    const currentSortSelectLabel = useMemo(() => {
      // Search through all sort options generated basing on the fetched runs
      const sortOption = sortOptions.find((option) => option.value === orderByKey);

      let sortOptionLabel = sortOption?.label;

      // If the actually chosen sort value is not found in the sort option list (e.g. because the list of fetched runs is empty),
      // use it to generate the label
      if (!sortOptionLabel) {
        // The following regex extracts plain sort key name from its canonical form, i.e.
        // metrics.`metric_key_name` => metric_key_name
        const extractedKeyName = orderByKey.match(/^.+\.`(.+)`$/);
        if (extractedKeyName) {
          // eslint-disable-next-line prefer-destructuring
          sortOptionLabel = extractedKeyName[1];
        }
      }
      return `${intl.formatMessage({
        defaultMessage: 'Sort',
        description: 'Experiment page > sort selector > label for the dropdown button',
      })}: ${sortOptionLabel}`;
    }, [sortOptions, intl, orderByKey]);

    return (
      <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenu.Trigger data-testid="sort-select-dropdown" asChild>
          <Button
            componentId="mlflow.experiment_page.sort_select_v2.toggle"
            icon={orderByAsc ? <SortAscendingIcon /> : <SortDescendingIcon />}
            css={{ minWidth: 32 }}
            aria-label={currentSortSelectLabel}
            endIcon={<ChevronDownIcon />}
          >
            {currentSortSelectLabel}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content minWidth={250}>
          <ExperimentViewRunsSortSelectorV2Body
            sortOptions={sortOptions}
            orderByKey={orderByKey}
            orderByAsc={orderByAsc}
            onOptionSelected={() => setOpen(false)}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsTable.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTable.enzyme.test.tsx

```typescript
import { jest, describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { mount } from 'enzyme';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import { useRunsColumnDefinitions } from '../../utils/experimentPage.column-utils';
import type { ExperimentViewRunsTableProps } from './ExperimentViewRunsTable';
import { ExperimentViewRunsTable } from './ExperimentViewRunsTable';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { createExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { MockedReduxStoreProvider } from '../../../../../common/utils/TestUtils';
import { COLUMN_TYPES } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { makeCanonicalSortKey } from '../../utils/experimentPage.common-utils';

/**
 * Mock all expensive utility functions
 */
jest.mock('../../utils/experimentPage.column-utils', () => ({
  ...jest.requireActual<typeof import('../../utils/experimentPage.column-utils')>(
    '../../utils/experimentPage.column-utils',
  ),
  useRunsColumnDefinitions: jest.fn(() => []),
}));

/**
 * Mock all external components for performant mount() usage
 */
jest.mock('./ExperimentViewRunsEmptyTable', () => ({
  ExperimentViewRunsEmptyTable: () => <div />,
}));

/**
 * Mock all external components for performant mount() usage
 */
jest.mock('./ExperimentViewRunsTableStatusBar', () => ({
  ExperimentViewRunsTableStatusBar: () => <div />,
}));

// ExperimentViewRunsTableAddColumnCTA isn't supported in this test as it uses ResizeObserver
jest.mock('./ExperimentViewRunsTableAddColumnCTA', () => ({
  ExperimentViewRunsTableAddColumnCTA: () => null,
}));

const mockGridApi = {
  showLoadingOverlay: jest.fn(),
  hideOverlay: jest.fn(),
  setRowData: jest.fn(),
  resetRowHeights: jest.fn(),
};

jest.mock('../../../../../common/components/ag-grid/AgGridLoader', () => {
  const columnApiMock = {};
  return {
    MLFlowAgGridLoader: ({ onGridReady }: any) => {
      onGridReady({
        api: mockGridApi,
        columnApi: columnApiMock,
      });
      return <div />;
    },
  };
});

/**
 * Mock <FormattedMessage /> instead of providing intl context to make
 * settings enzyme wrapper's props prossible
 */
jest.mock('react-intl', () => ({
  ...jest.requireActual<typeof import('react-intl')>('react-intl'),
  FormattedMessage: () => <div />,
}));

const mockTagKeys = Object.keys(EXPERIMENT_RUNS_MOCK_STORE.entities.tagsByRunUuid['experiment123456789_run1']);

describe('ExperimentViewRunsTable', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2022, 0, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const defaultProps: ExperimentViewRunsTableProps = {
    experiments: [EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789']],
    moreRunsAvailable: false,
    isLoading: false,
    onAddColumnClicked() {},
    runsData: {
      paramKeyList: ['p1', 'p2', 'p3'],
      metricKeyList: ['m1', 'm2', 'm3'],
      tagsList: [EXPERIMENT_RUNS_MOCK_STORE.entities.tagsByRunUuid['experiment123456789_run1']],
      runInfos: [EXPERIMENT_RUNS_MOCK_STORE.entities.runInfosByUuid['experiment123456789_run1']],
      paramsList: [[{ key: 'p1', value: 'pv1' }]],
      metricsList: [[{ key: 'm1', value: 'mv1' }]],
      runUuidsMatchingFilter: ['experiment123456789_run1'],
    } as any,
    rowsData: [{ runUuid: 'experiment123456789_run1' } as any],
    searchFacetsState: Object.assign(createExperimentPageSearchFacetsState(), {
      runsPinned: ['experiment123456789_run1'],
    }),
    viewState: new ExperimentPageViewState(),
    uiState: createExperimentPageUIState(),
    updateViewState() {},
    loadMoreRunsFunc: jest.fn(),
    expandRows: false,
    compareRunsMode: 'TABLE',
  };

  const createWrapper = (additionalProps: Partial<ExperimentViewRunsTableProps> = {}) =>
    mount(<ExperimentViewRunsTable {...defaultProps} {...additionalProps} />, {
      wrappingComponent: ({ children }: React.PropsWithChildren<unknown>) => (
        <MemoryRouter>
          <MockedReduxStoreProvider>{children}</MockedReduxStoreProvider>
        </MemoryRouter>
      ),
    });

  const createLargeDatasetProps = (selectedKey: string, columnType: string) => {
    const largeParamKeyList = Array.from({ length: 400 }, (_, i) => `p${i}`);
    const largeMetricKeyList = Array.from({ length: 400 }, (_, i) => `m${i}`);
    const largeTags: Record<string, { key: string; value: string }> = {};

    // Add the selected key to the appropriate list
    if (columnType === COLUMN_TYPES.PARAMS) {
      largeParamKeyList.push(selectedKey);
    } else if (columnType === COLUMN_TYPES.METRICS) {
      largeMetricKeyList.push(selectedKey);
    } else if (columnType === COLUMN_TYPES.TAGS) {
      largeTags[selectedKey] = { key: selectedKey, value: 'testvalue' };
    }

    // Create enough tags to exceed threshold
    for (let i = 0; i < 201; i++) {
      largeTags[`tag${i}`] = { key: `tag${i}`, value: `value${i}` };
    }

    return {
      runsData: {
        ...defaultProps.runsData,
        paramKeyList: largeParamKeyList,
        metricKeyList: largeMetricKeyList,
        tagsList: [largeTags],
      },
      uiState: Object.assign(createExperimentPageUIState(), {
        selectedColumns: [makeCanonicalSortKey(columnType, selectedKey)],
      }),
    };
  };

  test('should properly call creating column definitions function', () => {
    createWrapper();
    expect(useRunsColumnDefinitions).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedColumns: expect.anything(),
        compareExperiments: false,
        metricKeyList: ['m1', 'm2', 'm3'],
        paramKeyList: ['p1', 'p2', 'p3'],
        tagKeyList: mockTagKeys,
        columnApi: expect.anything(),
      }),
    );
  });

  test('should pass selected tag columns to column definitions', () => {
    const tagKey = mockTagKeys[0];
    createWrapper({
      uiState: Object.assign(createExperimentPageUIState(), {
        selectedColumns: [makeCanonicalSortKey(COLUMN_TYPES.TAGS, tagKey)],
      }),
    });
    expect(useRunsColumnDefinitions).toHaveBeenCalledWith(expect.objectContaining({ tagKeyList: mockTagKeys }));
  });

  test('should filter tag columns when shouldOptimize is true', () => {
    const tagKey = 'testtag1';
    createWrapper(createLargeDatasetProps(tagKey, COLUMN_TYPES.TAGS));

    const lastCall = jest.mocked(useRunsColumnDefinitions).mock.calls.slice(-1)[0][0] as any;
    expect(lastCall.tagKeyList).toEqual([tagKey]);
  });

  test('should filter metric columns when shouldOptimize is true', () => {
    const metricKey = 'testmetric1';
    createWrapper(createLargeDatasetProps(metricKey, COLUMN_TYPES.METRICS));

    const lastCall = jest.mocked(useRunsColumnDefinitions).mock.calls.slice(-1)[0][0] as any;
    expect(lastCall.metricKeyList).toEqual([metricKey]);
  });

  test('should filter param columns when shouldOptimize is true', () => {
    const paramKey = 'testparam1';
    createWrapper(createLargeDatasetProps(paramKey, COLUMN_TYPES.PARAMS));

    const lastCall = jest.mocked(useRunsColumnDefinitions).mock.calls.slice(-1)[0][0] as any;
    expect(lastCall.paramKeyList).toEqual([paramKey]);
  });

  test('should properly generate new column data on the new runs data', () => {
    const wrapper = createWrapper();

    // Assert that we're not calling for generating columns
    // while having "newparam" parameter
    expect(useRunsColumnDefinitions).not.toHaveBeenCalledWith(
      expect.objectContaining({
        paramKeyList: ['p1', 'p2', 'p3', 'newparam'],
      }),
    );

    // Update the param key list with "newparam" as a new entry
    wrapper.setProps({
      runsData: { ...defaultProps.runsData, paramKeyList: ['p1', 'p2', 'p3', 'newparam'] },
    });

    // Assert that "newparam" parameter is being included in calls
    // for new columns
    expect(useRunsColumnDefinitions).toHaveBeenCalledWith(
      expect.objectContaining({
        paramKeyList: ['p1', 'p2', 'p3', 'newparam'],
      }),
    );
  });

  test('should display no data overlay with proper configuration and only when necessary', () => {
    // Prepare a runs grid data with an empty set
    const emptyExperimentsWrapper = createWrapper({ rowsData: [] });

    // Assert empty overlay being displayed and indicating that runs are *not* filtered
    expect(emptyExperimentsWrapper.find('ExperimentViewRunsEmptyTable').length).toBe(1);
    expect(emptyExperimentsWrapper.find('ExperimentViewRunsEmptyTable').prop('isFiltered')).toBe(false);

    // Set up some filter
    emptyExperimentsWrapper.setProps({
      searchFacetsState: Object.assign(createExperimentPageSearchFacetsState(), {
        searchFilter: 'something',
      }),
    });

    // Assert empty overlay being displayed and indicating that runs *are* filtered
    expect(emptyExperimentsWrapper.find('ExperimentViewRunsEmptyTable').prop('isFiltered')).toBe(true);
  });

  test('should hide no data overlay when necessary', () => {
    // Prepare a runs grid data with a non-empty set
    const containingExperimentsWrapper = createWrapper();

    // Assert empty overlay being not displayed
    expect(containingExperimentsWrapper.find('ExperimentViewRunsEmptyTable').length).toBe(0);
  });

  test('should properly show "load more" button when necessary', () => {
    mockGridApi.setRowData.mockClear();

    // Prepare a runs grid data with a non-empty set
    const containingExperimentsWrapper = createWrapper({ moreRunsAvailable: false });

    // Assert "load more" row not being sent to agGrid
    expect(mockGridApi.setRowData).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ isLoadMoreRow: true })]),
    );

    // Change the more runs flag to true
    containingExperimentsWrapper.setProps({
      moreRunsAvailable: true,
    });

    // Assert "load more" row being added to payload
    expect(mockGridApi.setRowData).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ isLoadMoreRow: true })]),
    );
  });

  test('should display proper status bar with runs length', () => {
    const wrapper = createWrapper();

    // Find status bar and expect it to display 1 run
    expect(wrapper.find('ExperimentViewRunsTableStatusBar').prop('allRunsCount')).toEqual(1);

    // Change the filtered run set so it mimics the scenario where used has unpinned the row
    wrapper.setProps({
      runsData: { ...defaultProps.runsData, runUuidsMatchingFilter: [] },
      searchFacetsState: Object.assign(createExperimentPageSearchFacetsState(), {
        runsPinned: [],
      }),
    });

    // Find status bar and expect it to display 0 runs
    expect(wrapper.find('ExperimentViewRunsTableStatusBar').prop('allRunsCount')).toEqual(0);
    expect(wrapper.find('ExperimentViewRunsTableStatusBar').prop('isLoading')).toEqual(false);

    // Set loading flag to true
    wrapper.setProps({ isLoading: true });

    // Expect status bar to display spinner as well
    expect(wrapper.find('ExperimentViewRunsTableStatusBar').prop('isLoading')).toEqual(true);
  });

  test('should hide column CTA when all columns have been selected', () => {
    // Prepare a runs grid data with a default metrics/params set and no initially selected columns
    const simpleExperimentsWrapper = createWrapper();

    // Assert "add params/metrics" CTA button being displayed
    expect(simpleExperimentsWrapper.find('ExperimentViewRunsTableAddColumnCTA').length).toBe(1);

    const newSelectedColumns = [
      'params.`p1`',
      'metrics.`m1`',
      'tags.`testtag1`',
      'tags.`testtag2`',
      'attributes.`User`',
      'attributes.`Source`',
      'attributes.`Version`',
      'attributes.`Models`',
      'attributes.`Dataset`',
      'attributes.`Description`',
    ];

    simpleExperimentsWrapper.setProps({
      runsData: {
        ...defaultProps.runsData,
        // Set new params and metrics
        paramKeyList: ['p1'],
        metricKeyList: ['m1'],
      },
      searchFacetsState: Object.assign(createExperimentPageSearchFacetsState(), {
        // Exhaust all possible columns
        selectedColumns: newSelectedColumns,
      }),
      uiState: Object.assign(createExperimentPageUIState(), {
        // Exhaust all possible columns
        selectedColumns: newSelectedColumns,
      }),
    });

    // Assert "show more columns" CTA button not being displayed anymore
    expect(simpleExperimentsWrapper.find('ExperimentViewRunsTableAddColumnCTA').length).toBe(0);
  });
});
```

--------------------------------------------------------------------------------

````
