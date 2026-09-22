import type { Admin } from "@prisma/client";
import { toMediaUrl } from "../lib/media";

export function serializeAdmin(admin: Admin) {
  const { password: _password, ...rest } = admin;
  return { ...rest, avatarUrl: toMediaUrl(admin.avatarUrl) };
}
