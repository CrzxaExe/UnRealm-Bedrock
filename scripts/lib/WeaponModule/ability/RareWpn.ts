import { Player, system } from "@minecraft/server";
import { CreateObject, SkillLib, Terra } from "../../ZxraLib/module";

class RareWeapon {
  static greatswordSkill(user: Player, { sp, multiplier }: SkillLib): void {
    if (sp.cooldown.canSkill("greatsword_skill", 10)) return;
    sp.minStamina(16);
    sp.bind(1.2);

    sp.playAnim("animation.weapon.swing.great");

    let damage = 22;
    if (sp.cooldown.hasCd("greatsword_crit")) damage *= 1.5;

    system.runTimeout(() => {
      sp.getEntityFromDistanceCone(5, 60).forEach((e) => {
        Terra.getEntityCache(e).addDamage(damage * (multiplier ?? 1), {
          cause: "entityAttack",
          damagingEntity: user,
          rune: sp.rune.getRuneStat(),
          isSkill: true,
        });
      });
    });
  }

  static hammerSkill(user: Player, { sp, multiplier }: SkillLib): void {
    if (sp.cooldown.canSkill("hammer_skill", 5.5)) return;
    sp.minStamina(12);

    sp.playAnim("animation.weapon.crushing");

    system.runTimeout(() => {
      sp.getEntityWithinRadius(4).forEach((e) => {
        Terra.getEntityCache(e).addDamage(14 * (multiplier ?? 1), {
          cause: "entityAttack",
          damagingEntity: user,
          rune: sp.rune.getRuneStat(),
          isSkill: true,
        });
      });
    }, 2);
  }

  static katanaSkill(user: Player, { sp, multiplier }: SkillLib): void {
    if (sp.cooldown.canSkill("katana_skill", 3.5)) return;
    sp.minStamina(7);

    sp.playAnim("animation.weapon.slice.up");

    system.runTimeout(() => {
      sp.getEntityFromDistance(5).forEach((e) => {
        const ent = Terra.getEntityCache(e.entity);

        ent.addDamage(14 * (multiplier ?? 1), {
          cause: "entityAttack",
          damagingEntity: user,
          rune: sp.rune.getRuneStat(),
          isSkill: true,
        });
        ent.addEffect({ name: "weakness", amplifier: 1, duration: 1, showParticles: true });
      });
    }, 3);
  }

  static reaperSkill(user: Player, { sp, multiplier }: SkillLib): void {
    if (sp.cooldown.canSkill("reaper_skill", 6)) return;
    sp.minStamina(8);
    sp.bind(0.4);

    sp.playAnim("animation.weapon.slice.right");

    system.runTimeout(() => {
      sp.getEntityFromDistanceCone(6, 60).forEach((e) => {
        Terra.getEntityCache(e).addDamage(9 * (multiplier ?? 1), {
          cause: "entityAttack",
          damagingEntity: user,
          rune: sp.rune.getRuneStat(),
          isSkill: true,
        });
      });
    }, 3);
  }

  static spearSkill(user: Player, { sp, multiplier }: SkillLib): void {
    if (sp.cooldown.canSkill("spear_skill", 4.5)) return;
    sp.minStamina(6);

    sp.playAnim("animation.weapon.dash.atk");

    system.runTimeout(() => {
      const target = sp.getFirstEntityFromDistance(5);
      sp.knockback(CreateObject.createVelocityPlayer(user), 1.2, 0);

      if (!target?.entity) return;
      Terra.getEntityCache(target.entity).addDamage(7 * target.distance * (multiplier ?? 1), {
        cause: "entityAttack",
        damagingEntity: user,
        rune: sp.rune.getRuneStat(),
        isSkill: true,
      });
    }, 6);
  }
}

export { RareWeapon };
