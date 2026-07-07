# Correções — Agente SDR Botanika (n8n)

Arquivos corrigidos nesta pasta, prontos para **importar no n8n** (Workflows → Import from File):

- `SDR_Botanika_Atualizado.json` — agente principal
- `transferir_para_humano.json` — subworkflow de transferência para humano

> Importante: ao importar, o n8n pode pedir para **reassociar as credenciais** (OpenAI, Supabase, Postgres, Redis, Evolution API, Google). Confira todas antes de ativar.

---

## 1. Frase "Feliz em conhecer" aleatória — CAUSA REAL ENCONTRADA

A proibição já existia no System Message do nó **Atendente** (bloco `<frases_completamente_proibidas>`). O problema **não estava no prompt** — estava no nó **`Parser Chain`** (a etapa que formata/pica a mensagem antes de enviar).

Esse nó tinha esta instrução explícita:

```
"troque essas palavra: Prazer por: feliz em conhecer"
```

Ou seja: **toda vez** que a Lissia escrevia "prazer" em qualquer mensagem, o pós-processador **trocava por "feliz em conhecer"** — daí a aparição "aleatória", mesmo com o prompt proibindo a frase.

**Correção:** removida essa linha do `Parser Chain`. Não precisa mexer no System Message para isso (a proibição já está lá, na aba Parameters, correta).

## 2. Perguntar o nome na primeira mensagem

O `<fluxo>` passo 1 já pedia isso, mas o modelo às vezes pulava direto para a dúvida do cliente. Foi adicionada uma **regra dura** em `<regras_cruciais>` do nó **Atendente** (aba Parameters → System Message):

> Quando a conversa está começando e ainda não sabe o nome, apresentar-se e perguntar **APENAS** o nome — sem responder dúvidas, citar produtos ou preços antes disso.

## 3. Subworkflow `transferir_para_humano` como tool do agente

Implementado de ponta a ponta:

**No agente principal:**
- Novo nó `transferir_para_humano` (tipo `toolWorkflow`) conectado como **ai_tool** ao nó **Atendente**.
- O agente aciona a tool quando o cliente **pede humano**, está **frustrado**, ou quando a **IA não sabe responder** (regra também adicionada no System Message).
- A tool envia automaticamente para o subworkflow:
  - `number.user` = telefone do cliente (`$('Dados').Telefone`)
  - `name.user` = nome do WhatsApp (`$('Dados').NomeWpp`)
  - `id_grupo` = `120363418914433116@g.us` (o mesmo grupo já usado no nó `Evolution API2`)
  - `resumo`, `duvida`, `objecao` = preenchidos pela própria Lissia via `$fromAI`

**No subworkflow `transferir_para_humano`:**
- Adicionados os inputs `resumo`, `duvida`, `objecao`.
- `instanceName` corrigido de `"insira nome da instancia"` → **`Botanika`**.
- Credencial do Evolution alinhada com a do workflow principal (`Evolution account` / id `NL18rcjxKfjrT4XY`).
- Mensagem do grupo agora inclui **resumo da conversa, principal dúvida e objeção** do cliente.

> Verifique no n8n: após importar, abra o nó `transferir_para_humano` (tool) no agente e confirme que o campo *Workflow* aponta para o subworkflow certo (id `CwkkV7UNakeXzefd`). Confirme também que a credencial do Evolution no subworkflow é a que está funcionando.

## 4. Sincronizar a base RAG no Supabase Vector Store — BUG QUE TRAVA A SINCRONIZAÇÃO

Havia um **conflito de dimensões de embedding**:

| Etapa | Nó | Modelo | Dimensões |
|-------|----|--------|-----------|
| Inserção (Schedule 5h) | `Embeddings OpenAI2` | `text-embedding-3-large` | **3072** |
| Busca (tool `buscar_documentos`) | `Embeddings OpenAI` | `text-embedding-3-small` | **1536** |
| Tabela `documents` | — | `vector(1536)` | **1536** |

Inserir vetores de **3072** numa coluna `vector(1536)` **falha no Postgres** — por isso o RAG não sincronizava. Além disso, mesmo se passasse, a busca (1536) contra vetores gravados com outro modelo daria resultado ruim.

**Correção:** `Embeddings OpenAI2` alterado para **`text-embedding-3-small`**, igual à busca e compatível com a tabela `vector(1536)`.

Correção menor no mesmo fluxo: o `Character Text Splitter1` tinha separador `/n` (barra + n literal) → corrigido para `\n` (quebra de linha).

**Depois de importar, rodar o `Schedule Trigger` manualmente** (Execute node) para popular a tabela `documents`. Se já houver lixo de tentativas antigas, o próprio fluxo começa deletando as linhas (`Deleta linhas antigas do documento1`).

---

## Observações que NÃO foram alteradas (para conferência, sem certeza total)

- **Fonte do RAG:** o `Schedule Trigger` lê arquivos de uma **pasta do Google Drive** (id `1na1bcLhwjdVY0hl-rM6OcFk4d6NbCfm-`), não diretamente da planilha `RAG_Botanika_SDR`. A planilha é usada pelo fluxo de treinamento (`TreinoIA1212:`). Se a intenção é que edições na planilha entrem no RAG, a planilha precisa estar nessa pasta do Drive (ou trocar a fonte). Confirme como sua base está organizada.
- **Branch "Avisar Lead grupo" (código `338201`):** existe um caminho no `Switch2` que só dispara se a saída do agente contiver `338201`, mas nada no prompt gera esse código — esse ramo está inativo. Como a transferência para humano agora é feita pela tool, deixei esse ramo como está para não mexer no que não é necessário. Pode ser removido depois, se quiser.
