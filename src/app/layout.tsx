import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Context'i import ettik

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nova CRM",
  description: "Müşteri Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ⚠️ DİKKAT: html ve body etiketleri EN DIŞTA olmalı
    <html lang="tr">
      <body className={inter.className}>
        {/* AuthProvider BODY etiketinin İÇİNDE olmalı */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}