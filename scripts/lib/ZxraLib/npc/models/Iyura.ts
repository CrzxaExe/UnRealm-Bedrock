import { Entity as mcEntity, Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Entity } from "../../module";

interface Iyura {
  source: mcEntity;
  ent: Entity;
}

class Iyura {
  // constructor(source: mcEntity) {
  //   if (!source) throw new Error("Missing source");
  //   if (source.typeId !== "cz:yuri") throw new Error("Source not Yuri Entity");

  //   this.source = source;
  //   this.ent = new Entity(source);
  // }

  ui(player: Player): void {
    const variant = 0;

    new ActionFormData()
      .title(`cz:iyura_menu${String(variant ?? 0)}`)
      .body({ text: "test" })

      .button({ translate: "iyura.action" })
      .button({ translate: "iyura.talking" })
      .button({ translate: "iyura.gift" })

      .show(player);
  }
}

export { Iyura };
