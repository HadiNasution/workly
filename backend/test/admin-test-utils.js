import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";

export const removeTestAdmin = async () => {
  await prismaClient.admin.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const createTestAdmin = async () => {
  await prismaClient.admin.create({
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

export const getTestAdmin = async () => {
  return prismaClient.admin.findUnique({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const removeAllTestAdmin = async () => {
  await prismaClient.admin.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};
