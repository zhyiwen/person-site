# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要用户是作者本人（译文，前端开发工程师）：站点首先是给自己留档的地方——沉淀技术笔记、读书心得和毛笔习作，"读者是谁不强求"。不以此排除偶尔来访的同行或朋友，但没有为他们改变定位的义务。

## Product Purpose

"译文 · 个人站"（https://www.zhyiwen.com/）是一个数字花园式的个人站：日常构建技术笔记（Vue / uni-app / 小程序 / ECharts / Flutter），同步读书心得，展示毛笔习作（主攻篆书，临李斯《峄山碑》）。不追热点，只提交经过验证的思考。成功意味着：内容能持续沉淀，回看时结构清晰、检索方便；站点本身就是作者个人气质的写照。

## Positioning

"写代码的人，也在写字"——技术档案与笔墨习作共存的个人留档站。这个组合（终端隐喻的工程师叙事 × 篆书临帖的传统功夫）是别人难以照搬的核心气质。

## Operating Context

- 内容更新即"提交"：文章以 Markdown 存放于 `src/content/posts/`，书单 / 习字 / 作品 / 语录数据在 `src/data/*.js` 中手写维护。
- 通过 Vite 构建，部署为纯静态产物（路由采用 hash 模式以适配静态托管）。
- 常年内容板块：文章、书单、习字、作品、关于；首页为最新动态 + 板块入口。

## Capabilities and Constraints

- Vue 3 + Vite + vue-router（hash history），marked 渲染 Markdown，shiki 做代码高亮，`gen:pinyin` 脚本生成拼音数据。
- 明暗双主题，挂载前预写 `data-theme` 防刷新闪烁；主题偏好存 localStorage。
- 支持站内全局搜索。
- 硬约束：**移动端体验必须良好**，所有页面适配手机端是验收底线。

## Brand Commitments

- 站名"译文 · 个人站"，作者署名"译文"，Favicon / OG 图为 `yi.png`。
- 视觉语言沿用既有的终端 / mono 隐系（`$ whoami`、`ls ./articles` 等），中英混排、代码隐喻贯穿全站——为既有实现，后续改动应保持连贯。

## Evidence on Hand

- 真实文章 10 篇（`src/content/posts/`，含《道德经》读书笔记、Flutter 入门、峄山碑习字记录等）。
- 真实书单、语录、习字数据（`src/data/`）。
- 无外部测评、推荐语或案例数据——**不得虚构**此类内容。

## Product Principles

1. **留档优先**：结构、检索、回看体验优先于炫技。
2. **真实提交**：只放经过验证的思考，没有的内容不造。
3. **气质连贯**：终端隐喻与笔墨气质并存，改动不破坏这条主线。
4. **移动端一等公民**：任何新页面手机端体验不将就。

## Accessibility & Inclusion

未确立产品级特殊要求；遵循常规 Web 可访问性基线（语义化标签、可聚焦交互、明暗主题均有足够对比度）。
