import { Entity as mcEntity, Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CreateObject, Entity, EntityData, npcFile, Terra, YuriConst } from "../../module";

interface Yuri {
  source: mcEntity;
  ent: Entity;
}

class Yuri {
  constructor(source: mcEntity) {
    if (!source) throw new Error("Missing source");
    if (source.typeId !== "cz:yuri") throw new Error("Source not Yuri Entity");

    this.source = source;
    this.ent = new Entity(source);
  }

  getData(): EntityData {
    const data: EntityData = this.ent.getEnt();

    return data.skins ? data : CreateObject.createNpcData(this.source, data);
  }

  ui(player: Player): void {
    const yuri: YuriConst = npcFile.yuri;
    const randomGreet: string = yuri.data.greet[Math.floor(Math.random() * yuri.data.greet.length)];

    const sp = Terra.getSpecialistCache(player);

    const direction = {
      x: player.location.x - this.source.location.x,
      y: player.location.y - this.source.location.y,
      z: player.location.z - this.source.location.z,
    };
    const length = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
    if (length > 0) {
      direction.x /= length;
      direction.y /= length;
      direction.z /= length;
    }
    const location = {
      x: this.source.location.x + direction.x * 2,
      y: this.source.location.y + direction.y * 2 + 1.34,
      z: this.source.location.z + direction.z * 2,
    };

    sp.setCameraToEntity(location, this.source);

    new ActionFormData()
      .title(`cz:yuri_menu${String(this.source.getComponent("variant")?.value || 0)}`)
      .body({ text: randomGreet })

      .button({ translate: "yuri.action" })
      .button({ translate: "yuri.talking" })
      .button({ translate: "yuri.gift" })

      .show(player)
      .then((e) => {
        if (e.canceled) return sp.clearCamera();

        switch (e.selection) {
          case 0:
            this.actionUi(player);
            break;
          default: {
            sp.clearCamera();
          }
        }
      });
  }

  actionUi(player: Player): void {
    new ActionFormData()
      .title(`cz:yuri_menu${this.source.getComponent("variant")?.value || 0}`)
      .body({ translate: "yuri.action.body" })
      .button({ translate: "yuri.move" })
      .button({ translate: "yuri.changeSkin" })
      .button({ translate: "yuri.scale" })
      .show(player)
      .then((e) => {
        if (e.canceled) return Terra.getSpecialistCache(player).clearCamera();

        switch (e.selection) {
          case 1:
            this.skinUi(player);
            break;
          case 2:
            this.scaleUi(player);
            break;
          default: {
            Terra.getSpecialistCache(player).clearCamera();
          }
        }
      });
  }

  scaleUi(player: Player): void {
    new ActionFormData()
      .title(`cz:yuri_scale`)
      .body({ translate: "yuri.ask.scale" })
      .button({ translate: "yuri.scale.l" })
      .button({ translate: "yuri.scale.n" })
      .button({ translate: "yuri.scale.p" })

      .show(player)
      .then((e) => {
        if (e.canceled) return Terra.getSpecialistCache(player).clearCamera();

        const scaleEvents: string[] = ["cz:size_loli", "cz:size_n", "cz:size_p"];
        const scaleEvent =
          typeof e.selection === "number" && e.selection >= 0 && e.selection < scaleEvents.length
            ? scaleEvents[e.selection]
            : undefined;

        if (!scaleEvent) return Terra.getSpecialistCache(player).clearCamera();
        this.source.triggerEvent(scaleEvent);
        Terra.getSpecialistCache(player).clearCamera();
      });
  }

  skinUi(player: Player): void {
    new ActionFormData()
      .title(`cz:skins`)
      .body({ translate: "yuri.ask.skin" })
      .button({ translate: "yuri.skin.normal" }, "textures/cz/art/yuri/preview/normal.png")
      .button({ translate: "yuri.skin.combat" }, "textures/cz/art/yuri/preview/combat.png")
      .button({ translate: "yuri.skin.cheerleader" }, "textures/cz/art/yuri/preview/cheerleader.png")

      .show(player)
      .then((e) => {
        if (e.canceled) return Terra.getSpecialistCache(player).clearCamera();

        const skinsEvents: string[] = [
          "cz:change_to_normal_skin",
          "cz:change_to_combat_skin",
          "cz:change_to_cheerleader_skin",
        ];
        const skinEvent =
          typeof e.selection === "number" && e.selection >= 0 && e.selection < skinsEvents.length
            ? skinsEvents[e.selection]
            : undefined;

        if (!skinEvent) return Terra.getSpecialistCache(player).clearCamera();
        this.source.triggerEvent(skinEvent);
        Terra.getSpecialistCache(player).clearCamera();
      });
  }
}

export { Yuri };
