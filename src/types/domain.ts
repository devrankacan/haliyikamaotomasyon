import type { OrderStatus, PaymentStatus, UserRole } from "@/constants/orderStatus";

export interface Company {
  id: string;
  name: string;
  phone: string | null;
  createdAt: string;
}

export interface AppUser {
  id: string;
  companyId: string;
  name: string;
  phone: string | null;
  role: UserRole;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  addressText: string;
  lat: number | null;
  lng: number | null;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  secondaryPhone: string | null;
  notes: string | null;
  tags: string[];
  addresses: CustomerAddress[];
  createdAt: string;
}

export type ItemType = "hali" | "kilim" | "koltuk" | "perde" | "diger";

export interface OrderItem {
  id: string;
  orderId: string;
  itemType: ItemType;
  description: string | null;
  widthM: number | null;
  heightM: number | null;
  areaM2: number | null;
  quantity: number;
  unitPrice: number;
  stainNotes: string | null;
  photoUrls: string[];
}

export interface Order {
  id: string;
  companyId: string;
  customerId: string;
  addressId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  pickupDate: string | null;
  deliveryDate: string | null;
  assignedUserId: string | null;
  totalAmount: number;
  paidAmount: number;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: "nakit" | "kart" | "havale" | "veresiye";
  paidAt: string;
  note: string | null;
}

export interface PriceListEntry {
  id: string;
  companyId: string;
  itemType: ItemType;
  unit: "m2" | "adet";
  unitPrice: number;
}

export type SmsProvider = "netgsm" | "iletimerkezi" | "twilio" | "diger";

export interface SmsProviderSettings {
  id: string;
  companyId: string;
  provider: SmsProvider;
  apiKey: string | null;
  apiSecret: string | null;
  senderId: string | null;
}
