import type { Role, RoleText } from "./types";

export type { RoleText };

export function t(text: RoleText, role: Role): string {
  return text[role];
}
