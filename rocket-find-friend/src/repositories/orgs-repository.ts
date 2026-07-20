import type { Prisma } from "@prisma/client";

export type OrgEntity = Prisma.OrgGetPayload<Record<string, never>>;

export interface OrgsRepository {
  create(data: Prisma.OrgUncheckedCreateInput): Promise<OrgEntity>;
  findByEmail(email: string): Promise<OrgEntity | null>;
  findById(id: string): Promise<OrgEntity | null>;
}
