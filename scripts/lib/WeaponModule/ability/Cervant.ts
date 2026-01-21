import { Entity, Specialist, SpecialistWeapon, SpecialistWeaponPlayer } from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

class Cervant {
  static pasif(
    target: Entity,
    sp: Specialist,
    wpnData: SpecialistWeaponPlayer = sp.getSp().weapons.find((e) => e.weapon === "cervant") ?? weaponRaw.legend.cervant
  ): number {
    const data: number = target.status.getStatus({ name: "sharp_slice" })[0].lvl ?? 0;

    const weapon: SpecialistWeapon = weaponData.legend.cervant!;
    const pasif = weapon.pasifLvl[0][wpnData.pasifLvl[0]].find((e) => e.name === "atk_up")!.value ?? 1;

    return pasif * data;
  }
}

export { Cervant };
