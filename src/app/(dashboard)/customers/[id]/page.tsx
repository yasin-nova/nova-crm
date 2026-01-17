"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "../../../../lib/firebase";
import { doc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import BackButton from "../../../../components/BackButton";
import { User, Phone, Mail, FileText, Trash2, Save, X, Calendar, Wallet, CheckCircle, Clock } from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Ana Müşteri Verisi
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // İlişkili Veriler
  const [custAppointments, setCustAppointments] = useState<any[]>([]);
  const [custInvoices, setCustInvoices] = useState<any[]>([]);

  // Düzenleme Modu
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: ""
  });

  // VERİLERİ ÇEKME FONKSİYONU
  // useCallback ile sarmaladık ki useEffect içinde bağımlılık sorunu olmasın
  const fetchAllData = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      // 1. Müşteri Profilini Çek
      const docRef = doc(db, "customers", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const custData = docSnap.data();
        setCustomer(custData);
        setEditForm({
          fullName: custData.fullName,
          phone: custData.phone,
          email: custData.email,
          notes: custData.notes
        });

        // 2. Bu Müşteriye Ait Randevuları Bul
        // Not: Gerçek projede 'customerId' ile aramak daha doğrudur. 
        // Şimdilik isim eşleşmesi üzerinden gidiyoruz.
        const appQuery = query(
          collection(db, "appointments"),
          // Randevu başlığı müşterinin adını içeriyor mu diye bakamayız (Firestore sınırlaması).
          // Bu yüzden basitlik adına tümünü çekip JS ile filtreleyeceğiz veya tam isim eşleşmesi yapacağız.
          // Burada tam isim eşleşmesi varsayıyoruz:
           where("title", "==", custData.fullName) 
        );
        
        // Alternatif: Eğer takvimde "Ahmet Bey - Görüşme" diye kaydettiysen bu sorgu boş döner.
        // O yüzden şimdilik tüm randevuları çekip içinde ismi geçiyor mu diye bakacağız (Küçük veri için uygundur).
        const allAppts = await getDocs(query(collection(db, "appointments"), orderBy("start", "desc")));
        const filteredAppts = allAppts.docs
          .map(d => ({id: d.id, ...d.data()}))
          .filter((a: any) => a.title.toLowerCase().includes(custData.fullName.toLowerCase()));

        setCustAppointments(filteredAppts);

        // 3. Bu Müşteriye Ait Faturaları Bul
        const invQuery = query(
          collection(db, "invoices"),
          where("customerName", "==", custData.fullName),
          orderBy("date", "desc")
        );
        const invSnap = await getDocs(invQuery);
        setCustInvoices(invSnap.docs.map(d => ({id: d.id, ...d.data()})));

      } else {
        alert("Müşteri bulunamadı!");
        router.push("/customers");
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // SİLME İŞLEMİ
  const handleDelete = async () => {
    if (confirm("Bu müşteriyi ve geçmişini silmek istediğine emin misin?")) {
      try {
        await deleteDoc(doc(db, "customers", id as string));
        router.push("/customers");
      } catch (error) {
        console.error(error);
      }
    }
  };

  // GÜNCELLEME İŞLEMİ
  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "customers", id as string);
      await updateDoc(docRef, editForm);
      setCustomer(editForm);
      setIsEditing(false);
      alert("Profil güncellendi.");
      fetchAllData(); // İsim değiştiyse ilişkili verileri tekrar kontrol et
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <BackButton />

      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {customer.fullName}
          </h1>
          <p className="text-gray-500 text-sm">Müşteri Detay ve Geçmişi</p>
        </div>
        
        <div className="flex gap-2">
           {!isEditing ? (
             <>
                <button onClick={() => setIsEditing(true)} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Düzenle
                </button>
                <button onClick={handleDelete} className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                  <Trash2 size={16}/> Sil
                </button>
             </>
           ) : (
             <>
                <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold">İptal</button>
                <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Save size={16}/> Kaydet
                </button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: PROFİL KARTI */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                <div className="bg-purple-600 p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30 mb-3">
                        {customer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-white">{customer.fullName}</h2>
                    <p className="text-purple-200 text-sm">{customer.email || "E-posta yok"}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                        <Phone size={14}/> Telefon
                        </label>
                        {isEditing ? (
                            <input type="text" value={editForm.phone} onChange={(e)=> setEditForm({...editForm, phone: e.target.value})} className="w-full p-2 border rounded"/>
                        ) : <p className="font-medium text-gray-800">{customer.phone}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                        <Mail size={14}/> E-posta
                        </label>
                        {isEditing ? (
                            <input type="email" value={editForm.email} onChange={(e)=> setEditForm({...editForm, email: e.target.value})} className="w-full p-2 border rounded"/>
                        ) : <p className="font-medium text-gray-800">{customer.email || "-"}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                        <FileText size={14}/> Notlar
                        </label>
                        {isEditing ? (
                            <textarea value={editForm.notes} onChange={(e)=> setEditForm({...editForm, notes: e.target.value})} className="w-full p-2 border rounded h-24"/>
                        ) : (
                            <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm italic">
                                {customer.notes || "Not yok."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* SAĞ KOLON: GEÇMİŞ İŞLEMLER (RANDEVULAR VE FATURALAR) */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. RANDEVU GEÇMİŞİ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="text-purple-600" size={20}/> Randevu Geçmişi
                    </h3>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold">
                        {custAppointments.length} Kayıt
                    </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {custAppointments.length === 0 ? (
                        <p className="p-6 text-center text-gray-400 text-sm">Bu müşteri için kayıtlı randevu bulunamadı.</p>
                    ) : (
                        custAppointments.map((app: any) => (
                            <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">{app.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(app.start).toLocaleDateString('tr-TR')} - {new Date(app.start).toLocaleTimeString('tr-TR').slice(0,5)}
                                    </p>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Tamamlandı</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 2. ÖDEME GEÇMİŞİ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Wallet className="text-green-600" size={20}/> Ödeme ve Faturalar
                    </h3>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                        {custInvoices.length} İşlem
                    </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {custInvoices.length === 0 ? (
                        <p className="p-6 text-center text-gray-400 text-sm">Bu müşteriye ait ödeme kaydı yok.</p>
                    ) : (
                        custInvoices.map((inv: any) => (
                            <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">{inv.description || "Açıklama yok"}</p>
                                    <p className="text-xs text-gray-500">
                                        {inv.date ? new Date(inv.date.seconds * 1000).toLocaleDateString('tr-TR') : "-"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">₺{inv.amount}</p>
                                    {inv.status === 'paid' ? (
                                        <span className="flex items-center gap-1 text-xs text-green-600 font-bold justify-end">
                                            <CheckCircle size={12}/> Ödendi
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-orange-500 font-bold justify-end">
                                            <Clock size={12}/> Bekliyor
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}