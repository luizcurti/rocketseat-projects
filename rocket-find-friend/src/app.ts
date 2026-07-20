import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { ZodError } from "zod";

import { env } from "./env.js";
import { appRoutes } from "./http/routes.js";

export const app = fastify();

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: env.JWT_SECRET,
});

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.flatten(),
    });
  }

  return reply.status(500).send({
    message: "Internal server error.",
  });
});
