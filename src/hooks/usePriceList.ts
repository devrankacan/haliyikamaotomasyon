import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { ItemType, PriceListEntry } from "@/types/domain";

async function fetchPriceList(): Promise<PriceListEntry[]> {
  const { data, error } = await supabase.from("price_list").select("*");

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    companyId: row.company_id,
    itemType: row.item_type,
    unit: row.unit,
    unitPrice: Number(row.unit_price),
  }));
}

export function usePriceList() {
  return useQuery<PriceListEntry[]>({ queryKey: ["priceList"], queryFn: fetchPriceList });
}

export function useUpdatePriceEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemType,
      unit,
      unitPrice,
    }: {
      itemType: ItemType;
      unit: "m2" | "adet";
      unitPrice: number;
    }) => {
      const { error } = await supabase
        .from("price_list")
        .upsert({ item_type: itemType, unit, unit_price: unitPrice }, { onConflict: "company_id,item_type" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["priceList"] });
    },
  });
}
