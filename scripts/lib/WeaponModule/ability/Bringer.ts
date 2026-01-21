import { Player } from "@minecraft/server";
import { Specialist, SpecialistWeaponPlayer, Terra } from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

class Bringer {
  static pasif(
    user: Player,
    sp: Specialist,
    weapon: SpecialistWeaponPlayer = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "bringer") ??
      weaponRaw.epic.bringer
  ): void {
    const pasif =
      weaponData.epic.bringer.pasifLvl[0]![weapon.pasifLvl[0]!].find((e) => e.name === "heal")!.value ?? 0.2;
    const hp = user.getComponent("health");

    sp.heal((hp?.effectiveMax || 20) * pasif);
  }
}

export { Bringer };
