---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 541
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 541 of 991)

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

---[FILE: useExperimentTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentTraces.tsx
Signals: React

```typescript
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MlflowService } from '../../../sdk/MlflowService';
import { EXPERIMENT_TRACES_SORTABLE_COLUMNS, getTraceInfoRunId } from '../TracesView.utils';
import { ViewType } from '../../../sdk/MlflowEnums';
import { first, uniq, values } from 'lodash';
import type { RunEntity } from '../../../types';

// A filter expression used to filter traces by run ID
const RUN_ID_FILTER_EXPRESSION = 'request_metadata.`mlflow.sourceRun`';
const LOGGED_MODEL_ID_FILTER_EXPRESSION = 'request_metadata.`mlflow.modelId`';

const createRunIdsFilterExpression = (runUuids: string[]) => {
  const runIdsInQuotes = runUuids.map((runId: any) => `'${runId}'`);
  return `run_id IN (${runIdsInQuotes.join(',')})`;
};

/**
 * Utility function that fetches run names for traces.
 */
const fetchRunNamesForTraces = async (experimentIds: string[], traces: ModelTraceInfo[]) => {
  const traceIdToRunIdMap = traces.reduce<Record<string, string>>((acc, trace) => {
    const traceId = trace.request_id;
    const runId = getTraceInfoRunId(trace);
    if (!traceId || !runId) {
      return acc;
    }
    return { ...acc, [traceId]: runId };
  }, {});

  const runUuids = uniq(values(traceIdToRunIdMap));
  if (runUuids.length < 1) {
    return {};
  }
  const runResponse = (await MlflowService.searchRuns({
    experiment_ids: experimentIds,
    filter: createRunIdsFilterExpression(runUuids),
    run_view_type: ViewType.ALL,
  })) as { runs?: RunEntity[] };

  const runs = runResponse.runs;

  const runIdsToRunNames = (runs || []).reduce<Record<string, string>>((acc, run) => {
    return { ...acc, [run.info.runUuid]: run.info.runName };
  }, {});

  const traceIdsToRunNames = traces.reduce<Record<string, string>>((acc, trace) => {
    const traceId = trace.request_id;
    if (!traceId) {
      return acc;
    }
    const runId = traceIdToRunIdMap[traceId];

    return { ...acc, [traceId]: runIdsToRunNames[runId] || runId };
  }, {});

  return traceIdsToRunNames;
};

export interface ModelTraceInfoWithRunName extends ModelTraceInfo {
  runName?: string;
}

export const useExperimentTraces = ({
  experimentIds,
  sorting,
  filter = '',
  runUuid,
  loggedModelId,
}: {
  experimentIds: string[];
  sorting: {
    id: string;
    desc: boolean;
  }[];
  filter?: string;
  runUuid?: string;
  loggedModelId?: string;
}) => {
  const [traces, setTraces] = useState<ModelTraceInfoWithRunName[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Backend currently only supports ordering by timestamp
  const orderByString = useMemo(() => {
    const firstOrderByColumn = first(sorting);
    if (firstOrderByColumn && EXPERIMENT_TRACES_SORTABLE_COLUMNS.includes(firstOrderByColumn.id)) {
      return `${firstOrderByColumn.id} ${firstOrderByColumn.desc ? 'DESC' : 'ASC'}`;
    }
    return 'timestamp_ms DESC';
  }, [sorting]);

  const filterString = useMemo(() => {
    if (!runUuid && !loggedModelId) {
      return filter;
    }

    if (loggedModelId) {
      if (filter) {
        return `${filter} AND ${LOGGED_MODEL_ID_FILTER_EXPRESSION}='${loggedModelId}'`;
      }
      return `${LOGGED_MODEL_ID_FILTER_EXPRESSION}='${loggedModelId}'`;
    }

    if (filter) {
      return `${filter} AND ${RUN_ID_FILTER_EXPRESSION}='${runUuid}'`;
    }

    return `${RUN_ID_FILTER_EXPRESSION}='${runUuid}'`;
  }, [filter, runUuid, loggedModelId]);

  const [pageTokens, setPageTokens] = useState<Record<string, string | undefined>>({ 0: undefined });
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageToken = pageTokens[currentPage];

  const fetchTraces = useCallback(
    async ({
      experimentIds,
      currentPage = 0,
      pageToken,
      silent,
      orderByString = '',
      filterString = '',
    }: {
      experimentIds: string[];
      currentPage?: number;
      pageToken?: string;
      filterString?: string;
      orderByString?: string;
      silent?: boolean;
    }) => {
      if (!silent) {
        setLoading(true);
      }
      setError(undefined);

      try {
        const response = await MlflowService.getExperimentTraces(experimentIds, orderByString, pageToken, filterString);

        if (!response.traces) {
          setTraces([]);
          return;
        }

        const runNamesForTraces = await fetchRunNamesForTraces(experimentIds, response.traces);
        const tracesWithRunNames = response.traces.map((trace) => {
          const traceId = trace.request_id;
          if (!traceId) {
            return { ...trace };
          }
          const runName = runNamesForTraces[traceId];
          return { ...trace, runName };
        });

        setTraces(tracesWithRunNames);
        setPageTokens((prevPages) => {
          return { ...prevPages, [currentPage + 1]: response.next_page_token };
        });
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const hasNextPage = !loading && pageTokens[currentPage + 1] !== undefined;
  const hasPreviousPage = !loading && (currentPage === 1 || pageTokens[currentPage - 1] !== undefined);

  useEffect(() => {
    fetchTraces({ experimentIds, filterString, orderByString });
  }, [fetchTraces, filterString, experimentIds, orderByString]);

  const reset = useCallback(() => {
    setTraces([]);
    setPageTokens({ 0: undefined });
    setCurrentPage(0);
    fetchTraces({ experimentIds });
  }, [fetchTraces, experimentIds]);

  const fetchNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchTraces({
      experimentIds,
      currentPage: currentPage + 1,
      pageToken: pageTokens[currentPage + 1],
      filterString,
      orderByString,
    });
  }, [experimentIds, currentPage, fetchTraces, pageTokens, filterString, orderByString]);

  const fetchPrevPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage - 1);
    fetchTraces({
      experimentIds,
      currentPage: currentPage - 1,
      pageToken: pageTokens[currentPage - 1],
      filterString,
      orderByString,
    });
  }, [experimentIds, currentPage, fetchTraces, pageTokens, filterString, orderByString]);

  const refreshCurrentPage = useCallback(
    (silent = false) => {
      return fetchTraces({
        experimentIds,
        currentPage,
        pageToken: currentPageToken,
        silent,
        filterString,
        orderByString,
      });
    },
    [experimentIds, currentPage, fetchTraces, currentPageToken, filterString, orderByString],
  );

  return {
    traces,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPrevPage,
    refreshCurrentPage,
    reset,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentViewTracesUIState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentViewTracesUIState.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import LocalStorageUtils from '../../../../common/utils/LocalStorageUtils';
import { isObject, sortBy } from 'lodash';
import { ExperimentViewTracesTableColumns } from '../TracesView.utils';

type LocalStorageStore = ReturnType<typeof LocalStorageUtils.getStoreForComponent>;

export interface ExperimentViewTracesUIState {
  hiddenColumns?: string[];
}

const defaultExperimentViewTracesUIState: ExperimentViewTracesUIState = {
  hiddenColumns: [ExperimentViewTracesTableColumns.traceName, ExperimentViewTracesTableColumns.source],
};

const loadExperimentViewTracesUIState = (localStore: LocalStorageStore): ExperimentViewTracesUIState => {
  try {
    const uiStateRaw = localStore.getItem('uiState');
    const uiState = JSON.parse(uiStateRaw);
    if (!isObject(uiState)) {
      return defaultExperimentViewTracesUIState;
    }
    return uiState;
  } catch (e) {
    return defaultExperimentViewTracesUIState;
  }
};

export const useExperimentViewTracesUIState = (experimentIds: string[]) => {
  const localStore = useMemo(() => {
    const persistenceIdentifier = JSON.stringify(experimentIds.slice().sort());
    return LocalStorageUtils.getStoreForComponent('ExperimentViewTraces', persistenceIdentifier);
  }, [experimentIds]);

  const [uiState, setUIState] = useState<ExperimentViewTracesUIState>(() =>
    loadExperimentViewTracesUIState(localStore),
  );

  const toggleHiddenColumn = useCallback((columnId: string) => {
    setUIState((prevUIState) => {
      const hiddenColumns = prevUIState.hiddenColumns || [];
      return {
        hiddenColumns: hiddenColumns.includes(columnId)
          ? hiddenColumns.filter((id) => id !== columnId)
          : [...hiddenColumns, columnId],
      };
    });
  }, []);

  useEffect(() => {
    localStore.setItem('uiState', JSON.stringify(uiState));
  }, [localStore, uiState]);

  return { uiState, toggleHiddenColumn };
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableNoTracesQuickstart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/quickstart/TracesViewTableNoTracesQuickstart.tsx

```typescript
import { Header, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { isNil } from 'lodash';
import { TraceTableGenericQuickstart } from './TraceTableGenericQuickstart';
import { useTracesViewTableNoTracesQuickstartContext } from './TracesViewTableNoTracesQuickstartContext';

export const TracesViewTableNoTracesQuickstart = ({
  baseComponentId,
  runUuid,
}: {
  baseComponentId: string;
  runUuid?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const { introductionText } = useTracesViewTableNoTracesQuickstartContext();

  return (
    <div css={{ overflow: 'auto', paddingBottom: theme.spacing.lg }}>
      <Header
        title={
          <FormattedMessage
            defaultMessage="No traces recorded"
            description="Message displayed when there are no traces logged to the experiment"
          />
        }
        titleElementLevel={3}
      />
      <Typography.Text
        css={{
          display: 'block',
          marginTop: theme.spacing.md,
          marginBottom: theme.spacing.md,
          maxWidth: 800,
        }}
      >
        {introductionText ? (
          introductionText
        ) : (
          <FormattedMessage
            defaultMessage="This tab displays all the traces logged to this {isRun, select, true {run} other {experiment}}. Follow the steps below to log your first trace. For more information about MLflow Tracing, visit the <a>MLflow documentation</a>."
            description="Message that explains the function of the 'Traces' tab in the MLflow UI. This message is followed by a tutorial explaining how to get started with MLflow Tracing."
            values={{
              isRun: !isNil(runUuid),
              a: (text: string) => (
                <Typography.Link
                  componentId={`${baseComponentId}.traces_table.quickstart_docs_link`}
                  href="https://mlflow.org/docs/latest/llms/tracing/index.html"
                  openInNewTab
                >
                  {text}
                </Typography.Link>
              ),
            }}
          />
        )}
      </Typography.Text>
      <TraceTableGenericQuickstart flavorName="custom" baseComponentId={baseComponentId} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableNoTracesQuickstartContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/quickstart/TracesViewTableNoTracesQuickstartContext.tsx
Signals: React

```typescript
import React, { createContext, type ReactNode, useContext } from 'react';

const TracesViewTableNoTracesQuickstartContext = createContext<{
  introductionText?: ReactNode;
  displayVersionWarnings?: boolean;
}>({});

/**
 * Allows to alter default behavior of a quickstart tutorial for logging traces
 */
export const TracesViewTableNoTracesQuickstartContextProvider = ({
  children,
  introductionText,
  displayVersionWarnings,
}: {
  children: ReactNode;
  introductionText?: ReactNode;
  displayVersionWarnings?: boolean;
}) => {
  return (
    <TracesViewTableNoTracesQuickstartContext.Provider value={{ introductionText, displayVersionWarnings }}>
      {children}
    </TracesViewTableNoTracesQuickstartContext.Provider>
  );
};

export const useTracesViewTableNoTracesQuickstartContext = () => useContext(TracesViewTableNoTracesQuickstartContext);
```

--------------------------------------------------------------------------------

---[FILE: TraceTableGenericQuickstart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/quickstart/TraceTableGenericQuickstart.tsx

```typescript
import { CopyIcon, Typography, useDesignSystemTheme, Alert } from '@databricks/design-system';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';

import { QUICKSTART_CONTENT } from './TraceTableQuickstart.utils';

export const TraceTableGenericQuickstart = ({
  flavorName,
  baseComponentId,
}: {
  flavorName: keyof typeof QUICKSTART_CONTENT;
  baseComponentId: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const { getContent, getCodeSource, minVersion } = QUICKSTART_CONTENT[flavorName];
  const content = getContent(baseComponentId);
  const code = getCodeSource();
  return (
    <div>
      <Typography.Text css={{ maxWidth: 800 }} color="secondary">
        {content}
      </Typography.Text>
      <div css={{ position: 'relative', width: 'min-content' }}>
        <CopyButton
          componentId={`${baseComponentId}.traces_table.${flavorName}_quickstart_snippet_copy`}
          css={{ zIndex: 1, position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
          showLabel={false}
          copyText={code}
          icon={<CopyIcon />}
        />
        <CodeSnippet
          showLineNumbers
          theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
          style={{
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            marginTop: theme.spacing.md,
          }}
          language="python"
        >
          {code}
        </CodeSnippet>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TraceTableQuickstart.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/quickstart/TraceTableQuickstart.utils.tsx
Signals: React

```typescript
import { Typography } from '@databricks/design-system';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export type QUICKSTART_FLAVOR =
  | 'openai'
  | 'langchain'
  | 'langgraph'
  | 'llama_index'
  | 'dspy'
  | 'crewai'
  | 'autogen'
  | 'anthropic'
  | 'bedrock'
  | 'litellm'
  | 'gemini'
  | 'custom';

export const QUICKSTART_CONTENT: Record<
  QUICKSTART_FLAVOR,
  {
    minVersion: string;
    getContent: (baseComponentId?: string) => React.ReactNode;
    getCodeSource: () => string;
  }
> = {
  openai: {
    minVersion: '2.15.1',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for OpenAI API calls by calling the {code} function. For example:"
        description="Description of how to log traces for the OpenAI package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.openai.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () =>
      `from openai import OpenAI

mlflow.openai.autolog()

# Ensure that the "OPENAI_API_KEY" environment variable is set
client = OpenAI()

messages = [
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "Hello!"}
]

# Inputs and outputs of the API request will be logged in a trace
client.chat.completions.create(model="gpt-4o-mini", messages=messages)`,
  },
  langchain: {
    // the autologging integration was really introduced in
    // 2.14.0, but it does not support newer versions of langchain
    // so effectively that version will not work with the code snippet
    minVersion: '2.17.2',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for LangChain or LangGraph invocations by calling the {code} function. For example:"
        description="Description of how to log traces for the LangChain/LangGraph package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.langchain.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () =>
      `from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate

mlflow.langchain.autolog()

# Ensure that the "OPENAI_API_KEY" environment variable is set
llm = OpenAI()
prompt = PromptTemplate.from_template("Answer the following question: {question}")
chain = prompt | llm

# Invoking the chain will cause a trace to be logged
chain.invoke("What is MLflow?")`,
  },
  langgraph: {
    minVersion: '2.19.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for LangGraph workflows by calling the {code} function. For example:"
        description="Description of how to log traces for the LangGraph package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.langchain.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () =>
      `from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph
from typing import Annotated

mlflow.langchain.autolog()

# Ensure that the "OPENAI_API_KEY" environment variable is set
model = ChatOpenAI(model="gpt-4o-mini")

# Define a minimal LangGraph workflow
class GraphState(dict):
    input: Annotated[str, "input"]

def call_model(state: GraphState) -> GraphState:
    response = model.invoke(state["input"])
    return {"input": state["input"], "response": response.content}

graph = StateGraph(GraphState)
graph.add_node("model", call_model)
graph.set_entry_point("model")
app = graph.compile()

# Executing the graph will log the steps as a trace
app.invoke({"input": "Say hello to MLflow."})`,
  },
  llama_index: {
    minVersion: '2.15.1',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for LlamaIndex queries by calling the {code} function. For example:"
        description="Description of how to log traces for the LlamaIndex package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.llama_index.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () =>
      `from llama_index.core import Document, VectorStoreIndex

mlflow.llama_index.autolog()

# Ensure that the "OPENAI_API_KEY" environment variable is set
index = VectorStoreIndex.from_documents([Document.example()])
query_engine = index.as_query_engine()

# Querying the engine will cause a trace to be logged
query_engine.query("What is LlamaIndex?")`,
  },
  dspy: {
    minVersion: '2.18.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for DSPy executions by calling the {code} function. For example:"
        description="Description of how to log traces for the DSPy package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.dspy.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () =>
      `import dspy

mlflow.dspy.autolog()

# Configure the LLM to use. Please ensure that
# the OPENAI_API_KEY environment variable is set
lm = dspy.LM("openai/gpt-4o-mini")
dspy.configure(lm=lm)

# Define a simple chain-of-thought model and run it
math = dspy.ChainOfThought("question -> answer: float")
question = "Two dice are tossed. What is the probability that the sum equals two?"

# All intermediate outputs from the execution will be logged
math(question=question)`,
  },
  crewai: {
    minVersion: '2.19.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for CrewAI executions by calling the {code} function. For example:"
        description="Description of how to log traces for the CrewAI package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.crewai.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () => `from crewai import Agent, Crew, Process, Task

mlflow.crewai.autolog()

city_selection_agent = Agent(
    role="City selection expert",
    goal="Select the best city based on weather, season, and prices",
    backstory="An expert in analyzing travel data to pick ideal destinations",
    allow_delegation=True,
    verbose=True,
)

local_expert = Agent(
    role="Local expert",
    goal="Provide the best insights about the selected city",
    backstory="A local guide with extensive information about the city",
    verbose=True,
)
  
plan_trip = Task(
    name="Plan a trip",
    description="""Plan a trip to a city based on weather, prices, and best local attractions. 
    Please consult with a local expert when researching things to do.""",
    expected_output="A short summary of the trip destination and key things to do",
    agent=city_selection_agent,
)

crew = Crew(
  agents=[
    city_selection_agent,
    local_expert,
  ],
  tasks=[plan_trip],
  process=Process.sequential
)

# Ensure the "OPENAI_API_KEY" environment variable is set
# before kicking off the crew. All intermediate agent outputs
# will be logged in the resulting trace.
crew.kickoff()`,
  },
  autogen: {
    minVersion: '2.16.2',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for AutoGen conversations by calling the {code} function. For example:"
        description="Description of how to log traces for the AutoGen package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.autogen.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () =>
      `import os
from autogen import AssistantAgent, UserProxyAgent

mlflow.autogen.autolog()

# Ensure that the "OPENAI_API_KEY" environment variable is set
llm_config = { "model": "gpt-4o-mini", "api_key": os.environ["OPENAI_API_KEY"] }
assistant = AssistantAgent("assistant", llm_config = llm_config)
user_proxy = UserProxyAgent("user_proxy", code_execution_config = False)

# All intermediate executions within the chat session will be logged
user_proxy.initiate_chat(assistant, message = "What is MLflow?", max_turns = 1)`,
  },
  anthropic: {
    minVersion: '2.19.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for Anthropic API calls by calling the {code} function. For example:"
        description="Description of how to log traces for the Anthropic package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.anthropic.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () => `import os
import anthropic

# Enable auto-tracing for Anthropic
mlflow.anthropic.autolog()

# Configure your API key (please ensure that the "ANTHROPIC_API_KEY" environment variable is set)
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Inputs and outputs of API calls will be logged as a trace
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"},
    ],
)`,
  },
  bedrock: {
    minVersion: '2.20.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for Bedrock conversations by calling the {code} function. For example:"
        description="Description of how to log traces for the Bedrock package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.bedrock.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () => `import boto3

mlflow.bedrock.autolog()

# Ensure that your boto3 client has the necessary auth information
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="<REPLACE_WITH_YOUR_AWS_REGION>",
)

model = "anthropic.claude-3-5-sonnet-20241022-v2:0"
messages = [{ "role": "user", "content": [{"text": "Hello!"}]}]

# All intermediate executions within the chat session will be logged
bedrock.converse(modelId=model, messages=messages)`,
  },
  litellm: {
    minVersion: '2.18.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for LiteLLM API calls by calling the {code} function. For example:"
        description="Description of how to log traces for the LiteLLM package using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.litellm.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () => `import litellm

mlflow.litellm.autolog()

# Ensure that the "OPENAI_API_KEY" environment variable is set
messages = [{"role": "user", "content": "Hello!"}]

# Inputs and outputs of the API request will be logged in a trace
litellm.completion(model="gpt-4o-mini", messages=messages)`,
  },
  gemini: {
    minVersion: '2.18.0',
    getContent: () => (
      <FormattedMessage
        defaultMessage="Automatically log traces for Gemini conversations by calling the {code} function. For example:"
        description="Description of how to log traces for API calls to Google's Gemini API using MLflow autologging. This message is followed by a code example."
        values={{
          code: <code>mlflow.gemini.autolog()</code>,
        }}
      />
    ),
    getCodeSource: () => `import google.genai as genai

mlflow.gemini.autolog()

# Replace "GEMINI_API_KEY" with your API key
client = genai.Client(api_key="GEMINI_API_KEY")

# Inputs and outputs of the API request will be logged in a trace
client.models.generate_content(model="gemini-1.5-flash", contents="Hello!")`,
  },
  custom: {
    minVersion: '2.14.3',
    getContent: (baseComponentId) => (
      <>
        <Typography.Paragraph css={{ maxWidth: 800 }}>
          <FormattedMessage
            defaultMessage="To manually instrument your own traces, the most convenient method is to use the {code} function decorator. This will cause the inputs and outputs of the function to be captured in the trace."
            description="Description of how to log custom code traces using MLflow. This message is followed by a code example."
            values={{
              code: <code>@mlflow.trace</code>,
            }}
          />
        </Typography.Paragraph>
        <Typography.Paragraph css={{ maxWidth: 800 }}>
          <FormattedMessage
            defaultMessage="For more complex use cases, MLflow also provides granular APIs that can be used to control tracing behavior. For more information, please visit the <a>official documentation</a> on fluent and client APIs for MLflow Tracing."
            description="Explanation of alternative APIs for custom tracing in MLflow. The link leads to the MLflow documentation for the user to learn more."
            values={{
              a: (text: string) => (
                <Typography.Link
                  title="official documentation"
                  componentId={`${baseComponentId}.traces_table.custom_tracing_docs_link`}
                  href="https://mlflow.org/docs/latest/llms/tracing/index.html#tracing-fluent-apis"
                  openInNewTab
                >
                  {text}
                </Typography.Link>
              ),
            }}
          />
        </Typography.Paragraph>
      </>
    ),
    getCodeSource: () =>
      `@mlflow.trace
def foo(a):
    return a + bar(a)

# Various attributes can be passed to the decorator
# to modify the information contained in the span
@mlflow.trace(name = "custom_name", attributes = { "key": "value" })
def bar(b):
    return b + 1

# Invoking the traced function will cause a trace to be logged
foo(1)`,
  },
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/useExperimentQuery.tsx

```typescript
import type { QueryHookOptions } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { gql } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import type { MlflowGetExperimentQuery, MlflowGetExperimentQueryVariables } from '../../graphql/__generated__/graphql';
import { isArray } from 'lodash';
import { NotFoundError } from '@databricks/web-shared/errors';

const GET_EXPERIMENT_QUERY = gql`
  query MlflowGetExperimentQuery($input: MlflowGetExperimentInput!) @component(name: "MLflow.ExperimentRunTracking") {
    mlflowGetExperiment(input: $input) {
      apiError {
        code
        message
      }
      experiment {
        artifactLocation
        creationTime
        experimentId
        lastUpdateTime
        lifecycleStage
        name
        tags {
          key
          value
        }
      }
    }
  }
`;

export type UseGetExperimentQueryResultExperiment = NonNullable<
  MlflowGetExperimentQuery['mlflowGetExperiment']
>['experiment'];

/* eslint-disable react-hooks/rules-of-hooks */
export const useGetExperimentQuery = ({
  experimentId,
  options = {},
}: {
  experimentId?: string;
  options?: QueryHookOptions<MlflowGetExperimentQuery, MlflowGetExperimentQueryVariables>;
}) => {
  const {
    data,
    loading,
    error: apolloError,
    refetch,
  } = useQuery<MlflowGetExperimentQuery, MlflowGetExperimentQueryVariables>(GET_EXPERIMENT_QUERY, {
    variables: {
      input: {
        experimentId,
      },
    },
    skip: !experimentId,
    ...options,
  });

  // Extract the single experiment entity from the response
  const experimentEntity: UseGetExperimentQueryResultExperiment | undefined = data?.mlflowGetExperiment?.experiment;

  const getApiError = () => {
    return data?.mlflowGetExperiment?.apiError;
  };

  return {
    loading,
    data: experimentEntity,
    refetch,
    apolloError: apolloError,
    apiError: getApiError(),
  } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentReduxStoreCompat.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/useExperimentReduxStoreCompat.ts
Signals: React, Redux/RTK

```typescript
import { useDispatch } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../redux-types';
import { useEffect } from 'react';
import { GET_EXPERIMENT_API } from '../actions';
import { fulfilled } from '../../common/utils/ActionUtils';
import type { useGetExperimentQuery } from './useExperimentQuery';
import { get } from 'lodash';

/**
 * A small helper hook that consumes experiment from the GraphQL response and puts it in the redux store.
 * Helps to keep the redux store in sync with the GraphQL data so page transitions are smooth.
 */
export const useExperimentReduxStoreCompat = (experimentResponse: ReturnType<typeof useGetExperimentQuery>['data']) => {
  const dispatch = useDispatch<ThunkDispatch>();

  useEffect(() => {
    const experimentId = get(experimentResponse, 'experimentId');
    if (experimentResponse && experimentId) {
      dispatch((thunkDispatch: ThunkDispatch, getStore: () => ReduxState) => {
        const alreadyStored = Boolean(getStore().entities?.experimentsById?.[experimentId]);
        if (!alreadyStored) {
          thunkDispatch({
            type: fulfilled(GET_EXPERIMENT_API),
            payload: { experiment: experimentResponse },
          });
        }
      });
    }
  }, [experimentResponse, dispatch]);
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentTrackingDetailsPageLayoutStyles.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/useExperimentTrackingDetailsPageLayoutStyles.tsx
Signals: React

```typescript
import { getBottomOnlyShadowScrollStyles, useDesignSystemTheme } from '@databricks/design-system';
import type { Interpolation, Theme } from '@emotion/react';
import { useMemo } from 'react';

/**
 * Provides CSS styles for details pages (logged model details page, run details page)
 * using the unified layout style.
 */
export const useExperimentTrackingDetailsPageLayoutStyles = () => {
  const { theme } = useDesignSystemTheme();

  const detailsPageTableStyles = useMemo<Interpolation<Theme>>(
    () => ({
      minHeight: 200,
      maxHeight: 500,
      height: 'min-content',
      overflow: 'hidden',
      '& > div': {
        ...getBottomOnlyShadowScrollStyles(theme),
      },
    }),
    [theme],
  );

  const detailsPageNoEntriesStyles = useMemo<Interpolation<Theme>>(
    () => [
      {
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      {
        marginTop: theme.spacing.md,
      },
    ],
    [theme],
  );

  return {
    detailsPageTableStyles,
    detailsPageNoEntriesStyles,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useMonitoringConfig.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/useMonitoringConfig.tsx
Signals: React

```typescript
import { merge } from 'lodash';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useCallback } from 'react';

// A global config that is used as a context for monitoring components.
export interface MonitoringConfig {
  dateNow: Date;
  lastRefreshTime: number;
  refresh: () => void;
}

// Define a default configuration
const getDefaultConfig = (): MonitoringConfig => {
  return {
    dateNow: new Date(),
    lastRefreshTime: Date.now(),
    refresh: () => {},
  };
};

// Create the context with a default value
const MonitoringConfigContext = createContext<MonitoringConfig>(getDefaultConfig());

interface MonitoringConfigProviderProps {
  config?: Partial<MonitoringConfig>;
  children: ReactNode;
}

export const MonitoringConfigProvider: React.FC<React.PropsWithChildren<MonitoringConfigProviderProps>> = ({
  config,
  children,
}) => {
  const defaultConfig = getDefaultConfig();
  // Remove undefined values from the config object

  const mergedConfig = merge({}, defaultConfig, config);

  const [lastRefreshTime, setLastRefreshTime] = React.useState(mergedConfig.lastRefreshTime);

  // Derive dateNow from lastRefreshTime
  const dateNow = useMemo(() => new Date(lastRefreshTime), [lastRefreshTime]);

  // Single refresh method
  const refresh = useCallback(() => {
    setLastRefreshTime(Date.now());
  }, []);

  return (
    <MonitoringConfigContext.Provider
      value={{
        ...mergedConfig,
        dateNow,
        lastRefreshTime,
        refresh,
      }}
    >
      {children}
    </MonitoringConfigContext.Provider>
  );
};

export const useMonitoringConfig = (): MonitoringConfig => {
  const context = useContext(MonitoringConfigContext);

  if (!context) {
    return getDefaultConfig(); // Fallback to defaults if no provider is found
  }

  return context;
};
```

--------------------------------------------------------------------------------

````
