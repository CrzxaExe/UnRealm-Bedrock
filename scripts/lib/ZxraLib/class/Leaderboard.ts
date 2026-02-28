import { Player } from "@minecraft/server";
import { CreateObject, LbData, LeaderboardData, LeaderboardSystemType, LeaderboardType, Terra } from "../module";

class Leaderboard {
  /**
   * Get current leaderboard data
   *
   * @returns LeaderboardData
   */
  getData(): LeaderboardData {
    return Terra.world.leaderboards || CreateObject.createLeaderboard();
  }

  /**
   * Set current leaderboard data
   *
   * @param data Updated leaderboard data
   */
  setData(data: LeaderboardData): void {
    if (!data) throw new Error("Missing data");

    Terra.setleaderboard(data);
  }

  // methods

  /**
   * Get leaderboard by type
   *
   * @param leaderboardType type of leaderboard
   * @returns LbData[]
   */
  getLeaderBoard(leaderboardType: LeaderboardType): LbData[] {
    const data = this.getData();

    const obj = {
      chat: data.chat,
      deaths: data.deaths,
      kills: data.kills,

      splvl: Terra.specialist
        .map((e) => {
          let plyrResult = Terra.getPlayer({ id: e.id });
          const plyr: Player | undefined = Array.isArray(plyrResult) ? plyrResult[0] : plyrResult;
          if (!plyr) return undefined;
          return { id: e.id, name: plyr.name || "idk", value: e.level.current };
        })
        .filter((item): item is LbData => item !== undefined),
      guildlvl: (Terra.world.guilds || [])
        ?.map((e) => {
          return { id: e.id, name: e.name, value: e.level.lvl };
        })
        .filter((item): item is LbData => item !== undefined),
      money: Terra.specialist
        .map((e) => {
          let plyrResult = Terra.getPlayer({ id: e.id });
          const plyr: Player | undefined = Array.isArray(plyrResult) ? plyrResult[0] : plyrResult;
          if (!plyr) return undefined;
          return { id: e.id, name: plyr.name || "idk", value: e.money };
        })
        .filter((item): item is LbData => item !== undefined),
      reputation: Terra.specialist
        .map((e) => {
          let plyrResult = Terra.getPlayer({ id: e.id });
          const plyr: Player | undefined = Array.isArray(plyrResult) ? plyrResult[0] : plyrResult;
          if (!plyr) return undefined;
          return { id: e.id, name: plyr.name || "idk", value: e.rep };
        })
        .filter((item): item is LbData => item !== undefined),
      voxn: Terra.specialist
        .map((e) => {
          let plyrResult = Terra.getPlayer({ id: e.id });
          const plyr: Player | undefined = Array.isArray(plyrResult) ? plyrResult[0] : plyrResult;
          if (!plyr) return undefined;
          return { id: e.id, name: plyr.name || "idk", value: e.voxn };
        })
        .filter((item): item is LbData => item !== undefined),
    }[leaderboardType];

    return obj;
  }

  /**
   * Adding data to leaderboard
   *
   * @param type Leaderboard type
   * @param id player id
   * @param amount amount of leaderboard value
   */
  addLb(type: LeaderboardSystemType, id: string, amount: number = 1): void {
    if (id === "") throw new Error("Missing id");
    const data = this.getData(),
      find = data[type].findIndex((e) => e.id === id);

    if (find === -1) {
      data[type].push({ id, name: (Terra.getPlayer({ id }) as Player).name, value: amount });
      return;
    }
    data[type][find].value += amount;
    this.setData(data);
  }

  /**
   * Reset leaderboard data
   */
  resetLb(): void {
    this.setData(CreateObject.createLeaderboard());
  }
}

export { Leaderboard };
