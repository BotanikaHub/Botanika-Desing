import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Botanika Creator Hub",
  description:
    "Programa de creators e afiliados da Botanika. Divulgue, venda e ganhe comissões.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
