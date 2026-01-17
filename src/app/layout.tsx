import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Context'i import ettik

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nova CRM | Müşteri Yönetim Paneli", // Tarayıcı sekmesinde görünecek isim
  description: "İşletmenizi büyütmek için geliştirilmiş modern CRM ve finans yönetim sistemi.",
  icons: {
    icon: '/icon.jpg', 
    apple: '/apple-icon.png',
  },
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