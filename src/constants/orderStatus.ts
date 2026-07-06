export const ORDER_STATUSES = [
  "talep_alindi",
  "alim_planlandi",
  "alindi",
  "yikaniyor",
  "kurutuluyor",
  "teslime_hazir",
  "teslimat_planlandi",
  "teslim_edildi",
  "iptal_edildi",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  talep_alindi: "Talep Alındı",
  alim_planlandi: "Alım Planlandı",
  alindi: "Alındı (Depoda)",
  yikaniyor: "Yıkanıyor",
  kurutuluyor: "Kurutuluyor / Bakımda",
  teslime_hazir: "Teslime Hazır",
  teslimat_planlandi: "Teslimat Planlandı",
  teslim_edildi: "Teslim Edildi",
  iptal_edildi: "İptal Edildi",
};

export const PAYMENT_STATUSES = ["bekliyor", "kismi_odendi", "tahsil_edildi"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  bekliyor: "Bekliyor",
  kismi_odendi: "Kısmi Ödendi",
  tahsil_edildi: "Tahsil Edildi",
};

export const USER_ROLES = ["admin", "operator", "accountant"] as const;
export type UserRole = (typeof USER_ROLES)[number];
