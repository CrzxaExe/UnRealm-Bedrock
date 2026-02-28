import { Entity as mcEntity, Player } from "@minecraft/server";
import { Modifier, ModifierActiveActionsEnum, ModifierStats, NOT_VALID_ENTITY, Terra } from "../../module";

Modifier.add(
  "half_life",
  "mace",
  ModifierActiveActionsEnum.AfterHit,
  (user: Player, target: mcEntity, lib: { mod: ModifierStats[] }) => {
    if (!user || NOT_VALID_ENTITY.includes(target.typeId)) return;
    if (!user.isFalling) return;

    const heal = lib.mod.find((e) => e.stat === "heal")?.value ?? 3;

    Terra.getEntityCache(user).heal(heal);
  }
);
