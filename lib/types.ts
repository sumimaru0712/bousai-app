export type Role = "grandchild" | "grandparent";

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

export interface DangerMark {
  id: string;
  x: number;
  y: number;
  category: DangerCategory;
  title: string;
  description: string;
  advice: string;
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

export interface AppState {
  currentRole: Role;
  anpi: Record<Role, AnpiRecord>;
  checklist: ChecklistItem[];
  roomPhotos: RoomPhoto[];
}

export const ROLE_LABEL: Record<Role, string> = {
  grandchild: "孫",
  grandparent: "おじいちゃん・おばあちゃん",
};
