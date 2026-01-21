import { Entity as mcEntity, Player } from "@minecraft/server";
import { SpecialistWeaponPlayer, Terra } from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

class Lighter {
  static pasif(
    target: mcEntity,
    user: Player,
    damage: number = 0,
    multiplier: number = 1,
    weapon: SpecialistWeaponPlayer = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "lighter") ??
      weaponRaw.legend.lighter
  ): void {
    if (!target || damage < 0 || multiplier < 0) return;

    let mut: number = multiplier;
    const onfire = !!target.getComponent("onfire");
    const pasif =
      weaponData.legend.lighter.pasifLvl[0]![weapon.pasifLvl[0]!].find((e) => e.name === "atk_percentage")!.value ??
      2.5;

    if (!onfire) mut += pasif;

    Terra.getEntityCache(target).addDamage(onfire ? damage * mut : damage * multiplier, {
      cause: onfire ? "fire" : "entityAttack",
      damagingEntity: user,
      isSkill: false,
      rune: Terra.getSpecialistCache(user).rune.getRuneStat(),
    });
  }
}

export { Lighter };
