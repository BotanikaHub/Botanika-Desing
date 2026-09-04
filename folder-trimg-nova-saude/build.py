#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Folder impresso — Tri[Mg] Complex | Boas-vindas aos alunos da Nova Saude
=======================================================================

Gera, a partir de UMA unica definicao de layout:

  out/folder-trimg-nova-saude_CMYK_sangria3mm.pdf   -> PDF fechado para grafica
  out/folder-trimg-nova-saude_RGB_tela.pdf          -> visualizacao em tela
  out/frente.svg / out/verso.svg                    -> arquivos abertos, editaveis
  out/preview_frente.png / out/preview_verso.png    -> prova de tela 300 dpi

Formato: A6 chapado (sem dobra), 105 x 148 mm, frente e verso.
Sangria 3 mm em todos os lados. Margem de seguranca 5 mm do corte.
Nenhum texto essencial fora da area de seguranca. A peca nao tem dobra,
portanto nao existe area de dobra a respeitar.

As medidas sao parametricas: mudou a caixa, mude TRIM_W / TRIM_H e rode de novo.
"""

import os
import base64
import qrcode
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import CMYKColor, HexColor
from reportlab.lib.units import mm

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

# ----------------------------------------------------------------------------
# 1. FORMATO
# ----------------------------------------------------------------------------
TRIM_W, TRIM_H = 105.0, 148.0      # A6
BLEED = 3.0                         # sangria
SAFE = 5.0                          # margem de seguranca a partir do corte

PAGE_W = TRIM_W + 2 * BLEED         # 111
PAGE_H = TRIM_H + 2 * BLEED         # 154

# coluna de conteudo (folga extra alem da seguranca, por respiro visual)
CX0 = BLEED + 9.5                   # 12.5
CX1 = PAGE_W - BLEED - 9.5          # 98.5
CW = CX1 - CX0                      # 86

SAFE_X0, SAFE_Y0 = BLEED + SAFE, BLEED + SAFE
SAFE_X1, SAFE_Y1 = PAGE_W - BLEED - SAFE, PAGE_H - BLEED - SAFE

# ----------------------------------------------------------------------------
# 2. PALETA
#
# Decisao: paleta da MARCA Botanika, nao a paleta do produto Tri[Mg].
# O folder apresenta a Botanika a quem ainda nao a conhece; se ele vestir a
# identidade de um unico produto, a marca vira "a empresa do magnesio" e a
# proxima peca parecera outra marca. O indigo/menta do Tri entra apenas no
# bloco do produto, como ponte — nao como base.
#
# CMYK escolhido para impressao (soma de tinta sempre < 300%).
# Texto pequeno em K100 puro: sem risco de erro de registro.
# ----------------------------------------------------------------------------
class Color:
    def __init__(self, name, cmyk, rgb):
        self.name, self.cmyk, self.rgb = name, cmyk, rgb

    def rl(self, mode):
        return CMYKColor(*self.cmyk) if mode == "cmyk" else HexColor(self.rgb)


PAPER = Color("paper", (0.02, 0.03, 0.08, 0.00), "#F7F2E8")   # off-white quente
INK = Color("ink", (0.78, 0.52, 0.66, 0.56), "#17322A")   # verde-preto profundo
TEXT = Color("text", (0.00, 0.00, 0.00, 1.00), "#151515")   # K100 — corpo de texto
MUTED = Color("muted", (0.00, 0.00, 0.00, 0.62), "#6B6B6B")   # apoio
GOLD = Color("gold", (0.24, 0.40, 0.95, 0.08), "#B4842F")   # dourado de impressao
GOLDL = Color("goldlight", (0.15, 0.28, 0.75, 0.00), "#D9A94F")  # dourado claro
INDIGO = Color("indigo", (0.92, 0.82, 0.34, 0.22), "#2A3363")   # ponte Tri[Mg]
MINT = Color("mint", (0.45, 0.00, 0.30, 0.02), "#86C7B0")   # ponte Tri[Mg]
CREAM = Color("cream", (0.02, 0.03, 0.08, 0.00), "#F7F2E8")   # texto sobre escuro

# ----------------------------------------------------------------------------
# 3. TIPOGRAFIA
# Playfair Display (titulos) + Manrope (corpo) — o par ja usado no design
# system da Botanika. Mantido aqui para o papel falar a mesma lingua das LPs.
# ----------------------------------------------------------------------------
FONT_FILES = {
    "PF": "Playfair-Regular.ttf",
    "PF-SB": "Playfair-SemiBold.ttf",
    "PF-B": "Playfair-Bold.ttf",
    "PF-I": "Playfair-Italic.ttf",
    "MR": "Manrope-Regular.ttf",
    "MR-M": "Manrope-Medium.ttf",
    "MR-SB": "Manrope-SemiBold.ttf",
    "MR-B": "Manrope-Bold.ttf",
    "MR-XB": "Manrope-ExtraBold.ttf",
}
for alias, fn in FONT_FILES.items():
    pdfmetrics.registerFont(TTFont(alias, os.path.join(FONTS, fn)))

# Cada peso foi instanciado do variable font com um nome de familia PROPRIO.
# Sem isso o reportlab funde todos os pesos num subset so e a peca inteira sai
# num unico peso. Os nomes aqui precisam bater com a tabela 'name' dos .ttf.
SVG_FAMILY = {
    "PF": ("Playfair Display Rg", 400, "normal"),
    "PF-SB": ("Playfair Display Sb", 400, "normal"),
    "PF-B": ("Playfair Display Bd", 400, "normal"),
    "PF-I": ("Playfair Display It", 400, "normal"),
    "MR": ("Manrope Rg", 400, "normal"),
    "MR-M": ("Manrope Md", 400, "normal"),
    "MR-SB": ("Manrope Sb", 400, "normal"),
    "MR-B": ("Manrope Bd", 400, "normal"),
    "MR-XB": ("Manrope Xb", 400, "normal"),
}

PT = 25.4 / 72.0  # 1pt em mm


# Toda string desenhada registra sua caixa aqui. No fim do build conferimos
# que nenhum texto saiu da area de seguranca — assim uma edicao futura de copy
# que estoure a margem quebra o build em vez de chegar na grafica.
EXTENTS = []


def text_w(s, font, size_pt, tracking_pt=0.0):
    """Largura em mm de uma string."""
    w = pdfmetrics.stringWidth(s, font, size_pt)
    if tracking_pt and s:
        w += tracking_pt * len(s)
    return w * PT


def wrap(s, font, size_pt, max_mm, tracking_pt=0.0):
    """Quebra de linha por largura real da fonte."""
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
# 4. RENDERERS
# Coordenadas do layout: milimetros, origem no canto superior esquerdo da
# SANGRIA, eixo y crescendo para baixo. Cada backend converte.
# ----------------------------------------------------------------------------
class PDFRenderer:
    def __init__(self, path, mode):
        self.mode = mode
        self.bleed = (mode == "cmyk")
        w = PAGE_W if self.bleed else TRIM_W
        h = PAGE_H if self.bleed else TRIM_H
        self.off = 0.0 if self.bleed else BLEED   # sem sangria: corta a margem
        self.h = h
        # initialFontName: sem isso o reportlab abre cada pagina com um
        # "BT /F1 12 Tf ET" em Helvetica. Nao desenha nada, mas deixa uma fonte
        # NAO embutida no dicionario de recursos e o preflight da grafica acusa.
        self.c = rl_canvas.Canvas(path, pagesize=(w * mm, h * mm),
                                  initialFontName="MR", initialFontSize=8)
        self.c.setTitle("Folder Tri[Mg] Complex — Boas-vindas Nova Saude")
        self.c.setAuthor("Botanika Brasil")
        self.c.setSubject("A6 105x148mm, frente e verso")

    # y do layout -> y do reportlab
    def _y(self, y):
        return (self.h - (y - self.off)) * mm

    def _x(self, x):
        return (x - self.off) * mm

    def rect(self, x, y, w, h, fill=None, stroke=None, lw=0.3, r=0.0):
        c = self.c
        if fill:
            c.setFillColor(fill.rl(self.mode))
        if stroke:
            c.setStrokeColor(stroke.rl(self.mode))
            c.setLineWidth(lw * PT if False else lw)
        if r > 0:
            c.roundRect(self._x(x), self._y(y + h), w * mm, h * mm, r * mm,
                        fill=1 if fill else 0, stroke=1 if stroke else 0)
        else:
            c.rect(self._x(x), self._y(y + h), w * mm, h * mm,
                   fill=1 if fill else 0, stroke=1 if stroke else 0)

    def line(self, x1, y1, x2, y2, color, lw=0.3):
        c = self.c
        c.setStrokeColor(color.rl(self.mode))
        c.setLineWidth(lw)
        c.line(self._x(x1), self._y(y1), self._x(x2), self._y(y2))

    def circle(self, cx, cy, rad, stroke, lw=0.3):
        c = self.c
        c.setStrokeColor(stroke.rl(self.mode))
        c.setLineWidth(lw)
        c.circle(self._x(cx), self._y(cy), rad * mm, fill=0, stroke=1)

    def text(self, x, y, s, font, size_pt, color, tracking_pt=0.0, align="left"):
        if not s:
            return
        c = self.c
        if align == "center":
            x = x - text_w(s, font, size_pt, tracking_pt) / 2.0
        elif align == "right":
            x = x - text_w(s, font, size_pt, tracking_pt)
        if self.mode == "cmyk":   # registra uma vez so (o layout e identico)
            EXTENTS.append((s, x, y, x + text_w(s, font, size_pt, tracking_pt),
                            size_pt))
        to = c.beginText(self._x(x), self._y(y))
        to.setFont(font, size_pt)
        to.setFillColor(color.rl(self.mode))
        # sempre explicito: o charSpace do reportlab e estado de canvas e vaza
        # para o proximo bloco de texto se nao for zerado.
        to.setCharSpace(tracking_pt)
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
        """Marcas de corte fora da area de sangria (so no PDF de grafica)."""
        if not self.bleed:
            return
        c = self.c
        c.setStrokeColor(CMYKColor(0, 0, 0, 1))
        c.setLineWidth(0.25)
        L = 4.0      # comprimento da marca
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
    """Arquivo aberto e editavel. Sempre em RGB, no tamanho com sangria."""

    def __init__(self, path):
        self.path = path
        self.parts = []
        self.clips = 0

    def _c(self, color):
        return color.rgb

    def rect(self, x, y, w, h, fill=None, stroke=None, lw=0.3, r=0.0):
        a = f'x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}"'
        if r:
            a += f' rx="{r:.3f}"'
        a += f' fill="{self._c(fill) if fill else "none"}"'
        if stroke:
            a += f' stroke="{self._c(stroke)}" stroke-width="{lw * PT:.3f}"'
        self.parts.append(f"<rect {a}/>")

    def line(self, x1, y1, x2, y2, color, lw=0.3):
        self.parts.append(
            f'<line x1="{x1:.3f}" y1="{y1:.3f}" x2="{x2:.3f}" y2="{y2:.3f}" '
            f'stroke="{self._c(color)}" stroke-width="{lw * PT:.3f}"/>')

    def circle(self, cx, cy, rad, stroke, lw=0.3):
        self.parts.append(
            f'<circle cx="{cx:.3f}" cy="{cy:.3f}" r="{rad:.3f}" fill="none" '
            f'stroke="{self._c(stroke)}" stroke-width="{lw * PT:.3f}"/>')

    def text(self, x, y, s, font, size_pt, color, tracking_pt=0.0, align="left"):
        if not s:
            return
        fam, weight, style = SVG_FAMILY[font]
        anchor = {"left": "start", "center": "middle", "right": "end"}[align]
        esc = (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
        ls = f' letter-spacing="{tracking_pt * PT:.4f}"' if tracking_pt else ""
        self.parts.append(
            f'<text x="{x:.3f}" y="{y:.3f}" font-family="{fam}" '
            f'font-size="{size_pt * PT:.4f}" font-weight="{weight}" '
            f'font-style="{style}" fill="{self._c(color)}" '
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
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{PAGE_W}mm" '
            f'height="{PAGE_H}mm" viewBox="0 0 {PAGE_W} {PAGE_H}">\n'
            f"<style>{''.join(faces)}</style>\n"
            + "\n".join(self.parts) + "\n</svg>\n")
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(svg)


# ----------------------------------------------------------------------------
# 5. COMPONENTES
# ----------------------------------------------------------------------------
def paragraph(r, x, y, s, font, size_pt, color, leading_mm, max_mm,
              tracking_pt=0.0, align="left"):
    """Desenha paragrafo com quebra automatica. Devolve o y da ultima linha."""
    lines = wrap(s, font, size_pt, max_mm, tracking_pt)
    for i, ln in enumerate(lines):
        r.text(x, y + i * leading_mm, ln, font, size_pt, color, tracking_pt, align)
    return y + (len(lines) - 1) * leading_mm


def eyebrow(r, x, y, s, color=GOLD, size=6.2, tracking=1.6, align="left"):
    r.text(x, y, s.upper(), "MR-SB", size, color, tracking, align)


def rule(r, x0, x1, y, color=GOLD, lw=0.4):
    r.line(x0, y, x1, y, color, lw)


def arcs(r, cx, cy, radii, color, lw=0.35):
    """Assinatura grafica da peca: tres arcos concentricos finos.

    Tres porque o presente e um magnesio de tres formas — o desenho carrega o
    conceito sem precisar explicar. Sangram pela borda, dando profundidade
    sem competir com o texto."""
    r.clip_push(0, 0, PAGE_W, PAGE_H)
    for rad in radii:
        r.circle(cx, cy, rad, color, lw)
    r.clip_pop()


def qr_matrix(data):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=0)
    q.add_data(data)
    q.make(fit=True)
    return q.get_matrix()


def draw_qr(r, x, y, size_mm, matrix, fg, bg=None, quiet_mm=2.0):
    """QR vetorial. Quiet zone explicita — sem ela leitor nenhum le."""
    if bg:
        r.rect(x - quiet_mm, y - quiet_mm, size_mm + 2 * quiet_mm,
               size_mm + 2 * quiet_mm, fill=bg, r=1.2)
    n = len(matrix)
    m = size_mm / n
    for row in range(n):
        for col in range(n):
            if matrix[row][col]:
                # leve overlap evita fios brancos entre modulos na impressao
                r.rect(x + col * m, y + row * m, m * 1.02, m * 1.02, fill=fg)


# ----------------------------------------------------------------------------
# 6. CONTEUDO
# ----------------------------------------------------------------------------
CUPOM = "ALUNONOVA15"
CUPOM_FRETE = "ALUNONOVAFRETE"
URL_CURTA = "botanikabrasil.com.br/tri"
QR_URL = "https://botanikabrasil.com.br/folder"

C = {
    # ---- FRENTE ----
    "f_marca_ns": "NOVA SAÚDE",
    "f_marca_ns_sub": "PLATAFORMA DE CONHECIMENTO · DR. WILLIAM",
    "f_eyebrow": "Você entrou entre os primeiros",
    "f_h1_a": "Boas-vindas à",
    "f_h1_b": "Nova Saúde.",
    "f_lead": ("A plataforma, as aulas e tudo o que o Dr. William preparou para "
               "esta turma já são seus. Aproveite com calma: conhecimento bom "
               "não tem pressa."),
    "f_gift_eyebrow": "E tem mais uma coisa nesta caixa",
    "f_gift": ("O pote que veio junto é um presente da Botanika. Sem pegadinha e "
               "sem cobrança — é o nosso jeito de comemorar que você chegou cedo."),
    "f_wordmark": "BOTANIKA",
    "f_tagline": "SUPLEMENTOS PARA A ROTINA",

    # ---- VERSO ----
    "v_eyebrow_1": "Quem mandou o presente",
    "v_h2_1": "Botanika",
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
    "v_offer_url": URL_CURTA,

    "v_legal_1": ("Suplemento alimentar. Não é medicamento. Consulte seu médico "
                  "ou nutricionista."),
    "v_legal_2": ("Não contém glúten. Sem adição de açúcares. Alérgicos: pode conter "
                  "traços de leite e soja. Não exceder a recomendação diária de "
                  "consumo. Mantenha fora do alcance de crianças."),
    "v_contato": "atendimento@botanikabrasil.com.br",
}


def draw_front(r):
    # fundo em sangria total
    r.rect(0, 0, PAGE_W, PAGE_H, fill=PAPER)

    # assinatura grafica: tres arcos sangrando pelo canto inferior direito.
    # Centro e raios calculados para o arco externo passar SEMPRE abaixo da
    # ultima linha de texto do bloco do presente (y 125,5 em x 98,5).
    arcs(r, PAGE_W + 10, PAGE_H + 10, [30, 36, 42], GOLDL, 0.35)

    # -- lockup Nova Saude (contexto: e por causa dela que a caixa chegou) --
    # [SLOT DE LOGO] Nova Saude — trocar este wordmark pelo arquivo vetorial
    # quando chegar. Caixa util: x 12.5..60, altura ate 9 mm.
    r.text(CX0, 17.0, C["f_marca_ns"], "PF-SB", 11.0, INK, 1.6)
    r.text(CX0, 21.2, C["f_marca_ns_sub"], "MR-M", 5.0, MUTED, 0.9)
    rule(r, CX0, CX1, 26.5, GOLD, 0.4)

    # -- mensagem principal --
    eyebrow(r, CX0, 40.0, C["f_eyebrow"], GOLD, 6.2, 1.6)
    r.text(CX0, 53.0, C["f_h1_a"], "PF-B", 22.0, INK)
    r.text(CX0, 62.6, C["f_h1_b"], "PF-B", 22.0, INK)
    paragraph(r, CX0, 74.0, C["f_lead"], "MR", 8.4, TEXT, 4.5, CW)

    # -- o presente --
    rule(r, CX0, CX0 + 16, 96.0, GOLD, 0.9)
    eyebrow(r, CX0, 104.5, C["f_gift_eyebrow"], GOLD, 6.2, 1.6)
    paragraph(r, CX0, 113.0, C["f_gift"], "MR", 8.4, TEXT, 4.5, CW)

    # -- assinatura Botanika (dona da peca) --
    # [SLOT DE LOGO] Botanika — logo-c.png (990x187). Caixa util:
    # x 12.5..52, altura ate 7.4 mm, alinhado a esquerda pela baseline abaixo.
    r.text(CX0, 139.5, C["f_wordmark"], "PF-B", 13.0, INK, 3.0)
    r.text(CX0, 144.0, C["f_tagline"], "MR-M", 5.0, MUTED, 1.2)


def draw_back(r):
    r.rect(0, 0, PAGE_W, PAGE_H, fill=PAPER)
    # os mesmos tres arcos, agora no topo direito: amarra frente e verso sem
    # cruzar o texto (a coluna comeca em x 12,5 e o arco externo so aparece
    # acima da primeira linha de corpo).
    arcs(r, PAGE_W + 10, -10, [30, 36, 42], GOLDL, 0.35)

    # ---------- bloco 1: quem e a Botanika ----------
    eyebrow(r, CX0, 16.5, C["v_eyebrow_1"], GOLD, 6.0, 1.5)
    r.text(CX0, 25.5, C["v_h2_1"], "PF-B", 15.0, INK, 0.6)
    paragraph(r, CX0, 32.5, C["v_body_1"], "MR", 7.9, TEXT, 4.2, CW)

    rule(r, CX0, CX1, 47.0, GOLDL, 0.3)

    # ---------- bloco 2: por que o Tri[Mg] ----------
    eyebrow(r, CX0, 54.5, C["v_eyebrow_2"], GOLD, 6.0, 1.5)
    r.text(CX0, 63.5, C["v_h2_2"], "PF-B", 15.0, INDIGO, 0.4)
    paragraph(r, CX0, 70.5, C["v_body_2"], "MR", 7.9, TEXT, 4.2, CW)

    # tres specs — so composicao, rotina e rendimento. Nenhum efeito clinico.
    colw = CW / 3.0
    for i, (big, small) in enumerate(C["v_specs"]):
        x = CX0 + i * colw
        r.line(x, 81.0, x, 90.0, MINT, 0.9)
        r.text(x + 2.4, 85.0, big, "MR-XB", 8.0, INDIGO, 0.0)
        r.text(x + 2.4, 89.0, small, "MR-M", 5.2, MUTED, 0.3)

    # ---------- bloco 3: o convite ----------
    PX, PY, PW, PH = CX0 - 3.0, 94.0, CW + 6.0, 35.0
    r.rect(PX, PY, PW, PH, fill=INK, r=1.6)

    TXL = PX + 4.5                     # coluna de texto do painel
    qsize, qpad = 17.0, 2.0
    qx = PX + PW - qsize - 5.0
    LBL_R = qx - qpad - 2.5            # limite direito da coluna de texto

    eyebrow(r, TXL, PY + 6.0, C["v_offer_eyebrow"], GOLDL, 5.6, 1.4)
    r.text(TXL, PY + 13.5, C["v_offer_h"], "PF-B", 13.0, CREAM, 0.2)
    r.text(TXL, PY + 18.0, C["v_offer_sub"], "MR-M", 5.8, GOLDL, 0.2)
    r.text(TXL, PY + 23.0, C["v_offer_use"], "MR-M", 5.4, CREAM, 0.4)

    # os dois codigos, cada um colado no que ele faz — se o rotulo flutua longe
    # do codigo, o leitor nao associa os dois.
    for i, (code, label) in enumerate([(CUPOM, "15% OFF"),
                                       (CUPOM_FRETE, "FRETE GRÁTIS")]):
        yy = PY + 28.0 + i * 4.8
        r.text(TXL, yy, code, "MR-XB", 8.0, CREAM, 0.9)
        lx = TXL + text_w(code, "MR-XB", 8.0, 0.9) + 2.4
        r.text(lx, yy, "· " + label, "MR-M", 5.2, GOLDL, 0.3)
        assert lx + text_w("· " + label, "MR-M", 5.2, 0.3) <= LBL_R, \
            f"rotulo '{label}' invade a area do QR"

    # QR dentro do painel, com quiet zone em papel (sem ela nao le)
    qy = PY + 6.5
    draw_qr(r, qx, qy, qsize, qr_matrix(QR_URL), INK, CREAM, quiet_mm=qpad)
    r.text(qx + qsize / 2.0, qy + qsize + 4.8, C["v_offer_qr"],
           "MR-M", 5.0, GOLDL, 0.4, align="center")

    # ---------- rodape ----------
    # ultima linha em y 145,0: dentro da margem de seguranca de 5 mm.
    r.text(CX0, 134.5, C["v_offer_url"], "MR-B", 7.5, INK, 0.6)
    r.text(CX1, 134.5, C["v_contato"], "MR-M", 5.2, MUTED, 0.2, align="right")
    paragraph(r, CX0, 139.0, C["v_legal_1"], "MR-SB", 5.4, TEXT, 2.8, CW)
    paragraph(r, CX0, 142.4, C["v_legal_2"], "MR", 4.8, MUTED, 2.6, CW)


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
    """Nenhum texto essencial pode sair da area de seguranca (5 mm do corte).

    Considera a descida da fonte (~22% do corpo) abaixo da linha de base.
    """
    bad = []
    for s, x0, y, x1, size_pt in EXTENTS:
        desc = size_pt * PT * 0.22
        asc = size_pt * PT * 0.78
        if (x0 < SAFE_X0 - 1e-6 or x1 > SAFE_X1 + 1e-6
                or (y - asc) < SAFE_Y0 - 1e-6 or (y + desc) > SAFE_Y1 + 1e-6):
            bad.append(f"  fora da area segura: {s[:46]!r} "
                       f"(x {x0:.1f}..{x1:.1f}, y {y:.1f})")
    if bad:
        raise SystemExit("ERRO DE LAYOUT:\n" + "\n".join(bad))
    print(f"area de seguranca: OK ({len(EXTENTS)} blocos de texto conferidos, "
          f"limites x {SAFE_X0}..{SAFE_X1} / y {SAFE_Y0}..{SAFE_Y1} mm)")


def main():
    p1 = build_pdf(os.path.join(OUT, "folder-trimg-nova-saude_CMYK_sangria3mm.pdf"), "cmyk")
    p2 = build_pdf(os.path.join(OUT, "folder-trimg-nova-saude_RGB_tela.pdf"), "rgb")
    s1 = build_svg(os.path.join(OUT, "frente.svg"), "front")
    s2 = build_svg(os.path.join(OUT, "verso.svg"), "back")
    for p in (p1, p2, s1, s2):
        print("gerado:", os.path.relpath(p, HERE), os.path.getsize(p), "bytes")
    check_safe_area()


if __name__ == "__main__":
    main()
