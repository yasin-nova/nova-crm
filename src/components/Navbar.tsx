"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Calendar, LogOut, Wallet, Settings } from "lucide-react"; // İkon paketimiz
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo Alanı */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <span className="font-bold text-xl text-gray-800">Nova CRM</span>
      </div>

      {/* Menü Linkleri */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium">
          <LayoutDashboard size={20} />
          <span>Panel</span>
        </Link>
        <Link href="/customers" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium">
          <Users size={20} />
          <span>Müşteriler</span>
        </Link>
        <Link href="/calendar" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium">
          <Calendar size={20} />
          <span>Takvim</span>
        </Link>
        <Link href="/finance" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium">
          <Wallet size={20} />
          <span>Finans</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-700">Yönetici</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold border-2 border-white shadow-sm">
            <Settings size={20} />
          </div>
        </Link>
      </div>

      {/* Profil / Çıkış */}
      <button
        onClick={() => signOut(auth)} // 👈 Çıkış fonksiyonu
        className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-md transition-colors text-sm font-medium"
      >
        <LogOut size={18} />
        <span>Çıkış</span>
      </button>
    </nav>
  );
}