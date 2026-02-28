import { Modifiers } from "../module";

export const all: Modifiers = {};

export const axe: Modifiers = {
  life_parser: [
    [
      { stat: "hp_percentage", value: 0.08 },
      { stat: "cooldown", value: 5 },
    ],
    [
      { stat: "hp_percentage", value: 0.16 },
      { stat: "cooldown", value: 4 },
    ],
    [
      { stat: "hp_percentage", value: 0.2 },
      { stat: "cooldown", value: 3 },
    ],
  ],
  shock: [
    [
      { stat: "stun_duration", value: 1 },
      { stat: "amplifier", value: 2 },
    ],
    [
      { stat: "stun_duration", value: 2 },
      { stat: "amplifier", value: 3 },
    ],
  ],
};

export const hoe: Modifiers = {
  experiencer: [
    [{ stat: "amount", value: 3 }],
    [{ stat: "amount", value: 6 }],
    [{ stat: "amount", value: 9 }],
    [{ stat: "amount", value: 12 }],
    [{ stat: "amount", value: 15 }],
  ],
  replanter: [[{ stat: "none", value: 0 }]],
};

export const mace: Modifiers = {
  half_life: [[{ stat: "heal", value: 3 }], [{ stat: "heal", value: 5 }], [{ stat: "heal", value: 8 }]],
};

export const pickaxe: Modifiers = {
  chain_break: [[{ stat: "length", value: 3 }], [{ stat: "length", value: 4 }], [{ stat: "length", value: 5 }]],
  explosion: [[{ stat: "level", value: 1.5 }]],
  extractor: [[{ stat: "chance", value: 20 }], [{ stat: "chance", value: 30 }], [{ stat: "chance", value: 35 }]],
};

export const sword: Modifiers = {
  benefit: [
    [
      { stat: "duration", value: 2 },
      { stat: "amplifier", value: 0 },
    ],
    [
      { stat: "duration", value: 4 },
      { stat: "amplifier", value: 0 },
    ],
    [
      { stat: "duration", value: 5 },
      { stat: "amplifier", value: 1 },
    ],
  ],
  fire_spreader: [
    [
      { stat: "radius", value: 1.5 },
      { stat: "duration", value: 3 },
    ],
    [
      { stat: "radius", value: 2 },
      { stat: "duration", value: 3 },
    ],
    [
      { stat: "radius", value: 2.5 },
      { stat: "duration", value: 4 },
    ],
  ],
  slashing: [[{ stat: "damage", value: 2 }], [{ stat: "damage", value: 3 }], [{ stat: "damage", value: 5 }]],
  poison: [[{ stat: "amplifier", value: 1 }], [{ stat: "amplifier", value: 2 }]],
  vampire: [[{ stat: "heal", value: 1 }], [{ stat: "heal", value: 2 }], [{ stat: "heal", value: 3 }]],
};
