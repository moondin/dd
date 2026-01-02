---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 222
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 222 of 933)

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

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/zh/execution/basics.mdx

```text
---
title: 基础
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

了解 Sim 中工作流的执行方式是构建高效且可靠自动化的关键。执行引擎会自动处理依赖关系、并发性和数据流，以确保您的工作流平稳且可预测地运行。

## 工作流如何执行

Sim 的执行引擎通过分析依赖关系，以最有效的顺序智能地处理工作流。

### 默认并发执行

当多个块之间没有依赖关系时，它们会并发运行。这种并行执行显著提高了性能，无需手动配置。

<Image
  src="/static/execution/concurrency.png"
  alt="多个块在起始块之后并发运行"
  width={800}
  height={500}
/>

在此示例中，客户支持和深度研究代理块在起始块之后同时执行，从而最大化效率。

### 自动输出合并

当块具有多个依赖关系时，执行引擎会自动等待所有依赖完成，然后将它们的输出合并提供给下一个块。无需手动合并。

<Image
  src="/static/execution/combination.png"
  alt="函数块自动接收来自多个前置块的输出"
  width={800}
  height={500}
/>

函数块在两个代理块完成后接收它们的输出，从而可以处理合并的结果。

### 智能路由

工作流可以通过路由块向多个方向分支。执行引擎支持确定性路由（使用条件块）和 AI 驱动的路由（使用路由器块）。

<Image
  src="/static/execution/routing.png"
  alt="显示条件分支和基于路由器的分支的工作流"
  width={800}
  height={500}
/>

此工作流演示了如何根据条件或 AI 决策沿不同路径执行，每条路径独立运行。

## 块类型

Sim 提供了不同类型的块，用于在工作流中实现特定功能：

<Cards>
  <Card title="触发器" href="/triggers">
    **启动块**用于启动工作流，**Webhook 块**响应外部事件。每个工作流都需要一个触发器来开始执行。
  </Card>
  
  <Card title="处理块" href="/blocks">
    **代理块**与 AI 模型交互，**功能块**运行自定义代码，**API 块**连接到外部服务。这些块用于转换和处理数据。
  </Card>
  
  <Card title="控制流" href="/blocks">
    **路由器块**使用 AI 选择路径，**条件块**基于逻辑进行分支，**循环/并行块**处理迭代和并发。
  </Card>
  
  <Card title="输出与响应" href="/blocks">
    **响应块**为 API 和聊天界面格式化最终输出，从工作流中返回结构化结果。
  </Card>
</Cards>

所有块都会根据其依赖关系自动执行——您无需手动管理执行顺序或时间。

## 执行监控

在工作流运行时，Sim 提供对执行过程的实时可见性：

- **实时块状态**：查看哪些块正在执行、已完成或失败
- **执行日志**：实时显示详细日志，包括输入、输出和任何错误
- **性能指标**：跟踪每个块的执行时间和成本
- **路径可视化**：了解工作流中采取了哪些执行路径

<Callout type="info">
  所有执行详情都会被捕获并在工作流完成后可供查看，有助于调试和优化。
</Callout>

## 关键执行原则

理解这些核心原则将帮助您构建更好的工作流：

1. **基于依赖的执行**：块仅在其所有依赖项完成后运行
2. **自动并行化**：独立的块无需配置即可并发运行
3. **智能数据流**：输出会自动流向连接的块
4. **错误处理**：失败的块会停止其执行路径，但不会影响独立路径
5. **状态持久性**：所有块的输出和执行详情都会被保留以便调试

## 下一步

现在您已经了解了执行基础知识，可以探索：
- **[块类型](/blocks)** - 了解特定块的功能
- **[日志记录](/execution/logging)** - 监控工作流执行并调试问题
- **[成本计算](/execution/costs)** - 理解并优化工作流成本
- **[触发器](/triggers)** - 设置不同的方式来运行您的工作流
```

--------------------------------------------------------------------------------

---[FILE: costs.mdx]---
Location: sim-main/apps/docs/content/docs/zh/execution/costs.mdx

```text
---
title: 成本计算
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim 会自动计算所有工作流执行的成本，提供基于 AI 模型使用和执行费用的透明定价。了解这些成本有助于您优化工作流并有效管理预算。

## 成本如何计算

每次工作流执行包括两个成本组成部分：

**基础执行费用**：每次执行 $0.001

**AI 模型使用费用**：基于令牌消耗的可变成本

```javascript
modelCost = (inputTokens × inputPrice + outputTokens × outputPrice) / 1,000,000
totalCost = baseExecutionCharge + modelCost
```

<Callout type="info">
  AI 模型的价格是按每百万令牌计算的。计算时会除以 1,000,000 得出实际成本。不包含 AI 模块的工作流仅需支付基础执行费用。
</Callout>

## 日志中的模型成本明细

对于使用 AI 模块的工作流，您可以在日志中查看详细的成本信息：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-cost.png"
    alt="模型成本明细"
    width={600}
    height={400}
    className="my-6"
  />
</div>

模型成本明细显示：
- **令牌使用量**：每个模型的输入和输出令牌数量
- **成本明细**：每个模型和操作的单独成本
- **模型分布**：使用了哪些模型以及使用次数
- **总成本**：整个工作流执行的总成本

## 定价选项

<Tabs items={['托管模型', '使用您自己的 API 密钥']}>
  <Tab>
    **托管模型** - Sim 提供 API 密钥，价格为基础价格的 2.5 倍：

    **OpenAI**
    | 模型 | 基础价格（输入/输出） | 托管价格（输入/输出） |
    |-------|---------------------------|----------------------------|
    | GPT-5.1 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 Mini | $0.25 / $2.00 | $0.63 / $5.00 |
    | GPT-5 Nano | $0.05 / $0.40 | $0.13 / $1.00 |
    | GPT-4o | $2.50 / $10.00 | $6.25 / $25.00 |
    | GPT-4.1 | $2.00 / $8.00 | $5.00 / $20.00 |
    | GPT-4.1 Mini | $0.40 / $1.60 | $1.00 / $4.00 |
    | GPT-4.1 Nano | $0.10 / $0.40 | $0.25 / $1.00 |
    | o1 | $15.00 / $60.00 | $37.50 / $150.00 |
    | o3 | $2.00 / $8.00 | $5.00 / $20.00 |
    | o4 Mini | $1.10 / $4.40 | $2.75 / $11.00 |

    **Anthropic**
    | 模型 | 基础价格（输入/输出） | 托管价格（输入/输出） |
    |-------|---------------------------|----------------------------|
    | Claude Opus 4.5 | $5.00 / $25.00 | $12.50 / $62.50 |
    | Claude Opus 4.1 | $15.00 / $75.00 | $37.50 / $187.50 |
    | Claude Sonnet 4.5 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Sonnet 4.0 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Haiku 4.5 | $1.00 / $5.00 | $2.50 / $12.50 |

    **Google**
    | 模型 | 基础价格（输入/输出） | 托管价格（输入/输出） |
    |-------|---------------------------|----------------------------|
    | Gemini 3 Pro Preview | $2.00 / $12.00 | $5.00 / $30.00 |
    | Gemini 2.5 Pro | $0.15 / $0.60 | $0.38 / $1.50 |
    | Gemini 2.5 Flash | $0.15 / $0.60 | $0.38 / $1.50 |

    *2.5 倍的价格倍增用于覆盖基础设施和 API 管理成本。*
  </Tab>

  <Tab>
    **使用您自己的 API 密钥** - 以基础价格使用任何模型：

    | 提供商 | 示例模型 | 输入 / 输出 |
    |----------|----------------|----------------|
    | Deepseek | V3, R1 | $0.75 / $1.00 |
    | xAI | Grok 4 最新版, Grok 3 | $3.00 / $15.00 |
    | Groq | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Cerebras | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Ollama | 本地模型 | 免费 |
    | VLLM | 本地模型 | 免费 |

    *直接向提供商支付，无额外加价*
  </Tab>
</Tabs>

<Callout type="warning">
  显示的价格为截至 2025 年 9 月 10 日的费率。请查看提供商文档以获取最新价格。
</Callout>

## 成本优化策略

- **模型选择**：根据任务复杂性选择模型。简单任务可以使用 GPT-4.1-nano，而复杂推理可能需要 o1 或 Claude Opus。
- **提示工程**：结构良好、简洁的提示可以减少令牌使用，同时保持质量。
- **本地模型**：对于非关键任务，使用 Ollama 或 VLLM 完全消除 API 成本。
- **缓存和重用**：将经常使用的结果存储在变量或文件中，以避免重复调用 AI 模型。
- **批量处理**：在单次 AI 请求中处理多个项目，而不是逐一调用。

## 使用监控

在 设置 → 订阅 中监控您的使用情况和账单：

- **当前使用情况**：当前周期的实时使用和成本
- **使用限制**：计划限制及其可视化进度指示器
- **账单详情**：预计费用和最低承诺
- **计划管理**：升级选项和账单历史记录

### 程序化使用跟踪

您可以通过 API 程序化地查询当前的使用情况和限制：

**端点：**

```text
GET /api/users/me/usage-limits
```

**认证：**
- 在 `X-API-Key` 标头中包含您的 API 密钥

**示例请求：**

```bash
curl -X GET -H "X-API-Key: YOUR_API_KEY" -H "Content-Type: application/json" https://sim.ai/api/users/me/usage-limits
```

**示例响应：**

```json
{
  "success": true,
  "rateLimit": {
    "sync": {
      "isLimited": false,
      "requestsPerMinute": 25,
      "maxBurst": 50,
      "remaining": 50,
      "resetAt": "2025-09-08T22:51:55.999Z"
    },
    "async": {
      "isLimited": false,
      "requestsPerMinute": 200,
      "maxBurst": 400,
      "remaining": 400,
      "resetAt": "2025-09-08T22:51:56.155Z"
    },
    "authType": "api"
  },
  "usage": {
    "currentPeriodCost": 12.34,
    "limit": 100,
    "plan": "pro"
  }
}
```

**速率限制字段：**
- `requestsPerMinute`：持续速率限制（令牌以此速率补充）
- `maxBurst`：您可以累积的最大令牌数（突发容量）
- `remaining`：当前可用令牌数（最多可达 `maxBurst`）

**响应字段：**
- `currentPeriodCost` 反映当前计费周期的使用情况
- `limit` 来源于个人限制（免费/专业）或组织池限制（团队/企业）
- `plan` 是与您的用户关联的最高优先级的活动计划

## 计划限制

不同的订阅计划有不同的使用限制：

| 计划 | 每月使用限制 | 速率限制（每分钟） |
|------|-------------------|-------------------------|
| **免费** | $10 | 5 同步，10 异步 |
| **专业** | $100 | 10 同步，50 异步 |
| **团队** | $500（共享） | 50 同步，100 异步 |
| **企业** | 自定义 | 自定义 |

## 计费模式

Sim 使用 **基础订阅 + 超额** 的计费模式：

### 工作原理

**专业计划（$20/月）：**
- 每月订阅包含 $20 的使用额度
- 使用低于 $20 → 无额外费用
- 使用超过 $20 → 月底支付超额部分
- 示例：$35 使用 = $20（订阅）+ $15（超额）

**团队计划（$40/每席位/月）：**
- 团队成员之间共享使用额度
- 超额费用根据团队总使用量计算
- 组织所有者收到一张账单

**企业计划：**
- 固定月费，无超额费用
- 根据协议自定义使用限制

### 阈值计费

当未计费的超额费用达到 $50 时，Sim 会自动计费全额未计费金额。

**示例：**
- 第 10 天：$70 超额 → 立即计费 $70
- 第 15 天：额外使用 $35（总计 $105）→ 已计费，无需操作
- 第 20 天：再使用 $50（总计 $155，未计费 $85）→ 立即计费 $85

这会将大量的超额费用分散到整个月，而不是在周期结束时收到一张大账单。

## 成本管理最佳实践

1. **定期监控**：经常检查您的使用仪表板，避免意外情况
2. **设定预算**：使用计划限制作为支出控制的护栏
3. **优化工作流程**：审查高成本的执行操作，优化提示或模型选择
4. **使用合适的模型**：根据任务需求匹配模型复杂度
5. **批量处理相似任务**：尽可能合并多个请求以减少开销

## 下一步

- 在[设置 → 订阅](https://sim.ai/settings/subscription)中查看您当前的使用情况
- 了解[日志记录](/execution/logging)以跟踪执行详情
- 探索[外部 API](/execution/api)以进行程序化成本监控
- 查看[工作流优化技术](/blocks)以降低成本
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/execution/index.mdx

```text
---
title: 概览
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Sim 的执行引擎通过按正确的顺序处理模块、管理数据流并优雅地处理错误，使您的工作流栩栩如生，从而让您能够准确了解工作流在 Sim 中的执行方式。

<Callout type="info">
  每次工作流执行都会根据您的模块连接和逻辑遵循确定性路径，确保结果可预测且可靠。
</Callout>

## 文档概览

<Cards>
  <Card title="执行基础" href="/execution/basics">
    了解基本的执行流程、模块类型以及数据如何在您的工作流中流动
  </Card>

  <Card title="日志记录" href="/execution/logging">
    通过全面的日志记录和实时可见性监控工作流执行
  </Card>
  
  <Card title="成本计算" href="/execution/costs">
    了解工作流执行成本的计算方式及优化方法
  </Card>
  
  <Card title="外部 API" href="/execution/api">
    通过 REST API 程序化访问执行日志并设置 Webhooks
  </Card>
</Cards>

## 核心概念

### 拓扑执行
模块按照依赖顺序执行，类似于电子表格重新计算单元格的方式。执行引擎会自动确定哪些模块可以基于已完成的依赖项运行。

### 路径跟踪
引擎会主动跟踪工作流中的执行路径。路由器和条件模块会动态更新这些路径，确保仅执行相关模块。

### 基于层的处理
引擎不会逐个执行模块，而是识别可以并行运行的模块层，从而优化复杂工作流的性能。

### 执行上下文
每个工作流在执行期间都会维护一个丰富的上下文，其中包含：
- 模块输出和状态
- 活跃的执行路径
- 循环和并行迭代跟踪
- 环境变量
- 路由决策

## 部署快照

所有公共入口点——API、聊天、计划、Webhook 和手动运行——都会执行工作流的活动部署快照。每次更改画布时发布一个新的部署，以便每个触发器都使用更新的版本。

<div className='flex justify-center my-6'>
  <Image
    src='/static/execution/deployment-versions.png'
    alt='部署版本表'
    width={500}
    height={280}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

部署模式会保留完整的版本历史记录——可以检查任何快照，将其与草稿进行比较，并在需要恢复之前的版本时一键提升或回滚。

## 编程执行

使用我们的官方 SDK 从您的应用程序中执行工作流：

```bash
# TypeScript/JavaScript
npm install simstudio-ts-sdk

# Python
pip install simstudio-sdk
```

```typescript
// TypeScript Example
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({ 
  apiKey: 'your-api-key' 
});

const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello' }
});
```

## 最佳实践

### 设计可靠性
- 使用适当的回退路径优雅地处理错误
- 对敏感数据使用环境变量
- 在函数块中添加日志记录以进行调试

### 优化性能
- 尽量减少外部 API 调用
- 对独立操作使用并行执行
- 在适当情况下使用内存块缓存结果

### 监控执行
- 定期查看日志以了解性能模式
- 跟踪 AI 模型使用的成本
- 使用工作流快照调试问题

## 接下来是什么？

从 [执行基础](/execution/basics) 开始，了解工作流如何运行，然后探索 [日志记录](/execution/logging) 以监控您的执行情况，以及 [成本计算](/execution/costs) 以优化您的支出。
```

--------------------------------------------------------------------------------

---[FILE: logging.mdx]---
Location: sim-main/apps/docs/content/docs/zh/execution/logging.mdx

```text
---
title: 日志记录
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim 提供了全面的日志记录功能，涵盖所有工作流的执行情况，让您能够完全掌握工作流的运行方式、数据流动情况以及可能出现问题的地方。

## 日志系统

Sim 提供了两种互补的日志界面，以适应不同的工作流和使用场景：

### 实时控制台

在手动或聊天工作流执行期间，日志会实时显示在工作流编辑器右侧的控制台面板中：

<div className="flex justify-center">
  <Image
    src="/static/logs/console.png"
    alt="实时控制台面板"
    width={400}
    height={300}
    className="my-6"
  />
</div>

控制台显示：
- 块执行进度，突出显示活动块
- 块完成时的实时输出
- 每个块的执行时间
- 成功/错误状态指示器

### 日志页面

所有工作流的执行记录——无论是手动触发、通过 API、聊天、计划任务还是 Webhook——都会记录在专用的日志页面中：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs.png"
    alt="日志页面"
    width={600}
    height={400}
    className="my-6"
  />
</div>

日志页面提供：
- 按时间范围、状态、触发类型、文件夹和工作流的全面过滤功能
- 全日志搜索功能
- 实时模式以获取实时更新
- 7 天日志保留（可升级以延长保留时间）

## 日志详情侧边栏

点击任意日志条目会打开一个详细的侧边栏视图：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-sidebar.png"
    alt="日志侧边栏详情"
    width={600}
    height={400}
    className="my-6"
  />
</div>

### 块输入/输出

查看每个块的完整数据流，并通过标签切换查看：

<Tabs items={['输出', '输入']}>
  <Tab>
    **输出标签** 显示块的执行结果：
    - 以 JSON 格式显示的结构化数据
    - AI 生成内容的 Markdown 渲染
    - 便于数据提取的复制按钮
  </Tab>
  
  <Tab>
    **输入标签** 显示传递给块的内容：
    - 已解析的变量值
    - 其他块的引用输出
    - 使用的环境变量
    - 出于安全考虑，API 密钥会自动隐藏
  </Tab>
</Tabs>

### 执行时间线

对于工作流级别的日志，可查看详细的执行指标：
- 开始和结束时间戳
- 工作流总持续时间
- 各个模块的执行时间
- 性能瓶颈识别

## 工作流快照

对于任何已记录的执行，点击“查看快照”以查看执行时的确切工作流状态：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-frozen-canvas.png"
    alt="工作流快照"
    width={600}
    height={400}
    className="my-6"
  />
</div>

快照提供以下内容：
- 显示工作流结构的冻结画布
- 执行期间的模块状态和连接
- 点击任意模块查看其输入和输出
- 对于调试已修改的工作流非常有用

<Callout type="info">
  工作流快照仅适用于增强日志系统引入后的执行记录。较早迁移的日志会显示“未找到记录状态”消息。
</Callout>

## 日志保留

- **免费计划**：日志保留 7 天
- **专业计划**：日志保留 30 天
- **团队计划**：日志保留 90 天
- **企业计划**：可定制保留期限

## 最佳实践

### 开发阶段
- 使用实时控制台在测试期间获得即时反馈
- 检查模块输入和输出以验证数据流
- 使用工作流快照比较正常版本和出错版本

### 生产阶段
- 定期监控日志页面以发现错误或性能问题
- 设置过滤器以专注于特定工作流或时间段
- 在关键部署期间使用实时模式实时监控执行

### 调试阶段
- 始终检查执行时间线以识别运行缓慢的模块
- 比较正常和失败执行之间的输入
- 使用工作流快照查看问题发生时的确切状态

## 下一步

- 了解 [成本计算](/execution/costs) 以理解工作流定价
- 探索 [外部 API](/execution/api) 以编程方式访问日志
- 设置 [通知](/execution/api#notifications) 以通过 webhook、电子邮件或 Slack 接收实时警报
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/getting-started/index.mdx

```text
---
title: 入门指南
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import {
  AgentIcon,
  ApiIcon,
  ChartBarIcon,
  CodeIcon,
  ConditionalIcon,
  ConnectIcon,
  ExaAIIcon,
  FirecrawlIcon,
  GmailIcon,
  NotionIcon,
  PerplexityIcon,
  SlackIcon,
} from '@/components/icons'
import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

在 10 分钟内构建您的第一个 AI 工作流。在本教程中，您将创建一个使用先进的 LLM 驱动搜索工具来提取和结构化个人信息的人员研究代理。

<Callout type="info">
  本教程涵盖了在 Sim 中构建工作流的基本概念。预计完成时间：10 分钟。
</Callout>

## 您将构建的内容

一个人员研究代理，它可以：
1. 通过聊天界面接受用户输入
2. 使用 AI 驱动的工具（Exa 和 Linkup）进行网络搜索
3. 提取并结构化个人信息
4. 返回包含位置、职业和教育的格式化 JSON 数据

<Image
  src="/static/getting-started/started-1.png"
  alt="入门示例"
  width={800}
  height={500}
/>

## 分步教程

<Steps>
  <Step title="创建工作流并添加 AI 代理">
    在仪表板中点击 **New Workflow** 并将其命名为 "Getting Started"。
    
    每个新工作流默认包含一个 **Start block**——这是接收用户输入的入口点。由于我们将通过聊天触发此工作流，因此无需对 Start block 进行配置。
    
    从左侧面板将一个 **Agent Block** 拖到画布上并进行配置：
    - **Model**：选择 "OpenAI GPT-4o"
    - **System Prompt**："您是一个人员研究代理。当给定一个人的名字时，使用您可用的搜索工具查找有关他们的全面信息，包括他们的位置、职业、教育背景和其他相关细节。"
    - **User Prompt**：将 Start block 的输出连接拖到此字段中以连接 `<start.input>` 到用户提示
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-2.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="为代理添加搜索工具">
    为您的代理增强网络搜索功能。点击 Agent block 以选择它。
    
    在 **Tools** 部分：
    - 点击 **Add Tool**
    - 从可用工具中选择 **Exa** 和 **Linkup**
    - 提供这两个工具的 API 密钥以启用网络搜索和数据访问
    
    <div className="mx-auto w-3/5 overflow-hidden rounded-lg">
      <Video src="getting-started/started-3.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="测试您的工作流">
    使用屏幕右侧的 **Chat panel** 测试您的工作流。
    
    在聊天面板中：
    - 点击下拉菜单并选择 `agent1.content` 查看代理的输出
    - 输入测试消息："John 是一名来自旧金山的软件工程师，他在斯坦福大学学习了计算机科学。"
    - 点击 **Send** 执行工作流
    
    代理将分析此人并返回结构化信息。
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-4.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="配置结构化输出">
    配置您的代理以返回结构化的 JSON 数据。点击 Agent block 以选择它。
    
    在 **Response Format** 部分：
    - 点击 **magic wand icon** (✨) 在 schema 字段旁边
    - 输入提示："创建一个名为 person 的 schema，其中包含 location、profession 和 education"
    - AI 将自动生成 JSON schema
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-5.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="测试结构化输出">
    返回到 **Chat panel** 测试结构化响应格式。
    
    配置响应格式后，现在可以使用新的输出选项：
    - 点击下拉菜单并选择结构化输出选项（您刚刚创建的 schema）
    - 输入测试消息："Sarah 是一名来自纽约的市场经理，她拥有哈佛商学院的 MBA 学位。"
    - 点击 **Send** 执行工作流
    
    代理现在将返回结构化的 JSON 输出，其中包含按位置、职业和教育字段组织的个人信息。
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-6.mp4" width={700} height={450} />
    </div>
  </Step>
</Steps>

## 您已构建的内容

您已成功创建了一个 AI 工作流，该工作流：
- ✅ 通过聊天界面接受用户输入
- ✅ 使用 AI 处理非结构化文本
- ✅ 集成外部搜索工具（Exa 和 Linkup）
- ✅ 使用 AI 生成的模式返回结构化 JSON 数据
- ✅ 展示实时测试和迭代
- ✅ 展现了可视化、无代码开发的强大功能

## 您学到的关键概念

### 使用的模块类型

<Files>
  <File
    name="开始模块"
    icon={<ConnectIcon className="h-4 w-4" />}
    annotation="用户输入的入口点（自动包含）"
  />
  <File
    name="代理模块"
    icon={<AgentIcon className="h-4 w-4" />}
    annotation="用于文本处理和分析的 AI 模型"
  />
</Files>

### 核心工作流概念

**数据流**  
通过拖动连接线将数据传递到工作流步骤之间

**聊天界面**  
通过聊天面板实时测试工作流，并选择不同的输出选项

**工具集成**  
通过集成 Exa 和 Linkup 等外部服务扩展代理功能

**变量引用**  
使用 `<blockName.output>` 语法访问模块输出

**结构化输出**  
定义 JSON 模式以确保 AI 响应的一致性和格式化

**AI 生成的模式**  
使用魔法棒 (✨) 从自然语言提示生成模式

**迭代开发**  
通过即时反馈快速构建、测试和优化工作流

## 下一步

<Cards>
  <Card title="探索工作流模块" href="/blocks">
    发现 API、函数、条件等工作流模块
  </Card>
  <Card title="浏览集成工具" href="/tools">
    连接包括 Gmail、Slack、Notion 等在内的 80 多种服务
  </Card>
  <Card title="添加自定义逻辑" href="/blocks/function">
    编写自定义函数以进行高级数据处理
  </Card>
  <Card title="部署您的工作流" href="/execution">
    通过 REST API 或 Webhooks 使您的工作流可访问
  </Card>
</Cards>

## 资源

**需要详细说明？** 请访问 [模块文档](/blocks)，获取每个组件的全面指南。

**寻找集成工具？** 浏览 [工具文档](/tools)，查看所有 80 多种可用集成工具。

**准备上线了吗？** 了解 [执行和部署](/execution)，使您的工作流达到生产就绪状态。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/introduction/index.mdx

```text
---
title: 简介
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Sim 是一个开源的可视化工作流构建器，用于构建和部署 AI 代理工作流。通过无代码界面设计智能自动化系统——通过直观的拖放画布连接 AI 模型、数据库、API 和业务工具。无论是构建聊天机器人、自动化业务流程，还是协调复杂的数据管道，Sim 都提供了将 AI 工作流变为现实的工具。

<div className="flex justify-center">
  <Image
    src="/static/introduction.png"
    alt="Sim 可视化工作流画布"
    width={700}
    height={450}
    className="my-6"
  />
</div>

## 您可以构建的内容

**AI 助手与聊天机器人**  
构建与您的工具和数据集成的智能对话代理。启用网页搜索、日历管理、电子邮件自动化以及与业务系统的无缝交互等功能。

**业务流程自动化**  
消除组织中的手动任务。自动化数据输入、生成报告、响应客户询问，并简化内容创建工作流。

**数据处理与分析**  
将原始数据转化为可操作的洞察。提取文档信息、执行数据集分析、生成自动化报告，并在各平台间同步数据。

**API 集成工作流**  
协调复杂的多服务交互。创建统一的 API 端点，实施复杂的业务逻辑，并构建事件驱动的自动化系统。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/chat-workflow.mp4" width={700} height={450} />
</div>

## 工作原理

**可视化工作流编辑器**  
使用直观的拖放画布设计工作流。通过可视化的无代码界面连接 AI 模型、数据库、API 和第三方服务，使复杂的自动化逻辑易于理解和维护。

**模块化块系统**  
使用专业组件构建：处理块（AI 代理、API 调用、自定义函数）、逻辑块（条件分支、循环、路由器）和输出块（响应、评估器）。每个块在工作流中处理特定任务。

**灵活的执行触发器**  
通过多种渠道启动工作流，包括聊天界面、REST API、webhook、计划的 cron 作业或来自 Slack 和 GitHub 等平台的外部事件。

**实时协作**  
让您的团队共同构建。多个用户可以同时编辑工作流，支持实时更新和细粒度的权限控制。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/build-workflow.mp4" width={700} height={450} />
</div>

## 集成

Sim 提供了跨多个类别的 80 多种服务的原生集成：

- **AI 模型**：OpenAI、Anthropic、Google Gemini、Groq、Cerebras、本地模型（通过 Ollama 或 VLLM）
- **通信**：Gmail、Slack、Microsoft Teams、Telegram、WhatsApp  
- **生产力**：Notion、Google Workspace、Airtable、Monday.com
- **开发**：GitHub、Jira、Linear、自动化浏览器测试
- **搜索与数据**：Google 搜索、Perplexity、Firecrawl、Exa AI
- **数据库**：PostgreSQL、MySQL、Supabase、Pinecone、Qdrant

对于自定义集成，请利用我们的 [MCP（模型上下文协议）支持](/mcp) 来连接任何外部服务或工具。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/integrations-sidebar.mp4" width={700} height={450} />
</div>

## Copilot

**提问并获取指导**  
Copilot 回答关于 Sim 的问题，解释您的工作流程，并提供改进建议。使用 `@` 符号引用工作流程、模块、文档、知识和日志，以获得上下文帮助。

**构建和编辑工作流程**  
切换到代理模式，让 Copilot 直接在您的画布上提出并应用更改。通过自然语言命令添加模块、配置设置、连接变量并重组工作流程。

**自适应推理级别**  
根据任务复杂性选择快速、自动、高级或巨兽模式。对于简单问题，从快速模式开始；对于复杂的架构更改和深度调试，升级到巨兽模式。

了解更多关于 [Copilot 功能](/copilot) 的信息，以及如何通过 AI 辅助最大化生产力。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/copilot-workflow.mp4" width={700} height={450} />
</div>

## 部署选项

**云托管**  
在 [sim.ai](https://sim.ai) 上立即启动，享受完全托管的基础设施、自动扩展和内置可观测性。在我们处理运营的同时，专注于构建工作流程。

**自托管**  
使用 Docker Compose 或 Kubernetes 部署在您自己的基础设施上。通过 Ollama 集成支持本地 AI 模型，完全掌控您的数据。

## 下一步

准备好构建您的第一个 AI 工作流程了吗？

<Cards>
  <Card title="入门指南" href="/getting-started">
    在 10 分钟内创建您的第一个工作流程
  </Card>
  <Card title="工作流程模块" href="/blocks">
    了解构建模块
  </Card>
  <Card title="工具和集成" href="/tools">
    探索 80 多种内置集成
  </Card>
  <Card title="团队权限" href="/permissions/roles-and-permissions">
    设置工作区角色和权限
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/knowledgebase/index.mdx

```text
---
title: 概览
description: 通过智能向量搜索和分块功能上传、处理并搜索您的文档
---

import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

知识库允许您通过智能向量搜索和分块功能上传、处理并搜索您的文档。各种类型的文档会被自动处理、嵌入并变得可搜索。您的文档会被智能分块，您可以使用自然语言查询来查看、编辑和搜索它们。

## 上传与处理

只需上传您的文档即可开始。Sim 会在后台自动处理它们，提取文本、创建嵌入并将其分成可搜索的块。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-1.mp4" width={700} height={450} />
</div>

系统为您处理整个处理流程：

1. **文本提取**：使用针对每种文件类型的专用解析器从文档中提取内容
2. **智能分块**：将文档分成有意义的块，并可配置大小和重叠
3. **嵌入生成**：创建向量嵌入以实现语义搜索功能
4. **处理状态**：在文档处理时跟踪进度

## 支持的文件类型

Sim 支持 PDF、Word (DOC/DOCX)、纯文本 (TXT)、Markdown (MD)、HTML、Excel (XLS/XLSX)、PowerPoint (PPT/PPTX) 和 CSV 文件。每个文件最大可达 100MB，文件小于 50MB 时性能最佳。您可以同时上传多个文档，PDF 文件还包括对扫描文档的 OCR 处理。

## 查看和编辑分块

文档处理完成后，您可以查看和编辑各个分块。这使您可以完全控制内容的组织和搜索方式。

<Image src="/static/knowledgebase/knowledgebase.png" alt="显示已处理内容的文档分块视图" width={800} height={500} />

### 分块配置
- **默认分块大小**：1,024 个字符
- **可配置范围**：每块 100-4,000 个字符
- **智能重叠**：默认重叠 200 个字符以保留上下文
- **分层拆分**：遵循文档结构（章节、段落、句子）

### 编辑功能
- **编辑分块内容**：修改单个分块的文本内容
- **调整分块边界**：根据需要合并或拆分分块
- **添加元数据**：为分块添加额外的上下文信息
- **批量操作**：高效管理多个分块

## 高级 PDF 处理

对于 PDF 文档，Sim 提供增强的处理功能：

### OCR 支持
当配置了 Azure 或 [Mistral OCR](https://docs.mistral.ai/ocr/) 时：
- **扫描文档处理**：从基于图像的 PDF 中提取文本
- **混合内容处理**：处理同时包含文本和图像的 PDF
- **高精度**：先进的 AI 模型确保准确的文本提取

## 在工作流中使用知识块

一旦您的文档被处理，您可以通过知识块在 AI 工作流中使用它们。这使得检索增强生成（RAG）成为可能，让您的 AI 代理能够访问并推理文档内容，从而提供更准确、有上下文的响应。

<Image src="/static/knowledgebase/knowledgebase-2.png" alt="在工作流中使用知识块" width={800} height={500} />

### 知识块功能
- **语义搜索**：使用自然语言查询查找相关内容
- **上下文集成**：自动将相关分块包含在代理提示中
- **动态检索**：在工作流执行期间实时搜索
- **相关性评分**：根据语义相似性对结果进行排名

### 集成选项
- **系统提示**：为您的 AI 代理提供上下文
- **动态上下文**：在对话中搜索并包含相关信息
- **多文档搜索**：在整个知识库中查询
- **过滤搜索**：结合标签实现精确内容检索

## 向量搜索技术

Sim 使用由 [pgvector](https://github.com/pgvector/pgvector) 提供支持的向量搜索来理解您的内容的含义和上下文：

### 语义理解
- **上下文搜索**：即使精确的关键词不匹配，也能找到相关内容
- **基于概念的检索**：理解想法之间的关系
- **多语言支持**：支持跨不同语言工作
- **同义词识别**：找到相关术语和概念

### 搜索功能
- **自然语言查询**：用简单的英语提问
- **相似性搜索**：找到概念上相似的内容
- **混合搜索**：结合向量和传统关键词搜索
- **可配置结果**：控制结果的数量和相关性阈值

## 文档管理

### 组织功能
- **批量上传**：通过异步 API 一次上传多个文件
- **处理状态**：实时更新文档处理状态
- **搜索和过滤**：在大型集合中快速找到文档
- **元数据跟踪**：自动捕获文件信息和处理详情

### 安全性和隐私
- **安全存储**：文档以企业级安全性存储
- **访问控制**：基于工作区的权限设置
- **处理隔离**：每个工作区的文档处理是独立的
- **数据保留**：配置文档保留策略

## 快速入门

1. **导航到您的知识库**：从工作区侧边栏访问
2. **上传文档**：拖放或选择文件进行上传
3. **监控处理**：查看文档的处理和分块进度
4. **探索分块**：查看和编辑处理后的内容
5. **添加到工作流**：使用知识块与您的 AI 代理集成

知识库将您的静态文档转化为智能的、可搜索的资源，使您的 AI 工作流能够利用这些资源提供更有信息量和上下文的响应。
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/zh/knowledgebase/tags.mdx

```text
---
title: 标签与筛选
---

import { Video } from '@/components/ui/video'

标签提供了一种强大的方式来组织文档，并为向量搜索创建精确的筛选。通过将基于标签的筛选与语义搜索相结合，您可以从知识库中检索到所需的确切内容。

## 向文档添加标签

您可以为知识库中的任何文档添加自定义标签，以便更轻松地组织和分类内容，从而更方便地检索。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag.mp4" width={700} height={450} />
</div>

### 标签管理
- **自定义标签**：创建适合您工作流程的标签系统
- **每个文档多个标签**：每个文档可以应用多个标签，知识库中共有 7 个标签槽位，所有文档共享
- **标签组织**：通过一致的标签将相关文档分组

### 标签最佳实践
- **一致的命名**：在文档中使用标准化的标签名称
- **描述性标签**：使用清晰、有意义的标签名称
- **定期清理**：定期移除未使用或过时的标签

## 在知识块中使用标签

当标签与工作流程中的知识块结合时，其功能会变得更加强大。您可以将搜索限定在特定的标签内容中，确保您的 AI 代理获取最相关的信息。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag2.mp4" width={700} height={450} />
</div>

## 搜索模式

知识块支持三种不同的搜索模式，具体取决于您提供的内容：

### 1. 仅标签搜索
当您**仅提供标签**（没有搜索查询）时：
- **直接检索**：获取所有具有指定标签的文档
- **无向量搜索**：结果仅基于标签匹配
- **快速性能**：无需语义处理即可快速检索
- **精确匹配**：仅返回具有所有指定标签的文档

**使用场景**：当您需要特定类别或项目的所有文档时

### 2. 仅向量搜索
当您**仅提供搜索查询**（无标签）时：
- **语义搜索**：根据含义和上下文查找内容
- **完整知识库**：搜索所有文档
- **相关性排序**：结果按语义相似性排序
- **自然语言**：使用问题或短语查找相关内容

**使用场景**：当您需要最相关的内容而不考虑组织结构时

### 3. 标签过滤 + 向量搜索结合
当您**同时提供标签和搜索查询**时：
1. **首先**：过滤文档，仅保留具有指定标签的文档
2. **然后**：在过滤后的子集中执行向量搜索
3. **结果**：仅从带标签的文档中获取语义相关的内容

**使用场景**：当您需要特定类别或项目中的相关内容时

### 搜索配置

#### 标签过滤
- **多个标签**：使用多个标签实现 OR 逻辑（文档必须包含一个或多个标签）
- **标签组合**：混合不同类型的标签以实现精确过滤
- **大小写敏感性**：标签匹配不区分大小写
- **部分匹配**：需要精确匹配标签名称

#### 向量搜索参数
- **查询复杂性**：自然语言问题效果最佳
- **结果限制**：配置要检索的内容块数量
- **相关性阈值**：设置最低相似度分数
- **上下文窗口**：根据您的使用场景调整内容块大小

## 与工作流的集成

### 知识块配置
1. **选择知识库**：选择要搜索的知识库
2. **添加标签**：指定过滤标签（可选）
3. **输入查询**：添加您的搜索查询（可选）
4. **配置结果**：设置要检索的内容块数量
5. **测试搜索**：在工作流中使用前预览结果

### 动态标签使用
- **变量标签**：使用工作流变量作为标签值
- **条件过滤**：根据工作流逻辑应用不同的标签
- **上下文感知搜索**：根据对话上下文调整标签
- **多步骤过滤**：通过工作流步骤优化搜索

### 性能优化
- **高效过滤**：标签过滤在向量搜索之前进行，以提高性能
- **缓存**：常用的标签组合会被缓存以提高速度
- **并行处理**：可以同时运行多个标签搜索
- **资源管理**：自动优化搜索资源

## 标签入门

1. **规划标签结构**：制定一致的命名规范
2. **开始添加标签**：为现有文档添加相关标签
3. **测试组合**：尝试标签与搜索查询的组合
4. **集成到工作流中**：将知识模块与标签策略结合使用
5. **持续优化**：根据搜索结果调整标签方法

标签将您的知识库从一个简单的文档存储转变为一个精确组织、可搜索的智能系统，使您的 AI 工作流能够以极高的精确度进行导航。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/mcp/index.mdx

```text
---
title: MCP（模型上下文协议）
---

import { Image } from '@/components/ui/image'
import { Callout } from 'fumadocs-ui/components/callout'

模型上下文协议（[MCP](https://modelcontextprotocol.com/)）允许您使用标准化协议连接外部工具和服务，从而将 API 和服务直接集成到您的工作流程中。通过 MCP，您可以通过添加自定义集成来扩展 Sim 的功能，使其与您的代理和工作流程无缝协作。

## 什么是 MCP？

MCP 是一项开放标准，使 AI 助手能够安全地连接到外部数据源和工具。它提供了一种标准化的方法来：

- 连接数据库、API 和文件系统
- 访问外部服务的实时数据
- 执行自定义工具和脚本
- 维护对外部资源的安全、受控访问

## 配置 MCP 服务器

MCP 服务器提供工具集合，供您的代理使用。您可以在工作区设置中进行配置：

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-1.png"
    alt="在设置中配置 MCP 服务器"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. 进入您的工作区设置
2. 转到 **MCP 服务器** 部分
3. 点击 **添加 MCP 服务器**
4. 输入服务器配置详情
5. 保存配置

<Callout type="info">
您还可以直接从代理模块的工具栏中配置 MCP 服务器，以便快速设置。
</Callout>

## 在代理中使用 MCP 工具

一旦配置了 MCP 服务器，其工具将在您的代理模块中可用：

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-2.png"
    alt="在代理模块中使用 MCP 工具"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. 打开一个 **代理** 模块
2. 在 **工具** 部分，您将看到可用的 MCP 工具
3. 选择您希望代理使用的工具
4. 代理现在可以在执行过程中访问这些工具

## 独立的 MCP 工具模块

为了更精细的控制，您可以使用专用的 MCP 工具模块来执行特定的 MCP 工具：

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-3.png"
    alt="独立的 MCP 工具模块"
    width={700}
    height={450}
    className="my-6"
  />
</div>

MCP 工具模块允许您：
- 直接执行任何已配置的 MCP 工具
- 向工具传递特定参数
- 在后续工作流步骤中使用工具的输出
- 将多个 MCP 工具串联在一起

### 何时使用 MCP 工具与代理

**在以下情况下使用带有 MCP 工具的代理：**
- 您希望 AI 决定使用哪些工具
- 您需要复杂的推理来决定何时以及如何使用工具
- 您希望与工具进行自然语言交互

**在以下情况下使用 MCP 工具块：**
- 您需要确定性的工具执行
- 您希望使用已知参数执行特定工具
- 您正在构建具有可预测步骤的结构化工作流

## 权限要求

MCP 功能需要特定的工作区权限：

| 操作 | 所需权限 |
|--------|-------------------|
| 在设置中配置 MCP 服务器 | **管理员** |
| 在代理中使用 MCP 工具 | **写入** 或 **管理员** |
| 查看可用的 MCP 工具 | **读取**、**写入** 或 **管理员** |
| 执行 MCP 工具块 | **写入** 或 **管理员** |

## 常见使用场景

### 数据库集成
连接到数据库以在工作流中查询、插入或更新数据。

### API 集成
访问没有内置 Sim 集成的外部 API 和 Web 服务。

### 文件系统访问
读取、写入和操作本地或远程文件系统上的文件。

### 自定义业务逻辑
执行特定于您组织需求的自定义脚本或工具。

### 实时数据访问
在工作流执行期间从外部系统获取实时数据。

## 安全注意事项

- MCP 服务器以配置它的用户权限运行
- 安装前始终验证 MCP 服务器来源
- 对于敏感的配置数据，请使用环境变量
- 在授予代理访问权限之前，审查 MCP 服务器功能

## 故障排除

### MCP 服务器未显示
- 验证服务器配置是否正确
- 检查您是否具有所需权限
- 确保 MCP 服务器正在运行且可访问

### 工具执行失败
- 验证工具参数格式是否正确
- 检查 MCP 服务器日志中的错误消息
- 确保已配置所需的身份验证

### 权限错误
- 确认您的工作区权限级别
- 检查 MCP 服务器是否需要额外的身份验证
- 验证服务器是否已为您的工作区正确配置
```

--------------------------------------------------------------------------------

---[FILE: roles-and-permissions.mdx]---
Location: sim-main/apps/docs/content/docs/zh/permissions/roles-and-permissions.mdx

```text
---
title: 角色和权限
---

import { Video } from '@/components/ui/video'

当您邀请团队成员加入您的组织或工作区时，您需要选择授予他们的访问级别。本指南解释了每个权限级别允许用户执行的操作，帮助您了解团队角色以及每个权限级别提供的访问权限。

## 如何邀请他人加入工作区

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="invitations.mp4" width={700} height={450} />
</div>

## 工作区权限级别

邀请某人加入工作区时，您可以分配以下三种权限级别之一：

| 权限 | 他们可以做什么 |
|------------|------------------|
| **只读** | 查看工作流、查看执行结果，但无法进行任何更改 |
| **编辑** | 创建和编辑工作流、运行工作流、管理环境变量 |
| **管理员** | 包括编辑权限的所有操作，还可以邀请/移除用户并管理工作区设置 |

## 每个权限级别的具体操作

以下是每个权限级别允许用户执行的详细操作：

### 只读权限
**适合人群：** 利益相关者、观察者或需要可见性但不应进行更改的团队成员

**他们可以做的事情：**
- 查看工作区中的所有工作流
- 查看工作流的执行结果和日志
- 浏览工作流配置和设置
- 查看环境变量（但不能编辑）

**他们不能做的事情：**
- 创建、编辑或删除工作流
- 运行或部署工作流
- 更改任何工作区设置
- 邀请其他用户

### 编辑权限  
**适合人群：** 开发人员、内容创作者或积极从事自动化工作的团队成员

**他们可以做的事情：**
- 包括只读用户的所有操作，以及：
- 创建、编辑和删除工作流
- 运行和部署工作流
- 添加、编辑和删除工作区环境变量
- 使用所有可用的工具和集成
- 实时协作编辑工作流

**他们不能做的事情：**
- 邀请或移除工作区的用户
- 更改工作区设置
- 删除工作区

### 管理员权限
**适合人群：** 团队负责人、项目经理或需要管理工作区的技术负责人

**他们可以做的事情：**
- 所有“写入”用户可以做的事情，以及：
- 邀请新用户加入工作区，并分配任何权限级别
- 从工作区移除用户
- 管理工作区设置和集成
- 配置外部工具连接
- 删除其他用户创建的工作流

**他们不能做的事情：**
- 删除工作区（只有工作区所有者可以执行此操作）
- 将工作区所有者从工作区中移除

---

## 工作区所有者与管理员

每个工作区都有一个**所有者**（创建工作区的人）以及任意数量的**管理员**。

### 工作区所有者
- 拥有所有管理员权限
- 可以删除工作区
- 无法从工作区中被移除
- 可以将所有权转移给其他用户

### 工作区管理员  
- 可以执行所有操作，但不能删除工作区或移除所有者
- 可以被所有者或其他管理员从工作区中移除

---

## 常见场景

### 添加新开发人员到您的团队
1. **组织级别：** 邀请他们成为**组织成员**
2. **工作区级别：** 赋予他们**写入**权限，以便他们可以创建和编辑工作流

### 添加项目经理
1. **组织级别：** 邀请他们成为**组织成员**
2. **工作区级别：** 赋予他们**管理员**权限，以便他们可以管理团队并查看所有内容

### 添加利益相关者或客户
1. **组织级别：** 邀请他们成为**组织成员**
2. **工作区级别：** 赋予他们**只读**权限，以便他们可以查看进度但无法进行更改

---

## 环境变量

用户可以创建两种类型的环境变量：

### 个人环境变量
- 仅对个人用户可见
- 在他们运行的所有工作流中可用
- 在用户设置中管理

### 工作区环境变量
- **读取权限**：可以查看变量名称和值
- **写入/管理员权限**：可以添加、编辑和删除变量
- 对所有工作区成员可用
- 如果个人变量与工作区变量同名，个人变量优先

---

## 最佳实践

### 从最低权限开始
为用户分配完成工作所需的最低权限级别。您可以随时提高权限。

### 明智地使用组织结构
- 将值得信任的团队负责人设为 **组织管理员**
- 大多数团队成员应为 **组织成员**
- 将工作区 **管理员** 权限保留给需要管理用户的人

### 定期审查权限
定期审查谁可以访问哪些内容，尤其是在团队成员更换角色或离职时。

### 环境变量安全
- 对于敏感的 API 密钥，使用个人环境变量
- 对于共享配置，使用工作区环境变量
- 定期审查谁可以访问敏感变量

---

## 组织角色

邀请某人加入您的组织时，您可以分配以下两种角色之一：

### 组织管理员
**他们可以做的事情：**
- 邀请和移除组织中的团队成员
- 创建新的工作区
- 管理账单和订阅设置
- 访问组织内的所有工作区

### 组织成员
**他们可以做的事情：**
- 访问他们被特定邀请加入的工作区
- 查看组织成员列表
- 无法邀请新成员或管理组织设置
```

--------------------------------------------------------------------------------

````
