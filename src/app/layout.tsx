import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/src/components/AlertProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
  
});

export const metadata: Metadata = {
  title: "ReUse v3",
  description: "ReUse v3 - Plataforma de troca de itens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className={`${poppins.variable} antialiased`}>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
