import { InputPermissionCategory, Player } from "@minecraft/server";
import { Entity, NOT_ALLOWED_ENTITY_TICK, StatusData, StatusDecay, StatusFinder, StatusTypes, Terra } from "../module";

interface Status {
  entity: Entity;
}

/**
 * Object status data for Entity
 */
class Status {
  constructor(entity: Entity) {
    if (!entity) throw new Error("Missing Entity");

    this.entity = entity;
  }

  /**
   * Get current Entity status
   *
   * @returns StatusData[]
   */
  getData(): StatusData[] {
    const data = this.entity.getEnt();

    return data.status;
  }

  /**
   * Set current Entity status
   *
   * @param newData updated Entity status
   */
  setData(newData: StatusData[]): void {
    if (!newData) throw new Error("Missing data");
    const data = this.entity.getEnt();

    data.status = newData;

    this.entity.setEnt(data);
  }

  /**
   * CLear current Entity status
   */
  clearData(): void {
    this.setData([]);
  }

  /**
   * Get Entity status with finder
   *
   * @param finder Status finder Object
   * @returns Status data
   */
  getStatus(finder?: StatusFinder): StatusData[] {
    const data = this.getData();

    if (finder) {
      return data.filter((e) => {
        const key = Object.keys(finder)[0] as keyof StatusFinder;
        return e[key] === finder[key];
      });
    }

    return data;
  }

  /**
   * Check if Entity has some status
   *
   * @param finder Status finder Object
   * @returns boolean
   */
  hasStatus(finder: StatusFinder): boolean {
    return this.getData().some((e) => {
      const key = Object.keys(finder)[0] as keyof StatusFinder;
      return e[key] === finder[key];
    });
  }

  // Functional

  /**
   * Add new, renew, or replace status
   *
   * @param name name of status
   * @param duration duration of status
   * @param param2 { decay, lvl, stack, type }
   */
  addStatus(
    name: string,
    duration: number = 1,
    {
      type = "none",
      decay = "time",
      stack = false,
      lvl = 1,
    }: { type: StatusTypes | StatusTypes; decay: StatusDecay | string; stack: boolean; lvl: number }
  ): void {
    if (NOT_ALLOWED_ENTITY_TICK.includes(this.entity.source.name)) throw new Error("Entity not allowed");

    switch (type) {
      case "silence":
        this.entity.addTag("silence");
        break;
      case "anti_heal":
        Terra.addEntityAntiHealStatus(this.entity.id);
        break;
      case "bind":
        if (!(this.entity.source instanceof Player)) {
          this.entity.addEffect({ name: "slowness", amplifier: 1, duration, showParticles: false });
          break;
        }
        this.entity.source.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
        break;
    }
    const data = this.getData(),
      find = data.findIndex((e) => e.name === name);

    if (find === -1) {
      data.push({ name, duration, type, lvl, decay, stack });
    } else {
      data[find].duration = Math.max(data[find].duration, duration);
      data[find].lvl = !data[find].stack ? Math.max(data[find].lvl, lvl) : data[find].lvl + lvl;
    }

    this.setData(data);
  }

  /**
   * Add multiple status
   *
   * @param status list of status
   */
  addStatusMany(status: StatusData[] | StatusData): void {
    if (!status) throw new Error("Missing status");

    if (Array.isArray(status)) {
      status.forEach(({ name, duration = 1, type = "none", lvl = 1, decay = "time", stack = false }: StatusData) =>
        this.addStatus(name, duration, { type, lvl, decay, stack })
      );
      return;
    }

    if (!(status instanceof Object)) throw new Error("Invalid parameter: status must be StatusData[] or StatusData");
    if (!status.name) throw new Error("Missing name on status");

    const { name, duration = 1, type = "none", decay = "time", lvl = 1, stack = false } = status;
    this.addStatus(name, duration, { type, lvl, decay, stack });
  }

  /**
   * Decrease duration of status
   *
   * @param name name of status
   * @param duration amount of duration will be decreasing
   */
  minStatus(name: string, duration: number = 1): void {
    if (!name) throw new Error("Missing name");

    const data = this.getData(),
      find = data.findIndex((e) => e.name === name);

    if (find === -1) throw new Error("Status not found");

    if (data[find].duration < duration) {
      this.removeStatus(name);
      return;
    }

    data[find].duration -= duration;
    this.setData(data);
  }

  /**
   * Decrease level of status
   *
   * @param name name of status
   * @param lvl amount of level will be decreasing
   */
  minStatusLvl(name: string, lvl: number = 1): void {
    if (!name) throw new Error("Missing name");

    const data = this.getData(),
      find = data.findIndex((e) => e.name === name);

    if (find === -1) throw new Error("Status not found");

    if (data[find].lvl < lvl) {
      this.removeStatus(name);
      return;
    }

    data[find].lvl -= lvl;
    this.setData(data);
  }

  /**
   * Remove status from Entity
   *
   * @param name name of status
   * @returns boolean
   */
  removeStatus(name: string): boolean {
    if (!name) throw new Error("Missing name");

    const data = this.getData(),
      find = data.findIndex((e) => e.name === name);

    if (find === -1) return false;

    switch (data[find].type) {
      case "silence":
        this.entity.remTag("silence");
        break;
      case "mudrock_shield":
        this.entity.source.triggerEvent("cz:shield_break");
        break;
      case "anti_heal":
        Terra.removeEntityAntiHealStatus(this.entity.id);
        break;
      case "bind":
        if (!(this.entity.source instanceof Player)) {
          this.entity.removeEffect("slowness");
          break;
        }
        this.entity.source.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
        break;
    }

    data.splice(find, 1);
    this.setData(data);

    return true;
  }

  // Calculation methods

  /**
   * Calculate status level by finder
   *
   * @param finder { name, type, decay }
   * @param startingNumber default number before calculating
   * @returns number
   */
  normalCalcStatus(finder: StatusFinder, startingNumber: number = 0): number {
    return (
      this.getStatus(finder).reduce((all: number, cur: StatusData) => (all += cur.lvl), startingNumber) | startingNumber
    );
  }

  /**
   * Calculate status level by finder, but preciese
   *
   * @param finder { name, type, decay }
   * @param startingNumber default number before calculating
   * @param perLvl per level value
   * @param most if true, it will only get the most value from the status
   * @returns number
   */
  decimalCalcStatus(
    finder: StatusFinder,
    startingNumber: number = 1,
    perLvl: number = 0.1,
    most: boolean = false
  ): number {
    let top = startingNumber;
    const data = this.getStatus(finder);

    if (data.length < 1) return top;

    data.forEach((e) => {
      if (most) {
        top = Math.max(top, startingNumber + perLvl * e.lvl);
      } else {
        top += perLvl * e.lvl;
      }
    });

    return top;
  }
}

export { Status };
