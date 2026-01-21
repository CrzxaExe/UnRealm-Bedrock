import { SpecialistWeapon } from "../../ZxraLib/module";

export const unique: { [key: string]: SpecialistWeapon } = {
  kyles: {
    weapon: "kyles",
    atk: 2,
    pasifLvl: [
      [
        [
          { name: "zelxt_mode_multiplier", value: 2.4 },
          { name: "max_zelxt_point", value: 150 },
        ],
      ],
      [[{ name: "uses", value: 1 }]],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 8 },
          { name: "cooldown", value: 5 },
          { name: "zelxt_stamina", value: 12 },
          { name: "zelxt_cooldown", value: 8 },
          { name: "atk_percentage", value: 4 },
          { name: "health_percentage", value: 0.4 },
          { name: "zelxt_atk_percentage", value: 4 },
          { name: "zelxt_health_percentage", value: 0.4 },
        ],
      ],
      [
        [
          { name: "stamina", value: 14 },
          { name: "cooldown", value: 5 },
          { name: "zelxt_stamina", value: 20 },
          { name: "zelxt_cooldown", value: 7 },
          { name: "atk_percentage", value: 2.5 },
          { name: "health_percentage", value: 0.6 },
          { name: "zelxt_atk_percentage", value: 3 },
          { name: "zelxt_health_percentage", value: 0.7 },
        ],
      ],
      [
        [
          { name: "stamina", value: 10 },
          { name: "cooldown", value: 11 },
          { name: "zelxt_stamina", value: 17 },
          { name: "zelxt_cooldown", value: 20 },
          { name: "health_percentage", value: 0.6 },
          { name: "zelxt_health_percentage", value: 0.95 },
          { name: "zelxt_health_recover", value: 0.1 },
        ],
      ],
      [[{ name: "health_recover", value: 0.2 }]],
    ],
  },
  liberator: {
    weapon: "liberator",
    atk: 12,
    pasifLvl: [
      [
        [
          { name: "heal_multiplier", value: 2 },
          { name: "max_stack", value: 3 },
        ],
      ],
      [[{ name: "heal", value: 0.2 }]],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 16 },
          { name: "cooldown", value: 4.5 },
          { name: "atk_percentage", value: 1.4 },
          { name: "special_stamina", value: 26 },
          { name: "special_cooldown", value: 6 },
          { name: "special_atk_percentage", value: 1.4 },
          { name: "special_hp_percentage", value: 0.2 },
          { name: "special_summon_damage", value: 1.6 },
        ],
      ],
      [
        [
          { name: "stamina", value: 20 },
          { name: "cooldown", value: 8 },
          { name: "atk_percentage", value: 1.5 },
        ],
      ],
      [
        [
          { name: "stamina", value: 18 },
          { name: "cooldown", value: 6 },
          { name: "atk_percentage", value: 1.3 },
          { name: "consumed_multiplier", value: 0.05 },
        ],
      ],
      [
        [
          { name: "stamina", value: 24 },
          { name: "cooldown", value: 26 },
          { name: "dimension_break_buff", value: 1.3 },
        ],
      ],
    ],
  },
  boltizer: {
    weapon: "boltizer",
    atk: 9,
    pasifLvl: [
      [[{ name: "lightning_damage", value: 1.5 }]],
      [
        [
          { name: "chain_length", value: 2 },
          { name: "chain_penalty", value: 0.3 },
        ],
      ],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 14 },
          { name: "cooldown", value: 5 },
          { name: "atk_percentage", value: 1.8 },
        ],
      ],
      [],
      [
        [
          { name: "stamina", value: 26 },
          { name: "cooldown", value: 20 },
          { name: "atk_percentage", value: 2.2 },
          { name: "radius", value: 5 },
        ],
      ],
      [],
    ],
  },
  skyler: {
    weapon: "skyler",
    atk: 9,
    pasifLvl: [
      [
        [
          { name: "burn_duration", value: 10 },
          { name: "damage_increase", value: 1.2 },
        ],
      ],
      [
        [
          { name: "radius", value: 2.5 },
          { name: "burn_duration", value: 5 },
        ],
      ],
    ],
    skillLvl: [
      [],
      [],
      [],
      [
        [
          { name: "stamina", value: 24 },
          { name: "cooldown", value: 20 },
          { name: "duration", value: 10 },
          { name: "radius", value: 8 },
          { name: "atk_percentage", value: 2.4 },
          { name: "burn_damage", value: 0.5 },
        ],
      ],
    ],
  },
  lectaze: {
    weapon: "lectaze",
    atk: 11,
    pasifLvl: [
      [
        [
          { name: "stack_atk", value: 1 },
          { name: "max_stack", value: 5 },
        ],
      ],
      [[{ name: "blow_damage", value: 1.5 }]],
    ],
    skillLvl: [[], [], [], []],
  },
  mudrock: {
    weapon: "mudrock",
    atk: 11,
    pasifLvl: [
      [
        [
          { name: "stack_regenrate", value: 9 },
          { name: "heal", value: 0.15 },
        ],
      ],
      [[{ name: "increase_damage", value: 1.2 }]],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 16 },
          { name: "cooldown", value: 3.5 },
          { name: "atk_percentage", value: 2.1 },
          { name: "heal", value: 0.1 },
        ],
      ],
      [],
      [
        [
          { name: "stamina", value: 24 },
          { name: "cooldown", value: 20 },
          { name: "duration", value: 30 },
          { name: "atk_percentage", value: 3.0 },
          { name: "skill_buff", value: 0.6 },
        ],
      ],
      [],
    ],
  },
  destiny: {
    weapon: "destiny",
    atk: 11,
    pasifLvl: [[[{ name: "silence_duration", value: 3 }]], [[{ name: "atk_increase", value: 1.5 }]]],
    skillLvl: [[], [], [], []],
  },
  destreza: {
    weapon: "destreza",
    atk: 9,
    pasifLvl: [
      [
        [
          { name: "poison_damage", value: 0.3 },
          { name: "max_stack", value: 3 },
        ],
      ],
      [
        [
          { name: "spread_radius", value: 1.2 },
          { name: "blow_damage", value: 1.5 },
        ],
      ],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 10 },
          { name: "cooldown", value: 3.5 },
          { name: "melee_atk_percentage", value: 1.8 },
          { name: "ranged_atk_percentage", value: 1.5 },
        ],
      ],
      [],
      [],
      [
        [
          { name: "stamina", value: 18 },
          { name: "cooldown", value: 10 },
          { name: "duration", value: 5 },
          { name: "regeneration_lvl", value: 2 },
          { name: "resistance_lvl", value: 1 },
        ],
      ],
    ],
  },
  catlye: {
    weapon: "catlye",
    atk: 9,
    pasifLvl: [
      [
        [
          { name: "heal", value: 1.0 },
          { name: "regeneration_lvl", value: 0 },
          { name: "regeneration_duration", value: 3 },
        ],
      ],
      [
        [
          { name: "min_hp_percentage", value: 0.5 },
          { name: "healing_effectifity", value: 1.5 },
        ],
      ],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 24 },
          { name: "cooldown", value: 3 },
          { name: "atk_percentage", value: 1 },
          { name: "special_stamina", value: 30 },
          { name: "special_cooldown", value: 8 },
          { name: "special_atk_percentage", value: 1.5 },
        ],
      ],
      [
        [
          { name: "stamina", value: 30 },
          { name: "stamina_distance", value: 4 },
          { name: "distance", value: 7 },
          { name: "cooldown", value: 3 },
          { name: "atk_percentage", value: 2.5 },
        ],
      ],
      [
        [
          { name: "stamina", value: 40 },
          { name: "cooldown", value: 20 },
          { name: "atk_percentage", value: 1.0 },
        ],
      ],
    ],
  },
};

export const epic: { [key: string]: SpecialistWeapon } = {
  berserk: {
    weapon: "berserk",
    atk: 14,
    pasifLvl: [[[{ name: "max_stack", value: 70.0 }]]],
    skillLvl: [[], [], []],
  },
  bringer: {
    weapon: "bringer",
    atk: 11,
    pasifLvl: [[[{ name: "heal", value: 0.2 }]]],
    skillLvl: [
      [
        [
          { name: "stamina", value: 17 },
          { name: "cooldown", value: 6.5 },
          { name: "atk_percentage", value: 1.2 },
          { name: "force", value: 0.5 },
        ],
      ],
      [],
      [],
    ],
  },
  cenryter: {
    weapon: "cenryter",
    atk: 11,
    pasifLvl: [[[{ name: "heal_multiplier", value: 3 }]]],
    skillLvl: [
      [
        [
          { name: "stamina", value: 16 },
          { name: "cooldown", value: 5 },
          { name: "atk_percentage", value: 1.5 },
        ],
      ],
      [
        [
          { name: "stamina", value: 24 },
          { name: "cooldown", value: 12 },
          { name: "atk_buff", value: 0.05 },
          { name: "buff_duration", value: 15 },
        ],
      ],
      [],
    ],
  },
};

export const legend: { [key: string]: SpecialistWeapon } = {
  azyh: {
    weapon: "azyh",
    atk: 5,
    pasifLvl: [[[{ name: "atk_percentage", value: 2.0 }]]],
    skillLvl: [[], []],
  },
  cervant: {
    weapon: "cervant",
    atk: 9,
    pasifLvl: [
      [
        [
          { name: "atk_percentage", value: 1.0 },
          { name: "max_stack", value: 5 },
        ],
      ],
    ],
    skillLvl: [
      [
        [
          { name: "stamina", value: 20 },
          { name: "cooldown", value: 3.5 },
          { name: "normal_atk_percentage", value: 2.0 },
          { name: "shockwave_atk_percentage", value: 1.0 },
          { name: "sharped_atk_percentage", value: 1.9 },
        ],
      ],
      [
        [
          { name: "stamina", value: 24 },
          { name: "cooldown", value: 3 },
          { name: "sharped_damage_multiplier", value: 2.5 },
        ],
      ],
    ],
  },
  lighter: {
    weapon: "lighter",
    atk: 10,
    pasifLvl: [[[{ name: "atk_percentage", value: 2.5 }]]],
    skillLvl: [[], []],
  },
};

export const rare: { [key: string]: SpecialistWeapon } = {};
