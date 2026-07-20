import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Club",
  description:
    "Creator Club — programa de creators e afiliados. Divulgue, venda e ganhe comissões.",
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
