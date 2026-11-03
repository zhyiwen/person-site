import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

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
      html: resolveInkImages(marked.parse(body)),
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
