import { describe, expect, it } from "vitest";

import { ListPetsByCityUseCase } from "../../src/use-cases/list-pets-by-city.js";
import { InMemoryOrgsRepository } from "../repositories/in-memory-orgs-repository.js";
import { InMemoryPetsRepository } from "../repositories/in-memory-pets-repository.js";

describe("List Pets By City Use Case", () => {
  it("should list pets by city", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const petsRepository = new InMemoryPetsRepository(orgsRepository);
    const sut = new ListPetsByCityUseCase(petsRepository);

    const org = await orgsRepository.create({
      id: "org-01",
      name: "Find a Friend",
      email: "contact@faf.com",
      passwordHash: "hash",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    await petsRepository.create({
      id: "pet-01",
      orgId: org.id,
      name: "Rex",
      about: "Playful dog",
      age: "ADULT",
      size: "MEDIUM",
      energyLevel: "HIGH",
      independenceLevel: "MEDIUM",
      environment: "BOTH",
    });

    const { pets } = await sut.execute({
      city: "Curitiba",
      filters: {},
    });

    expect(pets).toHaveLength(1);
  });

  it("should apply optional filters", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const petsRepository = new InMemoryPetsRepository(orgsRepository);
    const sut = new ListPetsByCityUseCase(petsRepository);

    const org = await orgsRepository.create({
      id: "org-01",
      name: "Find a Friend",
      email: "contact@faf.com",
      passwordHash: "hash",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    await petsRepository.create({
      id: "pet-01",
      orgId: org.id,
      name: "Rex",
      about: "Playful dog",
      age: "ADULT",
      size: "MEDIUM",
      energyLevel: "HIGH",
      independenceLevel: "MEDIUM",
      environment: "BOTH",
    });

    await petsRepository.create({
      id: "pet-02",
      orgId: org.id,
      name: "Luna",
      about: "Calm female dog",
      age: "SENIOR",
      size: "SMALL",
      energyLevel: "LOW",
      independenceLevel: "HIGH",
      environment: "INDOOR",
    });

    const { pets } = await sut.execute({
      city: "Curitiba",
      filters: {
        energyLevel: "LOW",
      },
    });

    expect(pets).toHaveLength(1);
    expect(pets[0].id).toBe("pet-02");
  });
});
