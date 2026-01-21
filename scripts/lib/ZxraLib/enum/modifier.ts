export const ModifierTypeEnums = {
  All: "all",
  Axe: "axe",
  Hoe: "hoe",
  Pickaxe: "pickaxe",
  Sword: "sword",
} as const;

export type ModifierTypes = ObjectValues<typeof ModifierTypeEnums>;

export const ModifierActiveActionsEnum = {
  AfterBreak: "after_break",
  BeforeBreak: "before_break",
  AfterHit: "after_hit",
  BeforeHit: "before_hit",
  Kill: "kill",
};

export type ModifierActiveActions = ObjectValues<typeof ModifierActiveActionsEnum>;
