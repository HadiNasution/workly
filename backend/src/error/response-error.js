// untuk mendapatkan status dan pesan error bawaan dari JS (class Error)
class ResponseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// tinggal throw ResponseError yang akan ditangkap di middleware lalu dikonversi berdasarkan
// status dan message dari sini
export { ResponseError };
