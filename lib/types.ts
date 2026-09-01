import type { GrowthSpecies } from "./growth";

export type Role = "grandchild" | "grandparent";

export type RoleText = Record<Role, string>;

export interface AnpiRecord {
  status: "safe" | "unknown";
  updatedAt: string | null;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  addedBy: Role;
}

export interface RoomComment {
  id: string;
  author: Role;
  text: string;
  createdAt: string;
}

export type DangerCategory =
  | "furniture"
  | "glass"
  | "escape-route"
  | "fall-object";

export interface DangerFix {
  name: RoleText;
  note: RoleText;
}

export interface DangerMark {
  id: string;
  x: number;
  y: number;
  category: DangerCategory;
  title: RoleText;
  description: RoleText;
  advice: RoleText;
  detail: RoleText;
  points: RoleText[];
  fixes: DangerFix[];
  observation?: RoleText;
  confidence?: "high" | "low";
  checkedBy: Record<Role, boolean>;
  resolvedAt: string | null;
}

export interface RoomPhoto {
  id: string;
  dataUrl: string;
  uploadedAt: string;
  uploadedBy: Role;
  comments: RoomComment[];
  diagnosisStatus: "analyzing" | "done";
  marks: DangerMark[];
}

export type HealthStatus = "genki" | "futsuu" | "genki-nai";

export interface HealthLog {
  id: string;
  status: HealthStatus;
  createdAt: string;
}

export interface HealthState {
  latest: HealthLog | null;
  history: HealthLog[];
}

export interface GrowthState {
  enabled: boolean;
  species: GrowthSpecies | null;
  points: number;
}

export interface MinigamesState {
  enabled: boolean;
}

export type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface VoiceMessage {
  dataUrl: string;
  recordedAt: string;
}

export interface VoiceState {
  messages: Partial<Record<Weekday, VoiceMessage>>;
}

export interface ActivityEntry {
  id: string;
  actor: Role;
  message: string;
  createdAt: string;
}

export interface ActivityState {
  entries: ActivityEntry[];
}

export interface AppState {
  currentRole: Role;
  anpi: Record<Role, AnpiRecord>;
  checklist: ChecklistItem[];
  roomPhotos: RoomPhoto[];
  health: HealthState;
  growth: GrowthState;
  minigames: MinigamesState;
  voice: VoiceState;
  activity: ActivityState;
}

export const ROLE_LABEL: Record<Role, string> = {
  grandchild: "孫",
  grandparent: "おじいちゃん・おばあちゃん",
};

export const HEALTH_STATUS_LABEL: Record<HealthStatus, string> = {
  genki: "元気",
  futsuu: "普通",
  "genki-nai": "元気がない",
};

export const HEALTH_STATUS_EMOJI: Record<HealthStatus, string> = {
  genki: "😊",
  futsuu: "😐",
  "genki-nai": "😟",
};

// Index matches Date.getDay() (0 = Sunday). Used internally for lookups only.
const WEEKDAY_BY_DATE_INDEX: Weekday[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

// Monday-first order, for displaying the week.
export const WEEKDAY_ORDER: Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  sun: "日曜日",
  mon: "月曜日",
  tue: "火曜日",
  wed: "水曜日",
  thu: "木曜日",
  fri: "金曜日",
  sat: "土曜日",
};

export const WEEKDAY_TOPIC: Record<Weekday, string> = {
  mon: "水の備蓄は大丈夫？",
  tue: "非常食のきげんは大丈夫？",
  wed: "懐中電灯の電池は大丈夫？",
  thu: "避難場所を確認した？",
  fri: "家具は固定できた？",
  sat: "今週も元気だった？",
  sun: "来週もいっしょにがんばろうね",
};

export function getTodayWeekday(): Weekday {
  return WEEKDAY_BY_DATE_INDEX[new Date().getDay()];
}
