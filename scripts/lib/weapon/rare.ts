import { Player } from "@minecraft/server";
import { SkillLib, Weapon } from "../ZxraLib/module";
import { RareWeapon } from "../WeaponModule/ability/RareWpn";

Weapon.registerSkill("greatsword", (user: Player, lib: SkillLib) => {
  RareWeapon.greatswordSkill(user, lib);
});

Weapon.registerSkill("hammer", (user: Player, lib: SkillLib) => {
  RareWeapon.hammerSkill(user, lib);
});

Weapon.registerSkill("katana", (user: Player, lib: SkillLib) => {
  RareWeapon.katanaSkill(user, lib);
});

Weapon.registerSkill("spear", (user: Player, lib: SkillLib) => {
  RareWeapon.spearSkill(user, lib);
});

Weapon.registerSkill("reaper", (user: Player, lib: SkillLib) => {
  RareWeapon.reaperSkill(user, lib);
});
