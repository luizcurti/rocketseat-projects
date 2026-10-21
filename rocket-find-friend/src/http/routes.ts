import type { FastifyInstance } from "fastify";

import { authenticateOrgController } from "./controllers/authenticate-org-controller.js";
import { createPetController } from "./controllers/create-pet-controller.js";
import { getPetDetailsController } from "./controllers/get-pet-details-controller.js";
import { listPetsByCityController } from "./controllers/list-pets-by-city-controller.js";
import { registerOrgController } from "./controllers/register-org-controller.js";
import { verifyJWT } from "./middlewares/verify-jwt.js";

export async function appRoutes(app: FastifyInstance) {
  app.post("/orgs", registerOrgController);
  app.post("/sessions", authenticateOrgController);
  app.get("/pets", listPetsByCityController);
  app.get("/pets/:id", getPetDetailsController);

  app.post("/pets", { onRequest: [verifyJWT] }, createPetController);
}
