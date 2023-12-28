import { ResponseError } from "../error/response-error.js";

const currentDate = new Date();
const localCurrentTime = currentDate.toLocaleString();
const errorMiddleware = async (err, req, res, next) => {
  // jika tidak mendapati error maka next() dan tidak menjalankan kode dibawahnya
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    // jika error didapati dari ResponseError
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    // jika mendapati error yang tidak bisa dihandle
    const note = `Error server, status 500 - ${err.message}. Pada: ${localCurrentTime}.`;
    await prismaClient.log.create({
      data: {
        date: currentDate,
        note,
        is_error: true,
      },
    });
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { errorMiddleware };
