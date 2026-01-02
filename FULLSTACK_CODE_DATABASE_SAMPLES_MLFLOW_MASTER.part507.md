---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 507
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 507 of 991)

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

---[FILE: RunViewHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewHeader.tsx
Signals: React

```typescript
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../common/utils/RoutingUtils';
import { OverflowMenu, PageHeader } from '../../../shared/building_blocks/PageHeader';
import Routes, { PageId as ExperimentTrackingPageId } from '../../routes';
import type { ExperimentEntity } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { RunViewModeSwitch } from './RunViewModeSwitch';
import Utils from '../../../common/utils/Utils';
import { RunViewHeaderRegisterModelButton } from './RunViewHeaderRegisterModelButton';
import type { UseGetRunQueryResponseExperiment, UseGetRunQueryResponseOutputs } from './hooks/useGetRunQuery';
import type { RunPageModelVersionSummary } from './hooks/useUnifiedRegisteredModelVersionsSummariesForRun';
import { ExperimentKind } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { Button, Icon, useDesignSystemTheme } from '@databricks/design-system';
import { RunIcon } from './assets/RunIcon';
import { ExperimentPageTabName } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { EXPERIMENT_KIND_TAG_KEY } from '../../utils/ExperimentKindUtils';
import { useMemo } from 'react';
const RunViewHeaderIcon = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 6,
        borderRadius: theme.spacing.lg,
      }}
    >
      <Icon component={RunIcon} css={{ display: 'flex', color: theme.colors.textSecondary }} />
    </div>
  );
};

/**
 * Run details page header component, common for all page view modes
 */
export const RunViewHeader = ({
  hasComparedExperimentsBefore,
  comparedExperimentIds = [],
  experiment,
  runDisplayName,
  runTags,
  runParams,
  runUuid,
  runOutputs,
  handleRenameRunClick,
  handleDeleteRunClick,
  artifactRootUri,
  registeredModelVersionSummaries,
  isLoading,
}: {
  hasComparedExperimentsBefore?: boolean;
  comparedExperimentIds?: string[];
  runDisplayName: string;
  runUuid: string;
  runOutputs?: UseGetRunQueryResponseOutputs | null;
  runTags: Record<string, KeyValueEntity>;
  runParams: Record<string, KeyValueEntity>;
  experiment: ExperimentEntity | UseGetRunQueryResponseExperiment;
  handleRenameRunClick: () => void;
  handleDeleteRunClick?: () => void;
  artifactRootUri?: string;
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
  isLoading?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  const shouldRouteToEvaluations = useMemo(() => {
    const isGenAIExperiment =
      experiment.tags?.find((tag) => tag.key === EXPERIMENT_KIND_TAG_KEY)?.value === ExperimentKind.GENAI_DEVELOPMENT;
    const hasModelOutputs = runOutputs && runOutputs.modelOutputs ? runOutputs.modelOutputs.length > 0 : false;
    return isGenAIExperiment && !hasModelOutputs;
  }, [experiment, runOutputs]);

  const experimentPageTabRoute = Routes.getExperimentPageTabRoute(
    experiment.experimentId ?? '',
    shouldRouteToEvaluations ? ExperimentPageTabName.EvaluationRuns : ExperimentPageTabName.Runs,
  );

  function getExperimentPageLink() {
    return hasComparedExperimentsBefore && comparedExperimentIds ? (
      <Link to={Routes.getCompareExperimentsPageRoute(comparedExperimentIds)}>
        <FormattedMessage
          defaultMessage="Displaying Runs from {numExperiments} Experiments"
          // eslint-disable-next-line max-len
          description="Breadcrumb nav item to link to the compare-experiments page on compare runs page"
          values={{
            numExperiments: comparedExperimentIds.length,
          }}
        />
      </Link>
    ) : (
      <Link to={experimentPageTabRoute} data-testid="experiment-runs-link">
        {experiment.name}
      </Link>
    );
  }

  const breadcrumbs = [getExperimentPageLink()];
  if (experiment.experimentId) {
    breadcrumbs.push(
      <Link to={experimentPageTabRoute} data-testid="experiment-observatory-link-runs">
        {shouldRouteToEvaluations ? (
          <FormattedMessage
            defaultMessage="Evaluations"
            description="Breadcrumb nav item to link to the evaluations tab on the parent experiment"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Runs"
            description="Breadcrumb nav item to link to the runs tab on the parent experiment"
          />
        )}
      </Link>,
    );
  }

  const renderRegisterModelButton = () => {
    return (
      <RunViewHeaderRegisterModelButton
        runUuid={runUuid}
        experimentId={experiment?.experimentId ?? ''}
        runTags={runTags}
        artifactRootUri={artifactRootUri}
        registeredModelVersionSummaries={registeredModelVersionSummaries}
      />
    );
  };

  return (
    <div css={{ flexShrink: 0 }}>
      <PageHeader
        title={
          <span css={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <RunViewHeaderIcon />
            <span data-testid="runs-header">{runDisplayName}</span>
          </span>
        }
        breadcrumbs={breadcrumbs}
        /* prettier-ignore */
      >
        <OverflowMenu
          menu={[
            {
              id: 'overflow-rename-button',
              onClick: handleRenameRunClick,
              itemName: (
                <FormattedMessage defaultMessage="Rename" description="Menu item to rename an experiment run" />
              ),
            },
            ...(handleDeleteRunClick
              ? [
                  {
                    id: 'overflow-delete-button',
                    onClick: handleDeleteRunClick,
                    itemName: (
                      <FormattedMessage defaultMessage="Delete" description="Menu item to delete an experiment run" />
                    ),
                  },
                ]
              : []),
          ]}
        />

        {renderRegisterModelButton()}
      </PageHeader>
      <RunViewModeSwitch runTags={runTags} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewHeaderRegisterFromLoggedModelV3Button.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewHeaderRegisterFromLoggedModelV3Button.tsx
Signals: React

```typescript
import { Button, ChevronDownIcon, DropdownMenu, NewWindowIcon, useDesignSystemTheme } from '@databricks/design-system';
import { first } from 'lodash';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../common/utils/RoutingUtils';
import { RegisterModel } from '../../../model-registry/components/RegisterModel';
import Routes from '../../routes';
import type { LoggedModelProto } from '../../types';

/**
 * A specialized variant of the "Register model" button intended for the run page,
 * which uses logged models from IAv3.
 */
export const RunViewHeaderRegisterFromLoggedModelV3Button = ({
  runUuid,
  experimentId,
  loggedModels,
}: {
  runUuid: string;
  experimentId: string;
  loggedModels: LoggedModelProto[];
}) => {
  const { theme } = useDesignSystemTheme();

  const [selectedModelToRegister, setSelectedModelToRegister] = useState<LoggedModelProto | null>(null);

  const singleModel = first(loggedModels);

  if (loggedModels.length > 1) {
    return (
      <>
        {selectedModelToRegister?.info?.artifact_uri && (
          <RegisterModel
            runUuid={runUuid}
            modelPath={selectedModelToRegister.info.artifact_uri}
            loggedModelId={selectedModelToRegister.info.model_id}
            modelRelativePath=""
            disabled={false}
            showButton={false}
            modalVisible
            onCloseModal={() => setSelectedModelToRegister(null)}
          />
        )}
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button
              componentId="mlflow.run_details.header.register_model_from_logged_model.button"
              type="primary"
              endIcon={<ChevronDownIcon />}
            >
              <FormattedMessage
                defaultMessage="Register model"
                description="Label for a CTA button for registering a ML model version from a logged model"
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {loggedModels.map((model) => {
              return (
                <DropdownMenu.Item
                  componentId="mlflow.run_details.header.register_model_from_logged_model.dropdown_menu_item"
                  onClick={() => setSelectedModelToRegister(model)}
                  key={model.info?.model_id}
                >
                  <div css={{ marginRight: theme.spacing.md }}>{model.info?.name}</div>
                  <DropdownMenu.HintColumn>
                    <Link
                      target="_blank"
                      to={Routes.getExperimentLoggedModelDetailsPage(experimentId, model.info?.model_id ?? '')}
                    >
                      <Button
                        componentId="mlflow.run_details.header.register_model_from_logged_model.dropdown_menu_item.view_model_button"
                        type="link"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        endIcon={<NewWindowIcon />}
                      >
                        <FormattedMessage
                          defaultMessage="View model"
                          description="Label for a button that opens a new tab to view the details of a logged ML model while registering a model version"
                        />
                      </Button>
                    </Link>
                  </DropdownMenu.HintColumn>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </>
    );
  }

  if (!singleModel || !singleModel.info?.artifact_uri) {
    return null;
  }

  return (
    <RegisterModel
      disabled={false}
      runUuid={runUuid}
      modelPath={singleModel.info.artifact_uri}
      loggedModelId={singleModel.info.model_id}
      modelRelativePath=""
      showButton
      buttonType="primary"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewHeaderRegisterModelButton.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewHeaderRegisterModelButton.intg.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { openDropdownMenu } from '@databricks/design-system/test-utils/rtl';
import { MemoryRouter } from '../../../common/utils/RoutingUtils';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import Utils from '../../../common/utils/Utils';
import type { ReduxState } from '../../../redux-types';
import { RunViewHeaderRegisterModelButton } from './RunViewHeaderRegisterModelButton';
import { DesignSystemProvider, DesignSystemThemeProvider } from '@databricks/design-system';
import userEvent from '@testing-library/user-event';
import { createModelVersionApi, createRegisteredModelApi } from '../../../model-registry/actions';
import type { KeyValueEntity } from '../../../common/types';

jest.mock('../../../model-registry/actions', () => ({
  searchRegisteredModelsApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
  createRegisteredModelApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
  createModelVersionApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
  searchModelVersionsApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
  getWorkspaceModelRegistryDisabledSettingApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
}));
const runUuid = 'testRunUuid';
const experimentId = 'testExperimentId';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larger timeout for integration testing

describe('RunViewHeaderRegisterModelButton integration', () => {
  const mountComponent = ({
    entities = {},
    tags = {},
    artifactRootUri,
  }: {
    artifactRootUri?: string;
    tags?: Record<string, KeyValueEntity>;
    entities?: Partial<Pick<ReduxState['entities'], 'modelVersionsByRunUuid'>>;
  } = {}) => {
    renderWithIntl(
      <MemoryRouter>
        <DesignSystemProvider>
          <MockedReduxStoreProvider
            state={{
              entities: {
                modelVersionsByRunUuid: {},
                modelByName: { 'existing-model': { name: 'existing-model', version: '1' } },
                ...entities,
              },
            }}
          >
            <div data-testid="container">
              <RunViewHeaderRegisterModelButton
                runTags={tags}
                artifactRootUri={artifactRootUri}
                runUuid={runUuid}
                experimentId={experimentId}
                registeredModelVersionSummaries={[]}
              />
            </div>
          </MockedReduxStoreProvider>
        </DesignSystemProvider>
      </MemoryRouter>,
    );
  };

  test('should render button and dropdown for multiple models, at least one unregistered and attempt to register a model', async () => {
    mountComponent({
      artifactRootUri: 'file://some/artifact/path',
      entities: {
        modelVersionsByRunUuid: {
          [runUuid]: [
            {
              source: `file://some/artifact/path/artifact_path`,
              version: '7',
              name: 'test-model',
            },
          ] as any,
        },
      },
      tags: {
        [Utils.loggedModelsTag]: {
          key: Utils.loggedModelsTag,
          value: JSON.stringify([
            {
              artifact_path: 'artifact_path',
              signature: {
                inputs: '[]',
                outputs: '[]',
                params: null,
              },
              flavors: {},
              run_id: runUuid,
              model_uuid: 12345,
            },
            {
              artifact_path: 'another_artifact_path',
              signature: {
                inputs: '[]',
                outputs: '[]',
                params: null,
              },
              flavors: {},
              run_id: runUuid,
              model_uuid: 12345,
            },
          ]),
        },
      },
    });

    await userEvent.type(screen.getByRole('button', { name: 'Register model' }), '{arrowdown}');

    await userEvent.click(screen.getByRole('menuitem', { name: /^another_artifact_path/ }));
    await userEvent.click(screen.getByText('Select a model'));

    await userEvent.click(screen.getByText('Create New Model'));

    await userEvent.click(screen.getByPlaceholderText('Input a model name'));
    await userEvent.paste('a-new-model');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(createRegisteredModelApi).toHaveBeenCalledWith('a-new-model', expect.anything());
    expect(createModelVersionApi).toHaveBeenCalledWith(
      'a-new-model',
      'runs:/testRunUuid/another_artifact_path',
      'testRunUuid',
      [],
      expect.anything(),
      undefined,
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewHeaderRegisterModelButton.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewHeaderRegisterModelButton.test.tsx

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { MemoryRouter, createMLflowRoutePath } from '../../../common/utils/RoutingUtils';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { renderWithIntl, act, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import Utils from '../../../common/utils/Utils';
import { RunViewHeaderRegisterModelButton } from './RunViewHeaderRegisterModelButton';
import { DesignSystemProvider } from '@databricks/design-system';
import type { KeyValueEntity } from '../../../common/types';
import userEvent from '@testing-library/user-event';
import type { RunPageModelVersionSummary } from './hooks/useUnifiedRegisteredModelVersionsSummariesForRun';

jest.mock('../../../model-registry/actions', () => ({
  searchRegisteredModelsApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
  getWorkspaceModelRegistryDisabledSettingApi: jest.fn(() => ({ type: 'MOCKED_ACTION', payload: Promise.resolve() })),
}));

const runUuid = 'testRunUuid';
const experimentId = 'testExperimentId';

const createModelArtifact = (artifactPath = 'random_forest_model') => ({
  artifact_path: artifactPath,
  signature: {
    inputs: '[]',
    outputs: '[]',
    params: null,
  },
  flavors: {},
  run_id: runUuid,
  model_uuid: 12345,
});

const createLoggedModelHistoryTag = (models: ReturnType<typeof createModelArtifact>[]) =>
  ({
    key: Utils.loggedModelsTag,
    value: JSON.stringify(models),
  } as any);

describe('RunViewHeaderRegisterModelButton', () => {
  const mountComponent = ({
    tags = {},
    artifactRootUri,
    registeredModelVersionSummaries = [],
  }: {
    artifactRootUri?: string;
    tags?: Record<string, KeyValueEntity>;
    registeredModelVersionSummaries?: RunPageModelVersionSummary[];
  } = {}) => {
    renderWithIntl(
      <MemoryRouter>
        <DesignSystemProvider>
          <MockedReduxStoreProvider
            state={{
              entities: {
                modelVersionsByRunUuid: {},
              },
            }}
          >
            <div data-testid="container">
              <RunViewHeaderRegisterModelButton
                artifactRootUri={artifactRootUri}
                runTags={tags}
                runUuid={runUuid}
                experimentId={experimentId}
                registeredModelVersionSummaries={registeredModelVersionSummaries}
              />
            </div>
          </MockedReduxStoreProvider>
        </DesignSystemProvider>
      </MemoryRouter>,
    );
  };
  test('should render nothing when there are no logged models', () => {
    mountComponent();
    expect(screen.getByTestId('container')).toBeEmptyDOMElement();
  });

  test('should render button for a single unregistered logged model', () => {
    mountComponent({
      tags: {
        [Utils.loggedModelsTag]: createLoggedModelHistoryTag([createModelArtifact()]),
      },
    });
    expect(screen.getByRole('button', { name: 'Register model' })).toBeInTheDocument();
  });

  test('should render simple link for a single registered logged model', () => {
    mountComponent({
      registeredModelVersionSummaries: [
        {
          displayedName: 'test-model',
          version: '7',
          link: createMLflowRoutePath('/models/test-model/versions/7'),
          status: 'READY',
          source: 'file://some/artifact/path/artifact_path',
        },
      ],
      artifactRootUri: 'file://some/artifact/path',
      tags: {
        [Utils.loggedModelsTag]: createLoggedModelHistoryTag([createModelArtifact('artifact_path')]),
      },
    });
    expect(screen.queryByRole('button', { name: 'Register model' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Model registered' })).toHaveAttribute(
      'href',
      createMLflowRoutePath('/models/test-model/versions/7'),
    );
  });

  test('should render button and dropdown for multiple models, all unregistered', async () => {
    mountComponent({
      tags: {
        [Utils.loggedModelsTag]: createLoggedModelHistoryTag([
          createModelArtifact('artifact_path'),
          createModelArtifact('another_artifact_path'),
        ]),
      },
    });
    expect(screen.getByRole('button', { name: 'Register model' })).toBeInTheDocument();

    await userEvent.type(screen.getByRole('button', { name: 'Register model' }), '{arrowdown}');

    expect(screen.getByText('Unregistered models')).toBeInTheDocument();
    expect(screen.queryByText('Registered models')).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^artifact_path/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^another_artifact_path/ })).toBeInTheDocument();
  });

  test('should render button and dropdown for multiple models, at least one unregistered', async () => {
    mountComponent({
      registeredModelVersionSummaries: [
        {
          displayedName: 'test-model',
          version: '7',
          link: createMLflowRoutePath('/models/test-model/versions/7'),
          status: '',
          source: 'file://some/artifact/path/artifact_path',
        },
      ],
      artifactRootUri: 'file://some/artifact/path',
      tags: {
        [Utils.loggedModelsTag]: createLoggedModelHistoryTag([
          createModelArtifact('artifact_path'),
          createModelArtifact('another_artifact_path'),
        ]),
      },
    });

    expect(screen.getByRole('button', { name: 'Register model' })).toBeInTheDocument();

    await userEvent.type(screen.getByRole('button', { name: 'Register model' }), '{arrowdown}');

    expect(screen.getByText('Unregistered models')).toBeInTheDocument();
    expect(screen.getByText('Registered models')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^another_artifact_path/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^test-model v7/ })).toBeInTheDocument();
  });

  test('should render button and dropdown for multiple models, all already registered', async () => {
    mountComponent({
      registeredModelVersionSummaries: [
        {
          displayedName: 'test-model',
          version: '7',
          link: createMLflowRoutePath('/models/test-model/versions/7'),
          status: '',
          source: 'file://some/artifact/path/artifact_path',
        },
        {
          displayedName: 'another-test-model',
          version: '8',
          link: createMLflowRoutePath('/models/another-test-model/versions/8'),
          status: '',
          source: 'file://some/artifact/path/another_artifact_path',
        },
      ],
      artifactRootUri: 'file://some/artifact/path',
      tags: {
        [Utils.loggedModelsTag]: createLoggedModelHistoryTag([
          createModelArtifact('artifact_path'),
          createModelArtifact('another_artifact_path'),
        ]),
      },
    });

    expect(screen.getByRole('button', { name: 'Register model' })).toBeInTheDocument();

    await userEvent.type(screen.getByRole('button', { name: 'Register model' }), '{arrowdown}');

    expect(screen.queryByText('Unregistered models')).not.toBeInTheDocument();
    expect(screen.getByText('Registered models')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^another-test-model v8/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^test-model v7/ })).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewHeaderRegisterModelButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewHeaderRegisterModelButton.tsx
Signals: React, Redux/RTK

```typescript
import {
  Button,
  ChevronDownIcon,
  DropdownMenu,
  NewWindowIcon,
  Tag,
  LegacyTooltip,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';
import { first, last, orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from '../../../common/utils/RoutingUtils';
import Utils from '../../../common/utils/Utils';
import { RegisterModel } from '../../../model-registry/components/RegisterModel';
import { ModelVersionStatusIcons } from '../../../model-registry/constants';
import { ModelRegistryRoutes } from '../../../model-registry/routes';
import Routes from '../../routes';
import type { ModelVersionInfoEntity } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { ReactComponent as RegisteredModelOkIcon } from '../../../common/static/registered-model-grey-ok.svg';
import type { RunPageModelVersionSummary } from './hooks/useUnifiedRegisteredModelVersionsSummariesForRun';

interface LoggedModelWithRegistrationInfo {
  path: string;
  absolutePath: string;
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
}

function LoggedModelsDropdownContent({
  models,
  onRegisterClick,
  experimentId,
  runUuid,
}: {
  models: LoggedModelWithRegistrationInfo[];
  onRegisterClick: (model: LoggedModelWithRegistrationInfo) => void;
  experimentId: string;
  runUuid: string;
}) {
  const { theme } = useDesignSystemTheme();
  const renderSection = (title: string, sectionModels: LoggedModelWithRegistrationInfo[]) => {
    return (
      <DropdownMenu.Group>
        <DropdownMenu.Label>{title}</DropdownMenu.Label>
        {sectionModels.map((model) => {
          const registeredModelSummary = first(model.registeredModelVersionSummaries);
          if (!registeredModelSummary) {
            return (
              <DropdownMenu.Item
                componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_50"
                onClick={() => onRegisterClick(model)}
                key={model.absolutePath}
              >
                <div css={{ marginRight: theme.spacing.md }}>{last(model.path.split('/'))}</div>
                <DropdownMenu.HintColumn>
                  <Link
                    target="_blank"
                    to={Routes.getRunPageTabRoute(experimentId, runUuid, 'artifacts/' + model.path)}
                  >
                    <Button
                      componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_58"
                      type="link"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      endIcon={<NewWindowIcon />}
                    >
                      <FormattedMessage
                        defaultMessage="View model"
                        description="Run page > Header > Register model dropdown > View model button label"
                      />
                    </Button>
                  </Link>
                </DropdownMenu.HintColumn>
              </DropdownMenu.Item>
            );
          }
          const { status, displayedName, version, link } = registeredModelSummary;

          return (
            <Link target="_blank" to={link} key={model.absolutePath}>
              <DropdownMenu.Item componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_80">
                <DropdownMenu.IconWrapper css={{ display: 'flex', alignItems: 'center' }}>
                  {status === 'READY' ? <RegisteredModelOkIcon /> : status ? ModelVersionStatusIcons[status] : null}
                </DropdownMenu.IconWrapper>
                <span css={{ marginRight: theme.spacing.md }}>
                  {displayedName}
                  <Tag
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_90"
                    css={{ marginLeft: 8, marginRight: 4 }}
                  >
                    v{version}
                  </Tag>
                </span>
                <DropdownMenu.HintColumn>
                  <Button
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_89"
                    type="link"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    endIcon={<NewWindowIcon />}
                  >
                    <FormattedMessage
                      defaultMessage="Go to model"
                      description="Run page > Header > Register model dropdown > Go to model button label"
                    />
                  </Button>
                </DropdownMenu.HintColumn>
              </DropdownMenu.Item>
            </Link>
          );
        })}
      </DropdownMenu.Group>
    );
  };
  const registeredModels = models.filter((model) => model.registeredModelVersionSummaries.length > 0);
  const unregisteredModels = models.filter((model) => !model.registeredModelVersionSummaries.length);
  return (
    <>
      {unregisteredModels.length ? renderSection('Unregistered models', unregisteredModels) : null}
      {unregisteredModels.length && registeredModels.length ? <DropdownMenu.Separator /> : null}
      {registeredModels.length ? renderSection('Registered models', registeredModels) : null}
    </>
  );
}

const getRegisteredModelVersionLink = (modelVersion: ModelVersionInfoEntity) => {
  const { name, version } = modelVersion;
  return ModelRegistryRoutes.getModelVersionPageRoute(name, version);
};

export const RunViewHeaderRegisterModelButton = ({
  runUuid,
  experimentId,
  runTags,
  artifactRootUri,
  registeredModelVersionSummaries,
}: {
  runUuid: string;
  experimentId: string;
  runTags: Record<string, KeyValueEntity>;
  artifactRootUri?: string;
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
}) => {
  const { theme } = useDesignSystemTheme();

  const loggedModelPaths = useMemo(
    () => (runTags ? Utils.getLoggedModelsFromTags(runTags).map(({ artifactPath }) => artifactPath) : []),
    [runTags],
  );

  const models = useMemo<LoggedModelWithRegistrationInfo[]>(
    () =>
      orderBy(
        loggedModelPaths.map((path) => ({
          path,
          absolutePath: `${artifactRootUri}/${path}`,
          registeredModelVersionSummaries:
            registeredModelVersionSummaries?.filter(({ source }) => source === `${artifactRootUri}/${path}`) || [],
        })),
        (model) => parseInt(model.registeredModelVersionSummaries[0]?.version || '0', 10),
        'desc',
      ),
    [loggedModelPaths, registeredModelVersionSummaries, artifactRootUri],
  );

  const [selectedModelToRegister, setSelectedModelToRegister] = useState<LoggedModelWithRegistrationInfo | null>(null);

  if (models.length > 1) {
    const modelsRegistered = models.filter((model) => model.registeredModelVersionSummaries.length > 0);

    return (
      <>
        {selectedModelToRegister && (
          <RegisterModel
            runUuid={runUuid}
            modelPath={selectedModelToRegister.absolutePath}
            modelRelativePath={selectedModelToRegister.path}
            disabled={false}
            showButton={false}
            modalVisible
            onCloseModal={() => setSelectedModelToRegister(null)}
          />
        )}
        <DropdownMenu.Root modal={false}>
          <Tooltip
            componentId="mlflow.run_details.header.register-model-button.tooltip"
            side="bottom"
            content={
              <FormattedMessage
                defaultMessage="{registeredCount}/{loggedCount} logged models are registered"
                description="Run page > Header > Register model dropdown > Button tooltip"
                values={{ registeredCount: modelsRegistered.length, loggedCount: models.length }}
              />
            }
          >
            <DropdownMenu.Trigger asChild>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_195"
                type="primary"
                endIcon={<ChevronDownIcon />}
              >
                <FormattedMessage
                  defaultMessage="Register model"
                  description="Run page > Header > Register model dropdown > Button label when some models are not registered"
                />
              </Button>
            </DropdownMenu.Trigger>
          </Tooltip>
          <DropdownMenu.Content align="end">
            <LoggedModelsDropdownContent
              models={models}
              onRegisterClick={setSelectedModelToRegister}
              experimentId={experimentId}
              runUuid={runUuid}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </>
    );
  }

  const singleModel = first(models);

  if (!singleModel) {
    return null;
  }

  const registeredModelVersionSummary = first(singleModel.registeredModelVersionSummaries);

  if (registeredModelVersionSummary) {
    return (
      <Link to={registeredModelVersionSummary.link} target="_blank" css={{ marginLeft: theme.spacing.sm }}>
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewheaderregistermodelbutton.tsx_231"
          endIcon={<NewWindowIcon />}
          type="link"
        >
          Model registered
        </Button>
      </Link>
    );
  }
  return (
    <RegisterModel
      disabled={false}
      runUuid={runUuid}
      modelPath={singleModel.absolutePath}
      modelRelativePath={singleModel.path}
      showButton
      buttonType="primary"
    />
  );
};
```

--------------------------------------------------------------------------------

````
