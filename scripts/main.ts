import { Dimension, Player, system, world } from "@minecraft/server";
import { NOT_ALLOWED_ENTITY_TICK, Terra, ZxraLib } from "./lib/ZxraLib/module";

// Event imports
import "./lib/event/breakPlaceBlock";
import "./lib/event/chatSend";
import "./lib/event/entityAction";
import "./lib/event/entityActivity";
import "./lib/event/playerJoinAndLeave";
import "./lib/event/skill";
import "./lib/event/scriptEvent";
import "./lib/event/worldInitialize";

// Custom Command
import "./lib/ZxraLib/registry/commands/users";
import "./lib/ZxraLib/registry/commands/admin";

// Info Version
console.warn(`
[System] Loading plugins:
Better Zxra Bedrock v${ZxraLib.packVersion}`);

// Terra.setup();

if (Terra.world.setting?.debug) console.warn(JSON.stringify(Terra.world));
if (Terra.world.setting?.useBzbRules) {
  system.run(() => {
    const overworld = world.getDimension("overworld");
    Terra.world.setting?.rules &&
      Object.keys(Terra.world.setting.rules).forEach((e) => {
        if (Terra.world.setting?.rules && e in Terra.world.setting.rules) {
          const ruleValue = Terra.world.setting.rules[e as keyof typeof Terra.world.setting.rules];
          overworld.runCommand(`gamerule ${e.toLowerCase()} ${ruleValue}`);
        }
      });
  });
}

// Main Ticking
function mainTick(): void {
  try {
    //  Activity tick

    if (system.currentTick % 5 === 0) {
      Terra.players.forEach((player: Player) => {
        const sp = Terra.getSpecialistCache(player);

        sp.controllerActionBar();
        sp.controllerStamina();
        sp.controllerThirst();
        sp.controllerUI();
        sp.controllerCooldown();
      });

      Terra.getActiveDimension().forEach((dimension: Dimension) => {
        dimension.getEntities({ excludeTypes: NOT_ALLOWED_ENTITY_TICK }).forEach((e) => {
          Terra.getEntityCache(e).controllerStatus();
        });
      });
    }

    // Save Intervals
    if (system.currentTick % (Terra.world.setting?.saveInterval || 20000) /* 1000 sec */ === 0) {
      Terra.save(true);
      Terra.setPlayer(world.getAllPlayers());
      Terra.clearEntityCache();
    }
  } catch (err: { message: string } | any) {
    console.warn("[Tick] Error on: ", err.message);
  }

  system.run(mainTick);
}

system.run(mainTick);
