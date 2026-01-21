import { Player } from "@minecraft/server";
import { Terra } from "./Terra";
import { CreateObject } from "./CreateDefault";

/**
 * Services class to handle guild request
 */
class Guild {
  /**
   * Get guild data by id or name
   *
   * @param finder finder object
   * @returns GuildData[]
   */
  getData(finder?: { id?: string; name?: string }): GuildData[] {
    const data = Array.isArray(Terra.world.guilds) ? Terra.world.guilds : [];

    if (finder) {
      data.filter((e) => {
        const key = Object.keys(finder)[0] as keyof typeof finder;
        return e[key] === finder[key];
      });
    }

    return data;
  }

  /**
   * Get guild data by id
   *
   * @param id guild id
   * @returns GuildData or undefined
   */
  getGuild(id: string): GuildData | undefined {
    return this.getData().find((e) => e.id === id);
  }

  /**
   * Update single guild data
   *
   * @param updateData
   */
  updateData(updateData: GuildData): void {
    if (!updateData) throw new Error("Missing updateData");

    const data = this.getData(),
      find = data.findIndex((e) => e.id == updateData.id);

    if (find === -1) throw new Error("Data not found");
    data[find] = updateData;

    Terra.setDataGuild(data);
  }

  /**
   * Delete guild data
   *
   * @param id guild id
   */
  deleteGuild(id: string): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data.splice(find, 1);
    Terra.setDataGuild(data);
  }

  // Getter

  /**
   * Get guild data by member of guilds
   *
   * @param player
   * @returns GuildData | undefined
   */
  getGuildByPlayer(player: Player): GuildData | undefined {
    return this.getData().find((e) => e.members.some((r) => r.id === player.id));
  }

  /**
   * Get array of all player username that on same guild with target
   *
   * @param user { id: string, name: string }
   * @returns string[]
   */
  getTeammate(user: Player | GuildMember | Pick<GuildMember, "id" | "name">): string[] {
    const data = this.getData(),
      find = data.findIndex((e) => e.members.some((r) => r.id === user.id));

    if (find === -1) return [user.name];
    return data[find].members.map((e) => e.name);
  }

  // Guild methods

  /**
   * Create new guild
   *
   * @param player
   * @param name
   * @param des
   * @param approval if true, player will request first
   */
  createGuild(player: Player, name: string, des: string, approval: boolean = false): void {
    const newGuild: GuildData = {
      id: CreateObject.createUUID(Terra.world.setting?.uuidLength || 12),
      name,
      level: { lvl: 0, xp: 0 },
      des,
      approval,
      maxMember: 5,
      members: [{ id: player.id, name: player.name, role: "super_admin" }],
      applier: [],
      token: 0,
    };

    const data = this.getData() ?? [];
    data.push(newGuild);
    Terra.setDataGuild(data);
  }

  /**
   * Add new member to guild
   *
   * @param id
   * @param player { id: string, name: string, role: GuildRole }
   * @throws when id invalid
   */
  addMember(id: string, player: Player | GuildMember): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    if (data[find].members.some((e) => e.id === player.id)) return;

    data[find].members.push({ id: player.id, name: player.name, role: "member" });
    Terra.setDataGuild(data);
  }

  /**
   * Update member role on guild
   *
   * @param id guild id
   * @param player { id: string, name: string, role: GuildRole }
   * @param role new role, default member
   * @throws when id invalid
   */
  updateMember(id: string, player: Player | GuildMember, role: GuildRole = "member"): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    if (!data[find].members.some((e) => e.id === player.id)) throw new Error("Member not found");

    const index = data[find].members.findIndex((e) => e.id === player.id);
    data[find].members[index].role = role;
    Terra.setDataGuild(data);
  }

  /**
   * Remove member from guild
   *
   * @param id guild id
   * @param player { id: string, name: string, role: GuildRole }
   * @throws when id invalid
   */
  removeMember(id: string, player: Player | GuildMember): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    if (!data[find].members.some((e) => e.id === player.id)) throw new Error("Member not found");

    const index = data[find].members.findIndex((e) => e.id === player.id);
    data[find].members.splice(index, 1);
    Terra.setDataGuild(data);
  }

  /**
   * Add new request to join guild
   *
   * @param id guild id
   * @param player { id: string, name: string, role: GuildRole }
   * @throws when id invalid
   */
  addApply(id: string, player: Player | GuildMember): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    if (data[find].applier.some((e) => e.id === player.id)) return;

    data[find].applier.push({ id: player.id, name: player.name, role: "member" });
    Terra.setDataGuild(data);
  }

  /**
   * Remove applier from guild
   *
   * @param id guild id
   * @param player { id: string, name: string, role: GuildRole }
   * @throws when id invalid
   */
  removeApply(id: string, player: Player | GuildMember): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    if (!data[find].applier.some((e) => e.id === player.id)) throw new Error("Applier not found");

    const index = data[find].applier.findIndex((e) => e.id === player.id);
    data[find].applier.splice(index, 1);
    Terra.setDataGuild(data);
  }

  /**
   * Accept applier to guild
   *
   * @param id guild id
   * @param player { id: string, name: string, role: GuildRole }
   * @throws when id invalid
   */
  acceptApply(id: string, player: Player | GuildMember): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    if (!data[find].applier.some((e) => e.id === player.id)) throw new Error("Applier not found");

    const index = data[find].applier.findIndex((e) => e.id === player.id);
    const user = data[find].applier.splice(index, 1)[0];

    this.addMember(id, user);
  }

  /**
   * Adding token to guild
   *
   * @param id guild id
   * @param amount
   * @throws when id invalid
   */
  addToken(id: string, amount: number = 1): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data[find].token += amount;
    Terra.setDataGuild(data);
  }

  /**
   * Set guild token
   *
   * @param id guild id
   * @param value
   * @throws when id invalid
   */
  setToken(id: string, value: number = 1): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data[find].token = value;
    Terra.setDataGuild(data);
  }

  /**
   * Min guild from guild
   *
   * @param id guild id
   * @param amount
   */
  minToken(id: string, amount: number): void {
    this.addToken(id, -amount);
  }

  /**
   * Add xp to guild level
   *
   * @param id guild id
   * @param amount
   * @throws when id invalid
   */
  addXp(id: string, amount: number): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data[find].level.xp += amount;
    Terra.setDataGuild(data);
  }

  /**
   * Set guild xp
   *
   * @param id guild id
   * @param value
   * @throws when id invalid
   */
  setXp(id: string, value: number): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data[find].level.xp = value;
    Terra.setDataGuild(data);
  }

  /**
   * Add level to guild
   *
   * @param id guild id
   * @param amount
   * @throws when id  invalid
   */
  addLvl(id: string, amount: number): void {
    if (id.length < 1) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data[find].level.lvl += amount;
    Terra.setDataGuild(data);
  }

  /**
   * Set guild level
   *
   * @param id guild id
   * @param value
   * @throws when id invalid
   */
  setLvl(id: string, value: number): void {
    if (id.length < 0) throw new Error("Missing id");

    const data = this.getData(),
      find = data.findIndex((e) => e.id === id);

    if (find === -1) throw new Error("Data not found");
    data[find].level.lvl = value;
    Terra.setDataGuild(data);
  }

  /**
   * Check if player has already join guild
   * @param player
   * @returns boolean
   */
  hasJoinGuild(player: Player): boolean {
    return !!this.getGuildByPlayer(player);
  }
}

export { Guild };
