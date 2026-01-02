---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 95
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 95 of 991)

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

---[FILE: usage-tracking.mdx]---
Location: mlflow-master/docs/docs/community/usage-tracking.mdx

```text
import { Table } from "@site/src/components/Table";

# Usage Tracking

Starting with version **3.2.0**, MLflow collects anonymized usage data by default. This data contains no sensitive or personally identifiable information.

:::important
MLflow does not collect any data that contains personal information, in accordance with GDPR and other privacy regulations.
As a Linux Foundation project, MLflow adheres to the [**LF telemetry data collection and usage policy**](https://lfprojects.org/policies/telemetry-data-policy/).
This implementation has been reviewed and approved by the Linux Foundation, with the approved proposal documented at the [**Completed Reviews**](https://lfprojects.org/policies/telemetry-data-policy/) section
in the official policy. See the [`Data Explanation section`](#data-explanation) below for details on what is collected.
:::

:::note
Telemetry is only enabled in **Open Source MLflow**. If you're using MLflow through a managed service or distribution,
please consult your vendor to determine whether telemetry is enabled in your environment.
In all cases, you can choose to opt out by following the guidance provided in our documentation.
:::

## Why is data being collected?

MLflow uses anonymous telemetry to understand feature usage, which helps guide development priorities and improve the library.
This data helps us identify which features are most valuable and where to focus on bug fixes or enhancements.

### GDPR Compliance

Under the General Data Protection Regulation (GDPR), data controllers and processors are responsible for handling personal data with care, transparency, and accountability.

MLflow complies with GDPR in the following ways:

- **No Personal Data Collected**: The telemetry data collected is fully anonymized and does not include any personal or sensitive information (e.g., usernames, IP addresses, file names, parameters, or model content). MLflow generates a random UUID for each session for aggregating usage events, which cannot be used to identify or track individual users.
- **Purpose Limitation**: Data is only used to improve the MLflow project based on aggregate feature usage patterns.
- **Data Minimization**: Only the minimum necessary metadata is collected to inform project priorities (e.g., feature toggle state, SDK/platform used, version info).
- **User Control**: Users can opt out of telemetry at any time by setting the environment variable **MLFLOW_DISABLE_TELEMETRY=true** or **DO_NOT_TRACK=true**. MLflow respects these settings immediately without requiring a restart.
- **Transparency**: Telemetry endpoints and behavior are documented publicly, and MLflow users can inspect or block the relevant network calls.

For further inquiries or data protection questions, users can file an issue on the [MLflow GitHub repository](https://github.com/mlflow/mlflow/issues).

## What data is collected?

MLflow collects only non-sensitive, anonymized data to help us better understand usage patterns.
The below section outlines the data currently collected in this version of MLflow. You can view the exact data collected [in the source code](https://github.com/mlflow/mlflow/blob/c71fd0d677c1806ba2d5928398435c4de2c25c0e/mlflow/telemetry/schemas.py).

### Data Explanation

<Table>
  <thead>
    <tr>
      <th>Data Element</th>
      <th>Explanation</th>
      <th>Example</th>
      <th>Why we track this</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Unique session ID</td>
      <td>A randomly generated, non-personally identifiable UUID is created for each session—defined as each time MLflow is imported</td>
      <td>45e2751243e84c7e87aca6ac25d75a0d</td>
      <td>As an identifier for the data in current MLflow session</td>
    </tr>
    <tr>
      <td>Unique installation ID</td>
      <td>A randomly generated, non-personally identifiable UUID is created for each installation—defined as each time MLflow is imported. Added in MLflow 3.7.0.</td>
      <td>45e2751243e84c7e87aca6ac25d75a0d</td>
      <td>As an identifier for the data in current MLflow installation</td>
    </tr>
    <tr>
      <td>Source SDK</td>
      <td>The current used SDK name</td>
      <td>mlflow | mlflow-skinny | mlflow-tracing</td>
      <td>To understand adoption of different MLflow SDKs and identify enhancement areas</td>
    </tr>
    <tr>
      <td>MLflow version</td>
      <td>The current SDK version</td>
      <td>3.2.0</td>
      <td>To identify version-specific usage patterns and support, bug fixes, or deprecation decisions</td>
    </tr>
    <tr>
      <td>Python version</td>
      <td>The current python version</td>
      <td>3.10.16</td>
      <td>To ensure compatibility across Python versions and guide testing or upgrade recommendations</td>
    </tr>
    <tr>
      <td>Operating System</td>
      <td>The operating system on which MLflow is running</td>
      <td>macOS-15.4.1-arm64-arm-64bit</td>
      <td>To understand platform-specific usage and detect platform-dependent issues</td>
    </tr>
    <tr>
      <td>Tracking URI Scheme</td>
      <td>The scheme of the current tracking URI</td>
      <td>file | sqlite | mysql | postgresql | mssql | https | http | custom_scheme | None</td>
      <td>To determine which tracking backends are most commonly used and optimize backend support</td>
    </tr>
    <tr>
      <td>Event Name</td>
      <td>The tracked event name (see [below table](#tracked-events) for what events are tracked)</td>
      <td>create_experiment</td>
      <td>To measure feature usage and improvements</td>
    </tr>
    <tr>
      <td>Event Status</td>
      <td>Whether the event succeeds or not</td>
      <td>success | failure | unknown</td>
      <td>To identify common failure points and improve reliability and error handling</td>
    </tr>
    <tr>
      <td>Timestamp (nanoseconds)</td>
      <td>Time when the event occurred</td>
      <td>1753760188623715000</td>
      <td>As an identifier for the event</td>
    </tr>
    <tr>
      <td>Duration</td>
      <td>The time the event call takes, in milliseconds</td>
      <td>1000</td>
      <td>To monitor performance trends and detect regressions in response time</td>
    </tr>
    <tr>
      <td>Parameters (boolean or enumerated values)</td>
      <td>See [below table](#tracked-events) for collected parameters for each event</td>
      <td>create_logged_model event: `{"flavor": "langchain"}`</td>
      <td>To better understand the usage pattern for each event</td>
    </tr>
  </tbody>
</Table>

#### Tracked Events

**No details about the specific model, code, or weights are collected.** Only the parameters listed under the `Tracked Parameters` column are recorded alongside the event;
For events with None in the `Tracked Parameters` column, only the event name is recorded. If "MLFLOW_EXPERIMENT_ID" environment variable exists, it is tracked as a param.

<Table>
  <thead>
    <tr>
      <th style={{ width: "20%" }}>Event Name</th>
      <th style={{ width: "40%" }}>Tracked Parameters</th>
      <th style={{ width: "40%" }}>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>create_experiment</td>
      <td>Created Experiment ID (random uuid or integer)</td>
      <td>`{"experiment_id": "0"}`</td>
    </tr>
    <tr>
      <td>create_run</td>
      <td>Imported packages among [MODULES_TO_CHECK_IMPORT](https://github.com/mlflow/mlflow/blob/c71fd0d677c1806ba2d5928398435c4de2c25c0e/mlflow/telemetry/constant.py#L19) are imported or not; experiment ID used when creating the run</td>
      <td>`{"imports": ["sklearn"], "experiment_id": "0"}`</td>
    </tr>
    <tr>
      <td>create_logged_model</td>
      <td>Flavor of the model (e.g. langchain, sklearn)</td>
      <td>`{"flavor": "langchain"}`</td>
    </tr>
    <tr>
      <td>get_logged_model</td>
      <td>Imported packages among [MODULES_TO_CHECK_IMPORT](https://github.com/mlflow/mlflow/blob/c71fd0d677c1806ba2d5928398435c4de2c25c0e/mlflow/telemetry/constant.py#L19) are imported or not</td>
      <td>`{"imports": ["sklearn"]}`</td>
    </tr>
    <tr>
      <td>create_registered_model</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <td>create_model_version</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <td>create_prompt</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <td>load_prompt</td>
      <td>Whether alias is used</td>
      <td>`{"uses_alias": True}`</td>
    </tr>
    <tr>
      <td>start_trace</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <td>traces_received_by_server</td>
      <td>Type of client (sanitized) that submitted the traces and number of completed traces received</td>
      <td>`{"source": "MLFLOW_PYTHON_CLIENT", "count": 3}`</td>
    </tr>
    <tr>
      <td>log_assessment</td>
      <td>Type of the assessment and source</td>
      <td>`{"type": "feedback", "source_type": "CODE"}`</td>
    </tr>
    <tr>
      <td>evaluate</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <td>create_webhook</td>
      <td>Entities of the webhook</td>
      <td>`{"events": ["model_version.created"]}`</td>
    </tr>
    <tr>
      <td>genai_evaluate</td>
      <td>Builtin scorers used during GenAI Evaluate</td>
      <td>`{"builtin_scorers": ["relevance_to_query"]}`</td>
    </tr>
    <tr>
      <td>prompt_optimization</td>
      <td>Optimizer type, number of prompts, and number of scorers</td>
      <td>`{"optimizer_type": True, "prompt_count": 5, "scorer_count": 1}`</td>
    </tr>
    <tr>
      <td>log_dataset</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <td>log_metric</td>
      <td>Whether synchronous mode is on or not</td>
      <td>`{"synchronous": False}`</td>
    </tr>
    <tr>
      <td>log_param</td>
      <td>Whether synchronous mode is on or not</td>
      <td>`{"synchronous": True}`</td>
    </tr>
    <tr>
      <td>log_batch</td>
      <td>Information on whether metrics, parameters, or tags are logged, and the logging mode</td>
      <td>`{"metrics": False, "params": True, "tags": False, "synchronous": False}`</td>
    </tr>
    <tr>
      <td>invoke_custom_judge_model</td>
      <td>Judge model provider</td>
      <td>`{"model_provider": "databricks"}`</td>
    </tr>
    <tr>
      <td>make_judge</td>
      <td>Model provider (extracted from model string if format is provider:model)</td>
      <td>`{"model_provider": "openai"}`</td>
    </tr>
    <tr>
      <td>align_judge</td>
      <td>Number of traces provided and optimizer type</td>
      <td>`{"trace_count": 100, "optimizer_type": "AlignmentOptimizer"}`</td>
    </tr>
    <tr>
      <td>autologging</td>
      <td>Flavor and metadata</td>
      <td>`{"flavor": "openai", "log_traces": True, "disable": False}`</td>
    </tr>
    <tr>
      <td>ai_command_run</td>
      <td>Command key and invocation context (cli or mcp)</td>
      <td>`{"command_key": "genai/analyze_experiment", "context": "cli"}`</td>
    </tr>
    <tr>
      <td>ui_event</td>
      <td>A UI interaction event. See the [below table](#ui-interaction-metadata) for a description of the various metadata elements</td>
      <td>`{ "eventType": "onClick", "componentViewId": "88fc9edd-5e9e-4a17-abd2-c543f505b8eb", "componentId": "mlflow.prompts.list.create", "componentType": "button", timestamp_ns: 1765784028467000000 }`</td>
    </tr>
  </tbody>
</Table>

#### UI Interaction Metadata

This table describes a list of metadata that may be collected together with a given UI interaction log.

<Table>
  <thead>
    <tr>
      <th style={{ width: "20%" }}>Metadata Element</th>
      <th style={{ width: "40%" }}>Explanation</th>
      <th style={{ width: "40%" }}>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Component ID of interactive UI elements</td>
      <td>An ID string of an interactive element (e.g. button, switch, link, input field) in the UI. A log is generated upon clicking, typing, or otherwise interacting with such elements. A comprehensive list of component ID values can be found by [this search query](https://github.com/search?q=repo%3Amlflow%2Fmlflow%20componentId%3D&type=code).</td>
      <td>`mlflow.prompts.list.create` (identifier for the "Create prompt" button on the prompts page)</td>
    </tr>
    <tr>
      <td>Event type</td>
      <td>An enumerated categorical value describing the nature of the interaction</td>
      <td>`onView`, `onClick`, `onValueChange`</td>
    </tr>
    <tr>
      <td>Component type</td>
      <td>An enumerated categorical value describing the type of component that the interaction happened with</td>
      <td>`button`, `alert`, `banner`, `radio`, `input`, ...</td>
    </tr>
    <tr>
      <td>Component View ID</td>
      <td>A randomly generated UUID that is regenerated whenever the UI element rerenders</td>
      <td>`774db636-5cfa-4ce8-8f56-7e7126dc3439`</td>
    </tr>
    <tr>
      <td>Timestamp</td>
      <td>The client-side timestamp of when the interaction occurred</td>
      <td>`1765789548484000`.</td>
    </tr>
  </tbody>
</Table>

## Why is MLflow Telemetry Opt-Out?

MLflow uses an opt-out telemetry model to help improve the platform for all users based on real-world usage patterns.
Collecting anonymous usage data by default allows us to:

- Understand how MLflow is being used across a wide range of environments and workflows
- Identify common pain points and identify feature improvements area more effectively
- Measure the impact of changes and ensure they improve the experience for the broader community

If telemetry were opt-in, only a small, self-selected subset of users would be represented, leading to biased insights and potentially misaligned priorities.
We are committed to transparency and user choice. Telemetry is clearly documented, anonymized, and can be easily disabled at any time through configuration.
This approach helps us make MLflow better for everyone, while giving you full control. Check [`what we are doing with this data`](#what-are-we-doing-with-this-data) section for more information.

## How to opt-out?

MLflow supports opt-out telemetry through either of the following environment variables:

- **MLFLOW_DISABLE_TELEMETRY=true**
- **DO_NOT_TRACK=true**

Setting either of these will **immediately disable telemetry**, no need to re-import MLflow or restart your session.

:::note
MLflow automatically disables telemetry in [**some CI environments**](https://github.com/mlflow/mlflow/blob/de6c11193ce6a68ffec4b33650f75bd163143178/mlflow/telemetry/utils.py#L22).
If you'd like support for additional CI environments, please [open an issue on our GitHub repository](https://github.com/mlflow/mlflow/issues).

- CI
- Github Actions
- CircleCI
- GitLab CI/CD
- Jenkins Pipeline
- Travis CI
- Azure Pipelines
- BitBucket
- AWS CodeBuild
- BuildKite
- ...
  :::

### Scope of the setting

- The environment variable only takes effect in processes where it is explicitly set or inherited.
- If you spawn subprocesses from a clean environment, those subprocesses may not inherit your shell's environment, and telemetry could remain enabled. e.g. `subprocess.run([...], env={})`
- Setting this environment variable before running `mlflow server` also disables all UI telemetry

Recommendations to ensure telemetry is consistently disabled across all environments:

- Add the variable to your shell startup file (~/.bashrc, ~/.zshrc, etc.): `export MLFLOW_DISABLE_TELEMETRY=true`
- If you're using subprocesses or isolated environments, use a dotenv manager or explicitly pass the variable when launching.

### How to validate telemetry is disabled?

Use the following code to validate telemetry is disabled.

```python
from mlflow.telemetry import get_telemetry_client

assert get_telemetry_client() is None, "Telemetry is enabled"
```

### How to opt-out for your organization?

Aside from setting the environment variables described above, organizations can additionally opt out of telemetry by blocking network access to the `mlflow-telemetry.io` domain. When this domain is unreachable, telemetry will be disabled.

### Opting out of UI telemetry

As described above, the admin of an MLflow server can set the `MLFLOW_DISABLE_TELEMETRY` or `DO_NOT_TRACK`
environment variables to disable UI telemetry globally for the server. However, if you are not
an admin (i.e. you have no ability to set environment variables), you can still personally opt
out from UI telemetry by visiting the "Settings" page in the MLflow UI (introduced in MLflow 3.8.0).

Setting the toggle to "Off" will disable UI telemetry from your device, even if the admin has not
opted out server-side.

## What are we doing with this data?

We aggregate anonymized usage data and plan to share insights with the community through public dashboards. You'll be able to see how MLflow features are used and help improve them by contributing.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/index.mdx

```text
import useBaseUrl from '@docusaurus/useBaseUrl';
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import SearchBox from '@site/src/components/SearchBox';
import Platform from "@site/src/content/platform.mdx"
import { CardGroup, TitleCard } from "@site/src/components/Card";
import { Heart, Zap, Puzzle, LifeBuoy, Binoculars, Activity } from "lucide-react";

# MLflow GenAI: Ship High-quality GenAI, Fast

MLflow GenAI is an open-source, all-in-one integrated platform that helps enhance your Agent & GenAI applications with end-to-end observability, evaluations, AI gateway, prompt management & optimization and tracking.

<FeatureHighlights features={[
  {
    icon: Heart,
    title: "Open Source",
    description: "Join thousands of teams building GenAI with MLflow - with 20K+ GitHub Stars and 50M+ monthly downloads. As part of the Linux Foundation, MLflow ensures your AI infrastructure remains open and vendor-neutral."
  },
  {
    icon: Zap,
    title: "OpenTelemetry",
    description: "MLflow Tracing is fully compatible with OpenTelemetry, making it free from vendor lock-in and easy to integrate with your existing observability stack."
  },
  {
    icon: LifeBuoy,
    title: "All-in-one Platform",
    description: "Manage the complete GenAI journey from experimentation to production. Track prompts, evaluate quality, deploy models, and monitor performance in one platform."
  },
  {
    icon: Binoculars,
    title: "Complete Observability",
    description: "See inside every AI decision with comprehensive tracing that captures prompts, retrievals, tool calls, and model responses. Debug complex workflows with confidence."
  },
  {
    icon: Activity,
    title: "Evaluation & Monitoring",
    description: "Stop manual testing with LLM judges and custom metrics. Systematically evaluate every change to ensure consistent improvements in your AI applications."
  },
  {
    icon: Puzzle,
    title: "Framework Integration",
    description: "Use any GenAI framework or model provider. With 30+ integrations and extensible APIs, MLflow adapts to your tech stack, not the other way around."
  }
]} />

## Observability

Debug and iterate on GenAI applications using MLflow's tracing, which captures your app's entire execution, including prompts, retrievals and tool calls.
MLflow's open-source, OpenTelemetry-compatible tracing SDK helps avoid vendor lock-in.

<video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop muted aria-label="MLflow Tracing" poster={useBaseUrl("/images/llms/tracing/tracing-top-poster.png")} />

<CardGroup cols={1}>
    <TitleCard title="Observability Quickstart →" link="/genai/tracing/quickstart">
    This quickstart will guide you through enabling tracing in your GenAI application and sending your first trace to MLflow.
    </TitleCard>
</CardGroup>

## Evaluations

Accurately measure free-form language with LLM judges by utilizing LLM-as-a-judge metrics, mimicking human expertise, to assess and enhance GenAI quality. Access pre-built judges for common metrics like hallucination or relevance, or develop custom judges tailored to your business needs and expert insights.

<video src={useBaseUrl("/images/mlflow-3/eval-monitor/evaluation-result-video.mp4")} controls loop muted aria-label="MLflow Evaluation" poster={useBaseUrl("/images/mlflow-3/eval-monitor/evaluation-result-video-poster.png")} />

<CardGroup cols={1}>
    <TitleCard title="Evaluations Quickstart →" link="/genai/eval-monitor/quickstart">
    This quickstart will walk you through preparing a dataset, configuring a scorer, and running your first evaluation in just a few steps.
    </TitleCard>
</CardGroup>

## Prompt Management & Optimization

Version, compare, iterate on, and discover prompt templates directly through the MLflow UI. Reuse prompts across multiple versions of your agent or application code, and view rich lineage identifying which versions are using each prompt.

<video src={useBaseUrl("/images/llms/prompt-registry/prompt-management.mp4")} controls loop muted aria-label="MLflow Prompt Management" poster={useBaseUrl("/images/llms/prompt-registry/prompt-management-poster.png")} />

<CardGroup cols={1}>
    <TitleCard title="Prompt Management Quickstart →" link="/genai/prompt-registry/create-and-edit-prompts">
    This quickstart will guide you through creating, editing and versioning prompts for your GenAI application.
    </TitleCard>
</CardGroup>

---

## Running Anywhere

<Platform />

## Ask AI About MLflow

<SearchBox placeholder="What do you want to know about MLflow?" />

## Community

Connect with fellow builders, ask questions, and stay up to date — join our vibrant MLflow community on Slack, GitHub, LinkedIn, and more!

Learn how to get involved and discover all our channels on the [Community Page](/community).
```

--------------------------------------------------------------------------------

---[FILE: expectations.mdx]---
Location: mlflow-master/docs/docs/genai/assessments/expectations.mdx

```text
---
sidebar_label: Ground Truth Expectations
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import WorkflowSteps from "@site/src/components/WorkflowSteps";
import CollapsibleSection from "@site/src/components/CollapsibleSection";
import TabsWrapper from "@site/src/components/TabsWrapper";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { Target, Zap, Database, Shield, Settings, TrendingUp, Users, MessageSquare, Book, MousePointer, ListCheck, Type, FileInput, Plus, BarChart3 } from "lucide-react";
import AddExpectationImageUrl from '@site/static/images/assessments/add_expectation_ui.png';

# Ground Truth Expectations

MLflow Expectations provide a systematic way to capture ground truth - the correct or desired outputs that your AI should produce. By establishing these reference points, you create the foundation for meaningful evaluation and continuous improvement of your GenAI applications.

For complete API documentation and implementation details, see the <APILink fn="mlflow.log_expectation" /> reference.

## What are Expectations?

[Expectations](/genai/concepts/expectations) define the "gold standard" for what your AI should produce given specific inputs. They represent the correct answer, desired behavior, or ideal output as determined by domain experts. Think of expectations as the answer key against which actual AI performance is measured.

Unlike [feedback](/genai/assessments/feedback) that evaluates what happened, expectations establish what should happen. They're always created by humans who have the expertise to define correct outcomes.

## Prerequisites

Before using the <APILink fn="mlflow.log_expectation">Expectations API</APILink>, ensure you have:

- MLflow 3.2.0 or later installed
- An active MLflow tracking server or local tracking setup
- Traces that have been logged from your GenAI application to an MLflow Experiment

## Why Annotate Ground Truth?

<FeatureHighlights features={[
  {
    icon: Target,
    title: "Create Evaluation Baselines",
    description: "Establish reference points for objective accuracy measurement. Without ground truth, you can't measure how well your AI performs against known correct answers."
  },
  {
    icon: Zap,
    title: "Enable Systematic Testing",
    description: "Transform ad-hoc testing into systematic evaluation by building datasets of expected outputs to consistently measure performance across versions and configurations."
  },
  {
    icon: Database,
    title: "Support Fine-Tuning and Training",
    description: "Create high-quality training data from ground truth annotations. Essential for fine-tuning models and training automated evaluators."
  },
  {
    icon: Shield,
    title: "Establish Quality Standards",
    description: "Codify quality requirements and transform implicit knowledge into explicit, measurable criteria that everyone can understand and follow."
  }
]} />

## Types of Expectations

<TabsWrapper>
  <Tabs>
    <TabItem value="factual" label="Factual" default>

### Factual Expectations

For questions with definitive answers:

```python
mlflow.log_expectation(
    trace_id=trace_id,
    name="expected_answer",
    value="The speed of light in vacuum is 299,792,458 meters per second",
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN,
        source_id="physics_expert@university.edu",
    ),
)
```

    </TabItem>
    <TabItem value="structured" label="Structured">

### Structured Expectations

For complex outputs with multiple components:

```python
mlflow.log_expectation(
    trace_id=trace_id,
    name="expected_extraction",
    value={
        "company": "TechCorp Inc.",
        "sentiment": "positive",
        "key_topics": ["product_launch", "quarterly_earnings", "market_expansion"],
        "action_required": True,
    },
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN, source_id="business_analyst@company.com"
    ),
)
```

    </TabItem>
    <TabItem value="behavioral" label="Behavioral">

### Behavioral Expectations

For defining how the AI should act:

```python
mlflow.log_expectation(
    trace_id=trace_id,
    name="expected_behavior",
    value={
        "should_escalate": True,
        "required_elements": ["empathy", "solution_offer", "follow_up"],
        "max_response_length": 150,
        "tone": "professional_friendly",
    },
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN,
        source_id="customer_success_lead@company.com",
    ),
)
```

    </TabItem>
    <TabItem value="span_level" label="Span-Level">

### Span-Level Expectations

For specific operations within your AI pipeline:

```python
# Expected documents for RAG retrieval
mlflow.log_expectation(
    trace_id=trace_id,
    span_id=retrieval_span_id,
    name="expected_documents",
    value=["policy_doc_2024", "faq_section_3", "user_guide_ch5"],
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN,
        source_id="information_architect@company.com",
    ),
)
```

    </TabItem>

  </Tabs>
</TabsWrapper>

## Step-by-Step Guides

### Add Ground Truth Annotation via UI

The MLflow UI provides an intuitive way to add expectations directly to traces. This approach is ideal for domain experts who need to define ground truth without writing code, and for collaborative annotation workflows where multiple stakeholders contribute different perspectives.

<CollapsibleSection
  title="Show Step-by-Step Instructions (8 steps)"
  defaultExpanded={false}
>
  <WorkflowSteps
    steps={[
      {
        icon: MousePointer,
        title: "Navigate to your experiment",
        description: "Select the trace containing the interaction you want to annotate"
      },
      {
        icon: Plus,
        title: "Click \"Add Assessment\" button",
        description: "Access the assessment creation form on the trace detail page"
      },
      {
        icon: ListCheck,
        title: "Select \"Expectation\" from dropdown",
        description: "Choose Assessment Type to define ground truth rather than feedback"
      },
      {
        icon: Type,
        title: "Enter a descriptive name",
        description: "Use clear names like \"expected_answer\", \"correct_classification\", or \"expected_documents\""
      },
      {
        icon: Settings,
        title: "Choose the appropriate data type",
        description: "Select String for text, JSON for structured data, Boolean for binary expectations"
      },
      {
        icon: FileInput,
        title: "Enter the ground truth value",
        description: "Define what the AI should have produced for this specific input"
      },
      {
        icon: MessageSquare,
        title: "Add rationale explaining correctness",
        description: "Document why this is the correct or expected output for future reference"
      },
      {
        icon: Target,
        title: "Click \"Create\" to record expectation",
        description: "Save your ground truth annotation to establish the quality baseline"
      }
    ]}
    screenshot={{
      src: AddExpectationImageUrl,
      alt: "Add Expectation"
    }}
  />
</CollapsibleSection>

The expectation will be immediately attached to the trace, establishing the ground truth reference for future evaluation.

### Log Ground Truth via API

Use the programmatic <APILink fn="mlflow.log_expectation" /> API when you need to automate expectation creation, integrate with existing annotation tools, or build custom ground truth collection workflows.

<Tabs>
  <TabItem value="single" label="Single Annotations" default>

Programmatically create expectations for systematic ground truth collection:

**1. Set up your annotation environment:**

```python
import mlflow
from mlflow.entities import AssessmentSource
from mlflow.entities.assessment_source import AssessmentSourceType

# Define your domain expert source
expert_source = AssessmentSource(
    source_type=AssessmentSourceType.HUMAN, source_id="domain_expert@company.com"
)
```

**2. Create expectations for different data types:**

```python
def log_factual_expectation(trace_id, question, correct_answer):
    """Log expectation for factual questions."""
    mlflow.log_expectation(
        trace_id=trace_id,
        name="expected_factual_answer",
        value=correct_answer,
        source=expert_source,
        metadata={
            "question": question,
            "expectation_type": "factual",
            "confidence": "high",
            "verified_by": "subject_matter_expert",
        },
    )


def log_structured_expectation(trace_id, expected_extraction):
    """Log expectation for structured data extraction."""
    mlflow.log_expectation(
        trace_id=trace_id,
        name="expected_extraction",
        value=expected_extraction,
        source=expert_source,
        metadata={
            "expectation_type": "structured",
            "schema_version": "v1.0",
            "annotation_guidelines": "company_extraction_standards_v2",
        },
    )


def log_behavioral_expectation(trace_id, expected_behavior):
    """Log expectation for AI behavior patterns."""
    mlflow.log_expectation(
        trace_id=trace_id,
        name="expected_behavior",
        value=expected_behavior,
        source=expert_source,
        metadata={
            "expectation_type": "behavioral",
            "behavior_category": "customer_service",
            "compliance_requirement": "company_policy_v3",
        },
    )
```

**3. Use the functions in your annotation workflow:**

```python
# Example: Annotating a customer service interaction
trace_id = "tr-customer-service-001"

# Define what the AI should have said
factual_answer = "Your account balance is $1,234.56 as of today."
log_factual_expectation(trace_id, "What is my account balance?", factual_answer)

# Define expected data extraction
expected_extraction = {
    "intent": "account_balance_inquiry",
    "account_type": "checking",
    "urgency": "low",
    "requires_authentication": True,
}
log_structured_expectation(trace_id, expected_extraction)

# Define expected behavior
expected_behavior = {
    "should_verify_identity": True,
    "tone": "professional_helpful",
    "should_offer_additional_help": True,
    "escalation_required": False,
}
log_behavioral_expectation(trace_id, expected_behavior)
```

  </TabItem>
  <TabItem value="batch" label="Batch Annotations">

For large-scale ground truth collection, use batch annotation:

**1. Define the batch annotation function:**

```python
def annotate_batch_expectations(annotation_data):
    """Annotate multiple traces with ground truth expectations."""
    for item in annotation_data:
        try:
            mlflow.log_expectation(
                trace_id=item["trace_id"],
                name=item["expectation_name"],
                value=item["expected_value"],
                source=AssessmentSource(
                    source_type=AssessmentSourceType.HUMAN,
                    source_id=item["annotator_id"],
                ),
                metadata={
                    "batch_id": item["batch_id"],
                    "annotation_session": item["session_id"],
                    "quality_checked": True,
                },
            )
            print(f"✓ Annotated {item['trace_id']}")
        except Exception as e:
            print(f"✗ Failed to annotate {item['trace_id']}: {e}")
```

**2. Prepare your annotation data:**

```python
# Example batch annotation data
batch_data = [
    {
        "trace_id": "tr-001",
        "expectation_name": "expected_answer",
        "expected_value": "Paris is the capital of France",
        "annotator_id": "expert1@company.com",
        "batch_id": "geography_qa_batch_1",
        "session_id": "session_2024_01_15",
    },
    {
        "trace_id": "tr-002",
        "expectation_name": "expected_answer",
        "expected_value": "The speed of light is 299,792,458 m/s",
        "annotator_id": "expert2@company.com",
        "batch_id": "physics_qa_batch_1",
        "session_id": "session_2024_01_15",
    },
]
```

**3. Execute batch annotation:**

```python
annotate_batch_expectations(batch_data)
```

  </TabItem>
</Tabs>

## Expectation Annotation Workflows

Different stages of your AI development lifecycle require different approaches to expectation annotation. The following workflows help you systematically create and maintain ground truth expectations that align with your development process and quality goals.

<ConceptOverview concepts={[
  {
    icon: Settings,
    title: "Development Phase",
    description: "Define success criteria by identifying test scenarios, creating expectations with domain experts, testing AI outputs, and iterating on configurations until expectations are met."
  },
  {
    icon: TrendingUp,
    title: "Production Monitoring",
    description: "Enable systematic quality tracking by sampling production traces, adding expectations to create evaluation datasets, and tracking performance trends over time."
  },
  {
    icon: Users,
    title: "Collaborative Annotation",
    description: "Use team-based annotation where domain experts define initial expectations, review committees validate and refine, and consensus building resolves disagreements."
  }
]} />

## Best Practices

### Be Specific and Measurable

Vague expectations lead to inconsistent evaluation. Define clear, specific criteria that can be objectively verified.

### Document Your Reasoning

Use metadata to explain why an expectation is defined a certain way:

```python
mlflow.log_expectation(
    trace_id=trace_id,
    name="expected_diagnosis",
    value={
        "primary": "Type 2 Diabetes",
        "risk_factors": ["obesity", "family_history"],
        "recommended_tests": ["HbA1c", "fasting_glucose"],
    },
    metadata={
        "guideline_version": "ADA_2024",
        "confidence": "high",
        "based_on": "clinical_presentation_and_history",
    },
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN, source_id="endocrinologist@hospital.org"
    ),
)
```

### Maintain Consistency

Use standardized naming and structure across your expectations to enable meaningful analysis and comparison.

## Managing Expectations

Once you've defined expectations for your traces, you may need to retrieve, update, or delete them to maintain accurate ground truth data.

### Retrieving Expectations

Retrieve specific expectations to analyze your ground truth data:

```python
# Get a specific expectation by ID
expectation = mlflow.get_assessment(
    trace_id="tr-1234567890abcdef", assessment_id="a-0987654321abcdef"
)

# Access expectation details
name = expectation.name
value = expectation.value
source_type = expectation.source.source_type
metadata = expectation.metadata if hasattr(expectation, "metadata") else None
```

### Updating Expectations

Update existing expectations when ground truth needs refinement:

```python
from mlflow.entities import Expectation

# Update expectation with corrected information
updated_expectation = Expectation(
    name="expected_answer",
    value="The capital of France is Paris, located in the Île-de-France region",
)

mlflow.update_assessment(
    trace_id="tr-1234567890abcdef",
    assessment_id="a-0987654321abcdef",
    assessment=updated_expectation,
)
```

### Deleting Expectations

Remove expectations that were logged incorrectly:

```python
# Delete specific expectation
mlflow.delete_assessment(
    trace_id="tr-1234567890abcdef", assessment_id="a-5555666677778888"
)
```

## Integration with Evaluation

Expectations are most powerful when combined with systematic evaluation:

1. **Automated scoring** against expectations
2. **Human feedback** on expectation achievement
3. **Gap analysis** between expected and actual
4. **Performance metrics** based on expectation matching

## Next Steps

<TilesGrid>
  <TileCard
    icon={Book}
    iconSize={48}
    title="Expectations Concepts"
    description="Deep dive into expectations architecture and schema"
    href="/genai/concepts/expectations"
    linkText="Learn more →"
    containerHeight={64}
  />
  <TileCard
    icon={MessageSquare}
    iconSize={48}
    title="Automated and Human Feedback"
    description="Learn how to collect quality evaluations from multiple sources"
    href="/genai/assessments/feedback"
    linkText="Start collecting →"
    containerHeight={64}
  />
  <TileCard
    icon={BarChart3}
    iconSize={48}
    title="LLM Evaluation"
    description="Learn how to systematically evaluate and improve your GenAI applications"
    href="/genai/eval-monitor"
    linkText="Start evaluating →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
