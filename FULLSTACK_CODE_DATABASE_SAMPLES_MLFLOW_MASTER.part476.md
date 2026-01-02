---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 476
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 476 of 991)

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

---[FILE: ExperimentGetShareLinkModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentGetShareLinkModal.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { GenericSkeleton, Input, Modal } from '@databricks/design-system';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../../../redux-types';
import { setExperimentTagApi } from '../../../../actions';
import Routes from '../../../../routes';
import { CopyButton } from '../../../../../shared/building_blocks/CopyButton';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { getStringSHA256, textCompressDeflate } from '../../../../../common/utils/StringUtils';
import Utils from '../../../../../common/utils/Utils';
import {
  EXPERIMENT_PAGE_VIEW_STATE_SHARE_TAG_PREFIX,
  EXPERIMENT_PAGE_VIEW_STATE_SHARE_URL_PARAM_KEY,
} from '../../../../constants';
import { shouldUseCompressedExperimentViewSharedState } from '../../../../../common/utils/FeatureUtils';
import {
  EXPERIMENT_PAGE_VIEW_MODE_QUERY_PARAM_KEY,
  useExperimentPageViewMode,
} from '../../hooks/useExperimentPageViewMode';
import type { ExperimentViewRunsCompareMode } from '../../../../types';

type GetShareLinkModalProps = {
  onCancel: () => void;
  visible: boolean;
  experimentIds: string[];
  searchFacetsState: ExperimentPageSearchFacetsState;
  uiState: ExperimentPageUIState;
};

type ShareableViewState = ExperimentPageSearchFacetsState & ExperimentPageUIState;

// Typescript-based test to ensure that the keys of the two states are disjoint.
// If they are not disjoint, the state serialization will not work as expected.
const _arePersistedStatesDisjoint: [
  keyof ExperimentPageSearchFacetsState & keyof ExperimentPageUIState extends never ? true : false,
] = [true];

const serializePersistedState = async (state: ShareableViewState) => {
  if (shouldUseCompressedExperimentViewSharedState()) {
    return textCompressDeflate(JSON.stringify(state));
  }
  return JSON.stringify(state);
};

const getShareableUrl = (experimentId: string, shareStateHash: string, viewMode?: ExperimentViewRunsCompareMode) => {
  // As a start, get the route
  const route = Routes.getExperimentPageRoute(experimentId);

  // Begin building the query params
  const queryParams = new URLSearchParams();

  // Add the share state hash
  queryParams.set(EXPERIMENT_PAGE_VIEW_STATE_SHARE_URL_PARAM_KEY, shareStateHash);

  // If the view mode is set, add it to the query params
  if (viewMode) {
    queryParams.set(EXPERIMENT_PAGE_VIEW_MODE_QUERY_PARAM_KEY, viewMode);
  }

  // In regular implementation, build the hash part of the URL
  const params = queryParams.toString();
  const hashParam = `${route}${params?.startsWith('?') ? '' : '?'}${params}`;
  const shareURL = `${window.location.origin}${window.location.pathname}#${hashParam}`;
  return shareURL;
};

/**
 * Modal that displays shareable link for the experiment page.
 * The shareable state is created by serializing the search facets and UI state and storing
 * it as a tag on the experiment.
 */
export const ExperimentGetShareLinkModal = ({
  onCancel,
  visible,
  experimentIds,
  searchFacetsState,
  uiState,
}: GetShareLinkModalProps) => {
  const [sharedStateUrl, setSharedStateUrl] = useState<string>('');
  const [linkInProgress, setLinkInProgress] = useState(true);
  const [generatedState, setGeneratedState] = useState<ShareableViewState | null>(null);
  const [viewMode] = useExperimentPageViewMode();

  const dispatch = useDispatch<ThunkDispatch>();

  const stateToSerialize = useMemo(() => ({ ...searchFacetsState, ...uiState }), [searchFacetsState, uiState]);

  const createSerializedState = useCallback(
    async (state: ShareableViewState) => {
      if (experimentIds.length > 1) {
        setLinkInProgress(false);
        setGeneratedState(state);
        setSharedStateUrl(window.location.href);
        return;
      }
      setLinkInProgress(true);
      const [experimentId] = experimentIds;
      try {
        const data = await serializePersistedState(state);
        const hash = await getStringSHA256(data);

        const tagName = `${EXPERIMENT_PAGE_VIEW_STATE_SHARE_TAG_PREFIX}${hash}`;

        await dispatch(setExperimentTagApi(experimentId, tagName, data));

        setLinkInProgress(false);
        setGeneratedState(state);

        setSharedStateUrl(getShareableUrl(experimentId, hash, viewMode));
      } catch (e) {
        Utils.logErrorAndNotifyUser('Failed to create shareable link for experiment');
        throw e;
      }
    },
    [dispatch, experimentIds, viewMode],
  );

  useEffect(() => {
    if (!visible || generatedState === stateToSerialize) {
      return;
    }
    createSerializedState(stateToSerialize);
  }, [visible, createSerializedState, generatedState, stateToSerialize]);

  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_header_experimentgetsharelinkmodal.tsx_101"
      title={
        <FormattedMessage
          defaultMessage="Get shareable link"
          description='Title text for the experiment "Get link" modal'
        />
      }
      visible={visible}
      onCancel={onCancel}
    >
      <div css={{ display: 'flex', gap: 8 }}>
        {linkInProgress ? (
          <GenericSkeleton css={{ flex: 1 }} />
        ) : (
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_header_experimentgetsharelinkmodal.tsx_115"
            placeholder="Click button on the right to create shareable state"
            value={sharedStateUrl}
            readOnly
          />
        )}
        <CopyButton loading={linkInProgress} copyText={sharedStateUrl} data-testid="share-link-copy-button" />
      </div>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewCopyArtifactLocation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewCopyArtifactLocation.tsx

```typescript
import { CopyIcon, Typography } from '@databricks/design-system';
import { useIntl } from 'react-intl';
import type { ExperimentEntity } from '../../../../types';

/**
 * Experiment page header part responsible for copying
 * the artifact location after clicking on the icon
 */
export const ExperimentViewCopyArtifactLocation = ({ experiment }: { experiment: ExperimentEntity }) => {
  const intl = useIntl();

  return (
    <Typography.Text
      size="md"
      dangerouslySetAntdProps={{
        copyable: {
          text: experiment.artifactLocation,
          icon: <CopyIcon />,
          tooltips: [
            intl.formatMessage({
              defaultMessage: 'Copy artifact location',
              description: 'Copy tooltip to copy experiment artifact location from experiment runs table header',
            }),
            intl.formatMessage({
              defaultMessage: 'Artifact location copied',
              description: 'Tooltip displayed after experiment artifact location was successfully copied to clipboard',
            }),
          ],
        },
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewCopyExperimentId.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewCopyExperimentId.tsx

```typescript
import { CopyIcon, Typography } from '@databricks/design-system';
import { useIntl } from 'react-intl';
import type { ExperimentEntity } from '../../../../types';

/**
 * Experiment page header part responsible for copying
 * the experimentId after clicking on the icon
 */
export const ExperimentViewCopyExperimentId = ({ experiment }: { experiment: ExperimentEntity }) => {
  const intl = useIntl();

  return (
    <Typography.Text
      size="md"
      dangerouslySetAntdProps={{
        copyable: {
          text: experiment.experimentId,
          icon: <CopyIcon />,
          tooltips: [
            intl.formatMessage({
              defaultMessage: 'Copy experiment id',
              description: 'Copy tooltip to copy experiment id from experiment runs table header',
            }),
            intl.formatMessage({
              defaultMessage: 'Experiment id copied',
              description: 'Tooltip displayed after experiment id was successfully copied to clipboard',
            }),
          ],
        },
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewCopyTitle.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewCopyTitle.tsx

```typescript
import { CopyIcon, Typography } from '@databricks/design-system';
import { useIntl } from 'react-intl';
import type { ExperimentEntity } from '../../../../types';

/**
 * Experiment page header part responsible for copying
 * the title after clicking on the icon
 */
export const ExperimentViewCopyTitle = ({
  experiment,
  size,
}: {
  experiment: ExperimentEntity;
  size: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const intl = useIntl();

  return (
    <Typography.Text
      size={size}
      dangerouslySetAntdProps={{
        copyable: {
          text: experiment.name,
          icon: <CopyIcon />,
          tooltips: [
            intl.formatMessage({
              defaultMessage: 'Copy path',
              description: 'Copy tooltip to copy experiment path from experiment runs table header',
            }),
            intl.formatMessage({
              defaultMessage: 'Path copied',
              description: 'Tooltip displayed after experiment path was successfully copied to clipboard',
            }),
          ],
        },
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeader.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeader.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { ExperimentViewHeader, ExperimentViewHeaderSkeleton } from './ExperimentViewHeader';
import { renderWithIntl, act, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { ExperimentEntity } from '@mlflow/mlflow/src/experiment-tracking/types';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';
import { BrowserRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

jest.mock('@databricks/design-system', () => {
  const actual = jest.requireActual<typeof import('@databricks/design-system')>('@databricks/design-system');
  const MockBreadcrumb = ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>;
  const MockBreadcrumbItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return {
    ...actual,
    Breadcrumb: Object.assign(MockBreadcrumb, { Item: MockBreadcrumbItem }),
  };
});

describe('ExperimentViewHeader', () => {
  const defaultExperiment: ExperimentEntity = {
    experimentId: '123',
    name: 'test/experiment/name',
    artifactLocation: 'file:/tmp/mlruns',
    lifecycleStage: 'active',
    allowedActions: [],
    creationTime: 0,
    lastUpdateTime: 0,
    tags: [],
  };

  const setEditing = jest.fn();

  const renderComponent = (experiment = defaultExperiment) => {
    const mockStore = configureStore([thunk, promiseMiddleware()]);
    const queryClient = new QueryClient();

    return renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DesignSystemProvider>
            <Provider
              store={mockStore({
                entities: {
                  experimentsById: {},
                },
              })}
            >
              <ExperimentViewHeader experiment={experiment} setEditing={setEditing} />
            </Provider>
          </DesignSystemProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    );
  };

  describe('rendering', () => {
    beforeEach(async () => {
      await act(async () => {
        renderComponent();
      });
    });

    it('displays the last part of the experiment name', () => {
      expect(screen.getByText('name')).toBeInTheDocument();
    });

    it('shows info tooltip with experiment details', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Info' }));

      const tooltip = await screen.findByTestId('experiment-view-header-info-tooltip-content');
      expect(tooltip).toHaveTextContent('Path: test/experiment/name');
      expect(tooltip).toHaveTextContent('Experiment ID: 123');
      expect(tooltip).toHaveTextContent('Artifact Location: file:/tmp/mlruns');
    });

    it('displays share and management buttons', () => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(screen.getByTestId('overflow-menu-trigger')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeader.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';
import {
  ArrowLeftIcon,
  BeakerIcon,
  Breadcrumb,
  Button,
  InfoBookIcon,
  ParagraphSkeleton,
  TitleSkeleton,
  Tooltip,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../../../common/utils/RoutingUtils';
import Routes from '../../../../routes';
import { ExperimentViewCopyTitle } from './ExperimentViewCopyTitle';
import type { ExperimentEntity } from '../../../../types';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { ExperimentViewArtifactLocation } from '../ExperimentViewArtifactLocation';
import { ExperimentViewCopyExperimentId } from './ExperimentViewCopyExperimentId';
import { ExperimentViewCopyArtifactLocation } from './ExperimentViewCopyArtifactLocation';
import { InfoPopover } from '@databricks/design-system';
import { TabSelectorBar } from './tab-selector-bar/TabSelectorBar';
import { ExperimentViewHeaderShareButton } from './ExperimentViewHeaderShareButton';
import { getExperimentKindFromTags, isGenAIExperimentKind } from '../../../../utils/ExperimentKindUtils';
import { ExperimentViewManagementMenu } from './ExperimentViewManagementMenu';
import { shouldEnableExperimentPageSideTabs } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

import { ExperimentKind } from '../../../../constants';

const getDocLinkHref = (experimentKind: ExperimentKind) => {
  if (isGenAIExperimentKind(experimentKind)) {
    return 'https://mlflow.org/docs/latest/genai/?rel=mlflow_ui';
  }
  return 'https://mlflow.org/docs/latest/ml/getting-started/?rel=mlflow_ui';
};

/**
 * Header for a single experiment page. Displays title, breadcrumbs and provides
 * controls for renaming, deleting and editing permissions.
 */
export const ExperimentViewHeader = React.memo(
  ({
    experiment,
    inferredExperimentKind,
    searchFacetsState,
    uiState,
    setEditing,
    experimentKindSelector,
    refetchExperiment,
  }: {
    experiment: ExperimentEntity;
    inferredExperimentKind?: ExperimentKind;
    searchFacetsState?: ExperimentPageSearchFacetsState;
    uiState?: ExperimentPageUIState;
    setEditing: (editing: boolean) => void;
    experimentKindSelector?: React.ReactNode;
    refetchExperiment?: () => Promise<unknown>;
  }) => {
    const { theme } = useDesignSystemTheme();
    const breadcrumbs: React.ReactNode[] = useMemo(
      () => [
        // eslint-disable-next-line react/jsx-key
        <Link to={Routes.experimentsObservatoryRoute} data-testid="experiment-observatory-link">
          <FormattedMessage
            defaultMessage="Experiments"
            description="Breadcrumb nav item to link to the list of experiments page"
          />
        </Link>,
      ],
      [],
    );
    const experimentIds = useMemo(() => (experiment ? [experiment?.experimentId] : []), [experiment]);

    // Extract the last part of the experiment name
    const normalizedExperimentName = useMemo(() => experiment.name.split('/').pop(), [experiment.name]);

    const getInfoTooltip = () => {
      return (
        <div style={{ display: 'flex', marginRight: theme.spacing.sm }}>
          <InfoPopover iconTitle="Info">
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.xs,
                flexWrap: 'nowrap',
              }}
              data-testid="experiment-view-header-info-tooltip-content"
            >
              <div style={{ whiteSpace: 'nowrap' }}>
                <FormattedMessage
                  defaultMessage="Path"
                  description="Label for displaying the current experiment path"
                />
                : {experiment.name + ' '}
                <ExperimentViewCopyTitle experiment={experiment} size="md" />
              </div>
              <div style={{ whiteSpace: 'nowrap' }}>
                <FormattedMessage
                  defaultMessage="Experiment ID"
                  description="Label for displaying the current experiment in view"
                />
                : {experiment.experimentId + ' '}
                <ExperimentViewCopyExperimentId experiment={experiment} />
              </div>
              <div style={{ whiteSpace: 'nowrap' }}>
                <FormattedMessage
                  defaultMessage="Artifact Location"
                  description="Label for displaying the experiment artifact location"
                />
                : <ExperimentViewArtifactLocation artifactLocation={experiment.artifactLocation} />{' '}
                <ExperimentViewCopyArtifactLocation experiment={experiment} />
              </div>
            </div>
          </InfoPopover>
        </div>
      );
    };

    const experimentKind = inferredExperimentKind ?? getExperimentKindFromTags(experiment.tags);
    const docLinkHref = getDocLinkHref(experimentKind ?? ExperimentKind.NO_INFERRED_TYPE);

    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
          marginBottom: shouldEnableExperimentPageSideTabs() ? theme.spacing.xs : theme.spacing.sm,
        }}
      >
        {!shouldEnableExperimentPageSideTabs() && (
          <Breadcrumb includeTrailingCaret>
            {breadcrumbs.map((breadcrumb, index) => (
              <Breadcrumb.Item key={index}>{breadcrumb}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: shouldEnableExperimentPageSideTabs() ? '1fr auto auto' : '1fr 1fr 1fr',
          }}
        >
          <div
            css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center', overflow: 'hidden', minWidth: 250 }}
          >
            {shouldEnableExperimentPageSideTabs() && (
              <>
                <Link to={Routes.experimentsObservatoryRoute}>
                  <Button
                    componentId="mlflow.experiment-page.header.back-icon-button"
                    type="tertiary"
                    icon={<ArrowLeftIcon />}
                  />
                </Link>
                <div
                  css={{
                    borderRadius: theme.borders.borderRadiusSm,
                    backgroundColor: theme.colors.backgroundSecondary,
                    padding: theme.spacing.sm,
                  }}
                >
                  <BeakerIcon />
                </div>
              </>
            )}
            <Tooltip
              content={normalizedExperimentName}
              componentId="mlflow.experiment_view.header.experiment-name-tooltip"
            >
              <span
                css={{
                  maxWidth: '100%',
                  overflow: 'hidden',
                }}
              >
                <Typography.Title
                  withoutMargins
                  level={2}
                  css={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {normalizedExperimentName}
                </Typography.Title>
              </span>
            </Tooltip>
            {experimentKindSelector}
            {getInfoTooltip()}
          </div>
          {shouldEnableExperimentPageSideTabs() ? <div /> : <TabSelectorBar experimentKind={experimentKind} />}
          <div
            css={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end', marginLeft: theme.spacing.sm }}
          >
            {shouldEnableExperimentPageSideTabs() && (
              <ExperimentViewManagementMenu
                experiment={experiment}
                setEditing={setEditing}
                refetchExperiment={refetchExperiment}
              />
            )}
            <ExperimentViewHeaderShareButton
              type={shouldEnableExperimentPageSideTabs() ? undefined : 'primary'}
              experimentIds={experimentIds}
              searchFacetsState={searchFacetsState}
              uiState={uiState}
            />
            {shouldEnableExperimentPageSideTabs() && (
              <Typography.Link
                componentId="mlflow.experiment-page.header.docs-link"
                href={docLinkHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button componentId="mlflow.experiment-page.header.docs-link-button" icon={<InfoBookIcon />}>
                  <FormattedMessage
                    defaultMessage="View docs"
                    description="Text for docs link button on experiment view page header"
                  />
                </Button>
              </Typography.Link>
            )}
            {!shouldEnableExperimentPageSideTabs() && (
              <ExperimentViewManagementMenu
                experiment={experiment}
                setEditing={setEditing}
                refetchExperiment={refetchExperiment}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

export function ExperimentViewHeaderSkeleton() {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
      <ParagraphSkeleton css={{ width: 100 }} loading />
      <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <TitleSkeleton css={{ width: 150, height: theme.general.heightSm }} loading />
        <TitleSkeleton css={{ height: theme.general.heightSm, alignSelf: 'center' }} loading />
        <TitleSkeleton css={{ width: theme.spacing.lg, height: theme.general.heightSm, alignSelf: 'right' }} loading />
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeader.utils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeader.utils.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { getShareFeedbackOverflowMenuItem } from './ExperimentViewHeader.utils';

describe('getShareFeedbackOverflowMenuItem', () => {
  // minimal test to satisfy knip
  it('returns an object with the correct structure', () => {
    const result = getShareFeedbackOverflowMenuItem();
    expect(result).toBeDefined();
    expect(result.id).toBe('feedback');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeader.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeader.utils.tsx

```typescript
import { FormattedMessage } from 'react-intl';
import { EXPERIMENT_PAGE_FEEDBACK_URL } from '@mlflow/mlflow/src/experiment-tracking/constants';

export const getShareFeedbackOverflowMenuItem = () => {
  return {
    id: 'feedback',
    itemName: (
      <FormattedMessage
        defaultMessage="Send Feedback"
        description="Text for provide feedback button on experiment view page header"
      />
    ),
    href: EXPERIMENT_PAGE_FEEDBACK_URL,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeaderCompare.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeaderCompare.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from '../../../../../shared/building_blocks/PageHeader';
import { ExperimentViewHeaderShareButton } from './ExperimentViewHeaderShareButton';
import type { ExperimentEntity } from '../../../../types';
import { Link } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import Routes from '@mlflow/mlflow/src/experiment-tracking/routes';

/**
 * Header for experiment compare page. Displays title and breadcrumbs.
 */
export const ExperimentViewHeaderCompare = React.memo(({ experiments }: { experiments: ExperimentEntity[] }) => {
  const pageTitle = useMemo(
    () => (
      <FormattedMessage
        defaultMessage="Displaying Runs from {numExperiments} Experiments"
        description="Message shown when displaying runs from multiple experiments"
        values={{
          numExperiments: experiments.length,
        }}
      />
    ),
    [experiments.length],
  );

  const breadcrumbs = useMemo(
    () => [
      <Link
        key={Routes.experimentsObservatoryRoute}
        to={Routes.experimentsObservatoryRoute}
        data-testid="experiment-observatory-link"
      >
        <FormattedMessage
          defaultMessage="Experiments"
          description="Breadcrumb nav item to link to the list of experiments page"
        />
      </Link>,
    ],
    [],
  );

  return (
    <PageHeader title={pageTitle} breadcrumbs={breadcrumbs}>
      <ExperimentViewHeaderShareButton />
    </PageHeader>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeaderKindSelector.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeaderKindSelector.test.tsx

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { ExperimentKind } from '../../../../constants';
import { ExperimentViewHeaderKindSelector } from './ExperimentViewHeaderKindSelector';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider, DesignSystemThemeProvider } from '@databricks/design-system';

describe('ExperimentViewHeaderKindSelector', () => {
  const renderTestComponent = (props: Partial<React.ComponentProps<typeof ExperimentViewHeaderKindSelector>> = {}) => {
    return render(
      <ExperimentViewHeaderKindSelector
        value={ExperimentKind.NO_INFERRED_TYPE}
        onChange={jest.fn()}
        isUpdating={false}
        readOnly={false}
        {...props}
      />,
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <DesignSystemProvider>{children}</DesignSystemProvider>
          </IntlProvider>
        ),
      },
    );
  };

  test('it should render the component in edit mode', async () => {
    const onChange = jest.fn();
    const { getByText, findByText } = renderTestComponent({
      value: ExperimentKind.CUSTOM_MODEL_DEVELOPMENT,
      onChange,
    });
    expect(getByText('Machine learning')).toBeInTheDocument();

    await userEvent.click(getByText('Machine learning'));

    await userEvent.click(await findByText('GenAI apps & agents'));

    expect(onChange).toHaveBeenCalledWith(ExperimentKind.GENAI_DEVELOPMENT);
  });

  test('it should render the component in read only mode', async () => {
    const { getByText, getByRole } = renderTestComponent({
      value: ExperimentKind.CUSTOM_MODEL_DEVELOPMENT,
      readOnly: true,
    });
    expect(getByText('Machine learning')).toBeInTheDocument();

    // No dropdown menu for the tag element
    expect(getByRole('status')).not.toHaveAttribute('aria-haspopup');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeaderKindSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeaderKindSelector.tsx
Signals: React

```typescript
import { ChevronDownIcon, DropdownMenu, Popover, Spinner, Tag, Tooltip } from '@databricks/design-system';
import { coerceToEnum } from '@databricks/web-shared/utils';
import { entries } from 'lodash';
import { useMemo, useState } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import { ExperimentKind } from '../../../../constants';
import {
  ExperimentKindDropdownLabels,
  getSelectableExperimentKinds,
  isEditableExperimentKind,
  normalizeInferredExperimentKind,
} from '../../../../utils/ExperimentKindUtils';
import { ExperimentViewInferredKindPopover } from './ExperimentViewInferredKindPopover';

const getVisibleLabel = (kind: ExperimentKind, readOnly: boolean) => {
  if (kind === ExperimentKind.NO_INFERRED_TYPE || kind === ExperimentKind.EMPTY) {
    if (readOnly) {
      // if the user does not have permission to edit the experiment kind, we show the "None" label
      return ExperimentKindDropdownLabels[ExperimentKind.NO_INFERRED_TYPE];
    }
    return defineMessage({
      defaultMessage: 'Select a type',
      description: 'Label for the experiment type selector in the experiment view header',
    });
  }
  return ExperimentKindDropdownLabels[kind];
};

export const ExperimentViewHeaderKindSelector = ({
  value,
  inferredExperimentKind,
  onChange,
  isUpdating,
  readOnly = false,
}: {
  value?: ExperimentKind;
  inferredExperimentKind?: ExperimentKind;
  onChange?: (kind: ExperimentKind) => void;
  isUpdating?: boolean;
  readOnly?: boolean;
}) => {
  const dropdownItems = useMemo(
    () =>
      entries(ExperimentKindDropdownLabels).filter(([key]) =>
        getSelectableExperimentKinds().includes(key as ExperimentKind),
      ),
    [],
  );

  const currentValue = useMemo(() => {
    if (inferredExperimentKind) {
      return normalizeInferredExperimentKind(inferredExperimentKind);
    }
    return coerceToEnum(ExperimentKind, value, ExperimentKind.NO_INFERRED_TYPE);
  }, [value, inferredExperimentKind]);

  const visibleLabel = getVisibleLabel(currentValue, readOnly);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [displayInferencePopover, setDisplayInferencePopover] = useState(
    Boolean(inferredExperimentKind && !readOnly && isEditableExperimentKind(inferredExperimentKind)),
  );

  // Determines if we should render a dropdown or just a tag.
  const usingDropdown = isEditableExperimentKind(currentValue) && !readOnly;

  const tagElement = (
    <Tag
      icon={isUpdating ? <Spinner size="small" /> : null}
      componentId="mlflow.experiment_view.header.experiment_kind_selector"
      css={{ marginRight: 0 }}
      // Empty callback so <Tag /> renders its "clickable" UI style
      onClick={!usingDropdown ? undefined : () => {}}
    >
      {visibleLabel && <FormattedMessage {...visibleLabel} />} {usingDropdown && <ChevronDownIcon />}
    </Tag>
  );

  const tagElementWithTooltip = (
    // If we're using read-only tag, we need to wrap it in a span so <Tooltip> won't facilitate clickable style
    <ExperimentTypeTooltip>{usingDropdown ? tagElement : <span>{tagElement}</span>}</ExperimentTypeTooltip>
  );

  if (readOnly) {
    return tagElementWithTooltip;
  }

  const dropdownElement = (
    <DropdownMenu.Root
      modal={false}
      open={dropdownOpen}
      onOpenChange={(open) => {
        setDisplayInferencePopover(false);
        setDropdownOpen(open);
      }}
    >
      {/* Mixing dropdown with tooltip requires different ordering */}
      <ExperimentTypeTooltip>
        <DropdownMenu.Trigger asChild>{tagElement}</DropdownMenu.Trigger>
      </ExperimentTypeTooltip>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Arrow />
        <DropdownMenu.Label>
          <FormattedMessage
            defaultMessage="Experiment type"
            description="Label for the experiment type selector in the experiment view header"
          />
        </DropdownMenu.Label>
        {dropdownItems.map(([key, label]) => {
          const isSelected = key === currentValue;
          return (
            <DropdownMenu.CheckboxItem
              key={key}
              componentId={`mlflow.experiment_view.header.experiment_kind_selector.${key}`}
              onClick={() => onChange?.(key as ExperimentKind)}
              checked={isSelected}
            >
              <DropdownMenu.ItemIndicator />
              <FormattedMessage {...label} />
            </DropdownMenu.CheckboxItem>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  if (displayInferencePopover && inferredExperimentKind) {
    return (
      <ExperimentViewInferredKindPopover
        inferredExperimentKind={inferredExperimentKind}
        onConfirm={async () => {
          if (inferredExperimentKind) {
            onChange?.(normalizeInferredExperimentKind(inferredExperimentKind));
          }
          setDisplayInferencePopover(false);
        }}
        onDismiss={() => setDisplayInferencePopover(false)}
        isInferredKindEditable={isEditableExperimentKind(currentValue)}
      >
        {usingDropdown ? dropdownElement : tagElementWithTooltip}
      </ExperimentViewInferredKindPopover>
    );
  }

  return usingDropdown ? dropdownElement : tagElementWithTooltip;
};

const ExperimentTypeTooltip = ({ children }: { children: React.ReactNode }) => (
  <Tooltip
    componentId="mlflow.experiment_view.header.experiment_kind_selector.tooltip"
    content={
      <FormattedMessage
        defaultMessage="Experiment type"
        description="Label for the experiment type selector in the experiment view header"
      />
    }
  >
    {children}
  </Tooltip>
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewHeaderShareButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewHeaderShareButton.tsx
Signals: React

```typescript
import { Button } from '@databricks/design-system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { GetLinkModal } from '../../../modals/GetLinkModal';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { ExperimentGetShareLinkModal } from './ExperimentGetShareLinkModal';

/**
 * Experiment page header part responsible for displaying button
 * that displays modal for sharing the link
 */
export const ExperimentViewHeaderShareButton = ({
  searchFacetsState,
  uiState,
  experimentIds,
  type,
}: {
  searchFacetsState?: ExperimentPageSearchFacetsState;
  uiState?: ExperimentPageUIState;
  experimentIds?: string[];
  type?: 'primary' | 'link' | 'tertiary';
}) => {
  const [showGetLinkModal, setShowGetLinkModal] = useState(false);

  return (
    <>
      {searchFacetsState && uiState && experimentIds ? (
        <ExperimentGetShareLinkModal
          searchFacetsState={searchFacetsState}
          uiState={uiState}
          visible={showGetLinkModal}
          onCancel={() => setShowGetLinkModal(false)}
          experimentIds={experimentIds}
        />
      ) : (
        <GetLinkModal
          link={window.location.href}
          visible={showGetLinkModal}
          onCancel={() => setShowGetLinkModal(false)}
        />
      )}
      {/* TODO: ensure that E2E tests are working after refactor is complete */}
      <Button
        componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_header_experimentviewheadersharebutton.tsx_44"
        type={type}
        onClick={() => setShowGetLinkModal(true)}
        data-testid="share-button"
      >
        <FormattedMessage defaultMessage="Share" description="Text for share button on experiment view page header" />
      </Button>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewInferredKindModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentViewInferredKindModal.tsx
Signals: React

```typescript
import { Modal, Radio, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExperimentKind } from '../../../../constants';
import { ExperimentKindDropdownLabels } from '../../../../utils/ExperimentKindUtils';

export const ExperimentViewInferredKindModal = ({
  onDismiss,
  onConfirm,
}: {
  onDismiss?: () => void;
  onConfirm: (kind: ExperimentKind) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const [selectedKind, setSelectedKind] = useState<ExperimentKind>(ExperimentKind.CUSTOM_MODEL_DEVELOPMENT);

  return (
    <Modal
      visible
      componentId="mlflow.experiment_view.header.experiment_kind_inference_modal"
      onCancel={onDismiss}
      title={
        <FormattedMessage
          defaultMessage="Choose experiment type"
          description="A title for the modal displayed when the experiment type could not be inferred"
        />
      }
      cancelText={
        <FormattedMessage
          defaultMessage="I'll choose later"
          description="A label for the dismissal button in the modal displayed when the experiment type could not be inferred"
        />
      }
      okText={
        <FormattedMessage
          defaultMessage="Confirm"
          description="A label for the confirmation button in the modal displayed when the experiment type could not be inferred"
        />
      }
      onOk={() => onConfirm(selectedKind)}
    >
      <Typography.Paragraph>
        <FormattedMessage
          defaultMessage="We support multiple experiment types, each with its own set of features. Please select the type you'd like to use. You can change this later if needed."
          description="Popover message displayed when the experiment type could not not inferred"
        />
      </Typography.Paragraph>
      <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
        <Radio
          checked={selectedKind === ExperimentKind.GENAI_DEVELOPMENT}
          onChange={() => setSelectedKind(ExperimentKind.GENAI_DEVELOPMENT)}
        >
          <FormattedMessage {...ExperimentKindDropdownLabels[ExperimentKind.GENAI_DEVELOPMENT]} />
        </Radio>
        <Radio
          checked={selectedKind === ExperimentKind.CUSTOM_MODEL_DEVELOPMENT}
          onChange={() => setSelectedKind(ExperimentKind.CUSTOM_MODEL_DEVELOPMENT)}
        >
          <FormattedMessage {...ExperimentKindDropdownLabels[ExperimentKind.CUSTOM_MODEL_DEVELOPMENT]} />
        </Radio>
      </div>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

````
