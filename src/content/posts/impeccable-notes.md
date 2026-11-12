---
title: Impeccable 上手笔记：给 AI 编码助手装上设计词汇表
date: 2026-11-12
category: tech
tags: [AI, 前端工程, 设计规范, CLI]
excerpt: 把 Impeccable 手册压成一页能用的东西：怎么装、先喂什么上下文、24 个命令里前端真正会用的那一半，以及能进 CI 的 detect 检测器。
---

翻完一份 Impeccable 的操作手册，把前端真正用得上的部分抽出来记一页。它的定位是「给 AI 编码助手用的设计词汇表」——不是又一个界面生成器，而是装进 Claude Code / Cursor 这类工具里的技能包，作用在你自己仓库的代码上。

## 它到底改了什么

不装任何约束，让 AI 写页面，不同模型最后往往长出同一张脸。Impeccable 从三个层面干预：

| 层 | 做什么 | 要不要手动调 |
| --- | --- | --- |
| 设计知识层 | 颜色、排版、层级、动效、可访问性等维度的设计参考，随代码一起进上下文 | 不用，自动带 |
| 命令层 | 24 个命令（`polish` / `bolder` / `critique` …），让你用行话指挥 | 要，这是主要操作面 |
| 检测层 | 62 条确定性规则，纯规则匹配、不调大模型，专抓「AI 味」 | 三种入口可选 |

关键点：它不是往提示词里加一句「请做得好看一点」，而是把设计判断拆成了可复查的动作、可执行的规则和可继承的项目上下文。

## 安装：一条命令

```bash
npx impeccable install
```

安装器会探测你装了哪些编码工具、问你是项目级还是全局、可选的 design hook 建议装上（否则检测器只在「你记得跑」时才跑）。装完重载工具，输入斜杠能看到 `/impeccable`。Codex 里写法换成 `$impeccable`。

需要写进初始化脚本、跳过交互时：

```bash
npx impeccable install --providers=claude,codex,cursor --scope=project
```

`--scope` 取 `project`（只当前项目）或 `global`。

> 手册里还写了插件市场、VS Code 扩展、git submodule 锁版本、无 Node 手动复制这几条路。前端日常用 `npx` 这条就够；团队要锁版本时再上 submodule（注意 `link` 只装技能、不装 hook）。

## 第一步不是写页面，是喂上下文

这一步最容易被跳过，也是「效果一般」的根因。它能读你的代码，但读不出你的用户是谁。

```text
/impeccable init        # 生成 PRODUCT.md：为谁做、承诺什么、有什么约束
/impeccable document    # 生成 DESIGN.md：颜色、字体、组件、交互规则
```

`init` 只问那些代码里推不出来的问题，产出 `PRODUCT.md`。**一定要打开读一遍，把它理解错的地方改掉**——后续每个命令都会读这个文件。

`document` 适合已有视觉规范的项目（哪怕只是几组 CSS 变量），把现有令牌固化进 `DESIGN.md` 和 `.impeccable/design.json`。分工是：

- `DESIGN.md` —— 你维护，写给人看的设计真相
- `.impeccable/design.json` —— 工具消费的生成物，**不要手改**，要更新就重跑 `document`

`init` 还会问一个构建路径，写进 `.impeccable/config.json` 的 `buildPath`：先出图（视觉野心大，但图转代码会掉细节、要返工）或直接写代码（首版更连贯）。App 界面和文档类页面一律走直接写代码。

## 命令怎么用

最基本的形式是「命令 + 目标」：

```text
/impeccable polish the pricing page
/impeccable audit the checkout
/impeccable critique the onboarding flow
```

也可以完全不用命令名，直接描述你要改什么。单独输入 `/impeccable` 会列出全部命令。

一条最重要的原则：**目标越窄，结果越好**。审一个卡片组件比审整个页面有效得多。

24 个命令分六组，前端高频的是这几组：

| 组 | 命令 | 什么时候用 |
| --- | --- | --- |
| 评估 | `critique` | 打分式 UX 审查，按可用性启发式给出「先改哪个」的排序 |
| 评估 | `audit` | 技术体检：可访问性、性能、主题化、响应式，问题分 P0–P3 |
| 精修 | `typeset` | 修字体、层级、字号，让文字好读好扫 |
| 精修 | `layout` | 修间距、节奏、元素归属关系 |
| 精修 | `bolder` / `quieter` | 调整视觉音量，两者都强调「不破坏原有调性」 |
| 精修 | `distill` | 压缩信息密度，删掉页面上不需要的东西 |
| 加固 | `harden` | 错误态、断网、超长文本、空数据——AI 生成界面最容易漏的一层 |
| 加固 | `polish` | 交付前最后一轮打磨（注意：是「最后一公里」，不是重构） |
| 系统 | `document` / `extract` | 记录视觉系统；把重复出现的界面模式抽成共享组件 |

`polish` 是最高频的那个，但页面结构没定就 polish，等于给毛坯房刷漆。

几个常被忽略的命令：`audit` 的问题分级里 P0 是阻塞、P1 严重，先修 P0；`pin` 能把高频命令提成独立斜杠命令（`/impeccable pin audit` → 之后直接 `/audit`）；`doctor` 是排错第一步，会找出过期上下文、没用上的配置、坏掉的 hook。

### 一条能照抄的推进顺序

存量页面改造（手上有个能用但「一眼 AI」的页面）：

1. `init` + `document`，只做一次
2. `critique` 拿诊断和排序，**先只处理 P0**
3. 按症状挑命令，一次一个：版式乱用 `layout`，文字层级乱用 `typeset`，太平用 `bolder`，太杂用 `distill`
4. `harden` 处理边界
5. `polish` 收尾
6. `audit` 技术体检，修完 P0/P1 再跑一遍检测器

验收标准就三条：`critique` 分数明显提升、`audit` 无 P0、`detect` 退出码为 0。

从零做新页面时顺序不同——先想清楚再写码：`shape` 出设计 brief（存到 `surfaces/` 下，方向不对在这里改最便宜）→ 定 `buildPath` → 开做 → 然后照样走上面的第 2～6 步。跳过诊断直接 polish 是新页面最常见的错误。

## 为什么同一个命令在别的页面效果不一样

它会根据「用户来这个页面要做什么」套用四种模式之一。理解这个，才知道该期待什么：

| 模式 | 典型页面 | 设计策略 |
| --- | --- | --- |
| Persuade 说服 | 落地页、活动页、定价页 | 大胆、有观点、强视觉主张 |
| Operate 操作 | 后台、设置、编辑器 | 精确、克制、高信息密度 |
| Read 阅读 | 文档、指南、帮助中心 | 可读性优先，层级清晰 |
| Experience 体验 | 作品集、画廊、展示页 | 氛围与细节优先 |

页面用途模糊时，直接告诉 AI「访客来这里应该做什么」，它会据此判断。

## 检测器：唯一能进 CI 的部分

62 条确定性规则，跑得比对话快，结果也比对话稳。三种运行位置：

- **Agent 内 hook** —— 编辑界面文件时自动扫，结果回传 Agent。日常开发首选，抓得早
- **命令行 CLI** —— `npx impeccable detect`，适合 CI、提交前钩子
- **Chrome 扩展** —— 在当前页叠加标注，适合评审 PR 效果

```bash
npx impeccable detect src/                              # 扫目录
npx impeccable detect src/components/Card.tsx           # 扫单文件
npx impeccable detect http://localhost:3000             # 扫渲染后的页面
npx impeccable detect --json src/ > findings.json       # 机器可读
npx impeccable detect --list-rules                      # 列出全部 62 条规则
```

**源码扫描和页面扫描不是一回事**：源码扫描跑的是模式规则；需要渲染布局才能判断的规则（对比度不足、字号过小）只在扫网址时生效。所以真正的体检要两条都跑。

常用参数：

| 参数 | 作用 |
| --- | --- |
| `--json` | 输出 JSON 到 stdout，人类可读信息走 stderr |
| `--github` | 输出 GitHub Actions 注解 |
| `--viewport 390x844` | 指定视口，默认 1280×800，测移动端用这个 |
| `--scope type,layout` | 只跑指定领域的规则 |
| `--no-design-system` | 跳过设计系统一致性检查 |
| `--quiet` / `--no-advisory` | 只输出计数 / 隐藏建议项 |

退出码是接 CI 的关键：`0` 无主要问题，`2` 存在主要问题，`1` 表示有目标扫不了（路径错、网址打不开、要登录），应视为环境问题而不是失败。

误报的正确处理是记一笔窄口径例外，而不是关掉整条规则：

```bash
npx impeccable ignores add-value overused-font Inter --reason "品牌字体"
```

这样只对 Inter 放行，其他字体仍然生效。单文件放行用行内注释并注明原因。**能窄就不要宽**——直接关掉一条规则，等于把这条规则以后所有的真问题也一起关了。

另外，一旦 `DESIGN.md` 里有具体值，检测器会自动启用四条设计系统规则（字体、颜色、圆角、字号是否越界）。只放一个空文件没用。

## live 模式：在浏览器里点着改

前面都是「说一句话、等一轮结果」。`/impeccable live` 换个交互：打开你运行中的 dev server，叠一层覆盖界面，在页面上点元素、选方向，它就地把多个变体热替换进去，接受哪个就写回源码。

支持 Vite、Next、SvelteKit、Astro、Nuxt 和纯 HTML。默认在现有视觉身份内探索，不会突然换风格。

两条红线值得单独记：

1. **只改本地代码库**，不要注入到已部署的线上站点，也不要为了让它在线上跑通而放宽生产环境的安全策略。
2. 接受修改时它会执行 `package.json` 里可选的 `manual-edit-validate` 脚本（用的是你的权限）；点 Apply 时如果一分钟内没有 Agent 在轮询，它会直接调 `codex`（或 `claude`）命令行，且关闭了审批、权限检查和沙箱。陌生仓库里用之前先看一眼那个脚本写了什么。

## 目录与排错

跑完一轮之后，项目里会长出这些：

```text
your-project/
├── PRODUCT.md                # 产品上下文
├── DESIGN.md                 # 视觉系统
├── .impeccable/
│   ├── config.json           # 项目配置（含 buildPath）
│   ├── config.local.json     # 本地覆盖，不进版本库
│   ├── design.json           # 设计令牌元数据（生成物，勿手改）
│   ├── surfaces/             # 每个页面的 brief
│   ├── critique/             # critique 快照
│   └── ignore.md             # 你维护的例外清单
└── .claude/skills/impeccable/   # 安装位置随工具不同
```

排错的正确顺序（很多人第一反应是换模型、换措辞，方向反了）：

1. 跑 `doctor`，看配置层
2. 读 `PRODUCT.md`，看上下文层
3. 用 `critique` 拿具体诊断，而不是靠感觉
4. 最后才是调提示词

常见坑：`hook` 不生效多半是没被信任（Codex 去 `/hooks` 批准，升级后 hook 内容变了要重新批准一次）；「生成结果很泛」几乎都是上下文缺失或过期，不是模型问题。

## 一点说明

官方支持列表里没有 WorkBuddy。它同样以 `SKILL.md` 组织技能，理论上可以把技能目录复制到全局或项目技能目录里试试，但要自行验证。更稳妥的用法是：在 Claude Code / Cursor 里跑 `init`、`document` 和 `critique`，把 `PRODUCT.md`、`DESIGN.md` 和检测结果当成设计依据，再回到实际写代码的地方落地。
