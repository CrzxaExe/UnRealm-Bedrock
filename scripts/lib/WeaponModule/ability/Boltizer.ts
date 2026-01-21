import { Entity as mcEntity, MolangVariableMap, Player, system } from "@minecraft/server";
import { Calc, CreateObject, SkillLib, SpecialistWeaponPlayer, Terra } from "../../ZxraLib/module";
import { weaponData, weaponRaw } from "../module";

class Boltizer {
  static pasif1(
    user: Player,
    target: mcEntity,
    state: "skill" | "attack",
    multiplier: number = 1,
    weapon: SpecialistWeaponPlayer = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "boltizer") ??
      weaponRaw.unique.boltizer
  ): void {
    const pasif = weaponData.unique.boltizer.pasifLvl[0][weapon.pasifLvl[0]]?.find(
      (e) => e.name === "lightning_damage"
    );

    switch (state) {
      case "skill":
        if (!target.hasTag("boltizer_attack")) {
          target.addTag("boltizer_skill");
          return;
        }

        target.dimension.spawnEntity("minecraft:lightning_bolt", target.location);
        target.removeTag("boltizer_attack");
        Terra.getEntityCache(target).addDamage(weapon.atk * (pasif?.value ?? 1.5) * multiplier);
        break;

      case "attack":
        if (!target.hasTag("boltizer_skill")) {
          target.addTag("boltizer_attack");
          return;
        }

        target.dimension.spawnEntity("minecraft:lightning_bolt", target.location);
        target.removeTag("boltizer_skill");
        Terra.getEntityCache(target).addDamage(weapon.atk * (pasif?.value ?? 1.5) * multiplier, {
          cause: "lightning",
          damagingEntity: user,
          rune: Terra.getSpecialistCache(user).rune.getRuneStat(),
          isSkill: true,
        });
        break;
    }
  }

  static pasif2(
    user: Player,
    target: mcEntity[],
    damage: number = 1,
    weapon: SpecialistWeaponPlayer = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "boltizer") ??
      weaponRaw.unique.boltizer,
    multiplier: number = 1,
    state: "skill" | "attack" = "attack"
  ): void {
    let count: number = 0;

    target.forEach((e: mcEntity) => {
      const nextEntity: mcEntity | undefined = target[count + 1];

      const ent = Terra.getEntityCache(e);
      this.pasif1(user, e, state, multiplier, weapon);

      if (nextEntity) {
        const molang = new MolangVariableMap();

        molang.setVector3("variable.direction", {
          x: nextEntity.location.x - e.location.x,
          y: nextEntity.location.y - e.location.y,
          z: nextEntity.location.z - e.location.z,
        });
        molang.setFloat("variable.initial_speed", Calc.distance3(e.location, nextEntity.location) * 7);
        molang.setFloat("variable.max_age", Calc.distance3(e.location, nextEntity.location) * 0.072);

        ent.particles({ location: { ...e.location, y: e.location.y + 1 }, particle: "cz:bolt", molang });
        ent.particles({
          location: { ...nextEntity.location, y: nextEntity.location.y + 1 },
          particle: "minecraft:critical_hit_emitter",
          molang: undefined,
        });
      }

      system.runTimeout(() => {
        ent.addDamage(
          weapon.atk *
            (1 -
              count *
                (weaponData.unique.boltizer.pasifLvl[1]![weapon.pasifLvl[0]]?.find((e) => e.name === "chain_penalty")!
                  .value ?? 0.3)),
          {
            cause: "lightning",
            damagingEntity: user,
            isSkill: false,
          }
        );
      }, 5);
      count++;
    });
  }

  static skill1(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "boltizer") || weaponRaw.unique.boltizer,
      skill = weaponData.unique.boltizer.skillLvl[0][data.skillLvl[0]];

    if (!sp.cooldown.canSkill("boltizer_skill1", skill.find((e) => e.name === "cooldown")!.value || 5)) return;
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value || 14);
    sp.playAnim("animation.weapon.boltizer.skill1");

    sp.bind(1.67);
    system.runTimeout(() => {
      sp.knockback(CreateObject.createVelocityPlayer(user), 0.6);

      let target = sp.getEntityFromDistance(5)[0];

      if (!target) return;
      let ent = Terra.getEntityCache(target.entity);

      ent.addDamage(data.atk * (skill.find((r) => r.name === "atk_percentage")?.value || 1.8) * (multiplier || 1), {
        cause: "lightning",
        damagingEntity: user,
        isSkill: true,
      });
      this.pasif1(user, target.entity, "skill", multiplier, data);
    }, 5);
  }

  static skill3(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "boltizer") || weaponRaw.unique.boltizer,
      skill = weaponData.unique.boltizer.skillLvl[2]![data.skillLvl[2]!];

    const target = sp.getEntityFromDistance(10)[0];
    if (!target) {
      user.onScreenDisplay.setActionBar({ translate: "skill.noTarget" });
      return;
    }
    if (!sp.cooldown.canSkill("boltizer_skill3", skill.find((e) => e.name === "cooldown")!.value || 20)) return;
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value || 26);

    sp.playAnim("animation.weapon.boltizer.skill3");
    let loc = { ...target.entity.location };

    sp.bind(1.91);
    sp.knockback(user.getVelocity(), 0, 0.2);
    user.triggerEvent("cz:ghost");

    system.runTimeout(() => {
      for (let i = 0; i < 3; i++) {
        system.runTimeout(
          () => {
            user.dimension.spawnEntity("minecraft:lightning_bolt", loc);

            if (!target.entity) return;
            this.pasif2(
              user,
              Terra.getEntityCache(target.entity).getChainedEntityFromDistance(5, 3, [user.id]),
              skill.find((e) => e.name === "atk_percentage")?.value ?? 2.2,
              data,
              multiplier,
              "skill"
            );
          },
          i + 6 * i
        );
      }
      user.triggerEvent("cz:no_ghost");
    }, 23);
  }
}

export { Boltizer };
