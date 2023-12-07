import supertest from "supertest";
import { removeTestAdmin, createTestAdmin } from "./admin-test-utils.js";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";

// UNIT TEST API LOGIN ADMIN
describe("POST /api/admin/login", function () {
  // buat data di db untuk keperluan test login
  beforeEach(async () => {
    await createTestAdmin();
  });
  // lalu hapus datanya setelah test selesai
  afterEach(async () => {
    await removeTestAdmin();
  });

  // TEST LOGIN SUKSES
  it("should can login", async () => {
    const result = await supertest(web).post("/api/admin/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });

    logger.info(result.body);

    expect(result.status).toBe(200); //status harus 200 karena login harusnya sukses
    expect(result.body.data.token).toBeDefined(); // jika login sukses, token harusnya ada
    expect(result.body.data.token_expires_at).toBeDefined();
    expect(result.body.data.token).not.toBe("test"); // dan token bukan token lama/default
    expect(result.body.data.is_super_admin).toBe(false);
  });

  // TEST LOGIN GAGAL
  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/admin/login").send({
      email: "",
      password: "",
    });

    logger.info(result.body);
    // console.log(result.body);
    expect(result.status).toBe(400); //status harus 400 karena login harusnya gagal
    expect(result.body.errors).toBeDefined(); // jika login gagal, error harus ada
  });

  // TEST LOGIN PASSWORD SALAH
  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/admin/login").send({
      email: "test@gmail.com",
      password: "salah",
    });

    logger.info(result.body);
    // console.log(result.body);

    expect(result.status).toBe(401); //status harus 401 karena password salah
    expect(result.body.errors).toBeDefined(); // jika login gagal, error harus ada
  });

  // TEST LOGIN EMAIL SALAH
  it("should reject login if email is wrong", async () => {
    const result = await supertest(web).post("/api/admin/login").send({
      email: "salah@gmail.com",
      password: "rahasia",
    });

    logger.info(result.body);
    // console.log(result.body);

    expect(result.status).toBe(401); //status harus 401 karena password salah
    expect(result.body.errors).toBeDefined(); // jika login gagal, error harus ada
  });
});

// UNIT TEST API REGIST ADMIN
describe("POST /api/admin/regist", function () {
  // lalu hapus datanya setelah test selesai
  afterEach(async () => {
    await removeTestAdmin();
  });

  // TEST REGIST SUKSES
  it("should can regist", async () => {
    const result = await supertest(web).post("/api/admin/regist").send({
      name: "test",
      nip: "11111111",
      email: "test@gmail.com",
      password: "rahasia",
    });

    logger.info(result.body);

    expect(result.status).toBe(201);
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.nip).toBe("11111111");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.password).toBeDefined();
  });
  // TEST REGIST INVALID REQUEST
  it("should reject regist if request is invalid", async () => {
    const result = await supertest(web).post("/api/admin/regist").send({
      name: "test",
      nip: "",
      email: "test@gmail.com",
      password: "rahasia",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  // TEST REGIST DATA DUPLIKAT
  it("should reject regist if nip/email is already registered", async () => {
    let result = await supertest(web).post("/api/admin/regist").send({
      name: "test",
      nip: "11111111",
      email: "test@gmail.com",
      password: "rahasia",
    });

    result = await supertest(web).post("/api/admin/regist").send({
      name: "test",
      nip: "11111111",
      email: "gegee@gmail.com",
      password: "rahasia",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
