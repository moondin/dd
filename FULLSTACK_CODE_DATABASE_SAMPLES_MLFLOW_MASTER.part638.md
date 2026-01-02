---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 638
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 638 of 991)

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

---[FILE: constants.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/constants.ts

```typescript
export const ACTIVE_HIGHLIGHT_COLOR = 'yellow500';
export const INACTIVE_HIGHLIGHT_COLOR = 'yellow200';

// Trace tag keys
export const MLFLOW_TRACE_SOURCE_SCORER_NAME_TAG = 'mlflow.trace.sourceScorer';
// Assessment metadata keys
export const MLFLOW_ASSESSMENT_SOURCE_RUN_ID = 'mlflow.assessment.sourceRunId';
export const MLFLOW_ASSESSMENT_SCORER_TRACE_ID = 'mlflow.assessment.scorerTraceId';
export const MLFLOW_ASSESSMENT_JUDGE_COST = 'mlflow.assessment.judgeCost';

// Various metadata keys used in traces
export const SESSION_ID_METADATA_KEY = 'mlflow.trace.session';
export const SOURCE_NAME_METADATA_KEY = 'mlflow.source.name';
export const SOURCE_TYPE_METADATA_KEY = 'mlflow.source.type';
export const TOKEN_USAGE_METADATA_KEY = 'mlflow.trace.tokenUsage';
export const MLFLOW_TRACE_USER_KEY = 'mlflow.trace.user';
```

--------------------------------------------------------------------------------

---[FILE: FeatureUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/FeatureUtils.ts

```typescript
export const shouldBlockLargeTraceDisplay = () => {
  return false;
};

// controls the size (in bytes) of a trace that is considered too large
// to display. default to 1gb for a safe limit to always display traces
export const getLargeTraceDisplaySizeThreshold = () => {
  return 1e9;
};

/**
 * Determines if traces V4 API should be used to fetch traces
 */
export const shouldUseTracesV4API = () => {
  return false;
};

/**
 * Determines if the new labeling schemas UI in trace assessments pane is enabled.
 * This feature allows users to configure feedback schemas at the experiment level
 * for labeling traces in the Traces tab.
 */
export const shouldEnableTracesTabLabelingSchemas = () => {
  return false;
};

/**
 * Determines if assessments/scores should be shown in experiment chat sessions.
 */
export const shouldEnableAssessmentsInSessions = () => {
  return true;
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/index.ts

```typescript
export { ModelTraceExplorer } from './ModelTraceExplorer';
export { SimplifiedModelTraceExplorer } from './SimplifiedModelTraceExplorer';
export { ExpectationValuePreview } from './assessments-pane/ExpectationValuePreview';
export { ModelTraceExplorerSkeleton } from './ModelTraceExplorerSkeleton';
export { ModelTraceExplorerOSSNotebookRenderer } from './oss-notebook-renderer/ModelTraceExplorerOSSNotebookRenderer';
export { default as ModelTraceExplorerResizablePane } from './ModelTraceExplorerResizablePane';
export type { ModelTraceExplorerResizablePaneRef } from './ModelTraceExplorerResizablePane';
export {
  isModelTrace,
  isV3ModelTraceInfo,
  isV3ModelTraceSpan,
  getModelTraceSpanEndTime,
  getModelTraceSpanStartTime,
  getModelTraceSpanId,
  getModelTraceSpanParentId,
  getModelTraceId,
  tryDeserializeAttribute,
  parseTraceUri,
  getTotalTokens,
  displayErrorNotification,
  displaySuccessNotification,
} from './ModelTraceExplorer.utils';
export {
  SESSION_ID_METADATA_KEY,
  SOURCE_NAME_METADATA_KEY,
  SOURCE_TYPE_METADATA_KEY,
  TOKEN_USAGE_METADATA_KEY,
  MLFLOW_TRACE_USER_KEY,
} from './constants';
export { shouldEnableTracesTabLabelingSchemas, shouldEnableAssessmentsInSessions } from './FeatureUtils';
export { AssessmentSchemaContextProvider, type AssessmentSchema } from './contexts/AssessmentSchemaContext';
export * from './ModelTrace.types';
export * from './oss-notebook-renderer/mlflow-fetch-utils';

export { getAssessmentValue } from './assessments-pane/utils';
export { TracesServiceV4 } from './api';
export { shouldUseTracesV4API } from './FeatureUtils';
export { useUnifiedTraceTagsModal } from './hooks/useUnifiedTraceTagsModal';
export { ModelTraceExplorerUpdateTraceContextProvider } from './contexts/UpdateTraceContext';
export { SingleChatTurnMessages } from './session-view/SingleChatTurnMessages';
export { ModelTraceExplorerChatMessage } from './right-pane/ModelTraceExplorerChatMessage';
export { SingleChatTurnAssessments } from './session-view/SingleChatTurnAssessments';
```

--------------------------------------------------------------------------------

---[FILE: MlflowUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/MlflowUtils.tsx

```typescript
import { createMLflowRoutePath } from './RoutingUtils';

export const getExperimentChatSessionPageRoute = (experimentId: string, sessionId: string) => {
  return createMLflowRoutePath(`/experiments/${experimentId}/chat-sessions/${sessionId}`);
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTrace.types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTrace.types.ts

```typescript
import type { TimelineTreeNode } from './timeline-tree';

export const MLFLOW_TRACE_SCHEMA_VERSION_KEY = 'mlflow.trace_schema.version';

// column name for mlflow trace data in inference tables
export const INFERENCE_TABLE_RESPONSE_COLUMN_KEY = 'response';
export const INFERENCE_TABLE_TRACE_COLUMN_KEY = 'trace';

export type ModelTraceExplorerRenderMode = 'default' | 'json';

export enum ModelSpanType {
  LLM = 'LLM',
  CHAIN = 'CHAIN',
  AGENT = 'AGENT',
  TOOL = 'TOOL',
  FUNCTION = 'FUNCTION',
  CHAT_MODEL = 'CHAT_MODEL',
  RETRIEVER = 'RETRIEVER',
  PARSER = 'PARSER',
  EMBEDDING = 'EMBEDDING',
  RERANKER = 'RERANKER',
  MEMORY = 'MEMORY',
  UNKNOWN = 'UNKNOWN',
}

export enum ModelIconType {
  MODELS = 'models',
  DOCUMENT = 'document',
  CONNECT = 'connect',
  SEARCH = 'search',
  SORT = 'sort',
  UNKNOWN = 'unknown',
  FUNCTION = 'function',
  CODE = 'code',
  NUMBERS = 'numbers',
  WRENCH = 'wrench',
  AGENT = 'agent',
  CHAIN = 'chain',
  USER = 'user',
  SYSTEM = 'system',
  SAVE = 'save',
}

/**
 * Represents a single model trace span.
 * Based on https://github.com/mlflow/mlflow/blob/tracing/mlflow/entities/span.py
 *
 * TODO: clean up all deprecated fields after PrPr customers swap over to
 *       the latest version of mlflow tracing
 */
export type ModelTraceSpanV2 = {
  context: {
    span_id: string;
    trace_id: string;
  };
  name: string;
  /* deprecated, renamed to `parent_id` */
  parent_span_id?: string | null;
  parent_id?: string | null;
  /* deprecated, contained in attributes['mlflow.spanType'] */
  span_type?: ModelSpanType | string;
  /* deprecated, migrated to `status_code` and `status_message` */
  status?: ModelTraceStatus;
  status_code?: string;
  status_message?: string | null;
  start_time: number;
  end_time: number;
  /* deprecated, contained in attributes['mlflow.spanInputs'] */
  inputs?: any;
  /* deprecated, contained in attributes['mlflow.spanOutputs'] */
  outputs?: any;
  attributes?: Record<string, any>;
  events?: ModelTraceEvent[];
  /* metadata for ui usage logging */
  type?: ModelSpanType;
};

export type ModelTraceSpanV3 = {
  trace_id: string;
  span_id: string;
  // can be empty
  trace_state: string;
  // can be empty or null
  parent_span_id: string | null;
  name: string;
  start_time_unix_nano: string;
  end_time_unix_nano: string;
  status: {
    code: ModelSpanStatusCode;
    message?: string;
  };
  attributes: Record<string, any>;
  events?: ModelTraceEvent[];
  /* metadata for ui usage logging */
  type?: ModelSpanType;
};

export type ModelTraceSpan = ModelTraceSpanV2 | ModelTraceSpanV3;

export type ModelTraceEvent = {
  name: string;
  /* deprecated as of v3, migrated to `time_unix_nano` */
  timestamp?: number;
  time_unix_nano?: number;
  attributes?: Record<string, any>;
};

export type ModelTraceData = {
  spans: ModelTraceSpan[];
};

/**
 * Represents a single model trace object.
 * Based on https://github.com/mlflow/mlflow/blob/8e44d102e9568d09d9dc376136d13a5a5d1ab46f/mlflow/tracing/types/model.py#L11
 */
export type ModelTrace = {
  /* deprecated, renamed to `data` */
  trace_data?: ModelTraceData;
  /* deprecated, renamed to `info` */
  trace_info?: ModelTraceInfo;
  data: ModelTraceData;
  info: ModelTraceInfoV3 | ModelTraceInfo | NotebookModelTraceInfo;
};

/**
 * Represents the trace data saved in an inference table.
 * https://github.com/databricks/universe/blob/fb8a572602161aa6387ac32593aa24a91518cc32/rag/serving/python/databricks/rag/unpacking/schemas.py#L133-L141
 */
export type ModelTraceInferenceTableData = {
  app_version_id: string;
  start_timestamp: string;
  end_timestamp: string;
  is_truncated: boolean;
  [MLFLOW_TRACE_SCHEMA_VERSION_KEY]: number;
  spans: (Omit<ModelTraceSpan, 'attributes'> & {
    attributes: string;
  })[];
};

export type ModelTraceInfo = {
  request_id?: string;
  experiment_id?: string;
  timestamp_ms?: number;
  execution_time_ms?: number;
  status?: ModelTraceStatus['description'];
  attributes?: Record<string, any>;
  request_metadata?: { key: string; value: string }[];
  tags?: { key: string; value: string }[];
};

// tags and request_metadata in the notebook view
// (i.e. displayed directly from the python client)
// are stored as an object rather than an array.
export type NotebookModelTraceInfo = Omit<ModelTraceInfo, 'tags' | 'request_metadata'> & {
  tags?: { [key: string]: string };
  request_metadata?: { [key: string]: string };
};

export type ModelTraceLocationMlflowExperiment = {
  type: 'MLFLOW_EXPERIMENT';
  mlflow_experiment: {
    experiment_id: string;
  };
};

export type ModelTraceLocationInferenceTable = {
  type: 'INFERENCE_TABLE';
  inference_table: {
    full_table_name: string;
  };
};

export type ModelTraceLocationUcSchema = {
  type: 'UC_SCHEMA';
  uc_schema: { catalog_name: string; schema_name: string };
};

export type ModelTraceLocation =
  | ModelTraceLocationMlflowExperiment
  | ModelTraceLocationInferenceTable
  | ModelTraceLocationUcSchema;

export type ModelTraceInfoV3 = {
  trace_id: string;
  client_request_id?: string;
  trace_location: ModelTraceLocation;
  /**
   * @deprecated Use `request_preview` instead
   */
  request?: string;
  request_preview?: string;
  /**
   * @deprecated Use `response_preview` instead
   */
  response?: string;
  response_preview?: string;
  // timestamp in a format like "2025-02-19T09:52:23.140Z"
  request_time: string;
  // formatted duration string like "32.4s"
  execution_duration?: string;
  state: ModelTraceState;
  trace_metadata?: {
    [key: string]: string;
  };
  assessments?: Assessment[];
  tags: {
    [key: string]: string;
  };
};

export type ModelTraceState = 'STATE_UNSPECIFIED' | 'OK' | 'ERROR' | 'IN_PROGRESS';

export type ModelSpanStatusCode = 'STATUS_CODE_UNSET' | 'STATUS_CODE_OK' | 'STATUS_CODE_ERROR';

export type ModelTraceStatusUnset = {
  description: 'UNSET';
  status_code: 0;
};

export type ModelTraceStatusOk = {
  description: 'OK';
  status_code: 1;
};

export type ModelTraceStatusError = {
  description: 'ERROR';
  status_code: 2;
};

export type ModelTraceStatusInProgress = {
  description: 'IN_PROGRESS';
  status_code: 3;
};

export enum ModelTraceSpanType {
  LLM = 'LLM',
  CHAIN = 'CHAIN',
  AGENT = 'AGENT',
  TOOL = 'TOOL',
  CHAT_MODEL = 'CHAT_MODEL',
  RETRIEVER = 'RETRIEVER',
  PARSER = 'PARSER',
  EMBEDDING = 'EMBEDDING',
  RERANKER = 'RERANKER',
  MEMORY = 'MEMORY',
  UNKNOWN = 'UNKNOWN',
}

export type ModelTraceStatus =
  | ModelTraceStatusUnset
  | ModelTraceStatusOk
  | ModelTraceStatusError
  | ModelTraceStatusInProgress;

/**
 * Represents a single node in the model trace tree.
 */
export interface ModelTraceSpanNode extends TimelineTreeNode, Pick<ModelTraceSpan, 'attributes' | 'type' | 'events'> {
  assessments: Assessment[];
  inputs?: any;
  outputs?: any;
  children?: ModelTraceSpanNode[];
  chatMessageFormat?: string;
  chatMessages?: ModelTraceChatMessage[];
  chatTools?: ModelTraceChatTool[];
  parentId?: string | null;
  traceId: string;
}

export type ModelTraceExplorerTab = 'chat' | 'content' | 'attributes' | 'events';

export type SearchMatch = {
  span: ModelTraceSpanNode;
  section: 'inputs' | 'outputs' | 'attributes' | 'events';
  key: string;
  isKeyMatch: boolean;
  matchIndex: number;
};

export type SpanFilterState = {
  // always show parents regardless of filter state
  showParents: boolean;
  // always show exceptions regardless of filter state
  showExceptions: boolean;
  // record of span_type: whether to show it
  spanTypeDisplayState: Record<string, boolean>;
};

export interface RetrieverDocument {
  metadata: {
    doc_uri: string;
    chunk_id: string;
    [key: string]: any;
  };
  page_content: string;
  [key: string]: any;
}

export enum CodeSnippetRenderMode {
  JSON = 'json',
  TEXT = 'text',
  MARKDOWN = 'markdown',
  PYTHON = 'python',
}

type ModelTraceTextContentPart = {
  type: 'text' | 'input_text' | 'output_text';
  text: string;
};

type ModelTraceImageUrl = {
  url: string;
  detail?: 'auto' | 'low' | 'high';
};

type ModelTraceImageContentPart = {
  type: 'image_url';
  image_url: ModelTraceImageUrl;
};

type ModelTraceInputAudio = {
  data: string;
  format: 'wav' | 'mp3';
};

type ModelTraceAudioContentPart = {
  type: 'input_audio';
  input_audio: ModelTraceInputAudio;
};

export type ModelTraceContentParts =
  | ModelTraceTextContentPart
  | ModelTraceImageContentPart
  | ModelTraceAudioContentPart;

export type ModelTraceContentType = string | ModelTraceContentParts[];

// We treat content as string in the tracing UI.
export type ModelTraceChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function' | 'developer';
  name?: string;
  content?: string | null;
  tool_calls?: ModelTraceToolCall[];
  tool_call_id?: string;
};

// The actual chat message schema of mlflow contains string, null and content part list.
export type RawModelTraceChatMessage = Omit<ModelTraceChatMessage, 'content'> & {
  // there are other types, but we don't support them yet
  type?: 'message' | 'reasoning';
  content?: ModelTraceContentType | null;
};

export type ModelTraceChatToolParamProperty = {
  type?: string;
  description?: string;
  enum?: string[];
};

export type ModelTraceChatTool = {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: {
      properties: {
        [key: string]: ModelTraceChatToolParamProperty;
      };
      required?: string[];
    };
  };
};

export type ModelTraceToolCall = {
  id: string;
  function: {
    arguments: string;
    name: string;
  };
};

// aligned to the OpenAI format
export type ModelTraceChatResponse = {
  choices: {
    message: ModelTraceChatMessage;
  }[];
};

export type ModelTraceChatInput = {
  messages: RawModelTraceChatMessage[];
};

export type AssessmentSourceType = 'SOURCE_TYPE_UNSPECIFIED' | 'HUMAN' | 'LLM_JUDGE' | 'CODE';

export interface AssessmentSource {
  source_type: AssessmentSourceType;
  // Identifier for the source. For example:
  // - For a human source -> user name
  // - For an LLM judge -> the judge source (databricks or custom)
  // - For a code judge -> the function name
  source_id: string;
}

export interface AssessmentError {
  error_code: string;
  error_message?: string;
  stack_trace?: string;
}

export type AssessmentValue = string | number | boolean | null | string[];

export interface Feedback {
  // can be null / undefined if error is present
  value?: AssessmentValue;
  error?: AssessmentError;
}

export interface ExpectationValue {
  value: AssessmentValue;
}

export interface ExpectationSerializedValue {
  serialized_value: {
    value: string;
    serialization_format: string;
  };
}

export type Expectation = ExpectationValue | ExpectationSerializedValue;

export interface AssessmentMetadata {
  span_name?: string;
}

// should be aligned with `mlflow/api/proto/service.proto`
export interface AssessmentBase {
  assessment_id: string;
  assessment_name: string;
  trace_id: string;
  source: AssessmentSource;
  span_id?: string;

  // the time fields are in the form of a string timestamp
  // e.g. "2025-04-18T04:01:20.159Z"
  create_time: string;
  last_update_time: string;

  rationale?: string;
  metadata?: Record<string, string>;

  // if false, the assessment is not valid and should not be displayed
  // undefined and true should be considered valid.
  valid?: boolean;

  // the assessment_id of the assessment that this assessment overrides
  overrides?: string;

  // UI only field to store the overridden assessment object for easier display
  overriddenAssessment?: Assessment;

  error?: AssessmentError;
}

export interface FeedbackAssessment extends AssessmentBase {
  feedback: Feedback;
}

export interface ExpectationAssessment extends AssessmentBase {
  expectation: Expectation;
}

export type Assessment = FeedbackAssessment | ExpectationAssessment;
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorer.request.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorer.request.utils.tsx

```typescript
import { matchPredefinedError } from '@databricks/web-shared/errors';

// eslint-disable-next-line no-restricted-globals -- See go/spog-fetch
const fetchFn = fetch;

function serializeRequestBody(payload: any | FormData | Blob) {
  if (payload === undefined) {
    return undefined;
  }
  return typeof payload === 'string' || payload instanceof FormData || payload instanceof Blob
    ? payload
    : JSON.stringify(payload);
}

export const fetchAPI = async (
  url: string,
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE' = 'GET',
  body?: any,
  signal?: AbortSignal,
) => {
  const options: RequestInit = {
    method,
    signal,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...getDefaultHeaders(document.cookie),
    },
  };

  if (body) {
    options.body = serializeRequestBody(body);
  }
  const response = await fetchFn(url, options);

  if (!response.ok) {
    const predefinedError = matchPredefinedError(response);
    if (predefinedError) {
      try {
        // Attempt to use message from the response
        const message = (await response.json()).message;
        predefinedError.message = message ?? predefinedError.message;
      } catch {
        // If the message can't be parsed, use default one
      }
      throw predefinedError;
    }
  }
  return response.json();
};

export const getAjaxUrl = (relativeUrl: any) => {
  if (process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] === 'true' && !relativeUrl.startsWith('/')) {
    return '/' + relativeUrl;
  }
  return relativeUrl;
};

// Parse cookies from document.cookie
function parseCookies(cookieString = document.cookie) {
  return cookieString.split(';').reduce((cookies: { [key: string]: string }, cookie: string) => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(value || '');
    return cookies;
  }, {});
}

export const getDefaultHeadersFromCookies = (cookieStr: any) => {
  const headerCookiePrefix = 'mlflow-request-header-';
  const parsedCookie = parseCookies(cookieStr);
  if (!parsedCookie || Object.keys(parsedCookie).length === 0) {
    return {};
  }
  return Object.keys(parsedCookie)
    .filter((cookieName) => cookieName.startsWith(headerCookiePrefix))
    .reduce(
      (acc, cookieName) => ({
        ...acc,
        [cookieName.substring(headerCookiePrefix.length)]: parsedCookie[cookieName],
      }),
      {},
    );
};

export const getDefaultHeaders = (cookieStr: any) => {
  const cookieHeaders = getDefaultHeadersFromCookies(cookieStr);
  return {
    ...cookieHeaders,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorer.test-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorer.test-utils.ts

```typescript
import type {
  Assessment,
  ModelTrace,
  ModelTraceChatMessage,
  ModelTraceChatTool,
  ModelTraceInfo,
  ModelTraceInfoV3,
  ModelTraceSpanNode,
  ModelTraceSpanV2,
  ModelTraceSpanV3,
} from './ModelTrace.types';
import { ModelSpanType } from './ModelTrace.types';

const commonSpanParts: Pick<ModelTraceSpanV2, 'span_type' | 'status' | 'events'> = {
  span_type: 'TEST',
  status: {
    description: 'OK',
    status_code: 1,
  },
  events: [],
};

export const MOCK_RETRIEVER_SPAN: ModelTraceSpanNode = {
  key: 'Retriever span',
  type: ModelSpanType.RETRIEVER,
  start: 231205.888,
  end: 682486.272,
  inputs: 'tell me about python',
  outputs: [
    {
      page_content: 'Content with metadata',
      metadata: {
        chunk_id: '1',
        doc_uri: 'https://example.com',
        source: 'book-doc',
      },
    },
    {
      page_content: 'Content without metadata',
      metadata: {},
    },
  ],
  attributes: {},
  assessments: [],
  traceId: '',
};

export const MOCK_EVENTS_SPAN: ModelTraceSpanV2 = {
  ...commonSpanParts,
  attributes: {
    function_name: 'top-level-attribute',
    'mlflow.spanInputs': JSON.stringify({ query: 'events_span-input' }),
    'mlflow.spanOutputs': JSON.stringify({ response: 'events_span-output' }),
    'mlflow.spanType': JSON.stringify(ModelSpanType.FUNCTION),
  },
  context: { span_id: 'events_span', trace_id: '1' },
  parent_id: null,
  name: 'events_span',
  start_time: 3.1 * 1e6,
  end_time: 8.1 * 1e6,
  events: [
    {
      name: 'event1',
      attributes: {
        'event1-attr1': 'event-level-attribute',
        'event1-attr2': 'event1-attr2-value',
      },
    },
    {
      name: 'event2',
      attributes: {
        'event2-attr1': 'event2-attr1-value',
        'event2-attr2': 'event2-attr2-value',
      },
    },
  ],
};

export const mockSpans: ModelTraceSpanV2[] = [
  {
    ...commonSpanParts,
    attributes: {
      function_name: 'predict',
      'mlflow.spanInputs': JSON.stringify({ query: 'document-qa-chain-input' }),
      'mlflow.spanOutputs': JSON.stringify({ response: 'document-qa-chain-output' }),
      'mlflow.spanType': JSON.stringify(ModelSpanType.CHAIN),
    },
    context: { span_id: 'document-qa-chain', trace_id: '1' },
    parent_id: null,
    name: 'document-qa-chain',
    start_time: 0 * 1e9,
    end_time: 25 * 1e9,
  },
  {
    ...commonSpanParts,
    attributes: {
      function_name: 'predict',
      'mlflow.spanInputs': JSON.stringify({ query: '_generate_response-input' }),
      'mlflow.spanOutputs': JSON.stringify({ response: '_generate_response-output' }),
      'mlflow.spanType': JSON.stringify(ModelSpanType.CHAT_MODEL),
    },
    name: '_generate_response',
    context: { span_id: '_generate_response', trace_id: '1' },
    parent_id: 'document-qa-chain',
    start_time: 3 * 1e9,
    end_time: 8 * 1e9,
  },
  {
    ...commonSpanParts,
    attributes: {
      function_name: 'rephrase',
      'mlflow.spanInputs': JSON.stringify({ query: 'rephrase_chat_to_queue-input' }),
      'mlflow.spanOutputs': JSON.stringify({ response: 'rephrase_chat_to_queue-output' }),
      'mlflow.spanType': JSON.stringify(ModelSpanType.LLM),
    },
    context: { span_id: 'rephrase_chat_to_queue', trace_id: '1' },
    parent_id: '_generate_response',
    name: 'rephrase_chat_to_queue',
    start_time: 8 * 1e9,
    end_time: 8.5 * 1e9,
  },
];

export const MOCK_V3_SPANS: ModelTraceSpanV3[] = [
  {
    // 55b2f04aabe2a246b114ac6950118668 in hex
    trace_id: 'VbLwSqviokaxFKxpUBGGaA==',
    // a96bcf7b57a48b3d in hex
    span_id: 'qWvPe1ekiz0=',
    trace_state: '',
    parent_span_id: '',
    name: 'document-qa-chain',
    start_time_unix_nano: '0',
    end_time_unix_nano: String(2.5 * 1e10),
    attributes: {
      'mlflow.spanType': 'CHAT_MODEL',
      'mlflow.spanInputs': 'document-qa-chain-input',
      'mlflow.traceRequestId': '"tr-edb54b3d53a44732b8c61530d50b065a"',
      'mlflow.spanOutputs': 'document-qa-chain-output',
    },
    status: {
      message: '',
      code: 'STATUS_CODE_OK',
    },
  },
  {
    trace_id: 'VbLwSqviokaxFKxpUBGGaA==',
    // 31323334 in hex
    span_id: 'MTIzNA==',
    trace_state: '',
    parent_span_id: 'qWvPe1ekiz0=',
    name: 'document-qa-chain',
    start_time_unix_nano: '0',
    end_time_unix_nano: String(2.5 * 1e10),
    attributes: {
      'mlflow.spanType': 'CHAIN',
      'mlflow.spanInputs': 'rephrase_chat_to_queue-input',
      'mlflow.traceRequestId': '"tr-edb54b3d53a44732b8c61530d50b065a"',
      'mlflow.spanOutputs': 'rephrase_chat_to_queue-output',
    },
    status: {
      message: '',
      code: 'STATUS_CODE_OK',
    },
  },
  {
    trace_id: 'VbLwSqviokaxFKxpUBGGaA==',
    // 3132333435 in hex
    span_id: 'MTIzNDU=',
    trace_state: '',
    parent_span_id: 'MTIzNA==',
    name: 'rephrase_chat_to_queue',
    start_time_unix_nano: '0',
    end_time_unix_nano: String(2.5 * 1e10),
    attributes: {
      'mlflow.spanType': 'LLM',
      'mlflow.spanInputs': 'rephrase_chat_to_queue-input',
      'mlflow.traceRequestId': '"tr-edb54b3d53a44732b8c61530d50b065a"',
      'mlflow.spanOutputs': 'rephrase_chat_to_queue-output',
    },
    status: {
      message: '',
      code: 'STATUS_CODE_OK',
    },
  },
];

export const MOCK_ASSESSMENT: Assessment = {
  assessment_id: 'a-test-1',
  assessment_name: 'Relevance',
  trace_id: 'tr-test-v3',
  span_id: '',
  source: {
    source_type: 'LLM_JUDGE',
    source_id: '1',
  },
  create_time: '2025-04-19T09:04:07.875Z',
  last_update_time: '2025-04-19T09:04:07.875Z',
  feedback: {
    value: '5',
  },
  rationale: 'The thought process is sound and follows from the request',
};

export const MOCK_EXPECTATION: Assessment = {
  assessment_id: 'a-test-1',
  assessment_name: 'expected_facts',
  trace_id: 'tr-test-v3',
  span_id: '',
  source: {
    source_type: 'LLM_JUDGE',
    source_id: '1',
  },
  create_time: '2025-04-19T09:04:07.875Z',
  last_update_time: '2025-04-19T09:04:07.875Z',
  expectation: {
    serialized_value: {
      value: '["fact 1", "fact 2"]',
      serialization_format: 'json',
    },
  },
  rationale: 'The thought process is sound and follows from the request',
};

export const MOCK_TRACE_INFO_V3: ModelTraceInfoV3 = {
  trace_id: 'tr-test-v3',
  trace_location: {
    type: 'MLFLOW_EXPERIMENT',
    mlflow_experiment: {
      experiment_id: '3363486573189371',
    },
  },
  request_time: '2025-02-19T09:52:23.140Z',
  execution_duration: '32.583s',
  state: 'OK',
  trace_metadata: {
    'mlflow.sourceRun': '3129ab3cda944e88a995098fea73a808',
    'mlflow.traceInputs': '"test inputs"',
    'mlflow.traceOutputs': '"test outputs"',
    'mlflow.trace_schema.version': '3',
    'mlflow.trace.tokenUsage': '{"input_tokens": 100, "output_tokens": 200, "total_tokens": 300}',
  },
  tags: {},
  assessments: [MOCK_ASSESSMENT],
};

export const MOCK_V3_TRACE: ModelTrace = {
  data: {
    spans: MOCK_V3_SPANS,
  },
  info: MOCK_TRACE_INFO_V3,
};

export const MOCK_TRACE: ModelTrace = {
  data: {
    spans: mockSpans,
  },
  info: {
    request_id: '1',
    experiment_id: '1',
    timestamp_ms: 1e9,
    execution_time_ms: 1e9,
    status: 'OK',
    tags: [],
    attributes: {},
  },
};

export const MOCK_LANGCHAIN_CHAT_INPUT = [
  [
    {
      content: "What's the weather in Singapore and New York?",
      additional_kwargs: {},
      response_metadata: {},
      type: 'human',
      name: null,
      id: null,
      example: false,
    },
    // tool call specified in additional_kwargs
    {
      additional_kwargs: {
        tool_calls: [
          {
            id: '1',
            function: {
              arguments: '{"city": "Singapore"}',
              name: 'get_weather',
            },
            type: 'function',
          },
        ],
        refusal: null,
      },
      type: 'ai',
      name: null,
      id: null,
      example: false,
    },
    // tool call specified in tool_calls
    {
      content: '',
      additional_kwargs: {},
      tool_calls: [
        {
          name: 'get_weather',
          args: {
            city: 'New York',
          },
          id: '2',
          type: 'tool_call',
        },
      ],
      type: 'ai',
      name: null,
      id: null,
      example: false,
    },
    // tool response
    {
      content: "It's hot in Singapore",
      additional_kwargs: {},
      response_metadata: {},
      type: 'tool',
      name: null,
      id: null,
      tool_call_id: '1',
      artifact: null,
      status: 'success',
    },
  ],
];

export const MOCK_LANGCHAIN_CHAT_OUTPUT = {
  generations: [
    [
      {
        text: 'The weather in Singapore is hot, while in New York, it is cold.',
        generation_info: {
          finish_reason: 'stop',
          logprobs: null,
        },
        type: 'ChatGeneration',
        message: {
          content: 'The weather in Singapore is hot, while in New York, it is cold.',
          additional_kwargs: {
            refusal: null,
          },
          response_metadata: {
            token_usage: {
              completion_tokens: 17,
              prompt_tokens: 156,
              total_tokens: 173,
              completion_tokens_details: {
                audio_tokens: null,
                reasoning_tokens: 0,
              },
              prompt_tokens_details: {
                audio_tokens: null,
                cached_tokens: 0,
              },
            },
            model_name: 'gpt-4o-mini-2024-07-18',
            system_fingerprint: 'fp_f59a81427f',
            finish_reason: 'stop',
            logprobs: null,
          },
          type: 'ai',
          name: null,
          id: 'run-2e7d781c-b478-4a70-b8bf-d2c4ee04878e-0',
        },
      },
    ],
  ],
  llm_output: {
    token_usage: {
      completion_tokens: 17,
      prompt_tokens: 156,
      total_tokens: 173,
      completion_tokens_details: {
        audio_tokens: null,
        reasoning_tokens: 0,
      },
      prompt_tokens_details: {
        audio_tokens: null,
        cached_tokens: 0,
      },
    },
    model_name: 'gpt-4o-mini-2024-07-18',
    system_fingerprint: 'fp_f59a81427f',
  },
  run: null,
  type: 'LLMResult',
};

export const MOCK_OPENAI_CHAT_INPUT = {
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: 'tell me a joke in 50 words',
    },
    {
      role: 'assistant',
      tool_calls: [
        {
          id: '1',
          function: {
            arguments: '{"joke_length": 50}',
            name: 'tell_joke',
          },
        },
      ],
    },
    {
      role: 'tool',
      content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
      tool_call_id: '1',
    },
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'tell_joke',
        description: 'Tells a joke',
        parameters: {
          properties: {
            joke_length: {
              type: 'integer',
              description: 'The length of the joke in words',
            },
          },
          required: ['joke_length'],
        },
      },
    },
  ],
  temperature: 0,
};

export const MOCK_OPENAI_CHAT_OUTPUT = {
  id: 'chatcmpl-A8HdoWt2DsJgtZoxjjAcPdx01jkul',
  choices: [
    {
      finish_reason: 'stop',
      index: 0,
      logprobs: null,
      message: {
        content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
        refusal: null,
        role: 'assistant',
        function_call: null,
        tool_calls: null,
      },
    },
  ],
  created: 1726537800,
  model: 'gpt-4o-mini-2024-07-18',
  object: 'chat.completion',
  service_tier: null,
  system_fingerprint: 'fp_483d39d857',
  usage: {
    completion_tokens: 68,
    prompt_tokens: 15,
    total_tokens: 83,
    completion_tokens_details: {
      reasoning_tokens: 0,
    },
  },
};

export const MOCK_LLAMA_INDEX_CHAT_OUTPUT = {
  message: {
    role: 'assistant',
    content: 'Test',
    additional_kwargs: {},
  },
  delta: null,
  logprobs: null,
  additional_kwargs: {
    prompt_tokens: 404,
    completion_tokens: 94,
    total_tokens: 498,
  },
};

export const MOCK_CHAT_MESSAGES = MOCK_OPENAI_CHAT_INPUT.messages as ModelTraceChatMessage[];
export const MOCK_CHAT_TOOLS = MOCK_OPENAI_CHAT_INPUT.tools as ModelTraceChatTool[];

export const MOCK_CHAT_SPAN: ModelTraceSpanNode = {
  ...commonSpanParts,
  attributes: {},
  parentId: null,
  key: 'chat_span',
  start: 3.1 * 1e6,
  end: 8.1 * 1e6,
  inputs: MOCK_LANGCHAIN_CHAT_INPUT,
  outputs: MOCK_LANGCHAIN_CHAT_OUTPUT,
  chatMessages: MOCK_CHAT_MESSAGES,
  chatTools: MOCK_CHAT_TOOLS,
  type: ModelSpanType.CHAT_MODEL,
  assessments: [],
  traceId: '',
};

export const MOCK_CHAT_TOOL_CALL_SPAN: ModelTraceSpanV2 = {
  ...commonSpanParts,
  attributes: {
    'mlflow.spanType': 'CHAT_MODEL',
    'mlflow.spanInputs': MOCK_OPENAI_CHAT_INPUT,
    'mlflow.spanOutputs': MOCK_OPENAI_CHAT_OUTPUT,
    'mlflow.chat.messages': MOCK_OPENAI_CHAT_INPUT.messages,
    'mlflow.chat.tools': MOCK_OPENAI_CHAT_INPUT.tools,
  },
  context: { span_id: 'chat_span', trace_id: '1' },
  parent_id: null,
  name: 'chat_span',
  start_time: 3.1 * 1e6,
  end_time: 8.1 * 1e6,
};

export const MOCK_ROOT_ASSESSMENT: Assessment = {
  assessment_id: 'a-test-1',
  assessment_name: 'Thumbs',
  trace_id: 'tr-test-v3',
  source: {
    source_type: 'HUMAN',
    source_id: 'daniel.lok@databricks.com',
  },
  create_time: '2025-04-28T01:35:53.621Z',
  last_update_time: '2025-04-28T06:28:27.686Z',
  feedback: {
    value: 'up',
  },
  rationale: 'good job',
  valid: false,
};

export const MOCK_OVERRIDDING_ASSESSMENT: Assessment = {
  ...MOCK_ROOT_ASSESSMENT,
  assessment_id: 'a-test-2',
  overrides: MOCK_ROOT_ASSESSMENT.assessment_id,
  valid: true,
};

export const MOCK_SPAN_ASSESSMENT: Assessment = {
  assessment_id: 'a-test-3',
  assessment_name: 'Thumbs',
  trace_id: 'tr-test-v3',
  span_id: 'span-test-1',
  source: {
    source_type: 'HUMAN',
    source_id: 'daniel.lok@databricks.com',
  },
  create_time: '2025-04-28T01:35:53.621Z',
  last_update_time: '2025-04-28T06:28:27.686Z',
  feedback: {
    value: 'down',
  },
  rationale: 'bad job',
};

export const MOCK_TRACE_INFO_V2: ModelTraceInfo = {
  request_id: 'tr-5dfafe5bde684ea5809f0f9524540ce4',
  experiment_id: '3363486573189371',
  timestamp_ms: 1740026648570,
  execution_time_ms: 1546,
  status: 'OK',
  request_metadata: [
    {
      key: 'mlflow.trace_schema.version',
      value: '2',
    },
    {
      key: 'mlflow.traceInputs',
      value: '"test inputs"',
    },
    {
      key: 'mlflow.traceOutputs',
      value: '"test outputs"',
    },
  ],
  tags: [],
};

export const MOCK_OTEL_TRACE: ModelTrace = {
  data: {
    spans: [
      {
        trace_id: 'tLdfEcjATdf92uVsKMbM/Q==',
        span_id: 'i8XoH5ibpGc=',
        trace_state: '',
        parent_span_id: '',
        name: 'conversation_turn',
        start_time_unix_nano: '1757912311704325000',
        end_time_unix_nano: '1757912313258527000',
        attributes: {
          'input.value': 'Now multiply that result by 3',
          'output.value': 'Multiplying 25 by 3 gives you 75.',
          'mlflow.traceRequestId': 'tr-b4b75f11c8c04dd7fddae56c28c6ccfd',
        },
        status: {
          code: 'STATUS_CODE_UNSET',
        },
      },
      {
        trace_id: 'tLdfEcjATdf92uVsKMbM/Q==',
        span_id: 'yuhZxKf3p8w=',
        trace_state: '',
        parent_span_id: 'i8XoH5ibpGc=',
        name: 'tool_execution',
        start_time_unix_nano: '1757912312585773000',
        end_time_unix_nano: '1757912312586234000',
        attributes: {
          'tool_call.function.name': 'calculate',
          'output.value': 'Result: 75',
          'mlflow.traceRequestId': 'tr-b4b75f11c8c04dd7fddae56c28c6ccfd',
          'openinference.span.kind': 'TOOL',
          'tool_call.function.arguments': '{"expression": "25 * 3"}',
        },
        status: {
          code: 'STATUS_CODE_UNSET',
        },
      },
    ],
  },
  info: {
    trace_id: 'tr-b4b75f11c8c04dd7fddae56c28c6ccfd',
    trace_location: {
      type: 'MLFLOW_EXPERIMENT',
      mlflow_experiment: {
        experiment_id: '1',
      },
    },
    request_time: '2025-09-15T04:58:31.704Z',
    execution_duration: '1.554s',
    state: 'OK',
    trace_metadata: {
      'mlflow.trace_schema.version': '3',
    },
    tags: {
      'mlflow.artifactLocation': 'mlflow-artifacts:/1/traces/tr-b4b75f11c8c04dd7fddae56c28c6ccfd/artifacts',
      'mlflow.trace.spansLocation': 'tracking_store',
    },
  },
};
```

--------------------------------------------------------------------------------

````
