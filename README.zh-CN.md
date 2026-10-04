# Nugget

[English](README.md) | 简体中文

**从杂乱的 Brief 中，找到真正有价值的设计机会。**

Nugget 是一个面向学生和独立设计师的全球设计竞赛雷达，以及本地优先的 AI Studio。它帮助设计师发现值得参与的公开竞赛，理解报名费用、奖项、参赛资格和截止日期等信息，并将 Brief 转化为结构化的提案方案包。

## 核心功能

- 可用于作品集展示的首页与响应式产品 UI
- 覆盖不同国家、语言和设计领域的全球竞赛雷达
- 支持搜索、类别、费用、参赛资格、竞赛类型、奖项和截止日期筛选
- 免费参赛优先的推荐评分
- 来源可信度分级，包括官网和微信来源
- 竞赛详情面板，展示奖项、参赛资格、截止日期和来源依据
- 从 Discover 页面一键进入 Studio 分析
- 七阶段工作流：文件、参赛资格、提交成果、概念确认、图像生成、排版、审核和模拟提交回执
- 使用内置 Demo 素材或实时 OpenAI 图像生成，产出三张竞赛视觉图
- 可编辑的设计说明、自动展板组合和可下载的提交清单
- 由用户审核的模拟提交流程，并提供跳转官方页面的入口
- 内置真实感家具竞赛 Brief
- 一键访问 `/demo` route，查看已生成的输出结果
- 结构化 Mock AI 分析，包含三个完整概念方向
- 可选 OpenAI 和 Anthropic provider adapters
- 本地项目保存、重新打开和删除
- Markdown 和 JSON 导出
- 桌面端和移动端验证截图
- Playwright 端到端 smoke test

## 技术栈

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Browser `localStorage`
- Playwright
- Lucide icons

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

打开竞赛雷达：[http://localhost:3000/discover](http://localhost:3000/discover)。

打开完整学生参赛工作流 Demo：[http://localhost:3000/production?competition=real-leather-student-2026](http://localhost:3000/production?competition=real-leather-student-2026)。

如需查看已完成的 Studio 即时 Demo，打开 [http://localhost:3000/demo](http://localhost:3000/demo)。

## Demo 流程

1. 打开 **Discover**。
2. 按免费参赛、设计领域、参赛资格或竞赛类型进行筛选。
3. 打开某个竞赛，查看奖项、参赛资格、截止日期和来源信息。
4. 点击 **用 Nugget 分析这场比赛**。
5. 查看竞赛要求和三个概念方向。
6. 保存项目，或导出为 Markdown / JSON。

如需体验端到端工作流，打开一个符合条件的竞赛，并点击 **进入参赛工作流**。Nugget 会检查规则和参赛资格，提取提交成果，生成概念和视觉图，组合展板，支持编辑与确认，下载提交清单，并生成模拟提交回执。

## 竞赛数据

当前竞赛雷达使用的是一套完整的 Demo 索引，用于验证产品体验。它不声称已经实现全网实时覆盖。生产版本还需要定时采集器、数据库、多语言搜索、按来源定制的解析器、去重机制，以及每日截止日期和来源复核。

## 环境变量

将 `.env.example` 复制为 `.env.local`：

```env
AI_PROVIDER=mock
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

`AI_PROVIDER` 支持的值为 `mock`、`openai` 和 `anthropic`。缺少 key 时会始终回退到 mock mode。Key 只会由 server route 读取，不会暴露给浏览器。

如果没有 `OPENAI_API_KEY`，production workflow 会使用内置设计样例。配置有效 key 后，它会通过 OpenAI Images API 生成三张新的 PNG 视觉图。

## Mock AI

Mock mode 是默认的完整体验。它会识别输入 Brief 中的基础信号，例如标题、截止日期、费用和设计领域，然后返回详细的竞赛策略，以及三个经过整理的家具设计方向。它不需要网络请求或 API Key。

## 导出

Studio 和 Library 提供：

- **Markdown:** 可读的提案文档，包含要求、概念、prompts、设计说明和 checklist。
- **JSON:** 完整的 typed project record，包含原始 Brief 和时间戳。

下载文件会在浏览器本地生成。

## 常用命令

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run demo:screenshots
```

截图会写入 `artifacts/screenshots/`。

## 后续规划

- 可编辑的概念细化
- 用户自定义竞赛发现来源
- 可导出的 PDF/JPG 展示板
- 针对具体网站的认证提交流程 adapter
- 云端同步和协作审核
- Provider model selection 和结构化 schema validation
- 提交日历和截止日期提醒
