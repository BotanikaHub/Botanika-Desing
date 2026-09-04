# Folder impresso — Tri[Mg] Complex · boas-vindas aos alunos da Nova Saúde

Peça que vai **dentro da caixa** do Tri[Mg] enviado como presente aos ~100
primeiros alunos do curso Nova Saúde, do Dr. William.

O momento de leitura define a peça: a pessoa **não pediu e não pagou** — está
abrindo um presente. É o pico de boa vontade da marca com ela. O folder existe
para transformar essa boa vontade numa segunda compra, sem queimar o presente.

---

## Arquivos

| Arquivo | Para quê |
| --- | --- |
| `out/folder-trimg-nova-saude_CMYK_sangria3mm.pdf` | **PDF fechado para a gráfica.** CMYK, 111 × 154 mm (105 × 148 + 3 mm de sangria), marcas de corte, fontes embutidas. |
| `out/folder-trimg-nova-saude_RGB_tela.pdf` | Visualização em tela, RGB, no tamanho final cortado (105 × 148 mm). |
| `out/frente.svg` · `out/verso.svg` | **Arquivos abertos**, editáveis em Illustrator / Inkscape / Figma. Fontes embutidas em base64. |
| `out/preview_frente.png` · `out/preview_verso.png` | Prova de tela, 300 dpi. |
| `build.py` | Fonte do layout. Gera todos os arquivos acima. |
| `validate.py` | Preflight: mede a página, confere CMYK puro, fontes embutidas, leitura do QR e cobertura de tinta. |
| `copy.md` | Copy campo a campo + notas de conformidade. |
| `fonts/` | Playfair Display e Manrope, instanciadas peso a peso. |

```bash
python3 build.py && python3 validate.py
```

As medidas são parâmetros no topo do `build.py` (`TRIM_W` / `TRIM_H`). Mudou a
caixa, muda os dois números e roda de novo — o layout se recompõe e o build
falha se algum texto sair da margem de segurança.

---

## Especificação de impressão

| Item | Valor |
| --- | --- |
| Formato final | **A6 — 105 × 148 mm**, chapado (sem dobra) |
| Frente e verso | Sim, 4/4 |
| Sangria | 3 mm em todos os lados (arquivo fechado: 111 × 154 mm) |
| Margem de segurança | 5 mm do corte — verificada automaticamente no build |
| Cor | CMYK, sem RGB no arquivo. Cobertura máxima de tinta: **252%** |
| Resolução | Vetorial (sem imagem rasterizada) — equivale a ∞ dpi; QR também é vetor |
| Papel sugerido | Couché fosco 300 g/m² |
| Tiragem | ~100 unidades (digital sai mais barato que offset nessa quantidade) |

### Por que A6 chapado

1. **Sem dobra = nada para vincar ou amassar** em cima do pote. O briefing pede
   que o papel não amasse; a forma mais segura de garantir isso é não ter
   dobra nenhuma. Também elimina o risco de texto essencial cair em área de
   dobra, porque não existe área de dobra.
2. **A6 é corte padrão de gráfica** — sem custo de faca especial.
3. **Cabe em qualquer caixa que já comporte um pote de 60 cápsulas.**
4. Área suficiente para os quatro blocos do briefing sem apertar o tipo.

> ⚠️ **Pendente:** a dimensão interna da caixa não foi confirmada. O A6 foi
> fechado como hipótese declarada. **Meça a caixa antes de mandar imprimir.**
> Se for justa, o plano B é 100 × 100 mm — mesma lógica, mesmo papel, copy
> ligeiramente mais curta.

---

## Identidade visual: como as duas marcas convivem

**Hierarquia adotada:** a Nova Saúde **abre** a peça, a Botanika **assina** e
**é dona do verso**.

Por quê: a autoridade nesse momento é da Nova Saúde — a pessoa acabou de
comprar o curso e confia no Dr. William. É a Nova Saúde que explica *por que
esta caixa chegou*, então ela ocupa o topo da frente. A Botanika ainda não
conquistou nada com essa pessoa: ela assina embaixo (num corpo ligeiramente
maior, porque a peça é dela) e recebe o verso inteiro para se apresentar.

Nenhuma das duas fica como sobra: a Nova Saúde é dona do topo da frente, a
Botanika é dona da assinatura para baixo e de todo o verso.

### Paleta: da marca, não do produto

Puxei a **paleta da marca**, não a do Tri[Mg] (meia-noite índigo / menta /
violeta / champagne), por três razões:

1. Este é um folder de **boas-vindas de marca**, não peça de produto. A tarefa
   é apresentar a Botanika a quem não a conhece.
2. Se o papel vestir a identidade de um único produto, a Botanika passa a ler
   como "a empresa do magnésio" — e a próxima peça, de outro produto, vai
   parecer de outra marca.
3. O pote está ali, na mesma caixa, com as cores dele. Papel e produto
   disputando a mesma paleta a 10 cm um do outro achata os dois.

O índigo e a menta do Tri entram **só no bloco do produto**, no verso, como
ponte — não como base.

| Cor | CMYK | RGB | Uso |
| --- | --- | --- | --- |
| Papel | 2 / 3 / 8 / 0 | `#F7F2E8` | fundo, sangria total |
| Tinta | 78 / 52 / 66 / 56 | `#17322A` | títulos, painel da oferta |
| Texto | 0 / 0 / 0 / 100 | `#151515` | corpo — K puro, sem risco de registro |
| Dourado | 24 / 40 / 95 / 8 | `#B4842F` | eyebrows, fios |
| Índigo | 92 / 82 / 34 / 22 | `#2A3363` | só o bloco Tri[Mg] |
| Menta | 45 / 0 / 30 / 2 | `#86C7B0` | só os dados do Tri[Mg] |

**Tipografia:** Playfair Display + Manrope — o mesmo par do design system das
LPs, para o papel falar a mesma língua da loja.

**Assinatura gráfica:** três arcos finos, sangrando pelo canto. São três porque
o presente é um magnésio de três formas — carrega o conceito sem precisar
explicar. Aparecem em cantos opostos na frente e no verso, amarrando os lados.

---

## Cupom

**Recomendação dada e aprovada: código exclusivo, não o código que já rodava.**

O papel não tem UTM, não tem clique, não tem pixel. **O cupom é o único rastreio
que esta peça tem.** Com um código compartilhado, não há como separar as
compras dos ~100 alunos de todo o resto que usa o mesmo código.

Isso não é teoria: a própria ação de recompra Nova Saúde de agosto
([tarefa no ClickUp](https://app.clickup.com/t/86ak58qzj)) criou código próprio
exatamente por esse motivo — *"sem um código exclusivo desta ação, não dá para
separar o que veio da recompra do que veio da venda normal"*.

### Achado que mudou a pergunta

O briefing partia de que o **ANOVA7 já roda**. **Não roda:** está **expirado
desde 29/08/2026** (97 usos). O que está ativo para Nova Saúde hoje é o
**ANOVA10** (10%, sem data de fim, 86 usos). Ou seja, o folder não podia usar o
ANOVA7 de qualquer jeito.

### O que foi criado na Shopify (04/09/2026)

| Código | O que faz | Título interno |
| --- | --- | --- |
| `ALUNONOVA15` | 15% OFF, sem expiração, 1 uso por cliente | `[NOVA SAÚDE] Folder da caixa Tri[Mg] — 15%` |
| `ALUNONOVAFRETE` | Frete grátis sem mínimo, 1 uso por cliente | `[NOVA SAÚDE] Folder da caixa Tri[Mg] — Frete Grátis (sem mínimo)` |

Os dois são **combináveis entre si** e valem para todos os produtos.

- **15%** porque é um degrau real acima do ANOVA10 que essa aluna já teria pelo
  canal normal. A 10%, o folder não ofereceria nada de novo.
- **Frete grátis** porque o Tri[Mg] custa R$ 87,50 e o frete grátis da loja só
  vale acima de R$ 349 — numa compra de pote único o frete pesa mais que o
  desconto. Mesmo formato da ação de agosto (15% + frete sem mínimo).
- **Sem expiração** porque papel fica na gaveta. Um código morto daqui a 60
  dias vira experiência ruim justamente com quem a marca quer conquistar.
- **1 uso por cliente** limita o custo se o código vazar.

### 🔒 Regra que faz a medição valer

**Estes dois códigos não podem aparecer em mais lugar nenhum** — nem e-mail,
nem WhatsApp, nem arte, nem live. Se saírem do papel, a leitura morre e o
motivo de terem sido criados se perde.

**Como ler o resultado:** resgates de `ALUNONOVA15` ÷ ~100 alunos = taxa de
conversão do folder. É a única coisa que esta peça consegue medir, e mede bem.

### Por que dois códigos e não um

Um desconto básico da Shopify faz percentual **ou** frete grátis, nunca os dois
sob o mesmo código — códigos são únicos por loja. A ação de agosto resolveu
igual (`NOVASAUDE15` + `NOVASAUDEFRETE`), então a peça segue a convenção que a
casa já usa. No papel eles aparecem empilhados, com prefixo comum, cada um
colado no que faz.

---

## QR code e UTM

**QR → `https://botanikabrasil.com.br/folder`**
redireciona para
`/products/tri-mg-complex?utm_source=folder&utm_medium=impresso&utm_campaign=nova-saude-trimg&utm_content=qr-a6-verso`

**Endereço impresso → `botanikabrasil.com.br/tri`**
redireciona para o mesmo produto com `utm_content=url-a6-verso`.

Os dois redirects foram criados na Shopify. O `utm_content` diferente separa
**quem escaneou** de **quem digitou** — informação de graça sobre como uma peça
impressa é usada, útil para a próxima.

**Destino:** a página do produto, não a home. Quem escaneia já sabe o que quer;
jogar na home adiciona um passo e derruba a conversão.

Decisões técnicas:
- **Um salto só.** Cheguei a montar o QR aplicando o cupom automaticamente
  (`/discount/ALUNONOVA15?redirect=...`), mas o encadeamento com UTM aninhada
  é frágil e **não consigo testá-lo deste ambiente** (o proxy bloqueia o
  domínio da loja). Preferi um destino simples e verificável a um esperto e
  não testado. Ela digita os códigos de qualquer forma — o segundo não teria
  como ser aplicado pelo link.
- **Módulo de 0,59 mm** (29 × 29 módulos em 17 mm), acima do mínimo prático de
  0,4 mm para impressão. QR desenhado em vetor, com quiet zone de 2 mm.
- O `validate.py` **decodifica o QR direto do PDF de gráfica** a cada build.

---

## Pendências

| # | Item | Quem resolve |
| --- | --- | --- |
| 1 | **Dimensão interna da caixa.** A6 fechado como hipótese. Medir antes de imprimir. | Pedro |
| 2 | **Logos.** Não tenho os vetores. Nova Saúde e Botanika estão como wordmark tipográfico. O logo da Botanika existe na Shopify (`logo-c.png`, 990 × 187) mas o proxy bloqueia o CDN; da Nova Saúde não tenho arquivo nenhum. Os slots estão marcados no `build.py` com a caixa útil de cada um. | Pedro / design |
| 3 | **Aprovação da Nova Saúde** para usar o nome e a menção ao Dr. William na peça. | Pedro |
| 4 | **Testar os links no papel impresso.** Não consegui abrir `botanikabrasil.com.br` daqui. Antes da tiragem: escanear o QR da prova impressa e digitar `botanikabrasil.com.br/tri` no celular. | Pedro |
| 5 | **Prova física da gráfica** antes de fechar as 100 — confirmar cor do dourado no papel escolhido e leitura do QR impresso. | Gráfica |

### Uma coisa que vale decidir

A ação de recompra de agosto excluía **creatina** do desconto de 15%.
`ALUNONOVA15` foi criado **valendo para todos os produtos**. Se a exclusão era
por margem, vale replicar aqui — me avise e eu ajusto o cupom.
