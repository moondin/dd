---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 551
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 551 of 991)

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

---[FILE: ExperimentPageTabs.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/ExperimentPageTabs.tsx
Signals: React, Redux/RTK

```typescript
import React, { useEffect } from 'react';
import { Button, PageWrapper, Spacer, ParagraphSkeleton, useDesignSystemTheme } from '@databricks/design-system';
import { PredefinedError } from '@databricks/web-shared/errors';
import invariant from 'invariant';
import { useNavigate, useParams, Outlet, matchPath, useLocation } from '../../../common/utils/RoutingUtils';
import { useGetExperimentQuery } from '../../hooks/useExperimentQuery';
import { useExperimentReduxStoreCompat } from '../../hooks/useExperimentReduxStoreCompat';
import { ExperimentPageHeaderWithDescription } from '../../components/experiment-page/components/ExperimentPageHeaderWithDescription';
import { coerceToEnum } from '@databricks/web-shared/utils';
import { ExperimentKind, ExperimentPageTabName } from '../../constants';
import { shouldEnableExperimentPageSideTabs } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import { useUpdateExperimentKind } from '../../components/experiment-page/hooks/useUpdateExperimentKind';
import { ExperimentViewHeaderKindSelector } from '../../components/experiment-page/components/header/ExperimentViewHeaderKindSelector';
import { getExperimentKindFromTags } from '../../utils/ExperimentKindUtils';
import { useInferExperimentKind } from '../../components/experiment-page/hooks/useInferExperimentKind';
import { ExperimentViewInferredKindModal } from '../../components/experiment-page/components/header/ExperimentViewInferredKindModal';
import Routes, { RoutePaths } from '../../routes';
import { useGetExperimentPageActiveTabByRoute } from '../../components/experiment-page/hooks/useGetExperimentPageActiveTabByRoute';
import { useNavigateToExperimentPageTab } from '../../components/experiment-page/hooks/useNavigateToExperimentPageTab';
import { ExperimentPageSubTabSelector } from './ExperimentPageSubTabSelector';
import { ExperimentPageSideNav, ExperimentPageSideNavSkeleton } from './side-nav/ExperimentPageSideNav';

const ExperimentPageTabsImpl = () => {
  const { experimentId, tabName } = useParams();
  const { theme } = useDesignSystemTheme();
  const navigate = useNavigate();

  const { tabName: activeTabByRoute } = useGetExperimentPageActiveTabByRoute();
  const activeTab = activeTabByRoute ?? coerceToEnum(ExperimentPageTabName, tabName, ExperimentPageTabName.Models);

  invariant(experimentId, 'Experiment ID must be defined');

  const {
    data: experiment,
    loading: loadingExperiment,
    refetch: refetchExperiment,
    apiError: experimentApiError,
    apolloError: experimentApolloError,
  } = useGetExperimentQuery({
    experimentId,
  });

  const { mutate: updateExperimentKind, isLoading: updatingExperimentKind } =
    useUpdateExperimentKind(refetchExperiment);

  const experimentError = experimentApiError ?? experimentApolloError;

  // Put the experiment in the redux store so that the logged models page can transition smoothly
  useExperimentReduxStoreCompat(experiment);

  // For showstopper experiment fetch errors, we want it to hit the error boundary
  // so that the user can see the error message
  if (experimentError instanceof PredefinedError) {
    throw experimentError;
  }

  const experimentTags = experiment && 'tags' in experiment ? experiment?.tags : [];
  const canUpdateExperimentKind = true;

  const experimentKind = getExperimentKindFromTags(experimentTags);
  // We won't try to infer the experiment kind if it's already set, but we also wait for experiment to load
  const isExperimentKindInferenceEnabled = Boolean(experiment && !experimentKind);

  const {
    inferredExperimentKind,
    inferredExperimentPageTab,
    isLoading: inferringExperimentType,
    dismiss,
  } = useInferExperimentKind({
    experimentId,
    isLoadingExperiment: loadingExperiment,
    enabled: isExperimentKindInferenceEnabled,
    experimentTags,
    updateExperimentKind,
  });

  // Check if the user landed on the experiment page without a specific tab (sub-route)...
  const { pathname } = useLocation();
  const matchedExperimentPageWithoutTab = Boolean(matchPath(RoutePaths.experimentPage, pathname));
  // ...if true, we want to navigate to the appropriate tab based on the experiment kind
  useNavigateToExperimentPageTab({
    enabled: matchedExperimentPageWithoutTab,
    experimentId,
  });

  useEffect(() => {
    // If the experiment kind is inferred, we want to navigate to the appropriate tab.
    // Should fire once when the experiment kind is inferred.
    if (inferredExperimentPageTab) {
      navigate(Routes.getExperimentPageTabRoute(experimentId, inferredExperimentPageTab), { replace: true });
    }
    // `navigate` reference changes whenever navigate is called, causing the
    // use to be unable to visit any tab until confirming the experiment type
    // if it is included in the deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId, inferredExperimentPageTab]);

  if (inferredExperimentKind === ExperimentKind.NO_INFERRED_TYPE && canUpdateExperimentKind) {
    return (
      <ExperimentViewInferredKindModal
        onConfirm={(kind) => {
          updateExperimentKind(
            { experimentId, kind },
            {
              onSettled: () => {
                dismiss();
                if (kind === ExperimentKind.GENAI_DEVELOPMENT) {
                  // If the experiment kind is GENAI_DEVELOPMENT, we want to navigate to the Traces tab
                  navigate(Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Traces), {
                    replace: true,
                  });
                }
              },
            },
          );
        }}
        onDismiss={dismiss}
      />
    );
  }

  const outletComponent = (
    <React.Suspense
      fallback={
        <>
          {[...Array(8).keys()].map((i) => (
            <ParagraphSkeleton label="Loading..." key={i} seed={`s-${i}`} />
          ))}
        </>
      }
    >
      <Outlet />
    </React.Suspense>
  );

  return (
    <>
      <ExperimentPageHeaderWithDescription
        experiment={experiment}
        loading={loadingExperiment || inferringExperimentType}
        onNoteUpdated={refetchExperiment}
        error={experimentError}
        inferredExperimentKind={inferredExperimentKind}
        refetchExperiment={refetchExperiment}
        experimentKindSelector={
          <ExperimentViewHeaderKindSelector
            value={experimentKind}
            inferredExperimentKind={inferredExperimentKind}
            onChange={(kind) => updateExperimentKind({ experimentId, kind })}
            isUpdating={updatingExperimentKind || inferringExperimentType}
            key={inferredExperimentKind}
            readOnly={!canUpdateExperimentKind}
          />
        }
      />
      {!shouldEnableExperimentPageSideTabs() && (
        <>
          <ExperimentPageSubTabSelector experimentId={experimentId} activeTab={activeTab} />
          <Spacer size="sm" shrinks={false} />
        </>
      )}
      {shouldEnableExperimentPageSideTabs() ? (
        <div css={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
          {loadingExperiment || inferringExperimentType ? (
            <ExperimentPageSideNavSkeleton />
          ) : (
            <ExperimentPageSideNav
              experimentKind={experimentKind ?? inferredExperimentKind ?? ExperimentKind.CUSTOM_MODEL_DEVELOPMENT}
              activeTab={activeTab}
            />
          )}
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              padding: theme.spacing.sm,
              flex: 1,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {outletComponent}
          </div>
        </div>
      ) : (
        outletComponent
      )}
    </>
  );
};

const ExperimentPageTabs = () => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.md,
        height: '100%',
      }}
    >
      <ExperimentPageTabsImpl />
    </div>
  );
};

export default ExperimentPageTabs;
```

--------------------------------------------------------------------------------

---[FILE: constants.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/side-nav/constants.tsx
Signals: React

```typescript
import React from 'react';
import { ExperimentKind } from '../../../constants';
import { ExperimentPageTabName } from '../../../constants';
import {
  DatabaseIcon,
  ForkHorizontalIcon,
  GavelIcon,
  ListIcon,
  ModelsIcon,
  PlusMinusSquareIcon,
  SpeechBubbleIcon,
  TextBoxIcon,
  UserGroupIcon,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { enableScorersUI } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

export const FULL_WIDTH_CLASS_NAME = 'mlflow-experiment-page-side-nav-full';
export const COLLAPSED_CLASS_NAME = 'mlflow-experiment-page-side-nav-collapsed';

export type ExperimentPageSideNavItem = {
  componentId: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  tabName: ExperimentPageTabName;
};

export type ExperimentPageSideNavConfig = {
  [section in ExperimentPageSideNavSectionKey]?: ExperimentPageSideNavItem[];
};

export type ExperimentPageSideNavSectionKey = 'top-level' | 'observability' | 'evaluation' | 'prompts-versions';

const ExperimentPageSideNavGenAIConfig = {
  observability: [
    {
      label: (
        <FormattedMessage
          defaultMessage="Traces"
          description="Label for the traces tab in the MLflow experiment navbar"
        />
      ),
      icon: <ForkHorizontalIcon />,
      tabName: ExperimentPageTabName.Traces,
      componentId: 'mlflow.experiment-side-nav.genai.traces',
    },
  ],
  evaluation: [
    {
      label: (
        <FormattedMessage
          defaultMessage="Datasets"
          description="Label for the datasets tab in the MLflow experiment navbar"
        />
      ),
      icon: <DatabaseIcon />,
      tabName: ExperimentPageTabName.Datasets,
      componentId: 'mlflow.experiment-side-nav.genai.datasets',
    },
    {
      label: (
        <FormattedMessage
          defaultMessage="Evaluation runs"
          description="Label for the evaluation runs tab in the MLflow experiment navbar"
        />
      ),
      icon: <PlusMinusSquareIcon />,
      tabName: ExperimentPageTabName.EvaluationRuns,
      componentId: 'mlflow.experiment-side-nav.genai.evaluation-runs',
    },
  ],
  'prompts-versions': [
    {
      label: (
        <FormattedMessage
          defaultMessage="Prompts"
          description="Label for the prompts tab in the MLflow experiment navbar"
        />
      ),
      icon: <TextBoxIcon />,
      tabName: ExperimentPageTabName.Prompts,
      componentId: 'mlflow.experiment-side-nav.genai.prompts',
    },
    {
      label: (
        <FormattedMessage
          defaultMessage="Agent versions"
          description="Label for the agent versions tab in the MLflow experiment navbar"
        />
      ),
      icon: <ModelsIcon />,
      tabName: ExperimentPageTabName.Models,
      componentId: 'mlflow.experiment-side-nav.genai.agent-versions',
    },
  ],
};

const ExperimentPageSideNavCustomModelConfig = {
  'top-level': [
    {
      label: (
        <FormattedMessage defaultMessage="Runs" description="Label for the runs tab in the MLflow experiment navbar" />
      ),
      icon: <ListIcon />,
      tabName: ExperimentPageTabName.Runs,
      componentId: 'mlflow.experiment-side-nav.classic-ml.runs',
    },
    {
      label: (
        <FormattedMessage
          defaultMessage="Models"
          description="Label for the Models tab in the MLflow experiment navbar"
        />
      ),
      icon: <ModelsIcon />,
      tabName: ExperimentPageTabName.Models,
      componentId: 'mlflow.experiment-side-nav.classic-ml.models',
    },
    {
      label: (
        <FormattedMessage
          defaultMessage="Traces"
          description="Label for the traces tab in the MLflow experiment navbar"
        />
      ),
      icon: <ForkHorizontalIcon />,
      tabName: ExperimentPageTabName.Traces,
      componentId: 'mlflow.experiment-side-nav.classic-ml.traces',
    },
  ],
};

export const getExperimentPageSideNavSectionLabel = (
  section: ExperimentPageSideNavSectionKey,
): React.ReactNode | undefined => {
  switch (section) {
    case 'observability':
      return (
        <FormattedMessage
          defaultMessage="Observability"
          description="Label for the observability section in the MLflow experiment navbar"
        />
      );
    case 'evaluation':
      return (
        <FormattedMessage
          defaultMessage="Evaluation"
          description="Label for the evaluation section in the MLflow experiment navbar"
        />
      );
    case 'prompts-versions':
      return (
        <FormattedMessage
          defaultMessage="Prompts & versions"
          description="Label for the versions section in the MLflow experiment navbar"
        />
      );
    default:
      // no label for top-level section
      return undefined;
  }
};

export const useExperimentPageSideNavConfig = ({
  experimentKind,
  hasTrainingRuns = false,
}: {
  experimentKind: ExperimentKind;
  hasTrainingRuns?: boolean;
}): ExperimentPageSideNavConfig => {
  if (
    experimentKind === ExperimentKind.GENAI_DEVELOPMENT ||
    experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED
  ) {
    return {
      ...(hasTrainingRuns
        ? {
            // append training runs to top-level if they exist
            'top-level': [
              {
                label: (
                  <FormattedMessage
                    defaultMessage="Training runs"
                    description="Label for the training runs tab in the MLflow experiment navbar"
                  />
                ),
                icon: <ListIcon />,
                tabName: ExperimentPageTabName.Runs,
                componentId: 'mlflow.experiment-side-nav.genai.training-runs',
              },
            ],
          }
        : {
            'top-level': [],
          }),
      ...ExperimentPageSideNavGenAIConfig,
      observability: [
        ...ExperimentPageSideNavGenAIConfig.observability,
        {
          label: (
            <FormattedMessage
              defaultMessage="Sessions"
              description="Label for the chat sessions tab in the MLflow experiment navbar"
            />
          ),
          icon: <SpeechBubbleIcon />,
          tabName: ExperimentPageTabName.ChatSessions,
          componentId: 'mlflow.experiment-side-nav.genai.chat-sessions',
        },
      ],
      evaluation: enableScorersUI()
        ? [
            ...ExperimentPageSideNavGenAIConfig.evaluation,
            {
              label: (
                <FormattedMessage
                  defaultMessage="Judges"
                  description="Label for the judges tab in the MLflow experiment navbar"
                />
              ),
              icon: <GavelIcon />,
              tabName: ExperimentPageTabName.Judges,
              componentId: 'mlflow.experiment-side-nav.genai.judges',
            },
          ]
        : ExperimentPageSideNavGenAIConfig.evaluation,
    };
  }

  return ExperimentPageSideNavCustomModelConfig;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageSideNav.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/side-nav/ExperimentPageSideNav.test.tsx

```typescript
import { describe, jest, test, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { ExperimentPageSideNav } from './ExperimentPageSideNav';
import { ExperimentKind, ExperimentPageTabName } from '../../../constants';
import { MemoryRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { QueryClient, QueryClientProvider } from '../../../../common/utils/reactQueryHooks';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
jest.mock('../../../components/experiment-page/hooks/useExperimentEvaluationRunsData', () => ({
  useExperimentEvaluationRunsData: jest.fn(() => ({ trainingRuns: [] })),
}));

// Mock useParams from the routing utilss
jest.mock('../../../../common/utils/RoutingUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/RoutingUtils')>(
    '../../../../common/utils/RoutingUtils',
  ),
  useParams: () => ({ experimentId: 'test-experiment-123' }),
}));

jest.mock('@mlflow/mlflow/src/telemetry/hooks/useLogTelemetryEvent', () => ({
  useLogTelemetryEvent: jest.fn(() => jest.fn()),
}));

describe('ExperimentPageSideNav', () => {
  const renderTestComponent = (experimentKind: ExperimentKind, activeTab: ExperimentPageTabName) => {
    const queryClient = new QueryClient();
    return render(
      <MockedReduxStoreProvider state={{ entities: { experimentTagsByExperimentId: {}, experimentsById: {} } }}>
        <IntlProvider locale="en">
          <QueryClientProvider client={queryClient}>
            <DesignSystemProvider>
              <MemoryRouter>
                <ExperimentPageSideNav experimentKind={experimentKind} activeTab={activeTab} />
              </MemoryRouter>
            </DesignSystemProvider>
          </QueryClientProvider>
        </IntlProvider>
      </MockedReduxStoreProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([ExperimentKind.GENAI_DEVELOPMENT, ExperimentKind.GENAI_DEVELOPMENT_INFERRED])(
    'should render GenAI experiment tabs',
    (experimentKind) => {
      renderTestComponent(experimentKind, ExperimentPageTabName.Traces);

      // Check observability section
      expect(screen.getByText('Observability')).toBeInTheDocument();
      expect(screen.getByText('Traces')).toBeInTheDocument();
      expect(screen.getByText('Sessions')).toBeInTheDocument();

      // Check evaluation section
      expect(screen.getByText('Evaluation')).toBeInTheDocument();
      expect(screen.getByText('Datasets')).toBeInTheDocument();

      // Check prompts & versions section
      const versionsSectionHeader = 'Prompts & versions';
      expect(screen.getByText(versionsSectionHeader)).toBeInTheDocument();
      expect(screen.getByText('Agent versions')).toBeInTheDocument();
    },
  );

  test('should not render chat sessions for non-genai', () => {
    renderTestComponent(ExperimentKind.CUSTOM_MODEL_DEVELOPMENT, ExperimentPageTabName.Runs);
    expect(screen.queryByText('Sessions')).not.toBeInTheDocument();
  });

  test.each([
    ExperimentKind.CUSTOM_MODEL_DEVELOPMENT,
    ExperimentKind.FINETUNING,
    ExperimentKind.AUTOML,
    ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED,
  ])('should render custom model development tabs', (experimentKind) => {
    renderTestComponent(experimentKind, ExperimentPageTabName.Runs);

    // Check top-level section tabs
    expect(screen.getByText('Runs')).toBeInTheDocument();
    expect(screen.getByText('Models')).toBeInTheDocument();
    expect(screen.getByText('Traces')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageSideNav.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/side-nav/ExperimentPageSideNav.tsx

```typescript
import { TitleSkeleton, useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentPageTabName } from '../../../constants';
import { ExperimentKind } from '../../../constants';
import { useExperimentEvaluationRunsData } from '../../../components/experiment-page/hooks/useExperimentEvaluationRunsData';
import type { ExperimentPageSideNavSectionKey } from './constants';
import { COLLAPSED_CLASS_NAME, FULL_WIDTH_CLASS_NAME, useExperimentPageSideNavConfig } from './constants';
import { ExperimentPageSideNavSection } from './ExperimentPageSideNavSection';
import { useParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

const SIDE_NAV_WIDTH = 160;
const SIDE_NAV_COLLAPSED_WIDTH = 32;

export const ExperimentPageSideNav = ({
  experimentKind,
  activeTab,
}: {
  experimentKind: ExperimentKind;
  activeTab: ExperimentPageTabName;
}) => {
  const { theme } = useDesignSystemTheme();
  const { experimentId } = useParams();
  // the single chat session tab also has a sidebar. to conserve
  // horizontal space, we force the side nav to be collapsed in this tab
  const forceCollapsed = activeTab === ExperimentPageTabName.SingleChatSession;

  const isGenAIExperiment =
    experimentKind === ExperimentKind.GENAI_DEVELOPMENT || experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED;

  const { trainingRuns } = useExperimentEvaluationRunsData({
    experimentId: experimentId || '',
    enabled: isGenAIExperiment,
    filter: '', // not important in this case, we show the runs tab if there are any training runs
  });

  const hasTrainingRuns = trainingRuns?.length > 0;

  const sideNavConfig = useExperimentPageSideNavConfig({
    experimentKind,
    hasTrainingRuns,
  });

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
        borderRight: `1px solid ${theme.colors.border}`,
        boxSizing: 'content-box',
        width: SIDE_NAV_COLLAPSED_WIDTH,
        [`& .${COLLAPSED_CLASS_NAME}`]: {
          display: 'flex',
        },
        [`& .${FULL_WIDTH_CLASS_NAME}`]: {
          display: 'none',
        },
        ...(!forceCollapsed
          ? {
              [theme.responsive.mediaQueries.xl]: {
                width: SIDE_NAV_WIDTH,
                [`& .${COLLAPSED_CLASS_NAME}`]: {
                  display: 'none',
                },
                [`& .${FULL_WIDTH_CLASS_NAME}`]: {
                  display: 'flex',
                },
              },
            }
          : {}),
      }}
    >
      {Object.entries(sideNavConfig).map(([sectionKey, items]) => (
        <ExperimentPageSideNavSection
          key={sectionKey}
          activeTab={activeTab}
          sectionKey={sectionKey as ExperimentPageSideNavSectionKey}
          items={items}
        />
      ))}
    </div>
  );
};

export const ExperimentPageSideNavSkeleton = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
        borderRight: `1px solid ${theme.colors.border}`,
        width: SIDE_NAV_COLLAPSED_WIDTH,
        [theme.responsive.mediaQueries.xl]: {
          width: SIDE_NAV_WIDTH,
        },
      }}
    >
      <TitleSkeleton css={{ width: '60%' }} />
      <TitleSkeleton css={{ width: '80%' }} />
      <TitleSkeleton css={{ width: '70%' }} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageSideNavSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/side-nav/ExperimentPageSideNavSection.tsx
Signals: React

```typescript
import {
  DesignSystemEventProviderAnalyticsEventTypes,
  DesignSystemEventProviderComponentTypes,
  Tooltip,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import {
  COLLAPSED_CLASS_NAME,
  FULL_WIDTH_CLASS_NAME,
  getExperimentPageSideNavSectionLabel,
  type ExperimentPageSideNavItem,
  type ExperimentPageSideNavSectionKey,
} from './constants';
import { ExperimentPageTabName } from '../../../constants';
import { Link, useLocation, useParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import Routes from '@mlflow/mlflow/src/experiment-tracking/routes';
import invariant from 'invariant';
import { isTracesRelatedTab } from './utils';
import { useLogTelemetryEvent } from '@mlflow/mlflow/src/telemetry/hooks/useLogTelemetryEvent';
import { useMemo } from 'react';

export const ExperimentPageSideNavSection = ({
  sectionKey,
  activeTab,
  items,
}: {
  sectionKey: ExperimentPageSideNavSectionKey;
  activeTab: ExperimentPageTabName;
  items: ExperimentPageSideNavItem[];
}) => {
  const { theme } = useDesignSystemTheme();
  const { experimentId } = useParams();
  const { search } = useLocation();
  const logTelemetryEvent = useLogTelemetryEvent();
  const viewId = useMemo(() => crypto.randomUUID(), []);

  invariant(experimentId, 'Experiment ID must be defined');

  // NOTE: everything with `className={COLLAPSED_CLASS_NAME}` is hidden at
  // large screen sizes (browser's XL breakpoint). The`display` property is
  // controlled via media query in the parent component. This is why there are
  // seemingly duplicate elements in the code below.
  return (
    <div css={{ display: 'flex', flexDirection: 'column', marginBottom: theme.spacing.sm + theme.spacing.xs }}>
      {sectionKey !== 'top-level' && (
        <div
          css={{
            display: 'flex',
            marginBottom: theme.spacing.xs,
            position: 'relative',
            height: theme.typography.lineHeightBase,
          }}
        >
          <div
            className={COLLAPSED_CLASS_NAME}
            css={{
              border: 'none',
              borderBottom: `1px solid ${theme.colors.border}`,
              width: '100%',
              position: 'absolute',
              bottom: '50%',
            }}
          />
          <Typography.Text className={FULL_WIDTH_CLASS_NAME} size="sm" color="secondary">
            {getExperimentPageSideNavSectionLabel(sectionKey as ExperimentPageSideNavSectionKey)}
          </Typography.Text>
        </div>
      )}
      {items.map((item) => {
        // SingleChatSession is a special case because it's a nested tab
        const isActive =
          activeTab === ExperimentPageTabName.SingleChatSession
            ? item.tabName === ExperimentPageTabName.ChatSessions
            : activeTab === item.tabName;

        const preserveQueryParams = isTracesRelatedTab(activeTab) && isTracesRelatedTab(item.tabName);

        return (
          <Link
            key={`${sectionKey}-${item.tabName}`}
            to={{
              pathname: Routes.getExperimentPageTabRoute(experimentId, item.tabName),
              search: preserveQueryParams ? search : undefined,
            }}
            onClick={() =>
              logTelemetryEvent({
                componentId: item.componentId,
                componentViewId: viewId,
                componentType: DesignSystemEventProviderComponentTypes.TypographyLink,
                componentSubType: null,
                eventType: DesignSystemEventProviderAnalyticsEventTypes.OnClick,
              })
            }
          >
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                borderRadius: theme.borders.borderRadiusSm,
                cursor: 'pointer',
                backgroundColor: isActive ? theme.colors.actionDefaultBackgroundHover : undefined,
                color: isActive ? theme.colors.actionDefaultIconHover : theme.colors.actionDefaultIconDefault,
                height: theme.typography.lineHeightBase,
                boxSizing: 'content-box',
                ':hover': { backgroundColor: theme.colors.actionDefaultBackgroundHover },
              }}
            >
              <Tooltip
                componentId={`mlflow.experiment-page.side-nav.${sectionKey}.${item.tabName}.tooltip`}
                content={item.label}
                side="right"
                delayDuration={0}
              >
                <span className={COLLAPSED_CLASS_NAME}>{item.icon}</span>
              </Tooltip>
              <span className={FULL_WIDTH_CLASS_NAME}>{item.icon}</span>
              <Typography.Text className={FULL_WIDTH_CLASS_NAME} bold={isActive} color="primary">
                {item.label}
              </Typography.Text>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/side-nav/utils.tsx

```typescript
import { ExperimentPageTabName } from '../../../constants';

export const isTracesRelatedTab = (tabName: ExperimentPageTabName) => {
  return (
    tabName === ExperimentPageTabName.Traces ||
    tabName === ExperimentPageTabName.SingleChatSession ||
    tabName === ExperimentPageTabName.ChatSessions
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentRunsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-runs/ExperimentRunsPage.tsx

```typescript
// prettier-ignore
import {
  getExperimentApi,
  setCompareExperiments,
  setExperimentTagApi,
} from '../../actions';
import { GetExperimentsContextProvider } from '../../components/experiment-page/contexts/GetExperimentsContext';
import { ExperimentView } from '../../components/experiment-page/ExperimentView';

/**
 * Concrete actions for GetExperiments context
 */
const getExperimentActions = {
  setExperimentTagApi,
  getExperimentApi,
  setCompareExperiments,
};

const ExperimentRunsPage = () => (
  <GetExperimentsContextProvider actions={getExperimentActions}>
    <ExperimentView showHeader={false} />
  </GetExperimentsContextProvider>
);

export default ExperimentRunsPage;
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/api.ts

```typescript
import { fetchOrFail, getAjaxUrl } from '../../../common/utils/FetchUtils';
import { catchNetworkErrorIfExists } from '../../utils/NetworkUtils';
import type { ScorerConfig } from './types';

/**
 * Type for the registerScorer API response
 * Matches the protobuf definition in mlflow/protos/service.proto (RegisterScorer.Response)
 */
export interface RegisterScorerResponse {
  version: number;
  scorer_id: string;
  experiment_id: string;
  name: string;
  serialized_scorer: string;
  creation_time: number;
}

/**
 * Type for individual scorer entity in listScorers API response
 * Matches the protobuf definition in mlflow/protos/service.proto (Scorer message)
 */
export interface MLflowScorer {
  experiment_id: number;
  scorer_name: string;
  scorer_version: number;
  serialized_scorer: string;
  creation_time: number;
  scorer_id: string;
}

/**
 * Type for the listScorers API response
 * Matches the protobuf definition in mlflow/protos/service.proto (ListScorers.Response)
 */
export interface ListScorersResponse {
  scorers: MLflowScorer[];
}

/**
 * Get scheduled scorers for an experiment
 */
export async function listScheduledScorers(experimentId: string): Promise<ListScorersResponse> {
  const params = new URLSearchParams();
  params.append('experiment_id', experimentId);
  return fetchOrFail(getAjaxUrl(`ajax-api/3.0/mlflow/scorers/list?${params.toString()}`))
    .then((res) => res.json())
    .catch(catchNetworkErrorIfExists);
}

/**
 * Update scheduled scorers for an experiment
 */
export async function updateScheduledScorers(
  experimentId: string,
  scheduledScorers: {
    scorers: ScorerConfig[];
  },
  updateMask: string = 'scheduled_scorers.scorers',
) {
  return fetchOrFail(getAjaxUrl('ajax-api/3.0/mlflow/scorers/update'), {
    method: 'PATCH',
    body: JSON.stringify({
      experiment_id: experimentId,
      scheduled_scorers: scheduledScorers,
      update_mask: updateMask,
    }),
  })
    .then((res) => res.json())
    .catch(catchNetworkErrorIfExists);
}

/**
 * Create scheduled scorers for an experiment
 */
export async function createScheduledScorers(
  experimentId: string,
  scheduledScorers: {
    scorers: ScorerConfig[];
  },
) {
  return fetchOrFail(getAjaxUrl('ajax-api/3.0/mlflow/scorers/create'), {
    method: 'POST',
    body: JSON.stringify({
      experiment_id: experimentId,
      scheduled_scorers: scheduledScorers,
    }),
  })
    .then((res) => res.json())
    .catch(catchNetworkErrorIfExists);
}

/**
 * Register a single scorer for an experiment
 */
export async function registerScorer(experimentId: string, scorer: ScorerConfig): Promise<RegisterScorerResponse> {
  return fetchOrFail(getAjaxUrl('ajax-api/3.0/mlflow/scorers/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      experiment_id: experimentId,
      name: scorer.name,
      serialized_scorer: scorer.serialized_scorer,
    }),
  })
    .then((res) => res.json())
    .catch(catchNetworkErrorIfExists);
}

/**
 * Delete scheduled scorers for an experiment
 */
export async function deleteScheduledScorers(experimentId: string, scorerNames?: string[]) {
  const body: any = {
    experiment_id: experimentId,
  };

  // Add scorer name if provided to delete a specific scorer
  if (scorerNames && scorerNames.length > 0) {
    // Backend expects 'name' parameter for the scorer name
    body.name = scorerNames[0];
  }

  return fetchOrFail(getAjaxUrl('ajax-api/3.0/mlflow/scorers/delete'), {
    method: 'DELETE',
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch(catchNetworkErrorIfExists);
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/constants.ts

```typescript
export const COMPONENT_ID_PREFIX = 'mlflow.experiment-scorers';

export const SCORER_FORM_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
  DISPLAY: 'display',
} as const;

export type ScorerFormMode = typeof SCORER_FORM_MODE[keyof typeof SCORER_FORM_MODE];

export const DEFAULT_TRACE_COUNT = 10;

export const ASSESSMENT_NAME_TEMPLATE_MAPPING = {
  Correctness: 'correctness',
  RelevanceToQuery: 'relevance_to_query',
  RetrievalGroundedness: 'groundedness',
  RetrievalSufficiency: 'context_sufficiency',
  Safety: 'harmfulness',
  Guidelines: 'guidelines',
} as const;

export const SCORER_TYPE = {
  LLM: 'llm',
  CUSTOM_CODE: 'custom-code',
} as const;

export type ScorerType = typeof SCORER_TYPE[keyof typeof SCORER_TYPE];

export const BUTTON_VARIANT = {
  RUN: 'run',
  RERUN: 'rerun',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];

export const RETRIEVAL_ASSESSMENTS = ['groundedness', 'context_sufficiency'] as const;
```

--------------------------------------------------------------------------------

````
