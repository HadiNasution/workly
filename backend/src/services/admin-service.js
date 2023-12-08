import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  adminGetValidation,
  adminLoginValidation,
  adminRegistValidation,
} from "../validation/admin-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";

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
  if (!admin) throw new ResponseError(401, "Wrong Email");

  // lalu validasi password dengan bcrypt.compare
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    admin.password
  );

  // jika validasi password gagal, maka berikan pesan error 401
  if (!isPasswordValid) throw new ResponseError(401, "Wrong Password");

  // Cek apakah token masih valid, Jika tidak generate token baru. Jika masih valid kembalikan data admin
  const currentDate = new Date();
  if (!admin.token_expires_at || currentDate > admin.token_expires_at) {
    // set waktu aktif token di 30 menit
    const expirationTime = addMinutes(currentDate, 120);
    // console.log("Waktu sekarang" + currentDate);
    // console.log("Waktu expired" + expirationTime);

    // Generate token baru
    const newToken = uuid().toString();

    // update data admin dengan token baru yang valid
    return prismaClient.admin.update({
      data: {
        token: newToken,
        token_expires_at: expirationTime,
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
    where: {
      email: email,
    },
    data: {
      token: null,
    },
  });
};

export default { login, regist, logout };
