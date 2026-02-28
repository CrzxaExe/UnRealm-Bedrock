import { Entity as mcEntity, Player } from "@minecraft/server";
import { Calc, RuneStats, Specialist, Terra } from "../../ZxraLib/module";

class WeaponTrait {
  static century(
    target: mcEntity,
    user: Specialist,
    baseAtk: number,
    rune: RuneStats,
    radius: number = 1.5,
    multiplier: number = 1,
    isSkill: boolean = false
  ): void {
    [...Terra.getEntityCache(target).getEntityWithinRadius(radius), target].forEach((e) => {
      Terra.getEntityCache(e).addDamage(baseAtk * multiplier, {
        cause: "entityAttack",
        damagingEntity: user.source,
        rune,
        isSkill,
      });
    });
  }

  static greatsword(
    target: mcEntity,
    user: Specialist,
    baseAtk: number,
    rune: RuneStats,
    multiplier: number = 1,
    isSkill: boolean = false
  ): void {
    if (user.cooldown.canSkill("greatsword_crit", 3)) return;

    Terra.getEntityCache(target).addDamage(baseAtk * multiplier, {
      cause: "entityAttack",
      damagingEntity: user.source as mcEntity,
      rune,
      isSkill,
    });

    user.cooldown.addCd("greatsword_crit", 3);
  }

  static hammer(
    target: mcEntity,
    user: Player,
    baseAtk: number,
    rune: RuneStats,
    multiplier: number = 1,
    isSkill: boolean = false
  ): void {
    const hp = target.getComponent("health")?.effectiveMax ?? 0;
    const atk = hp * 0.2 > baseAtk * 2 ? hp * 0.2 : baseAtk * 2;

    Terra.getEntityCache(target).addDamage(atk * multiplier, {
      cause: "entityAttack",
      damagingEntity: user,
      rune,
      isSkill,
    });
  }

  static katana(
    target: mcEntity,
    user: Player,
    atk: number,
    rune: RuneStats,
    multiplier: number = 1,
    isSkill: boolean = false
  ): void {
    const ent = Terra.getEntityCache(target);

    if (!ent.hasDebuffEffect() || target.isOnGround) return;

    ent.addDamage(atk * 1.5 * multiplier, {
      cause: "entityAttack",
      damagingEntity: user,
      rune,
      isSkill,
    });
  }

  static reaper(sp: Specialist, callback: Function): void {
    const area = sp.getEntityFromDistanceCone(4);

    const rune = sp.rune.getRuneStat();

    area.forEach((e: mcEntity) => {
      try {
        callback?.(e, (finalHealAmount: number): void => {
          sp.heal(finalHealAmount * (rune.healingEffectivity || 1));
        });
      } catch (error: { message: string } | any) {
        console.warn("[System] Error on trait Reaper: " + error.message);
      }
    });
  }

  static slayerLostHPPercentation(player: Player): number {
    const hp = player.getComponent("health");
    if (!hp) return 0;

    return Calc.hpLostPercentage(hp) * 1.3 + 1;
  }

  static spear(
    target: mcEntity,
    user: mcEntity,
    damage: number,
    rune: RuneStats,
    multiplier: number,
    isSkill: boolean = false
  ): void {
    Terra.getEntityCache(target).addDamage(damage * multiplier * Calc.distance(target.location, user.location), {
      cause: "entityAttack",
      rune,
      damagingEntity: user,
      isSkill,
    });
  }

  static vitalist(user: Player, nearby: Player[], damage: number = 0): void {
    const heal = Math.round(damage / 2);

    const target = [user, ...nearby];
    const teammate = Terra.guild.getTeammate(user);

    const priority = target
      .filter((e: Player) => {
        const hp = e.getComponent("health");
        if (!hp || hp.currentValue >= (hp?.effectiveMax ?? 20)) return false;

        if (!teammate.includes(e.name)) return false;
        return true;
      })
      .sort(
        (a: Player, b: Player) =>
          (b.getComponent("health")?.currentValue ?? 20) - (a.getComponent("health")?.currentValue ?? 20)
      );

    Terra.getEntityCache(priority[0]).heal(heal);
  }
}

export { WeaponTrait };
