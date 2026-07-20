import type { Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import type { OrgsRepository } from "../orgs-repository.js";

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgUncheckedCreateInput) {
    return prisma.org.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.org.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.org.findUnique({ where: { id } });
  }
}
