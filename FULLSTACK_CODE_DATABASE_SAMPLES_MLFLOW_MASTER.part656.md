---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 656
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 656 of 991)

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

---[FILE: ModelTraceExplorerRetrieverSpanView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerRetrieverSpanView.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useMemo, useState } from 'react';

import { Tag, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerRetrieverDocument } from './ModelTraceExplorerRetrieverDocument';
import type { ModelTraceSpanNode, RetrieverDocument, SearchMatch } from '../ModelTrace.types';
import { createListFromObject } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerCodeSnippet } from '../ModelTraceExplorerCodeSnippet';
import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';
import { ModelTraceExplorerRenderModeToggle } from '../ModelTraceExplorerRenderModeToggle';

export function ModelTraceExplorerRetrieverSpanView({
  activeSpan,
  className,
  searchFilter,
  activeMatch,
}: {
  activeSpan: ModelTraceSpanNode;
  className?: string;
  searchFilter: string;
  activeMatch: SearchMatch | null;
}) {
  const { theme } = useDesignSystemTheme();
  const [shouldRenderMarkdown, setShouldRenderMarkdown] = useState(true);
  const inputList = useMemo(() => createListFromObject(activeSpan.inputs), [activeSpan]);

  const outputs = activeSpan.outputs as RetrieverDocument[];

  const containsInputs = inputList.length > 0;

  // search highlighting is not supported in markdown rendering, so
  // if there is an active match in the documents, we have to render
  // them as code snippets.
  const isActiveMatchSpan = !isNil(activeMatch) && activeMatch.span.key === activeSpan.key;
  const outputsContainsActiveMatch = isActiveMatchSpan && activeMatch.section === 'outputs';

  return (
    <div className={className} data-testid="model-trace-explorer-retriever-span-view">
      {containsInputs && (
        <ModelTraceExplorerCollapsibleSection
          sectionKey="input"
          css={{ marginBottom: theme.spacing.sm }}
          title={
            <FormattedMessage
              defaultMessage="Inputs"
              description="Model trace explorer > selected span > inputs header"
            />
          }
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {inputList.map(({ key, value }, index) => (
              <ModelTraceExplorerCodeSnippet
                key={key || index}
                title={key}
                data={value}
                searchFilter={searchFilter}
                activeMatch={activeMatch}
                containsActiveMatch={isActiveMatchSpan && activeMatch.section === 'inputs' && activeMatch.key === key}
              />
            ))}
          </div>
        </ModelTraceExplorerCollapsibleSection>
      )}

      <ModelTraceExplorerCollapsibleSection
        sectionKey="output"
        title={
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div css={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.sm }}>
              <FormattedMessage
                defaultMessage="Documents"
                description="Model trace explorer > retriever span > documents header"
              />
              <Tag componentId="shared.model-trace-explorer.document-count">{outputs.length}</Tag>
            </div>
            {!outputsContainsActiveMatch && (
              <ModelTraceExplorerRenderModeToggle
                shouldRenderMarkdown={shouldRenderMarkdown}
                setShouldRenderMarkdown={setShouldRenderMarkdown}
              />
            )}
          </div>
        }
      >
        {shouldRenderMarkdown && !outputsContainsActiveMatch ? (
          <div
            css={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.legacyBorders.borderRadiusMd,
            }}
          >
            {outputs.map((document, idx) => (
              <div
                key={idx}
                css={{ borderBottom: idx !== outputs.length - 1 ? `1px solid ${theme.colors.border}` : '' }}
              >
                <ModelTraceExplorerRetrieverDocument
                  key={idx}
                  text={document.page_content}
                  metadata={document.metadata}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            css={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.legacyBorders.borderRadiusMd,
              padding: theme.spacing.md,
            }}
          >
            <ModelTraceExplorerCodeSnippet
              title=""
              data={JSON.stringify(outputs, null, 2)}
              searchFilter={searchFilter}
              activeMatch={activeMatch}
              containsActiveMatch={isActiveMatchSpan && activeMatch.section === 'outputs'}
            />
          </div>
        )}
      </ModelTraceExplorerCollapsibleSection>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRightPane.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerRightPane.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';

import { ModelTraceExplorerChatTab } from './ModelTraceExplorerChatTab';
import { ModelTraceExplorerContentTab } from './ModelTraceExplorerContentTab';
import type { ModelTraceSpan } from '../ModelTrace.types';
import {
  mockSpans,
  MOCK_RETRIEVER_SPAN,
  MOCK_CHAT_SPAN,
  MOCK_CHAT_MESSAGES,
  MOCK_CHAT_TOOLS,
} from '../ModelTraceExplorer.test-utils';

const DEFAULT_SPAN: ModelTraceSpan = mockSpans[0];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en">
    <DesignSystemProvider>{children}</DesignSystemProvider>
  </IntlProvider>
);

describe('ModelTraceExplorerRightPane', () => {
  it('switches between span renderers appropriately', () => {
    const { rerender } = render(
      <ModelTraceExplorerContentTab
        activeSpan={{
          ...DEFAULT_SPAN,
          start: DEFAULT_SPAN.start_time,
          end: DEFAULT_SPAN.end_time,
          key: DEFAULT_SPAN.context.span_id,
          assessments: [],
          traceId: DEFAULT_SPAN.context.trace_id,
        }}
        searchFilter=""
        activeMatch={null}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.queryByTestId('model-trace-explorer-default-span-view')).toBeInTheDocument();

    rerender(<ModelTraceExplorerContentTab activeSpan={MOCK_RETRIEVER_SPAN} searchFilter="" activeMatch={null} />);

    expect(screen.queryByTestId('model-trace-explorer-retriever-span-view')).toBeInTheDocument();
  });

  it('should render conversations if possible', async () => {
    render(<ModelTraceExplorerChatTab chatMessages={MOCK_CHAT_MESSAGES} chatTools={MOCK_CHAT_TOOLS} />, {
      wrapper: Wrapper,
    });

    // check that the user text renders
    expect(screen.queryByText('User')).toBeInTheDocument();
    expect(screen.queryByText('tell me a joke in 50 words')).toBeInTheDocument();

    // check that the tool calls render
    expect(screen.queryByText('Assistant')).toBeInTheDocument();
    expect(screen.queryAllByText('tell_joke')).toHaveLength(2); // one in input, one in tool definition

    // check that the tool result render
    expect(screen.queryByText('Tool')).toBeInTheDocument();
    expect(
      screen.queryByText('Why did the scarecrow win an award? Because he was outstanding in his field!'),
    ).toBeInTheDocument();

    // check that the tool definition render
    expect(screen.queryAllByTestId('model-trace-explorer-chat-tool')).toHaveLength(1);
    expect(screen.queryByText('Tells a joke')).not.toBeInTheDocument();
    // Expand tool definition detail
    const toolDefinitionToggle = screen.queryAllByTestId('model-trace-explorer-chat-tool-toggle')[0];
    await userEvent.click(toolDefinitionToggle);
    expect(screen.queryByText('Tells a joke')).toBeInTheDocument();
  });

  it('shows raw input and output of spans', async () => {
    render(<ModelTraceExplorerContentTab activeSpan={MOCK_CHAT_SPAN} searchFilter="" activeMatch={null} />, {
      wrapper: Wrapper,
    });

    expect(screen.queryByText('Inputs')).toBeInTheDocument();
    expect(screen.queryByText('Outputs')).toBeInTheDocument();
    expect(screen.queryByText('generations')).toBeInTheDocument();
    expect(screen.queryByText('llm_output')).toBeInTheDocument();
    expect(screen.queryAllByText('See more')).toHaveLength(3);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRightPaneTabs.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerRightPaneTabs.tsx
Signals: React

```typescript
import type { Interpolation, Theme } from '@emotion/react';
import { isNil } from 'lodash';
import React, { useState } from 'react';

import { Empty, Tabs, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerAttributesTab } from './ModelTraceExplorerAttributesTab';
import { ModelTraceExplorerChatTab } from './ModelTraceExplorerChatTab';
import { ModelTraceExplorerContentTab } from './ModelTraceExplorerContentTab';
import { ModelTraceExplorerEventsTab } from './ModelTraceExplorerEventsTab';
import type { ModelTraceExplorerTab, ModelTraceSpanNode, SearchMatch } from '../ModelTrace.types';
import { getSpanExceptionCount } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerBadge } from '../ModelTraceExplorerBadge';
import ModelTraceExplorerResizablePane from '../ModelTraceExplorerResizablePane';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';
import { AssessmentPaneToggle } from '../assessments-pane/AssessmentPaneToggle';
import { AssessmentsPane } from '../assessments-pane/AssessmentsPane';
import { ASSESSMENT_PANE_MIN_WIDTH } from '../assessments-pane/AssessmentsPane.utils';

export const CONTENT_PANE_MIN_WIDTH = 250;
// used by the parent component to set min-width on the resizable box
export const RIGHT_PANE_MIN_WIDTH = CONTENT_PANE_MIN_WIDTH + ASSESSMENT_PANE_MIN_WIDTH;
const DEFAULT_SPLIT_RATIO = 0.7;

function ModelTraceExplorerRightPaneTabsImpl({
  activeSpan,
  searchFilter,
  activeMatch,
  activeTab,
  setActiveTab,
}: {
  activeSpan: ModelTraceSpanNode | undefined;
  searchFilter: string;
  activeMatch: SearchMatch | null;
  activeTab: ModelTraceExplorerTab;
  setActiveTab: (tab: ModelTraceExplorerTab) => void;
}) {
  const { theme } = useDesignSystemTheme();
  const [paneWidth, setPaneWidth] = useState(500);
  const contentStyle: Interpolation<Theme> = { flex: 1, marginTop: -theme.spacing.md, overflowY: 'auto' };
  const { assessmentsPaneExpanded, assessmentsPaneEnabled, isInComparisonView } = useModelTraceExplorerViewState();
  if (isNil(activeSpan)) {
    return <Empty description="Please select a span to view more information" />;
  }

  const exceptionCount = getSpanExceptionCount(activeSpan);
  const hasException = exceptionCount > 0;
  const hasInputsOrOutputs = !isNil(activeSpan?.inputs) || !isNil(activeSpan?.outputs);

  const tabContent = (
    <Tabs.Root
      componentId="shared.model-trace-explorer.right-pane-tabs"
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderLeft: `1px solid ${theme.colors.border}`,
        minWidth: 200,
        position: 'relative',
      }}
      value={activeTab}
      onValueChange={(tab: string) => setActiveTab(tab as ModelTraceExplorerTab)}
    >
      <div
        css={{
          position: 'absolute',
          right: assessmentsPaneExpanded ? theme.spacing.xs : theme.spacing.md,
          top: theme.spacing.xs,
        }}
      >
        <AssessmentPaneToggle />
      </div>
      <Tabs.List
        css={{
          padding: 0,
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.sm,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {activeSpan.chatMessages && (
          <Tabs.Trigger value="chat">
            <FormattedMessage defaultMessage="Chat" description="Label for the chat tab of the model trace explorer." />
          </Tabs.Trigger>
        )}
        {hasInputsOrOutputs && (
          <Tabs.Trigger value="content">
            <FormattedMessage
              defaultMessage="Inputs / Outputs"
              description="Label for the inputs and outputs tab of the model trace explorer."
            />
          </Tabs.Trigger>
        )}
        {/* no i18n for attributes and events as these are properties specified by code,
            and it might be confusing for users to have different labels here */}
        <Tabs.Trigger value="attributes">Attributes</Tabs.Trigger>
        <Tabs.Trigger value="events">
          Events {hasException && <ModelTraceExplorerBadge count={exceptionCount} />}
        </Tabs.Trigger>
      </Tabs.List>
      {activeSpan.chatMessages && (
        <Tabs.Content css={contentStyle} value="chat">
          <ModelTraceExplorerChatTab chatMessages={activeSpan.chatMessages} chatTools={activeSpan.chatTools} />
        </Tabs.Content>
      )}
      <Tabs.Content css={contentStyle} value="content">
        <ModelTraceExplorerContentTab activeSpan={activeSpan} searchFilter={searchFilter} activeMatch={activeMatch} />
      </Tabs.Content>
      <Tabs.Content css={contentStyle} value="attributes">
        <ModelTraceExplorerAttributesTab
          activeSpan={activeSpan}
          searchFilter={searchFilter}
          activeMatch={activeMatch}
        />
      </Tabs.Content>
      <Tabs.Content css={contentStyle} value="events">
        <ModelTraceExplorerEventsTab activeSpan={activeSpan} searchFilter={searchFilter} activeMatch={activeMatch} />
      </Tabs.Content>
    </Tabs.Root>
  );
  const AssessmentsPaneComponent = (
    <AssessmentsPane
      assessments={activeSpan.assessments}
      traceId={activeSpan.traceId}
      activeSpanId={activeSpan.parentId ? String(activeSpan.key) : undefined}
    />
  );

  return !isInComparisonView && assessmentsPaneEnabled && assessmentsPaneExpanded ? (
    <ModelTraceExplorerResizablePane
      initialRatio={DEFAULT_SPLIT_RATIO}
      paneWidth={paneWidth}
      setPaneWidth={setPaneWidth}
      leftChild={tabContent}
      leftMinWidth={CONTENT_PANE_MIN_WIDTH}
      rightChild={AssessmentsPaneComponent}
      rightMinWidth={ASSESSMENT_PANE_MIN_WIDTH}
    />
  ) : (
    tabContent
  );
}

export const ModelTraceExplorerRightPaneTabs = React.memo(ModelTraceExplorerRightPaneTabsImpl);
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerToolCallMessage.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerToolCallMessage.tsx

```typescript
import { FunctionIcon, Tag, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { ModelTraceToolCall } from '../ModelTrace.types';
import { ModelTraceExplorerCodeSnippetBody } from '../ModelTraceExplorerCodeSnippetBody';

export function ModelTraceExplorerToolCallMessage({ toolCall }: { toolCall: ModelTraceToolCall }) {
  const { theme } = useDesignSystemTheme();

  return (
    <div key={toolCall.id} css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      <Typography.Text
        color="secondary"
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: `0px ${theme.spacing.sm + theme.spacing.xs}px`,
        }}
      >
        <FormattedMessage
          defaultMessage="called {functionName} in {toolCallId}"
          description="A message that shows the tool calls that an AI assistant made. The full message reads (for example): 'Assistant called get_weather in id_123'."
          values={{
            functionName: (
              <Tag
                color="purple"
                componentId="shared.model-trace-explorer.function-name-tag"
                css={{ margin: `0px ${theme.spacing.xs}px` }}
              >
                <FunctionIcon />
                <Typography.Text css={{ whiteSpace: 'nowrap', marginLeft: theme.spacing.xs }}>
                  {toolCall.function.name}
                </Typography.Text>
              </Tag>
            ),
            toolCallId: (
              <Tooltip componentId="shared.model-trace-explorer.tool-call-id-tooltip" content={toolCall.id}>
                <div css={{ display: 'inline-flex', flexShrink: 1, overflow: 'hidden', marginLeft: theme.spacing.xs }}>
                  <Typography.Text
                    css={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                    code
                    color="secondary"
                  >
                    {toolCall.id}
                  </Typography.Text>
                </div>
              </Tooltip>
            ),
          }}
        />
      </Typography.Text>
      <ModelTraceExplorerCodeSnippetBody data={toolCall.function.arguments} />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: SimplifiedAssessmentView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/SimplifiedAssessmentView.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';

import { SimplifiedAssessmentView } from './SimplifiedAssessmentView';
import type { Assessment } from '../ModelTrace.types';
import {
  MOCK_ASSESSMENT,
  MOCK_EXPECTATION,
  MOCK_ROOT_ASSESSMENT,
  MOCK_SPAN_ASSESSMENT,
} from '../ModelTraceExplorer.test-utils';

const MOCK_ASSESSMENT_WITH_ERROR: Assessment = {
  assessment_id: 'a-test-error',
  assessment_name: 'Failed Assessment',
  trace_id: 'tr-test-v3',
  span_id: '',
  source: {
    source_type: 'LLM_JUDGE',
    source_id: '1',
  },
  create_time: '2025-04-19T09:04:07.875Z',
  last_update_time: '2025-04-19T09:04:07.875Z',
  feedback: {
    error: {
      error_code: 'EVALUATION_ERROR',
      error_message: 'Failed to evaluate assessment',
      stack_trace: 'Error stack trace here',
    },
  },
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en">
    <DesignSystemProvider>{children}</DesignSystemProvider>
  </IntlProvider>
);

describe('SimplifiedAssessmentView', () => {
  it('renders "No assessments available" message when assessments array is empty', () => {
    render(<SimplifiedAssessmentView assessments={[]} />, { wrapper: Wrapper });

    expect(screen.getByText('No assessments available')).toBeInTheDocument();
  });

  it('filters to show only valid feedback assessments', () => {
    const assessments: Assessment[] = [
      MOCK_ASSESSMENT, // valid feedback assessment
      MOCK_EXPECTATION, // expectation assessment - should be filtered out
      MOCK_SPAN_ASSESSMENT, // valid feedback assessment
    ];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Should show feedback assessments
    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('Thumbs')).toBeInTheDocument();

    // Should NOT show expectation assessment
    expect(screen.queryByText('expected_facts')).not.toBeInTheDocument();
  });

  it('filters out invalid assessments (valid: false)', () => {
    const assessments: Assessment[] = [
      MOCK_ASSESSMENT, // valid assessment
      MOCK_ROOT_ASSESSMENT, // invalid assessment (valid: false)
    ];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Should show only the valid assessment
    expect(screen.getByText('Relevance')).toBeInTheDocument();

    // Should have only one assessment card
    const assessmentCards = screen.queryAllByText(/Relevance|Thumbs/);
    expect(assessmentCards).toHaveLength(1);
  });

  it('renders an AssessmentCard for each valid feedback assessment', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT, MOCK_SPAN_ASSESSMENT];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Should render both assessment names
    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('Thumbs')).toBeInTheDocument();
  });

  it('displays assessment value', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // The value "5" should be displayed
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays rationale when present', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Check that rationale is rendered
    expect(screen.getByText('The thought process is sound and follows from the request')).toBeInTheDocument();
  });

  it('displays error using FeedbackErrorItem when feedback has error', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT_WITH_ERROR];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Check that assessment name is shown
    expect(screen.getByText('Failed Assessment')).toBeInTheDocument();

    // Check that error message is displayed
    expect(screen.getByText('Failed to evaluate assessment')).toBeInTheDocument();
  });

  it('does not show value when error is present', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT_WITH_ERROR];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Error message should be shown
    expect(screen.getByText('Failed to evaluate assessment')).toBeInTheDocument();

    // But no value should be displayed (there's no value in the mock anyway)
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('renders correct number of assessment cards', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT, MOCK_SPAN_ASSESSMENT, MOCK_ROOT_ASSESSMENT];

    render(<SimplifiedAssessmentView assessments={assessments} />, { wrapper: Wrapper });

    // Should render 2 cards (MOCK_ASSESSMENT and MOCK_SPAN_ASSESSMENT)
    // MOCK_ROOT_ASSESSMENT should be filtered out because valid: false
    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('Thumbs')).toBeInTheDocument();

    // Should have exactly 2 assessment names visible
    const relevanceElements = screen.getAllByText('Relevance');
    const thumbsElements = screen.getAllByText('Thumbs');
    expect(relevanceElements).toHaveLength(1);
    expect(thumbsElements).toHaveLength(1);
  });

  it('handles assessment without rationale', () => {
    const assessmentWithoutRationale: Assessment = {
      ...MOCK_ASSESSMENT,
      rationale: undefined,
    };

    render(<SimplifiedAssessmentView assessments={[assessmentWithoutRationale]} />, { wrapper: Wrapper });

    // Assessment should still render
    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // But rationale should not be present
    expect(screen.queryByText('The thought process is sound and follows from the request')).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SimplifiedAssessmentView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/SimplifiedAssessmentView.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useMemo } from 'react';

import { GavelIcon, Tag, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import type { Assessment, AssessmentError, AssessmentMetadata, FeedbackAssessment } from '../ModelTrace.types';
import { AssessmentDisplayValue } from '../assessments-pane/AssessmentDisplayValue';
import { FeedbackErrorItem } from '../assessments-pane/FeedbackErrorItem';
import { getAssessmentValue } from '../assessments-pane/utils';

export const SIMPLIFIED_ASSESSMENT_VIEW_MIN_WIDTH = 300;

const MetadataDisplay = ({ metadata }: { metadata?: AssessmentMetadata }) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const spanName = metadata?.span_name;

  if (!metadata || !spanName) {
    return null;
  }

  const spanLabel = intl.formatMessage(
    {
      defaultMessage: 'Span: {spanName}',
      description: 'Label for the span name in assessment metadata',
    },
    { spanName },
  );

  return (
    <div css={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.xs }}>
      <Tooltip componentId="shared.model-trace-explorer.span-name-tooltip" content={spanLabel}>
        <Tag
          css={{ display: 'inline-flex', maxWidth: '100%' }}
          componentId="shared.model-trace-explorer.span-name-tag"
          color="default"
        >
          <span
            css={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textWrap: 'nowrap',
            }}
          >
            {spanLabel}
          </span>
        </Tag>
      </Tooltip>
    </div>
  );
};

const AssessmentCard = ({ assessment }: { assessment: FeedbackAssessment }) => {
  const { theme } = useDesignSystemTheme();
  const value = getAssessmentValue(assessment);
  const rationale = assessment.rationale;
  const hasError = !isNil(assessment.feedback.error);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borders.borderRadiusMd,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
      }}
    >
      {/* Header with icon, title */}
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sm,
        }}
      >
        <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flex: 1, minWidth: 0 }}>
          <GavelIcon css={{ flexShrink: 0 }} />
          <Typography.Text bold css={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
            {assessment.assessment_name}
          </Typography.Text>
        </div>
      </div>

      {/* Error display */}
      {hasError && <FeedbackErrorItem error={assessment.feedback.error as AssessmentError} />}

      {/* Result value */}
      {!hasError && value !== undefined && (
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <AssessmentDisplayValue jsonValue={JSON.stringify(value)} assessmentName={assessment.assessment_name} />
        </div>
      )}

      {/* Metadata mini-cards (span name and document URI) */}
      <MetadataDisplay metadata={assessment.metadata as AssessmentMetadata | undefined} />

      {/* Rationale */}
      {rationale && (
        <Typography.Text css={{ color: theme.colors.textSecondary, lineHeight: theme.typography.lineHeightBase }}>
          {rationale}
        </Typography.Text>
      )}
    </div>
  );
};

export const SimplifiedAssessmentView = ({ assessments }: { assessments: Assessment[] }) => {
  const { theme } = useDesignSystemTheme();

  // We only show valid feedback assessments
  const feedbackAssessments: FeedbackAssessment[] = useMemo(
    () =>
      assessments.filter(
        (assessment) => 'feedback' in assessment && assessment.valid !== false,
      ) as FeedbackAssessment[],
    [assessments],
  );

  if (feedbackAssessments.length === 0) {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          padding: theme.spacing.md,
          minWidth: SIMPLIFIED_ASSESSMENT_VIEW_MIN_WIDTH,
          height: '100%',
          borderLeft: `1px solid ${theme.colors.border}`,
        }}
      >
        <Typography.Text color="secondary">
          <FormattedMessage
            defaultMessage="No assessments available"
            description="Message shown when there are no assessments to display in simplified view"
          />
        </Typography.Text>
      </div>
    );
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.md,
        minWidth: SIMPLIFIED_ASSESSMENT_VIEW_MIN_WIDTH,
        height: '100%',
        borderLeft: `1px solid ${theme.colors.border}`,
        overflowY: 'auto',
      }}
    >
      {feedbackAssessments.map((assessment) => (
        <AssessmentCard key={assessment.assessment_id} assessment={assessment} />
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: SingleChatTurnAssessments.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/session-view/SingleChatTurnAssessments.tsx

```typescript
import { isEmpty } from 'lodash';

import { Button, importantify, PlusIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { Assessment, ExpectationAssessment, ModelTrace } from '../ModelTrace.types';
import { isV3ModelTraceInfo } from '../ModelTraceExplorer.utils';
import { AssessmentDisplayValue } from '../assessments-pane/AssessmentDisplayValue';
import { getAssessmentValue } from '../assessments-pane/utils';

const isExpectationAssessment = (assessment: Assessment): assessment is ExpectationAssessment =>
  'expectation' in assessment;

export const SingleChatTurnAssessments = ({
  trace,
  getAssessmentTitle,
  onAddAssessmentsClick,
}: {
  trace: ModelTrace;
  getAssessmentTitle: (assessmentName: string) => string;
  onAddAssessmentsClick?: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const info = isV3ModelTraceInfo(trace.info) ? trace.info : null;

  if (!info?.assessments || isEmpty(info?.assessments)) {
    return (
      <div css={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          componentId="shared.model-trace-explorer.session-view.single-chart-turn-assessments.add-assessment"
          icon={<PlusIcon />}
          size="small"
          onClick={onAddAssessmentsClick}
          css={[{ marginTop: theme.spacing.sm }, importantify({ backgroundColor: theme.colors.backgroundPrimary })]}
        >
          <FormattedMessage
            defaultMessage="Evaluate trace"
            description="A call to action button to add assessments to a model trace in the single chat turn view"
          />
        </Button>
      </div>
    );
  }

  return (
    <div css={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
      {info?.assessments.map((assessment, index) => {
        const title = getAssessmentTitle(assessment.assessment_name);
        const value = getAssessmentValue(assessment)?.toString() ?? '';
        return (
          <div key={assessment.assessment_id}>
            {/* Expectations assessments are formatted differently than feedback assessments */}
            {isExpectationAssessment(assessment) ? (
              <AssessmentDisplayValue
                prefix={<>{title}: </>}
                jsonValue={value}
                css={{ maxWidth: 150 }}
                skipIcons
                overrideColor="default"
                assessmentName={assessment.assessment_name}
              />
            ) : (
              <>
                {title}:{' '}
                <AssessmentDisplayValue
                  jsonValue={value}
                  css={{ maxWidth: 150 }}
                  assessmentName={assessment.assessment_name}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: SingleChatTurnMessages.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/session-view/SingleChatTurnMessages.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { ModelTrace } from '../ModelTrace.types';
import { parseModelTraceToTree, createListFromObject } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerChatMessage } from '../right-pane/ModelTraceExplorerChatMessage';
import { ModelTraceExplorerSummarySection } from '../summary-view/ModelTraceExplorerSummarySection';

export const SingleChatTurnMessages = ({ trace }: { trace: ModelTrace }) => {
  const { theme } = useDesignSystemTheme();

  const rootSpan = useMemo(() => (trace.data?.spans ? parseModelTraceToTree(trace) : null), [trace]);

  if (!rootSpan) {
    return null;
  }

  // if they exist, slice from the last user message
  const chatMessages = rootSpan.chatMessages;
  const displayedMessages =
    chatMessages?.slice(chatMessages?.findLastIndex((message) => message.role === 'user')) ?? [];

  if (displayedMessages.length !== 0) {
    return (
      <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {displayedMessages?.map((message, index) => (
          <ModelTraceExplorerChatMessage
            key={index}
            message={message}
            css={{
              maxWidth: '80%',
              alignSelf: message.role === 'user' ? 'flex-start' : 'flex-end',
              borderWidth: 2,
              borderRadius: theme.borders.borderRadiusMd,
            }}
          />
        ))}
      </div>
    );
  }

  // reverse to show the first param before the cutoff
  const inputList = createListFromObject(rootSpan.inputs)
    .filter((item) => item.value !== 'null')
    .reverse();
  const outputList = createListFromObject(rootSpan.outputs)
    .filter((item) => item.value !== 'null')
    .reverse();

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
          width: '80%',
          alignSelf: 'flex-start',
          borderRadius: theme.borders.borderRadiusMd,
          backgroundColor: theme.colors.backgroundPrimary,
        }}
      >
        <ModelTraceExplorerSummarySection
          title={
            <FormattedMessage
              defaultMessage="Inputs"
              description="Section title for the inputs of a single chat turn"
            />
          }
          data={inputList}
          renderMode="default"
          sectionKey="summary-inputs"
          maxVisibleItems={1}
          maxVisibleChatMessages={1}
        />
      </div>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
          width: '80%',
          alignSelf: 'flex-end',
          backgroundColor: theme.colors.backgroundPrimary,
        }}
      >
        <ModelTraceExplorerSummarySection
          title={
            <FormattedMessage
              defaultMessage="Outputs"
              description="Section title for the outputs of a single chat turn"
            />
          }
          data={outputList}
          renderMode="default"
          sectionKey="summary-outputs"
          maxVisibleItems={1}
          maxVisibleChatMessages={1}
        />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
