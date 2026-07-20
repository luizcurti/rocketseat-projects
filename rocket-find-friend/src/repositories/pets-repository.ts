import type { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize, Prisma } from "@prisma/client";

export type PetEntity = Prisma.PetGetPayload<Record<string, never>>;
export type PetWithOrgEntity = Prisma.PetGetPayload<{ include: { org: true } }>;

export interface PetsFilters {
  age?: PetAge;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  independenceLevel?: PetIndependence;
  environment?: PetEnvironment;
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<PetEntity>;
  findManyByCity(city: string, filters: PetsFilters): Promise<PetEntity[]>;
  findById(id: string): Promise<PetWithOrgEntity | null>;
}
