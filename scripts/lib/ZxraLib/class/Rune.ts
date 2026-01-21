import { defaultRuneStat, runeList, RuneStats, Specialist, SpecialistData, SpecialistRune } from "../module";

interface Rune {
  sp: Specialist;
}

/**
 * Class to settings and grab rune setup
 */
class Rune {
  constructor(sp: Specialist) {
    if (!sp) throw new Error("Missing Entity");
    this.sp = sp;
  }

  /**
   * Get all rune of player
   *
   * @returns SpecialistRune[]
   */
  getRune(): SpecialistRune[] {
    return this.sp.getSp().runes;
  }

  /**
   * Set player rune
   *
   * @param newData Array of specialist rune
   * @param data specialist data
   */
  setRune(newData: SpecialistRune[], data: SpecialistData = this.sp.getSp()): void {
    if (!newData) throw new Error("Missing new data");
    data.runes = newData;
    this.sp.setSp(data);
  }

  /**
   * Add new rune to player
   *
   * @param rune rune data
   * @param data specialist data
   */
  addRune(rune: SpecialistRune, data: SpecialistData = this.sp.getSp()): void {
    if (!rune) throw new Error("Missing rune");
    data.runes.push(rune);
    this.sp.setSp(data);
  }

  /**
   * Check if user has specific rune
   *
   * @param name name of the rune
   * @param data Specialist data
   * @returns boolean
   */
  hasRune(name: string, data: SpecialistData = this.sp.getSp()): boolean {
    if (name === "") throw new Error("Missing name");

    return data.runes.some((e) => e.name === name);
  }

  /**
   * Equip rune
   *
   * @param name name of the rune
   * @param data Specialist data
   */
  equipRune(name: string, data: SpecialistData = this.sp.getSp()): void {
    if (name === "") throw new Error("Missing name");

    if (!this.hasRune(name, data)) throw new Error("Name not found");

    if (data.equippedRune.length + 1 > 3) return;
    data.equippedRune.push(name);

    this.sp.setSp(data);
  }

  /**
   * Check if player has equip specific rune
   *
   * @param name name of the rune
   * @param data Specialist data
   * @returns boolean
   */
  hasEquipRune(name: string, data: SpecialistData = this.sp.getSp()): boolean {
    if (name === "") throw new Error("Missing name");

    return data.equippedRune.some((e) => e === name);
  }

  /**
   * Unequip rune
   *
   * @param name name of the rune
   * @param data Specialist data
   */
  unequipRune(name: string, data: SpecialistData = this.sp.getSp()): void {
    if (name === "") throw new Error("Missing name");

    if (this.hasEquipRune(name, data)) return;
    const find = data.equippedRune.findIndex((e) => e === name);

    if (find === -1) return;
    data.equippedRune.splice(find, 1);
    this.sp.setSp(data);
  }

  /**
   * Get your rune statistic detail
   *
   * @returns RuneStats
   */
  getRuneStat(): RuneStats {
    const data: RuneStats = { ...defaultRuneStat };

    this.getRune().forEach((e) => {
      const stats = runeList[e.name as string][e.lvl];

      Object.keys(stats)
        .filter((a) => !["onKill", "onHit", "onAttacked"].includes(a))
        .forEach((r) => {
          const key = r as keyof RuneStats;
          const value = stats[key];
          if (typeof value === "number") {
            data[key] = value as any;
          }
        });
      return;
    });

    return data;
  }

  /**
   * Get rune active stats callback
   *
   * @param type type of action
   * @returns Function[]
   */
  getRuneActiveStat(type: "onKill" | "onHit" | "onAttacked"): Function[] {
    const data = this.getRune();

    const fn: Function[] = [];

    data.forEach((e) => {
      const stats = runeList[e.name][e.lvl];

      Object.keys(stats)
        .filter((a) => ["onKill", "onHit", "onAttacked"].includes(a))
        .forEach((a) => {
          if (a !== type) return;
          if (typeof stats[a] === "function") {
            fn.push(stats[a]);
          }
        });
    });

    return fn;
  }
}

export { Rune };
