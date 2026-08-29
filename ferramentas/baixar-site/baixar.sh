#!/usr/bin/env bash
# Baixa TUDO de um site para servir de referência de modelagem.
#
#   ./baixar.sh https://site-que-quero.com [--links 8] [--rapido] [--render]
#
# Padrão (sem flags): faz os dois passes.
#   1) wget  — espelho "cru" do HTML servido + todos os arquivos linkados
#   2) chromium/playwright — roda o JS e salva o que só existe depois do render
#
# Resultado em: capturas/<host>/

set -uo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# As capturas caem em ./capturas a partir de onde você rodou o comando.
RAIZ="$PWD"

URL=""
LINKS=0
MODO="tudo"
DESTINO=""
ARGS_EXTRA=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --rapido) MODO="wget"; shift ;;
    --render) MODO="render"; shift ;;
    --links)  LINKS="$2"; shift 2 ;;
    --saida)  DESTINO="$2"; shift 2 ;;
    --*)      ARGS_EXTRA+=("$1"); shift ;;
    *)        [[ -z "$URL" ]] && URL="$1" || ARGS_EXTRA+=("$1"); shift ;;
  esac
done

if [[ -z "$URL" ]]; then
  echo "uso: ./baixar.sh <url> [--links N] [--rapido|--render]" >&2
  exit 1
fi

HOST="$(echo "$URL" | sed -E 's#^https?://##; s#/.*##')"
SAIDA="${DESTINO:-$RAIZ/capturas/$HOST}"
mkdir -p "$SAIDA"

echo "=============================================="
echo " site : $URL"
echo " saida: $SAIDA"
echo "=============================================="

# ---------------------------------------------------------------- 1) wget
if [[ "$MODO" == "tudo" || "$MODO" == "wget" ]]; then
  echo
  echo "[1/3] wget — HTML cru + arquivos linkados"
  mkdir -p "$SAIDA/bruto"
  if ! command -v wget >/dev/null 2>&1; then
    echo "  !! wget não está instalado — pulando este passe."
    echo "     instale com:  brew install wget"
    echo "     (o passe do navegador, que é o mais importante, continua normal)"
  else
  wget \
    --page-requisites \
    --span-hosts \
    --convert-links \
    --adjust-extension \
    --restrict-file-names=windows \
    --no-verbose \
    --timeout=25 --tries=2 \
    --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" \
    --directory-prefix="$SAIDA/bruto" \
    "$URL" 2>&1 | tail -20
  if [[ -z "$(find "$SAIDA/bruto" -type f ! -name '_*' -print -quit 2>/dev/null)" ]]; then
    echo "  !! o wget não baixou nada (site com proteção anti-bot, provavelmente)."
    echo "     sem problema: o passe do navegador não usa wget."
  fi
  fi

  echo
  echo "[2/3] robots.txt e sitemap"
  for arq in robots.txt sitemap.xml sitemap_index.xml; do
    curl -fsS --max-time 20 "https://$HOST/$arq" -o "$SAIDA/bruto/_$arq" 2>/dev/null \
      && echo "  ✓ $arq" || echo "  – $arq (não existe)"
  done
fi

# ------------------------------------------------------------ 2) navegador
if [[ "$MODO" == "tudo" || "$MODO" == "render" ]]; then
  echo
  echo "[3/3] chromium — render completo (JS, lazy-load, fontes, APIs)"
  export NODE_PATH="${NODE_PATH:-}:$(npm root -g)"
  node "$AQUI/capturar.mjs" "$URL" --saida "$SAIDA" --links "$LINKS" "${ARGS_EXTRA[@]+"${ARGS_EXTRA[@]}"}"
fi

conta() { find "$SAIDA/$1" -type f 2>/dev/null | wc -l | tr -d ' '; }

echo
echo "=============================================="
echo " RESULTADO"
echo "=============================================="
printf ' %-12s %5s arquivos  %s\n' "dom/"      "$(conta dom)"      "HTML renderizado"
printf ' %-12s %5s arquivos  %s\n' "arquivos/" "$(conta arquivos)" "css, js, imagens, fontes"
printf ' %-12s %5s arquivos  %s\n' "telas/"    "$(conta telas)"    "screenshots"
printf ' %-12s %5s arquivos  %s\n' "bruto/"    "$(conta bruto)"    "espelho do wget"
echo
du -sh "$SAIDA" 2>/dev/null

if [[ "$(conta dom)" -eq 0 ]]; then
  echo
  echo " !! NADA FOI CAPTURADO PELO NAVEGADOR."
  echo "    Causas comuns:"
  echo "      - chromium não instalado →  npx playwright install chromium"
  echo "      - site com Cloudflare/anti-bot → rode de novo com  --visivel"
  echo "      - sem internet ou site fora do ar"
else
  echo
  echo " Comece lendo: $SAIDA/RELATORIO.md"
  echo " Abrir no Finder:  open \"$SAIDA\""
fi
echo "=============================================="
