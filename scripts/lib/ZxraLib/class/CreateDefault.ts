import { Entity, Player, Vector3 } from "@minecraft/server";
import {
  BossChallengeData,
  defaultEntity,
  defaultPity,
  defaultSpecialist,
  EntityData,
  LeaderboardData,
  npcFile,
  Parser,
  PityPlayer,
  settings,
  SpecialistData,
  Terra,
  WeaponComponent,
} from "../module";

/**
 * Utility class to create default data
 */
class CreateObject {
  /**
   * Create default entity data
   *
   * @param entity Entity, minecraft entity
   * @returns EntityData
   */
  static createEntity(entity: Entity): EntityData {
    const data: EntityData = Parser.clone(defaultEntity) as EntityData;
    data.id = entity.id;
    return data;
  }

  /**
   * Create default specialist data for player
   * @param player
   * @returns Specialist data
   */
  static createSpecialist(player: Player): SpecialistData {
    const data: SpecialistData = Parser.clone(defaultSpecialist) as SpecialistData;
    data.id = player.id;
    return data;
  }

  /**
   * Generate uuid with set of length
   *
   * @param length number, positive only
   * @returns string
   */
  static createUUID(length: number = Terra.world.setting?.uuidLength || 12): string {
    if (length < 0) length = Terra.world.setting.uuidLength || 12;
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    let result: string = "";
    for (let i = 0; i <= length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  }

  /**
   * Create default pity player data
   *
   * @param player Player
   * @returns PityPlayer
   */
  static createPity(player: Player): PityPlayer {
    const data: PityPlayer = Parser.clone(defaultPity) as PityPlayer;
    data.id = player.id;
    return data;
  }

  /**
   * Create default leaderboard data
   *
   * @returns LeaderboardData
   */
  static createLeaderboard(): LeaderboardData {
    return { chat: [], deaths: [], kills: [] };
  }

  /**
   * Create default weapon component of player
   *
   * @param id string, player id
   * @returns WeaponComponent
   * @throws when id is empty string
   */
  static createWeaponComponent(id: string): WeaponComponent {
    if (id === "") throw new Error("Invalid id");
    return { id, components: [], attributes: [] };
  }

  /**
   * Create default boss challange data
   *
   * @param entity Entity
   * @returns BossChallangeData
   */
  static createBossChallenge(entity: Entity): BossChallengeData {
    return { boss: entity, participants: [] };
  }

  /**
   * Create default velocity for player
   *
   * @param player Player
   * @returns Vector3
   */
  static createVelocityPlayer(player: Player): Vector3 {
    const rot = player.getRotation();
    rot.y = ((rot.y + 45) * Math.PI) / 180;

    const velocity = {
      x: (Math.cos(rot.y) - Math.sin(rot.y)) * 1,
      y: 0,
      z: (Math.sin(rot.y) + Math.cos(rot.y)) * 1,
    };

    return velocity;
  }

  /**
   * Create default npc data for entity
   *
   * @param entity Entity
   * @param data EntityData, optional
   * @returns EntityData
   */
  static createNpcData(entity: Entity, data: EntityData | undefined = Terra.getDataEntity(entity.id)): EntityData {
    const defaultModels = npcFile[entity.typeId.split(":")[1]] || undefined;

    if (!data) {
      data = CreateObject.createEntity(entity);
    }

    data.skins = defaultModels.models.skins;
    data.components = defaultModels.models.components;
    return data;
  }

  /**
   * Create default settings data
   *
   * @returns cloned settings object
   */
  static createSettings(): typeof settings {
    return Parser.clone(settings) as typeof settings;
  }
}

export { CreateObject };
