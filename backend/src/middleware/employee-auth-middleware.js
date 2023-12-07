import { prismaClient } from "../app/database.js";

// Untuk autentikasi token dari req header
export const employeeAuthMiddleware = async (req, res, next) => {
  // ambil token dari req header -> Authotization
  const token = req.get("Authorization");
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    // jika token valid, ambil data user di DB via token (untuk mendapatkan email)
    const employee = await prismaClient.employee.findFirst({
      where: {
        token: token,
      },
    });
    if (!employee) {
      res
        .status(401)
        .json({
          errors: "Unauthorized",
        })
        .end();
    } else {
      req.employee = employee; // jika semua valid, tambahkan data user ke req
      next();
    }
  }
};
