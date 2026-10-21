import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { ResourceNotFoundError } from "../../use-cases/errors/resource-not-found-error.js";
import { makeGetPetDetailsUseCase } from "../../use-cases/factories/make-get-pet-details-use-case.js";

export async function getPetDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  try {
    const getPetDetailsUseCase = makeGetPetDetailsUseCase();
    const { pet } = await getPetDetailsUseCase.execute({ petId: id });

    return reply.status(200).send({
      pet: {
        id: pet.id,
        name: pet.name,
        about: pet.about,
        age: pet.age,
        size: pet.size,
        energyLevel: pet.energyLevel,
        independenceLevel: pet.independenceLevel,
        environment: pet.environment,
        org: {
          id: pet.org.id,
          name: pet.org.name,
          city: pet.org.city,
          whatsapp: pet.org.whatsapp,
        },
      },
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
