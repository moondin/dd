---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 79
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 79 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: introduction.mdx]---
Location: prowler-master/docs/developer-guide/introduction.mdx

```text
---
title: 'Introduction to developing in Prowler'
---

Thanks for your interest in contributing to Prowler!

Prowler can be extended in various ways. This guide provides the different ways to contribute and how to get started.

## Contributing to Prowler

### Review Current Issues
Check out our [GitHub Issues](https://github.com/prowler-cloud/prowler/issues) page for ideas to contribute.
<Columns cols={2}>
  <Card title="Good First Issue" icon="github" href="https://github.com/prowler-cloud/prowler/issues?q=sort%3Aupdated-desc%20is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22">
    We tag issues as `good first issue` for new contributors. These are typically well-defined and manageable in scope.
  </Card>
  <Card title="Help Wanted" icon="github" href="https://github.com/prowler-cloud/prowler/issues?q=sort%3Aupdated-desc%20is%3Aissue%20is%3Aopen%20label%3A%22help%20wanted%22">
    We tag issues as `help wanted` for other issues that require more time to complete.
  </Card>
</Columns>

### Expand Prowler's Capabilities
Prowler is constantly evolving. Contributions to checks, services, or integrations help improve the tool for everyone. Here is how to get involved:

<Columns cols={2}>
  <Card title="Adding New Checks" icon="shield" href="/developer-guide/checks">
    Want to improve Prowler's detection capabilities for your favorite cloud provider? You can contribute by writing new checks.
  </Card>
  <Card title="Adding New Services" icon="server" href="/developer-guide/services">
    One key service for your favorite cloud provider is missing? Add it to Prowler! Do not forget to include relevant checks to validate functionality.
  </Card>
  <Card title="Adding New Providers" icon="cloud" href="/developer-guide/provider">
    If you would like to extend Prowler to work with a new cloud provider, this typically involves setting up new services and checks to ensure compatibility.
  </Card>
  <Card title="Adding New Output Formats" icon="file" href="/developer-guide/outputs">
    Want to tailor how results are displayed or exported? You can add custom output formats.
  </Card>
  <Card title="Adding New Integrations" icon="link" href="/developer-guide/integrations">
    Prowler can work with other tools and platforms through integrations.
  </Card>
  <Card title="Proposing or Implementing Features" icon="lightbulb" href="https://github.com/prowler-cloud/prowler/issues/new?template=feature-request.yml">
    Propose brand-new features or enhancements to existing ones, or help implement community-requested improvements.
  </Card>
</Columns>

### Improve Documentation
Help make Prowler more accessible by enhancing our documentation, fixing typos, or adding examples/tutorials.

<Columns cols={2}>
  <Card title="Documentation Guide" icon="book" href="/developer-guide/documentation">
    Enhance our documentation, fix typos, or add examples/tutorials.
  </Card>
</Columns>

### Bug Fixes
If you find any issues or bugs, you can report them in the [GitHub Issues](https://github.com/prowler-cloud/prowler/issues) page and if you want you can also fix them.

<Columns cols={2}>
  <Card title="Report a Bug" icon="bug" href="https://github.com/prowler-cloud/prowler/issues/new?template=bug_report.yml">
    Report or fix issues or bugs.
  </Card>
</Columns>

Remember, our community is here to help! If you need guidance, do not hesitate to ask questions in the issues or join our [<Icon icon="slack" /> Slack workspace](https://goto.prowler.com/slack).



## Setting up your development environment

### Prerequisites

Before proceeding, ensure the following:

- Git is installed.
- Python 3.9 or higher is installed.
- `poetry` is installed to manage dependencies.

### Forking the Prowler Repository

Fork the Prowler GitHub repository to contribute to Prowler. This allows proposing changes, submitting new features, and fixing bugs. For guidance on forking, refer to the [official GitHub documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo?tool=webui#forking-a-repository).

### Cloning Your Forked Repository

Once your fork is created, clone it using the following commands (replace `<your-github-user>` with your GitHub username):

```
git clone https://github.com/<your-github-user>/prowler
cd prowler
```

### Dependency Management and Environment Isolation

To prevent conflicts between environments, we recommend using `poetry`, a Python dependency management solution. Install it by following the [instructions](https://python-poetry.org/docs/#installation).

### Installing Dependencies

To install all required dependencies, including those needed for development, run:

```
poetry install --with dev
eval $(poetry env activate)
```

<Warning>
Starting from Poetry v2.0.0, `poetry shell` has been deprecated in favor of `poetry env activate`.
If your poetry version is below 2.0.0 you must keep using `poetry shell` to activate your environment.
In case you have any doubts, consult the [Poetry environment activation guide](https://python-poetry.org/docs/managing-environments/#activating-the-environment).

</Warning>


### Pre-Commit Hooks

This repository uses Git pre-commit hooks managed by the [pre-commit](https://pre-commit.com/) tool, it is installed with `poetry install --with dev`. Next, run the following command in the root of this repository:

```shell
pre-commit install
```

Successful installation should produce the following output:

```shell
pre-commit installed at .git/hooks/pre-commit
```

### Code Quality and Security Checks

Before merging pull requests, several automated checks and utilities ensure code security and updated dependencies:

<Note>
These should have been already installed if `poetry install --with dev` was already run.

</Note>
- [`bandit`](https://pypi.org/project/bandit/) for code security review.
- [`safety`](https://pypi.org/project/safety/) and [`dependabot`](https://github.com/features/security) for dependencies.
- [`hadolint`](https://github.com/hadolint/hadolint) and [`dockle`](https://github.com/goodwithtech/dockle) for container security.
- [`Snyk`](https://docs.snyk.io/integrations/snyk-container-integrations/container-security-with-docker-hub-integration) for container security in Docker Hub.
- [`clair`](https://github.com/quay/clair) for container security in Amazon ECR.
- [`vulture`](https://pypi.org/project/vulture/), [`flake8`](https://pypi.org/project/flake8/), [`black`](https://pypi.org/project/black/), and [`pylint`](https://pypi.org/project/pylint/) for formatting and best practices.

Additionally, ensure the latest version of [`TruffleHog`](https://github.com/trufflesecurity/trufflehog) is installed to scan for sensitive data in the code. Follow the official [installation guide](https://github.com/trufflesecurity/trufflehog?tab=readme-ov-file#floppy_disk-installation) for setup.

### AI-Driven Contributions

If you are using AI assistants to help with your contributions, Prowler provides specialized resources to enhance AI-driven development:

- **Prowler MCP Server**: The [Prowler MCP Server](/getting-started/products/prowler-mcp) provides AI assistants with access to the entire Prowler ecosystem, including security checks, compliance frameworks, documentation, and more. This enables AI tools to better understand Prowler's architecture and help you create contributions that align with project standards.

- **AGENTS.md Files**: Each component of the Prowler monorepo includes an `AGENTS.md` file that contains specific guidelines for AI agents working on that component. These files provide context about project structure, coding standards, and best practices. When working on a specific component, refer to the relevant `AGENTS.md` file (e.g., `prowler/AGENTS.md`, `ui/AGENTS.md`, `api/AGENTS.md`) to ensure your AI assistant follows the appropriate guidelines.

These resources help ensure that AI-assisted contributions maintain consistency with Prowler's codebase and development practices.

### Dependency Management

All dependencies are listed in the `pyproject.toml` file.

For proper code documentation, refer to the following and follow the code documentation practices presented there: [Google Python Style Guide - Comments and Docstrings](https://github.com/google/styleguide/blob/gh-pages/pyguide.md#38-comments-and-docstrings).

<Note>
If you encounter issues when committing to the Prowler repository, use the `--no-verify` flag with the `git commit` command.

</Note>
### Repository Folder Structure

The Prowler codebase layout helps quickly locate where to add new features, checks, or integrations. The following is a high-level overview from the root of the repository:

```
prowler/
├── prowler/           # Main source code for Prowler SDK (CLI, providers, services, checks, compliances, config, etc.)
├── api/               # API server and related code
├── dashboard/         # Local Dashboard extracted from the CLI output
├── ui/                # Web UI components
├── util/              # Utility scripts and helpers
├── tests/             # Prowler SDK test suite
├── docs/              # Documentation, including this guide
├── examples/          # Example output formats for providers and scripts
├── permissions/       # Permission-related files and policies
├── contrib/           # Community-contributed scripts or modules
├── kubernetes/        # Kubernetes deployment files
├── .github/           # GitHub-related files (workflows, issue templates, etc.)
├── pyproject.toml     # Python project configuration (Poetry)
├── poetry.lock        # Poetry lock file
├── README.md          # Project overview and getting started
├── Makefile           # Common development commands
├── Dockerfile         # SDK Docker container
├── docker-compose.yml # Prowler App Docker compose
└── ...                # Other supporting files
```

## Sending the Pull Request

When creating or reviewing a pull request in <Icon icon="github" /> [Prowler](https://github.com/prowler-cloud/prowler), follow [this template](https://github.com/prowler-cloud/prowler/blob/master/.github/pull_request_template.md) and fill it with the relevant information:

- **Context** and **Description** of the change: This will help the reviewers to understand the change and the purpose of the pull request.
- **Steps to review**: A detailed description of how to review the change.
- **Checklist**: A mandatory checklist of the things that should be reviewed before merging the pull request.

## Contribution Appreciation

If you enjoy swag, we'd love to thank you for your contribution with laptop stickers or other Prowler merchandise!

To request swag: Share your pull request details in our [Slack workspace](https://goto.prowler.com/slack).

You can also reach out to Toni de la Fuente on [Twitter](https://twitter.com/ToniBlyx)—his DMs are open!

## Testing a Pull Request from a Specific Branch

To test Prowler from a specific branch (for example, to try out changes from a pull request before it is merged), you can use `pipx` to install directly from GitHub:

```sh
pipx install "git+https://github.com/prowler-cloud/prowler.git@branch-name"
```

Replace `branch-name` with the name of the branch you want to test. This will install Prowler in an isolated environment, allowing you to try out the changes safely.

For more details on testing go to the [Testing section](/developer-guide/unit-testing) of this documentation.
```

--------------------------------------------------------------------------------

---[FILE: kubernetes-details.mdx]---
Location: prowler-master/docs/developer-guide/kubernetes-details.mdx

```text
---
title: 'Kubernetes Provider'
---

This page details the [Kubernetes](https://kubernetes.io/) provider implementation in Prowler.

By default, Prowler will audit all namespaces in the Kubernetes cluster accessible by the configured context. To configure it, see the [In-Cluster Execution](/user-guide/providers/kubernetes/getting-started-k8s#in-cluster-execution) or [Non In-Cluster Execution](/user-guide/providers/kubernetes/getting-started-k8s#non-in-cluster-execution) guides.

## Kubernetes Provider Classes Architecture

The Kubernetes provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the Kubernetes-specific implementation, highlighting how the generic provider concepts are realized for Kubernetes in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider).

### `KubernetesProvider` (Main Class)

- **Location:** [`prowler/providers/kubernetes/kubernetes_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/kubernetes/kubernetes_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for Kubernetes-specific logic, session management, context and namespace discovery, credential validation, and configuration.
- **Key Kubernetes Responsibilities:**
    - Initializes and manages Kubernetes sessions (supports kubeconfig file or content, context selection, and namespace scoping).
    - Validates credentials and sets up the Kubernetes identity context.
    - Loads and manages configuration, mutelist, and fixer settings.
    - Discovers accessible namespaces and cluster metadata.
    - Provides properties and methods for downstream Kubernetes service classes to access session, identity, and configuration data.

### Data Models

- **Location:** [`prowler/providers/kubernetes/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/kubernetes/models.py)
- **Purpose:** Define structured data for Kubernetes identity and session info.
- **Key Kubernetes Models:**
    - `KubernetesIdentityInfo`: Holds Kubernetes identity metadata, such as context, cluster, and user.
    - `KubernetesSession`: Stores the Kubernetes API client and context information.

### `KubernetesService` (Service Base Class)

- **Location:** [`prowler/providers/kubernetes/lib/service/service.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/kubernetes/lib/service/service.py)
- **Purpose:** Abstract base class that all Kubernetes service-specific classes inherit from. This implements the generic service pattern (described in [service page](/developer-guide/services#service-base-class)) specifically for Kubernetes.
- **Key Kubernetes Responsibilities:**
    - Receives a `KubernetesProvider` instance to access session, identity, and configuration.
    - Manages the Kubernetes API client and context.
    - Provides a `__threading_call__` method to make API calls in parallel by resource.
    - Exposes common audit context (`context`, `api_client`, `audit_config`, `fixer_config`) to subclasses.

### Exception Handling

- **Location:** [`prowler/providers/kubernetes/exceptions/exceptions.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/kubernetes/exceptions/exceptions.py)
- **Purpose:** Custom exception classes for Kubernetes-specific error handling, such as session, API, and configuration errors.

### Session and Utility Helpers

- **Location:** [`prowler/providers/kubernetes/lib/`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/kubernetes/lib/)
- **Purpose:** Helpers for argument parsing, mutelist management, and other cross-cutting concerns.

## Specific Patterns in Kubernetes Services

The generic service pattern is described in [service page](/developer-guide/services#service-structure-and-initialisation). You can find all the currently implemented services in the following locations:

- Directly in the code, in location [`prowler/providers/kubernetes/services/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/kubernetes/services)
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new service is following the [service implementation documentation](/developer-guide/services#adding-a-new-service) and taking other already implemented services as reference.

### Kubernetes Service Common Patterns

- Services communicate with Kubernetes using the Kubernetes Python SDK. See the [official documentation](https://github.com/kubernetes-client/python/blob/master/kubernetes/README.md/).
- Every Kubernetes service class inherits from `KubernetesService`, ensuring access to session, identity, configuration, and client utilities.
- The constructor (`__init__`) always calls `super().__init__` with the provider object, and initializes resource containers (typically as dictionaries keyed by resource UID or name).
- Resource discovery and attribute collection can be parallelized using `self.__threading_call__`.
- All Kubernetes resources are represented as Pydantic `BaseModel` classes, providing type safety and structured access to resource attributes.
- Kubernetes API calls are wrapped in try/except blocks, always logging errors.
- Additional attributes that cannot be retrieved from the default call should be collected and stored for each resource using dedicated methods and threading.

## Specific Patterns in Kubernetes Checks

The Kubernetes checks pattern is described in [checks page](/developer-guide/checks). You can find all the currently implemented checks in:

- Directly in the code, within each service folder, each check has its own folder named after the name of the check. (e.g. [`prowler/providers/kubernetes/services/rbac/rbac_minimize_wildcard_use_roles/`](https://github.com/prowler-cloud/prowler/tree/master/prowler/providers/kubernetes/services/rbac/rbac_minimize_wildcard_use_roles))
- In the [Prowler Hub](https://hub.prowler.com/) for a more human-readable view.

The best reference to understand how to implement a new check is following the [Kubernetes check implementation documentation](/developer-guide/checks#creating-a-check) and taking other checks as reference.

### Check Report Class

The `Check_Report_Kubernetes` class models a single finding for a Kubernetes resource in a check report. It is defined in [`prowler/lib/check/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/lib/check/models.py) and inherits from the generic `Check_Report` base class.

#### Purpose

`Check_Report_Kubernetes` extends the base report structure with Kubernetes-specific fields, enabling detailed tracking of the resource, name, and namespace associated with each finding.

#### Constructor and Attribute Population

When you instantiate `Check_Report_Kubernetes`, you must provide the check metadata and a resource object. The class will attempt to automatically populate its Kubernetes-specific attributes from the resource, using the following logic (in order of precedence):

- **`resource_id`**:
    - Uses `resource.uid` if present.
    - Otherwise, uses `resource.name` if present.
    - Defaults to an empty string if none are available.

- **`resource_name`**:
    - Uses `resource.name` if present.
    - Defaults to an empty string if not available.

- **`namespace`**:
    - Uses `resource.namespace` if present.
    - Defaults to "cluster-wide" for cluster-scoped resources.

If the resource object does not contain the required attributes, you must set them manually in the check logic.

Other attributes are inherited from the `Check_Report` class, from which you **always** have to set the `status` and `status_extended` attributes in the check logic.

#### Example Usage

```python
report = Check_Report_Kubernetes(
    metadata=check_metadata,
    resource=resource_object
)
report.status = "PASS"
report.status_extended = "Resource is compliant."
```
```

--------------------------------------------------------------------------------

---[FILE: lighthouse.mdx]---
Location: prowler-master/docs/developer-guide/lighthouse.mdx

```text
---
title: 'Extending Prowler Lighthouse AI'
---

This guide helps developers customize and extend Prowler Lighthouse AI by adding or modifying AI agents.

## Understanding AI Agents

AI agents combine Large Language Models (LLMs) with specialized tools that provide environmental context. These tools can include API calls, system command execution, or any function-wrapped capability.

### Types of AI Agents

AI agents fall into two main categories:

- **Autonomous Agents**: Freely chooses from available tools to complete tasks, adapting their approach based on context. They decide which tools to use and when.
- **Workflow Agents**: Follows structured paths with predefined logic. They execute specific tool sequences and can include conditional logic.

Prowler Lighthouse AI is an autonomous agent - selecting the right tool(s) based on the users query.

<Note>
To learn more about AI agents, read [Anthropic's blog post on building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

</Note>
### LLM Dependency

The autonomous nature of agents depends on the underlying LLM. Autonomous agents using identical system prompts and tools but powered by different LLM providers might approach user queries differently. Agent with one LLM might solve a problem efficiently, while with another it might take a different route or fail entirely.

After evaluating multiple LLM providers (OpenAI, Gemini, Claude, LLama) based on tool calling features and response accuracy, we recommend using the `gpt-4o` model.

## Prowler Lighthouse AI Architecture

Prowler Lighthouse AI uses a multi-agent architecture orchestrated by the [Langgraph-Supervisor](https://www.npmjs.com/package/@langchain/langgraph-supervisor) library.

### Architecture Components

<img src="/images/prowler-app/lighthouse-architecture.png" alt="Prowler Lighthouse architecture" />

Prowler Lighthouse AI integrates with the NextJS application:

- The [Langgraph-Supervisor](https://www.npmjs.com/package/@langchain/langgraph-supervisor) library integrates directly with NextJS
- The system uses the authenticated user session to interact with the Prowler API server
- Agents only access data the current user is authorized to view
- Session management operates automatically, ensuring Role-Based Access Control (RBAC) is maintained

## Available Prowler AI Agents

The following specialized AI agents are available in Prowler:

### Agent Overview

- **provider_agent**: Fetches information about cloud providers connected to Prowler
- **user_info_agent**: Retrieves information about Prowler users
- **scans_agent**: Fetches information about Prowler scans
- **compliance_agent**: Retrieves compliance overviews across scans
- **findings_agent**: Fetches information about individual findings across scans
- **overview_agent**: Retrieves overview information (providers, findings by status and severity, etc.)

## How to Add New Capabilities

### Updating the Supervisor Prompt

The supervisor agent controls system behavior, tone, and capabilities. You can find the supervisor prompt at: [https://github.com/prowler-cloud/prowler/blob/master/ui/lib/lighthouse/prompts.ts](https://github.com/prowler-cloud/prowler/blob/master/ui/lib/lighthouse/prompts.ts)

#### Supervisor Prompt Modifications

Modifying the supervisor prompt allows you to:

- Change personality or response style
- Add new high-level capabilities
- Modify task delegation to specialized agents
- Set up guardrails (query types to answer or decline)

<Note>
The supervisor agent should not have its own tools. This design keeps the system modular and maintainable.

</Note>
### How to Create New Specialized Agents

The supervisor agent and all specialized agents are defined in the `route.ts` file. The supervisor agent uses [langgraph-supervisor](https://www.npmjs.com/package/@langchain/langgraph-supervisor), while other agents use the prebuilt [create-react-agent](https://langchain-ai.github.io/langgraphjs/how-tos/create-react-agent/).

To add new capabilities or all Lighthouse AI to interact with other APIs, create additional specialized agents:

1. First determine what the new agent would do. Create a detailed prompt defining the agent's purpose and capabilities. You can see an example from [here](https://github.com/prowler-cloud/prowler/blob/master/ui/lib/lighthouse/prompts.ts#L359-L385).
<Note>
Ensure that the new agent's capabilities don't collide with existing agents. For example, if there's already a *findings_agent* that talks to findings APIs don't create a new agent to do the same.

</Note>
2. Create necessary tools for the agents to access specific data or perform actions. A tool is a specialized function that extends the capabilities of LLM by allowing it to access external data or APIs. A tool is triggered by LLM based on the description of the tool and the user's query.
For example, the description of `getScanTool` is "Fetches detailed information about a specific scan by its ID." If the description doesn't convey what the tool is capable of doing, LLM will not invoke the function. If the description of `getScanTool` was set to something random or not set at all, LLM will not answer queries like "Give me the critical issues from the scan ID xxxxxxxxxxxxxxx"
<Note>
Ensure that one tool is added to one agent only. Adding tools is optional. There can be agents with no tools at all.

</Note>
3. Use the `createReactAgent` function to define a new agent. For example, the rolesAgent name is "roles_agent" and has access to call tools "*getRolesTool*" and "*getRoleTool*"
```js
const rolesAgent = createReactAgent({
  llm: llm,
  tools: [getRolesTool, getRoleTool],
  name: "roles_agent",
  prompt: rolesAgentPrompt,
});
```

4. Create a detailed prompt defining the agent's purpose and capabilities.

5. Add the new agent to the available agents list:
```js
const agents = [
  userInfoAgent,
  providerAgent,
  overviewAgent,
  scansAgent,
  complianceAgent,
  findingsAgent,
  rolesAgent,  // New agent added here
];
// Create supervisor workflow
const workflow = createSupervisor({
  agents: agents,
  llm: supervisorllm,
  prompt: supervisorPrompt,
  outputMode: "last_message",
});
```

6. Update the supervisor's system prompt to summarize the new agent's capabilities.

### Best Practices for Agent Development

When developing new agents or capabilities:

- **Clear Responsibility Boundaries**: Each agent should have a defined purpose with minimal overlap. No two agents should access the same tools or different tools accessing the same Prowler APIs.
- **Minimal Data Access**: Agents should only request the data they need, keeping requests specific to minimize context window usage, cost, and response time.
- **Thorough Prompting:** Ensure agent prompts include clear instructions about:
    - The agent's purpose and limitations
    - How to use its tools
    - How to format responses for the supervisor
    - Error handling procedures (Optional)
- **Security Considerations:** Agents should never modify data or access sensitive information like secrets or credentials.
- **Testing:** Thoroughly test new agents with various queries before deploying to production.
```

--------------------------------------------------------------------------------

---[FILE: llm-details.mdx]---
Location: prowler-master/docs/developer-guide/llm-details.mdx

```text
---
title: 'LLM Provider'
---

This page details the [Large Language Model (LLM)](https://en.wikipedia.org/wiki/Large_language_model) provider implementation in Prowler.

The LLM provider enables security testing of language models using red team techniques. By default, Prowler uses the built-in LLM configuration that targets OpenAI models with comprehensive security test suites. To configure it, follow the [LLM getting started guide](/user-guide/providers/llm/getting-started-llm).

## LLM Provider Classes Architecture

The LLM provider implementation follows the general [Provider structure](/developer-guide/provider). This section focuses on the LLM-specific implementation, highlighting how the generic provider concepts are realized for LLM security testing in Prowler. For a full overview of the provider pattern, base classes, and extension guidelines, see [Provider documentation](/developer-guide/provider).

### Main Class

- **Location:** [`prowler/providers/llm/llm_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/llm/llm_provider.py)
- **Base Class:** Inherits from `Provider` (see [base class details](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/common/provider.py)).
- **Purpose:** Central orchestrator for LLM-specific logic, configuration management, and integration with promptfoo for red team testing.
- **Key LLM Responsibilities:**
    - Initializes and manages LLM configuration using promptfoo.
    - Validates configuration and sets up the LLM testing context.
    - Loads and manages red team test configuration, plugins, and target models.
    - Provides properties and methods for downstream LLM security testing.
    - Integrates with promptfoo for comprehensive LLM security evaluation.

### Data Models

- **Location:** [`prowler/providers/llm/models.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/llm/models.py)
- **Purpose:** Define structured data for LLM output options and configuration.
- **Key LLM Models:**
    - `LLMOutputOptions`: Customizes output filename logic for LLM-specific reporting.

### LLM Security Testing Integration

- **Location:** [`prowler/providers/llm/llm_provider.py`](https://github.com/prowler-cloud/prowler/blob/master/prowler/providers/llm/llm_provider.py)
- **Purpose:** Integrates with promptfoo for comprehensive LLM security testing.
- **Key LLM Responsibilities:**
    - Executes promptfoo red team evaluations against target LLMs.
    - Processes security test results and converts them to Prowler reports.
    - Manages test concurrency and progress tracking.
    - Handles real-time streaming of test results.

### Configuration Management

The LLM provider uses promptfoo configuration files to define:

- **Target Models**: The LLM models to test (e.g., OpenAI GPT, Anthropic Claude)
- **Red Team Plugins**: Security test suites (OWASP, MITRE, NIST, EU AI Act)
- **Test Parameters**: Concurrency, test counts, and evaluation criteria

### Default Configuration

Prowler includes a comprehensive default LLM configuration that:

- Targets OpenAI models by default
- Includes multiple security test frameworks (OWASP, MITRE, NIST, EU AI Act)
- Provides extensive test coverage for LLM security vulnerabilities
- Supports custom configuration for specific testing needs

## Specific Patterns in LLM Security Testing

The LLM provider implements security testing through integration with promptfoo, following these patterns:

### Red Team Testing Framework

- **Plugin-based Architecture**: Uses promptfoo plugins for different security test categories
- **Comprehensive Coverage**: Includes OWASP LLM Top 10, MITRE ATLAS, NIST AI Risk Management, and EU AI Act compliance
- **Real-Time Evaluation**: Streams test results as they are generated
- **Progress Tracking**: Provides detailed progress information during test execution

### Test Execution Flow

1. **Configuration Loading**: Loads promptfoo configuration with target models and test plugins
2. **Test Generation**: Generates security test cases based on configured plugins
3. **Concurrent Execution**: Runs tests with configurable concurrency limits
4. **Result Processing**: Converts promptfoo results to Prowler security reports
5. **Progress Monitoring**: Tracks and displays test execution progress

### Security Test Categories

The LLM provider supports comprehensive security testing across multiple frameworks:

- **OWASP LLM Top 10**: Covers prompt injection, data leakage, and model security
- **MITRE ATLAS**: Adversarial threat landscape for AI systems
- **NIST AI Risk Management**: AI system risk assessment and mitigation
- **EU AI Act**: European Union AI regulation compliance
- **Custom Tests**: Support for organization-specific security requirements

## Error Handling and Validation

The LLM provider includes comprehensive error handling for:

- **Configuration Validation**: Ensures valid promptfoo configuration files
- **Model Access**: Handles authentication and access issues with target LLMs
- **Test Execution**: Manages test failures and timeout scenarios
- **Result Processing**: Handles malformed or incomplete test results

## Integration with Prowler Ecosystem

The LLM provider seamlessly integrates with Prowler's existing infrastructure:

- **Output Formats**: Supports all Prowler output formats (JSON, CSV, HTML, etc.)
- **Compliance Frameworks**: Integrates with Prowler's compliance reporting
- **Fixer Integration**: Supports automated remediation recommendations
- **Dashboard Integration**: Compatible with Prowler App for centralized management
```

--------------------------------------------------------------------------------

````
