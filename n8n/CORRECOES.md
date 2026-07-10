# Agente SDR Botanika (n8n) — estado final

Arquivos prontos para **importar no n8n** (Workflows → Import from File):

- `SDR_Botanika_Atualizado.json` — agente principal (Lissia)
- `transferir_para_humano.json` — subworkflow de transferência para humano
- `system_prompt_botanika.json` — system prompt (referência; já vem embutido no nó Atendente)
- `rag_faq_botanika.csv` — FAQs de pós-venda/política para a planilha do RAG

IDs em uso: subworkflow `mXihoZVfxtXQsNyp` · grupo de avisos `120363410734753549@g.us` · instância Evolution `Botanika`.

## Ordem de importação
1. Importe/atualize primeiro o **subworkflow** `transferir_para_humano.json` (id `mXihoZVfxtXQsNyp`).
2. Importe o **workflow principal**; abra o nó tool `transferir_para_humano` e confirme que aponta para o subworkflow.
3. Reassocie **credenciais** se o n8n pedir (OpenAI, Supabase, Postgres, Redis, Evolution, Google).
4. Rode o **Schedule Trigger** manual 1x para popular o RAG; suba o `rag_faq_botanika.csv` na planilha (colunas Pergunta/Resposta).

## O que já está aplicado
1. **"Feliz em conhecer"** — removida a injeção no nó `Parser Chain` (a proibição no System Message já existia).
2. **Nome na 1ª mensagem** — regra no System Message, com exceção para pós-venda.
3. **Tool `transferir_para_humano`** — ligada ao Atendente (aciona em pedido de humano, frustração, IA sem resposta, e casos de pós-venda). Subworkflow com inputs resumo/dúvida/objeção, `instanceName=Botanika`, mensagem enriquecida ao grupo.
4. **RAG** — embedding de inserção corrigido (`text-embedding-3-small`, tabela `vector(1536)`); separador do splitter `\n`.
5. **Prompt calibrado** (com base em 24 conversas reais) — foco em desafogamento/triagem: seções `atendimento_pos_venda`, `postura_em_situacoes_dificeis`, `exemplos_few_shot`, espelhamento de tom.
6. **Roteador de intenção** — nó `Classificar Intencao` (gpt-4o-mini) rotula `novo_lead / duvida_produto / pos_venda / outro`; prompt usa `intencao_detectada` + seção `roteamento_por_intencao`. Fluxo: `Mensagem Completa → Classificar Intencao → Agente Rag → Atendente`.
7. **Política de cupom (Opção 1)** — seção `cupons_e_descontos`: só descontos automáticos (frete grátis R$349, 5%/2un, 10%/3un); nunca distribui códigos; cliente com código aplica no checkout, erro → escala.

## Pendência (troca simples quando chegar)
- **Rastreio**: hoje a Lissia escala pós-venda de rastreio para humano. Quando você definir como o cliente recebe o rastreio (e-mail/SMS/WhatsApp), ajusto a FAQ/regra para ela responder direto.

## Ação no Shopify (fora do n8n)
- Revisar Combinations do **ANOVA10** (desmarcar "Pedido") para fechar o stack ANOVA10 + ANOVA7 + Frete R$349.
- Revisar os cupons de 5% pedido marcados como combináveis com produto; avaliar excluir o `PEDROLAGETEST` (teste, 100% off).
