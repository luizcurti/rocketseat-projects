import type { Prisma } from "@prisma/client";

import type { OrgEntity, OrgsRepository } from "../../src/repositories/orgs-repository.js";

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: OrgEntity[] = [];

  async create(data: Prisma.OrgUncheckedCreateInput) {
    const org: OrgEntity = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      address: data.address,
      city: data.city,
      whatsapp: data.whatsapp,
      createdAt: new Date(),
    };

    this.items.push(org);
    return org;
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }
}
