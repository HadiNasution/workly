import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
} from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { generate } from "random-words";

const login = async (request) => {
  const loginRequest = validate(employeeLoginValidation, request);

  const employee = await prismaClient.employee.findUnique({
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

  if (!employee) throw new ResponseError(401, "Wrong email");

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    employee.password
  );

  if (!isPasswordValid) throw new ResponseError(401, "Wrong password");

  const currentDate = new Date();
  if (!employee.token_expires_at || currentDate > employee.token_expires_at) {
    const expirationTime = addMinutes(currentDate, 120);
    const timeZone = "Asia/Jakarta";

    const localizedExpirationTime = utcToZonedTime(expirationTime, timeZone);

    const formattedExpirationTime = format(
      localizedExpirationTime,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      { timeZone }
    );

    const newToken = uuid().toString();

    return prismaClient.employee.update({
      data: {
        token: newToken,
        token_expires_at: formattedExpirationTime,
      },
      where: {
        email: employee.email,
      },
      select: {
        token: true,
        token_expires_at: true,
      },
    });
  }

  return prismaClient.employee.findUnique({
    where: {
      email: employee.email,
    },
    select: {
      token: true,
      token_expires_at: true,
    },
  });
};

const logout = async (email) => {
  email = validate(employeeGetValidation, email);

  const isEmailExist = await prismaClient.employee.findUnique({
    where: {
      email: email,
    },
  });

  if (!isEmailExist) throw new ResponseError(400, "Employee tidak ditemukan");

  return prismaClient.employee.update({
    where: {
      email: email,
    },
    data: {
      token: null,
      token_expires_at: null,
    },
  });
};

const reset = async (request) => {
  const resetRequest = validate(employeeResetValidation, request);
  const isAccountExist = await prismaClient.admin.count({
    where: {
      name: resetRequest.name,
      nip: resetRequest.nip,
      email: resetRequest.email,
    },
  });

  if (!isAccountExist) throw new ResponseError(400, "Akun tidak terdaftar");

  const dummyPass = generate({ minLength: 6, maxLength: 10 });

  await prismaClient.employee.update({
    data: {
      password: await bcrypt.hash(dummyPass, 10),
    },
    where: {
      email: resetRequest.email,
    },
  });

  return dummyPass;
};

export default { login, logout, reset };
