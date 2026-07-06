import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { ItemTypeEntry } from "@/types/domain";

async function fetchItemTypes(): Promise<ItemTypeEntry[]> {
  const { data, error } = await supabase.from("item_types").select("*").order("label", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    companyId: row.company_id,
    label: row.label,
    unit: row.unit,
  }));
}

export function useItemTypes() {
  return useQuery<ItemTypeEntry[]>({ queryKey: ["itemTypes"], queryFn: fetchItemTypes });
}

export function useCreateItemType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ label, unit }: { label: string; unit: "m2" | "adet" }) => {
      const { error } = await supabase.from("item_types").insert({ label: label.trim(), unit });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemTypes"] });
    },
  });
}
