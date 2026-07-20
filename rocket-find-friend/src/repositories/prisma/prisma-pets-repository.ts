import type { Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import type { PetsFilters, PetsRepository } from "../pets-repository.js";

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    return prisma.pet.create({ data });
  }

  async findManyByCity(city: string, filters: PetsFilters) {
    return prisma.pet.findMany({
      where: {
        org: {
          city: {
            equals: city,
            mode: "insensitive",
          },
        },
        age: filters.age,
        size: filters.size,
        energyLevel: filters.energyLevel,
        independenceLevel: filters.independenceLevel,
        environment: filters.environment,
      },
    });
  }

  async findById(id: string) {
    return prisma.pet.findUnique({
      where: { id },
      include: {
        org: true,
      },
    });
  }
}
