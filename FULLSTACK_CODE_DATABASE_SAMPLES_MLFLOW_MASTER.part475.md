---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 475
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 475 of 991)

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

---[FILE: ExperimentPageHeaderWithDescription.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentPageHeaderWithDescription.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';
import type { useGetExperimentQuery } from '../../../hooks/useExperimentQuery';
import type { ExperimentEntity } from '../../../types';
import { ExperimentViewDescriptionNotes } from './ExperimentViewDescriptionNotes';
import { NOTE_CONTENT_TAG } from '../../../utils/NoteUtils';
import type { ApolloError } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { getGraphQLErrorMessage } from '../../../../graphql/get-graphql-error';
import { Alert, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { ExperimentViewHeader, ExperimentViewHeaderSkeleton } from './header/ExperimentViewHeader';
import type { ExperimentKind } from '../../../constants';

type GetExperimentReturnType = ReturnType<typeof useGetExperimentQuery>['data'];

/**
 * Renders experiment page header with description and notes editor.
 */
export const ExperimentPageHeaderWithDescription = ({
  experiment,
  loading,
  onNoteUpdated,
  error,
  experimentKindSelector,
  inferredExperimentKind,
  refetchExperiment,
}: {
  experiment: GetExperimentReturnType;
  loading?: boolean;
  onNoteUpdated?: () => void;
  error: ApolloError | ReturnType<typeof useGetExperimentQuery>['apiError'];
  experimentKindSelector?: React.ReactNode;
  inferredExperimentKind?: ExperimentKind;
  refetchExperiment?: () => Promise<unknown>;
}) => {
  const { theme } = useDesignSystemTheme();
  const [showAddDescriptionButton, setShowAddDescriptionButton] = useState(true);
  const [editing, setEditing] = useState(false);

  const experimentEntity = useMemo(() => {
    const experimentResponse = experiment as GetExperimentReturnType;
    if (!experimentResponse) return null;
    return {
      ...experimentResponse,
      creationTime: Number(experimentResponse?.creationTime),
      lastUpdateTime: Number(experimentResponse?.lastUpdateTime),
    } as ExperimentEntity;
  }, [experiment]);

  const experimentDescription = experimentEntity?.tags?.find((tag) => tag.key === NOTE_CONTENT_TAG)?.value;
  const errorMessage = getGraphQLErrorMessage(error);

  if (loading) {
    return <ExperimentViewHeaderSkeleton />;
  }

  if (errorMessage) {
    return (
      <div css={{ height: theme.general.heightBase, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        <Alert
          componentId="mlflow.logged_model.list.header.error"
          type="error"
          message={
            <FormattedMessage
              defaultMessage="Experiment load error: {errorMessage}"
              description="Error message displayed on logged models page when experiment data fails to load"
              values={{ errorMessage }}
            />
          }
          closable={false}
        />
      </div>
    );
  }

  if (experimentEntity) {
    return (
      <>
        <ExperimentViewHeader
          experiment={experimentEntity}
          inferredExperimentKind={inferredExperimentKind}
          setEditing={setEditing}
          experimentKindSelector={experimentKindSelector}
          refetchExperiment={refetchExperiment}
        />
        <ExperimentViewDescriptionNotes
          experiment={experimentEntity}
          setShowAddDescriptionButton={setShowAddDescriptionButton}
          editing={editing}
          setEditing={setEditing}
          onNoteUpdated={onNoteUpdated}
          defaultValue={experimentDescription}
        />
      </>
    );
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewArtifactLocation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewArtifactLocation.tsx
Signals: React

```typescript
import React from 'react';

export interface ExperimentViewArtifactLocationProps {
  artifactLocation: string;
}

export const ExperimentViewArtifactLocation = ({ artifactLocation }: ExperimentViewArtifactLocationProps) => {
  return <>{artifactLocation}</>;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDescriptionNotes.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewDescriptionNotes.tsx
Signals: React, Redux/RTK

```typescript
import type { ExperimentEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Modal,
  PencilIcon,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExperimentTags } from '../../../reducers/Reducers';
import { NOTE_CONTENT_TAG } from '../../../utils/NoteUtils';
import type { ThunkDispatch } from '../../../../redux-types';
import React from 'react';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMde, { SvgIcon } from 'react-mde';
import {
  forceAnchorTagNewTab,
  getMarkdownConverter,
  sanitizeConvertedHtml,
} from '../../../../common/utils/MarkdownUtils';
import { FormattedMessage } from 'react-intl';
import { setExperimentTagApi } from '../../../actions';
import { shouldEnableExperimentPageSideTabs } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

const extractNoteFromTags = (tags: Record<string, KeyValueEntity>) =>
  Object.values(tags).find((t) => t.key === NOTE_CONTENT_TAG)?.value || undefined;

const toolbarCommands = [
  ['header', 'bold', 'italic', 'strikethrough'],
  ['link', 'code', 'image'],
  ['unordered-list', 'ordered-list'],
];

const converter = getMarkdownConverter();

const getSanitizedHtmlContent = (markdown: string | undefined) => {
  if (markdown) {
    const sanitized = sanitizeConvertedHtml(converter.makeHtml(markdown));
    return forceAnchorTagNewTab(sanitized);
  }
  return null;
};

export const ExperimentViewDescriptionNotes = ({
  experiment,
  editing,
  setEditing,
  setShowAddDescriptionButton,
  onNoteUpdated,
  defaultValue,
}: {
  experiment: ExperimentEntity;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  setShowAddDescriptionButton: (show: boolean) => void;
  onNoteUpdated?: () => void;
  defaultValue?: string;
}) => {
  const storedNote = useSelector((state) => {
    const tags = getExperimentTags(experiment.experimentId, state);
    return tags ? extractNoteFromTags(tags) : '';
  });
  setShowAddDescriptionButton(!storedNote);

  const effectiveNote = storedNote || defaultValue;
  const [tmpNote, setTmpNote] = useState(effectiveNote);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview' | undefined>('write');
  const [isExpanded, setIsExpanded] = useState(false);

  const { theme } = useDesignSystemTheme();
  const PADDING_HORIZONTAL = 12;
  const DISPLAY_LINE_HEIGHT = 16;
  const COLLAPSE_MAX_HEIGHT = DISPLAY_LINE_HEIGHT + 2 * theme.spacing.sm;
  const MIN_EDITOR_HEIGHT = 200;
  const MAX_EDITOR_HEIGHT = 500;
  const MIN_PREVIEW_HEIGHT = 20;

  const dispatch = useDispatch<ThunkDispatch>();

  const handleSubmitEditNote = useCallback(
    (updatedNote?: string) => {
      setEditing(false);
      setShowAddDescriptionButton(!updatedNote);
      const action = setExperimentTagApi(experiment.experimentId, NOTE_CONTENT_TAG, updatedNote);
      dispatch(action).then(onNoteUpdated);
    },
    [experiment.experimentId, dispatch, setEditing, setShowAddDescriptionButton, onNoteUpdated],
  );

  return (
    <div
      css={
        shouldEnableExperimentPageSideTabs()
          ? {
              paddingBottom: theme.spacing.sm,
              borderBottom: `1px solid ${theme.colors.border}`,
            }
          : undefined
      }
    >
      {effectiveNote && (
        <div
          style={{
            whiteSpace: isExpanded ? 'normal' : 'pre-wrap',
            lineHeight: theme.typography.lineHeightLg,
            background: theme.colors.backgroundSecondary,
            display: 'flex',
            alignItems: 'flex-start',
            padding: theme.spacing.xs,
          }}
        >
          <div
            style={{
              flexGrow: 1,
              marginRight: PADDING_HORIZONTAL,
              overflow: 'hidden',
              overflowWrap: isExpanded ? 'break-word' : undefined,
              padding: `${theme.spacing.sm}px ${PADDING_HORIZONTAL}px`,
              maxHeight: isExpanded ? 'none' : COLLAPSE_MAX_HEIGHT + 'px',
              wordBreak: 'break-word',
            }}
          >
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: getSanitizedHtmlContent(effectiveNote) }}
            />
          </div>
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_experimentviewdescriptionnotes.tsx_114"
            icon={<PencilIcon />}
            onClick={() => setEditing(true)}
            style={{ padding: `0px ${theme.spacing.sm}px` }}
          />
          {isExpanded ? (
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_experimentviewdescriptionnotes.tsx_120"
              icon={<ChevronUpIcon />}
              onClick={() => setIsExpanded(false)}
              style={{ padding: `0px ${theme.spacing.sm}px` }}
            />
          ) : (
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_experimentviewdescriptionnotes.tsx_126"
              icon={<ChevronDownIcon />}
              onClick={() => setIsExpanded(true)}
              style={{ padding: `0px ${theme.spacing.sm}px` }}
            />
          )}
        </div>
      )}
      <Modal
        componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_experimentviewdescriptionnotes.tsx_141"
        title={
          <FormattedMessage
            defaultMessage="Add description"
            description="experiment page > description modal > title"
          />
        }
        visible={editing}
        okText={
          <FormattedMessage defaultMessage="Save" description="experiment page > description modal > save button" />
        }
        cancelText={
          <FormattedMessage defaultMessage="Cancel" description="experiment page > description modal > cancel button" />
        }
        onOk={() => {
          handleSubmitEditNote(tmpNote);
          setEditing(false);
        }}
        onCancel={() => {
          setTmpNote(effectiveNote);
          setEditing(false);
        }}
      >
        <React.Fragment>
          <ReactMde
            value={tmpNote}
            minEditorHeight={MIN_EDITOR_HEIGHT}
            maxEditorHeight={MAX_EDITOR_HEIGHT}
            minPreviewHeight={MIN_PREVIEW_HEIGHT}
            toolbarCommands={toolbarCommands}
            onChange={(value) => setTmpNote(value)}
            selectedTab={selectedTab}
            onTabChange={(newTab) => setSelectedTab(newTab)}
            generateMarkdownPreview={() => Promise.resolve(getSanitizedHtmlContent(tmpNote))}
            getIcon={(name) => (
              <Tooltip componentId="mlflow.experiment-tracking.experiment-description.edit" content={name}>
                <span css={{ color: theme.colors.textPrimary }}>
                  <SvgIcon icon={name} />
                </span>
              </Tooltip>
            )}
          />
        </React.Fragment>
      </Modal>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDescriptions.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewDescriptions.stories.tsx
Signals: React

```typescript
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from '../../../../common/utils/RoutingUtils';
import { ExperimentViewDescriptions } from './ExperimentViewDescriptions';

export default {
  title: 'ExperimentView/ExperimentViewDescriptions',
  component: ExperimentViewDescriptions,
  argTypes: {},
};

const mockExperiments = [
  {
    experimentId: '123456789',
    name: '/Users/john.doe@databricks.com/test-experiment',
    tags: [],
    allowedActions: ['MODIFIY_PERMISSION', 'DELETE', 'RENAME'],
    artifactLocation: 'dbfs://foo/bar/xyz',
  },
] as any;

const Wrapper = ({ children }: React.PropsWithChildren<any>) => (
  <IntlProvider locale="en">
    <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
  </IntlProvider>
);

export const Simple = () => (
  <Wrapper>
    <ExperimentViewDescriptions experiment={mockExperiments[0]} />
  </Wrapper>
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDescriptions.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewDescriptions.tsx
Signals: React

```typescript
import { Typography } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import type { ExperimentEntity } from '../../../types';
import { ExperimentViewArtifactLocation } from './ExperimentViewArtifactLocation';

export const ExperimentViewDescriptions = React.memo(({ experiment }: { experiment: ExperimentEntity }) => (
  <div css={styles.container}>
    <Typography.Text color="secondary">
      <FormattedMessage
        defaultMessage="Experiment ID"
        description="Label for displaying the current experiment in view"
      />
      : {experiment.experimentId}
    </Typography.Text>
    <Typography.Text color="secondary">
      <FormattedMessage
        defaultMessage="Artifact Location"
        description="Label for displaying the experiment artifact location"
      />
      : <ExperimentViewArtifactLocation artifactLocation={experiment.artifactLocation} />
    </Typography.Text>
  </div>
));

const styles = {
  container: (theme: Theme) => ({
    display: 'flex' as const,
    gap: theme.spacing.lg,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewNoPermissionsError.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewNoPermissionsError.tsx

```typescript
import { Button, Empty, NoIcon } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';

export const ExperimentViewNoPermissionsError = () => {
  return (
    <div css={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        description={
          <FormattedMessage
            defaultMessage="You don't have permissions to open requested experiment."
            description="A message shown on the experiment page if user has no permissions to open the experiment"
          />
        }
        image={<NoIcon />}
        title={
          <FormattedMessage
            defaultMessage="Permission denied"
            description="A title shown on the experiment page if user has no permissions to open the experiment"
          />
        }
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewNotes.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewNotes.stories.tsx
Signals: React, Redux/RTK

```typescript
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../../../common/utils/RoutingUtils';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { ExperimentTag } from '../../../sdk/MlflowMessages';
import type { ExperimentEntity } from '../../../types';
import { GetExperimentsContextProvider } from '../contexts/GetExperimentsContext';
import { ExperimentViewNotes } from './ExperimentViewNotes';

export default {
  title: 'ExperimentView/ExperimentViewNotes',
  component: ExperimentViewNotes,
  argTypes: {},
};

/**
 * Sample redux store
 */
const mockStore = {
  entities: {
    experimentTagsByExperimentId: {
      789: {
        'mlflow.note.content': (ExperimentTag as any).fromJs({
          key: 'mlflow.note.content',
          value: '',
        }),
      },
      1234: {
        'mlflow.note.content': (ExperimentTag as any).fromJs({
          key: 'mlflow.note.content',
          value: 'This is a note!',
        }),
      },
    },
  },
};

/**
 * Sample actions necessary for this component to work
 */
const mockActions: any = {
  setExperimentTagApi: (...args: any) => {
    window.console.log('setExperimentTagApi called with args', args);
    return { type: 'foobar', payload: Promise.resolve('foobar') };
  },
};

const createComponentWrapper = (experiment: Partial<ExperimentEntity>) => () =>
  (
    <Provider store={createStore((s) => s as any, mockStore, compose(applyMiddleware(promiseMiddleware())))}>
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={['/experiments/1234']}>
          <GetExperimentsContextProvider actions={mockActions}>
            <ExperimentViewNotes experiment={experiment as ExperimentEntity} />
          </GetExperimentsContextProvider>
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );

/**
 * Story for the experiment with no note
 */
export const EmptyNote = createComponentWrapper({ experimentId: '789' });

/**
 * Story for the experiment with note already set
 */
export const PrefilledNote = createComponentWrapper({ experimentId: '1234' });
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewNotes.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewNotes.tsx
Signals: React, Redux/RTK

```typescript
import { Button } from '@databricks/design-system';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CollapsibleSection } from '../../../../common/components/CollapsibleSection';
import { EditableNote } from '../../../../common/components/EditableNote';
import { getExperimentTags } from '../../../reducers/Reducers';
import type { ExperimentEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import { NOTE_CONTENT_TAG } from '../../../utils/NoteUtils';
import { useFetchExperiments } from '../hooks/useFetchExperiments';
import type { ThunkDispatch } from '../../../../redux-types';

const extractNoteFromTags = (tags: Record<string, KeyValueEntity>) =>
  Object.values(tags).find((t) => t.key === NOTE_CONTENT_TAG)?.value || undefined;

export interface ExperimentViewNotesProps {
  experiment: ExperimentEntity;
}

/**
 * ExperimentView part responsible for displaying/editing note.
 *
 * Consumes note from the redux store and dispatches
 * `setExperimentTagApi` redux action from the context.
 */
export const ExperimentViewNotes = React.memo(({ experiment }: ExperimentViewNotesProps) => {
  const storedNote = useSelector((state) => {
    const tags = getExperimentTags(experiment.experimentId, state);
    return tags ? extractNoteFromTags(tags) : '';
  });

  const [showNotesEditor, setShowNotesEditor] = useState(false);

  const {
    actions: { setExperimentTagApi },
  } = useFetchExperiments();

  const dispatch = useDispatch<ThunkDispatch>();

  const handleSubmitEditNote = useCallback(
    (updatedNote: any) => {
      const action = setExperimentTagApi(experiment.experimentId, NOTE_CONTENT_TAG, updatedNote);
      dispatch(action).then(() => setShowNotesEditor(false));
    },
    [experiment.experimentId, setExperimentTagApi, dispatch],
  );

  return (
    <CollapsibleSection
      title={
        <span css={styles.collapsibleSectionHeader}>
          <FormattedMessage
            defaultMessage="Description"
            description="Header for displaying notes for the experiment table"
          />{' '}
          {!showNotesEditor && (
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_experimentviewnotes.tsx_57"
              type="link"
              onClick={() => setShowNotesEditor(true)}
            >
              <FormattedMessage
                defaultMessage="Edit"
                // eslint-disable-next-line max-len
                description="Text for the edit button next to the description section title on the experiment view page"
              />
            </Button>
          )}
        </span>
      }
      forceOpen={showNotesEditor}
      defaultCollapsed={!storedNote}
      data-testid="experiment-notes-section"
    >
      <EditableNote
        defaultMarkdown={storedNote}
        onSubmit={handleSubmitEditNote}
        onCancel={() => setShowNotesEditor(false)}
        showEditor={showNotesEditor}
      />
    </CollapsibleSection>
  );
});

const styles = {
  collapsibleSectionHeader: {
    height: '32px',
    lineHeight: '32px',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewNotFound.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewNotFound.tsx

```typescript
import { Button, Empty, NoIcon } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';

export const ExperimentViewNotFound = () => {
  return (
    <div css={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        description={
          <FormattedMessage
            defaultMessage="Requested experiment was not found."
            description="A message shown on the experiment page if the experiment is not found"
          />
        }
        image={<NoIcon />}
        title={
          <FormattedMessage
            defaultMessage="Experiment not found"
            description="A title shown on the experiment page if the experiment is not found"
          />
        }
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsRequestError.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewRunsRequestError.tsx

```typescript
import { Empty, WarningIcon } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export const ExperimentViewRunsRequestError = ({ error }: { error?: Error | null }) => {
  const message = error?.message;

  return (
    <div css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        description={
          message ?? (
            <FormattedMessage
              defaultMessage="Your request could not be fulfilled. Please try again."
              description="A message shown on the experiment page if the runs request fails"
            />
          )
        }
        image={<WarningIcon />}
        title={
          <FormattedMessage
            defaultMessage="Request error"
            description="A title shown on the experiment page if the runs request fails"
          />
        }
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentViewTraces.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import { TracesView } from '../../traces/TracesView';
import {
  shouldEnableTracesV3View,
  isExperimentEvalResultsMonitoringUIEnabled,
} from '../../../../common/utils/FeatureUtils';
import { TracesV3View } from './traces-v3/TracesV3View';
import { useGetExperimentQuery } from '../../../hooks/useExperimentQuery';

export const ExperimentViewTraces = ({ experimentIds }: { experimentIds: string[] }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        minHeight: 225, // This is the exact height for displaying a minimum five rows and table header
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <TracesComponent experimentIds={experimentIds} />
    </div>
  );
};

const TracesComponent = ({ experimentIds }: { experimentIds: string[] }) => {
  // A cache-only query to get the loading state
  const { loading: isLoadingExperiment } = useGetExperimentQuery({
    experimentId: experimentIds[0],
    options: {
      fetchPolicy: 'cache-only',
    },
  });

  if (shouldEnableTracesV3View() || isExperimentEvalResultsMonitoringUIEnabled()) {
    return <TracesV3View experimentIds={experimentIds} isLoadingExperiment={isLoadingExperiment} />;
  }
  return <TracesView experimentIds={experimentIds} />;
};
```

--------------------------------------------------------------------------------

---[FILE: RunColorPill.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/RunColorPill.tsx
Signals: React

```typescript
// This media query applies to screens with a pixel density of 2 or higher

import { debounce } from 'lodash';
import { useMemo, useState } from 'react';
import { COLORS_PALETTE_DATALIST_ID } from '../../../../common/components/ColorsPaletteDatalist';
import { visuallyHidden } from '@databricks/design-system';

// and higher resolution values (e.g. Retina displays). 192 dpi is double the "default" historical 96 dpi.
const HIGH_RESOLUTION_MEDIA_QUERY = '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)';

const stripedHiddenBackgroundStyle = `repeating-linear-gradient(
  135deg,
  #959595 0,
  #e7e7e7 1px,
  #e7e7e7 2px,
  #959595 3px,
  #e7e7e7 4px,
  #e7e7e7 5px,
  #959595 6px,
  #e7e7e7 7px,
  #e7e7e7 8px,
  #959595 9px,
  #e7e7e7 10px,
  #e7e7e7 11px,
  #959595 12px,
  #e7e7e7 13px,
  #e7e7e7 14px
)`;

/**
 * Renders a colored rounded pill for a run.
 */
export const RunColorPill = ({
  color,
  hidden,
  onChangeColor,
  ...props
}: {
  color?: string;
  hidden?: boolean;
  onChangeColor?: (colorValue: string) => void;
}) => {
  const [colorValue, setColorValue] = useState<string | undefined>(undefined);

  const onChangeColorDebounced = useMemo(() => {
    // Implementations of <input type="color"> vary from browser to browser, some browser
    // fire an event on every color change so we debounce the event to avoid multiple
    // calls to the onChangeColor handler.
    if (onChangeColor) {
      return debounce(onChangeColor, 300);
    }
    return () => {};
  }, [onChangeColor]);

  return (
    <label
      css={{
        boxSizing: 'border-box',
        width: 12,
        height: 12,
        borderRadius: 6,
        flexShrink: 0,
        // Add a border to make the pill visible when using very light color
        border: `1px solid ${hidden ? 'transparent' : 'rgba(0,0,0,0.1)'}`,
        // Straighten it up on high-res screens
        [HIGH_RESOLUTION_MEDIA_QUERY]: {
          marginBottom: 1,
        },
        background: hidden ? stripedHiddenBackgroundStyle : undefined,
        cursor: onChangeColor ? 'pointer' : 'default',
        position: 'relative',
        '&:hover': {
          opacity: onChangeColor ? 0.8 : 1,
        },
      }}
      style={{ backgroundColor: colorValue ?? color ?? 'transparent' }}
      {...props}
    >
      <span
        css={[
          visuallyHidden,
          {
            userSelect: 'none',
          },
        ]}
      >
        {color}
      </span>
      {onChangeColor && (
        <input
          disabled={hidden}
          type="color"
          value={colorValue ?? color}
          onChange={({ target }) => {
            setColorValue(target.value);
            onChangeColorDebounced(target.value);
          }}
          list={COLORS_PALETTE_DATALIST_ID}
          css={{
            appearance: 'none',
            width: 0,
            height: 0,
            border: 0,
            padding: 0,
            position: 'absolute',
            bottom: 0,
            visibility: 'hidden',
          }}
        />
      )}
    </label>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentGetShareLinkModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/header/ExperimentGetShareLinkModal.test.tsx
Signals: React

```typescript
import { jest, describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { createExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { ExperimentGetShareLinkModal } from './ExperimentGetShareLinkModal';
import { MockedReduxStoreProvider } from '../../../../../common/utils/TestUtils';
import { render, screen, waitFor } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { setExperimentTagApi } from '../../../../actions';
import { shouldUseCompressedExperimentViewSharedState } from '../../../../../common/utils/FeatureUtils';
import { textDecompressDeflate } from '../../../../../common/utils/StringUtils';
import { IntlProvider } from 'react-intl';
import { setupTestRouter, testRoute, TestRouter } from '../../../../../common/utils/RoutingTestUtils';
import { DesignSystemProvider } from '@databricks/design-system';

jest.mock('../../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../../common/utils/FeatureUtils')>(
    '../../../../../common/utils/FeatureUtils',
  ),
  shouldUseCompressedExperimentViewSharedState: jest.fn(),
}));

jest.mock('../../../../../common/utils/StringUtils', () => {
  const windowCryptoSupported = Boolean(global.crypto?.subtle);
  // If window.crypto is not supported, provide a simple hex hashing function instead of SHA256
  if (!windowCryptoSupported) {
    return {
      ...jest.requireActual<typeof import('../../../../../common/utils/StringUtils')>(
        '../../../../../common/utils/StringUtils',
      ),
      getStringSHA256: (val: string) =>
        val.split('').reduce((hex, c) => hex + c.charCodeAt(0).toString(16).padStart(2, '0'), ''),
    };
  }
  return jest.requireActual<typeof import('../../../../../common/utils/StringUtils')>(
    '../../../../../common/utils/StringUtils',
  );
});

jest.mock('../../../../actions', () => ({
  ...jest.requireActual<typeof import('../../../../actions')>('../../../../actions'),
  setExperimentTagApi: jest.fn(() => ({ type: 'SET_EXPERIMENT_TAG_API', payload: Promise.resolve() })),
}));

const experimentIds = ['experiment-1'];

describe('ExperimentGetShareLinkModal', () => {
  const onCancel = jest.fn();
  const { history } = setupTestRouter();

  let navigatorClipboard: Clipboard;

  beforeAll(() => {
    navigatorClipboard = navigator.clipboard;
    // @ts-expect-error: navigator is overridable in tests
    navigator.clipboard = { writeText: jest.fn() };
  });

  afterAll(() => {
    jest.restoreAllMocks();
    // @ts-expect-error: navigator is overridable in tests
    navigator.clipboard = navigatorClipboard;
  });

  const renderExperimentGetShareLinkModal = (
    searchFacetsState = createExperimentPageSearchFacetsState(),
    uiState = createExperimentPageUIState(),
    initialUrl = '/',
  ) => {
    const Component = ({
      searchFacetsState,
      uiState,
    }: {
      searchFacetsState: ExperimentPageSearchFacetsState;
      uiState: ExperimentPageUIState;
    }) => {
      const [visible, setVisible] = useState(false);
      return (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <MockedReduxStoreProvider>
              <button onClick={() => setVisible(true)}>get link</button>
              <ExperimentGetShareLinkModal
                experimentIds={experimentIds}
                onCancel={onCancel}
                searchFacetsState={searchFacetsState}
                uiState={uiState}
                visible={visible}
              />
            </MockedReduxStoreProvider>
          </DesignSystemProvider>
        </IntlProvider>
      );
    };
    const { rerender } = render(<Component searchFacetsState={searchFacetsState} uiState={uiState} />, {
      wrapper: ({ children }) => (
        <TestRouter routes={[testRoute(<>{children}</>, '/')]} history={history} initialEntries={[initialUrl]} />
      ),
    });
    return {
      rerender: (
        searchFacetsState = createExperimentPageSearchFacetsState(),
        uiState = createExperimentPageUIState(),
      ) => rerender(<Component searchFacetsState={searchFacetsState} uiState={uiState} />),
    };
  };

  test.each([true, false])(
    'copies the shareable URL and expects to reuse the same tag for identical view state when compression enabled: %s',
    async (isCompressionEnabled) => {
      jest.mocked(shouldUseCompressedExperimentViewSharedState).mockImplementation(() => isCompressionEnabled);

      // Initial facets and UI state
      const initialSearchState = { ...createExperimentPageSearchFacetsState(), searchFilter: 'metrics.m1 = 2' };
      const initialUIState = { ...createExperimentPageUIState(), viewMaximized: true };

      // Render the modal and open it
      renderExperimentGetShareLinkModal(initialSearchState, initialUIState);
      await waitFor(() => expect(screen.getByText('get link')).toBeInTheDocument());
      await userEvent.click(screen.getByText('get link'));

      // Wait for the link and tag to be processed and copy button to be visible
      await waitFor(() => {
        expect(screen.getByTestId('share-link-copy-button')).toBeInTheDocument();
      });

      // Click the copy button and assert that the URL was copied to the clipboard
      await userEvent.click(screen.getByTestId('share-link-copy-button'));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringMatching(/\/experiments\/experiment-1\?viewStateShareKey=([0-9a-f]+)/i),
      );

      // Assert that the tag was created with the correct name and serialized state
      expect(setExperimentTagApi).toHaveBeenCalledWith(
        'experiment-1',
        expect.stringMatching(/mlflow\.sharedViewState\.([0-9a-f]+)/),
        // Assert serialized state in the next step
        expect.anything(),
      );
      const serializedTagValue = jest.mocked(setExperimentTagApi).mock.lastCall?.[2];

      const serializedState = isCompressionEnabled
        ? JSON.parse(await textDecompressDeflate(serializedTagValue))
        : JSON.parse(serializedTagValue);

      expect(serializedState).toEqual({
        ...initialSearchState,
        ...initialUIState,
      });
    },
  );

  test('propagate experiment page view mode', async () => {
    const initialSearchState = { ...createExperimentPageSearchFacetsState(), searchFilter: 'metrics.m1 = 2' };
    const initialUIState = { ...createExperimentPageUIState(), viewMaximized: true };

    renderExperimentGetShareLinkModal(initialSearchState, initialUIState, '/?compareRunsMode=CHART');
    await waitFor(() => expect(screen.getByText('get link')).toBeInTheDocument());

    await userEvent.click(screen.getByText('get link'));

    // Expect shareable URL to contain the view mode query param
    await waitFor(() => expect(screen.getByRole<HTMLInputElement>('textbox').value).toContain('compareRunsMode=CHART'));
  });

  test('reuse the same tag for identical view state', async () => {
    // Initial facets and UI state
    const initialSearchState = { ...createExperimentPageSearchFacetsState(), searchFilter: 'metrics.m1 = 2' };
    const initialUIState = { ...createExperimentPageUIState(), viewMaximized: true };

    // Render the modal and open it
    const { rerender } = renderExperimentGetShareLinkModal(initialSearchState, initialUIState);

    await waitFor(() => expect(screen.getByText('get link')).toBeInTheDocument());

    await userEvent.click(screen.getByText('get link'));

    // Wait for the link and tag to be processed and copy button to be visible
    await waitFor(() => {
      expect(screen.getByTestId('share-link-copy-button')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('share-link-copy-button'));

    // Save the first persisted tag name (containing serialized state hash)
    const firstSavedTagName = jest.mocked(setExperimentTagApi).mock.lastCall?.[1];

    // Update the search state and UI state, rerender the modal
    const updatedSearchState = { ...initialSearchState, searchFilter: 'metrics.m1 = 5' };
    const updatedUIState = { ...initialUIState, viewMaximized: false };
    rerender(updatedSearchState, updatedUIState);

    // Click the copy button
    await waitFor(() => {
      expect(screen.getByTestId('share-link-copy-button')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('share-link-copy-button'));

    // Save the second persisted tag name (containing serialized state hash), should be different from the first one
    const secondSavedTagName = jest.mocked(setExperimentTagApi).mock.lastCall?.[1];
    expect(firstSavedTagName).not.toEqual(secondSavedTagName);

    // Change the search state and UI state back to the initial values (but with new object references)
    const revertedSearchState = { ...updatedSearchState, searchFilter: 'metrics.m1 = 2' };
    const revertedUIState = { ...updatedUIState, viewMaximized: true };
    rerender(revertedSearchState, revertedUIState);

    await waitFor(() => {
      expect(screen.getByTestId('share-link-copy-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('share-link-copy-button'));

    // Assert the third persisted tag name, should be the same as the first one
    const lastSavedTagName = jest.mocked(setExperimentTagApi).mock.lastCall?.[1];
    expect(lastSavedTagName).toEqual(firstSavedTagName);
  });
});
```

--------------------------------------------------------------------------------

````
