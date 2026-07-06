# Halı Yıkama Otomasyonu

Halı yıkama firmalarının müşteri, sipariş, teslimat ve tahsilat süreçlerini yönettiği
mobil uygulama (React Native + Expo + TypeScript, Supabase backend).

Ürün omurgası, veri modeli ve yol haritası için bkz. [`docs/omurga.md`](docs/omurga.md).

## Kurulum

```bash
npm install
cp .env.example .env   # Supabase URL ve anon key'i doldurun
npx expo start
```

## Önizleme

Bu bir mobil (React Native) uygulama olduğu için gerçek/etkileşimli önizleme kendi
bilgisayarınızda çalıştırılır — bulut ortamı telefonunuza ağ üzerinden bağlanamaz:

- **Telefonda (önerilen):** `npx expo start` çalıştırın, açılan QR kodu telefonunuza
  kurduğunuz [Expo Go](https://expo.dev/go) uygulamasıyla okutun.
- **Simülatör/emülatörde:** `npm run ios` (Mac + Xcode) veya `npm run android`
  (Android Studio) çalıştırın.
- **Tarayıcıda (hızlı bakış için):** `npm run web` — `react-native-web` sayesinde
  ekranların çoğu tarayıcıda da açılır (kamera, native navigasyon geçişleri gibi bazı
  özellikler burada çalışmaz).

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje oluşturun.
2. `supabase/schema.sql` dosyasını proje SQL Editor'ünde çalıştırın (tablolar + RLS politikaları).
3. Proje ayarlarından `URL` ve `anon public key` değerlerini `.env` dosyasına yazın.

## Proje Yapısı

```
src/
├── navigation/   # Auth + sekme navigasyonu
├── screens/      # auth, dashboard, customers, orders, settings
├── components/   # Ortak UI bileşenleri
├── lib/          # Supabase istemcisi
├── types/        # Domain tipleri
├── constants/    # Sipariş durumları, ürün tipleri
└── hooks/        # React Query veri hook'ları
supabase/
└── schema.sql    # Tablolar + Row Level Security politikaları
```

## Durum

Bu, Faz 1 (MVP) öncesi bir iskelettir: navigasyon, veri modeli, Supabase şeması ve
temel ekranlar (müşteri/sipariş liste-detay-form, dashboard) bağlı durumda. Ekran
içindeki `TODO` yorumları bir sonraki adımları işaret eder.
