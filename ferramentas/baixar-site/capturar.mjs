#!/usr/bin/env node
/**
 * Captura completa de um site com navegador real (Chromium/Playwright).
 *
 * Diferente do wget, isto executa o JavaScript da página: pega o que só existe
 * depois do render (Framer, Webflow, React, Shopify com apps, lazy-load, fontes,
 * chamadas de API) e salva TODOS os recursos que o navegador baixou.
 *
 * Uso:
 *   node capturar.mjs <url> [outra-url ...] [opções]
 *
 * Opções:
 *   --saida <dir>    pasta de destino (padrão: capturas/<host>)
 *   --links <n>      descobre e captura até n páginas internas a partir da 1ª (padrão: 0)
 *   --espera <ms>    espera extra após carregar cada página (padrão: 2500)
 *   --sem-mobile     não captura a versão mobile
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

// playwright pode estar instalado local ou global — resolve os dois casos
const require_ = createRequire(import.meta.url);
function carregaPlaywright() {
  try { return require_('playwright'); } catch {}
  for (const cmd of ['npm root -g', 'npm root']) {
    try {
      const raiz = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      return require_(path.join(raiz, 'playwright'));
    } catch {}
  }
  console.error('playwright não encontrado. Instale com:  npm i -g playwright');
  process.exit(1);
}
const { chromium, devices } = carregaPlaywright();

// ---------------------------------------------------------------- argumentos

const argv = process.argv.slice(2);
const urls = [];
let saidaBase = null;
let maxLinks = 0;
let esperaExtra = 2500;
let comMobile = true;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--saida') saidaBase = argv[++i];
  else if (a === '--links') maxLinks = parseInt(argv[++i], 10) || 0;
  else if (a === '--espera') esperaExtra = parseInt(argv[++i], 10) || 0;
  else if (a === '--sem-mobile') comMobile = false;
  else if (a.startsWith('--')) { console.error('opção desconhecida:', a); process.exit(1); }
  else urls.push(a);
}

if (!urls.length) {
  console.error('uso: node capturar.mjs <url> [url ...] [--saida dir] [--links n]');
  process.exit(1);
}

const primeira = new URL(urls[0]);
const saida = path.resolve(saidaBase || path.join('capturas', primeira.host.replace(/[^a-z0-9.-]/gi, '_')));

// ------------------------------------------------------------------- helpers

const EXTENSAO_POR_TIPO = {
  'text/html': '.html',
  'text/css': '.css',
  'text/javascript': '.js',
  'application/javascript': '.js',
  'application/x-javascript': '.js',
  'application/json': '.json',
  'application/ld+json': '.json',
  'image/svg+xml': '.svg',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
  'image/x-icon': '.ico',
  'font/woff2': '.woff2',
  'font/woff': '.woff',
  'font/ttf': '.ttf',
  'font/otf': '.otf',
  'application/font-woff2': '.woff2',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'text/plain': '.txt',
  'application/xml': '.xml',
  'text/xml': '.xml',
};

const limpa = (s) => (s || '').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || '_';

function caminhoDoRecurso(urlStr, contentType) {
  const u = new URL(urlStr);
  let partes = decodeURIComponent(u.pathname).split('/').filter(Boolean).map(limpa);
  if (!partes.length) partes = ['index.html'];
  let arquivo = path.join(saida, 'arquivos', limpa(u.host), ...partes);

  if (u.search) {
    const hash = crypto.createHash('sha1').update(u.search).digest('hex').slice(0, 8);
    const ext = path.extname(arquivo);
    arquivo = arquivo.slice(0, arquivo.length - ext.length) + '~' + hash + ext;
  }
  if (!path.extname(arquivo)) arquivo += EXTENSAO_POR_TIPO[contentType] || '.bin';
  return arquivo;
}

function escreve(arquivo, conteudo) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, conteudo);
}

const nomeDaPagina = (urlStr) => {
  const u = new URL(urlStr);
  const base = decodeURIComponent(u.pathname).replace(/^\/|\/$/g, '') || 'home';
  return limpa(base.replace(/\//g, '__')) + (u.search ? '~' + crypto.createHash('sha1').update(u.search).digest('hex').slice(0, 6) : '');
};

// -------------------------------------------------------- coleta em memória

const rede = [];          // toda requisição vista
const salvos = new Set(); // caminhos já gravados (dedupe entre desktop/mobile)
const paginas = [];       // resumo por página

function ligaCaptura(context, pendentes) {
  context.on('response', (res) => {
    pendentes.push((async () => {
      const url = res.url();
      if (!/^https?:/i.test(url)) return;
      const tipo = (res.headers()['content-type'] || '').split(';')[0].trim().toLowerCase();
      let corpo = null;
      try { corpo = await res.body(); } catch { /* redirects, 204, streams abortados */ }

      const registro = {
        url,
        status: res.status(),
        tipo,
        recurso: res.request().resourceType(),
        bytes: corpo ? corpo.length : 0,
        arquivo: null,
      };

      if (corpo && corpo.length) {
        const destino = caminhoDoRecurso(url, tipo);
        if (!salvos.has(destino)) {
          try { escreve(destino, corpo); salvos.add(destino); } catch (e) { registro.erro = String(e.message || e); }
        }
        registro.arquivo = path.relative(saida, destino);
      }
      rede.push(registro);
    })().catch(() => {}));
  });
}

// ----------------------------------------------------- rotinas dentro da página

async function rolarTudo(page) {
  await page.evaluate(async () => {
    await new Promise((pronto) => {
      let percorrido = 0;
      const passo = () => {
        const salto = Math.max(200, window.innerHeight * 0.8);
        window.scrollBy(0, salto);
        percorrido += salto;
        const fim = document.body ? document.body.scrollHeight : 0;
        if (percorrido < fim + window.innerHeight && percorrido < 80000) setTimeout(passo, 220);
        else { window.scrollTo(0, 0); setTimeout(pronto, 600); }
      };
      passo();
    });
  }).catch(() => {});
}

async function lerDesign(page) {
  return page.evaluate(() => {
    const conta = (lista) => Object.entries(lista.reduce((acc, v) => (acc[v] = (acc[v] || 0) + 1, acc), {}))
      .sort((a, b) => b[1] - a[1]).slice(0, 25).map(([valor, vezes]) => ({ valor, vezes }));

    const variaveis = {};
    for (const folha of Array.from(document.styleSheets)) {
      try {
        for (const regra of Array.from(folha.cssRules || [])) {
          if (regra.style && regra.selectorText && /(^|,)\s*(:root|html)\b/.test(regra.selectorText)) {
            for (const nome of Array.from(regra.style)) {
              if (nome.startsWith('--')) variaveis[nome] = regra.style.getPropertyValue(nome).trim();
            }
          }
        }
      } catch { /* folha de outro domínio */ }
    }

    const els = Array.from(document.querySelectorAll('body *')).slice(0, 5000);
    const fontes = [], cores = [], fundos = [], tamanhos = [], raios = [], sombras = [];
    for (const el of els) {
      const c = getComputedStyle(el);
      if (!el.textContent || !el.textContent.trim()) { /* ainda vale cor de fundo */ }
      else { fontes.push(c.fontFamily); cores.push(c.color); tamanhos.push(c.fontSize); }
      if (c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)') fundos.push(c.backgroundColor);
      if (c.borderRadius && c.borderRadius !== '0px') raios.push(c.borderRadius);
      if (c.boxShadow && c.boxShadow !== 'none') sombras.push(c.boxShadow);
    }

    const titulos = Array.from(document.querySelectorAll('h1,h2,h3'))
      .slice(0, 80)
      .map((h) => ({ tag: h.tagName.toLowerCase(), texto: (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160) }));

    const secoes = Array.from(document.querySelectorAll('body > *, main > *, [data-section-type], section'))
      .slice(0, 120)
      .map((s) => ({
        tag: s.tagName.toLowerCase(),
        id: s.id || null,
        classe: (s.className && typeof s.className === 'string' ? s.className : '').slice(0, 120) || null,
        altura: Math.round(s.getBoundingClientRect().height),
      }))
      .filter((s) => s.altura > 40);

    return {
      titulo: document.title,
      descricao: document.querySelector('meta[name="description"]')?.content || null,
      og: Array.from(document.querySelectorAll('meta[property^="og:"]')).map((m) => ({ p: m.getAttribute('property'), c: m.content })),
      fontesCarregadas: Array.from(document.fonts || []).map((f) => `${f.family} ${f.weight} ${f.style}`).filter((v, i, a) => a.indexOf(v) === i).slice(0, 40),
      variaveisCss: variaveis,
      fontes: conta(fontes),
      cores: conta(cores),
      fundos: conta(fundos),
      tamanhos: conta(tamanhos),
      raios: conta(raios),
      sombras: conta(sombras).slice(0, 10),
      titulos,
      secoes,
      links: Array.from(document.querySelectorAll('a[href]')).map((a) => a.href).filter((h) => /^https?:/.test(h)),
      scriptsInline: Array.from(document.querySelectorAll('script:not([src])')).length,
      estilosInline: Array.from(document.querySelectorAll('style')).length,
    };
  }).catch((e) => ({ erro: String(e.message || e) }));
}

// -------------------------------------------------------------------- captura

async function capturarPagina(page, url, apelido) {
  process.stdout.write(`  → ${url}\n`);
  const resposta = await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch((e) => {
    console.error(`    ! falhou: ${e.message}`);
    return null;
  });
  if (!resposta) return null;

  await page.waitForTimeout(esperaExtra);
  await rolarTudo(page);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

  const dom = await page.content();
  escreve(path.join(saida, 'dom', `${apelido}.html`), dom);

  const design = await lerDesign(page);
  escreve(path.join(saida, 'design', `${apelido}.json`), JSON.stringify(design, null, 2));

  await page.screenshot({ path: path.join(saida, 'telas', `${apelido}-desktop.png`), fullPage: true }).catch(() => {});

  paginas.push({ url, apelido, titulo: design.titulo, design });
  return design;
}

// ----------------------------------------------------------------------- main

(async () => {
  fs.mkdirSync(saida, { recursive: true });
  console.log(`\nCapturando para: ${saida}\n`);

  // Não forçamos proxy: o Chromium já lê http_proxy/https_proxy/no_proxy do
  // ambiente. Passar --proxy-server explícito quebra o bypass de localhost.
  const navegador = await chromium.launch({ headless: true });

  const pendentes = [];

  // ---- desktop
  const ctxDesktop = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  });
  ligaCaptura(ctxDesktop, pendentes);
  const pagina = await ctxDesktop.newPage();

  const fila = [...urls];
  const feitas = new Set();
  let primeiroDesign = null;

  while (fila.length) {
    const url = fila.shift();
    const chave = url.split('#')[0];
    if (feitas.has(chave)) continue;
    feitas.add(chave);

    const design = await capturarPagina(pagina, url, nomeDaPagina(url));
    if (!primeiroDesign && design) {
      primeiroDesign = design;
      if (maxLinks > 0) {
        const internos = (design.links || [])
          .map((h) => h.split('#')[0])
          .filter((h) => { try { return new URL(h).host === primeira.host; } catch { return false; } })
          .filter((h) => !/\.(pdf|zip|jpg|png|webp|mp4|svg)$/i.test(h));
        for (const link of [...new Set(internos)]) {
          if (feitas.size + fila.length >= maxLinks + urls.length) break;
          if (!feitas.has(link) && !fila.includes(link)) fila.push(link);
        }
        console.log(`  (descobri ${fila.length} páginas internas para capturar)`);
      }
    }
  }
  await ctxDesktop.close();

  // ---- mobile (só telas; recursos extras entram no mesmo acervo)
  if (comMobile) {
    console.log('\nCapturando versão mobile…');
    const ctxMobile = await navegador.newContext({ ...devices['iPhone 13'], locale: 'pt-BR' });
    ligaCaptura(ctxMobile, pendentes);
    const pm = await ctxMobile.newPage();
    for (const p of paginas) {
      const ok = await pm.goto(p.url, { waitUntil: 'load', timeout: 60000 }).catch(() => null);
      if (!ok) continue;
      await pm.waitForTimeout(Math.min(esperaExtra, 2000));
      await rolarTudo(pm);
      await pm.screenshot({ path: path.join(saida, 'telas', `${p.apelido}-mobile.png`), fullPage: true }).catch(() => {});
    }
    await ctxMobile.close();
  }

  await Promise.allSettled(pendentes);
  await navegador.close();

  // ---- relatórios
  escreve(path.join(saida, 'rede.json'), JSON.stringify(rede, null, 2));

  const porTipo = rede.reduce((acc, r) => {
    const k = r.recurso || 'outro';
    acc[k] = acc[k] || { arquivos: 0, bytes: 0 };
    acc[k].arquivos++; acc[k].bytes += r.bytes;
    return acc;
  }, {});

  const kb = (b) => (b / 1024).toFixed(1) + ' KB';
  const d = primeiroDesign || {};
  const linhas = [];
  linhas.push(`# Captura de ${primeira.host}`);
  linhas.push('');
  linhas.push(`- Data: ${new Date().toISOString()}`);
  linhas.push(`- Páginas capturadas: ${paginas.length}`);
  linhas.push(`- Arquivos salvos: ${salvos.size}`);
  linhas.push(`- Requisições observadas: ${rede.length}`);
  linhas.push('');
  linhas.push('## O que tem em cada pasta');
  linhas.push('');
  linhas.push('| pasta | conteúdo |');
  linhas.push('| --- | --- |');
  linhas.push('| `arquivos/` | todo recurso que o navegador baixou (html, css, js, imagens, fontes, json de API), organizado por host + caminho da URL |');
  linhas.push('| `dom/` | HTML **final renderizado** de cada página (depois do JS rodar) — é o que você quer ler pra entender a estrutura |');
  linhas.push('| `design/` | JSON por página: variáveis CSS, paleta, tipografia, raios, sombras, outline de títulos e seções |');
  linhas.push('| `telas/` | screenshot inteiro da página, desktop e mobile |');
  linhas.push('| `rede.json` | lista completa de requisições (url, status, tipo, tamanho, arquivo salvo) |');
  linhas.push('');
  linhas.push('## Peso por tipo de recurso');
  linhas.push('');
  linhas.push('| tipo | requisições | peso |');
  linhas.push('| --- | ---: | ---: |');
  for (const [tipo, v] of Object.entries(porTipo).sort((a, b) => b[1].bytes - a[1].bytes)) {
    linhas.push(`| ${tipo} | ${v.arquivos} | ${kb(v.bytes)} |`);
  }
  linhas.push('');
  linhas.push('## Páginas');
  linhas.push('');
  for (const p of paginas) linhas.push(`- \`dom/${p.apelido}.html\` — ${p.titulo || '(sem título)'} — ${p.url}`);
  linhas.push('');

  if (d.variaveisCss && Object.keys(d.variaveisCss).length) {
    linhas.push('## Variáveis CSS do :root (página inicial)');
    linhas.push('');
    linhas.push('```css');
    linhas.push(':root {');
    for (const [k, v] of Object.entries(d.variaveisCss).slice(0, 120)) linhas.push(`  ${k}: ${v};`);
    linhas.push('}');
    linhas.push('```');
    linhas.push('');
  }
  const bloco = (titulo, lista) => {
    if (!lista || !lista.length) return;
    linhas.push(`## ${titulo}`);
    linhas.push('');
    for (const item of lista) linhas.push(`- \`${item.valor}\` — ${item.vezes}x`);
    linhas.push('');
  };
  bloco('Famílias de fonte mais usadas', (d.fontes || []).slice(0, 10));
  bloco('Cores de texto mais usadas', (d.cores || []).slice(0, 12));
  bloco('Cores de fundo mais usadas', (d.fundos || []).slice(0, 12));
  bloco('Escala tipográfica', (d.tamanhos || []).slice(0, 14));
  bloco('Raios de borda', (d.raios || []).slice(0, 8));

  if (d.titulos && d.titulos.length) {
    linhas.push('## Estrutura de títulos (página inicial)');
    linhas.push('');
    for (const t of d.titulos) linhas.push(`${'  '.repeat(Math.max(0, +t.tag[1] - 1))}- **${t.tag}** ${t.texto}`);
    linhas.push('');
  }

  escreve(path.join(saida, 'RELATORIO.md'), linhas.join('\n'));

  console.log(`\n✓ pronto`);
  console.log(`  ${salvos.size} arquivos · ${paginas.length} páginas · ${rede.length} requisições`);
  console.log(`  leia primeiro: ${path.join(saida, 'RELATORIO.md')}\n`);
})().catch((e) => {
  console.error('erro fatal:', e);
  process.exit(1);
});
