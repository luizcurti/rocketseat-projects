import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { OrgAlreadyExistsError } from "../../src/use-cases/errors/org-already-exists-error.js";
import { RegisterOrgUseCase } from "../../src/use-cases/register-org.js";
import { InMemoryOrgsRepository } from "../repositories/in-memory-orgs-repository.js";

describe("Register Org Use Case", () => {
  it("should be able to register an org", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const sut = new RegisterOrgUseCase(orgsRepository);

    const { org } = await sut.execute({
      name: "Find a Friend",
      email: "contact@faf.com",
      password: "123456",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    expect(org.id).toEqual(expect.any(String));
  });

  it("should hash org password", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const sut = new RegisterOrgUseCase(orgsRepository);

    const { org } = await sut.execute({
      name: "Find a Friend",
      email: "contact2@faf.com",
      password: "123456",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const isPasswordCorrectlyHashed = await compare("123456", org.passwordHash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const sut = new RegisterOrgUseCase(orgsRepository);

    await sut.execute({
      name: "Find a Friend",
      email: "same@faf.com",
      password: "123456",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    await expect(() =>
      sut.execute({
        name: "Find a Friend 2",
        email: "same@faf.com",
        password: "123456",
        address: "Street B, 20",
        city: "Curitiba",
        whatsapp: "41999999998",
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError);
  });
});
