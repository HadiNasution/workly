import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";
import { getTestAdmin } from "./admin-test-utils.js";

export const removeTestEmployee = async () => {
  await prismaClient.employee.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const createTestEmployee = async () => {
  const admin = await getTestAdmin();
  await prismaClient.employee.create({
    data: {
      name: "test",
      nip: "11111111",
      email: "test@gmail.com",
      password: await bcrypt.hash("rahasia", 10),
      token: "test",
      token_expires_at: new Date(),
      admin_id: admin.id,
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
