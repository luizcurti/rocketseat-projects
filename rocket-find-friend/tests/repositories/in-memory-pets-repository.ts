import type { Prisma } from "@prisma/client";

import type { PetEntity, PetsFilters, PetsRepository } from "../../src/repositories/pets-repository.js";
import type { InMemoryOrgsRepository } from "./in-memory-orgs-repository.js";

export class InMemoryPetsRepository implements PetsRepository {
  public items: PetEntity[] = [];

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: PetEntity = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energyLevel: data.energyLevel,
      independenceLevel: data.independenceLevel,
      environment: data.environment,
      orgId: data.orgId,
      createdAt: new Date(),
    };

    this.items.push(pet);
    return pet;
  }

  async findManyByCity(city: string, filters: PetsFilters) {
    return this.items.filter((pet) => {
      const org = this.orgsRepository.items.find((item) => item.id === pet.orgId);

      if (!org || org.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }

      if (filters.age && pet.age !== filters.age) return false;
      if (filters.size && pet.size !== filters.size) return false;
      if (filters.energyLevel && pet.energyLevel !== filters.energyLevel) return false;
      if (filters.independenceLevel && pet.independenceLevel !== filters.independenceLevel) return false;
      if (filters.environment && pet.environment !== filters.environment) return false;

      return true;
    });
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id);

    if (!pet) {
      return null;
    }

    const org = this.orgsRepository.items.find((item) => item.id === pet.orgId);

    if (!org) {
      return null;
    }

    return {
      ...pet,
      org,
    };
  }
}
