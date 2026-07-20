import type { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";

import type { OrgsRepository } from "../repositories/orgs-repository.js";
import type { PetEntity, PetsRepository } from "../repositories/pets-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface CreatePetUseCaseRequest {
  orgId: string;
  name: string;
  about: string;
  age: PetAge;
  size: PetSize;
  energyLevel: PetEnergyLevel;
  independenceLevel: PetIndependence;
  environment: PetEnvironment;
}

interface CreatePetUseCaseResponse {
  pet: PetEntity;
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute(data: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(data.orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    const pet = await this.petsRepository.create(data);

    return { pet };
  }
}
