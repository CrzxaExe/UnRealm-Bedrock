import { Player, system, Entity as mcEntity } from "@minecraft/server";
import { SkillLib, Terra } from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

class Mudrock {
  static skill1(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "mudrock") || weaponRaw.unique.mudrock,
      skill = weaponData.unique.mudrock.skillLvl[0][data.skillLvl[0]];

    if (!sp.cooldown.canSkill("mudrock_skill1", skill.find((e) => e.name === "cooldown")!.value || 3.5)) return;
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value || 16);
    sp.playAnim("animation.weapon.mudrock.swing");

    system.runTimeout(() => {
      sp.bind(1);
      sp.getEntityWithinRadius(4).forEach((e: mcEntity) => {
        Terra.getEntityCache(e).addDamage(
          data.atk * (skill.find((r) => r.name === "atk_percentage")?.value ?? 2.1) * (multiplier || 1),
          {
            cause: "entityAttack",
            damagingEntity: user,
            isSkill: true,
            rune: sp.rune.getRuneStat(),
          }
        );
      });
    }, 18);
  }

  static skill3(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "mudrock") || weaponRaw.unique.mudrock,
      skill = weaponData.unique.mudrock.skillLvl[2]![data.skillLvl[2]!];

    if (sp.cooldown.hasCd("on_skill") || sp.cooldown.hasCd("mudrock_skill3")) return;
    sp.cooldown.setIsSkill(5);
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value || 24);
    sp.playAnim("animation.weapon.mudrock.special");

    sp.bind(5);

    system.runTimeout(() => {
      sp.cooldown.addCd("mudrock_skill3", skill.find((e) => e.name === "cooldown")!.value || 20);

      sp.getEntityWithinRadius(6).forEach((e: mcEntity) => {
        Terra.getEntityCache(e).addDamage(
          data.atk * (skill.find((r) => r.name === "atk_percentage")?.value ?? 3) * (multiplier ?? 1),
          { cause: "entityAttack", damagingEntity: user, isSkill: true, rune: sp.rune.getRuneStat() }
        );
      });
    }, 100);
  }
}

export { Mudrock };
