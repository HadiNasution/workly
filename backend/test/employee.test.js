import supertest from "supertest";
import {
  removeTestEmployee,
  createTestEmployee,
  getTestEmployee,
} from "./employee-test-utils.js";
import { createTestAdmin, removeTestAdmin } from "./admin-test-utils.js";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";

describe("POST /api/employee/login", function () {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestEmployee();
  });
  afterEach(async () => {
    await removeTestAdmin();
    await removeTestEmployee();
  });

  // TEST LOGIN SUKSES
  it("should can login (employee)", async () => {
    const result = await supertest(web).post("/api/employee/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });

    // logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token_expires_at).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  // TEST LOGIN GAGAL
  it("should reject login if request is invalid (employee)", async () => {
    const result = await supertest(web).post("/api/employee/login").send({
      email: "",
      password: "",
    });

    // logger.info(result.body);
    // console.log(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // TEST LOGIN PASSWORD SALAH
  it("should reject login if password is wrong (employee)", async () => {
    const result = await supertest(web).post("/api/employee/login").send({
      email: "test@gmail.com",
      password: "salah",
    });

    // logger.info(result.body);
    // console.log(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  // TEST LOGIN EMAIL SALAH
  it("should reject login if email is wrong (employee)", async () => {
    const result = await supertest(web).post("/api/employee/login").send({
      email: "salah@gmail.com",
      password: "rahasia",
    });

    // logger.info(result.body);
    // console.log(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/employee/logout", function () {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestEmployee();
  });
  afterEach(async () => {
    await removeTestAdmin();
    await removeTestEmployee();
  });

  it("should can be logout (employee)", async () => {
    const result = await supertest(web)
      .delete("/api/employee/logout")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Logout Success");

    const employee = await getTestEmployee();
    expect(employee.token).toBeNull();
  });

  it("should reject logout if token is invalid (employee)", async () => {
    const result = await supertest(web)
      .delete("/api/employee/logout")
      .set("Authorization", "salah");

    // logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
