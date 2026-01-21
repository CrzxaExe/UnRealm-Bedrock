import { Camera, Container, EasingType, GameMode, Player, Vector3, Entity as mcEntity } from "@minecraft/server";
import {
  Entity,
  Terra,
  Cooldown,
  SpecialistData,
  CreateObject,
  SpecialistStamina,
  Rune,
  settings,
  Formater,
  Calc,
  SpecialistThirst,
  PlayerContainers,
  SpecialistComponent,
} from "../module";

interface Specialist {
  container: Container;
  cooldown: Cooldown;
  rune: Rune;
  inventory: PlayerContainers;
}

class Specialist extends Entity {
  constructor(player: Player) {
    if (!player) throw new Error("Missing player");

    super(player as Player);
    this.container = this.source.getComponent("inventory");
    this.cooldown = new Cooldown(this);
    this.rune = new Rune(this);
    this.inventory = new PlayerContainers(player);
  }

  // Controller
  controllerActionBar(): void {
    const content: string[] = [];

    if (content.length < 1) return;

    this.source.onScreenDisplay.setActionBar({ text: content.join(" | ") });
  }
  controllerCooldown(): void {
    this.cooldown.getData().forEach((e) => this.cooldown.minCd(e.name, 0.25));
  }
  controllerStamina(): void {
    if (["creative", "spectator"].includes(this.source.getGameMode())) return;

    const data = this.getSp(),
      max: number = data.stamina.max + data.stamina.additional + data.stamina.rune;

    if (data.stamina.current <= 10) this.addEffectOne("slowness", 2, 1);
    if (data.stamina.current <= 1) this.cooldown.addCd("tired", 12);

    const setting = Terra.world.setting || settings;
    if (this.source.isSprinting) {
      if (setting.staminaCooldown) this.cooldown.addCd("stamina_regen", setting.staminaExhaust || 3);
      this.minStamina(
        ((setting.staminaRun || 1.5) - this.status.decimalCalcStatus({ type: "stamina_recovery" }, 0, 0.01)) *
          (this.cooldown.hasCd("tired") ? 1.5 : 1)
      );

      return;
    }

    if (this.cooldown.hasCd("stamina_regen")) return;
    let recovery: number =
      ((setting.staminaRecovery || 2) + this.status.decimalCalcStatus({ type: "stamina_recovery" }, 0, 0.01)) *
      (this.cooldown.hasCd("tired") ? 0.5 : 1);
    if (data.stamina.current + recovery > max) recovery = max - data.stamina.current;

    if (recovery <= 0) return;
    this.addStamina(recovery);
  }
  controllerThirst(): void {
    if (["creative", "spectator"].includes(this.source.getGameMode())) return;

    const { current } = this.getThirst();
    let down = 0.01 - this.status.decimalCalcStatus({ type: "thirst_recovery" }, 0, 0.01);

    if (current < 15) this.addEffectOne("nausea", 3, 0, false);
    if (current <= 0) {
      this.addEffectOne("poison", 3, 0, false);
      return;
    }

    if (this.source.dimension.id === "nether") down += 0.04;
    if (this.source.isSprinting) down += Terra.world.setting?.thirstRun || 0.03;

    if (down < 0) return;

    this.minThirst(down);
  }
  controllerUI(): void {
    const { cd: cols, level, rep, stamina, thirst, money, voxn } = this.getSp();

    const cd: string[] = cols.map((e) => `${Formater.formatName(e.name)} ${e.duration.toFixed(2)}s`);
    const sts: string[] = this.status.getStatus().map((e) => {
      const lbl: string =
        {
          stack: `${Formater.formatName(e.name)} > ${e.lvl.toFixed(0)}`,
          state: `${Formater.formatName(e.name)}`,
        }[e.type as string] || `${Formater.formatName(e.name)} ${e.duration.toFixed(2)}s`;

      return lbl;
    });

    this.source.onScreenDisplay.setTitle(
      `cz:ui (${((level.xp / Calc.specialistLevelUp(level.current || 0)) * 100).toFixed(1)}) ${level.xp.toFixed(2)} XP ${
        level.current
      } < SP
 
§eS ${((stamina.current / Math.floor(stamina.max + stamina.additional + stamina.rune)) * 100).toFixed(
        0
      )}%§r§f §1T ${Number((thirst.current / thirst.max) * 100).toFixed(0)}%§r§f
${
  this.source.getBlockFromViewDirection({ maxDistance: Terra.world.setting?.whatSeeDistance || 7 })?.block?.type.id ||
  this.getEntityFromDistance(Terra.world.setting?.whatSeeDistance || 7)[0]?.entity.typeId ||
  "minecraft:air"
}${cd.length > 0 ? "\n\n< Cooldown\n" + cd.join("\n") : ""}${sts.length > 0 ? "\n\n< Status\n" + sts.join("\n") : ""}`,
      { fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 0 }
    );
  }

  // Data methods
  getSp(): SpecialistData {
    const data = Terra.getSpecialist(this.source.id);
    // console.warn(this.id, JSON.stringify(data?.stamina));

    if (!data) return CreateObject.createSpecialist(this.source);
    return data;
  }
  setSp(newData: SpecialistData): void {
    if (!newData) throw new Error("Missing new data");

    Terra.setSpecialist(newData);
  }

  // Specialist methods
  addSpXp(amount: number, data: SpecialistData = this.getSp()): void {
    const { level, xp } = Calc.upSpecialist(
      data.level.current,
      (data.level.xp + amount) * (Terra.world.setting?.xpMultiplier || 1)
    );

    data.level.current = level;
    data.level.xp = xp;
    this.setSp(data);
  }
  minSpXp(amount: number, data: SpecialistData = this.getSp()): void {
    this.addSpXp(-amount, data);
  }
  setSpXp(value: number, data: SpecialistData = this.getSp()): void {
    const { level, xp } = Calc.upSpecialist(data.level.current, value * (Terra.world.setting?.xpMultiplier || 1));

    data.level.current = level;
    data.level.xp = xp;
    this.setSp(data);
  }

  addSpLvl(amount: number, data: SpecialistData = this.getSp()): void {
    data.level.current += amount;
    this.setSp(data);
  }
  minSpLvl(amount: number, data: SpecialistData = this.getSp()): void {
    this.addSpLvl(-amount, data);
  }
  setSplvl(value: number, data: SpecialistData = this.getSp()): void {
    data.level.current = value;
    this.setSp(data);
  }

  // Stamina methods
  getStamina(): SpecialistStamina {
    return this.getSp().stamina;
  }
  addStamina(amount: number = 1, data: SpecialistData = this.getSp()): void {
    if (this.status.hasStatus({ type: "stamina_stuck" })) return;

    const max = data.stamina.max + data.stamina.additional + data.stamina.rune;

    if (data.stamina.current + amount > max) {
      this.setStamina(max);
      return;
    }

    if (data.stamina.current + amount <= 0) {
      this.setStamina(0);
      return;
    }

    data.stamina.current += amount;
    this.setSp(data);
  }
  minStamina(amount: number = 1, data: SpecialistData = this.getSp()): void {
    if ([GameMode.Creative, GameMode.Spectator].includes(this.source.getGameMode())) return;

    this.addStamina(-amount, data);
  }
  setStamina(value: number = 1, data: SpecialistData = this.getSp()): void {
    data.stamina.current = value;
    this.setSp(data);
  }
  setMaxStamina(key: "max" | "additional" | "rune", amount: number, data: SpecialistData = this.getSp()): void {
    if (!key || !amount) throw new Error("Missing key or amount");

    if (amount < 0) throw new Error("Amount cannot be negative");

    data.stamina[key] += amount;
    this.setSp(data);
  }
  resetToMaxStamina(): void {
    const {
      stamina: { max, additional, rune },
    } = this.getSp();
    this.setStamina(Math.floor(max + additional + rune));
  }

  // Thirst methods
  getThirst(): SpecialistThirst {
    return this.getSp().thirst;
  }
  addThirst(amount: number = 1, data: SpecialistData = this.getSp()): void {
    data.thirst.current += amount;

    if (data.thirst.current >= (data.thirst.max + data.thirst.temp) * 1.1) {
      data.thirst.current = (data.thirst.max + data.thirst.temp) * 1.1;
    }
    this.setSp(data);
  }
  minThirst(amount: number = 1, data: SpecialistData = this.getSp()): void {
    if ([GameMode.Creative, GameMode.Spectator].includes(this.source.getGameMode())) return;

    this.addThirst(-amount, data);
  }
  setThirst(value: number, data: SpecialistData = this.getSp()): void {
    data.thirst.current = parseInt(value.toFixed(1));
    this.setSp(data);
  }
  setToMaxThirst(data: SpecialistData = this.getSp()): void {
    this.setThirst(data.thirst.max, data);
  }
  setMaxThrist(key: "max" | "temp", amount: number = 0, data: SpecialistData = this.getSp()): void {
    data.thirst[key] += amount;
    this.setSp(data);
  }

  // Money methods
  getMoney(): number {
    return this.getSp().money;
  }
  addMoney(amount: number = 1, data: SpecialistData = this.getSp()): void {
    data.money = (data.money ?? 0) + amount;
    this.setSp(data);
  }
  minMoney(amount: number = 1, data: SpecialistData = this.getSp()): void {
    this.addMoney(-amount, data);
  }
  setMoney(value: number = 0, data: SpecialistData = this.getSp()): void {
    data.money = value;
    this.setSp(data);
  }

  // Reputation methods
  getRep(): number {
    return this.getSp().rep;
  }
  addRep(amount: number = 1, data: SpecialistData = this.getSp()): void {
    data.rep = +amount;
    this.setSp(data);
  }
  minRep(amount: number = 1, data: SpecialistData = this.getSp()): void {
    this.addRep(-amount, data);
  }
  setRep(value: number = 0, data: SpecialistData = this.getSp()): void {
    data.rep = value;
    this.setSp(data);
  }

  // Voxn methods
  getVoxn(): number {
    return this.getSp().voxn;
  }
  addVoxn(amount: number = 1, data: SpecialistData = this.getSp()): void {
    data.voxn += amount;
    this.setSp(data);
  }
  minVoxn(amount: number = 1, data: SpecialistData = this.getSp()): void {
    this.addVoxn(-amount, data);
  }
  setVoxn(value: number = 0, data: SpecialistData = this.getSp()): void {
    data.voxn = value;
    this.setSp(data);
  }

  // Title methods
  getTitles(): string[] {
    return this.getSp().titles;
  }
  hasTitle(name: string, data: SpecialistData = this.getSp()): boolean {
    if (name === "") throw new Error("Missing name");

    return data.titles.some((e) => e === name);
  }
  addTitle(name: string, data: SpecialistData = this.getSp()): void {
    if (name === "") throw new Error("Missing name");

    if (this.hasTitle(name, data)) return;
    data.titles.push(name);
    this.setSp(data);
  }
  removeTitle(name: string, data: SpecialistData = this.getSp()): void {
    if (name === "") throw new Error("Missing name");

    const find = data.titles.findIndex((e) => e === name);

    if (find === -1) return;

    data.titles.splice(find, 1);
    this.setSp(data);
  }

  setActiveTitle(name: string, data: SpecialistData = this.getSp()): void {
    if (name === "") throw new Error("Missing name");

    if (!this.hasTitle(name)) return;
    data.title = name;
    this.setSp(data);
  }
  removeActiveTitle(data: SpecialistData = this.getSp()): void {
    data.title = "";
    this.setSp(data);
  }

  // Components methods
  getComponent(
    name: string | undefined | void,
    data: SpecialistData = this.getSp()
  ): SpecialistComponent[] | SpecialistComponent {
    if (!name || name === "") {
      return data.components;
    }

    const find = data.components.find((e) => e.name === name);

    return find || [];
  }
  setComponent(name: string, newValue: Vector3 | number | string, data: SpecialistData = this.getSp()): void {
    if (!name) throw new Error("Missing name");
    if (!newValue) throw new Error("Missing new value");

    const find = data.components.findIndex((e) => e.name === name);
    if (find === -1) throw new Error("Object not found");

    data.components[find].value = newValue;
    this.setSp(data);
  }
  removeComponent(name: string, data: SpecialistData = this.getSp()): void {
    if (!name) throw new Error("Missing name");

    const find = data.components.findIndex((e) => e.name === name);
    if (find === -1) throw new Error("Object not found");

    data.components.splice(find, 1);
    this.setSp(data);
  }

  // Camera methods
  public clearCamera(): void {
    (this.source.camera as Camera).clear();
  }
  public setCameraToEntity(location: Vector3, facingEntity: mcEntity): void {
    (this.source.camera as Camera).setCamera("minecraft:free", {
      location,
      facingEntity: facingEntity,
      easeOptions: {
        easeTime: 0.5,
        easeType: EasingType.InOutExpo,
      },
    });
  }
}

export { Specialist };
