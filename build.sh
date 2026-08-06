#!/usr/bin/env bash
# Cloudflare Pages — gera os slugs limpos das campanhas a partir das pastas landing-*.
# As pastas landing-<slug> continuam sendo a fonte da verdade (não muda nada pros outros agentes).
# Cada produto ganha uma cópia numa pasta com o slug curto usado nos anúncios.
set -e

clone() { rm -rf "$2"; mkdir -p "$2"; cp -a "$1/." "$2/"; echo "  $1 -> /$2"; }

echo "Gerando slugs limpos das LPs:"
clone landing-omega omega3
clone landing-tri   trimagnesio
clone landing-hair  hair
# Novo produto no futuro: clone landing-<slug> <slug-do-anuncio>

echo "Slugs prontos."
