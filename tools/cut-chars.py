#!/usr/bin/env python3
# ============================================
# 集字切图工具：从整张习作照片里切出单字，生成透明底 PNG
# 输出：src/assets/ink/chars/序号-字[-出处].png（420×420，alpha 即字形）
#
# 依赖：python3 + Pillow（pip3 install pillow）
#
# 典型流程（两步）：
#   1. 先看切法对不对（会画一张带网格线的预览图）
#      python3 tools/cut-chars.py 照片.jpg --rect 10,30,1480,950 \
#          --rows 3 --cols 7 --preview /tmp/grid.png
#   2. 没问题就切字（格子 1 起，行:列）
#      python3 tools/cut-chars.py 照片.jpg --rect 10,30,1480,950 \
#          --rows 3 --cols 7 --cells 1:1,1:2,1:3 --chars 嗣,世,稱 \
#          --source 单字日课
#
# 常用参数：
#   --rect x,y,w,h   网格块在照片里的位置（像素），不传就是整张图
#   --invert         白字黑底的图（如集字软件导出）
#   --threshold 128  墨色阈值，字切不全就调大，边上带纸纹就调小
#   --start N        起始序号，默认接在现有文件后面
# ============================================

import argparse
import glob
import os
import re
import sys

from PIL import Image, ImageDraw

OUT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "src", "assets", "ink", "chars"))
CANVAS = 420        # 输出画布边长
GLYPH_RATIO = 0.88  # 字形最长边占画布的比例（与早期手工切的一批对齐）


def split_block(size, rows, cols, rect, inset=0.0):
    """把 rect 区域切成 rows×cols 的格子，返回 [[box, ...], ...]

    inset 按格子的百分比向内收，用来避开格子边框线（打印格线常被误当笔画）
    """
    w, h = size
    x, y, bw, bh = rect or (0, 0, w, h)
    cw, ch = bw / cols, bh / rows
    mx, my = cw * inset, ch * inset
    return [
        [
            (round(x + c * cw + mx), round(y + r * ch + my),
             round(x + (c + 1) * cw - mx), round(y + (r + 1) * ch - my))
            for c in range(cols)
        ]
        for r in range(rows)
    ]


def paper_map(region, block=None, q=0.88):
    """估计每一小块的「纸面亮度」，再插值回整张格子。

    取每块的高分位值（亮的大概率是纸），既避开墨迹把背景拉黑，
    也能吸收照片的明暗渐变。返回与格子同尺寸的 L 图。
    """
    w, h = region.size
    # 分块大小随图片尺寸走：大图上笔画也粗，块太小会把笔画本身当成纸面
    if block is None:
        block = max(16, min(w, h) // 10)
    px = region.load()
    bw, bh = (w + block - 1) // block, (h + block - 1) // block
    small = Image.new("L", (bw, bh), 235)
    sp = small.load()
    for by in range(bh):
        for bx in range(bw):
            vals = []
            for y in range(by * block, min(h, (by + 1) * block), 3):
                for x in range(bx * block, min(w, (bx + 1) * block), 3):
                    vals.append(px[x, y])
            if vals:
                vals.sort()
                sp[bx, by] = vals[min(len(vals) - 1, int(len(vals) * q))]
    return small.resize((w, h), Image.BILINEAR)



def drop_specks(mask, min_frac=0.05):
    """只保留够大的连通块，去掉纸上的墨点、杂点"""
    w, h = mask.size
    px = mask.load()
    seen = [bytearray(w) for _ in range(h)]
    comps = []
    for y in range(h):
        for x in range(w):
            if px[x, y] and not seen[y][x]:
                stack, comp = [(x, y)], []
                seen[y][x] = 1
                while stack:
                    cx, cy = stack.pop()
                    comp.append((cx, cy))
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and px[nx, ny] and not seen[ny][nx]:
                            seen[ny][nx] = 1
                            stack.append((nx, ny))
                comps.append(comp)
    if not comps:
        return mask
    floor = max(20, max(len(c) for c in comps) * min_frac)
    out = Image.new("L", (w, h), 0)
    op = out.load()
    for comp in comps:
        if len(comp) >= floor:
            for x, y in comp:
                op[x, y] = 255
    return out


def cut_cell(gray, box, invert, threshold, contrast):
    """切一格 → 局部纸面自适应取字 → 居中放到 420 画布，输出 RGBA

    判定的是「比自己的纸面暗多少」而不是绝对阈值，
    所以照片明暗不匀、淡格线、纸纹都不会被当成笔画。
    """
    region = gray.crop(box)
    bg = paper_map(region)

    w, h = region.size
    rpx, bpx = region.load(), bg.load()
    mask = Image.new("L", (w, h), 0)
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            paper = max(1, bpx[x, y])
            ink = (rpx[x, y] / paper) if invert else (1 - rpx[x, y] / paper)
            # 墨迹占纸面亮度的比例越接近 0 越确定是笔画；淡格线只到 0.15 左右
            mpx[x, y] = 0 if ink < contrast / 100 else min(255, int((ink - contrast / 100) * 1400))

    # 形态学开运算：先腐蚀再膨胀，把 1~2px 的打印格线和纸纹点掉，
    # 笔画（这一档分辨率下通常 5px 以上）基本不受影响
    from PIL import ImageFilter
    mask = mask.point(lambda v: 255 if v > 40 else 0)
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    mask = drop_specks(mask)

    bbox = mask.getbbox()
    if not bbox:
        return None
    pad = 4
    bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
            min(w, bbox[2] + pad), min(h, bbox[3] + pad))
    mask = mask.crop(bbox)

    side = int(CANVAS * GLYPH_RATIO)
    scale = min(side / mask.width, side / mask.height)
    nw, nh = max(1, int(mask.width * scale)), max(1, int(mask.height * scale))
    mask = mask.resize((nw, nh), Image.LANCZOS).point(lambda v: 0 if v < 55 else min(255, int(v * 1.25)))

    glyph = Image.new("L", (CANVAS, CANVAS), 0)
    glyph.paste(mask, ((CANVAS - nw) // 2, (CANVAS - nh) // 2))

    out = Image.new("RGBA", (CANVAS, CANVAS), (17, 17, 17, 0))
    out.paste(Image.new("RGBA", (CANVAS, CANVAS), (17, 17, 17, 255)), (0, 0), glyph)
    return out


def next_index():
    mx = 0
    for f in glob.glob(os.path.join(OUT_DIR, "*.png")):
        m = re.match(r"^(\d+)", os.path.basename(f))
        if m:
            mx = max(mx, int(m.group(1)))
    return mx + 1


def parse_rect(s):
    nums = [int(n) for n in s.split(",")]
    if len(nums) != 4:
        sys.exit("--rect 要四个数：x,y,w,h")
    return tuple(nums)


def main():
    ap = argparse.ArgumentParser(description="从习作照片切集字")
    ap.add_argument("photo")
    ap.add_argument("--rect", help="网格块位置 x,y,w,h（像素），默认整张图")
    ap.add_argument("--rows", type=int, help="网格行数")
    ap.add_argument("--cols", type=int, help="网格列数")
    ap.add_argument("--cells", help="要哪些格（1 起，行:列），如 1:1,1:2,2:3")
    ap.add_argument("--chars", help="对应的字，逗号分隔，如 嗣,世,稱")
    ap.add_argument("--source", default="", help="出处，会写进文件名，如 单字日课")
    ap.add_argument("--start", type=int, default=0, help="起始序号，默认接在现有文件后面")
    ap.add_argument("--preview", help="只画切分预览图到这个路径，不切字")
    ap.add_argument("--invert", action="store_true", help="白字黑底的图用这个")
    ap.add_argument("--threshold", type=int, default=128, help="（保留兼容，自适应算法下不再使用）")
    ap.add_argument("--single", action="store_true", help="整张图就是同一个字（已切好的单字图），配合 --chars 用")
    ap.add_argument("--inset", type=float, default=5, help="每格向内收的百分比，用来避开格线，默认 5")
    ap.add_argument("--contrast", type=int, default=30, help="判定为笔画的最小反差百分比（默认 30，即比纸面暗 30%%）；带格线残留就调大，笔画残缺就调小")
    args = ap.parse_args()

    img = Image.open(args.photo).convert("RGB")
    gray = img.convert("L")
    rect = parse_rect(args.rect) if args.rect else None

    if args.preview:
        if not (args.rows and args.cols):
            sys.exit("--preview 需要同时给 --rows 和 --cols")
        draw = ImageDraw.Draw(img)
        for row in split_block(img.size, args.rows, args.cols, rect, args.inset / 100):
            for box in row:
                draw.rectangle(box, outline=(220, 40, 40), width=3)
        img.resize((img.width // 2, img.height // 2), Image.LANCZOS).save(args.preview)
        print(f"预览已存 {args.preview}")
        return

    if not args.single and not (args.rows and args.cols and args.cells and args.chars):
        sys.exit("需要 --rows --cols --cells --chars（想先看切法就加 --preview）")

    if args.single:
        if not args.chars:
            sys.exit("--single 需要 --chars")
        idx = args.start or next_index()
        w, h = img.size
        box = (round(w * 0.02), round(h * 0.02), round(w * 0.98), round(h * 0.98))
        for ch in [c.strip() for c in args.chars.split(",")]:
            out = cut_cell(gray, box, args.invert, args.threshold, args.contrast)
            if out is None:
                print(f"跳过 {ch}（没找到墨迹，试试调 --contrast）")
                continue
            name = f"{idx:02d}-{ch}" + (f"-{args.source}" if args.source else "") + ".png"
            out.save(os.path.join(OUT_DIR, name))
            print(f"✓ {name}")
            idx += 1
        return

    grid = split_block(img.size, args.rows, args.cols, rect, args.inset / 100)
    cells = [tuple(int(n) for n in c.split(":")) for c in args.cells.split(",")]
    chars = [c.strip() for c in args.chars.split(",")]
    if len(cells) != len(chars):
        sys.exit(f"--cells 有 {len(cells)} 个、--chars 有 {len(chars)} 个，数量对不上")

    idx = args.start or next_index()
    for (r, c), ch in zip(cells, chars):
        out = cut_cell(gray, grid[r - 1][c - 1], args.invert, args.threshold, args.contrast)
        if out is None:
            print(f"跳过 {r}:{c}（这格没找到墨迹，试试调 --threshold）")
            continue
        name = f"{idx:02d}-{ch}" + (f"-{args.source}" if args.source else "") + ".png"
        out.save(os.path.join(OUT_DIR, name))
        print(f"✓ {name}  <- 格 {r}:{c}")
        idx += 1


if __name__ == "__main__":
    main()
