import {
  EntityDieAfterEvent,
  EntityHealthChangedAfterEvent,
  EntityHitBlockAfterEvent,
  EntityHitEntityAfterEvent,
  EntityHurtAfterEvent,
  Player,
  world,
} from "@minecraft/server";
import {
  damageColor,
  Formater,
  Item,
  Modifier,
  ModifierActiveActionsEnum,
  modifierDataList,
  Quest,
  Terra,
  Weapon,
} from "../ZxraLib/module";

// Entity Killed event
world.afterEvents.entityDie.subscribe(
  ({ damageSource: { cause, damagingEntity, damagingProjectile }, deadEntity }: EntityDieAfterEvent) => {
    try {
      if (deadEntity instanceof Player) {
        if (Terra.world.setting?.deathLocation)
          deadEntity.sendMessage({
            translate: "system.youDie",
            with: [`§2${Formater.formatVector3(deadEntity.location)}§r§f`],
          });

        const sp = Terra.getSpecialistCache(deadEntity);

        sp.setToMaxThirst();
        sp.resetToMaxStamina();
        sp.minRep(10);

        if (sp.status.hasStatus({ name: "zelxt_mode" })) {
          deadEntity.triggerEvent("cz:zelxt_revive");
        }

        Terra.leaderboard.addLb("deaths", deadEntity.id, 1);
      }

      if (!(damagingEntity instanceof Player)) return;

      const sp = Terra.getSpecialistCache(damagingEntity),
        tarHp = deadEntity.getComponent("health"),
        rune = sp.rune,
        runeData = rune.getRuneStat();

      sp.addSpXp(
        ((tarHp?.defaultValue || 20) / 5 + Math.floor(Math.random() * (tarHp?.defaultValue || 20)) / 6 + 1) *
          (Terra.world.setting?.xpMultiplier || 1)
      );

      Terra.leaderboard.addLb("kills", damagingEntity.id, 1);
      new Quest(damagingEntity).controller({ act: "kill", target: deadEntity, amount: 1 });

      if ((runeData.moneyDrop || 0) > 0) sp.addMoney(runeData.moneyDrop);

      rune.getRuneActiveStat("onKill").forEach((e) => {
        e?.(damagingEntity, deadEntity);
      });
      const item = damagingEntity.getComponent("inventory")?.container?.getItem(damagingEntity.selectedSlotIndex);

      if (!item) return;

      const itemPasif = Weapon.Pasif.kill.find((e) => item.typeId.split(":")[1] === e.name);

      if (!itemPasif) return;

      itemPasif.callback(damagingEntity, deadEntity, {
        sp,
        multiplier: sp.status.decimalCalcStatus({ type: "attack" }, 1, 0.01),
      });
    } catch (error: { message: string } | any) {
      console.warn("[System] Error on Event EntityDie: " + error.message);
    }
  }
);

// Entity Hit event
world.afterEvents.entityHitEntity.subscribe(
  ({ damagingEntity, hitEntity }: EntityHitEntityAfterEvent) => {
    if (!(damagingEntity instanceof Player)) return;

    const item =
      damagingEntity.getComponent("inventory")?.container?.getItem(damagingEntity.selectedSlotIndex) || undefined;

    const sp = Terra.getSpecialistCache(damagingEntity);

    sp.cooldown.addCd("stamina_regen", Terra.world.setting?.staminaExhaust || 3);
    sp.minStamina(Terra.world.setting?.staminaAction || 4);
    if (!item || hitEntity == undefined || !hitEntity) return;

    const itm = new Item(item);
    const modifer = itm.getModifierByAction(ModifierActiveActionsEnum.AfterHit);

    modifer.forEach((e) => {
      const mod = Modifier.get(e.name);

      if (!mod || mod.action !== ModifierActiveActionsEnum.AfterHit) return;
      mod.callback(damagingEntity, hitEntity, {
        item,
        level: e.level,
        mod: modifierDataList[mod.type][e.name][(e.level ?? 1) - 1],
      });
    });

    try {
      sp.rune.getRuneActiveStat("onHit").forEach((e) => e?.(damagingEntity, hitEntity));

      const itemPasif = Weapon.Pasif.hit.find((e) => item.typeId.split(":")[1] === e.name);

      if (!itemPasif) return;
      itemPasif.callback(damagingEntity, hitEntity, {
        sp,
        multiplier: sp.status.decimalCalcStatus({ type: "attack" }, 1, 0.01),
      });
    } catch (error: { message: string } | any) {
      if (Terra.world.setting?.debug) console.warn("[System] Error on Event EntityHitEntity: " + error.message);
    }
  },
  {
    entityTypes: ["minecraft:player"],
  }
);

// Entity Hurt event
world.afterEvents.entityHurt.subscribe(
  ({ damage, damageSource: { damagingEntity, cause, damagingProjectile }, hurtEntity }) => {
    if (!(hurtEntity instanceof Player)) return;

    const item = hurtEntity.getComponent("inventory")?.container?.getItem(hurtEntity.selectedSlotIndex);
    const sp = Terra.getSpecialistCache(hurtEntity);

    // console.warn(cause, damage);

    if (
      (hurtEntity.getComponent("health")?.currentValue || 20) < damage &&
      sp.status.hasStatus({ name: "zelxt_mode" })
    ) {
      hurtEntity.triggerEvent("cz:zelxt_revive");
    }

    sp.cooldown.addCd("stamina_regen", Terra.world.setting?.staminaExhaust || 3);
    sp.minStamina(Terra.world.setting?.staminaAction || 4);
    if (!item || item === undefined || !damagingEntity || damagingEntity === undefined) return;

    hurtEntity.runCommand(`camerashake add @s 1.4 0.26`);

    const itemPasif = Weapon.Pasif.hited.find((e) => item.typeId.split(":")[1] === e.name);

    if (!itemPasif) return;

    try {
      itemPasif.callback(hurtEntity, damagingEntity, {
        sp,
        damage,
        multiplier: sp.status.decimalCalcStatus({ type: "attack" }, 1, 0.01),
      });
    } catch (error: { message: string } | any) {
      if (Terra.world.setting?.debug) console.warn("[System] Error on Event EntityHurt: " + error.message);
    }
  },
  {
    entityTypes: ["minecraft:player"],
  }
);

world.afterEvents.entityHurt.subscribe(({ hurtEntity, damage, damageSource: { cause } }: EntityHurtAfterEvent) => {
  if (!Terra.world.setting?.damageIndicator) return;

  try {
    const indicator = hurtEntity.dimension.spawnEntity("cz:indicator", {
      ...hurtEntity.location,
    });

    indicator.nameTag = `${cause in damageColor ? damageColor[cause as keyof typeof damageColor] : ""}${damage.toFixed(
      0
    )}`;
  } catch (error: { message: string } | any) {
    if (!Terra.world.setting?.debug) return;
    console.warn("[System] Error on EventHurt: " + error.message);
  }
});

world.afterEvents.entityHitBlock.subscribe(({ hitBlock }: EntityHitBlockAfterEvent) => {
  // console.warn(hitBlock.typeId);
});

world.afterEvents.entityHealthChanged.subscribe(
  ({ newValue, oldValue, entity }: EntityHealthChangedAfterEvent) => {
    if (newValue === oldValue) return;

    if (!(entity instanceof Player)) return;
    // if (Terra.getEntityAntiHealStatus(entity.id)) {
    //   entity.getComponent("health")?.setCurrentValue(oldValue);
    // }

    // console.warn(oldValue, newValue);
  },
  { entityTypes: ["minecraft:player"] }
);
