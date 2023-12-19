import { prismaClient } from "../app/database.js";

// Untuk autentikasi token dari req header
export const adminAuthMiddleware = async (req, res, next) => {
  // ambil token dari req header -> Authotization
  const token = req.get("Authorization");
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Token tidak valid",
      })
      .end();
  } else {
    // jika token valid, ambil data user di DB via token (untuk mendapatkan email)
    const admin = await prismaClient.admin.findFirst({
      where: {
        token: token,
      },
    });
    if (!admin) {
      res
        .status(401)
        .json({
          errors: "Pengguna tidak ada",
        })
        .end();
    } else {
      req.admin = admin; // jika semua valid, tambahkan data admin ke req
      next();
    }
  }
};
