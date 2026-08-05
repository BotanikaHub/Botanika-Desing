# COMANDO — Alterar uma LP existente

> Fluxo de manutenção das LPs Botanika.
> - **LPs feitas neste repo** (Ômega, Tri, Hair…) → alteradas direto aqui e publicadas na branch `lp`.
> - **LPs feitas por outro agente/ferramenta** → copie um dos comandos abaixo e cole no agente que criou aquela página.
> - **Mudança geral** (pixel, cupom, frete grátis, GA4…) → fazemos aqui nas nossas e replicamos o mesmo comando nas de fora.
> - **Mudança específica** → use o template genérico preenchido.

---

## ① Template genérico (mudança específica)

Preencha os `[colchetes]` e cole no agente da LP:

```
Você é o agente que mantém esta landing page. Faça APENAS a alteração abaixo, sem redesenhar o resto.

PÁGINA / PRODUTO: [ex.: Creatina / landing-creatina]
O QUE MUDAR: [descreva a mudança em 1–3 frases]
DETALHES / VALORES: [textos, links, cores, IDs — exatos]

REGRAS OBRIGATÓRIAS (não quebrar):
- HTML autocontido (CSS+JS inline, sem build). Manter a IDENTIDADE PRÓPRIA da página — não clonar outra LP.
- html{overflow-x:hidden} na raiz; tem que funcionar no Safari mobile via URL ao vivo.
- Só dados reais (preço, dose, claim). Sem fonte → deixe placeholder visível e liste como pendência.
- Compliance ANVISA: nada de "cura/trata/previne doença", "milagre", "resultado garantido".
- VALIDAR antes de commitar: `node --check` em cada <script> não-módulo + conferir balanço de tags (<div>,<section>,<svg>,<details> abrindo/fechando igual).
- Commit com mensagem clara. NÃO abrir Pull Request sem pedido.
- Publicar no fluxo/branch de publicação desta página e me devolver o link ao vivo atualizado.

ENTREGA: link atualizado + resumo do que mudou + pendências.
```

---

## ② Exemplo pronto — cronômetro "só hoje" + remover caixa DIAS

Cole nas LPs de fora que tenham cronômetro de escassez:

```
Ajuste o cronômetro de escassez desta LP para o padrão "só dura hoje":
1) O contador deve começar no momento em que a pessoa acessa e terminar à MEIA-NOITE (00h) do MESMO dia, no horário LOCAL do visitante — recalculando sozinho depois que vira o dia. Nada de data fixa.
2) Remova a caixa de "DIAS" (num contador de mesmo dia ela é sempre 00). Deixe HORAS · MIN · SEG.

Use exatamente esta lógica JS (adapte os IDs dos elementos aos que já existem na página):
  const nextMidnight=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()+1,0,0,0,0).getTime();};
  let END=nextMidnight();
  function tick(){ if(Date.now()>=END) END=nextMidnight();
    const s=Math.floor(Math.max(0,END-Date.now())/1000), p=n=>String(n).padStart(2,'0');
    horasEl.textContent=p(Math.floor(s%86400/3600));
    minEl.textContent=p(Math.floor(s%3600/60));
    segEl.textContent=p(s%60);
    setTimeout(tick,1000);
  } tick();

Valide (node --check + balanço de tags), commite com mensagem clara, publique e me mande o link.
```

---

## Status nas LPs deste repo
- **Ômega 3** e **Tri[Mg]** → cronômetro "só hoje" + sem caixa DIAS ✅
- **Hair** → sem cronômetro (escassez por cupom/urgência). Adicionar sob demanda.
