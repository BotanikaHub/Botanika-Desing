# Ferramentas internas

Utilitários de operação que **não são landing page**. Cada um é uma pasta com `index.html`
autocontido (CSS + JS inline, sem build), no mesmo padrão das LPs: abre direto pelo link,
funciona no Safari mobile, não depende de servidor.

| Pasta | O que faz |
|---|---|
| `extrator-numeros-whatsapp/` | Extrai, valida e padroniza telefones a partir de conversas exportadas do WhatsApp, agendas (CSV/vCard) e listas soltas. |

---

## extrator-numeros-whatsapp

**Link:**
`https://raw.githack.com/BotanikaHub/Botanika-Desing/<branch>/ferramentas/extrator-numeros-whatsapp/index.html`

Cola-se o texto (ou solta-se o arquivo) e a ferramenta devolve a lista limpa:

- acha os telefones no meio da conversa e ignora data, hora, valor em R$ e número de pedido;
- valida o DDD contra os 67 que existem no Brasil, separa **celular** de **fixo** e corrige o
  nono dígito nos números antigos;
- remove repetidos e mostra quantas vezes cada número apareceu;
- modo **"só quem enviou mensagem"**, que lê o formato de conversa exportada e ignora número
  citado dentro do corpo da mensagem;
- saída em 5 formatos: lista formatada, `+55…`, só dígitos, colunas para colar no Google Sheets
  e CSV do Google Contatos.

Aceita `.txt` (exportação do WhatsApp), `.csv` e `.vcf`/`.vcard` (agenda do Google ou do iCloud).

### Os dois scripts de WhatsApp Web

A página traz, no rodapé, dois scripts para colar no console do WhatsApp Web quando o objetivo
é levantar a conta inteira em vez de exportar conversa por conversa:

1. **Varredura rápida** — rola a lista de conversas e separa quem já aparece com número de quem
   está salvo na agenda pelo nome. Serve para medir o tamanho do trabalho antes de começar.
2. **Varredura completa** — abre uma conversa por vez e lê o identificador interno que o WhatsApp
   guarda em cada mensagem, de onde sai o número mesmo quando o contato está salvo pelo nome.
   Cerca de 1 segundo por conversa. Rodar primeiro com `LIMITE = 20`.

Os dois dependem da estrutura atual do WhatsApp Web e podem precisar de ajuste se o layout mudar.

### Privacidade

Todo o processamento acontece no navegador de quem abriu a página — nenhum contato é enviado
para lugar nenhum. Ainda assim, base de terceiro (clínica, parceiro, cliente) só entra aqui com
autorização por escrito de quem é dono dela, e a lista final vai para o Drive da operação com
origem e data anotadas, nunca para pasta pessoal.
