import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

/**
 * Shiki 代码高亮（动态 import，只在第一次打开文章详情页时加载）
 * 细粒度导入：只打包用到的几个语法 + 双主题，JS 引擎（免 wasm）
 * 双主题：one-light / one-dark-pro，输出 CSS 变量由 style.css 按站点主题切换
 */
const SHIKI_LANGS = ['dart', 'bash', 'javascript', 'typescript', 'json', 'html', 'css']

/* 必须写成静态 import，Vite 才能分析出依赖并拆包（模板字符串动态导入会失败） */
const LANG_LOADERS = {
  dart: () => import('shiki/langs/dart.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
}

let highlighterPromise = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighterCore } = await import('shiki/core')
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
      return createHighlighterCore({
        themes: [
          import('shiki/themes/one-light.mjs'),
          import('shiki/themes/one-dark-pro.mjs'),
        ],
        langs: SHIKI_LANGS.map((l) => LANG_LOADERS[l]()),
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      })
    })()
  }
  return highlighterPromise
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * 把 ```lang 代码块抽成占位注释，正文交给 marked 正常渲染
 * （marked 的自定义 renderer 不会 await 异步结果，所以分两遍处理）
 */
function extractCodeBlocks(body) {
  const blocks = []
  const md = body.replace(/```([^\n`]*)\r?\n([\s\S]*?)```/g, (_m, info, code) => {
    const lang = (info || '').trim().split(/\s+/)[0].toLowerCase()
    blocks.push({ lang, code: code.replace(/\r?\n$/, '') })
    return `\n<!--SHIKI_${blocks.length - 1}-->\n`
  })
  return { md, blocks }
}

async function highlightBlock(hl, { lang, code }) {
  try {
    return hl.codeToHtml(code, {
      lang: SHIKI_LANGS.includes(lang) ? lang : 'text',
      themes: { light: 'one-light', dark: 'one-dark-pro' },
      defaultColor: false,
    })
  } catch (err) {
    console.error('[shiki] 单个代码块高亮失败', err)
    return `<pre class="shiki-fallback"><code>${escapeHtml(code)}</code></pre>`
  }
}

/**
 * 自动加载 src/content/posts 下所有 .md 文件
 * 新增文章 = 在目录里新建一个 .md，无需改任何代码
 */
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** 解析 frontmatter（支持字符串、数字、[a, b] 数组） */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }

  const data = {}
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()

    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (/^\d+(\.\d+)?$/.test(val)) {
      data[key] = Number(val)
    } else {
      data[key] = val.replace(/^["']|["']$/g, '')
    }
  })
  return { data, body: match[2] }
}

export const CAT_LABEL = {
  tech: '技术笔记',
  reading: '读书',
  calligraphy: '习字',
}

/* src/assets/ink/ 下的习作原图，供 Markdown 用 ink:文件名 引用 */
const inkAssets = import.meta.glob('../assets/ink/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const inkByName = Object.fromEntries(
  Object.entries(inkAssets).map(([p, url]) => [p.split('/').pop(), url]),
)

/** 把 ![图](ink:文件名.jpg) 解析成构建后的真实地址 */
function resolveInkImages(html) {
  return html.replace(/src="ink:([^"]+)"/g, (whole, name) => {
    const url = inkByName[name]
    return url ? `src="${url}"` : whole
  })
}

/** 渲染结果缓存：同一篇文章只渲染一次 */
const htmlCache = new Map()

/** 异步渲染文章正文（含 Shiki 代码高亮），详情页使用 */
export async function getPostHtml(post) {
  if (htmlCache.has(post.slug)) return htmlCache.get(post.slug)

  const promise = (async () => {
    const { md, blocks } = extractCodeBlocks(post.body)
    let html = marked.parse(md)

    if (blocks.length) {
      let rendered
      try {
        const hl = await getHighlighter()
        rendered = await Promise.all(blocks.map((b) => highlightBlock(hl, b)))
      } catch (err) {
        // Shiki 加载失败（极少数情况）：整篇退回无高亮代码块
        console.error('[shiki] 代码高亮失败，已降级为纯文本', err)
        rendered = blocks.map(
          (b) => `<pre class="shiki-fallback"><code>${escapeHtml(b.code)}</code></pre>`,
        )
      }
      html = html.replace(/<!--SHIKI_(\d+)-->/g, (_m, i) => rendered[Number(i)] ?? '')
    }

    return resolveInkImages(html)
  })()

  htmlCache.set(post.slug, promise)
  return promise
}

export const POSTS = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const plain = body.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-|]/g, '')
    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      category: data.category || 'tech',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      body,
      readTime: Math.max(1, Math.round(plain.replace(/\s/g, '').length / 300)),
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug)
}

/** 上一篇 / 下一篇（按时间倒序排列） */
export function getNeighbors(slug) {
  const i = POSTS.findIndex((p) => p.slug === slug)
  return {
    newer: i > 0 ? POSTS[i - 1] : null,
    older: i < POSTS.length - 1 ? POSTS[i + 1] : null,
  }
}

export function postsByCategory(cat) {
  return POSTS.filter((p) => p.category === cat)
}
