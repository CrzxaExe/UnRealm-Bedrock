import { Player, Entity as mcEntity } from "@minecraft/server";
import { Specialist, Terra, Weapon } from "../../ZxraLib/module";
import { WeaponTrait } from "../module";

Weapon.addHitPasif("greatsword", (_: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  WeaponTrait.greatsword(target, sp, 11, sp.rune.getRuneStat(), 1);
});

Weapon.addHitPasif("hammer", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  WeaponTrait.hammer(target, user, 7, sp.rune.getRuneStat(), 1);
});

Weapon.addHitPasif("katana", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  const ent = Terra.getEntityCache(target);
  if (!ent.hasDebuffEffect() || !target.isOnGround) return;

  ent.addDamage(4, { cause: "entityAttack", damagingEntity: user, rune: sp.rune.getRuneStat() });
});

Weapon.addHitPasif("reaper", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  WeaponTrait.reaper(sp, (_: unknown, healFunction: ReaperHealFunction) => {
    healFunction?.(1);
  });
});

Weapon.addHitPasif("spear", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  WeaponTrait.spear(target, user, 7, sp.rune.getRuneStat(), 1);
});
