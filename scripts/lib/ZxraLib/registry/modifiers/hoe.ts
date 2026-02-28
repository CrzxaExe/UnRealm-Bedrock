import { Block, BlockPermutation, Player, system } from "@minecraft/server";
import { Modifier, ModifierActiveActionsEnum, ModifierStats } from "../../module";

Modifier.add(
  "experiencer",
  "hoe",
  ModifierActiveActionsEnum.BeforeBreak,
  (user: Player, target: Block, lib: { mod: ModifierStats[] }) => {
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

Modifier.add("replanter", "hoe", ModifierActiveActionsEnum.AfterBreak, (user: Player, target: Block) => {
  if (!user || !target) return;
  if (!target.getTags().includes("minecraft:crop")) return;

  const grow = target.permutation.getState("growth");
  if (!grow || grow < 7) return;

  target.setPermutation(BlockPermutation.resolve(target.typeId, { growth: 0 }));
});
