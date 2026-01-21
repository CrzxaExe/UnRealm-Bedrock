import {
  Block,
  CustomCommand,
  CustomCommandOrigin,
  CustomCommandResult,
  Entity,
  MolangVariableMap,
  Player,
  ScriptEventSource,
  Vector3,
} from "@minecraft/server";
import {
  Currency,
  NpcModels,
  Specialist,
  SpecialistData,
  StatusDecay,
  StatusTypes,
  ModifierTypes,
  ModifierActiveActions,
} from "../module";

// Anti heal data
type AntiHealData = {
  id: string;
  canHeal: boolean;
};

// Boss interface
type BossChallengeData = {
  boss: Entity | undefined;
  participants: BossChallangeParticipant[];
};
type BossChallangeParticipant = {
  player: Player;
  damage: number;
};

// Cooldown interface
type CooldownData = {
  name: string;
  duration: number;
};

// Command interface
type CommandCallback = (origin: CustomCommandOrigin) => CustomCommandResult;
interface CommandData {
  config: CustomCommand;
  callback: CommandCallback;
}

// Effect interface
interface EffectCreate {
  name: string;
  duration: number;
  amplifier: number;
  showParticles: boolean;
}

// Entity interface
type EntityData = {
  id: string;
  status: StatusData[];
} & NpcModels;

// Item interface
type ItemSpecial = TempItemWithCallback<Function>;

// Leaderboard interface
interface LeaderboardData {
  chat: LbData[];
  deaths: LbData[];
  kills: LbData[];
}
type LeaderboardSystemType = "chat" | "deaths" | "kills";
type LeaderboardType = LeaderboardSystemType | "splvl" | "guildlvl" | "money" | "voxn" | "reputation";
interface LbData {
  id: string;
  name: string;
  value: number;
}

// Modifier interface
type ModifierData = TempNameWithCallback<Function> & {
  type: ModifierTypes;
  action: ModifierActiveActions;
};
type ModifierStats = { stat: string; value: number };
type Modifiers = { [key: string]: ModifierStats[][] };
type ModifierList = {
  name: string;
  level: number;
};

// Quest interface
interface QuestConst {
  player: Player;
  sp: Specialist;
}
type QuestData = {
  title: string;
  rep: number;
  task: QuestTask[];
  reward: QuestRewards[];
};
interface QuestRewards {
  type: string;
  amount: number;
}
type QuestPlayer = {
  id: number;
  progress: number[];
};
type QuestFind = Pick<QuestPlayer, "id"> & {
  quest: QuestData;
};
type QuestTask = {
  act: QuestType;
  target: string;
  amount: number;
};
type QuestController = Omit<QuestTask, "target"> & {
  target: Entity | Block;
};

const QuestTypes = {
  Destroy: "destroy",
  Kill: "kill",
  Get: "get",
  Place: "place",
} as const;
type QuestType = ObjectValues<typeof QuestTypes>;

// Particle interface
type Particle = {
  particle: string;
  location: Vector3 | undefined;
  molang: MolangVariableMap | undefined;
};

// Pasif interface
interface PasifData {
  hit: PasifHit[];
  hited: PasifHited[];
  kill: PasifKill[];
}
type PasifHit = TempNameWithCallback<Function>;
type PasifHited = PasifHit;
type PasifKill = PasifHit;

// Pity interface
type PityPlayer = {
  id: string;
  pity: {
    unique: number;
    featured: number;
    limited: number;
  };
};

// Player interface
interface PlayerFinder {
  name?: string;
  id?: string;
}

// Plugin
type PluginsData = {
  name: string;
  namespace: string;
  endpoint: {
    in: string;
    out: string;
  };
  version: string;
};

// Redeem interface
interface RedeemData {
  id: string;
  key: string;
  rewards: RedeemRewards[];
}
interface RedeemRewards {
  type: string;
  item?: string;
  amount: number;
}

// Rune Stats interface
type RuneStats = {
  components?: number[];

  atk?: number;
  atkFlat?: number;

  critChance?: number;
  critDamage?: number;

  healingEffectivity?: number;

  moneyDrop?: number;

  skill?: number;
  skillDamageReduction?: number;
  skillDamageReductionFlat?: number;
  skillDodge?: number;
  skillFlat?: number;

  staminaReduction?: number;

  // Fragility
  artFragile?: number;
  fireFragile?: number;
  fragile?: number;
} & RuneAction;
interface RuneAction {
  // Action Effect
  onAttacked?: Function;
  onCrit?: Function;
  onDodge?: Function;
  onHit?: Function;
  onHited?: Function;
  onKill?: Function;
}

// Script interface
interface Scripts {
  namespace: string;
  callback: Function;
}
type ScriptParams = {
  cmd: string;
  id: string;
  rawMsg: string[];
  msg: string[];
  message: string;
  sourceType: ScriptEventSource;
  initiator: Entity | undefined;
  sourceBlock: Block | undefined;
  sourceEntity: Entity | undefined;
};

// Setting interface
interface Setting {
  rules?: SettingRules;
  chainBreakFilter?: string[];
  customChat?: boolean;
  customChatPrefix?: string;
  damageIndicator?: boolean;
  deathLocation?: boolean;
  debug?: boolean;
  guildCreateCost?: number;
  saveInterval?: number;
  shopMultiplier?: number;
  staminaAction?: number;
  staminaCooldown?: boolean;
  staminaExhaust?: number;
  staminaHurt?: number;
  staminaRecovery?: number;
  staminaRun?: number;
  staterItem?: boolean;
  starterItemMessage?: string;
  starterItems?: SettingStarterItem[];
  thirstRun?: number;
  uiLevelRequirement?: boolean;
  useBzbRules?: boolean;
  uuidLength?: number;
  whatSeeDistance?: number;
  xpMultiplier?: number;
}
interface SettingRules {
  naturalregeneration: boolean;
  recipesunlock: boolean;
  showcoordinates: boolean;
  spawnradius: number;
}
interface SettingStarterItem {
  item: string;
  amount: number;
}

// Shop
type ShopItem = {
  item: string;
  name: string;
  amount: number;
  currency: Currency;
  price: number;
  textures: string;
};
type ShopCategory = {
  name: string;
  displayName: string;
  items: ShopItem[];
  textures: string;
};

// Skill interface
interface SkillLib {
  useDuration?: number;
  sp: Specialist;
  vel?: Vector3;
  velocity?: Vector3;
  multiplier?: number;
}

// Status interface
interface StatusData {
  name: string;
  duration: number;
  lvl: number;
  type: StatusTypes;
  stack: boolean;
  decay: string;
}
interface StatusFinder {
  name?: string;
  type?: StatusTypes;
  decay?: StatusDecay;
}

// Story interface
interface StoryData {
  storyId: number;
  progress: StoryProgress[];
}
interface StoryProgress {
  name: string;
  value: number | Vector3;
}

// Weapon Skill interface
interface WeaponComponent {
  id: string;
  components: WeaponComponentData[];
  attributes: WeaponAttribute[];
}
interface WeaponComponentData {
  name: string;
  value: WeaponComponentDataValue;
}
type WeaponComponentDataValue = any[] | Vector3 | number | string | boolean;
type WeaponSkill = TempNameWithCallback<Function>;
interface WeaponStat {
  name: string;
  value: number;
}
type WeaponAttribute = Pick<WeaponComponent, "id"> & {
  type: WeaponAttributetype;
};
type WeaponAttributetype = "handle";
type WeaponStatLore = {
  pasifs: ArrayFixedLength<number, 1, 2>;
  skills: ArrayFixedLength<number, 2, 4>;
};

// World interface
type WorldData = {
  redeem: RedeemData[];
  setting: Setting;
  leaderboards?: LeaderboardData;
  guilds?: GuildData[];
};

type FullWorldData = {
  world: WorldData;
  specialist: SpecialistData[];
  story: StoryData;
  pityPlayer: PityPlayer[];
  weaponComponent: WeaponComponent[];
  bossChallenge: BossChallengeData;
  waveChallenge: {};
};

export type {
  AntiHealData,
  BossChallengeData,
  BossChallangeParticipant,
  CooldownData,
  CommandCallback,
  CommandData,
  EffectCreate,
  EntityData,
  FullWorldData,
  ItemSpecial,
  LbData,
  LeaderboardData,
  LeaderboardSystemType,
  LeaderboardType,
  Modifiers,
  ModifierData,
  ModifierList,
  ModifierStats,
  QuestConst,
  QuestController,
  QuestData,
  QuestFind,
  QuestPlayer,
  QuestRewards,
  QuestTask,
  QuestType,
  Particle,
  PasifData,
  PasifHit,
  PasifHited,
  PasifKill,
  PityPlayer,
  PlayerFinder,
  PluginsData,
  RedeemData,
  RedeemRewards,
  RuneAction,
  RuneStats,
  Scripts,
  ScriptParams,
  Setting,
  SettingRules,
  SettingStarterItem,
  ShopItem,
  ShopCategory,
  SkillLib,
  StatusData,
  StatusFinder,
  StoryData,
  StoryProgress,
  WeaponAttribute,
  WeaponAttributetype,
  WeaponComponent,
  WeaponComponentData,
  WeaponComponentDataValue,
  WeaponStatLore,
  WeaponSkill,
  WeaponStat,
  WorldData,
};
