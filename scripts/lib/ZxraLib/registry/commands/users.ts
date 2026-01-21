import {
  CommandPermissionLevel,
  CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandResult,
  CustomCommandStatus,
  GameMode,
  Player,
  system,
  world,
} from "@minecraft/server";
import { Chat, Command, CreateObject, Iyura, Terra, UserPanel } from "../../module";

/**
 * Command to testing only
 */
Command.add(
  {
    name: "cz:test",
    description: "cmd.test",
    permissionLevel: CommandPermissionLevel.Any,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        world.sendMessage("Test");

        new Iyura().ui(plyr);
      });
      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command ");
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

// Gamemode

/**
 * Change gamemode to creative
 */
Command.add(
  {
    name: "cz:gmc",
    description: "cmd.gmc",
    permissionLevel: CommandPermissionLevel.GameDirectors,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        plyr.onScreenDisplay.setActionBar({
          translate: "gameMode.changed",
          with: { rawtext: [{ translate: "gameMode.creative" }] },
        });

        plyr.setGameMode(GameMode.Creative);
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      plyr.sendMessage({ translate: "system.command.error", with: [error.message] });
      return {
        status: CustomCommandStatus.Failure,
        message: "Run error",
      };
    }
  }
);

/**
 * Change gamemode to survival
 */
Command.add(
  {
    name: "cz:gms",
    description: "cmd.gms",
    permissionLevel: CommandPermissionLevel.GameDirectors,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        plyr.onScreenDisplay.setActionBar({
          translate: "gameMode.changed",
          with: { rawtext: [{ translate: "gameMode.survival" }] },
        });

        plyr.setGameMode(GameMode.Survival);
      });
      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      plyr.sendMessage({ translate: "system.command.error", with: [error.message] });
      return {
        status: CustomCommandStatus.Failure,
        message: "Run error",
      };
    }
  }
);

/**
 * Change gamemode to adventure
 */
Command.add(
  {
    name: "cz:gma",
    description: "cmd.gma",
    permissionLevel: CommandPermissionLevel.GameDirectors,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        plyr.onScreenDisplay.setActionBar({
          translate: "gameMode.changed",
          with: { rawtext: [{ translate: "gameMode.adventure" }] },
        });

        plyr.setGameMode(GameMode.Adventure);
      });
      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      plyr.sendMessage({ translate: "system.command.error", with: [error.message] });
      return {
        status: CustomCommandStatus.Failure,
        message: "Run error",
      };
    }
  }
);

/**
 * Change gamemode to spectator
 */
Command.add(
  {
    name: "cz:gmsp",
    description: "cmd.gmsp",
    permissionLevel: CommandPermissionLevel.GameDirectors,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        plyr.onScreenDisplay.setActionBar({
          translate: "gameMode.changed",
          with: { rawtext: [{ translate: "gameMode.spectator" }] },
        });

        plyr.setGameMode(GameMode.Spectator);
      });
      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      plyr.sendMessage({ translate: "system.command.error", with: [error.message] });
      return {
        status: CustomCommandStatus.Failure,
        message: "Run error",
      };
    }
  }
);

// Currency

/**
 * See your or other user balance
 */
Command.add(
  {
    name: "cz:bal",
    description: "cmd.bal",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ name: "target", type: CustomCommandParamType.PlayerSelector }],
  },
  (origin: CustomCommandOrigin, target: Player | Player[] | undefined): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        function run(target: Player) {
          const tg: Player = Terra.getPlayer({ id: target?.id || origin?.sourceEntity?.id }) as Player;
          if (!tg) throw new Error("Origin not a player");

          const data = Terra.getSpecialist(tg.id) || CreateObject.createSpecialist(tg);
          plyr.sendMessage({ translate: "system.bal", with: [String(plyr.name), String(data.money)] });
        }

        if (Array.isArray(target)) {
          target.forEach((e) => run(e));
          return;
        }

        run(target ?? (origin.sourceEntity as Player));
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      plyr.sendMessage({ translate: "system.command.error", with: [error.message] });
      return {
        status: CustomCommandStatus.Failure,
        message: "Run error",
      };
    }
  }
);

/**
 * See your or other user voxn
 */
Command.add(
  {
    name: "cz:voxn",
    description: "cmd.voxn",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ name: "target", type: CustomCommandParamType.PlayerSelector }],
  },
  (origin: CustomCommandOrigin, target: Player | Player[] | undefined): CustomCommandResult => {
    if (origin.sourceEntity?.typeId !== "minecraft:player")
      return { status: CustomCommandStatus.Failure, message: "Not a player" };

    const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
    if (!plyr) return { status: CustomCommandStatus.Failure, message: "Origin not a player" };

    try {
      system.run(() => {
        function run(target: Player) {
          const tg: Player = Terra.getPlayer({ id: target?.id || origin?.sourceEntity?.id }) as Player;
          if (!tg) throw new Error("Origin not a player");

          const data = Terra.getSpecialist(tg.id) || CreateObject.createSpecialist(tg);
          plyr.sendMessage({ translate: "system.voxn", with: [String(plyr.name), String(data.voxn)] });
        }

        if (Array.isArray(target)) {
          target.forEach((e) => run(e));
          return;
        }

        run(target ?? (origin.sourceEntity as Player));
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      plyr.sendMessage({ translate: "system.command.error", with: [error.message] });
      return {
        status: CustomCommandStatus.Failure,
        message: "Run error",
      };
    }
  }
);

// Top

/**
 * See top balance in the world
 */
Command.add(
  {
    name: "cz:baltop",
    description: "cmd.baltop",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ name: "max", type: CustomCommandParamType.Integer }],
  },
  (origin: CustomCommandOrigin, max: number = 10): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");
        const names = (Terra.getPlayer() as Player[]).map((r) => r.id);

        const data = Terra.specialist
          .filter((e) => names.includes(e.id))
          .sort((a, b) => a.money - b.money)
          .map((e, i) => {
            const py = Terra.getPlayer({ id: e.id }) as Player;

            return `${i + 1}. ${py.name} - $${e.money}`;
          });

        plyr.sendMessage(data.slice(0, max).join("\n"));
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * See top voxn in the world
 */
Command.add(
  {
    name: "cz:voxntop",
    description: "cmd.voxntop",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ name: "max", type: CustomCommandParamType.Integer }],
  },
  (origin: CustomCommandOrigin, max: number = 10): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const data = Terra.specialist
          .sort((a, b) => a.voxn - b.voxn)
          .map((e, i) => {
            const py = Terra.getPlayer({ id: e.id }) as Player;

            return `${i + 1}. ${py.name} - $${e.voxn} Voxn`;
          });

        plyr.sendMessage(data.slice(0, max).join("\n"));
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * Open menu panel
 */
Command.add(
  {
    name: "cz:menu",
    description: "cmd.menu",
    permissionLevel: CommandPermissionLevel.Any,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        UserPanel.home(plyr);
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * Open guild panel
 */
Command.add(
  {
    name: "cz:guild",
    description: "cmd.guild",
    permissionLevel: CommandPermissionLevel.Any,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        UserPanel.guild(plyr);
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * List all guild
 */
Command.add(
  {
    name: "cz:guildlist",
    description: "cmd.guildlist",
    permissionLevel: CommandPermissionLevel.Any,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        plyr.sendMessage({
          rawtext: [
            { translate: "system.guild.list" },
            ...Terra.guild.getData().map((e) => {
              return { text: `\n- [${e.level.lvl}] ${e.name} | ${e.members.length}/${e.maxMember}  |  ID: ${e.id}` };
            }),
          ],
        });
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * See your or other user stats
 */
Command.add(
  {
    name: "cz:stats",
    description: "cmd.stats",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ name: "target", type: CustomCommandParamType.PlayerSelector }],
  },
  (origin: CustomCommandOrigin, target: Player | Player[] | undefined): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");
        let selector: Player | undefined;
        if (Array.isArray(target) && target.length > 0) {
          selector = target[0];
        } else if (target && !Array.isArray(target)) {
          selector = target;
        } else if (origin.sourceEntity?.typeId === "minecraft:player") {
          selector = origin.sourceEntity as Player;
        }

        if (!selector) return;

        const plyr: Player = Terra.getPlayer({ id: selector.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        UserPanel.userProfile(Terra.getPlayer({ id: origin.sourceEntity.id }) as Player, plyr);
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * Send user location to chat
 */
Command.add(
  {
    name: "cz:location",
    description: "cmd.location",
    permissionLevel: CommandPermissionLevel.Any,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        Chat.globalMessage(plyr, `${plyr.location.x} ${plyr.location.y} ${plyr.location.z}`);
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * Send chat to guild member only
 */
Command.add(
  {
    name: "cz:gc",
    description: "cmd.gc",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [{ name: "text", type: CustomCommandParamType.String }],
  },
  (origin: CustomCommandOrigin, ...text: string[]): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        Chat.guildMessage(plyr, text.join(" "));
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);

/**
 * Get your spawnpoint location and dimension
 */
Command.add(
  {
    name: "cz:getspanwpoint",
    description: "cmd.psp",
    permissionLevel: CommandPermissionLevel.Any,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");
        const location = plyr.getSpawnPoint();

        const text = location
          ? {
              translate: "system.psp",
              with: [String(location.x), String(location.y), String(location.z), String(location.dimension.id)],
            }
          : { translate: "system.notSpawnPoint" };

        plyr.sendMessage(text);
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
      };
    }
  }
);
