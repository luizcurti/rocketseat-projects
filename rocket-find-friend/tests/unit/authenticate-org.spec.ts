import { describe, expect, it } from "vitest";

import { AuthenticateOrgUseCase } from "../../src/use-cases/authenticate-org.js";
import { InvalidCredentialsError } from "../../src/use-cases/errors/invalid-credentials-error.js";
import { RegisterOrgUseCase } from "../../src/use-cases/register-org.js";
import { InMemoryOrgsRepository } from "../repositories/in-memory-orgs-repository.js";

describe("Authenticate Org Use Case", () => {
  it("should be able to authenticate", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const registerUseCase = new RegisterOrgUseCase(orgsRepository);
    const sut = new AuthenticateOrgUseCase(orgsRepository);

    await registerUseCase.execute({
      name: "Find a Friend",
      email: "contact@faf.com",
      password: "123456",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const { org } = await sut.execute({
      email: "contact@faf.com",
      password: "123456",
    });

    expect(org.id).toEqual(expect.any(String));
  });

  it("should not authenticate with wrong password", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const registerUseCase = new RegisterOrgUseCase(orgsRepository);
    const sut = new AuthenticateOrgUseCase(orgsRepository);

    await registerUseCase.execute({
      name: "Find a Friend",
      email: "contact@faf.com",
      password: "123456",
      address: "Street A, 10",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    await expect(() =>
      sut.execute({
        email: "contact@faf.com",
        password: "654321",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not authenticate with wrong email", async () => {
    const orgsRepository = new InMemoryOrgsRepository();
    const sut = new AuthenticateOrgUseCase(orgsRepository);

    await expect(() =>
      sut.execute({
        email: "missing@faf.com",
        password: "654321",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
