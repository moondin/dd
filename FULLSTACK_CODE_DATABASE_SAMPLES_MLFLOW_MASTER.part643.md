---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 643
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 643 of 991)

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

---[FILE: ModelTraceExplorerIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerIcon.tsx

```typescript
import {
  ModelsIcon,
  ConnectIcon,
  FileDocumentIcon,
  useDesignSystemTheme,
  SortUnsortedIcon,
  QuestionMarkIcon,
  CodeIcon,
  FunctionIcon,
  NumbersIcon,
  SearchIcon,
  WrenchIcon,
  UserSparkleIcon,
  ChainIcon,
  UserIcon,
  GearIcon,
  SaveIcon,
} from '@databricks/design-system';

import { ModelIconType } from './ModelTrace.types';

export const ModelTraceExplorerIcon = ({
  type = ModelIconType.CONNECT,
  // tooltips have inverted colors so the icon should match it
  isInTooltip = false,
  hasException = false,
  isRootSpan = false,
}: {
  type?: ModelIconType;
  isInTooltip?: boolean;
  hasException?: boolean;
  isRootSpan?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  // base icon colors depending on span attributes
  let iconColor: 'ai' | 'danger' | undefined;
  if (isRootSpan) {
    iconColor = 'ai';
  } else if (hasException) {
    iconColor = 'danger';
  }

  const iconMap = {
    [ModelIconType.MODELS]: <ModelsIcon color={iconColor} />,
    [ModelIconType.DOCUMENT]: <FileDocumentIcon color={iconColor} />,
    [ModelIconType.CONNECT]: <ConnectIcon color={iconColor} />,
    [ModelIconType.CODE]: <CodeIcon color={iconColor} />,
    [ModelIconType.FUNCTION]: <FunctionIcon color={iconColor} />,
    [ModelIconType.NUMBERS]: <NumbersIcon color={iconColor} />,
    [ModelIconType.SEARCH]: <SearchIcon color={iconColor} />,
    [ModelIconType.SORT]: <SortUnsortedIcon color={iconColor} />,
    [ModelIconType.UNKNOWN]: <QuestionMarkIcon color={iconColor} />,
    [ModelIconType.WRENCH]: <WrenchIcon color={iconColor} />,
    [ModelIconType.AGENT]: <UserSparkleIcon color={iconColor} />,
    [ModelIconType.CHAIN]: <ChainIcon color={iconColor} />,
    [ModelIconType.USER]: <UserIcon color={iconColor} />,
    [ModelIconType.SYSTEM]: <GearIcon color={iconColor} />,
    [ModelIconType.SAVE]: <SaveIcon color={iconColor} />,
  };

  // custom colors depending on span type
  // these are not official props on the
  // icon components, so they must be set
  // via the `css` prop on the parent
  let color: string = theme.colors.actionDefaultIconDefault;
  let tooltipColor: string = theme.colors.actionPrimaryIcon;
  let backgroundColor: string = theme.colors.backgroundSecondary;
  switch (type) {
    case ModelIconType.SEARCH:
      color = theme.colors.textValidationSuccess;
      tooltipColor = theme.colors.green500;
      backgroundColor = theme.isDarkMode ? theme.colors.green800 : theme.colors.green100;
      break;
    case ModelIconType.MODELS:
      color = theme.isDarkMode ? theme.colors.blue500 : theme.colors.turquoise;
      tooltipColor = theme.isDarkMode ? theme.colors.turquoise : theme.colors.blue500;
      backgroundColor = theme.isDarkMode ? theme.colors.blue800 : theme.colors.blue100;
      break;
    case ModelIconType.WRENCH:
      color = theme.isDarkMode ? theme.colors.red500 : theme.colors.red700;
      tooltipColor = theme.isDarkMode ? theme.colors.red700 : theme.colors.red500;
      backgroundColor = theme.isDarkMode ? theme.colors.red800 : theme.colors.red100;
      break;
  }

  return (
    <div
      css={{
        position: 'relative',
        width: theme.general.iconSize,
        height: theme.general.iconSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borders.borderRadiusSm,
        background: isInTooltip ? theme.colors.tooltipBackgroundTooltip : backgroundColor,
        color: isInTooltip ? tooltipColor : color,
        svg: { width: theme.general.iconFontSize, height: theme.general.iconFontSize },
        flexShrink: 0,
      }}
    >
      {hasException && (
        <div
          css={{
            position: 'absolute',
            top: -theme.spacing.xs,
            right: -theme.spacing.xs,
            height: theme.spacing.sm,
            width: theme.spacing.sm,
            borderRadius: theme.borders.borderRadiusSm,
            backgroundColor: theme.colors.actionDangerPrimaryBackgroundDefault,
            zIndex: 5,
          }}
        />
      )}
      {iconMap[type]}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerMetricSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerMetricSection.tsx

```typescript
import type { TagColors } from '@databricks/design-system';
import { Tag, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';

export const ModelTraceHeaderMetricSection = ({
  label,
  value,
  displayValue = value,
  icon,
  color,
  getTruncatedLabel,
  onCopy,
}: {
  label: React.ReactNode;
  /**
   * Actual value used to copy to clipboard and show in tooltip
   */
  value: string;
  /**
   * Optional display value to show in the tag. If not provided, `value` will be used.
   */
  displayValue?: string;
  icon?: React.ReactNode;
  color?: TagColors;
  getTruncatedLabel: (label: string) => string;
  onCopy: () => void;
}) => {
  const { theme } = useDesignSystemTheme();

  const handleClick = () => {
    navigator.clipboard.writeText(value);
    onCopy();
  };

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
      }}
    >
      <Typography.Text size="md" color="secondary">
        {label}
      </Typography.Text>
      <Tooltip componentId="shared.model-trace-explorer.header-details.tooltip" content={value} maxWidth={400}>
        <Tag
          componentId="shared.model-trace-explorer.header-details.tag"
          color={color}
          onClick={handleClick}
          css={{ cursor: 'pointer' }}
        >
          <span css={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            {icon && <span>{icon}</span>}
            <span>{getTruncatedLabel(displayValue)}</span>
          </span>
        </Tag>
      </Tooltip>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRenderModeToggle.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerRenderModeToggle.tsx

```typescript
import {
  MarkdownIcon,
  SegmentedControlButton,
  SegmentedControlGroup,
  TextBoxIcon,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

export function ModelTraceExplorerRenderModeToggle({
  shouldRenderMarkdown,
  setShouldRenderMarkdown,
}: {
  shouldRenderMarkdown: boolean;
  setShouldRenderMarkdown: (value: boolean) => void;
}) {
  const { theme } = useDesignSystemTheme();

  return (
    <SegmentedControlGroup
      data-testid="model-trace-explorer-render-mode-toggle"
      name="render-mode"
      size="small"
      componentId={`shared.model-trace-explorer.toggle-markdown-rendering-${!shouldRenderMarkdown}`}
      value={shouldRenderMarkdown}
      onChange={(event) => {
        setShouldRenderMarkdown(event.target.value);
      }}
    >
      <SegmentedControlButton data-testid="model-trace-explorer-render-raw-input-button" value={false}>
        <Tooltip
          componentId="shared.model-trace-explorer.raw-input-rendering-tooltip"
          content={
            <FormattedMessage
              defaultMessage="Raw input"
              description="Tooltip content for a button that changes the render mode of the data to raw input (JSON)"
            />
          }
        >
          <div css={{ display: 'flex', alignItems: 'center' }}>
            <TextBoxIcon css={{ fontSize: theme.typography.fontSizeLg }} />
          </div>
        </Tooltip>
      </SegmentedControlButton>
      <SegmentedControlButton data-testid="model-trace-explorer-render-default-button" value>
        <Tooltip
          componentId="shared.model-trace-explorer.default-rendering-tooltip"
          content={
            <FormattedMessage
              defaultMessage="Default rendering"
              description="Tooltip content for a button that changes the render mode to default"
            />
          }
        >
          <div css={{ display: 'flex', alignItems: 'center' }}>
            <MarkdownIcon css={{ fontSize: theme.typography.fontSizeLg }} />
          </div>
        </Tooltip>
      </SegmentedControlButton>
    </SegmentedControlGroup>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerResizablePane.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerResizablePane.tsx
Signals: React

```typescript
import { Global } from '@emotion/react';
import { clamp } from 'lodash';
import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { ResizableBox } from 'react-resizable';

import { useDesignSystemTheme } from '@databricks/design-system';

import { useResizeObserver } from '../hooks';

interface ModelTraceExplorerResizablePaneProps {
  initialRatio: number;
  paneWidth: number;
  setPaneWidth: (paneWidth: number) => void;
  leftChild: React.ReactNode;
  leftMinWidth: number;
  rightChild: React.ReactNode;
  rightMinWidth: number;
}

export interface ModelTraceExplorerResizablePaneRef {
  updateRatio: (newPaneWidth: number) => void;
  getContainerWidth: () => number | undefined;
}

/**
 * This component takes a left and right child, and adds
 * a draggable handle between them to resize. It handles
 * logic such as preserving the ratio of the pane width
 * when the container/window is resized, and also ensures
 * that the left and right panes conform to specified min
 * widths.
 */
const ModelTraceExplorerResizablePane = forwardRef<
  ModelTraceExplorerResizablePaneRef,
  ModelTraceExplorerResizablePaneProps
>(({ initialRatio, paneWidth, setPaneWidth, leftChild, leftMinWidth, rightChild, rightMinWidth }, ref) => {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useResizeObserver({ ref: containerRef })?.width;
  // if container width is not available, don't set a max width
  const maxWidth = (containerWidth ?? Infinity) - rightMinWidth;

  const ratio = useRef(initialRatio);
  const { theme } = useDesignSystemTheme();

  const updateRatio = useCallback(
    // used by the parent component to update the ratio when
    // the pane is resized via the show/hide gantt button
    (newPaneWidth: number) => {
      if (containerWidth) {
        ratio.current = newPaneWidth / containerWidth;
      }
    },
    [containerWidth],
  );

  const getContainerWidth = useCallback(() => containerWidth, [containerWidth]);

  useImperativeHandle(ref, () => ({
    updateRatio,
    getContainerWidth,
  }));

  useLayoutEffect(() => {
    // preserve the ratio of the pane width when the container is resized
    if (containerWidth) {
      setPaneWidth(clamp(containerWidth * ratio.current, leftMinWidth, maxWidth));
    }
  }, [containerWidth, maxWidth, leftMinWidth, rightMinWidth, setPaneWidth]);

  return (
    <div
      ref={containerRef}
      css={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
      }}
    >
      {isResizing && (
        <Global
          styles={{
            'body, :host': {
              userSelect: 'none',
            },
          }}
        />
      )}
      <ResizableBox
        axis="x"
        width={paneWidth}
        css={{ display: 'flex', flex: `0 0 ${paneWidth}px` }}
        handle={
          <div css={{ width: 0, position: 'relative' }}>
            <div
              css={{
                position: 'relative',
                width: theme.spacing.sm,
                marginLeft: -theme.spacing.xs,
                minHeight: '100%',
                cursor: 'ew-resize',
                backgroundColor: `rgba(0,0,0,0)`,
                zIndex: 1,
                ':hover': {
                  backgroundColor: `rgba(0,0,0,0.1)`,
                },
              }}
            />
          </div>
        }
        onResize={(e, { size }) => {
          const clampedSize = clamp(size.width, leftMinWidth, maxWidth);
          setPaneWidth(clampedSize);
          if (containerWidth) {
            ratio.current = clampedSize / containerWidth;
          }
        }}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => setIsResizing(false)}
        minConstraints={[leftMinWidth, Infinity]}
        maxConstraints={[maxWidth, Infinity]}
      >
        {leftChild}
      </ResizableBox>
      {rightChild}
    </div>
  );
});

export default ModelTraceExplorerResizablePane;
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerSearchBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerSearchBox.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Input,
  SearchIcon,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';

import type { SearchMatch } from './ModelTrace.types';

const ModelTraceExplorerSearchBox = ({
  searchFilter,
  setSearchFilter,
  matchData,
  handleNextSearchMatch,
  handlePreviousSearchMatch,
}: {
  searchFilter: string;
  setSearchFilter: (searchFilter: string) => void;
  matchData: {
    match: SearchMatch | null;
    totalMatches: number;
    currentMatchIndex: number;
  };
  handleNextSearchMatch: () => void;
  handlePreviousSearchMatch: () => void;
}) => {
  const [searchValue, setSearchValue] = useState(searchFilter);
  const debouncedSetSearchFilter = useDebouncedCallback(setSearchFilter, 350);
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
      }}
    >
      <Input
        componentId="shared.model-trace-explorer.search-input"
        allowClear
        placeholder="Search"
        value={searchValue}
        onClear={() => {
          setSearchFilter('');
          setSearchValue('');
        }}
        onChange={(e) => {
          setSearchValue(e.target.value);
          debouncedSetSearchFilter(e.target.value.toLowerCase());
        }}
        prefix={<SearchIcon />}
        css={{
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {matchData.match && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: theme.spacing.xs,
            marginRight: theme.spacing.sm,
            alignItems: 'center',
          }}
        >
          <Typography.Text css={{ whiteSpace: 'nowrap', marginRight: theme.spacing.sm }}>
            {matchData.currentMatchIndex + 1} / {matchData.totalMatches}
          </Typography.Text>
          <Button
            data-testid="prev-search-match"
            icon={<ChevronUpIcon />}
            onClick={handlePreviousSearchMatch}
            componentId="shared.model-trace-explorer.prev-search-match"
          />
          <Button
            data-testid="next-search-match"
            icon={<ChevronDownIcon />}
            onClick={handleNextSearchMatch}
            componentId="shared.model-trace-explorer.next-search-match"
          />
        </div>
      )}
    </div>
  );
};

export default ModelTraceExplorerSearchBox;
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerSkeleton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerSkeleton.tsx

```typescript
import { TableSkeleton, TitleSkeleton, useDesignSystemTheme } from '@databricks/design-system';

export const ModelTraceExplorerSkeleton = ({ label }: { label?: React.ReactNode }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div css={{ display: 'flex', height: '100%' }}>
      <div css={{ flex: 1 }}>
        <div css={{ padding: theme.spacing.sm, borderBottom: `1px solid ${theme.colors.border}` }}>
          <TitleSkeleton label={label} />
        </div>
        <div
          css={{
            borderRadius: theme.legacyBorders.borderRadiusMd,
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <div css={{ flex: 1, padding: theme.spacing.sm, borderRight: `1px solid ${theme.colors.border}` }}>
            <TableSkeleton lines={5} />
          </div>
          <div css={{ flex: 2, padding: theme.spacing.sm }}>
            <TableSkeleton lines={5} />
          </div>
        </div>
      </div>
      <div css={{ padding: theme.spacing.md, overflowY: 'auto', flex: 1 }}>
        <TableSkeleton lines={12} />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerTraceTooLargeView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerTraceTooLargeView.tsx

```typescript
import { Button, Empty, Typography, useDesignSystemTheme, WarningIcon } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { CodeSnippetRenderMode } from './ModelTrace.types';
import { ModelTraceExplorerCodeSnippetBody } from './ModelTraceExplorerCodeSnippetBody';

const getExampleCode = (traceId: string) =>
  JSON.stringify(`import mlflow

# returns an MLflow Trace object
trace = mlflow.get_trace('${traceId}')

# trace.info contains tags and metadata
trace_info = trace.info

# the trace's spans are stored in trace.data
spans = trace.data.spans`);

export const ModelTraceExplorerTraceTooLargeView = ({
  traceId,
  setForceDisplay,
}: {
  traceId: string;
  setForceDisplay: (forceDisplay: boolean) => void;
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Empty
      image={<WarningIcon />}
      title={
        <FormattedMessage
          defaultMessage="Large trace"
          description="Modal title for when a trace is very large. The modal warns the user that the trace may cause UI slowness, but allows them to attempt to display it anyway by clicking a button."
        />
      }
      description={
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, alignItems: 'center' }}>
          <FormattedMessage
            defaultMessage="This trace is very large, and may cause UI slowness when attempting to render. You can click the button below to attempt to display it anyway."
            description="Body text explaining issues with rendering large traces."
          />
          <Button
            componentId="shared.model-trace-explorer.trace-too-large.force-display-button"
            css={{ width: 'min-content' }}
            onClick={() => setForceDisplay(true)}
          >
            <FormattedMessage
              defaultMessage="Attempt to display"
              description="Button label for forcing the display of a large trace"
            />
          </Button>
          <span>
            <FormattedMessage
              defaultMessage="Alternatively, you can interact with this trace via the MLflow Python SDK, using the {code} function. For more information, please check the {documentation_link}."
              description="Body text for when a trace is too large to display"
              values={{
                code: <Typography.Text code>mlflow.get_trace()</Typography.Text>,
                documentation_link: (
                  <Typography.Link
                    href="https://mlflow.org/docs/latest/api_reference/python_api/mlflow.entities.html#mlflow.entities.Trace"
                    target="_blank"
                    openInNewTab
                    componentId="shared.model-trace-explorer.trace-too-large.documentation-link"
                  >
                    <FormattedMessage
                      defaultMessage="MLflow API documentation"
                      description="Link to the MLflow API documentation for the Trace object"
                    />
                  </Typography.Link>
                ),
              }}
            />
          </span>
          <ModelTraceExplorerCodeSnippetBody
            data={getExampleCode(traceId)}
            renderMode={CodeSnippetRenderMode.PYTHON}
            initialExpanded
          />
        </div>
      }
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerViewStateContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerViewStateContext.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { ModelTrace, ModelTraceExplorerTab, ModelTraceSpanNode } from './ModelTrace.types';
import {
  getDefaultActiveTab,
  parseModelTraceToTreeWithMultipleRoots,
  searchTreeBySpanId,
} from './ModelTraceExplorer.utils';
import { getTimelineTreeNodesMap } from './timeline-tree/TimelineTree.utils';

export type ModelTraceExplorerViewState = {
  rootNode: ModelTraceSpanNode | null;
  nodeMap: Record<string, ModelTraceSpanNode>;
  activeView: 'summary' | 'detail';
  setActiveView: (view: 'summary' | 'detail') => void;
  selectedNode: ModelTraceSpanNode | undefined;
  setSelectedNode: (node: ModelTraceSpanNode | undefined) => void;
  activeTab: ModelTraceExplorerTab;
  setActiveTab: (tab: ModelTraceExplorerTab) => void;
  showTimelineTreeGantt: boolean;
  setShowTimelineTreeGantt: (show: boolean) => void;
  assessmentsPaneExpanded: boolean;
  setAssessmentsPaneExpanded: (expanded: boolean) => void;
  isTraceInitialLoading?: boolean;
  assessmentsPaneEnabled: boolean;
  isInComparisonView: boolean;
  // NB: There can be multiple top-level spans in the trace when it is in-progress. They are not
  // root spans, but used as a tentative roots until the trace is complete.
  topLevelNodes: ModelTraceSpanNode[];
};

export const ModelTraceExplorerViewStateContext = createContext<ModelTraceExplorerViewState>({
  rootNode: null,
  nodeMap: {},
  activeView: 'summary',
  setActiveView: () => {},
  selectedNode: undefined,
  setSelectedNode: () => {},
  activeTab: 'content',
  setActiveTab: () => {},
  showTimelineTreeGantt: false,
  setShowTimelineTreeGantt: () => {},
  assessmentsPaneExpanded: false,
  setAssessmentsPaneExpanded: () => {},
  isTraceInitialLoading: false,
  assessmentsPaneEnabled: true,
  isInComparisonView: false,
  topLevelNodes: [],
});

export const useModelTraceExplorerViewState = () => {
  return useContext(ModelTraceExplorerViewStateContext);
};

export const ModelTraceExplorerViewStateProvider = ({
  modelTrace,
  initialActiveView,
  selectedSpanIdOnRender,
  // assessments pane is disabled if
  // the trace doesn't exist in the backend
  // (i.e. if the traceinfo fetch fails)
  assessmentsPaneEnabled,
  initialAssessmentsPaneCollapsed,
  isTraceInitialLoading = false,
  isInComparisonView = false,
  children,
}: {
  modelTrace: ModelTrace;
  initialActiveView?: 'summary' | 'detail';
  selectedSpanIdOnRender?: string;
  children: React.ReactNode;
  assessmentsPaneEnabled: boolean;
  initialAssessmentsPaneCollapsed?: boolean | 'force-open';
  isTraceInitialLoading?: boolean;
  isInComparisonView?: boolean;
}) => {
  const topLevelNodes = useMemo(() => parseModelTraceToTreeWithMultipleRoots(modelTrace), [modelTrace]);
  const rootNode = topLevelNodes.length === 1 ? topLevelNodes[0] : null;

  const nodeMap = useMemo(() => (rootNode ? getTimelineTreeNodesMap([rootNode]) : {}), [rootNode]);
  const selectedSpanOnRender = searchTreeBySpanId(rootNode, selectedSpanIdOnRender);
  const defaultSelectedNode = selectedSpanOnRender ?? rootNode ?? undefined;
  const hasAssessments = (defaultSelectedNode?.assessments?.length ?? 0) > 0;
  const hasInputsOrOutputs = !isNil(rootNode?.inputs) || !isNil(rootNode?.outputs);

  // Default to 'detail' view when there's no root node (e.g., trace is in-progress)
  const [activeView, setActiveView] = useState<'summary' | 'detail'>(
    initialActiveView ?? (rootNode && hasInputsOrOutputs ? 'summary' : 'detail'),
  );
  const [selectedNode, setSelectedNode] = useState<ModelTraceSpanNode | undefined>(defaultSelectedNode);
  const defaultActiveTab = getDefaultActiveTab(selectedNode);
  const [activeTab, setActiveTab] = useState<ModelTraceExplorerTab>(defaultActiveTab);
  const [showTimelineTreeGantt, setShowTimelineTreeGantt] = useState(false);
  const [assessmentsPaneExpanded, setAssessmentsPaneExpanded] = useState(
    (!initialAssessmentsPaneCollapsed && hasAssessments) || initialAssessmentsPaneCollapsed === 'force-open',
  );

  useEffect(() => {
    const defaultActiveTab = getDefaultActiveTab(selectedNode);
    setActiveTab(defaultActiveTab);
  }, [selectedNode]);

  const value = useMemo(
    () => ({
      rootNode,
      nodeMap,
      activeView,
      setActiveView,
      activeTab,
      setActiveTab,
      selectedNode,
      setSelectedNode,
      showTimelineTreeGantt,
      setShowTimelineTreeGantt,
      assessmentsPaneExpanded,
      setAssessmentsPaneExpanded,
      assessmentsPaneEnabled,
      isTraceInitialLoading,
      isInComparisonView,
      topLevelNodes,
    }),
    [
      activeView,
      nodeMap,
      activeTab,
      rootNode,
      selectedNode,
      showTimelineTreeGantt,
      setShowTimelineTreeGantt,
      assessmentsPaneExpanded,
      setAssessmentsPaneExpanded,
      assessmentsPaneEnabled,
      isTraceInitialLoading,
      isInComparisonView,
      topLevelNodes,
    ],
  );

  return (
    <ModelTraceExplorerViewStateContext.Provider value={value}>{children}</ModelTraceExplorerViewStateContext.Provider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceHeaderDetails.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceHeaderDetails.tsx
Signals: React

```typescript
import { useCallback, useMemo, useState } from 'react';

import {
  Overflow,
  Tag,
  Typography,
  useDesignSystemTheme,
  Tooltip,
  ClockIcon,
  Notification,
  UserIcon,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { type ModelTrace, type ModelTraceInfoV3, type ModelTraceState } from './ModelTrace.types';
import { createTraceV4LongIdentifier, doesTraceSupportV4API, isV3ModelTraceInfo } from './ModelTraceExplorer.utils';
import { ModelTraceHeaderMetricSection } from './ModelTraceExplorerMetricSection';
import { useModelTraceExplorerViewState } from './ModelTraceExplorerViewStateContext';
import { ModelTraceHeaderMetadataPill } from './ModelTraceHeaderMetadataPill';
import { ModelTraceHeaderSessionIdTag } from './ModelTraceHeaderSessionIdTag';
import { ModelTraceHeaderStatusTag } from './ModelTraceHeaderStatusTag';
import { useParams } from './RoutingUtils';
import { isUserFacingTag, parseJSONSafe, truncateToFirstLineWithMaxLength } from './TagUtils';
import { SESSION_ID_METADATA_KEY, MLFLOW_TRACE_USER_KEY, TOKEN_USAGE_METADATA_KEY } from './constants';
import { spanTimeFormatter } from './timeline-tree/TimelineTree.utils';

const BASE_NOTIFICATION_COMPONENT_ID = 'mlflow.model_trace_explorer.header_details.notification';

export const ModelTraceHeaderDetails = ({ modelTraceInfo }: { modelTraceInfo: ModelTrace['info'] }) => {
  const { theme } = useDesignSystemTheme();
  const [showNotification, setShowNotification] = useState(false);
  const { rootNode } = useModelTraceExplorerViewState();
  const { experimentId } = useParams();
  const tags = Object.entries(modelTraceInfo.tags ?? {}).filter(([key]) => isUserFacingTag(key));

  const [modelTraceId, modelTraceIdToDisplay] = useMemo(() => {
    if (doesTraceSupportV4API(modelTraceInfo) && isV3ModelTraceInfo(modelTraceInfo)) {
      return [createTraceV4LongIdentifier(modelTraceInfo), modelTraceInfo.trace_id];
    }
    return [isV3ModelTraceInfo(modelTraceInfo) ? modelTraceInfo.trace_id : modelTraceInfo.request_id ?? ''];
  }, [modelTraceInfo]);

  const tokenUsage = useMemo(() => {
    const tokenUsage = parseJSONSafe(
      (modelTraceInfo as ModelTraceInfoV3)?.trace_metadata?.[TOKEN_USAGE_METADATA_KEY] ?? '{}',
    );
    return tokenUsage;
  }, [modelTraceInfo]);

  const totalTokens = useMemo(() => tokenUsage?.total_tokens, [tokenUsage]);

  const sessionId = useMemo(() => {
    return (modelTraceInfo as ModelTraceInfoV3)?.trace_metadata?.[SESSION_ID_METADATA_KEY];
  }, [modelTraceInfo]);

  const userId = useMemo(() => {
    return (modelTraceInfo as ModelTraceInfoV3)?.trace_metadata?.[MLFLOW_TRACE_USER_KEY];
  }, [modelTraceInfo]);

  // Derive status label/icon from TraceInfo (V3 only)
  const statusState: ModelTraceState | undefined = useMemo(
    () => (isV3ModelTraceInfo(modelTraceInfo) ? modelTraceInfo.state : undefined),
    [modelTraceInfo],
  );

  const latency = useMemo((): string | undefined => {
    if (rootNode) {
      return spanTimeFormatter(rootNode.end - rootNode.start);
    }

    return undefined;
  }, [rootNode]);

  const handleTagClick = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTruncatedLabel = (label: string) => truncateToFirstLineWithMaxLength(label, 40);

  const handleCopy = useCallback(() => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  }, []);

  return (
    <div css={{ paddingLeft: theme.spacing.md, paddingBottom: theme.spacing.sm }}>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.md,
          rowGap: theme.spacing.sm,
          flexWrap: 'wrap',
        }}
      >
        {statusState && <ModelTraceHeaderStatusTag statusState={statusState} getTruncatedLabel={getTruncatedLabel} />}
        {modelTraceId && (
          <ModelTraceHeaderMetricSection
            label={<FormattedMessage defaultMessage="ID" description="Label for the ID section" />}
            value={modelTraceId}
            displayValue={modelTraceIdToDisplay}
            color="purple"
            getTruncatedLabel={getTruncatedLabel}
            onCopy={handleCopy}
          />
        )}
        {totalTokens && (
          <ModelTraceHeaderMetricSection
            label={<FormattedMessage defaultMessage="Token count" description="Label for the token count section" />}
            value={totalTokens.toString()}
            getTruncatedLabel={getTruncatedLabel}
            onCopy={handleCopy}
          />
        )}
        {latency && (
          <ModelTraceHeaderMetricSection
            label={<FormattedMessage defaultMessage="Latency" description="Label for the latency section" />}
            icon={<ClockIcon css={{ fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />}
            value={latency}
            getTruncatedLabel={getTruncatedLabel}
            onCopy={handleCopy}
          />
        )}
        {sessionId && experimentId && (
          <ModelTraceHeaderSessionIdTag
            handleCopy={handleCopy}
            experimentId={experimentId}
            sessionId={sessionId}
            traceId={modelTraceId}
          />
        )}
        {userId && (
          <ModelTraceHeaderMetricSection
            label={<FormattedMessage defaultMessage="User" description="Label for the user id section" />}
            icon={<UserIcon css={{ fontSize: 12, display: 'flex' }} />}
            value={userId}
            color="default"
            getTruncatedLabel={getTruncatedLabel}
            onCopy={handleCopy}
          />
        )}
        <ModelTraceHeaderMetadataPill
          traceMetadata={(modelTraceInfo as ModelTraceInfoV3)?.trace_metadata}
          getTruncatedLabel={getTruncatedLabel}
        />
        {tags.length > 0 && (
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: theme.spacing.sm,
            }}
          >
            <Typography.Text size="md" color="secondary">
              <FormattedMessage defaultMessage="Tags" description="Label for the tags section" />
            </Typography.Text>
            <Overflow noMargin>
              {tags.map(([key, value]) => {
                const fullText = `${key}: ${value}`;

                return (
                  <Tooltip
                    key={key}
                    componentId="shared.model-trace-explorer.header-details.tooltip"
                    content={fullText}
                  >
                    <Tag
                      componentId="shared.model-trace-explorer.header-details.tag"
                      onClick={() => {
                        handleTagClick(fullText);
                        handleCopy();
                      }}
                      css={{ cursor: 'pointer' }}
                    >
                      {getTruncatedLabel(`${key}: ${value}`)}
                    </Tag>
                  </Tooltip>
                );
              })}
            </Overflow>
          </div>
        )}
      </div>
      {showNotification && (
        <Notification.Provider>
          <Notification.Root severity="success" componentId={BASE_NOTIFICATION_COMPONENT_ID}>
            <Notification.Title>
              <FormattedMessage
                defaultMessage="Copied to clipboard"
                description="Success message for the notification"
              />
            </Notification.Title>
          </Notification.Root>
          <Notification.Viewport />
        </Notification.Provider>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceHeaderMetadataPill.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceHeaderMetadataPill.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import { HoverCard, ListIcon, Overflow, Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { MLFLOW_INTERNAL_PREFIX, parseJSONSafe, truncateToFirstLineWithMaxLength } from './TagUtils';

export const ModelTraceHeaderMetadataPill = ({
  traceMetadata,
  getTruncatedLabel = (label: string) => truncateToFirstLineWithMaxLength(label, 40),
}: {
  traceMetadata?: Record<string, unknown>;
  getTruncatedLabel?: (label: string) => string;
}) => {
  const { theme } = useDesignSystemTheme();

  const MAX_ITEMS = 100;

  const formatTraceMetadataValue = (value: unknown): string => {
    // If it's already an object/array, try to stringify directly
    if (value && typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value as any);
      }
    }
    // If it's a string, try to parse JSON and pretty return
    if (typeof value === 'string') {
      const parsed = parseJSONSafe(value);
      if (parsed && typeof parsed === 'object') {
        try {
          return JSON.stringify(parsed);
        } catch {
          return value;
        }
      }
      return value;
    }
    return String(value ?? '');
  };

  const metadataItems = useMemo(() => {
    const items = Object.entries(traceMetadata || {})
      .filter(([k, v]) => v !== null && v !== '' && !k.startsWith(MLFLOW_INTERNAL_PREFIX))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({ key, value, displayValue: formatTraceMetadataValue(value) }));
    return items;
  }, [traceMetadata]);

  if (metadataItems.length === 0) {
    return null;
  }

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
      }}
    >
      <Typography.Text size="md" color="secondary">
        <FormattedMessage defaultMessage="Metadata" description="Label for the metadata section" />
      </Typography.Text>
      <Overflow noMargin>
        <HoverCard
          trigger={
            <Tag
              componentId="shared.model-trace-explorer.header-metadata-pill"
              color="default"
              css={{ cursor: 'default', width: 'fit-content', maxWidth: '100%' }}
            >
              <span css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                <ListIcon css={{ fontSize: 12, color: theme.colors.textSecondary }} />
                <span>{metadataItems.length}</span>
              </span>
            </Tag>
          }
          content={
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.xs,
                maxWidth: 480,
                maxHeight: 320,
                overflowY: 'auto',
              }}
            >
              {metadataItems.slice(0, MAX_ITEMS).map(({ key, displayValue, value }) => (
                <div
                  key={`${key}:${value}`}
                  css={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs }}
                >
                  <Typography.Text css={{ flexBasis: '45%', flexShrink: 0 }}>{getTruncatedLabel(key)}</Typography.Text>
                  <Typography.Text color="secondary" css={{ wordBreak: 'break-word' }}>
                    {displayValue}
                  </Typography.Text>
                </div>
              ))}
              {metadataItems.length > MAX_ITEMS && (
                <Typography.Text color="secondary">+{metadataItems.length - MAX_ITEMS} more</Typography.Text>
              )}
            </div>
          }
        />
      </Overflow>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
