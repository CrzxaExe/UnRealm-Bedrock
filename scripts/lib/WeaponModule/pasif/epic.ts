import { Entity as mcEntity, Player } from "@minecraft/server";
import { Specialist, Weapon } from "../../ZxraLib/module";
import { EpicWeapon, WeaponTrait } from "../module";

// Bringer
Weapon.addHitPasif("bringer", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  WeaponTrait.reaper(sp, (_: unknown, healFunction: ReaperHealFunction) => {
    healFunction?.(1);
  });
});
Weapon.addKillPasif("bringer", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  EpicWeapon.Bringer.pasif(user, sp);
});

// Cenryter
Weapon.addHitPasif("cenryter", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  const pasif = EpicWeapon.Cenryter.pasif(user);

  WeaponTrait.reaper(sp, (entity: mcEntity, healFunction: ReaperHealFunction) => {
    healFunction?.(entity.getComponent("onfire") ? 1 * pasif : 1);
  });
});

// Undying
Weapon.addKillPasif("undying", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  EpicWeapon.Undying.pasif(user, target);
});
