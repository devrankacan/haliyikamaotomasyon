import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Customer } from "@/types/domain";

async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*, addresses:customer_addresses(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    phone: row.phone,
    secondaryPhone: row.secondary_phone,
    notes: row.notes,
    tags: row.tags ?? [],
    addresses: (row.addresses ?? []).map((a: any) => ({
      id: a.id,
      customerId: a.customer_id,
      label: a.label,
      addressText: a.address_text,
      lat: a.lat,
      lng: a.lng,
    })),
    createdAt: row.created_at,
  }));
}

export function useCustomers() {
  return useQuery<Customer[]>({ queryKey: ["customers"], queryFn: fetchCustomers });
}
