---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 563
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 563 of 991)

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

---[FILE: PromptsDetailsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/PromptsDetailsPage.tsx
Signals: React, Redux/RTK

```typescript
import invariant from 'invariant';
import { useDispatch } from 'react-redux';
import { usePromptDetailsQuery } from './hooks/usePromptDetailsQuery';
import { Link, useNavigate, useParams } from '../../../common/utils/RoutingUtils';
import { ScrollablePageWrapper } from '../../../common/components/ScrollablePageWrapper';
import {
  Breadcrumb,
  Button,
  ColumnsIcon,
  DropdownMenu,
  GenericSkeleton,
  Header,
  OverflowIcon,
  SegmentedControlButton,
  SegmentedControlGroup,
  Spacer,
  TableSkeleton,
  useDesignSystemTheme,
  ZoomMarqueeSelection,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { PromptVersionsTableMode } from './utils';
import { useMemo } from 'react';
import Routes from '../../routes';
import { CreatePromptModalMode, useCreatePromptModal } from './hooks/useCreatePromptModal';
import { useDeletePromptModal } from './hooks/useDeletePromptModal';
import { PromptVersionsTable } from './components/PromptVersionsTable';
import { useEditAliasesModal } from '../../../common/hooks/useEditAliasesModal';
import { usePromptDetailsPageViewState } from './hooks/usePromptDetailsPageViewState';
import { PromptContentPreview } from './components/PromptContentPreview';
import { PromptContentCompare } from './components/PromptContentCompare';
import { withErrorBoundary } from '../../../common/utils/withErrorBoundary';
import ErrorUtils from '../../../common/utils/ErrorUtils';
import { PromptPageErrorHandler } from './components/PromptPageErrorHandler';
import { first, isEmpty } from 'lodash';
import { PromptsListTableTagsBox } from './components/PromptDetailsTagsBox';
import { PromptNotFoundView } from './components/PromptNotFoundView';
import { useUpdatePromptVersionMetadataModal } from './hooks/useUpdatePromptVersionMetadataModal';
import { useEditModelConfigModal } from './hooks/useEditModelConfigModal';
import type { ThunkDispatch } from '../../../redux-types';
import { setModelVersionAliasesApi } from '../../../model-registry/actions';
import { ExperimentPageTabName } from '../../constants';

const getAliasesModalTitle = (version: string) => (
  <FormattedMessage
    defaultMessage="Add/edit alias for prompt version {version}"
    description="Title for the edit aliases modal on the registered prompt details page"
    values={{ version }}
  />
);

const PromptsDetailsPage = ({ experimentId }: { experimentId?: string } = {}) => {
  const { promptName } = useParams<{ promptName: string }>();
  const { theme } = useDesignSystemTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch<ThunkDispatch>();

  invariant(promptName, 'Prompt name should be defined');

  const { data: promptDetailsData, refetch, isLoading, error: promptLoadError } = usePromptDetailsQuery({ promptName });

  const { CreatePromptModal, openModal: openCreateVersionModal } = useCreatePromptModal({
    mode: CreatePromptModalMode.CreatePromptVersion,
    registeredPrompt: promptDetailsData?.prompt,
    latestVersion: first(promptDetailsData?.versions),
    experimentId,
    onSuccess: async ({ promptVersion }) => {
      await refetch();
      if (promptVersion) {
        setPreviewMode({ version: promptVersion });
      }
    },
  });

  const { DeletePromptModal, openModal: openDeleteModal } = useDeletePromptModal({
    registeredPrompt: promptDetailsData?.prompt,
    onSuccess: () =>
      navigate(
        experimentId
          ? Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Prompts)
          : Routes.promptsPageRoute,
      ),
  });

  const { EditPromptVersionMetadataModal, showEditPromptVersionMetadataModal } = useUpdatePromptVersionMetadataModal({
    onSuccess: refetch,
  });

  const { EditModelConfigModal, openEditModelConfigModal } = useEditModelConfigModal({
    onSuccess: refetch,
  });

  const { setCompareMode, setPreviewMode, switchSides, viewState, setSelectedVersion, setComparedVersion } =
    usePromptDetailsPageViewState(promptDetailsData);

  const { mode } = viewState;

  const isEmptyVersions = !isLoading && !promptDetailsData?.versions.length;

  const showPreviewPane =
    !isLoading && !isEmptyVersions && [PromptVersionsTableMode.PREVIEW, PromptVersionsTableMode.COMPARE].includes(mode);

  const selectedVersionEntity = promptDetailsData?.versions.find(
    ({ version }) => version === viewState.selectedVersion,
  );

  const comparedVersionEntity = promptDetailsData?.versions.find(
    ({ version }) => version === viewState.comparedVersion,
  );

  const aliasesByVersion = useMemo(() => {
    const result: Record<string, string[]> = {};
    promptDetailsData?.prompt?.aliases?.forEach(({ alias, version }) => {
      if (!result[version]) {
        result[version] = [];
      }
      result[version].push(alias);
    });
    return result;
  }, [promptDetailsData]);

  const { EditAliasesModal, showEditAliasesModal } = useEditAliasesModal({
    aliases: promptDetailsData?.prompt?.aliases ?? [],
    onSuccess: refetch,
    getTitle: getAliasesModalTitle,
    onSave: async (currentlyEditedVersion: string, existingAliases: string[], draftAliases: string[]) =>
      dispatch(
        setModelVersionAliasesApi(
          promptDetailsData?.prompt?.name ?? '',
          currentlyEditedVersion,
          existingAliases,
          draftAliases,
        ),
      ),
    description: (
      <FormattedMessage
        // TODO: add a documentation link ("Learn more")
        defaultMessage="Aliases allow you to assign a mutable, named reference to a particular prompt version."
        description="Description for the edit aliases modal on the registered prompt details page"
      />
    ),
  });

  // If the load error occurs, show not found page
  if (promptLoadError) {
    return <PromptNotFoundView promptName={promptName} />;
  }

  const breadcrumbs = !experimentId ? (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={Routes.promptsPageRoute}>Prompts</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  ) : undefined;

  if (isLoading) {
    return (
      <ScrollablePageWrapper>
        <PromptsDetailsPage.Skeleton breadcrumbs={breadcrumbs} />
      </ScrollablePageWrapper>
    );
  }

  return (
    <ScrollablePageWrapper css={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Spacer shrinks={false} />
      <Header
        breadcrumbs={breadcrumbs}
        title={promptDetailsData?.prompt?.name}
        buttons={
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  componentId="mlflow.prompts.details.actions"
                  icon={<OverflowIcon />}
                  aria-label="More actions"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item componentId="mlflow.prompts.details.actions.delete" onClick={openDeleteModal}>
                  <FormattedMessage
                    defaultMessage="Delete"
                    description="Label for the delete prompt action on the registered prompt details page"
                  />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Button componentId="mlflow.prompts.details.create" type="primary" onClick={openCreateVersionModal}>
              <FormattedMessage
                defaultMessage="Create prompt version"
                description="Label for the create prompt action on the registered prompt details page"
              />
            </Button>
          </>
        }
      />
      <PromptsListTableTagsBox onTagsUpdated={refetch} promptEntity={promptDetailsData?.prompt} />
      <Spacer shrinks={false} />
      <div css={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div css={{ flex: showPreviewPane ? '0 0 320px' : 1, display: 'flex', flexDirection: 'column' }}>
          <div css={{ display: 'flex', gap: theme.spacing.sm }}>
            <SegmentedControlGroup
              name="mlflow.prompts.details.mode"
              componentId="mlflow.prompts.details.mode"
              value={mode}
              disabled={isLoading}
            >
              <SegmentedControlButton value={PromptVersionsTableMode.PREVIEW} onClick={() => setPreviewMode()}>
                <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                  <ZoomMarqueeSelection />
                  <FormattedMessage
                    defaultMessage="Preview"
                    description="Label for the preview mode on the registered prompt details page"
                  />
                </div>
              </SegmentedControlButton>
              <SegmentedControlButton
                disabled={Boolean(!promptDetailsData?.versions.length || promptDetailsData?.versions.length < 2)}
                value={PromptVersionsTableMode.COMPARE}
                onClick={setCompareMode}
              >
                <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                  <ColumnsIcon />{' '}
                  <FormattedMessage
                    defaultMessage="Compare"
                    description="Label for the compare mode on the registered prompt details page"
                  />
                </div>
              </SegmentedControlButton>
            </SegmentedControlGroup>
          </div>
          <Spacer shrinks={false} size="sm" />
          <PromptVersionsTable
            isLoading={isLoading}
            registeredPrompt={promptDetailsData?.prompt}
            promptVersions={promptDetailsData?.versions}
            selectedVersion={viewState.selectedVersion}
            comparedVersion={viewState.comparedVersion}
            showEditAliasesModal={showEditAliasesModal}
            aliasesByVersion={aliasesByVersion}
            onUpdateSelectedVersion={setSelectedVersion}
            onUpdateComparedVersion={setComparedVersion}
            mode={mode}
          />
        </div>
        {showPreviewPane && (
          <div css={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div css={{ borderLeft: `1px solid ${theme.colors.border}`, flex: 1, overflow: 'hidden', display: 'flex' }}>
              {mode === PromptVersionsTableMode.PREVIEW && (
                <PromptContentPreview
                  promptVersion={selectedVersionEntity}
                  onUpdatedContent={refetch}
                  onDeletedVersion={async () => {
                    await refetch().then(({ data }) => {
                      if (!isEmpty(data?.versions) && data?.versions[0].version) {
                        setSelectedVersion(data?.versions[0].version);
                      }
                      // If no versions left, table will show empty state
                    });
                  }}
                  aliasesByVersion={aliasesByVersion}
                  showEditAliasesModal={showEditAliasesModal}
                  registeredPrompt={promptDetailsData?.prompt}
                  showEditPromptVersionMetadataModal={showEditPromptVersionMetadataModal}
                  showEditModelConfigModal={openEditModelConfigModal}
                />
              )}
              {mode === PromptVersionsTableMode.COMPARE && (
                <PromptContentCompare
                  baselineVersion={selectedVersionEntity}
                  comparedVersion={comparedVersionEntity}
                  onSwitchSides={switchSides}
                  onEditVersion={setPreviewMode}
                  showEditAliasesModal={showEditAliasesModal}
                  registeredPrompt={promptDetailsData?.prompt}
                  aliasesByVersion={aliasesByVersion}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Spacer shrinks={false} />
      {EditAliasesModal}
      {CreatePromptModal}
      {DeletePromptModal}
      {EditPromptVersionMetadataModal}
      {EditModelConfigModal}
    </ScrollablePageWrapper>
  );
};

PromptsDetailsPage.Skeleton = function PromptsDetailsPageSkeleton({ breadcrumbs }: { breadcrumbs?: React.ReactNode }) {
  const { theme } = useDesignSystemTheme();
  return (
    <>
      <Spacer shrinks={false} />
      <Header
        breadcrumbs={breadcrumbs}
        title={<GenericSkeleton css={{ height: theme.general.heightBase, width: 200 }} />}
        buttons={<GenericSkeleton css={{ height: theme.general.heightBase, width: 120 }} />}
      />
      <Spacer shrinks={false} />
      <TableSkeleton lines={4} />
      <Spacer shrinks={false} />
      <div css={{ display: 'flex', gap: theme.spacing.lg }}>
        <div css={{ flex: '0 0 320px' }}>
          <TableSkeleton lines={6} />
        </div>
        <div css={{ flex: 1 }}>
          <TableSkeleton lines={4} />
        </div>
      </div>
    </>
  );
};

export default withErrorBoundary(
  ErrorUtils.mlflowServices.EXPERIMENTS,
  PromptsDetailsPage,
  undefined,
  PromptPageErrorHandler,
);
```

--------------------------------------------------------------------------------

---[FILE: PromptsPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/PromptsPage.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import PromptsPage from './PromptsPage';
import { QueryClientProvider, QueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { setupServer } from '../../../common/utils/setup-msw';
import { IntlProvider } from 'react-intl';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import userEvent from '@testing-library/user-event';
import {
  getMockedRegisteredPromptCreateResponse,
  getMockedRegisteredPromptCreateVersionResponse,
  getMockedRegisteredPromptSetTagsResponse,
  getMockedRegisteredPromptsResponse,
  getMockedRegisteredPromptVersionSetTagsResponse,
} from './test-utils';
import { DesignSystemProvider } from '@databricks/design-system';
import { rest } from 'msw';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // increase timeout due to heavier use of tables, modals and forms

describe('PromptsPage', () => {
  const server = setupServer(getMockedRegisteredPromptsResponse(2));

  const renderTestComponent = () => {
    const queryClient = new QueryClient();
    render(<PromptsPage />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <TestRouter
            routes={[
              testRoute(
                <DesignSystemProvider>
                  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </DesignSystemProvider>,
                '/',
              ),
              testRoute(<div />, '*'),
            ]}
            initialEntries={['/']}
          />
        </IntlProvider>
      ),
    });
  };
  it('should render table contents', async () => {
    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByText('Prompts')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'prompt1' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'prompt2' })).toBeInTheDocument();
    });

    expect(screen.getByRole('cell', { name: 'Version 3' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Version 5' })).toBeInTheDocument();

    expect(screen.getByRole('status', { name: 'some_tag' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'another_tag' })).toBeInTheDocument();
  });

  it('should edit tags', async () => {
    const setTagMock = jest.fn();
    server.use(getMockedRegisteredPromptsResponse(1), getMockedRegisteredPromptSetTagsResponse(setTagMock));

    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByText('Prompts')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'prompt1' })).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Edit tags')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Edit tags'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('combobox'), 'new_tag');
    await userEvent.click(screen.getByText('Add tag "new_tag"'));

    await userEvent.type(screen.getByPlaceholderText('Type a value'), 'new_value');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByText('Save tags'));

    await waitFor(() => {
      expect(setTagMock).toHaveBeenCalledWith({ key: 'new_tag', value: 'new_value', name: 'prompt1' });
    });
  });

  it('should create a new prompt version', async () => {
    const createVersionSpy = jest.fn();
    server.use(
      getMockedRegisteredPromptsResponse(0),
      getMockedRegisteredPromptCreateResponse(),
      getMockedRegisteredPromptCreateVersionResponse(createVersionSpy),
    );

    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByText('Prompts')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Create prompt'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText('Name:'), 'prompt7');
    await userEvent.type(screen.getByLabelText('Prompt:'), 'lorem ipsum');
    await userEvent.type(screen.getByLabelText('Commit message (optional):'), 'commit message');
    await userEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(createVersionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'prompt7',
          description: 'commit message',
          tags: expect.arrayContaining([
            {
              key: 'mlflow.prompt.is_prompt',
              value: 'true',
            },
            {
              key: 'mlflow.prompt.text',
              value: 'lorem ipsum',
            },
          ]),
        }),
      );
    });
  });

  it('should create a new chat prompt version', async () => {
    const createVersionSpy = jest.fn();
    server.use(
      getMockedRegisteredPromptsResponse(0),
      getMockedRegisteredPromptCreateResponse(),
      getMockedRegisteredPromptCreateVersionResponse(createVersionSpy),
    );

    renderTestComponent();
    await waitFor(() => {
      expect(screen.getByText('Prompts')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Create prompt'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText('Name:'), 'prompt8');
    await userEvent.click(screen.getByRole('radio', { name: 'Chat' }));

    const firstContent = document.querySelector('textarea[name="chatMessages.0.content"]') as HTMLTextAreaElement;
    await userEvent.type(firstContent, 'Hello');
    await userEvent.click(screen.getAllByRole('button', { name: 'Add message' })[0]);
    await userEvent.clear(screen.getAllByPlaceholderText('role')[1]);
    await userEvent.type(screen.getAllByPlaceholderText('role')[1], 'assistant');
    const secondContent = document.querySelector('textarea[name="chatMessages.1.content"]') as HTMLTextAreaElement;
    await userEvent.type(secondContent, 'Hi!');
    await userEvent.type(screen.getByLabelText('Commit message (optional):'), 'commit message');
    await userEvent.click(screen.getByText('Create'));

    const expectedMessages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi!' },
    ];

    await waitFor(() => {
      expect(createVersionSpy).toHaveBeenCalled();
    });

    const payload = createVersionSpy.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: 'prompt8',
      description: 'commit message',
    });
    expect((payload as any).tags).toEqual(
      expect.arrayContaining([
        { key: 'mlflow.prompt.is_prompt', value: 'true' },
        { key: 'mlflow.prompt.text', value: JSON.stringify(expectedMessages) },
        { key: '_mlflow_prompt_type', value: 'chat' },
      ]),
    );
  });

  describe('Experiment-scoped prompts', () => {
    it('should render experiment-scoped prompts with filtering', async () => {
      const experimentId = '123';
      server.use(
        rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) => {
          const filter = req.url.searchParams.get('filter');
          expect(filter).toContain(`tags.\`_mlflow_experiment_ids\` ILIKE '%,${experimentId},%'`);
          return res(
            ctx.json({
              registered_models: [
                {
                  name: 'exp-prompt1',
                  last_updated_timestamp: 1620000000000,
                  tags: [
                    { key: '_mlflow_experiment_ids', value: experimentId },
                    { key: 'some_tag', value: 'abc' },
                  ],
                  latest_versions: [{ version: 1 }],
                },
              ],
            }),
          );
        }),
      );

      const queryClient = new QueryClient();
      render(<PromptsPage experimentId={experimentId} />, {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <TestRouter
              routes={[
                testRoute(
                  <DesignSystemProvider>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                  </DesignSystemProvider>,
                  '/',
                ),
                testRoute(<div />, '*'),
              ]}
              initialEntries={['/']}
            />
          </IntlProvider>
        ),
      });

      await waitFor(() => {
        expect(screen.getByText('Prompts')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'exp-prompt1' })).toBeInTheDocument();
      });
    });

    it('should create prompt with experiment ID tag when in experiment scope', async () => {
      const experimentId = '456';
      const createPromptSpy = jest.fn();
      const createVersionSpy = jest.fn();

      server.use(
        getMockedRegisteredPromptsResponse(0),
        rest.post('/ajax-api/2.0/mlflow/registered-models/create', async (req, res, ctx) => {
          createPromptSpy(await req.json());
          return res(ctx.json({}));
        }),
        getMockedRegisteredPromptCreateVersionResponse(createVersionSpy),
      );

      const queryClient = new QueryClient();
      render(<PromptsPage experimentId={experimentId} />, {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <TestRouter
              routes={[
                testRoute(
                  <DesignSystemProvider>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                  </DesignSystemProvider>,
                  '/',
                ),
                testRoute(<div />, '*'),
              ]}
              initialEntries={['/']}
            />
          </IntlProvider>
        ),
      });

      await waitFor(() => {
        expect(screen.getByText('Prompts')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('Create prompt'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await userEvent.type(screen.getByLabelText('Name:'), 'exp-prompt');
      await userEvent.type(screen.getByLabelText('Prompt:'), 'test content');
      await userEvent.click(screen.getByText('Create'));

      await waitFor(() => {
        expect(createPromptSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'exp-prompt',
            tags: expect.arrayContaining([
              {
                key: 'mlflow.prompt.is_prompt',
                value: 'true',
              },
              {
                key: '_mlflow_experiment_ids',
                value: `,${experimentId},`,
              },
            ]),
          }),
        );
      });
    });

    it('should not add experiment ID tag when not in experiment scope', async () => {
      const createPromptSpy = jest.fn();
      const createVersionSpy = jest.fn();

      server.use(
        getMockedRegisteredPromptsResponse(0),
        rest.post('/ajax-api/2.0/mlflow/registered-models/create', async (req, res, ctx) => {
          createPromptSpy(await req.json());
          return res(ctx.json({}));
        }),
        getMockedRegisteredPromptCreateVersionResponse(createVersionSpy),
      );

      const queryClient = new QueryClient();
      render(<PromptsPage />, {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <TestRouter
              routes={[
                testRoute(
                  <DesignSystemProvider>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                  </DesignSystemProvider>,
                  '/',
                ),
                testRoute(<div />, '*'),
              ]}
              initialEntries={['/']}
            />
          </IntlProvider>
        ),
      });

      await waitFor(() => {
        expect(screen.getByText('Prompts')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('Create prompt'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await userEvent.type(screen.getByLabelText('Name:'), 'global-prompt');
      await userEvent.type(screen.getByLabelText('Prompt:'), 'test content');
      await userEvent.click(screen.getByText('Create'));

      await waitFor(() => {
        expect(createPromptSpy).toHaveBeenCalled();
      });

      const call = createPromptSpy.mock.calls[0][0] as any;
      expect(call.tags).toEqual(
        expect.arrayContaining([
          {
            key: 'mlflow.prompt.is_prompt',
            value: 'true',
          },
        ]),
      );
      // Should not contain experiment ID tag
      expect(call.tags.find((tag: any) => tag.key === '_mlflow_experiment_ids')).toBeUndefined();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PromptsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/PromptsPage.tsx
Signals: React

```typescript
import { ScrollablePageWrapper } from '@mlflow/mlflow/src/common/components/ScrollablePageWrapper';
import { usePromptsListQuery } from './hooks/usePromptsListQuery';
import { Alert, Button, Header, Spacer } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { PromptsListFilters } from './components/PromptsListFilters';
import { PromptsListTable } from './components/PromptsListTable';
import { useUpdateRegisteredPromptTags } from './hooks/useUpdateRegisteredPromptTags';
import { CreatePromptModalMode, useCreatePromptModal } from './hooks/useCreatePromptModal';
import Routes from '../../routes';
import { useNavigate } from '../../../common/utils/RoutingUtils';
import { withErrorBoundary } from '../../../common/utils/withErrorBoundary';
import ErrorUtils from '../../../common/utils/ErrorUtils';
import { PromptPageErrorHandler } from './components/PromptPageErrorHandler';
import { useDebounce } from 'use-debounce';

const PromptsPage = ({ experimentId }: { experimentId?: string } = {}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const navigate = useNavigate();

  const [debouncedSearchFilter] = useDebounce(searchFilter, 500);

  const { data, error, refetch, hasNextPage, hasPreviousPage, isLoading, onNextPage, onPreviousPage } =
    usePromptsListQuery({ experimentId, searchFilter: debouncedSearchFilter });

  const { EditTagsModal, showEditPromptTagsModal } = useUpdateRegisteredPromptTags({ onSuccess: refetch });
  const { CreatePromptModal, openModal: openCreateVersionModal } = useCreatePromptModal({
    mode: CreatePromptModalMode.CreatePrompt,
    experimentId,
    onSuccess: ({ promptName }) => navigate(Routes.getPromptDetailsPageRoute(promptName, experimentId)),
  });

  return (
    <ScrollablePageWrapper css={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Spacer shrinks={false} />
      <Header
        title={<FormattedMessage defaultMessage="Prompts" description="Header title for the registered prompts page" />}
        buttons={
          <Button componentId="mlflow.prompts.list.create" type="primary" onClick={openCreateVersionModal}>
            <FormattedMessage
              defaultMessage="Create prompt"
              description="Label for the create prompt button on the registered prompts page"
            />
          </Button>
        }
      />
      <Spacer shrinks={false} />
      <div css={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PromptsListFilters searchFilter={searchFilter} onSearchFilterChange={setSearchFilter} />
        {error?.message && (
          <>
            <Alert type="error" message={error.message} componentId="mlflow.prompts.list.error" closable={false} />
            <Spacer />
          </>
        )}
        <PromptsListTable
          prompts={data}
          error={error}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          isLoading={isLoading}
          isFiltered={Boolean(searchFilter)}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onEditTags={showEditPromptTagsModal}
          experimentId={experimentId}
        />
      </div>
      {EditTagsModal}
      {CreatePromptModal}
    </ScrollablePageWrapper>
  );
};

export default withErrorBoundary(ErrorUtils.mlflowServices.EXPERIMENTS, PromptsPage, undefined, PromptPageErrorHandler);
```

--------------------------------------------------------------------------------

---[FILE: test-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/test-utils.ts

```typescript
import { jest } from '@jest/globals';
import { rest } from 'msw';
import { REGISTERED_PROMPT_CONTENT_TAG_KEY, REGISTERED_PROMPT_SOURCE_RUN_ID } from './utils';
import type { ModelAliasMap } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';

export const getMockedRegisteredPromptSetTagsResponse = (spyFn = jest.fn()) =>
  rest.post(getAjaxUrl('ajax-api/2.0/mlflow/registered-models/set-tag'), (req, res, ctx) => {
    spyFn(req.body);
    return res(ctx.json({}));
  });

export const getMockedRegisteredPromptDeleteResponse = (spyFn = jest.fn()) =>
  rest.delete(getAjaxUrl('ajax-api/2.0/mlflow/registered-models/delete'), (req, res, ctx) => {
    spyFn(req.body);
    return res(ctx.json({}));
  });

export const getMockedRegisteredPromptVersionSetTagsResponse = (spyFn = jest.fn()) =>
  rest.post(getAjaxUrl('ajax-api/2.0/mlflow/model-versions/set-tag'), (req, res, ctx) => {
    spyFn(req.body);
    return res(ctx.json({}));
  });

export const getMockedRegisteredPromptCreateResponse = (spyFn = jest.fn()) =>
  rest.post(getAjaxUrl('ajax-api/2.0/mlflow/registered-models/create'), (req, res, ctx) => {
    spyFn(req.body);
    return res(ctx.json({}));
  });

export const getMockedRegisteredPromptCreateVersionResponse = (spyFn = jest.fn()) =>
  rest.post(getAjaxUrl('ajax-api/2.0/mlflow/model-versions/create'), (req, res, ctx) => {
    spyFn(req.body);
    return res(ctx.json({ model_version: { version: '1' } }));
  });

export const getMockedRegisteredPromptSourceRunResponse = (spyFn = jest.fn()) =>
  rest.get(getAjaxUrl('ajax-api/2.0/mlflow/runs/get'), (req, res, ctx) => {
    const run_id = req.url.searchParams.get('run_id');
    return res(
      ctx.json({
        run: {
          data: {},
          info: {
            run_uuid: run_id,
            run_id: run_id,
            experiment_id: 'test_experiment_id',
            run_name: `${run_id}_name`,
          },
        },
      }),
    );
  });

export const getMockedRegisteredPromptsResponse = (n = 3) =>
  rest.get(getAjaxUrl('ajax-api/2.0/mlflow/registered-models/search'), (req, res, ctx) => {
    return res(
      ctx.json({
        registered_models: [
          {
            name: 'prompt1',
            last_updated_timestamp: 1620000000000,
            tags: [{ key: 'some_tag', value: 'abc' }],
            latest_versions: [{ version: 3 }],
          },
          {
            name: 'prompt2',
            last_updated_timestamp: 1620000000000,
            tags: [{ key: 'another_tag', value: 'xyz' }],
            latest_versions: [{ version: 5 }],
          },
          {
            name: 'prompt3',
            last_updated_timestamp: 1620000000000,
            tags: [{ key: 'another_tag', value: 'xyz' }],
            latest_versions: [{ version: 7 }],
          },
        ].slice(0, n),
      }),
    );
  });

export const getFailedRegisteredPromptDetailsResponse = (status = 404) =>
  rest.get(getAjaxUrl('ajax-api/2.0/mlflow/registered-models/get'), (req, res, ctx) => res(ctx.status(status)));

export const getMockedRegisteredPromptDetailsResponse = (name = 'prompt1', tags: KeyValueEntity[] = []) =>
  rest.get(getAjaxUrl('ajax-api/2.0/mlflow/registered-models/get'), (req, res, ctx) => {
    const aliases: ModelAliasMap = [
      {
        alias: 'alias1',
        version: '1',
      },
      {
        alias: 'alias2',
        version: '2',
      },
      {
        alias: 'alias2',
        version: '3',
      },
    ];

    return res(
      ctx.json({
        registered_model: {
          name: 'prompt1',
          creation_timestamp: 1620000000000,
          last_updated_timestamp: 1620000000000,
          tags: [{ key: 'some_tag', value: 'abc' }, ...tags],
          aliases,
        },
      }),
    );
  });
export const getMockedRegisteredPromptVersionsResponse = (name = 'prompt1', n = 3, tags: KeyValueEntity[] = []) =>
  rest.get(getAjaxUrl('ajax-api/2.0/mlflow/model-versions/search'), (req, res, ctx) => {
    return res(
      ctx.json({
        model_versions: [
          {
            name,
            version: 1,
            creation_timestamp: 1620000000000,
            last_updated_timestamp: 1620000000000,
            description: 'some commit message for version 1',
            tags: [
              { key: 'some_version_tag', value: 'abc' },
              { key: REGISTERED_PROMPT_CONTENT_TAG_KEY, value: 'content of prompt version 1' },
              ...tags,
            ],
          },
          {
            name,
            version: 2,
            creation_timestamp: 1620000000000,
            last_updated_timestamp: 1620000000000,
            description: 'some commit message for version 2',
            tags: [
              { key: 'another_version_tag', value: 'xyz' },
              { key: REGISTERED_PROMPT_CONTENT_TAG_KEY, value: 'content for prompt version 2' },
              ...tags,
            ],
          },
          {
            name,
            version: 3,
            creation_timestamp: 1620000000000,
            last_updated_timestamp: 1620000000000,
            description: 'some commit message for version 3',
            tags: [
              { key: 'another_version_tag', value: 'xyz' },
              { key: REGISTERED_PROMPT_CONTENT_TAG_KEY, value: 'text of prompt version 3' },
              ...tags,
            ],
          },
        ].slice(0, n),
      }),
    );
  });
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/types.ts

```typescript
import type { ModelEntity, ModelVersionInfoEntity } from '../../types';

/**
 * Represents a registered prompt entry. For the time being, it uses
 * registered model entity type due to same API being reused.
 */
export type RegisteredPrompt = ModelEntity;

/**
 * Represents a registered prompt version. For the time being, it reuses model version entity
 * due to API being reused.
 */
export type RegisteredPromptVersion = ModelVersionInfoEntity;

export interface RegisteredPromptsListResponse {
  registered_models?: RegisteredPrompt[];
  next_page_token?: string;
}

export type RegisteredPromptDetailsResponse = {
  prompt?: RegisteredPrompt;
  versions: RegisteredPromptVersion[];
};

export type PromptVersionsForRunResponse = {
  model_versions?: RegisteredPromptVersion[];
};

export interface ChatPromptMessage {
  role: string;
  content: string;
}

/**
 * Represents a prompt model configuration, in the backend format (snake_case).
 */
export interface PromptModelConfig {
  provider?: string;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop_sequences?: string[];
  extra_params?: Record<string, any>;
}

/**
 * Represents a prompt model configuration, in the UI form format (camelCase with string inputs).
 */
export interface PromptModelConfigFormData {
  provider?: string;
  modelName?: string;
  temperature?: string;
  maxTokens?: string;
  topP?: string;
  topK?: string;
  frequencyPenalty?: string;
  presencePenalty?: string;
  stopSequences?: string;
}
```

--------------------------------------------------------------------------------

````
