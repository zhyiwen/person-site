/* ============================================
   集字：从整张临帖里抠出的单字
   命名约定：序号-字.png（例如 01-皇.png）
   想加字：处理好透明底 PNG，按编号丢进 chars/ 即可
   ============================================ */

const files = import.meta.glob('../assets/ink/chars/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const CHARS = Object.entries(files)
  .map(([path, url]) => {
    const name = path.split('/').pop().replace(/\.png$/i, '')
    const m = name.match(/^(\d+)[-_](.+)$/)
    return {
      url,
      order: m ? Number(m[1]) : 999,
      char: m ? m[2] : name,
    }
  })
  .sort((a, b) => a.order - b.order)

/* 集字的出处，显示在条带下方 */
export const CHARS_SOURCE = '「皇帝立國，維初在昔」— 李斯《峄山碑》'
