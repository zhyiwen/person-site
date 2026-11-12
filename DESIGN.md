---
name: 译文 · 个人站
description: 霓虹夜航 × 极昼实验室——终端隐喻的个人数字花园，代码与笔墨同栖
colors:
  bg: "#f3f6fa"
  bg-dark: "#0a0f16"
  surface: "#ffffff"
  surface-dark: "#0f1620"
  surface-2: "#e9eef5"
  surface-2-dark: "#16202e"
  text: "#101c2e"
  text-dark: "#dde7f2"
  muted: "#5b6b80"
  muted-dark: "#8798ad"
  faint: "#5f6c7b"
  faint-dark: "#74889e"
  line: "#dbe3ed"
  line-dark: "#1c2836"
  primary: "#06a6d6"
  primary-dark: "#2bd9ff"
  primary-text: "#05719a"
  primary-text-dark: "#2bd9ff"
  reading-text: "#6a4ae0"
  reading-text-dark: "#8b7bff"
  calligraphy-text: "#9c5109"
  calligraphy-text-dark: "#ffb454"
  stone-text: "#647084"
  stone-text-dark: "#93a6bd"
  primary-2: "#7c5cff"
  primary-2-dark: "#8b7bff"
  calligraphy: "#d97a1f"
  calligraphy-dark: "#ffb454"
  green: "#07c160"
  green-dark: "#12c96a"
  sand: "#c0801c"
  sand-dark: "#ffc266"
  stone: "#7d8fa3"
  stone-dark: "#93a6bd"
  seal-paper: "#f6f3ec"
  term-red: "#ff5f57"
  term-yellow: "#febc2e"
  term-green: "#28c840"
typography:
  display:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "42px"
    fontWeight: 700
  quote:
    fontFamily: "'Songti SC', 'STSong', serif"
    fontSize: "19px"
  display-sm:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "32px"
  hero-name:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "54px"
  hero-dim:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "23px"
  stat:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "24px"
  subhead:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "20px"
  lead:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "18px"
  item-title:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "17px"
  ui:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
  ui-sm:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
  meta:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
  mono-meta:
    fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace"
    fontSize: "13.5px"
  micro:
    fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace"
    fontSize: "11px"
  micro-xs:
    fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace"
    fontSize: "10px"
  headline:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "30px"
    fontWeight: 700
    letterSpacing: "1px"
  title:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.45
  body:
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "16px"
    lineHeight: 1.7
  label:
    fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace"
    fontSize: "12px"
    letterSpacing: "2px"
rounded:
  card: "14px"
  block: "12px"
  control: "10px"
  link: "9px"
  sm: "8px"
  chip: "6px"
  code: "5px"
  pill: "999px"
  avatar: "28px"
  avatar-inner: "24px"
  large-control: "11px"
  inline-code: "4px"
  detail: "3px"
  spine: "7px"
  hairline: "1px"
  hairline-2: "2px"
spacing:
  container: "1020px"
  gutter: "24px"
  nav-height: "64px"
  page-top: "40px"
  page-bottom: "64px"
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "28px 32px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#041018"
    rounded: "{rounded.control}"
    padding: "11px 24px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "11px 24px"
  chip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.chip}"
    padding: "2px 10px"
  nav-link-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.link}"
    padding: "8px 13px"
---

# Design System: 译文 · 个人站

## Overview

**Creative North Star: "霓虹夜航 × 极昼实验室"**

这是一座同时运转着两套光源的数字花园：深色主题是「霓虹夜航」——深夜里青蓝与电紫的辉光点亮终端窗口，像一台不肯下线的机器；浅色主题是「极昼实验室」——冷灰蓝底色上的白昼工作台，同一套仪器在日光下运转。两套主题共享同一批色相（青 + 电紫双引擎），只是把亮度换了个方向。

系统的骨架是**终端隐喻**：mono 字体承担所有"仪器读数"角色（导航命令前缀、章节编号、语录出处、图注），中文正文用系统无衬线体保证可读性。文案本身就是终端语言——`$ whoami`、`ls ./articles`、`// HELLO_WORLD`——视觉与文案互为印证。而在这套科技语汇中间，习字栏目独享一支琥珀橙，毛笔字内容像一枚被小心嵌入仪器的印章，是整套系统里唯一的"手温"。

整体密度舒适、留白大方；装饰克制但反馈炫：默认状态安静，hover 时辉光点亮、角标亮起、卡片上浮——**静如仪器待机，动如霓虹通电**。

**Key Characteristics:**

- 终端隐喻贯穿文案与视觉：mono 标签、命令式按钮文案、光标闪烁
- 青（primary）+ 电紫（primary-2）双色引擎，全站渐变与辉光都只在这两色之间发生
- 三栏目语义色：科技 = 青、阅读 = 电紫、习字 = 琥珀橙，色相即信息
- 卡片带取景框角标（左上青、右下紫），hover 点亮——全站签名细节
- 44px 网格背景从页面顶部渐隐，营造仪器台面的深度
- 明暗双主题一一对映，色相不变、只调亮度与饱和

## Colors

调色板是一台"双引擎仪器"：两个高饱和引擎色负责所有能量输出（辉光、渐变、交互态），一组冷灰蓝中性色负责结构（背景、表面、线条），三支语义色负责信息（栏目归属）。每个颜色都有浅色/深色两个对映值，色相保持一致。

### Primary
- **信号青**（浅色 `#06a6d6` / 深色 `#2bd9ff`）：全站第一引擎。链接、主按钮、活跃导航态、取景框角标左上、代码高亮强调、网格与辉光的能量来源。
- **电光紫**（浅色 `#7c5cff` / 深色 `#8b7bff`）：第二引擎，永远与青配对出现。渐变的另一端、取景框角标右下、引用块左边线、斜体强调、阅读栏目语义色。
- **琥珀橙**（浅色 `#d97a1f` / 深色 `#ffb454`）：习字栏目专属色，也用于「今日行动」区块。全站唯一暖色，是笔墨内容的印章色。

### Secondary
- **常驻绿**（浅色 `#07c160` / 深色 `#12c96a`）：仅作状态指示——"online" 脉冲圆点。不参与装饰。
- **沙金**（浅色 `#c0801c` / 深色 `#ffc266`）：豆瓣评分星、太阳图标等少量辅助图形。
- **石灰蓝**（浅色 `#7d8fa3` / 深色 `#93a6bd`）：月亮图标等次要图形的哑光色。
- **终端三色**（`#ff5f57` / `#febc2e` / `#28c840`）：macOS 窗口圆点的拟物 chrome，只出现在终端窗口容器上，不进入页面配色。
- **印章纸色**（`#f6f3ec`）：品牌印章（导航 yi.png 载体）的米白底，永远不变主题色。
- **灯箱固定表面**（`#0b1118` 底 / `#dde7f2` 字）：InkWall 大图浏览灯箱恒为深色（看作品场景需要中性暗背景衬墨迹），不随主题切换，属登记过的固定表面而非主题遗漏。
- **信号青文字档**（浅色 `#05719a`）：`--primary-text`，11–15px 小字专用；明亮青 `--primary` 只用于图形、边框、hover 与大字，不承担小字颜色。
- **语义色文字档**（紫 `#6a4ae0` / 橙 `#9c5109` / 石灰 `#647084`，均为浅色值；深色沿用各自亮色）：紫色系与橙色系的小字（chip、标签、重读记录）一律用 `--reading-text` / `--calligraphy-text` / `--stone-text`；亮色仅保留给图形、边框、hover 与 12% tint 底。深浅两套文字档都实测 ≥4.5:1。
- **焦点环**（`--primary-text` 实线 2px + offset 2px）：全局 `:focus-visible` 唯一来源，组件不得私写弱化版本；键盘焦点在浅深两主题均 ≥4.5:1。

### 已豁免（不进色板的合理用色）
- **黑色压暗层**（`rgba(0,0,0,.2–.6)` / `#000`）：图片 scrim、弹层遮罩、阴影渐变的标准黑，全站通用，不算配色。
- **书封金徽章**（`#f2b52e` 系 + `#d9a441→#f3cf6b→#c8922a` 渐变）：豆瓣评分徽章的独立装饰色组，仅存在于书封角标，与「沙金」辅色分工明确。

### Neutral
- **底色**（浅 `#f3f6fa` / 深 `#0a0f16`）：页面背景，冷灰蓝调。
- **表面**（浅 `#ffffff` / 深 `#0f1620`）：卡片、弹层、移动端菜单的载体。
- **表面 2**（浅 `#e9eef5` / 深 `#16202e`）：内嵌表面——表头、行内代码底、图标底。
- **正文墨**（浅 `#101c2e` / 深 `#dde7f2`）：正文与标题。
- **次要灰**（浅 `#5b6b80` / 深 `#8798ad`）：辅助说明、lead 段落、未激活链接。
- **弱读灰**（浅 `#93a1b3` / 深 `#5a6b80`）：图注、命令前缀、统计数字。
- **结构线**（浅 `#dbe3ed` / 深 `#1c2836`）：所有边框、分割线、滚动条。

### Named Rules
**双色引擎规则。** 全站所有渐变、辉光、选中态只允许在青与电紫之间发生；引入第三种装饰色是破坏系统。
**色相即信息规则。** 青为科技、紫为阅读、橙为习字——栏目标签（chip）的底色永远是语义色 12% 透明度的 tint，边框是 30%，文字是语义色本身。新栏目必须先领一支自己的语义色，不得借用。
**绿只报状态规则。** 常驻绿只出现在运行状态指示上，绝不作为装饰或强调色。

## Typography

**Display / Body Font:** 'PingFang SC' → 'Hiragino Sans GB' → 'Microsoft YaHei'（系统中文无衬线栈，不引入 Web Font）
**Mono / Label Font:** ui-monospace → 'SF Mono' → 'JetBrains Mono' → 'Fira Code' → Menlo → Consolas（系统等宽栈）
**Quote Font:** 'Songti SC' → 'STSong'（系统宋体，**仅用于引文**——语录、座右铭等仪式性文本）

**Character:** 三声部对唱——中文系统无衬线负责长文阅读的舒适与素净，等宽字体负责所有"仪器读数"：命令、编号、出处、标签、图注（mono 统一带 0.3px letter-spacing，小标签 11–12px 加宽到 2px，读起来像仪器铭牌），宋体衬线是第三声部，只在引文时刻登台，用字体的"旧"反衬内容的仪式感。三声部各守其位，不互相越界。

### Hierarchy
- **Display**（700, 42px / 移动端 32px）：仅首页 Hero 主标题。第一行可用青→紫渐变文字（background-clip），第二行降为 30px 次要灰。
- **Headline**（700, 30px, letter-spacing 1px）：各页面标题，前置 mono 命令标签（如 `$ man`）。
- **Title**（700, 22px, 1.45, letter-spacing 0.5px）：正文 h2，左侧 4px 青色实线；h3 18px 带青色 `▸ ` 前缀。
- **Body**（400, 16px, 1.7）：全局正文。文章正文（.md-body）放宽到 1.85。
- **Label**（mono, 11–14px, letter-spacing 2px 小标签 / 0.3px 常规）：命令前缀、编号、图注、语录出处。meta 小字按 11px / 13px / 14px 三档使用，不做其他奇数档。
- **Quote**（Songti 衬线, 19px, 1.8 行距）：语录、座右铭、仪式性引文。第三声部的唯一舞台。

### Named Rules
**Mono 只读数规则。** 等宽字体只承担"机器输出"语义（命令、编号、出处、元数据），中文正文与标题不用 mono；宋体衬线是引文专属声部，正文与标题同样不得使用。

## Layout

单列内容流 + 双栏 Hero 的紧凑布局。内容容器 `max-width: 1020px`，左右 padding 24px；页面纵向留白 top 40px / bottom 64px；导航固定高度 64px 吸顶。列表类页面（文章、书单）用 2–3 列网格，移动端折叠为单列。

背景层是全局 44px × 44px 网格线（1px，中性色 5.5% 透明度 / 深色下青色 5%），用径向遮罩从页面顶部渐隐——深度感来自这张"仪器台面"，不来自分区底色。

响应式断点按内容各自约定：**720px** 是全站统一的移动临界（导航折叠为汉堡菜单、双栏转单列、隐藏命令前缀），其余 860px / 900px / 960px 是个别网格的列数切换点，1180px 以上文章详情页可浮出侧栏。

## Elevation & Depth

**轻盈悬浮 + 发光。** 深度由三层合成：中性色阴影提供物理悬浮感，双色辉光（glow）提供"通电感"，网格背景提供空间底。默认状态安静，深度只在交互时被点亮。

### Shadow Vocabulary
- **shadow-sm**（浅 `0 1px 2px + 0 2px 8px rgba(16,28,46,.05)` / 深色换纯黑 35%）：所有卡片默认态。
- **shadow-md**（浅 `0 2px 6px + 0 12px 32px rgba(16,28,46,.06/.1)`）：hover 升起、弹层。
- **shadow-lg**（浅 `0 4px 12px + 0 24px 56px rgba(16,28,46,.1/.18)`）：模态、移动端下拉菜单。
- **glow**（浅 `0 8px 28px rgba(6,166,214,.18)` / 深 `0 0 32px rgba(43,217,255,.16)`）：主按钮常态、卡片 hover 时叠在 shadow-md 之上——霓虹通电的时刻。

### Named Rules
**静如待机规则。** 卡片静止时只有 shadow-sm；上浮（-4px）、辉光、角标点亮三件事必须同时发生在 hover，一次把"通电感"给足。

## Shapes

圆角语言是"精密仪器的倒角"：卡片 14px，代码块/弹层 12px，按钮/输入框/图片 10px，导航链接与头像印章 9px，chip 6px，行内代码 5px——尺寸越小圆角越小，层级一致。全站无直角容器。

线条语汇区分三档：**实线**（1px 结构线）是默认边框；**虚线**（dashed）只出现在"作者自己的声音"上——正文链接下划线、想法批注左边线、分隔线，虚线即手写感；**发光渐变条**（2px 青→紫渐变 + 辉光）只属于活跃导航下划线这一处。

签名形状是**取景框角标**：卡片左上 / 右下各一个 16px 的 L 形 2px 角标（左上青、右下紫），默认隐藏，hover 时亮起——像相机对焦框锁定了这块内容。

## Components

### Buttons
- **Shape:** 10px 圆角，14px/600 字重，mono 字体（文案本身是命令）
- **Primary:** 信号青底 + 近黑文字（`#041018`），常态即带 glow 辉光；hover 上浮 -2px，辉光叠加 shadow-md
- **Ghost:** 表面底 + 1px 结构线边框 + 次要灰文字；hover 文字与边框转信号青
- **反馈哲学：** 按钮是精密仪器——hover 必有明确位移或变色，不做纯透明度变化

### Cards / Containers
- **Corner Style:** 14px（--radius 全站唯一卡片圆角）
- **Background:** 表面色，1px 结构线边框，shadow-sm
- **Shadow Strategy:** hover 上浮 -4px + shadow-md + glow，见 Elevation
- **Signature:** 左上/右下取景框角标，hover 点亮
- **Internal Padding:** 28–40px 视内容密度

### Navigation
- 吸顶 64px，背景为底色 78% + 14px 背景模糊（backdrop-filter），1px 底边线
- 品牌区：34px 圆角印章（米白底、yi.png 印章）+ mono 文本 `yiwen_`（光标 1.1s 阶跃闪烁）+ 弱读灰域名后缀；hover 时印章旋转 -6° 并放大 1.06
- 链接：中文标签 + 11px 弱灰 mono 命令前缀（`/articles` 等）；活跃态 = 语义青文字 + 10% tint 底 + 2px 青→紫渐变下划线带辉光
- 移动端（≤720px）：汉堡按钮（表面底 10px 圆角，三条线变 ×），菜单从 -12px 下滑浮现，命令前缀隐藏

### Chips（栏目标签）
- mono 12px，6px 圆角，2px 10px 内边距
- 三种语义变体（tech / reading / calligraphy），各用语义色：文字 = 色本身，底 = 12% tint，边框 = 30% tint
- 文案即终端注释（如 `// vue`）

### Inputs / Fields（全局搜索）
- 触发按钮与弹层同为表面底 + 结构线；弹层 shadow-lg + 弹入动画（0.25s 上浮 + 缩放 0.98→1）
- 键盘可达（⌘K / Esc），移动端自适应布局

### Signature Components
- **终端窗口**（首页 Hero 右侧）：卡片 + 顶部三色窗口圆点（红黄绿）+ mono 标题 `~/yiwen — zsh`，内部 TypeWriter 逐行打字输出（`$ whoami` / `> 译文 — 前端开发工程师`…），打字机光标跟随。是全站气质的定音锤。
- **墨墙 InkWall**（习字页）：篆书单字的展示墙，是"仪器中的印章"这一意象的实体。
- **文章批注体系**（.md-body 内）：想法块（虚线左边 + mono「想法」标签）、今日行动块（琥珀橙左边线）、相关笔记卡（青 4% tint 底 + hover 箭头位移）——同一套"作者声音 = 虚线/标签"的语法。

## Do's and Don'ts

### Do:
- **Do** 新增栏目标签时先申领语义色，按 12% / 30% / 原色三层公式生成 tint 底、边框和文字
- **Do** 用 mono 承担所有元数据读数（编号、出处、命令、图注），小标签 letter-spacing 2px
- **Do** hover 反馈三件套一起给：位移 + 辉光 + 角标/边框点亮（卡片）；位移 + 变色（按钮）
- **Do** 所有渐变和辉光只用 青 + 电紫 双色；深浅主题成对定义，色相对映
- **Do** 移动端以 720px 为统一临界点：汉堡菜单、单列、隐藏命令前缀

### Don't:
- **Don't** 引入第三种装饰性色相；绿只用于状态指示，沙金/石灰只用于约定俗成的图标位
- **Don't** 给静止状态的卡片加辉光或上浮——"通电"只发生在 hover
- **Don't** 用实线表达"作者的声音"——想法批注、正文链接、分隔线用虚线，这是手写感的专用语法
- **Don't** 在中文正文或标题上用等宽字体或宋体衬线——mono 只读数，Songti 只引文，第三声部不得越界
- **Don't** 引入系统栈之外的 Web Font 或花哨衬线体——三套系统字体栈（中文无衬线 + 等宽 + 宋体）就是全部
