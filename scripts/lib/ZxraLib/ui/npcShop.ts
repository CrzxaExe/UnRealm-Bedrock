import { Player } from "@minecraft/server";
import { NpcShopItems, Terra } from "../module";
import { ActionFormData } from "@minecraft/server-ui";

class NpcShopPanel {
  tables: NpcShopItems[] = [];
  name: string;

  constructor(tables: NpcShopItems[], name: string) {
    this.tables = tables;
    this.name = name;
  }

  home(player: Player): void {
    new ActionFormData()
      .title("cz:npc_shop_" + this.name)
      .body({ translate: "npc." + this.name })
      .button({ translate: "system.npc.buy" })
      .button({ translate: "system.npc.sell" })
      .show(player)
      .then((e) => {
        if (e.canceled) {
          Terra.getSpecialistCache(player).clearCamera();
          return;
        }

        console.warn(JSON.stringify(this.tables));
        const selection = [this.buyPanel, this.sellPanel];
      });
  }

  buyPanel(player: Player): void {
    const ui = new ActionFormData().title("cz:npc_shop_").body({ translate: "npc.sell.body" });

    this.tables.forEach((e) => {
      ui.button({ text: "" + e.price }, e.texture);
    });

    ui.show(player).then((e) => {
      console.warn("tets");
    });
  }
  sellPanel(player: Player): void {}
}

class NpcShop {
  static farmer: NpcShopPanel;
}

export { NpcShopPanel, NpcShop };
