import { Player } from "@minecraft/server";
import { Script, ScriptParams, Terra } from "../module";

Script.add("reset_specialist", ({ msg }: ScriptParams) => {
  const id = msg[0];

  if (!id) {
    console.warn("No id provided");
    return;
  }

  const target = Terra.getSpecialist(id);

  if (!target) {
    console.warn("No id provided");
    return;
  }

  Terra.remSpecialist(id);
});

Script.add("reset_leaderboard", ({}: ScriptParams) => {
  Terra.leaderboard.resetLb();
});
