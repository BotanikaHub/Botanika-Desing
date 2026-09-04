#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Confere o PDF de grafica antes de enviar. Roda depois do build.py.

Verifica:
  1. numero de paginas e medida da pagina (deve ser 111 x 154 mm, com sangria)
  2. espaco de cor: o arquivo de grafica nao pode conter operador RGB
  3. fontes embutidas (a grafica nao tem Playfair nem Manrope instaladas)
  4. o QR do verso decodifica e aponta para a URL certa
  5. cobertura maxima de tinta da paleta (limite pratico: 300%)
"""

import os
import re
import sys
import zlib

import pypdfium2 as pdfium
import zxingcpp
from pypdf import PdfReader

import build as B

HERE = os.path.dirname(os.path.abspath(__file__))
PRINT_PDF = os.path.join(HERE, "out", "folder-trimg-nova-saude_CMYK_sangria3mm.pdf")

falhas, avisos = [], []


def check(ok, msg_ok, msg_fail, hard=True):
    if ok:
        print("  OK   ", msg_ok)
    else:
        print("  FALHA", msg_fail)
        (falhas if hard else avisos).append(msg_fail)


print("Conferindo:", os.path.relpath(PRINT_PDF, HERE))
reader = PdfReader(PRINT_PDF)

# 1. paginas e medida ---------------------------------------------------------
check(len(reader.pages) == 2, "2 paginas (frente e verso)",
      f"esperava 2 paginas, achei {len(reader.pages)}")

MM = 72.0 / 25.4
esperado = (B.PAGE_W, B.PAGE_H)
for i, page in enumerate(reader.pages):
    box = page.mediabox
    w, h = float(box.width) / MM, float(box.height) / MM
    ok = abs(w - esperado[0]) < 0.2 and abs(h - esperado[1]) < 0.2
    check(ok,
          f"pagina {i + 1}: {w:.1f} x {h:.1f} mm "
          f"(corte {B.TRIM_W}x{B.TRIM_H} + {B.BLEED} mm de sangria)",
          f"pagina {i + 1} mede {w:.1f}x{h:.1f} mm, esperava "
          f"{esperado[0]}x{esperado[1]}")

# 2. espaco de cor ------------------------------------------------------------
# No content stream do PDF: 'rg'/'RG' = RGB, 'k'/'K' = CMYK, 'g'/'G' = cinza.
streams = b""
for page in reader.pages:
    data = page.get_contents().get_data()
    try:
        data = zlib.decompress(data)
    except zlib.error:
        pass
    streams += data + b"\n"

txt = streams.decode("latin-1")
rgb_ops = re.findall(r"(?<![A-Za-z0-9./])[\d.]+\s+[\d.]+\s+[\d.]+\s+(rg|RG)(?![A-Za-z])", txt)
cmyk_ops = re.findall(r"(?<![A-Za-z0-9./])[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+(k|K)(?![A-Za-z])", txt)
check(len(rgb_ops) == 0,
      f"sem operador RGB; {len(cmyk_ops)} definicoes de cor em DeviceCMYK",
      f"{len(rgb_ops)} operadores RGB no arquivo de grafica — precisa ser CMYK puro")

# 3. fontes embutidas ---------------------------------------------------------
embutidas, ausentes = set(), set()
for page in reader.pages:
    fonts = page.get("/Resources", {}).get("/Font", {})
    for key in fonts:
        fo = fonts[key].get_object()
        base = str(fo.get("/BaseFont", "?")).lstrip("/")
        desc = fo.get("/FontDescriptor")
        if desc is None and fo.get("/DescendantFonts"):
            desc = fo["/DescendantFonts"][0].get_object().get("/FontDescriptor")
        d = desc.get_object() if desc else {}
        if any(k in d for k in ("/FontFile", "/FontFile2", "/FontFile3")):
            embutidas.add(base)
        else:
            ausentes.add(base)
check(not ausentes,
      f"{len(embutidas)} fontes embutidas: " + ", ".join(sorted(embutidas)),
      f"fontes NAO embutidas: {', '.join(sorted(ausentes))}")

# 4. QR -----------------------------------------------------------------------
img = pdfium.PdfDocument(PRINT_PDF)[1].render(scale=300 / 72).to_pil()
lidos = zxingcpp.read_barcodes(img)
check(len(lidos) == 1 and lidos[0].text == B.QR_URL,
      f"QR decodifica em 300 dpi -> {lidos[0].text if lidos else '-'}",
      "QR nao decodificou ou aponta para a URL errada")

if lidos:
    # tamanho do modulo: abaixo de ~0,4 mm a leitura no papel fica instavel
    n = len(B.qr_matrix(B.QR_URL))
    mod_mm = 17.0 / n
    check(mod_mm >= 0.4,
          f"modulo do QR = {mod_mm:.2f} mm ({n}x{n} modulos em 17 mm)",
          f"modulo do QR = {mod_mm:.2f} mm — muito fino para impressao", hard=False)

# 5. cobertura de tinta -------------------------------------------------------
pior = max(((c.name, sum(c.cmyk) * 100) for c in
            [B.PAPER, B.INK, B.TEXT, B.MUTED, B.GOLD, B.GOLDL, B.INDIGO, B.MINT]),
           key=lambda t: t[1])
check(pior[1] <= 300,
      f"cobertura maxima de tinta: {pior[1]:.0f}% (cor '{pior[0]}'), limite 300%",
      f"cor '{pior[0]}' soma {pior[1]:.0f}% de tinta — acima do limite de 300%")

# ----------------------------------------------------------------------------
print()
if falhas:
    print(f"REPROVADO — {len(falhas)} problema(s):")
    for f in falhas:
        print("  -", f)
    sys.exit(1)
if avisos:
    print(f"APROVADO com {len(avisos)} aviso(s).")
else:
    print("APROVADO — arquivo pronto para a grafica.")
