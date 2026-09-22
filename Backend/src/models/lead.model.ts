import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export function findAllLeads() {
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
}

export function findLeadById(id: number) {
  return prisma.lead.findUnique({ where: { id } });
}

export function createLead(data: Prisma.LeadCreateInput) {
  return prisma.lead.create({ data });
}

export function updateLead(id: number, data: Prisma.LeadUpdateInput) {
  return prisma.lead.update({ where: { id }, data });
}

export function deleteLead(id: number) {
  return prisma.lead.delete({ where: { id } });
}
