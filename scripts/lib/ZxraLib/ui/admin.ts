import { Player } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { Parser, RedeemData, Setting, settings, Terra } from "../module";

class AdminPanel {
  static home(player: Player): void {
    new ActionFormData()
      .title("cz:admin_panel")
      .body({ translate: "cz.admin_panel.body" })
      .button({ translate: "settings.world" })
      .button({ translate: "system.admin_redeem" })
      .button({ translate: "system.plugins" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const menu: ((user: Player) => void)[] = [this.world, this.redeemManagement, this.pluginsList];

        menu[e.selection ?? 0].call(this, player);
      });
  }

  static world(player: Player): void {
    new ActionFormData()
      .title("settings:world")
      .body({ translate: "settings.world.body" })
      .button({ translate: "system.change.settings" })
      .button({ translate: "system.save" })
      .button({ translate: "system.worldData.export" })
      .button({ translate: "system.worldData.import" })
      .button({ translate: "system.worldSettings.reset" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const menu: ((user: Player) => void)[] = [
          this.settings,
          function (user: Player) {
            Terra.save(true);
            AdminPanel.world(user);
          },
          this.exportData,
          this.importData,
          this.resetSettings,
        ];

        menu[e.selection ?? 0]?.call(this, player);
      });
  }

  static settings(player: Player): void {
    const {
      // General
      chainBreakFilter,
      debug,
      uiLevelRequirement,
      useBzbRules,
      uuidLength,
      saveInterval,
      whatSeeDistance,
      //  Features
      customChat,
      customChatPrefix,
      damageIndicator,
      deathLocation,
      guildCreateCost,
      shopMultiplier,
      starterItemMessage,
      starterItems,
      starterItem,
      xpMultiplier,
      // Stamina
      staminaAction,
      staminaCooldown,
      staminaExhaust,
      staminaHurt,
      staminaRecovery,
      staminaRun,
      // Thirst
      thirstRun,
    }: Setting = Terra.world.setting || Parser.clone(settings);

    new ModalFormData()
      .title("cz:admin_settings")
      // General
      .label({ translate: "option.label.general" })
      .textField(
        { translate: "option.chainBreakFilter" },
        { translate: "type.string" },
        { defaultValue: String((chainBreakFilter ?? []).join(", ")) }
      )
      .toggle({ translate: "option.debug" }, { defaultValue: debug })
      .textField(
        { translate: "option.uuidLength" },
        { translate: "type.integer" },
        { defaultValue: String(uuidLength) }
      )
      .toggle({ translate: "option.uiLevelRequirement" }, { defaultValue: uiLevelRequirement })
      .toggle({ translate: "option.useBzbRules" }, { defaultValue: useBzbRules })
      .textField(
        { translate: "option.saveInterval" },
        { translate: "type.tick" },
        { defaultValue: String(saveInterval), tooltip: "type.tick.tooltip" }
      )
      .textField(
        { translate: "option.whatSeeDistance" },
        { translate: "type.tick" },
        { defaultValue: String(whatSeeDistance) }
      )
      .divider()
      // Features
      .label({ translate: "option.label.features" })
      .toggle({ translate: "option.customChat" }, { defaultValue: customChat })
      .textField(
        { translate: "option.customChatPrefix" },
        { translate: "type.string" },
        { defaultValue: customChatPrefix }
      )
      .toggle({ translate: "option.damageIndicator" }, { defaultValue: damageIndicator })
      .toggle({ translate: "option.deathLocation" }, { defaultValue: deathLocation })
      .textField(
        { translate: "option.guildCreateCost" },
        { translate: "type.number" },
        { defaultValue: String(guildCreateCost) }
      )
      .textField(
        { translate: "option.shopMultiplier" },
        { translate: "type.number" },
        { defaultValue: String(shopMultiplier) }
      )
      .textField(
        { translate: "option.starterItemMessage" },
        { translate: "type.string" },
        { defaultValue: starterItemMessage }
      )
      .textField(
        { translate: "option.starterItems" },
        { translate: "type.string" },
        { defaultValue: (starterItems ?? []).map((r) => r.item + "*" + r.amount).join(",") }
      )
      .divider()
      // Stamina
      .label({ translate: "option.label.stamina" })
      .textField(
        { translate: "option.staminaAction" },
        { translate: "type.float" },
        { defaultValue: String(staminaAction) }
      )
      .toggle({ translate: "option.staminaCooldown" }, { defaultValue: staminaCooldown })
      .textField(
        { translate: "option.staminaExhaust" },
        { translate: "type.float" },
        { defaultValue: String(staminaExhaust) }
      )
      .textField(
        { translate: "option.staminaHurt" },
        { translate: "type.float" },
        { defaultValue: String(staminaHurt) }
      )
      .textField(
        { translate: "option.staminaRecovery" },
        { translate: "type.float" },
        { defaultValue: String(staminaRecovery) }
      )
      .textField({ translate: "option.staminaRun" }, { translate: "type.float" }, { defaultValue: String(staminaRun) })
      .divider()
      // Thirst
      .label({ translate: "option.label.thirst" })

      .submitButton({ translate: "option.submit" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        const formValues = e.formValues ?? [];
      });
  }

  static exportData(player: Player): void {
    const data = Terra.exportDataToJSON();

    new ModalFormData()
      .title("cz:admin_export")
      .textField(
        { translate: "system.export.data" },
        { translate: "type.string" },
        { defaultValue: JSON.stringify(data) }
      )
      .submitButton({ translate: "system.ok" })

      .show(player)
      .then((e) => {
        if (e.canceled) return;

        this.home(player);
      });
  }

  static importData(player: Player): void {
    new ModalFormData()
      .title("cz:admin_import")
      .textField({ translate: "system.import" }, { translate: "type.string" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;
      });
  }

  static resetSettings(player: Player): void {
    new MessageFormData()
      .title({ translate: "system.reset.settings" })
      .body({ translate: "system.reset.settings.form" })
      .button1({ translate: "system.confirm" })
      .button2({ translate: "system.cancel" })
      .show(player)
      .then((e) => {
        if (e.canceled) return;

        if (e.selection === 1) {
          this.home(player);
          return;
        }

        Terra.resetWorldSettingsData();
        player.sendMessage({ translate: "system.reset.settings.complete" });
      });
  }

  static pluginsList(player: Player): void {
    const ui = new ActionFormData().title("cz:plugin_list").body({ translate: "cz.admin.plugin" });

    Terra.plugins.forEach((e) => ui.button(`${e.name} ${e.version}`));

    ui.show(player).then((e) => {
      if (e.canceled) return;

      const pl = Terra.plugins[(e.selection ?? 0) as number];

      new ActionFormData()
        .title(pl.name)
        .body({
          text: `Plugin Name: ${pl.name}
Version ${pl.version}

Namespace '${pl.namespace}'
Endpoint:
In  : ${pl.namespace}:${pl.endpoint.in}
Out : ${pl.namespace}:${pl.endpoint.out}
`,
        })
        .button({ translate: "system.back" })
        .show(player)
        .then((r) => {
          if (r.canceled) return;

          this.pluginsList(player);
        });
    });
  }

  static redeemManagement(player: Player): void {
    const redeems = Terra.world.redeem;

    const ui = new ActionFormData().title({ translate: "cz:redeem_management" }).body({ translate: "cz.admin.redeem" });

    if (redeems.length > 0) redeems.forEach((e) => ui.button({ text: e.key }));

    ui.button({ rawtext: [{ text: "<" }, { translate: "system.add" }, { text: ">" }] })
      .show(player)
      .then((e) => {
        if (e.canceled) return;
      });
  }

  static redeemEdit(player: Player, data: RedeemData | undefined): void {
    new ModalFormData()
      .title({ translate: "cz:redeem_item" })
      .textField({ translate: "system.redeem.key" }, { translate: "type.string" }, { defaultValue: data?.key })
      .textField(
        { translate: "system.redeem.rewards" },
        { translate: "type.string" },
        { defaultValue: data?.rewards.map((e) => "" + e.item + "*" + e.amount).join(",") }
      )
      .submitButton({ translate: "system.comfirm" })
      .show(player);
  }
}

export { AdminPanel };
