const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app } = require("../src/app");

test("GET /health returns 200", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.healthy, true);
});
