/**
 * 生成「汉字 → 拼音首字母」静态映射表（构建期运行，不进运行时依赖）
 *
 * 用法：npm run gen:pinyin
 * 产出：src/utils/pinyin-map.js
 *
 * 为什么要这张表：浏览器内置的 Intl 中文排序只能给出先后顺序，不能直接告诉你
 * 某个字属于哪个字母（用「撞锚点」的二分查找在「他/她」「西」这类字上会错）。
 * 所以在书单标题用到的字上预先算好，运行时查表即可；表里没有的字再退回 Intl 兜底。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { pinyin } from 'pinyin-pro'

const BOOKS = new URL('../src/data/books.js', import.meta.url)
const OUT = new URL('../src/utils/pinyin-map.js', import.meta.url)

const src = readFileSync(BOOKS, 'utf8')
const titles = [...src.matchAll(/title:\s*["']([^"']+)["']/g)].map((m) => m[1])

const chars = [...new Set(titles.join(''))].filter((c) => /[\u4e00-\u9fa5]/.test(c)).sort()

const map = {}
for (const c of chars) {
  const first = pinyin(c, { pattern: 'first', toneType: 'none', type: 'array' })[0]
  if (first && /^[a-z]$/i.test(first)) map[c] = first.toUpperCase()
}

const body = Object.entries(map)
  .map(([c, l]) => `  ${c}: '${l}',`)
  .join('\n')

writeFileSync(
  OUT,
  `// 由 scripts/gen-pinyin.mjs 生成，请勿手改；书单加了新书后可重跑：npm run gen:pinyin
// 收录范围：src/data/books.js 里所有书名的首字所在字符集（共 ${Object.keys(map).length} 字）

export const PY_FIRST = {
${body}
}
`,
  'utf8',
)

console.log(`✓ 已生成 ${Object.keys(map).length} 个字的拼音首字母 → src/utils/pinyin-map.js`)
