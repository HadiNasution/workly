import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  employeeLoginValidation,
  employeeGetValidation,
} from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";

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
    const expirationTime = addMinutes(currentDate, 60);

    const newToken = uuid().toString();

    return prismaClient.employee.update({
      data: {
        token: newToken,
        token_expires_at: expirationTime,
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
    },
  });
};

export default { login, logout };
