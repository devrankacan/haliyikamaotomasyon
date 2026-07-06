import type { ItemType } from "@/types/domain";

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  hali: "Halı",
  kilim: "Kilim",
  koltuk: "Koltuk",
  perde: "Perde",
  diger: "Diğer",
};

export const ITEM_TYPE_DEFAULT_UNIT: Record<ItemType, "m2" | "adet"> = {
  hali: "m2",
  kilim: "m2",
  koltuk: "adet",
  perde: "adet",
  diger: "adet",
};
