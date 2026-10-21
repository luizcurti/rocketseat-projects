import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { OrgAlreadyExistsError } from "../../use-cases/errors/org-already-exists-error.js";
import { makeRegisterOrgUseCase } from "../../use-cases/factories/make-register-org-use-case.js";

export async function registerOrgController(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    address: z.string().min(5),
    city: z.string().min(2),
    whatsapp: z.string().min(8),
  });

  const { name, email, password, address, city, whatsapp } = registerBodySchema.parse(request.body);

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase();

    await registerOrgUseCase.execute({
      name,
      email,
      password,
      address,
      city,
      whatsapp,
    });
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
