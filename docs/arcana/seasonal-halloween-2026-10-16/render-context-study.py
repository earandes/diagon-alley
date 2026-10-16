"""Offline composition study, not a browser screenshot or runtime layout measurement.

Pillow uses the active existing facades/background and reads the new SVG path source.
SVG gradients are represented by flat mid-tones in this study only. No OS capture,
browser, GPU, external model, paid service, or new dependency is used.
"""
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
ART = ROOT / 'src/arcana/presentation'
PACK = ART / 'content-packs/diagon-alley'
W, H = 1200, 780
image = Image.new('RGB', (W, H), '#081723')
draw = ImageDraw.Draw(image)
font_file = '/System/Library/Fonts/Supplemental/Georgia.ttf'
font = lambda size: ImageFont.truetype(font_file, size)

def fit(path, size):
    return ImageOps.fit(Image.open(path).convert('RGB'), size, centering=(.5, .55))

def svg_shape(size):
    """Small software path rasterizer for this one authored M/L/C/Z icon source."""
    scale = size / 160
    out = Image.new('RGBA', (size, round(192 * scale)))
    pen = ImageDraw.Draw(out)
    palette = {'url(#a)': '#bd702f', 'url(#b)': '#c39750', 'url(#c)': '#f8d17b'}
    def xy(point): return tuple(v * scale for v in point)
    tree = ET.parse(ART / 'art/seasonal-a68/pumpkin-lantern.svg')
    for el in tree.getroot():
        if not el.tag.endswith('path'): continue
        tokens = re.findall(r'[MLCZ]|-?\d*\.?\d+', el.attrib['d'])
        points, current, first, mode, i = [], (0., 0.), None, '', 0
        while i < len(tokens):
            if tokens[i].isalpha():
                mode, i = tokens[i], i + 1
                if mode == 'Z':
                    if first: points.append(first)
                    continue
            if mode in ('M', 'L'):
                current = (float(tokens[i]), float(tokens[i+1])); i += 2
                if first is None: first = current
                points.append(current)
                if mode == 'M': mode = 'L'
            elif mode == 'C':
                a, b, c = [(float(tokens[i+j]), float(tokens[i+j+1])) for j in (0, 2, 4)]
                origin = current; i += 6
                for step in range(1, 17):
                    t = step / 16; s = 1 - t
                    points.append(tuple(s**3*origin[k] + 3*s*s*t*a[k] + 3*s*t*t*b[k] + t**3*c[k] for k in (0, 1)))
                current = c
            else: break
        if not points: continue
        fill = palette.get(el.get('fill'), el.get('fill'))
        if fill and fill != 'none': pen.polygon([xy(p) for p in points], fill=fill)
        stroke = palette.get(el.get('stroke'), el.get('stroke'))
        if stroke and stroke != 'none': pen.line([xy(p) for p in points], fill=stroke, width=max(1, round(float(el.get('stroke-width', 1)) * scale)))
    return out

draw.text((25, 16), 'A68 · Estudio de composición sin navegador', font=font(25), fill='#f0d9a6')
draw.text((25, 52), 'Arte activo + primer emblema SVG · no es una captura ni una prueba responsive', font=font(15), fill='#b6c8d6')
left = fit(PACK / 'art/scene/diagon-alley.webp', (440, 640))
image.paste(left, (22, 96))
overlay = Image.new('RGBA', (440, 640), '#06132166')
image.paste(overlay, (22, 96), overlay)
draw.rectangle((22, 96, 462, 158), fill='#0a172b')
draw.text((40, 116), 'CALLEJÓN DIAGÓN', font=font(19), fill='#f4d490')
icon = svg_shape(44)
image.paste(icon, (363, 99), icon)
draw.text((420, 118), '⚙', font=font(22), fill='#d9b776')
draw.text((46, 184), 'La invitación vive en la cabecera.', font=font(16), fill='#fff0cf')
draw.text((46, 210), 'La ruta conserva todo su espacio.', font=font(16), fill='#fff0cf')
draw.rectangle((490, 96, 1178, 736), fill='#122434', outline='#bd965a', width=2)
draw.text((520, 114), 'HALLOWEEN · 2026', font=font(14), fill='#d7b478')
draw.text((536, 154), 'La noche de los escaparates encantados', font=font(24), fill='#f0deba')
draw.text((548, 195), 'Devuelve la luz entre etapas de tu expedición.', font=font(17), fill='#ddd4c8')
names = ['Cajas bailarinas', 'Escobas revoltosas', 'Cerradura risueña']
for i, place in enumerate(['confectionery', 'workshop', 'vault']):
    x, y = 530 + i*204, 240
    window = fit(PACK / f'art/storefronts-a59/{place}.webp', (166, 150)).convert('RGBA')
    tint = Image.new('RGBA', window.size, '#f0bd5528' if i == 0 else '#20103466')
    window = Image.alpha_composite(window, tint)
    image.paste(window, (x, y), window)
    draw.rectangle((x-2, y-2, x+168, y+152), outline='#e7c16c' if i == 0 else '#74596c', width=3)
    draw.line((x+83, y, x+83, y+150), fill='#8b714c', width=3)
    draw.line((x, y+75, x+166, y+75), fill='#8b714c', width=3)
    draw.text((x+7, y+164), names[i], font=font(16), fill='#f1deb2')
    draw.text((x+34, y+191), 'Iluminado' if i == 0 else 'Embrujado', font=font(14), fill='#e6c577' if i == 0 else '#d6c5de')
draw.text((688, 460), '1 de 3 escaparates iluminados', font=font(17), fill='#f1cc7c')
draw.rounded_rectangle((540, 508, 820, 628), radius=8, fill='#1e3540', outline='#e8c578', width=2)
draw.rounded_rectangle((846, 508, 1126, 628), radius=8, fill='#192d3b', outline='#827565', width=1)
draw.text((576, 532), 'Deshacer la broma', font=font(21), fill='#f1d698')
draw.text((570, 571), 'Una luz · PV y PM intactos', font=font(16), fill='#e7e0d3')
draw.text((865, 532), 'Aprovechar el hechizo', font=font(20), fill='#f1d698')
draw.text((891, 566), '+25% PV · −10% PM', font=font(16), fill='#d7e4d2')
draw.text((874, 595), 'Esta luz espera otro nodo', font=font(15), fill='#e0d0bc')
draw.rectangle((665, 659, 1008, 705), fill='#cfaf6e', outline='#f4dca3', width=1)
draw.text((699, 672), 'Iluminar este escaparate', font=font(19), fill='#152332')
image.save(HERE / 'CONTEXT-STUDY.png')
print(HERE / 'CONTEXT-STUDY.png')
