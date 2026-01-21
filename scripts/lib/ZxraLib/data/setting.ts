import { Setting } from "../module";

export const settings: Setting = {
  // chain break modifier block list.
  chainBreakFilter: [
    "cz:chlorophyte_ore",
    "cz:dexterite_ore",
    "cz:ender_ore",
    "minecraft:ancient_debris",
    "minecraft:coal_ore",
    "minecraft:copper_ore",
    "minecraft:diamond_ore",
    "minecraft:deepslate_coal_ore",
    "minecraft:deepslate_copper_ore",
    "minecraft:deepslate_diamond_ore",
    "minecraft:deepslate_emerald_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:deepslate_lapis_ore",
    "minecraft:deepslate_redstone_ore",
    "minecraft:emerald_ore",
    "minecraft:gold_ore",
    "minecraft:iron_ore",
    "minecraft:lapis_ore",
    "minecraft:redstone_ore",
  ],
  // chat settings
  customChat: true,
  /* placeholder for custom chat prefix
      %lvl      = player level
      %guild    = guild name
      %msg      = message content
      %name     = player username
      %splvl    = specialist level
      %title    = specialist title
  */
  customChatPrefix: "%guild%name\n%msg",
  // if true, every damage applier will summon float text of damage
  damageIndicator: true,
  // Player will get their death location
  deathLocation: true,
  // if true, debuging mode will active
  debug: true,
  // Price to create guild(in money)
  guildCreateCost: 2_000,
  // default gamerules for this addon
  rules: {
    naturalregeneration: false,
    recipesunlock: false,
    showcoordinates: true,
    spawnradius: 1,
  },
  // interval between saving data on minecraft tick, 1s rl is 20 tick
  saveInterval: 24000, // 120 sec
  // multiplier for all shop
  shopMultiplier: 1.0,
  // Amount of stamina that will decrease while do some activity
  staminaAction: 5,
  // After some activity, it will stop regen the stamina after some minutes
  staminaCooldown: true,
  // Time of stamina to regen after some activity
  staminaExhaust: 3,
  // Amount of stamina loss while being hit
  staminaHurt: 4,
  // Amount of stamina while recovery
  staminaRecovery: 2,
  // Amount of stamina that decrease while running
  staminaRun: 2.5,
  // message when player get the starter items
  starterItemMessage: "system.welcome.item",
  // list of starter item
  starterItems: [{ item: "cz:stats", amount: 1 }],
  // if true,  player first join will get item on starterItems
  staterItem: true,
  // increase the thirst down when player is running
  thirstRun: 0.03,
  // user stats features will has requirement for display something
  uiLevelRequirement: true,
  // it will force to set minecraft gamerule with bzb rules
  useBzbRules: true,
  // Length of UUID
  uuidLength: 12,
  // Multiplier when user get Specialist xp
  xpMultiplier: 1.0,
  // distance player seen block id
  whatSeeDistance: 7,
};
