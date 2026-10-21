import { hash } from "bcryptjs";

import type { OrgEntity, OrgsRepository } from "../repositories/orgs-repository.js";
import { OrgAlreadyExistsError } from "./errors/org-already-exists-error.js";

interface RegisterOrgUseCaseRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  whatsapp: string;
}

interface RegisterOrgUseCaseResponse {
  org: OrgEntity;
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({ name, email, password, address, city, whatsapp }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const existingOrg = await this.orgsRepository.findByEmail(email);

    if (existingOrg) {
      throw new OrgAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    const org = await this.orgsRepository.create({
      name,
      email,
      passwordHash,
      address,
      city,
      whatsapp,
    });

    return { org };
  }
}
