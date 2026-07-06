# Halı Yıkama Otomasyonu — Ürün İskeleti

## 1. Amaç

Halı yıkama firmalarının müşteri, sipariş, teslimat ve tahsilat süreçlerini tek bir mobil
uygulamadan yönetmesini sağlamak. Sahadaki personel siparişi telefonundan oluşturur,
durumunu günceller; müşteri otomatik SMS/WhatsApp bildirimleriyle haberdar olur;
yönetici gelir/gider ve iş yükünü tek ekrandan izler.

Araştırma (Kover, Dehapos, UstaPOS, Haliyikamam gibi yerli otomasyonlar ve Jobber,
Housecall Pro gibi küresel saha hizmeti CRM'leri) ortak bir çekirdek gösteriyor:
müşteri/adres kaydı, sipariş durum hattı, otomatik durum bildirimi, m²/adet bazlı
fiyatlandırma, tahsilat takibi, temel raporlama. Bu iskelet o çekirdek üzerine kurulu.

## 2. Kapsam Dışı (şimdilik)

Muhasebe entegrasyonu (e-fatura), çoklu dil, web paneli — ilk fazlarda yok. Mimari
bunlara kapalı değil ama MVP'ye dahil edilmedi.

## 3. Modüller

1. **Auth & Firma Yönetimi** — Çoklu firma (tenant) desteği; roller: Yönetici, Operatör/Şoför, Muhasebe.
2. **Müşteri Yönetimi** — Müşteri kartı, birden fazla adres, notlar, etiketler (ev/işyeri/apartman), geçmiş sipariş listesi.
3. **Sipariş/İş Yönetimi** — Sipariş kalemleri (halı, kilim, koltuk, perde), m²/adet, durum hattı, fotoğraf (alım/teslim öncesi-sonrası).
4. **Randevu & Saha Yönetimi** — Alım/teslim tarihi, şoför/operatör atama, günlük iş listesi.
5. **Ödeme & Tahsilat** — Nakit/kart/veresiye, kısmi ödeme, bakiye takibi.
6. **Bildirimler** — Durum değiştiğinde otomatik SMS/WhatsApp/push (ör. "Halınız yıkanıyor", "Teslimat bugün").
7. **Depo/Etiket Takibi** — Her sipariş kalemine barkod/QR, depoda raf/etiket konumu (Faz 4).
8. **Raporlama & Dashboard** — Günlük/aylık ciro, bekleyen tahsilat, personel bazlı iş yükü.
9. **Ayarlar** — Fiyat listesi (ürün tipi × birim fiyat), firma bilgisi, hizmet tanımları.

## 4. Sipariş Durum Hattı

```
Talep Alındı
   → Alım Planlandı
   → Alındı (Depoda)
   → Yıkanıyor
   → Kurutuluyor / Bakımda
   → Teslime Hazır
   → Teslimat Planlandı
   → Teslim Edildi
(herhangi bir noktada) → İptal Edildi
```

Ödeme durumu bu hattan bağımsız ayrı bir alan: `Bekliyor / Kısmi Ödendi / Tahsil Edildi`.

## 5. Çekirdek Veri Modeli

| Tablo | Açıklama |
|---|---|
| `companies` | Tenant — her halı yıkama firması |
| `users` | Uygulama kullanıcıları (rol: admin/operator/accountant), `company_id` ile bağlı |
| `customers` | Müşteri kartı: ad, telefon, ikincil telefon, notlar, etiketler |
| `customer_addresses` | Müşteriye ait birden fazla adres (etiket, adres metni, konum) |
| `price_list` | Firma bazlı ürün tipi → birim fiyat (m² veya adet) |
| `orders` | Sipariş: müşteri, adres, durum, alım/teslim tarihi, atanan kullanıcı, tutarlar |
| `order_items` | Sipariş kalemleri: ürün tipi, ölçü, m², adet, birim fiyat, leke/hasar notu, fotoğraflar |
| `order_status_history` | Durum geçmişi (kim, ne zaman, hangi duruma) |
| `payments` | Sipariş bazlı tahsilatlar (tutar, yöntem, tarih) |
| `notifications_log` | Gönderilen SMS/WhatsApp/push kayıtları |
| `vehicles` | (Faz 4) Araç/şoför eşlemesi |
| `warehouse_slots` | (Faz 4) Depo raf/etiket — `order_item_id` ile eşleşir |

Detaylı şema: `supabase/schema.sql`

## 6. Teknoloji Seçimi

- **Mobil:** React Native + Expo + TypeScript — tek kod tabanıyla iOS/Android, hızlı geliştirme, OTA güncelleme.
- **Navigasyon:** React Navigation (native-stack + bottom-tabs).
- **Sunucu durumu:** TanStack Query (React Query) — Supabase üzerinden veri çekme/cache.
- **Form & doğrulama:** React Hook Form + Zod.
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime) — çoklu firma izolasyonu Row Level Security ile; foto depolama Storage ile; sipariş durum değişiklikleri Realtime ile anlık yansıtılabilir.
- **Bildirim:** Expo Push (uygulama içi) + üçüncü parti SMS/WhatsApp API (Faz 3, sağlayıcı seçimi ayrı karar).

Bu seçim; tek/az kişilik ekiple hızlı MVP çıkarmaya, çoklu firmaya satılabilir bir yapıya
ve foto/bildirim gibi ihtiyaçların hazır servislerle çözülmesine uygun.

## 7. Yol Haritası

- **Faz 1 — MVP:** Auth, müşteri CRUD, sipariş oluşturma + durum güncelleme, basit dashboard.
- **Faz 2:** Fiyat listesi + otomatik tutar hesaplama, fotoğraf ekleme, randevu takvimi.
- **Faz 3:** Ödeme/tahsilat takibi, SMS/WhatsApp otomatik bildirim entegrasyonu.
- **Faz 4:** Depo/etiket takibi, şoför/araç atama, rota görünümü.
- **Faz 5:** Çoklu şube, kampanya/sadakat programı, gelişmiş raporlama.

## 8. Proje İskeleti

```
haliyikamaotomasyon/
├── App.tsx
├── app.json
├── package.json
├── src/
│   ├── navigation/       # Auth + ana sekme navigasyonu
│   ├── screens/
│   │   ├── auth/          # Giriş ekranı
│   │   ├── dashboard/      # Özet ekranı
│   │   ├── customers/      # Müşteri liste/detay/form
│   │   ├── orders/         # Sipariş liste/detay/form
│   │   └── settings/       # Fiyat listesi, firma ayarları
│   ├── components/        # Ortak UI (StatusBadge, EmptyState, ...)
│   ├── lib/supabase.ts     # Supabase istemcisi
│   ├── types/domain.ts     # Veri modeli TypeScript karşılıkları
│   ├── constants/          # Sipariş durumları, roller
│   └── hooks/              # useCustomers, useOrders (React Query)
└── supabase/schema.sql    # Tablolar + RLS politikaları
```

Bu ilk sürümde ekranlar iskelet halinde (gezinme + tipler bağlı, temel liste/form
akışı) — Faz 1 içeriği bu iskelet üzerine dolduruluyor.
