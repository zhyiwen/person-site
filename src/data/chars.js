/* ============================================
   集字：从自己的临帖里挑出来的「写得还行」的单字

   命名约定（推荐）：序号-书体-字-出处.png
     例如 01-篆-極-峄山碑.png / 08-楷-尚-宣示表.png
   书体取 篆 / 隶 / 楷 / 行 / 草（写繁体的隸也认）
   需要单独标简体时插在字与出处之间：序号-书体-字-简体-出处.png
     例如 02-篆-極-极-峄山碑.png（不写则查下面的常用繁简对照表）
   老格式「序号-字-出处.png」「序号-字.png」仍然兼容

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

/* 五体，卡片与统计都按这个顺序走 */
export const SCRIPTS = ['篆', '隶', '楷', '行', '草']

/* 文件名里可能写成繁体或异体，归一 */
const SCRIPT_ALIAS = { 篆: '篆', 隸: '隶', 隶: '隶', 楷: '楷', 行: '行', 草: '草' }

/* 常用繁简对照：集字多为繁体临写，角标显示现代写法
   表里没有的字（多数本来繁简同形）就直接显示原字 */
const SIMPLIFIED = {
  極: '极', 義: '义', 張: '张', 黃: '黄', 孫: '孙', 國: '国', 維: '维',
  稱: '称', 討: '讨', 萬: '万', 歲: '岁', 餘: '余', 閏: '闰', 號: '号',
  龍: '龙', 雲: '云', 風: '风', 書: '书', 畫: '画', 長: '长', 東: '东',
  樂: '乐', 學: '学', 無: '无', 爲: '为', 為: '为', 於: '于', 後: '后',
  從: '从', 處: '处', 藝: '艺', 氣: '气', 歸: '归', 實: '实', 寶: '宝',
  顯: '显', 靜: '静', 聽: '听', 語: '语', 誰: '谁', 變: '变', 邊: '边',
  進: '进', 遠: '远', 還: '还', 過: '过', 這: '这', 對: '对', 時: '时',
  間: '间', 陽: '阳', 陰: '阴', 陳: '陈', 隨: '随', 隱: '隐', 難: '难',
  靈: '灵', 體: '体', 髮: '发', 點: '点', 齊: '齐', 齒: '齿', 龜: '龟',
  亂: '乱', 動: '动', 來: '来', 藏: '藏', 盈: '盈', 昃: '昃',
}

export const CHARS = Object.entries(files)
  .map(([path, url]) => {
    const name = path.split('/').pop().replace(/\.png$/i, '')
    const m = name.match(/^(\d+)[-_](.+)$/)
    const parts = (m ? m[2] : name).split(/[-_]/)

    // 段首若是书体就摘掉；老格式没有这一段
    let script = ''
    if (parts.length > 1 && SCRIPT_ALIAS[parts[0]]) {
      script = SCRIPT_ALIAS[parts.shift()]
    }

    const char = parts.shift() || name

    // 剩下两段以上：第一段是显式简体，其余拼回出处
    let modern = ''
    if (parts.length > 1) modern = parts.shift()
    const source = parts.length ? parts.join(' · ') : DEFAULT_SOURCE

    return {
      url,
      order: m ? Number(m[1]) : 999,
      script,
      char,
      modern: modern || SIMPLIFIED[char] || char,
      source,
    }
  })
  .sort((a, b) => a.order - b.order)

/* 各书体各收几字，按 篆隶楷行草 排，空的不要 */
export const SCRIPT_STATS = SCRIPTS.map((s) => ({
  script: s,
  count: CHARS.filter((c) => c.script === s).length,
})).filter((x) => x.count > 0)

/* 集字条带的说明文案，显示在条带下方 */
export const CHARS_SOURCE = '挑自各次临帖 · 鼠标悬停可看每个字的出处'
