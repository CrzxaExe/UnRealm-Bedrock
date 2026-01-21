import { ItemDurabilityComponent, ItemStack, Player, system } from "@minecraft/server";
import { modifierDataList, ModifierList, Modifiers, Parser, WeaponStatLore, WeaponTypes } from "../module";
import { ModifierActiveActions, ModifierTypes } from "../enum/modifier";

interface Item {
  itemStack: ItemStack;
}

/**
 * Item class, to control item behavior
 */
class Item {
  constructor(item: ItemStack) {
    if (!item) throw new Error("Missing item");
    this.itemStack = item;
  }

  /**
   * Get item durability
   *
   * @returns ItemDurabilityComponent | undefined
   */
  getDurability(): ItemDurabilityComponent | undefined {
    return this.itemStack.getComponent("durability");
  }

  /**
   * Get item tags
   *
   * @returns string[]
   */
  getTags(): string[] {
    return this.itemStack.getTags();
  }

  /**
   * Get item tier
   * @returns number
   */
  getTier(): number {
    return Math.max(
      ...this.getTags()
        .filter((e) => e.startsWith("tier_"))
        .map((e) => parseInt(e.replace("tier_", "")))
    );
  }

  /**
   * Get weapon type
   *
   * @returns string | undefined
   */
  getWeaponType(): string | undefined {
    return this.getTags().find((e) => Object.values(WeaponTypes).includes(e as WeaponTypes));
  }

  /**
   * Get item lore
   *
   * @returns string[]
   */
  getLore(): string[] {
    return this.itemStack.getLore();
  }

  /**
   * Get weapon stat (pasif lvl & skill lvl)
   *
   * @returns WeaponStatLore | undefined
   */
  getWeaponStats(): WeaponStatLore | undefined {
    if (!this.getWeaponType()) return;
    const lore = this.getLore();

    const index = {
      pasif: lore.findIndex((e: string) => e.toLowerCase() === "pasifs:"),
      skill: lore.findIndex((e: string) => e.toLowerCase() === "skills:"),
    };
    const pasifs: number[] = lore.slice(index.pasif, index.pasif + [2, 1, 1, 1][this.getTier()]).map((e: string) => {
      const num = parseInt(e.split(/\[/g)[1]!.replace(/\]/g, ""));
      return !isNaN(num) ? num : 0;
    });
    const skills: number[] = lore.slice(index.skill, index.skill + [2, 1, 1, 1][this.getTier()]).map((e: string) => {
      const num = parseInt(e.split(/\[/g)[1]!.replace(/\]/g, ""));
      return !isNaN(num) ? num : 0;
    });

    return {
      pasifs: pasifs as ArrayFixedLength<number, 1, 2>,
      skills: skills as ArrayFixedLength<number, 2, 4>,
    } as WeaponStatLore;
  }

  /**
   * Get item modifier
   *
   * @param modifier modifier type of tool
   * @returns ModifierList[]
   */
  getModifier(modifier: ModifierTypes): ModifierList[] {
    return Parser.toModifier(this.getLore(), modifier);
  }

  getModifierByAction(action: ModifierActiveActions): ModifierList[] {
    return Parser.toModifierAction(this.getLore(), action);
  }

  setModifier(): void {}

  /**
   * Adding modifier to item
   *
   * @param modifier modifier type of tool
   * @param player owner of the item
   * @param level level modifier
   */
  addModifier(modifier: ModifierTypes, player: Player, level: number = 1): void {
    const tag = this.getTags();
    const type = Object.keys(modifierDataList);
    const listMod = tag.reduce(
      (all, cur) => {
        const split = cur.split(":");
        const name = (split[1] ?? split[0]).replace("is_", "");
        if (!type.includes(name)) return all;

        all.push({ name, mod: (modifierDataList as Record<string, any>)[name] as Modifiers });
        return all;
      },
      [] as { name: string; mod: Modifiers }[]
    );

    const mod = listMod.find((e) => Object.keys(e.mod).includes(modifier));
    if (!mod) throw new Error("Modifier cannot be applied");
    if (level > mod.mod[modifier].length) throw new Error(`Level cannot be more than ${mod.mod[modifier].length}`);

    const installed = this.getModifier(mod.name as ModifierTypes);
    const find = installed.findIndex((e) => e.name === modifier);

    if (find !== -1) {
      installed[find].level = level;
    } else installed.push({ name: modifier, level: level });

    system.run(() => {
      const item = new ItemStack(this.itemStack.typeId, this.itemStack.amount);
      item.setLore(Parser.fromModifier(installed));

      player.getComponent("inventory")?.container.setItem(player.selectedSlotIndex, item);
    });
  }
}

export { Item };
