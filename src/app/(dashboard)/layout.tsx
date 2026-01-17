"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı yoksa Login'e at
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Yükleniyor ekranı (Spinner)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Kullanıcı yoksa içeriği gösterme (Router login'e atana kadar bekle)
  if (!user) return null;

  // Kullanıcı varsa sayfayı göster
  return <>{children}</>;
}