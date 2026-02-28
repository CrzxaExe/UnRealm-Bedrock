import { Entity as mcEntity, Player, system } from "@minecraft/server";
import {
  CreateObject,
  NOT_VALID_ENTITY,
  SkillLib,
  Specialist,
  SpecialistWeaponPlayer,
  Terra,
} from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

class BringerWeapon {
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

class CenryterWeapon {
  static pasif(
    user: Player,
    weapon: SpecialistWeaponPlayer = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "cenryter") ??
      weaponRaw.epic.cenryter
  ): number {
    return (
      weaponData.epic.cenryter.pasifLvl[0]![weapon.pasifLvl[0]]!.find((e) => e.name === "heal_multiplier")!.value ?? 3
    );
  }
}

class UndyingWeapon {
  static pasif(
    user: Player,
    target: mcEntity,
    weapon: SpecialistWeaponPlayer = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "undying") ??
      weaponRaw.epic.undying
  ): void {
    if (NOT_VALID_ENTITY.includes(target.typeId)) return;

    const duration: number =
      weaponData.epic.undying.pasifLvl[0]![weapon.pasifLvl[0]!].find((e) => e.name === "buff_duration")?.value ?? 10;
    const amplifier: number =
      weaponData.epic.undying.pasifLvl[0]![weapon.pasifLvl[0]!].find((e) => e.name === "buff_amplifier")?.value ?? 30;

    const sp = Terra.getSpecialistCache(user);
    sp.status.addStatus("return_into_self", duration, {
      decay: "time",
      lvl: amplifier,
      stack: false,
      type: "attack",
    });

    sp.cooldown
      .getData()
      .filter((e) => e.name.startsWith("undying_"))
      .forEach((e) => sp.cooldown.remCd(e.name));
  }

  static skill1(user: Player, { sp, multiplier, vel, velocity }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "undying") || weaponRaw.epic.undying,
      skill = weaponData.epic.undying.skillLvl[0][data.skillLvl[0]];

    if (!sp.cooldown.canSkill("undying_skill1", skill.find((e) => e.name === "cooldown")!.value || 8)) return;

    sp.playAnim("animation.weapon.undying.skill1");
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value || 12);

    sp.bind(1.24);

    system.runTimeout(() => {
      const target = sp.getFirstEntityFromDistance(5);

      if (target)
        Terra.getEntityCache(target.entity).addDamage(
          data.atk * (skill.find((e) => e.name === "atk_percentage")?.value ?? 2) * (multiplier ?? 1),
          {
            cause: "magic",
            damagingEntity: user,
            rune: sp.rune.getRuneStat(),
            isSkill: true,
          }
        );

      sp.knockback(velocity ?? vel ?? user.getVelocity(), target?.distance ?? 1.5, 0);
    }, 10);
  }

  static skill2(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "undying") || weaponRaw.epic.undying,
      skill = weaponData.epic.undying.skillLvl[1]![data.skillLvl[1]!];

    if (!sp.cooldown.canSkill("undying_skill2", skill.find((e) => e.name === "cooldown")!.value || 14)) return;
    sp.playAnim("animation.weapon.undying.skill2");
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value ?? 20);

    system.runTimeout(() => {
      sp.bind(0.4);

      sp.getEntityFromDistanceCone(3.5, 150).forEach((e) => {
        Terra.getEntityCache(e).addDamage(
          data.atk * (skill.find((e) => e.name === "atk_percentage")?.value ?? 1.7) * (multiplier ?? 1),
          {
            cause: "magic",
            damagingEntity: user,
            rune: sp.rune.getRuneStat(),
            isSkill: true,
          }
        );
      });
    }, 16);
  }

  static skill3(user: Player, { sp, multiplier, vel, velocity }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "undying") || weaponRaw.epic.undying,
      skill = weaponData.epic.undying.skillLvl[2]![data.skillLvl[2]!];

    if (!sp.cooldown.canSkill("undying_skill3", skill.find((e) => e.name === "cooldown")!.value || 25)) return;

    sp.playAnim("animation.weapon.undying.skill3");
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value ?? 24);

    sp.bind(1);

    const location = sp.getFirstEntityFromDistance(7)?.entity.location ?? sp.getLocationInFront(7);
    user.triggerEvent("cz:ghost");
    user.teleport({ ...location, y: location.y + 8 });

    system.runTimeout(() => {
      user.triggerEvent("cz:no_fall_5s");
      sp.knockback(velocity ?? vel ?? user.getVelocity(), 0, -12);
      user.triggerEvent("cz:no_ghost");

      system.runTimeout(() => {
        sp.getEntityWithinRadius(5).forEach((e) => {
          Terra.getEntityCache(e).addDamage(
            data.atk * (skill.find((e) => e.name === "atk_percentage")?.value ?? 3.5) * (multiplier ?? 1),
            {
              cause: "magic",
              damagingEntity: user,
              rune: sp.rune.getRuneStat(),
              isSkill: true,
            },
            { vel: CreateObject.createVelocityPlayer(e as Player) ?? user.getVelocity(), hor: 0.35, ver: -0.8 }
          );
        });
      }, 3);
    }, 10);
  }
}

class EpicWeapon {
  static Bringer = BringerWeapon;
  static Cenryter = CenryterWeapon;
  static Undying = UndyingWeapon;
}

export { EpicWeapon };
