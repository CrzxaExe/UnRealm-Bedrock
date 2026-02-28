import { Currency } from "../module";

type NPC = {
  data: NpcData;
  models: NpcModels;
};
type NpcConst = {
  npc?: YuriConst;
};

type NpcModels = YuriModels;
type NpcData = YuriData;

type YuriConst = {
  data: YuriData;
  models: YuriModels;
};
interface YuriData {
  greet: string[];
}
type YuriModels = {
  skins?: [];
  components?: [];
};

// Shop Npc
type NpcShopItems = {
  item: string;
  display: string;
  texture: string;
  price: {
    buy: number;
    sell: number;
  };
  currency: Currency;
};
export { NPC, NpcConst, NpcData, NpcModels, NpcShopItems, YuriConst, YuriData, YuriModels };
