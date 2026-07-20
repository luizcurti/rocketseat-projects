import { PrismaOrgsRepository } from "../../repositories/prisma/prisma-orgs-repository.js";
import { RegisterOrgUseCase } from "../register-org.js";

export function makeRegisterOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  return new RegisterOrgUseCase(orgsRepository);
}
