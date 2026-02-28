import { Player, system } from "@minecraft/server";
import {
  CreateObject,
  Script,
  ScriptParams,
  StatusDecay,
  StatusDecayEnum,
  StatusTypes,
  StatusTypesEnum,
  Terra,
} from "../module";

// Special Script
Script.add("zelxt_revive", ({ sourceEntity }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);

  sp.playAnim("animation.weapon.kyles.revive");

  sp.bind(4.25);
  sp.setCurrentHP(1);

  system.runTimeout(() => {
    sp.status.removeStatus("zelxt_mode");
    sp.heal(500);
  }, 80);
});

// Money Script
Script.add("add_money", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.addMoney(amount);
});
Script.add("reset_money", ({ sourceEntity }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);

  sp.setMoney(0);
});
Script.add("set_money", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const value: number = parseInt(msg[0]) ?? 0;

  sp.setMoney(value);
});
Script.add("min_money", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.minMoney(amount);
});

// Misc Script
Script.add("bind", ({ sourceEntity, msg }: ScriptParams) => {
  if (!sourceEntity) return;

  const ent = Terra.getEntityCache(sourceEntity);
  const duration = parseInt(msg[0]) ?? 0;

  system.run(() => ent.bind(duration));
});
Script.add("dash", ({ sourceEntity, msg }: ScriptParams) => {
  if (!sourceEntity) return;

  const ent = Terra.getEntityCache(sourceEntity);
  const hor = parseInt(msg[0]) ?? 0;
  const ver = parseInt(msg[1]) ?? 0;

  system.run(() => ent.knockback(CreateObject.createVelocityPlayer(sourceEntity as Player), hor, ver));
});
Script.add("heal", ({ sourceEntity, msg }: ScriptParams) => {
  if (!sourceEntity) return;

  const ent = Terra.getEntityCache(sourceEntity);
  const amount = parseInt(msg[0]) ?? 0;

  system.run(() => ent.heal(amount));
});
Script.add("set_on_fire", ({ sourceEntity, msg }: ScriptParams) => {
  if (!sourceEntity) return;

  const ent = Terra.getEntityCache(sourceEntity);
  const duration = parseInt(msg[0]) ?? 0;

  system.run(() => ent.setOnFire(duration));
});

// Money Script
Script.add("add_rep", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.addRep(amount);
});
Script.add("reset_rep", ({ sourceEntity }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);

  sp.setRep(0);
});
Script.add("set_rep", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const value: number = parseInt(msg[0]) ?? 0;

  sp.setRep(value);
});
Script.add("min_rep", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.minRep(amount);
});

// Stamina Script
Script.add("add_stamina", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.addStamina(amount);
});
Script.add("set_stamina", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const value: number = parseInt(msg[0]) ?? 0;

  sp.setStamina(value);
});
Script.add("min_stamina", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.minStamina(amount);
});

// Status Script
Script.add("add_status", ({ sourceEntity, rawMsg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const msg = rawMsg;

  const name: string = msg[0] ?? "";
  if (name === "") return;

  const duration: number = parseInt(msg[1]) ?? 1;
  const lvl: number = parseInt(msg[2]) ?? 1;
  const type: StatusTypes = Object.values(StatusTypesEnum).includes(msg[3] as StatusTypes)
    ? (msg[3] as StatusTypes)
    : "none";
  const stack: boolean = Boolean(msg[4]) ?? false;
  const decay: StatusDecay = Object.values(StatusDecayEnum).includes(msg[5] as StatusDecay)
    ? (msg[5] as StatusDecay)
    : "time";

  try {
    sp.status.addStatus(name, duration, { type, lvl, decay, stack });
  } catch (error: { message: string } | any) {
    console.warn("[System] Script event add_status error: " + error.message);
  }
});
Script.add("clear_status", ({ sourceEntity }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  Terra.getSpecialistCache(sourceEntity).status.clearData();
});

// Thirst Script
Script.add("add_thirst", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.addThirst(amount);
});
Script.add("set_thirst", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const value: number = parseInt(msg[0]) ?? 0;

  sp.setThirst(value);
});
Script.add("set_to_max_thirst", ({ sourceEntity }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);

  sp.setToMaxThirst();
});
Script.add("set_thirst", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const value: number = parseInt(msg[0]) ?? 0;

  sp.setThirst(value);
});
Script.add("min_thirst", ({ sourceEntity, msg }: ScriptParams) => {
  if (!(sourceEntity instanceof Player)) return;

  const sp = Terra.getSpecialistCache(sourceEntity);
  const amount: number = parseInt(msg[0]) ?? 0;

  sp.minThirst(amount);
});
