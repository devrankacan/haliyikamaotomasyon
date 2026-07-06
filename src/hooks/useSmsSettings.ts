import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { SmsProvider, SmsProviderSettings } from "@/types/domain";

async function fetchSmsSettings(): Promise<SmsProviderSettings | null> {
  const { data, error } = await supabase.from("sms_provider_settings").select("*").maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    companyId: data.company_id,
    provider: data.provider,
    apiKey: data.api_key,
    apiSecret: data.api_secret,
    senderId: data.sender_id,
  };
}

export function useSmsSettings() {
  return useQuery<SmsProviderSettings | null>({ queryKey: ["smsSettings"], queryFn: fetchSmsSettings });
}

export function useUpdateSmsSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      provider,
      apiKey,
      apiSecret,
      senderId,
    }: {
      provider: SmsProvider;
      apiKey: string;
      apiSecret: string;
      senderId: string;
    }) => {
      const { error } = await supabase.from("sms_provider_settings").upsert(
        {
          provider,
          api_key: apiKey || null,
          api_secret: apiSecret || null,
          sender_id: senderId || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "company_id" }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smsSettings"] });
    },
  });
}
