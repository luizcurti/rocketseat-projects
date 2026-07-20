import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreatePetUseCase } from "../../use-cases/factories/make-create-pet-use-case.js";

export async function createPetController(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string().min(2),
    about: z.string().min(5),
    age: z.enum(["PUPPY", "ADULT", "SENIOR"]),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    energyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    independenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    environment: z.enum(["INDOOR", "OUTDOOR", "BOTH"]),
  });

  const { name, about, age, size, energyLevel, independenceLevel, environment } = createPetBodySchema.parse(request.body);

  const createPetUseCase = makeCreatePetUseCase();

  await createPetUseCase.execute({
    orgId: request.user.sub,
    name,
    about,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
  });

  return reply.status(201).send();
}
