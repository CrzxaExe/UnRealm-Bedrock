import {
  Dimension,
  Player,
  system,
  world,
  Entity as mcEntity,
  CustomCommandRegistry,
  BlockComponentRegistry,
  ItemComponentRegistry,
} from "@minecraft/server";
import {
  AntiHealData,
  BlockRegister,
  BlockRegisterData,
  BossChallengeData,
  Command,
  CommandData,
  CreateObject,
  Entity,
  EntityData,
  FullWorldData,
  Guild,
  ItemRegister,
  ItemRegisterData,
  Leaderboard,
  LeaderboardData,
  PityPlayer,
  PlayerFinder,
  PluginsData,
  RedeemData,
  Specialist,
  SpecialistData,
  SpecialItem,
  StoryData,
  WeaponComponent,
  WeaponComponentDataValue,
  WorldData,
} from "../module";

/**
 * Utility class to handle all data from world
 */
class Terra {
  // World data cache

  /**
   * Data of world
   *
   * @property WorldData
   * {
   *    redeem: RedeemData[],
   *    setting: WorldSetting
   * }
   */
  static world: WorldData = {
    redeem: [],
    setting: {},
  };

  /**
   * Get property from minecraft dynamic property
   * @param namespace  name of the property, default 'world'
   * @param def  default value if the property are not present
   * @returns Object
   */
  static getProperty(namespace: string = "world", def: any = {}): Object {
    const property: string | undefined = world.getDynamicProperty(namespace) as string | undefined;
    let result: Object = property ? (JSON.parse(property) ?? def) : def;

    // If result is an empty object and def is not, use def
    if (
      typeof result === "object" &&
      result !== null &&
      Object.keys(result).length === 0 &&
      typeof def === "object" &&
      def !== null &&
      Object.keys(def).length > 0
    ) {
      result = def;
    }

    return result;
  }

  /**
   * Set property to minecarft dynamic property
   * @param namespace name of the property, default 'world'
   * @param data data that want to set
   *
   * @throws when data cannot be set
   */
  static setProperty(namespace: string = "world", data: Object): void {
    try {
      world.setDynamicProperty(namespace, JSON.stringify(data));
    } catch (error: { message: string } | any) {
      throw new Error("Error on save data: " + error.message);
    }
  }

  /**
   * Setup method
   *
   * Load setting, initialize inner class, grab player contents and registering SpecialItem
   */
  static setup(): void {
    this.guild = new Guild();
    this.leaderboard = new Leaderboard();

    system.run(() => {
      this.world.guilds = this.getProperty("guild", []) as GuildData[];
      this.world.leaderboards = this.getProperty("leaderboard", CreateObject.createLeaderboard()) as LeaderboardData;
      this.world.setting = this.getProperty("setting", CreateObject.createSettings());
      this.world.redeem = this.getProperty("redeem", []) as RedeemData[];
      this.entities = this.getProperty("entities", []) as EntityData[];
      this.pityPlayer = this.getProperty("pity", []) as PityPlayer[];
      this.specialist = this.getProperty("specialist", []) as SpecialistData[];

      // Item Event Load Counter
      console.warn(
        SpecialItem.use.length > 0
          ? `[System] Load ${SpecialItem.use.length} item use event`
          : "[System] Item use event are not initialize"
      );
      console.warn(
        SpecialItem.place.length > 0
          ? `[System] Load ${SpecialItem.place.length} item place event`
          : "[System] Item place event are not initialize"
      );
      console.warn(
        SpecialItem.item.length > 0
          ? `[System] Load ${SpecialItem.item.length} item consume event`
          : "[System] Item consume event are not initialize"
      );
    });
  }

  /**
   * Reset world settings to default
   */
  static resetWorldSettingsData(): void {
    this.world.setting = CreateObject.createSettings();
    this.world.redeem = [] as RedeemData[];
  }

  /**
   * Import addon data from external JSON
   *
   * @param data data want to load (JSON)
   */
  static importDataFromJSON(data: FullWorldData): void {
    this.world.guilds = data.world.guilds as GuildData[];
    this.world.leaderboards = data.world.leaderboards as LeaderboardData;
    this.world.setting = data.world.setting;
    this.world.redeem = data.world.redeem as RedeemData[];
    this.entities = [] as EntityData[];
    this.pityPlayer = data.pityPlayer as PityPlayer[];
    this.specialist = data.specialist as SpecialistData[];
  }

  /**
   *  Export addon data from internal App
   *
   * @returns FullWorldData
   */
  static exportDataToJSON(): FullWorldData {
    const data: FullWorldData = {
      world: Terra.world,
      specialist: Terra.specialist,
      story: Terra.story,
      pityPlayer: Terra.pityPlayer,
      weaponComponent: Terra.weaponComponent,
      bossChallenge: Terra.bossChallenge ?? { boss: undefined, participants: [] },
      waveChallenge: Terra.waveChallenge,
    };

    return data;
  }

  /**
   * Registering block component to minecraft
   *
   * @param registry register function
   */
  static setupBlockComponent(registry: BlockComponentRegistry): void {
    const register = BlockRegister.register;

    if (register.length === 0) {
      console.warn("[System] No load block components, because empty register");
      return;
    }

    register.forEach((e: BlockRegisterData) => registry.registerCustomComponent(e.name, e.callback));
    console.warn(`[System] Load ${register.length} block components`);
  }

  /**
   * Registering custom command to minecraft
   *
   * @param registry register function
   */
  static setupCommand(registry: CustomCommandRegistry): void {
    const cmd = Command.Cmd;

    if (cmd.length === 0) {
      console.warn("[System] No load custom command, because empty cmd");
      return;
    }

    cmd.forEach((e: CommandData) => registry.registerCommand(e.config, e.callback));
    console.warn(`[System] Load ${cmd.length} custom commands`);
  }

  /**
   * Registering command enums to minecraft
   *
   * @param registry register function
   * @param enums  enums data
   */
  static setupCommandEnums(registry: CustomCommandRegistry, enums: CommandEnumTypeStrict): void {
    const register = enums;

    Object.keys(register).forEach((e: string) => registry.registerEnum(e, register[e] as string[]));
    console.warn(`[System] Load ${Object.keys(register).length} command enums`);
  }

  /**
   * Registering item component to minecraft
   *
   * @param registry register function
   */
  static setupItemComponent(registry: ItemComponentRegistry): void {
    const register = ItemRegister.register;

    if (register.length === 0) {
      console.warn("[System] No load item components, because empty register");
      return;
    }

    register.forEach((e: ItemRegisterData) => registry.registerCustomComponent(e.name, e.callback));
    console.warn(`[System] Load ${register.length} item components`);
  }

  /**
   * Save data function
   *
   * @param isEnable data will be save or not, (trigger false save)
   */
  static save(isEnable: boolean = true): void {
    console.warn("[System] Saving data");

    if (!isEnable) return;
    this.setProperty("guild", this.world.guilds as Object);
    this.setProperty("leaderboard", this.world.leaderboards as Object);
    this.setProperty("setting", this.world.setting as Object);
    this.setProperty("redeem", this.world.redeem as Object);
    this.setProperty("entities", this.entities);
    this.setProperty("pity", this.pityPlayer);
    this.setProperty("specialist", this.specialist);
  }

  // World Data methods

  /**
   * Get world data
   *
   * @returns WorldData
   */
  static getWorldData(): WorldData {
    return this.world;
  }

  /**
   * Set world data
   *
   * @param data data want to be set
   */
  static setWorldData(data: WorldData): void {
    this.world = data;
  }

  // World Other methods

  /**
   * Get dimension that only there is player in that.
   * Can reduce unused dimension execution
   *
   * @returns Dimension[], array of minecraft dimension
   */
  static getActiveDimension(): Dimension[] {
    const players = world.getPlayers();
    return players.reduce((all: Dimension[], cur: Player) => {
      if (!all.some((e) => e.id === cur.dimension.id)) {
        all.push(cur.dimension as Dimension);
      }
      return all;
    }, []);
  }

  // Player data cache

  /**
   * Array of player, safe access for not calling world.getPlayers()
   *
   * @property Player
   */
  static players: Player[] = [];

  // Player Methods with World

  /**
   * Get all player with matching name from world instance
   *
   * @param name display name of player
   * @returns Players[] | undefined
   */
  static getWorldPlayerByName(name: string): Player[] | undefined {
    return world.getPlayers({ name });
  }

  /**
   * Get player with matching id from world instance
   *
   * @param id player id
   * @returns Player | undefined
   *
   * @throws if id are empty string
   */
  static getWorldPlayerById(id: string): Player | undefined {
    if (id === "") throw new Error("Invalid id");

    return world.getAllPlayers().find((e) => e.id === id);
  }

  // Player Methods

  /**
   * Get player from Terra.players
   *
   * @param finder - { name?: string | id?: string }
   * @returns
   */
  static getPlayer(finder?: PlayerFinder | undefined): Player[] | Player | undefined {
    if (!finder) {
      return this.players;
    }

    const key = Object.keys(finder)[0] as keyof PlayerFinder;
    return (
      this.players.find((e) => e[key] === finder[key]) ?? world.getAllPlayers().find((e) => e[key] === finder[key])
    );
  }

  /**
   * Add player to Terra.players
   *
   * @param player
   */
  static addPlayer(player: Player): void {
    const find = this.players.find((e) => e.id === player.id);
    if (find) return;

    this.players.push(player);
  }

  /**
   * Delete player with matching id that present in Terra.players
   *
   * @param id player id
   * @returns Player[] | undefined
   *
   * @throws if id are empty string
   */
  static delPlayer(id: string): Player[] | undefined {
    if (id === "") throw new Error("Invalid id");
    const find = this.players.findIndex((e) => e.id === id);

    if (find === -1) return;
    return this.players.splice(find, 1);
  }

  /**
   * Set Terra.players
   *
   * @param players
   */
  static setPlayer(players: Player[]): void {
    this.players = players;
    // console.warn(players.map((e) => e.name));
  }

  // Specialist data cache

  /**
   * Array of specialist data's player
   * @type SpecialistData
   * @default []
   */
  static specialist: SpecialistData[] = [];

  /**
   * Array of players specialist instance
   * @class Specialist
   * @default []
   */
  static specialistCache: Specialist[] = [];

  /**
   * Create specialist cache for all player.
   */
  static createSpecialistCache(): void {
    this.specialistCache = this.players.map((player: Player) => new Specialist(player));
  }

  /**
   * Find player from Terra.specialistCache.
   * Create new instance and set to list
   *
   * @param player player that want to get or create
   * @returns Specialist
   */
  static getSpecialistCache(player: Player): Specialist {
    let sp = this.specialistCache.find((e) => e.id === player.id);

    if (!sp) {
      sp = new Specialist(player);
      this.specialistCache.push(sp);
      return sp;
    }

    return sp;
  }

  /**
   * Add specialist data to Terra.specialist
   *
   * @param data player specialist data
   */
  static addSpecialist(data: SpecialistData): void {
    this.specialist.push(data);
  }

  /**
   * Find specialist data player with matching id
   *
   * @param id player id
   * @returns SpecialistData | undefined
   */
  static getSpecialist(id: string): SpecialistData | undefined {
    return this.specialist.find((e) => e.id === id);
  }

  /**
   * Replace specialist data player with new datq
   *
   * @param newData player specialist data
   */
  static setSpecialist(newData: SpecialistData): void {
    const data = this.specialist,
      find = data.findIndex((e) => e.id === newData.id);

    if (find === -1) {
      data.push(newData);
      return;
    }
    data[find] = newData;
  }

  /**
   * Remove specialsit data player from Terra.specialist
   *
   * @param id player id
   * @returns SpecilistData[] if there are multiple data | SpecialistData | undefined
   *
   * @throws if id are empty string
   */
  static remSpecialist(id: string): SpecialistData[] | SpecialistData | undefined {
    if (id === "") throw new Error("Invalid id");
    const find = this.specialist.findIndex((e) => e.id === id);

    if (find === -1) return;
    return this.specialist.splice(find, 1);
  }

  // Entity data cache

  /**
   * Array of entity data
   */
  static entities: EntityData[] = [];

  /**
   * Array of Entity instance
   */
  static entityCaches: Entity[] = [];

  /**
   * Add entity data to Terra.entities
   *
   * @param data
   */
  static addDataEntity(data: EntityData): void {
    this.entities.push(data);
  }

  /**
   * Get entity data
   *
   * @param id entity id
   * @returns EntityData | undefined
   */
  static getDataEntity(id: string): EntityData | undefined {
    return this.entities.find((e) => e.id === id);
  }

  /**
   * Set entity data to Terra.entities
   *
   * @param id entity id
   * @param data data of the entity
   */
  static setDataEntity(id: string, data: EntityData): void {
    if (id === "") throw new Error("Invalid id");

    const find = this.entities.findIndex((e) => e.id === id);
    if (find === -1) {
      this.addDataEntity(data);
      return;
    }

    this.entities[find] = data;
  }

  /**
   * Remove entity data from Terra.entities
   *
   * @param id entity id
   * @returns EntityData[] | EntityData | undefined
   */
  static remDataEntity(id: string): EntityData[] | EntityData | undefined {
    if (id === "") return;

    const find = this.entities.findIndex((e) => e.id === id);

    if (find === -1) return;
    return this.entities.splice(find, 1);
  }

  /**
   * Get entity instance from Terra.entityCache
   *
   * @param entity insatnce of entity from minecraft
   * @returns Entity
   */
  static getEntityCache(entity: mcEntity): Entity {
    let ent: Entity | undefined = this.entityCaches.find((e) => e.id === entity.id);

    if (!ent) {
      ent = new Entity(entity);
      this.entityCaches.push(ent);
    }

    return ent;
  }

  /**
   * Clearing all entity instance from Terra.entityCache
   */
  static clearEntityCache(): void {
    this.entityCaches = [];
  }

  // Leaderboard Instance
  /**
   * Leaderboard instance of Terra, controll all leaderboard data;
   */
  static leaderboard: Leaderboard;

  /**
   * Set leaderboard data with new data
   *
   * @param data new data leaderboard
   */
  static setleaderboard(data: LeaderboardData): void {
    this.world.leaderboards = data;
  }

  // Guild instance

  /**
   * Guild instance
   */
  static guild: Guild;

  /**
   * Set guild data with new data
   *
   * @param data new data for guild data
   */
  static setDataGuild(data: GuildData[]): void {
    this.world.guilds = data;
  }

  /**
   * Return list of data guild to string
   *
   * @returns list of guild
   */
  static getListedGuild(): string[] {
    return (
      this.world.guilds?.map((e: GuildData) => {
        return `${e.name}§r§f

${e.des}

Owner   : ${e.members.filter((r) => r.role === "super_admin")[0].name || "Idk bruh"}
Member  : ${e.members.length}/${e.maxMember}`;
      }) || []
    );
  }

  /**
   * Data of world story, store progress
   */
  static story: StoryData = {
    storyId: 0,
    progress: [],
  };

  // Pity methods

  /**
   * Array of player pity
   */
  static pityPlayer: PityPlayer[] = [];

  /**
   * Get player pity from Terra.playerPity
   *
   * @param player
   * @returns PityPlayer
   */
  static getPityPlayer(player: Player): PityPlayer {
    return this.pityPlayer.find((e) => e.id === player.id) ?? CreateObject.createPity(player);
  }

  /**
   * Set data of player pity, with new one
   *
   * @param player
   * @param newData
   * @returns
   */
  static setPityPlayer(player: Player, newData: PityPlayer): void {
    const find = this.pityPlayer.findIndex((e) => e.id === player.id);
    if (find === -1) {
      this.pityPlayer.push(newData);
      return;
    }

    this.pityPlayer[find] = newData;
  }

  // Weapon Global data cache

  /**
   * Array of player weapon component
   */
  static weaponComponent: WeaponComponent[] = [];

  /**
   * Get data of player weapon component
   *
   * @param id player id
   * @returns WeaponComponent
   */
  static getPlayerWeaponComponent(id: string): WeaponComponent {
    if (id === "") throw new Error("Invalid id");

    return this.weaponComponent.find((e) => e.id === id) ?? CreateObject.createWeaponComponent(id);
  }

  /**
   * Set data of player weapon component with matching id
   *
   * @param id player id
   * @param data data want to insert
   */
  static setPlayerWeaponComponent(id: string, data: WeaponComponent): void {
    if (id === "") throw new Error("Invalid id");

    const find = this.weaponComponent.findIndex((e) => e.id === id);

    if (find === -1) {
      this.weaponComponent.push(data);
      return;
    }

    this.weaponComponent.splice(find, 1, data);
  }

  /**
   * Add data for key of value on weapon component of player with matching id
   *
   * @param id player id
   * @param key key of value from data
   * @param amount data want to add
   * @param data WeaponComponent
   */
  static addPlayerWpnComponent(
    id: string,
    key: string,
    amount: number = 1,
    data: WeaponComponent = this.getPlayerWeaponComponent(id)
  ): void {
    if (id === "" || key === "") throw new Error("Invalid id or key");

    const find = data.components.findIndex((e) => e.name === key);

    if (find === -1) {
      data.components.push({ name: key, value: amount });
    } else {
      if (typeof data.components[find].value !== "number") return;
      data.components[find].value += amount;
    }

    this.setPlayerWeaponComponent(id, data);
  }

  /**
   * Set weapon component of player with matching id
   *
   * @param id player id
   * @param key key of value
   * @param value
   * @param data WeaponComponent
   */
  static setPlayerWpnComponent(
    id: string,
    key: string,
    value: WeaponComponentDataValue,
    data: WeaponComponent = this.getPlayerWeaponComponent(id)
  ): void {
    if (id === "") throw new Error("Invalid id");

    const find = data.components.findIndex((e) => e.name === key);

    if (find === -1) {
      data.components.push({ name: key, value });
    } else {
      switch (typeof data.components[find].value) {
        case "string":
          if (typeof value !== "string") throw new Error("Type data component value are not match");
          data.components[find].value = value;
          break;
        case "object":
          if (typeof value !== "object") throw new Error("Type data component value are not match");
          data.components[find].value = value;
          break;
        case "number":
          if (typeof value !== "number") throw new Error("Type data component value are not match");
          data.components[find].value = value;
          break;
        case "boolean":
          if (typeof value !== "boolean") throw new Error("Type data component value are not match");
          if (typeof value !== "boolean") throw new Error("Type data value are not match");
          data.components[find].value = value;
          break;
      }
    }

    this.setPlayerWeaponComponent(id, data);
  }

  // Boss challanges cache

  /**
   * Data of Boss Challange event
   */
  static bossChallenge: BossChallengeData;

  /**
   * Set boss challange data
   *
   * @param boss entity of minecraft
   */
  static setBossChallenge(boss: mcEntity): void {
    this.bossChallenge = CreateObject.createBossChallenge(boss);
  }

  /**
   * Reset boss challange data
   */
  static resetBossChallenge(): void {
    this.bossChallenge = { boss: undefined, participants: [] };
  }

  /**
   * Add new player to boss challange data
   *
   * @param player
   * @param damage
   * @param data BossChallangeData
   */
  static addParticipantBossChallenge(
    player: Player,
    damage: number = 1,
    data: BossChallengeData | undefined = this.bossChallenge
  ): void {
    if (!data) throw new Error("Missing data");

    const find = data.participants.findIndex((e) => e.player.id === player.id);

    if (find === -1) {
      data.participants.push({ player, damage });
    } else {
      data.participants[find].damage += damage;
    }

    this.bossChallenge = data;
  }

  // Wave challange cache
  static waveChallenge = {};

  static plugins: PluginsData[] = [];

  static addPlugins(plugins: PluginsData[] | PluginsData): void {
    if (Array.isArray(plugins)) {
      this.plugins.push(...plugins);
      return;
    }

    if (typeof plugins !== "object") return;
    this.plugins.push(plugins);
  }

  static antiHealCaches: AntiHealData[] = [];

  static getEntityAntiHealStatus(id: string): boolean {
    return this.antiHealCaches.some((e) => e.id === id);
  }

  static addEntityAntiHealStatus(id: string): void {
    this.antiHealCaches.push({ id, canHeal: false });
  }
  static removeEntityAntiHealStatus(id: string): void {
    const find = this.antiHealCaches.findIndex((e) => e.id === id);
    if (!find) return;
    this.antiHealCaches.splice(find, 1);
  }
}

export { Terra };
