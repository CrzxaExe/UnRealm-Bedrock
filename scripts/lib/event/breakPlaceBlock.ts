import { PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, world } from "@minecraft/server";
import { Item, Modifier, ModifierActiveActionsEnum, modifierDataList, Quest, Terra } from "../ZxraLib/module";

world.afterEvents.playerBreakBlock.subscribe(
  ({
    block,
    brokenBlockPermutation,
    dimension,
    player,
    itemStackAfterBreak,
    itemStackBeforeBreak,
  }: PlayerBreakBlockAfterEvent) => {
    if (itemStackAfterBreak) {
      const item = new Item(itemStackAfterBreak);
      const modifier = item.getModifierByAction(ModifierActiveActionsEnum.AfterBreak);

      modifier.forEach((e) => {
        const mod = Modifier.get(e.name);

        if (!mod) return;
        mod.callback(player, block, {
          item: itemStackAfterBreak,
          level: e.level,
          dimension,
          mod: modifierDataList[mod.type][e.name][(e.level ?? 1) - 1],
        });
      });
    }
  }
);

world.beforeEvents.playerBreakBlock.subscribe(
  ({ block, cancel, dimension, player, itemStack }: PlayerBreakBlockBeforeEvent) => {
    const sp = Terra.getSpecialistCache(player);

    sp.minThirst(0.6);
    sp.minStamina(Terra.world.setting?.staminaAction || 3);

    const quest = new Quest(player);
    quest.controller({ act: "destroy", target: block, amount: 1 });

    if (itemStack) {
      const item = new Item(itemStack);
      const modifer = item.getModifierByAction(ModifierActiveActionsEnum.BeforeBreak);

      modifer.forEach((e) => {
        const mod = Modifier.get(e.name);

        if (!mod) return;
        mod.callback(player, block, {
          item: itemStack,
          level: e.level,
          dimension,
          cancel,
          mod: modifierDataList[mod.type][e.name][(e.level ?? 1) - 1],
        });
      });
    }
  }
);

world.afterEvents.playerPlaceBlock.subscribe((e) => {});
world.beforeEvents.playerPlaceBlock.subscribe((e) => {});
