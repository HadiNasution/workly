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

  // TEST LOGIN PASSWORD SALAH
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
