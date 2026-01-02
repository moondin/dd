---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 509
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 509 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.mdx]---
Location: sim-main/apps/sim/content/blog/emcn/index.mdx

```text
---
slug: emcn
title: 'Introducing Emcn — Sim’s new design system'
description: Emcn is the heart of our new design language at Sim. Here’s the scaffolding of the system—principles, tokens, components, and roadmap—as we prepare the full launch.
date: 2025-11-08
updated: 2025-11-08
authors:
  - emir
readingTime: 6
tags: [Design, Emcn, UI, UX, Components, Sim]
ogImage: /studio/emcn/cover.png
ogAlt: 'Emcn design system cover'
about: ['Design Systems', 'Component Libraries', 'Design Tokens', 'Accessibility']
timeRequired: PT6M
canonical: https://sim.ai/studio/emcn
featured: false
draft: true
---

> This post is the scaffolding for Emcn, our new design system. We’ll fill it in as we publish the full documentation and component gallery.

![Emcn cover placeholder](/studio/emcn/cover.png)

## What is Emcn?

Emcn is the design system that powers Sim’s product and brand. It aims to give us:

- Consistent, accessible UI across web surfaces  
- A fast path from Figma to code with strongly‑typed tokens  
- A composable component library that scales with product complexity  

## Principles

1. Opinionated but flexible  
2. Accessible by default (WCAG AA+)  
3. Strongly‑typed, themeable tokens (light/dark + brand accents)  
4. Composable components over one‑off variants  
5. Performance first (minimal runtime, zero layout shift)  

## Foundations (Tokens)

- Color: semantic palettes (bg, fg, muted, accent, destructive) with on‑colors  
- Typography: scale + weights mapped to roles (display, title, body, code)  
- Spacing: 2/4 grid, container and gutter rules  
- Radius: component tiers (base, interactive, card, sheet)  
- Shadows: subtle elevation scale for surfaces and overlays  
- Motion: duration/easing tokens for affordances (not decoration)  

## Components (Initial Set)

- Primitives: Button, Input, Select, Checkbox, Radio, Switch, Slider, Badge, Tooltip  
- Navigation: NavBar, SideBar, Tabs, Breadcrumbs  
- Feedback: Toast, Banner, Alert, Dialog, Drawer, Popover  
- Layout: Grid, Stack, Container, Card, Sheet  
- Content: CodeBlock, Markdown, Table, EmptyState  

> Each component will include: anatomy, a11y contract, variants/slots, and code examples.

## Theming

- Light + Dark, with brand accent tokens  
- Per‑workspace theming hooks for enterprise deployments  
- SSR‑safe color mode with no flash (hydration‑safe)  

## Accessibility

- Focus outlines and target sizes audited  
- Color contrast tracked at token level  
- Keyboard and screen reader interactions defined per component  

## Tooling

- Tokens exported as TypeScript + CSS variables  
- Figma library mapped 1:1 to code components  
- Lint rules for token usage and a11y checks  

## Roadmap

- v0: Foundations + Core components (internal)  
- v1: Public docs and examples site  
- v1.x: Data display, advanced forms, charts bridge  

## FAQ

- What does “Emcn” mean?  
  A short, crisp name we liked—easy to type and remember.  

- Will Emcn be open‑sourced?  
  We plan to share the foundations and many components as part of our commitment to open source.  

## We’re hiring

We’re hiring designers and engineers who care deeply about craft and DX. If you want to help shape Emcn and Sim’s product, we’d love to talk.

— Team Sim
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/sim/content/blog/executor/index.mdx

```text
---
slug: executor
title: 'Inside the Sim Executor - DAG Based Execution with Native Parallelism'
description: 'How we built a DAG-based execution engine with native parallel processing, intelligent edge routing, and stateful pause/resume capabilities'
date: 2025-11-10
updated: 2025-11-10
authors:
  - sid
readingTime: 12
tags: [Executor, Architecture, DAG, Orchestration]
ogImage: /studio/executor/cover.png
ogAlt: 'Sim Executor technical overview'
about: ['Execution', 'Workflow Orchestration']
timeRequired: PT12M
canonical: https://sim.ai/studio/executor
featured: false
draft: false
---

Modern workflows aren't just linear automations anymore. They involve a variety of APIs and services, loop over a model's output, pause for human decisions, and resume hours or days later exactly where they left off.

We designed the Sim executor to make these patterns feel natural. This post shares the architecture we ended up with, the challenges we ran into along the way, and what it enables for teams building agentic systems at scale.

## Laying the Foundation

There's a single guiding philosophy we use when designing the executor: workflows should read like the work you intend to do, not like the mess of cables behind a TV.
The complexity of wiring and plumbing should be abstracted away, and building a performant workflow end to end should be easy, modular, and seamless.

That's why the Sim executor serves as both an orchestrator and a translation layer, turning user-friendly workflow representations into an executable DAG behind the scenes.

## Core engine

At its heart, the executor figures out which blocks can run, runs them, then repeats. It sounds simple in theory, but can become surprisingly complex when you factor in conditional routing, nested loops, and true parallelism.

### Compiling Workflows to Graphs

Before execution starts, we compile the visual workflow into a directed acyclic graph (DAG). Every block becomes a node and every connection becomes an edge. Loops and parallel subflows expand into more complex structures (sentinel nodes for loops, branch-indexed nodes for parallels) that preserve the DAG property while enabling iteration and concurrency.

This upfront compilation pays off immediately: the entire topology is concretely defined before the first block ever executes.

### The Execution Queue

Once we have the DAG, execution becomes event‑driven. We maintain a ready queue: nodes whose dependencies are all satisfied. When a node completes, we remove its outgoing edges from downstream nodes' incoming edge sets. Any node that hits zero incoming edges goes straight into the queue. At it's core, topological sort.

The key difference here from traditional workflow execution approaches: we don't wait for a "layer" to finish. If three nodes in the queue are independent, we launch all three immediately and let the runtime handle concurrency.

### Dependency Resolution

In our earlier prototypes, we scanned the connection array after every block execution to see what became ready. However, as the number of nodes and edges scale, performance takes a hit.

The DAG flips that model. Each node tracks its own incoming edges in a set. When a dependency completes, we remove one element from the set. When the set hits zero, the node is ready. No scanning, no filtering, no repeated checks.

This optimization compounds when you have many parallel branches or deeply nested structures. Every node knows its own readiness without asking the rest of the graph.

### Variable Resolution

Blocks reference data from different sources: loop items (`<loop.iteration>`, `<loop.item>`), parallel branch indices (`<parallel.index>`), upstream block outputs (`<blockId.output.content>`), workflow variables (`<workflow.variableName>`), and environment variables (`${API_KEY}`). The resolver tries each scope in order—loop first, then parallel, then workflow, then environment, then block outputs. Inner scopes shadow outer ones, matching standard scoping semantics. This makes variables predictable: the context you're in determines what you see, without name collision or manual prefixes.

### Multiple Triggers and Selective Compilation

A workflow can have multiple entry points. Webhooks listen at different paths, schedules run on different cadences, and some triggers can fire from the UI. Each represents a valid starting point, but only one matters for any given execution.

The DAG builder handles this through selective compilation. When a workflow executes, we receive a trigger block ID. The builder starts from that node and builds only the reachable subgraph. Blocks that aren't downstream from the trigger never make it into the DAG.

This keeps execution focused. A workflow with five different webhook triggers doesn't compile all five paths every time. The topology adapts to the context automatically.

### Executing from the Client

The executor lives server-side. Users build workflows in the client. As they iterate and test, they need to see block inputs and outputs, watch execution progress in real time, and understand which paths the workflow takes.

Polling adds latency. Duplicating execution logic client‑side creates drift. We needed a way to stream execution state as it happens.

The executor emits events at key execution points—block starts, completions, streaming content, errors. These events flow through SSE to connected clients. The client reconstructs execution state from the stream, rendering logs and outputs as blocks complete.

## Parallelism

When a workflow fans out to call multiple APIs, compare outputs from different models, or process items independently, those branches should run at the same time. Not interleaved, not sequentially—actually concurrent.

Most workflow platforms handle branches differently. Some execute them one after another (n8n's v1 mode completes branch 1, then branch 2, then branch 3). Others interleave execution (run the first node of each branch, then the second node of each branch). Both approaches are deterministic, but neither gives you true parallelism.

The workarounds typically involve triggering separate sub-workflows with "wait for completion" disabled, then manually collecting results. This works, but it means coordinating execution state across multiple workflow instances, handling failures independently, and stitching outputs back together.

### How we approach it

The ready queue gives us parallelism by default. When a parallel block executes, it expands into branch‑indexed nodes in the DAG. Each branch is a separate copy of the blocks inside the parallel scope, indexed by branch number.

All entry nodes across all branches enter the ready queue simultaneously. The executor launches them concurrently—they're independent nodes with satisfied dependencies. As each branch progresses, its downstream nodes become ready and execute. The parallel orchestrator tracks completion by counting terminal nodes across all branches.

When all branches finish, we aggregate their outputs in branch order and continue. No coordination overhead, no manual result collection—just concurrent execution with deterministic aggregation.

### What this enables

A workflow that calls fifty different APIs processes them concurrently. Parallel model comparisons return results as they stream in, not after the slowest one finishes.

The DAG doesn't distinguish between "parallel branches" and "independent blocks that happen to be ready at the same time." Both execute concurrently. Parallelism simply emerges from workflow structure.

### Parallel subflows for cleaner authoring

For repetitive parallel work, we added parallel subflows. Instead of duplicating blocks visually for each branch on the canvas, you define a single subflow and configure the parallel block to run it N times or once per item in a collection.

Behind the scenes, this expands to the same branch‑indexed DAG structure. The executor doesn't distinguish between manually authored parallel branches and subflow-generated ones—they both become independent nodes that execute concurrently. Same execution model, cleaner authoring experience.

## Loops

### How loops compile to DAGs

Loops present a challenge for DAGs: graphs are acyclic, but loops repeat. We handle this by expanding loops into sentinel nodes during compilation.

![Loop sentinel nodes](/studio/executor/loop-sentinels.png)
*Loops expand into sentinel start and end nodes. The backward edge only activates when the loop continues, preserving the DAG's acyclic property.*

A loop is bookended by two nodes: a sentinel start and a sentinel end. The sentinel start activates the first blocks inside the loop. When terminal blocks complete, they route to the sentinel end. The sentinel end evaluates the loop condition and returns either "continue" (which routes back to the start) or "exit" (which activates blocks after the loop).

The backward edge from end to start doesn't count as a dependency initially—it only activates if the loop continues. This preserves the DAG property while enabling iteration.

### Iteration state and variable scoping

When a loop continues, the executor doesn't re-execute blocks from scratch. It clears their execution state (marking them as not-yet-executed) and restores their incoming edges, so they become ready for the next pass. Loop scope updates: iteration increments, the next item loads (for forEach), outputs from the previous iteration move to the aggregated results.

Blocks inside the loop access loop variables through the resolver chain. `<loop.iteration>` resolves before checking block outputs or workflow variables, so iteration context shadows outer scopes. This makes variable access predictable—you always get the current loop state.

## Conditions and Routers

Workflows branch based on runtime decisions. A condition block evaluates expressions and routes to different paths. A router block lets an AI model choose which path to take based on context. Both are core to building adaptive workflows.

### LLM-driven routing

Router blocks represent a modern pattern in workflow orchestration. Instead of hardcoding logic with if/else chains, you describe the options and let a language model decide. The model sees the conversation context, evaluates which path makes sense, and returns a selection.

The executor treats this selection as a routing decision. Each outgoing edge from a router carries metadata about which target block it represents. When the router completes, it returns the chosen block's ID. The edge manager activates only the edge matching that ID; all other edges deactivate.

This makes AI-driven routing deterministic and traceable. You can inspect the execution log and see exactly which path the model chose, why (from the model's reasoning), and which alternatives were pruned.

### Edge selection and path pruning

When a condition or router executes, it evaluates its logic and returns a single selection. The edge manager checks each outgoing edge to see if its label matches the selection. The matching edge activates; the rest deactivate.

![Edge activation and pruning](/studio/executor/edge-pruning.png)
*When a condition selects one path, the chosen edge activates while unselected paths deactivate recursively, preventing unreachable blocks from executing.*

Deactivation cascades. If an edge deactivates, the executor recursively deactivates all edges downstream from its target—unless that target has other active incoming edges. This automatic pruning prevents unreachable blocks from ever entering the ready queue.

The benefit: wasted work drops to zero. Paths that won't execute don't consume resources, don't wait in the queue, and don't clutter execution logs. The DAG reflects what actually ran, not what could have run.

### Convergence and rejoining paths

Workflows often diverge and reconverge. Multiple condition branches might lead to different processing steps, then merge at a common aggregation block. The executor handles this through edge counting.

When paths converge, the target block has multiple incoming edges—one from each upstream path. The edge manager tracks which edges activate. If a condition prunes one branch, that edge deactivates, and the target's incoming edge count decreases. The target becomes ready only when all remaining active incoming edges complete.

This works for complex topologies: nested conditions, routers feeding into other routers, parallel branches that reconverge after different amounts of work. The dependency tracking adapts automatically.

## Human in the loop

AI workflows aren't fully automated. They pause for approvals, wait for human feedback, or stop to let someone review model output before continuing. These pauses can happen anywhere—mid‑branch, inside a loop, across multiple parallel paths at once.

### Pause detection and state capture

When a block returns pause metadata, the executor stops processing its outgoing edges. Instead of continuing to downstream blocks, it captures the current execution state: every block output, every loop iteration, every parallel branch's progress, every routing decision, and the exact topology of remaining dependencies in the DAG.

Each pause point gets a unique context ID that encodes its position. A pause inside a loop at iteration 5 gets a different ID than the same block at iteration 6. A pause in parallel branch 3 gets a different ID than branch 4. This makes resume targeting precise—you can resume specific pause points independently.

The executor supports multiple simultaneous pauses. If three parallel branches each hit an approval block, all three pause, each with its own context ID. The execution returns with all three pause points and their resume links. Resuming any one triggers continuation from that specific point.

### Snapshot serialization

The snapshot captures everything needed to resume. Block states, execution logs, loop and parallel scopes, routing decisions, workflow variables—all serialize to JSON. The critical piece: DAG incoming edges. We save which dependencies each node still has outstanding.

When you serialize the DAG's edge state, you're freezing the exact moment in time when execution paused. This includes partially‑completed loops (iteration 7 of 100), in‑flight parallel branches (12 of 50 complete), and conditional paths already pruned.

### Resume and continuation

Resuming rebuilds the DAG, restores the snapshot state, and queues the resume trigger nodes. The executor marks already‑executed blocks to prevent re‑execution, restores incoming edges to reflect remaining dependencies, and continues from where it stopped.

If multiple pause points exist, each can resume independently. The first resume doesn't invalidate the others—each pause has its own trigger node in the DAG. When all pauses resume, the workflow continues normally, collecting outputs from each resumed branch.

### Coordination and atomicity

The executor uses a queue lock to prevent race conditions. When a node completes with pause metadata, we acquire the lock before checking for pauses. This ensures that multiple branches pausing simultaneously don't interfere with each other's state capture.

The lock also prevents a resumed node from racing with other executing nodes. When a resume trigger fires, it enters the queue like any other node. The ready queue pattern handles coordination—resumed nodes execute when their dependencies clear, just like nodes in the original execution.

### Example

![Iterative agent refinement with human feedback](/studio/executor/hitl-loop.png)
*A common pattern: agent generates output, pauses for human review, router decides pass/fail based on feedback, saves to workflow variable, and loop continues until approved.*

A while loop runs an agent with previous feedback as context. The agent's output goes to a human‑in‑the‑loop block, which pauses execution and sends a notification. The user reviews the output and provides feedback via the resume link.

When resumed, the feedback flows to a router that evaluates whether the output passes or needs revision. If it fails, the router saves the feedback to a workflow variable and routes back to continue the loop. The agent receives this feedback on the next iteration and tries again. If it passes, the router exits the loop and continues downstream.

The while loop's condition checks the workflow variable. As long as the status is "fail," the loop continues. When the router sets it to "pass," the loop exits. Each piece—loops, pause/resume, routing, variables—composes without glue because they're all first‑class executor concepts.

Multiple reviewers approving different branches works the same way. Each branch pauses independently, reviewers approve in any order, and execution continues as each approval comes in. The parallel orchestrator collects the results when all branches complete.

— Sid @ Sim
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/sim/content/blog/multiplayer/index.mdx

```text
---
slug: multiplayer
title: 'Realtime Collaboration on Sim'
description: A high-level explanation into Sim realtime collaborative workflow builder - from operation queues to conflict resolution.
date: 2025-11-11
updated: 2025-11-11
authors:
  - vik
readingTime: 12
tags: [Multiplayer, Realtime, Collaboration, WebSockets, Architecture]
ogImage: /studio/multiplayer/cover.png
canonical: https://sim.ai/studio/multiplayer
draft: false
---

When we started building Sim, we noticed that AI workflow development looked a lot like the design process [Figma](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/) had already solved for. Product managers need to sketch out user-facing flows, engineers need to configure integrations and APIs, and domain experts need to validate business logic—often all at the same time. Traditional workflow builders force serial collaboration: one person edits, saves, exports, and notifies the next person. This creates unnecessary friction.

We decided multiplayer editing was the right approach, even though workflow platforms like n8n and Make do not currently offer it. This post explains how we built it. We'll cover the operation queue, conflict resolution, how we handle blocks/edges/subflows separately, undo/redo as a wrapper around this, and why our system is a lot simpler than you'd expect.

## Architecture Overview: Client-Server with WebSockets

Sim uses a client-server architecture where browser clients communicate with a standalone Node.js WebSocket server over persistent connections. When you open a workflow, your client joins a "workflow room" on the server. All subsequent operations—adding blocks, connecting edges, updating configurations—are synchronized through this connection.

### Server-Side: The Source of Truth

The server maintains authoritative state in PostgreSQL across three normalized tables:

- `workflow_blocks`: Block metadata, positions, configurations, and subblock values
- `workflow_edges`: Connections between blocks with source/target handles
- `workflow_subflows`: Loop and parallel container configurations with child node lists

This separation is deliberate. Blocks, edges, and subflows have different update patterns and conflict characteristics. By storing them separately:

1. **Targeted updates**: Moving a block only updates `positionX` and `positionY` fields for that specific block row. We don't load or lock the entire workflow.
2. **Query optimization**: Different operations hit different tables with appropriate indexes. Updating edge connections only touches `workflow_edges`, leaving blocks untouched.
3. **Separate channels**: Structural operations (adding blocks, connecting edges) go through the main operation handler with persistence-first logic. Value updates (editing text in a subblock) go through a separate debounced channel with server-side coalescing—reducing database writes from hundreds to dozens for a typical typing session.

The server uses different broadcast strategies: position updates are broadcast immediately for smooth collaborative dragging (optimistic), while structural operations (adding blocks, connecting edges) persist first to ensure consistency (pessimistic).

### Client-Side: Optimistic Updates with Reconciliation

Clients maintain local copies of workflow state in [Zustand](https://github.com/pmndrs/zustand) stores. When you drag a block or type in a text field, the UI updates immediately—this is optimistic rendering. Simultaneously, the client queues an operation in a separate operation queue store to send to the server.

The client doesn't wait for server confirmation to render changes. Instead, it assumes success and continues. If the server rejects an operation (permissions failure, conflict, validation error), the client reconciles by either retrying or reverting the local change.

This is why workflow editing feels instantaneous—you never wait for a network round-trip to see your changes. The downside is added complexity around handling reconciliation, retries, and conflict resolution.

## The Operation Queue: Reliability Through Retries

At the heart of Sim's multiplayer system is the **Operation Queue**—a client-side abstraction that ensures no operation is lost, even under poor network conditions.

### How It Works

Every user action that modifies workflow state generates an operation object:

```typescript
{
  id: 'op-uuid',
  operation: {
    operation: 'update',  // or 'add', 'remove', 'move'
    target: 'block',      // or 'edge', 'subblock', 'variable'
    payload: { /* change data */ }
  },
  workflowId: 'workflow-id',
  userId: 'user-id',
  status: 'pending'
}
```

Operations are enqueued in FIFO order. The queue processor sends one operation at a time over the WebSocket, waiting for server confirmation before proceeding to the next. Text edits (subblock values, variable fields) are debounced client-side and coalesced server-side—a user typing a 500-character prompt generates ~10 operations instead of 500.

Failed operations retry with exponential backoff (structural changes get 3 attempts, text edits get 5). If all retries fail, the system enters offline mode—the queue is cleared and the UI becomes read-only until the user manually refreshes.

### Handling Dependent Operations

The operation queue's real power emerges when handling conflicts between collaborators. Consider this scenario:

**User A** deletes a block while **User B** has a pending subblock update for that same block in their operation queue.

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   User A    │                    │   Server    │                    │   User B    │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  Delete Block X                  │                                  │
       ├─────────────────────────────────>│                                  │
       │                                  │                                  │
       │                                  │  Persist deletion                │
       │                                  │  ────────────┐                   │
       │                                  │              │                   │
       │                                  │<─────────────┘                   │
       │                                  │                                  │
       │                                  │  Broadcast: Block X deleted      │
       │                                  ├─────────────────────────────────>│
       │                                  │                                  │
       │                                  │             Cancel all ops for X │
       │                                  │             (including subblock) │
       │                                  │                          ────────┤
       │                                  │                                  │
       │                                  │              Remove Block X      │
       │                                  │                          ────────┤
       │                                  │                                  │
```

Here's what happens:

1. User A's delete operation reaches the server and persists successfully
2. The server broadcasts the deletion to all clients, including User B
3. User B's client receives the broadcast and **immediately cancels all pending operations** for Block X (including the subblock update)
4. Then User B's client removes Block X from local state

No operations are sent to the server for a block that no longer exists. The client proactively removes all related operations from the queue—both block-level operations and subblock operations. User B never sees an error because the stale operation is silently discarded before it's sent.

This is more efficient than server-side validation. By canceling dependent operations locally when receiving a deletion broadcast, we avoid wasting network requests on operations that would fail anyway.

## Conflict Resolution: Timestamps and Determinism

In line with our goal of keeping things simple, Sim uses a **last-writer-wins** strategy with timestamp-based ordering. Every operation carries a client-generated timestamp. When conflicts occur, the operation with the latest timestamp takes precedence.

This is simpler than Figma's operational transform approach, but sufficient for our use case. Workflow building has lower conflict density than text editing—users typically work on different parts of the canvas or different blocks.

**Position conflicts** are handled with timestamp ordering. If two users simultaneously drag the same block, both clients render their local positions optimistically. The server persists both updates based on timestamps, broadcasting each in sequence. Clients receive the conflicting positions and converge to the latest timestamp.

**Value conflicts** (editing the same text field) are rarer but use last-to-arrive wins. Subblock updates are coalesced server-side within a 25ms window—whichever update reaches the server last within that window is persisted, regardless of client timestamp.

## Undo/Redo: A Thin Wrapper Over Sockets

Undo/redo in multiplayer environments is notoriously complex. Should undoing overwrite others' changes? What happens when you undo something someone else modified?

Sim takes a pragmatic approach: **undo/redo is a local, per-user stack that generates inverse operations sent through the same socket system as regular edits.**

### How It Works

Every operation you perform is recorded in a local undo stack with its inverse:

- **Add block** → Inverse: **Remove block** (with full block snapshot)
- **Remove block** → Inverse: **Add block** (restoring from snapshot)
- **Move block** → Inverse: **Move block** (with original position)
- **Update subblock** → Inverse: **Update subblock** (with previous value)

When you press Cmd+Z:

1. Pop the latest operation from your undo stack
2. Push it to your redo stack
3. Execute the inverse operation by queuing it through the operation queue
4. The inverse operation flows through the normal socket system: validation, persistence, broadcast

This means **undo is just another edit**. If you undo adding a block, Sim sends a "remove block" operation through the queue. Other users see the block disappear in real-time, as if you manually deleted it.

### Coalescing and Snapshots

Consecutive operations of the same type are coalesced. If you drag a block across the canvas in 50 small movements, only the starting and ending positions are recorded—pressing undo moves the block back to where you started dragging, not through every intermediate position.

For removal operations, we snapshot the complete state of the removed entity (including all subblock values and connected edges) at the time of removal. This snapshot travels with the undo entry. When you undo a deletion, we restore from the snapshot, ensuring perfect reconstruction even if the workflow structure changed in the interim.

### Multiplayer Undo Semantics

Undo stacks are **per-user**. Your undo history doesn't include others' changes. This matches user expectations: Cmd+Z undoes *your* recent actions, not your collaborator's.

The system prunes invalid operations from your stack when entities are deleted by collaborators. If User B has "add edge to Block X" in their undo stack, but User A deletes Block X, that undo entry becomes invalid and is automatically removed since the target block no longer exists.

An interesting case: you add a block, someone else connects an edge to it, and then you undo your addition. The block disappears along with their edge (because of foreign key constraints). This is correct—your block no longer exists, so edges referencing it can't exist either. Both users see the block and edge vanish.

During execution, undo operations are marked in-progress to prevent circular recording—undoing shouldn't create a new undo entry for the inverse operation itself.

## Conclusion

Building multiplayer workflow editing required rethinking assumptions about how workflow builders should work. By applying lessons from Figma's collaborative design tool to the domain of AI agent workflows, we created a system that feels fast, reliable, and natural for teams building together.

If you're building collaborative editing for structured data (not just text), consider:

- Whether OT/CRDT complexity is necessary for your conflict density
- How to separate high-frequency value updates from structural changes
- What guarantees your users need around data persistence and offline editing
- Whether exposing operation status builds trust in the system

Multiplayer workflow building is no longer a technical curiosity—it's how teams should work together to build AI agents. And the infrastructure to make it reliable and fast is more approachable than you might think.

---

*Interested in how Sim's multiplayer system works in practice? [Try building a workflow](https://sim.ai) with a collaborator in real-time.*
```

--------------------------------------------------------------------------------

````
