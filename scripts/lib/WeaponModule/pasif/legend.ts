import { Player, Entity as mcEntity } from "@minecraft/server";
import { Weapon, Specialist, Terra } from "../../ZxraLib/module";
import { weaponRaw } from "../module";
import { Cervant } from "../ability/Cervant";
import { Lighter } from "../ability/Lighter";

// Cervant
Weapon.addHitPasif("cervant", (_: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  const data = sp.getSp().weapons.find((e) => e.weapon === "cervant") ?? weaponRaw.legend.cervant;

  const ent = Terra.getEntityCache(target);
  const stack = Cervant.pasif(ent, sp, data);

  ent.addDamage(data.atk + stack);
  if (stack + 1 < 5)
    ent.status.addStatus("sharp_slice", 5, { type: "stack", decay: "time", lvl: stack + 1, stack: false });
});

// Lighter
Weapon.addHitPasif(
  "lighter",
  (user: Player, target: mcEntity, { sp, multiplier }: { sp: Specialist; multiplier: number }) => {
    const data = sp.getSp().weapons.find((e) => e.weapon === "cervant") ?? weaponRaw.legend.lighter;

    Lighter.pasif(target, user, data.atk, multiplier, data);
  }
);
