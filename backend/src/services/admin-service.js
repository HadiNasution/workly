import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  adminGetValidation,
  adminLoginValidation,
  adminRegistValidation,
  adminResetValidation,
} from "../validation/admin-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { generate } from "random-words";

// service untuk login admin
const login = async (request) => {
  // 1. Validasi format request
  const loginRequest = validate(adminLoginValidation, request);

  // 2. Get data admin dari database untuk validasi email dan Password
  const admin = await prismaClient.admin.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      password: true,
      token: true,
      token_expires_at: true,
    },
  });

  // jika email tidak ditemukan didatabase, maka berikan pesan error 401
  if (!admin) throw new ResponseError(401, "Email tidak ditemukan");

  // lalu validasi password dengan bcrypt.compare
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    admin.password
  );

  // jika validasi password gagal, maka berikan pesan error 401
  if (!isPasswordValid) throw new ResponseError(401, "Password tidak valid");

  // Cek apakah token masih valid, Jika tidak generate token baru. Jika masih valid kembalikan data admin
  const currentDate = new Date();
  if (!admin.token_expires_at || currentDate > admin.token_expires_at) {
    const expirationTime = addMinutes(currentDate, 120);
    // Menentukan zona waktu lokal (misalnya "Asia/Jakarta")
    const timeZone = "Asia/Jakarta";

    // Mengonversi waktu UTC menjadi waktu di zona waktu lokal
    const localizedExpirationTime = utcToZonedTime(expirationTime, timeZone);

    // Menampilkan waktu dalam format yang sesuai dengan zona waktu lokal
    const formattedExpirationTime = format(
      localizedExpirationTime,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      { timeZone }
    );

    // Generate token baru
    const newToken = uuid().toString();

    // update data admin dengan token baru yang valid
    return prismaClient.admin.update({
      data: {
        token: newToken,
        token_expires_at: formattedExpirationTime,
      },
      where: {
        email: admin.email,
      },
      select: {
        is_super_admin: true,
        token: true,
        token_expires_at: true,
      },
    });
  }

  return prismaClient.admin.findUnique({
    where: {
      email: admin.email,
    },
    select: {
      is_super_admin: true,
      token: true,
      token_expires_at: true,
    },
  });
};

// service untuk regist admin by superadmin
const regist = async (request) => {
  const registRequest = validate(adminRegistValidation, request);

  const isNipDuplicate = await prismaClient.admin.count({
    where: {
      nip: registRequest.nip,
    },
  });
  const isEmailDuplicate = await prismaClient.admin.count({
    where: {
      email: registRequest.email,
    },
  });

  if (isNipDuplicate === 1) throw new ResponseError(400, "NIP Sudah ada");
  if (isEmailDuplicate === 1) throw new ResponseError(400, "Email Sudah ada");

  registRequest.password = await bcrypt.hash(registRequest.password, 10);

  return prismaClient.admin.create({
    data: registRequest,
    select: {
      name: true,
      nip: true,
      email: true,
    },
  });
};

const logout = async (email) => {
  email = validate(adminGetValidation, email);

  const isEmailExist = await prismaClient.admin.findUnique({
    where: {
      email: email,
    },
  });

  if (!isEmailExist) throw new ResponseError(400, "Admin tidak ditemukan");

  return prismaClient.admin.update({
    data: {
      token: null,
      token_expires_at: null,
    },
    where: {
      email: email,
    },
  });
};

const reset = async (request) => {
  const resetRequest = validate(adminResetValidation, request);
  const isAccountExist = await prismaClient.admin.count({
    where: {
      name: resetRequest.name,
      nip: resetRequest.nip,
      email: resetRequest.email,
    },
  });

  if (!isAccountExist) throw new ResponseError(400, "Akun tidak terdaftar");

  // generate kata random untuk password sementara, dengan min 6 digit dan max 10 digit
  const dummyPass = generate({ minLength: 6, maxLength: 10 }) + "#";

  await prismaClient.admin.update({
    data: {
      password: await bcrypt.hash(dummyPass, 10),
      token: null,
      token_expires_at: null,
    },
    where: {
      email: resetRequest.email,
    },
  });

  return dummyPass;
};

export default { login, regist, logout, reset };
