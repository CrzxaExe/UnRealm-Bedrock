import { Player } from "@minecraft/server";
import { Terra } from "../../ZxraLib/module";

export const vitalist = (user: Player, nearby: Player[], damage: number = 0): void => {
  const heal = Math.round(damage / 2);

  const target = [user, ...nearby];
  const teammate = Terra.guild.getTeammate(user);

  const priority = target
    .filter((e: Player) => {
      const hp = e.getComponent("health");
      if (!hp || hp.currentValue >= (hp?.effectiveMax ?? 20)) return false;

      if (!teammate.includes(e.name)) return false;
      return true;
    })
    .sort(
      (a: Player, b: Player) =>
        (b.getComponent("health")?.currentValue ?? 20) - (a.getComponent("health")?.currentValue ?? 20)
    );

  Terra.getEntityCache(priority[0]).heal(heal);
};
