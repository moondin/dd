---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 580
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 580 of 991)

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

---[FILE: ExperimentsHomeView.tsx]---
Location: mlflow-master/mlflow/server/js/src/home/components/ExperimentsHomeView.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';
import { Alert, Button, Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import { FormattedMessage } from 'react-intl';
import { ExperimentListTable } from '../../experiment-tracking/components/ExperimentListTable';
import Routes from '../../experiment-tracking/routes';
import { Link } from '../../common/utils/RoutingUtils';
import type { ExperimentEntity } from '../../experiment-tracking/types';

type ExperimentsHomeViewProps = {
  experiments?: ExperimentEntity[];
  isLoading: boolean;
  error?: Error | null;
  onCreateExperiment: () => void;
  onRetry: () => void;
};

const ExperimentsEmptyState = ({ onCreateExperiment }: { onCreateExperiment: () => void }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        padding: theme.spacing.lg,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
      }}
    >
      <Typography.Title level={4} css={{ margin: 0 }}>
        <FormattedMessage
          defaultMessage="Create your first experiment"
          description="Home page experiments empty state title"
        />
      </Typography.Title>
      <Typography.Text css={{ color: theme.colors.textSecondary }}>
        <FormattedMessage
          defaultMessage="Create your first experiment to start tracking ML workflows."
          description="Home page experiments empty state description"
        />
      </Typography.Text>
      <Button componentId="mlflow.home.experiments.create" onClick={onCreateExperiment}>
        <FormattedMessage defaultMessage="Create experiment" description="Home page experiments empty state CTA" />
      </Button>
    </div>
  );
};

export const ExperimentsHomeView = ({
  experiments,
  isLoading,
  error,
  onCreateExperiment,
  onRetry,
}: ExperimentsHomeViewProps) => {
  const { theme } = useDesignSystemTheme();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const topExperiments = useMemo(() => experiments?.slice(0, 5) ?? [], [experiments]);
  const shouldShowEmptyState = !isLoading && !error && topExperiments.length === 0;

  return (
    <section css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        }}
      >
        <Typography.Title level={3} css={{ margin: 0 }}>
          <FormattedMessage defaultMessage="Experiments" description="Home page experiments preview title" />
        </Typography.Title>
        <Link to={Routes.experimentsObservatoryRoute}>
          <FormattedMessage defaultMessage="View all" description="Home page experiments view all link" />
        </Link>
      </div>
      <div
        css={{
          border: `1px solid ${theme.colors.border}`,
          overflow: 'hidden',
          backgroundColor: theme.colors.backgroundPrimary,
        }}
      >
        {error ? (
          <div css={{ padding: theme.spacing.lg, display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            <Alert
              type="error"
              closable={false}
              componentId="mlflow.home.experiments.error"
              message={
                <FormattedMessage
                  defaultMessage="We couldn't load your experiments."
                  description="Home page experiments error message"
                />
              }
              description={error.message}
            />
            <div>
              <Button componentId="mlflow.home.experiments.retry" onClick={onRetry}>
                <FormattedMessage defaultMessage="Retry" description="Home page experiments retry CTA" />
              </Button>
            </div>
          </div>
        ) : shouldShowEmptyState ? (
          <ExperimentsEmptyState onCreateExperiment={onCreateExperiment} />
        ) : (
          <ExperimentListTable
            experiments={topExperiments}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sortingProps={{ sorting, setSorting }}
            onEditTags={() => undefined}
          />
        )}
      </div>
      <Spacer shrinks={false} />
    </section>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GetStarted.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/home/components/GetStarted.test.tsx
Signals: React

```typescript
import { describe, expect, it, jest } from '@jest/globals';
import React, { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithDesignSystem, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { GetStarted } from './GetStarted';
import { homeQuickActions } from '../quick-actions';
import { useHomePageViewState } from '../HomePageViewStateContext';

type FormattedMessageReactElement = React.ReactElement<{ defaultMessage: string }>;

const isFormattedMessageElement = (node: React.ReactNode): node is FormattedMessageReactElement =>
  React.isValidElement(node) && typeof (node.props as { defaultMessage?: unknown }).defaultMessage === 'string';

const getQuickActionDefaultMessage = (title: React.ReactNode): string => {
  if (isFormattedMessageElement(title)) {
    return title.props.defaultMessage;
  }
  throw new Error('Expected quick action title to be a FormattedMessage element');
};

describe('GetStarted', () => {
  it('renders header and all quick actions', () => {
    renderWithDesignSystem(<GetStarted />);

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Get started',
      }),
    ).toBeInTheDocument();

    homeQuickActions.forEach((action) => {
      const defaultMessage = getQuickActionDefaultMessage(action.title);
      const element = screen.getByText(defaultMessage);
      expect(element).toBeInTheDocument();
      if (action.id === 'log-traces') {
        expect(element.closest('button')).not.toBeNull();
      } else {
        expect(element.closest('a')).not.toBeNull();
      }
    });
  });

  it('renders non log traces quick actions as external links', () => {
    renderWithDesignSystem(<GetStarted />);

    homeQuickActions.forEach((action) => {
      const defaultMessage = getQuickActionDefaultMessage(action.title);
      if (action.id === 'log-traces') {
        const buttonElement = screen.getByText(defaultMessage).closest('button');
        expect(buttonElement).not.toBeNull();
      } else {
        const linkElement = screen.getByText(defaultMessage).closest('a') as HTMLAnchorElement | null;
        expect(linkElement).not.toBeNull();
        expect(linkElement).toHaveAttribute('href', action.link);
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  const DrawerObserver = ({ onOpen }: { onOpen: jest.Mock }) => {
    const { isLogTracesDrawerOpen } = useHomePageViewState();
    useEffect(() => {
      if (isLogTracesDrawerOpen) {
        onOpen();
      }
    }, [isLogTracesDrawerOpen, onOpen]);
    return null;
  };

  it('opens log traces drawer state when quick action is clicked', async () => {
    const onOpen = jest.fn();
    renderWithDesignSystem(
      <>
        <DrawerObserver onOpen={onOpen} />
        <GetStarted />
      </>,
    );

    const logTracesAction = homeQuickActions.find((action) => action.id === 'log-traces');
    if (!logTracesAction) {
      throw new Error('Log traces quick action is not defined');
    }

    const logTracesButton = screen.getByRole('button', {
      name: new RegExp(getQuickActionDefaultMessage(logTracesAction.title), 'i'),
    });

    await userEvent.click(logTracesButton);
    expect(onOpen).toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GetStarted.tsx]---
Location: mlflow-master/mlflow/server/js/src/home/components/GetStarted.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { homeQuickActions } from '../quick-actions';
import { useHomePageViewState } from '../HomePageViewStateContext';

type QuickAction = typeof homeQuickActions[number];

const GetStartedCard = ({ action }: { action: QuickAction }) => {
  const { theme } = useDesignSystemTheme();
  const linkStyles = {
    textDecoration: 'none',
    color: theme.colors.textPrimary,
    display: 'block',
  };
  const containerStyles = {
    overflow: 'hidden',
    border: `1px solid ${theme.colors.actionDefaultBorderDefault}`,
    borderRadius: theme.borders.borderRadiusMd,
    background: theme.colors.backgroundPrimary,
    padding: theme.spacing.sm + theme.spacing.xs,
    display: 'flex',
    gap: theme.spacing.sm,
    width: 320,
    minWidth: 320,
    boxSizing: 'border-box' as const,
    boxShadow: theme.shadows.sm,
    cursor: 'pointer',
    transition: 'background 150ms ease',
    '&:hover': {
      background: theme.colors.actionDefaultBackgroundHover,
    },
    '&:active': {
      background: theme.colors.actionDefaultBackgroundPress,
    },
  };
  const contentStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.xs,
    flex: 1,
  };
  const iconWrapperStyles = {
    borderRadius: theme.borders.borderRadiusSm,
    background: theme.colors.actionDefaultBackgroundHover,
    padding: theme.spacing.xs,
    color: theme.colors.blue500,
    height: 'min-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const card = (
    <div css={containerStyles}>
      <div css={iconWrapperStyles}>
        <action.icon />
      </div>
      <div css={contentStyles}>
        <span role="heading" aria-level={2}>
          <Typography.Text bold>{action.title}</Typography.Text>
        </span>
        <Typography.Text color="secondary">{action.description}</Typography.Text>
      </div>
    </div>
  );

  const { openLogTracesDrawer } = useHomePageViewState();

  if (action.id === 'log-traces') {
    return (
      <button
        type="button"
        onClick={openLogTracesDrawer}
        css={{
          ...linkStyles,
          border: 0,
          padding: 0,
          background: 'transparent',
          cursor: 'pointer',
          font: 'inherit',
          textAlign: 'left',
        }}
      >
        {card}
      </button>
    );
  }

  return (
    <a href={action.link} target="_blank" rel="noopener noreferrer" css={linkStyles}>
      {card}
    </a>
  );
};

export const GetStarted = () => {
  const { theme } = useDesignSystemTheme();

  return (
    <section css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
      <Typography.Title level={3} css={{ margin: 0 }}>
        <FormattedMessage defaultMessage="Get started" description="Home page quick action section title" />
      </Typography.Title>
      <section
        css={{
          marginBottom: 20,
          width: '100%',
          minWidth: 0,
          display: 'flex',
          gap: theme.spacing.sm + theme.spacing.xs,
          flexWrap: 'wrap',
        }}
      >
        {homeQuickActions.map((action) => (
          <GetStartedCard key={action.id} action={action} />
        ))}
      </section>
    </section>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: LogTracesDrawer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/home/components/LogTracesDrawer.test.tsx
Signals: React

```typescript
import { describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithDesignSystem, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { LogTracesDrawer } from './LogTracesDrawer';
import { useHomePageViewState } from '../HomePageViewStateContext';

jest.mock('@mlflow/mlflow/src/experiment-tracking/components/traces/quickstart/TraceTableGenericQuickstart', () => ({
  TraceTableGenericQuickstart: ({ flavorName, baseComponentId }: { flavorName: string; baseComponentId: string }) => (
    <div data-testid="quickstart" data-flavor={flavorName} data-base={baseComponentId} />
  ),
}));

const OpenOnMount = () => {
  const { openLogTracesDrawer } = useHomePageViewState();
  React.useEffect(() => {
    openLogTracesDrawer();
  }, [openLogTracesDrawer]);
  return null;
};

describe('LogTracesDrawer', () => {
  it('renders the drawer with default framework selected', () => {
    renderWithDesignSystem(
      <MemoryRouter>
        <OpenOnMount />
        <LogTracesDrawer />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('dialog', {
        name: 'Log traces',
      }),
    ).toBeInTheDocument();

    const openAiButton = screen.getByRole('button', { name: 'OpenAI' });
    expect(openAiButton).toHaveAttribute('aria-pressed', 'true');

    const quickstart = screen.getByTestId('quickstart');
    expect(quickstart).toHaveAttribute('data-flavor', 'openai');
    expect(quickstart).toHaveAttribute('data-base', 'mlflow.home.log_traces.drawer.openai');
  });

  it('updates quickstart content when selecting a different framework', async () => {
    renderWithDesignSystem(
      <MemoryRouter>
        <OpenOnMount />
        <LogTracesDrawer />
      </MemoryRouter>,
    );

    const langChainButton = screen.getByRole('button', { name: 'LangChain' });
    await userEvent.click(langChainButton);

    expect(langChainButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'OpenAI' })).toHaveAttribute('aria-pressed', 'false');

    const quickstart = screen.getByTestId('quickstart');
    expect(quickstart).toHaveAttribute('data-flavor', 'langchain');
    expect(quickstart).toHaveAttribute('data-base', 'mlflow.home.log_traces.drawer.langchain');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: LogTracesDrawer.tsx]---
Location: mlflow-master/mlflow/server/js/src/home/components/LogTracesDrawer.tsx
Signals: React

```typescript
import { useState } from 'react';
import {
  Drawer,
  Spacer,
  Typography,
  useDesignSystemTheme,
  CopyIcon,
  NewWindowIcon,
  WorkflowsIcon,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { QUICKSTART_CONTENT } from '@mlflow/mlflow/src/experiment-tracking/components/traces/quickstart/TraceTableQuickstart.utils';
import { TraceTableGenericQuickstart } from '@mlflow/mlflow/src/experiment-tracking/components/traces/quickstart/TraceTableGenericQuickstart';
import type { QUICKSTART_FLAVOR } from '@mlflow/mlflow/src/experiment-tracking/components/traces/quickstart/TraceTableQuickstart.utils';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { Link } from '../../common/utils/RoutingUtils';
import Routes from '../../experiment-tracking/routes';
import OpenAiLogo from '../../common/static/logos/openai.svg';
import OpenAiLogoDark from '../../common/static/logos/openai-dark.svg';
import LangChainLogo from '../../common/static/logos/langchain.svg';
import LangChainLogoDark from '../../common/static/logos/langchain-dark.png';
import LangGraphLogo from '../../common/static/logos/langgraph.svg';
import AnthropicLogo from '../../common/static/logos/anthropic.svg';
import AnthropicLogoDark from '../../common/static/logos/anthropic-dark.png';
import DspyLogo from '../../common/static/logos/dspy.png';
import LiteLLMLogo from '../../common/static/logos/litellm.png';
import GeminiLogo from '../../common/static/logos/gemini.png';
import BedrockLogo from '../../common/static/logos/bedrock.svg';
import LlamaIndexLogo from '../../common/static/logos/llamaindex.png';
import AutoGenLogo from '../../common/static/logos/autogen.png';
import CrewAILogo from '../../common/static/logos/crewai.png';
import { useHomePageViewState } from '../HomePageViewStateContext';

type SupportedQuickstartFlavor = QUICKSTART_FLAVOR;

type FrameworkDefinition = {
  id: SupportedQuickstartFlavor;
  message: string;
  logo?: string;
  selectedLogo?: string;
};

const frameworks: FrameworkDefinition[] = [
  {
    id: 'openai',
    message: 'OpenAI',
    logo: OpenAiLogo,
    selectedLogo: OpenAiLogoDark,
  },
  {
    id: 'langchain',
    message: 'LangChain',
    logo: LangChainLogo,
    selectedLogo: LangChainLogoDark,
  },
  {
    id: 'langgraph',
    message: 'LangGraph',
    logo: LangGraphLogo,
  },
  {
    id: 'dspy',
    message: 'DSPy',
    logo: DspyLogo,
  },
  {
    id: 'anthropic',
    message: 'Anthropic',
    logo: AnthropicLogo,
    selectedLogo: AnthropicLogoDark,
  },
  {
    id: 'litellm',
    message: 'LiteLLM',
    logo: LiteLLMLogo,
  },
  {
    id: 'gemini',
    message: 'Gemini',
    logo: GeminiLogo,
  },
  {
    id: 'bedrock',
    message: 'Amazon Bedrock',
    logo: BedrockLogo,
  },
  {
    id: 'llama_index',
    message: 'LlamaIndex',
    logo: LlamaIndexLogo,
  },
  {
    id: 'autogen',
    message: 'AutoGen',
    logo: AutoGenLogo,
  },
  {
    id: 'crewai',
    message: 'CrewAI',
    logo: CrewAILogo,
  },
];

const MORE_INTEGRATIONS_URL = 'https://mlflow.org/docs/latest/genai/tracing/#one-line-auto-tracing-integrations';

const TRACING_DOCS_URL = 'https://mlflow.org/docs/latest/genai/tracing/';

const CONFIGURE_EXPERIMENT_SNIPPET = `import mlflow

# Specify the tracking server URI, e.g. http://localhost:5000
mlflow.set_tracking_uri("http://<tracking-server-host>:<port>")
# If the experiment with the name "traces-quickstart" doesn't exist, MLflow will create it
mlflow.set_experiment("traces-quickstart")`;

export const LogTracesDrawer = () => {
  const { theme } = useDesignSystemTheme();
  const [selectedFramework, setSelectedFramework] = useState<SupportedQuickstartFlavor>('openai');
  const { isLogTracesDrawerOpen, closeLogTracesDrawer } = useHomePageViewState();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFramework('openai');
      closeLogTracesDrawer();
    }
  };

  return (
    <Drawer.Root modal open={isLogTracesDrawerOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content
        componentId="mlflow.home.log_traces.drawer"
        width="70vw"
        title={
          <span
            css={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}
          >
            <span
              css={{
                borderRadius: theme.borders.borderRadiusSm,
                background: theme.colors.actionDefaultBackgroundHover,
                padding: theme.spacing.xs,
                color: theme.colors.blue500,
                height: 'min-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WorkflowsIcon />
            </span>
            <FormattedMessage
              defaultMessage="Log traces"
              description="Title for the log traces drawer on the Home page"
            />
          </span>
        }
      >
        <Typography.Text color="secondary">
          <FormattedMessage
            defaultMessage="Select a framework and follow the instructions to log traces with MLflow."
            description="Helper text shown at the top of the log traces drawer"
          />
        </Typography.Text>
        <Spacer size="md" />
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            gap: theme.spacing.lg,
            minHeight: 0,
          }}
        >
          <aside
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
              minWidth: 220,
              maxWidth: 260,
            }}
          >
            {frameworks.map((framework) => {
              const isSelected = framework.id === selectedFramework;
              const logoSrc = isSelected && framework.selectedLogo ? framework.selectedLogo : framework.logo;
              return (
                <button
                  key={framework.id}
                  type="button"
                  onClick={() => setSelectedFramework(framework.id)}
                  data-component-id="mlflow.home.log_traces.drawer.select-framework"
                  aria-pressed={isSelected}
                  css={{
                    border: 0,
                    borderRadius: theme.borders.borderRadiusSm,
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    textAlign: 'left' as const,
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? theme.colors.actionPrimaryBackgroundDefault
                      : theme.colors.backgroundSecondary,
                    color: isSelected ? theme.colors.actionPrimaryTextDefault : theme.colors.textPrimary,
                    transition: 'background 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    '&:hover': {
                      backgroundColor: isSelected
                        ? theme.colors.actionPrimaryBackgroundHover
                        : theme.colors.actionDefaultBackgroundHover,
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${theme.colors.actionPrimaryBackgroundHover}`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  {logoSrc && (
                    <img src={logoSrc} width={28} height={28} alt="icon" aria-hidden css={{ display: 'block' }} />
                  )}
                  {framework.message}
                </button>
              );
            })}
            <Spacer size="sm" />
            <a
              href={MORE_INTEGRATIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              css={{
                marginTop: theme.spacing.sm,
                display: 'inline-flex',
                gap: theme.spacing.xs,
                alignItems: 'center',
                fontWeight: theme.typography.typographyBoldFontWeight,
              }}
            >
              <FormattedMessage
                defaultMessage="View all integrations"
                description="Link text directing users to additional tracing integrations"
              />
              <NewWindowIcon css={{ fontSize: 14 }} />
            </a>
          </aside>
          <div
            css={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borders.borderRadiusLg,
              padding: theme.spacing.lg,
              backgroundColor: theme.colors.backgroundPrimary,
              boxShadow: theme.shadows.xs,
            }}
          >
            <section
              css={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              <Typography.Title level={4} css={{ margin: 0 }}>
                <FormattedMessage
                  defaultMessage="1. Configure experiment and tracking URI"
                  description="Section title for configuring experiment and tracking URI before logging traces"
                />
              </Typography.Title>
              <div css={{ position: 'relative', width: 'min(100%, 800px)' }}>
                <CopyButton
                  componentId="mlflow.home.log_traces.drawer.configure.copy"
                  css={{ zIndex: 1, position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
                  showLabel={false}
                  copyText={CONFIGURE_EXPERIMENT_SNIPPET}
                  icon={<CopyIcon />}
                />
                <CodeSnippet
                  showLineNumbers
                  language="python"
                  theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
                  style={{
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    marginTop: theme.spacing.xs,
                  }}
                >
                  {CONFIGURE_EXPERIMENT_SNIPPET}
                </CodeSnippet>
              </div>
            </section>

            <section
              css={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              <Typography.Title level={4} css={{ margin: 0 }}>
                <FormattedMessage
                  defaultMessage="2. Trace your code"
                  description="Section title introducing the tracing quickstart example"
                />
              </Typography.Title>
              <TraceTableGenericQuickstart
                flavorName={selectedFramework}
                baseComponentId={`mlflow.home.log_traces.drawer.${selectedFramework}`}
              />
            </section>

            <section
              css={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              <Typography.Title level={4} css={{ margin: 0 }}>
                <FormattedMessage
                  defaultMessage="3. Access the MLflow UI"
                  description="Section title explaining how to access traces in the MLflow UI"
                />
              </Typography.Title>
              <Typography.Text color="secondary" css={{ margin: 0 }}>
                <FormattedMessage
                  defaultMessage="After your script runs, open the MLflow UI to review the recorded traces."
                  description="Introductory text for viewing traces in the MLflow UI"
                />
                <Spacer size="sm" />
                <ol
                  css={{
                    margin: 0,
                    paddingLeft: theme.spacing.lg,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.xs,
                  }}
                >
                  <li>
                    <FormattedMessage
                      defaultMessage="Open the {experimentsLink} page."
                      description="Instruction to open the experiments page from the log traces drawer"
                      values={{
                        experimentsLink: (
                          <Link
                            to={Routes.experimentsObservatoryRoute}
                            target="_blank"
                            rel="noopener noreferrer"
                            css={{
                              display: 'inline-flex',
                              gap: theme.spacing.xs,
                              alignItems: 'center',
                            }}
                          >
                            <FormattedMessage
                              defaultMessage="Experiments"
                              description="Link label for the experiments page"
                            />
                            <NewWindowIcon css={{ fontSize: 14 }} />
                          </Link>
                        ),
                      }}
                    />
                  </li>
                  <li>
                    <FormattedMessage
                      defaultMessage="Select the experiment you configured above."
                      description="Instruction to select the experiment configured for traces"
                    />
                  </li>
                  <li>
                    <FormattedMessage
                      defaultMessage="Switch to the {tracesTab} tab to inspect trace inputs, outputs, and tokens."
                      description="Instruction to open the traces tab in the experiment page"
                      values={{ tracesTab: <strong>Traces</strong> }}
                    />
                  </li>
                </ol>
              </Typography.Text>
            </section>
            <section>
              <Typography.Text color="secondary" css={{ margin: 0 }}>
                <FormattedMessage
                  defaultMessage="Learn more about tracing in the {tracingDocs}."
                  description="Instruction to learn more about tracing in the tracing docs"
                  values={{
                    tracingDocs: (
                      <a
                        href={TRACING_DOCS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        css={{ display: 'inline-flex', gap: theme.spacing.xs, alignItems: 'center' }}
                      >
                        <FormattedMessage
                          defaultMessage="MLflow documentation"
                          description="Link to tracing documentation"
                        />
                        <NewWindowIcon css={{ fontSize: 14 }} />
                      </a>
                    ),
                  }}
                />
              </Typography.Text>
            </section>
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default LogTracesDrawer;
```

--------------------------------------------------------------------------------

---[FILE: I18n.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/i18n/I18n.test.tsx
Signals: React

```typescript
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { FormattedMessage } from './i18n';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

function TestComponent() {
  return (
    <div data-testid="test-component">
      <FormattedMessage
        defaultMessage="This is a default message!"
        description="Test description to ensure that the default message is rendered"
      />
    </div>
  );
}

describe('i18n', () => {
  it('render returns the default message without any locales generated', () => {
    const defaultMessage = 'This is a default message!';
    renderWithIntl(<TestComponent />);
    expect(screen.getByTestId('test-component')).toHaveTextContent(defaultMessage);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: i18n.tsx]---
Location: mlflow-master/mlflow/server/js/src/i18n/i18n.tsx

```typescript
export * from 'react-intl';
export * from './I18nUtils';
```

--------------------------------------------------------------------------------

---[FILE: I18nUtils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/i18n/I18nUtils.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import React from 'react';
import { createIntl } from 'react-intl';
import { I18nUtils, useI18nInit } from './I18nUtils';
import { renderHook, waitFor } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

// see mock for ./loadMessages in setupTests.js

describe('I18nUtils', () => {
  let oldLocation: any;
  beforeEach(() => {
    oldLocation = window.location;
  });

  afterEach(() => {
    localStorage.clear();
    window.location = oldLocation;
  });

  const setQueryLocale = (locale: any) => {
    oldLocation = window.location;
    // @ts-expect-error TS(2790): The operand of a 'delete' operator must be optiona... Remove this comment to see the full error message
    delete window.location;
    // @ts-expect-error TS(2322): Type '{ search: string; }' is not assignable to ty... Remove this comment to see the full error message
    window.location = { search: `?l=${locale}` };
  };

  const setLocalStorageLocale = (locale: any) => {
    localStorage.setItem('locale', locale);
  };

  describe('getCurrentLocale', () => {
    it('should return DEFAULT_LOCALE', () => {
      expect(I18nUtils.getCurrentLocale()).toBe('en');
    });

    it('should prefer locale in l query param over local storage', () => {
      setQueryLocale('fr-CA');
      setLocalStorageLocale('en-US');
      expect(I18nUtils.getCurrentLocale()).toBe('fr-CA');
    });

    it('should not fail for invalid languages', () => {
      const badLocale = 'en_US';
      // example of how it breaks normally
      expect(() => {
        createIntl({ locale: badLocale, defaultLocale: 'en' });
      }).toThrow();

      // we prevent badLocale from getting to creatIntl
      localStorage.setItem('locale', badLocale);
      const locale = I18nUtils.getCurrentLocale();
      expect(locale).toBe('en');
      expect(() => createIntl({ locale, defaultLocale: 'en' })).not.toThrow();
    });

    it('should set locale from query into localStorage', () => {
      setQueryLocale('test-locale');
      expect(I18nUtils.getCurrentLocale()).toBe('test-locale');
    });
    it('should prefer locale from localStorage', () => {
      setLocalStorageLocale('test-locale');
      const locale = I18nUtils.getCurrentLocale();
      expect(locale).toBe('test-locale');
    });
  });

  describe('loadMessages', () => {
    it('should merge values from locale, fallback locale and default locale', async () => {
      expect(await I18nUtils.loadMessages('fr-CA')).toEqual({
        'fr-CA': 'value',
        'fr-FR': 'value',
        en: 'value',
        'top-locale': 'fr-CA',
      });
      expect(await I18nUtils.loadMessages('pt-BR')).toEqual({
        'pt-BR': 'value',
        'pt-PT': 'value',
        en: 'value',
        'top-locale': 'pt-BR',
      });
      expect(await I18nUtils.loadMessages('en-GB')).toEqual({
        'en-GB': 'value',
        en: 'value',
        'top-locale': 'en-GB',
      });
    });

    it('should fallback to base language then default locale for unknown locales', async () => {
      const frResult = await I18nUtils.loadMessages('fr-unknown'); // special mocked locale
      expect(frResult).toEqual({
        'fr-FR': 'value',
        en: 'value',
        'top-locale': 'fr-FR',
      });

      // no base language falls back to default only
      const zzzResult = await I18nUtils.loadMessages('zzz-unknown'); // special mocked locale
      expect(zzzResult).toEqual({
        en: 'value',
        'top-locale': 'en',
      });
    });
  });

  describe('initI18n', () => {
    it('should make messages available to getIntlProviderParams', async () => {
      setLocalStorageLocale('fr-CA');
      await I18nUtils.initI18n();
      expect(I18nUtils.getIntlProviderParams().messages).toEqual({
        'fr-CA': 'value',
        'fr-FR': 'value',
        en: 'value',
        'top-locale': 'fr-CA',
      });
    });
  });

  describe('useI18nInit', () => {
    const mockLookupFn = jest.fn();

    beforeEach(() => {
      mockLookupFn.mockClear();
    });

    it('waits for loading messages', async () => {
      const { result } = renderHook(() => useI18nInit());

      // Initial call - no messages loaded yet
      expect(result.current).toBe(null);

      await waitFor(() =>
        expect(result.current).toEqual(
          expect.objectContaining({
            locale: 'en',
            messages: { en: 'value', 'top-locale': 'en' },
          }),
        ),
      );
    });

    it('falls back to the default value when necessary', async () => {
      // choose a different locale for this test
      window.localStorage.setItem('locale', 'de-DE');

      const errorThrown = new Error('failing translation load');

      const originalI18nUtils = { ...I18nUtils };
      I18nUtils.initI18n = jest.fn<typeof I18nUtils.initI18n>().mockRejectedValue(errorThrown);

      const { result } = renderHook(() => useI18nInit());

      await waitFor(() =>
        expect(result.current).toEqual(
          expect.objectContaining({
            locale: 'de-DE',
            messages: {},
          }),
        ),
      );

      I18nUtils.initI18n = originalI18nUtils.initI18n;
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: I18nUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/i18n/I18nUtils.ts
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import type { IntlShape } from 'react-intl';
import { createIntlCache, createIntl } from 'react-intl';
import { DEFAULT_LOCALE, loadMessages } from './loadMessages';
import { useEffect, useState } from 'react';
import Utils from '../common/utils/Utils';

const FALLBACK_LOCALES: Record<string, string> = {
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-PT',
  ja: 'ja-JP',
  kr: 'kr-KR',
  it: 'it-IT',
  de: 'de-DE',
  zh: 'zh-CN',
};

const loadedMessages: Record<string, any> = {};

const cache = createIntlCache();

export const I18nUtils = {
  async initI18n() {
    const locale = I18nUtils.getCurrentLocale();
    await I18nUtils.loadMessages(locale);
    return I18nUtils.createIntlWithLocale();
  },

  getIntlProviderParams() {
    const locale = I18nUtils.getCurrentLocale();
    return {
      locale,
      messages: loadedMessages[locale] || {},
    };
  },

  /**
   * When intl object is used entirely outside of React (e.g., Backbone Views) then
   * this method can be used to get the intl object.
   */
  createIntlWithLocale() {
    const params = I18nUtils.getIntlProviderParams();
    const intl = createIntl({ locale: params.locale, messages: params.messages }, cache);

    return intl;
  },

  getCurrentLocale() {
    const queryParams = new URLSearchParams(window.location.search);
    const getLocale = () => {
      const langFromQuery = queryParams.get('l');
      if (langFromQuery) {
        window.localStorage.setItem('locale', langFromQuery);
      }
      return window.localStorage.getItem('locale') || DEFAULT_LOCALE;
    };
    const locale = getLocale();

    // _ in the locale causes createIntl to throw, so convert to default locale
    if (locale.includes('_')) {
      return DEFAULT_LOCALE;
    }
    return locale;
  },

  /* Gets the locale to fall back on if messages are missing */
  getFallbackLocale(locale: string) {
    const lang = locale.split('-')[0];
    const fallback = FALLBACK_LOCALES[lang];
    return fallback === lang ? undefined : fallback;
  },

  async loadMessages(locale: string) {
    const locales = [
      locale === DEFAULT_LOCALE ? undefined : DEFAULT_LOCALE,
      I18nUtils.getFallbackLocale(locale),
      locale,
    ].filter(Boolean);
    const results = await Promise.all(locales.map(loadMessages));
    loadedMessages[locale] = Object.assign({}, ...results);
    return loadedMessages[locale];
  },
};

/**
 * Ensure initialization of i18n subsystem and return
 * an object with current locale and messages storage.
 *
 * The returned value will be null before initialization.
 *
 * This hook is intended to be used once in the top-level components.
 */
export const useI18nInit = () => {
  const [intl, setIntl] = useState<IntlShape | null>(null);
  useEffect(() => {
    I18nUtils.initI18n()
      .then((initializedIntlState) => {
        setIntl(initializedIntlState);
      })
      .catch((error) => {
        // Fall back to the defaults if loading translation fails
        setIntl(I18nUtils.createIntlWithLocale());
      });
  }, []);

  return intl;
};
```

--------------------------------------------------------------------------------

````
