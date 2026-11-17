import { Prisma } from "@prisma/client";

export function parseSlotBoatIds(value: Prisma.JsonValue | null | undefined): number[] {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some((id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0)) {
    return [];
  }
  return value as number[];
}

export function toBoatIdsColumn(boatIds: number[]): number[] | typeof Prisma.JsonNull {
  return boatIds.length ? boatIds : Prisma.JsonNull;
}
