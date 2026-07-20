import { describe, expect, it } from "vitest";

import { CreatePetUseCase } from "../../src/use-cases/create-pet.js";
import { ResourceNotFoundError } from "../../src/use-cases/errors/resource-not-found-error.js";
import { InMemoryOrgsRepository } from "../repositories/in-memory-orgs-repository.js";
import { InMemoryPetsRepository } from "../repositories/in-memory-pets-repository.js";

describe("Create Pet Use Case", () => {
  it("should be able to create a pet", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const petsRepository = new InMemoryPetsRepository(orgsRepository);
    const sut = new CreatePetUseCase(petsRepository, orgsRepository);

    const org = await orgsRepository.create({
      id: "org-1",
      name: "ORG",
      email: "org@faf.com",
      passwordHash: "hash",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const { pet } = await sut.execute({
      orgId: org.id,
      name: "Rex",
      about: "Friendly dog",
      age: "ADULT",
      size: "MEDIUM",
      energyLevel: "HIGH",
      independenceLevel: "MEDIUM",
      environment: "BOTH",
    });

    expect(pet.id).toEqual(expect.any(String));
  });

  it("should not create a pet for an invalid org", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const petsRepository = new InMemoryPetsRepository(orgsRepository);
    const sut = new CreatePetUseCase(petsRepository, orgsRepository);

    await expect(() =>
      sut.execute({
        orgId: "invalid-org-id",
        name: "Rex",
        about: "Friendly dog",
        age: "ADULT",
        size: "MEDIUM",
        energyLevel: "HIGH",
        independenceLevel: "MEDIUM",
        environment: "BOTH",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
