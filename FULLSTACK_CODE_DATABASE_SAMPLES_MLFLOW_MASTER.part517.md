---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 517
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 517 of 991)

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

---[FILE: RunsChartsDraggableCardsGrid.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsDraggableCardsGrid.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RunsChartsDraggableCardsGridSection } from './RunsChartsDraggableCardsGridSection';
import { noop } from 'lodash';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
import { IntlProvider } from 'react-intl';
import type {
  RunsChartsBarCardConfig,
  RunsChartsContourCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsParallelCardConfig,
  RunsChartsScatterCardConfig,
} from '../runs-charts.types';
import { RunsChartType } from '../runs-charts.types';
import { RunsChartsTooltipWrapper } from '../hooks/useRunsChartsTooltip';
import { useCallback, useState } from 'react';
import type {
  ExperimentPageUIState,
  ExperimentRunsChartsUIConfiguration,
} from '../../experiment-page/models/ExperimentPageUIState';
import { createExperimentPageUIState } from '../../experiment-page/models/ExperimentPageUIState';
import type { RunsChartsUIConfigurationSetter } from '../hooks/useRunsChartsUIConfiguration';
import { RunsChartsUIConfigurationContextProvider } from '../hooks/useRunsChartsUIConfiguration';
import { RunsChartsDraggableCardsGridContextProvider } from './RunsChartsDraggableCardsGridContext';
import type { ChartSectionConfig } from '../../../types';
import { Checkbox, DesignSystemProvider } from '@databricks/design-system';
import userEvent from '@testing-library/user-event';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';

jest.mock('../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/FeatureUtils')>(
    '../../../../common/utils/FeatureUtils',
  ),
  shouldEnableHidingChartsWithNoData: jest.fn(() => true),
}));

// Mock useIsInViewport hook to simulate that the chart element is in the viewport
jest.mock('../hooks/useIsInViewport', () => ({
  useIsInViewport: () => ({ isInViewport: true, setElementRef: jest.fn() }),
}));

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000); // Larger timeout for integration testing (drag and drop simlation)

describe('RunsChartsDraggableCardsGrid', () => {
  const renderTestComponent = (element: React.ReactElement) => {
    const noopTooltipComponent = () => <div />;
    render(element, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <RunsChartsTooltipWrapper component={noopTooltipComponent} contextData={{}}>
              <TestApolloProvider>
                <MockedReduxStoreProvider state={{ entities: { sampledMetricsByRunUuid: {} } }}>
                  {children}
                </MockedReduxStoreProvider>
              </TestApolloProvider>
            </RunsChartsTooltipWrapper>
          </DesignSystemProvider>
        </IntlProvider>
      ),
    });
  };

  const mockGridElementSize = (element: Element, width: number, height: number) => {
    // @ts-expect-error Argument is not assignable to parameter of type '() => DOMRect'
    element.getBoundingClientRect = jest.fn<() => DOMRect>(() => ({
      top: 0,
      left: 0,
      width,
      height,
    }));
  };

  test('drag and drop cards within a single section with 3 columns', async () => {
    const cards = [
      { type: RunsChartType.BAR, metricKey: 'metric_1', uuid: 'card_1' },
      { type: RunsChartType.BAR, metricKey: 'metric_2', uuid: 'card_2' },
      { type: RunsChartType.BAR, metricKey: 'metric_3', uuid: 'card_3' },
    ] as RunsChartsBarCardConfig[];

    const TestComponent = () => {
      const [uiState, setUIState] = useState<ExperimentRunsChartsUIConfiguration>({
        ...createExperimentPageUIState(),
        compareRunCharts: cards,
      });

      return (
        <RunsChartsUIConfigurationContextProvider updateChartsUIState={setUIState}>
          <RunsChartsDraggableCardsGridContextProvider visibleChartCards={cards}>
            <RunsChartsDraggableCardsGridSection
              cardsConfig={uiState.compareRunCharts ?? []}
              chartRunData={[]}
              sectionId="abc"
              setFullScreenChart={noop}
              groupBy={null}
              onRemoveChart={noop}
              onStartEditChart={noop}
              sectionConfig={{
                display: true,
                isReordered: false,
                name: 'section_1',
                uuid: 'section_1',
                cardHeight: 360,
                columns: 3,
              }}
            />
          </RunsChartsDraggableCardsGridContextProvider>
        </RunsChartsUIConfigurationContextProvider>
      );
    };

    renderTestComponent(<TestComponent />);

    await waitFor(() => {
      expect(screen.getAllByTestId('experiment-view-compare-runs-card-drag-handle')).toHaveLength(3);

      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_1',
        'metric_2',
        'metric_3',
      ]);
    });

    mockGridElementSize(screen.getByTestId('draggable-chart-cards-grid'), 900, 600);

    let dragHandle = screen.getAllByTestId('experiment-view-compare-runs-card-drag-handle')[0];

    fireEvent.mouseDown(dragHandle);
    fireEvent.mouseMove(screen.getByTestId('draggable-chart-cards-grid'), { clientX: 850, clientY: 100 });
    fireEvent.mouseUp(dragHandle);

    await waitFor(() => {
      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_2',
        'metric_3',
        'metric_1',
      ]);
    });

    dragHandle = screen.getAllByTestId('experiment-view-compare-runs-card-drag-handle')[1];

    fireEvent.mouseDown(dragHandle);
    fireEvent.mouseMove(screen.getByTestId('draggable-chart-cards-grid'), { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(dragHandle);

    await waitFor(() => {
      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_3',
        'metric_2',
        'metric_1',
      ]);
    });

    dragHandle = screen.getAllByTestId('experiment-view-compare-runs-card-drag-handle')[0];

    fireEvent.mouseDown(dragHandle);
    fireEvent.mouseMove(screen.getByTestId('draggable-chart-cards-grid'), { clientX: 850, clientY: 450 });
    fireEvent.mouseUp(dragHandle);

    await waitFor(() => {
      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_2',
        'metric_1',
        'metric_3',
      ]);
    });
  });

  test('reorder cards using move to top and bottom menu actions', async () => {
    const cards = [
      { type: RunsChartType.BAR, metricKey: 'metric_1', uuid: 'card_1' },
      { type: RunsChartType.BAR, metricKey: 'metric_2', uuid: 'card_2' },
      { type: RunsChartType.BAR, metricKey: 'metric_3', uuid: 'card_3' },
    ] as RunsChartsBarCardConfig[];

    const TestComponent = () => {
      const [uiState, setUIState] = useState<ExperimentRunsChartsUIConfiguration>({
        ...createExperimentPageUIState(),
        compareRunCharts: cards,
      });

      return (
        <RunsChartsUIConfigurationContextProvider updateChartsUIState={setUIState}>
          <RunsChartsDraggableCardsGridContextProvider visibleChartCards={cards}>
            <RunsChartsDraggableCardsGridSection
              cardsConfig={uiState.compareRunCharts ?? []}
              chartRunData={[]}
              sectionId="abc"
              setFullScreenChart={noop}
              groupBy={null}
              onRemoveChart={noop}
              onStartEditChart={noop}
              sectionConfig={{
                display: true,
                isReordered: false,
                name: 'section_1',
                uuid: 'section_1',
                cardHeight: 360,
                columns: 3,
              }}
            />
          </RunsChartsDraggableCardsGridContextProvider>
        </RunsChartsUIConfigurationContextProvider>
      );
    };

    renderTestComponent(<TestComponent />);

    await waitFor(() => {
      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_1',
        'metric_2',
        'metric_3',
      ]);
    });

    await userEvent.click(screen.getAllByTestId('experiment-view-compare-runs-card-menu')[1]);
    await userEvent.click(screen.getByTestId('experiment-view-compare-runs-move-to-top'));

    await waitFor(() => {
      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_2',
        'metric_1',
        'metric_3',
      ]);
    });

    await userEvent.click(screen.getAllByTestId('experiment-view-compare-runs-card-menu')[0]);
    await userEvent.click(screen.getByTestId('experiment-view-compare-runs-move-to-bottom'));

    await waitFor(() => {
      expect(screen.getAllByRole('heading').map((element) => element.textContent)).toEqual([
        'metric_1',
        'metric_3',
        'metric_2',
      ]);
    });
  });

  test('resize charts and change column count', async () => {
    const cards = [
      { type: RunsChartType.BAR, metricKey: 'metric_1', uuid: 'card_1' },
      { type: RunsChartType.BAR, metricKey: 'metric_2', uuid: 'card_2' },
      { type: RunsChartType.BAR, metricKey: 'metric_3', uuid: 'card_3' },
    ] as RunsChartsBarCardConfig[];

    const TestComponent = () => {
      const initialState: ExperimentRunsChartsUIConfiguration = {
        ...createExperimentPageUIState(),
        compareRunCharts: cards,
        compareRunSections: [
          { uuid: 'section_a', display: true, isReordered: false, name: 'section_a', cardHeight: 300, columns: 3 },
        ],
      };
      const [uiState, setUIState] = useState<ExperimentRunsChartsUIConfiguration>(initialState);

      return (
        <RunsChartsUIConfigurationContextProvider updateChartsUIState={setUIState}>
          <RunsChartsDraggableCardsGridContextProvider visibleChartCards={cards}>
            <RunsChartsDraggableCardsGridSection
              cardsConfig={uiState.compareRunCharts ?? []}
              chartRunData={[]}
              sectionId="section_a"
              setFullScreenChart={noop}
              groupBy={null}
              onRemoveChart={noop}
              onStartEditChart={noop}
              sectionConfig={uiState.compareRunSections?.[0] as ChartSectionConfig}
            />
          </RunsChartsDraggableCardsGridContextProvider>
          <div>Columns displayed: {uiState.compareRunSections?.[0].columns}</div>
          <div>Card height: {uiState.compareRunSections?.[0].cardHeight}</div>
        </RunsChartsUIConfigurationContextProvider>
      );
    };

    renderTestComponent(<TestComponent />);

    await waitFor(() => {
      expect(screen.getAllByTestId('draggable-card-resize-handle')).toHaveLength(3);
      expect(screen.getByText('Columns displayed: 3')).toBeInTheDocument();
      expect(screen.getByText('Card height: 300')).toBeInTheDocument();
    });

    mockGridElementSize(screen.getByTestId('draggable-chart-cards-grid'), 900, 600);

    const resizeHandle = screen.getAllByTestId('draggable-card-resize-handle')[0];

    fireEvent.mouseDown(resizeHandle);
    fireEvent.mouseMove(screen.getByTestId('draggable-chart-cards-grid'), { clientX: 899, clientY: 500 });
    fireEvent.mouseUp(resizeHandle);

    await waitFor(() => {
      expect(screen.getByText('Columns displayed: 1')).toBeInTheDocument();
      expect(screen.getByText('Card height: 500')).toBeInTheDocument();
    });

    fireEvent.mouseDown(resizeHandle);
    fireEvent.mouseMove(screen.getByTestId('draggable-chart-cards-grid'), { clientX: 460, clientY: 500 });
    fireEvent.mouseUp(resizeHandle);

    await waitFor(() => {
      expect(screen.getByText('Columns displayed: 2')).toBeInTheDocument();
      expect(screen.getByText('Card height: 500')).toBeInTheDocument();
    });
  });

  test('drag and drop cards between two sections', async () => {
    const cards = [
      { type: RunsChartType.BAR, metricKey: 'metric_1', uuid: 'card_a_1', metricSectionId: 'section_a' },
      { type: RunsChartType.BAR, metricKey: 'metric_2', uuid: 'card_a_2', metricSectionId: 'section_a' },
      { type: RunsChartType.BAR, metricKey: 'metric_3', uuid: 'card_a_3', metricSectionId: 'section_a' },

      { type: RunsChartType.BAR, metricKey: 'metric_4', uuid: 'card_b_1', metricSectionId: 'section_b' },
      { type: RunsChartType.BAR, metricKey: 'metric_5', uuid: 'card_b_2', metricSectionId: 'section_b' },
    ] as RunsChartsBarCardConfig[];

    const TestComponent = () => {
      const [firstGridSection, secondGridSection] = [
        {
          display: true,
          isReordered: false,
          name: 'section_a',
          uuid: 'section_a',
          cardHeight: 300,
          columns: 3,
        },
        {
          display: true,
          isReordered: false,
          name: 'section_b',
          uuid: 'section_b',
          cardHeight: 300,
          columns: 2,
        },
      ];
      const [uiState, setUIState] = useState<ExperimentRunsChartsUIConfiguration>({
        ...createExperimentPageUIState(),
        compareRunCharts: cards,
        compareRunSections: [firstGridSection, secondGridSection],
      });

      return (
        <RunsChartsUIConfigurationContextProvider updateChartsUIState={setUIState}>
          <RunsChartsDraggableCardsGridContextProvider visibleChartCards={cards}>
            <RunsChartsDraggableCardsGridSection
              cardsConfig={
                uiState.compareRunCharts?.filter(({ metricSectionId }) => metricSectionId === 'section_a') ?? []
              }
              chartRunData={[]}
              sectionId="section_a"
              setFullScreenChart={noop}
              groupBy={null}
              onRemoveChart={noop}
              onStartEditChart={noop}
              sectionConfig={firstGridSection}
            />
            <RunsChartsDraggableCardsGridSection
              cardsConfig={
                uiState.compareRunCharts?.filter(({ metricSectionId }) => metricSectionId === 'section_b') ?? []
              }
              chartRunData={[]}
              sectionId="section_b"
              setFullScreenChart={noop}
              groupBy={null}
              onRemoveChart={noop}
              onStartEditChart={noop}
              sectionConfig={secondGridSection}
            />
          </RunsChartsDraggableCardsGridContextProvider>
        </RunsChartsUIConfigurationContextProvider>
      );
    };

    renderTestComponent(<TestComponent />);

    await waitFor(() => {
      expect(screen.getAllByTestId('experiment-view-compare-runs-card-drag-handle')).toHaveLength(5);
    });

    const [firstGrid, secondGrid] = screen.getAllByTestId('draggable-chart-cards-grid');

    await waitFor(() => {
      expect(
        within(firstGrid)
          .getAllByRole('heading')
          .map((element) => element.textContent),
      ).toEqual(['metric_1', 'metric_2', 'metric_3']);

      expect(
        within(secondGrid)
          .getAllByRole('heading')
          .map((element) => element.textContent),
      ).toEqual(['metric_4', 'metric_5']);
    });

    mockGridElementSize(firstGrid, 900, 600);
    mockGridElementSize(secondGrid, 900, 600);

    let dragHandle = within(secondGrid).getAllByTestId('experiment-view-compare-runs-card-drag-handle')[0];

    fireEvent.mouseDown(dragHandle);
    fireEvent.mouseMove(firstGrid, { clientX: 450, clientY: 100 });
    fireEvent.mouseUp(dragHandle);

    await waitFor(() => {
      expect(
        within(firstGrid)
          .getAllByRole('heading')
          .map((element) => element.textContent),
      ).toEqual(['metric_1', 'metric_4', 'metric_2', 'metric_3']);

      expect(
        within(secondGrid)
          .getAllByRole('heading')
          .map((element) => element.textContent),
      ).toEqual(['metric_5']);
    });

    dragHandle = within(firstGrid).getAllByTestId('experiment-view-compare-runs-card-drag-handle')[2];

    fireEvent.mouseDown(dragHandle);
    fireEvent.mouseMove(secondGrid, { clientX: 400, clientY: 100 });
    fireEvent.mouseUp(dragHandle);

    await waitFor(() => {
      expect(
        within(firstGrid)
          .getAllByRole('heading')
          .map((element) => element.textContent),
      ).toEqual(['metric_1', 'metric_4', 'metric_3']);

      expect(
        within(secondGrid)
          .getAllByRole('heading')
          .map((element) => element.textContent),
      ).toEqual(['metric_2', 'metric_5']);
    });
  });

  test('properly hide cards with no data', async () => {
    const cards = [
      { type: RunsChartType.BAR, metricKey: 'metric_1', uuid: 'card_1' } as RunsChartsBarCardConfig,
      { type: RunsChartType.LINE, selectedMetricKeys: ['metric_1'], uuid: 'card_2' } as RunsChartsLineCardConfig,
      {
        type: RunsChartType.SCATTER,
        xaxis: { key: 'metric_1', type: 'METRIC' },
        yaxis: { key: 'metric_2', type: 'METRIC' },
        uuid: 'card_3',
      } as RunsChartsScatterCardConfig,
      {
        type: RunsChartType.CONTOUR,
        xaxis: { key: 'metric_1', type: 'METRIC' },
        yaxis: { key: 'metric_2', type: 'METRIC' },
        zaxis: { key: 'metric_3', type: 'METRIC' },
        uuid: 'card_4',
      } as RunsChartsContourCardConfig,
      {
        type: RunsChartType.PARALLEL,
        selectedMetrics: ['metric_1', 'metric_2', 'metric_3'],
        uuid: 'card_5',
      } as RunsChartsParallelCardConfig,
    ];

    const TestComponent = () => {
      const [uiState, updateUIState] = useState<ExperimentPageUIState>({
        ...createExperimentPageUIState(),
        hideEmptyCharts: false,
        compareRunCharts: cards,
      });

      const updateChartsUIState = useCallback<(stateSetter: RunsChartsUIConfigurationSetter) => void>(
        (setter) => {
          updateUIState((state) => ({
            ...state,
            ...setter(state),
          }));
        },
        [updateUIState],
      );

      return (
        <RunsChartsUIConfigurationContextProvider updateChartsUIState={updateChartsUIState}>
          <RunsChartsDraggableCardsGridContextProvider visibleChartCards={cards}>
            <RunsChartsDraggableCardsGridSection
              cardsConfig={uiState.compareRunCharts ?? []}
              chartRunData={[
                {
                  displayName: 'run_1',
                  // Metrics unrelated to the cards
                  metrics: { metric_4: [{ key: 'metric_4', value: 1 }] },
                } as any,
              ]}
              sectionId="test"
              setFullScreenChart={noop}
              groupBy={null}
              onRemoveChart={noop}
              onStartEditChart={noop}
              hideEmptyCharts={uiState.hideEmptyCharts}
              sectionConfig={{} as any}
            />
            <Checkbox
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsdraggablecardsgrid.test.tsx_420"
              isChecked={uiState.hideEmptyCharts}
              onChange={(checked) => {
                updateChartsUIState((state) => ({ ...state, hideEmptyCharts: checked }));
              }}
            >
              Hide empty charts
            </Checkbox>
          </RunsChartsDraggableCardsGridContextProvider>
        </RunsChartsUIConfigurationContextProvider>
      );
    };

    renderTestComponent(<TestComponent />);

    await waitFor(() => {
      expect(screen.getAllByTestId('experiment-view-compare-runs-card-drag-handle')).toHaveLength(5);
    });

    await userEvent.click(screen.getByText('Hide empty charts'));

    await waitFor(() => {
      expect(screen.queryAllByTestId('experiment-view-compare-runs-card-drag-handle')).toHaveLength(0);
      expect(screen.getByText('No charts in this section')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsDraggableCardsGridContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsDraggableCardsGridContext.tsx
Signals: React

```typescript
/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { RunsChartsCardConfig } from '../runs-charts.types';
import { DragAndDropProvider } from '../../../../common/hooks/useDragAndDropElement';
import { useUpdateRunsChartsUIConfiguration } from '../hooks/useRunsChartsUIConfiguration';
import { indexOf, sortBy } from 'lodash';

const RunsChartsDraggableGridStateContext = createContext<{
  draggedCardUuid: string | null;
  targetSection: string | null;
  isDragging: () => boolean;
}>({
  draggedCardUuid: '',
  targetSection: '',
  isDragging: () => false,
});

const RunsChartsDraggableGridActionsContext = createContext<{
  setDraggedCardUuid: (cardUuid: string | null) => void;
  setTargetSection: (targetSectionUuid: string | null) => void;
  setTargetPosition: (pos: number) => void;
  onDropChartCard: () => void;
  onSwapCards: (sourceUuid: string, targetUuid: string) => void;
}>({
  setDraggedCardUuid: () => {},
  setTargetSection: () => {},
  setTargetPosition: () => {},
  onDropChartCard: () => {},
  onSwapCards: () => {},
});

export const useRunsChartsDraggableGridStateContext = () => useContext(RunsChartsDraggableGridStateContext);
export const useRunsChartsDraggableGridActionsContext = () => useContext(RunsChartsDraggableGridActionsContext);

export const RunsChartsDraggableCardsGridContextProvider = ({
  children,
  visibleChartCards = [],
}: {
  children?: React.ReactNode;
  visibleChartCards?: RunsChartsCardConfig[];
}) => {
  // Stateful values: dragged card ID and target section ID
  const [draggedCardUuid, setDraggedCardUuid] = useState<string | null>(null);
  const [targetSectionUuid, setTargetSectionUuid] = useState<string | null>(null);

  // Use refs for direct access to the values
  const immediateDraggedCardUuid = useRef<string | null>(null);
  const immediateTargetSectionId = useRef<string | null>(null);
  immediateDraggedCardUuid.current = draggedCardUuid;
  immediateTargetSectionId.current = targetSectionUuid;

  // Mutable field: target position (index) in the target section
  const targetLocalPosition = useRef<number | null>(null);

  const setTargetPosition = useCallback((pos: number) => {
    targetLocalPosition.current = pos;
  }, []);

  const isDragging = useCallback(() => immediateDraggedCardUuid.current !== null, []);

  const updateChartsUIState = useUpdateRunsChartsUIConfiguration();

  // Callback for simple card swapping (Move up/move down functionality)
  const onSwapCards = useCallback(
    (sourceChartUuid: string, targetChartUuid: string) => {
      updateChartsUIState((current) => {
        const newChartsOrder = current.compareRunCharts?.slice();

        if (!newChartsOrder) {
          return current;
        }

        const indexSource = newChartsOrder.findIndex((c) => c.uuid === sourceChartUuid);
        const indexTarget = newChartsOrder.findIndex((c) => c.uuid === targetChartUuid);

        // If one of the charts is not found, do nothing
        if (indexSource < 0 || indexTarget < 0) {
          return current;
        }

        const sourceChart = newChartsOrder[indexSource];

        // Remove the chart and insert it at the target position
        newChartsOrder.splice(indexSource, 1);
        newChartsOrder.splice(indexTarget, 0, sourceChart);

        return { ...current, compareRunCharts: newChartsOrder };
      });
    },
    [updateChartsUIState],
  );

  // Callback invoked when a card is dropped
  const onDropChartCard = useCallback(() => {
    const draggedChartUuid = immediateDraggedCardUuid.current;
    const targetSectionId = immediateTargetSectionId.current;
    const targetPosition = targetLocalPosition.current;

    if (draggedChartUuid === null || targetSectionId === null || targetPosition === null) {
      return;
    }

    setDraggedCardUuid(null);

    updateChartsUIState((current) => {
      // Find the source card and section in the current state
      const sourceCard = current.compareRunCharts?.find((chart) => chart.uuid === draggedChartUuid);
      if (!sourceCard) {
        return current;
      }

      const sourceSection = current.compareRunSections?.find((section) => section.uuid === sourceCard?.metricSectionId);

      // Find the target section in the current state
      const targetSection = current.compareRunSections?.find((section) => section.uuid === targetSectionId);

      // Get all the cards in the source section
      const sourceSectionCards = current.compareRunCharts?.filter(
        (chartCard) => chartCard.metricSectionId === sourceSection?.uuid,
      );

      // If we're moving the card within the same section
      if (sourceSection === targetSection) {
        // Copy the resulting chart list
        const resultChartsList = current.compareRunCharts?.slice();

        // Get all the currently visible cards (excluding hidden and deleted cards)
        const visibleSectionCards = sourceSectionCards?.filter((chartCard) => visibleChartCards.includes(chartCard));

        if (!resultChartsList || !visibleSectionCards) {
          return current;
        }

        // Find the original position
        const originalIndex = resultChartsList.findIndex((chartCard) => chartCard.uuid === draggedChartUuid);

        // Clamp the target position index to the visible section cards
        const clampedLocalPosition = Math.min(targetPosition, visibleSectionCards.length - 1);

        // Map from the index in the section to a global index
        const targetIndex = indexOf(resultChartsList, visibleSectionCards?.[clampedLocalPosition]);

        // If we found the original index and the target index
        if (resultChartsList && originalIndex !== -1 && targetIndex !== -1) {
          // Remove the card from the original position
          resultChartsList.splice(originalIndex, 1);
          // Insert the card at the target position
          resultChartsList.splice(targetIndex, 0, sourceCard);
        }

        return {
          ...current,
          compareRunCharts: resultChartsList,
        };
      } else {
        // If we're moving card to a new section
        const targetSectionCards = current.compareRunCharts?.filter(
          (chart) => chart.metricSectionId === targetSectionId && !chart.deleted,
        );

        // Calculate the target position in the target section
        if (targetSectionCards) {
          targetSectionCards.splice(targetPosition, 0, sourceCard);
        }

        return {
          ...current,
          // Use the target position in the sorting function to determine the new position
          compareRunCharts: sortBy(current.compareRunCharts, (a) => targetSectionCards?.indexOf(a) ?? -1).map(
            (chart) => {
              // Also, update the metricSectionId of the dragged card
              if (chart.uuid === sourceCard.uuid) {
                return {
                  ...chart,
                  metricSectionId: targetSectionId,
                };
              }
              return chart;
            },
          ),
          compareRunSections: current.compareRunSections?.map((section) => {
            if (section.uuid === sourceSection?.uuid || section.uuid === targetSection?.uuid) {
              return { ...section, isReordered: true };
            }
            return section;
          }),
        };
      }
    });
  }, [updateChartsUIState, visibleChartCards]);

  // For performance purposes, expose two different contexts:
  // one for state (changing but rarely consumed) and one for actions (static but consumed often)
  const stateContextValue = useMemo(
    () => ({
      draggedCardUuid,
      targetSection: targetSectionUuid,
      isDragging,
    }),
    [draggedCardUuid, targetSectionUuid, isDragging],
  );

  const actionsContextValue = useMemo(
    () => ({
      setDraggedCardUuid,
      setTargetSection: setTargetSectionUuid,
      setTargetPosition,
      onDropChartCard,
      onSwapCards,
    }),
    [onDropChartCard, onSwapCards, setTargetPosition],
  );

  return (
    <DragAndDropProvider>
      <RunsChartsDraggableGridStateContext.Provider value={stateContextValue}>
        <RunsChartsDraggableGridActionsContext.Provider value={actionsContextValue}>
          {children}
        </RunsChartsDraggableGridActionsContext.Provider>
      </RunsChartsDraggableGridStateContext.Provider>
    </DragAndDropProvider>
  );
};
```

--------------------------------------------------------------------------------

````
