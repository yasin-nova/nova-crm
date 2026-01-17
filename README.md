# 🚀 Nova CRM - Modern İşletme Yönetim Paneli

Nova CRM, küçük ve orta ölçekli işletmelerin müşteri ilişkilerini, finansal süreçlerini ve randevu takvimlerini yönetmeleri için geliştirilmiş, **Next.js 14** ve **Firebase** tabanlı tam kapsamlı bir SaaS (Software as a Service) uygulamasıdır.

## 🌍 Canlı Demo (Live Preview)

Projeyi canlı ortamda test etmek için aşağıdaki bağlantıya tıklayabilirsiniz:

👉 **[Canlı Demo Uygulamasına Git](https://nova-crm-khaki.vercel.app/)**

### 🔑 Test Giriş Bilgileri
Admin paneline erişmek ve tüm özellikleri (CRUD işlemleri, Dashboard, Takvim) test etmek için aşağıdaki bilgileri kullanabilirsiniz:

| Alan | Değer |
| :--- | :--- |
| **E-posta** | `admin@novacrm.com` |
| **Şifre** | `122112` |

---

## 🔥 Özellikler

Bu proje, modern web teknolojilerinin en güncel pratikleri kullanılarak geliştirilmiştir:

- **🔐 Güvenli Kimlik Doğrulama:** Firebase Auth ile güvenli giriş sistemi.
- **📊 İnteraktif Dashboard:** Anlık müşteri sayıları, günlük randevular ve Recharts ile görselleştirilmiş yıllık ciro grafikleri.
- **👥 Müşteri Yönetimi (CRUD):**
  - Müşteri ekleme, düzenleme, silme ve detay görüntüleme.
  - Anlık filtreleme ve arama özelliği.
  - Müşteri detay sayfasında ilişkili randevu ve fatura geçmişi.
- **📅 Akıllı Takvim:**
  - FullCalendar entegrasyonu.
  - Müşteri bazlı randevu oluşturma ve saat aralığı belirleme.
- **💰 Finans & Muhasebe:**
  - Gelir takibi, fatura oluşturma.
  - Bekleyen/Ödenen durum yönetimi ve "Tek Tıkla Tahsilat" özelliği.
- **⚙️ Ayarlar:** Profil güncelleme ve şifre değiştirme işlemleri.
- **📱 Responsive Tasarım:** Mobil ve masaüstü uyumlu, Tailwind CSS ile şık arayüz.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** [Next.js 14 (App Router)](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Charts:** [Recharts](https://recharts.org/)
- **Calendar:** [FullCalendar](https://fullcalendar.io/)

## 🚀 Kurulum ve Çalıştırma

Bu projeyi kendi bilgisayarınızda çalıştırmak isterseniz:

1. **Repoyu Klonlayın:**
   ```bash
   git clone [https://github.com/KULLANICI_ADIN/nova-crm.git](https://github.com/KULLANICI_ADIN/nova-crm.git)
   cd nova-crm