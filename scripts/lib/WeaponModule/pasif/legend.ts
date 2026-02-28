import { Player, Entity as mcEntity } from "@minecraft/server";
import { Weapon, Specialist, Terra } from "../../ZxraLib/module";
import { LegendWeapon, weaponRaw, WeaponTrait } from "../module";

// Cervant
Weapon.addHitPasif("cervant", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  const data = sp.getSp().weapons.find((e) => e.weapon === "cervant") ?? weaponRaw.legend.cervant;
  const ent = Terra.getEntityCache(target);
  const stack = LegendWeapon.Cervant.pasif(ent, sp, data);

  // Sharped state
  if (sp.status.hasStatus({ name: "cervant_sharped" })) {
    ent.addDamage((data.atk + stack) * LegendWeapon.Cervant.skill2Pasif(sp, data), {
      cause: "entityAttack",
      damagingEntity: user,
      isSkill: false,
    });

    if (stack + 1 < 5)
      ent.status.addStatus("sharp_slice", 5, { type: "stack", decay: "time", lvl: stack + 1, stack: false });

    return;
  }

  ent.getEntityWithinRadius(1.5).forEach((e) => {
    const subEnt = Terra.getEntityCache(e);
    const subStack = LegendWeapon.Cervant.pasif(subEnt, sp, data);

    subEnt.addDamage(data.atk + subStack, {
      cause: "entityAttack",
      damagingEntity: user,
      isSkill: false,
    });
  });
});

// Lighter
Weapon.addHitPasif(
  "lighter",
  (user: Player, target: mcEntity, { sp, multiplier }: { sp: Specialist; multiplier: number }) => {
    const data = sp.getSp().weapons.find((e) => e.weapon === "cervant") ?? weaponRaw.legend.lighter;

    LegendWeapon.Lighter.pasif(target, user, data.atk, multiplier, data);
  }
);
