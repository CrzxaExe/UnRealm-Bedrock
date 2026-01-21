import {
  InputPermissionCategory,
  PlayerJoinAfterEvent,
  PlayerLeaveAfterEvent,
  PlayerLeaveBeforeEvent,
  PlayerSpawnAfterEvent,
  world,
} from "@minecraft/server";
import { SettingStarterItem, Terra } from "../ZxraLib/module";

// Join event
world.afterEvents.playerJoin.subscribe((event: PlayerJoinAfterEvent) => {
  Terra.setPlayer(world.getAllPlayers());
  Terra.createSpecialistCache();
});

// Player Spawn event
world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }: PlayerSpawnAfterEvent) => {
  player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);

  const sp = Terra.getSpecialistCache(player);
  if (initialSpawn) {
    Terra.setPlayer(world.getAllPlayers());
    Terra.createSpecialistCache();

    if (player.hasTag("firstJoin")) return;
    if (!Terra.world.setting?.staterItem) return;
    const starterItems = Terra.world.setting.starterItems || [];

    player.sendMessage({ translate: Terra.world.setting?.starterItemMessage || "system.welcome.item" });
    player.addTag("firstJoin");

    starterItems.forEach(({ item, amount }: SettingStarterItem) => {
      switch (item) {
        case "cash":
          sp.addMoney(amount);
          break;
        default: {
          sp.inventory.addItem(item, amount);
        }
      }
    });
  }

  sp.resetToMaxStamina();
});

// Leave event
world.afterEvents.playerLeave.subscribe((event: PlayerLeaveAfterEvent) => {
  Terra.setPlayer(world.getAllPlayers());
  Terra.createSpecialistCache();
});

// Before Leave event
world.beforeEvents.playerLeave.subscribe((event: PlayerLeaveBeforeEvent) => {
  if (Terra.players.length - 1 <= 0) {
    Terra.save(true);
  }
});
