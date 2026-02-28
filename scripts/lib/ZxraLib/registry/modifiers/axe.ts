import { Entity as mcEntity, Player, system } from "@minecraft/server";
import { Modifier, ModifierActiveActionsEnum, ModifierStats, NOT_VALID_ENTITY, Terra } from "../../module";

Modifier.add(
  "life_parser",
  "axe",
  ModifierActiveActionsEnum.AfterHit,
  (user: Player, target: mcEntity, lib: { mod: ModifierStats[] }) => {
    if (!user || NOT_VALID_ENTITY.includes(target.typeId)) return;
    if (!user.isJumping) return;

    const cooldown = lib.mod.find((e) => e.stat === "cooldown")?.value ?? 5;
    const sp = Terra.getSpecialistCache(user);

    if (!sp.cooldown.canSkill("life_parser_strike", cooldown)) return;

    system.run(() => {
      const hpPercentage = lib.mod.find((e) => e.stat === "hp_percentage")?.value ?? 0.08;
      Terra.getEntityCache(target).addDamage((target.getComponent("health")?.defaultValue ?? 20) * hpPercentage, {
        cause: "entityAttack",
        damagingEntity: user,
        isSkill: false,
      });
    });
  }
);

Modifier.add(
  "shock",
  "axe",
  ModifierActiveActionsEnum.AfterHit,
  (user: Player, target: mcEntity, lib: { level: number; mod: ModifierStats[] }) => {
    if (!user || NOT_VALID_ENTITY.includes(target.typeId)) return;
    if (!user.isFalling) return;

    system.run(() => {
      const ent = Terra.getEntityCache(target);
      const duration = lib.mod.find((e) => e.stat === "stun_duration")?.value ?? 1;
      const amplifier = lib.mod.find((e) => e.stat === "amplifier")?.value ?? 2;

      ent.status.addStatus("stun", duration, { type: "stun", lvl: 1, decay: "time", stack: false });
      ent.addEffect([
        { name: "weakness", duration, amplifier, showParticles: true },
        { name: "blindness", duration, amplifier, showParticles: true },
      ]);
    });
  }
);
