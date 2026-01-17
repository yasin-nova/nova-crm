"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BackButton from "../../../components/BackButton";
import { Plus, Search, Phone, Mail, X } from "lucide-react"; // X ikonunu ekledik

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 YENİ: Arama terimi
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: ""
  });

  const fetchCustomers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "customers"));
    const list = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCustomers(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "customers"), formData);
      setIsModalOpen(false);
      setFormData({ fullName: "", phone: "", email: "", notes: "" });
      fetchCustomers();
      alert("Müşteri başarıyla eklendi! 🎉");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  // 🔍 ARAMA FİLTRESİ MANTIĞI
  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <BackButton />

      {/* ÜST ALAN: BAŞLIK + ARAMA + BUTON */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Müşteriler</h1>
          <p className="text-gray-500 mt-1">Tüm müşteri listeni buradan yönetebilirsin.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          
          {/* 🔍 ARAMA KUTUSU */}
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="İsim, tel veya e-posta ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* EKLEME BUTONU */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-200 whitespace-nowrap"
          >
            <Plus size={20} /> <span className="hidden md:inline">Yeni Müşteri</span><span className="md:hidden">Ekle</span>
          </button>
        </div>
      </div>

      {/* MODAL (Değişmedi) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Yeni Müşteri</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input required type="text" placeholder="Örn: Ahmet Yılmaz" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input required type="tel" placeholder="0555 123 45 67" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input type="email" placeholder="ornek@mail.com" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Özel Notlar</label>
                <textarea placeholder="Notlar..." className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all mt-2">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {/* LİSTE TABLOSU */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Müşteri</th>
                <th className="px-6 py-4">Telefon</th>
                <th className="px-6 py-4">E-posta</th>
                <th className="px-6 py-4">Notlar</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Yükleniyor...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    {searchTerm ? `"${searchTerm}" aramasıyla eşleşen müşteri yok.` : "Henüz kayıtlı müşteri yok."}
                  </td>
                </tr>
              ) : (
                /* BURADA ARTIK 'filteredCustomers' KULLANIYORUZ */
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} onClick={() => router.push(`/customers/${customer.id}`)} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </div>
                      {customer.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {customer.email ? <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {customer.email}</div> : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{customer.notes || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Detay &rarr;</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}