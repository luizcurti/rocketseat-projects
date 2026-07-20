import { describe, expect, it } from "vitest";

import { makeAuthenticateOrgUseCase } from "../../src/use-cases/factories/make-authenticate-org-use-case.js";
import { makeCreatePetUseCase } from "../../src/use-cases/factories/make-create-pet-use-case.js";
import { makeGetPetDetailsUseCase } from "../../src/use-cases/factories/make-get-pet-details-use-case.js";
import { makeListPetsByCityUseCase } from "../../src/use-cases/factories/make-list-pets-by-city-use-case.js";
import { makeRegisterOrgUseCase } from "../../src/use-cases/factories/make-register-org-use-case.js";

describe("Use Case Factories", () => {
  it("should build register org use case", () => {
    const useCase = makeRegisterOrgUseCase();
    expect(useCase).toBeDefined();
  });

  it("should build authenticate org use case", () => {
    const useCase = makeAuthenticateOrgUseCase();
    expect(useCase).toBeDefined();
  });

  it("should build create pet use case", () => {
    const useCase = makeCreatePetUseCase();
    expect(useCase).toBeDefined();
  });

  it("should build list pets by city use case", () => {
    const useCase = makeListPetsByCityUseCase();
    expect(useCase).toBeDefined();
  });

  it("should build get pet details use case", () => {
    const useCase = makeGetPetDetailsUseCase();
    expect(useCase).toBeDefined();
  });
});
