/**
 * Envio de e-mails transacionais do Creator Club.
 *
 * Usa a Resend (HTTP API — funciona pelo proxy de saída, sem SMTP).
 * Tudo é opcional e "dorme" até você configurar:
 *   - RESEND_API_KEY  → chave da conta Resend
 *   - Brand.emailFrom → remetente por marca (ex.: creators@botanikabrasil.com.br)
 *   - EMAIL_FROM      → remetente padrão (fallback quando a marca não tem um)
 *
 * Enquanto RESEND_API_KEY não existir, sendEmail() vira um no-op silencioso —
 * o app funciona normal, só não dispara e-mail. Assim dá pra deixar o código
 * pronto agora e ligar depois, sem depender de comprar domínio novo (você já
 * pode verificar o domínio que a marca tem hoje, ex.: botanikabrasil.com.br).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string | null;
  replyTo?: string | null;
};

export type SendEmailResult = {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
};

function defaultFrom(): string {
  return process.env.EMAIL_FROM || "Creator Club <onboarding@resend.dev>";
}

/**
 * Envia um e-mail. Nunca lança — retorna { ok, skipped?, error? } para que o
 * fluxo que chama (ex.: aprovação de creator) jamais quebre por causa de e-mail.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true };

  const to = input.to.trim();
  // Não tenta enviar para e-mails sintéticos de import (não reivindicados).
  if (!to || to.endsWith("@import.creatorclub")) {
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from || defaultFrom(),
        to: [to],
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "erro de rede" };
  }
}

// ---------- Templates ----------

function shell(brandName: string, brandColor: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f4;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1c1917">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e7e5e4">
      <tr><td style="background:${brandColor};padding:20px 28px">
        <span style="color:#fff;font-size:14px;font-weight:700;letter-spacing:.3px">Creator Club · ${brandName}</span>
      </td></tr>
      <tr><td style="padding:28px">${inner}</td></tr>
      <tr><td style="padding:16px 28px;border-top:1px solid #e7e5e4;color:#78716c;font-size:12px">
        Você recebeu este e-mail porque faz parte do Creator Club da ${brandName}.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function button(href: string, label: string, color: string): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;font-size:15px">${label}</a>`;
}

export function creatorApprovedEmail(params: {
  brandName: string;
  brandColor: string;
  creatorName: string;
  couponCode: string;
  ratePct: number;
  loginUrl: string;
}): { subject: string; html: string } {
  const firstName = params.creatorName.split(" ")[0] || params.creatorName;
  const inner = `
    <h1 style="margin:0 0 12px;font-size:22px">Bem-vindo(a) ao clube, ${firstName}! 🎉</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#44403c">
      Seu cadastro na <b>${params.brandName}</b> foi aprovado. A partir de agora você
      recomenda o que ama e ganha por isso — com tudo transparente, em tempo real.
    </p>
    <table role="presentation" width="100%" style="background:#faf9f7;border:1px solid #e7e5e4;border-radius:12px;margin:0 0 20px">
      <tr><td style="padding:16px 20px">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#78716c">Seu cupom exclusivo</div>
        <div style="font-size:26px;font-weight:800;letter-spacing:3px;color:${params.brandColor};margin-top:4px">${params.couponCode}</div>
        <div style="font-size:13px;color:#78716c;margin-top:4px">${params.ratePct}% de desconto para o cliente</div>
      </td></tr>
    </table>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#44403c">
      Acesse seu painel para pegar seu link, acompanhar vendas e ver seus ganhos:
    </p>
    <p style="margin:0 0 8px">${button(params.loginUrl, "Entrar no meu painel", params.brandColor)}</p>
  `;
  return {
    subject: `Você foi aprovado(a) no Creator Club da ${params.brandName} 🎉`,
    html: shell(params.brandName, params.brandColor, inner),
  };
}

export function claimInviteEmail(params: {
  brandName: string;
  brandColor: string;
  couponCode: string;
  claimUrl: string;
}): { subject: string; html: string } {
  const inner = `
    <h1 style="margin:0 0 12px;font-size:22px">Seu painel de creator está pronto</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#44403c">
      Você já divulga a <b>${params.brandName}</b> com o cupom
      <b style="color:${params.brandColor}">${params.couponCode}</b>. Agora você pode ativar
      seu painel e acompanhar cada venda e comissão em tempo real — de graça.
    </p>
    <p style="margin:0 0 8px">${button(params.claimUrl, "Ativar meu painel", params.brandColor)}</p>
  `;
  return {
    subject: `Ative seu painel no Creator Club da ${params.brandName}`,
    html: shell(params.brandName, params.brandColor, inner),
  };
}
