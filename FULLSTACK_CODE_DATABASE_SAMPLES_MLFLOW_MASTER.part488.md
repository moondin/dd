---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 488
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 488 of 991)

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

---[FILE: TracesV3DateSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3DateSelector.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';
import {
  Button,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListSelectItem,
  DialogComboboxTrigger,
  FormUI,
  RefreshIcon,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import {
  invalidateMlflowSearchTracesCache,
  SEARCH_MLFLOW_TRACES_QUERY_KEY,
} from '@databricks/web-shared/genai-traces-table';
import { useIntl } from '@databricks/i18n';
import { getNamedDateFilters } from './utils/dateUtils';
import {
  DEFAULT_START_TIME_LABEL,
  useMonitoringFilters,
} from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringFilters';
import { isNil } from 'lodash';
import { RangePicker } from '@databricks/design-system/development';
import { useMonitoringConfig } from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringConfig';
import { useQueryClient, useIsFetching } from '@databricks/web-shared/query-client';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const TracesV3DateSelector = React.memo(() => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: [SEARCH_MLFLOW_TRACES_QUERY_KEY] });

  const [monitoringFilters, setMonitoringFilters] = useMonitoringFilters();

  const namedDateFilters = useMemo(() => getNamedDateFilters(intl), [intl]);

  // List of labels for "start time" filter
  const currentStartTimeFilterLabel = intl.formatMessage({
    defaultMessage: 'Time Range',
    description: 'Label for the start range select dropdown for experiment runs view',
  });

  const monitoringConfig = useMonitoringConfig();

  return (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing.sm,
        alignItems: 'center',
      }}
    >
      <DialogCombobox
        componentId="mlflow.experiment-evaluation-monitoring.date-selector"
        label={currentStartTimeFilterLabel}
        value={monitoringFilters.startTimeLabel ? [monitoringFilters.startTimeLabel] : [DEFAULT_START_TIME_LABEL]}
      >
        <DialogComboboxTrigger
          renderDisplayedValue={(value) => {
            return namedDateFilters.find((namedDateFilter) => namedDateFilter.key === value)?.label;
          }}
          allowClear={
            !isNil(monitoringFilters.startTimeLabel) && monitoringFilters.startTimeLabel !== DEFAULT_START_TIME_LABEL
          }
          onClear={() => {
            setMonitoringFilters({ startTimeLabel: DEFAULT_START_TIME_LABEL });
          }}
          data-testid="time-range-select-dropdown"
        />
        <DialogComboboxContent>
          <DialogComboboxOptionList>
            {namedDateFilters.map((namedDateFilter) => (
              <DialogComboboxOptionListSelectItem
                key={namedDateFilter.key}
                checked={
                  monitoringFilters.startTimeLabel === namedDateFilter.key ||
                  (namedDateFilter.key === DEFAULT_START_TIME_LABEL && isNil(monitoringFilters.startTimeLabel))
                }
                title={namedDateFilter.label}
                data-testid={`time-range-select-${namedDateFilter}`}
                value={namedDateFilter.key}
                onChange={() => {
                  setMonitoringFilters({
                    ...monitoringFilters,
                    startTimeLabel: namedDateFilter.key,
                  });
                }}
              >
                {namedDateFilter.label}
              </DialogComboboxOptionListSelectItem>
            ))}
          </DialogComboboxOptionList>
        </DialogComboboxContent>
      </DialogCombobox>
      {monitoringFilters.startTimeLabel === 'CUSTOM' && (
        <>
          <RangePicker
            id="date-picker-range"
            includeTime
            selected={{
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO(FEINF-3982)
              from: new Date(monitoringFilters.startTime!),
              to: monitoringFilters.endTime ? new Date(monitoringFilters.endTime) : monitoringConfig.dateNow,
            }}
            onChange={(e) => {
              const date = e.target.value;
              setMonitoringFilters({
                ...monitoringFilters,
                startTime: date?.from ? date.from.toISOString() : undefined,
                endTime: date?.to ? date.to.toISOString() : undefined,
              });
            }}
            startDatePickerProps={{
              componentId: 'experiment-evaluation-monitoring-start-date-picker',
              datePickerProps: {
                disabled: {
                  after: monitoringConfig.dateNow,
                },
              },
              value: monitoringFilters.startTime ? new Date(monitoringFilters.startTime) : undefined,
            }}
            endDatePickerProps={{
              componentId: 'experiment-evaluation-monitoring-end-date-picker',
              datePickerProps: {
                disabled: {
                  after: monitoringConfig.dateNow,
                },
              },
              value: monitoringFilters.endTime ? new Date(monitoringFilters.endTime) : undefined,
            }}
          />
        </>
      )}
      <Tooltip
        componentId="mlflow.experiment-evaluation-monitoring.trace-info-hover-request-time"
        content={intl.formatMessage(
          {
            defaultMessage: 'Showing data up to {date}.',
            description: 'Tooltip for the refresh button showing the current date and time',
          },
          {
            date: monitoringConfig.dateNow.toLocaleString(navigator.language, {
              timeZoneName: 'short',
            }),
          },
        )}
      >
        <Button
          type="link"
          componentId="mlflow.experiment-evaluation-monitoring.refresh-date-button"
          disabled={Boolean(isFetching)}
          onClick={() => {
            monitoringConfig.refresh();
            invalidateMlflowSearchTracesCache({ queryClient });
          }}
        >
          <RefreshIcon />
        </Button>
      </Tooltip>
    </div>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: TracesV3EmptyState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3EmptyState.tsx
Signals: React

```typescript
import { useMonitoringFilters } from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringFilters';
import { createTraceLocationForExperiment, useSearchMlflowTraces } from '@databricks/web-shared/genai-traces-table';
import { FormattedMessage } from '@databricks/i18n';
import { Button, DangerIcon, Empty, ParagraphSkeleton, SearchIcon } from '@databricks/design-system';
import { getNamedDateFilters } from './utils/dateUtils';
import { useGetExperimentQuery } from '@mlflow/mlflow/src/experiment-tracking/hooks/useExperimentQuery';
import { useMemo } from 'react';
import { useIntl } from '@databricks/i18n';
import { getExperimentKindFromTags } from '@mlflow/mlflow/src/experiment-tracking/utils/ExperimentKindUtils';
import { ExperimentKind } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { TracesViewTableNoTracesQuickstart } from '../../../traces/quickstart/TracesViewTableNoTracesQuickstart';
import type {
  ModelTraceLocationMlflowExperiment,
  ModelTraceLocationUcSchema,
} from '@databricks/web-shared/model-trace-explorer';

export const TracesV3EmptyState = (props: {
  traceSearchLocations: (ModelTraceLocationMlflowExperiment | ModelTraceLocationUcSchema)[];
  experimentIds: string[];
  loggedModelId?: string;
  isCallDisabled?: boolean;
}) => {
  const { experimentIds, traceSearchLocations, loggedModelId, isCallDisabled } = props;

  const intl = useIntl();

  const {
    data: traces,
    isLoading,
    error,
  } = useSearchMlflowTraces({
    locations: traceSearchLocations,
    pageSize: 1,
    limit: 1,
    ...(loggedModelId ? { filterByLoggedModelId: loggedModelId } : {}),
    disabled: isCallDisabled,
  });

  // check experiment tags to see if it's genai or custom
  const { data: experimentEntity, loading: isExperimentLoading } = useGetExperimentQuery({
    experimentId: experimentIds[0],
  });
  const experiment = experimentEntity;
  const experimentKind = getExperimentKindFromTags(experiment?.tags);

  const isGenAIExperiment =
    experimentKind === ExperimentKind.GENAI_DEVELOPMENT || experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED;

  const hasMoreTraces = traces && traces.length > 0;

  const [monitoringFilters, setMonitoringFilters] = useMonitoringFilters();

  const namedDateFilters = useMemo(() => getNamedDateFilters(intl), [intl]);

  const button = (
    <Button componentId="traces-v3-empty-state-button" onClick={() => setMonitoringFilters({ startTimeLabel: 'ALL' })}>
      <FormattedMessage defaultMessage="View All" description="View all traces button" />
    </Button>
  );

  if (isLoading || isExperimentLoading) {
    return (
      <>
        {[...Array(10).keys()].map((i) => (
          <ParagraphSkeleton label="Loading..." key={i} seed={`s-${i}`} />
        ))}
      </>
    );
  }

  if (error) {
    return (
      <Empty
        image={<DangerIcon />}
        title={
          <FormattedMessage defaultMessage="Fetching traces failed" description="Fetching traces failed message" />
        }
        description={String(error)}
      />
    );
  }

  if (hasMoreTraces) {
    const image = <SearchIcon />;
    const description = (
      <FormattedMessage
        defaultMessage='Some traces are hidden by your time range filter: "{filterLabel}"'
        description="Message shown when traces are hidden by time filter"
        values={{
          filterLabel: (
            <strong>
              {namedDateFilters.find((namedDateFilter) => namedDateFilter.key === monitoringFilters.startTimeLabel)
                ?.label || ''}
            </strong>
          ),
        }}
      />
    );
    return (
      <Empty
        title={<FormattedMessage defaultMessage="No traces found" description="No traces found message" />}
        description={description}
        button={button}
        image={image}
      />
    );
  }
  return <TracesViewTableNoTracesQuickstart baseComponentId="mlflow.traces" />;
};
```

--------------------------------------------------------------------------------

---[FILE: TracesV3GenericErrorState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3GenericErrorState.tsx

```typescript
import { DangerIcon, Empty, PageWrapper } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export const TracesV3GenericErrorState = ({ error }: { error?: Error }) => {
  return (
    <PageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage defaultMessage="Error" description="Title for error fallback component in Trace V3 page" />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering this component."
              description="Description for default error message in Trace V3 page"
            />
          )
        }
        image={<DangerIcon />}
      />
    </PageWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesV3Logs.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3Logs.intg.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import type { ComponentProps } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider, type UseMutateAsyncFunction } from '@databricks/web-shared/query-client';
import { DesignSystemProvider } from '@databricks/design-system';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { TracesV3Logs } from './TracesV3Logs';
import {
  createTestTraceInfoV3,
  createTestAssessmentInfo,
  createTestColumns,
  useMlflowTracesTableMetadata,
  useSearchMlflowTraces,
  useSelectedColumns,
  convertTraceInfoV3ToRunEvalEntry,
} from '@databricks/web-shared/genai-traces-table';

import { getUser } from '@databricks/web-shared/global-settings';
import type { NetworkRequestError } from '@databricks/web-shared/errors';
import { TestRouter, testRoute, waitForRoutesToBeRendered } from '@mlflow/mlflow/src/common/utils/RoutingTestUtils';

// Mock the virtualizer to render all rows in tests
jest.mock('@tanstack/react-virtual', () => {
  const actual = jest.requireActual<typeof import('@tanstack/react-virtual')>('@tanstack/react-virtual');
  return {
    ...actual,
    useVirtualizer: (opts: any) => {
      return {
        getVirtualItems: () =>
          Array.from({ length: opts.count }, (_, i) => ({
            index: i,
            key: i,
            start: i * 120,
            size: 120,
            measureElement: () => {},
          })),
        getTotalSize: () => opts.count * 120,
        measureElement: () => {},
      };
    },
  };
});

// Mock necessary modules
jest.mock('@databricks/web-shared/global-settings', () => ({
  getUser: jest.fn(),
}));

jest.mock('@databricks/web-shared/hooks', () => {
  return {
    getLocalStorageItemByParams: jest.fn().mockReturnValue({ hiddenColumns: undefined }),
    useLocalStorage: jest.fn().mockReturnValue([{}, jest.fn()]),
  };
});

// Mock the genai-traces-table hooks
jest.mock('@databricks/web-shared/genai-traces-table', () => {
  const actual = jest.requireActual<typeof import('@databricks/web-shared/genai-traces-table')>(
    '@databricks/web-shared/genai-traces-table',
  );
  return {
    ...actual,
    useSearchMlflowTraces: jest.fn().mockReturnValue({ data: undefined, isLoading: false, error: null }),
    useMlflowTracesTableMetadata: jest.fn().mockReturnValue({
      assessmentInfos: [],
      allColumns: [],
      totalCount: 0,
      isLoading: true,
      error: null,
      isEmpty: false,
      evaluatedTraces: [],
      otherEvaluatedTraces: [],
    }),
    useSelectedColumns: jest
      .fn()
      .mockReturnValue({ selectedColumns: [], toggleColumns: jest.fn(), setSelectedColumns: jest.fn() }),
    useFilters: jest.fn().mockReturnValue([[], jest.fn()]),
    useTableSort: jest.fn().mockReturnValue([undefined, jest.fn()]),
    getEvalTabTotalTracesLimit: jest.fn().mockReturnValue(100),
    invalidateMlflowSearchTracesCache: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    getTracesTagKeys: jest.fn().mockReturnValue([]),
  };
});

// Mock MLflow service
jest.mock('@mlflow/mlflow/src/experiment-tracking/sdk/MlflowService', () => ({
  MlflowService: {
    getExperimentTraceInfoV3: jest.fn(),
    getExperimentTraceData: jest.fn(),
  },
}));

// Mock hooks
jest.mock('../../../evaluations/hooks/useDeleteTraces', () => ({
  useDeleteTracesMutation: jest
    .fn()
    .mockReturnValue({ mutateAsync: jest.fn<() => Promise<void>>().mockResolvedValue(undefined) }),
}));

jest.mock('../../../traces/hooks/useEditExperimentTraceTags', () => ({
  useEditExperimentTraceTags: jest.fn().mockReturnValue({ showEditTagsModalForTrace: jest.fn(), EditTagsModal: null }),
}));

jest.mock('./hooks/useSetInitialTimeFilter', () => ({
  useSetInitialTimeFilter: jest.fn().mockReturnValue({
    isInitialTimeFilterLoading: false,
  }),
}));

jest.mock('@mlflow/mlflow/src/common/utils/MarkdownUtils', () => ({
  useMarkdownConverter: jest.fn().mockReturnValue(jest.fn()),
}));

const testExperimentId = 'test-experiment-id';
const testEndpointName = 'test-endpoint';

describe('TracesV3Logs - integration test', () => {
  beforeEach(() => {
    // Mock user ID
    jest.mocked(getUser).mockImplementation(() => 'test.user@mlflow.org');

    // Mocked returned timestamp
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderTestComponent = (additionalProps: Partial<ComponentProps<typeof TracesV3Logs>> = {}) => {
    const defaultProps: ComponentProps<typeof TracesV3Logs> = {
      experimentId: testExperimentId,
      endpointName: testEndpointName,
      timeRange: {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-31T23:59:59Z',
      },
      loggedModelId: 'test-model-id',
      ...additionalProps,
    };

    const TestComponent = () => {
      return (
        <TestRouter
          routes={[
            testRoute(
              <DesignSystemProvider>
                <QueryClientProvider
                  client={
                    new QueryClient({
                      logger: {
                        error: () => {},
                        log: () => {},
                        warn: () => {},
                      },
                    })
                  }
                >
                  <TracesV3Logs {...defaultProps} />
                </QueryClientProvider>
              </DesignSystemProvider>,
            ),
          ]}
        />
      );
    };

    return render(
      <IntlProvider locale="en">
        <TestComponent />
      </IntlProvider>,
    );
  };

  it('renders loading state when metadata is loading', async () => {
    renderTestComponent();
    await waitForRoutesToBeRendered();

    expect(screen.getAllByText('Loading...')).toHaveLength(10);
  });

  it('renders error state when metadata fails to load', async () => {
    jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
      assessmentInfos: [],
      allColumns: [],
      totalCount: 0,
      isLoading: false,
      error: new Error('Failed to fetch metadata') as unknown as NetworkRequestError,
      isEmpty: false,
      tableFilterOptions: { source: [] },
      evaluatedTraces: [],
      otherEvaluatedTraces: [],
    });
    renderTestComponent();
    await waitForRoutesToBeRendered();

    expect(screen.getByText('Fetching traces failed')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch metadata')).toBeInTheDocument();
  });

  it('renders empty state when no traces exist', async () => {
    jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
      assessmentInfos: [],
      allColumns: [],
      totalCount: 0,
      isLoading: false,
      error: null,
      isEmpty: true,
      tableFilterOptions: { source: [] },
      evaluatedTraces: [],
      otherEvaluatedTraces: [],
    });

    // Wrap in ApolloProvider for this test
    const mockApolloClient = new ApolloClient({ uri: '/graphql', cache: new InMemoryCache() });
    const defaultProps = {
      experimentId: testExperimentId,
      endpointName: testEndpointName,
      timeRange: {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-31T23:59:59Z',
      },
      loggedModelId: 'test-model-id',
    };
    const TestComponent = () => (
      <TestRouter
        routes={[
          testRoute(
            <ApolloProvider client={mockApolloClient}>
              <DesignSystemProvider>
                <QueryClientProvider
                  client={new QueryClient({ logger: { error: () => {}, log: () => {}, warn: () => {} } })}
                >
                  <TracesV3Logs {...defaultProps} />
                </QueryClientProvider>
              </DesignSystemProvider>
            </ApolloProvider>,
          ),
        ]}
      />
    );
    render(
      <IntlProvider locale="en">
        <TestComponent />
      </IntlProvider>,
    );

    await waitForRoutesToBeRendered();
    // Wait for loading skeletons to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    // Now check for the empty state text
    expect(await screen.findByText(/No traces recorded/i)).toBeInTheDocument();
  });

  it('renders traces table when traces exist', async () => {
    const mockTraceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world',
        [
          { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.85, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
    ];
    const mockAssessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
    ];
    const mockColumns = createTestColumns(mockAssessmentInfos);
    const mockTableFilterOptions = { source: [] };
    jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
      assessmentInfos: mockAssessmentInfos,
      allColumns: mockColumns,
      totalCount: 1,
      isLoading: false,
      error: null,
      isEmpty: false,
      tableFilterOptions: mockTableFilterOptions,
      evaluatedTraces: mockTraceInfos.map((trace) => convertTraceInfoV3ToRunEvalEntry(trace)),
      otherEvaluatedTraces: [],
    });
    jest.mocked(useSearchMlflowTraces).mockReturnValue({
      data: mockTraceInfos,
      isLoading: false,
      isFetching: false,
      error: null as unknown as NetworkRequestError,
    });
    jest
      .mocked(useSelectedColumns)
      .mockReturnValue({ selectedColumns: mockColumns, toggleColumns: jest.fn(), setSelectedColumns: jest.fn() });

    renderTestComponent();
    await waitForRoutesToBeRendered();

    // Wait for the table to load and verify actual trace data is rendered
    await waitFor(() => {
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    // Verify trace ID is displayed
    expect(screen.getByText('trace-1')).toBeInTheDocument();

    // Verify assessment data is displayed
    expect(screen.getByText('Pass')).toBeInTheDocument(); // overall_assessment value (yes -> Pass)
    expect(screen.getByText('0.85')).toBeInTheDocument(); // quality_score value

    // Verify search input is also present
    expect(screen.getByPlaceholderText('Search traces by request')).toBeInTheDocument();
  });

  it('handles traces error state', async () => {
    const mockAssessmentInfos = [createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail')];
    const mockColumns = createTestColumns(mockAssessmentInfos);
    const mockTableFilterOptions = { source: [] };
    jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
      assessmentInfos: mockAssessmentInfos,
      allColumns: mockColumns,
      totalCount: 1,
      isLoading: false,
      error: null,
      isEmpty: false,
      tableFilterOptions: mockTableFilterOptions,
      evaluatedTraces: [],
      otherEvaluatedTraces: [],
    });
    jest.mocked(useSearchMlflowTraces).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: new Error('Failed to fetch traces') as unknown as NetworkRequestError,
    });
    jest
      .mocked(useSelectedColumns)
      .mockReturnValue({ selectedColumns: mockColumns, toggleColumns: jest.fn(), setSelectedColumns: jest.fn() });
    renderTestComponent();
    await waitForRoutesToBeRendered();
    expect(screen.getByText('Failed to fetch traces')).toBeInTheDocument();
  });

  it('handles multiple traces with assessments', async () => {
    const mockTraceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world 1',
        [
          { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.85, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
      createTestTraceInfoV3(
        'trace-2',
        'request-2',
        'Hello world 2',
        [
          { name: 'overall_assessment', value: 'no', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.75, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
    ];

    const mockAssessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
    ];

    const mockColumns = createTestColumns(mockAssessmentInfos);
    const mockTableFilterOptions = { source: [] };

    jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
      assessmentInfos: mockAssessmentInfos,
      allColumns: mockColumns,
      totalCount: 2,
      isLoading: false,
      error: null,
      isEmpty: false,
      tableFilterOptions: mockTableFilterOptions,
      evaluatedTraces: mockTraceInfos.map((trace) => convertTraceInfoV3ToRunEvalEntry(trace)),
      otherEvaluatedTraces: [],
    });

    jest.mocked(useSearchMlflowTraces).mockReturnValue({
      data: mockTraceInfos,
      isLoading: false,
      isFetching: false,
      error: null as unknown as NetworkRequestError,
    });

    jest.mocked(useSelectedColumns).mockReturnValue({
      selectedColumns: mockColumns,
      toggleColumns: jest.fn(),
      setSelectedColumns: jest.fn(),
    });

    renderTestComponent();
    await waitForRoutesToBeRendered();

    // Wait for the table to load and verify both traces are rendered
    await waitFor(() => {
      expect(screen.getByText('Hello world 1')).toBeInTheDocument();
      expect(screen.getByText('Hello world 2')).toBeInTheDocument();
    });

    // Verify trace IDs are displayed
    expect(screen.getByText('trace-1')).toBeInTheDocument();
    expect(screen.getByText('trace-2')).toBeInTheDocument();

    // Verify assessment data is displayed for both traces
    expect(screen.getByText('Pass')).toBeInTheDocument(); // trace-1 overall_assessment (yes -> Pass)
    expect(screen.getByText('Fail')).toBeInTheDocument(); // trace-2 overall_assessment (no -> Fail)
    expect(screen.getByText('0.85')).toBeInTheDocument(); // trace-1 quality_score
    expect(screen.getByText('0.75')).toBeInTheDocument(); // trace-2 quality_score

    // Verify search input is also present
    expect(screen.getByPlaceholderText('Search traces by request')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````
