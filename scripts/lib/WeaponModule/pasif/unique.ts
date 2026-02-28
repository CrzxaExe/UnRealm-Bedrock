import { EntityHealthComponent, Entity as mcEntity, MolangVariableMap, Player } from "@minecraft/server";
import { Specialist, Terra, Weapon } from "../../ZxraLib/module";
import { Boltizer, Destiny, Liberator, weaponData, weaponRaw, WeaponTrait } from "../module";

// Boltizer
Weapon.addHitPasif("boltizer", (user: Player, target: mcEntity, { damage }: { damage: number }) => {
  const weapon =
    Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "boltizer") ?? weaponRaw.unique.boltizer;

  Boltizer.pasif2(
    user,
    Terra.getEntityCache(target).getChainedEntityFromDistance(
      3,
      weaponData.unique.boltizer.pasifLvl[1]![weapon.pasifLvl[1]!].find((e) => e.name === "chain_length")!.value ?? 2,
      [user.id]
    ),
    1,
    weapon,
    Terra.getSpecialistCache(user).rune.getRuneStat().atk ?? 1
  );
});

// Destiny
Weapon.addHitPasif("destiny", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  const weapon = Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "destiny") ?? weaponRaw.unique.destiny;
  const ent = Terra.getEntityCache(target);

  const mul = Destiny.pasif2(ent, sp, weapon);
  WeaponTrait.spear(target, user, weapon.atk, sp.rune.getRuneStat(), mul);
  Destiny.pasif1(ent, sp, weapon);
});

// Liberator
Weapon.addHitPasif("liberator", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  const stack = sp.status.getStatus({ name: "soul_of_death" })[0]?.lvl ?? 0;
  const weapon =
    Terra.getSpecialist(user.id)?.weapons.find((e) => e.weapon === "liberator") ?? weaponData.unique.liberator;
  const pasif2 = Liberator.pasif2(user)!;

  const healAmount = 1 + stack;

  WeaponTrait.reaper(sp, (entity: mcEntity, healFunction: ReaperHealFunction) => {
    const ent = Terra.getEntityCache(entity);

    ent.particles({
      particle: "cz:gray_slash",
      location: entity.location,
      molang: new MolangVariableMap(),
    });

    if (entity.typeId !== "cz:angel") {
      healFunction?.(healAmount);
      ent.addDamage(weapon.atk, { cause: "entityAttack", damagingEntity: user, isSkill: false });
      return;
    }

    ent.heal((entity.getComponent("health")?.defaultValue || 28) * pasif2);
    healFunction?.(healAmount + 4);
  });
});
Weapon.addKillPasif("liberator", (user: Player, _: unknown, { sp }: { sp: Specialist }) => {
  const data = sp.getSp().weapons.find((e) => e.weapon === "liberator") ?? weaponRaw.unique.liberator;

  const maxStack =
    weaponData.unique.liberator.pasifLvl[0][data.pasifLvl[0]].find((e) => e.name === "max_stack")?.value ?? 3;

  let stack = sp.status.getStatus({ name: "soul_of_death" })[0]?.lvl ?? 0;
  if (stack >= maxStack) return;

  sp.status.addStatus("soul_of_death", 1, { type: "stack", decay: "none", lvl: 1, stack: true });
});

// Kyle
Weapon.addHitPasif("kyles", (user: Player, target: mcEntity, { sp }: { sp: Specialist }) => {
  const hp = user.getComponent("health") as EntityHealthComponent;
  const hpPercentage: number = WeaponTrait.slayerLostHPPercentation(user);

  const rune = sp.rune.getRuneStat();

  Terra.getEntityCache(target).addDamage((hp.defaultValue ?? 20) * hpPercentage, {
    cause: "void",
    damagingEntity: user,
    isSkill: false,
    rune,
  });
});
Weapon.addHitedPasif("kyles", (user: Player, _: unknown, { sp, damage }: { sp: Specialist; damage: number }) => {
  const stack = sp.status.getStatus({ name: "zelxt_point" })[0]?.lvl ?? 0;

  sp.status.addStatus("zelxt_point", 1, {
    type: "stack",
    decay: "none",
    stack: true,
    lvl: Math.abs(stack + damage > 200 ? 200 - stack : damage),
  });
});
