import { Linking } from "react-native";

import type { OrderStatus } from "@/constants/orderStatus";

export function normalizePhoneForWhatsapp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

export function buildStatusMessage(status: OrderStatus, customerName: string, itemsLabel: string): string {
  const items = itemsLabel || "siparişiniz";

  switch (status) {
    case "talep_alindi":
      return `Sayın ${customerName}, ${items} için talebiniz alınmıştır.`;
    case "alim_planlandi":
      return `Sayın ${customerName}, ${items} için alım planlandı. Ekibimiz belirtilen tarihte adresinize gelecektir.`;
    case "alindi":
      return `Sayın ${customerName}, ${items} adresinizden alınmıştır. Yıkama sürecine başlanacaktır.`;
    case "yikaniyor":
      return `Sayın ${customerName}, ${items} şu anda yıkanıyor.`;
    case "kurutuluyor":
      return `Sayın ${customerName}, ${items} kurutuluyor / bakım aşamasında.`;
    case "teslime_hazir":
      return `Sayın ${customerName}, ${items} teslime hazır hale gelmiştir.`;
    case "teslimat_planlandi":
      return `Sayın ${customerName}, ${items} teslimat için yola çıkmıştır. Kısa süre içinde adresinizde olacağız.`;
    case "teslim_edildi":
      return `Sayın ${customerName}, ${items} teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    case "iptal_edildi":
      return `Sayın ${customerName}, siparişiniz iptal edilmiştir.`;
    default:
      return `Sayın ${customerName}, ${items} ile ilgili siparişinizde güncelleme var.`;
  }
}

export async function openWhatsapp(phone: string, message: string) {
  const number = normalizePhoneForWhatsapp(phone);
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}
