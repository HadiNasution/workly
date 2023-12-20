import multer from "multer";
import path from "path";
import fs from "fs";

// Fungsi untuk menghapus file lama
const deleteOldFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting old file:", err);
    } else {
      console.log("Old file deleted successfully");
    }
  });
};

// Konfigurasi Multer untuk menangani upload file
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Menyimpan file di folder 'uploads'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Menghapus file lama sebelum menyimpan yang baru
    if (req.employee.picture) {
      const oldFilePath = path.join("./", req.employee.picture);
      deleteOldFile(oldFilePath);
    }

    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
// Fungsi untuk memfilter format file
export const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["jpg", "jpeg", "png"];
  const fileExt = path
    .extname(file.originalname)
    .toLowerCase()
    .replace(".", "");

  if (allowedFileTypes.includes(fileExt)) {
    cb(null, true); // File diizinkan
  } else {
    cb(
      new Error(
        "Format file tidak diizinkan. Hanya file dengan ekstensi jpg, jpeg, atau png yang diizinkan."
      )
    );
  }
};
