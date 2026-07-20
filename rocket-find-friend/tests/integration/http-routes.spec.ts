import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { app } from "../../src/app.js";
import * as authenticateFactory from "../../src/use-cases/factories/make-authenticate-org-use-case.js";
import * as detailsFactory from "../../src/use-cases/factories/make-get-pet-details-use-case.js";
import * as listPetsFactory from "../../src/use-cases/factories/make-list-pets-by-city-use-case.js";
import * as registerFactory from "../../src/use-cases/factories/make-register-org-use-case.js";

describe("HTTP routes integration", () => {
  beforeAll(async () => {
    await app.ready();
  });

  it("should register an org", async () => {
    const response = await request(app.server).post("/orgs").send({
      name: "ORG Friends",
      email: "org1@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    expect(response.statusCode).toBe(201);
  });

  it("should not register duplicated org email", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Friends",
      email: "org2@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const response = await request(app.server).post("/orgs").send({
      name: "ORG Friends 2",
      email: "org2@faf.com",
      password: "123456",
      address: "Street 2, 200",
      city: "Curitiba",
      whatsapp: "41988888888",
    });

    expect(response.statusCode).toBe(409);
  });

  it("should validate org payload", async () => {
    const response = await request(app.server).post("/orgs").send({
      name: "O",
      email: "invalid-email",
      password: "123",
      address: "x",
      city: "C",
      whatsapp: "1",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should authenticate org", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Auth",
      email: "auth@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "auth@faf.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("should return 401 for wrong credentials", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Auth",
      email: "auth2@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "auth2@faf.com",
      password: "654321",
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 400 for invalid login payload", async () => {
    const response = await request(app.server).post("/sessions").send({
      email: "wrong",
      password: "123",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create pet without token", async () => {
    const response = await request(app.server).post("/pets").send({
      name: "Rex",
      about: "Friendly dog",
      age: "ADULT",
      size: "MEDIUM",
      energyLevel: "HIGH",
      independenceLevel: "MEDIUM",
      environment: "BOTH",
    });

    expect(response.statusCode).toBe(401);
  });

  it("should create pet with token", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Pets",
      email: "pets@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "pets@faf.com",
      password: "123456",
    });

    const response = await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Rex",
        about: "Friendly dog",
        age: "ADULT",
        size: "MEDIUM",
        energyLevel: "HIGH",
        independenceLevel: "MEDIUM",
        environment: "BOTH",
      });

    expect(response.statusCode).toBe(201);
  });

  it("should validate pet payload", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Pets",
      email: "pets2@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "pets2@faf.com",
      password: "123456",
    });

    const response = await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "R",
        about: "abc",
        age: "INVALID",
      });

    expect(response.statusCode).toBe(400);
  });

  it("should list pets by city", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG List",
      email: "list@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "list@faf.com",
      password: "123456",
    });

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Rex",
        about: "Friendly dog",
        age: "ADULT",
        size: "MEDIUM",
        energyLevel: "HIGH",
        independenceLevel: "MEDIUM",
        environment: "BOTH",
      });

    const response = await request(app.server).get("/pets").query({ city: "Curitiba" });

    expect(response.statusCode).toBe(200);
    expect(response.body.pets.length).toBe(1);
  });

  it("should filter pets", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Filter",
      email: "filter@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "filter@faf.com",
      password: "123456",
    });

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Rex",
        about: "Friendly dog",
        age: "ADULT",
        size: "MEDIUM",
        energyLevel: "HIGH",
        independenceLevel: "MEDIUM",
        environment: "BOTH",
      });

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Luna",
        about: "Calm female dog",
        age: "SENIOR",
        size: "SMALL",
        energyLevel: "LOW",
        independenceLevel: "HIGH",
        environment: "INDOOR",
      });

    const response = await request(app.server).get("/pets").query({
      city: "Curitiba",
      energyLevel: "LOW",
      environment: "INDOOR",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets[0].name).toBe("Luna");
  });

  it("should validate city as required query", async () => {
    const response = await request(app.server).get("/pets");

    expect(response.statusCode).toBe(400);
  });

  it("should return pet details", async () => {
    await request(app.server).post("/orgs").send({
      name: "ORG Details",
      email: "details@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "details@faf.com",
      password: "123456",
    });

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Rex",
        about: "Friendly dog",
        age: "ADULT",
        size: "MEDIUM",
        energyLevel: "HIGH",
        independenceLevel: "MEDIUM",
        environment: "BOTH",
      });

    const listResponse = await request(app.server).get("/pets").query({ city: "Curitiba" });

    const response = await request(app.server).get(`/pets/${listResponse.body.pets[0].id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.pet.org.whatsapp).toBe("41999999999");
  });

  it("should return 404 for missing pet details", async () => {
    const response = await request(app.server).get("/pets/2a3dcf0d-f7a2-4f79-bf08-06ab1eaf54d5");

    expect(response.statusCode).toBe(404);
  });

  it("should return 400 for invalid pet id format", async () => {
    const response = await request(app.server).get("/pets/invalid-id");

    expect(response.statusCode).toBe(400);
  });

  it("should return 500 for unexpected internal error", async () => {
    const spy = vi.spyOn(listPetsFactory, "makeListPetsByCityUseCase").mockReturnValue({
      execute: async () => {
        throw new Error("boom");
      },
    } as never);

    const response = await request(app.server).get("/pets").query({ city: "Curitiba" });

    expect(response.statusCode).toBe(500);

    spy.mockRestore();
  });

  it("should return 500 for unexpected register error", async () => {
    const spy = vi.spyOn(registerFactory, "makeRegisterOrgUseCase").mockReturnValue({
      execute: async () => {
        throw new Error("boom");
      },
    } as never);

    const response = await request(app.server).post("/orgs").send({
      name: "ORG Error",
      email: "error-register@faf.com",
      password: "123456",
      address: "Street 1, 100",
      city: "Curitiba",
      whatsapp: "41999999999",
    });

    expect(response.statusCode).toBe(500);

    spy.mockRestore();
  });

  it("should return 500 for unexpected authenticate error", async () => {
    const spy = vi.spyOn(authenticateFactory, "makeAuthenticateOrgUseCase").mockReturnValue({
      execute: async () => {
        throw new Error("boom");
      },
    } as never);

    const response = await request(app.server).post("/sessions").send({
      email: "error-auth@faf.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(500);

    spy.mockRestore();
  });

  it("should return 500 for unexpected pet details error", async () => {
    const spy = vi.spyOn(detailsFactory, "makeGetPetDetailsUseCase").mockReturnValue({
      execute: async () => {
        throw new Error("boom");
      },
    } as never);

    const response = await request(app.server).get("/pets/2a3dcf0d-f7a2-4f79-bf08-06ab1eaf54d5");

    expect(response.statusCode).toBe(500);

    spy.mockRestore();
  });
});
