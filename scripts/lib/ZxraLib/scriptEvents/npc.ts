import { Player } from "@minecraft/server";
import { Iyura, NpcShop, Script, ScriptParams, Yuri } from "../module";

Script.add("iyura_menu", ({ initiator, sourceEntity }: ScriptParams) => {
  if (!initiator || !sourceEntity) return;
  new Iyura().ui(sourceEntity as Player); // not complete
});

Script.add("yuri_menu", ({ initiator, sourceEntity }: ScriptParams) => {
  if (!initiator || !sourceEntity) return;
  new Yuri(initiator).ui(sourceEntity as Player);
});

Script.add("npc_shop_farmer", ({ initiator, sourceEntity }: ScriptParams) => {
  NpcShop.farmer.home(sourceEntity as Player);
});
