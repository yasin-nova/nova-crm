"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import trLocale from "@fullcalendar/core/locales/tr";
import { db } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, getDocs } from "firebase/firestore";
import BackButton from "../../../components/BackButton";
import { Plus, X, User, Clock, ArrowRight } from "lucide-react";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  // Form State (Başlangıç ve Bitiş var artık)
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "", // YENİ: Bitiş zamanı
    allDay: false
  });

  // Verileri Çek
  useEffect(() => {
    // Randevuları Dinle
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventList);
    });

    // Müşterileri Çek
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "customers"));
      setCustomers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCustomers();

    return () => unsubscribe();
  }, []);

  // YARDIMCI: Tarih formatını input için ayarla (YYYY-MM-DDTHH:MM)
  // Bu fonksiyon JS tarihini HTML inputunun anlayacağı formata çevirir.
  const formatDateForInput = (date: Date) => {
    // Saat farkını (Timezone) düzeltmek için yerel saati ISO formatına çeviriyoruz
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  // TAKVİME TIKLAYINCA ÇALIŞAN FONKSİYON
  const handleDateClick = (arg: any) => {
    const clickedDate = new Date(arg.dateStr);
    
    // Eğer saatli görünüme tıklandıysa (Haftalık/Günlük) saati al, 
    // Ay görünümüne tıklandıysa varsayılan olarak sabah 09:00 yap.
    let startDate = clickedDate;
    if (arg.view.type === "dayGridMonth") {
        startDate.setHours(9, 0, 0, 0);
    }

    // Bitiş tarihi varsayılan olarak 1 saat sonrası olsun
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 Saat ekle

    setNewEvent({
      title: "",
      start: formatDateForInput(startDate), // Tıklanan yeri otomatik doldur
      end: formatDateForInput(endDate),     // 1 saat sonrasını otomatik doldur
      allDay: arg.allDay
    });
    
    setIsModalOpen(true);
  };

  // Randevu Kaydet
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return alert("Lütfen bir müşteri seçin!");
    if (newEvent.start >= newEvent.end) return alert("Bitiş saati başlangıçtan sonra olmalıdır!");

    try {
      await addDoc(collection(db, "appointments"), {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end, // Bitişi de kaydediyoruz
        allDay: newEvent.allDay
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  // Silme
  const handleEventClick = async (info: any) => {
    if (confirm(`'${info.event.title}' randevusunu silmek istiyor musun?`)) {
      await deleteDoc(doc(db, "appointments", info.event.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Randevu Takvimi</h1>
          <p className="text-gray-500">Müşteri görüşmelerini planla.</p>
        </div>
        <button 
          onClick={() => {
             // Butonla açılırsa şimdiki saati ver
             const now = new Date();
             const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
             setNewEvent({
                 title: "",
                 start: formatDateForInput(now),
                 end: formatDateForInput(nextHour),
                 allDay: false
             });
             setIsModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Plus size={20}/> Randevu Ekle
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={trLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          eventColor="#9333ea"
          selectable={true} // Seçilebilir yap
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Randevu Planla</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              
              {/* Müşteri Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                  <select
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white appearance-none"
                  >
                    <option value="">Seçiniz...</option>
                    {customers.map((cust) => (
                      <option key={cust.id} value={cust.fullName}>{cust.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SAAT ARALIĞI SEÇİMİ (YAN YANA) */}
              <div className="grid grid-cols-2 gap-3">
                  {/* Başlangıç */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Başlangıç</label>
                    <input 
                        type="datetime-local" 
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                        value={newEvent.start}
                        onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                    />
                  </div>

                  {/* Bitiş */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Bitiş</label>
                    <input 
                        type="datetime-local" 
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                        value={newEvent.end}
                        onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                    />
                  </div>
              </div>

              {/* Tüm Gün Checkbox */}
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                 <input 
                   type="checkbox" 
                   id="allDay"
                   checked={newEvent.allDay}
                   onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})}
                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                 />
                 <label htmlFor="allDay" className="text-sm text-gray-700 font-medium">Bu işlem tüm gün sürecek</label>
              </div>

              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors">
                Randevuyu Oluştur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}