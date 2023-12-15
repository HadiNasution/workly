import multer from "multer";
import path from "path";

// Konfigurasi Multer untuk menangani upload file
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Menyimpan file di folder 'uploads'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
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
