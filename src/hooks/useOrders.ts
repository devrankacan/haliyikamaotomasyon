import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/domain";

async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    companyId: row.company_id,
    customerId: row.customer_id,
    addressId: row.address_id,
    status: row.status,
    paymentStatus: row.payment_status,
    pickupDate: row.pickup_date,
    deliveryDate: row.delivery_date,
    assignedUserId: row.assigned_user_id,
    totalAmount: Number(row.total_amount),
    paidAmount: Number(row.paid_amount),
    notes: row.notes,
    items: (row.items ?? []).map((i: any) => ({
      id: i.id,
      orderId: i.order_id,
      itemType: i.item_type,
      description: i.description,
      widthM: i.width_m,
      heightM: i.height_m,
      areaM2: i.area_m2,
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
      stainNotes: i.stain_notes,
      photoUrls: i.photo_urls ?? [],
    })),
    createdAt: row.created_at,
  }));
}

export function useOrders() {
  return useQuery<Order[]>({ queryKey: ["orders"], queryFn: fetchOrders });
}
