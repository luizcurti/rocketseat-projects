import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeListPetsByCityUseCase } from "../../use-cases/factories/make-list-pets-by-city-use-case.js";

export async function listPetsByCityController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    city: z.string().min(2),
    age: z.enum(["PUPPY", "ADULT", "SENIOR"]).optional(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]).optional(),
    energyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    independenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    environment: z.enum(["INDOOR", "OUTDOOR", "BOTH"]).optional(),
  });

  const { city, age, size, energyLevel, independenceLevel, environment } = querySchema.parse(request.query);

  const listPetsByCityUseCase = makeListPetsByCityUseCase();

  const { pets } = await listPetsByCityUseCase.execute({
    city,
    filters: {
      age,
      size,
      energyLevel,
      independenceLevel,
      environment,
    },
  });

  return reply.status(200).send({ pets });
}
