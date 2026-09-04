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
| `out/folder-trimg-nova-saude_CMYK_sangria3mm.pdf` | **PDF fechado para a gráfica.** CMYK, 111 × 154 mm (105 × 148 + 3 mm de sangria), marcas de corte, fontes embutidas, imagens em DeviceCMYK. |
| `out/folder-trimg-nova-saude_RGB_tela.pdf` | Visualização em tela, RGB, no tamanho final cortado. |
| `out/frente.svg` · `out/verso.svg` | **Arquivos abertos**, editáveis em Illustrator / Inkscape / Figma. Fontes embutidas em base64. |
| `out/preview_*.png` | Prova de tela, 300 dpi. |
| `build.py` | Fonte do layout. Gera todos os arquivos acima. |
| `validate.py` | Preflight: página, CMYK puro (vetor **e** imagens), fontes embutidas, leitura do QR, dpi das imagens, cobertura de tinta. |
| `copy.md` | Copy campo a campo + notas de conformidade. |
| `brand/` | Assets da marca extraídos do manual oficial + logo em cada cor. |
| `fonts/` | Outfit e Jost, instanciadas peso a peso. |

```bash
python3 build.py && python3 validate.py
```

As medidas são parâmetros no topo do `build.py` (`TRIM_W` / `TRIM_H`). Mudou a
caixa, muda os dois números e roda de novo — o layout se recompõe e o build
**falha** se algum texto sair da margem de segurança.

---

## A imagem da frente

A faixa superior (80 mm) é a arte gerada na Higgsfield — **conceito 03**,
4800 × 3584 px, nano_banana_pro 4K.

**Para fechar a peça:** salve o arquivo como `brand/hero.png` e rode o build.
Ele entra sozinho, com recorte *cover*, degradê de contraste no topo e o logo
composto por cima. Sem esse arquivo o build usa o fundo gráfico da marca,
carimba **"PROVA"** na arte e avisa no terminal.

> ⚠️ Não consegui baixar a imagem para dentro da sessão: o proxy de saída da
> organização bloqueia o CDN da Higgsfield (`d8j0ntlcm91z4.cloudfront.net`,
> 403 por política). A orientação do ambiente é reportar, não contornar.

---

## Especificação de impressão

| Item | Valor |
| --- | --- |
| Formato final | **A6 — 105 × 148 mm**, chapado (sem dobra) |
| Frente e verso | Sim, 4/4 |
| Sangria | 3 mm em todos os lados (arquivo fechado: 111 × 154 mm) |
| Margem de segurança | 5 mm do corte — verificada automaticamente no build |
| Cor | CMYK. Nenhum elemento RGB, nem vetor nem imagem. Cobertura máxima: **243%** |
| Resolução | Texto e QR vetoriais. Faixa de imagem achatada a 400 dpi |
| Papel sugerido | Couché fosco 300 g/m² |
| Tiragem | ~100 unidades (digital sai mais barato que offset nessa quantidade) |

### Por que A6 chapado

1. **Sem dobra = nada para vincar ou amassar** em cima do pote, e nenhum texto
   essencial em área de dobra, porque não existe área de dobra.
2. **A6 é corte padrão de gráfica** — sem custo de faca especial.
3. **Cabe em qualquer caixa que já comporte um pote de 60 cápsulas.**

> ⚠️ **Pendente:** a dimensão interna da caixa não foi confirmada. **Meça antes
> de mandar imprimir.** Se for justa, o plano B é 100 × 100 mm.

---

## Identidade visual

Tirada do manual oficial **"Universo da marca — Botanika"** (Drive), não
inventada. A primeira versão desta peça usava verde e dourado; estava errada.

**Logo:** o wordmark original, com o "B" desenhado como folha. Extraído do
arquivo de marca do Drive e recolorido por máscara alpha para cada fundo.
Assinatura **"VOCÊ MAIS SAUDÁVEL"** no verso, como manda o manual.

### Paleta

O azul foi conferido por dois caminhos independentes: amostragem da página de
cores do manual **e** o token `camp_color` do tema da loja. Bateram exatos.

| Cor | CMYK | RGB | Uso |
| --- | --- | --- | --- |
| Azul Botanika | 88 / 82 / 0 / 8 | `#323C91` | fundo da frente, painel da oferta |
| Azul profundo | 95 / 88 / 30 / 30 | `#1B2145` | faixa de imagem, embalagem |
| Off-white | 5 / 3 / 6 / 0 | `#EDEDE9` | fundo do verso, texto sobre azul |
| Lima | 22 / 0 / 62 / 0 | `#CFE87A` | apoio |
| Lima vivo | 20 / 0 / 75 / 0 | `#D2F05E` | eyebrows, filete, barras dos dados |
| Texto | 0 / 0 / 0 / 100 | `#1E1E1E` | corpo — K puro, sem risco de registro |

### Tipografia

O manual define **Neulis** (primária) e **Futura** (secundária). As duas são
comerciais e não estão neste ambiente, então a arte usa substitutas de mesma
natureza geométrica:

- **Outfit** no papel da Neulis (títulos)
- **Jost** no papel da Futura (corpo, dados, rótulos)

Para a versão final, licencie as originais e troque só o bloco `FONT_FILES`
do `build.py` — o layout se recompõe e o build acusa se algo estourar.

### Hierarquia das duas marcas

A Nova Saúde **abre** a peça, a Botanika **assina** e **é dona do verso**.

A autoridade nesse momento é da Nova Saúde: a pessoa acabou de comprar o curso
e confia no Dr. William. É a Nova Saúde que explica *por que esta caixa
chegou*, então ela ocupa o topo da frente. A Botanika ainda não conquistou
nada com essa pessoa — ela assina no logo e recebe o verso inteiro para se
apresentar. Nenhuma das duas fica como sobra.

---

## Cupom

**Recomendação dada e aprovada: código exclusivo, não o código que já rodava.**

O papel não tem UTM, não tem clique, não tem pixel. **O cupom é o único rastreio
que esta peça tem.** Com um código compartilhado, não há como separar as
compras dos ~100 alunos de todo o resto.

Não é teoria: a ação de recompra Nova Saúde de agosto
([tarefa no ClickUp](https://app.clickup.com/t/86ak58qzj)) criou código próprio
exatamente por isso — *"sem um código exclusivo desta ação, não dá para separar
o que veio da recompra do que veio da venda normal"*.

### Achado que mudou a pergunta

O briefing partia de que o **ANOVA7 já roda**. **Não roda:** está **expirado
desde 29/08/2026** (97 usos). O que está ativo para Nova Saúde hoje é o
**ANOVA10** (10%, sem data de fim, 86 usos).

### O que foi criado na Shopify (04/09/2026)

| Código | O que faz | Título interno |
| --- | --- | --- |
| `ALUNONOVA15` | 15% OFF, sem expiração, 1 uso por cliente | `[NOVA SAÚDE] Folder da caixa Tri[Mg] — 15%` |
| `ALUNONOVAFRETE` | Frete grátis sem mínimo, 1 uso por cliente | `[NOVA SAÚDE] Folder da caixa Tri[Mg] — Frete Grátis (sem mínimo)` |

Os dois são **combináveis entre si** e valem para todos os produtos.

- **15%** porque é um degrau real acima do ANOVA10 que essa aluna já teria.
- **Frete grátis** porque o Tri[Mg] custa R$ 87,50 e o frete grátis da loja só
  vale acima de R$ 349 — numa compra de pote único o frete pesa mais que o
  desconto.
- **Sem expiração** porque papel fica na gaveta.
- **1 uso por cliente** limita o custo se vazar.

### 🔒 Regra que faz a medição valer

**Estes dois códigos não podem aparecer em mais lugar nenhum.** Se saírem do
papel, a leitura morre.

**Como ler:** resgates de `ALUNONOVA15` ÷ ~100 alunos = conversão do folder.

### Por que dois códigos e não um

Um desconto básico da Shopify faz percentual **ou** frete grátis, nunca os dois
sob o mesmo código — códigos são únicos por loja. A ação de agosto resolveu
igual (`NOVASAUDE15` + `NOVASAUDEFRETE`).

---

## QR code e UTM

**QR → `https://botanikabrasil.com.br/folder`** → `/products/tri-mg-complex`
com `utm_source=folder&utm_medium=impresso&utm_campaign=nova-saude-trimg&utm_content=qr-a6-verso`

**Endereço impresso → `botanikabrasil.com.br/tri`** → mesmo produto com
`utm_content=url-a6-verso`.

O `utm_content` diferente separa **quem escaneou** de **quem digitou**.

**Destino:** a página do produto, não a home. Quem escaneia já sabe o que quer.

- **Um salto só.** Montei o QR aplicando o cupom automaticamente
  (`/discount/ALUNONOVA15?redirect=...`), mas o encadeamento com UTM aninhada é
  frágil e **não consigo testá-lo daqui** (o proxy bloqueia o domínio da loja).
  Preferi um destino simples e verificável. Ela digita os códigos de qualquer
  forma — o segundo não teria como ser aplicado pelo link.
- **Módulo de 0,53 mm** (29 × 29 em 15,5 mm), acima do mínimo prático de
  0,4 mm. QR vetorial, quiet zone de 1,8 mm.
- O `validate.py` **decodifica o QR direto do PDF de gráfica** a cada build.

---

## Pendências

| # | Item | Quem resolve |
| --- | --- | --- |
| 1 | **Imagem do conceito 03** → salvar como `brand/hero.png`. O CDN da Higgsfield é bloqueado pelo proxy desta sessão. Se subir no Drive, eu leio e fecho a arte. | Pedro |
| 2 | **Dimensão interna da caixa.** A6 fechado como hipótese. | Pedro |
| 3 | **Fontes Neulis e Futura** — licenciar e trocar no `build.py`. Hoje: Outfit e Jost. | Pedro / design |
| 4 | **Logo da Nova Saúde** — não existe no Drive. Hoje a marca aparece só por nome. | Pedro |
| 5 | **Aprovação da Nova Saúde** para usar o nome e a menção ao Dr. William. | Pedro |
| 6 | **Testar os links no papel impresso** — não consigo abrir a loja daqui. Escanear o QR da prova e digitar `botanikabrasil.com.br/tri` no celular. | Pedro |
| 7 | **Prova física da gráfica** antes das 100 — cor do azul no papel e leitura do QR impresso. | Gráfica |

### Uma coisa que vale decidir

A ação de agosto excluía **creatina** do desconto de 15%. `ALUNONOVA15` foi
criado **valendo para todos os produtos**. Se a exclusão era por margem, vale
replicar — me avise e eu ajusto.
