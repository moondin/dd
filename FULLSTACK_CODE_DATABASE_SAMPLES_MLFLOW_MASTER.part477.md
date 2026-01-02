---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 477
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 477 of 991)

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

---[FILE: ExperimentViewInferredKindPopover.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewInferredKindPopover.tsx

```typescript
import { Button, CloseIcon, Popover, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import type { ExperimentKind } from '../../../../constants';
import { ExperimentKindDropdownLabels, ExperimentKindShortLabels } from '../../../../utils/ExperimentKindUtils';

export const ExperimentViewInferredKindPopover = ({
  children,
  inferredExperimentKind,
  onConfirm,
  onDismiss,
  isInferredKindEditable = false,
}: {
  children: React.ReactNode;
  inferredExperimentKind: ExperimentKind;
  onConfirm?: () => void;
  onDismiss?: () => void;
  isInferredKindEditable?: boolean;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'block', position: 'relative' }}>
      {children}
      <Popover.Root componentId="mlflow.experiment_view.header.experiment_kind_inference_popover" open modal={false}>
        <Popover.Trigger asChild>
          <div css={{ position: 'absolute', left: 0, bottom: 0, right: 0, height: 0 }} />
        </Popover.Trigger>
        <Popover.Content css>
          <Popover.Arrow />
          <div css={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm }}>
            <div css={{ flex: 1 }}>
              <Typography.Paragraph css={{ maxWidth: 300 }}>
                <FormattedMessage
                  defaultMessage="We've automatically detected the experiment type to be ''{kindLabel}''. {isEditable, select, true {You can either confirm or change the type.} other {}}"
                  description="Popover message for inferred experiment kind"
                  values={{
                    kindLabel: intl.formatMessage(ExperimentKindShortLabels[inferredExperimentKind]),
                    isEditable: isInferredKindEditable,
                  }}
                />
              </Typography.Paragraph>
              <Button
                componentId="mlflow.experiment_view.header.experiment_kind_inference_popover.confirm"
                onClick={onConfirm}
                type="primary"
                size="small"
              >
                <FormattedMessage
                  defaultMessage="Confirm"
                  description="Button label to confirm the inferred experiment kind"
                />
              </Button>
            </div>
            <Button
              componentId="mlflow.experiment_view.header.experiment_kind_inference_popover.dismiss"
              onClick={onDismiss}
              icon={<CloseIcon />}
              size="small"
            />
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewManagementMenu.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewManagementMenu.test.tsx
Signals: Redux/RTK

```typescript
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ExperimentViewManagementMenu } from './ExperimentViewManagementMenu';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { BrowserRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';
import type { ExperimentEntity } from '@mlflow/mlflow/src/experiment-tracking/types';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

describe('ExperimentViewManagementMenu', () => {
  const defaultExperiment: ExperimentEntity = {
    experimentId: '123',
    name: 'test/experiment/name',
    artifactLocation: 'file:/tmp/mlruns',
    lifecycleStage: 'active',
    allowedActions: ['RENAME', 'DELETE'],
    creationTime: 0,
    lastUpdateTime: 0,
    tags: [],
  };

  const renderTestComponent = (props: Partial<React.ComponentProps<typeof ExperimentViewManagementMenu>> = {}) => {
    const mockStore = configureStore([thunk, promiseMiddleware()]);
    const queryClient = new QueryClient();

    return render(<ExperimentViewManagementMenu experiment={defaultExperiment} {...props} />, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Provider
              store={mockStore({
                entities: {
                  experimentsById: {},
                },
              })}
            >
              <IntlProvider locale="en">
                <DesignSystemProvider>{children}</DesignSystemProvider>
              </IntlProvider>
            </Provider>
          </BrowserRouter>
        </QueryClientProvider>
      ),
    });
  };

  test('it should render the management menu with rename and delete buttons', async () => {
    renderTestComponent();

    // Check that the overflow menu trigger is present
    const menuTrigger = screen.getByTestId('overflow-menu-trigger');
    expect(menuTrigger).toBeInTheDocument();

    // Click the menu trigger to open the menu
    await userEvent.click(menuTrigger);

    // Check that rename and delete buttons are present
    expect(await screen.findByText('Rename')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('it should render the edit description button when setEditing is provided', async () => {
    const setEditing = jest.fn();
    renderTestComponent({ setEditing });

    // Click the menu trigger to open the menu
    const menuTrigger = screen.getByTestId('overflow-menu-trigger');
    await userEvent.click(menuTrigger);

    // Check that edit description button is present
    expect(await screen.findByText('Edit description')).toBeInTheDocument();
    expect(screen.getByText('Rename')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewManagementMenu.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewManagementMenu.tsx
Signals: React

```typescript
import React, { lazy, useCallback, useMemo, useState } from 'react';
import { Spinner, Typography } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import { OverflowMenu } from '../../../../../shared/building_blocks/PageHeader';
import type { ExperimentEntity } from '../../../../types';
import {
  canModifyExperiment,
  getExperimentType,
  isExperimentTypeDefault,
  isRepoNotebookExperiment,
  isExperimentTypeNotebook,
} from '../../utils/experimentPage.common-utils';
import { getShareFeedbackOverflowMenuItem } from './ExperimentViewHeader.utils';
import { getExperimentKindFromTags } from '../../../../utils/ExperimentKindUtils';
import { ExperimentKind } from '../../../../constants';
import { useNavigate } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import Routes from '@mlflow/mlflow/src/experiment-tracking/routes';
import { DeleteExperimentModal } from '../../../modals/DeleteExperimentModal';
import { RenameExperimentModal } from '../../../modals/RenameExperimentModal';
import { useInvalidateExperimentList } from '../../hooks/useExperimentListQuery';
import { shouldEnableExperimentPageSideTabs } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

/**
 * Experiment page header part responsible for displaying menu
 * with rename and delete buttons
 */
export const ExperimentViewManagementMenu = ({
  experiment,
  setEditing,
  baseComponentId = 'mlflow.experiment_page.managementMenu',
  refetchExperiment,
}: {
  experiment: ExperimentEntity;
  setEditing?: (editing: boolean) => void;
  baseComponentId?: string;
  refetchExperiment?: () => Promise<unknown>;
}) => {
  const [showRenameExperimentModal, setShowRenameExperimentModal] = useState(false);
  const [showDeleteExperimentModal, setShowDeleteExperimentModal] = useState(false);
  const invalidateExperimentList = useInvalidateExperimentList();
  const navigate = useNavigate();

  return (
    <>
      <OverflowMenu
        menu={[
          ...(setEditing
            ? [
                {
                  id: 'edit-description',
                  itemName: (
                    <Typography.Text>
                      <FormattedMessage
                        defaultMessage="Edit description"
                        description="Text for edit description button on experiment view page header"
                      />
                    </Typography.Text>
                  ),
                  onClick: () => setEditing?.(true),
                },
              ]
            : []),
          {
            id: 'rename',
            itemName: (
              <FormattedMessage
                defaultMessage="Rename"
                description="Text for rename button on the experiment view page header"
              />
            ),
            onClick: () => setShowRenameExperimentModal(true),
          },
          {
            id: 'delete',
            itemName: (
              <FormattedMessage
                defaultMessage="Delete"
                description="Text for delete button on the experiment view page header"
              />
            ),
            onClick: () => setShowDeleteExperimentModal(true),
          },
        ]}
      />
      <RenameExperimentModal
        experimentId={experiment.experimentId}
        experimentName={experiment.name}
        isOpen={showRenameExperimentModal}
        onClose={() => setShowRenameExperimentModal(false)}
        onExperimentRenamed={invalidateExperimentList}
      />
      <DeleteExperimentModal
        experimentId={experiment.experimentId}
        experimentName={experiment.name}
        isOpen={showDeleteExperimentModal}
        onClose={() => setShowDeleteExperimentModal(false)}
        onExperimentDeleted={() => {
          invalidateExperimentList();
          navigate(Routes.experimentsObservatoryRoute);
        }}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TabSelectorBar.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/tab-selector-bar/TabSelectorBar.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { TabSelectorBar } from './TabSelectorBar';
import { MemoryRouter, useParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { useExperimentPageViewMode } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageViewMode';
import type { ExperimentViewRunsCompareMode } from '@mlflow/mlflow/src/experiment-tracking/types';
import { IntlProvider } from 'react-intl';
import { shouldEnablePromptsTabOnDBPlatform } from '../../../../../../common/utils/FeatureUtils';

import { ExperimentKind } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { DesignSystemProvider } from '@databricks/design-system';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

const queryClient = new QueryClient();

// Mock the hooks
jest.mock('@mlflow/mlflow/src/common/utils/RoutingUtils', () => ({
  ...jest.requireActual<typeof import('@mlflow/mlflow/src/common/utils/RoutingUtils')>(
    '@mlflow/mlflow/src/common/utils/RoutingUtils',
  ),
  useParams: jest.fn(),
}));

jest.mock('@mlflow/mlflow/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageViewMode', () => ({
  useExperimentPageViewMode: jest.fn(),
}));

jest.mock(
  '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/hooks/useExperimentEvaluationRunsData',
  () => ({
    useExperimentEvaluationRunsData: jest.fn().mockReturnValue({
      data: [],
      trainingRuns: [],
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    }),
  }),
);

jest.mock('../../../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../../../common/utils/FeatureUtils')>(
    '../../../../../../common/utils/FeatureUtils',
  ),
  shouldEnablePromptsTabOnDBPlatform: jest.fn(),
}));

const mockShouldEnablePromptsTabOnDBPlatform = jest.mocked(shouldEnablePromptsTabOnDBPlatform);

describe('TabSelectorBar', () => {
  const mockUseParams = jest.mocked(useParams);
  const mockUseExperimentPageViewMode = jest.mocked(useExperimentPageViewMode);

  const renderComponent = (props = {}) => {
    return render(<TabSelectorBar {...props} />, {
      wrapper: ({ children }) => (
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <IntlProvider locale="en">{children}</IntlProvider>
            </MemoryRouter>
          </QueryClientProvider>
        </DesignSystemProvider>
      ),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockShouldEnablePromptsTabOnDBPlatform.mockReturnValue(false);
  });

  test('renders with default props without exploding', () => {
    mockUseParams.mockReturnValue({
      experimentId: '123',
      tabName: 'models',
    });

    mockUseExperimentPageViewMode.mockReturnValue(['MODELS' as ExperimentViewRunsCompareMode, jest.fn()]);

    renderComponent();

    expect(screen.getByTestId('tab-selector-button-text-models-active')).toBeInTheDocument();
  });

  test('highlights active tab correctly', () => {
    // mock being on the models page
    mockUseParams.mockReturnValue({
      experimentId: '123',
      tabName: 'models',
    });
    mockUseExperimentPageViewMode.mockReturnValue(['MODELS' as ExperimentViewRunsCompareMode, jest.fn()]);
    const { rerender } = renderComponent();
    const activeButton1 = screen.getByTestId('tab-selector-button-text-models-active');
    expect(activeButton1).toBeInTheDocument();

    // mock being on the runs page
    mockUseParams.mockReturnValue({
      experimentId: '123',
      tabName: 'runs',
    });

    rerender(<TabSelectorBar />);
    const activeButton2 = screen.getByTestId('tab-selector-button-text-runs-active');
    expect(activeButton2).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TabSelectorBar.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/tab-selector-bar/TabSelectorBar.tsx
Signals: React

```typescript
import React from 'react';
import {
  SegmentedControlGroup,
  SegmentedControlButton,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';

import { ExperimentKind, ExperimentPageTabName } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { useExperimentPageViewMode } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageViewMode';
import { useExperimentEvaluationRunsData } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/hooks/useExperimentEvaluationRunsData';
import { Link, useParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { coerceToEnum } from '@databricks/web-shared/utils';
import { shouldEnablePromptsTabOnDBPlatform } from '../../../../../../common/utils/FeatureUtils';
import type { TabConfigMap } from './TabSelectorBarConstants';
import {
  getGenAIExperimentTabConfigMap,
  getGenAIExperimentWithPromptsTabConfigMap,
  CustomExperimentTabConfigMap,
  DefaultTabConfigMap,
} from './TabSelectorBarConstants';
import { FormattedMessage } from 'react-intl';
import { useGetExperimentPageActiveTabByRoute } from '../../../hooks/useGetExperimentPageActiveTabByRoute';

const isRunsViewTab = (tabName: string) => ['TABLE', 'CHART', 'ARTIFACT'].includes(tabName);
const iTracesViewTab = (tabName: string) => ['TRACES'].includes(tabName);

const getExperimentTabsConfig = (experimentKind?: ExperimentKind, hasTrainingRuns = false): TabConfigMap => {
  switch (experimentKind) {
    case ExperimentKind.GENAI_DEVELOPMENT:
    case ExperimentKind.GENAI_DEVELOPMENT_INFERRED:
      return shouldEnablePromptsTabOnDBPlatform()
        ? getGenAIExperimentWithPromptsTabConfigMap({ includeRunsTab: hasTrainingRuns })
        : getGenAIExperimentTabConfigMap({ includeRunsTab: hasTrainingRuns });
    case ExperimentKind.CUSTOM_MODEL_DEVELOPMENT:
    case ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED:
    case ExperimentKind.FORECASTING:
    case ExperimentKind.REGRESSION:
    case ExperimentKind.AUTOML:
    case ExperimentKind.CLASSIFICATION:
      return CustomExperimentTabConfigMap;
    default:
      return DefaultTabConfigMap;
  }
};

export const TabSelectorBar = ({ experimentKind }: { experimentKind?: ExperimentKind }) => {
  const { experimentId, tabName } = useParams();
  const { theme } = useDesignSystemTheme();
  const [viewMode] = useExperimentPageViewMode();

  const isGenAIExperiment =
    experimentKind === ExperimentKind.GENAI_DEVELOPMENT || experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED;

  const { trainingRuns } = useExperimentEvaluationRunsData({
    experimentId: experimentId || '',
    enabled: isGenAIExperiment,
    filter: '', // not important in this case, we show the runs tab if there are any training runs
  });

  // In the tab selector bar, we're interested in top-level tab names based on the current route
  const { topLevelTabName: tabNameFromRoute } = useGetExperimentPageActiveTabByRoute();

  let tabNameFromParams = coerceToEnum(ExperimentPageTabName, tabName, undefined);
  if (tabNameFromParams === ExperimentPageTabName.Datasets) {
    // datasets is a sub-tab of evaluation runs, so we
    // should show the evaluation runs tab as active
    tabNameFromParams = ExperimentPageTabName.EvaluationRuns;
  }
  if (tabNameFromParams === ExperimentPageTabName.LabelingSchemas) {
    // labeling schemas is a sub-tab of labeling sessions, so we
    // should show the labeling sessions tab as active
    tabNameFromParams = ExperimentPageTabName.LabelingSessions;
  }

  const tabNameFromViewMode = (() => {
    if (isRunsViewTab(viewMode)) {
      return ExperimentPageTabName.Runs;
    } else if (iTracesViewTab(viewMode)) {
      return ExperimentPageTabName.Traces;
    } else {
      return viewMode;
    }
  })();

  const activeTab = tabNameFromRoute ?? tabNameFromParams ?? tabNameFromViewMode;

  const hasTrainingRuns = trainingRuns?.length > 0;
  const tabsConfig = getExperimentTabsConfig(
    experimentKind ?? ExperimentKind.NO_INFERRED_TYPE,
    isGenAIExperiment && hasTrainingRuns,
  );

  return (
    <SegmentedControlGroup
      value={activeTab}
      name="tab-toggle-bar"
      componentId="mlflow.experiment-tracking.tab-toggle-bar"
      newStyleFlagOverride
      css={{
        justifySelf: 'center',
        [theme.responsive.mediaQueries.xl]: {
          '& .tab-icon-text': {
            display: 'inline-flex',
          },
          '& .tab-icon-with-tooltip': {
            display: 'none',
          },
        },
      }}
    >
      {Object.entries(tabsConfig).map(([tabName, tabConfig]) => {
        const isActive = tabName === activeTab;

        return (
          <React.Fragment key={tabName}>
            <Link
              css={{ display: 'none' }}
              className="tab-icon-text"
              key={`${tabName}-text`}
              to={tabConfig.getRoute(experimentId ?? '')}
            >
              <SegmentedControlButton
                data-testid={`tab-selector-button-text-${tabName}-${isActive ? 'active' : 'inactive'}`}
                className="tab-icon-text"
                value={tabName}
                icon={tabConfig.icon}
              >
                <span>{tabConfig.label}</span>
              </SegmentedControlButton>
            </Link>
            <Link
              className="tab-icon-with-tooltip"
              key={`${tabName}-tooltip`}
              to={tabConfig.getRoute(experimentId ?? '')}
            >
              <SegmentedControlButton
                data-testid={`tab-selector-button-icon-${tabName}-${isActive ? 'active' : 'inactive'}`}
                className="tab-icon-with-tooltip"
                value={tabName}
                icon={
                  <Tooltip
                    delayDuration={0}
                    content={
                      <span>
                        {/* comment for formatting */}
                        {tabConfig.label}
                      </span>
                    }
                    componentId={`mlflow.experiment-tracking.tab-selector-bar.${tabName}`}
                  >
                    <span>{tabConfig.icon}</span>
                  </Tooltip>
                }
              />
            </Link>
          </React.Fragment>
        );
      })}
    </SegmentedControlGroup>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TabSelectorBarConstants.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/tab-selector-bar/TabSelectorBarConstants.tsx

```typescript
import Routes from '@mlflow/mlflow/src/experiment-tracking/routes';

import {
  GearIcon,
  GavelIcon,
  ListBorderIcon,
  ListIcon,
  ModelsIcon,
  PlusMinusSquareIcon,
  UserIcon,
  TextBoxIcon,
} from '@databricks/design-system';
import { ExperimentPageTabName } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { FormattedMessage } from 'react-intl';
import type { ExperimentViewRunsCompareMode } from '@mlflow/mlflow/src/experiment-tracking/types';
import { enableScorersUI } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

export type TabConfig = {
  label: React.ReactNode;
  icon: React.ReactNode;
  getRoute: (experimentId: string) => string;
};

export type TabConfigMap = Partial<Record<ExperimentViewRunsCompareMode | ExperimentPageTabName, TabConfig>>;

const RunsTabConfig = {
  label: (
    <FormattedMessage defaultMessage="Runs" description="Label for the runs tab in the MLflow experiment navbar" />
  ),
  icon: <ListIcon />,
  getRoute: (experimentId: string) => Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Runs),
};

const TracesTabConfig = {
  label: (
    <FormattedMessage defaultMessage="Traces" description="Label for the traces tab in the MLflow experiment navbar" />
  ),
  icon: <ListBorderIcon />,
  getRoute: (experimentId: string) => Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Traces),
};

const EvaluationsTabConfig = {
  label: (
    <FormattedMessage
      defaultMessage="Evaluations"
      description="Label for the evaluations tab in the MLflow experiment navbar"
    />
  ),
  icon: <PlusMinusSquareIcon />,
  getRoute: (experimentId: string) =>
    Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.EvaluationRuns),
};

const ModelsTabConfig = {
  label: (
    <FormattedMessage
      defaultMessage="Versions"
      description="Label for the logged models tab in the MLflow experiment navbar"
    />
  ),
  icon: <ModelsIcon />,
  getRoute: (experimentId: string) => Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Models),
};
const ScorersTabConfig = {
  label: (
    <FormattedMessage defaultMessage="Judges" description="Label for the judges tab in the MLflow experiment navbar" />
  ),
  icon: <GavelIcon />,
  getRoute: (experimentId: string) => Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Judges),
};

export type GenAIExperimentTabConfigMapProps = {
  includeRunsTab?: boolean;
};

export const getGenAIExperimentTabConfigMap = ({
  includeRunsTab = false,
}: GenAIExperimentTabConfigMapProps = {}): TabConfigMap => ({
  ...(includeRunsTab && { [ExperimentPageTabName.Runs]: RunsTabConfig }),
  [ExperimentPageTabName.Traces]: TracesTabConfig,
  [ExperimentPageTabName.EvaluationRuns]: EvaluationsTabConfig,
  [ExperimentPageTabName.Models]: ModelsTabConfig,
  ...(enableScorersUI() && { [ExperimentPageTabName.Judges]: ScorersTabConfig }),
});

export const getGenAIExperimentWithPromptsTabConfigMap = ({
  includeRunsTab = false,
}: GenAIExperimentTabConfigMapProps = {}): TabConfigMap => ({
  ...(includeRunsTab && { [ExperimentPageTabName.Runs]: RunsTabConfig }),
  [ExperimentPageTabName.Traces]: TracesTabConfig,
  [ExperimentPageTabName.Models]: ModelsTabConfig,
  ...(enableScorersUI() && { [ExperimentPageTabName.Judges]: ScorersTabConfig }),
});

export const GenAIExperimentWithPromptsTabConfigMap = getGenAIExperimentTabConfigMap();

export const CustomExperimentTabConfigMap: TabConfigMap = {
  [ExperimentPageTabName.Runs]: RunsTabConfig,
  [ExperimentPageTabName.Models]: {
    ...ModelsTabConfig,
    label: (
      <FormattedMessage
        defaultMessage="Models"
        description="Label for the logged models tab in the MLflow experiment navbar"
      />
    ),
  },
  [ExperimentPageTabName.Traces]: TracesTabConfig,
  ...(enableScorersUI() && { [ExperimentPageTabName.Judges]: ScorersTabConfig }),
};

export const DefaultTabConfigMap: TabConfigMap = {
  ...CustomExperimentTabConfigMap,
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetDigest.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetDigest.tsx

```typescript
import { Typography } from '@databricks/design-system';
import type { RunDatasetWithTags } from '../../../../types';
import { FormattedMessage } from 'react-intl';

export const ExperimentViewDatasetDigest = ({ datasetWithTags }: { datasetWithTags: RunDatasetWithTags }) => {
  const { dataset } = datasetWithTags;
  return (
    <Typography.Hint>
      <FormattedMessage
        defaultMessage="Digest: {digest}"
        description="Experiment dataset drawer > digest > label and value"
        values={{ digest: <code>{dataset.digest}</code> }}
      />
    </Typography.Hint>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetDrawer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetDrawer.test.tsx

```typescript
import { jest, describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { act, render, screen } from '../../../../../common/utils/TestUtils.react18';
import type { RunDatasetWithTags } from '../../../../types';
import { DatasetSourceTypes } from '../../../../types';
import { ExperimentViewDatasetDrawer } from './ExperimentViewDatasetDrawer';
import { DesignSystemProvider } from '@databricks/design-system';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import userEvent from '@testing-library/user-event';
import { MockedReduxStoreProvider } from '../../../../../common/utils/TestUtils';

const httpDataset = {
  sourceType: DatasetSourceTypes.HTTP,
  profile: 'null',
  digest: 'abcdef',
  name: 'test_dataset_name',
  schema: '{}',
  source: '{"url":"http://test.com/something.csv"}',
};

const s3Dataset = {
  sourceType: DatasetSourceTypes.S3,
  profile: 'null',
  digest: 'abcdef',
  name: 'test_dataset_name',
  schema: '{}',
  source: '{"uri":"s3://some-bucket/hello"}',
};

const huggingFaceDataset = {
  sourceType: DatasetSourceTypes.HUGGING_FACE,
  profile: 'null',
  digest: 'abcdef',
  name: 'test_dataset_name',
  schema: '{}',
  source: '{"path":"databricks/databricks-dolly-15k"}',
};

describe('ExperimentViewDatasetDrawer', () => {
  let navigatorClipboard: Clipboard;

  // Prepare fake clipboard
  beforeAll(() => {
    navigatorClipboard = navigator.clipboard;
    (navigator.clipboard as any) = { writeText: jest.fn() };
  });

  // Cleanup and restore clipboard
  afterAll(() => {
    (navigator.clipboard as any) = navigatorClipboard;
  });

  const renderTestComponent = ({ dataset }: { dataset: RunDatasetWithTags['dataset'] }) => {
    return render(
      <ExperimentViewDatasetDrawer
        isOpen
        setIsOpen={() => {}}
        selectedDatasetWithRun={{
          datasetWithTags: {
            dataset,
            tags: [],
          },
          runData: {
            runUuid: 'runUuid',
            datasets: [],
          },
        }}
        setSelectedDatasetWithRun={() => {}}
      />,
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <MemoryRouter>
              <MockedReduxStoreProvider state={{ entities: { colorByRunUuid: {} } }}>
                <DesignSystemProvider>{children}</DesignSystemProvider>
              </MockedReduxStoreProvider>
            </MemoryRouter>
          </IntlProvider>
        ),
      },
    );
  };
  test('it renders HTTP dataset source type', () => {
    renderTestComponent({ dataset: httpDataset });
    expect(screen.getByText('Source type: HTTP')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'http://test.com/something.csv' })).toBeInTheDocument();
  });

  test('it renders S3 dataset source type', async () => {
    renderTestComponent({ dataset: s3Dataset });
    expect(screen.getByText('Source type: S3')).toBeInTheDocument();
    const copyButton = screen.getByRole('button', { name: /Copy S3 URI/ });
    expect(copyButton).toBeInTheDocument();
    await userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('s3://some-bucket/hello');
  });

  test('it renders Hugging Face dataset source type', () => {
    renderTestComponent({ dataset: huggingFaceDataset });
    expect(screen.getByText('Source type: Hugging Face')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://huggingface.co/datasets/databricks/databricks-dolly-15k' }),
    ).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````
