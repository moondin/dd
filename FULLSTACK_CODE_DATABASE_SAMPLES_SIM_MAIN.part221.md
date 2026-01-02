---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 221
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 221 of 933)

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

---[FILE: parallel.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/parallel.mdx

```text
---
title: 并行
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

并行块是一个容器，可以同时执行多个实例，从而加快工作流的处理速度。与其按顺序处理项目，不如同时处理它们。

<Callout type="info">
  并行块是容器节点，可以同时多次执行其内容，而循环则是按顺序执行。
</Callout>

## 配置选项

### 并行类型

选择两种并行执行类型之一：

<Tabs items={['基于计数', '基于集合']}>
  <Tab>
    **基于计数的并行** - 执行固定数量的并行实例：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-1.png"
        alt="基于计数的并行执行"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    当您需要同时多次运行相同操作时使用此选项。
    

    ```
    Example: Run 5 parallel instances
    - Instance 1 ┐
    - Instance 2 ├─ All execute simultaneously
    - Instance 3 │
    - Instance 4 │
    - Instance 5 ┘
    ```

  </Tab>
  <Tab>
    **基于集合的并行** - 将一个集合分配到并行实例中：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-2.png"
        alt="基于集合的并行执行"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    每个实例同时处理集合中的一个项目。
    

    ```
    Example: Process ["task1", "task2", "task3"] in parallel
    - Instance 1: Process "task1" ┐
    - Instance 2: Process "task2" ├─ All execute simultaneously
    - Instance 3: Process "task3" ┘
    ```

  </Tab>
</Tabs>

## 如何使用并行块

### 创建并行块

1. 从工具栏中将一个并行块拖到画布上
2. 配置并行类型和参数
3. 在并行容器中拖入一个单独的块
4. 根据需要连接块

### 访问结果

并行块完成后，您可以访问聚合结果：

- **`<parallel.results>`**：来自所有并行实例的结果数组

## 示例用例

**批量 API 处理** - 同时处理多个 API 调用

```
Parallel (Collection) → API (Call Endpoint) → Function (Aggregate)
```

**多模型 AI 处理** - 同时从多个 AI 模型获取响应

```
Parallel (["gpt-4o", "claude-3.7-sonnet", "gemini-2.5-pro"]) → Agent → Evaluator (Select Best)
```

## 高级功能

### 结果聚合

来自所有并行实例的结果会自动收集：

```javascript
// In a Function block after the parallel
const allResults = input.parallel.results;
// Returns: [result1, result2, result3, ...]
```

### 实例隔离

每个并行实例独立运行：
- 独立的变量作用域
- 实例之间没有共享状态
- 一个实例的失败不会影响其他实例

### 限制

<Callout type="warning">
  容器块（循环和并行）不能嵌套在彼此内部。这意味着：
  - 您不能在并行块中放置循环块
  - 您不能在并行块中放置另一个并行块
  - 您不能在一个容器块中放置另一个容器块
</Callout>

<Callout type="info">
  虽然并行执行速度更快，但请注意：
  - 在进行并发请求时的 API 速率限制
  - 使用大型数据集时的内存使用情况
  - 最多 20 个并发实例，以防止资源耗尽
</Callout>

## 并行与循环

了解何时使用每种方式：

| 特性 | 并行 | 循环 |
|---------|----------|------|
| 执行方式 | 并发 | 顺序 |
| 速度 | 独立操作更快 | 较慢但有序 |
| 顺序 | 无保证顺序 | 保持顺序 |
| 使用场景 | 独立操作 | 依赖操作 |
| 资源使用 | 较高 | 较低 |

## 输入与输出

<Tabs items={['配置', '变量', '结果']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>并行类型</strong>：选择“计数”或“集合”
      </li>
      <li>
        <strong>计数</strong>：要运行的实例数量（基于计数）
      </li>
      <li>
        <strong>集合</strong>：要分配的数组或对象（基于集合）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.currentItem</strong>：此实例的项目
      </li>
      <li>
        <strong>parallel.index</strong>：实例编号（从 0 开始）
      </li>
      <li>
        <strong>parallel.items</strong>：完整集合（基于集合）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.results</strong>：所有实例结果的数组
      </li>
      <li>
        <strong>访问</strong>：在并行之后的模块中可用
      </li>
    </ul>
  </Tab>
</Tabs>

## 最佳实践

- **仅限独立操作**：确保操作之间没有依赖关系
- **处理速率限制**：为 API 密集型工作流添加延迟或节流
- **错误处理**：每个实例应优雅地处理自己的错误
```

--------------------------------------------------------------------------------

---[FILE: response.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/response.mdx

```text
---
title: 响应
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Response 块用于格式化并将结构化的 HTTP 响应发送回 API 调用方。使用它可以通过适当的状态码和头信息返回工作流结果。

<div className="flex justify-center">
  <Image
    src="/static/blocks/response.png"
    alt="响应模块配置"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
  Response 块是终止块——它们会结束工作流的执行，无法连接到其他块。
</Callout>

## 配置选项

### 响应数据

响应数据是将发送回 API 调用方的主要内容。它应以 JSON 格式编写，可以包括：

- 静态值
- 使用 `<variable.name>` 语法动态引用工作流变量
- 嵌套对象和数组
- 任何有效的 JSON 结构

### 状态码

为响应设置 HTTP 状态码（默认为 200）：

**成功 (2xx)：**
- **200**: OK - 标准成功响应
- **201**: Created - 资源成功创建
- **204**: No Content - 成功但无响应内容

**客户端错误 (4xx)：**
- **400**: Bad Request - 请求参数无效
- **401**: Unauthorized - 需要身份验证
- **404**: Not Found - 资源不存在
- **422**: Unprocessable Entity - 验证错误

**服务器错误 (5xx)：**
- **500**: Internal Server Error - 服务器端错误
- **502**: Bad Gateway - 外部服务错误
- **503**: Service Unavailable - 服务暂时不可用

### 响应头

配置要包含在响应中的额外 HTTP 头信息。

头信息以键值对的形式配置：

| 键 | 值 |
|-----|-------|
| Content-Type | application/json |
| Cache-Control | no-cache |
| X-API-Version | 1.0 |

## 示例用例

**API 端点响应** - 返回来自搜索 API 的结构化数据

```
Agent (Search) → Function (Format & Paginate) → Response (200, JSON)
```

**Webhook 确认** - 确认 webhook 的接收和处理

```
Webhook Trigger → Function (Process) → Response (200, Confirmation)
```

**错误响应处理** - 返回适当的错误响应

```
Condition (Error Detected) → Router → Response (400/500, Error Details)
```

## 输出

响应块是终端块——它们结束工作流的执行并将 HTTP 响应发送给 API 调用者。下游块不可用任何输出。

## 变量引用

使用 `<variable.name>` 语法在响应中动态插入工作流变量：

```json
{
  "user": {
    "id": "<variable.userId>",
    "name": "<variable.userName>",
    "email": "<variable.userEmail>"
  },
  "query": "<variable.searchQuery>",
  "results": "<variable.searchResults>",
  "totalFound": "<variable.resultCount>",
  "processingTime": "<variable.executionTime>ms"
}
```

<Callout type="warning">
  变量名称区分大小写，必须与工作流中可用的变量完全匹配。
</Callout>

## 最佳实践

- **使用有意义的状态码**：选择适当的 HTTP 状态码，准确反映工作流的结果
- **结构化响应的一致性**：在所有 API 端点中保持一致的 JSON 结构，以提升开发者体验
- **包含相关元数据**：添加时间戳和版本信息，以便调试和监控
- **优雅地处理错误**：在工作流中使用条件逻辑设置适当的错误响应，并提供描述性消息
- **验证变量引用**：确保所有引用的变量存在并在响应块执行前包含预期的数据类型
```

--------------------------------------------------------------------------------

---[FILE: router.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/router.mdx

```text
---
title: 路由器
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Router 块使用 AI 基于内容分析智能地路由工作流。与使用简单规则的 Condition 块不同，Router 能理解上下文和意图。

<div className="flex justify-center">
  <Image
    src="/static/blocks/router.png"
    alt="具有多路径的路由器模块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Router 与 Condition 的对比

**在以下情况下使用 Router：**
- 需要 AI 驱动的内容分析
- 处理非结构化或多样化的内容
- 需要基于意图的路由（例如，“将支持票据路由到相关部门”）

**在以下情况下使用 Condition：**
- 简单的基于规则的决策足够
- 处理结构化数据或数值比较
- 需要快速、确定性的路由

## 配置选项

### 内容/提示

Router 将分析的内容或提示以做出路由决策。这可以是：

- 用户的直接查询或输入
- 来自前一个块的输出
- 系统生成的消息

### 目标块

Router 可以选择的目标块。Router 会自动检测连接的块，但您也可以：

- 自定义目标块的描述以提高路由准确性
- 为每个目标块指定路由条件
- 排除某些块作为路由目标

### 模型选择

选择一个 AI 模型来支持路由决策：

- **OpenAI**：GPT-4o、o1、o3、o4-mini、gpt-4.1
- **Anthropic**：Claude 3.7 Sonnet
- **Google**：Gemini 2.5 Pro、Gemini 2.0 Flash
- **其他提供商**：Groq、Cerebras、xAI、DeepSeek
- **本地模型**：兼容 Ollama 或 VLLM 的模型

使用具有强大推理能力的模型，例如 GPT-4o 或 Claude 3.7 Sonnet，以获得最佳效果。

### API 密钥

您选择的 LLM 提供商的 API 密钥。此密钥会被安全存储并用于身份验证。

## 输出

- **`<router.prompt>`**：路由提示的摘要
- **`<router.selected_path>`**：选择的目标模块
- **`<router.tokens>`**：令牌使用统计
- **`<router.cost>`**：估算的路由成本
- **`<router.model>`**：用于决策的模型

## 示例用例

**客户支持分流** - 将工单路由到专业部门

```
Input (Ticket) → Router → Agent (Engineering) or Agent (Finance)
```

**内容分类** - 分类并路由用户生成的内容

```
Input (Feedback) → Router → Workflow (Product) or Workflow (Technical)
```

**潜在客户资格评估** - 根据资格标准路由潜在客户

```
Input (Lead) → Router → Agent (Enterprise Sales) or Workflow (Self-serve)
```

## 最佳实践

- **提供清晰的目标描述**：通过具体、详细的描述帮助路由器了解何时选择每个目标
- **使用特定的路由标准**：为每条路径定义明确的条件和示例以提高准确性
- **实施回退路径**：为没有特定路径适用的情况连接一个默认目标
- **使用多样化输入进行测试**：确保路由器能够处理各种输入类型、边界情况和意外内容
- **监控路由性能**：定期审查路由决策，并根据实际使用模式优化标准
- **选择合适的模型**：对于复杂的路由决策，使用具有强大推理能力的模型
```

--------------------------------------------------------------------------------

---[FILE: variables.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/variables.mdx

```text
---
title: 变量
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

变量模块在执行过程中更新工作流变量。变量必须首先在工作流的变量部分中初始化，然后您可以使用此模块在工作流运行时更新其值。

<div className="flex justify-center">
  <Image
    src="/static/blocks/variables.png"
    alt="变量块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout>
  在工作流中的任何地方使用 `<variable.variableName>` 语法访问变量。
</Callout>

## 如何使用变量

### 1. 在工作流变量中初始化

首先，在工作流的变量部分（可通过工作流设置访问）中创建变量：

```
customerEmail = ""
retryCount = 0
currentStatus = "pending"
```

### 2. 使用变量块更新

使用变量块在执行过程中更新这些值：

```
customerEmail = <api.email>
retryCount = <variable.retryCount> + 1
currentStatus = "processing"
```

### 3. 随处访问

在任何块中引用变量：

```
Agent prompt: "Send email to <variable.customerEmail>"
Condition: <variable.retryCount> < 5
API body: {"status": "<variable.currentStatus>"}
```

## 示例用例

**循环计数器和状态** - 跟踪迭代过程中的进度

```
Loop → Agent (Process) → Variables (itemsProcessed + 1) → Variables (Store lastResult)
```

**重试逻辑** - 跟踪 API 重试次数

```
API (Try) → Variables (retryCount + 1) → Condition (retryCount < 3)
```

**动态配置** - 存储工作流的用户上下文

```
API (Fetch Profile) → Variables (userId, userTier) → Agent (Personalize)
```

## 输出

- **`<variables.assignments>`**: 包含此块中所有变量赋值的 JSON 对象

## 最佳实践

- **在工作流设置中初始化**：在使用变量之前，始终在工作流变量部分创建变量
- **动态更新**：使用变量块根据块输出或计算结果更新值
- **在循环中使用**：非常适合在迭代中跟踪状态
- **命名清晰**：使用明确的名称，例如 `currentIndex`、`totalProcessed` 或 `lastError`
```

--------------------------------------------------------------------------------

---[FILE: wait.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/wait.mdx

```text
---
title: 等待
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

等待模块会在继续执行下一个模块之前暂停您的工作流一段指定的时间。使用它可以在操作之间添加延迟、遵守 API 速率限制或间隔操作。

<div className="flex justify-center">
  <Image
    src="/static/blocks/wait.png"
    alt="等待模块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 配置

### 等待时间

输入暂停执行的时长：
- **输入**：正数
- **最大值**：600 秒（10 分钟）或 10 分钟

### 单位

选择时间单位：
- **秒**：用于短时间、精确的延迟
- **分钟**：用于较长时间的暂停

<Callout type="info">
  通过停止工作流可以取消等待块。最大等待时间为 10 分钟。
</Callout>

## 输出

- **`<wait.waitDuration>`**：等待时长（以毫秒为单位）
- **`<wait.status>`**：等待状态（“等待中”、“已完成”或“已取消”）

## 示例用例

**API 速率限制** - 在请求之间保持在 API 速率限制范围内

```
API (Request 1) → Wait (2s) → API (Request 2)
```

**定时通知** - 延迟后发送后续消息

```
Function (Send Email) → Wait (5min) → Function (Follow-up)
```

**处理延迟** - 等待外部系统完成处理

```
API (Trigger Job) → Wait (30s) → API (Check Status)
```

## 最佳实践

- **保持合理的等待时间**：使用等待块延迟最多 10 分钟。对于更长的延迟，请考虑使用计划的工作流
- **监控执行时间**：请记住，等待会延长工作流的总持续时间
```

--------------------------------------------------------------------------------

---[FILE: workflow.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/workflow.mdx

```text
---
title: 工作流模块
description: 在当前流程中运行另一个工作流
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

## 功能简介

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow.png'
    alt='工作流模块配置'
    width={500}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

当您希望在更大的流程中调用子工作流时，可以使用工作流模块。该模块运行该工作流的最新部署版本，等待其完成后，再继续执行父流程。

## 配置方法

1. **从下拉菜单中选择一个工作流**（自引用被阻止以防止循环）。
2. **映射输入**：如果子工作流有一个输入表单触发器，您将看到每个字段并可以连接父变量。映射的值是子工作流接收到的内容。

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow-2.png'
    alt='带有输入映射示例的工作流模块'
    width={700}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

3. **输出**：子工作流完成后，该模块会暴露以下内容：
   - `result` – 子工作流的最终响应
   - `success` – 是否运行无错误
   - `error` – 运行失败时的消息

## 部署状态徽章

工作流模块显示一个部署状态徽章，帮助您跟踪子工作流是否已准备好执行：

- **已部署** – 子工作流已部署并可以使用。模块将执行当前已部署的版本。
- **未部署** – 子工作流从未部署过。您必须先部署它，工作流模块才能执行。
- **重新部署** – 自上次部署以来，检测到子工作流发生了更改。点击徽章以重新部署子工作流并应用最新更改。

<Callout type="warn">
工作流模块始终执行子工作流的最新已部署版本，而不是编辑器版本。请确保在进行更改后重新部署，以确保模块使用最新逻辑。
</Callout>

## 执行注意事项

- 子工作流在相同的工作区上下文中运行，因此环境变量和工具会被继承。
- 模块使用部署版本控制：任何 API、计划、Webhook、手动或聊天执行都会调用已部署的快照。当您更改子工作流时，请重新部署。
- 如果子工作流失败，模块会引发错误，除非您在下游处理它。

<Callout>
保持子工作流的专注性。小型、可重用的流程更容易组合，而不会导致深层嵌套。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/zh/connections/basics.mdx

```text
---
title: 基础
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Video } from '@/components/ui/video'

## 连接如何工作

连接是允许数据在工作流中的模块之间流动的路径。在 Sim 中，连接定义了信息如何从一个模块传递到另一个模块，从而实现整个工作流中的数据流动。

<Callout type="info">
  每个连接表示一个定向关系，其中数据从源模块的输出流向目标模块的输入。
</Callout>

### 创建连接

<Steps>
  <Step>
    <strong>选择源模块</strong>：点击您想要连接的模块的输出端口
  </Step>
  <Step>
    <strong>绘制连接</strong>：拖动到目标模块的输入端口
  </Step>
  <Step>
    <strong>确认连接</strong>：释放以创建连接
  </Step>
</Steps>

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="connections-build.mp4" width={700} height={450} />
</div>

### 连接流程

通过连接的数据流遵循以下原则：

1. **方向性流动**：数据始终从输出流向输入
2. **执行顺序**：块根据其连接的顺序执行
3. **数据转换**：数据在块之间传递时可能会被转换
4. **条件路径**：某些块（如路由器和条件块）可以将流引导到不同的路径

<Callout type="warning">
  删除连接将立即停止块之间的数据流。在删除连接之前，请确保这是您想要的操作。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: data-structure.mdx]---
Location: sim-main/apps/docs/content/docs/zh/connections/data-structure.mdx

```text
---
title: 数据结构
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

当您连接模块时，了解不同模块输出的数据结构非常重要，因为源模块的输出数据结构决定了目标模块中可用的值。每种模块类型都会生成特定的输出结构，您可以在下游模块中引用这些结构。

<Callout type="info">
  理解这些数据结构对于有效使用连接标签和在工作流中访问正确的数据至关重要。
</Callout>

## 模块输出结构

不同的模块类型会生成不同的输出结构。以下是每种模块类型的输出结构：

<Tabs items={['代理输出', 'API 输出', '函数输出', '评估器输出', '条件输出', '路由器输出']}>
  <Tab>

    ```json
    {
      "content": "The generated text response",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "toolCalls": [...],
      "cost": [...],
      "usage": [...]
    }
    ```

    ### 代理模块输出字段

    - **content**: 代理生成的主要文本响应
    - **model**: 使用的 AI 模型（例如："gpt-4o"，"claude-3-opus"）
    - **tokens**: 令牌使用统计
      - **prompt**: 提示中的令牌数量
      - **completion**: 完成中的令牌数量
      - **total**: 使用的令牌总数
    - **toolCalls**: 代理调用的工具数组（如果有）
    - **cost**: 每次工具调用的成本对象数组（如果有）
    - **usage**: 整个响应的令牌使用统计

  </Tab>
  <Tab>

    ```json
    {
      "data": "Response data",
      "status": 200,
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      }
    }
    ```

    ### API 模块输出字段

    - **data**: 来自 API 的响应数据（可以是任何类型）
    - **status**: 响应的 HTTP 状态码
    - **headers**: API 返回的 HTTP 头信息

  </Tab>
  <Tab>

    ```json
    {
      "result": "Function return value",
      "stdout": "Console output",
    }
    ```

    ### 函数模块输出字段

    - **result**: 函数的返回值（可以是任何类型）
    - **stdout**: 函数执行期间捕获的控制台输出

  </Tab>
  <Tab>

    ```json
    {
      "content": "Evaluation summary",
      "model": "gpt-5",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "metric1": 8.5,
      "metric2": 7.2,
      "metric3": 9.0
    }
    ```

    ### 评估器模块输出字段

    - **content**：评估的摘要
    - **model**：用于评估的 AI 模型
    - **tokens**：令牌使用统计
    - **[metricName]**：评估器中定义的每个指标的分数（动态字段）

  </Tab>
  <Tab>

    ```json
    {
      "conditionResult": true,
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Follow-up Agent"
      },
      "selectedOption": "condition-1"
    }
    ```

    ### 条件模块输出字段

    - **conditionResult**：条件判断的布尔值结果
    - **selectedPath**：所选路径的信息
      - **blockId**：所选路径下一个区块的 ID
      - **blockType**：下一个区块的类型
      - **blockTitle**：下一个区块的标题
    - **selectedOption**：所选条件的 ID

  </Tab>
  <Tab>

    ```json
    {
      "content": "Routing decision",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Customer Service Agent"
      }
    }
    ```

    ### 路由模块输出字段

    - **content**：路由决策文本
    - **model**：用于路由的 AI 模型
    - **tokens**：令牌使用统计
    - **selectedPath**：关于选定路径的信息
      - **blockId**：选定目标模块的 ID
      - **blockType**：选定模块的类型
      - **blockTitle**：选定模块的标题

  </Tab>
</Tabs>

## 自定义输出结构

某些模块可能会根据其配置生成自定义输出结构：

1. **带有响应格式的代理模块**：在代理模块中使用响应格式时，输出结构将匹配定义的模式，而不是标准结构。

2. **函数模块**：`result` 字段可以包含函数代码返回的任何数据结构。

3. **API 模块**：`data` 字段将包含 API 返回的内容，这可能是任何有效的 JSON 结构。

<Callout type="warning">
  在开发过程中始终检查模块的实际输出结构，以确保您在连接中引用了正确的字段。
</Callout>

## 嵌套数据结构

许多块的输出包含嵌套数据结构。您可以在连接标签中使用点符号访问这些结构：

```
<blockName.path.to.nested.data>
```

例如：

- `<agent1.tokens.total>` - 从 Agent 块访问总令牌数
- `<api1.data.results[0].id>` - 从 API 响应中访问第一个结果的 ID
- `<function1.result.calculations.total>` - 访问 Function 块结果中的嵌套字段
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/connections/index.mdx

```text
---
title: 概览
description: 将您的模块相互连接。
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { ConnectIcon } from '@/components/icons'
import { Video } from '@/components/ui/video'

连接是允许数据在工作流中的模块之间流动的路径。它们定义了信息如何从一个模块传递到另一个模块，从而使您能够创建复杂的多步骤流程。

<Callout type="info">
  正确配置的连接对于创建高效的工作流至关重要。它们决定了数据如何在系统中流动以及模块之间如何交互。
</Callout>

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

## 连接类型

Sim 支持不同类型的连接，以实现各种工作流模式：

<Cards>
  <Card title="连接基础" href="/connections/basics">
    了解连接的工作原理以及如何在工作流中创建它们
  </Card>
  <Card title="连接标签" href="/connections/tags">
    了解如何使用连接标签在模块之间引用数据
  </Card>
  <Card title="数据结构" href="/connections/data-structure">
    探索不同模块类型的输出数据结构
  </Card>
  <Card title="访问数据" href="/connections/accessing-data">
    学习访问和操作连接数据的技巧
  </Card>
  <Card title="最佳实践" href="/connections/best-practices">
    遵循推荐的模式以实现高效的连接管理
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/zh/connections/tags.mdx

```text
---
title: 标签
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Video } from '@/components/ui/video'

连接标签是连接块中可用数据的可视化表示，提供了一种在工作流中引用块之间数据和前置块输出的简便方式。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

### 什么是连接标签？

连接标签是块连接时出现的交互元素。它们表示可以从一个块流向另一个块的数据，并允许您：

- 可视化源块中可用的数据
- 在目标块中引用特定的数据字段
- 在块之间创建动态数据流

<Callout type="info">
  连接标签使您可以轻松查看前置块中可用的数据，并在当前块中使用这些数据，而无需记住复杂的数据结构。
</Callout>

## 使用连接标签

在工作流中使用连接标签主要有两种方式：

<div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">拖放操作</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      点击连接标签并将其拖动到目标块的输入字段中。一个下拉菜单会显示可用的值。
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>将鼠标悬停在连接标签上以查看可用数据</li>
      <li>点击并拖动标签到输入字段</li>
      <li>从下拉菜单中选择特定的数据字段</li>
      <li>引用会自动插入</li>
    </ol>
  </div>

  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">尖括号语法</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      在输入字段中键入 <code>&lt;&gt;</code>，即可看到前置块中可用连接值的下拉菜单。
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>点击任意输入字段，选择您想使用的连接数据</li>
      <li>
        键入 <code>&lt;&gt;</code> 以触发连接下拉菜单
      </li>
      <li>浏览并选择您想引用的数据</li>
      <li>继续输入或从下拉菜单中选择以完成引用</li>
    </ol>
  </div>
</div>

## 标签语法

连接标签使用简单的语法来引用数据：

```
<blockName.path.to.data>
```

其中：

- `blockName` 是源块的名称
- `path.to.data` 是特定数据字段的路径

例如：

- `<agent1.content>` - 引用 ID 为 "agent1" 的块中的内容字段
- `<api2.data.users[0].name>` - 引用 ID 为 "api2" 的块中数据字段的用户数组中第一个用户的名称

## 动态标签引用

连接标签在运行时进行评估，这意味着：

1. 它们始终引用最新的数据
2. 它们可以在表达式中使用，并与静态文本结合
3. 它们可以嵌套在其他数据结构中

### 示例

```javascript
// Reference in text
"The user's name is <userBlock.name>"

// Reference in JSON
{
  "userName": "<userBlock.name>",
  "orderTotal": <apiBlock.data.total>
}

// Reference in code
const greeting = "Hello, <userBlock.name>!";
const total = <apiBlock.data.total> * 1.1; // Add 10% tax
```

<Callout type="warning">
  在数字上下文中使用连接标签时，请确保引用的数据实际上是数字，
  以避免类型转换问题。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/copilot/index.mdx

```text
---
title: Copilot
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'
import { MessageCircle, Package, Zap, Infinity as InfinityIcon, Brain, BrainCircuit } from 'lucide-react'

Copilot 是您编辑器中的助手，可帮助您使用 Sim Copilot 构建和编辑工作流，同时理解和改进它们。它可以：

- **解释**：回答有关 Sim 和您当前工作流的问题
- **指导**：建议编辑和最佳实践
- **编辑**：在您批准后对模块、连接和设置进行更改

<Callout type="info">
  Copilot 是一个由 Sim 管理的服务。对于自托管部署，请在托管应用程序中生成一个 Copilot API 密钥（sim.ai → 设置 → Copilot）
  1. 前往 [sim.ai](https://sim.ai) → 设置 → Copilot 并生成一个 Copilot API 密钥
  2. 在您的自托管环境中将 `COPILOT_API_KEY` 设置为该值
</Callout>

## 上下文菜单 (@)

使用 `@` 符号引用各种资源，并为 Copilot 提供有关您的工作空间的更多上下文：

<Image
  src="/static/copilot/copilot-menu.png"
  alt="Copilot 上下文菜单显示可用的引用选项"
  width={600}
  height={400}
/>

`@` 菜单提供以下访问：
- **聊天**：引用之前的 Copilot 对话
- **所有工作流**：引用工作空间中的任何工作流
- **工作流模块**：引用工作流中的特定模块
- **模块**：引用模块类型和模板
- **知识**：引用您上传的文档和知识库
- **文档**：引用 Sim 文档
- **模板**：引用工作流模板
- **日志**：引用执行日志和结果

这些上下文信息帮助 Copilot 为您的特定用例提供更准确和相关的帮助。

## 模式

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        提问
      </span>
    }
  >
    <div className="m-0 text-sm">
      用于解释、指导和建议的问答模式，不会对您的工作流进行更改。
    </div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        代理
      </span>
    }
  >
    <div className="m-0 text-sm">
      构建和编辑模式。Copilot 提出具体的编辑建议（添加模块、连接变量、调整设置），并在您批准后应用它们。
    </div>
  </Card>
</Cards>

<div className="flex justify-center">
  <Image
    src="/static/copilot/copilot-mode.png"
    alt="Copilot 模式选择界面"
    width={600}
    height={400}
    className="my-6"
  />
</div>

## 深度级别

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Zap className="h-4 w-4 text-muted-foreground" />
        快速
      </span>
    }
  >
    <div className="m-0 text-sm">最快且最便宜。适用于小型编辑、简单工作流程和小调整。</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <InfinityIcon className="h-4 w-4 text-muted-foreground" />
        自动
      </span>
    }
  >
    <div className="m-0 text-sm">速度与推理的平衡。推荐作为大多数任务的默认选项。</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Brain className="h-4 w-4 text-muted-foreground" />
        高级
      </span>
    }
  >
    <div className="m-0 text-sm">适用于更大的工作流程和复杂编辑，同时保持高性能。</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
        巨兽
      </span>
    }
  >
    <div className="m-0 text-sm">提供最大推理能力，用于深度规划、调试和复杂的架构更改。</div>
  </Card>
</Cards>

### 模式选择界面

您可以通过 Copilot 界面中的模式选择器轻松切换不同的推理模式：

<Image
  src="/static/copilot/copilot-models.png"
  alt="Copilot 模式选择界面显示高级模式和 MAX 切换选项"
  width={600}
  height={300}
/>

该界面允许您：
- **选择推理级别**：从快速、自动、高级或巨兽中选择
- **启用 MAX 模式**：切换到最大推理能力，以便在需要最全面分析时使用
- **查看模式描述**：了解每种模式的优化用途

根据任务的复杂性选择您的模式——对于简单问题使用快速模式，对于复杂的架构更改使用巨兽模式。

## 计费与成本计算

### 成本如何计算

Copilot 的使用按底层 LLM 的每个 token 计费：

- **输入标记**：按提供商的基础费率计费（**按成本**）
- **输出标记**：按提供商的基础输出费率的 **1.5 倍** 计费

```javascript
copilotCost = (inputTokens × inputPrice + outputTokens × (outputPrice × 1.5)) / 1,000,000
```

| 组件       | 应用费率             |
|------------|----------------------|
| 输入       | inputPrice           |
| 输出       | outputPrice × 1.5    |

<Callout type="warning">
  显示的价格反映截至 2025 年 9 月 4 日的费率。请查阅提供商文档以获取当前价格。
</Callout>

<Callout type="info">
  模型价格以每百万标记为单位。计算公式将其除以 1,000,000 以获得实际成本。请参阅<a href="/execution/costs">成本计算页面</a>了解背景和示例。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/zh/execution/api.mdx

```text
---
title: 外部 API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Sim 提供了一个全面的外部 API，用于查询工作流执行日志，并在工作流完成时设置实时通知的 webhook。

## 身份验证

所有 API 请求都需要在 `x-api-key` 标头中传递 API 密钥：

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://sim.ai/api/v1/logs?workspaceId=YOUR_WORKSPACE_ID
```

您可以在 Sim 仪表板的用户设置中生成 API 密钥。

## 日志 API

所有 API 响应都包含有关您的工作流执行限制和使用情况的信息：

```json
"limits": {
  "workflowExecutionRateLimit": {
    "sync": {
      "requestsPerMinute": 60,  // Sustained rate limit per minute
      "maxBurst": 120,          // Maximum burst capacity
      "remaining": 118,         // Current tokens available (up to maxBurst)
      "resetAt": "..."          // When tokens next refill
    },
    "async": {
      "requestsPerMinute": 200, // Sustained rate limit per minute
      "maxBurst": 400,          // Maximum burst capacity
      "remaining": 398,         // Current tokens available
      "resetAt": "..."          // When tokens next refill
    }
  },
  "usage": {
    "currentPeriodCost": 1.234,  // Current billing period usage in USD
    "limit": 10,                  // Usage limit in USD
    "plan": "pro",                // Current subscription plan
    "isExceeded": false           // Whether limit is exceeded
  }
}
```

**注意：** 速率限制使用令牌桶算法。`remaining` 可以超过 `requestsPerMinute` 达到 `maxBurst`，当您最近未使用全部配额时，允许突发流量。响应正文中的速率限制适用于工作流执行。调用此 API 端点的速率限制在响应头中（`X-RateLimit-*`）。

### 查询日志

使用广泛的过滤选项查询工作流执行日志。

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs
    ```

    **必需参数：**
    - `workspaceId` - 您的工作区 ID

    **可选过滤器：**
    - `workflowIds` - 逗号分隔的工作流 ID
    - `folderIds` - 逗号分隔的文件夹 ID
    - `triggers` - 逗号分隔的触发类型：`api`、`webhook`、`schedule`、`manual`、`chat`
    - `level` - 按级别过滤：`info`、`error`
    - `startDate` - 日期范围起始的 ISO 时间戳
    - `endDate` - 日期范围结束的 ISO 时间戳
    - `executionId` - 精确执行 ID 匹配
    - `minDurationMs` - 最小执行持续时间（毫秒）
    - `maxDurationMs` - 最大执行持续时间（毫秒）
    - `minCost` - 最小执行成本
    - `maxCost` - 最大执行成本
    - `model` - 按使用的 AI 模型过滤

    **分页：**
    - `limit` - 每页结果数（默认：100）
    - `cursor` - 下一页的游标
    - `order` - 排序顺序：`desc`、`asc`（默认：降序）

    **详细级别：**
    - `details` - 响应详细级别：`basic`, `full`（默认：basic）
    - `includeTraceSpans` - 包含跟踪跨度（默认：false）
    - `includeFinalOutput` - 包含最终输出（默认：false）
  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": [
        {
          "id": "log_abc123",
          "workflowId": "wf_xyz789",
          "executionId": "exec_def456",
          "level": "info",
          "trigger": "api",
          "startedAt": "2025-01-01T12:34:56.789Z",
          "endedAt": "2025-01-01T12:34:57.123Z",
          "totalDurationMs": 334,
          "cost": {
            "total": 0.00234
          },
          "files": null
        }
      ],
      "nextCursor": "eyJzIjoiMjAyNS0wMS0wMVQxMjozNDo1Ni43ODlaIiwiaWQiOiJsb2dfYWJjMTIzIn0",
      "limits": {
        "workflowExecutionRateLimit": {
          "sync": {
            "requestsPerMinute": 60,
            "maxBurst": 120,
            "remaining": 118,
            "resetAt": "2025-01-01T12:35:56.789Z"
          },
          "async": {
            "requestsPerMinute": 200,
            "maxBurst": 400,
            "remaining": 398,
            "resetAt": "2025-01-01T12:35:56.789Z"
          }
        },
        "usage": {
          "currentPeriodCost": 1.234,
          "limit": 10,
          "plan": "pro",
          "isExceeded": false
        }
      }
    }
    ```

  </Tab>
</Tabs>

### 获取日志详情

检索特定日志条目的详细信息。

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/{id}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": {
        "id": "log_abc123",
        "workflowId": "wf_xyz789",
        "executionId": "exec_def456",
        "level": "info",
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "workflow": {
          "id": "wf_xyz789",
          "name": "My Workflow",
          "description": "Process customer data"
        },
        "executionData": {
          "traceSpans": [...],
          "finalOutput": {...}
        },
        "cost": {
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          },
          "models": {
            "gpt-4o": {
              "input": 0.001,
              "output": 0.00134,
              "total": 0.00234,
              "tokens": {
                "prompt": 123,
                "completion": 456,
                "total": 579
              }
            }
          }
        },
        "limits": {
          "workflowExecutionRateLimit": {
            "sync": {
              "requestsPerMinute": 60,
              "maxBurst": 120,
              "remaining": 118,
              "resetAt": "2025-01-01T12:35:56.789Z"
            },
            "async": {
              "requestsPerMinute": 200,
              "maxBurst": 400,
              "remaining": 398,
              "resetAt": "2025-01-01T12:35:56.789Z"
            }
          },
          "usage": {
            "currentPeriodCost": 1.234,
            "limit": 10,
            "plan": "pro",
            "isExceeded": false
          }
        }
      }
    }
    ```

  </Tab>
</Tabs>

### 获取执行详情

检索执行详情，包括工作流状态快照。

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/executions/{executionId}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "executionId": "exec_def456",
      "workflowId": "wf_xyz789",
      "workflowState": {
        "blocks": {...},
        "edges": [...],
        "loops": {...},
        "parallels": {...}
      },
      "executionMetadata": {
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "cost": {...}
      }
    }
    ```

  </Tab>
</Tabs>

## 通知

通过 webhook、电子邮件或 Slack 获取工作流执行完成的实时通知。通知在工作区级别从日志页面进行配置。

### 配置

通过点击菜单按钮并选择“配置通知”从日志页面配置通知。

**通知渠道：**
- **Webhook**：向您的端点发送 HTTP POST 请求
- **电子邮件**：接收包含执行详情的电子邮件通知
- **Slack**：向 Slack 频道发送消息

**工作流选择：**
- 选择特定的工作流进行监控
- 或选择“所有工作流”以包含当前和未来的工作流

**过滤选项：**
- `levelFilter`：接收的日志级别（`info`，`error`）
- `triggerFilter`：接收的触发类型（`api`，`webhook`，`schedule`，`manual`，`chat`）

**可选数据：**
- `includeFinalOutput`：包含工作流的最终输出
- `includeTraceSpans`：包含详细的执行跟踪跨度
- `includeRateLimits`：包含速率限制信息（同步/异步限制和剩余）
- `includeUsageData`：包含计费周期的使用情况和限制

### 警报规则

与其为每次执行接收通知，不如配置警报规则，仅在检测到问题时收到通知：

**连续失败**
- 在 X 次连续失败执行后发出警报（例如，连续 3 次失败）
- 当执行成功时重置

**失败率**
- 当失败率在过去 Y 小时内超过 X% 时发出警报
- 需要窗口内至少 5 次执行
- 仅在整个时间窗口结束后触发

**延迟阈值**
- 当任何执行时间超过 X 秒时发出警报
- 用于捕捉缓慢或挂起的工作流

**延迟峰值**
- 当执行时间比平均值慢 X% 时发出警报
- 与配置时间窗口内的平均持续时间进行比较
- 需要至少 5 次执行以建立基线

**成本阈值**
- 当单次执行成本超过 $X 时发出警报
- 用于捕捉高成本的 LLM 调用

**无活动**
- 当 X 小时内没有执行发生时发出警报
- 用于监控应定期运行的计划工作流

**错误计数**
- 当错误计数在某个时间窗口内超过 X 时发出警报
- 跟踪总错误数，而非连续错误

所有警报类型都包括 1 小时的冷却时间，以防止通知过多。

### Webhook 配置

对于 webhooks，可用以下附加选项：
- `url`：您的 webhook 端点 URL
- `secret`：用于 HMAC 签名验证的可选密钥

### 负载结构

当工作流执行完成时，Sim 会发送以下负载（通过 webhook POST、电子邮件或 Slack）：

```json
{
  "id": "evt_123",
  "type": "workflow.execution.completed",
  "timestamp": 1735925767890,
  "data": {
    "workflowId": "wf_xyz789",
    "executionId": "exec_def456",
    "status": "success",
    "level": "info",
    "trigger": "api",
    "startedAt": "2025-01-01T12:34:56.789Z",
    "endedAt": "2025-01-01T12:34:57.123Z",
    "totalDurationMs": 334,
    "cost": {
      "total": 0.00234,
      "tokens": {
        "prompt": 123,
        "completion": 456,
        "total": 579
      },
      "models": {
        "gpt-4o": {
          "input": 0.001,
          "output": 0.00134,
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          }
        }
      }
    },
    "files": null,
    "finalOutput": {...},  // Only if includeFinalOutput=true
    "traceSpans": [...],   // Only if includeTraceSpans=true
    "rateLimits": {...},   // Only if includeRateLimits=true
    "usage": {...}         // Only if includeUsageData=true
  },
  "links": {
    "log": "/v1/logs/log_abc123",
    "execution": "/v1/logs/executions/exec_def456"
  }
}
```

### Webhook 头信息

每个 webhook 请求都包含以下头信息（仅限 webhook 渠道）：

- `sim-event`：事件类型（始终为 `workflow.execution.completed`）
- `sim-timestamp`：以毫秒为单位的 Unix 时间戳
- `sim-delivery-id`：用于幂等性的唯一交付 ID
- `sim-signature`：用于验证的 HMAC-SHA256 签名（如果配置了密钥）
- `Idempotency-Key`：与交付 ID 相同，用于检测重复

### 签名验证

如果您配置了 webhook 密钥，请验证签名以确保 webhook 来自 Sim：

<Tabs items={['Node.js', 'Python']}>
  <Tab value="Node.js">

    ```javascript
    import crypto from 'crypto';

    function verifyWebhookSignature(body, signature, secret) {
      const [timestampPart, signaturePart] = signature.split(',');
      const timestamp = timestampPart.replace('t=', '');
      const expectedSignature = signaturePart.replace('v1=', '');
      
      const signatureBase = `${timestamp}.${body}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(signatureBase);
      const computedSignature = hmac.digest('hex');
      
      return computedSignature === expectedSignature;
    }

    // In your webhook handler
    app.post('/webhook', (req, res) => {
      const signature = req.headers['sim-signature'];
      const body = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
        return res.status(401).send('Invalid signature');
      }
      
      // Process the webhook...
    });
    ```

  </Tab>
  <Tab value="Python">

    ```python
    import hmac
    import hashlib
    import json

    def verify_webhook_signature(body: str, signature: str, secret: str) -> bool:
        timestamp_part, signature_part = signature.split(',')
        timestamp = timestamp_part.replace('t=', '')
        expected_signature = signature_part.replace('v1=', '')
        
        signature_base = f"{timestamp}.{body}"
        computed_signature = hmac.new(
            secret.encode(),
            signature_base.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(computed_signature, expected_signature)

    # In your webhook handler
    @app.route('/webhook', methods=['POST'])
    def webhook():
        signature = request.headers.get('sim-signature')
        body = json.dumps(request.json)
        
        if not verify_webhook_signature(body, signature, os.environ['WEBHOOK_SECRET']):
            return 'Invalid signature', 401
        
        # Process the webhook...
    ```

  </Tab>
</Tabs>

### 重试策略

失败的 webhook 交付将使用指数退避和抖动进行重试：

- 最大尝试次数：5
- 重试延迟：5 秒、15 秒、1 分钟、3 分钟、10 分钟
- 抖动：最多额外延迟 10% 以防止蜂拥效应
- 仅 HTTP 5xx 和 429 响应会触发重试
- 交付在 30 秒后超时

<Callout type="info">
  Webhook 交付是异步处理的，不会影响工作流执行性能。
</Callout>

## 最佳实践

1. **轮询策略**：在轮询日志时，使用基于游标的分页与 `order=asc` 和 `startDate` 来高效获取新日志。

2. **Webhook 安全性**：始终配置一个 webhook 密钥并验证签名，以确保请求来自 Sim。

3. **幂等性**：使用 `Idempotency-Key` 标头检测并处理重复的 webhook 交付。

4. **隐私**：默认情况下，`finalOutput` 和 `traceSpans` 会从响应中排除。仅在需要这些数据并了解隐私影响时启用它们。

5. **速率限制**：当收到 429 响应时，实施指数退避。检查 `Retry-After` 标头以获取推荐的等待时间。

## 速率限制

该 API 使用 **令牌桶算法** 进行速率限制，在提供公平使用的同时允许突发流量：

| 计划 | 请求/分钟 | 突发容量 |
|------|-----------|----------|
| 免费 | 10 | 20 |
| 专业版 | 30 | 60 |
| 团队版 | 60 | 120 |
| 企业版 | 120 | 240 |

**工作原理：**
- 令牌以 `requestsPerMinute` 的速率补充
- 空闲时最多可累积 `maxBurst` 个令牌
- 每个请求消耗 1 个令牌
- 突发容量允许处理流量高峰

速率限制信息包含在响应头中：
- `X-RateLimit-Limit`：每分钟请求数（补充速率）
- `X-RateLimit-Remaining`：当前可用令牌数
- `X-RateLimit-Reset`：令牌下次补充的 ISO 时间戳

## 示例：轮询新日志

```javascript
let cursor = null;
const workspaceId = 'YOUR_WORKSPACE_ID';
const startDate = new Date().toISOString();

async function pollLogs() {
  const params = new URLSearchParams({
    workspaceId,
    startDate,
    order: 'asc',
    limit: '100'
  });
  
  if (cursor) {
    params.append('cursor', cursor);
  }
  
  const response = await fetch(
    `https://sim.ai/api/v1/logs?${params}`,
    {
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    
    // Process new logs
    for (const log of data.data) {
      console.log(`New execution: ${log.executionId}`);
    }
    
    // Update cursor for next poll
    if (data.nextCursor) {
      cursor = data.nextCursor;
    }
  }
}

// Poll every 30 seconds
setInterval(pollLogs, 30000);
```

## 示例：处理 Webhooks

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

app.post('/sim-webhook', (req, res) => {
  // Verify signature
  const signature = req.headers['sim-signature'];
  const body = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Check timestamp to prevent replay attacks
  const timestamp = parseInt(req.headers['sim-timestamp']);
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  
  if (timestamp < fiveMinutesAgo) {
    return res.status(401).send('Timestamp too old');
  }
  
  // Process the webhook
  const event = req.body;
  
  switch (event.type) {
    case 'workflow.execution.completed':
      const { workflowId, executionId, status, cost } = event.data;
      
      if (status === 'error') {
        console.error(`Workflow ${workflowId} failed: ${executionId}`);
        // Handle error...
      } else {
        console.log(`Workflow ${workflowId} completed: ${executionId}`);
        console.log(`Cost: $${cost.total}`);
        // Process successful execution...
      }
      break;
  }
  
  // Return 200 to acknowledge receipt
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```
```

--------------------------------------------------------------------------------

````
