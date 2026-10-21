import { afterAll, beforeEach } from "vitest";

import { app } from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";

beforeEach(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "pets", "orgs" RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});
