import { PrismaOrgsRepository } from "../../repositories/prisma/prisma-orgs-repository.js";
import { AuthenticateOrgUseCase } from "../authenticate-org.js";

export function makeAuthenticateOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  return new AuthenticateOrgUseCase(orgsRepository);
}
