import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { InvalidCredentialsError } from "../../use-cases/errors/invalid-credentials-error.js";
import { makeAuthenticateOrgUseCase } from "../../use-cases/factories/make-authenticate-org-use-case.js";

export async function authenticateOrgController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateOrgUseCase = makeAuthenticateOrgUseCase();

    const { org } = await authenticateOrgUseCase.execute({ email, password });

    const token = await reply.jwtSign({}, {
      sign: {
        sub: org.id,
      },
    });

    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}
