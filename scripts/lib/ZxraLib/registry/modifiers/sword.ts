import { Entity as mcEntity, Player } from "@minecraft/server";
import { Modifier, ModifierActiveActionsEnum, ModifierStats, NOT_VALID_ENTITY, Terra } from "../../module";

Modifier.add(
  "benefit",
  "sword",
  ModifierActiveActionsEnum.Kill,
  (user: Player, target: mcEntity, lib: { mod: ModifierStats[] }) => {
    if (!user || NOT_VALID_ENTITY.includes(target.typeId)) return;

    const duration = lib.mod.find((e) => e.stat === "duration")?.value ?? 2;
    const amplifier = lib.mod.find((e) => e.stat === "amplifier")?.value ?? 0;

    Terra.getSpecialistCache(user).addEffect([
      { name: "speed", duration, amplifier, showParticles: true },
      { name: "strength", duration, amplifier, showParticles: true },
    ]);
  }
);

Modifier.add(
  "poison",
  "sword",
  ModifierActiveActionsEnum.AfterHit,
  (user: Player, target: mcEntity, lib: { mod: ModifierStats[] }) => {
    if (!user || NOT_VALID_ENTITY.includes(target.typeId)) return;

    target.addEffect("poison", 20 * 3, {
      amplifier: lib.mod.find((e) => e.stat === "level")?.value ?? 1,
      showParticles: true,
    });
  }
);

Modifier.add(
  "vampire",
  "sword",
  ModifierActiveActionsEnum.AfterHit,
  (user: Player, target: mcEntity, lib: { mod: ModifierStats[] }) => {
    if (!user || !target.getComponent("type_family")?.hasTypeFamily("mob") || NOT_VALID_ENTITY.includes(target.typeId))
      return;

    Terra.getEntityCache(user).heal(lib.mod.find((e) => e.stat === "heal")?.value ?? 1);
  }
);

Modifier.add(
  "fire_spreader",
  "sword",
  ModifierActiveActionsEnum.AfterHit,
  (_: Player, target: mcEntity, lib: { mod: ModifierStats[] }) => {
    if (!target || !target.getComponent("onfire")) return;

    const radius: number = lib.mod.find((e) => e.stat === "radius")?.value ?? 1.5;
    const duration: number = lib.mod.find((e) => e.stat === "duration")?.value ?? 3;

    Terra.getEntityCache(target)
      .getEntityWithinRadius(radius)
      .forEach((e: mcEntity) => e.setOnFire(duration));
  }
);
