#!/usr/bin/env bash
# Cloudflare Pages — gera os slugs limpos das campanhas a partir das pastas landing-*.
# landing-<slug> continua sendo a fonte da verdade. Novo produto: adicione uma linha clone.
set -e
clone() { rm -rf "$2"; mkdir -p "$2"; cp -a "$1/." "$2/"; echo "  $1 -> /$2"; }
echo "Gerando slugs limpos das LPs:"
clone landing-omega                  omega3
clone landing-tri                    trimagnesio
clone landing-hair                   hair
clone landing-whey-balance-chocolate whey
clone landing-super-vitamina-c       vitaminac
clone landing-tetravit               tetravit
clone landing-sleep                  sleep
clone landing-creatina               creatina
clone landing-links                  links
echo "Slugs prontos."
