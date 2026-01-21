import { Player, system, Entity as mcEntity, MolangVariableMap } from "@minecraft/server";
import { CreateObject, SkillLib, SpecialistWeaponPlayer, Terra } from "../../ZxraLib/module";
import { slayerLostHPPercentation, weaponData, weaponRaw } from "../module";

class Kyle {
  static pasif1(
    user: Player,
    data: SpecialistWeaponPlayer | undefined = Terra.getSpecialist(user.id)?.weapons?.find((e) => e.weapon === "kyles")
  ): number {
    const lvl = data || weaponRaw.unique.kyles;
    const weapon = weaponData.unique.kyles;

    return weapon.pasifLvl[0][lvl.pasifLvl[0]].find((e) => e.name === "zelxt_mode_multiplier")!.value;
  }

  static skill1(user: Player, { sp, vel, velocity, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      skill = weaponData.unique.kyles.skillLvl[0][data.skillLvl[0]],
      hp = user.getComponent("health");

    if (!sp.cooldown.canSkill("kyle_skill1", skill.find((e) => e.name === "cooldown")!.value || 5)) return;
    sp.playAnim("animation.weapon.kyles.skill1");

    sp.bind(1.75);
    sp.minStamina(skill.find((e) => e.name === "stamina")!.value || 8);

    system.runTimeout(() => {
      sp.knockback(velocity || vel || user.getVelocity(), 1, 0);

      const target = sp.getEntityFromDistance(4.5);

      target.forEach((e) => {
        Terra.getEntityCache(e.entity).addDamage(
          Math.round(
            data.atk * skill.find((e) => e.name === "atk_percentage")!.value +
              (hp?.effectiveMax || 20) *
                skill.find((e) => e.name === "health_percentage")!.value *
                slayerLostHPPercentation(user) *
                (multiplier || 1)
          ),
          {
            cause: "entityAttack",
            damagingEntity: user,
            rune: sp.rune.getRuneStat(),
            isSkill: true,
          }
        );
      });

      if (target.length > 0 && hp && hp.currentValue > 1) sp.consumeHp(0.4, hp, "kyle");

      const loc = sp.getLocationInFront(3.5);
      system.runTimeout(() => {
        sp.particles({
          particle: "cz:kyle_skill1",
          location: { ...loc },
          molang: new MolangVariableMap(),
        });
      }, 1);
    }, 15);
  }

  static skill1Up(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      pasif = this.pasif1(user),
      skill = weaponData.unique.kyles.skillLvl[0][data.skillLvl[0]],
      hp = user.getComponent("health");

    if (!sp.cooldown.canSkill("kyle_skill1", skill.find((e) => e.name === "zelxt_cooldown")!.value || 8)) return;
    sp.playAnim("animation.weapon.kyles.skill1.up");

    sp.bind(2.5);
    sp.minStamina(skill.find((e) => e.name === "zelxt_stamina")!.value || 12);

    system.runTimeout(() => {
      sp.knockback(CreateObject.createVelocityPlayer(user), 1.3, 0);

      system.runTimeout(() => {
        sp.knockback(CreateObject.createVelocityPlayer(user), 1.7, 0);
        sp.source.triggerEvent("cz:immune_300ms");

        const first = sp.getEntityFromDistance(5);
        first.forEach((e) => {
          if (!e.entity) return;
          Terra.getEntityCache(e.entity).addDamage(
            data.atk * skill.find((e) => e.name === "zelxt_atk_percentage")!.value +
              (hp?.effectiveMax || 20) *
                skill.find((e) => e.name === "zelxt_health_percentage")!.value *
                slayerLostHPPercentation(user) *
                pasif *
                (multiplier || 1),
            {
              cause: "void",
              damagingEntity: user,
              rune: sp.rune.getRuneStat(),
              isSkill: true,
            }
          );
        });

        const loc = sp.getLocationInFront(3.5);
        sp.particles({
          particle: "cz:kyle_skill1_zelxt",
          location: { ...loc },
          molang: new MolangVariableMap(),
        });

        system.runTimeout(() => {
          sp.knockback(CreateObject.createVelocityPlayer(user), -3.2, 0);

          system.runTimeout(() => {
            sp.knockback(CreateObject.createVelocityPlayer(user), 5, 0);
            sp.source.triggerEvent("cz:immune_300ms");

            const second = sp.getEntityFromDistance(5.9);
            second.forEach((e) => {
              if (!e.entity) return;
              Terra.getEntityCache(e.entity).addDamage(
                data.atk * skill.find((e) => e.name === "zelxt_atk_percentage")!.value +
                  (hp?.effectiveMax || 20) *
                    skill.find((e) => e.name === "zelxt_health_percentage")!.value *
                    slayerLostHPPercentation(user) *
                    pasif *
                    (multiplier || 1),
                {
                  cause: "void",
                  damagingEntity: user,
                  rune: sp.rune.getRuneStat(),
                  isSkill: true,
                }
              );
            });

            if (first.length > 0 || second.length > 0) sp.consumeHp(0.5, hp, "kyle");

            const loc = sp.getLocationInFront(3.5);
            sp.particles({
              particle: "cz:kyle_skill1_reverse_zelxt",
              location: { ...loc },
              molang: new MolangVariableMap(),
            });
          }, 14);
        }, 4);
      }, 10);
    }, 13);
  }

  static skill2(user: Player, { sp, useDuration, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      skill = weaponData.unique.kyles.skillLvl[1]![data.skillLvl[1]!],
      hp = user.getComponent("health");

    if (!sp.cooldown.canSkill("kyle_skill2", skill?.find((e) => e.name === "cooldown")!.value || 5)) return;
    sp.playAnim("animation.weapon.kyles.skill2");

    sp.bind(1.4);
    sp.minStamina(skill?.find((e) => e.name === "stamina")!.value || 14);

    system.runTimeout(() => {
      sp.source.triggerEvent("cz:immune_300ms");
      sp.knockback(CreateObject.createVelocityPlayer(user), 1 * (10 - (useDuration || 10)) + 1.3, 0);

      system.runTimeout(() => {
        const target = sp.getEntityFromDistanceCone(4, 90);

        target.forEach((e: mcEntity) => {
          Terra.getEntityCache(e).addDamage(
            data.atk * skill?.find((e) => e.name === "atk_percentage")!.value +
              (hp?.effectiveMax || 20) *
                skill?.find((e) => e.name === "zelxt_health_percentage")!.value *
                slayerLostHPPercentation(user) *
                (multiplier || 1),
            {
              cause: "entityAttack",
              damagingEntity: user,
              rune: sp.rune.getRuneStat(),
              isSkill: true,
            }
          );
        });

        if (target.length > 0) sp.consumeHp(0.5, hp, "kyle");

        const loc = sp.getLocationInFront(3.5);
        sp.particles({
          particle: "cz:kyle_skill1",
          location: { ...loc },
          molang: new MolangVariableMap(),
        });
      }, 4);
    }, 13);
  }

  static skill2Up(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      pasif = this.pasif1(user),
      skill = weaponData.unique.kyles.skillLvl[1]![data.skillLvl[1]!],
      hp = user.getComponent("health");

    const location = sp.getLocationInFront(7);
    location.y += 0.5;

    if (!sp.cooldown.canSkill("kyle_skill2", skill?.find((e) => e.name === "zelxt_cooldown")!.value || 8)) return;
    sp.playAnim("animation.weapon.kyles.skill2.up");

    sp.bind(1.3);
    sp.minStamina(skill?.find((e) => e.name === "zelxt_stamina")!.value || 12);
    sp.source.triggerEvent("cz:immune_300ms");

    sp.cooldown.setIsSkill(0.5);
    user.teleport(location, { checkForBlocks: true, rotation: user.getRotation() });

    system.runTimeout(() => {
      const target = sp.getEntityWithinRadius(3);

      target.forEach((e: mcEntity) => {
        if (!e) return;
        Terra.getEntityCache(e).addDamage(
          data.atk * skill?.find((e) => e.name === "zelxt_atk_percentage")!.value +
            (hp?.effectiveMax || 20) *
              skill?.find((e) => e.name === "zelxt_health_percentage")!.value *
              slayerLostHPPercentation(user) *
              pasif *
              (multiplier || 1),
          {
            cause: "void",
            damagingEntity: user,
            rune: sp.rune.getRuneStat(),
            isSkill: true,
          }
        );
      });

      if (target.length > 0) sp.consumeHp(0.6, hp, "kyle");
    }, 10);
  }

  static skill3(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      skill = weaponData.unique.kyles.skillLvl[2]![data.skillLvl[2]!],
      hp = user.getComponent("health");

    if (!sp.cooldown.canSkill("kyle_skill3", skill.find((e) => e.name === "cooldown")!.value || 8)) return;
    sp.playAnim("animation.weapon.kyles.skill3");

    sp.bind(1.2);
    sp.minStamina(skill.find((e) => e.name === "stamina")!.value || 12);

    sp.knockback(CreateObject.createVelocityPlayer(user), 0, 0.2);
    sp.addEffect({ name: "slow_falling", duration: 0.6, amplifier: 1, showParticles: false });

    sp.source.triggerEvent("cz:immune_300ms");
    sp.cooldown.setIsSkill(0.7);
    system.runTimeout(() => {
      sp.knockback(CreateObject.createVelocityPlayer(user), 0, 0.6);

      const target = sp.getEntityFromDistanceCone(3);

      target.forEach((e) => {
        if (!e) return;
        Terra.getEntityCache(e).addDamage(
          data.atk +
            (hp?.effectiveMax || 20) *
              skill.find((e) => e.name === "zelxt_health_percentage")!.value *
              slayerLostHPPercentation(user) *
              (multiplier || 1),
          {
            cause: "entityAttack",
            damagingEntity: user,
            rune: sp.rune.getRuneStat(),
            isSkill: true,
          }
        );
      });

      if (target.length > 0) sp.consumeHp(0.5, hp, "kyle");

      system.runTimeout(() => {
        const loc = sp.getLocationInFront(2.5);
        sp.particles({
          particle: "cz:kyle_skill3",
          location: { ...loc },
          molang: new MolangVariableMap(),
        });
      }, 1);
    }, 10);
  }

  static skill3Up(user: Player, { sp, multiplier }: SkillLib): void {
    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      pasif = this.pasif1(user),
      skill = weaponData.unique.kyles.skillLvl[2]![data.skillLvl[2]!],
      hp = user.getComponent("health"),
      stack = sp.status.getStatus({ name: "zelxt_point" })[0]?.lvl || 0;

    if (!sp.cooldown.canSkill("kyle_skill3", skill.find((e) => e.name === "zelxt_cooldown")!.value || 8)) return;
    sp.playAnim("animation.weapon.kyles.skill3.up");

    sp.bind(2.5);
    sp.minStamina(skill.find((e) => e.name === "zelxt_stamina")!.value || 12);

    sp.knockback(CreateObject.createVelocityPlayer(user), 0, 1.2);
    sp.addEffect({ name: "slow_falling", duration: 1.2, amplifier: 1, showParticles: false });

    sp.cooldown.setIsSkill(1.1);

    system.runTimeout(() => {
      sp.knockback(CreateObject.createVelocityPlayer(user), 0, -6.2);
      sp.source.triggerEvent("cz:immune_300ms");

      system.runTimeout(() => {
        const target = sp.getEntityWithinRadius(4);

        target.forEach((e) => {
          if (!e) return;
          Terra.getEntityCache(e).addDamage(
            data.atk +
              (hp?.effectiveMax || 20) *
                skill.find((e) => e.name === "zelxt_health_percentage")!.value *
                slayerLostHPPercentation(user) *
                pasif *
                (1 + stack / 200) *
                (multiplier || 1),
            {
              cause: "void",
              damagingEntity: user,
              rune: sp.rune.getRuneStat(),
              isSkill: true,
            }
          );
        });

        sp.status.removeStatus("zelxt_point");

        system.runTimeout(() => {
          // sp.spawnParticle("cz:particles", "cz:shockwave_particle");

          sp.particles({
            particle: "cz:shockwave",
            location: { ...user.location, y: user.location.y + 0.01 },
            molang: new MolangVariableMap(),
          });
        }, 3);
      }, 3);
    }, 20);
  }

  static skillSpecial(user: Player, { sp }: SkillLib): void {
    sp.playAnim("animation.weapon.kyles.transform");

    sp.bind(1.5);
    sp.minStamina(10);
    user.addTag("preview");

    const data = sp.getSp().weapons.find((e) => e.weapon === "kyles") || weaponRaw.unique.kyles,
      skill = weaponData.unique.kyles.skillLvl[3]![data.skillLvl[3]!],
      hp = user.getComponent("health");

    let loc = sp.getLocationInFront(2);

    user.runCommand(`camera @s set minecraft:free ease 0.2 in_bounce pos ${loc.x} ${loc.y + 1} ${loc.z} facing @s`);

    system.runTimeout(() => {
      loc = sp.getLocationInFront(2.5);
      user.runCommand(`camera @s set minecraft:free ease 0.2 in_bounce pos ${loc.x} ${loc.y + 1.3} ${loc.z} facing @s`);
      user.triggerEvent("cz:zelxt_mode_on");

      sp.status.minStatusLvl("zelxt_point", 100);
      sp.status.addStatus("zelxt_mode", 1, {
        type: "state",
        decay: "none",
        stack: false,
        lvl: 1,
      });

      sp.heal((hp?.effectiveMax || 20) * skill?.find((e) => e.name === "health_recover")!.value);

      sp.addEffect([
        { name: "speed", amplifier: 1, duration: 10, showParticles: false },
        { name: "absorption", amplifier: 4, duration: 10, showParticles: false },
      ]);

      system.runTimeout(() => {
        user.camera.clear();
        user.removeTag("preview");
      }, 9);
    }, 18);
  }
}

export { Kyle };
