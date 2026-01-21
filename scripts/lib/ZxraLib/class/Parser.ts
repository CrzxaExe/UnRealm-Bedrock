import { RawMessage } from "@minecraft/server";
import { Formater, Modifier, modifierDataList, ModifierList } from "../module";
import { ModifierActiveActions, ModifierTypes } from "../enum/modifier";

/**
 * Utility class to handle string text into other format
 */
class Parser {
  /**
   * Split all text to separated array
   *
   * @param data text want to separate
   * @returns array of string
   */
  static stringArray(data: string): string[] | undefined {
    const regex = data.match(/"[^"]*"|'[^'*]|`[^*`]|\([^)]*\)|\S+/g)?.map((e) => {
      if (
        (e.startsWith('"') && e.endsWith('"')) ||
        (e.startsWith("'") && e.endsWith("'")) ||
        (e.startsWith("`") && e.endsWith("`")) ||
        (e.startsWith("(") && e.endsWith(")"))
      ) {
        return e.slice(1, -1);
      }
      return e;
    });

    return regex;
  }

  /**
   * Deep clone object
   *
   * @param data Object that wanna be clone
   * @returns Object
   */
  static clone(data: Object): Object {
    const ret = JSON.parse(JSON.stringify(data));
    return ret;
  }

  /**
   * Convert from item lore to modifier list
   *
   * @param lore item lore
   * @param type modifier type of tool
   * @returns ModifierList[]
   */
  static toModifier(lore: (string | RawMessage)[], type: ModifierTypes): ModifierList[] {
    const modifiers: ModifierList[] = [];
    lore.forEach((e) => {
      if (typeof e === "string") {
        const split = e.split(" ");
        const level = split.at(-1);
        const name = split.slice(0, -1).join("_").toLowerCase();

        if (Object.keys(modifierDataList[type as keyof typeof modifierDataList]).includes(name))
          modifiers.push({ name, level: !isNaN(Number(level)) ? Number(level) : 1 });
      }
    });

    return modifiers;
  }

  static toModifierAction(lore: (string | RawMessage)[], action: ModifierActiveActions): ModifierList[] {
    const modifiers: ModifierList[] = [];
    lore.forEach((e) => {
      if (typeof e === "string") {
        const split = e.split(" ");
        const level = split.at(-1);
        const name = split.slice(0, -1).join("_").toLowerCase();

        if (Modifier.mod.some((e) => e.action === action && e.name === name))
          modifiers.push({ name, level: !isNaN(Number(level)) ? Number(level) : 1 });
      }
    });

    return modifiers;
  }

  /**
   * Convert from modifier list to item lore
   *
   * @param modifiers list of modifier
   * @returns string[]
   */
  static fromModifier(modifiers: ModifierList[]): string[] {
    const mods: string[] = modifiers.map((cur) => {
      const name = Formater.formatName(cur.name);

      return `${name} ${String(cur.level)}`;
    });

    return mods;
  }
}

export { Parser };
