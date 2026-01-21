import { Block, Dimension, Entity as mcEntity, ItemStack, Player, system, BlockPermutation } from "@minecraft/server";
import {
  Modifier,
  ModifierActiveActionsEnum,
  ModifierStats,
  NOT_VALID_ENTITY,
  SURVIVE_MODE,
  Terra,
} from "../../module";

Modifier.add(
  "extractor",
  "pickaxe",
  ModifierActiveActionsEnum.BeforeBreak,
  (
    user: Player,
    target: Block,
    lib: { level: number; dimension: Dimension; cancel: boolean; mod: ModifierStats[] }
  ) => {
    if (!SURVIVE_MODE.includes(user.getGameMode())) return;
    if (!target || !target.typeId.endsWith("_ore")) return;

    const name = target.typeId;
    const chance = Math.floor(Math.random() * 100 + (lib.mod.find((e) => e.stat === "chance")!.value ?? 20));
    if (chance <= 75) return;
    lib.cancel = true;

    system.run(() => {
      const item = new ItemStack(name, 1);
      lib.dimension.spawnItem(item, target.location);
    });
  }
);

Modifier.add(
  "explosion",
  "pickaxe",
  ModifierActiveActionsEnum.AfterHit,
  (user: Player, target: mcEntity, lib: { level: number; mod: ModifierStats[] }) => {
    if (!target || NOT_VALID_ENTITY.includes(target.typeId)) return;

    target.dimension.createExplosion(target.location, lib.mod.find((e) => e.stat === "level")?.value ?? 1.5, {
      allowUnderwater: false,
      breaksBlocks: false,
      causesFire: false,
      source: user,
    });
  }
);

Modifier.add(
  "chain_break",
  "pickaxe",
  ModifierActiveActionsEnum.BeforeBreak,
  (user: Player, target: Block, lib: { level: number; mod: ModifierStats[] }) => {
    if (!target || Terra.world.setting.chainBreakFilter?.includes(target.typeId)) return;

    const length = lib.mod.find((e) => e.stat === "length")?.value ?? 3;

    // Function
    const detectBlocksAround = (block: Block, typeId: string = block.typeId) => {
      if (block.typeId === "minecraft:air") return;

      let bx: Block | undefined;

      let i = 0;
      switch (i) {
        case 0:
          bx = block.above();
          i++;
          if (bx?.typeId === typeId && bx?.location !== block.location) return bx;
        case 1:
          bx = block.north();
          i++;
          if (bx?.typeId === typeId && bx?.location !== block.location) return bx;
        case 2:
          i++;
          bx = block.west();
          if (bx?.typeId === typeId && bx?.location !== block.location) return bx;
        case 3:
          bx = block.south();
          i++;
          if (bx?.typeId === typeId && bx?.location !== block.location) return bx;
        case 4:
          bx = block.east();
          i++;
          if (bx?.typeId === typeId && bx?.location !== block.location) return bx;
        case 5:
          bx = block.below();
          if (bx?.typeId === typeId && bx?.location !== block.location) return bx;
      }
      return;
    };

    const destroyFunction = (block: Block, amount: number, typeId: string = block.typeId) => {
      const nextBlock = detectBlocksAround(block, typeId);
      if (!nextBlock) return;

      if (amount === 0) return;
      destroyFunction(nextBlock, amount - 1, typeId);
      system.run(() => {
        if (SURVIVE_MODE.includes(user.getGameMode())) {
          user.runCommand(
            `loot spawn ${block.location.x} ${block.location.y} ${block.location.z} mine ${block.location.x} ${block.location.y} ${block.location.z} mainhand`
          );
        }
        block.setPermutation(BlockPermutation.resolve("minecraft:air"));
      });
    };

    destroyFunction(target, length, target.typeId);
  }
);
