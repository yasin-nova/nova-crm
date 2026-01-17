"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, DollarSign, CheckCircle, Clock, Trash2 } from "lucide-react";
import BackButton from "@/src/components/BackButton";

// Tipler
interface Invoice {
    id: string;
    customerName: string;
    amount: number;
    description: string;
    status: "paid" | "pending"; // Ödendi veya Bekliyor
    date: any;
}

export default function FinancePage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Yeni Fatura Formu
    const [formData, setFormData] = useState({
        customerName: "",
        amount: "",
        description: "",
        status: "pending"
    });

    // Müşteri Listesi (Dropdown için)
    const [customers, setCustomers] = useState<any[]>([]);

    // 1. Verileri Çek (Hem Faturalar Hem Müşteriler)
    const fetchData = async () => {
        setLoading(true);
        try {
            // Faturaları çek
            const invQuery = query(collection(db, "invoices"), orderBy("date", "desc"));
            const invSnap = await getDocs(invQuery);
            const invList = invSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
            setInvoices(invList);

            // Müşterileri çek (Dropdown'da seçmek için)
            const custSnap = await getDocs(collection(db, "customers"));
            const custList = custSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCustomers(custList);

        } catch (error) {
            console.error("Veri hatası:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Fatura Ekle
    const handleAddInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.customerName || !formData.amount) return alert("Eksik bilgi!");

        try {
            await addDoc(collection(db, "invoices"), {
                customerName: formData.customerName,
                amount: Number(formData.amount),
                description: formData.description,
                status: formData.status,
                date: Timestamp.now()
            });

            alert("Gelir kaydı eklendi! 💰");
            setIsFormOpen(false);
            setFormData({ customerName: "", amount: "", description: "", status: "pending" });
            fetchData(); // Listeyi yenile
        } catch (error) {
            console.error("Ekleme hatası:", error);
        }
    };

    // 3. Durum Güncelle (Ödendi Yap)
    const toggleStatus = async (invoice: Invoice) => {
        const newStatus = invoice.status === "paid" ? "pending" : "paid";
        try {
            await updateDoc(doc(db, "invoices", invoice.id), { status: newStatus });
            // Listeyi güncelle (tekrar çekmeden localde güncelleme - Optimistic UI)
            setInvoices(invoices.map(inv => inv.id === invoice.id ? { ...inv, status: newStatus as "paid" | "pending" } : inv));
        } catch (error) {
            console.error("Güncelleme hatası", error);
        }
    };

    // 4. Silme
    const handleDelete = async (id: string) => {
        if (!confirm("Bu kaydı silmek istediğine emin misin?")) return;
        try {
            await deleteDoc(doc(db, "invoices", id));
            setInvoices(invoices.filter(inv => inv.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    // Toplam Gelir Hesabı
    const totalRevenue = invoices
        .filter(inv => inv.status === "paid")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const pendingRevenue = invoices
        .filter(inv => inv.status === "pending")
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
<BackButton />  
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Finans Yönetimi</h1>
                    <p className="text-gray-500 mt-1">Gelir gider takibi ve faturalandırma.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-green-200"
                >
                    {isFormOpen ? "Kapat" : <><Plus size={20} /> Yeni Gelir Ekle</>}
                </button>
            </div>

            {/* ÖZET KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-green-600 font-bold text-sm uppercase">Toplam Tahsil Edilen</p>
                        <h3 className="text-3xl font-bold text-gray-800">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
                    </div>
                    <CheckCircle className="text-green-500 opacity-50" size={40} />
                </div>
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-orange-600 font-bold text-sm uppercase">Bekleyen Ödeme</p>
                        <h3 className="text-3xl font-bold text-gray-800">₺{pendingRevenue.toLocaleString('tr-TR')}</h3>
                    </div>
                    <Clock className="text-orange-500 opacity-50" size={40} />
                </div>
            </div>

            {/* FORM ALANI */}
            {isFormOpen && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">Yeni Fatura Oluştur</h2>
                    <form onSubmit={handleAddInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Müşteri Seçimi - İlişkisel Veri */}
                        <select
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            required
                        >
                            <option value="">Müşteri Seçiniz...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.fullName}>{c.fullName}</option>
                            ))}
                        </select>

                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">₺</span>
                            <input
                                type="number"
                                placeholder="Tutar"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full p-3 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Açıklama (Örn: Mart ayı danışmanlık)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 md:col-span-2"
                        />

                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white md:col-span-2"
                        >
                            <option value="paid">Ödendi (Tahsil Edildi)</option>
                            <option value="pending">Bekliyor (Vadeli)</option>
                        </select>

                        <button type="submit" className="md:col-span-2 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-bold transition-colors">
                            Kaydet
                        </button>
                    </form>
                </div>
            )}

            {/* LİSTE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Müşteri</th>
                            <th className="px-6 py-4">Açıklama</th>
                            <th className="px-6 py-4">Tutar</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={5} className="p-6 text-center">Yükleniyor...</td></tr> : invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 group">
                                <td className="px-6 py-4 font-bold text-gray-800">{inv.customerName}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{inv.description}</td>
                                <td className="px-6 py-4 font-mono font-bold text-gray-800">₺{inv.amount.toLocaleString('tr-TR')}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(inv)}
                                        className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all shadow-sm
        ${inv.status === 'paid'
                                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group/btn'
                                                : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-green-600 hover:text-white hover:border-green-600'
                                            }
      `}
                                    >
                                        {inv.status === 'paid' ? (
                                            <>
                                                {/* Normalde Ödendi göster, üzerine gelince "İptal Et" göster */}
                                                <span className="group-hover/btn:hidden flex items-center gap-1">
                                                    <CheckCircle size={14} /> Ödendi
                                                </span>
                                                <span className="hidden group-hover/btn:flex items-center gap-1">
                                                    <Clock size={14} /> İptal Et
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                {/* Bekliyor ise "Tahsil Et" butonu gibi davran */}
                                                <Clock size={14} /> Tahsil Et
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(inv.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}