<div align="center">
  <img src="src/app/icon.png" alt="Nova CRM Logo" width="120" height="120">
  <h1>Nova CRM</h1>
  <p><strong>Modern İşletme, Müşteri ve Finans Yönetim Paneli</strong></p>
  
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://firebase.google.com">
      <img src="https://img.shields.io/badge/Firebase-Backend-orange?style=flat-square&logo=firebase" alt="Firebase" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    </a>
  </p>
</div>

---

## 🚀 Proje Hakkında

**Nova CRM**, küçük ve orta ölçekli işletmelerin dijitalleşme sürecini hızlandırmak için tasarlanmış kapsamlı bir SaaS (Software as a Service) projesidir. Müşteri takibinden randevu yönetimine, gelir-gider dengesinden detaylı grafik analizlerine kadar bir işletmenin ihtiyaç duyduğu tüm araçları tek bir modern arayüzde sunar.

## 🌍 Canlı Demo (Live Preview)

Projeyi canlı ortamda test etmek için aşağıdaki bağlantıya tıklayabilirsiniz:

### 👉 **[Canlı Demo Uygulamasına Git](https://nova-crm-khaki.vercel.app/)**

### 🔑 Test Giriş Bilgileri
Admin paneline erişmek ve tüm özellikleri (CRUD işlemleri, Dashboard, Takvim) test etmek için aşağıdaki bilgileri kullanabilirsiniz:

| Alan | Değer |
| :--- | :--- |
| **E-posta** | `admin@novacrm.com` |
| **Şifre** | `122112` |

---

## 🔥 Temel Özellikler

### 1. 📊 İnteraktif Dashboard
* İşletmenin anlık özeti.
* **Recharts** ile güçlendirilmiş, aylık ciro performansını gösteren interaktif grafikler.
* Yaklaşan randevuların listesi ve hızlı erişim butonları.

### 2. 👥 Müşteri Yönetimi (CRM)
* Detaylı müşteri profilleri oluşturma, düzenleme ve silme.
* Anlık (Real-time) arama motoru ile isim, telefon veya e-posta üzerinden filtreleme.
* **Müşteri İlişkileri:** Müşteri detay sayfasında, o kişiye ait **geçmiş randevuları** ve **ödenmiş/bekleyen faturaları** tek ekranda görüntüleme.

### 3. 📅 Akıllı Randevu Takvimi
* **FullCalendar** entegrasyonu.
* Veritabanındaki müşterileri seçerek hızlı randevu oluşturma.
* Otomatik tarih ve saat aralığı belirleme.
* Günlük, haftalık ve aylık görünüm seçenekleri.

### 4. 💰 Finans Yönetimi
* Gelir takibi ve fatura oluşturma.
* **Durum Yönetimi:** "Bekliyor" durumundaki ödemeleri tek tıkla "Tahsil Edildi" olarak işaretleme.
* Hatalı işlemleri geri alma ve silme.

### 5. ⚙️ Hesap & Güvenlik
* **Firebase Authentication** ile güvenli oturum yönetimi.
* Profil bilgilerini (İsim/Avatar) güncelleme.
* Güvenli şifre değiştirme modülü.

---

## 🛠️ Kullanılan Teknolojiler

Bu proje, sektör standartlarına uygun en güncel teknolojilerle geliştirilmiştir:

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Lucide React (İkonlar)
- **Backend:** Firebase (Firestore Database, Authentication)
- **Deployment:** Vercel

---

## 🚀 Kurulum (Local Development)

Projeyi kendi bilgisayarınızda geliştirmek için:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone [https://github.com/KULLANICI_ADIN/nova-crm.git](https://github.com/KULLANICI_ADIN/nova-crm.git)
    cd nova-crm
    ```

2.  **Paketleri Yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevre Değişkenlerini Ayarlayın:**
    Ana dizinde `.env.local` adında bir dosya oluşturun ve Firebase konsolundan aldığınız API bilgilerini girin:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # (Diğer Firebase ayarları...)
    ```

4.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

---

**Geliştirici:** Yasin