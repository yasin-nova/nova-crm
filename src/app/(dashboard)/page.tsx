"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Users, Calendar, TrendingUp, Clock, ArrowRight, BarChart3, X } from "lucide-react"; // BarChart3 ve X eklendi
import Link from "next/link";
import RevenueChart from "../../components/RevenueChart"; // Grafiği import ettik

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    todayAppointments: 0,
    monthlyRevenue: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // YENİ: Grafik Modal State'i
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // 1. Müşteriler
        const customersSnap = await getDocs(collection(db, "customers"));
        
        // 2. Randevular
        const appointmentsSnap = await getDocs(query(collection(db, "appointments"), orderBy("start", "asc")));
        let todayCount = 0;
        let upcomingList: any[] = [];

        appointmentsSnap.forEach(doc => {
          const data = doc.data();
          const apptDate = data.start.split('T')[0];
          const apptFullDate = new Date(data.start);

          if (apptDate === todayStr) todayCount++;
          if (apptFullDate >= now) upcomingList.push({ id: doc.id, ...data });
        });

        // 3. Aylık Ciro
        const invoicesSnap = await getDocs(collection(db, "invoices"));
        let calculatedRevenue = 0;

        invoicesSnap.forEach(doc => {
          const inv = doc.data();
          let invDate = new Date();
          if (inv.date && typeof inv.date.toDate === 'function') {
            invDate = inv.date.toDate();
          } else if (inv.date) {
            invDate = new Date(inv.date);
          }

          if (
            inv.status === "paid" && 
            invDate.getMonth() === currentMonth && 
            invDate.getFullYear() === currentYear
          ) {
            calculatedRevenue += Number(inv.amount);
          }
        });

        setStats({
          totalCustomers: customersSnap.size,
          todayAppointments: todayCount,
          monthlyRevenue: calculatedRevenue
        });

        setUpcomingAppointments(upcomingList.slice(0, 5));

      } catch (error) {
        console.error("Dashboard veri hatası:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Nova Panel'e Hoş Geldin 👋</h1>
          <p className="text-gray-500 mt-1">İşte işletmenizin anlık durumu.</p>
        </div>

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Kart 1: Müşteriler */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-purple-200 transition-colors">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Toplam Müşteri</p>
              <h3 className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalCustomers}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>

          {/* Kart 2: Randevular */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Bugünkü Randevular</p>
              <h3 className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.todayAppointments}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
          </div>

          {/* Kart 3: Ciro (GÜNCELLENDİ: BUTON EKLENDİ) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-green-200 transition-colors relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Bu Ayın Cirosu</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : `₺${stats.monthlyRevenue.toLocaleString('tr-TR')}`}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
            </div>
            
            {/* YENİ: Küçük Analiz Butonu */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-green-600 font-medium">Tahsil edilen tutar</span>
                <button 
                  onClick={() => setShowChart(true)}
                  className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors font-bold"
                >
                  <BarChart3 size={14}/> Analizi Gör
                </button>
            </div>
          </div>
        </div>

        {/* --- GRAFİK BURADAN KALDIRILDI (MODAL İÇİNE ALINDI) --- */}

        {/* ALT BÖLÜM: YAKLAŞAN RANDEVULAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock size={20} className="text-purple-600"/> Yaklaşan Randevular
              </h3>
              <Link href="/calendar" className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1">
                Tümünü Gör <ArrowRight size={16}/>
              </Link>
            </div>
            
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Yükleniyor...</div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400 mb-2">Hiç randevu yok.</p>
                  <Link href="/calendar" className="text-purple-600 font-bold hover:underline">Takvime Git ve Ekle</Link>
                </div>
              ) : (
                upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-lg text-sm text-center min-w-[60px]">
                        {appt.start.split('T')[1].slice(0, 5)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{appt.title}</h4>
                        <p className="text-xs text-gray-500">{appt.start.split('T')[0]}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Onaylandı</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-xl mb-2">Hızlı İşlem</h3>
            <p className="text-purple-100 text-sm mb-6">Hemen yeni bir müşteri ekle veya randevu oluştur.</p>
            
            <div className="space-y-3">
              <Link href="/customers" className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-xl text-center font-medium transition-colors">
                + Müşteri Ekle
              </Link>
              <Link href="/calendar" className="block w-full bg-white text-purple-700 hover:bg-gray-50 p-3 rounded-xl text-center font-bold transition-colors">
                + Randevu Oluştur
              </Link>
               <Link href="/finance" className="block w-full bg-green-500 hover:bg-green-600 border border-transparent p-3 rounded-xl text-center font-bold transition-colors shadow-lg">
                + Gelir Ekle
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* --- YENİ: GRAFİK MODALI (POPUP) --- */}
      {showChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
           {/* Modal İçeriği */}
           <div className="bg-white rounded-3xl w-full max-w-4xl p-2 shadow-2xl animate-in zoom-in-95 duration-200 relative">
              {/* Kapatma Butonu */}
              <button 
                onClick={() => setShowChart(false)}
                className="absolute right-4 top-4 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600"/>
              </button>
              
              {/* Grafiği Buraya Koyduk */}
              <div className="p-4">
                 <RevenueChart />
              </div>
           </div>
        </div>
      )}

    </main>
  );
}