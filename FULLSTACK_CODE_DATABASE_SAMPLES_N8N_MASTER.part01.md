---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 1
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 51)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - n8n-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/n8n-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const EVAL_TYPES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EVAL_TYPES
- EVAL_USERS
- TRACEABLE_NAMES
- METRIC_KEYS
- DEFAULTS
```

--------------------------------------------------------------------------------

---[FILE: load-nodes.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/load-nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export function loadNodesFromFile(): INodeTypeDescription[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadNodesFromFile
```

--------------------------------------------------------------------------------

---[FILE: prompts-example.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/prompts-example.ts
Signals: N/A
Excerpt (<=80 chars): export const examplePrompts = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- examplePrompts
```

--------------------------------------------------------------------------------

---[FILE: test-case-generator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/test-case-generator.ts
Signals: Zod
Excerpt (<=80 chars):  export function createTestCaseGeneratorChain(llm: BaseChatModel) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestCaseGeneratorChain
```

--------------------------------------------------------------------------------

---[FILE: workflow-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/workflow-evaluator.ts
Signals: N/A
Excerpt (<=80 chars): export function calculateWeightedScore(result: EvaluationResult): number {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculateWeightedScore
```

--------------------------------------------------------------------------------

---[FILE: base.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/base.ts
Signals: Zod
Excerpt (<=80 chars):  export function createEvaluatorChain<TResult extends Record<string, unknown>>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: best-practices-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/best-practices-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type BestPracticesResult = z.infer<typeof bestPracticesResultSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createBestPracticesEvaluatorChain
- BestPracticesResult
```

--------------------------------------------------------------------------------

---[FILE: connections-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/connections-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type ConnectionsResult = z.infer<typeof connectionsResultSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createConnectionsEvaluatorChain
- ConnectionsResult
```

--------------------------------------------------------------------------------

---[FILE: data-flow-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/data-flow-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type DataFlowResult = z.infer<typeof dataFlowResultSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDataFlowEvaluatorChain
- DataFlowResult
```

--------------------------------------------------------------------------------

---[FILE: efficiency-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/efficiency-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type EfficiencyResult = z.infer<typeof efficiencyResultSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createEfficiencyEvaluatorChain
- EfficiencyResult
```

--------------------------------------------------------------------------------

---[FILE: expressions-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/expressions-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type ExpressionsResult = z.infer<typeof expressionsResultSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createExpressionsEvaluatorChain
- ExpressionsResult
```

--------------------------------------------------------------------------------

---[FILE: functionality-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/functionality-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type FunctionalityResult = z.infer<typeof functionalityResultSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createFunctionalityEvaluatorChain
- FunctionalityResult
```

--------------------------------------------------------------------------------

---[FILE: maintainability-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/maintainability-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type MaintainabilityResult = z.infer<typeof maintainabilityResultSche...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMaintainabilityEvaluatorChain
- MaintainabilityResult
```

--------------------------------------------------------------------------------

---[FILE: node-configuration-evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/chains/evaluators/node-configuration-evaluator.ts
Signals: Zod
Excerpt (<=80 chars):  export type NodeConfigurationResult = z.infer<typeof nodeConfigurationResult...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNodeConfigurationEvaluatorChain
- NodeConfigurationResult
```

--------------------------------------------------------------------------------

---[FILE: display.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/cli/display.ts
Signals: N/A
Excerpt (<=80 chars): export function createProgressBar(total: number): cliProgress.SingleBar {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createProgressBar
- updateProgress
- displayResults
- displayError
```

--------------------------------------------------------------------------------

---[FILE: environment.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/core/environment.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TestEnvironment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTracer
- createLangsmithClient
- createAgent
- getConcurrencyLimit
- shouldGenerateTestCases
- howManyTestCasesToGenerate
- TestEnvironment
- CreateAgentOptions
```

--------------------------------------------------------------------------------

---[FILE: test-runner.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/core/test-runner.ts
Signals: N/A
Excerpt (<=80 chars): export function createErrorResult(testCase: TestCase, error: unknown): TestRe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createErrorResult
- initializeTestTracking
- RunSingleTestOptions
```

--------------------------------------------------------------------------------

---[FILE: evaluator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/langsmith/evaluator.ts
Signals: N/A
Excerpt (<=80 chars): export function createLangsmithEvaluator(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLangsmithEvaluator
```

--------------------------------------------------------------------------------

---[FILE: generator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/pairwise/generator.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CreatePairwiseTargetOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createPairwiseTarget
- CreatePairwiseTargetOptions
```

--------------------------------------------------------------------------------

---[FILE: judge-chain.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/pairwise/judge-chain.ts
Signals: Zod
Excerpt (<=80 chars):  export interface PairwiseEvaluationInput {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PairwiseEvaluationResult
- PairwiseEvaluationInput
```

--------------------------------------------------------------------------------

---[FILE: judge-panel.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/pairwise/judge-panel.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EvalCriteria {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMajorityThreshold
- aggregateJudgeResults
- aggregateGenerations
- EvalCriteria
- JudgePanelResult
- GenerationResult
- MultiGenerationAggregation
- JudgePanelOptions
```

--------------------------------------------------------------------------------

---[FILE: metrics-builder.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/pairwise/metrics-builder.ts
Signals: N/A
Excerpt (<=80 chars): export function buildSingleGenerationResults(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildSingleGenerationResults
- buildMultiGenerationResults
```

--------------------------------------------------------------------------------

---[FILE: runner.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/pairwise/runner.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PairwiseEvaluationOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PairwiseEvaluationOptions
- LocalPairwiseOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/pairwise/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PairwiseDatasetInput {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isPairwiseTargetOutput
- PairwiseDatasetInput
- PairwiseTargetOutput
```

--------------------------------------------------------------------------------

---[FILE: agent-prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/agent-prompt.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateAgentPrompt(workflow: SimpleWorkflow): SingleEvaluat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateAgentPrompt
```

--------------------------------------------------------------------------------

---[FILE: connections.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/connections.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateConnections(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateConnections
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateCredentials(workflow: SimpleWorkflow): SingleEvaluat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateCredentials
```

--------------------------------------------------------------------------------

---[FILE: from-ai.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/from-ai.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateFromAi(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateFromAi
```

--------------------------------------------------------------------------------

---[FILE: nodes.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateNodes(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateNodes
```

--------------------------------------------------------------------------------

---[FILE: tools.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/tools.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateTools(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateTools
```

--------------------------------------------------------------------------------

---[FILE: trigger.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/evaluators/trigger.ts
Signals: N/A
Excerpt (<=80 chars):  export function evaluateTrigger(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluateTrigger
```

--------------------------------------------------------------------------------

---[FILE: compare_workflows.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/src/compare_workflows.py
Signals: N/A
Excerpt (<=80 chars):  def parse_args():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parse_args
- load_workflow
- format_output_json
- _format_parameter_diff
- truncate_value
- format_output_summary
- main
```

--------------------------------------------------------------------------------

---[FILE: config_loader.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/src/config_loader.py
Signals: N/A
Excerpt (<=80 chars):  def _get_param_path_matching_pattern(pattern: str) -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _get_param_path_matching_pattern
- NodeIgnoreRule
- matches
- ParameterComparisonRule
- matches_parameter
- ExemptionRule
- WorkflowComparisonConfig
- should_ignore_node
- should_ignore_parameter
- get_parameter_rule
- get_exemption_penalty
- _matches_path_pattern
- are_node_types_similar
- to_dict
- from_yaml
- from_json
- _from_dict
```

--------------------------------------------------------------------------------

---[FILE: cost_functions.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/src/cost_functions.py
Signals: N/A
Excerpt (<=80 chars):  def normalize_expression(value: Any) -> Any:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- normalize_expression
- normalize_fromAI
- node_substitution_cost
- node_deletion_cost
- node_insertion_cost
- edge_substitution_cost
- edge_deletion_cost
- edge_insertion_cost
- compare_parameters
- compare_lists
- apply_comparison_rule
- calculate_semantic_similarity
- normalize_value
- get_parameter_diff
```

--------------------------------------------------------------------------------

---[FILE: graph_builder.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/src/graph_builder.py
Signals: N/A
Excerpt (<=80 chars):  def build_workflow_graph(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- build_workflow_graph
- _filter_parameters
- _is_trigger_node
- get_node_data
- get_edge_data
- graph_stats
```

--------------------------------------------------------------------------------

---[FILE: similarity.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/src/similarity.py
Signals: N/A
Excerpt (<=80 chars):  def calculate_graph_edit_distance(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculate_graph_edit_distance
- node_subst_cost
- node_del_cost
- node_ins_cost
- edge_match
- _calculate_basic_edit_cost
- _calculate_max_cost
- _extract_operations_from_path
- get_display_name
- _determine_priority
- _relabel_graph_by_structure
- node_sort_key
```

--------------------------------------------------------------------------------

---[FILE: test_graph_builder.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/tests/test_graph_builder.py
Signals: N/A
Excerpt (<=80 chars):  def test_build_simple_workflow_graph():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_build_simple_workflow_graph
- test_build_graph_with_filtering
- test_parameter_filtering
- test_is_trigger_node
- test_graph_stats
- test_empty_workflow
```

--------------------------------------------------------------------------------

---[FILE: test_similarity.py]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/programmatic/python/tests/test_similarity.py
Signals: N/A
Excerpt (<=80 chars):  def test_identical_workflows():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_identical_workflows
- test_empty_workflows
- test_missing_node
- test_trigger_mismatch
- test_parameter_differences
- test_connection_difference
- test_trigger_parameter_update_priority
- test_trigger_deletion_is_critical
- test_trigger_insertion_is_critical
```

--------------------------------------------------------------------------------

---[FILE: categorization-evaluation.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/types/categorization-evaluation.ts
Signals: Zod
Excerpt (<=80 chars): export const categorizationTestCaseSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- categorizationTestCaseSchema
- CategorizationTestCase
- CategorizationTestResult
- TechniqueFrequency
- CategorizationEvaluationSummary
- CategorizationEvaluationOutput
```

--------------------------------------------------------------------------------

---[FILE: evaluation.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/types/evaluation.ts
Signals: Zod
Excerpt (<=80 chars): export const evaluationResultSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- evaluationResultSchema
- testCaseSchema
- evaluationInputSchema
- Violation
- CategoryScore
- EfficiencyScore
- MaintainabilityScore
- BestPracticesScore
- EvaluationResult
- TestCase
- EvaluationInput
```

--------------------------------------------------------------------------------

---[FILE: langsmith.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/types/langsmith.ts
Signals: N/A
Excerpt (<=80 chars): export type UsageMetadata = AIMessageWithUsageMetadata['response_metadata']['...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMessageWithMetadata
- hasUsageMetadata
- isValidPrompt
- isSimpleWorkflow
- isWorkflowStateValues
- safeExtractUsage
- formatViolations
- generateRunId
- extractMessageContent
- UsageMetadata
- WorkflowOutput
- WorkflowStateValues
```

--------------------------------------------------------------------------------

---[FILE: test-result.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/types/test-result.ts
Signals: N/A
Excerpt (<=80 chars):  export type {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CacheStatistics
- MessageCacheStats
- TestResult
```

--------------------------------------------------------------------------------

---[FILE: artifact-saver.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/artifact-saver.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ArtifactSaver {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createArtifactSaver
- ArtifactSaver
```

--------------------------------------------------------------------------------

---[FILE: cache-analyzer.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/cache-analyzer.ts
Signals: N/A
Excerpt (<=80 chars): export function calculateCacheStats(usage: Partial<UsageMetadata>): CacheStat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculateCacheStats
- aggregateCacheStats
- formatCacheStats
```

--------------------------------------------------------------------------------

---[FILE: csv-prompt-loader.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/csv-prompt-loader.ts
Signals: N/A
Excerpt (<=80 chars):  export function loadTestCasesFromCsv(csvPath: string): TestCase[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadTestCasesFromCsv
```

--------------------------------------------------------------------------------

---[FILE: evaluation-calculator.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/evaluation-calculator.ts
Signals: N/A
Excerpt (<=80 chars): export function calculateCategoryAverages(results: TestResult[]): Record<stri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculateCategoryAverages
- countViolationsByType
- calculateTestMetrics
- calculateAverageGenerationTime
- groupResultsByStatus
- calculateProgrammaticAverages
- countProgrammaticViolationsByType
```

--------------------------------------------------------------------------------

---[FILE: evaluation-helpers.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/evaluation-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function formatPercentage(value: number, decimals: number = 1): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatPercentage
- formatElapsedTime
- formatColoredScore
- formatHeader
- formatStatusBadge
- formatViolationType
- formatTestName
- saveEvaluationResults
- getChatPayload
- GetChatPayloadOptions
```

--------------------------------------------------------------------------------

---[FILE: evaluation-reporter.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/evaluation-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export function generateMarkdownReport(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateMarkdownReport
- displayTestResults
- displaySummaryTable
- displayCacheStatistics
- displayViolationsDetail
```

--------------------------------------------------------------------------------

---[FILE: logger.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/logger.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EvalLogger {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLogger
- EvalLogger
```

--------------------------------------------------------------------------------

---[FILE: score.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/evaluations/utils/score.ts
Signals: N/A
Excerpt (<=80 chars):  export function calculateOverallScore(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculateOverallScore
- calcSingleEvaluatorScore
```

--------------------------------------------------------------------------------

---[FILE: ai-workflow-builder-agent.service.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/ai-workflow-builder-agent.service.ts
Signals: N/A
Excerpt (<=80 chars): export class AiWorkflowBuilderService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiWorkflowBuilderService
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const MAX_AI_BUILDER_PROMPT_LENGTH = 5000; // characters

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_AI_BUILDER_PROMPT_LENGTH
- MAX_TOTAL_TOKENS
- MAX_OUTPUT_TOKENS
- MAX_INPUT_TOKENS
- MAX_PARAMETER_VALUE_LENGTH
- DEFAULT_AUTO_COMPACT_THRESHOLD_TOKENS
- MAX_WORKFLOW_LENGTH_TOKENS
- AVG_CHARS_PER_TOKEN_ANTHROPIC
- MAX_NODE_EXAMPLE_CHARS
- MAX_BUILDER_ITERATIONS
- MAX_CONFIGURATOR_ITERATIONS
- MAX_DISCOVERY_ITERATIONS
- MAX_MULTI_AGENT_STREAM_ITERATIONS
- MAX_SINGLE_AGENT_STREAM_ITERATIONS
```

--------------------------------------------------------------------------------

---[FILE: llm-config.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/llm-config.ts
Signals: N/A
Excerpt (<=80 chars):  export const o4mini = async (config: LLMProviderConfig) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- o4mini
- gpt41mini
- gpt41
- anthropicClaudeSonnet45
- anthropicHaiku45
```

--------------------------------------------------------------------------------

---[FILE: multi-agent-workflow-subgraphs.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/multi-agent-workflow-subgraphs.ts
Signals: N/A
Excerpt (<=80 chars):  export interface MultiAgentSubgraphConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMultiAgentWorkflowWithSubgraphs
- MultiAgentSubgraphConfig
```

--------------------------------------------------------------------------------

---[FILE: parent-graph-state.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/parent-graph-state.ts
Signals: N/A
Excerpt (<=80 chars): export const ParentGraphState = Annotation.Root({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParentGraphState
```

--------------------------------------------------------------------------------

---[FILE: session-manager.service.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/session-manager.service.ts
Signals: N/A
Excerpt (<=80 chars): export class SessionManagerService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionManagerService
```

--------------------------------------------------------------------------------

---[FILE: workflow-builder-agent.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/workflow-builder-agent.ts
Signals: N/A
Excerpt (<=80 chars): export type TypedStateSnapshot = Omit<StateSnapshot, 'values'> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldModifyState
- WorkflowBuilderAgent
- TypedStateSnapshot
- WorkflowBuilderAgentConfig
- ExpressionValue
- BuilderFeatureFlags
- ChatPayload
```

--------------------------------------------------------------------------------

---[FILE: workflow-state.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/workflow-state.ts
Signals: N/A
Excerpt (<=80 chars): export function createTrimMessagesReducer(maxUserMessages: number) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTrimMessagesReducer
- WorkflowState
```

--------------------------------------------------------------------------------

---[FILE: responder.agent.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/agents/responder.agent.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ResponderAgentConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResponderAgent
- ResponderAgentConfig
- ResponderContext
```

--------------------------------------------------------------------------------

---[FILE: supervisor.agent.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/agents/supervisor.agent.ts
Signals: Zod
Excerpt (<=80 chars): export const supervisorRoutingSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- supervisorRoutingSchema
- SupervisorAgent
- SupervisorRouting
- SupervisorAgentConfig
- SupervisorContext
```

--------------------------------------------------------------------------------

---[FILE: conversation-compact.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/chains/conversation-compact.ts
Signals: Zod
Excerpt (<=80 chars): import type { BaseChatModel } from '@langchain/core/language_models/chat_mode...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parameter-updater.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/chains/parameter-updater.ts
Signals: Zod
Excerpt (<=80 chars):  export const parametersSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parametersSchema
- createParameterUpdaterChain
```

--------------------------------------------------------------------------------

---[FILE: prompt-categorization.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/chains/prompt-categorization.ts
Signals: Zod
Excerpt (<=80 chars): import type { BaseChatModel } from '@langchain/core/language_models/chat_mode...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflow-name.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/chains/workflow-name.ts
Signals: Zod
Excerpt (<=80 chars): import type { BaseChatModel } from '@langchain/core/language_models/chat_mode...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: test-helpers.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/chains/test/integration/test-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function shouldRunIntegrationTests(): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldRunIntegrationTests
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/errors/index.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeNotFoundError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeNotFoundError
- NodeTypeNotFoundError
- ConnectionError
- LLMServiceError
- ValidationError
- ParameterUpdateError
- ParameterTooLargeError
- WorkflowStateError
- ToolExecutionError
```

--------------------------------------------------------------------------------

---[FILE: legacy-agent.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/legacy-agent.prompt.ts
Signals: N/A
Excerpt (<=80 chars): export interface MainAgentPromptOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMainAgentPrompt
- mainAgentPrompt
- MainAgentPromptOptions
```

--------------------------------------------------------------------------------

---[FILE: builder.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/agents/builder.prompt.ts
Signals: N/A
Excerpt (<=80 chars):  export function buildBuilderPrompt(): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildBuilderPrompt
```

--------------------------------------------------------------------------------

---[FILE: configurator.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/agents/configurator.prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const INSTANCE_URL_PROMPT = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildConfiguratorPrompt
- INSTANCE_URL_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: discovery.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/agents/discovery.prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const exampleCategorizations: Array<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatTechniqueList
- formatExampleCategorizations
- buildDiscoveryPrompt
- DiscoveryPromptOptions
```

--------------------------------------------------------------------------------

---[FILE: responder.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/agents/responder.prompt.ts
Signals: N/A
Excerpt (<=80 chars):  export function buildResponderPrompt(): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildResponderPrompt
```

--------------------------------------------------------------------------------

---[FILE: supervisor.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/agents/supervisor.prompt.ts
Signals: N/A
Excerpt (<=80 chars):  export function buildSupervisorPrompt(): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildSupervisorPrompt
```

--------------------------------------------------------------------------------

---[FILE: prompt-builder.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/builder/prompt-builder.ts
Signals: N/A
Excerpt (<=80 chars): export class PromptBuilder {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- prompt
- PromptBuilder
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/builder/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SectionFormat = 'xml' | 'markdown';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SectionFormat
- ContentOrFactory
- SectionOptions
- PromptBuilderOptions
- SectionEntry
- MessageBlock
```

--------------------------------------------------------------------------------

---[FILE: categorization.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/categorization.prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const examplePrompts = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatExamplePrompts
- formatTechniqueList
- examplePrompts
- promptCategorizationTemplate
```

--------------------------------------------------------------------------------

---[FILE: compact.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/compact.prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const compactPromptTemplate = PromptTemplate.fromTemplate(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- compactPromptTemplate
```

--------------------------------------------------------------------------------

---[FILE: workflow-name.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/workflow-name.prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const workflowNamingPromptTemplate = PromptTemplate.fromTemplate(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workflowNamingPromptTemplate
```

--------------------------------------------------------------------------------

---[FILE: instance-url.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/parameter-updater/instance-url.ts
Signals: N/A
Excerpt (<=80 chars):  export const instanceUrlPrompt = new PromptBuilder()

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- instanceUrlPrompt
```

--------------------------------------------------------------------------------

---[FILE: parameter-updater.prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/parameter-updater/parameter-updater.prompt.ts
Signals: N/A
Excerpt (<=80 chars):  export const CORE_INSTRUCTIONS = `You are an expert n8n workflow architect w...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CORE_INSTRUCTIONS
- EXPRESSION_RULES
- COMMON_PATTERNS
- OUTPUT_FORMAT
```

--------------------------------------------------------------------------------

---[FILE: registry.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/parameter-updater/registry.ts
Signals: N/A
Excerpt (<=80 chars): export function matchesPattern(nodeType: string, pattern: NodeTypePattern): b...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matchesPattern
- getMatchingGuides
- getMatchingExamples
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/parameter-updater/types.ts
Signals: N/A
Excerpt (<=80 chars): export type NodeTypePattern = string;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypePattern
- PromptContext
- NodeTypeGuide
- NodeTypeExamples
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/prompts/chains/parameter-updater/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function hasResourceLocatorParameters(nodeDefinition: INodeTypeDescrip...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasResourceLocatorParameters
```

--------------------------------------------------------------------------------

---[FILE: builder.subgraph.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/subgraphs/builder.subgraph.ts
Signals: N/A
Excerpt (<=80 chars): export const BuilderSubgraphState = Annotation.Root({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BuilderSubgraphState
- BuilderSubgraph
- BuilderSubgraphConfig
```

--------------------------------------------------------------------------------

---[FILE: configurator.subgraph.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/subgraphs/configurator.subgraph.ts
Signals: N/A
Excerpt (<=80 chars): export const ConfiguratorSubgraphState = Annotation.Root({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfiguratorSubgraphState
- ConfiguratorSubgraph
- ConfiguratorSubgraphConfig
```

--------------------------------------------------------------------------------

---[FILE: discovery.subgraph.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/subgraphs/discovery.subgraph.ts
Signals: Zod
Excerpt (<=80 chars): export const DiscoverySubgraphState = Annotation.Root({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiscoverySubgraphState
- DiscoverySubgraph
- DiscoverySubgraphConfig
```

--------------------------------------------------------------------------------

---[FILE: subgraph-interface.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/subgraphs/subgraph-interface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ISubgraph<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISubgraph
```

--------------------------------------------------------------------------------

````
