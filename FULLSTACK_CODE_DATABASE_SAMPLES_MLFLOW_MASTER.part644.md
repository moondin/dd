---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 644
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 644 of 991)

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

---[FILE: ModelTraceHeaderSessionIdTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceHeaderSessionIdTag.tsx
Signals: React

```typescript
import { useCallback } from 'react';

import {
  NewWindowIcon,
  SpeechBubbleIcon,
  Tag,
  Tooltip,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { SELECTED_TRACE_ID_QUERY_PARAM } from '../../../experiment-tracking/constants';
import { getExperimentChatSessionPageRoute } from './MlflowUtils';
import { ModelTraceHeaderMetricSection } from './ModelTraceExplorerMetricSection';
import { Link, useLocation } from './RoutingUtils';

const ID_MAX_LENGTH = 10;

export const ModelTraceHeaderSessionIdTag = ({
  experimentId,
  sessionId,
  traceId,
  handleCopy,
}: {
  experimentId: string;
  sessionId: string;
  traceId?: string;
  handleCopy: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const location = useLocation();
  const truncatedSessionId = sessionId.length > ID_MAX_LENGTH ? `${sessionId.slice(0, ID_MAX_LENGTH)}...` : sessionId;
  const getTruncatedLabel = useCallback(
    (label: string) => (label.length > ID_MAX_LENGTH ? `${label.slice(0, ID_MAX_LENGTH)}...` : label),
    [],
  );

  const baseUrl = getExperimentChatSessionPageRoute(experimentId, sessionId);
  const sessionPageUrl = traceId
    ? `${baseUrl}?${new URLSearchParams({ [SELECTED_TRACE_ID_QUERY_PARAM]: traceId }).toString()}`
    : baseUrl;

  // If already on the session page, clicking the Session ID should copy it to clipboard
  // instead of navigating (which would be a no-op)
  const isOnSessionPage = location.pathname.includes(`/chat-sessions/${sessionId}`);

  if (isOnSessionPage) {
    return (
      <ModelTraceHeaderMetricSection
        label={<FormattedMessage defaultMessage="Session ID" description="Label for the session id section" />}
        icon={<SpeechBubbleIcon css={{ fontSize: 12, display: 'flex' }} />}
        value={sessionId}
        color="default"
        getTruncatedLabel={getTruncatedLabel}
        onCopy={handleCopy}
      />
    );
  }

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
      }}
    >
      <Typography.Text size="md" color="secondary">
        <FormattedMessage defaultMessage="Session ID" description="Label for the session id section" />
      </Typography.Text>
      <Tooltip
        componentId="mlflow.model-trace-explorer.session-id-tag"
        content={<FormattedMessage defaultMessage="View chat session" description="Tooltip for the session id tag" />}
      >
        <Link to={sessionPageUrl}>
          <Tag componentId="mlflow.model_trace_explorer.header_details.tag-session-id">
            <span css={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
              <SpeechBubbleIcon css={{ fontSize: 12 }} />
              <span>{truncatedSessionId}</span>
            </span>
          </Tag>
        </Link>
      </Tooltip>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceHeaderStatusTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceHeaderStatusTag.tsx
Signals: React

```typescript
import React from 'react';
import { useIntl, FormattedMessage } from '@databricks/i18n';
import { ClockIcon, CheckCircleIcon, XCircleIcon, TagColors, useDesignSystemTheme } from '@databricks/design-system';

import { type ModelTraceState } from './ModelTrace.types';
import { ModelTraceHeaderMetricSection } from './ModelTraceExplorerMetricSection';

type Props = {
  statusState: ModelTraceState;
  getTruncatedLabel: (label: string) => string;
};

type StatusConfig = {
  label: string;
  icon: React.ReactNode;
  color: TagColors;
};

export const ModelTraceHeaderStatusTag = ({ statusState, getTruncatedLabel }: Props) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const getStatusConfig = (
    statusState: ModelTraceState,
    intl: ReturnType<typeof useIntl>,
    theme: ReturnType<typeof useDesignSystemTheme>['theme'],
  ): StatusConfig | null => {
    const statusMap: Record<ModelTraceState, StatusConfig | null> = {
      IN_PROGRESS: {
        label: intl.formatMessage({
          defaultMessage: 'In progress',
          description: 'Model trace header > status label > in progress',
        }),
        icon: <ClockIcon css={{ color: theme.colors.textValidationWarning }} />,
        color: 'lemon' as TagColors,
      },
      OK: {
        label: intl.formatMessage({ defaultMessage: 'OK', description: 'Model trace header > status label > ok' }),
        icon: <CheckCircleIcon css={{ color: theme.colors.textValidationSuccess }} />,
        color: 'teal' as TagColors,
      },
      ERROR: {
        label: intl.formatMessage({
          defaultMessage: 'Error',
          description: 'Model trace header > status label > error',
        }),
        icon: <XCircleIcon css={{ color: theme.colors.textValidationDanger }} />,
        color: 'coral' as TagColors,
      },
      STATE_UNSPECIFIED: null,
    };
    return statusMap[statusState];
  };
  const status = getStatusConfig(statusState, intl, theme);

  if (!status) {
    return null;
  }

  return (
    <ModelTraceHeaderMetricSection
      label={<FormattedMessage defaultMessage="Status" description="Label for the status section" />}
      value={status.label}
      color={status.color}
      icon={status.icon}
      getTruncatedLabel={getTruncatedLabel}
      onCopy={() => {}}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: routes.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/routes.ts

```typescript
/**
 * This file contains a subset of mlflow/server/js/src/experiment-tracking/routes.tsx to be used in the model-trace-explorer.
 */
import { createMLflowRoutePath, generatePath } from './RoutingUtils';

// Route path definitions (used in defining route elements)
const createExperimentPageRoutePath = () => createMLflowRoutePath('/experiments/:experimentId');

export const getExperimentPageRoute = (experimentId: string) => {
  return generatePath(createExperimentPageRoutePath(), { experimentId });
};

export const getExperimentPageTracesTabRoute = (experimentId: string) => {
  return `${getExperimentPageRoute(experimentId)}/traces`;
};
```

--------------------------------------------------------------------------------

---[FILE: RoutingUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/RoutingUtils.tsx
Signals: React

```typescript
/**
 * This file is the only one that should directly import from 'react-router-dom' module
 */
/* eslint-disable no-restricted-imports */

import type { ComponentProps } from 'react';
import {
  generatePath,
  useParams as useParamsDirect,
  useLocation as useLocationDirect,
  Link as LinkDirect,
} from 'react-router-dom';

import { Typography } from '@databricks/design-system';

const useParams = useParamsDirect;
const useLocation = useLocationDirect;

const Link = LinkDirect;

export const createMLflowRoutePath = (routePath: string) => {
  return routePath;
};

export { generatePath, useParams, useLocation, Link };
```

--------------------------------------------------------------------------------

---[FILE: SimplifiedModelTraceExplorer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/SimplifiedModelTraceExplorer.test.tsx

```typescript
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import type { Assessment } from './ModelTrace.types';
import { MOCK_ASSESSMENT, MOCK_SPAN_ASSESSMENT, MOCK_TRACE, MOCK_V3_TRACE } from './ModelTraceExplorer.test-utils';
import { SimplifiedModelTraceExplorerImpl } from './SimplifiedModelTraceExplorer';

jest.mock('./hooks/useGetModelTraceInfo', () => ({
  useGetModelTraceInfo: jest.fn().mockReturnValue({
    refetch: jest.fn(),
  }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </DesignSystemProvider>
    </IntlProvider>
  );
};

describe('SimplifiedModelTraceExplorer', () => {
  it('renders the component with trace data and assessments', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT, MOCK_SPAN_ASSESSMENT];

    render(<SimplifiedModelTraceExplorerImpl modelTrace={MOCK_TRACE} assessments={assessments} />, {
      wrapper: Wrapper,
    });

    // Assert that inputs/outputs sections are rendered (these are always visible)
    expect(screen.getByText('Inputs')).toBeInTheDocument();
    expect(screen.getByText('Outputs')).toBeInTheDocument();

    // Assert that assessment cards are rendered
    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('Thumbs')).toBeInTheDocument();
  });

  it('displays trace breakdown in left pane', () => {
    render(<SimplifiedModelTraceExplorerImpl modelTrace={MOCK_V3_TRACE} assessments={[]} />, {
      wrapper: Wrapper,
    });

    // Check that inputs/outputs sections are present (these are always visible)
    expect(screen.getByText('Inputs')).toBeInTheDocument();
    expect(screen.getByText('Outputs')).toBeInTheDocument();
  });

  it('displays assessments in right pane', () => {
    const assessments: Assessment[] = [MOCK_ASSESSMENT];

    render(<SimplifiedModelTraceExplorerImpl modelTrace={MOCK_TRACE} assessments={assessments} />, {
      wrapper: Wrapper,
    });

    // Check that assessment is rendered
    expect(screen.getByText('Relevance')).toBeInTheDocument();
    expect(screen.getByText('The thought process is sound and follows from the request')).toBeInTheDocument();
  });

  it('displays "No assessments available" when assessments array is empty', () => {
    render(<SimplifiedModelTraceExplorerImpl modelTrace={MOCK_TRACE} assessments={[]} />, {
      wrapper: Wrapper,
    });

    // Check that empty state message is shown
    expect(screen.getByText('No assessments available')).toBeInTheDocument();
  });

  it('does not render render mode selector in summary view', () => {
    render(<SimplifiedModelTraceExplorerImpl modelTrace={MOCK_TRACE} assessments={[]} />, {
      wrapper: Wrapper,
    });

    // Check that render mode selector is not present
    expect(screen.queryByText('Default')).not.toBeInTheDocument();
    expect(screen.queryByText('JSON')).not.toBeInTheDocument();
  });

  it('renders intermediate nodes correctly', () => {
    render(<SimplifiedModelTraceExplorerImpl modelTrace={MOCK_TRACE} assessments={[]} />, {
      wrapper: Wrapper,
    });

    // Check that important intermediate nodes are rendered
    // The MOCK_TRACE has CHAT_MODEL and LLM type spans which are important
    expect(screen.getByText('_generate_response')).toBeInTheDocument();
    expect(screen.getByText('rephrase_chat_to_queue')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SimplifiedModelTraceExplorer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/SimplifiedModelTraceExplorer.tsx
Signals: React

```typescript
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import type { Assessment, ModelTrace } from './ModelTrace.types';
import { getModelTraceId, useIntermediateNodes } from './ModelTraceExplorer.utils';
import { ModelTraceExplorerErrorState } from './ModelTraceExplorerErrorState';
import { ModelTraceExplorerGenericErrorState } from './ModelTraceExplorerGenericErrorState';
import ModelTraceExplorerResizablePane from './ModelTraceExplorerResizablePane';
import {
  ModelTraceExplorerViewStateProvider,
  useModelTraceExplorerViewState,
} from './ModelTraceExplorerViewStateContext';
import { SimplifiedAssessmentView, SIMPLIFIED_ASSESSMENT_VIEW_MIN_WIDTH } from './right-pane/SimplifiedAssessmentView';
import { ModelTraceExplorerSummarySpans, SUMMARY_SPANS_MIN_WIDTH } from './summary-view/ModelTraceExplorerSummarySpans';

const SimplifiedModelTraceExplorerContent = ({ assessments }: { assessments: Assessment[] }) => {
  const [paneWidth, setPaneWidth] = useState(500);
  const { rootNode } = useModelTraceExplorerViewState();
  const intermediateNodes = useIntermediateNodes(rootNode);

  if (!rootNode) {
    return null;
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <ModelTraceExplorerResizablePane
        initialRatio={0.5}
        paneWidth={paneWidth}
        setPaneWidth={setPaneWidth}
        leftChild={
          <ModelTraceExplorerSummarySpans
            rootNode={rootNode}
            intermediateNodes={intermediateNodes}
            hideRenderModeSelector
          />
        }
        rightChild={<SimplifiedAssessmentView assessments={assessments} />}
        leftMinWidth={SUMMARY_SPANS_MIN_WIDTH}
        rightMinWidth={SIMPLIFIED_ASSESSMENT_VIEW_MIN_WIDTH}
      />
    </div>
  );
};

const ContextProviders = ({ children }: { traceId: string; children: React.ReactNode }) => {
  return <ErrorBoundary fallbackRender={ModelTraceExplorerErrorState}>{children}</ErrorBoundary>;
};

export const SimplifiedModelTraceExplorerImpl = ({
  modelTrace: initialModelTrace,
  assessments,
}: {
  modelTrace: ModelTrace;
  assessments: Assessment[];
}) => {
  const traceId = getModelTraceId(initialModelTrace);

  return (
    <ContextProviders traceId={traceId}>
      <ModelTraceExplorerViewStateProvider modelTrace={initialModelTrace} assessmentsPaneEnabled>
        <SimplifiedModelTraceExplorerContent assessments={assessments} />
      </ModelTraceExplorerViewStateProvider>
    </ContextProviders>
  );
};

export const SimplifiedModelTraceExplorer = SimplifiedModelTraceExplorerImpl;
```

--------------------------------------------------------------------------------

---[FILE: TagUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/TagUtils.ts

```typescript
import { truncate, takeWhile } from 'lodash';

export const MLFLOW_INTERNAL_PREFIX = 'mlflow.';
const MLFLOW_INTERNAL_PREFIX_UC = '_mlflow_';

export const isUserFacingTag = (tagKey: string) =>
  !tagKey.startsWith(MLFLOW_INTERNAL_PREFIX) && !tagKey.startsWith(MLFLOW_INTERNAL_PREFIX_UC);

// Safe JSON.parse that returns undefined instead of throwing an error
export const parseJSONSafe = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
};

export const truncateToFirstLineWithMaxLength = (str: string, maxLength: number): string => {
  const truncated = truncate(str, {
    length: maxLength,
  });
  return takeWhile(truncated, (char) => char !== '\n').join('');
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentActionsOverflowMenu.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentActionsOverflowMenu.tsx

```typescript
import { PencilIcon, TrashIcon, OverflowIcon, Button, DropdownMenu } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';

import type { Assessment } from '../ModelTrace.types';

export const AssessmentActionsOverflowMenu = ({
  assessment,
  setIsEditing,
  setShowDeleteModal,
}: {
  assessment: Assessment;
  setIsEditing?: (isEditing: boolean) => void;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
}) => {
  const isFeedback = 'feedback' in assessment;
  const user = getUser() ?? '';

  const doesUserHavePermissions =
    user === assessment.source.source_id || (isFeedback && assessment.source.source_type !== 'HUMAN');
  const showEditButton = doesUserHavePermissions && setIsEditing;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button componentId="shared.model-trace-explorer.assessment-more-button" icon={<OverflowIcon />} size="small" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content minWidth={100}>
        {showEditButton && (
          <DropdownMenu.Item
            componentId="shared.model-trace-explorer.assessment-edit-button"
            onClick={() => setIsEditing?.(true)}
          >
            <DropdownMenu.IconWrapper>
              <PencilIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage defaultMessage="Edit" description="Edit assessment menu item" />
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Item
          componentId="shared.model-trace-explorer.assessment-delete-button"
          onClick={() => setShowDeleteModal(true)}
        >
          <DropdownMenu.IconWrapper>
            <TrashIcon />
          </DropdownMenu.IconWrapper>
          <FormattedMessage defaultMessage="Delete" description="Delete assessment menu item" />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentCreateButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentCreateButton.tsx
Signals: React

```typescript
import { useEffect, useRef, useState } from 'react';

import { Button, PlusIcon } from '@databricks/design-system';

import { AssessmentCreateForm } from './AssessmentCreateForm';

export const AssessmentCreateButton = ({
  title,
  assessmentName,
  spanId,
  traceId,
}: {
  title: React.ReactNode;
  assessmentName?: string;
  spanId?: string;
  traceId: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && ref.current) {
      // scroll form into view after the form is expanded
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [expanded]);

  return (
    <div>
      <Button
        size="small"
        componentId="shared.model-trace-explorer.add-new-assessment"
        icon={<PlusIcon />}
        onClick={() => setExpanded(true)}
      >
        {title}
      </Button>
      {expanded && (
        <AssessmentCreateForm
          ref={ref}
          assessmentName={assessmentName}
          spanId={spanId}
          traceId={traceId}
          setExpanded={setExpanded}
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentCreateForm.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentCreateForm.test.tsx

```typescript
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import { AssessmentCreateForm } from './AssessmentCreateForm';
import type { Assessment } from '../ModelTrace.types';
import { MOCK_ASSESSMENT, MOCK_EXPECTATION } from '../ModelTraceExplorer.test-utils';
import { AssessmentSchemaContextProvider } from '../contexts/AssessmentSchemaContext';

// Mock the hooks
jest.mock('../hooks/useCreateAssessment', () => ({
  useCreateAssessment: jest.fn(() => ({
    createAssessmentMutation: jest.fn(),
    isLoading: false,
  })),
}));

const TestWrapper = ({ children, assessments = [] }: { children: React.ReactNode; assessments?: Assessment[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <QueryClientProvider client={queryClient}>
          <AssessmentSchemaContextProvider assessments={assessments}>{children}</AssessmentSchemaContextProvider>
        </QueryClientProvider>
      </DesignSystemProvider>
    </IntlProvider>
  );
};

describe('AssessmentCreateForm', () => {
  const mockSetExpanded = jest.fn();
  const defaultProps = {
    traceId: 'test-trace-id',
    setExpanded: mockSetExpanded,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleChangeSchema - existing schemas', () => {
    it('should update all fields when selecting an existing schema', async () => {
      const user = userEvent.setup();

      // Mock existing assessments to populate schemas
      const existingAssessments: Assessment[] = [
        MOCK_ASSESSMENT, // name: 'Relevance', feedback (string type)
        MOCK_EXPECTATION, // name: 'expected_facts', expectation (json type)
      ];

      render(
        <TestWrapper assessments={existingAssessments}>
          <AssessmentCreateForm {...defaultProps} />
        </TestWrapper>,
      );

      // Get the select buttons
      const assessmentTypeSelect = screen.getByLabelText('Assessment Type') as HTMLButtonElement;
      const dataTypeSelect = screen.getByLabelText('Data Type') as HTMLButtonElement;

      expect(assessmentTypeSelect).toBeInTheDocument();
      expect(dataTypeSelect).toBeInTheDocument();

      // Verify initial values
      expect(assessmentTypeSelect).toHaveTextContent('Feedback');
      expect(dataTypeSelect).toHaveTextContent('Boolean');

      // Change assessment type to expectation and data type to number
      await user.click(assessmentTypeSelect);
      await user.click(screen.getByText('Expectation'));
      await waitFor(() => {
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
      });

      await user.click(dataTypeSelect);
      await user.click(screen.getAllByText('Number')[0]);
      await waitFor(() => {
        expect(dataTypeSelect).toHaveTextContent('Number');
      });

      // Open the name typeahead
      const nameInput = screen.getByPlaceholderText('Enter an assessment name');
      await user.click(nameInput);

      // Select an existing schema (expected_facts which is expectation/json)
      await waitFor(() => {
        expect(screen.getByText('expected_facts')).toBeInTheDocument();
      });
      await user.click(screen.getByText('expected_facts'));

      // All fields should be updated to match the schema
      await waitFor(() => {
        expect(nameInput).toHaveValue('expected_facts');
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
        expect(dataTypeSelect).toHaveTextContent('JSON');
      });
    });
  });

  describe('handleChangeSchema - new assessment names', () => {
    it('should preserve user-selected fields when typing a new assessment name', async () => {
      const user = userEvent.setup();

      // Mock existing assessments to populate schemas
      const existingAssessments: Assessment[] = [MOCK_ASSESSMENT];

      render(
        <TestWrapper assessments={existingAssessments}>
          <AssessmentCreateForm {...defaultProps} />
        </TestWrapper>,
      );

      // Get the select buttons
      const assessmentTypeSelect = screen.getByLabelText('Assessment Type') as HTMLButtonElement;
      const dataTypeSelect = screen.getByLabelText('Data Type') as HTMLButtonElement;

      // Change assessment type to expectation and data type to number
      await user.click(assessmentTypeSelect);
      await user.click(screen.getByText('Expectation'));
      await waitFor(() => {
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
      });

      await user.click(dataTypeSelect);
      await user.click(screen.getByText('Number'));
      await waitFor(() => {
        expect(dataTypeSelect).toHaveTextContent('Number');
      });

      // Type a new assessment name that doesn't exist in schemas
      const nameInput = screen.getByPlaceholderText('Enter an assessment name');
      await user.type(nameInput, 'my_new_assessment');

      // Open the dropdown
      await user.click(nameInput);

      // The new name should appear in the typeahead
      await waitFor(() => {
        expect(screen.getByText('my_new_assessment')).toBeInTheDocument();
      });

      // Select the new name
      await user.click(screen.getByText('my_new_assessment'));

      // Name should be updated, but assessment type and data type should be preserved
      await waitFor(() => {
        expect(nameInput).toHaveValue('my_new_assessment');
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
        expect(dataTypeSelect).toHaveTextContent('Number');
      });
    });

    it('should preserve user-selected fields when pressing Enter on a new name', async () => {
      const user = userEvent.setup();

      const existingAssessments: Assessment[] = [MOCK_ASSESSMENT];

      render(
        <TestWrapper assessments={existingAssessments}>
          <AssessmentCreateForm {...defaultProps} />
        </TestWrapper>,
      );

      // Get the select buttons
      const assessmentTypeSelect = screen.getByLabelText('Assessment Type') as HTMLButtonElement;
      const dataTypeSelect = screen.getByLabelText('Data Type') as HTMLButtonElement;

      // Change to non-default values
      await user.click(assessmentTypeSelect);
      await user.click(screen.getByText('Expectation'));

      await user.click(dataTypeSelect);
      await user.click(screen.getAllByText('String')[0]);

      await waitFor(() => {
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
        expect(dataTypeSelect).toHaveTextContent('String');
      });

      // Type a new name and press Enter
      const nameInput = screen.getByPlaceholderText('Enter an assessment name');
      await user.type(nameInput, 'another_new_name');
      await user.keyboard('{Enter}');

      // Fields should be preserved
      await waitFor(() => {
        expect(nameInput).toHaveValue('another_new_name');
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
        expect(dataTypeSelect).toHaveTextContent('String');
      });
    });
  });

  describe('handleChangeSchema - clearing selection', () => {
    it('should reset all fields when clearing the name', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper assessments={[MOCK_ASSESSMENT]}>
          <AssessmentCreateForm {...defaultProps} />
        </TestWrapper>,
      );

      // Get the select button
      const assessmentTypeSelect = screen.getByLabelText('Assessment Type') as HTMLButtonElement;

      // Change some values
      await user.click(assessmentTypeSelect);
      await user.click(screen.getByText('Expectation'));

      const nameInput = screen.getByPlaceholderText('Enter an assessment name');
      await user.type(nameInput, 'test_name');

      // Clear the input (simulating the clear button)
      await user.clear(nameInput);

      // All fields should reset to defaults
      await waitFor(() => {
        expect(nameInput).toHaveValue('');
        // Note: We can't easily test the internal state reset here
        // as the selects may not visibly change until interaction
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty schemas list', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper assessments={[]}>
          <AssessmentCreateForm {...defaultProps} />
        </TestWrapper>,
      );

      // Get the select buttons
      const assessmentTypeSelect = screen.getByLabelText('Assessment Type') as HTMLButtonElement;
      const dataTypeSelect = screen.getByLabelText('Data Type') as HTMLButtonElement;

      // Change to non-default values
      await user.click(assessmentTypeSelect);
      await user.click(screen.getByText('Expectation'));

      await user.click(dataTypeSelect);
      await user.click(screen.getByText('Number'));

      await waitFor(() => {
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
        expect(dataTypeSelect).toHaveTextContent('Number');
      });

      // Type a name when there are no existing schemas
      const nameInput = screen.getByPlaceholderText('Enter an assessment name');
      await user.type(nameInput, 'first_assessment');
      await user.keyboard('{Enter}');

      // Fields should be preserved since this is a new name
      await waitFor(() => {
        expect(nameInput).toHaveValue('first_assessment');
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
        expect(dataTypeSelect).toHaveTextContent('Number');
      });
    });

    it('should handle schema with same name as typed value', async () => {
      const user = userEvent.setup();

      const existingAssessments: Assessment[] = [MOCK_ASSESSMENT]; // name: 'Relevance'

      render(
        <TestWrapper assessments={existingAssessments}>
          <AssessmentCreateForm {...defaultProps} />
        </TestWrapper>,
      );

      // Get the select buttons
      const assessmentTypeSelect = screen.getByLabelText('Assessment Type') as HTMLButtonElement;
      const dataTypeSelect = screen.getByLabelText('Data Type') as HTMLButtonElement;

      // Change values first
      await user.click(assessmentTypeSelect);
      await user.click(screen.getByText('Expectation'));

      await waitFor(() => {
        expect(assessmentTypeSelect).toHaveTextContent('Expectation');
      });

      // Type the exact name of an existing schema
      const nameInput = screen.getByPlaceholderText('Enter an assessment name');
      await user.type(nameInput, 'Relevance');
      await user.click(nameInput);

      // Select it from the dropdown
      await waitFor(() => {
        expect(screen.getByTestId('assessment-name-typeahead-item-Relevance')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('assessment-name-typeahead-item-Relevance'));

      // Since 'Relevance' is an existing schema (feedback/string), it should update all fields
      await waitFor(() => {
        expect(nameInput).toHaveValue('Relevance');
        expect(assessmentTypeSelect).toHaveTextContent('Feedback');
        expect(dataTypeSelect).toHaveTextContent('String');
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````
