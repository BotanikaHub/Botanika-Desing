import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Club",
  description:
    "Creator Club — o clube de creators das marcas que você ama. Recomende, acompanhe cada venda em tempo real e ganhe por isso.",
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
