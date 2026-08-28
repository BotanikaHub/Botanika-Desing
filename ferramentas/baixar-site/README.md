# Baixar um site inteiro para servir de referência

Ferramenta para clonar **tudo** de um site (HTML, CSS, JS, imagens, fontes, respostas
de API, screenshots) numa pasta que o agente consegue ler depois — pra você dizer
"quero uma coisa assim" e ele entender exatamente do que você está falando.

## Por que não basta "Salvar página como…"

O "salvar como" do navegador quebra em site moderno: perde o que só aparece depois do
JavaScript rodar, perde lazy-load, perde fonte, embaralha caminho de arquivo.
Aqui a captura é feita em **dois passes**:

| passe | ferramenta | o que pega |
| --- | --- | --- |
| 1 | `wget` | o HTML **cru** que o servidor entrega + todos os arquivos linkados nele |
| 2 | Chromium (Playwright) | roda o site de verdade, rola a página até o fim, e salva **toda** requisição que o navegador fez — inclusive o que só existe depois do JS |

## Uso

```bash
./ferramentas/baixar-site/baixar.sh https://o-site-que-quero.com
```

Opções:

```bash
--links 8      # também captura até 8 páginas internas encontradas na home
--rapido       # só o wget (mais rápido, menos completo)
--render       # só o navegador (pula o wget)
--sem-mobile   # não tira os screenshots mobile
--espera 5000  # espera 5s a mais por página (sites lentos / muita animação)
```

## O que sai

```
capturas/<host>/
├── RELATORIO.md      ← COMECE POR AQUI
├── dom/              HTML final renderizado de cada página (depois do JS)
├── arquivos/         todo recurso baixado, organizado por host + caminho da URL
├── bruto/            espelho do wget (HTML como o servidor entrega)
├── design/           JSON por página: variáveis CSS, paleta, tipografia, raios, sombras, seções
├── telas/            print da página inteira, desktop e mobile
└── rede.json         toda requisição: url, status, tipo, tamanho, arquivo salvo
```

O `RELATORIO.md` já vem com a paleta, a escala tipográfica, as variáveis de `:root`,
o outline de títulos e o peso por tipo de recurso — é o resumo que o agente lê primeiro.

## Pré-requisitos

Na sua máquina (Mac):

```bash
brew install wget node
npm install -g playwright
npx playwright install chromium
```

Sem `wget`? Use `--render`, que só precisa do Node + Chromium.

## Como usar isso comigo (agente) depois

A pasta `capturas/` **não é versionada por padrão**. Para eu enxergar a captura numa
sessão nova, ela precisa estar commitada no repo:

```bash
# opcional: joga fora mídia pesada antes de commitar
find capturas/<host> -type f -size +2M -delete

git add -f capturas/<host>
git commit -m "ref: captura de <host> para modelagem"
git push -u origin <sua-branch>
```

Aí, no chat novo:

> Leia `capturas/<host>/RELATORIO.md` e `capturas/<host>/dom/home.html`.
> Quero a LP do **[produto]** com essa mesma estrutura de seções e nível de acabamento,
> mas com a identidade própria do produto (paleta, fonte e assinatura diferentes).

> **Sem tempo de commitar?** Um único arquivo já ajuda muito: mande o
> `dom/home.html` + o `RELATORIO.md` direto no chat.

## Limite deste ambiente remoto

As sessões do Claude Code na web rodam atrás de um proxy com política de saída: hosts
externos que não estão liberados devolvem **403** (`ERR_TUNNEL_CONNECTION_FAILED` no
Chromium, `Proxy tunneling failed: Forbidden` no wget). Ou seja: **rode o script na sua
máquina**, ou libere o host na configuração de rede do ambiente
(https://code.claude.com/docs/en/claude-code-on-the-web) e aí eu rodo aqui.

## Alternativas sem terminal

- **DevTools → aba Network → botão de download** → salva um `.har` com todas as requisições.
- Extensão **SingleFile** (Chrome/Firefox) → salva a página renderizada em um `.html` único.
- Ambos servem: é só jogar o arquivo numa pasta do repo e me apontar.

## Bom senso

Use para **referência e estudo** de páginas públicas (ou de sites seus). Não republique
conteúdo, imagem, texto ou marca de terceiros — a ideia é entender a técnica e a
estrutura, e construir a identidade própria da Botanika em cima disso.
