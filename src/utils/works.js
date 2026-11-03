import { WORK_META } from '../data/works'

/* 自动收集 src/assets/ink/ 下的所有照片（构建时静态扫描，无需手动登记） */
const files = import.meta.glob('../assets/ink/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const EXT = /\.(jpe?g|png|webp)$/i

/**
 * 文件名约定：日期-标题.jpg，例如 2026-11-03-峄山碑第1遍.jpg
 * 不按约定命名也能用，只是标题会直接用文件名
 */
function parse(file) {
  const base = file.replace(EXT, '')
  // 2026-11-03-标题 / 20261103_标题 两种写法都认
  const m =
    base.match(/^(\d{4}-\d{2}-\d{2})[-_\s]+(.+)$/) ||
    base.match(/^(\d{4})(\d{2})(\d{2})[-_\s]+(.+)$/)
  if (!m) return { date: '', title: base }
  if (m.length === 3) return { date: m[1], title: m[2] }
  return { date: `${m[1]}-${m[2]}-${m[3]}`, title: m[4] }
}

export const WORKS = Object.entries(files)
  .map(([path, url]) => {
    const file = path.split('/').pop()
    const parsed = parse(file)
    const meta = WORK_META[file] || {}
    return {
      file,
      url,
      title: meta.title || parsed.title,
      date: meta.date || parsed.date,
      copy: meta.copy || '',
      note: meta.note || '',
    }
  })
  // 新的在前
  .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.file.localeCompare(b.file))

export const WORK_COUNT = WORKS.length
