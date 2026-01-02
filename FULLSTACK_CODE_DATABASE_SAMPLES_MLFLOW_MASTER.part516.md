---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 516
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 516 of 991)

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

---[FILE: RunsChartsConfigureModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsConfigureModal.tsx
Signals: React

```typescript
/**
 * TODO: implement actual UI for this modal, it's a crude placeholder with minimal logic for now
 */
import { Modal, useDesignSystemTheme, SimpleSelect, SimpleSelectOption } from '@databricks/design-system';
import type { Interpolation, Theme } from '@emotion/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import type {
  RunsChartsBarCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsContourCardConfig,
  RunsChartsScatterCardConfig,
  RunsChartsParallelCardConfig,
  RunsChartsDifferenceCardConfig,
  RunsChartsImageCardConfig,
} from '../runs-charts.types';
import { RunsChartsCardConfig, RunsChartType, type RunsChartsMetricByDatasetEntry } from '../runs-charts.types';

import { ReactComponent as ChartBarIcon } from '../../../../common/static/chart-bar.svg';
import { ReactComponent as ChartContourIcon } from '../../../../common/static/chart-contour.svg';
import { ReactComponent as ChartLineIcon } from '../../../../common/static/chart-line.svg';
import { ReactComponent as ChartParallelIcon } from '../../../../common/static/chart-parallel.svg';
import { ReactComponent as ChartScatterIcon } from '../../../../common/static/chart-scatter.svg';
import { ReactComponent as ChartDifferenceIcon } from '../../../../common/static/chart-difference.svg';
import { ReactComponent as ChartImageIcon } from '../../../../common/static/chart-image.svg';
import { RunsChartsConfigureBarChart } from './config/RunsChartsConfigureBarChart';
import { RunsChartsConfigureParallelChart } from './config/RunsChartsConfigureParallelChart';
import type { RunsChartsRunData } from './RunsCharts.common';
import { RunsChartsConfigureField } from './config/RunsChartsConfigure.common';
import { RunsChartsConfigureLineChart } from './config/RunsChartsConfigureLineChart';
import { RunsChartsConfigureLineChartPreview } from './config/RunsChartsConfigureLineChart.preview';
import { RunsChartsConfigureBarChartPreview } from './config/RunsChartsConfigureBarChart.preview';
import { RunsChartsConfigureContourChartPreview } from './config/RunsChartsConfigureContourChart.preview';
import { RunsChartsConfigureScatterChartPreview } from './config/RunsChartsConfigureScatterChart.preview';
import { RunsChartsConfigureParallelChartPreview } from './config/RunsChartsConfigureParallelChart.preview';
import { RunsChartsConfigureContourChart } from './config/RunsChartsConfigureContourChart';
import { RunsChartsConfigureScatterChart } from './config/RunsChartsConfigureScatterChart';
import { RunsChartsTooltipBody } from './RunsChartsTooltipBody';
import { RunsChartsTooltipWrapper } from '../hooks/useRunsChartsTooltip';
import { RunsChartsConfigureDifferenceChart } from './config/RunsChartsConfigureDifferenceChart';
import type { RunsGroupByConfig } from '../../experiment-page/utils/experimentPage.group-row-utils';
import { RunsChartsConfigureImageChart } from './config/RunsChartsConfigureImageChart';
import { RunsChartsConfigureImageChartPreview } from './config/RunsChartsConfigureImageChart.preview';
import type { RunsChartsGlobalLineChartConfig } from '../../experiment-page/models/ExperimentPageUIState';
import { isEmpty } from 'lodash';
import { RunsChartsConfigureScatterChartWithDatasets } from './config/RunsChartsConfigureScatterChartWithDatasets';
import { DifferenceViewPlot } from './charts/DifferenceViewPlot';

const previewComponentsMap: Record<
  RunsChartType,
  React.FC<
    React.PropsWithChildren<{
      previewData: RunsChartsRunData[];
      cardConfig: any;
      groupBy: RunsGroupByConfig | null;
      globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
      setCardConfig: (
        setter: (
          current: RunsChartsCardConfig,
        ) => RunsChartsDifferenceCardConfig | RunsChartsImageCardConfig | RunsChartsLineCardConfig,
      ) => void;
    }>
  >
> = {
  [RunsChartType.BAR]: RunsChartsConfigureBarChartPreview,
  [RunsChartType.CONTOUR]: RunsChartsConfigureContourChartPreview,
  [RunsChartType.LINE]: RunsChartsConfigureLineChartPreview,
  [RunsChartType.PARALLEL]: RunsChartsConfigureParallelChartPreview,
  [RunsChartType.SCATTER]: RunsChartsConfigureScatterChartPreview,
  [RunsChartType.DIFFERENCE]: DifferenceViewPlot,
  [RunsChartType.IMAGE]: RunsChartsConfigureImageChartPreview,
};

export const RunsChartsConfigureModal = ({
  onCancel,
  onSubmit,
  config,
  chartRunData,
  metricKeyList,
  metricKeysByDataset,
  paramKeyList,
  groupBy,
  supportedChartTypes,
  globalLineChartConfig,
}: {
  metricKeyList: string[];
  metricKeysByDataset?: RunsChartsMetricByDatasetEntry[];
  paramKeyList: string[];
  config: RunsChartsCardConfig;
  chartRunData: RunsChartsRunData[];
  onCancel: () => void;
  groupBy: RunsGroupByConfig | null;
  onSubmit: (formData: Partial<RunsChartsCardConfig>) => void;
  supportedChartTypes?: RunsChartType[] | undefined;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
}) => {
  const isChartTypeSupported = (type: RunsChartType) => !supportedChartTypes || supportedChartTypes.includes(type);
  const { theme } = useDesignSystemTheme();
  const borderStyle = `1px solid ${theme.colors.actionDefaultBorderDefault}`;
  // if a user is editing a generated chart, we should set isGenerated to false
  const [currentFormState, setCurrentFormState] = useState<RunsChartsCardConfig>({ ...config, isGenerated: false });

  const isEditing = Boolean(currentFormState.uuid);

  const updateChartType = useCallback((type?: RunsChartType) => {
    if (!type) {
      return;
    }
    const emptyChartCard = RunsChartsCardConfig.getEmptyChartCardByType(type, false);
    if (emptyChartCard) {
      setCurrentFormState(emptyChartCard);
    }
  }, []);

  const previewData = useMemo(() => chartRunData.filter(({ hidden }) => !hidden).reverse(), [chartRunData]);

  const imageKeyList = useMemo(() => {
    const imageKeys = new Set<string>();
    previewData.forEach((run) => {
      Object.keys(run.images).forEach((imageKey) => {
        imageKeys.add(imageKey);
      });
    });
    return Array.from(imageKeys).sort();
  }, [previewData]);

  const renderConfigOptionsforChartType = (type?: RunsChartType) => {
    if (type === RunsChartType.BAR) {
      return (
        <RunsChartsConfigureBarChart
          metricKeyList={metricKeyList}
          metricKeysByDataset={metricKeysByDataset}
          state={currentFormState as RunsChartsBarCardConfig}
          onStateChange={setCurrentFormState}
        />
      );
    }
    if (type === RunsChartType.CONTOUR) {
      return (
        <RunsChartsConfigureContourChart
          metricKeyList={metricKeyList}
          paramKeyList={paramKeyList}
          state={currentFormState as RunsChartsContourCardConfig}
          onStateChange={setCurrentFormState}
        />
      );
    }
    if (type === RunsChartType.LINE) {
      return (
        <RunsChartsConfigureLineChart
          metricKeyList={metricKeyList}
          state={currentFormState as RunsChartsLineCardConfig}
          onStateChange={setCurrentFormState}
        />
      );
    }
    if (type === RunsChartType.PARALLEL) {
      return (
        <RunsChartsConfigureParallelChart
          metricKeyList={metricKeyList}
          paramKeyList={paramKeyList}
          state={currentFormState as RunsChartsParallelCardConfig}
          onStateChange={setCurrentFormState}
        />
      );
    }
    if (type === RunsChartType.SCATTER) {
      if (!isEmpty(metricKeysByDataset)) {
        return (
          <RunsChartsConfigureScatterChartWithDatasets
            paramKeyList={paramKeyList}
            metricKeysByDataset={metricKeysByDataset}
            state={currentFormState as RunsChartsScatterCardConfig}
            onStateChange={setCurrentFormState}
          />
        );
      }
      return (
        <RunsChartsConfigureScatterChart
          metricKeyList={metricKeyList}
          paramKeyList={paramKeyList}
          state={currentFormState as RunsChartsScatterCardConfig}
          onStateChange={setCurrentFormState}
        />
      );
    }
    if (type === RunsChartType.DIFFERENCE) {
      return (
        <RunsChartsConfigureDifferenceChart
          metricKeyList={metricKeyList}
          paramKeyList={paramKeyList}
          state={currentFormState as RunsChartsDifferenceCardConfig}
          onStateChange={setCurrentFormState}
          groupBy={groupBy}
        />
      );
    }
    if (type === RunsChartType.IMAGE) {
      return (
        <RunsChartsConfigureImageChart
          previewData={previewData}
          imageKeyList={imageKeyList}
          state={currentFormState as RunsChartsImageCardConfig}
          onStateChange={setCurrentFormState}
        />
      );
    }
    return null;
  };

  const renderPreviewChartType = (type?: RunsChartType) => {
    if (!type) {
      return null;
    }
    const PreviewComponent = previewComponentsMap[type];
    if (!PreviewComponent) {
      return null;
    }
    return (
      <PreviewComponent
        previewData={previewData}
        cardConfig={currentFormState}
        groupBy={groupBy}
        setCardConfig={setCurrentFormState}
        globalLineChartConfig={globalLineChartConfig}
      />
    );
  };

  const { formatMessage } = useIntl();

  let disableSaveButton = false;
  if (currentFormState.type === RunsChartType.LINE) {
    const lineCardConfig = currentFormState as RunsChartsLineCardConfig;
    disableSaveButton = (lineCardConfig.selectedMetricKeys ?? []).length === 0;
  }

  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsconfiguremodal.tsx_232"
      visible
      onCancel={onCancel}
      onOk={() => onSubmit(currentFormState)}
      title={
        isEditing
          ? formatMessage({
              defaultMessage: 'Edit chart',
              description: 'Title of the modal when editing a runs comparison chart',
            })
          : formatMessage({
              defaultMessage: 'Add new chart',
              description: 'Title of the modal when adding a new runs comparison chart',
            })
      }
      okButtonProps={{
        'data-testid': 'experiment-view-compare-runs-chart-modal-confirm',
        disabled: disableSaveButton,
      }}
      cancelText={formatMessage({
        defaultMessage: 'Cancel',
        description: 'Cancel button label within a modal for adding/editing a new runs comparison chart',
      })}
      okText={
        isEditing
          ? formatMessage({
              defaultMessage: 'Save changes',
              description: 'Confirm button label within a modal when editing a runs comparison chart',
            })
          : formatMessage({
              defaultMessage: 'Add chart',
              description: 'Confirm button label within a modal when adding a new runs comparison chart',
            })
      }
      size="wide"
      css={{ width: 1280 }}
      dangerouslySetAntdProps={{
        bodyStyle: {
          overflowY: 'hidden',
          display: 'flex',
        },
      }}
    >
      <div
        css={{
          // TODO: wait for modal dimensions decision
          display: 'flex',
          width: '100%',
          gridTemplateColumns: '300px 1fr',
          gap: theme.spacing.md,
          borderTop: borderStyle,
          borderBottom: borderStyle,
        }}
      >
        <div
          css={{
            overflowY: 'auto',
            borderRight: borderStyle,
            padding: `${theme.spacing.md}px ${theme.spacing.md}px ${theme.spacing.md}px 0px`,
            width: '300px',
          }}
        >
          {!isEditing && (
            <RunsChartsConfigureField title="Chart type">
              <SimpleSelect
                componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsconfiguremodal.tsx_296"
                id="chart-type-select"
                css={{ width: '100%' }}
                value={currentFormState.type}
                onChange={({ target }) => {
                  const chartType = target.value as RunsChartType;
                  Object.values(RunsChartType).includes(chartType) && updateChartType(chartType);
                }}
              >
                {isChartTypeSupported(RunsChartType.BAR) && (
                  <SimpleSelectOption value={RunsChartType.BAR}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartBarIcon />
                      <FormattedMessage
                        defaultMessage="Bar chart"
                        description="Experiment tracking > runs charts > add chart menu > bar chart"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
                {isChartTypeSupported(RunsChartType.SCATTER) && (
                  <SimpleSelectOption value={RunsChartType.SCATTER}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartScatterIcon />
                      <FormattedMessage
                        defaultMessage="Scatter chart"
                        description="Experiment tracking > runs charts > add chart menu > scatter plot"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
                {isChartTypeSupported(RunsChartType.LINE) && (
                  <SimpleSelectOption value={RunsChartType.LINE}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartLineIcon />
                      <FormattedMessage
                        defaultMessage="Line chart"
                        description="Experiment tracking > runs charts > add chart menu > line chart"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
                {isChartTypeSupported(RunsChartType.PARALLEL) && (
                  <SimpleSelectOption value={RunsChartType.PARALLEL}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartParallelIcon />
                      <FormattedMessage
                        defaultMessage="Parallel coordinates"
                        description="Experiment tracking > runs charts > add chart menu > parallel coordinates"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
                {isChartTypeSupported(RunsChartType.CONTOUR) && (
                  <SimpleSelectOption value={RunsChartType.CONTOUR}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartContourIcon />
                      <FormattedMessage
                        defaultMessage="Contour chart"
                        description="Experiment tracking > runs charts > add chart menu > contour chart"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
                {isChartTypeSupported(RunsChartType.DIFFERENCE) && (
                  <SimpleSelectOption value={RunsChartType.DIFFERENCE}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartDifferenceIcon />
                      <FormattedMessage
                        defaultMessage="Difference view"
                        description="Experiment tracking > runs charts > add chart menu > difference view"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
                {isChartTypeSupported(RunsChartType.IMAGE) && (
                  <SimpleSelectOption value={RunsChartType.IMAGE}>
                    <div css={styles.chartTypeOption(theme)}>
                      <ChartImageIcon />
                      <FormattedMessage
                        defaultMessage="Image grid"
                        description="Experiment tracking > runs charts > add chart menu > image grid"
                      />
                    </div>
                  </SimpleSelectOption>
                )}
              </SimpleSelect>
            </RunsChartsConfigureField>
          )}
          {renderConfigOptionsforChartType(currentFormState.type)}
        </div>
        <div css={{ overflow: 'auto', flexGrow: 1 }}>
          <RunsChartsTooltipWrapper contextData={{ runs: chartRunData }} component={RunsChartsTooltipBody} hoverOnly>
            <div
              css={{
                minHeight: 500,
                height: '100%',
                width: 500,
                padding: '32px 0px',
                display: 'flex',
              }}
            >
              {renderPreviewChartType(currentFormState.type)}
            </div>
          </RunsChartsTooltipWrapper>
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  chartTypeOption: (theme: Theme) =>
    ({
      display: 'grid',
      gridTemplateColumns: `${theme.general.iconSize + theme.spacing.xs}px 1fr`,
      gap: theme.spacing.xs,
      alignItems: 'center',
    } as Interpolation<Theme>),
  field: {
    // TODO: wait for modal dimensions decision
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    marginBottom: 16,
  } as Interpolation<Theme>,
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsDraggableCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsDraggableCard.tsx
Signals: React

```typescript
import { forwardRef, memo, useCallback, useRef, useState } from 'react';
import { RunsChartsCard, type RunsChartsCardProps } from './cards/RunsChartsCard';
import { DraggableCore, type DraggableEventHandler } from 'react-draggable';
import { Resizable } from 'react-resizable';
import { Spinner, useDesignSystemTheme } from '@databricks/design-system';
import { useIsInViewport } from '../hooks/useIsInViewport';
import { useDebounce } from 'use-debounce';
import {
  DRAGGABLE_CARD_HANDLE_CLASS,
  DRAGGABLE_CARD_TRANSITION_VAR,
  RunsChartCardLoadingPlaceholder,
} from './cards/ChartCard.common';
import { useRunsChartsDraggableGridActionsContext } from './RunsChartsDraggableCardsGridContext';
import { RUNS_CHARTS_UI_Z_INDEX } from '../utils/runsCharts.const';

const VIEWPORT_DEBOUNCE_MS = 150;

interface RunsChartsDraggableCardProps extends RunsChartsCardProps {
  uuid?: string;
  translateBy?: { x: number; y: number; overflowing: boolean };
  onResizeStart: (rect: DOMRect) => void;
  onResize: (width: number, height: number) => void;
  onResizeStop: () => void;
}

export const RunsChartsDraggableCard = memo((props: RunsChartsDraggableCardProps) => {
  const { setElementRef, isInViewport } = useIsInViewport<HTMLDivElement>();
  const { uuid, translateBy, onResizeStart, onResize, onResizeStop, ...cardProps } = props;
  const { theme } = useDesignSystemTheme();

  const [deferredValue] = useDebounce(isInViewport, VIEWPORT_DEBOUNCE_MS);
  const isInViewportDeferred = deferredValue;

  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { setDraggedCardUuid, onDropChartCard } = useRunsChartsDraggableGridActionsContext();

  const draggedCardElementRef = useRef<HTMLDivElement | null>(null);

  const onStartDrag = useCallback<DraggableEventHandler>(
    (_, { x, y }) => {
      setIsDragging(true);
      setDraggedCardUuid(uuid ?? null);
      setOrigin({ x, y });
    },
    [setDraggedCardUuid, uuid],
  );

  const onDrag = useCallback(
    (_, { x, y }) => {
      if (draggedCardElementRef.current) {
        draggedCardElementRef.current.style.transform = `translate3d(${x - origin.x}px, ${y - origin.y}px, 0)`;
      }
    },
    [origin],
  );

  const onStopDrag = useCallback(() => {
    onDropChartCard();
    setDraggedCardUuid(null);
    if (draggedCardElementRef.current) {
      draggedCardElementRef.current.style.transform = '';
    }
    setIsDragging(false);
  }, [onDropChartCard, setDraggedCardUuid, draggedCardElementRef]);

  const onResizeStartInternal = useCallback(() => {
    const rect = draggedCardElementRef.current?.getBoundingClientRect();
    if (rect) {
      setResizeWidth(rect?.width ?? 0);
      setResizeHeight(rect?.height ?? 0);
      onResizeStart?.(rect);
    }
  }, [onResizeStart, draggedCardElementRef]);

  const onResizeInternal = useCallback(
    (_, { size }) => {
      setResizeWidth(size.width);
      setResizeHeight(size.height);
      onResize(size.width, size.height);
    },
    [onResize],
  );

  if (!isInViewport) {
    // If the card is not in the viewport, we avoid rendering draggable/resizable components
    // and render a placeholder element having card's height instead.
    return (
      <RunsChartCardLoadingPlaceholder
        style={{
          height: props.height,
        }}
        css={{
          backgroundColor: theme.colors.backgroundPrimary,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.general.borderRadiusBase,
        }}
        ref={setElementRef}
      />
    );
  }

  return (
    <DraggableCore
      enableUserSelectHack={false}
      onStart={onStartDrag}
      onDrag={onDrag}
      onStop={onStopDrag}
      handle={`.${DRAGGABLE_CARD_HANDLE_CLASS}`}
    >
      <Resizable
        width={resizeWidth}
        height={resizeHeight}
        axis="both"
        onResizeStart={onResizeStartInternal}
        onResizeStop={onResizeStop}
        onResize={onResizeInternal}
        handle={<ResizableHandle />}
      >
        <div
          ref={(element) => {
            draggedCardElementRef.current = element;
            setElementRef(element);
          }}
          style={
            isDragging
              ? {
                  // Make sure the dragged card is on top of all other cards
                  zIndex: RUNS_CHARTS_UI_Z_INDEX.CARD_DRAGGED,
                  pointerEvents: 'none',
                }
              : {
                  transition: DRAGGABLE_CARD_TRANSITION_VAR,
                  transform: `translate3d(${translateBy?.x ?? 0}px,${translateBy?.y ?? 0}px,0)`,
                  opacity: translateBy?.overflowing ? 0 : 1,
                }
          }
        >
          <RunsChartsCard {...cardProps} isInViewport={isInViewport} isInViewportDeferred={isInViewportDeferred} />
        </div>
      </Resizable>
    </DraggableCore>
  );
});

const ResizableHandle = forwardRef((props, ref) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      ref={ref as any}
      {...props}
      data-testid="draggable-card-resize-handle"
      css={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        cursor: 'se-resize',
        lineHeight: 0,
        padding: theme.spacing.xs,
        color: theme.colors.actionDefaultIconDefault,
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8">
        <path d="M6 6V0H8V8H0V6H6Z" fill="currentColor" />
      </svg>
    </div>
  );
});
```

--------------------------------------------------------------------------------

````
