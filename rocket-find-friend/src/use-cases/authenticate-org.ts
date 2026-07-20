import { compare } from "bcryptjs";

import type { OrgEntity, OrgsRepository } from "../repositories/orgs-repository.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

interface AuthenticateOrgUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateOrgUseCaseResponse {
  org: OrgEntity;
}

export class AuthenticateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({ email, password }: AuthenticateOrgUseCaseRequest): Promise<AuthenticateOrgUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    const shouldPasswordMatch = await compare(password, org.passwordHash);

    if (!shouldPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return { org };
  }
}
