import { PrismaPetsRepository } from "../../repositories/prisma/prisma-pets-repository.js";
import { ListPetsByCityUseCase } from "../list-pets-by-city.js";

export function makeListPetsByCityUseCase() {
  const petsRepository = new PrismaPetsRepository();

  return new ListPetsByCityUseCase(petsRepository);
}
