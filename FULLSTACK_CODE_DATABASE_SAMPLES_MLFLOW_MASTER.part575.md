---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 575
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 575 of 991)

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

---[FILE: CsvUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/CsvUtils.ts

```typescript
import { compact, uniq } from 'lodash';
import Utils from '../../common/utils/Utils';
import type { RunsChartsRunData } from '../components/runs-charts/components/RunsCharts.common';
import type { MetricEntity, RunInfoEntity } from '../types';
import type { KeyValueEntity } from '../../common/types';
import moment from 'moment';

const { getDuration, getRunNameFromTags, getSourceType, getSourceName, getUser } = Utils;

/**
 * Turn a list of params/metrics to a map of metric key to metric.
 */
const toMap = <T extends MetricEntity | KeyValueEntity>(params: T[]) =>
  params.reduce((result, entity) => ({ ...result, [entity.key]: entity }), {} as Record<string, T>);

/**
 * Escapes a string for safe inclusion in a CSV file to prevent CSV injection attacks.
 * See https://owasp.org/www-community/attacks/CSV_Injection for more information.
 */
const csvEscape = (x: any) => {
  if (x === null || x === undefined) {
    return '';
  }
  let sanitized = typeof x === 'string' ? x : x.toString();

  // Escape double quotes by doubling them
  sanitized = sanitized.replace(/"/g, '""');

  // If the string starts with a character that could be interpreted as a formula, escape it
  // by prepending a single quote
  if (/^[=+\-@\r\t]/.test(sanitized)) {
    sanitized = `'${sanitized}`;
  }

  return `"${sanitized}"`;
};

/**
 * Convert a table to a CSV string.
 *
 * @param columns Names of columns
 * @param data Array of rows, each of which are an array of field values
 */
const tableToCsv = (columns: any /* TODO */, data: any /* TODO */) => {
  let csv = '';
  let i;

  for (i = 0; i < columns.length; i++) {
    csv += csvEscape(columns[i]);
    if (i < columns.length - 1) {
      csv += ',';
    }
  }
  csv += '\n';

  for (i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      csv += csvEscape(data[i][j]);
      if (j < data[i].length - 1) {
        csv += ',';
      }
    }
    csv += '\n';
  }

  return csv;
};

/**
 * Convert an array of run infos to a CSV string, extracting the params and metrics in the
 * provided lists.
 */
export const runInfosToCsv = (params: {
  runInfos: RunInfoEntity[];
  paramKeyList: string[];
  metricKeyList: string[];
  tagKeyList: string[];
  paramsList: KeyValueEntity[][];
  metricsList: MetricEntity[][];
  tagsList: Record<string, KeyValueEntity>[];
}) => {
  const { runInfos, paramKeyList, metricKeyList, tagKeyList, paramsList, metricsList, tagsList } = params;

  const columns = [
    'Start Time',
    'Duration',
    'Run ID',
    'Name',
    'Source Type',
    'Source Name',
    'User',
    'Status',
    ...paramKeyList,
    ...metricKeyList,
    ...tagKeyList,
  ];

  const data = runInfos.map((runInfo, index) => {
    // To avoid including a comma in the timestamp string, use manual formatting instead of one from intl
    const startTime = moment(new Date(runInfo.startTime)).format('YYYY-MM-DD HH:mm:ss');
    const row = [
      startTime,
      getDuration(runInfo.startTime, runInfo.endTime) || '',
      runInfo.runUuid,
      runInfo.runName || getRunNameFromTags(tagsList[index]), // add run name to csv export row
      getSourceType(tagsList[index]),
      getSourceName(tagsList[index]),
      getUser(runInfo, tagsList[index]),
      runInfo.status,
    ];
    const paramsMap = toMap(paramsList[index]);
    const metricsMap = toMap(metricsList[index]);
    const tagsMap = tagsList[index];

    paramKeyList.forEach((paramKey) => {
      if (paramsMap[paramKey]) {
        row.push(paramsMap[paramKey].value);
      } else {
        row.push('');
      }
    });
    metricKeyList.forEach((metricKey) => {
      if (metricsMap[metricKey]) {
        row.push(metricsMap[metricKey].value);
      } else {
        row.push('');
      }
    });
    tagKeyList.forEach((tagKey) => {
      if (tagsMap[tagKey]) {
        row.push(tagsMap[tagKey].value);
      } else {
        row.push('');
      }
    });
    return row;
  });

  return tableToCsv(columns, data);
};

export const chartMetricHistoryToCsv = (traces: RunsChartsRunData[], metricKeys: string[]) => {
  const isGrouped = traces.some((trace) => trace.groupParentInfo);

  const headerColumn = isGrouped ? 'Group' : 'Run';

  const columns = [headerColumn, 'Run ID', 'metric', 'step', 'timestamp', 'value'];

  const data = metricKeys.flatMap((metricKey) => {
    const perDataTrace = traces.flatMap((trace) => {
      const perMetricEntry = trace.metricsHistory?.[metricKey]?.map((value) => [
        trace.displayName,
        trace.runInfo?.runUuid || '',
        value.key,
        value.step.toString(),
        value.timestamp.toString(),
        value.value.toString(),
      ]);
      return perMetricEntry || [];
    });
    return perDataTrace;
  });

  return tableToCsv(columns, data);
};

export const chartDataToCsv = (traces: RunsChartsRunData[], metricKeys: string[], paramKeys: string[]) => {
  const isGrouped = traces.some((trace) => trace.groupParentInfo);

  const headerColumn = isGrouped ? 'Group' : 'Run';

  const columns = [headerColumn, 'Run ID', ...metricKeys, ...paramKeys];

  const data = traces.map((trace) => {
    const row = [trace.displayName, trace.runInfo?.runUuid || ''];

    metricKeys.forEach((metricKey) => {
      const metricValue = trace.metrics?.[metricKey];
      row.push(metricValue?.value.toString() || '');
    });

    paramKeys.forEach((paramKey) => {
      const paramValue = trace.params?.[paramKey];
      row.push(paramValue?.value.toString() || '');
    });

    return row;
  });

  return tableToCsv(columns, data);
};
```

--------------------------------------------------------------------------------

---[FILE: DatasetUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/DatasetUtils.ts

```typescript
import { DatasetSourceTypes, type DatasetSummary, type RunDatasetWithTags } from '../types';

export const datasetSummariesEqual = (summary1: DatasetSummary, summary2: DatasetSummary) =>
  summary1.digest === summary2.digest && summary1.name === summary2.name && summary1.context === summary2.context;

export const getDatasetSourceUrl = (datasetWithTags: RunDatasetWithTags) => {
  const { dataset } = datasetWithTags;
  const sourceType = dataset.sourceType;
  try {
    if (sourceType === DatasetSourceTypes.HTTP) {
      const { url } = JSON.parse(dataset.source);
      return url;
    }
    if (sourceType === DatasetSourceTypes.S3) {
      const { uri } = JSON.parse(dataset.source);
      return uri;
    }
    if (sourceType === DatasetSourceTypes.HUGGING_FACE) {
      const { path } = JSON.parse(dataset.source);
      return `https://huggingface.co/datasets/${path}`;
    }
  } catch {
    return null;
  }
  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: evaluationUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/evaluationUtils.test.ts

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { buildSystemPrompt, buildUserPrompt, extractTemplateVariables } from './evaluationUtils';

jest.mock('./TraceUtils', () => ({
  extractInputs: jest.fn(),
  extractOutputs: jest.fn(),
  extractExpectations: jest.fn(),
}));

describe('evaluationUtils', () => {
  describe('extractTemplateVariables', () => {
    describe('Golden Path - Successful Operations', () => {
      it('should extract template variables in order they appear', () => {
        // Arrange
        const instructions = 'Evaluate if {{outputs}} correctly answers {{inputs}}';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual(['outputs', 'inputs']);
      });

      it('should extract all three reserved variables', () => {
        // Arrange
        const instructions = 'Check {{inputs}}, {{outputs}}, and {{expectations}}';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual(['inputs', 'outputs', 'expectations']);
      });

      it('should handle only one variable', () => {
        // Arrange
        const instructions = 'Review the {{outputs}}';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual(['outputs']);
      });

      it('should extract trace variable', () => {
        // Arrange
        const instructions = 'Evaluate the {{trace}}';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual(['trace']);
      });
    });

    describe('Edge Cases', () => {
      it('should handle duplicate variables', () => {
        // Arrange
        const instructions = 'Compare {{inputs}} with {{outputs}} and verify {{inputs}} again';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert - should only include each variable once
        expect(result).toEqual(['inputs', 'outputs']);
      });

      it('should ignore non-reserved variables', () => {
        // Arrange
        const instructions = 'Use {{inputs}} and {{custom_var}} to evaluate {{outputs}}';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert - should only include reserved variables
        expect(result).toEqual(['inputs', 'outputs']);
      });

      it('should handle variables with whitespace', () => {
        // Arrange
        const instructions = 'Check {{ inputs }} and {{  outputs  }}';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual(['inputs', 'outputs']);
      });

      it('should return empty array when no variables found', () => {
        // Arrange
        const instructions = 'No variables here';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual([]);
      });

      it('should handle empty string', () => {
        // Arrange
        const instructions = '';

        // Act
        const result = extractTemplateVariables(instructions);

        // Assert
        expect(result).toEqual([]);
      });
    });
  });

  describe('buildSystemPrompt', () => {
    describe('Golden Path - Successful Operations', () => {
      it('should successfully build system prompt with instructions', () => {
        // Arrange
        const instructions = 'Rate the response on a scale of 1-5 for accuracy and relevance';

        // Act
        const result = buildSystemPrompt(instructions);

        // Assert
        expect(result).toEqual(
          `You are an expert judge tasked with evaluating the performance of an AI
agent on a particular query. You will be given instructions that describe the criteria and
methodology for evaluating the agent's performance on the query.

Your task: Rate the response on a scale of 1-5 for accuracy and relevance.

Please provide your assessment in the following JSON format only (no markdown):

{
    "result": "The evaluation rating/result",
    "rationale": "Detailed explanation for the evaluation"
}`,
        );
      });
    });
  });

  describe('buildUserPrompt', () => {
    describe('Golden Path - Successful Operations', () => {
      it('should successfully build user prompt with all fields present when all template variables included', () => {
        // Arrange
        const inputs = '{"query": "What is AI?"}';
        const outputs = '{"response": "AI stands for Artificial Intelligence"}';
        const expectations = { accuracy: 0.9, completeness: 'high' };
        const templateVariables = ['inputs', 'outputs', 'expectations'];

        // Act
        const result = buildUserPrompt(inputs, outputs, expectations, templateVariables);

        // Assert
        expect(result).toEqual(
          `inputs: {"query": "What is AI?"}
outputs: {"response": "AI stands for Artificial Intelligence"}
expectations: {
  "accuracy": 0.9,
  "completeness": "high"
}`,
        );
      });

      it('should only include fields referenced in template variables', () => {
        // Arrange - only inputs and outputs in template, but expectations exist
        const inputs = 'test input';
        const outputs = 'test output';
        const expectations = { score: 5 };
        const templateVariables = ['inputs', 'outputs'];

        // Act
        const result = buildUserPrompt(inputs, outputs, expectations, templateVariables);

        // Assert - expectations should NOT be included
        expect(result).toEqual('inputs: test input\noutputs: test output');
      });

      it('should build prompt with partial fields based on template variables', () => {
        // Arrange - only inputs in template
        let result = buildUserPrompt('test input', 'test output', {}, ['inputs']);
        expect(result).toEqual('inputs: test input');

        // Arrange - only outputs in template
        result = buildUserPrompt('test input', 'test output', {}, ['outputs']);
        expect(result).toEqual('outputs: test output');

        // Arrange - only expectations in template
        result = buildUserPrompt('test input', null, { score: 5 }, ['expectations']);
        expect(result).toEqual(`expectations: {
  "score": 5
}`);

        // Arrange - inputs and outputs in template
        result = buildUserPrompt('question', 'answer', { score: 5 }, ['inputs', 'outputs']);
        expect(result).toEqual('inputs: question\noutputs: answer');
      });

      it('should preserve order of template variables', () => {
        // Arrange - outputs before inputs in template
        const inputs = 'test input';
        const outputs = 'test output';
        const templateVariables = ['outputs', 'inputs'];

        // Act
        const result = buildUserPrompt(inputs, outputs, {}, templateVariables);

        // Assert - outputs should appear first
        expect(result).toEqual('outputs: test output\ninputs: test input');
      });
    });

    describe('Edge Cases', () => {
      it('should return fallback message when all fields are null/empty', () => {
        // Arrange - all null with template variables
        let result = buildUserPrompt(null, null, {}, ['inputs', 'outputs']);
        expect(result).toEqual('Follow the instructions from the first message');

        // Arrange - all undefined
        result = buildUserPrompt(undefined as any, undefined as any, {}, ['inputs', 'outputs']);
        expect(result).toEqual('Follow the instructions from the first message');

        // Arrange - empty strings
        result = buildUserPrompt('', '', {}, ['inputs', 'outputs']);
        expect(result).toEqual('Follow the instructions from the first message');
      });

      it('should return fallback message when template variables is empty', () => {
        // Arrange - empty template variables array
        const result = buildUserPrompt('test input', 'test output', { score: 5 }, []);
        expect(result).toEqual('Follow the instructions from the first message');
      });

      it('should return fallback message when no matching data for template variables', () => {
        // Arrange - template asks for expectations but none exist
        const result = buildUserPrompt(null, null, {}, ['expectations']);
        expect(result).toEqual('Follow the instructions from the first message');
      });

      it('should handle complex data types and special formatting', () => {
        // Arrange - complex nested expectations
        const expectations = {
          nested: { level1: { level2: 'value' } },
          array: [1, 2, 3],
          nullValue: null,
          boolValue: true,
        };
        let result = buildUserPrompt('test', null, expectations, ['inputs', 'expectations']);
        expect(result).toEqual(`inputs: test
expectations: {
  "nested": {
    "level1": {
      "level2": "value"
    }
  },
  "array": [
    1,
    2,
    3
  ],
  "nullValue": null,
  "boolValue": true
}`);

        // Arrange - newlines in inputs/outputs
        result = buildUserPrompt('Line 1\nLine 2', 'Output line 1\nOutput line 2', {}, ['inputs', 'outputs']);
        expect(result).toEqual('inputs: Line 1\nLine 2\noutputs: Output line 1\nOutput line 2');

        // Arrange - JSON string inputs
        result = buildUserPrompt('{"key": "value"}', null, {}, ['inputs']);
        expect(result).toEqual('inputs: {"key": "value"}');
      });
    });

    describe('Error Conditions', () => {
      it('should handle null/undefined expectations object gracefully', () => {
        // Arrange - null expectations
        let result = buildUserPrompt('test', null, null as any, ['inputs']);
        expect(result).toEqual('inputs: test');

        // Arrange - undefined expectations
        result = buildUserPrompt(null, 'test', undefined as any, ['outputs']);
        expect(result).toEqual('outputs: test');
      });

      it('should skip variables not in data even if in template', () => {
        // Arrange - template wants all three but only inputs provided
        const result = buildUserPrompt('test input', null, {}, ['inputs', 'outputs', 'expectations']);
        expect(result).toEqual('inputs: test input');
      });

      it('should ignore trace variable since it is not in dataMap', () => {
        // Arrange - template includes trace but we don't have trace data in dataMap
        const result = buildUserPrompt('test input', 'test output', {}, ['inputs', 'trace', 'outputs']);
        // Assert - trace is skipped, only inputs and outputs included
        expect(result).toEqual('inputs: test input\noutputs: test output');
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: evaluationUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/evaluationUtils.ts

```typescript
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import { extractInputs, extractOutputs, extractExpectations } from './TraceUtils';

/**
 * Constants for judge evaluation prompts.
 *
 * These constants mirror the Python implementation in:
 * mlflow/genai/judges/instructions_judge/constants.py
 * and mlflow/genai/judges/instructions_judge/__init__.py
 */

// Common base prompt for all judge evaluations
const JUDGE_BASE_PROMPT = `You are an expert judge tasked with evaluating the performance of an AI
agent on a particular query. You will be given instructions that describe the criteria and
methodology for evaluating the agent's performance on the query.`;

// Output format instructions for judge responses
const OUTPUT_FORMAT_INSTRUCTIONS = `
Please provide your assessment in the following JSON format only (no markdown):

{
    "result": "The evaluation rating/result",
    "rationale": "Detailed explanation for the evaluation"
}`;

// Fallback message when no data is provided
const FALLBACK_USER_MESSAGE = 'Follow the instructions from the first message';

// Pattern for extracting template variables like {{inputs}}, {{outputs}}, {{expectations}}
// Matches Python pattern: mlflow/prompt/constants.py PROMPT_TEMPLATE_VARIABLE_PATTERN
const TEMPLATE_VARIABLE_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*\}\}/g;

// Reserved template variables that can be used in instructions
export const TEMPLATE_VARIABLES = ['inputs', 'outputs', 'expectations', 'trace'];

/**
 * Extracts template variables from instructions string. Variables are returned in the order they first appear.
 *
 * Example: "Evaluate if {{outputs}} correctly answers {{inputs}}" returns ['outputs', 'inputs']
 *
 * @param instructions - The judge instructions string with template variables
 * @returns Array of variable names found in the instructions
 */
export function extractTemplateVariables(instructions: string): string[] {
  const matches = instructions.matchAll(TEMPLATE_VARIABLE_PATTERN);
  const seen = new Set<string>();
  const variables: string[] = [];

  for (const match of matches) {
    const varName = match[1];
    if (!seen.has(varName) && TEMPLATE_VARIABLES.includes(varName)) {
      seen.add(varName);
      variables.push(varName);
    }
  }

  return variables;
}

/**
 * Combined extraction function for all trace data
 */
export function extractFromTrace(trace: ModelTrace): {
  inputs: string | null;
  outputs: string | null;
  expectations: Record<string, any>;
} {
  return {
    inputs: extractInputs(trace),
    outputs: extractOutputs(trace),
    expectations: extractExpectations(trace),
  };
}

/**
 * Builds the system prompt for the judge
 */
export function buildSystemPrompt(instructions: string): string {
  const taskSection = `Your task: ${instructions}.`;
  return `${JUDGE_BASE_PROMPT}\n\n${taskSection}\n${OUTPUT_FORMAT_INSTRUCTIONS}`;
}

/**
 * Builds the user prompt with extracted data.
 *
 * Only includes fields that are referenced in the instructions template variables.
 *
 * @param inputs - Extracted inputs from trace
 * @param outputs - Extracted outputs from trace
 * @param expectations - Extracted expectations from trace
 * @param templateVariables - Variables found in the instructions
 * @returns Formatted user prompt string
 */
export function buildUserPrompt(
  inputs: string | null,
  outputs: string | null,
  expectations: Record<string, any>,
  templateVariables: string[],
): string {
  const parts: string[] = [];

  // Build a map of variable name to data
  const dataMap: Record<string, any> = {
    inputs,
    outputs,
    expectations,
  };

  // Only include variables that are in the template AND have non-null/non-empty data
  for (const varName of templateVariables) {
    const data = dataMap[varName];

    if (varName === 'inputs' && data !== null && data !== undefined && data !== '') {
      parts.push(`inputs: ${data}`);
    } else if (varName === 'outputs' && data !== null && data !== undefined && data !== '') {
      parts.push(`outputs: ${data}`);
    } else if (varName === 'expectations' && data && Object.keys(data).length > 0) {
      parts.push(`expectations: ${JSON.stringify(data, null, 2)}`);
    }
  }

  // Some model providers require non-empty user messages
  return parts.length > 0 ? parts.join('\n') : FALLBACK_USER_MESSAGE;
}
```

--------------------------------------------------------------------------------

---[FILE: ExperimentKindUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/ExperimentKindUtils.ts

```typescript
import { ExperimentKind } from '../constants';
import type { MessageDescriptor } from 'react-intl';
import { defineMessage } from 'react-intl';
import type { KeyValueEntity } from '../../common/types';

export const EXPERIMENT_KIND_TAG_KEY = 'mlflow.experimentKind';

export const getExperimentKindFromTags = (
  experimentTags?:
    | ({ __typename: 'MlflowExperimentTag'; key: string | null; value: string | null }[] | null)
    | KeyValueEntity[],
): ExperimentKind | undefined =>
  experimentTags?.find((tag) => tag.key === EXPERIMENT_KIND_TAG_KEY)?.value as ExperimentKind;

export const isEditableExperimentKind = (experimentKind: ExperimentKind): boolean =>
  experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED ||
  experimentKind === ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED ||
  experimentKind === ExperimentKind.NO_INFERRED_TYPE ||
  experimentKind === ExperimentKind.GENAI_DEVELOPMENT ||
  experimentKind === ExperimentKind.CUSTOM_MODEL_DEVELOPMENT ||
  experimentKind === ExperimentKind.EMPTY;

export const isGenAIExperimentKind = (experimentKind: ExperimentKind): boolean =>
  experimentKind === ExperimentKind.GENAI_DEVELOPMENT || experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED;

export const normalizeInferredExperimentKind = (experimentKind: ExperimentKind): ExperimentKind => {
  if (experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED) {
    return ExperimentKind.GENAI_DEVELOPMENT;
  }
  if (experimentKind === ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED) {
    return ExperimentKind.CUSTOM_MODEL_DEVELOPMENT;
  }
  return experimentKind;
};

export const ExperimentKindDropdownLabels: Record<ExperimentKind, MessageDescriptor> = {
  [ExperimentKind.GENAI_DEVELOPMENT]: defineMessage({
    defaultMessage: 'GenAI apps & agents',
    description: 'Label for experiments focused on generative AI model development',
  }),
  [ExperimentKind.CUSTOM_MODEL_DEVELOPMENT]: defineMessage({
    defaultMessage: 'Machine learning',
    description: 'Label for custom experiments focused on machine learning',
  }),
  [ExperimentKind.GENAI_DEVELOPMENT_INFERRED]: defineMessage({
    defaultMessage: 'GenAI apps & agents',
    description: 'Label for experiments automatically identified as generative AI development',
  }),
  [ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED]: defineMessage({
    defaultMessage: 'Machine learning',
    description: 'Label for custom experiments automatically identified as being focused on machine learning',
  }),
  [ExperimentKind.NO_INFERRED_TYPE]: defineMessage({
    defaultMessage: 'None',
    description: 'Label for experiments with no automatically inferred experiment type',
  }),
  [ExperimentKind.FINETUNING]: defineMessage({
    defaultMessage: 'Finetuning',
    description: 'Label for experiments focused on model finetuning',
  }),
  [ExperimentKind.REGRESSION]: defineMessage({
    defaultMessage: 'Regression',
    description: 'Label for experiments focused on regression modeling',
  }),
  [ExperimentKind.CLASSIFICATION]: defineMessage({
    defaultMessage: 'Classification',
    description: 'Label for experiments focused on classification modeling',
  }),
  [ExperimentKind.FORECASTING]: defineMessage({
    defaultMessage: 'Forecasting',
    description: 'Label for experiments focused on time series forecasting',
  }),
  [ExperimentKind.AUTOML]: defineMessage({
    defaultMessage: 'AutoML',
    description: 'Label for generic AutoML experiments',
  }),
  [ExperimentKind.EMPTY]: defineMessage({
    defaultMessage: 'None',
    description: 'Label for experiments with no experiment kind',
  }),
};

export const ExperimentKindShortLabels: Record<ExperimentKind, MessageDescriptor> = {
  [ExperimentKind.GENAI_DEVELOPMENT]: defineMessage({
    defaultMessage: 'GenAI apps & agents',
    description: 'A short label for custom experiments focused on generative AI app and agent development',
  }),
  [ExperimentKind.CUSTOM_MODEL_DEVELOPMENT]: defineMessage({
    defaultMessage: 'Machine learning',
    description: 'A short label for custom experiments focused on machine learning',
  }),
  [ExperimentKind.GENAI_DEVELOPMENT_INFERRED]: defineMessage({
    defaultMessage: 'GenAI apps & agents',
    description:
      'A short label for custom experiments automatically identified as being focused on generative AI app and agent development',
  }),
  [ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED]: defineMessage({
    defaultMessage: 'Machine learning',
    description: 'A short label for custom experiments automatically identified as being focused on machine learning',
  }),
  [ExperimentKind.NO_INFERRED_TYPE]: defineMessage({
    defaultMessage: 'None',
    description: 'A short label for experiments with no automatically inferred experiment type',
  }),
  [ExperimentKind.FINETUNING]: defineMessage({
    defaultMessage: 'finetuning',
    description: 'A short label for experiments focused on model finetuning',
  }),
  [ExperimentKind.REGRESSION]: defineMessage({
    defaultMessage: 'regression',
    description: 'A short label for experiments focused on regression modeling',
  }),
  [ExperimentKind.CLASSIFICATION]: defineMessage({
    defaultMessage: 'classification',
    description: 'A short label for experiments focused on classification modeling',
  }),
  [ExperimentKind.FORECASTING]: defineMessage({
    defaultMessage: 'forecasting',
    description: 'A short label for experiments focused on time series forecasting',
  }),
  [ExperimentKind.AUTOML]: defineMessage({
    defaultMessage: 'AutoML',
    description: 'A short label for generic AutoML experiments',
  }),
  [ExperimentKind.EMPTY]: defineMessage({
    defaultMessage: 'None',
    description: 'A short label for experiments with no experiment kind',
  }),
};

// Returns list of experiment kinds that are user-selectable in the dropdown
export const getSelectableExperimentKinds = () => [
  ExperimentKind.GENAI_DEVELOPMENT,
  ExperimentKind.CUSTOM_MODEL_DEVELOPMENT,
];
```

--------------------------------------------------------------------------------

---[FILE: IsUCModelName.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/IsUCModelName.ts

```typescript
/**
 * Checks if a given model name is a valid UC entity name.
 * A valid UC entity name follows the pattern: "catalog.schema.model".
 * This is used to distinguish from other registries model names which should not contain dots.
 */
export const isUCModelName = (name: string) => Boolean(name.match(/^[^. /]+\.[^. /]+\.[^. /]+$/));
```

--------------------------------------------------------------------------------

---[FILE: LLMGatewayUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/LLMGatewayUtils.ts

```typescript
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { ModelGatewayRouteTask } from '../sdk/MlflowEnums';
import type {
  EndpointModelChatResponseType,
  EndpointModelCompletionsResponseType,
  EndpointModelGatewayResponseType,
  ModelGatewayChatResponseType,
  ModelGatewayCompletionsResponseType,
  ModelGatewayResponseType,
  ModelGatewayRoute,
} from '../sdk/ModelGatewayService';

export class GatewayErrorWrapper extends ErrorWrapper {
  getGatewayErrorMessage() {
    return this.textJson?.error?.message || this.textJson?.message || this.textJson?.toString() || this.text;
  }
}
export const parseEndpointEvaluationResponse = (
  response: EndpointModelGatewayResponseType,
  task: ModelGatewayRouteTask,
) => {
  // We're supporting completions and chat responses for the time being
  if (task === ModelGatewayRouteTask.LLM_V1_COMPLETIONS) {
    const completionsResponse = response as EndpointModelCompletionsResponseType;
    const text = completionsResponse.choices?.[0]?.text;
    const { usage } = completionsResponse;
    if (text && usage) {
      return {
        text,
        metadata: {
          total_tokens: usage.total_tokens,
          output_tokens: usage.completion_tokens,
          input_tokens: usage.prompt_tokens,
        },
      };
    }
  }
  if (task === ModelGatewayRouteTask.LLM_V1_CHAT) {
    const chatResponse = response as EndpointModelChatResponseType;
    const text = chatResponse.choices?.[0]?.message?.content;
    const { usage } = chatResponse;
    if (text && usage) {
      return {
        text,
        metadata: {
          total_tokens: usage.total_tokens,
          output_tokens: usage.completion_tokens,
          input_tokens: usage.prompt_tokens,
        },
      };
    }
  }
  // Should not happen since we shouldn't call other route types for now
  throw new Error(`Unrecognizable AI gateway response metadata "${response.usage}"!`);
};
```

--------------------------------------------------------------------------------

---[FILE: LoggedModels.test-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/LoggedModels.test-utils.ts

```typescript
import { random } from 'lodash';
import type { LoggedModelProto } from '../types';
import { LoggedModelStatusProtoEnum } from '../types';
import { generateRandomRunName } from './RunNameUtils';
import { rest } from 'msw';
import { getAjaxUrl } from '../../common/utils/FetchUtils';

// Generate some demo data
const getLoggedModelsDemoData = (experimentId: string) =>
  new Array(50).fill(0).map<LoggedModelProto>((_, index) => ({
    info: {
      artifact_uri: `dbfs:/databricks/mlflow/${'model-' + (index + 1)}`,
      creation_timestamp_ms: 1728322600000,
      last_updated_timestamp_ms: 1728322600000,
      source_run_id: 'run-id-1',
      creator_id: 'test@test.com',
      experiment_id: experimentId,
      model_id: `m-${index + 1}`,
      model_type: 'Agent',
      name: 'model-' + (index + 1),
      tags: [
        {
          key: 'mlflow.sourceRunName',
          value: generateRandomRunName(),
        },
      ],
      status_message: 'Ready',
      status:
        index % 20 === 7
          ? LoggedModelStatusProtoEnum.LOGGED_MODEL_UPLOAD_FAILED
          : index % 10 === 1
          ? LoggedModelStatusProtoEnum.LOGGED_MODEL_PENDING
          : LoggedModelStatusProtoEnum.LOGGED_MODEL_READY,
      registrations: [],
    },
    data: {
      metrics: new Array(20).fill(0).map((_, index) => {
        // Cycle through 5 run IDs
        const run_index = (index % 5) + 1;
        const run_id = `run-id-${run_index}`;
        // First two runs will have datasets 1 and 2, other will get 11 and 12
        const dataset_digest = String((run_index > 2 ? 10 : 0) + Math.floor(index / 10) + 1);
        const dataset_name = `dataset-${dataset_digest}`;
        return {
          key: 'metric-' + (index + 1),
          value: random(-50, 50, true),
          step: 1,
          timestamp: 1728322600000,
          dataset_digest,
          dataset_name,
          model_id: (index + 1).toString(),
          run_id,
        };
      }),
      params: [
        {
          key: 'top_k',
          value: '0.9',
        },
        {
          key: 'generative_llm',
          value: 'GPT-4',
        },
        {
          key: 'max_tokens',
          value: '2000',
        },
      ],
    },
  }));

export const mockSearchLoggedModels = (
  experimentId = 'test-experiment',
  models = getLoggedModelsDemoData(experimentId),
) =>
  rest.post(getAjaxUrl('ajax-api/2.0/mlflow/logged-models/search'), (req, res, ctx) =>
    res(
      ctx.json({
        models,
      }),
    ),
  );

export const mockGetLoggedModels = (models = getLoggedModelsDemoData('test-experiment')) =>
  rest.get(getAjaxUrl('ajax-api/2.0/mlflow/logged-models:batchGet'), (req, res, ctx) =>
    res(
      ctx.json({
        models,
      }),
    ),
  );
```

--------------------------------------------------------------------------------

````
