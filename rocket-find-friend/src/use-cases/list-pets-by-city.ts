import type { PetsFilters, PetsRepository } from "../repositories/pets-repository.js";

type PetListItem = Awaited<ReturnType<PetsRepository["findManyByCity"]>>[number];

interface ListPetsByCityUseCaseRequest {
  city: string;
  filters: PetsFilters;
}

interface ListPetsByCityUseCaseResponse {
  pets: PetListItem[];
}

export class ListPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ city, filters }: ListPetsByCityUseCaseRequest): Promise<ListPetsByCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity(city, filters);

    return { pets };
  }
}
