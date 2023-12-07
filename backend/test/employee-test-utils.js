import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";

export const removeTestEmployee = async () => {
  await prismaClient.employee.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const createTestEmployee = async () => {
  await prismaClient.employee.create({
    data: {
      nip: "11111111",
      name: "test",
      email: "test@gmail.com",
      password: await bcrypt.hash("rahasia", 10),
      token: "test",
      token_expires_at: new Date(),
      is_super_admin: false,
    },
  });
};

export const getTestEmployee = async () => {
  return prismaClient.employee.findUnique({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const removeAllTestEmployee = async () => {
  await prismaClient.employee.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};
