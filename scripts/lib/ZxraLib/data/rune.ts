import { Player, Entity as mcEntity } from "@minecraft/server";
import { Entity, RuneStats, Terra } from "../module";

export const runeList: { [key: string]: RuneStats[] } = {
  gold_coin: [
    {
      // 1
      moneyDrop: 0.1,
      atk: 0.18,
    },
  ],

  silence_amulet: [
    {
      // 2
      atk: 0.08,
      onHit(player: Player, target: mcEntity): void {
        Terra.getEntityCache(target).status.addStatus("silence_amulet", 3, {
          type: "silence",
          decay: "time",
          lvl: 1,
          stack: false,
        });
      },
    },
  ],

  fire_emblem: [
    {
      // 3
      fireFragile: 0.24,
      atk: 0.08,
    },
  ],

  sharpness: [
    {
      // 4
      atkFlat: 3,
    },
  ],

  bloody_tear: [
    {
      // 5
      onHit(player: Player): void {
        Terra.getEntityCache(player).heal(1);
      },
    },
  ],

  fire_amulet: [
    {
      // 6
      onHit(player: Player, target: any): void {
        target.setOnFire(2);
      },
    },
  ],

  lucky_pin: [
    {
      // 7
      critChance: 0.17,
      critDamage: 0.38,
    },
  ],

  art_ring: [
    {
      // 8
      artFragile: 0.29,
      skill: 0.21,
    },
  ],

  obsidian_syal: [
    {
      // 9
      skillDamageReduction: 0.23,
      skillDamageReductionFlat: 1,
    },
  ],

  fire_crystal: [
    {
      // 10
      fireFragile: 0.17,
      skill: 0.06,
    },
  ],

  blue_fire_crystal: [
    {
      // 11
      fireFragile: 0.25,
      atk: 0.09,
    },
  ],

  atletic_ring: [
    {
      // 12
      staminaReduction: 0.2,
      skillDodge: 0.12,
    },
  ],

  steel_heart: [
    {
      // 13
      skillDamageReduction: 0.32,
    },
  ],

  coin_emblem: [
    {
      // 14
      atk: 0.1,
      critChance: 0.12,
      critDamage: 0.18,
    },
  ],

  silence_aura: [
    {
      // 15
      onHited(player: Player, target: any): void {
        Terra.getEntityCache(target).status.addStatus("silence_shield_shard", 3, {
          type: "silence",
          decay: "time",
          lvl: 1,
          stack: false,
        });
      },
    },
  ],

  thief_speciality: [
    {
      // 16
      moneyDrop: 0.15,
      healingEffectivity: 0.22,
    },
  ],

  poisoned_slop: [
    {
      // 17
      skillDodge: 0.09,
      onHit(player: Player, target: any): void {
        if (
          player
            .getComponent("inventory")
            ?.container.getSlot(player.selectedSlotIndex)
            ?.getItem()
            ?.getTags()
            ?.includes("dagger")
        ) {
          Terra.getEntityCache(target).addEffectOne("poison", 5, 2);
        }
      },
    },
  ],

  agility_gear: [
    {
      // 18
      atk: 0.14,
      onKill(player: Player): void {
        Terra.getEntityCache(player).addEffectOne("speed", 1, 0);
      },
    },
  ],

  weak_point_glasses: [
    {
      // 19
      onHit(player: Player, target: any): void {
        Terra.getEntityCache(target).addEffectOne("weakness", 2, 0);
      },
    },
  ],

  fire_flower: [
    {
      // 20
      fireFragile: 0.16,
      onHited(player: Player): void {
        Terra.getEntityCache(player).addEffectOne("fire_resistance", 0.5, 0);
      },
    },
  ],

  destruction_path: [
    {
      // 21
      skill: 0.13,
      onKill(player: Player, target: any): void {
        target.dimension.createExplosion(target.location || player.location, 3, {
          breaksBlocks: false,
          source: player,
        });
      },
    },
  ],

  xiyanite_crystal: [
    {
      // 22
      atk: 0.1,
      skill: 0.06,
      onHit(player: Player, target: any): void {
        Terra.getEntityCache(target).status.addStatus("xiyanite_silence", 2, {
          type: "silence",
          decay: "time",
          lvl: 1,
          stack: false,
        });
        Terra.getEntityCache(player).heal(1);
      },
    },
  ],

  flame_tome: [
    {
      // 23
      fireFragile: 0.29,
      atk: 0.05,
      skill: 0.06,
    },
  ],
};
