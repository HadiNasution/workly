import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  adminGetValidation,
  adminLoginValidation,
  adminRegistValidation,
  adminResetValidation,
  createAdminValidation,
  adminUpdateValidation,
} from "../validation/admin-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { generate } from "random-words";

// service untuk login admin dan superadmin
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
  console.log("req body" + loginRequest.password);
  console.log("db" + admin.password);
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

// service untuk admin dan superadmin logout
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

// service untuk admin dan superadmin reset password
const reset = async (request) => {
  const resetRequest = validate(adminResetValidation, request);

  const admin = await prismaClient.admin.findUnique({
    where: {
      email: resetRequest.email,
    },
  });

  if (!admin) {
    throw new ResponseError(400, "Akun tidak terdaftar");
  }

  const dummyPass = generate({ minLength: 6, maxLength: 10 });

  const updateAdminPass = await prismaClient.admin.update({
    data: {
      password: await bcrypt.hash(dummyPass.toString(), 10),
    },
    where: {
      email: resetRequest.email,
    },
  });

  if (updateAdminPass) return dummyPass;
};

// service untuk admin dan superadmin melihat daftar semua admin dan superadmin
const get = async () => {
  const admins = await prismaClient.admin.findMany({
    select: {
      name: true,
      nip: true,
      email: true,
      is_super_admin: true,
    },
    orderBy: {
      is_super_admin: "asc", // 'desc' untuk descending, 'asc' untuk ascending
    },
  });

  if (!admins) throw new ResponseError(404, "Data Admin kosong");
  return admins;
};

// service untuk admin dan superadmin update data profile
const update = async (request, adminId) => {
  const updateRequest = validate(adminUpdateValidation, request);
  const id = parseInt(adminId);
  const isEmailDuplicate = await prismaClient.admin.count({
    where: {
      email: updateRequest.email,
    },
  });

  if (isEmailDuplicate === 1) throw new ResponseError(400, "Email Sudah ada");

  // get data lama
  const oldData = await prismaClient.admin.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      password: true,
    },
  });

  if (!oldData) throw new ResponseError(404, "Admin tidak ditemukan");

  // kondisi jika admin hanya update beberapa field
  // jika name diupdate, pakai data baru jika tidak pakai data lama dari oldData
  const newName = updateRequest.name ? updateRequest.name : oldData.name;
  const newEmail = updateRequest.email ? updateRequest.email : oldData.email;
  const newPass = updateRequest.pas
    ? await bcrypt.hash(updateRequest.pass, 10)
    : oldData.pass;

  return prismaClient.admin.update({
    data: {
      name: newName,
      email: newEmail,
      password: newPass,
    },
    where: {
      id,
    },
  });
};

// service untuk admin menambahkan employee
const create = async (request, admin) => {
  const createRequest = validate(createAdminValidation, request);

  const isNipDuplicate = await prismaClient.employee.count({
    where: {
      nip: createRequest.nip,
    },
  });
  const isEmailDuplicate = await prismaClient.employee.count({
    where: {
      email: createRequest.email,
    },
  });

  if (isNipDuplicate === 1) throw new ResponseError(400, "NIP Sudah ada");
  if (isEmailDuplicate === 1) throw new ResponseError(400, "Email Sudah ada");

  return prismaClient.employee.create({
    data: {
      name: createRequest.name,
      nip: createRequest.nip,
      email: createRequest.email,
      password: await bcrypt.hash("#WGSmember", 10), // password default
      role: createRequest.role,
      departmen: createRequest.departmen,
      join_date: createRequest.join_date,
      quit_date: createRequest.quit_date,
      admin_id: admin.id,
    },
    select: {
      name: true,
      nip: true,
      email: true,
      role: true,
      departmen: true,
      join_date: true,
      quit_date: true,
    },
  });
};

export default { login, regist, logout, reset, get, create, update };
