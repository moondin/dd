---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 565
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 565 of 991)

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

---[FILE: PromptContentCompare.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptContentCompare.test.tsx

```typescript
/* eslint-disable jest/no-standalone-expect */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { PromptContentCompare } from './PromptContentCompare';

describe('PromptContentCompare', () => {
  const renderComponent = (baseline: any, compared: any) => {
    const queryClient = new QueryClient();
    return render(
      <IntlProvider locale="en">
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <PromptContentCompare
              baselineVersion={baseline}
              comparedVersion={compared}
              onSwitchSides={jest.fn()}
              onEditVersion={jest.fn()}
              aliasesByVersion={{}}
            />
          </QueryClientProvider>
        </DesignSystemProvider>
      </IntlProvider>,
    );
  };
  it('stringifies chat prompts for comparison', () => {
    const baseline = {
      name: 'p',
      version: '1',
      tags: [{ key: 'mlflow.prompt.text', value: JSON.stringify([{ role: 'user', content: 'Hi' }]) }],
    };
    const compared = {
      name: 'p',
      version: '2',
      tags: [{ key: 'mlflow.prompt.text', value: JSON.stringify([{ role: 'user', content: 'Hi there' }]) }],
    };
    renderComponent(baseline, compared);
    expect(screen.getAllByText('user: Hi').length).toBeGreaterThan(0);
    expect(screen.getByText('there')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PromptContentCompare.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptContentCompare.tsx
Signals: React

```typescript
import { Button, ExpandMoreIcon, Spacer, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useMemo } from 'react';
import { getChatPromptMessagesFromValue, getPromptContentTagValue } from '../utils';
import type { RegisteredPrompt, RegisteredPromptVersion } from '../types';
import { PromptVersionMetadata } from './PromptVersionMetadata';
import { FormattedMessage, useIntl } from 'react-intl';
import { diffWords } from '../diff';

export const PromptContentCompare = ({
  baselineVersion,
  comparedVersion,
  onSwitchSides,
  onEditVersion,
  registeredPrompt,
  aliasesByVersion,
  showEditAliasesModal,
}: {
  baselineVersion?: RegisteredPromptVersion;
  comparedVersion?: RegisteredPromptVersion;
  onSwitchSides: () => void;
  onEditVersion: (version?: RegisteredPromptVersion) => void;
  registeredPrompt?: RegisteredPrompt;
  aliasesByVersion: Record<string, string[]>;
  showEditAliasesModal?: (versionNumber: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const baselineValue = useMemo(
    () => (baselineVersion ? getPromptContentTagValue(baselineVersion) : ''),
    [baselineVersion],
  );
  const comparedValue = useMemo(
    () => (comparedVersion ? getPromptContentTagValue(comparedVersion) : ''),
    [comparedVersion],
  );

  const baselineMessages = useMemo(() => getChatPromptMessagesFromValue(baselineValue), [baselineValue]);
  const comparedMessages = useMemo(() => getChatPromptMessagesFromValue(comparedValue), [comparedValue]);

  const stringifyChat = (messages: ReturnType<typeof getChatPromptMessagesFromValue>, fallback?: string) => {
    if (messages) {
      // Add an extra newline between each message for better diff readability
      return messages.map((m: any) => `${m.role}: ${m.content}`).join('\n\n');
    }
    return fallback ?? '';
  };

  const baselineDisplay = stringifyChat(baselineMessages, baselineValue);
  const comparedDisplay = stringifyChat(comparedMessages, comparedValue);

  const diff = useMemo(
    () => diffWords(baselineDisplay ?? '', comparedDisplay ?? '') ?? [],
    [baselineDisplay, comparedDisplay],
  );

  const colors = useMemo(
    () => ({
      addedBackground: theme.isDarkMode ? theme.colors.green700 : theme.colors.green300,
      removedBackground: theme.isDarkMode ? theme.colors.red700 : theme.colors.red300,
    }),
    [theme],
  );

  return (
    <div
      css={{
        flex: 1,
        padding: theme.spacing.md,
        paddingTop: 0,
        borderRadius: theme.borders.borderRadiusSm,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>
          <FormattedMessage
            defaultMessage="Comparing version {baseline} with version {compared}"
            description="Label for comparing prompt versions in the prompt comparison view. Variables {baseline} and {compared} are numeric version numbers being compared."
            values={{
              baseline: baselineVersion?.version,
              compared: comparedVersion?.version,
            }}
          />
        </Typography.Title>
      </div>
      <Spacer shrinks={false} />
      <div css={{ display: 'flex' }}>
        <div css={{ flex: 1 }}>
          <PromptVersionMetadata
            aliasesByVersion={aliasesByVersion}
            onEditVersion={onEditVersion}
            registeredPrompt={registeredPrompt}
            registeredPromptVersion={baselineVersion}
            showEditAliasesModal={showEditAliasesModal}
            isBaseline
          />
        </div>
        <div css={{ paddingLeft: theme.spacing.sm, paddingRight: theme.spacing.sm }}>
          <div css={{ width: theme.general.heightSm }} />
        </div>
        <div css={{ flex: 1 }}>
          <PromptVersionMetadata
            aliasesByVersion={aliasesByVersion}
            onEditVersion={onEditVersion}
            registeredPrompt={registeredPrompt}
            registeredPromptVersion={comparedVersion}
            showEditAliasesModal={showEditAliasesModal}
          />
        </div>
      </div>
      <Spacer shrinks={false} />
      <div css={{ display: 'flex', flex: 1, overflow: 'auto', alignItems: 'flex-start' }}>
        <div
          css={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.spacing.md,
            flex: 1,
          }}
        >
          <Typography.Text
            css={{
              whiteSpace: 'pre-wrap',
            }}
          >
            {baselineDisplay || 'Empty'}
          </Typography.Text>
        </div>
        <div css={{ paddingLeft: theme.spacing.sm, paddingRight: theme.spacing.sm }}>
          <Tooltip
            componentId="mlflow.prompts.details.switch_sides.tooltip"
            content={
              <FormattedMessage
                defaultMessage="Switch sides"
                description="A label for button used to switch prompt versions when in side-by-side comparison view"
              />
            }
            side="top"
          >
            <Button
              aria-label={intl.formatMessage({
                defaultMessage: 'Switch sides',
                description: 'A label for button used to switch prompt versions when in side-by-side comparison view',
              })}
              componentId="mlflow.prompts.details.switch_sides"
              icon={<ExpandMoreIcon css={{ svg: { rotate: '90deg' } }} />}
              onClick={onSwitchSides}
            />
          </Tooltip>
        </div>

        <div
          css={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.spacing.md,
            flex: 1,
          }}
        >
          <Typography.Text
            css={{
              whiteSpace: 'pre-wrap',
            }}
          >
            {diff.map((part, index) => (
              <span
                key={index}
                css={{
                  backgroundColor: part.added
                    ? colors.addedBackground
                    : part.removed
                    ? colors.removedBackground
                    : undefined,
                  textDecoration: part.removed ? 'line-through' : 'none',
                }}
              >
                {part.value}
              </span>
            ))}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptContentPreview.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptContentPreview.test.tsx

```typescript
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { PromptContentPreview } from './PromptContentPreview';

describe('PromptContentPreview', () => {
  const renderComponent = (promptVersion: any) => {
    const queryClient = new QueryClient();
    return render(
      <IntlProvider locale="en">
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <PromptContentPreview
              promptVersion={promptVersion}
              aliasesByVersion={{}}
              showEditPromptVersionMetadataModal={jest.fn()}
            />
          </QueryClientProvider>
        </DesignSystemProvider>
      </IntlProvider>,
    );
  };

  it('renders chat messages', () => {
    const promptVersion = {
      name: 'prompt1',
      version: '1',
      tags: [
        {
          key: 'mlflow.prompt.text',
          value: JSON.stringify([
            { role: 'user', content: 'Hi' },
            { role: 'assistant', content: 'Hello' },
          ]),
        },
        {
          key: '_mlflow_prompt_type',
          value: 'chat',
        },
      ],
    };
    renderComponent(promptVersion);

    expect(screen.getByText('user', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('assistant', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Hello', { exact: false })).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PromptContentPreview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptContentPreview.tsx
Signals: React

```typescript
import {
  Button,
  LightningIcon,
  Modal,
  PlayIcon,
  Spacer,
  TrashIcon,
  MarkdownIcon,
  SegmentedControlButton,
  SegmentedControlGroup,
  Tooltip,
  Typography,
  useDesignSystemTheme,
  TextBoxIcon,
} from '@databricks/design-system';
import { useMemo, useState } from 'react';
import {
  getChatPromptMessagesFromValue,
  getPromptContentTagValue,
  isChatPrompt,
  PROMPT_TYPE_CHAT,
  PROMPT_TYPE_TEXT,
} from '../utils';
import type { RegisteredPrompt, RegisteredPromptVersion } from '../types';
import { PromptVersionMetadata } from './PromptVersionMetadata';
import { FormattedMessage } from 'react-intl';
import { uniq } from 'lodash';
import { GenAIMarkdownRenderer } from '@databricks/web-shared/genai-markdown-renderer';
import { useDeletePromptVersionModal } from '../hooks/useDeletePromptVersionModal';
import { ShowArtifactCodeSnippet } from '../../../components/artifact-view-components/ShowArtifactCodeSnippet';
import { ModelTraceExplorerChatMessage } from '@databricks/web-shared/model-trace-explorer';
import type { ModelTraceChatMessage } from '@databricks/web-shared/model-trace-explorer';
import { OptimizeModal } from './OptimizeModal';

const PROMPT_VARIABLE_REGEX = /\{\{\s*(.*?)\s*\}\}/g;

export const PromptContentPreview = ({
  promptVersion,
  onUpdatedContent,
  onDeletedVersion,
  aliasesByVersion,
  registeredPrompt,
  showEditAliasesModal,
  showEditPromptVersionMetadataModal,
  showEditModelConfigModal,
}: {
  promptVersion?: RegisteredPromptVersion;
  onUpdatedContent?: () => Promise<any>;
  onDeletedVersion?: () => Promise<any>;
  aliasesByVersion: Record<string, string[]>;
  registeredPrompt?: RegisteredPrompt;
  showEditAliasesModal?: (versionNumber: string) => void;
  showEditPromptVersionMetadataModal: (promptVersion: RegisteredPromptVersion) => void;
  showEditModelConfigModal?: (promptVersion: RegisteredPromptVersion) => void;
}) => {
  const value = useMemo(() => (promptVersion ? getPromptContentTagValue(promptVersion) : ''), [promptVersion]);
  const isChatPromptType = useMemo(() => isChatPrompt(promptVersion), [promptVersion]);
  const parsedMessages = useMemo(
    () => (isChatPromptType ? getChatPromptMessagesFromValue(value) : undefined),
    [isChatPromptType, value],
  );

  const { DeletePromptModal, openModal: openDeleteModal } = useDeletePromptVersionModal({
    promptVersion,
    onSuccess: () => onDeletedVersion?.(),
  });

  const [showUsageExample, setShowUsageExample] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [shouldRenderMarkdown, setShouldRenderMarkdown] = useState(true);

  // Find all variables in the prompt content
  const variableNames = useMemo(() => {
    if (!value) {
      return [];
    }

    const variables: string[] = [];
    const source = isChatPromptType ? parsedMessages?.map((m) => m.content).join('\n') || '' : value;

    let match;
    while ((match = PROMPT_VARIABLE_REGEX.exec(source)) !== null) {
      variables.push(match[1]);
    }

    // Sanity check for tricky cases like nested brackets. If the variable name contains
    // a bracket, we consider it as a parsing error and render a placeholder instead.
    if (variables.some((variable) => variable.includes('{') || variable.includes('}'))) {
      return null;
    }

    return uniq(variables);
  }, [value, isChatPromptType, parsedMessages]);
  const codeSnippetContent = buildCodeSnippetContent(
    promptVersion,
    variableNames,
    isChatPromptType ? PROMPT_TYPE_CHAT : undefined,
  );

  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        flex: 1,
        padding: theme.spacing.md,
        paddingTop: 0,
        borderRadius: theme.borders.borderRadiusSm,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            flex: 1,
            columnGap: theme.spacing.md,
            rowGap: theme.spacing.sm,
            marginRight: theme.spacing.md,
          }}
        >
          <Typography.Title withoutMargins level={3}>
            <FormattedMessage
              defaultMessage="Viewing version {version}"
              description="Title of the prompt details page for a given version"
              values={{ version: promptVersion?.version }}
            />
          </Typography.Title>
        </div>
        <div css={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button
            componentId="mlflow.prompts.details.delete_version"
            icon={<TrashIcon />}
            type="primary"
            danger
            onClick={openDeleteModal}
          >
            <FormattedMessage
              defaultMessage="Delete version"
              description="A label for a button to delete prompt version on the prompt details page"
            />
          </Button>
          <Button
            componentId="mlflow.prompts.details.preview.optimize"
            icon={<LightningIcon />}
            onClick={() => setShowOptimizeModal(true)}
          >
            <FormattedMessage
              defaultMessage="Optimize"
              description="A label for a button to display the modal with instructions to optimize the prompt"
            />
          </Button>
          <Button
            componentId="mlflow.prompts.details.preview.use"
            icon={<PlayIcon />}
            onClick={() => setShowUsageExample(true)}
          >
            <FormattedMessage
              defaultMessage="Use"
              description="A label for a button to display the modal with the usage example of the prompt"
            />
          </Button>
        </div>
      </div>
      <Spacer shrinks={false} />
      <PromptVersionMetadata
        aliasesByVersion={aliasesByVersion}
        registeredPrompt={registeredPrompt}
        registeredPromptVersion={promptVersion}
        showEditAliasesModal={showEditAliasesModal}
        showEditPromptVersionMetadataModal={showEditPromptVersionMetadataModal}
        showEditModelConfigModal={showEditModelConfigModal}
      />
      {isChatPromptType && <Spacer shrinks={false} />}
      <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!isChatPromptType && (
            <SegmentedControlGroup
              name="render-mode"
              size="small"
              componentId="mlflow.prompts.details.toggle-markdown-rendering"
              value={shouldRenderMarkdown}
              onChange={(event) => setShouldRenderMarkdown(event.target.value)}
              css={{ display: 'flex' }}
            >
              <SegmentedControlButton value={false}>
                <Tooltip
                  componentId="mlflow.prompts.details.plaintext-rendering-tooltip"
                  content={
                    <FormattedMessage
                      defaultMessage="Plain text"
                      description="Tooltip content for a button that changes the render mode of the prompt to plain text"
                    />
                  }
                >
                  <div css={{ display: 'flex', alignItems: 'center' }}>
                    <Typography.Text>
                      {' '}
                      <FormattedMessage
                        defaultMessage="Text"
                        description="Label for the text render mode of the prompt"
                      />
                    </Typography.Text>
                  </div>
                </Tooltip>
              </SegmentedControlButton>
              <SegmentedControlButton value>
                <Tooltip
                  componentId="mlflow.prompts.details.markdown-rendering-tooltip"
                  content={
                    <FormattedMessage
                      defaultMessage="Markdown"
                      description="Tooltip content for a button that changes the render mode of the prompt to markdown"
                    />
                  }
                >
                  <div css={{ display: 'flex', alignItems: 'center' }}>
                    <MarkdownIcon css={{ fontSize: theme.typography.fontSizeLg }} />
                  </div>
                </Tooltip>
              </SegmentedControlButton>
            </SegmentedControlGroup>
          )}
        </div>
        <div
          css={{
            backgroundColor: isChatPromptType ? undefined : theme.colors.backgroundSecondary,
            padding: theme.spacing.md,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
          {isChatPromptType && parsedMessages ? (
            parsedMessages.map((msg: any, index: number) => (
              <ModelTraceExplorerChatMessage
                key={index}
                message={
                  {
                    ...msg,
                    content: msg.content,
                  } as ModelTraceChatMessage
                }
              />
            ))
          ) : shouldRenderMarkdown ? (
            <GenAIMarkdownRenderer>{value || 'Empty'}</GenAIMarkdownRenderer>
          ) : (
            <Typography.Text
              css={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {value || 'Empty'}
            </Typography.Text>
          )}
        </div>
      </div>
      <Modal
        componentId="mlflow.prompts.details.preview.usage_example_modal"
        title={
          <FormattedMessage
            defaultMessage="Usage example"
            description="A title of the modal showing the usage example of the prompt"
          />
        }
        visible={showUsageExample}
        onCancel={() => setShowUsageExample(false)}
        cancelText={
          <FormattedMessage
            defaultMessage="Dismiss"
            description="A label for the button to dismiss the modal with the usage example of the prompt"
          />
        }
      >
        <ShowArtifactCodeSnippet
          code={buildCodeSnippetContent(promptVersion, variableNames, isChatPromptType ? PROMPT_TYPE_CHAT : undefined)}
        />{' '}
      </Modal>
      <OptimizeModal
        visible={showOptimizeModal}
        promptName={promptVersion?.name || ''}
        promptVersion={promptVersion?.version || ''}
        onCancel={() => setShowOptimizeModal(false)}
      />
      {DeletePromptModal}
    </div>
  );
};

const buildCodeSnippetContent = (
  promptVersion: RegisteredPromptVersion | undefined,
  variables: string[] | null,
  promptType: string = PROMPT_TYPE_TEXT,
) => {
  let codeSnippetContent = `from openai import OpenAI
import mlflow
client = OpenAI(api_key="<YOUR_API_KEY>")

# Set MLflow tracking URI
mlflow.set_tracking_uri("<YOUR_TRACKING_URI>")

# Example of loading and using the prompt
prompt = mlflow.genai.load_prompt("prompts:/${promptVersion?.name}/${promptVersion?.version}")`;

  // Null variables mean that there was a parsing error
  if (variables === null) {
    if (promptType === PROMPT_TYPE_CHAT) {
      codeSnippetContent += `

# Replace the variables with the actual values
variables = {
   "key": "value",
   ...
}

messages = prompt.format(**variables)
response = client.chat.completions.create(
    messages=messages,
    model="gpt-4o-mini",
)`;
    } else {
      codeSnippetContent += `

# Replace the variables with the actual values
variables = {
   "key": "value",
   ...
}

response = client.chat.completions.create(
    messages=[{
        "role": "user",
        "content": prompt.format(**variables),
    }],
    model="gpt-4o-mini",
)`;
    }
  } else if (promptType === PROMPT_TYPE_CHAT) {
    codeSnippetContent += `
messages = prompt.format_messages(${variables.map((name) => `${name}="<${name}>"`).join(', ')})
response = client.chat.completions.create(
    messages=messages,
    model="gpt-4o-mini",
)`;
  } else {
    codeSnippetContent += `
response = client.chat.completions.create(
    messages=[{
        "role": "user",
        "content": prompt.format(${variables.map((name) => `${name}="<${name}>"`).join(', ')}),
    }],
    model="gpt-4o-mini",
)`;
  }

  codeSnippetContent += `\n\nprint(response.choices[0].message.content)`;
  return codeSnippetContent;
};
```

--------------------------------------------------------------------------------

---[FILE: PromptDetailsTagsBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptDetailsTagsBox.tsx

```typescript
import type { RegisteredPrompt } from '../types';
import { Button, PencilIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUpdateRegisteredPromptTags } from '../hooks/useUpdateRegisteredPromptTags';
import { isUserFacingTag } from '../../../../common/utils/TagUtils';
import { KeyValueTag } from '../../../../common/components/KeyValueTag';

export const PromptsListTableTagsBox = ({
  promptEntity,
  onTagsUpdated,
}: {
  promptEntity?: RegisteredPrompt;
  onTagsUpdated?: () => void;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const { EditTagsModal, showEditPromptTagsModal } = useUpdateRegisteredPromptTags({ onSuccess: onTagsUpdated });

  const visibleTagList = promptEntity?.tags.filter((tag) => isUserFacingTag(tag.key)) || [];
  const containsTags = visibleTagList.length > 0;

  return (
    <div
      css={{
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.xs,

        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '> *': {
          marginRight: '0 !important',
        },
        gap: theme.spacing.xs,
      }}
    >
      {visibleTagList?.map((tag) => (
        <KeyValueTag key={tag.key} tag={tag} />
      ))}
      <Button
        componentId="mlflow.prompts.details.tags.edit"
        size="small"
        icon={!containsTags ? undefined : <PencilIcon />}
        onClick={() => promptEntity && showEditPromptTagsModal(promptEntity)}
        aria-label={intl.formatMessage({
          defaultMessage: 'Edit tags',
          description: 'Label for the edit tags button on the registered prompt details page"',
        })}
        children={
          !containsTags ? (
            <FormattedMessage
              defaultMessage="Add tags"
              description="Label for the add tags button on the registered prompt details page"
            />
          ) : undefined
        }
        type="tertiary"
      />
      {EditTagsModal}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptNotFoundView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptNotFoundView.tsx

```typescript
import { ErrorView } from '@mlflow/mlflow/src/common/components/ErrorView';
import Routes from '../../../routes';

interface Props {
  promptName: string;
}

export function PromptNotFoundView({ promptName }: Props) {
  return (
    <ErrorView
      statusCode={404}
      subMessage={`Prompt name '${promptName}' does not exist`}
      fallbackHomePageReactRoute={Routes.promptsPageRoute}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: PromptPageErrorHandler.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptPageErrorHandler.tsx

```typescript
import { DangerIcon, Empty } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { ScrollablePageWrapper } from '../../../../common/components/ScrollablePageWrapper';

export const PromptPageErrorHandler = ({ error }: { error?: Error }) => {
  return (
    <ScrollablePageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage
            defaultMessage="Error"
            description="Title for error fallback component in prompts management UI"
          />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering this component."
              description="Description for default error message in prompts management UI"
            />
          )
        }
        image={<DangerIcon />}
      />
    </ScrollablePageWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptsListFilters.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptsListFilters.tsx

```typescript
import { TableFilterInput, TableFilterLayout } from '@databricks/design-system';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModelSearchInputHelpTooltip } from '../../../../model-registry/components/model-list/ModelListFilters';

export const PromptsListFilters = ({
  searchFilter,
  onSearchFilterChange,
}: {
  searchFilter: string;
  onSearchFilterChange: (searchFilter: string) => void;
}) => {
  return (
    <TableFilterLayout>
      <TableFilterInput
        placeholder="Search prompts by name or tags"
        componentId="mlflow.prompts.list.search"
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        suffix={<ModelSearchInputHelpTooltip exampleEntityName="my-prompt-name" />}
      />
    </TableFilterLayout>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptsListTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptsListTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  CursorPagination,
  Empty,
  NoIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableSkeletonRows,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { RegisteredPrompt } from '../types';
import { PromptsListTableTagsCell } from './PromptsListTableTagsCell';
import { PromptsListTableNameCell } from './PromptsListTableNameCell';
import Utils from '../../../../common/utils/Utils';
import { PromptsListTableVersionCell } from './PromptsListTableVersionCell';
import type { PromptsTableMetadata } from '../utils';
import { first, isEmpty } from 'lodash';

type PromptsTableColumnDef = ColumnDef<RegisteredPrompt>;

const usePromptsTableColumns = () => {
  const intl = useIntl();
  return useMemo(() => {
    const resultColumns: PromptsTableColumnDef[] = [
      {
        header: intl.formatMessage({
          defaultMessage: 'Name',
          description: 'Header for the name column in the registered prompts table',
        }),
        accessorKey: 'name',
        id: 'name',
        cell: PromptsListTableNameCell,
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Latest version',
          description: 'Header for the latest version column in the registered prompts table',
        }),
        cell: PromptsListTableVersionCell,
        accessorFn: ({ latest_versions }) => first(latest_versions)?.version,
        id: 'latestVersion',
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Last modified',
          description: 'Header for the last modified column in the registered prompts table',
        }),
        id: 'lastModified',
        accessorFn: ({ last_updated_timestamp }) => Utils.formatTimestamp(last_updated_timestamp, intl),
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Tags',
          description: 'Header for the tags column in the registered prompts table',
        }),
        accessorKey: 'tags',
        id: 'tags',
        cell: PromptsListTableTagsCell,
      },
    ];

    return resultColumns;
  }, [intl]);
};

export const PromptsListTable = ({
  prompts,
  hasNextPage,
  hasPreviousPage,
  isLoading,
  isFiltered,
  onNextPage,
  onPreviousPage,
  onEditTags,
  experimentId,
}: {
  prompts?: RegisteredPrompt[];
  error?: Error;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading?: boolean;
  isFiltered?: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onEditTags: (editedEntity: RegisteredPrompt) => void;
  experimentId?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const columns = usePromptsTableColumns();

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptsListTable.tsx',
    {
      data: prompts ?? [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      getRowId: (row, index) => row.name ?? index.toString(),
      meta: { onEditTags, experimentId } satisfies PromptsTableMetadata,
    },
  );

  const getEmptyState = () => {
    const isEmptyList = !isLoading && isEmpty(prompts);
    if (isEmptyList && isFiltered) {
      return (
        <Empty
          image={<NoIcon />}
          title={
            <FormattedMessage
              defaultMessage="No prompts found"
              description="Label for the empty state in the prompts table when no prompts are found"
            />
          }
          description={null}
        />
      );
    }
    if (isEmptyList) {
      return (
        <Empty
          title={
            <FormattedMessage
              defaultMessage="No prompts created"
              description="A header for the empty state in the prompts table"
            />
          }
          description={
            <FormattedMessage
              defaultMessage='Use "Create prompt" button in order to create a new prompt'
              description="Guidelines for the user on how to create a new prompt in the prompts list page"
            />
          }
        />
      );
    }

    return null;
  };

  return (
    <Table
      scrollable
      pagination={
        <CursorPagination
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          componentId="mlflow.prompts.list.pagination"
        />
      }
      empty={getEmptyState()}
    >
      <TableRow isHeader>
        {table.getLeafHeaders().map((header) => (
          <TableHeader componentId="mlflow.prompts.list.table.header" key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableHeader>
        ))}
      </TableRow>
      {isLoading ? (
        <TableSkeletonRows table={table} />
      ) : (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} css={{ height: theme.general.buttonHeight }}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id} css={{ alignItems: 'center' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </Table>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptsListTableNameCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptsListTableNameCell.tsx

```typescript
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import type { RegisteredPrompt } from '../types';
import type { PromptsTableMetadata } from '../utils';

export const PromptsListTableNameCell: ColumnDef<RegisteredPrompt>['cell'] = ({
  row: { original },
  getValue,
  table: {
    options: { meta },
  },
}) => {
  const name = getValue<string>();
  const { experimentId } = (meta || {}) as PromptsTableMetadata;

  if (!original.name) {
    return name;
  }
  return <Link to={Routes.getPromptDetailsPageRoute(encodeURIComponent(original.name), experimentId)}>{name}</Link>;
};
```

--------------------------------------------------------------------------------

---[FILE: PromptsListTableTagsCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptsListTableTagsCell.tsx

```typescript
import type { ColumnDef } from '@tanstack/react-table';
import type { RegisteredPrompt } from '../types';
import { Button, PencilIcon } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import { isUserFacingTag } from '../../../../common/utils/TagUtils';
import type { PromptsTableMetadata } from '../utils';
import { KeyValueTag } from '../../../../common/components/KeyValueTag';

export const PromptsListTableTagsCell: ColumnDef<RegisteredPrompt>['cell'] = ({
  row: { original },
  table: {
    options: { meta },
  },
}) => {
  const intl = useIntl();

  const { onEditTags } = meta as PromptsTableMetadata;

  const visibleTagList = original?.tags?.filter((tag) => isUserFacingTag(tag.key)) || [];
  const containsTags = visibleTagList.length > 0;

  return (
    <div css={{ display: 'flex' }}>
      <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex' }}>
        {visibleTagList?.map((tag) => (
          <KeyValueTag key={tag.key} tag={tag} />
        ))}
      </div>
      <Button
        componentId="mlflow.prompts.list.tag.add"
        size="small"
        icon={!containsTags ? undefined : <PencilIcon />}
        onClick={() => onEditTags?.(original)}
        aria-label={intl.formatMessage({
          defaultMessage: 'Edit tags',
          description: 'Label for the edit tags button in the registered prompts table',
        })}
        children={
          !containsTags ? (
            <FormattedMessage
              defaultMessage="Add tags"
              description="Label for the add tags button in the registered prompts table"
            />
          ) : undefined
        }
        css={{
          flexShrink: 0,
          opacity: 0,
          '[role=row]:hover &': {
            opacity: 1,
          },
          '[role=row]:focus-within &': {
            opacity: 1,
          },
        }}
        type="tertiary"
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptsListTableVersionCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptsListTableVersionCell.tsx

```typescript
import { Typography } from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { FormattedMessage } from 'react-intl';

export const PromptsListTableVersionCell: ColumnDef<any>['cell'] = ({ row: { original }, getValue }) => {
  const version = getValue<string>();

  if (!version) {
    return null;
  }
  return (
    <Typography.Text>
      <FormattedMessage
        defaultMessage="Version {version}"
        description="Label for the version of a registered prompt in the registered prompts table"
        values={{
          version,
        }}
      />
    </Typography.Text>
  );
};
```

--------------------------------------------------------------------------------

````
