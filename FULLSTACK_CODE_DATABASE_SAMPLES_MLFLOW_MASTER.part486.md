---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 486
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 486 of 991)

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

---[FILE: DatasetsCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/DatasetsCellRenderer.tsx
Signals: React

```typescript
import { throttle } from 'lodash';
import { Button, Popover, TableIcon, Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MLFLOW_RUN_DATASET_CONTEXT_TAG } from '../../../../../constants';
import type { RunDatasetWithTags } from '../../../../../types';
import type { RunRowType } from '../../../utils/experimentPage.row-types';
import { EXPERIMENT_RUNS_TABLE_ROW_HEIGHT } from '../../../utils/experimentPage.common-utils';
import type { SuppressKeyboardEventParams } from '@ag-grid-community/core';
const MAX_DATASETS_VISIBLE = 3;

/**
 * Local component, used to render a single dataset within a cell
 * or a context menu
 */
const SingleDataset = ({
  datasetWithTags,
  onDatasetSelected,
  appendComma = false,
  inPopover = false,
}: {
  datasetWithTags: RunDatasetWithTags;
  onDatasetSelected: () => void;
  appendComma?: boolean;
  inPopover?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const { dataset, tags } = datasetWithTags;
  if (!dataset) {
    return null;
  }
  const contextTag = tags?.find(({ key }) => key === MLFLOW_RUN_DATASET_CONTEXT_TAG);
  return (
    <div
      css={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: theme.spacing.xs,
      }}
    >
      <TableIcon css={{ color: theme.colors.textSecondary, marginRight: theme.spacing.xs }} />{' '}
      <span
        css={{ minWidth: 32, marginRight: theme.spacing.xs, flexShrink: 0 }}
        title={`${dataset.name} (${dataset.digest})`}
      >
        {inPopover ? (
          <Popover.Close asChild>
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_datasetscellrenderer.tsx_49"
              type="link"
              onClick={onDatasetSelected}
              tabIndex={0}
            >
              <span css={{ fontSize: 12 }}>
                {dataset.name} ({dataset.digest})
              </span>
            </Button>
          </Popover.Close>
        ) : (
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_datasetscellrenderer.tsx_56"
            type="link"
            onClick={onDatasetSelected}
            data-testid="open-dataset-drawer"
            tabIndex={0}
          >
            <span>
              {dataset.name} ({dataset.digest})
            </span>
          </Button>
        )}
      </span>
      {contextTag && (
        <Tag
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_datasetscellrenderer.tsx_75"
          css={{ textTransform: 'capitalize', marginRight: theme.spacing.xs }}
        >
          <span css={{ fontSize: 12 }}>{contextTag.value}</span>
        </Tag>
      )}
      {appendComma && <>,</>}
    </div>
  );
};

export interface DatasetsCellRendererProps {
  value: RunDatasetWithTags[];
  data: RunRowType;
  onDatasetSelected: (dataset: RunDatasetWithTags, run: RunRowType) => void;
  expandRows: boolean;
}

export const DatasetsCellRenderer = React.memo(
  ({ value: datasets, data, onDatasetSelected, expandRows }: DatasetsCellRendererProps) => {
    const containerElement = useRef<HTMLDivElement>(null);
    const [datasetsVisible, setDatasetsVisible] = useState(0);
    const [ellipsisVisible, setEllipsisVisible] = useState(false);
    const clampedDatasets = useMemo(() => (datasets || []).slice(0, MAX_DATASETS_VISIBLE), [datasets]);
    const { theme } = useDesignSystemTheme();

    const datasetsLength = (datasets || []).length;

    useEffect(() => {
      if (!containerElement.current) {
        return () => {};
      }
      const callback: ResizeObserverCallback = throttle(([entry]) => {
        if (expandRows) {
          const availableHeight = entry.contentRect.height;
          let elementsFit = 0;
          let stackedHeight = 0;
          for (let i = 0; i < entry.target.children.length; i++) {
            const item = entry.target.children.item(i) as Element;
            if (stackedHeight + item.clientHeight > availableHeight) {
              break;
            }
            stackedHeight += item.clientHeight;
            elementsFit++;
          }
          setDatasetsVisible(elementsFit);
          setEllipsisVisible(elementsFit < datasetsLength);
        } else {
          const availableWidth = entry.contentRect.width;
          if (availableWidth === 0 && datasetsLength) {
            setDatasetsVisible(0);
            setEllipsisVisible(true);
            return;
          }
          let elementsFit = 0;
          let stackedWidth = 0;
          for (let i = 0; i < entry.target.children.length; i++) {
            const item = entry.target.children.item(i) as Element;
            if (stackedWidth + item.clientWidth >= availableWidth) {
              break;
            }
            stackedWidth += item.clientWidth;
            elementsFit++;
          }
          const partiallyVisibleDatasets = Math.min(datasetsLength, elementsFit + 1);
          setDatasetsVisible(partiallyVisibleDatasets);
          setEllipsisVisible(elementsFit < datasetsLength);
        }
      }, 100);

      const resizeObserver = new ResizeObserver(callback);

      resizeObserver.observe(containerElement.current);
      return () => resizeObserver.disconnect();
    }, [expandRows, datasetsLength]);

    const moreItemsToShow = datasetsLength - datasetsVisible;
    if (!datasets || datasetsLength < 1) {
      return <>-</>;
    }

    const datasetsToShow = expandRows ? clampedDatasets : datasets;

    return (
      <div css={{ display: 'flex' }}>
        <div
          css={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: expandRows ? 'column' : 'row',
          }}
          ref={containerElement}
        >
          {datasetsToShow.map((datasetWithTags, index) => (
            <SingleDataset
              appendComma={expandRows ? false : index < datasetsToShow.length - 1}
              key={`${datasetWithTags.dataset.name}-${datasetWithTags.dataset.digest}`}
              datasetWithTags={datasetWithTags}
              onDatasetSelected={() => onDatasetSelected?.(datasetWithTags, data)}
            />
          ))}
        </div>
        {(moreItemsToShow > 0 || ellipsisVisible) && (
          <div css={{ display: 'flex', alignItems: 'flex-end' }}>
            {!expandRows && ellipsisVisible && (
              <span css={{ paddingLeft: 0, paddingRight: theme.spacing.xs }}>&hellip;</span>
            )}
            {moreItemsToShow > 0 && (
              <Popover.Root
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_datasetscellrenderer.tsx_184"
                modal={false}
              >
                <Popover.Trigger asChild>
                  <Button
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_datasetscellrenderer.tsx_172"
                    size="small"
                    style={{ borderRadius: '8px', width: '40px' }}
                    tabIndex={0}
                  >
                    <Typography.Text color="secondary">+{moreItemsToShow}</Typography.Text>
                  </Button>
                </Popover.Trigger>
                <Popover.Content align="start" css={{ maxHeight: '400px', overflow: 'auto' }}>
                  {datasets.slice(datasetsLength - moreItemsToShow).map((datasetWithTags) => (
                    <div
                      css={{
                        height: theme.general.heightSm,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      key={`${datasetWithTags.dataset.name}-${datasetWithTags.dataset.digest}`}
                    >
                      <SingleDataset
                        datasetWithTags={datasetWithTags}
                        onDatasetSelected={() => onDatasetSelected?.(datasetWithTags, data)}
                        inPopover
                      />
                    </div>
                  ))}
                </Popover.Content>
              </Popover.Root>
            )}
          </div>
        )}
      </div>
    );
  },
);

export const getDatasetsCellHeight = (datasetColumnShown: boolean, row: { data: RunRowType }) => {
  if (datasetColumnShown) {
    const { data } = row;

    // Display at least 1, but at most 5 text lines in the cell.
    const datasetsCount = Math.min(data.datasets?.length || 1, MAX_DATASETS_VISIBLE);
    return EXPERIMENT_RUNS_TABLE_ROW_HEIGHT * datasetsCount;
  }
  return EXPERIMENT_RUNS_TABLE_ROW_HEIGHT;
};

/**
 * A utility function that enables custom keyboard navigation for the datasets cell renderer by providing
 * conditional suppression of default events.
 *
 * This cell needs specific handling since it's the only one that displays multiple buttons simultaneously.
 */
export const DatasetsCellRendererSuppressKeyboardEvents = ({ event }: SuppressKeyboardEventParams) => {
  return (
    event.key === 'Tab' &&
    event.target instanceof HTMLElement &&
    // Let's suppress the default action if the focus is on cell or on the dataset button, allowing
    // tab to move to the next focusable element.
    (event.target.classList.contains('ag-cell') || event.target instanceof HTMLButtonElement)
  );
};
```

--------------------------------------------------------------------------------

---[FILE: DateCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/DateCellRenderer.tsx
Signals: React

```typescript
import type { Theme } from '@emotion/react';
import React from 'react';
import Utils from '../../../../../../common/utils/Utils';
import type { RunRowDateAndNestInfo } from '../../../utils/experimentPage.row-types';
import { RunStatusIcon } from '../../../../RunStatusIcon';
import { useIntl } from 'react-intl';

export interface DateCellRendererProps {
  value: RunRowDateAndNestInfo;
}

export const DateCellRenderer = React.memo(({ value }: DateCellRendererProps) => {
  const { startTime, referenceTime, runStatus } = value || {};
  const intl = useIntl();
  if (!startTime) {
    return <>-</>;
  }

  return (
    <span css={styles.cellWrapper} title={Utils.formatTimestamp(startTime, intl)}>
      <RunStatusIcon status={runStatus} />
      {Utils.timeSinceStr(startTime, referenceTime)}
    </span>
  );
});

const styles = {
  cellWrapper: (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentNameCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/ExperimentNameCellRenderer.tsx
Signals: React

```typescript
import React from 'react';
import { Link } from '../../../../../../common/utils/RoutingUtils';
import Routes from '../../../../../routes';
import type { RunRowType } from '../../../utils/experimentPage.row-types';

export interface ExperimentNameCellRendererProps {
  value: {
    name: string;
    basename: string;
  };
  data: RunRowType;
}

export const ExperimentNameCellRenderer = React.memo(({ data, value }: ExperimentNameCellRendererProps) =>
  !data.experimentId ? null : (
    <Link to={Routes.getExperimentPageRoute(data.experimentId)} title={value.name}>
      {value.basename}
    </Link>
  ),
);
```

--------------------------------------------------------------------------------

---[FILE: GroupParentCellRenderer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/GroupParentCellRenderer.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import type { ICellRendererParams } from '@ag-grid-community/core';
import { render, screen, waitFor } from '../../../../../../common/utils/TestUtils.react18';
import { GroupParentCellRenderer } from './GroupParentCellRenderer';
import { IntlProvider } from 'react-intl';
import { MockedReduxStoreProvider } from '../../../../../../common/utils/TestUtils';
import { DesignSystemProvider } from '@databricks/design-system';
import { testRoute, TestRouter } from '../../../../../../common/utils/RoutingTestUtils';

describe('GroupParentCellRenderer', () => {
  const dummyRendererApi: ICellRendererParams = {} as any;

  test('renders link to runs in the group', async () => {
    render(
      <GroupParentCellRenderer
        {...dummyRendererApi}
        data={
          {
            hidden: false,
            groupParentInfo: {
              groupId: 'group-1',
              aggregatedMetricData: {},
              aggregatedParamData: {},
              groupingValues: [],
              isRemainingRunsGroup: false,
              runUuids: ['run-1, run-2'],
            },
          } as any
        }
      />,
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <DesignSystemProvider>
              <MockedReduxStoreProvider state={{ entities: { colorByRunUuid: {} } }}>
                <TestRouter routes={[testRoute(children)]} />
              </MockedReduxStoreProvider>
            </DesignSystemProvider>
          </IntlProvider>
        ),
      },
    );

    await waitFor(() => {
      const linkElement = screen.getByRole('link', { hidden: true });
      expect(linkElement).toBeInTheDocument();

      const href = linkElement.getAttribute('href');
      expect(href).toContain('searchFilter=attributes.run_id+IN+%28%27run-1%2C+run-2%27%29');
      expect(href).toContain('isPreview=true');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GroupParentCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/GroupParentCellRenderer.tsx
Signals: React

```typescript
import type { ICellRendererParams } from '@ag-grid-community/core';
import type { RunRowType } from '../../../utils/experimentPage.row-types';
import {
  Button,
  ChevronDownIcon,
  ChevronRightIcon,
  NewWindowIcon,
  Tag,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import {
  createSearchFilterFromRunGroupInfo,
  getRunGroupDisplayName,
  isRemainingRunsGroup,
} from '../../../utils/experimentPage.group-row-utils';
import { useUpdateExperimentViewUIState } from '../../../contexts/ExperimentPageUIStateContext';
import { useCallback, useMemo } from 'react';
import { RunColorPill } from '../../RunColorPill';
import invariant from 'invariant';
import { FormattedMessage } from 'react-intl';
import { useGetExperimentRunColor, useSaveExperimentRunColor } from '../../../hooks/useExperimentRunColor';
import { useExperimentViewRunsTableHeaderContext } from '../ExperimentViewRunsTableHeaderContext';
import type { To } from '../../../../../../common/utils/RoutingUtils';
import { Link, useLocation } from '../../../../../../common/utils/RoutingUtils';
import { EXPERIMENT_PAGE_QUERY_PARAM_IS_PREVIEW } from '../../../hooks/useExperimentPageSearchFacets';

export interface GroupParentCellRendererProps extends ICellRendererParams {
  data: RunRowType;
  isComparingRuns?: boolean;
}

export const GroupParentCellRenderer = ({ data, isComparingRuns }: GroupParentCellRendererProps) => {
  const groupParentInfo = data.groupParentInfo;
  const hidden = data.hidden;
  invariant(groupParentInfo, 'groupParentInfo should be defined');
  const { theme } = useDesignSystemTheme();
  const location = useLocation();

  const { useGroupedValuesInCharts } = useExperimentViewRunsTableHeaderContext();
  const getRunColor = useGetExperimentRunColor();
  const saveRunColor = useSaveExperimentRunColor();
  const updateUIState = useUpdateExperimentViewUIState();
  const onExpandToggle = useCallback(
    (groupId: string, doOpen: boolean) => {
      updateUIState((current) => {
        const { groupsExpanded } = current;
        return {
          ...current,
          groupsExpanded: { ...groupsExpanded, [groupId]: doOpen },
        };
      });
    },
    [updateUIState],
  );

  const groupName = getRunGroupDisplayName(groupParentInfo);
  const groupIsDisplayedInCharts = useGroupedValuesInCharts && !isRemainingRunsGroup(groupParentInfo);

  const urlToRunUuidsFilter = useMemo(() => {
    const filter = createSearchFilterFromRunGroupInfo(groupParentInfo);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('searchFilter', filter);
    searchParams.set(EXPERIMENT_PAGE_QUERY_PARAM_IS_PREVIEW, 'true');
    const destination: To = {
      ...location,
      search: searchParams.toString(),
    };

    return destination;
  }, [groupParentInfo, location]);

  return (
    <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
      {groupParentInfo.expanderOpen ? (
        <ChevronDownIcon
          role="button"
          onClick={() => {
            onExpandToggle(groupParentInfo.groupId, false);
          }}
        />
      ) : (
        <ChevronRightIcon
          role="button"
          onClick={() => {
            onExpandToggle(groupParentInfo.groupId, true);
          }}
        />
      )}
      {/* Display color pill only when it's displayed in chart area */}
      {groupIsDisplayedInCharts && (
        <RunColorPill
          color={getRunColor(groupParentInfo.groupId)}
          hidden={isComparingRuns && hidden}
          onChangeColor={(colorValue) => {
            saveRunColor({ groupUuid: groupParentInfo.groupId, colorValue });
          }}
        />
      )}
      <div
        css={{
          display: 'inline-flex',
          gap: theme.spacing.sm,
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isRemainingRunsGroup(groupParentInfo) ? (
          <FormattedMessage
            defaultMessage="Additional runs"
            description="Experiment page > grouped runs table > label for group with additional, ungrouped runs"
          />
        ) : (
          <span title={groupName} css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <FormattedMessage
              defaultMessage="Group: {groupName}"
              description="Experiment page > grouped runs table > run group header label"
              values={{ groupName }}
            />
          </span>
        )}
        <Tag
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_groupparentcellrenderer.tsx_109"
          css={{ marginLeft: 0, marginRight: 0 }}
        >
          {groupParentInfo.runUuids.length}
        </Tag>
        <Tooltip
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_groupparentcellrenderer.tsx_136"
          content={
            <FormattedMessage
              defaultMessage="Open runs in this group in the new tab"
              description="Experiment page > grouped runs table > tooltip for a button that opens runs in a group in a new tab"
            />
          }
        >
          <Link
            to={urlToRunUuidsFilter}
            target="_blank"
            css={{
              marginLeft: -theme.spacing.xs,
              display: 'none',
              '.ag-row-hover &': {
                display: 'inline-flex',
              },
            }}
          >
            <Button
              type="link"
              componentId="mlflow.experiment_page.grouped_runs.open_runs_in_new_tab"
              size="small"
              icon={<NewWindowIcon css={{ svg: { width: 12, height: 12 } }} />}
            />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: LoadMoreRowRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/LoadMoreRowRenderer.tsx
Signals: React

```typescript
import type { ICellRendererParams } from '@ag-grid-community/core';
import { Button } from '@databricks/design-system';
import { uniqueId } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const createLoadMoreRow = () => ({
  runUuid: '',
  rowUuid: uniqueId('load_more'),
  isLoadMoreRow: true,
});

/**
 * A cell renderer for special type of full width rows housing "Load more"
 * button displayed at the bottom of the grid
 */
export const LoadMoreRowRenderer = React.memo(
  ({ loadMoreRunsFunc }: ICellRendererParams & { loadMoreRunsFunc: () => void }) => (
    <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32 }}>
      <Button
        componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_loadmorerowrenderer.tsx_20"
        type="primary"
        onClick={loadMoreRunsFunc}
        size="small"
      >
        <FormattedMessage defaultMessage="Load more" description="Load more button text to load more experiment runs" />
      </Button>
    </div>
  ),
);
```

--------------------------------------------------------------------------------

---[FILE: ModelsCellRenderer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/ModelsCellRenderer.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { ComponentProps } from 'react';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModelsCellRenderer } from './ModelsCellRenderer';
import { BrowserRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import type { LoggedModelProto } from '../../../../../types';
import { QueryClientProvider, QueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { shouldUseGetLoggedModelsBatchAPI } from '../../../../../../common/utils/FeatureUtils';
import { DesignSystemProvider } from '@databricks/design-system';

jest.mock('../../../../../../common/utils/FeatureUtils', () => ({
  shouldUnifyLoggedModelsAndRegisteredModels: jest.fn(),
  shouldUseGetLoggedModelsBatchAPI: jest.fn(),
}));

// Utility function to get a link by its text content
const getLinkByTextContent = (expectedText: string) =>
  screen.getByText((_, element) => element instanceof HTMLAnchorElement && element?.textContent === expectedText);

describe('ModelsCellRenderer', () => {
  beforeEach(() => {
    jest.mocked(shouldUseGetLoggedModelsBatchAPI).mockReturnValue(true);
  });

  const renderTestComponent = (props: ComponentProps<typeof ModelsCellRenderer>) => {
    const queryClient = new QueryClient();
    // Create a mock provider that supplies the registered versions without mocking the hook
    return render(
      <BrowserRouter>
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <IntlProvider locale="en">
              <ModelsCellRenderer {...props} />
            </IntlProvider>
          </QueryClientProvider>
        </DesignSystemProvider>
      </BrowserRouter>,
    );
  };

  test('renders empty placeholder when no value is provided', () => {
    renderTestComponent({ value: undefined } as any);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders empty placeholder when no models are available', () => {
    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders legacy registered models correctly', () => {
    renderTestComponent({
      value: {
        registeredModels: [{ name: 'Model1', version: '1', source: '' } as any],
        loggedModels: [],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    expect(screen.getByText('Model1')).toBeInTheDocument();
    expect(screen.getByText('v1')).toBeInTheDocument();
  });

  test('renders V3 logged models correctly when they have no registered versions', () => {
    const loggedModelV3: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3',
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    expect(screen.getByText('LoggedModelV3')).toBeInTheDocument();
  });

  test('hides V3 logged models when they have associated registered versions', () => {
    const loggedModelV3: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([
              {
                name: 'RegisteredFromV3',
                version: '2',
              },
            ]),
          },
        ],
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // The logged model should be hidden, but its registered version should be visible
    expect(screen.queryByText('LoggedModelV3')).not.toBeInTheDocument();
    expect(screen.getByText('RegisteredFromV3')).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
  });

  test('renders multiple legacy models correctly', async () => {
    renderTestComponent({
      value: {
        registeredModels: [
          { name: 'Model2', version: '2', source: '/artifacts/model2/2' } as any,
          { name: 'Model1', version: '1', source: '/artifacts/model1/1' } as any,
        ],
        loggedModels: [],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // We should see overflow with +1 element available
    await userEvent.click(screen.getByText('+1'));

    expect(getLinkByTextContent('Model2 v2')).toBeInTheDocument();
    expect(getLinkByTextContent('Model1 v1')).toBeInTheDocument();
  });

  test('renders unregistered logged models with flavor name', () => {
    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [{ artifactPath: 'artifacts/model1', flavors: ['sklearn'], utcTimeCreated: 12345 }],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    expect(screen.getByText('sklearn')).toBeInTheDocument();
  });

  test('renders default "Model" text when no flavor is available', () => {
    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [{ artifactPath: 'artifacts/model1', flavors: [], utcTimeCreated: 12345 }],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    expect(screen.getByText('Model')).toBeInTheDocument();
  });

  test('merges legacy logged models and registered models correctly', async () => {
    renderTestComponent({
      value: {
        registeredModels: [{ name: 'RegisteredModel', version: '3', source: '/artifacts/123' } as any],
        loggedModels: [
          { artifactPath: 'artifacts/model1', flavors: ['sklearn'], utcTimeCreated: 12345 },
          { artifactPath: 'models/model2', flavors: ['pytorch'], utcTimeCreated: 12346 },
        ],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // We should see overflow with +2 elements available
    await userEvent.click(screen.getByText('+2'));

    // Should show both the registered model and the logged models
    expect(getLinkByTextContent('RegisteredModel v3')).toBeInTheDocument();
    expect(getLinkByTextContent('sklearn')).toBeInTheDocument();
    expect(getLinkByTextContent('pytorch')).toBeInTheDocument();
  });

  test('handles legacy logged models with matching registered models', () => {
    // This test simulates a logged model that has been registered
    renderTestComponent({
      value: {
        registeredModels: [
          {
            name: 'RegisteredModel',
            version: '3',
            source: 'xyz/artifacts/model1',
          } as any,
        ],
        loggedModels: [
          {
            artifactPath: 'model1',
            flavors: ['sklearn'],
            utcTimeCreated: 12345,
          },
        ],
        loggedModelsV3: [],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // Should show the registered model once (not duplicated)
    expect(getLinkByTextContent('RegisteredModel v3')).toBeInTheDocument();

    // The flavor name should not be visible since the model is registered
    expect(screen.queryByText('sklearn')).not.toBeInTheDocument();

    // We should not see the "+" button since there are no additional models
    expect(screen.queryByRole('button', { name: /\+\d/ })).not.toBeInTheDocument();
  });

  test('renders both legacy registered models and V3 logged models together', async () => {
    const loggedModelV3: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3',
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [{ name: 'RegisteredModel', version: '2', source: '/artifacts/legacy_model' } as any],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // We should see overflow with +1 elements available
    await userEvent.click(screen.getByText('+1'));
    expect(getLinkByTextContent('RegisteredModel v2')).toBeInTheDocument();
    expect(getLinkByTextContent('LoggedModelV3')).toBeInTheDocument();
  });

  test('renders correctly when both legacy registered models and registered versions from V3 models exist', async () => {
    const loggedModelV3: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([
              {
                name: 'RegisteredFromV3',
                version: '2',
              },
            ]),
          },
        ],
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [{ name: 'DirectlyRegistered', version: '5', source: '/artifacts/legacy_model' } as any],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // We should see overflow with +1 elements available
    await userEvent.click(screen.getByText('+1'));
    expect(getLinkByTextContent('DirectlyRegistered v5')).toBeInTheDocument();
    expect(getLinkByTextContent('RegisteredFromV3 v2')).toBeInTheDocument();

    // The original logged model should be hidden
    expect(screen.queryByText('LoggedModelV3')).not.toBeInTheDocument();
  });

  test('handles multiple V3 logged models with different registered versions', async () => {
    const loggedModelV3A: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3A',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3-a',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([
              {
                name: 'RegisteredFromV3A',
                version: '2',
              },
            ]),
          },
        ],
      },
    };

    const loggedModelV3B: LoggedModelProto = {
      info: {
        model_id: 'model-id-2',
        name: 'LoggedModelV3B',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3-b',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([
              {
                name: 'RegisteredFromV3B',
                version: '4',
              },
            ]),
          },
        ],
      },
    };

    const loggedModelV3C: LoggedModelProto = {
      info: {
        model_id: 'model-id-3',
        name: 'LoggedModelV3C',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3-c',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([]), // No registered version for this model
          },
        ],
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3A, loggedModelV3B, loggedModelV3C],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    await userEvent.click(screen.getByText('+2'));
    expect(getLinkByTextContent('RegisteredFromV3A v2')).toBeInTheDocument();
    expect(getLinkByTextContent('RegisteredFromV3B v4')).toBeInTheDocument();

    // LoggedModelV3B should be visible since it has no registered version
    expect(screen.getByText('LoggedModelV3C')).toBeInTheDocument();
  });

  test('handles V3 logged models with multiple registered versions', async () => {
    const loggedModelV3: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([
              {
                name: 'RegisteredModel',
                version: '1',
              },
              {
                name: 'RegisteredModel',
                version: '2',
              },
            ]),
          },
        ],
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    // In total, we should have 2 models so "+1" should be visible
    await userEvent.click(screen.getByText('+1'));

    expect(getLinkByTextContent('RegisteredModel v1')).toBeInTheDocument();
    expect(getLinkByTextContent('RegisteredModel v2')).toBeInTheDocument();

    // The logged model should be hidden
    expect(screen.queryByText('LoggedModelV3')).not.toBeInTheDocument();
  });

  test('should not unfurl logged models into registered models when feature flag is off', async () => {
    jest.mocked(shouldUseGetLoggedModelsBatchAPI).mockReturnValue(false);

    const loggedModelV3: LoggedModelProto = {
      info: {
        model_id: 'model-id-1',
        name: 'LoggedModelV3',
        experiment_id: 'exp-1',
        artifact_uri: 'artifacts/model-v3',
        tags: [
          {
            key: 'mlflow.modelVersions',
            value: JSON.stringify([
              {
                name: 'RegisteredModel',
                version: '1',
              },
              {
                name: 'RegisteredModel',
                version: '2',
              },
            ]),
          },
        ],
      },
    };

    renderTestComponent({
      value: {
        registeredModels: [],
        loggedModels: [],
        loggedModelsV3: [loggedModelV3],
        experimentId: 'exp-1',
        runUuid: 'run-1',
      },
    });

    expect(screen.getByText('LoggedModelV3')).toBeInTheDocument();
    // We should not see the "+" button since there are no additional models
    expect(screen.queryByRole('button', { name: /\+\d/ })).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````
