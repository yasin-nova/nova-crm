"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../lib/firebase";
import { updateProfile, updatePassword, User } from "firebase/auth";
import BackButton from "../../../components/BackButton";
import { User as UserIcon, Lock, Save, Mail, ShieldCheck, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form Verileri
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Mevcut kullanıcıyı al
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");
    }
  }, []);

  // Profil (İsim) Güncelleme
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      setMessage({ type: "success", text: "Profil ismi güncellendi! ✅" });
    } catch (error) {
      setMessage({ type: "error", text: "Hata oluştu." });
    }
    setLoading(false);
  };

  // Şifre Güncelleme
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (newPassword.length < 6) return setMessage({ type: "error", text: "Şifre en az 6 karakter olmalı." });
    if (newPassword !== confirmPassword) return setMessage({ type: "error", text: "Şifreler eşleşmiyor." });

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage({ type: "success", text: "Şifre başarıyla değiştirildi! 🔒" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: "error", text: "Güvenlik gereği önce çıkış yapıp tekrar girmelisin." });
      } else {
        setMessage({ type: "error", text: "Şifre değiştirilemedi. " + error.message });
      }
    }
    setLoading(false);
  };

  if (!user) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <BackButton />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Hesap Ayarları</h1>
        <p className="text-gray-500 mt-1">Profil bilgilerini ve güvenliğini yönet.</p>
      </div>

      {/* Mesaj Kutusu (Başarılı/Hatalı) */}
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <ShieldCheck size={20}/> : <AlertCircle size={20}/>}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SOL: PROFİL KARTI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-200">
              {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Hesap Türü</p>
              <h2 className="text-lg font-bold text-gray-800">Yönetici (Admin)</h2>
              <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full inline-block mt-1">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Görünen İsim</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Adınız Soyadınız"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Save size={18}/> Profili Güncelle
            </button>
          </form>
        </div>

        {/* SAĞ: GÜVENLİK KARTI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="text-purple-600" size={20}/> Şifre Değiştir
          </h3>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Şifreyi onayla"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 rounded-xl transition-colors">
              Şifreyi Güncelle
            </button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
            ℹ️ Güvenlik notu: Şifre değiştirmek için yakın zamanda giriş yapmış olmanız gerekir. Hata alırsanız çıkış yapıp tekrar girin.
          </div>
        </div>

      </div>
    </div>
  );
}