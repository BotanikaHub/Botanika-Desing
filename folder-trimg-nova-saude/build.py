#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Folder impresso — Tri[Mg] Complex | Boas-vindas aos alunos da Nova Saude
=======================================================================

Identidade tirada do manual oficial: "Universo da marca - Botanika"
(Drive) — azul #323C91, lima, amarelo, off-white; marca-folha original;
tipografia Neulis (primaria) + Futura (secundaria).

Gera, a partir de UMA unica definicao de layout:

  out/folder-trimg-nova-saude_CMYK_sangria3mm.pdf   -> PDF fechado para grafica
  out/folder-trimg-nova-saude_RGB_tela.pdf          -> visualizacao em tela
  out/frente.svg / out/verso.svg                    -> arquivos abertos, editaveis
  out/preview_frente.png / out/preview_verso.png    -> prova de tela 300 dpi

Formato: A6 chapado (sem dobra), 105 x 148 mm, frente e verso.
Sangria 3 mm. Margem de seguranca 5 mm, conferida no fim do build.

IMAGEM DA FRENTE
    Coloque o arquivo em brand/hero.png (conceito 03 gerado na Higgsfield).
    Precisa ter no minimo 1320 x 1000 px para 300 dpi na area usada.
    Sem esse arquivo o build cai no fundo grafico da marca e avisa.
"""

import os
import base64
import qrcode
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import CMYKColor, HexColor
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import mm

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
BRAND = os.path.join(HERE, "brand")
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

HERO = os.path.join(BRAND, "hero.png")          # conceito 03 da Higgsfield
LOGO_CREAM = os.path.join(BRAND, "botanika-logo-full-cream.png")
LOGO_AZUL = os.path.join(BRAND, "botanika-logo-full-azul.png")
MARCA_LIMA = os.path.join(BRAND, "botanika-marca-lima.png")
MARCA_CREAM = os.path.join(BRAND, "botanika-marca-cream.png")

# ----------------------------------------------------------------------------
# 1. FORMATO
# ----------------------------------------------------------------------------
TRIM_W, TRIM_H = 105.0, 148.0
BLEED = 3.0
SAFE = 5.0

PAGE_W = TRIM_W + 2 * BLEED         # 111
PAGE_H = TRIM_H + 2 * BLEED         # 154

CX0 = BLEED + 9.5                   # 12.5
CX1 = PAGE_W - BLEED - 9.5          # 98.5
CW = CX1 - CX0                      # 86

SAFE_X0, SAFE_Y0 = BLEED + SAFE, BLEED + SAFE
SAFE_X1, SAFE_Y1 = PAGE_W - BLEED - SAFE, PAGE_H - BLEED - SAFE

HERO_H = 80.0                        # altura da faixa de imagem na frente
QR_SIZE_MM = 15.5                    # lado do QR no verso

# ----------------------------------------------------------------------------
# 2. PALETA — do manual oficial da marca
#
# O azul #323C91 foi conferido por dois caminhos independentes: amostragem
# da pagina de cores do manual e o token `camp_color` do tema da loja.
# CMYK fechado para impressao, soma de tinta sempre < 300%.
# ----------------------------------------------------------------------------
class Color:
    def __init__(self, name, cmyk, rgb):
        self.name, self.cmyk, self.rgb = name, cmyk, rgb

    def rl(self, mode):
        return CMYKColor(*self.cmyk) if mode == "cmyk" else HexColor(self.rgb)


AZUL = Color("azul", (0.88, 0.82, 0.00, 0.08), "#323C91")   # azul Botanika
AZUL_DEEP = Color("azuldeep", (0.95, 0.88, 0.30, 0.30), "#1B2145")   # embalagem
CREAM = Color("cream", (0.05, 0.03, 0.06, 0.00), "#EDEDE9")   # off-white
LIMA = Color("lima", (0.22, 0.00, 0.62, 0.00), "#CFE87A")
LIMA_VIVO = Color("limavivo", (0.20, 0.00, 0.75, 0.00), "#D2F05E")
AMARELO = Color("amarelo", (0.03, 0.25, 0.85, 0.00), "#F5C13F")
TEXT = Color("text", (0.00, 0.00, 0.00, 1.00), "#1E1E1E")   # K puro
MUTED = Color("muted", (0.00, 0.00, 0.00, 0.60), "#6E6E6E")

# ----------------------------------------------------------------------------
# 3. TIPOGRAFIA
#
# A marca usa Neulis (primaria) + Futura (secundaria). As duas sao comerciais
# e nao estao neste ambiente, entao a arte usa substitutas proximas:
#   Outfit  -> papel de Neulis  (geometrica arredondada, humana)
#   Jost    -> papel de Futura  (geometrica classica, estrutural)
# Para a versao final, licencie as originais e troque so este bloco.
# ----------------------------------------------------------------------------
FONT_FILES = {
    "OF": "Outfit-Regular.ttf",
    "OF-M": "Outfit-Medium.ttf",
    "OF-SB": "Outfit-SemiBold.ttf",
    "OF-B": "Outfit-Bold.ttf",
    "JO": "Jost-Regular.ttf",
    "JO-M": "Jost-Medium.ttf",
    "JO-SB": "Jost-SemiBold.ttf",
    "JO-B": "Jost-Bold.ttf",
}
for alias, fn in FONT_FILES.items():
    pdfmetrics.registerFont(TTFont(alias, os.path.join(FONTS, fn)))

# Nome de familia UNICO por peso: sem isso o reportlab funde todos os pesos
# num subset so e a peca inteira sai num unico peso.
SVG_FAMILY = {
    "OF": ("Outfit Rg", 400, "normal"),
    "OF-M": ("Outfit Md", 400, "normal"),
    "OF-SB": ("Outfit Sb", 400, "normal"),
    "OF-B": ("Outfit Bd", 400, "normal"),
    "JO": ("Jost Rg", 400, "normal"),
    "JO-M": ("Jost Md", 400, "normal"),
    "JO-SB": ("Jost Sb", 400, "normal"),
    "JO-B": ("Jost Bd", 400, "normal"),
}

PT = 25.4 / 72.0
EXTENTS = []
AVISOS = []


def text_w(s, font, size_pt, tracking_pt=0.0):
    w = pdfmetrics.stringWidth(s, font, size_pt)
    if tracking_pt and s:
        w += tracking_pt * len(s)
    return w * PT


def wrap(s, font, size_pt, max_mm, tracking_pt=0.0):
    words, lines, cur = s.split(), [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if text_w(trial, font, size_pt, tracking_pt) <= max_mm or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


# ----------------------------------------------------------------------------
# 4. RENDERERS  (mm, origem no canto superior esquerdo da sangria, y p/ baixo)
# ----------------------------------------------------------------------------
class PDFRenderer:
    def __init__(self, path, mode):
        self.mode = mode
        self.bleed = (mode == "cmyk")
        w = PAGE_W if self.bleed else TRIM_W
        h = PAGE_H if self.bleed else TRIM_H
        self.off = 0.0 if self.bleed else BLEED
        self.h = h
        # initialFontName evita o "BT /F1 12 Tf ET" em Helvetica que o reportlab
        # escreve por padrao — fonte nao embutida que o preflight acusa.
        self.c = rl_canvas.Canvas(path, pagesize=(w * mm, h * mm),
                                  initialFontName="JO", initialFontSize=8)
        self.c.setTitle("Folder Tri[Mg] Complex — Boas-vindas Nova Saude")
        self.c.setAuthor("Botanika Brasil")
        self.band_path = build_hero_band(mode)

    def _y(self, y):
        return (self.h - (y - self.off)) * mm

    def _x(self, x):
        return (x - self.off) * mm

    def rect(self, x, y, w, h, fill=None, stroke=None, lw=0.3, r=0.0, alpha=1.0):
        c = self.c
        c.saveState()
        if alpha < 1.0:
            c.setFillAlpha(alpha)
        if fill:
            c.setFillColor(fill.rl(self.mode))
        if stroke:
            c.setStrokeColor(stroke.rl(self.mode))
            c.setLineWidth(lw)
        if r > 0:
            c.roundRect(self._x(x), self._y(y + h), w * mm, h * mm, r * mm,
                        fill=1 if fill else 0, stroke=1 if stroke else 0)
        else:
            c.rect(self._x(x), self._y(y + h), w * mm, h * mm,
                   fill=1 if fill else 0, stroke=1 if stroke else 0)
        c.restoreState()

    def line(self, x1, y1, x2, y2, color, lw=0.3):
        c = self.c
        c.setStrokeColor(color.rl(self.mode))
        c.setLineWidth(lw)
        c.line(self._x(x1), self._y(y1), self._x(x2), self._y(y2))

    def image(self, path, x, y, w, h, alpha=1.0):
        c = self.c
        c.saveState()
        if alpha < 1.0:
            c.setFillAlpha(alpha)
        c.drawImage(ImageReader(path), self._x(x), self._y(y + h), w * mm, h * mm,
                    mask="auto", preserveAspectRatio=False)
        c.restoreState()

    def text(self, x, y, s, font, size_pt, color, tracking_pt=0.0, align="left"):
        if not s:
            return
        c = self.c
        if align == "center":
            x = x - text_w(s, font, size_pt, tracking_pt) / 2.0
        elif align == "right":
            x = x - text_w(s, font, size_pt, tracking_pt)
        if self.mode == "cmyk":
            EXTENTS.append((s, x, y, x + text_w(s, font, size_pt, tracking_pt), size_pt))
        to = c.beginText(self._x(x), self._y(y))
        to.setFont(font, size_pt)
        to.setFillColor(color.rl(self.mode))
        to.setCharSpace(tracking_pt)   # sempre explicito: o charSpace vaza
        to.textOut(s)
        c.drawText(to)

    def clip_push(self, x, y, w, h):
        self.c.saveState()
        p = self.c.beginPath()
        p.rect(self._x(x), self._y(y + h), w * mm, h * mm)
        self.c.clipPath(p, stroke=0, fill=0)

    def clip_pop(self):
        self.c.restoreState()

    def crop_marks(self):
        if not self.bleed:
            return
        c = self.c
        c.setStrokeColor(CMYKColor(0, 0, 0, 1))
        c.setLineWidth(0.25)
        L = 4.0
        for (px, py) in [(BLEED, BLEED), (PAGE_W - BLEED, BLEED),
                         (BLEED, PAGE_H - BLEED), (PAGE_W - BLEED, PAGE_H - BLEED)]:
            sx = -1 if px < PAGE_W / 2 else 1
            sy = -1 if py < PAGE_H / 2 else 1
            c.line(self._x(px + sx * 1.0), self._y(py), self._x(px + sx * (1.0 + L)), self._y(py))
            c.line(self._x(px), self._y(py + sy * 1.0), self._x(px), self._y(py + sy * (1.0 + L)))

    def page_break(self):
        self.c.showPage()

    def save(self):
        self.c.save()


class SVGRenderer:
    """Arquivo aberto e editavel, RGB, no tamanho com sangria."""

    mode = "rgb"

    def __init__(self, path):
        self.path, self.parts, self.clips = path, [], 0
        self.band_path = build_hero_band("rgb")

    def rect(self, x, y, w, h, fill=None, stroke=None, lw=0.3, r=0.0, alpha=1.0):
        a = f'x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}"'
        if r:
            a += f' rx="{r:.3f}"'
        a += f' fill="{fill.rgb if fill else "none"}"'
        if alpha < 1.0:
            a += f' fill-opacity="{alpha:.3f}"'
        if stroke:
            a += f' stroke="{stroke.rgb}" stroke-width="{lw * PT:.3f}"'
        self.parts.append(f"<rect {a}/>")

    def line(self, x1, y1, x2, y2, color, lw=0.3):
        self.parts.append(
            f'<line x1="{x1:.3f}" y1="{y1:.3f}" x2="{x2:.3f}" y2="{y2:.3f}" '
            f'stroke="{color.rgb}" stroke-width="{lw * PT:.3f}"/>')

    def image(self, path, x, y, w, h, alpha=1.0):
        with open(path, "rb") as fh:
            b64 = base64.b64encode(fh.read()).decode("ascii")
        op = f' opacity="{alpha:.3f}"' if alpha < 1.0 else ""
        self.parts.append(
            f'<image x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}"'
            f'{op} preserveAspectRatio="none" '
            f'xlink:href="data:image/png;base64,{b64}"/>')

    def text(self, x, y, s, font, size_pt, color, tracking_pt=0.0, align="left"):
        if not s:
            return
        fam, weight, style = SVG_FAMILY[font]
        anchor = {"left": "start", "center": "middle", "right": "end"}[align]
        esc = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        ls = f' letter-spacing="{tracking_pt * PT:.4f}"' if tracking_pt else ""
        self.parts.append(
            f'<text x="{x:.3f}" y="{y:.3f}" font-family="{fam}" '
            f'font-size="{size_pt * PT:.4f}" font-weight="{weight}" '
            f'font-style="{style}" fill="{color.rgb}" '
            f'text-anchor="{anchor}"{ls}>{esc}</text>')

    def clip_push(self, x, y, w, h):
        self.clips += 1
        cid = f"clip{self.clips}"
        self.parts.append(
            f'<clipPath id="{cid}"><rect x="{x:.3f}" y="{y:.3f}" '
            f'width="{w:.3f}" height="{h:.3f}"/></clipPath><g clip-path="url(#{cid})">')

    def clip_pop(self):
        self.parts.append("</g>")

    def crop_marks(self):
        pass

    def page_break(self):
        pass

    def save(self):
        faces = []
        for alias, fn in FONT_FILES.items():
            fam, weight, style = SVG_FAMILY[alias]
            with open(os.path.join(FONTS, fn), "rb") as fh:
                b64 = base64.b64encode(fh.read()).decode("ascii")
            faces.append(
                f"@font-face{{font-family:'{fam}';font-weight:{weight};"
                f"font-style:{style};src:url(data:font/ttf;base64,{b64}) format('truetype');}}")
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'xmlns:xlink="http://www.w3.org/1999/xlink" width="{PAGE_W}mm" '
            f'height="{PAGE_H}mm" viewBox="0 0 {PAGE_W} {PAGE_H}">\n'
            f"<style>{''.join(faces)}</style>\n" + "\n".join(self.parts) + "\n</svg>\n")
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(svg)


# ----------------------------------------------------------------------------
# 5. COMPONENTES
# ----------------------------------------------------------------------------
def paragraph(r, x, y, s, font, size_pt, color, leading_mm, max_mm,
              tracking_pt=0.0, align="left"):
    lines = wrap(s, font, size_pt, max_mm, tracking_pt)
    for i, ln in enumerate(lines):
        r.text(x, y + i * leading_mm, ln, font, size_pt, color, tracking_pt, align)
    return y + (len(lines) - 1) * leading_mm


def eyebrow(r, x, y, s, color, size=5.8, tracking=1.5, align="left"):
    r.text(x, y, s.upper(), "JO-SB", size, color, tracking, align)


def cmyk_asset(png_path, frente, fundo):
    """Rasteriza um asset de cor chapada direto em CMYK, sobre um fundo chapado.

    Necessario porque um PDF de grafica em CMYK nao pode carregar imagem RGB
    embutida — muitas graficas recusam no preflight. Como o fundo do asset e
    exatamente a mesma cor CMYK do fundo vetorial da pagina, a emenda some.
    """
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    cache = os.path.join(OUT, "_band",
                         os.path.basename(png_path).replace(".png", "_cmyk.jpg"))
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    src = Image.open(png_path).convert("RGBA")
    alpha = src.split()[3]
    # PIL guarda CMYK como 0..255 por canal, 0 = sem tinta
    f = [int(round(v * 255)) for v in frente.cmyk]
    b = [int(round(v * 255)) for v in fundo.cmyk]
    canais = []
    for i in range(4):
        # interpola fundo -> frente pela mascara alpha, canal a canal
        base = Image.new("L", src.size, b[i])
        cheio = Image.new("L", src.size, f[i])
        canais.append(Image.composite(cheio, base, alpha))
    Image.merge("CMYK", canais).save(cache, "JPEG", quality=100, subsampling=0)
    return cache


def logo(r, path, x, y, altura_mm, ratio, frente=None, fundo=None):
    """Coloca o logo pela ALTURA — a largura sai da proporcao do arquivo."""
    if r.mode == "cmyk" and frente is not None:
        path = cmyk_asset(path, frente, fundo)
    r.image(path, x, y, altura_mm * ratio, altura_mm)


def qr_matrix(data):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=0)
    q.add_data(data)
    q.make(fit=True)
    return q.get_matrix()


def draw_qr(r, x, y, size_mm, matrix, fg, bg=None, quiet_mm=2.0):
    if bg:
        r.rect(x - quiet_mm, y - quiet_mm, size_mm + 2 * quiet_mm,
               size_mm + 2 * quiet_mm, fill=bg, r=1.2)
    n = len(matrix)
    m = size_mm / n
    for row in range(n):
        for col in range(n):
            if matrix[row][col]:
                r.rect(x + col * m, y + row * m, m * 1.02, m * 1.02, fill=fg)


BAND_DPI = 400          # resolucao do bitmap achatado da faixa de imagem


def _px(mm_val):
    return int(round(mm_val / 25.4 * BAND_DPI))


def build_hero_band(mode):
    """Achata a faixa de imagem da frente num unico bitmap e devolve o caminho.

    Por que achatar em vez de empilhar imagem + degrade + logo no PDF:
    o reportlab nao combina `setFillAlpha` com mascara alpha de PNG — a
    transparencia se perde e o PNG sai como um retangulo chapado. Compondo
    tudo no PIL a transparencia e resolvida antes de entrar no PDF.

    No modo de grafica o bitmap sai em CMYK (JPEG), porque um PDF CMYK com
    imagem RGB embutida e recusado no preflight de muitas graficas.
    """
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None

    W, H = _px(PAGE_W), _px(HERO_H)
    fundo = tuple(int(AZUL_DEEP.rgb[i:i + 2], 16) for i in (1, 3, 5))
    band = Image.new("RGB", (W, H), fundo)

    if os.path.exists(HERO):
        src = Image.open(HERO).convert("RGB")
        # cobre a area inteira preservando proporcao (cover), depois recorta
        k = max(W / src.width, H / src.height)
        src = src.resize((max(W, int(src.width * k)), max(H, int(src.height * k))),
                         Image.LANCZOS)
        ox, oy = (src.width - W) // 2, (src.height - H) // 2
        band = src.crop((ox, oy, ox + W, oy + H))
    else:
        # A marca sangra pela direita e pela base: solta no meio do azul ela
        # denuncia a caixa retangular do arquivo e parece um bloco colado.
        marca = Image.open(MARCA_LIMA).convert("RGBA")
        alt = _px(74.0)
        marca = marca.resize((int(alt * RATIO_MARCA), alt), Image.LANCZOS)
        a = marca.split()[3].point(lambda v: int(v * 0.20))
        marca.putalpha(a)
        band.paste(marca, (W - marca.width + _px(11), H - marca.height + _px(8)), marca)
        AVISOS.append("brand/hero.png ausente — usado o fundo grafico da marca "
                      "e marcado como PROVA. Nao mandar para a grafica assim.")

    # scrim: degrade do topo, garante contraste do logo sobre qualquer imagem
    scrim_h = _px(30.0)
    veu = Image.new("RGBA", (W, scrim_h))
    topo = tuple(int(AZUL_DEEP.rgb[i:i + 2], 16) for i in (1, 3, 5))
    for yy in range(scrim_h):
        a = int(255 * 0.70 * (1 - yy / scrim_h) ** 1.6)
        for_line = Image.new("RGBA", (W, 1), topo + (a,))
        veu.paste(for_line, (0, yy))
    band.paste(veu, (0, 0), veu)

    # logo por cima, ja com a transparencia resolvida
    logo_im = Image.open(LOGO_CREAM).convert("RGBA")
    lh = _px(5.6)
    logo_im = logo_im.resize((int(lh * RATIO_LOGO), lh), Image.LANCZOS)
    band.paste(logo_im, (_px(CX0), _px(11.0 - 4.3)), logo_im)

    os.makedirs(os.path.join(OUT, "_band"), exist_ok=True)
    if mode == "cmyk":
        path = os.path.join(OUT, "_band", "hero_cmyk.jpg")
        band.convert("CMYK").save(path, "JPEG", quality=95, dpi=(BAND_DPI, BAND_DPI))
    else:
        path = os.path.join(OUT, "_band", "hero_rgb.png")
        band.save(path, dpi=(BAND_DPI, BAND_DPI))
    return path


# ----------------------------------------------------------------------------
# 6. CONTEUDO
# ----------------------------------------------------------------------------
CUPOM = "ALUNONOVA15"
CUPOM_FRETE = "ALUNONOVAFRETE"
URL_CURTA = "botanikabrasil.com.br/tri"
QR_URL = "https://botanikabrasil.com.br/folder"

C = {
    "f_ns": "CURSO NOVA SAÚDE · DR. WILLIAM",
    "f_eyebrow": "Você entrou entre os primeiros",
    "f_h1_a": "Boas-vindas à",
    "f_h1_b": "Nova Saúde.",
    "f_lead": ("A plataforma, as aulas e tudo o que o Dr. William preparou "
               "para esta turma já são seus."),
    "f_gift": ("O pote nesta caixa é um presente da Botanika. Sem pegadinha e "
               "sem cobrança — só o nosso jeito de comemorar que você chegou cedo."),

    "v_eyebrow_1": "Quem mandou o presente",
    "v_tagline": "VOCÊ MAIS SAUDÁVEL",
    "v_body_1": ("Somos uma marca brasileira de suplementos. Fórmula curta, dose "
                 "que aparece no rótulo e nenhuma promessa milagrosa. A gente "
                 "prefere o que dá para manter todo dia."),
    "v_eyebrow_2": "Por que o Tri[Mg]",
    "v_h2_2": "Tri[Mg] Complex",
    "v_body_2": ("Porque é o mais fácil de encaixar na rotina. Três formas de "
                 "magnésio — malato, bisglicinato e citrato — na mesma cápsula."),
    "v_specs": [("232 mg", "por porção · 55% VD"),
                ("2 cápsulas", "por dia, sem sabor"),
                ("30 dias", "de uso por pote")],
    "v_offer_eyebrow": "Para quando o pote acabar",
    "v_offer_h": "15% OFF + frete grátis",
    "v_offer_sub": "Exclusivo para quem é aluno da Nova Saúde.",
    "v_offer_use": "Use os dois códigos no checkout:",
    "v_offer_qr": "Aponte a câmera",
    "v_legal_1": ("Suplemento alimentar. Não é medicamento. Consulte seu médico "
                  "ou nutricionista."),
    "v_legal_2": ("Não contém glúten. Sem adição de açúcares. Alérgicos: pode conter "
                  "traços de leite e soja. Não exceder a recomendação diária de "
                  "consumo. Mantenha fora do alcance de crianças."),
    "v_contato": "atendimento@botanikabrasil.com.br",
}

# proporcoes largura/altura dos assets (medidas dos arquivos)
RATIO_LOGO = 4000 / 749.0
RATIO_MARCA = 2349 / 3025.0


def draw_hero_unused(r, y0, h):
    """Mantido so como referencia — a faixa agora vem achatada de build_hero_band."""
    if os.path.exists(HERO):
        r.clip_push(0, y0, PAGE_W, h)
        r.image(HERO, 0, y0, PAGE_W, h)
        r.clip_pop()
    else:
        # Fundo grafico da marca, para a peca fechar mesmo sem a foto.
        # A marca-folha entra num tamanho que se le como marca d'agua, nao
        # como mancha: escalada demais ela vira um bloco chapado.
        r.rect(0, y0, PAGE_W, h, fill=AZUL_DEEP)
        r.clip_push(0, y0, PAGE_W, h)
        alt = 58.0
        r.image(MARCA_LIMA, PAGE_W - alt * RATIO_MARCA - 6, y0 + h - alt - 9,
                alt * RATIO_MARCA, alt, alpha=0.34)
        r.clip_pop()
        # marcacao de prova — some sozinha quando o hero.png for colocado
        r.text(CX0, y0 + h - 6.5, "PROVA · IMAGEM (CONCEITO 03) ENTRA NESTA ÁREA",
               "JO-M", 4.6, LIMA, 1.0)
        AVISOS.append("brand/hero.png ausente — usado o fundo grafico da marca "
                      "e marcado como PROVA. Nao mandar para a grafica assim.")


def draw_front(r):
    r.rect(0, 0, PAGE_W, PAGE_H, fill=AZUL)          # base azul, sangria total

    # faixa de imagem: um unico bitmap ja com scrim e logo compostos
    r.image(r.band_path, 0, 0, PAGE_W, HERO_H)
    if not os.path.exists(HERO):
        r.text(CX0, HERO_H - 6.5, "PROVA · IMAGEM (CONCEITO 03) ENTRA NESTA ÁREA",
               "JO-M", 4.6, LIMA, 1.0)

    r.text(CX1, 15.2, C["f_ns"], "JO-M", 5.0, LIMA, 1.0, align="right")

    # faixa lima fina marcando o fim da imagem
    r.rect(0, HERO_H, PAGE_W, 1.6, fill=LIMA_VIVO)

    # ---- mensagem, sobre o azul ----
    eyebrow(r, CX0, 91.0, C["f_eyebrow"], LIMA_VIVO, 5.8, 1.5)
    r.text(CX0, 103.5, C["f_h1_a"], "OF-B", 19.5, CREAM)
    r.text(CX0, 113.5, C["f_h1_b"], "OF-B", 19.5, CREAM)
    paragraph(r, CX0, 123.0, C["f_lead"], "JO", 7.4, CREAM, 4.1, CW)

    r.line(CX0, 133.5, CX0 + 14, 133.5, LIMA_VIVO, 0.9)
    paragraph(r, CX0, 139.0, C["f_gift"], "JO-M", 6.4, LIMA, 3.5, CW)


def draw_back(r):
    r.rect(0, 0, PAGE_W, PAGE_H, fill=CREAM)

    # ---------- bloco 1: quem e a Botanika ----------
    eyebrow(r, CX0, 16.0, C["v_eyebrow_1"], AZUL, 5.8, 1.5)
    logo(r, LOGO_AZUL, CX0, 20.5, 6.4, RATIO_LOGO, frente=AZUL, fundo=CREAM)
    r.text(CX0, 32.0, C["v_tagline"], "JO-M", 5.2, MUTED, 1.6)
    paragraph(r, CX0, 39.5, C["v_body_1"], "JO", 7.7, TEXT, 4.1, CW)

    r.line(CX0, 54.0, CX1, 54.0, LIMA, 0.8)

    # ---------- bloco 2: por que o Tri[Mg] ----------
    eyebrow(r, CX0, 61.5, C["v_eyebrow_2"], AZUL, 5.8, 1.5)
    r.text(CX0, 70.5, C["v_h2_2"], "OF-B", 15.0, AZUL, 0.2)
    paragraph(r, CX0, 78.0, C["v_body_2"], "JO", 7.7, TEXT, 4.1, CW)

    # tres dados — so composicao, rotina e rendimento. Nenhum efeito clinico.
    colw = CW / 3.0
    for i, (big, small) in enumerate(C["v_specs"]):
        x = CX0 + i * colw
        r.rect(x, 87.5, 1.4, 9.0, fill=LIMA_VIVO)
        r.text(x + 3.0, 91.6, big, "OF-B", 8.2, AZUL)
        r.text(x + 3.0, 95.6, small, "JO", 5.2, MUTED, 0.2)

    # ---------- bloco 3: o convite ----------
    PX, PY, PW, PH = CX0 - 3.0, 100.5, CW + 6.0, 24.5
    r.rect(PX, PY, PW, PH, fill=AZUL, r=2.2)

    TXL = PX + 4.5
    qsize, qpad = QR_SIZE_MM, 1.8
    qx = PX + PW - qsize - 4.2
    LBL_R = qx - qpad - 2.5

    eyebrow(r, TXL, PY + 5.4, C["v_offer_eyebrow"], LIMA_VIVO, 5.0, 1.3)
    r.text(TXL, PY + 12.2, C["v_offer_h"], "OF-B", 11.5, CREAM, 0.1)
    r.text(TXL, PY + 16.4, C["v_offer_sub"], "JO-M", 5.2, LIMA, 0.2)

    for i, (code, label) in enumerate([(CUPOM, "15% OFF"),
                                       (CUPOM_FRETE, "FRETE GRÁTIS")]):
        yy = PY + 20.4 + i * 3.6
        r.text(TXL, yy, code, "JO-B", 7.4, CREAM, 0.8)
        lx = TXL + text_w(code, "JO-B", 7.4, 0.8) + 2.0
        r.text(lx, yy, "· " + label, "JO-M", 4.8, LIMA_VIVO, 0.2)
        assert lx + text_w("· " + label, "JO-M", 4.8, 0.2) <= LBL_R, \
            f"rotulo '{label}' invade a area do QR"

    qy = PY + 4.6
    draw_qr(r, qx, qy, qsize, qr_matrix(QR_URL), AZUL, CREAM, quiet_mm=qpad)
    r.text(qx + qsize / 2.0, qy + qsize + 3.8, C["v_offer_qr"],
           "JO-M", 4.6, LIMA, 0.3, align="center")

    # ---------- rodape ----------
    r.text(CX0, 130.5, URL_CURTA, "OF-B", 7.5, AZUL, 0.4)
    r.text(CX1, 130.5, C["v_contato"], "JO-M", 5.2, MUTED, 0.1, align="right")
    paragraph(r, CX0, 134.8, C["v_legal_1"], "JO-SB", 5.4, TEXT, 2.8, CW)
    paragraph(r, CX0, 139.0, C["v_legal_2"], "JO", 4.6, MUTED, 2.6, CW)


# ----------------------------------------------------------------------------
# 7. BUILD
# ----------------------------------------------------------------------------
def build_pdf(path, mode):
    r = PDFRenderer(path, mode)
    draw_front(r)
    r.crop_marks()
    r.page_break()
    draw_back(r)
    r.crop_marks()
    r.save()
    return path


def build_svg(path, which):
    r = SVGRenderer(path)
    (draw_front if which == "front" else draw_back)(r)
    r.save()
    return path


def check_safe_area():
    bad = []
    for s, x0, y, x1, size_pt in EXTENTS:
        desc, asc = size_pt * PT * 0.22, size_pt * PT * 0.78
        if (x0 < SAFE_X0 - 1e-6 or x1 > SAFE_X1 + 1e-6
                or (y - asc) < SAFE_Y0 - 1e-6 or (y + desc) > SAFE_Y1 + 1e-6):
            bad.append(f"  fora da area segura: {s[:46]!r} (x {x0:.1f}..{x1:.1f}, y {y:.1f})")
    if bad:
        raise SystemExit("ERRO DE LAYOUT:\n" + "\n".join(bad))
    print(f"area de seguranca: OK ({len(EXTENTS)} blocos de texto conferidos)")


def check_hero_dpi():
    if not os.path.exists(HERO):
        return
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    w, h = Image.open(HERO).size
    dpi_x = w / (PAGE_W / 25.4)
    dpi_y = h / (HERO_H / 25.4)
    ok = min(dpi_x, dpi_y) >= 300
    print(f"imagem da frente: {w}x{h} px -> {dpi_x:.0f} x {dpi_y:.0f} dpi "
          f"{'OK' if ok else 'ABAIXO DE 300 dpi'}")
    if not ok:
        AVISOS.append(f"hero.png rende {min(dpi_x, dpi_y):.0f} dpi, abaixo dos 300")


def main():
    p1 = build_pdf(os.path.join(OUT, "folder-trimg-nova-saude_CMYK_sangria3mm.pdf"), "cmyk")
    p2 = build_pdf(os.path.join(OUT, "folder-trimg-nova-saude_RGB_tela.pdf"), "rgb")
    s1 = build_svg(os.path.join(OUT, "frente.svg"), "front")
    s2 = build_svg(os.path.join(OUT, "verso.svg"), "back")
    for p in (p1, p2, s1, s2):
        print("gerado:", os.path.relpath(p, HERE), os.path.getsize(p), "bytes")
    check_safe_area()
    check_hero_dpi()
    for a in dict.fromkeys(AVISOS):
        print("AVISO:", a)


if __name__ == "__main__":
    main()
