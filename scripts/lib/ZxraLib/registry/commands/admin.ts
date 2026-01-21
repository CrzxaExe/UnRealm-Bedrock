import {
  CommandPermissionLevel,
  CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandResult,
  CustomCommandStatus,
  Player,
  Entity as mcEntity,
  system,
  world,
} from "@minecraft/server";
import { AdminPanel, Command, GuildPanel, Item, StatusDecay, StatusTypes, Terra } from "../../module";
import { ModifierTypes } from "../../enum/modifier";

// Settings

/**
 * Open admin panel
 */
Command.add(
  {
    name: "cz:admin",
    description: "cmd.admin",
    permissionLevel: CommandPermissionLevel.GameDirectors,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

      const plyr = Terra.getPlayer({ id: origin.sourceEntity?.id }) as Player;
      if (!plyr) throw new Error("Not a origin player");

      system.run(() => AdminPanel.home(plyr));

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

// Voxn

/**
 * Adding your or other user voxn
 */
Command.add(
  {
    name: "cz:addvoxn",
    description: "cmd.addvoxn",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.PlayerSelector },
      { name: "value", type: CustomCommandParamType.Integer },
    ],
  },
  (origin: CustomCommandOrigin, target: Player | undefined, value: number): CustomCommandResult => {
    try {
      system.run(() => {
        if (!target) throw new Error("Target not found");
        if ((target.typeId || origin.sourceEntity?.typeId) !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: target?.id || origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const sp = Terra.getSpecialistCache(plyr);

        sp.addVoxn(value);
        plyr.sendMessage({ translate: "system.addvoxn", with: [String(plyr.name), String(value)] });
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
 * Take your or other user voxn
 */
Command.add(
  {
    name: "cz:minvoxn",
    description: "cmd.minvoxn",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.PlayerSelector },
      { name: "value", type: CustomCommandParamType.Integer },
    ],
  },
  (origin: CustomCommandOrigin, target: Player | undefined, value: number): CustomCommandResult => {
    try {
      system.run(() => {
        if (!target) throw new Error("Target not found");
        if ((target.typeId || origin.sourceEntity?.typeId) !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: target?.id || origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const sp = Terra.getSpecialistCache(plyr);

        sp.minVoxn(value);
        plyr.sendMessage({ translate: "system.minvoxn", with: [String(plyr.name), String(value)] });
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
 * Set your or other user voxn
 */
Command.add(
  {
    name: "cz:setvoxn",
    description: "cmd.setvoxn",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.PlayerSelector },
      { name: "value", type: CustomCommandParamType.Integer },
    ],
  },
  (origin: CustomCommandOrigin, target: Player | undefined, value: number): CustomCommandResult => {
    try {
      system.run(() => {
        if (!target) throw new Error("Target not found");
        if ((target.typeId || origin.sourceEntity?.typeId) !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: target?.id || origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const sp = Terra.getSpecialistCache(plyr);

        sp.setVoxn(value);
        plyr.sendMessage({ translate: "system.setvoxn", with: [String(plyr.name), String(value)] });
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

// Money

/**
 * Add your or other user balance
 */
Command.add(
  {
    name: "cz:addbal",
    description: "cmd.addbal",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.PlayerSelector },
      { name: "value", type: CustomCommandParamType.Float },
    ],
  },
  (origin: CustomCommandOrigin, target: Player | undefined, value: number): CustomCommandResult => {
    try {
      system.run(() => {
        if (!target) throw new Error("Target not found");
        if ((target.typeId || origin.sourceEntity?.typeId) !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: target?.id || origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const sp = Terra.getSpecialistCache(plyr);

        sp.addMoney(value);
        plyr.sendMessage({ translate: "system.addbal", with: [String(plyr.name), String(value)] });
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
 * Take your or other user balance
 */
Command.add(
  {
    name: "cz:minbal",
    description: "cmd.minbal",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.PlayerSelector },
      { name: "value", type: CustomCommandParamType.Float },
    ],
  },
  (origin: CustomCommandOrigin, target: Player | undefined, value: number): CustomCommandResult => {
    try {
      system.run(() => {
        if (!target) throw new Error("Target not found");
        if ((target.typeId || origin.sourceEntity?.typeId) !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: target?.id || origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const sp = Terra.getSpecialistCache(plyr);

        sp.minMoney(value);
        plyr.sendMessage({ translate: "system.minbal", with: [String(plyr.name), String(value)] });
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
 * Set your or other user balance
 */
Command.add(
  {
    name: "cz:setbal",
    description: "cmd.setbal",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.PlayerSelector },
      { name: "value", type: CustomCommandParamType.Float },
    ],
  },
  (origin: CustomCommandOrigin, target: Player | undefined, value: number): CustomCommandResult => {
    try {
      system.run(() => {
        if (!target) throw new Error("Target not found");
        if ((target.typeId || origin.sourceEntity?.typeId) !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: target?.id || origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const sp = Terra.getSpecialistCache(plyr);

        sp.setMoney(value);
        plyr.sendMessage({ translate: "system.setbal", with: [String(plyr.name), String(value)] });
      });

      return {
        status: CustomCommandStatus.Success,
      };
    } catch (error: any) {
      console.warn("[System] Error while run command " + error.message);
      return {
        status: CustomCommandStatus.Failure,
        message: error.message,
      };
    }
  }
);

/**
 * Open guild admin panel
 */
Command.add(
  {
    name: "cz:guildadmin",
    description: "cmd.guildadmin",
    permissionLevel: CommandPermissionLevel.Admin,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");

        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        GuildPanel.admin(plyr);
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
 * Omit save event
 */
Command.add(
  {
    name: "cz:savedata",
    description: "cmd.savedata",
    permissionLevel: CommandPermissionLevel.Admin,
  },
  (origin: CustomCommandOrigin): CustomCommandResult => {
    try {
      system.run(() => {
        Terra.save(true);
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
 * Apply status to your or other user
 */
Command.add(
  {
    name: "cz:addstatus",
    description: "cmd.addstatus",
    permissionLevel: CommandPermissionLevel.Admin,
    mandatoryParameters: [
      { name: "target", type: CustomCommandParamType.EntitySelector },
      { name: "statusname", type: CustomCommandParamType.String },
      { name: "duration", type: CustomCommandParamType.Float },
      { name: "level", type: CustomCommandParamType.Integer },
      { name: "type", type: CustomCommandParamType.Enum, enumName: "cz:statustype" },
      { name: "stackable", type: CustomCommandParamType.Boolean },
      { name: "decay", type: CustomCommandParamType.Enum, enumName: "cz:statusdecay" },
    ],
  },
  (
    _: CustomCommandOrigin,
    target: mcEntity,
    name: string,
    duration: number,
    lvl: number,
    type: string,
    stack: boolean,
    decay: string
  ): CustomCommandResult => {
    try {
      system.run(() => {
        const actualTarget =
          world.getEntity(target?.id) || (world.getAllPlayers().find((e) => e.id === target.id) as mcEntity);
        if (!actualTarget) return;

        Terra.getEntityCache(actualTarget).status.addStatus(name, duration, {
          lvl,
          type: type as StatusTypes,
          stack,
          decay: decay as StatusDecay,
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
 * Apply modifier to item you holding in mainhand
 */
Command.add(
  {
    name: "cz:modifier",
    description: "cmd.mod",
    mandatoryParameters: [{ name: "modifier", type: CustomCommandParamType.Enum, enumName: "cz:modifiers" }],
    optionalParameters: [{ name: "level", type: CustomCommandParamType.Integer }],
    permissionLevel: CommandPermissionLevel.Admin,
  },
  (origin: CustomCommandOrigin, modifier: string, level: number = 1): CustomCommandResult => {
    try {
      system.run(() => {
        if (origin.sourceEntity?.typeId !== "minecraft:player") throw new Error("Not a player");
        const plyr: Player = Terra.getPlayer({ id: origin.sourceEntity?.id }) as Player;
        if (!plyr) throw new Error("Not a origin player");

        const item = plyr.getComponent("inventory")?.container.getItem(plyr.selectedSlotIndex);
        if (!item) throw new Error("Not an item");

        plyr.sendMessage({ translate: "system.modifier.apply", with: [modifier] });

        new Item(item).addModifier(modifier as ModifierTypes, plyr, level);
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
