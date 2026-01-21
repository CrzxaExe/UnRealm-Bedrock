import {
  CommandPermissionLevel,
  EnchantmentType,
  ItemStack,
  Player,
  PlayerPermissionLevel,
  system,
  world,
} from "@minecraft/server";
import { ActionFormData, MessageFormData, MessageFormResponse, ModalFormData } from "@minecraft/server-ui";
import {
  AdminPanel,
  CreateObject,
  Formater,
  Gacha,
  gachaFeatured,
  guildShop,
  Quest,
  RUNE_GACHA_PRICE,
  ShopCategory,
  Specialist,
  Terra,
  WEAPON_GACHA_PRICE,
} from "../module";
import { weaponData, weaponRaw } from "../../WeaponModule/module";
import { globalShop } from "../data/shop";

class UserPanel {
  static home(player: Player): void {
    const ui = new ActionFormData()
      .title("cz:user")
      .body({ rawtext: [{ translate: "system.profileMenu.body" }, { text: "\n\n\n\n\n\n\n\n\n\n\n\n\n" }] })
      .button({ translate: "cz.shop" }, "textures/cz/icon/shop")
      .button({ translate: "cz.guild" }, "textures/cz/icon/guild")
      .button({ translate: "cz.rune" }, "textures/cz/icon/rune")
      .button({ translate: "cz.leaderboard" }, "textures/cz/icon/leaderboard")
      .button({ translate: "cz.gacha" }, "textures/cz/icon/gacha")
      .button({ translate: "cz.quest" }, "textures/cz/icon/quest")
      .button({ translate: "cz.user" }, "textures/cz/icon/user")
      .button({ translate: "cz.redeem" }, "textures/cz/icon/redeem")
      .button({ translate: "cz.wiki" }, "textures/cz/icon/wiki");

    if (player.commandPermissionLevel >= 1) {
      ui.button({ translate: "cz:admin" }, "textures/cz/icon/admin");
    }

    ui.show(player).then((e) => {
      switch (e.selection) {
        case 0:
          this.shop(player);
          break;
        case 1:
          this.guild(player);
          break;
        case 2:
          this.rune(player);
          break;
        case 3:
          this.leaderboard(player);
          break;
        case 4:
          GachaPanel.home(player);
          break;
        case 5:
          this.quest(player);
          break;
        case 6:
          this.userProfile(player);
          break;
        case 7:
          this.redeem(player);
          break;
        case 8:
          this.wiki(player);
          break;
        case 9:
          AdminPanel.home(player);
          break;
      }
    });
  }

  static guild(player: Player): void {
    GuildPanel.home(player);
  }

  static shop(player: Player): void {
    const ui = new ActionFormData().title("cz:global_shop").body({ translate: "cz.shop.body" });

    globalShop.forEach((e) => ui.button({ translate: e.displayName }, e.textures));

    ui.show(player).then((e) => {
      if (e.canceled || (e.selection || 0) > globalShop.length) return;
      const category = globalShop[e.selection ?? 0];

      const sub = new ActionFormData()
        .title({ translate: category.displayName })
        .body({ translate: category.name + ".body" });

      category.items.forEach((r) =>
        sub.button(
          { rawtext: [{ text: r.amount + " x " }, { translate: r.name }, { text: " $" + r.price }] },
          r.textures
        )
      );

      sub.show(player).then((r) => {
        if (r.canceled || (r.selection || 0) > category.items.length) return;

        switch (category.items[r.selection ?? 0].currency) {
          case "money":
            this.buyWithMoney(player, category, r.selection ?? 0);
            break;
          case "voxn":
            this.buyWithVoxn(player, category, r.selection ?? 0);
            break;
        }
      });
    });
  }
  static buyWithMoney(player: Player, category: ShopCategory, id: number): void {
    const item = category.items[id];

    new ModalFormData()
      .title({ translate: "system.buy.item" })
      .label({ translate: item.item })
      .label({
        rawtext: [
          { translate: "system.buy.info" },
          { text: "\n" },
          { translate: "currency.money" },
          { text: String(item.price) },
          { text: "\n" },
          { translate: "system.amount" },
          { text: String(item.amount) },
          { text: "\n" },
        ],
      })
      .textField({ translate: "system.buy.amount" }, { translate: "type.number" })
      .submitButton({ translate: "system.buy.submit" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const formValues = e.formValues ?? [];
        let amount: number = 0;
        if (typeof formValues[2] === "string") {
          const parsed = parseInt(formValues[2]);
          amount = isNaN(parsed) ? 0 : parsed;
        } else if (typeof formValues[2] === "number") {
          amount = formValues[2];
        }

        if (amount < 0) {
          player.sendMessage({ translate: "system.invalid.buy" });
          this.buyWithMoney(player, category, id);
          return;
        }

        const sp = Terra.getSpecialistCache(player);

        if (sp.getMoney() < item.price * amount) {
          player.sendMessage({ translate: "system.buy.outMoney" });
          return;
        }

        sp.minMoney(item.price * amount);
        let total = amount * item.amount;

        sp.inventory.addItem(item.item, total);
      });
  }
  static buyWithVoxn(player: Player, category: ShopCategory, id: number): void {
    const item = category.items[id];

    new ModalFormData()
      .title({ translate: "system.buy.item" })
      .label({ translate: item.item })
      .label({
        rawtext: [
          { translate: "system.buy.info" },
          { text: "\n" },
          { text: String(item.price) },
          { translate: "currency.voxn" },
          { text: "\n" },
          { translate: "system.amount" },
          { text: String(item.amount) },
          { text: "\n" },
        ],
      })
      .textField({ translate: "system.buy.amount" }, { translate: "type.number" })
      .submitButton({ translate: "system.buy.submit" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const formValues = e.formValues ?? [];
        let amount: number = 0;
        if (typeof formValues[2] === "string") {
          const parsed = parseInt(formValues[2]);
          amount = isNaN(parsed) ? 0 : parsed;
        } else if (typeof formValues[2] === "number") {
          amount = formValues[2];
        }

        if (amount < 0) {
          player.sendMessage({ translate: "system.invalid.buy" });
          this.buyWithVoxn(player, category, id);
          return;
        }

        const sp = Terra.getSpecialistCache(player);

        if (sp.getVoxn() < item.price * amount) {
          player.sendMessage({ translate: "system.buy.outVoxn" });
          return;
        }

        sp.minVoxn(item.price * amount);
        let total = amount * item.amount;

        sp.inventory.addItem(item.item, total);
      });
  }

  static rune(player: Player): void {
    const sp = Terra.getSpecialistCache(player);
    const runeStat = sp.rune.getRuneStat();
    const equipped = sp.getSp().equippedRune.fill("None", 3);

    new ActionFormData()
      .title("cz.rune")
      .body({
        rawtext: [
          { translate: "system.rune.equipped" },
          { text: `: [${equipped}]\n\n` },
          { translate: "system.rune" },
          {
            text: `\n
Atk              : ${runeStat["atk"]}%% + ${runeStat["atkFlat"]} Damage
Skill             : ${runeStat["skill"]}%% + ${runeStat["skillFlat"]} Damage
Crit Chance   : ${runeStat["critChance"]}%%
Crit Damage   : ${(runeStat["critDamage"] ?? 1.2) * 100}%%

Healing Effectivity  : ${(runeStat["healingEffectivity"] ?? 1) * 100}%%
Skill Damage Reduc  : ${runeStat["skillDamageReduction"]}%% + ${runeStat["skillDamageReduction"]} Damage
Skill Dodge            : ${runeStat["skillDodge"]}%%

Money Drop    : $${runeStat["moneyDrop"]}
Stamina Reduc : ${runeStat["staminaReduction"]}
\n`,
          },
          { translate: "cz.fragility" },
          {
            text: `\nFragile          : ${runeStat["fragile"]}%%
Art Fragile     : ${runeStat["artFragile"]}%%
Fire Fragile    : ${runeStat["fireFragile"]}%%
`,
          },
        ],
      })

      .label({ translate: "system.rune.setting" })
      .button({ translate: "system.rune.equipped" })
      .button({ translate: "system.rune.list" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        switch (e.selection) {
          case 0:
            this.runeEquipped(player, sp);
            break;
        }
      });
  }
  static runeEquipped(player: Player, sp: Specialist | undefined = Terra.getSpecialistCache(player)): void {
    const equipped = sp.getSp().equippedRune;
    new ActionFormData()
      .title({ translate: "system.rune.equipped" })
      .body({ translate: "system.rune.equipped.body" })
      .button({ text: equipped[0] ?? "None" })
      .button({ text: equipped[1] ?? "None" })
      .button({ text: equipped[2] ?? "None" })
      .button({ translate: "system.back" })
      .show(player)
      .then((e) => {});
  }
  static runeList(player: Player, sp: Specialist | undefined = Terra.getSpecialistCache(player)): void {
    const runes = sp.getSp().runes;
    const ui = new ActionFormData()
      .title({ translate: "system.rune.equipped" })
      .body({ translate: "system.rune.equipped.body" });

    runes.forEach((e) => ui.button({ text: `${e.name} | ${e.lvl}` }));

    ui.button({ translate: "system.back" })
      .show(player)
      .then((e) => {});
  }

  static leaderboard(player: Player): void {
    new ActionFormData()
      .title("cz.leaderboard")
      .body({ translate: "system.leaderboard.body" })
      .button({ translate: "sort.chatting" })
      .button({ translate: "sort.deaths" })
      .button({ translate: "sort.kills" })
      .button({ translate: "sort.guild" })
      .button({ translate: "sort.specialist" })
      .button({ translate: "sort.money" })
      .button({ translate: "sort.rep" })
      .button({ translate: "sort.voxn" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;
        let data: { category: string; list: { player: Player; value: number; format: string; formator: string }[] } = {
          category: "",
          list: [],
        };

        switch (e.selection) {
          case 0:
            data.category = "sort.chatting.name";
            data.list = Terra.leaderboard.getData().chat.map((e) => {
              return {
                value: e.value,
                format: "%p x %v",
                formator: "",
                player: Terra.getPlayer({ id: e.id }) as Player,
              };
            });
            break;
          case 1:
            data.category = "sort.deaths.name";
            data.list = Terra.leaderboard.getData().deaths.map((e) => {
              return {
                value: e.value,
                format: "%v %f x %p",
                formator: "Deaths",
                player: Terra.getPlayer({ id: e.id }) as Player,
              };
            });
            break;
          case 2:
            data.category = "sort.kills.name";
            data.list = Terra.leaderboard.getData().kills.map((e) => {
              return {
                value: e.value,
                format: "%v %f x %p",
                formator: "Kills",
                player: Terra.getPlayer({ id: e.id }) as Player,
              };
            });
            break;
        }

        const ui = new ActionFormData()
          .title({ translate: data.category })
          .body({ translate: data.category + ".body" });

        data.list.forEach((r) =>
          ui.button({
            text: r.format.replace(/%f/g, r.formator).replace(/%v/g, String(r.value)).replace(/%p/g, r.player.name),
          })
        );

        ui.show(player).then((r) => {});
      });
  }

  static userProfile(player: Player, target: Player = player): void {
    const data = Terra.getSpecialist(target.id);
    const runes = [];
    const weapon = [];

    const guild = Terra.guild.getGuildByPlayer(target);

    for (let i = 1; i <= 3; i++) runes.push(data?.equippedRune[i] || "None");
    for (let i = 1; i <= 2; i++) weapon.push(data?.selectedWeapon[i] || "None");

    const ui = new ActionFormData()
      .title("cz:user")
      .body({
        rawtext: [
          { text: `${target.name} [${data?.title || "§8No title§r§f"}]\n\n` },
          {
            text: `SP Level ${(data?.level.current || 0).toFixed(0)} | §2${(data?.level.xp || 0).toFixed(
              2
            )} XP§f\nPlayer Level ${target.level}\n`,
          },
          { text: "\n" },
          { text: `Guild: [${guild ? guild.name : "§8None"}§r§f]\n` },
          { text: `§a$${(data?.money || 0).toFixed(2)}\n` },
          { text: `§b§lVoxn ${(data?.voxn || 0).toFixed(0)}§r§f\n` },
          { text: `§5Reputation ${data?.rep || 0}\n` },
          { text: "\n" },
          {
            text: `§eStamina ${(data?.stamina.current || 100).toFixed(1)}/${(
              (data?.stamina.max || 100) +
              (data?.stamina.additional || 0) +
              (data?.stamina.rune || 0)
            ).toFixed(1)}${data?.stamina.additional ? " (+" + data.stamina.additional + " Add)" : ""}${
              data?.stamina.rune ? " (+" + data.stamina.rune + " Rune)" : ""
            }\n`,
          },
          {
            text: `§1Thirst ${(data?.thirst.current || 100).toFixed(2)}/${(
              (data?.thirst.max || 100) + (data?.thirst.temp || 0)
            ).toFixed(2)}${data?.thirst.temp ? " (+" + data.thirst.temp + " Temporary)" : ""}§r§f\n`,
          },
          { text: "\n" },
          { text: `Runes: [${runes.join(", ")}]\n` },
          { text: `Weapon: [${weapon.join(", ")}]` },
        ],
      })
      .button({ translate: "system.back" }, "textures/cz/icon/back");

    if (target.id === player.id) ui.button({ translate: "system.settings" }, "textures/cz/icon/settings");

    if (Terra.guild.getGuildByPlayer(target))
      ui.button({ translate: "system.guild.invite" }, "textures/cz/icon/guild_add");
    ui.show(player).then((e) => {
      switch (e.selection) {
        case 0:
          this.home(player);
          break;
        case 1:
          this.userManagement(player);
          break;
      }
    });
  }
  static userManagement(player: Player, sp: Specialist = Terra.getSpecialistCache(player)): void {
    const ui = new ActionFormData()
      .title(player.name)
      .body({ translate: "cz.user.body" })
      .button({ translate: "user.reset" })
      .button({ translate: "system.transfer" })
      .button({ translate: "system.reload" });

    if (player.commandPermissionLevel >= CommandPermissionLevel.Admin) {
      ui.button({ translate: "user.reset.bal" });
      ui.button({ translate: "user.reset.stamina" });
      ui.button({ translate: "user.reset.temp" });
      ui.button({ translate: "user.reset.thirst" });
      ui.button({ translate: "user.reset.rep" });
      ui.button({ rawtext: [{ translate: "system.add" }, { text: " $5000" }] });
      ui.button({ rawtext: [{ translate: "system.add" }, { text: " 20 Voxn" }] });
      ui.button({ translate: "user.random.quest" });
    }

    ui.show(player).then((e) => {
      switch (e.selection) {
        case 0:
          sp.setSp(CreateObject.createSpecialist(player));
          break;
        case 1:
          // transfer money
          break;
        case 2:
          Terra.save(true);
          world.getDimension("overworld").runCommand("reload");
          break;
        case 3:
          sp.setMoney(0);
          break;
        case 4:
          sp.setStamina(100);
          sp.setMaxStamina("max", 100);
          sp.setMaxStamina("additional", 0);
          sp.setMaxStamina("rune", 0);
          break;
        case 5:
          sp.setThirst(100);
          sp.setMaxThrist("max", 100);
          sp.setMaxThrist("temp", 0);
          break;
        case 7:
          sp.setRep(0);
          break;
        case 8:
          sp.addMoney(5000);
          break;
        case 9:
          sp.addVoxn(20);
          break;
        case 10:
          new Quest(player).setRandom();
          break;
      }
    });
  }

  static quest(player: Player): void {
    const quest = new Quest(player);

    const data = quest.getPlayerQuest();
    if (data.id < 1) {
      player.sendMessage({ translate: "quest.nope" });
      return;
    }

    const questInfo = quest.getQuest(data.id);

    if (!questInfo) {
      player.sendMessage({ translate: "quest.nope" });
      return;
    }

    new ActionFormData()
      .title("cz:quest")
      .body({
        rawtext: [
          { translate: `${questInfo.title}` },
          { text: "\n \n" },
          { translate: `${questInfo.title + ".des"}` },
          { text: `\n${quest.rawAct(questInfo)}\n\n` },
          { translate: "system.reward" },
          { text: `${quest.rawReward(questInfo)}` },
        ],
      })
      .button({ translate: "cz.back" })

      .show(player);
  }

  static redeem(player: Player): void {
    new ModalFormData()
      .title("cz:redeem")
      .textField({ translate: "input.code" }, { translate: "type.string" }, { tooltip: "system.info.code" })

      .show(player)
      .then((e) => {
        const [code] = e.formValues && typeof e.formValues[0] === "string" ? e.formValues[0] : "";

        console.warn(code);
      });
  }

  static wiki(player: Player): void {
    new ActionFormData()
      .title("cz:wiki")
      .body({ translate: "cz.wiki.body" })
      .button({ translate: "wiki.about" })

      .show(player)
      .then((e) => {
        console.warn("test");
      });
  }
}

const adminRole = ["admin", "super_admin"];
const allRole = ["member", ...adminRole];
const method = [{ translate: "system.add" }, { translate: "system.min" }, { translate: "system.set" }];

class GuildPanel {
  static home(player: Player): void {
    const guild = Terra.guild.getGuildByPlayer(player);

    const ui = new ActionFormData()
      .title("cz.guild")
      .body({ text: "test" })
      .button({ translate: "system.guild.create" })
      .button({ translate: "system.guild.join" });

    if (guild) ui.button({ translate: "system.guild.me" }).button({ translate: "system.guild.shop" });

    ui.show(player).then((e) => {
      switch (e.selection) {
        case 0:
          this.create(player);
          break;
        case 1:
          this.list(player);
          break;
        case 2:
          if (!guild) {
            player.sendMessage({ translate: "system.guild.notHave" });
            return;
          }
          this.detailGuild(player, guild.id, guild);
          break;
        case 3:
          this.shop(player, Terra.guild.getGuildByPlayer(player));
          break;
      }
    });
  }

  static create(
    player: Player,
    beforeValues: { name?: string; description?: string; approve: boolean } = { approve: false }
  ): void {
    if (Terra.guild.hasJoinGuild(player)) {
      player.sendMessage({ translate: "system.guild.have" });
      return;
    }

    new ModalFormData()
      .title("cz:guild.create")
      .textField({ translate: "guild.name" }, { translate: "guild.name.info" }, { defaultValue: beforeValues.name })
      .textField(
        { translate: "guild.des" },
        { translate: "guild.des.body" },
        { defaultValue: beforeValues.description }
      )
      .toggle({ translate: "guild.approve" }, { defaultValue: false, tooltip: "guild.approve.tooltip" })

      .show(player)
      .then((e) => {
        if (e.canceled) {
          this.home(player);
          return;
        }

        const formValues = e.formValues ?? [];
        const name = typeof formValues[0] === "string" ? formValues[0] : undefined;
        const description = typeof formValues[1] === "string" ? formValues[1] : "";
        const approve = typeof formValues[2] === "boolean" ? formValues[2] : false;

        if (!name || name.length < 1) {
          player.sendMessage({ translate: "system.guild.validation" });
          return;
        }

        const guild = Terra.guild.getData({ name });

        if (guild.length > 0) {
          player.sendMessage({ translate: "system.guild.name.duplicate" });
          return;
        }

        this.createConfirm(player, (res: MessageFormResponse) => {
          if (res.canceled || res.selection === 1) {
            this.create(player, { name, description, approve });
            return;
          }

          const sp = Terra.getSpecialistCache(player);

          if (sp.getMoney() < (Terra.world.setting?.guildCreateCost || 2_000)) {
            player.sendMessage({ translate: "system.guild.create.noMoney" });
            return;
          }

          Terra.guild.createGuild(player, name, description, approve);
          sp.minMoney(Terra.world.setting?.guildCreateCost || 2_000);

          player.sendMessage({ translate: "system.guild.created", with: [name] });

          this.detailGuild(player, name);
        });
      });
  }

  static createConfirm(player: Player, callback: Function): void {
    new MessageFormData()
      .title({ translate: "system.guild.createConfirm" })
      .body({
        translate: "system.guild.createConfirm.body",
        with: [String(Terra.world.setting?.guildCreateCost || 2_000)],
      })
      .button1({ translate: "system.yes" })
      .button2({ translate: "system.cancel" })

      .show(player)
      .then((e: MessageFormResponse) => {
        if (typeof callback !== "function") return;

        callback?.(e);
      });
  }

  // Detail
  static detailGuild(
    player: Player,
    guildId: string,
    guild: GuildData | undefined = Terra.guild.getData({ name: guildId })[0]
  ): void {
    if (!guild) {
      player.sendMessage({ translate: "system.guild.notFound" });
      return;
    }

    const { token, members, maxMember, des, approval, level, id, name } = guild;
    const member = members.find((e) => e.id === player.id);

    const ui = new ActionFormData()
      .title(name)
      .body({
        rawtext: [
          { translate: "guild.name" },
          { text: `\n> ${name}§r\n\nLvl ${level.lvl} | ${level.xp} XP\n\n${des}\n\nID ${id}\n` },
          { translate: "guild.token" },
          { text: ` ${token}\n${members.length}/${maxMember} ` },
          { translate: "guild.member" },
          { text: "\n\n" },
          { translate: "guild.approve" },
          { text: ` ${approval}` },
        ],
      })
      .button({
        translate: member ? "system.guild.leave" : !approval ? "system.guild.join" : "system.guild.joinRequest",
      })
      .button({ translate: "guild.member" });

    if (member && typeof member.role === "string" && ["super_admin", "admin"].includes(member.role)) {
      ui.button({ translate: "system.guild.edit" }).button({ translate: "system.guild.applier" });
      if (member.role === "super_admin") ui.button({ translate: "system.guild.delete" });
    }

    ui.show(player).then((e) => {
      if (e.canceled) {
        this.home(player);
        return;
      }

      switch (e.selection) {
        case 0:
          // Leave
          if (member) {
            this.leave(player, guild);
            return;
          }

          // Join
          this.join(player, guild.id);
          break;
        case 1:
          this.member(player, guild);
          break;
        case 2:
          this.edit(player, guild);
          break;
        case 3:
          this.applicant(player, guild);
          break;
        case 4:
          this.delete(player, guild);
          break;
      }
    });
  }

  static join(player: Player, guildId: string): void {
    if (Terra.guild.hasJoinGuild(player)) {
      player.sendMessage({ translate: "system.guild.have" });
      return;
    }

    if (guildId === "") {
      player.sendMessage({ translate: "system.guild.invalid.id" });
      return;
    }

    const guild = Terra.guild.getGuild(guildId);

    if (!guild) {
      player.sendMessage({ translate: "system.guild.notFound" });
      return;
    }

    new MessageFormData()
      .title({ translate: guild.approval ? "guild.joinRequest" : "guild.join" })
      .body({ translate: guild.approval ? "system.guild.request" : "system.guild.join", with: [guild.name] })
      .button1({ translate: "system.yes" })
      .button2({ translate: "system.cancel" })

      .show(player)
      .then((e) => {
        if (e.canceled || e.selection === 1) {
          this.detailGuild(player, guild.id);
          return;
        }

        if (guild.approval) {
          Terra.guild.addApply(guild.id, player);
          player.sendMessage({ translate: "system.guild.requested" });
          return;
        }

        Terra.guild.addMember(guild.id, player);
        player.sendMessage({ translate: "system.guild.join" });
      });
  }

  static leave(player: Player, guild: GuildData | undefined = Terra.guild.getGuildByPlayer(player)): void {
    if (!guild) {
      player.sendMessage({ translate: "system.guild.notHanve" });
      return;
    }

    const isOwner = guild.members.find((e) => e.id === player.id)?.role === "super_admin";

    new MessageFormData()
      .title({ translate: "system.guild.leave" })
      .body({ translate: isOwner ? "system.guild.isOwner" : "system.guild.leaveConfirm", with: [guild.name] })
      .button1({ translate: isOwner ? "system.ok" : "system.yes" })
      .button2({ translate: "system.cancel" })

      .show(player)
      .then((e) => {
        if (e.canceled || e.selection === 1) {
          this.detailGuild(player, guild.name);
          return;
        }

        if (isOwner) return;

        Terra.guild.removeMember(guild.id, player);
        player.sendMessage({ translate: "system.guild.leaved" });
      });
  }

  // Member
  static member(player: Player, guild: GuildData): void {
    const ui = new ActionFormData()
      .title({ translate: "guild.member", with: [guild.name] })
      .body({ translate: "guild.member.body" });

    guild.members.forEach((e) => ui.button(e.name));

    ui.button({ translate: "system.back" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        if (e.selection === guild.members.length) {
          this.detailGuild(player, guild.id, guild);
          return;
        }

        this.user(player, guild, guild.members[e.selection || 0]);
      });
  }

  static user(player: Player, guild: GuildData, target: GuildMember): void {
    const me = guild.members.find((e) => e.id === player.id);

    const ui = new ActionFormData()
      .title(target.name)
      .body({ translate: "guild.member.options" })
      .button({ translate: "system.back" });

    if (player.id !== target.id && me && typeof me.role === "string" && ["super_admin", "admin"].includes(me.role)) {
      ui.button({ translate: "system.guild.role" });
      if (me.role !== "super_admin") ui.button({ translate: "system.guild.kick" });
    }

    ui.show(player).then((e) => {
      if (e.canceled) return;

      switch (e.selection) {
        case 0:
          this.member(player, guild);
          break;
        case 1:
          this.role(player, guild, target);
          break;
        case 2:
          this.kick(player, guild, target);
          break;
      }
    });
  }

  static role(player: Player, guild: GuildData, member: GuildMember): void {
    const roles = ["member", "admin", "super_admin"];
    const me = guild.members.find((e) => e.id === player.id);
    if (!me || me.role !== "super_admin") roles.pop();

    const rolesTranslate = roles.map((e) => {
      return { translate: "guild.role." + e };
    });

    const roleIndex = roles.findIndex((e) => e === member.role) || 0;

    new ModalFormData()
      .title({ translate: "system.guild.roles", with: [member.name] })
      .dropdown({ translate: "system.guild.roles.select" }, rolesTranslate, { defaultValueIndex: roleIndex })
      .submitButton({ translate: "system.change" })

      .show(player)
      .then((e) => {
        const formValues = e.formValues ?? [];
        const newRoleIndex = typeof formValues[0] === "number" ? formValues[0] : 0;

        if (e.canceled || roleIndex === newRoleIndex) {
          this.user(player, guild, member);
          return;
        }

        player.sendMessage(newRoleIndex > roleIndex ? "system.guild.role.up" : "system.guild.role.down");
        Terra.guild.updateMember(guild.id, member, roles[newRoleIndex] as GuildRole);

        this.member(player, Terra.guild.getGuild(guild.id) || guild);
      });
  }

  static kick(player: Player, guild: GuildData, member: GuildMember): void {
    new MessageFormData()
      .title({ translate: "system.guild.kick", with: [member.name] })
      .body({ translate: "system.guild.kickConfirm" })
      .button1({ translate: "system.yes" })
      .button2({ translate: "system.cancel" })

      .show(player)
      .then((e) => {
        if (e.canceled || e.selection === 1) {
          this.user(player, guild, member);
          return;
        }

        if (player.id === member.id) {
          player.sendMessage({ translate: "system.guild.kickSelf" });
          return;
        }

        player.sendMessage({ translate: "system.guild.kicked", with: [member.name] });
        Terra.guild.removeMember(guild.id, member);

        this.member(player, Terra.guild.getGuild(guild.id) || guild);
      });
  }

  // Applier
  static applicant(player: Player, guild: GuildData): void {
    const ui = new ActionFormData()
      .title({ translate: "guild.applier", with: [guild.name] })
      .body({ translate: "guild.applier.body" });

    guild.applier.forEach((e) => ui.button(e.name));

    ui.button({ translate: "system.back" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        if (e.selection === guild.applier.length) {
          this.detailGuild(player, guild.id, guild);
          return;
        }

        const target = guild.applier[e.selection || 0];

        this.acceptConfirm(
          player,
          (r: MessageFormResponse) => {
            if (r.canceled) {
              this.applicant(player, guild);
              return;
            }

            if (r.selection === 1) {
              Terra.guild.removeApply(guild.id, target);

              player.sendMessage({ translate: "system.guild.reject", with: [target.name] });

              const plyr = Terra.getPlayer({ id: target.id });

              if (!plyr || Array.isArray(plyr) || !(plyr instanceof Player)) return;
              plyr.sendMessage({ translate: "system.guild.rejected", with: [guild.name] });
              return;
            }
            Terra.guild.acceptApply(guild.id, target);
            player.sendMessage({ translate: "system.guild.accept", with: [target.name] });

            const plyr = Terra.getPlayer({ id: target.id });

            if (!plyr || Array.isArray(plyr) || !(plyr instanceof Player)) return;
            plyr.sendMessage({ translate: "system.guild.accepted", with: [guild.name] });
          },
          target.name
        );
      });
  }

  static acceptConfirm(player: Player, callback: Function, name: string): void {
    new MessageFormData()
      .title({ translate: "system.guild.acceptConfirm" })
      .body({
        translate: "system.guild.acceptConfirm.body",
        with: [name],
      })
      .button1({ translate: "system.accept" })
      .button2({ translate: "system.reject" })

      .show(player)
      .then((e: MessageFormResponse) => {
        if (typeof callback !== "function") return;

        callback?.(e);
      });
  }

  // Guild Methods
  static edit(player: Player, guild: GuildData): void {
    new ModalFormData()
      .title({ translate: "system.guild.edit" })
      .textField({ translate: "guild.name" }, { translate: "guild.name.info" }, { defaultValue: guild.name })
      .textField({ translate: "guild.des" }, { translate: "guild.des.body" }, { defaultValue: guild.des })
      .toggle({ translate: "guild.approve" }, { defaultValue: guild.approval })

      .show(player)
      .then((e) => {
        if (e.canceled) {
          this.detailGuild(player, guild.id, guild);
          return;
        }

        const formValues = e.formValues ?? [];

        const newName = typeof formValues[0] === "string" ? formValues[0] : guild.name;
        const newDescription = typeof formValues[1] === "string" ? formValues[1] : guild.des;
        const newApproval = typeof formValues[2] === "boolean" ? formValues[2] : guild.approval;

        if (newName === guild.name && newDescription === guild.des && newApproval === guild.approval) {
          this.edit(player, guild);
          return;
        }

        const newData = { ...guild, name: newName, des: newDescription, approval: newApproval };

        Terra.guild.updateData(newData);

        this.detailGuild(player, newData.id);
      });
  }

  static delete(player: Player, guild: GuildData): void {
    const isOwner = guild.members.find((e) => e.id === player.id)?.role === "super_admin";

    if (!isOwner) {
      player.sendMessage({ translate: "system.guild.notOwner" });
      return;
    }

    new MessageFormData()
      .title({ translate: "system.guild.delete" })
      .body({ translate: "system.guild.deleteConfirm" })
      .button1({ translate: "system.yes" })
      .button2({ translate: "system.cancel" })

      .show(player)
      .then((e) => {
        if (e.canceled || e.selection === 1) {
          this.detailGuild(player, guild.id, guild);
          return;
        }

        world.sendMessage({ translate: "system.guild.deleted", with: [guild.name] });
        Terra.guild.deleteGuild(guild.id);
      });
  }

  // List
  static list(player: Player): void {
    const guilds = Terra.guild.getData();
    const ui = new ActionFormData()
      .title({ translate: "system.guild.list" })
      .body({ translate: "system.guild.list.body" });

    guilds.forEach((e) => ui.button({ translate: e.name }));

    ui.button({ translate: "system.back" })
      .show(player)
      .then((e) => {
        if (e.canceled || e.selection === guilds.length) {
          this.home(player);
          return;
        }

        if (typeof e.selection === "number" && guilds[e.selection]) {
          this.detailGuild(player, guilds[e.selection].id);
          return;
        }
      });
  }

  // Shop
  static shop(player: Player, guild: GuildData | undefined): void {
    if (!guild) {
      player.sendMessage({ translate: "system.guild.notHave" });
      return;
    }
    const ui = new ActionFormData().title({ translate: "guild.shop" }).body({ translate: "guild.shop.body" });
    const iterable: GuildShopItem[] = [];

    Object.keys(guildShop)
      .sort((a, b) => a.localeCompare(b))
      .forEach((e: string) => {
        const section = guildShop[e]
          .filter((b) => b.lvl <= guild.level.lvl)
          .sort((a, b) => a.item.replace("cz:", "").localeCompare(b.item.replace("cz:", "")));
        if (section.length < 1) return;
        ui.label(Formater.formatName(e));

        section.forEach((r: GuildShopItem) => {
          const name = r.item.replace(/cz:|minecraft:/g, "").replace(/_/g, " ");
          const modName = r.enchant
            ? r.enchant
                .split("*")[0]
                .split("_")
                .map((e) => Formater.formatName(e))
                .join(" ") +
              " Lvl " +
              r.enchant.split("*")[1]
            : name;

          ui.button({ text: Formater.formatName(modName) }, r.texture);

          iterable.push(r);
        });
      });

    ui.show(player).then((e) => {
      if (e.canceled) return;

      const item = iterable[e.selection || 0];

      item.enchant ? this.buyEnchant(player, guild, item) : this.buy(player, guild, item);
    });
  }

  static buy(player: Player, guild: GuildData, item: GuildShopItem): void {
    new ModalFormData()
      .title({ translate: "guild.buy" })
      .label({ translate: "guild.buy.item", with: [item.item, String(item.amount), String(item.token)] })
      .divider()
      .textField({ translate: "system.buy.amount" }, { translate: "type.number" })
      .submitButton({ translate: "system.buyButton" })

      .show(player)
      .then((e) => {
        if (e.canceled) {
          this.shop(player, guild);
          return;
        }

        const inventory = player.getComponent("inventory")?.container;
        if (!inventory) {
          player.sendMessage({ translate: "system.error.inventory" });
          return;
        }
        const formValues = e.formValues?.slice(2) ?? [];

        let amount: number = 0;
        if (typeof formValues[0] === "string") {
          const parsed = parseInt(formValues[0]);
          amount = isNaN(parsed) ? 0 : parsed;
        } else if (typeof formValues[0] === "number") {
          amount = formValues[0];
        }

        if (amount * item.token > guild.token) {
          player.sendMessage({ translate: "system.buy.outToken", with: [String(amount * item.token)] });
          return;
        }

        let total = amount * item.amount;

        if (total / 64 > inventory.emptySlotsCount) {
          player.sendMessage({ translate: "system.full.inventory" });
          return;
        }
        Terra.guild.minToken(guild.id, amount * item.token);
        player.sendMessage({
          translate: "system.guild.buy",
          with: [item.enchant ?? item.item, String(amount), String(amount * item.token)],
        });

        system.run(() => {
          while (total > 0) {
            const value = total > 64 ? 64 : total;
            const newItem = new ItemStack(item.item.startsWith("cz:") ? item.item : "minecraft:" + item.item, value);

            inventory.addItem(newItem);
            total -= value;
          }
        });
      });
  }

  static buyEnchant(player: Player, guild: GuildData, item: GuildShopItem): void {
    new ModalFormData()
      .title({ translate: "guild.buy" })
      .label({
        translate: "guild.buy.item.enchant",
        with: [item.item, item.enchant || "", String(item.amount), String(item.token)],
      })
      .divider()
      .textField({ translate: "system.buy.amount" }, { translate: "type.number" })
      .submitButton({ translate: "system.buyButton" })

      .show(player)
      .then((e) => {
        if (e.canceled || !item.enchant) {
          this.shop(player, guild);
          return;
        }

        const inventory = player.getComponent("inventory")?.container;
        if (!inventory) {
          player.sendMessage({ translate: "system.error.inventory" });
          return;
        }
        const formValues = e.formValues?.slice(2) ?? [];

        let amount: number = 0;
        if (typeof formValues[0] === "string") {
          const parsed = parseInt(formValues[0]);
          amount = isNaN(parsed) ? 0 : parsed;
        } else if (typeof formValues[0] === "number") {
          amount = formValues[0];
        }

        if (amount * item.token > guild.token) {
          player.sendMessage({ translate: "system.buy.outToken", with: [String(amount * item.token)] });
          return;
        }

        if (amount > inventory.emptySlotsCount) {
          player.sendMessage({ translate: "system.full.inventory" });
          return;
        }
        Terra.guild.minToken(guild.id, amount * item.token);
        player.sendMessage({
          translate: "system.guild.buy",
          with: [item.item, String(amount), String(amount * item.token)],
        });

        system.run(() => {
          while (amount > 0) {
            const newItem = new ItemStack(item.item.startsWith("cz:") ? item.item : "minecraft:" + item.item, 1);
            const enchantable = newItem.getComponent("enchantable");
            if (enchantable) {
              enchantable.addEnchantment({
                type: new EnchantmentType(item.enchant!.split("*")[0]),
                level: parseInt(item.enchant!.split("*")[1]) || 1,
              });
            }

            inventory.addItem(newItem);
            amount -= 1;
          }
        });
      });
  }

  // Admin
  static admin(player: Player): void {
    if (player.playerPermissionLevel < PlayerPermissionLevel.Operator) {
      player.sendMessage({ translate: "system.must.operator" });
      return;
    }

    new ActionFormData()
      .title({ translate: "guild.admin" })
      .body({ translate: "guild.admin.body" })
      .divider()
      .label({ translate: "section.management" })
      .button({ translate: "guild.lvl" })
      .button({ translate: "guild.token" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        switch (e.selection) {
          case 0:
            this.adminLvl(player);
            break;
          case 1:
            this.adminToken(player);
            break;
        }
      });
  }

  static adminToken(player: Player): void {
    const data = Terra.guild.getData().sort((a, b) => a.name.localeCompare(b.name));

    new ModalFormData()
      .title({ translate: "guild.token" })
      .dropdown(
        { translate: "guild.name" },
        data.length < 1
          ? [{ translate: "system.none" }]
          : data.map((e) => {
              return { text: `${e.name} | Token: ${e.token}` };
            })
      )
      .dropdown({ translate: "system.method.token" }, method)
      .textField({ translate: "system.amount" }, { translate: "type.number" })
      .submitButton({ translate: "system.confirm" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const formValues = e.formValues ?? [];

        const index = typeof formValues[0] === "number" ? formValues[0] : 0;
        if (index === data.length) return;

        const operation = typeof formValues[1] === "number" ? formValues[1] : 0;
        let amount: number = 0;
        if (typeof formValues[2] === "string") {
          const parsed = parseInt(formValues[2]);
          amount = isNaN(parsed) ? 0 : parsed;
        } else if (typeof formValues[2] === "number") {
          amount = formValues[2];
        }

        const guild = data[index];
        if (!guild || (operation < 2 && amount === 0)) return;

        switch (operation) {
          case 0:
            Terra.guild.addToken(guild.id, amount);
            break;
          case 1:
            Terra.guild.minToken(guild.id, amount);
            break;
          case 2:
            Terra.guild.setToken(guild.id, amount);
            break;
        }
      });
  }

  static adminLvl(player: Player): void {
    const data = Terra.guild.getData().sort((a, b) => a.name.localeCompare(b.name));

    new ModalFormData()
      .title({ translate: "guild.level" })
      .dropdown(
        { translate: "guild.name" },
        data.length < 1
          ? [{ translate: "system.none" }]
          : data.map((e) => {
              return { text: `${e.name} | Lvl: ${e.level.lvl}(${e.level.xp} XP)` };
            })
      )
      .dropdown({ translate: "guild.level.select" }, [
        { translate: "guild.level.lvl" },
        { translate: "guild.level.xp" },
      ])
      .dropdown(
        { translate: "system.method.lvl" },
        method.filter((e) => e.translate !== "system.min")
      )
      .textField({ translate: "system.amount" }, { translate: "type.number" })
      .submitButton({ translate: "system.confirm" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const formValues = e.formValues ?? [];

        const index = typeof formValues[0] === "number" ? formValues[0] : 0;
        if (index === data.length) return;

        const key = typeof formValues[1] === "number" ? formValues[1] : 0;
        const operation = typeof formValues[2] === "number" ? formValues[2] : 0;
        let amount: number = 0;
        if (typeof formValues[3] === "string") {
          const parsed = parseInt(formValues[3]);
          amount = isNaN(parsed) ? 0 : parsed;
        } else if (typeof formValues[3] === "number") {
          amount = formValues[3];
        }

        const guild = data[index];
        if (!guild || (operation < 1 && amount === 0)) return;

        switch (operation) {
          case 0:
            key === 0 ? Terra.guild.addLvl(guild.id, amount) : Terra.guild.addXp(guild.id, amount);
            break;
          case 1:
            key === 0 ? Terra.guild.setLvl(guild.id, amount) : Terra.guild.setXp(guild.id, amount);
            break;
        }
      });
  }
}

class GachaPanel {
  static home(player: Player): void {
    new ActionFormData()
      .title({ translate: "cz.gacha" })
      .body({ translate: "cz.gacha.body" })
      .button({ translate: "gacha.weapon" })
      .button({ translate: "gacha.rune" })
      .button({ translate: "gacha.exchange" })
      .button({ translate: "system.back" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        switch (e.selection) {
          case 0:
            this.weapon(player);
            break;
          case 1:
            this.rune(player);
            break;
          case 2:
            this.exchange(player);
            break;
          case 3:
            UserPanel.home(player);
            break;
        }
      });
  }

  static weapon(player: Player): void {
    new ActionFormData()
      .title("cz:gacha.weapon")
      .body(gachaFeatured.name ? { text: gachaFeatured.name } : { translate: "gacha.weapon.body" })
      .button({ translate: "system.pull.1", with: [String(WEAPON_GACHA_PRICE * 1)] })
      .button({ translate: "system.pull.3", with: [String(WEAPON_GACHA_PRICE * 3)] })
      .button({ translate: "system.pull.5", with: [String(WEAPON_GACHA_PRICE * 5)] })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const sp = Terra.getSpecialistCache(player);

        const total: number = [1, 3, 5][e.selection || 0];

        if (sp.getVoxn() < WEAPON_GACHA_PRICE * total) {
          player.sendMessage({ translate: "system.buy.outVoxn" });
          return;
        }
        const data = sp.getSp();

        sp.minVoxn(WEAPON_GACHA_PRICE * total);

        for (let i = 1; i <= total; i++) {
          const result = Gacha.weapon(player),
            weaponConst = weaponRaw[result.rarity as keyof typeof weaponData][result.weapon];

          if (!weaponConst) {
            player.sendMessage({ translate: "system.gacha.error.notFound" });
            continue;
          }
          player.runCommand(`give @s cz:${result.weapon} 1`);

          if (!data.weapons.some((r) => r.weapon === result.weapon))
            data.weapons.push({ ...structuredClone(weaponConst) });

          player.sendMessage({
            translate: "system.gacha.result.weapon",
            with: [Formater.formatRarity(result.weapon, result.rarity)],
          });
        }
      });
  }
  static rune(player: Player): void {
    new ActionFormData()
      .title("cz:gacha.rune")
      .body({ translate: "gacha.rune.body" })
      .button({ translate: "system.pull.1", with: [String(RUNE_GACHA_PRICE * 1)] })
      .button({ translate: "system.pull.3", with: [String(RUNE_GACHA_PRICE * 3)] })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const sp = Terra.getSpecialistCache(player),
          rune = sp.rune;

        const total: number = [1, 3][e.selection || 0];

        if (sp.getVoxn() < RUNE_GACHA_PRICE * total) {
          player.sendMessage({ translate: "system.buy.outVoxn" });
          return;
        }

        sp.minVoxn(RUNE_GACHA_PRICE * total);

        for (let i = 1; i <= total; i++) {
          const result: string = Gacha.rune();

          const find = rune.getRune().find((e) => e.name === result);

          find ? player.runCommand(`give @s cz:diamond_ascend`) : rune.addRune({ name: result, lvl: 1 });

          player.sendMessage({ translate: "system.gacha.result.rune", with: [Formater.formatName(result)] });
        }
      });
  }
  static exchange(player: Player): void {}
}

export { GachaPanel, GuildPanel, UserPanel };
