---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 5
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 5 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .github/agents/demonstrate.md]---
Location: vscode-main/.github/agents/demonstrate.md

```markdown
---
name: Demonstrate
description: Agent for demonstrating VS Code features
target: github-copilot
tools:
- "view"
- "create"
- "edit"
- "glob"
- "grep"
- "bash"
- "read_bash"
- "write_bash"
- "stop_bash"
- "list_bash"
- "report_intent"
- "fetch_documentation"
- "agents"
- "read"
- "search"
- "todo"
- "web"
- "github-mcp-server/*"
- "GitHub/*"
- "github/*"
- "vscode-playwright-mcp/*"
---

# Role and Objective

You are a QA testing agent. Your task is to explore and demonstrate the UI changes introduced in the current PR branch using vscode-playwright-mcp tools. Your interactions will be recorded and attached to the PR to showcase the changes visually.

# Core Requirements

## Setup Phase

1. Use GitHub MCP tools to get PR details (description, linked issues, comments)
2. Search the `microsoft/vscode-docs` repository for relevant documentation about the feature area
3. Examine changed files and commit messages to understand the scope
4. Identify what UI features or behaviors were modified
5. Start VS Code automation using `vscode_automation_start`
6. ALWAYS start by setting the setting `"chat.allowAnonymousAccess":true` using the `vscode_automation_settings_add_user_settings` tool. This will ensure that Chat works without requiring sign-in.

## Testing Phase

1. Use `browser_snapshot` to capture the current state
2. Execute the user workflows affected by the PR changes

## Demonstration Goals

- Show the new or modified UI in action
- Exercise the changed code paths through realistic user interactions
- Capture clear visual evidence of the improvements or changes
- Test edge cases or variations if applicable

# Important Guidelines

- Focus on DEMONSTRATING the changes, not verifying correctness
- You are NOT writing playwright tests - use the tools interactively to explore
- If the PR description or commits mention specific scenarios, prioritize testing those
- Make multiple passes if needed to capture different aspects of the changes
- You may make temporary modifications to facilitate better demonstration (e.g., adjusting settings, opening specific views)

## GitHub MCP Tools

**Prefer using GitHub MCP tools over `gh` CLI commands** - these provide structured data and better integration:

### Pull Request Tools
- `pull_request_read` - Get PR details, diff, status, files, reviews, and comments
  - Use `method="get"` for PR metadata (title, description, labels, etc.)
  - Use `method="get_diff"` for the full diff
  - Use `method="get_files"` for list of changed files
  - Use `method="get_reviews"` for review summaries
  - Use `method="get_review_comments"` for line-specific review comments
- `search_pull_requests` - Search PRs with filters (author, state, etc.)

### Issue Tools
- `get_issue` - Get full issue details (description, labels, assignees, etc.)
- `get_issue_comments` - Get all comments on an issue
- `search_issues` - Search issues with filters
- `list_sub_issues` - Get sub-issues if using issue hierarchies

## Pointers for Controlling VS Code

- **Prefer `vscode_automation_*` tools over `browser_*` tools** when available - these are designed specifically for VS Code interactions and provide more reliable control. For example:
	- `vscode_automation_chat_send_message` over using `browser_*` tools to send chat messages
	- `vscode_automation_editor_type_text` over using `browser_*` tools to type in editors

If you are typing into a monaco input and you can't use the standard methods, follow this sequence:

**Monaco editors (used throughout VS Code) DO NOT work with standard Playwright methods like `.click()` on textareas or `.fill()` / `.type()`**

**YOU MUST follow this exact sequence:**

1. **Take a page snapshot** to identify the editor structure in the accessibility tree
2. **Find the parent `code` role element** that wraps the Monaco editor
   - ❌ DO NOT click on `textarea` or `textbox` elements - these are overlaid by Monaco's rendering
   - ✅ DO click on the `code` role element that is the parent container
3. **Click on the `code` element** to focus the editor - this properly delegates focus to Monaco's internal text handling
4. **Verify focus** by checking that the nested textbox element has the `[active]` attribute in a new snapshot
5. **Use `page.keyboard.press()` for EACH character individually** - standard Playwright `type()` or `fill()` methods don't work with Monaco editors since they intercept keyboard events at the page level

**Example:**
```js
// ❌ WRONG - this will fail with timeout
await page.locator('textarea').click();
await page.locator('textarea').fill('text');

// ✅ CORRECT
await page.locator('[role="code"]').click();
await page.keyboard.press('t');
await page.keyboard.press('e');
await page.keyboard.press('x');
await page.keyboard.press('t');
```

**Why this is required:** Monaco editors intercept keyboard events at the page level and use a virtualized rendering system. Clicking textareas directly or using `.fill()` bypasses Monaco's event handling, causing timeouts and failures.

# Workflow Pattern

1. Gather context:
   - Retrieve PR details using GitHub MCP (description, linked issues, review comments)
   - Search microsoft/vscode-docs for documentation on the affected feature areas
   - Examine changed files and commit messages
2. Plan which user interactions will best showcase the changes
3. Start automation and navigate to the relevant area
4. Perform the interactions
5. Document what you're demonstrating as you go
6. Ensure the recording clearly shows the before/after or new functionality
7. **ALWAYS stop the automation** by calling `vscode_automation_stop` - this is REQUIRED whether you successfully demonstrated the feature or encountered issues that prevented testing
```

--------------------------------------------------------------------------------

---[FILE: .github/agents/engineering.md]---
Location: vscode-main/.github/agents/engineering.md

```markdown
---
name: Engineering
description: The VS Code Engineering Agent helps with engineering-related tasks in the VS Code repository.
tools:
 - read/readFile
 - execute/getTerminalOutput
 - execute/runInTerminal
 - github/*
 - agent/runSubagent
---

## Your Role

You are the **VS Code Engineering Agent**. Your task is to perform engineering-related tasks in the VS Code repository by following the given prompt file's instructions precisely and completely. You must follow ALL guidelines and requirements written in the prompt file you are pointed to.

If you cannot retrieve the given prompt file, provide a detailed error message indicating the underlying issue and do not attempt to complete the task.

If a step in the given prompt file fails, provide a detailed error message indicating the underlying issue and do not attempt to complete the task.
```

--------------------------------------------------------------------------------

---[FILE: .github/commands/codespaces_issue.yml]---
Location: vscode-main/.github/commands/codespaces_issue.yml

```yaml
# Learn more about the syntax here:
# https://docs.github.com/en/early-access/github/save-time-with-slash-commands/syntax-for-user-defined-slash-commands
---
trigger: codespaces_issue
title: Codespaces Issue
description: Report downstream

steps:
  - type: fill
    template: |-
      This looks like an issue with the Codespaces service which we don't track in this repository. You can report this to the Codespaces team at https://github.com/orgs/community/discussions/categories/codespaces
```

--------------------------------------------------------------------------------

---[FILE: .github/endgame/insiders.yml]---
Location: vscode-main/.github/endgame/insiders.yml

```yaml
{
  insidersLabel: "insiders",
  insidersColor: "006b75",
  action: "add",
  perform: true,
}
```

--------------------------------------------------------------------------------

---[FILE: .github/instructions/disposable.instructions.md]---
Location: vscode-main/.github/instructions/disposable.instructions.md

```markdown
---
description: Guidelines for writing code using IDisposable
---

Core symbols:
* `IDisposable`
	* `dispose(): void` - dispose the object
* `Disposable` (implements `IDisposable`) - base class for disposable objects
	* `this._store: DisposableStore`
	* `this._register<T extends IDisposable>(t: T): T`
		* Try to immediately register created disposables! E.g. `const someDisposable = this._register(new SomeDisposable())`
* `DisposableStore` (implements `IDisposable`)
	* `add<T extends IDisposable>(t: T): T`
	* `clear()`
* `toDisposable(fn: () => void): IDisposable` - helper to create a disposable from a function

* `MutableDisposable` (implements `IDisposable`)
	* `value: IDisposable | undefined`
	* `clear()`
	* A value that enters a mutable disposable (at least once) will be disposed the latest when the mutable disposable is disposed (or when the value is replaced or cleared).
```

--------------------------------------------------------------------------------

---[FILE: .github/instructions/learnings.instructions.md]---
Location: vscode-main/.github/instructions/learnings.instructions.md

```markdown
---
applyTo: **
description: This document describes how to deal with learnings that you make. (meta instruction)
---

This document describes how to deal with learnings that you make.
It is a meta-instruction file.

Structure of learnings:
* Each instruction file has a "Learnings" section.
* Each learning has a counter that indicates how often that learning was useful (initially 1).
* Each learning has a 1-4 sentences description of the learning.

Example:
```markdown
## Learnings
* Prefer `const` over `let` whenever possible (1)
* Avoid `any` type (3)
```

When the user tells you "learn!", you should:
* extract a learning from the recent conversation
	* identify the problem that you created
	* identify why it was a problem
	* identify how you were told to fix it/how the user fixed it
* create a learning (1-4 sentences) from that
	* Write this out to the user and reflect over these sentences
	* then, add the reflected learning to the "Learnings" section of the most appropriate instruction file


	Important: Whenever a learning was really useful, increase the counter!!
	When a learning was not useful and just caused more problems, decrease the counter.
```

--------------------------------------------------------------------------------

---[FILE: .github/instructions/observables.instructions.md]---
Location: vscode-main/.github/instructions/observables.instructions.md

```markdown
---
description: Guidelines for writing code using observables and deriveds.
---

```ts
class MyService extends Disposable {
    private _myData1 = observableValue(/* always put `this` here */ this, /* initial value*/ 0);
    private _myData2 = observableValue(/* always put `this` here */ this, /* initial value*/ 42);

    // Deriveds can combine/derive from other observables/deriveds
    private _myDerivedData = derived(this, reader => {
		// Use observable.read(reader) to access the value and track the dependency.
        return this._myData1.read(reader) * this._myData2.read(reader);
	});

	private _myDerivedDataWithLifetime = derived(this, reader => {
		// The reader.store will get cleared just before the derived is re-evaluated or gets unsubscribed.
		return reader.store.add(new SomeDisposable(this._myDerivedData.read(reader)));
	});

    constructor() {
        this._register(autorun((reader) => { // like mobx autorun, they run immediately and on change
            const data = this._myData1.read(reader); // but you only get the data if you pass in the reader!

            console.log(data);

			// also has reader.store
        }))
    }

    getData(): number {
        return this._myData1.get(); // use get if you don't have a reader, but try to avoid it since the dependency is not tracked.
    }

	setData1() {
		this._myData1.set(42, undefined); // use set to update the value. The second paramater is the transaction, which is undefined here.
	}

	setData2() {
		transaction(tx => {
			// you can use transaction to batch updates, so they are only notified once.
			// Whenever multiple observables are synchronously updated together, use transaction!
			this._myData1.set(42, tx);
			this._myData2.set(43, tx);
		});
	}
}
```


Most important symbols:
* `observableValue`
* `disposableObservableValue`
* `derived`
* `autorun`
* `transaction`
* `observableFromEvent`
* `observableSignalFromEvent`
* `observableSignal(...): IObservable<void>` - use `.trigger(tx)` to trigger a change


* Check src\vs\base\common\observableInternal\index.ts for a list of all observable utitilies


* Important learnings:
	* [1] Avoid glitches
	* [2] **Choose the right observable value type:**
		* Use `observableValue(owner, initialValue)` for regular values
		* Use `disposableObservableValue(owner, initialValue)` when storing disposable values - it automatically disposes the previous value when a new one is set, and disposes the current value when the observable itself is disposed (similar to `MutableDisposable` behavior)
	* [3] **Choose the right event observable pattern:**
		* Use `observableFromEvent(owner, event, valueComputer)` when you need to track a computed value that changes with the event, and you want updates only when the computed value actually changes
		* Use `observableSignalFromEvent(owner, event)` when you need to force re-computation every time the event fires, regardless of value stability. This is important when the computed value might not change but dependent computations need fresh context (e.g., workspace folder changes where the folder array reference might be the same but file path calculations need to be refreshed)
```

--------------------------------------------------------------------------------

---[FILE: .github/instructions/telemetry.instructions.md]---
Location: vscode-main/.github/instructions/telemetry.instructions.md

```markdown
---
description: Use when asked to work on telemetry events
---

Patterns for GDPR-compliant telemetry in VS Code with proper type safety and privacy protection.

## Implementation Pattern

### 1. Define Types
```typescript
type MyFeatureEvent = {
    action: string;
    duration: number;
    success: boolean;
    errorCode?: string;
};

type MyFeatureClassification = {
    action: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The action performed.' };
    duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; isMeasurement: true; comment: 'Time in milliseconds.' };
    success: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether action succeeded.' };
    errorCode: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Error code if action failed.' };
    owner: 'yourGitHubUsername';
    comment: 'Tracks MyFeature usage and performance.';
};
```

### 2.1. Send Event
```typescript
this.telemetryService.publicLog2<MyFeatureEvent, MyFeatureClassification>('myFeatureAction', {
    action: 'buttonClick',
    duration: 150,
    success: true
});
```

### 2.2. Error Events
For error-specific telemetry with stack traces or error messages:
```typescript
type MyErrorEvent = {
    operation: string;
    errorMessage: string;
    duration?: number;
};

type MyErrorClassification = {
    operation: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The operation that failed.' };
    errorMessage: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The error message.' };
    duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; isMeasurement: true; comment: 'Time until failure.' };
    owner: 'yourGitHubUsername';
    comment: 'Tracks MyFeature errors for reliability.';
};

this.telemetryService.publicLogError2<MyErrorEvent, MyErrorClassification>('myFeatureError', {
    operation: 'fileRead',
    errorMessage: error.message,
    duration: 1200
});
```

### 3. Service Injection
```typescript
constructor(
    @ITelemetryService private readonly telemetryService: ITelemetryService,
) { super(); }
```

## GDPR Classifications & Purposes

**Classifications (choose the most restrictive):**
- `SystemMetaData` - **Most common.** Non-personal system info, user preferences, feature usage, identifiers (extension IDs, language types, counts, durations, success flags)
- `CallstackOrException` - Error messages, stack traces, exception details. **Only for actual error information.**
- `PublicNonPersonalData` - Data already publicly available (rare)

**Purposes (combine with different classifications):**
- `FeatureInsight` - **Default.** Understanding how features are used, user behavior patterns, feature adoption
- `PerformanceAndHealth` - **For errors & performance.** Metrics, error rates, performance measurements, diagnostics

**Required Properties:**
- `comment` - Clear explanation of what the field contains and why it's collected
- `owner` - GitHub username (infer from branch or ask)
- `isMeasurement: true` - **Required** for all numeric values flags used in calculations

## Error Events

Use `publicLogError2` for errors with `CallstackOrException` classification:

```typescript
this.telemetryService.publicLogError2<ErrorEvent, ErrorClassification>('myFeatureError', {
	errorMessage: error.message,
	errorCode: 'MYFEATURE_001',
	context: 'initialization'
});
```

## Naming & Privacy Rules

**Naming Conventions:**
- Event names: `camelCase` with context (`extensionActivationError`, `chatMessageSent`)
- Property names: specific and descriptive (`agentId` not `id`, `durationMs` not `duration`)
- Common patterns: `success/hasError/isEnabled`, `sessionId/extensionId`, `type/kind/source`

**Critical Don'ts:**
- ❌ No PII (usernames, emails, file paths, content)
- ❌ Missing `owner` field in classification (infer from branch name or ask user)
- ❌ Vague comments ("user data" → "selected language identifier")
- ❌ Wrong classification
- ❌ Missing `isMeasurement` on numeric metrics

**Privacy Requirements:**
- Minimize data collection to essential insights only
- Use hashes/categories instead of raw values when possible
- Document clear purpose for each data point
```

--------------------------------------------------------------------------------

---[FILE: .github/instructions/tree-widgets.instructions.md]---
Location: vscode-main/.github/instructions/tree-widgets.instructions.md

```markdown
---
description: Use when asked to consume workbench tree widgets in VS Code.
---

# Workbench Tree Widgets Overview

**Location**: `src/vs/platform/list/browser/listService.ts`
**Type**: Platform Services
**Layer**: Platform

## Purpose

The Workbench Tree Widgets provide high-level, workbench-integrated tree components that extend the base tree implementations with VS Code-specific functionality like context menus, keyboard navigation, theming, accessibility, and dependency injection integration. These widgets serve as the primary tree components used throughout the VS Code workbench for file explorers, debug views, search results, and other hierarchical data presentations.

## Scope

### Included Functionality
- **Context Integration**: Automatic context key management, focus handling, and VS Code theme integration
- **Resource Navigation**: Built-in support for opening files and resources with proper editor integration
- **Accessibility**: Complete accessibility provider integration with screen reader support
- **Keyboard Navigation**: Smart keyboard navigation with search-as-you-type functionality
- **Multi-selection**: Configurable multi-selection behavior with platform-appropriate modifier keys
- **Dependency Injection**: Full integration with VS Code's service container for automatic service injection
- **Configuration**: Automatic integration with user settings for tree behavior customization

### Integration Points
- **IInstantiationService**: For service injection and component creation
- **IContextKeyService**: For managing focus, selection, and tree state context keys
- **IListService**: For registering trees and managing workbench list lifecycle
- **IConfigurationService**: For reading tree configuration settings
- **Resource Navigators**: For handling file/resource opening with proper editor integration

### Out of Scope
- Low-level tree rendering and virtualization (handled by base tree classes)
- Data management and async loading logic (provided by data sources)
- Custom styling beyond workbench theming integration

## Architecture

### Key Classes & Interfaces

- **WorkbenchTreeInternals**: Encapsulates common workbench functionality across all tree types
- **ResourceNavigator**: Handles file/resource opening with proper editor integration
- **IOpenEvent**: Event interface for resource opening with editor options
- **IWorkbench*TreeOptions**: Configuration interfaces extending base options with workbench features
- **IResourceNavigatorOptions**: Configuration for resource opening behavior

### Key Files

- **`src/vs/platform/list/browser/listService.ts`**: Contains all workbench tree widget implementations, shared workbench functionality (`WorkbenchTreeInternals`), and configuration utilities
	- `src/vs/platform/list/browser/test/listService.test.ts`: Unit tests for workbench trees
- **`src/vs/base/browser/ui/tree/objectTree.ts`**: Base implementation for static trees and compressible trees
	- `src/vs/base/test/browser/ui/tree/objectTree.test.ts`: Base tree tests
- **`src/vs/base/browser/ui/tree/asyncDataTree.ts`**: Base implementation for async trees with lazy loading support
	- `src/vs/base/test/browser/ui/tree/asyncDataTree.test.ts`: Async tree tests
- **`src/vs/base/browser/ui/tree/dataTree.ts`**: Base implementation for data-driven trees with explicit data sources
	- `src/vs/base/test/browser/ui/tree/dataTree.test.ts`: Data tree tests
- **`src/vs/base/browser/ui/tree/abstractTree.ts`**: Base tree foundation
- **`src/vs/base/browser/ui/tree/tree.ts`**: Core interfaces and types

## Development Guidelines

### Choosing the Right Tree Widget

1. **WorkbenchObjectTree**: Use for simple, static hierarchical data that doesn't change frequently
   ```typescript
   // Example: Timeline items, loaded scripts
   const tree = instantiationService.createInstance(
     WorkbenchObjectTree<TimelineItem, FuzzyScore>,
     'TimelineView', container, delegate, renderers, options
   );
   ```

2. **WorkbenchAsyncDataTree**: Use for dynamic data that loads asynchronously
   ```typescript
   // Example: Debug variables, file contents
   const tree = instantiationService.createInstance(
     WorkbenchAsyncDataTree<IStackFrame, IExpression, FuzzyScore>,
     'VariablesView', container, delegate, renderers, dataSource, options
   );
   ```

3. **WorkbenchCompressible*Tree**: Use when you need path compression for deep hierarchies
   ```typescript
   // Example: File explorer, call stack
   const tree = instantiationService.createInstance(
     WorkbenchCompressibleAsyncDataTree<ExplorerItem[], ExplorerItem, FuzzyScore>,
     'FileExplorer', container, delegate, compressionDelegate, renderers, dataSource, options
   );
   ```

### Construction Pattern

**Always use IInstantiationService.createInstance()** to ensure proper dependency injection:

```typescript
constructor(
  @IInstantiationService private instantiationService: IInstantiationService
) {
  this.tree = this.instantiationService.createInstance(
    WorkbenchAsyncDataTree<TInput, T, TFilterData>,
    'UniqueTreeId',           // Used for settings and context keys
    container,                // DOM container element
    delegate,                 // IListVirtualDelegate for item height/template
    renderers,                // Array of tree renderers
    dataSource,              // Data source (async trees only)
    options                  // Tree configuration options
  );
}
```

### Required Options

All workbench trees require an **accessibilityProvider**:
```typescript
const options: IWorkbenchAsyncDataTreeOptions<T, TFilterData> = {
  accessibilityProvider: {
    getAriaLabel: (element: T) => element.name,
    getRole: () => 'treeitem'
  }
  // ... other options
};
```

### Common Configuration Patterns

```typescript
// Standard tree setup with search, identity, and navigation
const options = {
  accessibilityProvider: new MyAccessibilityProvider(),
  identityProvider: { getId: (element) => element.id },
  keyboardNavigationLabelProvider: {
    getKeyboardNavigationLabel: (element) => element.name
  },
  multipleSelectionController: {
    isSelectionSingleChangeEvent: (e) => e.ctrlKey || e.metaKey,
    isSelectionRangeChangeEvent: (e) => e.shiftKey
  },
  overrideStyles: this.getLocationBasedColors().listOverrideStyles
};
```

### Lifecycle Management

- **Always register trees as disposables** in the containing component
- **Use the tree's `setInput()` method** to provide initial data
- **Always call `layout()` when the container initializes and when its size changes**
- **Handle selection and open events** through the tree's event system

### Performance Considerations

- Use **compression** for deep hierarchies to reduce DOM nodes
- Implement **efficient data sources** that avoid unnecessary data fetching
- Consider **virtualization settings** for large datasets
- Use **identity providers** for efficient updates and state preservation

---
```

--------------------------------------------------------------------------------

---[FILE: .github/ISSUE_TEMPLATE/bug_report.md]---
Location: vscode-main/.github/ISSUE_TEMPLATE/bug_report.md

```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

<!-- ⚠️⚠️ Do Not Delete This! bug_report_template ⚠️⚠️ -->
<!-- Please read our Rules of Conduct: https://opensource.microsoft.com/codeofconduct/ -->
<!-- 🕮 Read our guide about submitting issues: https://github.com/microsoft/vscode/wiki/Submitting-Bugs-and-Suggestions -->
<!-- 🔎 Search existing issues to avoid creating duplicates. -->
<!-- 🧪 Test using the latest Insiders build to see if your issue has already been fixed: https://code.visualstudio.com/insiders/ -->
<!-- 💡 Instead of creating your report here, use 'Report Issue' from the 'Help' menu in VS Code to pre-fill useful information. -->
<!-- 🔧 Launch with `code --disable-extensions` to check. -->
Does this issue occur when all extensions are disabled?: Yes/No

<!-- 🪓 If you answered No above, use 'Help: Start Extension Bisect' from Command Palette to try to identify the cause. -->
<!-- 📣 Issues caused by an extension need to be reported directly to the extension publisher. The 'Help > Report Issue' dialog can assist with this. -->
- VS Code Version: 
- OS Version: 

Steps to Reproduce:

1. 
2.
```

--------------------------------------------------------------------------------

---[FILE: .github/ISSUE_TEMPLATE/config.yml]---
Location: vscode-main/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: false
contact_links:
  - name: Question
    url: https://stackoverflow.com/questions/tagged/visual-studio-code
    about: Please ask and answer questions here.
  - name: Extension Development
    url: https://github.com/microsoft/vscode-discussions/discussions
    about: Please use this for extension development questions and ideas.
```

--------------------------------------------------------------------------------

---[FILE: .github/ISSUE_TEMPLATE/copilot_bug_report.md]---
Location: vscode-main/.github/ISSUE_TEMPLATE/copilot_bug_report.md

```markdown
---
name: Copilot Bug report
about: Create a report to help us improve Copilot's chat interface in VS Code
title: ''
labels: chat-ext-issue
assignees: ''

---

<!-- Please search existing issues to avoid creating duplicates -->
<!-- Please attach logs to help us diagnose your issue -->

- Copilot Chat Extension Version:
- VS Code Version:
- OS Version:
- Feature (e.g. agent/edit/ask mode):
- Selected model (e.g. GPT 4.1, Claude 3.7 Sonnet):
- Logs:

Steps to Reproduce:

1.
2.
```

--------------------------------------------------------------------------------

---[FILE: .github/ISSUE_TEMPLATE/feature_request.md]---
Location: vscode-main/.github/ISSUE_TEMPLATE/feature_request.md

```markdown
---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: ''
assignees: ''

---

<!-- ⚠️⚠️ Do Not Delete This! feature_request_template ⚠️⚠️ -->
<!-- Please read our Rules of Conduct: https://opensource.microsoft.com/codeofconduct/ -->
<!-- Please search existing issues to avoid creating duplicates. -->

<!-- Describe the feature you'd like. -->
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/build-champ.prompt.md]---
Location: vscode-main/.github/prompts/build-champ.prompt.md

```markdown
---
agent: agent
tools: ['github/github-mcp-server/*', 'microsoft/azure-devops-mcp/*', 'todos']
---
# Role
You are the build champion for the VS Code team. Your task is to triage a {{build}} by following these steps:

# Instructions
1. Display the warning message written below.
2. Investigate the failing jobs of a given {{build}}.
  - **Prioritize investigating failing unit test steps first** - these often reveal the root cause of failures
3. Find the most recent {{successful-build}} prior to the failed {{build}}, then identify the {{first-failing-build}} after the {{successful-build}}. Note the commit ids of {{successful-build}} and {{first-failing-build}}.
  - Ensure the branch is the same for all builds involved.
4. Using the commit id between the two builds, identify all PRs that were merged in that range.
5. For each PR, analyze the changes to determine if they could have caused the failure.
6. Draft a minimal, succinct, inline-linked message including:
  - Build URL
  - Failing job URL
  - Raw log URL
  - GitHub compare view URL in the format: "GitHub Compare View <commit1>...<commit2>"
  - List of possible root cause PRs. Ensure the PR numbers are linked to the actual PRs.
7. If no PRs seem to be the cause, suggest rerunning the failed tests and filing an issue on GitHub if the problem persists.

# Variables
- {{build}}: Provided by the user. If the build is provided as a github url, decode the build URL from it.
- {{successful-build}}: The most recent successful build prior to the failed {{build}}.
- {{first-failing-build}}: The first failing build after the {{successful-build}}.

## Guidelines
- Include links to relevant PRs, commits, and builds in your output.
- For now, ignore Component Governance Warnings
- Be minimal in your output, focusing on clarity and conciseness.

## Warning Message
<message>
**⚠️ Known Issues with Build Champion Agent ⚠️**
This agent should be used in parallel while investigating build failures, as it has some known issues:
1. **Double check the error discovered by the agent:** The agent often confuses missing `.build/logs` as an infrastructure issue. This is incorrect, as the missing logs are typically caused by test or build failures.
2. **Pay attention to the build numbers discovered by the agent:** The agent sometimes incorrectly finds the previous successful build.
3. **Double check the list of PRs:** The agent sometimes fails to list all PRs merged between builds. Use the github compare link provided.

**Please update this prompt file as you discover ways it can be improved.**

---
</message>

## Known Scenarios

### Expired Approval Step
If a build appears to have an elapsed time of 30 days, this indicates this build was meant to be a release build, but no one approved the release. There is no action needed in this scenario.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/codenotify.prompt.md]---
Location: vscode-main/.github/prompts/codenotify.prompt.md

```markdown
---
agent: agent
tools: ['edit', 'search', 'runCommands', 'fetch', 'todos']
---

# Add My Contributions to CODENOTIFY

This prompt helps you add your code contributions to the `.github/CODENOTIFY` file based on git blame history.

## Instructions

**Before running this prompt, provide the following information:**

1. **Your GitHub handle:** (e.g., `@YOURHANDLE`)
2. **Alternative usernames in git blame:** (e.g., `Erich Gamma`, `ALIAS@microsoft.com`, or any other names/emails that might appear in git commits)

## What This Prompt Does

This prompt will:
1. Search through the repository's git blame history for files you've significantly contributed to
2. Analyze which files and directories have your contributions
3. **Follow the existing structure** in the `.github/CODENOTIFY` file, here are some examples:
   - `src/vs/base/common/**` → Add to **Base Utilities** section
   - `src/vs/base/browser/ui/**` → Add to **Base Widgets** section
   - `src/vs/base/parts/**` → Add to **Base Utilities** section
   - `src/vs/platform/**` → Add to **Platform** section
   - `src/bootstrap-*.ts`, `src/main.ts`, etc. → Add to **Bootstrap** section
   - `src/vs/code/**` → Add to **Electron Main** section
   - `src/vs/workbench/services/**` → Add to **Workbench Services** section
   - `src/vs/workbench/common/**`, `src/vs/workbench/browser/**` → Add to **Workbench Core** section
   - `src/vs/workbench/contrib/**` → Add to **Workbench Contributions** section
   - `src/vs/workbench/api/**` → Add to **Workbench API** section
   - `extensions/**` → Add to **Extensions** section
4. Add appropriate entries in the format:
   - Individual files: `path/to/file.ts @yourusername`
   - Directories: `path/to/directory/** @yourusername`
5. Place entries within existing sections, maintaining alphabetical or logical order
6. Create new sections only if contributions don't fit existing categories
7. Avoid duplicating existing entries

## Expected Output Format

Entries will be added to **existing sections** based on their path. For example:

```
# Base Utilities
src/vs/base/common/extpath.ts @bpasero
src/vs/base/common/oauth.ts @yourusername  # ← Your contribution added here
src/vs/base/parts/quickinput/** @yourusername  # ← Your contribution added here

# Platform
src/vs/platform/quickinput/** @yourusername  # ← Your contribution added here
src/vs/platform/secrets/** @yourusername  # ← Your contribution added here

# Workbench Services
src/vs/workbench/services/authentication/** @yourusername  # ← Your contribution added here

# Workbench Contributions
src/vs/workbench/contrib/authentication/** @yourusername  # ← Your contribution added here
src/vs/workbench/contrib/localization/** @yourusername  # ← Your contribution added here
```

If you have contributions that don't fit existing sections (e.g., `foo/bar/**`), new sections can be created at the end:

```
# Foo Bar
foo/bar/baz/** @yourusername
foo/bar/biz/** @yourusername
```

## Notes

- **CRITICAL**: Entries must be added to the appropriate existing section based on their path
- Respect the existing organizational structure of the CODENOTIFY file
- If you're already listed for certain files/directories, those won't be duplicated
- Use `**` wildcard for directories where you've touched multiple files
- Maintain alphabetical or logical order within each section

---

**Now, provide your GitHub handle and any alternative usernames found in git blame, and I'll help you update the CODENOTIFY file.**
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/component.prompt.md]---
Location: vscode-main/.github/prompts/component.prompt.md

```markdown
---
agent: agent
description: 'Help author a component specification for an agent.'
tools: ['edit', 'search', 'usages', 'vscodeAPI', 'fetch', 'extensions', 'todos']
---

<overview>
Your goal is to create a component overview in markdown given the context provided by the user. The overview should include a brief description of the component, its main features, an architectural diagram and layout of important code files and their relationships. The purpose of this overview is to enable a developer to attach it to a feature request and ensure the agent has enough context to make correct code changes without breaking functionality.
</overview>

<format>
# [Component Name] Overview

**Location**: `src/vs/[path/to/component]`
**Type**: [Service/Contribution/Extension/API/etc.]
**Layer (if applicable)**: [base/platform/editor/workbench/code/server]

## Purpose

Brief description of what this component does and why it exists.

## Scope
- What functionality is included
- What is explicitly out of scope
- Integration points with other components

## Architecture

### High-Level Design
[Architectural diagram or description of key patterns used]

### Key Classes & Interfaces
- **[ClassName]**: Brief description of responsibility
- **[InterfaceName]**: Purpose and main methods
- **[ServiceName]**: Service responsibilities

### Key Files
List all the key files and a brief description of their purpose:
- **`src/vs/[path/to/component]/[filename.ts]`**: [Purpose and main exports]
- **`src/vs/[path/to/component]/[service.ts]`**: [Service implementation details]
- **`src/vs/[path/to/component]/[contribution.ts]`**: [Workbench contributions]

## Development Guidelines

- Reserve a section for any specific development practices or patterns relevant to this component. These will be edited by a developer or agent as needed.

---
</format>

<instructions>
- **Create** a new overview file if one is not specified: `.components/[component-name].md`
- **Fill** each section with component-specific details
- **Gather** information from the attached context and use available tools if needed to complete your understanding
- **Ask** the user for clarification if you cannot fill out a section with accurate information
- **Use complete file paths** from repository root (e.g., `src/vs/workbench/services/example/browser/exampleService.ts`)
- **Keep** descriptions concise but comprehensive
- **Use file references** instead of code snippets when making references to code as otherwise the code may become outdated
</instructions>
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/doc-comments.prompt.md]---
Location: vscode-main/.github/prompts/doc-comments.prompt.md

```markdown
---
agent: agent
description: 'Update doc comments'
tools: ['edit', 'search', 'new', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runTests']
---
# Role

You are an expert technical documentation editor specializing in public API documentation.

## Instructions

Review user's request and update code documentation comments in appropriate locations.

## Guidelines

- **Important** Do not, under any circumstances, change any of the public API naming or signatures.
- **Important** Fetch and review relevant code context (i.e. implementation source code) before making changes or adding comments.
- **Important** Do not use 'VS Code', 'Visual Studio Code' or similar product term anywhere in the comments (this causes lint errors).
- Follow American English grammar, orthography, and punctuation.
- Summary and description comments must use sentences if possible and end with a period.
- Use {@link \<symbol\>} where possible **and reasonable** to refer to code symbols.
- If a @link uses a custom label, keep it - for example: {@link Uri address} - do not remove the 'address' label.
- Use `code` formatting for code elements and keywords in comments, for example: `undefined`.
- Limit the maximum line length of comments to 120 characters.

## Cleanup Mode

If the user instructed you to "clean up" doc comments (e.g. by passing in "cleanup" as their prompt),
it is **very important** that you limit your changes to only fixing grammar, punctuation, formatting, and spelling mistakes.
**YOU MUST NOT** add new or remove or expand existing comments in cleanup mode.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/find-duplicates.prompt.md]---
Location: vscode-main/.github/prompts/find-duplicates.prompt.md

```markdown
---
# NOTE: This prompt is intended for internal use only for now.
agent: Engineering
argument-hint: Provide a link or issue number to find duplicates for
description: Find duplicates for a VS Code GitHub issue
model: Claude Sonnet 4.5 (copilot)
tools:
  - execute/getTerminalOutput
  - execute/runInTerminal
  - github/*
  - agent/runSubagent
---

## Your Task
1. Use the GitHub MCP server to retrieve the prompt file https://github.com/microsoft/vscode-engineering/blob/main/.github/prompts/find-duplicates-gh-cli.prompt.md.
2. Follow those instructions PRECISELY to identify potential duplicate issues for a given issue number in the VS Code repository.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/find-issue.prompt.md]---
Location: vscode-main/.github/prompts/find-issue.prompt.md

```markdown
---
# ⚠️: Internal use only. To onboard, follow instructions at https://github.com/microsoft/vscode-engineering/blob/main/docs/gh-mcp-onboarding.md
agent: Engineering
model: Claude Sonnet 4.5 (copilot)
argument-hint: Describe your issue. Include relevant keywords or phrases.
description: Search for an existing VS Code GitHub issue
tools:
  - github/*
  - agent/runSubagent
---

## Your Task
1. Use the GitHub MCP server to retrieve the prompt file https://github.com/microsoft/vscode-engineering/blob/main/.github/prompts/find-issue.prompt.md.
2. Follow those instructions PRECISELY to find issues related to the issue description provided. Perform your search in the `vscode` repository.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/fixIssueNo.prompt.md]---
Location: vscode-main/.github/prompts/fixIssueNo.prompt.md

```markdown
---
agent: Plan
tools: ['runCommands', 'runTasks', 'runNotebooks', 'search', 'new', 'usages', 'vscodeAPI', 'problems', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'todos', 'runTests', 'github/get_issue', 'github/get_issue_comments', 'github/get_me', 'github/get_pull_request', 'github/get_pull_request_diff', 'github/get_pull_request_files']
---

The user has given you a Github issue number. Use the `get_issue` to retrieve its details. Understand the issue and propose a solution to solve it.

NEVER share any thinking process or status updates before you have your solution.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/implement.prompt.md]---
Location: vscode-main/.github/prompts/implement.prompt.md

```markdown
---
agent: agent
description: 'Implement the plan'
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runTests']
---
Please write a high quality, general purpose solution. Implement a solution that works correctly for all valid inputs, not just the test cases. Do not hard-code values or create solutions that only work for specific test inputs. Instead, implement the actual logic that solves the problem generally.

Focus on understanding the problem requirements and implementing the correct algorithm. Tests are there to verify correctness, not to define the solution. Provide a principled implementation that follows best practices and software design principles.

If the task is unreasonable or infeasible, or if any of the tests are incorrect, please tell the user. The solution should be robust, maintainable, and extendable.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/issue-grouping.prompt.md]---
Location: vscode-main/.github/prompts/issue-grouping.prompt.md

```markdown
---
agent: Engineering
model: Claude Sonnet 4.5 (copilot)
argument-hint: Give an assignee and or a label/labels. Issues with that assignee and label will be fetched and grouped.
description: Group similar issues.
tools:
  - github/search_issues
  - agent/runSubagent
  - edit/createFile
  - edit/editFiles
  - read/readFile
---

## Your Task
1. Use a subagent to:
  a. Using the GitHub MCP server, fetch only one page (50 per page) of the open issues for the given assignee and label in the `vscode` repository.
  b. After fetching a single page, look through the issues and see if there are are any good grouping categories.Output the categories as headers to a local file categorized-issues.md. Do NOT fetch more issue pages yet, make sure to write the categories to the file first.
2. Repeat step 1 (sequentially, don't parallelize) until all pages are fetched and categories are written to the file.
3. Use a subagent to Re-fetch only one page of the issues for the given assignee and label in the `vscode` repository. Write each issue into the categorized-issues.md file under the appropriate category header with a link and the number of upvotes. If an issue doesn't fit into any category, put it under an "Other" category.
4. Repeat step 3 (sequentially, don't parallelize) until all pages are fetched and all issues are written to the file.
5. Within each category, sort the issues by number of upvotes in descending order.
6. Show the categorized-issues.md file as the final output.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/micro-perf.prompt.md]---
Location: vscode-main/.github/prompts/micro-perf.prompt.md

```markdown
---
agent: agent
description: 'Optimize code performance'
tools: ['edit', 'search', 'new', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runTests']
---
# Role

You are an expert performance engineer.

## Instructions

Review the attached file and find all publicly exported class or functions.
Optimize performance of all exported definitions.
If the user provided explicit list of classes or functions to optimize, scope your work only to those definitions.

## Guidelines

1. Make sure to analyze usage and calling patterns for each function you optimize.
2. When you need to change a function or a class, add optimized version of it immediately below the existing definition instead of changing the original.
3. Optimized function or class name should have the same name as original with '_new' suffix.
4. Create a file with '.<your-model-name>.perf.js' suffix with perf tests. For example if you are using model 'Foo' and optimizing file name utils.ts, you will create file named 'utils.foo.perf.js'.
5. **IMPORTANT**: You should use ESM format for the perf test files (i.e. use 'import' instead of 'require').
6. The perf tests should contain comprehensive perf tests covering identified scenarios and common cases, and comparing old and new implementations.
7. The results of perf tests and your summary should be placed in another file with '.<your-model-name>.perf.md' suffix, for example 'utils.foo.perf.md'.
8. The results file must include section per optimized definition with a table with comparison of old vs new implementations with speedup ratios and analysis of results.
9. At the end ask the user if they want to apply the changes and if the answer is yes, replace original implementations with optimized versions but only in cases where there are significant perf gains and no serious regressions. Revert any other changes to the original code.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/migrate.prompt.md]---
Location: vscode-main/.github/prompts/migrate.prompt.md

```markdown
---
agent: agent
tools:
  [
    "github/add_issue_comment",
    "github/get_label",
    "github/get_me",
    "github/issue_read",
    "github/issue_write",
    "github/search_issues",
    "github/search_pull_requests",
    "github/search_repositories",
    "github/sub_issue_write",
  ]
---

# Issue Migration Prompt

Use this prompt when migrating issues from one GitHub repository to another (e.g., from `microsoft/vscode-copilot` to `microsoft/vscode`).

## Input Methods

You can specify which issues to migrate using **any** of these three methods:

### Option A: GitHub Search Query URL

Provide a full GitHub issues search URL. **All matching issues will be migrated.**

```
https://github.com/microsoft/vscode-copilot/issues?q=is%3Aissue+is%3Aopen+assignee%3Ayoyokrazy
```

### Option B: GitHub Search Query Parameters

Provide search query syntax for a specific repo. **All matching issues will be migrated.**

```
repo:microsoft/vscode-copilot is:issue is:open assignee:yoyokrazy
```

Common query filters:

- `is:issue` / `is:pr` - Filter by type
- `is:open` / `is:closed` - Filter by state
- `assignee:USERNAME` - Filter by assignee
- `author:USERNAME` - Filter by author
- `label:LABEL` - Filter by label
- `milestone:MILESTONE` - Filter by milestone

### Option C: Specific Issue URL

Provide a direct link to a single issue. **Only this issue will be migrated.**

```
https://github.com/microsoft/vscode-copilot/issues/12345
```

## Task

**Target Repository:** `{TARGET_REPO}`

Based on the input provided, migrate the issue(s) to the target repository following all requirements below.

## Requirements

### 1. Issue Body Format

Create the new issue with this header format:

```markdown
_Transferred from {SOURCE_REPO}#{ORIGINAL_ISSUE_NUMBER}_
_Original author: `@{ORIGINAL_AUTHOR}`_

---

{ORIGINAL_ISSUE_BODY}
```

### 2. Comment Migration

For each comment on the original issue, add a comment to the new issue:

```markdown
_`@{COMMENT_AUTHOR}` commented:_

---

{COMMENT_BODY}
```

### 3. CRITICAL: Preventing GitHub Pings

**ALL `@username` mentions MUST be wrapped in backticks to prevent GitHub from sending notifications.**

✅ Correct: `` `@username` ``
❌ Wrong: `@username`

This applies to:

- The "Original author" line in the issue body
- Any `@mentions` within the issue body content
- The comment author attribution line
- Any `@mentions` within comment content
- Any quoted content that contains `@mentions`

### 4. CRITICAL: Issue/PR Link Reformatting

**Issue references like `#12345` are REPO-SPECIFIC.** If you copy `#12345` from the source repo to the target repo, it will incorrectly link to issue 12345 in the _target_ repo instead of the source.

**Convert ALL `#NUMBER` references to full URLs:**

✅ Correct: `https://github.com/microsoft/vscode-copilot/issues/12345`
✅ Also OK: `microsoft/vscode-copilot#12345`
❌ Wrong: `#12345` (will link to wrong repo)

This applies to:

- Issue references in the body (`#12345` → full URL)
- PR references in the body (`#12345` → full URL)
- References in comments
- References in quoted content
- References in image alt text or links

**Exception:** References that are _already_ full URLs should be left unchanged.

### 5. Metadata Preservation

- Copy all applicable labels to the new issue
- Assign the new issue to the same assignees (if they exist in target repo)
- Preserve the issue title exactly

### 5. Post-Migration

After creating the new issue and all comments:

- Add a comment to the **original** issue linking to the new issue:
  ```markdown
  Migrated to {TARGET_REPO}#{NEW_ISSUE_NUMBER}
  ```
- Close the original issue as not_planned

## Example Transformation

### Original Issue Body (in `microsoft/vscode-copilot`):

```markdown
I noticed @johndoe had a similar issue in #9999. cc @janedoe for visibility.

Related to #8888 and microsoft/vscode#12345.

Steps to reproduce:

1. Open VS Code
2. ...
```

### Migrated Issue Body (in `microsoft/vscode`):

```markdown
_Transferred from microsoft/vscode-copilot#12345_
_Original author: `@originalauthor`_

---

I noticed `@johndoe` had a similar issue in https://github.com/microsoft/vscode-copilot/issues/9999. cc `@janedoe` for visibility.

Related to https://github.com/microsoft/vscode-copilot/issues/8888 and microsoft/vscode#12345.

Steps to reproduce:

1. Open VS Code
2. ...
```

Note: The `microsoft/vscode#12345` reference was already a cross-repo link, so it stays unchanged.

## Checklist Before Migration

- [ ] Confirm input method (query URL, query params, or specific issue URL)
- [ ] Confirm target repository
- [ ] If using query: verify the query returns the expected issues
- [ ] Verify all `@mentions` are wrapped in backticks
- [ ] Verify all `#NUMBER` references are converted to full URLs
- [ ] Decide whether to close original issues after migration
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/no-any.prompt.md]---
Location: vscode-main/.github/prompts/no-any.prompt.md

```markdown
---
agent: agent
description: 'Remove any usage of the any type in TypeScript files'
---

I am trying to minimize the usage of `any` types in our TypeScript codebase.
Find usages of the TypeScript `any` type in this file and replace it with the right type based on usages in the file.

You are NOT allowed to disable ESLint rules or add `// @ts-ignore` comments to the code.
You are NOT allowed to add more `any` types to the code even if you think it is necessary or they are legitimate.

If there are tests associated to the changes you made, please run those tests to ensure everything is working correctly
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/plan-deep.prompt.md]---
Location: vscode-main/.github/prompts/plan-deep.prompt.md

```markdown
---
agent: Plan
description: Clarify before planning in more detail
---
Before doing your research workflow, gather preliminary context using #runSubagent (instructed to use max 5 tool calls) to get a high-level overview.

Then ask 3 clarifying questions and PAUSE for the user to answer them.

AFTER the user has answered, start the <workflow>. Add extra details to your planning draft.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/plan-fast.prompt.md]---
Location: vscode-main/.github/prompts/plan-fast.prompt.md

```markdown
---
agent: Plan
description: Iterate quicker on simple tasks
---
Planning for faster iteration: Research as usual, but draft a much more shorter implementation plan that focused on just the main steps
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/plan.prompt.md]---
Location: vscode-main/.github/prompts/plan.prompt.md

```markdown
---
agent: Plan
description: 'Start planning'
---
Start planning.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/setup-environment.prompt.md]---
Location: vscode-main/.github/prompts/setup-environment.prompt.md

```markdown
---
agent: agent
description: First Time Setup
tools: ['runCommands', 'runTasks/runTask', 'search', 'todos', 'fetch']
---

# Role
You are my setup automation assistant. Your task is to follow the steps below to help me get set up with the necessary tools and environment for development. Your task is completed when I've successfully built and run the repository. Use a TODO to track progress.

# Steps
1. Find setup instructions in README.md and CONTRIBUTING.md at the root of the repository. Fetch any other documentation they recommend.

2. Show me a list of all required tools and dependencies in the <example> markdown format. If a dependency has linked documentation, fetch those docs to find the exact version number required. Remember that link and that version for step 4. Do not display system requirements.
<example>
## 🛠️ Required Tools
- **Node.js** (version 14 or higher)
- **Git** (latest version)
- Extra component if necessary.
</example>

3. Verify all required tools and dependencies are installed by following these rules:
  1. For all tools that should exist on the PATH, check their versions. <example> `toolA --version; toolB --version; [...] toolZ --version` </example>
  2. For tools not traditionally on the PATH:
    1. Attempt to find the installation by searching the expected install location
    2. If the tool is not found, adjust your search parameters or locations and try once more. Consider if the tool is installed with a package manager.
    3. If the second location fails, mark it as missing.

4. Display a summary of what I have and what I need to install. In the <example> markdown format. If a section is empty, omit it.

<example>
## Installation Summary

### ✅ Already Installed
- Node.js (version 16.13.0) ⚠️ Note: You have X version but this project specifies Y.

### ❌ Not Installed
- ❌ Git (need version 2.30 or higher)
  - [Link to downloads page]

### ❓ Unable to Verify
- ToolName - [Reason why it couldn't be verified]
  - [Manual verification instructions steps]
</example>

5. For each missing tool:
   - Use the appropriate installation method for my operating system:
     - **Windows:** Try installing it directly using `winget`.
       - Example: `winget install --id Git.Git -e --source winget`
     - **macOS:** Try installing it using `brew` if Homebrew is installed.
       - Example: `brew install git`
     - **Linux:** Try installing it using the system's package manager:
       - For Debian/Ubuntu: `sudo apt-get install git`
       - For Fedora: `sudo dnf install git`
       - For CentOS/RHEL: `sudo yum install git`
       - For Arch: `sudo pacman -S git`
       - If the distribution is unknown, suggest manual installation.
   - You MUST install the required versions found in step 2.
   - For tools that may be managed by version managers (like `Node.js`), try installing them using the version manager if installed.
   - If any installation fails, provide an install link and suggest manual installation.
   - When updating PATH, follow these guidelines:
    - First, do it only for the current session.
    - Once installation is verified, add it permanently to the PATH.
    - Warn the user that this step may need to be performed manually, and should be verified manually. Provide simple steps to do so.
    - If a restart may be required, remind the user.

6. If any tools were installed, show an installation summary. Otherwise, skip this step.
7. Provide steps on building the repository, and then perform those steps.
8. If the repository is an application:
  - Provide steps on running the application
  - Try to run the application via a launch configuration if it exists, otherwise try running it yourself.
9. Show me a recap of what was newly installed.
10. Finally, update the README.md or CONTRIBUTING.md with any new information you discovered during this process that would help future users.

# Guidelines

- Instead of displaying commands to run, execute them directly.
- Output in markdown for human readability.
- Skip optional tooling.
- Keep all responses specific to my operating system.
- IMPORTANT: Documentation may be out of date. Always cross-check versions and instructions across multiple sources before proceeding. Update relevant files to the latest information as needed.
- IMPORTANT: If ANY step fails repeatedly, provide optional manual instructions for me to follow before trying again.
- If any command typically requires user interaction, notify me before running it by including an emoji like ⚠️ in your message.
```

--------------------------------------------------------------------------------

---[FILE: .github/prompts/update-instructions.prompt.md]---
Location: vscode-main/.github/prompts/update-instructions.prompt.md

```markdown
---
agent: agent
---

Read the changes introduced on the current branch, including BOTH:

1. Uncommitted workspace modifications (staged and unstaged)
2. Committed changes that are on the current HEAD but not yet in the default upstream branch (e.g. `origin/main`)

Guidance:

- First, capture uncommitted diffs (equivalent of `git diff` and `git diff --cached`).
- Then, determine the merge base with the default branch (assume `origin/main` unless configured otherwise) using `git merge-base HEAD origin/main` and diff (`git diff <merge-base>...HEAD`) to include committed-but-unpushed work.

After understanding all of these changes, read every instruction file under `.github/instructions` and assess whether any instruction is invalidated. If so, propose minimal, necessary wording updates. If no updates are needed, respond exactly with: `No updates needed`.

Be concise and conservative: only suggest changes that are absolutely necessary.
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/check-clean-git-state.sh]---
Location: vscode-main/.github/workflows/check-clean-git-state.sh

```bash
R=`git status --porcelain | wc -l`
if [ "$R" -ne "0" ]; then
  echo "The git repo is not clean after compiling the /build/ folder. Did you forget to commit .js output for .ts files?";
  git status --porcelain
  exit 1;
fi
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/copilot-setup-steps.yml]---
Location: vscode-main/.github/workflows/copilot-setup-steps.yml

```yaml
name: "Copilot Setup Steps"

# Automatically run the setup steps when they are changed to allow for easy validation, and
# allow manual testing through the repository's "Actions" tab
on:
  workflow_dispatch:
  push:
    paths:
      - .github/workflows/copilot-setup-steps.yml
  pull_request:
    paths:
      - .github/workflows/copilot-setup-steps.yml

jobs:
  # The job MUST be called `copilot-setup-steps` or it will not be picked up by Copilot.
  copilot-setup-steps:
    runs-on: vscode-large-runners

    # Set the permissions to the lowest permissions possible needed for your steps.
    # Copilot will be given its own token for its operations.
    permissions:
      # If you want to clone the repository as part of your setup steps, for example to install dependencies, you'll need the `contents: read` permission. If you don't clone the repository in your setup steps, Copilot will do this for you automatically after the steps complete.
      contents: read

    # You can define any steps you want, and they will run before the agent starts.
    # If you do not check out your code, Copilot will do this for you.
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Setup system services
        run: |
          set -e
          # Start X server
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get update
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get install -y pkg-config \
            xvfb \
            libgtk-3-0 \
            libxkbfile-dev \
            libkrb5-dev \
            libgbm1 \
            rpm
          sudo cp build/azure-pipelines/linux/xvfb.init /etc/init.d/xvfb
          sudo chmod +x /etc/init.d/xvfb
          sudo update-rc.d xvfb defaults
          sudo service xvfb start

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts linux x64 $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache/restore@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-linux-${{ hashFiles('.build/packagelockhash') }}"

      - name: Extract node_modules cache
        if: steps.cache-node-modules.outputs.cache-hit == 'true'
        run: tar -xzf .build/node_modules_cache/cache.tgz

      - name: Install build dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        working-directory: build
        run: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e

          source ./build/azure-pipelines/linux/setup-env.sh

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: x64
          VSCODE_ARCH: x64
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

      - name: Create .build folder
        run: mkdir -p .build

      - name: Prepare built-in extensions cache key
        run: node build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts > .build/builtindepshash

      - name: Restore built-in extensions cache
        id: cache-builtin-extensions
        uses: actions/cache/restore@v5
        with:
          enableCrossOsArchive: true
          path: .build/builtInExtensions
          key: "builtin-extensions-${{ hashFiles('.build/builtindepshash') }}"

      - name: Download built-in extensions
        if: steps.cache-builtin-extensions.outputs.cache-hit != 'true'
        run: node build/lib/builtInExtensions.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # - name: Transpile client and extensions
      #   run: npm run gulp transpile-client-esbuild transpile-extensions

      - name: Download Electron and Playwright
        run: |
          set -e

          for i in {1..3}; do # try 3 times (matching retryCountOnTaskFailure: 3)
            if npm exec -- npm-run-all -lp "electron x64" "playwright-install"; then
              echo "Download successful on attempt $i"
              break
            fi

            if [ $i -eq 3 ]; then
              echo "Download failed after 3 attempts" >&2
              exit 1
            fi

            echo "Download failed on attempt $i, retrying..."
            sleep 5 # optional: add a small delay between retries
          done
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # - name: 🧪 Run unit tests (Electron)
      #   if: ${{ inputs.electron_tests }}
      #   timeout-minutes: 15
      #   run: ./scripts/test.sh --tfs "Unit Tests"
      #   env:
      #     DISPLAY: ":10"

      # - name: 🧪 Run unit tests (node.js)
      #   if: ${{ inputs.electron_tests }}
      #   timeout-minutes: 15
      #   run: npm run test-node

      # - name: 🧪 Run unit tests (Browser, Chromium)
      #   if: ${{ inputs.browser_tests }}
      #   timeout-minutes: 30
      #   run: npm run test-browser-no-install -- --browser chromium --tfs "Browser Unit Tests"
      #   env:
      #     DEBUG: "*browser*"

      # - name: Build integration tests
      #   run: |
      #     set -e
      #     npm run gulp \
      #       compile-extension:configuration-editing \
      #       compile-extension:css-language-features-server \
      #       compile-extension:emmet \
      #       compile-extension:git \
      #       compile-extension:github-authentication \
      #       compile-extension:html-language-features-server \
      #       compile-extension:ipynb \
      #       compile-extension:notebook-renderers \
      #       compile-extension:json-language-features-server \
      #       compile-extension:markdown-language-features \
      #       compile-extension-media \
      #       compile-extension:microsoft-authentication \
      #       compile-extension:typescript-language-features \
      #       compile-extension:vscode-api-tests \
      #       compile-extension:vscode-colorize-tests \
      #       compile-extension:vscode-colorize-perf-tests \
      #       compile-extension:vscode-test-resolver

      # - name: 🧪 Run integration tests (Electron)
      #   if: ${{ inputs.electron_tests }}
      #   timeout-minutes: 20
      #   run: ./scripts/test-integration.sh --tfs "Integration Tests"
      #   env:
      #     DISPLAY: ":10"

      # - name: 🧪 Run integration tests (Browser, Chromium)
      #   if: ${{ inputs.browser_tests }}
      #   timeout-minutes: 20
      #   run: ./scripts/test-web-integration.sh --browser chromium

      # - name: 🧪 Run integration tests (Remote)
      #   if: ${{ inputs.remote_tests }}
      #   timeout-minutes: 20
      #   run: ./scripts/test-remote-integration.sh
      #   env:
      #     DISPLAY: ":10"

      # - name: Compile smoke tests
      #   working-directory: test/smoke
      #   run: npm run compile

      # - name: Compile extensions for smoke tests
      #   run: npm run gulp compile-extension-media

      # - name: Diagnostics before smoke test run (processes, max_user_watches, number of opened file handles)
      #   run: |
      #     set -e
      #     ps -ef
      #     cat /proc/sys/fs/inotify/max_user_watches
      #     lsof | wc -l
      #   continue-on-error: true
      #   if: always()

      # - name: 🧪 Run smoke tests (Electron)
      #   if: ${{ inputs.electron_tests }}
      #   timeout-minutes: 20
      #   run: npm run smoketest-no-compile -- --tracing
      #   env:
      #     DISPLAY: ":10"

      # - name: 🧪 Run smoke tests (Browser, Chromium)
      #   if: ${{ inputs.browser_tests }}
      #   timeout-minutes: 20
      #   run: npm run smoketest-no-compile -- --web --tracing --headless

      # - name: 🧪 Run smoke tests (Remote)
      #   if: ${{ inputs.remote_tests }}
      #   timeout-minutes: 20
      #   run: npm run smoketest-no-compile -- --remote --tracing
      #   env:
      #     DISPLAY: ":10"

      # - name: Diagnostics after smoke test run (processes, max_user_watches, number of opened file handles)
      #   run: |
      #     set -e
      #     ps -ef
      #     cat /proc/sys/fs/inotify/max_user_watches
      #     lsof | wc -l
      #   continue-on-error: true
      #   if: always()
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/monaco-editor.yml]---
Location: vscode-main/.github/workflows/monaco-editor.yml

```yaml
name: Monaco Editor checks

on:
  push:
    branches:
      - main
      - release/*
  pull_request:
    branches:
      - main
      - release/*
permissions: {}

jobs:
  main:
    name: Monaco Editor checks
    runs-on: ubuntu-latest
    timeout-minutes: 40
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Compute node modules cache key
        id: nodeModulesCacheKey
        run: echo "value=$(node build/azure-pipelines/common/computeNodeModulesCacheKey.ts)" >> $GITHUB_OUTPUT
      - name: Cache node modules
        id: cacheNodeModules
        uses: actions/cache@v5
        with:
          path: "**/node_modules"
          key: ${{ runner.os }}-cacheNodeModules20-${{ steps.nodeModulesCacheKey.outputs.value }}
          restore-keys: ${{ runner.os }}-cacheNodeModules20-
      - name: Get npm cache directory path
        id: npmCacheDirPath
        if: ${{ steps.cacheNodeModules.outputs.cache-hit != 'true' }}
        run: echo "dir=$(npm config get cache)" >> $GITHUB_OUTPUT
      - name: Cache npm directory
        if: ${{ steps.cacheNodeModules.outputs.cache-hit != 'true' }}
        uses: actions/cache@v5
        with:
          path: ${{ steps.npmCacheDirPath.outputs.dir }}
          key: ${{ runner.os }}-npmCacheDir-${{ steps.nodeModulesCacheKey.outputs.value }}
          restore-keys: ${{ runner.os }}-npmCacheDir-
      - name: Install system dependencies
        if: ${{ steps.cacheNodeModules.outputs.cache-hit != 'true' }}
        run: |
          sudo apt update
          sudo apt install -y libxkbfile-dev pkg-config libkrb5-dev libxss1
      - name: Execute npm
        if: ${{ steps.cacheNodeModules.outputs.cache-hit != 'true' }}
        env:
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
        run: |
          npm ci

      - name: Download Playwright
        run: npm run playwright-install

      - name: Run Monaco Editor Checks
        run: npm run monaco-compile-check

      - name: Editor Distro & ESM
        run: npm run gulp editor-distro

      - name: Editor ESM sources check
        working-directory: ./test/monaco
        run: npm run esm-check

      - name: Typings validation prep
        run: |
          mkdir typings-test

      - name: Typings validation
        working-directory: ./typings-test
        run: |
          npm init -yp
          ../node_modules/.bin/tsc --init
          echo "import '../out-monaco-editor-core';" > a.ts
          ../node_modules/.bin/tsc --noEmit

      - name: Package Editor with Webpack
        working-directory: ./test/monaco
        run: npm run bundle-webpack

      - name: Compile Editor Tests
        working-directory: ./test/monaco
        run: npm run compile

      - name: Run Editor Tests
        timeout-minutes: 5
        working-directory: ./test/monaco
        run: npm run test
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/no-engineering-system-changes.yml]---
Location: vscode-main/.github/workflows/no-engineering-system-changes.yml

```yaml
name: Prevent engineering system changes in PRs

on: pull_request
permissions: {}

jobs:
  main:
    name: Prevent engineering system changes in PRs
    runs-on: ubuntu-latest
    steps:
      - name: Get file changes
        uses: trilom/file-changes-action@a6ca26c14274c33b15e6499323aac178af06ad4b # v1.2.4
        id: file_changes
      - name: Check if engineering systems were modified
        id: engineering_systems_check
        run: |
          if cat $HOME/files.json | jq -e 'any(test("^\\.github\\/workflows\\/|^build\\/|package\\.json$"))' > /dev/null; then
            echo "engineering_systems_modified=true" >> $GITHUB_OUTPUT
            echo "Engineering systems were modified in this PR"
          else
            echo "engineering_systems_modified=false" >> $GITHUB_OUTPUT
            echo "No engineering systems were modified in this PR"
          fi
      - name: Prevent Copilot from modifying engineering systems
        if: ${{ steps.engineering_systems_check.outputs.engineering_systems_modified == 'true' && github.event.pull_request.user.login == 'Copilot' }}
        run: |
          echo "Copilot is not allowed to modify .github/workflows, build folder files, or package.json files."
          echo "If you need to update engineering systems, please do so manually or through authorized means."
          exit 1
      - uses: octokit/request-action@dad4362715b7fb2ddedf9772c8670824af564f0d # v2.4.0
        id: get_permissions
        if: ${{ steps.engineering_systems_check.outputs.engineering_systems_modified == 'true' && github.event.pull_request.user.login != 'Copilot' }}
        with:
          route: GET /repos/microsoft/vscode/collaborators/${{ github.event.pull_request.user.login }}/permission
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Set control output variable
        id: control
        if: ${{ steps.engineering_systems_check.outputs.engineering_systems_modified == 'true' && github.event.pull_request.user.login != 'Copilot' }}
        run: |
          echo "user: ${{ github.event.pull_request.user.login }}"
          echo "role: ${{ fromJson(steps.get_permissions.outputs.data).permission }}"
          echo "is dependabot: ${{ github.event.pull_request.user.login == 'dependabot[bot]' }}"
          echo "should_run: ${{ !contains(fromJson('["admin", "maintain", "write"]'), fromJson(steps.get_permissions.outputs.data).permission) }}"
          echo "should_run=${{ !contains(fromJson('["admin", "maintain", "write"]'), fromJson(steps.get_permissions.outputs.data).permission) && github.event.pull_request.user.login != 'dependabot[bot]' }}" >> $GITHUB_OUTPUT
      - name: Check for engineering system changes
        if: ${{ steps.engineering_systems_check.outputs.engineering_systems_modified == 'true' && steps.control.outputs.should_run == 'true' }}
        run: |
          echo "Changes to .github/workflows/, build/ folder files, or package.json files aren't allowed in PRs."
          exit 1
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/no-package-lock-changes.yml]---
Location: vscode-main/.github/workflows/no-package-lock-changes.yml

```yaml
name: Prevent package-lock.json changes in PRs

on: pull_request
permissions: {}

jobs:
  main:
    name: Prevent package-lock.json changes in PRs
    runs-on: ubuntu-latest
    steps:
      - name: Get file changes
        uses: trilom/file-changes-action@ce38c8ce2459ca3c303415eec8cb0409857b4272
        id: file_changes
      - name: Check if lockfiles were modified
        id: lockfile_check
        run: |
          if cat $HOME/files.json | jq -e 'any(test("package-lock\\.json$|Cargo\\.lock$"))' > /dev/null; then
            echo "lockfiles_modified=true" >> $GITHUB_OUTPUT
            echo "Lockfiles were modified in this PR"
          else
            echo "lockfiles_modified=false" >> $GITHUB_OUTPUT
            echo "No lockfiles were modified in this PR"
          fi
      - name: Prevent Copilot from modifying lockfiles
        if: ${{ steps.lockfile_check.outputs.lockfiles_modified == 'true' && github.event.pull_request.user.login == 'Copilot' }}
        run: |
          echo "Copilot is not allowed to modify package-lock.json or Cargo.lock files."
          echo "If you need to update dependencies, please do so manually or through authorized means."
          exit 1
      - uses: octokit/request-action@dad4362715b7fb2ddedf9772c8670824af564f0d # v2.4.0
        id: get_permissions
        if: ${{ steps.lockfile_check.outputs.lockfiles_modified == 'true' && github.event.pull_request.user.login != 'Copilot' }}
        with:
          route: GET /repos/microsoft/vscode/collaborators/{username}/permission
          username: ${{ github.event.pull_request.user.login }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Set control output variable
        id: control
        if: ${{ steps.lockfile_check.outputs.lockfiles_modified == 'true' && github.event.pull_request.user.login != 'Copilot' }}
        run: |
          echo "user: ${{ github.event.pull_request.user.login }}"
          echo "role: ${{ fromJson(steps.get_permissions.outputs.data).permission }}"
          echo "is dependabot: ${{ github.event.pull_request.user.login == 'dependabot[bot]' }}"
          echo "should_run: ${{ !contains(fromJson('["admin", "maintain", "write"]'), fromJson(steps.get_permissions.outputs.data).permission) }}"
          echo "should_run=${{ !contains(fromJson('["admin", "maintain", "write"]'), fromJson(steps.get_permissions.outputs.data).permission) && github.event.pull_request.user.login != 'dependabot[bot]' }}" >> $GITHUB_OUTPUT
      - name: Check for lockfile changes
        if: ${{ steps.lockfile_check.outputs.lockfiles_modified == 'true' && steps.control.outputs.should_run == 'true' }}
        run: |
          echo "Changes to package-lock.json/Cargo.lock files aren't allowed in PRs."
          exit 1
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/pr-darwin-test.yml]---
Location: vscode-main/.github/workflows/pr-darwin-test.yml

```yaml
on:
  workflow_call:
    inputs:
      job_name:
        type: string
        required: true
      electron_tests:
        type: boolean
        default: false
      browser_tests:
        type: boolean
        default: false
      remote_tests:
        type: boolean
        default: false

jobs:
  macOS-test:
    name: ${{ inputs.job_name }}
    runs-on: macos-14-xlarge
    env:
      ARTIFACT_NAME: ${{ (inputs.electron_tests && 'electron') || (inputs.browser_tests && 'browser') || (inputs.remote_tests && 'remote') || 'unknown' }}
      NPM_ARCH: arm64
      VSCODE_ARCH: arm64
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts darwin $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache/restore@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-macos-${{ hashFiles('.build/packagelockhash') }}"

      - name: Extract node_modules cache
        if: steps.cache-node-modules.outputs.cache-hit == 'true'
        run: tar -xzf .build/node_modules_cache/cache.tgz

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          c++ --version
          xcode-select -print-path
          python3 -m pip install --break-system-packages setuptools

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: ${{ env.NPM_ARCH }}
          VSCODE_ARCH: ${{ env.VSCODE_ARCH }}
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # Avoid using dlopen to load Kerberos on macOS which can cause missing libraries
          # https://github.com/mongodb-js/kerberos/commit/04044d2814ad1d01e77f1ce87f26b03d86692cf2
          # flipped the default to support legacy linux distros which shouldn't happen
          # on macOS.
          GYP_DEFINES: "kerberos_use_rtld=false"

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

      - name: Create .build folder
        run: mkdir -p .build

      - name: Prepare built-in extensions cache key
        run: node build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts > .build/builtindepshash

      - name: Restore built-in extensions cache
        id: cache-builtin-extensions
        uses: actions/cache/restore@v5
        with:
          enableCrossOsArchive: true
          path: .build/builtInExtensions
          key: "builtin-extensions-${{ hashFiles('.build/builtindepshash') }}"

      - name: Download built-in extensions
        if: steps.cache-builtin-extensions.outputs.cache-hit != 'true'
        run: node build/lib/builtInExtensions.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Transpile client and extensions
        run: npm run gulp transpile-client-esbuild transpile-extensions

      - name: Download Electron and Playwright
        run: |
          set -e

          for i in {1..3}; do # try 3 times (matching retryCountOnTaskFailure: 3)
            if npm exec -- npm-run-all -lp "electron ${{ env.VSCODE_ARCH }}" "playwright-install"; then
              echo "Download successful on attempt $i"
              break
            fi

            if [ $i -eq 3 ]; then
              echo "Download failed after 3 attempts" >&2
              exit 1
            fi

            echo "Download failed on attempt $i, retrying..."
            sleep 5 # optional: add a small delay between retries
          done
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: 🧪 Run unit tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 15
        run: ./scripts/test.sh --tfs "Unit Tests"

      - name: 🧪 Run unit tests (node.js)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 15
        run: npm run test-node

      - name: 🧪 Run unit tests (Browser, Webkit)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 30
        run: npm run test-browser-no-install -- --browser webkit --tfs "Browser Unit Tests"
        env:
          DEBUG: "*browser*"

      - name: Build integration tests
        run: |
          set -e
          npm run gulp \
            compile-extension:configuration-editing \
            compile-extension:css-language-features-server \
            compile-extension:emmet \
            compile-extension:git \
            compile-extension:github-authentication \
            compile-extension:html-language-features-server \
            compile-extension:ipynb \
            compile-extension:notebook-renderers \
            compile-extension:json-language-features-server \
            compile-extension:markdown-language-features \
            compile-extension-media \
            compile-extension:microsoft-authentication \
            compile-extension:typescript-language-features \
            compile-extension:vscode-api-tests \
            compile-extension:vscode-colorize-tests \
            compile-extension:vscode-colorize-perf-tests \
            compile-extension:vscode-test-resolver

      - name: 🧪 Run integration tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 20
        run: ./scripts/test-integration.sh --tfs "Integration Tests"

      - name: 🧪 Run integration tests (Browser, Webkit)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 20
        run: ./scripts/test-web-integration.sh --browser webkit

      - name: 🧪 Run integration tests (Remote)
        if: ${{ inputs.remote_tests }}
        timeout-minutes: 20
        run: ./scripts/test-remote-integration.sh

      - name: Compile smoke tests
        working-directory: test/smoke
        run: npm run compile

      - name: Compile extensions for smoke tests
        run: npm run gulp compile-extension-media

      - name: Diagnostics before smoke test run
        run: ps -ef
        continue-on-error: true
        if: always()

      - name: 🧪 Run smoke tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 20
        run: npm run smoketest-no-compile -- --tracing

      - name: 🧪 Run smoke tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 20
        run: npm run smoketest-no-compile -- --web --tracing --headless

      - name: 🧪 Run smoke tests (Remote)
        if: ${{ inputs.remote_tests }}
        timeout-minutes: 20
        run: npm run smoketest-no-compile -- --remote --tracing

      - name: Diagnostics after smoke test run
        run: ps -ef
        continue-on-error: true
        if: always()

      - name: Publish Crash Reports
        uses: actions/upload-artifact@v6
        if: failure()
        continue-on-error: true
        with:
          name: ${{ format('crash-dump-macos-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: .build/crashes
          if-no-files-found: ignore

      # In order to properly symbolify above crash reports
      # (if any), we need the compiled native modules too
      - name: Publish Node Modules
        uses: actions/upload-artifact@v6
        if: failure()
        continue-on-error: true
        with:
          name: ${{ format('node-modules-macos-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: node_modules
          if-no-files-found: ignore

      - name: Publish Log Files
        uses: actions/upload-artifact@v6
        if: always()
        continue-on-error: true
        with:
          name: ${{ format('logs-macos-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: .build/logs
          if-no-files-found: ignore
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/pr-linux-cli-test.yml]---
Location: vscode-main/.github/workflows/pr-linux-cli-test.yml

```yaml
on:
  workflow_call:
    inputs:
      job_name:
        type: string
        required: true
      rustup_toolchain:
        type: string
        required: true

jobs:
  linux-cli-test:
    name: ${{ inputs.job_name }}
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-ubuntu-22.04-x64 ]
    env:
      RUSTUP_TOOLCHAIN: ${{ inputs.rustup_toolchain }}
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Install Rust
        run: |
          set -e
          curl https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal --default-toolchain $RUSTUP_TOOLCHAIN
          echo "$HOME/.cargo/bin" >> $GITHUB_PATH

      - name: Set Rust version
        run: |
          set -e
          rustup default $RUSTUP_TOOLCHAIN
          rustup update $RUSTUP_TOOLCHAIN
          rustup component add clippy

      - name: Check Rust versions
        run: |
          set -e
          rustc --version
          cargo --version

      - name: Clippy lint
        run: cargo clippy -- -D warnings
        working-directory: cli

      - name: 🧪 Run unit tests
        run: cargo test
        working-directory: cli
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/pr-linux-test.yml]---
Location: vscode-main/.github/workflows/pr-linux-test.yml

```yaml
on:
  workflow_call:
    inputs:
      job_name:
        type: string
        required: true
      electron_tests:
        type: boolean
        default: false
      browser_tests:
        type: boolean
        default: false
      remote_tests:
        type: boolean
        default: false

jobs:
  linux-test:
    name: ${{ inputs.job_name }}
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-ubuntu-22.04-x64 ]
    env:
      ARTIFACT_NAME: ${{ (inputs.electron_tests && 'electron') || (inputs.browser_tests && 'browser') || (inputs.remote_tests && 'remote') || 'unknown' }}
      NPM_ARCH: x64
      VSCODE_ARCH: x64
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Setup system services
        run: |
          set -e
          # Start X server
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get update
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get install -y pkg-config \
            xvfb \
            libgtk-3-0 \
            libxkbfile-dev \
            libkrb5-dev \
            libgbm1 \
            rpm
          sudo cp build/azure-pipelines/linux/xvfb.init /etc/init.d/xvfb
          sudo chmod +x /etc/init.d/xvfb
          sudo update-rc.d xvfb defaults
          sudo service xvfb start

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts linux $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache/restore@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-linux-${{ hashFiles('.build/packagelockhash') }}"

      - name: Extract node_modules cache
        if: steps.cache-node-modules.outputs.cache-hit == 'true'
        run: tar -xzf .build/node_modules_cache/cache.tgz

      - name: Install build dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        working-directory: build
        run: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e

          source ./build/azure-pipelines/linux/setup-env.sh

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: ${{ env.NPM_ARCH }}
          VSCODE_ARCH: ${{ env.VSCODE_ARCH }}
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

      - name: Create .build folder
        run: mkdir -p .build

      - name: Prepare built-in extensions cache key
        run: node build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts > .build/builtindepshash

      - name: Restore built-in extensions cache
        id: cache-builtin-extensions
        uses: actions/cache/restore@v5
        with:
          enableCrossOsArchive: true
          path: .build/builtInExtensions
          key: "builtin-extensions-${{ hashFiles('.build/builtindepshash') }}"

      - name: Download built-in extensions
        if: steps.cache-builtin-extensions.outputs.cache-hit != 'true'
        run: node build/lib/builtInExtensions.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Transpile client and extensions
        run: npm run gulp transpile-client-esbuild transpile-extensions

      - name: Download Electron and Playwright
        run: |
          set -e

          for i in {1..3}; do # try 3 times (matching retryCountOnTaskFailure: 3)
            if npm exec -- npm-run-all -lp "electron ${{ env.VSCODE_ARCH }}" "playwright-install"; then
              echo "Download successful on attempt $i"
              break
            fi

            if [ $i -eq 3 ]; then
              echo "Download failed after 3 attempts" >&2
              exit 1
            fi

            echo "Download failed on attempt $i, retrying..."
            sleep 5 # optional: add a small delay between retries
          done
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: 🧪 Run unit tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 15
        run: ./scripts/test.sh --tfs "Unit Tests"
        env:
          DISPLAY: ":10"

      - name: 🧪 Run unit tests (node.js)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 15
        run: npm run test-node

      - name: 🧪 Run unit tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 30
        run: npm run test-browser-no-install -- --browser chromium --tfs "Browser Unit Tests"
        env:
          DEBUG: "*browser*"

      - name: Build integration tests
        run: |
          set -e
          npm run gulp \
            compile-extension:configuration-editing \
            compile-extension:css-language-features-server \
            compile-extension:emmet \
            compile-extension:git \
            compile-extension:github-authentication \
            compile-extension:html-language-features-server \
            compile-extension:ipynb \
            compile-extension:notebook-renderers \
            compile-extension:json-language-features-server \
            compile-extension:markdown-language-features \
            compile-extension-media \
            compile-extension:microsoft-authentication \
            compile-extension:typescript-language-features \
            compile-extension:vscode-api-tests \
            compile-extension:vscode-colorize-tests \
            compile-extension:vscode-colorize-perf-tests \
            compile-extension:vscode-test-resolver

      - name: 🧪 Run integration tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 20
        run: ./scripts/test-integration.sh --tfs "Integration Tests"
        env:
          DISPLAY: ":10"

      - name: 🧪 Run integration tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 20
        run: ./scripts/test-web-integration.sh --browser chromium

      - name: 🧪 Run integration tests (Remote)
        if: ${{ inputs.remote_tests }}
        timeout-minutes: 20
        run: ./scripts/test-remote-integration.sh
        env:
          DISPLAY: ":10"

      - name: Compile smoke tests
        working-directory: test/smoke
        run: npm run compile

      - name: Compile extensions for smoke tests
        run: npm run gulp compile-extension-media

      - name: Diagnostics before smoke test run (processes, max_user_watches, number of opened file handles)
        run: |
          set -e
          ps -ef
          cat /proc/sys/fs/inotify/max_user_watches
          lsof | wc -l
        continue-on-error: true
        if: always()

      - name: 🧪 Run smoke tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 20
        run: npm run smoketest-no-compile -- --tracing
        env:
          DISPLAY: ":10"

      - name: 🧪 Run smoke tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 20
        run: npm run smoketest-no-compile -- --web --tracing --headless

      - name: 🧪 Run smoke tests (Remote)
        if: ${{ inputs.remote_tests }}
        timeout-minutes: 20
        run: npm run smoketest-no-compile -- --remote --tracing
        env:
          DISPLAY: ":10"

      - name: Diagnostics after smoke test run (processes, max_user_watches, number of opened file handles)
        run: |
          set -e
          ps -ef
          cat /proc/sys/fs/inotify/max_user_watches
          lsof | wc -l
        continue-on-error: true
        if: always()

      - name: Publish Crash Reports
        uses: actions/upload-artifact@v6
        if: failure()
        continue-on-error: true
        with:
          name: ${{ format('crash-dump-linux-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: .build/crashes
          if-no-files-found: ignore

      # In order to properly symbolify above crash reports
      # (if any), we need the compiled native modules too
      - name: Publish Node Modules
        uses: actions/upload-artifact@v6
        if: failure()
        continue-on-error: true
        with:
          name: ${{ format('node-modules-linux-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: node_modules
          if-no-files-found: ignore

      - name: Publish Log Files
        uses: actions/upload-artifact@v6
        if: always()
        continue-on-error: true
        with:
          name: ${{ format('logs-linux-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: .build/logs
          if-no-files-found: ignore
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/pr-node-modules.yml]---
Location: vscode-main/.github/workflows/pr-node-modules.yml

```yaml
name: Code OSS (node_modules)

on:
  push:
    branches:
      - main

permissions: {}

jobs:
  compile:
    name: Compile
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-ubuntu-22.04-x64 ]
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts compile $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-compile-${{ hashFiles('.build/packagelockhash') }}"

      - name: Extract node_modules cache
        if: steps.cache-node-modules.outputs.cache-hit == 'true'
        run: tar -xzf .build/node_modules_cache/cache.tgz

      - name: Install build tools
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: sudo apt update -y && sudo apt install -y build-essential pkg-config libx11-dev libx11-xcb-dev libxkbfile-dev libnotify-bin libkrb5-dev

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.VSCODE_OSS }}

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

      - name: Prepare built-in extensions cache key
        run: |
          set -e
          mkdir -p .build
          node build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts > .build/builtindepshash

      - name: Restore built-in extensions cache
        id: cache-builtin-extensions
        uses: actions/cache@v5
        with:
          enableCrossOsArchive: true
          path: .build/builtInExtensions
          key: "builtin-extensions-${{ hashFiles('.build/builtindepshash') }}"

      - name: Download built-in extensions
        if: steps.cache-builtin-extensions.outputs.cache-hit != 'true'
        run: node build/lib/builtInExtensions.ts
        env:
          GITHUB_TOKEN: ${{ secrets.VSCODE_OSS }}

  linux:
    name: Linux
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-ubuntu-22.04-x64 ]
    env:
      NPM_ARCH: x64
      VSCODE_ARCH: x64
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts linux $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-linux-${{ hashFiles('.build/packagelockhash') }}"

      - name: Install build dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        working-directory: build
        run: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          GITHUB_TOKEN: ${{ secrets.VSCODE_OSS }}

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e

          source ./build/azure-pipelines/linux/setup-env.sh

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: ${{ env.NPM_ARCH }}
          VSCODE_ARCH: ${{ env.VSCODE_ARCH }}
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.VSCODE_OSS }}

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

  macOS:
    name: macOS
    runs-on: macos-14-xlarge
    env:
      NPM_ARCH: arm64
      VSCODE_ARCH: arm64
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts darwin $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-macos-${{ hashFiles('.build/packagelockhash') }}"

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          c++ --version
          xcode-select -print-path
          python3 -m pip install --break-system-packages setuptools

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: ${{ env.NPM_ARCH }}
          VSCODE_ARCH: ${{ env.VSCODE_ARCH }}
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.VSCODE_OSS }}
          # Avoid using dlopen to load Kerberos on macOS which can cause missing libraries
          # https://github.com/mongodb-js/kerberos/commit/04044d2814ad1d01e77f1ce87f26b03d86692cf2
          # flipped the default to support legacy linux distros which shouldn't happen
          # on macOS.
          GYP_DEFINES: "kerberos_use_rtld=false"

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

  windows:
    name: Windows
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-windows-2022-x64 ]
    env:
      NPM_ARCH: x64
      VSCODE_ARCH: x64
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        shell: pwsh
        run: |
          mkdir .build -ea 0
          node build/azure-pipelines/common/computeNodeModulesCacheKey.ts win32 ${{ env.VSCODE_ARCH }} $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        uses: actions/cache@v5
        id: node-modules-cache
        with:
          path: .build/node_modules_cache
          key: "node_modules-windows-${{ hashFiles('.build/packagelockhash') }}"

      - name: Install dependencies
        if: steps.node-modules-cache.outputs.cache-hit != 'true'
        shell: pwsh
        run: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"

          for ($i = 1; $i -le 5; $i++) {
            try {
              exec { npm ci }
              break
            }
            catch {
              if ($i -eq 5) {
                Write-Error "npm ci failed after 5 attempts"
                throw
              }
              Write-Host "npm ci failed attempt $i, retrying..."
              Start-Sleep -Seconds 2
            }
          }
        env:
          npm_config_arch: ${{ env.NPM_ARCH }}
          npm_config_foreground_scripts: "true"
          VSCODE_ARCH: ${{ env.VSCODE_ARCH }}
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.VSCODE_OSS }}

      - name: Create node_modules archive
        if: steps.node-modules-cache.outputs.cache-hit != 'true'
        shell: pwsh
        run: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          exec { node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt }
          exec { mkdir -Force .build/node_modules_cache }
          exec { 7z.exe a .build/node_modules_cache/cache.7z -mx3 `@.build/node_modules_list.txt }
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/pr-win32-test.yml]---
Location: vscode-main/.github/workflows/pr-win32-test.yml

```yaml
on:
  workflow_call:
    inputs:
      job_name:
        type: string
        required: true
      electron_tests:
        type: boolean
        default: false
      browser_tests:
        type: boolean
        default: false
      remote_tests:
        type: boolean
        default: false

jobs:
  windows-test:
    name: ${{ inputs.job_name }}
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-windows-2022-x64 ]
    env:
      ARTIFACT_NAME: ${{ (inputs.electron_tests && 'electron') || (inputs.browser_tests && 'browser') || (inputs.remote_tests && 'remote') || 'unknown' }}
      NPM_ARCH: x64
      VSCODE_ARCH: x64
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        shell: pwsh
        run: |
          mkdir .build -ea 0
          node build/azure-pipelines/common/computeNodeModulesCacheKey.ts win32 ${{ env.VSCODE_ARCH }} $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        uses: actions/cache/restore@v5
        id: node-modules-cache
        with:
          path: .build/node_modules_cache
          key: "node_modules-windows-${{ hashFiles('.build/packagelockhash') }}"

      - name: Extract node_modules cache
        if: steps.node-modules-cache.outputs.cache-hit == 'true'
        shell: pwsh
        run: 7z.exe x .build/node_modules_cache/cache.7z -aoa

      - name: Install dependencies
        if: steps.node-modules-cache.outputs.cache-hit != 'true'
        shell: pwsh
        run: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"

          for ($i = 1; $i -le 5; $i++) {
            try {
              exec { npm ci }
              break
            }
            catch {
              if ($i -eq 5) {
                Write-Error "npm ci failed after 5 attempts"
                throw
              }
              Write-Host "npm ci failed attempt $i, retrying..."
              Start-Sleep -Seconds 2
            }
          }
        env:
          npm_config_arch: ${{ env.NPM_ARCH }}
          npm_config_foreground_scripts: "true"
          VSCODE_ARCH: ${{ env.VSCODE_ARCH }}
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create node_modules archive
        if: steps.node-modules-cache.outputs.cache-hit != 'true'
        shell: pwsh
        run: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          exec { node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt }
          exec { mkdir -Force .build/node_modules_cache }
          exec { 7z.exe a .build/node_modules_cache/cache.7z -mx3 `@.build/node_modules_list.txt }

      - name: Create .build folder
        shell: pwsh
        run: mkdir .build -ea 0

      - name: Prepare built-in extensions cache key
        shell: pwsh
        run: node build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts > .build/builtindepshash

      - name: Restore built-in extensions cache
        id: cache-builtin-extensions
        uses: actions/cache/restore@v5
        with:
          enableCrossOsArchive: true
          path: .build/builtInExtensions
          key: "builtin-extensions-${{ hashFiles('.build/builtindepshash') }}"

      - name: Download built-in extensions
        if: steps.cache-builtin-extensions.outputs.cache-hit != 'true'
        run: node build/lib/builtInExtensions.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Transpile client and extensions
        shell: pwsh
        run: npm run gulp "transpile-client-esbuild" "transpile-extensions"

      - name: Download Electron and Playwright
        shell: pwsh
        run: |
          for ($i = 1; $i -le 3; $i++) {
            try {
              npm exec -- npm-run-all -lp "electron ${{ env.VSCODE_ARCH }}" "playwright-install"
              break
            }
            catch {
              if ($i -eq 3) {
                Write-Error "Download failed after 3 attempts"
                throw
              }
              Write-Host "Download failed attempt $i, retrying..."
              Start-Sleep -Seconds 2
            }
          }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: 🧪 Run unit tests (Electron)
        if: ${{ inputs.electron_tests }}
        shell: pwsh
        run: .\scripts\test.bat --tfs "Unit Tests"
        timeout-minutes: 15

      - name: 🧪 Run unit tests (node.js)
        if: ${{ inputs.electron_tests }}
        shell: pwsh
        run: npm run test-node
        timeout-minutes: 15

      - name: 🧪 Run unit tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        shell: pwsh
        run: node test/unit/browser/index.js --browser chromium --tfs "Browser Unit Tests"
        env:
          DEBUG: "*browser*"
        timeout-minutes: 20

      - name: Build integration tests
        shell: pwsh
        run: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          exec { npm run gulp `
            compile-extension:configuration-editing `
            compile-extension:css-language-features-server `
            compile-extension:emmet `
            compile-extension:git `
            compile-extension:github-authentication `
            compile-extension:html-language-features-server `
            compile-extension:ipynb `
            compile-extension:notebook-renderers `
            compile-extension:json-language-features-server `
            compile-extension:markdown-language-features `
            compile-extension-media `
            compile-extension:microsoft-authentication `
            compile-extension:typescript-language-features `
            compile-extension:vscode-api-tests `
            compile-extension:vscode-colorize-tests `
            compile-extension:vscode-colorize-perf-tests `
            compile-extension:vscode-test-resolver `
          }

      - name: Diagnostics before integration test runs
        shell: pwsh
        run: .\build\azure-pipelines\win32\listprocesses.bat
        continue-on-error: true
        if: always()

      - name: 🧪 Run integration tests (Electron)
        if: ${{ inputs.electron_tests }}
        shell: pwsh
        run: .\scripts\test-integration.bat --tfs "Integration Tests"
        timeout-minutes: 20

      - name: 🧪 Run integration tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        shell: pwsh
        run: .\scripts\test-web-integration.bat --browser chromium
        timeout-minutes: 20

      - name: 🧪 Run integration tests (Remote)
        if: ${{ inputs.remote_tests }}
        shell: pwsh
        run: .\scripts\test-remote-integration.bat
        timeout-minutes: 20

      - name: Diagnostics after integration test runs
        shell: pwsh
        run: .\build\azure-pipelines\win32\listprocesses.bat
        continue-on-error: true
        if: always()

      - name: Diagnostics before smoke test run
        shell: pwsh
        run: .\build\azure-pipelines\win32\listprocesses.bat
        continue-on-error: true
        if: always()

      - name: Compile smoke tests
        working-directory: test/smoke
        shell: pwsh
        run: npm run compile

      - name: Compile extensions for smoke tests
        shell: pwsh
        run: npm run gulp compile-extension-media

      - name: 🧪 Run smoke tests (Electron)
        if: ${{ inputs.electron_tests }}
        timeout-minutes: 20
        shell: pwsh
        run: npm run smoketest-no-compile -- --tracing

      - name: 🧪 Run smoke tests (Browser, Chromium)
        if: ${{ inputs.browser_tests }}
        timeout-minutes: 20
        shell: pwsh
        run: npm run smoketest-no-compile -- --web --tracing --headless

      - name: 🧪 Run smoke tests (Remote)
        if: ${{ inputs.remote_tests }}
        timeout-minutes: 20
        shell: pwsh
        run: npm run smoketest-no-compile -- --remote --tracing

      - name: Diagnostics after smoke test run
        shell: pwsh
        run: .\build\azure-pipelines\win32\listprocesses.bat
        continue-on-error: true
        if: always()

      - name: Publish Crash Reports
        uses: actions/upload-artifact@v6
        if: failure()
        continue-on-error: true
        with:
          name: ${{ format('crash-dump-windows-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: .build/crashes
          if-no-files-found: ignore

      # In order to properly symbolify above crash reports
      # (if any), we need the compiled native modules too
      - name: Publish Node Modules
        uses: actions/upload-artifact@v6
        if: failure()
        continue-on-error: true
        with:
          name: ${{ format('node-modules-windows-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: node_modules
          if-no-files-found: ignore

      - name: Publish Log Files
        uses: actions/upload-artifact@v6
        if: always()
        continue-on-error: true
        with:
          name: ${{ format('logs-windows-{0}-{1}-{2}', env.VSCODE_ARCH, env.ARTIFACT_NAME, github.run_attempt) }}
          path: .build/logs
          if-no-files-found: ignore
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/pr.yml]---
Location: vscode-main/.github/workflows/pr.yml

```yaml
name: Code OSS

on:
  pull_request:
    branches:
      - main
      - 'release/*'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions: {}

env:
  VSCODE_QUALITY: 'oss'

jobs:
  compile:
    name: Compile & Hygiene
    runs-on: [ self-hosted, 1ES.Pool=1es-vscode-oss-ubuntu-22.04-x64 ]
    steps:
      - name: Checkout microsoft/vscode
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc

      - name: Prepare node_modules cache key
        run: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts compile $(node -p process.arch) > .build/packagelockhash

      - name: Restore node_modules cache
        id: cache-node-modules
        uses: actions/cache/restore@v5
        with:
          path: .build/node_modules_cache
          key: "node_modules-compile-${{ hashFiles('.build/packagelockhash') }}"

      - name: Extract node_modules cache
        if: steps.cache-node-modules.outputs.cache-hit == 'true'
        run: tar -xzf .build/node_modules_cache/cache.tgz

      - name: Install build tools
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: sudo apt update -y && sudo apt install -y build-essential pkg-config libx11-dev libx11-xcb-dev libxkbfile-dev libnotify-bin libkrb5-dev

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create node_modules archive
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt

      - name: Type check /build/ scripts
        run: npm run typecheck
        working-directory: build

      - name: Compile & Hygiene
        run: npm exec -- npm-run-all -lp core-ci extensions-ci hygiene eslint valid-layers-check define-class-fields-check vscode-dts-compile-check tsec-compile-check test-build-scripts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  linux-cli-tests:
    name: Linux
    uses: ./.github/workflows/pr-linux-cli-test.yml
    with:
      job_name: CLI
      rustup_toolchain: 1.85

  linux-electron-tests:
    name: Linux
    uses: ./.github/workflows/pr-linux-test.yml
    with:
      job_name: Electron
      electron_tests: true

  linux-browser-tests:
    name: Linux
    uses: ./.github/workflows/pr-linux-test.yml
    with:
      job_name: Browser
      browser_tests: true

  linux-remote-tests:
    name: Linux
    uses: ./.github/workflows/pr-linux-test.yml
    with:
      job_name: Remote
      remote_tests: true

  macos-electron-tests:
    name: macOS
    uses: ./.github/workflows/pr-darwin-test.yml
    with:
      job_name: Electron
      electron_tests: true

  macos-browser-tests:
    name: macOS
    uses: ./.github/workflows/pr-darwin-test.yml
    with:
      job_name: Browser
      browser_tests: true

  macos-remote-tests:
    name: macOS
    uses: ./.github/workflows/pr-darwin-test.yml
    with:
      job_name: Remote
      remote_tests: true

  windows-electron-tests:
    name: Windows
    uses: ./.github/workflows/pr-win32-test.yml
    with:
      job_name: Electron
      electron_tests: true

  windows-browser-tests:
    name: Windows
    uses: ./.github/workflows/pr-win32-test.yml
    with:
      job_name: Browser
      browser_tests: true

  windows-remote-tests:
    name: Windows
    uses: ./.github/workflows/pr-win32-test.yml
    with:
      job_name: Remote
      remote_tests: true
```

--------------------------------------------------------------------------------

---[FILE: .github/workflows/telemetry.yml]---
Location: vscode-main/.github/workflows/telemetry.yml

```yaml
name: 'Telemetry'
on: pull_request
permissions: {}
jobs:
  check-metadata:
    name: 'Check metadata'
    runs-on: 'ubuntu-latest'

    steps:
      - uses: 'actions/checkout@v6'
        with:
          persist-credentials: false

      - uses: 'actions/setup-node@v6'
        with:
          node-version: 'lts/*'

      - name: 'Run vscode-telemetry-extractor'
        run: 'npx --package=@vscode/telemetry-extractor@1.14.0 --yes vscode-telemetry-extractor -s .'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/cglicenses.schema.json]---
Location: vscode-main/.vscode/cglicenses.schema.json

```json
{
	"type": "array",
	"items": {
		"oneOf": [
			{
				"type": "object",
				"required": [
					"name",
					"prependLicenseText"
				],
				"properties": {
					"name": {
						"type": "string",
						"description": "The name of the dependency"
					},
					"fullLicenseText": {
						"type": "array",
						"description": "The complete license text of the dependency",
						"items": {
							"type": "string"
						}
					},
					"prependLicenseText": {
						"type": "array",
						"description": "A piece of text to prepend to the auto-detected license text of the dependency",
						"items": {
							"type": "string"
						}
					}
				}
			},
			{
				"type": "object",
				"required": [
					"name",
					"fullLicenseText"
				],
				"properties": {
					"name": {
						"type": "string",
						"description": "The name of the dependency"
					},
					"fullLicenseText": {
						"type": "array",
						"description": "The complete license text of the dependency",
						"items": {
							"type": "string"
						}
					},
					"prependLicenseText": {
						"type": "array",
						"description": "A piece of text to prepend to the auto-detected license text of the dependency",
						"items": {
							"type": "string"
						}
					}
				}
			},
			{
				"type": "object",
				"required": [
					"name",
					"fullLicenseTextUri"
				],
				"properties": {
					"name": {
						"type": "string",
						"description": "The name of the dependency"
					},
					"fullLicenseTextUri": {
						"type": "string",
						"description": "The URI to the license text of this repository",
						"format": "uri"
					},
					"prependLicenseText": {
						"type": "array",
						"description": "A piece of text to prepend to the auto-detected license text of the dependency",
						"items": {
							"type": "string"
						}
					}
				}
			}
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions.json]---
Location: vscode-main/.vscode/extensions.json

```json
{
	// See https://go.microsoft.com/fwlink/?LinkId=827846
	// for the documentation about the extensions.json format
	"recommendations": [
		"dbaeumer.vscode-eslint",
		"editorconfig.editorconfig",
		"github.vscode-pull-request-github",
		"ms-vscode.vscode-github-issue-notebooks",
		"ms-vscode.extension-test-runner",
		"jrieken.vscode-pr-pinger",
		"typescriptteam.native-preview",
		"ms-vscode.ts-customized-language-service"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/launch.json]---
Location: vscode-main/.vscode/launch.json

```json
{
	"version": "0.1.0",
	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "Gulp Build",
			"program": "${workspaceFolder}/node_modules/gulp/bin/gulp.js",
			"stopOnEntry": true,
			"args": [
				"hygiene"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"restart": true,
			"name": "Attach to Extension Host",
			"timeout": 0,
			"port": 5870,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js",
				"${workspaceFolder}/extensions/*/out/**/*.js"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"restart": true,
			"name": "Attach to Shared Process",
			"timeout": 0,
			"port": 5879,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"name": "Attach to Search Process",
			"port": 5876,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"name": "Attach to Pty Host Process",
			"port": 5877,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"name": "Attach to CLI Process",
			"port": 5874,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"name": "Attach to Main Process",
			"timeout": 30000,
			"port": 5875,
			"continueOnAttach": true,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"hidden": true,
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code Emmet Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/emmet/test-workspace",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/emmet",
				"--extensionTestsPath=${workspaceFolder}/extensions/emmet/out/test"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 6
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code Configuration Editing Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/configuration-editing",
				"--extensionTestsPath=${workspaceFolder}/extensions/configuration-editing/out/test"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 6
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code Git Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"/tmp/my4g9l",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/git",
				"--extensionTestsPath=${workspaceFolder}/extensions/git/out/test"
			],
			"outFiles": [
				"${workspaceFolder}/extensions/git/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 6
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code Github Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/github/testWorkspace",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/github",
				"--extensionTestsPath=${workspaceFolder}/extensions/github/out/test"
			],
			"outFiles": [
				"${workspaceFolder}/extensions/github/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 6
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code API Tests (single folder)",
			"runtimeExecutable": "${execPath}",
			"args": [
				// "${workspaceFolder}", // Uncomment for running out of sources.
				"${workspaceFolder}/extensions/vscode-api-tests/testWorkspace",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/vscode-api-tests",
				"--extensionTestsPath=${workspaceFolder}/extensions/vscode-api-tests/out/singlefolder-tests",
				"--disable-extensions"
			],
			"outFiles": [
				"${workspaceFolder}/extensions/vscode-api-tests/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 3
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code API Tests (workspace)",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/vscode-api-tests/testworkspace.code-workspace",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/vscode-api-tests",
				"--extensionTestsPath=${workspaceFolder}/extensions/vscode-api-tests/out/workspace-tests"
			],
			"outFiles": [
				"${workspaceFolder}/extensions/vscode-api-tests/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 4
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code Tokenizer Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/vscode-colorize-tests/test",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/vscode-colorize-tests",
				"--extensionTestsPath=${workspaceFolder}/extensions/vscode-colorize-tests/out"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 5
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "VS Code Tokenizer Performance Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/vscode-colorize-perf-tests/test",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/vscode-colorize-perf-tests",
				"--extensionTestsPath=${workspaceFolder}/extensions/vscode-colorize-perf-tests/out"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 6
			}
		},
		{
			"type": "chrome",
			"request": "attach",
			"name": "Attach to VS Code",
			"browserAttachLocation": "workspace",
			"port": 9222,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"resolveSourceMapLocations": [
				"${workspaceFolder}/out/**/*.js"
			],
			"perScriptSourcemaps": "yes"
		},
		{
			"type": "chrome",
			"request": "launch",
			"name": "Launch VS Code Internal",
			"windows": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.bat"
			},
			"osx": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.sh"
			},
			"linux": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.sh"
			},
			"port": 9222,
			"timeout": 0,
			"env": {
				"VSCODE_EXTHOST_WILL_SEND_SOCKET": null,
				"VSCODE_SKIP_PRELAUNCH": "1",
				"VSCODE_DEV_DEBUG_OBSERVABLES": "1",
			},
			"cleanUp": "wholeBrowser",
			"killBehavior": "polite",
			"runtimeArgs": [
				"--inspect-brk=5875",
				"--no-cached-data",
				"--crash-reporter-directory=${workspaceFolder}/.profile-oss/crashes",
				// for general runtime freezes: https://github.com/microsoft/vscode/issues/127861#issuecomment-904144910
				"--disable-features=CalculateNativeWinOcclusion",
				"--disable-extension=vscode.vscode-api-tests"
			],
			"userDataDir": "${userHome}/.vscode-oss-dev",
			"webRoot": "${workspaceFolder}",
			"cascadeTerminateToConfigurations": [
				"Attach to Extension Host"
			],
			"pauseForSourceMap": false,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"browserLaunchLocation": "workspace",
			"presentation": {
				"hidden": true,
			},
		},
		{
			// To debug observables you also need the extension "ms-vscode.debug-value-editor"
			"type": "chrome",
			"request": "launch",
			"name": "Launch VS Code Internal (Hot Reload)",
			"windows": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.bat"
			},
			"osx": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.sh"
			},
			"linux": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.sh"
			},
			"port": 9222,
			"timeout": 0,
			"env": {
				"VSCODE_EXTHOST_WILL_SEND_SOCKET": null,
				"VSCODE_SKIP_PRELAUNCH": "1",
				"VSCODE_DEV_DEBUG": "1",
				"VSCODE_DEV_SERVER_URL": "http://localhost:5199/build/vite/workbench-vite-electron.html",
				"DEV_WINDOW_SRC": "http://localhost:5199/build/vite/workbench-vite-electron.html",
				"VSCODE_DEV_DEBUG_OBSERVABLES": "1",
				"VSCODE_DEV": "1"
			},
			"cleanUp": "wholeBrowser",
			"runtimeArgs": [
				"--inspect-brk=5875",
				"--no-cached-data",
				"--crash-reporter-directory=${workspaceFolder}/.profile-oss/crashes",
				// for general runtime freezes: https://github.com/microsoft/vscode/issues/127861#issuecomment-904144910
				"--disable-features=CalculateNativeWinOcclusion",
				"--disable-extension=vscode.vscode-api-tests"
			],
			"userDataDir": "${userHome}/.vscode-oss-dev",
			"webRoot": "${workspaceFolder}",
			"cascadeTerminateToConfigurations": [
				"Attach to Extension Host"
			],
			"pauseForSourceMap": false,
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"browserLaunchLocation": "workspace",
			"presentation": {
				"hidden": true,
			},
			"preLaunchTask": "Launch Monaco Editor Vite"
		},
		{
			"type": "node",
			"request": "launch",
			"name": "VS Code Server (Web)",
			"runtimeExecutable": "${workspaceFolder}/scripts/code-server.sh",
			"windows": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code-server.bat",
			},
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"group": "0_vscode",
				"order": 2
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "Main Process",
			"attachSimplePort": 5875,
			"enableContentValidation": false,
			"runtimeExecutable": "${workspaceFolder}/scripts/code.sh",
			"windows": {
				"runtimeExecutable": "${workspaceFolder}/scripts/code.bat",
			},
			"runtimeArgs": [
				"--inspect-brk=5875",
				"--no-cached-data",
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"presentation": {
				"group": "1_vscode",
				"order": 1
			}
		},
		{
			"type": "chrome",
			"request": "launch",
			"outFiles": [],
			"perScriptSourcemaps": "yes",
			"name": "VS Code Server (Web, Chrome)",
			"url": "http://localhost:8080?tkn=dev-token",
			"preLaunchTask": "Run code server",
			"presentation": {
				"group": "0_vscode",
				"order": 3
			}
		},
		{
			"type": "msedge",
			"request": "launch",
			"outFiles": [],
			"perScriptSourcemaps": "yes",
			"name": "VS Code Server (Web, Edge)",
			"url": "http://localhost:8080?tkn=dev-token",
			"pauseForSourceMap": false,
			"preLaunchTask": "Run code server",
			"presentation": {
				"group": "0_vscode",
				"order": 3
			}
		},
		{
			"type": "chrome",
			"request": "launch",
			"outFiles": [],
			"perScriptSourcemaps": "yes",
			"name": "VS Code Web (Chrome)",
			"url": "http://localhost:8080",
			"preLaunchTask": "Run code web",
			"presentation": {
				"group": "0_vscode",
				"order": 3
			}
		},
		{
			"type": "msedge",
			"request": "launch",
			"outFiles": [],
			"perScriptSourcemaps": "yes",
			"name": "VS Code Web (Edge)",
			"url": "http://localhost:8080",
			"pauseForSourceMap": false,
			"preLaunchTask": "Run code web",
			"presentation": {
				"group": "0_vscode",
				"order": 3
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "Git Unit Tests",
			"program": "${workspaceFolder}/extensions/git/node_modules/mocha/bin/_mocha",
			"stopOnEntry": false,
			"cwd": "${workspaceFolder}/extensions/git",
			"outFiles": [
				"${workspaceFolder}/extensions/git/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 10
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "HTML Server Unit Tests",
			"program": "${workspaceFolder}/extensions/html-language-features/server/test/index.js",
			"stopOnEntry": false,
			"cwd": "${workspaceFolder}/extensions/html-language-features/server",
			"outFiles": [
				"${workspaceFolder}/extensions/html-language-features/server/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 10
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "CSS Server Unit Tests",
			"program": "${workspaceFolder}/extensions/css-language-features/server/test/index.js",
			"stopOnEntry": false,
			"cwd": "${workspaceFolder}/extensions/css-language-features/server",
			"outFiles": [
				"${workspaceFolder}/extensions/css-language-features/server/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 10
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "Markdown Extension Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/markdown-language-features/test-workspace",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/markdown-language-features",
				"--extensionTestsPath=${workspaceFolder}/extensions/markdown-language-features/out/test"
			],
			"outFiles": [
				"${workspaceFolder}/extensions/markdown-language-features/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 7
			}
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "TypeScript Extension Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"${workspaceFolder}/extensions/typescript-language-features/test-workspace",
				"--extensionDevelopmentPath=${workspaceFolder}/extensions/typescript-language-features",
				"--extensionTestsPath=${workspaceFolder}/extensions/typescript-language-features/out/test"
			],
			"outFiles": [
				"${workspaceFolder}/extensions/typescript-language-features/out/**/*.js"
			],
			"presentation": {
				"group": "5_tests",
				"order": 8
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "Run Unit Tests",
			"program": "${workspaceFolder}/test/unit/electron/index.js",
			"runtimeExecutable": "${workspaceFolder}/.build/electron/Code - OSS.app/Contents/MacOS/Electron",
			"windows": {
				"runtimeExecutable": "${workspaceFolder}/.build/electron/Code - OSS.exe"
			},
			"linux": {
				"runtimeExecutable": "${workspaceFolder}/.build/electron/code-oss"
			},
			"outputCapture": "std",
			"args": [
				"--remote-debugging-port=9222"
			],
			"cwd": "${workspaceFolder}",
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"cascadeTerminateToConfigurations": [
				"Attach to VS Code"
			],
			"env": {
				"MOCHA_COLORS": "true"
			},
			"presentation": {
				"hidden": true
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "Run Unit Tests For Current File",
			"program": "${workspaceFolder}/test/unit/electron/index.js",
			"runtimeExecutable": "${workspaceFolder}/.build/electron/Code - OSS.app/Contents/MacOS/Electron",
			"windows": {
				"runtimeExecutable": "${workspaceFolder}/.build/electron/Code - OSS.exe"
			},
			"linux": {
				"runtimeExecutable": "${workspaceFolder}/.build/electron/code-oss"
			},
			"cascadeTerminateToConfigurations": [
				"Attach to VS Code"
			],
			"outputCapture": "std",
			"args": [
				"--remote-debugging-port=9222",
				"--run",
				"${relativeFile}"
			],
			"cwd": "${workspaceFolder}",
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"env": {
				"MOCHA_COLORS": "true"
			},
			"presentation": {
				"hidden": true
			}
		},
		{
			"type": "node",
			"request": "launch",
			"name": "Launch Smoke Test",
			"program": "${workspaceFolder}/test/smoke/test/index.js",
			"cwd": "${workspaceFolder}/test/smoke",
			"timeout": 240000,
			"args": [
				"-l",
				"${workspaceFolder}/.build/electron/Code - OSS.app/Contents/MacOS/Electron"
			],
			"outFiles": [
				"${cwd}/out/**/*.js"
			],
			"env": {
				"NODE_ENV": "development",
				"VSCODE_DEV": "1",
				"VSCODE_CLI": "1"
			}
		},
		{
			"name": "Launch Built-in Extension",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceRoot}/extensions/debug-auto-launch"
			]
		},
		{
			"name": "Monaco Editor - Playground",
			"type": "chrome",
			"request": "launch",
			"url": "https://microsoft.github.io/monaco-editor/playground.html?source=http%3A%2F%2Flocalhost%3A5199%2Fbuild%2Fvite%2Findex.ts%3Fesm#example-creating-the-editor-hello-world",
			"preLaunchTask": "Launch Monaco Editor Vite",
			"presentation": {
				"group": "monaco",
				"order": 4
			}
		},
		{
			"name": "Monaco Editor - Self Contained Diff Editor",
			"type": "chrome",
			"request": "launch",
			"url": "http://localhost:5199/build/vite/index.html",
			"preLaunchTask": "Launch Monaco Editor Vite",
			"presentation": {
				"group": "monaco",
				"order": 4
			}
		},
		{
			"name": "Monaco Editor - Workbench",
			"type": "chrome",
			"request": "launch",
			"url": "http://localhost:5199/build/vite/workbench-vite.html",
			"preLaunchTask": "Launch Monaco Editor Vite",
			"presentation": {
				"group": "monaco",
				"order": 4
			}
		}
	],
	"compounds": [
		{
			"name": "VS Code",
			"stopAll": true,
			"configurations": [
				"Launch VS Code Internal",
				"Attach to Main Process",
				"Attach to Extension Host",
				"Attach to Shared Process",
			],
			"preLaunchTask": "Ensure Prelaunch Dependencies",
			"presentation": {
				"group": "0_vscode",
				"order": 1
			}
		},
		{
			"name": "VS Code (Hot Reload)",
			"stopAll": true,
			"configurations": [
				"Launch VS Code Internal (Hot Reload)",
				"Attach to Main Process",
				"Attach to Extension Host",
				"Attach to Shared Process",
			],
			"preLaunchTask": "Ensure Prelaunch Dependencies",
			"presentation": {
				"group": "0_vscode",
				"order": 1
			}
		},
		{
			"name": "Search, Renderer, and Main processes",
			"configurations": [
				"Launch VS Code Internal",
				"Attach to Main Process",
				"Attach to Search Process"
			],
			"presentation": {
				"group": "1_vscode",
				"order": 4
			}
		},
		{
			"name": "Renderer, Extension Host, and Main processes",
			"configurations": [
				"Launch VS Code Internal",
				"Attach to Main Process",
				"Attach to Extension Host"
			],
			"presentation": {
				"group": "1_vscode",
				"order": 3
			}
		},
		{
			"name": "Debug Unit Tests",
			"configurations": [
				"Attach to VS Code",
				"Run Unit Tests"
			],
			"presentation": {
				"group": "1_vscode",
				"order": 2
			}
		},
		{
			"name": "Debug Unit Tests (Current File)",
			"configurations": [
				"Attach to VS Code",
				"Run Unit Tests For Current File"
			],
			"presentation": {
				"group": "1_vscode",
				"order": 2
			}
		},
		{
			"name": "Renderer and Main processes",
			"stopAll": true,
			"configurations": [
				"Launch VS Code Internal",
				"Attach to Main Process"
			],
			"preLaunchTask": "Ensure Prelaunch Dependencies"
		},
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/mcp.json]---
Location: vscode-main/.vscode/mcp.json

```json
{
	"servers": {
		"vscode-playwright-mcp": {
			"type": "stdio",
			"command": "npm",
			// Look at the [README](../test/mcp/README.md) to see what arguments are supported
			"args": ["run", "start-stdio"],
			"cwd": "${workspaceFolder}/test/mcp"
		}
	},
	"inputs": []
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/settings.json]---
Location: vscode-main/.vscode/settings.json

```json
{
	// --- Chat ---
	"inlineChat.enableV2": true,
	"chat.tools.terminal.autoApprove": {
		"/^npm (test|lint|run compile)\\b/": true,
		"/^npx tsc\\b.*--noEmit/": true,
		"scripts/test.bat": true,
		"scripts/test.sh": true,
		"scripts/test-integration.bat": true,
		"scripts/test-integration.sh": true,
	},

	// --- Editor ---
	"editor.insertSpaces": false,
	"editor.experimental.asyncTokenization": true,
	"editor.experimental.asyncTokenizationVerification": true,
	"editor.occurrencesHighlightDelay": 0,
	// "editor.experimental.preferTreeSitter.typescript": true,
	// "editor.experimental.preferTreeSitter.regex": true,
	// "editor.experimental.preferTreeSitter.css": true,
	// --- Language Specific ---
	"[plaintext]": {
		"files.insertFinalNewline": false
	},
	"[typescript]": {
		"editor.defaultFormatter": "vscode.typescript-language-features",
		"editor.formatOnSave": true
	},
	"[javascript]": {
		"editor.defaultFormatter": "vscode.typescript-language-features",
		"editor.formatOnSave": true
	},
	"[rust]": {
		"editor.defaultFormatter": "rust-lang.rust-analyzer",
		"editor.formatOnSave": true,
	},
	"[github-issues]": {
		"editor.wordWrap": "on"
	},

	// --- Files ---
	"files.trimTrailingWhitespace": true,
	"files.insertFinalNewline": true,
	"files.exclude": {
		".git": true,
		".build": true,
		".profile-oss": true,
		"**/.DS_Store": true,
		".vscode-test": true,
		"cli/target": true,
		"build/**/*.js.map": true,
		"build/**/*.js": {
			"when": "$(basename).ts"
		}
	},
	"files.associations": {
		"cglicenses.json": "jsonc",
		"*.tst": "typescript"
	},
	"files.readonlyInclude": {
		"**/node_modules/**/*.*": true,
		"**/yarn.lock": true,
		"**/package-lock.json": true,
		"**/Cargo.lock": true,
		"out/**": true,
		"out-build/**": true,
		"out-vscode/**": true,
		"out-vscode-reh/**": true,
		"extensions/**/dist/**": true,
		"extensions/**/out/**": true,
		"extensions/terminal-suggest/src/completions/upstream/**": true,
		"test/smoke/out/**": true,
		"test/automation/out/**": true,
		"test/integration/browser/out/**": true
	},

	// --- Search ---
	"search.exclude": {
		"**/node_modules": true,
		"cli/target/**": true,
		".build/**": true,
		"out/**": true,
		"out-build/**": true,
		"out-vscode/**": true,
		"i18n/**": true,
		"extensions/**/dist/**": true,
		"extensions/**/out/**": true,
		"test/smoke/out/**": true,
		"test/automation/out/**": true,
		"test/integration/browser/out/**": true,
		"src/vs/base/test/common/filters.perf.data.js": true,
		"src/vs/base/test/node/uri.perf.data.txt": true,
		"src/vs/workbench/api/test/browser/extHostDocumentData.test.perf-data.ts": true,
		"src/vs/base/test/node/uri.test.data.txt": true,
		"src/vs/editor/test/node/diffing/fixtures/**": true,
		"build/loader.min": true,
		"**/*.snap": true,
	},

	// --- TypeScript ---
	"typescript.tsdk": "node_modules/typescript/lib",
	"typescript.preferences.importModuleSpecifier": "relative",
	"typescript.preferences.quoteStyle": "single",
	"typescript.tsc.autoDetect": "off",
	"typescript.preferences.autoImportFileExcludePatterns": [
		"@xterm/xterm",
		"@xterm/headless",
		"node-pty",
		"vscode-notebook-renderer",
		"src/vs/workbench/workbench.web.main.internal.ts"
	],

	// --- Languages ---
	"json.schemas": [
		{
			"fileMatch": [
				"cgmanifest.json"
			],
			"url": "https://www.schemastore.org/component-detection-manifest.json",
		},
		{
			"fileMatch": [
				"cglicenses.json"
			],
			"url": "./.vscode/cglicenses.schema.json"
		}
	],
	"css.format.spaceAroundSelectorSeparator": true,

	// --- Git ---
	"git.ignoreLimitWarning": true,
	"git.branchProtection": [
		"main",
		"main-*",
		"distro",
		"release/*"
	],
	"git.branchProtectionPrompt": "alwaysCommitToNewBranch",
	"git.branchRandomName.enable": true,
	"git.pullBeforeCheckout": true,
	"git.mergeEditor": true,
	"git.diagnosticsCommitHook.enabled": true,
	"git.diagnosticsCommitHook.sources": {
		"*": "error",
		"ts": "warning",
		"eslint": "warning"
	},

	// --- GitHub ---
	"githubPullRequests.experimental.createView": true,
	"githubPullRequests.assignCreated": "${user}",
	"githubPullRequests.defaultMergeMethod": "squash",
	"githubPullRequests.ignoredPullRequestBranches": [
		"main"
	],
	"githubPullRequests.codingAgent.enabled": true,
	"githubPullRequests.codingAgent.uiIntegration": true,

	// --- Testing & Debugging ---
	"testing.autoRun.mode": "rerun",
	"debug.javascript.terminalOptions": {
		"outFiles": [
			"${workspaceFolder}/out/**/*.js",
			"${workspaceFolder}/build/**/*.js"
		]
	},
	"extension-test-runner.debugOptions": {
		"outFiles": [
			"${workspaceFolder}/extensions/*/out/**/*.js",
		]
	},

	// --- Coverage ---
	"lcov.path": [
		"./.build/coverage/lcov.info",
		"./.build/coverage-single/lcov.info"
	],
	"lcov.watch": [
		{
			"pattern": "**/*.test.js",
			"command": "${workspaceFolder}/scripts/test.sh --coverage --run ${file}",
			"windows": {
				"command": "${workspaceFolder}\\scripts\\test.bat --coverage --run ${file}"
			}
		}
	],

	// --- Tools ---
	"npm.exclude": "**/extensions/**",
	"eslint.useFlatConfig": true,
	"emmet.excludeLanguages": [],
	"gulp.autoDetect": "off",
	"rust-analyzer.linkedProjects": [
		"cli/Cargo.toml"
	],
	"conventionalCommits.scopes": [
		"tree",
		"scm",
		"grid",
		"splitview",
		"table",
		"list",
		"git",
		"sash"
	],

	// --- Workbench ---
	// "application.experimental.rendererProfiling": true, // https://github.com/microsoft/vscode/issues/265654
	"editor.aiStats.enabled": true, // Team selfhosting on ai stats
	"azureMcp.enabledServices": [
		"kusto" // Needed for kusto tool in data.prompt.md
	],
	"azureMcp.serverMode": "all",
	"azureMcp.readOnly": true,
	"chat.tools.terminal.outputLocation": "none",
  "debug.breakpointsView.presentation": "tree"
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/shared.code-snippets]---
Location: vscode-main/.vscode/shared.code-snippets

```text
{
	// Each snippet is defined under a snippet name and has a scope, prefix, body and
	// description. The scope defines in watch languages the snippet is applicable. The prefix is what is
	// used to trigger the snippet and the body will be expanded and inserted.Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders.
	// Placeholders with the same ids are connected.
	// Example:
	"MSFT Copyright Header": {
		"scope": "javascript,typescript,css,rust",
		"prefix": [
			"header",
			"stub",
			"copyright"
		],
		"body": [
			"/*---------------------------------------------------------------------------------------------",
			" *  Copyright (c) Microsoft Corporation. All rights reserved.",
			" *  Licensed under the MIT License. See License.txt in the project root for license information.",
			" *--------------------------------------------------------------------------------------------*/",
			"",
			"$0"
		],
		"description": "Insert Copyright Statement"
	},
	"TS -> Inject Service": {
		"scope": "typescript",
		"description": "Constructor Injection Pattern",
		"prefix": "@inject",
		"body": "@$1 private readonly _$2: ${1},$0"
	},
	"TS -> Event & Emitter": {
		"scope": "typescript",
		"prefix": "emitter",
		"description": "Add emitter and event properties",
		"body": [
			"private readonly _onDid$1 = new Emitter<$2>();",
			"readonly onDid$1: Event<$2> = this._onDid$1.event;"
		],
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/tasks.json]---
Location: vscode-main/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "npm",
			"script": "watch-clientd",
			"label": "Core - Build",
			"isBackground": true,
			"presentation": {
				"reveal": "never",
				"group": "buildWatchers",
				"close": false
			},
			"problemMatcher": {
				"owner": "typescript",
				"applyTo": "closedDocuments",
				"fileLocation": [
					"absolute"
				],
				"pattern": {
					"regexp": "Error: ([^(]+)\\((\\d+|\\d+,\\d+|\\d+,\\d+,\\d+,\\d+)\\): (.*)$",
					"file": 1,
					"location": 2,
					"message": 3
				},
				"background": {
					"beginsPattern": "Starting compilation...",
					"endsPattern": "Finished compilation with"
				}
			}
		},
		{
			"type": "npm",
			"script": "watch-extensionsd",
			"label": "Ext - Build",
			"isBackground": true,
			"presentation": {
				"reveal": "never",
				"group": "buildWatchers",
				"close": false
			},
			"problemMatcher": {
				"owner": "typescript",
				"applyTo": "closedDocuments",
				"fileLocation": [
					"absolute"
				],
				"pattern": {
					"regexp": "Error: ([^(]+)\\((\\d+|\\d+,\\d+|\\d+,\\d+,\\d+,\\d+)\\): (.*)$",
					"file": 1,
					"location": 2,
					"message": 3
				},
				"background": {
					"beginsPattern": "Starting compilation",
					"endsPattern": "Finished compilation"
				}
			}
		},
		{
			"label": "VS Code - Build",
			"dependsOn": [
				"Core - Build",
				"Ext - Build"
			],
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"problemMatcher": []
		},
		{
			"type": "npm",
			"script": "kill-watch-clientd",
			"label": "Kill Core - Build",
			"group": "build",
			"presentation": {
				"reveal": "never",
				"group": "buildKillers",
				"close": true
			},
			"problemMatcher": "$tsc"
		},
		{
			"type": "npm",
			"script": "kill-watch-extensionsd",
			"label": "Kill Ext - Build",
			"group": "build",
			"presentation": {
				"reveal": "never",
				"group": "buildKillers",
				"close": true
			},
			"problemMatcher": "$tsc"
		},
		{
			"label": "Kill VS Code - Build",
			"dependsOn": [
				"Kill Core - Build",
				"Kill Ext - Build"
			],
			"group": "build",
			"problemMatcher": []
		},
		{
			"label": "Restart VS Code - Build",
			"dependsOn": [
				"Kill VS Code - Build",
				"VS Code - Build"
			],
			"group": "build",
			"dependsOrder": "sequence",
			"problemMatcher": []
		},
		{
			"label": "Kill VS Code - Build, Npm, VS Code - Build",
			"dependsOn": [
				"Kill VS Code - Build",
				"npm: install",
				"VS Code - Build"
			],
			"group": "build",
			"dependsOrder": "sequence",
			"problemMatcher": []
		},
		{
			"type": "npm",
			"script": "watch-webd",
			"label": "Web Ext - Build",
			"group": "build",
			"isBackground": true,
			"presentation": {
				"reveal": "never"
			},
			"problemMatcher": {
				"owner": "typescript",
				"applyTo": "closedDocuments",
				"fileLocation": [
					"absolute"
				],
				"pattern": {
					"regexp": "Error: ([^(]+)\\((\\d+|\\d+,\\d+|\\d+,\\d+,\\d+,\\d+)\\): (.*)$",
					"file": 1,
					"location": 2,
					"message": 3
				},
				"background": {
					"beginsPattern": "Starting compilation",
					"endsPattern": "Finished compilation"
				}
			}
		},
		{
			"type": "npm",
			"script": "kill-watch-webd",
			"label": "Kill Web Ext - Build",
			"group": "build",
			"presentation": {
				"reveal": "never"
			},
			"problemMatcher": "$tsc"
		},
		{
			"label": "Run tests",
			"type": "shell",
			"command": "./scripts/test.sh",
			"windows": {
				"command": ".\\scripts\\test.bat"
			},
			"group": "test",
			"presentation": {
				"echo": true,
				"reveal": "always"
			}
		},
		{
			"label": "Run Dev",
			"type": "shell",
			"command": "./scripts/code.sh",
			"windows": {
				"command": ".\\scripts\\code.bat"
			},
			"problemMatcher": []
		},
		{
			"type": "npm",
			"script": "electron",
			"label": "Download electron"
		},
		{
			"type": "gulp",
			"task": "hygiene",
			"problemMatcher": []
		},
		{
			"type": "shell",
			"command": "./scripts/code-server.sh",
			"windows": {
				"command": ".\\scripts\\code-server.bat"
			},
			"args": [
				"--no-launch",
				"--connection-token",
				"dev-token",
				"--port",
				"8080"
			],
			"label": "Run code server",
			"isBackground": true,
			"problemMatcher": {
				"pattern": {
					"regexp": ""
				},
				"background": {
					"beginsPattern": ".*node .*",
					"endsPattern": "Web UI available at .*"
				}
			},
			"presentation": {
				"reveal": "never"
			}
		},
		{
			"type": "shell",
			"command": "./scripts/code-web.sh",
			"windows": {
				"command": ".\\scripts\\code-web.bat"
			},
			"args": [
				"--port",
				"8080",
				"--browser",
				"none"
			],
			"label": "Run code web",
			"isBackground": true,
			"problemMatcher": {
				"pattern": {
					"regexp": ""
				},
				"background": {
					"beginsPattern": ".*node .*",
					"endsPattern": "Listening on .*"
				}
			},
			"presentation": {
				"reveal": "never"
			}
		},
		{
			"type": "npm",
			"script": "eslint",
			"problemMatcher": {
				"source": "eslint",
				"base": "$eslint-stylish"
			}
		},
		{
			"type": "shell",
			"command": "node build/lib/preLaunch.ts",
			"label": "Ensure Prelaunch Dependencies",
			"presentation": {
				"reveal": "silent",
				"close": true
			}
		},
		{
			"type": "npm",
			"script": "tsec-compile-check",
			"problemMatcher": [
				{
					"base": "$tsc",
					"applyTo": "allDocuments",
					"owner": "tsec"
				}
			],
			"group": "build",
			"label": "npm: tsec-compile-check",
			"detail": "node_modules/tsec/bin/tsec -p src/tsconfig.json --noEmit"
		},
		{
			"label": "Launch Monaco Editor Vite",
			"type": "shell",
			"command": "npm run dev",
			"options": {
				"cwd": "./build/vite/"
			},
			"isBackground": true,
		},
		{
			"label": "Launch MCP Server",
			"type": "shell",
			"command": "cd test/mcp && npm run compile && npm run start-http",
			"isBackground": true,
			"problemMatcher": [
				"$tsc"
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-import-aid/package-lock.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-import-aid/package-lock.json

```json
{
  "name": "vscode-selfhost-import-aid",
  "version": "0.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-selfhost-import-aid",
      "version": "0.0.1",
      "license": "MIT",
      "dependencies": {
        "typescript": "5.5.4"
      },
      "engines": {
        "vscode": "^1.88.0"
      }
    },
    "node_modules/typescript": {
      "version": "5.5.4",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.5.4.tgz",
      "integrity": "sha512-Mtq29sKDAEYP7aljRgtPOpTvOfbwRWlS6dPRzwjdE+C0R4brX/GUyhHSecbHMFLNBLcJIPt9nl9yG5TZ1weH+Q==",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-import-aid/package.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-import-aid/package.json

```json
{
  "name": "vscode-selfhost-import-aid",
  "displayName": "VS Code Selfhost Import Aid",
  "description": "Util to improve dealing with imports",
  "engines": {
    "vscode": "^1.88.0"
  },
  "version": "0.0.1",
  "publisher": "ms-vscode",
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onLanguage:typescript"
  ],
  "main": "./out/extension.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  },
  "license": "MIT",
  "scripts": {
    "compile": "gulp compile-extension:vscode-selfhost-import-aid",
    "watch": "gulp watch-extension:vscode-selfhost-import-aid"
  },
  "dependencies": {
    "typescript": "5.5.4"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-import-aid/tsconfig.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-import-aid/tsconfig.json

```json
{
	"extends": "../../../extensions/tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node",
			"mocha",
		]
	},
	"include": [
		"src/**/*",
		"../../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-import-aid/.vscode/launch.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-import-aid/.vscode/launch.json

```json
{
	"configurations": [
		{
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}",
				"--enable-proposed-api=ms-vscode.vscode-selfhost-import-aid"
			],
			"name": "Launch Extension",
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"request": "launch",
			"type": "extensionHost"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-import-aid/.vscode/settings.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-import-aid/.vscode/settings.json

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "vscode.typescript-language-features",
	"editor.codeActionsOnSave": {
		"source.organizeImports": "always"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-import-aid/src/extension.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-import-aid/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as ts from 'typescript';
import * as path from 'path';

export async function activate(context: vscode.ExtensionContext) {

	const fileIndex = new class {

		private _currentRun?: Thenable<void>;

		private _disposables: vscode.Disposable[] = [];

		private readonly _index = new Map<string, vscode.Uri>();

		constructor() {
			const watcher = vscode.workspace.createFileSystemWatcher('**/*.ts', false, true, false);
			this._disposables.push(watcher.onDidChange(e => { this._index.set(e.toString(), e); }));
			this._disposables.push(watcher.onDidDelete(e => { this._index.delete(e.toString()); }));
			this._disposables.push(watcher);

			this._refresh(false);
		}

		dispose(): void {
			for (const disposable of this._disposables) {
				disposable.dispose();
			}
			this._disposables = [];
			this._index.clear();
		}

		async all(token: vscode.CancellationToken) {

			await Promise.race([this._currentRun, new Promise<void>(resolve => token.onCancellationRequested(resolve))]);

			if (token.isCancellationRequested) {
				return undefined;
			}

			return Array.from(this._index.values());
		}

		private _refresh(clear: boolean) {
			// TODO@jrieken LATEST API! findFiles2New
			this._currentRun = vscode.workspace.findFiles('src/vs/**/*.ts', '{**/node_modules/**,**/extensions/**}').then(all => {
				if (clear) {
					this._index.clear();
				}
				for (const item of all) {
					this._index.set(item.toString(), item);
				}
			});
		}
	};

	const selector: vscode.DocumentSelector = 'typescript';

	function findNodeAtPosition(document: vscode.TextDocument, node: ts.Node, position: vscode.Position): ts.Node | undefined {
		if (node.getStart() <= document.offsetAt(position) && node.getEnd() >= document.offsetAt(position)) {
			return ts.forEachChild(node, child => findNodeAtPosition(document, child, position)) || node;
		}
		return undefined;
	}

	function findImportAt(document: vscode.TextDocument, position: vscode.Position): ts.ImportDeclaration | undefined {
		const sourceFile = ts.createSourceFile(document.fileName, document.getText(), ts.ScriptTarget.Latest, true);
		const node = findNodeAtPosition(document, sourceFile, position);
		if (node && ts.isStringLiteral(node) && ts.isImportDeclaration(node.parent)) {
			return node.parent;
		}
		return undefined;
	}

	const completionProvider = new class implements vscode.CompletionItemProvider {
		async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionList | undefined> {

			const index = document.getText().lastIndexOf(' from \'');
			if (index < 0 || document.positionAt(index).line < position.line) {
				// line after last import is before position
				// -> no completion, safe a parse call
				return undefined;
			}

			const node = findImportAt(document, position);
			if (!node) {
				return undefined;
			}

			const range = new vscode.Range(document.positionAt(node.moduleSpecifier.pos), document.positionAt(node.moduleSpecifier.end));
			const uris = await fileIndex.all(token);

			if (!uris) {
				return undefined;
			}

			const result = new vscode.CompletionList();
			result.isIncomplete = true;

			for (const item of uris) {

				if (!item.path.endsWith('.ts')) {
					continue;
				}

				let relativePath = path.relative(path.dirname(document.uri.path), item.path);
				relativePath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

				const label = path.basename(item.path, path.extname(item.path));
				const insertText = ` '${relativePath.replace(/\.ts$/, '.js')}'`;
				const filterText = ` '${label}'`;

				const completion = new vscode.CompletionItem({
					label: label,
					description: vscode.workspace.asRelativePath(item),
				});
				completion.kind = vscode.CompletionItemKind.File;
				completion.insertText = insertText;
				completion.filterText = filterText;
				completion.range = range;

				result.items.push(completion);
			}

			return result;
		}
	};

	class ImportCodeActions implements vscode.CodeActionProvider {

		static FixKind = vscode.CodeActionKind.QuickFix.append('esmImport');

		static SourceKind = vscode.CodeActionKind.SourceFixAll.append('esmImport');

		async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<vscode.CodeAction[] | undefined> {

			if (context.only && ImportCodeActions.SourceKind.intersects(context.only)) {
				return this._provideFixAll(document, context, token);
			}

			return this._provideFix(document, range, context, token);
		}

		private async _provideFixAll(document: vscode.TextDocument, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<vscode.CodeAction[] | undefined> {

			const diagnostics = context.diagnostics
				.filter(d => d.code === 2307)
				.sort((a, b) => b.range.start.compareTo(a.range.start));

			if (diagnostics.length === 0) {
				return undefined;
			}

			const uris = await fileIndex.all(token);
			if (!uris) {
				return undefined;
			}

			const result = new vscode.CodeAction(`Fix All ESM Imports`, ImportCodeActions.SourceKind);
			result.edit = new vscode.WorkspaceEdit();
			result.diagnostics = [];

			for (const diag of diagnostics) {

				const actions = this._provideFixesForDiag(document, diag, uris);

				if (actions.length === 0) {
					console.log(`ESM: no fixes for "${diag.message}"`);
					continue;
				}

				if (actions.length > 1) {
					console.log(`ESM: more than one fix for "${diag.message}", taking first`);
					console.log(actions);
				}

				const [first] = actions;
				result.diagnostics.push(diag);

				for (const [uri, edits] of first.edit!.entries()) {
					result.edit.set(uri, edits);
				}
			}
			// console.log(result.edit.get(document.uri));
			return [result];
		}

		private async _provideFix(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<vscode.CodeAction[] | undefined> {
			const uris = await fileIndex.all(token);
			if (!uris) {
				return [];
			}

			const diag = context.diagnostics.find(d => d.code === 2307 && d.range.intersection(range));
			return diag && this._provideFixesForDiag(document, diag, uris);
		}

		private _provideFixesForDiag(document: vscode.TextDocument, diag: vscode.Diagnostic, uris: Iterable<vscode.Uri>): vscode.CodeAction[] {

			const node = findImportAt(document, diag.range.start)?.moduleSpecifier;
			if (!node || !ts.isStringLiteral(node)) {
				return [];
			}

			const nodeRange = new vscode.Range(document.positionAt(node.pos), document.positionAt(node.end));
			const name = path.basename(node.text, path.extname(node.text));

			const result: vscode.CodeAction[] = [];

			for (const item of uris) {
				if (path.basename(item.path, path.extname(item.path)) === name) {
					let relativePath = path.relative(path.dirname(document.uri.path), item.path).replace(/\.ts$/, '.js');
					relativePath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

					const action = new vscode.CodeAction(`Fix to '${relativePath}'`, ImportCodeActions.FixKind);
					action.edit = new vscode.WorkspaceEdit();
					action.edit.replace(document.uri, nodeRange, ` '${relativePath}'`);
					action.diagnostics = [diag];
					result.push(action);
				}
			}

			return result;
		}
	}

	context.subscriptions.push(fileIndex);
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, completionProvider));
	context.subscriptions.push(vscode.languages.registerCodeActionsProvider(selector, new ImportCodeActions(), { providedCodeActionKinds: [ImportCodeActions.FixKind, ImportCodeActions.SourceKind] }));
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/package-lock.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/package-lock.json

```json
{
  "name": "vscode-selfhost-test-provider",
  "version": "0.4.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-selfhost-test-provider",
      "version": "0.4.0",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/trace-mapping": "^0.3.25",
        "ansi-styles": "^5.2.0",
        "cockatiel": "^3.1.3",
        "istanbul-to-vscode": "^2.0.1"
      },
      "devDependencies": {
        "@types/mocha": "^10.0.6",
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.88.0"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.4.15",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.4.15.tgz",
      "integrity": "sha512-eF2rxCRulEKXHTRiDrDy6erMYWqNw4LPdQ8UQA4huuxaQsVeRPFl2oM8oDGxMFhJUWZf9McpLtJasDDZb/Bpeg=="
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.25",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz",
      "integrity": "sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@types/istanbul-lib-coverage": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/@types/istanbul-lib-coverage/-/istanbul-lib-coverage-2.0.6.tgz",
      "integrity": "sha512-2QF/t/auWm0lsy8XtKVPG19v3sSOQlJe/YHZgfjb/KBBHOGSV+J2q/S671rcq9uTBrLAXmZpqJiaQbMT+zNU1w=="
    },
    "node_modules/@types/mocha": {
      "version": "10.0.6",
      "resolved": "https://registry.npmjs.org/@types/mocha/-/mocha-10.0.6.tgz",
      "integrity": "sha512-dJvrYWxP/UcXm36Qn36fxhUKu8A/xMRXVT2cliFF1Z7UA9liG5Psj3ezNSZw+5puH2czDXRLcXQxf8JbJt0ejg==",
      "dev": true
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/ansi-styles": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-5.2.0.tgz",
      "integrity": "sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/cockatiel": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/cockatiel/-/cockatiel-3.1.3.tgz",
      "integrity": "sha512-xC759TpZ69d7HhfDp8m2WkRwEUiCkxY8Ee2OQH/3H6zmy2D/5Sm+zSTbPRa+V2QyjDtpMvjOIAOVjA2gp6N1kQ==",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/istanbul-to-vscode": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/istanbul-to-vscode/-/istanbul-to-vscode-2.0.1.tgz",
      "integrity": "sha512-V9Hhr7kX3UvkvkaT1lK3AmCRPkaIAIogQBrduTpNiLTkp1eVsybnJhWiDSVeCQap/3aGeZ2019oIivhX9MNsCQ==",
      "dependencies": {
        "@types/istanbul-lib-coverage": "^2.0.6"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/package.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/package.json

```json
{
  "name": "vscode-selfhost-test-provider",
  "displayName": "VS Code Selfhost Test Provider",
  "description": "Test provider for the VS Code project",
  "enabledApiProposals": [
    "testObserver",
    "testRelatedCode"
  ],
  "engines": {
    "vscode": "^1.88.0"
  },
  "contributes": {
    "commands": [
      {
        "command": "selfhost-test-provider.updateSnapshot",
        "title": "Update Snapshot",
        "category": "Testing",
        "icon": "$(merge)"
      },
      {
        "command": "selfhost-test-provider.openFailureLog",
        "title": "Open Selfhost Failure Logs",
        "category": "Testing",
        "icon": "$(merge)"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "selfhost-test-provider.updateSnapshot",
          "when": "false"
        }
      ],
      "testing/message/context": [
        {
          "command": "selfhost-test-provider.updateSnapshot",
          "group": "inline@1",
          "when": "testMessage == isSelfhostSnapshotMessage && !testResultOutdated"
        }
      ],
      "testing/message/content": [
        {
          "command": "selfhost-test-provider.updateSnapshot",
          "when": "testMessage == isSelfhostSnapshotMessage && !testResultOutdated"
        }
      ]
    }
  },
  "icon": "icon.png",
  "version": "0.4.0",
  "publisher": "ms-vscode",
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "workspaceContains:src/vs/loader.js"
  ],
  "workspaceTrust": {
    "request": "onDemand",
    "description": "Trust is required to execute tests in the workspace."
  },
  "main": "./out/extension.js",
  "prettier": {
    "printWidth": 100,
    "singleQuote": true,
    "tabWidth": 2,
    "arrowParens": "avoid"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  },
  "license": "MIT",
  "scripts": {
    "compile": "gulp compile-extension:vscode-selfhost-test-provider",
    "watch": "gulp watch-extension:vscode-selfhost-test-provider",
    "test": "npx mocha --ui tdd 'out/*.test.js'"
  },
  "devDependencies": {
    "@types/mocha": "^10.0.6",
    "@types/node": "22.x"
  },
  "dependencies": {
    "@jridgewell/trace-mapping": "^0.3.25",
    "ansi-styles": "^5.2.0",
    "cockatiel": "^3.1.3",
    "istanbul-to-vscode": "^2.0.1"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/tsconfig.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/tsconfig.json

```json
{
	"extends": "../../../extensions/tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node",
			"mocha",
		]
	},
	"include": [
		"src/**/*",
		"../../../src/vscode-dts/vscode.d.ts",
		"../../../src/vscode-dts/vscode.proposed.testObserver.d.ts",
		"../../../src/vscode-dts/vscode.proposed.testRelatedCode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/.vscode/launch.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/.vscode/launch.json

```json
{
	"configurations": [
		{
			"args": ["--extensionDevelopmentPath=${workspaceFolder}", "--enable-proposed-api=ms-vscode.vscode-selfhost-test-provider"],
			"name": "Launch Extension",
			"outFiles": ["${workspaceFolder}/out/**/*.js"],
			"request": "launch",
			"type": "extensionHost"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/.vscode/settings.json]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/.vscode/settings.json

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "vscode.typescript-language-features",
	"editor.codeActionsOnSave": {
		"source.organizeImports": "always"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/coverageProvider.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/coverageProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IstanbulCoverageContext } from 'istanbul-to-vscode';
import * as vscode from 'vscode';
import { SearchStrategy, SourceLocationMapper, SourceMapStore } from './testOutputScanner';
import { IScriptCoverage, OffsetToPosition, RangeCoverageTracker } from './v8CoverageWrangling';

export const istanbulCoverageContext = new IstanbulCoverageContext();

/**
 * Tracks coverage in per-script coverage mode. There are two modes of coverage
 * in this extension: generic istanbul reports, and reports from the runtime
 * sent before and after each test case executes. This handles the latter.
 */
export class PerTestCoverageTracker {
	private readonly scripts = new Map</* script ID */ string, Script>();

	constructor(private readonly maps: SourceMapStore) { }

	public add(coverage: IScriptCoverage, test?: vscode.TestItem) {
		const script = this.scripts.get(coverage.scriptId);
		if (script) {
			return script.add(coverage, test);
		}
		// ignore internals and node_modules
		if (!coverage.url.startsWith('file://') || coverage.url.includes('node_modules')) {
			return;
		}
		if (!coverage.source) {
			throw new Error('expected to have source the first time a script is seen');
		}

		const src = new Script(vscode.Uri.parse(coverage.url), coverage.source, this.maps);
		this.scripts.set(coverage.scriptId, src);
		src.add(coverage, test);
	}

	public async report(run: vscode.TestRun) {
		await Promise.all(Array.from(this.scripts.values()).map(s => s.report(run)));
	}
}

class Script {
	private converter: OffsetToPosition;

	/** Tracking the overall coverage for the file */
	private overall = new ScriptCoverageTracker();
	/** Range tracking per-test item */
	private readonly perItem = new Map<vscode.TestItem, ScriptCoverageTracker>();

	constructor(
		public readonly uri: vscode.Uri,
		source: string,
		private readonly maps: SourceMapStore
	) {
		this.converter = new OffsetToPosition(source);
	}

	public add(coverage: IScriptCoverage, test?: vscode.TestItem) {
		this.overall.add(coverage);
		if (test) {
			const p = new ScriptCoverageTracker();
			p.add(coverage);
			this.perItem.set(test, p);
		}
	}

	public async report(run: vscode.TestRun) {
		const mapper = await this.maps.getSourceLocationMapper(this.uri.toString());
		const originalUri = (await this.maps.getSourceFile(this.uri.toString())) || this.uri;
		run.addCoverage(this.overall.report(originalUri, this.converter, mapper, this.perItem));
	}
}

class ScriptCoverageTracker {
	private coverage = new RangeCoverageTracker();

	public add(coverage: IScriptCoverage) {
		for (const range of RangeCoverageTracker.initializeBlocks(coverage.functions)) {
			this.coverage.setCovered(range.start, range.end, range.covered);
		}
	}

	public *toDetails(
		uri: vscode.Uri,
		convert: OffsetToPosition,
		mapper: SourceLocationMapper | undefined,
	) {
		for (const range of this.coverage) {
			if (range.start === range.end) {
				continue;
			}

			const startCov = convert.toLineColumn(range.start);
			let start = new vscode.Position(startCov.line, startCov.column);

			const endCov = convert.toLineColumn(range.end);
			let end = new vscode.Position(endCov.line, endCov.column);
			if (mapper) {
				const startMap = mapper(start.line, start.character, SearchStrategy.FirstAfter);
				const endMap = startMap && mapper(end.line, end.character, SearchStrategy.FirstBefore);
				if (!endMap || uri.toString().toLowerCase() !== endMap.uri.toString().toLowerCase()) {
					continue;
				}
				start = startMap.range.start;
				end = endMap.range.end;
			}

			for (let i = start.line; i <= end.line; i++) {
				yield new vscode.StatementCoverage(
					range.covered,
					new vscode.Range(
						new vscode.Position(i, i === start.line ? start.character : 0),
						new vscode.Position(i, i === end.line ? end.character : Number.MAX_SAFE_INTEGER)
					)
				);
			}
		}
	}

	/**
	 * Generates the script's coverage for the test run.
	 *
	 * If a source location mapper is given, it assumes the `uri` is the mapped
	 * URI, and that any unmapped locations/outside the URI should be ignored.
	 */
	public report(
		uri: vscode.Uri,
		convert: OffsetToPosition,
		mapper: SourceLocationMapper | undefined,
		items: Map<vscode.TestItem, ScriptCoverageTracker>,
	): V8CoverageFile {
		const file = new V8CoverageFile(uri, items, convert, mapper);
		for (const detail of this.toDetails(uri, convert, mapper)) {
			file.add(detail);
		}

		return file;
	}
}

export class V8CoverageFile extends vscode.FileCoverage {
	public details: vscode.StatementCoverage[] = [];

	constructor(
		uri: vscode.Uri,
		private readonly perTest: Map<vscode.TestItem, ScriptCoverageTracker>,
		private readonly convert: OffsetToPosition,
		private readonly mapper: SourceLocationMapper | undefined,
	) {
		super(uri, { covered: 0, total: 0 }, undefined, undefined, [...perTest.keys()]);
	}

	public add(detail: vscode.StatementCoverage) {
		this.details.push(detail);
		this.statementCoverage.total++;
		if (detail.executed) {
			this.statementCoverage.covered++;
		}
	}

	public testDetails(test: vscode.TestItem): vscode.FileCoverageDetail[] {
		const t = this.perTest.get(test);
		return t ? [...t.toDetails(this.uri, this.convert, this.mapper)] : [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/debounce.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/debounce.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Debounces the function call for an interval.
 */
export function debounce(duration: number, fn: () => void): (() => void) & { clear: () => void } {
	let timeout: NodeJS.Timeout | void;
	const debounced = () => {
		if (timeout !== undefined) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			timeout = undefined;
			fn();
		}, duration);
	};

	debounced.clear = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};

	return debounced;
}
```

--------------------------------------------------------------------------------

````
