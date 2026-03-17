import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import app from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean DB before every test
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const testUser = {
  name: "Test User",
  email: "test@test.com",
  password: "123456",
};

describe("Auth System", () => {

  it("should register a user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.password).toBeUndefined();
  });

  it("should not allow duplicate registration", async () => {
    await request(app).post("/auth/register").send(testUser);

    const res = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(res.status).toBe(400);
  });

  it("should login and set cookie", async () => {
    await request(app).post("/auth/register").send(testUser);

    const res = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "wrong@test.com",
        password: "wrong",
      });

    expect(res.status).toBe(401);
  });

  it("should access /me when authenticated", async () => {
    const agent = request.agent(app);

    await agent.post("/auth/register").send(testUser);

    await agent.post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const res = await agent.get("/me");

    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.name).toBe(testUser.name);
  });

  it("should block /me without login", async () => {
    const res = await request(app).get("/me");

    expect(res.status).toBe(401);
  });

  it("should logout user", async () => {
    const agent = request.agent(app);

    await agent.post("/auth/register").send(testUser);

    await agent.post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    await agent.post("/auth/logout");

    const res = await agent.get("/me");

    expect(res.status).toBe(401);
  });

});