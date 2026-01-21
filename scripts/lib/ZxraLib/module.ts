/*
////////////////////////////////////////////////////////////////////////////////////////////////
// ZxraLib | CrzxaExe | Minecraft Library
////////////////////////////////////////////////////////////////////////////////////////////////
*/

export const ZxraLib: {
  packVersion: string;
  plugins: PluginsData[];
} = {
  packVersion: "1.4.1",
  plugins: [
    {
      name: "ZxraLib",
      namespace: "cz",
      endpoint: {
        in: "req",
        out: "res",
      },
      version: "1.1.7ts",
    },
    {
      name: "WeaponModule",
      namespace: "czwpn",
      endpoint: {
        in: "req",
        out: "res",
      },
      version: "1.0.3",
    },
  ],
};
export { settings } from "./data/setting";

// Class export
export { Calc, SpecialistLevelUp } from "./class/Calc";
export { Chat } from "./class/Chat";
export { BlockContainer, ItemContainer, ItemInventory, PlayerContainers } from "./class/Container";
export { Cooldown } from "./class/Cooldown";
export { CreateObject } from "./class/CreateDefault";
export { Command, Modifier, Script, SpecialItem, Weapon } from "./class/DataClass";
export { Entity } from "./class/Entity";
export { Formater } from "./class/Formater";
export { Gacha } from "./class/Gacha";
export { Guild } from "./class/Guild";
export { Item } from "./class/Item";
export { Leaderboard } from "./class/Leaderboard";
export { Parser } from "./class/Parser";
export { Quest } from "./class/Quest";
export { BlockRegister, ItemRegister } from "./class/Registry";
export { Rune } from "./class/Rune";
export { Specialist } from "./class/Specialist";
export { Status } from "./class/Status";
export { Terra } from "./class/Terra";

// Data export
export * as modifierDataList from "./data/modifier";
export { damageColor, rarityColor } from "./data/color";
export { RUNE_GACHA_PRICE, SURVIVE_MODE, WEAPON_GACHA_PRICE } from "./data/constant";
export { NOT_ALLOWED_ENTITY_TICK, NOT_VALID_ENTITY } from "./data/entityFilters";
export { gachaFeatured, gachaPolls, GachaRarity } from "./data/gacha";
export { npcFile } from "./data/npc";
export { questIndex } from "./data/quest";
export { defaultEntity, defaultPity, defaultRuneStat, defaultSpecialist } from "./data/raw";
export { runeList } from "./data/rune";
export { guildShop } from "./data/shop";

// Enums export
export { Currency, CurrencyEnums } from "./enum/currency";
export { BzbEntity } from "./enum/entity";
export { ModifierActiveActions, ModifierActiveActionsEnum, ModifierTypeEnums, ModifierTypes } from "./enum/modifier";
export { StatusDecay, StatusDecayEnum, StatusTypes, StatusTypesEnum } from "./enum/status";
export { WeaponTypes } from "./enum/weaponTypes";

// Function export
export { durabilityControl } from "./function/durabilityControl";

// NPC Models export
export { Iyura } from "./npc/models/Iyura";
export { Yuri } from "./npc/models/Yuri";

// Types export
export type {
  AntiHealData,
  BossChallengeData,
  BossChallangeParticipant,
  CooldownData,
  CommandCallback,
  CommandData,
  EffectCreate,
  EntityData,
  FullWorldData,
  ItemSpecial,
  LbData,
  LeaderboardData,
  LeaderboardSystemType,
  LeaderboardType,
  Modifiers,
  ModifierData,
  ModifierList,
  ModifierStats,
  QuestConst,
  QuestController,
  QuestData,
  QuestFind,
  QuestPlayer,
  QuestRewards,
  QuestTask,
  QuestType,
  Particle,
  PasifData,
  PasifHit,
  PasifHited,
  PasifKill,
  PityPlayer,
  PlayerFinder,
  PluginsData,
  RuneAction,
  RedeemData,
  RedeemRewards,
  RuneStats,
  Scripts,
  ScriptParams,
  Setting,
  SettingRules,
  SettingStarterItem,
  ShopItem,
  ShopCategory,
  SkillLib,
  StatusData,
  StatusFinder,
  StoryData,
  StoryProgress,
  WeaponAttribute,
  WeaponAttributetype,
  WeaponComponent,
  WeaponComponentData,
  WeaponComponentDataValue,
  WeaponStatLore,
  WeaponSkill,
  WeaponStat,
  WorldData,
} from "./types/lib";
export type { NPC, NpcModels, NpcData, YuriConst, YuriData, YuriModels } from "./types/npc";
export type { BlockRegisterData, ItemRegisterData } from "./types/registry";
export type {
  SpecialistComponent,
  SpecialistData,
  SpecialistLvl,
  SpecialistRune,
  SpecialistStamina,
  SpecialistThirst,
  SpecialistWeapon,
  SpecialistWeaponPlayer,
} from "./types/specialistTypes";

// UI exports
export { AdminPanel } from "./ui/admin";
export { GachaPanel, GuildPanel, UserPanel } from "./ui/user";

/*
 *   Imports
 */

// Script imports
import "./scriptEvents/index";

// Registry imports
import "./registry/blocks/all";
import "./registry/items/tools";
import "./registry/itemEvent/consume";
import "./registry/itemEvent/use";
import "./registry/modifiers/axe";
import "./registry/modifiers/hoe";
import "./registry/modifiers/pickaxe";
import "./registry/modifiers/sword";
import { PluginsData } from "./types/lib";

export { commandEnums } from "./data/commandEnum";
