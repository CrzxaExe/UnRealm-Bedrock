const GuildRoles = {
  SUPERADMIN: "super_admin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

type GuildRole = ObjectValues<typeof GuildRoles>;

type GuildData = {
  id: string;
  name: string;
  level: GuildLevel;
  des: string;
  maxMember: number;
  approval: boolean;
  members: GuildMember[];
  applier: GuildMember[];
  token: number;
};
type GuildLevel = {
  lvl: number;
  xp: number;
};
type GuildMember = {
  id: string;
  name: string;
  role?: GuildRole;
};

type GuildShopItem = {
  item: string;
  texture: string;
  lvl: number;
  amount: number;
  token: number;
  enchant?: string;
};
