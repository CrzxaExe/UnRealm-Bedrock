import { Player } from "@minecraft/server";
import { SkillLib, Weapon } from "../ZxraLib/module";
import { EpicWeapon } from "../WeaponModule/module";

Weapon.registerSkill("undying", (user: Player, lib: SkillLib) => {
  if (user.isSneaking && user.isOnGround) {
    EpicWeapon.Undying.skill2(user, lib);
  } else if (!user.isOnGround) {
    EpicWeapon.Undying.skill3(user, lib);
  } else {
    EpicWeapon.Undying.skill1(user, lib);
  }
});
