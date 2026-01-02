---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 655
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 655 of 991)

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

---[FILE: ModelTraceExplorerChatMessage.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerChatMessage.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useState } from 'react';

import { Button, ChevronDownIcon, ChevronUpIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { GenAIMarkdownRenderer } from '@databricks/web-shared/genai-markdown-renderer';

import { ModelTraceExplorerChatMessageHeader } from './ModelTraceExplorerChatMessageHeader';
import { CONTENT_TRUNCATION_LIMIT } from './ModelTraceExplorerChatRenderer.utils';
import { ModelTraceExplorerToolCallMessage } from './ModelTraceExplorerToolCallMessage';
import { CodeSnippetRenderMode, type ModelTraceChatMessage } from '../ModelTrace.types';
import { ModelTraceExplorerCodeSnippetBody } from '../ModelTraceExplorerCodeSnippetBody';

const tryGetJsonContent = (content: string) => {
  try {
    return {
      content: JSON.stringify(JSON.parse(content), null, 2),
      isJson: true,
    };
  } catch (error) {
    return {
      content,
      isJson: false,
    };
  }
};

function ModelTraceExplorerChatMessageContent({
  content,
  shouldDisplayCodeSnippet,
}: {
  content: string;
  shouldDisplayCodeSnippet: boolean;
}) {
  const { theme } = useDesignSystemTheme();

  if (!content) {
    return null;
  }

  if (shouldDisplayCodeSnippet) {
    return (
      <ModelTraceExplorerCodeSnippetBody
        data={content}
        searchFilter=""
        activeMatch={null}
        containsActiveMatch={false}
        renderMode={CodeSnippetRenderMode.JSON}
      />
    );
  }

  return (
    <div
      css={{
        padding: theme.spacing.sm,
        paddingTop: 0,
        // genai markdown renderer uses default paragraph sizing which has
        // a bottom margin that we can't get rid of. workaround by setting
        // negative margin in a wrapper.
        marginBottom: -theme.typography.fontSizeBase,
      }}
    >
      <GenAIMarkdownRenderer>{content}</GenAIMarkdownRenderer>
    </div>
  );
}

export function ModelTraceExplorerChatMessage({
  message,
  className,
}: {
  message: ModelTraceChatMessage;
  className?: string;
}) {
  const { theme } = useDesignSystemTheme();
  const [expanded, setExpanded] = useState(false);
  const { content, isJson } = tryGetJsonContent(message.content ?? '');

  // tool call responses can be JSON, and in these cases
  // it's more helpful to display the message as JSON
  const shouldDisplayCodeSnippet = isJson && (message.role === 'tool' || message.role === 'function');
  // if the content is JSON, truncation will be handled by the code
  // snippet. otherwise, we need to truncate the content manually.
  const isExpandable = !shouldDisplayCodeSnippet && content.length > CONTENT_TRUNCATION_LIMIT;

  const displayedContent = isExpandable && !expanded ? `${content.slice(0, CONTENT_TRUNCATION_LIMIT)}...` : content;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: theme.borders.borderRadiusSm,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.backgroundPrimary,
        overflow: 'hidden',
      }}
      className={className}
    >
      <ModelTraceExplorerChatMessageHeader
        isExpandable={isExpandable}
        expanded={expanded}
        setExpanded={setExpanded}
        message={message}
      />
      <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {!isNil(message.tool_calls) &&
          message.tool_calls.map((toolCall) => (
            <ModelTraceExplorerToolCallMessage key={toolCall.id} toolCall={toolCall} />
          ))}
        <ModelTraceExplorerChatMessageContent
          content={displayedContent}
          shouldDisplayCodeSnippet={shouldDisplayCodeSnippet}
        />
      </div>
      {isExpandable && (
        <Button
          componentId={
            expanded
              ? 'shared.model-trace-explorer.chat-message-see-less'
              : 'shared.model-trace-explorer.chat-message-see-more'
          }
          icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          type="tertiary"
          onClick={() => setExpanded(!expanded)}
          css={{
            display: 'flex',
            width: '100%',
            padding: theme.spacing.md,
            borderRadius: '0px !important',
          }}
        >
          {expanded ? (
            <FormattedMessage
              defaultMessage="See less"
              description="A button label in a message renderer that truncates long content when clicked."
            />
          ) : (
            <FormattedMessage
              defaultMessage="See more"
              description="A button label in a message renderer that expands truncated content when clicked."
            />
          )}
        </Button>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerChatMessageHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerChatMessageHeader.tsx

```typescript
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Typography,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { ModelTraceChatMessage } from '../ModelTrace.types';
import { ModelIconType } from '../ModelTrace.types';
import { ModelTraceExplorerIcon } from '../ModelTraceExplorerIcon';

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'system':
      return <ModelTraceExplorerIcon type={ModelIconType.SYSTEM} />;
    case 'user':
      return <ModelTraceExplorerIcon type={ModelIconType.USER} />;
    case 'tool':
    case 'function':
      return <ModelTraceExplorerIcon type={ModelIconType.WRENCH} />;
    default:
      return <ModelTraceExplorerIcon type={ModelIconType.MODELS} />;
  }
};

const getRoleDisplayText = (message: ModelTraceChatMessage) => {
  switch (message.role) {
    case 'system':
      return (
        <FormattedMessage
          defaultMessage="System"
          description="Display text for the 'system' role in a GenAI chat message."
        />
      );
    case 'user':
      return (
        <FormattedMessage
          defaultMessage="User"
          description="Display text for the 'user' role in a GenAI chat message."
        />
      );
    case 'assistant':
      return (
        <FormattedMessage
          defaultMessage="Assistant"
          description="Display text for the 'assistant' role in a GenAI chat message."
        />
      );
    case 'tool':
      if (message.name) {
        return message.name;
      }
      return (
        <FormattedMessage
          defaultMessage="Tool"
          description="Display text for the 'tool' role in a GenAI chat message."
        />
      );
    case 'function':
      return (
        <FormattedMessage
          defaultMessage="Function"
          description="Display text for the 'function' role in a GenAI chat message."
        />
      );
    default:
      return message.role;
  }
};

export const ModelTraceExplorerChatMessageHeader = ({
  isExpandable,
  expanded,
  setExpanded,
  message,
}: {
  isExpandable: boolean;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  message: ModelTraceChatMessage;
}) => {
  const { theme } = useDesignSystemTheme();
  const hoverStyles = isExpandable
    ? {
        ':hover': {
          backgroundColor: theme.colors.actionIconBackgroundHover,
          cursor: 'pointer',
        },
      }
    : {};

  return (
    <div
      role="button"
      css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
        gap: theme.spacing.sm,
        ...hoverStyles,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {isExpandable && (expanded ? <ChevronDownIcon /> : <ChevronRightIcon />)}
      {getRoleIcon(message.role)}
      {message.tool_call_id ? (
        <Typography.Text
          color="secondary"
          css={{
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
          }}
        >
          <FormattedMessage
            defaultMessage="{toolName} was called in {toolCallId}"
            description="A message that shows the tool call ID of a tool call chat message."
            values={{
              toolName: (
                <Typography.Text css={{ marginRight: theme.spacing.xs }} bold>
                  {getRoleDisplayText(message)}
                </Typography.Text>
              ),
              toolCallId: (
                <Tooltip componentId="shared.model-trace-explorer.tool-call-id-tooltip" content={message.tool_call_id}>
                  <div
                    css={{ display: 'inline-flex', flexShrink: 1, overflow: 'hidden', marginLeft: theme.spacing.xs }}
                  >
                    <Typography.Text css={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} code>
                      {message.tool_call_id}
                    </Typography.Text>
                  </div>
                </Tooltip>
              ),
            }}
          />
        </Typography.Text>
      ) : (
        <Typography.Text bold>{getRoleDisplayText(message)}</Typography.Text>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerChatRenderer.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerChatRenderer.utils.tsx

```typescript
export const CONTENT_TRUNCATION_LIMIT = 300;
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerChatTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerChatTab.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerChatTool } from './ModelTraceExplorerChatTool';
import { ModelTraceExplorerConversation } from './ModelTraceExplorerConversation';
import type { ModelTraceChatMessage, ModelTraceChatTool } from '../ModelTrace.types';
import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';

export function ModelTraceExplorerChatTab({
  chatMessages,
  chatTools,
}: {
  chatMessages: ModelTraceChatMessage[];
  chatTools?: ModelTraceChatTool[];
}) {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        overflowY: 'auto',
        padding: theme.spacing.md,
      }}
      data-testid="model-trace-explorer-chat-tab"
    >
      {chatTools && (
        <ModelTraceExplorerCollapsibleSection
          css={{ marginBottom: theme.spacing.sm }}
          title={
            <FormattedMessage
              defaultMessage="Tools"
              description="Section header in the chat tab that displays all tools that were available for the chat model to call during execution"
            />
          }
          sectionKey="messages"
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {chatTools.map((tool) => (
              <ModelTraceExplorerChatTool key={tool.function.name} tool={tool} />
            ))}
          </div>
        </ModelTraceExplorerCollapsibleSection>
      )}

      <ModelTraceExplorerCollapsibleSection
        title={
          <FormattedMessage
            defaultMessage="Messages"
            description="Section header in the chat tab that displays the message history between the user and the chat model"
          />
        }
        sectionKey="messages"
      >
        <ModelTraceExplorerConversation messages={chatMessages} />
      </ModelTraceExplorerCollapsibleSection>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerChatTool.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerChatTool.tsx
Signals: React

```typescript
import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';

import { ModelTraceExplorerChatToolParam } from './ModelTraceExplorerChatToolParam';
import type { ModelTraceChatTool } from '../ModelTrace.types';

export function ModelTraceExplorerChatTool({ tool }: { tool: ModelTraceChatTool }) {
  const { theme } = useDesignSystemTheme();
  const [expanded, setExpanded] = useState(false);

  const description = tool.function.description;
  const paramProperties = tool.function.parameters?.properties;
  const requiredParams = tool.function.parameters?.required ?? [];

  // tools only need to have names, so it's
  // possible that no additional info exists
  const isExpandable = description || paramProperties;

  const hoverStyles = isExpandable
    ? { ':hover': { backgroundColor: theme.colors.actionIconBackgroundHover, cursor: 'pointer' } }
    : {};

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: theme.borders.borderRadiusMd,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      data-testid="model-trace-explorer-chat-tool"
    >
      <div
        role="button"
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.sm,
          alignItems: 'center',
          borderBottom: isExpandable && expanded ? `1px solid ${theme.colors.border}` : 'none',
          padding: theme.spacing.sm,
          ...hoverStyles,
        }}
        onClick={() => setExpanded(!expanded)}
        data-testid="model-trace-explorer-chat-tool-toggle"
      >
        {isExpandable && (expanded ? <ChevronDownIcon /> : <ChevronRightIcon />)}
        <Typography.Text
          bold
          withoutMargins
          style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {tool.function.name}
        </Typography.Text>
      </div>
      {isExpandable && expanded && (
        <div css={{ padding: theme.spacing.sm }}>
          {description && (
            <Typography.Paragraph
              style={{ whiteSpace: 'pre-wrap', marginBottom: theme.spacing.sm, padding: `0px ${theme.spacing.xs}px` }}
            >
              {tool.function.description}
            </Typography.Paragraph>
          )}
          {paramProperties && (
            <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
              {Object.keys(paramProperties).map((key) => (
                <ModelTraceExplorerChatToolParam
                  key={key}
                  paramName={key}
                  paramProperties={paramProperties[key]}
                  isRequired={requiredParams.includes(key)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerChatToolParam.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerChatToolParam.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { ModelTraceChatToolParamProperty } from '../ModelTrace.types';

export function ModelTraceExplorerChatToolParam({
  paramName,
  paramProperties,
  isRequired,
}: {
  paramName: string;
  paramProperties: ModelTraceChatToolParamProperty;
  isRequired: boolean;
}) {
  const { theme } = useDesignSystemTheme();

  const { type, description, enum: enumValues } = paramProperties;

  const hasAdditionalInfo = type || description || enumValues;

  const borderStyles = hasAdditionalInfo
    ? {
        borderTopLeftRadius: theme.borders.borderRadiusMd,
        borderTopRightRadius: theme.borders.borderRadiusMd,
        borderBottom: `1px solid ${theme.colors.border}`,
      }
    : {
        borderRadius: theme.borders.borderRadiusMd,
      };

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: theme.borders.borderRadiusMd,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.backgroundSecondary,
          padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          gap: theme.spacing.sm,
          ...borderStyles,
        }}
      >
        <Typography.Title withoutMargins style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {paramName}
        </Typography.Title>
        {isRequired && (
          <Typography.Text withoutMargins color="error">
            <FormattedMessage
              defaultMessage="required"
              description="Text displayed next to a function parameter to indicate that it is required"
            />
          </Typography.Text>
        )}
      </div>
      {hasAdditionalInfo && (
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gridTemplateRows: 'auto',
            gap: theme.spacing.md,
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          }}
        >
          {type && (
            <>
              <Typography.Text withoutMargins bold>
                <FormattedMessage
                  defaultMessage="Type"
                  description="Row heading in a table that contains the type of a function parameter (e.g. string, boolean)"
                />
              </Typography.Text>
              <Typography.Text withoutMargins code>
                {type}
              </Typography.Text>
            </>
          )}
          {description && (
            <>
              <Typography.Text withoutMargins bold>
                <FormattedMessage
                  defaultMessage="Description"
                  description="Row heading in a table that contains the description of a function parameter."
                />
              </Typography.Text>
              <Typography.Text withoutMargins>{description}</Typography.Text>
            </>
          )}
          {enumValues && (
            <>
              <Typography.Text withoutMargins bold>
                <FormattedMessage
                  defaultMessage="Enum Values"
                  description="Row heading in a table that contains the potential enum values that a function parameter can have."
                />
              </Typography.Text>
              <div css={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
                {enumValues.map((value) => (
                  <Typography.Text withoutMargins code key={value}>
                    {value}
                  </Typography.Text>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerContentTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerContentTab.tsx

```typescript
import { isNil } from 'lodash';

import { useDesignSystemTheme } from '@databricks/design-system';

import { ModelTraceExplorerDefaultSpanView } from './ModelTraceExplorerDefaultSpanView';
import { ModelTraceExplorerRetrieverSpanView } from './ModelTraceExplorerRetrieverSpanView';
import type { ModelTraceSpanNode, SearchMatch } from '../ModelTrace.types';
import { isRenderableRetrieverSpan } from '../ModelTraceExplorer.utils';

export function ModelTraceExplorerContentTab({
  activeSpan,
  className,
  searchFilter,
  activeMatch,
}: {
  activeSpan: ModelTraceSpanNode | undefined;
  className?: string;
  searchFilter: string;
  activeMatch: SearchMatch | null;
}) {
  const { theme } = useDesignSystemTheme();

  if (!isNil(activeSpan) && isRenderableRetrieverSpan(activeSpan)) {
    return (
      <div
        css={{
          overflowY: 'auto',
          padding: theme.spacing.md,
        }}
        className={className}
        data-testid="model-trace-explorer-content-tab"
      >
        <ModelTraceExplorerRetrieverSpanView
          activeSpan={activeSpan}
          className={className}
          searchFilter={searchFilter}
          activeMatch={activeMatch}
        />
      </div>
    );
  }

  return (
    <div
      css={{
        overflowY: 'auto',
        padding: theme.spacing.md,
      }}
      className={className}
      data-testid="model-trace-explorer-content-tab"
    >
      <ModelTraceExplorerDefaultSpanView
        activeSpan={activeSpan}
        className={className}
        searchFilter={searchFilter}
        activeMatch={activeMatch}
      />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerConversation.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerConversation.tsx

```typescript
import { isNil } from 'lodash';

import { useDesignSystemTheme } from '@databricks/design-system';

import { ModelTraceExplorerChatMessage } from './ModelTraceExplorerChatMessage';
import type { ModelTraceChatMessage } from '../ModelTrace.types';

export function ModelTraceExplorerConversation({ messages }: { messages: ModelTraceChatMessage[] | null }) {
  const { theme } = useDesignSystemTheme();

  if (isNil(messages)) {
    return null;
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
      }}
    >
      {messages.map((message, index) => (
        <ModelTraceExplorerChatMessage key={index} message={message} />
      ))}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerDefaultSpanView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerDefaultSpanView.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useMemo } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { ModelTraceSpanNode, SearchMatch } from '../ModelTrace.types';
import { createListFromObject } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerCodeSnippet } from '../ModelTraceExplorerCodeSnippet';
import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';

export function ModelTraceExplorerDefaultSpanView({
  activeSpan,
  className,
  searchFilter,
  activeMatch,
}: {
  activeSpan: ModelTraceSpanNode | undefined;
  className?: string;
  searchFilter: string;
  activeMatch: SearchMatch | null;
}) {
  const { theme } = useDesignSystemTheme();
  const inputList = useMemo(() => createListFromObject(activeSpan?.inputs), [activeSpan]);
  const outputList = useMemo(() => createListFromObject(activeSpan?.outputs), [activeSpan]);

  if (isNil(activeSpan)) {
    return null;
  }

  const containsInputs = inputList.length > 0;
  const containsOutputs = outputList.length > 0;

  const isActiveMatchSpan = !isNil(activeMatch) && activeMatch.span.key === activeSpan.key;

  return (
    <div data-testid="model-trace-explorer-default-span-view">
      {containsInputs && (
        <ModelTraceExplorerCollapsibleSection
          withBorder
          css={{ marginBottom: theme.spacing.sm }}
          sectionKey="input"
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
              <FormattedMessage
                defaultMessage="Inputs"
                description="Model trace explorer > selected span > inputs header"
              />
            </div>
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
      {containsOutputs && (
        <ModelTraceExplorerCollapsibleSection
          withBorder
          sectionKey="output"
          title={
            <div css={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <FormattedMessage
                defaultMessage="Outputs"
                description="Model trace explorer > selected span > outputs header"
              />
            </div>
          }
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {outputList.map(({ key, value }) => (
              <ModelTraceExplorerCodeSnippet
                key={key}
                title={key}
                data={value}
                searchFilter={searchFilter}
                activeMatch={activeMatch}
                containsActiveMatch={isActiveMatchSpan && activeMatch.section === 'outputs' && activeMatch.key === key}
              />
            ))}
          </div>
        </ModelTraceExplorerCollapsibleSection>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerEventsTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerEventsTab.tsx

```typescript
import { isNil } from 'lodash';

import { Empty, Typography, useDesignSystemTheme, XCircleIcon } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { CodeSnippetRenderMode, type ModelTraceSpanNode, type SearchMatch } from '../ModelTrace.types';
import { getEventAttributeKey } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerCodeSnippet } from '../ModelTraceExplorerCodeSnippet';
import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';

export function ModelTraceExplorerEventsTab({
  activeSpan,
  searchFilter,
  activeMatch,
}: {
  activeSpan: ModelTraceSpanNode;
  searchFilter: string;
  activeMatch: SearchMatch | null;
}) {
  const { theme } = useDesignSystemTheme();
  const { events } = activeSpan;
  const isActiveMatchSpan = !isNil(activeMatch) && activeMatch.span.key === activeSpan.key;

  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div css={{ marginTop: theme.spacing.md }}>
        <Empty
          description={
            <FormattedMessage
              defaultMessage="No events found"
              description="Empty state for the events tab in the model trace explorer. Events are logs of arbitrary things (e.g. exceptions) that occur during the execution of a span, and can be user-defined."
            />
          }
        />
      </div>
    );
  }

  return (
    <div css={{ padding: theme.spacing.md }}>
      {events.map((event, index) => {
        const attributes = event.attributes;
        const title =
          event.name === 'exception' ? (
            <>
              <XCircleIcon css={{ marginRight: theme.spacing.sm }} color="danger" />
              <Typography.Text color="error" bold>
                Exception
              </Typography.Text>
            </>
          ) : (
            event.name
          );

        if (!attributes) return null;

        return (
          <ModelTraceExplorerCollapsibleSection
            key={`${event.name}-${index}`}
            sectionKey={event.name}
            title={title}
            withBorder
          >
            <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
              {Object.keys(attributes).map((attribute) => {
                const key = getEventAttributeKey(event.name, index, attribute);

                return (
                  <ModelTraceExplorerCodeSnippet
                    key={key}
                    title={attribute}
                    data={JSON.stringify(attributes[attribute], null, 2)}
                    searchFilter={searchFilter}
                    activeMatch={activeMatch}
                    containsActiveMatch={
                      isActiveMatchSpan && activeMatch.section === 'events' && activeMatch.key === key
                    }
                    initialRenderMode={CodeSnippetRenderMode.TEXT}
                  />
                );
              })}
            </div>
          </ModelTraceExplorerCollapsibleSection>
        );
      })}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRetrieverDocument.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerRetrieverDocument.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';

import { ModelTraceExplorerRetrieverDocumentFull } from './ModelTraceExplorerRetrieverDocumentFull';
import { ModelTraceExplorerRetrieverDocumentPreview } from './ModelTraceExplorerRetrieverDocumentPreview';
import { createListFromObject } from '../ModelTraceExplorer.utils';

export function ModelTraceExplorerRetrieverDocument({
  text,
  metadata,
}: {
  text: string;
  metadata: { [key: string]: any };
}) {
  const [expanded, setExpanded] = useState(false);
  const metadataTags = createListFromObject(metadata);

  return expanded ? (
    <ModelTraceExplorerRetrieverDocumentFull
      // comment to prevent copybara formatting
      text={text}
      metadataTags={metadataTags}
      setExpanded={setExpanded}
    />
  ) : (
    <ModelTraceExplorerRetrieverDocumentPreview
      // comment to prevent copybara formatting
      text={text}
      metadataTags={metadataTags}
      setExpanded={setExpanded}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRetrieverDocumentFull.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerRetrieverDocumentFull.tsx

```typescript
import { Button, ChevronUpIcon, FileDocumentIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { GenAIMarkdownRenderer } from '../../genai-markdown-renderer';
import { KeyValueTag } from '../key-value-tag/KeyValueTag';

export function ModelTraceExplorerRetrieverDocumentFull({
  text,
  metadataTags,
  setExpanded,
  logDocumentClick,
}: {
  text: string;
  metadataTags: { key: string; value: string }[];
  setExpanded: (expanded: boolean) => void;
  logDocumentClick?: (action: string) => void;
}) {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flexDirection: 'column' }}>
      <div
        role="button"
        onClick={() => {
          setExpanded(false);
          logDocumentClick?.('collapse');
        }}
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          height: theme.typography.lineHeightBase,
          boxSizing: 'content-box',
          '&:hover': {
            backgroundColor: theme.colors.backgroundSecondary,
          },
        }}
      >
        <FileDocumentIcon />
      </div>
      <div css={{ padding: theme.spacing.md, paddingBottom: 0 }}>
        <GenAIMarkdownRenderer>{text}</GenAIMarkdownRenderer>
      </div>
      <div css={{ padding: theme.spacing.md, paddingTop: 0 }}>
        {metadataTags.map(({ key, value }) => (
          <KeyValueTag key={key} itemKey={key} itemValue={value} />
        ))}
      </div>
      <Button
        css={{ width: '100%', padding: theme.spacing.sm }}
        componentId="shared.model-trace-explorer.retriever-document-collapse"
        icon={<ChevronUpIcon />}
        type="tertiary"
        onClick={() => setExpanded(false)}
      >
        <FormattedMessage
          defaultMessage="See less"
          description="Model trace explorer > selected span > code snippet > see less button"
        />
      </Button>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRetrieverDocumentPreview.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerRetrieverDocumentPreview.tsx

```typescript
import { FileDocumentIcon, Tag, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';

import { KeyValueTag } from '../key-value-tag/KeyValueTag';

export function ModelTraceExplorerRetrieverDocumentPreview({
  text,
  metadataTags,
  setExpanded,
  logDocumentClick,
}: {
  text: string;
  metadataTags: { key: string; value: string }[];
  setExpanded: (expanded: boolean) => void;
  logDocumentClick?: (action: string) => void;
}) {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      role="button"
      onClick={() => {
        setExpanded(true);
        logDocumentClick?.('expand');
      }}
      css={{
        display: 'flex',
        flexDirection: 'row',
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        gap: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.colors.backgroundSecondary,
        },
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.sm,
          alignItems: 'center',
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        <FileDocumentIcon />
        <Typography.Text ellipsis size="md">
          {text}
        </Typography.Text>
      </div>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.sm,
        }}
      >
        {metadataTags.length > 0 ? (
          <KeyValueTag css={{ margin: 0 }} itemKey={metadataTags[0].key} itemValue={metadataTags[0].value} />
        ) : null}
        {metadataTags.length > 1 ? (
          <Tooltip
            componentId="shared.model-trace-explorer.tag-count.hover-tooltip"
            content={metadataTags.slice(1).map(({ key, value }) => (
              <span key={key} css={{ display: 'inline-block' }}>
                {`${key}: ${value}`}
              </span>
            ))}
          >
            <Tag componentId="shared.model-trace-explorer.tag-count" css={{ whiteSpace: 'nowrap', margin: 0 }}>
              +{metadataTags.length - 1}
            </Tag>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

````
