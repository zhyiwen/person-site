/* ============================================
   集字：从自己的临帖里挑出来的「写得还行」的单字
   命名约定：序号-字.png，可选追加出处：序号-字-出处.png
     例如 01-皇.png / 09-嗣-单字日课.png
   想加字：用 tools/cut-chars.py 从整张习作里切，
     或自己做好透明底 PNG 按编号丢进 chars/ 即可
   ============================================ */

const files = import.meta.glob('../assets/ink/chars/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

/* 没写出处时统一按这个算（最早一批都来自峄山碑开篇） */
const DEFAULT_SOURCE = '峄山碑 · 开篇'

export const CHARS = Object.entries(files)
  .map(([path, url]) => {
    const name = path.split('/').pop().replace(/\.png$/i, '')
    const m = name.match(/^(\d+)[-_](.+)$/)
    const rest = m ? m[2].split(/[-_]/) : [name]
    return {
      url,
      order: m ? Number(m[1]) : 999,
      char: rest[0],
      source: rest.length > 1 ? rest.slice(1).join(' · ') : DEFAULT_SOURCE,
    }
  })
  .sort((a, b) => a.order - b.order)

/* 集字条带的说明文案，显示在条带下方 */
export const CHARS_SOURCE = '挑自各次临帖 · 鼠标悬停可看每个字的出处'
