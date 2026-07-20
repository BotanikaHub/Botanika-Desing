import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Verificação simples de saúde do app (não expõe segredos).
export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "creator-hub",
    time: new Date().toISOString(),
  });
}

// build: preset next.js

// redeploy: aplica NEXT_PUBLIC_APP_URL
