# Referência: useblessy.com.br (Blessy Greens & Superfoods)

Captura da home em **29/08/2026**, viewport mobile (iPhone), via saveweb2zip.
Concorrente direto: suco verde em pó, público feminino, Brasil.

> Uso: **técnica e estrutura**. Paleta, tipografia, copy e identidade da Blessy
> ficam com a Blessy — a LP da Botanika precisa da identidade própria dela.

## Arquivos aqui

| arquivo | o que é |
| --- | --- |
| `pagina-mobile.html` | DOM renderizado da home (320 KB) |
| `copy.md` | todo o texto da página, na ordem |
| `css/instant-*.css` | CSS gerado pelo page builder — header, corpo, footer |
| `css/tema-*.css` | CSS do tema Shopify por baixo |
| `css/app-kaching-cart.css` | carrinho lateral (app Kaching) |

## Stack

Shopify + **Instant** (page builder visual, `client.instant.so`). A home inteira são
só **3 seções** de tema: `instant-header`, `instant-pagina`, `instant-footer`.
Ou seja: quase tudo que se vê é markup gerado pelo builder, não é o tema.

Apps identificados: Kaching (carrinho lateral), Klaviyo (e-mail), Microsoft Clarity
(gravação de sessão), Mixpanel, pixels de rastreio próprios.

**O que isso significa pra gente:** o resultado visual dela é reproduzível em HTML
puro na nossa LP autocontida — não tem nada ali que dependa do builder. Na prática
a gente escreve à mão o que o Instant gera automático, e sai mais leve.

## Sistema de design observado

### Tipografia
- **Bricolage Grotesque** — fonte dominante (116 usos). Grotesca com largura variável,
  dá o ar "moderno saudável" sem ser genérica.
- **Gazpacho** — serifada, única carregada via `@font-face` própria: usada em destaque.
- Inter como apoio; Recoleta Alt / Plus Jakarta Sans / Sora aparecem residualmente.
- Escala real medida (mobile): `10 · 11 · 12 · 13 · 14 · 15 · 16 · 17 · 18 · 20 · 21 · 22 · 25 · 29 · 30 · 35px`.
  Nada gigante — o maior título é 35px. Hierarquia vem de **peso e cor**, não de tamanho.

### Cor
Verde profundo como âncora, fundo quase branco quente, acentos pontuais:

| cor | uso |
| --- | --- |
| `#3e6858` | verde principal (89 ocorrências) — o mais usado depois de branco/preto |
| `#1d6b4d` | verde mais saturado, ações |
| `#243c1b` | verde escuro, texto sobre claro |
| `#739e8d` | verde dessaturado, apoio |
| `#fdfbf7` | off-white quente — o fundo real, nunca `#fff` puro |
| `#fedb71` | amarelo, selo/destaque |
| `#ad6ce7` `#e1aeff` `#d297f5` | lilás — badges de desconto e combos |

Fundo branco puro (`#fff`) aparece 107x, mas em cartão sobre o off-white.

### Forma
- Raios: `30px` e `20px` dominam; `50px` e `99px` para pílulas (botões, badges).
- **Zero gradiente** na página inteira. Superfície é cor chapada.
- **65 usos de `backdrop-filter`** — barras e overlays com desfoque, é a assinatura visual.
- `position: fixed` 11x, `sticky` nenhum: barra de topo e CTA fixos, feitos na mão.

### Movimento
Contido, quase nada:
- 3 classes de reveal: `fade`, `transform`, `transform-fade` — entrada de seção.
- Transições de `.2s`–`.24s ease-in-out`, só em cor/opacidade.
- Um ticker horizontal (faixa que rola sozinha) no topo.

Nenhum shader, nenhum canvas, nenhuma animação de scroll pesada.

## Estrutura da página (ordem dos argumentos)

Ver `copy.md` para o texto integral. O esqueleto:

1. **Barra de urgência fixa** — contador "a promoção encerra em", "🚨 só hoje", "🚚 frete grátis"
2. **Nav** — Ingredientes · Rastreio · Acessórios · Fale com a gente · About · **comprar blessy**
3. **Seletor de sabor** direto no topo — abacaxi c/ hortelã, limão, manga, melancia, maracujá,
   com preço (`R$189,90`) e parcelamento (`12x de 18,90`) visíveis antes de qualquer argumento
4. **Faixa de selos** — GMO Free · sem glúten · sem açúcar · vegana · sem corante
5. **Combos** — "Compre 2 e leve 3", "Compre 3 e leve 5", com **economia em reais**
   ("Economize até R$199,38 comprando 3 potes") e badges de % em lilás
6. **Prova científica** — "+30.000 publicações científicas comprovam a eficácia"
7. **Quatro benefícios** — intestino · disposição · cabelo/unha/pele · corpo e mente.
   Cada um redigido como alegação regulada ("as fibras prebióticas *contribuem para*…"),
   nunca como promessa de cura
8. **Tabela nutricional** — "o que tem em 1 scoop", valores reais
9. **Cinco famílias de ingrediente** — antioxidantes · vitaminas & minerais · fibras
   prebióticas · greens & superfoods · adaptógenos
10. **Depoimentos** — "com a palavra, a opinião sincera de quem toma blessy 💃🏻"
11. **História da fundadora** — Renata Lima, dor pessoal → produto
12. **Lista de ingredientes** completa (letra miúda, conformidade)
13. **Footer** — dúvidas, parcerias, revendedor, políticas

## O que vale trazer como técnica

1. **Preço e sabor no primeiro terço.** Ela não faz o usuário rolar para descobrir
   quanto custa. Preço, parcelamento e seletor de sabor aparecem antes do primeiro
   argumento de benefício.
2. **Economia em reais, não só em %.** "Economize R$142,71 comprando 3 potes" pesa
   mais que "35% OFF" — e ela usa os dois juntos.
3. **Alegação no formato regulado.** Todo benefício é "X *contribui para* Y", com o
   nutriente nomeado. Blinda de ANVISA e soa mais sério.
4. **Hierarquia por peso, não por tamanho.** Nada acima de 35px. Cabe mais conteúdo
   na dobra e o mobile não quebra.
5. **Off-white quente como fundo, branco puro só em cartão.** Dá profundidade sem sombra.
6. **`backdrop-filter` em vez de sombra** para separar camadas fixas do conteúdo.
7. **Emoji como ícone** nos nomes de sabor (🍍 🍋 🍉 🟡) — economiza asset e lê rápido.

## O que NÃO copiar

- A paleta verde/lilás e as fontes Bricolage + Gazpacho são a cara da Blessy.
- A copy inteira — inclusive as construções "que o corpo da mulher ama", "combos da leveza".
- A história da fundadora, obviamente.
- O contador regressivo de urgência: cada produto decide se quer esse tom.
