import React from "react";

export default function Modal({ data }) {
  const closeModal = () => {
    document.getElementById("modal-reset-password").style.display = "none";
  };

  // jika data tersedia, modal akan muncul jika tidak modal tidak akan muncul
  return data ? (
    <div
      id="modal-reset-password"
      className="modal bg-body-secondary"
      style={{ display: "block" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Reset Password Berhasil</h3>
          </div>
          <div className="modal-body">
            <p>Gunakan password sementara ini untuk login : </p>
            <h2 className="p-3 mb-2 bg-success text-white rounded text-warning fw-bolder">
              {data && <p>{data}</p>}
            </h2>
            <p>Segera ganti password anda setelah berhasil login.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={closeModal}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
