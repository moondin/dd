---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 518
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 518 of 991)

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

---[FILE: RunsChartsDraggableCardsGridSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsDraggableCardsGridSection.tsx
Signals: React

```typescript
import { Empty, useDesignSystemTheme } from '@databricks/design-system';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useUpdateRunsChartsUIConfiguration } from '../hooks/useRunsChartsUIConfiguration';
import type { RunsChartsCardConfig } from '../runs-charts.types';
import type { RunsChartsRunData } from './RunsCharts.common';
import { isEmptyChartCard } from './RunsCharts.common';
import { useMediaQuery } from '@databricks/web-shared/hooks';
import { Global } from '@emotion/react';
import { FormattedMessage } from 'react-intl';
import type { ChartSectionConfig } from '../../../types';
import { RunsChartsDraggableCard } from './RunsChartsDraggableCard';
import {
  useRunsChartsDraggableGridActionsContext,
  useRunsChartsDraggableGridStateContext,
} from './RunsChartsDraggableCardsGridContext';
import { RunsChartsDraggablePreview } from './RunsChartsDraggablePreview';
import { DRAGGABLE_CARD_TRANSITION_NAME, type RunsChartCardSetFullscreenFn } from './cards/ChartCard.common';
import type { RunsGroupByConfig } from '../../experiment-page/utils/experimentPage.group-row-utils';
import type { RunsChartsGlobalLineChartConfig } from '../../experiment-page/models/ExperimentPageUIState';

const rowHeightSuggestions = [300, 330, 360, 400, 500];

const getColumnSuggestions = (containerWidth: number, gapSize = 8) =>
  [1, 2, 3, 4, 5].map((n) => ({
    cols: n,
    width: (containerWidth - (n - 1) * gapSize) / n,
  }));

const PlaceholderSymbol = Symbol('placeholder');

interface RunsChartsDraggableCardsGridProps {
  onRemoveChart: (chart: RunsChartsCardConfig) => void;
  onStartEditChart: (chart: RunsChartsCardConfig) => void;
  sectionConfig: ChartSectionConfig;
  setFullScreenChart: RunsChartCardSetFullscreenFn;
  sectionId: string;
  groupBy: RunsGroupByConfig | null;
  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
  chartRunData: RunsChartsRunData[];
  cardsConfig: RunsChartsCardConfig[];
}

// Renders draggable cards grid in a single chart section
export const RunsChartsDraggableCardsGridSection = memo(
  ({
    cardsConfig,
    sectionConfig,
    chartRunData,
    sectionId,
    hideEmptyCharts,
    ...cardProps
  }: RunsChartsDraggableCardsGridProps) => {
    const { theme } = useDesignSystemTheme();

    // If below medium breakpoint, display only 1 card per row.
    // Otherwise, use section configuration or fall back to 3 columns.
    const isCompactMode = useMediaQuery(`(max-width: ${theme.responsive.breakpoints.md}px)`);
    const columns = isCompactMode ? 1 : sectionConfig.columns ?? 3;

    // Use card height from the section configuration or fall back to 360 pixels.
    const cardHeight = sectionConfig.cardHeight ?? 360;

    const gridBoxRef = useRef<HTMLDivElement | null>(null);

    const { draggedCardUuid, isDragging } = useRunsChartsDraggableGridStateContext();
    const { setTargetSection, setTargetPosition, onSwapCards } = useRunsChartsDraggableGridActionsContext();

    const updateUIState = useUpdateRunsChartsUIConfiguration();

    const setColumns = useCallback(
      (columnCount: number) => {
        updateUIState((current) => {
          const section = current.compareRunSections?.find((section) => section.uuid === sectionId);
          if (!section) {
            return current;
          }

          return {
            ...current,
            compareRunSections: current.compareRunSections?.map((s) => {
              if (s.uuid === sectionId) {
                return {
                  ...s,
                  columns: columnCount,
                };
              }
              return s;
            }),
          };
        });
      },
      [sectionId, updateUIState],
    );

    const setCardHeight = useCallback(
      (height: number) => {
        updateUIState((current) => {
          const section = current.compareRunSections?.find((section) => section.uuid === sectionId);
          if (!section) {
            return current;
          }

          return {
            ...current,
            compareRunSections: current.compareRunSections?.map((s) => {
              if (s.uuid === sectionId) {
                return {
                  ...s,
                  cardHeight: height,
                };
              }
              return s;
            }),
          };
        });
      },
      [sectionId, updateUIState],
    );

    const lastElementCount = useRef<number>(0);

    const [positionInSection, setPositionInSection] = useState<number | null>(null);
    const [resizePreview, setResizePreview] = useState<null | Partial<DOMRect>>(null);

    lastElementCount.current = cardsConfig.length;
    const position = !draggedCardUuid ? null : positionInSection;

    // Helper function that calculates the x, y coordinates of a card based on its position in the grid
    const findCoords = useCallback(
      (position) => {
        const gap = theme.spacing.sm;
        const rowCount = Math.ceil(cardsConfig.length / columns);

        const row = Math.floor(position / columns);
        const col = position % columns;

        const colGapsCount = columns - 1;

        const passedColGaps = col;
        const passedRowGaps = row;
        const rect = gridBoxRef.current?.getBoundingClientRect();

        const singleWidth = ((rect?.width ?? 0) - colGapsCount * gap) / columns;

        const overflowing = row >= rowCount;

        return {
          overflowing,
          row,
          col,
          x: col * singleWidth + passedColGaps * gap,
          y: row * cardHeight + passedRowGaps * gap,
        };
      },
      [columns, cardHeight, theme, cardsConfig.length],
    );

    const cardsToRender = useMemo(() => {
      return cardsConfig.filter((cardConfig) => {
        if (!hideEmptyCharts) {
          return true;
        }
        return !isEmptyChartCard(chartRunData, cardConfig);
      });
    }, [cardsConfig, chartRunData, hideEmptyCharts]);

    // Calculate the transforms for each card based on the dragged card and its position.
    const cardTransforms = useMemo(() => {
      if (!draggedCardUuid || position === null) {
        return {};
      }

      const result: Record<string, { x: number; y: number; overflowing: boolean }> = {};

      const newArray: (RunsChartsCardConfig | typeof PlaceholderSymbol)[] = cardsToRender.slice();
      const fromIndex = cardsToRender.findIndex((x) => x.uuid === draggedCardUuid);
      const toIndex = position;

      if (fromIndex !== -1) {
        // If the card is dragged within same section, just rearrange the cards
        newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, cardsToRender[fromIndex]);
      } else {
        // If the card is dragged from another section, insert empty placeholder element
        newArray.splice(toIndex, 0, PlaceholderSymbol);
      }

      for (const cardConfig of cardsToRender) {
        const newIndex = newArray.indexOf(cardConfig);
        const oldIndex = cardsToRender.indexOf(cardConfig);

        const oldCoords = findCoords(oldIndex);
        const newCoords = findCoords(newIndex);

        // If the card is not moving, skip it
        if (newCoords.x === oldCoords.x && newCoords.y === oldCoords.y) {
          continue;
        }

        // Calculate the delta between the old and new positions
        const deltaX = newCoords.x - oldCoords.x;
        const deltaY = newCoords.y - oldCoords.y;

        if (cardConfig.uuid) {
          result[cardConfig.uuid] = {
            x: deltaX,
            y: deltaY,
            overflowing: newCoords.overflowing,
          };
        }
      }

      return result;
    }, [draggedCardUuid, position, cardsToRender, findCoords]);

    // Calculate the preview (placeholder) for the dragged card based on its new position
    const dragPreview = useMemo(() => {
      if (position === null) {
        return null;
      }
      if (cardsToRender.length === 0) {
        return { x: 0, y: 0, width: '100%', height: '100%' };
      }
      const { x, y } = findCoords(position);
      const colGapsCount = columns - 1;
      const rect = gridBoxRef.current?.getBoundingClientRect();

      const singleWidth = ((rect?.width ?? 0) - colGapsCount * theme.spacing.sm) / columns;

      const height = cardHeight;
      return { x, y, width: singleWidth, height };
    }, [position, findCoords, columns, cardHeight, theme, cardsToRender.length]);

    const mouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isDragging() || !gridBoxRef.current) {
          return;
        }

        const rect = gridBoxRef.current.getBoundingClientRect();
        const rowCount = Math.ceil(lastElementCount.current / columns);

        setTargetSection(sectionId);
        const pos =
          Math.floor(((e.clientY - rect.top) / rect.height) * rowCount) * columns +
          Math.floor(((e.clientX - rect.left) / rect.width) * columns);

        setPositionInSection(pos);
        setTargetPosition(pos);
      },

      [columns, isDragging, sectionId, setTargetSection, setTargetPosition],
    );

    const [columnSuggestions, setColumnSuggestions] = useState<{ cols: number; width: number }[]>([]);

    const immediateColSuggestion = useRef<number | null>(null);
    const immediateRowSuggestion = useRef<number | null>(null);

    const onResizeStart = useCallback((rect: DOMRect) => {
      const gridBoxRefSize = gridBoxRef.current?.getBoundingClientRect();
      if (!gridBoxRefSize) {
        return;
      }

      setResizePreview({
        x: rect.left - gridBoxRefSize.left,
        y: rect.top - gridBoxRefSize.top,
        width: rect.width,
        height: rect.height,
      });

      setColumnSuggestions(getColumnSuggestions(gridBoxRefSize.width));
    }, []);

    const onResizeStop = useCallback(() => {
      setColumns(immediateColSuggestion.current ?? columns);
      setCardHeight(immediateRowSuggestion.current ?? cardHeight);
      setResizePreview(null);
    }, [cardHeight, columns, setCardHeight, setColumns]);

    const onResize = useCallback(
      (width: number, height: number) => {
        const columnSuggestion = columnSuggestions.reduce((prev, curr) =>
          Math.abs(curr.width - width) < Math.abs(prev.width - width) ? curr : prev,
        );

        const rowHeightSuggestion = rowHeightSuggestions.reduce((prev, curr) =>
          Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev,
        );

        immediateColSuggestion.current = columnSuggestion.cols;
        immediateRowSuggestion.current = rowHeightSuggestion;

        setResizePreview((current) => {
          if (!current) {
            return null;
          }
          if (current.width !== columnSuggestion.width || current.height !== rowHeightSuggestion) {
            return { ...current, width: columnSuggestion.width, height: rowHeightSuggestion };
          }
          return current;
        });
      },
      [columnSuggestions],
    );

    return (
      <div
        ref={gridBoxRef}
        css={[
          { position: 'relative' },
          cardsToRender.length > 0 && {
            display: 'grid',
            gap: theme.spacing.sm,
          },
        ]}
        style={{
          gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
          ...(draggedCardUuid && {
            [DRAGGABLE_CARD_TRANSITION_NAME]: 'transform 0.1s',
          }),
        }}
        data-testid="draggable-chart-cards-grid"
        onMouseMove={mouseMove}
        onMouseLeave={() => {
          setPositionInSection(null);
        }}
      >
        {(draggedCardUuid || resizePreview) && (
          <Global
            styles={{
              'body, :host': {
                userSelect: 'none',
              },
            }}
          />
        )}
        {cardsToRender.length === 0 && (
          <div css={{ display: 'flex', justifyContent: 'center', minHeight: 160 }}>
            <Empty
              title={
                <FormattedMessage
                  defaultMessage="No charts in this section"
                  description="Runs compare page > Charts tab > No charts placeholder title"
                />
              }
              description={
                <FormattedMessage
                  defaultMessage="Click 'Add chart' or drag and drop to add charts here."
                  description="Runs compare page > Charts tab > No charts placeholder description"
                />
              }
            />
          </div>
        )}
        {cardsToRender.map((cardConfig, index, array) => {
          return (
            <RunsChartsDraggableCard
              key={cardConfig.uuid}
              uuid={cardConfig.uuid ?? ''}
              translateBy={cardTransforms[cardConfig.uuid ?? '']}
              onResizeStart={onResizeStart}
              onResizeStop={onResizeStop}
              onResize={onResize}
              cardConfig={cardConfig}
              chartRunData={chartRunData}
              onReorderWith={onSwapCards}
              index={index}
              height={cardHeight}
              canMoveDown={Boolean(array[index + 1])}
              canMoveUp={Boolean(array[index - 1])}
              canMoveToTop={index > 0}
              canMoveToBottom={index < array.length - 1}
              previousChartUuid={array[index - 1]?.uuid}
              nextChartUuid={array[index + 1]?.uuid}
              hideEmptyCharts={hideEmptyCharts}
              firstChartUuid={array[0]?.uuid}
              lastChartUuid={array[array.length - 1]?.uuid}
              {...cardProps}
            />
          );
        })}
        {dragPreview && <RunsChartsDraggablePreview {...dragPreview} />}
        {resizePreview && <RunsChartsDraggablePreview {...resizePreview} />}
      </div>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsDraggablePreview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsDraggablePreview.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import { RUNS_CHARTS_UI_Z_INDEX } from '../utils/runsCharts.const';

export const RunsChartsDraggablePreview = ({
  x,
  y,
  width,
  height,
}: {
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <>
      {/* Cover pointer events */}
      <div
        css={{
          position: 'absolute',
          inset: 0,
        }}
      />
      <div
        css={{
          position: 'absolute',
          backgroundColor: theme.colors.actionDefaultBackgroundHover,
          borderStyle: 'dashed',
          borderColor: theme.colors.actionDefaultBorderDefault,
          pointerEvents: 'none',
          borderRadius: theme.general.borderRadiusBase,
          borderWidth: 2,
          inset: 0,
          // Make sure the preview is above other cards
          zIndex: RUNS_CHARTS_UI_Z_INDEX.CARD_PREVIEW,
        }}
        style={{
          transform: `translate3d(${x}px, ${y}px, 0)`,
          width: width,
          height: height,
        }}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsFilterInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsFilterInput.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';
import { useUpdateRunsChartsUIConfiguration } from '../hooks/useRunsChartsUIConfiguration';
import { useIntl } from 'react-intl';
import { Input, SearchIcon, Spinner, useDesignSystemTheme } from '@databricks/design-system';
import { useDebouncedCallback } from 'use-debounce';

export const RunsChartsFilterInput = ({ chartsSearchFilter }: { chartsSearchFilter?: string }) => {
  const updateChartsUIState = useUpdateRunsChartsUIConfiguration();
  const { theme } = useDesignSystemTheme();

  const [inputValue, setInputValue] = useState(() => chartsSearchFilter ?? '');
  const [searching, setSearching] = useState(false);

  const { formatMessage } = useIntl();

  const updateChartFilter = useCallback(
    (value: string) => {
      updateChartsUIState((current) => ({
        ...current,
        chartsSearchFilter: value,
      }));
      setSearching(false);
    },
    [updateChartsUIState],
  );

  const updateChartFilterDebounced = useDebouncedCallback(updateChartFilter, 150);

  return (
    <Input
      componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsfilterinput.tsx_30"
      role="searchbox"
      prefix={
        <div css={{ width: theme.general.iconFontSize, lineHeight: 0 }}>
          {searching ? <Spinner size="small" /> : <SearchIcon />}
        </div>
      }
      value={inputValue}
      allowClear
      onChange={(e) => {
        setInputValue(e.target.value);
        setSearching(true);
        updateChartFilterDebounced(e.target.value);
      }}
      placeholder={formatMessage({
        defaultMessage: 'Search metric charts',
        description: 'Run page > Charts tab > Filter metric charts input > placeholder',
      })}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsFullScreenModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsFullScreenModal.tsx
Signals: React

```typescript
import type { ReactNode } from 'react';
import type { RunsChartsCardConfig } from '../runs-charts.types';
import type { RunsChartsRunData } from './RunsCharts.common';
import { Modal, useDesignSystemTheme } from '@databricks/design-system';
import type { RunsChartsTooltipBodyProps } from '../hooks/useRunsChartsTooltip';
import { RunsChartsTooltipWrapper } from '../hooks/useRunsChartsTooltip';
import { RunsChartsCard } from './cards/RunsChartsCard';
import type { RunsGroupByConfig } from '../../experiment-page/utils/experimentPage.group-row-utils';
import type { RunsChartsGlobalLineChartConfig } from '../../experiment-page/models/ExperimentPageUIState';

export const RunsChartsFullScreenModal = <TContext,>({
  chartData,
  isMetricHistoryLoading = false,
  groupBy,
  fullScreenChart,
  onCancel,
  tooltipContextValue,
  tooltipComponent,
  autoRefreshEnabled,
  globalLineChartConfig,
}: {
  chartData: RunsChartsRunData[];
  isMetricHistoryLoading?: boolean;
  groupBy: RunsGroupByConfig | null;
  autoRefreshEnabled?: boolean;
  fullScreenChart:
    | {
        config: RunsChartsCardConfig;
        title: string | ReactNode;
        subtitle: ReactNode;
      }
    | undefined;
  onCancel: () => void;
  tooltipContextValue: TContext;
  tooltipComponent: React.ComponentType<React.PropsWithChildren<RunsChartsTooltipBodyProps<TContext>>>;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
}) => {
  const { theme, getPrefixedClassName } = useDesignSystemTheme();

  const emptyReorderProps = {
    canMoveDown: false,
    canMoveUp: false,
    onMoveDown: () => {},
    onMoveUp: () => {},
    onReorderWith: () => {},
  };

  const emptyConfigureProps = {
    onRemoveChart: () => {},
    onReorderCharts: () => {},
    onStartEditChart: () => {},
    setFullScreenChart: () => {},
  };

  if (!fullScreenChart) {
    return null;
  }

  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsfullscreenmodal.tsx_53"
      visible
      onCancel={onCancel}
      title={
        <div css={{ display: 'flex', flexDirection: 'column' }}>
          {fullScreenChart.title}
          <span
            css={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSizeSm,
              marginRight: theme.spacing.xs,
            }}
          >
            {fullScreenChart.subtitle}
          </span>
        </div>
      }
      footer={null}
      verticalSizing="maxed_out"
      dangerouslySetAntdProps={{ width: '95%' }}
      css={{
        [`.${getPrefixedClassName('modal-body')}`]: {
          flex: 1,
        },
      }}
    >
      <RunsChartsTooltipWrapper contextData={tooltipContextValue} component={tooltipComponent}>
        <RunsChartsCard
          canMoveToTop={false}
          canMoveToBottom={false}
          firstChartUuid={undefined}
          lastChartUuid={undefined}
          cardConfig={fullScreenChart.config}
          chartRunData={chartData}
          groupBy={groupBy}
          index={0}
          sectionIndex={0}
          fullScreen
          autoRefreshEnabled={autoRefreshEnabled}
          globalLineChartConfig={globalLineChartConfig}
          {...emptyConfigureProps}
          {...emptyReorderProps}
        />
      </RunsChartsTooltipWrapper>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsGlobalChartSettingsDropdown.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsGlobalChartSettingsDropdown.test.tsx
Signals: React

```typescript
import { jest, describe, beforeAll, test, expect } from '@jest/globals';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { RunsChartsLineCardConfig } from '../runs-charts.types';
import { RunsChartType } from '../runs-charts.types';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';
import { RunsChartsGlobalChartSettingsDropdown } from './RunsChartsGlobalChartSettingsDropdown';
import { useState } from 'react';
import type { ExperimentPageUIState } from '../../experiment-page/models/ExperimentPageUIState';
import { createExperimentPageUIState } from '../../experiment-page/models/ExperimentPageUIState';
import { compact, noop } from 'lodash';
import { RunsChartsCard } from './cards/RunsChartsCard';
import { RunsChartsTooltipWrapper } from '../hooks/useRunsChartsTooltip';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
import { DragAndDropProvider } from '../../../../common/hooks/useDragAndDropElement';
import { IntlProvider } from 'react-intl';
import { RunsMetricsLinePlot } from './RunsMetricsLinePlot';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';
import {
  ExperimentPageUIStateContextProvider,
  useUpdateExperimentViewUIState,
} from '../../experiment-page/contexts/ExperimentPageUIStateContext';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larger timeout for integration testing

jest.mock('../hooks/useIsInViewport', () => ({
  useIsInViewport: jest.fn(() => ({ isInViewport: true, setElementRef: jest.fn() })),
}));

// mock line plot
jest.mock('./RunsMetricsLinePlot', () => ({
  RunsMetricsLinePlot: jest.fn(),
}));

describe('RunsChartsGlobalChartSettingsDropdown', () => {
  const commonChartProps = {
    isGenerated: true,
    deleted: false,
    scaleType: 'linear' as const,
    runsCountToCompare: 10,
    metricSectionId: 'metric-section-1',
    metricKey: '',
    selectedXAxisMetricKey: '',
    useGlobalLineSmoothing: false,
    useGlobalXaxisKey: false,
    range: {
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
    },
  };
  // We will have two test charts:
  // - first one will have lineSmoothness set to 50 and xAxisKey set to STEP
  // - second one will have lineSmoothness set to 30 and xAxisKey set to TIME
  const testCharts: RunsChartsLineCardConfig[] = [
    {
      type: RunsChartType.LINE,
      uuid: 'chart-alpha',
      lineSmoothness: 0,
      xAxisKey: RunsChartsLineChartXAxisType.STEP,
      xAxisScaleType: 'linear',
      selectedMetricKeys: ['alpha'],
      ...commonChartProps,
    },
    {
      type: RunsChartType.LINE,
      uuid: 'chart-beta',
      lineSmoothness: 30,
      xAxisKey: RunsChartsLineChartXAxisType.STEP,
      xAxisScaleType: 'linear',
      selectedMetricKeys: ['beta'],
      ...commonChartProps,
    },
  ];

  const renderTestComponent = () => {
    const TestComponent = () => {
      const [uiState, setUIState] = useState<ExperimentPageUIState>({
        ...createExperimentPageUIState(),
        compareRunCharts: testCharts,
        hideEmptyCharts: false,
      });

      return (
        <TestApolloProvider>
          <ExperimentPageUIStateContextProvider setUIState={setUIState}>
            <RunsChartsGlobalChartSettingsDropdown
              globalLineChartConfig={uiState.globalLineChartConfig}
              updateUIState={(setter) => setUIState((current) => ({ ...current, ...setter(current) }))}
              metricKeyList={compact(testCharts.flatMap((chart) => chart.selectedMetricKeys))}
            />
            <div>
              <RunsChartsTooltipWrapper component={() => null} contextData={{}}>
                <DragAndDropProvider>
                  {uiState.compareRunCharts?.map((chartConfig, index) => (
                    <RunsChartsCard
                      canMoveToTop={false}
                      canMoveToBottom={false}
                      key={chartConfig.uuid}
                      cardConfig={chartConfig}
                      // Generate one sample run so the charts can render
                      chartRunData={[{ uuid: 'run-1', hidden: false, metrics: { alpha: {}, beta: {} } }] as any}
                      index={index}
                      onRemoveChart={noop}
                      groupBy={null}
                      onReorderWith={noop}
                      onStartEditChart={noop}
                      sectionIndex={0}
                      canMoveDown
                      canMoveUp
                      globalLineChartConfig={uiState.globalLineChartConfig}
                      isInViewport
                      isInViewportDeferred
                    />
                  ))}
                </DragAndDropProvider>
              </RunsChartsTooltipWrapper>
            </div>
          </ExperimentPageUIStateContextProvider>
        </TestApolloProvider>
      );
    };
    render(<TestComponent />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <MockedReduxStoreProvider
              state={{
                entities: { sampledMetricsByRunUuid: {} },
              }}
            >
              {children}
            </MockedReduxStoreProvider>
          </DesignSystemProvider>
        </IntlProvider>
      ),
    });
  };

  beforeAll(() => {
    // @ts-expect-error Property '$$typeof' is missing in type
    jest.mocked(RunsMetricsLinePlot).mockImplementation(({ selectedMetricKeys, lineSmoothness, xAxisKey }) => {
      const updateUIState = useUpdateExperimentViewUIState();
      const setUseGlobalSettings = (value: boolean) =>
        updateUIState((current) => {
          return {
            ...current,
            compareRunCharts: current.compareRunCharts?.map((chart) => {
              if (chart.uuid === `chart-${selectedMetricKeys?.join(',')}`) {
                return {
                  ...chart,
                  useGlobalLineSmoothing: value,
                  useGlobalXaxisKey: value,
                };
              }
              return chart;
            }),
          };
        });
      return (
        <div data-testid={`chart-${selectedMetricKeys?.join(',')}`}>
          x-axis: {xAxisKey}, smoothness: {lineSmoothness}
          <button onClick={() => setUseGlobalSettings(false)}>use local settings</button>
          <button onClick={() => setUseGlobalSettings(true)}>use global settings</button>
        </div>
      );
    });
  });

  test('it should apply proper settings to the chart', async () => {
    renderTestComponent();

    // Wait for the charts to render with their own settings
    await waitFor(() => {
      expect(screen.getByTestId('chart-alpha').textContent).toContain('x-axis: step');
      expect(screen.getByTestId('chart-beta').textContent).toContain('x-axis: step');
      expect(screen.getByTestId('chart-alpha').textContent).toContain('smoothness: 0');
      expect(screen.getByTestId('chart-beta').textContent).toContain('smoothness: 30');
    });

    // Open the dropdown
    await userEvent.click(screen.getByLabelText('Configure charts'));

    // Change the setting for x-axis to time
    await userEvent.click(screen.getByText('Time (wall)'));

    // Change "beta" chart configuration to use global settings
    await userEvent.click(within(screen.getByTestId('chart-beta')).getByText('use global settings'));

    // Expect "beta" metric chart to reflect the changes while "alpha" should stay the same
    expect(screen.getByTestId('chart-alpha').textContent).toContain('x-axis: step');
    expect(screen.getByTestId('chart-beta').textContent).toContain('x-axis: time');

    // Change the global x-axis type to "step"
    await userEvent.click(screen.getByLabelText('Configure charts'));
    await userEvent.click(screen.getByText('Step'));

    // Both charts should now have x-axis set to "step"
    expect(screen.getByTestId('chart-alpha').textContent).toContain('x-axis: step');
    expect(screen.getByTestId('chart-beta').textContent).toContain('x-axis: step');

    // Change the line smoothness to 42
    await userEvent.click(screen.getByLabelText('Configure charts'));
    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '42');
    fireEvent.blur(screen.getByRole('spinbutton'));

    // Expect beta chart to reflect the changes while alpha should stay the same
    expect(screen.getByTestId('chart-alpha').textContent).toContain('smoothness: 0');
    expect(screen.getByTestId('chart-beta').textContent).toContain('smoothness: 42');

    // Now, alpha chart will use global settings while beta will use local settings
    await userEvent.click(within(screen.getByTestId('chart-alpha')).getByText('use global settings'));
    await userEvent.click(within(screen.getByTestId('chart-beta')).getByText('use local settings'));

    // Expect mocked plots to reflect the changes
    expect(screen.getByTestId('chart-alpha').textContent).toContain('smoothness: 42');
    expect(screen.getByTestId('chart-beta').textContent).toContain('smoothness: 30');

    // Revert alpha chart to use local settings
    await userEvent.click(within(screen.getByTestId('chart-alpha')).getByText('use local settings'));

    // We should go back to original per-chart settings
    expect(screen.getByTestId('chart-alpha').textContent).toContain('x-axis: step');
    expect(screen.getByTestId('chart-beta').textContent).toContain('x-axis: step');
    expect(screen.getByTestId('chart-alpha').textContent).toContain('smoothness: 0');
    expect(screen.getByTestId('chart-beta').textContent).toContain('smoothness: 30');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsGlobalChartSettingsDropdown.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsGlobalChartSettingsDropdown.tsx
Signals: React

```typescript
import { Button, CheckIcon, DropdownMenu, GearIcon, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import type { RunsChartsGlobalLineChartConfig } from '../../experiment-page/models/ExperimentPageUIState';
import { isUndefined } from 'lodash';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';
import { useCallback } from 'react';
import { LineSmoothSlider } from '../../LineSmoothSlider';
import { FormattedMessage, useIntl } from 'react-intl';
import type { RunsChartsUIConfigurationSetter } from '../hooks/useRunsChartsUIConfiguration';

export const RunsChartsGlobalChartSettingsDropdown = ({
  globalLineChartConfig,
  metricKeyList,
  updateUIState,
}: {
  metricKeyList: string[];
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
  updateUIState: (stateSetter: RunsChartsUIConfigurationSetter) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const { lineSmoothness, selectedXAxisMetricKey, xAxisKey } = globalLineChartConfig || {};

  const updateGlobalLineChartSettings = useCallback(
    (newSettings: Partial<RunsChartsGlobalLineChartConfig>) =>
      updateUIState((state) => ({
        ...state,
        globalLineChartConfig: {
          ...state.globalLineChartConfig,
          ...newSettings,
        },
      })),
    [updateUIState],
  );

  const isUsingGlobalMetricXaxis = xAxisKey === RunsChartsLineChartXAxisType.METRIC;

  const label = intl.formatMessage({
    defaultMessage: 'Configure charts',
    description: 'Experiment page > view controls > global settings for line chart view > dropdown button label',
  });

  return (
    <DropdownMenu.Root modal={false}>
      <Tooltip
        componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsglobalchartsettingsdropdown.tsx_44"
        content={label}
      >
        <DropdownMenu.Trigger asChild>
          <Button
            componentId="mlflow.charts.controls.global_chart_setup_dropdown"
            icon={<GearIcon />}
            aria-label={label}
            css={{ flexShrink: 0 }}
          />
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content align="end" css={{ minWidth: 300 }}>
        <DropdownMenu.Group
          role="region"
          aria-label={intl.formatMessage({
            defaultMessage: 'X-axis',
            description:
              'Experiment page > view controls > global settings for line chart view > settings for x-axis section label',
          })}
        >
          <DropdownMenu.Label css={{ display: 'flex', gap: 8 }}>
            <FormattedMessage
              defaultMessage="X-axis"
              description="Experiment page > view controls > global settings for line chart view > settings for x-axis section label"
            />
          </DropdownMenu.Label>
          <DropdownMenu.CheckboxItem
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsglobalchartsettingsdropdown.tsx_68"
            checked={xAxisKey === RunsChartsLineChartXAxisType.STEP}
            onClick={() => updateGlobalLineChartSettings({ xAxisKey: RunsChartsLineChartXAxisType.STEP })}
          >
            <DropdownMenu.ItemIndicator />
            <FormattedMessage
              defaultMessage="Step"
              description="Experiment page > view controls > global settings for line chart view > settings for x-axis > label for setting to use step axis in all charts"
            />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsglobalchartsettingsdropdown.tsx_78"
            checked={xAxisKey === RunsChartsLineChartXAxisType.TIME}
            onClick={() => updateGlobalLineChartSettings({ xAxisKey: RunsChartsLineChartXAxisType.TIME })}
          >
            <DropdownMenu.ItemIndicator />
            <FormattedMessage
              defaultMessage="Time (wall)"
              description="Experiment page > view controls > global settings for line chart view > settings for x-axis > label for setting to use wall time axis in all charts"
            />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsglobalchartsettingsdropdown.tsx_88"
            checked={xAxisKey === RunsChartsLineChartXAxisType.TIME_RELATIVE}
            onClick={() => updateGlobalLineChartSettings({ xAxisKey: RunsChartsLineChartXAxisType.TIME_RELATIVE })}
          >
            <DropdownMenu.ItemIndicator />
            <FormattedMessage
              defaultMessage="Time (relative)"
              description="Experiment page > view controls > global settings for line chart view > settings for x-axis > label for setting to use relative time axis in all charts"
            />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              css={{
                paddingLeft: theme.spacing.xs + theme.spacing.sm,
              }}
            >
              <DropdownMenu.IconWrapper>
                <CheckIcon
                  css={{
                    visibility: isUsingGlobalMetricXaxis ? 'visible' : 'hidden',
                  }}
                />
              </DropdownMenu.IconWrapper>
              <FormattedMessage
                defaultMessage="Metric"
                description="Experiment page > view controls > global settings for line chart view > settings for x-axis > label for setting to use metric axis in all charts"
              />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent css={{ maxHeight: 300, overflow: 'auto' }}>
              {metricKeyList.map((metricKey) => (
                <DropdownMenu.CheckboxItem
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsglobalchartsettingsdropdown.tsx_118"
                  key={metricKey}
                  checked={selectedXAxisMetricKey === metricKey && isUsingGlobalMetricXaxis}
                  onClick={() =>
                    updateGlobalLineChartSettings({
                      xAxisKey: RunsChartsLineChartXAxisType.METRIC,
                      selectedXAxisMetricKey: metricKey,
                    })
                  }
                >
                  <DropdownMenu.ItemIndicator />
                  {metricKey}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>
        <DropdownMenu.Group
          role="region"
          aria-label={intl.formatMessage({
            defaultMessage: 'Line smoothing',
            description:
              'Runs charts > line chart > configuration > label for line smoothing slider control. The control allows changing data trace line smoothness from 1 to 100, where 1 is the original data trace and 100 is the smoothest trace. Line smoothing helps eliminate noise in the data.',
          })}
        >
          <DropdownMenu.Label>
            <FormattedMessage
              defaultMessage="Line smoothing"
              description="Runs charts > line chart > configuration > label for line smoothing slider control. The control allows changing data trace line smoothness from 1 to 100, where 1 is the original data trace and 100 is the smoothest trace. Line smoothing helps eliminate noise in the data."
            />
          </DropdownMenu.Label>

          <div css={{ padding: theme.spacing.sm }}>
            <LineSmoothSlider
              min={0}
              max={100}
              onChange={(lineSmoothness) => updateGlobalLineChartSettings({ lineSmoothness })}
              value={lineSmoothness ? lineSmoothness : 0}
            />
          </div>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

````
