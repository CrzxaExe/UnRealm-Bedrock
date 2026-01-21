import { Modifier, modifierDataList } from "../module";

export const commandEnums: CommandEnumTypeStrict = {
  "cz:statustype": [
    "anti_heal",
    "art_fragile",
    "attack",
    "elemental_fragile",
    "fire_fragile",
    "fragile",
    "mudrock_shield",
    "none",
    "silence",
    "skill",
    "stamina_recovery",
    "stamina_stuck",
    "stack",
    "state",
    "stun",
    "thirst_recovery",
    "wet",
  ],
  "cz:statusdecay": ["none", "stack", "time"],
  "cz:modifiers": [
    // ...[
    //   ...Object.keys(modifierDataList)
    //     .map((e: string) => [...Object.keys(modifierDataList[e as keyof typeof modifierDataList])])
    //     .flat(),
    // ],

    ...Modifier.mod.map((e) => e.name),
  ],
};
