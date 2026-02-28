import { Player } from "@minecraft/server";
import { SkillLib, Weapon } from "../ZxraLib/module";
import { LegendWeapon } from "../WeaponModule/module";

Weapon.registerSkill("cervant", (user: Player, lib: SkillLib) => {
  if (user.isSneaking) {
    LegendWeapon.Cervant.skill2(user, lib);
  } else {
    LegendWeapon.Cervant.skill1(user, lib);
  }
});

Weapon.registerSkill("lighter", (user: Player, lib: SkillLib) => {
  if (user.isJumping) {
    LegendWeapon.Lighter.skill2(user, lib);
  } else {
    LegendWeapon.Lighter.skill1(user, lib);
  }
});
