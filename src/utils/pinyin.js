/**
 * 中文书名排序 / 取首字母
 *
 * 排序：直接用浏览器内置 ICU 的中文排序规则（`Intl.Collator('zh-Hans-CN')` 对汉字按下标拼音比较），
 *       Chrome / Safari / Firefox 都支持，不需要额外依赖。
 * 首字母：查 `pinyin-map.js`（构建期用 pinyin-pro 生成，`npm run gen:pinyin`）；
 *       表里没有的字（比如新加的书）退回「锚点二分」兜底，够用但个别同音字可能落到相邻字母。
 */
import { PY_FIRST } from './pinyin-map.js'

const collator = new Intl.Collator('zh-Hans-CN', { sensitivity: 'base' })

/** 拼音比较函数，可直接传给 Array.prototype.sort */
export const pyCompare = (a, b) => collator.compare(a || '', b || '')

/** 兜底锚点：A B C D E F G H J K L M N O P Q R S T W X Y Z（拼音无 I / U / V 开头音节） */
const ANCHORS = [
  '阿', '八', '嚓', '搭', '蛾', '发', '噶', '哈', '击',
  '喀', '垃', '妈', '拿', '哦', '啪', '期', '然', '撒',
  '塌', '挖', '昔', '压', '匝',
]
const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
  'T', 'W', 'X', 'Y', 'Z',
]

function anchorInitial(c) {
  let lo = 0
  let hi = ANCHORS.length - 1
  let found = 0
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (collator.compare(c, ANCHORS[mid]) >= 0) {
      found = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return LETTERS[found]
}

/** 取书名首字的首字母；英文书名按首字母，数字/符号归入 # */
export function initialOf(title) {
  const s = (title || '').trim()
  if (!s) return '#'
  const c = s[0]
  if (PY_FIRST[c]) return PY_FIRST[c]
  if (/[a-zA-Z]/.test(c)) return c.toUpperCase()
  if (!/[\u4e00-\u9fa5]/.test(c)) return '#'
  return anchorInitial(c)
}

/**
 * 书名比较：先按首字母分组，组内再按拼音。
 * 为什么不是纯拼音：ICU 会把「长」当 zhǎng 排序，而「长安」应归 C，
 * 先比字母能保证字母分组顺序与组标题一致（组内顺序个别多音字略有出入，可接受）。
 */
export function compareTitles(a, b) {
  const la = initialOf(a)
  const lb = initialOf(b)
  if (la !== lb) {
    if (la === '#') return 1
    if (lb === '#') return -1
    return la < lb ? -1 : 1
  }
  return pyCompare(a, b)
}
