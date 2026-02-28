import { ItemReleaseUseAfterEvent, world } from "@minecraft/server";

import "../weapon/epic";
import "../weapon/legend";
import "../weapon/rare";
import "../weapon/unique";

import { CreateObject, Terra, Weapon } from "../ZxraLib/module";

world.afterEvents.itemReleaseUse.subscribe(async ({ itemStack, source, useDuration }: ItemReleaseUseAfterEvent) => {
  try {
    const skill = Weapon.getSkill(itemStack?.typeId.split(":")[1]);

    const sp = Terra.getSpecialistCache(source),
      vel = source.getVelocity();

    if (!skill) return;
    sp.cooldown.addCd("stamina_regen", Terra.world.setting?.staminaAction || 3);

    skill.callback(source, {
      sp,
      vel,
      velocity: CreateObject.createVelocityPlayer(source),
      useDuration: useDuration / 20,
      multiplier: sp.status.decimalCalcStatus(
        { type: "skill" },
        sp.status.decimalCalcStatus({ type: "attack" }, 1, 0.01),
        0.01
      ),
    });
  } catch (error: { message: string } | any) {
    console.warn("[System] Error on Event ItemReleaseuse" + error.message);
  }
});
