import { Entity as mcEntity, Player, system } from "@minecraft/server";
import { Entity, SkillLib, Specialist, SpecialistWeapon, SpecialistWeaponPlayer, Terra } from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

// Weapon List
class CervantWeapon {
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

  static skill2Pasif(
    sp: Specialist,
    weapon: SpecialistWeaponPlayer = sp.getSp().weapons.find((e) => e.weapon === "cervant") ?? weaponRaw.legend.cervant
  ): number {
    return (
      weaponData.legend.cervant.skillLvl[1]![weapon.skillLvl[1]!].find((e) => e.name === "sharped_damage_multiplier")
        ?.value ?? 2.5
    );
  }

  static skill1(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "cervant") || weaponRaw.legend.cervant,
      skill = weaponData.legend.cervant.skillLvl[0][data.skillLvl[0]];

    if (!sp.cooldown.canSkill("cervant_skill1", skill.find((e) => e.name === "cooldown")!.value || 3.5)) return;
    sp.minStamina(skill.find((e) => e.name === "stamina")!.value || 20);

    // Sharped state
    if (sp.status.hasStatus({ name: "cervant_sharped" })) {
      sp.playAnim("animation.weapon.slice.up");

      const damage = skill.find((e) => e.name === "sharped_atk_percentage")?.value ?? 2.0;

      system.runTimeout(() => {
        const target = sp.getFirstEntityFromDistance(3);

        if (!target) return;

        const ent = Terra.getEntityCache(target.entity);
        ent.addDamage(data.atk + this.pasif(ent, sp) * damage * this.skill2Pasif(sp, data) * (multiplier ?? 1), {
          cause: "entityAttack",
          damagingEntity: user,
          isSkill: true,
          rune: sp.rune.getRuneStat(),
        });
      }, 8);

      return;
    }

    sp.playAnim("animation.weapon.crushing.front");

    const target = sp.getEntityFromDistanceCone(3.5, 90).map((e) => Terra.getEntityCache(e));
    const damage = skill.find((e) => e.name === "normal_atk_percentage")?.value ?? 2.0;
    const shockwave = skill.find((e) => e.name === "shockwave_atk_percentage")?.value ?? 1.0;

    system.runTimeout(() => {
      target.forEach((e) => {
        e.addDamage((data.atk + this.pasif(e, sp)) * damage * (multiplier ?? 1), {
          cause: "entityAttack",
          damagingEntity: user,
          isSkill: true,
          rune: sp.rune.getRuneStat(),
        });
      });

      system.runTimeout(() => {
        target.forEach((e) => {
          e.addDamage((data.atk + this.pasif(e, sp)) * shockwave * (multiplier ?? 1), {
            cause: "entityAttack",
            damagingEntity: user,
            isSkill: true,
            rune: sp.rune.getRuneStat(),
          });
        });
      }, 4);
    }, 9);
  }

  static skill2(_: Player, { sp }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "cervant") || weaponRaw.legend.cervant,
      skill = weaponData.legend.cervant.skillLvl[1]![data.skillLvl[1]!];

    if (!sp.cooldown.canSkill("cervant_skill2", skill.find((e) => e.name === "cooldown")!.value || 3)) return;
    sp.minStamina(skill.find((e) => e.name === "stamina")!.value || 24);

    if (sp.status.hasStatus({ name: "cervant_sharped" })) {
      sp.status.addStatus("cervant_sharped", 1, {
        decay: "none",
        lvl: 1,
        stack: false,
        type: "state",
      });

      return;
    }

    sp.status.removeStatus("cervant_sharped");
  }
}

class LighterWeapon {
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

  static skill1(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "lighter") || weaponRaw.legend.lighter,
      skill = weaponData.legend.lighter.skillLvl[0][data.skillLvl[0]];

    if (!sp.cooldown.canSkill("lighter_skill1", skill.find((e) => e.name === "cooldown")!.value || 5.5)) return;
    sp.minStamina(skill.find((e) => e.name === "stamina")!.value || 14);

    sp.playAnim("animation.weapon.swing.delay");

    system.runTimeout(() => {
      sp.bind(0.35);

      const target = sp.getFirstEntityFromDistance(4);

      if (!target) return;
      if (target.distance > 3) target.entity.setOnFire(5);

      this.pasif(
        target.entity,
        user,
        data.atk * (skill.find((e) => e.name === "atk_percentage")?.value ?? 1.8),
        multiplier,
        data
      );
    }, 14);
  }

  static skill2(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "lighter") || weaponRaw.legend.lighter,
      skill = weaponData.legend.lighter.skillLvl[1]![data.skillLvl[1]!];

    if (!sp.cooldown.canSkill("lighter_skill2", skill.find((e) => e.name === "cooldown")!.value || 15)) return;
    sp.minStamina(skill.find((e) => e.name === "stamina")!.value || 26);

    sp.playAnim("animation.weapon.crushing.down");

    sp.bind(0.8);
    system.runTimeout(() => {
      sp.getEntityWithinRadius(4.5).forEach((e) => {
        this.pasif(
          e,
          user,
          data.atk * (skill.find((r) => r.name === "atk_percentage")?.value ?? 2.8),
          multiplier,
          data
        );
      });
    }, 12);
  }
}

// Legend Weapon Controllers
class LegendWeapon {
  static Cervant = CervantWeapon;
  static Lighter = LighterWeapon;
}
export { LegendWeapon };
