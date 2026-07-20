import { describe, expect, it } from "vitest";

import { GetPetDetailsUseCase } from "../../src/use-cases/get-pet-details.js";
import { ResourceNotFoundError } from "../../src/use-cases/errors/resource-not-found-error.js";
import { InMemoryOrgsRepository } from "../repositories/in-memory-orgs-repository.js";
import { InMemoryPetsRepository } from "../repositories/in-memory-pets-repository.js";

describe("Get Pet Details Use Case", () => {
  it("should return pet details", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const petsRepository = new InMemoryPetsRepository(orgsRepository);
    const sut = new GetPetDetailsUseCase(petsRepository);

    const org = await orgsRepository.create({
      id: "org-1",
      name: "ORG",
      email: "org@faf.com",
      passwordHash: "hash",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    await petsRepository.create({
      id: "pet-1",
      orgId: org.id,
      name: "Rex",
      about: "Friendly dog",
      age: "ADULT",
      size: "MEDIUM",
      energyLevel: "HIGH",
      independenceLevel: "MEDIUM",
      environment: "BOTH",
    });

    const { pet } = await sut.execute({ petId: "pet-1" });

    expect(pet.id).toBe("pet-1");
    expect(pet.org.whatsapp).toBe("41999999999");
  });

  it("should throw when pet does not exist", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const petsRepository = new InMemoryPetsRepository(orgsRepository);
    const sut = new GetPetDetailsUseCase(petsRepository);

    await expect(() => sut.execute({ petId: "missing" })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
