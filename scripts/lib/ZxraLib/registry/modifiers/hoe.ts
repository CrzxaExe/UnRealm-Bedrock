import { Block, Player, system } from "@minecraft/server";
import { Modifier, ModifierActiveActionsEnum, ModifierStats } from "../../module";

Modifier.add(
  "experiencer",
  "hoe",
  ModifierActiveActionsEnum.BeforeBreak,
  (user: Player, target: Block, lib: { level: number; mod: ModifierStats[] }) => {
    if (!user || !target) return;
    if (!target.getTags().includes("minecraft:crop")) return;

    const grow = target.permutation.getState("growth");
    if (!grow || grow < 7) return;

    system.run(() => {
      const xp = lib.mod.find((e) => e.stat === "amount")?.value ?? 3;
      user.addExperience(xp);
    });
  }
);
