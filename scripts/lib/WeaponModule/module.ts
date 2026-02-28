// #####################################################################
// # Need ZxraLib
// #####################################################################

// Data exports
export * as weaponData from "./data/all";
export * as weaponRaw from "./data/raw";

// Pasif exports

// Skill exports
export { Boltizer } from "./ability/Boltizer";
export { Destiny } from "./ability/Destiny";
export { EpicWeapon } from "./ability/EpicWpn";
export { Kyle } from "./ability/Kyles";
export { Liberator } from "./ability/Liberator";
export { LegendWeapon } from "./ability/LegendWpn";
export { Mudrock } from "./ability/Mudrock";
export { RareWeapon } from "./ability/RareWpn";

// Traits exports
export { WeaponTrait } from "./traits/weapon";

import "./pasif/unique";
import "./pasif/epic";
import "./pasif/legend";
import "./pasif/rare";
