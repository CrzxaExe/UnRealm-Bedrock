import { Entity as mcEntity, Player } from "@minecraft/server";
import { Specialist, Weapon } from "../../ZxraLib/module";
import { Bringer, Cenryter, Reaper } from "../module";

// Bringer
Weapon.addHitPasif("bringer", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  Reaper.reap(sp, (_: unknown, healFunction: ReaperHealFunction) => {
    healFunction?.(1);
  });
});
Weapon.addKillPasif("bringer", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  Bringer.pasif(user, sp);
});

// Cenryter
Weapon.addHitPasif("cenryter", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  const pasif = Cenryter.pasif(user);

  Reaper.reap(sp, (entity: mcEntity, healFunction: ReaperHealFunction) => {
    healFunction?.(entity.getComponent("onfire") ? 1 * pasif : 1);
  });
});
