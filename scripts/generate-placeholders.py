"""Neutral, theme-adaptive product placeholders.

Every shape is black or white at partial opacity on a transparent ground,
so a placeholder takes the tone of whatever well it sits in (warm plinth in
Atelier, cool bench in Assay) and a grid of them reads as one family.
"""
import math, os, sys

OUT = sys.argv[1]
K = lambda a: f'fill="#000" fill-opacity="{a}"'
W = lambda a: f'fill="#fff" fill-opacity="{a}"'

def svg(body, box=(0, 0, 1000, 1000)):
    # Tight, square viewBox around the object (+ its shadow) so the component,
    # not the file, decides how much air an object gets in its well.
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    side = max(w, h) * 1.08
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    vb = f"{cx - side/2:.0f} {cy - side/2:.0f} {side:.0f} {side:.0f}"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="800" height="800">
<defs><filter id="s" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="18"/></filter></defs>
{body}
</svg>
'''

def shadow(cx, cy, rx, ry=26, a=0.16):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" {K(a)} filter="url(#s)"/>'

def watch(dial=0.08, case_r=170, bracelet=False, strap=0.2, accent_dial=False):
    cx, cy = 500, 500
    parts = [shadow(cx, 905, 150, 22, 0.14)]
    sw = case_r * 1.05
    top_end = cy - case_r + 12      # strap pieces stop at the case edge, so
    bot_start = cy + case_r - 12    # nothing shows through the translucent case
    if bracelet:
        y = top_end - 40
        i = 0
        while y > 60:
            parts.append(f'<rect x="{cx-sw/2}" y="{y}" width="{sw}" height="40" rx="8" {K(0.16 + (i%2)*0.04)}/>')
            y -= 46; i += 1
        y = bot_start; i = 0
        while y + 40 < 910:
            parts.append(f'<rect x="{cx-sw/2}" y="{y}" width="{sw}" height="40" rx="8" {K(0.16 + (i%2)*0.04)}/>')
            y += 46; i += 1
    else:
        parts.append(f'<rect x="{cx-sw/2}" y="60" width="{sw}" height="{top_end-60}" rx="40" {K(strap)}/>')
        parts.append(f'<rect x="{cx-sw/2}" y="{bot_start}" width="{sw}" height="{880-bot_start}" rx="40" {K(strap)}/>')
        for yy in (bot_start + 160, bot_start + 220, bot_start + 280):
            if yy < 860:
                parts.append(f'<circle cx="{cx}" cy="{yy}" r="9" {K(0.22)}/>')
    # lugs
    for dx in (-1, 1):
        for dy in (-1, 1):
            parts.append(f'<rect x="{cx + dx*case_r*0.62 - 22}" y="{cy + dy*case_r*0.95 - (40 if dy<0 else 0)}" width="44" height="40" rx="10" {K(0.26)}/>')
    # crown
    parts.append(f'<rect x="{cx+case_r-4}" y="{cy-22}" width="34" height="44" rx="8" {K(0.3)}/>')
    # case + bezel + dial
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="{case_r}" {K(0.3)}/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="{case_r-14}" {W(0.35)}/>')
    dial_fill = K(0.62) if accent_dial else K(dial)
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="{case_r-30}" {dial_fill}/>')
    tick = W(0.85) if accent_dial else K(0.45)
    for i in range(12):
        a = math.radians(i * 30)
        r1, r2 = case_r - 44, case_r - (66 if i % 3 == 0 else 54)
        x1, y1 = cx + r1 * math.sin(a), cy - r1 * math.cos(a)
        x2, y2 = cx + r2 * math.sin(a), cy - r2 * math.cos(a)
        wdt = 7 if i % 3 == 0 else 4
        col = "#fff" if accent_dial else "#000"
        op = 0.85 if accent_dial else 0.45
        parts.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-opacity="{op}" stroke-width="{wdt}" stroke-linecap="round"/>')
    hc = "#fff" if accent_dial else "#000"
    ho = 0.9 if accent_dial else 0.6
    parts.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + (case_r-80)*math.sin(math.radians(300)):.1f}" y2="{cy - (case_r-80)*math.cos(math.radians(300)):.1f}" stroke="{hc}" stroke-opacity="{ho}" stroke-width="9" stroke-linecap="round"/>')
    parts.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + (case_r-56)*math.sin(math.radians(60)):.1f}" y2="{cy - (case_r-56)*math.cos(math.radians(60)):.1f}" stroke="{hc}" stroke-opacity="{ho}" stroke-width="6" stroke-linecap="round"/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="10" fill="{hc}" fill-opacity="{ho}"/>')
    return svg("\n".join(parts), (cx - case_r - 40, 50, cx + case_r + 40, 930))

def tub(width=380, height=420, lid=0.42, body=0.16, label=0.6, lid_h=90):
    cx = 500; base = 850
    top = base - height
    x = cx - width / 2
    p = [shadow(cx, base + 8, width * 0.55, 24, 0.18)]
    p.append(f'<rect x="{x}" y="{top}" width="{width}" height="{height}" rx="26" {K(body)}/>')
    p.append(f'<rect x="{x+18}" y="{top + lid_h + 50}" width="{width-36}" height="{height - lid_h - 110}" rx="6" {W(label)}/>')
    p.append(f'<rect x="{x+60}" y="{top + lid_h + 90}" width="{width*0.42}" height="18" rx="9" {K(0.22)}/>')
    p.append(f'<rect x="{x+60}" y="{top + lid_h + 124}" width="{width*0.28}" height="12" rx="6" {K(0.12)}/>')
    p.append(f'<rect x="{x-10}" y="{top-6}" width="{width+20}" height="{lid_h}" rx="20" {K(lid)}/>')
    for i in range(1, 9):
        lx = x - 10 + i * (width + 20) / 9
        p.append(f'<rect x="{lx-2}" y="{top+8}" width="4" height="{lid_h-28}" rx="2" {W(0.18)}/>')
    p.append(f'<rect x="{x+10}" y="{top+lid_h+8}" width="10" height="{height-lid_h-40}" rx="5" {W(0.35)}/>')
    return svg("\n".join(p), (x - 20, top - 10, x + width + 20, base + 40))

def bottle(width=240, height=520, cap=0.5, body=0.16, label=0.6):
    cx = 500; base = 860; top = base - height; x = cx - width / 2
    neck_w = width * 0.48
    p = [shadow(cx, base + 8, width * 0.6, 22, 0.18)]
    p.append(f'<rect x="{x}" y="{top+70}" width="{width}" height="{height-70}" rx="36" {K(body)}/>')
    p.append(f'<rect x="{cx-neck_w/2}" y="{top+30}" width="{neck_w}" height="70" rx="10" {K(body+0.04)}/>')
    p.append(f'<rect x="{cx-neck_w/2-8}" y="{top-30}" width="{neck_w+16}" height="70" rx="12" {K(cap)}/>')
    p.append(f'<rect x="{x+14}" y="{top+180}" width="{width-28}" height="{height*0.42}" rx="6" {W(label)}/>')
    p.append(f'<rect x="{x+40}" y="{top+215}" width="{width*0.5}" height="16" rx="8" {K(0.22)}/>')
    p.append(f'<rect x="{x+40}" y="{top+245}" width="{width*0.32}" height="10" rx="5" {K(0.12)}/>')
    p.append(f'<rect x="{x+12}" y="{top+110}" width="10" height="{height-160}" rx="5" {W(0.35)}/>')
    return svg("\n".join(p), (x - 20, top - 34, x + width + 20, base + 40))

def pouch(width=400, height=520, body=0.18, label=0.6):
    cx = 500; base = 860; top = base - height; x = cx - width / 2
    p = [shadow(cx, base + 6, width * 0.55, 20, 0.16)]
    d = f"M{x+20},{top+40} L{x+width-20},{top+40} Q{x+width+14},{base-40} {x+width-30},{base} L{x+30},{base} Q{x-14},{base-40} {x+20},{top+40} Z"
    p.append(f'<path d="{d}" {K(body)}/>')
    p.append(f'<rect x="{x+16}" y="{top}" width="{width-32}" height="54" rx="6" {K(body+0.12)}/>')
    for i in range(1, 12):
        lx = x + 16 + i * (width - 32) / 12
        p.append(f'<rect x="{lx-1.5}" y="{top+8}" width="3" height="38" {W(0.25)}/>')
    p.append(f'<rect x="{x+60}" y="{top+150}" width="{width-120}" height="{height*0.38}" rx="8" {W(label)}/>')
    p.append(f'<rect x="{x+90}" y="{top+190}" width="{width*0.4}" height="18" rx="9" {K(0.22)}/>')
    p.append(f'<rect x="{x+90}" y="{top+222}" width="{width*0.26}" height="12" rx="6" {K(0.12)}/>')
    return svg("\n".join(p), (x - 20, top - 6, x + width + 20, base + 40))

files = {
    "watch-dress-light.svg": watch(dial=0.06, case_r=165, strap=0.22),
    "watch-dive-dark.svg": watch(case_r=180, bracelet=True, accent_dial=True),
    "watch-field-mid.svg": watch(dial=0.2, case_r=172, strap=0.3),
    "watch-gmt-bracelet.svg": watch(dial=0.1, case_r=176, bracelet=True),
    "watch-small-dark.svg": watch(case_r=150, strap=0.34, accent_dial=True),
    "tub-wide.svg": tub(),
    "tub-tall.svg": tub(width=320, height=480, lid=0.55, body=0.2, lid_h=80),
    "bottle-capsules.svg": bottle(),
    "pouch-resealable.svg": pouch(),
    "tub-squat.svg": tub(width=430, height=330, lid=0.3, body=0.12, lid_h=70),
}
os.makedirs(OUT, exist_ok=True)
for name, content in files.items():
    with open(os.path.join(OUT, name), "w") as f:
        f.write(content)
    print(name)
