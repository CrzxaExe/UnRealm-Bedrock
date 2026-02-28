export const StatusDecayEnum = {
  Time: "time",
  None: "none",
  Stack: "stack",
} as const;

export type StatusDecay = ObjectValues<typeof StatusDecayEnum>;

export const StatusTypesEnum = {
  AntiHeal: "anti_heal",
  ArtFragile: "art_fragile",
  Attack: "attack",
  Bind: "bind",
  ElementalFragile: "elemental_fragile",
  Electrify: "electrify",
  FireFragile: "fire_fragile",
  Fragile: "fragile",
  MudrockShield: "mudrock_shield",
  None: "none",
  Silence: "silence",
  Skill: "skill",
  StaminaRecovery: "stamina_recovery",
  StaminaStuck: "stamina_stuck",
  Stack: "stack",
  State: "state",
  Stun: "stun",
  ThirstRecovery: "thirst_recovery",
  Wet: "wet",
} as const;

export type StatusTypes = ObjectValues<typeof StatusTypesEnum>;
